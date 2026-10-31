# nuancier-matieres : le site d'un artisan d'une matière se choisit par la matière

Volet 2a ter de `/veille`, tour 19 du 30 oct 2026. Page « Essence bois » de la Menuiserie Pipault lue par WebFetch (le serveur
coupe les connexions de `curl` et de Chromium : pas de capture), page « Essences » et accueil de Boud'bOis lus au `curl` ; capture
pleine page des essences de Boud'bOis au téléphone (Chromium 390 px ; gardée : `captures/nuancier-matieres-source.jpg`). On reprend
la construction, jamais les textes, images, logos ou code des sources.

Une construction qui n'est ni « onglets » ni « liste de services » : **la matière d'abord**. Le client d'un menuisier, d'un marbrier
ou d'un tapissier choisit « en quoi ? » avant « combien ? » ; l'accueil est le nuancier qu'on lui mettrait sous les yeux à l'atelier.

## Sources

- **Menuiserie et ébénisterie Pipault Florent**, Yonne, « De père en fils, depuis 1898 » :
  [page Essence bois](https://www.menuiserie-pipault-89.com/menuiserie_ebenisterie_essences_bois.php), lue le vendredi 30 oct 2026.
  « Essence bois » est une entrée de la barre (Accueil, Savoir-faire, Réalisations, Essence bois, Contact) ; dix essences (robinier
  dit acacia, châtaignier, chêne, frêne, hêtre, noyer, pin sylvestre, poirier, sapin, teck), chacune avec sa photo (loupe au survol
  sur le fil) et les mêmes caractéristiques : aubier, duramen, grain, densité, **dureté (N/mm)**, contre-fil, durabilité, usages
  (« Parquet, Extérieur »).
- **Boud'bOis**, bois massif local « de l'arbre au plateau » : [boudbois.fr](https://www.boudbois.fr/) et
  [ses essences](https://www.boudbois.fr/essences), lus le même jour. Sur l'accueil « Nos essences disponibles » (six photos du fil,
  « Toutes nos essences ») ; la page Essences : « 19 essences disponibles », une grande photo de la planche par essence et son nom,
  « Chaque essence avec sa fiche, son usage et son prix moyen ».

## Pages

Pipault : accueil, savoir-faire (bois, PVC, aluminium, de A à Z, porte fermière), réalisations, essence bois, contact. Boud'bOis :
stock, projets à construire, essences et une fiche par essence, produits, vendeurs, qui sommes-nous, où nous trouver.

## Navigation

Pipault : barre classique, « Essence bois » au même rang que Réalisations. Boud'bOis : « Le stock, Construire, Essences, Produits,
Vendeur ».

## Ordre de l'accueil (construction gardée)

1. h1, métier à la ville, ancienneté, la phrase du client sur ses matières, note, téléphone, **quatre échantillons posés** (les
   premières matières, chacune vers sa page) ; à côté **« Pour quel usage ? »** : chaque usage du client (Parquet, Escalier, Meuble,
   Extérieur) et ses matières, un index à filets lisible d'un coup (pas d'onglets).
2. **Le nuancier** : le mur des matières, la photo du fil ou du grain en grand carré avec une ombre portée réelle, le nom, l'origine ;
   les matières sans photo nommées dessous (jamais une pastille vide).
3. **L'échelle du client** (la dureté de Pipault) : une barre par matière, à sa vraie valeur, de la plus tendre à la plus dure ; une
   matière sans valeur n'y est pas.
4. Les avis s'il y en a ; l'atelier (où voir les échantillons, adresse, horaires, téléphone) ; le pied avec les pages des services.

`/matieres` : le tableau comparé (la valeur sur l'échelle, les caractéristiques que deux matières au moins partagent, usages, prix),
en fiches à filets au téléphone, puis les questions. Page d'une matière : photo en grand, nom, autre nom et origine, fiche à filets,
l'appel, ce que le client en dit, sa place sur l'échelle entre la matière du dessous et celle du dessus, les autres matières.

## Ce qui fait vendre

Le choix de la matière est la première conversation chez un menuisier ou un marbrier, et la plus longue au téléphone ; la mettre en
tête du site, avec les vraies valeurs que l'artisan connaît, montre le savoir-faire sans le raconter. Chaque matière a sa page
(« escalier en chêne Auxerre »).

## Signes à NE PAS reprendre

Loupe au survol (rien au téléphone), tableau de chiffres sans unité, une erreur d'attribut alternatif qui nomme une autre essence
(Pipault), « Voir le stock » répété sous chaque essence et boutons pilules (Boud'bOis).

## Codée dans l'usine (30 oct 2026)

`layout: { architecture: 'nuancier-matieres' }` (`src/lib/architectures.ts`) : coquille `matieres` (`src/shells/matieres.astro`),
`matieres` dans le schéma (`intro`, `echelle` : nom, unité, bas, haut ; `echantillons` ; `liste[]` : slug, nom, autre nom, origine,
photo, valeur, caractéristiques, usages, prix, texte), `src/lib/matieres.ts` (`matieresCompletes`, `nuancier`, `surEchelle`,
`parUsage` sans doublon de casse ni d'accent, `colonnes`, `valeurDe`, `voisinesSurEchelle`, `lienMatieres`), pages `/matieres`
(FAQPage) et `/matieres/<slug>`, `wording.matieres`, mesure `matieres` (4 matières avec photo), nav « Nos matières » en tête,
sections : avis seulement, pied `liens`, tiroir de contact. Restent : les réalisations rangées par matière (`realisations[]` n'a
pas encore de champ matière), une échelle à deux valeurs (dureté et prix), le stock en temps réel de Boud'bOis.

`ff ressemblance` voyait le nuancier comme deux « bandeaux d'appel » et le premier écran à 0,73 de fromagerie-ravanel-b (h1 en haut,
numéro dessous, pas d'image) : nouveau modèle de navigation **« nuancier »** (`scripts/ff/deroule.mjs` : au moins quatre liens qui
portent chacun une photo carrée de même taille, deux par rangée) et les quatre échantillons au premier écran.

Preuve : site jetable (menuiserie d'essai à Auxerre, direction `lin`, sept essences aux valeurs d'essai plausibles non mesurées,
aucun avis ; photos d'illustration Wikimedia marquées, deux d'entre elles sans essence identifiée sont dites « un bois clair », « un
résineux » ; supprimé), `ff verifier` vert hors téléphone et e-mail de test (`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance`
contre tout le registre : aucune mesure au-dessus de 0,64 (premier écran au téléphone contre fromagerie-ravanel-b, à la marge du
seuil ; déroulé au plus 0,56) ; modèle « nuancier ». Capture : `captures/nuancier-matieres-essai.jpg` (premier écran et accueil au
téléphone, ordinateur, page d'un service, /matieres).
