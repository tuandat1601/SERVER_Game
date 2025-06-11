-- CreateTable
CREATE TABLE `GameRank` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` SMALLINT UNSIGNED NOT NULL,
    `roleid` CHAR(16) NOT NULL,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `val` INTEGER NOT NULL DEFAULT 0,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GameRank_type_serverid_roleid_idx`(`type`, `serverid`, `roleid`),
    INDEX `GameRank_type_serverid_val_idx`(`type`, `serverid`, `val`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatLog` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `type` SMALLINT UNSIGNED NOT NULL,
    `info` JSON NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),

    INDEX `ChatLog_serverid_createdAt_idx`(`serverid`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
