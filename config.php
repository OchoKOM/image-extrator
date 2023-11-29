<?php
$host = 'localhost';
$db   = 'img';
$user = 'root';
$pass = '';
try {
    $bdd = new PDO("mysql:host=$host;dbname=$db", $user, $pass);
    
    // Définir le code SQL
    $sql = "
    CREATE TABLE IF NOT EXISTS `files` (
        `id` int NOT NULL AUTO_INCREMENT,
        `stat_id` int NOT NULL,
        `server` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `location` varchar(255) CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci NOT NULL,
        `created` TIMESTAMP NOT NULL,
        PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;
        
        CREATE TABLE IF NOT EXISTS `video` (
        `id` varchar(20) CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_520_ci NOT NULL,
        `titre` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_520_ci NOT NULL,
        `des` varchar(5000) COLLATE utf8mb4_general_ci NOT NULL,
        `video_file` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
        `duration` int NOT NULL,
        `quality` int NOT NULL,
        `image_file` text CHARACTER SET utf8mb3 COLLATE utf8mb3_unicode_ci NOT NULL,
        `user_id` int NOT NULL,
        `vues` int NOT NULL DEFAULT '0',
        `date` TIMESTAMP NOT NULL,
        PRIMARY KEY (`id`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;      
    ";
    
    // Exécuter le code SQL
    $bdd->exec($sql);
} catch (PDOException $e) {
    die("ERROR: " . $e->getMessage());
}

function generateRandomString($length = 15) {
    $characters = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
    $charactersLength = strlen($characters);
    $randomString = '';
    for ($i = 0; $i < $length; $i++) {
        $randomString .= $characters[random_int(0, $charactersLength - 1)];
    }
    return $randomString;
}