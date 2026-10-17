# carrefour-portes : l'accueil est un carrefour, chaque porte ouvre une page

Volet 2a ter de `/veille`, premier tour (17 oct 2026). Relevé au `curl` (HTML servi, sans navigateur) :
on reprend la construction, jamais les textes, images, logos ou code de la source.

## Source

- Site : Cabalar Meat Co. (boucherie et burgers, un restaurant, un camion, une seule ville).
- URL lues : `https://www.eatcabalar.com/`, `/about`, `/menu`, `/food-truck`, `/private-events`, `/faqs`,
  `/contact`, `/robots.txt` (tout autorisé hors `/api/`), `/sitemap.xml`.
- Limite : le HTML servi ne dit ni les positions `fixed`/`sticky` exactes ni le rendu téléphone ; ce qui
  suit se lit dans les classes et l'ordre du DOM.

## Pages (10 au sitemap)

Accueil, À propos, Carte, Carte du camion, Camion (réservation), Événements privés, Questions,
Fournisseurs (« fermes et amis »), Contact, Confidentialité. Plus deux sorties externes : commande en
ligne et cartes cadeaux (outil de caisse en ligne).

## Navigation

- Type : barre fixe en haut, réduite à trois choses : logo, un bouton « Explorer » qui ouvre le menu
  complet, et l'action principale (commander en ligne) en bouton toujours visible.
- Le menu ouvert contient : Contact, À propos, Fournisseurs, Carte, Camion, Événements privés, Questions,
  puis de nouveau Commander.
- Téléphone : le même bouton « Explorer » sert à toutes les tailles (pas de liens en ligne sur ordinateur
  puis burger sur téléphone : un seul mécanisme partout).
- Pied de page : liste courte (À propos, Carte, Camion, Fournisseurs, Carte cadeau, Contact, Commander),
  lien d'itinéraire, crédit, confidentialité.

## Ordre de l'accueil

1. Premier écran vidéo.
2. Deuxième bloc vidéo + un paragraphe de présentation ET les horaires d'ouverture écrits en clair, dès
   le deuxième écran.
3. Porte 1 : photo + titre + deux phrases + lien « en savoir plus » vers À propos.
4. Porte 2 : photo + titre + deux phrases + lien vers la page Camion.
5. Porte 3 : illustration + titre + deux phrases + lien vers Fournisseurs.
6. Bandeau réseau social (compte à suivre).
7. Pied de page.

Pas d'avis, pas de liste de services, pas de questions, pas de formulaire sur l'accueil.

## Page interne type (Camion, la page qui vend)

1. En-tête de page : titre en deux lignes + grande photo.
2. Bandeau de logos des clients professionnels (défilant, liste doublée).
3. Déroulé en trois étapes (prendre contact, signer, se régaler) + bouton « réserver le camion ».
4. Questions propres à cette page (cinq, en accordéon).
5. Bandeau réseau social, pied de page.

Même gabarit sur Événements privés (titre, formules, galerie de la salle, questions de la page) et sur
Carte (titre, carte par onglets, bouton commander, questions). Chaque page porte SES questions ; la page
Questions les rassemble par thème (général, carte et allergies, événements).

## Contact et téléphone

- Aucun numéro de téléphone sur le site (aucun lien `tel:` sur l'accueil ni sur Contact).
- L'action n° 1 n'est pas le contact mais la commande, en bouton fixe dans la barre.
- Contact = une page à part, formulaire seul en deux colonnes ; les horaires vivent sur l'accueil,
  l'adresse passe par un lien d'itinéraire dans le pied.

## Ce qui la rend différente du déroulé réflexe

- L'accueil ne raconte pas tout : il **aiguille**. Trois portes, chacune une phrase et un lien, au lieu de
  « services, à propos, avis, questions, contact » empilés.
- Les questions sont **réparties par page** au lieu d'un bloc final unique.
- Le bouton de la barre n'est pas « Contact » mais l'action métier (commander, réserver).
- Les horaires montent au deuxième écran, le formulaire descend sur sa page.

## À quels clients elle convient (selon leurs données)

- Lieu qui reçoit avec des horaires (restaurant, boulangerie, fromagerie, caviste, barbier) ET au moins
  deux activités séparables (boutique + traiteur, salon + événements, atelier + cours).
- Photos : au moins une par porte (trois portes = trois photos réelles) ; sinon la porte n'existe pas.
- Une action en ligne déjà en place (commande, réservation) : elle prend le bouton de la barre.
- Ne convient pas : métier d'urgence (le téléphone doit être sur chaque écran), client à une seule
  prestation (pas de portes à ouvrir).

## Comment l'usine la réaliserait

- Coquille : `flow` (la barre fixe + pile courte suffit) ; nav `burger` (menu plein écran derrière un
  seul bouton, à toutes les tailles) avec le CTA de `wording.devis` renommé vers l'action métier.
- Accueil : `hero/video` ou `hero/fullbleed`, puis `services/alternating` (une ligne = une porte, ses
  liens mènent déjà à `/services/<slug>`), puis `footer/minimal` ou `footer/columns`.
- Pages internes : les activités deviennent des `services` avec `servicePages: true` ;
  `src/pages/services/[slug].astro` donne déjà titre, texte, image et un CTA.
- Contact : `layout.contactDrawer: true` (tiroir) ou section contact seule.

## Ce qui manque (dit précisément)

1. **Pages internes à blocs.** `src/pages/services/[slug].astro` a un gabarit fixe (texte, image,
   autres services, CTA). Il manque un champ par service, par exemple `services[].sections`, qui liste
   des blocs déjà existants (`process/steps`, `proof/logos`, `faq/accordion`, galerie) à rendre sur
   CETTE page, avec ses propres données (étapes, questions, photos de la prestation). Sans lui, la page
   Camion de la source ne se refait pas.
2. **Questions rattachées à une page.** `faq` est une liste unique ; il manque un rattachement optionnel
   d'une question à un service (`faq[].service`) pour les afficher sur la page du service, et une page
   `/questions` qui les regroupe par thème quand il y en a plus de huit.
3. **Pages À propos et Contact à part.** Aucune section du layout ne peut aujourd'hui sortir de l'accueil
   vers sa propre page. Il manque un réglage de layout (par exemple `layout.pages: ['about', 'contact']`)
   qui rend ces sections sur `/a-propos` et `/contact` et met un lien à leur place dans la nav.
4. **Horaires dans le haut de page.** Aucune variante de `hero` n'affiche `contact.hours` ; seule la
   coquille `split` les porte. Une variante de hero (ou un bloc « intro + horaires ») qui les écrit en
   clair au deuxième écran manque.
5. **Porte vers une page qui n'est pas un service** (fournisseurs, histoire) : `services/alternating`
   ne sait lier qu'à un service. Une variante « portes » qui lie aussi à `/a-propos` ou `/conseils`
   éviterait de déguiser l'histoire en prestation.
6. **Partenaires/fournisseurs** : aucun champ du schéma ; `proof/logos` couvre les clients
   professionnels si le client fournit leurs logos, jamais devinés.
