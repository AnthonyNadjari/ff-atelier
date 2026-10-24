# tournee-semaine : l'accueil dit où est le camion aujourd'hui, le site se range par étape de la tournée

Volet 2a ter de `/veille`, tour du 24 oct 2026. Relevé au `curl` (HTML et CSS servis, sans navigateur) : mesuré sur le
code, pas sur capture. On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- Principale : **Pizza P'tit Louis** (pizzaïolo ambulant au feu de bois, Côte-d'Or, fondé en 1974, troisième génération ;
  **deux camions**, chacun avec son conducteur et sa ligne directe ; une tournée de 7 jours autour de Dijon).
  URL lues : `https://pizzaptitlouis.fr/`, `/notre-histoire/`, `/robots.txt` (tout autorisé hors `/wp-admin/`),
  `/wp-sitemap.xml` et `/wp-sitemap-posts-page-1.xml` (3 pages : accueil, histoire, mentions), feuilles Oxygen
  `uploads/oxygen/css/46.css` et `universal.css`. Lu le samedi 24 oct 2026.
- Seconde : **Le Camion à Pizzas** (food truck, Noyal-sur-Vilaine, Ille-et-Vilaine, créé en 1997, repris en 2022 par
  deux personnes ; un camion, deux services par jour certains jours). URL lues : `https://www.lecamionapizzas.com/`,
  `/notre-carte`, `/traiteur-evenementiel`, `/contact`, `/robots.txt`, `/sitemap.xml` (5 pages), feuille `/css/639941.css`.
- Vu aussi, une page : `piazza-pizzeria.fr/le-camion/` (une pizzeria fixe dont le camion fait 5 communes, 17 h 30 - 21 h,
  un numéro propre au camion, distinct de celui de la boutique) : la tournée comme second chemin d'un commerce fixe.
- Limite : rendu téléphone, tailles réelles, positions fixes non mesurés (aucun navigateur) ; P'tit Louis est presque un
  site d'une page (la page « Notre histoire » servie n'a qu'un h1), d'où la seconde source pour les pages intérieures.

## Pages

- P'tit Louis : **accueil à ancres** (emplacement du jour, pizzas, emplacements de la semaine, histoire, événements),
  page Histoire (vide), mentions légales.
- Le Camion à Pizzas : **accueil** (présentation, pizza du moment, **où nous trouver**, prestations, garanties, avis),
  **Notre carte**, **Traiteur événementiel** (buffets, anniversaires, ventes pour les écoles, choix selon le nombre de
  convives), **Contact** (formulaire, **la tournée répétée**, horaires du téléphone), mentions.

## Navigation

- P'tit Louis : en-tête sur la photo des deux camions, logo, 4 ancres en police manuscrite (27 px dans le menu plein
  écran au téléphone, fond noir), Facebook à droite ; deux boutons sous le h1 : « Nos pizzas », « Emplacement du jour ».
  Pied : les mêmes 4 ancres, mentions.
