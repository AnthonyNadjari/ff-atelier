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

1. Cloudflare dashboard -> **Pages** -> le projet du site -> **Custom domains** ->
   **Set up a custom domain**.
2. Renseigne le domaine du client (ex : `menuiserie-vasseur.fr`).
3. Cloudflare indique les enregistrements DNS a poser.

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

### 2.4 Cle Web3Forms (formulaire de contact)

Si `form.provider` vaut `web3forms` dans `site.config.ts` :

1. Cree une cle gratuite sur [web3forms.com](https://web3forms.com/) (250 envois/mois
   gratuits, sans backend a heberger).
2. Renseigne-la dans `form.accessKey` du `site.config.ts` du client.

Le provider `mailto` (par defaut) ne necessite aucune cle : le formulaire ouvre le
client mail du visiteur.

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
