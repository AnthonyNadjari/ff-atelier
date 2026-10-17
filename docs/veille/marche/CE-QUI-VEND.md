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

9 sites au 17 oct 2026 (6 sites d'artisans, 3 modèles). Un site compte s'il a le levier sur l'accueil ou dans sa nav.

| Levier | Sites qui l'ont | Exemples (fiche) | L'usine le fait ? |
|---|---|---|---|
| Plusieurs pages (pas un site d'une page) | 9 / 9 | tous | Oui : une page par service, pages villes en option |
| Une page par service ou par offre | 7 / 9 | [Ouest Car](garage-ouestcar.md) (8 pages réparation), [S Elec](s-elec.md), [Villa d'Orient](villadorient.md) (une par chambre) | Oui (`src/pages/services/[slug].astro`) |
| Avis ou témoignages affichés | 7 / 9 | [Ouest Car](garage-ouestcar.md) (103 avis Google), [Lintel](framer-lintel.md) (4.9 / 140), [Maison Stamm](maisonstamm.md) (restaurants signés) | Oui (`proof/google`, `testimonials`), seulement s'ils sont fournis |
| Téléphone cliquable visible en haut | 6 / 9 | [S Elec](s-elec.md), [Villa d'Orient](villadorient.md), [Lintel](framer-lintel.md) (en grand dans le premier écran) | Oui (porte « Appeler » des navs, `cta/phone-giant`) |
| Année de création ou années de métier | 6 / 9 | [Prat](prat-depannage.md) (depuis 1987), [Phenix](phenix-ferronnerie.md) (30 ans), [Ouest Car](garage-ouestcar.md) | Oui, en texte « Depuis 1998 » (`business.since`) ; le badge et le « X ans » calculé restent refusés (docs/GOUT.md § 2) |
| Rubrique conseils, actualités ou journal | 5 / 9 (56 %) | [Ouest Car](garage-ouestcar.md) (Conseils auto), [Villa d'Orient](villadorient.md), [Maison Stamm](maisonstamm.md), [WPCharming](wpcharming-construction.md), [Lintel](framer-lintel.md) | **Fait le 17 oct 2026** : `conseils` dans le schéma, `/conseils` + une page par article + lien de nav, seulement si le client a des articles |
| Métier + ville dans le titre ou la première phrase | 5 / 9 | [Ouest Car](garage-ouestcar.md), [S Elec](s-elec.md) (« Électricien à Rennes »), [Villa d'Orient](villadorient.md) | Oui (test du hero, docs/REDACTION.md) |
| Vraies photos de l'entreprise | 5 / 9 (les 3 modèles : banque d'images) | [Ouest Car](garage-ouestcar.md) (mécaniciens), [Villa d'Orient](villadorient.md) (~20), [Phenix](phenix-ferronnerie.md) (le gérant) | Dépend du client : guide photo, `ff images` ; jamais de banque présentée comme « le client » |
| Bouton devis ou estimation nommé | 4 / 9 (44 %) | [S Elec](s-elec.md) (« Obtenir un devis » en nav), [Lintel](framer-lintel.md), [Ouest Car](garage-ouestcar.md) | Oui (porte « Devis », `wording.devis`) |
| Formulaire sur l'accueil | 4 / 9 (44 %) | [Prat](prat-depannage.md), [Wix Plumbing](wix-plumbing-bright.md) (dès le premier écran sur téléphone), [Lintel](framer-lintel.md) (17 champs) | Oui (`contact/form-*`) |
| Label, réseau, licence ou certification | 4 / 9 (44 %) | [Ouest Car](garage-ouestcar.md) (Top Garage), [Maison Stamm](maisonstamm.md) (Savoir-faire alsacien, premier écran), [Lintel](framer-lintel.md) (licence, assurance) | Oui (`business.certifications`, `insurance`) ; à vérifier : sont-ils visibles dès le premier écran dans les heros partagés ? |
| Chiffre de volume (« 4 000 clients ») | 3 / 9 | [Ouest Car](garage-ouestcar.md), [Maison Stamm](maisonstamm.md), [WPCharming](wpcharming-construction.md) (factice) | Pas de champ dédié ; seulement si le client le donne (règle dure 2) |
| Prix « à partir de » ou page tarifs | 3 / 9 | [Lintel](framer-lintel.md), [Ouest Car](garage-ouestcar.md), [Villa d'Orient](villadorient.md) | Oui (`services[].priceFrom`) |
| Logos de clients ou de marques | 3 / 9 | [S Elec](s-elec.md) (Carrefour, Intermarché…), [Ouest Car](garage-ouestcar.md) | Oui (`proof/logos`) |
| Zone desservie dans le premier écran | 3 / 9 | [Phenix](phenix-ferronnerie.md) (départements), [Lintel](framer-lintel.md), [Ouest Car](garage-ouestcar.md) (« à 10 minutes d'Angers ») | En partie (section `zones`, pas au premier écran) |
| Garantie écrite | 3 / 9 | [Lintel](framer-lintel.md) (10 ans structure), [Maison Stamm](maisonstamm.md) (à vie) | Pas de champ ; texte du client seulement |
| Bannière cookies qui couvre le premier écran (contre-levier) | 2 / 9 | [Prat](prat-depannage.md), [Villa d'Orient](villadorient.md) | Jamais : aucun traceur, aucune bannière (avantage à dire au client) |
| Barre d'actions collée en bas sur téléphone | 1 / 9 | [Lintel](framer-lintel.md) (Appeler / SMS / Estimation) | Oui (`layout.actionBar`) |
| Gérant en photo et à la première personne au premier écran | 1 / 9 | [Phenix](phenix-ferronnerie.md) | Possible (`about/portrait`), pas au premier écran |
| Délais chiffrés (rappel, devis) | 1 / 9 | [Lintel](framer-lintel.md) | Texte du client seulement (`wording.ctaText`) |

**Prochain levier ≥ 40 % absent de l'usine** : aucun après la rubrique conseils. À surveiller au prochain tour : labels au
premier écran (44 %, l'usine les a mais ne les met pas forcément en haut).

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

Méthode du 17 oct 2026 : métiers (chambres d'hôtes, ferronnerie d'art, électricien) et villes (Grenoble, Strasbourg,
Angers pour les agences ; Marseille, Paris, Rennes pour la recherche) tirés au hasard (`$RANDOM`). La recherche passe
par l'outil de recherche de la session, pas par un Google.fr : les rangs sont ceux de cet outil. Captures dans
`docs/veille/marche/captures/` (non versionnées, `.gitignore`), regardées une par une.
