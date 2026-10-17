# Direction — À cœur bois, Guy Andries (prospect-a-coeur-bois)

Démo PRIVÉE pour un vrai commerce prospecté (legal.prospect : noindex, robots fermé). Une seule piste
(`/site-final --une-piste`), 17 oct 2026. Contrat écrit avant de construire, lu par le relecteur. Jamais publié.

## Aiguillage
Photos : les photos du client sont la matière (15 reçues) ; au moins une piste bâtie autour de la meilleure. Ici :
toutes, parce qu'aucune n'est assez grande pour porter seule un premier écran (283 à 800 px de large) ; le site
compose avec leur taille (mur, mosaïques) au lieu de les étirer.
Mouvement : vivant (le client n'a pas tranché ; piste unique, vivante : le mur suit le défilement ; l'autre site
du jour, le maçon, est la piste calme), `motion` none pour le moteur (rien de partagé ne bouge), le mouvement vient
des sections sur mesure.

## Socle (docs/GOUT.md § 0, une ligne par point)
- Pages : présent. Accueil + cinq pages sur mesure, une par rubrique de son site (/cuisines, /meubles,
  /bibliotheques, /agencement, /menuiseries), dans `sites/prospect-a-coeur-bois/pages/`. Les pages service
  partagées sont coupées (`servicePages: false`) parce qu'elles affichent la photo en pleine largeur sur téléphone :
  une photo de 800 px y serait étirée (ratio 1,34, `ff nettete` rouge). Ce n'est pas un site d'une page seulement.
- Téléphone en haut : présent. 06 74 03 78 31 écrit en entier dans la barre du haut, sur téléphone comme sur
  ordinateur, et en grand sur la planche du premier écran ; barre d'actions en bas sur téléphone.
- Métier + ville : présent, h1 « Ébéniste et menuisier à Puyricard, Aix-en-Provence ».
- Avis : présent. 5,0 sur Google, 3 avis, et les deux avis à texte recopiés mot pour mot (Jean Bernard B., Patrick
  D.), juste sous le premier écran, sur une planche qui chevauche le mur.
- Ancienneté : présent, « Depuis 2006 » en texte (création au registre le 1er juin 2006 ; à confirmer avec lui,
  noté dans relecture.md).
- Photos : présent, ses 15 photos, toutes, jamais étirées.
- Portes : présent. Appeler (barre du haut, planche, barre du bas), Écrire (e-mail du brief, lien mailto, aucun
  formulaire), Venir (adresse et horaires), et une porte par projet : votre cuisine, un meuble, une bibliothèque,
  une pièce à agencer, fenêtres et volets.

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
« Sur ce site, les plus de 200 photos de ses galeries, trop petites pour une seule grande image, deviennent un mur
d'atelier en perspective : ses réalisations y sont posées comme des panneaux d'habillage, et le mur se tourne vers
vous à mesure que vous descendez. »

## Test du concurrent
Un autre menuisier d'Aix avec des photos pourrait avoir un mur de photos. Ce qui rend celui-ci à Guy Andries : ce
sont ses quinze réalisations, rangées dans ses cinq rubriques (les portes du site), et le mur répond à son problème
réel (des photos de 800 px qu'un hero plein cadre étirerait) au lieu d'une photo de banque. Le reste vient de lui
seul : la route de Rognes, sa phrase sur « vos envies et exigences », les quatre plans de travail, le stage de 2027,
les deux avis. Résultat : le mécanisme est un geste de métier, le contenu et la raison sont les siens.

## Contrat (six lignes)
- THÈSE : un artisan qu'on appelle pour un projet précis (une cuisine, un meuble). Le site montre d'abord tout son
  travail d'un coup, le numéro et les avis, puis une porte par projet qui ouvre sa page. Refusé : la longue page avec
  formulaire en bas, la grande photo unique (impossible sans étirer), la galerie en grille plate.
- SQUELETTE : coquille `flow`, barre du haut sur mesure (nom, cinq rubriques, numéro en entier), premier écran
  « Mur » (sur mesure) → planche des avis qui chevauche le mur → les cinq rubriques en façades à mosaïque (une
  façade = une page) → l'atelier de Guy Andries (sa phrase, essences, plans de travail, stage 2027, mosaïque) → venir
  et appeler (adresse, horaires, téléphone, e-mail) → pied sur mesure. Cinq pages par rubrique, même barre. Barre
  d'actions en bas sur téléphone (Appeler, Écrire, Venir). Écart avec `ff variete` : aucun site n'a un mur en
  perspective pour premier écran ; direction `nordique` jamais portée par un menuisier dans l'usine (deux sites).
- PREMIER ÉCRAN — famille : carte-sur-photo (attribuée le 17 oct 2026, après coup) ; le mur occupe tout l'écran (quinze panneaux sur ordinateur, douze sur téléphone, chacun à une
  taille que sa photo tient) ; dessus, en bas à gauche (téléphone : sur la moitié basse), une planche claire avec
  un chant de bois et une ombre portée : h1 « Ébéniste et menuisier à Puyricard, Aix-en-Provence », une phrase
  (Guy Andries, depuis 2006, route de Rognes), 06 74 03 78 31 en grand, « 5,0 sur Google, 3 avis », deux portes
  (votre cuisine, un meuble). Le numéro est aussi dans la barre du haut.
