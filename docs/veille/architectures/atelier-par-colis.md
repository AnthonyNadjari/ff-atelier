# atelier-par-colis : deux chemins vers l'atelier, venir ou envoyer

Volet 2a ter de `/veille`, tour du 26 oct 2026 (soir). Démontage automatique (`node scripts/ff.mjs demonter
https://www.lacordonneriealpine.fr/ --dossier docs/veille/architectures --nom cordonnerie-alpine` : fiche
[cordonnerie-alpine-demontage.md](cordonnerie-alpine-demontage.md), mesures `cordonnerie-alpine.json`, captures dans
`captures/`, non versionnées) et relevé au `curl` (Cordonnerie Alpine : accueil et `/services/ressemelage-chausson-escalade/` ;
AGH : accueil et `/page/1-livraison` ; EB Ressemelage : accueil). On reprend la construction, jamais les textes, images,
logos ou code des sources.

## Sources

- **La Cordonnerie Alpine** (cordonnier à Albertville, Savoie, depuis 2017 ; deux personnes ; spécialiste du
  ressemelage de chaussons d'escalade et de chaussures de montagne, mais aussi cordonnerie de ville, clés, couture,
  affûtage). Site Jimdo. URL lues le lundi 26 oct 2026 : `https://www.lacordonneriealpine.fr/` (Chrome, 1440x900 et
  390x844), `/robots.txt` (délai de 5 s respecté), `/services/ressemelage-chausson-escalade/`.
- **AGH, Atelier général horloger** (Lectoure, Gers ; réparateur agréé de plusieurs marques) : « Faites réparer votre
  montre sans vous déplacer », envoi en point relais, devis par e-mail, suivi des réparations dans le compte client.
  `https://agh-atelier-horloger.com/`, `/page/1-livraison` (la page de la demande de réparation n'a pas répondu).
- **EB Ressemelage / Relais Cordo** (ressemelage de chaussons d'escalade par colis) : « Comment fonctionne notre
  service ? », tarifs de réexpédition, « Avant de commander : ce qu'il faut savoir ». `https://eb-ressemelage.com/`.
- Trouvées en cherchant « ressemelage par correspondance » et « réparation de montre par colis ».

## Pages

La Cordonnerie Alpine : cinq (la cordonnerie, ressemelage de chaussons d'escalade, ressemelage de chaussures de
montagne, réparation de matériel de montagne, cordonnerie traditionnelle) et les mentions. Chaque page de prestation :
les ressemelages possibles, chacun avec photos avant et après et **son prix à la paire**, les gommes, puis **« Comment
effectuer la réparation ? »** : directement à l'atelier, ou par colis (frais de port retour par nombre de paires, fiche à
imprimer et joindre, délai de 10 à 15 jours). AGH : boutique, « Faire réparer ma montre » (demande en ligne), espace
pro, prestations à prix « à partir de ».

## Navigation

Cordonnerie Alpine : une barre à cinq entrées qui nomment les **types d'objets** (chaussons, chaussures de montagne,
matériel, ville). AGH : la boutique, puis « Faire réparer ma montre » en bouton à part dans la barre.

## Ordre de l'accueil (mesuré, téléphone et ordinateur)

1. Photo de l'atelier avec le logo en tête ; **l'état du moment en titre** (« en raison d'une surcharge de travail,
   l'atelier limite les réparations par correspondance ; contactez-moi avec photos avant envoi »).
2. Ce que fait l'atelier (spécialité montagne, mais aussi la ville, les clés, la couture, l'affûtage), photos de travaux.
3. Le cordonnier, la règle « réparer, recycler, réutiliser », l'histoire (2017), **l'équipe** (le fondateur, l'apprentie).
4. Le matériel de l'atelier (presses, machines à coudre, semelles en stock).
5. **Les deux chemins** : « Rendez-vous directement à l'atelier » (jours et heures) et « Par correspondance, envoi possible
   de colis » (l'adresse du colis, téléphone, e-mail) ; plan d'accès.
6. L'affiche du commerce (« directement à l'atelier ou par correspondance »).

## Contact et téléphone

Téléphone et e-mail en texte, en bas de l'accueil (aucun lien `tel:` mesuré) ; « écrire avec photos avant d'envoyer ».
L'usine garde le socle : téléphone en haut, cliquable.

## Preuves

Photos avant et après de chaque ressemelage ; le matériel ; l'équipe nommée ; l'ancienneté (2017). Aucun avis sur le
site (l'usine met ceux du client s'il en a).

## Style relevé (DOM calculé)

Roboto partout (h1 40 px), Russo One sur le logo et la nav ; blanc et gris très clair `#f6f6f6`, une photo d'atelier fixée
derrière toute la page ; aucune animation (transitions de couleur 0,3 s).

## Ce qui la rend différente du déroulé réflexe

- **Le client n'est pas forcément là** : l'atelier sert la vallée ET la France entière. Le site dit deux chemins dès
  l'arrivée, et le second (envoyer) est un **voyage en étapes** : où est l'objet, qui fait quoi, combien coûte le retour,
  quel délai, ce qu'il faut joindre.
- **L'état du moment** (« l'atelier limite les envois ») est la première information : un atelier débordé le dit.
- Différence avec `tournee-semaine` (le commerce se déplace) : ici l'objet se déplace. Avec `outil-calendrier` : là on
  réserve des dates, ici on suit un colis. Avec `lieu-fixe` : là on vient, ici on peut ne jamais venir.

