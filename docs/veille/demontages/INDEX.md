# Démontages — 25 sites de petites structures, octobre 2026

Méthode : HTML rendu et CSS réels récupérés par Chrome sans tête (playwright-core), polices, couleurs, courbes
et tailles lues dans le CSS et le DOM calculé ; captures 1440x900 et 390x844 dans `captures/<slug>-d|m.webp`
(regardées une par une), planche de défilement de 8 vues par site dans le scratchpad (non versionnée).
Sources de sélection : listes Awwwards (catégories Food, Restaurant & Hotel, Fashion, Architecture, recherches
par mot-clé), minimal.gallery (accueil du 16 oct 2026). Aucun site de `references.md` ni de
`techniques-2026-10.md` repris. Deux sites écartés en cours de route : La Revoltosa (écran rouge bloquant, marque
de boissons plutôt que commerce) et Rye Island Roastery (images et police non chargées dans notre navigateur,
jugement impossible) ; remplacés par KS Architectes et Mathilde De Chiara.

Répartition : 11 sites en français ou européens francophones (Joakim, Saint Georges, Boursier, Artisans de
Genève, Bécane, Coutumes, KS Architectes, Mathilde De Chiara, Délice, Binocle, Monarque), 19 européens ;
aucun métier plus de 3 fois (vêtements : Bécane, Their Nibs, Niksen).

| Site | Métier, lieu | Premier écran | Geste signature | Fiche |
|---|---|---|---|---|
| La Table de Joakim | Chef à domicile, Nantes | Sombre (photo), puis clair | Chapitre épinglé qui change de titre et de couleur de fond (ordinateur seul) | [fiche](latabledejoakim.md) |
| Le Saint Georges | Hôtel-restaurant, Gruyères (CH) | Clair (vidéo de façade) | Plan illustré du village avec légende numérotée (parkings, bus) | [fiche](lesaintgeorges.md) |
| Délice | Pizzeria-restaurant, Lévis (QC) | Saturé (rouge) | Horaires par service, ouverts sur le jour même | [fiche](delice.md) |
| Paput | Burgers, Mahón (ES) | Clair (photo produit) | Deux bandes de texte croisées en diagonale, une pleine, une en contour | [fiche](paputmenorca.md) |
| Pizza Amici | Foodtruck pizza, Den Haag (NL) | Clair, très chargé | Fiche technique par camion (pizzas/heure, dimensions) | [fiche](pizza-amici.md) |
| Café Binocle | Micro-torréfacteur (Canada, fr) | Saturé (jaune) | Manifeste en capitales sur toute la largeur | [fiche](cafebinocle.md) |
| Caffè Gilli | Café historique, Florence (IT) | Clair (salle vide) | Photo d'archive noir et blanc pour raconter 1733 | [fiche](caffegilli.md) |
| Bécane | Vêtements moto femme, Paris | Clair, typographique | La gamme en alignement de silhouettes à la même échelle | [fiche](becaneparis.md) |
| CRISP | Barbier, Montréal | Sombre (photo voilée) | Tarifs en colonnes par niveau de coiffeur | [fiche](crispmtl.md) |
| Coutumes | Bijoux homme, France | Photographique, accent jaune | Diptyque ambiance + détail, titre posé sur la couture | [fiche](coutumes.md) |
| Their Nibs | Pyjamas, Royaume-Uni | Photographique | Photo portée à côté de la fiche produit achetable | [fiche](theirnibs.md) |
| Estudio Niksen | Vêtements et boutique, Montréal | Clair (paysage) | Légende de mesure : taille du mannequin et taille portée | [fiche](estudioniksen.md) |
| Studenterkilden | Lieu de réception, Klampenborg (DK) | Clair, 100 % texte | FAQ de logistique (parking, toilettes, taxi, musique) | [fiche](studenterkilden.md) |
| Coquelicots | Gîte, Dordogne (site en néerlandais) | Clair | Calendrier de disponibilité et réservation sur l'accueil | [fiche](coquelicots.md) |
| De Groene Afslag | Tiers-lieu (resto, hôtel, salles), Bussum (NL) | Clair, aplats | Le titre de section vient se ranger à côté du logo | [fiche](degroeneafslag.md) |
| Relais Rossàr | Relais spa, lac de Garde (IT) | Clair (vidéo drone) | Barre de réservation pré-remplie qui descend de la nav, bon cadeau en nav | [fiche](relaisrossar.md) |
| Monarque Événements | Production d'événements, Québec | Sombre (bordeaux) | Photo glissée dans la ligne du titre | [fiche](monarque.md) |
| Agrumea Farm | Conserverie familiale, Sicile | Clair | La gamme sur une roue qu'on tourne | [fiche](agrumeafarm.md) |
| Meyers | Groupe culinaire, Copenhague | Photo sombre dans un cadre beige | Toute la page posée dans un cadre de couleur | [fiche](meyers.md) |
| Odyssée | Cabinet de médecine esthétique, NSW (AU) | Clair (vidéo) | Nav posée à mi-hauteur du hero, qui se colle en haut | [fiche](odysseeclinic.md) |
| Tout Bien | Bière, Belgique | Photo + rouge | Barre d'objectif publique et datée (11 millions de canettes) | [fiche](toutbienpils.md) |
| Maison Boursier | Graveur héraldique MOF, Paris | Sombre (macro), puis gris clair | Pictogramme gravé au-dessus de chaque titre | [fiche](maisonboursier.md) |
| Artisans de Genève | Personnalisation de montres, Genève | Sombre (macro) | Réalisations nommées par les initiales du client | [fiche](artisansdegeneve.md) |
| KS Architectes | Régularisation urbanistique, Bruxelles | Clair | Réalisations classées par commune et type d'infraction | [fiche](ksarchitectes.md) |
| Mathilde De Chiara | Architecte d'intérieur, Paris / Pays basque | Clair, images seules | Réglages permanents « Slider / Grid » + filtre par typologie | [fiche](mathildedechiara.md) |

