# Скилл: Clone Step 6 — Публикация

## Триггер

Когда MVP прошёл тестирование и нужно выложить его в прод и в репозиторий.

## Что делает

Публикует приложение на Vercel и код на GitHub без секретов, с правильной конфигурацией роутинга.

## Шаги

### GitHub
1. Создать `.gitignore`: обязательно исключить `.env.local`, `.env.*.local`, `.vercel/`, `node_modules/`, `dist/`
2. Проверить: `git status` — нет файлов с секретами
3. Создать `.env.example` с именами переменных без значений
4. Пушить код: `git push origin main`

### Vercel
1. Импортировать GitHub repo в Vercel
2. Добавить env vars в Vercel Dashboard (из `.env.local`)
3. Для SPA (React Router): добавить `vercel.json`:
   ```json
   { "routes": [{ "src": "/(.*)", "dest": "/index.html" }] }
   ```
4. Дождаться деплоя → проверить Production URL

### Supabase (для проектов с Supabase)
1. Убедиться, что RLS включён на всех таблицах
2. Задеплоить Edge Functions: `supabase functions deploy`
3. Добавить Production URL в Supabase → Authentication → URL Configuration

## Чек-лист перед публикацией

- [ ] Нет `.env.local` в репозитории
- [ ] `.env.example` есть и документирует все нужные переменные
- [ ] SPA-роутинг работает (прямой переход на `/dashboard` не даёт 404)
- [ ] Supabase Auth redirect URL указывает на Production домен

## Контекст для подкладки

- Vercel account
- GitHub repo URL
- Список env vars проекта

## Пример

Квантара: обнаружена проблема с `git push` (HTTP 400 при большом объёме) — решена через `git config http.postBuffer 524288000`. Production URL: деплой на Vercel, SPA-роутинг через `vercel.json`.
