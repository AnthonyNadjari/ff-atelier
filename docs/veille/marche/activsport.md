# Activ'Sport — https://www.activsport.info/
Titre « Électrostimulation à Villeurbanne | Activ'Sport, 25 min », `lang="fr"`, description « Studio d'électrostimulation au Carré de Soie, Villeurbanne. Une séance de 25 minutes par semaine, coaching individuel et suivi nutrition. Essai offert. », technologie lue : Wix (`generator` « Wix.com Website Builder ») dont tout le contenu est un **élément personnalisé** (`<as-accueil>`, un par page : `as-concept`, `as-ems`, `as-equipe`…) dessiné par JavaScript ; un balisage de secours pour les moteurs (`seoMarkup`, 10 Ko) est servi dans les données de la page. JSON-LD `SportsActivityLocation` (adresse, horaires, coordonnées) et `FAQPage`. Démontage à la main du 2026-10-19 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre et le texte sont ceux du balisage de secours, le rendu réel n'est pas mesuré.

## Squelette
Premier écran (ordre du balisage) : nav (Le concept, Qu'est-ce que l'EMS ?, L'équipe, Blog, Contactez-nous) ; h1 « Retrouvez la forme en 25 minutes / semaine avec l'EMS à Villeurbanne » ; une phrase ; bouton « Réserver ma séance offerte » + « Aucun paiement demandé » ; lien « Découvrir le concept de l'EMS » ; deux preuves « 125 avis Google, 5/5 » et « +1000 personnes accompagnées ».
Ordre : concept (3 arguments) → 6 objectifs (perdre du poids, dos…) → équipe (Baptiste, gérant et coach ; Tom, Loane, Nino) → séance type en 4 étapes numérotées → 8 avis signés (dont « Témoignage vidéo » d'Olga) → 3 arguments (« sans aucun câble », « trois personnes maximum ») → FAQ de 8 questions (douleur, contre-indications, durée) → appel final « Votre première séance offerte », « Sans engagement » → pied (adresse, téléphone, e-mail, horaires).
Structure : plusieurs pages (concept, EMS, équipe, blog, contact) ; aucune page par prestation. Téléphone cliquable : 1 lien `tel:`, dans le pied seulement. Formulaire : aucun sur l'accueil (toutes les portes vont vers `/contact`). Horaires : en pied et dans le JSON-LD.

## Typographie
Non mesurée : les polices de l'élément personnalisé sont chargées par son script (le CSS de la page ne contient que les polices Wix par défaut).

## Couleur et matière
Non mesurée. Fond `#151E3B` lu dans le CSS (couche de chargement). Photos : non mesurées (aucune `<img>` dans le balisage de secours ; 4 médias Wix dans la page).

## Mouvement
Non mesuré. Lu : tant que le script n'est pas chargé, une **couche plein écran** (`body::before`, `position: fixed; inset: 0`, logo au centre) masque la page.

## Le geste signature
Aucun geste de dessin lisible. Le geste commercial : **une séance d'essai offerte comme seule porte**, répétée trois fois (premier écran, FAQ, fin de page), avec « Aucun paiement demandé » et « Sans engagement ».

## Ce qu'on garde / ce qu'on refuse
Garde : offre d'entrée gratuite nommée, note Google et volume sous le bouton, équipe nommée avec le gérant en premier, déroulé de la séance en étapes, FAQ qui lève les freins (douleur, contre-indications), résultat chiffré honnête de la refonte.
Refuse : tout le contenu dépendant de JavaScript (une page blanche couverte d'un logo tant que le script n'est pas là), téléphone seulement en pied pour un commerce de quartier.

## Verdict marché (veille du 19 oct 2026, tour 4)
Source : agence Najumi (bureau à Villeurbanne), page https://najumi.fr/realisations/, 2e projet de la liste : https://najumi.fr/projet/activsport/ (publié le 25 septembre 2026 ; le 1er, Natural Loop, est un cabinet de conseil industriel). Tirage : ville `$RANDOM` 2659 mod 21 = 13 → Villeurbanne. URL lue : https://www.activsport.info/ (HTML 758 Ko, premier octet 0,3 s depuis le proxy). L'agence écrit le résultat : « la visibilité Google du studio a tenu après la refonte, et cinq séances d'essai ont été réservées via le formulaire du nouveau site ».

**Un artisan paierait-il 1 200 € pour ça ?** Oui pour le parcours : chaque bloc répond à « est-ce pour moi, est-ce que ça fait mal, combien de temps, qui m'encadre », et la porte est gratuite. Non pour la fabrication : le contenu n'existe qu'une fois le script chargé, ce que l'usine ne fera jamais (pages statiques).

**Leviers vus** : Photos réelles : non mesuré. Premier écran : métier + ville dans le h1, offre gratuite, note Google (125 avis, 5/5) et « +1000 personnes accompagnées » sous le bouton ; pas de téléphone. Preuves : 8 avis signés dont une vidéo, équipe nommée, volume ; pas d'année. Structure : plusieurs pages, contact sur une page à part. Appels : « Réserver ma séance offerte » (×1), « Contactez Baptiste », « Découvrir Activ'Sport », téléphone en pied. Vitesse : HTML 758 Ko. Mobile : non mesuré.
