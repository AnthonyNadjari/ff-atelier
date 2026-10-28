# Mansi — http://pastamansi.com/
Titre « Mansi, fresh pasta producer in London », `lang="en"`, description « Italian home made artisan fresh pasta producer based in London », technologie lue : jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `pastamansi.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « Fresh pasta every day » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 15 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 2 élément(s) (`div.pasta`, `div.box`).
Téléphone (390x844) : h1 « Fresh pasta every day » ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 5 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`div.pasta`).
Nav : 5 lien(s) — About, Our pasta, Find us, Shop, hello@pastamansi.com ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.container-fluid` « Time, dedication and craft. Always. » (5,6 écrans, 149 mots, 6 img) → `footer` (0,3 écran, 7 mots, 0 img). Calques hors flux (fixes/absolus) : `div.pastaContainer` (absolute, 6125 px), `nav` (fixed, 231 px, 11 mots), `div.headLiner` (fixed, 216 px, 4 mots).
Pied de page : 0 lien(s) — aucun. Téléphone cliquable : non. Formulaire : 1 (3 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/pastamansi-d.webp` (mesuré : fond du premier écran #f8f2e8, 2 image(s) et 15 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **gt_pressura_monolight**, 76 px / 38 px téléphone, graisse 400, interlignage 1,21 ; h2 **gt_pressura_monolight**, 40 px / 29 px téléphone, graisse 400, interlignage 1,40 ; corps **gt_pressura_monolight**, 20 px / 16 px téléphone, graisse 400, interlignage 1,90 ; boutons **gt_pressura_monoregular**, 14 px / 16 px téléphone, graisse 400, interlignage 2,71, capitales, interlettrage 1.55px ; nav **gt_pressura_monolight**, 18 px, graisse 400, interlignage 2,13.
Sources `@font-face` : auto-hébergée (Pressura Bold, gt_pressura_regular, gt_pressura_monolight, gt_pressura_monoregular, fontello) ; fichiers chargés : https://pastamansi.com/src/fonts/pressura-mono-light/gt-pressura-mono-light-webfont.woff2, https://pastamansi.com/src/fonts/pressura-mono-regular/gt-pressura-mono-regular-webfont.woff2, https://pastamansi.com/src/fonts/pressura-regular/GT-Pressura-Regular.woff. Familles en usage sur le texte visible : gt_pressura_monolight ×18, gt_pressura_regular ×6. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #f8f2e8, texte #252525 (contraste 13,76:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #f8f2e8 (71 %), #dc991a (26 %), #252525 (3 %) ; textes par nombre de caractères : #252525 (97 %), #fbf3e6 (3 %). Images : 6 `<img>` visibles, 7 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.2s cubic-bezier(0.25, 0.46, 0.45, 0.94)` ×21, `all 0.62s cubic-bezier(0.86, 0, 0.07, 1)` ×8, `opacity 0.4s ease` ×4, `animation comeIn 1.4s cubic-bezier(0.23, 1, 0.32, 1)` ×3, `animation pastaRotationClock 103s linear infinite` ×1, `animation pastaRotationAnticlock 102s linear infinite` ×1, `animation pastaRotationAnticlock 88s linear infinite` ×1, `animation pastaRotationAnticlock 87s linear infinite` ×1, `animation pastaRotationAnticlock 110s linear infinite` ×1, `animation pastaRotationClock 115s linear infinite` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/pastamansi-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.container-fluid` « Time, dedication and craft. Always. » (5,6 écrans, 149 mots, 6 image(s)).
2. L'élément le plus animé : `nav` (animation animation comeIn 1.4s cubic-bezier(0.23, 1, 0.32, 1) ; 2 transition(s) : all 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94) ; background 0.2s ease).
3. Le bloc le plus singulier par sa structure : `footer` (seule à contenir <form>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/1 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026)

- **Polices** : une seule chasse fixe, GT Pressura Mono Light pour tout (h1 « Fresh pasta every day » centré, 38 px au téléphone, 76 px à l'ordinateur, interlignage 1,2 ; h2 29 / 40 px ; texte 16,5 / 20 px, interlignage 1,9, casse normale) ; liens d'action en Mono Regular 14 px capitales ; le logo est une condensée grasse entre deux filets épais (« PASTIFICIO / MANSI / EST. 2012 »). Libre : JetBrains Mono (300 en titre, 400 en texte), jamais IBM Plex Mono ni DM Mono (liste IA).
- **Couleurs** : crème de farine #f8f2e8 (fond, chroma 0,015), texte presque noir #252525 (13,8:1), jaune d'œuf #fbcd37 (silhouettes de pâtes), ocre #dc991a (point sous le lien actif, attente des photos), pied en aplat #252525. Régime : clair teinté doux.
- **Espacements** : 64 px entre blocs au téléphone, 96 px à l'ordinateur ; bord du téléphone 32 px ; deux colonnes de 426 px séparées de 147 px ; texte étroit (39 caractères) ; premier écran presque vide autour du titre.
- **Formes** : angles droits partout, aucune carte ni ombre ; aucun bouton dessiné : « BUY OUR PASTA → » en capitales mono sur un filet de 1 px ; menu en gris à 50 %, l'actif noir avec un point ocre.
- **Photos** : grands rectangles du produit et des mains (16:9 en tête, puis 1:1, 4:5, 3:2) en quinconce, le texte de l'autre côté ; quelques-unes sur fond noir (les mains qui tiennent les pâtes) ; marché, tomates, assiettes.
- **Mouvement** : une silhouette de pâte jaune géante par écran, derrière le contenu, qui tourne en 85 à 115 s par tour (une sur deux à l'envers), forme différente à chaque visite ; la première photo monte en fondu 1,4 s après 1,2 s. Profil nouveau : `silhouettes-en-fond`.
- **Architecture** : une longue page (titre, puis blocs photo / texte alternés : savoir-faire, restaurants, marchés, produit, santé), lettre et pied noir ; adresse e-mail dans l'en-tête, pas de téléphone.
- **Geste signature** : les pâtes dessinées en aplat jaune qui tournent lentement dans les marges, sur une page écrite à la machine.
