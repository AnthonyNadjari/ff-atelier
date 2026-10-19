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

36 sites au 19 oct 2026, tour 4 (24 sites d'artisans, 12 modèles). Un site compte s'il a le levier sur l'accueil ou dans sa nav.
Les comptes des tours 1 à 3 sont gardés tels quels ; les tours 3 et 4 ajoutent chacun 9 sites démontés **sur le code, sans capture**
(aucun navigateur disponible) : les leviers de position (« au premier écran ») y sont lus dans l'ordre du HTML, la couverture des
bannières cookies n'y est pas mesurée. Pourcentage donné à partir de 40 %.

| Levier | Sites qui l'ont | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Plusieurs pages (pas un site d'une page) | 33 / 36 (92 %) | tous sauf [Rami](rami-entretien.md), [Refit](framer-refit.md) et [Jacques Couverture](jacques-couverture.md) (une page à ancres + Contact) ; le plus fourni du tour 4 : [Abers Couverture](abers-couverture.md) (environ 25 pages) | Oui : une page par service, pages villes en option (`seo.cityPages`) |
| Avis ou témoignages affichés | 25 / 36 (69 %) | [Ouest Car](garage-ouestcar.md) (103 avis Google), [Jacques Couverture](jacques-couverture.md) (110 avis à 4,9, une trentaine affichés juste sous le h1), [Activ'Sport](activsport.md) (8 avis signés dont une vidéo) | Oui (`proof/google`, `testimonials`), seulement s'ils sont fournis |
| Une page par service ou par offre | 25 / 36 (69 %) | [Dr Debouvry](dentiste-cormontaigne.md) (une page par soin), [Abers Couverture](abers-couverture.md) (une page par matériau), [Bendorf](bendorf.md) (bières, consigne, location de tireuse) | Oui (`src/pages/services/[slug].astro`) |
| Métier + ville dans le titre ou la première phrase | 23 / 36 (64 %) | [S Elec](s-elec.md) (« Électricien à Rennes »), [Bendorf](bendorf.md) (« Brasserie artisanale à Neudorf, Strasbourg »), [Omnisol](omnisol.md) (« Solier-Moquettiste à Nîmes ») | Oui (test du hero, docs/REDACTION.md ; `hero-metier` « <métier> à <ville> » dans les heros) |
| Année de création ou années de métier | 21 / 36 (58 %) | [Prat](prat-depannage.md) (depuis 1987), [Abers Couverture](abers-couverture.md) (depuis 2002), [Grand-Père Jules](grand-pere-jules.md) (« certifiée Bio depuis 1990 ») | Oui, en texte « Depuis 1998 » (`business.since`) ; le badge et le « X ans » calculé restent refusés (docs/GOUT.md § 2) |
| Vraies photos de l'entreprise | 19 / 36 (53 % ; les 12 modèles : banque ou démonstration ; non comptés faute de pouvoir le lire dans le code : [Securya](securya.md), [Activ'Sport](activsport.md), [Grand-Père Jules](grand-pere-jules.md)) | [Villa d'Orient](villadorient.md) (~20), [Chez Bex](chez-bex.md) (~24), [Omnisol](omnisol.md) (poses prises au téléphone) ; contre-exemple : [Jacques Couverture](jacques-couverture.md) (banque d'images + photos nommées d'un couvreur de Valenciennes) | Dépend du client : guide photo, `ff images` ; jamais de banque présentée comme « le client » |
| Téléphone cliquable visible en haut | 19 / 36 (53 %) | [Securya](securya.md) (deux numéros + « 7j/7 8h-20h »), [Jacques Couverture](jacques-couverture.md) (« Une urgence ? 7j/7 24h/24 » + bouton), [Abers Couverture](abers-couverture.md) ; contre-exemples : [Rami](rami-entretien.md), [Constructo](tf-constructo.md), [Bendorf](bendorf.md) (numéro sans lien), [Grand-Père Jules](grand-pere-jules.md) (« [cstmPhoneNumber] » affiché à la place du numéro) | Oui (porte « Appeler » des navs, `cta/phone-giant`) |
| Formulaire sur l'accueil | 15 / 36 (42 %) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (dès le premier écran), [Securya](securya.md) (10 champs), [Grand-Père Jules](grand-pere-jules.md) (avec « point de retrait » : quelle boutique) | Oui (`contact/form-*`) |
| Bouton devis ou estimation nommé | 15 / 36 (42 %) | [BM Rénov](bm-renov.md) (« Devis gratuit »), [Jacques Couverture](jacques-couverture.md) (« Obtenir un devis »), [Renovate](tf-renovate.md) (« Request a quote » vers un calculateur) | Oui (porte « Devis », `wording.devis`) |
| Rubrique conseils, actualités ou journal | 15 / 36 (42 %) | [Ouest Car](garage-ouestcar.md) (Conseils auto), [Abers Couverture](abers-couverture.md) (Actus / Conseils, lien en barre haute), [Activ'Sport](activsport.md) (Blog) | **Fait le 17 oct 2026** : `conseils` dans le schéma, `/conseils` + une page par article + lien de nav, seulement si le client a des articles |
| Label, réseau, licence, assurance ou certification | 13 / 36 (36 %) | [Maison Stamm](maisonstamm.md) (Savoir-faire alsacien), [Abers Couverture](abers-couverture.md) (RGE Qualibat en logo, trophée CELIA), [Grand-Père Jules](grand-pere-jules.md) (agrément bio avec son numéro), [Omnisol](omnisol.md) (RC pro) | En partie : `business.insurance` s'affiche dans les 6 heros (« Assuré décennale ») ; `business.certifications` (RGE, Qualibat…) seulement dans `about/portrait`, `about/overlap`, `footer/columns`, `proof/logos`, jamais au premier écran |
| … dont au premier écran | 3 / 36 relevés (aucun au tour 4) | [Maison Stamm](maisonstamm.md), [BM Rénov](bm-renov.md), [Rami](rami-entretien.md) (décennale dans la phrase sous le h1) | Assurance : oui (6 heros sur 6). Certifications : non (aucun hero ne lit `certifications`) |
| Zone desservie dans le premier écran | 11 / 36 (31 %) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (8 communes en pastilles), [Abers Couverture](abers-couverture.md) (« dans le Finistère » dans le h1), [Jacques Couverture](jacques-couverture.md) (« Marseille et ses alentours ») | En partie : `zones.cities` est lu au premier écran par 2 heros sur 6 (`typographic`, `marquee`) ; ailleurs dans la section `zones` |
| Chiffre de volume (« 4 000 clients ») | 11 / 36 | [Securya](securya.md) (« 800 sites sécurisés »), [Activ'Sport](activsport.md) (« +1000 personnes accompagnées » sous le bouton), [Bendorf](bendorf.md) (120 000 bouteilles consignées, 174 bières, 23 t de drêches) | Pas de champ dédié ; seulement si le client le donne (règle dure 2) |
| Logos de clients, partenaires ou certificats | 11 / 36 | [S Elec](s-elec.md) (Carrefour, Intermarché…), [Securya](securya.md), [Abers Couverture](abers-couverture.md) (RGE) | Oui (`proof/logos`) |
| Garantie écrite | 10 / 36 | [Lintel](framer-lintel.md) (10 ans structure), [Maison Stamm](maisonstamm.md) (à vie), [Omnisol](omnisol.md) (« garanties de 15 à 25 ans selon le fournisseur ») | Pas de champ ; texte du client seulement |
| Prix « à partir de » ou page tarifs | 6 / 36 (aucun au tour 4) | [Grégory Cros](photo-lyon-cros.md) (« dès 390 € » dans le h1), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Ekilibr](ekilibr.md) | Oui (`services[].priceFrom`) |
| Délais chiffrés (rappel, devis, livraison) | 6 / 36 (aucun au tour 4) | [BM Rénov](bm-renov.md) (« Devis sous 48 h »), [Rami](rami-entretien.md), [RConstruction](rconstruction.md) | Texte du client seulement (`wording.ctaText`) |
| Bannière cookies qui couvre le premier écran (contre-levier) | 4 / 18 mesurés (présente, couverture non mesurée sans capture : 6 / 9 au tour 3, 3 / 9 au tour 4) | [Cordonnerie d'Axel](cordonnerie-axel.md) (100 %, bloquante), [Auvergne Technique Plomberie](auvergne-plomberie.md) (51 % du téléphone), [Prat](prat-depannage.md) | Jamais : aucun traceur, aucune bannière (avantage à dire au client) |
| Gérant en photo et à la première personne au premier écran | 3 / 36 mesurés | [Phenix](phenix-ferronnerie.md), [Grégory Cros](photo-lyon-cros.md), [Sawyer](squarespace-sawyer.md) ; [Ekilibr](ekilibr.md) et [Grand-Père Jules](grand-pere-jules.md) (« Estelle et Kevin » juste sous le h1, sans photo lisible) non comptés | Possible (`about/portrait`, `images.portrait`), jamais au premier écran : aucun hero ne lit `images.portrait` |
| Barre d'actions collée en bas sur téléphone | 2 / 36 | [Lintel](framer-lintel.md) (Appeler / SMS / Estimation), [Cordonnerie d'Axel](cordonnerie-axel.md) | Oui (`layout.actionBar`) |

Leviers relevés à partir du tour 2 (comptés sur les 27 sites des tours 2 à 4, à recompter sur les 9 du tour 1) :

| Levier | Sites des tours 2 à 4 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Gérant ou équipe en photo quelque part sur l'accueil | 7 / 27 | [BM Rénov](bm-renov.md), [Dr Debouvry](dentiste-cormontaigne.md), [Bendorf](bendorf.md) (photo d'équipe en pied), [PlumFix](framer-plumfix.md) (6 personnes nommées par rôle) ; [Activ'Sport](activsport.md) nomme le gérant et 3 coachs (photos non mesurées, non compté) | Oui (`about/portrait`, `about/overlap`, `about.team`) |
| FAQ sur l'accueil | 7 / 27 | [Rami](rami-entretien.md), [Ekilibr](ekilibr.md), [Activ'Sport](activsport.md) (8 questions : douleur, contre-indications, durée), [PlumFix](framer-plumfix.md) (délai d'arrivée, prix annoncé d'avance, assurance) | Oui (`faq/*`) |
| Badges de réassurance sous le titre (devis gratuit, assurance, délai, 7j/7) | 6 / 27 | [BM Rénov](bm-renov.md), [Securya](securya.md), [Activ'Sport](activsport.md) (« Aucun paiement demandé », note, volume), [PlumFix](framer-plumfix.md) | Oui (liste sous les boutons des 6 heros : depuis, 24 h/24, décennale, note Google) |
| Urgence 24/7 ou 7j/7 au premier écran | 6 / 27 | [Auvergne Technique Plomberie](auvergne-plomberie.md), [Securya](securya.md), [Jacques Couverture](jacques-couverture.md), [PlumFix](framer-plumfix.md) | Oui (`contact.emergency24h` dans les heros) |
| Prise de rendez-vous ou réservation en ligne | 5 / 27 | [Cordonnerie d'Axel](cordonnerie-axel.md), [Dr Debouvry](dentiste-cormontaigne.md), [Wix Electrician](wix-galvanic-electrician.md) (« Book Now », une page par service réservable) | Oui (`contact.bookingUrl`, porte « Réserver ») |
| Note Google ou preuve sociale au premier écran | 5 / 27 | [Securya](securya.md) (**au-dessus du h1**), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Activ'Sport](activsport.md) (« 125 avis Google, 5/5 » sous le bouton) | Oui (`proof.google` dans les heros) ; un témoignage au premier écran : non |
| Liste de communes + carte sur l'accueil | 4 / 27 | [BM Rénov](bm-renov.md), [RConstruction](rconstruction.md), [Abers Couverture](abers-couverture.md) (« Finistère nord » + carte en image) | Oui (`zones/*`, carte sans traceur) |
| Bouton d'appel flottant sur téléphone | 3 / 27 (aucun lu au tour 4) | [Grégory Cros](photo-lyon-cros.md), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Rami](rami-entretien.md) | Oui sous forme de barre (`layout.actionBar`) |

Leviers relevés à partir du tour 3 (comptés sur les 18 sites des tours 3 et 4) :

| Levier | Sites des tours 3 et 4 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Restes du modèle en ligne (numéro factice, code du thème, texte ou photos d'un autre client) : contre-levier | 5 / 18 | [Rami](rami-entretien.md) (`tel: 123456789`), [Ekilibr](ekilibr.md), [Wix Home Remodeling](wix-home-remodeling.md), [Grand-Père Jules](grand-pere-jules.md) (« [cstmPhoneNumber] » en tête de page), [Jacques Couverture](jacques-couverture.md) (photos « valenciennes-anzin », ancre « Nos réalisations » morte) | En partie : la garde « données de test » (`scripts/ff/garde-donnees.mjs`) bloque 06 00 00 00 00, 75000 et le contenu de `_exemple`, pas un `tel:` factice générique ; un code court non rendu ne peut pas arriver (pas de thème WordPress) |
| Réalisations datées, chiffrées ou localisées | 3 / 18 | [Chez Bex](chez-bex.md) (« 150 convives, 12.06.2025 »), [RConstruction](rconstruction.md), [Abers Couverture](abers-couverture.md) (« Brest Moulin Blanc ») | En partie : `place`, `kind`, `size`, `client` par réalisation dans `proof/gallery` (schéma, optionnels) ; pas de date |
| Une page par ville desservie | 2 / 18 | [Securya](securya.md) (10 villes), [Ekilibr](ekilibr.md) | Oui (`seo.cityPages`, une page `/zones/<ville>`) |
| Seuil de commande au premier écran | 1 / 18 | [Chez Bex](chez-bex.md) | Texte du client seulement |

Leviers relevés pour la première fois au tour 4 (comptés sur ses 9 sites) :

| Levier | Sites du tour 4 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Nouvelle du moment en tête de page ou dans la nav (nouveauté, saison, fermeture) | 3 / 9 | [Bendorf](bendorf.md) (« La dernière bière éphémère », une tous les 15 jours), [Grand-Père Jules](grand-pere-jules.md) (« Noël 2026 » dans la nav dès octobre), [Omnisol](omnisol.md) (congés d'été **encore affichés en octobre** : la version ratée) | Non : aucun champ d'annonce datée ; `conseils` (articles) est le plus proche, sans place en tête de page |
| Contenu ou chiffres qui n'existent qu'avec JavaScript (contre-levier) | 3 / 9 | [Activ'Sport](activsport.md) (toute la page dans un élément personnalisé Wix, couche plein écran tant que le script charge), [Bendorf](bendorf.md) et [PlumFix](framer-plumfix.md) (compteurs à 0 dans le HTML) | Pages statiques ; mais `data-counter` du moteur écrit aussi 0 dans le HTML (vitrine `sites/_effets`) |
| Offre d'entrée gratuite ou remise comme porte d'action | 2 / 9 (+ [Securya](securya.md), « audit de sécurité offert », compté en devis au tour 3) | [Activ'Sport](activsport.md) (« Réserver ma séance offerte », « Aucun paiement demandé », répété 3 fois), [Wix Electrician](wix-galvanic-electrician.md) (« Claim 15% off… this season ») | Texte seulement (`wording.devis`, `wording.ctaText`) ; pas de champ « offre » |
| Vidéo de la maison ou témoignage vidéo | 2 / 9 | [Bendorf](bendorf.md) (vidéo de fond, version téléphone dédiée), [Activ'Sport](activsport.md) (un témoignage vidéo parmi les avis) | Hero vidéo oui (`hero/video`, `ff video`) ; témoignage vidéo non |
| Commande à retirer ou location en boutique | 2 / 9 | [Grand-Père Jules](grand-pere-jules.md) (formulaire avec choix de la boutique de retrait), [Bendorf](bendorf.md) (growlers, location de tireuse et de fûts) | Non (pas de commande ; formulaire de contact générique) |
| Calculateur d'estimation en ligne | 1 / 9 | [Renovate](tf-renovate.md) (surface, murs, sols, portes, fenêtres → coût estimé → coordonnées) | Non |

**Prochain levier ≥ 40 % absent de l'usine** : aucun. Tous les leviers à 40 % ou plus (pages multiples, avis, page par service,
métier + ville, années, vraies photos, téléphone en haut, formulaire, devis, conseils) existent dans le schéma et les sections ; les
leviers neufs du tour 4 restent sous 40 % (le plus fréquent, la nouvelle du moment, 3 / 9).
Ce qui a bougé au tour 4 : **le formulaire, le bouton devis et la rubrique conseils retombent à 42 %**, juste au-dessus du seuil (1, 2
et 3 sites sur 9) ; **les labels remontent de 30 % à 36 %** (5 / 9 au tour 4 : RGE, agrément bio, RC pro, « certified », « licensed »),
toujours jamais au premier écran ni dans un hero de l'usine : à surveiller, c'est le prochain à franchir 40 %. Le téléphone en
haut reste à 53 % et deux nouveaux sites l'affichent mal (sans lien ; code du thème à la place). Points à surveiller : nouvelle du
moment en tête de page (3 / 9, aucun champ dans l'usine) ; restes du modèle (5 / 18) ; compteurs à 0 sans JavaScript, que le moteur
de l'usine reproduit.

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
