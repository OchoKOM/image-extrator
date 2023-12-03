const video_settings_menu = document.querySelector(".setting-menu-container"),
    video_settings_toggles = document.querySelectorAll(".m-section-menu-btn"),
    video_overlay = document.querySelector(".setting-menu-overlay"),
    root_dir = './';
let alert_status = {
    primary: "#info-fill",
    success: "#check-circle-fill",
    warning: "#exclamation-triangle-fill",
    danger: "#exclamation-triangle-fill"
}


video_settings_toggles.forEach((setting_toggle) => {
    setting_toggle.addEventListener("click", (e) => {
        video_settings_menu.classList.add('active');
        video_settings_menu.setAttribute('data-id', setting_toggle.getAttribute('data-video'));
        video_settings_menu.style.setProperty('--left', e.pageX + 'px');
        video_settings_menu.style.setProperty('--top', e.pageY + 'px');
        video_settings_menu.querySelector('ul').innerHTML =
            `<svg class="loader" viewBox="25 25 50 50" stroke-width="5">
                <circle cx="50" cy="50" r="20" />
            </svg>`
        getVideoMenu(setting_toggle.getAttribute('data-video'))
    });
});
video_overlay?.addEventListener("click", () => {
    video_settings_menu.classList.remove('active');
    video_settings_menu.removeAttribute('data-id')
})

function openMessage(status = 'primary', msg = "Les messages d'alerte seront affichés dans cette boite de dialogue") {
    let message = document.querySelector(".message")
    message.classList.remove('up-speed');
    message.classList.add("active");
    alert_container = message.querySelector(".alert")
    alert_container.className = `alert alert-${status}`;
    alert_container.innerHTML = `
    <svg class="alert-icon" fill="currentColor" height="30" width="50">
        <use xlink:href="${alert_status[status]}" />
    </svg>
    <div class="alert-message">${msg}</div>
    `
}
document.querySelector(".alert-close").addEventListener("click", closeMessage)
function closeMessage() {
    let message = document.querySelector(".message")
    message.classList.remove("active");
    message.classList.add('up-speed')
}
function getVideoMenu(id) {
    let xhr = new XMLHttpRequest();
    xhr.open("POST", root_dir + "partials/_setting-list.php", true);
    let form_data = new FormData();
    form_data.append("video_ed", id);
    xhr.onload = () => {
        if (xhr.status === 200) {
            let response = xhr.response;
            video_settings_menu.querySelector('ul').innerHTML = response;
            toggleItems(id);
        }
    }
    xhr.send(form_data);
}

