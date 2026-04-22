#!/usr/bin/env python3
"""Send message / file / forward.

Examples:
    python send.py @user "hello"
    python send.py @user --file pic.jpg --caption "photo"
    python send.py @dst --forward-from @src --msg-id 123
"""

from __future__ import annotations

import argparse
import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.client import get_client  # noqa: E402
from lib.antiban import safe_call  # noqa: E402


async def main(args) -> None:
    async with get_client() as client:
        await safe_call(client.get_me())
        if args.forward_from and args.msg_id:
            msg = await safe_call(
                client.forward_messages(args.peer, args.msg_id, args.forward_from)
            )
            print(f"[fwd] -> {args.peer} id={msg.id}")
            return
        if args.file:
            msg = await safe_call(
                client.send_file(args.peer, args.file, caption=args.caption or "")
            )
            print(f"[file] -> {args.peer} id={msg.id}")
            return
        if not args.text:
            print("error: provide text, --file, or --forward-from/--msg-id")
            sys.exit(2)
        msg = await safe_call(client.send_message(args.peer, args.text))
        print(f"[msg] -> {args.peer} id={msg.id}")


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("peer", help="@user / @chan / numeric id")
    ap.add_argument("text", nargs="?", default=None)
    ap.add_argument("--file", default=None)
    ap.add_argument("--caption", default=None)
    ap.add_argument("--forward-from", default=None, help="source peer")
    ap.add_argument("--msg-id", type=int, default=None, help="source msg id to forward")
    asyncio.run(main(ap.parse_args()))
