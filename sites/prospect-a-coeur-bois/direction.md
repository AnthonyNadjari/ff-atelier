# Direction — À cœur bois, Guy Andries (prospect-a-coeur-bois)

Démo PRIVÉE pour un vrai commerce prospecté (legal.prospect : noindex, robots fermé). Une seule piste
(`/site-final --une-piste`), 17 oct 2026. Contrat écrit avant de construire, lu par le relecteur. Jamais publié.

## Aiguillage
Photos : les photos du client sont la matière (15 reçues) ; au moins une piste bâtie autour de la meilleure. Ici :
toutes, parce qu'aucune n'est assez grande pour porter seule un premier écran (283 à 800 px de large) ; le site
compose avec leur taille (une vignette de revue, des mosaïques) au lieu de les étirer.
Mouvement : vivant (le client n'a pas tranché ; piste unique, vivante : le sommaire change la photo de la une, les
plans de l'atelier glissent au défilement ; l'autre site du jour, le maçon, est la piste calme), `motion` none pour
le moteur (rien de partagé ne bouge), le mouvement vient des sections sur mesure.

## Socle (docs/GOUT.md § 0, une ligne par point)
- Pages : présent. Accueil + cinq pages sur mesure, une par rubrique de son site (/cuisines, /meubles,
  /bibliotheques, /agencement, /menuiseries), dans `sites/prospect-a-coeur-bois/pages/`. Les pages service
  partagées sont coupées (`servicePages: false`) parce qu'elles affichent la photo en pleine largeur sur téléphone :
  une photo de 800 px y serait étirée (ratio 1,34, `ff nettete` rouge). Ce n'est pas un site d'une page seulement.
- Téléphone en haut : présent. 06 74 03 78 31 écrit en entier dans la barre du haut, collante, sur téléphone comme
  sur ordinateur, et en grand au premier écran. Pas de barre d'actions en bas (l'action reste en haut).
- Métier + ville : présent, h1 « Ébéniste et menuisier à Puyricard, Aix-en-Provence ».
- Avis : présent. 5,0 sur Google, 3 avis, et l'avis de Patrick D. en citation AU PREMIER ÉCRAN ; les deux avis à
  texte recopiés mot pour mot (Jean Bernard B., Patrick D.) dans la page « courrier » après les rubriques.
- Ancienneté : présent, « Depuis 2006 » en texte (création au registre le 1er juin 2006 ; à confirmer avec lui,
  noté dans relecture.md).
- Photos : présent, ses 15 photos, toutes, jamais étirées.
- Portes : présent. Appeler (barre du haut, collante, et en grand au premier écran), Écrire (e-mail du brief, lien
  mailto, aucun formulaire, au premier écran et dans Venir), Venir (adresse et horaires), et une porte par projet :
  le sommaire du premier écran (cuisines, meubles, bibliothèques, agencement, menuiseries).

## Faits propres (tous tirés du brief)
1. Le nom « à coeur bois », atelier au 820 route de Rognes, 13540 Puyricard, à Aix-en-Provence.
2. Guy Andries, « ébéniste / menuisier diplômé », entreprise individuelle.
3. Entreprise créée le 1er juin 2006 (registre public), à confirmer avant d'afficher « Depuis 2006 ».
4. Cinq rubriques sur son site : Cuisines, Meubles sur mesure, Bibliothèques, Agencement d'intérieurs, Menuiserie diverses.
5. Plans de travail : pierre acrylique naturelle LG HI-MACS, compact stratifié, Dekton, pierre.
6. Sa phrase : « Chaque réalisation est le fruit de vos envies et exigences ! »
7. « Large choix d'essence de bois et dérivé bois » (office de tourisme).
8. Volets provençaux sur mesure (office de tourisme) ; volets, fenêtres, terrasse, parquet, bardage.
9. En projet pour 2027 : stage d'initiation menuiserie / ébénisterie pour particuliers débutants, une semaine, 30 h.
10. Horaires : lundi à vendredi, 9 h à 12 h et 14 h à 18 h ; fermé le samedi et le dimanche.
11. Note Google 5,0 sur 3 avis : Jean Bernard B. et Patrick D. ont écrit un texte.
12. Ses galeries : plus de 200 photos, servies à 800 px de large au plus, sans légende.

