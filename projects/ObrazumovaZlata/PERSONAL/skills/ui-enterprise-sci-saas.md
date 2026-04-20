
# **UI Skill: Enterprise Scientific SaaS (Quantara-style)**

## 1. Design DNA (ядро подхода)

**Архетип:**

> Enterprise SaaS × Scientific domain × Product-led growth

**Ключевой принцип:**

> Максимальная ясность + измеримая ценность + минимальный визуальный шум

---

# 2. Цветовая система (точные коды)

## Primary palette

```
Primary Blue (brand)
#2F5BFF

Primary Dark (hover / header)
#1F3FCC

Primary Light (background accents)
#EAF0FF
```

## Neutral palette

```
Background Base
#FFFFFF

Secondary Background
#F5F7FB

Border / Divider
#E2E6EF

Text Primary
#1A1F36

Text Secondary
#5B6378

Text Muted
#9AA3B2
```

## Semantic (минимально)

```
Success
#22C55E

Warning
#F59E0B

Error
#EF4444
```

---

## Цветовые правила

1. **Фон всегда светлый**
    
2. Синий = только:
    
    - CTA
        
    - ключевые акценты
        
    - хедер
        
3. Не более **2 оттенков синего на экран**
    
4. Никаких градиентов (или очень subtle)
    

---

# 3. Типографика

## Шрифт (рекомендуемый стек)

```
Primary: Inter
Fallback: SF Pro Display / Roboto / Arial
```

---

## Иерархия

### H1 (Hero)

```
Font-size: 40–48px
Weight: 700–800
Line-height: 1.2
Letter-spacing: -0.5px
```

### H2 (Section)

```
Font-size: 28–32px
Weight: 600–700
```

### H3 (Card title)

```
Font-size: 18–20px
Weight: 600
```

### Body

```
Font-size: 14–16px
Weight: 400–500
Line-height: 1.5–1.6
```

### Caption

```
Font-size: 12–13px
Color: #9AA3B2
```

---

## Типографические правила

- Заголовки = **value-first**
    
- максимум 2 строки
    
- без сложных конструкций
    
- избегать научного канцелярита
    

---

# 4. Grid & Layout

## Базовая сетка

```
Container: 1200–1280px
Columns: 12
Gutter: 24px
```

## Отступы (spacing system)

```
4px — micro
8px — tight
16px — base
24px — section internal
32px — block spacing
48–64px — section spacing
```

---

## Layout-паттерны

### Hero layout

```
| Text (6 col) | Visual (6 col) |
```

### Feature layout

```
| Card | Card | Card |
```

### Split layout

```
| Problem | Product |
```

---

# 5. Компоненты

## 5.1 Button

### Primary button

```
Background: #2F5BFF
Text: #FFFFFF
Padding: 12px 20px
Border-radius: 10px
Font-weight: 600
```

### Hover

```
#1F3FCC
```

### Secondary button

```
Background: #EAF0FF
Text: #2F5BFF
```

---

## 5.2 Card

```
Background: #FFFFFF
Border: 1px solid #E2E6EF
Border-radius: 16px
Padding: 20–24px
Shadow: 0 4px 20px rgba(0,0,0,0.04)
```

---

## 5.3 Metrics block

```
Number:
Font-size: 36–44px
Weight: 700
Color: #2F5BFF

Label:
Font-size: 14px
Color: #5B6378
```

---

## 5.4 Navbar

```
Height: 64–72px
Background: #FFFFFF
Border-bottom: 1px solid #E2E6EF
```

---

# 6. Визуальный язык

## Иллюстрации

- научная тематика (колбы, молекулы)
    
- low opacity (5–10%)
    
- не конкурируют с текстом
    

---

## Персонаж

Используется как:

- эмоциональный якорь
    
- маркер боли
    

Правила:

- не больше 1 на экран
    
- не в центре
    
- не рядом с CTA
    

---

## Product UI

- чистый интерфейс
    
- реальные данные (или максимально приближенные)
    
- крупный scale
    

---

# 7. UX-паттерны

## Правило одного действия

> На экран = 1 ключевое действие

---

## Правило 5 секунд

Пользователь должен понять:

- что это
    
- зачем
    
- куда нажать
    

---

## Иерархия внимания

1. Заголовок
    
2. CTA
    
3. Визуал
    
4. Вторичный текст
    

---

# 8. Контент-правила

## Формула текста

```
[Результат] + [как достигается]
```

Пример:

- "Сократите потери лаборатории за счет централизованного учета данных"
    

---

## Запрещено

- абстрактные формулировки ("инновационная платформа")
    
- длинные абзацы
    
- сложные предложения
    

---

# 9. Motion (если добавлять)

```
Duration: 150–250ms
Easing: ease-out
```

Использование:

- hover
    
- появление карточек
    
- CTA
    

---

# 10. Accessibility (минимальный уровень)

- Контраст текста: WCAG AA
    
- Минимум 14px текст
    
- Кликабельные зоны ≥ 40px
    

---

# 11. Anti-patterns (критично)

Не допускается:

- перегрузка UI (много текста)
    
- > 1 CTA на экран
    
- более 3 цветов
    
- сложные графики в hero
    
- "декоративный шум"
    

---

# 12. Сжатый blueprint (чтобы воспроизводить)

```
1. Светлый фон
2. Сильный заголовок (value)
3. 1 CTA
4. Справа визуал (персонаж или продукт)
5. Ниже — карточки / метрики
6. Минимум текста
```

---
