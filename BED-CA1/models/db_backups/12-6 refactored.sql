-- MySQL dump 10.13  Distrib 8.0.33, for Win64 (x86_64)
--
-- Host: localhost    Database: main
-- ------------------------------------------------------
-- Server version	8.0.33

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
-- Table structure for table `categories`
--

DROP TABLE IF EXISTS `categories`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `catname_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `categories`
--

LOCK TABLES `categories` WRITE;
/*!40000 ALTER TABLE `categories` DISABLE KEYS */;
INSERT INTO `categories` VALUES (1,'Action','An action game emphasizes physical challenges, including hand–eye coordination and reaction-time','2023-06-11 22:44:21'),(2,'Horror','A horror game is a video game genre centered on horror fiction and typically designed to scare the player. The term may also be used to describe tabletop games with horror fiction elements.','2023-06-11 22:19:09'),(3,'Sandbox','A sandbox game is a video game with a gameplay element that provides players a great degree of creativity to interact with, usually without any predetermined goal, or alternatively with a goal that the players set for themselves.','2023-06-11 22:19:26');
/*!40000 ALTER TABLE `categories` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_category`
--

DROP TABLE IF EXISTS `game_category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_category` (
  `game_id` int NOT NULL,
  `category_id` int DEFAULT NULL,
  KEY `game_id` (`game_id`),
  KEY `category_id` (`category_id`),
  CONSTRAINT `game_category_ibfk_1` FOREIGN KEY (`game_id`) REFERENCES `games` (`gameid`) ON DELETE CASCADE,
  CONSTRAINT `game_category_ibfk_2` FOREIGN KEY (`category_id`) REFERENCES `categories` (`category_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_category`
--

LOCK TABLES `game_category` WRITE;
/*!40000 ALTER TABLE `game_category` DISABLE KEYS */;
INSERT INTO `game_category` VALUES (1,1),(1,3),(2,2),(2,3),(3,1),(3,2),(3,3);
/*!40000 ALTER TABLE `game_category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `game_platform_price`
--

DROP TABLE IF EXISTS `game_platform_price`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `game_platform_price` (
  `gameid` int NOT NULL,
  `platformid` int NOT NULL,
  `price` float DEFAULT NULL,
  KEY `fk_gameid` (`gameid`),
  KEY `fk_platformid` (`platformid`),
  CONSTRAINT `fk_gameid` FOREIGN KEY (`gameid`) REFERENCES `games` (`gameid`) ON DELETE CASCADE,
  CONSTRAINT `fk_platformid` FOREIGN KEY (`platformid`) REFERENCES `platform` (`platform_id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `game_platform_price`
--

LOCK TABLES `game_platform_price` WRITE;
/*!40000 ALTER TABLE `game_platform_price` DISABLE KEYS */;
INSERT INTO `game_platform_price` VALUES (1,2,19.99),(1,1,29.99),(1,3,29.99),(1,4,9.99),(2,2,39.99),(2,1,49.99),(2,4,19.99),(3,2,59.99),(3,3,49.99),(3,4,9.9);
/*!40000 ALTER TABLE `game_platform_price` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `games`
--

DROP TABLE IF EXISTS `games`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `games` (
  `gameid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `year` int NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`gameid`),
  UNIQUE KEY `title_UNIQUE` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `games`
--

LOCK TABLES `games` WRITE;
/*!40000 ALTER TABLE `games` DISABLE KEYS */;
INSERT INTO `games` VALUES (1,'Minecraft','Explore and build in a blocky, pixelated world.',2011,'2023-06-12 00:52:03','nil'),(2,'Resident Evil 7: Biohazard','Experience the horror of survival against terrifying creatures.',2017,'2023-06-12 00:53:52','nil'),(3,'Grand Theft Auto V','Immerse yourself in an open-world crime epic.',2013,'2023-06-12 00:54:22','nil');
/*!40000 ALTER TABLE `games` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `platform`
--

DROP TABLE IF EXISTS `platform`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `platform` (
  `platform_id` int NOT NULL AUTO_INCREMENT,
  `platform_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`platform_id`),
  UNIQUE KEY `PS5_UNIQUE` (`platform_name`)
) ENGINE=InnoDB AUTO_INCREMENT=7 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `platform`
--

LOCK TABLES `platform` WRITE;
/*!40000 ALTER TABLE `platform` DISABLE KEYS */;
INSERT INTO `platform` VALUES (1,'PS5','Playstation 5','2023-06-12 00:32:00'),(2,'PC','Desktop / Personal Computer','2023-05-13 15:13:52'),(3,'Xbox','The inferior gaming console','2023-05-13 15:14:41'),(4,'Mobile','Android or IOS devices','2023-06-11 23:01:38');
/*!40000 ALTER TABLE `platform` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `reviews`
--

DROP TABLE IF EXISTS `reviews`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `reviews` (
  `id` int NOT NULL AUTO_INCREMENT COMMENT 'Primary Key',
  `rating` int NOT NULL,
  `user_id` int DEFAULT NULL,
  `game_id` int DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `user_id` (`user_id`),
  KEY `game_id` (`game_id`),
  CONSTRAINT `game_id` FOREIGN KEY (`game_id`) REFERENCES `games` (`gameid`) ON DELETE CASCADE,
  CONSTRAINT `user_id` FOREIGN KEY (`user_id`) REFERENCES `users` (`userid`) ON DELETE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `reviews`
--

LOCK TABLES `reviews` WRITE;
/*!40000 ALTER TABLE `reviews` DISABLE KEYS */;
INSERT INTO `reviews` VALUES (5,5,1,1,'I grew up playing this game, it\'s fantastic...','2023-06-11 16:52:50');
/*!40000 ALTER TABLE `reviews` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `users`
--

DROP TABLE IF EXISTS `users`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `users` (
  `userid` int NOT NULL AUTO_INCREMENT,
  `username` varchar(255) NOT NULL,
  `email` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL,
  `type` varchar(255) NOT NULL DEFAULT 'Customer',
  `profile_pic_url` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`userid`),
  UNIQUE KEY `email_UNIQUE` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `users`
--

LOCK TABLES `users` WRITE;
/*!40000 ALTER TABLE `users` DISABLE KEYS */;
INSERT INTO `users` VALUES (1,'Terry Tan','terry@gmail.com','6ca13d52ca70c883e0f0bb101e425a89e8624de51db2d2392593af6a84118090','Customer','https://www.abc.com/terry.jpg','2023-06-11 21:54:30'),(2,'admin','testiggggng@gmail.com','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','Admin','https://www.test.com/test.jpeg','2023-05-13 15:09:39'),(3,'Zavier','zavier@gmail.com','5e884898da28047151d0e56f8dc6292773603d0d6aabbdd62a11ef721d1542d8','Admin','https://www.test.com/test.jpeg','2023-06-12 00:57:45');
/*!40000 ALTER TABLE `users` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2023-06-12  0:58:28
