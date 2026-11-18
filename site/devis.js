// Envoi du formulaire de devis (sans recharger la page), avec photos facultatives
(function () {
  var f = document.getElementById('devis'), retour = document.getElementById('retour'), bouton = document.getElementById('envoyer');
  var champPhotos = document.getElementById('photos'), apercus = document.getElementById('apercus');
  var MAX_PHOTOS = 5, COTE_MAX = 1600, QUALITE = 0.82, POIDS_MAX = 8 * 1024 * 1024;
  var photos = []; // { fichier: File, url: string }

  document.getElementById('debut').value = Math.floor(Date.now() / 1000);
  function afficher(texte, type) { retour.textContent = texte; retour.className = 'message-form ' + (type || ''); }

  // ---------- Choix et aperçu des photos ----------
  function dessinerApercus() {
    if (!apercus) return;
    apercus.innerHTML = '';
    photos.forEach(function (p, i) {
      var li = document.createElement('li');
      var img = document.createElement('img');
      img.src = p.url; img.alt = ''; img.width = 72; img.height = 72;
      var btn = document.createElement('button');
      btn.type = 'button'; btn.className = 'retirer';
      btn.setAttribute('aria-label', 'Retirer la photo ' + (i + 1));
      btn.textContent = '×';
      btn.addEventListener('click', function () {
        URL.revokeObjectURL(p.url);
        photos.splice(i, 1);
        dessinerApercus();
        champPhotos.focus();
      });
      li.appendChild(img); li.appendChild(btn);
      apercus.appendChild(li);
    });
    var compteur = document.getElementById('photos-compteur');
    if (compteur) compteur.textContent = photos.length ? photos.length + ' / ' + MAX_PHOTOS + ' photo' + (photos.length > 1 ? 's' : '') + ' ajoutée' + (photos.length > 1 ? 's' : '') : '';
  }

  if (champPhotos) {
    champPhotos.addEventListener('change', function () {
      var refusees = 0, tropLourdes = 0;
      Array.prototype.forEach.call(champPhotos.files, function (fichier) {
        if (!/^image\//.test(fichier.type) && !/\.(jpe?g|png|webp|heic|heif|gif)$/i.test(fichier.name)) { refusees++; return; }
        if (fichier.size > 25 * 1024 * 1024) { tropLourdes++; return; }
        if (photos.length >= MAX_PHOTOS) { refusees++; return; }
        photos.push({ fichier: fichier, url: URL.createObjectURL(fichier) });
      });
      champPhotos.value = '';
      dessinerApercus();
      if (tropLourdes) afficher('Une photo est trop lourde. Choisissez-en une autre.', 'erreur');
      else if (refusees) afficher('Vous pouvez ajouter jusqu’à ' + MAX_PHOTOS + ' photos.', 'erreur');
      else afficher('');
    });
  }

  // Réduit une photo à 1600 px de côté (JPEG) pour un envoi rapide. Si le navigateur
  // ne sait pas la lire (ex. HEIC sur ordinateur), on envoie l’original s’il n’est pas trop lourd.
  function reduire(fichier) {
    return new Promise(function (ok) {
      var img = new Image(), url = URL.createObjectURL(fichier);
      img.onload = function () {
        var l = img.naturalWidth, h = img.naturalHeight, r = Math.min(1, COTE_MAX / Math.max(l, h));
        var c = document.createElement('canvas');
        c.width = Math.round(l * r); c.height = Math.round(h * r);
        var ctx = c.getContext('2d');
        ctx.fillStyle = '#fff'; ctx.fillRect(0, 0, c.width, c.height);
        ctx.drawImage(img, 0, 0, c.width, c.height);
        URL.revokeObjectURL(url);
        c.toBlob(function (b) { ok(b ? { blob: b, nom: 'photo.jpg' } : original()); }, 'image/jpeg', QUALITE);
      };
      img.onerror = function () { URL.revokeObjectURL(url); ok(original()); };
      img.src = url;
      function original() { return fichier.size <= POIDS_MAX ? { blob: fichier, nom: fichier.name } : null; }
    });
  }

  // ---------- Envoi ----------
  f.addEventListener('submit', function (e) {
    e.preventDefault();
    var manquants = [f.nom, f.tel].filter(function (c) { return !c.value.trim(); });
    [f.nom, f.tel].forEach(function (c) {
      if (manquants.indexOf(c) > -1) { c.setAttribute('aria-invalid', 'true'); c.setAttribute('aria-describedby', 'retour'); }
      else { c.removeAttribute('aria-invalid'); c.removeAttribute('aria-describedby'); }
    });
    if (manquants.length) {
      afficher('Indiquez votre nom et votre téléphone pour que nous puissions vous rappeler.', 'erreur');
      manquants[0].focus();
      return;
    }
    bouton.disabled = true; bouton.textContent = photos.length ? 'Envoi des photos…' : 'Envoi en cours…'; afficher('');

    var donnees = new FormData(f);
    donnees.delete('photos[]');
    Promise.all(photos.map(function (p) { return reduire(p.fichier); }))
      .then(function (reduites) {
        reduites.forEach(function (r, i) { if (r) donnees.append('photos[]', r.blob, (i + 1) + '-' + r.nom); });
        return fetch(f.action, { method: 'POST', body: donnees });
      })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.ok) {
          afficher(d.message, 'ok'); f.reset();
          photos.forEach(function (p) { URL.revokeObjectURL(p.url); });
          photos = []; dessinerApercus();
          document.getElementById('debut').value = Math.floor(Date.now() / 1000);
        } else { afficher(d.message, 'erreur'); }
      })
      .catch(function () { afficher('L’envoi n’a pas fonctionné. Appelez-nous au 06 66 18 19 15.', 'erreur'); })
      .then(function () { bouton.disabled = false; bouton.textContent = 'Envoyer ma demande de devis'; });
  });
})();
