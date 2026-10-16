# Paput — https://www.paputmenorca.com/
Burgers maison, chiringuito-restaurant sur le port de Mahón + local de livraison (Minorque, Espagne), « desde 2016 » (texte du site). Présent dans la catégorie Food d'Awwwards, fiche datée du 15 avril 2026 (awwwards.com/sites/paput-menorca), sans prix lu. Webflow.

## Squelette
Barre haute pleine (fond crème) : logo à gauche, bouton « Hacer pedido » jaune + burger à droite ; pas de liens visibles sur ordinateur. Ordre : photo plein cadre (burgers dans leur boîte jaune, assombrie) avec « Paput en casa » et « Hacer pedido » centrés → « Açò és una manera de viure » (catalan de Minorque) + deux photos du chiringuito → « Nuestras burgers » (titre manuscrit) en carrousel de burgers détourés avec ingrédients → deux bandes de texte croisées en diagonale « A poc a poc life » → la boutique de t-shirts → **les deux adresses côte à côte**, chacune avec un pictogramme dessiné, l'adresse et les horaires (« Domingo a jueves 11:30 h a 23:00 h ») → « Si quieres unirte al equipo » sur fond jaune avec une grande mascotte (yeux) → pied vert.
Contact : WhatsApp (wa.me), deux liens Google Maps, e-mails RH et contact ; rien au premier écran sauf la commande.
En 3 secondes : le produit dans son emballage, un mot d'ordre, un bouton pour commander.

## Typographie
Lues dans le CSS : **Roc Grotesk** (Kostic, fichiers `.otf` auto-hébergés, graisses 100 à 900) partout, H1 en Black 900, 160 px ordinateur / 70 px téléphone, interlignage 0,8 (128 px pour 160 px) et 0,85 sur téléphone, capitales. **Nazare** SemiBold déclarée (titres manuscrits, ex. « Nuestras burgers »). Rare : un grotesque très large et très gras serré à 0,8, plus une écriture à la main pour les apartés.

## Couleur et matière
Fond crème `#F4F3E6`, vert bouteille `#0B4635` (logo, textes, pied), jaune `#FFC62D` (boutons, bandeau recrutement), rouge `#E54D3A` ponctuel. Photos réelles du produit sur fond gris clair et du chiringuito dans la végétation ; burgers détourés dans le carrousel. Pictogrammes dessinés au trait (cabane, boîte de livraison) et mascotte.

## Mouvement
Interactions Webflow (`data-w-id`), pas de GSAP ni Lenis lus. `transition: all .3s` ×17. Les deux bandes « A poc a poc life » croisées en diagonale défilent en sens contraires (texte plein + texte en contour, `-webkit-text-stroke` ×7 dans le CSS). Le reste est statique.

## Le geste signature
Deux bandes de texte inclinées qui se croisent (une pleine, une en contour) entre le menu et la boutique, le slogan local répété. Chez nous : `data-marquee` ×2 dans un conteneur `rotate(-6deg)` / `rotate(4deg)`, un des deux en contour (`-webkit-text-stroke` via token), et `data-marquee-velocity` pour qu'il réagisse au doigt plutôt que de tourner seul.

## Ce qu'on garde / ce qu'on refuse
Garde : un bloc par adresse avec pictogramme dessiné + horaires en clair ; le recrutement en bloc plein écran, avec l'e-mail RH ; une phrase dans la langue locale en titre ; le H1 très gras à interlignage 0,8.
Refuse : boutons pilule à `border-radius: 100px` (×28, GOUT § 2) ; l'hero photo assombri d'un voile noir ; le marquee qui tourne sans le doigt (GOUT § 4) ; `transition: all` (GOUT § 8).
