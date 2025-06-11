-- CreateTable
CREATE TABLE `Guild` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `crossServerid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `guildid` CHAR(16) NOT NULL,
    `name` VARCHAR(16) NOT NULL DEFAULT '',
    `info` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Guild_serverid_crossServerid_guildid_name_idx`(`serverid`, `crossServerid`, `guildid`, `name`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
