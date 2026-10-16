# Café Binocle — https://www.cafebinocle.com/
Micro-torréfacteur « climatopositif », vente en ligne et abonnements, site en français (`lang="fr"`), boutique Shopify en dollars canadiens (`Shopify.currency` = CAD, lu) : Canada francophone, ville non lue. Awwwards Honorable Mention du 21 avril 2026 (awwwards.com/sites/cafe-binocle).

## Squelette
En-tête non collant (`position: relative`) : « Café climatopositif™ » en texte à gauche, à droite « Abonnement » (bouton orange), panier rond, « Menu » rond, langue + compte. Ordre : mot-symbole « BINOCLE » ondulé géant + sceau rond (tasse-jumelles et texte en cercle) + bulle bleue « Vous ne trouverez pas notre café en épicerie » → grille à filets : illustrations (globe, fleur, bonhomme) | « Le café le plus gentil au monde! » → bande défilante « Torréfacteur de l'année · vague montante » → « Nos cafés » + texte + cartes à flèche (mission, abonnements -15 %) + photos produit (sac + grains, 300 g ou 1 kg) → **manifeste** en capitales sur toute la largeur (« Rester petits… ») avec fleurs dessinées → collaborations d'artistes → « Greenwashing? » + « Où nous trouver? » (carte Google My Maps) → pied (contact, infolettre, « Écrivez-nous »).
Contact : seulement un mailto et la carte des points de vente ; pas de téléphone.
En 3 secondes : un jaune franc, un nom qui ondule, un personnage.

## Typographie
Lues dans le CSS : **Founders Grotesk** Regular/Medium/Light (auto-hébergées, ×83 déclarations), **Caprasimo** (titre « Le café le plus gentil au monde! », 76 px ordinateur / 41 px téléphone, interlignage 1,1, graisse 400 mais dessin très gras), **Cimo** (titres condensés ondulés « Nos cafés », « Greenwashing? »), Assistant en repli. Le mot « BINOCLE » et le sceau sont des SVG (`logo_climatopositif`, `circle_logo_text`). **Aucun `<h1>`** dans la page (sonde `h1: null`). Rare : le manifeste en capitales grotesques à pleine largeur, comme une affiche.

## Couleur et matière
Fond jaune `#FFE26E` (`rgb(255,226,110)`), texte brun `#594B3C` (×71), orange `#EF5B34` (abonnement), vert `#00A881` (greenwashing), rose `#F8CCDF`, bleu `#8AD7F7`, crème `#FFFEEC`. Filets bruns qui découpent la page en grille. Photos produit détourées sur blanc ; illustrations plates (globe, fleurs, bonhomme).

## Mouvement
GSAP + ScrollTrigger chargés (1 usage repéré dans le HTML). CSS lu : `@keyframes logo-rotate` (sceau qui tourne en 30 s linéaire, infini) et `floating` (bulle qui flotte de -10 %, 2 s). `transition: all .3s` ×27. Bande « Torréfacteur de l'année » qui défile.

## Le geste signature
Le manifeste : un paragraphe entier en capitales grotesques sur toute la largeur, lu comme une affiche, qui dit pourquoi l'entreprise reste petite. Chez nous : bloc `About/manifeste` (variante à créer) en CSS pur, `font-size` en `cqi` (C3) pour remplir la largeur, `text-wrap: pretty` ; `data-text-fill` au plus, pas plus.

## Ce qu'on garde / ce qu'on refuse
Garde : la phrase de positionnement concrète au premier écran (« pas en épicerie ») ; la grille à filets visibles qui range la page comme un journal ; le manifeste pleine largeur ; formats et poids du produit en clair (300 g ou 1 kg).
Refuse : le sceau qui tourne tout seul et la bulle qui flotte en boucle (GOUT § 4) ; boutons pilule à 50 px (×21, GOUT § 2) ; aucune balise `<h1>` ; un manifeste en capitales sur 8 lignes, lourd à lire sur téléphone (GOUT § 1).
