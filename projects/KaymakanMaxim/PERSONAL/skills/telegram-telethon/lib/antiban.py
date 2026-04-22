"""Antiban helpers: flood-wait retries, rate limiting, human-like sleeps."""

from __future__ import annotations

import asyncio
import random
import time
from typing import Awaitable, TypeVar

from telethon.errors import (
    FloodWaitError,
    FloodError,
    ServerError,
    RPCError,
)

T = TypeVar("T")


class RateLimiter:
    """Simple global throttle. Default 1 request/sec — safe baseline.

    Share one instance across the program: token-bucket-ish.
    """

    def __init__(self, rps: float = 1.0):
        self.min_interval = 1.0 / max(rps, 0.1)
        self._last = 0.0
        self._lock = asyncio.Lock()

    async def wait(self) -> None:
        async with self._lock:
            now = time.monotonic()
            delta = now - self._last
            if delta < self.min_interval:
                await asyncio.sleep(self.min_interval - delta)
            self._last = time.monotonic()


_global_limiter = RateLimiter(rps=1.0)


def set_global_rps(rps: float) -> None:
    """Override global rate. Call once at startup if needed."""
    global _global_limiter
    _global_limiter = RateLimiter(rps=rps)


async def human_sleep(min_s: float = 1.0, max_s: float = 3.0) -> None:
    """Random sleep with jitter. Use between batches of heavy ops."""
    await asyncio.sleep(random.uniform(min_s, max_s))


async def safe_call(coro: Awaitable[T], max_retries: int = 5) -> T:
    """Await coro with flood-wait + transient-error retries.

    Usage:
        result = await safe_call(client.send_message(peer, "hi"))
    """
    attempt = 0
    while True:
        await _global_limiter.wait()
        try:
            return await coro
        except FloodWaitError as e:
            wait = int(getattr(e, "seconds", 5)) + random.randint(1, 5)
            if wait > 3600:
                raise  # more than an hour — bail, caller decides
            print(f"[antiban] FloodWait {e.seconds}s, sleeping {wait}s")
            await asyncio.sleep(wait)
        except (ServerError, FloodError) as e:
            attempt += 1
            if attempt > max_retries:
                raise
            backoff = min(2 ** attempt, 60) + random.uniform(0, 2)
            print(f"[antiban] {type(e).__name__}: retry {attempt}/{max_retries} in {backoff:.1f}s")
            await asyncio.sleep(backoff)
        except RPCError as e:
            # unknown RPC errors — bubble up so caller sees them
            print(f"[antiban] RPC error: {e}")
            raise


async def throttled_iter(async_iter, sleep_every: int = 100, min_s: float = 1.0, max_s: float = 2.5):
    """Wrap Telethon iter_* with periodic human_sleep. Usage:

        async for msg in throttled_iter(client.iter_messages(chan, limit=10000)):
            ...
    """
    count = 0
    async for item in async_iter:
        yield item
        count += 1
        if count % sleep_every == 0:
            await human_sleep(min_s, max_s)
