# Paradero Todos Santos — https://www.paraderohotels.com/
Titre « Paradero Todos Santos | Design Hotel in Baja California Sur », `lang="en"`, description « A desert-and-sea design hotel in Todos Santos, Baja California Sur: suites, wellness rituals, milpa-driven dining and land-led experiences. », technologie lue : Webflow, jQuery. Démontage automatique du 2026-10-28 (`ff demonter`, mesures brutes dans `paradero.json`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».

## Squelette
Premier écran (ordinateur 1440x900) : h1 « WHERE DESERT LANDSCAPES PAVE THE PATH. » ; pas de média plein écran (2 image(s) dans l'écran) ; bouton principal « RESERVE » en haut à droite (1294, 23 px, dans une barre fixe) ; 4 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Téléphone (390x844) : h1 « WHERE DESERT LANDSCAPES PAVE THE PATH. » ; image plein écran (62 % de l'écran) ; bouton principal « RESERVE » en haut à droite (307, 16 px, dans une barre fixe) ; 3 mots visibles au-dessus du pli ; aucune couche bloquante ; rien ne bouge tout seul.
Nav : 3 lien(s) — MENU +, EN, [RESERVE] ; boutons entre crochets.
Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : `section.section_hero-split` (1,0 écran, 0 mots, 2 img) → `section.section_intro` « WHERE DESERT LANDSCAPES PAVE THE PATH. » (0,6 écran, 70 mots, 0 img) → `section.section_split` « SUITES » (2,4 écrans, 184 mots, 5 img) → `section.section_map` « GETTING TO PARADERO » (0,7 écran, 56 mots, 1 img) → `div.section_paradero-address` (0,4 écran, 44 mots, 0 img) → `section.section_split` « BEYOND CABO » (1,6 écran, 74 mots, 2 img) → `section.section_cta` (0,8 écran, 8 mots, 1 img) → `footer.footer_component` (0,8 écran, 72 mots, 2 img). Calques hors flux (fixes/absolus) : `div.navbar` (fixed, 80 px, 6 mots).
Pied de page : 16 lien(s) — [READ OUR FAQS], STAY AT PARADERO, DINING, WELLNESS & SPA, EXPERIENCES, SAILING, OUR STORY, EVENTS & RETREATS, MEDIA & PRESS, LONGEVITY CENTER (+6). Téléphone cliquable : oui (1, tel:+526126890817). Formulaire : 1 (2 champ(s) dans le premier). Horaires : non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures). Portes d'action : « MENU + » (#), « RESERVE » (https://be.synxis.com/?chain=24447&hotel=48672&SRC=30), « reservations@paraderohotels.com » (mailto:info@paraderohotels.com), « RESERVE YOUR STAY » (https://be.synxis.com/?chain=24447&hotel=48672&SRC=30).
En 3 secondes : à juger sur `captures/paradero-d.webp` (mesuré : fond du premier écran #f8f3e9, 2 image(s) et 4 mots dans le premier écran).

## Typographie
Lues dans le DOM calculé (ordinateur / téléphone) : titres h1 **Averia Serif Libre**, 48 px / 32 px téléphone, graisse 300, interlignage 1,20, capitales ; h2 **Averia Serif Libre**, 32 px / 24 px téléphone, graisse 300, interlignage 1,20 ; corps **Futuraptbook**, 18 px / 18 px téléphone, graisse 400, interlignage 1,50 ; boutons **Averia Serif Libre**, 16 px / 14 px téléphone, graisse 400, interlignage 1,50, capitales ; nav : non mesuré.
Sources `@font-face` : inline (data:) (webflow-icons) ; tiers (cdn.prod.website-files.com) (Futuraptbook) ; tiers (static.klaviyo.com) (Poppins-Klaviyo-Hosted) ; fichiers chargés : https://cdn.prod.website-files.com/6ab6af8e83e49194546e3523/6ab6af8e83e49194546e354b_FuturaPTBook.otf, https://fonts.googleapis.com/, https://fonts.googleapis.com/css?family=Averia+Serif+Libre:300,400. Familles en usage sur le texte visible : Averia Serif Libre ×46, Futuraptbook ×33, Instrument Sans ×3, Helvetica ×1. Ce qui la rend rare : à juger.

## Couleur et matière
Fond du corps #ffffff (premier écran #f8f3e9), texte #1c1814 (contraste 17,65:1). Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : #ffffff (80 %), #141414 (10 %), #f8f3e9 (7 %), #fffbf4 (4 %), #a6633c (0 %) ; textes par nombre de caractères : #ffffff (60 %), #991e12 (25 %), #1c1814 (7 %), #f8f3e9 (6 %), #fffbf4 (1 %). Images : 13 `<img>` visibles, 1 fond(s) en image, 0 vidéo(s), `mask-image`/`clip-path` sur 1 élément(s). Matière (texture, grain, détourage) : à juger sur les captures.

## Mouvement
Bibliothèques : GSAP (window.gsap), ScrollTrigger (window.ScrollTrigger), Swiper (window.Swiper), jQuery (window.jQuery), Webflow (window.Webflow). Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : `opacity 0.45s ease` ×14, `background-color 0.45s ease` ×11, `color 0.4s ease` ×4, `background-color 0.4s ease` ×1, `opacity 0.25s ease` ×1, `transform 0.25s ease` ×1, `animation klaviyo-fadein 0.35s ease` ×1. Scroll lié : ScrollTrigger oui ; `animation-timeline` sur 0 élément(s) ; `position: sticky` sur 0 bloc(s) de plus d'un écran. Attributs de mouvement : `data-animation` ×1, `data-kl-scroll-locking-modal` ×1. Ce qui bouge réellement à l'écran : à juger sur `captures/paradero-planche.jpg`.

## Le geste signature
À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :
1. La section la plus haute : `section.section_split` « SUITES » (2,4 écrans, 184 mots, 5 image(s)).
2. L'élément le plus animé : `div.needsclick` (animation animation klaviyo-fadein 0.35s ease ; attributs data-kl-scroll-locking-modal).
3. Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).

