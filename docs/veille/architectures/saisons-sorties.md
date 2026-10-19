# saisons-sorties : le site se range par saison, chaque activité est un catalogue de sorties datées

Volet 2a ter de `/veille`, tour du 19 oct 2026. Relevé au `curl` (HTML servi, sans navigateur) : mesuré sur le
code, pas sur capture. On reprend la construction, jamais les textes, images, logos ou code de la source.

## Source

- Site : Bureau des guides de La Grave (guides de haute montagne et accompagnateurs, un village des Hautes-Alpes,
  coopérative de quelques guides).
- URL lues : `https://www.guidelagrave.com/`, `/activite-ete/randonnee/`,
  `/activite/stage-decouverte-grandes-voies-descalade/`, `/groupe-et-cible/familles-fr/`, `/contact/`,
  `/robots.txt` (tout autorisé, `Crawl-delay: 10` respecté : une requête toutes les 10 s), `/sitemap_index.xml`,
  `/page-sitemap.xml`, `/activite-sitemap.xml`, `/activite-ete-sitemap.xml`.
- Limite : photos posées en fond CSS (non comptées dans le HTML), rendu téléphone et tailles non mesurés.

## Pages (15 pages fixes, 82 fiches de sortie, 12 pages d'activité, en français ; doublées en anglais)

Accueil ; **6 activités d'été** (randonnée, alpinisme, escalade, via ferrata, canyoning, VTT) et **6 d'hiver**
(raquettes, hors-piste, ski de randonnée, raids à ski, cascade de glace, alpinisme hivernal) ; **82 fiches de
sortie** (`/activite/<slug>`) ; **4 pages par public** (familles, scolaires, séjour formation, entreprises) ;
Prochaines sorties collectives ; Tarifs ; Bons cadeaux ; Historique, Équipe, Partenaires ; trois pages
d'événement du bureau ; Actualités (articles) ; Contact ; Données personnelles.

## Navigation

- En-tête : réseaux, **icône Contact et icône téléphone (`tel:`) en haut à droite sur toutes les pages**, un bouton
  « Prochaines sorties collectives », une recherche ; dessous, le logo et **deux entrées seulement, ÉTÉ et HIVER**,
  chacune se dépliant en six activités, puis Tarifs et la langue. Partie collante sur ordinateur (`sticky_on`
  desktop dans les réglages).
- Un grand menu (méga-menu Elementor) reprend tout en colonnes : Infos (historique, équipe, partenaires, contact),
  Activités été + boutons Familles et Scolaire, Activités hiver + boutons Séjour formation et Entreprise, Sorties
  collectives et événements, Bons cadeaux.
- **Deux façons d'entrer** : par la saison puis l'activité, ou par le public (famille, école, entreprise,
  formation) ; les deux mènent aux mêmes fiches de sortie.
- Pied : réseaux, liens utiles du métier (conditions du domaine, bulletin d'avalanche, routes, office du tourisme),
  données personnelles.

## Ordre de l'accueil

1. h1 de bienvenue + lieu (massif, vallée) et trois paragraphes : toute l'année, où, qui encadre (diplômes).
2. **« Coups de cœur » de la saison** : deux ou trois fiches de sortie en cartes (période « de juin à septembre »,
   prix « à partir de », difficulté, durée, niveau physique, « En savoir plus », « Réserver »). La sélection vient
   d'une catégorie par saison (`favoris-ete`, `favoris-hiver` au sitemap) ; le 19 oct, encore celles d'été.
3. Actualités : deux articles (titre, image, extrait, « Lire la suite »), lien vers toutes.
4. Fil des réseaux sociaux.
5. Logos des partenaires (marques de matériel).
6. Pied.

## Page interne type 1 (une activité, ici Randonnée)

1. Pictogramme de l'activité, h1 « activité + lieu », h2 d'une phrase (pour qui), un paragraphe sur le terrain.
2. **Filtre par difficulté** (Tout, Découverte, Intermédiaire, Confirmé), appliqué sur la liste sans recharger.
3. **Liste des sorties de l'activité** (une dizaine), chaque carte bâtie pareil : **période** (« de juin à
   septembre », « juillet / août »), prix « à partir de », titre, une phrase, difficulté, durée, niveau physique,
   « En savoir plus », « Réserver ». Une sortie sans prix renvoie au contact.

Les pages par public (Familles) ont la même grammaire mais mêlent les deux saisons : la période de chaque carte
(« de décembre à mai », « de juin à septembre ») dit quand elle a lieu.

## Page interne type 2 (une fiche de sortie)

1. Trois repères en tête : difficulté, durée, (niveau) ; h1 = nom de la sortie ; une phrase « vous êtes… et vous
   souhaitez… » (le public visé, à la deuxième personne).
2. Un paragraphe de ce qu'on y apprend, une ligne « pour qui » (niveau requis).
3. **Quatre onglets** : Programme (jour par jour), Inclus, À prévoir, Difficulté et niveau.
4. Prix par personne et condition (« 4 participants minimum »), bouton « Réserver ».

## Contact et téléphone

- Téléphone : icône `tel:` dans l'en-tête de chaque page, à côté de l'icône Contact.
- Réserver : un bouton par sortie (ouvre une fenêtre de réservation), et « Prochaines sorties collectives » dans
  l'en-tête pour qui veut rejoindre un groupe à date fixe.
- Page Contact : un formulaire qui demande **l'activité et les dates qui intéressent** en plus du nom, téléphone,
  e-mail et message : la demande arrive déjà qualifiée.

## Preuves

