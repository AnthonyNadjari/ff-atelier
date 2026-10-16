# Meyers — https://meyers.dk
Groupe culinaire de Copenhague (Danemark) : restaurants, boulangeries, cantines d'entreprise, traiteur, cours de cuisine, livres de recettes (rubriques lues dans la nav). Plus gros qu'un artisan, retenu pour sa nav et son cadre. Awwwards Honorable Mention du 19 avril 2026 (awwwards.com/sites/meyers). Nuxt (`/_nuxt/`), aucune librairie d'animation repérée.

## Squelette
**Navigation à deux étages par public** : bande brun foncé en haut avec un onglet beige « Mit Meyers » (compte), puis les univers (Restauranter & bagerier, Foodservice, Detail, Projekter & rådgivning, Eventkalender) et à droite « Køb gavekort » (carte cadeau) / « Kundeservice » ; deuxième ligne propre à l'univers courant (Kantine, Frokostordning, Catering & events, Madkurser & teambuilding, Opskrifter) avec le logo à droite. Téléphone : « Menu » dans un carré beige + logo. **Toute la page est posée dans un cadre** (`.frame.frame--noTop`, marge beige autour du contenu). Ordre : photo d'assiette plein cadre avec titre géant (la sortie d'un livre) → « Det, vi arbejder med lige nu » → recettes en cartes avec étiquettes de saison → offre entreprises (3 cartes à bandeau couleur) → restaurants → cours (Bagekurser, Madhåndværk, Verdenskøkkener) → engagement → Instagram → pied à 3 colonnes + newsletter + logo.
En 3 secondes : une assiette en très gros plan, un titre géant bicolore.

## Typographie
Lues dans le CSS : **Meyer Grand** Bold et Light (police de marque, fichiers `MeyerGrandBold`/`Light` dans `/_nuxt/`), H1 128 px ordinateur / 33,6 px téléphone, graisse 700, interlignage 0,75, interlettrage -0,02 em, capitales, première ligne en ocre, la suite en crème. Graphik, Hatton, Dahlia, Merlod Norme déclarées (sous-marques : `--font-restaurant`). Rare : une police dessinée pour la marque, ronde et grasse, avec un Y et un Ø caractéristiques.

## Couleur et matière
Fond beige `#D6CEB4` (`rgb(214,206,180)`), brun `#291D1A` (texte, bandeau), ocre `#BF8F2D`, crème `#F4F2E0` / `#E5E0CA`, bordeaux `#702B1D`, olive `#484C38`. Photos réelles très appétissantes, plongées serrées sur les assiettes, cuisiniers et boulangers au travail, verger.

## Mouvement
CSS seulement : `@keyframes hero-media-zoom-in-load` 1,75 s `cubic-bezier(.75,0,.2,1)` (l'image du hero se resserre au chargement), `hero-word-reveal` 0,75 s `cubic-bezier(.65,0,.35,1)` (mots du titre), `sticky-bar-entrance` 1,25 s. Courbe dominante `cubic-bezier(.65,0,.35,1)` ×18. `scroll-snap` ×13 pour les carrousels de cartes.

## Le geste signature
Le site entier posé dans un cadre de couleur, comme une page de livre de cuisine avec sa marge : la marge devient l'identité. Chez nous : coquille `src/shells/` (nouvelle, « cadre ») avec `padding: var(--s2)` et `background: var(--surface)` autour d'un `main` à fond `--bg`, `border-radius: 0` ; CSS pur, compatible avec toutes les sections.

## Ce qu'on garde / ce qu'on refuse
Garde : la nav à deux niveaux quand le client a deux publics (particuliers / entreprises) ; « Carte cadeau » en haut à droite ; le cadre de page ; les étiquettes de saison sur les recettes (pour un traiteur ou un boulanger).
Refuse : H1 en capitales sur photo chargée, lisibilité limite (GOUT § 1) ; quatre polices de sous-marques chargées ; le zoom d'entrée de 1,75 s (une animation d'interface reste sous 300 ms hors feu d'artifice, GOUT § 8).
