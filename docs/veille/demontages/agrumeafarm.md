# Agrumea Farm — https://www.agrumeafarm.it/en
Exploitation et conserverie familiale sicilienne : confitures, crèmes, pestos, caponata (étiquettes lues sur les pots), site en anglais et italien. Awwwards Nominee du 1er octobre 2026 (awwwards.com/sites/agrumea-farm). Nuxt (`/_nuxt/`, `data-v-*`), Lenis, polices Adobe Fonts (kit `yey3ruw`).

## Squelette
Nav : IT / EN en pastilles à gauche, logo (paysan portant un panier, « Agrumea Farm ») centré, « Menu » à droite ; « Privacy & Cookies » en bas à gauche, « Scroll to discover » centré en bas. **L'accueil tient en un écran** (`docH` = 900, section `jar-slider` à `height: var(--app-height)`) : une **roue de pots** posée en arc, chaque pot détouré et incliné, devant un grand polygone bordeaux sur lequel tourne le texte « We preserve · We grow · … » en cercle. La molette ne fait pas défiler la page, **elle fait tourner la roue** : quatre crans = quatre pots différents au centre (planche : Arance, Smeralda, Pere e cannella, Fragole). Au survol d'un pot, une étiquette « Discover the product » suit le curseur. Le H1 (« Sicilian artisan marmalades, spreads and preserves ») est caché (`top: -1`). Aucun contact au premier écran.
En 3 secondes : des pots aux étiquettes peintes, un logo de paysan, une invitation à tourner.

## Typographie
Lues dans le CSS : **ivymode** 400 (serif de display, « We preserve » en cercle) et **ivystyle-sans** 400 / 600 (corps 16 px, H1 32 px). Libellés en capitales (« Menu », « Scroll to discover »). Les étiquettes des pots (dessinées) portent la vraie personnalité typographique.

## Couleur et matière
Fond crème `#FDF3EB` (`rgb(253,243,235)`), texte et polygone bordeaux `#762530` (`rgb(118,37,48)`), orange `#E94E1B` (texte du cercle, pastille EN, bouton menu), orange clair `#F39200`, beige `#F4E9DD`. Photos de pots détourées (72 fichiers `.webp` référencés), étiquettes illustrées en aplats (fruits, feuilles).

## Mouvement
Variables CSS pilotées en JS : `--jar-circle-rotation` (rotation de la roue et du texte en cercle), `--jar-parallax-x/y` (les couches bougent avec la souris : polygone ×-14 px, badge ×-10 px), entrées `--jar-shape-intro-*` et `--jar-badge-intro-*`. Courbes lues : `cubic-bezier(.19,1,.22,1)` (expo-out) sur `transform .8s`, `cubic-bezier(.645,.045,.355,1)` sur 0,9 s, `--ease-premium`. Sortie `is-flying-out` : opacité et `scale .94` en 0,42 s.

## Le geste signature
La gamme sur une roue qu'on tourne : chaque cran amène un pot au centre, le texte circulaire tourne avec. Chez nous : un artisan à gamme courte (confiturier, savonnier, brasseur) peut l'avoir en **piste horizontale manuelle** (`scroll-snap-type: x mandatory`, rotation de chaque pot liée à sa position par `animation-timeline: view(inline)`, B5) ; jamais en détournant la molette.

## Ce qu'on garde / ce qu'on refuse
Garde : les produits détourés à la même échelle, chacun incliné différemment ; une seule couleur forte (bordeaux) derrière des étiquettes très colorées ; le logo-personnage qui dit « ferme ».
Refuse : la molette détournée pour faire tourner un carrousel (scroll-jacking, GOUT § 4) ; un accueil sans texte visible ni contact (H1 caché) ; le texte qui tourne en cercle (GOUT § 4, rien ne tourne tout seul) ; l'étiquette qui suit le curseur.
