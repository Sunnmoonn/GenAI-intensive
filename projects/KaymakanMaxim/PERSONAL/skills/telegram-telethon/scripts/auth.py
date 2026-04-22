#!/usr/bin/env python3
"""First-time auth: creates sessions/<name>.session.

Run once per account. Prompts for SMS code (and 2FA if set).
"""

from __future__ import annotations

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from lib.client import get_client, get_auth_kwargs  # noqa: E402


async def main() -> None:
    client = get_client()
    await client.start(**get_auth_kwargs())
    me = await client.get_me()
    print(f"OK. Logged in as @{me.username} ({me.first_name}) id={me.id}")
    await client.disconnect()


if __name__ == "__main__":
    asyncio.run(main())
