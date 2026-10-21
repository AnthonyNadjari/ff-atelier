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

### 1.3 Secrets GitHub (pour le deploiement par CI)

Le workflow `.github/workflows/deploy.yml` se lance a la main (`Actions -> Deploiement des sites ->
Run workflow`) : un `slug`, ou vide pour redeployer tous les sites de `sites-en-ligne.json` (jamais une
demo ni un prospect). Il appelle `node scripts/ff.mjs deploy <slug>`, exactement comme depuis le poste,
puis renvoie `sites/<slug>/hebergement.json` dans le depot. Deux secrets, a ajouter dans **Settings ->
Secrets and variables -> Actions** :

| Secret | Ou le trouver |
| --- | --- |
| `CLOUDFLARE_API_TOKEN` | Cloudflare dashboard -> My Profile -> API Tokens -> Create Token -> Custom Token : `Account -> Workers Scripts -> Edit`, `Account -> Cloudflare Pages -> Edit`, `Zone -> Zone -> Read`, `Zone -> DNS -> Edit`, `Zone -> Email Routing Rules -> Edit` (le meme jeton sert a `ff domaine`) |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare dashboard, colonne de droite de n'importe quelle page de compte |

Les memes variables dans `.env` (voir `.env.example`) permettent a `ff deploy` de se passer de
`wrangler login` sur le poste.

## 2. Par site

### 2.1 Premier deploiement

```
node scripts/ff.mjs deploy <slug>              # Workers static assets (defaut depuis le 22 oct 2026)
node scripts/ff.mjs deploy <slug> --pages      # Cloudflare Pages (ancien chemin, 100 projets par compte)
node scripts/ff.mjs deploy <slug> --simuler    # affiche config et commande, ne lance rien
```

Cela construit le site (`dist/<slug>`), passe la garde « donnees de test » (§ 2.6), puis le publie chez
Cloudflare. **Deux modes**, memorises dans `sites/<slug>/hebergement.json` (`{ mode, projet, url, date }`,
ecrit a chaque deploiement reussi, lu ensuite par `ff domaine`, `ff sante` et `ff build`) :

- **`workers`** (defaut d'un site jamais deploye) : un Worker a fichiers statiques nomme `<slug>` (ou
  `--projet <nom>`), deploye par `npx -y wrangler@4 deploy --config .ff-tmp/<slug>/wrangler.json`. La config
  est ecrite par `ff deploy` (`scripts/ff/hebergement.mjs`, `configWrangler`) : dossier `dist/<slug>`,
  `html_handling: auto-trailing-slash` (`/services/x` servi depuis `x.html`), `not_found_handling: 404-page`
  (404.html avec un vrai 404), et, si `form.provider: 'cloudflare'`, le Worker du formulaire
  (`dist/<slug>/_worker.js`, exclu des fichiers servis par `dist/<slug>/.assetsignore`) avec le binding
  `send_email` nomme `EMAIL` **declare dans la config** : rien a cliquer dans le dashboard par site, c'est
  ce qui permet de tenir des centaines de sites sans oublier une case. `_headers` et `_redirects` de
  `dist/<slug>` sont lus par Workers comme par Pages. Le site est visible sur
  `https://<slug>.<sous-domaine du compte>.workers.dev` (URL relevee dans la sortie de wrangler et
  gardee dans `hebergement.json`). Limites : 100 Workers en gratuit, 500 avec Workers Paid (5 $/mois
  pour tout le compte, `studio/decisions/PROCESS-HEBERGEMENT.md` § 2).
- **`pages`** (`--pages`, ou site deja deploye ainsi : on ne change jamais d'hebergeur sans le demander) :
  `wrangler pages deploy`, projet Pages `<slug>`, visible sur `https://<slug>.pages.dev` ; le binding
  e-mail du formulaire se clique dans le dashboard (§ 2.5). 100 projets par compte, limite non relevee.

Sources (22 oct 2026) : https://developers.cloudflare.com/workers/static-assets/ ·
https://developers.cloudflare.com/workers/wrangler/configuration/ ·
https://developers.cloudflare.com/workers/platform/limits/.

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
4. Selon `sites/<slug>/hebergement.json` :
   - **mode `workers`** : attache `<domaine>` (et `www.<domaine>` avec `--www`) au Worker par
     `PUT /accounts/{id}/workers/domains` (`scripts/ff/hebergement.mjs`, `reqAttachWorkerDomain`) ;
     Cloudflare pose lui-meme l'enregistrement DNS et le certificat. **Idempotent** (un domaine deja
     attache est reconnu). Un enregistrement A/AAAA/CNAME deja pose sur ce nom fait echouer l'appel :
     la commande les liste, on les supprime dans le dashboard (DNS) et on relance.
   - **mode `pages`** : ajoute le domaine au projet Pages et pose/maintient l'enregistrement DNS `CNAME`
     vers `<projet>.pages.dev` (proxifie par Cloudflare — orange cloud). **Idempotent** : si
     l'enregistrement existe deja, il est mis a jour (`PUT`) plutot que duplique.
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

