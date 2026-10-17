# projets-fiches : le site est un catalogue de réalisations, une page par chantier

Volet 2a ter de `/veille`, premier tour (17 oct 2026). Relevé au `curl` (HTML servi, sans navigateur) :
on reprend la construction, jamais les textes, images, logos ou code de la source.

## Source

- Site : House of Honey (studio d'architecture d'intérieur, deux adresses en Californie).
- URL lues : `https://www.houseofhoney.com/`, `/studio`, `/spaces`, `/spaces/heirloom-house`,
  `/contact`, `/dear-honey`, `/the-buzz`, `/press`, `/robots.txt` (tout autorisé hors `/api/`, `/cms/`),
  `/sitemap.xml`.
- Limite : rendu téléphone et positions fixes déduits des classes du HTML servi, pas mesurés.

## Pages (34 au sitemap)

Accueil ; Studio (à propos) ; Réalisations (liste) + **13 pages de réalisation** ; Actualités ; Chronique
(liste) + 7 articles ; Presse ; 6 pages « histoires » ; Contact ; Confidentialité.

## Navigation

- Type : en-tête fixe sur ordinateur avec cinq liens (Studio, Réalisations, Actualités, Chronique,
  Presse) et « Nous écrire » à part, à droite.
- Téléphone : un bouton rond « ouvrir le menu » qui ouvre un panneau (`aria-haspopup="dialog"`), plus un
  bouton « remonter en haut ».
- Pied de page : les six liens, réseau social, e-mail de recrutement, **les deux adresses avec chacune
  son téléphone**, confidentialité.

## Ordre de l'accueil

1. Premier écran : signature en deux phrases (ce que fait le studio), sans bouton.
2. Une phrase de présentation + lien vers Studio.
3. « Réalisations » : six chantiers, chacun une image, son nom en capitales et **ses coordonnées
   géographiques** en sous-titre ; lien « voir plus » vers la liste.
4. Chronique : le dernier article seul (numéro, date, titre, lien).
5. Invitation à écrire : une phrase + bouton vers Contact.
6. Pied de page.

Pas d'avis, pas de services, pas de questions, pas de formulaire sur l'accueil.

## Page interne type (une réalisation)

1. Lien retour.
2. Coordonnées du lieu, nom du chantier (titre de page).
3. Un seul paragraphe : la maison, l'année de construction, la demande du client, le parti pris, un
   artisan associé ; crédit du photographe en fin de texte.
4. **Série de 17 photos**, chacune ouvrant une visionneuse (`?lightbox=…&index=n`, donc chaque photo a
   son adresse).
5. Pied de page (pas de bouton contact dans la page, pas de « projets suivants » relevé dans le HTML).

La liste des réalisations intercale entre les vignettes trois courtes phrases de manifeste, en titre :
la liste n'est pas une grille muette.

## Contact et téléphone

- Contact = une page : titre, une phrase, un formulaire à trois champs (nom, e-mail, message).
- Téléphone : uniquement dans le pied de page, un par adresse. Jamais dans l'en-tête.
- L'accueil finit par l'invitation à écrire ; la nav porte « Nous écrire » à part des autres liens.

## Ce qui la rend différente du déroulé réflexe

- L'unité du site est **le chantier**, pas la prestation : chaque réalisation a sa page, son texte, sa
  série ; l'accueil n'en montre qu'un extrait.
- L'accueil est court (cinq blocs) et ne vend rien : il renvoie vers les pages.
- La preuve n'est pas un avis client mais la série de photos et la presse.
- Le contact n'est pas une section finale : une page, une phrase d'invitation.

## À quels clients elle convient (selon leurs données)

- Métiers de projet dont chaque chantier se photographie : architecte d'intérieur, menuisier-ébéniste,
  paysagiste, ferronnier, tailleur de pierre, cuisiniste, rénovation de bâti ancien.
- Données nécessaires : **au moins quatre chantiers avec chacun cinq photos réelles et quelques lignes**
  (lieu, ce qui a été fait). Moins que ça, l'architecture tourne à vide : rester sur une galerie.
- Lieu : l'emplacement de chaque chantier (ville ou quartier, jamais l'adresse d'un particulier).
- Ne convient pas : urgence, prestations courtes répétitives (coiffure, dépannage), client sans photos.

## Comment l'usine la réaliserait

- Coquille : `flow` (l'accueil est court) ; nav `bar` avec le CTA à part, ou `minimal`.
- Accueil : `hero/typographic` (deux phrases, sans bouton), `about/story` (court), `proof/gallery`
  (réalisations avec `place` et `kind`, déjà dans le schéma), puis `cta/card` (l'invitation),
  `footer/columns` (adresses et téléphones).
- Chronique : `conseils` existe déjà (`/conseils`, une page par article).
- Contact : `layout.contactDrawer: true` ou `contact/simple`.

## Ce qui manque (dit précisément)

1. **Pages de réalisation.** Il manque une route `src/pages/realisations/[slug].astro` et, dans le
   schéma, un chantier qui porte plusieurs photos et un texte : par exemple `realisations[]` avec
   `slug`, `title`, `place`, `year` (optionnel), `text`, `photos[]` (réutilise `img`), `credit`
   (photographe). Aujourd'hui `proof.gallery` est une liste de photos isolées, une photo = une
   réalisation : la page de chantier ne se construit pas.
2. **Liste des réalisations** (`/realisations`) avec phrases intercalées : à faire dans la même route
   (index), les phrases venant du client ou de l'atelier, jamais d'un avis inventé.
3. **Visionneuse à adresse par photo** : `proof/gallery` n'a pas de visionneuse adressable ; un
   `<dialog>` natif + ancre `#photo-n` suffit, sans bibliothèque.
4. **Lien de la galerie vers la page du chantier** : `proof/gallery` devrait lier chaque vignette à
   `/realisations/<slug>` quand la réalisation a une page.
5. **Page Contact à part** (comme pour `carrefour-portes`) : réglage de layout qui sort la section
   contact de l'accueil vers `/contact`.
6. **Pied de page multi-adresses** : le schéma n'a qu'une adresse (`contact.address`) ; deux ateliers
   avec chacun son téléphone ne se disent pas. À ajouter seulement quand un client en a deux.
7. **Presse** : aucun champ. Une liste `press[]` (titre, média, date, lien) fournie par le client
   alimenterait une page ou un bloc ; jamais remplie sans source.
