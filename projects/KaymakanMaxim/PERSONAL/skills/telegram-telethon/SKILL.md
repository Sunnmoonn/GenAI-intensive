---
name: telegram-telethon
description: Use when user wants to parse Telegram channels/chats, monitor messages live, send messages, fetch participants, or do anything else via Telegram MTProto user-API. Antiban defaults baked in (flood-wait handling, rate limits, human-like sleeps, realistic device params). Invoke for any Telegram automation, scraping, or bot-like-but-user-account task.
---

# telegram-telethon

User-API toolkit (Telethon, MTProto) with antiban defaults. One-time auth creates `.session` file, then reuse across tasks.

## When to use

- Parse channel history (text, views, reactions, media)
- Live monitor channels with keywords
- Fetch chat participants
- Send messages / files / forwards as user
- Any MTProto task a bot can't do (read public channels, access full history, user-level actions)

## When NOT to use

- Sending from a bot account → use Bot API (`aiogram`/`python-telegram-bot`)
- Business messenger features for customers → use official Telegram Bot Business API

## Setup (one-time)

```bash
cd ~/.claude/skills/telegram-telethon
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
cp secrets.env.example secrets.env
# edit secrets.env — put api_id, api_hash, phone (see README.md)
python scripts/auth.py   # prompts for SMS code, saves session
```

After auth, `sessions/main.session` exists. Reuse in all scripts.

## Quick reference

| Task | Script |
|------|--------|
| First auth | `python scripts/auth.py` |
| List your chats/channels | `python scripts/get_dialogs.py` |
| Parse channel history | `python scripts/parse_channel.py @chan --limit 1000 --db data.db` |
| Live monitor + keywords | `python scripts/monitor.py @chan1 @chan2 --keywords "word1,word2"` |
| Send message | `python scripts/send.py @user "hi"` |
| Send file | `python scripts/send.py @user --file pic.jpg --caption "photo"` |
| Get participants (chats only) | `python scripts/get_participants.py @chat --out members.csv` |

All scripts load creds from `secrets.env` and session from `sessions/main.session` by default. Override: `--session other` or `SESSION=other python ...`.

## Antiban defaults (already set in `lib/client.py` + `lib/antiban.py`)

- Realistic `device_model`, `system_version`, `app_version`, `lang_code`, `system_lang_code` (not Telethon defaults).
- Global `RateLimiter(rps=1)` — max 1 request/second across client.
- `FloodWaitError` auto-caught → sleep `e.seconds + random(1..5)` → retry.
- `human_sleep(min_s, max_s)` between batches in scripts (1-3s default).
- Single-account-per-session rule (never parallel same session).
- Warmup on first connect: `get_me()` before heavy pulls.
- Incremental parsing via `storage.get_last_id()` — no full re-pulls.
- No auto-join, no auto-follow, no mass-send helpers on purpose.
- Proxy support: set `PROXY=socks5://user:pass@host:port` in `secrets.env`.

## Common tasks — code patterns

### Parse channel incrementally

```python
# scripts/parse_channel.py --chan @somechan --db data.db
# under the hood:
from lib.client import get_client
from lib.antiban import human_sleep, safe_call
from lib.storage import open_db, save_message, get_last_id

async def run(chan, db_path):
    db = open_db(db_path)
    async with get_client() as client:
        last = get_last_id(db, chan)
        async for msg in client.iter_messages(chan, min_id=last, reverse=True):
            save_message(db, chan, msg)
            if msg.id % 200 == 0:
                await human_sleep(1, 3)
```

### Live monitor with keywords

```python
from telethon import events
from lib.client import get_client

KEYWORDS = {"price", "deal", "launch"}

async def run(chans):
    async with get_client() as client:
        @client.on(events.NewMessage(chats=chans))
        async def handler(e):
            text = (e.raw_text or "").lower()
            if any(k in text for k in KEYWORDS):
                print(e.date, e.chat.username, text[:200])
        await client.run_until_disconnected()
```

### Send with retries

```python
from lib.client import get_client
from lib.antiban import safe_call

async def send(peer, text):
    async with get_client() as client:
        await safe_call(client.send_message(peer, text))
```

## Extending — adding new task

1. Add script to `scripts/`, import `lib.client.get_client`, `lib.antiban.*`.
2. Wrap every Telethon API call with `safe_call(...)` or use `iter_*` (already batched).
3. Sleep between heavy loops with `human_sleep()`.
4. Persist state (last id, cursor) to sqlite so restart doesn't re-pull.
5. Never spawn multiple clients on same session file.

## Scaling to many accounts (later)

- One `.session` per account in `sessions/`.
- Separate worker process per session (no async-share).
- Orchestrate via queue (RabbitMQ/Redis) + per-account rate limits.
- Rotate proxies per account, one proxy per account, never mix.

## Red flags

- Parsing >10k messages in a burst without sleeps → flood ban.
- Joining many channels rapidly → phone-number lock.
- Using same session from two processes → desync/disconnect.
- Sending identical text to many users → spam flag.
- Running without `safe_call` → unhandled `FloodWaitError` kills script.

## Troubleshooting

| Error | Fix |
|-------|-----|
| `FloodWaitError: wait N seconds` | Handled by `safe_call`. If raw: `await asyncio.sleep(N + 2)`. |
| `PhoneNumberBannedError` | Account dead. New number. |
| `SessionPasswordNeededError` | 2FA on account → `client.start(password='...')`. |
| `AuthKeyDuplicatedError` | Two processes on one session. Kill one, re-auth. |
| `ChannelPrivateError` | Not a member / kicked. Join first or skip. |
| `UsernameNotOccupiedError` | Wrong `@handle`. |

## File layout

```
telegram-telethon/
  SKILL.md              # this file
  README.md             # setup walkthrough
  requirements.txt
  secrets.env.example
  .gitignore
  lib/
    client.py           # get_client() factory with antiban
    antiban.py          # RateLimiter, safe_call, human_sleep
    storage.py          # sqlite helpers
  scripts/
    auth.py
    get_dialogs.py
    parse_channel.py
    monitor.py
    send.py
    get_participants.py
  sessions/             # .session files (gitignored)
```
