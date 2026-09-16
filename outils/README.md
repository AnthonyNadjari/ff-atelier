# outils/brief-client.html

Formulaire que l'atelier envoie à un client potentiel pour qu'il remplisse lui-même son brief
en 10 minutes, sans appel préalable obligatoire. Le résultat est le même document que
`docs/BRIEF.md`, rempli, prêt à devenir `sites/<slug>/brief.md`.

Page HTML autonome (CSS + JS inline, aucune dépendance sauf la police Fraunces chargée depuis
Google Fonts avec repli système). Elle fonctionne aussi bien ouverte en local que hébergée.

## Avant le premier envoi : configurer la clé et l'e-mail

Deux attributs sur la balise `<form>` (en haut du fichier, cherchez `id="brief-form"`) :

```html
<form id="brief-form" data-key="A-REMPLACER" data-to="contact@finckfisch.fr" novalidate>
```

- `data-key` — remplacer `A-REMPLACER` par la clé de compte [Web3Forms](https://web3forms.com/)
  du studio (gratuit, 250 envois/mois). C'est cette clé qui permet au bouton « Envoyer mon brief »
  de transmettre le brief par e-mail sans backend.
- `data-to` — adresse e-mail qui reçoit le brief via le bouton de secours « Ouvrir dans ma
  messagerie » (mailto). Mettre à jour si l'adresse de contact change.

Sans clé Web3Forms valide, le bouton principal échoue proprement (message d'erreur affiché) et
renvoie vers les deux solutions de secours — rien n'est perdu.

## Comment l'envoyer à un client

Deux façons, au choix :

1. **Héberger la page** à `finckfisch.fr/brief` (ou toute autre URL du site studio) et envoyer le
   lien au client.
2. **Envoyer le fichier** `outils/brief-client.html` directement en pièce jointe — il s'ouvre dans
   n'importe quel navigateur sans serveur, tout est inline.

Le client remplit à son rythme : chaque champ est sauvegardé automatiquement dans son navigateur
(`localStorage`), il peut fermer l'onglet et reprendre plus tard. Le bouton « Effacer » vide tout.

## Ce que reçoit l'atelier

Au clic sur « Envoyer mon brief », la page construit un texte Markdown dans la structure exacte de
`docs/BRIEF.md` (mêmes titres, dans le même ordre) et l'envoie par e-mail via Web3Forms — champ
`brief` du message. Si l'envoi automatique échoue (clé absente, réseau, etc.), deux solutions de
secours sont toujours proposées sous le bouton :

- **Copier le brief** — copie le Markdown dans le presse-papiers, à coller où l'on veut.
- **Ouvrir dans ma messagerie** — ouvre un e-mail pré-rempli (`mailto:`) vers `data-to`, avec le
  Markdown en corps de message.

Un champ piège (honeypot) invisible filtre une partie du spam automatisé.

## Flux complet, de la réponse du client au site en ligne

1. Le client remplit le formulaire → un e-mail arrive au studio avec le Markdown du brief.
2. Coller ce Markdown tel quel dans `sites/<slug>/brief.md` (créer le dossier avec
   `node scripts/ff.mjs nouveau <slug>` si le site n'existe pas encore).
3. Lancer `/nouveau-site <slug>` dans Claude Code (lit `brief.md`, choisit direction et variantes,
   rédige les textes, écrit `site.config.ts`) — ou, sans Claude Code,
   `node scripts/ff-generer.mjs <slug>` pour le même résultat en automatisation pure.
4. Suite normale : `node scripts/ff.mjs build <slug>`, `verifier`, puis déploiement
   (voir `docs/DEPLOIEMENT.md`).

La section finale du Markdown généré, « Choix atelier — rempli par nous, pas par le client »,
n'est jamais posée au client : elle reste vide dans l'e-mail reçu, à compléter par la personne (ou
la compétence `nouveau-site`) qui prépare le site, exactement comme dans `docs/BRIEF.md`.

## Vérifier le formulaire après une modification

Le fichier est un simple HTML/CSS/JS, sans build. Pour vérifier qu'une modification n'a rien cassé,
un script Node ponctuel (non versionné) peut :

- vérifier qu'aucun `id` n'est dupliqué dans le HTML statique ;
- vérifier que chaque `<label for="...">` pointe vers un `id` qui existe ;
- extraire la fonction `buildMarkdown()` du `<script>` inline (elle est exposée via
  `module.exports` quand elle tourne hors navigateur) et comparer les titres `##`/`###` qu'elle
  génère à ceux de `docs/BRIEF.md`.

Aucune de ces vérifications ne nécessite d'ouvrir un navigateur.
