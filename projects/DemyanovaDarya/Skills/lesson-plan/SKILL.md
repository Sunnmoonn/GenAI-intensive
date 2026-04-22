---
name: lesson-plan
description: Generates a structured lesson plan for a tutoring session — topic, goals, exercises, and timing for each block. Use when preparing for a specific class with a specific student.
allowedTools:
  - Read
  - Bash
---

# Lesson Plan Generator

Составляет детальный план занятия: цели, блоки с упражнениями, хронометраж. Помогает репетитору не держать структуру в голове и приходить на урок подготовленным.

---

## Triggers

- "составь план занятия", "подготовь урок по теме"
- "lesson plan for", "plan this class"
- `/lesson-plan`

---

## Входные данные

- Предмет и тема занятия
- Уровень ученика (школьник / студент / взрослый, класс или уровень)
- Продолжительность занятия (по умолчанию 60 минут)
- Опционально: что уже пройдено, что вызывает затруднения

---

## Промпт для генерации

```
You are an experienced tutor. Create a detailed lesson plan based on the input below.

Requirements:
- Break the lesson into timed blocks (warm-up, explanation, practice, wrap-up)
- Each block must have a clear goal and specific activity
- Total time must match the requested duration
- Include 1-2 checkpoints to assess understanding during the lesson
- Language: Russian
- Return structured plain text, no JSON

Input:
Subject: {SUBJECT}
Topic: {TOPIC}
Student level: {LEVEL}
Duration: {DURATION} minutes
Notes: {NOTES}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
План занятия: Квадратные уравнения — дискриминант
Продолжительность: 60 минут | Уровень: 8 класс
──────────────────────────────────────────────
[0:00–0:10] Разминка
  Устная проверка: ученик объясняет, что такое корень уравнения.
  Цель: активировать предыдущие знания.

[0:10–0:25] Объяснение
  Формула дискриминанта, три случая (D>0, D=0, D<0).
  Разбор 2 примеров с комментариями.

[0:25–0:45] Практика
  Ученик решает 4 уравнения самостоятельно.
  ✓ Чекпоинт: проверить задачи 1–2 вместе.

[0:45–0:55] Закрепление
  Задача с параметром — применение формулы в нестандартном контексте.

[0:55–1:00] Итог
  Ученик формулирует алгоритм решения своими словами.
  Домашнее задание: задачи 3.14–3.17 из учебника.
```
