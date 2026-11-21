# L’Atelier Cuisine – Narbonne

Conception et pose de cuisines, montage de meubles, livraison de A à Z.
Narbonne et alentours · Devis gratuit sous 48 h.

- Site : https://ateliercuisine11.fr
- E-mail : contact@ateliercuisine11.fr
- Téléphone : 06 66 18 19 15
- Avis Google : https://g.page/r/CRzbj9TUjlbLEBM/review

## Contenu du dépôt

| Dossier | Ce qu’il contient |
|---|---|
| `site/` | Le site internet complet, tel qu’il est en ligne (à copier dans le dossier `www` de l’hébergement OVH) |
| `logos/` | Le logo en image : photo de profil, signature e-mail, version complète |
| `cartes-de-visite/` | Les cartes de visite prêtes à imprimer (PDF 85 × 55 mm avec 3 mm de fond perdu) |
| `design/` | Les fichiers sources du canevas de design (logos, t-shirt, cartes) créés avec Claude |
| `documents/` | Les textes marketing (fiche Google, Leboncoin, réseaux sociaux…) et l’aperçu du mail de devis |
| `photos-chantiers/` | Photos de chantiers retouchées et plans 3D |

## Le site (`site/`)

| Fichier | Rôle |
|---|---|
| `index.html` | Page d’accueil (services, tarifs, cuisines, zone d’intervention, FAQ, contact) |
| `mentions-legales.html` | Mentions légales |
| `conditions-generales.html` | Conditions générales de vente |
| `envoi-devis.php` | Envoie les demandes du formulaire vers contact@ateliercuisine11.fr (mail mis en forme, avec jusqu’à 5 photos en pièces jointes) |
| `pose-cuisine-ikea-narbonne.html` | Page « Pose de cuisine IKEA » (montage METOD, plan de travail, conseils, FAQ) |
| `duree-pose-cuisine-ikea.html` | Guide « Combien de temps pour poser une cuisine IKEA ? » |
| `pose-cuisine-montage-meubles-beziers.html`, `…-carcassonne.html`, `…-lezignan-corbieres.html`, `…-sigean.html`, `…-leucate.html` | Pages pour Béziers, Carcassonne, Lézignan-Corbières, Sigean et Leucate |
| `pub.js` | Bannière cookies et suivi Google Ads (voir plus bas) |
| `signature-mail.html` + `signature-logo.png` | Signature e-mail avec logo (à copier dans l’app Mail de l’iPhone) |
| `.htaccess` | Redirige tout vers https://ateliercuisine11.fr |
| `sitemap.xml`, `robots.txt` | Pour Google |
| `favicon.*`, `apple-touch-icon.png`, `og-image.jpg` | Icônes et image de partage |
| `photos/` | Images de la section « Nos cuisines » |

### Mettre à jour le site en ligne

**Automatique (recommandé)** : toute modification du dossier `site/` poussée sur la branche `main` est envoyée sur OVH par la GitHub Action `.github/workflows/deploy-ovh.yml` (seuls les fichiers modifiés sont envoyés). On peut aussi la lancer à la main : onglet **Actions** → **Déploiement OVH** → **Run workflow**.

Réglage unique : dans GitHub, **Settings → Secrets and variables → Actions → New repository secret**, nom `FTP_PASSWORD`, valeur = mot de passe FTP OVH.

**À la main (secours)** :

1. Se connecter en FTP : `ftp://atelivpx@ftp.cluster129.hosting.ovh.net/www/` (Explorateur de fichiers Windows, Ctrl + L).
2. Renommer l’ancien fichier à remplacer (F2), par exemple `index.html` → `ancien.html`.
3. Copier-coller le nouveau fichier dans `www`.
4. Vérifier le site en navigation privée.

⚠️ Ne jamais mettre de mot de passe dans ce dépôt.

## Google Ads (suivi des demandes et bannière cookies)

Le fichier `site/pub.js` gère la bannière cookies et le suivi Google Ads. **Tant que l’identifiant n’est pas rempli, il ne fait rien** : pas de bannière, aucun cookie.

Ce qui est suivi, seulement si le visiteur clique sur « Accepter » :
- une **demande de devis** envoyée avec le formulaire ;
- un **clic sur le numéro de téléphone**.

Pour l’activer, une fois le compte Google Ads créé :

1. Dans Google Ads : **Objectifs → Conversions → Nouvelle action de conversion → Site Web**, entrer `ateliercuisine11.fr`.
2. Créer 2 conversions **« manuellement avec du code »** :
   - « Demande de devis » (catégorie *Envoi de formulaire pour prospects*) ;
   - « Clic sur le téléphone » (catégorie *Contact*).
3. Pour chacune, choisir **« Installer la balise vous-même »**. Google affiche un code qui contient `send_to: 'AW-123456789/AbCdEfGhIj'` :
   - la partie avant le `/` est l’**identifiant** (`AW-…`, le même pour les deux) ;
   - la partie après le `/` est le **libellé** (différent pour chaque conversion).
4. Recopier ces valeurs en haut de `site/pub.js` :
   ```js
   var REGLAGES_PUB = {
     id: 'AW-123456789',
     libelleFormulaire: 'AbCdEfGhIj',
     libelleAppel: 'KlMnOpQrSt'
   };
   ```
   Puis passer `pub.js?v=2` à `pub.js?v=3` dans les pages HTML pour que les navigateurs prennent la nouvelle version.
5. Publier sur `main`, ouvrir le site en navigation privée, cliquer sur « Accepter », puis vérifier dans Google Ads que la balise est « active » (cela peut prendre quelques heures).

Le texte des cookies se trouve dans `mentions-legales.html` (partie « Cookies »).

## À faire

- [ ] Ajouter l’assurance RC Pro dans les conditions générales
- [ ] S’inscrire auprès d’un médiateur de la consommation et l’ajouter aux CGV
- [ ] Ajouter un moyen de paiement chez OVH avant octobre 2027
- [ ] Remplacer les images d’illustration par de vraies photos de chantiers
- [ ] Récolter les premiers avis Google
