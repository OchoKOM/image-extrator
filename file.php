<?php
require('config.php');
$server = 'http://' . $_SERVER['HTTP_HOST'];

if (isset($_GET['id'])) {
    // Récupération de l'ID de la vidéo depuis la requête GET
    $getid = $_GET['id'];

    // Préparation de la requête SQL pour récupérer les informations de la vidéo à partir de l'ID
    $rowv = $bdd->prepare('SELECT * FROM files WHERE id= ?');

    // Exécution de la requête SQL avec l'ID de la vidéo
    $rowv->execute(array($getid));

    // Récupération des informations de la vidéo dans un tableau associatif
    $row = $rowv->fetch();

    // Récupération du chemin d'accès à la vidéo depuis le tableau associatif
    $location = $row['location'];

    // Définition du chemin d'accès à la vidéo
    $path = $location;

    // Récupération de la taille du fichier vidéo en octets
    $size = filesize($path);

    // Ouverture du fichier vidéo en mode lecture binaire
    $fm = fopen($path, 'rb');

    // Vérification que le fichier a bien été ouvert en lecture binaire
    if (!$fm) {
        die();
    }

    // Envoi des entêtes HTTP pour indiquer que le contenu est envoyé en plusieurs parties et pour définir la taille totale du contenu
    header("Accept-Ranges: bytes");
    header("Transfer-Encoding: chunked ". $size);
    header("Content-Length: " . $size);
    header("Content-Disposition: inline;");
    header("Content-Transfert-Encoding: binary\n");
    header("Connexion: close");

    // Envoi du contenu du fichier au client
    fpassthru($fm);

    // Fermeture du fichier vidéo
    fclose($fm);
} elseif (isset($_GET['location'])) {
    $getid = $_GET['location'];
    $rowv = $bdd->prepare('SELECT * FROM files WHERE id= ?');
    $rowv->execute(array($getid));
    $row = $rowv->fetch();
    $location = './' . $row['chemin'];
    echo $location;
}