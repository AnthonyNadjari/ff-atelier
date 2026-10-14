---
name: nouvelle-direction
description: Ajoute une direction visuelle (personnalité complète : polices, palette, rayons, textures) à la bibliothèque, avec meta, doc, presets et tests, quand un client demande une ambiance qu'aucune des directions existantes ne couvre.
---

# Nouvelle direction

Quand l'utiliser : le brief décrit une ambiance qui ne correspond à aucune des directions existantes (`ls src/directions`)
(`ff modeles` et `docs/DIRECTIONS.md` les listent). Exemples : « esprit bord de mer breton »,
« cabinet médical apaisant », « street food fluo ». Une direction sert tous les futurs sites.

Si seul l'accent ou la police diffère, ne crée pas de direction : utilise `accent` et `typography`
dans le config du client.

## Étapes

1. Lis `src/directions/README.md` (contrat), `src/styles/global.css` (liste des tokens dans le bloc
   `:root` de secours) et deux directions proches dans `src/directions/*/index.css`.
2. Choisis un nom court, minuscule, sans accent (`marine`, `cabinet`, `street`). Ajoute-le à
   `DIRECTIONS` dans `src/lib/schema.ts` avec un commentaire d'une ligne.
3. Choisis une paire de polices (titres + texte) dans `src/lib/fonts.ts` **qu'aucune direction
   n'utilise déjà** (le test des directions le vérifie). Si une police manque : `npm install
   @fontsource-variable/<nom>` puis ajoute-la au catalogue `fonts.ts`.
4. Écris `src/directions/<nom>/index.css` : imports `@fontsource`, puis sous
   `[data-direction='<nom>']` **tous** les tokens (`--bg`, `--bg-2`, `--surface`, `--fg`, `--muted`,
   `--line`, `--accent` dérivé de `--accent-h/s/l` avec valeurs par défaut, `--accent-2`,
   `--on-accent`, `--ink`, `--on-ink`, `--font-display`, `--font-body`, `--font-mono`,
   `--display-weight`, `--display-tracking`, `--heading-transform`, `--radius`, `--radius-card`,
   `--shadow-card`, `--shadow-lift`, éventuellement `--motion-duration`, `--section-y`).
   Direction sombre ⇒ `color-scheme: dark`. Style optionnel de `.btn`, `.btn-primary`, `.btn-ghost`,
   `.card`, `.rule`, `.eyebrow`, `h1 em`, `body::before` (texture). Jamais de sélecteur de section.
5. Écris `src/directions/<nom>/meta.ts` (même forme que `src/directions/luxe/meta.ts` : nom,
   ambiance, metiers, motionParDefaut, eviter). Optionnel : `script.ts` exportant
   `default function init(root: HTMLElement)` pour un effet propre (curseur, grain animé).
6. Ajoute la ligne dans le tableau des directions de `docs/DIRECTIONS.md`.
7. Crée deux modèles `presets/<nom>-<qualificatif>.json` (format dans `presets/README.md`), avec des
   heros et services différents entre eux, puis `node scripts/ff.mjs vignettes <nom>-... `.
8. Vérifie : `node scripts/ff.mjs matrice --rapide` (build de chaque direction),
   `npm test` (tokens complets, paire de polices unique, contraste clair/sombre, 2 presets par
   direction), puis captures d'un site test en `look.json` avec cette direction, en desktop et mobile.

## Résultat attendu

Un commit : `index.css`, `meta.ts`, entrée `DIRECTIONS`, ligne de doc, deux presets et leurs
vignettes. Résumé : l'ambiance en une phrase et les métiers visés.
