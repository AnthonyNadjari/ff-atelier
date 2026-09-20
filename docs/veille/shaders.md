# Veille — « shaders » (shaders.com) et fonds GPU dans nos heros

Contexte (20 sept. 2026) : le fondateur voit passer « shaders » dans des reels. Faits vérifiés par WebFetch
sur https://shaders.com, /docs, /license, /pricing et le registre npm (`registry.npmjs.org/shaders`).

**Ce que c'est.** Le paquet npm `shaders` (« Declarative shader components », v2.0.654) de Shader Effects,
Inc. : des composants React/Vue/Svelte/Solid/JS (`<Aurora>`, `<LinearGradient>`, `<Plasma>`…) plus des
filtres (`Blur`, `Glass`, `Glow`) qui rendent dans un canvas **WebGPU uniquement** (« compiles everything
down to WebGPU », aucun repli WebGL : « on the rare device that doesn't support it, the canvas simply stays
empty »). Dépendance `three ^0.177` ; **18,1 Mo décompressés** sur npm. Un éditeur en ligne exporte du code,
un serveur MCP (`https://shaders.com/mcp`) sert les presets aux agents IA.

**Offre.** Free 0 $ : éditeur et aperçu, **usage non commercial seulement** (licence propriétaire v1.7 :
interdit d'exporter du code « in a commercial or production context » sans licence). Core 59 $/an : export
de code, MCP, licence commerciale. Pro 199 $/an : 750+ presets, 55+ sections, support prioritaire.
Pas open source (pas de MIT/Apache) : « exclusive intellectual property of Shader Effects, Inc. ».

**Pourquoi on ne l'adopte pas maintenant.**
1. WebGPU sans repli : nos clients sont des artisans dont les visiteurs sont sur des Android bas de gamme
   et d'anciens iPhone ; un hero dont le fond « reste vide » sur une partie du trafic n'est pas livrable.
2. Poids : three.js + React (le repo est Astro sans React, `CONVENTIONS.md` § Stack) contre notre budget
   `js-initial ≤ 40 Ko` et `ogl` déjà en dépendance (~60 Ko en chunk paresseux, partagé avec `data-hover-distort`).
3. Licence commerciale par siège et code propriétaire non modifiable, à réexporter à chaque client livré.

**Ce qu'on a fait à la place.** `data-shader="mesh|silk|aurora|grain-gradient"` dans le moteur
(`src/scripts/shader.ts`, chargé par `import()`) : fragment shaders WebGL 1/2 maison via `ogl`, couleurs lues
dans les tokens de la direction, lent (20-40 s), pause hors écran, DPR ≤ 1,5, repli dégradé CSS sous
`prefers-reduced-motion` ou sans WebGL. Détails : `docs/ANIMATIONS.md`. Registre : conseil, santé, studios,
tech, heros sans photo — jamais urgence ni artisanat chaleureux (`docs/ANIMATION-PAR-METIER.md` § 1e).
À revoir si WebGPU dépasse ~95 % du trafic mobile réel de nos sites (Plausible), pas avant.
