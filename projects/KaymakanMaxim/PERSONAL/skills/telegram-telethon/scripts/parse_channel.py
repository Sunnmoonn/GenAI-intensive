#!/usr/bin/env python3
"""Parse channel history into sqlite. Incremental: resumes from last_id.

Examples:
    python parse_channel.py @durov --db data/durov.db
    python parse_channel.py @durov --limit 1000 --db data/d.db
    python parse_channel.py @durov --search "launch" --db data/d.db
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path
from typing import Optional

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.client import get_client  # noqa: E402
from lib.antiban import safe_call, human_sleep  # noqa: E402
from lib.storage import open_db, save_message, get_last_id  # noqa: E402


async def main(
    channel: str,
    db_path: str,
    limit: Optional[int],
    search: Optional[str],
    full: bool,
) -> None:
    db = open_db(db_path)
    async with get_client() as client:
        me = await safe_call(client.get_me())
        print(f"[auth] @{me.username} id={me.id}")

        min_id = 0 if full else get_last_id(db, channel)
        print(f"[parse] {channel} from msg_id>{min_id} limit={limit} search={search!r}")

        count = 0
        kwargs = dict(entity=channel, limit=limit, reverse=True)
        if not full:
            kwargs["min_id"] = min_id
        if search:
            kwargs["search"] = search
            # search mode can't use reverse+min_id reliably — fall back to plain
            kwargs.pop("reverse", None)
            kwargs.pop("min_id", None)

        async for msg in client.iter_messages(**kwargs):
            save_message(db, channel, msg)
            count += 1
            if count % 50 == 0:
                print(f"  ... {count} saved, last_id={msg.id}")
            if count % 200 == 0:
                await human_sleep(1.0, 3.0)

        print(f"[done] saved {count} messages → {db_path}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("channel", help="@username or numeric id or t.me/joinchat/...")
    ap.add_argument("--db", required=True, help="sqlite path, e.g. data/chan.db")
    ap.add_argument("--limit", type=int, default=None, help="cap messages (None=all)")
    ap.add_argument("--search", default=None, help="server-side keyword filter")
    ap.add_argument("--full", action="store_true", help="re-pull from id=0 (ignores state)")
    args = ap.parse_args()
    asyncio.run(main(args.channel, args.db, args.limit, args.search, args.full))
