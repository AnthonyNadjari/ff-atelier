# Caffè Gilli — https://www.caffegilli.com/en
Café historique, pâtisserie, bistrot et bar à cocktails « since 1733 », Florence (Italie), via Roma 1/r (pied de page). Awwwards Honorable Mention du 4 août 2026 (awwwards.com/sites/caffe-gilli). « Site by The Branding Crew » (pied de page, lu dans le HTML). CMS maison (`/inc/js/functions.10.js`), GSAP + ScrollTrigger, Splide.

## Squelette
En-tête fixe, blanc : burger + bouton « Shop » à gauche, logo ovale centré, langue / compte / panier à droite (112 px ordinateur, 66 px téléphone). Ordre : grande photo de la salle (boiseries, lustres, tables de marbre) dans un cadre à marges → H1 en bande (« In the heart of the city, with the city in our heart since 1733. ») → cinq **chapitres épinglés** (`pin-spacer` ×5, 2 250 à 5 220 px chacun) : « An ode to sweetness » (pâtisseries), « Aroma of tradition » (chocolat), « From Florence, with love » (boutique en ligne), « Bistrot » / « Cocktail bar » (piste horizontale), « A Florentine institution » (photos d'archives en noir et blanc de la place) → pied bleu nuit : adresse, tel:+39055213896, mailto, distinctions (50 Best Discovery, Top 500 Bars, Bar d'Italia).
En 3 secondes : la salle vide, éclairée, aucun texte.

## Typographie
Lues dans le CSS : titres **Cosen** Regular et Italic (auto-hébergées `/inc/font/Cosen Regular.woff2`), capitales larges et fines, H1 54,4 px ordinateur / 36,3 px téléphone, interlignage 1. Corps **greycliff-cf** (Adobe Fonts, kit `hip2bxo`), 16 px. Tailles en `clamp(var(--titlesize), 12vw, var(--titlesize) * 2)`. Rare : un display très large et très maigre en capitales, à interlignage 1, qui évoque une enseigne gravée.

## Couleur et matière
Fond `#FCFCFC` puis crème (lu sur la capture, hex non lu) ; texte bleu nuit `#142342` (`rgb(20,35,66)`), qui est aussi le pied de page ; bleu gris pâle sur le chapitre boutique (non lu en hex). Photos réelles et soignées : salle, pâtisseries sur fond blanc, cocktails en lumière rasante, **photos d'archives N&B** de la place pour l'histoire. Aucune texture.

## Mouvement
GSAP + ScrollTrigger (script maison lu) : chapitres épinglés `start: "center center"`, `end: "+=" + 2 * hauteur de fenêtre`, `scrub: true` ; piste horizontale épinglée sur `scrollWidth - clientWidth`, `scrub: .5` ; apparitions `start: "top bottom-=200"`, `scrub: .5` ; parallax `scrub: .75` et `scrub: 1`. Courbes CSS lues : `cubic-bezier(.445,.05,.55,.95)` ×8 et `cubic-bezier(.16,1,.3,1)` ×8 (expo-out), `--anitime .3s/.6s`. Le titre de chapitre passe de gris pâle à bleu nuit en entrant (planche).

## Le geste signature
L'histoire racontée par une photo d'archive noir et blanc de la place, à côté des photos couleur d'aujourd'hui. Chez nous : `About/timeline` ou bloc sur mesure avec une photo d'archive du client (fournie, créditée dans `CREDITS.md`) et `data-duotone` pour unifier ; défilement normal, sans pin.

## Ce qu'on garde / ce qu'on refuse
Garde : la photo du lieu vide comme premier écran, encadrée de marges ; une rubrique par activité (pâtisserie, chocolat, bistrot, bar) avec une seule photo forte chacune ; la photo d'archive ; les distinctions en logos dans le pied, pas en badges.
Refuse : cinq sections épinglées à la suite, jusqu'à 5 220 px de défilement pour un chapitre (GOUT § 4 : pas de défilement bloqué qui surprend) ; aucun texte au premier écran sur téléphone ; titres gris pâle peu lisibles avant activation.
