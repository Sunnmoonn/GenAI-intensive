---
name: img
description: Генерирует изображения через kie.ai API. Все модели GEN Studio — Nano Banana, Flux, Seedream, Ideogram, GPT-4o, Z-Image, Grok. Вызывай когда пользователь просит создать/нарисовать изображение, или сам предлагай при работе над визуальным контентом.
---

# Изобразика — генерация изображений через kie.ai

## Конфигурация

Замени плейсхолдеры перед первым использованием:

| Плейсхолдер | Пример | Описание |
|-------------|--------|----------|
| `{{KIE_API_KEY_FILE}}` | `~/.claude/.env.kie` | Файл с `KIE_API_KEY=kie_...` |
| `{{OUTPUT_DIR}}` | `~/images` | Папка для сохранения изображений |

## Триггеры

- «изобразика», «/изобразика»
- «создай изображение», «нарисуй», «инфографика», «иллюстрация», «баннер»
- При работе над сайтом/презентацией — предлагай генерацию сам

---

## Доступные модели

| ID | Название | Цена | Когда использовать |
|----|----------|------|-------------------|
| `nano-banana` | **Nano Banana (Gemini 2.5)** | ~$0.02 | **По умолчанию.** Дёшево, быстро, хорошее качество |
| `nano-banana-pro` | Nano Banana Pro (Gemini 3.0) | $0.09-0.12 | Максимальное качество фото |
| `nano-banana-2` | Nano Banana 2 (Gemini 3.1) | $0.04-0.09 | Мульти-референс (до 14 фото) |
| `flux-kontext` | Flux Kontext (Pro/Max) | $0.04-0.08 | Редактирование, стиль-трансфер |
| `flux-2` | Flux 2 Pro | ~$0.05 | Качественные иллюстрации |
| `seedream` | Seedream (ByteDance) | $0.0175 | Самый дешёвый + быстрый (<2 сек) |
| `ideogram-v3` | Ideogram V3 | $0.0175-0.05 | Лучший для текста на изображении |
| `gpt4o-image` | 4o Image (GPT-4o) | ~$0.03 | Отличный текст, мульти-референс |
| `z-image` | Z-Image (Tongyi) | ~$0.004 | Супер-дешёвый черновик |
| `grok-imagine` | Grok Imagine (xAI) | ~$0.05 | Быстрая генерация |

**Правило выбора:**
- По умолчанию -> `nano-banana`
- Нужен текст на картинке -> `ideogram-v3` или `gpt4o-image`
- Максимальное качество -> `nano-banana-pro`
- Быстрый черновик -> `seedream` или `z-image`
- Редактирование фото -> `flux-kontext`

---

## API

**API-ключ:** `{{KIE_API_KEY_FILE}}`
Формат: `KIE_API_KEY=kie_...`

**API Base:** `https://api.kie.ai`
**Поллинг:** каждые 3 сек, таймаут 120 сек

---

## Алгоритм

### Шаг 1: Определи задачу

- Что генерировать
- Формат: `16:9`, `1:1`, `4:3`
- Нужен ли текст на картинке
- Модель: спроси или используй `nano-banana` по умолчанию

### Шаг 2: Составь промпт

На английском. Включи: тип изображения, сцену, стиль, цветовую палитру. Если нужен текст — укажи его явно с нужным языком. Пример: `Text on image in Russian: "Воображение"`.

### Шаг 3: Генерация

Запиши в `/tmp/gen_kie.py` и запусти `python3 /tmp/gen_kie.py`:

