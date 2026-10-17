# Du Pain et des Idées — architecture « longue page éditoriale, une idée par écran »

- Source : https://www.dupainetdesidees.com/ ; pages intérieures lues : `/boulangerie`, `/philosophie` (démontées le 17 oct 2026).
- Métier : boulangerie artisanale et table, 34 rue Yves Toudic, Paris 10e (Christophe Vasseur, lieu classé de 1875).
- Mesures : `du-pain-et-des-idees-demontage.md`, `.json`, `-style.json`, captures `captures/du-pain-et-des-idees-*`.

## Le modèle en une phrase

Des pages longues composées comme un livre d'art : chaque bloc fait exactement un écran (sections de 100 vh, 200 px de marge haute et basse), avec un seul objet par écran (un paragraphe de 50 caractères de large, une photo portrait décalée, une citation sur un aplat bleu pâle) ; l'accueil ouvre trois portes (la Boulangerie, la Table, l'Atelier) qui sont des pages bâties de la même façon.

## Schéma de l'accueil (12,7 écrans ordinateur, 13,8 téléphone)

```
[vidéo plein écran sombre ; monogramme ; h1 = « Boulangerie artisanale et table autour du four au 34 rue… Paris 10e » ; bouton « Découvrir »]
[écran : paragraphe d'intro à gauche (500 px) | photo portrait de la devanture à droite] + lien « Découvrir nos établissements »
[écran : citation centrée, grande, sur aplat bleu pâle #d8e8ef]
[écran : paragraphe philosophie à gauche | photo portrait à droite] + lien
[écran : deux photos décalées, sans texte (une grande à gauche, une petite plus bas à droite)]
[écran : « Nos établissements » : photo à gauche | texte + trois liens géants à filets (La Boulangerie, La Table, L'Atelier)]
[écran : photo très large pleine colonne, sans texte]
[écran : citation du fondateur à gauche | portrait à droite]
[écran : photo à gauche | texte « atelier du mercredi » + « Réservez votre atelier »]
[écran : « Le livre » titre + texte | photo du livre]
[écran : Contact (adresse, téléphone, carte) sur aplat bleu-gris]
[demi-écran : newsletter sur aplat #87a0ad]
[pied : « Nos établissements » sur aplat bleu pâle]
```

## Schéma d'une page intérieure (`/boulangerie`, 10,5 écrans)

```
[en-tête sombre d'un écran : « La Boulangerie »]
[écran : « Un lieu classé » texte | photo] → [écran : 2 photos décalées] → [écran : « Nos spécialités » texte + 4 photos]
[écran : photo seule] → [écran : texte] → [écran : « Nos récompenses »] → [écran : texte]
[écran : contact de CETTE adresse (horaires, téléphone)] → [newsletter] → [pied]
```
`/philosophie` (8,5 écrans) : même grammaire, avec une citation sur aplat bleu au deuxième écran.

## Navigation, contact, preuves, téléphone

- Pages : accueil, La Boulangerie, La Table, L'Atelier, Philosophie, Presse, La carte, FR/EN. Nav collante de 80 px (le nom en petites capitales au centre, « Menu » à droite) qui ouvre un menu plein écran aux liens en grand (survol : soulignement épais qui s'écarte).
- Contact : un écran « Contact » vers la fin de chaque page (adresse, téléphone cliquable, lien carte) ; réservation de l'atelier vers une plateforme externe.
- Preuves : récompenses et presse sur des pages et écrans dédiés, la citation du fondateur, le lieu classé ; aucune note Google.
- Téléphone : même suite d'écrans, photos portrait pleine largeur (60 à 95 %), texte sur 350 px (~39 caractères), marges réduites à 120 px ; la nav reste collée en haut.

## Rythme, texte et images, profondeur

Aéré et lent : 60 à 100 mots par écran, jamais plus. Images et texte se partagent l'écran à égalité, la photo souvent seule. Profondeur faible (aplats, pas de superposition) : la richesse vient de la mise en page asymétrique, des photos portrait et de la typographie de livre.

