# ardoise-du-jour : l'accueil est l'ardoise d'aujourd'hui, le site se range par jour de la semaine

Volet 2a ter de `/veille`, tour du 24 oct 2026. Relevé au `curl` (HTML et CSS servis, sans navigateur) : mesuré sur le
code, pas sur capture. On reprend la construction, jamais les textes, images, logos ou code de la source.

## Source

- Site : The Cheese Board Collective (coopérative ouvrière depuis 1971 : fromagerie-boulangerie au 1504 et pizzeria au
  1512 de la même rue, Berkeley, Californie ; un seul téléphone pour les deux).
- URL lues : `https://cheeseboardcollective.coop/`, `/pizza/pizza-schedule/`, `/bakery-cheese/bakery-schedule/`,
  `/bakery-cheese/the-bakery/`, `/bakery-cheese/bread-library/`, `/breads_index/hobrot/`, `/pizza/musicians-schedule/`,
  `/directions-hours/contact-us/`, `/about-us/about-main/`, `/robots.txt` (tout autorisé hors `/wp-admin/`),
  `/wp-sitemap.xml` et ses sous-plans (pages, `breads_index`, `post`, `ingredients`, `cheesecake_gallery`), feuille
  `wp-content/themes/cheeseboard/assets/css/theme.min.css`. Lu le 24 oct 2026 (vendredi 23 oct en Californie).
- Limite : rendu téléphone, tailles réelles à l'écran, positions fixes et animations non mesurés (aucun navigateur) ;
  les rôles et l'ordre se lisent dans le DOM servi (WordPress, thème propre, Bootstrap).

## Pages (23 au plan du site, plus les fiches)

Accueil ; **Bakery & Cheese** : la boulangerie (le pain du jour), **le programme de la semaine** (Bakery Schedule),
**la bibliothèque des pains** (Bread Library), le comptoir à fromages, les pâtes fraîches ; **Pizza** : **le programme
des pizzas** (Pizza Schedule), à propos de la pizza, le programme des musiciens ; Annonces (articles datés) ; carte
cadeau ; À propos (la coopérative, rejoindre, demandes de dons) ; Horaires et contact, Accès ; confidentialité.
Au plan aussi : **113 fiches de pain** (`/breads_index/<slug>`, ouvertes en fenêtre depuis la bibliothèque), 101 fiches
d'ingrédient, 136 annonces, 5 photos de gâteaux.

## Navigation

- En-tête plein largeur sur aplat bleu ciel : une ligne d'identité (« coopérative depuis 1971 ») au-dessus du nom en
  très grand, puis la barre : Accueil, **Bakery & Cheese** et **Pizza** (chacun se déplie au survol en 3 à 5 pages),
  Annonces, Carte cadeau, À propos (3), Horaires et accès (2). Au téléphone, une icône de menu ouvre la même liste.
- **Deux activités, deux colonnes de nav**, chacune avec ses pages « programme ». Le temps est l'axe : « Schedule » est
  le mot le plus répété de la nav (boulangerie, pizzas, musiciens).
- Pied sur fond photo : les deux adresses (chacune avec son lien de carte), la ville, le téléphone, « écrire »,
  confidentialité. Répété identique sur chaque page.

## Ordre de l'accueil

