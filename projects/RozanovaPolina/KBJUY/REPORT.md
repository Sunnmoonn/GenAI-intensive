# REPORT — Что изменилось за две недели (09–21 апреля 2026)

## Контекст

Проект КБЖУЙ — персональный AI-навигатор питания. Принцип: раз в неделю батч-готовка, еда раскладывается по пронумерованным контейнерам (1А, 2Б…), приложение в каждый момент говорит какой контейнер взять, AI-агент адаптирует план к отклонениям.

Фаза 0 (код, архитектура, инфраструктура) была завершена к 31 марта. Две недели — это старт Фазы 1 (подключение mobile к реальному API) и начало работы над Фазой 2 (AI-агент).

---

## Что сделали

### Mobile → API: первые подключения

Заменили мок-данные на реальные в auth-флоу:
- Экраны регистрации/логина подключены к `POST /auth/register` и `POST /auth/login`
- Токены хранятся в `expo-secure-store` (нативные) / `localStorage` (web-preview)
- Axios interceptor автоматически обновляет access_token при 401 (REF-009)
- AuthGate в root layout — единая точка контроля доступа, сам редиректит при смене `isAuthenticated` (REF-010)

Онбординг: все 4 шага собирают данные и отправляют в `POST /api/v1/profile/onboarding`.

### Архитектурные фиксы backend

- Устранили дублирование сервисов: `backend/services/` (корень) удалена, остался только `backend/app/services/`
- `GET /plan/current`: добавлен `selectinload` для eager loading — async SQLAlchemy не поддерживает lazy loading в async context (MissingGreenlet); ответ сериализуется вручную, не через `PlanResponse` (REF-010)

### API URL в production mode

`expo export` собирает в production (`__DEV__=false`), поэтому `localhost:8000` недоступен при тестировании статики. Добавлена env-переменная `EXPO_PUBLIC_API_URL` с fallback на `api.kbzhuy.app` (REF-011). Для E2E: `EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1 npx expo export`.

### AI-агент: запущен в режиме разработки (Фаза 2 начата досрочно)

Двойной backend для LLM (REF-012):
- `USE_LOCAL_LLM=true` → OpenAI-совместимый клиент к Ollama (localhost:11434), модель `qwen2.5:14b` (12GB VRAM, RTX 5070 Ti)
- `USE_LOCAL_LLM=false` → Anthropic API, `claude-sonnet-4-6`

Это позволяет разрабатывать агента без трат на API-ключ. В `agent.py` два метода: `_chat_anthropic` и `_chat_openai`. В `tools.py` два формата: `TOOLS` (Anthropic) и `TOOLS_OPENAI` (OpenAI).

Флаг `use_ai` в генерации плана (REF-013):
- `POST /plan/generate` с `use_ai: false` → детерминистический генератор, ~0.3с
- `use_ai: true` → агент читает профиль, вызывает `build_meal_plan` tool (~1-2 мин через Ollama)
- AI не генерирует план с нуля — оркестрирует существующий `MealPlannerService`

---

## Что переделали

| Было | Стало | Причина |
|------|-------|---------|
| Токены в `AsyncStorage` | `SecureStore` (native) / `localStorage` (web) | Безопасность: Keychain/Keystore на устройствах |
| Lazy loading SQLAlchemy | `selectinload` + ручная сериализация | async context не поддерживает lazy |
| Один LLM-клиент (Anthropic) | Два клиента + флаг | Разработка без платного API |
| AuthGate как компонент | В `_layout.tsx` | Единая точка контроля, нет дублирования |

---

## Текущее состояние

```
Фаза 1 (MVP):
✅ 1.1 Очистка backend-дублей
✅ 1.3 Backend auth (register/login/refresh)
✅ 1.8 Mobile auth flow
✅ 1.9 Mobile онбординг
⏳ 1.2 Импорт рецептов (скрипт написан, не запущен)
⏳ 1.4–1.7 Backend: профиль, план, покупки, готовка, контейнеры
⏳ 1.10–1.13 Mobile: все основные экраны
❌ 1.14 E2E тестирование

Фаза 2 (AI-агент) — начата параллельно:
✅ REF-012: локальный LLM через Ollama
✅ REF-013: флаг use_ai, базовая инфраструктура агента
⏳ 2.1 Agent tools (get_user_profile, calculate_kbzhu, search_recipes)
⏳ 2.3 Движок отклонений
```

---

## Заложили на будущее

- **api.kbzhuy.app** — зарезервировано как production URL, инфраструктура не поднята
- **Celery + beat** — для push-уведомлений (Фаза 2.6), в docker-compose есть заглушка
- **Firebase Auth** — пересмотреть в Фазе 4 (сейчас собственный JWT, достаточно для MVP)
- **Интеграция с доставкой продуктов** — Яндекс Лавка/СберМаркет, после Фазы 3
- **Семейные профили** — до Фазы 4 не трогать

---

## Главный риск сейчас

`expo export` + `python serve.py` — единственный способ проверить UI на Windows с кириллическим путём (Metro нестабилен). Это замедляет итерации: каждое изменение в `mobile/` требует полной пересборки (~30с).
