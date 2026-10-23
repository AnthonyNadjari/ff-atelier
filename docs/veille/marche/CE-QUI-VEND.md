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

45 sites au 23 oct 2026, tour 5 (30 sites d'artisans ou de professionnels, 15 modèles). Un site compte s'il a le levier sur l'accueil ou dans sa nav.
Les comptes des tours 1 à 3 sont gardés tels quels ; les tours 3, 4 et 5 ajoutent chacun 9 sites démontés **sur le code, sans capture**
(aucun navigateur disponible) : les leviers de position (« au premier écran ») y sont lus dans l'ordre du HTML, la couverture des
bannières cookies n'y est pas mesurée. Pourcentage donné à partir de 40 %. Entre parenthèses après le compte : la variation du tour 5.

| Levier | Sites qui l'ont | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Plusieurs pages (pas un site d'une page) | 42 / 45 (93 % ; +9 / 9) | tous sauf [Rami](rami-entretien.md), [Refit](framer-refit.md) et [Jacques Couverture](jacques-couverture.md) (une page à ancres + Contact) ; les plus fournis du tour 5 : [Incoma Domia](incoma-domia.md) (environ 100 pages), [Touchard Fleurs](touchard-fleurs.md) (environ 65) | Oui : une page par service, pages villes en option (`seo.cityPages`) |
| Avis ou témoignages affichés | 33 / 45 (73 % ; +8 / 9) | [Ouest Car](garage-ouestcar.md) (103 avis Google), [Sud Mécanique](sud-mecanique.md) (119 avis à 4,4 sous un titre « Avis Google Vérifiés »), [Incoma Domia](incoma-domia.md) (avis datés par chantier) ; [Perfect Permis](perfect-permis.md) compté pour sa page « Avis » dans la nav ; seul sans avis au tour 5 : [L'Atelier Bois Acier](atelier-bois-acier.md) | Oui (`proof/google`, `testimonials`), seulement s'ils sont fournis |
| Une page par service ou par offre | 31 / 45 (69 % ; +6 / 9) | [Dr Debouvry](dentiste-cormontaigne.md) (une page par soin), [Sud Mécanique](sud-mecanique.md) (vidange, embrayage, injecteurs… et une page par offre), [EMS Avocats](ems-avocats.md) (une page par domaine) | Oui (`src/pages/services/[slug].astro`) |
| Année de création ou années de métier | 29 / 45 (64 % ; +8 / 9) | [Prat](prat-depannage.md) (depuis 1987), [Incoma Domia](incoma-domia.md) (« depuis 1959 » sous le h1), [Touchard Fleurs](touchard-fleurs.md) (« entreprise familiale depuis 1986 ») ; [Sud Mécanique](sud-mecanique.md) non compté (« ans d'expérience » sans chiffre dans le HTML) | Oui, en texte « Depuis 1998 » (`business.since`) ; le badge et le « X ans » calculé restent refusés (docs/GOUT.md § 2) |
| Métier + ville dans le titre ou la première phrase | 28 / 45 (62 % ; +5 / 9) | [S Elec](s-elec.md) (« Électricien à Rennes »), [Sud Mécanique](sud-mecanique.md) (« Garage … à Château-Gombert, Marseille 13013 » dans le h1), [Perfect Permis](perfect-permis.md) (« Auto-école à Saint-Étienne ») ; contre-exemple : [EMS Avocats](ems-avocats.md) (Nîmes seulement dans la description) | Oui (test du hero, docs/REDACTION.md ; `hero-metier` « <métier> à <ville> » dans les heros) |
| Téléphone cliquable visible en haut | 26 / 45 (58 % ; +7 / 9) | [Securya](securya.md), [EMS Avocats](ems-avocats.md) (« Garde à vue 7j/7 » + numéro en tête), [CarPress](tf-carpress.md) (« Tap here to call us », tout premier élément) ; contre-exemples : [Touchard Fleurs](touchard-fleurs.md) (**aucun numéro sur l'accueil**), [Servora](framer-servora.md), [Grand-Père Jules](grand-pere-jules.md) | Oui (porte « Appeler » des navs, `cta/phone-giant`) |
| Rubrique conseils, actualités ou journal | 21 / 45 (47 % ; +6 / 9) | [Ouest Car](garage-ouestcar.md) (Conseils auto), [Sud Mécanique](sud-mecanique.md) (3 articles datés sur l'accueil), [L'Atelier Bois Acier](atelier-bois-acier.md) (« En direct de l'atelier » : les réalisations publiées comme articles) | **Fait le 17 oct 2026** : `conseils` dans le schéma, `/conseils` + une page par article + lien de nav, seulement si le client a des articles |
| Vraies photos de l'entreprise | 21 / 45 (47 % ; +2 / 9 ; les 15 modèles : banque ou démonstration ; non comptés faute de pouvoir le lire dans le code : [Securya](securya.md), [Activ'Sport](activsport.md), [Grand-Père Jules](grand-pere-jules.md), [Sud Mécanique](sud-mecanique.md), [Perfect Permis](perfect-permis.md)) | [Villa d'Orient](villadorient.md) (~20), [Chez Bex](chez-bex.md) (~24), [Touchard Fleurs](touchard-fleurs.md) (une quarantaine de bouquets de la maison), [L'Atelier Bois Acier](atelier-bois-acier.md) (atelier, pièces nommées) ; contre-exemples : [Incoma Domia](incoma-domia.md) (logos, photos de fabricants, une photo de banque), [EMS Avocats](ems-avocats.md) (statue et icônes) | Dépend du client : guide photo, `ff images` ; jamais de banque présentée comme « le client » |
| Formulaire sur l'accueil | 20 / 45 (44 % ; +5 / 9) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (dès le premier écran), [Plumbing Blue](wix-plumbing-blue.md) (**réservation avec calendrier au premier écran**), [CarPress](tf-carpress.md) (devis avec photo jointe) | Oui (`contact/form-*`) |
| Bouton devis ou estimation nommé | 19 / 45 (42 % ; +4 / 9) | [BM Rénov](bm-renov.md) (« Devis gratuit »), [Incoma Domia](incoma-domia.md) (« Devis Rapide Gratuit - Sous 48h »), [Servora](framer-servora.md) (« Get a Free Quote ») | Oui (porte « Devis », `wording.devis`) |
| Label, réseau, licence, assurance ou certification | 17 / 45 (38 % ; +4 / 9) | [Abers Couverture](abers-couverture.md) (RGE Qualibat), [Incoma Domia](incoma-domia.md) (3 logos RGE juste sous le h1), [Sud Mécanique](sud-mecanique.md) (réseau AD Expert dans le h1, réparateur agréé Smart), [Servora](framer-servora.md) (« Licensed & Insured ») | En partie : `business.insurance` s'affiche dans les 6 heros (« Assuré décennale ») ; `business.certifications` (RGE, Qualibat…) seulement dans `about/portrait`, `about/overlap`, `footer/columns`, `proof/logos` et les pages `porte`, jamais au premier écran de l'accueil |
| … dont au premier écran | 6 / 45 relevés (+3 / 9) | [Maison Stamm](maisonstamm.md), [BM Rénov](bm-renov.md), [Rami](rami-entretien.md), [Incoma Domia](incoma-domia.md), [Sud Mécanique](sud-mecanique.md), [Servora](framer-servora.md) | Assurance : oui (6 heros sur 6). Certifications : non (aucun hero ne lit `certifications`) |
| Zone desservie dans le premier écran | 14 / 45 (31 % ; +3 / 9) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (8 communes en pastilles), [Incoma Domia](incoma-domia.md) (10 communes dans la nav), [EMS Avocats](ems-avocats.md) (« à Nîmes et à distance dans toute la France ») | En partie : `zones.cities` est lu au premier écran par 2 heros sur 6 (`typographic`, `marquee`) ; ailleurs dans la section `zones` |
| Chiffre de volume (« 4 000 clients ») | 14 / 45 (+3 / 9) | [Securya](securya.md) (« 800 sites sécurisés »), [Touchard Fleurs](touchard-fleurs.md) (6 boutiques, 25 salariés, 107 références), [Bendorf](bendorf.md) | Pas de champ dédié ; seulement si le client le donne (règle dure 2) |
| Logos de clients, partenaires ou certificats | 14 / 45 (+3 / 9) | [S Elec](s-elec.md) (Carrefour, Intermarché…), [Incoma Domia](incoma-domia.md) (16 marques), [Perfect Permis](perfect-permis.md) (Codes Rousseau) | Oui (`proof/logos`) |
| Garantie écrite | 12 / 45 (+2 / 9) | [Lintel](framer-lintel.md) (10 ans structure), [Maison Stamm](maisonstamm.md) (à vie), [Sud Mécanique](sud-mecanique.md) (« garantie à vie » sur la carrosserie) | Pas de champ ; texte du client seulement |
| Prix « à partir de » ou page tarifs | 11 / 45 (24 % ; +5 / 9) | [Grégory Cros](photo-lyon-cros.md) (« dès 390 € » dans le h1), [Servora](framer-servora.md) (prix et durée sous chaque service), [Touchard Fleurs](touchard-fleurs.md) (fourchette sous chaque bouquet), [EMS Avocats](ems-avocats.md) (abonnement à 49 € par mois dans la nav) | Oui (`services[].priceFrom`) |
| Délais chiffrés (rappel, devis, livraison) | 9 / 45 (+3 / 9) | [BM Rénov](bm-renov.md) (« Devis sous 48 h »), [Incoma Domia](incoma-domia.md) (devis sous 48 h), [Touchard Fleurs](touchard-fleurs.md) (livraison en 4 h dans 130 communes) | Texte du client seulement (`wording.ctaText`) |
| Bannière cookies qui couvre le premier écran (contre-levier) | 4 / 18 mesurés (présente, couverture non mesurée sans capture : 6 / 9 au tour 3, 3 / 9 au tour 4, 4 / 9 au tour 5) | [Cordonnerie d'Axel](cordonnerie-axel.md) (100 %, bloquante), [Auvergne Technique Plomberie](auvergne-plomberie.md) (51 % du téléphone) ; sans bannière au tour 5 : [Sud Mécanique](sud-mecanique.md), [EMS Avocats](ems-avocats.md) | Jamais : aucun traceur, aucune bannière (avantage à dire au client) |
| Gérant en photo et à la première personne au premier écran | 3 / 45 mesurés (aucun au tour 5) | [Phenix](phenix-ferronnerie.md), [Grégory Cros](photo-lyon-cros.md), [Sawyer](squarespace-sawyer.md) ; [L'Atelier Bois Acier](atelier-bois-acier.md) (le gérant parle à la première personne juste sous le h1, sans photo de lui lisible) non compté | Possible (`about/portrait`, `images.portrait`), jamais au premier écran : aucun hero ne lit `images.portrait` |
| Barre d'actions collée en bas sur téléphone | 2 / 45 (aucune lue au tour 5) | [Lintel](framer-lintel.md) (Appeler / SMS / Estimation), [Cordonnerie d'Axel](cordonnerie-axel.md) | Oui (`layout.actionBar`) |

Leviers relevés à partir du tour 2 (comptés sur les 36 sites des tours 2 à 5, à recompter sur les 9 du tour 1) :

| Levier | Sites des tours 2 à 5 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Gérant ou équipe en photo quelque part sur l'accueil | 11 / 36 (+4 / 9) | [BM Rénov](bm-renov.md), [Dr Debouvry](dentiste-cormontaigne.md), [Touchard Fleurs](touchard-fleurs.md) (photo d'équipe), [Plumbing Blue](wix-plumbing-blue.md) (3 personnes nommées dès la deuxième section) ; [EMS Avocats](ems-avocats.md) nomme ses 3 associés sans photo (non compté) | Oui (`about/portrait`, `about/overlap`, `about.team`) |
| FAQ sur l'accueil | 11 / 36 (+4 / 9) | [Rami](rami-entretien.md), [L'Atelier Bois Acier](atelier-bois-acier.md) (zone, pose, budget, essences), [EMS Avocats](ems-avocats.md) (6 questions), [Sud Mécanique](sud-mecanique.md) | Oui (`faq/*`) |
| Badges de réassurance sous le titre (devis gratuit, assurance, délai, 7j/7) | 11 / 36 (+5 / 9) | [BM Rénov](bm-renov.md), [Sud Mécanique](sud-mecanique.md) (« 4,4/5 sur Google · Garage AD Expert · Devis gratuit »), [Servora](framer-servora.md) (500+ projets, 4.9/5, 10+ ans, « Licensed & Insured ») | Oui (liste sous les boutons des 6 heros : depuis, 24 h/24, décennale, note Google) |
| Note Google ou preuve sociale au premier écran | 9 / 36 (25 % ; +4 / 9) | [Securya](securya.md) et [Incoma Domia](incoma-domia.md) (**au-dessus du h1** : « 5/5 sur 36 avis »), [Plumbing Blue](wix-plumbing-blue.md) (sous le formulaire de rendez-vous) | Oui (`proof.google` dans les heros) ; un témoignage au premier écran : non |
| Urgence 24/7 ou 7j/7 au premier écran | 7 / 36 (+1 / 9) | [Auvergne Technique Plomberie](auvergne-plomberie.md), [Jacques Couverture](jacques-couverture.md), [EMS Avocats](ems-avocats.md) (« Garde à vue 7j/7 » en tête) | Oui (`contact.emergency24h` dans les heros) |
| Prise de rendez-vous ou réservation en ligne | 7 / 36 (+2 / 9) | [Dr Debouvry](dentiste-cormontaigne.md), [Sud Mécanique](sud-mecanique.md) (« Réserver en ligne » sous le h1), [Plumbing Blue](wix-plumbing-blue.md) (calendrier au premier écran) | Oui (`contact.bookingUrl`, porte « Réserver ») |
| Liste de communes + carte sur l'accueil | 4 / 36 (aucune carte lue au tour 5 ; listes sans carte : [Sud Mécanique](sud-mecanique.md), [Perfect Permis](perfect-permis.md), [Servora](framer-servora.md)) | [BM Rénov](bm-renov.md), [RConstruction](rconstruction.md), [Abers Couverture](abers-couverture.md) | Oui (`zones/*`, carte sans traceur) |
| Bouton d'appel flottant sur téléphone | 3 / 36 (aucun lu aux tours 4 et 5) | [Grégory Cros](photo-lyon-cros.md), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Rami](rami-entretien.md) | Oui sous forme de barre (`layout.actionBar`) |

Leviers relevés à partir du tour 3 (comptés sur les 27 sites des tours 3 à 5) :

| Levier | Sites des tours 3 à 5 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Restes du modèle en ligne (numéro factice, code du thème, texte ou photos d'un autre client) : contre-levier | 6 / 27 (+1 / 9) | [Rami](rami-entretien.md) (`tel: 123456789`), [Grand-Père Jules](grand-pere-jules.md) (« [cstmPhoneNumber] »), [Touchard Fleurs](touchard-fleurs.md) (mots anglais du thème dans le menu, deux notes qui se contredisent) | En partie : la garde « données de test » (`scripts/ff/garde-donnees.mjs`) bloque 06 00 00 00 00, 75000 et le contenu de `_exemple`, pas un `tel:` factice générique ; un code court non rendu ne peut pas arriver (pas de thème WordPress) |
| Réalisations datées, chiffrées ou localisées | 4 / 27 (+1 / 9) | [Chez Bex](chez-bex.md) (« 150 convives, 12.06.2025 »), [Abers Couverture](abers-couverture.md), [L'Atelier Bois Acier](atelier-bois-acier.md) (banque d'accueil d'une auto-école amiénoise, bureau d'une artiste, essence nommée) | En partie : `place`, `kind`, `size`, `client` par réalisation dans `proof/gallery` (schéma, optionnels) ; pas de date |
| Une page par ville desservie | 4 / 27 (+2 / 9) | [Securya](securya.md) (10 villes), [Incoma Domia](incoma-domia.md) (10 communes), [Sud Mécanique](sud-mecanique.md) (9 quartiers et communes) | Oui (`seo.cityPages`, une page `/zones/<ville>`) |
| Seuil de commande au premier écran | 1 / 27 | [Chez Bex](chez-bex.md) | Texte du client seulement |

Leviers relevés à partir du tour 4 (comptés sur les 18 sites des tours 4 et 5) :

| Levier | Sites des tours 4 et 5 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Nouvelle du moment en tête de page ou dans la nav (nouveauté, saison, fermeture, offre datée) | 5 / 18 (28 % ; +2 / 9) | [Bendorf](bendorf.md) (bière éphémère), [Sud Mécanique](sud-mecanique.md) (**2 offres « du 5 octobre au 30 novembre 2026 »** avec le téléphone dessous), [Touchard Fleurs](touchard-fleurs.md) (« Toussaint » en premier lien de nav et en premier écran, mis à jour en octobre), [Omnisol](omnisol.md) (congés d'été encore affichés en octobre : la version ratée) | Non : aucun champ d'annonce datée ; `conseils` (articles) est le plus proche, sans place en tête de page |
| Contenu ou chiffres qui n'existent qu'avec JavaScript (contre-levier) | 4 / 18 (+1 / 9) | [Activ'Sport](activsport.md), [PlumFix](framer-plumfix.md), [Sud Mécanique](sud-mecanique.md) (6 compteurs sans chiffre dans le HTML) | Pages statiques ; mais `data-counter` du moteur écrit aussi 0 dans le HTML (vitrine `sites/_effets`) |
| Offre d'entrée gratuite ou remise comme porte d'action | 3 / 18 (+1 / 9 ; + [Securya](securya.md), compté en devis au tour 3) | [Activ'Sport](activsport.md) (séance offerte), [Wix Electrician](wix-galvanic-electrician.md) (-15 %), [Sud Mécanique](sud-mecanique.md) (-30 % et lecture des codes défauts offerte) | Texte seulement (`wording.devis`, `wording.ctaText`) ; pas de champ « offre » |
| Vidéo de la maison ou témoignage vidéo | 3 / 18 (+1 / 9) | [Bendorf](bendorf.md), [Activ'Sport](activsport.md), [L'Atelier Bois Acier](atelier-bois-acier.md) (visite vidéo de l'atelier) | Hero vidéo oui (`hero/video`, `ff video`) ; témoignage vidéo non |
| Commande à retirer, livraison ou location en boutique | 3 / 18 (+1 / 9) | [Grand-Père Jules](grand-pere-jules.md), [Bendorf](bendorf.md), [Touchard Fleurs](touchard-fleurs.md) (boutique en ligne, retrait ou livraison en 4 h) | Non (pas de commande ; formulaire de contact générique) |
| Calculateur d'estimation en ligne | 1 / 18 | [Renovate](tf-renovate.md) | Non |

Leviers relevés pour la première fois au tour 5 (comptés sur ses 9 sites) :

| Levier | Sites du tour 5 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Horaires au premier écran ou en barre haute | 3 / 9 | [Sud Mécanique](sud-mecanique.md) (horaires en barre haute), [Incoma Domia](incoma-domia.md) (heures où le standard décroche, sous le h1), [CarPress](tf-carpress.md) (la semaine entière juste sous le carrousel) | En partie : horaires du jour au premier écran dans les coquilles `carte`, `lieu-fixe` et `split` (`HorairesDuJour`) ; ailleurs en contact et en pied |
| Plusieurs établissements, chacun avec adresse et horaires | 2 / 9 | [Touchard Fleurs](touchard-fleurs.md) (6 boutiques, horaires de chacune sur l'accueil), [Incoma Domia](incoma-domia.md) (2 accueils, la personne à joindre) | Non : une seule adresse par site (`contact.address`, `contact.hours`) |
| Parcours du client en étapes (« comment se déroule votre dossier ») | 2 / 9 | [EMS Avocats](ems-avocats.md) (4 étapes), [Servora](framer-servora.md) (« Four steps ») | Oui (`process/steps`, `numbered`, `timeline`, `horizon`) |
| Deux publics séparés dans la nav (particuliers / professionnels) | 2 / 9 (+ [Omnisol](omnisol.md) au tour 4) | [EMS Avocats](ems-avocats.md) (Entreprises / Particuliers), [Touchard Fleurs](touchard-fleurs.md) (« Professionnels ») | Non : pas de champ ; une page de service par public est possible à la main |
| Avant / après à glisser | 1 / 9 | [Servora](framer-servora.md) | Oui (`proof/before-after`) |
| Devis avec photo jointe (« envoyez la photo du problème ») | 1 / 9 | [CarPress](tf-carpress.md) (champ « Attach photo ») | Non : le formulaire n'accepte pas de pièce jointe |

**Prochain levier ≥ 40 % absent de l'usine** : aucun. Tous les leviers à 40 % ou plus (pages multiples, avis, page par service, années,
métier + ville, téléphone en haut, conseils, vraies photos, formulaire, devis) existent dans le schéma et les sections.
Ce qui a bougé au tour 5 : **le téléphone en haut remonte de 53 % à 58 %** (7 sites sur 9) ; **la rubrique conseils passe de 42 % à 47 %**
et **le formulaire de 42 % à 44 %** ; le bouton devis reste à 42 % ; **les vraies photos retombent de 53 % à 47 %** (2 sites sur 9
seulement en montrent de lisibles, 3 non lisibles dans le code) ; **les labels montent de 36 % à 38 %** (17 / 45) et passent de 3 à 6 au
premier écran (RGE sous le h1, réseau dans le h1, « Licensed & Insured ») : toujours le prochain à franchir 40 %, et l'usine ne les met
jamais dans un hero ; **la note Google au premier écran passe de 19 % à 25 %** (deux fois au-dessus du h1) ; **le prix écrit passe de
17 % à 24 %** (5 sites sur 9 : fourchettes, « From $85 », abonnement mensuel). Points à surveiller : nouvelle du moment ou offre datée
(5 / 18, aucun champ dans l'usine) ; horaires au premier écran (3 / 9, seulement dans 3 coquilles) ; plusieurs établissements (2 / 9,
aucun champ) ; compteurs vides sans JavaScript (4 / 18), que le moteur de l'usine reproduit.

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
