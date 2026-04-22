---
name: error-analysis
description: Analyzes a student's recurring mistakes and generates a personalized list of weak spots with explanations. Use after reviewing homework or test results to identify patterns.
allowedTools:
  - Read
  - Bash
---

# Error Analysis

Анализирует типичные ошибки ученика и формирует персональный список слабых мест с объяснением причины каждой ошибки. Помогает не повторять одни и те же ошибки снова.

---

## Triggers

- "проанализируй ошибки ученика", "что он постоянно путает"
- "error analysis", "find patterns in mistakes"
- `/error-analysis`

---

## Входные данные

- Список ошибок или работы ученика с отметками
- Предмет и тема
- Опционально: несколько работ для сравнения

---

## Промпт для генерации

```
You are a tutor analyzing a student's mistakes to identify patterns.

Rules:
- Group mistakes by type (conceptual, computational, procedural)
- For each pattern: name it, give an example from the work, explain the likely cause
- Prioritize by frequency and impact on grade
- Suggest one targeted exercise for each weak spot
- Language: Russian

Subject: {SUBJECT}
Student mistakes / work:
{MISTAKES}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Анализ ошибок — Иван, Математика
──────────────────────────────────────────────
Найдено 3 устойчивых паттерна:

1. Знаки в формуле корней [высокий приоритет]
   Пример: пишет x = (b ± √D)/2a вместо (−b ± √D)/2a
   Причина: заучил формулу частично, пропускает минус
   Упражнение: переписать формулу 10 раз и решить 5 уравнений
   с обязательной проверкой подстановкой.

2. Пропуск проверки ответа [средний приоритет]
   Пример: в 3 из 5 задач не подставил корень обратно
   Причина: торопится, считает шаг необязательным
   Упражнение: решать задачи в два этапа — «найти» и «проверить».

3. Ошибки в вычислении дискриминанта при b<0 [средний]
   Пример: (−3)² посчитал как −9 вместо 9
   Причина: не возводит отрицательное число в скобках
   Упражнение: серия задач только на вычисление D, без решения.
```