## Phrase-idée
« Sur ce site, les photos de ses galeries, trop petites pour une seule grande image (800 px au plus), sont mises en
page comme dans une revue d'atelier : une photo à la fois, en vignette légendée à la taille qu'elle tient, et le
sommaire de ses cinq rubriques, qui change la photo de la une quand on le parcourt. »

## Test du concurrent
Un autre menuisier d'Aix pourrait avoir une page d'accueil en forme de revue. Ce qui rend celle-ci à Guy Andries :
le sommaire est fait de ses cinq rubriques (les pages de son site), chaque vignette est une de ses quinze photos,
légendée de ce qu'on y voit, et la mise en page répond à son problème réel (des photos de 800 px qu'un plein cadre
étirerait) au lieu d'une photo de banque. Le reste vient de lui seul : la route de Rognes, sa phrase sur « vos envies
et exigences », les quatre plans de travail, le stage de 2027, les deux avis. Résultat : passe, à condition de ne
légender que ce qu'on voit sur la photo.

## Contrat (six lignes)
- THÈSE : un artisan qu'on appelle pour un projet précis (une cuisine, un meuble). Le site se lit comme une revue de
  son atelier : qui, où, depuis quand, le numéro et un avis d'abord, puis le sommaire de ses rubriques, une page
  chacune. Refusé : la longue page avec formulaire en bas, la grande photo unique (impossible sans étirer), la
  galerie en grille plate.
- SQUELETTE : coquille `flow`, barre du haut sur mesure, collante (nom, cinq rubriques, numéro en entier : l'action
  reste en haut, aucune barre en bas) ; premier écran « Édito » (page de revue : titre, chapô, vignette, numéro,
  citation d'un avis, sommaire) → les cinq rubriques en façades à mosaïque (une façade = une page) → les avis en
  page « courrier » (la note en grand, les deux avis en colonnes, filets) → l'atelier de Guy Andries (sa phrase,
  essences, plans de travail, stage 2027, mosaïque) → venir et appeler (adresse, horaires, téléphone, e-mail) → pied
  sur mesure. Cinq pages par rubrique, même barre. Écart avec `ff variete` : aucun site n'a une page de revue pour
  premier écran ; direction `nordique` jamais portée par un menuisier dans l'usine (deux sites).
