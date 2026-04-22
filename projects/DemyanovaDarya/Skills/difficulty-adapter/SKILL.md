---
name: difficulty-adapter
description: Rewrites any educational text or task to a simpler or harder level. Use when the student finds material too easy or too hard.
allowedTools:
  - Read
  - Bash
---

# Difficulty Adapter

Перерабатывает учебный материал или задачу под нужный уровень сложности: упрощает или усложняет. Полезно когда стандартный учебник не подходит конкретному ученику.

---

## Triggers

- "упрости задачу", "сделай сложнее", "адаптируй под уровень"
- "make it easier", "make it harder", "adapt level"
- `/difficulty-adapter`

---

## Входные данные

- Текст, задача или объяснение
- Направление: упростить / усложнить
- Текущий уровень ученика (опционально)

---

## Промпт для генерации

```
You are a tutor adapting educational content for a student.

Task: {DIRECTION} the following material.

Rules for simplifying:
- Remove advanced terminology, replace with everyday language
- Break long sentences into short ones
- Add a clarifying analogy if the concept is abstract
- Remove non-essential details

Rules for making harder:
- Add nuance, edge cases, or exceptions
- Require multi-step reasoning
- Introduce formal notation or precise terminology
- Add a "what if" extension question

Keep the core content intact. Language: Russian.

Direction: {DIRECTION}
Student level: {LEVEL}

Content:
{CONTENT}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Исходный уровень: 9 класс → Адаптировано: 6 класс
──────────────────────────────────────────────────
БЫЛО:
Дискриминант D=b²−4ac определяет количество
вещественных корней квадратного трёхчлена.

СТАЛО:
Есть специальное число — дискриминант.
Считаем его по формуле D = b×b − 4×a×c.
Если D больше нуля — у уравнения два ответа.
Если равно нулю — один ответ.
Если меньше нуля — ответов нет.
```
