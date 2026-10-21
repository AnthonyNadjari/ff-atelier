# Hébergement, code et domaine : le process, noir sur blanc

Version du 20 octobre 2026. Modèle **validé par le fondateur le 20 oct 2026**. Il remplace la version
du 17 oct (domaine payé par le client chaque année, contrat de suivi mensuel). La recherche d'origine
reste dans `hebergement-livraison.md` (10 oct) ; quand elle contredit ce fichier, ce fichier gagne.
La chaîne commerciale complète (devis, factures, relances) est dans `PIPELINE.md`.
Un changement ici = une ligne datée en bas.

## 0. Le modèle en six lignes

1. **Aucun abonnement.** Ni pour F&F, ni pour le client. Pas de contrat d'entretien mensuel, pas de
   facture récurrente.
2. **Le site est vendu**, une fois : [prix à fixer]. Il appartient au client au paiement complet.
3. **Les modifications après livraison se paient à la demande, au forfait** (devis court, accepté par
   e-mail).
4. **Hébergement gratuit et accessoire**, sur le compte Cloudflare de F&F. 0 € par site.
5. **Domaine au nom du client, payé d'avance pour 10 ans**, acheté par F&F chez OVH, coût inclus dans
   le prix du site.
6. **Si F&F s'arrête** : préavis de 3 mois, chaque client reçoit son site complet et le code de
   transfert de son domaine. Ensuite, plus aucune obligation ni frais, d'un côté comme de l'autre.

## 1. Où vit le code

- **Un seul dépôt privé GitHub, `ff-atelier`, une seule branche `main`.** Un client = un dossier
  `sites/<slug>/` (brief, contrat de direction, `site.config.ts`, sections sur mesure, photos traitées).
- **Pas de branche par client.** Une branche par client, c'est autant de copies de `src/` qui divergent :
  chaque correction du gabarit devient une fusion à refaire 50 fois, et on ne sait plus quelle version
  tourne où. Un dossier par client sur `main` donne un seul état, lisible, testé par `npm test`.
- **Sauvegarde** : le dépôt GitHub sauvegarde le code. Les photos brutes (`raw/`) et les builds sont
  dans `.gitignore` : `ff archiver <slug>` (zip local) à la livraison, zip rangé dans le Drive F&F
  (`Clients/<slug>/`).
- **Le client peut reprendre son site à tout moment** : `ff exporter <slug>` produit un dépôt autonome
  avec README, et le zip de `dist/<slug>` s'héberge n'importe où. C'est la clause de remise des CGV.
- **Secrets** : jamais dans le dépôt (`.env` local, secrets GitHub Actions, variables Cloudflare).
  Jamais de mot de passe client stocké, nulle part.

## 2. Où tourne le site

- **Compte Cloudflare de F&F, plan gratuit.** Usage commercial autorisé, requêtes vers les fichiers
  statiques « free and unlimited », HTTPS automatique. **0 € par site.** **[à confirmer : compte à créer
  par le fondateur]**
- **Workers static assets d'abord (22 oct 2026), Pages en réserve.** `ff deploy` déploie un site neuf en
  Worker à fichiers statiques : le formulaire et son binding e-mail sont déclarés dans la config, aucun
  clic dans le dashboard par site (en Pages, le binding e-mail se clique à la main : impossible à tenir à
  200 sites). Un site déjà en Pages y reste (`ff deploy --pages`). Limites vérifiées le 20 oct 2026 :
  - Cloudflare Pages : **100 projets par compte**, limite « not routinely increased » (Cloudflare ne la
    relève pas en routine). 500 builds par mois en gratuit (nos builds se font hors Cloudflare).
  - Workers static assets : **100 Workers par compte en gratuit, 500 en Workers Paid**. Au-delà, ou
    pour relever une limite, Cloudflare propose un formulaire de demande de hausse (gratuit, sans
    garantie de réponse positive).
  - Workers Paid : **5 $ par mois minimum, pour tout le compte** (pas par site).
  - Donc : Workers jusqu'à 100 sites gratuits, puis Workers Paid à 5 $/mois (tout le compte) jusqu'à
    500 ; Pages (100 projets) reste une réserve. `ff deploy` fait les deux (`docs/DEPLOIEMENT.md` § 2.1).
  - Sources : https://developers.cloudflare.com/pages/platform/limits/ ·
    https://developers.cloudflare.com/workers/platform/limits/ ·
    https://developers.cloudflare.com/workers/platform/pricing/ (consultées le 20 oct 2026).
