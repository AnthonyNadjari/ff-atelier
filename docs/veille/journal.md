# Journal de veille

Une entrée par tour de `/veille` (skill `.claude/skills/veille/SKILL.md`), la plus récente en tête :
fait / proposé / à décider / prochain volet. Le fondateur lit ce fichier (ou l'onglet Notes du doc
partagé) pour savoir où en est l'usine sans relire une conversation.

## 31 oct 2026, tour 21 (routine en ligne) : 1 style gardé sur 1 construit, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-31-tour21.jpg)) : le style `rangees`, repris d'Office Commun (officecommun.com,
petit studio de design). Pas de photo en haut : la barre nue (nom, numéro, Contact), la phrase du métier à la ville avec les
prestations en liens, puis **une rangée par chantier** (« nom » et commune sur une ligne, piste de photos à hauteur égale et
largeurs emboîtées, qu'on tire au doigt, un fil d'encre qui suit), les avis en rangée, le contact en tiroir. Pourquoi lui : c'est
le seul style gardé, et paysagistes, menuisiers, architectes d'intérieur vendent sur leurs chantiers.

**Fait**
- **Tri (2a quater, étape 0)** : **56 candidats** scannés avec `ff tri` en deux passes (onepagelove par genres, minimal.gallery,
  vitrine Webflow, boulangeries et ateliers) : listes `styles/tri/liste-2026-10-31-tour21.txt` et `-b.txt`, résultats
  `styles/tri/2026-10-31-tour21.json` et `-b.json`. 5 gardés par la machine, 47 refusés (presque tous linéaires ou trop proches),
  4 refusés par le site (robots.txt, 503, 405). Écartés à l'œil : davesocozy.com et elev8h2o.shop (écran de chargement, rien de
  mesuré), 11elevenbar.com (récit en vidéo qui bloque le défilement : GOUT § 3 et § 4), cafechezteta.com (au seuil de linéarité,
  pilules).
- **Style construit (1)** : `rangees` (officecommun.com) : direction (police Onest, libre), Nav/Hero/Services/Proof/About/Contact
  `rangees`, composants `RangeeDePhotos`, `AvisEnRangee`, `AtelierEnRangee`, modèles `presets/rangees.json` et
  `rangees-menuisier.json`, test, fiche avec « Construction » ([rangees.md](styles/rangees.md)). Premier juge neuf : ne tient pas à
  l'ordinateur (photos floues, rangées courtes, contact à moitié vide, texte minuscule, avis en bas) ; repris ; **second juge neuf :
  tient la comparaison, différent de l'usine, vendable. Gardé.** Ressemblance au plus 0,62 (téléphone), déroulé 0,61, linéarité 0,30.
  Restes : à l'ordinateur les rangées s'arrêtent sur la marge au lieu de filer au bord ; vide entre citation et auteur des avis.
- **Reprise `etabli`** (reportée du tour 20) : second juge neuf : ne tient toujours pas (série de photos sur feutre rouge
  criard), différent de l'usine. Pas gardé ([fiche](styles/etabli.md)). `travee` non repris.
- **Tour raté au sens de la skill** : 1 style gardé, il en faut 2. Pourquoi : sur 56 candidats, un seul était à la fois non
  linéaire, loin de l'usine et lisible sans vidéo ; les galeries (onepagelove, minimal.gallery) penchent vers les pages d'une seule
  colonne ; siteinspire (429), lapa.ninja et land-book (403), Framer Marketplace (429) et Awwwards bloqués depuis la session en ligne.
- **Catalogue** : modèles `presets/` 96 → 98 fichiers (+ `rangees`, `rangees-menuisier`) ; styles gardés non linéaires ce tour : 1 sur 1.
- **Mouvement** : profil nouveau `rangee-tiree-a-la-main` codé ([MOUVEMENTS.md](styles/MOUVEMENTS.md)).
- **Architectures (2a ter)**, codées et prouvées :
  - [sessions-places](architectures/sessions-places.md) (moto-auto-ecole.com, auto-école) : le billet de la prochaine session à
    cheval sur la photo, les sessions datées en piste (prix, places restantes ou « Complet », filtre), `/formations/<slug>`.
    Ressemblance au plus 0,60, linéarité 0,49.
  - [forfaits-atelier](architectures/forfaits-atelier.md) (garagedelaroutenationale.fr, garagedelarepublique38.fr, garage) :
    « Votre voiture ? » puis les forfaits en tickets (« Ce prix comprend »), barre du comptoir collée à l'ordinateur, les deux files
    sans / sur rendez-vous, `/forfaits/<slug>`. Ressemblance au plus 0,62, linéarité 0,56. `deroule.mjs` reconnaît le « comptoir de forfaits ».
- **Marché (2a)** : 9 sites de plus ([CE-QUI-VEND.md](marche/CE-QUI-VEND.md), **180 sites**). Aucun levier à 40 % ne manque à
  l'usine. Le plus vendeur : studio anata (architecte d'intérieur, Lyon) : vraie réalisation en grand, « Architecte d'intérieur
  Lyon » en titre, portes Particuliers / Professionnels, page tarifs, gérant qui parle à la première personne, 11 avis datés,
  décennale écrite ; seul manque : le numéro en haut.
- **Paires trop proches** (`ff ressemblance --registre --tous`) : 194, inchangé (aucun site existant refait, règle du 31 oct).
  Aucun style ni architecture du tour n'y entre.
- **Santé** : `npm ci`, Chromium présent. Tests : 3 rouges trouvés sur `rangees` (conventions, titre par `wording`, `onPage`)
  et corrigés ; suite complète verte avant commit : 1 749 tests sur 114 fichiers. `tests/presets.test.mjs` assoupli : une variante
  d'un style entier compte si un de ses modèles l'utilise.

**Proposé**
- Photos des essais, frein n° 1 pour le troisième tour : `ff photos-demo` rend des séries disparates ; il faudrait un tri par
  lumière et par sujet, ou une clé Unsplash/Pexels pour les essais.
- Galeries : chercher des sources qui ne bloquent pas la session en ligne (land-book, lapa.ninja et siteinspire refusent).
- `rangees` : laisser les pistes filer au bord droit à l'ordinateur.

**À décider** : rien de neuf.

**Prochain tour commence par** : `travee`, puis `ocre`, `souffle`, `rideau` ; `etabli` seulement avec une série au fond neutre.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 31 oct 2026, tour 20 (routine en ligne) : 1 style gardé sur 3 construits, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-31.jpg)) : le style `rayon`, repris de Blank Inside (blankinside.co.uk, papeterie
anglaise) : bandeau « Commander par téléphone », nom centré, onglets « La sélection / Toute la gamme », puis les produits en rayons
qu'on fait glisser au doigt, chaque rayon titré à la main avec sa flèche dessinée, et une fin en trois tampons (Appeler, Venir,
Écrire) sans formulaire. Pourquoi lui : c'est le seul style gardé franchement ce tour, et fromagers, cavistes, épiceries fines ont
tous une gamme à montrer.

**Règle appliquée** : celle du 31 oct de `.claude/skills/veille/SKILL.md` (scanner 40 ou plus, construire 3 au plus, garder 2 ou 3
franchement), et non le « 10 sites, 5 gardés » de la consigne de la routine.

**Fait**
- **Tri (2a quater, étape 0)** : 47 candidats scannés avec `ff tri` (onepagelove, minimal.gallery ; siteinspire bloqué par un
  contrôle anti-robot, Awwwards coupé par le proxy) : liste `styles/tri/liste-2026-10-31-tour20.txt`, résultat
  `styles/tri/2026-10-31-tour20.json`. 4 gardés par la machine, 41 refusés (presque tous « linéaires »), 2 refusés par le site.
  `convicts.nyc` écarté à l'œil (réalisateurs, tout repose sur la vidéo, bloquée sur iPhone).
- **Styles construits (3)**, chacun en entier (direction, hero, geste signature, fin propre, deux modèles `presets/`, test, fiche avec
  « Construction ») et jugé par un agent neuf sur images :
  - `rayon` (blankinside.co.uk) : **tient la comparaison, différent de l'usine. Gardé.** Profil de mouvement `etagere-qui-se-remplit`.
    Ressemblance au plus 0,61 (déroulé), linéarité 0,29. Restes : vignettes de fonds inégaux, nom en grotesque au lieu d'un logo dessiné.
  - `travee` (driessenarchitectuur.nl, architecte) : **ne tient pas, deux fois** (photo du premier écran trop petite puis floue, page
    vide à l'ordinateur ; le second juge le trouve proche de `talus`). Pas gardé, à reprendre. Le « défilement horizontal » vu par
    `ff tri` n'était que le carrousel du premier écran : la source défile en vertical.
  - `etabli` (agronomywork.shop, objet phare : coutelier) : **ne tient pas, deux fois, mais différent de l'usine** (fiche collée à
    côté de l'objet, nom géant en fin). Ce qui manque : une vraie série de photos variées d'un même objet. Pas gardé, à reprendre.
  - **Tour raté au sens de la skill** (un seul style franchement gardé, il en faut 2). Pourquoi : les deux autres tombent sur les photos
    d'illustration (série incohérente, résolution trop faible), comme au tour 19, et `ff tri` surestime la nouveauté d'un site dont
    seul le carrousel bouge de côté.
- **Mouvement** : 3 profils nouveaux codés ([MOUVEMENTS.md](styles/MOUVEMENTS.md)) : `etagere-qui-se-remplit`, `travee-au-doigt`,
  `fiche-collee-a-l-objet`. Police ajoutée : Permanent Marker (titres de rayons seulement).
- **Palettes** par régime, avant → après : clair neutre 93 → 95, clair teinté doux 39 → 39, sombre 38 → 38, coloré doux 61 → 62.
- **Style maison** (`ff ressemblance --registre --tous`) : linéarité moyenne 0,83, 80 % des sites au-dessus du seuil. Inchangé : les
  styles du tour n'ont été posés que sur des sites jetables, aucun site existant n'a été refait.
- **Architectures (2a ter)**, codées et prouvées :
  - [mur-producteurs](architectures/mur-producteurs.md) (comboirepaysan.fr, dose-epicerie.com) : magasin de producteurs ; colonne collée
    à gauche (h1, téléphone, horaires du jour, « Qui fait quoi ») et le mur des producteurs à côté, `/producteurs/<slug>`.
  - [tableau-departs](architectures/tableau-departs.md) (taxi-annecy.fr, taxichamonix.fr) : taxi ; le tableau des départs (distance,
    durée, prix) collé à droite, « À quelle heure partir ? » calculé dans le navigateur, `/trajets/<slug>`.
  - Ressemblance au plus 0,64 et 0,57, linéarité 0,50 et 0,46. `deroule.mjs` reconnaît « annuaire de fiches » et « tableau des départs ».
    Elles se ressemblent entre elles par la disposition (0,89, une colonne collée chacune) : jamais pour deux pistes d'un même client.
- **Marché (2a)** : 9 sites de plus ([CE-QUI-VEND.md](marche/CE-QUI-VEND.md), 171 sites). Aucun levier à 40 % ne manque à l'usine. Le plus
  vendeur : Bâti HALLI (maçon, Toulouse) : « Votre maçon à Toulouse, en famille depuis 30 ans », 5,0 sur 54 avis, numéro et devis au
  premier écran, chantiers chiffrés, décennale et SIRET écrits.
- **Paires trop proches** (`ff ressemblance --registre --tous`, début de tour) : **194** (231 au tour 19). Pires : encre-noire /
  forge-delacroix (0,88 à l'ordinateur), auto-ecole-rabelais / cantine-roulante (0,88 au déroulé), fromagerie-ravanel-b / -c (0,85).
  Signalées, pas corrigées ce tour.
- **Santé** : `npm ci`, Chromium présent, tout a tourné avec navigateur. Tests : 1 715 verts sur 112 fichiers en fin de tour (4 rouges de `travee` trouvés et corrigés : police et titre de section par les tokens et `wording`) ; signatures uniques ; build de `_exemple` vert.

**Proposé**
- **Photos des essais**, frein n° 1 pour le deuxième tour de suite : sans série de photos cohérente, aucun style ne tient. Une clé
  Unsplash/Pexels pour les essais, ou un tri par lumière dans `ff photos-demo`.
- `ff tri` : ne pas compter comme « piste » un carrousel limité au premier écran (cas de driessenarchitectuur.nl).
- `ff verifier` refuse « garantie de résultat » mais laisse passer « résultats garantis » (vu chez mon-coach-sportif.fr).

**À décider** : faut-il commencer à refaire des sites existants avec les styles non linéaires (la linéarité moyenne ne baissera pas
autrement) ?
**Réponse du fondateur (31 oct, matin)** : non. « Ce que je veux c'est stocker un max de designs pour les réutiliser sur
commande. » On ne refait aucun site existant ; le chiffre suivi devient le catalogue (`presets/`), SKILL.md et GOUT.md à jour.

**Prochain tour commence par** : reprendre `etabli` et `travee` avec de vraies séries de photos, puis `ocre`, `souffle`, `rideau`.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 30 oct 2026, tour 19 (routine en ligne) : 5 styles gardés sur 10, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-30.jpg)) : le style `dune`, repris de Haus Steuermann (steuermann.haus, gîte
en deux ailes sur l'île de Föhr) : le nom de chaque maison posé à la verticale sur les bords de l'écran, des paires de photos
qui se chevauchent, et une fin de page sans formulaire (le mot de l'hôte, ses coordonnées, l'adresse et le plan). Pourquoi lui :
c'est le seul que le juge neuf dit vendable « en l'état » une fois les photos du client posées, et les gîtes et chambres
d'hôtes sont une clientèle nombreuse.

**Fait**
- **Styles (2a quater)** : 10 sites jamais étudiés (Awwwards, siteinspire, minimal.gallery, Framer, Webflow showcase ;
  godly.website renvoie désormais vers recent.design, inutilisable). Chacun est construit en entier : direction, hero, geste
  signature, fin de page propre, deux modèles `presets/<id>.json` et `<id>-<métier>.json`, test `tests/style-<id>.test.mjs`
  et fiche avec « Construction ». Un juge neuf compare la source et l'essai sur images, puis une reprise par style.
  **5 gardés** :
  - `dune` (steuermann.haus, gîtes) ;
  - `pochoir` (haven-annecy.fr, café-brunch : le nom rempli de photos, les mots géants barrés de leurs heures écrites à la main) ;
  - `barbotine` (laboroflovestudio.com, céramiste : une plaque d'émail par cours qui s'empile au défilement) ;
  - `cartouche` (hotel-gilbert.at, petit hôtel : nom géant entre deux filets, cartouches à cheval sur les photos) ;
  - `baume` (fiziopont.hu, kiné : les étapes en cartes inclinées qui se posent une à une).

  Les quatre derniers sont gardés « de justesse ». **5 à reprendre** : `farine` (impastofornoantico.com), `buvard`
  (florawellnesscafe.com), `souffle` (tavolini.com), `rideau` (holographik.space), `talus` (taylorhare.com). Verdicts et
  restes dans [styles/INDEX.md](styles/INDEX.md), comparaisons dans `styles/captures/<id>-{source,essai}.jpg`.
- **Ce qui a fait tomber la comparaison, presque à chaque fois : les photos d'illustration.** La construction est désormais
  bien reprise. Mais `ff photos-demo` ramène des photos hors sujet (églises, train, lanceur de base-ball) et de lumières
  différentes. Les agents ont dû en choisir à la main sur Wikimedia, et le juge les trouve encore disparates ou amateur.
- **Ressemblance** : `dune`, `pochoir`, `farine`, `buvard`, `rideau` et `souffle` passent sous 0,65 ; `cartouche` est à 0,65
  pile ; `barbotine` reste au-dessus (0,72 téléphone / 0,80 ordinateur / 0,77 déroulé), comme `baume` et `talus` au déroulé
  (0,78 et 0,75). Aucune photo n'a été rapetissée pour passer, sauf `buvard` à l'ordinateur (56 % de l'écran au lieu de 75 %).
  Le blocage vient de la moitié « site » du score : plusieurs pages, mêmes ancres, même longueur, c'est-à-dire le socle.
- **Correction après jugement** : `proof/buvard` ne met plus de photo au-dessus d'un avis signé (un barista au-dessus de
  « Sarah K. » passait pour la cliente).
- **Polices** ajoutées au registre (libres, hors liste IA) : Barlow, Sacramento, Libre Caslon Text, Courier Prime (paquets
  `@fontsource`) ; les autres styles emploient des polices déjà au registre (Gloock, EB Garamond, Hanken Grotesk, Familjen
  Grotesk, Epilogue, Red Hat Display, Josefin Sans, Oswald).
- **Palettes** par régime, avant → après : clair neutre 93 → 93, clair teinté doux 34 → 39, sombre 36 → 38, coloré doux 58 → 61.
- **Mouvement** : profils nouveaux et codés dans [MOUVEMENTS.md](styles/MOUVEMENTS.md) :
  - `mots-sous-la-photo`, `heures-ecrites-a-la-main`, `filet-tremble-qui-se-trace` ;
  - `plaques-qui-s-empilent`, `aile-qui-s-entrouvre`, `titre-qui-se-floute-en-sortant` ;
  - `cartouche-qui-se-pose`, `escalier-qui-se-rejoint`, `cartes-qui-se-rebattent`.
- **Architectures (2a ter)**, codées et prouvées, sans onglets :
  - [calendrier-recoltes](architectures/calendrier-recoltes.md) (cueillettedecompans.fr, jardindelavenir.fr) : « En ce moment, en
    <mois> » à côté du h1 (le mois du visiteur), le calendrier des récoltes en vrai tableau sur 12 mois, `/calendrier`,
    `/recoltes/<slug>`.
  - [nuancier-matieres](architectures/nuancier-matieres.md) (menuiserie-pipault-89.com, boudbois.fr) : « Pour quel usage ? » à
    côté du h1, les matières en échantillons carrés, l'échelle du client (dureté, densité) à sa vraie valeur, `/matieres`,
    `/matieres/<slug>`.

  Ressemblance au plus 0,61 et 0,64. `deroule.mjs` reconnaît deux modèles de navigation nouveaux : « calendrier annuel » et
  « nuancier ». Correctif en passant : `planche.mjs` servait une page blanche quand un dossier avait le même nom qu'une page
  `.html` (`/matieres`, `/trajet`, `/carnet`).
- **Marché (2a)** : 9 sites de plus ([CE-QUI-VEND.md](marche/CE-QUI-VEND.md), 162 sites). Aucun levier à 40 % ne manque à
  l'usine. Le plus vendeur : Renova-9 (rénovation extérieure, Aix) : « Devis gratuit sous 24 h, garantie décennale » en haut,
  puis une façade avant / après qu'on fait glisser soi-même dès le premier écran, et 13 avis Google datés. Nouveau
  contre-levier : le numéro caché derrière « Afficher le numéro ».
- `ff ressemblance --registre --tous` en début de tour : **231 paires trop proches** (254 au tour 18). 32 le sont par le premier
  écran et 211 par le déroulé. Les pires : prospect-ballay-macon / prospect-epi-dor (0,89 au déroulé), auto-ecole-rabelais /
  cantine-roulante (0,88), encre-noire / forge-delacroix (0,88 à l'ordinateur), chez-malo / forge-delacroix (0,85). Signalées,
  pas corrigées ce tour (la routine demandait de signaler).
- **Santé** : `npm ci`, Chromium présent, tout a tourné avec navigateur. Tests : voir le commit (tous verts avant le push). Les
  rouges trouvés en fin de tour ont été corrigés : variété des seconds modèles, `--ease-brand` de `buvard`, atome
  `hotelbelleville` d'une collecte précédente.

**Proposé**
- **Photos des démos**, le frein n° 1 de ce tour : tri plus strict dans `ff photos-demo` (une seule série, une même lumière,
  sujet vérifié) ou des clés Unsplash/Pexels pour les essais. Sans ça, aucun style ne « tient » franchement.
- **`ff ressemblance`** : recalibrer la moitié « site » du déroulé (proposé depuis le tour 18). Elle refuse des styles fidèles
  parce que tous les sites ont le socle (plusieurs pages, ancres). C'est au fondateur de trancher, car le calibrage vient de
  son jugement du 17 oct.
- `ff ia` lit la direction dans `site.config.ts`, pas dans `look.json` : un essai `--style` n'est pas contrôlé sur ses polices.
- Hero avec avant / après à glisser (levier Renova-9, 4 sites sur 126) : à surveiller.
- Gabarit des pages de prestation : la bande « Un projet, une urgence ? » apparaît même sur une cueillette ou un gîte.

**À décider** : faut-il desserrer `ff ressemblance` sur le déroulé (cf. ci-dessus) ? `dune` ou `cartouche` pour le prochain
gîte ou hôtel ?

**Prochain tour commence par** : reprendre `ocre` (tour 18), puis `souffle` et `rideau` avec de vraies séries de photos.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 29 oct 2026, tour 18 (routine en ligne, nuit) : 6 styles gardés, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-29-tour18.jpg)) : le style `enduit`, repris de BCG Building Design
(bcgbuildingdesign.com.au) : grande photo de maison avec la phrase en bas à gauche, une bande brune qui finit sur le nom
géant, la liste des prestations dont la ligne survolée montre sa photo, un avis entre deux photos. Pourquoi lui : le
bâtiment est le gros des clients artisans, et le juge neuf dit « au téléphone, l'empilement est fidèle et ça se vend à 1 200 € ».

