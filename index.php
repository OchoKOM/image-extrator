<?php
require("config.php");
$_SESSION['id'] = 1
?>
<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="Replace image file">
    <title>Document</title>
    <link rel="stylesheet" href="new.css">
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <?php
        include("partials/_svgs.php");
    ?>
    <div class="message">
        <div class="alert alert-primary">
            <svg class="alert-icon" fill="currentColor" height="30" width="50">
                <use xlink:href="#info-fill"></use>
            </svg>
            <div class="alert-message">
            Les messages d'alerte seront affichés ici
            </div>
        </div>
        <button type="button" class="alert-close">&times;</button>
    </div>
    <div class="m-section-show" data-root>
        <div class="m-section-title">
            <h3>Vos vidéos</h3>
        </div>
        <div class="m-section-list chanel">
            <?php
            $fetchVideos = $bdd->prepare('SELECT video.id AS video_id, profil.id AS profil_id, pseudo, titre, image_file,  date FROM video JOIN profil ON video.user_id = profil.id WHERE profil.id = ? ORDER BY date DESC LIMIT 100');
            $fetchVideos->execute([$_SESSION['id']]);
            if ($fetchVideos->rowcount() == 0) {
            ?>
                <h2>Les videos que que vous mettez en ligne s'afficheront ici</h2>
            <?php
            }
            while ($get_videos = $fetchVideos->fetch()) {
                $video_id = $get_videos['video_id'];
                $titre = $get_videos['titre'];
                $image_file = $get_videos['image_file'];
                $pseudo = $get_videos['pseudo'];
                $progress_left = 0;
            ?>
                <div class="m-section-item">
                    <a href="watch?v=<?= $video_id ?>" class="m-section-poster">
                        <img src="file.php?id=<?= $image_file ?>" alt="">
                        <div class="progress-left-bar" style="--l:<?= $progress_left ?>%;">
                            <div class="progress-left"></div>
                        </div>
                    </a>
                    <a href="watch?v=<?= $video_id ?>" class="m-section-details">
                        <h3 class="m-section-v-title"><?= $titre ?></h3>
                        <span class="m-section-v-user"><?= $pseudo ?></span>
                    </a>
                    <div class="m-section-menu-btn" data-video="<?= $video_id ?>">
                        <svg height="24" viewBox="0 -960 960 960" width="24">
                            <path d="M480-160q-33 0-56.5-23.5T400-240q0-33 23.5-56.5T480-320q33 0 56.5 23.5T560-240q0 33-23.5 56.5T480-160Zm0-240q-33 0-56.5-23.5T400-480q0-33 23.5-56.5T480-560q33 0 56.5 23.5T560-480q0 33-23.5 56.5T480-400Zm0-240q-33 0-56.5-23.5T400-720q0-33 23.5-56.5T480-800q33 0 56.5 23.5T560-720q0 33-23.5 56.5T480-640Z" fill="currentColor"></path>
                        </svg>
                    </div>
                </div>
            <?php
            }

            ?>
        </div>
    </div>
    <div class="setting-menu-container">
        <div class="setting-menu-overlay"></div>
        <ul>
        </ul>
    </div>
    <script src="script.js"></script>
</body>
</html>