Aucun avis. La preuve est le diplôme de l'encadrement (dit dès l'accueil), l'équipe nommée (page Équipe),
l'historique du bureau, les partenaires, et surtout la précision des fiches (programme jour par jour, niveau
requis, ce qui est inclus ou non, conditions de départ).

## Ce qui la rend différente du déroulé réflexe

- **Le temps range le site** : la nav n'a que deux mots, ÉTÉ et HIVER ; l'accueil met en avant la saison
  (coups de cœur de saison) ; chaque offre porte sa période.
- L'unité vendue n'est pas un « service » mais **une sortie datée et cotée** (période, durée, niveau, prix) ; un
  service (l'activité) est une liste filtrable de sorties.
- Une seconde porte **par public** coupe à travers les saisons (familles, écoles, entreprises).
- Le contact demande l'activité et les dates : c'est un formulaire de réservation déguisé, pas un « écrivez-nous ».

## À quels clients elle convient (selon leurs données)

- Métier **saisonnier** dont l'offre change entre deux ou quatre saisons : guide ou accompagnateur, moniteur de
  ski, loueur de vélos ou de skis, base nautique, centre équestre (stages vacances / cours à l'année), pépiniériste
  et paysagiste (plantation / taille / entretien), apiculteur (visites d'été, ventes d'hiver), ferme ou cueillette,
  traiteur (mariages l'été / fêtes l'hiver), ramoneur (avant l'hiver).
- Données nécessaires : au moins **deux saisons** avec chacune 2 activités ou plus, et par sortie ou prestation au
  moins la période et une durée ; le prix, la difficulté, le programme et le public s'ils sont donnés. Des photos
  par activité. Sans ces fiches, l'architecture tourne à vide : rester sur `accueil-portes`.
- Ne convient pas : métier sans saison (plombier, coiffeur), urgence, client à une prestation.

## Comment l'usine la réaliserait

- Coquille : `flow` ; nav `bar` réduite à deux entrées de saison + Tarifs, téléphone et Contact en icônes ; pied
  `columns` (on peut y mettre des liens utiles du métier fournis par le client).
- Accueil : `hero/stacked` (h1 métier + lieu, photo de la saison), puis les sorties en avant de la saison (à créer),
  `proof/google` s'il y a des avis (socle : la source n'en a pas), `about/story` court (diplômes, équipe),
  `conseils` (déjà là : `/conseils`) pour les actualités.
- Activités : les `services` avec `servicePages: true` ; `services[].lignes` (nom, prix, détail) donne déjà une
  liste à prix, mais sans page par ligne ni période, durée ou niveau.
- Fiche de sortie : à créer ; `<details>` natifs pour Programme / Inclus / À prévoir / Niveau (pas d'onglets à
  script), `process/steps` comme modèle du jour par jour.
- Contact : `contact/form-split` (le choix du besoin existe ; il manque les dates, voir plus bas).

## Ce qui manque (dit précisément)

1. **Saison d'un service.** Aucun champ ne range les services dans des groupes : il manque `services[].saison`
   (texte libre donné par le client, « Été », « Hiver ») ; la nav et l'accueil groupent par saison dès que deux
   valeurs distinctes existent ; aucune saison = rien ne change.
2. **Sorties (offres datées).** Il manque `sorties[]` : `slug`, `service` (slug du service parent), `titre`,
   `resume`, `periode` (« de juin à septembre », texte du client), `duree`, `niveau` (texte, sert au filtre),
   `prix` optionnel, `condition` optionnelle (« 4 participants minimum »), `public[]` optionnel, `programme[]`
   (titre + texte par jour), `inclus[]`, `aPrevoir[]`, `photos[]`, `enAvant` (booléen, saison de l'accueil). Plus la
   route `/sorties/<slug>` et une liste filtrable par niveau sur la page du service (CSS `:has()` sur des boutons
   radio, sans script, comme les filtres de `index-projets`).
3. **Pages par public** (`/pour/<public>`) générées depuis `sorties[].public` quand un public a 3 sorties ou plus.
4. **Nav à groupes** : aucune variante de `src/sections/Nav/` n'a de sous-menu (même manque que `pages-adresses`) ;
   un groupe par saison en `<details>`.
5. **Formulaire qualifié** : `src/components/ContactForm.astro` a déjà un choix du besoin (`select name="service"`,
   la liste des services) ; il manque les sorties dans ce choix et un champ « dates souhaitées », à activer par
   un réglage de `form` dans le schéma.
6. **Réservation par sortie** : `contact.bookingUrl` est unique ; un lien de réservation optionnel par sortie
   (`sorties[].bookingUrl`) manque. Sans lien, « Réserver » ouvre le tiroir de contact pré-rempli avec la sortie.
7. **Sortie en avant selon la date** : choisir au build la saison courante (comme `src/lib/horaires.ts` lit le jour)
   demanderait un rebuild à chaque saison ; plus simple : `enAvant` posé par le studio, changé avec `/retouche`.

## Signes IA à NE PAS reprendre

- Le fil des réseaux sociaux intégré et la rangée de logos de marques en bas d'accueil : poids, traceurs, et rien
  qui vende.
- Les h1 en capitales (« BIENVENUE AU… ») et le titre de bienvenue lui-même : chez nous, métier + lieu.
- Les onglets à script de la fiche : des `<details>` natifs, lisibles sans JavaScript et par les moteurs.
- Les pictogrammes de difficulté et de durée dessinés pour l'occasion : du texte (« Niveau : découverte »,
  « 3 jours »), pas une icône par donnée.
- Une sortie sans prix ni période : on n'invente ni l'un ni l'autre, la ligne dit « sur demande » seulement si le
  client l'a dit.
