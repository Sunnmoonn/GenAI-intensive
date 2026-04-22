"""SQLite storage for parsed messages + parse state.

Schema is intentionally generic — extend per-product as needed.
"""

from __future__ import annotations

import json
import sqlite3
from pathlib import Path
from typing import Optional

SCHEMA = """
CREATE TABLE IF NOT EXISTS messages (
    channel     TEXT NOT NULL,
    msg_id      INTEGER NOT NULL,
    date        TEXT,
    sender_id   INTEGER,
    text        TEXT,
    views       INTEGER,
    forwards    INTEGER,
    reply_to    INTEGER,
    reactions   TEXT,      -- JSON: [{"emoji":"🔥","count":12}, ...]
    media_type  TEXT,
    raw         TEXT,      -- JSON dump of full message for later re-parsing
    PRIMARY KEY (channel, msg_id)
);
CREATE INDEX IF NOT EXISTS idx_messages_date ON messages(date);
CREATE INDEX IF NOT EXISTS idx_messages_channel ON messages(channel);

CREATE TABLE IF NOT EXISTS parse_state (
    channel     TEXT PRIMARY KEY,
    last_id     INTEGER NOT NULL,
    updated_at  TEXT NOT NULL
);
"""


def open_db(path: str) -> sqlite3.Connection:
    p = Path(path)
    p.parent.mkdir(parents=True, exist_ok=True)
    db = sqlite3.connect(str(p))
    db.executescript(SCHEMA)
    db.commit()
    return db


def _reactions_json(msg) -> Optional[str]:
    r = getattr(msg, "reactions", None)
    if not r or not getattr(r, "results", None):
        return None
    out = []
    for res in r.results:
        emoji = getattr(res.reaction, "emoticon", None) or str(res.reaction)
        out.append({"emoji": emoji, "count": res.count})
    return json.dumps(out, ensure_ascii=False)


def _media_type(msg) -> Optional[str]:
    m = getattr(msg, "media", None)
    if not m:
        return None
    return type(m).__name__  # MessageMediaPhoto, MessageMediaDocument, ...


def save_message(db: sqlite3.Connection, channel: str, msg) -> None:
    db.execute(
        """INSERT OR REPLACE INTO messages
        (channel, msg_id, date, sender_id, text, views, forwards, reply_to,
         reactions, media_type, raw)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
        (
            channel,
            msg.id,
            msg.date.isoformat() if msg.date else None,
            getattr(msg, "sender_id", None),
            msg.text or "",
            getattr(msg, "views", None),
            getattr(msg, "forwards", None),
            getattr(getattr(msg, "reply_to", None), "reply_to_msg_id", None),
            _reactions_json(msg),
            _media_type(msg),
            json.dumps(msg.to_dict(), default=str, ensure_ascii=False),
        ),
    )
    db.execute(
        """INSERT INTO parse_state (channel, last_id, updated_at)
        VALUES (?, ?, datetime('now'))
        ON CONFLICT(channel) DO UPDATE SET
            last_id = MAX(last_id, excluded.last_id),
            updated_at = excluded.updated_at""",
        (channel, msg.id),
    )
    db.commit()


def get_last_id(db: sqlite3.Connection, channel: str) -> int:
    row = db.execute(
        "SELECT last_id FROM parse_state WHERE channel = ?", (channel,)
    ).fetchone()
    return row[0] if row else 0
