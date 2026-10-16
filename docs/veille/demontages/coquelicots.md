# Coquelicots — https://coquelicots.nl/
Maison de vacances (gîte avec piscine) rue des Arbrisseaux, Beaumont-du-Périgord, Dordogne (France), tenue par une famille néerlandaise ; site en néerlandais. Awwwards Honorable Mention du 26 août 2026 (awwwards.com/sites/vakantiehuis-coquelicots). Nuxt (`/_nuxt/`), GSAP, Lenis, Swiper ; crédit « Realisatie Anne Noteboom » en pied (lu sur la planche, petit, à confirmer).

## Squelette
En-tête en trois morceaux : logo (soleil levant + toit) et nom à gauche, **une phrase d'accueil au milieu** (« We heten u van harte welkom… Neem rustig een kijkje en twijfel niet contact op te nemen »), bouton « Boeken → » bleu nuit et « Menu » bleu clair à droite. Ordre : photo de la piscine au coucher du soleil dans un cadre arrondi (10-15 px) → section en **forme de nuage bleu** : « We werden verliefd op de Franse Dordogne » + photo des deux propriétaires dans une arche → texte de leur histoire → photos détourées en formes organiques (vue aérienne, transats, parasol) → « Wat vonden onze bezoekers » : avis en cartes avec note sur 10 (10, 9,6) et mois du séjour → **« Boek hier direct uw vakantie » : calendrier de réservation intégré à l'accueil**, deux mois côte à côte, étapes « Data selecteren / Gegevens invullen / Bevestiging », panneau « Uw selectie » → pied rouge avec coquelicots dessinés et le nom en capitales géantes.
En 3 secondes : la piscine, le bouton « Boeken », une phrase de bienvenue signée de la maison.

## Typographie
Lues : **Laca** Book / Medium / Semibold (fichiers `.otf` dans `/_nuxt/`), titres 45 px ordinateur / 32 px téléphone, interlignage 1,1, casse normale ; **Cormorant Garamond** Italic 500 (Google Fonts) pour les petites étiquettes jaunes (« Familie Noteboom », « Alle informatie ») ; Poppins déclarée. Le nom en pied est un condensé (non lu dans le CSS). Pas de `<h1>`.

## Couleur et matière
Fond crème `#FDF8F5`, texte bleu nuit `#121D5E` (×90), vert sapin `#1C402D`, bleu clair `#B4CDF0`, jaune `#F0E87E`, menthe `#ADD5C0` / `#D7E9DD`, rose `#E8C4BF`, rouge coquelicot (pied, non lu en hex). Sections découpées en **nuages** (bords ondulés), photos réelles du lieu et des propriétaires découpées en blobs, illustration de coquelicots en pied.

## Mouvement
`@keyframes loadMenu`, `loadHero`, `loadHeroInner`, `loadHeroMedia` de 3 s `ease-in-out` (entrée orchestrée au chargement). Courbe `cubic-bezier(.16,1,.3,1)` ×24 (expo-out). GSAP + Lenis lus. Un point bleu qui suit le curseur (visible sur les captures, posé au centre). Carrousel d'avis à flèches.

## Le geste signature
Le calendrier de disponibilité et de réservation posé sur la page d'accueil, avec les jours pris visibles : on sait tout de suite si la semaine voulue est libre. Chez nous : bloc sur mesure `Disponibilites.astro` qui lit un `.ics` (Airbnb/Gîtes de France exportent tous un iCal) au build, deux mois en grille CSS ; aucun JS côté client hors navigation de mois.

## Ce qu'on garde / ce qu'on refuse
Garde : la phrase d'accueil dans l'en-tête ; la photo des propriétaires avec leur histoire en « nous » ; les avis datés (mois du séjour) avec note, s'ils sont réels et sourcés ; le calendrier de disponibilité.
Refuse : Cormorant Garamond en italique et Poppins (polices IA, GOUT § 2) ; boutons pilule à 100 px (GOUT § 2) ; les blobs et nuages partout (tic décoratif) ; l'entrée de 3 s au chargement ; le point qui suit la souris (GOUT § 2, « projecteur qui suit la souris »).