## Style (à réappliquer tel quel)

- **Polices** : texte et titres en *Cedrat* (serif de texte, Webflow, licence à vérifier) graisse 300 ; h1 28 px / 24 px téléphone, interlignage 1,31 ; corps **20 px** / 18 px, interlignage 1,6 ; liens de menu et boutons 16 px ; liens d'établissements 30 px. h2 en *commuters-sans* 12 px capitales espacées +3 px ; h3 en *Hanken Grotesk* 14 px 600.
- **Couleurs** (rôles) : papier `#faf9f7` (70 % des surfaces) ; encre `#26221f` (97 % du texte, aussi fond de l'en-tête vidéo) ; bleu pâle `#d8e8ef` = citations et pied ; bleu très pâle `#eaf1f3` = écran contact ; bleu-gris `#87a0ad` = newsletter. Contraste 15:1.
- **Espacements** : sections de 100 vh avec 200 px en haut et en bas (ordinateur), 120 px (téléphone) ; paragraphe de 500 px (~50 caractères) aligné à gauche, jamais centré sauf la citation.
- **Rayons et bordures** : aucun rayon sur les photos ; bouton à 5 px ; filets de 1 px encre au-dessus et au-dessous des liens d'établissements (liste à filets).
- **Ombres** : aucune.
- **Photos** : portraits 4:5 occupant 20 à 35 % de la largeur, posés à droite ou décalés en hauteur ; une photo très large par page ; sujets : mains, farine, pâte, devanture, salle ; aucun filtre.
- **Boutons et liens** : liens texte sans soulignement, 16 px ; « Découvrir » en bouton fantôme bordé de 1 px, 12 px capitales ; liens d'établissements en grand avec filets.
- **Icônes** : aucune (monogramme seul).
- **Animations** : GSAP + ScrollTrigger (apparitions au défilement), transitions 0,3 s `ease` sur la couleur et le transform ; vidéo d'en-tête en boucle avec bouton pause.
- **Textures** : aucune ; la matière est dans les photos.

## Ce qui le rend différent de notre déroulé

Pas de cartes, pas de grille de services, pas d'avis : le site se lit comme un livre, un écran = une idée. Les « services » sont trois adresses-portes, chacune avec sa page longue. Notre déroulé empile des blocs denses de hauteurs variables.

## Ce qu'il faudrait à l'usine

- **Rien de neuf côté coquille** : `flow` suffit, ou `magazine` pour les décalages ; il faut surtout **une famille de sections « écran »** : `about/ecran-texte-photo` (paragraphe 50 caractères + portrait décalé, 100 vh), `about/citation` (citation sur aplat), `proof/photos-decalees` (deux photos sans texte), `services/liste-a-filets` (titres géants à filets vers les pages services).
- **Pages services** déjà là (`/services/<slug>`) : il faut un gabarit de page service à la même grammaire (écrans successifs + contact propre à la page).
- Une **direction** « livre » (serif de texte léger 20 px, papier, encre, un bleu pâle) si aucune existante ne colle.

Coût : **moyen** (4 sections + un gabarit de page service, pas de nouvelle coquille).

## Convient à (selon les données du client)

Artisan avec **une histoire, un lieu et de belles photos verticales** (au moins 10) et assez de texte vrai pour 6 à 10 écrans : boulanger, pâtissier, chocolatier, maison ancienne, artisan d'art, restaurant d'auteur, client qui a plusieurs adresses ou activités (boutique, table, atelier). Inadapté à l'urgence et aux clients sans texte.

## Signes IA à NE PAS reprendre (GOUT § 2)

- **h1 en serif italique** (mesuré : Cedrat 300 italique) : garder le serif, pas l'italique.
- h2 en **capitales espacées** de 12 px (+3 px) au-dessus des blocs : c'est l'eyebrow refusé.
- Vidéo plein écran en premier écran (iPhone en économie d'énergie la bloque) : une photo fixe à la place.
- Citation d'auteur célèbre en exergue (Pagnol) : à n'utiliser que si le client la porte vraiment.