- PREMIER ÉCRAN — famille : editorial (refait le 17 oct 2026, soir : l'ancien, une planche posée sur un mur de
  photos, était le même que les trois autres sites du jour) ; une page de revue sur le plâtre clair : double filet
  en tête, h1 « Ébéniste et menuisier à Puyricard, Aix-en-Provence » en très grand, EN HAUT, sur neuf colonnes de
  douze (téléphone : toute la largeur, quatre lignes) ; sous un filet, le chapô à lettrine (Guy Andries, diplômé,
  route de Rognes, « Depuis 2006 ») ; UNE photo en vignette décalée (une cuisine en bois clair, légendée de ce qu'on y voit)
  qui descend dans la marge du titre et coupe le filet (téléphone : à droite du chapô, jusqu'au bord) ; 06 74 03 78 31
  en grand avec les horaires et « Écrire à l'atelier » ; l'avis de Patrick D. en citation avec « 5,0 sur Google,
  3 avis » ; puis le sommaire de ses cinq rubriques (bandeau de cinq colonnes sur ordinateur, liste à filets sur
  téléphone), une page chacune. Aucune carte, rien n'est posé sur une photo.
- MOUVEMENT (rien sur les titres, pas de rideau, aucun titre qui monte) :
  1. Entrée : le double filet et le filet sous le titre se tracent de gauche à droite (0,7 s, lent, sans rebond),
     puis la vignette se pose dans son décalage, de 14 px plus bas, lent à léger rebond, 0,6 s ; le titre ne bouge
     pas. Raison : mettre en page. Transposé de Mathilde De Chiara (images seules, réglées en grille) : on garde
     « une image à la fois, à sa taille, sans texte dessus ».
  2. Rythme : dans les façades des rubriques, quand une façade arrive à l'écran, ses deux ou trois photos
     s'assemblent (elles glissent de quelques pixels l'une contre l'autre, comme un tenon dans sa mortaise) ; sec,
     0,18 s. Raison : assembler.
  3. Feu d'artifice : le sommaire du premier écran change la une : survoler une rubrique (ou la parcourir au
     clavier) met sa photo dans la vignette, avec sa légende ; fondu sec, 0,18 s. Rien ne tourne tout seul. Raison :
     feuilleter.
  4. Image qui bouge : la mosaïque de l'atelier glisse moins vite que la page (plan du fond), translation seule.
     Raison : profondeur.
  Courbes : SEC = ease-out court, 0,18 s (l'assemblage, la photo de la une qui change : des réponses) ; LENT à
  rebond = `cubic-bezier(0.34, 1.4, 0.64, 1)`, 0,6 s (la vignette qui se pose) et ease-out lent, 0,7 s (les filets).
- REFUSÉ : photo étirée en plein cadre ; formulaire (portes Appeler / Écrire suffisent, rien n'est envoyé par le
  site) ; crème + serif + lumière de lampe (grappe déjà dépensée pour un ébéniste) ; titres révélés par lignes ;
  rideau ; badge « Depuis 2006 » ; « X ans d'expérience » ; essences de bois nommées (aucune dans le brief, sauf le
  chêne d'une table vue en photo) ; légendes de lieu ou de client sur les photos (rien au brief) ; « sur mesure »
  dans les titres (mot creux de `ff verifier`) ; vignettes polaroid inclinées.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction `nordique` : fond pâle froid (le plâtre clair des intérieurs de ses photos), pas de crème. Accent
  remplacé par un brun noyer (`accent` h 24, s 48, l 30), réservé au téléphone, aux portes et au chant des façades des rubriques.
- Polices : Familjen Grotesk (grotesque scandinave, gras) pour le h1, les h2 et les h3 en deux graisses, Domine
  pour le texte (serif de lecture, sobre). h1 nettement plus grand que les h2. Aucune police de la liste IA.
- Images : ses quinze photos seulement, jamais au-delà de 1,25 fois leur taille (DPR compris) : sur ordinateur une
  photo de 800 px fait au plus 496 px de large, sur téléphone 330. Pas de photo plein cadre : au premier écran, UNE
  photo en vignette légendée, à sa taille ; les autres dans les rubriques et les pages.
- Matière : la page de revue (double filet, filets fins, lettrine, légendes), l'ombre portée de la vignette, le
  chant brun noyer des façades des rubriques. Aucun grain, aucun halo, aucun dégradé décoratif.
- Calibration : pas crème + serif (gris plâtre + grotesque), pas noir + acide ; revue d'atelier et pas broadsheet
  (pas de serif de journal pour les titres, pas de colonnes de texte justifié, pas de date de une) ; pas de cartes
  SaaS (rayon 2 px).

## Références
- Mathilde De Chiara (`docs/veille/demontages/mathildedechiara.md`) : architecte d'intérieur, images seules et
  filtre par typologie ; on garde les réalisations rangées par type (ses cinq rubriques), sans texte posé dessus.
- Coutumes (`docs/veille/demontages/coutumes.md`) : diptyque ambiance + détail, titre posé sur la couture ; on garde
  l'image qui coupe la ligne (la vignette décalée qui coupe le filet sous le titre).
- Marché (`docs/veille/marche/framer-lintel.md`, `s-elec.md`) : téléphone en grand au premier écran, une page par
  service ; l'action d'appel toujours à l'écran, ici en haut (barre collante), pas en barre de trois boutons en bas.

## Accepté par le fondateur
(rien encore)
