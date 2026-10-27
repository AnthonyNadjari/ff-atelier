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
| tekla | https://www.tekla.com | tekla ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| freitag | https://www.freitag.ch | freitag ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| manufactum | https://www.manufactum.com | manufactum ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| noma | https://www.noma.dk | noma ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| jeanpaulhevin | https://www.jeanpaulhevin.com | jeanpaulhevin ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| legrandvefour | https://www.legrandvefour.com | legrandvefour ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| malinandgoetz | https://www.malinandgoetz.com | malinandgoetz ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| fermob | https://www.fermob.com | fermob ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| carlhansen | https://www.carlhansen.com | carlhansen ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| cyrillignac | https://www.cyrillignac.com | cyrillignac ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| dedon | https://www.dedon.de | dedon ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| gubi | https://www.gubi.com | gubi ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| ligneroset | https://www.ligne-roset.com | ligneroset ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| louispoulsen | https://www.louispoulsen.com | louispoulsen ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| maisonlejaby | https://www.maisonlejaby.com | maisonlejaby ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| moooi | https://www.moooi.com | moooi ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| smeg | https://www.smeg.fr | smeg ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| vitsoe | https://www.vitsoe.com | vitsoe ; atomes mesurés au DOM, collecte du 22 oct 2026 (soir) | atomes seuls | à juger | atomes |
| maaemo | https://maaemo.no/ ([fiche](maaemo.md)) | Restaurant : noir pur, linéale maigre blanche, une photo qui sort du noir, presque rien d'autre ; collecte du 23 oct 2026 | accueil d'un écran, liens aux quatre coins, pages en texte sur noir | restaurant du soir, bar, cave, métier de nuit aux photos sombres | atomes |
| kadeau | https://www.kadeau.dk/ ([fiche](kadeau.md)) | Restaurant : anthracite et gris perle en négatif, serif fine, deux photos voilées qui se dévoilent au survol ; collecte du 23 oct 2026 | accueil en deux portes (une par adresse) | commerce à deux adresses ou deux activités, avec une bonne photo de chacune | atomes |
| alchemist | https://alchemist.dk/ ([fiche](alchemist.md)) | Restaurant-spectacle : noir bleuté, capitales géométriques maigres, décor au trait qui tourne au défilement ; collecte du 23 oct 2026 | accueil d'un écran puis pages Expérience, Cuisine, Billets | lieu d'expérience, événementiel, métier du soir ; texte court | atomes |
| her | https://her.melbourne/ ([fiche](her.md)) | Bar de nuit : noir, blanc cassé, grotesque moyenne en capitales sur la photo rouge du lieu ; collecte du 23 oct 2026 | accueil photo du lieu avec les noms des salles | bar, salle, lieu à plusieurs espaces avec une photo forte | atomes |
| ekstedt | https://www.ekstedt.nu/ ([fiche](ekstedt.md)) | Restaurant au feu : ivoire chaud, anthracite en en-tête et pied, vidéo de feu plein cadre (typo non reprise) ; collecte du 23 oct 2026 | barre sombre, vidéo plein écran, menu, événements, galerie | boulanger au four à bois, pizzaïolo, rôtisseur, avec une vraie vidéo | atomes |
| lacolombe | https://www.lacolombe.com/ ([fiche](lacolombe.md)) | Torréfacteur : crème, bleu nuit en texte et en bandeaux, rouge franc réservé à l'annonce, grotesque à caractère ; collecte du 23 oct 2026 | boutique : annonce, photo titrée, meilleures ventes, cafés | torréfacteur, épicerie, caviste avec une gamme et des adresses | atomes |
| mociun | https://mociun.com/ ([fiche](mociun.md)) | Bijoutière : gris chaud, panneaux ocre accolés aux photos, linéale fine en grand corps, brique en accent ; collecte du 23 oct 2026 | boutique de créatrice : œuvres, bijoux portés, archives, boutique | créatrice, bijoutier, céramiste, boutique d'objets | atomes |
| septime | https://www.septime-charonne.fr/ ([fiche](septime.md)) | Restaurant : tout en machine à écrire, noir sur blanc, photo noir et blanc, carte blanche du nom ; collecte du 23 oct 2026 | un écran puis une colonne : adresse, réservations, carte cadeau | restaurant, bistrot, cave, artisan au ton sec et précis | atomes |
| hungrytiger | https://www.eathungrytiger.com/ ([fiche](hungrytiger.md)) | Sauces : rouille et safran en aplats, capitales très grasses géantes, bocal détouré qui s'incline au défilement ; collecte du 23 oct 2026 | boutique d'un produit : titre géant, produit, recettes, avis, achat | producteur à un produit phare détourable (sauce, miel, bière, confiture) | atomes |
| almaheartwell | https://almaheartwell.framer.website/ ([fiche](almaheartwell.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre DM Sans, texte DM Sans ; fond #ffffff, texte #eee8db (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| ashervale | https://ashervale.framer.website/ ([fiche](ashervale.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Manrope, texte Manrope ; fond #f5f5f5, texte #050505 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| hrse | https://hrse.framer.website/ ([fiche](hrse.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre ZT Nature Regular ; fond #f4f4f5, texte #18181b (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| fabrica | https://fabrica.framer.media/ ([fiche](fabrica.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Inter, texte Inter ; fond #121212, texte #0a0a0a (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| kima | https://kima.framer.media/ ([fiche](kima.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Switzer, texte Switzer ; fond #ffffff, texte #757575 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| caspia | https://caspia.framer.media/ ([fiche](caspia.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre sans-serif, texte Switzer ; fond #000000, texte #ffffff (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| nuriatemplate | https://nuria-template.framer.website/ ([fiche](nuriatemplate.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Raleway, texte Inter ; fond #0b0b0b, texte #f0e9f0 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| leporello | https://leporello.framer.website/ ([fiche](leporello.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre LP Familjen Grotesk, texte LP Familjen Grotesk ; fond #e2e4e7, texte #a7abb2 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| karta | https://karta.framer.website/ ([fiche](karta.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Bebas Neue, texte Fjalla One ; fond #f0f0f0, texte #ffffff (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| flaue | https://flaue-template.framer.website/ ([fiche](flaue.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre FU Humane ; fond #ffffff, texte #1f3dff (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| picco | https://picco-template.framer.website/ ([fiche](picco.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Inter Display, texte Inter Display ; fond #f7f4ed, texte #42423a (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| bungee | https://bungee.framer.website/ ([fiche](bungee.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Inter Display, texte Inter Display ; fond #ffffff, texte #5a6271 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| bureaunine | https://bureaunine.framer.website/ ([fiche](bureaunine.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Switzer ; fond #ffffff, texte #0c0c0c (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| framewell | https://framewell.framer.website/ ([fiche](framewell.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Geist, texte Geist ; fond #ffffff, texte #090909 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| kaimarlow | https://kaimarlow.framer.website/ ([fiche](kaimarlow.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Gambarino, texte Switzer ; fond #fcfaf8, texte #0f0f0f (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| nubo | https://nubo.framer.website/ ([fiche](nubo.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Google Sans, texte Abel ; fond #ffffff, texte #545454 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| velorn | https://velorn.framer.website/ ([fiche](velorn.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Inter, texte Inter ; fond #000000, texte #fefefe (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| sorentemplate | https://soren-template.framer.website/ ([fiche](sorentemplate.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : typo à juger ; fond #ffffff, texte #707070 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| vertical | https://vertical.framer.media/ ([fiche](vertical.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Inter, texte Inter ; fond #050609, texte #d9d9d9 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| mondragon | https://mondragon4.framer.website/ ([fiche](mondragon.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Zalando Sans, texte Zalando Sans ; fond #f4f4f4, texte #000000 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| agnos | https://agnos-wbs.framer.website/ ([fiche](agnos.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Geist, texte Geist ; fond #f5f4f3, texte #060612 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| kudos | https://kudos.framer.media/ ([fiche](kudos.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Syne, texte Inter Display ; fond #ffffff, texte #666666 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| neiden | https://neiden.framer.media/ ([fiche](neiden.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Cal Sans, texte DM Sans ; fond #ffffff, texte #000000 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| rushes | https://rushes.framer.website/ ([fiche](rushes.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Space Grotesk, texte Inter ; fond #0a0a0a, texte #9a9a9e (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| qarin | https://qarin.framer.website/ ([fiche](qarin.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Geist, texte Inter ; fond #ffffff, texte #66677d (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| titarvl | https://titarvl.framer.website/ ([fiche](titarvl.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Martian Mono, texte Inter Display ; fond #ffffff, texte #000000 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| paulmichel | https://paul-michel.framer.website/ ([fiche](paulmichel.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Inter Display, texte Inter Display ; fond #ffffff, texte #ffffff (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| monodrift | https://monodrift.framer.website/ ([fiche](monodrift.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Tektur, texte Inter Display ; fond #ffffff, texte #f4f4f4 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| linearstudio | https://linearstudio.framer.website/ ([fiche](linearstudio.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Open Sauce One, texte Inter ; fond #fafafa, texte #636363 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| genstudio | https://genstudio.framer.media/ ([fiche](genstudio.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Instrument Serif, texte DM Sans ; fond #fffcfb, texte #121212 (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |
| demeure | https://demeure.framer.media/ ([fiche](demeure.md)) | Modèle Framer (collecte du 23 oct 2026, Framer Marketplace) : titre Instrument Serif, texte Sofia Sans Extra Condensed ; fond #f6f5f2, texte #ffffff (mesurés) ; ambiance, photos et premier écran à juger | à juger sur la fiche | à juger | atomes |

