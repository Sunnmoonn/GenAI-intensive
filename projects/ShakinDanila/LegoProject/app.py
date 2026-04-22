import os
import time
import threading
from typing import Optional, Tuple

import cv2
import numpy as np
from flask import Flask, Response, render_template_string, request, jsonify
from ultralytics import YOLO


# ==========================
# Конфигурация
# ==========================
IP_WEBCAM_HOST = "192.168.1.68"
IP_WEBCAM_PORT = 8080

IP_STREAM_URL = f"http://{IP_WEBCAM_HOST}:{IP_WEBCAM_PORT}/video"      # основной MJPEG
IP_SNAPSHOT_URL = f"http://{IP_WEBCAM_HOST}:{IP_WEBCAM_PORT}/shot.jpg" # покадрово

MODEL_PATH = "LegoDuplo31.pt"
IMGSZ = 640          # меньше → быстрее (416/448/512 — хорошие варианты)
CONF = 0.45
IOU = 0.60
VID_STRIDE = 1       # пропуск кадров при инференсе (1 = каждый кадр, 2 = каждый второй и т.д.)

DEFAULT_STREAM_W = 960
DEFAULT_JPEG_Q = 75
STREAM_FPS = 25.0    # ограничение отдачи, чтобы браузер не портил кадры


# ==========================
# Flask UI
# ==========================
app = Flask(__name__)

PAGE_HTML = """
<!doctype html>
<html lang="ru">
<head>
  <meta charset="utf-8" />
  <title>LEGO Duplo — YOLO RT (Low Latency)</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body { font-family: system-ui, -apple-system, Segoe UI, Roboto, sans-serif; margin: 24px; }
    .controls { display:flex; gap:12px; margin-bottom:16px; align-items:center; flex-wrap:wrap; }
    button { padding:10px 16px; border:0; border-radius:10px; cursor:pointer; font-weight:600; }
    .start { background:#3b82f6; color:#fff; }
    .stop { background:#ef4444; color:#fff; }
    .status { font-size:14px; color:#555; }
    img { max-width:100%; border-radius:12px; box-shadow:0 8px 20px rgba(0,0,0,.12); }
    input[type=number]{ width:100px; padding:8px; border-radius:8px; border:1px solid #ddd;}
    label{font-size:14px;color:#333}
  </style>
</head>
<body>
  <h1>LEGO Duplo — детекция в реальном времени (низкая задержка)</h1>
  <div class="controls">
    <button class="start" onclick="start()">Start</button>
    <button class="stop" onclick="stop()">Stop</button>
    <span class="status">Статус: <b id="state">stopped</b></span>
    <label>Ширина (w): <input type="number" id="w" value="960" min="240" max="1920" step="40"/></label>
    <label>JPEG (q): <input type="number" id="q" value="75" min="40" max="95" step="1"/></label>
    <button onclick="applySize()">Применить</button>
  </div>
  <img id="stream" src="/stream.mjpg?w=960&q=75" alt="stream here" />
<script>
async function start(){
  const r = await fetch('/start',{method:'POST'}); const j = await r.json();
  document.getElementById('state').textContent = j.state; bust();
}
async function stop(){
  const r = await fetch('/stop',{method:'POST'}); const j = await r.json();
  document.getElementById('state').textContent = j.state;
}
function applySize(){
  const w = document.getElementById('w').value || 960;
  const q = document.getElementById('q').value || 75;
  const img = document.getElementById('stream');
  img.src = `/stream.mjpg?w=${w}&q=${q}&ts=` + Date.now();
}
function bust(){
  const img = document.getElementById('stream');
  const u = new URL(img.src, window.location.origin);
  u.searchParams.set('ts', Date.now());
  img.src = u.toString();
}
</script>
</body>
</html>
"""


# ==========================
# Вспомогательное
# ==========================
def guess_color(hsv_roi: np.ndarray) -> str:
    mask = (hsv_roi[:, :, 1] > 40) & (hsv_roi[:, :, 2] > 40)
    sel = hsv_roi[mask]
    if sel.size < 100:
        sel = hsv_roi.reshape(-1, 3)
    H = int(np.median(sel[:, 0])); S = int(np.median(sel[:, 1])); V = int(np.median(sel[:, 2]))
    if V < 50: return "black"
    if S < 25 and V > 200: return "white"
    if S < 25: return "gray"
    if (H <= 10) or (H >= 170): return "red"
    if 11 <= H <= 24: return "orange"
    if 25 <= H <= 35: return "yellow"
    if 36 <= H <= 85: return "green"
    if 86 <= H <= 95: return "cyan"
    if 96 <= H <= 130: return "blue"
    if 131 <= H <= 160: return "purple"
    if 10 <= H <= 25 and S > 80 and V < 140: return "brown"
    return "unknown"


