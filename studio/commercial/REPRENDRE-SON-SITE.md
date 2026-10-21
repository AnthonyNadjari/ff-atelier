# Reprendre votre site vous-même, en dix minutes

Fiche remise avec votre site (zip de `dist/` et dépôt `ff exporter`) et envoyée d'office si Finck & Fisch
arrête son activité, trois mois avant (conditions générales, article 12). Votre site est un dossier de
fichiers standard : n'importe quel hébergeur de sites statiques le sert tel quel, et n'importe quel
développeur habitué à Astro peut le modifier.

## Ce que vous avez reçu

- **Le site prêt à servir** : le zip `{{slug}}-site.zip`, qui contient le dossier `dist/{{slug}}/`
  (pages HTML, images, feuilles de style). C'est tout ce qu'il faut pour le mettre en ligne.
- **Le code source** : le dépôt `{{slug}}-site/` avec un `README.md` (pour un développeur, ou pour vous
  plus tard : les textes sont dans un seul fichier, `sites/{{slug}}/site.config.ts`).
- **Votre nom de domaine** : il est déjà à votre nom chez OVHcloud, payé jusqu'au {{date_expiration}}.
  Le **code de transfert** (authinfo) vous a été remis : il sert seulement si vous voulez changer de
  fournisseur. Sinon, rien à faire.
- **L'export de votre zone DNS** (`{{domaine}}-dns.txt`) : la liste des réglages techniques du domaine,
  utile au nouvel hébergeur.

## Mettre le site en ligne ailleurs, gratuitement (trois choix)

1. **Cloudflare** (celui que nous utilisions). Créez un compte gratuit sur https://dash.cloudflare.com,
   puis : **Workers & Pages → Create → Upload assets**, donnez un nom, déposez le contenu du dossier
   `dist/{{slug}}/` (glisser-déposer). Dans **Custom domains**, ajoutez votre domaine. Si le domaine est
   géré ailleurs, Cloudflare vous indique deux serveurs de noms à recopier dans votre espace OVHcloud.
2. **Netlify** : https://app.netlify.com/drop, glissez le dossier `dist/{{slug}}/`. Puis **Domain
   management → Add a domain**.
3. **OVHcloud, chez qui est votre domaine** : hébergement web « Perso » (payant, quelques euros par mois),
   puis dépôt des fichiers de `dist/{{slug}}/` par FTP dans le dossier `www`.

Dans les trois cas, le cadenas (HTTPS) est automatique. Comptez dix minutes, plus le temps que le
changement de serveurs de noms se propage (quelques minutes à 24 heures).

## Le formulaire de contact

Le formulaire du site envoyait vos messages par le service de relais e-mail de Cloudflare, sans rien
stocker. Si vous changez d'hébergeur :

- sur Cloudflare, réactivez **Email Routing** sur votre domaine (menu Email) et validez votre adresse de
  réception ; le formulaire repart tel quel ;
- ailleurs, un développeur remplace le relais par un service de formulaires (par exemple Web3Forms,
  gratuit jusqu'à 250 envois par mois) en modifiant une ligne de `site.config.ts` (`form.provider`).

En attendant, les visiteurs ont toujours votre téléphone et votre adresse e-mail sur le site.

## Modifier les textes plus tard

Tout est dans `sites/{{slug}}/site.config.ts` : horaires, services, avis, textes. Un développeur, ou vous
avec un peu de temps, change une ligne, lance `npm install` puis `npm run build`, et redépose le nouveau
dossier `dist/{{slug}}/` chez l'hébergeur. Le `README.md` du dépôt le détaille.

## Les photos

Les photos sont à vous (vous nous les aviez fournies). Elles sont dans `sites/{{slug}}/public/images/`,
déjà réduites pour le web ; les originaux sont ceux que vous nous aviez envoyés.

---

Finck & Fisch, [e-mail], [téléphone] : tant que nous sommes là, nous répondons aux questions sur cette fiche.
