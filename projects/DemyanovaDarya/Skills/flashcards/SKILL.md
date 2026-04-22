---
name: flashcards
description: Generates flashcards (term + definition pairs) from any text for memorization. Use when the user wants to learn key concepts, terms, or definitions from a document or lecture. Returns structured JSON pairs.
allowedTools:
  - Read
  - Bash
---

# Flashcard Generator

Генерирует флеш-карточки из любого текста: термин на лицевой стороне, определение — на обратной. Используется для запоминания понятий из лекций, учебников, статей.

---

## Triggers

- "сделай карточки", "создай флешкарты", "помоги запомнить термины"
- "flashcards from this", "make cards"
- `/flashcards`

---

## Входные данные

- Текст вставленный в чат
- Путь к файлу
- Указание на уже загруженный документ

---

## Промпт для генерации

```
You are a flashcard generator. Based on the text below, create 8-10 flashcards for memorization.

Rules:
- Front: key term, concept, or question (short, max 10 words)
- Back: clear definition or answer (1-3 sentences)
- Focus on the most important concepts from the text
- Return ONLY a JSON array, no markdown, no explanation

Format:
[
  {
    "front": "Машинное обучение",
    "back": "Раздел искусственного интеллекта, позволяющий системам обучаться на данных без явного программирования."
  }
]

Text:
{TEXT}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Обработка ответа

```ts
function parseJSON(raw: string) {
  return JSON.parse(
    raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```\s*$/, "").trim()
  );
}
```

---

## Вывод пользователю

Показать карточки последовательно:

```
Карточка 1 / 10
──────────────────────
ЛИЦЕВАЯ СТОРОНА:
Машинное обучение

[нажми Enter чтобы перевернуть]

ОБРАТНАЯ СТОРОНА:
Раздел искусственного интеллекта, позволяющий
системам обучаться на данных без явного программирования.
──────────────────────
[Enter] Следующая   [r] Повторить
```

---

## Интеграция в Объяснятор

Реализовано в `app/api/flashcards/route.ts`. В веб-версии карточки отображаются с CSS-анимацией переворота (`rotateY 180deg`). Скилл описывает логику генерации для использования вне браузера.
