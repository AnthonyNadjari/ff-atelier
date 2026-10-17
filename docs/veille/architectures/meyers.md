# Meyers — architecture « la page posée dans un cadre de couleur, contenu en feuilles qui glissent »

- Source : https://meyers.dk ; page intérieure lue : https://meyers.dk/kantine (démontées le 17 oct 2026). Fiche de goût antérieure : `docs/veille/demontages/meyers.md`.
- Métier : groupe culinaire de Copenhague (restaurants, boulangeries, cantines, traiteur, cours de cuisine, recettes). Plus gros qu'un artisan ; retenu pour son architecture, transposable à un petit commerce.
- Mesures : `meyers-demontage.md`, `.json`, `-style.json`, captures `captures/meyers-*`.

## Le modèle en une phrase

Tout le site est posé dans un **cadre** beige (une marge de couleur de 24 px tout autour, qui ne bouge pas) : la photo d'accueil reste collée au fond pendant que le contenu monte par-dessus comme une feuille, et le pied se découvre à la fin sous la dernière feuille ; dans le cadre, une nav à deux étages (les univers, puis les rubriques de l'univers courant) et des rangées de cartes à bandeau de couleur, une couleur par activité.

## Schéma de l'accueil (9,6 écrans ordinateur, 13,9 téléphone)

```
[CADRE beige #d6ceb4, 24 px, sur les côtés, tout le long]
[nav étage 1 : bande brun foncé : univers (Restaurants & boulangeries, Foodservice, Détail, Projets, Agenda) | « Acheter une carte cadeau » | « Service client »]
[nav étage 2 : rubriques de l'univers (Cantine, Déjeuner, Traiteur & événements, Cours, Recettes) | logo à droite]
[HÉROS COLLÉ au fond, 1 écran : photo d'assiette plein cadre + h1 géant de 128 px en capitales, deux couleurs]
[FEUILLE crème qui monte par-dessus :]
   [« Ce sur quoi nous travaillons en ce moment » : 3 cartes article (titre en capitales, étiquette, photo)]
   [« Recettes » : 3 cartes photo + étiquettes de saison colorées]
   [« Ce que nous proposons aux entreprises » : 3 cartes à aplat de couleur (vert olive, rouille, brun)]
   [« Visitez nos restaurants » : photo à gauche | aplat olive à droite avec texte]
   [« Nos cours » : 3 cartes bordeaux]
   [bandeau « Devenez plus savant sur les légumineuses » : photo + aplat]
   [« Engagement » : texte en 2 colonnes]
   [Instagram : mosaïque sur aplat olive]
[PIED COLLÉ découvert à la fin : 3 colonnes de liens + newsletter]
```

## Schéma d'une page intérieure (`/kantine`, 13,4 écrans)

`[cadre + nav à 2 étages, l'étage 2 = rubriques de l'univers] → [héros collé : photo + titre géant] → [feuille : introduction, offres en cartes, photos, témoignages ou chiffres, formulaire de demande] → [pied découvert]` (même grammaire que l'accueil, l'univers change la 2e ligne de nav).

## Navigation, contact, preuves, téléphone

