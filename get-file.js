let videos = document.querySelectorAll('video')

videos.forEach(async video => {
    video.src = await get_file(video.getAttribute('data-src'))
    video.poster = await get_file(video.getAttribute('data-poster'))
});

// Ajouter le mot-clé async devant la déclaration de la fonction
async function get_file(file_id) {
    var url, xhr = new XMLHttpRequest();
    // Créer une nouvelle promesse qui encapsule la requête XMLHttpRequest
    let promise = new Promise((resolve, reject) => {
        xhr.open('GET', 'get_file.php?file_id=' + file_id, true);
        xhr.responseType = 'blob';
        xhr.onload = function () {
            if (this.status == 200) {
                let blob = new Blob([this.response], { type: 'application/octet-stream'});
                url = URL.createObjectURL(blob);
                // Appeler la fonction resolve avec la valeur de url comme argument
                resolve(url);
            } else {
                // Appeler la fonction reject avec le message d'erreur comme argument
                reject('Erreur : ' + this.statusText);
            }
        };
        xhr.onerror = function () {
            // Appeler la fonction reject avec le message d'erreur comme argument
            reject('Erreur : ' + this.statusText);
        };
        xhr.send();
    });
    // Utiliser le mot-clé await pour attendre que la promesse soit résolue ou rejetée
    try {
        // Si la promesse est résolue, affecter la valeur renvoyée à la variable url
        url = await promise;
        // Retourner la valeur de url
        return url;
    } catch (error) {
        // Si la promesse est rejetée, afficher le message d'erreur
        console.error(error);
    }
}
