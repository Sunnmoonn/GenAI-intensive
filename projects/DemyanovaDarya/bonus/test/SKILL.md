---
name: test
description: Tests an implemented feature against its specification — happy path, edge cases, API responses, and UI behavior. Use after /build to verify the implementation is complete and correct.
allowedTools:
  - Read
  - Bash
  - Glob
  - Grep
---

# Test (Тестирование ТЗ)

> **Скилл для дополнительного балла**

Проверяет реализацию по критериям из ТЗ: happy path, edge cases, API, поведение интерфейса. Не пишет тесты ради тестов — покрывает именно то, что было заявлено в спецификации.

---

## Triggers

- "протестируй", "проверь реализацию", "запусти тесты"
- "test the feature", "verify the spec"
- `/test`

---

## Входные данные

- `spec.md` — для списка критериев готовности (DoD)
- Реализованный код
- Опционально: конкретный сценарий для проверки

---

## Алгоритм

### Шаг 1: Прочитать DoD из ТЗ

```
Read: spec.md → раздел "Критерии готовности"
```

Каждый критерий — отдельный тест-кейс.

### Шаг 2: Статический анализ

```bash
# TypeScript — ноль ошибок типов
npx tsc --noEmit

# Линтер
npm run lint
```

### Шаг 3: Юнит / интеграционные тесты (если есть)

```bash
npm test
# или
npx jest --coverage
```

Если тестов нет — написать минимальные для бизнес-логики:

```ts
// lib/feature.test.ts
describe('featureName', () => {
  it('happy path: returns expected result', () => { ... })
  it('edge case: handles empty input', () => { ... })
  it('edge case: handles API error', () => { ... })
})
```

### Шаг 4: Проверка API вручную

```bash
# Запустить сервер
npm run dev &

# Проверить эндпоинт
curl -X POST http://localhost:3000/api/feature \
  -H "Content-Type: application/json" \
  -d '{"input": "тест"}'

# Edge case: пустой ввод
curl -X POST http://localhost:3000/api/feature \
  -H "Content-Type: application/json" \
  -d '{}'
```

### Шаг 5: Проверка по сценариям из ТЗ

Для каждого user story из ТЗ:
- Воспроизвести сценарий
- Зафиксировать фактический результат
- Сравнить с ожидаемым

### Шаг 6: Отчёт

Таблица: сценарий → ожидаемый результат → фактический → статус.

---

## Вывод пользователю

```
Тестирование: [название фичи]
────────────────────────────────────────────────
Статический анализ:
  ✓ TypeScript — 0 ошибок
  ✓ Lint — 0 предупреждений

Тест-кейсы по ТЗ:
  ✓ Генерация 5 вопросов по тексту
  ✓ Формат JSON соответствует спецификации
  ✓ Вопросы только из переданного текста (нет внешних знаний)
  ✓ Пустой ввод → 400 Bad Request с понятной ошибкой
  ✗ ОШИБКА: при тексте > 10 000 символов API таймаутит

Итог: 4/5 критериев ✓
Необходимо исправить: обработка длинных текстов → chunking перед передачей в модель.
```