**Fait**
- **Styles (2a quater)** : on reprend d'abord les trois du tour 17, puis quatre nouveaux. Chaque style est jugé par un agent
  neuf, en comparant les captures source et essai avec photos. **6 gardés** (« tient la comparaison ») :
  - repris : `pinceau`, `lin` (une reprise chacun), `bouteille` (deux reprises : salle plein écran, nom qui mord la photo
    3:2, chiffre géant = l'année d'ouverture et plus jamais un nombre d'avis) ;
  - nouveaux : `calque` (tekt.com.au, constructeur : tout en cellules filetées à repères d'angle) ; `chapitre`
    (23gradicoffee.com, torréfacteur : nom de bord à bord, règles 001, produit posé sur son nom géant, une reprise) ;
    `enduit` (bcgbuildingdesign.com.au).
  - Pas encore gardé : `ocre` (lrnce.com, atelier de céramique). Son premier écran est trop court et la fin de page est
    trop textuelle : à reprendre.
  - Les lignes sont dans [styles/INDEX.md](styles/INDEX.md), les comparaisons dans `styles/captures/<id>-essai.jpg`.
- **Reproche commun du tour 17 corrigé** : les modèles `presets/<id>.json` ne finissent plus sur la fin d'usine (communes,
  bandeau d'appel, questions, formulaire, barre basse à 3 boutons). Chaque style a sa propre fin, selon la source.
  - Nouvelles variantes : `contact/pinceau|lin|bouteille`, `proof/pinceau|lin|bouteille`, `about/bouteille`, pied `liens`
    (sur le fond de la page), `actionBar: false` dans ces modèles.
  - `ff melanger --style` sautait à tort la paire de polices du style lui-même : corrigé.
- **Polices** ajoutées (libres, hors liste IA) : Schibsted Grotesk, Gelasio, Gilda Display, Fragment Mono, Host Grotesk, Mulish.
- **Palettes** par régime, avant → après : clair neutre 93 → 93, clair teinté doux 32 → 34, sombre 35 → 36, coloré doux 57 → 58.
- **Mouvement** : 4 profils nouveaux, codés ([MOUVEMENTS.md](styles/MOUVEMENTS.md), 48 profils) : `cellules-qui-s-ouvrent`,
  `chapitre-qui-s-ouvre`, `index-qui-change-la-photo`, `nom-qui-defile-au-pied`.
- **Architectures (2a ter)**, codées et prouvées, et volontairement SANS onglets ni listes :
  - [carnet-interventions](architectures/carnet-interventions.md) (serrurier-nimes30.fr, atelier-bois-acier.fr) : l'accueil
    est le carnet de bord daté de l'artisan, mois collé en marge, `/carnet/<slug>`.
  - [rayon-trajet](architectures/rayon-trajet.md) (colson-elec.fr, conceptfroid.fr) : « Combien de temps pour venir chez
    vous ? » à côté du h1, la réponse calculée dans le navigateur, schéma des temps autour de l'atelier, `/trajet/<slug>`.
  - Ressemblance : 0,63 au plus contre tous les sites. `scripts/ff/deroule.mjs` reconnaît deux modèles de navigation
    nouveaux (« journal daté », « plan ou schéma »).
- **Marché (2a)** : 9 sites de plus ([CE-QUI-VEND.md](marche/CE-QUI-VEND.md), 153 sites). Aucun levier à 40 % ne manque à
  l'usine ; le formulaire sur l'accueil, recompté fiche par fiche, est à 37,9 %. Le plus vendeur : Saint-Cyr Serrurerie
  (près de Tours) : les prix des trois interventions au premier écran, le portrait du serrurier, 78 avis, le déplacement
  offert dans huit communes nommées.
- **Paire trop proche corrigée** : `studio-ambre` (pire 0,87 / 0,91 au premier écran contre chez-malo, et quatre autres
  paires). Elle est refaite en architecture `estimation-etapes` peinte en `lin` : pire 0,40 / 0,62 / 0,63
  ([avant / après](apercus/2026-10-29-paire-ambre.jpg)). `verifier` et `ia` verts.
- `ff ressemblance --registre --tous` en début de tour : 254 paires (39 au premier écran, 231 au déroulé).
- **Santé** : `npm ci`, Chromium présent, tout a tourné avec navigateur. Tests en fin de tour : 94 fichiers, 1 447 tests ; 2 rouges trouvés et corrigés (`--ease-brand` de `calque` et `ocre` écrit `ease` au lieu d’une courbe ; `composer.test` supposait `atelier` seule direction pour fleuriste, `ocre` la liste aussi), relancés verts.

**Proposé**
- `ff ressemblance` : le poids « site » (plusieurs pages, 4 pages et plus, même longueur) fait encore refuser des styles
  fidèles. Pour passer sous 0,65, les essais de ce tour ont rapetissé leur photo de premier écran (pinceau, calque, chapitre, enduit, ocre, bouteille à la première reprise) ou retiré une prestation (enduit).
  Il faut recalibrer, c'est le frein n° 1 aux styles.
- `ff photos-demo` ramène souvent des photos hors sujet (paella pour « cuisine », voiture de 1964 pour « conseil »).
  Wikimedia limite aussi le débit. Il faut un tri plus strict, ou des clés Unsplash/Pexels pour les démos.
- `ff apercu-rapide` : charger les images paresseuses avant la capture (flou à l'ordinateur, relevé par tous les agents).
- `deroule.mjs` lit « 4/5 » dans une classe `aspect-[4/5]` comme une note sur 5.
- Les pages de prestation en gabarit `fiche` gardent la bande sombre générique « Un projet, une urgence ? », même sous un
  style : il faudrait la faire suivre le style.
- Directions anciennes à corriger : `sapin` charge Space Mono (liste IA), `cobalt` échoue au contraste sur le bandeau
  d'appel des pages de prestation.
- Coquille `estimation` : le titre « D'où nous partons, où nous allons » est écrit en dur, à passer en `wording`.

**À décider** : `enduit` ou `calque` pour le prochain client du bâtiment ? La nouvelle tête de `studio-ambre` (plus de photo
au premier écran, la demande de visite à la place) vous convient-elle ?

**Prochain tour commence par** : reprendre `ocre`, puis recalibrer le poids « site » de `ff ressemblance`.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 29 oct 2026, tour 17 (routine en ligne, en même temps que le tour 16 à la main) : 3 styles construits, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-29.jpg)) : le style `pinceau`, repris du Coyot Bar à Montpellier (pickyjoe.com) :
enseigne empilée en capitales condensées, la page en bandes de couleur (bleu nuit, terracotta, sable, moutarde) aux bords
brossés, horaires sur une plaque posée sur la photo, la carte à prix sur bleu nuit. Pourquoi lui : c'est le seul des trois que
le juge neuf trouve presque à la hauteur de la source, et rien dans l'usine ne ressemblait à ça pour un bar ou un restaurant.

**Fait**
- `ff melanger --style <id>` qui lit `presets/<id>.json` : fait aussi ce matin par le tour 16 (session à la main, poussée
  pendant ce tour) ; sa version (`modeleEntier`, `appliquerModele`) est gardée, la mienne (`lookDuModele`) retirée à la fusion.
  Les deux tours ont tourné en parallèle sans se voir : 6 styles construits ce jour au total (3 par tour, sources différentes).
- **Styles (2a quater, nouvelle règle : un style = un site entier construit)** : 3 sites, chacun codé de bout en bout
  (direction, hero, section signature, modèle `presets/<id>.json`, test `tests/style-<id>.test.mjs`, fiche avec « Construction ») :
  - `lin` (fraher.co, constructeurs à Londres, clair teinté) : phrase seule dans le vide, bandeau photo, un panneau par service
    papier / sable / sauge, lien entre deux filets ; profil de mouvement `film-au-clic`.
  - `bouteille` (restaurantzimmerl.at, sombre) : le nom seul en capitales sur la photo de salle, titres géants à cheval sur des
    photos décalées, rail cuivre à points ; profil `enseigne-qui-se-resserre`.
  - `pinceau` (pickyjoe.com, coloré doux) : voir plus haut ; profil `bandes-au-pinceau`. Nouveau composant `BordPinceau.astro`.
  Polices ajoutées (libres, hors liste IA) : Judson, Lexend Zetta, Big Shoulders Display, Azeret Mono. Les trois essais :
  `verifier` vert hors données de test, `ia` vert, `ressemblance` au plus 0,63.
- **Juge neuf** (agent en lecture seule, captures + GOUT) : **aucun des trois ne tient tout à fait la comparaison**. `pinceau`
  presque (manque la photo plein cadre au premier écran) ; `lin` et `bouteille` fidèles en haut de page seulement. Reproche
  commun : sous la moitié de la page, les trois retombent sur la même fin d'usine (communes, bandeau d'appel, questions,
  formulaire, pied sombre, barre basse à 3 boutons). Marqués « à reprendre » dans [styles/INDEX.md](styles/INDEX.md). Au sens
  strict de la règle (2 styles gardés), **le volet styles est raté ce tour** : construits, pas encore gardés.
- Palettes par régime, avant → après : clair neutre 93 → 93, clair teinté doux 31 → 32, sombre 34 → 35, coloré doux 56 → 57.
- **Architectures (2a ter)**, codées et prouvées : [garde-especes](architectures/garde-especes.md) (clinique-les-quais.fr,
  vetosaintmax.fr ; coquille `garde` : deux portes « Prendre rendez-vous » / « Une urgence ? » avec le numéro du moment, clinique
  ou garde, calculé dans le navigateur ; un bloc à onglets Urgences puis une espèce par onglet ; `/urgences`, `/animaux/<slug>`)
  et [honoraires-domaines](architectures/honoraires-domaines.md) (faltot-avocat.fr, judisis.fr ; coquille `honoraires` :
  « Comment ça commence » à côté du h1, un onglet par domaine avec ses procédures « à partir de », convention, aide
  juridictionnelle ; `/nos-honoraires`). Ressemblance au plus 0,58 ; entre elles 0,87 au déroulé (jamais en pistes sœurs).
  Tests `tests/architectures-garde.test.mjs`.
- **Marché (2a)** : 9 sites de plus ([CE-QUI-VEND.md](marche/CE-QUI-VEND.md), 144 sites). Aucun levier à 40 % absent de
  l'usine (formulaire sur l'accueil à 39,6 %, à recompter). Le plus vendeur : ALB'ELEC à Montpellier (« Urgence < 2 h » avec
  Appeler et WhatsApp, 24 avis Google datés, chantiers situés, Qualifelec, 11 pages de communes). Nouveaux contre-leviers :
  publicité AdSense, page réalisations vide, actualité vieille d'un an en tête, photo de banque au premier écran alors que les
  vraies sont plus bas.
