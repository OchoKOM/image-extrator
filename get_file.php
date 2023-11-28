<?php
ob_start();
require('config.php');
// Vérifiez si l'ID du fichier est défini
if(isset($_GET['file_id'])) {
    $file_id = $_GET['file_id'];

    // Récupérez le fichier de la base de données
    $stmt = $bdd->prepare("SELECT * FROM files WHERE id = ?");
    $stmt->execute([$file_id]);
    $file = $stmt->fetch();
    if($file) {
        // Envoyez le contenu du fichier au navigateur
        header('Content-Type: video/*');
        header('Content-Length: ' . filesize($file['location']));
        readfile($file['location']);
    } else {
        // Gérez le cas où le fichier n'existe pas
        header('HTTP/1.0 404 Not Found');
    }
}
ob_end_flush();
?>
