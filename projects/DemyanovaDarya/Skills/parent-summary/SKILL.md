---
name: parent-summary
description: Generates a short post-lesson message for parents — what was covered, how the student did, and one thing to note. Friendly, no jargon. Use immediately after each lesson.
allowedTools:
  - Read
  - Bash
---

# Parent Summary

Короткое сообщение родителю после занятия: что прошли, как ученик справился, на что обратить внимание. Пишется понятным языком без терминологии. Отправляется в мессенджер.

---

## Triggers

- "напиши сообщение родителю", "отчёт после занятия"
- "message to parents", "after-lesson summary"
- `/parent-summary`

---

## Входные данные

- Имя ученика
- Тема занятия
- Как прошло занятие (в свободной форме)
- Что отметить для родителя (хорошее / требует внимания)

---

## Промпт для генерации

```
You are a private tutor writing a short post-lesson message to parents via messenger.

Rules:
- Maximum 5 sentences
- Friendly, confident, no academic jargon
- One positive observation, one actionable note if needed
- Do NOT start with "Здравствуйте" every time — vary the opening
- Language: Russian

Student: {NAME}
Topic: {TOPIC}
How it went: {NOTES}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Сегодня занимались дискриминантом — Иван разобрался
с основной формулой и уверенно решил 4 из 5 задач.
Немного путается со знаками при отрицательных b,
порекомендуйте ему перед следующим уроком просмотреть
свои записи по этой теме. В целом — хороший прогресс!
```
