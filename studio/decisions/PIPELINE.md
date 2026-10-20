# La chaîne complète, de la démo à la facture payée

Version du 20 octobre 2026. Modèle : `PROCESS-HEBERGEMENT.md` (aucun abonnement, site vendu,
modifications au forfait). Détail technique : `docs/PROCESS.md`. Prix : [prix à fixer].
Un changement ici = une ligne datée en bas.

## 1. Les étapes

| # | Étape | Ce qu'on fait | Colonne du tableau |
|---|---|---|---|
| 1 | Prospection | On repère l'artisan, on fait une **démo privée** de son site (`legal.prospect: true` : noindex, montrée à lui seul, supprimée s'il dit non). Message court (`studio/commercial/COMMERCIAL.md` § 3). | Prospect → Démo |
| 2 | Devis | Appel de 15 min, puis devis + CGV + formulaire de rétractation si ≤ 5 salariés démarché (`studio/juridique/modeles/`). « Bon pour accord » par e-mail. | Devis |
| 3 | Acompte | Facture d'acompte ([30] %). **Pas d'encaissement avant J+7** si le client est démarché et a ≤ 5 salariés (C. consom. L221-10). Rien ne se produit avant l'acompte reçu. | Acompte |
| 4 | Production | Brief, photos, `/site-final`, 72 h ouvrées après réception complète des éléments. | Production |
| 5 | Validation | Le client valide sur l'aperçu privé ; deux semaines de corrections incluses. PV de livraison. | Validation |
| 6 | Solde | Facture de solde. **Mise en ligne seulement quand le solde est payé.** | Validation |
| 7 | Mise en ligne | Domaine 10 ans acheté chez OVH au nom du client, `ff deploy`, `ff domaine`, `ff sante` à J+1, clic du client sur le lien de vérification du formulaire. | En ligne |
| 8 | Google | `ff kit` : fiche Google Business Profile prête à recopier, QR, carte de visite. Search Console, IndexNow (automatique). Demande d'avis à J+30. | En ligne |
| 9 | Après | Modifications à la demande : devis court au forfait, facture à la mise en ligne. Aucun abonnement. | En ligne |

## 2. Factures

- Numérotation continue `FF-AAAA-NNN`, modèle `studio/juridique/modeles/facture-modele.md`. Une
  facture d'acompte, une facture de solde, une facture par modification. Jamais de facture récurrente.
- **Facturation électronique** (vérifié le 20 oct 2026) :
  - **Réception** : obligatoire pour toutes les entreprises **depuis le 1er septembre 2026**.
  - **Émission** : **1er septembre 2027** pour les PME et micro-entreprises (grandes entreprises et
    ETI : depuis le 1er sept. 2026). Les micro-entreprises en franchise de TVA sont concernées aussi.
  - **Outil** : passer par une **plateforme agréée** (PA, ancien nom « PDP »), choisie dès la création
    de la SAS puisque la réception est déjà due. Liste officielle :
    https://www.impots.gouv.fr/je-consulte-la-liste-des-plateformes-agreees (modifiée le 13/10/2026).
  - Sources : https://entreprendre.service-public.gouv.fr/actualites/A18953 (2 sept 2026) ·
    https://www.impots.gouv.fr/professionnel/je-passe-la-facturation-electronique · fiche 1 DGFiP
    « Que va-t-il se passer pour mon entreprise ».

## 3. Relances et impayés

Mentions sur chaque facture : pénalités au taux BCE + 10 points, indemnité forfaitaire de **40 €**
(C. com. L441-10, D441-5). Un site en ligne n'est **jamais** coupé pour un impayé (CGV § 5) ; on
suspend seulement les travaux en cours.

