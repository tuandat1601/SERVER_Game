-- CreateTable
CREATE TABLE `GameRank` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `type` SMALLINT UNSIGNED NOT NULL,
    `roleid` CHAR(16) NOT NULL,
    `crossServerid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `val` INTEGER NOT NULL DEFAULT 0,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `GameRank_type_crossServerid_idx`(`type`, `crossServerid`),
    INDEX `GameRank_type_crossServerid_val_idx`(`type`, `crossServerid`, `val`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ChatLog` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `crossServerid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `type` SMALLINT UNSIGNED NOT NULL,
    `sender` VARCHAR(16) NOT NULL DEFAULT '',
    `target` VARCHAR(16) NOT NULL DEFAULT '',
    `msg` VARCHAR(191) NOT NULL,
    `info` JSON NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ChatLog_crossServerid_createdAt_idx`(`crossServerid`, `createdAt`),
    INDEX `ChatLog_crossServerid_sender_createdAt_idx`(`crossServerid`, `sender`, `createdAt`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ServerInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `crossServerid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `info` JSON NOT NULL,
    `nodeid` SMALLINT UNSIGNED NOT NULL DEFAULT 1,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ServerInfo_crossServerid_idx`(`crossServerid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
