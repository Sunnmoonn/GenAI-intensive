"""Telethon client factory with antiban defaults.

Loads config from ../secrets.env. Single entrypoint: get_client().
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import Optional

from dotenv import load_dotenv
from telethon import TelegramClient

SKILL_DIR = Path(__file__).resolve().parent.parent
load_dotenv(SKILL_DIR / "secrets.env")


def _parse_proxy(raw: Optional[str]):
    """socks5://user:pass@host:port -> telethon proxy tuple, or None."""
    if not raw:
        return None
    from urllib.parse import urlparse
    try:
        import python_socks  # noqa: F401
    except ImportError as e:
        raise RuntimeError("python-socks not installed; pip install 'python-socks[asyncio]'") from e
    u = urlparse(raw)
    scheme = (u.scheme or "socks5").lower()
    type_map = {"socks5": "socks5", "socks4": "socks4", "http": "http"}
    if scheme not in type_map:
        raise ValueError(f"unsupported proxy scheme: {scheme}")
    return (type_map[scheme], u.hostname, u.port, True, u.username, u.password)


def get_client(session_name: Optional[str] = None) -> TelegramClient:
    """Return configured TelegramClient. Caller must connect/start it.

    Usage:
        async with get_client() as client:
            me = await client.get_me()
    """
    api_id = os.getenv("API_ID")
    api_hash = os.getenv("API_HASH")
    if not api_id or not api_hash:
        raise RuntimeError(
            f"API_ID / API_HASH missing. Fill {SKILL_DIR / 'secrets.env'} "
            f"(copy from secrets.env.example)."
        )

    session_dir = Path(os.getenv("SESSION_DIR", SKILL_DIR / "sessions"))
    session_dir.mkdir(parents=True, exist_ok=True)
    session_name = session_name or os.getenv("SESSION_NAME", "main")
    session_path = str(session_dir / session_name)

    proxy = _parse_proxy(os.getenv("PROXY"))

    # Realistic device fingerprint — avoid Telethon defaults (detectable).
    device_model = os.getenv("DEVICE_MODEL", "MacBookPro18,3")
    system_version = os.getenv("SYSTEM_VERSION", "macOS 14.5")
    app_version = os.getenv("APP_VERSION", "1.0.0")
    lang_code = os.getenv("LANG_CODE", "en")
    system_lang_code = os.getenv("SYSTEM_LANG_CODE", "en")

    client = TelegramClient(
        session_path,
        int(api_id),
        api_hash,
        device_model=device_model,
        system_version=system_version,
        app_version=app_version,
        lang_code=lang_code,
        system_lang_code=system_lang_code,
        proxy=proxy,
        # Raise on flood instead of silent long sleeps — we handle via safe_call.
        flood_sleep_threshold=0,
        # Retry transient network errors a few times.
        connection_retries=5,
        retry_delay=2,
        request_retries=3,
        auto_reconnect=True,
    )
    return client


def get_auth_kwargs() -> dict:
    """Args for client.start(): phone + optional 2FA password."""
    phone = os.getenv("PHONE")
    if not phone:
        raise RuntimeError("PHONE missing in secrets.env")
    kwargs = {"phone": phone}
    tfa = os.getenv("TFA_PASSWORD")
    if tfa:
        kwargs["password"] = tfa
    return kwargs
