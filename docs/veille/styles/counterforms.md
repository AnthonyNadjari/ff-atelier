# Counter Forms — https://counter-forms.com/
Titre « Counter Forms », `lang="en"`, description « Counter Forms is a new typographic venture that seeks to champion young, discursive, Antipodean type designers. », technologie lue : Next.js, Sanity, Tailwind. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `counterforms.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (3 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 219 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (1 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 73 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section` (0,3 écran, 22 mots, 0 img). Calques hors flux (fixes/absolus) : `div.Menu` (fixed, 46 px, 6 mots), `div.MenuClock` (fixed, 130 px, 12 mots), `a.group` (fixed, 120 px), `div.CardWrapper` (absolute, 165 px, 45 mots), `div.CardWrapper` (absolute, 283 px, 6 mots), `div.CardWrapper` (absolute, 258 px, 4 mots), `div.CardWrapper` (absolute, 299 px, 5 mots), `div.CardWrapper` (absolute, 414 px, 8 mots), `div.CardWrapper` (absolute, 435 px, 4 mots), `div.CardWrapper` (absolute, 224 px, 8 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/counterforms-d.webp` (mesuré : fond du premier écran #efefef, 3 image(s) et 219 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps : non mesuré ; boutons **Cassette**, 14 px / 15 px téléphone, graisse 400, interlignage 1,35, capitales ; nav : non mesuré.
Sources `@font-face` : auto-hébergée (Cassette, Icons, CounterFormsLoading) ; fichiers chargés : https://counter-forms.com/fonts/Cassette-Light.woff2, https://counter-forms.com/fonts/CounterFormsLoading-Regular.woff2, https://cdn.sanity.io/files/4iqputah/production/403293f5a104dfaeb9df568b1b71289d9784b463.woff2, https://cdn.sanity.io/files/4iqputah/production/ca706dab623ca622ab2c614b1e49021ed3c237c6.woff2, https://cdn.sanity.io/files/4iqputah/production/817e99c1d9c56bf825dc47fd66b37abb7d6c754c.woff2, https://cdn.sanity.io/files/4iqputah/production/13cd6ece9c64da55d376dcff1c01b91039f385c7.woff2. Familles en usage sur le texte visible : Cassette ×71, Eyja Regular ×1, Eyja Regular Italic ×1, Hexa Regular ×1, Pantasia Regular ×1, Telas Regular ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #efefef), texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (65 %), #efefef (34 %), #000000 (1 %), #ff6500 (1 %) ; textes par nombre de caractères : #000000 (87 %), #ffffff (13 %). Images : 8 `<img>` visibles, 0 fond(s) en image, 3 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.2s cubic-bezier(0.4, 0, 0.2, 1)` ×7, `all 0.1s ease` ×4. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/counterforms-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section` (0,3 écran, 22 mots, 0 image(s)).
2. L'élément le plus animé : `line.hand` (1 transition(s) : all 0.1s ease).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : rien de mesurable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/1 ordinateur, 0/1 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.
