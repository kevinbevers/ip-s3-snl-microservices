CREATE DATABASE  IF NOT EXISTS `SNL_Division_DB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `SNL_Division_DB`;
-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: SNL_Division_DB
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
-- Dumping data for table `TableDivision`
--

LOCK TABLES `TableDivision` WRITE;
/*!40000 ALTER TABLE `TableDivision` DISABLE KEYS */;
INSERT INTO `TableDivision` VALUES (7,'Godlike division'),(8,'Warrior division'),(9,'Hero division'),(14,'test div ??'),(15,'test div ??');
/*!40000 ALTER TABLE `TableDivision` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `TableMatchup`
--

LOCK TABLES `TableMatchup` WRITE;
/*!40000 ALTER TABLE `TableMatchup` DISABLE KEYS */;
INSERT INTO `TableMatchup` VALUES (673,13,1,1,2,_binary '\0','2 - 1'),(674,13,8,7,4,_binary '\0',NULL),(675,13,8,6,5,_binary '\0',NULL),(676,13,9,3,1,_binary '\0',NULL),(677,13,9,2,4,_binary '\0',NULL),(678,13,9,8,5,_binary '\0',NULL),(679,13,9,7,6,_binary '\0',NULL),(680,13,10,4,1,_binary '\0',NULL),(681,13,10,3,5,_binary '\0',NULL),(682,13,10,2,6,_binary '\0',NULL),(683,13,10,8,7,_binary '\0',NULL),(684,13,11,5,1,_binary '\0',NULL),(685,13,8,8,3,_binary '\0',NULL),(686,13,11,4,6,_binary '\0',NULL),(687,13,11,2,8,_binary '\0',NULL),(688,13,12,6,1,_binary '\0',NULL),(689,13,12,5,7,_binary '\0',NULL),(690,13,12,4,8,_binary '\0',NULL),(691,13,12,3,2,_binary '\0',NULL),(692,13,13,7,1,_binary '\0',NULL),(693,13,13,6,8,_binary '\0',NULL),(694,13,13,5,2,_binary '\0',NULL),(695,13,13,4,3,_binary '\0',NULL),(696,13,14,8,1,_binary '\0',NULL),(697,13,14,7,2,_binary '\0',NULL),(698,13,11,3,7,_binary '\0',NULL),(699,13,8,2,1,_binary '\0',NULL),(700,13,7,4,5,_binary '\0',NULL),(701,13,7,3,6,_binary '\0',NULL),(702,13,1,3,8,_binary '\0','1 - 2'),(703,13,1,4,7,_binary '\0',NULL),(704,13,1,5,6,_binary '\0',NULL),(705,13,2,1,3,_binary '\0','2 - 0'),(706,13,2,4,2,_binary '\0',NULL),(707,13,2,5,8,_binary '\0','2 - 0'),(708,13,2,6,7,_binary '\0',NULL),(709,13,3,1,4,_binary '\0',NULL),(710,13,3,5,3,_binary '\0',NULL),(711,13,3,6,2,_binary '\0',NULL),(712,13,3,7,8,_binary '\0',NULL),(713,13,4,1,5,_binary '\0',NULL),(714,13,4,6,4,_binary '\0',NULL),(715,13,4,7,3,_binary '\0',NULL),(716,13,4,8,2,_binary '\0',NULL),(717,13,5,1,6,_binary '\0',NULL),(718,13,5,7,5,_binary '\0',NULL),(719,13,5,8,4,_binary '\0',NULL),(720,13,5,2,3,_binary '\0',NULL),(721,13,6,1,7,_binary '\0',NULL),(722,13,6,8,6,_binary '\0',NULL),(723,13,6,2,5,_binary '\0',NULL),(724,13,6,3,4,_binary '\0',NULL),(725,13,7,1,8,_binary '\0',NULL),(726,13,7,2,7,_binary '\0',NULL),(727,13,14,6,3,_binary '\0',NULL),(728,13,14,5,4,_binary '\0',NULL),(841,16,1,1,2,_binary '\0',NULL),(842,16,8,7,4,_binary '\0',NULL),(843,16,8,6,5,_binary '\0',NULL),(844,16,9,3,1,_binary '\0',NULL),(845,16,9,2,4,_binary '\0',NULL),(846,16,9,8,5,_binary '\0',NULL),(847,16,9,7,6,_binary '\0',NULL),(848,16,10,4,1,_binary '\0',NULL),(849,16,10,3,5,_binary '\0',NULL),(850,16,10,2,6,_binary '\0',NULL),(851,16,10,8,7,_binary '\0',NULL),(852,16,11,5,1,_binary '\0',NULL),(853,16,8,8,3,_binary '\0',NULL),(854,16,11,4,6,_binary '\0',NULL),(855,16,11,2,8,_binary '\0',NULL),(856,16,12,6,1,_binary '\0',NULL),(857,16,12,5,7,_binary '\0',NULL),(858,16,12,4,8,_binary '\0',NULL),(859,16,12,3,2,_binary '\0',NULL),(860,16,13,7,1,_binary '\0',NULL),(861,16,13,6,8,_binary '\0',NULL),(862,16,13,5,2,_binary '\0',NULL),(863,16,13,4,3,_binary '\0',NULL),(864,16,14,8,1,_binary '\0',NULL),(865,16,14,7,2,_binary '\0',NULL),(866,16,11,3,7,_binary '\0',NULL),(867,16,8,2,1,_binary '\0',NULL),(868,16,7,4,5,_binary '\0',NULL),(869,16,7,3,6,_binary '\0',NULL),(870,16,1,3,8,_binary '\0',NULL),(871,16,1,4,7,_binary '\0',NULL),(872,16,1,5,6,_binary '\0',NULL),(873,16,2,1,3,_binary '\0',NULL),(874,16,2,4,2,_binary '\0',NULL),(875,16,2,5,8,_binary '\0',NULL),(876,16,2,6,7,_binary '\0',NULL),(877,16,3,1,4,_binary '\0',NULL),(878,16,3,5,3,_binary '\0',NULL),(879,16,3,6,2,_binary '\0',NULL),(880,16,3,7,8,_binary '\0',NULL),(881,16,4,1,5,_binary '\0',NULL),(882,16,4,6,4,_binary '\0',NULL),(883,16,4,7,3,_binary '\0',NULL),(884,16,4,8,2,_binary '\0',NULL),(885,16,5,1,6,_binary '\0',NULL),(886,16,5,7,5,_binary '\0',NULL),(887,16,5,8,4,_binary '\0',NULL),(888,16,5,2,3,_binary '\0',NULL),(889,16,6,1,7,_binary '\0',NULL),(890,16,6,8,6,_binary '\0',NULL),(891,16,6,2,5,_binary '\0',NULL),(892,16,6,3,4,_binary '\0',NULL),(893,16,7,1,8,_binary '\0',NULL),(894,16,7,2,7,_binary '\0',NULL),(895,16,14,6,3,_binary '\0',NULL),(896,16,14,5,4,_binary '\0',NULL),(1009,19,1,24,25,_binary '\0',NULL),(1010,19,1,26,999999,_binary '',NULL),(1011,19,2,24,26,_binary '\0',NULL),(1012,19,2,999999,25,_binary '',NULL),(1013,19,3,24,999999,_binary '',NULL),(1014,19,3,25,26,_binary '\0',NULL),(1015,19,4,25,24,_binary '\0',NULL),(1016,19,4,999999,26,_binary '',NULL),(1017,19,5,26,24,_binary '\0',NULL),(1018,19,5,25,999999,_binary '',NULL),(1019,19,6,999999,24,_binary '',NULL),(1020,19,6,26,25,_binary '\0',NULL);
/*!40000 ALTER TABLE `TableMatchup` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping data for table `TableSchedule`
--

LOCK TABLES `TableSchedule` WRITE;
/*!40000 ALTER TABLE `TableSchedule` DISABLE KEYS */;
INSERT INTO `TableSchedule` VALUES (13,'Split 1',7,'2021-01-17 17:38:03','2021-05-08 17:38:03'),(16,'Split 2',7,'2021-05-17 17:38:03','2021-09-05 17:38:03'),(19,'test schedule',14,'2021-02-05 00:00:00','2021-03-18 00:00:00');
/*!40000 ALTER TABLE `TableSchedule` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-19 14:24:21
