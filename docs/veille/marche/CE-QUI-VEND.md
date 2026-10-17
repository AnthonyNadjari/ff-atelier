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

27 sites au 17 oct 2026, tour 3 (18 sites d'artisans, 9 modèles). Un site compte s'il a le levier sur l'accueil ou dans sa nav.
Les comptes des tours 1 et 2 sont gardés tels quels ; le tour 3 ajoute ses 9 sites, démontés **sur le code, sans capture** (aucun
navigateur disponible) : les leviers de position (« au premier écran ») y sont lus dans l'ordre du HTML, la couverture des
bannières cookies n'y est pas mesurée. Pourcentage donné à partir de 40 %.

| Levier | Sites qui l'ont | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Plusieurs pages (pas un site d'une page) | 25 / 27 (93 %) | tous sauf [Rami](rami-entretien.md) (une page à ancres + Contact) et [Refit](framer-refit.md) ; le plus maigre compté : [Auvergne Technique Plomberie](auvergne-plomberie.md) | Oui : une page par service, pages villes en option (`seo.cityPages`) |
| Avis ou témoignages affichés | 18 / 27 (67 %) | [Ouest Car](garage-ouestcar.md) (103 avis Google), [Securya](securya.md) (10 avis Google signés sur 133), [Chez Bex](chez-bex.md) (7 avis datés + livre d'or) | Oui (`proof/google`, `testimonials`), seulement s'ils sont fournis |
| Une page par service ou par offre | 18 / 27 (67 %) | [Ouest Car](garage-ouestcar.md) (8 pages réparation), [Dr Debouvry](dentiste-cormontaigne.md) (une page par soin et par pathologie), [Chez Bex](chez-bex.md) (une page par occasion) | Oui (`src/pages/services/[slug].astro`) |
| Métier + ville dans le titre ou la première phrase | 17 / 27 (63 %) | [S Elec](s-elec.md) (« Électricien à Rennes »), [RConstruction](rconstruction.md) (« Maçonnerie et restauration du patrimoine à Dijon et Chalon-sur-Saône »), [Chez Bex](chez-bex.md) (« Traiteur Le Havre ») | Oui (test du hero, docs/REDACTION.md ; `hero-metier` « <métier> à <ville> » dans les heros) |
| Vraies photos de l'entreprise | 16 / 27 (59 % ; les 9 modèles : banque ou démonstration ; [Securya](securya.md) non compté, origine illisible dans le code) | [Villa d'Orient](villadorient.md) (~20), [Chez Bex](chez-bex.md) (~24 plats et réceptions), [Rami](rami-entretien.md) (7 chantiers pris au téléphone) | Dépend du client : guide photo, `ff images` ; jamais de banque présentée comme « le client » |
| Téléphone cliquable visible en haut | 15 / 27 (56 %) | [Securya](securya.md) (deux numéros + « 7j/7 8h-20h » en barre haute), [Dr Debouvry](dentiste-cormontaigne.md), [BuildPress](tf-buildpress.md) ; contre-exemples : [Rami](rami-entretien.md) et [Constructo](tf-constructo.md) affichent le numéro sans lien | Oui (porte « Appeler » des navs, `cta/phone-giant`) |
| Année de création ou années de métier | 15 / 27 (56 %) | [Prat](prat-depannage.md) (depuis 1987), [RConstruction](rconstruction.md) (« depuis plus de 30 ans »), [Rami](rami-entretien.md) (depuis 2010) | Oui, en texte « Depuis 1998 » (`business.since`) ; le badge et le « X ans » calculé restent refusés (docs/GOUT.md § 2) |
| Formulaire sur l'accueil | 14 / 27 (52 %) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (dès le premier écran), [Chez Bex](chez-bex.md) (panneau en haut de page), [Securya](securya.md) (10 champs, Particulier / Professionnel) | Oui (`contact/form-*`) |
| Bouton devis ou estimation nommé | 13 / 27 (48 %) | [BM Rénov](bm-renov.md) (« Devis gratuit »), [Securya](securya.md) (« Audit de sécurité offert »), [Chez Bex](chez-bex.md) (« Obtenir un devis gratuit ») | Oui (porte « Devis », `wording.devis`) |
| Rubrique conseils, actualités ou journal | 12 / 27 (44 %) | [Ouest Car](garage-ouestcar.md) (Conseils auto), [Chez Bex](chez-bex.md) (5 actualités datées, événements locaux), [Securya](securya.md) (Blog) | **Fait le 17 oct 2026** : `conseils` dans le schéma, `/conseils` + une page par article + lien de nav, seulement si le client a des articles |
| Zone desservie dans le premier écran | 9 / 27 (33 %) | [Auvergne Technique Plomberie](auvergne-plomberie.md) (8 communes en pastilles), [Ekilibr](ekilibr.md) (trois départements sous le h1), [Securya](securya.md) (« en Gironde ») | En partie : `zones.cities` est lu au premier écran par 2 heros sur 6 (`typographic`, `marquee`) ; ailleurs dans la section `zones` |
| Label, réseau, licence, assurance ou certification | 8 / 27 (30 %) | [Maison Stamm](maisonstamm.md) (Savoir-faire alsacien), [BM Rénov](bm-renov.md) et [Rami](rami-entretien.md) (assurance décennale), [Roofex](webflow-roofex.md) | En partie : `business.insurance` s'affiche dans les 6 heros (« Assuré décennale ») ; `business.certifications` (RGE, Qualibat…) seulement dans `about/portrait`, `about/overlap`, `footer/columns`, `proof/logos`, jamais au premier écran |
| … dont au premier écran | 3 / 27 relevés | [Maison Stamm](maisonstamm.md), [BM Rénov](bm-renov.md), [Rami](rami-entretien.md) (décennale dans la phrase sous le h1) | Assurance : oui (6 heros sur 6). Certifications : non (aucun hero ne lit `certifications`) |
| Chiffre de volume (« 4 000 clients ») | 8 / 27 | [Ouest Car](garage-ouestcar.md), [Securya](securya.md) (« 800 sites sécurisés », premier écran), [Chez Bex](chez-bex.md) (« 24 jours, 1200 repas ») | Pas de champ dédié ; seulement si le client le donne (règle dure 2) |
| Logos de clients, partenaires ou certificats | 8 / 27 | [S Elec](s-elec.md) (Carrefour, Intermarché…), [Securya](securya.md) (Foncia, CCI du Lot…), [Rami](rami-entretien.md) (syndics Citya, Socagest) | Oui (`proof/logos`) |
| Garantie écrite | 7 / 27 | [Lintel](framer-lintel.md) (10 ans structure), [Maison Stamm](maisonstamm.md) (à vie), [Rami](rami-entretien.md) (« Travaux fiables et garantis », décennale expliquée en FAQ) | Pas de champ ; texte du client seulement |
| Prix « à partir de » ou page tarifs | 6 / 27 | [Grégory Cros](photo-lyon-cros.md) (« dès 390 € » dans le h1), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Ekilibr](ekilibr.md) (50 à 150 €/h, 1 600 à 2 300 €/m²) | Oui (`services[].priceFrom`) |
| Délais chiffrés (rappel, devis, livraison) | 6 / 27 | [BM Rénov](bm-renov.md) (« Devis sous 48 h », premier écran), [Rami](rami-entretien.md) (devis sous 24 h, travaux sous 7 jours), [RConstruction](rconstruction.md) (« Devis gratuit sous 48h ») | Texte du client seulement (`wording.ctaText`) |
| Bannière cookies qui couvre le premier écran (contre-levier) | 4 / 18 mesurés (tour 3 : bannière présente sur 6 / 9, couverture non mesurée sans capture) | [Cordonnerie d'Axel](cordonnerie-axel.md) (100 %, bloquante), [Auvergne Technique Plomberie](auvergne-plomberie.md) (51 % du téléphone), [Prat](prat-depannage.md) | Jamais : aucun traceur, aucune bannière (avantage à dire au client) |
| Gérant en photo et à la première personne au premier écran | 3 / 27 mesurés | [Phenix](phenix-ferronnerie.md), [Grégory Cros](photo-lyon-cros.md), [Sawyer](squarespace-sawyer.md) ; [Ekilibr](ekilibr.md) a « Qui suis-je ? » juste sous le h1 (position à l'écran non mesurée, non compté) | Possible (`about/portrait`, `images.portrait`), jamais au premier écran : aucun hero ne lit `images.portrait` |
| Barre d'actions collée en bas sur téléphone | 2 / 27 | [Lintel](framer-lintel.md) (Appeler / SMS / Estimation), [Cordonnerie d'Axel](cordonnerie-axel.md) (Réserver / 2 numéros) | Oui (`layout.actionBar`) |

Leviers relevés à partir du tour 2 (comptés sur les 18 sites des tours 2 et 3, à recompter sur les 9 du tour 1) :

| Levier | Sites des tours 2 et 3 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Gérant ou équipe en photo quelque part sur l'accueil | 5 / 18 | [BM Rénov](bm-renov.md), [Grégory Cros](photo-lyon-cros.md), [Sawyer](squarespace-sawyer.md), [Ekilibr](ekilibr.md), [Dr Debouvry](dentiste-cormontaigne.md) (3 dentistes et 2 assistantes nommés) | Oui (`about/portrait`, `about/overlap`) |
| FAQ sur l'accueil | 5 / 18 | [BM Rénov](bm-renov.md), [Grégory Cros](photo-lyon-cros.md), [Rami](rami-entretien.md) (délais, zone, assurance), [Ekilibr](ekilibr.md) (11 questions de prix), [Refit](framer-refit.md) | Oui (`faq/*`) |
| Prise de rendez-vous ou réservation en ligne | 4 / 18 | [Cordonnerie d'Axel](cordonnerie-axel.md), [South Side Barber](southside-barber.md), [Roofex](webflow-roofex.md), [Dr Debouvry](dentiste-cormontaigne.md) (Doctolib dans l'en-tête) | Oui (`contact.bookingUrl`, porte « Réserver ») |
| Badges de réassurance sous le titre (devis gratuit, assurance, délai, 7j/7) | 4 / 18 | [BM Rénov](bm-renov.md), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Securya](securya.md) (4 cases chiffrées), [Rami](rami-entretien.md) | Oui (liste sous les boutons des 6 heros : depuis, 24 h/24, décennale, note Google) |
| Urgence 24/7 ou 7j/7 au premier écran | 4 / 18 | [Auvergne Technique Plomberie](auvergne-plomberie.md), [Roofex](webflow-roofex.md), [Securya](securya.md) (« 7j/7 8h-20h »), [Rami](rami-entretien.md) | Oui (`contact.emergency24h` dans les heros) |
| Note Google ou preuve sociale au premier écran | 4 / 18 | [Auvergne Technique Plomberie](auvergne-plomberie.md) (4,9/5), [Securya](securya.md) (4,9, 133 avis, **au-dessus du h1**), [Roofex](webflow-roofex.md), [Refit](framer-refit.md) (un témoignage sous le bouton) | Oui (`proof.google` dans les heros) ; un témoignage au premier écran : non |
| Bouton d'appel flottant sur téléphone | 3 / 18 | [Grégory Cros](photo-lyon-cros.md), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Rami](rami-entretien.md) | Oui sous forme de barre (`layout.actionBar`) |
| Liste de communes + carte sur l'accueil | 3 / 18 | [BM Rénov](bm-renov.md), [Auvergne Technique Plomberie](auvergne-plomberie.md), [RConstruction](rconstruction.md) (zones nommées + carte en image) | Oui (`zones/*`, carte sans traceur) |

