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
| `envoi-devis.php` | Envoie les demandes du formulaire vers contact@ateliercuisine11.fr (mail mis en forme) |
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

## À faire

- [ ] Ajouter l’assurance RC Pro dans les conditions générales
- [ ] S’inscrire auprès d’un médiateur de la consommation et l’ajouter aux CGV
- [ ] Ajouter un moyen de paiement chez OVH avant octobre 2027
- [ ] Remplacer les images d’illustration par de vraies photos de chantiers
- [ ] Récolter les premiers avis Google
