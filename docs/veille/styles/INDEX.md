# Styles réels

Volet 2a quater de `/veille` (depuis le 18 oct 2026) : chaque bon site étudié devient un style complet de l'usine
(direction), appliqué tel quel aux clients au lieu d'un design inventé. Dix par tour.

Depuis le 18 oct 2026, chaque site étudié est AUSSI décomposé en atomes indépendants (`atomes/<id>.json`, format et
règles : `ATOMES.md`) que `ff melanger` croise : la typo d'un site, les couleurs d'un autre, les photos d'un troisième.
Une direction entière reste possible (`ff melanger <slug> --style <id>` applique tous les atomes d'un site). Registre
amorcé avec 11 sites (`node scripts/ff.mjs atomes` pour la liste et ce que chacun rend tirable).

| id | Source (URL) | Style en une phrase | Architecture | Convient à | Direction |
|---|---|---|---|---|---|
| cobalt | [unionboulangerie.com](https://unionboulangerie.com/en/) ([fiche](union-boulangerie.md)) | Ivoire, aplats bleu cobalt pleine largeur, orange en signal, capitales grotesques serrées, texte en machine à écrire. | Une page longue : vidéo plein écran, histoire sur bleu, mosaïque de photos du fournil, adresses et horaires de chaque boutique, contact, pied bleu. | Commerce de bouche avec photos du lieu et des gens : boulangerie, pâtisserie, torréfacteur, épicerie fine. | `cobalt` |
| sapin | [eatcabalar.com](https://www.eatcabalar.com/) ([fiche](cabalar.md)) | Blanc pur et un seul vert sapin, capitales condensées très grasses, grand texte courant, photos aux coins arrondis. | Accueil aiguillage : vidéo, présentation avec horaires, trois portes vers les pages (voir `architectures/carrefour-portes.md`). | Boucher, charcutier, restaurant, food truck : un lieu à montrer, des horaires, une commande. | `sapin` |
| affiche | [mathesonfoodcompany.com](https://www.mathesonfoodcompany.com/) ([fiche](matheson.md)) | Rayonnage d'épicerie : filets noirs, rouge étiquette, jaune moutarde, capitales condensées partout, zéro arrondi. | Nom géant, grille de produits par gamme, recettes, carte des points de vente. | Producteur avec une gamme de produits photographiés : épicerie, conserverie, brasserie, caviste. | `affiche` |
| prune | [houseofhoney.com](https://www.houseofhoney.com/) ([fiche](house-of-honey.md)) | Rose poudré et prune en bandes alternées, serif contrasté en capitales, rose vif rare, photos au carré. | Réalisations d'abord : chaque chantier a sa page (voir `architectures/projets-fiches.md`). | Décoratrice, architecte d'intérieur, tapissier, institut : beaucoup de photos de réalisations. | `prune` |
| huile | [anecdotarural.com](https://www.anecdotarural.com/) ([fiche](anecdota-rural.md)) | Crème, une seule encre rouge tomate (assombrie pour la lecture), serif de livre en grand corps, pied rose. | Nom géant, histoire de la famille en long texte, produits en photos détourées, événements datés. | Domaine, producteur, ferme, chambre d'hôtes : une histoire à raconter et des produits. | `huile` |
| releve | [roxoseco.com](https://www.roxoseco.com/) ([fiche](roxoseco.md)) | Blanc, noir, gris béton, croix de repère aux angles, titres petits et nets, texte en machine à écrire. | Paysage plein écran, blocs texte et photo décalés sur une grille marquée, contact en formulaire bas de page. | Gîte, rénovation, architecte, charpentier : a besoin de grandes photos de lieu. | `releve` |
| arche | [anuchome.com](https://www.anuchome.com/) ([fiche](anuc-home.md)) | Blanc et pierre, grille de quatre colonnes tracée au filet, serif condensé fin (Instrument Serif remplacée par Libre Caslon Condensed), terre cuite en touche. | Grille de quatre colonnes du haut en bas, services en colonnes, projets, articles. | Studio d'intérieur, cuisiniste, cabinet de soin calme. | `arche` |
| labo | [folkkombucha.dk](https://www.folkkombucha.dk/) ([fiche](folk-kombucha.md)) | Blanc et bleu roi, page en cases filetées, capitales légères, boutons en machine. | Vidéo, manifeste, gamme en carrousel, revendeurs, presse, pied bleu à colonnes. | Producteur ou commerce net et frais : brasserie, glacier, fromager, opticien. | `labo` |
| citron | [pimpinella.cooking](https://www.pimpinella.cooking/) ([fiche](pimpinella.md)) | Jaune citron pâle en damier avec les photos, serif fin centré, étiquettes en machine, rose pour l'inscription. | Une page : nom géant, damier texte/photo, questions en liste filetée, inscription. | Atelier, table d'hôtes, guide, glacier : des photos d'activité en plein air. | `citron` |

Étudiés et non retenus (17 oct 2026) : [durup](durup.md) (style tout en photo, capture floue : rien à comparer),
[hyll](hyll.md) (bannières bloquantes), [uneven-objects](uneven-objects.md) et [grace-walker](grace-walker.md) (pas de
défilement). Démontés mais pas encore jugés, en réserve pour le prochain tour : [celtic-sea-salt](celtic-sea-salt.md),
[oma-appel](oma-appel.md), [onoera](onoera.md).
