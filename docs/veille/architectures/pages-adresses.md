# pages-adresses : le site se range par adresse, une page par boutique, les pros à part

Volet 2a ter de `/veille`, tour du 19 oct 2026. Relevé au `curl` (HTML servi, sans navigateur) : mesuré sur le
code, pas sur capture. On reprend la construction, jamais les textes, images, logos ou code de la source.

## Source

- Site : Ten Belles (torréfacteur et boulangerie au levain, trois cafés à Paris, fondé en 2012, petite équipe).
- URL lues : `https://www.tenbelles.com/`, `/paris-10/`, `/paris-6/`, `/paris-11/`, `/bread/`, `/food/`,
  `/about-us/`, `/contact/`, `/robots.txt` (tout autorisé hors outils de la boutique), `/sitemap_index.xml` et
  `/page-sitemap.xml`, et le site des pros `https://offre-pro.tenbelles.com/`.
- Limite : positions fixes, tailles et rendu téléphone non mesurés (aucun navigateur) ; l'ordre et les rôles se
  lisent dans le DOM servi (Elementor côté public, un constructeur à ancres côté pros).

## Pages (11 au sitemap, doublées en français)

Accueil ; trois pages d'adresse (`/paris-6`, `/paris-10`, `/paris-11`) ; trois pages de savoir-faire communes à
toutes les adresses (Pain, Cuisine, Café) ; À propos ; Contact ; Carrières ; boutique en ligne (fiches produit).
Hors sitemap : Mentions, Conditions. **Un second site d'une page pour les professionnels**, sur un sous-domaine
(`offre-pro.`), avec sa propre nav à ancres (à propos, café, pain, traiteur, contact) et son formulaire.

## Navigation

