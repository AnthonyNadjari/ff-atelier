# Les commandes ff — une page

Exemple utilisé partout ci-dessous : le site `boulangerie-durand`.

## 1. Les 6 commandes du quotidien

| # | Commande | Ce qu'elle fait | Ce qu'on regarde après |
|---|---|---|---|
| 1 | `ff nouveau boulangerie-durand` | Crée `sites/boulangerie-durand/` à partir du modèle, prêt pour le brief. | Le dossier existe, `brief.md` est là à remplir. |
| 2 | `/nouveau-site boulangerie-durand` | Claude Code lit le brief, choisit direction/variantes, rédige les textes et écrit `site.config.ts`. | Le site s'est généré sans erreur. |
| 3 | `ff build boulangerie-durand` | Construit le site dans `dist/boulangerie-durand`. | La commande se termine sans erreur rouge. |
| 4 | `ff verifier boulangerie-durand` | Build + contrôles SEO/contenu, checklist ✓/✗. | Tout est vert avant d'aller plus loin. |
| 5 | `ff dev boulangerie-durand` | Lance le site en local pour le relire comme un client le lirait. | Chaque texte sonne juste, aucun placeholder oublié. |
| 6 | `ff deploy boulangerie-durand` | Build puis mise en ligne sur Cloudflare Pages. | L'URL donnée par la commande s'ouvre bien. |

## 2. Un chantier client, du premier appel à la mise en ligne

```
ff nouveau boulangerie-durand
# tu remplis sites/boulangerie-durand/brief.md avec les réponses de l'appel client

# tu envoies devis + CGV, tu attends signature + acompte
# (jamais de production avant — voir docs/PROCESS.md §9)

# tu déposes les photos reçues dans sites/boulangerie-durand/public/images/
ff images boulangerie-durand

ff propositions boulangerie-durand
# tu envoies les 3 propositions au client, il choisit

ff propositions boulangerie-durand --appliquer 2
ff figer boulangerie-durand
/nouveau-site boulangerie-durand
ff dev boulangerie-durand
# tu relis chaque texte comme le client le lirait, tu corriges à la main si besoin

ff verifier boulangerie-durand
ff lighthouse boulangerie-durand

# appel de restitution : tu montres le site, tu notes les retours (2 semaines de corrections)

ff deploy boulangerie-durand
ff domaine boulangerie-durand boulangerie-durand.fr --email-vers contact@boulangerie-durand.fr
ff exporter boulangerie-durand
# tu remets l'accès au dépôt + le domaine, au nom du client

# tu ajoutes "boulangerie-durand" à sites-en-ligne.json (suivi hebdomadaire automatique)
ff sante boulangerie-durand
```

## 3. Quand quelque chose cloche

| Symptôme | Commande |
|---|---|
| Le site est moche en mobile | `ff studio boulangerie-durand` |
| Une animation ne part pas | `ff audit-motion boulangerie-durand` |
| C'est lent | `ff perf boulangerie-durand` |
| `ff perf` échoue sur la catégorie "fonts" | Changer la paire de polices dans `ff studio boulangerie-durand` (onglet Typographie) ou revenir en arrière dans `site.config.ts` — le choix automatique de `ff composer`/`ff propositions` ne regarde pas le budget de perf. |
| Le client dit que la page est cassée en ligne | `ff sante boulangerie-durand` |

## 4. Le reste, par besoin

**Images et médias**
- `ff nettoyer-photos boulangerie-durand` — nettoie les photos brutes avant `ff images` (recadrage, balance des blancs).
- `ff photos boulangerie-durand "boulangerie artisanale"` — cherche des photos libres de droit.
- `ff video boulangerie-durand "pétrissage du pain"` — cherche une vidéo libre pour le hero.
- `ff sequence boulangerie-durand video.mp4` — transforme une vidéo en séquence animée au scroll.
- `ff animer boulangerie-durand photo.jpg "..."` — anime une vraie photo du client.
- `ff og boulangerie-durand` — génère l'image affichée quand le site est partagé.

**Look et variantes**
- `ff composer boulangerie-durand` — propose un look automatiquement.
- `ff propositions boulangerie-durand` — génère plusieurs looks à comparer avant de choisir.
- `ff studio boulangerie-durand` — éditeur visuel du look, en local, avec aperçu live.
- `ff figer boulangerie-durand` — fige le look choisi dans `site.config.ts`.
- `ff modeles` — liste les modèles de look tout faits.
- `ff modele boulangerie-durand nom-du-modele` — applique un modèle tout fait.

**Qualité**
- `ff detect boulangerie-durand` — regard automatique (contraste, accessibilité).
- `ff lighthouse boulangerie-durand` — score performance/accessibilité/SEO.
- `ff captures boulangerie-durand --comparer` — repère ce qui a changé visuellement.
- `ff variete` — évite de refaire deux fois le même look qu'un client précédent.
- `ff tous` — reconstruit tous les sites d'un coup, utile après un changement partagé.

**Mise en ligne et suivi**
- `ff domaine boulangerie-durand boulangerie-durand.fr` — branche le nom de domaine du client.
- `ff exporter boulangerie-durand` — prépare le dépôt à remettre au client.
- `ff sante boulangerie-durand` — vérifie que le site déjà en ligne est en bonne santé (à J+1 puis chaque mois).
- `ff archiver boulangerie-durand` — sauvegarde ponctuelle zippée du site.
- `ff liste` — liste tous les sites, leur direction, et si le build existe.

## Piloter l'atelier sans terminal (serveur MCP)

Pour poser les commandes du quotidien en langage naturel dans Claude Code plutôt que de taper
`node scripts/ff.mjs ...` : `claude mcp add ff-atelier -- node scripts/ff-mcp.mjs` (une fois, depuis la
racine du repo). Expose `build`/`verifier`/`composer`/`captures`/`perf`/`liste`/`variete`/`modeles`/
`nouveau`/`aide` comme outils — jamais `deploy`/`domaine`/`ff generer` (une action qui publie ou facture
reste volontairement hors MCP). Détail : `CLAUDE.md` § Workflows en une commande.

## Avant de pouvoir les utiliser

- `ff deploy` et `ff domaine` : `npx wrangler login` (compte Cloudflare) fait une fois sur la machine.
- `/nouveau-site` et `ff generer` : clé `ANTHROPIC_API_KEY` dans `.env`.
- `ff photos`/`ff video` (clés Unsplash/Pexels) et `ff animer` (clé fal.ai) : toutes dans `.env`.
