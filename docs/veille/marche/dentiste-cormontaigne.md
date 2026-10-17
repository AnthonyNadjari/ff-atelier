# Cabinet du Dr Vanina Debouvry — https://dentiste-lille-cormontaigne.fr/
Titre « Dentiste Lille 59000 | Dr Vanina Debouvry | Dentisterie esthétique », `lang="fr-FR"`, description « Le docteur Vanina Debouvry, dentiste à Lille 59000 : implants, facettes, blanchiment dentaire, soin de gencives, réhabilitation globale. », technologie lue : WordPress, thème sur mesure `vanina-debouvry` (agence MEDIWEB, crédit en pied), Complianz, Google Tag Manager. Démontage à la main du 2026-10-17 : **mesuré sur le code, pas sur capture** (HTML et CSS récupérés par `curl`, aucun navigateur).

## Squelette
Premier écran (ordre du HTML) : en-tête avec « Contactez-nous », téléphone cliquable 03 20 00 79 78, adresse « 3, Place Cormontaigne | 59000 Lille » (lien Google Maps), bouton « RDV en ligne » ; h1 « Cabinet dentaire du Dr Vanina Debouvry », h2 « chirurgien-dentiste à Lille » ; paragraphe de bienvenue (esthétique, parodontologie, orthodontie, prothèse ; le Dr Carpentier pour l'implantologie) ; « Prenez rendez-vous en ligne sur Doctolib ou bien via notre site ! » ; photo de tête `home_hero_2_1.webp` (septembre 2026).
Ordre : « Notre équipe » (3 dentistes avec portrait et lien « Découvrir CV », 2 assistantes nommées avec portrait) → « Traitements » (5 familles, chacune vers sa page) → « Pathologies » (7, chacune vers sa page) → « Nos valeurs » (4) → « Nos technologies » → FAQ (lien) → « Accès » (horaires jour par jour, itinéraire) → formulaire « Contactez-nous » (5 champs).
Structure : environ 30 pages (une par traitement, par pathologie, par praticien, plus deux pages « Facettes dentaires Lille » et « Blanchiment dentaire Lille »). Téléphone cliquable : 6 liens. Horaires : lundi 08 h 45 à 12 h 30 et 14 h à 18 h 30, etc.
Arrivée : un **préchargeur** en JavaScript (affiché une fois par session, `sessionStorage`) : couche à l'arrivée, durée non mesurée. Le HTML pèse 2,7 Mo, dont un seul script en ligne de 672 Ko.

## Typographie
Lue dans le CSS : Montserrat (49 déclarations), Google Fonts.

## Couleur et matière
Non mesurée. 42 `<img>` : 5 portraits de l'équipe, photos du cabinet (`cabinet-dr-vanina-debouvry`, `dr-debouvry-lille-cabinet-dentaire`), photos de soins nommées au nom du docteur ; la part de banque n'est pas lisible dans le code.

## Mouvement
Préchargeur à l'arrivée ; images « parallax » de l'équipe et de la FAQ (noms de fichiers `team-parallax`, `faq-parallax`). Le reste : non mesuré.

## Le geste signature
Aucun geste de dessin. Le geste commercial : **l'équipe entière en photo, nommée, juste après le titre**, assistantes comprises.

## Ce qu'on garde / ce qu'on refuse
Garde : téléphone, adresse et prise de rendez-vous dans l'en-tête ; l'équipe nommée avec portraits ; une page par soin et par problème (« dent cassée », « bruxisme ») qui répond à ce que le patient tape.
Refuse : préchargeur, HTML de 2,7 Mo, bannière de consentement.

## Verdict marché (veille du 17 oct 2026, tour 3)
Source : recherche « dentiste Lille », métier `$RANDOM` 678 mod 20 = 18 → dentiste, ville `$RANDOM` 16444 mod 24 = 4 → Lille. La recherche simple ne rend que des annuaires (PagesJaunes, LeMedecin, Elsan) et des offres d'emploi ; recherche étendue : rangs 1 et 2 des centres en réseau (Dentego, Dentylis, écartés comme franchises), **rang 3 ce cabinet**. URL lue : https://dentiste-lille-cormontaigne.fr/ (HTML 2,7 Mo, premier octet 1,0 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Un cabinet, oui, et sans doute bien plus (une trentaine de pages rédigées). Ce qui vend : on sait qui va soigner (visages, noms, CV), on peut appeler ou réserver dès l'en-tête, chaque soin a sa page. Aucun avis ni chiffre, ce qui est cohérent pour une profession réglementée (docs/REDACTION.md). Le préchargeur et le poids sont les défauts.

**Leviers vus** : Photos réelles : 5 portraits de l'équipe + photos du cabinet. Premier écran : nom du docteur + « chirurgien-dentiste à Lille », téléphone, adresse, « RDV en ligne » (Doctolib). Preuves : équipe nommée, technologies ; pas d'avis, pas d'années. Structure : plusieurs pages (une par soin, par pathologie, par praticien), formulaire et horaires sur l'accueil. Appels : téléphone (×6), RDV en ligne (×2), Itinéraire, « Découvrir » par soin. Vitesse : HTML lourd (2,7 Mo). Mobile : images « -mobile » dédiées lues dans le code ; le reste non mesuré.
