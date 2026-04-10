---
name: daily
description: Генерирует daily-отчёт по сессиям Claude Code — группировка по проектам, статистика, HTML-дешборд. Записывает в DAILY_LOG.md, сохраняет HTML в vibelife/daily/ и деплоит на ai-teams.ru/daily. Вызывай когда пользователь говорит «daily», «дейли», «дневной отчёт», «что я сделал за день», «отчёт за день», «daily report».
allowedTools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
---

# Скилл: DAILY

Генерирует daily-отчёт по сессиям Claude Code, записывает в DAILY_LOG.md, обновляет единый HTML-дешборд (лента + таймлайн) и деплоит на ai-teams.ru/daily.

## Триггеры

- `/daily` — отчёт за вчера+сегодня (по умолчанию)
- `/daily 2026-03-02` — отчёт за конкретный день
- `/daily 2026-03-01 2026-03-03` — отчёт за диапазон дат

## Файлы

**Источник:** `/Users/rudometkin/my_space/Obsidian-1/Obsidian-1/!ПРОЕКТЫ/!Vibe-life/SESSION_LOG.md`
**Obsidian-лог:** `/Users/rudometkin/my_space/Obsidian-1/Obsidian-1/!ПРОЕКТЫ/!Vibe-life/DAILY_LOG.md`
**HTML-дешборд:** `/Users/rudometkin/Downloads/!ПРОЕКТЫ - файлы  /Vibe-life/daily/index.html`
**Деплой:** `ai-teams.ru/daily/` → VPS root@31.129.109.201 `/var/www/sites/ai-teams/daily/`

---

## Алгоритм

### Шаг 1: Определить диапазон дат

- Без аргументов → `FROM = вчера`, `TO = сегодня`
- Один аргумент → `FROM = TO = указанная дата`
- Два аргумента → `FROM` и `TO`

### Шаг 2: Прочитать текущий index.html

Прочитать `/Users/rudometkin/Downloads/!ПРОЕКТЫ - файлы  /Vibe-life/daily/index.html` чтобы понять какие дни уже есть в дешборде (искать `data-day="YYYY-MM-DD"`). НЕ добавлять дубликаты.

### Шаг 3: Вытащить сессии из SESSION_LOG.md

```bash
grep -n "^## 20" "/Users/rudometkin/my_space/Obsidian-1/Obsidian-1/!ПРОЕКТЫ/!Vibe-life/SESSION_LOG.md"
```

Отфильтровать заголовки по датам в диапазоне `FROM..TO`, исключив даты, которые уже есть в index.html.
Прочитать содержимое каждой сессии (от заголовка до следующего `---`).

### Шаг 4: Анализ и группировка

Для каждой сессии извлечь:
- **Дата и время**
- **Название** (из заголовка `## ДАТА | ВРЕМЯ — НАЗВАНИЕ`)
- **Проект** (из строки `**Проекты:**` или из контекста)
- **Тип** (из контекста: feature, deploy, skill, research, content, infra, docs, data)
- **Краткое описание** (1-2 предложения)
- **Ключевые результаты** (файлы созданы, задеплоено, артефакты)

Сгруппировать по проектам. Подсчитать:
- Общее кол-во сессий
- Общее время работы (примерное, из таймстемпов)
- Кол-во деплоев
- Кол-во созданных файлов/артефактов
- Кол-во новых скиллов

### Шаг 5: Записать в DAILY_LOG.md

**Файл:** `/Users/rudometkin/my_space/Obsidian-1/Obsidian-1/!ПРОЕКТЫ/!Vibe-life/DAILY_LOG.md`

Если файл не существует — создать с заголовком `# Daily Log`. Новые записи — **СВЕРХУ** (после заголовка).

#### Формат записи в DAILY_LOG.md

```markdown
## YYYY-MM-DD — YYYY-MM-DD | Краткий итог

**Сессий:** N | **~Часов:** X | **Деплоев:** Y | **Скиллов:** Z

### По проектам

**Проект 1** (N сессий)
- Сессия 1: краткое описание результата
- Сессия 2: краткое описание результата

**Проект 2** (N сессий)
- ...

### Итого
- N сессий, ~X часов работы
- Y деплоев на прод
- Z новых скиллов
- Ключевые артефакты: ...

---
```

### Шаг 6: Обновить index.html — добавить новые карточки

**Файл:** `/Users/rudometkin/Downloads/!ПРОЕКТЫ - файлы  /Vibe-life/daily/index.html`

Это **единый** single-page дешборд (лента + таймлайн). Архитектура:

#### Структура

```
#app
  .header (h1 + subtitle)
  .stats-bar (общие счётчики: сессии, часы, деплои, скиллы, проекты)
  .tabs (Лента | Таймлайн)
  #tab-feed
    .filters (чипы проектов + чипы типов)
    .day-divider[data-day] (по каждому дню, новые СВЕРХУ)
    .card[data-proj][data-type] (карточки сессий, компактные + expand по клику)
    footer
  #tab-timeline
    .timeline-grid (scatter — дни по X, проекты по Y, размер кружка = кол-во сессий)
    .tl-legend
```

