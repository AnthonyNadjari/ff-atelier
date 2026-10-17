# Agrumea Farm — architecture « catalogue d'abord : la gamme est l'accueil »

- Source : https://www.agrumeafarm.it/en (accueil) et https://www.agrumeafarm.it/en/dispensa/caponata (fiche produit), démontés le 17 oct 2026.
- Métier : conserverie familiale (confitures, pestos, caponata), Sicile. Une douzaine de produits.
- Mesures : `agrumea-demontage.md` + `agrumea.json` (`ff demonter`), `agrumea-style.json` (rayons, ombres, boutons, images, marges, pages, mesurés dans Chrome), captures `captures/agrumea-*`. Fiche de goût antérieure : `docs/veille/demontages/agrumeafarm.md`.

## Le modèle en une phrase

L'accueil tient en un écran et n'est rien d'autre que la gamme : une roue de produits détourés qu'on fait tourner, chaque produit ouvre sa propre page ; le reste du site (production, expérience, qui sommes-nous, contact) vit derrière un bouton « Menu » plein écran.

## Schéma de l'accueil (un écran, ordinateur et téléphone)

```
[barre fixe 97 px : IT/EN à gauche | logo centré | bouton « Menu » à droite]
[ROUE : 10 produits détourés en arc, un grand au centre, posés sur un polygone bordeaux
        où tourne un texte en cercle ; la molette fait tourner la roue, pas la page]
[bas : « Privacy & Cookies » à gauche | « Scroll to discover » au centre]
(h1 présent pour les moteurs, caché à l'écran)
```

Mesuré : 1 écran de haut à l'ordinateur ET au téléphone ; 19 liens internes dont 11 fiches produits ; aucun téléphone, aucun avis, aucune adresse sur l'accueil.

## Schéma d'une page intérieure (fiche produit, 5,7 écrans ordinateur, 5,2 téléphone)

```
[titre produit géant en capitales orange, le pot détouré posé PAR-DESSUS les lettres, au centre]
[deux mots en marge : « Savoury » à gauche | « Made in Sicily – Italy » à droite]
[◆ phrase d'ambiance centrée + liste d'ingrédients centrée (allergènes en gras) ◆]
[fiche technique en 3 colonnes à filets : conseils | poids disponibles (pastilles 190 g, 1 kg, 3 kg) | conservation 36 mois]
[bande de photos en défilement horizontal (piste 3 184 px pour 1 440 ; au téléphone aimantée, scroll-snap x mandatory)]
[« The other products » en très grandes capitales, puis rangée de pots sur cartes crème]
[pied bordeaux : nom en lettres géantes, plan du site, deux adresses (siège, exploitation), réseaux]
```

## Navigation, contact, preuves, téléphone

