# telegram-telethon — setup

## 1. API keys

Go to https://my.telegram.org → **API development tools** → create app. Grab:
- `api_id` (int)
- `api_hash` (str, 32 chars)

## 2. Install

```bash
cd ~/.claude/skills/telegram-telethon
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

## 3. Configure

```bash
cp secrets.env.example secrets.env
```

Edit `secrets.env`:

```
API_ID=12345678
API_HASH=abcdef0123456789abcdef0123456789
PHONE=+79991234567
# optional:
# TFA_PASSWORD=your_2fa_password
# PROXY=socks5://user:pass@host:1080
# SESSION_DIR=./sessions
# SESSION_NAME=main
# DEVICE_MODEL=MacBookPro18,3
# SYSTEM_VERSION=macOS 14.5
# APP_VERSION=1.0.0
# LANG_CODE=ru
# SYSTEM_LANG_CODE=ru
```

## 4. First auth

```bash
python scripts/auth.py
```

Script will:
1. Connect to Telegram DC.
2. Ask for SMS code (arrives in Telegram app as "Login code").
3. If 2FA — ask password (or read `TFA_PASSWORD`).
4. Save `sessions/main.session`.

After this, all other scripts reuse the session — no code needed again unless you delete the file or get a `AuthKeyUnregisteredError`.

## 5. Verify

```bash
python scripts/get_dialogs.py
```

Prints your recent chats/channels. If you see them — you're in.

## 6. Run tasks

See `SKILL.md` → Quick reference.

## Safety notes

- `secrets.env` and `sessions/*.session` are gitignored. Never commit.
- Session file = full login. Treat like a password.
- One process per session. Parallel = `AuthKeyDuplicatedError`.
- Test on a secondary account first if you're doing heavy parsing.
