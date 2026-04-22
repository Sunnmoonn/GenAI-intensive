# feature-dev

**Триггер:** «реализую [фичу]» / «сделай экран X» / «добавь эндпоинт Y»

## Что делает

1. По названию фичи определяет затронутые слои (mobile/backend/AI)
2. Загружает соответствующую архитектурную документацию
3. Проверяет `decisions/log.md` на смежные решения
4. Читает продуктовый контекст (user_scenarios.md, target_audience.md)
5. Предлагает план реализации с учётом текущего стека

## Контекст

```
Определить слой → читать:
- Mobile: kbzhuy/docs/architecture/ + mobile/src/api/ (структура клиента)
- Backend: kbzhuy/docs/architecture/ + backend/app/api/v1/ (роуты)
- AI: backend/app/ai/ + kbzhuy/docs/architecture/
- Всегда: docs/decisions/log.md, docs/product/user_scenarios.md
```

## Соглашения стека

- **Backend:** FastAPI, Pydantic schemas, SQLAlchemy models, Alembic migrations
- **Mobile:** React Native + Expo Router, Zustand store, axios-клиент в `src/api/`
- **AI:** ReAct, Claude `claude-sonnet-4-6`, tool-use
- **Контейнеры:** метка = цифра+буква (1А = первый контейнер, обед А)
