<?php
// Envoi des demandes de devis du site L'Atelier Cuisine vers la boîte mail pro (e-mail mis en forme).
$destinataire = 'contact@ateliercuisine11.fr';
$expediteur   = 'contact@ateliercuisine11.fr'; // doit être une adresse du domaine pour qu'OVH accepte l'envoi

date_default_timezone_set('Europe/Paris');
header('Content-Type: application/json; charset=utf-8');

function repondre($ok, $message, $code = 200) {
    http_response_code($code);
    echo json_encode(array('ok' => $ok, 'message' => $message));
    exit;
}

if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
    repondre(false, 'Méthode non autorisée.', 405);
}

// Protection anti-robots : champ caché qui doit rester vide, et délai minimum de remplissage
if (!empty($_POST['site_web'])) {
    repondre(true, 'Merci, votre demande a bien été envoyée.');
}
$debut = isset($_POST['debut']) ? (int) $_POST['debut'] : 0;
if ($debut > 0 && (time() - $debut) < 3) {
    repondre(true, 'Merci, votre demande a bien été envoyée.');
}

function champ($nom, $max = 200) {
    $v = isset($_POST[$nom]) ? trim((string) $_POST[$nom]) : '';
    $v = str_replace(array("\r", "\0"), '', $v);
    return mb_substr($v, 0, $max, 'UTF-8');
}
function ligne($v) { // une seule ligne, sans retour à la ligne (évite l'injection d'en-têtes)
    return trim(preg_replace('/[\n\t]+/', ' ', $v));
}
function h($v) { return htmlspecialchars($v, ENT_QUOTES, 'UTF-8'); }

$nom     = ligne(champ('nom', 100));
$tel     = ligne(champ('tel', 30));
$email   = ligne(champ('email', 150));
$ville   = ligne(champ('ville', 100));
$projet  = ligne(champ('projet', 100));
$message = champ('message', 3000);

if ($nom === '' || $tel === '') {
    repondre(false, 'Indiquez votre nom et votre téléphone pour que nous puissions vous rappeler.', 422);
}
if (!preg_match('/^[0-9 +().\-]{6,30}$/', $tel)) {
    repondre(false, 'Le numéro de téléphone ne semble pas valide.', 422);
}
if ($email !== '' && !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    repondre(false, 'L’adresse e-mail ne semble pas valide.', 422);
}
if ($projet === '') { $projet = 'Demande de devis'; }

// Liens pratiques : appel, WhatsApp, réponse par e-mail
$tel_chiffres = preg_replace('/[^0-9+]/', '', $tel);
$tel_wa = preg_replace('/[^0-9]/', '', $tel);
if (strpos($tel_wa, '0') === 0 && strlen($tel_wa) === 10) { $tel_wa = '33' . substr($tel_wa, 1); }
$sujet_reponse = rawurlencode('Votre demande de devis – L’Atelier Cuisine');
$date = date('d/m/Y à H:i');

$sujet = 'Nouvelle demande : ' . $projet . ' – ' . $nom . ($ville !== '' ? ' (' . $ville . ')' : '');

// ---------- Version texte (secours) ----------
$texte = "NOUVELLE DEMANDE DE DEVIS – ateliercuisine11.fr\n\n"
       . "Projet : $projet\n"
       . "Nom : $nom\n"
       . "Téléphone : $tel\n"
       . "E-mail : " . ($email !== '' ? $email : '(non renseigné)') . "\n"
       . "Ville : " . ($ville !== '' ? $ville : '(non renseignée)') . "\n\n"
       . "Message :\n" . ($message !== '' ? $message : '(pas de message)') . "\n\n"
       . "Reçue le $date\n";

// ---------- Version mise en forme (HTML) ----------
function rangee($libelle, $valeur) {
    return '<tr><td style="padding:10px 0;border-bottom:1px solid #E6EDF4;color:#5B6B7C;font-size:14px;width:110px;vertical-align:top">' . $libelle . '</td>'
         . '<td style="padding:10px 0;border-bottom:1px solid #E6EDF4;color:#1A2533;font-size:16px;font-weight:bold;vertical-align:top">' . $valeur . '</td></tr>';
}
function bouton($lien, $texte, $fond) {
    return '<td style="padding:4px"><a href="' . $lien . '" style="display:inline-block;background:' . $fond . ';color:#FFFFFF;text-decoration:none;font-weight:bold;font-size:15px;padding:12px 16px;border-radius:8px;white-space:nowrap">' . $texte . '</a></td>';
}