- Barre en haut (Elementor, en-tête collant sur ordinateur d'après les classes `sticky`) : À propos, Pain,
  Cuisine, Café (sous-menu : valeurs, boutique), Boutique, **« Nos cafés » qui se déplie en trois adresses**
  (le nom de chaque page est l'arrondissement), « Vente aux pros » vers l'autre site, panier, compte, langue.
- Téléphone : la même liste en menu déroulant (`elementor-nav-menu--dropdown`).
- Pied : logo, réseaux, **les trois adresses une deuxième fois** (liens vers leurs pages), Carrières, Contact,
  Mentions, Conditions ; inscription à la lettre en bas de chaque page.
- Deux axes, jamais mélangés : **ce qu'on fait** (pages communes : pain, cuisine, café) et **où on le trouve**
  (pages d'adresse). Les professionnels ont un troisième chemin, à part.

## Ordre de l'accueil

1. Premier écran : diaporama de deux diapositives (deux produits phares, une phrase, un bouton vers la boutique).
2. **Bandeau des adresses** : trois lignes, chacune « nom de l'adresse + rue + code postal », lien vers l'itinéraire.
3. Un paragraphe de manifeste (ce qu'on fait, où, pourquoi), sans bouton.
4. Pied (adresses, pages), lettre d'information.

Quatre blocs. Pas de services en cartes, pas d'avis, pas de questions, pas de formulaire.

## Page interne type (une adresse, ici Paris 10)

1. Fond photo du lieu (réglage de diaporama d'arrière-plan présent dans le HTML) et h1 = le nom court du lieu.
2. Un paragraphe propre à l'adresse : l'année d'ouverture, le quartier, ce qu'on y trouve, ce qu'on peut emporter.
3. Les règles du lieu (« sans réservation ») et **les horaires de cette adresse** (semaine, week-end).
4. **L'adresse et le téléphone de cette adresse**, puis l'e-mail commun.
5. Pied.

Même gabarit pour les trois adresses, chacune avec ses horaires, son année d'ouverture et son numéro. Les pages de
savoir-faire (Pain, Cuisine) sont du texte seul (h1 + 3 à 4 paragraphes) et finissent par l'e-mail « pour les pros ».

## Contact et téléphone

- **Un téléphone par adresse**, écrit sur la page de l'adresse (aucun lien `tel:` dans le HTML servi : à
  corriger chez nous, socle GOUT § 0). Aucun téléphone dans l'en-tête ni sur l'accueil.
- Page Contact : les trois adresses en liste, l'e-mail, un formulaire à trois champs.
- Les pros : formulaire sur leur page à eux, réponse promise sous 24 h, rien de cela sur le site public.

## Preuves

Aucun avis affiché. La preuve est l'ancienneté de chaque adresse (année d'ouverture écrite sur sa page) et le
nombre d'adresses lui-même. Côté pros : livraison à vélo, café consigné, chiffres d'économie (donnés par eux).

## Ce qui la rend différente du déroulé réflexe

- L'unité du site est **le lieu** : on cherche « celui près de chez moi », sa page répond en un écran (horaires,
  adresse, téléphone de CE lieu), sans faire défiler l'histoire de la maison.
- Les savoir-faire ne sont pas des « services » à vendre mais des pages communes, liées depuis les lieux.
- L'accueil liste les adresses dès le deuxième bloc, au lieu d'un bloc contact unique en fin de page.
- Le public professionnel a son propre chemin (sa page, sa nav, son formulaire) : le site public ne se charge pas
  d'arguments B2B.
- Différence avec `accueil-portes` : là, chaque porte est une **activité** (photo en grand, grille de photos) ; ici
  les pages d'adresse sont des **fiches pratiques** courtes, chacune avec ses horaires et son numéro, et l'offre est
  décrite une seule fois pour toutes les adresses.

## À quels clients elle convient (selon leurs données)

- Commerce à **2 adresses ou plus** qui ont chacune des horaires et un téléphone propres : boulangerie à deux
  boutiques, coiffeur ou barbier à deux salons, fromager avec boutique et marché, caviste à deux caves, garage à
  deux ateliers, institut à deux cabinets.
- Données nécessaires : par adresse, la rue, les horaires, le téléphone, une photo du lieu, l'année d'ouverture si
  elle est connue ; une ou deux phrases propres au lieu (terrasse, parking, ce qu'on n'y trouve pas).
- Mieux encore si le client a une **clientèle professionnelle** séparable (restaurants livrés, entreprises) : la page
  pros prend le troisième chemin.
- Ne convient pas : une seule adresse (le modèle tourne à vide), artisan qui se déplace (les adresses sont des
  zones, voir `/zones/<ville>`), métier d'urgence (un seul numéro doit être partout).

## Comment l'usine la réaliserait

- Coquille : `flow` (accueil court) ; nav `bar` avec un lien « Nos adresses » ou, à deux adresses, les deux noms
  directement dans la nav ; pied `columns` qui reprend les adresses.
- Accueil : `hero/fullbleed` ou `hero/stacked` (une photo, pas de diaporama), puis un bandeau des adresses (à créer,
  voir plus bas), puis `about/story` court, puis `proof/google` s'il y a des avis (socle), `footer/columns`.
- Savoir-faire : les `services` avec `servicePages: true` ; gabarit `layout.servicePage: 'fiche'` (texte d'abord).
- Pages d'adresse : à créer (voir « Ce qui manque ») ; `src/pages/zones/[ville].astro` montre déjà le principe d'une
  route générée par entrée de liste, mais pour une zone desservie, pas pour un lieu.
- Pros : une section ou une page qui leur est propre (à créer), avec `wording.ctaTitle` dédié ; jamais un
  sous-domaine (un seul site, un seul build).

## Ce qui manque (dit précisément)

1. **Plusieurs adresses dans le schéma.** `contact.address` est un objet unique, `contact.hours` une liste unique,
   `contact.phone` un numéro unique (`src/lib/schema.ts`). Il manque une liste `lieux[]` : `slug`, `nom`
   (« Rue Breguet »), `address` (même forme que `contact.address`), `phone`/`phoneDisplay` optionnels (repli :
   `contact.phone`), `hours[]` (même forme que `contact.hours`, pour `src/lib/horaires.ts` : ouvert ou fermé par
   lieu), `since`, `texte`, `photos[]`, `regles[]` (« sans réservation », « parking »), `mapsUrl`, `coordinates`.
   Déjà noté pour `projets-fiches` (pied multi-adresses) : un seul champ servirait aux deux.
2. **Route `/adresses/<slug>`** (ou `/<slug>` court) : photo, nom, phrase du lieu, état ouvert ou fermé du jour,
   horaires, adresse, `tel:` de ce lieu, itinéraire, carte (`src/components/Carte.astro` par lieu). Le JSON-LD doit
   émettre un `LocalBusiness` par lieu avec sa `openingHoursSpecification` (aujourd'hui `src/layouts/Base.astro` en
   émet un seul, et `openingHoursSpecification()` de `src/lib/jsonld.ts` ne lit que `contact.hours`).
3. **Bandeau ou liste des adresses** pour l'accueil (section `zones/lieux` ou `contact/adresses`) : une ligne par
   lieu, l'état du jour et le téléphone sur chaque ligne ; à enregistrer dans `VARIANTS`.
4. **Nav qui groupe** : aucune variante de `src/sections/Nav/` n'a de sous-menu ; à 3 adresses et plus il faut
   un groupe « Nos adresses » (`<details>` natif, sans script) ; à 2, deux liens suffisent.
5. **Chemin pros** : aucun champ. Un objet `pros` optionnel (titre, texte, offres en lignes, e-mail ou formulaire
   dédié) rendu sur `/professionnels`, lien discret dans la nav ; jamais rempli sans données du client.
6. **Téléphone dans l'en-tête quand il y a plusieurs numéros** : le socle veut un téléphone visible sans défiler.
   Règle à écrire : le numéro principal (`contact.phone`) en haut, ceux des lieux sur leurs pages ; jamais une liste
   de numéros dans l'en-tête.

## Signes IA à NE PAS reprendre

- Le diaporama de produits en premier écran (deux diapositives qui tournent) : ni le fond ni le sujet ; une photo
  fixe du lieu ou du travail.
- Les noms de lieu en capitales seules et le manifeste à mots génériques (« régénérer », « force du changement ») :
  chez nous, une phrase de faits par lieu (année, quartier, ce qu'on y trouve).
- Le téléphone écrit sans lien `tel:` et l'absence d'avis : le socle les impose.
- Le sous-domaine pros séparé : une page dans le même site, même build, même domaine.
