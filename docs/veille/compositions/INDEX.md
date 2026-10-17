# Compositions recréées

Volet 2a bis de `/veille` (depuis le 17 oct 2026) : des sections de ce qui se fait de mieux (modèles les plus vendus,
sites que le fondateur aime), recréées comme variantes partagées de la bibliothèque. On reprend une construction
(proportions, superpositions, rythme), jamais les textes, images, code ou identité de la source.

| Date | Source (URL) | Section | Variante créée | Gardé | Perdu | Comparaison |
|---|---|---|---|---|---|---|
| 17 oct 2026 | [HandGrid](handgrid.md), Framer Marketplace « Home Services » n° 3 par popularité (gratuit) : https://handgrid.framer.ai/ | Services : grille de cartes photo, panneau clair posé en bas de la photo | `services/photo-cards` | La photo qui remplit la carte, le panneau inséré à 12 px des bords avec ombre (deux plans), 3 colonnes ordinateur, une par ligne téléphone ; prix « à partir de » dans le panneau | Le bouton « Load More » (inutile à 3-6 services) ; carte un peu plus haute sur téléphone (5:6 au lieu de ~6:5) pour que la photo reste visible au-dessus du panneau | [comparaison](handgrid-services-comparaison.jpg) |
| 17 oct 2026 | [HandGrid](handgrid.md), même modèle | À propos : panneau sombre arrondi, texte à gauche, grappe de photos à droite | `about/overlap` | Panneau encre posé dans la page, texte + valeurs à gauche, photos qui se chevauchent ; on va plus loin que la source : le portrait dépasse le haut du panneau (ordinateur) et la seconde photo déborde dessous (trois plans) | L'inclinaison des photos (polaroid refusé, GOUT § 2), les coches rouges (coches façon tarif refusées), le bouton du panneau | [comparaison](handgrid-about-comparaison.jpg) |
| 17 oct 2026 | [PlumFix](plumfix.md), Framer Marketplace « Home Services » n° 1 par popularité (gratuit) : https://plumfix.framer.website/ | Appel final : photo pleine largeur sous voile sombre, titre et deux boutons centrés | `cta/photo` | Photo du client en grand entre deux sections (dernière réalisation, sinon photo de service), voile, appel centré, téléphone + devis, légère parallaxe | Le personnage détouré à droite (il faudrait une photo détourée du client : à proposer quand un brief en a une), le mot du titre en couleur (accent sur un seul mot refusé, GOUT § 8) | [comparaison](plumfix-cta-comparaison.jpg) |

Sources du 17 oct 2026 : catégorie [Home Services](https://www.framer.com/marketplace/templates/categories/home-services/) de
Framer Marketplace, triée par popularité (PlumFix n° 1, Solshine n° 2, HandGrid n° 3) ; fiches de démontage `plumfix.md`,
`solshine.md`, `handgrid.md` (`ff demonter`). Solshine (énergie solaire, 129 $) étudié sans section retenue : ses blocs
profonds (cartes de service sur photo, « 15 » géant à côté d'une photo à pastille tournante) recoupent `services/cards-hover`
ou relèvent des signes IA (pastille, chiffres décoratifs). Comparaisons faites sur un site jetable (copie de `jardins-mael`,
photos Wikimedia de ce site), captures ordinateur 1440 et téléphone 390 posées à côté de la source, regardées.
`ff composer` préfère désormais ces trois variantes quand leurs photos sont là (`COMPOSITIONS_EPROUVEES`, `scripts/ff/composer.mjs`).
