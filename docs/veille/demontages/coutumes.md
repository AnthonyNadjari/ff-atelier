# Coutumes — https://coutumes.com/
Bijoux pour homme en argent 925 et plaqué or, marque française indépendante (site en français, `lang="fr"`, boutique et « Notre histoire » liées depuis l'accueil). Awwwards Honorable Mention du 5 septembre 2026 (awwwards.com/sites/coutumes). Shopify (thème Tailwind maison), avis Klaviyo.

## Squelette
Nav transparente sur la photo, une ligne : logo texte à gauche, Bijoux / Accessoires / Personnaliser / À propos, puis Recherche / Magazine / FR-GBP / Panier (0) ; téléphone : burger, loupe, logo centré, panier. Ordre : **diptyque plein écran** (à gauche un homme dans une rue haussmannienne, à droite un gros plan de main avec la bague sur une casquette rouge) et « Ligne Baguette » en grand jaune à cheval sur la couture → paragraphe éditorial centré en serif → mosaïque de 4 tuiles plein cadre (Bracelets, Colliers, Bagues, Pendentifs) avec le nom en capitales condensées jaunes → mosaïque Boutique / Notre histoire → bande de réassurance (retours 30 jours, livraison offerte dès 150 €, garantie 2 ans, paiement en 3 fois) → pied jaune avec le mot « COUTUMES » sur toute la largeur. Le H1 (« Coutumes, bijoux masculins en argent 925… ») est caché à 16 px (`top: -1`), réservé au référencement. Pop-up « Livraison offerte » à l'ouverture.
En 3 secondes : un visage, une main, le nom de la ligne.

## Typographie
Lues dans le CSS (`@font-face`, 205TF) : titres **Plaak** (coupes 43 Pradel Bold et 46 Ney Bold), capitales condensées, « Ligne Baguette » à 172,8 px ordinateur / 89,7 px téléphone, interlignage 0,8, interlettrage -0,021 em ; texte en **Exposure** (205TF, fichier variable `205TF-Exposure-VAR.woff2`) avec un axe propriétaire réglé dans le corps : `font-variation-settings: "expo" -32`. Sur ordinateur à pointeur fin, le paragraphe éditorial passe en `Exposure Var` (`.c-text-var`, `data-scroll-item`). DM Serif Display et Noto Serif Display déclarées (widgets tiers). Rare : un condensé très haut contre un serif dont l'axe « exposition » est réglé à la main.

## Couleur et matière
Fond blanc / crème `#EDE9DF` (bordures Tailwind) et `rgb(248,246,242)`, texte noir, **jaune `#F9AF26`** seul accent (titres sur photo, pied de page). Photos réelles, mode éditoriale : rue de Paris, gros plans de mains, enseigne lumineuse de la boutique en vertical. Pas de texture.

## Mouvement
Pas de GSAP ni Lenis ; Swiper. Courbes lues : `cubic-bezier(.4,0,.2,1)` ×19, `cubic-bezier(.25,1,.5,1)` ×6, `transform .6s cubic-bezier(.77,0,.175,1)`. Le texte en Exposure Var est piloté au défilement sur ordinateur seulement (classe et attribut lus, valeurs d'axe animées non lues).

## Le geste signature
Le diptyque : deux photos côte à côte (l'ambiance, le geste avec l'objet) et le titre posé sur la couture, à cheval sur les deux. Chez nous : variante de hero `Hero/diptyque` (grille 2 colonnes `1fr 1fr`, titre en `position: absolute` centré sur la couture, une seule colonne empilée sur téléphone avec le titre entre les deux) ; CSS pur, sans animation.

## Ce qu'on garde / ce qu'on refuse
Garde : le diptyque ambiance + détail ; un seul accent fort réservé aux titres sur photo ; la réassurance factuelle en bande (retours, livraison, garantie) quand le client a ces conditions ; le nom en pleine largeur dans le pied.
Refuse : le H1 caché à 16 px (titre visible ≠ titre lu par Google) ; le pop-up d'inscription à l'ouverture qui couvre la page à chaque écran de la planche ; titres jaunes sur photo claire, contraste faible (GOUT § 1, lisibilité).