- Le Camion à Pizzas : Accueil, Notre carte, Traiteur événementiel, Contact ; **pied à quatre portes d'intention** :
  Nous contacter (page), **Nous trouver** (ancre `#lieu-de-vente` de l'accueil), **Nous appeler** (`tel:`), Nous rejoindre.
- Les deux : **la tournée est la seconde entrée de la nav** (« Notre emplacement », « Nous trouver »), juste après le
  produit ; aucune page par commune (manque relevé plus bas, c'est le levier de référencement local).

## Ordre de l'accueil (P'tit Louis)

1. Premier écran : photo des deux camions, h1 en manuscrite « pizza au feu de bois depuis 1974 », deux boutons.
2. **Emplacement du jour** : le jour en titre (« Samedi »), **la commune** en h4, puis pour chaque camion présent ce
   jour-là : quel camion (« camion de Louis »), les heures (17 h - 21 h), **le repère** (« parking du terrain de rugby »),
   **le téléphone de ce camion** (`tel:`), « pour commander, appelez la ligne directe du camion », « mis à jour
   quotidiennement », lien vers la semaine. Le HTML servi ne contient QUE le jour courant (choisi par le serveur ou mis à
   jour à la main ; mécanisme non mesuré).
3. Les pizzas : règle des tailles (« G = 4 personnes, P = 2 »), base crème ou tomate au choix, carte de fidélité commune
   aux deux camions, puis 21 pizzas (nom en capitales, garniture), pizza enfant, boisson, suppléments ; filets noirs entre
   les lignes ; pas de prix.
4. **Nos emplacements de la semaine** : lundi à dimanche, un bloc par jour (« Lundi : camions en repos »), et dans chaque
   jour une fiche par camion : commune, camion, heures, repère, téléphone. Deux camions le même soir dans deux communes.
5. Histoire (trois phrases : fondateur, année, générations) sur des photos d'archives scannées.
6. Événements : brocante, journée d'entreprise, lendemain de mariage, association ; téléphone et e-mail. Pied.

## Ordre de l'accueil (Le Camion à Pizzas, pour comparer)

h1 métier + commune, présentation et dates (1997, 2013, reprise en 2022), bouton « Commander » = `tel:` ; **la pizza du
moment** (nom, garniture) ; l'équipe (deux personnes nommées) ; **Où nous trouver ?** : lundi à vendredi, pour chaque jour
« midi » et/ou « soir » avec le lieu (« Hyper U », « place de la Cale »), la commune et les heures ; « week-ends :
prestations privées sur réservation » ; prestations ; garanties ; avis ; contact.

## Page interne type (Le Camion à Pizzas)

- **Notre carte** : h1 « pizzaïolos à <commune> », un paragraphe, la pizza du moment, lien vers la carte complète, les
  valeurs, renvoi au traiteur.
- **Traiteur événementiel** : h1, trois formules en cartes (buffet de six pizzas au choix, formule avec dessert surprise,
  vente pour les écoles commandée une semaine avant), le choix selon le nombre de convives (« moins de 50 personnes :
  pizzas précuites livrées »), « demander un devis ».
- **Contact** : formulaire, puis **la tournée en entier une seconde fois**, puis les horaires où l'on répond au téléphone.

## Contact et téléphone

- **Un téléphone par camion** (P'tit Louis : trois numéros pour deux camions, celui du camion de Louis et deux pour
  celui de Manu selon le jour, chacun répété sur son étape de la semaine) : on appelle le camion où l'on va, pas un standard. Le Camion à Pizzas : un seul numéro, partout, et le bouton
  « Commander » EST l'appel.
- Pas de commande en ligne ni de formulaire sur l'accueil : on appelle, on passe prendre à l'heure dite.
- Le formulaire (Contact, Traiteur) sert aux événements, pas aux pizzas du soir.

## Preuves

P'tit Louis : l'ancienneté (1974, trois générations), les photos d'archives, deux camions. Le Camion à Pizzas : les dates
(1997, reprise 2022), l'équipe nommée, un titre « Les avis de nos clients » (aucun avis dans le HTML servi : widget ou vide, non mesuré). Dans les deux : **la régularité** (même commune, même jour,
mêmes heures, chaque semaine) tient lieu de promesse.

## Style relevé (CSS servi)

- P'tit Louis : titres, menu et noms de jour en **Handlee** (manuscrite ; h1 du premier écran avec `text-shadow: 3px 3px
  9px #000` sur la photo), texte en **Inter** (100 à 900 chargés) ; corps 18-20 px. Couleurs : bleu ardoise `#566d8f`,
  encre `#3b3c38` / `#2b2c27`, turquoise `#65bec2` (accent, fonds de boutons), noir pour les sections Événements et pied,
  blanc. Fonds : photo des camions sous voile `rgba(30,30,30,.17)`, illustration de légumes en `background-size:
  contain` derrière la carte, photo sous voile noir à 0,6 pour les événements. Carte des pizzas en filets noirs de 1 à
  2 px. Rayons de la feuille commune 0,5 et 0,8 rem, ombre `0 20px 40px rgba(0,0,0,.1)` (feuille du constructeur,
  usage sur la page non mesuré). Pictogrammes en émoji (camion, horloge, épingle, téléphone).
- Le Camion à Pizzas : **Alegreya Sans** (titres), Helvetica en repli ; bordeaux `rgb(154 26 40)` (aplats), orange
  `rgb(247 146 35)` (accent, 12 usages), brun très sombre `rgb(64 4 5)`, fond bordeaux à 4 % ; titres jusqu'à 4 em et
  `clamp(27px, 2.6vw, 49px)` ; boutons à rayon 40 px.
- Mouvement : AOS chargé chez P'tit Louis (apparitions au défilement), usage non mesuré.

## Ce qui la rend différente du déroulé réflexe

- **La question n° 1 n'est pas « qui êtes-vous » mais « où êtes-vous ce soir »** : l'accueil y répond au deuxième bloc,
  avec la commune, le repère et le numéro à appeler ; le reste du site (carte, histoire) vient après.
- L'unité du site est **l'étape** (un jour, une commune, un repère, des heures, un camion, un numéro), pas le service.
- Le contact n'est pas une section finale : chaque étape porte son propre téléphone.
- Différence avec `pages-adresses` : là, des boutiques fixes, chacune avec ses horaires de la semaine ; ici un véhicule
  qui change de lieu chaque jour, et chaque lieu n'est ouvert qu'un soir. Différence avec `ardoise-du-jour` : là, le lieu
  est fixe et c'est l'offre qui change avec le jour ; ici l'offre est fixe (la carte) et c'est le lieu qui change.
  Différence avec `cartes-empilees-agenda` : l'agenda liste des dates uniques ; la tournée répète une semaine type.

## À quels clients elle convient (selon leurs données)

- Métier **itinérant à tournée régulière** : camion pizza, rôtisseur, food truck, poissonnier ou boucher ambulant,
  fromager et maraîcher sur les marchés (un marché par jour), boulanger en tournée rurale, épicerie itinérante, coiffeur ou
  toiletteur à domicile qui passe par commune à jour fixe, rémouleur, bibliothèque ou primeur ambulant.
- Données nécessaires : **au moins 3 étapes par semaine** avec chacune le jour, la commune et les heures ; le repère
  (« parking de la mairie ») et le téléphone du véhicule s'il y en a plusieurs ; la carte ou les produits (`services` +
  `services[].lignes`) ; des photos du camion ou du stand. Les jours de repos se déduisent seulement si le client les dit.
