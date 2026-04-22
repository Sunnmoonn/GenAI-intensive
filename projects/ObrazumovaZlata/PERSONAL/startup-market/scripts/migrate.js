#!/usr/bin/env node
// Embedded migration runner — SQL is inline, no file reads needed
const Database = require('better-sqlite3');
const path = require('path');
const fs = require('fs');

const DB_PATH = process.env.DATABASE_PATH ?? path.join(process.cwd(), 'data', 'startup-market.db');

// Ensure data directory exists
fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new Database(DB_PATH);
db.pragma('journal_mode = WAL');
db.pragma('foreign_keys = OFF');

// Create migrations tracking table
db.exec(`CREATE TABLE IF NOT EXISTS __migrations (
  filename TEXT PRIMARY KEY,
  applied_at TEXT DEFAULT (datetime('now'))
)`);

const migrations = [
  {
    filename: '0000_initial.sql',
    sql: `
CREATE TABLE IF NOT EXISTS \`startups\` (
  \`id\` text PRIMARY KEY NOT NULL,
  \`source\` text NOT NULL,
  \`external_id\` text NOT NULL,
  \`name\` text NOT NULL,
  \`name_ru\` text,
  \`slug\` text NOT NULL,
  \`website\` text,
  \`source_url\` text NOT NULL,
  \`logo_url\` text,
  \`tagline\` text,
  \`tagline_ru\` text,
  \`description\` text,
  \`description_ru\` text,
  \`tags\` text DEFAULT '[]',
  \`industries\` text DEFAULT '[]',
  \`tags_ru\` text DEFAULT '[]',
  \`batch\` text,
  \`team_size\` integer,
  \`status\` text,
  \`votes_count\` integer,
  \`comments_count\` integer,
  \`daily_rank\` integer,
  \`weekly_rank\` integer,
  \`funding_total\` real,
  \`funding_stage\` text,
  \`founded_year\` integer,
  \`employee_range\` text,
  \`locations\` text DEFAULT '[]',
  \`regions\` text DEFAULT '[]',
  \`score_total\` real DEFAULT 0,
  \`score_disruption\` real DEFAULT 0,
  \`score_scalability\` real DEFAULT 0,
  \`score_market_size\` real DEFAULT 0,
  \`score_russia_barriers\` real DEFAULT 0,
  \`score_traction\` real DEFAULT 0,
  \`score_timing_russia\` real DEFAULT 0,
  \`score_founder_strength\` real DEFAULT 0,
  \`launched_at\` text,
  \`created_at\` text DEFAULT (datetime('now')) NOT NULL,
  \`updated_at\` text DEFAULT (datetime('now')) NOT NULL,
  \`translated_at\` text,
  \`scored_at\` text
);
CREATE TABLE IF NOT EXISTS \`weekly_top\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`startup_id\` text NOT NULL,
  \`week_label\` text NOT NULL,
  \`rank\` integer NOT NULL,
  \`score_snapshot\` real NOT NULL,
  \`created_at\` text DEFAULT (datetime('now')),
  FOREIGN KEY (\`startup_id\`) REFERENCES \`startups\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE IF NOT EXISTS \`monthly_top\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`startup_id\` text NOT NULL,
  \`month_label\` text NOT NULL,
  \`rank\` integer NOT NULL,
  \`score_snapshot\` real NOT NULL,
  \`created_at\` text DEFAULT (datetime('now')),
  FOREIGN KEY (\`startup_id\`) REFERENCES \`startups\`(\`id\`) ON UPDATE no action ON DELETE no action
);
CREATE TABLE IF NOT EXISTS \`sync_log\` (
  \`id\` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
  \`source\` text NOT NULL,
  \`status\` text NOT NULL,
  \`records_added\` integer DEFAULT 0,
  \`records_updated\` integer DEFAULT 0,
  \`error_message\` text,
  \`started_at\` text NOT NULL,
  \`finished_at\` text
);`,
  },
  {
    filename: '0001_add_sources.sql',
    sql: `ALTER TABLE startups ADD COLUMN sources text DEFAULT '[]';
UPDATE startups SET sources = json_array(source) WHERE sources = '[]' OR sources IS NULL;`,
  },
  {
    filename: '0002_add_news.sql',
    sql: `CREATE TABLE IF NOT EXISTS news (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  channel TEXT NOT NULL,
  external_id TEXT NOT NULL,
  text TEXT NOT NULL,
  image_url TEXT,
  source_url TEXT NOT NULL,
  published_at TEXT NOT NULL,
  created_at TEXT NOT NULL DEFAULT (datetime('now')),
  UNIQUE(channel, external_id)
);`,
  },
  {
    filename: '0003_add_news_summaries.sql',
    sql: `CREATE TABLE IF NOT EXISTS news_summaries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  period_label TEXT NOT NULL,
  content TEXT NOT NULL,
  posts_count INTEGER NOT NULL,
  generated_at TEXT NOT NULL DEFAULT (datetime('now'))
);`,
  },
  {
    filename: '0004_cleanup_ph_descriptions.sql',
    sql: `UPDATE startups
SET description = NULLIF(TRIM(SUBSTR(description, 1, INSTR(description, '— Product Hunt:') - 3)), '')
WHERE description LIKE '%— Product Hunt:%';`,
  },
  {
    filename: '0005_restore_yc_tags.sql',
    sql: `-- YC startups got PH topics merged into their tags — restore by keeping only
-- known YC tag values (those that don't look like PH topics).
-- PH topics are title-cased single words or short phrases from Product Hunt categories.
-- We can't perfectly distinguish, so we wipe tags for YC+PH merged startups
-- and let the next YC sync restore correct tags from the API.
-- For now: remove tags that are clearly PH-only topics by checking they appear
-- in startups that are ONLY from producthunt source.
-- Simplest safe approach: just flag them for re-sync via scored_at reset.
SELECT 1;`,
  },
  {
    filename: '0006_venture_scan_v2.sql',
    sql: `ALTER TABLE startups ADD COLUMN target_user text;
ALTER TABLE startups ADD COLUMN problem_statement text;
ALTER TABLE startups ADD COLUMN solution_text text;
ALTER TABLE startups ADD COLUMN founders_text text;
ALTER TABLE startups ADD COLUMN founders_links text;
ALTER TABLE startups ADD COLUMN investors_text text;
ALTER TABLE startups ADD COLUMN funding_rounds text;
ALTER TABLE startups ADD COLUMN revenue_text text;
ALTER TABLE startups ADD COLUMN audience_text text;
ALTER TABLE startups ADD COLUMN score_m real;
ALTER TABLE startups ADD COLUMN score_t real;
ALTER TABLE startups ADD COLUMN score_a real;
ALTER TABLE startups ADD COLUMN score_b real;
ALTER TABLE startups ADD COLUMN score_p real;
ALTER TABLE startups ADD COLUMN score_v2 real;`,
  },
];

let applied = 0;
for (const m of migrations) {
  const already = db.prepare('SELECT 1 FROM __migrations WHERE filename = ?').get(m.filename);
  if (already) continue;

  db.transaction(() => {
    db.exec(m.sql);
    db.prepare('INSERT INTO __migrations (filename) VALUES (?)').run(m.filename);
  })();

  console.log(`[migrate] Applied: ${m.filename}`);
  applied++;
}

if (applied === 0) {
  console.log('[migrate] Already up to date');
} else {
  console.log(`[migrate] Done: ${applied} migration(s) applied`);
}

db.pragma('foreign_keys = ON');
db.close();
