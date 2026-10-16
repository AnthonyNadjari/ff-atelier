# Artisans de Genève — https://www.artisansdegeneve.com/en
Atelier indépendant de personnalisation de montres, Genève (Suisse), « founded in 2005 » (texte du site), site en anglais avec version française. Awwwards Honorable Mention du 13 décembre 2025 (awwwards.com/sites/artisans-de-geneve). Webflow, GSAP + ScrollTrigger, Swiper, vidéos sur Bunny CDN.

## Squelette
**Première visite : une fenêtre d'avertissement juridique bloque la page** (« The Artisans legal notice » : atelier indépendant, ni affilié ni autorisé par les marques des montres qu'il modifie, usage privé seulement) avec un seul bouton « I understand ». Nav sur la vidéo, une ligne : Bespoke Projects / Service / Process à gauche, nom en capitales espacées centré (« Switzerland » dessous), Arts & Crafts / Atelier / langue / « Make a request » souligné à droite ; téléphone : nom + burger. Ordre : vidéo macro d'un cadran (aiguille sur guillochage bleu), « New Personalization: Val Viola », lien « Discover the project of Mr. A.N.I. » → « What We Create Lives Once » (vidéo d'atelier) → « A Tailor-Made Approach To Watchmaking » → « A Step-by-Step Guide » (process) → « The 7 Departments Dedicated To Your Project » → « The Artisans Behind The Craft » → projets (« Autumn Leaves, the project of Mr. L.V. ») → garanties (« TIMELAB Laboratory Report and a 7-year international warranty ») → clients en portraits noir et blanc nommés → « Begin Your Personalization » → pied (adresse, e-mail, mentions juridiques répétées).
En 3 secondes : un cadran en macro, un nom de projet, « Make a request ».

## Typographie
Lues dans le CSS (`@font-face` auto-hébergées Webflow) : titres **Victor** Light 300 (serif fin), H1 64 px ordinateur / 41,5 px téléphone, interlignage 1, interlettrage +0,02 em, casse de titre ; corps **Futura** Light/Book 20 px. Le nom « Artisans de Genève » en capitales espacées. Rare : un serif très léger à grande taille sur de la macro sombre, et un corps à 20 px en Futura Light.

## Couleur et matière
Fond `#FFFEFD`, texte `#050302` / `#1F1D1E`, bronze `#96796A` (bouton « I understand », variable `--swatch--bronze`), beige `#F0EAE3`, gris bleu `#758696`. Vidéos et photos réelles d'atelier : mains, loupes, gravure, dessins au crayon, cadrans en macro ; clients en noir et blanc.

## Mouvement
GSAP + ScrollTrigger (145 occurrences dans le HTML), `ease: "power2.out"` lu ; CSS `cubic-bezier(.165,.84,.44,1)` ×10 (`opacity .6s`), `transition-duration: 1.2s` sur certains médias, `position: sticky` ×10. Vidéos en boucle dans les grandes cartes. Fenêtre newsletter qui glisse en bas à droite.

## Le geste signature
Chaque réalisation porte le nom de la pièce et les initiales du client (« Val Viola, the project of Mr. A.N.I. ») : la discrétion devient la preuve que c'est du sur commande. Chez nous : bloc `Realisations` sur mesure ou `Proof/gallery` avec un champ `client: "M. A.N.I."` optionnel au schéma (jamais inventé, initiales fournies par le client) ; CSS pur.

## Ce qu'on garde / ce qu'on refuse
Garde : nommer les réalisations (nom + initiales) ; les garanties chiffrées et vérifiables (rapport de labo, 7 ans) ; les départements de l'atelier comme preuve de savoir-faire montré ; l'avertissement juridique franc quand le métier l'impose (réparateur indépendant, carrossier non agréé), mais en bandeau, pas en fenêtre bloquante.
Refuse : la fenêtre modale bloquante à l'arrivée ; la newsletter qui surgit en plus du bandeau cookies (trois couches sur le premier écran téléphone) ; le nom en capitales espacées (GOUT § 2) ; des portraits de clients célèbres (inapplicable et invérifiable pour nos artisans).
