-- CreateTable
CREATE TABLE `CrossArenaLog` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `seasonid` SMALLINT NOT NULL DEFAULT 0,
    `crossServerid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `roleid` CHAR(16) NOT NULL,
    `atkid` CHAR(16) NOT NULL,
    `point` SMALLINT NOT NULL DEFAULT 0,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` SMALLINT NOT NULL,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `CrossArenaLog_crossServerid_seasonid_state_idx`(`crossServerid`, `seasonid`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
