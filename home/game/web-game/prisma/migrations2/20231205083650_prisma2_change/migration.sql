-- CreateTable
CREATE TABLE `log_chat` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `type` SMALLINT UNSIGNED NOT NULL,
    `sender` VARCHAR(16) NOT NULL,
    `target` CHAR(16) NOT NULL DEFAULT '',
    `msg` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `log_chat_serverid_createdAt_idx`(`serverid`, `createdAt`),
    INDEX `log_chat_serverid_sender_createdAt_idx`(`serverid`, `sender`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
