# Startup Market — Скоринг зарубежных стартапов для поиска идей

Next.js-приложение для систематического мониторинга и оценки зарубежных стартапов на предмет применимости к российскому рынку.

## Что делает

- **Сканирует** YC (Y Combinator), Product Hunt, Crunchbase, Telegram-каналы
- **Скорит** каждый стартап по методологии VENTURE-SCAN RF 2.0 — формула `Score = (M² × T × A × B × P)^(1/6) × 10`
- **Генерирует** еженедельный AI-дайджест трендов через Claude API (Anthropic)
- **Хранит** базу в SQLite (Drizzle ORM), отображает через Next.js UI

## Зачем

Вместо ручного мониторинга сотен стартапов — автоматический пайплайн:
1. Скрейпер собирает новые компании из источников
2. Scoring-алгоритм расставляет приоритеты по 6 факторам (дизрапт, масштабируемость, рынок РФ, трекшн, барьеры, тайминг)
3. Claude `claude-haiku-4-5` генерирует дайджест из Telegram-постов за неделю
4. Топ-кандидаты — отправная точка для поиска проектов под клонирование

## AI-инструменты

| Инструмент | Где используется |
|---|---|
| **Claude API** (`claude-haiku-4-5`) | `lib/news-summary.ts` — еженедельный дайджест из Telegram |
| **Claude Code** | Разработка и рефакторинг приложения |
| **VENTURE-SCAN RF 2.0** | `lib/scoring.ts` — автоматический скоринг каждого стартапа |

## Структура

```
app/              — Next.js App Router (страницы + API routes)
components/       — UI-компоненты (карточка стартапа, фильтры, скор-бар)
lib/              — scoring.ts, news-summary.ts, rankings.ts
scrapers/         — yc.ts, producthunt.ts, crunchbase.ts, telegram.ts
db/               — schema.ts (Drizzle), migrations/
cron/             — планировщик sync + xlsx-импорт
```

## Запуск

```bash
cp .env.example .env.local   # заполнить ANTHROPIC_API_KEY, SYNC_SECRET
npm install
npm run db:migrate
npm run dev
```

## Связь со скиллами

Используется совместно со скиллами из [`../skills/`](../skills/):
- `venture-scan-rf.md` — методология, которую реализует `lib/scoring.ts`
- `firecrawl-market-research.md` — ручной сбор данных по конкурентам
- `benchling-arch-research.md` — глубокий анализ выбранного кандидата после скоринга
