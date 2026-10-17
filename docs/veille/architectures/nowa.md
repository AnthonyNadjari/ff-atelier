# Nowa — architecture « carte de visite d'un seul écran »

- Source : https://nowa.restaurant/ (démonté le 17 oct 2026). Seule autre page : `/privacy.html`.
- Métier : restaurant (Allentown, Pennsylvanie, quartier The Waterfront). Site d'avant-ouverture (« We look forward to serving you in 2025 ») encore en ligne.
- Trouvé sur One Page Love (catégorie restaurant).
- Mesures : `nowa-demontage.md`, `nowa.json`, `nowa-style.json`, captures `captures/nowa-*`.

## Le modèle en une phrase

Un seul écran qui ne défile pas : une salutation qui change avec l'heure (« Good Evening »), puis une grande photo posée en carte dans la page, avec en surimpression les quatre portes utiles (adresse, appeler, écrire, recrutement) et une phrase ; rien d'autre.

## Schéma de l'accueil (1 écran ordinateur et téléphone, `body overflow: hidden`)

```
TEMPS 1 (arrivée) : [aplat terracotta plein écran, motif géométrique fin en filigrane]
                    [« NOWA » en petites capitales en haut | « Good Evening » centré, fin, ~80 px | sceau rond en bas]
TEMPS 2 (fondu)   : [marge crème autour d'une photo plein cadre à coins arrondis 20 px, sépia]
                    [en bas à gauche : prononciation « [no•wuh] » (h1) + 2 phrases]
                    [en haut à droite : carte « Stay Informed » + bouton (formulaire en surcouche)]
                    [panneau d'infos : LOCATION adresse (lien carte) | CAREERS | CALL 610.575.NOWA | INQUIRE]
                    [ligne de pied : © | Information | Privacy ........ Instagram | Facebook]
```

Page intérieure : aucune (seule `/privacy.html`). Le modèle n'a pas de page intérieure : c'est sa nature et sa limite.

## Navigation, contact, preuves, téléphone

- Navigation : aucune nav (0 lien mesuré dans un en-tête) ; tout est dans le panneau d'infos et la ligne de pied.
- Contact : téléphone cliquable (`tel:`), adresse vers Google Maps, « Let's Talk » ouvre un formulaire en surcouche (Paperform), recrutement en lien.
- Preuves : aucune.
- Téléphone : même écran unique ; le panneau d'infos devient une carte fixe de 320 x 238 px posée en bas (à 626 px du haut), ombre douce ; la photo garde ses coins arrondis (10 px).

## Rythme, texte et images, profondeur

84 mots en tout. Une image (en fond, pas en `<img>`). Profondeur en deux plans : la photo-carte posée sur la marge crème, les panneaux posés sur la photo. Rythme : deux temps (salutation, puis la carte), pas de défilement.

## Style (à réappliquer tel quel)

- **Polices** : une seule famille, *objektiv-variable* (Adobe Fonts, grotesque géométrique), graisse 400 partout et une graisse fine pour la salutation. Salutation ~80 px ordinateur, ~64 px téléphone (à juger, non mesuré : ce n'est pas un titre) ; h1 et h2 18 px / 17 px téléphone, interlignage 1,5 ; texte 15 / 14 px ; boutons 9 px capitales ; liens de pied 10 px. Le contraste entre la salutation géante et tout le reste minuscule fait le style.
- **Couleurs** (rôles) : terracotta `#cd9574` = écran d'accueil et fond du corps ; brun nuit `#292420` = fond derrière la photo et texte sur clair ; `#1e1a17` = boutons sombres ; crème `#f3e9e1` = texte sur la photo (77 % des caractères) ; gris taupe `#90857e` = texte secondaire.
- **Espacements** : marge de ~16 px autour de la photo-carte (ordinateur) ; texte courant limité à 400 px (~53 caractères), 280 px au téléphone.
- **Rayons et bordures** : photo-carte 20 px (ordinateur), 10 px (téléphone) ; boutons 4 px ; sceau rond.
- **Ombres** : une seule, au téléphone, sous la carte d'infos (`0 0 30px` brun à 40 %).
- **Photos** : une photo plein cadre virée sépia (désaturée chaude), sujet au geste (mains, plaques de cuisson).
- **Boutons et liens** : bouton sombre rectangulaire 44 px de haut, texte 9 px capitales ; liens soulignés sur la photo ; survol = opacité 0,7.
- **Animations** : `ease-in-out` en 0,25 / 0,5 / 0,75 s ; fondu de la salutation vers la photo ; sceau qui tourne très lentement (rotation 120 s, linéaire, infinie).
- **Textures** : motif géométrique en filigrane (traits fins ton sur ton) sur l'aplat terracotta.

## Ce qui le rend différent de notre déroulé

Zéro défilement, zéro section : la page est une carte de visite. Notre déroulé fait 6 à 8 blocs empilés ; ici tout ce qui sert (adresse, appeler, écrire) tient dans un panneau sur la photo.

## Ce qu'il faudrait à l'usine

- **Nouvelle coquille** `src/shells/carte.astro` : un écran, photo du client en carte, panneau d'infos (adresse, `tel:`, porte contact, horaires du jour) posé dessus ; pages services toujours générées et listées dans le panneau (le socle GOUT § 0 exige plusieurs pages : la carte devient l'accueil d'un site court, pas tout le site).
- **Composant** : salutation selon l'heure (bonjour / bonsoir), calculée côté navigateur, avec repli statique sans JavaScript ; ou mieux, l'état « ouvert / fermé » du jour (déjà dans `src/lib/horaires.ts`).
- Rien d'autre : les données existent (`contact`, `hours`, une photo).

Coût : **faible**.

## Convient à (selon les données du client)

Client avec **peu de contenu** et **une très bonne photo** : restaurant ou bar qui vit sur Instagram, commerce qui ouvre bientôt (page d'attente), artisan d'art qui veut seulement être trouvé et appelé, deuxième adresse d'une maison connue. Mauvais choix pour un client qui a des avis, de nombreux services ou besoin de référencement par service.

## Signes IA à NE PAS reprendre (GOUT § 2)

- Le sceau rond qui tourne en continu (badge décoratif animé).
- La prononciation entre crochets comme titre (effet de manière, illisible pour les moteurs : le h1 doit dire métier + ville).
- Le formulaire de newsletter en surcouche à l'arrivée.
- Boutons et libellés en capitales minuscules espacées (9 px) : illisibles au téléphone.
