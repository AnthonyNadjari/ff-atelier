# Deploiement — guide pratique

Ce document explique comment mettre un site en ligne, du premier deploiement jusqu'a
la remise des cles au client. Il complete `docs/CONVENTIONS.md` (regles de code) : ici,
on parle serveur, domaine et argent.

## 1. Mise en place, une seule fois

### 1.1 Compte Cloudflare

1. Cree un compte gratuit sur [cloudflare.com](https://dash.cloudflare.com/sign-up).
   Le plan gratuit de **Cloudflare Pages** suffit pour tous les sites vitrine produits ici.
2. Note ton **Account ID** (visible dans le dashboard, colonne de droite de n'importe
   quelle page de compte) : il sert plus bas.

### 1.2 Connexion locale (pour `ff deploy` depuis ton poste)

```
npx wrangler login
```

Une page s'ouvre dans le navigateur pour autoriser l'acces. A faire une fois par poste
de travail (le jeton est stocke localement). `ff deploy <slug>` verifie automatiquement
que tu es connecte et te previent sinon.

### 1.3 Secrets GitHub (pour le deploiement automatique par CI)

Le workflow `.github/workflows/deploy.yml` deploie chaque site a chaque `push` sur
`main`. Il a besoin de deux secrets, a ajouter dans **Settings -> Secrets and
variables -> Actions** du depot GitHub :

| Secret | Ou le trouver |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard -> My Profile -> API Tokens -> Create Token -> modele "Edit Cloudflare Workers" ou permission `Cloudflare Pages: Edit` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard, colonne de droite de n'importe quelle page de compte |

Une fois les secrets en place, chaque push sur `main` construit et deploie tous les
sites de `sites/` (hors ceux prefixes `_`). On peut aussi lancer le workflow
manuellement (`Actions -> Deploiement des sites -> Run workflow`) en precisant un
`slug` pour ne redeployer qu'un seul site.

## 2. Par site

### 2.1 Premier deploiement

```
node scripts/ff.mjs deploy <slug>
```

Cela construit le site (`dist/<slug>`) puis le publie sur Cloudflare Pages sous un
projet nomme `<slug>` (ou `--projet <nom>` pour choisir un autre nom). Le site est
immediatement visible sur `https://<slug>.pages.dev`.

### 2.2 Domaine personnalise

**Recommande : `ff domaine`, voir § 2.2bis ci-dessous — une seule commande fait tout ce qui suit.**

Procedure manuelle (dashboard), si on prefere ne pas utiliser la commande :

1. Cloudflare dashboard -> **Pages** -> le projet du site -> **Custom domains** ->
   **Set up a custom domain**.
2. Renseigne le domaine du client (ex : `menuiserie-vasseur.fr`).
3. Cloudflare indique les enregistrements DNS a poser.

### 2.2bis Domaine en une commande — `ff domaine`

```
node scripts/ff.mjs domaine <slug> <domaine> [--zone-id X] [--email-vers adresse] [--www] [--simuler]
```

Prend un site deja deploye (`ff deploy <slug>` fait) et le branche sur un domaine personnalise, avec
e-mail optionnel, en une seule commande — objectif : la mise en ligne chez le client devient une etape
de 5 minutes plutot qu'une suite d'ecrans du dashboard Cloudflare a ne pas oublier.

**Ce que fait la commande, dans l'ordre :**

1. Lit `CLOUDFLARE_API_TOKEN` et `CLOUDFLARE_ACCOUNT_ID` (`.env` ou environnement, voir
   `.env.example`). Si absents, elle explique en francais les scopes necessaires pour creer le
   jeton (Cloudflare dashboard -> My Profile -> API Tokens -> Create Token -> Custom Token) :
   - `Account -> Cloudflare Pages -> Edit`
   - `Zone -> Zone -> Read`
   - `Zone -> DNS -> Edit`
   - `Zone -> Email Routing Rules -> Edit`
2. Verifie que le projet Cloudflare Pages `<slug>` existe (`GET .../pages/projects/<slug>`) ; le
   cree sinon (`POST .../pages/projects`, `production_branch: main`).
3. Retrouve la zone Cloudflare du domaine (`GET /zones?name=<domaine>`). Si le domaine n'est pas
   encore sur Cloudflare, la commande s'arrete (code 1) et affiche la procedure : ajouter le
   domaine dans Cloudflare, puis remplacer les serveurs de noms (nameservers) chez le registrar du
   client.
4. Ajoute `<domaine>` (et `www.<domaine>` avec `--www`) comme domaine personnalise du projet Pages,
   et pose/maintient l'enregistrement DNS `CNAME` correspondant vers `<slug>.pages.dev` (proxifie
   par Cloudflare — orange cloud). **Idempotent** : si l'enregistrement existe deja, il est mis a
   jour (`PUT`) plutot que duplique.
