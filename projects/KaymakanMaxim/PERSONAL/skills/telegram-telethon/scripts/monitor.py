#!/usr/bin/env python3
"""Live-monitor channels/chats. Optional keyword filter. Saves hits to sqlite.

Examples:
    python monitor.py @chan1 @chan2
    python monitor.py @chan1 --keywords "price,launch,deal" --db data/hits.db
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path
from typing import List, Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from telethon import events  # noqa: E402

from lib.client import get_client  # noqa: E402
from lib.antiban import safe_call  # noqa: E402
from lib.storage import open_db, save_message  # noqa: E402


async def main(chats: List[str], keywords: Optional[List[str]], db_path: Optional[str]) -> None:
    db = open_db(db_path) if db_path else None
    kw = [k.lower().strip() for k in keywords] if keywords else []

    async with get_client() as client:
        me = await safe_call(client.get_me())
        print(f"[auth] @{me.username}")

        # Resolve once so events can filter by entity.
        resolved = []
        for c in chats:
            try:
                ent = await safe_call(client.get_entity(c))
                resolved.append(ent)
                print(f"[watch] {c} -> id={ent.id} title={getattr(ent, 'title', None)}")
            except Exception as e:
                print(f"[skip] {c}: {e}")

        @client.on(events.NewMessage(chats=resolved))
        async def handler(e):
            text = (e.raw_text or "").lower()
            if kw and not any(k in text for k in kw):
                return
            src = getattr(e.chat, "username", None) or getattr(e.chat, "title", str(e.chat_id))
            print(f"{e.date} @{src} #{e.id}: {(e.raw_text or '')[:300]}")
            if db is not None:
                save_message(db, src, e.message)

        print("[ready] listening... ctrl-c to stop")
        await client.run_until_disconnected()


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("chats", nargs="+")
    ap.add_argument("--keywords", default=None, help="comma-separated, case-insensitive")
    ap.add_argument("--db", default=None)
    args = ap.parse_args()
    kws = args.keywords.split(",") if args.keywords else None
    asyncio.run(main(args.chats, kws, args.db))
