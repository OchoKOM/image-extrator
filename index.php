<!DOCTYPE html>
<html lang="fr">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>
    <form method="post" enctype="multipart/form-data" id="main-form" class="form">
        <div class="step-jump">
            <input value="1" class="btn active" type="button" id="step-skip-1">
            <input value="2" class="btn" type="button" id="step-skip-2">
            <input value="3" class="btn" type="button" id="step-skip-3">
            <input value="4" class="btn" type="button" id="step-skip-4">
        </div>
        <div class="step active" id="step-1">
            <label for="titre">Titre de la video</label>
            <div class="tip">Donnez un titre à votre video puis cliquez sur suivant</div>
            <input type="text" required placeholder="Le titre de votre video..." maxlength="200" name="title" id="titre" class="input input-field">
            <input value="Suivant" class="btn" type="button" onclick="nextStep(1)">
        </div>
        <div class="step" id="step-2">
            <label for="description">Description (facultatif)</label>
            <div class="tip">Vous pouvez ignorer cette étape en appuyant sur suivant</div>
            <textarea name="description" id="description" maxlength="10000" placeholder="Decrivez votre video ici..." class="input input-field"></textarea>
            <input value="Précédent" class="btn lite" type="button" onclick="prevStep(2)" class="">
            <input value="Suivant" class="btn" type="button" onclick="nextStep(2)">
        </div>
        <div class="step" id="step-3">
            <label for="video">Selectionner une vidéo</label>
            <div class="tip">Selectinnez une video puis cliquez sur envoyer pour publier votre video</div>
            <div class="preview">
                <svg viewBox="0 0 60 60" height="200px">
                    <rect x="1" y="4" style="fill:#8697CB;" width="56" height="44" />
                    <path style="fill:#535D73;" d="M58,49H0V3h58V49z M2,47h54V5H2V47z" />
                    <polygon style="fill:#FFFFFF;" points="25,33 25,25.954 25,19 36,26   " />
                    <rect x="1" y="4" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M12,16H0V3h12V16z M2,14h8V5H2V14z" />
                    <rect x="1" y="15" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M12,27H0V14h12V27z M2,25h8v-9H2V25z" />
                    <rect x="1" y="26" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M12,38H0V25h12V38z M2,36h8v-9H2V36z" />
                    <rect x="1" y="37" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M12,49H0V36h12V49z M2,47h8v-9H2V47z" />
                    <rect x="47" y="4" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M58,16H46V3h12V16z M48,14h8V5h-8V14z" />
                    <rect x="47" y="15" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M58,27H46V14h12V27z M48,25h8v-9h-8V25z" />
                    <rect x="47" y="26" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M58,38H46V25h12V38z M48,36h8v-9h-8V36z" />
                    <rect x="47" y="37" style="fill:#687492;" width="10" height="11" />
                    <path style="fill:#535D73;" d="M58,49H46V36h12V49z M48,47h8v-9h-8V47z" />
                    <rect x="38" y="35" style="fill:#48A0DC;" width="22" height="22" />
                    <rect x="48" y="41" style="fill:#FFFFFF;" width="2" height="16" />
                    <polygon style="fill:#FFFFFF;" points="54.293,47.707 49,42.414 43.707,47.707 42.293,46.293 49,39.586 55.707,46.293   " />
                </svg>
                <video loop id="video-preview"></video>
                <div class="play-container">
                    <label>
                        <input type="checkbox" class="play-btn" id="play-btn" />
                        <div class="play-icon"></div>
                        <div class="pause-icon"></div>
                    </label>
                </div>

            </div>
            <div>
                <label for="video" id="browse-label" class="input">
                    <svg height="24" viewBox="0 -960 960 960" width="24" fill="#ffc400">
                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H160v400l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Z" />
                    </svg>
                    <input type="file" id="video" accept="video/*" required name="video" class="input-field">
                    Parcourir
                </label>
            </div>
            <br>
            <input value="Précédent" class="btn lite" type="button" onclick="prevStep(3)">
            <input value="Suivant" class="btn" type="button" onclick="nextStep(3)">
        </div>
        <div class="step" id="step-4">
            <label for="image">Image de couverture</label>
            <p class="tip">Cliquez sur parcourir pour choisir une image de de votre galerie puis confirmer ou générez à partir de la vidéo en cliquant sur générer</p>
            <div class="preview">
                <svg height="200px" viewBox="0 0 530 530" fill="currentColor">
                    <path d="M0,457.468h530.399V72.931H0V457.468z M44.627,412.333l105.824-147.133l65.334,90.838l40.49,56.295h-80.977H44.627    L44.627,412.333z M328.442,199.41l153.144,212.923H275.125l-6.426-8.932l-43.486-60.463L328.442,199.41z M117.81,122.91    c23.097,0,41.821,18.724,41.821,41.821c0,23.097-18.724,41.821-41.821,41.821c-23.097,0-41.821-18.724-41.821-41.821    C75.992,141.634,94.713,122.91,117.81,122.91z" />
                </svg>
                <img src="" alt="" id="img-preview">
            </div>
            <div>
                <button type="button" id="gen-image" class="input button">
                    <svg height="24" viewBox="0 -960 960 960" width="24" fill="#00fbd1">
                        <path d="M380-300v-360l280 180-280 180ZM480-40q-108 0-202.5-49.5T120-228v108H40v-240h240v80h-98q51 75 129.5 117.5T480-120q115 0 208.5-66T820-361l78 18q-45 136-160 219.5T480-40ZM42-520q7-67 32-128.5T143-762l57 57q-32 41-52 87.5T123-520H42Zm214-241-57-57q53-44 114-69.5T440-918v80q-51 5-97 25t-87 52Zm449 0q-41-32-87.5-52T520-838v-80q67 6 128.5 31T762-818l-57 57Zm133 241q-5-51-25-97.5T761-705l57-57q44 52 69 113.5T918-520h-80Z" />
                    </svg>
                    Générer
                </button>
                <label for="image" id="browse-img" class="input">
                    <svg height="24" viewBox="0 -960 960 960" width="24" fill="#ffc400">
                        <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h240l80 80h320q33 0 56.5 23.5T880-640H160v400l96-320h684L837-217q-8 26-29.5 41.5T760-160H160Z" />
                    </svg>
                    <input type="file" id="image" accept="image/*" name="image" class="input-field">
                    Parcourir
                </label>
            </div>
            <br>
            <input value="Précédent" class="btn lite" type="button" onclick="prevStep(4)">
            <input value="Envoyer" class="btn" type="submit" name="submit">
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
    </form>

    <div class="message">
        <svg style="display: none;">
            <symbol id="check-circle-fill" viewBox="0 0 16 16">
                <path d="M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z" />
            </symbol>
            <symbol id="info-fill" viewBox="0 0 16 16">
                <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z" />
            </symbol>
            <symbol id="exclamation-triangle-fill" viewBox="0 0 16 16">
                <path d="M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" />
            </symbol>
        </svg>

        <div class="alert alert-primary">
            <svg class="alert-icon" fill="currentColor" height="30" width="50">
                <use xlink:href="#info-fill" />
            </svg>
            <div class="alert-message">
                Suivez les instructions a fin de publier votre video
            </div>
        </div>
        <button type="button" class="alert-close">&times;</button>
    </div>
    <script src="index.js"></script>
    <!-- <script src="script.js"></script> -->
</body>

</html>