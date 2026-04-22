# How-to: Kopirka

Практическое руководство по локальному запуску, разработке и деплою проекта.

---

## 1. Требования к окружению

| Инструмент | Минимальная версия |
|---|---|
| Node.js | 20.9+ |
| npm | 9+ |
| Git | любая актуальная |

---

## 2. Локальный запуск

```bash
# Клонировать репозиторий
git clone https://github.com/DanydeDeveloper/kopirka.git
cd kopirka

# Установить зависимости
npm install

# Запустить dev-сервер
npm run dev
```

Приложение будет доступно по адресу `http://localhost:3000`.

---

## 3. Использование приложения

1. Вставить любой URL в поле ввода (протокол `https://` необязателен — добавляется автоматически).
2. Нажать **Convert →**.
3. Дождаться результата (обычно 1–3 секунды).
4. Переключаться между вкладками:

| Вкладка | Содержимое |
|---|---|
| **Markdown** | Чистый markdown без HTML-шума |
| **JSON** | Структурированный объект: title, headings, links, content |
| **Summary** | Экстрактивное резюме из 5 ключевых предложений |
| **Links** | Все ссылки страницы с тегами `int` / `ext` |
| **Clone ✦** | Готовый промпт для воссоздания страницы через LLM |

5. Использовать кнопки **Copy** / **Download** для экспорта результата.
6. История последних 10 URL сохраняется в `localStorage` и доступна внизу страницы.

---

## 4. Включение Playwright (опционально)

По умолчанию приложение использует статический HTTP-fetch. Для поддержки страниц, требующих выполнения JavaScript:

```bash
npm install playwright
npx playwright install chromium
```

После этого Playwright автоматически активируется как fallback, если статический ответ содержит менее 300 символов текста.

---

## 5. Переменные окружения

Приложение работает без `.env` в MVP-режиме. При необходимости интеграции с LLM:

```env
# .env.local
OPENAI_API_KEY=sk-...        # для OpenAI-based summary (будущая версия)
ANTHROPIC_API_KEY=sk-ant-... # для Claude-based summary (будущая версия)
```

Точка расширения — функция `generateSummary` в `lib/summarizer.ts`.

---

## 6. Сборка и проверка

```bash
# Проверить типы
npx tsc --noEmit

# Production-сборка
npm run build

# Запуск production-сервера локально
npm start
```

---

## 7. Деплой

### Автоматический (рекомендуемый)

Любой `git push` в ветку `main` автоматически запускает новый деплой на Vercel.

```bash
git add .
git commit -m "feat: ..."
git push
```

### Ручной

```bash
npx vercel deploy --prod
```

---

## 8. Структура проекта

```
kopirka/
├── app/
│   ├── page.tsx              — главная страница (Client Component)
│   ├── layout.tsx            — корневой layout с метаданными
│   ├── globals.css           — базовые стили + скроллбары
│   └── api/scrape/route.ts   — POST /api/scrape
├── components/
│   ├── UrlInput.tsx
│   ├── ResultPanel.tsx       — табы + переключение
│   ├── HistoryPanel.tsx
│   ├── tabs/                 — Markdown, JSON, Summary, Links, Clone
│   └── ui/CopyButton.tsx
├── lib/
│   ├── types.ts              — общие TypeScript-интерфейсы
│   ├── validate.ts           — валидация и нормализация URL
│   ├── fetcher.ts            — HTTP fetch + Playwright fallback
│   ├── extractor.ts          — Cheerio: извлечение контента
│   ├── transformer.ts        — HTML → Markdown (Turndown)
│   ├── summarizer.ts         — экстрактивная суммаризация
│   ├── clone-prompt.ts       — генерация AI-промпта для клонирования
│   └── playwright-loader.ts  — опциональная загрузка Playwright
└── docs/                     — документация проекта
```
