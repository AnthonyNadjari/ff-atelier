# Conventions — ff-atelier

Lis ceci avant d'ecrire une section ou une direction. Les fichiers de reference sont la loi.

## Stack
Astro 5 (statique, zero JS par defaut) + Tailwind 4 (config CSS-first, `src/styles/global.css`) + zod. Pas de React. Pas de dependance supplementaire sans raison forte.

## Fichiers de reference (copier leur style)
- Schema du contenu : `src/lib/schema.ts` — tout ce qu'une section peut afficher est la. Ne rien inventer d'autre.
- Helpers : `src/lib/site.ts` (`site`, `tel()`, `mailto()`, `whatsapp()`, `fullAddress()`, `yearsSince()`, `paragraphs()`, `navLinks()`).
- Tokens et utilitaires : `src/styles/global.css` (classes `bg-bg`, `bg-bg-2`, `bg-surface`, `text-fg`, `text-muted`, `border-line`, `bg-accent`, `text-on-accent`, `bg-ink`, `text-on-ink`, `font-display`, `font-mono`, `rounded-ui`, `rounded-card`, `shadow-card`, `shadow-lift`, `container-ff`, `section-y`, `eyebrow`, `text-display-xl/lg/md/sm`).
- Section de reference : `src/sections/Hero/split.astro`, `src/sections/Services/grid.astro`, `src/sections/Contact/form-split.astro`.
- Composants partages : `src/components/Button.astro`, `SectionHeading.astro`, `Icon.astro` (lucide par nom), `ContactForm.astro`.
- Direction de reference : `src/directions/atelier/index.css` + `meta.ts`, contrat dans `src/directions/README.md`.
- Animation : attributs `data-reveal`, `data-stagger`, `data-parallax`, `data-counter`, `data-split`, `data-marquee`, `data-magnetic`, `data-tilt` (doc en tete de `src/scripts/motion.ts` et dans `global.css`).

## Regles des sections
1. Fichier : `src/sections/<Type>/<variante>.astro`, variante en kebab-case, exactement le nom liste dans `VARIANTS` (`src/lib/schema.ts`).
2. Frontmatter : `import { site, ... } from '@/lib/site'`. Aucune prop : une section lit `site` directement.
3. Racine : `<section id="<type>" class="section-y ...">` (id = `services`, `about`, `proof`, `zones`, `process`, `faq`, `contact` ; le hero a `id="hero"`, la nav n'a pas d'id, le footer est `<footer>`). Un seul id par type, meme si deux variantes du meme type sont dans le layout (dans ce cas la seconde n'a pas d'id : utiliser `id={Astro.props.id ?? 'proof'}`... non : garder simple, une variante par type dans un layout).
4. **Jamais de couleur, police ou rayon en dur.** Uniquement les tokens. Une section doit etre belle dans les 8 directions sans les connaitre.
5. **Jamais de donnee inventee.** Pas de "+500 clients", pas d'avis fictifs, pas de "100 % satisfaits". Si `site.proof.google` est absent, la section proof/google rend `null` (frontmatter : `if (!site.proof.google) return;` n'existe pas en Astro — encadrer tout le markup dans `{site.proof.google && (...)}` ou rendre un fragment vide).
6. Donnee absente = section qui s'adapte : pas de placeholder gris, pas de "Lorem ipsum". Image absente = composition sans image (voir hero/split).
7. Accessibilite : `alt` obligatoire, contrastes via tokens, focus visible herite, `aria-label` sur les boutons icones, `<details>/<summary>` natifs pour les accordeons.
8. Mobile d'abord. Tester mentalement a 375 px : rien ne deborde, grilles qui s'empilent, texte `text-display-*` (deja fluide).
9. Animations : declaratives via `data-*`. Un `<script>` Astro seulement si l'interaction l'exige (menu, onglets, avant/apres). Pas de GSAP direct dans une section : `motion.ts` s'en charge via `data-parallax`, `data-tilt`, `data-magnetic`.
10. Textes d'interface en francais, avec accents et espaces insecables avant `:` `?` `!` (`&nbsp;`).
11. Liens telephone : `href={tel()}`, affichage `site.contact.phoneDisplay`. Devis : `href="#contact"`. Page service : `/services/${s.slug}`.
12. Le `<em>` dans `business.tagline` et les titres est un accent typographique (la direction le stylise). Utiliser `set:html` pour les titres venant de la config.

## Regles des directions
Voir `src/directions/README.md`. Une direction doit definir tous les tokens, importer ses polices via `@fontsource-variable/*` (deja installees : fraunces, inter, space-grotesk, cormorant, playfair-display, manrope, unbounded, syne, lora, nunito, archivo, dm-sans, jetbrains-mono, instrument-sans, outfit, bricolage-grotesque ; statiques : `@fontsource/archivo-black`, `@fontsource/instrument-serif`). Elle peut styliser `.btn`, `.btn-primary`, `.btn-ghost`, `.card`, `.rule`, `.eyebrow`, `h1 em`, `body::before` (texture), `::selection`.

## Verification
`SITE=_exemple node node_modules/astro/astro.js build` doit passer. Pour tester une variante, modifier temporairement `sites/_exemple/site.config.ts` (layout) puis remettre.
