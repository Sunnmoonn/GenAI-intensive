#!/usr/bin/env python3
"""List recent dialogs (chats/channels) the account is part of."""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.client import get_client  # noqa: E402
from lib.antiban import safe_call  # noqa: E402


async def main(limit: int) -> None:
    async with get_client() as client:
        await safe_call(client.get_me())  # warmup
        dialogs = await safe_call(client.get_dialogs(limit=limit))
        for d in dialogs:
            kind = "channel" if d.is_channel else ("group" if d.is_group else "user")
            uname = getattr(d.entity, "username", None)
            print(f"{kind:<8} id={d.id:<14} @{uname or '-':<20} {d.name}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--limit", type=int, default=100)
    args = ap.parse_args()
    asyncio.run(main(args.limit))