- **Paire trop proche corrigée** : `demo-informatique` (pire 0,90 au déroulé, 0,86 à l'ordinateur) refaite sur l'architecture
  `appareils-pannes` (« Quel appareil est en panne ? »), premier écran typographique, section sur mesure « Sur l'établi », vraies
  photos d'illustration au lieu de dégradés ; faux logos partenaires et faux portrait retirés. Pire paire après : 0,64 / 0,41 /
  0,61. `verifier` et `ia` verts. Paires trop proches : 268 → 245 (`ff ressemblance --registre --tous`).
- Santé : `npm ci`, Chromium de Playwright, tout a tourné avec navigateur. Tests : 84 fichiers, tous verts (un rouge corrigé :
  `--ease-brand` de `lin` en `linear` au lieu d'une courbe).

**Proposé**
- Modèles de style : laisser le modèle retirer ou déplacer la fin de page (communes, bandeau d'appel, questions) quand la
  source ne l'a pas, et l'essai `--style` ne pas garder les sections de `_exemple` absentes de la source ; c'est le reproche
  commun du juge.
- `ff apercu-rapide` : charger les images paresseuses avant la capture pleine page (photos floues à l'ordinateur sur les trois
  essais : aperçu de chargement capturé, `ff nettete` vert).
- `ff ressemblance` : le poids « site » (plusieurs pages, 4 pages ou plus) pèse ~0,49 à lui seul ; un client à 4 services peut
  être refusé quoi que fasse le style (relevé par l'agent `pinceau`).
- `ff photos-demo` : une entrée de `CREDITS.md` décrivait un routeur pour une photo de condensateur (attribution à vérifier) ;
  « rooftop » ramène des gratte-ciel.
- `navLinks` : lien « Avis » vers `/#proof` quand la section de preuve ne rend rien (vu deux fois ce tour).

**À décider** : reprendre `pinceau` d'abord (photo sous l'enseigne) ; `garde-especes` pour veto-du-drac et
`honoraires-domaines` pour lemaire-avocats (sur leurs propres données) ; la nouvelle tête de `demo-informatique`.

**Prochain tour commence par** : reprendre les trois styles jusqu'à ce que le juge neuf dise « tient ».

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 29 oct 2026, tour 16 (à la main, carte blanche du fondateur) : la veille réécrite, 3 styles construits en entier

**Le meilleur du tour** ([aperçu](apercus/2026-10-29-experimentalcc.jpg)) : la brasserie de démo reconstruite d'après Experimental
Cocktail Club en entier (portrait vertical, nom en exclusion qui glisse, une fiche par revendeur). Pourquoi : c'est la première
fois qu'un site de référence est appliqué avec sa construction et pas seulement ses couleurs.

**Le diagnostic du fondateur** (« c'est normal que ça soit si monotone ? », « on a encore des sites si génériques alors qu'on
scrape les meilleurs sites ») et sa cause, mesurée : 425 sites relevés en onze jours, seule la peinture appliquée (polices,
couleurs, marges), la construction jamais codée (« architecture 0 » dans `ff atomes`), les atomes de sept sites mélangés en une
moyenne, posés sur toujours les mêmes sections, et des démos sans photo. Écrit dans `docs/GOUT.md` § 0 et dans
`.claude/skills/veille/SKILL.md` § 2a quater (réécrit : 3 sites entiers construits par tour, preuve avec photos, compositions
obligatoires, une paire trop proche corrigée par tour, croisement sur demande seulement).

**Fait**
- **Usine** : `ff photos-demo` (photos d'illustration libres, marquées « Photo d'illustration », démos seulement, refusées sur un
  site client) ; `ff apercu-rapide` (une image en ~20 s au lieu d'une heure) ; 6 premiers écrans par famille
  (`carte-sur-photo`, `mosaique`, `editorial`, `numero-geant`, `preuve-d-abord`, `plan-et-lieu`) enfin appliqués par
  `ff melanger` ; `ff melanger --style <id>` applique le modèle de site entier `presets/<id>.json` quand il existe, et sans
  `--style` liste les styles à modèle entier ; `ff modele` vérifie les données du hero ; `paletteComplete` refuse un texte
  illisible sur la surface (16 palettes écartées) ; `vite-ff-look` lisait mal une direction de mélange figée (chiffres dans le nom).
- **Styles construits en entier (3)** : [experimentalcc](styles/experimentalcc.md) (direction, hero `portrait-exclusion`, section
  `zones/fiches`, modèle ; brasserie : premier écran ≤ 0,47, déroulé 0,78 contre 9 sites, voir ci-dessous) ;
  [frenchette](styles/frenchette.md) (direction, hero `panneaux-biais`, section `services/panneaux-biais`, modèle ; essai avec
  photos ≤ 0,57 partout, [aperçu](apercus/2026-10-29-frenchette.jpg)) ; [casabonay](styles/casabonay.md) (direction, hero
  `mur-de-photos`, modèle), appliqué à anna-vidal.
- **Paire corrigée** : anna-vidal / borie-des-chenes 0,81 / 0,75 / 1,00 → 0,22 / 0,21 / 0,52 ([aperçu](apercus/2026-10-29-paire.jpg)).
- Démos : demo-osteopathe (profils-patients, style ducksoup), demo-brasserie (revendeurs-secteurs puis experimentalcc).

**Ressemblance** : 263 → **277 paires** (45 premier écran, 252 déroulé). Le compte monte parce que le score de déroulé compte pour
moitié le modèle de site (« longue page à ancres, 4 pages et plus, même longueur »), que presque tous les sites partagent : la
brasserie, au premier écran unique, reste à 0,78 de 9 sites par ce seul critère. **Le score de déroulé ne mesure plus ce qu'on
veut** : à recalibrer (prochain tour, avant toute nouvelle paire).

**Proposé** : recalibrer le déroulé de `ff ressemblance` ; `ff photos-demo` relancé efface `raw/` (à corriger) ; les architectures
récentes (revendeurs, profils, salles…) ont toutes la même grammaire (onglets, listes) : leur donner une construction propre, comme
les styles ; mettre à jour le texte de la routine (encore « 10 sites, 5 gardés »).

**À décider** : la brasserie (Experimental) et anna-vidal (Casa Bonay) tiennent-elles la comparaison à vos yeux ?

## 28 oct 2026, tour 15 (routine en ligne, soir) : 11 styles, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-28-c.jpg)) : l'architecture `profils-patients`, le site d'un cabinet de santé
qui part du patient (« Vous consultez pour » : un onglet par profil, nourrisson, femme enceinte, sportif, avec motifs, durée,
prix, praticien et rendez-vous, puis la séance en étapes, le remboursement, les praticiens). Pourquoi elle : c'est la question
que se pose un parent ou une femme enceinte avant d'appeler un ostéopathe, et l'usine n'avait aucune architecture de soin.

**Fait**
- Santé : `npm ci`, Chromium de Playwright (`FF_CHROMIUM=1`), tout a tourné avec navigateur. Tests : 78 fichiers, tous verts
  en fin de tour. `ff atomes` vert.
- **Styles (2a quater)** : deux agents (a à l, m à z), environ 110 domaines sondés. **11 gardés**, chacun essayé
  (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source : sombre `experimentalcc` (noir, serif fine,
  nom en exclusion), `wiltons` (vert anglais et crème, Garamond), `marsano` (fleuriste noir, mosaïque bord à bord) ; clair teinté
  doux `esters` (feuille rosée sur sable), `ducksoup` (pêche et bleu pétrole), `pellicano` (rose poudré, machine à écrire) ;
  coloré doux `fabrique` (crème et chocolat, tout en chasse fixe), `casabonay` (sable, outremer, mur de photos), `frenchette`
  (crème et menthe Art déco), `paradero` (sable, brique, pied bordeaux), `statebird` (crème, sauge, lavande). Lignes et écartés :
  [styles/INDEX.md](styles/INDEX.md) et les fiches.
- Palettes par régime, avant → après : clair neutre 102 → 102, clair teinté doux 28 → 31, sombre 33 → 36, coloré doux 54 → 59.
- **Mouvement** : 2 profils nouveaux ([MOUVEMENTS.md](styles/MOUVEMENTS.md), 41 profils, aussi dans `scripts/ff/mouvements.mjs`) :
  `nom-en-exclusion` (Experimental Cocktail Club : le nom géant en `mix-blend-mode: exclusion` glisse au tiers de la vitesse sur
  le portrait vertical) et `photo-qui-se-pose` (Paradero : la photo d'un grand panneau entre à 1,04 et se pose à 1 au défilement,
  le texte monte de 24 px ; deux panneaux par page au plus).
- **Architectures (2a ter)**, codées et prouvées le même tour : [revendeurs-secteurs](architectures/revendeurs-secteurs.md)
  (brasseriedesgarrigues.fr, brasserie-bendorf.fr ; coquille `revendeurs`, champ `revendeurs`, « où trouver nos produits » par
  secteur et commune, filtre « Chez qui ? », vente sur place, consigne, `/ou-trouver`, `/ou-trouver/<secteur>`) et
  [profils-patients](architectures/profils-patients.md) (osteopathe-lyon.fr, osteopathe-annecy.fr ; coquille `profils`, champ
  `profils`, `/consulter`, `/consulter/<slug>`). `ff ressemblance` contre tous les sites : revendeurs au plus 0,56 / 0,56 / 0,60,
  profils au plus 0,64 / 0,54 / 0,58 (téléphone / ordinateur / déroulé, seuil 0,65) ; entre elles 0,79 au déroulé (métiers sans
  recoupement : jamais en pistes sœurs). Jetables vérifiés (`verifier` hors données de test, `a11y`, `typo`, `ia`) et supprimés.
  Tests : `tests/architectures-producteurs.test.mjs`. Au passage, `navLinks` ne met plus de lien « Avis » vers une section de
  preuves vide (ancre `/#proof` sans cible sur un site sans avis).
- **Marché (2a)** : 9 sites de plus (agences de Perpignan, Toulouse, Toulon : béton imprimé, tailleur de pierre, menuisier ;
  Google : couvreur à Paris, ferronnier près d'Annecy, électricien à Besançon ; modèles Framer électricien, Wix forestier,
  ThemeForest domaine viticole). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) : 135 sites. Aucun levier à 40 % absent de l'usine ;
  les labels atteignent 40,0 % (l'usine les a, jamais au premier écran : 11 % des sites les y mettent, à surveiller). Le plus
  vendeur : Menuisia à La Crau (barre haute adresse, numéro, horaires et note Google ; métier et villes dans le h1 ; « depuis
  1955 », garantie, gérant nommé, avis datés). Nouveaux contre-leviers : premier écran réduit au logo ; 3 avis inventés affichés
  quand 32 vrais existent sur Google (RMS) ; traceurs Google avant consentement sur 4 des 6 sites réels.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé,
21 les deux), aucun site n'ayant changé ; pires : anna-vidal / borie-des-chenes, chez-malo / studio-ambre. Signalé, pas corrigé.

**Proposé**
- `ff demonter` / `ff atomes mesurer` : refuser les cookies et fermer les fenêtres (choix de ville, inscription) avant capture et
  mesure (les deux agents ont encore refait 6 captures à la main) ; attendre la fin d'un écran de chargement (wiltons) ; nom en
  image : ne pas prendre un texte de 14 px pour le h1 ; ignorer la bannière cookies pour les ombres.
- `ff melanger --essai` : appliquer la famille de premier écran tirée (jamais appliquée sur les 11 essais), accepter un style à
  fond vidéo sans `--video` pour l'essai, une démo avec de vraies photos ; amplitude réglable de `data-reveal="up"` (24 px).
- Un champ pour le titre de métier du gérant (Maître artisan, Meilleur ouvrier, WorldSkills : 3 sites sur 9 ce tour).
- Architectures encore absentes : vétérinaire (urgences, par espèce), avocat (domaines, honoraires), garage (forfaits, atelier).

**À décider** : les 11 styles (`ff melanger <slug> --style wiltons`) ; `revendeurs-secteurs` pour un brasseur, vigneron, cidrier
ou fromager vendu en dépôts ; `profils-patients` pour un ostéopathe, kiné ou sage-femme (osteo-marchand pourrait en profiter) ;
les paires trop proches.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 28 oct 2026, tour 14 (routine en ligne, matin) : 12 styles, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-28-b.jpg)) : l'architecture `salles-capacites`, le site d'un lieu de réception
qui part du nombre d'invités (« Combien serez-vous ? » : le tableau des salles et de leurs capacités assis, cocktail, théâtre,
les salles qui conviennent marquées en mots, puis chaque salle en photo, les couchages, le traiteur, l'option sur la date).
Pourquoi elle : c'est la première question d'un couple ou d'une entreprise, et la source (Domaine de la Touche) la noie dans
des phrases.

**Fait**
- Santé : `npm ci`, Chromium de Playwright (`FF_CHROMIUM=1`), tout a tourné avec navigateur. Tests : 77 fichiers, tous verts
  (un fumigène tombé pendant un build simultané d'un agent, repassé seul). `ff atomes` vert.
- **Styles (2a quater)** : deux agents (domaines a à l, m à z), plus de 350 domaines sondés. **12 gardés**, chacun essayé
  (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source : sombre `andersonsheppard` (tailleur,
  bordeaux noir), `kinlochlodge` (verts de tourbe), `dante` (noir et crème, cadres à double filet), `cosme` (sang-de-bœuf, nom
  vertical en marge), `schofields` (pétrole et turquoise) ; clair teinté doux `frances` (kraft et Garamond) ; coloré doux
  `fitzjohns` (store rayé sable rosé), `tubaclub` (sable et jaune), `rochechouart` (ivoire et bordeaux Art déco), `marou`
  (olive et brique), `sebastiengaudard` (or gravé), `rowenandwren` (brun rosé). Lignes et écartés : [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : clair neutre 102 → 102, clair teinté doux 27 → 28, sombre 28 → 33, coloré doux 48 → 54.
- **Mouvement** : 2 profils nouveaux ([MOUVEMENTS.md](styles/MOUVEMENTS.md), 39 profils) : `annonce-qui-defile` (Hôtel
  Rochechouart : rien n'entre, une bande sous le premier écran fait défiler l'annonce du moment, champ `annonce` ; manque la
  variante défilante d'`Annonce.astro`) et `nom-en-marge` (Cosme : le nom géant vertical fixe en marge, calme, poids nul).
- **Architectures (2a ter)**, codées et prouvées le même tour : [salles-capacites](architectures/salles-capacites.md)
  (domainedelatouche.fr, domainedelachanterelle.fr ; coquille `salles`, champ `salles`, `/salles`, `/salles/<slug>`) et
  [annonces-biens](architectures/annonces-biens.md) (royal-immo.fr, giboire.com ; coquille `biens`, champ `biens`, vitrine
  Acheter / Louer, « Faire estimer votre bien », `/biens/<slug>` avec DPE et GES en échelle et qui paie les honoraires,
  `/honoraires` ; une mention d'annonce obligatoire absente est signalée au build, jamais remplie). `ff ressemblance` contre tous
  les sites : salles au plus 0,56 / 0,56 / 0,44, biens au plus 0,46 / 0,44 / 0,62 (téléphone / ordinateur / déroulé, seuil
  0,65) ; entre elles 0,73 au déroulé (métiers sans recoupement : jamais en pistes sœurs). Jetables vérifiés (`verifier` hors
  données de test, `a11y`, `ia`) et supprimés. Tests : `tests/architectures-reception.test.mjs`.
- **Marché (2a)** : 9 sites de plus (agences de Marseille, Nice, Reims : miroitier, élagueur, restaurant ; Google : architecte
  d'intérieur à Amiens, serrurier au Mans, brasserie près de Toulouse ; modèles Framer lavage auto, Squarespace camp d'enfants,
  ThemeForest restaurant). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) : 126 sites. Aucun levier à 40 % absent de l'usine (le
  formulaire sur l'accueil repasse à 38,9 %). Le plus vendeur : Speed'Depan, serrurier au Mans (« 7j/7, 8 h à 23 h, devis
  gratuit » en barre haute, métier et ville dans le h1, le numéro écrit sur le bouton, 120 avis). Nouveau contre-levier : des avis
  aux prénoms génériques identiques d'un site à l'autre (3 sites réels sur 6), invérifiables.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé,
21 les deux), aucun site n'ayant changé ; pires : anna-vidal / borie-des-chenes (0,81 / 0,75 / 1,00), chez-malo / studio-ambre
(0,87 / 0,91). Signalé, pas corrigé.

**Proposé**
- `ff demonter` / `ff atomes mesurer` : refuser d'un clic les cookies (Axeptio) et fermer les fenêtres d'inscription avant la
  capture (les deux agents ont refait leurs captures à la main) ; cliquer une porte d'âge nommée sans accepter de traceurs ;
  ignorer le premier écran pour les marges, les pistes de carrousel pour le conteneur, la bannière cookies pour les rayons ;
  prendre le vrai titre affiché plutôt qu'un « MENU » ou « ENTER » ; plantage sur mobhotel (« .for is not iterable »).
- `ff melanger --essai` : montrer le mouvement, appliquer la famille de premier écran, refuser `plein-cadre` sans photo de
  1 600 px, vérifier lui-même qu'il ne laisse aucune copie ; une démo avec de vraies photos pour les essais.
- Un token de motif (rayures de store de fitzjohns) ; la variante défilante d'`Annonce.astro` ; le flux du logiciel d'agence
  pour `annonces-biens` au-delà de trente biens.

**À décider** : les 12 styles (`ff melanger <slug> --style cosme`) ; `salles-capacites` pour un domaine, une grange ou une salle
de réception ; `annonces-biens` pour l'agence immobilière de quartier (métier 26 de `OBJECTIF.md`, Toulon) ; les paires trop
proches.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 28 oct 2026, tour 13 (routine en ligne) : 11 styles, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-28.jpg)) : l'architecture `appareils-pannes`, le site d'un réparateur à
domicile qui part de l'appareil en panne (un onglet par famille avec son forfait, les pannes dites comme au téléphone, le numéro
en haut). Pourquoi elle : c'est exactement la question du client au téléphone (« ma machine ne vidange plus »), et ni la
bibliothèque ni les 17 architectures ne savaient y répondre.

**Fait**
- Santé : `npm ci`, Chromium de Playwright, tout a tourné avec navigateur. Tests : 76 fichiers, tous verts, avant et après le tour.
  `ff atomes` vert, `_exemple` construit.
- **Styles (2a quater)** : deux agents (domaines a à l, m à z), environ 280 domaines sondés. **11 gardés**, chacun essayé
  (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source : sombre `boccadilupo` (trattoria, bordeaux et
  crème), `hotelsanders` (vert bouteille et or, vidéo exigée) ; clair teinté doux `chateauvoltaire` (crème et encre noire, photos en
  arche), `pastamansi` (farine, une seule mono, silhouettes de pâtes), `outofthevalley` (lichen et charbon, une phrase par écran) ;
  coloré doux `linastores` (menthe et store rayé), `fogoislandinn` (brume et marine), `rebeccaatwood` (blocs bleu, pêche, sauge),
  `thecuppingroom` (crème et rouille) ; clair neutre `barkumiko`, `redclay`. Fiches et écartés (orrisparis : fenêtre bloquante,
  mosshotel : signes IA, ynyshir : écran de chargement…) : [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : clair neutre 85 → 87, clair teinté doux 23 → 26, sombre 25 → 27, coloré doux 44 → 48.
- **Mouvement** : 3 profils nouveaux ([MOUVEMENTS.md](styles/MOUVEMENTS.md), 37 profils) : `silhouettes-en-fond` (Pasta Mansi),
  `bandeau-des-adresses` (Red Clay, quatre vrais lieux de vente exigés), `bloc-qui-s-avance` (Bar Kumiko, déclenché par classe,
  tient sur iPhone ; attribut `data-avance` à écrire dans le moteur).
- **Architectures (2a ter)**, codées et prouvées le même tour : [appareils-pannes](architectures/appareils-pannes.md) (satisfix.fr,
  lavoiserie.fr ; coquille `appareils`, champ `appareils`, `/appareils`, `/appareils/<slug>`) et
  [commande-retrait](architectures/commande-retrait.md) (riedoasis.fr, autempsdelasource.fr ; coquille `retrait`, champ `retrait`,
  « commandez avant mardi 12 h, retirez jeudi » avec la prochaine clôture calculée dans le navigateur, points de retrait par jour,
  `/retrait`, `/retrait/<slug>`). `ff ressemblance` contre tous les sites : appareils 0,60 / 0,54 / 0,55, retrait 0,57 / 0,55 /
  0,63 (téléphone / ordinateur / déroulé, seuil 0,65). Jetables vérifiés (`verifier` hors données de test, `a11y`, `ia`) et supprimés.
- **Marché (2a)** : 9 sites de plus (agences d'Amiens, Clermont-Ferrand, Le Mans : constructeur bois, rénovation, fromagerie ;
  Google : tatoueur à Nice, garage au Mans, électricien près de Strasbourg ; modèles Framer plombier, Squarespace restaurant,
  ThemeForest cabinet médical). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) : 117 sites. Le formulaire sur l'accueil passe 40 % (40,2 %),
  déjà fait par l'usine : aucun levier à 40 % absent. Le plus vendeur : L'Atelier du Fromage au Mans (la gérante et deux employés
  nommés et racontés, photos d'un photographe, 4,9 sur 124 avis, appel toujours à portée).

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé,
21 les deux), aucun site n'ayant changé ; pires : anna-vidal / borie-des-chenes (0,81 / 0,75 / 1,00), chez-malo / studio-ambre
(0,87 / 0,91). Signalé, pas corrigé.

**Proposé**
- `ff demonter` et `ff atomes mesurer` : fermer les fenêtres d'inscription (`--fermer`), remonter en haut avant la capture
  (outofthevalley capturé en pied), attendre la fin d'un écran de chargement (Electribel), agent utilisateur récent (hotelsanders).
- `ff atomes mesurer` : ignorer le premier écran pour la taille du texte et les marges, les pistes de carrousel pour le conteneur,
  la bannière cookies pour les rayons ; refuser une lecture sans couleurs (« relancer »).
- Une commande `ff sonder <url…>` (fond dominant, polices, pilules, couches fixes) : les deux agents ont réécrit la même sonde.
- Une démo avec de vraies photos pour les essais de style (demo-boulangerie n'en a pas : arches et mosaïques invisibles), et
  `--essai` qui applique la famille de premier écran du style.
- WhatsApp au premier écran avec message prérempli, une phrase par personne de l'équipe (vus une fois chacun au marché).

**À décider** : les 11 styles (`ff melanger <slug> --style chateauvoltaire`) ; `appareils-pannes` pour un réparateur
d'électroménager, de chaudière ou de vélo ; `commande-retrait` pour un maraîcher, éleveur ou fromager en vente directe ; les paires
trop proches.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 27 oct 2026, tour 12 (routine en ligne, soir) : 10 styles, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-27-c.jpg)) : l'architecture `estimation-etapes`, la demande d'estimation
en trois étapes (le projet, les questions, les coordonnées) juste sous le titre, le téléphone toujours en haut. Pourquoi elle :
c'est ce qu'un déménageur, un couvreur ou un paysagiste veut recevoir, et le levier revenait sur le marché (Movers, Rigoulet).

**Fait**
- Santé : `npm ci`, Chromium de Playwright (`FF_CHROMIUM=1`), tout a tourné avec navigateur. `ff atomes` rouge au départ (quatre
  mesures aberrantes de la collecte automatique : `dominiqueansel`, `maisonbertaux`, `squaremilecoffee` mesure > 140 caractères,
  `sadelle` conteneur 580 px) : remises à « à juger », et corrigé à la source : `ff atomes mesurer` laisse lui-même « à juger » une
  mesure hors des bornes du registre (`borne`, test dans `tests/atomes.test.mjs`). `ff melanger --essai --style <id>` nomme ses
  copies et sa planche d'après le style (`_essai-<id>-1`, `<slug>-<id>-melanges.jpg`) : deux essais ne s'écrasent plus.
  Tests : 75 fichiers, tous verts (le dernier paquet de 40 manque de mémoire : passé par paquets de 5).
- **Styles (2a quater)** : deux agents (domaines a à l, m à z), plus de 400 domaines sondés, une soixantaine démontés. **10 gardés**,
  chacun essayé (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source : sombre `bubala` (restaurant,
  olive, bleu canard, crème), `hotelducouvent` (noir, vidéo par chapitre, jaune soleil), `tipo00` (ardoise et cuivre, une serif) ;
  coloré doux `deyrolle` (papier, vert d'eau, bleu nuit), `hotelpeterandpaul` (jaune paille, vert bouteille, filets aux coins
  creusés), `wingonwoand` (porcelaine, pêche, rouille), `nopa`, `tusk`, `uchi` ; clair teinté doux `corapearl` (rose poudré).
  Aucun clair neutre. Fiches, lignes et écartés : [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : clair neutre 85 → 85, clair teinté doux 22 → 23, sombre 22 → 25, coloré doux 38 → 44.
- **Mouvement** : 2 profils nouveaux ([MOUVEMENTS.md](styles/MOUVEMENTS.md), 34 profils) : `citation-en-fondu` (Cora Pearl, photo
  et citation de presse en fondu de 1,5 à 2 s, sans rotation automatique, deux vraies citations avec photo exigées) et
  `filet-qui-se-trace` (Wing On Wo, filet de 3 px tracé sous chaque titre en 1,2 s).
- **Architectures (2a ter)**, codées et prouvées le même tour : [estimation-etapes](architectures/estimation-etapes.md) (modèle
  Framer Movers, Déménagements Rigoulet, Les Artisans du Bâtiment ; coquille `estimation`, champ `estimation`, `/estimation`,
  `?projet=<slug>` depuis chaque prestation, `ContactForm` en étapes, tout visible sans script) et
  [formules-comparees](architectures/formules-comparees.md) (Micka photographe, modèle Framer Greencraft ; coquille `formules`,
  champ `formules`, piste au doigt au téléphone, `/formules` comparé en mots jamais en coches, `/formules/<slug>` avec la demande
  réglée). `ff ressemblance` contre tous les sites : estimation 0,50 / 0,62 / 0,64, formules 0,59 / 0,49 / 0,64 (téléphone /
  ordinateur / déroulé, seuil 0,65 : de justesse au déroulé). `ff verifier`, `ff a11y`, `ff ia` verts sur les jetables, supprimés.
- **Marché (2a)** : 9 sites de plus (agences d'Angers, Strasbourg, Paris : dépôt-vente auto, clés auto, rénovation ; Google :
  institut à Nice, fleuriste à Angers, boulangerie à Metz ; modèles Framer plombier, Wix paysagiste, Squarespace colonie).
  [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) : 108 sites. Aucun levier à 40 % absent de l'usine (formulaire sur l'accueil 39,8 %,
  labels 38,9 %). Le plus vendeur : Point Auto (métier et ville dans le h1, « Estimer ma voiture gratuitement », réassurance sous
  les boutons, ses vraies voitures, depuis 2019).

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé,
21 les deux), aucun site n'ayant changé. Signalé, pas corrigé.

**Proposé**
- `ff demonter` : attendre le chargement complet (Opa Clé Auto, Institut Paradiso capturés avant dessin), ne pas compter un menu
  caché comme couche bloquante (Bubala), défiler une page qui défile dans un conteneur (ahotels).
- `ff atomes mesurer` : marges de section faussées par le premier écran ou un menu ouvert (Bubala, Tipo 00, Tusk, Uchi), corrigées
  à la main.
- `ff melanger --style` : appliquer la famille de premier écran de l'atome (tirée « objet-du-metier, non appliqué » sur les dix).
- Direction `huile` : contraste insuffisant sur le pied `big-name` et le bandeau d'appel des pages service (`text-on-ink/70`).
- `ff ressemblance` : les deux nouvelles architectures passent de justesse au déroulé ; à revoir avec de vraies photos.

**À décider** : les 10 styles (`ff melanger <slug> --style tipo00`) ; `estimation-etapes` pour le premier déménageur, couvreur
ou paysagiste ; `formules-comparees` pour un photographe, jardinier d'entretien, auto-école (jamais avec `atelier-par-colis` en
pistes sœurs : même défilement horizontal) ; les paires trop proches.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 27 oct 2026, tour 11 (routine en ligne, matin) : 10 styles, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-27-b.jpg)) : l'architecture `planning-semaine`, un site d'école dont
l'accueil est le planning de la semaine (le jour même ouvert, un filtre par discipline, l'appel et le cours d'essai en haut).
Pourquoi elle : ce que cherche le client d'une école de danse, de yoga ou de sport, c'est « quel cours, quel soir », et la
source (Ell'Zi-Danse) le cache sous un texte et une bannière de cookies.

**Fait**
- Santé : `npm ci`, Chromium de Playwright (`FF_CHROMIUM=1`), tout a tourné avec navigateur. `ff atomes` était rouge au départ
  (quatre brouillons de la collecte automatique du 27 oct : `balthazarny`, `bistrotvivienne`, `hkliving`, `wastberg`, mesures
  de largeur, d'interlignage et de courbe aberrantes) : remis à « à juger », registre vert. Le défaut vient de
  `ff atomes mesurer` (mesure relevée sur des noms de produits, conteneur relevé sur une piste de carrousel) : proposé ci-dessous.
- **Styles (2a quater)** : deux agents en parallèle, environ 260 domaines sondés (httpster par sa liste JSON filtrée sur la
  couleur, minimal.gallery, onepagelove ; Awwwards injoignable, siteinspire et Framer en 429). **10 gardés**, chacun essayé
  (`ff melanger <démo> --style <id> --essai`) et posé à côté de la source : `choosingkeeping` (papeterie), `archivistgallery`
  (papeterie typographique), `bourkestreet` (boulangerie), `sarahraven` (grainetière), `mariongraux` (potière) en clair teinté
  doux ; `feldspar` (porcelaine), `saipua` (fleuriste et savonnerie), `pistils` (pépinière) en coloré doux ; `couteauxdeva`
  (coutelier), `studiomondine` (fleuriste événementiel) en sombre. Fiches, lignes et écartés : [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : clair neutre 85 → 85, clair teinté doux 17 → 22 (**plus de besoin**), sombre 20 → 22,
  coloré doux 33 → 36.
- **Mouvement** : 4 profils nouveaux ([MOUVEMENTS.md](styles/MOUVEMENTS.md), 32 profils, `scripts/ff/mouvements.mjs`) :
  `legende-fixe-qui-change` (Studio Mondine), `photo-qui-s-approche` (Marion Graux), `legende-qui-se-leve` (Couteaux Deva),
  `volet-a-l-entree` (Bourke Street, deux photos au plus, jamais suivi d'un zoom). Vu et refusé : le préchargeur animé
  d'Archivist (rideau d'ouverture, GOUT § 2).
- **Architectures (2a ter)**, codées et prouvées le même tour : [planning-semaine](architectures/planning-semaine.md) (Danse
  Germain Blanchet à Rouen, Ell'Zi-Danse à Saintes ; coquille `planning`, champ `planning`, `/planning`, créneaux sur la page
  de chaque discipline, `src/lib/planning.ts`) et [catalogue-location](architectures/catalogue-location.md) (Location Service à
  Mulhouse, Deslandes Motoculture ; coquille `location`, champ `location`, `/materiel`, `/materiel/<slug>`, prix par durée,
  caution, bascule particulier TTC / pro HT en CSS seul, recherche d'outil). `ff ressemblance` contre tous les sites : planning
  0,59 / 0,54 / 0,55, location 0,61 / 0,62 / 0,56 (téléphone / ordinateur / déroulé, seuil 0,65). Entre elles 0,73 au
  déroulé : jamais deux pistes d'un même client. Deux corrections au passage : la page 404 ne pointe plus vers `/#contact`
  sans porte de contact ; `ff verifier` n'exige plus d'anti-robots sur un formulaire de recherche. `ff verifier`, `ff a11y`,
  `ff ia` verts sur les jetables, supprimés.
- **Marché (2a)** : 9 sites de plus (menuisier-agenceur en Savoie, déménageur dans le Gard, fromagerie en Haute-Vienne via
  des agences ; coach sportif à Rennes, avocat à Amiens, photographe au Mans classés sur Google ; modèles Framer Movers, Wix
  couvreur, ThemeForest barbier). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) : 99 sites. Aucun levier à 40 % absent de l'usine.
  Le plus vendeur : le coach Marius Aholou (lui en photo sous « Coach sportif à Rennes », le crédit d'impôt avec un exemple
  chiffré, 54 pages dont 19 communes). Nouveau : formulaire d'estimation en étapes au premier écran (Movers), témoignages vidéo.
- Tests : 73 fichiers, tous verts.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé,
21 les deux), aucun site n'ayant changé ; pires : anna-vidal / borie-des-chenes (0,81 / 0,75 / 1,00), chez-malo / studio-ambre
(0,87 / 0,91), demo-informatique / fromagerie-ravanel-d (déroulé 0,90), prospect-ballay-macon / prospect-epi-dor (déroulé
0,89). Signalé, pas corrigé.

**Proposé**
- `ff atomes mesurer` : refuser lui-même une mesure hors bornes et écrire « à juger » (quatre brouillons cassaient le registre).
- `ff melanger --essai` : nommer la copie et la planche d'après le style (`_essai-<id>`), pour que deux essais puissent tourner
  ensemble sans s'écraser.
- `ff demonter` : fermer ou masquer la bannière de cookies sur la planche (Archivist, Deva), défiler à la molette quand la page
  défile dans un conteneur (Deva, Saipua).
- Une famille de premier écran « titre posé sur photo plein cadre » : quatre styles du tour sont rangés en `carte-sur-photo`
  faute de mieux, et 16 anciens atomes citent un id `plein-cadre` qui n'existe pas dans `premiers-ecrans.md`.
- Le déclencheur `data-legende` dans le moteur pour `legende-fixe-qui-change`.
- Un formulaire d'estimation en deux étapes au premier écran pour les déménageurs, couvreurs, paysagistes (Movers).

**À décider** : les 10 styles (`ff melanger <slug> --style couteauxdeva`) ; planning-semaine pour la première école de danse,
yoga, arts martiaux, salle ; catalogue-location pour un loueur de matériel ou de motoculture ; les paires trop proches.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 27 oct 2026, tour 10 (routine en ligne, nuit) : 7 styles, 2 architectures

**Le meilleur du tour** ([aperçu](apercus/2026-10-27.jpg)) : l'architecture `avant-apres`, un site d'atelier fait de ses
pièces restaurées, chacune en curseur avant / après qu'on tire au doigt. Pourquoi elle : la transformation est ce qui fait
signer un tapissier, un ébéniste ou un carrossier, et aucun site de l'usine ne la montrait. Depuis ce jour, chaque tour
finit par cette image (`ff apercu`, `/veille` § 4 bis, demande du fondateur).

**Fait**
- Santé : `npm ci`, Chromium de Playwright (`FF_CHROMIUM=1`), tout a tourné avec navigateur. Tests : 71 fichiers, tous verts
  (trois tests anciens réalignés sur le nouveau comportement : durée dans la carte, ancres de la page d'une pièce, index des
  réalisations).
- **Styles (2a quater)** : collecte commencée par le régime en besoin (clair teinté doux), deux agents en parallèle, plus de
  150 domaines sondés. **7 gardés sur 10 visés** : `rosslyn`, `poterieravel`, `antoinettepoisson` (clair teinté doux),
  `shiptonmill` (coloré doux), `morito`, `thenewcraftmaker`, `hotellesrochesrouges` (clair neutre). Chacun essayé sur une
  démo (`ff melanger <démo> --style <id> --essai`) et posé à côté de la source. Il en manque 3 : une cinquantaine de crèmes
  vues tombent sous le seuil de chroma (0,012) ou sont des voiles sur blanc, une dizaine de sites ont une fenêtre bloquante,
  Awwwards est injoignable et siteinspire refuse (429). Fiches, lignes et écartés : [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : clair neutre 82 → 85, clair teinté doux 14 → 17 (toujours en besoin : 20 au moins),
  sombre 20 → 20, coloré doux 32 → 33.
- **Mouvement** : 1 profil nouveau sur 2 visés, `deuxieme-vue-au-survol` (Poterie Ravel : la photo du produit cède la place
  à une seconde vue en fondu de 0,5 s au survol ; calme, tirable ; [MOUVEMENTS.md](styles/MOUVEMENTS.md), 28 profils). Vu et
  refusé : la photo qui pivote de 3° à l'apparition (Antoinette Poisson), c'est la vignette inclinée de GOUT § 2.
- **Essai de mélanges** (`ff melanger _exemple --n 3 --hasard --essai`, planche regardée) : aucun mélange laid, pas de règle
  nouvelle. Un défaut vu : au téléphone, coquille `cadre`, le nom en capitales serif passe sous le bouton « Prendre
  rendez-vous » de la barre (essai m-d7d0e7). À corriger dans la nav (proposé ci-dessous).
- **Architectures (2a ter)**, codées et prouvées le même tour : [carte-des-soins](architectures/carte-des-soins.md) (Institut
  La Douce Heure, Saint-Sébastien-sur-Loire : le site d'un institut est sa carte ; l'usine la range par le temps qu'on a,
  « Combien de temps avez-vous ? » en onglets de durée, chaque soin avec sa famille, sa durée, son prix et Réserver ; coquille
  `soins`, `services[].lignes[].duree`) et [avant-apres](architectures/avant-apres.md) (Assise Autrement, tapissière à
  Joinville-le-Pont, + La Petite Remise, atelier.b : l'accueil est le mur des pièces transformées, un curseur avant / après
  par pièce qu'on tire au doigt, rangées par type en onglets ; coquille `avant-apres`, `realisations[].avant`,
  `src/components/Comparer.astro`, curseur aussi en tête de `/realisations/<slug>`). `ff ressemblance` contre tous les sites :
  soins 0,50 / 0,57 / 0,61, avant-apres 0,58 / 0,38 / 0,62 (téléphone / ordinateur / déroulé, seuil 0,65). Deux essais
  refusés au déroulé avant de passer (voir les fiches). `ff a11y`, `ff ia` verts ; jetables supprimés.
- **Marché (2a)** : 9 sites de plus (agences de Lille, Nantes, Montpellier ; menuisier à Rennes, ferronnier près du Mans,
  garage à Aix ; modèles Framer, Wix, Squarespace). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) : 90 sites. Aucun levier à 40 %
  absent de l'usine (« labels et certifications » atteint 40 %, mais l'usine les a). Le plus vendeur : Colson Elec
  (électricien en Vendée : métier et villages dans le h1, depuis 1998, note AlloVoisins au-dessus du titre, barre Devis /
  Appeler, 38 pages). Nouveau : la note vient souvent d'ailleurs que de Google (AlloVoisins, mestravaux), et l'usine ne sait
  afficher qu'une note Google.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé,
21 les deux), aucun site n'ayant changé ; pires : anna-vidal / borie-des-chenes (0,81 / 0,75 / 1,00), chez-malo / studio-ambre
(0,87 / 0,91), demo-informatique / fromagerie-ravanel-d (déroulé 0,90), prospect-ballay-macon / prospect-epi-dor (déroulé
0,89). Signalé, pas corrigé.

