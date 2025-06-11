-- CreateTable
CREATE TABLE `qipa_rebate` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `cp_gameId` SMALLINT UNSIGNED NOT NULL,
    `service_id` MEDIUMINT UNSIGNED NOT NULL,
    `game_id` INTEGER UNSIGNED NOT NULL,
    `rebate_no` INTEGER UNSIGNED NOT NULL,
    `rebate_type` SMALLINT UNSIGNED NOT NULL,
    `game_order_no` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `role_id` VARCHAR(191) NOT NULL,
    `role_name` VARCHAR(191) NOT NULL,
    `pay_money` VARCHAR(191) NOT NULL,
    `gold` INTEGER UNSIGNED NOT NULL,
    `delivered` SMALLINT UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `qipa_rebate_rebate_no_idx`(`rebate_no`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `qipa_active` (
    `id` INTEGER UNSIGNED NOT NULL AUTO_INCREMENT,
    `active_id` INTEGER UNSIGNED NOT NULL,
    `cp_gameId` SMALLINT UNSIGNED NOT NULL,
    `server_id` MEDIUMINT UNSIGNED NOT NULL,
    `game_id` INTEGER UNSIGNED NOT NULL,
    `is_freee` SMALLINT UNSIGNED NOT NULL,
    `money` INTEGER UNSIGNED NOT NULL,
    `coupon_amount` INTEGER UNSIGNED NOT NULL,
    `title` VARCHAR(191) NOT NULL,
    `content` VARCHAR(191) NOT NULL,
    `player_id` VARCHAR(191) NOT NULL,
    `item` VARCHAR(191) NOT NULL,
    `order_id` VARCHAR(191) NOT NULL,
    `user_id` VARCHAR(191) NOT NULL,
    `cp_gift_group` VARCHAR(191) NOT NULL,
    `is_test` VARCHAR(191) NOT NULL,
    `delivered` SMALLINT UNSIGNED NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    INDEX `qipa_active_active_id_idx`(`active_id`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
