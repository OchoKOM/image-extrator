<?php
require('config.php');
$server = "http://" . $_SERVER['HTTP_HOST'];
$date = date("d-m-Y");
$cookie_data = array(
    'id' => false,
    'title' => $date,
    'desc' => "",
    'image' => false,
    'video' => false,
    'complete' => false
);
$post_max_size = ini_get('post_max_size') ? formatSizeNumber(ini_get('post_max_size')) : 0;
$upload_max_filesize = ini_get('upload_max_filesize') ? formatSizeNumber(ini_get('upload_max_filesize')) :  0;

function formatSizeNumber($size){
    if (gettype($size) == "string") {
        return reverseFormatFileSize($size);
    }
    return $size;
}

function reverseFormatFileSize($formattedSize){
    $units = array('B', 'k', 'M', 'G', 'T');
    $unit = preg_replace('/[^a-zA-Z]/', '', $formattedSize);
    $size = preg_replace('/[^0-9.]/', '', $formattedSize);
    $i = array_search($unit, $units);
    return $size * pow(1024, $i);
}


$stat_data = [
    'status' => true,
    'id' => false,
    'location' => false,
    'image' => false,
    'video' => false,
    'post_size' => $post_max_size,
    'file_size' => $upload_max_filesize,
];
if (isset($_POST['reset'])) {
    if (!empty($_POST['video_url'])) {
        $query = "SELECT * FROM files WHERE location = ?";
        $sql = $bdd->prepare($query);
        $sql->execute([$_POST['video_url']]);
        if ($sql->rowCount() == 0) {
            @unlink($_POST['video_url']);
        }
    }
    if (!empty($_POST['image_url'])) {
        $query = "SELECT * FROM files WHERE location = ?";
        $sql = $bdd->prepare($query);
        $sql->execute([$_POST['image_url']]);
        if ($sql->rowCount() == 0) {
            @unlink($_POST['image_url']);
        }
    }
}
// Declarer la variable server et y stocker l'url du site
$json_response = json_encode($stat_data);
$server = $_SERVER['HTTP_HOST'];
if (isset($_POST['stat_id'])) {
    $stat_id = intval($_POST["stat_id"]);
    if (isset($_FILES['image'])) {
        // Store post stat_id in a variable
        $fileName = $_FILES['image']['name']; // Le nom original du fichier
        $fileType = $_FILES['image']['type']; // Le type du fichier (ex: image/webp)
        $fileSize = $_FILES['image']['size'];
        $fileTmpName = $_FILES['image']['tmp_name']; // Le nom temporaire du fichier

        $uploadDir = "uploads/vignettes/"; // Le nom du dossier où seront stockées les images
        !is_dir($uploadDir) ? mkdir($uploadDir) : null;
        $newFileName = uniqid() . ".webp"; // Le nouveau nom du fichier
        if (move_uploaded_file($fileTmpName, $uploadDir . $newFileName)) {
            $stat_data['id'] = $stat_id;
            $stat_data['image'] = "./uploads/vignettes/" . $newFileName;
            $stat_data['location'] = "./uploads/vignettes/" . $newFileName;
            $json_response = json_encode($stat_data);
        } else {
            // Il y a eu une erreur lors du déplacement du fichier
            $json_response =  json_encode(['status' => false, 'message' => "Erreur lors de l'importation du fichier"]);
        }
    }
    if (isset($_FILES['video'])) {
        $fileName = $_FILES['video']['name'];
        $fileType = $_FILES['video']['type'];
        $fileSize = $_FILES['video']['size'];
        $fileTmpName = $_FILES['video']['tmp_name'];
        $fileExt = pathinfo($fileName, PATHINFO_EXTENSION);
        $max_file_size = 104857600;

        $uploadDir = "uploads/videos/";
        !is_dir($uploadDir) ? mkdir($uploadDir) : null;
        $newFileName = uniqid() . "." . $fileExt;

        // Ajout de la vérification de la taille du fichier
        if ($fileSize > $max_file_size) {
            // Le fichier est trop grand
            $json_response =  json_encode(['status' => false, 'message' => "Le fichier dépasse la taille maximale autorisée"]);
        } else {
            // Le fichier est de taille valide
            if (move_uploaded_file($fileTmpName, $uploadDir . $newFileName)) {
                $stat_data['id'] = $stat_id;
                $stat_data['video'] = "./uploads/videos/" . $newFileName;
                $stat_data['location'] = "./uploads/videos/" . $newFileName;
                $json_response = json_encode($stat_data);
            } else {
                // Il y a eu une erreur lors du déplacement du fichier
                $json_response =  json_encode(['status' => false, 'message' => "Erreur lors de l'importation du fichier"]);
            }
        }
    }
}
if (isset($_POST['submit'])) {
    $uploaded_data = [
        'status' => true,
        'complete' => false,
        'success' => false,
        'message' => "Patientez...",
        'post_size' => $post_max_size || 0,
        'file_size' => $upload_max_filesize || 0,
    ];
    $stat_id = intval($_POST["stat_id"]);
    $user_id = 1;
    if (isset($_POST['title']) && !empty(trim($_POST['title']))) {
        $cookie_data['title'] = trim($_POST['title']);
    }
    if (isset($_POST['description']) && !empty(trim($_POST['description']))) {
        $cookie_data['desc'] = trim($_POST['description']);
    }

    foreach ($cookie_data as $key => $value) {
        setcookie("data[$key]", $value, time() + 2 * 3600);
    }
    if (isset($_COOKIE['data'])) {
        foreach ($_COOKIE['data'] as $key => $value) {
            $saved_cookies[$key] = $value;
        }
    }
    if (isset($_POST['video']) && isset($_POST['image'])) {
        $title = trim($_POST['title']);
        $descript = trim($_POST['desc']);
        $image = $_POST['image'];
        $video = $_POST['video'];
        $date = time();

        // Insert files in the database
        $video_file_query = "INSERT INTO files(stat_id, server, location, created) VALUES (?, ?, ?, ?)";
        $video_file_sql = $bdd->prepare($video_file_query);
        $video_file_sql->execute([$stat_id, $server, $video, $date]);

        $image_file_query = "INSERT INTO files(stat_id, server, location, created) VALUES (?,?,?,?)";
        $image_file_sql = $bdd->prepare($image_file_query);
        $image_file_sql->execute([$stat_id, $server, $image, $date]);

        // Get id of files
        $get_files_id_query = "SELECT id FROM files WHERE stat_id=? AND server=? ORDER BY created DESC";
        $get_files_id_sql = $bdd->prepare($get_files_id_query);
        $get_files_id_sql->execute([$stat_id, $server]);
        $resultat = $get_files_id_sql->fetchAll();
        $videos_id = $resultat[0]['id'];
        $images_id = $resultat[1]['id'];
        if ($videos_id) {
            // Insert video details in the table video (titre, des, video_file, image_file, user_id, date)
            $video_details_query = "INSERT INTO video(id,titre, des, video_file, image_file,user_id, date) VALUES(?,?,?,?,?,?,?)";
            $video_details_sql = $bdd->prepare($video_details_query);
            $video_details_sql->execute([generateRandomString(15), $title, $descript, $videos_id, $images_id, $user_id, $date]);
            if (isset($_COOKIE['data'])) {
                foreach ($_COOKIE['data'] as $key => $value) {
                    setcookie("data[$key]", $value, time() - 3600);
                }
            }
            $uploaded_data['complete'] = true;
            $uploaded_data['success'] = true;
            $uploaded_data['message'] = "Votre video a été publiée avec success";
            $json_response = json_encode($uploaded_data);
        } else {
            $uploaded_data['message'] = "Votre video n'a pu être publiée veuillez réessayer";
            @unlink($stat_data['video']);
            @unlink($stat_data['image']);
            $json_response = json_encode($uploaded_data);
        }
    }
}
echo $json_response;
