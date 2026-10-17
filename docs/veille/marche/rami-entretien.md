# Rami Entretien du Bâtiment — https://ramientretiendubatiment.com/
Titre « Dépannage & Rénovation Urgente Perpignan | Rami Entretien », `lang="fr-FR"`, description « Besoin d'une intervention urgente à Perpignan ? Rami Entretien intervient rapidement pour vos travaux de bâtiment, sinistres & rénovations dans le 66. », technologie lue : WordPress, Elementor 4.2.4, Complianz (cookies), Google Tag Manager, bouton flottant « Call Now Button ». Démontage à la main du 2026-10-17 : **mesuré sur le code, pas sur capture** (HTML et CSS récupérés par `curl`, aucun navigateur).

## Squelette
Premier écran (ordre du HTML) : nav (Accueil, À propos, Nos Services, Contact) + numéro « 06 11 26 57 32 » ; surtitre « Interventions rapides & travaux garantis » ; h1 « Interventions Rapides et Travaux de Rénovation à Perpignan » ; paragraphe (Peyrestortes, sinistres, « couvert par une assurance décennale ») ; deux arguments « Interventions rapides en cas d'urgence », « Travaux fiables et garantis » ; bouton « Obtenir un devis ». Fond : photo de chantier en CSS (`uploads/2026/06/image0.jpeg`).
Ordre : h1 → « Artisan en Dépannage Urgent et Remise en État à Peyrestortes (66) » (« Depuis 2010 », clientèle : particuliers, bailleurs, agences, syndics, assureurs) → « Une assurance décennale » → 2 services (Rénovation de sol, Maçonnerie & travaux divers) → FAQ de 6 questions (tarifs, délai de devis, délai d'intervention, zone, prestations, assurance) → « Ils nous ont fait confiance » (logos Citya, Socagest…) → « Obtenez un devis gratuit » (formulaire 9 champs) → pied (zone, horaires).
Structure : une page à ancres + une page Contact + pages légales.
Téléphone : 4 liens `tel:` mais **le numéro de l'en-tête n'a pas de lien** (`href` vide) et celui de la section contact pointe vers `tel: 123456789` (valeur du modèle restée en place, le texte affiché est le bon numéro) ; seuls le pied et le bouton flottant appellent le bon numéro. Horaires : « du lundi au vendredi de 08 h 00 à 20 h 00 ». Zone : « 30 km autour de Perpignan » et littoral des Pyrénées-Orientales.

## Typographie
Lue dans le CSS : Instrument Sans (22 déclarations). Hors liste « IA ».

## Couleur et matière
Non mesurée. 13 `<img>` : 7 photos de chantier prises au téléphone (`IMG_1961`, `IMG_1983`, `image0-2-rotated`, « REMPLACEMENT-CARREAU-ISOLE »…), 3 logos de clients, et un visuel de 178 px nommé `Gemini_Generated_Image_…` rangé avec les logos.

## Mouvement
Swiper et GSAP chargés par le thème ; usage non mesuré. 19 déclarations `border-radius` en pilule.

## Le geste signature
Aucun. Le geste commercial : les délais écrits dans la FAQ (« devis généralement envoyé sous 24 heures », « travaux réalisés dans un délai maximum de 7 jours après acceptation »).

## Ce qu'on garde / ce qu'on refuse
Garde : décennale répétée dès le premier écran, délais chiffrés, vraies photos de chantier, logos de syndics et d'agences (preuve pour la clientèle pro), zone en kilomètres.
Refuse : numéro de l'en-tête non cliquable, `tel:` du modèle laissé en place, image générée parmi les preuves, aucun avis.

## Verdict marché (veille du 17 oct 2026, tour 3)
Source : agence Web'oc (Perpignan), accueil https://web-oc.com/, bloc « Dernières Réalisations », premier projet « Artisan Maçon » → https://ramientretiendubatiment.com. Tirage : ville `$RANDOM` 20151 mod 24 = 15 → Perpignan. URL lue : https://ramientretiendubatiment.com/ (HTML 181 Ko, premier octet 1,6 s depuis le proxy). Photos datées 2026/04 à 2026/06 dans les chemins : site récent.

**Un artisan paierait-il 1 200 € pour ça ?** Oui pour le contenu (urgence, décennale, délais, syndics, vraies photos), non pour la finition : le téléphone de l'en-tête ne compose rien et un autre lien appelle « 123456789 ». Pour un métier d'urgence, c'est le défaut qui coûte le plus cher ; `ff verifier` (garde « données de test ») l'attraperait chez nous.

**Leviers vus** : Photos réelles : 7 (chantiers, prises au téléphone). Premier écran : métier « rénovation » + Perpignan dans le h1, urgence, décennale, bouton devis ; téléphone affiché mais non cliquable. Preuves : depuis 2010, assurance décennale, logos de clients professionnels ; pas d'avis. Structure : une page + Contact, FAQ et formulaire sur l'accueil. Appels : « Obtenir un devis » (×2), bouton d'appel flottant, téléphone (pied). Vitesse : 36 feuilles CSS (~0,9 Mo). Mobile : bouton d'appel flottant (« Call Now Button »).
