# Mathilde De Chiara — architecture « portfolio : l'accueil est l'index des projets, avec deux réglages (filtre, mode d'affichage) »

- Source : https://www.mathildedechiara.com/fr ; page intérieure lue : https://www.mathildedechiara.com/fr/a-propos (démontées le 17 oct 2026 ; la page d'un projet n'a pas pu être atteinte par l'outil : application en une page sans lien `<a>`, clic et double clic sur l'image restés sans effet dans Chrome sans tête). Fiche de goût antérieure : `docs/veille/demontages/mathildedechiara.md`.
- Métier : designer global et architecte d'intérieur indépendante, Bayonne / Pays basque (30 projets : intérieurs, boutiques, mobilier, photographie).
- Mesures : `mathilde-de-chiara-demontage.md`, `.json`, `-style.json` (vides : le contenu est dessiné dans un `<canvas>` WebGL, rien n'est lisible dans le DOM au moment de la mesure), captures `captures/mathilde-de-chiara-*`. Polices et couleurs reprises de la fiche de goût (lues dans le CSS).

## Le modèle en une phrase

Pas de présentation, pas de section : l'écran entier est la collection de projets (une colonne d'images au centre en mode « Slider », ou toutes les vignettes posées en losange en mode « Grid »), avec en marge deux réglages permanents (« Typologie de projet » : 4 filtres ; « Mode d'affichage » : Slider | Grid), un compteur « 01 / 30 » et un seul lien de page, « À propos », qui porte le contact.

## Schéma de l'accueil (1 écran, rien ne descend : la colonne d'images défile dedans)

```
[marge gauche : compteur « 01 / 30 » en serif italique sur un filet | en bas : typologie du projet courant en petites capitales]
[CENTRE : colonne d'images de projets (WebGL), une image nette au milieu, les voisines au-dessus et au-dessous]
   (mode Grid : les 30 vignettes en mosaïque tournée de 45°, en losange)
[marge droite : « Typologie de projet » (Toutes | Architecture d'intérieur & résidentiel | Retail & tertiaire | Mobilier & scénographie | Photographie & communication)
               | filet + « À propos » | « Mode d'affichage » : Slider / Grid]
```

## Schéma d'une page intérieure (`/fr/a-propos`, un écran ordinateur)

```
[« Retour » en haut à gauche]
[colonne gauche : portrait de la designer | « Contact » : e-mail, ville, Instagram, LinkedIn, Télécharger mon CV]
[colonne droite : nom en grand serif | « Designer Global » | « Manifeste » + paragraphe | « Mon approche » + paragraphe (diplôme, années, collaborations)]
```
La page d'un projet : à juger (non atteinte).

## Navigation, contact, preuves, téléphone

- Pages : accueil-index, À propos, une vue par projet (30) ; FR/EN. Aucune nav classique : les réglages et le lien « À propos » en marge.
- Contact : seulement sur « À propos » (e-mail cliquable, ville, CV) ; aucun téléphone.
- Preuves : les 30 projets eux-mêmes et le compteur ; diplôme et collaborations nommées sur À propos ; aucun avis.
- Téléphone : même index ; en mode Grid, les vignettes en losange (fiche de goût, capture téléphone) ; interface à 10-12 px.

## Rythme, texte et images, profondeur

Presque zéro texte à l'accueil (5 mots lus dans le DOM), 100 % image. Profondeur par l'inertie et la déformation des images au défilement (WebGL) et par le passage animé d'un mode d'affichage à l'autre (0,55 s).

## Style (à réappliquer tel quel)

- **Polices** : *PP Editorial New* (serif de titrage, Ultralight 200, Regular 400, Extrabold 800 et italiques) pour le compteur, les titres de réglages et les titres d'À propos (nom ~40 px à juger, « Manifeste » ~24 px à juger) ; interface en *Helvetica Neue* 10 à 12 px (`clamp(10px, .7vw, 12px)`), libellés en capitales espacées. Toute l'interface est minuscule pour laisser l'écran aux images.
- **Couleurs** (rôles) : papier `#f7f5f2` (100 % des surfaces) ; texte `#111111` / `#333333` ; gris `#6e6e6e` pour les filtres inactifs ; aucune couleur d'accent.
- **Espacements** : colonne d'images d'environ 300 px de large au centre (à juger) ; marges latérales larges (environ 1/3 de l'écran chacune) ; filets horizontaux reliant le compteur et « À propos » à la colonne.
- **Rayons et bordures** : aucun rayon ; filets de 1 px gris.
- **Ombres** : aucune.
- **Photos** : vignettes carrées ou 4:3 rognées, toutes à la même largeur dans la colonne ; photos d'intérieurs, vitrines, objets ; aucun filtre.
- **Boutons et liens** : aucun bouton ; réglages en texte, l'option active en gras noir, les autres en gris ; liens soulignés sur À propos.
- **Icônes** : aucune.
- **Animations** : WebGL (OGL) pour la colonne d'images ; `cubic-bezier(.22, .61, .36, 1)` 0,55 s pour le passage colonne → grille ; `opacity 0.6s ease`.
- **Textures** : aucune.

## Ce qui le rend différent de notre déroulé

L'accueil est un **outil de consultation** des réalisations, réglable par le visiteur (filtrer, changer de vue) ; tout le reste (qui, contact) tient sur une seule page à côté. Notre déroulé enterre la galerie au milieu de 6 sections.

## Ce qu'il faudrait à l'usine

- **Coquille** `src/shells/index-projets.astro` : l'accueil = `proof/gallery` en plein écran avec filtres par `kind` (le champ existe, les filtres CSS `:has()` sont prévus au geste n° 5 de l'INDEX des démontages) et bascule « défilé / grille » par deux boutons radio (CSS seul, sans WebGL) ; compteur réel ; barre d'identité avec métier + ville + téléphone (socle) que la source n'a pas.
- **Page par réalisation** (comme Gingko et Studio RHE) : photos multiples, lieu, type, surface.
- **Page À propos-contact** à deux colonnes (portrait + contact | manifeste + approche) : `about/portrait` s'en approche ; à poser en page `/a-propos`.

Coût : **moyen** (coquille sur la galerie existante + filtres CSS + pages réalisation).

## Convient à (selon les données du client)

Client dont **le travail se montre en photos nombreuses et classables** (au moins 15 réalisations, 3 à 5 types) : architecte d'intérieur, agenceur, menuisier, ébéniste, carreleur, paysagiste, photographe, tapissier, fleuriste événementiel. Inadapté à qui a peu de photos ou doit être appelé vite.

## Signes IA à NE PAS reprendre (GOUT § 2)

- Titres de réglages et compteur en **serif italique**.
- Libellés en **capitales espacées** de 10 px (illisibles au téléphone).
- Compteur « 01 / 30 » : utile s'il compte vraiment des projets ; jamais en numérotation décorative de sections.
- Aucun h1 ni métier + ville à l'arrivée (test du hero raté) ; contenu dans un `<canvas>` (invisible pour les moteurs et les lecteurs d'écran).
