# House of Honey — https://www.houseofhoney.com/
Titre « House of Honey | Interior Design Studio », `lang="en"`, description « House of Honey designs soulful, expressive interiors where life is celebrated. A California-based studio creating spaces with warmth, craft and character. », technologie lue : Next.js, Sanity, Tailwind. Démontage automatique du 2026-10-17 (`ff demonter`, mesures brutes dans `house-of-honey.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; image plein écran (85 % de l'écran) ; bouton principal « Studio » en haut à gauche (54, 2 px, dans une barre fixe, dans la nav) ; 18 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; image plein écran (83 % de l'écran) ; bouton principal « Scroll to top » en haut au centre (93, 0 px, dans une barre fixe, dans la nav) ; 7 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 5 lien(s) — [Studio], [Spaces], [The Buzz], [Dear Honey], [Press Room] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.relative` (1,4 écran, 7 mots, 2 img) → `div#about` « HOUSE OF HONEY IS A FEMALE COLLECTIVE O… » (1,0 écran, 39 mots, 0 img) → `div.px-16` « SPACES WITH STORY » (0,7 écran, 10 mots, 0 img) → `div.px-8` « A STUDY IN EXPRESSION » (1,8 écran, 44 mots, 1 img) → `div.px-16` « DEAR HONEY » (0,7 écran, 10 mots, 0 img) → `div.px-8` « THE TRICK IS LAYERS, LOVE » (1,3 écran, 21 mots, 1 img) → `div` « IT WOULD BE A PRIVILEGE TO HEAR FROM YOU » (0,6 écran, 12 mots, 2 img) → `footer.flex` (1,1 écran, 43 mots, 0 img). Calques hors flux (fixes/absolus) : `div.pointer-events-none` (fixed, 900 px), `div.pointer-events-none` (fixed, 40 px).
Pied de page : 11 lien(s) — Studio, Spaces, The Buzz, Dear Honey, Press Room, Get in Touch, @houseofhoney, jobs@houseofhoney.com, (626) 441-2454, (805) 969-7444 (+1). Téléphone cliquable : oui (2, tel:(626) 441-2454). Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/house-of-honey-d.webp` (mesuré : fond du premier écran #0e0e0e, 2 image(s) et 18 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **noeText**, 45 px / 24 px téléphone, graisse 400, interlignage 1,00, capitales, interlettrage -0.897306px ; corps **neueHaasGrotesk**, 20 px / 24 px téléphone, graisse 400, interlignage 1,30 ; boutons **neueHaasGrotesk**, 16 px / 16 px téléphone, graisse 400, interlignage 1,30 ; nav **neueHaasGrotesk**, 16 px / 16 px téléphone, graisse 400, interlignage 1,30.
Sources `@font-face` : auto-hébergée (canora, noeText, neueHaasGrotesk) ; locale (canora Fallback, noeText Fallback, neueHaasGrotesk Fallback) ; fichiers chargés : https://www.houseofhoney.com/_next/static/immutable/media/Canora-s.p.2vyj-uyy9xzvw.woff2, https://www.houseofhoney.com/_next/static/immutable/media/NeueHaasGrotDisp_55Roman-s.p.3fk1--nmz4ztd.woff2, https://www.houseofhoney.com/_next/static/immutable/media/NeueHaasGrotDisp_65Medium-s.p.1u74g70x8gjjy.woff2, https://www.houseofhoney.com/_next/static/immutable/media/NoeText_Regular-s.p.1cd367ar_lisj.woff2. Familles en usage sur le texte visible : neueHaasGrotesk ×47, noeText ×13, canora ×6. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #0e0e0e, texte #edccbe (contraste 12,85:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #0e0e0e (54 %), #331917 (26 %), #edccbe (21 %), #ffffff (0 %), #fc72c4 (0 %) ; textes par nombre de caractères : #edccbe (51 %), #331917 (41 %), #fc72c4 (8 %). Images : 6 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 8 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Lenis (window.lenis). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `all 0.4s cubic-bezier(0.65, 0.05, 0.36, 1)` ×11, `opacity 0.4s cubic-bezier(0.65, 0.05, 0.36, 1)` ×11, `all 0.6s cubic-bezier(0.65, 0.05, 0.36, 1)` ×7, `color 0.4s cubic-bezier(0.65, 0.05, 0.36, 1)` ×4, `transform 0.4s cubic-bezier(0.65, 0.05, 0.36, 1)` ×4, `animation scroll 112.12s linear infinite` ×2, `animation scroll 121.68s linear infinite` ×2, `animation scroll 90.4s linear infinite` ×2, `animation siteIntroOut 1.2s cubic-bezier(0.7, 0, 0.25, 1)` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-split` ×23. Ce qui bouge réellement à l'écran : à juger sur `captures/house-of-honey-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `div.px-8` « A STUDY IN EXPRESSION » (1,8 écran, 44 mots, 1 image(s)).
2. L'élément le plus animé : `div.pointer-events-none` (animation animation siteIntroOut 1.2s cubic-bezier(0.7, 0, 0.25, 1)).
3. Le bloc le plus singulier par sa structure : `div.relative` (contient <svg>).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : aucune ; boutons pilule : 0/7 ordinateur, 0/3 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu pour l'usine : direction `prune` (17 oct 2026)

Décoratrices d'intérieur : rose poudré et prune très sombre en alternance de pleines bandes, serif à fort contraste en capitales, texte en grotesque neutre, rose bonbon en accent rare, photos au carré sans arrondi.

- **Polices** : noeText (titres, capitales) -> Gilda Display ; Neue Haas Grotesk (texte) -> Schibsted Grotesk. Le grand titre manuscrit en italique de la source n'est PAS repris (GOUT § 2, emphase en italique).
- **Couleurs** : #0e0e0e 54 %, #331917 prune 26 %, #edccbe rose poudré 21 % des fonds ; #fc72c4 rose vif 8 % des textes (6,46:1 sur la prune). Tokens : fond `#edccbe`, fond 2 `#e3bcab`, texte `#331917`, secondaire `#5e3a33`, filets `#c99d8c`, accent `#331917` (survol `#5a2c28`), bloc contraste `#331917` / `#edccbe`.
- **Titres** : graisse 400, interlettrage -0.02em, casse `uppercase`.
- **Rayons et ombres** : boutons 0px, cartes 0px, ombre des cartes `none`.
- **Respiration** : `--section-y: clamp(5rem, 12vw, 10rem)`. **Mouvement** : 0.8s en mise en scène, 0.4s au survol, courbe `cubic-bezier(0.65, 0, 0.35, 1)` (relevées dans les transitions de la source).
- **Fichiers** : `src/directions/prune/index.css`, `meta.ts`, modèles `presets/prune-salon.json` et `presets/prune-boudoir.json`.
- **Comparaison** : [`captures/prune-comparaison.jpg`](captures/prune-comparaison.jpg) (source à gauche, `_exemple` habillé à droite).
- **Repris** : le style seulement. **Jamais** : textes, images, logo, code, nom de la source.
