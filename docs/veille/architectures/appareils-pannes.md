# appareils-pannes : le site d'un réparateur part de l'appareil en panne

Volet 2a ter de `/veille`, tour du 28 oct 2026 (tour 13). Relevé au `curl` (HTML servi) de l'accueil et d'une page
d'appareil des deux sources, plus un démontage automatique de l'accueil de Satisfix (`ff demonter`, Chromium 390x844,
capture gardée : `appareils-pannes-source.jpg`). On reprend la construction, jamais les textes, images, logos ou code des
sources.

## Sources

- **Satisfix** (réparation d'électroménager à domicile, Lyon, Saint-Étienne, Ain, Isère) :
  [satisfix.fr](https://satisfix.fr/) et [satisfix.fr/reparation/lave-linge/](https://satisfix.fr/reparation/lave-linge/),
  lus le mercredi 28 oct 2026. Le menu « Réparer » est déplié en trois familles (Univers Lavage, Univers Cuisson, Univers
  Froid) et leurs neuf appareils ; un **forfait par famille** (lavage 75 €, cuisson et froid 95 €) ; une page par appareil
  avec son forfait, ses marques rangées en trois gammes et **« Pannes de lave-linge prises en charge »** : dix pannes
  nommées comme au téléphone (« Ne vidange plus », « Tambour bloqué », « Code erreur affiché ») et leurs causes.
- **Lavoiserie** (réparation d'électroménager à domicile, Lyon) : [lavoiserie.fr](https://lavoiserie.fr/), lu le même
  jour. Sous la réservation, « Tous vos appareils, une seule solution » : **chaque appareil avec ses pannes** (« Tambour
  bloqué, fuite d'eau, essorage défaillant, code erreur… ») et « à partir de 65 € », vers « Voir les pannes réparées » ;
  puis « Comment ça marche ? » en quatre étapes, les avis, la FAQ.

## Pages

Satisfix : une trentaine (accueil ; une page par appareil, neuf ; un guide de dépannage par appareil ; une page par zone,
Lyon, Saint-Étienne, Ain ; bonus réparation ; notre ADN ; FAQ ; contact ; boutique à part). Lavoiserie : une dizaine
(accueil avec la réservation, une page par appareil, contact).

## Navigation

Satisfix : « Réparer » (les familles et les appareils), « Acheter », « Blog », « Tout savoir », « Nos zones », « Aide », puis
le numéro **avec ses horaires** (« Lun-Ven 9h-16h ») et « Prendre rendez-vous ». Lavoiserie : la barre de réservation
(l'appareil, la ville) fait la nav.

## Accueil (Satisfix, mesuré)

La note Google en bandeau, le h1 « Réparation d'électroménager à domicile » et les villes, une rangée de portraits de
techniciens, **les forfaits par famille**, « Tous vos appareils, un seul interlocuteur » (les appareils vers leur page),
les quatre étapes, « Réparer ou remplacer », les avis, les tarifs par zone, des statistiques, un reportage télévisé, la
FAQ. **C'est la transposition** : le visiteur ne cherche pas « un réparateur », il a un appareil qui ne fait plus une chose
précise ; l'usine met juste sous le premier écran « Quel appareil est en panne ? », un onglet par famille avec son forfait,
chaque appareil et ses pannes en mots du client, chaque panne vers son ancre sur la page de l'appareil ; et dans le même
bloc ce qu'on lit une fois l'appareil trouvé : les étapes, les communes, les marques, « pas dans la liste ? ».

## Page intérieure (un appareil)

Satisfix : h1 « Réparation de lave-linge à domicile à Lyon », le forfait, les marques par gamme, les dix pannes et leurs
causes, les étapes, le comparatif réparer ou remplacer, les avis, la FAQ de l'appareil, un long texte. L'usine :
`/appareils/<slug>` : le nom, le métier à la ville, le prix (le sien, sinon celui de sa famille), le forfait et la garantie,
la photo du client ; les pannes, une ancre chacune (`#ne-vidange-plus`, mise en avant par `:target` quand on y arrive), avec
leurs causes ; les marques ; les étapes ; Appeler et la demande ; les autres appareils. `/appareils` : tout, sans onglets, puis
les questions du client.

## Contact et preuves

Satisfix : le numéro et ses horaires en tête, « Prendre rendez-vous » (créneau en ligne), la note Google partout. L'usine :
le téléphone en tête (socle), la note, les avis sous le bloc, « Votre appareil ou votre panne n'est pas dans la liste ? »
sous la liste (le numéro et le tiroir pour écrire).

## Style des sources (pour mémoire, non repris)

Satisfix : émojis devant chaque titre (🔧, 🛡️, 🎫), coches « ✓ Déplacements illimités », prix barrés (« 125 € 75 € »),
« +3000 avis » et logo BFMTV en bandeau, statistiques de résolution, texte de référencement répété sous chaque bloc.
Lavoiserie : capitales espacées (« INTERVENTION RAPIDE À DOMICILE »), « Pourquoi choisir » en six cartes à pictogrammes. Le
style vient des atomes (`ff melanger`) ; rien de cela n'est repris (GOUT § 2).

## Ce qu'il faut à l'usine

- `appareils` dans le schéma : `forfait`, `garantie`, `familles[]` (nom, prix, note), `liste[]` (slug, nom, famille, prix,
  `pannes[]` : nom et causes, `marques[]`, photo), `marques[]`, `etapes[]`.
- Une coquille dont l'accueil est le choix de l'appareil, en onglets par famille, les pannes en liens vers leur ancre ;
  `/appareils` et `/appareils/<slug>`.

## Convient à

Réparateur qu'on appelle pour un objet qui ne fait plus une chose précise et dont le client nomme les pannes :
électroménager, chaudières et pompes à chaleur, vélos et trottinettes électriques, téléphones et ordinateurs, machines à
café, motoculture, volets roulants et portails ; 3 appareils avec leurs pannes. Pas pour un chantier sur devis
(`estimation-etapes`), ni pour la réparation par colis (`atelier-par-colis`), ni pour la seule urgence (`grille-urgence`).

## Signes à ne pas reprendre

Émojis en pictogrammes, coches devant chaque avantage, prix barrés, « +3000 avis » et logos de télévision, statistiques de
résolution, capitales espacées, texte de référencement répété, « réparé en 24 h » sans que le client l'ait dit.

## Codée dans l'usine (28 oct 2026)

`layout: { architecture: 'appareils-pannes' }` (`src/lib/architectures.ts`) : coquille `appareils`
(`src/shells/appareils.astro`), `appareils` dans le schéma, `src/lib/appareils.ts` (`appareilsComplets`, `famillesDe`,
`prixDe`, `marquesDe`, `slugPanne`, `marquesParLettre`, `toutesLesMarques`, `lienAppareils`), `src/pages/appareils/[...index].astro`
et `[slug].astro`, `wording.appareils`, `wording.panne`, mesure `appareils`, pied `minimal`, tiroir de contact ; la FAQ du
site passe sur `/appareils` (avec elle sur l'accueil, le bloc à onglets ne tenait plus que 0,46 de la page). Restent : la
réservation d'un créneau en ligne, une page par zone avec ses tarifs, le guide de dépannage par appareil.

Preuve : site jetable (réparateur d'essai à Angers, trois familles, cinq appareils, douze marques, trois étapes, deux avis
d'essai ; sans photo, supprimé), `ff verifier` vert hors téléphone et e-mail de test, `ff ia` vert, `ff ressemblance` contre
les 39 sites du registre 0,60 / 0,54 / 0,55 (téléphone / ordinateur / déroulé ; modèle « onglets », le bloc tient 0,55 de la
page au téléphone). Capture téléphone : `appareils-pannes-essai.jpg` ; source : `appareils-pannes-source.jpg`.
