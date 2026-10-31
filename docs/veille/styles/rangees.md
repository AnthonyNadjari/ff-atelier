# Office Commun — https://officecommun.com/
Titre « Office Commun », `lang="en"`, description « Office Commun — a design studio for brand, product and motion. », technologie lue : aucune reconnue. Démontage automatique du 2026-10-31 (`ff demonter`, mesures brutes dans `rangees.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (15 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 62 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 absent ; pas de média plein écran (15 image(s) dans l'écran) ; bouton principal : aucun bouton lu dans le premier écran ; 69 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 2 lien(s) — Office Commun, Contact ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `header.bar` (0,0 écran, 3 mots, 0 img) → `section.lede` (0,2 écran, 48 mots, 0 img) → `section#work` (1,6 écran, 29 mots, 73 img).
Pied de page : aucun pied de page lu. Téléphone cliquable : non. Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/rangees-d.webp` (mesuré : fond du premier écran #fcfcfc, 15 image(s) et 62 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 : non mesuré ; corps **Inter**, 15 px / 15 px téléphone, graisse 400, interlignage 1,60, interlettrage 0.075px ; boutons : non mesuré ; nav **Inter**, 15 px / 15 px téléphone, graisse 400, interlignage 1,60, interlettrage 0.075px.
Sources `@font-face` : feuilles d'origine croisée non lisibles (fonts.googleapis.com) ; fichiers chargés : https://fonts.googleapis.com/, https://fonts.googleapis.com/css2?family=Inter:wght@400;500&display=swap. Familles en usage sur le texte visible : Inter ×20. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fcfcfc, texte #000000 (contraste 20,47:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fcfcfc (100 %) ; textes par nombre de caractères : #000000 (100 %). Images : 64 `<img>` visibles, 0 fond(s) en image, 9 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : aucune détectée (window.* et noms de scripts). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.4s ease` ×73, `color 0.2s ease` ×11, `opacity 0.6s cubic-bezier(0.32, 0.72, 0, 1)` ×7, `transform 0.6s cubic-bezier(0.32, 0.72, 0, 1)` ×7, `border-color 0.2s ease` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : aucun. Ce qui bouge réellement à l'écran : à juger sur `captures/rangees-planche.jpg`.

## Construction

Relevé sur les captures (1 440 et 390 px, regardées le 31 oct 2026 avec l'outil Read : `captures/rangees-d.webp`,
`rangees-m.webp`, `rangees-planche.jpg`, huit vues à la molette) et sur le CSS de la source (deux feuilles, lues en entier :
`--m: 16px`, `--gap: 8px`, `--strip-h: clamp(152px, 14vw, 240px)`, `.tile { height: var(--strip-h); aspect-ratio:
var(--ar, 16/9) }`, `.frame--half { aspect-ratio: 8/9 }`). Papier blanc cassé #fcfcfc sur toute la page, encre noire, un
gris à 45 % pour tout ce qui n'est pas un nom, Inter en 15 px partout (400 et 500) ; aucun titre plus grand que le texte,
aucune ombre, aucun angle arrondi, aucun bloc de couleur : la couleur vient des images. Accueil, dans l'ordre :

1. **La barre** (0,03 écran, pas de fond, pas de filet, s'en va avec la page) : « Office Commun » en 15 px à gauche,
   « Contact » à droite (une page à part, avec son formulaire) ; rien d'autre, 16 px du bord.
2. **L'ouverture** (0,2 écran) : 64 px sous la barre, deux paragraphes gris en colonne de 34em (530 px à 1 440, toute la
   largeur moins les bords au téléphone) en haut à gauche ; la première phrase cite les projets du studio en liens à
   l'encre sur un filet clair ; la moitié droite de l'écran reste vide. Elle monte de quelques pixels à l'arrivée (0,6 s
   cubic-bezier(.32, .72, 0, 1), `.rise`). Échelle : texte 15 px = titre.
