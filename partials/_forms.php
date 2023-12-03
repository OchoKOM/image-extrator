<?php
    require("../config.php");
    $close_form = '<div class="hide-form hide-form-btn">&times;</div>';
    $key = "not_auth";
    $titre = '';
    $des = '';
    $video = '';
    $image = '';
    if (isset($_POST['video_id'])) {
        if (isset($_SESSION['auth'])) {
            $key = "auth";
            $check_video = $bdd->prepare('SELECT * FROM video WHERE id = ? AND user_id = ? LIMIT 1');
            $check_video->execute([$_POST['video_id'],$_SESSION['id']]);
            $rowcount = $check_video->rowCount();
            if ($rowcount == 1) {
                $key = "auth_owner";
                $fetch_video = $check_video->fetch();
                $titre = $fetch_video['titre'];
                $des = $fetch_video['des'];
                $video = "file.php?id=".$fetch_video['video_file'];
                $image = "file.php?id=".$fetch_video['image_file'];
            }
        }
    }

    $auth_owner = '   
        <div class="step-jump">
            <input value="1" class="btn active" type="button" id="step-skip-1">
            <input value="2" class="btn" type="button" id="step-skip-2">
            <input value="3" class="btn" type="button" id="step-skip-3">
            <input value="4" class="btn" type="button" id="step-skip-4">
        </div>
        <div class="step active" id="step-1">
            <label for="titre">Titre de la video</label>
            <div class="tip">Modifiez le titre puis cliquez sur suivant *Si vous ignorez cette étape le titre ne sera pas modifié*</div>
            <input type="text" required placeholder="Le titre de votre video..." maxlength="200" name="title" id="titre" class="input input-field" value="'.$titre.'">
            <input value="Suivant" class="btn" type="button" data-next-step="1">
        </div>
        <div class="step" id="step-2">
            <label for="description">Description</label>
            <div class="tip">Modifiez ou ajoutez une description puis cliquez sur suivant *Si vous ignorez cette étape la description ne sera pas modifié*</div>
            <textarea name="description" id="description" maxlength="10000" placeholder="Decrivez votre video ici..." class="input input-field">'.$des.'</textarea>
            <input value="Précédent" class="btn lite" type="button"  data-prev-step="2">
            <input value="Suivant" class="btn" type="button" data-next-step="2">
        </div>
        <div class="step" id="step-3">
            <label for="video">Votre vidéo</label>
            <div class="tip">Cliquez sur suivant pour modifier l\'image de couverture</div>
            <div class="preview">
                <svg height="200px">
                    <use xlink:href="#film-full" />
                </svg>
                <video loop="" id="video-preview" controlslist="nodownload" src="'.$video.'"></video>
                <div class="play-container">
                    <label>
                    <input type="checkbox" class="play-btn" id="play-btn">
                    <div class="play-icon"></div>
                    <div class="pause-icon"></div>
                    </label>
                </div>
            </div>
            <br>
            <input value="Précédent" class="btn lite" type="button"  data-prev-step="3">
            <input value="Suivant" class="btn" type="button" data-next-step="3">
        </div>
        <div class="step" id="step-4">
            <label for="image">Image de couverture</label>
            <p class="tip">Modifiez votre image de couverture ou generez en une autre à partir de la vidéo *Si vous ignorez cette étape l\'image ne sera pas modifié*</p>
            <div class="preview">
                <svg height="200px" fill="currentColor">
                    <use xlink:href="#land-icon-fill" />
                </svg>
                <img src="'.$image.'" alt="" id="img-preview">
            </div>
            <div>
                <span type="button" id="gen-image" class="input button">
                    <svg height="24" width="24" fill="#00fbd1">
                        <use xlink:href="#autoplay-fill" />
                    </svg>
                    Générer
                </span>
                <label for="image" id="browse-img" class="input">
                    <svg height="24" width="24" fill="#ffc400">
                        <use xlink:href="#folder-fill" />
                    </svg>
                    <input type="file" id="image" accept="image/*" name="image" class="input-field">
                    Parcourir
                </label>
            </div>
            <br>
            <input value="Précédent" class="btn lite" type="button"  data-prev-step="4">
            <input value="Confirmer" class="btn" type="submit" name="submit">
        </div>
        <div class="uploading">
            <h3>Chargement des données</h3>
            <div class="uploading-top">
                <input value="Envoi" class="btn" type="button" id="send-stat">
                <span id="percent" class="lite span">0%</span>
                <input value="Annuler" class="btn" type="button" id="cancel">
            </div>
            <div class="progress">
                <div class="progress-bar"></div>
            </div>
            <div class="uploading-bottom">
                <span id="data-sent" class="lite span">Loaded/Total</span>
                <span id="send-speed" class="lite span">Vitesse</span>
                <span id="time-left" class="lite span">Temps restant</span>
            </div>
        </div>
        ';
    $auth = '   
        <div class="step-jump">
            <input value="1" class="btn active" type="button" id="step-skip-1">
        </div>
        <div class="step active" id="step-1">
            <label for="titre">Erreur</label>
            <div class="tip">Impossible d\'afficher ce formulaire veuillez réessayer</div>
            <input value="Fermer" class="btn lite hide-form-btn" type="button">
        </div>
        ';
        $not_auth = '   
        <div class="step-jump">
            <input value="1" class="btn active" type="button" id="step-skip-1">
        </div>
        <div class="step active" id="step-1">
            <label for="titre">Erreur</label>
            <div class="tip">Impossible d\'afficher ce formulaire veuillez réessayer</div>
            <input value="Fermer" class="btn lite hide-form-btn" type="button">
        </div>
        ';
    echo $close_form.$$key;
?>