- Mieux encore : **plusieurs véhicules** (un numéro chacun), une offre événementielle séparable (privatisation, mariage,
  école), une boutique fixe en plus (la tournée devient le second chemin).
- Ne convient pas : commerce sans déplacement (voir `pages-adresses`, `lieu-fixe`), artisan qui intervient chez le client
  sur toute une zone sans jour fixe (c'est `zones.cities` et `/zones/<ville>`), tournée irrégulière qu'on ne tient que sur
  Facebook (le site afficherait une étape fausse).

## Comment l'usine la réaliserait

- Coquille : **nouvelle `tournee`** (`src/shells/tournee.astro`). Premier écran : nom, h1 = métier + région (« pizzaïolo
  ambulant autour de Dijon »), « Depuis 1974 » en texte, et **l'étape du jour** en grand : commune, repère, heures, bouton
  d'appel du véhicule ; au téléphone l'étape du jour est dans le premier écran, la photo du camion dessous.
- Étape du jour : choisie **dans le navigateur** (jour courant Europe/Paris : `maintenant()` de `src/lib/horaires.ts`,
  même principe que `HorairesDuJour.astro`) ; au build et sans script, la semaine entière est rendue et lisible ; après
  21 h, l'étape de demain (« Demain soir à… ») ; un jour sans étape dit la prochaine, jamais « fermé » deviné.
- Sous le premier écran : **la semaine** (un bloc par jour, une ligne par étape : commune liée à sa page, repère,
  heures, véhicule, `tel:`), les **avis** (`proof/google`, socle ; P'tit Louis n'en a pas), la carte (`services/carte-prix`
  existe, avec `services[].lignes`), l'histoire courte (`about/story` existe), les événements (`cta/card` existe), pied
  `columns` qui répète la semaine en une colonne.
- **Une page par commune** `/tournee/<commune>` : h1 « <métier> à <commune> », le ou les jours de passage, le repère et
  le lien d'itinéraire, les heures, le téléphone du véhicule, la carte, les autres communes de la tournée ; JSON-LD
  `FoodEstablishment` ou `LocalBusiness` sans adresse fixe, avec `Place` et `openingHoursSpecification` par étape
  (pas d'`aggregateRating`). `src/pages/zones/[ville].astro` montre déjà le principe d'une route par commune (pour une zone
  desservie, sans jour ni repère).
- Événements : une page de service (`services[]` + `servicePages`) ; `contact/form-split` (choix du besoin) pour la
  demande de prestation.

## Ce qui manque (dit précisément)

1. **La tournée dans le schéma.** Il manque `tournee[]` : `jour` (un jour, ou plusieurs dans le texte du client, lus par
   `joursDe()`), `moment` optionnel (« midi », « soir »), `commune` (obligatoire), `repere` optionnel (« parking du
   terrain de rugby »), `hours` (texte) avec `opens`/`closes` HH:MM optionnels (même forme que `ligneHoraire`),
   `vehicule` optionnel (nom donné par le client), `phone`/`phoneDisplay` optionnels (repli : `contact.phone`), `mapsUrl`
   et `coordinates` optionnels. Rien de déduit : pas de jour de repos inventé, pas de repère deviné depuis la commune.
2. **Route `/tournee/<commune>`** (`src/pages/tournee/[commune].astro`) dès qu'une commune a une étape, et `/tournee` qui
   liste la semaine ; lien « La tournée » dans la nav (`wording.tournee`, défaut « Où nous trouver »).
3. **Module pur `src/lib/tournee.ts`** : étapes groupées par jour (lundi → dimanche), communes uniques avec leurs jours,
   étape du moment (aujourd'hui avant la fin du service, sinon la prochaine), téléphone d'une étape ; testé.
4. **Composant `src/components/EtapeDuJour.astro`** : rend toutes les étapes au build, garde visible celle du moment au
   chargement (les autres `hidden`), sans horloge affichée (GOUT § 5).
5. **Section `zones/tournee`** (à enregistrer dans `VARIANTS`) pour un autre déroulé : la semaine en tableau, le jour
   courant marqué.
6. **JSON-LD par étape** : `src/lib/jsonld.ts` n'émet qu'un `LocalBusiness` à adresse unique ; il faut une sortie sans
   adresse fixe, une `Place` par commune.
7. **Mesure `etapes` de `donneesManquantes`** (3 étapes au moins avec jour, commune et heures) dans
   `src/lib/architectures.ts`.

## Signes IA à NE PAS reprendre

- Les émojis en guise de pictogrammes (camion, horloge, épingle, téléphone) : des mots (« Ce soir », « Parking de la
  mairie », « Appeler le camion de Louis »).
- La police manuscrite pour tout (menu, titres, jours) : au plus pour un seul niveau, jamais pour la nav ; et une
  manuscrite qui n'est pas dans la liste des polices IA (GOUT § 2).
- Les noms de pizzas en capitales et la carte sans prix : chez nous casse normale, prix si le client les donne
  (`services[].lignes[].prix`), sinon rien.
- Les boutons à rayon 40 px de la seconde source : ce sont des pilules (GOUT § 2).
- Le texte gonflé de mots clés en gras (« food truck », « pizzas artisanales », « produits frais ») et la liste
  « Nos garanties » : des faits du client, sans gras de référencement.
- Les apparitions au défilement de la bibliothèque AOS sur chaque bloc : rien ne doit retarder l'étape du jour.
- Une étape du jour calculée au build : fausse dès le lendemain ; elle se choisit dans le navigateur.

## Codée dans l'usine (24 oct 2026)

`layout: { architecture: 'tournee-semaine' }` (`src/lib/architectures.ts`). Ce qui a été fait des sept manques :

1. **Fait** : `tournee[]` (jour lu comme `contact.hours`, moment, commune, repère, heures, `opens`/`closes`, véhicule,
   téléphone avec repli sur `contact.phone`, itinéraire, coordonnées).
2. **Fait** : `/tournee` (la semaine, les communes) et `/tournee/<commune>` (h1 « métier à commune »), lien « Où nous
   trouver » (`wording.tournee`) à la place de l'ancre `#zones`.
3. **Fait** : `src/lib/tournee.ts` (module pur, testé).
4. **Fait** : `src/components/EtapeDuJour.astro` : toute la semaine au build, le navigateur garde l'étape du moment
   (aujourd'hui tant qu'une étape n'est pas finie, sinon la prochaine) et titre « Aujourd'hui », « Demain » ou le jour.
5. **Fait** : section `zones/tournee`.
6. **Fait** : `tourneeLd()` (`src/lib/jsonld.ts`) : une `Place` par étape, sans adresse fixe, jamais de téléphone de test.
7. **Fait** : mesure `etapes` (3 étapes avec jour, commune et heures).
Restent : la semaine répétée au pied, une page Événements dédiée (une page de service en tient lieu).

Coquille `tournee` : trois blocs frères en tête (l'accueil : h1, métier à ville, ancienneté, nombre de communes, numéro,
note ; l'étape du moment sur l'encre, `id="contact"` ; la photo), l'étape à droite sur toute la hauteur à l'ordinateur, sous
le h1 et avant la photo au téléphone ; puis la semaine, la carte (`services/carte-prix`), les avis, le pied. Essais refusés :
l'étape dans le bloc d'accueil (déroulé à 0,69 de forge-delacroix et prospect-a-coeur-bois), la carte entre l'étape et la
semaine (0,68 de maison-roux).

Preuve : site jetable (camion pizza, deux véhicules, cinq étapes, quatre communes, copie de `_exemple` sans photo, supprimé),
`ff verifier` vert hors données de test, `ff a11y` vert, `ff ressemblance` 0,65 (0,647) au premier écran téléphone
(fromagerie-ravanel-b), 0,60 ordinateur, 0,64 au déroulé (prospect-ballay-macon).
