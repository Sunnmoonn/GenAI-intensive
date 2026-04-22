---
name: progress-report
description: Generates a weekly progress report for parents — topics covered, what was mastered, what needs work, and the plan for next week. Use after 4–5 lessons or at the end of the week.
allowedTools:
  - Read
  - Bash
---

# Progress Report Generator

Генерирует еженедельный отчёт о прогрессе ученика для родителей. Чёткая структура: что прошли, что усвоено, что требует доработки, план на следующую неделю.

---

## Triggers

- "напиши отчёт для родителей", "отчёт за неделю"
- "progress report", "weekly summary for parents"
- `/progress-report`

---

## Входные данные

- Имя ученика
- Предмет
- Что прошли за неделю (темы)
- Что усвоено хорошо
- Что вызвало затруднения
- План на следующую неделю

---

## Промпт для генерации

```
You are a private tutor writing a weekly progress report for parents.

Rules:
- Professional but warm tone — parents are clients, not colleagues
- No jargon — explain results in plain language
- Be specific: name topics, not just "worked on math"
- Keep it concise: 150–250 words
- End with a clear plan for next week
- Language: Russian

Student: {NAME}
Subject: {SUBJECT}
Topics covered: {TOPICS}
Strengths: {STRENGTHS}
Difficulties: {DIFFICULTIES}
Next week plan: {PLAN}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Еженедельный отчёт — Иван, Математика
Период: 15–19 апреля 2025
──────────────────────────────────────
На этой неделе мы работали над квадратными уравнениями:
разобрали формулу дискриминанта и научились решать
уравнения тремя способами.

Хорошо усвоено:
— Базовые уравнения через дискриминант (решает уверенно)
— Проверка ответа подстановкой

Требует внимания:
— Уравнения с параметром вызывают затруднения
— Иногда путает знаки при вычислении D

На следующей неделе:
Закрепим сложные случаи, разберём уравнения с дробными
коэффициентами и начнём подготовку к контрольной работе.

По вопросам пишите в любое время.
С уважением, Дарья
```
