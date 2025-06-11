-- AlterTable
ALTER TABLE `roleequip` ADD COLUMN `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `rolehero` ADD COLUMN `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `roleinfo` ADD COLUMN `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 1;

-- AlterTable
ALTER TABLE `roleitem` ADD COLUMN `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 1;

-- CreateTable
CREATE TABLE `ArenaRank` (
    `id` CHAR(16) NOT NULL,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `p` SMALLINT NOT NULL DEFAULT 0,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ArenaRank_serverid_p_idx`(`serverid`, `p`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `ArenaLog` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `seasonid` SMALLINT NOT NULL DEFAULT 0,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `roleid` CHAR(16) NOT NULL,
    `atkid` CHAR(16) NOT NULL,
    `point` SMALLINT NOT NULL DEFAULT 0,
    `time` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `state` SMALLINT NOT NULL,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `ArenaLog_serverid_seasonid_state_idx`(`serverid`, `seasonid`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE INDEX `ServerInfo_serverid_idx` ON `ServerInfo`(`serverid`);