- **L'hébergement est un service gratuit et accessoire.** F&F peut l'arrêter avec un **préavis de
  3 mois**, en remettant au client son site complet (`ff exporter` + zip de `dist/<slug>`). Ce n'est
  pas un service vendu : aucun taux de disponibilité promis.
- **Pas Vercel Hobby** pour un site qui rapporte de l'argent (interdit par leurs CGU). Vercel reste
  l'aperçu des démos et du formulaire brief. Le site du studio migre sur Cloudflare dès que le compte
  existe.
- **Mise en ligne** : seulement **après paiement du solde**. `ff deploy <slug>`, puis
  `ff domaine <slug> <domaine>` (DNS, HTTPS, redirection www, routage de l'e-mail du formulaire), puis
  `ff sante <slug>` à J+1. Le slug entre dans `sites-en-ligne.json` (contrôle automatique du lundi).
- **Gabarit** : une variante livrée ne change plus visuellement (une amélioration visible = nouvelle
  variante). Un site livré n'est redéployé que pour une modification payée ou une correction de
  sécurité.

## 3. Le formulaire de contact

- **Worker Cloudflare + Email Routing** (`form.provider: 'cloudflare'`, `src/worker/contact.js`).
  Gratuit. Le message est relayé par e-mail vers l'adresse du client, **rien n'est stocké chez F&F**.
- **Une action du client, une fois** : il clique sur le lien de vérification que Cloudflare envoie à
  son adresse (adresse de destination à vérifier). Sans ce clic, le formulaire n'envoie rien : on le
  teste à J+1.
- **Limite à surveiller** : **200 adresses de destination par compte** Cloudflare, toutes zones
  confondues (et 200 règles par domaine). Vers 180 clients : formulaire de hausse ou second compte.
  Source : https://developers.cloudflare.com/email-routing/limits/ (consultée le 20 oct 2026).
- **Pas de repli payant** : le repli Resend du Worker n'est pas activé sur les sites clients (coût et
  stockage chez un tiers). Pas de Web3Forms sur un site livré.
