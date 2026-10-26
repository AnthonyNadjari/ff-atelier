# grille-urgence : le site d'un métier d'urgence est sa grille de prix publiée

Volet 2a ter de `/veille`, tour du 26 oct 2026 (soir). Démontage automatique (`node scripts/ff.mjs demonter
https://www.serrure-ouest.com/ --dossier docs/veille/architectures --nom serrure-ouest` : fiche
[serrure-ouest-demontage.md](serrure-ouest-demontage.md), mesures `serrure-ouest.json`, captures dans `captures/`, non
versionnées) et relevé au `curl` des pages intérieures (`/tarifs-serrurier/`, `/porte-claquee-ou-fermee-a-cle/`,
`/tarifs-serruriers/ouverture-de-porte-claquee-paris-16/`, `/serrurier-auteuil/`). On reprend la construction, jamais les
textes, images, logos ou code de la source.

## Source

- **Serrure Ouest** (serrurier installé à Auteuil, Paris 16e, atelier rue Michel-Ange, 7 j sur 7 de 6 h 30 à 2 h). Site
  WordPress. URL lues le lundi 26 oct 2026 : `https://www.serrure-ouest.com/` (Chrome, 1440x900 et 390x844),
  `/robots.txt` (tout autorisé), et les quatre pages ci-dessus.
- Trouvée en cherchant « porte claquée ou fermée à clé, prix » : la page de la source « Porte claquée ou fermée à clé ?
  100 € ou 180 € : comment savoir » est le cœur de l'architecture.
- Limite : les avis viennent d'un widget tiers, le devis rapide d'un formulaire tiers ; seule l'ossature est reprise.

## Pages

Plus de trente : accueil ; **la grille** (`/tarifs-serrurier/` : « douze prestations, douze prix ») ; une page par
prestation, chacune titrée par son prix (« Ouverture de porte claquée à Paris 16 : 100 € TTC ») ; « Urgence 7 j/7 » ; une
page par quartier du 16e (délai propre : « sur place en 10 minutes » à Auteuil) ; réalisations datées et situées ;
avis ; à propos, informations entreprise (SIRET, assurance), « comment nous travaillons » ; une dizaine de guides
(porte claquée ou fermée, reconnaître un vrai serrurier, le devis est obligatoire) ; contact, mentions.

## Navigation

Barre fixe : Accueil, Urgence 7 j/7, **Prestations** (méga-menu : chaque prestation et son prix, « Voir les 12 tarifs »),
Zones, À propos, Guides, Contact ; à droite « Devis WhatsApp » et un bloc d'appel « Appel direct, 15 à 20 min » avec le
numéro. Au téléphone, une barre fixe en bas (Appeler, Devis WhatsApp). Pied à quatre colonnes (prestations, quartiers,
informations, coordonnées et liens de vérification du SIRET).

## Ordre de l'accueil (mesuré, ordinateur)

1. Bandeau du jour (« ouvert 7 j/7 de 6 h 30 à 2 h »).
2. Premier écran sur l'encre : h1 « Serrurier à Paris 16, porte claquée ? Nous sommes à Auteuil », appel, devis,
   e-mail ; à droite, **la grille tarifaire publique en carte** (quatre prix) ; dessous trois chiffres (délai, prix
   d'entrée, horaires).
3. La note Google, les avis.
4. Ce que nous faisons (six portes vers les prestations).
5. Trois chantiers récents (lieu, date, photo).
6. **La grille complète, publiée** (prestation x jour / soirée / nuit) et « comment nous travaillons ».
7. Les cinq quartiers et leur délai.
8. Quatre étapes, aucune surprise ; reconnaître un vrai serrurier ; les marques ; questions ; ce qu'il faut savoir
   avant d'appeler ; bandeau « Porte bloquée maintenant ? » ; pied.

## Page interne type

- **Une prestation** (`/tarifs-serruriers/ouverture-de-porte-claquee-paris-16/`) : h1 avec le prix, le cas en une phrase,
  appel ; **le prix de chaque créneau** (journée, soirée, nuit) et le délai ; dans quel cas ; ce que comprend le forfait ;
  comment nous procédons (quatre étapes) ; **à savoir avant d'appeler** (« n'utilisez ni carte ni tournevis ») ; la
  grille ; les questions.
- **Le guide « porte claquée ou fermée à clé ? »** : le test en dix secondes (« avez-vous tourné la clé ? ») qui dit la
  situation et donc le prix.
- **Un quartier** : h1 « Serrurier à Auteuil sur place en 10 minutes », délai, prix d'entrée, disponibilité, les rues.

## Contact et téléphone

