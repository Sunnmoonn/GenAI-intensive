---
name: homework
description: Generates homework assignments on a covered topic with adjustable difficulty. Use after a lesson to give the student targeted practice at the right level.
allowedTools:
  - Read
  - Bash
---

# Homework Generator

Генерирует домашнее задание по пройденной теме с нужным уровнем сложности. Задания разнообразные: базовые задачи для закрепления, одна задача на применение, необязательная задача-звёздочка.

---

## Triggers

- "составь домашнее задание", "придумай задачи на дом"
- "homework on", "make homework tasks"
- `/homework`

---

## Входные данные

- Предмет и тема
- Уровень сложности: лёгкий / средний / сложный
- Количество задач (по умолчанию 5)
- Опционально: формат (задачи / вопросы / эссе)

---

## Промпт для генерации

```
You are a tutor creating a homework assignment. Generate homework tasks based on the input.

Rules:
- Mix task types: recall, application, one creative/challenge task
- Mark difficulty: (базовый), (средний), (★ сложный)
- Last task is optional challenge (marked ★)
- Be specific — not "solve an equation" but give the actual equation
- Language: Russian

Input:
Subject: {SUBJECT}
Topic: {TOPIC}
Level: {LEVEL}
Count: {COUNT}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Домашнее задание: Дискриминант квадратного уравнения
──────────────────────────────────────────────────
1. (базовый) Найди дискриминант: x² + 5x + 6 = 0
2. (базовый) Найди дискриминант: 2x² − 3x + 1 = 0
3. (средний) Реши уравнение: x² − 4x + 4 = 0
4. (средний) Реши уравнение: 3x² + x − 2 = 0
5. (★ сложный) При каком значении k уравнение x² + kx + 9 = 0 имеет один корень?

Срок: к следующему занятию.
```
