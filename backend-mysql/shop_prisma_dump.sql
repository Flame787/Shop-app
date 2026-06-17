-- MySQL dump 10.13  Distrib 9.7.1, for Win64 (x86_64)
--
-- Host: 127.0.0.1    Database: shop_prisma
-- ------------------------------------------------------
-- Server version	8.0.43

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!50503 SET NAMES utf8mb4 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `shop_prisma`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `shop_prisma` /*!40100 DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci */ /*!80016 DEFAULT ENCRYPTION='N' */;

USE `shop_prisma`;

--
-- Table structure for table `_prisma_migrations`
--

DROP TABLE IF EXISTS `_prisma_migrations`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `_prisma_migrations` (
  `id` varchar(36) COLLATE utf8mb4_unicode_ci NOT NULL,
  `checksum` varchar(64) COLLATE utf8mb4_unicode_ci NOT NULL,
  `finished_at` datetime(3) DEFAULT NULL,
  `migration_name` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `logs` text COLLATE utf8mb4_unicode_ci,
  `rolled_back_at` datetime(3) DEFAULT NULL,
  `started_at` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `applied_steps_count` int unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `_prisma_migrations`
--

LOCK TABLES `_prisma_migrations` WRITE;
/*!40000 ALTER TABLE `_prisma_migrations` DISABLE KEYS */;
INSERT INTO `_prisma_migrations` VALUES ('f35618e7-542a-4d26-8503-8a2674185ebb','02ab5f4badcbe724e53e0f0e7fee58b4fc4bdaa05db6be472dca6ee750fb7dab','2026-05-19 16:46:46.511','20260519164646_init',NULL,NULL,'2026-05-19 16:46:46.303',1);
/*!40000 ALTER TABLE `_prisma_migrations` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `category`
--

DROP TABLE IF EXISTS `category`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `category` (
  `category_id` int NOT NULL AUTO_INCREMENT,
  `category_name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `sort_order` int DEFAULT NULL,
  PRIMARY KEY (`category_id`)
) ENGINE=InnoDB AUTO_INCREMENT=11 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `category`
--

LOCK TABLES `category` WRITE;
/*!40000 ALTER TABLE `category` DISABLE KEYS */;
INSERT INTO `category` VALUES (1,'Desks',NULL),(2,'Chairs',NULL),(3,'Organizers',NULL),(4,'Electronics',NULL),(5,'Clocks',NULL),(6,'Lighting',NULL),(7,'Mouse Pads',NULL),(8,'Drinkware',NULL),(9,'Decorations',NULL),(10,'Tribute',NULL);
/*!40000 ALTER TABLE `category` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `customer`
--

DROP TABLE IF EXISTS `customer`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `customer` (
  `customer_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `phone` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `street` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `postal_code` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `country` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_registered` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `password_hash` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  PRIMARY KEY (`customer_id`),
  UNIQUE KEY `Customer_email_key` (`email`)
) ENGINE=InnoDB AUTO_INCREMENT=6 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `customer`
--

LOCK TABLES `customer` WRITE;
/*!40000 ALTER TABLE `customer` DISABLE KEYS */;
INSERT INTO `customer` VALUES (1,'Jim Collins','jimmy@test.com','094729476','New Street 99','Split','30000','England','2026-02-04 14:32:55.000','$2b$10$hCrfe1zSe2DJVtxs9Ysk9OGCOXONWnczmtR9j1CrFz0k/Hbx/qrd.','user'),(2,'','mike123@test.com',NULL,NULL,NULL,NULL,NULL,'2026-05-12 10:47:22.000','$2b$10$ck3w7at6ye1fCppDisyukudASn4k6RygSHrYQhuKM8bzzSene5LyS','user'),(3,'Tina Turner','tinaTurner@test.com','','','zagreb','10000','','2026-05-12 13:12:14.000','$2b$10$iNQceXTdEEv5XmaHiZ7eguHBoWfqUxl6FRBOG9H/K2RdhdA.KlVxG','user'),(4,'','test@justtest.com',NULL,NULL,NULL,NULL,NULL,'2026-05-22 16:33:24.039','$2b$10$2D9Mo5QrWCGnknP.UWtIN.Q3lTmHXMpzr0zpaebaWIHyjCIw1V/VG','user'),(5,'','john@next.com',NULL,NULL,NULL,NULL,NULL,'2026-05-22 17:01:37.895','$2b$10$zSS1EFK7dgL0sJ6IPq8zEuXsAC0aCNflfj35Qdxw9toTwOl.ocqEq','user');
/*!40000 ALTER TABLE `customer` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `item`
--

DROP TABLE IF EXISTS `item`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `item` (
  `item_id` int NOT NULL AUTO_INCREMENT,
  `name` varchar(191) COLLATE utf8mb4_unicode_ci NOT NULL,
  `description` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `price` decimal(65,30) NOT NULL,
  `discount_price` decimal(65,30) DEFAULT NULL,
  `quantity_in_stock` int NOT NULL,
  `picture_url` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `category_id` int DEFAULT NULL,
  `tags` varchar(191) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `date_added` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `last_updated` datetime(3) NOT NULL,
  `is_active` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`item_id`),
  KEY `Item_category_id_fkey` (`category_id`),
  CONSTRAINT `Item_category_id_fkey` FOREIGN KEY (`category_id`) REFERENCES `category` (`category_id`) ON DELETE SET NULL ON UPDATE CASCADE
) ENGINE=InnoDB AUTO_INCREMENT=76 DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `item`
--

LOCK TABLES `item` WRITE;
/*!40000 ALTER TABLE `item` DISABLE KEYS */;
INSERT INTO `item` VALUES (1,'Modern Office Desk','Large wooden desk suitable for office setup.',199.990000000000000000000000000000,NULL,10,'/images/items/modern-office-desk.png',1,NULL,'2025-11-18 15:34:51.000','2025-11-18 22:29:43.000',1),(2,'Compact Corner Desk','Space-saving corner desk ideal for home offices.',149.500000000000000000000000000000,NULL,6,'/images/items/compact-corner-desk.png',1,NULL,'2025-11-18 15:34:51.000','2025-11-18 22:29:43.000',1),(7,'Simple Wooden Desk','Minimalist wooden desk with natural finish and two drawers.',129.990000000000000000000000000000,NULL,15,'/images/items/simple-wooden-desk.jpg',1,NULL,'2025-11-18 18:25:35.000','2025-11-18 22:29:43.000',1),(8,'Adjustable Light Desk','Height-adjustable desk in light colors, ideal for small spaces.',189.500000000000000000000000000000,NULL,10,'/images/items/adjustable-light-desk.png',1,NULL,'2025-11-18 18:25:35.000','2025-11-18 18:25:35.000',1),(9,'White Office Desk','Modern white desk with drawers and cable management system.',174.900000000000000000000000000000,NULL,12,'/images/items/white-office-desk.png',1,NULL,'2025-11-18 18:25:35.000','2025-11-18 18:25:35.000',1),(10,'Gray Office Desk','Sturdy gray desk with matte finish and metal legs.',189.000000000000000000000000000000,NULL,8,'/images/items/gray-office-desk.png',1,NULL,'2025-11-18 18:25:35.000','2025-11-18 18:25:35.000',1),(11,'Creative Office Desk','Unique desk design with open space storage and curved edges.',219.990000000000000000000000000000,NULL,6,'/images/items/creative-office-desk.jpg',1,NULL,'2025-11-18 18:25:35.000','2025-11-18 22:31:35.000',1),(12,'Black Office Desk','Ergonomic black corner desk with spacious surface and adjustable height.',199.500000000000000000000000000000,NULL,9,'/images/items/black-office-desk.png',1,NULL,'2025-11-18 18:25:35.000','2025-11-18 18:25:35.000',1),(13,'Complex Office Desk','Gray wood multi-level desk with built-in shelves and metal accents.',249.000000000000000000000000000000,NULL,5,'/images/items/complex-office-desk.png',1,NULL,'2025-11-18 18:25:35.000','2025-11-18 18:25:35.000',1),(14,'Minimalist Clock','Compact desk clock with clean lines and silent movement, ideal for modern workspaces.',24.990000000000000000000000000000,NULL,20,'/images/items/minimalist-clock.jpg',5,NULL,'2025-11-18 18:38:28.000','2025-11-18 18:38:28.000',1),(15,'Oval Gray Clock','Elegant oval-shaped desk clock in matte gray finish, perfect for minimalist setups.',29.500000000000000000000000000000,NULL,15,'/images/items/oval-gray-clock.jpg',5,NULL,'2025-11-18 18:38:28.000','2025-11-18 18:38:28.000',1),(16,'Wooden Clock','Small wooden desk clock with natural grain and soft ticking sound.',34.900000000000000000000000000000,NULL,12,'/images/items/wooden-clock.png',5,NULL,'2025-11-18 18:38:28.000','2025-11-18 23:02:36.000',1),(17,'Mechanical Metal Clock','Vintage-style metal desk clock with exposed gears and mechanical movement.',129.990000000000000000000000000000,NULL,8,'/images/items/mechanical-metal-clock.png',5,NULL,'2025-11-18 18:38:28.000','2025-11-18 18:38:28.000',1),(18,'Sand Hourglass','Classic sand hourglass timer with metal frame, ideal as a decorative desk piece.',19.990000000000000000000000000000,NULL,25,'/images/items/sand-hourglass.jpg',5,NULL,'2025-11-18 18:38:28.000','2025-11-18 18:38:28.000',1),(19,'Fast Charger Pad','Elegant charging pad with an LED light ring. Compatible with USB-C and USB-A cables.',24.990000000000000000000000000000,NULL,30,'/images/items/fast-charger-pad.jpg',4,NULL,'2025-11-18 22:46:35.000','2025-11-18 22:46:35.000',1),(20,'Office Espresso Maker','Compact and stylish espresso machine ideal for office kitchens. Easy to use and maintain.',129.990000000000000000000000000000,NULL,25,'/images/items/espresso-machine.png',4,NULL,'2025-11-18 22:46:35.000','2025-11-18 22:46:35.000',1),(21,'Multi-Device Charging Station','Foldable wireless charger for iPhone, Apple Watch, and AirPods. Ideal for office desks.',49.990000000000000000000000000000,NULL,26,'/images/items/multi-charging-set.jpg',4,NULL,'2025-11-18 23:00:33.000','2025-11-18 23:00:33.000',1),(22,'Bamboo Desk Organizer-Charger','Multi-compartment bamboo tray with integrated wireless charging pad. Keeps your desk organized and your phone charged.',34.990000000000000000000000000000,NULL,37,'/images/items/bambo-charger.png',4,NULL,'2025-11-18 23:00:33.000','2025-11-18 23:00:33.000',1),(23,'Keyboard with Wrist Support','Compact keyboard with custom keycaps and a sculpted wrist rest for ergonomic comfort.',89.990000000000000000000000000000,NULL,29,'/images/items/keyboard-wrist-massage.png',4,NULL,'2025-11-18 23:00:33.000','2025-11-18 23:00:33.000',1),(24,'Wireless Office Headphones','Comfortable wireless headphones with padded ear cups and headband. Ideal for office calls, music, and focused work.',59.990000000000000000000000000000,NULL,34,'/images/items/music-headphones.jpg',4,NULL,'2025-11-18 23:15:49.000','2025-11-18 23:15:49.000',1),(25,'Multi Charger','Sleek multi-device charging hub with 10 USB ports and vertical slots for organizing phones and tablets. Ideal for shared office desks.',44.990000000000000000000000000000,NULL,25,'/images/items/multi-charger.jpg',4,NULL,'2025-11-18 23:15:49.000','2025-11-18 23:15:49.000',1),(26,'Compact Office Mini Fridge','Portable mini fridge with dual glass shelves and silent cooling. Ideal for storing drinks, snacks, or lunch at your desk.',59.990000000000000000000000000000,NULL,28,'/images/items/mini-fridge.png',4,NULL,'2025-11-18 23:22:03.000','2025-11-18 23:22:03.000',1),(27,'Smart Pen with Audio Recorder','Digital smart pen with built-in microphone and display. Perfect for meetings, brainstorming, and quick idea capture at work.',58.990000000000000000000000000000,NULL,17,'/images/items/smart-pen.png',4,NULL,'2025-11-18 23:22:03.000','2025-11-18 23:22:03.000',1),(28,'White Leather Chair with Wood','High-back ergonomic office chair with cushioned seat and curved wooden side panels. Ideal for executive desks.',169.990000000000000000000000000000,NULL,12,'/images/items/white-wood-chair.jpg',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(29,'Retro Beige Leather Chair','Elegant beige leather office chair with wood accents and chrome base. Adjustable height and tilt for comfort.',179.990000000000000000000000000000,NULL,10,'/images/items/brown-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(30,'Minimalist White Office Chair','Modern white office chair with integrated headrest and polished metal base. Clean design for contemporary workspaces.',129.990000000000000000000000000000,NULL,22,'/images/items/modern-white-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(31,'Comfortable Black Leather Chair','Tufted black leather office chair. Combines comfort and professional style.',149.990000000000000000000000000000,NULL,14,'/images/items/black-office-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(32,'Black & Red Gaming Chair','Sporty black gaming chair with red stitching, lumbar support and adjustable height. Designed for long sessions.',139.990000000000000000000000000000,NULL,18,'/images/items/black-red-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(33,'Black & Blue Gaming Chair','Ergonomic gaming chair with headrest and lumbar cushion. Modern design with blue stitching for style and comfort.',139.990000000000000000000000000000,NULL,16,'/images/items/gaming-blue-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(34,'Black Cushioned Chair','High-back office chair with cushioned seat and chrome base. Adjustable height and tilt for comfort.',139.990000000000000000000000000000,NULL,15,'/images/items/black-cushioned-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(35,'Black Leather Chair with Wood','Executive black leather chair with wood accents. Comfort and adjustable design for professional use.',149.990000000000000000000000000000,NULL,20,'/images/items/black-executive-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(36,'Comfortable Blue Gaming Chair','Sleek black and blue gaming chair with leg rest, cup holders, and side pockets. Ideal for immersive setups.',179.990000000000000000000000000000,NULL,11,'/images/items/comfortable-blue-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(37,'VR Simulation Chair with Controls','High-tech simulation chair with VR headset holder, control joysticks, and padded seat. Designed for immersive gaming.',249.990000000000000000000000000000,NULL,8,'/images/items/vr-simulation-chair.png',2,NULL,'2025-11-22 23:57:46.000','2025-11-22 23:57:46.000',1),(38,'Black and Copper Adjustable Lamp','Modern desk lamp with black and copper finish, adjustable arm. Ideal for focused lighting.',74.990000000000000000000000000000,NULL,15,'/images/items/lamp-graphite-copper.jpg',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(39,'Minimalist Angular LED Lamp','Sleek black desk lamp with angular design and integrated LED strips. Great for minimalist workspaces.',69.990000000000000000000000000000,NULL,20,'/images/items/minimalist-led-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(40,'Glass Shade Desk Lamp','Brushed metal desk lamp with cylindrical glass shade. Adjustable arm for flexible lighting.',84.990000000000000000000000000000,NULL,12,'/images/items/modern-metal-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(41,'LED Grid Panel Lamp','Black adjustable desk lamp with LED grid panel and multi-joint arm. Designed for precision lighting.',79.990000000000000000000000000000,NULL,18,'/images/items/thin-metal-lamp.jpg',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(42,'Twisted Spiral LED Lamp','Sculptural LED lamp with intertwined spiral design and touch control. Artistic lighting for modern interiors.',89.990000000000000000000000000000,NULL,10,'/images/items/twisted-table-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(43,'White Dome Chrome Arm Lamp','Minimalist desk lamp with white dome shade and chrome curved arm. Clean and functional for home offices.',64.990000000000000000000000000000,NULL,14,'/images/items/white-modern-lamp.jpg',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(44,'Black Glass Globe Lamp','Modern lamp with chrome stand and black glass globe shade. Warm bulb and touch controls for ambiance.',92.990000000000000000000000000000,NULL,9,'/images/items/black-globe-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(45,'Wood and Black Metal Lamp','Desk lamp with curved wooden arm and black conical head. Combines natural and industrial aesthetics.',78.990000000000000000000000000000,NULL,11,'/images/items/black-brown-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(46,'Touch-Control LED Strip Lamp','Sleek black lamp with curved neck, LED strip head, and touch panel for brightness and mode control.',72.990000000000000000000000000000,NULL,16,'/images/items/black-led-light.jpg',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(47,'Blue Adjustable Spring Lamp','Classic blue desk lamp with spring-loaded adjustable arm and conical shade. Ideal for reading and drawing.',59.990000000000000000000000000000,NULL,13,'/images/items/classic-blue-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(48,'Steampunk Gear Pipe Lamp','Industrial-style table lamp with Edison bulb, metal gears, and red valve accent. Perfect for vintage-themed workspaces.',89.990000000000000000000000000000,NULL,8,'/images/items/steampunk-gear-pipe-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(49,'Pipe Man Lamp with Gauge Head','Creative pipe lamp shaped like a humanoid figure with pressure gauge head and bulb hands. Unique industrial decor.',99.990000000000000000000000000000,NULL,6,'/images/items/pipe-man-lamp.png',6,NULL,'2025-11-24 13:00:39.000','2025-11-24 13:00:39.000',1),(50,'Black Ergonomic Wrist Pad','Smooth black mouse pad with cushioned wrist rest. Promotes comfort and reduces strain during extended use.',19.990000000000000000000000000000,NULL,22,'/images/items/ergonomic-wrist-support.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(51,'Yellow-Trim Ergonomic Pad','Black mouse pad with yellow border and built-in wrist rest. Combines comfort and bold design.',21.990000000000000000000000000000,NULL,16,'/images/items/yellow-black-ergonomic.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(52,'Orange Hex Mouse Pad','Geometric hexagonal mouse pad in bright orange. Minimalist design for modern desk setups.',14.990000000000000000000000000000,NULL,25,'/images/items/orange-hex-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(53,'Document It Round Pad','Round black mouse pad with colorful “But Did You Document It?” print. Fun reminder for devs and tech teams.',16.990000000000000000000000000000,NULL,30,'/images/items/document-it-mousepad.jpg',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(54,'Brown Leather Wrist Pad','Premium brown leather mouse pad with built-in wrist support. Ergonomic and stylish for long work sessions.',24.990000000000000000000000000000,NULL,18,'/images/items/leather-wrist-mousepad.jpg',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(55,'Layered Landscape Mouse Pad','Colorful mouse pad with stylized landscape design. Features layered textures in blue, pink, orange, and tan.',17.990000000000000000000000000000,NULL,18,'/images/items/small-landscape-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(56,'Mandala Art Mouse Pad','Decorative mouse pad with intricate mandala design in blue, purple, and pink tones. Adds artistic flair to any workspace.',18.990000000000000000000000000000,NULL,19,'/images/items/blue-flower-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(57,'Fluid Art Swirl Mouse Pad','Vibrant mouse pad with swirling abstract patterns in purple, teal, orange, and pink. Inspired by fluid art.',18.990000000000000000000000000000,NULL,20,'/images/items/lava-colors-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(58,'This Is Fine Meme Pad','Mouse pad featuring the iconic “This Is Fine” cartoon. A humorous take on calm amidst chaos.',16.990000000000000000000000000000,NULL,21,'/images/items/fine-funny-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(59,'RGB Gaming Mouse Pad','Large black mouse pad with RGB-lit edges and control module. Perfect for gaming setups with customizable lighting.',29.990000000000000000000000000000,NULL,20,'/images/items/led-gaming-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(60,'Aestetic Black Desk Pad','Black desk mat with white contour lines. Aesthetic and functional for creative workspaces.',17.990000000000000000000000000000,NULL,14,'/images/items/mousepad-black-wavy.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(61,'Blue Mist Mountain Pad','Artistic mouse pad featuring layered blue mountain ranges and misty valleys. Calming and atmospheric.',18.990000000000000000000000000000,NULL,12,'/images/items/mountains-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(62,'Purple Galaxy Mouse Pad','Panoramic mouse pad with swirling purple-blue nebula and star clusters. Ideal for space lovers and tech enthusiasts.',19.990000000000000000000000000000,NULL,15,'/images/items/purple-galaxy-pad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(63,'Rainbow Nebula Mouse Pad','Vibrant mouse pad with multicolor cosmic clouds and stars. Adds energy and color to any desk.',19.990000000000000000000000000000,NULL,17,'/images/items/space-large-mousepad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(64,'Botanical Abstract Desk Pad','Rectangular desk mat with abstract botanical design in muted tones. Features white line art of leaves and berries.',17.990000000000000000000000000000,NULL,15,'/images/items/botanical-deskpad.png',7,NULL,'2025-11-24 15:19:41.000','2025-11-24 15:19:41.000',1),(65,'Black and Lime Ceramic Mug','Glossy black ceramic mug with vibrant lime green interior. Modern contrast for stylish coffee breaks.',12.990000000000000000000000000000,NULL,20,'/images/items/black-lime-mug.png',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(66,'Beige Ceramic Mug with Wood Coaster','Minimalist beige ceramic mug with speckled matte finish and large handle. Includes natural wood coaster.',16.990000000000000000000000000000,NULL,17,'/images/items/mug-wood-coaster.png',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:26:27.000',1),(67,'Speckled Orange Ceramic Mug','Cylindrical orange mug with dark speckles. Bold and textured design for everyday use.',13.990000000000000000000000000000,NULL,18,'/images/items/speckled-orange-mug.png',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(68,'Speckled Blue Ceramic Mug','Handcrafted-style blue ceramic mug with gradient glaze and speckled texture. Warm and artisanal.',14.990000000000000000000000000000,NULL,16,'/images/items/speckled-blue-mug.jpeg',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(69,'Matte Black Ceramic Mug','Elegant black ceramic mug with matte finish and curved handle. Timeless design for any setting.',12.990000000000000000000000000000,NULL,22,'/images/items/matte-black-mug.png',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(70,'Blue Mug with Warmer Base','Matte dark blue ceramic mug on metallic warming base. Keeps drinks hot with sleek design.',29.990000000000000000000000000000,NULL,10,'/images/items/blue-mug-warmer.png',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(71,'Smart Heated Mug with LED Ring','Matte gray smart mug with amber LED band and touch control. Includes glowing base for charging and heating.',49.990000000000000000000000000000,NULL,8,'/images/items/smart-heated-mug.png',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(72,'Copper Insulated Water Bottle','Sleek metallic bottle with bronze finish and screw-on cap. Keeps drinks hot or cold for hours.',22.990000000000000000000000000000,NULL,12,'/images/items/copper-water-bottle.jpg',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(74,'Black Thermos with Temperature Display','Minimalist black thermos with digital temperature readout on lid. Ideal for monitoring beverage heat.',24.990000000000000000000000000000,NULL,14,'/images/items/black-thermos-temp.jpg',8,NULL,'2025-11-24 16:00:06.000','2025-11-24 16:00:06.000',1),(75,'Light Blue Insulated Mug with Clear Lid','Powder-coated stainless steel mug with transparent sliding lid. Durable and thermal for travel or outdoor use.',18.990000000000000000000000000000,NULL,16,'/images/items/light-blue-insulated-mug.png',8,NULL,'2025-11-24 16:22:39.000','2025-11-24 16:22:39.000',1);
/*!40000 ALTER TABLE `item` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `order`
--

DROP TABLE IF EXISTS `order`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `order` (
  `order_id` int NOT NULL AUTO_INCREMENT,
  `customer_id` int NOT NULL,
  `order_status` enum('ordered','shipped','delivered','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'ordered',
  `date_ordered` datetime(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
  `date_shipped` datetime(3) DEFAULT NULL,
  `date_delivered` datetime(3) DEFAULT NULL,
  `total_price` decimal(65,30) NOT NULL,
  PRIMARY KEY (`order_id`),
  KEY `Order_customer_id_fkey` (`customer_id`),
  CONSTRAINT `Order_customer_id_fkey` FOREIGN KEY (`customer_id`) REFERENCES `customer` (`customer_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `order`
--

LOCK TABLES `order` WRITE;
/*!40000 ALTER TABLE `order` DISABLE KEYS */;
/*!40000 ALTER TABLE `order` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `orderitem`
--

DROP TABLE IF EXISTS `orderitem`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!50503 SET character_set_client = utf8mb4 */;
CREATE TABLE `orderitem` (
  `order_item_id` int NOT NULL AUTO_INCREMENT,
  `order_id` int NOT NULL,
  `item_id` int NOT NULL,
  `quantity_ordered` int NOT NULL,
  `price_at_order` decimal(65,30) NOT NULL,
  PRIMARY KEY (`order_item_id`),
  KEY `OrderItem_order_id_fkey` (`order_id`),
  KEY `OrderItem_item_id_fkey` (`item_id`),
  CONSTRAINT `OrderItem_item_id_fkey` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE RESTRICT ON UPDATE CASCADE,
  CONSTRAINT `OrderItem_order_id_fkey` FOREIGN KEY (`order_id`) REFERENCES `order` (`order_id`) ON DELETE RESTRICT ON UPDATE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `orderitem`
--

LOCK TABLES `orderitem` WRITE;
/*!40000 ALTER TABLE `orderitem` DISABLE KEYS */;
/*!40000 ALTER TABLE `orderitem` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Dumping events for database 'shop_prisma'
--

--
-- Dumping routines for database 'shop_prisma'
--
--
-- WARNING: can't read the INFORMATION_SCHEMA.libraries table. It's most probably an old server 8.0.43.
--
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2026-06-17 13:24:22
