# calendrier-fetes : l'accueil suit les fêtes de l'année, la prochaine d'abord, avec sa date limite

Volet 2a ter de `/veille`, tour du 25 oct 2026. Démontage automatique (`node scripts/ff.mjs demonter
https://fleuriste-lemans.fr/ --dossier docs/veille/architectures --nom touchard-fleurs` : fiche
[touchard-fleurs-demontage.md](touchard-fleurs-demontage.md), mesures `touchard-fleurs.json`, captures dans `captures/`,
non versionnées) et relevé au `curl` des pages intérieures (Deuil, Points de vente, FAQ). La même source avait été lue au
`curl` pour le marché le 23 oct (`docs/veille/marche/touchard-fleurs.md`, levier « la saison du moment en premier lien »).
On reprend la construction, jamais les textes, images, logos ou code de la source.

## Source

- **Touchard Fleurs** (fleuriste, Sarthe, entreprise familiale depuis 1986, six boutiques, livraison). URL lues le
  samedi 25 oct 2026 : `https://fleuriste-lemans.fr/` (Chrome, 1440x900 et 390x844), `/robots.txt` (Yoast : tout
  autorisé hors panier et administration), `/sitemap_index.xml`, `/categorie-produits/deuil/`, `/fleuriste-points-vente/`,
  `/faq/`.
- Limite : WordPress + Elementor + WooCommerce ; la boutique en ligne est un catalogue générique, seule l'ossature
  (fête du moment, occasions, livraison, boutiques) est reprise.

## Pages

Accueil ; boutique (centaines de produits, catégories par famille : bouquets, compositions, plantes) ; **une catégorie
par occasion** (amour, anniversaire, mariage, naissance, deuil, quotidien) ; **une catégorie par fête** (Toussaint ce
jour-là, filtre de la boutique) ; points de vente (six boutiques, horaires jour par jour, téléphone par boutique) ;
professionnels ; blog ; galerie ; FAQ ; réclamation ; légal.

## Navigation

