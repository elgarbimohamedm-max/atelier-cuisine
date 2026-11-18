// Google Ads : bannière cookies + suivi des demandes de devis et des appels.
//
// À REMPLIR une fois le compte Google Ads créé (voir README.md, partie « Google Ads ») :
//   id                 : identifiant du compte, par exemple 'AW-123456789'
//   libelleFormulaire  : libellé de la conversion « Demande de devis » (ex. 'AbCdEfGhIj')
//   libelleAppel       : libellé de la conversion « Clic sur le téléphone »
// Tant que « id » est vide, ce fichier ne fait rien : pas de bannière, aucun cookie.
var REGLAGES_PUB = {
  id: '',
  libelleFormulaire: '',
  libelleAppel: ''
};

(function () {
  var R = REGLAGES_PUB;
  var CLE = 'ac-cookies';               // choix du visiteur, gardé 6 mois
  var DUREE = 182 * 24 * 3600 * 1000;   // 6 mois (recommandation CNIL)

  // Les conversions sont envoyées seulement si le visiteur a accepté
  window.acConversion = function (type) {
    var libelle = type === 'appel' ? R.libelleAppel : R.libelleFormulaire;
    if (window.gtag && R.id && libelle) {
      window.gtag('event', 'conversion', { send_to: R.id + '/' + libelle });
    }
  };
  if (!R.id) return;

  function lireChoix() {
    try {
      var c = JSON.parse(localStorage.getItem(CLE));
      if (c && (c.choix === 'oui' || c.choix === 'non') && Date.now() - c.date < DUREE) return c.choix;
    } catch (e) {}
    return null;
  }
  function ecrireChoix(choix) {
    try { localStorage.setItem(CLE, JSON.stringify({ choix: choix, date: Date.now() })); } catch (e) {}
  }

  function chargerGoogle() {
    if (window.gtag) return;
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('consent', 'default', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'denied', analytics_storage: 'denied'
    });
    window.gtag('js', new Date());
    window.gtag('config', R.id);
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(R.id);
    document.head.appendChild(s);
  }

  // Après un refus : on efface les cookies Google déjà déposés
  function effacerCookiesGoogle() {
    document.cookie.split(';').forEach(function (c) {
      var nom = c.split('=')[0].trim();
      if (/^(_gcl|_ga|_gid)/.test(nom)) {
        var domaine = location.hostname.replace(/^www\./, '');
        ['', '; domain=' + domaine, '; domain=.' + domaine].forEach(function (d) {
          document.cookie = nom + '=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/' + d;
        });
      }
    });
  }

  function ajouterStyle() {
    var s = document.createElement('style');
    s.textContent =
      '.cookies{position:fixed;left:16px;right:16px;bottom:calc(16px + env(safe-area-inset-bottom,0px));z-index:30;max-width:760px;margin:0 auto;display:flex;align-items:center;gap:20px;padding:18px 20px;background:var(--carte,var(--fond,#fff));color:var(--texte,#1A2533);border:1px solid var(--trait,#D5E0EB);border-radius:12px;box-shadow:0 10px 30px rgba(10,25,45,.25);font-size:1rem;line-height:1.5}' +
      '.cookies p{flex:1;margin:0}' +
      '.cookies-boutons{display:flex;gap:10px;flex:none}' +
      '.cookies button{min-height:44px;padding:8px 18px;border:2px solid var(--bleu,#1E4B7A);border-radius:8px;background:transparent;color:var(--bleu,#1E4B7A);font-family:\'Space Grotesk\',sans-serif;font-weight:700;font-size:1rem;cursor:pointer}' +
      '.cookies button:hover{background:var(--fond-plan,#F2F6FA)}' +
      '@media (max-width:600px){.cookies{flex-direction:column;align-items:stretch;gap:14px;padding:16px}.cookies-boutons button{flex:1}}' +
      '.lien-cookies{background:none;border:0;padding:0;font:inherit;color:inherit;text-decoration:underline;cursor:pointer}';
    document.head.appendChild(s);
  }

  var banniere;
  function fermer() { if (banniere) { banniere.remove(); banniere = null; } }
  function decider(choix) {
    var avant = lireChoix();
    ecrireChoix(choix);
    fermer();
    if (choix === 'oui') chargerGoogle();
    else { effacerCookiesGoogle(); if (avant === 'oui') location.reload(); }
  }

  function afficherBanniere() {
    if (banniere) return;
    banniere = document.createElement('div');
    banniere.className = 'cookies';
    banniere.setAttribute('role', 'region');
    banniere.setAttribute('aria-label', 'Cookies');
    banniere.innerHTML =
      '<p><strong>Cookies</strong> : avec votre accord, nous utilisons un cookie de Google Ads pour savoir si nos annonces vous ont amené ici. ' +
      'Aucun cookie n’est déposé si vous refusez. <a href="mentions-legales.html#cookies">En savoir plus</a></p>' +
      '<div class="cookies-boutons">' +
      '<button type="button" data-choix="non">Refuser</button>' +
      '<button type="button" data-choix="oui">Accepter</button>' +
      '</div>';
    banniere.addEventListener('click', function (e) {
      var b = e.target.closest('[data-choix]');
      if (b) decider(b.getAttribute('data-choix'));
    });
    document.body.appendChild(banniere);
  }

  // Lien « Gérer les cookies » dans le pied de page et dans les mentions légales
  function ajouterLienGestion() {
    var cible = document.querySelector('.pied-bas span:last-child') || document.querySelector('footer div');
    if (cible) {
      cible.appendChild(document.createTextNode(' · '));
      var b = document.createElement('button');
      b.type = 'button';
      b.className = 'lien-cookies';
      b.textContent = 'Gérer les cookies';
      b.addEventListener('click', afficherBanniere);
      cible.appendChild(b);
    }
    var bloc = document.getElementById('gerer-cookies');
    if (bloc) { bloc.hidden = false; bloc.querySelector('button').addEventListener('click', afficherBanniere); }
  }

  // Clic sur un numéro de téléphone ou sur « Réserver un appel » (Calendly) = conversion « appel »
  document.addEventListener('click', function (e) {
    var lien = e.target.closest && e.target.closest('a[href^="tel:"], a[href*="calendly.com"]');
    if (lien) window.acConversion('appel');
  });

  function demarrer() {
    ajouterStyle();
    ajouterLienGestion();
    var choix = lireChoix();
    if (choix === 'oui') chargerGoogle();
    else if (choix === null) afficherBanniere();
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', demarrer);
  else demarrer();
})();
