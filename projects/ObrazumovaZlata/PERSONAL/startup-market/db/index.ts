import Database from 'better-sqlite3';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import type { BetterSQLite3Database } from 'drizzle-orm/better-sqlite3';
import * as schema from './schema';
import path from 'path';

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'startup-market.db');

// Lazy singleton — only opens on first use, not at import time
let _db: BetterSQLite3Database<typeof schema> | null = null;
let _sqlite: Database.Database | null = null;

function getDb() {
  if (!_db) {
    _sqlite = new Database(DB_PATH);
    _sqlite.pragma('journal_mode = WAL');
    _sqlite.pragma('synchronous = NORMAL');
    _sqlite.pragma('foreign_keys = ON');
    _db = drizzle(_sqlite, { schema });
  }
  return _db;
}

export const db = new Proxy({} as BetterSQLite3Database<typeof schema>, {
  get(_target, prop) {
    return (getDb() as unknown as Record<string | symbol, unknown>)[prop];
  },
});

export function getSqlite() {
  getDb(); // ensure initialized
  return _sqlite!;
}