Collecte du 23 oct 2026 (routine, régimes en besoin : sombre et clair teinté doux) : 17 sites démontés, 10 jugés, **9 gardés**
(sombres : maaemo, kadeau, alchemist, her, hungrytiger ; teinté : ekstedt, couleurs seulement ; colorés doux : lacolombe, mociun ;
neutre : septime). Essais `ff melanger demo-boulangerie --style <id> --essai`, captures dans `.ff-tmp/veille/` (non versionné).
Refusé à la comparaison : sonderdays (sonderdays.com : blanc et grotesque neutres, sans ses photos il ne reste rien).
Écartés au démontage : aesop (vérification anti-robot), frantzen et audo (page vide sans navigateur réel), trudon, fornasetti
et dandelionchocolate (fenêtres cookies ou inscription qui couvrent la page), geranium (blanc neutre sans caractère).
- Collecte 2026-10-23 (deuxième) : 18 styles (Hodinkee, Il Volo, Alice Waters, Chez Panisse, Hotel Joe, Ace Hotel, The Witchery, Artemide, About Life, Arabia, Blackbird, Field Trip, Haymarket, Wildflour, Maison Balzac, Salt & Straw, Ethnicraft, Mokuba ; atomes mesurés, palette principale posée d'après le fond mesuré, photos/premier écran/profil de mouvement laissés « à juger » ; FF_CHROMIUM=1 ; environ 25 domaines refusés par le réseau ou les robots)
| kricket | https://www.kricket.co.uk/ ([fiche](kricket.md)) | Papier rosé, une seule encre rouille (nav, titres, cadre de la vidéo), slab presque machine à écrire, plats vus de dessus qui se posent l'un sur l'autre | longue page : vidéo encadrée, scène des plats, accueil entre trois photos, adresses, réservation sur aplat | restaurant, traiteur, pâtissier : de belles photos de plats vues de dessus | atomes |
| ikoyi | https://www.ikoyilondon.com/ ([fiche](ikoyi.md)) | Brun tabac et noir sous un motif de traits fins fixe, texte ivoire en serif, le nom seul au centre qui pâlit au défilement | longue page sombre : nom, à propos, menu, réservations, privatisation, boutique | restaurant du soir, cave, bar, artisan dont la devanture ou l'emballage a un motif | atomes |
| hiut | https://hiutdenim.co.uk/ ([fiche](hiut.md)) | Écru, noir et un seul rouge, grotesque en capitales, diptyques photo bord à bord (noir et blanc + couleur de matière) | boutique d'atelier : diptyque, produits en portraits, histoire, guides | atelier de fabrication avec photos de gestes et de matière (couturier, menuisier, tanneur) | atomes |
| labourandwait | https://www.labourandwait.co.uk/ ([fiche](labourandwait.md)) | Feuille gris papier à coins arrondis sur un cadre taupe, capitales humanes espacées, objets seuls au carré, prix sur points de conduite | boutique : rayons en colonne, devanture et équipe, nouveautés, adresses | quincaillerie, droguerie, épicerie, boutique d'objets avec photos produit | atomes |
| lyles | https://www.jksrestaurants.com/ (lyleslondon.com y redirige ; [fiche](lyles.md)) | Salles chaudes en photos bord à bord, panneaux blancs, rail bleu de nuit fixe à gauche, serif en capitales | groupe : restaurants en photos titrées, nouvelles en damier, cadeaux, privatisations | restaurant, hôtel, traiteur avec plusieurs lieux et de belles photos de salle | atomes |
| pumpstreet | https://www.pumpstreetchocolate.com/ ([fiche](pumpstreet.md)) | Blanc, anthracite et rose poudré de façade en panneaux, capitales Work Sans, produits à plat au carré | boutique : photo, produits en piste, collections, presse sur rose, « venez nous voir » | chocolatier, boulanger, pâtissier avec une gamme photographiée et une boutique à montrer | atomes |
| blenheim | https://www.blenheimforge.co.uk/ ([fiche](blenheim.md)) | Blanc cassé et pierre, serif fine taupe (Lora remplacée par Spectral), couteaux détourés en diagonale, photos d'atelier sombres | atelier : gestes au premier écran, collection, éditions, cours, affûtage | coutelier, forgeron, ébéniste, artisan d'objets détourables | atomes |
| wolseley | https://www.thewolseley.com/ ([fiche](wolseley.md)) | Ivoire grisé et encre presque noire, serif de titrage en capitales, photos de nuit très chaudes | groupe : vidéo, damier photo / texte centré par activité | hôtel, restaurant, salle de réception, caviste haut de gamme | atomes |
| padella | https://www.padella.co/ ([fiche](padella.md)) | Noir pur et blanc, capitales condensées, la carte du jour datée dans un cadre blanc épais | une page : vitrine, adresses en photos, carte du jour (voir `architectures/ardoise-du-jour.md`) | restaurant, pizzeria, traiteur dont la carte change chaque jour | atomes |
| ritual | https://www.ritualcoffee.com/ ([fiche](ritual.md)) | Crème beurre, brun café, rouge de sachet, capitales humanes grasses sur serif de livre, cartes crème posées sur les photos | boutique : photo + carte, cafés vedettes, abonnement sur terre cuite, portrait de la fondatrice, adresses | torréfacteur, café, boulangerie, épicerie : photos chaudes du lieu et des gens | atomes |
| wendelboe | https://www.timwendelboe.no/ ([fiche](wendelboe.md)) | Papier rosé, cartes sable, une encre vert forêt, serif robuste, photos de caféiers et de gens | boutique : café vedette, abonnements en cartes, portrait du torréfacteur, fermes | torréfacteur, producteur, maraîcher : photos du produit à la source | atomes |
| fuglen | https://www.fuglen.no/ ([fiche](fuglen.md)) | Crème grisée, noir et un rond vermillon, géométrique des années 1950, journal en mosaïque légendée | l'accueil est le journal ; deux entrées : cafés, bars | café, bar, commerce qui vit d'événements et d'ouvertures en photos | atomes |
| angelinaparis | https://www.angelina-paris.fr | Salon de thé parisien historique (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| atelierdumeuble | https://www.atelierdumeuble.fr | Atelier de meuble français (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| bakerybrera | https://www.bakerybrera.com | Boulangerie (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| bistrotpierre | https://www.bistrotpierre.co.uk | Bistrot britannique (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| bloomingville | https://www.bloomingville.com | Maison et déco danoise (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| fiorista | https://www.fiorista.it | Fleuriste italien (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| geranium | https://www.geranium.dk | Restaurant gastronomique danois (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| hemsley | https://www.hemsley.dk | Marque danoise (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| holmegaard | https://www.holmegaard.com | Verrerie danoise (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| holzmanufaktur | https://www.holzmanufaktur.de | Manufacture de bois allemande (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| huckleberryroasters | https://www.huckleberryroasters.com | Torréfacteur de café (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| kaffebrenneriet | https://www.kaffebrenneriet.no | Torréfacteur norvégien (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| karimoku | https://www.karimoku.com | Mobilier japonais (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| kinfolk | https://www.kinfolk.com | Magazine de vie lente (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| merchantandmills | https://www.merchantandmills.com | Cuisine et ustensiles (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| mirazur | https://www.mirazur.fr | Restaurant gastronomique (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| nanushka | https://www.nanushka.com | Mode (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| studionicholson | https://www.studionicholson.com | Mode (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| takt | https://www.takt.com | Mobilier danois (collecte du 24 oct, atomes mesurés, jugement « à juger ») | atomes seuls | à juger | atomes |
| bruichladdich | https://www.bruichladdich.com/ ([fiche](bruichladdich.md)) | Distillerie : anthracite et noir en bandes, serif tranchante en capitales pour tout, une touche cuivre, paysages en plein cadre | film plein cadre, gammes en colonnes, philosophie et portrait, pied noir ; une page par gamme | producteur ou artisan du soir avec un lieu à filmer : caviste, brasseur, distillateur, restaurant | atomes |
| kilchoman | https://www.kilchomandistillery.com/ ([fiche](kilchoman.md)) | Distillerie-ferme : bleu nuit en grandes plages, crème pour une carte dessinée, un fil or du premier écran jusqu'au lieu | vidéo sous voile, fil vers la carte et la présentation, produits, visites | domaine, ferme, gîte, producteur dont le lieu compte et qui a une carte | atomes |
| francescana | https://www.osteriafrancescana.it/ ([fiche](francescana.md)) | Restaurant : anthracite, texte grège, capitales espacées, un bouton framboise, photos en damier jointif | photo de salle, histoire centrée, damier de photos, réservation en bouton fixe | restaurant du soir, traiteur, cave avec de belles photos sombres | atomes |
| hisafranko | https://www.hisafranko.com/ ([fiche](hisafranko.md)) | Restaurant de vallée : blanc, noir, rose bonbon en boutons, machine à écrire maigre, photos de gens et de cueillette en quinconce | fondu de deux photos, citation, texte et photos décalées, menus, chambres, pied lie-de-vin | restaurant, maraîcher, ferme-auberge, chambre d'hôtes avec des photos de gens | atomes |
| barrafina | https://www.barrafina.co.uk/ ([fiche](barrafina.md)) | Bar à tapas : blanc, cartes crème, rouge sang-de-bœuf en titres soulignés d'un filet court, capitales Art déco fines | titre, plat vu de dessus avec deux portes collées, adresses en carrousel, portes « explorer » | restaurant, bar, traiteur, épicerie à plusieurs adresses | atomes |
| eastfork | https://www.eastfork.com/ ([fiche](eastfork.md)) | Poterie : blanc, cartes lin, gros boutons-tuiles olive et terre cuite, géométrique ronde, pièces en usage | boutique : cuisine plein cadre, nouveautés, tuiles, nuancier des émaux, histoire | potier, céramiste, ébéniste, tout fabricant d'objets avec une gamme photographiée | atomes |
| heckfield | https://www.heckfieldplace.com/ ([fiche](heckfield.md)) | Hôtel et ferme : grège, texte prune, rouge pour le nom et Réserver, photos de la maison et des bêtes en quinconce | film sombre, texte entre photos en quinconce, une entrée par univers | gîte, chambre d'hôtes, domaine, ferme avec beaucoup de photos du lieu | atomes |
| coffeecollective | https://www.coffeecollective.dk/ ([fiche](coffeecollective.md)) | Torréfacteur : crème chaud, cartes à peine plus foncées, bandes vert sapin, grotesque en graisse normale, sachets détourés | plantation plein cadre, grille de produits, abonnement sur bande verte, cafés | torréfacteur, épicerie fine, boulangerie avec une gamme et des adresses | atomes |
| androuet | https://www.androuet.com/ ([fiche](androuet.md)) | Fromager : crème, cartes blanches décalées, rouge brique pour la carte posée sur la photo, portraits d'équipe en arche | plateau plein cadre et carte rouge, offres en cartes décalées, équipe, boutiques | fromager, caviste, boucher, traiteur, commerce de bouche français avec une équipe | atomes |
| diaspora | https://www.diasporaco.com/ ([fiche](diaspora.md)) | Épices : crème jaune, magenta en boutons et panneaux, safran en bandeau, serif grasse à l'ancienne, producteurs en grand | bandeau, produits en carrousel, citation sur panneau magenta, recettes | épicerie, producteur, traiteur joyeux et coloré (jamais un métier réglementé) | atomes |
| lune | https://www.lunecroissanterie.com/ ([fiche](lune.md)) | Croissanterie : noir pur, grotesque industrielle grasse serrée, viennoiseries sur noir, une lettre géante du nom au trait par section | sections plein écran sur noir, menu vertical, boutiques en liste | boulanger, pâtissier, chocolatier, glacier, torréfacteur avec des produits photographiés sur fond uni | atomes |
| kol | https://kolrestaurant.com/ ([fiche](kol.md)) | Restaurant : kaki pâle, serif chaude, bouton bleu canard, plats et salle dans des cadres en quinconce | plat plein cadre, blocs centrés, horaires salle et cuisine détaillés au pied | restaurant, traiteur, cave, épicerie fine calme et chaude | atomes |
| bobbobricard | https://www.bobbobricard.com/ ([fiche](bobbobricard.md)) | Restaurant : rose poudré en bandes, petites capitales bronze, boutons à contour, salle sombre et dorée | une carte photo par adresse, contact des adresses en colonnes | restaurant, salon de thé, pâtissier, institut à une ou deux adresses | atomes |
| attica | https://www.attica.com.au/ ([fiche](attica.md)) | Restaurant : noir, serif éditoriale fine, assiettes en grand, le fond prend la teinte de chaque assiette | une assiette par écran, chef, pied olive très complet | restaurant, pâtissier, fleuriste, glacier aux produits très colorés | atomes |
| lesdeuxmagots | https://www.lesdeuxmagots.fr/ ([fiche](lesdeuxmagots.md)) | Café historique : crème rosé, vert bouteille, brique et or en panneaux qui mordent sur les photos, didone en capitales | diptyque, histoire en panneaux, actualité, articles | café, brasserie, salon de thé, commerce ancien avec une histoire | atomes |
| cafedeflore | https://www.cafedeflore.fr/ ([fiche](cafedeflore.md)) | Café historique : noir et grège, géométrique en capitales espacées, sable doré, archives en noir et blanc dans un cadre | frise datée, carte en onglets, mosaïque d'archives, plan | café, bar, maison ancienne avec des photos d'archives | atomes |
| terroirsavenir | https://www.terroirs-avenir.fr/ ([fiche](terroirsavenir.md)) | Réseau de producteurs : papier clair, géométrique douce, vert sauge, portraits en quinconce, citations signées | mission, producteurs, métiers, chefs, boutiques | épicerie, primeur, boucher, fromager qui montre ses producteurs | atomes |
| thepalomar | https://www.thepalomar.co.uk/ ([fiche](thepalomar.md)) | Restaurant : bleu nuit et crème en damier, photos de nuit saturées, grotesque large en capitales | damier photo / panneau, carte en liste filetée, pied du groupe | restaurant, bar, traiteur du soir avec de belles photos de nuit | atomes |
| landrace | https://www.landracebakery.com/ ([fiche](landrace.md)) | Boulangerie et moulin : crème rosé, chasse fixe partout, phrase du métier géante à gauche, horaires filetés à droite, aucune photo | une page en deux colonnes : présentation collante, horaires de chaque maison, adresse et carte, réservations, menus, lettre | boulangerie, moulin, restaurant à plusieurs activités et beaucoup d'horaires ; client avec peu de photos | atomes |
| paloroma | https://paloroma.com/ ([fiche](paloroma.md)) | Soins pour enfants : crème, filets et titres orange, bleu layette, serif à empattements en coin, page posée dans un cadre orange | boutique : produit et portrait, essentiels, portraits en quinconce, coffret, journal, lettre | savonnerie, cosmétique artisanale, boutique pour enfants, confiserie : produits détourés et portraits | atomes |
| brae | https://braerestaurant.com/ ([fiche](brae.md)) | Restaurant et ferme : blanc crème, serif de livre petite, olive au pied, photos décalées qui glissent chacune à sa vitesse | vidéo du domaine, chapitres manger / dormir / ferme / boutique, pied olive à colonnes | restaurant, ferme, gîte, domaine avec beaucoup de bonnes photos et une vidéo | atomes |
| sebastiancox | https://www.sebastiancox.co.uk/ ([fiche](sebastiancox.md)) | Ébéniste : pêche pâle, Garamond bordeaux géant, trois verbes-portes sur une forêt, grille de photos légendées | trois portes au premier écran, bandeau rouge, projets en grille, lettre | ébéniste, menuisier, tapissier, céramiste : beaucoup de photos de réalisations | atomes |
| nishiyama | https://nishiyamasilk.com/ ([fiche](nishiyama.md)) | Tissage de soie : blanc et écru, condensée fine, tissus découpés en galets qui flottent | une longue page : région, procédé, citation, clients, collection, contact | tisserand, couturière, céramiste, fleuriste : objets découpables, histoire d'atelier | atomes |
| eraceramics | http://eraceramics.com/ ([fiche](eraceramics.md)) | Céramistes : blanc d'argile, texte en Garamond énorme, géométrique demi-grasse, fond qui devient ocre en bas | histoire, portraits qui se chevauchent, clients, aperçu de la page Procédé | céramiste, potier, atelier à deux : une histoire et des portraits | atomes |
| marram | https://marrammontauk.com/ ([fiche](marram.md)) | Hôtel de plage : sable rosé, terre cuite en bandes, mots géants en capitales sur les photos, photos à trois vitesses | vidéo, chambres, expériences, offres, espaces, barre de réservation | gîte, chambres d'hôtes, hôtel, camping : lieu et photos fortes | atomes |
| loomrugs | https://www.loomrugs.com.au/ ([fiche](loomrugs.md)) | Tapis tissés : un seul grège du haut en bas, grotesque douce à une graisse, la couleur vient des laines | paysage, laines, engagement, nouveautés, sur-mesure, labels | tapissier, tisserand, décoratrice, matelassier : produits très colorés | atomes |
| handsomebrook | https://handsomebrookfarms.com/ ([fiche](handsomebrook.md)) | Œufs de plein air : coquille d'œuf, vert pré, grasse serrée en capitales, boutons à contour | manifeste sur photo, questions en deux colonnes, élevage, pied vert | producteur, ferme, maraîcher, boucher : un engagement à dire fort | atomes |
| here | https://behere.co/ ([fiche](here.md)) | Cabinet de psychologues : rose poudré partout, grotesque grasse, portrait détouré, sommaire fixe à droite | une page avec sommaire fixe : approche, consultations, à savoir, tarifs, équipe, réserver | psychologue, ostéopathe, kiné, sage-femme, institut : métier de soin calme | atomes |
| thyme | https://www.thyme.co.uk/ ([fiche](thyme.md)) | Hôtel de campagne : crème et sauge, serif à fort contraste espacée, fondus lents, plan dessiné à la plume | paysage, portes vers les activités, calendrier, journal, plan | gîte, domaine, table d'hôtes, école de cuisine : plusieurs activités et un agenda | atomes |
| shiptonmill | https://www.shipton-mill.com/ ([fiche](shiptonmill.md)) | Moulin bio : crème farine, tout le texte en vert sapin, une seule sans géométrique douce (Figtree), vidéo du moulin plein cadre puis phrase d'accueil centrée dessous, vignettes par quatre, pied vert plein ; page posée | — | boulanger, meunier, épicerie, producteur avec boutique et vraie vidéo du lieu | atomes |
| rosslyn | https://rosslyncoffee.com/ ([fiche](rosslyn.md)) | Café londonien : crème uni du haut en bas, sans humaniste fine (Hanken), sections très aérées, façade en plein cadre avant tout texte, carte crème qui chevauche une photo de salle ; apparitions douces | — | café, torréfacteur, boutique avec une belle devanture | atomes |
| poterieravel | https://www.poterie-ravel.com/ ([fiche](poterieravel.md)) | Manufacture de terre cuite (Aubagne, 1837) : ivoire, encre vert-noir, Bodoni en capitales posé au coin bas des blocs, filets fins, diaporama plein cadre, cartes produit 4:5 dont la photo laisse place à une seconde vue au survol | — | potier, céramiste, artisan à catalogue (jarres, meubles, objets), maison ancienne | atomes |
| morito | https://morito.co.uk/ ([fiche](morito.md)) | Bar à tapas : tout en machine à écrire (JetBrains Mono), titres en capitales orange brûlé, brun café, colonne centrée, photo de nuit plein cadre puis bandeau brun du nom ; horaires et téléphone tapés en clair | — | restaurant, bistrot, caviste, bar ; client au ton familier | atomes |
| thenewcraftmaker | https://thenewcraftmaker.com/ ([fiche](thenewcraftmaker.md)) | Galerie de mobilier fait main : une seule encre terre cuite pour tout le texte, humaniste en capitales espacées (Cabin), grilles de quatre photos verticales nommées en blanc, sections serrées | — | ébéniste, céramiste, galerie ou boutique d'objets avec beaucoup de photos en ambiance | atomes |

Collecte du 24 oct 2026 (routine, régimes en besoin : clair teinté et sombre) : 46 domaines essayés, 37 sites ouverts et regardés, 17
relevés (`ff atomes mesurer`, titre affiché relevé à part), **12 gardés** (ci-dessus). Refusés à la comparaison : belleville
(cafesbelleville.com : blanc et marine sans ses paquets rouges, titre en image), paxton (paxtonandwhitfield.co.uk : crème presque
blanche, titres en serif italique), honeyandco (honeyandco.co.uk : blanc et serif sans caractère sans ses photos). Écartés au
regard : brodo (fenêtres promotionnelles), studioilse (feuille de style non chargée), kramerknives et koselig (gabarits datés),
fabrique (titres en manuscrite italique), prestat et tiptree (boutiques à promotions), mugaritz et thecloveclub (aplats cyan ou
cobalt vifs, hors garde B1), la fromagerie, bettys, flourbakery (pilules, aplats vifs), levain, tannergoods, nealsyard, quovadis,
violetcakes (page vide sans navigateur réel), perceval, whitehousecox, oaxen (domaine repris ou hors service) ; une vingtaine
d'autres refusés par le réseau. Le même jour, les 18 atomes de la collecte du 23 oct (Hodinkee … Mokuba) qui cassaient
`tests/atomes.test.mjs` sont repassés en « à juger » là où une valeur n'était pas jugée (palette, traitement des photos,
mesure hors bornes) : ils restent valides, leurs atomes jugés restent tirables.