$lignes  = rangee('Nom', h($nom));
$lignes .= rangee('Téléphone', '<a href="tel:' . h($tel_chiffres) . '" style="color:#1E4B7A;text-decoration:none">' . h($tel) . '</a>');
$lignes .= rangee('E-mail', $email !== '' ? '<a href="mailto:' . h($email) . '" style="color:#1E4B7A;text-decoration:none">' . h($email) . '</a>' : '<span style="color:#8A97A6;font-weight:normal">non renseigné</span>');
$lignes .= rangee('Ville', $ville !== '' ? h($ville) : '<span style="color:#8A97A6;font-weight:normal">non renseignée</span>');

$boutons = bouton('tel:' . h($tel_chiffres), '📞 Appeler', '#1E4B7A');
if (strlen($tel_wa) >= 10) { $boutons .= bouton('https://wa.me/' . h($tel_wa), '💬 WhatsApp', '#1F8F4E'); }
if ($email !== '') { $boutons .= bouton('mailto:' . h($email) . '?subject=' . $sujet_reponse, '✉️ Répondre', '#E07A3E'); }

$msg_html = $message !== '' ? nl2br(h($message)) : '<span style="color:#8A97A6">Pas de message.</span>';

$html = '<!doctype html><html lang="fr"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"></head>'
. '<body style="margin:0;padding:0;background:#EEF3F8;font-family:Arial,Helvetica,sans-serif">'
. '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF3F8;padding:24px 12px"><tr><td align="center">'
. '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#FFFFFF;border-radius:12px;overflow:hidden">'
// En-tête
. '<tr><td style="background:#1E4B7A;padding:22px 26px">'
. '<div style="color:#F2B48C;font-size:12px;letter-spacing:3px;text-transform:uppercase">L’Atelier Cuisine</div>'
. '<div style="color:#FFFFFF;font-size:22px;font-weight:bold;margin-top:6px">Nouvelle demande de devis</div>'
. '</td></tr>'
. '<tr><td style="height:5px;background:#E07A3E;font-size:0;line-height:0">&nbsp;</td></tr>'
// Projet
. '<tr><td style="padding:22px 26px 6px">'
. '<div style="display:inline-block;background:#FCEBDF;color:#B4561F;font-weight:bold;font-size:14px;padding:7px 14px;border-radius:20px">' . h($projet) . '</div>'
. '</td></tr>'
// Coordonnées
. '<tr><td style="padding:6px 26px 4px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0">' . $lignes . '</table></td></tr>'
// Message
. '<tr><td style="padding:18px 26px 6px">'
. '<div style="color:#5B6B7C;font-size:14px;margin-bottom:8px">Message du client</div>'
. '<div style="background:#F4F8FC;border-left:4px solid #1E4B7A;border-radius:6px;padding:14px 16px;color:#1A2533;font-size:15px;line-height:1.5">' . $msg_html . '</div>'
. '</td></tr>'
// Boutons
. '<tr><td style="padding:20px 22px 8px"><table role="presentation" cellpadding="0" cellspacing="0"><tr>' . $boutons . '</tr></table></td></tr>'
. '<tr><td style="padding:6px 26px 22px;color:#5B6B7C;font-size:13px">⏱ À rappeler sous 48 h, comme promis sur le site.</td></tr>'
// Pied
. '<tr><td style="background:#F4F8FC;padding:14px 26px;color:#8A97A6;font-size:12px">Reçue le ' . h($date) . ' depuis le formulaire de ateliercuisine11.fr</td></tr>'
. '</table></td></tr></table></body></html>';

// ---------- Assemblage du message (texte + HTML) ----------
$frontiere = 'ac_' . md5(uniqid('', true));
$entetes  = "From: Site L'Atelier Cuisine <$expediteur>\r\n";
if ($email !== '') { $entetes .= "Reply-To: $email\r\n"; }
$entetes .= "MIME-Version: 1.0\r\n";
$entetes .= "Content-Type: multipart/alternative; boundary=\"$frontiere\"\r\n";

$corps  = "--$frontiere\r\n"
        . "Content-Type: text/plain; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($texte)) . "\r\n"
        . "--$frontiere\r\n"
        . "Content-Type: text/html; charset=UTF-8\r\n"
        . "Content-Transfer-Encoding: base64\r\n\r\n"
        . chunk_split(base64_encode($html)) . "\r\n"
        . "--$frontiere--\r\n";

$sujet_encode = '=?UTF-8?B?' . base64_encode($sujet) . '?=';

if (mail($destinataire, $sujet_encode, $corps, $entetes, '-f' . $expediteur)) {
    repondre(true, 'Merci ! Votre demande a bien été envoyée. Nous vous recontactons sous 48 h.');
} else {
    repondre(false, 'L’envoi n’a pas fonctionné. Appelez-nous au 06 66 18 19 15.', 500);
}
