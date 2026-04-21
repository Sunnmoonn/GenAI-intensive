---
name: презентация
description: >
  Генерирует и итеративно редактирует Reveal.js HTML-презентации из текста, исследований, заметок или темы.
  Поддерживает 4 стиля (Minimalism, Dark Mode, Neobrutalism, Avant), 3 уровня насыщенности, 12 макетов слайдов,
  Mermaid.js-диаграммы, Chart.js-графики. Файл самодостаточен и открывается в браузере локально.
  Вызывай когда пользователь говорит: «презентация», «сделай презентацию», «слайды», «pitch deck»,
  «создай слайды из», «упакуй в презентацию», «презу», «/презентация»,
  «отредактируй слайд», «измени слайд N», «добавь слайд», «поменяй стиль».
allowedTools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - WebSearch
  - WebFetch
  - AskUserQuestion
  - TodoWrite
---

# Скилл: Презентация

## Конфигурация

Замени плейсхолдеры перед первым использованием:

| Плейсхолдер | Пример | Описание |
|-------------|--------|----------|
| `C:/Users/shaki/skills/презентация` | `~/.claude/skills/презентация` | Путь к папке этого скилла |
| `C:/Users/shaki/presentations` | `~/presentations` | Локальная папка для сохранения презентаций |
| `{{VPS_HOST}}` | `root@1.2.3.4` | SSH-хост для деплоя (опционально) |
| `{{SSH_KEY}}` | `~/.ssh/id_ed25519` | SSH-ключ для деплоя (опционально) |
| `{{DEPLOY_DOMAIN}}` | `my-site.com` | Домен для деплоя (опционально) |
| `{{DEPLOY_BASE_PATH}}` | `/var/www/sites/my-site/` | Удалённый базовый путь (опционально) |

---

## Справочные файлы (всегда доступны)

- Шаблон HTML: `C:/Users/shaki/skills/презентация/references/template.html`
- Макеты слайдов: `C:/Users/shaki/skills/презентация/references/slide-layouts.md`
- Стиль Minimalism: `C:/Users/shaki/skills/презентация/references/styles/minimalism.css`
- Стиль Dark Mode: `C:/Users/shaki/skills/презентация/references/styles/dark-mode.css`
- Стиль Neobrutalism: `C:/Users/shaki/skills/презентация/references/styles/neobrutalism.css`
- Стиль Avant: `C:/Users/shaki/skills/презентация/references/styles/avant.css`
- Галерея шаблонов: `C:/Users/shaki/skills/презентация/references/gallery.html`

## Хранилище и деплой

### Локально
```
C:/Users/shaki/presentations/
  YYYY-MM-DD_slug/
    index.html
    assets/          <- изображения (если есть)
```

### Деплой на сервер (опционально)
```
VPS:   {{VPS_HOST}}  (ключ: {{SSH_KEY}})
Путь:  {{DEPLOY_BASE_PATH}}/YYYY-MM-DD-Slug/index.html
URL:   https://{{DEPLOY_DOMAIN}}/YYYY-MM-DD-Slug/
```

**Формат slug:** `YYYY-MM-DD-Тема` — дата + краткое название в CamelCase или kebab-case.
Примеры: `2026-03-10-Avant-B2B-AI`, `2026-04-15-Product-Pitch`

Команда деплоя (если настроен):
```bash
ssh -i {{SSH_KEY}} {{VPS_HOST}} "mkdir -p {{DEPLOY_BASE_PATH}}/SLUG"
scp -i {{SSH_KEY}} /local/path/index.html {{VPS_HOST}}:{{DEPLOY_BASE_PATH}}/SLUG/index.html
curl -s -o /dev/null -w "%{http_code}" https://{{DEPLOY_DOMAIN}}/SLUG/
```

---

## РЕЖИМ 1: Новая презентация

### Шаг 1 — Определить источник контента

| Источник | Признак | Действие |
|----------|---------|----------|
| **Из файла** | Пользователь дал путь к файлу | `Read` файл -> извлечь ключевые тезисы |
| **Из темы** | Пользователь описал тему словами | Использовать знания + при необходимости WebSearch |
| **Из контекста** | «упакуй это в слайды» | Извлечь из текущего разговора |

### Шаг 2 — Уточнить параметры (AskUserQuestion, одним вопросом)

Спросить всё сразу:
1. Тема / содержание (если не ясно)
2. Количество слайдов (по умолчанию: 10-12)
3. Стиль: **Minimalism** (деловой, питч) / **Dark Mode** (техно, продукт) / **Neobrutalism** (конференция, bold) / **Avant** (креативный)
4. Насыщенность: **minimal** (выступление, мало слов) / **standard** (звонок, нормально) / **dense** (отчёт, много деталей)
5. Аудитория и цель (инвесторы / клиенты / команда / конференция)

