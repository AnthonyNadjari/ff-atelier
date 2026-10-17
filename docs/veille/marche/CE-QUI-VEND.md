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

18 sites au 17 oct 2026, tour 2 (12 sites d'artisans, 6 modèles). Un site compte s'il a le levier sur l'accueil ou dans sa nav.
Les comptes du premier tour sont gardés tels quels ; le tour 2 ajoute ses 9 sites. Pourcentage donné à partir de 40 %.

| Levier | Sites qui l'ont | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Plusieurs pages (pas un site d'une page) | 18 / 18 (100 %) | tous ; le plus maigre : [Auvergne Technique Plomberie](auvergne-plomberie.md) (accueil à ancres + une page Services) | Oui : une page par service, pages villes en option |
| Avis ou témoignages affichés | 14 / 18 (78 %) | [Ouest Car](garage-ouestcar.md) (103 avis Google), [Véranda Home](verandahome.md) (4,5 Google, 10 avis signés), [Auvergne Technique Plomberie](auvergne-plomberie.md) (4,9/5 au premier écran) | Oui (`proof/google`, `testimonials`), seulement s'ils sont fournis |
| Une page par service ou par offre | 13 / 18 (72 %) | [Ouest Car](garage-ouestcar.md) (8 pages réparation), [Véranda Home](verandahome.md) (22 produits), [Grégory Cros](photo-lyon-cros.md) (forfaits, photobooth, vidéaste…) | Oui (`src/pages/services/[slug].astro`) |
| Téléphone cliquable visible en haut | 12 / 18 (67 %) | [S Elec](s-elec.md), [BM Rénov](bm-renov.md), [BuildPress](tf-buildpress.md) (téléphone + adresse + horaires dans l'en-tête) | Oui (porte « Appeler » des navs, `cta/phone-giant`) |
| Année de création ou années de métier | 11 / 18 (61 %) | [Prat](prat-depannage.md) (depuis 1987), [Véranda Home](verandahome.md) (« depuis plus de 25 ans » dans le h1), [South Side Barber](southside-barber.md) (depuis 2015) | Oui, en texte « Depuis 1998 » (`business.since`) ; le badge et le « X ans » calculé restent refusés (docs/GOUT.md § 2) |
| Métier + ville dans le titre ou la première phrase | 11 / 18 (61 %) | [S Elec](s-elec.md) (« Électricien à Rennes »), [Auvergne Technique Plomberie](auvergne-plomberie.md), [Cordonnerie d'Axel](cordonnerie-axel.md) | Oui (test du hero, docs/REDACTION.md ; `hero-metier` « <métier> à <ville> » dans les heros) |
| Vraies photos de l'entreprise | 11 / 18 (61 % ; les 6 modèles : banque d'images) | [Villa d'Orient](villadorient.md) (~20), [BM Rénov](bm-renov.md) (12 chantiers + le gérant), [Véranda Home](verandahome.md) (~15 poses, lieux nommés) | Dépend du client : guide photo, `ff images` ; jamais de banque présentée comme « le client » |
| Rubrique conseils, actualités ou journal | 8 / 18 (44 %) | [Ouest Car](garage-ouestcar.md) (Conseils auto), [Véranda Home](verandahome.md) (Actualités), [Roofex](webflow-roofex.md) (blog) | **Fait le 17 oct 2026** : `conseils` dans le schéma, `/conseils` + une page par article + lien de nav, seulement si le client a des articles |
| Bouton devis ou estimation nommé | 8 / 18 (44 %) | [S Elec](s-elec.md) (« Obtenir un devis » en nav), [BM Rénov](bm-renov.md) (« Devis gratuit »), [Grégory Cros](photo-lyon-cros.md) (« Demander un devis ») | Oui (porte « Devis », `wording.devis`) |
| Formulaire sur l'accueil | 8 / 18 (44 %) | [Wix Plumbing](wix-plumbing-bright.md) et [Auvergne Technique Plomberie](auvergne-plomberie.md) (dès le premier écran), [BM Rénov](bm-renov.md) (7 champs) | Oui (`contact/form-*`) |
| Label, réseau, licence, assurance ou certification | 7 / 18 (39 %) | [Maison Stamm](maisonstamm.md) (Savoir-faire alsacien), [BM Rénov](bm-renov.md) (assurance décennale), [Roofex](webflow-roofex.md) (« Licensed & Fully Insured », macarons) | En partie : `business.insurance` s'affiche dans les 6 heros (« Assuré décennale ») ; `business.certifications` (RGE, Qualibat…) seulement dans `about/portrait`, `about/overlap`, `footer/columns`, `proof/logos`, jamais au premier écran |
| … dont au premier écran | 2 / 18 relevés | [Maison Stamm](maisonstamm.md), [BM Rénov](bm-renov.md) (badge « Assurance décennale » sous les boutons) | Assurance : oui (6 heros sur 6). Certifications : non (aucun hero ne lit `certifications`) |
| Chiffre de volume (« 4 000 clients ») | 5 / 18 | [Ouest Car](garage-ouestcar.md), [BM Rénov](bm-renov.md) (« + 100 chantiers »), [Roofex](webflow-roofex.md) (factice) | Pas de champ dédié ; seulement si le client le donne (règle dure 2) |
| Prix « à partir de » ou page tarifs | 5 / 18 | [Lintel](framer-lintel.md), [Grégory Cros](photo-lyon-cros.md) (« dès 390 € » dans le h1), [Auvergne Technique Plomberie](auvergne-plomberie.md) (« À partir de 90 € ») | Oui (`services[].priceFrom`) |
| Logos de clients, partenaires ou certificats | 5 / 18 | [S Elec](s-elec.md) (Carrefour, Intermarché…), [BuildPress](tf-buildpress.md) (« Clients / Partners / Certificates »), [Cordonnerie d'Axel](cordonnerie-axel.md) (9 partenaires) | Oui (`proof/logos`) |
| Zone desservie dans le premier écran | 5 / 18 (28 %) | [Phenix](phenix-ferronnerie.md) (départements), [Auvergne Technique Plomberie](auvergne-plomberie.md) (8 communes en pastilles, le plus net), [BM Rénov](bm-renov.md) (« Tours (37) ») | En partie : `zones.cities` est lu au premier écran par 2 heros sur 6 (`typographic`, `marquee`) ; ailleurs dans la section `zones` |
| Garantie écrite | 4 / 18 | [Lintel](framer-lintel.md) (10 ans structure), [Maison Stamm](maisonstamm.md) (à vie), [Roofex](webflow-roofex.md) (macaron « 100 % satisfaction ») | Pas de champ ; texte du client seulement |
| Délais chiffrés (rappel, devis, livraison) | 4 / 18 | [Lintel](framer-lintel.md), [BM Rénov](bm-renov.md) (« Devis sous 48 h », premier écran), [Auvergne Technique Plomberie](auvergne-plomberie.md) (« Réponse rapide sous 24 h ») | Texte du client seulement (`wording.ctaText`) |
| Bannière cookies qui couvre le premier écran (contre-levier) | 4 / 18 | [Cordonnerie d'Axel](cordonnerie-axel.md) (100 %, bloquante), [Auvergne Technique Plomberie](auvergne-plomberie.md) (51 % du téléphone), [Prat](prat-depannage.md) ; [BM Rénov](bm-renov.md) à 42 % non bloquante, non compté | Jamais : aucun traceur, aucune bannière (avantage à dire au client) |
| Gérant en photo et à la première personne au premier écran | 3 / 18 | [Phenix](phenix-ferronnerie.md), [Grégory Cros](photo-lyon-cros.md) (le gérant en grand), [Sawyer](squarespace-sawyer.md) (« I'm Maria », banque) | Possible (`about/portrait`, `images.portrait`), jamais au premier écran : aucun hero ne lit `images.portrait` |
| Barre d'actions collée en bas sur téléphone | 2 / 18 | [Lintel](framer-lintel.md) (Appeler / SMS / Estimation), [Cordonnerie d'Axel](cordonnerie-axel.md) (Réserver / 2 numéros) | Oui (`layout.actionBar`) |

Leviers relevés pour la première fois au tour 2 (comptés sur ses 9 sites seulement, à recompter sur les 9 premiers au prochain tour) :

| Levier | Sites du tour 2 | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Gérant en photo quelque part sur l'accueil | 3 / 9 | [BM Rénov](bm-renov.md) (nommé, section « L'artisan qui pose et qui peint »), [Grégory Cros](photo-lyon-cros.md), [Sawyer](squarespace-sawyer.md) | Oui (`about/portrait`, `about/overlap`) |
| Prise de rendez-vous ou réservation en ligne | 3 / 9 | [Cordonnerie d'Axel](cordonnerie-axel.md), [South Side Barber](southside-barber.md), [Roofex](webflow-roofex.md) | Oui (`contact.bookingUrl`, porte « Réserver ») |
| Badges de réassurance sous le titre (devis gratuit, assurance, délai, 7j/7) | 2 / 9 | [BM Rénov](bm-renov.md), [Auvergne Technique Plomberie](auvergne-plomberie.md) | Oui (liste sous les boutons des 6 heros : depuis, 24 h/24, décennale, note Google) |
| Urgence 24/7 ou 7j/7 au premier écran | 2 / 9 | [Auvergne Technique Plomberie](auvergne-plomberie.md), [Roofex](webflow-roofex.md) | Oui (`contact.emergency24h` dans les heros) |
| Note Google ou preuve sociale chiffrée au premier écran | 2 / 9 | [Auvergne Technique Plomberie](auvergne-plomberie.md) (4,9/5), [Roofex](webflow-roofex.md) (avatars « Trusted by… ») | Oui (`proof.google` dans les heros) |
| Bouton d'appel flottant sur téléphone | 2 / 9 | [Grégory Cros](photo-lyon-cros.md) (« Appeler »), [Auvergne Technique Plomberie](auvergne-plomberie.md) | Oui sous forme de barre (`layout.actionBar`) |
| FAQ sur l'accueil | 2 / 9 | [BM Rénov](bm-renov.md), [Grégory Cros](photo-lyon-cros.md) | Oui (`faq/*`) |
| Liste de communes + carte sur l'accueil | 2 / 9 | [BM Rénov](bm-renov.md) (14 communes, carte chargée au clic), [Auvergne Technique Plomberie](auvergne-plomberie.md) | Oui (`zones/*`, carte sans traceur) |

**Prochain levier ≥ 40 % absent de l'usine** : aucun. Tous les leviers à 40 % ou plus (pages multiples, avis, page par service,
téléphone en haut, années, métier + ville, vraies photos, conseils, devis, formulaire) existent dans le schéma et les sections.
Le plus proche du seuil : **labels et certifications, 7 / 18 (39 %)**. Vérifié dans le code le 17 oct 2026 (tour 2) : les 6 heros
(`src/sections/Hero/*.astro`) affichent `business.insurance` (« Assuré décennale »), mais aucun ne lit `business.certifications` ;
un artisan RGE ou Qualibat ne le voit donc qu'en bas de page. Un site de plus avec un label le fait passer à 40 % : c'est la première
chose à faire au tour suivant (afficher `certifications` dans la liste de réassurance des heros, seulement si le champ est rempli).
Les deux autres points à surveiller : zone desservie au premier écran (5 / 18, 28 % ; 2 heros sur 6 la montrent) et gérant en
photo au premier écran (3 / 18, 17 % ; aucun hero ne lit `images.portrait`).

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
