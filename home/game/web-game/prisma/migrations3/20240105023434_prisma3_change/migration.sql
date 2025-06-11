-- CreateTable
CREATE TABLE `loginServerLog` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `gameId` SMALLINT UNSIGNED NOT NULL,
    `gameBackendUserId` INTEGER UNSIGNED NOT NULL,
    `gameUserId` VARCHAR(300) NOT NULL,
    `serverId` MEDIUMINT UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `loginServerLog_gameId_serverId_gameUserId_idx`(`gameId`, `serverId`, `gameUserId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
