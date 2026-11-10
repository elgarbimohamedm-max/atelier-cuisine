// Menu burger : ouvre / ferme la navigation sur mobile
(function () {
  var entete = document.querySelector('header');
  var bouton = entete && entete.querySelector('.burger');
  var menu = bouton && document.getElementById(bouton.getAttribute('aria-controls'));
  if (!menu) return;
  var mobile = window.matchMedia('(max-width: 860px)');

  function basculer(ouvrir) {
    entete.classList.toggle('menu-ouvert', ouvrir);
    bouton.setAttribute('aria-expanded', ouvrir ? 'true' : 'false');
    bouton.setAttribute('aria-label', ouvrir ? 'Fermer le menu' : 'Ouvrir le menu');
  }
  function ouvert() { return entete.classList.contains('menu-ouvert'); }

  bouton.addEventListener('click', function () { basculer(!ouvert()); });
  // Un lien choisi ferme le menu
  menu.addEventListener('click', function (e) { if (e.target.closest('a')) basculer(false); });
  // Clic en dehors de l'en-tête
  document.addEventListener('click', function (e) { if (ouvert() && !entete.contains(e.target)) basculer(false); });
  // Touche Échap : ferme et rend le focus au bouton
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && ouvert()) { basculer(false); bouton.focus(); }
  });
  // Retour en largeur bureau : on remet à zéro
  var reinit = function (m) { if (!m.matches) basculer(false); };
  if (mobile.addEventListener) mobile.addEventListener('change', reinit); else mobile.addListener(reinit);
})();
