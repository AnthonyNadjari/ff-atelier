# Agronomy Workshop — https://agronomywork.shop/
Titre « Agronomy Workshop », `lang="en"`, description « Design led, functional golf apparel. Focusing on making life-long products for a life-long sport. », technologie lue : generator « Framer 2b87f15 », Framer. Démontage automatique du 2026-10-31 (`ff demonter`, mesures brutes dans `etabli.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (17 image(s) dans l'écran) ; bouton principal « Shop » à mi-hauteur à gauche (178, 378 px, dans une barre fixe) ; 112 mots visibles au-dessus du pli ; bannière cookies 45 % de l'écran, non bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (13 image(s) dans l'écran) ; bouton principal « Shop » en bas au centre (10, 753 px, dans une barre fixe) ; 73 mots visibles au-dessus du pli ; couche bloquante à l'arrivée : bannière cookies couvrant 56 % de l'écran (« For the long game. Sign up for 10% off your first order ©AG… ») ; rien ne bouge tout seul.
Nav : non mesuré.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `div.framer-hnhb8e` (0,5 écran, 0 mots, 0 img). Calques hors flux (fixes/absolus) : `iframe.CybotCookiebotOffscreenIframe` (absolute, 4 px), `div.framer-10d5l4z-container` (fixed, 66 px, 4 mots), `div.framer-s053hw-container` (fixed, 406 px, collé en bas, 22 mots).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : 2 (2 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/etabli-d.webp` (mesuré : fond du premier écran #ffffff, 17 image(s) et 112 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Gerstner Programm FSL Regular**, 14 px / 14 px téléphone, graisse 400, interlignage 1,14 ; boutons **Gerstner Programm FSL Regular**, 14 px / 14 px téléphone, graisse 400, interlignage 1,14, interlettrage -0.28px ; nav : non mesuré.
Sources `@font-face` : tiers (framerusercontent.com) (Gerstner Programm FSL Regular, ABC Marfa Mono Unlicensed Trial Regular, OT Neue Montreal Medium Semi Squeezed, Inter) ; tiers (app.framerstatic.com) (Inter) ; locale (Gerstner Programm FSL Regular Placeholder, ABC Marfa Mono Unlicensed Trial Regular Placeholder, OT Neue Montreal Medium Semi Squeezed Placeholder, Inter Placeholder) ; fichiers chargés : https://framerusercontent.com/assets/fKfqWajF9S1z70RlkvDde8SzSIM.woff2, https://framerusercontent.com/assets/SfGAoWgf3StVYiUD9uqQ7l0DT2Y.woff2, https://framerusercontent.com/assets/fr4wuZVTTdlT6FcE5ZN0SnENYQ.woff2. Familles en usage sur le texte visible : Gerstner Programm FSL Regular ×56, ABC Marfa Mono Unlicensed Trial Regular ×7, OT Neue Montreal Medium Semi Squeezed ×6, Gerstner Programm FSL ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff, texte #000000 (contraste 21,00:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (96 %), #eeede8 (3 %), #f4eb59 (1 %), #0076ff (0 %), #212220 (0 %) ; textes par nombre de caractères : #888888 (40 %), #666666 (29 %), #1e1e1e (18 %), #212220 (11 %), #eeede8 (1 %). Images : 36 `<img>` visibles, 0 fond(s) en image, 1 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : Lottie (window.lottie), Framer Motion (window.__framer_importFromPackage). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : aucune. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 7 bloc(s) de plus d'un écran (`div.framer-io2jtn` 2,5 écrans, `div.framer-1301yew` 2,5 écrans, `div.framer-q01k36` 2,5 écrans). Attributs de mouvement : `data-hide-scrollbars` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/etabli-planche.jpg`.

## Construction

Relevé sur les captures (regardées le 31 oct 2026 avec l'outil Read : `captures/etabli-planche.jpg`, `etabli-d.webp`,
`etabli-m.webp`, cinq vues à la molette à 1 440 px et une bande de huit écrans au téléphone) et sur le DOM calculé (sept
blocs `position: sticky; top: 86px`). Fond blanc pur, une grotesque nette (Gerstner Programm) en 14 px partout, gris pour le
texte courant, noir pour les noms ; aucune ombre, aucun rayon, sauf le petit cadre du prix. La page entière est posée sur
**trois tiers égaux** (453 px à 1 440 px) séparés et bordés par une gouttière de 20 px. Accueil, dans l'ordre :

1. **Barre** (66 px, blanche, filet d'un pixel dessous, fixe) : « Index » souligné, « Shop », « Newsletter » à gauche en
   14 px, le logo griffonné au centre, « Bag » à droite. Au téléphone : « Index Shop », logo, « Bag ».
2. **Premier écran = la fiche du premier produit**, sans titre : tiers 1, la fiche (une colonne de vignettes carrées de
   138 px sur fond de pierre #eeede8, les deux coloris ; à côté le nom en noir 14 px, le **prix dans un cadre** à filet d'un
   pixel, rayon 4 px, en chasse fixe ABC Marfa Mono, deux phrases en gris, les **pastilles de coloris** rondes, et en bas un
   **bouton bleu plein pleine largeur** « Shop » à gauche, flèche à droite) ; tiers 2, **l'objet en grand** détouré sur le
   blanc (le t-shirt à plat) ; tiers 3, une photo de matière en carré plein (l'étiquette dans le col). Rien n'est posé sur
   rien. Échelle : tout en 14 px, l'objet fait le titre.
3. **Deuxième rangée** : deux photos portées (la casquette, de dos puis de face sur la montagne) dans les tiers 1 et 2,
   pleine hauteur ; la fiche de la casquette dans le tiers 3, **collée** sous la barre pendant que les photos défilent.
4. **Troisième rangée** : une seule photo portée sur deux tiers (947 px de haut), la fiche à droite, collée tout du long.
   Les fiches changent de côté d'une rangée à l'autre.
5. **« Questions we asked before designing a golf shirt. »** : six colonnes étroites (200 et 220 px) ; le titre en 30 px
   resserré dans la première ; puis une question par colonne (un chiffre, la question en 14 px, une photo verticale, la
   réponse en gris), **chacune posée plus bas que la précédente** (430 px de marche) et **collée** en haut : en descendant,
   les marches arrivent sous la barre l'une après l'autre et se rangent en une rangée ; la rangée part avec le bloc (2,5
   écrans de course).
6. **Autres produits** en rangées comme 3 et 4 (casquette, serviette, sweat), mêmes fiches collées.
7. **Le nom géant** : « agronomy / workshop » en bas de casse, grotesque à chasse étroite (Neue Montreal Semi Squeezed),
   blanc, de bord à bord sur une photo pleine largeur, un mot par ligne.
8. **Pied** : une rangée de vignettes de tous les produits sur fond de pierre, « For the long game », l'inscription à la
   lettre, deux colonnes de liens.

Téléphone : tout s'empile dans le même ordre ; chaque fiche = l'objet en carré, la rangée de vignettes, le nom et le prix
encadré, le texte, les pastilles, le bouton plein ; les questions deviennent une liste à filets. Vide : uniquement la
gouttière et une rangée vide entre deux produits ; aucun vide de respiration autour des titres. Disposition mesurée par
`ff tri` : collant, pile, pile ; linéarité 0,08 (grilles à trois tiers et collages).

## Le geste signature

**La fiche qui tient pendant que l'objet défile** : chaque produit est une rangée de trois tiers, et sa fiche (vignettes,
nom, prix encadré, bouton plein) reste collée sous la barre tant que les photos défilent à côté, puis part avec elles ; elle
change de côté d'une rangée à l'autre. Second geste : **l'escalier des questions**, une colonne par question, chacune une
marche plus bas, toutes collantes : l'escalier se range en une rangée au défilement. Codé :
- `src/sections/Hero/etabli.astro` (premier écran = la fiche de l'objet phare : titre, métier à la ville, note Google, fiche,
  objet en grand sur la pierre, photo d'ambiance ; au téléphone l'objet colle sous la barre et la fiche monte dessus) ;
- `src/components/FicheEtabli.astro` (la fiche : vignettes qui changent la vue en 0,2 s, nom, prix encadré `.etabli-prix`,
  formats en cases, bouton plein pleine largeur Commander ou Appeler et le numéro) ;
- `src/sections/Services/etabli.astro` + `src/components/RangEtabli.astro` (les rangées, fiche collée, côtés alternés ; sans
  section faq dans le layout, l'escalier se pose au milieu de la gamme comme sur la source) ;
- `src/components/EscalierEtabli.astro` / `src/sections/Faq/etabli.astro` (l'escalier ; au téléphone, piste au doigt) ;
- `src/sections/Proof/etabli.astro` (avis en tiers, piste au téléphone), `src/sections/Contact/etabli.astro` (le nom géant
  sur la photo, les vignettes de toutes les pièces, les coordonnées en trois tiers), `src/sections/Nav/etabli.astro`.
Profil de mouvement `fiche-collee-a-l-objet` (MOUVEMENTS.md). Données : `site.produits` (architecture gamme-vitrine : nom,
photo, `detoure`, prix, formats, description, photos) puis `site.services` (src/lib/etabli.ts), aucun champ ajouté.

## Ce qu'on garde / ce qu'on refuse
Garde : les trois tiers sur une gouttière de 20 px ; la fiche d'objet (vignettes sur pierre, nom, prix encadré en chasse
fixe, phrase, cases, bouton plein pleine largeur) ; l'objet en grand ; la fiche collée à côté des photos, de côté alterné ;
l'escalier des questions au milieu de la gamme ; le nom géant en bas de casse sur la photo de fin ; les vignettes de toutes
les pièces avant le pied ; la barre blanche à liens à gauche et nom au centre ; l'aplat de couleur qui porte la page (refait en matière).
Refuse : le panier « Bag » et le bouton « Shop » (l'usine ne vend pas : la porte est « Commander » vers le lien du client, ou
« Appeler » et le numéro ; à la place du panier, le téléphone) ; le bandeau jaune « 10% off » et l'inscription à la lettre
(promotion, pas un style) ; la bannière de cookies plein écran ; la flèche décorative du bouton (GOUT § 8 : le numéro prend
sa place) ; les chiffres 1, 2, 3 des questions (numérotation décorative, GOUT § 2) ; les pastilles rondes de coloris
(l'usine n'a pas de coloris : les formats du client en petites cases à 4 px) ; le gris #888888 (3,5:1) ; un premier écran
sans titre (socle GOUT § 0 : le titre du client, le métier à la ville et la note Google au-dessus de la fiche).
Polices : Gerstner Programm -> Host Grotesk ; ABC Marfa Mono -> Azeret Mono ; OT Neue Montreal Semi Squeezed -> Archivo
Variable à 62 % de chasse (le nom géant). Régime de palette : blanc pur, pierre pâle #eeede8, encre #1e1e1e, action en noyer #5b3a24 (le bleu
électrique de la source est refusé à la reprise), aplat de cuir naturel #d6bf99 : clair neutre.

## Preuve (31 oct 2026)

Site jetable `_test-veille-etabli` (copie de `_exemple`, `// DEMO`, « Coutellerie Bérard, coutelier à Thiers », six pièces en
`produits` et l'affûtage en service ; photos d'illustration Wikimedia Commons, `ff photos-demo` puis choisies à la main : un
laguiole et un stylet détourés sur blanc, le ressort guilloché d'un pliant, un couteau de chef, des couteaux de table, une
pierre à eau, l'atelier), `ff melanger --style etabli` : comparaison [source](captures/etabli-source.jpg) / [essai : source
ordinateur, essai ordinateur, source téléphone, essai téléphone](captures/etabli-essai.jpg).
Tient : les trois tiers, la fiche d'objet (vignettes sur pierre, prix encadré, bouton bleu plein), l'objet en grand, la
fiche collée à côté des photos de côté alterné, l'escalier des questions qui se range au milieu de la gamme, le nom géant
sur la photo de fin et la rangée de vignettes. Écarts : le premier écran porte un titre et le métier à la ville (socle) ;
au téléphone l'objet colle et la fiche monte dessus (la source empile) ; les photos d'illustration n'ont pas la lumière
unie d'une séance produit.
`ff verifier` vert hors données de test du jetable (et la grille « autres produits » des pages `/produits/<slug>`, ratios
des photos de démo) ; a11y sans violation ; `ff ia` sans signe bloquant ; `ff ressemblance` : téléphone 0,59
(prospect-epi-dor-d), ordinateur 0,53, déroulé 0,50 (maison-aurore), disposition 0,59 (maison-aurore), linéarité 0,38
(ordinateur : grille puis collants ; téléphone : collants et pistes) ; navigation lue « annuaire de fiches ».
Réglages payés pendant l'essai : le déroulé « héros, avis, services, questions, contact » sortait à 0,81 contre
forge-delacroix ; il a fallu reprendre l'ordre de la source (questions au milieu de la gamme, avis après elle, la note Google
restant sous le titre) et des liens vers des pages ; une fiche collée de moins de 10 % de l'écran n'est pas vue comme
collante (marche de l'escalier à 70svh, fiche à 40svh au moins).

## Reprise (31 oct 2026, après le juge neuf : « ne tient pas la comparaison », « différent de l'usine »)

Reproches : au téléphone, six fois le même module empilé, page blanche plate ; la barre bleue « Appeler » sous chaque pièce
et un bleu de boutique de mode qui jure avec le bois et l'acier ; l'aplat jaune de la source disparu ; objets petits au
milieu de grands cadres beiges, photos d'ambiance disparates ; « Avant de choisir » éparpillé à l'ordinateur ; avis tout en
bas et coupés au téléphone. Repris :
- **une seule porte forte** : le bouton plein n'existe que dans la fiche du premier écran (`FicheEtabli porte="forte"`) ;
  les autres fiches ont un lien, la fin le numéro en grand en lien ; la couleur d'action est un brun de noyer #5b3a24
  (texte blanc à 10:1), tirée du métier ;
- **l'aplat de matière** : les avis sur un cuir naturel #d6bf99 (`--matiere`) de bord à bord, juste sous le premier écran ;
  piste au doigt plus large au téléphone (84 %, 18 px) ;
- **l'objet remplit son cadre** : cadres 3:2 (une pièce couchée), photos recadrées serré sur l'objet ; série cohérente
  choisie à la main sur Wikimedia Commons : dix vues de couteaux de Thiers d'un même photographe, même lumière, même fond
  (Jean-Pol Grandmont, CC BY 4.0), et l'atelier de la Coutellerie de Laguiole d'un même photographe (JoJan, CC BY 3.0) ;
- **la pile cassée au téléphone** : l'objet phare en grand (collé, la fiche monte dessus), deux pièces en cases côte à côte,
  l'escalier en piste, les autres pièces en rang serré à faire glisser ; à l'ordinateur, deux rangées à fiche collée, puis
  un rang serré de trois ;
- **l'escalier lisible** : le titre au-dessus, cinq colonnes larges, marche de 7 rem, question en 17 px, réponse en 15 px.
Essai repris (`_test-veille-etabli`, six couteaux en `produits`, l'affûtage en service) : comparaison
[source](captures/etabli-source.jpg) / [essai](captures/etabli-essai.jpg). `ff verifier` vert hors données de test du
jetable (a11y sans violation, la grille des pages produits n'est plus signalée), `ff ia` sans signe bloquant ;
`ff ressemblance` : téléphone 0,53 (anna-vidal), ordinateur 0,61 (prospect-epi-dor-d), déroulé 0,41 (anna-vidal),
disposition 0,48 (jardins-mael), linéarité 0,44 (ordinateur : décalé, colonnes, collants, grille ; téléphone : collant,
pistes) ; navigation lue « annuaire de fiches ». Verdict du juge : à relancer.