Leviers relevés pour la première fois au tour 3 (comptés sur ses 9 sites) :

| Levier | Sites du tour 3 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Restes du modèle en ligne (numéro factice, liens du thème, texte d'un autre métier ou d'une autre ville) : contre-levier | 3 / 9 | [Rami](rami-entretien.md) (`tel: 123456789`), [Ekilibr](ekilibr.md) (Instagram de l'éditeur du thème, « agglomération Roannaise »), [Wix Home Remodeling](wix-home-remodeling.md) (« 24/7 Locksmith Assistance ») | En partie : la garde « données de test » (`scripts/ff/garde-donnees.mjs`) bloque 06 00 00 00 00, 75000 et le contenu de `_exemple`, pas un `tel:` factice générique (123456789) |
| Une page par ville desservie | 2 / 9 | [Securya](securya.md) (10 villes), [Ekilibr](ekilibr.md) (5 villes, c'est la page ville qui est classée) | Oui (`seo.cityPages`, une page `/zones/<ville>`) |
| Réalisations datées ou chiffrées (date, nombre de convives, lieu nommé) | 2 / 9 | [Chez Bex](chez-bex.md) (« 150 convives, 12.06.2025 »), [RConstruction](rconstruction.md) (domaine viticole nommé) | En partie : pas de champ date ou volume par réalisation ; seulement le texte du client |
| Seuil de commande au premier écran | 1 / 9 | [Chez Bex](chez-bex.md) (« Réservations pour 30 personnes minimum ») | Texte du client seulement |

**Prochain levier ≥ 40 % absent de l'usine** : aucun. Tous les leviers à 40 % ou plus (pages multiples, avis, page par service,
métier + ville, vraies photos, téléphone en haut, années, formulaire, devis, conseils) existent dans le schéma et les sections.
Ce qui a bougé au tour 3 : **labels et certifications retombent de 39 % à 30 %** (8 / 27 : un seul des 9 nouveaux sites, Rami, en
affiche un, la décennale) ; le point « certifications dans les heros » noté au tour 2 n'est donc plus prioritaire, il reste une
petite amélioration. Le téléphone en haut descend de 67 % à 56 % (deux sites du tour l'affichent **sans lien** : Rami, Constructo),
les avis de 78 % à 67 %. Les points à surveiller : zone desservie au premier écran (9 / 27, 33 % ; 2 heros sur 6 la montrent) ;
note Google ou preuve sociale au premier écran (4 / 18 sur les tours 2 et 3, 22 % ; Securya la met au-dessus du h1) ; restes du
modèle en ligne (3 / 9), que la garde « données de test » de l'usine n'attrape qu'en partie.

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
