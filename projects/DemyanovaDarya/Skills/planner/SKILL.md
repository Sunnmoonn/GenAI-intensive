---
name: planner
description: Reads a Google Sheets schedule, extracts key events (what and when), and creates a structured note in macOS Notes app organized by day and time. Use when user wants to transfer their schedule from Google Sheets into Apple Notes.
allowedTools:
  - Bash
  - Read
  - WebFetch
---

# Planner — Расписание из Google Sheets в Apple Notes

Читает Google Таблицу с расписанием, извлекает ключевую информацию и создаёт структурированную заметку в приложении Заметки (macOS) — по дням и часам.

---

## Triggers

- "перенеси расписание в заметки", "сделай заметку из таблицы"
- "что у меня на этой неделе", "создай расписание в notes"
- "прочитай таблицу и запиши"
- `/planner`

---

## Шаг 1: Получить данные из Google Sheets

**Вариант A — ссылка на таблицу (рекомендуется):**

Таблица должна быть с доступом "Все, у кого есть ссылка". Из обычной ссылки вида:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/edit
```

Сформировать ссылку для выгрузки CSV:
```
https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0
```

Скачать данные:
```bash
curl -L "https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv&gid=0" \
  -o /tmp/schedule.csv
cat /tmp/schedule.csv
```

**Вариант B — пользователь вставляет данные вручную:**

Попросить скопировать содержимое таблицы прямо в чат (Ctrl+A → Ctrl+C в таблице, вставить).

---

## Шаг 2: Разобрать расписание

Из полученных данных извлечь для каждой строки:
- **Дата / день недели**
- **Время начала**
- **Название события / задачи**
- **Комментарий** (если есть)

Сгруппировать по дням. Пропустить пустые строки и строки-заголовки.

Внутренний формат для сборки заметки:
```
День 1: Понедельник, 21 апреля
  10:00 — Встреча с командой
  14:00 — Звонок с клиентом
  18:00 — Личное время

День 2: Вторник, 22 апреля
  09:00 — Работа над проектом
  ...
```

---

## Шаг 3: Создать заметку в Apple Notes

Использовать AppleScript через `osascript`:

```bash
osascript << 'EOF'
tell application "Notes"
  tell account "iCloud"
    make new note at folder "Notes" with properties {
      name: "Расписание — неделя 21–27 апреля",
      body: "Понедельник, 21 апреля

10:00 — Встреча с командой
14:00 — Звонок с клиентом
18:00 — Личное время

Вторник, 22 апреля

09:00 — Работа над проектом
..."
    }
  end tell
end tell
EOF
```

**Важно:** Apple Notes использует HTML внутри. Для переносов строк использовать `<br>`, для заголовков дней — `<b>`:

```bash
osascript -e 'tell application "Notes" to tell account "iCloud" to make new note at folder "Notes" with properties {name:"НАЗВАНИЕ", body:"<b>Понедельник</b><br>10:00 — Событие<br>14:00 — Событие<br><br><b>Вторник</b><br>09:00 — Событие"}'
```

---

## Шаг 4: Открыть Notes для подтверждения

```bash
open -a Notes
```

---

## Полный пример (всё вместе)

```bash
# 1. Скачать таблицу
curl -L "https://docs.google.com/spreadsheets/d/SHEET_ID/export?format=csv" \
  -o /tmp/schedule.csv

# 2. Посмотреть что скачалось
cat /tmp/schedule.csv

# 3. Создать заметку (тело формируется на основе данных из таблицы)
osascript -e 'tell application "Notes"
  tell account "iCloud"
    make new note at folder "Notes" with properties {
      name: "Расписание на неделю",
      body: "<b>Понедельник, 21 апреля</b><br>10:00 — Встреча<br>14:00 — Звонок<br><br><b>Вторник, 22 апреля</b><br>09:00 — Работа"
    }
  end tell
end tell'

# 4. Открыть приложение
open -a Notes
```

---

## Правила форматирования заметки

- Каждый день — отдельный жирный заголовок: `<b>День, дата</b>`
- После заголовка — события в формате `ЧЧ:ММ — Название`
- Между днями — пустая строка (`<br><br>`)
- Если у события есть комментарий — добавить после тире в скобках: `10:00 — Встреча (онлайн, Zoom)`
- События отсортированы по времени внутри дня

---

## Типичные ошибки

**Таблица не скачивается**
Проверить что доступ открыт: Файл → Настройки доступа → Все, у кого есть ссылка → Читатель.

**`osascript: Notes got an error`**
Notes не авторизован в iCloud. Открыть приложение вручную, войти в аккаунт, затем повторить.

**Заметка создалась без переносов строк**
Использовать HTML-теги `<br>` вместо `\n` — Notes игнорирует обычные переносы в AppleScript.

**Таблица в другом формате (не CSV)**
Попросить пользователя: Google Таблица → Файл → Скачать → CSV, затем передать файл.