1. Bandeau illustré pleine largeur (décor de la rue, une vache qui court, un chien qui remue, des notes de musique :
   trois GIF animés posés en absolu sur l'illustration).
2. **Trois ardoises côte à côte** (colonnes 3/5/3 sur 12 à l'ordinateur, empilées au téléphone), remontées de 50 px
   sur le bandeau :
   - **Horaires d'aujourd'hui** : le jour et la date écrits en toutes lettres, puis les horaires du jour de chaque
     activité (boulangerie, pizzeria midi et soir), « tous les horaires » ;
   - **La pizza d'aujourd'hui** : la garniture du jour, la salade du jour, la règle de commande (« commande par téléphone
     à partir de 6 pizzas »), « le programme de la semaine » ;
   - **La musique d'aujourd'hui** : le groupe du midi et celui du soir avec leurs heures, « les musiciens de la semaine ».
   Le jour est choisi par le serveur : le HTML lu le 24 oct (Paris) dit « vendredi 23 octobre ».
3. **Annonces** : quatre cartes (image, titre, deux lignes, « lire », date de publication), « toutes les annonces ».
4. Lien Instagram, pied.

Trois blocs. Pas de services en cartes, pas d'avis, pas de questions, pas de formulaire, pas de photo du lieu en grand.

## Page interne type 1 (le programme des pizzas)

Gabarit commun à toutes les pages intérieures : **trois colonnes** (3/6/3 sur 12).
1. Colonne de gauche : **les horaires de la semaine de CETTE activité** (dimanche à samedi, midi et soir), « tous les
   horaires ». Chaque page d'activité ouvre sur ses horaires, pas sur un titre.
2. Colonne centrale : h2, un paragraphe sur la pizza (pâte, végétarienne, saison), les règles du lieu (au comptoir,
   pas de livraison, pas de réservation), puis **les jours qui viennent, datés** : « ven. 23 oct » (pizza, salade),
   « sam. 24 oct », « dim. 25 oct : fermé aujourd'hui », « lun. 26 oct : fermé aujourd'hui ».
3. Colonne de droite : **panneaux d'information** (« Menu et prix », « Sans gluten », « Végane », « À cuire chez soi »,
   « Présure des fromages »), chacun avec un bouton « voir le détail » qui ouvre une fenêtre (prix en lignes, règles de
   commande, instructions de cuisson, composition).
4. Pied.

## Page interne type 2 (le programme de la boulangerie)

1. Gauche : horaires de la semaine de la boulangerie.
2. Centre : « sous réserve de disponibilité », **filtre Sans gluten / Végane** (boutons, script), puis **un bloc par jour
   d'ouverture** (mar., mer., jeu., ven., sam.) : les 5 à 7 pains et pâtisseries propres à ce jour, puis la liste des
   produits de tous les jours, répétée sous chaque jour.
3. La page « La boulangerie » ne montre que **le pain du jour** (« les pains du vendredi, 23 octobre 2026 ») + les produits
   de tous les jours, puis « voir tout le programme ».
4. La **bibliothèque** liste 78 produits (vignette + nom, même filtre ; 113 fiches au plan du site, dont des doublons) ; chaque nom ouvre la fiche du produit
   dans une fenêtre (`ajax.breads.php` ; d'après la feuille `.popup-bread` : nom, texte, ingrédients ; fenêtre non ouverte),
   et sa page existe aussi à part (la page `/breads_index/hobrot/` servie ne montre que le nom et la bibliothèque).

## Contact et téléphone

- Un seul numéro, **écrit dans le pied de chaque page, sans lien `tel:`** (0 lien `tel:` dans le HTML servi : à corriger
  chez nous, socle GOUT § 0).
- Le téléphone sert à une seule chose, dite sur l'ardoise : commander six pizzas ou plus. Tout le reste : on vient.
- Page Horaires et contact : les deux adresses, chacune avec sa semaine d'horaires, puis un formulaire à trois champs
  (nom, e-mail, message) ; un formulaire à part pour les demandes de dons.

## Preuves

Aucun avis. La preuve est **la fraîcheur affichée** : la date du jour, ce qui sort du four aujourd'hui, ce qui est fermé
demain ; l'ancienneté (« depuis 1971 ») ; la bibliothèque de 78 produits ; les annonces datées.

## Style relevé (CSS servi)

- Polices : **Droid Serif** 400/700 (titres des ardoises 34 px graisse 600, nav en capitales 14-15 px gras, liens d'action
  en capitales 14-16 px), **Source Sans Pro** 300-700 (texte 14-18 px, interligne 135-150 %), **Biko** pour le nom du
  site (capitales, `clamp(29px, 1rem + 2.626vw, 3.938rem)`, interligne 120 %).
- Couleurs : en-tête `#c4f8fc` (bleu ciel), encre `#022c33`, bleu d'action `#009bb7` (liens, boutons, filtres), ocre
  `#bf9104` (liens des ardoises et « lire la suite », survol vert `#9eca77`), crème `#fffcc5` (sous-titres et notes sur
  l'ardoise), orange `#fd4f0b` (horaires exceptionnels), bandeau d'alerte `#c30` (fermeture exceptionnelle en capitales
  blanches), cartes d'annonce `#e8fcfe`, texte courant `#5b5b5b` / `#566f73`, pied crème `#f9f2d9` sur photo.
- **L'ardoise** : fond noir, cadre en bois par `border-image` (une photo de tableau étirée, tranches 20/13/20/14),
  `box-shadow: 0 0 10px #000`, padding 25 px, hauteur minimale 285 px à l'ordinateur, remontée de 50 px sur le bandeau
  (profondeur : l'ardoise est posée sur le décor). Le fond de l'accueil sous les ardoises est une photo de tableau noir
  répétée en largeur.
- Rayons : 0 partout (boutons `border-radius: 0`). Bouton plein `#009bb7`, capitales serif blanches, 10 x 15 px.
  Filtres : cadre 2 px `#009bb7`, plein quand choisi.
- Mouvement : seulement les trois GIF du bandeau ; aucune transition au défilement relevée dans la feuille.

## Ce qui la rend différente du déroulé réflexe

- **L'accueil n'est pas une présentation, c'est le tableau du jour** : on y vient chaque jour pour savoir ce qu'il y a,
  si c'est ouvert, et à quelle heure ; le site vit sans être réécrit, parce que le programme est hebdomadaire.
- L'unité du site est **le jour de la semaine** : chaque activité a sa semaine d'horaires en tête de page et son
  programme jour par jour ; la bibliothèque est le catalogue intemporel derrière.
- Les informations pratiques (prix, allergènes, cuisson) sont des **panneaux latéraux qu'on ouvre**, pas des sections
  empilées.
- Différence avec `lieu-fixe` (Le Petit Bleu) : là, la carte est fixe et le LIEU reste à l'écran ; ici la carte CHANGE
  chaque jour et c'est LE JOUR qui est à l'écran. Différence avec `cartes-empilees-agenda` : l'agenda liste des
  rendez-vous datés et uniques ; l'ardoise répète une semaine type, avec des exceptions datées.

## À quels clients elle convient (selon leurs données)

- Commerce de bouche dont l'offre **tourne selon le jour** : boulangerie (pain du lundi, du mercredi, brioche du
  dimanche), traiteur ou boucher-traiteur (plat du jour de la semaine), restaurant ouvrier ou bistrot à menu du jour,
  fromager (fromage de la semaine), poissonnier (arrivages par jour de marée), glacier (parfum du jour), pizzeria à pizza
  du jour, cantine, crêperie à galette du jour.
- Données nécessaires : des **horaires par jour** (`contact.hours` lisibles par `semaine()`), et **au moins 3 jours
  d'ouverture qui ont chacun une ligne propre** (« mardi : seigle, épeautre ») ; les produits de tous les jours s'il y en
  a ; les prix en lignes s'il les donne ; les allergènes s'il les dit. Une photo de vitrine ou de comptoir pour le
  bandeau ; sans photo, l'ardoise se compose en typo sur aplat (une ardoise est un objet du métier, GOUT § 2).
- Ne convient pas : offre qui ne change jamais (rester sur `lieu-fixe` ou `carte-de-visite`), artisan qui se déplace
  (voir `tournee-semaine`), métier d'urgence, client qui ne tiendra pas son programme à jour (le site afficherait un faux
  « aujourd'hui » : c'est une donnée inventée par le temps).

## Comment l'usine la réaliserait

- Coquille : **nouvelle `ardoise`** (`src/shells/ardoise.astro`). Premier écran : nav `bar` (téléphone cliquable à droite,
  socle), h1 = métier + ville sous le nom, une photo du lieu en bandeau (ou un aplat de la direction), puis la **rangée
  d'ardoises** remontée sur le bandeau. Pied `columns` (adresses, téléphone, horaires de la semaine).
- Ardoises de l'accueil (2 ou 3 selon les données, jamais une vide) :
  1. **Aujourd'hui** : `HorairesDuJour` existe déjà (état « Ouvert / Ouvre à », ligne du jour, fuseau Europe/Paris, script
     client, liste de la semaine sans script) ; à étendre au jour et à la date écrits en toutes lettres.
  2. **Au programme aujourd'hui** : le contenu du jour tiré d'un programme hebdomadaire (nouveau champ, plus bas), choisi
     **dans le navigateur** (jour courant, même fuseau) ; sans script ou en capture, la semaine entière s'affiche, jamais
     un jour deviné au build (le site statique n'est pas reconstruit chaque matin).
  3. **Le rendez-vous du jour** (facultatif) : `agenda[]` existe déjà (`src/lib/agenda.ts`, dates passées retirées au
     build) ; l'ardoise montre l'entrée datée du jour, sinon la prochaine, sinon rien.
- Sous les ardoises : les **avis** (`proof/google` ou `proof/testimonials`, socle, la source n'en a pas), puis les
  annonces : `conseils` existe déjà (articles datés, `/conseils`) ; l'accueil en montre les 3 derniers.
- Page « programme » d'une activité : les `services` avec `servicePages: true` et un **nouveau gabarit
  `layout.servicePage: 'programme'`** : à gauche la semaine d'horaires (`Horaires.astro` existe), au centre la phrase, les
  règles du lieu et le programme jour par jour, à droite les panneaux d'information en `<details>` natifs (pas de fenêtre
  à script) : `services[].lignes` existe déjà pour « Menu et prix ».
- Bibliothèque : `produits[]` existe (page `/produits` par famille, `/produits/<slug>`, JSON-LD `Product`), mais exige une
  photo par produit ; une bibliothèque sans photo doit rester possible (liste à filets).

## Ce qui manque (dit précisément)

1. **Programme hebdomadaire.** Aucun champ ne range une offre par jour de la semaine. Il manque `services[].programme[]` :
   `jours` (texte du client, même lecture que `contact.hours` : `joursDe()` de `src/lib/horaires.ts`, « Mardi »,
   « Mercredi et samedi »), `lignes[]` (nom, détail, prix optionnels, même forme que `services[].lignes`), `note`
   optionnelle (« jusqu'à épuisement ») ; plus `services[].tousLesJours[]` (les produits permanents, même forme de ligne).
   Un jour qu'aucune entrée ne couvre n'affiche rien (pas « fermé » : c'est le rôle des horaires).
2. **Exceptions datées.** `ardoise[]` au niveau du site : `date` (AAAA-MM-JJ), `service` (slug) optionnel, `lignes[]`
   ou `texte`, `ferme` (booléen) : la pizza d'une date précise, une fermeture exceptionnelle (le bandeau rouge de la
   source). Filtrées au build comme `agendaAVenir()` et choisies au jour dans le navigateur ; une exception du jour
   remplace le programme de ce jour.
3. **Choix du jour côté client** : un module pur `src/lib/ardoise.ts` (jour courant Europe/Paris, `maintenant()` existe
   dans `horaires.ts` ; programme du jour ; exception du jour), testé ; un composant `src/components/ArdoiseDuJour.astro`
   qui rend la semaine entière au build et n'en laisse visible que le jour au chargement (`hidden` sur les autres jours,
   jamais l'inverse : sans script, tout se lit).
4. **Section `services/programme`** (à enregistrer dans `VARIANTS`) pour un autre déroulé : le programme de la semaine en
   colonnes par jour (ordinateur) et en `<details>` par jour (téléphone), le jour courant ouvert.
5. **Filtre d'allergènes** : `services[].lignes[].tags[]` optionnels (« sans gluten », « végan ») et un filtre en `:has()`
   sur des cases (comme `SortiesFiltrables.astro`), sans script ; aucune étiquette devinée.
6. **Bibliothèque sans photo** : `produits[].photo` devient optionnelle seulement pour cette architecture, ou une liste
   à filets `services/liste-a-filets` (existe) sert de bibliothèque.
7. **Téléphone** : la source l'écrit sans lien ; chez nous `tel:` dans la nav et sur l'ardoise quand une règle de commande
   par téléphone existe (`contact.phone`).

## Signes IA à NE PAS reprendre

- La ligne d'identité en petites capitales espacées au-dessus du nom (« coopérative depuis 1971 ») : c'est l'eyebrow
  interdit (GOUT § 2) ; chez nous « Depuis 1971 » en texte sous le h1.
- Les titres de l'ardoise, la nav et tous les liens d'action en capitales : un seul niveau en capitales au plus, le reste
  en casse normale.
- Les GIF animés qui tournent en boucle sur le bandeau et la photo de tableau noir étirée comme texture : pas de décor
  qui bouge tout seul ; l'ardoise se fait par la couleur et la typo de la direction (encre claire sur fond sombre de la
  palette), ou par une vraie photo de l'ardoise du client.
- Les fiches qui s'ouvrent en fenêtre à script (colorbox) et le filtre à script : `<details>` et `:has()`.
- Le téléphone sans lien `tel:`, l'absence d'avis : le socle les impose.
- Un « aujourd'hui » calculé au build : faux dès le lendemain ; le jour se choisit dans le navigateur.

## Codée dans l'usine (24 oct 2026)

`layout: { architecture: 'ardoise-du-jour' }` (`src/lib/architectures.ts`). Ce qui a été fait des sept manques :

1. **Fait** : `services[].programme[]` (`jours` lus comme `contact.hours`, `lignes[]` nom, détail et prix optionnels, `note`)
   et `services[].tousLesJours[]` ; mesure `programme` de `donneesManquantes` (3 entrées aux jours distincts).
2. **Fait** : `ardoise[]` (date, activité, titre, lignes, texte, `ferme`) ; les dates passées tombent au build.
3. **Fait** : `src/lib/ardoise.ts` (module pur, la lecture des jours passée en paramètre) et
   `src/components/ArdoiseDuJour.astro` : toute la semaine rendue au build, le navigateur garde le jour (« Aujourd'hui,
   vendredi 23 octobre ») et remplace le programme d'une activité par son exception du jour ; sans script, la semaine.
4. **Fait** : section `services/programme` (la semaine, le jour courant marqué) ; page `/programme` ; le programme sur la page
   de chaque activité (tous les gabarits).
5. **Reste** : le filtre d'allergènes (`lignes[].tags`).
6. **Reste** : la bibliothèque sans photo (une liste à filets en tient lieu).
7. **Fait** : téléphone en `tel:` dans la nav, la tête et l'ardoise des horaires.
Reste aussi le gabarit `servicePage: 'programme'` à trois colonnes (horaires à gauche, panneaux à droite).

Coquille `ardoise` : h1, métier à ville, ancienneté, téléphone, note ; bandeau photo ; les ardoises en blocs frères posés
dessus (horaires `id="contact"`, programme du jour, prochain rendez-vous) ; trois annonces (`conseils`) ; avis ; pied. Essai
refusé : les ardoises dans une seule enveloppe (déroulé à 0,69 de demo-boulangerie).

Preuve : site jetable (boulangerie, deux activités, programme sur six jours, deux exceptions, copie de `_exemple` sans photo,
supprimé), `ff verifier` vert hors données de test, `ff a11y` vert, `ff ressemblance` 0,50 au premier écran téléphone, 0,54
ordinateur, 0,64 au déroulé (demo-paysagiste).
