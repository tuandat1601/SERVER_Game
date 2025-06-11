-- phpMyAdmin SQL Dump
-- version 5.1.1
-- https://www.phpmyadmin.net/
--
-- 主机： localhost
-- 生成日期： 2024-11-02 13:36:44
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
-- 数据库： `webcross`
--

-- --------------------------------------------------------

--
-- 表的结构 `chatlog`
--

CREATE TABLE `chatlog` (
  `id` int UNSIGNED NOT NULL,
  `crossServerid` smallint UNSIGNED NOT NULL DEFAULT '0',
  `serverid` smallint UNSIGNED NOT NULL DEFAULT '0',
  `type` smallint UNSIGNED NOT NULL,
  `sender` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `target` varchar(16) COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `msg` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `info` json NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `gamerank`
--

CREATE TABLE `gamerank` (
  `id` int UNSIGNED NOT NULL,
  `type` smallint UNSIGNED NOT NULL,
  `roleid` char(16) COLLATE utf8mb4_unicode_ci NOT NULL,
  `crossServerid` smallint UNSIGNED NOT NULL DEFAULT '0',
  `serverid` smallint UNSIGNED NOT NULL DEFAULT '0',
  `val` int NOT NULL DEFAULT '0',
  `info` json NOT NULL,
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- --------------------------------------------------------

--
-- 表的结构 `serverinfo`
--

CREATE TABLE `serverinfo` (
  `id` int NOT NULL,
  `crossServerid` smallint UNSIGNED NOT NULL DEFAULT '0',
  `info` json NOT NULL,
  `nodeid` smallint UNSIGNED NOT NULL DEFAULT '1',
  `updatedAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

--
-- 转存表中的数据 `serverinfo`
--

INSERT INTO `serverinfo` (`id`, `crossServerid`, `info`, `nodeid`, `updatedAt`, `createdAt`) VALUES
(3, 1, '{\"arenaData\": {\"lrank\": [], \"sTime\": \"2024-11-02T00:00:00+08:00\", \"season\": 1}}', 1, '2024-11-02 13:35:50.003', '2024-11-02 02:26:57.283');

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
('15d2adc4-c1e8-47ae-8833-2fda37db9362', '85598ce94bed684309216f1970adeb8b3559ed841b1eea1d692219bcba09eca4', '2024-11-01 01:28:01.782', '20231223053415_prisma4_init', NULL, NULL, '2024-11-01 01:28:01.703', 1);

--
-- 转储表的索引
--

--
-- 表的索引 `chatlog`
--
ALTER TABLE `chatlog`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ChatLog_crossServerid_createdAt_idx` (`crossServerid`,`createdAt`),
  ADD KEY `ChatLog_crossServerid_sender_createdAt_idx` (`crossServerid`,`sender`,`createdAt`);

--
-- 表的索引 `gamerank`
--
ALTER TABLE `gamerank`
  ADD PRIMARY KEY (`id`),
  ADD KEY `GameRank_type_crossServerid_idx` (`type`,`crossServerid`),
  ADD KEY `GameRank_type_crossServerid_val_idx` (`type`,`crossServerid`,`val`);

--
-- 表的索引 `serverinfo`
--
ALTER TABLE `serverinfo`
  ADD PRIMARY KEY (`id`),
  ADD KEY `ServerInfo_crossServerid_idx` (`crossServerid`);

--
-- 表的索引 `_prisma_migrations`
--
ALTER TABLE `_prisma_migrations`
  ADD PRIMARY KEY (`id`);

--
-- 在导出的表使用AUTO_INCREMENT
--

--
-- 使用表AUTO_INCREMENT `chatlog`
--
ALTER TABLE `chatlog`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `gamerank`
--
ALTER TABLE `gamerank`
  MODIFY `id` int UNSIGNED NOT NULL AUTO_INCREMENT;

--
-- 使用表AUTO_INCREMENT `serverinfo`
--
ALTER TABLE `serverinfo`
  MODIFY `id` int NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