```python
import json, os, time, urllib.request, urllib.error

KEY = open(os.path.expanduser("{{KIE_API_KEY_FILE}}")).read().strip().split("=",1)[1]
OUTDIR = "{{OUTPUT_DIR}}"
os.makedirs(OUTDIR, exist_ok=True)

MODEL_ID  = "nano-banana"
PROMPT    = "..."
ASPECT    = "16:9"
RESOLUTION = "1K"
FILENAME  = "2026-03-02_description.png"

MODELS = {
    "nano-banana": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "google/nano-banana", "input": {
            "prompt": p["prompt"], "image_size": p["aspect"], "resolution": p["res"]}}
    },
    "nano-banana-pro": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "nano-banana-pro", "input": {
            "prompt": p["prompt"], "aspect_ratio": p["aspect"], "resolution": p["res"]}}
    },
    "nano-banana-2": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "nano-banana-2", "input": {
            "prompt": p["prompt"], "aspect_ratio": p["aspect"], "resolution": p["res"]}}
    },
    "flux-kontext": {
        "create": "/api/v1/flux/kontext/generate",
        "status": "/api/v1/flux/kontext/record-info",
        "payload": lambda p: {"prompt": p["prompt"], "model": "flux-kontext-pro", "aspectRatio": p["aspect"]}
    },
    "flux-2": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "flux-2/pro-text-to-image", "input": {
            "prompt": p["prompt"], "aspect_ratio": p["aspect"], "resolution": p["res"]}}
    },
    "seedream": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "bytedance/seedream-v4-text-to-image", "input": {
            "prompt": p["prompt"],
            "image_size": {"16:9":"landscape","9:16":"portrait","1:1":"square_hd","4:3":"landscape","3:4":"portrait"}.get(p["aspect"],"square_hd"),
            "image_resolution": p["res"]}}
    },
    "ideogram-v3": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "ideogram/v3-text-to-image", "input": {
            "prompt": p["prompt"],
            "image_size": {"1:1":"square_hd","16:9":"landscape_16_9","4:3":"landscape_4_3","3:4":"portrait_4_3","9:16":"portrait_16_9"}.get(p["aspect"],"square_hd"),
            "rendering_speed": "BALANCED", "style": "AUTO"}}
    },
    "gpt4o-image": {
        "create": "/api/v1/gpt4o-image/generate",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"prompt": p["prompt"], "size": p["aspect"]}
    },
    "z-image": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "z-image", "input": {"prompt": p["prompt"], "aspect_ratio": p["aspect"]}}
    },
    "grok-imagine": {
        "create": "/api/v1/jobs/createTask",
        "status": "/api/v1/jobs/recordInfo",
        "payload": lambda p: {"model": "grok-imagine/text-to-image", "input": {
            "prompt": p["prompt"], "aspect_ratio": p["aspect"]}}
    },
}

m = MODELS[MODEL_ID]
payload = m["payload"]({"prompt": PROMPT, "aspect": ASPECT, "res": RESOLUTION})

# --- Create task ---
url = f"https://api.kie.ai{m['create']}"
req = urllib.request.Request(url, json.dumps(payload).encode(),
    {"Content-Type": "application/json", "Authorization": f"Bearer {KEY}"})
try:
    with urllib.request.urlopen(req, timeout=30) as r:
        resp = json.loads(r.read().decode())
except urllib.error.HTTPError as e:
    print(f"HTTP {e.code}: {e.read().decode()}"); exit(1)

if resp.get("code") != 200:
    print(f"API error: {resp.get('msg', resp)}"); exit(1)

task_id = resp["data"]["taskId"]
print(f"Task: {task_id}")

# --- Poll ---
status_url = f"https://api.kie.ai{m['status']}?taskId={task_id}"
for i in range(40):
    time.sleep(3)
    with urllib.request.urlopen(urllib.request.Request(status_url,
            headers={"Authorization": f"Bearer {KEY}"}), timeout=15) as r:
        sd = json.loads(r.read().decode())
    d = sd.get("data", {})
    sf = d.get("successFlag")
    state = {0:"processing",1:"success",2:"fail",3:"fail"}.get(sf, d.get("state", d.get("status","?"))) if sf is not None else d.get("state", d.get("status","?"))
    if state == "processing":
        print(f"  [{i+1}] processing..."); continue
    if state == "fail":
        print(f"FAIL: {json.dumps(d,ensure_ascii=False)[:400]}"); exit(1)
    if state == "success":
        rj = d.get("resultJson")
        r2 = json.loads(rj) if isinstance(rj, str) and rj else (rj or d.get("result") or {})
        urls = r2.get("resultUrls", []) if isinstance(r2, dict) else []
        img_url = (urls[0] if urls else None) or r2.get("resultImageUrl") or r2.get("url") or d.get("response", {}).get("resultImageUrl") or d.get("url")
        if not img_url:
            print(f"No URL: {json.dumps(d,ensure_ascii=False)[:400]}"); exit(1)
        print(f"URL: {img_url}")
        OUT = os.path.join(OUTDIR, FILENAME)
        dl_req = urllib.request.Request(img_url, headers={
            "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
            "Referer": "https://kie.ai/"
        })
        with urllib.request.urlopen(dl_req, timeout=60) as r:
            img_bytes = r.read()
        # Автодетект формата по magic bytes (kie.ai часто отдаёт JPEG как .png)
        if img_bytes[:3] == b'\xff\xd8\xff':
            real_ext = ".jpg"
        elif img_bytes[:8] == b'\x89PNG\r\n\x1a\n':
            real_ext = ".png"
        else:
            real_ext = os.path.splitext(FILENAME)[1] or ".png"
        requested_ext = os.path.splitext(FILENAME)[1]
        if real_ext != requested_ext:
            OUT = os.path.splitext(OUT)[0] + real_ext
            print(f"Format mismatch: requested {requested_ext}, actual {real_ext} -> saving as {os.path.basename(OUT)}")
        with open(OUT, "wb") as f:
            f.write(img_bytes)
        print(f"OK {OUT} ({os.path.getsize(OUT)//1024} KB)")
        exit(0)
    print(f"  [{i+1}] state={state}")

print("Timeout"); exit(1)
```

### Шаг 4: Показ результата

Read файла — Claude показывает изображение прямо в чате.

---

## Типичные ошибки

| Ошибка | Решение |
|--------|---------|
| HTTP 401/403 | Невалидный KIE_API_KEY |
| HTTP 429 | Rate limit, подожди 10 сек |
| code != 200 | Неверный payload для модели |
| Timeout | Смени на `seedream` или `z-image` |
| Текст кривой | Используй `ideogram-v3` или `gpt4o-image` |
| gpt4o-image — нет 16:9 | Только 1:1, 3:2, 2:3 |
