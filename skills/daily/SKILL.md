---
name: daily-dashboard
description: Generates a daily report from Claude Code sessions — groups by project, stats, HTML dashboard. Writes to DAILY_LOG.md, updates a single-page HTML dashboard, and optionally deploys.
allowedTools:
  - Read
  - Write
  - Edit
  - Bash
  - Glob
  - Grep
  - Agent
---

# Skill: Daily Dashboard

Generates a daily report from Claude Code sessions, writes to DAILY_LOG.md, updates a single-page HTML dashboard (feed + timeline), and optionally deploys.

## Configuration

Replace these placeholders before first use:

| Placeholder | Example | Description |
|-------------|---------|-------------|
| `{{SESSION_LOG}}` | `/Users/me/Vault/Projects/SESSION_LOG.md` | Path to session log |
| `{{DAILY_LOG}}` | `/Users/me/Vault/Projects/DAILY_LOG.md` | Obsidian daily log |
| `{{DASHBOARD_HTML}}` | `/Users/me/Projects/daily/index.html` | HTML dashboard file |
| `{{VPS_HOST}}` | `root@1.2.3.4` | SSH deploy target (optional) |
| `{{SSH_KEY}}` | `~/.ssh/id_ed25519` | SSH key for deploy (optional) |
| `{{DEPLOY_DOMAIN}}` | `my-site.com` | Domain for deployment (optional) |
| `{{DEPLOY_PATH}}` | `/var/www/sites/my-site/daily/` | Remote path (optional) |
| `{{DASHBOARD_PASSWORD_HASH}}` | `a8cee66e...` | SHA-256 hash for JS password prompt (optional) |

---

## Triggers

- `/daily` — report for yesterday+today (default)
- `/daily 2026-03-02` — report for a specific day
- `/daily 2026-03-01 2026-03-03` — report for a date range

## Files

**Source:** `{{SESSION_LOG}}`
**Obsidian log:** `{{DAILY_LOG}}`
**HTML dashboard:** `{{DASHBOARD_HTML}}`
**Deploy:** `{{DEPLOY_DOMAIN}}/daily/` (optional)

---

## Algorithm

### Step 1: Determine date range

- No arguments -> `FROM = yesterday`, `TO = today`
- One argument -> `FROM = TO = specified date`
- Two arguments -> `FROM` and `TO`

### Step 2: Read current index.html

Read `{{DASHBOARD_HTML}}` to check which days are already in the dashboard (look for `data-day="YYYY-MM-DD"`). DO NOT add duplicates.

### Step 3: Extract sessions from SESSION_LOG

```bash
grep -n "^## 20" "{{SESSION_LOG}}"
```

Filter headers by dates in range `FROM..TO`, excluding dates already in index.html.
Read each session's content (from header to next `---`).

### Step 4: Analyze and group

For each session extract:
- **Date and time**
- **Title** (from header `## DATE | TIME — TITLE`)
- **Project** (from `**Projects:**` line or context)
- **Type** (from context: feature, deploy, skill, research, content, infra, docs, data)
- **Brief description** (1-2 sentences)
- **Key results** (files created, deployed, artifacts)

Group by projects. Count:
- Total sessions
- Total work time (approximate, from timestamps)
- Number of deploys
- Number of created files/artifacts
- Number of new skills

### Step 5: Write to DAILY_LOG

**File:** `{{DAILY_LOG}}`

If file doesn't exist — create with header `# Daily Log`. New entries — **ON TOP** (after header).

#### Entry format for DAILY_LOG

```markdown
## YYYY-MM-DD — YYYY-MM-DD | Brief summary

**Sessions:** N | **~Hours:** X | **Deploys:** Y | **Skills:** Z

### By project

**Project 1** (N sessions)
- Session 1: brief result description
- Session 2: brief result description

**Project 2** (N sessions)
- ...

### Total
- N sessions, ~X hours of work
- Y production deploys
- Z new skills
- Key artifacts: ...

---
```

### Step 6: Update index.html — add new cards

**File:** `{{DASHBOARD_HTML}}`

This is a **single** single-page dashboard (feed + timeline). Architecture:

#### Structure

```
#app
  .header (h1 + subtitle)
  .stats-bar (total counters: sessions, hours, deploys, skills, projects)
  .tabs (Feed | Timeline)
  #tab-feed
    .filters (project chips + type chips)
    .day-divider[data-day] (per day, newest ON TOP)
    .card[data-proj][data-type] (session cards, compact + expand on click)
    footer
  #tab-timeline
    .timeline-grid (scatter — days on X, projects on Y, circle size = session count)
    .tl-legend
```

#### What to update

1. **Stats-bar** — recalculate totals (sessions, hours, deploys, skills, projects)
2. **Filter chips (projects)** — add new projects if they appeared
3. **Filter chips (types)** — add new types if they appeared
4. **Day-dividers + cards** — add new days **ON TOP** (before existing ones). Format:

```html
<!-- === DD month YYYY === -->
<div class="day-divider" data-day="YYYY-MM-DD">DD month YYYY <span class="day-count">N sessions</span></div>

<div class="card" data-proj="ProjectName" data-type="feature deploy">
  <div class="card-head">
    <span class="card-time">HH:MM-HH:MM</span>
    <div class="card-main">
      <div class="card-title">Brief title</div>
      <div class="card-tags"><span class="tag tag-proj">Project</span><span class="tag tag-type">Type</span></div>
    </div>
    <span class="card-arrow">&#9654;</span>
  </div>
  <div class="card-body">
    <p>Description of what was done. 1-3 sentences.</p>
    <div class="files">Created: <code>file.ext</code></div>
  </div>
</div>
```

#### data-proj — multi-project (space-separated)

A session can touch multiple projects — list them space-separated:

```html
data-proj="MyApp Analytics"     <!-- analytics work inside MyApp -->
data-proj="API Frontend"        <!-- cross-cutting change -->
```

Filtering uses `.split(' ').includes(activeProj)` — card shows when clicking any project tag.

5. **Timeline** — built automatically from card data via JS (no manual changes needed)

#### Types (data-type)

A card can have multiple types, space-separated:
- `feature` — new functionality
- `deploy` — production deploy
- `skill` — skill creation/update
- `research` — research, analysis
- `content` — content (text, images, video)
- `infra` — infrastructure (servers, DNS, SSL)
- `docs` — documentation
- `data` — data (parsing, processing, import)

### Step 7: Deploy (optional)

If `{{VPS_HOST}}` and `{{DEPLOY_DOMAIN}}` are configured:

```bash
rsync -avz "{{DASHBOARD_HTML}}" {{VPS_HOST}}:{{DEPLOY_PATH}}
```

Verify HTTP 200:
```bash
ssh {{VPS_HOST}} "curl -s -o /dev/null -w '%{http_code}' https://{{DEPLOY_DOMAIN}}/daily/"
```

---

## Password protection (optional)

If `{{DASHBOARD_PASSWORD_HASH}}` is set, add a JS prompt on page load that checks SHA-256 hash of the entered password.

---

## Rules

1. **DAILY_LOG** — single file, all reports in it (newest on top)
2. **index.html** — single-page dashboard with two tabs: Feed and Timeline
3. **DO NOT create separate HTML files** — everything in one index.html
4. Self-contained HTML with no external dependencies (except Inter font)
5. Group by days (newest on top), within a day — chronologically (latest on top)
6. Stats are honest — only from SESSION_LOG
7. After deploy — verify HTTP 200
8. **No duplicates** — check that a day isn't already in index.html before adding
9. Timeline is built automatically by JS from card data-attributes
�ьтипроект (через пробел)

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