### Шаг 3 — Прочитать справочники

```
Read: C:/Users/shaki/skills/презентация/references/slide-layouts.md
Read: C:/Users/shaki/skills/презентация/references/styles/{выбранный_стиль}.css
```

### Шаг 4 — Сгенерировать план слайдов

Вывести пользователю структуру:
```
ПЛАН ПРЕЗЕНТАЦИИ — 12 слайдов, Dark Mode, standard
---
 1. [title]       Название продукта — слоган
 2. [section]     Проблема
 3. [text]        Люди не знают, подойдёт ли X
 4. [big-number]  40 000 пользователей/месяц
 5. [section]     Решение
 6. [text-image]  Загрузи фото -> AI подберёт стиль
 7. [diagram]     Флоу: загрузка -> обработка -> результат
 8. [chart]       Рост пользователей с момента запуска
 9. [section]     Бизнес-модель
10. [comparison]  Бесплатно vs Подписка
11. [big-number]  MRR / рост
12. [contact]     Контакты и CTA
---
Генерировать? Или скорректировать структуру?
```

Дождаться одобрения.

### Шаг 5 — Прочитать HTML-шаблон и генерировать HTML

```
Read: C:/Users/shaki/skills/презентация/references/template.html
```

Заполнить шаблон:
- `{{TITLE}}` -> название презентации
- `{{STYLE_CSS}}` -> содержимое CSS-файла выбранного стиля (инлайн)
- `{{SLIDES_HTML}}` -> полный HTML всех слайдов

**Правила генерации `<section>`:**
- Каждый слайд: `<section data-slide-id="N" data-layout="тип">`
- Атрибут `data-slide-id` обязателен — без него нельзя редактировать точечно
- Брать HTML-структуру из `slide-layouts.md` для каждого типа
- Учитывать уровень насыщенности (density)
- Speaker notes в `<aside class="notes">` — для каждого слайда

**Шрифты — всегда подключать так:**

```html
<!-- Bebas Neue с кириллицей — НЕ Google Fonts (там нет кириллицы) -->
<link href="https://fonts.cdnfonts.com/css/bebas-neue" rel="stylesheet">
<!-- Inter + Montserrat -->
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Montserrat:ital,wght@0,400;0,600;0,700;0,800;0,900;1,400&display=swap" rel="stylesheet">
```

CSS-переменные шрифтов:
```css
--font-body:    'Inter', sans-serif;
--font-heading: 'Bebas Neue', 'Montserrat', sans-serif;
--font-display: 'Bebas Neue', 'Montserrat', sans-serif;
```

**Условные блоки CDN:**

Если есть слайды с `data-layout="diagram"`:
```
{{MERMAID_SCRIPT}} -> <script src="https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.min.js"></script>
{{MERMAID_INIT}} ->
  mermaid.initialize({ startOnLoad: false, theme: 'default', securityLevel: 'loose' });
  Reveal.on('ready', () => { mermaid.run(); });
  Reveal.on('slidechanged', ({ currentSlide }) => {
    const el = currentSlide.querySelector('.mermaid:not([data-processed])');
    if (el) mermaid.run({ nodes: [el] });
  });
```

Если есть слайды с `data-layout="chart"`:
```
{{CHARTJS_SCRIPT}} -> <script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js"></script>
{{CHARTJS_INIT}} -> new Chart(document.getElementById('chart-slide-N'), { ...конфиг... });
```

Если нет диаграмм/графиков -> убрать соответствующие плейсхолдеры полностью.

### Шаг 6 — Сохранить файл локально

Определить два slug:
- **Локальный** (с underscore): `YYYY-MM-DD_slug`
- **Серверный** (только дефисы, CamelCase): `YYYY-MM-DD-Slug`

```bash
mkdir -p "C:/Users/shaki/presentations/YYYY-MM-DD_slug"
```

Сохранить HTML через Write tool (не bash).

### Шаг 7 — Открыть в браузере

```bash
open "C:/Users/shaki/presentations/YYYY-MM-DD_slug/index.html"
```

### Шаг 8 — Задеплоить (опционально, если VPS настроен)

