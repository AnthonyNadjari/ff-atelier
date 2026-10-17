# Studio RHE — architecture « panneaux à tranche : le site se range comme des chemises »

- Source : https://www.studiorhe.com/ ; pages intérieures lues : `/projects`, `/project/zil-residences` (démontées le 17 oct 2026). Trouvé dans la liste « 20 Horizontal Scroll Websites » de reallygooddesigns.com.
- Métier : agence d'architecture et de design, Londres (« Est. 1997 »), hôtels et bureaux.
- Mesures : `studio-rhe-demontage.md`, `.json`, `-style.json`, captures `captures/studio-rhe-*` ; glissement filmé à la molette : `captures/studio-rhe-roue.jpg`.

## Le modèle en une phrase

À l'ordinateur, le site est une suite de **panneaux** posés côte à côte qui glissent vers la gauche à la molette (page en `overflow: hidden`, défilement simulé) ; une **tranche verticale** fixe sur le bord droit porte le nom du studio et un compteur de progression en %, comme le dos d'une chemise ; chaque panneau a un rôle (couverture, introduction, trois projets, métier, journal) ; au téléphone tout redevient vertical.

## Schéma de l'accueil (1 écran fixe ordinateur, la bande glisse ; 7,2 écrans au téléphone)

```
[rail gauche fixe 45 px : logo | « Est. 1997 » vertical | bouton menu]                [tranche droite : « Studio RHE » vertical | compteur % en bas]
→ PANNEAU 1 couverture : photo plein écran, h1 « Building Beyond » en serif fin de 187 px posé en bas, 2 lignes de présentation en haut à droite
→ PANNEAU 2 introduction : fond blanc, petite photo en haut à droite, « Established 1997 » + 3 lignes + « Learn More About Us »
→ PANNEAUX 3-5 projets : une photo verticale pleine hauteur par projet, nom + « View Project » dessous
→ PANNEAU 6 métier : une phrase de 4 lignes centrée + « Focusing on Commercial & Resort Projects » + « View All Projects »
→ PANNEAU 7 grande photo aérienne
→ PANNEAU 8 journal : fond orange #f06446, 3 articles
```

## Schéma d'une page intérieure

`/project/zil-residences` : `[colonne photos à gauche (3/4 de la largeur), qui défilent] | [colonne texte fixe à droite : nom du projet, un paragraphe de 230 mots, « Location : Seychelles » en bas] | [tranche « Studio RHE » + compteur]`.
`/projects` : `[filtres All / Resorts / Commercial] → [25 projets en photos portrait 4:5, 35 à 60 % de largeur, en file]` ; au téléphone, file verticale et barre de filtres fixe en bas (73 px).

## Navigation, contact, preuves, téléphone

- Pages : accueil, About, Projects (filtrable par type), une page par projet (25), Journal (articles), Contact. Menu en surcouche depuis le rail.
- Contact : page dédiée seulement ; aucun numéro cliquable mesuré sur l'accueil.
- Preuves : les projets (25), l'année de création, le journal ; aucun avis.
- Téléphone : en-tête réduit de 76 px qui se cache, panneaux empilés verticalement, photos 60 à 95 % de la largeur.

## Rythme, texte et images, profondeur

Une idée par panneau, très peu de texte (47 mots au premier écran téléphone). Image dominante. Profondeur par **plans glissants** : le panneau suivant entre par-dessus le précédent (le titre de couverture est coupé par le panneau d'introduction qui arrive) ; la tranche reste au premier plan.

## Style (à réappliquer tel quel)

- **Polices** : un serif de texte fin (*the-serif*, graisse 300) pour tout ce qui se lit comme un titre ; h1 **187 px** à l'ordinateur / 52 px téléphone, interlignage 1,1, interlettrage serré (-4,68 px) ; h2 21 / 19 px ; nav et boutons en serif **italique** 11 à 14 px. Texte courant en *the-sans* 12 px (ordinateur) / 15 px (téléphone), interlignage 1,5. Le grand écart de tailles (187 px contre 12 px) est le style.
- **Couleurs** (rôles) : blanc `#ffffff` (62 % des surfaces), noir `#000000` (texte), orange corail `#f06446` = UN panneau entier (journal) et la bande cookies (38 % des surfaces mesurées sur l'écran d'accueil à cause de ces deux blocs).
- **Espacements** : panneaux pleine hauteur ; colonne de texte de 380 px (~63 caractères) ; marges de 30 px environ autour des légendes ; rails de 45 px.
- **Rayons et bordures** : aucun rayon ; filets de 1 px noir à 25 % pour séparer les panneaux et les rails.
- **Ombres** : aucune.
- **Photos** : portraits très hauts (moins de 0,7) et paysages 3:2, pleine hauteur de panneau, sans marge ni cadre, sans filtre ; architecture vue d'avion.
- **Boutons et liens** : aucun bouton ; liens en serif italique soulignés (« View Project », « Learn More About Us »).
- **Icônes** : 1 ou 2 (logo, menu à barres verticales).
- **Animations** : `cubic-bezier(0.23, 1, 0.32, 1)` (sortie très douce) en 0,5 s pour l'opacité, 1 s pour les glissements de panneaux ; défilement simulé.
- **Textures** : aucune.

## Ce qui le rend différent de notre déroulé

Le site se range en panneaux de rôle unique, avec une tranche permanente qui dit où l'on est ; pas de section empilée, pas de formulaire, pas d'avis. Le contenu est choisi panneau par panneau, comme un dossier de présentation.

## Ce qu'il faudrait à l'usine

- **Nouvelle coquille** `src/shells/panneaux.astro` : sections en panneaux pleine hauteur côte à côte (ordinateur), glissement piloté par le défilement vertical natif (pas de défilement simulé : piste `position: sticky` + `transform`, comme `data-horizontal`), tranche droite fixe (nom + progression), rail gauche (menu, téléphone). Au téléphone : pile verticale ordinaire.
- **Sections au format panneau** : la plupart existent (hero, about, une galerie) mais doivent tenir en 100 vh sans débordement ; à prévoir : `proof/projet-panneau` (une photo verticale + nom + lien).
- **Pages réalisation** (comme Gingko) et filtre par type (`kind`, déjà dans `proof.gallery`).
- Le téléphone en haut (socle) : sur le rail gauche à l'ordinateur, dans l'en-tête au téléphone.

Coût : **fort** (coquille horizontale, sections calibrées à 100 vh, pages réalisation).

## Convient à (selon les données du client)

Client avec **peu de texte et des photos fortes, verticales, en série** (au moins 6 projets) : architecte, constructeur de maisons, menuisier-agenceur, photographe, tapissier, cuisiniste. Inadapté à l'urgence et à qui doit être appelé dès l'arrivée.

## Signes IA à NE PAS reprendre (GOUT § 2)

- Liens et nav en **serif italique** (emphase italique) : garder le romain.
- Le titre en serif fin de 187 px sur photo avec slogan anglais creux (« Building Beyond ») : la taille oui, le slogan non ; le h1 dit le métier et la ville.
- Défilement **simulé** (la page en `overflow: hidden`) : casse la molette, le clavier et iOS ; on garde le défilement natif.
- Compteur de progression en % : utile ici, à ne pas transformer en numérotation décorative.
