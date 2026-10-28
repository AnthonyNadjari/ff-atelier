# annonces-biens : le site d'une agence immobilière de quartier est sa vitrine

Volet 2a ter de `/veille`, tour du 28 oct 2026 (tour 14). Relevé au `curl` (HTML servi) de l'accueil, de la liste des ventes,
d'une page de bien et de la page des honoraires de Royal Immo, de l'accueil de Giboire, plus un démontage automatique de
l'accueil de Royal Immo (`ff demonter`, Chromium 390x844 ; la fenêtre des cookies couvre le premier écran, capture gardée
telle quelle : `annonces-biens-source.jpg`). On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Royal Immo** (agence familiale au Mourillon, Toulon, depuis 2005) : [royal-immo.fr](https://www.royal-immo.fr/),
  [ventes](https://www.royal-immo.fr/vente/1), [honoraires](https://www.royal-immo.fr/honoraires), lus le mercredi
  28 oct 2026. Menu **Acheter / Louer**, chacun par type (maison ou villa, appartement, studio, garage, « tous nos biens »),
  puis Vendre / Faire gérer, Syndic, Nos agences, Contact ; sur l'accueil, la recherche (type, rayon, budget, « Voir les 177
  annonces »), **« Faites estimer votre bien par un professionnel »**, la présentation de l'agence familiale ; une **page par
  bien** : titre, commune et code postal, prix, descriptif, tableau des caractéristiques (surfaces, pièces, chauffage,
  exposition, année), prix de vente et **« Les honoraires d'agence seront intégralement à la charge du vendeur »**, charges,
  taxe foncière, le négociateur avec son téléphone, la demande ; « Nos honoraires » en pied de page.
- **Giboire** (groupe familial rennais, depuis 1923) : [giboire.com](https://www.giboire.com/), lu le même jour. h1 **« Votre
  projet commence ici »** et quatre portes : Acheter, Louer, Estimer, Faire gérer ; la recherche sous les portes.

## Pages

Royal Immo : une quinzaine plus une par bien (accueil, ventes et locations par type, immobilier d'entreprise, vendre,
gestion locative, syndic, agences, équipe, estimation, alerte e-mail, honoraires, contact). Giboire : achat, location, neuf,
entreprise, terrains, estimer, faire gérer, conseils, agences.

## Ce qui fait vendre

Ce qu'on vient voir chez une agence, ce sont ses biens, et le vendeur cherche à qui confier le sien. L'usine en fait l'accueil :
la vitrine en onglets Acheter / Louer (photo, commune, surface, pièces, prix, classe énergie, « Exclusivité »), puis la porte
du vendeur « Faire estimer votre bien » sur l'encre, puis l'agence et ses avis. Chaque bien a sa page avec ce que la loi
demande dans une annonce (prix honoraires inclus et qui les paie, classe énergie et climat en échelle, dépenses d'énergie,
charges, surface) ; l'agence publie son barème (`/honoraires`). Une mention absente n'est jamais remplie : le build la signale.

## Signes à NE PAS reprendre

Fenêtre de cookies qui couvre le premier écran, titres d'annonces en capitales criées, recherche à douze filtres pour vingt
biens, calculatrice de crédit, « coup de cœur » sans critère, connexion à l'espace client dans l'en-tête, libellés techniques
non traduits (« TRAD_PAMPERO_Caracteristique »).

## Codée dans l'usine (28 oct 2026)

`layout: { architecture: 'annonces-biens' }` (`src/lib/architectures.ts`) : coquille `biens` (`src/shells/biens.astro`),
`biens` dans le schéma (`liste[]` : slug, titre, projet vente / location, type, commune, code postal, prix, honoraires,
surface, pièces, chambres, terrain, `dpe`, `ges`, énergie, charges, exclusivité, référence, texte, caractéristiques, photos,
négociateur ; `estimer` ; `honoraires` en lignes), `src/lib/biens.ts` (`biensComplets`, `projetsDe`, `typesDe`,
`prixLisible`, `resume`, `echelle`, `mentionsManquantes`, `lienBiens`), `src/pages/biens/[...index].astro` et `[slug].astro`,
`src/pages/honoraires/[...index].astro`, `wording.biens` et `wording.estimer`, mesure `biens`, pied `minimal`, tiroir de
contact. Restent : le flux du logiciel de l'agence (au-delà d'une trentaine de biens), l'alerte e-mail, la recherche par
budget.

Preuve : site jetable (agence d'essai à Toulon, trois biens à vendre et deux à louer aux chiffres d'essai, barème d'essai,
deux avis d'essai ; sans photo, supprimé), `ff verifier` vert hors téléphone et e-mail de test (`ff a11y`, `ff typo`, `ff ia`
compris), `ff ressemblance` contre tous les sites du registre : plus proches prospect-epi-dor-b 0,46 / 0,28 / 0,62, veto-du-drac
0,38 / 0,44 / 0,62 (téléphone / ordinateur / déroulé ; longue page à ancres, déroulé héros, outil, outil, à propos, avis). Avec
`salles-capacites` 0,53 / 0,49 / 0,73 : même début (héros, outil), métiers sans recoupement, jamais en pistes sœurs. Essai
refusé : les avis avant l'agence (0,68 de prospect-epi-dor-b). Capture téléphone : `annonces-biens-essai.jpg` ; source :
`annonces-biens-source.jpg`.
