---
name: explain-differently
description: Explains a concept three different ways — analogy, formal definition, and real-world example. Use when the student doesn't understand after the first explanation.
allowedTools:
  - Read
  - Bash
---

# Explain Differently

Объясняет одно понятие тремя разными способами: через аналогию из жизни, через формальное определение и через конкретный пример применения. Если один способ не дошёл — дойдёт другой.

---

## Triggers

- "объясни иначе", "не понимаю, объясни по-другому"
- "explain differently", "try another way"
- `/explain-differently`

---

## Входные данные

- Понятие или концепция для объяснения
- Опционально: предмет, возраст / уровень ученика

---

## Промпт для генерации

```
You are an experienced tutor. Explain the concept below in three distinct ways.

Ways:
1. Analogy — connect to something the student already knows from everyday life
2. Formal — precise definition, as it would appear in a textbook
3. Example — concrete application: show, don't just tell

Rules:
- Keep each explanation under 5 sentences
- Use simple language unless "formal" section
- Language: Russian

Concept: {CONCEPT}
Student level: {LEVEL}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Понятие: Дискриминант
──────────────────────────────────────────────
1. Аналогия
Представь, что уравнение — это прыжок в длину.
Дискриминант — это мерка, которая говорит:
«ты долетишь до финиша, приземлишься точно на черте
или не долетишь вообще».

2. Формально
Дискриминант квадратного уравнения ax²+bx+c=0
вычисляется как D = b²−4ac.
Если D>0 — два корня, D=0 — один, D<0 — корней нет.

3. Пример
Уравнение x²−5x+6=0.
D = 25−24 = 1 > 0 → два корня: x=3 и x=2.
Проверка: (x−3)(x−2)=0 — верно.
```
