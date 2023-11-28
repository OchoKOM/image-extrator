// On récupère les éléments du DOM
let form_v = document.getElementById("main-form"),
  image_input = document.getElementById("image"),
  video_input = document.getElementById("video"),
  imgPreview = document.getElementById("img-preview"),
  videoPreview = document.getElementById("video-preview"),
  play_btn = document.getElementById("play-btn"),
  pic_gen_btn = document.getElementById("gen-image"),
  uploading = document.querySelector(".uploading"),
  sendStat = document.getElementById("send-stat"),
  percent = document.getElementById("percent"),
  cancel = document.getElementById("cancel"),
  progressBar = document.querySelector(".progress-bar"),
  dataSent = document.getElementById("data-sent"),
  sendSpeed = document.getElementById("send-speed"),
  timeLeft = document.getElementById("time-left"),
  startTime, cancel_state = true, xhreq = new XMLHttpRequest();

play_btn.addEventListener("click", () => {
  if (videoPreview.src !== "") {
    play_btn.checked ? videoPreview.play() : videoPreview.pause();
  }else{
    let message = "Vous devez d'abord charger une vidéo pour la lire.";
    openMessage("warning",  message)
    setTimeout(closeMessage, 3000);
    play_btn.checked = false;
  }
})
let stat_id = Math.floor(Math.random() * 1000000000);
let stat_data = [{
  id: stat_id,
  image: false,
  video: false,
  from_video: true,
  started: false,
  complete: false,
}];
let alert_status = {
  primary: "#info-fill",
  success: "#check-circle-fill",
  warning: "#exclamation-triangle-fill",
  danger: "#exclamation-triangle-fill"
}
let steps = document.querySelectorAll(".step"),
  step_skip = document.querySelectorAll('.step-jump .btn');

for (let i = 0; i < step_skip.length; i++) {
  const step_btn = step_skip[i];
  step_btn.addEventListener('click', () => {
    goToStep(i + 1);
  })
}

for (let i = 0; i < steps.length; i++) {
  let step_input = steps[i].querySelector('.input-field');
  step_input.addEventListener('focus', () => {
    goToStep(i + 1);
  })
}
// Function to genrate random string with customisable lenght
function generateRandomString(length = 15) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789_';
  for (var i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
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

// Function to go to a specific step
function goToStep(n) {
  if (n !== 3) {
    videoPreview.pause();
    play_btn.checked = false;
  }
  resetSteps();
  // Show the specified step
  var targetStep = document.getElementById("step-" + n);
  targetStep.classList.add("active");
  var targetBtn = document.getElementById(`step-skip-${n}`);
  targetBtn.classList.add("active");
}

document.querySelector(".alert-close").addEventListener("click", closeMessage)

function closeMessage() {
  let message = document.querySelector(".message")
  message.classList.remove("active");
  message.classList.add('up-speed')
}
function openMessage(status = 'success', msg = "Votre video est publiée avec success") {
  let message = document.querySelector(".message")
  message.classList.remove('up-speed');
  message.classList.add("active");
  alert_container = message.querySelector(".alert")
  alert_container.className = `alert alert-${status}`;
  alert_container.innerHTML = `<svg class="alert-icon" fill="currentColor" height="30" width="50">
                                <use xlink:href="${alert_status[status]}" />
                              </svg>
                              <div class="alert-message">${msg}</div>
                              `
}

image_input.addEventListener("change", () => {
  if (image_input.value !== "") {
    processMedia(image_input, "image");
    stat_data[0].started = true;
    stat_data[0].from_video = false;
  }
});
// Ajoutez cette fonction pour envoyer la vidéo à upload-video.php
function uploadVideo() {
  let formData = new FormData(form_v);
  formData.append("stat_id", stat_id);
  xhreq.open("POST", "upload.php", true);
  startTime = new Date().getTime();
  xhreq.addEventListener("load", () => {
    if (xhreq.status === 200) {
      try {
        var response = JSON.parse(xhreq.response);
        if (response['video']) {
          stat_data[0].video = response.video;
          updateStat({
            image: stat_data[0].image,
            video: response.video,
          });
        } else {
          updateStat({
            image: stat_data[0].image,
            video: false,
          });
        }
        if (stat_data[0].from_video) {
          processMedia(response.location, "video");
        }
      } catch (e) {
        console.error("Erreur lors du chargement de la vidéo : ", e);
        let message = "Erreur lors du chargement de la vidéo"
        openMessage("warning", message)
        console.warn(xhreq.response);
      }
    } else {
      let message = "Erreur lors de l'envoi de la vidéo"
      openMessage("warning", message)
      console.error("Erreur lors de l'envoi de la vidéo : ", xhreq.status);
    }
  });
  xhreq.send(formData);
}

// Modifiez votre gestionnaire d'événements pour appeler uploadVideo
video_input.addEventListener("change", () => {
  if (video_input.value !== "") {
    stat_data[0].started = true;
    // Créer un élément video pour lire le fichier
    let video = document.createElement("video"),
      play_error = false;
    // Définir la source de la vidéo avec l'URL temporaire du fichier
    video.src = URL.createObjectURL(video_input.files[0]);

    video.addEventListener('error', (e) => {
      play_error = e.target.error.MEDIA_ERR_ABORTED == e.target.error ? true : false;
      // Définir une fonction à exécuter en cas d'erreur
      console.log("Une erreur s'est produite lors de la lecture de la vidéo");
      let message = "Une erreur s'est produite lors de la lecture de la vidéo"
      openMessage("warning", message)
      console.log(e); // Afficher l'objet d'erreur
      console.log(video.error.code); // Afficher le code d'erreur
      console.log(video.error.message); // Afficher le message d'erreur
    });
    if (play_error === false) {
      uploadVideo();
    }
  }
});
function processMedia(input, mediaType) {
  if (mediaType === "image") {
    if (input.value) {
      // Récupérer le fichier choisi
      var file = input.files[0];
      processImage(file);
    }
  } else if (mediaType === "video") {
    processVideo(input);
  }
}

function processImage(file) {
  // Créer un objet FileReader pour lire le fichier
  var reader = new FileReader();

  // Définir une fonction à exécuter lorsque le fichier est chargé
  reader.onload = function () {
    // Créer un élément image pour afficher le fichier
    var image = new Image();

    // Définir une fonction à exécuter lorsque l'image est chargée
    image.onload = function () {
      processCanvas(image, image.width, image.height);
    };

    // Définir la source de l'image avec les données du fichier
    image.src = this.result;
  };

  // Lire le fichier comme une URL
  reader.readAsDataURL(file);
}

function processVideo(file) {

  // Créer un élément video pour lire le fichier
  let video = document.createElement("video");
  // Définir la source de la vidéo avec l'URL temporaire du fichier
  video.src = file;
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
      if (stat_data[0].from_video) {
        processCanvas(video, video.videoWidth, video.videoHeight);
      }
    });
  });

}
pic_gen_btn.addEventListener("click", generatePicture)
function generatePicture() {
  if (stat_data[0].video !== false) {
    if (stat_data[0].image !== false) {
      // Créer un objet FormData avec les données à envoyer
      let f_data = new FormData(),
        video_url = "",
        image_url = stat_data[0].image ? stat_data[0].image : "";
      f_data.append("reset", "reset");
      f_data.append("video_url", video_url);
      f_data.append("image_url", image_url);
      // Créer un objet XMLHttpRequest pour envoyer la requête
      let xhreq = new XMLHttpRequest();
      xhreq.open("POST", "upload.php");
      xhreq.addEventListener("load", () => {
        if (xhreq.status === 200) {
          try {
            var response = JSON.parse(xhreq.response);
          } catch (e) {
            console.warn(xhreq.response);
          }
        } else {
          console.error("Erreur lors de l'envoi de la vidéo : ", xhreq.status);
        }
      });
      xhreq.send(f_data);
    }
    processVideo(stat_data[0].video);
  }else{
    let message = "Vous devez d'abord publier une vidéo"
    openMessage("warning", message)
  }
}

