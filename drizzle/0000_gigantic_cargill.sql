CREATE TABLE `users` (
        `id` text PRIMARY KEY NOT NULL,
        `name` text NOT NULL,
        `email` text NOT NULL,
        `email_verified` integer NOT NULL,
        `image` text,
        `created_at` integer NOT NULL,
        `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `users_email_unique` ON `users` (`email`);
--> statement-breakpoint
CREATE INDEX `users_name_idx` ON `users` (`name`);
--> statement-breakpoint
CREATE TABLE `accounts` (
        `id` text PRIMARY KEY NOT NULL,
        `provider_id` text NOT NULL,
        `account_id` text NOT NULL,
        `user_id` text NOT NULL,
        `access_token` text,
        `refresh_token` text,
        `id_token` text,
        `access_token_expires_at` integer,
        `refresh_token_expires_at` integer,
        `scope` text,
        `password` text,
        `created_at` integer NOT NULL,
        `updated_at` integer NOT NULL,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `accounts_provider_account_unique` ON `accounts` (`provider_id`,`account_id`);
--> statement-breakpoint
CREATE INDEX `accounts_user_id_idx` ON `accounts` (`user_id`);
--> statement-breakpoint
CREATE TABLE `sessions` (
        `id` text PRIMARY KEY NOT NULL,
        `user_id` text NOT NULL,
        `expires_at` integer NOT NULL,
        `token` text NOT NULL,
        `ip_address` text,
        `user_agent` text,
        `created_at` integer NOT NULL,
        `updated_at` integer NOT NULL,
        FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE no action
);
--> statement-breakpoint
CREATE UNIQUE INDEX `sessions_token_unique` ON `sessions` (`token`);
--> statement-breakpoint
CREATE INDEX `sessions_user_id_idx` ON `sessions` (`user_id`);
--> statement-breakpoint
CREATE TABLE `verifications` (
        `id` text PRIMARY KEY NOT NULL,
        `identifier` text NOT NULL,
        `value` text NOT NULL,
        `expires_at` integer NOT NULL,
        `created_at` integer NOT NULL,
        `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE INDEX `verifications_identifier_idx` ON `verifications` (`identifier`);
--> statement-breakpoint
CREATE INDEX `verifications_expires_at_idx` ON `verifications` (`expires_at`);
--> statement-breakpoint
CREATE TABLE `rate_limit` (
        `id` text PRIMARY KEY NOT NULL,
        `key` text NOT NULL,
        `count` integer NOT NULL,
        `last_request` integer NOT NULL,
        `created_at` integer NOT NULL,
        `updated_at` integer NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `rate_limit_key_unique` ON `rate_limit` (`key`);
--> statement-breakpoint
CREATE INDEX `rate_limit_last_request_idx` ON `rate_limit` (`last_request`);
