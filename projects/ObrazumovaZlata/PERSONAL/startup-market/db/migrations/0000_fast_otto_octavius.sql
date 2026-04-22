CREATE TABLE `monthly_top` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`startup_id` text NOT NULL,
	`month_label` text NOT NULL,
	`rank` integer NOT NULL,
	`score_snapshot` real NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`startup_id`) REFERENCES `startups`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `startups` (
	`id` text PRIMARY KEY NOT NULL,
	`source` text NOT NULL,
	`external_id` text NOT NULL,
	`name` text NOT NULL,
	`name_ru` text,
	`slug` text NOT NULL,
	`website` text,
	`source_url` text NOT NULL,
	`logo_url` text,
	`tagline` text,
	`tagline_ru` text,
	`description` text,
	`description_ru` text,
	`tags` text DEFAULT '[]',
	`industries` text DEFAULT '[]',
	`tags_ru` text DEFAULT '[]',
	`batch` text,
	`team_size` integer,
	`status` text,
	`votes_count` integer,
	`comments_count` integer,
	`daily_rank` integer,
	`weekly_rank` integer,
	`funding_total` real,
	`funding_stage` text,
	`founded_year` integer,
	`employee_range` text,
	`locations` text DEFAULT '[]',
	`regions` text DEFAULT '[]',
	`score_total` real DEFAULT 0,
	`score_disruption` real DEFAULT 0,
	`score_scalability` real DEFAULT 0,
	`score_market_size` real DEFAULT 0,
	`score_russia_barriers` real DEFAULT 0,
	`score_traction` real DEFAULT 0,
	`score_timing_russia` real DEFAULT 0,
	`score_founder_strength` real DEFAULT 0,
	`launched_at` text,
	`created_at` text DEFAULT (datetime('now')) NOT NULL,
	`updated_at` text DEFAULT (datetime('now')) NOT NULL,
	`translated_at` text,
	`scored_at` text
);
--> statement-breakpoint
CREATE TABLE `sync_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`source` text NOT NULL,
	`status` text NOT NULL,
	`records_added` integer DEFAULT 0,
	`records_updated` integer DEFAULT 0,
	`error_message` text,
	`started_at` text NOT NULL,
	`finished_at` text
);
--> statement-breakpoint
CREATE TABLE `weekly_top` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`startup_id` text NOT NULL,
	`week_label` text NOT NULL,
	`rank` integer NOT NULL,
	`score_snapshot` real NOT NULL,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`startup_id`) REFERENCES `startups`(`id`) ON UPDATE no action ON DELETE no action
);
