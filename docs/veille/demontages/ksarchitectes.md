# KS Architectes — https://ks-architectes.be/
Bureau d'architecture spécialisé en régularisation d'infractions urbanistiques, rue des Dauphins, 1080 Bruxelles (Belgique), « depuis 2015 » (texte du site), site en français. Awwwards Honorable Mention du 22 février 2026 (awwwards.com/sites/ks-architectes). « Made with love by » Akis (akis.studio, pied de page lu dans le HTML), Tailwind, Lenis.

## Squelette
Nav fixe blanche sur une ligne : logo (éclair + nom) à gauche ; Infraction urbanistique / **Nos régularisations avec un compteur « 99+ »** / À propos / Résidentiel au centre ; **« Situation irrégulière? »** souligné + bouton noir « Contactez-nous » à droite. Ordre : H1 (« Bureau d'architecture spécialisé en régularisation urbanistique à Bruxelles ») + deux mots-clés en capitales (Infraction urbanistique, Résidentiel professionnel) → photo panoramique de façades bruxelloises → « Depuis 2015… » → « 11 ans d'expérience » (chiffres en rouleau) → mots-clés en tuiles grises (Régularisations, Communes bruxelloises, Architectes) → « La régularisation urbanistique au cœur de nos fonctions » → **réalisations classées par commune et par type d'infraction** (Evere : modification de la façade ; Molenbeek-Saint-Jean : division maison ; Watermael-Boitsfort : modification interne ; Ganshoren : changement d'affectation) → projets résidentiels → à propos (deux fondateurs nommés) → FAQ (Qu'est-ce qu'une infraction urbanistique ? Les plus fréquentes ? Que risque-t-on ? Étapes ? Délais ?) → « Ne prenez aucun risque… » → pied : « Votre bien est en infraction urbanistique ? », bouton WhatsApp avec le numéro, adresse, nom en pleine largeur.
En 3 secondes : la spécialité, la ville, une rangée de façades, « Situation irrégulière ? ».

## Typographie
Lue dans le CSS : **Switzer** Regular/Medium + italiques (fichiers `/fonts/Switzer-*.woff2`), une seule famille. H1 45,2 px ordinateur / 26,9 px téléphone, graisse 500, interlignage 1, casse normale ; corps 16 px. Libellés en capitales. Rien de rare ; la netteté vient de la grille et du blanc.

## Couleur et matière
Fond blanc, gris `#E6E6E6` / `#F2F2F2` (tuiles), texte quasi noir en `oklch(0.129 0.042 264.695)`, gris `#697077`, brun doré `#A2845E` (pastille 99+), orange `#ED731A` ponctuel. Photos de façades et d'intérieurs en lumière de plein jour ; le panorama du hero est très régulier (origine non lue).

## Mouvement
Lenis. Compteur « 11 ans d'expérience » : colonnes de chiffres 0-9 empilées qui défilent jusqu'au bon chiffre (lu dans le texte de la section : « 0 1 2 3 4 5 6 7 8 9 0 1 2… »). Tailwind : `cubic-bezier(.4,0,.2,1)` 0,3 s, `cubic-bezier(.33,1,.68,1)` sur les transformations, FAQ en `grid-template-rows .3s`. Rien d'épinglé.

## Le geste signature
Les réalisations rangées par commune et par type d'infraction : le visiteur de Ganshoren qui a changé l'affectation de son rez-de-chaussée se reconnaît en une ligne. Chez nous : bloc sur mesure `Realisations` ou variante `Zones/list` enrichie, chaque entrée = commune + nature du chantier + photo ; CSS pur ; réutilisable pour un couvreur, un électricien, un diagnostiqueur (« Saint-Maur : mise aux normes tableau »).

## Ce qu'on garde / ce qu'on refuse
Garde : une niche nommée dans le H1 avec la ville ; le lien « Situation irrégulière ? » qui parle au problème du client ; la FAQ juridique concrète (risques, délais, étapes) ; l'index commune + type de travaux.
Refuse : « 11 ans d'expérience » calculé et animé en rouleau (GOUT § 2, « X ans d'expérience ») ; la pastille « 99+ » dans la nav (badge chiffré flou) ; capitales en libellés (GOUT § 2) ; des chiffres de compteur sans source.