Barre en haut, **la fête du moment en premier lien** (« Toussaint », précédée d'un émoji), puis la boutique, trois
familles, **Occasions** dépliée (cinq occasions), blog, galerie, professionnels ; recherche et panier. Le premier lien
change avec le calendrier (Toussaint fin octobre ; la source le change à la main).

## Ordre de l'accueil (mesuré, ordinateur)

1. Premier écran : **diapositives de la saison** (« Fêtez Halloween », « C'est la Toussaint »), chacune « Commandez en
   ligne » vers la catégorie de la fête ; aucun h1.
2. Quatre promesses : entreprise familiale et six boutiques, artisans fleuristes, sur mesure, **livraison en 4 h au plus
   dans 130 communes**.
3. Une trentaine de bouquets avec une fourchette de prix (« 33 € - 58 € »).
4. **Les occasions** : naissance, anniversaire, mariage, deuil, quotidien, une tuile haute chacune vers sa catégorie.
5. Chiffres (boutiques, salariés, références), « Une entreprise familiale depuis 1986 ».
6. Le bouquet sur mesure (« Parlez-nous de vous »).
7. **La fête encore** : « C'est la Toussaint avec … », vers sa catégorie.
8. Les boutiques (adresse, horaires de chacune), coups de cœur, trois articles datés, avis (4,1 sur 5, 11 avis),
   Instagram, pied (livraison, communes, paiement, liens).

## Page interne type

- **Une occasion** (Deuil) : la liste des produits, filtres par prix, couleur, taille ; rien sur le délai.
- **Points de vente** : une section par boutique, adresse, téléphone, horaires jour par jour.
- **FAQ** : **les heures limites** (« avant 8 h pour la matinée, jusqu'à 13 h pour la fin de journée »), commande jusqu'à
  deux mois à l'avance, règles des périodes de fête (fête des mères, Saint-Valentin, fin d'année), livraison au cimetière
  pour un enterrement.

## Contact et téléphone

Pas de `tel:` sur l'accueil (mesuré) ; un téléphone par boutique sur la page des points de vente ; commande en ligne
d'abord ; un formulaire « Vous avez des questions ? » en pied.

## Preuves

L'ancienneté (1986), six boutiques, la note des avis (4,1 sur 5, onze avis), la livraison chiffrée (4 h, 130 communes).

## Style relevé (DOM calculé)

Titres **Italiana** (didone fine), texte **Montserrat** (18 px ordinateur, 13 px téléphone), nav et boutons en capitales
espacées ; fond blanc et gris très clair `#f6f6f6`, encre noire, **rouge brique `#ce3622`** (5 % des fonds, 15 % du
texte), taupe `#a98979` ; photos des bouquets détourées en ellipse (`clip-path` sur 99 éléments), lettrines géantes
(« P », « B ») en rouge ; boutons pilules (40 sur 41 à l'ordinateur) ; transitions de 0,3 à 0,5 s, carrousel Swiper.

## Ce qui la rend différente du déroulé réflexe

- **Le temps commercial range l'accueil** : ce qui vient en premier dépend de la date (la prochaine fête), pas d'un ordre
  fixe ; la question n° 1 est « qu'avez-vous pour dimanche, et jusqu'à quand je peux commander ? ».
- **La date limite et l'heure limite** sont des données du site (commande avant tel jour, livrée aujourd'hui avant 13 h).
- Différence avec `saisons-sorties` : là deux saisons rangent des activités toute l'année ; ici des fêtes datées, courtes,
  avec une date limite de commande. Avec `ardoise-du-jour` : là l'offre change avec le jour de la semaine ; ici avec le
  calendrier de l'année. Avec `cartes-empilees-agenda` : là des rendez-vous où l'on vient ; ici des commandes à passer
  avant une date.

## À quels clients elle convient (selon leurs données)

- Fleuriste (Toussaint, Saint-Valentin, fête des mères, fête des grands-mères), chocolatier (Pâques, Noël), pâtissier
  (galettes, bûches), boucher-traiteur et poissonnier (fin d'année), caviste, primeur ; mieux avec une livraison.
- Données nécessaires : **au moins 2 fêtes** avec leurs dates et ce qui est préparé (lignes, prix si donnés) et **au moins
  2 occasions** (services, une page chacune) ; mieux avec la date limite de commande, la livraison (zone, délai, prix,
  heure limite), une photo par fête.
- Ne convient pas : offre sans temps forts (`lieu-fixe`), offre qui change chaque jour (`ardoise-du-jour`), urgence.

## Comment l'usine la réalise

- Coquille **`fetes`** : en tête h1, « métier à ville », ancienneté, téléphone, note Google ; **le calendrier en piste
  horizontale** (une carte par fête à venir, la date en grand, la date limite, les lignes à prix, Commander ou Appeler ;
  défilement manuel `scroll-snap`, deux flèches posées par le script ; le navigateur ouvre la piste sur la fête en cours,
  sinon la prochaine, et la marque) ; **la livraison** sur l'encre (zone, délai, prix ; « commandé avant 13 h : livré
  aujourd'hui » calculé dans le navigateur) ; les avis ; **les occasions** en grandes portes ; l'histoire en une phrase ;
  la boutique (`id="contact"`).
- Pages `/fetes` (le calendrier par mois, la fête en cours marquée dans le navigateur) et `/fetes/<slug>` (h1 « fête chez
  commerce », période, date limite, lignes, photo, occasion, livraison, la suite) ; JSON-LD `OfferCatalog` valable du
  début à la fin de la fête.
- Les fêtes passées tombent au build ; entre deux builds, c'est le navigateur qui choisit la fête du moment.

## Ce qui manquait (dit précisément)

1. `fetes[]` dans le schéma (slug, nom, début, fin, date limite, phrase, lignes à prix, photo, occasion liée).
2. `livraison` (zone, délai, prix, heure limite, jours).
3. Routes `/fetes` et `/fetes/<slug>`, lien de nav en tête (`wording.fetes`).
4. Module pur `src/lib/fetes.ts` (fêtes à venir, fête du moment, état de la commande, livraison du moment, dates).
5. Composants `FeteDuMoment` (la piste) et `Livraison` (l'heure limite dans le navigateur).
6. JSON-LD `OfferCatalog` (`feteLd`, `src/lib/jsonld.ts`), mesure `fetes` de `donneesManquantes`.

## Signes IA à NE PAS reprendre

- Les émojis dans la nav et les adresses (fleur, épingle, horloge).
- Les chiffres mis en scène (« 97 % clients satisfaits », « 107 références ») et les promesses à pictogrammes.
- Le carrousel qui tourne seul ; ici la piste ne bouge que sous la main.
- Les boutons pilules, les capitales espacées, les lettrines décoratives géantes.
- La fête du moment changée à la main (fausse dès qu'on oublie) : elle se choisit dans le navigateur.

## Codée dans l'usine (25 oct 2026)

`layout: { architecture: 'calendrier-fetes' }` (`src/lib/architectures.ts`). Les six manques sont faits. Restent : la
fête en tête de la nav qui change avec la date (le lien reste « Les fêtes », la nav est rendue au build), une page par
occasion à la grammaire des fêtes (la page de service sert), plusieurs boutiques (`lieux[]` existe, non branché ici).

Preuve : site jetable (fleuriste, quatre fêtes, quatre occasions, livraison avec heure limite, copie de `_exemple` sans
photo, supprimé), `ff verifier` vert hors données de test (`ff a11y` et `ff typo` compris), `ff ressemblance` 0,58 au
premier écran téléphone et 0,62 ordinateur (cantine-roulante), 0,62 au déroulé (prospect-epi-dor-c, l'autre site à
défilement horizontal). Essais refusés : la fête en panneau simple puis en onglets avec occasions, livraison et boutique
dans l'ordre réflexe (déroulé 0,66 à 0,87 de cinq sites), la piste sans bandeau de livraison séparé (0,65 de
prospect-epi-dor-c).