## À quels clients elle convient (selon leurs données)

- Atelier de réparation dont les clients viennent de loin : cordonnier spécialisé (chaussons d'escalade, chaussures de
  montagne, bottes), horloger, luthier, réparateur de stylos, d'appareils photo, de poupées, affûteur, relieur,
  restaurateur de bijoux ou de céramiques.
- Données nécessaires : **au moins 3 étapes du voyage** (où est l'objet, ce qui se passe), **des prestations à prix**
  (`services[].lignes`), l'adresse de l'atelier ; mieux avec le délai, les frais de retour, la fiche à joindre, l'état du
  moment.
- Ne convient pas : l'urgence (un colis met des jours), un métier qui se déplace chez le client.

## Comment l'usine la réalise

- Coquille **`colis`** : en tête **les deux chemins** en portes côte à côte, même au téléphone (Venir à l'atelier : la rue ;
  Envoyer par colis : le délai) ; puis le h1, le métier à la ville et l'ancienneté, l'état du moment (`envoi.etat`), le
  téléphone, la note, « La marche à suivre ». Puis **le voyage du colis** : une piste horizontale qu'on fait glisser
  (`scroll-snap`, deux flèches posées par le script, la section prend le focus au clavier, jamais la molette détournée),
  une carte d'introduction (délai, avant d'envoyer), une carte par étape (où est l'objet, en grand ; ce qui se passe),
  et au bout l'adresse du colis, les frais de retour, la fiche. Puis les prestations à prix (`services/carte-prix`), les
  questions d'avant l'envoi (`faq`, si le client en a), l'atelier (`about/story`), les avis, « Venir à l'atelier » sur
  l'encre (`id="contact"`, adresse, itinéraire, horaires du jour, téléphone), un pied court.
- Page `/envoyer` : la marche à suivre entière (état, délai, Appeler, Écrire avant d'envoyer, l'adresse du colis, avant
  d'envoyer, les étapes, les frais de retour, la fiche, les prestations) ; une page par prestation (gabarit `porte`).
- La nav nomme « Envoyer par colis » en tête.

## Ce qui manquait (dit précisément)

1. `envoi` dans le schéma (état, délai, étapes où et quoi, frais de retour, conditions, fiche, adresse du colis).
2. Module pur `src/lib/colis.ts` (étapes complètes, piste dès trois, adresse d'envoi, lien de nav).
3. Coquille `colis`, route `/envoyer`, `wording.envoi`.
4. Mesure `envoi` de `donneesManquantes`.

## Signes IA à NE PAS reprendre

- La photo d'atelier fixée derrière toute la page, le texte posé dessus.
- L'avertissement écrit en h1 : il devient une note sous le h1.
- Le plan d'accès en image, l'affiche du commerce en fin de page.

## Codée dans l'usine (26 oct 2026)

`layout: { architecture: 'atelier-par-colis' }` (`src/lib/architectures.ts`). Les quatre manques sont faits. Restent :
la demande de réparation en ligne avec photos (le formulaire existant prend un message, pas encore de pièces jointes),
le suivi d'une réparation (AGH : compte client), les photos avant et après par ligne de prix.

Preuve : site jetable (cordonnier de démonstration à Albertville, trois rubriques à lignes de prix, quatre étapes, frais
de retour, trois questions d'avant l'envoi ; copie de `_exemple` sans photo, supprimé), `ff verifier` vert hors données de
test (`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tous les sites du registre : 0,63 au premier écran
téléphone (toits-cie), 0,59 ordinateur (fromagerie-ravanel-b), 0,64 au déroulé (prospect-epi-dor-c, le seul autre site
en « défilement horizontal »). Essais refusés : le h1 en tête et les deux chemins en grandes cartes sous le téléphone
(0,70 au premier écran téléphone de cantine-roulante, 0,72 au déroulé de prospect-epi-dor-c : même modèle, même longueur,
trois blocs) ; les portes remontées au-dessus du h1 mais sans l'atelier ni les questions (0,68 au déroulé du même). Passé
de justesse au déroulé : avec de vraies photos (part d'image), le site s'éloigne encore de prospect-epi-dor-c.