## Démontage automatique

`node scripts/ff.mjs demonter <url> [--slug <site>] [--nom <x>]` (17 oct 2026, `scripts/ff/demonter.mjs`) fait la partie
mesurable de la méthode ci-dessus en 25 s : Chrome sans tête à 1440x900 puis 390x844, captures `captures/<nom>-d|m.webp`
et planche de 8 vues `<nom>-planche.jpg`, fiche `<nom>.md` aux mêmes titres que celles de ce dossier, `<nom>.json` avec
les mesures brutes. Essai sur Délice contre la fiche écrite à la main : l'outil lit juste les polices (Ivy Mode, Filson Soft,
Miller Banner auto-hébergées, h1 Filson 18 px capitales, h2 48/32 px), la palette avec les hex des sections que la main
n'avait pas lus (#263150, #7c2627, #91964f), Lenis, Swup, `data-module-parallax` ×12, la barre d'actions fixe en bas
(Venir, Réserver, Commander, Carte cadeau), les horaires, les portes d'action, le « depuis 1970 » à 64 px. Il ne voit pas
ce qui demande un œil : le titre sur tracés SVG, le canvas WebGL, la matière des photos détourées, « en 3 secondes », et il
ne choisit pas le geste signature (il propose trois candidats factuels : section la plus haute, élément le plus animé,
bloc à la structure unique). Les fiches de ce dossier restent écrites à la main ; l'outil sert d'abord aux références du
brief d'un client (`--slug`, dossier `sites/<slug>/references/`, non livré) avant le contrat de direction.

## Motifs récurrents

Ce que 4 sites ou plus font et que l'usine ne fait pas encore. « Pas encore » vérifié dans `src/lib/schema.ts`,
`src/sections/` et `src/sections/Nav/bar.astro` le 16 oct 2026.

1. **Des portes d'action nommées par intention, pas un seul « Contact »** (6 : Délice « Venir / Réserver /
   Commander / Carte cadeau », Rossàr « Bon cadeau / Demande / Réserver », KS « Situation irrégulière ? »,
   Meyers « Carte cadeau / Service client », Studenterkilden « Book a table / View packages », Boursier
   « Contact & Devis »). L'usine : `Nav/bar` = bouton téléphone + bouton devis si tiroir ; le schéma `contact`
   n'a ni lien de réservation, ni de commande, ni de bon cadeau.
2. **Le bon cadeau en premier niveau** (4 : Délice, Rossàr, Meyers, Studenterkilden). Aucun champ au schéma.
3. **Horaires détaillés jour par jour, souvent par service, jour courant mis en avant** (6 : Délice, Niksen,
   Odyssée, Paput, CRISP, Groene Afslag). L'usine a `contact.hours` (avec `opens`/`closes`) mais l'état « ouvert
   / fermé » et le jour courant n'existent que dans des sections sur mesure (`sites/dentaire-morvan`,
   `sites/moteur-fils`), pas en section partagée.
4. **Les réalisations portent des métadonnées** : lieu, type de travaux, mesure, client, compteur (6 : KS,
   Artisans de Genève, Mathilde De Chiara, Pizza Amici, Niksen, Bécane). L'usine : `proof.gallery` =
   `{ src, alt, caption }` seulement, pas de filtre.
5. **Réservation ou disponibilité accessible depuis l'accueil** (5 : Coquelicots, Rossàr, CRISP, Studenterkilden,
   Délice). Aucun `bookingUrl` au schéma.
