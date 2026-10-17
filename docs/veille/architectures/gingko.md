# Gingko (Karine Goxes) — architecture « histoire en défilement horizontal, comme un carnet de croquis »

- Source : https://www.gingko.pro/ ; pages intérieures lues : `/realisations.html`, `/fr/realisation/paysage-11.html` (démontées le 17 oct 2026). Trouvé dans la liste « 20 Horizontal Scroll Websites » de reallygooddesigns.com.
- Métier : conceptrice paysagère indépendante, Boisseron (Hérault), chantiers dans l'Hérault et le Gard. Site fait par l'agence troa.fr.
- Mesures : `gingko-demontage.md`, `.json`, `-style.json`, captures `captures/gingko-*` ; défilement horizontal filmé à la molette : `captures/gingko-roue.jpg`.

## Le modèle en une phrase

À l'ordinateur, la page ne descend pas : la molette fait glisser vers la gauche une longue bande de 7 811 px (5,4 largeurs d'écran) où se suivent, comme dans un carnet ouvert, les chapitres de l'activité (présentation, idée, réalisations, méthode, partenaires, contact), avec un menu fixe à gauche ; au téléphone la même bande devient une page verticale.

## Schéma de l'accueil (bande horizontale, ordinateur ; 7,4 écrans verticaux au téléphone)

```
[rail fixe à gauche, 150 px : logo dessiné en haut | MENU en bas]
→ [planche botanique (gravure de ginkgo) | nom de marque en contour géant | nom de la paysagiste sur un coup de pinceau
   | h1 « conceptrice paysagère à Montpellier dessine pour vous des aménagements extérieurs » | photo de jardin | notes manuscrites]
→ [chapitre « Faire germer vos idées » : titre en capitales fines géantes | photo de réalisation avec étiquette « Paysage, Nîmes, Visiter le jardin » | 2 phrases + « Un projet ? »]
→ [dessin au trait d'une branche, pleine hauteur]
→ [liste verticale des réalisations (Paysage, Arizona, Cocon…) + mot « Réalisations » écrit à la verticale]
→ [chapitre « Jardins créatifs et autonomes » : photo | paragraphe de méthode | lien « Les jardins »]
→ [chapitre « Autour de moi » : les artisans partenaires (céramiste, ferronnier, éclairagiste, menuisier, architecte, pisciniste, pépiniériste, maçon, jardinier)]
→ [Contact : nom, zone (« Hérault et Gard »), adresse, téléphone, e-mail, réseaux]
```

## Schéma d'une page intérieure

`/realisations.html` (bande horizontale, 6 298 px) : `[titre « Réalisations » + définition de dictionnaire] → [une carte par jardin : photo portrait 4:5, nom, commune, « Visiter »] × 9 → [contact]`.
`/fr/realisation/paysage-11.html` (7,9 écrans au téléphone) : `[titre géant + photo] → [titre de projet + texte manuscrit] → [fiche : Lieu, Date, Surface (950 m²)] → [carrousel de photos] → [« Autres réalisations » : cartes] → [contact]`.

## Navigation, contact, preuves, téléphone

- Pages : accueil, Réalisations, une page par jardin (9), Actualités, Contact, mentions. Menu en surcouche (« Menu / Fermer »), liens numérotés 01 à 04 avec les jardins en sous-liste.
- Contact : en fin de bande sur chaque page (téléphone cliquable, e-mail, adresse) et page dédiée ; aucun formulaire.
- Preuves : les réalisations elles-mêmes (lieu, date, surface) et le réseau d'artisans partenaires nommé ; aucun avis.
- Téléphone : plus de bande horizontale ; tout s'empile verticalement (7,4 écrans), photos pleine largeur, en-tête fixe de 91 px (logo, burger).

## Rythme, texte et images, profondeur

Beaucoup de texte au premier écran (284 mots mesurés, notes manuscrites comprises) mais éclaté en petits blocs dispersés comme sur une planche. Profondeur réelle : gravure, photo, nom sur coup de pinceau, texte et dessins au trait se chevauchent sur plusieurs plans ; vitesses différentes au défilement (`data-speed` sur 11 éléments).

## Style (à réappliquer tel quel)

