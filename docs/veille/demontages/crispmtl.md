# CRISP Barbershop — https://www.crispmtl.com/
Barbier, deux adresses à Montréal (Pointe-Saint-Charles, 5157 rue Notre-Dame Ouest, et le Village), ouvert en 2018 (texte du site) ; site en anglais avec version française. Awwwards Honorable Mention du 11 août 2026 (awwwards.com/sites/crisp-barbershop). Webflow, GSAP ; réservation par widget Squire (`iframe`).

## Squelette
Nav en trois points sur la photo : burger à gauche, « CRISP » centré, « Book now » à droite ; **le menu caché contient l'adresse et les horaires** (« Tuesday, Wednesday: 11AM-7PM… »), lus dans la nav. La page ne défile pas dans `window` : tout défile dans `.global-wrapper` (hauteur 6 988 px dans une fenêtre de 900, relevé par script). Ordre : photo plein écran du barbier au travail (client yeux fermés), « More than a barber shop » + « Book now » → « 7 years of Crisp. » + texte + photo floue → grand index « Locations / Services / Portfolio / Collabs / Academy » avec image au survol → « 2 locations, same great cuts » en accordéon (une ligne par adresse) → **« See our price list. » en trois colonnes par niveau de coiffeur** (Stylist : coupe 50 $, enfant 40 $, ciseaux 60 $, barbe 30 $, coupe + barbe 60 $ ; Junior stylist ; Junior barber à 25 $) → « What we do best. » portfolio de coupes de profil → collaborations.
En 3 secondes : un geste de barbier, une phrase, un bouton.

## Typographie
Lues dans le CSS : **Helvetica Neue LT Std Bold Extended** (`HelveticaNeueLTStd-BdEx.otf`), H1 92 px ordinateur / 26 px téléphone, graisse 700, interlignage 1, capitales ; **Perfectly Nineties** (serif, petits libellés « From Montreal, with Love », « Our Services ») ; Helvetica Neue Bold. Rare : un grotesque large et gras en capitales serrées, contre une étiquette en serif minuscule.

## Couleur et matière
Fond crème `rgb(245,244,241)` (#F5F4F1), texte `#0A090C`, voile noir 50 % sur la photo du hero (`rgba(0,0,0,.5)` lu au centre). Aucun accent de couleur. Photos réelles : barbier, clients de profil sur fonds unis (vert, gris, blanc), salon, photo floue de mouvement.

## Mouvement
GSAP (ease `power3.inOut`, `power1.inOut`), CSS `@keyframes heroFadeIn 1.2s ease-out`, `revealUp .7s`, `heroBtnReveal .6s`, `scroll 10s linear` (bande). Images qui suivent le survol de l'index (`hover-image-con`). Défilement dans un conteneur, pas dans la page.

## Le geste signature
La grille de prix par niveau de coiffeur (stylist, junior stylist, junior barber), avec les mêmes prestations sur chaque colonne : le client choisit son budget en une ligne. Chez nous : variante de `Services/grid` en tableau à colonnes (`<table>` avec `<th scope="col">`), prix réels du brief seulement ; utile pour coiffeur, esthéticienne, auto-école (moniteur / tarif).

## Ce qu'on garde / ce qu'on refuse
Garde : le tarif par niveau en tableau ; les adresses en accordéon quand il y en a plusieurs ; le portfolio de profil sur fonds unis (le résultat se voit) ; « Book now » toujours en haut à droite.
Refuse : « 7 years of Crisp » (X ans d'expérience calculé, GOUT § 2) ; la page qui défile dans un conteneur au lieu de la fenêtre (barre d'adresse iOS, retour en haut, accessibilité) ; adresse et horaires cachés dans le menu ; voile noir sur la photo du hero.
