-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2024-11-02 13:36:52
-- 服务器版本： 8.0.24
-- PHP 版本： 7.4.33

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 数据库： `wgbackend`
--

-- --------------------------------------------------------

--
-- 表的结构 `code_email_award`
--

CREATE TABLE `code_email_award` (
  `id` int UNSIGNED NOT NULL,
  `title` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(400) COLLATE utf8mb4_unicode_ci NOT NULL,
  `items` json NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL,
  `serverId` mediumint UNSIGNED NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `games`
--

CREATE TABLE `games` (
  `id` smallint UNSIGNED NOT NULL,
  `name` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `secretkey` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sku` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serverNF` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameUrl` json NOT NULL,
  `channels` json NOT NULL,
  `whitelist` json NOT NULL,
  `blacklist` json NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `info` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `games`
--

INSERT INTO `games` (`id`, `name`, `secretkey`, `sku`, `serverNF`, `gameUrl`, `channels`, `whitelist`, `blacklist`, `createdAt`, `updatedAt`, `info`) VALUES
(1, '荒野锤音', 'PRO_NAMEKEY', 'PRO_NAME', '荒野锤音-', '[\"http://192.168.200.129:891/ln1/\"]', '[{\"appId\": \"888\", \"appKey\": \"88\", \"notice\": [{\"dec\": \"1\", \"name\": \"1\", \"rank\": \"1\"}, {\"dec\": \"888\", \"name\": \"888\", \"rank\": \"888\"}], \"appName\": \"荒野锤音\", \"serverKey\": \"888\", \"channelType\": \"youlong_\", \"channelAppId\": \"888\", \"payMentSwitch\": \"888\", \"user_policy_url\": \"888\", \"privacy_policy_url\": \"888\"}, {\"appId\": \"88\", \"appKey\": \"88\", \"notice\": [], \"appName\": \"88\", \"serverKey\": \"888\", \"channelType\": \"888\", \"channelAppId\": \"888\", \"payMentSwitch\": \"888\", \"user_policy_url\": \"888\", \"privacy_policy_url\": \"888\"}]', '[]', '[]', '2024-11-01 09:27:12', '2024-11-01 18:29:40', '{\"autoVal\": 0, \"chatIPs\": [[\"http://192.168.200.129:4501/\"]], \"autoTime\": \"\", \"crossServer\": [{\"id\": 1, \"url\": \"http://192.168.200.129:891/ln1/\"}], \"autoOpenModel\": false}');

-- --------------------------------------------------------

--
-- 表的结构 `game_backend_user`
--

CREATE TABLE `game_backend_user` (
  `id` int UNSIGNED NOT NULL,
  `channelUserId` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL,
  `channelType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channelAppId` smallint UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `game_code_info`
--

CREATE TABLE `game_code_info` (
  `id` int UNSIGNED NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL,
  `codeName` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `emailId` int NOT NULL,
  `len` int NOT NULL,
  `universal` int NOT NULL,
  `repe` int NOT NULL,
  `isuse` int NOT NULL,
  `endTime` datetime(3) NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `game_code_used`
--

CREATE TABLE `game_code_used` (
  `id` int UNSIGNED NOT NULL,
  `codeinfoId` int UNSIGNED NOT NULL,
  `roleId` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `used` smallint UNSIGNED NOT NULL,
  `actTime` datetime(3) NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `game_comcode_used`
--

CREATE TABLE `game_comcode_used` (
  `id` int UNSIGNED NOT NULL,
  `codeinfoId` int UNSIGNED NOT NULL,
  `roleId` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `code` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `actTime` datetime(3) NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `logins`
--

CREATE TABLE `logins` (
  `id` int UNSIGNED NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL,
  `channelType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `channelAppId` smallint UNSIGNED NOT NULL,
  `gameBackendUserId` int UNSIGNED NOT NULL,
  `gameUserId` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `ipAddress` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `deviceOs` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `deviceVender` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `deviceId` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `deviceType` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `channelToken` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serverLoginToken` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `loginserverlog`
--

CREATE TABLE `loginserverlog` (
  `id` int UNSIGNED NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL,
  `gameBackendUserId` int UNSIGNED NOT NULL,
  `gameUserId` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `serverId` mediumint UNSIGNED NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `orders`
--

CREATE TABLE `orders` (
  `id` int UNSIGNED NOT NULL,
  `serverId` mediumint UNSIGNED NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL,
  `gameBackendUserId` int UNSIGNED NOT NULL,
  `gameUserId` varchar(300) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameRoleId` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `shopId` smallint UNSIGNED NOT NULL,
  `paidAmount` double NOT NULL,
  `paid` smallint UNSIGNED NOT NULL,
  `paidTime` datetime(3) DEFAULT NULL,
  `delivered` smallint UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `serversGameId` smallint UNSIGNED DEFAULT NULL,
  `serversServerId` mediumint UNSIGNED DEFAULT NULL,
  `gameRoleName` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` json NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `qipa_active`
--

CREATE TABLE `qipa_active` (
  `id` int UNSIGNED NOT NULL,
  `active_id` int UNSIGNED NOT NULL,
  `cp_gameId` smallint UNSIGNED NOT NULL,
  `server_id` mediumint UNSIGNED NOT NULL,
  `game_id` int UNSIGNED NOT NULL,
  `is_freee` smallint UNSIGNED NOT NULL,
  `money` int UNSIGNED NOT NULL,
  `coupon_amount` int UNSIGNED NOT NULL,
  `title` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `content` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `player_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `item` varchar(2048) COLLATE utf8mb4_unicode_ci NOT NULL,
  `order_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `cp_gift_group` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `is_test` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `delivered` smallint UNSIGNED NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `qipa_rebate`
--

CREATE TABLE `qipa_rebate` (
  `id` int UNSIGNED NOT NULL,
  `cp_gameId` smallint UNSIGNED NOT NULL,
  `service_id` mediumint UNSIGNED NOT NULL,
  `game_id` int UNSIGNED NOT NULL,
  `rebate_no` int UNSIGNED NOT NULL,
  `rebate_type` smallint UNSIGNED NOT NULL,
  `game_order_no` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `user_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_id` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `pay_money` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gold` int UNSIGNED NOT NULL,
  `delivered` smallint UNSIGNED NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `qipa_rebate`
--

INSERT INTO `qipa_rebate` (`id`, `cp_gameId`, `service_id`, `game_id`, `rebate_no`, `rebate_type`, `game_order_no`, `user_id`, `role_id`, `role_name`, `pay_money`, `gold`, `delivered`, `createdAt`) VALUES
(1, 1, 1, 1, 1, 1, '1', '1', '1', '1', '1', 11, 1, '2024-11-07 12:03:15.000');

-- --------------------------------------------------------

--
-- 表的结构 `servers`
--

CREATE TABLE `servers` (
  `gameId` smallint UNSIGNED NOT NULL,
  `serverId` mediumint UNSIGNED NOT NULL,
  `zoneId` smallint UNSIGNED NOT NULL,
  `name` varchar(18) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `channels` json NOT NULL,
  `gameUrl` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `workload` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `isNew` smallint UNSIGNED NOT NULL,
  `openTime` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `mergeTime` datetime(3) DEFAULT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `info` json NOT NULL,
  `chatIP` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT ''
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `servers`
--

INSERT INTO `servers` (`gameId`, `serverId`, `zoneId`, `name`, `channels`, `gameUrl`, `status`, `workload`, `isNew`, `openTime`, `mergeTime`, `createdAt`, `updatedAt`, `info`, `chatIP`) VALUES
(1, 1, 1, '', '[1, 888]', 'http://192.168.200.129:891/ln1/', 'Open', 'Smooth', 1, '2024-11-01 19:34:54', NULL, '2024-11-01 19:35:01', '2024-11-01 18:27:19', '{\"crossServerId\": 1}', 'http://192.168.200.129:4501/');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE `user` (
  `username` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `nickname` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `password` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `roles` json NOT NULL,
  `auths` json NOT NULL,
  `info` json NOT NULL,
  `status` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`username`, `nickname`, `password`, `roles`, `auths`, `info`, `status`, `createdAt`, `updatedAt`) VALUES
('admin', '管理员', '03030964bd36cbb10d4b1d513c3d1491', '[\"admin\", \"gameAdmin\"]', '[\"admin\"]', '{}', 'normal', '2024-11-01 01:27:12', '2024-11-01 01:27:12');

-- --------------------------------------------------------

--
-- 表的结构 `zones`
--

CREATE TABLE `zones` (
  `id` int NOT NULL,
  `name` varchar(18) COLLATE utf8mb4_unicode_ci NOT NULL,
  `gameId` smallint UNSIGNED NOT NULL,
  `createdAt` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `zones`
--

INSERT INTO `zones` (`id`, `name`, `gameId`, `createdAt`, `updatedAt`) VALUES
(1, '战区一', 1, '2024-11-01 09:27:12', '2024-11-01 01:27:12');

-- --------------------------------------------------------

--
-- 表的结构 `_prisma_migrations`
--

CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int UNSIGNED NOT NULL DEFAULT '0'
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `_prisma_migrations`
--

INSERT INTO `_prisma_migrations` (`id`, `checksum`, `finished_at`, `migration_name`, `logs`, `rolled_back_at`, `started_at`, `applied_steps_count`) VALUES
('02e59169-e0c7-4c74-8e44-f69a284c6e6d', 'dc4ecc6c820dd99c1b97c419826a700c559b0770713c3a026f02cb43f07c1645', '2024-11-01 01:26:24.521', '20230921082444_prisma3_init', NULL, NULL, '2024-11-01 01:26:23.816', 1),
('096ba472-af53-46ac-b9fe-4efcc4b5dc22', 'a0b4c24d9f1636ed0d86a2ff4f7112eebd28124ea3dae879f9f35d0f6596fe98', '2024-11-01 01:26:25.141', '20231211094405_prisma3_change', NULL, NULL, '2024-11-01 01:26:25.060', 1),
('20896340-f22c-4af4-a769-4b616496fc56', '07b6e96e58b8026aa530f4e870091f0b7cff42efd8dc80347b6bed57946e9e1d', '2024-11-01 01:26:25.427', '20240105023434_prisma3_change', NULL, NULL, '2024-11-01 01:26:25.403', 1),
('2bcc0f4d-fd5b-4245-ab06-8b7ca118f7a2', '558445f1a7b9223d873d42b0432f2d067afb83601d75340663ff45e3192275a2', '2024-11-01 01:26:24.697', '20230925094928_prisma3_change', NULL, NULL, '2024-11-01 01:26:24.626', 1),
('4dc208fe-2e6f-4d5c-817c-89221861e2fd', 'a4178ccb71a78d7cf4d2f552083b63d05badbe31279ceda37297a35429952e42', '2024-11-01 01:26:25.057', '20231107060624_prisma3_change', NULL, NULL, '2024-11-01 01:26:25.010', 1),
('6082f58f-658e-49ae-91b8-a8e4d6fcd387', '8b346ae2068748c4653d979e04420be6e849c040f760fc187fa1f282fbdf0926', '2024-11-01 01:26:24.798', '20230926083613_prisma3_change', NULL, NULL, '2024-11-01 01:26:24.700', 1),
('9623f7c8-04f5-48bc-beaf-4c42db28c5b3', '7c3edd1db45f04287fe3bdb77feab27b4d8ff4cb9b5a90937b644a17981508a1', '2024-11-01 01:26:25.007', '20231026084824_prisma3_change', NULL, NULL, '2024-11-01 01:26:24.988', 1),
('a1280b7e-bc35-4ed2-812b-79f415a32119', '68d57dd02080f68a9e4385723530dead13afe1fe3cca454116931b80e5339176', '2024-11-01 01:26:25.548', '20240321064036_prisma3_change', NULL, NULL, '2024-11-01 01:26:25.431', 1),
('b001f33f-2c6f-492a-9a0f-321ea8fe8349', '2c3695516f3134aa59f35ba37c0c0a3e7fd99a5024883cedc465f249ef59215c', '2024-11-01 01:26:25.400', '20240102075747_prisma3_change', NULL, NULL, '2024-11-01 01:26:25.334', 1),
('b5a3c9f3-d06b-4c98-976b-5ee3ca5a74a3', '3d6d99e6b3ffe8613710c9e6df9829465a4ba690857ed29c6802936355b08afd', '2024-11-01 01:26:24.876', '20230927014918_prisma3_change', NULL, NULL, '2024-11-01 01:26:24.800', 1),
('d62932bb-87f3-4280-a75a-9d39f8a003cf', 'c0bacd7d6277a3eb15acabaacb2875ae9d107adc98a517b496db98d972a3a702', '2024-11-01 01:26:24.986', '20230927035714_prisma3_change', NULL, NULL, '2024-11-01 01:26:24.878', 1),
('da14a31d-83e5-42e1-a93f-d753012f7386', 'cb8bb199c08e3168d4a27bcd2fec4af6a2e7b6504cb35c2e2e3d7a15eed589ac', '2024-11-01 01:26:25.261', '20231218024304_prisma3_change', NULL, NULL, '2024-11-01 01:26:25.142', 1),
('e6875131-dea6-4ac3-8b3b-e3712f8ae27f', 'c2ee3cf0a919dce7a3c7b35ed65ce9a3701014a3372568fdae8c94f6694fd420', '2024-11-01 01:26:24.625', '20230922063706_prisma3_change', NULL, NULL, '2024-11-01 01:26:24.524', 1),
('f8bcb4c9-275a-41ed-adb9-f6d7214eed6c', '0898a46be758b1104ed0ffcbfcd09d4c3b83a17771854e2aee796dbd5f3bd5b3', '2024-11-01 01:26:25.332', '20240102015356_prisma3_change', NULL, NULL, '2024-11-01 01:26:25.264', 1);

--
-- 转储表的索引
--

--
-- 表的索引 `code_email_award`
--
ALTER TABLE `code_email_award`
  ADD PRIMARY KEY (`id`),
  ADD KEY `code_email_award_id_idx` (`id`);

--
-- 表的索引 `games`
--
ALTER TABLE `games`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `game_backend_user`
--
ALTER TABLE `game_backend_user`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_backend_user_gameId_channelAppId_channelUserId_idx` (`gameId`,`channelAppId`,`channelUserId`);

--
-- 表的索引 `game_code_info`
--
ALTER TABLE `game_code_info`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `game_code_used`
--
ALTER TABLE `game_code_used`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_code_used_codeinfoId_fkey` (`codeinfoId`),
  ADD KEY `game_code_used_code_gameId_roleId_codeinfoId_used_idx` (`code`,`gameId`,`roleId`,`codeinfoId`,`used`);

--
-- 表的索引 `game_comcode_used`
--
ALTER TABLE `game_comcode_used`
  ADD PRIMARY KEY (`id`),
  ADD KEY `game_comcode_used_codeinfoId_fkey` (`codeinfoId`),
  ADD KEY `game_comcode_used_code_gameId_roleId_codeinfoId_idx` (`code`,`gameId`,`roleId`,`codeinfoId`);

--
-- 表的索引 `logins`
--
ALTER TABLE `logins`
  ADD PRIMARY KEY (`id`),
  ADD KEY `logins_updatedAt_gameId_gameUserId_idx` (`updatedAt`,`gameId`,`gameUserId`),
  ADD KEY `logins_gameId_fkey` (`gameId`),
  ADD KEY `logins_gameBackendUserId_fkey` (`gameBackendUserId`);

--
-- 表的索引 `loginserverlog`
--
ALTER TABLE `loginserverlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `loginServerLog_gameId_serverId_gameUserId_idx` (`gameId`,`serverId`,`gameUserId`);

--
-- 表的索引 `orders`
--
ALTER TABLE `orders`
  ADD PRIMARY KEY (`id`),
  ADD KEY `Orders_createdAt_gameId_serverId_gameUserId_gameRoleId_idx` (`createdAt`,`gameId`,`serverId`,`gameUserId`,`gameRoleId`),
  ADD KEY `Orders_gameId_fkey` (`gameId`),
  ADD KEY `Orders_gameBackendUserId_fkey` (`gameBackendUserId`),
  ADD KEY `Orders_serversGameId_serversServerId_fkey` (`serversGameId`,`serversServerId`);

--
-- 表的索引 `qipa_active`
--
ALTER TABLE `qipa_active`
  ADD PRIMARY KEY (`id`),
  ADD KEY `qipa_active_active_id_idx` (`active_id`);

--
-- 表的索引 `qipa_rebate`
--
ALTER TABLE `qipa_rebate`
  ADD PRIMARY KEY (`id`),
  ADD KEY `qipa_rebate_rebate_no_idx` (`rebate_no`);

--
-- 表的索引 `servers`
--
ALTER TABLE `servers`
  ADD PRIMARY KEY (`gameId`,`serverId`);

--
-- 表的索引 `user`
--
ALTER TABLE `user`
  ADD PRIMARY KEY (`username`);

--
-- 表的索引 `zones`
--
ALTER TABLE `zones`
  ADD PRIMARY KEY (`id`);

--
-- 表的索引 `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `code_email_award`
--
ALTER TABLE `code_email_award`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `games`
--
ALTER TABLE `games`
  MODIFY `id` smallint UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `game_backend_user`
--
ALTER TABLE `game_backend_user`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `game_code_info`
--
ALTER TABLE `game_code_info`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `game_code_used`
--
ALTER TABLE `game_code_used`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `game_comcode_used`
--
ALTER TABLE `game_comcode_used`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `logins`
--
ALTER TABLE `logins`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `loginserverlog`
--
ALTER TABLE `loginserverlog`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `orders`
--
ALTER TABLE `orders`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `qipa_active`
--
ALTER TABLE `qipa_active`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `qipa_rebate`
--
ALTER TABLE `qipa_rebate`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 使用表AUTO_INCREMENT `zones`
--
ALTER TABLE `zones`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- 限制导出的表
--

--
-- 限制表 `game_backend_user`
--
ALTER TABLE `game_backend_user`
  ADD CONSTRAINT `game_backend_user_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- 限制表 `game_code_used`
--
ALTER TABLE `game_code_used`
  ADD CONSTRAINT `game_code_used_codeinfoId_fkey` FOREIGN KEY (`codeinfoId`) REFERENCES `game_code_info` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- 限制表 `game_comcode_used`
--
ALTER TABLE `game_comcode_used`
  ADD CONSTRAINT `game_comcode_used_codeinfoId_fkey` FOREIGN KEY (`codeinfoId`) REFERENCES `game_code_info` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- 限制表 `logins`
--
ALTER TABLE `logins`
  ADD CONSTRAINT `logins_gameBackendUserId_fkey` FOREIGN KEY (`gameBackendUserId`) REFERENCES `game_backend_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `logins_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

--
-- 限制表 `orders`
--
ALTER TABLE `orders`
  ADD CONSTRAINT `Orders_gameBackendUserId_fkey` FOREIGN KEY (`gameBackendUserId`) REFERENCES `game_backend_user` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `Orders_gameId_fkey` FOREIGN KEY (`gameId`) REFERENCES `games` (`id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  ADD CONSTRAINT `Orders_serversGameId_serversServerId_fkey` FOREIGN KEY (`serversGameId`,`serversServerId`) REFERENCES `servers` (`gameId`, `serverId`) ON DELETE SET NULL ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
