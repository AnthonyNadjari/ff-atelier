# RConstruction — https://www.ent-rconstruction.fr/
Titre « Maçonnerie et patrimoine à Dijon & Chalon | RConstruction », `lang="fr-FR"`, description « RConstruction, expert en maçonnerie, gros œuvre et restauration du patrimoine ancien à Dijon et Chalon. 30 ans d'expérience. Devis gratuit sous 48h. », technologie lue : WordPress, Elementor 4.3.5, Swiper ; aucun outil de consentement ni de mesure d'audience lu dans le HTML. Démontage à la main du 2026-10-17 : **mesuré sur le code, pas sur capture** (HTML et CSS récupérés par `curl`, aucun navigateur ; le serveur a coupé une partie des feuilles CSS).

## Squelette
Premier écran (ordre du HTML) : nav (L'entreprise, Nos services avec 3 sous-pages, Nos réalisations, Contact) + bouton « Demande de devis » ; h1 « Maçonnerie et restauration du patrimoine à Dijon et Chalon-sur-Saône | RConstruction » ; sous-titre « Maçonnerie traditionnelle, gros œuvre et patrimoine en Bourgogne » ; bouton « Découvrez nos expertises ». **Aucun téléphone en haut** : le premier `tel:` arrive au bloc d'appel final.
Ordre : 3 expertises (Maçonnerie et gros œuvre, Restauration patrimoine bourguignon, Entreprise générale) → « Bienvenue chez RConstruction », « ancrée en Bourgogne depuis plus de 30 ans » → 4 points forts → « Un accompagnement complet » (ABF, Monuments historiques, subventions Fondation du Patrimoine et DRAC) → « Nos réalisations » (maisons de maître, chais, bâtiments classés ; une réalisation nommée « Liger Belair à Vosne-Romanée ») → zones d'intervention (Dijon, Chalonnais, Route des Grands Crus, Côte-d'Or) + carte en image → « Votre projet mérite notre expertise » (« Devis gratuit », « Appelez-nous ! ») → pied (adresse, téléphone, e-mail, horaires, « offres d'emploi »).
Structure : plusieurs pages (entreprise, 3 services, réalisations, contact, devis, recrutement). Formulaire : aucun sur l'accueil (page devis séparée). Téléphone cliquable : 4 liens, tous en bas. Horaires : « Du lundi au vendredi 08:00 - 12:00 14:00 - 17:00 ».

## Typographie
Lue dans le CSS : Inter (145 déclarations) et RocknRoll One (124, titres). Inter est sur la liste « IA » de docs/GOUT.md ; RocknRoll One est rare pour un maçon (à juger).

## Couleur et matière
Non mesurée. 6 `<img>` + 5 fonds en CSS (`CTA.jpg`, `POINTS-FORTS.jpg`, `Frame-10-2.jpg`, `Fichier-10@3x.webp`, `Fichier-11@3x-scaled.webp`) ; une seule photo légendée comme chantier réel (Liger Belair). Les autres : à juger.

## Mouvement
Swiper chargé ; rien d'autre de lu. Aucune pilule dans le CSS lu.

## Le geste signature
Aucun geste de dessin. Le geste commercial est l'**ancrage local très précis** : vignoble, Route des Grands Crus, ABF, subventions DRAC, un domaine viticole nommé. Le site parle à un propriétaire de maison de maître, pas à « un client ».

## Ce qu'on garde / ce qu'on refuse
Garde : spécialité et ville dans le h1, ancienneté chiffrée, vocabulaire du métier et des aides (ABF, DRAC), réalisation nommée, zones nommées, aucune bannière cookies, HTML léger (134 Ko).
Refuse : téléphone absent du haut de page, aucun avis, aucun formulaire sur l'accueil, h1 qui finit par « | RConstruction » (titre de page recopié).

## Verdict marché (veille du 17 oct 2026, tour 3)
Source : agence ClicConcept, page « Création de site internet à Dijon », cas « Refonte de site internet vitrine RConstruction » (https://www.clicconcept.com/realisations/refonte-de-site-internet-vitrine-rconstruction/, publié le 21 octobre 2025, mis à jour le 6 juillet 2026). Tirage : ville `$RANDOM` 5769 mod 24 = 9 → Dijon. Les autres agences dijonnaises trouvées n'avaient pas de site artisan en ligne (Dev Web Agency : « Bientôt disponible ») ou pas de portfolio lisible. URL lue : https://www.ent-rconstruction.fr/ (HTML 134 Ko, premier octet 2,1 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Oui pour un maçon du patrimoine : le texte prouve le savoir-faire par le vocabulaire et les lieux, ce que ses clients (propriétaires de demeures, domaines viticoles, communes) savent lire. Non pour les appels : le téléphone n'apparaît qu'en bas, et il n'y a ni avis ni formulaire sur l'accueil.

**Leviers vus** : Photos réelles : 1 légendée (domaine viticole), le reste à juger. Premier écran : spécialité + Dijon + Chalon-sur-Saône dans le h1, bouton « Demande de devis » dans la nav ; pas de téléphone. Preuves : « depuis plus de 30 ans », réalisation nommée, démarches ABF / Monuments historiques ; pas d'avis, pas de label lu. Structure : plusieurs pages (une par service), contact et devis sur des pages séparées. Appels : Demande de devis, Devis gratuit, Appelez-nous, Découvrir (×3). Vitesse : HTML léger, 23 feuilles CSS. Mobile : non mesuré.
