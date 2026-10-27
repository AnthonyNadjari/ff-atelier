# estimation-etapes : le site d'un déménageur commence par la demande d'estimation

Volet 2a ter de `/veille`, tour du 27 oct 2026 (soir, tour 12). Relevé au `curl` (HTML servi) de trois sites, plus les
démontages automatiques déjà faits par la veille du marché le même jour (`docs/veille/marche/framer-movers.md`,
`demenagements-rigoulet.md`, `artisans-du-batiment.md`). On reprend la construction, jamais les textes, images, logos ou
code des sources.

## Sources

- **Movers** (modèle Framer de déménageur, Aureus.Design, rang 6 de la catégorie Home Services, le plus vendeur des
  modèles vus au marché depuis Lintel) : [movers.framer.media](https://movers.framer.media/), lu le mardi 27 oct 2026.
  Contenu factice (Calgary, numéro en 555, photos de banque) : on n'en garde que le plan.
- **Déménagements Rigoulet** (déménageur familial à Bouillargues, Gard, depuis 1964 ; refonte d'AUDA Design publiée le
  11 février 2026) : [demenagement-rigoulet.com](https://www.demenagement-rigoulet.com/) et
  [demenagement-rigoulet.com/devis](https://www.demenagement-rigoulet.com/devis/).
- **Les Artisans du Bâtiment** (rénovation et dépannage, six agences en Île-de-France et à Antibes, depuis 1999) :
  [les-artisans-du-batiment.com](https://www.les-artisans-du-batiment.com/), formulaire de devis dans le premier écran
  du téléphone.
- Trouvées par la veille du marché du 27 oct 2026 (CE-QUI-VEND.md, ligne « Formulaire d'estimation en étapes au premier
  écran », 1 / 18, et « Bouton devis ou estimation nommé », 45 / 108).

## Pages

Movers : 24 pages (accueil, cinq prestations, cinq régions, tarifs, blog, à propos, contact, **« Get a quote » à part**).
Rigoulet : 24 pages, une par prestation (déménagement national, international, groupage, entreprise, garde-meubles,
self-stockage, objets lourds, œuvres d'art, location de monte-meubles, vente d'emballage), particuliers et
professionnels séparés dans le menu, **« Devis en ligne » : une page à part**, toujours dans la barre. Les Artisans du
Bâtiment : 76 pages (sept services, 49 articles, devis).

## Navigation

Les trois mettent la demande au même rang que le téléphone : Movers « Get Fee Quote » et le numéro en boutons dans la
barre ; Rigoulet « DEVIS EN LIGNE » et « 04 66 84 89 80 » à droite de la barre ; Les Artisans du Bâtiment « Intervention
& Devis Express » en barre haute avec le numéro en gros bouton.

## Accueil (Movers, mesuré)

La ville et les notes (Google 4,9 sur 1 408 avis, Yelp) sous un bandeau d'avis ; le h1 ; **à droite du h1, le formulaire
d'estimation en deux étapes**, titré « Get Your Free Estimate », « Takes 15 seconds, 100 % free » : étape 1 le type
(appartement, commercial, emballage, garde-meubles, longue distance), départ, arrivée, date, taille du logement ;
étape 2 le nom, l'e-mail, le téléphone (facultatif) ; « Next », puis « Get My Free Quote ». Ensuite les prestations en
vignettes (chacune vers sa page), les témoignages, l'équipe, trois formules à prix, le déroulé en quatre étapes, les
régions, les questions, le blog. **C'est la transposition** : le premier geste du visiteur n'est pas de lire mais de
dire ce qu'il déménage ; la demande commence dans le premier écran (téléphone compris, ce que Movers rate au téléphone
et que Les Artisans du Bâtiment réussit), en étapes courtes qu'on peut finir en un quart de minute.

Les Artisans du Bâtiment, téléphone : barre haute rouge, numéro, deux portes (chantier / dépannage), puis « Choisir un
service » (liste), nom, prénom, e-mail, téléphone, « Obtenir un devis » : une seule étape, mais elle commence dans le
premier écran. Rigoulet : la demande est une page à part ; l'accueil est un diaporama, les prestations, les avis
Google recopiés (Trustindex), les logos de clients.

## Page intérieure (une prestation)

Rigoulet : le nom de la prestation, le texte, une photo de leurs camions, les avis, « Devis en ligne ». L'usine : la page
du service (gabarit `fiche`), plus une porte « Estimer ce déménagement » qui ouvre la demande avec la prestation déjà
choisie (`/estimation?projet=<slug>`).

## Contact et preuves

Le téléphone dans la barre (Rigoulet : 7 liens `tel:`), la demande, l'adresse du dépôt (Rigoulet : « Km 4 RD 6113 Rte
d'Arles »), les avis Google (Rigoulet, recopiés avec les prénoms), « depuis 1964 ». La demande dit ce qui se passe
ensuite (Les Artisans du Bâtiment : « devis en 24 à 48 h » dans la FAQ) : l'usine le met à côté du formulaire.

## Style des sources (pour mémoire, non repris)

Movers : Geist et Inter Display, pilules (8 sur 24), mots qui tombent lettre par lettre, badge « Made in Framer ».
Rigoulet : Manrope, Space Grotesk, rouge et bleu nuit d'Elementor. On ne reprend que l'architecture ; le style vient des
atomes (`ff melanger`).

## Ce qu'il faut à l'usine

- `estimation` dans le schéma : `questions[]` (nom, libellé, type choix / texte / date / nombre, choix, unité, aide,
  obligatoire), `promesse` (« Réponse sous 24 h », dite par le client), `apres[]` (ce qui se passe après la demande).
- Le formulaire partagé (`ContactForm.astro`) en étapes : 1 le projet (les services du client, en grandes cases à
  cocher), 2 les questions du client, 3 les coordonnées ; « Étape 1 sur 3 », Suivant / Retour ; **sans script, toutes
  les étapes l'une sous l'autre** et le même envoi ; chaque étape vérifiée avant la suivante.
- Une coquille dont l'accueil est la demande : h1, métier à la ville, téléphone, note, et le formulaire posé à côté
  (ordinateur) ou dessous (téléphone, sa première étape visible sans défiler) ; ce qui se passe après ; puis les
  prestations (une page chacune), les avis, les communes desservies.
- `/estimation` (la demande seule, la prestation choisie par `?projet=`) et la porte sur chaque page de prestation.

## Convient à

Métier où l'on demande un prix avant tout et où quelques réponses suffisent à le chiffrer : déménageur, couvreur,
paysagiste (création), poseur de clôtures, de fenêtres ou de cuisines, ravalement, élagage, débarras, nettoyage de fin
de chantier ; 2 prestations au moins et 2 questions que le client pose déjà au téléphone. Pas pour l'urgence (on appelle,
`grille-urgence`), ni pour un prix connu d'avance (`formules-comparees`, `carte-des-soins`).

## Signes à ne pas reprendre

« Takes 15 seconds, 100 % free » (promesse que le client n'a pas faite : la promesse vient du brief ou rien) ; listes
déroulantes de villes d'un autre pays laissées dans le modèle ; bandeau « 5 050 avis cinq étoiles » ; mots révélés
lettre par lettre ; assistant ChatGPT qui s'ouvre seul (Les Artisans du Bâtiment) ; compteurs à 0 sans JavaScript.

## Codée dans l'usine (27 oct 2026, soir)

`layout: { architecture: 'estimation-etapes' }` (`src/lib/architectures.ts`) : coquille `estimation`
(`src/shells/estimation.astro`), `estimation` dans le schéma (`questions[]`, `promesse`, `apres[]`), `src/lib/estimation.ts`
(`questionsValides`, `etapesDe`, `lienEstimation`, `projetDe`, `lignesDeDemande`), `ContactForm` en étapes (prop `etapes`,
`data-etapes` : le projet en grandes cases, les questions, les coordonnées ; Suivant vérifie l'étape, Retour ; sans script
tout visible ; les réponses rejoignent le message pour tous les fournisseurs), `src/pages/estimation/[...index].astro`,
porte « Demander une estimation » réglée sur la prestation (`/estimation?projet=<slug>`) sur chaque page de prestation,
nav : les prestations en pages puis la demande, `wording.estimation`, mesure `estimation`, pied `columns`. `ff verifier`
ne compte plus les champs d'un formulaire en étapes (une étape à la fois). Restent : l'estimation chiffrée en direct (prix
au volume) que les sources ne donnent pas non plus, l'envoi de photos dans la demande.

Preuve : site jetable (déménageur d'essai, quatre prestations, quatre questions dont deux obligatoires, trois étapes après la
demande, deux avis d'essai ; copie de `_exemple`, sans photo, supprimé), `ff verifier` vert hors téléphone de test, parcours
des étapes joué dans Chromium (Suivant refusé sans projet, puis sans ville de départ ; `?projet=bureaux` coche la case et
ouvre l'étape 2 ; aucune erreur), `ff ressemblance` 0,50 / 0,62 / 0,64. Premier écran au téléphone : h1, métier à la ville,
numéro, note, et la première étape avec Suivant visibles sans défiler.
