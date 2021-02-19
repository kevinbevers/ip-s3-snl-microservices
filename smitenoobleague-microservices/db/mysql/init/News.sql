CREATE DATABASE  IF NOT EXISTS `SNL_News_DB` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;
USE `SNL_News_DB`;
-- MySQL dump 10.13  Distrib 8.0.22, for macos10.15 (x86_64)
--
-- Host: 127.0.0.1    Database: SNL_News_DB
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
-- Dumping data for table `ArticleTable`
--

LOCK TABLES `ArticleTable` WRITE;
/*!40000 ALTER TABLE `ArticleTable` DISABLE KEYS */;
INSERT INTO `ArticleTable` VALUES ('first-update-blog-of-the-smitenoobleague','First update blog of the Smitenoobleague','an actual description','<h1>this is the content of the update blog</h1><p>this is some paragraph text describing the update</p>','0001-01-01 00:00:00','Update blog','20210218135338_first-update-blog-of-the-smitenoobleague.png'),('so-cool-firegiant','so cool firegiant','wow this is a giant fire giant','<h1>The whole game is just farming to 20 no killing or getting towers, then it\'s a fire giant dance</h1>','2021-02-18 13:47:21','Fire giant gamemode','20210218134721_so-cool-firegiant.png'),('the-4th-post-on-this-website','The 4th post on this website','A somewhat interesting description, not worth reading.','Interesting content containing ruling update and stuff.','2021-01-31 19:29:01','Ruling update',NULL),('the-first-article-on-this-site','The first article on this site','A somewhat interesting test this is.','A very very very very very very interesting content piece for this article','2021-01-31 19:18:03','Useless',NULL),('the-second-post-on-this-website','The second post on this website','A somewhat interesting description, not worth reading.','Interesting content containing ruling update and stuff.','2021-01-31 19:27:13','Ruling update',NULL),('the-thirth-post-on-this-website','The thirth post on this website','A somewhat interesting description, not worth reading.','Interesting content containing ruling update and stuff.','2021-01-31 19:28:57','Ruling update',NULL);
/*!40000 ALTER TABLE `ArticleTable` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2021-02-19 14:24:09
