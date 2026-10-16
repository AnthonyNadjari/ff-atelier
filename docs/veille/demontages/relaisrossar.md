# Relais Rossàr — https://www.relaisrossar.it
Relais avec spa (ancien manège rénové, texte du hero) dans les collines du lac de Garde, Vénétie (Italie). Awwwards Honorable Mention du 9 juin 2026 (awwwards.com/sites/relais-rossar). Site maison : GSAP + ScrollTrigger, Lenis, Barba, Swiper, Fancybox ; polices Adobe Fonts (kit `hvn2yav`).

## Squelette
En-tête collant (`position: sticky`, 80 px) en boutons cerclés : langue et **« Pacchetto regalo »** (bon cadeau) à gauche, logo bordeaux centré, « Richiesta » (demande), « Prenota » (réserver) et menu à droite. « Prenota » déroule sous l'en-tête une **barre de réservation** : arrivée, départ (dates pré-remplies : aujourd'hui + 3 nuits), adultes et enfants avec boutons − / +, « Verifica disponibilità ». Ordre : vidéo aérienne des toits dans un cadre à marges et coins arrondis, H1 centré → distinctions (Boutique Hotel Club, Condé Nast Johansens) → « Corner » : un espace par bloc avec son nom en grand serif (Piscina, Kitch&Bar, Spa) → activités (vélo, golf) → offres → « Hai richieste particolari? » → bloc photo + texte → newsletter → blog daté → pied (chambres, espaces, contact, adresse Google Maps, tel, mailto).
En 3 secondes : un toit vu du ciel, une phrase, trois boutons d'action dont le bon cadeau.

## Typographie
Lues dans le CSS : titres **ivyora-display** 300 et 300 italique, H1 93,7 px ordinateur / 50 px téléphone, interlignage 0,99, interlettrage -0,03 em, casse normale, avec des mots en italique (« La tua *oasi* di pace sul *Lago di Garda* ») ; corps **ivystyle-sans** 15 px ordinateur / 13 px téléphone. Tailles en `clamp(50px, 4.1664vw, 80px)` etc.

## Couleur et matière
Fond blanc, texte `#131313` (×77), vert olive `#717658` (×29, et `rgba(113,118,88,.2)` en fonds), crème `#F7F6F5`, bordeaux `#854D47` (logo). Photos réelles et vidéos Vimeo du lieu (drone, piscine, assiettes, vélos), cadres à 5 px de rayon.

## Mouvement
GSAP + ScrollTrigger + Lenis + Barba lus. **Ressort en CSS `linear()`** lu dans une transition : `all .5s linear(0 0%, 0.008 1.4%, … 1.084 45.5%, 1.003 73.8%, 0.993 84.5%, 1 100%)` (dépassement à 1,084 puis retour). Autres courbes : `cubic-bezier(.25,.46,.45,.94)` ×7, `transform 1s cubic-bezier(.165,.84,.44,1)`. `filter: blur` ×9.

## Le geste signature
La barre de réservation qui descend de l'en-tête, déjà remplie (ce soir, 3 nuits, 2 adultes), avec des boutons − / + au lieu de listes : on vérifie la disponibilité en un clic. Chez nous : pour les métiers à créneau (gîte, chambre d'hôtes, location de matériel), un `<form>` dans un `popover` natif ouvert par le bouton de la nav (A6, `command`/`commandfor`), champs `type="date"` à 16 px, transition en `linear()` (A10) ; envoie vers le moteur de réservation du client.

## Ce qu'on garde / ce qu'on refuse
Garde : « Bon cadeau » comme bouton de premier niveau dans la nav (un vrai revenu pour un artisan) ; « Demande » distinct de « Réserver » ; les valeurs par défaut pré-remplies ; un espace = un nom en grand + 2 photos.
Refuse : emphase en italique dans le H1 (GOUT § 2) ; boutons pilule cerclés (GOUT § 2) ; corps à 13 px sur téléphone ; vidéo de drone en fond (iOS économie d'énergie, CLAUDE.md).
