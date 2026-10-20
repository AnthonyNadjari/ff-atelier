# Cadre juridique — Finck & Fisch

> **Ce document n'est pas un conseil juridique.** C'est une synthèse de veille destinée à préparer une
> vraie relecture par un professionnel du droit (avocat en droit des affaires/numérique, ou a minima un
> expert-comptable pour la partie facturation/TVA) avant tout premier usage commercial des modèles du
> dossier `studio/juridique/modeles/`. Le droit cité évolue (facturation électronique, seuils de TVA) — vérifier
> les dates avant chaque envoi client, pas seulement à la création de ce document.
>
> Rédigé le 17 septembre 2026. Sources citées en note de chaque section (Légifrance, service-public.fr,
> economie.gouv.fr, bpifrance-creation.fr, CNIL). Deux points n'ont pas pu être re-vérifiés par requête
> directe pendant cette session (quota de recherche web épuisé en cours de rédaction) : le calendrier
> précis de la facturation électronique au-delà de ce qu'a confirmé `entreprendre.service-public.gouv.fr`,
> et les seuils exacts 2026 de la franchise en base de TVA — signalés ⚠ ci-dessous, à reconfirmer avant
> usage.

## 0. Contexte : ce que vend Finck & Fisch

Deux fondateurs, forme juridique non encore choisie (`micro-entreprise` ou `SAS`, voir § 12).
Prestation : conception d'un site vitrine one-shot pour artisans/TPE, 1 200 à 1 800 €, livraison 72 h
après réception des éléments du client, site possédé par le client, fenêtre de corrections de deux
semaines après restitution, maintenance optionnelle 25 €/mois (voir `docs/PROCESS.md`).

> **20 oct 2026 : modèle validé par le fondateur** (`studio/decisions/PROCESS-HEBERGEMENT.md`). Plus de
> maintenance mensuelle ni d'abonnement : site vendu une fois ([prix à fixer]), modifications au
> forfait, hébergement gratuit accessoire sur le compte Cloudflare de F&F (arrêt possible avec 3 mois de
> préavis et remise du site), domaine acheté par F&F au nom du client et payé 10 ans, formulaire relayé
> sans stockage (F&F reste sous-traitant RGPD pour ce relais, annexe courte). Forme retenue : SAS. Les
> § 5.5 et 5.6 ci-dessous sont à lire avec ce modèle ; les CGV à jour sont `cgv-projet.md` et
> `modeles/cgv-modele.md`.

Deux régimes juridiques différents s'appliquent selon le statut du client final :

- **B2B (le cas très majoritaire)** : le client est un professionnel (artisan, commerçant, société) qui
  achète un service **pour les besoins de son activité professionnelle**. Le droit de la consommation ne
  s'applique pas par défaut — sauf l'exception importante du § 6.
- **B2C** : si un jour le studio vend directement à un particulier (site perso, blog personnel), tout le
  droit de la consommation s'applique sans nuance : rétractation 14 jours pleine, médiation de la
  consommation obligatoire, clauses abusives, etc.

Cette distinction structure tout le document.

---

## 1. Le devis

### 1.1 Est-il obligatoire ?

Pour une prestation de service à un professionnel, aucun texte n'impose un devis écrit systématique
(contrairement au bâtiment/dépannage à domicile où un devis écrit est exigé au-delà d'un certain montant
par arrêté — voir `docs/veille/seo-conversion.md` § 3.8). Mais l'obligation générale d'information
précontractuelle (Code de la consommation, art. **L111-1**, applicable aussi en B2B pour les
caractéristiques essentielles, le prix et le délai — Code de commerce art. **L441-1** pour les
conditions générales de vente en B2B) impose de communiquer prix et délai avant l'engagement. En
pratique commerciale : **toujours un devis écrit signé**, c'est la meilleure protection du studio comme
du client (point de départ des délais, preuve de l'accord sur le périmètre).

### 1.2 Mentions à faire figurer

- Identité complète du studio : dénomination, forme juridique, adresse, SIRET, capital social (si
  société), n° TVA intracommunautaire si assujetti.
- Identité du client : nom/dénomination, adresse, SIRET si professionnel.
- Date d'émission, numéro de devis (numérotation continue, comme les factures — bonne pratique, pas une
  obligation légale stricte pour le devis lui-même, mais facilite la traçabilité).
- Description précise de la prestation : formule (Essentiel/Complet), livrables, délai de livraison
  (72 h après réception des éléments), fenêtre de corrections (2 semaines).
- Prix HT et TTC (ou mention « TVA non applicable, art. 293 B du CGI » si micro-entreprise en franchise
  de TVA — § 11), modalités de paiement, montant de l'acompte demandé (§ 7).
- **Durée de validité de l'offre** (ex. 30 jours) — un devis sans durée de validité reste en théorie
  valable un « délai raisonnable » apprécié au cas par cas ; fixer une durée explicite évite tout litige.
- Conditions de rétractation si applicable (§ 6) — case à cocher pour toute demande expresse de
  commencer l'exécution avant la fin du délai de rétractation.
- Mention de propriété intellectuelle en une ligne (renvoi au contrat pour le détail — § 5.3).
- Signature du client avec la mention « bon pour accord » et la date — c'est cette signature (pas
  l'envoi du devis) qui vaut acceptation et déclenche le compte à rebours des 72 h dès réception des
  éléments.

