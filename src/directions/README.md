# Directions

Une direction = une personnalite visuelle complete. Choisie par son nom dans `site.config.ts` (`direction: 'luxe'`).

## Contrat

Chaque dossier `src/directions/<nom>/` contient :

- `index.css` — **obligatoire**. Importe ses polices (`@import '@fontsource-variable/...'`) et definit **tous** les tokens
  listes dans `src/styles/global.css` sous le selecteur `[data-direction='<nom>']`. Peut ajouter des styles globaux
  propres a la direction (texture de fond, style des boutons, des cartes, des filets) en les prefixant du meme selecteur.
- `meta.ts` — **obligatoire**. `export default { nom, ambiance, metiers: [...], motionParDefaut, eviter: [...] }` :
  sert au choix automatique de direction et a la doc.
- `script.ts` — optionnel. Effets propres a la direction (curseur lumineux, grain anime). Charge seulement si
  `motion !== 'none'`. Doit exporter `default function init(root: HTMLElement)`.

## Regles

1. Une direction ne connait pas les sections. Elle stylise des tokens et des classes generiques
   (`.btn`, `.card`, `.rule`, `.eyebrow`), jamais `#hero` ou `.services-grid`.
2. Les tokens `--accent-h/s/l` peuvent etre surcharges par `site.config.ts` (`accent: {h,s,l}`) : la direction
   doit donc deriver `--accent` de ces trois variables avec des valeurs par defaut, jamais une couleur en dur.
3. Contraste AA minimum entre `--fg` et `--bg`, `--on-accent` et `--accent`.
4. Une direction sombre pose `color-scheme: dark`.
5. Deux directions ne partagent jamais la meme paire de polices.
