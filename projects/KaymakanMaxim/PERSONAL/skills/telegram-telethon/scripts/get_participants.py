#!/usr/bin/env python3
"""Dump participants of a chat/group to CSV.

Public channels usually hide members (only admins returned).
Private groups/supergroups where you're a member: full list (up to Telegram caps).

Example:
    python get_participants.py @mychat --out members.csv
"""

from __future__ import annotations

import argparse
import asyncio
import csv
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.client import get_client  # noqa: E402
from lib.antiban import safe_call, human_sleep  # noqa: E402


async def main(chat: str, out_path: str, limit: int) -> None:
    async with get_client() as client:
        await safe_call(client.get_me())
        path = Path(out_path)
        path.parent.mkdir(parents=True, exist_ok=True)
        with open(path, "w", newline="", encoding="utf-8") as f:
            w = csv.writer(f)
            w.writerow(["id", "username", "first_name", "last_name", "phone", "bot", "premium"])
            n = 0
            async for u in client.iter_participants(chat, limit=limit):
                w.writerow([
                    u.id,
                    getattr(u, "username", "") or "",
                    getattr(u, "first_name", "") or "",
                    getattr(u, "last_name", "") or "",
                    getattr(u, "phone", "") or "",
                    bool(getattr(u, "bot", False)),
                    bool(getattr(u, "premium", False)),
                ])
                n += 1
                if n % 200 == 0:
                    await human_sleep(1.0, 2.5)
                    print(f"  ... {n}")
        print(f"[done] {n} rows -> {out_path}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("chat")
    ap.add_argument("--out", required=True)
    ap.add_argument("--limit", type=int, default=None)
    args = ap.parse_args()
    asyncio.run(main(args.chat, args.out, args.limit))
