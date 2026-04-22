---
name: push-skills
description: >
  Синхронизирует локальные скиллы из ~/.claude/skills/ в GitHub репозиторий
  projects/ShakinDanila/Personal/skills/. Копирует новые/обновлённые скиллы,
  обновляет README, коммитит и пушит.
  Вызывай когда пользователь говорит: «запушь скиллы», «залей на гитхаб»,
  «обнови скиллы на гитхабе», «/пуш-скиллов», или после создания нового скилла.
allowedTools:
  - Bash
  - Read
  - Write
  - Edit
---

# Скилл: Пуш скиллов на GitHub

## Конфигурация

| Переменная | Значение |
|-----------|---------|
| Локальные скиллы | `C:/Users/shaki/skills/` |
| Репозиторий | `C:/Users/shaki/GenAI-intensive/` |
| Путь в репо | `projects/ShakinDanila/Personal/skills/` |
| Ветка | `main` |

## Встроенные скиллы (не пушить)

Эти скиллы встроены в Claude Code, их не надо включать в репо:
`update-config`, `keybindings-help`, `simplify`, `less-permission-prompts`,
`loop`, `schedule`, `claude-api`, `init`, `review`, `security-review`, `kopirka`

---

## Алгоритм

### Шаг 1 — Определить что синхронизировать

```bash
# Список кастомных скиллов в ~/.claude/skills/
ls C:/Users/shaki/.claude/skills/
```

Исключить встроенные из списка выше.

### Шаг 2 — Синхронизировать файлы

```bash
REPO="C:/Users/shaki/GenAI-intensive/projects/ShakinDanila/Personal/skills"

# Для каждого кастомного скилла — скопировать из ~/.claude/skills/ в репо
# (cp -r перезапишет изменённые файлы)
for skill in [список]; do
  cp -r "C:/Users/shaki/.claude/skills/$skill" "$REPO/$skill"
done
```

### Шаг 3 — Обновить README если добавлен новый скилл

Прочитать `README.md`, проверить есть ли секция для нового скилла.
Если нет — добавить по шаблону:

```markdown
### `/[имя]` — [Название]
**Что делает:** [1 предложение]
**Как использовать:**
\```
/[команда]
[пример использования]
\```
**Что получишь:** [результат]
```

### Шаг 4 — Коммит и пуш

```bash
cd "C:/Users/shaki/GenAI-intensive"
git add projects/ShakinDanila/Personal/skills/
git commit -m "Update skills: [список изменённых скиллов]"
git push
```

### Шаг 5 — Подтвердить

```
СКИЛЛЫ ЗАПУШЕНЫ
────────────────
Обновлено: [список скиллов]
Коммит:    [hash]
URL:       https://github.com/rudometkin/GenAI-intensive/tree/main/projects/ShakinDanila/Personal/skills
```
