---
name: spec
description: Writes a technical specification (ТЗ) for a feature or product based on a user request or interface analysis. Covers goals, user stories, screens, API contracts, and edge cases. Use before implementation.
allowedTools:
  - Read
  - Write
  - WebSearch
---

# Spec Writer (ТЗ)

> **Скилл для дополнительного балла**

Пишет техническое задание по запросу пользователя или результатам анализа интерфейса. Структурированный документ, по которому можно сразу начинать реализацию.

---

## Triggers

- "напиши ТЗ", "составь техническое задание", "опиши что нужно сделать"
- "write a spec", "create technical specification"
- `/spec`

---

## Входные данные

- Описание фичи или продукта (свободная форма)
- Результат `/interface-analysis` (опционально)
- Технический стек (опционально)

---

## Структура ТЗ

```markdown
# ТЗ: [название фичи]

## 1. Цель
Одно предложение: что должна делать фича и для кого.

## 2. Контекст
Почему это нужно. Что сейчас не работает или чего не хватает.

## 3. Пользовательские сценарии (User Stories)
- Как [роль], я хочу [действие], чтобы [результат]

## 4. Экраны / Интерфейс
Для каждого экрана:
- Что отображается
- Какие действия доступны
- Переходы между экранами

## 5. API / Технический контракт
Эндпоинты, входные / выходные данные, форматы.

## 6. Бизнес-логика
Пошаговое описание обработки данных на сервере.

## 7. Edge Cases
Что происходит при: пустом вводе / ошибке / лимите / недоступном API.

## 8. Вне скоупа (не делаем сейчас)
Явный список того, что не входит в данную задачу.

## 9. Критерии готовности (DoD)
Чёткий список: когда считать задачу выполненной.
```

---

## Промпт для генерации

```
You are a senior product manager writing a technical specification.

Rules:
- Be precise and unambiguous — a developer should be able to implement this without asking questions
- Separate WHAT from HOW — describe behavior, not implementation
- List edge cases explicitly
- Mark out-of-scope items clearly
- Language: Russian

Feature request:
{REQUEST}

Additional context (interface analysis / stack):
{CONTEXT}
```

Модель: `claude-sonnet-4-6` — ТЗ требует точности и полноты.

---

## Вывод

Готовый Markdown-файл `spec.md` в текущей директории. Структура строго по шаблону выше.