# ==========================
# Потоки: граббер и инференс
# ==========================
class LowLatencyPipeline:
    """
    Граббер читает ВСЕГДА и хранит только последний кадр.
    Инференс берёт только актуальный кадр (если занят — пропускает накопившиеся),
    но НЕ перезаписывает последний аннотированный кадр пустыми изображениями.
    """
    def __init__(self, model_path: str, stream_url: str, snapshot_url: str,
                 imgsz: int, conf: float, iou: float, vid_stride: int):
        self.model_path = model_path
        self.stream_url = stream_url
        self.snapshot_url = snapshot_url
        self.imgsz = imgsz
        self.conf = conf
        self.iou = iou
        self.vid_stride = max(1, int(vid_stride))

        self.model: Optional[YOLO] = None
        self.device = "cpu"

        self.running = False

        self.raw_lock = threading.Lock()
        self.raw_latest: Optional[np.ndarray] = None

        self.ann_lock = threading.Lock()
        self.ann_latest: Optional[np.ndarray] = None

        self.t_grab: Optional[threading.Thread] = None
        self.t_infer: Optional[threading.Thread] = None

        self.cap: Optional[cv2.VideoCapture] = None
        self.is_mjpeg = True

    def _init_model(self):
        self.model = YOLO(self.model_path)
        try:
            import torch
            self.device = "mps" if torch.backends.mps.is_available() else "cpu"
        except Exception:
            self.device = "cpu"
        print(f"[YOLO] device: {self.device}")

    def _open_capture(self) -> Tuple[cv2.VideoCapture, bool]:
        cap = cv2.VideoCapture(self.stream_url)
        try:
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        except Exception:
            pass
        if cap.isOpened():
            return cap, True
        cap = cv2.VideoCapture(self.snapshot_url)
        try:
            cap.set(cv2.CAP_PROP_BUFFERSIZE, 1)
        except Exception:
            pass
        return cap, False

    def _flush_buffer(self, cap: cv2.VideoCapture, frames: int = 8):
        for _ in range(frames):
            cap.read()

    def start(self):
        if self.running:
            return
        if self.model is None:
            self._init_model()
        self.cap, self.is_mjpeg = self._open_capture()
        if not self.cap or not self.cap.isOpened():
            print("[Stream] Не удалось открыть источник видео.")
            return
        self._flush_buffer(self.cap, 8)

        self.running = True
        self.t_grab = threading.Thread(target=self._grab_loop, daemon=True)
        self.t_infer = threading.Thread(target=self._infer_loop, daemon=True)
        self.t_grab.start()
        self.t_infer.start()

    def stop(self):
        self.running = False
        if self.t_grab and self.t_grab.is_alive():
            self.t_grab.join(timeout=1.5)
        if self.t_infer and self.t_infer.is_alive():
            self.t_infer.join(timeout=1.5)
        if self.cap:
            self.cap.release()
        self.cap = None

    def _grab_loop(self):
        snapshot_sleep = 0.03
        while self.running and self.cap:
            ok, frame = self.cap.read()
            if not ok or frame is None:
                time.sleep(0.2)
                self.cap.release()
                self.cap, self.is_mjpeg = self._open_capture()
                continue
            with self.raw_lock:
                self.raw_latest = frame
            if not self.is_mjpeg:
                time.sleep(snapshot_sleep)

    def _infer_loop(self):
        frame_counter = 0
        while self.running:
            with self.raw_lock:
                frame = None if self.raw_latest is None else self.raw_latest.copy()
            if frame is None:
                time.sleep(0.005)
                continue

            # пропуск кадров без трогания ann_latest
            frame_counter = (frame_counter + 1) % self.vid_stride
            if frame_counter != 0:
                time.sleep(0.001)
                continue

            try:
                results = self.model.predict(
                    source=frame,
                    imgsz=self.imgsz,
                    conf=self.conf,
                    iou=self.iou,
                    device=self.device,
                    verbose=False
                )
            except Exception as e:
                print(f"[YOLO] predict error: {e}")
                results = []

            annotated = frame
            if results:
                r0 = results[0]
                names = r0.names if isinstance(r0.names, dict) else getattr(self.model, "names", {})
                if hasattr(r0, "boxes") and r0.boxes is not None:
                    for b in r0.boxes:
                        try:
                            x1, y1, x2, y2 = map(int, b.xyxy[0].tolist())
                            conf = float(b.conf[0])
                            cls_id = int(b.cls[0])

                            roi = annotated[max(0, y1):y2, max(0, x1):x2]
                            label_txt = names.get(cls_id, str(cls_id))
                            if roi.size > 0:
                                hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
                                col = guess_color(hsv)
                                if col != "unknown":
                                    label_txt = f"{label_txt}_{col}"

                            # более заметные боксы/лейблы
                            cv2.rectangle(annotated, (x1, y1), (x2, y2), (0, 255, 0), 3)
                            caption = f"{label_txt} {conf:.2f}"
                            (tw, th), _ = cv2.getTextSize(caption, cv2.FONT_HERSHEY_SIMPLEX, 0.7, 2)
                            cv2.rectangle(annotated, (x1, y1 - th - 10), (x1 + tw + 8, y1), (0, 255, 0), -1)
                            cv2.putText(annotated, caption, (x1 + 4, y1 - 6),
                                        cv2.FONT_HERSHEY_SIMPLEX, 0.7, (0, 0, 0), 2)
                        except Exception:
                            continue

            with self.ann_lock:
                self.ann_latest = annotated

    def get_last_annotated(self) -> Optional[np.ndarray]:
        with self.ann_lock:
            if self.ann_latest is None:
                return None
            return self.ann_latest.copy()


