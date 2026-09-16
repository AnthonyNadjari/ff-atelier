# Veille 2025-2026 — SEO local, conversion et obligations légales pour sites d'artisans/commerces locaux

Rédigé pour Finck & Fisch (sites Astro statiques livrés à des plombiers, coiffeurs, restaurateurs, garagistes, avocats, etc.). Objectif : que le site génère des appels. Document factuel, sources citées à la fin de chaque section et en section 7.

Note méthodologique : recherche web effectuée le 16 septembre 2026 (~28 requêtes WebSearch/WebFetch). Certaines pages officielles (CNIL, Légifrance, AFNIC) n'ont pas pu être re-fetchées en direct pendant la session (quota de recherche atteint) ; leur contenu est restitué à partir de sources de veille juridique recoupées et de la connaissance du cadre réglementaire stable (LCEN, RGPD, Code de la consommation, Code des assurances). Les URL officielles sont indiquées pour vérification par le client final ou un juriste avant publication — **ce document n'est pas un avis juridique**.

---

## 1. SEO local 2025-2026

### 1.1 Google Business Profile (GBP) — checklist d'optimisation

- **Une seule fiche par établissement**, informations strictement conformes à la réalité (enseigne, adresse, horaires) — Google sanctionne les fiches en doublon ou les noms "gonflés" avec mots-clés ("Plombier Paris pas cher n°1"). Source : [Consignes relatives à la représentation de votre établissement — Google](https://support.google.com/business/answer/3038177?hl=fr).
- **Catégorie principale** : choisir la catégorie la plus précise possible (ex. "Plombier" plutôt que "Entrepreneur en bâtiment") — c'est le signal de pertinence le plus fort de la fiche, avant même les avis. Catégories secondaires seulement si elles décrivent une activité réellement exercée. Source : [Gérer votre catégorie d'activité — Google](https://support.google.com/business/answer/7249669?hl=fr).
- **Zone de service** (artisans qui se déplacent) : déclarer la zone réelle desservie plutôt qu'une adresse physique si le professionnel n'a pas de local recevant du public — pertinent pour plombiers, électriciens, dépanneurs.
- **Photos** : photos réelles (équipe, véhicule, avant/après, local) — signal de confiance devenu quasi un facteur de classement en 2025-2026 selon les praticiens SEO (photos "cosmétiques" → "signal de confiance et de ranking"). Sources agrégées : [TrueFuture Media — checklist 2026](https://www.truefuturemedia.com/articles/google-business-profile-optimization-checklist-2026), [Astra Results — checklist 2026](https://astraresults.com/blog/post/march-2026/google-business-profile-optimization-the-2026-checklist).
- **Avis** : collecte régulière + réponses personnalisées (pas de copier-coller) à tous les avis, positifs et négatifs.
- **Posts GBP** : publication hebdomadaire recommandée par les praticiens pour signaler une activité vivante (pas une exigence Google documentée officiellement, mais corrélée à l'engagement).
- **Suivi de performance** : Google Business Profile fournit des statistiques (appels, itinéraires, clics site) exploitables comme KPI de conversion réelle.
- **Validation** : la fiche doit être validée (courrier, téléphone, e-mail ou Search Console selon éligibilité). Source : [Validez votre établissement — Google](https://support.google.com/business/answer/7107242?hl=fr).

### 1.2 Cohérence NAP (Nom / Adresse / Téléphone)

Le NAP doit être strictement identique entre le site, la fiche GBP, les annuaires (PagesJaunes, Yelp, Houzz…) et les mentions légales. Toute incohérence (numéro de téléphone secondaire, abréviation de rue différente) dilue le signal de confiance local utilisé par Google et les autres moteurs. Bonne pratique : le NAP du site (footer + page contact) doit être la source de vérité copiée à l'identique partout.

### 1.3 Schema.org — LocalBusiness et sous-types par métier

Schema.org définit une hiérarchie `LocalBusiness` avec des dizaines de sous-types spécifiques ; utiliser le sous-type le plus précis disponible plutôt que `LocalBusiness` générique. Source : [schema.org/LocalBusiness](https://schema.org/LocalBusiness), synthèse [JSON-LD.com — Local Business Schema, 100+ sous-types](https://jsonld.com/local-business/).

Mapping utile pour les métiers Finck & Fisch :

| Métier | Type schema.org | Parent |
|---|---|---|
| Plombier | `Plumber` | `HomeAndConstructionBusiness` |
| Électricien | `Electrician` | `HomeAndConstructionBusiness` |
| Couvreur | `RoofingContractor` | `HomeAndConstructionBusiness` |
| Serrurier | `Locksmith` | `HomeAndConstructionBusiness` |
| Coiffeur | `HairSalon` | `HealthAndBeautyBusiness` |
| Restaurant | `Restaurant` | `FoodEstablishment` |
| Garage / mécanicien | `AutoRepair` | `AutomotiveBusiness` |
| Avocat | `LegalService` (ou `Attorney`) | `LocalBusiness` |
| Dentiste | `Dentist` | `MedicalOrganization` / `LocalBusiness` |
| Fleuriste | `Florist` | `Store` |
| Chambre d'hôtes | `BedAndBreakfast` | `LodgingBusiness` |
| Général bâtiment | `GeneralContractor` | `HomeAndConstructionBusiness` |

Propriétés minimales à remplir : `name`, `address` (PostalAddress), `telephone`, `openingHoursSpecification`, `geo`, `priceRange`, `areaServed`, `image`. Pour un avocat, préférer `Attorney`/`LegalService` avec prudence : le Conseil national des barreaux encadre la communication (pas de comparatif de prix trompeur, pas de "spécialiste" sans certification).

### 1.4 FAQPage, Service, Review, AggregateRating — règles actuelles de Google

- **FAQPage** : Google a restreint l'affichage des rich results FAQ dès août 2023 aux seuls sites gouvernementaux et de santé "bien établis", puis a **supprimé entièrement** ce rich result de la recherche (déploiement finalisé en mai 2026, avec retrait des rapports Search Console associés entre juin et août 2026). Conséquence pratique : garder du contenu FAQ utile pour les visiteurs et pour les moteurs conversationnels (AI Overviews), mais ne plus compter sur un balisage `FAQPage` pour obtenir un rich snippet dans Google. Le balisage résiduel n'est pas pénalisé, juste inutile pour ce rich result. Sources : [Google Search Central Blog — Changes to HowTo and FAQ rich results (2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes), [Search Engine Journal — Google Drops FAQ Rich Results](https://www.searchenginejournal.com/google-drops-faq-rich-results-from-search/574429/).
- **Review / AggregateRating** : Google interdit les **"self-serving reviews"** — un avis sur l'entité A publié/balisé par l'entité A elle-même sur son propre site (y compris via un widget tiers embarqué). Pour un `LocalBusiness`/`Organization`, si l'entité notée contrôle les avis affichés, la page est **inéligible** au rich result étoiles ; Google applique une action manuelle sur les données structurées (pas une simple absence d'effet). Exception : ce n'est pas interdit pour `Product` (avis produit e-commerce). Conclusion pratique pour Finck & Fisch : ne pas mettre en JSON-LD `AggregateRating`/`Review` de type "5 étoiles, 42 avis" auto-déclarés sur le site du client — utiliser plutôt un widget Google (via l'API Places, avis réels tirés de la fiche GBP) ou ne pas baliser du tout, et laisser les vraies étoiles Google apparaître sur la fiche GBP. Sources : [Google Search Central — Review Snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet), [Google Search Central Blog — Making Review Rich Results more helpful (2019)](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful).
- **Service** : type utile pour détailler chaque prestation (`Service` avec `areaServed`, `provider`, `offers`) sur les pages "prestations" ; pas de restriction équivalente aux avis, mais pas de rich result dédié particulier en local — sert surtout à la compréhension sémantique par les moteurs (SEO + IA générative).

### 1.5 Pages ville : quand ça aide, quand c'est du contenu "thin"

Google qualifie de **doorway pages** les pages quasi-identiques créées uniquement pour capter des variantes géographiques d'une requête ("Plombier à X", "Plombier à Y") et qui renvoient toutes vers le même contact générique — ce sont des pages sanctionnables (ajustement algorithmique dédié depuis 2015, action manuelle "Thin content with little or no added value" possible). Source officielle : [Google Search Essentials — spam policies, doorway pages](https://developers.google.com/search/docs/essentials/spam-policies) (politique générale citée par toutes les analyses ; voir aussi synthèse [Manning Search Marketing — Location Pages vs Doorway Pages](https://www.manningmarketing.com/articles/location-pages-vs-doorway-pages-seo-best-practices-and-pitfalls/)).

Règle pratique retenue par les praticiens (et cohérente avec les Search Essentials de Google) : une page ville n'a de valeur que si, en retirant le nom de la ville, la page perdrait son utilité pour un habitant de cette ville. Critères pour justifier une page ville dédiée :
- présence réelle et récurrente dans cette zone (camion, agenda de tournées, antenne) ;
- volume de recherche local vérifiable pour ce service + cette ville ;
- contenu réellement différenciant (réglementation locale — ex. zones ABF pour un couvreur —, spécificités du bâti, exemples de chantiers dans la ville, témoignages locaux).

Pour Finck & Fisch : préférer une seule page "zone d'intervention" avec liste de communes desservies + carte, plutôt que 20 pages villes quasi vides, sauf si le client a un volume d'activité justifiant un contenu unique par ville (ex. artisan multi-agences).

### 1.6 Core Web Vitals — seuils 2025-2026

Seuils "good" mesurés au 75e percentile des utilisateurs réels (CrUX), sur mobile et desktop séparément :
- **LCP** (Largest Contentful Paint) : ≤ 2,5 s bon / > 4 s mauvais
- **INP** (Interaction to Next Paint, a remplacé FID en mars 2024) : ≤ 200 ms bon / > 500 ms mauvais
- **CLS** (Cumulative Layout Shift) : ≤ 0,1 bon / > 0,25 mauvais

Source de référence méthodologique : [web.dev — How the Core Web Vitals metrics thresholds were defined](https://web.dev/articles/defining-core-web-vitals-thresholds). Contexte marché (Web Almanac 2025, cité par plusieurs analyses) : seulement ~62 % des pages mobiles passent un LCP "bon", l'INP étant plus largement atteint (~77 %) — le vrai point de friction pour des sites Astro (statique, peu de JS) est généralement LCP (images non optimisées, polices web) plutôt qu'INP. Astro étant statique, CLS et INP sont normalement déjà favorables si les images ont des dimensions explicites et les web fonts sont chargées avec `font-display: swap`.

### 1.7 Contenu généré par IA : position de Google

Position officielle stable depuis 2023 et reconduite dans les mises à jour "helpful content"/spam de 2024 : **l'usage de l'IA n'est pas en soi une infraction**. Ce qui est sanctionné, c'est l'usage de l'automatisation (IA incluse) dans le but principal de manipuler le classement, à grande échelle, avec du contenu non original et à faible valeur ajoutée. Le système "helpful content" a été intégré au ranking central en mars 2024. Grille d'évaluation mise en avant par Google : E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness). Source : [Google Search Central Blog — Google Search's guidance about AI-generated content (2023, toujours référence)](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content), [Google Search Essentials — spam policies](https://developers.google.com/search/docs/essentials/spam-policies).

Conséquence pour Finck & Fisch : les textes rédigés/assistés par IA pour les sites clients sont acceptables **si** ils reflètent une expérience réelle et vérifiable du métier (photos de vrais chantiers, détails spécifiques au client, pas de généralités interchangeables d'un plombier à l'autre) — éviter le texte "template IA" strictement identique d'un site client à l'autre, qui est justement le pattern que Google cible.

### 1.8 Sitemaps et indexation via Search Console

- Sitemap XML soumis via Search Console (rapport "Sitemaps"), ou déclaré en en-tête du `robots.txt`. Pas de limite au nombre de sitemaps déclarés dans `robots.txt`. Source : [Google Search Central — Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap).
- Un fichier index de sitemaps peut contenir jusqu'à 50 000 URL ; jusqu'à 500 sitemaps index soumissibles par propriété. Source : [Google Search Central — Manage Your Sitemaps With Sitemap Index Files](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps).
- Pour un site vitrine de quelques pages (le cas typique Finck & Fisch), la Indexing API n'est pas nécessaire (réservée aux contenus éphémères type offres d'emploi/live) ; un sitemap simple + soumission manuelle "Demander une indexation" suffit. Source : [Google Search Central — Ask Google to Recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl).

### 1.9 Bing Places, Apple Business Connect

- **Bing Places for Business** : service Microsoft gratuit, permet d'apparaître sur Bing Maps/Search, Copilot et Windows Maps ; import possible depuis Google Business Profile (à vérifier après import). Pertinent car Bing équipe par défaut Windows/Edge et alimente Copilot. Source : [Bing Places for Business](https://www.bingplaces.com/).
- **Apple Business Connect** (rebrandé "Apple Business" en avril 2026) : gratuit, permet de gérer la fiche sur Apple Maps, Siri, Messages, Wallet — pertinent pour la part d'utilisateurs iPhone qui cherchent via Plans/Siri. Source : [Apple Newsroom — Introducing Apple Business Connect](https://www.apple.com/newsroom/2023/01/introducing-apple-business-connect/), [Apple Business Connect](https://businessconnect.apple.com/).

### 1.10 Annuaires FR utiles

- **PagesJaunes** (via Solocal) : inscription de base gratuite (horaires, prestations, photos, avis, messagerie) ; +110 millions de consultations mensuelles annoncées, plus de 1 internaute sur 2 y effectue une recherche selon l'éditeur. Bien indexé par Google, impact SEO direct modeste mais gratuit et sans risque. Sources : [PagesJaunes — Conditions de parution](https://www.pagesjaunes.fr/infoslegales/referencement-sur-pagesjaunes/), [Blog PagesJaunes — Inscription gratuite](https://blog.pagesjaunes.fr/inscrivez-gratuitement-votre-entreprise-sur-pagesjaunes-beneficiez-de-sa-puissance/).
- **Yelp FR**, **Houzz** (pertinent bâtiment/déco/architecture), **Habitatpresto** (mise en relation travaux, génération de devis) : à inscrire pour la cohérence NAP et les backlinks/citations locales, en particulier pour les métiers du bâtiment.
- Principe général : chaque fiche annuaire = une "citation" locale supplémentaire qui renforce la cohérence NAP perçue par Google, même sans lien direct sur le ranking.

---

## 2. Conversion pour les métiers locaux

### 2.1 Ce qui fait décrocher le téléphone — preuves chiffrées

- **97 % des consommateurs lisent les avis avant de choisir une entreprise locale**, 41 % "toujours" (contre 29 % l'année précédente). **85 %** disent que des avis positifs les rendent plus enclins à utiliser l'entreprise, **77 %** que des avis négatifs les en dissuadent. Le facteur n°1 de crédibilité d'un avis : qu'il soit cohérent avec le sentiment général des autres avis (56 %). Les consommateurs sont en 2025 plus indulgents sur le nombre d'avis nécessaire (accepteraient de décider avec 0-49 avis). Source : [BrightLocal — Local Consumer Review Survey 2025](https://www.brightlocal.com/research/local-consumer-review-survey-2025/) (et édition [2024](https://www.brightlocal.com/research/local-consumer-review-survey-2024/)).
- **Click-to-call** : le taux de conversion d'un appel déclenché par un clic est 10 à 15 fois supérieur à une conversion "en ligne" classique (formulaire) ; taux de conversion moyen observé 5-25 % selon le secteur. **88 %** des utilisateurs mobile qui cherchent un commerce local appellent ou s'y rendent dans les 24 h. Un bouton "Appeler" visible peut augmenter le taux d'appel d'environ 200 %. Sources agrégées : [CallRail — Optimize Landing Page for Click-to-Call](https://www.callrail.com/blog/optimize-landing-page-click-to-call-conversions), [Rook Digital — How Click-To-Call Features Boost Local Conversions](https://rookdigital.com/how-click-to-call-features-boost-local-conversions-on-mobile/).
- **Ergonomie mobile** : boutons d'action ≥ 44×44 px (repère Apple/Google HIG repris par l'industrie CRO) ; ~48 % des abandons de conversion mobile proviennent de clics ratés/boutons trop petits. Optimiser spécifiquement pour mobile peut améliorer la conversion de l'ordre de 30 % selon les benchmarks agrégés (à traiter comme ordre de grandeur, pas une statistique officielle unique).
- **WhatsApp Business / click-to-chat** : canal en forte adoption chez les artisans/TPE français (exemples de terrain rapportés : hausse marquée des demandes entrantes et du taux de transformation devis quand le WhatsApp remplace/complète le formulaire) ; la réactivité (réponse en quelques minutes) est présentée comme le facteur de conversion le plus déterminant dans les premières 24 h d'un contact entrant. À traiter comme retours d'expérience/marketing d'éditeurs (pas une étude indépendante), donc à mentionner avec prudence au client plutôt qu'à citer comme statistique académique.
- **Décennale / RGE / Qualibat affichés** : dans le bâtiment, les éléments qui font décrocher le téléphone identifiés par les praticiens : assurance décennale visible, labels RGE/Qualibat avec numéro vérifiable, avis clients réels, photos avant/après de chantiers réels, zone d'intervention précise, garanties écrites. Un client qui voit l'attestation décennale avant de demander le devis "n'a plus besoin de la réclamer ni de douter". Source de synthèse : [WebTensor — Quelles preuves afficher sur son site artisan bâtiment](https://webtensor.fr/blog/preuves-site-artisan-batiment).
- **Nielsen Norman Group — crédibilité perçue** : 4 facteurs de confiance identifiés (qualité de design, transparence/"disclosure" en amont, contenu à jour et complet, connexion au reste du web — i.e. présence vérifiable ailleurs). Directement transposable : mentions légales complètes et visibles, coordonnées réelles et vérifiables, contenu à jour (pas de mentions "2019" en pied de page), présence croisée (GBP, annuaires) qui confirme la réalité de l'entreprise. Source : [NN/g — Trustworthiness in Web Design: 4 Credibility Factors](https://www.nngroup.com/articles/trustworthy-design/).

### 2.2 Structures de page par métier

- **Urgence (plombier, serrurier, électricien dépannage)** : numéro de téléphone cliquable en position la plus visible possible (haut de page, sticky sur mobile), mention "intervention sous X min/h", zone couverte, disponibilité (24/7 ou horaires précis) **dès le premier écran**. Le formulaire de contact passe en second plan — l'utilisateur en urgence veut appeler, pas remplir un champ.
- **Rendez-vous (coiffeur, dentiste, avocat, garage entretien programmé)** : mise en avant d'un module de prise de RDV (ou lien vers outil externe type Doctolib/Planity/Calendly), horaires d'ouverture visibles, photos de l'équipe et du lieu (réduit l'incertitude avant la première visite), tarifs indicatifs si le métier le permet.
- **Commerce/achat réfléchi (fleuriste, garage vente véhicules, chambre d'hôtes)** : galerie photo produit, avis, localisation/itinéraire, click-to-call en complément d'un canal de réservation ou de contact.

Constante transversale : téléphone cliquable (`tel:`) dans le header sur toutes les pages, en plus d'une page contact dédiée.

### 2.3 Champs de formulaire qui tuent la conversion

Principe CRO consensuel (repris par tous les guides B2B/local) : chaque champ supplémentaire réduit le taux de complétion. Pour un formulaire de contact artisan/commerce, se limiter à : nom, téléphone (le champ le plus important, à rendre obligatoire), besoin en une ligne ou menu déroulant court, et éventuellement code postal/ville. Éviter : champs "société" pour du BtoC, CAPTCHA lourd, confirmation d'e-mail, menus déroulants à choix multiples complexes, demande d'adresse complète avant tout contact humain. Le champ e-mail doit rester facultatif si le téléphone est fourni (un artisan urgentiste rappelle, il ne répond pas par mail).

### 2.4 Call tracking : options et RGPD

- Options gratuites/accessibles : numéro de suivi Google (intégré nativement dans les campagnes Google Ads / GBP Insights, gratuit dans GBP pour les clics "Appeler"), outils low-cost type CallRail/Ringover/Aircall avec numéro dédié par canal (payant mais abordable pour TPE).
- **RGPD** : si les appels sont enregistrés (pas simplement comptés), il faut : (1) informer l'appelant en amont ("cet appel peut être enregistré à des fins de..., tapez 1 pour vous y opposer"), (2) une finalité précise et proportionnée, (3) une base légale (contrat pour la preuve de la conclusion d'un contrat par téléphone, intérêt légitime encadré pour le contrôle qualité — la CNIL admet un contrôle qualité par écoute **sporadique et aléatoire**, pas un enregistrement systématique et permanent sans finalité définie), (4) une durée de conservation limitée. Le simple comptage d'appels (call tracking sans enregistrement du contenu) est nettement moins contraignant : c'est une donnée de trafic assimilable à une statistique, mais le numéro appelant reste une donnée personnelle si conservé. Sources : [CNIL — L'enregistrement des conversations téléphoniques afin d'établir la preuve de la formation d'un contrat](https://www.cnil.fr/fr/lenregistrement-des-conversations-telephoniques-afin-detablir-la-preuve-de-la-formation-dun-contrat), synthèse juridique [Haas Avocats — RGPD, précisions sur l'enregistrement des conversations téléphoniques](https://www.haas-avocats.com/reglementation/cnil/rgpd-precisions-enregistrement-des-conversations-telephoniques/).

Recommandation pratique pour Finck & Fisch : proposer par défaut un simple **comptage** de clics `tel:` (via Google Analytics/Plausible événement, sans enregistrement vocal) — suffisant pour mesurer l'efficacité du site, sans les obligations RGPD lourdes de l'enregistrement d'appel. Ne proposer l'enregistrement d'appel que si le client (garage, artisan avec litiges fréquents) le demande explicitement, avec l'annonce vocale obligatoire.

---

## 3. Obligations légales France

**Avertissement** : cadre juridique complexe et évolutif. Les éléments ci-dessous sont une synthèse de veille, à faire valider par un professionnel du droit avant de les présenter comme conseil juridique ferme à un client.

### 3.1 Mentions légales obligatoires

Base légale : LCEN (loi n° 2004-575 du 21 juin 2004). **Changement important** : l'article 6-III de la LCEN, historiquement la référence pour les mentions légales, a été modifié par la loi n° 2024-449 du 21 mai 2024 (loi SREN) — les obligations d'identification de l'éditeur relèvent désormais de **l'article 1-1 de la LCEN** (renumérotation/refonte, le contenu des obligations reste globalement similaire). À vérifier sur Légifrance au moment de la rédaction de chaque mention légale client : [Légifrance — LCEN consolidée](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164/).

Contenu minimal pour un professionnel (artisan, commerçant) :
- nom/prénom ou dénomination sociale, adresse du siège ;
- statut juridique + numéro **SIRET** (ou RCS pour une société, RM pour un artisan) ;
- capital social (si société) ;
- coordonnées de contact direct (téléphone, e-mail) ;
- nom de l'**hébergeur** du site (raison sociale, adresse, téléphone) ;
- nom du **directeur de la publication** ;
- numéro de TVA intracommunautaire si assujetti.

Pour les artisans du bâtiment, ajouter les mentions d'**assurance professionnelle** : nom de l'assureur et couverture géographique de la garantie décennale (Code des assurances, art. L241-1 : l'assurance décennale est obligatoire pour tout constructeur, et l'artisan doit pouvoir en justifier — la mention sur devis/factures est une bonne pratique fortement recommandée, au-delà de la seule obligation de détention de l'assurance).

Sanction en cas d'absence : jusqu'à 75 000 € d'amende pour une personne physique (auto-entrepreneur), 375 000 € pour une personne morale, selon plusieurs synthèses juridiques concordantes. Sources : [service-public.fr — Mentions obligatoires sur un site internet professionnel](https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228), [francenum.gouv.fr — Quelles sont les mentions légales pour un site internet](https://www.francenum.gouv.fr/guides-et-conseils/developpement-commercial/site-web/quelles-sont-les-mentions-legales-pour-un-site).

### 3.2 CGV (si vente en ligne)

Nécessaires uniquement si le site permet une vente/réservation en ligne effective (pas un simple site vitrine avec formulaire de contact). Un site vitrine Finck & Fisch classique (prise de contact, devis) n'a généralement pas besoin de CGV formelles, sauf s'il intègre un module de paiement ou de réservation ferme en ligne — dans ce cas, CGV obligatoires (Code de la consommation, informations précontractuelles art. L111-1 et s.) avec prix, modalités de paiement, droit de rétractation le cas échéant, SAV.

### 3.3 RGPD pour un formulaire de contact

- **Base légale** : intérêt légitime du responsable de traitement (répondre à une demande de contact) ou mesures précontractuelles (art. 6.1.b RGPD) si la demande vise la conclusion d'un contrat (devis).
- **Mention d'information** obligatoire à proximité du formulaire : identité du responsable de traitement, finalité (traiter la demande), base légale, destinataires des données, durée de conservation, existence des droits (accès, rectification, effacement, opposition) et modalités d'exercice, coordonnées du DPO si désigné (rarement pour une TPE).
- **Durée de conservation** : le temps nécessaire au traitement de la demande + un délai raisonnable de preuve (CNIL recommande généralement de l'ordre de 3 ans après le dernier contact pour de la prospection, moins pour une simple demande de devis non suivie).
- **Registre des traitements** : obligatoire même pour une TPE dès lors qu'il y a un traitement de données personnelles régulier (un formulaire de contact suffit à en créer un, même minimal) — un registre allégé (tableau simple : finalité, données, durée, destinataires) est suffisant en pratique pour ce niveau de risque.
- Ne pas cocher de case pré-cochée pour la newsletter/prospection ; case à cocher active et non obligatoire pour l'envoi d'informations commerciales, distincte de l'envoi du formulaire lui-même.

Référence générale : [CNIL — Le RGPD](https://www.cnil.fr/fr/reglement-europeen-protection-donnees), [CNIL — Formulaires de contact et RGPD (guide TPE-PME)](https://www.cnil.fr/fr/les-guides-de-la-cnil).

### 3.4 Cookies et traceurs (CNIL)

- Règle de base : tout traceur non strictement nécessaire au fonctionnement du service demandé par l'utilisateur nécessite un **consentement préalable, libre, spécifique et éclairé**, recueilli par une action positive claire (bouton "Accepter"). Le silence/la poursuite de la navigation **ne vaut plus consentement**. Refuser doit être aussi simple qu'accepter (bouton "Refuser" au même niveau que "Accepter"). Source : [CNIL — Cookies et autres traceurs, comment se mettre en conformité](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite).
- **Google Maps embarqué** : le statut dépend du contexte d'usage. Une carte Google Maps sur une page "Où nous trouver" dédiée peut être considérée comme un contenu essentiel à la fonctionnalité demandée par l'utilisateur sur cette page précise (pas de traceur tiers déclenché avant clic) — mais l'iframe standard Google Maps dépose des cookies Google dès le chargement, donc la pratique CNIL-compatible est de **bloquer le chargement de l'iframe avant consentement** (image statique + clic pour charger la carte réelle), ou d'utiliser une alternative sans traceur (OpenStreetMap/Leaflet) pour les sites qui veulent éviter toute bannière cookie.
- **YouTube embarqué** : la lecture d'une vidéo YouTube standard conditionne le dépôt de traceurs publicitaires — pratique recommandée : image de prévisualisation cliquable ("facade"), chargement de l'iframe uniquement après clic explicite, ou utilisation du domaine `youtube-nocookie.com` (réduit mais n'élimine pas totalement le risque, à documenter).
- Pour un site Astro Finck & Fisch qui n'utilise **que** des outils de mesure d'audience exemptés (voir ci-dessous) et pas de Google Maps/YouTube embarqué en dur, une bannière cookie peut être évitée entièrement — argument commercial fort pour le client (site plus simple, plus rapide, RGPD-friendly par design).

**Plausible / Umami — exemptés ou non ?** La CNIL propose une liste d'exemptions pour les outils de mesure d'audience qui respectent des critères stricts (finalité strictement limitée à la mesure d'audience, pas de croisement avec d'autres traitements, pas de transfert hors UE sans garanties, information claire, droit d'opposition, anonymisation de l'IP, durée de conservation limitée). Umami et Plausible, en configuration **self-hosted en UE** (ou via leur offre cloud EU pour Plausible) et sans cross-device tracking, correspondent dans les grandes lignes à l'esprit de ces critères (comme Matomo en mode "analytics exempté" est le cas de référence historiquement documenté par la CNIL) — mais la CNIL n'a pas publié de liste nominative à jour incluant explicitement Plausible/Umami : à vérifier sur la page CNIL à jour au moment du projet, et à documenter au cas par cas (mode "cookieless", pas d'identifiant persistant, hébergement UE). Recommandation pratique : privilégier ces outils justement parce qu'ils permettent de **se passer de bannière cookie**, sans présenter cela comme une certification CNIL formelle au client.

### 3.5 Accessibilité numérique (RGAA / European Accessibility Act)

- **RGAA** (référentiel technique français, v4.1.2, 106 critères / 13 thématiques, aligné WCAG 2.1 niveau AA) : historiquement obligatoire pour le secteur public. **Depuis le 28 juin 2025**, l'obligation d'accessibilité numérique s'étend à certains services privés : e-commerce, banque, transport, médias. Seuils d'assujettissement pour ces secteurs : plus de 10 salariés **ou** plus de 2 M€ de chiffre d'affaires. Les micro-entreprises (moins de 10 salariés ET moins de 2 M€ de CA) restent exemptées, sauf délégation de service public. Pour les sites existants concernés, mise en conformité obligatoire au plus tard le 28 juin 2030. Sanctions possibles : jusqu'à 50 000 € pour non-conformité technique, 25 000 € pour défaut de déclaration (renouvelable tous les 6 mois). Sources : synthèses juridiques [Données Personnelles — Accessibilité numérique, obligations des entreprises](https://www.donneespersonnelles.fr/accessibilite-numerique-entreprises), [Datacampus — RGAA et accessibilité numérique, ce qui change depuis juin 2025](https://datacampus.fr/blog/rgaa-2025-accessibilite-numerique-obligations) ; texte de référence [service-public.fr — RGAA](https://www.numerique.gouv.fr/publications/rgaa-accessibilite/).
- **Conséquence directe pour Finck & Fisch** : la quasi-totalité des clients cibles (plombier, coiffeur, restaurant indépendant, petit garage, avocat solo) sont des **micro-entreprises au sens du droit européen** et donc **hors périmètre d'obligation légale RGAA/EAA** dans la plupart des cas. Exception à vérifier au cas par cas : un client avec >10 salariés ou >2 M€ de CA (ex. un garage multi-sites, une franchise) basculerait dans le champ d'application s'il propose un service concerné (réservation en ligne assimilable à de l'e-commerce, par exemple).
- Même hors obligation légale, appliquer un socle d'accessibilité de bon sens (contrastes suffisants, alt text, navigation clavier, structure de titres logique) reste une bonne pratique SEO/UX et un argument de vente différenciant, sans en faire une promesse de conformité RGAA complète non vérifiée par audit.

### 3.6 Droit à l'image (photos de clients/salariés)

Principe constant en droit français (jurisprudence fondée sur l'art. 9 du Code civil, droit au respect de la vie privée) : la publication de la photo identifiable d'une personne nécessite son **consentement préalable et spécifique**, distinct de tout autre document (contrat de travail, devis). Pour un salarié photographié sur le site de son employeur (ex. photo d'équipe d'un salon de coiffure), le consentement au travail n'inclut pas automatiquement le consentement à la diffusion de son image sur le site public — il faut une **autorisation écrite dédiée**, précisant le support (site web), la durée, et la possibilité de rétractation. Même exigence pour des photos de clients (avant/après coiffure, chantier avec le client visible). Bonne pratique à recommander aux clients Finck & Fisch : modèle d'autorisation de droit à l'image signé pour chaque salarié apparaissant sur le site, et pour tout client dont le visage ou des éléments identifiants (plaque d'immatriculation, adresse visible) apparaissent dans les photos avant/après. Référence générale du principe : CNIL et fiches pratiques service-public.fr sur le droit à l'image (à vérifier via [cnil.fr](https://www.cnil.fr/) — recherche "droit à l'image" pour l'URL exacte au moment de la rédaction, non re-vérifiée en direct dans cette session suite à une limite de requêtes atteinte).

### 3.7 Faux avis clients

- Le Code de la consommation (**art. L121-2 et s.**, pratiques commerciales trompeuses) qualifie de pratique commerciale trompeuse le fait de publier de faux avis consommateurs, ou des avis dont l'origine n'est pas garantie/vérifiée, ou de supprimer sélectivement les avis négatifs sans le déclarer. Depuis la transposition de la directive Omnibus (2022), les plateformes d'avis doivent informer sur la méthode de vérification des avis publiés.
- La **DGCCRF** contrôle régulièrement ce secteur : campagnes annuelles ciblant les faux avis, y compris pour des TPE locales qui achètent des avis ou incitent leurs proches à poster de faux avis positifs — sanctions possibles allant de l'amende administrative (jusqu'à 300 000 € pour une personne morale en cas de pratique commerciale trompeuse caractérisée, montant maximal du délit) à la mise en demeure publique. Recommandation directe pour Finck & Fisch : ne jamais proposer à un client de "générer" de faux avis ou d'inciter à des avis non sincères ; se limiter à des dispositifs légitimes (QR code demandant un avis après une prestation réellement effectuée, lien direct vers la fiche GBP). Sources générales : [economie.gouv.fr — DGCCRF, avis en ligne](https://www.economie.gouv.fr/dgccrf) (rechercher "faux avis" pour la fiche pratique à jour), [Légifrance — Code de la consommation, art. L121-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227277).

### 3.8 Affichage des prix, devis obligatoire, démarchage à domicile

- **Affichage des prix des prestations de services** : un arrêté encadre spécifiquement la publicité des prix des prestations de dépannage, réparation et entretien dans le secteur du bâtiment et de l'électroménager (obligation d'informer le consommateur sur le prix du déplacement, le taux horaire de main d'œuvre, avant l'intervention). Principe général applicable à tous les prestataires de services (Code de la consommation, information précontractuelle art. L111-1 : caractéristiques essentielles, prix, délai d'exécution, informations sur le professionnel).
- **Devis obligatoire au-delà de 150 € TTC** : règle communément appliquée dans le secteur du bâtiment/dépannage à domicile (rappelée par les fédérations professionnelles et la DGCCRF) — au-delà de ce montant, un devis écrit, daté, signé par les deux parties est obligatoire avant intervention, avec un délai de validité indiqué. En dessous de ce seuil, le professionnel doit à minima informer le consommateur du prix avant l'intervention (affichage ou communication orale/écrite). Cette règle des 150 € doit être vérifiée dans sa formulation exacte via le site de la DGCCRF/service-public.fr au moment de conseiller un client, le seuil et les modalités précises variant selon les branches.
- **Démarchage / vente à domicile ("Loi Hamon")** : pour toute vente conclue hors établissement (démarchage à domicile, y compris certains devis signés au domicile du client à la suite d'une sollicitation), le consommateur bénéficie d'un délai de rétractation de **14 jours calendaires**, le professionnel doit fournir un formulaire type de rétractation et ne peut pas commencer l'exécution avant la fin du délai sauf demande expresse du consommateur (avec renonciation possible à une partie du délai de rétractation pour les travaux urgents). Cette règle s'applique typiquement à un artisan qui vient signer un devis chez le client sans que celui-ci ait sollicité l'intervention dans son propre local professionnel — pertinent à rappeler aux artisans du bâtiment/dépannage clients de Finck & Fisch, notamment pour les mentions à faire figurer sur leurs devis papier (hors périmètre direct du site web, mais bon conseil client). Référence générale : [service-public.fr — Vente à distance et démarchage, droit de rétractation](https://www.service-public.fr/particuliers/vosdroits/F31179), Code de la consommation art. L221-18 et s.

---

## 4. Emailing des leads du client — Web3Forms vs Formspree vs Netlify vs Cloudflare Workers + Resend

| Solution | Fonctionnement | Hébergement des données | RGPD | Coût |
|---|---|---|---|---|
| **Web3Forms** | Endpoint API à appeler depuis un `<form>` statique, pas de backend à gérer | Service US (infrastructure non précisée publiquement en détail sur la page consultée) | Politique de confidentialité existante, mais hébergement hors UE par défaut à documenter/vérifier au cas par cas | Gratuit avec limite de soumissions/mois, offres payantes au-delà |
| **Formspree** | Endpoint hébergé, tableau de bord de gestion des soumissions | Explicitement **États-Unis** ("technical infrastructure in the US"), avec clause de transfert international type SCC | Transferts hors UE encadrés contractuellement (clauses type), mais donnée hébergée aux US par défaut — point d'attention RGPD (nécessite d'informer le client final dans la politique de confidentialité du site) | Gratuit avec quota bas (quelques dizaines de soumissions/mois), payant ensuite |
| **Netlify Forms** | Intégré nativement si le site est hébergé sur Netlify, aucun script tiers à appeler | Infrastructure Netlify, majoritairement US (AWS), avec des options mais pas de garantie de résidence UE stricte par défaut | Mêmes réserves que les autres solutions US | Gratuit jusqu'à un quota (ex. 100 soumissions/mois sur le plan gratuit), payant au-delà — mais suppose d'héberger tout le site sur Netlify |
| **Cloudflare Workers + Resend (ou Cloudflare Email Routing)** | Formulaire qui poste vers un Worker Cloudflare, lequel envoie l'e-mail via Resend (API transactionnelle) ou déclenche Cloudflare Email Routing | Cloudflare propose une **Data Localization Suite** (Regional Services, Metadata Boundary UE) permettant de contraindre le traitement à l'UE pour certains produits ; Resend annonce une infrastructure "multi-region" et la conformité RGPD/SOC 2 mais sans garantie explicite de résidence UE stricte sur son offre standard | Cloudflare : cadre contractuel RGPD documenté (SCC, Data Privacy Framework), options de localisation UE disponibles selon produit. Resend : conformité annoncée mais résidence des données à clarifier contractuellement pour un usage professionnel FR | Cloudflare Workers/Email Routing : généreux niveau gratuit. Resend : gratuit jusqu'à 3 000 e-mails/mois puis payant à l'usage |

**Sources** : [Formspree — Privacy Policy](https://formspree.io/legal/privacy-policy), [Cloudflare — GDPR/Trust Hub](https://www.cloudflare.com/trust-hub/gdpr/), [Cloudflare Developers — Email Routing](https://developers.cloudflare.com/email-routing/), [Resend — Pricing](https://resend.com/pricing).

**Recommandation Finck & Fisch** :
- Solution la plus simple et la moins chère pour un site vitrine artisan : **Cloudflare Workers + Cloudflare Email Routing** (l'écosystème est déjà probablement utilisé si les sites sont sur Cloudflare Pages) — évite d'ajouter un service tiers supplémentaire dans la chaîne, garde le contrôle technique côté agence, coût nul pour un volume de leads TPE. Limite : Email Routing seul ne fait que transférer/relayer, l'envoi transactionnel sortant (accusé de réception au client final, par ex.) nécessite le binding Email Sending (Workers Paid) ou Resend en complément.
- Si un envoi transactionnel plus riche est nécessaire (accusé de réception personnalisé, templates), ajouter **Resend** en complément du Worker — reste simple, prix très bas au volume TPE.
- Éviter Formspree/Web3Forms comme choix par défaut dès qu'un client est sensible à la localisation des données (avocat, professionnel réglementé) : hébergement US par défaut, moins de contrôle contractuel qu'avec Cloudflare pour une agence qui gère plusieurs sites clients.
- Dans tous les cas, documenter le choix dans la politique de confidentialité du site client (destinataire du formulaire, pays d'hébergement, durée de conservation) — obligation d'information RGPD peu importe le prestataire choisi.

---

## 5. Hébergement et noms de domaine pour clients français

### 5.1 Cloudflare Pages — conditions pour une agence

Cloudflare Pages (hébergement statique, adapté à des sites Astro) permet de gérer plusieurs projets clients sous un même compte, avec possibilité de transférer la propriété d'un domaine/projet à un compte Cloudflare du client si besoin. Points à vérifier avant de généraliser à tous les clients Finck & Fisch : conditions d'usage commercial/agence de Cloudflare (limites de requêtes/bande passante sur le plan gratuit, éventuelles conditions spécifiques "reseller"), et la question de la propriété du compte (recommandation générale du secteur : créer un compte Cloudflare **au nom du client** dès le départ, avec l'agence en accès collaborateur, plutôt qu'un compte agence unique difficile à transférer ensuite).

### 5.2 Registrars de domaine

- **OVH** (FR) : acteur historique français, bureau d'enregistrement accrédité AFNIC pour les `.fr`, offres de mail pro (OVH MX Plan) à bas coût.
- **Gandi** (FR) : bureau d'enregistrement français réputé pour sa politique pro-client (pas d'upsell agressif), bonne option pour un transfert propre au client.
- **Cloudflare Registrar** : vente de domaines "at cost" (pas de marge sur le renouvellement), mais catalogue de TLD plus restreint et accompagnement moins "agence FR" ; intéressant si le site est déjà sur Cloudflare Pages pour tout centraliser, mais à vérifier au cas par cas si le `.fr` y est proposé.
- **Infomaniak** (Suisse, fort ancrage francophone) : hébergeur et registrar avec offres mail professionnelles solides, data centers en Suisse et en France selon les services — argument RGPD/souveraineté appréciable pour des clients sensibles (avocats, professions réglementées).

### 5.3 Règles `.fr` (AFNIC)

L'AFNIC est le registre officiel des `.fr`. Règle d'éligibilité générale (issue du décret n°2007-162 et des règles AFNIC, cadre stable depuis l'ouverture du `.fr` aux particuliers en 2011, assoupli ensuite) : le `.fr` est ouvert à toute personne physique ou morale résidant ou domiciliée dans l'UE (ou dans un pays qui applique un principe de réciprocité) ; un titulaire hors UE doit passer par un mandataire/contact administratif basé en France ou dans l'UE. Pour Finck & Fisch (agence française travaillant avec des artisans français), ce point est rarement bloquant — à documenter simplement pour un client basé hors UE. À vérifier sur la page officielle [AFNIC — Nom de domaine en .fr](https://www.afnic.fr/) (page exacte non re-vérifiée en direct dans cette session, quota de requêtes atteint).

### 5.4 Transfert de propriété au client

Bonne pratique agence à formaliser dans le contrat de prestation Finck & Fisch : le nom de domaine doit être enregistré **au nom du client** dès la création (titulaire = le client, contact technique/admin = l'agence si besoin de gérer au quotidien), jamais au nom de l'agence avec "promesse" de transfert ultérieur — évite les blocages en cas de fin de collaboration et les litiges de propriété. Même logique recommandée pour le compte Cloudflare Pages/hébergement (voir 5.1).

### 5.5 E-mail sur le domaine — que recommander à un client qui n'a pas d'adresse pro

- **Cloudflare Email Routing** : gratuit, mais **redirection uniquement** (contact@domaine.fr → gmail perso du client) — ne permet pas d'envoyer depuis l'adresse pro sans configuration supplémentaire (SMTP relay tiers). Solution minimale et gratuite pour un client qui veut juste "recevoir" sur une adresse pro tout en gardant sa boîte habituelle.
- **Infomaniak** : offres mail professionnelles complètes (boîte réelle, webmail, IMAP/SMTP), data centers en Suisse/France, bon argument souveraineté/RGPD, tarif TPE raisonnable — bon choix par défaut si le client veut une vraie boîte mail professionnelle indépendante.
- **Zoho Mail** : offre gratuite limitée (un domaine, nombre d'utilisateurs restreint) puis payant, alternative si budget serré mais fonctionnalités mail complètes nécessaires.
- **OVH MX Plan** : offre mail pro très bas coût, cohérente si le domaine est déjà chez OVH.

**Recommandation Finck & Fisch** : par défaut, proposer **Cloudflare Email Routing** (gratuit, 5 minutes de configuration) pour la simple réception sur `contact@domaine.fr` redirigée vers la messagerie existante du client — c'est le strict nécessaire pour la crédibilité (avoir une adresse au nom du domaine plutôt qu'un Gmail perso dans les mentions légales/devis). Si le client veut aussi **envoyer** depuis cette adresse avec une vraie boîte, passer à **Infomaniak** (bon rapport souveraineté/prix/simplicité pour une TPE française).

---

## 6. Checklist "site livrable" (30 items, avec source)

1. Fiche GBP créée, validée, catégorie principale précise — [Google, GBP guidelines](https://support.google.com/business/answer/3038177?hl=fr)
2. NAP strictement identique site / GBP / annuaires — synthèse §1.2
3. Une seule catégorie principale + secondaires pertinentes seulement — [Google, gérer catégorie](https://support.google.com/business/answer/7249669?hl=fr)
4. Schema.org sous-type `LocalBusiness` précis par métier (`Plumber`, `HairSalon`, etc.) — [schema.org/LocalBusiness](https://schema.org/LocalBusiness)
5. Pas de balisage `AggregateRating`/`Review` auto-déclaré sur le site du client — [Google, Review Snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
6. Pas de dépendance à `FAQPage` pour un rich result (contenu FAQ gardé pour l'usage, pas pour le SEO technique) — [Google Search Central Blog, 2023](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
7. Pas de pages villes dupliquées sans contenu réellement différenciant — [Google Search Essentials, spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
8. LCP ≤ 2,5 s, INP ≤ 200 ms, CLS ≤ 0,1 vérifiés (PageSpeed Insights/CrUX) — [web.dev, seuils CWV](https://web.dev/articles/defining-core-web-vitals-thresholds)
9. Images avec dimensions explicites + lazy loading, fonts en `font-display: swap` — conséquence directe du point 8
10. Sitemap XML généré et soumis dans Search Console — [Google, Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
11. Indexation demandée manuellement après mise en ligne — [Google, Ask Google to Recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
12. Fiche Bing Places créée (gratuite) — [Bing Places for Business](https://www.bingplaces.com/)
13. Fiche Apple Business Connect créée (gratuite) — [Apple Business Connect](https://businessconnect.apple.com/)
14. Inscription PagesJaunes (gratuite) — [PagesJaunes, conditions de parution](https://www.pagesjaunes.fr/infoslegales/referencement-sur-pagesjaunes/)
15. Numéro de téléphone cliquable (`tel:`) visible dès le premier écran, sticky mobile — synthèse §2.1-2.2
16. Bouton WhatsApp/click-to-chat si pertinent pour le métier — synthèse §2.1
17. Formulaire de contact réduit à 3-4 champs max, téléphone privilégié — synthèse §2.3
18. Avis clients réels affichés via widget GBP (pas de faux avis, pas de JSON-LD self-serving) — §1.4 et §3.7
19. Photos réelles (équipe, lieu, avant/après) — pas de banque d'images générique — synthèse §1.1/§2.1
20. Badges décennale/RGE/Qualibat avec numéro vérifiable affichés si BTP — [WebTensor, preuves site artisan bâtiment](https://webtensor.fr/blog/preuves-site-artisan-batiment)
21. Mentions légales complètes (identité, SIRET/RCS, hébergeur, directeur de publication) — [service-public.fr, mentions obligatoires](https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228)
22. Mention assurance décennale sur mentions légales/devis pour artisans BTP — Code des assurances art. L241-1
23. Politique de confidentialité conforme RGPD pour le formulaire de contact (finalité, base légale, durée, droits) — [CNIL](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
24. Registre des traitements minimal tenu par le client (même TPE) — §3.3
25. Pas de bannière cookie inutile : Google Maps/YouTube en "facade" cliquable, outil de mesure d'audience respectueux privilégié (Plausible/Umami en configuration UE) — [CNIL, cookies et traceurs](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite)
26. Autorisation de droit à l'image signée pour chaque salarié/client photographié — §3.6
27. Vérification du périmètre RGAA/EAA (micro-entreprise généralement exemptée, à documenter) — [Datacampus, RGAA 2025](https://datacampus.fr/blog/rgaa-2025-accessibilite-numerique-obligations)
28. Nom de domaine enregistré au nom du client dès le départ — §5.4
29. Adresse e-mail pro sur le domaine configurée (Cloudflare Email Routing minimum, Infomaniak si besoin d'une vraie boîte) — §5.5
30. Formulaire de contact raccordé à une solution documentée dans la politique de confidentialité (Cloudflare Workers + Resend recommandé, ou alternative validée avec le client) — §4

---

## 7. Sources (récapitulatif)

**Google — documentation officielle**
- [Google Business Profile — Consignes de représentation](https://support.google.com/business/answer/3038177?hl=fr)
- [Google Business Profile — Gérer votre catégorie](https://support.google.com/business/answer/7249669?hl=fr)
- [Google Business Profile — Validation de l'établissement](https://support.google.com/business/answer/7107242?hl=fr)
- [Google Search Central — Review Snippet structured data](https://developers.google.com/search/docs/appearance/structured-data/review-snippet)
- [Google Search Central Blog — Making Review Rich Results more helpful (2019)](https://developers.google.com/search/blog/2019/09/making-review-rich-results-more-helpful)
- [Google Search Central Blog — Changes to HowTo and FAQ rich results (2023)](https://developers.google.com/search/blog/2023/08/howto-faq-changes)
- [Google Search Essentials — Spam policies](https://developers.google.com/search/docs/essentials/spam-policies)
- [Google Search Central Blog — Google Search's guidance about AI-generated content (2023)](https://developers.google.com/search/blog/2023/02/google-search-and-ai-content)
- [Google Search Central — Build and Submit a Sitemap](https://developers.google.com/search/docs/crawling-indexing/sitemaps/build-sitemap)
- [Google Search Central — Manage Sitemaps With Sitemap Index Files](https://developers.google.com/search/docs/crawling-indexing/sitemaps/large-sitemaps)
- [Google Search Central — Ask Google to Recrawl](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl)
- [web.dev — How Core Web Vitals thresholds were defined](https://web.dev/articles/defining-core-web-vitals-thresholds)

**Autres moteurs / annuaires**
- [Bing Places for Business](https://www.bingplaces.com/)
- [Apple Business Connect](https://businessconnect.apple.com/) / [Apple Newsroom, 2023](https://www.apple.com/newsroom/2023/01/introducing-apple-business-connect/)
- [PagesJaunes — Conditions de parution](https://www.pagesjaunes.fr/infoslegales/referencement-sur-pagesjaunes/)
- [schema.org/LocalBusiness](https://schema.org/LocalBusiness)

**Conversion / études**
- [BrightLocal — Local Consumer Review Survey 2025](https://www.brightlocal.com/research/local-consumer-review-survey-2025/)
- [BrightLocal — Local Consumer Review Survey 2024](https://www.brightlocal.com/research/local-consumer-review-survey-2024/)
- [Nielsen Norman Group — Trustworthiness in Web Design](https://www.nngroup.com/articles/trustworthy-design/)
- [CallRail — Optimize Landing Page for Click-to-Call Conversions](https://www.callrail.com/blog/optimize-landing-page-click-to-call-conversions)
- [WebTensor — Preuves à afficher site artisan bâtiment](https://webtensor.fr/blog/preuves-site-artisan-batiment)

**Juridique / CNIL / DGCCRF**
- [CNIL — Cookies et traceurs, comment se mettre en conformité](https://www.cnil.fr/fr/cookies-et-autres-traceurs/regles/cookies/comment-mettre-mon-site-web-en-conformite)
- [CNIL — Enregistrement des conversations téléphoniques](https://www.cnil.fr/fr/lenregistrement-des-conversations-telephoniques-afin-detablir-la-preuve-de-la-formation-dun-contrat)
- [CNIL — RGPD (portail)](https://www.cnil.fr/fr/reglement-europeen-protection-donnees)
- [Légifrance — LCEN consolidée](https://www.legifrance.gouv.fr/loda/id/JORFTEXT000000801164/)
- [Légifrance — Code de la consommation, art. L121-2](https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000032227277)
- [service-public.fr — Mentions obligatoires site internet professionnel](https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228)
- [service-public.fr — Vente à distance et démarchage, droit de rétractation](https://www.service-public.fr/particuliers/vosdroits/F31179)
- [francenum.gouv.fr — Mentions légales site internet](https://www.francenum.gouv.fr/guides-et-conseils/developpement-commercial/site-web/quelles-sont-les-mentions-legales-pour-un-site)
- [Données Personnelles — Accessibilité numérique, obligations des entreprises](https://www.donneespersonnelles.fr/accessibilite-numerique-entreprises)
- [Datacampus — RGAA, ce qui change depuis juin 2025](https://datacampus.fr/blog/rgaa-2025-accessibilite-numerique-obligations)
- [economie.gouv.fr — DGCCRF](https://www.economie.gouv.fr/dgccrf)

**Hébergement / emailing**
- [Formspree — Privacy Policy](https://formspree.io/legal/privacy-policy)
- [Cloudflare — Trust Hub, GDPR](https://www.cloudflare.com/trust-hub/gdpr/)
- [Cloudflare Developers — Email Routing](https://developers.cloudflare.com/email-routing/)
- [Resend — Pricing](https://resend.com/pricing)
- [AFNIC](https://www.afnic.fr/)

**Limites de cette veille** : quota de requêtes de recherche web atteint en cours de session avant d'avoir pu re-vérifier en direct certaines pages précises (CNIL droit à l'image, AFNIC règles .fr détaillées, arrêté prix dépannage à domicile, Web3Forms détails d'hébergement, Cloudflare Registrar/.fr, Infomaniak tarifs exacts). Le contenu correspondant s'appuie sur la connaissance générale du cadre réglementaire français (stable sur ces sujets) plutôt que sur une re-vérification live — à confirmer avant usage contractuel avec un client, en particulier pour tout ce qui touche au droit à l'image et aux seuils de devis (§3.6, §3.8).