**Proposé**
- Une note d'avis d'une autre plateforme que Google (`proof.note` : plateforme, note, nombre, lien), vue sur les deux sites
  les plus vendeurs du tour.
- La nav au téléphone : réduire le nom ou passer le bouton sous le menu quand ils se chevauchent (coquille `cadre`).
- Un champ « seconde photo » par service ou produit pour rendre `deuxieme-vue-au-survol` réalisable.
- Collecte : chercher les crèmes à pied clair dans les boutiques de papeterie, céramique, café (les trois gardés du tour).

**À décider** : les 7 styles (`ff melanger <slug> --style rosslyn`) ; carte-des-soins pour le premier institut, masseur ou
barbier à prestations minutées ; avant-apres pour un tapissier, ébéniste restaurateur, carrossier, rempailleur ; les paires
trop proches.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 26 oct 2026, tour 9 (routine en ligne, soir) : 11 styles, 2 architectures

**Fait**
- Santé : `ff atomes` était rouge sur `main` (10 brouillons de la collecte refusés par le validateur : `photos.traitement`
  « à juger » sous un atome photos posé, densités à `null`, interlettrage hors bornes). Corrigé à la source : le validateur
  accepte un traitement « à juger » (photos alors non tirables, comme le disait déjà `tirables`), `ff atomes mesurer` écrit
  « à juger » au lieu de `null`. Les prochaines collectes ne casseront plus le registre. Chromium de Playwright, `FF_CHROMIUM=1`.