- **RGPD, ce qui reste** (transit seul, aucun stockage) :
  - Transmettre un message, c'est un traitement (RGPD art. 4.2 : « la communication par
    transmission »). F&F reste donc **sous-traitant** du client pour ce relais, même sans stockage.
  - Il faut une **clause écrite de sous-traitance** (art. 28), courte : elle est en annexe des CGV
    (annexe 2 de `studio/juridique/cgv-projet.md`, une demi-page).
  - Sécurité raisonnable (HTTPS, double authentification sur le compte Cloudflare, anti-spam),
    alerte du client en cas d'incident, Cloudflare déclaré comme sous-traitant ultérieur.
  - Une ligne par client dans le **registre** des traitements faits pour le compte des clients
    (art. 30.2) : `studio/juridique/registre-traitements.md`, § 2.
  - Le client reste responsable du traitement : sa page `/confidentialite` le dit (déjà générée).
  - Sources : RGPD art. 4, 28, 30 (https://eur-lex.europa.eu/eli/reg/2016/679/oj) ·
    https://www.cnil.fr/fr/definition/sous-traitant.

## 4. Le nom de domaine

**Règle : le client est titulaire. F&F l'achète pour lui chez OVH, à son nom, payé d'avance 10 ans,
coût inclus dans le prix du site.** Aucun appel avec le client pour le domaine, aucune facture annuelle.

- **Pourquoi OVH** : Cloudflare Registrar ne vend pas de .fr (absent de sa liste, vérifiée le
  20 oct 2026 : https://www.cloudflare.com/tld-policies/). **[à confirmer : compte OVH F&F à créer]**
- **Durée** : un .fr s'enregistre **de 1 à 10 ans** ; 10 ans est le maximum (Afnic : la date
  d'expiration ne peut pas dépasser 10 ans après la commande). Sources : Afnic, Guide des procédures,
  https://www.afnic.fr/wp-media/uploads/2022/10/Guide-des-procedures-Afnic-VF.pdf · Guide pratique du
  titulaire 2024, https://www.afnic.fr/wp-media/uploads/2024/07/Afnic-Guide-pratique-du-Titulaire.pdf ·
  page OVH .fr (« Durée de réservation : entre 1 et 10 ans »).
- **Prix OVH relevé le 20 oct 2026** (https://www.ovhcloud.com/fr/domains/tld/fr/) : création
  4,99 € HT (5,99 € TTC), renouvellement 7,79 € HT/an (9,35 € TTC).
  **Estimation 10 ans : 4,99 + 9 × 7,79 = 75,10 € HT, soit environ 90 € TTC.** Le prix exact d'une
  création sur 10 ans s'affiche au panier : à relever à la première commande. On compte 100 € TTC
  par site dans le prix, marge de sécurité comprise.
- **Comment on l'achète** :
  1. Le brief (ff-brief) demande « Vous avez déjà un nom de domaine ? » : oui + lequel et chez qui /
     non + deux ou trois noms souhaités (formulaire ff-brief, question « Votre adresse de site », depuis le 22 oct 2026).
  2. Après paiement du solde, F&F commande le .fr sur **son** compte OVH, **titulaire = le client**
     (raison sociale, SIREN, adresse, e-mail du client), durée 10 ans, **renouvellement automatique
     désactivé** (sinon la carte de F&F paierait dans 10 ans).
  3. Zone DNS chez Cloudflare (serveurs de noms OVH → Cloudflare), par `ff domaine`.
  4. Un domaine qui existe déjà (ancien site) reste où il est, au client. On lui demande seulement de
     changer les serveurs de noms, ou on passe par un CNAME `www`. On recopie MX, SPF et DKIM **avant**
     toute bascule, sinon ses e-mails s'arrêtent. E-mail test reçu à J+1.
- **Au bout de 10 ans** : le domaine expire si personne ne le prolonge. C'est écrit au devis et dans la
  page « après la livraison ». Si F&F existe encore, il peut le prolonger au forfait ; sinon, le client
  a reçu son code de transfert et le prolonge où il veut.
- **E-mail pro** : hors périmètre. On conseille (Zimbra OVH offert avec un domaine neuf, redirection
  Cloudflare gratuite, Google Workspace s'il y tient). Le client souscrit à son nom.
- **Remise du domaine** (à la demande ou à l'arrêt) : F&F demande le **code de transfert** (authinfo) à
  OVH, gratuit, et le remet au client. Il transfère le domaine chez le registrar de son choix ; il en
  était déjà titulaire, rien d'autre ne change.

## 5. Ce qui n'est jamais dans un site F&F

- Rien qui coûte chaque mois à F&F, rien qui stocke des données chez F&F.
- Pas de boîte mail, pas de paiement en ligne, pas d'agenda hébergés par F&F.
- Les outils payants restent **sur les comptes du client** et le site fait un lien : paiement (Stripe,
  SumUp…), prise de rendez-vous (Planity, Calendly…), avis Google.
- **Avis Google** : recopiés à la main (vrais, avec nom et date tels qu'affichés) + lien vers la fiche.
  **Jamais l'API Places** (clé à maintenir, facturation à l'usage sur un compte Google Cloud, script
  tiers sur le site).

## 6. Ce que le client reçoit à la livraison

- Le lien du site sur son domaine, sa fiche Google (`ff kit`), le QR et les PDF.
- Un zip de `dist/<slug>` et, sur demande, le dépôt `ff exporter`.
- La date d'expiration de son domaine (dans 10 ans) et le rappel : le code de transfert lui est remis
  sur simple demande.
- La page « après la livraison » (`studio/commercial/apres-livraison.html`).

## 7. Si F&F arrête l'activité

1. E-mail à chaque client, **3 mois avant** la coupure.
2. Envoi d'office à chacun : zip de `dist/<slug>`, dépôt `ff exporter`, export de sa zone DNS, fiche
   `studio/commercial/REPRENDRE-SON-SITE.md` (héberger son site gratuitement en dix minutes), **code de
   transfert du domaine**.
3. Les sites restent en ligne pendant les 3 mois. Après la date annoncée, le compte Cloudflare est
   fermé. Plus aucune obligation ni frais pour personne.
4. Les frais fixes de la SAS (banque pro, comptable, RC pro) s'arrêtent avec la dissolution.

**Dissolution amiable d'une SAS, en bref** (entreprendre.service-public.gouv.fr, fiche F23744 ;
annonces légales, fiche F31972, consultées le 20 oct 2026) :

- Les associés votent la dissolution (à l'unanimité en SAS, sauf statuts contraires) et nomment un
  liquidateur (le président peut l'être).
- Annonce légale de dissolution : **153 € HT** (forfait 2026, métropole). Déclaration sur le guichet
  unique de l'INPI dans le mois : frais de greffe **environ 175-190 €** (source secondaire).
- Le liquidateur solde les comptes (clients, fournisseurs, impôts, TVA dans les 30 jours), puis
  clôture : annonce légale **111 € HT**, demande de radiation dans le mois (quelques euros de greffe).
- **Total des frais obligatoires : environ 450 à 600 €**, hors honoraires du comptable
  (https://www.swim.legal/blog/cout-dissolution-sas, https://legalstart.fr/fiches-pratiques/dissolution-liquidation/fermeture-sas-cout/,
  sources secondaires). Comptable pour les comptes de liquidation : quelques centaines d'euros de plus.

## 8. Qui fait quoi

| Étape | Qui | Outil |
|---|---|---|
| Compte Cloudflare F&F, jeton API dans les secrets GitHub | fondateur (une fois) | dashboard Cloudflare, `docs/DEPLOIEMENT.md` § 1 |
| Compte OVH F&F (moyen de paiement, double authentification) | fondateur (une fois) | ovhcloud.com |
| Achat du domaine 10 ans au nom du client | fondateur | OVH |
| Déploiement, DNS, santé | Claude Code ou le fondateur | `ff deploy`, `ff domaine`, `ff sante` |
| Clic de vérification de l'adresse du formulaire | le client (une fois) | e-mail de Cloudflare |
| Statut du site, date d'expiration du domaine | fondateur | tableau GitHub Projects (`PIPELINE.md`) |
| SAS, signature des CGV, factures | cousin, président de la SAS | **[à confirmer : SAS à créer par le cousin]** |

## Points encore ouverts

- **[à confirmer]** Compte Cloudflare F&F : à créer par le fondateur.
- **[à confirmer]** Compte OVH F&F : à créer par le fondateur ; relever le prix exact d'un .fr 10 ans
  au panier.
- **[à confirmer]** SAS : à créer par le cousin (président). Tant qu'elle n'existe pas : pas de devis,
  pas de facture, pas de domaine acheté.

## Journal des changements

- 17 oct 2026 : première version, trois points à confirmer (compte Cloudflare, qui achète le domaine,
  dépôt commun).
- 22 oct 2026 : `ff deploy` en mode Workers static assets par défaut (config wrangler écrite par la commande,
  binding e-mail déclaré, domaine attaché par l'API) ; Pages gardé sur `--pages`. Décision prise de nuit
  en carte blanche, réversible par le drapeau.
- 20 oct 2026 : modèle validé par le fondateur. Aucun abonnement ; modifications au forfait ;
  hébergement gratuit accessoire résiliable à 3 mois ; domaine au nom du client acheté par F&F chez
  OVH, payé 10 ans, inclus dans le prix ; formulaire Worker sans stockage ; un dépôt, une branche,
  un dossier par client. Tranchés : qui achète le domaine (F&F, au nom du client), dépôt commun (oui).
  Restent ouverts : compte Cloudflare, compte OVH, SAS. Limites Cloudflare, prix OVH et durée Afnic
  vérifiés en ligne le même jour.