**En mode `workers` (defaut), rien a configurer** : `ff deploy` declare le binding `EMAIL` (`send_email`)
dans la config wrangler ; il reste a activer Email Routing sur le domaine et faire verifier l'adresse de
destination par le client, ce que `ff domaine --email-vers` fait (§ 2.2bis). Le Worker envoie depuis
`formulaire@<domaine>` : le domaine doit donc etre branche (`ff domaine`) pour que le formulaire parte.

**En mode `pages`, a configurer une fois par site, dans le dashboard Cloudflare** (apres le premier `ff deploy`) :

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

### 2.6 Garde « donnees de test » (avant tout deploiement)

`ff deploy` et `ff vercel` construisent le site puis refusent de publier si `dist/<slug>` montre le
telephone de test (06 00 00 00 00 sous toutes ses formes, `tel:+33600000000`, `wa.me/33600000000`),
le code postal 75000, ou des mentions legales sans SIRET/RCS/RM ni avis « en cours de creation ».
Meme controle dans `ff verifier`. Sites de demonstration (slug `_…`/`demo-…` ou `// DEMO` en tete de
`site.config.ts`) : avertissement seulement. Il n'y a pas d'option pour passer outre : on met les
vraies donnees, ou une page legale sur mesure honnete (`docs/CONVENTIONS.md` § Pages legales).

### 2.7 Vercel — `ff vercel`

Cas d'usage : le site du studio tant qu'il y est (Vercel Hobby interdit l'usage commercial, les sites
clients vont sur Cloudflare, voir `studio/decisions/hebergement-livraison.md`).

```
node scripts/ff.mjs vercel <slug> --simuler    # build + garde + ecrit dist/<slug>/vercel.json, n'envoie rien
node scripts/ff.mjs vercel <slug>              # idem puis npx -y vercel deploy --prod --yes
node scripts/ff.mjs deploy <slug> --vercel     # meme chose
```

Dans `dist/<slug>` : le `_headers` (format Cloudflare, ecrit au build) devient `vercel.json`
(`headers`, `*` -> `:path*`), `sites/<slug>/redirects.json` (format Vercel,
`{ "redirects": [{ "source", "destination", "statusCode" }] }`) s'y ajoute, et `.vercelignore`
exclut `_headers` et `.env*`. **`cleanUrls: true` est obligatoire** : le build est en
`format: 'file'` (`audit.html`, `mentions-legales.html`) et sans lui Vercel repond 404 sur `/audit`
et `/mentions-legales`. Conversion pure : `headersVersVercel` (`scripts/ff/vercel.mjs`,
`tests/vercel.test.mjs`).

Identifiants du projet : `VERCEL_ORG_ID` + `VERCEL_PROJECT_ID` dans l'environnement ou `.env`, sinon
`sites/<slug>/vercel-projet.json` : `{ "orgId": "team_…", "projectId": "prj_…" }` (memes valeurs que le
`.vercel/project.json` cree par `vercel link`). Connexion : `npx vercel login` une fois.

Apres le deploiement, verifier l'iPhone sur l'URL https publiee : l'emulation WebKit contre le serveur
local echoue a cause de `upgrade-insecure-requests` + HSTS dans la CSP.

## 3. Remise au client

Une fois le site valide (`node scripts/ff.mjs verifier <slug>` sans `✗`) :

1. `node scripts/ff.mjs exporter <slug> --dest ../<slug>-site` — cree un depot
   autonome (sans les autres sites, sans les photos brutes, avec un `README.md`
   explicatif en francais et un premier commit git).
2. Transfere ce depot au client ou a son futur developpeur (nouveau depot GitHub a
   son nom, ou simple archive).
3. Le domaine est deja au nom du client (achete par F&F chez OVH, paye 10 ans) : remets-lui le code de
   transfert (authinfo) demande a OVH, gratuit.
