CREATE TABLE `model_jobs` (
	`id` text PRIMARY KEY NOT NULL,
	`owner` text NOT NULL,
	`item_id` text NOT NULL,
	`task_id` text,
	`endpoint` text NOT NULL,
	`status` text NOT NULL,
	`data` text NOT NULL,
	`created_at` text NOT NULL
);
