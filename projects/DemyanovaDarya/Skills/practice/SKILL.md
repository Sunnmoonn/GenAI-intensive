---
name: practice
description: Generates practice problems with progressive hints and full solution from any educational text. Use when the user wants to apply knowledge from a document, not just recall it. Supports step-by-step hints before revealing the answer.
allowedTools:
  - Read
  - Bash
---

# Practice Problem Generator

Генерирует практические задачи по тексту с прогрессивными подсказками. Пользователь пробует решить сам → просит подсказку → получает следующий намёк → при необходимости видит полное решение.

---

## Triggers

- "дай задачу по тексту", "практика", "проверь как применяю знания"
- "practice problems", "give me exercises"
- `/practice`

---

## Входные данные

- Текст или путь к файлу
- Опционально: уровень сложности (базовый / средний / сложный)

---

## Промпт для генерации

```
You are a practice problem generator. Based on the text below, create 3 practice problems.

Rules:
- Problems must require applying knowledge from the text, not just recalling facts
- Each problem must have: task, 2 progressive hints (first vague, second specific), and full solution
- Difficulty: medium — requires understanding, not just memorization
- Return ONLY a JSON array, no markdown, no explanation

Format:
[
  {
    "problem": "Текст задачи...",
    "hints": [
      "Первая подсказка — общее направление",
      "Вторая подсказка — конкретный шаг"
    ],
    "solution": "Полное решение с объяснением..."
  }
]

Text:
{TEXT}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Алгоритм взаимодействия

```
1. Показать задачу
2. Ждать ответа пользователя или команды:
   - [h] hint      — показать следующую подсказку
   - [s] solution  — показать полное решение
   - [n] next      — перейти к следующей задаче

3. Если пользователь дал ответ — сравнить с решением,
   дать короткий фидбэк (верно / не совсем / неверно + почему)
```

---

## Вывод пользователю

```
Задача 1 / 3
──────────────────────
Модель показывает хорошие результаты на обучающей выборке,
но плохо работает на новых данных. Что происходит и как исправить?

Ваш ответ: ___

[h] Подсказка   [s] Решение   [n] Следующая
```

После запроса подсказки:
```
Подсказка 1: Подумайте о том, как модель относится к шуму в данных.
[h] Ещё подсказка   [s] Решение
```

---

## Интеграция в Объяснятор

Реализовано в `app/api/practice/route.ts`. В веб-версии подсказки раскрываются кнопкой, решение показывается последним. Скилл воспроизводит ту же логику для терминала.
