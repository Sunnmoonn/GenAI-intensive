# Архитектура: Копирка

## Технологический стек

| Слой | Технология |
|------|-----------|
| Frontend | Next.js + Tailwind |
| Backend | Next.js API routes |
| JS rendering | Playwright (fallback) |
| HTML parsing | Cheerio |
| HTML → Markdown | Turndown |
| Summary | Claude API / OpenAI API |
| База данных | SQLite → Postgres |
| Хранение файлов | Локально / object storage |

---

## API Endpoints

```
POST /api/convert     — основной: URL → markdown, JSON, links
POST /api/summarize   — генерация summary через LLM
POST /api/map         — карта URL сайта (V2)
POST /api/crawl       — обход домена (V2)
```

---

## Pipeline обработки URL

### 1. Validation layer
- Проверка корректности URL
- Нормализация
- Защита от некорректных схем (file://, localhost и т.д.)

### 2. Fetch / Render layer
- Обычный HTTP fetch для простых HTML-страниц
- Fallback на Playwright для JS-rendered страниц
- Playwright: дождаться рендера → взять `document.body.innerHTML`

### 3. Content extraction layer
- Выделение main content через heuristic: `article`, `main`, `[role=main]`, самый "текстовый" контейнер
- Удаление шума: `script`, `style`, `nav`, `footer`, cookie/popups по классам
- Извлечение: title, headings, links

### 4. Transformation layer
- HTML → Markdown (Turndown)
- HTML → JSON (структурированный объект)
- Text → Summary (через LLM API)

### 5. Response layer
- Возвращает frontend готовые форматы одним объектом

---

## Модель данных

### Таблица `jobs`
| Поле | Тип | Описание |
|------|-----|----------|
| id | uuid | PK |
| url | text | Исходный URL |
| status | enum | pending / processing / done / error |
| created_at | timestamp | Время создания |
| processing_time_ms | int | Время обработки |

### Таблица `results`
| Поле | Тип | Описание |
|------|-----|----------|
| job_id | uuid | FK → jobs |
| title | text | Заголовок страницы |
| markdown | text | Чистый markdown |
| json | jsonb | Структурированные данные |
| summary | text | AI-summary |
| links_count | int | Количество найденных ссылок |

### Таблица `history`
| Поле | Тип | Описание |
|------|-----|----------|
| user_session_id | text | ID сессии пользователя |
| url | text | Обработанный URL |
| last_opened_at | timestamp | Дата последнего открытия |

---

## JSON output format

```json
{
  "url": "https://example.com/article",
  "title": "Article Title",
  "content": "Clean text content...",
  "headings": ["Heading 1", "Heading 2"],
  "links": [
    { "text": "Link text", "href": "https://..." }
  ]
}
```

---

## Структура проекта (Next.js)

```
kopirka/
├── app/
│   ├── page.tsx              — главная страница
│   ├── api/
│   │   ├── convert/route.ts  — основной endpoint
│   │   └── summarize/route.ts
├── components/
│   ├── UrlInput.tsx
│   ├── ResultTabs.tsx
│   ├── MarkdownView.tsx
│   ├── JsonView.tsx
│   ├── SummaryView.tsx
│   ├── LinksView.tsx
│   └── HistoryList.tsx
├── lib/
│   ├── fetch.ts              — fetch + Playwright fallback
│   ├── extract.ts            — Cheerio extraction pipeline
│   ├── transform.ts          — HTML → Markdown, JSON
│   └── db.ts                 — SQLite / Postgres client
└── public/
```