- **Styles (2a quater)** : collecte commencée par le régime en besoin (clair teinté doux), ~90 domaines sondés (Awwwards
  injoignable, siteinspire en 429, liste de httpster), 12 relevés, chacun essayé sur une copie de `demo-boulangerie` et posé à
  côté de la source. **11 gardés** : `landrace`, `paloroma`, `loomrugs`, `here` (clair teinté doux) ; `brae`, `sebastiancox`,
  `eraceramics`, `marram`, `handsomebrook`, `thyme` (coloré doux) ; `nishiyama` (clair neutre). Écarté : laylabakery (un écran
  sous une fenêtre d'inscription). Fiches et écartés dans [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : clair neutre 81 → 82, clair teinté doux 10 → 14 (toujours en besoin : 6 crèmes de plus
  sont rangées en « coloré doux » par leur pied ou bandeau coloré, relevés tels quels), sombre 20 → 20, coloré doux 26 → 32.
- **Mouvement** : 2 profils nouveaux ([MOUVEMENTS.md](styles/MOUVEMENTS.md), 27 profils) : `photos-a-plusieurs-vitesses`
  (Brae, Marram : chaque photo glisse à sa vitesse, 0,07 à 0,12 px par px défilé) et `photos-qui-flottent` (Nishiyama :
  tissus détourés qui flottent de 10 px en boucle ; pas encore tirable, faute de survol mesuré).
- Tests : 70 fichiers, 1 126 tests, tous verts.
- **Règle apprise** (ATOMES.md § Règles apprises, `echelleH2` testée dans `melanger.mjs`) : h2 plus grand que le h1 (Handsome
  Brook) ou de la taille du texte (deux mélanges au hasard sur `_exemple`) ; le h2 est tenu entre 1,33 × texte et 0,75 × h1.
  Vérifié au second essai.
- **Architectures (2a ter)**, codées et prouvées le même tour : [grille-urgence](architectures/grille-urgence.md) (serrurier,
  Paris 16e : le site est sa grille de prix, une situation par onglet, prix par créneau avec « En ce moment », délais par secteur ;
  coquille `grille`, `/tarifs` ; première architecture pour les métiers d'urgence) et [atelier-par-colis](architectures/atelier-par-colis.md)
  (cordonnier d'Albertville : deux portes « Venir à l'atelier » / « Envoyer par colis », voyage du colis en piste horizontale ;
  coquille `colis`, `/envoyer`). `ff ressemblance` : grille 0,60 / 0,49 / 0,62, colis 0,63 / 0,59 / 0,64 (téléphone / ordinateur /
  déroulé, seuil 0,65 ; colis de justesse, à ne pas donner à un client sans photos). `ff verifier` vert sur les jetables, supprimés.
- **Marché (2a)** : 9 sites de plus (agences de Lyon, Le Havre, Paris ; Google : menuisière à Échirolles, restaurant au Mans,
  ostéopathe à Nîmes ; modèles Framer Solshine, Wix HandyPro, Squarespace Aurora). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) : 81 sites.
  Aucun levier à 40 % ou plus absent de l'usine. Le plus vendeur : l'ostéopathe de Nîmes (métier et ville, numéro, Doctolib, une
  page par public, tarif écrit) mais son lien d'appel est `tel:O766…` (lettre O) : l'appel ne part pas.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé,
21 les deux), aucun site n'ayant changé ; pires : anna-vidal / borie-des-chenes (0,81 / 0,75 / 1,00), chez-malo / studio-ambre
(0,87 / 0,91), demo-informatique / fromagerie-ravanel-d (déroulé 0,90). Signalé, pas corrigé.

**Proposé**
- Vérifier le format du téléphone (`contact.phone` est une chaîne libre : un `tel:O7…` passerait) dans `ff verifier`.
- Collecte crèmes à pied clair (il manque 4 à 5 palettes clair teinté doux).
- Un champ « financement » (3 fois sans frais, remboursement mutuelle) : 2 sites sur 9 ce tour.

**À décider** : les 11 styles (`ff melanger <slug> --style landrace`) ; grille-urgence pour le premier serrurier, plombier ou
dépanneur ; atelier-par-colis pour un cordonnier, horloger, rempailleur qui reçoit par la poste ; les paires trop proches.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 27 oct 2026, après-midi (à la main, Fable) : veille courte « fonctionnalités », la nouvelle du moment

**Fait**
- Volet « fonctionnalités » : ce que les fabricants de sites vendent (Wix, Squarespace, SiteW, pages lues le jour même)
  croisé avec ce que les 90 sites réels de `marche/` font : `docs/veille/fonctionnalites-2026-10.md`. Treize familles
  déjà dans l'usine, treize manques jugés un par un ; un seul retenu.
- **`annonce`** : la nouvelle du moment (fermeture, saison, offre datée ; 10 sites sur 63, premier levier absent de
  l'usine) → une ligne sous le premier écran de l'accueil, dans le rythme de la coquille, fenêtre `du`/`au` lue au build
  et rejouée au jour civil Europe/Paris dans le navigateur ; pas de bouton de fermeture, jamais collée en bas (bannière de
  cookies) ni par-dessus la nav (toutes fixes) ; pas rendue dans `scenes`, `slides`, `carnet`, `panneaux`, `vitrine`.
  Schéma, composant, module pur, test (`tests/annonce.test.mjs`), brief (`docs/BRIEF.md`), `CLAUDE.md`. Essai sur une
  copie de `_exemple` construite et regardée (ordinateur et téléphone), copie supprimée.

**Refusé (avec la raison dans la fiche)** : chat et assistant IA, newsletter, boutique et paiement, espace membres,
fidélité, flux Instagram incrusté (traceur), calculateur d'estimation (prix inventés), pages prestation × commune
(contenu dupliqué), devis avec photo jointe (service tiers ; à revoir si un client le demande).

**À décider (fondateurs)** : rien. Le champ est facultatif ; il n'apparaît que si le brief donne une nouvelle.

## 27 oct 2026, matin (fondateur absent) : Épi d'Or B relu jusqu'à 7,2

**Fait**
- Passe `/site-final --relecture` sur `prospect-epi-dor-b` : contrôles verts, planches et film, deux relecteurs
  (DA, rédacteur), deux lots de corrections notés par les mêmes relecteurs. 5,75 → 6,4 → **7,2** (seuil « montrer » :
  7,5). Textes 3 → 7,5 : trois détails inventés retirés (« fraisier », « œuf en chocolat », « en janvier »). Composition
  6,5 → 7 : étiquette du jour entière, vitrine en deux colonnes d'arches, seconde voix typographique. Un lot 3 de trois
  lignes (étiquette sous l'enseigne au téléphone, recul abandonné, une répétition) vérifié à l'œil, non renoté.
- Deux champs de l'usine nés de la relecture : `wording.servicesNav` (libellé de nav de la section services) et
  `wording.servicesIntro` (phrase sous le titre de carte-prix, sinon « métier à ville » répété). Flèche « → » retirée du
  lien « Voir la page » de carte-prix.
- Aperçu privé : https://prospect-epi-dor-b.vercel.app

## 26 oct 2026, après-midi (fondateur absent, travail autonome) : défauts visuels corrigés

**Fait**
- Planches de 14 sites regardées à l'œil. Corrigé dans les démos : numérotation décorative « 01 02 03 » (dubois-plomberie,
  toits-cie, osteo-marchand, lemaire-avocats, moteur-fils), « 18 ans » / « 10 ans » calculés remplacés par « Depuis 2008 /
  2016 » (dubois, osteo), pilule en capitales espacées (moteur-fils), arche de vitrine répétée six fois réduite à une
  (prospect-epi-dor-b). Dans le gabarit partagé : `services/grid` perd la tuile teintée derrière l'icône (le « carré d'icône »
  des gabarits de logiciel).
- `ff planche` : sur une page aimantée (coquilles slides/scenes), trois crans de molette ne basculaient pas l'écran et la planche
  montrait douze fois le premier écran ; elle passe maintenant à l'écran suivant quand la page n'a pas bougé.
- Veille passée à 3 tours par jour (4 h, 11 h, 22 h Paris), collecte à 3 par jour (7 h, 15 h, 19 h), décalées.
- **Poids des pages divisé par deux** : Astro mettait dans chaque page le CSS de toutes les variantes de sections et de
  toutes les coquilles (globs) ; chaque moule ajouté par la veille alourdissait tous les sites (accueil de `_exemple` :
  164 Ko le 22 oct, 243 Ko le 26). `scripts/vite-ff-look.mjs` n'importe plus que la coquille et les variantes du site
  (`composantsDuSite`, architecture comprise) : 113 Ko pour `_exemple`, 125 Ko pour Épi d'Or B (254 avant). Les 41 sites
  reconstruits, tests verts. Règle dans CLAUDE.md § Pièges.

## 26 oct 2026, tour 8 (routine en ligne) : 8 styles, 2 architectures

**Fait**
- Santé : `tests/atomes.test.mjs` était rouge sur `main` après la collecte du 25 oct (23 atomes avec `photos.traitement`
  « à juger » sous un atome photos posé, mesures hors bornes ; fiches frama, pierrehermeparis et maisonkitsune effacées par
  erreur). Atomes repassés en « à juger » là où rien n'était jugé, fiches restaurées. Chromium de Playwright, `FF_CHROMIUM=1` :
  tout a tourné avec navigateur.