| Quand (après l'échéance) | Quoi | Comment |
|---|---|---|
| J+7 | Rappel courtois, facture jointe | automatique (outil de facturation) |
| J+15 | Deuxième rappel, mention des pénalités et des 40 € | automatique |
| J+30 | Appel téléphonique du président | à la main ; travaux en cours suspendus après 8 jours de préavis |
| J+45 | **Mise en demeure** par lettre recommandée avec AR | modèle à écrire ; coût La Poste à relever |
| ensuite | **Injonction de payer** | voir ci-dessous |

**Injonction de payer** (entreprendre.service-public.gouv.fr, fiche F38156, vérifiée le 1er sept 2026,
lue le 20 oct 2026) :

- Client **artisan non commerçant** : **tribunal judiciaire**, **aucun frais de greffe**, requête papier
  (Cerfa n° 12948).
- Client **commerçant** : tribunal de commerce (tribunal des activités économiques), **33,47 € de frais
  de greffe**, requête **en ligne** par le Tribunal digital.
- Dans les deux cas, l'ordonnance est signifiée par un commissaire de justice, aux frais du créancier
  (récupérables sur le débiteur si le juge l'accorde) : émolument fixe de **25,79 € HT**, plus
  déplacement et TVA (https://www.weblex.fr/chiffres-cles/tarifs-des-commissaires-de-justice-informations-des-parties-et-des-tiers-2026,
  source secondaire). Délai pour signifier : 3 mois pour les ordonnances rendues depuis le
  1er sept 2026 (décret n° 2026-96, source secondaire : à confirmer).

## 4. Suivi des clients

- **Un tableau GitHub Projects** sur le dépôt `ff-atelier`, une carte par client (titre = slug).
- Colonnes : **Prospect, Démo, Devis, Acompte, Production, Validation, En ligne**.
- Sur chaque carte : date du devis, montant [prix à fixer], date d'acompte, date de solde, domaine et
  sa date d'expiration (+10 ans), date de la demande d'avis. Pas de donnée sensible (ni IBAN ni mot de
  passe).
- La prospection en masse reste dans `scrapping_artisans` ; une carte n'est créée qu'au premier
  « oui » (colonne Démo).

## 5. Budget et dépenses (tenus par le fondateur)

- **Où** : la banque pro de la SAS est la seule source. Toute dépense passe par sa carte ; le
  justificatif est photographié dans l'appli le jour même.
- **Comment** : le 1er de chaque mois, une ligne dans une feuille « Budget F&F » (Drive F&F, un seul
  onglet) : mois, encaissé, dépensé par poste, solde. Dix minutes.
- **Postes fixes** : banque pro ([≈ 10 €/mois], § 6), comptable [à chiffrer], RC pro [à chiffrer],
  outils IA [à chiffrer], domaines (≈ 100 € TTC par site, compris dans le prix du site), Cloudflare
  0 € (5 $/mois au-delà d'environ 190 sites).
- **Règle** : aucun abonnement nouveau sans une ligne dans `decisions/` (date, coût, pourquoi).

## 6. Banque et facturation : comparaison (relevé le 20 oct 2026)

Les quatre figurent sur la liste officielle des plateformes agréées (impots.gouv.fr, modifiée le
13/10/2026). Prix HT par mois.

| Outil | Prix d'entrée | Banque incluse | Relances automatiques | Source |
|---|---|---|---|---|
| Qonto | Solo Basic 9 € (annuel) ; une SAS à plusieurs relève peut-être d'Essential 49 € [à vérifier] | oui | option « Facturation automatisée » +12 €/mois | https://qonto.com/fr/pricing |
| Shine | Start 9 € (Free 0 €) | oui | listées au comparatif, offre d'entrée non confirmée [à vérifier] | https://www.shine.fr/tarifs/ |
| Pennylane | Starter 7 € ; Essentiel 24 € | compte pro | oui, dès Essentiel (« scénarios de relances automatisées ») | https://www.pennylane.com/fr/tarifs |
| Tiime | Free 0 € (factures illimitées) ; Initial 9,99 € avec compte pro | dès Initial | relance en un clic dès Initial ; automatique non confirmée | https://www.tiime.fr/tarifs |

**Recommandation** : **Shine Start (9 € HT/mois)** : banque, factures et facturation électronique au
même endroit, pour le prix d'une offre d'entrée. Seul point à vérifier à l'ouverture : les relances
automatiques J+7 et J+15 dans Start. Si elles n'y sont pas : **Pennylane Essentiel (24 € HT/mois)**,
le seul des quatre où elles sont confirmées sur la page de prix.

## 7. Qui fait quoi

| Qui | Quoi |
|---|---|
| **Fondateur** | Automatisation (atelier, `ff`, déploiements, tableau GitHub Projects), comptes Cloudflare et OVH, achat des domaines, budget et dépenses. |
| **Cousin, président de la SAS** | Crée la SAS, signe devis et CGV, émet les factures, appelle à J+30, signe la mise en demeure et l'injonction de payer. **[à confirmer : SAS à créer]** |
| Les deux | Prospection, démos, appel client. |

## Journal des changements

- 20 oct 2026 : première version. Calendrier de facturation électronique, coûts de l'injonction de
  payer et prix des quatre outils vérifiés en ligne le même jour (sources ci-dessus).
