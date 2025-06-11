-- CreateTable
CREATE TABLE `Role` (
    `id` CHAR(16) NOT NULL,
    `userid` VARCHAR(64) NOT NULL,
    `name` VARCHAR(18) NOT NULL,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `Role_userid_idx`(`userid`),
    INDEX `Role_serverid_userid_idx`(`serverid`, `userid`),
    INDEX `Role_serverid_id_idx`(`serverid`, `id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleInfo` (
    `id` CHAR(16) NOT NULL,
    `rolelevel` MEDIUMINT UNSIGNED NOT NULL DEFAULT 1,
    `exp` INTEGER UNSIGNED NOT NULL DEFAULT 0,
    `gamelevels` MEDIUMINT UNSIGNED NOT NULL DEFAULT 1,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleHero` (
    `id` CHAR(16) NOT NULL,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleItem` (
    `id` CHAR(16) NOT NULL,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `RoleEquip` (
    `id` CHAR(16) NOT NULL,
    `info` JSON NOT NULL,
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Email` (
    `id` BIGINT UNSIGNED NOT NULL,
    `serverid` SMALLINT UNSIGNED NOT NULL DEFAULT 0,
    `title` VARCHAR(16) NOT NULL,
    `content` VARCHAR(400) NOT NULL,
    `items` JSON NOT NULL,
    `state` SMALLINT UNSIGNED NOT NULL,
    `sender` VARCHAR(16) NOT NULL,
    `owner` VARCHAR(16) NOT NULL,
    `time` DATETIME(3) NOT NULL,

    INDEX `Email_serverid_owner_time_state_idx`(`serverid`, `owner`, `time`, `state`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