- **Styles (2a quater)** : collecte commencée par les régimes en besoin (sombre, clair teinté). Une soixantaine de domaines
  essayés (beaucoup injoignables : 502, tunnel refusé), planche de défilement regardée pour chaque candidat, 10 relevés,
  chacun essayé sur une copie de `demo-boulangerie` (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de
  la source. **8 gardés** : `lune` (croissanterie, noir), `attica` (noir, fond qui change de teinte), `thepalomar` (bleu
  nuit et crème), `cafedeflore` (noir et grège) en sombres ; `kol` (kaki), `bobbobricard` (rose poudré), `lesdeuxmagots`
  (vert bouteille, brique, or) en colorés doux ; `terroirsavenir` (producteurs, papier clair). Refusé à la comparaison :
  bancone ; écartés au regard : sessionsartsclub, verve. Fiches `docs/veille/styles/<id>.md`, lignes et écartés dans
  [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : sombre 16 → 20 (besoin comblé), coloré doux 23 → 26, clair neutre 80 → 81, clair
  teinté 10 → 10 (toujours en besoin : les crèmes vues restent sous 0,012 ou sont sur des sites à fenêtres bloquantes).
- **Mouvement** : 2 profils nouveaux, mesurés sur la source ([MOUVEMENTS.md](styles/MOUVEMENTS.md), `scripts/ff/mouvements.mjs`) :
  `nom-en-lettres-geantes` (Lune : une lettre du nom au trait par section, parallaxe de 0,125, relevée à 8 hauteurs) et
  `fond-qui-change-de-teinte` (Attica : le fond du document prend la teinte de chaque assiette, 1 s, relevé à 14 hauteurs). 25 profils.
- **Règle apprise en regardant les essais** (ATOMES.md § Règles apprises, `casseH1` testée dans `melanger.mjs`) : les capitales
  de Palomar, Flore, Bob Bob Ricard et Deux Magots cassaient le h1 d'une phrase en 4 à 6 lignes à l'ordinateur ; le h1 repasse
  en casse normale, les h2 gardent les capitales. Vérifié au second essai de Palomar (4 lignes au lieu de 6).
- Mélange au hasard sur `_exemple` (`--n 3 --hasard --essai`) regardé : trois sites nettement différents (crème et machine à
  écrire ; noir, Josefin et vert d'eau ; rose grège et bleu marine).
- **Architectures (2a ter)** : [outil-calendrier](architectures/coquelicots.md) enfin codée (coquille `calendrier`,
  `disponibilites` : périodes prises ou iCal lu au build, calendrier lisible sans script, la demande remplit Arrivée et Départ,
  aucun paiement) et une nouvelle, [parcours-atelier](architectures/parcours-atelier.md) (Turning Earth, ateliers de céramique,
  Londres : le site est une échelle, du premier essai à la pratique libre ; coquille `parcours`, `parcours[]`, une page par
  barreau). Les 12 architectures de l'étude du 17 oct sont toutes codées. `ff ressemblance` : calendrier 0,49 / 0,59 / 0,55,
  parcours 0,54 / 0,64 / 0,59 (téléphone / ordinateur / déroulé, seuil 0,65 ; le parcours passe de justesse à l'ordinateur).
  `ff verifier` vert sur les deux sites jetables (hors données de test), supprimés ensuite. Tests `tests/architectures-sejour.test.mjs`.
- **Marché (2a)** : 9 sites de plus (agences de Toulon, Lille, Rennes ; Google : serrurier à Nîmes, paysagiste en Seine-Saint-Denis,
  tatoueur à Annecy ; modèles Framer GreenCraft, Wix SnapX, Squarespace Kinsley). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) passe à
  72 sites. Aucun levier à 40 % ou plus n'est absent de l'usine. Le plus vendeur : le serrurier de Nîmes (gérant en photo devant
  sa boutique au premier écran, 14 liens d'appel et bouton « Appel 24/7 », « moins de 30 min », prix écrits, mise en garde contre
  les plateformes d'urgence). À surveiller : la date des réalisations, le choix guidé de la prestation, les forfaits d'entretien.
- Tests : 69 fichiers, 1 113 tests, tous verts après fusion.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé, 21
les deux), aucun site n'ayant changé ; pires paires inchangées : anna-vidal / borie-des-chenes (0,81 / 0,75 / 1,00), chez-malo /
studio-ambre (0,87 / 0,91), demo-informatique / fromagerie-ravanel-d (déroulé 0,90). Signalé, pas corrigé.

**Proposé**
- Collecte ciblée crèmes de chroma ≥ 0,012 (il manque 8 palettes teintées) ; reprendre Gymkhana (vert bouteille, crème, bordeaux : 429 au relevé).
- Coder le déclencheur `data-teinte` du profil d'Attica dans le moteur (petit, iPhone sans risque : transition en temps).
- Réalisations datées et situées dans `proof/gallery` (vu sur le marché, une variante de plus).

**À décider** : les 8 styles (`ff melanger <slug> --style terroirsavenir` les applique) ; les deux architectures, à proposer au premier
gîte ou chambre d'hôtes avec un calendrier (outil-calendrier) et au premier atelier qui donne des cours (céramique, cuisine, couture :
parcours-atelier) ; les paires trop proches (anna-vidal / borie-des-chenes, autour de studio-ambre).

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 25 oct 2026, tour 7 (routine en ligne) : 10 styles, 2 architectures

**Fait**
- Santé : tests verts avant le tour (1 082) ; Chromium de Playwright, `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- **Styles (2a quater)** : collecte commencée par les régimes en besoin (sombre, clair teinté). 67 domaines essayés, 45 relevés
  (`ff atomes mesurer` + captures pleine page regardées), chacun des retenus essayé sur une copie de `demo-boulangerie`
  (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source. **10 gardés** : `bruichladdich`,
  `kilchoman` (bleu nuit), `francescana` (sombres), `coffeecollective` (crème teinté), `hisafranko`, `barrafina`, `androuet`
  (fromager parisien, le plus proche d'un client de l'usine), `diaspora` (colorés doux), `eastfork`, `heckfield`. Fiches dans
  `docs/veille/styles/<id>.md`, lignes et écartés dans [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : sombre 13 → 16, clair teinté 9 → 10, coloré doux 19 → 23, clair neutre 78 → 80. Toujours
  en besoin, de justesse : sombre (16 sur 17) et clair teinté (10 sur 17) ; la plupart des crèmes vues restent sous 0,012.
- **Mouvement** : 2 profils nouveaux, filmés sur la source ([MOUVEMENTS.md](styles/MOUVEMENTS.md), `scripts/ff/mouvements.mjs`) :
  `soulignement-qui-se-dessine` (Hiša Franko : rien au défilement, le soulignement des liens se trace au survol) et
  `fil-qui-mene` (Kilchoman : un trait or relie le premier écran au lieu sur la carte de l'île). 23 profils.
- **Règle apprise en regardant les essais** (ATOMES.md § Règles apprises, `interlignageTitre` testé) : l'interlignage 1,5
  relevé sur Androuet ouvrait un trou entre les lignes du h1 ; plafond 1,3, vérifié au second essai. Coffee Collective :
  Work Sans en paire était déjà la paire d'une direction (tirage impossible), remplacée par Schibsted Grotesk.
- Mélange au hasard sur `_exemple` (`--n 3 --hasard --essai`) regardé : trois sites nettement différents ; à revoir à part,
  des boutons très arrondis et une grande carte noire vide (photo absente) dans le mélange m-9c64ac.
- **Architectures (2a ter)** :
  - Deux fiches nouvelles, codées dans l'usine le même tour. [artistes-residents](architectures/artistes-residents.md)
    (Mystery Tattoo Club, Paris 10e : la maison se choisit par ses artistes, et l'artiste par son style ; coquille `artistes`,
    `artistes[]`, `/artistes` et une page par artiste, son e-mail, son Instagram, son rendez-vous) et
    [calendrier-fetes](architectures/calendrier-fetes.md) (Touchard Fleurs, Sarthe : la prochaine fête d'abord, sa date limite
    de commande, la livraison « avant 13 h, livré aujourd'hui » ; coquille `fetes`, `fetes[]`, `livraison`, `/fetes` et une
    page par fête). La fête du moment et l'heure limite se calculent dans le navigateur ; sans script, tout se lit.
  - Preuves sur deux sites jetables (sans photo, supprimés) : `ff verifier` vert hors données de test (`ff a11y`, `ff typo`,
    `ff ia` compris) ; `ff ressemblance` artistes 0,63 / 0,54 / 0,59, fêtes 0,58 / 0,62 / 0,62 (téléphone / ordinateur /
    déroulé, seuil 0,65). Mystery Tattoo Club refuse les navigateurs sans tête (403) : fiche relevée au `curl`.
  - Appris : contre le registre, la moitié « site » du déroulé pèse déjà 0,45 pour tout site « plusieurs pages » de 4 pages
    et plus ; les premiers essais (un bloc par artiste, une fête en panneau puis en onglets) restaient à 0,66 à 0,87 quel
    que soit l'ordre des blocs. Ce qui a fait passer : un modèle de navigation que le registre n'a pas (onglets de style ;
    piste horizontale des fêtes). Le registre compte 17 architectures codées ; reste `outil-calendrier`.
- **Marché (2a)** : 9 sites de plus, démontés avec navigateur (agences de Reims, Nice, Toulouse ; Google : garage à Amiens,
  coach sportif à Nice, maçon à Annecy ; modèles Framer HomeMaster, Wix Roofing Clean, Squarespace Flor).
  [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) passe à 63 sites. Aucun levier à 40 % ou plus n'est absent de l'usine. Le plus
  vendeur du tour : All'Eau Plombier (numéro partout, 5,0 sur 31 avis au premier écran, délai d'arrivée par commune, barre
  basse à trois portes). Un site de mise en relation déguisé en artisan écarté (maconnerie-annecy.fr).
- Tests : 69 fichiers, 1 096 tests, tous verts après fusion (le test des docs des architectures cherchait un titre de journal exact : il cherche maintenant les deux fiches).

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé, 21
les deux), aucun site n'ayant changé ; pires paires inchangées (anna-vidal / borie-des-chenes, chez-malo / studio-ambre,
lemaire-avocats / studio-ambre). Signalé, pas corrigé.

**Proposé**
- Collecte ciblée crèmes de chroma ≥ 0,012 et sombres (il manque 1 palette sombre et 7 teintées).
- Nuancier en pastilles (East Fork) en bloc sur mesure pour un potier ou céramiste ; fil vers le lieu (Kilchoman) pour un domaine.
- Fêtes : la fête du moment en tête de nav (aujourd'hui rendue au build) ; artistes : choix de l'artiste dans le formulaire.

**À décider** : les 10 styles (`ff melanger <slug> --style androuet` les applique) ; les deux architectures, à proposer au premier
salon à plusieurs artistes (tatouage, coiffure) et au premier fleuriste, chocolatier ou traiteur à commandes de fêtes ; les paires
trop proches autour de studio-ambre.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 24 oct 2026, tour 6 (routine en ligne) : 12 styles, 2 architectures

**Fait**
- Santé : `tests/atomes.test.mjs` était rouge sur `main` (« registre réel ») : les 18 atomes de la collecte du 23 oct (Hodinkee …
  Mokuba) portaient des valeurs non jugées hors format (palette « à juger » sous un `principal` posé, traitement des photos,
  mesure de 218 caractères, scène de 3 s et plus). Repassés en « à juger » là où rien n'était jugé : valides, leurs atomes jugés
  restent tirables. Chromium de Playwright, `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- **Styles (2a quater)** : collecte commencée par les régimes en besoin (crème et sombre). 46 domaines essayés, 37 ouverts et
  regardés, 17 relevés (`ff atomes mesurer` + titre affiché relevé à part), chacun essayé sur une copie de `demo-boulangerie`
  (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source. **12 gardés** : `kricket` (papier rosé, encre
  rouille), `ikoyi` (brun tabac, motif), `padella` (noir, carte du jour), `ritual` (crème beurre, brun café), `wendelboe` (papier
  rosé, vert forêt), `hiut`, `labourandwait`, `lyles` (site du groupe JKS), `pumpstreet`, `blenheim` (Lora, police IA, remplacée
  par Spectral), `wolseley`, `fuglen`. Refusés à la comparaison : belleville, paxton, honeyandco. Fiches dans
  `docs/veille/styles/<id>.md`, lignes et raisons dans [styles/INDEX.md](styles/INDEX.md).
- Palettes par régime, avant → après : sombre 11 → 13, clair teinté 7 → 9, coloré doux 17 → 19, clair neutre 72 → 80. Toujours
  en besoin : clair teinté (9 sur 16) et sombre (13 sur 16) : la plupart des crèmes vues sont sous 0,012 de chroma.
- **Mouvement** : 2 profils nouveaux, filmés sur la source ([MOUVEMENTS.md](styles/MOUVEMENTS.md), `scripts/ff/mouvements.mjs`) :
  `assiettes-qui-se-posent` (Kricket : plats vus de dessus qui se posent par étapes au défilement) et `nom-qui-s-efface` (Ikoyi :
  motif fixe, le nom pâlit au défilement, les photos montent dessus). 21 profils.
- **Deux règles apprises en regardant les essais** (ATOMES.md § Règles apprises, fonctions pures testées dans `melanger.mjs`) :
  `casseTitre` (la casse de titre anglaise donnait « Le Pain Du Matin, Et Une Deuxième Fournée » : jamais en français) et
  `interlettrageTitre` (capitales espacées à 0,15 em : h1 cassé en six lignes ; plafond 0,06 em). Vérifiées au second essai.
- **Marché (2a)** : 9 sites de plus (agences de Nantes, Saint-Denis, Annecy ; Google : vétérinaire au Havre, institut à
  Saint-Étienne, agence immobilière à Bordeaux ; modèles Framer Plumbzo, Wix Brightnest, Squarespace Selene).
  [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) passe à 54 sites. Aucun levier à 40 % ou plus n'est absent de l'usine. Contre-levier
  nouveau : un numéro écrit sans lien `tel:` sur 4 sites sur 9 (les sections partagées de l'usine en font toujours un lien).

- **Architectures (2a ter)** : deux fiches nouvelles, codées dans l'usine le même tour. [ardoise-du-jour](architectures/ardoise-du-jour.md)
  (Cheese Board Collective, Berkeley : le lieu est fixe, l'offre change chaque jour ; coquille `ardoise`, `services[].programme`,
  `ardoise[]` pour les exceptions datées, page `/programme`) et [tournee-semaine](architectures/tournee-semaine.md) (camions à
  pizza P'tit Louis, Dijon, et Le Camion à Pizzas : l'offre est fixe, le lieu change chaque jour ; coquille `tournee`, `tournee[]`,
  `/tournee` et une page par commune). « Aujourd'hui » se choisit dans le navigateur, toute la semaine reste lisible sans script.
  Preuves sur deux sites jetables (supprimés) : `ff verifier` et `ff a11y` verts hors données de test ; `ff ressemblance` ardoise
  0,50 / 0,54 / 0,64, tournée 0,647 / 0,60 / 0,64 (téléphone / ordinateur / déroulé, seuil 0,65 : la tournée passe de justesse,
  à relancer sur le premier vrai client). Les deux se ressemblent entre elles (déroulé 0,80) : jamais deux pistes d'un même client.
  Le registre compte 15 architectures codées ; reste `outil-calendrier`.
- Tests : 67 fichiers, tous verts après le tour.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au déroulé, 21
les deux), aucun site n'ayant changé ; mêmes pires paires que la veille. Signalé, pas corrigé.

**Proposé**
- Collecte ciblée sur les crèmes de chroma ≥ 0,012 (papeteries, épiceries fines, boulangeries scandinaves) : la plupart des crèmes vues cette fois sont trop pâles pour compter.
- Ardoise : gabarit de page d'activité en trois colonnes et filtre d'allergènes ; tournée : semaine répétée au pied.
- Vérifier les sections sur mesure des sites : un numéro sans lien `tel:` est le contre-levier le plus fréquent du marché.

**À décider** : les 12 styles (`ff melanger <slug> --style kricket` les applique) ; les deux architectures nouvelles, à proposer au premier traiteur, food truck, pizzeria ou boulangerie à programme du jour ; les paires trop proches (toujours autour de studio-ambre et de demo-coiffure).

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 23 oct 2026, tour 5 (routine en ligne) : 9 styles, 2 architectures

**Fait**
- Santé : 66 fichiers de tests. Deux échecs DÉJÀ présents sur `main` corrigés : `tests/melanger.test.mjs` citait l'atome
  `bonpoint`, retiré la veille (remplacé par `artek`) ; `tekla.json` portait `fiche: "à juger"` (fiche absente : `null`).
  Après le tour (styles et architectures fusionnés), 1 063 tests verts (5 blocs). `ff signatures` vert (185 blocs, aucune copie). Chromium installé par
  `playwright-core` dans un dossier à part, puis `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- **Styles (2a quater)** : la collecte a commencé par les régimes en besoin (sombre, clair teinté). 17 sites démontés
  (`ff atomes mesurer`, pages intérieures en plus pour les accueils d'un seul écran), 10 jugés, chacun essayé sur une copie
  de `demo-boulangerie` (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source. **9 gardés** :
  `maaemo`, `kadeau`, `alchemist`, `her`, `hungrytiger` (sombres), `ekstedt` (ivoire, couleurs seulement : sa typo était
  Playfair en capitales espacées), `lacolombe`, `mociun` (colorés doux), `septime` (machine à écrire). Fiches complètes
  dans `docs/veille/styles/<id>.md`, lignes dans [styles/INDEX.md](styles/INDEX.md). Refusé à la comparaison : sonderdays
  (sans ses photos, un blanc neutre de plus). Écartés : aesop (anti-robot), frantzen, audo (page vide), trudon, fornasetti,
  dandelionchocolate (fenêtres qui couvrent la page), geranium (sans caractère).
- Palettes par régime, avant → après : sombre 6 → 11, clair teinté 6 → 7, coloré doux 15 → 17, clair neutre 71 → 72.
  Toujours en besoin : clair teinté (7 sur 14 voulus) et sombre (11 sur 14).
- **Mouvement** : 2 profils nouveaux dans [MOUVEMENTS.md](styles/MOUVEMENTS.md) et `scripts/ff/mouvements.mjs`, filmés sur
  la source : `sortie-du-noir` (Maaemo : la photo sort du noir en 1,5 s, le nom suit) et `portes-qui-s-eclairent` (Kadeau :
  deux portes en photo voilée, celle qu'on survole se dévoile). 19 profils.
- **Deux règles apprises en regardant les essais** (ATOMES.md § Règles de compatibilité, fonctions pures testées) :
  en capitales, interlignage du titre au moins 1,1 (les accents de « DEUXIÈME » touchaient la ligne du dessus, style her) ;
  un h1 doit faire au moins 1,2 fois le texte au téléphone (mélange au hasard avec la typo de Loewe : titre invisible).
  14 typos du registre sortent du tirage, leurs autres atomes restent.
- **Architectures (2a ter)** : les deux fiches restées « à coder » sont codées dans l'usine (détail dans l'entrée suivante) :
  `pages-adresses` (Ten Belles : le premier écran est le carnet d'adresses, une page par lieu avec ses horaires et son
  numéro, page pour les pros) et `saisons-sorties` (Guide La Grave : une entrée de nav par saison, une page par sortie,
  filtre par niveau). Coquilles `adresses` et `saisons`. Ressemblance 0,62 / 0,65 et 0,43 / 0,65 (au seuil pour le déroulé).
  Le registre compte 13 architectures codées ; reste `outil-calendrier`.
- **Marché (2a)** : 9 sites de plus (agences d'Amiens, Montpellier, Marseille ; Google : avocat à Nîmes, auto-école à
  Saint-Étienne, fleuriste au Mans ; modèles Framer Servora, ThemeForest Carpress, Wix Plumbing Blue).
  [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) passe à 45 sites. Aucun levier à 40 % ou plus n'est absent de l'usine. En hausse :
  téléphone en haut 58 %, conseils 47 %, labels 38 % (le prochain à passer 40 %, absent des premiers écrans), note Google
  au premier écran 25 %, prix écrit 24 %. Les vraies photos retombent à 47 %.

**Ressemblance** (`ff ressemblance --registre --tous`) : toujours 263 paires trop proches (46 au premier écran, 238 au
déroulé, 21 les deux), aucun site n'ayant changé. Les pires : anna-vidal / borie-des-chenes (déroulé 1,00, accueil-menu
d'un écran), chez-malo / studio-ambre (0,87 téléphone, 0,91 ordinateur), demo-informatique / fromagerie-ravanel-d (déroulé
0,90), prospect-ballay-macon / prospect-epi-dor (déroulé 0,89), forge-delacroix / studio-ambre (0,88 ordinateur). Signalé,
pas corrigé.

**Proposé**
- `ff melanger --essai` sur `demo-boulangerie` remplace encore les photos par des dégradés : un style qui vit de ses photos
  (Ekstedt, HER, Kadeau) se juge mal. Copier les photos dans les copies d'essai.
- `business.certifications` au premier écran avant que les labels passent 40 %.
- Un champ « nouvelle du moment » daté (5 sites sur 18 du marché).

**À décider** : les 9 styles (`ff melanger <slug> --style maaemo` les applique) ; la règle « h1 1,2 fois le texte » qui
retire 14 typos du tirage (dont Loewe, Nomos, Georg Jensen) ; les paires trop proches autour de studio-ambre.

Doc partagé « Finck & Fisch » : pas de connecteur Claude Docs dans la session en ligne, Notes non écrites.

## 23 oct 2026, volet 2a ter : `pages-adresses` et `saisons-sorties` codées

**Fait**
- Les deux fiches du 19 oct restées « à coder » (`docs/veille/architectures/INDEX.md`, colonne « codée ») : coquille
  `adresses` (le premier écran est le carnet d'adresses, `lieux[]`, `pros`, `/adresses`, `/adresses/<slug>` avec un
  `LocalBusiness` par lieu, `/professionnels`) et coquille `saisons` (une colonne par saison, `services[].saison`, `sorties[]`,
  `/sorties/<slug>`, sorties filtrables par niveau, `/pour/<public>`, nav d'une entrée par saison). Variantes `zones/adresses`
  et `services/saisons` pour d'autres déroulés.
- Preuve sur deux sites jetables (supprimés) : `ff verifier` et `ff a11y` verts hors données de test, `ff ressemblance` 0,62 /
  0,65 et 0,43 / 0,65. Les premiers essais en `flow` étaient refusés (déroulé à plus de 0,65 de 7 à 22 sites).
- Au passage : `tekla.json` (fiche « à juger » au lieu de null) et le test des régimes (bonpoint retiré du registre) cassaient la suite.

**Prochain volet** : `outil-calendrier`, seulement avec un client qui a un calendrier iCal.

## 22 oct 2026, nuit (carte blanche du fondateur) : 3 architectures, hébergement Workers, pipeline

**Fait**
- Les trois architectures qui restaient (lignes ci-dessous, agents de nuit) : le registre compte 11 architectures codées sur 12
  (reste `outil-calendrier`, qui demande un calendrier iCal : à ne faire que pour un client qui en a un).
- `ff deploy` en Cloudflare Workers par défaut (config écrite par la commande, formulaire + binding e-mail déclarés, domaine
  attaché par l'API : zéro clic dashboard par site, tenable à 200 sites), Pages sur `--pages`, mode mémorisé dans
  `sites/<slug>/hebergement.json`. `ff tous --depuis` + CI partielle, `deploy.yml` limité aux sites livrés, Dependabot,
  `npm audit fix` (restent Astro 7 et sharp : majeures, tour dédié).
- Studio : guide domaine réécrit (F&F achète, 10 ans), mise en demeure, registre RGPD, fiche « reprendre son site ».
- Build de référence : 41 sites verts avant les changements.

- 22 oct 2026 : architecture `gamme-vitrine` (Agrumea Farm) codée : coquille `vitrine` (accueil d'un écran = la gamme en piste manuelle, menu plein écran), `produits[]`, pages `/produits` et `/produits/<slug>`, mesure `produits` ; preuve sur site jetable (`ff verifier` vert hors données de test, `ff ressemblance` 0,58 / 0,63). Restent 5, 6 et 9 (`docs/veille/architectures/INDEX.md`).
- 22 oct 2026 : architectures `cadre-couleur` (Meyers) et `scenes-epinglees` (TAB Kitchen & Bakery) codées : coquille `cadre` (cadre de couleur fixe, premier écran collé, feuille à une ombre, nav rentrée dans le cadre), `services[].couleur` + `services/cartes-couleur` + page d'activité coiffée de sa couleur (`src/lib/couleur.ts` : encre par contraste, fond creusé jusqu'à 4,5:1) ; coquille `scenes` (barre fine fixe avec téléphone, ouverture sur aplat), `about.espaces[]` + `about/espaces` (scène épinglée à étapes, `data-pin` sur la scène) + `about/equipe-cartes`, mesure `espaces`. Preuves sur sites jetables : `ff verifier` vert hors données de test, `ff audit-motion` vert, `ff ressemblance` 0,66 au déroulé pour les deux (cadre reste proche du déroulé long, comme prévu), 0,72 au premier écran téléphone pour scenes (h1 en bas sur aplat, moteur-fils). `ff melanger` les tire dès que les données sont là (vérifié par les fonctions pures). Reste 5.

## 19 oct 2026, tour 4 (routine en ligne) : 5 styles, 2 architectures

**Fait**
- Santé : 65 fichiers de tests verts avant et après (5 blocs de `node --test --test-concurrency=1`). Chromium installé
  par `playwright-core` dans un dossier à part (`PLAYWRIGHT_BROWSERS_PATH`), puis `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- **Styles (2a quater)** : 20 sites jamais étudiés, pris sur [minimal.gallery](https://minimal.gallery/) (rubriques nourriture,
  intérieur, santé, commerce), démontés (`ff demonter` + `ff atomes mesurer`). Chaque style a été essayé sur une copie jetable
  de `demo-boulangerie` (`ff melanger --style <id> --essai`) et posé à côté de la source. **5 gardés** en atomes :
  `kaltpresse` (jus pressés, Cologne), `podiatry` (podologue, Melbourne), `carne` (burgers, Argentine), `joandso` (guide d'hôtels,
  Portugal), `nkora` (cafés, Bristol). Les grands titres de Carne et Kaltpresse ont été relevés une seconde fois dans le DOM : le
  premier relevé prenait une bannière pour le titre. Polices libres : Hanken Grotesk, Spectral, Oswald + Karla, Urbanist. Aucune
  ne vient de la liste IA ; la police de Two Robbers (Instrument Sans) en faisait partie. Registre : 29 sites
  ([styles/INDEX.md](styles/INDEX.md)). Refusés après la comparaison : Florentine, Studio Boum, Two Robbers (sans leurs photos,
  il ne reste rien). Écartés au démontage : 12 sites (écran de chargement, fenêtre cookies, pas de défilement). Raisons dans
  l'index.
- **Mouvement** : 2 profils nouveaux dans [MOUVEMENTS.md](styles/MOUVEMENTS.md) et `scripts/ff/mouvements.mjs` :
  `mots-qui-glissent` (Carne : mots géants qui glissent au défilement derrière un produit détouré) et `ombre-au-survol` (Jo&So :
  les cartes se soulèvent sous le pointeur, calme). Le test qui plafonnait le catalogue à 15 profils accepte désormais 12 et plus.
- **Architectures (2a ter)** : [pages-adresses](architectures/pages-adresses.md) (Ten Belles : une page par boutique avec ses
  horaires et son numéro, une page pour les pros) et [saisons-sorties](architectures/saisons-sorties.md) (Guide La Grave : la nav
  a deux entrées, Été et Hiver, puis des sorties filtrables). Elles sont lues sur le code et ne sont **pas encore implémentées**.
- **Marché (2a)** : 9 sites de plus (agences de Villeurbanne, Brest, Nîmes ; brasserie Strasbourg, boulangerie Rennes,
  couvreur Marseille ; modèles ThemeForest Renovate, Wix Galvanic, Framer PlumFix). [CE-QUI-VEND.md](marche/CE-QUI-VEND.md)
  passe à 36 sites. Aucun levier à 40 % ou plus n'est absent de l'usine. Labels et certifications passent à 36 %, toujours
  absents des premiers écrans. Levier nouveau : **la nouvelle du moment** (bière éphémère, page Noël), vue sur 3 sites sur 9.

**Ressemblance** (`ff ressemblance --registre --tous`) : 263 paires trop proches (46 par le premier écran, 238 par le déroulé,
21 par les deux). Les pires :
- anna-vidal / borie-des-chenes : déroulé 1,00, téléphone 0,81 (accueil-menu sans défilement) ;
- chez-malo / studio-ambre : 0,87 au téléphone, 0,91 à l'ordinateur ;
- demo-informatique / fromagerie-ravanel-d : déroulé 0,90 ;
- prospect-ballay-macon / prospect-epi-dor : déroulé 0,89 ;
- forge-delacroix / studio-ambre : 0,88 à l'ordinateur.

Rien n'a été corrigé : la veille ne touche à aucun site.

**Proposé** :
- un champ « nouvelle du moment », daté, qui disparaît seul à la date de fin (levier du marché à 33 %) ;
- `business.certifications` dans les premiers écrans, avant que ce levier passe 40 % ;
- implémenter `pages-adresses` (`lieux[]`, `/adresses/<slug>`), qui sert aussi aux boulangeries à plusieurs boutiques ;
- quand `ff melanger --essai` copie un site, prendre aussi ses photos : sur `demo-boulangerie`, les photos sont
  remplacées par un dégradé, et un style qui vit de ses photos se juge mal.

**À décider** : les 5 styles (`ff melanger <slug> --style kaltpresse` les applique) ; les paires trop proches autour de
studio-ambre et des prospects de l'Épi d'Or.

## 17 oct 2026, tour 3 (routine en ligne) : 9 styles réels, 2 architectures

**Fait**
- Santé : 62 fichiers de tests verts avant et après (4 blocs), `ff signatures` vert (177 blocs, aucune copie).
  Chromium installé par `playwright-core` puis `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- **Styles (2a quater), l'amélioration du tour** : 16 sites jamais étudiés pris sur [minimal.gallery](https://minimal.gallery/)
  (rubriques nourriture, intérieur, hôtels, ateliers), démontés par `ff demonter` dans `docs/veille/styles/`. 13 jugés,
  **9 gardés et devenus des directions** de l'usine, chacune avec ses deux modèles et leurs vignettes :
  `cobalt` (boulangerie Union), `sapin` (Cabalar), `affiche` (Matheson), `prune` (House of Honey), `huile` (Anècdota),
  `releve` (Roxoseco), `arche` (Anuc Home), `labo` (Folk Kombucha), `citron` (Pimpinella). Couleurs relevées en hex,
  polices libres les plus proches (Gilda Display et Marcellus ajoutées au registre ; Instrument Serif et Sans, de la
  liste IA, remplacées), contrastes AA vérifiés (trois rouges de source assombris, notés dans les fiches).
  Preuve : `_exemple` habillé de chaque style, posé à côté de la source (`docs/veille/styles/captures/<direction>-comparaison.jpg`),
  regardé. Refusés : `velours` (Durup, style tout en photo, capture floue : essayé puis retiré), Hyll (bannières
  bloquantes), Uneven Objects et Grace Walker (pas de défilement). Celtic Sea Salt, Oma Appel, Onoera démontés, en réserve.
  Index : [styles/INDEX.md](styles/INDEX.md).
- **Architectures (2a ter)** : registre créé, [architectures/INDEX.md](architectures/INDEX.md), deux fiches :
  [carrefour-portes](architectures/carrefour-portes.md) (Cabalar : accueil aiguillage, trois portes vers des pages,
  contact à part) et [projets-fiches](architectures/projets-fiches.md) (House of Honey : une page par chantier avec sa
  série de photos). Fiches seulement : **pas encore implémentées** dans l'usine (voir « proposé »).
- **Marché (2a)** : 9 sites de plus (agences de Bordeaux, Perpignan, Dijon ; Google : architecte d'intérieur Rouen,
  dentiste Lille, traiteur Le Havre ; Framer Refit, Wix, ThemeForest Constructo), mesurés sur le code (agent sans
  navigateur), [CE-QUI-VEND.md](marche/CE-QUI-VEND.md) sur 27 sites. Aucun levier ≥ 40 % absent de l'usine ; labels
  au premier écran retombent à 30 %.
- Tests des modèles : les comptes fixes de variété (8/14/10 échelles, 12 alternances sur 32 modèles) deviennent des
  proportions (`tests/presets.test.mjs`), la veille ajoutant des modèles à chaque tour. Deux directions qui listaient
  « fleuriste » l'ont retiré (le test du composeur veut qu'une fleuriste tombe sur `atelier`).

**Ressemblance** (`ff ressemblance --registre --tous`) : 46 paires trop proches au premier écran. Les pires :
chez-malo / studio-ambre (0,87 téléphone, 0,91 ordinateur : h1 sur l'image au milieu, numéro sous le h1),
maison-aurore / studio-ambre (0,89), forge-delacroix / studio-ambre (0,88), encre-noire / forge-delacroix (0,88),
demo-coiffure / demo-informatique (0,86). Signalé, pas corrigé (la veille ne touche à aucun site).

**Proposé** : implémenter les deux architectures (route `/realisations/[slug]` avec un champ `realisations[]` ; pages
À propos et Contact à part ; hero avec horaires ; variante « portes ») ; faire choisir les 9 styles par `ff composer`
selon les données du client (photos, produits) ; `ff verifier` devrait repérer un faux numéro de modèle
(`tel:123456789`, vu chez un artisan du marché), la garde ne connaît que 06 00 00 00 00.

**À décider** : regarder les 9 comparaisons et dire lesquelles ne vous plaisent pas (elles sont déjà proposées par
`ff studio` et `ff modele`) ; les 46 paires trop proches, surtout autour de studio-ambre.

## 17 oct 2026, tour 2 (routine en ligne) — trois compositions de modèles Framer : de la profondeur

**Fait**
- Santé : 57 fichiers de tests verts (4 blocs), `ff variete` et `ff signatures` verts (154 blocs, aucune copie),
  `ff verifier demo-paysagiste` vert (avertissements de démo seulement), planche téléphone regardée, rien de cassé.
  Chromium à jour installé par `playwright-core` (`node node_modules/playwright-core/cli.js install chromium
  chromium-headless-shell`) puis `FF_CHROMIUM=1` : tout a tourné avec navigateur.
- Volet 2a bis, **l'amélioration du tour** : les trois modèles les plus populaires de la catégorie
  [Home Services de Framer Marketplace](https://www.framer.com/marketplace/templates/categories/home-services/)
  (PlumFix n° 1, Solshine n° 2, HandGrid n° 3) démontés, pages entières regardées, trois sections recréées en
  variantes partagées : `services/photo-cards` (photo qui remplit la carte, panneau clair posé dessus),
  `about/overlap` (panneau sombre, portrait qui dépasse le haut, seconde photo qui déborde dessous : trois plans),
  `cta/photo` (photo du client en pleine largeur, appel centré). Construction seulement : aucun texte, image, code
  ni identité des sources ; refusés en route : photos inclinées, coches, mot du titre en couleur, chiffres factices.
  Site jetable (copie de `jardins-mael`) : build, `ff verifier` (a11y, typo, `ff ia` verts), `ff audit-motion` vert,
  captures ordinateur et téléphone posées à côté de la source et regardées
  ([services](compositions/handgrid-services-comparaison.jpg), [à propos](compositions/handgrid-about-comparaison.jpg),
  [appel](compositions/plumfix-cta-comparaison.jpg)) ; deux reprises après comparaison (photos de l'à-propos trop
  petites, voile de l'appel trop lourd). Site jetable supprimé.
- `ff composer` choisit désormais ces trois variantes d'office quand leurs photos sont là
  (`COMPOSITIONS_EPROUVEES`, `scripts/ff/composer.mjs`, test dans `tests/composer.test.mjs`) ; six modèles
  (`presets/`) les portent, vignettes régénérées. Lignes dans [DIRECTIONS.md](../DIRECTIONS.md) et
  [compositions/INDEX.md](compositions/INDEX.md).
- Volet 2a : 9 nouveaux sites (agences de Tours, Le Mans, Limoges ; photographe Lyon, plombier Clermont-Ferrand,
  barbier Nice ; ThemeForest BuildPress 7,8 k ventes, Squarespace Sawyer, Webflow Roofex), fiches dans
  `docs/veille/marche/`, comptes sur 18 sites dans [CE-QUI-VEND.md](marche/CE-QUI-VEND.md).

**Appris du marché**
- Plusieurs pages 18/18, avis 14/18, une page par service 13/18, téléphone en haut 12/18 : l'usine fait tout ça.
- Aucun levier ≥ 40 % absent de l'usine. Le plus proche : **labels et certifications au premier écran, 7/18 (39 %)** ;
  nos six heros affichent l'assurance mais pas `business.certifications` (RGE, Qualibat ne se voient qu'en bas).
- Les deux meilleurs premiers écrans d'artisans ajoutent ce que nos heros n'ont pas : les communes desservies en
  liste cliquable et un délai chiffré (« Devis sous 48 h », donné par le client).
- 4 sites sur 18 se cachent derrière une bannière cookies plein écran : notre « zéro traceur » est un argument.
- En recherche locale, l'artisan indépendant n'arrive qu'au 10e rang ou après (annuaires et plateformes devant).

- En fin de tour, la fusion avec `main` a fait tomber deux tests : le commit `da195bf` (démo prospect) écrit
  `noindex, nofollow, noarchive` sur toutes les pages légales et crédits, les tests attendaient `noindex` seul.
  Tests assouplis (noindex reste exigé, `tests/credits.test.mjs`, `tests/legal.test.mjs`), ligne du fondateur intacte.

**Compositions ajoutées** : `services/photo-cards`, `about/overlap`, `cta/photo` (sources et pertes dans l'index).

**Proposé** : prochain tour, `business.certifications` dans les heros (levier à 39 %) ; un hero « nom géant
derrière le gérant détouré » (PlumFix) dès qu'un brief fournit une photo détourée ; `ff detect` signale un faux
contraste sur le titre en italique des bandeaux encre (`cta/band` comme `cta/photo`, axe ne voit rien) : à
filtrer dans `scripts/ff/detect.mjs` ou à corriger.

**À décider** : montrer aux fondateurs les trois comparaisons avant d'en faire le défaut de toutes les démos
(composer les choisit déjà quand les photos sont là).

## 17 oct 2026 (routine en ligne) — premier tour « ce qui se vend » : rubrique Conseils

**Fait**
- Santé : 56 fichiers de tests verts (4 blocs), `ff variete` et `ff signatures` verts (152 blocs, aucune copie),
  `ff verifier ampere-fils` vert (avertissements de démo seulement), planche téléphone regardée, rien de cassé.
  Chromium de la session trop ancien pour `playwright-core` 1.63 : `npx playwright install chromium` puis
  `FF_CHROMIUM=1`, tout a tourné avec navigateur.
- Volet 2a, 9 sites tirés au hasard et démontés (`ff demonter`) : 3 sites clients d'agences (Grenoble, Strasbourg,
  Angers), 3 artisans classés (chambres d'hôtes Marseille, ferronnier d'art Paris, électricien Rennes), 3 modèles
  (ThemeForest 10 654 ventes, Framer, Wix). Fiches et verdicts dans `docs/veille/marche/`, comptes dans
  [CE-QUI-VEND.md](marche/CE-QUI-VEND.md).
- Amélioration du tour, le seul levier ≥ 40 % absent de l'usine : la **rubrique Conseils** (5 sites sur 9).
  Champ `conseils` du schéma (articles du client, jamais écrits à sa place), pages `/conseils` et `/conseils/<article>`
  avec `BlogPosting`, lien de nav avant Contact, sitemap ; rien du tout sans article. `src/lib/conseils.ts`,
  `src/pages/conseils/`, `tests/conseils.test.mjs` (7 tests dont un build), brief § 10bis, `/nouveau-site`.
  Prouvé sur un site jetable (build, `ff ia`, a11y, typo verts, captures liste et article regardées), supprimé.

**Appris du marché**
- Ce qui revient partout est simple : plusieurs pages (9/9), une page par service (7/9), avis (7/9), téléphone en
  haut (6/9), l'année de création (6/9), métier + ville dans le titre (5/9). L'usine fait déjà tout ça.
- Les sites d'agence locale sont techniquement faibles (bannières cookies sur le titre, téléphone absent sur mobile,
  image de banque) : ce qui les fait payer, c'est d'être trouvés et appelés, pas le dessin.
- Le modèle le plus « vendeur » (Framer) aligne des preuves vérifiables : licence, assurance, délais chiffrés,
  note avec nombre d'avis. L'usine sait les afficher, à condition que le brief les demande.

**Proposé** : le formulaire client (`outils/brief-form/`) ne pose pas encore la question 10bis ; vérifier si les heros
partagés montrent les labels (44 %) dès le premier écran.

**À décider** : proposer la rubrique Conseils aux clients (un article par mois écrit avec eux = un service récurrent
à facturer ?) ; le badge « depuis 1998 » reste refusé alors que 6 sites sur 9 mettent l'ancienneté en avant (en texte,
l'usine le fait déjà).

## 17 oct 2026 — « concurrent de Framer / Lovable » : la skill s'outille

**Fait**
- `ff aiguillage <slug>` : les réponses du client (photos : en veut / en a / qui les fait ; ambiance : calme /
  vivant) deviennent une décision calculée, écrite en tête du contrat et contrôlée dans `ff verifier` (client
  « calme » = `subtle`, rien qui suit le défilement). Formulaire brief et brief papier posent les mêmes questions.
- `ff pistes <slug>` : les pistes d'un client comparées sur les sept axes (fichiers + film des premiers écrans
  côte à côte, distance d'image à 400 ms). Les trois pistes de la fromagerie : rythme partagé seulement, images
  à 0,61 / 0,65 / 0,17 ; verdict « différentes ».
- `ff demonter <url>` : fiche de démontage automatique d'un site aimé du brief (polices, couleurs, premier écran,
  mouvement, structure, signes IA), rien d'inventé, ~25 s par site. Testée sur Délice et CRISP : voit juste les
  polices, couleurs, portes d'action, horaires, bibliothèques ; rate le canvas WebGL et la barre d'actions
  téléphone ; le geste signature reste à juger sur les captures.
- Skill `/retouche <slug> "<phrase>"` : une phrase du fondateur, plus petite modification à la source, contrôles,
  comparaison pixel, redéploiement, un commit annulable, réponse en trois lignes, lexique des mots du fondateur.
- Gestes 2, 3 et 4 des démontages : `contact.bookingUrl / orderUrl / giftCardUrl` et `actions()` dans les six
  navs, `BarreActions` collée en bas sur téléphone (`layout.actionBar`), composant `Horaires` avec le jour
  courant et l'état ouvert / fermé (sans JS : la liste).
- Process d'hébergement écrit (`studio/decisions/PROCESS-HEBERGEMENT.md`) et fiche client « votre nom de
  domaine » (`studio/commercial/guide-domaine.html`).
- Après-midi, la skill se mécanise : `ff contrat` (forme du contrat avant de construire), `ff prevol` (tous les
  contrôles en une commande et une table), `ff choisir` (la piste retenue devient le site). Premier essai de
  `/retouche` : 32 s par boucle build + vérification + comparaison.
- Les relecteurs sur les pistes A et B de la fromagerie ont trouvé quatre défauts **de l'usine**, corrigés pour
  tous les sites : le bandeau CTA inventait « intervention sous 48 h » ; les ancres `#contact` ne menaient nulle
  part depuis les pages secondaires (ancres absolues + contrôle `ff verifier`) ; les pages service portaient un
  surtitre gris et des coches ; CREDITS.md créditait des photos jamais affichées (avertissement). Leçon : chaque
  constat d'un relecteur qui vient de `src/` devient un contrôle, pas une retouche.
- `ff prevol` sur les trois pistes (2 min par piste) révèle ce que personne n'avait lancé : `perf` (polices 192 Ko
  sur A, 179 Ko sur B : fausse alerte, `ff perf` comptait les sous-ensembles latin-ext que le navigateur ne
  télécharge que si la page contient œ ou Œ ; corrigé, les trois pistes font 102 à 111 Ko),
  `detect` sur A (contraste), et sur B la nav sur mesure en ancres `#cave` mortes depuis la 404. À traiter avec les
  démos ; `ff ia` sait maintenant voir un surtitre au-dessus du h1.
- Après-midi, la skill se mécanise : `ff contrat` (forme du contrat avant de construire), `ff prevol` (tous les
  contrôles en une commande et une table), `ff choisir` (la piste retenue devient le site). Premier essai de
  `/retouche` : 32 s par boucle build + vérification + comparaison.
- Les relecteurs sur les pistes A et B de la fromagerie ont trouvé quatre défauts **de l'usine**, corrigés pour
  tous les sites : le bandeau CTA inventait « intervention sous 48 h » ; les ancres `#contact` ne menaient nulle
  part depuis les pages secondaires (ancres absolues + contrôle `ff verifier`) ; les pages service portaient un
  surtitre gris et des coches ; CREDITS.md créditait des photos jamais affichées (avertissement). Leçon : chaque
  constat d'un relecteur qui vient de `src/` devient un contrôle, pas une retouche.
- `ff prevol` sur la piste A révèle ce que personne n'avait lancé : `detect` (contraste de la craie sur fond
  clair ?) et `perf` (polices 192 Ko > 160 Ko). À traiter avec les démos.
- Geste 5 : `proof.gallery[].place / kind / size / client` (optionnels, jamais devinés), ligne lieu – type –
  mesure – client sous chaque photo de `Proof/gallery`, filtres par type en boutons radio + CSS `:has()` sans
  JS, compteur « N réalisations » à partir de 4 (`src/lib/galerie.ts`, `tests/galerie.test.mjs`). Brief § 8 :
  les quatre données demandées par photo.
- Geste 1 : brief § 10 = huit questions logistiques concrètes (parking, délais, devis payant, paiement, zone,
  contraintes du métier, urgences, avant la venue), réponse du client telle quelle, rien si pas de réponse ;
  mêmes huit champs dans le formulaire client et dans la section 10 du brief Markdown ; `/nouveau-site` en fait
  la FAQ sans inventer.

**Proposé** : `ff demonter` sur une page intérieure ; `/retouche` à l'essai sur une vraie phrase du fondateur ;
la piste A de la fromagerie : budget polices et contraste signalés par `ff prevol` ; relecteurs sur la piste C.

**À décider** : compte Cloudflare F&F ; qui achète le domaine ; dépôt commun ; création de la SAS.

## 16 oct 2026 — veille longue + skill /site-final v3 + premier test

**Fait**
- Démontage systématique de 25 sites récents de petites structures (fiche fixe, captures) :
  `docs/veille/demontages/` ; l'INDEX classe 10 gestes à transposer (portes « Réserver / Commander / Bon cadeau »
  dans la nav, barre d'actions en bas sur téléphone, horaires avec le jour courant, réalisations avec métadonnées…).
- Lecture complète de 15 dépôts de skills de design : `docs/veille/skills-profond-2026-10.md`.
- `/site-final` v3 : contrat de direction, captures validées, 11 passes de regard, deux relecteurs neufs avec barème
  de confiance et grille à plafonds, passes de verdict, seuil « montrer » à 7,5.
- Test de bout en bout sur une démo neuve, `fromagerie-ravanel` : 6,55 → 7,35 → **7,6 (montrer)** en trois tours.
- Le test a fait réparer l'usine : e-mail facultatif, `legal.demo`, `wording.faqTitle`, rayons de `terre`, deux
  faux positifs ; nouvelle commande `ff relecture`.

**Proposé** : les gestes 1 à 5 de l'INDEX des démontages (schéma : `bookingUrl` / `orderUrl` / `giftCardUrl`,
barre d'actions, composant Horaires) ; recapturer `atelier-lecerf` (rayons de `terre` changés) si la démo reste
sur le site du studio.

**À décider** : planifier `/veille` en ligne ; montrer la fromagerie sur le site du studio ou la garder comme
référence interne.

## 15-16 oct 2026 — premier tour (nuit, carte blanche du fondateur)

**Fait**
- `docs/GOUT.md` : la charte de goût, compilée de tous les retours d'octobre (signes IA, démos, mouvement,
  textes, site du studio, façon de travailler) + § 8 règles empruntées aux skills de design.
