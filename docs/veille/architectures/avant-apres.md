# avant-apres : le site est le mur des pièces transformées

Volet 2a ter de `/veille`, tour du 27 oct 2026. Démontage automatique (`node scripts/ff.mjs demonter
https://assiseautrement.fr/ --dossier docs/veille/architectures --nom assise-autrement` : fiche
[assise-autrement-demontage.md](assise-autrement-demontage.md), mesures `assise-autrement.json`, captures dans `captures/`,
non versionnées) et relevé au `curl` (Assise Autrement : accueil et `/photo-avant-apres-fauteuil-tapissier-joinville/` ;
La Petite Remise : accueil et `/galerie-réfection-restauration-tapisserie/` ; atelier.b : accueil et `/realisations`).
On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Assise Autrement** (Françoise Thiriet, tapissière à Joinville-le-Pont, Val-de-Marne ; WordPress, thème Customizr).
  URL lues le mardi 27 oct 2026 : `https://assiseautrement.fr/` (Chrome, 1440x900 et 390x844),
  `https://assiseautrement.fr/photo-avant-apres-fauteuil-tapissier-joinville/`.
- **La Petite Remise** (Julie Maurin, tapissière d'ameublement à Cabasse, Var ; Jimdo) : « Ce que j'aime dans mon
  métier ? Vous émouvoir avec les avant / après ». `https://www.lapetiteremise.fr/`, la galerie.
- **atelier.b** (tapissier décorateur à Saint-Amand-les-Eaux ; Webador) : « Réalisations & avant/après », dix pièces
  nommées (« fauteuils Louis XVI », « banquette restaurant Paris »), « Demandez un devis gratuit ».
  `https://www.atelier-b-tapissier.fr/realisations`.
- Trouvées en cherchant « tapissier décorateur atelier avant après fauteuils réfection galerie ».

## Pages

Assise Autrement : sept (accueil, Mon Histoire, Services – Conseils, Actualités, **Avant – Après**, En Vente, Contact et
Devis) et une page par article. La page Avant – Après : un h1 qui nomme les pièces (« réfection de fauteuils crapauds, de
chaises bridges, de fauteuils voltaires »), trois phrases, puis **une pièce par bloc** : un titre (« Un fauteuil Club
retrouve sa splendeur »), deux ou trois photos (avant, pendant, après ; fichiers nommés `…-avant-restauration.jpg`,
`…-apres-restauration.jpg`), ce qui a été fait (le tissu, l'éditeur, la technique). La Petite Remise : six pages
(accueil, Ameublement / Abat-jour, Initiation, **Galerie Avant/Après**, Actualités, contact) ; atelier.b : cinq (accueil,
Prestations, Store & rideaux, **Réalisations**, Contact).

## Navigation

Barre en haut, cinq à sept entrées ; « Avant – Après » ou « Réalisations » y est TOUJOURS une entrée à part, à côté de
« Contact et Devis ». Le téléphone est au pied (atelier.b : « Tel: 06… » et WhatsApp ; La Petite Remise : bloc de pied
avec adresse, horaires sur rendez-vous, téléphone).

## Accueil (Assise Autrement, mesuré)

Carrousel de trois h1 (« Restauration de sièges », « Créations originales », « Actualités et tutoriels ») ; trois portes
(histoire, services, blog) ; « Envie d'un siège unique… » en long texte ; « réfection légère, rénovation ou restauration
totale » (trois niveaux de travaux, « le tarif d'une réfection légère sera aussi plus doux ») ; les éditeurs de tissus.
L'accueil ne montre presque pas la transformation : elle est une page plus loin. **C'est la transposition** : l'usine met
la page Avant – Après à la place de l'accueil.

## Contact et preuves

Contact : formulaire « Contact et Devis » ; l'ébéniste du 17e (Pages Jaunes) et atelier.b proposent **d'envoyer une photo
pour un devis** ; WhatsApp chez atelier.b. Preuves : les pièces elles-mêmes, les éditeurs de tissus, le CAP (La Petite
Remise), des clients nommés (un château, des hôtels). Aucune des trois n'affiche d'avis sur l'accueil.

## Style des sources (pour mémoire, non repris)

Assise Autrement : fond #fafafa, texte gris #5a5a5a, Alegreya grasse pour les titres (38 px / 20 px au téléphone),
Roboto 300 en italique pour le texte ; carrousel, boutons bleus Facebook. La Petite Remise : gabarit Jimdo. On ne reprend
que l'architecture ; le style vient des atomes (`ff melanger`).

## Ce qu'il faut à l'usine

- `realisations[].avant` (photos avant, celles du client) ; la paire du curseur = `avant[0]` et `photos[0]`.
- Une coquille dont l'accueil est le mur des pièces, un curseur avant / après par pièce qu'on tire à la main (jamais
  automatique, GOUT § 4), les pièces rangées par type en onglets (le mur fait plus de la moitié de la page).
- La porte « envoyez une photo de votre pièce » (WhatsApp, sinon e-mail) en tête et dans le bloc de l'atelier.
- Les niveaux de travaux à prix en pages (une par niveau), l'histoire sur `/a-propos`, toutes les pièces sur `/realisations`.

## Convient à

Atelier dont le travail se voit à la transformation d'une pièce : tapissier, ébéniste restaurateur, rempailleur, doreur,
carrossier, cordonnier, relieur, restaurateur de luminaires ou de vélos anciens, nettoyage de façade ou de toiture ; 3
pièces au moins photographiées avant et après. Pas pour un métier sans objet (institut, urgence), ni pour des chantiers
photographiés seulement à la fin (`index-projets`).

## Signes à ne pas reprendre

Carrousel de h1 ; texte de référencement en long paragraphe (« fauteuil voltaire, crapaud, bergère, Louis XV… ») ;
photos avant / pendant / après posées en vignettes côte à côte (on ne compare rien) ; logos d'éditeurs ; titres en
italique.

## Codée dans l'usine (27 oct 2026)

`layout: { architecture: 'avant-apres' }` (`src/lib/architectures.ts`) : coquille `avant-apres`
(`src/shells/avant-apres.astro`), `realisations[].avant`, `src/lib/avantapres.ts` (`piecesAvantApres`, `paireDe`,
`typesDePieces`, `groupesDePieces`), `src/components/Comparer.astro` (curseur natif + tirage au doigt d'où qu'il parte,
iOS ne déplaçant un curseur que par sa poignée), le curseur en tête de `/realisations/<slug>`, `/realisations` pour cette
coquille (`COQUILLES_A_INDEX_REALISATIONS`), `/a-propos` (`pageAPropos`), mesure `avantApres`, `wording.photoDevis`. Restent :
la demande de devis avec photo jointe (le formulaire ne prend pas de pièce jointe), la page « En vente » (pièces
restaurées à vendre : `produits[]` existe, pas encore branché ici).

Preuve : site jetable (tapissier de démonstration, six pièces de trois types, deux niveaux de travaux, trois avis ; copie
de `_exemple` avec les photos de démonstration de `demo-coiffure`, supprimé), `ff a11y` et `ff ia` verts, `ff verifier`
vert hors données de test, `ff ressemblance` contre tous les sites du registre : 0,58 au premier écran téléphone, 0,38
ordinateur, 0,62 au déroulé (prospect-a-coeur-bois). Essais refusés au déroulé : l'accueil « mur, niveaux à prix, atelier,
avis » (0,75 contre prospect-a-coeur-bois : même ordre, même navigation, même longueur), puis sans les niveaux (0,83) ;
passé quand les types sont devenus des onglets (modèle « onglets ») et l'histoire une page à part, comme sur la source.
