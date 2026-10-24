# Génie Multiservices (https://www.geniemultiservices.com/)
Titre « Travaux de rénovation intérieure Nantes | Génie Multiservices », `lang="fr-FR"`, technologie lue : WordPress (thème sur mesure « genie »), extension d'avis Google (badge `rpi-badge`), extension anti-copie (« error: Content is protected !! »), Google Analytics, bannière cookies (Moove GDPR). Démontage à la main du 2026-10-24 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : barre haute « Demandez un devis ! » et « Découvrez notre offre de services ! » ; en-tête avec **deux numéros cliquables** (fixe et portable), Actualités, Contact ; nav à menus déroulants (Rénovation intérieure, Multiservices Dépannage, chacun avec 6 à 10 sous-pages, Réalisations, Actualités, Contact) ; h1 « Génie Multiservices, l'expérience de la rénovation intérieure à Nantes ».
Ordre : deux portes par intention (« Vous avez un projet de RÉNOVATION » / « Vous avez besoin d'un DÉPANNAGE »), chacune avec photo et texte → présentation (« une équipe de 10 salariés », tous corps d'état, « Particuliers, Pros, Syndics & Agences immobilière ») → 4 engagements (interlocuteur unique, équipe, **garantie décennale**, délais) → « Notre réseau de confiance » : 7 logos (Fédération Française du Bâtiment, Yesss, Cedeo, La Plateforme du Bâtiment, club sportif local…) → 3 conseils (douche à l'italienne, robinet, parquet) → carte « Nantes & métropole » (image) → pied avec adresse (Saint-Herblain) et les deux numéros. Badge d'avis « 4.9 (100) » avec un avis signé en fin de HTML (classe `rpi-badge-right` : badge flottant, position non mesurée).
Structure : environ 35 pages (une par prestation : plomberie, électricité, parquet, carrelage, peinture, salle de bain, isolation, dépannage chaudière…, réalisations, actualités). Téléphone cliquable : 4 liens `tel:` (2 numéros). Formulaire : aucun sur l'accueil (page Contact).

## Typographie
Lue dans le HTML : Antonio et Roboto Condensed (Google Fonts), Tahoma en repli.

## Couleur et matière
Non mesurée. 30 `<img>` sur l'accueil, presque toutes sans `alt` : icônes SVG, 2 photos de rénovation et de dépannage (nature non lisible sans capture), logos. Page Réalisations : une quarantaine de photos de chantiers rangées par type (salle de bain, cuisine, aménagement, sols), noms de fichiers avec la commune (Carquefou, Orvault, Rezé, Sautron).

## Mouvement
Non mesuré (aucune animation lisible dans le HTML).

## Le geste signature
Aucun geste visuel. Le geste commercial : **deux portes par intention dès le premier écran** (un projet de rénovation ou un dépannage), comme Ouest Car.

## Ce qu'on garde / ce qu'on refuse
Garde : deux numéros cliquables en tête, h1 métier + ville, une page par prestation, portes par intention, chiffre d'équipe, réseau professionnel, réalisations rangées par pièce.
Refuse : code court non rendu en pied de page (« [brb_collection id="1029"] »), extension anti-copie, images sans `alt`, bannière cookies pour Google Analytics, note affichée en badge flottant.

## Verdict marché (veille du 24 oct 2026, tour 6)
Source : agence Fair (Nantes, 19 rue Dobrée), page « Création site internet pour artisan Nantes » (https://www.fair-agenceweb.fr/creation-site-internet-artisan-nantes) : lien « Je découvre tout de suite un exemple de site web pour artisan » ; la page Réalisations de l'agence est chargée en JavaScript (aucun lien client dans le HTML). Tirage : `$RANDOM` 14584 mod 15 = 4 → Nantes. URL lue : https://www.geniemultiservices.com/ (HTML 101 Ko, premier octet 1,3 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Oui : on sait en deux secondes quoi (rénovation ou dépannage), où (Nantes), qui appeler (deux numéros), et la note Google suit le visiteur. Le dessin est daté et le code court qui traîne en pied se voit, mais rien ne fait fuir un client.

**Leviers vus** : Photos réelles : sur la page Réalisations (noms de chantiers et de communes), non lisibles sur l'accueil. Premier écran : « Demandez un devis ! », deux numéros, h1 métier + ville. Preuves : note 4,9 sur 100 avis (badge), 10 salariés, garantie décennale, Fédération Française du Bâtiment, logos de fournisseurs. Structure : environ 35 pages, contact sur une page dédiée. Appels : « Demandez un devis ! », téléphone (×4), deux portes « rénovation » / « dépannage ». Vitesse : HTML 101 Ko, premier octet 1,3 s. Mobile : balise viewport présente ; rendu non mesuré.
