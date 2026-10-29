# Direction — Brasserie de la Cluse (demo-brasserie)

Contrat écrit avant de construire (`/site-final`, une piste, 29 oct 2026). Démo fictive, brief `brief.md`.

## Aiguillage (deux phrases, depuis `aiguillage.md`)
Photos : le client en veut sans en avoir : liste de prises (3 à 6) dans chaque contrat, qui les fait à voir.
Mouvement : vivant, `motion` rich, parce que le client a répondu « vivant ».

Liste de prises (pour la brasserie, à faire au téléphone avec le guide photo ou par nous sur place) :
1. Les cuves de la salle de brassage de 10 hl, vues de la porte, horizontal, lumière du jour : premier écran, à droite des secteurs.
2. Julien qui remplit un fût de 20 litres, vertical : section « Le moulin ».
3. Les quatre bouteilles de 75 cl alignées sur le comptoir de la boutique, horizontal : la gamme.
4. Une caisse de bouteilles vides rapportées, horizontal : « Le tour de la bouteille ».
5. La façade du moulin, chemin du Moulin, horizontal : la vente sur place.

## Socle (docs/GOUT.md § 0)
Pages : présent (une page par bière, /ou-trouver et une page par secteur) · Téléphone en haut : présent · Métier + ville : présent (« Brasserie artisanale à Oyonnax ») · Avis : absent : démo sans avis · Ancienneté : présent (depuis 2017) · Photos : absent : en attente (liste de prises) · Portes : présent (Appeler, Où trouver, Venir sur place, Vous tenez un commerce)

## Faits propres (8 à 12, tous tirés du brief)
1. L'ancien moulin du grand-père de Julien, 3 chemin du Moulin, à Oyonnax.
2. L'eau de la source du moulin, analysée chaque année.
3. Bouteilles de 75 cl consignées : 20 centimes rendus par bouteille.
4. Neuf revendeurs en deux secteurs : Haut-Bugey et Jura.
5. Trois revendeurs reprennent la consigne : Cave du Lac, Biocoop des Monts, Cave des Coteaux.
6. Trois bars servent à la pression : Bar Le Comptoir, Café de la Place, Le Bistrot du Pont.
7. Fûts de 20 litres pour les fêtes, réservés une semaine avant, tireuse prêtée.
8. Boutique ouverte jeudi et vendredi de 16 h à 19 h, samedi de 10 h à 13 h.
9. Julien était chaudronnier ; nouvelle salle de brassage de 10 hectolitres en 2023.
10. Quatre bières bio : la Blonde du Moulin, l'Ambrée de la Cluse, la Noire, la Saison.

## Phrase-idée
« Sur ce site, la consigne de 20 centimes devient le tour de la bouteille : elle part du moulin, passe chez le revendeur qui la reprend, arrive chez vous et revient. »

## Test du concurrent
La brasserie voisine vend aussi en bouteilles, mais la phrase tient sur trois revendeurs nommés qui reprennent la
consigne et sur le moulin : elle ne marche pas pour elle. Gardée.

## Contrat (six lignes)
- THÈSE : on répond d'abord à « où en trouver près de chez moi ? » ; on refuse l'arrangement par défaut d'une brasserie (grande photo de verre mousseux, histoire, gamme, contact en bas).
- SQUELETTE : architecture `revendeurs-secteurs` (coquille `revendeurs`) : secteurs dans l'en-tête, revendeurs par commune avec filtre « Chez qui ? », vente sur place et consigne, gamme, le moulin, le tour de la bouteille, questions ; pages /ou-trouver, une page par secteur, une page par bière. Aucun site de `ff variete` n'a ce squelette.
- PREMIER ÉCRAN — famille : outil ; h1 « Nos bières, près de chez vous », métier et ville dessous, les deux secteurs en boutons avec leur nombre d'adresses, le numéro en bouton sous les secteurs, « Venir sur place » à côté.
- MOUVEMENT :
  1. La bouteille de 75 cl glisse sur son rail du moulin au retour quand on descend : le trajet de la consigne, régime lent (rattrapage 0,6 s).
  2. Le rail du trajet se trace sous la bouteille : le chemin, régime sec.
  3. Les étapes du tour (moulin, revendeur, chez vous, retour) apparaissent l'une après l'autre : l'ordre, régime sec.
  4. Les revendeurs d'un secteur se rangent quand on change d'onglet ou de genre : le tri, régime sec.
  Transposé de `docs/veille/demontages/toutbienpils.md` (la bière racontée par un objet qui bouge, sans la blague) et de `docs/veille/demontages/becaneparis.md` (un trajet qui avance avec le défilement). Deux régimes : sec pour ce qui s'allume, lent pour la bouteille qui suit le défilement.
- REFUSÉ : vidéo de mousse, chopes, étiquettes fluo (le client les déteste), crème + serif + terracotta (déjà dépensé), photo de banque présentée comme la brasserie.
- FIN : non relu = pas fini ; ce site se termine par le verdict du relecteur.

Style : mélange <typo:hotelducouvent · couleurs:cafeomnia · densite:oliverbonas · formes:hawksmoor · photos:pistils · mouvement:tusk · matiere:standardhotels> · Architecture : revendeurs-secteurs · PREMIER ÉCRAN — famille : outil

## Typographie, couleur, images
Bleu nuit #1d2a33 et bleu ciel #b8e4fc (Café Omnia), le bleu des plaques émaillées et le métal des cuves ; EB Garamond pour les titres, Hanken Grotesk pour le texte (Hôtel du Couvent). Aucune photo tant que le client n'a pas fait les prises : pas de banque d'images. Calibration : ni crème + serif + terracotta, ni noir + accent acide (le bleu ciel est doux).

## Références
- `docs/veille/demontages/toutbienpils.md` : une marque de bière qui se raconte par un objet en mouvement ; on garde l'objet (la bouteille), pas l'humour ni l'écran d'âge.
- `docs/veille/demontages/becaneparis.md` : un trajet qui avance au défilement ; on garde l'avancée sur un rail.

## Accepté par le fondateur
