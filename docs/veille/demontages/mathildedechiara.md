# Mathilde De Chiara — https://www.mathildedechiara.com/
Designer et architecte d'intérieur indépendante (intérieurs résidentiels, retail et tertiaire, mobilier, scénographie), « du Pays basque à Paris » (meta description lue), site en français (`lang="fr"`). Fiche Awwwards datée du 30 septembre 2026 (awwwards.com/sites/mathilde-de-chiara-portfolio), sans prix lu. Site sur mesure : OGL (WebGL, `.ogl-canvas`), Lenis, transitions de page natives (`view-transition` ×4 dans le CSS).

## Squelette
**L'accueil est l'index des projets, sans texte de présentation** : une colonne centrale d'images qui défile (WebGL), à gauche le compteur « 01 / 30 » sur un filet, à droite deux réglages : **« Typologie de projet »** (Toutes typologies / Architecture d'intérieur & résidentiel / Retail & tertiaire / Design de mobilier & scénographie / Photographie & communication) et **« Mode d'affichage » : Slider | Grid** ; « À propos » sur le filet de droite. En mode grille sur téléphone, les 30 vignettes sont posées **en losange** (mosaïque tournée de 45°, capture téléphone). Aucun `<h1>`, aucun contact au premier écran (pas de lien tel/mailto relevé sur l'accueil).
En 3 secondes : des images de projets, un compteur, des filtres.

## Typographie
Lues dans le CSS : **PP Editorial New** Ultralight 200, Regular 400, Extrabold 800 et leurs italiques (`/fonts/PPEditorialNew-*.woff2`) pour le compteur et les titres de réglages (en italique : « Typologie de projet », « 01 / 30 ») ; interface en **Helvetica Neue** 10 à 12 px (`clamp(10px,.7vw,12px)`), libellés en capitales espacées. Rare : l'échelle minuscule de toute l'interface, qui laisse 90 % de l'écran aux images.

## Couleur et matière
Fond `#F7F5F2` (`rgb(247,245,242)`), texte `#111` / `#333`, gris `#6E6E6E` (filtres inactifs), blanc. Aucune couleur d'accent : la couleur vient des photos de projets (intérieurs, boutiques, éclairages, façades de verre).

## Mouvement
OGL : la colonne d'images est rendue dans un `<canvas>` (déformation/inertie au défilement, non mesurée : la molette de notre script n'a pas fait avancer le diaporama). CSS lu : `cubic-bezier(.22,.61,.36,1)` ×28 sur `width, height, transform .55s` (passage slider → grille), `@keyframes project-nav-hint-in .5s` retardé de 0,55 s, `cubic-bezier(.87,0,.13,1)` ×4.

## Le geste signature
Le choix « Slider | Grid » et le filtre par typologie, affichés en permanence comme des réglages : le visiteur décide comment parcourir les 30 projets. Chez nous : `Proof/gallery` avec deux `<input type="radio">` (affichage) et une rangée de filtres, tout en CSS (`:has(#grille:checked)` pour basculer la grille, `:has([value=retail]:checked)` pour masquer les autres) ; zéro JS, zéro WebGL.

## Ce qu'on garde / ce qu'on refuse
Garde : le compteur de projets réel (« 01 / 30 ») ; les filtres par type de chantier ; le choix diaporama / grille ; une interface discrète qui laisse la place aux photos.
Refuse : aucun `<h1>` ni phrase qui dise le métier et la ville au premier écran (GOUT § 7, test du hero) ; interface à 10-12 px illisible sur iPhone ; libellés en italique et en capitales espacées (GOUT § 2) ; un diaporama WebGL qui ne réagit pas à la molette dans notre test.
