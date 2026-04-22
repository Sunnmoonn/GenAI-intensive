---
name: kopirka
description: Создавай и развивай веб-приложение "Копирка" — клон Firecrawl Lite, который конвертирует URL в чистый markdown, JSON, ссылки и summary. Используй этот skill при работе над проектом Копирка: frontend, backend, логика извлечения контента и QA. Держи проект намеренно узким и не расширяй до полного crawl сайтов, поисковых движков или enterprise-функций без явного запроса.
---

# Цель
Сфокусированное веб-приложение:
- Input: один URL
- Output вкладки: Markdown, JSON, Summary, Links
- Быстрый, минималистичный, полированный UX

# Правила продукта
- Держи scope узким — это одно веб-приложение, не инфраструктура для скрапинга
- Предпочитай простую архитектуру платформенному мышлению
- Реализуй минимально полезную версию каждой фичи
- Смотри references/ для деталей по продукту, архитектуре и UI

# Технологический стек по умолчанию
- Next.js + Tailwind
- Next.js API routes
- Cheerio — парсинг HTML
- Playwright — fallback для JS-rendered страниц
- Turndown — HTML → Markdown
- Claude / OpenAI API — Summary
- SQLite на старте, затем Postgres

# Workflow
1. Уточни, какая фича строится
2. Проверь, входит ли она в MVP scope (см. references/product-scope.md)
3. Реализуй минимально полезную версию
4. Протестируй: happy path + невалидный URL + timeout + пустая экстракция
5. Держи UI чистым и production-like

# UX правила
- Один главный input для URL
- Одна основная CTA-кнопка (Convert)
- Вкладки для форматов результата: Markdown, JSON, Summary, Links
- Кнопки Copy / Download на каждой вкладке
- Видимые loading и error состояния

# Non-goals
- Авторизация, команды, биллинг
- Полный crawl всего сайта
- Поиск по интернету
- Agent workflows / browser automation
- Enterprise proxy / anti-bot системы
- Сложная инфраструктура