5. Avec `--email-vers <adresse>` : active Email Routing sur la zone (pose les enregistrements MX
   automatiquement), enregistre `<adresse>` comme adresse de destination, cree la regle
   `contact@<domaine> -> <adresse>`, et rappelle que **le client doit valider l'e-mail de
   verification envoye par Cloudflare** avant que la redirection fonctionne. Affiche le nombre
   d'enregistrements MX trouves sur la zone.
6. Ecrit `sites/<slug>/domain.txt` avec le domaine (pilote l'URL canonique et le sitemap, voir §
   2.3) et affiche une checklist finale : propagation DNS, HTTPS automatique, test du formulaire,
   soumission du sitemap a Search Console, Bing Places, lien vers la fiche Google Business Profile.

**`--zone-id`** : evite l'appel de recherche de zone si tu connais deja l'id (utile en CI ou si
plusieurs zones portent un nom proche). **`--simuler`** : affiche la sequence d'appels API qui
serait faite (methode, URL, corps) sans jamais appeler Cloudflare — utile pour verifier la commande
sans jeton reel, ou relire ce qu'elle va faire avant de la lancer pour de vrai.

`ff deploy` rappelle de lancer `ff domaine` juste apres, tant que `sites/<slug>/domain.txt` n'existe
pas.

**Non verifie cette session** : l'existence et la forme exactes d'un endpoint API dedie pour "creer
une zone" (ajouter un domaine a Cloudflare par API plutot que par le dashboard) n'ont pas ete
confirmees — la commande suppose donc que le domaine est deja ajoute a Cloudflare (zone existante) et
affiche la procedure dashboard sinon. L'endpoint `POST /zones/{id}/email/routing/enable` est marque
« deprecated » dans la reference API sans remplacement clairement documente au moment de cette
verification (WebFetch sur developers.cloudflare.com/api/) — la commande l'utilise quand meme (c'est
l'endpoint documente pour cet usage) et traite une reponse "deja actif" comme un succes.

### 2.3 DNS chez le registrar (si le domaine n'est pas gere par Cloudflare)

Chez le bureau d'enregistrement du client (OVH, Gandi, Namecheap...), ajoute les
enregistrements indiques par Cloudflare a l'etape precedente (en general un `CNAME`
vers `<slug>.pages.dev`, ou des serveurs de noms Cloudflare si le domaine est
transfere entierement). Le certificat HTTPS est automatique une fois le DNS propage
(quelques minutes a quelques heures).

Une fois le domaine actif, cree `sites/<slug>/domain.txt` avec le domaine **sans**
`https://` (une seule ligne), puis reconstruis :

```
echo menuiserie-vasseur.fr > sites/<slug>/domain.txt
node scripts/ff.mjs build <slug>
```

Ce fichier pilote l'URL canonique, le plan du site (sitemap) et les balises Open
Graph — sans lui, le site utilise `https://<slug>.pages.dev` par defaut.

### 2.3bis Mesure d'audience gratuite sans Plausible (Cloudflare Web Analytics)

Si le client ne veut pas payer Plausible : Cloudflare dashboard -> **Analytics & Logs** -> **Web
Analytics** -> **Add a site** -> renseigne le domaine -> copie le "beacon token" genere. Mets-le
dans `site.config.ts` :

```ts
analytics: { cloudflare: 'le-token-copie' },
```

`ff build` insere alors le script `beacon.min.js` (defer, sans cookie) dans `<head>` — voir
`src/layouts/Base.astro` et le champ `analytics.cloudflare` de `src/lib/schema.ts`. Comme pour
Plausible/Umami, aucun bandeau de consentement n'est necessaire (mesure d'audience sans cookie ni
donnee identifiante, exemption CNIL) : `src/pages/confidentialite.astro` le mentionne
automatiquement. Voir `docs/veille/performance.md` § 5.5 pour le detail (et ce qui n'a pas pu etre
confirme la-bas : poids exact du script, cote edge vs script JS).

### 2.4 Cle Web3Forms (formulaire de contact)