function toggleItems(video_id) {
    const list_items = video_settings_menu.querySelectorAll('ul li');
    list_items.forEach(item => {
        item.addEventListener('click', () => {
            if (!item.getAttribute("data-action")) {
                let xhr = new XMLHttpRequest();
                xhr.open("POST", root_dir + "partials/_forms.php", true);
                let form = document.createElement("form")
                form.method = "post";
                form.enctype = "multipart/form-data";
                form.classList.add("form");
                form.id = video_id;
                form.innerHTML =
                    `<div class="hide-form hide-form-btn">&times;</div>
                <svg class="loader" viewBox="25 25 50 50" stroke-width="5">
                    <circle cx="50" cy="50" r="20" />
                </svg>`;
                document.body.appendChild(form);
                let form_data = new FormData();
                form_data.append("video_id", video_id);
                xhr.onload = () => {
                    if (xhr.status === 200) {
                        let response = xhr.response;
                        form.innerHTML = response;
                        formFunction(form)
                    }
                }
                xhr.send(form_data);
                form.addEventListener("submit", (e) => {
                    let titre = form.querySelector("#titre").value.trim(),
                        description = form.querySelector("#description").value.trim(),
                        form_image = form.querySelector("#img-src").value.trim();
                    let form_fields = {
                        title: titre,
                        description: description,
                        image: form_image
                    }
                    e.preventDefault();
                    let message = "Confirmation des modifications...";
                    openMessage("primary", message);
                    let xhr = new XMLHttpRequest();
                    xhr.open("GET", "apis/get-video-data.php?id=" + form.id);
                    xhr.responseType = "json";
                    xhr.onload = function () {
                        if (xhr.status == 200) {
                            try {
                                let video_data = xhr.response;
                                let isDifferent = false;
                                let form_data = new FormData();
                                form_data.append('submit', true)
                                form_data.append('video_id', form.id)
                                for (let key in form_fields) {
                                    if (form_fields[key] !== video_data[key] &&
                                        typeof form_fields[key] !== "undefined") {
                                        form_data.append(key, form_fields[key]);
                                        isDifferent = true;
                                    }
                                }
                                
                                if (isDifferent) {
                                    // Si des modifications ont été détectées, on envoie le FormData
                                    closeMessage();
                                    let uploadXhr = new XMLHttpRequest();
                                    uploadXhr.open("POST", "apis/update-video-data.php");
                                    uploadXhr.onload = function () {
                                        if (uploadXhr.status == 200) {
                                            try {
                                                let json_res = JSON.parse(this.response)
                                                let successMessage = "Les modifications ont été enregistrées avec succès.";
                                                openMessage("success", successMessage);
                                                console.log(json_res);
                                            } catch (e) {
                                                let message = "Impossible d'enregistrer les modifications, veuillez réessayer.";
                                                openMessage("warning", message);
                                                console.log(uploadXhr.response);
                                            }
                                        } else {
                                            let message = "Echec de l'enregistrement des modifications, veuillez réessayer.";
                                            openMessage("danger", message);
                                            console.error(uploadXhr.response);
                                        }
                                    };
                                    uploadXhr.send(form_data);
                                } else {
                                    let message = "Aucune modification détectée.";
                                    openMessage("warning", message);
                                    console.warn(xhr.response);
                                }

                            } catch (error) {
                                let message = "Echec de l'enregistrement des modifications veuillez réessayer";
                                openMessage("warning", message);
                                console.warn(error);
                                console.warn(xhr.response);
                                console.log(datas);
                            }
                        } else {
                            let message = "La requête a échoué";
                            openMessage("danger", message);
                        }
                    };
                    xhr.send();
                });

            } else {
                let action = item.getAttribute("data-action");
                // doAction(action);
            }
        })
    });
}
function formFunction(form) {
    let hide_form = form.querySelectorAll(".hide-form-btn"),
        image_input = document.getElementById("image"),
        video_input = document.getElementById("video"),
        imgPreview = document.getElementById("img-preview"),
        videoPreview = document.getElementById("video-preview"),
        play_btn = document.getElementById("play-btn"),
        pic_gen_btn = document.getElementById("gen-image"),
        uploading = document.querySelector(".uploading"),
        steps = form.querySelectorAll(".step"),
        step_skip = form.querySelectorAll('.step-jump .btn'),
        next_step_btns = form.querySelectorAll('[data-next-step]'),
        prev_step_btns = form.querySelectorAll('[data-prev-step]');
    hide_form.forEach(btn => {
        btn.addEventListener('click', () => {
            form.remove();
        });
    });
    image_input.addEventListener("change", async () => {
        if (image_input.value !== "") {
            if (await checkFileSize(image_input.files[0].size) !== false) {
                processImage(image_input.files[0], form);
            };
        }
    });
    next_step_btns.forEach(next_btn => {
        next_btn.addEventListener("click", () => {
            let currentStep = parseInt(next_btn.getAttribute('data-next-step'))
            nextStep(currentStep);
        })
    });
    prev_step_btns.forEach(prev_btn => {
        prev_btn.addEventListener("click", () => {
            let currentStep = parseInt(prev_btn.getAttribute('data-prev-step'))
            prevStep(currentStep);
        })
    });
    play_btn.addEventListener("click", () => {
        if (videoPreview.src !== "") {
            play_btn.checked ? videoPreview.play() : videoPreview.pause();
        } else {
            let message = "Patientez le chargement de la vidéo...";
            openMessage("warning", message)
            setTimeout(closeMessage, 3000);
            play_btn.checked = false;
        }
    })
    for (let i = 0; i < step_skip.length; i++) {
        const step_btn = step_skip[i];
        step_btn.addEventListener('click', () => {
            goToStep(i + 1);
        })
    }
    pic_gen_btn.addEventListener("click", () => {
        generatePicture(form)
    })
    function goToStep(n) {
        if (n !== 3) {
            videoPreview.pause();
            play_btn.checked = false;
        }
        resetSteps();
        // Show the specified step
        let targetStep = form.querySelector("#step-" + n);
        targetStep.classList.add("active");
        let targetBtn = form.querySelector(`#step-skip-${n}`);
        targetBtn.classList.add("active");
    }
    // Function to hide all steps except for the first one
    function resetSteps() {
        let stepskip = document.querySelectorAll(".step-jump .btn");
        for (let i = 0; i < steps.length; i++) {
            steps[i].classList.remove("active");
        }
        stepskip.forEach((btn) => {
            btn.classList.remove("active");
        });
    }
    // Function to show the next step
    function nextStep(n) {
        goToStep(n + 1);
    }

    // Function to show the previous step
    function prevStep(n) {
        goToStep(n - 1);
    }

    // Function to hide all steps except for the first one
    function resetSteps() {
        let stepskip = document.querySelectorAll(".step-jump .btn");
        for (let i = 0; i < steps.length; i++) {
            steps[i].classList.remove("active");
        }
        stepskip.forEach((btn) => {
            btn.classList.remove("active");
        });
    }
}
async function checkFileSize(size) {
    let isValid = false;

    let message = "Vérification de la taille du fichier...";
    openMessage("primary", message)

    try {
        let response = await fetch("apis/update-video-data.php", {
            method: "POST",
            body: JSON.stringify({ size: size }),
            headers: { "Content-Type": "application/json" }
        });

        if (response.ok) {
            let data = await response.json();
            let post_max_size = data.post_size;
            let file_max_size = data.file_size;

            if (size <= post_max_size && size <= file_max_size) {
                let message = "Le fichier a une taille valide";
                openMessage("primary", message);
                setTimeout(closeMessage, 3000);
                isValid = true;
            } else {
                if (size >= post_max_size) {
                    let message = "Le fichier ne doit pas dépaser " + formatFileSize(post_max_size);
                    openMessage("warning", message);
                } else if (size >= file_max_size) {
                    let message = "Le fichier ne doit pas dépaser " + formatFileSize(file_max_size);
                    openMessage("warning", message);
                } else {
                    console.log(data);
                }
            }
        } else {
            console.error("Erreur lors de l'envoi de la vidéo : ", response.status);
            let message = "Echec lors de la vérification de la taille du fichier";
            openMessage("danger", message);
        }
    } catch (error) {
        console.error("Erreur lors de l'envoi de la vidéo : ", error);
        let message = "Echec lors de la vérification de la taille du fichier";
        openMessage("danger", message);
    }

    return isValid;
}

