# artistes-residents : on choisit son artiste, le site se range par personne

Volet 2a ter de `/veille`, tour du 25 oct 2026. Relevé au `curl` (HTML et CSS servis, sans navigateur) : le démontage
automatique (`ff demonter`) a été refusé par le site (réponse HTTP 403 aux navigateurs sans tête), la fiche est donc
mesurée sur le code, pas sur capture. On reprend la construction, jamais les textes, images, logos ou code de la source.

## Source

- **Mystery Tattoo Club** (salon de tatouage, Paris 10e, rue de la Grange-aux-Belles, ouvert en 2008 ; huit artistes
  résidents nommés dans la nav, un neuvième avec une page mais hors nav). Site WordPress + Elementor fait par une petite
  agence (ikuki). URL lues le samedi 25 oct 2026 : `https://mysterytattooclub.com/`, `/robots.txt` (tout autorisé),
  `/sitemap_index.xml` et `/page-sitemap.xml` (23 pages), `/les-artistes-tatoueurs-du-salon-mystery-tattoo-club/`,
  `/tatoueuse-manon/`, feuille Elementor `post-157.css`.
- Limite : rendu téléphone, tailles réelles et couleurs calculées non mesurés (aucun navigateur admis) ; portfolio des
  pages d'artiste chargé par un module de galerie (nombre de photos non mesuré).

## Pages

23 : accueil ; **Artistes** (la liste) et **une page par artiste** (9) ; Tarifs (exemples de prix) ; Détatouage et
recouvrement ; Hygiène et soins (2 pages) ; FAQ ; Actualités ; Histoire du tatouage ; À propos ; Contact ; boutique
(t-shirts, renvoi vers une boutique en ligne) ; mentions, CGV, cookies.

## Navigation

Barre en haut : Accueil, **Artistes** (dépliée : « Tous les tatoueurs du salon » puis les huit noms, un par ligne),
Tarifs, Détatouage et cover, Hygiène et soins (dépliée), FAQ, Actu, Histoire du tatouage, Contact. La nav nomme les
PERSONNES, pas des services. Téléphone : bouton rond flottant (`tel:`) sur toutes les pages, et en pied.

## Ordre de l'accueil

1. Premier écran : nom du salon, « Salon de tatouage à Paris », phrase « Vous êtes à la recherche d'un tatoueur à
   Paris ? ».
2. Notre salon : année d'ouverture (2008), l'arrondissement, « Découvrir nos artistes ».
3. **Les tatoueurs du salon** : « Trouvez votre tatoueur », « Trouvez votre style », puis **un bloc par artiste** : son
   nom en h2, ses styles en boutons (Irezumi, Japonais, Old school, Blackwork, Dotwork, Néo-trad, Tebori…), chaque
   style ouvre une fenêtre qui l'explique ; « Découvrir » vers sa page. Les styles se partagent (le japonais chez
   quatre artistes) : c'est par eux qu'on choisit.
4. Votre style (« nous vous accompagnons quel que soit le style »), témoignages (titre seul dans le HTML servi),
   hygiène, confort et accueil, le salon dans le 10e, « Contactez-nous ».
5. Le formulaire « Parlez-nous de votre projet… » (avec pièces jointes : photos de référence), puis le pied : adresse,
   jours et heures d'ouverture (du lundi au samedi, 12 h - 19 h), téléphone, réseaux.

## Page interne type (page d'un artiste)

h2 « Manon », « Artiste tatoueuse résidente » ; sa présentation **à la première personne** (où elle a commencé, en
quelle année, ses villes, ses styles) ; **son e-mail à elle** (`mailto:` avec sujet prérempli) et **son Instagram** ;
puis « Découvrez les autres artistes du salon » (les sept autres, chacun avec son e-mail et son Instagram) ; puis le
formulaire commun. Les e-mails sont presque tous des adresses personnelles : on écrit à l'artiste, pas au salon.

## Contact et téléphone

Un numéro pour le salon (`tel:`, bouton flottant et pied) ; **un e-mail et un Instagram par artiste**, sur sa page et
dans la liste ; un formulaire commun en bas de chaque page. Pas de prise de rendez-vous en ligne.

## Preuves

L'ancienneté (2008), le nombre d'artistes, leurs années de métier dans leur texte, leurs portfolios (Instagram, galerie) ;
les témoignages ne sont qu'un titre dans le HTML servi (widget ou vide, non mesuré).

## Style relevé (CSS servi)

