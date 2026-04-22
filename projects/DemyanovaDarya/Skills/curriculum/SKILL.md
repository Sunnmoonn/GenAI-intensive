---
name: curriculum
description: Builds a month or semester learning track — topic sequence, checkpoints, and pacing. Use at the start of working with a new student to plan the full arc of study.
allowedTools:
  - Read
  - Bash
---

# Curriculum Builder

Строит учебный трек на месяц или семестр: последовательность тем, контрольные точки, темп прохождения. Используется в начале работы с учеником чтобы выстроить чёткий план от стартового уровня до цели.

---

## Triggers

- "составь учебный план", "распланируй занятия на месяц"
- "curriculum", "study track", "semester plan"
- `/curriculum`

---

## Входные данные

- Предмет
- Цель (экзамен / подтянуть оценку / изучить с нуля)
- Стартовый уровень ученика
- Количество занятий в неделю и их продолжительность
- Временной горизонт (месяц / семестр / до даты)

---

## Промпт для генерации

```
You are a tutor building a structured curriculum for a student.

Rules:
- Start from the student's current level, not from scratch
- Sequence topics logically — prerequisites before advanced material
- Add checkpoints every 3–4 weeks (mini-test or review session)
- Note which topics are critical path vs. optional enrichment
- Keep pacing realistic given sessions per week
- Language: Russian

Subject: {SUBJECT}
Goal: {GOAL}
Student level: {LEVEL}
Sessions per week: {SESSIONS} × {DURATION} min
Timeframe: {TIMEFRAME}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Учебный трек: Математика → ЕГЭ профиль
Горизонт: 4 месяца | 2 занятия в неделю по 60 мин
──────────────────────────────────────────────────
Месяц 1: Алгебра — базовый уровень
  ▸ Квадратные уравнения и неравенства
  ▸ Степени, корни, логарифмы
  ▸ Функции: свойства и графики
  ✓ Чекпоинт (конец месяца): задания части 1, раздел алгебра

Месяц 2: Геометрия
  ▸ Планиметрия: теоремы и задачи на вычисление
  ▸ Стереометрия: тела вращения и многогранники
  ✓ Чекпоинт: типовые задачи из ЕГЭ по геометрии

Месяц 3: Профильная часть
  ▸ Уравнения с параметром
  ▸ Прогрессии и суммы рядов
  ▸ Экономические задачи
  ✓ Чекпоинт: полная часть 2, задания 13–19

Месяц 4: Финальный спринт
  ▸ Разбор слабых мест по итогам чекпоинтов
  ▸ 2 пробных экзамена в условиях реального времени
  ▸ Психологическая подготовка к формату

★ Дополнительно (по желанию): задачи олимпийского типа
```
