-- CreateTable
CREATE TABLE `log_login` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userid` VARCHAR(64) NOT NULL,
    `roleid` CHAR(16) NOT NULL DEFAULT '0',
    `name` VARCHAR(18) NOT NULL,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `rolelevel` MEDIUMINT UNSIGNED NOT NULL DEFAULT 0,
    `logtime` DATETIME(3) NOT NULL,
    `ip` VARCHAR(14) NOT NULL,

    INDEX `log_login_logtime_serverid_roleid_idx`(`logtime`, `serverid`, `roleid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_gamesys` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logtime` DATETIME(3) NOT NULL,
    `name` VARCHAR(18) NOT NULL,
    `roleid` CHAR(16) NOT NULL DEFAULT '0',
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `type` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `req` JSON NOT NULL,
    `dec` VARCHAR(24) NOT NULL,

    INDEX `log_gamesys_logtime_serverid_type_idx`(`logtime`, `serverid`, `type`),
    INDEX `log_gamesys_logtime_serverid_roleid_type_idx`(`logtime`, `serverid`, `roleid`, `type`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_equip` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logtime` DATETIME(3) NOT NULL,
    `name` VARCHAR(18) NOT NULL,
    `roleid` CHAR(16) NOT NULL DEFAULT '0',
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `type` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `eid` VARCHAR(18) NOT NULL DEFAULT '0',
    `equipid` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `entity` JSON NOT NULL,
    `num` INTEGER NOT NULL DEFAULT 0,
    `dec` VARCHAR(24) NOT NULL,

    INDEX `log_equip_logtime_serverid_equipid_idx`(`logtime`, `serverid`, `equipid`),
    INDEX `log_equip_logtime_serverid_roleid_equipid_idx`(`logtime`, `serverid`, `roleid`, `equipid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `log_item` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `logtime` DATETIME(3) NOT NULL,
    `name` VARCHAR(18) NOT NULL,
    `roleid` CHAR(16) NOT NULL DEFAULT '0',
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `type` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `itemid` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `change` INTEGER NOT NULL DEFAULT 0,
    `last` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `dec` VARCHAR(24) NOT NULL DEFAULT '0',

    INDEX `log_item_logtime_serverid_itemid_idx`(`logtime`, `serverid`, `itemid`),
    INDEX `log_item_logtime_serverid_roleid_itemid_idx`(`logtime`, `serverid`, `roleid`, `itemid`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
