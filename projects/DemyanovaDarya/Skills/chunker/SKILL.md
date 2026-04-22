---
name: chunker
description: Splits any long text into semantic chunks by headings and double newlines, with fallback to ~800 character chunks with 50-char overlap. Returns labeled chunks ready for use with language models. Use before passing large documents to AI tools.
allowedTools:
  - Read
  - Bash
---

# Text Chunker

Разбивает длинный текст на смысловые фрагменты для передачи в языковую модель. Без чанкинга большой документ не помещается в контекст — с чанкингом модель получает только релевантные части.

---

## Triggers

- "разбей текст на части", "подготовь документ для AI"
- "chunk this document", "split into chunks"
- `/chunker`

---

## Алгоритм

### Шаг 1: Попытка семантического разбиения

Разбить по двойным переносам строк (`\n\n`) и заголовкам (`# `):

```ts
const blocks = text.split(/\n\n+/);
```

Каждый блок, начинающийся с `#` — новый раздел. Заголовок становится `label` чанка.

### Шаг 2: Fallback — разбивка по размеру

Если блоков меньше 3 или текст не структурирован:

```ts
const CHUNK_SIZE = 800;   // символов
const OVERLAP = 50;        // символов перекрытия

for (let i = 0; i < text.length; i += CHUNK_SIZE - OVERLAP) {
  chunks.push(text.slice(i, i + CHUNK_SIZE));
}
```

Перекрытие нужно чтобы не обрывать мысль на границе чанка.

### Шаг 3: Присвоить label

```ts
label = firstLine.slice(0, 80); // первые 80 символов первой строки
```

### Шаг 4: Вернуть массив

```ts
[
  { id: "chunk-1", index: 0, label: "Глава 1: Введение", text: "..." },
  { id: "chunk-2", index: 1, label: "Глава 2: Основные понятия", text: "..." },
  ...
]
```

---

## Keyword scoring (поиск релевантных чанков)

После чанкинга для поиска релевантных фрагментов по вопросу:

```ts
function scoreChunk(chunk, query) {
  const words = query.toLowerCase().split(/\W+/).filter(w => w.length > 3);
  return words.reduce((score, word) => {
    return score + (chunk.text.toLowerCase().match(new RegExp(word, "g")) ?? []).length;
  }, 0);
}

// Топ-4 чанка по релевантности, восстановить оригинальный порядок
const top4 = chunks
  .map(c => ({ ...c, score: scoreChunk(c, query) }))
  .sort((a, b) => b.score - a.score)
  .slice(0, 4)
  .sort((a, b) => a.index - b.index);
```

---

## Вывод пользователю

```
Документ разбит на 7 чанков:

  #0  Глава 1: Введение          (312 символов)
  #1  Глава 2: Основные понятия  (756 символов)
  #2  Глава 3: Алгоритмы         (801 символов)
  ...

Готово к передаче в языковую модель.
```

---

## Интеграция в Объяснятор

Реализовано в `app/api/upload/route.ts`. При каждой загрузке документа текст автоматически проходит чанкинг. Чанки хранятся в `sessionStorage` и используются для retrieval при каждом вопросе к тьютору.