function processCanvas(media, width, height) {
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

  // Convertir l'image en webp avec une qualité de 100%
  canvas.toBlob(blob => {
    // Créer un objet FormData pour envoyer le blob au serveur
    var form = new FormData();
    form.append("image", blob);
    form.append("stat_id", stat_id);
    // Obtenir l'heure de début
    startTime = new Date().getTime();

    // Ouvrir la connexion avec le fichier PHP qui va traiter l'image
    xhreq.open("POST", "upload.php");

    // Envoyer la requête avec le formulaire contenant l'image
    xhreq.send(form);

    // Définir une fonction à exécuter lorsque la réponse est reçue
    xhreq.onload = () => {
      if (xhreq.status === 200) {
        // La requête a réussi, on affiche la réponse du serveur
        try {
          json_data = JSON.parse(xhreq.response);
          updateStat({
            image: json_data.image,
            video: stat_data[0].video,
          });
          stat_data[0].image = json_data.image;
        } catch (e) {
          let message = "Nous avons rencontré une erreur inatendue";
          openMessage("primary", message)
          console.error(e);
          console.log(xhreq.response);
        }
      } else {
        // La requête a échoué, on affiche un message d'erreur
        let message = "La requête a échoué";
        openMessage("danger", message)
      }
    };
  }, "image/webp", 1);
}

// Ajouter un écouteur d'événement pour la progression du téléchargement
xhreq.upload.addEventListener("progress", e => {
  if (e.lengthComputable) {
    uploading.classList.add("active");
    var percentComplete = (e.loaded / e.total) * 100;
    // e.loaded est en octets, le convertir en ko, mo ou go. à votre choix
    var mbTotal = formatFileSize(e.total);
    var mbLoaded = formatFileSize(e.loaded);

    // Calculer le transfert de données par seconde
    var time = (new Date().getTime() - startTime) / 1000;
    var bps = e.loaded / time;
    var MbpsValue = formatFileSize(bps);

    // Calculer le temps restant
    var remTime = formatTime((e.total - e.loaded) / bps);

    // Afficher la sortie
    dataSent.innerHTML = mbLoaded + " Envoyés";
    sendSpeed.innerHTML = `${MbpsValue}/s`;
    timeLeft.innerHTML = `${remTime} Restant`;
    percent.innerHTML = Math.floor(percentComplete) + "% sur " + mbTotal;
    progressBar.style.width = percentComplete + "%";
    cancel.value = "Annuler";
    cancel.classList.remove('lite');
    if (e.loaded === e.total) {
      cancel.classList.add('lite');
      cancel.value = "Fermer";
      cancel_state = false;
    }
  }
});


