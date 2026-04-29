@AGENTS.md

# Копирка — правила проекта

## Что это
Веб-приложение: вставляешь URL → получаешь чистый текст без мусора.
Прод: https://kopirka.vercel.app

## Стек
- **Frontend/Backend:** Next.js 16, TypeScript, Tailwind CSS v4
- **Парсинг:** Cheerio (вырезает мусор из HTML)
- **Конвертация:** Turndown (HTML → Markdown)
- **JS-сайты:** Playwright как запасной вариант
- **Summary:** экстрактивный алгоритм сейчас, Claude API — следующий шаг
- **Деплой:** Vercel, автодеплой при пуше в main

## Структура проекта
```
app/
  page.tsx              — главная страница
  api/scrape/route.ts   — POST /api/scrape (основной пайплайн)
components/
  UrlInput.tsx          — поле ввода
  ResultPanel.tsx       — вкладки с результатом
  tabs/                 — Markdown, JSON, Summary, Links, Clone
lib/
  validate.ts           — проверка URL
  fetcher.ts            — скачивает страницу
  extractor.ts          — вырезает полезный контент
  transformer.ts        — HTML → Markdown
  summarizer.ts         — краткое содержание
  clone-prompt.ts       — промпт для воссоздания сайта
docs/
  how-to.md             — как запустить
  skills.md             — какие навыки применялись
  kosyaki.md            — задокументированные баги
  resheniya.md          — как решали
  insights.md           — выводы
```

## Правила
- Держи фокус: один URL → один результат. Без краулинга всего сайта
- Новую фичу — сначала минимальная версия, потом улучшение
- Проверяй: обычная ссылка + невалидный URL + медленный сайт

## Важное техническое решение
Playwright подключается через `eval('require')('playwright')` — иначе сборщик (Turbopack) ломается, потому что статически проверяет все зависимости.

## Следующие шаги
1. Подключить Claude API для Summary (ключ в Vercel → `ANTHROPIC_API_KEY`)
2. Извлекать цвета и шрифты страницы для Clone-промпта
3. Перенести историю из браузера на сервер