## Ce qu'on garde / ce qu'on refuse
Garde : à juger. Mesuré et utile à l'usine : téléphone cliquable, portes d'action nommées (« MENU + », « RESERVE », « reservations@paraderohotels.com », « RESERVE YOUR STAY »), formulaire de contact.
Refuse (signes IA mesurés, GOUT § 2) : polices « IA » : Instrument Sans ; boutons pilule : 1/14 ordinateur, 1/14 téléphone ; vidéo en premier écran : non ; couche bloquante à l'arrivée : non ; « X ans » mis en scène : non. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.

## Style retenu (jugé sur les captures, veille du 28 oct 2026, tour 15)

Source : [paraderohotels.com](https://www.paraderohotels.com/), captures `captures/paradero-propre-d.jpg`, `-propre-m.jpg` (fenêtre d'inscription fermée ; voile noir du premier écran d'origine), `-planche.jpg` (avec la fenêtre).

- **Polices** : titres, menu et boutons en Averia Serif Libre 300 en capitales (h1 48 / 32 px, h2 32 / 24 px) ; texte en Futura PT Book 18 px, interlignage 1,5. Libre : Spectral (titres) et Josefin Sans (texte).
- **Couleurs** : sable #f8f3e9 et ivoire #fffbf4 pour les blocs de texte, titres et liens rouge brique #991e12, texte #1c1814 ; panneaux photo voilés de noir 30 à 45 % à texte blanc ; un bloc bleu outremer #13317a (non repris) ; pied bordeaux #610011. Régime : coloré doux (encre bordeaux).
- **Espacements** : environ 80 px au téléphone, 120 à l'ordinateur autour des blocs de texte centrés en colonne étroite ; alternance texte / panneau photo.
- **Rayons, bordures, ombres** : angles droits, boutons à contour de 1 px, aucune ombre.
- **Photos** : béton, cactus, plats, en grands panneaux pleine largeur (deux par écran à l'ordinateur) voilés, titre, phrase et bouton posés dessus ; premier écran en deux photos côte à côte.
- **Boutons et liens** : contour fin en capitales serif, brique sur le sable, ivoire sur les photos.
- **Animations** : la photo de chaque panneau entre à 1,04 et se pose à 1 sur les 600 premiers pixels (décélération), dérive de 2,5 à 3 px par 100 px ; le texte du panneau monte de 24 px en fondu, 0,8 s ease-out, une ligne toutes les 0,1 s ; navigation qui prend le sable en 0,4 s. Profil : `photo-qui-se-pose` (nouveau).
- **Textures** : aucune ; une carte au trait fin dans le bloc d'accès.

## Architecture

Plusieurs pages derrière un menu plein écran (« MENU + ») et au pied (séjour, restaurant, spa, expériences, voile, histoire, événements, presse, questions), « RESERVE » toujours en haut. Accueil (9 écrans) : diptyque → phrase d'accueil et deux boutons → Suites / Villas en deux portes photo, bien-être, expériences / restaurant → comment venir (carte, trois aéroports) → adresse, téléphones cliquables, courriel, météo → paysage → maisons → questions → pied bordeaux.

**Convient à** : gîte, hôtel, domaine viticole, chambre d'hôtes dans un paysage fort, avec de grandes photos d'architecture et de lieu.

**Geste signature** : les grands panneaux dont la photo se pose doucement pendant que le texte monte dessus.

**Garde / refuse** : garde le sable, la brique et le bordeaux, les panneaux voilés, les boutons à contour ; refuse la fenêtre d'inscription et le bleu concurrent.