- Pages : 36 liens internes (univers, rubriques, recettes, articles, à propos, emplois, rapports d'hygiène, contact). Nav à deux étages qui change selon l'univers ; au téléphone, un carré « Menu » beige + logo (barre fixe de 64 px).
- Contact : « Service client » et « Carte cadeau » en premier niveau ; réservation vers un outil externe ; contact dans le pied.
- Preuves : les recettes, les articles, les cours ; rapports d'hygiène publiés (« smileyrapporter ») ; pas d'avis.
- Téléphone : le cadre reste visible ; héros réduit (h1 34 px) ; cartes en une colonne ; rangées de cartes aimantées en glisser horizontal (scroll-snap x mandatory).

## Rythme, texte et images, profondeur

Dense (1 118 mots dans la feuille d'accueil) mais rangé en rangées de 3 cartes ; photos et aplats de couleur à parts égales. Profondeur nette : trois plans (cadre fixe, héros collé au fond, feuille qui monte), plus le pied découvert. Une seule ombre forte (`0 32px 68px` noir à 30 %) sous la feuille.

## Style (à réappliquer tel quel)

- **Polices** : une seule famille maison (*Meyer Grand*, grotesque condensée) : h1 **128 px** / 34 px téléphone, graisse 700, interlignage 0,75 (lignes serrées qui se touchent), capitales, interlettrage -2,56 px ; h2 32 / 24 px capitales ; h3 64 px capitales ; texte 18 / 14 px graisse 300, interlignage 1,3 ; nav 18 / 14 px 700 capitales. À remplacer par une grotesque condensée grasse équivalente (licence).
- **Couleurs** (rôles) : beige sable `#d6ceb4` = cadre et fond (42 %) ; crème `#f4f2e0` = feuille de contenu (35 %) et texte sur sombre ; olive `#484c38` = aplats (10 %) ; beige clair `#e5e0ca` = cartes ; encre brun `#291d1a` = texte (62 %) ; ocre `#bf8f2d` = accent (titres sur olive, boutons) ; saumon `#f3c2b0` = un bouton ; rouille et bordeaux = une couleur par activité.
- **Espacements** : cadre de 24 px ; rangées de 3 cartes séparées de ~16 px ; texte de 370 à 430 px (~42 à 52 caractères).
- **Rayons et bordures** : cartes et photos à angle droit ; boutons à 3,75 px ; étiquettes à 32 px (pastilles) ; filets de 2 px en haut des boutons de couleur.
- **Ombres** : une seule, sous la feuille qui monte sur le héros.
- **Photos** : portraits 4:5 et paysages 3:2 dans les cartes (20 à 35 % de largeur), une photo plein cadre au héros ; gros plans d'assiettes et de pain ; aucun filtre.
- **Boutons et liens** : boutons pleins 58 px de haut, texte 15 px 600, aux couleurs d'activité ; carte entière cliquable ; liens de nav en capitales crème.
- **Icônes** : 3 seulement.
- **Animations** : courbe `cubic-bezier(0.65, 0, 0.35, 1)` partout (0,35 / 0,45 s pour les transform, 0,4 s pour l'opacité) ; mots du h1 qui apparaissent un à un (0,75 s) ; photos des cartes qui glissent sous un masque au survol (121 éléments masqués).
- **Textures** : aucune.

## Ce qui le rend différent de notre déroulé

Le cadre de couleur fixe enferme le site comme une page de livre de cuisine ; le héros ne défile pas, la page monte dessus ; la nav dépend de l'univers. Notre déroulé : pleine largeur, blocs qui défilent tous à la même vitesse, une nav unique.

## Ce qu'il faudrait à l'usine

- **Nouvelle coquille** `src/shells/cadre.astro` (déjà notée « à garder sous le coude » dans `docs/veille/demontages/INDEX.md`) : marge de couleur fixe autour du contenu (token `--bg-2` ou couleur de devanture), héros collé + contenu qui monte (la coquille `sticky-hero` le fait déjà : il s'agit de l'y combiner avec le cadre), pied découvert en fin de page.
- **Couleur par activité** (`data-theme` par section ou par service) : absente aujourd'hui (motif récurrent n° 7 de l'INDEX des démontages).
- La nav à deux étages n'est utile qu'au-delà de 3 activités : à ne pas faire pour un artisan.

Coût : **faible** (coquille dérivée de `sticky-hero` + un cadre ; la couleur par activité est un petit ajout de tokens).

## Convient à (selon les données du client)

Client à **identité de couleur forte** (devanture peinte, logo, emballage) et **plusieurs activités** à colorer différemment : boulangerie-pâtisserie-traiteur, épicerie fine avec cours, restaurant avec boutique, fromager avec plateaux et ateliers. Le cadre seul convient à tout client qui a une couleur ; la feuille qui monte demande une photo de héros forte.

## Signes IA à NE PAS reprendre (GOUT § 2)

- Étiquettes en **pastilles** (rayon 32 px) sur les recettes.
- Titres en **capitales partout** (h1, h2, h3, nav) : garder les capitales pour le h1 seulement si la police est condensée.
- Mots du h1 révélés un à un à l'arrivée : un seul effet, sur le seul h1, sinon c'est la révélation ligne par ligne refusée.
- Bannière cookies couvrant 100 % de l'écran à l'arrivée.