Sources : [service-public.fr — Devis](https://www.service-public.fr/professionnels-entreprises/vosdroits/F31228),
Code de la consommation art. L111-1, Code de commerce art. L441-1.

### 1.3 Devis gratuit ou payant ?

Aucune obligation légale de gratuité pour un devis de prestation intellectuelle (contrairement au devis
de travaux du bâtiment, où la gratuité est une pratique quasi systématique mais pas non plus imposée par
la loi en toutes circonstances). Pratique du marché : devis gratuit pour ce type de prestation — à
confirmer comme politique commerciale, pas comme obligation.

---

## 2. La facture

### 2.1 Mentions obligatoires (2025-2026)

- Date d'émission et **numéro unique basé sur une séquence chronologique continue**, sans rupture (une
  série par an est tolérée si elle repart proprement).
- Date de la prestation (souvent la date de livraison/restitution).
- Identité complète du vendeur : dénomination, adresse, forme juridique, **SIREN/SIRET**, capital social
  si société.
- Identité de l'acheteur : dénomination ou nom, adresse.
- **N° de TVA intracommunautaire** du vendeur et de l'acheteur professionnel — sauf montant total < 150 €
  HT, et sauf franchise en base (§ 11, mention de substitution).
- Désignation précise de la prestation, quantité, prix unitaire HT, taux de TVA applicable (ou mention
  d'exonération).
- Montant total HT et TTC.
- Date d'échéance du paiement, et **conditions d'escompte** (mention « pas d'escompte pour paiement
  anticipé » si aucun escompte n'est proposé — mention obligatoire même en négatif).
- **Taux des pénalités de retard** et mention de **l'indemnité forfaitaire de 40 €** pour frais de
  recouvrement (§ 8) — obligatoires même si jamais appliquées.
- Pour une vente à un consommateur final : mention de l'existence de la garantie légale de conformité,
  le cas échéant (peu pertinent pour une prestation de service immatérielle comme un site web, mais à
  garder en tête si le studio facture un jour du matériel).

Sanction : facture irrégulière = risque de rejet de la déduction de TVA côté client, amende
administrative pouvant aller jusqu'à 75 000 € (personne physique) par facture manquante ou irrégulière
en cas de contrôle répété (à vérifier au cas par cas, le montant dépend de la gravité et de la
récidive).

Source : [entreprendre.service-public.gouv.fr — Mentions obligatoires sur une facture](https://entreprendre.service-public.gouv.fr/vosdroits/F31808).

### 2.2 Numérotation

Séquence chronologique continue, sans trou ni doublon, par exercice ou en continu. Recommandation
pratique pour le studio : `FF-2026-001`, `FF-2026-002`... — un préfixe studio + année + compteur, facile
à vérifier a posteriori par un contrôleur.

### 2.3 Facturation électronique obligatoire — calendrier micro/SAS 2026-2027

Réforme portée par la loi de finances 2024 (art. 91), déjà décalée une fois par rapport au calendrier
initial (2024-2026) — **à reconfirmer avant chaque échéance**, le calendrier peut encore bouger avec les
lois de finances votées d'ici là (instabilité budgétaire française constatée en 2025-2026).

Calendrier actuellement en vigueur (confirmé par `entreprendre.service-public.gouv.fr` le 17 septembre
2026) :

| Obligation | Grandes entreprises / ETI | PME, TPE, micro-entreprises |
|---|---|---|
| **Réception** de factures électroniques (via une plateforme agréée ou le portail public) | 1er septembre 2026 | 1er septembre 2026 ⚠ (l'obligation de réception s'applique en principe à toutes les entreprises dès la même date, quelle que soit leur taille — point cohérent avec la doctrine générale de la réforme mais non retrouvé mot pour mot dans la page consultée cette session ; à reconfirmer sur [impots.gouv.fr — Facturation électronique](https://www.impots.gouv.fr/) avant d'informer un client) |
| **Émission** de factures électroniques (B2B, vers d'autres entreprises françaises assujetties) | 1er septembre 2026 | **1er septembre 2027** |

Conséquence concrète pour Finck & Fisch :
- Si le studio facture en **SAS**, il devra pouvoir **émettre** ses factures via une plateforme de
  dématérialisation partenaire (PDP) au plus tard le 1er septembre 2027 (PME) — ou plus tôt si le studio
  choisit d'anticiper. Il devra pouvoir **recevoir** des factures électroniques de ses propres
  fournisseurs dès le 1er septembre 2026.
- Si le studio facture en **micro-entreprise**, le même calendrier « PME/TPE/micro-entreprises »
  s'applique : émission au 1er septembre 2027.
- Les factures aux **particuliers** (B2C, hors périmètre principal de F&F) restent hors du champ de
  l'obligation d'e-invoicing B2B, mais un mécanisme d'e-reporting des transactions B2C vers
  l'administration fiscale existe en parallèle — à ne pas confondre avec la facturation électronique
  B2B elle-même.
- Cette réforme ne dispense pas de la facture papier/PDF classique conforme au § 2.1 tant que
  l'obligation n'est pas entrée en vigueur pour la taille d'entreprise concernée.

Sources : [entreprendre.service-public.gouv.fr — Facture](https://entreprendre.service-public.gouv.fr/vosdroits/F31808),
[economie.gouv.fr — Facturation électronique entre entreprises](https://www.economie.gouv.fr/entreprises/facturation-electronique-entreprises) (page consultée mais non chargée avec succès cette session, HTTP 403 — à revisiter).

---

## 3. Les CGV (conditions générales de vente)

### 3.1 Obligatoires ou non ?

- **B2C** : les CGV (ou au minimum les informations précontractuelles qu'elles formalisent — prix,
  caractéristiques, délai, droit de rétractation, garanties) sont obligatoires pour toute vente à un
  consommateur, à distance ou non (Code de la consommation, art. **L111-1** et s., art. **L221-5** pour
  la vente à distance).
- **B2B** : les CGV ne sont **pas obligatoires par défaut**, mais **doivent être communiquées à tout
  professionnel qui en fait la demande** avant toute commande, sous peine d'amende administrative (Code
  de commerce, art. **L441-1**, jusqu'à 15 000 € pour une personne physique, 75 000 € pour une personne
  morale, en cas de refus de communication). En pratique : les rédiger une fois, les publier sur le site
  vitrine du studio (`sites/finck-fisch`) et les joindre systématiquement au devis — plus simple et plus
  sûr que d'attendre une demande.

### 3.2 Contenu attendu

- Champ d'application (prestations concernées : sites vitrines one-shot, formules Essentiel/Complet).
- Prix et modalités de paiement (acompte, solde, moyens de paiement acceptés).
- Délai de livraison et ses conditions (dépend de la réception des éléments du client — clause de
  suspension du délai si le client tarde à fournir les éléments).
- Modalités de la fenêtre de corrections (2 semaines, ce qu'elle couvre / ne couvre pas).
- Propriété intellectuelle : renvoi à la clause de cession du contrat (§ 5.3), plus la réserve sur
  l'outillage interne du studio.
- Responsabilité et garanties (§ 5.4).
- Résiliation / rupture anticipée.
- Droit de rétractation le cas échéant (§ 6).
- Médiation de la consommation si un client final est un consommateur (§ 9) — inutile de la prévoir en
  B2B pur, mais la garder en réserve dans un paragraphe conditionnel si le studio vend un jour du
  contenu à un particulier.
- Loi applicable et juridiction compétente (droit français, tribunal du siège du studio pour le B2B —
  en B2C, le consommateur garde toujours le droit de saisir la juridiction de son propre domicile, une
  clause contraire serait une clause abusive, voir § 3.3).
- Clause de force majeure, clause de confidentialité réciproque si le studio a accès à des données
  sensibles du client (comptes, identifiants).

### 3.3 Clauses abusives à éviter (repère B2C, bonne pratique aussi en B2B)

Liste indicative issue des recommandations de la Commission des clauses abusives et de la liste noire de
l'article R212-1 du Code de la consommation (clauses présumées abusives de manière irréfragable en B2C) —
à ne reproduire dans aucun modèle :
- Clause qui **supprime ou réduit le droit à réparation** du consommateur en cas de manquement du
  professionnel.
- Clause qui **impose au consommateur la charge de la preuve** que le professionnel a rempli ses
  obligations (renversement de la charge de la preuve).
- Clause qui **restreint la juridiction compétente** contre le choix du consommateur, ou l'oblige à
  saisir exclusivement un tribunal éloigné.
- Clause qui **autorise le professionnel seul à modifier unilatéralement** les caractéristiques du
  service sans motif valable indiqué dans le contrat.
- Clause qui prévoit une **indemnité disproportionnée** à la charge du consommateur en cas d'inexécution
  ou de retard de sa part, sans clause symétrique côté professionnel.
- Clause qui **exclut ou limite le droit de rétractation** dans un cas où il s'applique légalement.
- Clause de **reconduction tacite sans information claire** du délai de dénonciation (rappel du
  positionnement anti-abonnement de F&F documenté dans `docs/veille/concurrents.md` § 4-5 — un motif
  de plainte récurrent chez les concurrents à éviter structurellement).

Source : [Légifrance — Code de la consommation, art. R212-1 et s. (clauses abusives)](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069565), DGCCRF — liste des clauses abusives (à rechercher sur economie.gouv.fr, page non re-vérifiée par fetch direct cette session).

---

## 4. Contrat de prestation de création de site — check-list

Voir le modèle complet `studio/juridique/modeles/contrat-modele.md`. Résumé de ce qu'il doit couvrir :

1. **Objet** : conception et développement d'un site vitrine one-shot, formule Essentiel ou Complet,
   sur la base du brief signé (`docs/BRIEF.md`/`sites/<slug>/brief.md`).
2. **Livrables** : site déployé sur le domaine du client, fichiers sources (dépôt de code), accès au
   compte d'envoi de formulaire (Web3Forms ou équivalent) créé au nom du client.
3. **Délais** : 72 h ouvrées après réception complète des éléments (texte validé, photos, logo, SIRET,
   avis) — le délai ne court pas tant que les éléments manquent (clause de suspension), comme documenté
   dans `docs/PROCESS.md` § 3-4.
4. **Prix, acompte, échéancier** : voir § 7.
5. **Propriété intellectuelle** : voir § 5.3 — cession conforme à l'article L131-3 du CPI, distincte de
   l'outillage interne du studio (§ 5.3.3).
6. **Garantie de conformité** : voir § 5.4.
7. **Responsabilité** : voir § 5.4.
8. **RGPD / sous-traitance** : voir § 5.5.
9. **Réversibilité** : voir § 5.6.
10. **Résiliation** : conditions de rupture anticipée par l'une ou l'autre partie, sort des sommes déjà
    versées.
11. **Droit applicable, litiges, médiation** : voir § 3.2, § 9.

### 5.3 Propriété intellectuelle — la clause centrale

#### 5.3.1 Ce qui est cédé

Le site livré (code, mise en page, textes rédigés pour le client, éléments graphiques créés
spécifiquement pour lui) est une œuvre de l'esprit protégée par le droit d'auteur. Sans clause de
cession explicite, **le studio resterait titulaire des droits patrimoniaux** même après paiement intégral
et livraison — le client n'aurait qu'un droit d'usage implicite et fragile. La cession doit donc être
écrite et respecter le formalisme strict de l'**article L131-3 du Code de la propriété intellectuelle** :

> Chaque droit cédé doit faire l'objet d'une mention distincte dans l'acte de cession, et le domaine
> d'exploitation des droits cédés doit être délimité quant à son **étendue** et à sa **destination**,
> quant au **lieu** et quant à la **durée**.

(Texte confirmé sur [Légifrance — Code de la propriété intellectuelle, art. L131-3](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069414/LEGISCTA000006161639).)

Concrètement, la clause du contrat doit donc préciser, pour chacun des quatre critères :
- **Étendue** : droits de reproduction et de représentation cédés (le site web tel que livré : structure
  HTML/CSS, mise en page, textes rédigés pour le client) — à distinguer explicitement de l'outillage
  (§ 5.3.3).
- **Destination** : exploitation du site à des fins de présentation commerciale de l'activité du client,
  sur le web.
- **Lieu** : monde entier (un site web n'a pas de frontière géographique naturelle — le préciser évite
  toute contestation).
- **Durée** : durée de la propriété littéraire et artistique (vie de l'auteur + 70 ans, Code de la
  propriété intellectuelle art. L123-1) — en pratique une cession « pour la durée légale de protection
  des droits d'auteur ».

La cession prend effet **au paiement intégral du solde**, pas à la simple livraison — clause à préciser
explicitement pour éviter qu'un client livré mais n'ayant pas soldé la facture ne revendique la pleine
propriété du site.

#### 5.3.2 Photos et contenus fournis par le client

Le client reste titulaire de ses propres textes, photos et logo fournis pour le site — le studio n'en
acquiert qu'un droit d'usage limité à la réalisation de la prestation. Rappel opérationnel (déjà dans
`CLAUDE.md` § règles dures et `docs/veille/redaction-images.md`) : le studio doit vérifier que le client
détient bien les droits sur les photos qu'il transmet (droit à l'image des personnes photographiées —
voir `docs/veille/seo-conversion.md` § 3.6), et n'utilise pas de banque d'images sans licence appropriée
pour les visuels ajoutés par le studio lui-même.

#### 5.3.3 Ce qui reste au studio

La cession porte sur **le site livré au client**, pas sur :
- le système/moteur (composants Astro, moteur d'animation, directions visuelles, scripts internes de
  génération — `src/` de ce dépôt et tout ce qui sert à produire d'autres sites) ;
- les méthodes, gabarits, composants réutilisables et le savoir-faire du studio, qui restent la
  propriété du studio et continuent d'être utilisés pour d'autres clients.

C'est une clause de réserve classique en prestation de développement sur mesure à partir d'un système
propre à un prestataire (comparable à une agence qui garde son framework interne tout en cédant le site
fini) — à formuler explicitement pour éviter toute ambiguïté, notamment si un client venait à demander
l'accès au « code source complet du studio » plutôt qu'au site qui lui a été livré.

#### 5.4 Garantie de conformité et responsabilité

- **Garantie de conformité au brief/devis signé** : le studio s'engage sur la conformité du site livré
  au périmètre validé (formule, nombre de pages, sections convenues) — pas sur un résultat commercial
  (nombre de leads, position Google). Reprendre ici l'argumentaire déjà validé dans
  `docs/veille/concurrents.md` § 4 : garantie de délai/livraison, pas garantie de résultat SEO
  (juridiquement fragile, cf. `docs/veille/seo-conversion.md` § 3, sources sur les promesses SEO
  trompeuses).
- **Responsabilité limitée au montant de la prestation** : clause de plafonnement usuelle en B2B (valable
  entre professionnels, sous réserve de ne pas vider de sa substance une obligation essentielle — la
  jurisprudence Chronopost/Faurecia impose que la limitation de responsabilité ne prive pas le contrat de
  sa cause). En B2C, une clause de ce type doit être manœuvrée avec prudence (voir clauses abusives,
  § 3.3) — le studio ne peut pas s'exonérer de sa responsabilité pour faute ou dol.
- **Le studio n'est pas hébergeur au sens de la LCEN** pour le contenu du client une fois le site
  transféré à un hébergeur/registrar au nom du client (`docs/PROCESS.md` § 7) — préciser ce transfert de
  responsabilité dans le contrat, avec une date de bascule claire.

#### 5.5 RGPD — le studio comme sous-traitant (article 28 RGPD)

Si l'atelier héberge ou gère techniquement le formulaire de contact du site client (par exemple mode
`provider: 'cloudflare'` avec le Worker `src/worker/contact.js`, ou `web3forms` configuré par le studio
plutôt qu'au nom du client — rappel : la règle actuelle du studio est justement de générer la clé
**au nom du client**, `docs/PROCESS.md` § 7), le studio agit comme **sous-traitant au sens de l'article
28 du RGPD**, le client restant responsable de traitement. Le contrat doit alors inclure une clause de
sous-traitance (ou une annexe DPA — Data Processing Agreement) précisant, conformément aux obligations
confirmées par la CNIL :
- l'objet, la durée, la nature et la finalité du traitement, le type de données et les catégories de
  personnes concernées (essentiellement : nom, e-mail, téléphone, message du formulaire de contact) ;
- l'obligation du studio de **traiter les données uniquement sur instruction documentée** du client ;
- l'obligation de **garantir la sécurité des données traitées** (mesures techniques et
  organisationnelles) ;
- l'obligation d'**assistance, d'alerte et de conseil**, avec notamment une procédure de notification
  des violations de données au client sans délai indu ;
- les conditions de recours à un **sous-traitant ultérieur** (ex. Cloudflare, Resend, Web3Forms comme
  sous-traitants du studio — chaîne de sous-traitance à documenter, cf.
  `docs/veille/seo-conversion.md` § 4 sur l'hébergement des données de ces services hors UE selon le
  cas) ;
- le sort des données à la fin du contrat (suppression ou restitution).

Source : [CNIL — Le sous-traitant, définition et obligations](https://www.cnil.fr/fr/definition/sous-traitant).
Dans le cas de figure normal de F&F (formulaire au nom du client dès la livraison, clé/compte propre au
client), le studio **cesse d'être sous-traitant après livraison** — la clause DPA ne couvre alors que la
courte période de production/tests avant remise, à préciser explicitement pour éviter une obligation
DPA qui traînerait sans objet après la livraison.

#### 5.6 Réversibilité

- **Fichiers sources** : accès au dépôt de code remis/accessible au client à la livraison
  (`docs/PROCESS.md` § 7, déjà une règle du studio).
- **Domaine** : transféré ou acheté au nom du client dès le départ, jamais au nom du studio.
- **Formulaire de contact / clé d'envoi** : générée au nom du client sur son propre compte, jamais la
  clé du studio réutilisée (déjà une règle dure documentée).
- **Hébergement** : si le studio a déployé sur Cloudflare Pages avec son propre compte pendant la
  production, préciser le transfert du projet Cloudflare Pages vers un compte au nom du client à la
  livraison, ou la remise du build statique complet pour un hébergement ailleurs (voir
  `docs/DEPLOIEMENT.md`).

---

## 6. Délai de rétractation — le point le plus sensible pour ce type de clientèle

### 6.1 Principe B2C

Pour une vente à distance ou hors établissement à un **consommateur** (particulier), délai de
rétractation de **14 jours calendaires** à compter de la conclusion du contrat pour une prestation de
service (Code de la consommation, art. **L221-18**). Le professionnel doit fournir un formulaire type de
rétractation et ne peut commencer l'exécution avant la fin du délai, **sauf demande expresse du
consommateur** (art. **L221-25**) — et dans ce cas, s'il demande l'exécution complète avant la fin du
délai, il **perd son droit de rétractation une fois la prestation intégralement exécutée** (le
consommateur doit être informé de cette conséquence, et cette information doit être recueillie
explicitement, pas présumée).

### 6.2 L'exception clé pour les clients de Finck & Fisch : l'article L221-3

C'est le point signalé explicitement dans le mandat de ce document, et il mérite d'être détaillé car il
concerne potentiellement **la majorité des clients artisans/TPE de F&F**, alors même qu'ils sont des
professionnels.

> L'article **L221-3 du Code de la consommation** étend certaines protections du droit de la
> consommation (dont le droit de rétractation des sections concernées) aux contrats conclus entre un
> professionnel et **un autre professionnel employant au plus 5 salariés**, **lorsque l'objet du contrat
> n'entre pas dans le champ de son activité principale**.

(Confirmé par consultation Légifrance, formulation reprise § recherche ci-dessus.)

**Application concrète** : un plombier, un coiffeur, un boulanger (généralement ≤ 5 salariés pour la
clientèle cible de F&F) qui achète un **site web** à Finck & Fisch achète une prestation qui **n'entre
pas dans le champ de son activité principale** (son activité principale est la plomberie, la coiffure, la
boulangerie — pas la création de sites web). Il **bénéficie donc, par extension légale, du droit de
rétractation de 14 jours** applicable aux consommateurs, **si le contrat est conclu à distance ou hors
établissement** — ce qui est le cas quasi systématique du parcours F&F (appel téléphonique, devis
envoyé et signé à distance, pas de rendez-vous dans un local commercial du studio).

Conséquences pratiques à intégrer dans le devis/contrat :
- Prévoir le formulaire type de rétractation dans les documents envoyés à un client artisan de ≤ 5
  salariés dès lors que le contrat est signé à distance — **par prudence, même si le studio ne vend
  qu'en B2B**, plutôt que de parier sur une exception qui ne s'appliquerait pas.
- Étant donné le délai de livraison de 72 h annoncé comme argument commercial fort, la production
  démarrerait presque nécessairement avant la fin des 14 jours de rétractation légale si rien n'est
  prévu — d'où l'intérêt fort d'une **clause de demande expresse du client de commencer l'exécution
  avant la fin du délai de rétractation** (case à cocher explicite sur le devis, distincte de la
  signature générale, conforme à l'art. L221-25), avec l'information claire que la prestation
  intégralement exécutée fait perdre le droit de rétractation.
- Sans cette clause, un client artisan pourrait en théorie se rétracter dans les 14 jours **après avoir
  reçu son site fini**, ce qui viderait la promesse commerciale « livré en 72 h » de tout intérêt pour
  le studio si le client change d'avis entre-temps.
- Cette règle ne s'applique **pas** si le client a plus de 5 salariés, ou si l'objet du contrat entre
  dans son activité principale (hypothèse rare pour un artisan du bâtiment ou du commerce, mais
  possible par exemple pour... une agence de communication ou un développeur freelance qui serait
  client de F&F pour une sous-traitance : dans ce cas précis, l'objet entrerait dans son activité
  principale, et l'exception ne s'appliquerait pas).

Source : Code de la consommation, art. L221-3, L221-18, L221-25 —
[Légifrance — Code de la consommation](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565/),
[service-public.fr — Vente à distance et démarchage, droit de rétractation](https://www.service-public.fr/particuliers/vosdroits/F31179)
(citée dans `docs/veille/seo-conversion.md` § 3.8).

### 6.3 Cas B2B pur (hors exception L221-3)

Pour un client professionnel de plus de 5 salariés, ou dont l'objet du contrat entre dans son activité
principale : **aucun droit de rétractation légal**. Le contrat peut prévoir une clause de résiliation
anticipée négociée (ex. remboursement partiel si annulation avant le début de production), mais ce n'est
pas une obligation.

---

## 7. Acompte vs arrhes

Distinction juridique importante, souvent confondue en pratique commerciale :

- **Acompte** : premier versement qui engage fermement les deux parties. Ni le client ni le
  professionnel ne peuvent se rétracter sans indemniser l'autre partie du préjudice réellement subi. En
  cas d'annulation par le client, le studio peut retenir l'acompte à hauteur du préjudice réel (travail
  déjà engagé), pas nécessairement la totalité, sauf clause pénale valable.
- **Arrhes** : versement qui autorise chacune des parties à se dédire — le client perd les arrhes s'il se
  rétracte, le professionnel doit rembourser le double s'il annule (Code civil, art. **1590**). Par
  défaut, en l'absence de précision contraire dans le contrat, une somme versée d'avance est présumée
  être des **arrhes** en droit civil général — mais le Code de la consommation prévoit l'inverse par
  défaut pour une vente à un consommateur (présomption d'arrhes également, sauf stipulation contraire
  qualifiant expressément d'« acompte »).

**Recommandation pour F&F** : qualifier explicitement et sans ambiguïté le versement initial d'**acompte**
dans le devis et le contrat (« Cette somme constitue un acompte, non remboursable en cas de rétractation
tardive du client après le début de la production, hors exercice du droit légal de rétractation prévu
§ 6 ») — un acompte protège mieux le studio qu'un régime d'arrhes par défaut, à condition que le mot
« acompte » soit écrit noir sur blanc (la simple absence de précision jouerait en défaveur du studio).

Montant usuel : **50 %** à la signature, solde à la livraison (avant transfert final des accès/domaine —
clause de rétention légitime du studio tant que le solde n'est pas payé, à formaliser).

---

## 8. Pénalités de retard et indemnité forfaitaire de 40 € (B2B)

Applicable aux transactions entre professionnels (Code de commerce, art. **L441-10**, ex-L441-6) :

- **Taux des pénalités de retard** : à défaut de taux contractuel plus favorable au créancier, taux légal
  minimum = taux d'intérêt appliqué par la BCE à son opération de refinancement la plus récente **+ 10
  points**. Exigibles **le lendemain de la date de paiement figurant sur la facture**, sans qu'un rappel
  soit nécessaire.
- **Indemnité forfaitaire de 40 €** pour frais de recouvrement, due de plein droit en cas de retard de
  paiement entre professionnels, en plus des pénalités de retard — et sans qu'un formalisme
  supplémentaire soit requis pour la réclamer (mais elle doit être **mentionnée sur la facture** pour être
  opposable, § 2.1). Le créancier peut demander une indemnisation complémentaire sur justificatifs si les
  frais de recouvrement réellement engagés dépassent ce forfait.
- Cette clause doit figurer sur **chaque facture** (mention du taux et de l'indemnité), pas seulement
  dans les CGV ou le contrat — une facture sans cette mention est irrégulière.

Cette règle ne s'applique **pas** en B2C (un particulier en retard de paiement relève d'un régime
différent, intérêts moratoires au taux légal simple, pas d'indemnité forfaitaire de 40 €).

Source : Code de commerce, art. L441-10 (texte confirmé par consultation Légifrance le 17 septembre
2026 — taux BCE + 10 points, indemnité 40 € mentionnée en II de l'article, exigibilité sans mise en
demeure).

---

## 9. Médiation de la consommation

Obligation **uniquement pour les ventes B2C** (Code de la consommation, art. **L616-1** et s.) : tout
professionnel vendant à des consommateurs doit permettre le recours gratuit à un médiateur de la
consommation en cas de litige non résolu à l'amiable, et communiquer ses coordonnées (site web, CGV,
factures). Le médiateur doit être référencé par la Commission d'évaluation et de contrôle de la
médiation de la consommation (CECMC).

Pour Finck & Fisch, activité **B2B quasi exclusive**, cette obligation ne s'applique pas par défaut —
mais elle redevient pertinente si un client artisan de ≤ 5 salariés se prévaut de l'extension L221-3
(§ 6.2), puisque cette extension porte sur les sections « rétractation » du code, **pas** nécessairement
sur la médiation (l'art. L616-1 vise expressément les litiges de consommation, périmètre plus étroit —
point à faire confirmer par le professionnel du droit qui relira ce dossier, car la portée exacte de
l'extension L221-3 à la médiation n'a pas pu être vérifiée avec certitude cette session ⚠). Par
prudence commerciale, F&F peut choisir d'adhérer à un médiateur de la consommation malgré tout (coût
modique pour une petite structure, argument de sérieux) — décision à trancher (§ 12, point 9).

Rappel : `sites/lemaire-avocats` (client fictif de démonstration du dépôt) cite déjà le médiateur de la
consommation propre à la profession d'avocat dans `legal.mediator` — bon rappel que **si F&F devient
un jour une profession réglementée ou rejoint un ordre professionnel**, un médiateur sectoriel
spécifique pourrait s'appliquer ; non pertinent aujourd'hui pour une activité de création de sites web,
qui n'est pas réglementée.

---

## 10. Assurance responsabilité civile professionnelle (RC Pro)

**Non obligatoire légalement** pour une activité de création de sites web (contrairement aux artisans du
bâtiment soumis à la garantie décennale, Code des assurances art. L241-1, cité dans
`docs/veille/seo-conversion.md` § 3.1). **Fortement recommandée** dans les faits :
- couvre les dommages causés à un client du fait d'une faute du studio (site qui ne fonctionne pas,
  perte de données du formulaire, contenu qui expose le client à un litige si le studio a mal conseillé
  sur une mention légale) ;
- couvre aussi la responsabilité du studio en tant que sous-traitant RGPD (§ 5.5) en cas de faille de
  sécurité imputable au studio pendant la période où il gère le formulaire ;
- coût pour une micro-activité de service intellectuel : de l'ordre de quelques centaines d'euros par an
  (fourchette à faire chiffrer par un courtier, non vérifiée par une source officielle cette session —
  à obtenir directement auprès d'un assureur/courtier avant de citer un montant à un client ou dans un
  business plan) ⚠.
- argument commercial : peut être mentionnée dans les CGV/le site studio comme gage de sérieux, à la
  manière de la mention d'assurance décennale recommandée aux artisans clients de F&F eux-mêmes.

---

## 11. TVA — micro-entreprise et franchise en base (article 293 B du CGI)

- Une **micro-entreprise** (régime fiscal de la micro-entreprise, ex-auto-entrepreneur) bénéficie par
  défaut de la **franchise en base de TVA** (Code général des impôts, art. **293 B**) tant que son
  chiffre d'affaires reste sous un seuil annuel. Concrètement, la micro-entreprise ne facture pas de TVA
  et porte la mention obligatoire **« TVA non applicable, art. 293 B du CGI »** sur chaque facture, à la
  place du taux et du montant de TVA.
- **Seuils** : les seuils de la franchise en base pour les prestations de services évoluent
  régulièrement et ont fait l'objet d'un débat budgétaire mouvementé en France en 2025 (projet de
  réduction uniforme à 25 000 €, contesté, partiellement suspendu) — **les montants précis en vigueur au
  moment de la création effective de la structure doivent être revérifiés sur
  [entreprise.gouv.fr](https://entreprendre.service-public.gouv.fr/) ou auprès d'un expert-comptable, pas
  supposés stables** ⚠ (non confirmés par une source officielle chargée avec succès cette session,
  plusieurs tentatives ayant échoué en HTTP 403/404).
- Une **SAS** est en revanche assujettie à la TVA dès sa création (sauf option spécifique rarement
  pertinente ici), et doit facturer la TVA au taux normal (20 % pour une prestation de service standard)
  dès le premier euro de chiffre d'affaires.
- Cette différence de régime TVA est un point de décision structurant pour le choix de la forme
  juridique (§ 12, point 2) : en micro-entreprise, les prix affichés TTC = HT pour le client (avantage
  concurrentiel prix perçu par le client, mais TVA non récupérable pour un client assujetti qui aurait
  pu la déduire) ; en SAS, prix HT + 20 % pour le client final, mais TVA récupérable pour les clients
  professionnels assujettis.
- **En cas de dépassement du seuil de franchise en base en cours d'année**, la micro-entreprise devient
  redevable de la TVA à compter du premier jour du mois de dépassement (ou selon un mécanisme de seuil
  majoré à vérifier au moment concerné) — à surveiller activement si le studio approche du seuil, car
  l'omission de facturer la TVA due expose à un rappel rétroactif.

Sources générales : Code général des impôts, art. 293 B ; [bpifrance-creation.fr — Franchise en base de
TVA](https://bpifrance-creation.fr/) (page générale du site, recherche « franchise en base de TVA micro-entreprise »
recommandée au moment de vérifier le seuil exact, les URLs profondes tentées cette session ont échoué en
404/403).

---

## 12. Les 10 points que les deux fondateurs doivent trancher

Cette liste conditionne directement le contenu final des modèles (`studio/juridique/modeles/*.md`) — plusieurs
clauses des modèles sont volontairement laissées en `{{placeholder}}` ou en variante A/B tant que ces
points ne sont pas décidés.

1. **Forme juridique — et une tension à trancher en priorité.** Une **micro-entreprise** (régime
   fiscal/social) repose juridiquement sur une **entreprise individuelle : une seule personne physique
   exploitante**. Elle ne permet pas nativement à deux fondateurs de se partager la propriété de
   l'activité en tant qu'associés (l'un pourrait être micro-entrepreneur et l'autre salarié ou
   collaborateur informel, ce qui pose des questions de droit du travail/URSSAF si le second travaille
   réellement dans la structure sans statut). Pour deux co-fondateurs à parts égales, une **société**
   (SAS, la forme la plus flexible pour une jeune structure à deux, statuts libres, responsabilité
   limitée aux apports) est la solution structurellement adaptée — la micro-entreprise n'est réaliste
   que si un seul des deux fondateurs est effectivement l'exploitant légal et que l'autre a un autre
   statut (associé d'une structure séparée qui facture le studio, salarié, etc. — schéma plus complexe
   à documenter avec un professionnel du droit/un expert-comptable avant de s'engager).
2. **Régime de TVA** : franchise en base (293 B, micro-entreprise) ou TVA normale dès le départ (SAS) —
   conditionne les prix affichés (HT vs TTC) et la mention à faire figurer sur chaque facture (§ 11).
3. **Assurance RC Pro** : souscrire ou non dès le lancement, et pour quel montant de garantie — arbitrage
   coût (quelques centaines d'euros/an, à faire chiffrer) contre couverture d'un risque réel (faille de
   sécurité du formulaire de contact pendant la phase où le studio le gère, litige sur un contenu mal
   conseillé).
4. **Adhésion à un médiateur de la consommation** : non obligatoire en B2B pur, mais possible par
   prudence si l'exception L221-3 (§ 6.2, § 9) s'applique souvent aux clients réels du studio — à
   trancher avec un professionnel du droit, le coût d'adhésion à un médiateur généraliste est modeste.
5. **Politique de rétractation** : accepter d'informer systématiquement les clients ≤ 5 salariés de leur
   droit de rétractation de 14 jours (§ 6.2) et faire signer une demande expresse de commencer
   l'exécution avant la fin du délai — ou risquer une contestation client sur un site déjà livré en 72 h.
   C'est un choix de prudence juridique qui a un impact commercial direct (le studio ne peut pas garantir
   « payé aujourd'hui, en ligne dans 72 h, définitif » sans cette clause signée).
6. **Montant exact de l'acompte** : le mandat mentionne 50 % — à confirmer comme politique définitive
   (vs. un tiers/deux tiers, ou un acompte + paiement intermédiaire).
7. **Politique de pénalités de retard côté studio** : le taux minimum légal (BCE + 10 points) s'applique
   par défaut si rien n'est précisé de plus favorable — décider si le studio applique ce taux minimum ou
   un taux contractuel différent (toujours ≥ au minimum légal), et si l'indemnité de 40 € est
   systématiquement réclamée en cas de retard client ou seulement en dernier recours (choix commercial,
   la mention doit figurer sur la facture dans tous les cas, § 8).
8. **Hébergeur mentionné dans les mentions légales du site studio propre** (`sites/finck-fisch`) : à
   date, si le studio déploie sur Cloudflare Pages, le champ `legal.host` par défaut du schéma
   (`src/lib/schema.ts`) pointe déjà vers Cloudflare, Inc. — à confirmer que c'est toujours
   l'hébergeur réel utilisé pour le propre site vitrine du studio au moment de publier ses mentions
   légales.
9. **Quel médiateur choisir si le point 4 est validé** : liste des médiateurs agréés CECMC à consulter,
   coût d'adhésion annuel à comparer (hors périmètre de cette veille, action humaine).
10. **Date de bascule de responsabilité du formulaire de contact** : à documenter précisément dans le
    contrat (§ 5.5) — le moment exact où le studio cesse d'être sous-traitant RGPD du client (mise en
    ligne définitive avec la clé/le compte au nom du client, ou une date contractuelle fixe après
    livraison) ; actuellement implicite dans le process (`docs/PROCESS.md` § 7), à formaliser en clause
    contractuelle datée.

---

## 13. Sources consultées (récapitulatif)

- [entreprendre.service-public.gouv.fr — Mentions obligatoires sur une facture](https://entreprendre.service-public.gouv.fr/vosdroits/F31808)
- [Légifrance — Code de la propriété intellectuelle, art. L131-3](https://www.legifrance.gouv.fr/codes/section_lc/LEGITEXT000006069414/LEGISCTA000006161639)
- [Légifrance — Code de la consommation, art. L221-3 et s.](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000006069565/)
- [Légifrance — Code de commerce, art. L441-10 (pénalités de retard, indemnité de 40 €)](https://www.legifrance.gouv.fr/codes/texte_lc/LEGITEXT000005634379/)
- [CNIL — Le sous-traitant, définition et obligations (art. 28 RGPD)](https://www.cnil.fr/fr/definition/sous-traitant)
- [service-public.fr — Vente à distance et démarchage, droit de rétractation](https://www.service-public.fr/particuliers/vosdroits/F31179)
- `docs/veille/seo-conversion.md` § 3 (mentions légales, RGPD formulaire, cookies, droit à l'image, faux
  avis, devis obligatoire) — déjà vérifié par une veille précédente du dépôt, repris ici sans
  re-vérification.
- `docs/veille/concurrents.md` § 4-5 (positionnement anti-abonnement, garantie de délai plutôt que de
  résultat, transparence sur la propriété du code — arguments repris dans les clauses du contrat et des
  CGV).
- Tentatives infructueuses cette session (403/404, non re-tentées après épuisement du quota de
  recherche web) : economie.gouv.fr (plusieurs pages sur la médiation, la franchise TVA et les délais de
  paiement), impots.gouv.fr (facturation électronique), bpifrance-creation.fr (TVA, facturation
  électronique). Les points reposant uniquement sur ces tentatives échouées sont marqués ⚠ ci-dessus.
