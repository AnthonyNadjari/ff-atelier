# Direction — Alain Ballay, maçon carreleur (prospect-ballay-macon)

Démo PRIVÉE pour un vrai artisan prospecté (legal.prospect : noindex, robots fermé). Une seule piste
(`/site-final --une-piste`), 17 oct 2026. Contrat écrit avant de construire, lu par le relecteur. Jamais publié.

## Aiguillage
Photos : les photos du client sont la matière (15 reçues) ; au moins une piste bâtie autour de la meilleure. Ici :
le barbecue en pierre (4 032 px, la seule photo en largeur) porte le premier écran ; les autres, en hauteur, font
l'échantillonnier et les pages.
Mouvement : calme (le client n'a pas tranché ; piste unique, calme : rien ne suit le défilement ; l'autre site du
jour, l'ébéniste, est la piste vivante), `motion` subtle, le geste répond au doigt.

## Socle (docs/GOUT.md § 0, une ligne par point)
- Pages : présent. Accueil + six pages sur mesure, une par service de sa page Services, dans
  `sites/prospect-ballay-macon/pages/` (photo de chantier en grand, texte posé dessus). Les pages service partagées
  sont coupées (`servicePages: false`) parce qu'elles réduisent la photo à une vignette arrondie à côté du texte
  (GOUT § 0, « pas une vignette »). Ce n'est pas un site d'une page seulement.
- Téléphone en haut : présent. 06 88 70 72 35 en entier dans la barre du haut (téléphone et ordinateur), en très
  grand sur la carte du premier écran, et dans la barre d'actions en bas sur téléphone.
- Métier + ville : présent, h1 « Maçon carreleur à Perpignan ».
- Avis : présent. 5,0 sur Google, 5 avis, et deux avis recopiés mot pour mot (Julien D. ; Nonam Tattoo, nom du compte
  tel qu'affiché, un commerce), juste sous le premier écran. L'avis de MARI Electricité est écarté : texte replié par
  Google, à relire avant usage (brief).
- Ancienneté : présent, « À son compte depuis septembre 2000 » en texte.
- Photos : présent, ses photos de chantier ; jamais les photos Pexels de son site actuel.
- Portes : présent. Appeler ; Estimation gratuite (lien mailto vers son e-mail, objet rempli ; rien n'est envoyé
  par le site) ; Venir (adresse, horaires) ; et une porte par travaux (terrasse, salle de bain, parement, cuisine
  d'été, maçonnerie, toiture, façade).

## Faits propres (tous tirés du brief)
1. Alain Ballay, artisan maçon carreleur, 5 rue Étienne-Louis Boullée, 66000 Perpignan.
2. « Artisan Maçon depuis septembre 2000 » ; registre : création le 2 octobre 2000.
3. « ancien maitre ouvrier dans les monuments historiques ».
4. Six services : Pierres de parements, Cuisines d'été et barbecues personnalisés, Carrelages et Faïences, Maçonnerie Générale, Démoussage de toitures, Nettoyage de façades.
5. Démoussage : « produits biodégradables » garantis.
6. « obtenir une estimation gratuite » (page contact de son site).
7. Zone : « Perpignan et ses alentours ».
8. Horaires : lundi à vendredi, 8 h à 18 h ; fermé le week-end.
9. Note Google 5,0 sur 5 avis ; Julien D. (terrasse et carrelage de la SdB), Nonam Tattoo (salle de bain).
10. 82 photos de chantier sur sa page Réalisations, prises au téléphone, beaucoup « en cours » (chape, croisillons, natte orange).
11. Matériaux visibles sur ses chantiers : parement pierre, opus incertum, grands carreaux, plinthe effet bois, brique, sol ardoise.
12. Un barbecue maçonné en pierre, portes bois, sa seule photo en largeur (4032 px).

## Phrase-idée
« Sur ce site, les matériaux que montrent ses photos de chantier (parement pierre, opus incertum, grands carreaux,
effet bois, brique, ardoise) deviennent un échantillonnier : on touche un échantillon taillé dans sa photo, et le
chantier où il est posé s'ouvre en grand, avec la page du travail qui le pose. »

## Test du concurrent
Un autre maçon de Perpignan pourrait aligner des échantillons de matériaux, mais ce seraient des photos de
fournisseur. Ici chaque échantillon est découpé dans une photo de ses chantiers, et chacun ouvre CE chantier (la
jardinière en parement, la cour en opus incertum, la terrasse en grands carreaux) : le nuancier est la preuve de son
travail, pas un catalogue. Il porte aussi ce qui le distingue (maçonnerie et carrelage par la même entreprise, ancien
maître ouvrier des monuments historiques). Résultat : l'idée passe le test, à condition de ne montrer que ses
photos et de ne nommer que les matériaux qu'on y voit.

## Contrat (six lignes)
- THÈSE : un artisan du bâtiment qu'on appelle pour un devis. Le site dit d'abord qui, quoi, où, depuis quand, le
  numéro, les avis et l'estimation gratuite ; puis il prouve par les chantiers et ouvre une page par travail.
  Refusé : la page unique avec formulaire en bas et le texte générique de son site actuel (« Nous redéfinissons
  l'Art de la Maçonnerie »).
- SQUELETTE : coquille `flow`, barre du haut sur mesure couleur encre (nom, métier, numéro en entier, menu des six
  travaux) ; premier écran « Chantier » (photo plein cadre, carte posée dessus) → bande des avis qui chevauche la
  photo → l'échantillonnier (sur mesure, le geste) → les six travaux (une page chacun, photo en grand) → Alain
  Ballay (monuments historiques, septembre 2000, une colonne de photos en cours de chantier) → questions et contact
  (estimation gratuite, zone, horaires, adresse) → pied sur mesure. Barre d'actions en bas sur téléphone (Appeler,
  Estimation gratuite, Venir). Écart avec `ff variete` : direction `mediterranee` portée une seule fois (restaurant),
  jamais par un artisan du bâtiment ; aucun échantillonnier dans les signatures.
- PREMIER ÉCRAN : photo du barbecue en pierre plein cadre (tout l'écran sur ordinateur, 56 % de la hauteur sur
  téléphone) ; une carte posée dessus, en bas à gauche, avec une tranche terre cuite (épaisseur d'un carreau) et une
  ombre portée : h1 « Maçon carreleur à Perpignan », la phrase (Alain Ballay, septembre 2000, monuments
  historiques), 06 88 70 72 35 en très grand, « Estimation gratuite », la note 5,0 sur Google (5 avis). Le numéro
  est aussi dans la barre du haut.
- MOUVEMENT (rien sur les titres, pas de rideau, rien ne suit le défilement) :
  1. Entrée : la carte se pose sur la photo comme un carreau sur sa colle : elle arrive de 10 px au-dessus, l'ombre
     se resserre, 0,6 s ease-out sans rebond (client calme). Raison : poser. Transposé de KS Architectes
     (réalisations classées par type) : on garde « le chantier d'abord, le texte posé à côté ».
  2. Rythme : dans l'échantillonnier, chaque échantillon touché s'enfonce d'un pixel et son nom s'affiche, sec,
     0,15 s. Raison : choisir.
  3. Feu d'artifice : toucher un échantillon (ou les flèches du clavier) : la grande photo du chantier change par
     un glissé latéral court, sec à l'arrivée, avec le nom du matériau et la page du travail ; on peut aussi faire
     glisser la rangée d'échantillons au doigt. Rien ne tourne tout seul. Raison : comparer.
  4. Image qui bouge : au premier écran, la photo du barbecue entre par un léger recul (de 1,04 à 1, 1,2 s, lent),
     une seule fois, sans suivre le défilement. Raison : ouvrir.
  Courbes : SEC = ease-out, 0,15 s (l'échantillon enfoncé, le nom qui change : des réponses) ; LENT = ease-out long,
  0,6 à 1,2 s, sans rebond (la carte et la photo qui se posent, client calme).
- REFUSÉ : photos Pexels de son site actuel ; « 30 ans d'expérience » (signe « X ans », GOUT § 2) ; avant / après
  (aucune paire de la même vue au brief : les photos en cours et finies ne montrent pas le même endroit) ; paires
  inventées ; formulaire ; section avis avec l'avis replié de MARI Electricité ; noms de rues ou de villes sur les
  chantiers (rien au brief) ; « sur mesure », « savoir-faire », « expertise » ; tout ce qui suit le défilement.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

## Typographie, couleur, images
- Direction `mediterranee` : blanc de chaux, terre cuite (l'accent : le carreau de ses sols anciens), bleu (la porte
  bleue d'une de ses terrasses, accent secondaire). Barre du haut et pied en encre.
- Polices : Special Gothic (gothique américaine franche, l'enseigne peinte d'un camion d'artisan) pour h1, h2 et
  h3 en deux graisses ; Karla pour le texte (Archivo dépassait le budget de polices avec la mono de la direction). h1 nettement plus grand que les h2. Aucune police de la liste IA.
- Images : ses photos de chantier, en grand ; échantillons découpés dans ces mêmes photos (zoom sans agrandir au-delà
  de la source). Jamais de photo de banque.
- Matière : la tranche terre cuite des cartes (épaisseur d'un carreau), les joints clairs entre échantillons, les
  ombres portées couleur encre. Aucun grain, aucun halo.
- Calibration : pas crème + serif (chaux + gothique franche), pas noir + acide, pas broadsheet, pas de cartes SaaS.

## Références
- KS Architectes (`docs/veille/demontages/ksarchitectes.md`) : réalisations classées par commune et par type ; on
  garde le classement par type (matériau, travail), sans lieu (absent du brief).
- Délice (`docs/veille/demontages/delice.md`) : barre d'actions en bas sur téléphone et horaires du jour ; on garde
  la barre Appeler / Estimation / Venir.
- Maison Boursier (`docs/veille/demontages/maisonboursier.md`) : le titre de maître (MOF) dit tôt ; on garde
  « ancien maître ouvrier des monuments historiques » dès la phrase du premier écran.

## Accepté par le fondateur
(rien encore)