```bash
ssh -i {{SSH_KEY}} {{VPS_HOST}} "mkdir -p {{DEPLOY_BASE_PATH}}/YYYY-MM-DD-Slug"
scp -i {{SSH_KEY}} "C:/Users/shaki/presentations/YYYY-MM-DD_slug/index.html" {{VPS_HOST}}:{{DEPLOY_BASE_PATH}}/YYYY-MM-DD-Slug/index.html
curl -s -o /dev/null -w "%{http_code}" https://{{DEPLOY_DOMAIN}}/YYYY-MM-DD-Slug/
```

### Шаг 9 — Вывести итог

```
ПРЕЗЕНТАЦИЯ ГОТОВА
---
Слайдов:  12 | Стиль: Dark Mode | Насыщенность: standard
Локально: presentations/2026-03-03_product-pitch/index.html
URL:      https://{{DEPLOY_DOMAIN}}/2026-03-03-Product-Pitch/ (если задеплоена)
---
Навигация:   стрелки или пробел
Обзор:       Esc
Notes:       S
Полный экран: F
PDF:         Открой index.html?print-pdf в Chrome -> Ctrl+P -> Сохранить PDF
---
Редактирование: «слайд 5, замени заголовок на...»
                «добавь слайд-диаграмму после 7»
                «поменяй стиль на Minimalism»
                «насыщенность -> minimal»
```

---

## РЕЖИМ 2: Редактирование существующей презентации

**Триггеры:** «слайд N», «измени слайд», «добавь слайд», «удали слайд», «поменяй стиль», «измени насыщенность».

### Алгоритм

**1. Определить файл**

Если из контекста сессии ясно, какой файл — использовать его. Если не ясно — спросить через AskUserQuestion.

**2. Прочитать файл**

**3. Найти нужный `<section>`**

Искать `data-slide-id="N"` — надёжный якорь для любого типа редактирования.

**4. Версионирование перед крупными изменениями**

Если изменение затрагивает **более 10% слайдов** (или полная перегенерация, смена стиля, насыщенности) — сохранить текущую версию рядом с `index.html`:

```
Алгоритм версионирования:
1. Прочитать файл index.html
2. Найти существующие версии: index-v2.html, index-v3.html...
3. Следующая версия = max(N) + 1, начиная с v2
4. Скопировать текущий index.html -> index-vN.html через Write
5. Записать новую версию в index.html
```

**5. Применить изменение**

| Что изменить | Версия? | Инструмент | Как |
|---|---|---|---|
| Текст в одном слайде | Нет | **Edit** | Заменить содержимое нужного `<section>` |
| Добавить слайд | Нет | **Edit** | Вставить новый `<section>` после нужного |
| Удалить слайд | Нет | Спросить -> **Edit** | Удалить `<section>` |
| Поменять стиль | **Да** | **Edit** | Сохранить vN, заменить CSS-блок |
| Изменить насыщенность | **Да** | **Write** | Сохранить vN, регенерировать слайды |
| Добавить диаграмму | Нет | **Edit** | Добавить `.mermaid` div + CDN |
| Добавить график | Нет | **Edit** | Добавить `<canvas>` + Chart.js конфиг |
| Крупная переработка (>10%) | **Да** | **Write** | Сохранить vN, перезаписать |

**6. Сохранить и переоткрыть**

**7. Подтвердить** — сообщить: `Слайд 5 обновлён. Файл переоткрыт в браузере.`

---

## Нумерация слайдов при добавлении

При вставке нового слайда — **НЕ перенумеровывать** все слайды автоматически. Присвоить следующий свободный ID (если есть 1-12, новый получает 13). Пользователь может сказать «перенумеруй все» — тогда пройтись по всем `data-slide-id` и проставить 1, 2, 3...

---

## Галерея шаблонов

Если пользователь говорит «покажи галерею», «открой каталог шаблонов»:

```bash
open "C:/Users/shaki/skills/презентация/references/gallery.html"
```

---

## Правила качества HTML

1. Каждый слайд — `<section data-slide-id="N" data-layout="type">`. Без исключений.
2. Speaker notes — в `<aside class="notes">` для каждого слайда (хотя бы 1 предложение).
3. Все тексты — реальный контент, не placeholder-ы ("Lorem ipsum" запрещён).
4. Mermaid: тема `default` для Minimalism, `dark` для Dark Mode, `default` для Neobrutalism.
5. Chart.js цвета наследовать из CSS переменных: `getComputedStyle(document.body).getPropertyValue('--accent')`.
6. Изображения в `assets/` — относительные пути. Если нет реального изображения — `.img-box` с текстом.
7. Не использовать inline `style` для цветов — только CSS переменные (`var(--accent)` и т.д.).
8. PDF-совместимость: не использовать CSS Grid в `<section>` напрямую (кроме `.slide-cols`).
