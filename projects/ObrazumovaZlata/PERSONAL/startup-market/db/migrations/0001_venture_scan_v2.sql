-- VENTURE-SCAN RF 2.0: add detailed analysis fields and v2 scoring columns

ALTER TABLE `startups` ADD COLUMN `target_user` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `problem_statement` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `solution_text` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `founders_text` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `founders_links` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `investors_text` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `funding_rounds` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `revenue_text` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `audience_text` text;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `score_m` real;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `score_t` real;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `score_a` real;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `score_b` real;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `score_p` real;
--> statement-breakpoint
ALTER TABLE `startups` ADD COLUMN `score_v2` real;
