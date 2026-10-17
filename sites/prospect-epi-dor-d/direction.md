# Direction — L'Épi d'Or, boulangerie-pâtisserie à Orléans, version D (prospect-epi-dor-d)

Démo PRIVÉE pour un vrai commerce prospecté (données publiques du 17 oct 2026, `legal.prospect`), quatrième des quatre
versions. Lecture de cette version : **la carte de visite**. La plupart des gens qui tapent « L'Épi d'Or » veulent
l'adresse, l'heure et le numéro : tout tient sur un écran, sur la couleur d'or du nom, et les rayons sont des pages
derrière. Un site qui ne fait pas défiler.

Style : mélange <typo:coutumes · couleurs:cafebinocle · densite:coutumes · formes:paputmenorca · photos:odysseeclinic · mouvement:relaisrossar · matiere:cafebinocle> · Architecture : carte-de-visite · PREMIER ÉCRAN — famille : cadre-colore

(Le mélange 3 de `node scripts/ff.mjs melanger prospect-epi-dor-b --n 3` (typo de Monarque, couleurs de Framer Lintel :
noir, gris clair et bleu d'interface #4d94ff) a été REJETÉ sur la planche d'essai `captures/planches/prospect-epi-dor-b-melanges.jpg` :
sur les photos chaudes de la boutique, le bleu des boutons et des liens donnait un gabarit de logiciel, pas une
boulangerie ; et les mélanges 1 et 2 étaient déjà deux clairs à serif. Retiré avec `--graine 66` (typo de Coutumes,
couleurs de Café Binocle : le jaune d'or du nom), puis appliqué avec tous ses atomes imposés. Architecture et famille imposées : celles de cette version.)

## Aiguillage
Photos : les photos du client sont la matière (10 reçues) ; au moins une piste bâtie autour de la meilleure : ici
l'entremets décor chocolat en carte, et la photo de chaque rayon qui vient dans la carte quand on le survole. Écartées :
galerie-04, galerie-05 (prénom d'un enfant), galerie-07 (super-héros), dans `raw/ecartees/`.
Mouvement : calme (le client n'a pas tranché : sur les trois nouvelles versions, B est la vivante, C et D les calmes),
`motion` subtle ; rien ne suit le défilement (il n'y a pas de défilement).

## Socle (docs/GOUT.md § 0)
- Pages : présent. L'accueil est un écran ; la carte « Les pages » mène aux cinq pages des rayons (pain, pâtisseries,
  pièces montées, sandwichs, fêtes), plus mentions et confidentialité.
- Téléphone en haut : présent. En tête du panneau, en Bebas, sans défiler, au téléphone comme à l'ordinateur.
- Métier + ville : présent, « Boulangerie-pâtisserie à Orléans. » juste sous le h1 « L'Épi d'Or ».
- Avis : présent. 4,6 sur 5, 162 avis Google, et les avis du brief recopiés (deux à l'ordinateur, Sylvia D. au téléphone)
  dans leur propre plan, sur l'écran. Correction de l'usine faite pour cette version : la coquille `carte` n'affichait
  que la note dès qu'une note existait (`avisDeCarte`, testé).
- Ancienneté : absent : le brief dit « ? à demander avant d'afficher une date ».
- Photos : présent. L'entremets en carte ; au survol d'un rayon, la photo de ce rayon (pièce montée, bûche) vient dans la
  carte ; le pain et les sandwichs n'ont pas de photo au brief, la carte ne change pas.
- Portes : présent. Appeler (le numéro) ; Écrire / Commander un gâteau (tiroir : numéro, e-mail, adresse, horaires) ;
  l'adresse vers l'itinéraire Google ; les pages des rayons.

## Faits propres (tous tirés du brief)
1. La devanture « L'ÉPI D'OR » au 59 rue Maurice Dubois, Orléans ; téléphone 02 38 88 30 51.
2. Horaires : mardi au samedi 6 h 45 – 13 h et 15 h 30 – 19 h 30 ; dimanche 7 h – 12 h 30 ; lundi fermé.
3. Xavier, « Responsable et Boulanger » ; Miroslava, « Créatrice de Douceurs » ; Christelle, « Hôtesse des Délices » ;
   Pauline, « Artisane de la Convivialité », « experte en café ».
4. 36 pièces montées au catalogue, « pour toutes les occasions ».
5. Bûches de Noël : « Commandez au plus tôt pour vous assurer un Noël gourmand. »
6. Baguette 4 Saisons « Que les weekends », Baguette Epi « Sur commande ».
7. Note Google 4,6 sur 162 avis ; Sylvia D. : « Sandwich à la commande généreusement garni ».
8. Galerie du site : entremets décor chocolat, pièce montée à trois étages, bûches de Noël, photos signées « L'Épi D'Or ».
9. contact@boulangerielepidor.fr ; Instagram boulangerielepidor.

## Phrase-idée
« Sur ce site, la carte de visite de L'Épi d'Or (or du nom, adresse, heure, numéro) montre les gâteaux de sa galerie :
on passe sur “Pièces montées”, la pièce montée à trois étages vient dans la carte ; et le pied dit qui fait la boutique,
avec les mots qu'elle emploie (Créatrice de Douceurs, Hôtesse des Délices, experte en café). »

## Test du concurrent
Une carte de visite d'un écran irait à n'importe quel commerce : c'est l'architecture, pas l'idée. Ce qui la rend à
L'Épi d'Or : l'or de son nom en fond, SES photos qui viennent par rayon (et pas pour le pain, qu'elle n'a pas
photographié), SES horaires coupés, et SON équipe nommée avec SES titres maison. Résultat : tient, à condition que la
carte ne montre que des photos de sa galerie.

## Contrat (six lignes)
- THÈSE : un écran qui répond (où, quand, quel numéro), les pages derrière ; refuse la longue page par défaut et la version A
  (devanture plein cadre et carte posée dessus).
- SQUELETTE : architecture `carte-de-visite` (Nowa) : coquille `carte`, aucune nav, aucune section empilée. Ordinateur :
  la marge d'or tient à gauche l'identité (h1, métier à ville, une phrase) et les avis ; à droite la photo en carte, le
  salut du moment au milieu, la carte « Les pages » en haut, le panneau (numéro, adresse, écrire, horaires du jour) en
  bas. Téléphone : identité, photo, panneau qui remonte sur la photo, avis, pages, pied. Pied sur mesure « Pied »
  (l'équipe, légal). Contact en tiroir. `ff ressemblance` : premier écran et déroulé sous 0,65 contre tous les sites ;
  modèle « accueil-menu sans défilement » (1,4 écran au téléphone).
- PREMIER ÉCRAN — famille : cadre-colore ; tout le site posé sur l'or `#ffe26e` : à gauche « L'ÉPI D'OR » en Bebas de
  110 px brun, en bas à gauche la note et les deux avis sous un filet ; à droite (64 %) l'entremets en carte avec
  « BONJOUR » ou « BONSOIR » en or au milieu ; le numéro en tête du panneau or en bas à droite. Jamais de h1 sur la photo.
- MOUVEMENT :
  1. Entrée : rien ne bouge à l'ouverture, sauf le salut qui dit l'heure qu'il est à Orléans (Bonjour, Bonsoir après
     18 h). Raison : accueillir. On transpose Nowa (fiche d'architecture) : le salut du moment, sans sceau qui tourne.
  2. Rythme : aucun défilement ; le seul rythme est celui des jours : le panneau dit ouvert, fermé ou quand ça rouvre.
     Raison : savoir. On transpose Relais Rossàr (`relaisrossar.md`) : le calme, une seule chose à la fois.
  3. Geste (le feu d'artifice) : à l'ordinateur, survoler ou atteindre au clavier un rayon de « Les pages » fait venir sa
     photo dans la carte (fondu lent, 0,45 s), l'entremets revient quand on part ; au doigt, toucher ouvre la page.
     Raison : choisir.
  4. Image : les liens et les pages réagissent sec au survol (0,15 s) ; la photo de la carte ne bouge pas seule. Raison :
     répondre.
  Courbes : SEC = ease-out 0,15 s (liens, pages) ; LENT = 0,45 s pour la photo qui vient, la seule chose lente.
- REFUSÉ : la devanture en photo de carte (c'est la version A) ; h1 blanc sur la photo ; sceau qui tourne, surcouche
  d'inscription, capitales espacées de la source ; vignettes de l'équipe ; « Depuis 2001 » ; prix ; photos 04, 05, 07 ;
  le mélange 3 (bleu d'interface) ; une section empilée sous la carte (l'écran resterait un écran de plus).
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction générée `m-cca519` (mélange) : Bebas Neue (titres, d'après Coutumes) et Spectral (texte, Coutumes) ; fond or
  `#ffe26e`, brun `#594b3c` pour le texte et les filets, crème `#fffeec` en surface, rouge-orangé `#ef5b34` en aplat des
  boutons (assombri en `#b8340f` quand il sert de texte, calcul AA). Rayon 6 px, cartes à angle droit, aucune ombre.
- Images : plein cadre dans la carte (atome photos d'Odyssée Clinic), voile d'encre de la coquille pour lire le salut.
- Calibration : pas crème + serif + terracotta (or franc + grotesque condensée), pas noir + acide, pas de broadsheet,
  pas de cartes SaaS.

## Références
- Coutumes (`docs/veille/demontages/coutumes.md`) : la condensée en capitales contre un texte à empattements ; on garde
  le contraste des deux voix.
- Café Binocle (`docs/veille/demontages/cafebinocle.md`) : le jaune franc en fond de page et le brun en encre ; on garde
  la couleur entière, pas en accent.
- Relais Rossàr (`docs/veille/demontages/relaisrossar.md`) : le régime calme.
- Architecture : Nowa (`docs/veille/architectures/nowa.md`).

## Accepté par le fondateur
(rien encore)
