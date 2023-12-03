<?php
    require("../config.php");
    $key = "not_auth";
    $auth_owner = '   
    <li class="share" data-action="share">
        <span class="icon">
            <svg height="24" width="24" fill="currentColor">
                <use xlink:href="#share-link-fill" />
            </svg>
        </span>
        <span class="text">Partager</span>
    </li>
    <li class="edit">
        <span class="icon">
            <svg height="24" width="24" fill="currentColor">
                <use xlink:href="#edit-pencil-fill" />
            </svg>
        </span>
        <span class="text">Modifier</span>
    </li>
    <li class="delete" data-action="delete">
        <span class="icon">
            <svg height="24" width="24" fill="currentColor">
                <use xlink:href="#trash-fill" />
            </svg>
        </span>
        <span class="text">Supprimer</span>
    </li>
        ';
    $auth = '   
    <li class="share" data-action="share">
        <span class="icon">
            <svg height="24" width="24" fill="currentColor">
                <use xlink:href="#share-link-fill" />
            </svg>
        </span>
        <span class="text">Partager</span>
    </li>
    <li class="help" data-action="help">
        <span class="icon">
            <svg height="24" width="24" fill="currentColor">
                <use xlink:href="#info-fill" />
            </svg>
        </span>
        <span class="text">Signaler</span>
    </li>
        ';
    $not_auth = '   
    <li class="share" data-action="share">
        <span class="icon">
            <svg height="24" width="24" fill="currentColor">
                <use xlink:href="#share-link-fill" />
            </svg>
        </span>
        <span class="text">Partager</span>
    </li>
        ';
    if (isset($_POST['video_ed'])) {
        if (isset($_SESSION['auth'])) {
            $key = "auth";
            $check_video = $bdd->prepare('SELECT * FROM video WHERE id = ? AND user_id = ? LIMIT 1');
            $check_video->execute([$_POST['video_ed'],$_SESSION['id']]);
            $rowcount = $check_video->rowCount();
            if ($rowcount == 1) {
                $key = "auth_owner";
            }
        }
    }
    echo $$key;
?>
