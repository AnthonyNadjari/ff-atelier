# FIZIOPONT — https://www.fiziopont.hu/
Titre « FIZIOPONT - Gyógytorna és Manuálterápia », `lang="en"`, technologie lue : Webflow, jQuery. Démontage automatique du 2026-10-30 (`ff demonter`, mesures brutes dans `baume.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 absent ; pas de média plein écran (11 image(s) dans l'écran) ; bouton principal « Időpontfoglalás » en haut à droite (1202, 24 px, dans une barre fixe, dans la nav) ; 20 mots visibles au-dessus du pli ; aucune couche bloquante ; bouge tout seul sans défilement : 1 élément(s) (`div.section-marquee-scroll-row`).
Téléphone (390x844) : h1 absent ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « Jelentkezz állapotfelmérésre » à mi-hauteur au centre (20, 307 px, dans la nav) ; 15 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 6 lien(s) — home, Módszereink, Árak, Kapcsolat, Blog, [Időpontfoglalás] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `header.section_hero-version-2` (0,9 écran, 15 mots, 1 img) → `div.section-marquee-scroll` (0,2 écran, 0 mots, 9 img) → `section.section_cards-layout` « Miben segíthetünk? » (0,7 écran, 54 mots, 4 img) → `section.section_gallery18` « FizioPont Képekben » (0,9 écran, 6 mots, 20 img) → `section.section_about-us_services` « Lépésről lépésre » (3,0 écrans, 91 mots, 0 img) → `section.section_parallax_cta` « Kezelés már az első alkalommal » (0,4 écran, 20 mots, 0 img) → `section#section-services` « Alkalmazott módszereink » (1,4 écran, 29 mots, 10 img) → `section.section_parallax_cta` « Meghallgatunk, mert fontos a történeted » (0,4 écran, 21 mots, 0 img) → `div.section-marquee-scroll` (0,2 écran, 0 mots, 9 img) → `section.section_team-anita-version-2` « Terapeutáink » (1,0 écran, 52 mots, 0 img) → `section.section_team-anita-version-2` (0,9 écran, 49 mots, 0 img) → `section.section_testimonial11` « Klienseink mondták » (1,0 écran, 281 mots, 0 img) → `div.section-marquee-scroll` (0,2 écran, 0 mots, 9 img) → `section#location-section` « Itt találsz minket » (1,1 écran, 40 mots, 1 img) → `section.section_faq` « Gyakori kérdések » (1,1 écran, 195 mots, 0 img) → `footer.footer_component` (0,6 écran, 37 mots, 1 img). Calques hors flux (fixes/absolus) : `div.navbar1_component` (fixed, 96 px, 5 mots).
Pied de page : 10 lien(s) — [Időpontfoglalás], Módszereink, Árak, Kapcsolat, +36 70 551 19 28, fiziopont.info@gmail.com, 1082 Budapest, Corvin sétány 6A, II. eme, Hétfő-Péntek: 08:00-20:00, ÁSZF, Adatvédelmi tájékoztató. Téléphone cliquable : oui (4, tel:+36306389590). Formulaire : aucun. Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : aucune (réservation, commande, bon cadeau, devis, rendez-vous).
En 3 secondes : à juger sur `captures/baume-d.webp` (mesuré : fond du premier écran #fbfafa, 11 image(s) et 20 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 : non mesuré ; h2 **Poppins**, 40 px / 32 px téléphone, graisse 700, interlignage 1,20 ; corps **Poppins**, 16 px / 16 px téléphone, graisse 400, interlignage 1,25 ; boutons **Poppins**, 16 px / 16 px téléphone, graisse 400, interlignage 1,25 ; nav **Poppins**, 16 px / 16 px téléphone, graisse 400, interlignage 1,25.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (Poppins) ; fichiers chargés : https://cdn.prod.website-files.com/662956a88a77a040300ecebb/662956a98a77a040300ecf73_Poppins-Regular.ttf, https://cdn.prod.website-files.com/662956a88a77a040300ecebb/662956a98a77a040300ecf72_Poppins-Bold.ttf, https://cdn.prod.website-files.com/662956a88a77a040300ecebb/662956a98a77a040300ecf8b_Poppins-SemiBold.ttf, https://cdn.prod.website-files.com/662956a88a77a040300ecebb/662956a98a77a040300ecf71_Poppins-Black.ttf, https://fonts.googleapis.com/, https://fonts.googleapis.com/css?family=Montserrat:100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic. Familles en usage sur le texte visible : Poppins ×135, Montserrat ×8. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #fbfafa, texte #333333 (contraste 12,13:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #fbfafa (84 %), #f2e2da (5 %), #333333 (4 %), #e2ede8 (3 %), #94ceb3 (2 %) ; textes par nombre de caractères : #333333 (84 %), #fbfafa (9 %), #f2e2da (4 %), #5a5a5a (1 %), #e6946e (1 %). Images : 65 `<img>` visibles, 9 fond(s) en image, 0 vidéo(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : jQuery (window.jQuery), Webflow (window.Webflow). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `transform 0.5s ease` ×25, `opacity 0.2s ease` ×10, `all 0.001s ease-in-out` ×7, `background-color 0.1s ease` ×5, `color 0.1s ease` ×5, `all 0.7s ease-in-out` ×4, `all 0.5s ease-in-out` ×4, `all 0.4s ease-in-out` ×2, `opacity 0.7s cubic-bezier(0.749, -0.005, 0.374, 0.843)` ×1, `box-shadow 0.5s ease-in-out` ×1. Scroll lié : ScrollTrigger non ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 1 bloc(s) de plus d'un écran (`div.about-us_services_content` 3,0 écrans). Attributs de mouvement : `data-animation` ×3. Ce qui bouge réellement à l'écran : à juger sur `captures/baume-planche.jpg`.

## Construction

Relevé sur les captures (ordinateur 1 400 × 900 et téléphone 390 × 844, regardées le 30 oct 2026 avec l'outil Read : planche
`captures/baume-planche.jpg`, `baume-d.webp`, `baume-m.webp`, plus deux séries à la molette tous les 1 200 et 840 px) et sur
le DOM calculé. Blanc rosé #fbfafa qui vire au rose poudré #f2e2da par bandes, sauge et menthe, pêche #e6946e pour les
boutons et la moitié du nom, anthracite #333333 ; Poppins partout (700 aux titres) ; coins adoucis (cadres 24 px, cartes
16 px), ombres réelles douces, boutons pilule (refusés). Conteneur de 1 200 px environ. Accueil, dans l'ordre :

1. **Barre** (96 px, fixe, blanche) : le logo « FIZIO » anthracite + « PONT » pêche en capitales fines à gauche ; quatre liens
   et la pilule pêche « Időpontfoglalás » (rendez-vous) à droite. Au téléphone : logo et menu.
2. **Premier écran, diptyque clair** (0,9 écran) : à gauche (5/12) le titre en Poppins 700 de 40 px sur trois lignes
   (« Gyógytorna és manuálterápia a Corvin sétánynál » : le soin et le lieu), une phrase de 12 px, deux boutons (pêche plein,
   contour) ; à droite (5/12) la photo du soin (la kiné qui corrige une posture au rouleau) dans un **cadre à coins adoucis
   devant une plaque sauge de même taille décalée de ~70 px vers la droite et le haut** : le relief du site. Fond blanc qui
   devient rose poudré en bas. Au téléphone : titre, boutons pleine largeur, photo dessous, plaque sauge qui dépasse à droite.
3. **Le nom qui défile** (0,2 écran) : « FIZIOPONT » répété, en capitales fines de ~100 px, la première moitié anthracite, la
   seconde pêche, qui glisse lentement de droite à gauche ; revient deux fois plus bas entre les blocs.
4. **« Miben segíthetünk ? »** (0,7 écran, sur rose poudré) : titre centré, quatre cartes blanches à coins adoucis, photo en
   haut (4:3) collée aux bords de la carte, titre gras, trois lignes de texte.
5. **« FizioPont Képekben »** : galerie en carrousel de photos aux coins adoucis, flèches rondes (non reprise : le site a déjà
   ses photos dans les cartes).
6. **« Lépésről lépésre » (pas à pas), le geste signature** (3 écrans) : le bloc colle à l'écran ; à gauche le titre, une
   phrase et deux boutons ; à droite **une pile de cartes** (sauge à texte blanc, menthe à texte anthracite) légèrement
   tournées (−3° à 3°), chacune avec son grand chiffre en filigrane, son titre gras et son texte ; à chaque cran, la carte
   suivante arrive par-dessus et se pose sur le paquet en se redressant, la précédente reste visible dessous, décalée.
7. **Bandeaux photo** « Kezelés már az első alkalommal » : photo sombre pleine largeur sous un voile brun, titre blanc, deux
   boutons (non repris : bandeau d'appel générique).
8. **« Alkalmazott módszereink »** : neuf méthodes en cartes menthe à pictogramme au trait (non repris : pictogrammes).
9. **« Terapeutáink »** : chaque praticienne en rangée, son portrait dans un cadre aux coins adoucis **devant une plaque pêche
   décalée** vers le bas et la gauche (la rangée suivante passe de l'autre côté), son nom et son métier en pêche, « Hitvallásom »
   (sa conviction) et « Tapasztalataim » en liste à puces pêche.
10. **« Klienseink mondták »** : grand guillemet pêche pâle en fond, cartes d'avis blanches en piste avec étoiles, points et
    flèches rondes.
11. **« Itt találsz minket »** : sur un dégradé vers le menthe, à gauche le titre et des cartes blanches à icône (adresse,
    transports, horaires), à droite un plan stylisé dans un cadre aux coins adoucis ; puis les questions en accordéon filetées.
12. **Appel final et pied** : phrase centrée en gras, deux boutons ; pied anthracite #333 avec le nom en deux couleurs en
    grand (~70 px), la phrase, le bouton pêche, trois colonnes (menu, coordonnées, réseaux), mentions.

Échelles : titres 40 px pour un texte de 16 px (2,5) ; nom défilant ~100 px. Le relief vient des plaques de couleur décalées
derrière les photos et des ombres réelles des cartes ; le rythme, de l'alternance blanc rosé / rose poudré / menthe.

## Le geste signature

**Les étapes en cartes qui se rebattent** : un bloc qui colle à l'écran, le texte à gauche, une pile de cartes de couleur
légèrement tournées à droite ; à chaque cran, la carte de l'étape suivante arrive du bas et se pose sur le paquet. Codé :
`src/sections/Process/baume.astro` (une carte par `site.process`, sauge et menthe en alternance, angles −3°, 2°, −1,5°, 2,5°…,
« Étape 2 sur 4 » en petit au lieu du chiffre géant décoratif ; un repère invisible d'un écran par étape, `IntersectionObserver`
au milieu de l'écran, dans les deux sens ; transform 0,7 s à léger dépassement, jamais calé image par image ; sans script ou en
mouvement réduit, les cartes l'une sous l'autre). Profil `cartes-qui-se-rebattent` (MOUVEMENTS.md), qui porte aussi l'entrée
du premier écran (la photo se pose sur sa plaque) et le nom qui défile (`data-marquee`).

## Ce qu'on garde / ce qu'on refuse
Garde : le diptyque clair au cadre devant sa plaque sauge décalée, le nom en deux couleurs qui défile, les cartes photo sur
rose poudré, la pile de cartes des étapes, le praticien devant sa plaque pêche avec sa liste à puces pêche, les avis en piste
sous le grand guillemet, le lieu en cartes à icône sur menthe, l'appel final centré, le pied anthracite au nom en deux
couleurs. Mesuré et utile à l'usine : téléphone cliquable (4 liens `tel:`), rendez-vous en tête.
Refuse : les boutons pilule (GOUT § 2 : rayon 8 px), le chiffre géant en filigrane sur chaque carte (numérotation décorative :
« Étape 2 sur 4 » en petit), la galerie en carrousel, les bandeaux photo sous voile brun (bandeau d'appel d'usine), les
méthodes en pictogrammes, les étoiles des avis (la note est écrite), le plan stylisé (pas de carte inventée : le lien « Voir le
plan » du client), la barre WhatsApp flottante.
Polices : Poppins (graisses 400 à 700) -> Red Hat Display (géométrique ronde, libre) ; le logo en capitales fines -> Josefin
Sans 300.
Régime de palette : blanc rosé #fbfafa mesuré (neutre) réchauffé à #fbf2ec (chroma OKLCH 0,013) pour que le rose de la source
se lise, rose poudré #f2e2da en bandes, sauge #4d7562 (assombrie pour porter du blanc), menthe #e2ede8, pêche #e6946e : clair
teinté doux.

## Preuve (30 oct 2026, après une reprise)

Juge neuf, premier passage : construction fidèle et fin propre, mais photos datées et disparates, « Pas à pas » trop long (le
titre et les boutons répétés quatre fois au téléphone), titre « Vos kinés » sous la barre, frise de photos absente. Reprise :
une seule série de photos chaudes (un studio de rééducation et de pilates : tapis, paravents, plantes, bois clair ; Wikimedia
Commons, CC BY-SA 4.0 et domaine public) ; la course des étapes réduite à un demi-écran par carte, et au téléphone seule la pile
colle (le titre et les portes passent une fois) ; `scroll-margin-top` sur les sections et plus d'air au-dessus de « Vos
kinés » ; la frise de la source (« Le cabinet en images », piste qu'on fait glisser) sous les cartes des motifs. Le bandeau
d'appel brun sous voile reste refusé (fin d'usine). Site jetable `_essai-baume` (`// DEMO`, « Cabinet Rivage, kinésithérapie
à Nantes », avis inventés pour l'essai), `ff melanger --style baume` : comparaison [source](captures/baume-source.jpg) /
[essai, source à gauche](captures/baume-essai.jpg). `ff verifier` vert hors données de test du jetable (a11y sans violation),
`ff ia` sans signe. `ff ressemblance` : premier écran 0,59 au téléphone (demo-brasserie) et 0,49 à l'ordinateur au plus ;
**déroulé 0,78** au plus (barbier-kessler, maison-aurore), au-dessus du seuil : ordre du socle (héros, services, étapes, à
propos, avis, lieu, questions) et même moitié « site » que la plupart des sites.
