# Styles réels

Volet 2a quater de `/veille` (depuis le 18 oct 2026) : chaque bon site étudié devient un style complet de l'usine
(direction), appliqué tel quel aux clients au lieu d'un design inventé. Dix par tour.

Depuis le 18 oct 2026, chaque site étudié est AUSSI décomposé en atomes indépendants (`atomes/<id>.json`, format et
règles : `ATOMES.md`) que `ff melanger` croise : la typo d'un site, les couleurs d'un autre, les photos d'un troisième.
Une direction entière reste possible (`ff melanger <slug> --style <id>` applique tous les atomes d'un site). Registre
amorcé avec 11 sites (`node scripts/ff.mjs atomes` pour la liste et ce que chacun rend tirable).

| id | Source (URL) | Style en une phrase | Architecture | Convient à | Direction |
|---|---|---|---|---|---|
| forgooddesignlab | https://www.forgooddesignlab.com/ | Studio de marque : titre serif fin à emphase italique, colonne centrale de photos cadrées, noir sur blanc | atomes seuls | studios, métiers d'art | atomes |
| frenchtrotters | https://www.frenchtrotters.fr/ | Boutique de mode : slogan espacé sur aplat olive, grille de vignettes sans cadre, légendes dessous | atomes seuls | boutiques | atomes |
| jarcos | https://jarcos.work/ | Portfolio noir : mot-symbole géant au premier écran, listes de texte gris, très grandes marges | atomes seuls | studios | atomes |
| kinfolk | https://www.kinfolk.com/ | Magazine : serif éditorial, fond vert-gris pâle, photos plein cadre avec titre dessus | atomes seuls | artisans d'art, éditorial | atomes |
| nightjar | https://nightjar.co/ | Texte seul en deux tailles sur blanc, aucune image au premier écran | atomes seuls | studios | atomes |
| ottolenghi | https://www.ottolenghi.co.uk/ | Cuisine : grotesque géométrique, rouge franc en aplats avec pictos découpés, fonds crème | atomes seuls | restaurants, épiceries | atomes |
| poilane | https://poilane.com/ | Boulangerie : titres en capitales humanistes, boutons à contour fin, rayon 0, photos produit en vignettes | atomes seuls | boulangeries, épiceries | atomes |
| view-source | https://view-source.com/ | Studio : grotesque à caractère, gris clair, onglets de navigation colorés, bandeau noir | atomes seuls | studios | atomes |
| workshopcoffee | https://www.workshopcoffee.com/ | Torréfacteur : serif doux sur crème, vert profond et brique, cartes arrondies | atomes seuls | cafés, caves | atomes |
| kaltpresse | https://kaltpresse.de/ ([fiche](kaltpresse.md)) | Manufacture de jus : blanc et grège, noir seul, titres en capitales grotesques posés sur les photos, texte d'accueil très grand, boutons noirs pleins à angles droits | boutique Shopify : bandeau, nom centré, carrousel produit, texte, événements et ateliers en photos titrées | commerce de bouche avec une gamme photographiée (jus, épicerie, traiteur, torréfacteur) | atomes |
| podiatry | https://integratedpodiatry.com.au/ ([fiche](podiatry.md)) | Cabinet de soin : un seul gris froid #ebecec, serif maigre en très grand corps (120 px) sur photo plein cadre, liens soulignés, beaucoup de vide | longue page calme : photo plein écran, phrase, blocs texte et photos verticales décalées | métier de soin ou réglementé avec de bonnes photos (podologue, kiné, ostéopathe, institut) | atomes |
| carne | https://carnehamburguesas.com/en ([fiche](carne.md)) | Burgers : grotesque condensée grasse géante (105 à 165 px) qui glisse au défilement derrière un produit détouré, blanc, noir, vert salade en plages | page d'accueil en blocs : produit détouré, manifeste, portrait du chef, réseaux ; nav verticale filetée à droite | restauration, commerce de bouche joyeux avec un produit phare détourable | atomes |
| joandso | https://joandso.com/ ([fiche](joandso.md)) | Guide d'hôtels : néo-grotesque légère, grand titre blanc sur paysage plein cadre, boutons noirs à 8 px, cartes photo + aplat ocre ou terre qui prennent une ombre au survol | accueil catalogue : paysage, cartes par région, listes, citation sur noir, pied à colonnes | gîte, chambre d'hôtes, hôtel, loueur : plusieurs lieux ou offres en photos | atomes |
| nkora | https://nkora.co.uk/ ([fiche](nkora.md)) | Cafés : brun café, crème beurre, terracotta et olive en panneaux pleins accolés aux photos chaudes, géométrique maigre en capitales | photo plein cadre, panneaux couleur + photo en damier, adresses en liste, pictogrammes au trait | café, boulangerie, bar, épicerie avec plusieurs adresses et des photos chaudes | atomes |
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

Collecte du 18 oct 2026 (routine) : 9 atomes ajoutés. Démontés mais écartés : [aino](aino.md) (art ASCII, rien à
mesurer), [maisonkitsune](maisonkitsune.md) et [merci-merci](merci-merci.md) (fenêtre cookies/newsletter qui masque la
page), [roko-g](roko-g.md) et [tasiocalvo](tasiocalvo.md) (portfolios sans mise en page mesurable). Refusés par le
réseau ou les sites : cereal-mag, bakery-bread, chezmoimaison (tunnel), pierre-herme, hotel-les-bains, cafekitsune,
maisonmarie (502), clemencedevaux (404).

Collecte du 19 oct 2026 (routine, [minimal.gallery](https://minimal.gallery/), rubriques nourriture, intérieur, santé,
commerce) : 20 sites démontés, **5 gardés** (kaltpresse, podiatry, carne, joandso, nkora) après essai `ff melanger
demo-boulangerie --style <id> --essai` posé à côté de la source (`captures/<id>-comparaison.jpg`, non versionné).
Refusés à la comparaison : [florentine](florentine.md) (le mélange garde la grotesque mais perd la photo d'atelier sombre
qui fait tout le site : plat), [studioboum](studioboum.md) (titre en image, typo non mesurable : page noire sans
caractère), [tworobbers](tworobbers.md) (petits titres sur grandes photos : sans photo il ne reste rien ; police
d'origine de la liste IA). Écartés au démontage : [careofchan](careofchan.md) (agence, logo sur photo, rien d'appliquable),
[fieldstudies](fieldstudies.md) et [arnoldcircus](arnoldcircus.md) (pas de défilement), [owlfurniture](owlfurniture.md),
[focalglow](focalglow.md), [mandygraham](mandygraham.md), [her-melbourne](her-melbourne.md) et [goodmeat](goodmeat.md)
(écran de chargement ou images non chargées à la capture), [palmer](palmer.md), [limonoslo](limonoslo.md) et
[sgrappa](sgrappa.md) (fenêtre cookies qui masque la page), [takearecess](takearecess.md) (couleurs relevées sans
rapport avec la page vue). Refusés par le réseau : fortheloveofbread, morningbaker6am, moondeliverscakes, saporienatura,
mapfurniture (certificat expiré), oliverbrewingco.
| bellocq | https://www.bellocq.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| heathceramics | https://www.heathceramics.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| tartinebakery | https://www.tartinebakery.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| stjohnrestaurant | https://stjohnrestaurant.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| pierrehermeparis | https://www.pierreherme.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| thefatduck | https://thefatduck.co.uk | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| lamaisonduchocolat | https://www.lamaisonduchocolat.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| sweetgreen | https://www.sweetgreen.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| sunspel | https://www.sunspel.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| fortnumandmason | https://www.fortnumandmason.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| lesaintjames | https://www.saint-james.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| bonton | https://www.bonton.fr | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| hotelcostes | https://www.hotelcostes.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| frama | https://www.framacph.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| hay | https://www.hay.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| thehoxton | https://thehoxton.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| cubitts | https://www.cubitts.co.uk | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| formafantasma | https://www.formafantasma.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| normcph | https://www.normcph.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| fritzhansen | https://www.fritzhansen.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| stelton | https://www.stelton.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| nomos | https://nomos-glashuette.com | Atomes mesurés au DOM (champs « à juger » laissés tels quels), collecte du 20 oct 2026 | atomes seuls | à juger | atomes |
| dishoom | https://dishoom.com | Dishoom (restaurant indien (cafés irani de Bombay)) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| buly1803 | https://buly1803.com | buly1803 (parfumerie et cosmétique) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| monocle | https://monocle.com | monocle (magazine et boutique) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| mokonuts | https://mokonuts.com | mokonuts (restaurant et pâtisserie) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| opinel | https://opinel.com | opinel (couteaux (coutellerie)) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| hotelsaintmarc | https://hotelsaintmarc.com | hotelsaintmarc (hôtel) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| ruinart | https://ruinart.com | ruinart (maison de champagne) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| puiforcat | https://puiforcat.com | puiforcat (orfèvrerie) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| christofle | https://christofle.com | christofle (orfèvrerie et arts de la table) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| baccarat | https://baccarat.com | baccarat (cristallerie) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| lobmeyr | https://lobmeyr.com | lobmeyr (verrerie et luminaires) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| monbazillac | https://monbazillac.com | monbazillac (vin (appellation)) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| bonpoint | https://bonpoint.com | bonpoint (mode enfant) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| muuto | https://muuto.com | muuto (mobilier scandinave) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| skultuna | https://skultuna.com | skultuna (laiton et objets de maison) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| iittala | https://iittala.com | iittala (verre et arts de la table) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| kvadrat | https://kvadrat.dk | kvadrat (textiles d'ameublement) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| lebernardin | https://le-bernardin.com | lebernardin (restaurant (fine dining)) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| fauchon | https://fauchon.com | fauchon (épicerie fine et pâtisserie) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| flos | https://flos.com | flos (luminaires) ; atomes mesurés au DOM, collecte du 21 oct 2026 | atomes seuls | à juger | atomes |
| artek | https://www.artek.fi | Artek ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| astier | https://www.astierdevillatte.com | Astier-de-Villatte ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| bensimon | https://www.bensimon.com | Bensimon ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| bernardaud | https://www.bernardaud.com | Bernardaud ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| bolia | https://www.bolia.com | Bolia ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| caravane | https://www.caravane.fr | Caravane ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| debauve | https://www.debauve-et-gallais.com | Debauve-et-Gallais ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| ferm | https://fermliving.com | Ferm-Living ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| georgjensen | https://www.georgjensen.com | Georg-Jensen ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| hermanmiller | https://www.hermanmiller.com | Herman-Miller ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| hotelparticulier | https://www.lhotelparticulier.com | Hotel-Particulier ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| kusmi | https://www.kusmitea.com | Kusmi-Tea ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| labuvette | https://www.labuvette.fr | La-Buvette ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| ladoublej | https://www.ladoublej.com | La-DoubleJ ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| lemaire | https://www.lemaire.fr | Lemaire ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| lenotre | https://www.lenotre.com | Lenotre ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| lesnouvelles | https://www.merci-merci.com | Merci ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| loewe | https://www.loewe.com | Loewe ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| maisonsarah | https://www.maisonsarahlavoine.com | Sarah-Lavoine ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| nordicknots | https://www.nordicknots.com | Nordic-Knots ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| oliverbonas | https://www.oliverbonas.com | Oliver-Bonas ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| perimeter | https://www.perimeterbooks.com | Perimeter-Books ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| rouje | https://www.rouje.com | Rouje ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
| toast | https://www.toa.st | Toast ; atomes mesurés au DOM, collecte du 22 oct 2026 | atomes seuls | à juger | atomes |