3. **Les rangées** (128 px plus bas, 1,6 écran à 1 440, la suite de la page) : une par projet, 64 px entre deux (48 au
   téléphone). Chaque rangée : une ligne « Nom · description » (le nom à l'encre, la description en gris, 8 px au-dessus
   des images) ; puis une piste horizontale qui part du bord gauche du texte et va jusqu'au bord droit de l'écran (la
   dernière vignette coupée), sans barre de défilement, main ouverte au survol, qu'on tire à la souris ou au doigt ; les
   vignettes ont toutes la hauteur de la rangée (200 px à 1 440, 144 au téléphone) et deux largeurs qui s'emboîtent : la
   grande en 16:9 (358 px) vaut deux carrées en 8:9 (178 px) plus l'écart de 8 px ; motif propre à chaque projet (Karda :
   grande, carrée, carrée, grande, carrée… ; Premune : grande, carrée, grande, carrée, carrée…) ; un gris très clair
   (#0000000a) derrière chaque image, qui apparaît une fois chargée (0,4 s) ; aucune légende, aucun numéro. Au téléphone,
   une grande et le bord de la suivante : 1,4 vignette par rangée, deux rangées et demie dans le premier écran.
4. **Pas de pied** : la page s'arrête sur la dernière rangée. La page de projet (un clic sur une vignette) reprend la
   colonne de 34em (nom, étiquette, texte gris) puis les images en lignes : une pleine 16:9 ou deux moitiés 8:9. La page
   contact : une phrase grise avec l'e-mail en lien, puis le formulaire à champs d'un seul filet, des cases carrées à filet
   pour « ce dont vous avez besoin », le bouton d'envoi en rectangle noir pleine largeur.

Échelles : tout à 15 px, interligne 24 px ; le vide est en haut à droite (la moitié de l'écran) et entre les rangées
(64 px), jamais dans les rangées (8 px). Disposition (ff tri) : décalé, piste ×5 ; linéarité 0,13 (les rangées sont des
pistes, pas des bandes empilées).

**Transposition pour un artisan** : une rangée par réalisation (« Massif de pivoines » en noir, « Annecy-le-Vieux » en
gris, vers `/realisations/<slug>`), sinon par prestation (vers `/services/<slug>`). Le socle (GOUT § 0) se pose sans casser
la sobriété : un h1 en grand corps (22 à 32 px, jamais géant) au-dessus des deux paragraphes ; le métier à la ville et
« depuis 2008 » dans la phrase grise, les prestations citées en liens dans la phrase (la source y cite ses projets) : ce
sont les pages de service ; le numéro dans la barre, à côté de « Contact » ; « Appeler » et une porte par intention en liens sur filet
dans la phrase, comme « Search » chez la source ; la note Google en lien ; juste après les chantiers, le contact de la
source (la page « Contact », formulaire à filets, adresse et horaires du jour à côté) ; l'atelier (colonne de 34em et sa
rangée de photos) ; les avis en dernière rangée, de cases de texte. Cet ordre (réalisations, contact, atelier, avis) est
celui qui sort de `ff ressemblance` : avec les avis juste sous les chantiers, le déroulé touchait demo-plomberie (0,68). Remplacé par la reprise (voir « Reprise ») : l'accueil est l'index seul, avis et atelier en rangées, contact en tiroir. Rangées plus hautes (clamp(11rem, 16vw, 17rem)) : les photos sont l'argument d'un artisan.

## Le geste signature

**La rangée qu'on tire à la main** : chaque chantier est une ligne de photos à hauteur constante et de largeurs variées
(grande 16:9, carrée 8:9, étroite 5:8, le motif change d'une rangée à l'autre et suit le vrai format de chaque photo : une
photo debout n'est jamais grande), bord à bord, sans légende, sur un gris très clair ; on la fait glisser au doigt (défilement
natif, sans aimant : elle s'arrête où on la lâche), on l'attrape et on la tire à la souris (main ouverte, main fermée, un
clic après un tirage n'ouvre rien), au clavier elle prend le focus ; dessous, **le fil** : un filet d'1 px et un trait
d'encre long comme la part visible de la rangée, qui suit sa position sous le doigt. Les photos de la première rangée apparaissent une fois chargées.
Plusieurs rangées empilées font la page : c'est un index de chantiers, pas une galerie. Codé :
`src/components/RangeeDePhotos.astro` (la piste, les gabarits, le fil), `src/scripts/rangees.ts` (tirage à la souris, fil,
apparition), `src/lib/rangees.ts` (rangées, gabarits, prestations citées, purs), `src/sections/Services/rangees.astro`.
Profil de mouvement `rangee-tiree-a-la-main` (MOUVEMENTS.md). Distinct de `rayon` (des objets dans des cases à légende sur
des étagères, une grande case vedette, titres au feutre) et de `travee` (une seule bande aimantée de photos égales avec
flèches, « 2 sur 7 » et plaques) : ici plusieurs rangées sans légende, de largeurs qui s'emboîtent, tirées à la main.

## Ce qu'on garde / ce qu'on refuse
Garde : la barre nue (nom à gauche, Contact à droite), l'ouverture en deux paragraphes gris dans une colonne de 34em avec
les projets cités en liens, le vide à droite, les rangées « nom, description » et leurs pistes bord à bord à hauteur
constante et largeurs emboîtées, le gris clair derrière les images, le tirage à la souris, l'apparition des images chargées,
la montée de l'ouverture, la page contact (phrase, champs à un filet, envoi en rectangle noir pleine largeur), le papier et
l'encre.
Refuse : Inter (liste IA, GOUT § 2 : Onest), le point médian entre le nom et la description (GOUT § 2 : le gris sépare), le
gris à 45 % (3,4:1 : #6b6b6b), les « chips » de budget en dollars et le choix multiple de services (le formulaire partagé de
l'usine a son menu « votre besoin »), l'absence de pied (pied minimal de l'usine, mentions légales), les vidéos dans les
rangées (pas de vidéo du client : photos seulement), la page sans h1 ni téléphone (socle GOUT § 0).
Polices : Inter -> Onest (OFL, `@fontsource-variable/onest`, ajoutée au registre `src/lib/fonts.ts`), seule famille, 400 et
500.
Régime de palette : clair neutre (#fcfcfc, encre #000, gris #6b6b6b, vignettes #f2f2f2) ; la couleur vient des photos.

## Preuve (31 oct 2026)

Site jetable `_test-veille-rangees` (`// DEMO`, `legal.demo`, « Jardins Morel », paysagiste à Annecy, quatre réalisations et
trois prestations). Photos : `ff photos-demo` (menuiserie) a rapporté une série disparate (cuisines datées, château, atelier
camerounais) : écartée. Choisies à la main sur Wikimedia Commons, deux séries cohérentes, chacune d'un seul photographe le
même jour : les jardins de Hermannshof (Weinheim, Polibil, CC BY-SA 4.0) et les Jardins d'Étretat (Etretatgarden, CC BY-SA
4.0) ; 27 photos, crédits dans `CREDITS.md` du jetable, mention « Photo d'illustration » sur chacune. Modèle appliqué :
`ff modele _test-veille-rangees rangees` (le site entier ; `rangees-menuisier` change de hero et de nav par règle).
Comparaison : [source](captures/rangees-source.jpg) / [essai](captures/rangees-essai.jpg).
`ff verifier` vert hors données de test du jetable (06 00 00 00 00, exemple.fr ; axe sans violation sérieuse, typo, signes
IA) ; `ff ia` sans signe ; `ff ressemblance` : téléphone 0,62 (fromagerie-ravanel-d), ordinateur 0,41, déroulé 0,63
(maison-aurore, barbier-kessler), disposition 0,41 (finck-fisch), linéarité 0,50 (téléphone : pile, piste, pile, piste,
piste). Deux réglages venus de la mesure : rangées plus hautes (part d'image de la page 0,17 -> 0,28) et l'ordre réalisations,
contact, atelier, avis (avec les avis sous les chantiers, déroulé 0,68 contre demo-plomberie).
Reste faible : la page reste en partie empilée au téléphone (linéarité 0,50, sous le seuil mais loin des 0,13 de la source,
qui n'a ni contact ni avis sur l'accueil) ; les avis en fin de page (la note Google est en haut) ; clair neutre, le régime le
plus fourni du registre.

## Reprise (31 oct 2026, après le juge neuf)

Verdict du juge sur la première preuve : « ne tient pas à l'ordinateur », mais différent de l'usine et vendable à un
paysagiste. Cinq reproches, tous repris :
1. **Vignettes floues** : ce n'était pas la photo mais l'aperçu de chargement différé (LQIP) resté peint dans la capture
   pleine page. `src/scripts/rangees.ts` charge d'avance les rangées à moins d'un écran et demi, puis tout l'index dès la
   page chargée, et décode chaque photo (`img.decode()`) ; `sizes` calculé sur la vraie largeur affichée, étirement
   compris. `ff nettete` : aucune alerte.
2. **Rangées jusqu'au bord droit** : plus de marge à droite ; une rangée courte s'élargit jusqu'au bord de la fenêtre,
   chaque vignette en proportion de sa largeur (`flex-grow` = son rapport), à hauteur égale ; une rangée longue file hors
   champ comme la source.
3. **Le contact** : la page contact de la source passe en tiroir (`layout.contactDrawer`), comme la vue « Contact » de la
   source, ouverte par « Contact » et « demander un devis » ; `Contact/rangees` (gardé pour `rangees-menuisier`) met la
   phrase et les coordonnées à gauche, le formulaire à droite sur le reste de la largeur.
4. **Le texte** : `--rg-t` monte de 15 px au téléphone à 17 px à 1 400 et 18 px au-delà (phrase d'ouverture, noms de
   rangée, avis, atelier) ; rangées plus hautes (`--rg-h` clamp(14rem, 18vw, 20rem)).
5. **Les avis** : ils deviennent une rangée de l'index, la troisième, après deux chantiers (`AvisEnRangee`), et l'atelier la
   dernière (`AtelierEnRangee`) ; l'accueil de `presets/rangees.json` est, comme la source, la phrase d'ouverture puis
   l'index, rien d'autre. Ensuite : avis en deuxième rangée, l'index entier se lisait « avis » (titre « Avis » parmi les
   trois premiers, trois citations) et le déroulé touchait maison-aurore à 0,65 ; en troisième, il se lit « réalisations ».
Mesures de la reprise : `ff ressemblance` téléphone 0,62 (fromagerie-ravanel-d), ordinateur 0,40, déroulé 0,61
(maison-aurore ; « héros, réalisations, pied »), disposition 0,33, linéarité 0,30 (téléphone : pile puis six pistes) ;
`ff verifier` vert hors données de test du jetable ; `ff ia` sans signe ; `ff nettete` sans alerte. Photos : mêmes séries
Wikimedia, réduites à 1 600 px (assez pour les vignettes à 2x et 3x). Comparaison : [essai](captures/rangees-essai.jpg)
(écrasé).
Reste faible : la dernière case de la rangée d'avis ne s'étire pas jusqu'au bord à l'ordinateur ; une rangée courte
s'élargit beaucoup (l'atelier à trois photos : la grande devient très large) ; clair neutre.

