// Envoi du formulaire de devis (sans recharger la page)
(function () {
  var f = document.getElementById('devis'), retour = document.getElementById('retour'), bouton = document.getElementById('envoyer');
  document.getElementById('debut').value = Math.floor(Date.now() / 1000);
  function afficher(texte, type) { retour.textContent = texte; retour.className = 'message-form ' + (type || ''); }
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
    bouton.disabled = true; bouton.textContent = 'Envoi en cours…'; afficher('');
    fetch(f.action, { method: 'POST', body: new FormData(f) })
      .then(function (r) { return r.json(); })
      .then(function (d) {
        if (d.ok) {
          afficher(d.message, 'ok'); f.reset();
          if (window.acConversion) window.acConversion('formulaire');
          document.getElementById('debut').value = Math.floor(Date.now() / 1000);
        } else { afficher(d.message, 'erreur'); }
      })
      .catch(function () { afficher('L’envoi n’a pas fonctionné. Appelez-nous au 06 66 18 19 15.', 'erreur'); })
      .then(function () { bouton.disabled = false; bouton.textContent = 'Envoyer ma demande de devis'; });
  });
})();
