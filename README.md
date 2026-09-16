# ff-atelier

Outil de production de sites vitrines pour artisans, par Finck & Fisch. Un projet Astro unique,
plusieurs sites clients (`sites/<slug>/`), une seule source de vérité par site
(`site.config.ts`, validé par zod).

Deux personnes : une vend et brief le client (pas développeuse), l'autre construit. Ce dépôt est fait
pour que le passage de l'appel client au site en ligne tienne en une poignée de commandes.

## Installation

```bash
npm install
```

Copie `.env.example` en `.env` et renseigne :
- `ANTHROPIC_API_KEY` — pour `node scripts/ff-generer.mjs` (génération de site sans Claude Code).
- `CLOUDFLARE_API_TOKEN` / `CLOUDFLARE_ACCOUNT_ID` — pour `ff deploy`.

## Le chemin en 2 heures, de l'appel au site en ligne

1. **Appel client (15 min).** Suis `docs/BRIEF.md` pendant l'appel — c'est le questionnaire, dans
   l'ordre. Remplis-le au fil de la conversation.
2. **Range le brief.**
   ```bash
   node scripts/ff.mjs nouveau <slug>
   cp docs/BRIEF.md sites/<slug>/brief.md   # puis remplis-le avec les réponses du client
   ```
3. **Dépose les photos** reçues du client dans `sites/<slug>/public/images/`, puis :
   ```bash
   node scripts/ff.mjs images <slug>
   ```
4. **Génère le site.** Deux façons, même résultat :
   - Dans Claude Code : `/nouveau-site <slug>`
   - En automatique : `node scripts/ff-generer.mjs <slug>`

   Les deux lisent le brief, choisissent une direction et des variantes (`docs/DIRECTIONS.md`),
   rédigent tous les textes en français et écrivent `sites/<slug>/site.config.ts`, puis buildent.
5. **Regarde le rendu.**
   ```bash
   node scripts/ff.mjs dev <slug>
   ```
6. **Vérifie avant de livrer.**
   ```bash
   node scripts/ff.mjs verifier <slug>
   ```
7. **Déploie et livre.**
   ```bash
   node scripts/ff.mjs deploy <slug>
   node scripts/ff.mjs exporter <slug>
   ```
   Voir `docs/PROCESS.md` pour la suite (appel de restitution, fenêtre de corrections, remise du
   domaine et du dépôt au nom du client).

## Commandes

Toutes passent par `scripts/ff.mjs <commande> [slug]` (alias npm : `npm run ff -- <commande>`).

| Commande | Rôle |
|---|---|
| `nouveau <slug>` | Crée `sites/<slug>/` depuis `sites/_exemple/`. |
| `dev <slug>` | Serveur de développement local. |
| `build <slug>` | Build statique dans `dist/<slug>`. |
| `preview <slug>` | Prévisualise le build. |
| `verifier <slug>` | Contrôle qualité avant livraison. |
| `variete` | Liste les combinaisons direction/variantes déjà utilisées, pour ne pas répéter deux clients. |
| `images <slug>` | Optimise les photos du client. |
| `deploy <slug>` | Déploie le site en ligne. |
| `exporter <slug>` | Prépare la livraison finale (repo + domaine au nom du client). |

Génération de contenu : `/nouveau-site <slug>` (Claude Code) ou `node scripts/ff-generer.mjs <slug>`
(API Anthropic directe, sans Claude Code).

## Carte du dépôt

```
sites/<slug>/site.config.ts     contenu du client (source de vérité, validé par zod)
sites/<slug>/brief.md           brief rempli pendant l'appel
sites/<slug>/public/images/     photos du client
sites/_exemple/                 référence de schéma — ne pas modifier pour un client
src/lib/schema.ts               schéma zod complet : DIRECTIONS, VARIANTS, tous les champs
src/lib/site.ts                 site courant + helpers partagés
src/sections/<Type>/<variante>.astro   une section, une variante, un fichier
src/directions/<nom>/           une personnalité visuelle (tokens CSS + métadonnées)
scripts/ff.mjs                  CLI (dev/build/preview/nouveau/verifier/variete/images/deploy/exporter)
scripts/ff-generer.mjs          génération de site.config.ts via l'API Anthropic, sans Claude Code
.claude/skills/nouveau-site/    compétence /nouveau-site pour Claude Code
docs/BRIEF.md                   questionnaire client
docs/DIRECTIONS.md              guide de choix de direction et de variantes
docs/CONVENTIONS.md             règles de code des sections et des directions
docs/PROCESS.md                 processus client complet, prospection → livraison
```

## Documentation

- [`docs/BRIEF.md`](docs/BRIEF.md) — questionnaire à remplir pendant l'appel client.
- [`docs/DIRECTIONS.md`](docs/DIRECTIONS.md) — quelle direction et quelles variantes pour quel client.
- [`docs/CONVENTIONS.md`](docs/CONVENTIONS.md) — règles de code (sections, directions, tokens).
- [`docs/PROCESS.md`](docs/PROCESS.md) — processus complet, de la prospection à la livraison.
- [`docs/DEPLOIEMENT.md`](docs/DEPLOIEMENT.md) — déploiement technique (Cloudflare Pages), domaine, remise au client.
- [`CLAUDE.md`](CLAUDE.md) — instructions pour les sessions Claude Code dans ce dépôt.