- Skills : `/site-final <slug>` (une passe jusqu'à « à montrer » : contrôles, relecture adverse par deux
  agents, planche regardée, un seul compte rendu) et `/veille` (ce tour, reproductible).
- `ff planche <slug>` : planche-contact du défilement à la molette, ordinateur et téléphone, dans
  `captures/planches/`. Dans la « définition de fait » de `docs/PROCESS.md`.
- Trois veilles écrites, sources citées : `techniques-2026-10.md` (34 fiches de techniques web, 18 sites réels
  lus dans leur CSS, 8 à implémenter), `outils-2026-10.md` (32 skills locales jugées, 28 règles empruntées,
  sources d'images, 18 polices OFL rares), `redondances.md` (directions, variantes, coquilles, presets, sites,
  polices : 5 actions prioritaires, matrice direction × coquille).
- Polices : 21 polices « par défaut des IA » retirées du registre (`ff studio` et 11 presets les proposaient
  encore) ; 6 nouvelles, OFL, rares : Ancizar Serif, Libre Caslon Condensed, Epunda Slab, Savate, Special
  Gothic, Intel One Mono. 11 presets corrigés.
- Direction `ephemeride` retirée (rejetée le 6 oct, 0 site, 0 preset). 17 directions.
- Numérotation décorative « 01 02 03 » retirée des sections et coquilles communes (process, index, magazine,
  sidebar, split, panneau du burger) ; « X ans d'expérience » calculé remplacé par l'année de création partout.