- MOUVEMENT (rien sur les titres, pas de rideau, aucun titre qui monte) :
  1. Entrée : les panneaux se posent sur le mur un par un, de l'avant vers le mur (l'ombre se resserre), comme on
     pose un habillage ; lent à léger rebond, 0,5 s chacun, 40 ms d'écart. Raison : poser. Transposé de Mathilde
     De Chiara (images seules, réglées en grille) : on garde « les images d'abord, sans texte dessus ».
  2. Rythme : dans les façades des rubriques, quand une façade arrive à l'écran, ses deux ou trois photos
     s'assemblent (elles glissent de quelques pixels l'une contre l'autre, comme un tenon dans sa mortaise) ; sec,
     0,18 s. Raison : assembler.
  3. Feu d'artifice : le mur suit le défilement : en descendant, il tourne pour se mettre face à vous (de 22° à 6°)
     et recule un peu, linéairement, sans étape. Raison : regarder.
  4. Image qui bouge : la mosaïque de l'atelier glisse moins vite que la page (plan du fond), translation seule.
     Raison : profondeur.
  Courbes : SEC = ease-out court, 0,18 s (l'assemblage, une réponse) ; LENT à rebond =
  `cubic-bezier(0.34, 1.4, 0.64, 1)`, 0,5 s (un panneau qui a du poids et se pose).
- REFUSÉ : photo étirée en plein cadre ; formulaire (portes Appeler / Écrire suffisent, rien n'est envoyé par le
  site) ; crème + serif + lumière de lampe (grappe déjà dépensée pour un ébéniste) ; titres révélés par lignes ;
  rideau ; badge « Depuis 2006 » ; « X ans d'expérience » ; essences de bois nommées (aucune dans le brief, sauf le
  chêne d'une table vue en photo) ; légendes de lieu ou de client sur les photos (rien au brief) ; « sur mesure »
  dans les titres (mot creux de `ff verifier`) ; vignettes polaroid inclinées.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction `nordique` : fond pâle froid (le plâtre clair des intérieurs de ses photos), pas de crème. Accent
  remplacé par un brun noyer (`accent` h 24, s 48, l 30), réservé au téléphone, aux portes et au chant des planches.
- Polices : Familjen Grotesk (grotesque scandinave, gras) pour le h1, les h2 et les h3 en deux graisses, Domine
  pour le texte (serif de lecture, sobre). h1 nettement plus grand que les h2. Aucune police de la liste IA.
- Images : ses quinze photos seulement, jamais au-delà de 1,25 fois leur taille (DPR compris) : sur téléphone, un
  panneau de 800 px fait au plus 330 px de large, un de 336 px au plus 140 px. Pas de photo plein cadre unique : le
  plein cadre est fait du mur entier.
- Matière : le chant des planches (tranche brun noyer), les ombres portées en quatre couches couleur encre, la
  perspective du mur. Aucun grain, aucun halo, aucun dégradé décoratif.
- Calibration : pas crème + serif (gris plâtre + grotesque), pas noir + acide, pas broadsheet, pas de cartes SaaS
  (des façades et des planches avec épaisseur, rayon 2 px).

## Références
- Mathilde De Chiara (`docs/veille/demontages/mathildedechiara.md`) : architecte d'intérieur, images seules et
  filtre par typologie ; on garde les réalisations rangées par type (ses cinq rubriques), sans texte posé dessus.
- Coutumes (`docs/veille/demontages/coutumes.md`) : diptyque ambiance + détail, titre posé sur la couture ; on garde
  le texte posé sur le bord des images (la planche qui chevauche le mur).
- Marché (`docs/veille/marche/framer-lintel.md`, `s-elec.md`) : téléphone en grand au premier écran, une page par
  service, barre d'appel en bas sur téléphone.

## Accepté par le fondateur
(rien encore)
