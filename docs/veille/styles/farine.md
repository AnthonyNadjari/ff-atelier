# Impasto — https://www.impastofornoantico.com/
Titre « Handcrafted Bread with Soul - Impasto », `lang="en"`, description « Discover Impasto’s soulful, handcrafted bread - Rye, Focaccia, Sourdough. Experience the rhythm of baking with care. Order or contact us today! », technologie lue : Webflow, jQuery. Démontage automatique du 2026-10-30 (`ff demonter`, mesures brutes dans `farine.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; fond en image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 2 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`div.loading-words`).
Téléphone (390x844) : h1 absent ; fond en image plein écran (100 % de l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 2 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`div.loading-words`).
Nav : 0 lien(s) — aucun ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.hero` « FOCACCIA » (1,9 écran, 3 mots, 1 img) → `section.impasto-way` « From baking bread to breaking bread. » (1,7 écran, 172 mots, 1 img) → `section.gallery` « SHAPED BY HAND AND FULL OF FEELING » (3,8 écrans, 48 mots, 6 img) → `section.big-bread-banner` « WHERE CRAFTSMANSHIP » (1,5 écran, 8 mots, 1 img) → `div.scroller` (0,6 écran, 36 mots, 0 img) → `section` « MADE DAILY. MADE WITH MEANING. » (1,2 écran, 45 mots, 1 img) → `div` « Unravel the song of bread » (1,9 écran, 57 mots, 0 img).
Pied de page : 2 lien(s) — View Products, Contact. Téléphone cliquable : oui (1, tel:(03)93311111). Formulaire : 1 (2 champ(s) dans le premier). Horaires : oui (5 jours nommés, 8 heures, ex. « Monday - Thursday 6:30am-4:30pm Friday 6:30am-5:00pm Saturda »). Portes d'action : « Facebook » (https://www.facebook.com/impastoforno/).
En 3 secondes : à juger sur `captures/farine-d.webp` (mesuré : fond du premier écran #312426, 1 image(s) et 2 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **aaux-next**, 168 px / 51 px téléphone, graisse 400, interlignage 1,00, interlettrage -5.03999px ; corps **ff-scala**, 19 px / 19 px téléphone, graisse 400, interlignage 1,20 ; boutons **ff-scala**, 19 px, graisse 400, interlignage 1,50 ; nav : non mesuré.
Sources `@font-face` : inline (data:) (webflow-icons) ; Adobe Fonts (aaux-next, ff-scala, ff-scala-condensed) ; fichiers chargés : https://use.typekit.net/gvw6vxl.js, https://use.typekit.net/af/18584c/00000000000000007735a344/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3, https://use.typekit.net/af/4a5801/00000000000000007735a33f/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n5&v=3, https://use.typekit.net/af/237582/0000000000000000774ff1ef/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n4&v=3, https://use.typekit.net/af/b5069a/00000000000000007735a335/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=n7&v=3, https://use.typekit.net/af/d548c5/00000000000000007735a346/31/l?primer=7cdcb44be4a7db8877ffa5c0007b8dd865b3bbc383831fe2ea177f62257a9191&fvd=i4&v=3. Familles en usage sur le texte visible : aaux-next ×60, ff-scala ×48. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #efefe7 (premier écran #312426), texte #312426 (contraste 12,88:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #efefe7 (81 %), #312426 (19 %), #d9cec3 (0 %) ; textes par nombre de caractères : #efefe7 (63 %), #312426 (36 %), #cedbd9 (1 %), #d9cec3 (0 %). Images : 9 `<img>` visibles, 2 fond(s) en image, 1 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Lenis (window.Lenis), Barba (window.barba), jQuery (window.jQuery), Webflow (window.Webflow). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `transform 0.7s cubic-bezier(0.5, 0.5, 0, 1)` ×3, `all 0.7s cubic-bezier(0.5, 0.5, 0, 1)` ×1, `background-color 0.375s cubic-bezier(0.625, 0.05, 0, 1)` ×1, `height 0.375s cubic-bezier(0.625, 0.05, 0, 1)` ×1, `width 0.375s cubic-bezier(0.625, 0.05, 0, 1)` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`footer.footer_component` 1,5 écran). Attributs de mouvement : `data-split` ×21, `data-marquee-collection-target` ×6, `data-marquee-duplicate` ×2, `data-marquee-scroll-direction-target` ×2, `data-marquee-direction` ×2, `data-marquee-status` ×2, `data-marquee-speed` ×2, `data-marquee-scroll-speed` ×2, `data-marquee-scroll-target` ×2. Ce qui bouge réellement à l'écran : à juger sur `captures/farine-planche.jpg`.

## Construction

Relevé sur les captures pleine page (1 440 et 390 px, regardées le 30 oct 2026 avec l'outil Read, après défilement lent pour
charger les images ; plus le premier écran à 5, 6,5, 8 et 10 s) et sur le DOM calculé. Fond crème #efefe7, un seul brun
#312426 en bandes et en texte ; titres en grotesque étroite légère (Aaux Next 400), en capitales ; texte en serif (FF Scala) ;
aucun rayon, aucune ombre, aucune carte ; pleine largeur, gouttière de 48 px. Accueil, dans l'ordre :

1. **Barre** : le monogramme dessiné à gauche, « Menu » et deux traits à droite, rien d'autre (les pages : About, Products,
   Wholesale, Stockists… dans le menu).
2. **Premier écran, les noms autour de la photo** (un écran, crème) : « FOCACCIA / CIABATTA / SOURDOUGH » en capitales de
   168 px (41 px au téléphone), centrés sur trois lignes à interlignage 1 ; au centre, posée par-dessus, une vidéo en noir et
   blanc de 40 % de la largeur, 16:9 (des mains qui fleurent la pâte) ; là où les lettres passent sur la vidéo elles deviennent
   claires. À l'arrivée, la vidéo paraît seule, puis les lignes montent. Aucun bouton, aucun numéro.
3. **La bande brune** (1,1 écran) : grande photo de focaccia (colonnes 5 à 12, 7:5), puis à gauche la phrase « From baking bread
   to breaking bread. » (32 px, casse normale) et, dans la colonne d'à côté, cinq paragraphes de l'histoire en serif crème,
   « More about us ».
4. **Titre centré et quinconce** : « SHAPED BY HAND AND FULL OF FEELING » centré (64 px, trois lignes), un paragraphe centré,
   « View Products » ; puis six photos de travail en rangées de deux calées en haut, une horizontale et une verticale, l'ordre
   qui s'inverse d'une rangée à l'autre (au téléphone : une colonne de verticales pleine largeur).
5. **La phrase éclatée** : une photo pleine largeur d'un écran (un boulanger dans la farine), la phrase « WHERE
   CRAFTSMANSHIP / MEETS THE SERENE ART OF / BAKING » en capitales de 80 px coupée en trois, en haut à gauche, au milieu à
   droite et en bas à gauche.
6. **La double bande des noms** : les noms des pains en capitales géantes (11vw) sur deux bandes qui défilent en sens
   contraires.
7. **« MADE DAILY. MADE WITH MEANING. »** : titre et paragraphe à gauche, grande photo verticale à droite qui monte plus haut.
8. **Pied brun** : monogramme, inscription à la lettre, pages, adresse, téléphone, e-mail, horaires sur sept jours, puis
   « IMPASTO » en capitales très larges et grasses crème de bord à bord.

Échelles : noms du premier écran 168 / texte 17 px (près de 10) ; titres 64 à 80 px. Le vide est vertical (un écran entier
autour des noms) ; tout s'empile au téléphone dans le même ordre.

## Le geste signature

**Les noms des produits traversés par une photo en noir et blanc** : trois mots géants centrés, une photo au milieu qui les
coupe, les lettres claires sur la photo et sombres sur le crème, la photo qui paraît d'abord et les mots qui montent ensuite.
Codé : `src/sections/Hero/farine.astro` (les mots sont les titres des trois premiers services, taille calculée pour tenir dans
la largeur ; la photo `images.hero` en `grayscale(1)` dans un rectangle 16:9 de 40 % de la largeur ; une seconde copie des mots
en crème découpée au cadre de la photo par `clip-path: inset()` calé en `cqw` sur la même mesure ; montée CSS seule). Avec
lui, dans `src/sections/Services/farine.astro`, la quinconce, la phrase éclatée et la double bande des noms. Profil de
mouvement `mots-sous-la-photo` (MOUVEMENTS.md).

## Ce qu'on garde / ce qu'on refuse
Garde : les noms autour de la photo en noir et blanc, la bande brune à grande photo, le titre centré et la quinconce, la phrase
éclatée sur une photo pleine largeur, la double bande des noms, l'avis à côté d'une grande verticale, le pied brun au nom très
large, l'absence de conteneur, les liens de texte. Mesuré et utile à l'usine : téléphone cliquable et horaires dans le pied.
Refuse : le préchargement plein écran (« Sourdough » sur brun, mesuré comme couche bloquante), la vidéo (une photo du client ;
une vraie vidéo seulement si le client en a une), le menu caché seul (la barre nomme les pages des pains : `servicePage`
`porte`, socle GOUT § 0), le premier écran sans téléphone (la phrase, « métier à ville » et Appeler sous les mots), la
lettre d'information (le formulaire du site à la place).
Polices : Aaux Next (non libre) -> Archivo à chasse variable (wdth 86 %, 330 ; 125 %, 800 pour le nom du pied) ; FF Scala
(non libre) -> Spectral.
Régime de palette : crème #efefe7 (chroma OKLCH 0,009) réchauffé en #f0ede2 (0,015), un seul brun #312426 : clair teinté doux.

## Preuve (30 oct 2026, reprise après le juge neuf)

Site jetable `_essai-farine` (copie de `_exemple`, `// DEMO`, « Fournil Morel, boulangerie à Lyon », trois pains : Levain,
Focaccia, Mie ; photos d'illustration `ff photos-demo` choisies à la main pour rester dans le ton : pâte, miches, four à bois,
aucune photo de paysage ni de viennoiserie colorée), `ff melanger --style farine` : comparaison
[source](captures/farine-source.jpg) / [essai, source à gauche](captures/farine-essai.jpg).
Reprise demandée par le juge neuf (« ne tient pas » : mur de 3 photos disparates, « GÉNÉRA-TIONS » coupé, texte sur un visage,
pied à formulaire) : le mur continue avec les photos de la galerie montrées nulle part ailleurs (six cases), plus de césure
dans la phrase éclatée (`hyphens: none`), la phrase est posée sur une croûte de miche, et le pied brun n'a plus de formulaire
(coordonnées, horaires, Appeler, Écrire, le nom très large, comme la source). Écarts : la barre nomme les pages des pains.
`ff verifier` vert hors données de test (a11y sans violation), `ff ia` sans signe ; `ff ressemblance` : aucun site au-dessus
des seuils (au plus téléphone 0,61 contre prospect-epi-dor-c, déroulé 0,60 contre jardins-mael).