Le téléphone partout (cinq liens `tel:` sur l'accueil), le délai à côté ; WhatsApp ; e-mail ; aucun formulaire long.

## Preuves

La grille elle-même (le prix avant l'appel, « les mêmes au téléphone, sur le devis et sur la facture ») ; la note et les
avis ; les chantiers datés et situés ; le SIRET vérifiable ; la mise en garde contre les faux dépanneurs.

## Style relevé (DOM calculé)

Titres **Barlow Condensed** gras en capitales (h1 64 px, 29 px au téléphone), texte Inter ; blanc (60 %), gris très clair,
encre `#111417` au premier écran, rouge vif pour les prix et les appels ; cartes à coins légèrement arrondis ; apparitions
au défilement (0,55 s), rien d'autre ne bouge.

## Ce qui la rend différente du déroulé réflexe

- **Le prix est la réponse, avant la question** : on ne lit pas « nos services » puis « demandez un devis », on dit sa
  situation et on lit le prix de l'heure. Aucune architecture du registre ne sert l'urgence : toutes disent « pas
  l'urgence » (`pasUrgence`) ; celle-ci l'exige.
- **Le prix dépend de l'heure** : trois colonnes (journée, soirée, nuit), et l'usine marque celle de maintenant.
- Différence avec `lieu-fixe` (carte à prix pointillés d'un commerce où l'on vient) : ici les prix sont des situations
  et des créneaux, le client ne vient pas, on va chez lui. Avec `parcours-atelier` (onglets aussi) : là le niveau du
  visiteur, ici sa panne, et le prix change avec l'heure.

## À quels clients elle convient (selon leurs données)

- Serrurier, plombier (fuite, débouchage, chauffe-eau), vitrier, électricien de dépannage, dépannage auto, dératiseur,
  vétérinaire de garde ; tout métier d'urgence **qui accepte d'afficher ses prix**.
- Données nécessaires : **au moins 2 situations avec leurs prix** (mieux 3 et plus, avec les créneaux), et l'urgence
  (`contact.emergency24h` ou un délai d'arrivée) ; mieux avec le test de chaque situation, ce que comprend le forfait,
  les délais par secteur.
- Ne convient pas : un artisan qui ne travaille que sur devis (`accueil-portes`, `index-projets`), un commerce où l'on
  vient (`lieu-fixe`).

## Comment l'usine la réalise

- Coquille **`grille`** : en tête le h1, le métier à la ville et l'ancienneté, le téléphone en grand, le délai, la note ;
  puis « Quelle est votre situation ? » (`wording.situation`) : **une tuile par situation** (son nom, « dès 90 € ») qui
  devient un onglet par le script ; sous l'onglet, le test, la phrase, **le prix de chaque créneau** avec « En ce
  moment » posé dans le navigateur (fuseau Europe/Paris), Appeler et le délai, ce que comprend le forfait, comment ça se
  passe, avant d'appeler, sa page. Sans script, toutes les situations l'une sous l'autre, aucun créneau marqué. Dans le
  même bloc, la grille complète (tableau), les engagements, les délais par secteur. Puis les avis, l'atelier sur l'encre
  (`id="contact"`), le pied ; barre d'appel en bas au téléphone (`actionBar`).
- Pages `/tarifs` (la grille) et `/tarifs/<slug>` (h1 « situation à ville », prix par créneau, délai, Appeler, test,
  forfait, déroulé, avant d'appeler, questions, les autres situations ; JSON-LD `Service` et une offre par créneau).
- La nav nomme « Les tarifs » en tête.

## Ce qui manquait (dit précisément)

1. `tarifs` dans le schéma : créneaux (nom, heures, début, fin, jours), situations (slug, nom, test, phrase, prix par
   créneau, délai, compris, déroulé, conseil, questions), prestations hors créneaux, engagements, délai, secteurs.
2. Module pur `src/lib/tarifs.ts` (situations complètes, créneau de l'heure, minuit franchi, prix alignés, « dès … »,
   lien de nav).
3. Coquille `grille`, routes `/tarifs` et `/tarifs/<slug>`, `wording.tarifs`, `wording.situation`.
4. JSON-LD `situationLd` (`src/lib/jsonld.ts`), mesures `situations` et `urgence` de `donneesManquantes`.

## Signes IA à NE PAS reprendre

- Capitales condensées grasses partout (h1 et h2), rouge vif en aplat sur l'encre.
- « 5,0 sur 5 » et les badges de confiance en bandeau, les trois gros chiffres sous le h1 (« 15–20 min », « 100 € »,
  « 6h30–2h00 »).
- La mise en garde « reconnaître un vrai serrurier » comme section de vente ; elle reste un guide, si le client l'écrit.

## Codée dans l'usine (26 oct 2026)

`layout: { architecture: 'grille-urgence' }` (`src/lib/architectures.ts`). Les quatre manques sont faits. Restent : une
page par secteur (le délai par quartier est dans la grille, pas en pages), les réalisations datées (`realisations[]`
existe, non branché ici), un créneau week-end distinct des jours fériés (le client l'écrit en note).

Preuve : site jetable (serrurier de démonstration à Lyon, trois situations à trois créneaux, deux prestations hors
créneaux, quatre secteurs ; copie de `_exemple` sans photo, supprimé), `ff verifier` vert hors données de test
(`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance` contre tous les sites du registre : 0,60 au premier écran
téléphone (fromagerie-ravanel-d), 0,49 ordinateur (demo-electricien), 0,62 au déroulé (prospect-a-coeur-bois ; modèle
de navigation « onglets », aucun autre site). Planche de défilement regardée : « En ce moment » posé sur la bonne colonne.
