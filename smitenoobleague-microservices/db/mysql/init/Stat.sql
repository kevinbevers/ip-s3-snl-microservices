CREATE DATABASE  IF NOT EXISTS `SNL_Stat_DB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `SNL_Stat_DB`;
-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: SNL_Stat_DB
-- ------------------------------------------------------
-- Server version	8.0.22

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
-- Table structure for table `TableGodDetail`
--

DROP TABLE IF EXISTS `TableGodDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TableGodDetail` (
  `GodID` int NOT NULL,
  `GodName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `GodIconUrl` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`GodID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TableItemDetail`
--

DROP TABLE IF EXISTS `TableItemDetail`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TableItemDetail` (
  `ItemID` int NOT NULL,
  `ItemName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ItemDescription` varchar(300) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `ItemIconUrl` varchar(150) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`ItemID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TableMatchResult`
--

DROP TABLE IF EXISTS `TableMatchResult`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TableMatchResult` (
  `MatchResultID` int NOT NULL AUTO_INCREMENT,
  `GameID` int DEFAULT NULL,
  `ScheduleMatchUpID` int DEFAULT NULL,
  `WinningTeamID` int DEFAULT NULL,
  `LosingTeamID` int DEFAULT NULL,
  `DatePlayed` datetime DEFAULT NULL,
  PRIMARY KEY (`MatchResultID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TableStanding`
--

DROP TABLE IF EXISTS `TableStanding`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TableStanding` (
  `StandingID` int NOT NULL AUTO_INCREMENT,
  `DivisionID` int DEFAULT NULL,
  `TeamID` int DEFAULT NULL,
  `ScheduleID` int DEFAULT NULL,
  `StandingScore` int DEFAULT NULL,
  `StandingWins` int DEFAULT NULL,
  `StandingLosses` int DEFAULT NULL,
  PRIMARY KEY (`StandingID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Table structure for table `TableStat`
--

DROP TABLE IF EXISTS `TableStat`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `TableStat` (
  `StatID` int NOT NULL AUTO_INCREMENT,
  `GameID` int DEFAULT NULL,
  `MatchPlayedDate` datetime DEFAULT NULL,
  `TeamID` int DEFAULT NULL,
  `DivisionID` int DEFAULT NULL,
  `ScheduleID` int DEFAULT NULL,
  `MatchupID` int DEFAULT NULL,
  `RoleID` int DEFAULT NULL,
  `PlayerID` int DEFAULT NULL,
  `PlayerIsFill` tinyint(1) DEFAULT NULL,
  `GodPlayedID` int DEFAULT NULL,
  `PatchNumber` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `WinStatus` tinyint(1) DEFAULT NULL,
  `IG_Taskforce` int DEFAULT NULL,
  `IG_MatchLengthInSeconds` int DEFAULT NULL,
  `IG_GodName` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IG_PlayerLevel` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IG_Kills` int DEFAULT NULL,
  `IG_Deaths` int DEFAULT NULL,
  `IG_Assists` int DEFAULT NULL,
  `IG_GoldEarned` int DEFAULT NULL,
  `IG_GPM` int DEFAULT NULL,
  `IG_Relic1ID` int DEFAULT NULL,
  `IG_Relic2ID` int DEFAULT NULL,
  `IG_Item1ID` int DEFAULT NULL,
  `IG_Item2ID` int DEFAULT NULL,
  `IG_Item3ID` int DEFAULT NULL,
  `IG_item4ID` int DEFAULT NULL,
  `IG_Item5ID` int DEFAULT NULL,
  `IG_Item6ID` int DEFAULT NULL,
  `IG_DamageDealt` int DEFAULT NULL,
  `IG_DamageTaken` int DEFAULT NULL,
  `IG_DamageMitigated` int DEFAULT NULL,
  `IG_Healing` int DEFAULT NULL,
  `IG_MinionDamage` int DEFAULT NULL,
  `IG_DistanceTraveled` int DEFAULT NULL,
  `IG_Ban1ID` int DEFAULT NULL,
  `IG_Ban2ID` int DEFAULT NULL,
  `IG_Ban3ID` int DEFAULT NULL,
  `IG_Ban4ID` int DEFAULT NULL,
  `IG_Ban5ID` int DEFAULT NULL,
  `IG_Ban6ID` int DEFAULT NULL,
  `IG_Ban7ID` int DEFAULT NULL,
  `IG_Ban8ID` int DEFAULT NULL,
  `IG_Ban9ID` int DEFAULT NULL,
  `IG_Ban10ID` int DEFAULT NULL,
  `IG_FireGiantsKilled` int DEFAULT NULL,
  `IG_GoldFuriesKilled` int DEFAULT NULL,
  `IG_WardsPlaced` int DEFAULT NULL,
  `IG_StructureDamage` int DEFAULT NULL,
  `IG_TowersDestroyed` int DEFAULT NULL,
  `IG_Region` varchar(45) CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `IG_FirstBlood` tinyint(1) DEFAULT NULL,
  `IG_HighestMultiKill` int DEFAULT NULL,
  `IG_ObjectiveAssists` int DEFAULT NULL,
  `IG_PhoenixesDestroyed` int DEFAULT NULL,
  `IG_TimeSpentDeathInSeconds` int DEFAULT NULL,
  `IG_Pentas` int DEFAULT NULL,
  `IG_Quadras` int DEFAULT NULL,
  `IG_Triples` int DEFAULT NULL,
  `IG_Doubles` int DEFAULT NULL,
  PRIMARY KEY (`StatID`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-01-04 20:31:42
