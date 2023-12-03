<?php
    require("../config.php");
    $titre = '';
    $des = '';
    $video = '';
    $video_file = '';
    $image = '';
    $image_file = '';
    if (isset($_GET['id'])) {   
        if (isset($_SESSION['auth'])) {
            $check_video = $bdd->prepare('SELECT * FROM video WHERE id = ? AND user_id = ? LIMIT 1');
            $check_video->execute([$_GET['id'],$_SESSION['id']]);
            $rowcount = $check_video->rowCount();
            if ($rowcount == 1) {
                $fetch_video = $check_video->fetch();
                $titre = $fetch_video['titre'];
                $des = $fetch_video['des'];
                $video = $fetch_video['video_file'];
                $image = $fetch_video['image_file'];
                $get_video_file_query = $bdd->prepare('SELECT * FROM files WHERE id= ?');
                $get_video_file_query->execute(array($video));
                $get_video_file = $get_video_file_query->fetch();
                $video_file = $get_video_file['location'];
                $get_img_file_query = $bdd->prepare('SELECT * FROM files WHERE id= ?');
                $get_img_file_query->execute(array($image));
                $get_img_file = $get_img_file_query->fetch();
                $image_file = $get_img_file['location'];
            }
        }
    }
    $video_data_array = [
        'title' => $titre,
        'description' => $des,
        'video_url' => $video_file,
        'thumbnail_url' => $image_file,
    ];

echo json_encode($video_data_array);
?>