#### Что обновлять

1. **Stats-bar** — пересчитать общие числа (сессии, часы, деплои, скиллы, проекты)
2. **Фильтр-чипы проектов** — добавить новые проекты если появились
3. **Фильтр-чипы типов** — добавить новые типы если появились
4. **Day-dividers + карточки** — добавить новые дни **СВЕРХУ** (перед существующими). Формат:

```html
<!-- === DD месяц YYYY === -->
<div class="day-divider" data-day="YYYY-MM-DD">DD месяц YYYY <span class="day-count">N сессий</span></div>

<div class="card" data-proj="ИмяПроекта" data-type="feature deploy">
  <div class="card-head">
    <span class="card-time">HH:MM–HH:MM</span>
    <div class="card-main">
      <div class="card-title">Краткий заголовок</div>
      <div class="card-tags"><span class="tag tag-proj">Проект</span><span class="tag tag-type">Тип</span></div>
    </div>
    <span class="card-arrow">&#9654;</span>
  </div>
  <div class="card-body">
    <p>Описание того что было сделано. 1-3 предложения.</p>
    <div class="files">Создан: <code>файл.ext</code></div>
  </div>
</div>
```

#### data-proj — мультипроект (через пробел)

Сессия может затрагивать несколько проектов — тогда перечисляй через пробел:

```html
data-proj="PMF LookBook"          <!-- эксперимент над LookBook в рамках PMF -->
data-proj="GEN Studio PMF"        <!-- фича GEN Studio в рамках PMF -->
data-proj="GEN Studio PMF LookBook" <!-- UGC-воркфлоу для LookBook, собранный в GEN Studio -->
data-proj="GEN Studio PMF ВайбЛайф" <!-- инцидент INC-003, касается GEN Studio + инфра -->
data-proj="LookBook PMF ВайбЛайф"  <!-- аудит инцидентов + архитектурный рефакторинг -->
```

Фильтрация работает через `.split(' ').includes(activeProj)` — карточка показывается при клике на любой из проектов-тегов.

**Правила назначения мультипроекта:**
- `PMF` — добавлять ко всем сессиям под зонтиком PMF (LookBook, GEN Studio, Video Content, Система экспериментов, /utm-метки)
- `ВайбЛайф` — добавлять если сессия меняет архитектуру/инструменты/скиллы, даже если основная работа в другом проекте (INC-001/003, deploy.sh, settings.json и т.д.)
- Основной проект идёт **первым**: `GEN Studio PMF`, а не `PMF GEN Studio`
- В тег `card-tags` показывать **все** проекты отдельными `<span class="tag tag-proj">`

5. **Таймлайн** — строится автоматически из данных карточек через JS (не нужно менять вручную)

#### Типы (data-type)

Карточка может иметь несколько типов через пробел:
- `feature` — новая функциональность
- `deploy` — деплой на прод
- `skill` — создание/обновление скилла
- `research` — исследование, анализ
- `content` — контент (тексты, изображения, видео)
- `infra` — инфраструктура (серверы, DNS, SSL)
- `docs` — документация
- `data` — данные (парсинг, обработка, импорт)

### Шаг 7: Деплой на ai-teams.ru/daily

```bash
rsync -avz \
  "/Users/rudometkin/Downloads/!ПРОЕКТЫ - файлы  /Vibe-life/daily/" \
  root@31.129.109.201:/var/www/sites/ai-teams/daily/
```

Проверить HTTP 200:
```bash
ssh root@31.129.109.201 "curl -s -o /dev/null -w '%{http_code}' https://ai-teams.ru/daily/"
```

---

## Защита паролем

JS prompt при открытии. SHA-256 хэш пароля `753`:
```
a8cee66e4788af8b855979155e486c988d84a42aba71e43a0fc26997ca12e737
```

---

## Правила

1. **DAILY_LOG.md** — единственный файл в Obsidian, все отчёты в нём (новые сверху)
2. **index.html** — единый single-page дешборд с двумя вкладками: Лента и Таймлайн
3. **НЕ создавать отдельные HTML-файлы** — всё в одном index.html
4. **Защита паролем** — JS prompt на странице (хэш `753` = `a8cee66e...e737`)
5. Self-contained HTML без внешних зависимостей (кроме Inter font)
6. Группировка по дням (новые сверху), внутри дня — хронологически (поздние сверху)
7. Статистика честная — только из SESSION_LOG
8. После деплоя — проверить HTTP 200
9. **Не дублировать** — перед добавлением проверять что день ещё не в index.html
10. Таймлайн строится автоматически JS из data-атрибутов карточек
