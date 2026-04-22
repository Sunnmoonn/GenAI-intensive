---
name: deploy
description: Full workflow for connecting a local project to GitHub and deploying it to Vercel. Covers git init, remote setup, pushing code, Vercel project creation, environment variables, and custom domains. Use when user wants to publish a Next.js or any web project online.
allowedTools:
  - Bash
  - Read
  - Edit
---

# GitHub + Vercel Deploy

Полный цикл: локальный проект → GitHub репозиторий → живой сайт на Vercel.

---

## Triggers

- "задеплой проект", "выложи на vercel", "опубликуй сайт"
- "подключи github", "запушь на гитхаб", "создай репозиторий"
- "настрой vercel", "как задеплоить"
- `/deploy`

---

## Шаг 1: Проверить состояние проекта

```bash
# Есть ли уже git?
ls -la | grep .git

# Есть ли .env с секретами?
ls -la | grep .env
```

Если `.env` или `.env.local` существуют — убедиться что они в `.gitignore` до любых коммитов.

```bash
cat .gitignore | grep env
```

Если не в игноре — добавить немедленно:
```bash
echo ".env.local" >> .gitignore
echo ".env" >> .gitignore
```

---

## Шаг 2: Инициализация git (если нет)

```bash
git init
git add .
git commit -m "Initial commit"
```

Если git уже есть — проверить статус:
```bash
git status
git log --oneline -5
```

---

## Шаг 3: Создать репозиторий на GitHub

**Вариант A — через gh CLI (рекомендуется):**
```bash
# Установить если нет
brew install gh

# Авторизоваться
gh auth login

# Создать репозиторий
gh repo create название-проекта --public --source=. --remote=origin --push
```

**Вариант B — вручную:**
1. Открыть github.com → New repository
2. Название, Public/Private, без README (проект уже есть локально)
3. Скопировать URL репозитория

```bash
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

---

## Шаг 4: Проверить что всё запушилось

```bash
git remote -v
git log --oneline -3
```

Открыть `https://github.com/USERNAME/REPO_NAME` — убедиться что файлы на месте.

---

## Шаг 5: Подключить Vercel

**Вариант A — через vercel CLI:**
```bash
# Установить
npm i -g vercel

# Деплой (запустит мастер настройки)
vercel

# Или сразу в продакшн
vercel --prod
```

**Вариант B — через сайт (проще для первого раза):**
1. Открыть vercel.com → Log in with GitHub
2. New Project → Import Git Repository → выбрать репозиторий
3. Vercel автоматически определит Next.js и настроит build команды
4. Нажать Deploy

---

## Шаг 6: Переменные окружения

Если проект использует `.env.local` — перенести все переменные в Vercel вручную.

**Через сайт:**
Vercel Dashboard → Project → Settings → Environment Variables → Add

**Через CLI:**
```bash
vercel env add ANTHROPIC_API_KEY
# Vercel спросит значение и для каких окружений (Production/Preview/Development)
```

Проверить что переменные подтянулись:
```bash
vercel env ls
```

**Важно:** после добавления переменных нужен новый деплой:
```bash
vercel --prod
```

---

## Шаг 7: Проверить деплой

```bash
vercel ls
```

Открыть URL из вывода команды. Проверить:
- Главная страница открывается
- API-роуты отвечают
- Нет ошибок в логах: Vercel Dashboard → Project → Deployments → кликнуть на деплой → Functions

---

## Автоматический деплой при пуше

После первичной настройки каждый `git push origin main` автоматически запускает новый деплой на Vercel. Ничего делать не нужно.

Для просмотра статуса деплоя:
```bash
vercel ls
```

---

## Если нужно пушить от другого аккаунта

Ситуация: локальный git настроен на один аккаунт, а пушить нужно в репозиторий другого пользователя.

```bash
# Поменять имя и email для текущего репозитория
git config user.name "ИМЯ"
git config user.email "EMAIL@example.com"

# Использовать токен другого аккаунта в URL
git remote set-url origin https://USERNAME:TOKEN@github.com/USERNAME/REPO.git
```

Получить токен: GitHub → Settings → Developer settings → Personal access tokens → Generate new token → выбрать scope `repo`.

---

## Обновить переменную окружения на проде

```bash
# Через CLI
vercel env rm ANTHROPIC_API_KEY production
vercel env add ANTHROPIC_API_KEY production

# Передеплоить
vercel --prod
```

Или через сайт: Vercel → Settings → Environment Variables → Edit.

После смены ключа Next.js dev-сервер кэширует `.env.local` — нужно подождать сообщения `Reload env: .env.local` в терминале.

---

## Типичные ошибки

**`Module not found` при деплое на Vercel**
Библиотека требует Node.js runtime, но Vercel запускает в Edge. Решение:
```ts
// route.ts
export const runtime = "nodejs";
```
```ts
// next.config.ts
serverExternalPackages: ["название-библиотеки"]
```

**`Permission denied` при пуше**
Токен не имеет прав на репозиторий. Проверить: токен создан с scope `repo`, пользователь добавлен как коллаборатор.

**Переменная окружения не подхватывается**
После добавления переменной в Vercel нужен новый деплой. Просто сохранить недостаточно.

**`fatal: not a git repository`**
Команда выполняется не из папки проекта. Сначала `cd /путь/к/проекту`.
