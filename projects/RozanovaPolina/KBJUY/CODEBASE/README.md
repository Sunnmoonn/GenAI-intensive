# CODEBASE

Репозиторий: **https://github.com/PolyaRoz/kbzhuy**

---

## Что опубликовано

143 файла — полная кодовая база проекта на момент Фазы 1.

```
kbzhuy/
├── backend/
│   ├── app/ai/          — ReAct-агент: agent.py (Anthropic + Ollama), tools.py
│   ├── app/api/v1/      — роуты: auth, plan, cooking, storage, shopping, agent, containers
│   ├── app/services/    — nutri_service (BMR/TDEE), meal_planner, cooking_planner
│   ├── app/models/      — SQLAlchemy: User, MealPlan, DayPlan, Meal, Container...
│   ├── app/schemas/     — Pydantic схемы
│   ├── migrations/      — Alembic: 0001_initial (все таблицы), 0002_profile
│   ├── .env.example     — переменные окружения (без секретов)
│   └── requirements.txt
│
├── mobile/
│   ├── app/(tabs)/      — 7 вкладок: home, plan, cooking, storage, shopping, agent, profile
│   ├── app/onboarding/  — 5 шагов онбординга
│   └── src/
│       ├── api/         — axios-клиент + React Query хуки для всех сущностей
│       ├── store/       — Zustand: authStore, planStore, shoppingStore, storageStore
│       └── components/  — KbzhuBar, ContainerBadge, EmptyState, LoadingSpinner
│
├── data/
│   ├── recipes/basic_recipes.json   — база рецептов с КБЖУ
│   └── nutrition/products.json      — КБЖУ продуктов на 100г
│
├── docs/                — архитектура, решения, план реализации, JTBD
├── infra/               — docker-compose.dev.yml (PostgreSQL + Redis), docker-compose.yml (полный стек)
└── CLAUDE.md            — контекст для Claude
```

## Стек

- **Backend:** Python 3.11, FastAPI, SQLAlchemy async, Alembic, PostgreSQL 16, Redis 7, Celery
- **Mobile:** React Native, Expo Router, Zustand, React Query, expo-secure-store
- **AI (prod):** Anthropic SDK, `claude-sonnet-4-6`, ReAct паттерн, tool-use
- **AI (dev):** Ollama `qwen2.5:14b` — локальный LLM без затрат на API, переключается флагом `USE_LOCAL_LLM`

## Статус

- Фаза 0 завершена: вся архитектура, модели, инфраструктура
- Фаза 1 в процессе: подключение mobile к реальному API (auth готов, экраны в работе)
- Фаза 2 начата: базовая инфраструктура AI-агента работает с Ollama