cancel.addEventListener('click', () => {
  if (cancel_state) {
    xhreq.abort();
    form_v.reset();
    cancel.classList.add('lite');
    cancel.value = "Annulé";
    setTimeout(() => {
      cancel.value = "Fermer";
    }, 500);
    cancel_state = false;
    let message = "Vous avez annulé une requête en progression";
    openMessage("primary", message);
  } else {
    cancel.classList.remove('lite');
    cancel.value = "Annuler";
    cancel_state = true;
    uploading.classList.remove("active");
  }
})
function updateStat(data) {
  document.getElementById('img-preview').src = data.image ? data.image : "";
  document.getElementById('video-preview').src = data.video ? data.video : "";
}

function formatFileSize(size) {
  var i = size == 0 ? 0 : Math.floor(Math.log(size) / Math.log(1024));
  return (
    (size / Math.pow(1024, i)).toFixed(2) * 1 + ["B", "kB", "MB", "GB", "TB"][i]
  );
}

function formatTime(time, second = false) {
  const leadingZeroFormatter = new Intl.NumberFormat(undefined, {
    minimumIntegerDigits: 2,
  });
  if (isNaN(time)) {
    time = 0;
  }
  const seconds = Math.floor(time % 60);
  const minutes = Math.floor(time / 60) % 60;
  const hours = Math.floor(time / 3600);
  if (hours === 0) {
    return !second
      ? `${minutes}:${leadingZeroFormatter.format(seconds)}`
      : `${minutes}:${leadingZeroFormatter.format(seconds)} s`;
  } else {
    return `${hours}:${leadingZeroFormatter.format(
      minutes
    )}:${leadingZeroFormatter.format(seconds)}`;
  }
}
window.addEventListener("beforeunload", (event) => {
  // Envoyer la requête si les données ne sont pas complètes
  if (stat_data[0].complete === false && stat_data[0].started === true) {
    // Annuler l'événement par défaut
    event.preventDefault();
    // Définir la propriété returnValue sur un message d'avertissement 
    if (stat_data[0].video !== false || stat_data[0].image !== false) {
      // Créer un objet FormData avec les données à envoyer
      let f_data = new FormData(),
        video_url = stat_data[0].video ? stat_data[0].video : "",
        image_url = stat_data[0].image ? stat_data[0].image : "";
      f_data.append("reset", "reset");
      f_data.append("video_url", video_url);
      f_data.append("image_url", image_url);
      // Créer un objet XMLHttpRequest pour envoyer la requête
      let xhreq = new XMLHttpRequest();
      xhreq.open("POST", "upload.php");
      xhreq.addEventListener("load", () => {
        if (xhreq.status === 200) {
          try {
            var response = JSON.parse(xhreq.response);
            console.log(response);
          } catch (e) {
            console.error("Erreur lors du chargement de la vidéo : ", e);
            console.warn(xhreq.response);
          }
        } else {
          console.error("Erreur lors de l'envoi de la vidéo : ", xhreq.status);
        }
      });
      updateStat({
        image: false,
        video: false,
      });
      xhreq.send(f_data);
    }
  }
});
form_v.addEventListener("submit", (e) => {
  e.preventDefault();
  const titre = document.getElementById('titre'),
    description = document.getElementById('description');
  xhreq.open('POST', 'upload.php', true);
  xhreq.addEventListener('load', () => {
    if (xhreq.status === 200) {
      try {
        var response = JSON.parse(xhreq.response);
        if (response.complete === true) {
          stat_data[0].complete = true;
          updateStat({
            image: false,
            video: false,
          });
          form_v.reset();
          stat_data[0].started = false;
          stat_data[0].complete = false;
          // La vidéo a éte bien publiée
          let message = "Votre video a été publiée avec success";
          openMessage("success", message)
        }else{
          // Erreur d'insertion dans la base de donnée
          let message = "Une erreur est survenue pendant le traitement de votre publication";
          openMessage("danger", message)
        }
      } catch (e) {
        console.error("Erreur lors de la reception des données : ", e);
        console.warn(xhreq.response); 
        let message = "Une erreur est survenue pendant le traitement de votre publication";
        openMessage("danger", message)
      }
    } else {
      console.error("Erreur  : ", xhreq.status);
      // La requête a échoué, on affiche un message d'erreur
      let message = "La requête a échoué";
      openMessage("danger", message)
    }
  })
  let formData = new FormData();
  formData.append("submit", true);
  formData.append("stat_id", stat_id);
  formData.append("title", titre.value);
  formData.append("desc", description.value);
  formData.append("image", stat_data[0].image);
  formData.append("video", stat_data[0].video);
  xhreq.send(formData);
})