---
name: nouvelle-variante
description: Ajoute une variante de section partagée (hero, services, proof...) à la bibliothèque, avec enregistrement dans VARIANTS, doc et tests, quand un brief demande une composition qui n'existe pas encore.
---

# Nouvelle variante de section

Quand l'utiliser : un brief ou une demande client décrit une composition qu'aucune variante existante
ne couvre (ex : « un hero avec le numéro en très grand et une photo ronde », « services en carrousel »).
Une variante sert tous les futurs sites : elle doit être générique, lire uniquement `site`, et rester
belle dans les 16 directions.

Si la demande est unique à un client (menu du restaurant, carte des zones dessinée, manifeste),
ne crée PAS une variante : crée une section sur mesure dans `sites/<slug>/sections/<Nom>.astro`
et référence-la dans le layout par `{ type: 'custom', variant: '<nom>', label: '...' }`.

## Étapes

1. Lis `docs/CONVENTIONS.md` (règles des sections) et deux variantes existantes du même type dans
   `src/sections/<Type>/` pour reprendre leur structure (frontmatter, id, tokens, `data-reveal`).
2. Choisis un nom kebab-case explicite (`hero/portrait-rond`, `services/carrousel`). Vérifie qu'il
   n'existe pas dans `VARIANTS` (`src/lib/schema.ts`).
3. Écris `src/sections/<Type>/<nom>.astro` :
   - `import { site, ... } from '@/lib/site'`, aucune prop ;
   - racine `<section id="<type>" class="section-y ...">` (hero : `id="hero"`) ;
   - tokens uniquement (`bg-bg`, `text-fg`, `text-accent`, `rounded-card`...), jamais de couleur,
     police ou rayon en dur ;
   - aucune donnée inventée : si la donnée manque, la section s'adapte ou ne rend rien ;
   - textes d'interface en français, `&nbsp;` avant `?` et `!` ;
   - mobile d'abord ; animations via `data-reveal` / `data-stagger` / `data-parallax` / `data-split`.
4. Ajoute le nom dans `VARIANTS.<type>` (`src/lib/schema.ts`).
5. Ajoute une ligne dans le tableau de la section correspondante de `docs/DIRECTIONS.md`
   (variante + quand l'utiliser).
6. Vérifie : copie `sites/_exemple` en `sites/_test-variante` (slug `_test-variante`), mets la
   variante dans le layout, `node scripts/ff.mjs build _test-variante`, puis
   `node scripts/ff.mjs captures _test-variante` et regarde `captures/_test-variante-desktop.png`
   et `-mobile.png`. Teste aussi avec une direction sombre (`luxe` ou `neon`) via
   `look.json` dans la copie. Supprime la copie et son dist.
7. `npm test` doit rester vert (le test des sections vérifie fichier ⇔ VARIANTS, tokens, id).
8. Si la variante mérite d'être proposée d'office, ajoute-la à un ou deux modèles dans `presets/`
   et régénère leurs vignettes : `node scripts/ff.mjs vignettes <nom-du-modele> --forcer`.

## Résultat attendu

Un commit contenant : le fichier `.astro`, l'entrée `VARIANTS`, la ligne de doc, éventuellement les
presets modifiés. Résumé en une phrase : ce que la variante apporte que les autres n'ont pas.