- Pages : accueil-roue ; `/dispensa` (la gamme) ; une page par produit ; production ; expérience ; qui sommes-nous ; contacts. Navigation par menu plein écran (couche fixe 100 % de l'écran), le même à l'ordinateur et au téléphone.
- Contact : seulement dans le pied des pages intérieures (deux adresses, e-mail) et la page contacts ; aucun numéro cliquable mesuré.
- Preuves : aucune note ni avis ; la preuve est le produit lui-même (ingrédients, poids, conservation).
- Téléphone : même accueil d'un écran ; la bande de photos devient une piste aimantée qu'on glisse au doigt.

## Rythme, texte et images, profondeur

Très peu de texte (18 à 21 mots visibles au premier écran), tout est produit. Profondeur forte : pot détouré devant les lettres du titre, roue devant un polygone, texte circulaire derrière. Rythme : un écran-vitrine, puis des fiches aérées (marges de 100 à 335 px entre blocs à l'ordinateur, 48 à 96 px au téléphone).

## Style (à réappliquer tel quel)

- **Polices** (Adobe Fonts, licence à prendre ou équivalent à trouver) : titres et boutons *ivystyle-sans* (sans à empattements discrets) ; textes de service *ivymode* en capitales espacées 13 px. h1 mesuré 32 px ordinateur et téléphone, interlignage 1,3 ; nav 14 px graisse 600 capitales ; liens 16 px. Titre produit géant en capitales : taille à juger (environ deux lignes sur 60 % de la largeur).
- **Couleurs** (rôles) : fond crème `#fdf3eb` (47 % des surfaces) ; bordeaux `#762530` = texte (81 % des caractères) ET grands aplats (polygone, pied) ; orange `#e94e1b` = accent (boutons, titre produit, filets) ; blanc `#ffffff` pour les cartes. Contraste texte/fond 9,2:1.
- **Espacements** : blocs séparés de 100 à 335 px (ordinateur), 48 à 96 px (téléphone) ; texte courant 380 px de large (~53 caractères).
- **Rayons et bordures** : photos et cartes à angle droit (0 px) ; filets de 1 px bordeaux ou orange entre les colonnes de la fiche ; pastilles de poids rondes ; coins 14 à 16 px sur deux panneaux seulement.
- **Ombres** : une seule, teintée bordeaux (`0 18px 50px` à 16 % d'opacité), sous un panneau.
- **Photos** : produits détourés, inclinés, sans cadre (le détourage EST le style) ; photos d'ambiance en portrait 4:5 dans une piste horizontale ; aucun filtre.
- **Boutons et liens** : bouton plein orange texte crème, 42 px de haut ; bouton rond cerclé bordeaux (« Menu ») ; survol : le bouton rond grossit (`scale`), le losange tourne de 45°, la langue passe en orange.
- **Icônes** : quasi aucune (1 svg) ; le losange ◆ sert de séparateur.
- **Animations** : courbe maison `cubic-bezier(0.645, 0.045, 0.355, 1)` en 0,78 à 0,9 s pour les grands mouvements, 0,35 s `cubic-bezier(0.4, 0, 0.2, 1)` pour les petits ; défilement lissé (Lenis) ; chargeur animé de fruits à l'arrivée ; étiquette qui suit le curseur au survol d'un pot.
- **Textures** : aucune ; la matière vient des étiquettes peintes des produits.

## Ce qui le rend différent de notre déroulé

Pas de héros, pas d'avis, pas de services, pas d'à-propos sur l'accueil : l'accueil EST le catalogue, et la profondeur du site est dans les fiches produits. Notre déroulé (héros, avis, services, à propos, questions, contact) n'a aucune page produit et met le catalogue au troisième bloc.

## Ce qu'il faudrait à l'usine

- **Nouvelle coquille** `src/shells/vitrine.astro` (accueil d'un écran = la gamme ; menu plein écran pour le reste). La coquille `index` (accueil-menu en liste) est le plus proche parent, mais elle liste des entrées textuelles, pas des objets.
- **Nouveau type de contenu** : des produits (`products[]` : nom, photo détourée, catégorie, poids/formats, ingrédients ou composition, conservation, prix optionnel) et une page `/produits/<slug>` ; aujourd'hui `services[]` n'a ni formats ni composition.
- **Section** : piste de photos aimantée (existe en partie : `data-horizontal`, mais lié au défilement vertical ; ici c'est une piste manuelle `scroll-snap`).
- **Roue** : jamais en détournant la molette (refusé dans la fiche de goût) ; à l'usine, une piste horizontale manuelle, chaque produit qui pivote selon sa position.
- Le socle (GOUT § 0) impose quand même le téléphone et le métier + ville en haut : à ajouter dans la barre fixe.

Coût : **fort** (type de contenu + pages + coquille + photos détourées à produire).

## Convient à (selon les données du client)

Producteur ou artisan à **gamme courte et photogénique** (6 à 20 produits) avec de **bonnes photos détourables** : confiturier, savonnier, brasseur, chocolatier, coutelier, céramiste, torréfacteur. Inutile sans photos de produits, et inadapté aux métiers de service (plombier, couvreur) ou d'urgence.

## Signes IA à NE PAS reprendre (GOUT § 2)

- Boutons et étiquettes en **pilule** (rayon 999 px mesuré sur 3 boutons et une étiquette) : prendre des boutons droits.
- Textes de service en **capitales espacées** (ivymode 13 px, +1,3 px) : éviter les eyebrows.
- **Couche bloquante** à l'arrivée (bannière cookies couvrant 100 % de l'écran) et chargeur animé avant de voir le site.
- La **molette détournée** pour tourner la roue.
- Le texte qui tourne en cercle relève du badge décoratif : à juger, ne pas le reprendre par défaut.
