# Скилл: Project Clone Workflow — Оглавление

## Триггер

Когда нужно найти зарубежный сервис для клонирования и довести его до рабочего MVP.

## Набор скиллов (6 шагов)

Каждый шаг — отдельный скилл с чек-листом и примером:

| Шаг | Файл | Что делает |
|-----|------|-----------|
| 1 | [`clone-1-search.md`](clone-1-search.md) | Поиск кандидата: скоринг VENTURE-SCAN RF + ручной фильтр по 20+ сервисам |
| 2 | [`clone-2-analysis.md`](clone-2-analysis.md) | Анализ интерфейса и архитектуры через Firecrawl + arch-research |
| 3 | [`clone-3-spec.md`](clone-3-spec.md) | Написание ТЗ: модули, стек, ров |
| 4 | [`clone-4-implementation.md`](clone-4-implementation.md) | Реализация: Claude Code + Cursor + Supabase в правильном порядке |
| 5 | [`clone-5-testing.md`](clone-5-testing.md) | Тестирование: RLS-изоляция, мобильный вид, edge cases |
| 6 | [`clone-6-publish.md`](clone-6-publish.md) | Публикация: GitHub без секретов + Vercel + Supabase prod |

## Пример применения

**Квантара (клон Benchling):**

1. **Поиск** — ниша ELN+LIMS, 22 сервиса оценены вручную через VENTURE-SCAN RF; Benchling выбран как единственный с полным стеком ELN+LIMS+AI, заблокированный санкциями
2. **Анализ** — Firecrawl по benchling.com + `benchling-arch-research`; выявлен React+Redux фронт, Postgres источник истины, moat в данных и switching cost
3. **Спек** — PROJECTCLONE/README.md: 7 модулей, стек React+Supabase, три рва
4. **Реализация** — ~10 рабочих дней: схема БД → 7 страниц → мобильная адаптация
5. **Тестирование** — найден баг `setCurrentUserId` (TypeScript), Gantt потребовал 6 итераций
6. **Публикация** — Vercel + SPA-роутинг, секреты исключены из репо
