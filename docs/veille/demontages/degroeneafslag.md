# De Groene Afslag — https://www.degroeneafslag.nl/
Lieu « circulaire » à Bussum (Pays-Bas) : restaurant végétal, hôtel de 30 chambres, salles de réunion, école, agenda culturel (texte du site), Cissy van Marxveldtstraat 1. Awwwards Honorable Mention du 22 juillet 2026 (awwwards.com/sites/de-groene-afslag). Webflow, GSAP + ScrollTrigger, Swiper.

## Squelette
Logo en étiquettes empilées en haut à gauche (« De » / « Groene » **écrit à l'envers, en miroir** / « Afslag »), à droite trois carrés pleins : « Agenda » noir, loupe kaki, « Menu » avec un pictogramme de panneau de direction, cadre rose. Une ligne verticale « Fly me to the moon » + petite fusée en marge gauche. Ordre : photo du bâtiment brutaliste avec le logo géant en étiquettes → H1 long (« De Groene Afslag is het Veranderhuis van Nederland met vergaderzalen, restaurant, hotel, programmering, werkplaats… ») → une section par activité sur **fond plein de couleur différente** (Restaurant vert, Hotel rose, Zalen jaune, School orange, Werkplaats bleu ciel, Agenda kaki) → agenda daté (« Donderdag 15 okt ») → actualités → « Verder grasduinen? » 4 tuiles couleur (Over ons, Vacatures, Contact & route, het gebouw) → newsletter → pied noir : logo pleine largeur, horaires (« ma - vr 7:30 - 22:00 uur »), tel:+31358888877, e-mails par usage.
En 3 secondes : un bâtiment, un logo qui se lit mal exprès, trois boutons carrés.

## Typographie
Lues dans le CSS (variables `--_typography---fonts--*`) : **Helvetica Neue** Roman/Medium/Italic (fichiers `.otf`/`.ttf` auto-hébergés), **Times New Roman** Roman/Italic (`Times-Italic.ttf`) pour les mots mis en relief dans les titres (« Van *brainstorm* tot *borrel*. », « De *kunst* van het *slapen*. »), **OG Courier** pour les bulles manuscrites. H1 40 px ordinateur / 24 px téléphone, interlignage 1,2 ; titres de section posés en étiquettes noir sur blanc (`text-stroke` ×9). Rare : la typographie comme papeterie (étiquettes, machine à écrire) plutôt que comme affiche.

## Couleur et matière
Fond `#FAFAF9`, texte `#1A1A1A`, vert sapin `#1F4130`, kaki `#3C3F17`, plus une couleur pleine par activité (rose, jaune, orange, bleu ciel, vert vif : lus sur la planche, hex non relevés). Photos réelles du bâtiment, des chambres, des salles, des gens ; objets détourés (robot jouet, cerveau, ampoule) posés sur les aplats ; cadres dorés et bulles de BD en accessoires.

## Mouvement
`position: sticky` ×25 dans le CSS : en défilant, **le nom de la section vient se ranger à côté du logo** dans l'en-tête (« Afslag » + « Restaurant », puis « Zalen », « School », « Nieuws ») (lu sur 6 vignettes de la planche). GSAP (`expo.inOut`, `back.inOut(3)`, `power2.out`), courbe CSS `cubic-bezier(1,0,0,1)` ×21 (très sèche), bande défilante 60 s. `mix-blend-mode` ×13.

## Le geste signature
Le titre de la section courante qui se colle à côté du logo et complète son nom (« Afslag » + « Restaurant ») : la nav dit où l'on est sans menu. Chez nous : CSS pur, chaque `<h2>` de section en `position: sticky; top: 0` aligné sur la hauteur du logo, ou la technique `scroll-state(stuck)` (A1) pour changer son style une fois collé ; aucune ligne de JS.

## Ce qu'on garde / ce qu'on refuse
Garde : le titre de section qui se range dans l'en-tête ; une couleur pleine par activité quand le lieu a plusieurs métiers ; les e-mails différents par usage (réservation de salle, accueil) ; le H1 qui dit en une phrase tout ce qu'on trouve sur place.
Refuse : l'emphase en italique Times dans les titres (GOUT § 2) ; le logo à l'envers qui se lit mal sur téléphone ; six aplats de couleurs saturées sur une même page (un seul feu d'artifice, GOUT § 1) ; `cubic-bezier(1,0,0,1)` = ease-in sur des éléments d'interface (GOUT § 8).
