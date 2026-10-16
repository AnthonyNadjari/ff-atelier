# Tout Bien — https://toutbienpils.com/
Petite marque de bière belge (pils, rouge, 0,0 %) (texte « Tout Bien was born out of a naive idea to disrupt the pils market. We don't have a 100-year old history or family crest »), site en anglais, prix en euros. Awwwards Honorable Mention du 15 mai 2026 (awwwards.com/sites/tout-bien-pils). Shopify, polices Adobe Fonts (kit `bhj0iau`).

## Squelette
**Écran d'âge** à l'arrivée : « Hold on my friend / We have to ask, how old are you? », boutons « I'm 18+ » / « I'll wait », et **trois personnes allongées sur le ventre, détourées** (vraisemblablement l’équipe, non confirmé) dans la fenêtre. Puis : logo en pastille crème à gauche (mascotte cœur au milieu du nom), « Shop » + « Menu » dans une pilule rouge à droite. Ordre : vidéo plein écran (un serveur essuie une table, des bouteilles), « The most average beer in the world » + « The belgianest of beers » + Our beers / Shop merch → carrousel des bières avec titre géant de fond (« The piss of angels ») → « Let's shake things up a bit » (histoire) → merch (veste de ski en collaboration, prix) → **« 11 million beers » : barre de progression vers l'objectif** (« One for every Belgian… by the end of 2027 », barre à `6.526.937` sur `11.000.000` sur la planche, mascotte au bout de la barre) → « Look ma, we made this » (photos et vidéos de communauté) → « Wanna work with us? » (bars, événements : Become a partner / On tap & in stores) → pied avec le logo pleine largeur.
En 3 secondes : trois copains, une question d'âge, une blague.

## Typographie
Lues dans le CSS : titres **Obviously** (Adobe Fonts : `obviously-variable` 200-900, `obviously-narrow`, coupes italiques 600-900), H1 visuel 98,4 px ordinateur / 33,4 px téléphone, capitales, italique très gras et très large ; **New Spirit** (serif) déclarée ; corps **GoodSans** 16 px. Le vrai `<h1>` est vide (sonde : texte « »). Rare : un italique extra-large utilisé comme une voix qui crie, cohérent avec le ton.

## Couleur et matière
Rouge `#D61022` (×57) et `#FF0017`, bordeaux `#9E0C1E`, crème `#FFF9F2` (fond) et `#FFF1E0`, bleu pétrole `#053F55` ponctuel, jaune `#F7CA00`. Vidéos et photos réelles (plage, terrasses, fondateurs, fans), mascotte dessinée, chérubins au trait derrière les produits.

## Mouvement
Pas de GSAP ni Lenis. CSS lu : `@keyframes sway 1.2s ease-in-out` (balancement), `fadeInOut 1.2s`, `slideIn .6s cubic-bezier(0,0,.3,1)`, `transition: all .2s ease` ×23. Swiper. Barre de progression de l'objectif (largeur `0.3s cubic-bezier(.52,0,.61,.99)`). Vidéos MP4 en autoplay.

## Le geste signature
La barre d'objectif publique (« 11 millions de canettes d'ici fin 2027, une par Belge », chiffre atteint affiché) : la marque fait participer le visiteur à un but chiffré. Chez nous : `data-count-bar` existe déjà ; à réserver à un vrai objectif fourni et daté par le client (cagnotte de rénovation de four, nombre d'arbres plantés), avec la date du relevé à côté.

## Ce qu'on garde / ce qu'on refuse
Garde : l'écran d'âge obligatoire (alcool) fait avec des visages de l’équipe ; le ton qui assume la petite taille (« pas de blason familial ») ; la barre d'objectif datée ; « Wanna work with us? » pour les professionnels.
Refuse : pilules partout (`border-radius` 3 à 6 rem, GOUT § 2) ; un `<h1>` vide ; « the most average beer » en capitales italiques sur vidéo, lisibilité (GOUT § 1) ; vidéo de hero (iOS économie d'énergie) ; la fenêtre d'inscription qui s'ouvre en bas de page.
