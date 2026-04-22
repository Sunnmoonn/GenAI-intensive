from ultralytics import YOLO

model = YOLO("LegoDuplo31.pt")

model.predict(source="4.jpg", show=True, save=True)

import cv2, numpy as np

# OpenCV HSV: H=[0..179], S=[0..255], V=[0..255]
def guess_color(hsv_roi):
    # Игнорируем фон: берём только «насыщенные» пиксели (цветные)
    mask = (hsv_roi[:,:,1] > 40) & (hsv_roi[:,:,2] > 40)
    sel = hsv_roi[mask]
    if sel.size < 100:  # если мало цветных пикселей, берём всё
        sel = hsv_roi.reshape(-1,3)

    H = int(np.median(sel[:,0]))
    S = int(np.median(sel[:,1]))
    V = int(np.median(sel[:,2]))

    # Серые/чёрно-белые сначала:
    if V < 50:  return "black"
    if S < 25 and V > 200: return "white"
    if S < 25:  return "gray"

    # Цветовые диапазоны (еще подстроить надо)
    if (H <= 10) or (H >= 170): return "red"
    if 11 <= H <= 24: return "orange"   # коричневый — тёмный оранжевый
    if 25 <= H <= 35: return "yellow"
    if 36 <= H <= 85: return "green"
    if 86 <= H <= 95: return "cyan"
    if 96 <= H <= 130: return "blue"
    if 131 <= H <= 160: return "purple"

    # «Коричневый» как тёмный оранжевый
    if 10 <= H <= 25 and S > 80 and V < 140:
        return "brown"

    return "unknown"

# Пример интеграции с Ultralytics
results = model.predict(source="4.jpg", imgsz=896, conf=0.35, iou=0.45)
img = cv2.imread("4.jpg")

for r in results:
    for b in r.boxes:
        x1,y1,x2,y2 = map(int, b.xyxy[0].tolist())
        roi = img[max(0,y1):y2, max(0,x1):x2]
        if roi.size == 0:
            continue
        hsv = cv2.cvtColor(roi, cv2.COLOR_BGR2HSV)
        col = guess_color(hsv)

        # имя типа (без цвета)
        name = r.names[int(b.cls[0])] if isinstance(r.names, dict) else model.names[int(b.cls[0])]

        # вывод типа фигуры вместе с цветом через _:
        label = f"{name}_{col}" if col != "unknown" else name
        # тут выведи/нарисуй label как тебе нужно
        print(label, float(b.conf[0]))