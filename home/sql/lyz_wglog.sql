-- MySQL dump 10.13  Distrib 8.0.24, for Linux (x86_64)
--
-- Host: localhost    Database: wglog
-- ------------------------------------------------------
-- Server version	8.0.24

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('31fb3857-845c-4985-bb68-3fb9e790d621','4a119bcd020eab1ce10e3d472a944e2957c9d4955e2f0918dea25dab3d29c2d9','2024-11-01 01:24:23.386','20231205083650_prisma2_change',NULL,NULL,'2024-11-01 01:24:23.359',1),('b9c33961-0b76-47d7-8ba3-49104fdee725','b572526446a8cfe00f7c8c0f139e1fa88ca19c345d13a7841864a12f987d514d','2024-11-01 01:24:23.357','20230703054450_prisma2_init',NULL,NULL,'2024-11-01 01:24:23.227',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_chat`
--

DROP TABLE IF EXISTS `log_chat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_chat` (
  `id` int unsigned NOT NULL AUTO_INCREMENT,
  `serverid` smallint unsigned NOT NULL DEFAULT '0',
  `type` smallint unsigned NOT NULL,
  `sender` varchar(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `target` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '',
  `msg` varchar(191) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `createdAt` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  PRIMARY KEY (`id`),
  KEY `log_chat_serverid_createdAt_idx` (`serverid`,`createdAt`),
  KEY `log_chat_serverid_sender_createdAt_idx` (`serverid`,`sender`,`createdAt`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_chat`
--

LOCK TABLES `log_chat` WRITE;
/*!40000 ALTER TABLE `log_chat` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_chat` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_equip`
--

DROP TABLE IF EXISTS `log_equip`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_equip` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logtime` datetime(3) NOT NULL,
  `name` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleid` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `serverid` smallint unsigned NOT NULL DEFAULT '0',
  `type` smallint unsigned NOT NULL DEFAULT '0',
  `eid` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `equipid` int unsigned NOT NULL DEFAULT '0',
  `entity` json NOT NULL,
  `num` int NOT NULL DEFAULT '0',
  `dec` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `log_equip_logtime_serverid_equipid_idx` (`logtime`,`serverid`,`equipid`),
  KEY `log_equip_logtime_serverid_roleid_equipid_idx` (`logtime`,`serverid`,`roleid`,`equipid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_equip`
--

LOCK TABLES `log_equip` WRITE;
/*!40000 ALTER TABLE `log_equip` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_equip` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_gamesys`
--

DROP TABLE IF EXISTS `log_gamesys`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_gamesys` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logtime` datetime(3) NOT NULL,
  `name` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleid` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `serverid` smallint unsigned NOT NULL DEFAULT '0',
  `type` smallint unsigned NOT NULL DEFAULT '0',
  `req` json NOT NULL,
  `dec` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `log_gamesys_logtime_serverid_type_idx` (`logtime`,`serverid`,`type`),
  KEY `log_gamesys_logtime_serverid_roleid_type_idx` (`logtime`,`serverid`,`roleid`,`type`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_gamesys`
--

LOCK TABLES `log_gamesys` WRITE;
/*!40000 ALTER TABLE `log_gamesys` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_gamesys` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_item`
--

DROP TABLE IF EXISTS `log_item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_item` (
  `id` int NOT NULL AUTO_INCREMENT,
  `logtime` datetime(3) NOT NULL,
  `name` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleid` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `serverid` smallint unsigned NOT NULL DEFAULT '0',
  `type` smallint unsigned NOT NULL DEFAULT '0',
  `itemid` int unsigned NOT NULL DEFAULT '0',
  `change` int NOT NULL DEFAULT '0',
  `last` int unsigned NOT NULL DEFAULT '0',
  `dec` varchar(24) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`),
  KEY `log_item_logtime_serverid_itemid_idx` (`logtime`,`serverid`,`itemid`),
  KEY `log_item_logtime_serverid_roleid_itemid_idx` (`logtime`,`serverid`,`roleid`,`itemid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_item`
--

LOCK TABLES `log_item` WRITE;
/*!40000 ALTER TABLE `log_item` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `log_login`
--

DROP TABLE IF EXISTS `log_login`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `log_login` (
  `id` int NOT NULL AUTO_INCREMENT,
  `userid` varchar(64) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `roleid` char(16) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT '0',
  `name` varchar(18) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  `serverid` smallint unsigned NOT NULL DEFAULT '0',
  `rolelevel` mediumint unsigned NOT NULL DEFAULT '0',
  `logtime` datetime(3) NOT NULL,
  `ip` varchar(14) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci NOT NULL,
  PRIMARY KEY (`id`),
  KEY `log_login_logtime_serverid_roleid_idx` (`logtime`,`serverid`,`roleid`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `log_login`
--

LOCK TABLES `log_login` WRITE;
/*!40000 ALTER TABLE `log_login` DISABLE KEYS */;
/*!40000 ALTER TABLE `log_login` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'wglog'
--

--
-- Dumping routines for database 'wglog'
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2024-11-06 11:26:32