- **Polices** (trois voix) : titres *Caviar Dreams* (sans géométrique fine) 700 en capitales, h1 66 px / 45 px téléphone, h2 80 / 45 px, interlignage 1,18, parfois en contour seul ; texte courant et liens en *Baskerville* **italique** 22 px (ordinateur ET téléphone), interlignage 1,08 à 1,18 ; notes en manuscrite *Quentin*. h3 Baskerville 30 px romain.
- **Couleurs** (rôles) : une seule couleur, olive doré `#8b7a27` = texte (86 % des caractères) et aplats ; blanc `#ffffff` et papier écru (texture) en fond ; aucune autre couleur que celles des photos. Contraste du texte olive sur blanc : 4,28:1 (juste).
- **Espacements** : blocs posés librement sur la bande, colonnes de texte étroites (310 à 560 px, 28 à 51 caractères) ; rail gauche de 150 px.
- **Rayons et bordures** : aucun rayon ; filets de 1 px olive (souvent en `box-shadow` intérieure d'un pixel sous les liens : le soulignement est un filet).
- **Ombres** : aucune ombre portée.
- **Photos** : portraits 4:5 (15 sur 23), 20 à 35 % de la largeur, posées sans cadre, chevauchées par du texte ou des étiquettes ; une gravure botanique ancienne et des dessins au trait en guise d'illustrations.
- **Boutons et liens** : pas de bouton ; liens texte italiques avec un petit pictogramme (crayon, œil) et un filet dessous ; survol : couleur et filet en 0,25 s.
- **Icônes** : 13 petits pictogrammes dessinés (crayon, œil, flèche).
- **Animations** : courbe `cubic-bezier(0.55, 0, 0.1, 1)` en 0,25 et 0,5 s ; parallaxe par couches pendant le glissement ; une animation lente en boucle (30 s).
- **Textures** : papier écru et coup de pinceau sous le nom ; dessins à l'encre.

## Ce qui le rend différent de notre déroulé

Le site se feuillette de gauche à droite, chapitre par chapitre, au lieu d'empiler des blocs ; l'identité vient d'un carnet de paysagiste (gravure, croquis, manuscrit), et le réseau d'artisans partenaires remplace les avis.

## Ce qu'il faudrait à l'usine

- **Nouvelle coquille** `src/shells/carnet.astro` : bande horizontale à l'ordinateur (≥ 64rem) sur tout l'accueil, rail fixe à gauche, verticale au téléphone. Le moteur a déjà `data-horizontal` (piste horizontale pilotée par le défilement vertical, scrub) pour UNE section ; il faut l'étendre à la page entière, avec `prefers-reduced-motion` = page verticale.
- **Pages réalisation** : une page par réalisation avec lieu, date, surface (`proof.gallery` a déjà `place`, `kind`, `size`, `client` ; manque une page par réalisation et plusieurs photos par réalisation).
- **Section** « autour de moi » : artisans partenaires (nom de métier, lien) ; aucun champ aujourd'hui.
- Illustrations : seulement si le client a des croquis, plans ou dessins à lui (on n'invente pas une gravure).

Coût : **fort** (coquille horizontale complète, pages réalisation, et un défilement hors norme à tester sur iPhone).

## Convient à (selon les données du client)

Métier de **conception** avec **des réalisations nommées** (6 et plus, avec lieu) et **des croquis ou plans** : paysagiste, architecte d'intérieur, menuisier-agenceur, ferronnier d'art, céramiste. Inadapté à l'urgence, aux clients pressés de se faire appeler, et à ceux qui n'ont qu'une poignée de photos.

## Signes IA à NE PAS reprendre (GOUT § 2)

- **Numérotation décorative** 01 / 02 / 03 devant les chapitres et dans le menu.
- Texte courant en **italique** partout (Baskerville italique 22 px) : garder un romain lisible pour le texte, l'italique pour une note.
- Le nom en **contour géant** et la définition de dictionnaire en tête de page (« Réalisations, nom féminin ») : effets de manière.
- Contraste olive sur blanc à 4,28:1 : sous le seuil pour du texte de 22 px non gras, à foncer.
- Bannière cookies qui couvre le bas de l'écran pendant toute la visite.
