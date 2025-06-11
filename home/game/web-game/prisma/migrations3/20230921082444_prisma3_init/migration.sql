-- CreateTable
CREATE TABLE `user` (
    `username` VARCHAR(18) NOT NULL,
    `nickname` VARCHAR(18) NOT NULL,
    `password` VARCHAR(64) NOT NULL,
    `roles` JSON NOT NULL,
    `auths` JSON NOT NULL,
    `info` JSON NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (`username`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `games` (
    `id` SMALLINT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(18) NOT NULL,
    `secretkey` VARCHAR(18) NOT NULL,
    `sku` VARCHAR(18) NOT NULL,
    `serverNF` VARCHAR(18) NOT NULL,
    `gameUrl` JSON NOT NULL,
    `channels` JSON NOT NULL,
    `whitelist` JSON NOT NULL,
    `blacklist` JSON NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `servers` (
    `gameId` SMALLINT UNSIGNED NOT NULL,
    `serverId` MEDIUMINT UNSIGNED NOT NULL,
    `zoneId` SMALLINT UNSIGNED NOT NULL,
    `name` VARCHAR(18) NULL,
    `channels` JSON NOT NULL,
    `gameUrl` VARCHAR(191) NOT NULL,
    `status` VARCHAR(191) NOT NULL,
    `workload` VARCHAR(191) NOT NULL,
    `isNew` SMALLINT UNSIGNED NOT NULL,
    `openTime` DATETIME NOT NULL DEFAULT NOW(),
    `mergeTime` DATETIME(3) NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (`gameId`, `serverId`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `zones` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(18) NOT NULL,
    `gameId` SMALLINT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_backend_user` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `channelUserId` VARCHAR(64) NOT NULL,
    `gameId` SMALLINT UNSIGNED NOT NULL,
    `channelType` VARCHAR(191) NOT NULL,
    `channelAppId` SMALLINT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    INDEX `game_backend_user_gameId_channelAppId_channelUserId_idx`(`gameId`, `channelAppId`, `channelUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Orders` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `serverId` MEDIUMINT UNSIGNED NOT NULL,
    `gameId` SMALLINT UNSIGNED NOT NULL,
    `gameBackendUserId` INTEGER UNSIGNED NOT NULL,
    `gameUserId` VARCHAR(64) NOT NULL,
    `gameRoleId` VARCHAR(16) NOT NULL,
    `RoleName` VARCHAR(18) NOT NULL,
    `shopId` SMALLINT UNSIGNED NOT NULL,
    `paidAmount` SMALLINT UNSIGNED NOT NULL,
    `paid` SMALLINT UNSIGNED NOT NULL,
    `paidTime` DATETIME(3) NULL,
    `delivered` SMALLINT UNSIGNED NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),
    `serversGameId` SMALLINT UNSIGNED NULL,
    `serversServerId` MEDIUMINT UNSIGNED NULL,

    INDEX `Orders_createdAt_gameId_serverId_gameUserId_gameRoleId_idx`(`createdAt`, `gameId`, `serverId`, `gameUserId`, `gameRoleId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `logins` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `gameId` SMALLINT UNSIGNED NOT NULL,
    `channelType` VARCHAR(191) NOT NULL,
    `channelAppId` SMALLINT UNSIGNED NOT NULL,
    `gameBackendUserId` INTEGER UNSIGNED NOT NULL,
    `gameUserId` VARCHAR(64) NOT NULL,
    `ipAddress` VARCHAR(191) NOT NULL,
    `deviceOs` VARCHAR(191) NOT NULL DEFAULT '',
    `deviceVender` VARCHAR(191) NOT NULL DEFAULT '',
    `deviceId` VARCHAR(191) NOT NULL DEFAULT '',
    `deviceType` VARCHAR(191) NOT NULL DEFAULT '',
    `channelToken` VARCHAR(191) NOT NULL,
    `serverLoginToken` VARCHAR(191) NOT NULL,
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    INDEX `logins_updatedAt_gameId_gameUserId_idx`(`updatedAt`, `gameId`, `gameUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_code_info` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `gameId` SMALLINT UNSIGNED NOT NULL,
    `codeName` VARCHAR(191) NOT NULL,
    `emailId` INTEGER NOT NULL,
    `len` INTEGER NOT NULL,
    `universal` INTEGER NOT NULL,
    `repe` INTEGER NOT NULL,
    `isuse` INTEGER NOT NULL,
    `endTime` DATETIME(3) NOT NULL,
    `createdAt` DATETIME NOT NULL DEFAULT NOW(),
    `updatedAt` TIMESTAMP(0) NOT NULL DEFAULT NOW() ON UPDATE NOW(),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_code_used` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codeinfoId` INTEGER UNSIGNED NOT NULL,
    `roleId` VARCHAR(16) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `used` SMALLINT UNSIGNED NOT NULL,
    `actTime` DATETIME(3) NOT NULL,

    INDEX `game_code_used_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `game_comcode_used` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `codeinfoId` INTEGER UNSIGNED NOT NULL,
    `roleId` VARCHAR(16) NOT NULL,
    `code` VARCHAR(191) NOT NULL,
    `actTime` DATETIME(3) NOT NULL,

    INDEX `game_comcode_used_code_idx`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `code_email_award` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(16) NOT NULL,
    `content` VARCHAR(400) NOT NULL,
    `items` JSON NOT NULL,

    INDEX `code_email_award_id_idx`(`id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `game_backend_user` ADD CONSTRAINT `game_backend_user_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_gameBackendUserId_fkey` FOREIGN KEY (`gameBackendUserId`) REFERENCES `game_backend_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Orders` ADD CONSTRAINT `Orders_serversGameId_serversServerId_fkey` FOREIGN KEY (`serversGameId`, `serversServerId`) REFERENCES `servers`(`gameId`, `serverId`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logins` ADD CONSTRAINT `logins_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `logins` ADD CONSTRAINT `logins_gameBackendUserId_fkey` FOREIGN KEY (`gameBackendUserId`) REFERENCES `game_backend_user`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_code_used` ADD CONSTRAINT `game_code_used_codeinfoId_fkey` FOREIGN KEY (`codeinfoId`) REFERENCES `game_code_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `game_comcode_used` ADD CONSTRAINT `game_comcode_used_codeinfoId_fkey` FOREIGN KEY (`codeinfoId`) REFERENCES `game_code_info`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
