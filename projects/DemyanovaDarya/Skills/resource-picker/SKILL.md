---
name: resource-picker
description: Recommends learning resources for a topic — textbooks, video courses, problem sets — matched to the student's level and goal. Use when the tutor or student needs external materials.
allowedTools:
  - Read
  - Bash
---

# Resource Picker

Подбирает учебные материалы под тему, уровень ученика и цель: учебники, видеокурсы, задачники, онлайн-тренажёры. Экономит время на поиск — выдаёт конкретный список с пояснением зачем каждый ресурс.

---

## Triggers

- "подбери материалы по теме", "что порекомендовать ученику"
- "find resources", "what to use for this topic"
- `/resource-picker`

---

## Входные данные

- Предмет и тема
- Уровень ученика
- Цель (ЕГЭ / углублённое изучение / базовое освоение)
- Формат: книга / видео / интерактив / задачник

---

## Промпт для генерации

```
You are a tutor recommending learning resources.

Rules:
- Recommend 4–6 resources total, mix formats
- For each: name, format, why it fits this student/goal
- Prioritize Russian-language resources, note if English-only
- Do not recommend obscure or unverifiable sources
- Mark difficulty: (базовый) / (средний) / (сложный)
- Language: Russian

Subject: {SUBJECT}
Topic: {TOPIC}
Level: {LEVEL}
Goal: {GOAL}
Preferred format: {FORMAT}
```

Модель: `claude-haiku-4-5-20251001`.

---

## Вывод пользователю

```
Материалы: Квадратные уравнения | 8 класс | ЕГЭ-подготовка
──────────────────────────────────────────────────────────
1. Учебник Алгебра 8 кл. — Макарычев (базовый)
   Стандартный школьный учебник, §17–19.
   Подходит для первичного разбора теории.

2. Задачник Алгебра и начала анализа — Сборник ЕГЭ ФИПИ (средний)
   Официальные задачи из банка ЕГЭ.
   Обязателен для тренировки в реальном формате.

3. Видеокурс — Алексей Савватеев, YouTube (базовый)
   Объясняет дискриминант через геометрический смысл.
   Хорошо для учеников, которым нужна «картинка».

4. Тренажёр — mathb.in или Яндекс.Репетитор (средний)
   Интерактивные задачи с автопроверкой.
   Удобно задавать как домашнее задание.

5. Шпаргалка — «Формулы ЕГЭ по алгебре» (PDF) (базовый)
   Компактный справочник по всем формулам.
   Пусть держит рядом во время самостоятельной работы.
```