6. **Le recrutement sur la page d'accueil** (5 : Délice, Paput, Pizza Amici, Groene Afslag, Meyers). Aucun champ.
7. **Une couleur de fond par section ou par activité** (5 : Joakim, Délice, Pizza Amici, Groene Afslag,
   Monarque). Déjà noté en C7 de `techniques-2026-10.md`, toujours absent (`data-theme` introuvable dans
   `src/sections` et `src/shells`).

Et les motifs tout aussi récurrents **à ne pas suivre** (GOUT.md) : polices « IA » (5 : Joakim, Saint Georges,
Their Nibs, Coquelicots, Boursier), boutons pilule (5 : Paput, Binocle, Coquelicots, Rossàr, Tout Bien), vidéo
en premier écran (6 : Saint Georges, Rossàr, Odyssée, Tout Bien, Artisans, Boursier), couches
bloquantes à l'arrivée (5 : écran d'âge Tout Bien, avis juridique Artisans, pop-ups Coutumes, Niksen, Their
Nibs), « X ans » mis en scène (3 : CRISP, KS, Studenterkilden).

## Les 10 gestes à transposer (impact / coût)

| # | Geste (source) | Impact | Coût | Cible dans le repo |
|---|---|---|---|---|
| 1 | FAQ logistique exigée au brief : parking, accès, délais, allergies, bruit… (Studenterkilden, KS) | Fort | Très faible | `docs/BRIEF.md` (6 à 10 questions réelles), `src/sections/Faq/accordion.astro` en `<details name>` (A5) |
| 2 | Portes d'action par intention dans la nav : Réserver, Commander, Bon cadeau, Devis (Délice, Rossàr, Meyers, KS) | Fort | Faible | `src/lib/schema.ts` (`contact.bookingUrl`, `orderUrl`, `giftCardUrl`, tous optionnels, jamais devinés), `src/sections/Nav/*.astro`, `docs/BRIEF.md` |
| 3 | Barre d'actions collée en bas sur téléphone, 2 à 4 actions (Délice) | Fort | Faible | Composant `src/components/BarreActions.astro` posé par `src/layouts/Base.astro` si `layout.actionBar`, `safe-area-inset` (C6) |
| 4 | Horaires par jour avec le jour courant et l'état « ouvert / fermé », sans horloge (Délice, Odyssée, Niksen) | Fort | Faible | Composant partagé `src/components/Horaires.astro` lisant `contact.hours` (`opens`/`closes` existent), utilisé par `Contact/*` et `Footer/*` ; script de 10 lignes, rendu correct sans JS |
| 5 | Réalisations avec lieu, type de travaux, mesure, initiales du client + filtres par type (KS, Artisans, Mathilde De Chiara, Niksen) | Fort | Moyen | `src/lib/schema.ts` (`gallery` : `place?`, `kind?`, `size?`, `client?`), `src/sections/Proof/gallery.astro` + filtres CSS `:has()` sans JS |
| 6 | Photo dans la ligne du titre, à hauteur des capitales (Monarque) | Moyen | Très faible | Prop `image` de `src/components/SectionHeading.astro`, et `Hero/typographic` |
| 7 | Le titre de la section courante qui se range à côté du logo (Groene Afslag) | Moyen | Faible | CSS pur dans `src/components/SectionHeading.astro` (`position: sticky`) + `scroll-state(stuck)` (A1), option de coquille |
| 8 | Diptyque ambiance + détail, titre posé sur la couture (Coutumes) | Moyen | Faible | Nouvelle variante `src/sections/Hero/diptyque.astro` + `VARIANTS.hero` + ligne `docs/DIRECTIONS.md` |
| 9 | Recrutement sur l'accueil, avec l'adresse mail RH (Délice, Paput, Pizza Amici) | Moyen | Faible | `src/lib/schema.ts` (`jobs?: { title, text }[]`, `jobsEmail?`), variante `src/sections/Cta/jobs.astro` |
| 10 | Disponibilités d'un gîte lues dans l'iCal (Coquelicots) | Fort pour gîtes et chambres d'hôtes, nul ailleurs | Moyen | Bloc sur mesure `sites/<slug>/sections/Disponibilites.astro` (lecture de l'`.ics` au build), à promouvoir en variante après deux clients |

Suivants, à garder sous le coude : la page dans un cadre de couleur (Meyers, nouvelle coquille
`src/shells/cadre.astro`), la nav à mi-hauteur du hero qui se colle (Odyssée), le plan illustré du lieu avec
légende numérotée (Saint Georges, bloc sur mesure), le pictogramme d'atelier en séparateur (Boursier, A14), la
grille de tarifs par niveau (CRISP, `Services/grid` en `<table>`).
