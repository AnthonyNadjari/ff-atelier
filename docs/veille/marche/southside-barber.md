# South Side Barber — https://www.southsidebarber.fr/
Titre « Coiffeur Barbier Nice », `lang="fr"`, description « South Side Barber, salon de coiffure et barbier à Nice. Nous sommes un salon de coiffure hommes situé au 14 Rue Cassini, 06300, Nice et au 8 Rue Grimaldi ,0600… », technologie lue : Next.js. Démontage automatique du 2026-10-17 (`ff demonter`, mesures brutes dans `southside-barber.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Académie » en haut au centre (843, 12 px, dans la nav) ; 64 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Open navigation menu » en haut à droite (326, 16 px) ; 50 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 5 lien(s) — Académie, Salons, [Formations], Réservation, Contact ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.block` (0,1 écran, 5 mots, 0 img) → `div.block` (0,7 écran, 50 mots, 0 img) → `div.block` (0,7 écran, 71 mots, 0 img) → `div.bg-stone-50` (0,7 écran, 89 mots, 0 img) → `div.block` (0,7 écran, 137 mots, 0 img) → `div.block` (0,7 écran, 7 mots, 0 img) → `div.block` (0,2 écran, 22 mots, 0 img). Calques hors flux (fixes/absolus) : `div` (fixed, 868 px).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « Réservation » (/booking), « 01 RÉSERVATION SALON » (/booking).
En 3 secondes : à juger sur `captures/southside-barber-d.webp` (mesuré : fond du premier écran #18181b, 2 image(s) et 64 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **__Hanken_Grotesk_9c618b**, 18 px / 16 px téléphone, graisse 300, interlignage 1,56 ; boutons **__Hanken_Grotesk_9c618b**, 14 px / 14 px téléphone, graisse 500, interlignage 1,43 ; nav **__Hanken_Grotesk_9c618b**, 14 px, graisse 500, interlignage 1,43.
Sources `@font-face` : auto-hébergée (__Hanken_Grotesk_9c618b) ; locale (__Hanken_Grotesk_Fallback_9c618b) ; fichiers chargés : https://www.southsidebarber.fr/_next/static/media/313510e2713fb214-s.p.woff2. Familles en usage sur le texte visible : __Hanken_Grotesk_9c618b ×55. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #18181b), texte #09090b (contraste 19,90:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (62 %), #18181b (27 %), #fafaf9 (12 %) ; textes par nombre de caractères : #f4f4f5 (54 %), #09090b (45 %), #ef4444 (1 %). Images : 0 `<img>` visibles, 5 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.3s cubic-bezier(0.4, 0, 0.2, 1)` ×17, `color 0.15s cubic-bezier(0.4, 0, 0.2, 1)` ×6, `color 0.2s cubic-bezier(0.4, 0, 0.2, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/southside-barber-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.block` (0,7 écran, 50 mots, 0 image(s)).
2. L'élément le plus animé : `a.group` (1 transition(s) : color 0.15s cubic-bezier(0.4, 0, 0.2, 1)).
3. Le bloc le plus singulier par sa structure : `div.block` (contient <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : portes d'action nommées (« Réservation », « 01 RÉSERVATION SALON »).
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/2 ordinateur, 0/2 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Verdict marché (veille du 17 oct 2026, tour 2)
Source : recherche « coiffeur barbier Nice ». La recherche simple ne renvoie que des annuaires, plateformes et offres d'emploi (Pages Jaunes, Planity, Fresha, Bottin, France Travail) ; la recherche étendue donne 3 plateformes puis ce site : rang 13 au total, premier indépendant (deux salons et un centre de formation à Nice, pas une franchise nationale). Tirage : métier `$RANDOM` 16119 mod 19 = 7 → coiffeur barbier ; ville 26306 mod 24 = 2 → Nice. Captures `captures/southside-barber-d|m.webp` et planche regardées.

**Un artisan paierait-il 1 200 € pour ça ?** Non : propre (Next.js, noir et blanc), mais il ne vend ni la coupe ni le salon. Pas de h1 dans le DOM, aucun téléphone dans toute la page, pas d'adresse au premier écran, la galerie Instagram affiche « Failed to fetch Instagram feed », et le premier écran parle d'abord de l'académie. Le seul levier : « Réservation salon » en première ligne du menu numéroté, qui mène à une page de prise de rendez-vous.

**Leviers vus** : Photos réelles : ~4 (intérieur des salons, en noir et blanc). Premier écran : nom + « Nice • Academy • Studio », 4 liens numérotés (Réservation salon, Académie, Formation en ligne, Calendrier). Preuves : « Depuis 2015 » en pastille, 3 témoignages signés ; ni note, ni label. Structure : multipage (Académie, Salons, Formations, Réservation, Contact). Appels : Réservation (×2), Académie, Formations ; aucun téléphone cliquable. Vitesse : HTML 46 Ko, premier octet en 0,3 s. Mobile : rien n'empêche la lecture, mais aucun moyen d'appeler.
