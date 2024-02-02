/*!40101 SET NAMES utf8 */;
/*!40014 SET FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET SQL_NOTES=0 */;
DROP TABLE IF EXISTS categories;
CREATE TABLE `categories` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`category_id`),
  UNIQUE KEY `catname_UNIQUE` (`category_name`)
) ENGINE=InnoDB AUTO_INCREMENT=8 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS games;
CREATE TABLE `games` (
  `gameid` int NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `price` varchar(255) NOT NULL,
  `platform_id` varchar(45) NOT NULL,
  `category_id` varchar(45) NOT NULL,
  `year` int NOT NULL,
  `created at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `image_name` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`gameid`),
  UNIQUE KEY `title_UNIQUE` (`title`)
) ENGINE=InnoDB AUTO_INCREMENT=14 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS platform;
CREATE TABLE `platform` (
  `platform_id` int NOT NULL AUTO_INCREMENT,
  `platform_name` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL,
  `created_at` datetime NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`platform_id`),
  UNIQUE KEY `PS5_UNIQUE` (`platform_name`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS reviews;
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
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

DROP TABLE IF EXISTS users;
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
) ENGINE=InnoDB AUTO_INCREMENT=17 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_0900_ai_ci;

INSERT INTO categories(category_id,category_name,description,created_at) VALUES(1,'Action','An action game emphasizes physical challenges, including hand–eye coordination and reaction-time','2023-05-13 15:10:15'),(2,'Test','This is a test description for a category that doesn\'t exist :)','2023-05-13 15:10:15'),(7,'Testing','An action game emphasizes physical challenges, including hand–eye coordination and reaction-time','2023-05-29 18:48:17');

INSERT INTO games(gameid,title,description,price,platform_id,category_id,year,created at,image_name) VALUES(1,'Hogwarts Legacy','Hogwarts Legacy is a 2023 action role-playing game developed by Avalanche Software and published by Warner Bros.','69.90,75.5,80','1,2,3','1',2023,'2023-05-13 15:26:22','hogwarts_legacy_1.jpg'),(2,'Hogwarts Legacy 2','Hogwarts Legacy is a 2023 action role-playing game developed by Avalanche Software and published by Warner Bros.','69.90,75.5','1,3','1',2023,'2023-05-13 15:29:37','hogwarts_legacy_2.jpg'),(3,'Minecraft','Hogwarts Legacy is a 2023 action role-playing game developed by Avalanche Software and published by Warner Bros.','69.90,75.5','2,3','1',2023,'2023-05-13 15:39:01','minecraft.jpg');

INSERT INTO platform(platform_id,platform_name,description,created_at) VALUES(1,'PS5','Playstation 5','2023-05-13 15:10:19'),(2,'PC','Desktop / Personal Computer','2023-05-13 15:13:52'),(3,'Xbox','The inferior gaming console','2023-05-13 15:14:41'),(4,'Xbx','The inferior gaming console','2023-05-29 18:48:32');

INSERT INTO reviews(id,rating,user_id,game_id,content,created_at) VALUES(3,5,1,1,'test review','2023-06-08 20:17:05'),(4,2,7,1,'it\'s okay...','2023-06-08 20:19:28');
INSERT INTO users(userid,username,email,password,type,profile_pic_url,created_at) VALUES(1,'Terry Tan','terry@gmail.com','abc123','Customer','https://www.abc.com/terry.jpg','2023-05-03 22:01:54'),(7,'tesingt','testing@gmail.com','testing','Customer','https://www.test.com/test.jpeg','2023-05-13 13:48:30'),(15,'tesingt','testiggggng@gmail.com','testing','Customer','https://www.test.com/test.jpeg','2023-05-13 15:09:39');