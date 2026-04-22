---
name: feedback
description: Generates constructive feedback on a student's work — what's correct, what's wrong, and how exactly to fix it. Use when reviewing homework, test results, or an essay.
allowedTools:
  - Read
  - Bash
---

# Student Feedback Generator

Генерирует конструктивную обратную связь по работе ученика: что сделано верно, что ошибочно и как именно это исправить. Не просто «неправильно», а с объяснением и конкретным шагом.

---

## Triggers

- "дай обратную связь по работе", "проверь решение ученика"
- "feedback on student work", "review this answer"
- `/feedback`

---

## Входные данные

- Работа ученика (решение, текст, ответ)
- Опционально: правильный ответ или критерии оценки
- Опционально: имя ученика

---

## Промпт для генерации

```
You are a tutor giving constructive feedback on a student's work.

Rules:
- Start with what is correct — always find something to praise
- Be specific about mistakes: name the exact error, not just "wrong"
- For each mistake, give a concrete fix or hint
- Tone: supportive but honest — not harsh, not vague
- End with one key takeaway
- Language: Russian

Student work:
{WORK}

Correct answer / criteria (if available):
{ANSWER}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Обратная связь по работе
──────────────────────────
Хорошо:
✓ Правильно вычислил дискриминант (D = 1)
✓ Указал оба корня уравнения

Ошибки:
✗ Задача 3: перепутал формулу корней — использовал
  x = (b ± √D) / 2 вместо x = (−b ± √D) / 2a.
  Минус перед b обязателен.

✗ Задача 4: не проверил ответ подстановкой, хотя
  один из корней неверный.

Главное на запомнить:
Формула корней: x = (−b ± √D) / 2a — выучи её наизусть,
это основа всей темы.
```