function formatFileSize(size) {
    var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
    return (
        (size / Math.pow(1024, i)).toFixed(2) * 1 + ["B", "kB", "MB", "GB", "TB"][i]
    );
}

async function generatePicture(form) {
    id = form.id;
    let message = "Patientez le chargement de la vidéo..."
    openMessage("primary", message);
    let xhr = new XMLHttpRequest();
    xhr.open("GET", "apis/get-video-data.php?id=" + id);
    xhr.responseType = "json";
    xhr.onload = function () {
        if (xhr.status == 200) {
            try {
                let video_data = xhr.response;
                let video_url = video_data.video_url;
                closeMessage();
                processVideo(video_url, form);
            } catch (error) {
                let message = "Echec lors du chargement de la vidéo"
                openMessage("danger", message);
                console.warn(error);
                console.warn(xhr.response);
            }
        } else {
            let message = "Echec lors du chargement de la vidéo"
            openMessage("danger", message);
        }
    };
    xhr.send();
}

function processVideo(url, form) {
    let message = "Chargement de la vidéo..."
    openMessage("primary", message);
    // Créer un élément video pour lire le fichier
    let video = document.createElement("video");
    // Définir la source de la vidéo avec l'URL temporaire du fichier
    video.src = url;
    // Définir une fonction à exécuter lorsque les métadonnées du fichier sont chargées
    video.addEventListener("loadedmetadata", () => {
        // Récupérer la durée du fichier en secondes
        var duration = video.duration;

        // Générer un nombre aléatoire entre 0 et la durée
        var random = Math.random() * duration;

        // Définir le temps actuel du fichier avec le nombre aléatoire
        video.currentTime = random;

        // Définir une fonction à exécuter lorsque le fichier est prêt à être capturé
        video.addEventListener("seeked", () => {
            closeMessage();
            processCanvas(video, video.videoWidth, video.videoHeight, form);
        });
    });
}
function processImage(file, form) {
    // Créer un objet FileReader pour lire le fichier
    var reader = new FileReader();

    // Définir une fonction à exécuter lorsque le fichier est chargé
    reader.onload = function () {
        // Créer un élément image pour afficher le fichier
        var image = new Image();

        // Définir une fonction à exécuter lorsque l'image est chargée
        image.onload = function () {
            processCanvas(image, image.width, image.height, form);
        };

        // Définir la source de l'image avec les données du fichier
        image.src = this.result;
    };

    // Lire le fichier comme une URL
    reader.readAsDataURL(file);
}
function processCanvas(media, width, height, form) {
    media_width = media.width || media.videoWidth;
    media_height = media.height || media.videoHeight;
    // Créer un élément canvas pour dessiner l'image
    var canvas = document.createElement("canvas");

    // Récupérer le contexte 2D du canvas
    var context = canvas.getContext("2d");

    // Déterminer les dimensions du canvas en fonction du format 16/9
    var ratio = width / height;

    if (ratio > 16 / 9) {
        // L'image est trop large, on la recadre horizontalement
        width = (height * 16) / 9;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(
            media, (media_width - width) / 2,
            0, width, height, 0, 0, width, height
        );
    } else if (ratio < 16 / 9) {
        // L'image est trop haute, on la recadre verticalement
        height = (width * 9) / 16;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(
            media, 0, (media_height - height) / 2, width,
            height, 0, 0,
            width, height
        );
    } else {
        // L'image est déjà au format 16/9, on la conserve telle quelle
        canvas.width = width;
        canvas.height = height;
        context.drawImage(media, 0, 0);
    }

    // Convertir l'image en webp avec une qualité de 80%
    canvas.toBlob(blob => {
        let source = URL.createObjectURL(blob)
        document.getElementById('img-preview').src = source;
        document.getElementById('img-src').setAttribute('value', source);
        // Créer un objet FormData pour envoyer le blob au serveur
        var form_data = new FormData();
        form_data.append("submit", true);
        form_data.append("video_id", form.id);
        form_data.append("thumbnail_url", blob);
        // Obtenir l'heure de début
        startTime = new Date().getTime();
        // Déclarer la variable form qui contient l'élément form du document
        form.addEventListener("submit", (e) => {
            let xhreq = new XMLHttpRequest();
            // Ouvrir la connexion avec le fichier PHP qui va traiter l'image
            xhreq.open("POST", "apis/update-video-data.php");

            // Envoyer la requête avec le formulaire contenant l'image
            xhreq.send(form_data);

            // Définir une fonction à exécuter lorsque la réponse est reçue
            xhreq.onload = () => {
                if (xhreq.status === 200) {
                    // La requête a réussi, on affiche la réponse du serveur
                    try {
                        // Déclarer la variable json_data qui contient la réponse du serveur sous forme d'objet JSON
                        var json_data = JSON.parse(xhreq.response);
                    } catch (e) {
                        let message = "Nous avons rencontré une erreur inatendue";
                        openMessage("warning", message)
                        console.error(e);
                        console.log(xhreq.response);
                    }
                } else {
                    // La requête a échoué, on affiche un message d'erreur
                    let message = "La requête a échoué";
                    openMessage("danger", message)
                }
            };
            xhreq.upload.addEventListener("progress", e => {
                requestProgress(e, new Date().getTime());
            })
        })
    }, "image/webp", 0.8);
}