Collecte du 25 oct 2026 (routine, régimes en besoin : sombre et clair teinté) : 67 domaines essayés (hors déjà étudiés), 45 relevés
(`ff atomes mesurer` + captures pleine page regardées), **10 gardés** (ci-dessus), chacun essayé sur une copie de
`demo-boulangerie` (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source. Écartés au regard :
alinea (Cormorant, police IA, sur blanc), onyx (blanc cassé, photos floues au chargement), schorem, rochelle, kiln, thepig
(relevé vide ou une seule page d'accueil), toutain (gris sans titre), atomix (un seul écran de menu sur photo), canroca,
carreducker, murdock, ruffians, hawksmoor, mud, mast, askinosie, smythson, squaremile, e5bakehouse, mamiche, jenis,
brightland, burlap, postcard (blancs neutres sans caractère propre, pilules ou boutiques à promotions), palaisdesthes
(boutique chargée), hide, lesamis, toklas (neutres pâles), monkey47, thebotanist, sipsmith (relevés mais pas jugés, faute de
temps) ; dropcoffee et sushisaito (domaine à vendre), frenchie (429), mezcalvago (contrôle d'âge : relevé faux). Une
dizaine d'autres injoignables depuis le réseau.

Collecte 2026-10-25 (23 styles, mesures seulement ; photos, mouvement, premier écran « à juger ») : gervasoni1882, bonnieandclyde, ateliermonet, serax, zangra, officinegenerale, sabon, bellroy, fleux, maisonbremond1830, veja-store, pierremarcolini, bonne-maman, caudalie, nicolas, thekooples, apc, laperla, duvel, staub-online, degrenne, emilehenryusa, pillivuyt.

Collecte du 26 oct 2026 (routine, régimes en besoin : sombre et clair teinté) : une soixantaine de domaines essayés, 10 relevés
(`ff atomes mesurer` + planche de défilement ordinateur et téléphone regardée), **8 gardés** (ci-dessus), chacun essayé sur une
copie de `demo-boulangerie` (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source. Refusé à la
comparaison : [bancone](bancone.md) (essai plat sans ses photos, h2 plus petit que le texte, boutons qui lisent comme des
pilules). Relevés puis écartés au regard : sessionsartsclub (page presque vide : dessins et pied), verve (fenêtre promotionnelle
plein écran sur tout le défilement). Écartés à la reconnaissance : daroco (un seul écran vidéo), gailsbread (liste des
boutiques), hedonism (fenêtre promotionnelle), mastbrothers, cafececilia, heartroasters, origincoffee, kbcoffeeroasters,
seycoffee, prologcoffee, aprilcoffeeroasters, noblerot, trudon, fornasetti, dandelionchocolate, rococochocolates, patrickroger,
maisonverot, quatrehomme, chambelland, kodawari-ramen, sabor, mikkeller, baolondon (blancs neutres sans caractère propre ou
boutiques chargées), lecomptoirgeneral et krug (fenêtre bloquante, contrôle d'âge), gymkhanalondon (429 au relevé, à reprendre :
vert bouteille, crème, bordeaux), lacabra (crème sous 0,012) ; une vingtaine d'autres injoignables depuis le réseau (502,
tunnel refusé). Les 23 atomes de la collecte du 25 oct qui cassaient `tests/atomes.test.mjs` (photos.traitement « à juger »
sous un atome photos posé, mesures hors bornes) sont repassés en « à juger » ; les fiches frama et pierrehermeparis, effacées
par erreur le 25 oct, sont restaurées.

Collecte du 26 oct 2026, soir (routine, régime en besoin : clair teinté doux) : près de 90 domaines sondés (fond dominant et chroma OKLCH relevés par une sonde, galerie httpster.net lue par sa liste JSON ; Awwwards injoignable, siteinspire 429), 12 relevés (`ff demonter` + `ff atomes mesurer`, planches regardées, mouvement relevé à la molette), **11 gardés** (ci-dessus), chacun essayé sur une copie de `demo-boulangerie` (`ff melanger demo-boulangerie --style <id> --essai`) et posé à côté de la source. Écarté au regard : [laylabakery](laylabakery.md) (un seul écran, fenêtre d'inscription posée dessus). Écartés à la sonde : grapejuicewineshop (cartes arrondies à ombre, bouton pilule violet), levehytter (crème sous 0,012, grande bannière de cookies), gailsbread (déjà écarté), onyxcoffeelab, verrevertglass, howmanyplants, anothercountry, sommerrohouse (crèmes sous 0,012), radiobakery (pilules en capitales), flourandwater (premier écran noir vide), bubandgrandmas, sqirlla (fonds vifs), rhubarbandrose (429), une trentaine de blancs neutres (leachpottery, studioarhoj, thenewt, colonna, bonanza, typology, lafromagerie…) ; une quinzaine injoignables (tunnel refusé, 502). Régimes : sur 11 gardés, 9 ont un fond teinté de chroma ≥ 0,012, mais seuls 4 restent « clair teinté doux » (landrace, paloroma, loomrugs, here) : les autres ont un pied, un bandeau ou une surface colorés qui les classent « coloré doux » (brae, sebastiancox, eraceramics, marram, handsomebrook, thyme) ; nishiyama est un clair neutre.

Collecte du 26 oct 2026 (Godly, One Page Love ; Awwwards et land-book injoignables depuis le réseau) : atomes de typo, densité, formes, matière relevés ; couleurs, photos, mouvement, premier écran « à juger ».
| delparco | https://www.delparcohotel.eu ([fiche](delparco.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| ossa | https://ossa.wine ([fiche](ossa.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| davesocozy | https://davesocozy.com ([fiche](davesocozy.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| vienslaa | https://viens-la.com ([fiche](vienslaa.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| visualjournal | https://visualjournal.it ([fiche](visualjournal.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| patrickmason | https://patrickmason.studio ([fiche](patrickmason.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| jackywinter | https://www.jackywinter.gallery ([fiche](jackywinter.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| snohetta | https://www.snohetta.com ([fiche](snohetta.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| middlename | https://middlename.co.uk ([fiche](middlename.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| bauhausclock | https://bauhausclock.com ([fiche](bauhausclock.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| eaglesnest | https://eaglesnest.webflow.io ([fiche](eaglesnest.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| kizupi | https://kizupi.com ([fiche](kizupi.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| benvenusa | https://benvenusa.com ([fiche](benvenusa.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| elihorn | https://elihorn.ca ([fiche](elihorn.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| grafiknz | https://grafik.nz ([fiche](grafiknz.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| fayemi | https://fayemi.design ([fiche](fayemi.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| wamstudio | https://wam.studio ([fiche](wamstudio.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| vivienscreative | https://vivienscreative.com.au ([fiche](vivienscreative.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| atomicdust | https://atomicdust.com ([fiche](atomicdust.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| melius | https://www.melius.com ([fiche](melius.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| davidfiz | https://www.davidfiz.com ([fiche](davidfiz.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| flowlife | https://www.flowlife.com ([fiche](flowlife.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| belgradearbor | https://belgradearbor.rs/en ([fiche](belgradearbor.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| brandonyasin | https://brandonyasin.com ([fiche](brandonyasin.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| butter | https://www.butter.video ([fiche](butter.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| coloniazacamil | https://coloniazacamil.com ([fiche](coloniazacamil.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| cominvi | https://www.cominvi.com.mx ([fiche](cominvi.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| jesperlandberg | http://jesperlandberg.com ([fiche](jesperlandberg.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| lpas | https://lpas.com ([fiche](lpas.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| mariavasilyeva | https://www.mariavasilyeva.com ([fiche](mariavasilyeva.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| milledollars | https://milledollars.fr ([fiche](milledollars.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| neutomni | https://neutomni.com ([fiche](neutomni.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| nickho | https://nickho-motorsports.nl ([fiche](nickho.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| overworldaudio | https://overworldaudio.com ([fiche](overworldaudio.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| realevate | https://realevate.agency ([fiche](realevate.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| santionispirits | https://santionispirits.com ([fiche](santionispirits.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| signala | https://signal-a.studio ([fiche](signala.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
| tengilemalamala | https://tengilemalamala.com ([fiche](tengilemalamala.md)) | Relevé automatique du 26 oct, jugements à faire sur les captures | atomes partiels |
