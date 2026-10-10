# Hébergement, domaines, livraison et modèle commercial — Finck & Fisch

Recherche du 10 octobre 2026. Chaque prix et chaque limite renvoie à une source (en fin de section).
Quand la page officielle n'a pas pu être lue (pages rendues en JavaScript : OVHcloud, Infomaniak,
Wix), le chiffre vient d'une source secondaire, et c'est indiqué **(source secondaire)**. Ces
chiffres sont à revérifier avant de les donner à un client.

---

## 0. Recommandation

### 0.1 Ce qu'on fait

**Hébergement : Cloudflare (gratuit, usage commercial autorisé), pas Vercel Hobby.**

- Les CGU de Vercel Hobby **interdisent l'usage commercial**, et elles visent explicitement notre
  cas : « Receiving payment to create, update, or host the site ». Héberger des sites clients sur un
  compte Hobby personnel est une infraction aux conditions. Le compte peut être suspendu, et tous les
  sites tomberaient d'un coup. Le site F&F lui-même (`dist/finck-fisch/vercel.json`) est dans ce cas.
  C'est la première chose à corriger.
- Le dépôt est **déjà construit pour Cloudflare Pages** : `ff deploy` (wrangler), `ff domaine` (API
  Cloudflare, Email Routing), `.github/workflows/deploy.yml`, formulaire `provider: 'cloudflare'`
  (Worker + Email Routing), `_headers`, Turnstile, Web Analytics. Vercel n'est utilisé qu'à la main
  pour le site F&F. Revenir sur Cloudflare ne demande aucun développement.
- Cloudflare ne restreint pas l'usage commercial sur son offre gratuite. Les requêtes vers les
  fichiers statiques sont « free and unlimited ». Il n'y a ni plafond de bande passante ni coût par
  site.

**Domaine : acheté par le client, à son nom, chez OVHcloud. Serveurs de noms délégués à
Cloudflare.**

- Cloudflare Registrar ne vend pas de .fr. OVH le fait, pour environ 7,79 € HT/an au
  renouvellement **(source secondaire)**, avec une boîte Zimbra Starter offerte et hébergée en
  France. Le client paie OVH directement : F&F ne porte aucun coût récurrent pour lui.
- Pour publier un domaine nu (`plomberie-dubois.fr`) sur Pages ou Workers, il faut une zone
  Cloudflare, donc changer les serveurs de noms. Un simple CNAME ne suffit que pour `www.`. C'est
  la contrainte principale du choix Cloudflare (voir § 2.3).

**Code : on garde le monorepo usine.** On y ajoute trois règles : variantes immuables, CI qui
construit tous les sites et ne redéploie que ceux qui ont changé, et sites « figés » sortis de la
boucle de déploiement (§ 3).

**Prix : paiement unique plus un suivi optionnel sans engagement.** On ne fait pas de location sans
frais d'entrée.

| Formule | Prix | Contenu |
|---|---|---|
| **Essentiel** | **1 190 € HT** | Site une page longue (5-7 sections), textes rédigés, photos traitées, formulaire, mentions légales, mise en ligne sur le domaine du client, 2 semaines de corrections, kit Google (fiche, QR, carte de visite). |
| **Complet** | **1 790 € HT** | Essentiel, plus pages par service ou par ville (SEO local), page réalisations, migration de l'ancien site (redirections). |
| **Suivi** (optionnel) | **29 € HT/mois** sans engagement au-delà de 3 mois, ou **290 € HT/an** | Surveillance quotidienne, mises à jour, 30 min de modifications par mois (non cumulables), rapport de visites mensuel, rappel de renouvellement du domaine, sauvegarde. |
| Hors forfait | 45 € HT par demi-heure | Modifications au-delà du quota, nouvelle page : 150 € HT. |

Paiement : 40 % à la commande, 60 % à la mise en ligne, ou 3 fois sans frais **en direct**, sans
organisme de financement. Le discours actuel « sans abonnement, le site est à vous » (COMMERCIAL.md)
reste vrai, puisque le suivi est optionnel et résiliable. Les montants restent dans la fourchette de
JURIDIQUE.md § 0 (1 200-1 800 €) et alignent le suivi sur les 25 €/mois déjà prévus.

### 0.2 Tableau comparatif des hébergeurs

| Hébergeur | Usage commercial gratuit ? | Payant | Limites clés | Domaine nu chez OVH sans changer les NS ? | Siège / données | Verdict |
|---|---|---|---|---|---|---|
| **Cloudflare Pages** | **Oui**, aucune clause contraire | Pas nécessaire | 100 projets par compte, 500 builds Git/mois, 20 000 fichiers/site, 25 MiB/fichier, 100 domaines/projet | **Non** : le domaine nu exige une zone Cloudflare. `www` est possible par CNAME | États-Unis, CDN mondial | **Recommandé** (outillage déjà en place) |
| **Cloudflare Workers** (static assets) | Oui, fichiers statiques « free and unlimited » | Workers Paid **5 $/mois** (500 Workers) | Free : 100 Workers/compte, 100 000 requêtes de code par jour (les fichiers statiques ne comptent pas) | Non (zone requise) | États-Unis | Cible au-delà d'environ 80 sites |
| **Vercel Hobby** | **Non** : « non-commercial personal use only » | — | 200 projets, 50 domaines/projet, 100 Go | Oui (A `76.76.21.21`) | États-Unis | **Interdit pour F&F** |
| **Vercel Pro** | Oui | **20 $/mois** par siège développeur, 20 $ de crédit inclus | 1 To, 10 M requêtes CDN, projets illimités | **Oui** (A record) | États-Unis | Plan B si la délégation des NS bloque les ventes |
| **Netlify** | Free : 300 crédits/mois **pour toute l'équipe** | Personal **9 $** (1 000 crédits), Pro **20 $** (3 000) | Mise en prod = 15 crédits, 1 Go = 20 crédits. En Free : 20 mises en prod/mois pour **tous** les sites | Oui (A `75.2.60.5`) | États-Unis | Non : les crédits sont partagés entre tous les clients |
| **GitHub Pages** | **Non** pour un site qui sert une activité commerciale | — | 1 Go/site, 100 Go/mois (plafond indicatif), 10 builds/h | Oui | États-Unis | Non |
| **o2switch** | Oui | **1,86 € HT/mois** la 1re année, puis **16 € HT/mois**, engagement 12 mois **(source secondaire)** | Sites illimités, mutualisé cPanel | Oui (A record) | France (Clermont-Ferrand) | Option « souveraineté » refacturée |
| **OVHcloud** mutualisé | Oui | Perso 5,99 € HT/mois, Pro 9,99 € HT/mois au renouvellement **(source secondaire)** | Hausse au 1er juin 2026 | Oui | France | Option souveraineté |
| **Infomaniak** | Oui | Environ 5,75 €/mois, 20 sites **(source secondaire)** | — | Oui | Suisse | Option souveraineté |
| **Scaleway** Object Storage | Oui | 0,0105 €/Go/mois, 75 Go de trafic sortant gratuits **(source secondaire)** | HTTPS sur domaine perso via Edge Services, payant (prix non vérifié) | — | France | Non (trop de bricolage) |

