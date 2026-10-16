# La Table de Joakim — https://latabledejoakim.fr/
Chef à domicile, Nantes (France). Awwwards Honorable Mention du 13 août 2026 (fiche awwwards.com/sites/la-table-de-joakim). Webflow (scripts `cdn.prod.website-files.com`), « Site réalisé par CinqSeptembre & Cété Studio » (pied de page, lu dans le HTML).

## Squelette
Coquille en trois points fixes : « Réserver une prestation » en haut à gauche (lien souligné), logo manuscrit au centre, « Menu » à droite ; nav `position: absolute`, 110 px de haut, pas de barre. Ordre : photo plein écran (mains du chef à la pince au-dessus d'une assiette) avec deux colonnes de texte courtes posées à gauche et à droite → section épinglée en deux chapitres (« Recevoir chez soi n'a jamais été aussi raffiné », puis « Une cuisine d'auteur, ancrée dans le produit ») → « Joakim prend en charge l'intégralité de l'expérience » avec la liste des étapes (élaboration du menu, approvisionnement, dressage, service, remise en ordre) → carrousel d'articles → pied de page crème avec grande signature. Le contact (tel:+33623732920, mailto) n'est que dans le pied de page et le menu plein écran.
En 3 secondes : une photo de geste (la pince, les herbes), le nom en écriture, aucun titre lisible. Le H1 (« Une expérience gastronomique, chez vous. ») est dans le DOM à 316 px du haut mais n'apparaît pas sur notre capture à t + 6 s.

## Typographie
Lues dans le CSS et le DOM rendu : titres en **Instrument Serif** 400, capitales (texte saisi en capitales), 64 px ordinateur / 44,8 px téléphone, interlignage 1,1 (70,4 px). Corps et libellés en **Geist Mono** (Google Fonts, 300 à 700), 14,4 px, tout en capitales, petit. Satoshi déclarée dans le CSS (5 occurrences). Ce qui la rend rare : le contraste serif étroit en capitales / mono minuscule de taille de légende, avec un logo manuscrit (SVG) comme seule note humaine.

## Couleur et matière
Fond crème `rgb(246,244,243)` (#F6F4F3), texte noir #000. Les sections changent de fond : brun `#9B7C6D`, bleu pâle `#D8E1EB`, sauge `#BFC5AF`, rose crème `#EAE2DF` (objet `bgColors` et `bgColor1/2` lus dans le JS inline). Photos réelles du chef, gros plans de mains et d'assiettes, une en noir et blanc (le chef en cuisine) ; petites photos centrées dans les chapitres (≈ 140 px de large sur 1440).

## Mouvement
GSAP 3.12.5 + ScrollTrigger + SplitText (Webflow GSAP 3.15) + Lenis (`duration: 1.2`, easing expo `1.001 - 2^(-10t)`, lu). Courbes GSAP lues : `power2.inOut` ×6, `power2.out` ×6, `power3.out` ×4. Section 2 épinglée sur ordinateur seulement : le titre se découpe en lignes et le fond passe de `rgb(155,124,109)` à `rgb(216,225,235)` en changeant de chapitre (`initAnimations()` : `if (!isDesktop()) { resetStyles(); return; }`). Menu plein écran : le fond change de couleur et une photo apparaît au survol de chaque lien. Swiper pour les articles. Téléphone : rien d'épinglé.

## Le geste signature
Un chapitre épinglé où le titre change ET le fond change de couleur (brun → bleu) avec une petite photo centrée, uniquement sur ordinateur. Chez nous : `data-pin` + `data-pin-step` (deux étapes), la couleur de fond portée par `data-theme` par étape (technique C7 déjà notée) ; sur téléphone, deux blocs empilés sans pin, comme eux.

## Ce qu'on garde / ce qu'on refuse
Garde : le geste du métier en photo plein écran au lieu d'un titre ; la liste des étapes de la prestation (ce que le chef fait du marché à la vaisselle) ; la désactivation volontaire du pin sur téléphone ; « Réserver » en haut à gauche, à la place du logo.
Refuse : Instrument Serif et Geist Mono (polices IA, GOUT § 2) ; le corps en capitales mono à 14 px, illisible sur iPhone (GOUT § 1, lisibilité) ; un H1 invisible au premier écran ; Lenis + deux copies de GSAP chargées.