pipeline = LowLatencyPipeline(
    model_path=MODEL_PATH,
    stream_url=IP_STREAM_URL,
    snapshot_url=IP_SNAPSHOT_URL,
    imgsz=IMGSZ,
    conf=CONF,
    iou=IOU,
    vid_stride=VID_STRIDE
)


# ==========================
# Flask маршруты
# ==========================
@app.route("/")
def index():
    return render_template_string(PAGE_HTML)


@app.post("/start")
def start_stream():
    pipeline.start()
    return jsonify({"state": "running"})


@app.post("/stop")
def stop_stream():
    pipeline.stop()
    return jsonify({"state": "stopped"})


@app.get("/stream.mjpg")
def stream_mjpg():
    # параметры рендеринга
    try:
        target_w = int(request.args.get("w", DEFAULT_STREAM_W))
    except ValueError:
        target_w = DEFAULT_STREAM_W
    target_w = max(240, min(target_w, 1920))

    try:
        jpeg_q = int(request.args.get("q", DEFAULT_JPEG_Q))
    except ValueError:
        jpeg_q = DEFAULT_JPEG_Q
    jpeg_q = max(40, min(jpeg_q, 95))

    target_dt = 1.0 / STREAM_FPS if STREAM_FPS > 0 else 0.0
    last_time = 0.0

    def gen():
        nonlocal last_time
        while True:
            frame = pipeline.get_last_annotated()
            if frame is None:
                time.sleep(0.01)
                continue

            h, w = frame.shape[:2]
            if w > target_w:
                scale = target_w / float(w)
                frame = cv2.resize(frame, (target_w, int(h * scale)), interpolation=cv2.INTER_AREA)

            ok_jpg, buf = cv2.imencode(".jpg", frame, [int(cv2.IMWRITE_JPEG_QUALITY), jpeg_q])
            if not ok_jpg:
                continue

            if target_dt > 0:
                now = time.time()
                dt = now - last_time
                if dt < target_dt:
                    time.sleep(target_dt - dt)
                last_time = time.time()

            yield (b"--frame\r\n"
                   b"Content-Type: image/jpeg\r\n\r\n" + buf.tobytes() + b"\r\n")

    return Response(gen(), mimetype="multipart/x-mixed-replace; boundary=frame")


if __name__ == "__main__":
    port = int(os.getenv("PORT", "5050"))
    app.run(host="0.0.0.0", port=port, debug=False, threaded=True)
