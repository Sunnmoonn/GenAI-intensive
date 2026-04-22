---
name: quiz
description: Generates a quiz with 4 answer options and explanations from any text. Use when the user wants to test knowledge on a document, article, lecture, or any pasted text. Returns a structured JSON array of questions.
allowedTools:
  - Read
  - Bash
---

# Quiz Generator

Генерирует квиз по любому тексту: 5 вопросов с вариантами ответов A/B/C/D и объяснением правильного ответа. Используется внутри Объяснятора и как самостоятельный инструмент.

---

## Triggers

- "сделай квиз по тексту", "проверь знания", "составь вопросы"
- "quiz from this", "test me on this"
- `/quiz`

---

## Входные данные

Принять от пользователя одно из:
- Текст вставленный напрямую в чат
- Путь к файлу (`.txt`, `.md`, `.pdf`)
- Указание использовать уже загруженный документ

Если файл — прочитать через Read. Если PDF — предложить сначала прогнать через `pdf-to-md`.

---

## Промпт для генерации

```
You are a quiz generator. Based on the text below, create exactly 5 multiple-choice questions.

Rules:
- Each question must have 4 options: A, B, C, D
- Only one option is correct
- Questions must be based strictly on the provided text — no outside knowledge
- Include a short explanation (1-2 sentences) for the correct answer
- Return ONLY a JSON array, no markdown, no explanation

Format:
[
  {
    "question": "...",
    "options": { "A": "...", "B": "...", "C": "...", "D": "..." },
    "correct": "A",
    "explanation": "..."
  }
]

Text:
{TEXT}
```

Модель: `claude-haiku-4-5-20251001` — достаточно для структурированной генерации, дешевле Sonnet.

---

## Обработка ответа

Модель может вернуть JSON в обёртке из ```json — очистить перед парсингом:

```ts
function parseJSON(raw: string) {
  return JSON.parse(
    raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim()
  );
}
```

---

## Вывод пользователю

После генерации показать квиз в читаемом виде:

```
Вопрос 1 из 5
──────────────────────
Что такое машинное обучение?

A) Программирование правил вручную
B) Обучение систем на основе данных  ✓
C) Создание баз данных
D) Написание алгоритмов сортировки

Объяснение: Машинное обучение позволяет системам обучаться на данных без явного программирования.
```

---

## Интеграция в Объяснятор

В проекте реализовано в `app/api/quiz/route.ts`. Скилл описывает ту же логику для переиспользования вне веб-интерфейса — например, для генерации квизов из командной строки или автоматизации.