Polices chargées par Elementor : **Cormorant SC** (capitales à empattements, titres), **Krub** et **Lato** (texte).
Texte blanc sur fonds sombres et dégradés (variables globales d'Elementor, valeurs non lues), voile blanc à 12 %
(`#FFFFFF20`) sur les cartes. Valeurs calculées non mesurées (aucun navigateur).

## Ce qui la rend différente du déroulé réflexe

- **L'unité du site est la personne**, pas le service : la nav nomme les artistes, l'accueil est leur suite, chaque
  artiste a sa page, son e-mail, son Instagram.
- **On choisit par le style**, une donnée partagée entre plusieurs personnes : la question n'est pas « que faites-vous »
  mais « qui fait ce que je veux ».
- Différence avec `index-projets` / `projets-fiches` : là, une personne et ses réalisations ; ici plusieurs personnes,
  chacune avec les siennes. Avec `scenes-epinglees` (l'équipe en cartes) : là l'équipe illustre un lieu ; ici elle EST
  l'offre. Avec `accueil-portes` : les portes y sont des activités, ici des personnes.

## À quels clients elle convient (selon leurs données)

- Salon de tatouage (résidents et invités), salon de coiffure ou barbier à plusieurs fauteuils où l'on demande quelqu'un,
  atelier collectif (céramistes, bijoutiers), studio de photographes, école de musique à plusieurs professeurs.
- Données nécessaires : **au moins 3 artistes** avec chacun une photo (portrait ou pièce) et au moins un style ; mieux
  avec leur texte, leurs travaux, leur e-mail ou Instagram, un lien de rendez-vous propre.
- Ne convient pas : artisan seul (`index-projets`), équipe qu'on ne choisit pas (garage, plombier), urgence.

## Comment l'usine la réalise

- Coquille **`artistes`** : en tête h1, « métier à ville », ancienneté et nombre d'artistes, téléphone, note Google ; la
  rangée des styles en onglets (posée par le script ; sans script, tous les artistes) au-dessus d'**un bloc par
  artiste** (portrait en grand, nom géant, place, styles, début de sa présentation, « Voir son travail », son rendez-vous,
  son e-mail), alternés à l'ordinateur ; puis les avis ; puis la maison sur l'encre (adresse, état du jour, téléphone,
  e-mail), `id="contact"`.
- Pages `/artistes` (le mur filtrable par style sans script, puis « Style par style ») et `/artistes/<slug>` (portrait,
  nom en h1, « métier à ville », styles, jours, période d'invité, portes, présentation, travaux, les autres) ; JSON-LD
  `Person` qui travaille pour le commerce.
- Socle (GOUT § 0) que la source n'a pas toujours : téléphone en haut en bouton, note Google en tête, avis en section.

## Ce qui manquait (dit précisément)

1. `artistes[]` dans le schéma (slug, nom, rôle, année de début, styles, texte, photo, travaux, jours, période d'invité,
   e-mail, Instagram, lien de rendez-vous).
2. Routes `/artistes` et `/artistes/<slug>`, lien de nav (`wording.artistes`).
3. Module pur `src/lib/artistes.ts` (styles distincts, artistes d'un style, portes d'un artiste, résidents et invités).
4. Le mur (`src/components/MurArtistes.astro`) et le filtre par style.
5. JSON-LD `Person` (`artisteLd`, `src/lib/jsonld.ts`).
6. Mesure `artistes` de `donneesManquantes`.

## Signes IA à NE PAS reprendre

- Les fenêtres surgissantes qui expliquent chaque style : le style se lit en toutes lettres, il filtre, c'est tout.
- Le texte gonflé de mots clés (« tatoueur à Paris » une phrase sur deux) : des faits du salon.
- Les titres doublés (sur-titre en capitales au-dessus de chaque titre) et les capitales à empattements partout.
- Les icônes de réseaux sans texte : « Écrire à Manon », « Manon sur Instagram ».

## Codée dans l'usine (25 oct 2026)

`layout: { architecture: 'artistes-residents' }` (`src/lib/architectures.ts`). Les six manques sont faits : `artistes[]`,
`/artistes` et `/artistes/<slug>`, `src/lib/artistes.ts`, `MurArtistes`, `artisteLd`, mesure `artistes`. Restent : un
formulaire qui propose l'artiste, les pièces jointes au formulaire (photos de référence), une page par style.

Preuve : site jetable (salon de tatouage, quatre résidents et une invitée, sept styles, copie de `_exemple` sans photo,
supprimé), `ff verifier` vert hors données de test (`ff a11y` et `ff typo` compris), `ff ressemblance` 0,63 au premier
écran téléphone (fromagerie-ravanel-d), 0,54 ordinateur (fromagerie-ravanel), 0,59 au déroulé (prospect-a-coeur-bois), modèle de
navigation « onglets » (aucun autre site du registre). Essai refusé : le mur en grille dans un seul bloc, puis un bloc par
artiste sans onglets (déroulé 0,66 à 0,87 de onze sites : « héros, à propos, avis, contact » est le déroulé le plus
courant du registre).