4. Le client, ou son developpeur, redeploie depuis le nouveau depot sur son propre compte Cloudflare
   (`npx wrangler deploy` avec la config decrite § 2.1) ou n'importe quel hebergeur statique.

## 4. Couts

| Poste | Cout |
| --- | --- |
| Hebergement (Cloudflare Workers static assets ou Pages) | Gratuit (plan Free) ; Workers Paid 5 $/mois pour tout le compte au-dela de 100 Workers |
| Nom de domaine | Environ 90 € TTC pour 10 ans (.fr chez OVH, au nom du client, compris dans le prix du site) |
| Formulaire de contact (Worker + Email Routing) | Gratuit, rien n'est stocke |
| Certificat HTTPS | Gratuit et automatique (Cloudflare) |

## 5. Sécurité

### 5.1 En-têtes de sécurité et Content-Security-Policy

`astro.config.mjs` (intégration `ff-headers`) écrit `_headers` à la racine de `dist/<slug>` à chaque
build, lu par Cloudflare Pages — voir [la doc officielle des en-têtes personnalisés](https://developers.cloudflare.com/pages/configuration/headers/).
Au-delà des en-têtes déjà en place (`X-Content-Type-Options`, `Referrer-Policy`, `X-Frame-Options`,
`Cache-Control`), le fichier contient maintenant :

- **`Content-Security-Policy`**, construite par site par `scripts/ff/csp.mjs` (`buildCsp` +
  `readSiteSecurityConfig`, testées dans `tests/headers.test.mjs`) : la config est lue **par regex**
  dans `sites/<slug>/site.config.ts` (même motif que `readTradeFromConfig` dans
  `scripts/ff/verifier.mjs` — pas d'import TS possible hors contexte Vite au moment où
  `astro.config.mjs` s'exécute), puis traduite en directives. Seules les origines réellement utilisées
  par CE site sont ajoutées :
  - `script-src`/`connect-src` : `https://plausible.io` si `analytics.plausible` est renseigné,
    `https://static.cloudflareinsights.com`/`https://cloudflareinsights.com` si `analytics.cloudflare`,
    l'origine du script si `analytics.umami.src` est renseigné.
  - `script-src`/`frame-src` : `https://challenges.cloudflare.com` si `form.turnstileSiteKey` est
    renseigné (widget Turnstile, voir § 5.2).
  - `connect-src`/`form-action` : `https://api.web3forms.com` si `form.provider` vaut `web3forms`.
  - `frame-src` : `https://www.google.com` + `https://maps.google.com` si `contact.mapsProvider` vaut
    `google` (façade cliquable de `src/components/Carte.astro`).
  - Fixes pour tous les sites : `default-src 'self'`, `img-src 'self' data: blob:
    https://tile.openstreetmap.org` (tuiles OSM de la carte par défaut), `font-src 'self' data:` (le
    `data:` est nécessaire : avec `build.inlineStylesheets: 'always'`, Vite inline aussi les petits
    assets référencés par le CSS — dont le `@font-face` de repli généré par Fontaine — en `data:`,
    confirmé en testant `ff captures` en conditions réelles sur `maison-aurore` le 17 septembre 2026),
    `style-src 'self' 'unsafe-inline'`, `object-src 'none'`, `base-uri 'self'`,
    `upgrade-insecure-requests`.
  - `script-src` garde `'unsafe-inline'` en permanence : `Base.astro` (init du moteur d'animation),
    `ContactForm.astro` (soumission) et `Carte.astro` (façade Google au clic) posent chacun un
    `<script>` sans `src`, et **un nonce n'est pas envisageable en build 100 % statique** (Astro génère
    le HTML une fois pour tous les visiteurs ; un nonce doit changer à chaque réponse, ce qui exige un
    serveur qui réécrit le HTML à la volée — hors de portée d'un site Cloudflare Pages purement
    statique). C'est documenté plutôt que contourné.
- **`Permissions-Policy: camera=(), microphone=(), geolocation=()`** — aucun site de l'atelier n'a
  besoin de ces API.
- **`Strict-Transport-Security: max-age=31536000; includeSubDomains`** — HTTPS forcé un an, sur tous
  les sous-domaines.

**Vérifier la CSP en conditions réelles** (un serveur statique nu, sans `_headers`, ne révèle jamais
une violation CSP) : `scripts/ff/headers-file.mjs` parse `dist/<slug>/_headers` et applique les
en-têtes correspondants dans les serveurs locaux du repo — `scripts/captures.mjs` (donc `ff captures`)
et `scripts/serve-all.mjs` (donc `ff servir`, ce que `ff sante http://localhost:PORT` peut ensuite
tester). Un `console error` de type « violates the following Content Security Policy directive » dans
la sortie de `ff captures <slug>` signale une ressource externe non déclarée — l'ajouter dans
`buildCsp` (`scripts/ff/csp.mjs`) plutôt que d'assouplir `default-src`/`script-src` par réflexe.

### 5.2 Anti-spam : Cloudflare Turnstile

Le formulaire a déjà un honeypot (`docs/CONVENTIONS.md`, champ caché vérifié côté client et par
`ff verifier`) — suffisant dans la majorité des cas. Si un client subit du spam malgré ça,
`form.turnstileSiteKey` (`site.config.ts`) active en plus le widget
[Cloudflare Turnstile](https://developers.cloudflare.com/turnstile/) :

1. Cloudflare dashboard → **Turnstile** → **Add site** → domaine du client → copie la **clé publique**
   (site key) et la **clé secrète** (secret key).
2. `site.config.ts` : `form: { provider: 'cloudflare', turnstileSiteKey: 'la-cle-publique' }`.
   `src/components/ContactForm.astro` affiche alors le widget (`<div class="cf-turnstile">`) et charge
   `https://challenges.cloudflare.com/turnstile/v0/api.js` — la CSP l'autorise automatiquement dès que
   `turnstileSiteKey` est renseigné (§ 5.1). Le widget pose lui-même un champ cache
   `cf-turnstile-response`, inclus sans code supplémentaire dans les données postées.
3. Projet Pages → **Settings** → **Environment variables** → ajoute `TURNSTILE_SECRET` (la clé secrète
   de l'étape 1). `src/worker/contact.js` vérifie alors le jeton côté serveur via
   [l'endpoint `siteverify`](https://developers.cloudflare.com/turnstile/get-started/server-side-validation/)
   (`POST https://challenges.cloudflare.com/turnstile/v0/siteverify`, `secret`/`response`/`remoteip`,
   réponse `{ success }`) avant d'envoyer l'e-mail — une soumission sans jeton valide reçoit `{
   success: false }` (403).

**Important — Turnstile n'est vérifié que par le provider `cloudflare`.** Le widget peut être affiché
avec `provider: 'web3forms'` (le champ `cf-turnstile-response` est simplement inclus dans le POST vers
Web3Forms), mais **Web3Forms ne sait vérifier que hCaptcha, pas Turnstile** — le jeton est alors soumis
mais jamais contrôlé, ce qui n'apporte aucune protection réelle. Pour un vrai anti-spam avec
`web3forms`, utiliser leur intégration hCaptcha (documentée sur web3forms.com), non implémentée ici.
Sans `TURNSTILE_SECRET` configuré côté Cloudflare Pages, le Worker laisse passer toute soumission
(rien à vérifier) — le widget reste néanmoins affiché si `turnstileSiteKey` est renseigné : configurer
les deux clés ensemble.

### 5.3 Dépendances : Dependabot

Dependabot a été retiré le 13 oct 2026 : il ouvrait une branche et une PR par mois, et les fondateurs
veulent une seule branche (`main`). À la place, avant chaque nouveau client : `npm outdated`, puis
`npm update` (mineures et correctifs), build et tests. Les majeures d'`astro`/`tailwindcss` restent une
décision à part (lire le changelog, tester plusieurs sites). L'ancienne configuration est dans
l'historique git (`git show ffb2da6:.github/dependabot.yml`).

## 6. Suivi automatisé (sites en ligne)

`sites-en-ligne.json` (racine du dépôt, tableau JSON de slugs) liste les sites déjà livrés — ajoute
le slug après chaque livraison (voir `docs/PROCESS.md` § 7bis). Le job planifié `sante-hebdomadaire`
de `.github/workflows/ci.yml` (tous les lundis, `schedule` cron) construit la liste depuis ce fichier,
lance `node scripts/ff.mjs sante <slug>` sur chacun (lit `sites/<slug>/domain.txt` pour le domaine
réel) et ouvre une issue GitHub (label `sante-site`) si au moins un site échoue — en plus du contrôle
manuel à J+1 et mensuel décrit dans `docs/PROCESS.md`.