### 0.3 Coûts mensuels fixes de F&F (architecture recommandée)

Ces coûts ne comprennent pas les abonnements IA conversationnels (Claude Code), qui sont un outil
de travail et pas un coût par client. Les domaines et les e-mails des clients sont payés par les
clients.

| Poste | 5 clients | 30 clients | 100 clients |
|---|---|---|---|
| Hébergement Cloudflare | 0 € | 0 € | 0 € avec un compte par client, ou **5 $** (Workers Paid, 500 scripts) |
| GitHub (dépôt privé, 2 000 min d'Actions/mois) | 0 € | 0 € | 0 à 15 $ (dépassement à 0,006 $/min si on reconstruit tout souvent) |
| Formulaires (Worker + Email Routing) | 0 € | 0 € | 0 € (limite : 200 adresses de destination par compte) |
| Statistiques (Cloudflare Web Analytics) | 0 € | 0 € | 0 € |
| Surveillance (cron GitHub Actions `ff sante`) | 0 € | 0 € | 0 € |
| API Anthropic, génération (Sonnet 5 à 2 $/10 $ par MTok) | environ 1 à 5 $ | environ 5 à 15 $ | environ 10 à 30 $ (dépend des **nouveaux** sites du mois, pas du stock) |
| Facturation électronique (plateforme agréée, offre gratuite) | 0 € | 0 € | 0 à 15 € |
| Domaine et e-mail de F&F (2 Google Workspace Starter, facultatif) | environ 15 € | environ 15 € | environ 15 € |
| **Total** | **environ 15-20 €/mois** | **environ 20-35 €/mois** | **environ 30-80 €/mois** |

Pour comparer :

- **Vercel** : 20 $ par mois et par siège dès le premier client, soit 40 $ si les deux associés
  déploient.
- **o2switch** : 16 € HT/mois après la première année.

Le revenu récurrent visé couvre largement ces coûts : à 30 clients dont 60 % en Suivi, on encaisse
522 € HT/mois. À 100 clients, 1 740 € HT/mois.

---

## 1. Hébergement

### 1.1 Vercel

- **Hobby** : « Hobby teams are restricted to non-commercial personal use only. All commercial usage
  of the platform requires either a Pro or Enterprise plan. » L'usage commercial y est défini comme
  tout déploiement qui rapporte de l'argent à **quiconque** a participé à la production du site,
  par exemple « Receiving payment to create, update, or host the site » ou « Advertising the sale of
  a product or service ». Un site d'artisan fait par un studio payé coche **deux** cases.
- **Pro** : 20 $/mois avec 20 $ de crédit inclus, puis 20 $/mois par siège développeur
  supplémentaire. Inclus : 1 To de Fast Data Transfer et 10 M de requêtes CDN par mois. Projets
  illimités, domaines par projet illimités (plafond indicatif de 100 000).
- **Avantage réel** : un domaine nu se branche par un simple **A record `76.76.21.21`** chez OVH.
  On ne délègue pas les serveurs de noms, et les MX du client ne bougent pas. C'est plus simple que
  Cloudflare pour un client qui garde tout chez OVH.
- **Limites Hobby** (pour mémoire) : 200 projets, 50 domaines par projet, 100 Go de transfert.

### 1.2 Cloudflare Pages et Workers

- **Usage commercial** : aucune clause ne l'interdit dans les conditions Cloudflare. La seule
  restriction de contenu concerne le CDN gratuit, que Cloudflare se réserve de limiter s'il sert
  « video or a disproportionate percentage of pictures, audio files, or other large files ».
  ⚠ Les démos F&F contiennent des vidéos (`ff video`). Il faut les garder courtes et légères ; une
  vidéo lourde se met plutôt chez un hébergeur vidéo. Le texte ne dit pas clairement si cette clause
  vise Pages et Workers static assets.
- **Limites Pages** : 100 projets par compte (« not routinely increased »), 500 builds par mois et
  1 build à la fois en Free, 20 000 fichiers par site, 25 MiB par fichier, 100 domaines par projet,
  prévisualisations illimitées. Nos builds se font dans GitHub Actions puis sont envoyés par
  `wrangler pages deploy` : le quota de 500 builds Git ne devrait pas s'appliquer, à confirmer.
- **Workers static assets** : « Requests to static assets are free and unlimited ». Limites :
  100 Workers par compte en Free, 500 en Paid (5 $/mois minimum), 20 000 fichiers par version en
  Free. Cloudflare présente Workers comme la plateforme la plus complète, et sa page de limites
  Pages renvoie vers Workers static assets ou Workers for Platforms au-delà de 100 projets.
  `_headers` et `_redirects` fonctionnent pareil. Le `_worker.js` du mode avancé doit être déplacé
  (champ `main` de la config wrangler).
- **Domaines** :
  - Pages : un domaine nu exige que le site soit une zone Cloudflare, donc que les serveurs de noms
    pointent vers Cloudflare. Un sous-domaine (`www.`) passe par un CNAME chez un DNS externe.
  - Workers Custom Domains : il faut une zone active dans le compte.
  - Cloudflare for SaaS (domaines clients sur notre zone) : 100 noms d'hôte gratuits, puis 0,10 $
    chacun. Mais le **domaine nu y est réservé à l'Enterprise**, donc inutile pour nous.
- **Nouveauté du 15 septembre 2026** : on peut créer des comptes Cloudflare Free supplémentaires
  par l'API, avec un jeton utilisateur. Cela rend possible **un compte gratuit par client**, avec
  F&F comme membre. Le plafond de 100 projets disparaît et la sortie devient très simple (on remet
  le compte au client). À tester avant 30 clients (§ 8).

### 1.3 Netlify

Depuis le passage aux crédits :

| Offre | Prix | Crédits/mois |
|---|---|---|
| Free | 0 $ | 300 |
| Personal | 9 $ | 1 000 (recharge optionnelle : 500 crédits pour 5 $) |
| Pro | 20 $ | 3 000 |

Une mise en production coûte 15 crédits, 1 Go de bande passante 20 crédits, 10 000 requêtes
2 crédits. Le Free a une « credit hard limit » sans recharge. Les crédits étant **partagés par tout
le compte**, 300 crédits font 20 mises en prod par mois pour l'ensemble des clients : inadapté à une
usine. Le domaine nu se branche par A `75.2.60.5`.

### 1.4 GitHub Pages

« GitHub Pages is not intended for or allowed to be used as a free web-hosting service to run your
online business, e-commerce site, or any other website that is primarily directed at either
facilitating commercial transactions or providing commercial software as a service (SaaS). » Un site
vitrine d'artisan est en zone grise, et un studio qui en héberge des dizaines contre paiement sort du
cadre. Autres limites : 1 Go par site, 100 Go/mois (plafond indicatif), 10 builds par heure. **À
écarter.**

### 1.5 Hébergeurs français, pour l'argument RGPD et souveraineté

- **o2switch** : offre unique (Cloud) à 1,86 € HT/mois la première année, soit 22,32 € HT pour
  12 mois, puis 16 € HT/mois. Engagement 12 mois, sites illimités, datacenters en propre à
  Clermont-Ferrand, satisfait ou remboursé 30 jours. Le tarif d'appel est sur la page officielle ;
  le renouvellement à 16 € vient d'une source secondaire.
- **OVHcloud** : gammes Eco (Starter, Perso) et Business (Pro, Performance). Les prix au
  renouvellement relevés sont 5,99 € HT/mois pour Perso et 9,99 € HT/mois pour Pro, avec une hausse
  au 1er juin 2026 **(sources secondaires, page officielle illisible)**.
- **Infomaniak** (Suisse) : environ 5,75 €/mois pour 20 sites, prix stable au renouvellement
  **(source secondaire)**.
- **Scaleway** : stockage objet à 0,0105 €/Go/mois, 75 Go de sortie gratuits **(source
  secondaire)**. Le HTTPS sur domaine personnalisé demande Edge Services (payant), donc trop
  d'assemblage pour le gain.

**Ce que vaut l'argument.** Un site statique sans cookies ni compte ne stocke pas de données
personnelles. Les seules données qui transitent sont celles du formulaire de contact, et les
journaux techniques. Le vrai sujet RGPD est donc le **formulaire** (§ 5.4), pas l'hébergeur des
pages. Pour un client qui l'exige (avocat, santé), on propose le site chez o2switch, Infomaniak ou
OVH à son nom et à ses frais, plus 150 € HT de mise en place. L'export statique (`dist/<slug>`) se
dépose tel quel en FTP/SFTP.

### 1.6 Recommandation par palier

| Palier | Hébergement | Pourquoi |
|---|---|---|
| **5 clients** | Un compte Cloudflare « F&F » (adresse partagée, double authentification, les deux associés membres). Pages, une zone par client. | 0 €, outillage existant, `ff domaine` automatise la mise en place. |
| **30 clients** | Même chose. Commencer les tests du « un compte Cloudflare par client » sur les nouveaux clients. | On reste loin des 100 projets. On prépare la sortie et la limite. |
| **100 clients** | Soit **un compte Cloudflare Free par client** (créé par l'API, F&F membre), soit Workers Paid à 5 $/mois (500 scripts) sur le compte F&F. | Plafond de 100 projets ou Workers par compte gratuit. Le compte par client est aussi la meilleure sortie. |
| Plan B à tout palier | Vercel Pro, 20 $/mois | Si les clients refusent de changer leurs serveurs de noms. |

Sources :
- https://vercel.com/docs/limits/fair-use-guidelines
- https://vercel.com/pricing
- https://vercel.com/docs/limits
- https://vercel.com/docs/domains/working-with-domains/add-a-domain
- https://developers.cloudflare.com/pages/platform/limits/
- https://developers.cloudflare.com/pages/configuration/custom-domains/
- https://developers.cloudflare.com/workers/static-assets/billing-and-limitations/
- https://developers.cloudflare.com/workers/platform/limits/
- https://developers.cloudflare.com/workers/platform/pricing/
- https://developers.cloudflare.com/workers/static-assets/migration-guides/migrate-from-pages/
- https://developers.cloudflare.com/workers/configuration/routing/custom-domains/
- https://developers.cloudflare.com/cloudflare-for-platforms/cloudflare-for-saas/plans/
- https://developers.cloudflare.com/changelog/post/2026-09-15-free-account-creation/
- https://www.cloudflare.com/service-specific-terms-application-services/
- https://www.netlify.com/pricing/
- https://docs.netlify.com/manage/accounts-and-billing/billing/billing-for-credit-based-plans/credit-based-pricing-plans/
- https://docs.netlify.com/manage/domains/configure-domains/configure-external-dns/
- https://docs.github.com/en/pages/getting-started-with-github-pages/github-pages-limits
- https://www.o2switch.fr/
- https://www.clubic.com/bons-plans-601537-o2switch-l-hebergeur-100-francais-n-1-en-2026-passe-sous-la-barre-des-2.html (secondaire)
- https://community.ovhcloud.com/t/augmentation-du-tarif-des-hebergements-mutualises-mai-2026/155 (secondaire)
- https://next.ink/brief-article/ovhcloud-a-mis-a-jour-ses-offres-dhebergement-web-retour-de-starter-ressources-cpu-et-ram-accrues/ (secondaire)
- https://infoswitch.fr/blog/tarifs-infomaniak-prix-services (secondaire)
- https://sliplane.io/blog/scaleway-object-storage-alternatives (secondaire)

---

## 2. Domaines

### 2.1 Le client est propriétaire : c'est non négociable

Si F&F achète le domaine à son nom, F&F en est **titulaire juridique**. Les conséquences :

- Le client ne peut pas partir sans notre accord, ce qui contredit tout le discours « le site vous
  appartient ».
- Si F&F cesse son activité ou oublie un renouvellement, le domaine expire. Il peut alors être
  racheté par un tiers, et le référencement local du client est perdu.
- F&F avance des frais chaque année, pour chaque client, indéfiniment.

Règle : **le client est titulaire et paie le registrar avec sa propre carte**. F&F l'accompagne en
partage d'écran pendant l'appel (10 min) ou lui envoie une fiche pas à pas. Si on achète « pour
démarrer », on le fait **au nom du client** comme titulaire, avec un transfert de compte prévu
d'emblée. C'est l'exception, pas la règle.

### 2.2 Prix 2026 des registrars

| Registrar | .fr création | .fr renouvellement | .com | Remarques |
|---|---|---|---|---|
| **OVHcloud** | 4,99 € HT | **7,79 € HT** | non relevé | 1 Zimbra Starter 15 Go **offert** avec un nouveau domaine (0,30 € HT/mois sinon). Hébergé en France. **(prix : source secondaire, juillet 2026)** |
| **Gandi** | 7,20 € | 25,90 € TTC (promo, 28,78 € normalement) | non relevé | Cher au renouvellement. |
| **IONOS** | 1 € HT (1,20 € TTC) | 11 € HT (13,20 € TTC) | non relevé | Boîte mail incluse. Renouvellement automatique. |
| **Cloudflare Registrar** | **.fr non pris en charge** | — | Pris en charge | .com vendu à prix coûtant (montant non relevé). |

**Recommandation : OVHcloud.** Société française, .fr bon marché au renouvellement, e-mail offert,
interface que beaucoup d'artisans connaissent déjà. Prévoir 15-20 € TTC/an pour le .fr, à la charge
du client, à dire dès le devis.

### 2.3 Brancher le domaine sur le site

| Méthode | Ce que fait le client chez OVH | Avantages | Inconvénients |
|---|---|---|---|
| **A. Délégation des serveurs de noms à Cloudflare** (recommandé, déjà automatisé par `ff domaine`) | Remplace les 2 serveurs DNS OVH par les 2 serveurs Cloudflare indiqués | Domaine nu et `www`, HTTPS automatique, Email Routing, Web Analytics illimité (site proxifié) | Les enregistrements MX et SPF du client doivent être recopiés dans Cloudflare, sinon ses e-mails OVH s'arrêtent. La zone vit dans **notre** compte Cloudflare. |
| **B. CNAME `www` seul** | Ajoute un CNAME `www` vers `<slug>.pages.dev` et une redirection du domaine nu vers `www` (outil de redirection OVH) | Rien ne change pour ses e-mails | La redirection du domaine nu en HTTPS chez OVH n'est pas garantie (non vérifié). Fragile. |
| **C. Vercel Pro** | A `76.76.21.21` + CNAME `www` | Simplicité maximale | 20 $/mois pour F&F |

Avec la méthode A, `ff domaine` doit **toujours** recréer les enregistrements MX, SPF et DKIM
d'OVH (ou de l'e-mail du client) avant la bascule. C'est le seul vrai risque de casse : il faut un
point bloquant dans la checklist.

### 2.4 Accès délégué

- **OVH** : le client crée son compte (identifiant NIC) et peut **ajouter un contact technique**
  (le compte F&F) sur son domaine. On gère le DNS sans connaître son mot de passe. Le titulaire
  reste le client.
- **Cloudflare** : avec un compte par client, F&F est membre et le client est Super Administrator.
  Avec le compte F&F unique, le client n'a pas d'accès et on lui remet la zone à la sortie.
- On ne demande **jamais** le mot de passe du client. On ne stocke pas ses identifiants.

### 2.5 Sortie

- **Changer de registrar** : le client demande le code d'autorisation (authinfo) à son registrar
  actuel. Le registrar **doit** le lui donner gratuitement et à tout moment (procédures Afnic). Le
  nouveau registrar lance le transfert avec ce code.
- **Changer de titulaire** (si F&F avait acheté à son nom) : opération de mise à jour du titulaire.
  L'Afnic recommande de faire d'abord le transfert de registrar, puis le changement de titulaire.
- **Avec la délégation Cloudflare** : pour sortir, le client remet les serveurs DNS d'OVH par défaut
  (2 clics) et pointe vers son nouvel hébergeur. Ou bien il crée son propre compte Cloudflare,
  ajoute la zone, et on supprime la nôtre.

### 2.6 E-mail pro du client : hors périmètre, mais à cadrer

On ne revend pas d'e-mail. On conseille, et le client souscrit à son nom :

| Offre | Prix | Pour qui |
|---|---|---|
| **OVH Zimbra Starter** | Offert avec un nouveau domaine, 0,30 € HT/mois ensuite, 15 Go, hébergé en France | Artisan seul : le meilleur rapport qualité-prix |
| **Cloudflare Email Routing** | Gratuit | Uniquement de la **redirection** (`contact@domaine` vers son Gmail). Pas d'envoi depuis l'adresse pro. 200 règles par domaine, 200 adresses de destination par **compte** |
| **Google Workspace Starter** | 6,80 €/utilisateur/mois (5,44 € avec la remise de 3 mois affichée) | Client déjà sur Gmail |
| **Microsoft 365 Business Basic** | 6,07 € HT/utilisateur/mois en annuel (7,28 € en mensuel) | Client sur Outlook |
| **Infomaniak Mail** | Environ 1,50 €/boîte/mois **(source secondaire)** | Client attaché à la souveraineté |

Sources :
- https://www.cloudflare.com/tld-policies/
- https://www.gandi.net/fr/domain/tld/fr
- https://www.ionos.fr/domaine/fr-domaine
- https://www.lafabriquedunet.fr/logiciels/tendances/quel-est-le-prix-dun-nom-de-domaine (secondaire, prix OVH et IONOS)
- https://www.afnic.fr/wp-media/uploads/2022/10/Guide-des-procedures-Afnic-VF.pdf
- https://www.afnic.fr/wp-media/uploads/2024/07/Afnic-Guide-pratique-du-Titulaire.pdf
- https://docs.ovhcloud.com/en/guides/web-cloud/email-and-collaborative-solutions/mx-plan/faq-zimbra
- https://community.ovhcloud.com/t/nom-de-domaine-et-zimbra-starter/281
- https://developers.cloudflare.com/email-routing/limits/
- https://workspace.google.com/intl/fr/pricing.html
- https://www.microsoft.com/fr-fr/microsoft-365/business/microsoft-365-business-basic

---

## 3. Organisation du code

### 3.1 Les options

| Option | Pour | Contre | Verdict |
|---|---|---|---|
| **Monorepo usine** (actuel : `sites/<slug>`, `src/` partagé) | Un seul gabarit, une CI, un Dependabot. L'IA voit tout le contexte. Une amélioration profite à tous. | Une modification de section peut changer **tous** les sites. Le dépôt grossit avec les photos. | **On le garde**, avec les garde-fous ci-dessous |
| Un dépôt par client | Isolation totale, remise triviale | Mettre à jour 100 dépôts, 100 Dependabot, 100 CI. Ingérable à 2. | Seulement **à la remise** (`ff exporter`) |
| Une branche par client | — | Fusions infernales, l'état d'un site n'est jamais clair | Non |

### 3.2 Mettre à jour le gabarit sans casser les sites livrés

1. **Variantes immuables.** Une variante livrée (`src/sections/<Type>/<variante>.astro`) n'est plus
   modifiée visuellement. Une amélioration visible devient une nouvelle variante (`hero-v2`). Les
   corrections invisibles (accessibilité, performance, sécurité) restent autorisées. À écrire dans
   CONVENTIONS.md.
2. **La CI construit tous les sites à chaque PR** qui touche `src/` et compare le HTML et les
   captures avec `main` (`scripts/ff/compare-images.mjs` existe déjà). Une PR qui change le rendu
   d'un site livré sans le déclarer est refusée.
3. **On ne déploie que ce qui a changé.** On calcule une empreinte (hash) de `dist/<slug>` et on ne
   redéploie que si elle a bougé. Aujourd'hui `deploy.yml` redéploie **tous** les sites à chaque
   push sur `main`, ce qui coûte des minutes et fait courir un risque inutile.
4. **Statut par site** dans `sites-en-ligne.json` (aujourd'hui un simple tableau de slugs, vide) :
   - `suivi` : client sous contrat, reçoit les mises à jour ;
   - `fige` : livré sans suivi. On ne le redéploie plus. Son dernier déploiement Cloudflare reste en
     ligne, puisqu'un site statique n'a pas besoin d'être reconstruit ;
   - `sorti` : remis au client.

   On y ajoute le domaine, le registrar, la date de renouvellement et la formule.
5. **Versions du gabarit** : un tag git `gabarit-AAAA.MM` à chaque lot de changements, noté dans un
   changelog court. On sait ainsi avec quelle version chaque site a été livré.

### 3.3 Le client récupère son site

- **Export statique** : un zip de `dist/<slug>`, qui s'héberge n'importe où (o2switch, OVH,
  Cloudflare, Netlify) par simple dépôt de fichiers. `ff archiver` fait déjà le zip.
- **Code source** : `ff exporter <slug>` crée déjà un dépôt autonome avec README et premier commit.
  On le pousse sur un dépôt GitHub au nom du client, ou on le remet en archive.
- Les deux vont dans le **kit de sortie** (§ 7).

### 3.4 Sauvegardes

- Git, avec un dépôt GitHub privé distant : c'est la sauvegarde du code et des `site.config.ts`.
- ⚠ **`sites/*/raw/` est dans `.gitignore`.** Les photos originales du client ne sont sauvegardées
  nulle part hors du PC. Il faut une copie automatique vers un Drive partagé F&F, ou `ff archiver`
  vers un dossier synchronisé, à chaque nouveau client.
- Côté Cloudflare, chaque déploiement est conservé et peut être restauré : c'est un retour arrière
  immédiat.
- Une fois par mois, un zip de `sites/` et `dist/` sur un second support (Drive).

### 3.5 Séparer les secrets

- Les clés (`ANTHROPIC_API_KEY`, `CLOUDFLARE_API_TOKEN`, Unsplash, Pexels) vivent dans `.env`
  (ignoré par git) et dans les **secrets GitHub Actions**. Jamais dans `site.config.ts`.
- Les secrets propres à un site (`TURNSTILE_SECRET`, `RESEND_API_KEY`) vont dans les variables
  d'environnement du projet Cloudflare, pas dans le dépôt. Les clés Web3Forms et Turnstile publiques
  sont publiques par nature.
- Un jeton Cloudflare par usage, avec le minimum de permissions : un pour la CI (Pages Edit), un
  pour `ff domaine` (Zone, DNS, Email Routing).
- `ff exporter` doit vérifier que l'export ne contient ni `.env` ni identifiants (à ajouter aux
  tests s'il ne le fait pas).

---

## 4. Pipeline automatisé

### 4.1 Les briques et leur coût

| Brique | Choix | Coût | Limites |
|---|---|---|---|
| Prise de commande | **Google Form** (ou Tally) | 0 € | Tally : formulaires et réponses illimités, webhooks et dépôt de fichiers en gratuit, données dans l'UE |
| Déclencheur | **Apps Script** `onFormSubmit`, qui appelle l'API GitHub `repository_dispatch` | 0 € | 20 000 appels URL par jour, 6 min par exécution, 90 min de déclencheurs par jour (compte gmail). `client_payload` : 10 propriétés au plus, moins de 64 Ko, **donc on passe l'identifiant du dossier Drive des photos, pas les photos** |
| Orchestration | **GitHub Actions** (dépôt privé) | 0 € jusqu'à 2 000 min/mois, puis 0,006 $/min (Linux) | Conforme à la règle « rien en local » |
| Génération | `node scripts/ff-generer.mjs` (Sonnet 5 : 2 $/MTok en entrée, 10 $/MTok en sortie) | Environ 0,25 à 1 $ par site, estimation : environ 40 000 jetons en entrée et 16 000 en sortie, fois 1 à 3 essais | — |
| Contrôle qualité | `ff images`, `ff verifier`, `ff typo`, `ff a11y` | 0 € | Lighthouse et les captures en CI demandent un Chrome dans le runner (playwright) |
| Prévisualisation | `wrangler pages deploy --branch preview-<slug>` donne une URL `*.pages.dev` | 0 € | Prévisualisations illimitées |
| Validation | PR GitHub « Site <slug> » avec l'URL de prévisualisation et la checklist | 0 € | — |
| Mise en prod | Fusion de la PR, puis `deploy.yml` et `ff domaine` | 0 € | La bascule DNS reste à faire par le client |

Make (Free : 1 000 crédits/mois, déclenchement toutes les 15 min au mieux ; Core à 9 $) et n8n
(Cloud Starter à 20 €/mois, Community gratuit mais à héberger soi-même) n'apportent rien ici.
Apps Script et GitHub Actions couvrent le besoin gratuitement, et sans un service de plus à
surveiller.

### 4.2 Schéma cible pour 2 personnes

```
Client ─(appel audit 15 min, HUMAIN)─► Google Form « commande »
                                           │  réponses + photos dans Drive/F&F/<slug>/
                                           ▼
                           Apps Script onFormSubmit
                                           │ POST /repos/F&F/ff-atelier/dispatches
                                           │ {event_type:"nouveau-site", client_payload:{slug, driveFolderId}}
                                           ▼
                GitHub Action « nouveau-site » (runner GitHub, jamais le PC)
                  1. ff nouveau <slug> ; brief.md généré depuis les réponses
                  2. photos Drive -> sites/<slug>/raw (compte de service) ; ff nettoyer-photos ; ff images
                  3. ff-generer <slug> (API Anthropic)  -> site.config.ts validé zod
                  4. ff build + ff verifier (bloquant)
                  5. wrangler pages deploy --branch preview -> URL de prévisualisation
                  6. ouvre une PR + e-mail aux 2 associés
                                           ▼
             HUMAIN (30-60 min) : relecture des textes (rien d'inventé), choix des photos,
             retouches via Claude Code sur la branche, 2e prévisualisation automatique
                                           ▼
             Appel de restitution avec le client (HUMAIN) -> corrections (IA + humain)
                                           ▼
             Le client valide (e-mail ou formulaire) -> fusion de la PR -> deploy.yml (prod)
                                           ▼
             Le client change ses NS chez OVH (guidé, HUMAIN) -> ff domaine <slug> <domaine>
                                           ▼
             ff sante J+1 (auto) · ff kit (auto) · facture (plateforme agréée) · statut « suivi » ou « fige »
```

**Ce qui reste humain** : l'appel d'audit et de brief, la vente, la sélection et le droit d'usage
des photos, la relecture factuelle (règle n° 2 de CLAUDE.md : rien d'inventé), le jugement
esthétique final, les deux appels client, la bascule DNS avec le client, la facture et la relance.

Le temps de production visé tombe à environ 1 h 30 humaine par site, contre environ 2 h selon le
README.

Sources :
- https://developers.google.com/apps-script/guides/services/quotas
- https://docs.github.com/en/rest/repos/repos#create-a-repository-dispatch-event
- https://docs.github.com/en/billing/concepts/product-billing/github-actions
- https://tally.so/pricing
- https://www.make.com/en/pricing
- https://n8n.io/pricing/
- https://platform.claude.com/docs/en/about-claude/pricing

---

## 5. Maintenance à l'échelle

### 5.1 Dépendances

`.github/dependabot.yml` existe déjà : une PR npm groupée par mois, sans les montées de version
majeures d'Astro et de Tailwind. C'est suffisant. Renovate (application Mend, gratuite)
n'apporterait que l'automerge des patchs, et ce n'est pas souhaitable sans CI visuelle. Avec un
monorepo, une PR met à jour tous les sites d'un coup. Avec un dépôt par client, il en faudrait 100.

### 5.2 Surveillance de disponibilité

| Outil | Gratuit | Payant | Remarque |
|---|---|---|---|
| **`ff sante` en cron GitHub Actions** (existe, hebdomadaire) | Oui | — | **À passer en quotidien** dans une version légère (HTTP 200, certificat, expiration du domaine par RDAP). Une issue est ouverte en cas d'échec. Environ 1 min par passage pour 100 sites |
| UptimeRobot | 50 sondes, toutes les 5 min, mais « hobby and non-profit » : depuis fin 2024 le gratuit est réservé à l'usage personnel non commercial **(source secondaire pour la date)** | Solo 9 €/mois, Team 35 €/mois (100 sondes, 30 s) | Gratuit **exclu** pour des sites clients |
| Better Stack | 10 sondes, 1 page de statut, alertes e-mail et Slack **(source secondaire)** | À partir de 29 $/mois | Pour le site F&F et quelques sites critiques |

**Point important** : `ff sante` contrôle déjà la date d'expiration du domaine. C'est la panne la
plus probable chez un artisan (carte bancaire expirée chez OVH). On alerte à J-30 puis J-7, et on
prévient le client.

### 5.3 Statistiques de visite

| Outil | Prix | Limites | RGPD |
|---|---|---|---|
| **Cloudflare Web Analytics** (déjà intégré) | Gratuit | **10 sites au plus s'ils ne passent pas par Cloudflare**, illimité s'ils y passent. Avec la délégation des NS, ils y passent. | Sans cookie, sans donnée personnelle |
| Plausible | Starter 9 $/mois (1 site, 10 000 pages vues), Growth 14 $ (3 sites), Business 19 $ (10 sites) | — | Hébergé dans l'UE |
| Umami Cloud | Hobby gratuit (1 site, 100 000 événements), Pro 20 $/mois (20 sites) | — | Serveurs aux États-Unis et dans l'UE |

On met Cloudflare Web Analytics par défaut, et Plausible en option refacturée si le client veut un
tableau de bord à lui.

### 5.4 Formulaires de contact

| Service | Gratuit | Payant | Données |
|---|---|---|---|
| **Worker Cloudflare + Email Routing** (`provider: 'cloudflare'`, déjà codé) | Oui, sans quota pratique pour un site vitrine | — | Rien n'est stocké, l'e-mail est relayé. Cloudflare reste un sous-traitant américain. **Par défaut** |
| Web3Forms (déjà codé) | 250 envois/mois, formulaires illimités | Pro 12 $/mois en annuel (20 000 envois) | Société indienne, dit ne pas stocker les envois (journaux purgés tous les 2 mois). On ne sait pas clairement si le quota est par compte ou par clé : **à vérifier avant 10 clients** |
| Formspree | 50 envois/mois | Personal 10 $/mois (200), Professional 20 $ (2 000) | États-Unis |
| Basin | 50 envois/mois, 1 formulaire | Starter 12,50 $/mois | États-Unis |

Le Worker maison est la seule option gratuite qui tient à 100 clients. Il faut surveiller la limite
de 200 adresses de destination vérifiées par compte Cloudflare, qu'on atteint vers 100-200 clients
sur un compte unique. Un argument de plus pour un compte par client.

### 5.5 Demandes de modification

- Un canal unique : l'adresse `modifs@finck-fisch.fr`, ou un formulaire Tally qui crée une
  **issue GitHub** avec le label du slug.
- Le Suivi comprend 30 min par mois, non cumulables. Au-delà, 45 € HT par demi-heure, sur devis
  accepté par e-mail.
- La plupart des demandes (horaires, tarifs, photo, texte) sont un changement de `site.config.ts` :
  **l'IA ouvre la PR, un humain valide la prévisualisation**. On vise 10 min humaines par demande.
- Sans Suivi, chaque intervention est facturée à l'unité (minimum une demi-heure).

Sources :
- https://uptimerobot.com/pricing/
- https://notifier.so/guides/uptimerobot-pricing-2026/ (secondaire)
- https://costbench.com/software/log-management/better-stack/free-plan/ (secondaire)
- https://developers.cloudflare.com/web-analytics/about/
- https://developers.cloudflare.com/web-analytics/limits/
- https://plausible.io/#pricing
- https://umami.is/pricing
- https://formspree.io/plans
- https://usebasin.com/pricing
- https://web3forms.com/pricing (403 en lecture directe, chiffres via https://splitforms.com/web3forms-pricing, secondaire)
- https://docs.web3forms.com/getting-started/faq

---

## 6. Modèle commercial

### 6.1 Prix du marché français en 2026

| Offre | Prix | Modèle | Source |
|---|---|---|---|
| **Simplébo**, à la carte | 200 € HT de frais + à partir de 30 € HT/mois | Création + abonnement | Officielle |
| **Simplébo**, Pack Croissance | 600 € HT + 120 € HT/mois | Création + abonnement | Officielle |
| **Simplébo**, Pack Complet | 800 € HT + 150 € HT/mois | Création + abonnement | Officielle |
| Solocal / PagesJaunes | Abonnement 12, 24 ou 48 mois, renouvellement automatique. Plus de 150 €/mois cité | Abonnement | Secondaire |
| LocWeb et équivalents | 49 €/mois, sans engagement | Location | Secondaire |
| **Wix**, à faire soi-même | Light 16,80 €, Essentiel 30 €, Business 40,80 € TTC/mois | Abonnement | Secondaire (page officielle illisible) |
| **Squarespace**, à faire soi-même | Basic 12 €, Essential 18 €, Plus 32 €/mois en annuel | Abonnement | Secondaire |
| Freelance (Malt et autres) | 800 à 3 000 € (5-10 pages). TJM des développeurs : 317 à 672 € selon l'expérience (baromètre Malt, juillet 2026) | Paiement unique | Secondaire |
| Toulouse, TPE | 1 500 € HT (gabarit configuré) à 6 500 € HT (sur mesure artisan). Hébergement et maintenance : 900 à 2 400 € HT/an | Paiement unique + maintenance | Secondaire |
| Budget artisan cité (plombier) | 590-800 € | Paiement unique | Secondaire |

### 6.2 Les modèles comparés

| Modèle | Avantages | Risques |
|---|---|---|
| **Paiement unique** (actuel) | Trésorerie immédiate. Discours « à vous, sans abonnement » différenciant face à Simplébo, Solocal et Wix. Aucun impayé récurrent. | Pas de revenu récurrent. Il faut vendre sans cesse. Le client revient « gratuitement » pour des retouches si ce n'est pas cadré. |
| **Mixte** (création + mensualité obligatoire) | Revenu récurrent, prix d'entrée plus bas | Contredit le discours actuel. Il faut un engagement pour amortir. Impayés à relancer. |
| **Abonnement seul / location sans frais d'entrée** | Entrée à 0 €, argument fort pour les TPE fauchées | **À éviter.** Il faut 24-48 mois pour amortir, donc un engagement long. Ce secteur a une mauvaise image : la DGCCRF a contrôlé les prestataires web et leurs **locations financières** sur 48 mois (22 contrôlés, 3 avertissements, 8 injonctions, 3 signalements pénaux en 2020). Surtout, un artisan de **5 salariés ou moins**, démarché hors établissement, bénéficie de la **rétractation de 14 jours** comme un consommateur. Des impayés au milieu du contrat sont durs à recouvrer. |
| **Unique + Suivi optionnel** (recommandé) | Garde le discours. Le récurrent vient de ceux qui en veulent. Pas d'engagement long, donc pas de litige. | Tout le monde ne prendra pas le Suivi. Il faut que sa valeur se voie (rapport mensuel). |

### 6.3 Prix recommandés pour F&F

Voir le tableau du § 0.1. Pourquoi ces montants :

- **1 190 / 1 790 € HT**. On est sous le bas de la fourchette des agences toulousaines (1 500 €)
  et au milieu de la fourchette freelance, avec un délai (72 h) que personne n'affiche. Sur 3 ans,
  c'est moins cher que Simplébo Croissance (600 + 36 × 120 = 4 920 € HT). L'Essentiel à 1 190 €
  reste au-dessus du « budget plombier » de 590-800 € : il faut le justifier par l'audit gratuit et
  le résultat, pas baisser le prix.
- **Suivi à 29 € HT/mois**. 348 €/an, sous les 900-2 400 €/an des agences locales. La marge est
  quasi totale (coût d'hébergement nul). Le temps moyen à tenir est d'environ 20 min par client et
  par mois.
- **Pas de location sans frais d'entrée** avant d'avoir 30 clients et un recul sur les impayés. Si
  on en lance une un jour : 79 € HT/mois sur 24 mois, sans organisme de financement, avec le site
  acquis au client à la fin. Mais il faudra alors réécrire le discours commercial.
- **Rappel juridique** (JURIDIQUE.md § 6) : avec la rétractation de 14 jours pour les petits
  artisans démarchés, livrer en 72 h impose que le client **demande expressément** que la
  prestation commence avant la fin du délai.
- **Micro-entreprise en franchise de TVA** : HT = prix facturé, avec la mention art. 293 B du CGI.

Sources :
- https://www.simplebo.fr/tarifs
- https://www.lafabriquedunet.fr/logiciels/tendances/prix-site-wix (secondaire)
- https://www.lafabriquedunet.fr/logiciels/tendances/prix-site-abonnements-tarifs-squarespace (secondaire)
- https://www.codeur.com/blog/createurs-sites-web-artisans/ (secondaire, offre à 49 €/mois)
- https://www.sortlist.com/agency/locweb (secondaire)
- https://www.lafabriquedunet.fr/agences/tendances/tarifs-des-freelances-web-developpeurs-graphistes-et-webmarketing (secondaire, baromètre Malt)
- https://kolonell.com/fr/blog/cout-creation-site-vitrine-tpe-toulouse-2026 (secondaire)
- https://sk-web.fr/article/cout-creation-site-web-artisan-2026 (secondaire)
- https://www.solocal.com/sites/default/storage/files/2026-07/Solocal%20Group%20-%20Rapport%20Financier%20Semestriel%202026.pdf
- https://www.economie.gouv.fr/dgccrf/location-financiere-aupres-des-professionnels-demarches

---

## 7. Coûts récurrents et sortie

### 7.1 Principe : F&F ne paie rien par client, jamais

| Élément | Titulaire | Payeur |
|---|---|---|
| Nom de domaine | Client (compte OVH à son nom) | Client |
| E-mail pro | Client | Client |
| Hébergement | Compte Cloudflare (F&F au début, puis un par client) | Personne (gratuit) |
| Code et contenu | Client (cession des droits à la livraison, voir JURIDIQUE.md) | — |
| Statistiques, formulaire | Compte Cloudflare | Personne (gratuit) |

Si F&F s'arrête, **aucun coût ne continue de courir pour F&F**. Les sites restent en ligne tant que
le compte Cloudflare existe. ⚠ Avec le compte F&F unique, fermer ce compte ferait tomber tous les
sites. Il faut donc remettre zones et sites aux clients **avant** de le fermer. Un compte par
client règle ce problème à la source.

### 7.2 Clause de réversibilité (à ajouter aux CGV)

- À tout moment, sur simple demande, F&F remet gratuitement le **kit de sortie** sous 15 jours.
- Si F&F cesse son activité : préavis de 3 mois par e-mail à chaque client, kit envoyé
  d'office, assistance à la bascule incluse.
- Fin du Suivi : le site reste en ligne et passe au statut « figé ». Aucune coupure.

### 7.3 Kit de sortie (à automatiser : `ff sortie <slug>`)

1. Le zip du site statique (`dist/<slug>`), prêt à déposer chez n'importe quel hébergeur.
2. Le dépôt source (`ff exporter`) et son README.
3. La liste des enregistrements DNS actuels (export de la zone Cloudflare), dont MX, SPF et DKIM.
4. Une fiche « héberger son site gratuitement sur Cloudflare en 10 min », plus l'alternative
   o2switch ou OVH par FTP.
5. Les originaux des photos et les crédits (`CREDITS.md`).
6. Le rappel : code authinfo du domaine à demander à OVH, gratuit.

Sources : sections 1, 2 et 5.

---

## 8. Passer de quelques clients à plusieurs dizaines, puis centaines

### 8.1 Ce qui casse, et quand

| Seuil | Ce qui casse | Parade |
|---|---|---|
| Dès le 1er client | Vercel Hobby (CGU) | Cloudflare |
| Environ 10 clients | Quota Web3Forms (250/mois), si c'est un quota par compte | Worker Cloudflare par défaut |
| Environ 10 clients | Photos `raw/` non sauvegardées | Copie Drive automatique |
| Environ 20 clients | `deploy.yml` redéploie tout à chaque push | Déploiement des seuls sites modifiés (empreinte) |
| Environ 30 clients | Suivi de la bascule DNS, des renouvellements et des formules à la main | `sites-en-ligne.json` enrichi + alerte d'expiration |
| Environ 30 clients | Mises à jour du gabarit qui changent des sites livrés | Variantes immuables + diff visuel en CI |
| **Environ 80-100 clients** | **100 projets Pages ou 100 Workers par compte Free** | Un compte par client, ou Workers Paid à 5 $ |
| Environ 100-200 clients | 200 adresses de destination Email Routing par compte | Un compte par client |
| Environ 100 clients | 2 000 min d'Actions/mois si on reconstruit tout souvent | Builds incrémentaux, cache npm, pas de captures sur `main` |
| Variable | Le temps passé en support | Quota du Suivi, issues, l'IA fait la PR |

### 8.2 Ce qu'il faut automatiser, par ordre de rentabilité

1. Prise de commande jusqu'à la prévisualisation (§ 4). C'est le plus gros gain de temps.
2. `ff domaine` avec recopie obligatoire des MX existants, et vérification avant bascule.
3. Surveillance quotidienne : disponibilité, certificat, **expiration du domaine**.
4. Déploiement des seuls sites modifiés et CI visuelle.
5. Rapport mensuel du Suivi (visites Cloudflare et messages reçus) envoyé au client. C'est ce qui
   justifie les 29 €.
6. `ff sortie` (kit de sortie).
7. Création d'un compte Cloudflare par client par l'API (à tester).

### 8.3 Outils de suivi

- **CRM** : une Google Sheet partagée qui reprend le pipeline déjà défini dans COMMERCIAL.md
  (`en_production` → `livre` → `facture_soldee` → `perdu`, `montant_devis`...). Suffisant jusqu'à
  environ 50 clients. On ne passe à un vrai CRM que si la prospection dépasse ce que la feuille
  absorbe.
- **Facturation électronique** :
  - Depuis le **1er septembre 2026**, toutes les entreprises doivent pouvoir **recevoir** des
    factures électroniques, par une **plateforme agréée** immatriculée par l'administration
    fiscale.
  - Les micro et petites entreprises doivent pouvoir **émettre** des factures électroniques et
    transmettre l'e-reporting au plus tard le **1er septembre 2027**.
  - Nos clients sont des professionnels (B2B) : F&F sera concerné à l'émission en 2027 au plus tard.
  - Offres gratuites citées : **Abby** (plan Basique, plateforme agréée, partenaire URSSAF),
    **Indy** (Essentiel à 0 €), **Tiime**, **Henrri** **(sources secondaires)**. **Vérifier leur
    présence sur la liste officielle de impots.gouv.fr avant de choisir.**
  - Il faut un SIRET, qui bloque déjà par ailleurs (mémoire du projet).
- **Paiement** : virement, ou lien de paiement de la plateforme de facturation. Le paiement en
  3 fois se gère par 3 échéances, sans organisme de financement.

Sources :
- https://www.economie.gouv.fr/tout-savoir-sur-la-facturation-electronique-pour-les-entreprises
- https://entreprendre.service-public.gouv.fr/actualites/A18953?lang=en
- https://www.economie.gouv.fr/entreprises/gerer-sa-micro-entreprise/micro-entrepreneur-auto-entrepreneur-quelles-sont-vos-obligations
- https://tool-advisor.fr/logiciel-facturation/comparatif/plateforme-agreee-gratuite/ (secondaire)
- https://abby.fr/guide/facturation/quel-logiciel-facturation-choisir-2026 (secondaire, éditeur concerné)
- sections 1 et 5 pour les limites Cloudflare et GitHub

---

## 9. Plan d'action priorisé

### Cette semaine

| # | Action | IA | Humain |
|---|---|---|---|
| 1 | **Sortir le site F&F de Vercel Hobby** (usage commercial interdit) : `ff deploy finck-fisch`, puis `ff domaine` | Lance les commandes, vérifie `_headers` et `ff sante` | Change les NS du domaine F&F, valide |
| 2 | Compte Cloudflare F&F : adresse partagée, double authentification, 2 membres, jetons minimaux, secrets GitHub | Liste les permissions exactes | Crée le compte et les jetons |
| 3 | `ff domaine` : bloquer la bascule tant que les MX, SPF et DKIM existants ne sont pas recopiés | Code et tests | Relit |
| 4 | Formulaire `provider: 'cloudflare'` par défaut, test de bout en bout sur une démo | Configure et teste | Valide la réception |
| 5 | Fiche client « créer son domaine chez OVH en 10 min, à votre nom » + texte du devis (15-20 €/an à sa charge) | Rédige | Relit, teste en vrai avec un compte |
| 6 | Grille de prix (1 190 / 1 790 / Suivi 29 €), à reporter dans COMMERCIAL.md et JURIDIQUE.md | Propose les modifications | **Décide** |

### Ce mois-ci

| # | Action | IA | Humain |
|---|---|---|---|
| 7 | CGV : clause de réversibilité, kit de sortie, Suivi sans engagement après 3 mois, quota de modifications | Rédige | Relecture juridique (avocat ou expert-comptable) |
| 8 | Pipeline Google Form, Apps Script, `repository_dispatch`, Action « nouveau-site », PR de prévisualisation | Écrit l'Apps Script, le workflow et les tests | Crée le formulaire, le jeton GitHub et le compte de service Drive |
| 9 | `deploy.yml` : ne déployer que les sites modifiés (empreinte de `dist`) et seulement ceux au statut `suivi` | Code | Relit |
| 10 | `sites-en-ligne.json` enrichi (statut, domaine, registrar, date de renouvellement, formule) | Code et migration | Remplit les vraies données |
| 11 | Sauvegarde des `raw/` vers Drive + zip mensuel | Script | Crée le dossier Drive |
| 12 | `ff sante` quotidien, léger, avec alerte d'expiration du domaine à J-30 et J-7 | Code | Choisit le canal d'alerte |
| 13 | Plateforme de facturation agréée gratuite (dès qu'on a le SIRET) | Compare sur la liste officielle | Ouvre le compte |
| 14 | Règle « variantes immuables » dans CONVENTIONS.md + diff visuel en CI | Code et doc | Valide |

### À partir de 30 clients

| # | Action | IA | Humain |
|---|---|---|---|
| 15 | Tester **un compte Cloudflare Free par client** créé par l'API, avec F&F membre ; l'appliquer aux nouveaux clients | Script `ff compte` | Valide le parcours de remise au client |
| 16 | Avant 80 projets : choisir entre un compte par client et Workers Paid (5 $/mois), et migrer de Pages vers Workers static assets si besoin | Migration (`_worker.js` vers `main`) | Décide |
| 17 | Issues GitHub pour les demandes de modification, l'IA ouvre les PR | Automatisation | Valide chaque prévisualisation |
| 18 | Rapport mensuel du Suivi envoyé aux clients | Génération | Relit le modèle une fois |
| 19 | `ff sortie <slug>` (kit de sortie complet) | Code | — |
| 20 | Revoir les prix (taux de prise du Suivi, temps réel passé par client) | Analyse des données | Décide |

### Incertitudes à lever

- Les prix OVH, Infomaniak et Wix, et le renouvellement o2switch, ne viennent pas des pages
  officielles (rendues en JavaScript).
- Web3Forms : on ne sait pas si le quota de 250 envois est par compte ou par clé.
- On ne sait pas si les déploiements par `wrangler` comptent dans les 500 builds Pages.
- On ne sait pas si la clause vidéo de Cloudflare vise Pages et Workers.
- La redirection HTTPS du domaine nu chez OVH (méthode B) n'est pas vérifiée.
- La création de comptes Cloudflare Free par l'API et la gestion de leurs membres sont à tester.
- Il n'existe pas de limite documentée sur le nombre de zones par compte Free.
- La date du passage d'UptimeRobot au « non commercial » vient de sources secondaires. La page de
  prix officielle dit seulement « hobby and non-profit ».
