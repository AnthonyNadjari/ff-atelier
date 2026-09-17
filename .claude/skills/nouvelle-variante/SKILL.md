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

## Porter depuis une source externe

Quand la composition s'inspire d'une bibliothèque/collection open source (HyperUI, Aceternity UI,
Astroship, Tailblocks...) plutôt que d'être inventée de zéro, cette procédure s'insère **avant**
l'étape 1 ci-dessous (détail complet et sources : `docs/veille/composants.md` § 5).

**Règles de licence — à vérifier à la source, maintenant, pas seulement d'après ce résumé** (les prix
et licences changent) :
- **MIT / CC BY / permissive, stack HTML+Tailwind ou Astro+Tailwind** → le HTML/CSS de la source peut
  servir de brouillon, à retokeniser immédiatement (couleurs/classes en dur de la source remplacées
  par `bg-bg`/`text-fg`/`bg-accent`/`rounded-card`... avant tout commit).
- **GPL/copyleft, plateforme à licence restrictive (Webflow, Framer, Figma payant), ou stack
  React/Vue/Lit** → **ne jamais copier le code**. Observer uniquement la composition visuelle (rythme,
  hiérarchie, proportions) et réécrire entièrement à la main en Astro/Tailwind — c'est aussi ce
  qu'exige la contrainte « pas de React » du projet.
- Ne jamais committer d'assets de la source (images, icônes, textes protégés) : recréer la structure,
  contenu propre du client uniquement.

**Les 14 étapes** (1-2 précèdent la procédure normale, 3-13 recoupent les étapes 1-8 ci-dessous en les
enrichissant, 14 est une règle transversale) :

1. Vérifier la licence à la source au moment du portage (pas se fier à une note ancienne).
2. Décider : code copiable (retokenisé) ou composition à redessiner à la main (voir règles ci-dessus).
3. Vérifier qu'aucune variante existante ne couvre déjà le besoin (`VARIANTS`, `src/lib/schema.ts`).
4. Lire `docs/CONVENTIONS.md` et deux variantes existantes du même type (étape 1 ci-dessous).
5. Choisir un nom kebab-case explicite, vérifier qu'il n'existe pas déjà (étape 2 ci-dessous).
6. Écrire `src/sections/<Type>/<nom>.astro` en respectant toutes les règles de `CONVENTIONS.md` —
   **jamais coller les couleurs/polices/rayons de la source**, toujours les tokens (étape 3 ci-dessous).
7. Si l'effet a besoin d'un nouvel attribut d'animation (`data-spotlight`, `data-border-beam`...),
   le documenter en tête de `src/scripts/motion.ts` et dans `global.css` avant de l'utiliser, après
   avoir vérifié qu'aucun des 8 attributs existants ne suffit déjà.
8. Ajouter le nom dans `VARIANTS.<type>` (étape 4 ci-dessous).
9. Ajouter une ligne dans `docs/DIRECTIONS.md` (étape 5 ci-dessous).
10. Vérifier avec `sites/_test-variante` + captures desktop/mobile + une direction sombre (étape 6).
11. `npm test` vert (étape 7).
12. Ajouter aux `presets/` si la variante mérite d'être proposée d'office (étape 8).
13. **Documenter la source dans le commit** : nom de la collection, URL, licence, date de consultation
    — en plus du résumé « ce que la variante apporte » attendu par ce fichier.
14. Ne jamais committer d'assets de la source (rappel de la règle ci-dessus).

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