function requestProgress(req, startTime) {
    let uploading = document.querySelector(".uploading"),
        percent = document.getElementById("percent"),
        cancel = document.getElementById("cancel"),
        progressBar = document.querySelector(".progress-bar"),
        dataSent = document.getElementById("data-sent"),
        sendSpeed = document.getElementById("send-speed"),
        timeLeft = document.getElementById("time-left"),
        cancel_state = true;

    uploading.classList.add("active");

    // Calculer le transfert de données par seconde
    var time = (new Date().getTime() - startTime) / 1000;
    var bps = req.loaded / time;
    var MbpsValue = formatFileSize(bps);

    if (req.lengthComputable) {
        var percentComplete = (req.loaded / req.total) * 100;
        // req.loaded est en octets, le convertir en ko, mo ou go. à votre choix
        var mbTotal = formatFileSize(req.total);
        var mbLoaded = formatFileSize(req.loaded);

        // Calculer le temps restant
        var remTime = formatTime((req.total - req.loaded) / bps);

        // Afficher la sortie
        dataSent.innerHTML = mbLoaded + " Envoyés";
        sendSpeed.innerHTML = `${MbpsValue}/s`;
        timeLeft.innerHTML = `${remTime} Restant`;
        percent.innerHTML = Math.floor(percentComplete) + "% sur " + mbTotal;
        progressBar.style.width = percentComplete + "%";
        cancel.value = "Annuler";
        cancel.classList.remove('lite');
        if (req.loaded === req.total) {
            cancel.classList.add('lite');
            cancel.value = "Fermer";
            cancel_state = false;
        }
    }
}
