# carte-des-soins : le site d'un institut est sa carte, rangée par le temps qu'on a

Volet 2a ter de `/veille`, tour du 27 oct 2026. Démontage automatique (`node scripts/ff.mjs demonter
https://www.institutladouceheure.fr/ --dossier docs/veille/architectures --nom la-douce-heure` : fiche
[la-douce-heure-demontage.md](la-douce-heure-demontage.md), mesures `la-douce-heure.json`, captures dans `captures/`,
non versionnées) et relevé au `curl` (La Douce Heure : accueil et `/massage-a-nantes/soins-du-visage/` ; Beauty Elite :
`/soins-2/`). On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Institut La Douce Heure** (institut de beauté à Saint-Sébastien-sur-Loire, près de Nantes, depuis 2011 ; quatre
  esthéticiennes nommées ; WordPress, agence T2Oplus). URL lues le mardi 27 oct 2026 : `https://www.institutladouceheure.fr/`
  (Chrome, 1440x900 et 390x844), `/massage-a-nantes/soins-du-visage/`.
- **Beauty Elite** (institut à Nantes) : une page « Soins et tarifs » (« Aqua Peel, Durée : 1h20, 88€ »), « Réserver »,
  « E-cadeau », tarifs en PDF. `https://beauty-elite.fr/soins-2/`.
- Trouvées en cherchant « institut de beauté Nantes tarifs soins visage épilation prendre rendez-vous ».

## Pages

La Douce Heure : une quinzaine (accueil ; soins esthétiques : visage, corps ; épilation ; flottaison et ses deux pages ;
soins spécifiques : LPG, photo-dépilation, maquillage ; mains et pieds ; contact ; mentions, CGV). « Réserver » mène à
Planity ; « Chèque Cadeau » a sa place dans la barre. **Chaque page de famille est une carte** : un h2 par soin, une
ligne « 40min | 45€ » ou « 1h15 | 82€ », un bouton « C'est parti » (la réservation), rangés en groupes (« Les Essentiels »,
« Les Experts », « Les Instants Particuliers » : 15 min, 21 €).

## Navigation

Barre en capitales, huit entrées : les familles de soins (dépliées), « Réserver » et « Chèque Cadeau » en entrées à
part, « Contact ». Pied : adresse, téléphone, **les horaires jour par jour avec la nocturne du jeudi**.

## Accueil (mesuré)

Le nom en très grand (Montserrat 90 px, 50 px au téléphone), « Depuis 2011 » et les prénoms de l'équipe, la flottaison
(le soin phare), trois portes vers les familles, épilation et LPG, catalogue PDF, la tisanerie, la lettre, le pied.
L'accueil ne montre aucun prix : il faut entrer dans une famille. **C'est la transposition** : l'usine met la carte sur
l'accueil et la range d'abord par **durée** (le visiteur sait combien de temps il a avant de savoir quel soin), la famille
restant écrite sous chaque soin et sur sa page.

## Contact et preuves

Réservation en ligne (Planity) ou téléphone ; chèque cadeau. Preuves : l'ancienneté, l'équipe nommée et diplômée, les
marques (Payot, LPG), un lien « Voir ou laisser un témoignage ».

## Style des sources (pour mémoire, non repris)

Blanc, grège #edebe8, saumon #db8469 et cuivre #cb9274 pour les titres, Montserrat partout (police de la liste IA :
jamais reprise). On ne reprend que l'architecture.

## Ce qu'il faut à l'usine

- `services[].lignes[].duree` (« 1 h 15 », « 40 min ») ; lecture pure en minutes, tranches (moins de 30 min, de 30 min à
  1 h, plus d'une heure).
- Une coquille dont l'accueil demande « Combien de temps avez-vous ? » en onglets de durée, chaque soin avec sa famille,
  sa durée, son prix et sa porte (`contact.bookingUrl`, sinon le téléphone) ; la carte entière par famille ensuite.
- La durée affichée dans `services/carte-prix` et les pages de famille (gabarit `porte`).
- Réserver et le bon cadeau en tête et dans la barre d'actions au téléphone.

## Convient à

Commerce de soin où l'on choisit une prestation par sa durée et son prix : institut de beauté, spa de quartier, masseur,
prothésiste ongulaire, barbier ou coiffeur à prestations minutées, sophrologue ou réflexologue ; 4 soins datés au moins.
Pas pour un artisan sur devis, ni l'urgence.

## Signes à ne pas reprendre

Lien publicitaire caché dans le texte d'accueil (« betonred », vers un site de paris : le site source a été piraté, à
signaler à un futur client qui aurait le même) ; prix seulement dans un PDF à télécharger ; nav en capitales ; carrousel de
partenaires ; inscription à la lettre au milieu de la page.

## Codée dans l'usine (27 oct 2026)

`layout: { architecture: 'carte-des-soins' }` (`src/lib/architectures.ts`) : coquille `soins` (`src/shells/soins.astro`),
`services[].lignes[].duree`, `src/lib/soins.ts` (`minutesDeDuree`, `soinsDates`, `tranches`), durée dans
`services/carte-prix` et `ServicePorte`, mesure `soins`, `wording.temps`. L'équipe et l'institut : bloc de fin
(`about.story`, premier paragraphe). Restent : un soin phare mis en avant (la flottaison de la source), les groupes à
l'intérieur d'une famille (« Les Essentiels », « Les Experts »).

Preuve : site jetable (institut de démonstration, sept soins datés en trois familles, Réserver et bon cadeau, trois avis ;
copie de `_exemple`, supprimé), `ff a11y` et `ff ia` verts, `ff verifier` vert hors données de test, `ff ressemblance`
contre tous les sites du registre : 0,50 au premier écran téléphone, 0,57 ordinateur, 0,61 au déroulé. Essai refusé : la
carte, les avis puis une section « à propos » à part (0,66 au déroulé contre maison-roux).