Si `form.provider` vaut `web3forms` dans `site.config.ts` :

1. Cree une cle gratuite sur [web3forms.com](https://web3forms.com/) (250 envois/mois
   gratuits, sans backend a heberger).
2. Renseigne-la dans `form.accessKey` du `site.config.ts` du client.

Le provider `mailto` (par defaut) ne necessite aucune cle : le formulaire ouvre le
client mail du visiteur.

### 2.5 Formulaire `cloudflare` (Worker + Email Routing) — recommande pour les professions reglementees

Si `form.provider` vaut `cloudflare` dans `site.config.ts` : le formulaire poste en JSON vers
`/api/contact`, meme origine, sans service tiers hors UE (voir `docs/veille/seo-conversion.md`
§ 4). `ff build <slug>` genere automatiquement `dist/<slug>/_worker.js` a partir du gabarit
`src/worker/contact.js` (placeholders remplaces par `contact.email`, le domaine du site et
`business.name`). Ce fichier active le **mode avance** de Cloudflare Pages Functions : le Worker
recoit toutes les requetes, relaie les fichiers statiques via `env.ASSETS.fetch(request)`, et
traite lui-meme `POST /api/contact` (validation nom/telephone, honeypot, limite naive par IP via
la Cache API). Aucune cle a mettre dans `site.config.ts`.

**A configurer une fois par site, dans le dashboard Cloudflare** (apres le premier `ff deploy`) :

1. **Email Routing** (pour recevoir les messages du formulaire) :
   - Cloudflare dashboard -> le domaine du client -> **Email** -> **Email Routing** -> **Enable**.
   - **Destination addresses** -> ajoute l'adresse qui doit recevoir les messages (celle de
     `contact.email` dans `site.config.ts`) -> valide le lien de confirmation recu par e-mail.
   - Le projet Pages -> **Settings** -> **Functions** -> **Email bindings** -> **Add binding** ->
     variable `EMAIL`, associee a la route Email Routing du domaine. Sans ce binding,
     `env.EMAIL` est absent et le Worker bascule automatiquement sur Resend s'il est configure,
     sinon il repond `{ success: false }`.
2. **Alternative/repli Resend** (envoi transactionnel, pas besoin qu'Email Routing soit actif sur
   le domaine) :
   - Cree un compte sur [resend.com](https://resend.com/) (gratuit jusqu'a 3000 e-mails/mois),
     verifie un domaine d'envoi.
   - Projet Pages -> **Settings** -> **Environment variables** -> ajoute `RESEND_API_KEY`
     (Production, et Preview si besoin) avec la cle API Resend.
3. **Domaine d'expedition** : le Worker envoie depuis `formulaire@<domaine du site>` (lu dans
   `sites/<slug>/domain.txt`, ou `<slug>.pages.dev` a defaut). Pour l'envoi via Email Routing, ce
   domaine doit etre celui sur lequel Email Routing est active (etape 1). Pour Resend, le domaine
   d'envoi verifie dans Resend doit correspondre, sinon adapte `sites/<slug>/domain.txt` avant de
   reconstruire.

Documenter le choix retenu (Cloudflare seul, ou + Resend) au client dans la politique de
confidentialite du site — deja fait automatiquement par `src/pages/confidentialite.astro` selon
`form.provider`.

## 3. Remise au client

Une fois le site valide (`node scripts/ff.mjs verifier <slug>` sans `✗`) :

1. `node scripts/ff.mjs exporter <slug> --dest ../<slug>-site` — cree un depot
   autonome (sans les autres sites, sans les photos brutes, avec un `README.md`
   explicatif en francais et un premier commit git).
2. Transfere ce depot au client ou a son futur developpeur (nouveau depot GitHub a
   son nom, ou simple archive).
3. Si le domaine a ete achete par Finck & Fisch pour demarrer, transfere-le au nom du
   client chez le registrar (ou donne-lui la procedure).
4. Transfere la propriete du projet Cloudflare Pages si besoin, ou redeploie depuis
   le nouveau depot avec le compte Cloudflare du client.

## 4. Couts

| Poste | Cout |
| --- | --- |
| Hebergement (Cloudflare Pages) | Gratuit (plan Free, largement suffisant pour un site vitrine) |
| Nom de domaine | Environ 10 €/an, chez le registrar de son choix |
| Formulaire de contact (Web3Forms) | Gratuit jusqu'a 250 envois/mois |
| Certificat HTTPS | Gratuit et automatique (Cloudflare) |
