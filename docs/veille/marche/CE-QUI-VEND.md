# Ce qui fait signer un artisan

Synthèse tenue à jour par `/veille` (volet 2a, à chaque tour) : des sites **qui vendent** (sites clients d'agences
qui ont des artisans pour clients, sites d'artisans classés sur Google, modèles les plus vendus des places de
marché), tous métiers confondus, tirés au hasard. Une fiche par site dans ce dossier (`ff demonter <url>
--dossier docs/veille/marche`).

Né du retour du fondateur du 17 oct 2026 : les démos de l'usine « ne feraient pas acheter », « c'est toujours la
même chose » ; les démontages d'octobre (`docs/veille/demontages/`) venaient surtout de galeries de designers.

Règle : un levier vu sur au moins 40 % des sites étudiés et absent de l'usine devient la première amélioration
du tour suivant. On transpose un levier, jamais une maquette.

## Leviers (compte sur le nombre de sites étudiés)

54 sites au 24 oct 2026, tour 6 (36 sites d'artisans ou de professionnels, 18 modèles). Un site compte s'il a le levier sur l'accueil ou dans sa nav.
Les comptes des tours 1 à 3 sont gardés tels quels ; les tours 3 à 6 ajoutent chacun 9 sites démontés **sur le code, sans capture**
(aucun navigateur disponible) : les leviers de position (« au premier écran ») y sont lus dans l'ordre du HTML, la couverture des
bannières cookies n'y est pas mesurée. Pourcentage donné à partir de 40 %. Entre parenthèses après le compte : la variation du tour 6.

| Levier | Sites qui l'ont | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Plusieurs pages (pas un site d'une page) | 50 / 54 (93 % ; +8 / 9) | tous sauf [Rami](rami-entretien.md), [Refit](framer-refit.md) et [Jacques Couverture](jacques-couverture.md) (une page à ancres + Contact) ; les plus fournis du tour 5 : [Incoma Domia](incoma-domia.md) (environ 100 pages), [Touchard Fleurs](touchard-fleurs.md) (environ 65) ; une page à ancres au tour 6 : [Plumbzo](framer-plumbzo.md) (+ pages légales) | Oui : une page par service, pages villes en option (`seo.cityPages`) |
| Avis ou témoignages affichés | 38 / 54 (70 % ; +5 / 9) | [Ouest Car](garage-ouestcar.md) (103 avis Google), [Sud Mécanique](sud-mecanique.md) (119 avis à 4,4 sous un titre « Avis Google Vérifiés »), [Incoma Domia](incoma-domia.md) (avis datés par chantier) ; [Perfect Permis](perfect-permis.md) compté pour sa page « Avis » dans la nav ; seul sans avis au tour 5 : [L'Atelier Bois Acier](atelier-bois-acier.md) ; tour 6 : [Génie Multiservices](genie-multiservices.md) (badge « 4.9 (100) »), [Signori&Figli](signori-figli.md) (page « Les clients en parlent » dans la nav) ; **sans avis au tour 6 : 4 des 6 sites réels** ([ADR Bâtiment](adr-batiment.md), [Aplemont](veto-aplemont.md), [Insolite Beauté](insolite-beaute.md), [Immobm](immobm.md)) | Oui (`proof/google`, `testimonials`), seulement s'ils sont fournis |
| Une page par service ou par offre | 36 / 54 (67 % ; +5 / 9) | [Dr Debouvry](dentiste-cormontaigne.md) (une page par soin), [Sud Mécanique](sud-mecanique.md) (vidange, embrayage, injecteurs… et une page par offre), [EMS Avocats](ems-avocats.md) (une page par domaine) ; [Génie Multiservices](genie-multiservices.md) (une vingtaine de prestations), [Immobm](immobm.md) (une page par bien) | Oui (`src/pages/services/[slug].astro`) |
| Année de création ou années de métier | 34 / 54 (63 % ; +5 / 9) | [Prat](prat-depannage.md) (depuis 1987), [Incoma Domia](incoma-domia.md) (« depuis 1959 » sous le h1), [Touchard Fleurs](touchard-fleurs.md) (« entreprise familiale depuis 1986 ») ; [Sud Mécanique](sud-mecanique.md) non compté (« ans d'expérience » sans chiffre dans le HTML) ; [ADR Bâtiment](adr-batiment.md) (« 15+ » sous le h1), [Insolite Beauté](insolite-beaute.md) (« depuis plus de 12 ans »), [Signori&Figli](signori-figli.md) (« depuis 20 ans ») | Oui, en texte « Depuis 1998 » (`business.since`) ; le badge et le « X ans » calculé restent refusés (docs/GOUT.md § 2) |
| Métier + ville dans le titre ou la première phrase | 33 / 54 (61 % ; +5 / 9) | [S Elec](s-elec.md) (« Électricien à Rennes »), [Sud Mécanique](sud-mecanique.md) (« Garage … à Château-Gombert, Marseille 13013 » dans le h1), [Perfect Permis](perfect-permis.md) (« Auto-école à Saint-Étienne ») ; contre-exemple : [EMS Avocats](ems-avocats.md) (Nîmes seulement dans la description) ; [Génie Multiservices](genie-multiservices.md) (« rénovation intérieure à Nantes » dans le h1), [Insolite Beauté](insolite-beaute.md) (« Institut de beauté à Saint-Etienne » au-dessus du h1), [ADR Bâtiment](adr-batiment.md) (département seulement) ; contre-exemple : [Signori&Figli](signori-figli.md) (ni ville ni département en haut) | Oui (test du hero, docs/REDACTION.md ; `hero-metier` « <métier> à <ville> » dans les heros) |
| Téléphone cliquable visible en haut | 31 / 54 (57 % ; +5 / 9) | [Securya](securya.md), [EMS Avocats](ems-avocats.md) (« Garde à vue 7j/7 » + numéro en tête), [CarPress](tf-carpress.md) (« Tap here to call us », tout premier élément) ; contre-exemples : [Touchard Fleurs](touchard-fleurs.md) (**aucun numéro sur l'accueil**), [Servora](framer-servora.md), [Grand-Père Jules](grand-pere-jules.md) ; tour 6 : [Génie Multiservices](genie-multiservices.md) (deux numéros), [ADR Bâtiment](adr-batiment.md) (« Nous Appeler »), [Plumbzo](framer-plumbzo.md) (« Call Now » à côté du devis) ; **numéro écrit sans lien `tel:` sur tout l'accueil** : [Signori&Figli](signori-figli.md), [Aplemont](veto-aplemont.md), [Immobm](immobm.md), [Selene](squarespace-selene.md) | Oui (porte « Appeler » des navs, `cta/phone-giant`) |
| Rubrique conseils, actualités ou journal | 24 / 54 (44 % ; +3 / 9) | [Ouest Car](garage-ouestcar.md) (Conseils auto), [Sud Mécanique](sud-mecanique.md) (3 articles datés sur l'accueil), [L'Atelier Bois Acier](atelier-bois-acier.md) (« En direct de l'atelier » : les réalisations publiées comme articles) ; [Génie Multiservices](genie-multiservices.md) (3 conseils travaux), [Aplemont](veto-aplemont.md) (Articles), [Insolite Beauté](insolite-beaute.md) (Blog) | **Fait le 17 oct 2026** : `conseils` dans le schéma, `/conseils` + une page par article + lien de nav, seulement si le client a des articles |
| Vraies photos de l'entreprise | 26 / 54 (48 % ; +5 / 9 ; les 18 modèles : banque ou démonstration ; non comptés faute de pouvoir le lire dans le code : [Insolite Beauté](insolite-beaute.md), [Securya](securya.md), [Activ'Sport](activsport.md), [Grand-Père Jules](grand-pere-jules.md), [Sud Mécanique](sud-mecanique.md), [Perfect Permis](perfect-permis.md)) | [Villa d'Orient](villadorient.md) (~20), [Chez Bex](chez-bex.md) (~24), [Touchard Fleurs](touchard-fleurs.md) (une quarantaine de bouquets de la maison), [L'Atelier Bois Acier](atelier-bois-acier.md) (atelier, pièces nommées) ; contre-exemples : [Incoma Domia](incoma-domia.md) (logos, photos de fabricants, une photo de banque), [EMS Avocats](ems-avocats.md) (statue et icônes) ; tour 6 : [Signori&Figli](signori-figli.md) (plats photographiés au téléphone, équipe), [Aplemont](veto-aplemont.md) (vitrine, bloc, radio, chenil), [ADR Bâtiment](adr-batiment.md) et [Génie Multiservices](genie-multiservices.md) (sur la page Réalisations ; banque probable sur l'accueil d'ADR) | Dépend du client : guide photo, `ff images` ; jamais de banque présentée comme « le client » |
| Formulaire sur l'accueil | 22 / 54 (41 % ; +2 / 9) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (dès le premier écran), [Plumbing Blue](wix-plumbing-blue.md) (**réservation avec calendrier au premier écran**), [CarPress](tf-carpress.md) (devis avec photo jointe) ; [Plumbzo](framer-plumbzo.md) (devis, « réponse sous 30 minutes »), [BrightNest](wix-brightnest-handyman.md) (créneau de rappel) ; aucun des 6 sites réels du tour 6 | Oui (`contact/form-*`) |
| Bouton devis ou estimation nommé | 24 / 54 (44 % ; +5 / 9) | [BM Rénov](bm-renov.md) (« Devis gratuit »), [Incoma Domia](incoma-domia.md) (« Devis Rapide Gratuit - Sous 48h »), [Servora](framer-servora.md) (« Get a Free Quote ») ; [ADR Bâtiment](adr-batiment.md) (« Devis transparent en 24h »), [Génie Multiservices](genie-multiservices.md) (« Demandez un devis ! » en barre haute), [Immobm](immobm.md) (« Vous vendez ? », estimation offerte) | Oui (porte « Devis », `wording.devis`) |
| Label, réseau, licence, assurance ou certification | 20 / 54 (37 % ; +3 / 9) | [Abers Couverture](abers-couverture.md) (RGE Qualibat), [Incoma Domia](incoma-domia.md) (3 logos RGE juste sous le h1), [Sud Mécanique](sud-mecanique.md) (réseau AD Expert dans le h1, réparateur agréé Smart), [Servora](framer-servora.md) (« Licensed & Insured ») ; [Génie Multiservices](genie-multiservices.md) (Fédération Française du Bâtiment, garantie décennale), [Immobm](immobm.md) (FNAIM et Galian), [Plumbzo](framer-plumbzo.md) (« Licensed & Insured ») | En partie : `business.insurance` s'affiche dans les 6 heros (« Assuré décennale ») ; `business.certifications` (RGE, Qualibat…) seulement dans `about/portrait`, `about/overlap`, `footer/columns`, `proof/logos` et les pages `porte`, jamais au premier écran de l'accueil |
| … dont au premier écran | 7 / 54 relevés (+1 / 9) | [Maison Stamm](maisonstamm.md), [BM Rénov](bm-renov.md), [Rami](rami-entretien.md), [Incoma Domia](incoma-domia.md), [Sud Mécanique](sud-mecanique.md), [Servora](framer-servora.md) ; [Immobm](immobm.md) (FNAIM dans l'en-tête) | Assurance : oui (6 heros sur 6). Certifications : non (aucun hero ne lit `certifications`) |
| Zone desservie dans le premier écran | 15 / 54 (28 % ; +1 / 9) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (8 communes en pastilles), [Incoma Domia](incoma-domia.md) (10 communes dans la nav), [EMS Avocats](ems-avocats.md) (« à Nîmes et à distance dans toute la France ») ; [ADR Bâtiment](adr-batiment.md) (« Haute Savoie (74) » dans le h1) ; [Insolite Beauté](insolite-beaute.md) (8 communes juste après le premier écran) non comptée | En partie : `zones.cities` est lu au premier écran par 2 heros sur 6 (`typographic`, `marquee`) ; ailleurs dans la section `zones` |
| Chiffre de volume (« 4 000 clients ») | 17 / 54 (+3 / 9) | [Securya](securya.md) (« 800 sites sécurisés »), [Touchard Fleurs](touchard-fleurs.md) (6 boutiques, 25 salariés, 107 références), [Bendorf](bendorf.md) ; [ADR Bâtiment](adr-batiment.md) (« 500+ chantiers », « 30+ par an » sous le h1), [Génie Multiservices](genie-multiservices.md) (10 salariés), [Plumbzo](framer-plumbzo.md) | Pas de champ dédié ; seulement si le client le donne (règle dure 2) |
| Logos de clients, partenaires ou certificats | 16 / 54 (+2 / 9) | [S Elec](s-elec.md) (Carrefour, Intermarché…), [Incoma Domia](incoma-domia.md) (16 marques), [Perfect Permis](perfect-permis.md) (Codes Rousseau) ; [Génie Multiservices](genie-multiservices.md) (7 logos : fédération, fournisseurs, club local), [Immobm](immobm.md) | Oui (`proof/logos`) |
| Garantie écrite | 12 / 54 (aucune au tour 6) | [Lintel](framer-lintel.md) (10 ans structure), [Maison Stamm](maisonstamm.md) (à vie), [Sud Mécanique](sud-mecanique.md) (« garantie à vie » sur la carrosserie) | Pas de champ ; texte du client seulement |
| Prix « à partir de » ou page tarifs | 14 / 54 (26 % ; +3 / 9) | [Grégory Cros](photo-lyon-cros.md) (« dès 390 € » dans le h1), [Servora](framer-servora.md) (prix et durée sous chaque service), [Touchard Fleurs](touchard-fleurs.md) (fourchette sous chaque bouquet), [EMS Avocats](ems-avocats.md) (abonnement à 49 € par mois dans la nav) ; [Signori&Figli](signori-figli.md) (prix sous chaque produit), [Insolite Beauté](insolite-beaute.md) (page Tarif dans la nav), [Immobm](immobm.md) (honoraires) | Oui (`services[].priceFrom`) |
| Délais chiffrés (rappel, devis, livraison) | 11 / 54 (+2 / 9) | [BM Rénov](bm-renov.md) (« Devis sous 48 h »), [Incoma Domia](incoma-domia.md) (devis sous 48 h), [Touchard Fleurs](touchard-fleurs.md) (livraison en 4 h dans 130 communes) ; [ADR Bâtiment](adr-batiment.md) (devis en 24 h), [Plumbzo](framer-plumbzo.md) (« same-day service », réponse sous 30 minutes) | Texte du client seulement (`wording.ctaText`) |
| Bannière cookies qui couvre le premier écran (contre-levier) | 4 / 18 mesurés (présente, couverture non mesurée sans capture : 6 / 9 au tour 3, 3 / 9 au tour 4, 4 / 9 au tour 5, 3 / 9 au tour 6) | [Cordonnerie d'Axel](cordonnerie-axel.md) (100 %, bloquante), [Auvergne Technique Plomberie](auvergne-plomberie.md) (51 % du téléphone) ; sans bannière au tour 5 : [Sud Mécanique](sud-mecanique.md), [EMS Avocats](ems-avocats.md) ; présente au tour 6 : [Génie Multiservices](genie-multiservices.md), [Insolite Beauté](insolite-beaute.md), [Immobm](immobm.md), chaque fois pour Google Analytics | Jamais : aucun traceur, aucune bannière (avantage à dire au client) |
| Gérant en photo et à la première personne au premier écran | 3 / 54 mesurés (aucun aux tours 5 et 6) | [Phenix](phenix-ferronnerie.md), [Grégory Cros](photo-lyon-cros.md), [Sawyer](squarespace-sawyer.md) ; [L'Atelier Bois Acier](atelier-bois-acier.md) (le gérant parle à la première personne juste sous le h1, sans photo de lui lisible) non compté ; [ADR Bâtiment](adr-batiment.md) et [Insolite Beauté](insolite-beaute.md) (« je » dès la deuxième section) non comptés | Possible (`about/portrait`, `images.portrait`), jamais au premier écran : aucun hero ne lit `images.portrait` |
| Barre d'actions collée en bas sur téléphone | 2 / 54 (aucune lue aux tours 5 et 6) | [Lintel](framer-lintel.md) (Appeler / SMS / Estimation), [Cordonnerie d'Axel](cordonnerie-axel.md) | Oui (`layout.actionBar`) |

Leviers relevés à partir du tour 2 (comptés sur les 45 sites des tours 2 à 6, à recompter sur les 9 du tour 1) :

| Levier | Sites des tours 2 à 6 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Gérant ou équipe en photo quelque part sur l'accueil | 13 / 45 (+2 / 9) | [BM Rénov](bm-renov.md), [Dr Debouvry](dentiste-cormontaigne.md), [Touchard Fleurs](touchard-fleurs.md) (photo d'équipe), [Plumbing Blue](wix-plumbing-blue.md) (3 personnes nommées dès la deuxième section) ; [EMS Avocats](ems-avocats.md) nomme ses 3 associés sans photo (non compté) ; [Signori&Figli](signori-figli.md) (3 personnes, prénom et rôle), [Selene](squarespace-selene.md) (« About me ») ; [Aplemont](veto-aplemont.md) : une page par personne et pour la mascotte, pas de photo sur l'accueil (non compté) | Oui (`about/portrait`, `about/overlap`, `about.team`) |
| FAQ sur l'accueil | 12 / 45 (+1 / 9) | [Rami](rami-entretien.md), [L'Atelier Bois Acier](atelier-bois-acier.md) (zone, pose, budget, essences), [EMS Avocats](ems-avocats.md) (6 questions), [Sud Mécanique](sud-mecanique.md) ; [Plumbzo](framer-plumbzo.md) (6 questions de client pressé) | Oui (`faq/*`) |
| Badges de réassurance sous le titre (devis gratuit, assurance, délai, 7j/7) | 13 / 45 (+2 / 9) | [BM Rénov](bm-renov.md), [Sud Mécanique](sud-mecanique.md) (« 4,4/5 sur Google · Garage AD Expert · Devis gratuit »), [Servora](framer-servora.md) (500+ projets, 4.9/5, 10+ ans, « Licensed & Insured ») ; [ADR Bâtiment](adr-batiment.md) (3 chiffres sous le bouton devis), [Plumbzo](framer-plumbzo.md) | Oui (liste sous les boutons des 6 heros : depuis, 24 h/24, décennale, note Google) |
| Note Google ou preuve sociale au premier écran | 10 / 45 (22 % ; +1 / 9) | [Securya](securya.md) et [Incoma Domia](incoma-domia.md) (**au-dessus du h1** : « 5/5 sur 36 avis »), [Plumbing Blue](wix-plumbing-blue.md) (sous le formulaire de rendez-vous) ; [Plumbzo](framer-plumbzo.md) (« 4.9+ Reviews » sous les boutons) ; [Génie Multiservices](genie-multiservices.md) : badge flottant de note, position non mesurée (non compté) | Oui (`proof.google` dans les heros) ; un témoignage au premier écran : non |
| Urgence 24/7 ou 7j/7 au premier écran | 8 / 45 (+1 / 9) | [Auvergne Technique Plomberie](auvergne-plomberie.md), [Jacques Couverture](jacques-couverture.md), [EMS Avocats](ems-avocats.md) (« Garde à vue 7j/7 » en tête) ; [Plumbzo](framer-plumbzo.md) (« Available 24/7 » au-dessus du h1) | Oui (`contact.emergency24h` dans les heros) |
| Prise de rendez-vous ou réservation en ligne | 9 / 45 (+2 / 9) | [Dr Debouvry](dentiste-cormontaigne.md), [Sud Mécanique](sud-mecanique.md) (« Réserver en ligne » sous le h1), [Plumbing Blue](wix-plumbing-blue.md) (calendrier au premier écran) ; [Insolite Beauté](insolite-beaute.md) (« Prendre RDV » vers Planity), [BrightNest](wix-brightnest-handyman.md) (créneau de rappel au calendrier) | Oui (`contact.bookingUrl`, porte « Réserver ») |
| Liste de communes + carte sur l'accueil | 4 / 45 (aucune au tour 6 ; [Génie Multiservices](genie-multiservices.md) : carte en image, sans liste) | [BM Rénov](bm-renov.md), [RConstruction](rconstruction.md), [Abers Couverture](abers-couverture.md) | Oui (`zones/*`, carte sans traceur) |
| Bouton d'appel flottant sur téléphone | 3 / 45 (aucun lu aux tours 4 à 6) | [Grégory Cros](photo-lyon-cros.md), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Rami](rami-entretien.md) | Oui sous forme de barre (`layout.actionBar`) |

Leviers relevés à partir du tour 3 (comptés sur les 36 sites des tours 3 à 6) :

| Levier | Sites des tours 3 à 6 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Restes du modèle en ligne (numéro factice, code du thème, texte ou photos d'un autre client) : contre-levier | 9 / 36 (+3 / 9) | [Rami](rami-entretien.md) (`tel: 123456789`), [Grand-Père Jules](grand-pere-jules.md) (« [cstmPhoneNumber] »), [Touchard Fleurs](touchard-fleurs.md) (mots anglais du thème dans le menu, deux notes qui se contredisent) ; tour 6 : [Signori&Figli](signori-figli.md) (« Order Now », un plat malaisien, « description description »), [Génie Multiservices](genie-multiservices.md) (« [brb_collection id="1029"] » en pied), [ADR Bâtiment](adr-batiment.md) (mentions du pied en anglais : « Privacy Policy », « Terms of Use ») | En partie : la garde « données de test » (`scripts/ff/garde-donnees.mjs`) bloque 06 00 00 00 00, 75000 et le contenu de `_exemple`, pas un `tel:` factice générique ; un code court non rendu ne peut pas arriver (pas de thème WordPress) |
| Réalisations datées, chiffrées ou localisées | 5 / 36 (+1 / 9) | [Chez Bex](chez-bex.md) (« 150 convives, 12.06.2025 »), [Abers Couverture](abers-couverture.md), [L'Atelier Bois Acier](atelier-bois-acier.md) (banque d'accueil d'une auto-école amiénoise, bureau d'une artiste, essence nommée) ; [ADR Bâtiment](adr-batiment.md) (8 chantiers avec commune et mois) | En partie : `place`, `kind`, `size`, `client` par réalisation dans `proof/gallery` (schéma, optionnels) ; pas de date |
| Une page par ville desservie | 4 / 36 (aucune au tour 6) | [Securya](securya.md) (10 villes), [Incoma Domia](incoma-domia.md) (10 communes), [Sud Mécanique](sud-mecanique.md) (9 quartiers et communes) | Oui (`seo.cityPages`, une page `/zones/<ville>`) |
| Seuil de commande au premier écran | 1 / 36 | [Chez Bex](chez-bex.md) | Texte du client seulement |

Leviers relevés à partir du tour 4 (comptés sur les 27 sites des tours 4 à 6) :

| Levier | Sites des tours 4 à 6 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Nouvelle du moment en tête de page ou dans la nav (nouveauté, saison, fermeture, offre datée) | 5 / 27 (19 % ; aucune au tour 6) | [Bendorf](bendorf.md) (bière éphémère), [Sud Mécanique](sud-mecanique.md) (**2 offres « du 5 octobre au 30 novembre 2026 »** avec le téléphone dessous), [Touchard Fleurs](touchard-fleurs.md) (« Toussaint » en premier lien de nav et en premier écran, mis à jour en octobre), [Omnisol](omnisol.md) (congés d'été encore affichés en octobre : la version ratée) ; [Signori&Figli](signori-figli.md) : « Les nouveautés du mois » sans date, produits de 2021-2022 (non compté) | Non : aucun champ d'annonce datée ; `conseils` (articles) est le plus proche, sans place en tête de page |
| Contenu ou chiffres qui n'existent qu'avec JavaScript (contre-levier) | 6 / 27 (+2 / 9) | [Activ'Sport](activsport.md), [PlumFix](framer-plumfix.md), [Sud Mécanique](sud-mecanique.md) (6 compteurs sans chiffre dans le HTML) ; [Signori&Figli](signori-figli.md) (3 compteurs à 0), [Plumbzo](framer-plumbzo.md) (4 compteurs à 0) | Pages statiques ; mais `data-counter` du moteur écrit aussi 0 dans le HTML (vitrine `sites/_effets`) |
| Offre d'entrée gratuite ou remise comme porte d'action | 3 / 27 (aucune au tour 6) | [Activ'Sport](activsport.md) (séance offerte), [Wix Electrician](wix-galvanic-electrician.md) (-15 %), [Sud Mécanique](sud-mecanique.md) (-30 % et lecture des codes défauts offerte) | Texte seulement (`wording.devis`, `wording.ctaText`) ; pas de champ « offre » |
| Vidéo de la maison ou témoignage vidéo | 3 / 27 (aucune au tour 6 ; vidéo de démonstration chez [Plumbzo](framer-plumbzo.md)) | [Bendorf](bendorf.md), [Activ'Sport](activsport.md), [L'Atelier Bois Acier](atelier-bois-acier.md) (visite vidéo de l'atelier) | Hero vidéo oui (`hero/video`, `ff video`) ; témoignage vidéo non |
| Commande à retirer, livraison ou location en boutique | 5 / 27 (+2 / 9) | [Grand-Père Jules](grand-pere-jules.md), [Bendorf](bendorf.md), [Touchard Fleurs](touchard-fleurs.md) (boutique en ligne, retrait ou livraison en 4 h) ; [Signori&Figli](signori-figli.md) (boutique et panier), [Insolite Beauté](insolite-beaute.md) (**cartes cadeaux achetées en ligne**, PDF par e-mail) | En partie : portes « Commander » et « Bon cadeau » vers l'outil du client (`contact.orderUrl`, `contact.giftCardUrl`, `layout.actionBar`) ; pas de boutique ni de panier dans le site |
| Calculateur d'estimation en ligne | 1 / 27 | [Renovate](tf-renovate.md) | Non |

Leviers relevés à partir du tour 5 (comptés sur les 18 sites des tours 5 et 6) :

| Levier | Sites des tours 5 et 6 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Horaires au premier écran ou en barre haute | 4 / 18 (+1 / 9) | [Sud Mécanique](sud-mecanique.md) (horaires en barre haute), [Incoma Domia](incoma-domia.md) (heures où le standard décroche, sous le h1), [CarPress](tf-carpress.md) (la semaine entière juste sous le carrousel) ; [Aplemont](veto-aplemont.md) (« Nos portes sont ouvertes » juste sous le h1) | En partie : horaires du jour au premier écran dans les coquilles `carte`, `lieu-fixe` et `split` (`HorairesDuJour`) ; ailleurs en contact et en pied |
| Plusieurs établissements, chacun avec adresse et horaires | 2 / 18 (aucun au tour 6) | [Touchard Fleurs](touchard-fleurs.md) (6 boutiques, horaires de chacune sur l'accueil), [Incoma Domia](incoma-domia.md) (2 accueils, la personne à joindre) | **Fait depuis** : `lieux` (architecture `pages-adresses`, coquille `adresses`) : une page par adresse avec horaires et téléphone, bandeau des adresses sur l'accueil, `LocalBusiness` par lieu |
| Parcours du client en étapes (« comment se déroule votre dossier ») | 4 / 18 (+2 / 9) | [EMS Avocats](ems-avocats.md) (4 étapes), [Servora](framer-servora.md) (« Four steps ») ; [ADR Bâtiment](adr-batiment.md) (3 étapes), [Plumbzo](framer-plumbzo.md) (4 étapes) | Oui (`process/steps`, `numbered`, `timeline`, `horizon`) |
| Deux publics séparés dans la nav (particuliers / professionnels) | 2 / 18 (+ [Omnisol](omnisol.md) au tour 4 ; aucun au tour 6, [Génie Multiservices](genie-multiservices.md) les cite dans le texte) | [EMS Avocats](ems-avocats.md) (Entreprises / Particuliers), [Touchard Fleurs](touchard-fleurs.md) (« Professionnels ») | **Fait depuis** : `pros` → page `/professionnels` et lien de nav (`wording.pros`) |
| Avant / après à glisser | 1 / 18 | [Servora](framer-servora.md) | Oui (`proof/before-after`) |
| Devis avec photo jointe (« envoyez la photo du problème ») | 1 / 18 (aucun au tour 6) | [CarPress](tf-carpress.md) (champ « Attach photo ») | Non : le formulaire n'accepte pas de pièce jointe |

Leviers relevés pour la première fois au tour 6 (comptés sur ses 9 sites) :

| Levier | Sites du tour 6 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Numéro écrit sans lien `tel:` sur tout l'accueil (contre-levier) | 4 / 9 (dont 3 des 6 sites réels ; + [Rami](rami-entretien.md), [Bendorf](bendorf.md), [Constructo](tf-constructo.md) aux tours 3 et 4 pour l'en-tête) | [Signori&Figli](signori-figli.md) (téléphone en barre haute et en contact, jamais cliquable), [Aplemont](veto-aplemont.md) (aucun `tel:` dans la page, vétérinaire), [Immobm](immobm.md) (portable en en-tête sans lien), [Selene](squarespace-selene.md) | Jamais dans les sections partagées : le numéro y est un lien (`tel()`, `src/lib/site.ts`) ; à vérifier dans les sections sur mesure |
| Deux portes par intention au premier écran (projet / dépannage) | 1 / 9 (+ [Ouest Car](garage-ouestcar.md) au tour 1) | [Génie Multiservices](genie-multiservices.md) (« Vous avez un projet de RÉNOVATION » / « Vous avez besoin d'un DÉPANNAGE », chacune avec sa photo) | Oui (`actions()` : portes d'action par intention dans les navs ; `services/portes`) |
| Carte cadeau achetée en ligne | 1 / 9 | [Insolite Beauté](insolite-beaute.md) (montant au choix, PDF par e-mail, occasions nommées) | En partie : porte « Bon cadeau » vers l'outil du client (`contact.giftCardUrl`) ; pas de vente dans le site |

**Prochain levier ≥ 40 % absent de l'usine** : aucun. Les dix leviers à 40 % ou plus (pages multiples 93 %, avis 70 %, page par service
67 %, années 63 %, métier + ville 61 %, téléphone en haut 57 %, vraies photos 48 %, conseils 44 %, devis 44 %, formulaire 41 %) existent
dans le schéma et les sections.
Ce qui a bougé au tour 6 (54 sites) : **les avis retombent de 73 % à 70 %** (4 des 6 sites réels n'en montrent aucun sur l'accueil) ; la page
par service de 69 % à 67 % ; **la rubrique conseils de 47 % à 44 %** ; **le formulaire sur l'accueil de 44 % à 41 %** (aucun des 6 sites réels :
seuls les deux modèles en ont un), il frôle le seuil ; **le bouton devis monte de 42 % à 44 %** ; **les vraies photos remontent de 47 % à 48 %**
(5 sites réels sur 6, souvent sur la page Réalisations plutôt que sur l'accueil) ; le téléphone en haut passe de 58 % à 57 %, et le
contre-levier nouveau est net : **numéro écrit sans lien `tel:` sur tout l'accueil chez 4 sites sur 9** (3 des 6 sites réels), ce que l'usine
ne fait jamais dans ses sections partagées ; **les labels baissent de 38 % à 37 %** (20 / 54 ; 7 au premier écran) : toujours sous 40 % ;
la note au premier écran baisse de 25 % à 22 % (sur 45) ; le prix écrit monte de 24 % à 26 %. Points à surveiller : la page Réalisations
avec chantiers datés et situés ([ADR Bâtiment](adr-batiment.md), 5 / 36) que l'usine ne date pas ; les restes du modèle (9 / 36, +3) ;
les compteurs vides sans JavaScript (6 / 27, +2), que le moteur de l'usine reproduit ; la nouvelle du moment (5 / 27, aucun champ).

## Sites étudiés

| Date | Source | Site | Métier, ville | Un artisan paierait-il ? | Fiche |
|---|---|---|---|---|---|
| 17 oct 2026 | Agence Laëka (Grenoble) | https://prat-depannage.fr/ | Dépannage remorquage, Saint-Martin-d'Hères | Oui, de justesse (trouvé et appelé, pas le dessin) | [fiche](prat-depannage.md) |
| 17 oct 2026 | Studio Seja (Strasbourg) | https://maisonstamm.fr/ | Coutellerie, Alsace | Oui, bien plus (boutique en ligne) | [fiche](maisonstamm.md) |
| 17 oct 2026 | Combo (Angers) | https://garage-ouestcar.fr/ | Garage, Les Ponts-de-Cé | Oui (avis, portes par intention, vraies photos) | [fiche](garage-ouestcar.md) |
| 17 oct 2026 | Recherche, rang 7 | https://www.villadorient.com/ | Chambres d'hôtes, Marseille | Oui (photos, classement, une page par chambre) | [fiche](villadorient.md) |
| 17 oct 2026 | Recherche, rang 4 | https://www.phenix-ferronnerie.fr/ | Ferronnier d'art, Paris | Pas pour le dessin ; le gérant au premier écran est un vrai levier | [fiche](phenix-ferronnerie.md) |
| 17 oct 2026 | Recherche, rang 2 | https://s-elec.bzh/ | Électricien, Rennes (Pont-Péan) | Oui (métier + ville, devis, avis, logos) | [fiche](s-elec.md) |
| 17 oct 2026 | ThemeForest, 10 654 ventes | https://wpcharming.com/construction/ | Modèle bâtiment | Le gabarit oui (cases de preuve), le contenu factice non | [fiche](wpcharming-construction.md) |
| 17 oct 2026 | Framer Marketplace, 39 $ | https://communicative-psychology-099138.framer.app/ | Modèle entrepreneur | Oui, le plus vendeur des neuf (preuves vérifiables, barre d'appel) | [fiche](framer-lintel.md) |
| 17 oct 2026 | Wix, Services & Maintenance | https://www.wix.com/demone2/wh-plumbing-serv | Modèle plombier | Non en l'état ; formulaire au premier écran | [fiche](wix-plumbing-bright.md) |
| 17 oct 2026, tour 2 | KBCOM (Tours) | https://bmrenovdesign.fr/ | Peintre et carreleur, Montlouis-sur-Loire | Oui, sans hésiter (photos de chantiers, décennale et délai au premier écran, gérant nommé) | [fiche](bm-renov.md) |
| 17 oct 2026, tour 2 | Kocka (Le Mans) | https://www.verandahome.fr/ | Vérandas et pergolas, Ruaudin | Oui (vraies poses, 25 ans dans le h1, 10 avis, une page par produit) | [fiche](verandahome.md) |
| 17 oct 2026, tour 2 | Youlead Limoges | https://www.lacordonneriedaxel.fr/ | Cordonnerie multiservice, Malemort-sur-Corrèze | Oui pour le contenu et la barre basse, non pour l'arrivée (cookies à 100 %) | [fiche](cordonnerie-axel.md) |
| 17 oct 2026, tour 2 | Recherche, rang 10 | https://lyon-photographe-professionnel.fr/mariage/ | Photographe de mariage, Lyon | Oui (gérant en grand, prix dans le h1, bouton Appeler flottant) | [fiche](photo-lyon-cros.md) |
| 17 oct 2026, tour 2 | Recherche, rang 10 | https://auvergne-technique-plomberie.fr/ | Plombier-chauffagiste, Clermont-Ferrand | Oui, premier écran le plus vendeur du tour (zone, note, formulaire) | [fiche](auvergne-plomberie.md) |
| 17 oct 2026, tour 2 | Recherche, rang 13 | https://www.southsidebarber.fr/ | Coiffeur barbier, Nice | Non (aucun téléphone, pas de h1, l'académie avant le salon) | [fiche](southside-barber.md) |
| 17 oct 2026, tour 2 | ThemeForest « handyman », 7,8 k ventes | https://demo.proteusthemes.com/buildpress/ | Modèle bâtiment | Le gabarit oui (en-tête téléphone + adresse + horaires, certificats), le dessin non | [fiche](tf-buildpress.md) |
| 17 oct 2026, tour 2 | Squarespace, article « home services » | https://sawyer-fluid-demo.squarespace.com/ | Modèle peintre | Non pour les appels (aucun téléphone) ; la gérante au premier écran est le levier | [fiche](squarespace-sawyer.md) |
| 17 oct 2026, tour 2 | Webflow, Home Services trié « Popular », 59 $ | https://roofex.webflow.io/ | Modèle couvreur | Oui (chaque bloc est une preuve), contenu factice | [fiche](webflow-roofex.md) |
| 17 oct 2026, tour 3 | Evico (Bordeaux) | https://securya.fr/ | Installateur d'alarmes, Cenon (Gironde) | Oui (note Google au-dessus du h1, 4 chiffres de réassurance, 10 avis, pages villes) | [fiche](securya.md) |
| 17 oct 2026, tour 3 | Web'oc (Perpignan) | https://ramientretiendubatiment.com/ | Maçonnerie et dépannage, Peyrestortes | Oui pour le contenu, non pour la finition (téléphone de l'en-tête sans lien, `tel:` factice) | [fiche](rami-entretien.md) |
| 17 oct 2026, tour 3 | ClicConcept (page Dijon) | https://www.ent-rconstruction.fr/ | Maçonnerie et patrimoine, Dijon | Oui pour un maçon du patrimoine (vocabulaire, lieux), non pour les appels (téléphone en bas) | [fiche](rconstruction.md) |
| 17 oct 2026, tour 3 | Recherche, rang 2 (étendue) | https://ekilibr-architecte.fr/architecte-d-interieur-rouen/ | Architecte d'intérieur, Rouen | Pour le classement oui (prix écrits, FAQ), pour la confiance non (banque, restes du thème) | [fiche](ekilibr.md) |
| 17 oct 2026, tour 3 | Recherche, rang 3 (étendue) | https://dentiste-lille-cormontaigne.fr/ | Chirurgien-dentiste, Lille | Oui, bien plus (équipe nommée, RDV dans l'en-tête, une page par soin) | [fiche](dentiste-cormontaigne.md) |
| 17 oct 2026, tour 3 | Recherche, rang 6 (étendue) | https://www.chezbex.fr/ | Traiteur, Le Havre | Oui (vraies photos de plats, prestations datées et chiffrées, avis datés) | [fiche](chez-bex.md) |
| 17 oct 2026, tour 3 | Framer Marketplace, Construction, rang 1, gratuit | https://refit.framer.website/ | Modèle rénovation | Non en l'état (une page, téléphone en bas) ; le témoignage sous le bouton est le levier | [fiche](framer-refit.md) |
| 17 oct 2026, tour 3 | Wix, Services & Maintenance, rang 2 | https://www.wix.com/demone2/a-reynolds | Modèle rénovation | Non (aucune porte au premier écran, textes de serrurier restés) | [fiche](wix-home-remodeling.md) |
| 17 oct 2026, tour 3 | ThemeForest « handyman », 7 493 ventes | https://preview.constructo.anpsthemes.com/demo1/ | Modèle bâtiment | Non (téléphone non cliquable, h1 enfoui, aucun avis) | [fiche](tf-constructo.md) |
| 19 oct 2026, tour 4 | Najumi (Villeurbanne) | https://www.activsport.info/ | Studio d'électrostimulation et coaching, Villeurbanne | Oui pour le parcours (séance offerte, note, équipe, FAQ), non pour la fabrication (contenu en JavaScript seul) | [fiche](activsport.md) |
| 19 oct 2026, tour 4 | Abergraphique (Brest) | https://www.abers-couverture.fr/ | Couvreur, Plabennec (Finistère nord) | Oui (25 pages de prestations, RGE, depuis 2002, showroom, avis) | [fiche](abers-couverture.md) |
| 19 oct 2026, tour 4 | Illunimes (Nîmes) | https://omnisol.fr/ | Solier-moquettiste, Nîmes | Oui, de justesse (vraies photos, métier exact ; ni avis ni réalisation, bandeau de congés périmé) | [fiche](omnisol.md) |
| 19 oct 2026, tour 4 | Recherche étendue, rang 3 | https://brasserie-bendorf.fr/ | Brasserie artisanale, Strasbourg | Oui (bière du moment en tête, chiffres concrets, équipe) ; téléphone sans lien, pas d'horaires | [fiche](bendorf.md) |
| 19 oct 2026, tour 4 | Recherche étendue, rang 8 | https://www.grandperejules-rennes.com/ | Boulangerie-pâtisserie, Rennes | Pour le contenu oui, pour la finition non (« [cstmPhoneNumber] » à la place du numéro) | [fiche](grand-pere-jules.md) |
| 19 oct 2026, tour 4 | Recherche étendue, rang 2 | https://jacques-couverture13.fr/ | Couvreur, Marseille | Oui pour ce qu'il rapporte (urgence, 110 avis à 4,9), non pour ce qu'il montre (aucune photo à lui) | [fiche](jacques-couverture.md) |
| 19 oct 2026, tour 4 | ThemeForest « roofing », rang 1, 6,1 k ventes | https://quanticalabs.com/wp_themes/renovate/ | Modèle rénovation | Pour le calculateur d'estimation peut-être ; pour le reste non (pas de h1, faux latin) | [fiche](tf-renovate.md) |
| 19 oct 2026, tour 4 | Wix, Services & Maintenance, rang 4 | https://www.wix.com/demone2/galvanic-mercer | Modèle électricien | Non (aucun numéro cliquable) ; la remise de saison est le levier | [fiche](wix-galvanic-electrician.md) |
| 19 oct 2026, tour 4 | Framer Marketplace, Home Services, « Trending » rang 1, gratuit | https://plumfix.framer.website/ | Modèle plombier | Pour le plan oui (équipe, FAQ, garanties), non en l'état (pas de téléphone en haut, compteurs vides) | [fiche](framer-plumfix.md) |
| 23 oct 2026, tour 5 | Azertix (Amiens) | https://atelier-bois-acier.fr/ | Ébéniste, Sains-en-Amiénois (Amiens) | Oui (l'ébéniste existe : voix, atelier en vidéo, pièces racontées) ; ni avis ni page par prestation | [fiche](atelier-bois-acier.md) |
| 23 oct 2026, tour 5 | Site Web Montpellier (Montpellier) | https://incoma.fr/ | Plombier-chauffagiste, Garons (Hérault et Gard) | Oui pour ce qu'il dit (note au-dessus du h1, depuis 1959, RGE, devis sous 48 h, pages communes), non pour ce qu'il montre (aucune photo de chantier) | [fiche](incoma-domia.md) |
| 23 oct 2026, tour 5 | ONDEV (Marseille) | https://sudmecanique.fr/ | Garage, Marseille Château-Gombert | Oui, sans hésiter (quartier dans le h1, note, rendez-vous, horaires, offres datées) ; compteurs vides | [fiche](sud-mecanique.md) |
| 23 oct 2026, tour 5 | Recherche étendue, rang 4 | https://ems-avocats.fr/ | Cabinet d'avocats, Nîmes | Oui (prix d'entrée, 7j/7, déroulé du dossier, FAQ) ; aucun visage, deux avis | [fiche](ems-avocats.md) |
| 23 oct 2026, tour 5 | Recherche étendue, rang 6 | https://www.perfectpermis.fr/ | Auto-école, Saint-Étienne | Non (fiche de plateforme : ni prix, ni taux de réussite, ni note) ; classé grâce au h1 métier + ville | [fiche](perfect-permis.md) |
| 23 oct 2026, tour 5 | Recherche étendue, rang 6 | https://fleuriste-lemans.fr/ | Fleuriste (6 boutiques), Le Mans et Sarthe | Oui, bien plus (boutique en ligne, saison en tête, prix, livraison en 4 h) ; aucun numéro sur l'accueil, pas de h1 | [fiche](touchard-fleurs.md) |
| 23 oct 2026, tour 5 | Framer Marketplace, Home Services, « Trending » rang 1, gratuit | https://servora.framer.ai/ | Modèle homme toutes mains | Pour le plan oui, le plus vendeur des modèles du tour (prix par service, note sous les boutons, avant / après) ; pas de téléphone en haut | [fiche](framer-servora.md) |
| 23 oct 2026, tour 5 | ThemeForest « handyman », rang 5, 3 k ventes | https://demo.proteusthemes.com/carpress/ | Modèle garage | Non pour le dessin (faux latin, pas de h1) ; téléphone en premier, horaires, devis sur photo | [fiche](tf-carpress.md) |
| 23 oct 2026, tour 5 | Wix, Services & Maintenance, rang 5 | https://www.wix.com/demone2/omber-calder | Modèle plombier | Oui pour le premier écran (numéro, rendez-vous au calendrier, note, années) ; trois pages, aucune zone | [fiche](wix-plumbing-blue.md) |
| 24 oct 2026, tour 6 | Fair (Nantes) | https://www.geniemultiservices.com/ | Rénovation intérieure et dépannage, Saint-Herblain (Nantes) | Oui (deux numéros en tête, métier + ville, portes rénovation / dépannage, note 4,9 sur 100) ; code court non rendu en pied | [fiche](genie-multiservices.md) |
| 24 oct 2026, tour 6 | Redcat Studio (Saint-Denis) | https://traiteur-italien94.fr/ | Traiteur-épicerie italienne, Saint-Maur-des-Fossés | Pour les photos et l'équipe oui ; en l'état non (aucun `tel:`, pas de ville, « Order Now » et fiches du thème) | [fiche](signori-figli.md) |
| 24 oct 2026, tour 6 | Annecy Dev (Annecy) | https://www.adr-batiment.com/ | Maçonnerie générale, Haute-Savoie | Oui, le plus net du tour (« Nous Appeler », devis en 24 h, 15 ans, chantiers datés et situés) ; aucun avis, photos d'accueil pas à lui | [fiche](adr-batiment.md) |
| 24 oct 2026, tour 6 | Recherche étendue, rang 8 | https://www.aplemontvet.fr/ | Vétérinaire, Le Havre (Aplemont) | Pour ce qu'il montre oui (vitrine, salles, horaires sous le h1) ; pour les appels non (aucun `tel:`, pas d'urgence) | [fiche](veto-aplemont.md) |
| 24 oct 2026, tour 6 | Recherche étendue, rang 7 | https://www.insolite-beaute.fr/ | Institut de beauté, Saint-Étienne | Oui (la gérante se présente, RDV en un bouton, tarif, cartes cadeaux en ligne) ; aucun avis | [fiche](insolite-beaute.md) |
| 24 oct 2026, tour 6 | Recherche étendue, rang 4 | https://www.immobm.fr/ | Agence immobilière, Bordeaux (Bacalan) | Non pour le site (gabarit de plateforme, téléphone sans lien, 11 h1) ; les biens et le quartier tout de suite | [fiche](immobm.md) |
| 24 oct 2026, tour 6 | Framer Marketplace, Home Services, « Trending » rang 2, 59 $ | https://plumbzo.framer.website/ | Modèle plombier | Pour le premier écran oui (24/7 au-dessus du h1, « Call Now », note, délai) ; une seule page, pas de ville | [fiche](framer-plumbzo.md) |
| 24 oct 2026, tour 6 | Wix, Services & Maintenance, rang 6 | https://www.wix.com/demone2/brightnest-home | Modèle homme toutes mains | Non (ni ville, ni chiffre) ; le créneau de rappel au calendrier est le levier | [fiche](wix-brightnest-handyman.md) |
| 24 oct 2026, tour 6 | Squarespace, article « home services », 2e modèle | https://selene-fluid-demo.squarespace.com/ | Modèle architecte d'intérieur | Non (aucun appel, aucun `tel:`) ; vitrine de designer | [fiche](squarespace-selene.md) |

Méthode du 17 oct 2026 : métiers (chambres d'hôtes, ferronnerie d'art, électricien) et villes (Grenoble, Strasbourg,
Angers pour les agences ; Marseille, Paris, Rennes pour la recherche) tirés au hasard (`$RANDOM`). La recherche passe
par l'outil de recherche de la session, pas par un Google.fr : les rangs sont ceux de cet outil. Captures dans
`docs/veille/marche/captures/` (non versionnées, `.gitignore`), regardées une par une.

Méthode du 17 oct 2026, tour 2 : tirages `$RANDOM` notés dans chaque fiche. Villes des agences parmi les 24 des 30 plus grandes
villes hors Grenoble, Strasbourg, Angers, Marseille, Paris, Rennes : Tours, Tours (doublon, retiré sans Tours) → Le Mans, Limoges.
Recherche : métiers parmi les 19 de `docs/OBJECTIF.md` hors chambres d'hôtes, ferronnerie, électricien → photographe de mariage,
plombier-chauffagiste, coiffeur barbier ; villes → Lyon, Clermont-Ferrand, Nice. La recherche simple de l'outil de la session ne
rend que 9 résultats, tous annuaires, plateformes ou offres d'emploi pour les trois requêtes ; la recherche étendue sert de page 2
(rangs 10 et suivants). Modèles : ThemeForest « handyman » trié par ventes (rang 1), Squarespace (pas de chiffres de vente
publics : premier modèle de l'article officiel « home services »), Webflow sous-catégorie Home Services & Maintenance triée
« Popular » (rang 1, tri vérifié dans la page rendue par Chromium). Démontage `FF_CHROMIUM=1 ff demonter` pour les 9 sites (aucun
échec) ; une capture ordinateur sans feuille de style (BM Rénov) refaite à la main et regardée ; Auvergne Technique Plomberie
refuse `curl` (406), texte lu par WebFetch. Vitesse : premier octet et poids du HTML mesurés par `curl` depuis le proxy de la
session (indicatif). Captures regardées une par une.

Méthode du 17 oct 2026, tour 3 : **sans navigateur** (Chrome occupé par un autre processus) ; HTML et CSS récupérés par `curl`, fiches
remplies à la main au format de `ff demonter`, chacune marquée « mesuré sur le code, pas sur capture » ; pas de `.json` ni de
capture. Villes des agences parmi les 24 restantes hors Tours, Le Mans, Limoges et les six du tour 1 : `$RANDOM` → Bordeaux,
Perpignan, Dijon. Recherche : métiers parmi les 20 de `docs/OBJECTIF.md` hors ceux des tours 1 et 2 → architecte d'intérieur,
dentiste, traiteur ; villes → Rouen, Lille, Le Havre. Comme au tour 2, la recherche simple ne rend que des annuaires pour les trois
requêtes ; la recherche étendue sert de page suivante (rangs de cette recherche). Modèles : Framer catégorie Construction (ordre par
défaut, rang 1 ; Lintel rang 2 déjà fait), Wix Services & Maintenance (ordre par défaut, rang 2 ; rang 1 exploitation forestière,
hors métiers ; rang 3 Plumbing Bright déjà fait), ThemeForest « handyman » trié par ventes (rang 2 ; BuildPress rang 1 déjà fait ;
page lue par WebFetch, `curl` reçoit un 403). Vitesse : premier octet et poids du HTML mesurés par `curl` depuis le proxy de la
session (indicatif).

Méthode du 19 oct 2026, tour 4 : **sans navigateur** (Chrome occupé par un autre processus), comme au tour 3 ; HTML (et CSS quand il est
dans la page) récupérés par `curl` avec un User-Agent de navigateur ordinaire, fiches remplies à la main, chacune marquée « mesuré sur
le code, pas sur capture » ; pas de `.json` ni de capture. Villes des agences parmi les 21 des 30 plus grandes hors les neuf déjà faites
(Grenoble, Strasbourg, Angers, Tours, Le Mans, Limoges, Bordeaux, Perpignan, Dijon) : `$RANDOM` → Villeurbanne, Boulogne-Billancourt,
Brest ; Boulogne-Billancourt sans agence montrant un client artisan (Brava Labs : démos internes ; Artichaud Studio : grands comptes),
écartée, nouveau tirage parmi les 18 restantes → Nîmes. Recherche : métiers parmi les 18 de `docs/OBJECTIF.md` hors ceux des tours 1
à 3 → brasserie artisanale, boulangerie, couvreur ; villes parmi les 30 → Strasbourg, Rennes, Marseille. Comme aux tours 2 et 3, la
recherche simple ne rend aucun site d'artisan pour les trois requêtes ; la recherche étendue sert de page suivante (rangs de cette
recherche) ; Maison Lorand (rang 6 de « boulangerie Rennes ») écartée, elle appartient au réseau Le Grenier à Pain (35 boutiques, son
site le dit). Modèles : ThemeForest « local business » triée par ventes ne rend que des annuaires et des thèmes d'entreprise, d'où
« roofing » triée par ventes (rang 1) ; Squarespace non lisible sans navigateur (pages de modèles rendues en JavaScript), remplacé par
Wix Services & Maintenance (rang 4, les trois premiers hors métiers ou déjà faits) ; Framer catégorie Home Services, tri par défaut
« Trending » (rang 1). Activ'Sport (Wix) sert son contenu dans un élément personnalisé : texte lu dans le balisage de secours pour les
moteurs (`seoMarkup`), photos non mesurées. Vitesse : premier octet et poids du HTML mesurés par `curl` depuis le proxy de la session
(indicatif).

Méthode du 23 oct 2026, tour 5 : **sans navigateur** (Chrome occupé par un autre agent), comme aux tours 3 et 4 ; HTML (et CSS quand il
change la lecture : Divi, Elementor) récupérés par `curl` avec un User-Agent de navigateur ordinaire, fiches remplies à la main, chacune
marquée « mesuré sur le code, pas sur capture » ; pas de `.json` ni de capture. Villes des agences parmi les 18 des 30 plus grandes hors
les douze déjà faites (Grenoble, Strasbourg, Angers, Tours, Le Mans, Limoges, Bordeaux, Perpignan, Dijon, Villeurbanne, Brest, Nîmes ;
Boulogne-Billancourt écartée faute d'agence) : `$RANDOM` → Amiens, Montpellier, Marseille. À Marseille, ARTI13 écartée (aucun site
client réel dans ses réalisations), Biper Studio sans client artisan, ONDEV retenue. Recherche : métiers parmi les 15 de
`docs/OBJECTIF.md` hors ceux des tours 1 à 4 → avocat, auto-école, fleuriste ; villes parmi les 30 → Nîmes, Saint-Étienne, Le Mans.
Comme aux tours 2 à 4, la recherche simple ne rend que des annuaires et des plateformes pour les trois requêtes ; la recherche
étendue sert de page suivante (rangs de cette recherche) ; INRI'S (réseau de points de rendez-vous) écarté ; Touchard Fleurs gardé
(entreprise familiale de 6 boutiques dans un seul département, pas un réseau national). Modèles : Framer catégorie Home Services, tri
par défaut « Trending » (rang 1) ; Wix Services & Maintenance (ordre par défaut, rang 5, les quatre premiers déjà faits ou hors
métiers) ; ThemeForest « plumber » puis « handyman » triés par ventes : thèmes déjà étudiés, Exponent (générique) écarté, démos de
TheBuilt, Renovation (ProgressionStudios) et Spectrum refusées sans navigateur (403, défi Cloudflare), d'où CarPress (rang 5 de
« handyman ») ; pages ThemeForest lues par WebFetch. Squarespace non tenté (illisible sans navigateur au tour 4). Vitesse : premier
octet et poids du HTML mesurés par `curl` depuis le proxy de la session (indicatif).

Méthode du 24 oct 2026, tour 6 : **sans navigateur** (Chrome réservé à une autre tâche), comme aux tours 3 à 5 ; HTML récupéré par `curl` avec
un User-Agent de navigateur ordinaire (et des en-têtes `Accept` pour Signori&Figli, qui renvoie 403 sans eux), fiches remplies à la main,
chacune marquée « mesuré sur le code, pas sur capture » ; pas de `.json` ni de capture. Villes des agences parmi les 15 des 30 plus grandes
hors les quinze déjà faites (Boulogne-Billancourt écartée faute d'agence au tour 4) : `$RANDOM` → Nantes, Saint-Denis, Annecy. À Nantes, Fair
(page artisans, lien vers un exemple client ; sa page Réalisations est en JavaScript) ; à Saint-Denis, Redcat Studio (6 projets, un seul
artisan) ; à Annecy, Annecy Dev (indépendant, premier projet du portfolio), les agences trouvées d'abord n'ayant aucun lien client dans leur
HTML. Recherche : métiers parmi les 12 de `docs/OBJECTIF.md` hors ceux des tours 1 à 5 (premier tirage vétérinaire, doublon retiré)
→ vétérinaire, institut de beauté, agence immobilière ; villes parmi les 30 (doublon retiré) → Le Havre, Saint-Étienne, Bordeaux. Comme aux
tours 2 à 5, la recherche simple ne rend que des annuaires, des plateformes et des réseaux ; la recherche étendue sert de page suivante
(rangs de cette recherche) ; écartés : Santoria (thème du groupe IVC Evidensia dans son HTML), Maison Blanche (6 agences dans 4
départements), Recherche Appartement ou Maison (« notre réseau d'agences »). Modèles : Framer Home Services, tri par défaut « Trending »
(rang 2, Servora et PlumFix déjà faits) ; Wix Services & Maintenance (ordre par défaut, rang 6, les cinq premiers déjà faits ou hors
métiers ; démo trouvée par la page `website-template/view/html/wh-1362`) ; ThemeForest « local business » trié par ventes ne rend que des
annuaires, des thèmes d'entreprise et CarPress (déjà fait), d'où Squarespace : ses pages de catégories rendent le même HTML générique
sans JavaScript, on a pris le deuxième modèle de l'article officiel « home services » (Selene ; Sawyer, premier, fait au tour 2).
Vitesse : premier octet et poids du HTML mesurés par `curl` depuis le proxy de la session (indicatif).
