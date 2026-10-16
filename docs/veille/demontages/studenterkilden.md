# Studenterkilden — https://studenterkilden.dk/en
Auberge historique louée pour mariages, anniversaires, réunions et dîners, en lisière de forêt, Enghavevej 16, Klampenborg (Danemark), « since 1854 ». Awwwards Honorable Mention du 11 août 2026 (awwwards.com/sites/studenterkilden). Webflow, GSAP + ScrollTrigger + Lenis + Barba (transitions de page).

## Squelette
Nav simple non collante : « Menu + » à gauche, logo dessiné (branche fleurie) au centre, da / en et bouton doré « Book a table » à droite ; téléphone : « Menu + » et « Book a table ». Ordre : **premier écran sans photo** : « Since 1854 » entre deux points, H2 centré sur 3 lignes (« Beautiful settings for weddings, birthdays, events, festive gatherings and meetings »), une question (« What can Studenterkilden give you and your guests? »), deux boutons (réserver / voir les formules) → la photo de la maison à colombages arrive en dessous, plein large → « A historic house with settings for every occasion » : 3 formules en cartes photo (An evening at the source, Meeting facilities, Group events) → texte d'histoire sur fond gris anthracite → photos → **FAQ de logistique** (parking, plusieurs groupes en même temps, capacité, régimes et allergies, mariage dans le jardin, toilettes, carte cadeau, café l'après-midi, comment venir, taxi, musique forte) → pied : newsletter, adresse, tel:+4539903971, mailto, horaires en phrase (« odd weeks, Thursday and Friday »), puis le nom en très grand sur toute la largeur.
En 3 secondes : ce qu'on peut y fêter, écrit en grand, et le bouton de réservation.

## Typographie
Lue dans le CSS : une seule famille, **GT Ultra Median** Regular (auto-hébergée), un serif à contraste doux. Titre du hero 69,2 px ordinateur / 40,4 px téléphone, interlignage 0,9, interlettrage -0,05 em, casse normale ; corps 23,8 px ordinateur / 16,1 px téléphone. Le H1 réel est « Since 1854 » (15,9 px). Rare : un serif utilisé pour tout, y compris le corps à 24 px, avec des titres très serrés.

## Couleur et matière
Fond `#FDFDFD`, texte `#161513`, doré `#EBBF7D` (boutons), crème `#F2E9CF`, anthracite `#39393B` (section histoire), orange `#FF4C24` ponctuel (×7). Photos réelles en lumière de fin de journée : maison, sous-bois, salle dressée, détails de table, cuisine (poireaux).

## Mouvement
GSAP avec courbe personnalisée **« osmo »** (×4, nom de courbe personnalisée lu dans le JS), `power3.out`, `power4.out` ; CSS `cubic-bezier(.625,.05,0,1)` ×10 sur `transform .6s/.8s` et sur l'ouverture des questions (`grid-template-rows .6s`, technique de la hauteur auto). Lenis, Barba. Les flèches des cartes formules glissent au survol.

## Le geste signature
La FAQ qui répond aux questions de terrain qu'on pose au téléphone (parking, toilettes, taxi, musique forte, allergies), placée juste avant le pied. Chez nous : `Faq/accordion` existe ; le geste est éditorial : exiger dans `docs/BRIEF.md` 6 à 10 questions logistiques réelles du client. Animation en CSS pur (`<details name>` + `interpolate-size`, A5).

## Ce qu'on garde / ce qu'on refuse
Garde : un premier écran 100 % texte qui dit tout ce qu'on peut faire sur place, la photo juste après ; les formules en 3 cartes avec ce qu'elles contiennent ; la FAQ logistique ; les horaires écrits en phrase quand ils sont irréguliers ; le nom en pleine largeur en pied.
Refuse : « Since 1854 » en pastille entre deux points (badge de date, GOUT § 2) ; trois cartes de formules seulement parce que c'est trois (vérifier le nombre réel du client, GOUT § 2) ; Barba + Lenis pour un site de 9 sections.
