<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Test</title>
    <style>
        body {
            display: flex;
            justify-content: center;
            align-items: center;
        }

        video {
            max-width: 700px;
        }
    </style>
</head>

<body>
    <div class="container">
        <?php
        // include the config file
        require_once 'config.php';
        $query = "SELECT * FROM video ORDER BY date DESC";
        $sql = $bdd->query($query);
        while ($data = $sql->fetch()) {
            $video_id = $data['id'];
            $video_title = $data['titre'];
            $video_desc = $data['des'];
            $video_file_id = $data['video_file'];
            $image_file_id = $data['image_file'];
        ?>
            <video src="" id="<?= $video_id ?>" controls data-src="<?= $video_file_id ?>" data-poster="<?= $image_file_id ?>" width="100%" controlsList="nodownload"></video>
            <!-- Afficher les details de la video -->
            <h3 class="title"><?= $video_title ?></h3>
            <p><?= $video_desc ?></p>
        <?php
        }
        ?>
    </div>
    <script src="get-file.js"></script>
</body>

</html>