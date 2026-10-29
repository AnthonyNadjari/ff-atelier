# honoraires-domaines : le site d'un cabinet d'avocat dit combien et comment ça commence

Volet 2a ter de `/veille`, tour du 29 oct 2026. Relevé au `curl` (HTML servi) de l'accueil et de la page Honoraires du
Cabinet Marilyne Faltot, de l'accueil et de la page Honoraires de Judisis, de l'accueil d'Angle Droit (Lille, écarté : un
déroulé classique équipe puis domaines), plus un démontage automatique de l'accueil de Faltot (`ff demonter`, Chromium
1440x900 et 390x844 ; planche gardée : `honoraires-domaines-source.jpg`). On reprend la construction, jamais les textes,
images, logos ou code des sources.

## Sources

- **Cabinet d'avocat Marilyne Faltot** (Forbach, entrepreneur individuel) : [faltot-avocat.fr](https://www.faltot-avocat.fr/),
  [honoraires](https://www.faltot-avocat.fr/honoraires-avocat-divorce/), lus le jeudi 29 oct 2026. Barre : Accueil,
  Présentation, **Nos activités** (huit domaines en ancres : famille, pénal et routier, contrats, assurances, baux, faillites
  civiles, postulation, prud'hommes), **Honoraires**, Actualités, FAQ, Contact, et **« PRENDRE RDV »** à part (Calendly).
  Accueil : le nom, « Cabinet d'avocat », les quatre villes ; **les six domaines** en pictogrammes ; « Contactez-nous » et le
  numéro ; trois actualités ; une présentation ; au téléphone une **barre fixe en bas** (documents et aide, numéro, contact).
  Page Honoraires : honoraires libres fixés avec le client, **taux horaire** minimum, **travail au forfait**, **convention
  d'honoraires signée pour chaque dossier**, honoraire de résultat jamais seul, **première consultation à prix et durée
  annoncés**, **rendez-vous découverte gratuit de 15 min par téléphone**, protection juridique, aide juridictionnelle,
  médiateur de la consommation de la profession.
- **Judisis** (Pontoise et Paris, trois avocats) : [judisis.fr](https://www.judisis.fr/),
  [honoraires](https://www.judisis.fr/honoraires/), lus le même jour. Barre : Équipe, **Domaines de compétence** (dépliés en
  procédures : divorce amiable, contentieux, accepté ; licenciement, rupture conventionnelle…), **Honoraires**, **Consultation
  en ligne**, Actualités, À propos, Contact. Page Honoraires : devis prévisionnel, convention, **trois façons de fixer
  l'honoraire** (temps passé, forfait, résultat), protection juridique, article 700, puis **un « à partir de » HT par
  procédure de divorce**.

## Pages

Faltot : une dizaine (accueil, présentation, activités, honoraires, actualités, FAQ, documents, contact, légal). Judisis : une
quarantaine (équipe et une page par avocat, domaines et une page par procédure, honoraires, consultation en ligne, FAQ).

## Navigation

Les deux mettent **« Honoraires » dans la barre**, au même niveau que les domaines ; la prise de rendez-vous est à part.

## Ordre de l'accueil (Faltot)

1. Nom, « Cabinet d'avocat », les villes. 2. Les domaines, chacun vers sa partie de « Nos activités ». 3. Contactez-nous et
le numéro. 4. Actualités. 5. Présentation du cabinet. 6. Pied (adresse, horaires, domaines, liens).

## Ce qui fait vendre

Le client d'un avocat (un divorce, un licenciement, un retrait de permis) n'ose pas appeler parce qu'il ne sait pas combien
ça coûte. Les deux sources le disent sur une page à part ; l'usine le met **dès le premier écran** : à côté du h1, « Comment ça
commence » en deux temps (l'appel découverte, la première consultation, chacun avec sa durée et son prix), « Prendre
rendez-vous » et le téléphone. Dessous, un seul bloc à onglets : un domaine par onglet, avec ses procédures et leur « à partir
de » (Judisis), sa page ; dans le même bloc les façons de fixer l'honoraire (forfait, temps passé, résultat), la convention, la
prise en charge (protection juridique, aide juridictionnelle), le cabinet (adresse, horaires) et les questions. L'avocat se
présente ensuite. `/nos-honoraires` reprend tout (dont le médiateur) ; chaque page de domaine montre ses procédures à prix.

## Signes à NE PAS reprendre

h1 en capitales espacées, statue de Thémis et balance, pictogrammes dans des ronds de couleur, aplats lilas en dégradé,
« Contactez-nous » en pilule, articles de blog au milieu de l'accueil, numérotation décorative des domaines (relevée par
`ff ia` sur le premier essai, retirée), tutoiement publicitaire (« La vie est faite d'opportunités et d'obstacles »).

## Codée dans l'usine (29 oct 2026)

`layout: { architecture: 'honoraires-domaines' }` (`src/lib/architectures.ts`) : coquille `honoraires`
(`src/shells/honoraires.astro`), `honoraires` dans le schéma (`decouverte` et `consultation` : titre, durée, prix, texte ;
`modes[]` : nom, prix, texte ; `convention`, `priseEnCharge[]`, `modalites[]`, `mediateur`), les domaines sont les services et
leurs procédures `services[].lignes` (prix « à partir de » quand le cabinet les donne, sinon « sur devis »),
`src/lib/honoraires.ts` (`premiersPas`, `modesComplets`, `domainesAPrix`, `resumePas`, `honorairesLisibles`,
`lienHonoraires`), page `/nos-honoraires` (`/honoraires` est le barème des agences immobilières, architecture
annonces-biens), bloc « Procédures et honoraires » sur `/services/<slug>` pour un site qui a `honoraires`,
`wording.honoraires` et `wording.domaines`, mesures `honoraires` (un prix dit) et `lignesPrix` (2 domaines), nav
« Honoraires », sections à propos puis questions (rendues dans le bloc), pied `minimal`, tiroir de contact. Restent : la barre
fixe du téléphone de Faltot (documents, numéro, contact), une page par avocat (Judisis), la consultation en ligne payée
d'avance (aucun paiement dans l'usine).

Preuve : site jetable (cabinet d'essai à Forbach, trois domaines et huit procédures d'essai, aucun avis ; photo
d'illustration Wikimedia marquée ; supprimé), `ff verifier` vert hors téléphone et e-mail de test (`ff a11y`, `ff typo`, `ff ia`
compris), `ff ressemblance` contre les 40 sites du registre : au plus 0,55 au téléphone (fromagerie-ravanel-b), 0,47 à
l'ordinateur (demo-architecte), 0,56 au déroulé (fromagerie-ravanel-d) ; modèle « onglets », déroulé héros, bloc (classé
questions), à propos, pied. Essai refusé : les questions hors du bloc (0,70 de demo-osteopathe, même ordre « héros, outil,
questions »). Les deux architectures du tour se ressemblent entre elles au déroulé (0,87 : deux blocs à onglets suivis d'une
section) : métiers sans recoupement, jamais en pistes sœurs. Capture : `honoraires-domaines-essai.jpg` ; source :
`honoraires-domaines-source.jpg`.
