# salles-capacites : le site d'un lieu de réception part du nombre d'invités

Volet 2a ter de `/veille`, tour du 28 oct 2026 (tour 14). Relevé au `curl` (HTML servi) de l'accueil, des pages
Réceptions, Séminaires, Hébergement, FAQ et Contact du Domaine de la Touche, de l'accueil du Domaine de la Chanterelle, plus
un démontage automatique de l'accueil du Domaine de la Touche (`ff demonter`, Chromium 390x844, capture gardée :
`salles-capacites-source.jpg`). On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Domaine de la Touche** (ancien corps de ferme du XVIIIe siècle loué pour réceptions et séminaires, Saint-Denis-sur-Sarthon,
  Orne) : [domainedelatouche.fr](https://domainedelatouche.fr/), [receptions](https://domainedelatouche.fr/receptions/),
  [séminaires](https://domainedelatouche.fr/seminaires-et-retraites-en-normandie/), [FAQ](https://domainedelatouche.fr/faq/),
  lus le mercredi 28 oct 2026. Sous le premier écran, **« Découvrez nos différents espaces »** : la Grande Salle (environ
  140 m², **150 personnes assises ou 250 en cocktail**), la Grange (80 m²), la cour fermée, le préau, la maison des Écuries,
  la Petite Salle (50 m², **50 assises ou 80 en cocktail**) ; « 53 couchages sur place » ; la cuisine à accès traiteur ; une
  page par occasion (Réceptions, Séminaires et retraites) avec « Réserver une visite » ; une FAQ de 21 questions (option
  gratuite de 10 jours sur une date, traiteur libre, pas de droit de bouchon).
- **Domaine de la Chanterelle** (deux lieux de réception près de Lille) : [domainedelachanterelle.fr](https://domainedelachanterelle.fr/),
  lu le même jour. Un lieu par page, une page « Entreprise », une page « Notre prestation traiteur » et **« Demande de devis »
  toujours dans la barre** ; le téléphone en pied (« Contact et réservation au … »).

## Pages

Domaine de la Touche : sept (accueil, réceptions, séminaires et retraites, hébergement, galerie, FAQ, contact) plus les
mentions. Domaine de la Chanterelle : six (accueil-aiguillage, deux lieux, traiteur, entreprise, devis).

## Navigation

Domaine de la Touche : « Le Domaine », « Réceptions », « Retraites & Séminaires », « Hébergements », « Galerie », « Contact » ;
le bouton « Contactez-nous » au premier écran. Chanterelle : les deux lieux, le traiteur, l'entreprise, la demande de devis.

## Ordre de l'accueil (Domaine de la Touche)

1. Photo (une peinture du domaine), h1 « Location de salles de réception et séminaires près d'Alençon », « Contactez-nous ».
2. « Un ancien corps de ferme, entre vergers et moutons » (l'histoire, la situation).
3. Les espaces, un par un, chacun avec sa surface et sa capacité assise ou en cocktail dans la phrase.
4. Les produits de la ferme (jus et cidre).
5. L'accès, l'e-mail, le téléphone, les heures d'ouverture.

## Ce qui fait vendre

La question du client d'un lieu de réception est un nombre : « nous serons 120, assis ». Les deux sources le font chercher
dans des phrases (Touche) ou demander au devis (Chanterelle). L'usine en fait le premier bloc : le tableau des salles et de
leurs capacités par configuration, lisible sans script, et un champ « Nombre d'invités » qui marque les salles qui
conviennent, en mots. Puis la salle en grande photo, ce que le lieu met à disposition (couchages, cuisine, parking), la règle
du traiteur et l'option sur une date : les réponses de la FAQ qui font signer.

## Signes à NE PAS reprendre

Capitales espacées en surtitre (« DÉCOUVREZ », « PROFITEZ DES »), citations d'auteurs célèbres entre les blocs, Cormorant
(police de la liste IA), émoji dans les horaires, capacités noyées dans un paragraphe, peinture à la place d'une photo du lieu
au premier écran.

## Codée dans l'usine (28 oct 2026)

`layout: { architecture: 'salles-capacites' }` (`src/lib/architectures.ts`) : coquille `salles` (`src/shells/salles.astro`),
`salles` dans le schéma (`liste[]` : slug, nom, surface, `capacites` assis / cocktail / théâtre / classe / en U, extérieur,
texte, équipements, photo ; `couchages`, `equipements`, `option`, `traiteur`), `src/lib/salles.ts` (`CONFIGURATIONS`,
`sallesCompletes`, `configurationsDe`, `capaciteMax`, `phraseCapacites`, `sallesPour`, `phraseReponse`, `lienSalles`),
`src/pages/salles/[...index].astro` et `[slug].astro`, `wording.salles` et `wording.invites`, mesure `salles`, pied
`minimal`, tiroir de contact ; les occasions sont les services (une page chacune) ; la FAQ passe sur `/salles`. Un seul bloc
`id="salles"` : l'outil sur l'encre (tableau + nombre d'invités + configuration en boutons à état), puis les salles en
onglets (sans script l'une sous l'autre), puis « sur place » et l'appel ; l'histoire dessous, les avis ensuite.
Restent : le calendrier des dates libres (voir `outil-calendrier`), la visite virtuelle, plusieurs lieux (Chanterelle).

Preuve : site jetable (domaine d'essai près d'Alençon, quatre espaces aux capacités relevées sur la source, 53 couchages, deux
occasions, deux avis d'essai ; sans photo, supprimé), `ff verifier` vert hors téléphone et e-mail de test (`ff a11y`,
`ff typo`, `ff ia` compris), `ff ressemblance` contre tous les sites du registre : plus proche cantine-roulante 0,56 / 0,56 /
0,44 (téléphone / ordinateur / déroulé ; modèle « onglets », déroulé héros, outil, à propos, avis). Essais refusés : salles
en liste sous l'outil (déroulé 0,68 de demo-plomberie et osteo-marchand : « héros, services, pied ; navigation à ancres ») ;
tableau seul sur l'encre puis salles en cartes (0,69 de maison-aurore). Capture téléphone : `salles-capacites-essai.jpg` ;
source : `salles-capacites-source.jpg`.