- `ff composer` : six familles de métiers de plus (automobile, bâtiment, alimentation, commerce, bien-être,
  numérique) ; `proof/logos` enfin proposé quand il y a des logos.
- Techniques implémentées (CSS pur) : FAQ native exclusive et animée (`<details name>`, `::details-content`),
  fondu des bords de marquee (`data-marquee-fade`), bouton ajusté aux capitales (`text-box` sur `.btn`).
- `ff ia` : alertes « effets interdits » (grain, spotlight, reflet, aurora) et « numérotation décorative ».
  `ff verifier` : bloc « règles empruntées » (`transition: all`, `100vh` seul, `user-scalable=no`, « Défilez »,
  flèches décoratives). Faux positifs du site du studio réglés (tuiles décoratives, téléphone de test).
- Deux sites jumeaux séparés par leur typographie (dubois-plomberie, lemaire-avocats).
- Docs : effets interdits marqués dans `ANIMATIONS.md`, moves 24/27 de `references.md` barrés, Safari 26 pour les
  scroll-driven animations.

**Proposé (pas fait, attend un fondateur)**
- Écarter les quatre groupes de directions trop proches par un seul token (`redondances.md` § 1) : touche des
  démos visibles sur le site du studio (chez-malo, studio-ambre).
- Fusions de variantes 44 → 39 (`hero/video`=`fullbleed`, `cards-hover`⊂`bento`, `contact/full`, `marquee-quotes`,
  `nav/split`, `about/timeline`) : des sites d'exemple les utilisent, à faire site par site.
- Techniques suivantes : piste `Proof/piste` (scroll-snap manuel), `data-parallax-native`, subgrid sur
  `Services/grid`, coquille `couverture`, navs en `popover`.
- Sources d'images : Flickr (clé gratuite) en priorité 3 de `ff photos`, Paris Musées en option.
- Dépendances : Astro 7 disponible (nous : 5.18), mineures à jour à faire dans un tour dédié.

**À décider (fondateurs)**
- Les décisions ouvertes du site du studio (prénoms/photo, 72 h et week-end, Essentiel/Complet, pages villes).
- Planifier `/veille` tous les 3 jours dans Claude Code en ligne (droit de pousser sur `main` à donner).

**Prochain volet** : bibliothèque (écarter les directions, fusionner les variantes), puis techniques (piste
manuelle, parallax natif).

Collecte 2026-10-18 : 9 styles (14 démontés sur 23 essayés ; navigateur Playwright 1194 relié à la version attendue, `FF_CHROMIUM=1`).

Collecte 2026-10-19 : 10 styles (16 démontés sur 31 essayés ; Awwwards/land-book bloqués, sites choisis à la main ; navigateur Playwright 1243 relié à la version 1194 par lien, `FF_CHROMIUM=1` ; 6 fiches trop maigres écartées : cosmos, monopo, nobu, casalupo, chateaumarmont, borgobrufa ; 10 atomes valides, champs non mesurés laissés « à juger »).
- Collecte 2026-10-20 : 22 styles (atomes mesurés ; 12 sites refusés par le réseau ou bloquant les navigateurs sans tête : farmgirlflowers, bluebottle, sezane, sanjosehotel, bakerandspice, vitra, atelierdeschefs, cabanes-lesbains, andtheregoes, leclairieur, maisonmargiela, maisonsimons, mariagefreres).
- Collecte 2026-10-21 : 20 styles (atomes mesurés ; svenskttenn refusé par le réseau (429) ; navigateur Playwright 1243 relié à la version 1194 par lien, `FF_CHROMIUM=1` ; mouvement, premier écran et traitement des photos laissés « à juger » quand non mesurés).
- Collecte 2026-10-22 : 24 styles (atomes mesurés ; refusés par le réseau : aesop, normann, mrporter, marimekko, mariagefreres, pommery, cafeomer, mamaisonbakery, labonnepioche, margaretha ; vipp, dammann et doublons buly/tartine écartés ; navigateur Playwright relié à la version 1194 par lien, `FF_CHROMIUM=1` ; rouje : palette mesurée illisible, laissée « à juger » ; mouvement, premier écran « à juger » quand non mesurés).
- Collecte 2026-10-22 (soir) : 18 styles (atomes mesurés ; navigateur Playwright relié à la version 1194 par lien, `FF_CHROMIUM=1` ; ~35 domaines refusés, sans h1 ou aux relevés incomplets écartés ; mouvement, premier écran « à juger » ; palettes tirées des fonds mesurés sans jugement visuel).
- Collecte 2026-10-23 : 31 styles (modèles Framer Marketplace ; atomes mesurés, photos, premier écran, profil de mouvement et palette principale laissés « à juger » ; navigateur Playwright relié à la version 1194 par lien, `FF_CHROMIUM=1` ; mesures : le tri des modèles SaaS/portfolio reste à faire à la veille).
- Collecte 2026-10-23 (deuxième) : 18 styles
- Collecte 2026-10-24 : 19 styles (siteinspire, minimal.gallery et petits commerces européens ; atomes mesurés, photos, mouvement et premier écran laissés « à juger » ; Chrome système relié par `FF_CHROMIUM=1` ; ~38 domaines refusés par le réseau ; toast et manufactum déjà étudiés, restaurés ; fiorista et holzmanufaktur : densité « à juger »).
- Collecte 2026-10-25 : 23 styles (petits commerces, maisons d'art de la table et d'objets ; atomes mesurés, photos, mouvement et premier écran laissés « à juger » ; `FF_CHROMIUM=1` ; ~30 domaines refusés ou injoignables).
Collecte 2026-10-26 : 22 styles (relevé mesuré, jugements photos/couleurs/mouvement restent « à juger »).
Collecte 2026-10-26 (soir) : 16 styles (Awwwards sites du jour ; relevé mesuré, jugements « à juger » ; edolus et meermohsin refusés par le réseau).
Collecte 2026-10-27 (mardi, Framer/Webflow/ThemeForest injoignables, remplacés par commerces et marques d'objets) : 17 styles (relevé mesuré, jugements « à juger » ; une vingtaine de sites refusés par blocage navigateur ou réseau).

Collecte 2026-10-27 (mardi : Framer, Webflow, Squarespace, ThemeForest) : 2 styles. Framer en 429, ThemeForest en 403, Webflow ne liste que des modèles ; 59 domaines de commerces sondés, 2 gardés (gjelina, maisonlandemaine), le reste écarté (polices IA, blancs neutres, bannière ou fenêtre bloquante, domaine parqué, boutique « bientôt », mauvais domaine), sous les 20 visés : le vivier de ce régime est épuisé par les deux collectes du matin.

Collecte 2026-10-27 (mardi, soir) : 14 styles (Squarespace seul joignable, Framer 429, ThemeForest 403 ; commerces et restaurants démontés, relevé mesuré, jugements « à juger » ; cafedelaposte et lecafe refusés par blocage navigateur ; ~30 domaines injoignables par le réseau).

Collecte 2026-10-28 (mercredi : siteinspire en 429, minimal.gallery et onepagelove lus, httpster ; commerces) : 18 styles (relevé mesuré par ff demonter + ff atomes mesurer ; palette posée depuis le relevé, polices libres, formes, photos, mouvement et premier écran laissés « à juger » ; hartbageri : palette non lisible, à juger). ~25 domaines injoignables ou bloqués (tunnel refusé, 502) : developments, puente, tequs, bedford, loaf, atelierdumois, kaffebar, junobakery, laundromat, sanchez, thuries, lebonbon, towpath, padstowdeli, bergamot, pidgin, hixon, petersham, brat, swashmotion, joshpuckett.

Collecte 2026-10-28 (mercredi, après-midi) : 6 styles (daylesford, buvette, nobleandstone, ateliermunro, holmes, fermedesaintemarthe ; FF_CHROMIUM=1 ; aesop, hotelsanjose, bakerandspice bloqués 403/502 ; ~15 autres domaines refusés par navigateur sans tête).
Collecte 2026-10-28 (mercredi) : 12 styles (21 sites tentés, 9 bloqués ou fermés aux navigateurs sans tête ; poilane et manufactum déjà étudiés, laissés intacts).
Collecte 2026-10-29 (jeudi) : 18 styles (aesop, normann, laguiole, hedleybennett, workstead, stampd, rhodes, brompton, maisonmargiela, lelabo, mastered, grovemade, mast, fellow, bluebottle, olivergal, hastens, romanee ; FF_CHROMIUM=1 ; awwwards et godly injoignables du cloud, sites choisis à la main ; ~12 pages vides/403 écartées ; atomes en brouillon, polices libres et régimes « à juger »).
- Collecte 2026-10-29 (jeudi, 2e passage) : 20 styles (démontage + relevé mesuré ; Awwwards/land-book bloqués par le réseau, sites choisis à la main : maison, table, soin, parfum). Navigateur : Chromium de Playwright (FF_CHROMIUM=1). Reste « à juger » : palette claire/sombre, photos, mouvement, premier écran.
- Collecte 2026-10-30 : 12 styles (bluebox, borgobrufa, developments, drams, huckleberry, ilforno, legrandcafe, littlewebsite, livesurface, mamashelter, rosevalley, vipp). Objectif de 20 non atteint : proxy qui bloque beaucoup de domaines, le reste déjà étudié.
- Collecte 2026-10-30 (vendredi, 2e passage) : 10 styles (farrowball, hotelbelleville, maisonbonnet, maisonferrand, maisonmanoukian, pierreoteiza, maisonlabiche, diptyque, aigle, silentbarber). Marketplaces et galeries bloqués par le proxy, sites choisis à la main ; skagen, lemeurice, cocomaya, cafeoslo, delvaux fermés aux navigateurs sans tête. Brouillons d'atomes, reste « à juger ».
- Collecte 2026-10-30 (vendredi, 3e passage) : 10 styles (tomdixon, atelierjupe, kaufmannmercantile, stellamccartney, leshommes, labelleassiette, lacuisinedecesar, lexondesign, olivela, larosee). Objectif de 20 non atteint : marketplaces bloqués, ~25 sites fermés aux navigateurs sans tête ou déjà étudiés. Brouillons, reste « à juger ».
- Collecte 2026-10-31 : 14 styles (4 sites refusés par le navigateur sans tête, remplacés par rien faute de sources joignables).
