# Conventions — ff-atelier

Lis ceci avant d'ecrire une section ou une direction. Les fichiers de reference sont la loi.

## Stack
Astro 5 (statique, zero JS par defaut) + Tailwind 4 (config CSS-first, `src/styles/global.css`) + zod. Pas de React. Pas de dependance supplementaire sans raison forte.

## Fichiers de reference (copier leur style)
- Schema du contenu : `src/lib/schema.ts` — tout ce qu'une section peut afficher est la. Ne rien inventer d'autre.
- Helpers : `src/lib/site.ts` (`site`, `tel()`, `mailto()`, `whatsapp()`, `fullAddress()`, `yearsSince()`, `paragraphs()`, `navLinks()`).
- Tokens et utilitaires : `src/styles/global.css` (classes `bg-bg`, `bg-bg-2`, `bg-surface`, `text-fg`, `text-muted`, `border-line`, `bg-accent`, `text-on-accent`, `bg-ink`, `text-on-ink`, `font-display`, `font-mono`, `rounded-ui`, `rounded-card`, `shadow-card`, `shadow-lift`, `container-ff`, `section-y`, `eyebrow`, `text-display-xl/lg/md/sm`).
- Section de reference : `src/sections/Hero/split.astro`, `src/sections/Services/grid.astro`, `src/sections/Contact/form-split.astro`.
- Composants partages : `src/components/Button.astro`, `SectionHeading.astro`, `Icon.astro` (lucide par nom), `ContactForm.astro`, `Img.astro` (image AVIF/WebP + LQIP, voir § Images ci-dessous).
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
13. **Eyebrow rationne.** Le petit label en capitales espacees au-dessus de chaque titre est le tell « genere par IA » le plus cite (Impeccable le bannit, taste-skill le tolere sur une section sur trois — voir `docs/veille/skills-design-ia.md` §2). Chez nous : au plus **une section sur deux** avec eyebrow, hero compris (`hero-eyebrow-chip` dans `ff detect`), **40 caracteres maximum** (« Boulangerie · Lyon », pas « Boulangerie-patisserie · Croix-Rousse, Lyon · depuis 1987 » — la ville et la date ont leur place dans le texte), et jamais deux eyebrows qui repetent la meme information. Alternatives qui ne crient pas « template » : un numero (`01`), un filet seul, un mot en italique display, rien.
14. **Texte accent lisible.** `text-accent` sur du texte courant ou petit doit tenir 4,5:1 contre le fond de la direction (3:1 seulement au-dela de 24 px). L'accent pur (`--accent`) sert aux fonds, filets et gros titres ; pour le texte, utiliser le token de texte accent contraste (`--color-accent-text`, derive automatiquement de `accent` et du fond de la direction) ou ajuster `accent.l` du site (fond clair : l <= 40 ; fond sombre : l >= 60). `ff detect` echoue sur ce point, `:hover` compris.
15. **Plancher 11 px.** Aucun texte fonctionnel (lien, nav, badge, horaire, legende, mention carte) sous `0.6875rem` (11 px), quelle que soit l'echelle (`scale`). `text-[0.6rem]`/`text-[0.65rem]` sont interdits ; `text-xs` a un plancher dans `global.css`. Seul le smallprint legal non interactif descend a 10 px.
16. **Un seul feu d'artifice.** Un marquee, un canvas, une sequence d'images ou un effet riche par page — jamais deux bandes defilantes. Un `data-stagger` sur une longue liste garde un delai total plafonne (le moteur coupe a ~600 ms), une sortie est toujours plus rapide que l'entree.
17. **Coherence des rayons et des ombres.** Une seule echelle de rayon par site (tout carre / tout doux / tout pilule sur l'interactif — c'est la direction qui la fixe via `--radius-*`), et jamais bordure fine + grande ombre diffuse sur le meme element : un bord net **ou** une elevation douce.
18. **Polices trop vues.** Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk, Instrument Serif sont les valeurs par defaut de tous les generateurs. Elles restent dans `fonts.ts`, mais `ff composer` et `/nouveau-site` doivent d'abord chercher ailleurs (63 polices) ; deux sites voisins ne partagent jamais le meme couple display/body.

## Regles des directions
Voir `src/directions/README.md`. Une direction doit definir tous les tokens, importer ses polices via `@fontsource-variable/*` (deja installees : fraunces, inter, space-grotesk, cormorant, playfair-display, manrope, unbounded, syne, lora, nunito, archivo, dm-sans, jetbrains-mono, instrument-sans, outfit, bricolage-grotesque ; statiques : `@fontsource/archivo-black`, `@fontsource/instrument-serif`). Elle peut styliser `.btn`, `.btn-primary`, `.btn-ghost`, `.card`, `.rule`, `.eyebrow`, `h1 em`, `body::before` (texture), `::selection`.

## Images

`ff images <slug>` (`scripts/ff/images.mjs`) genere, pour chaque photo de `sites/<slug>/raw/` (ou,
`--depuis-public`, chaque `.webp` deja present dans `sites/<slug>/public/images/`), une variante AVIF
(qualite 60) et WebP (qualite 80) aux largeurs 480/800/1200/1600 (bornees a la largeur d'origine, sans
agrandissement), plus un LQIP (miniature 16px floutee, encodee en data URI). Tout est ecrit dans
`sites/<slug>/public/images/` — la plus grande largeur generee garde le nom habituel sans suffixe
(`hero.webp`, compatible avec l'existant), les autres sont suffixees par leur largeur (`hero-800.webp`).
Un manifeste `sites/<slug>/images.json` (`{ "<nom>": { widths, formats, ratio, lqip } }`) est ecrit a
cote, lu au build par `src/components/Img.astro` via `import.meta.glob`.

**Toujours utiliser `<Img>` pour une photo referencee depuis `site.config.ts`** (`images.hero`,
`services[].image`, `about.portrait`, `proof.gallery`...), jamais un `<img>` brut, dans une section
partagee (`src/sections/**`) ou une page (`src/pages/**`) :

```astro
import Img from '@/components/Img.astro';
---
<Img src={hero.src} alt={hero.alt} class="absolute inset-0 h-full w-full object-cover" sizes="100vw" loading="eager" fetchpriority="high" />
```

Props : `src` (chemin public, ex. `/images/hero.webp`), `alt` (obligatoire), `sizes` (defaut `100vw` —
a affiner pour les grilles, ex. `"(min-width: 1024px) 33vw, 100vw"`), `class`, `loading` (`eager`
seulement pour l'image du premier ecran), `priority` (raccourci qui pose `loading="eager"` +
`fetchpriority="high"`). Tout autre attribut (`data-parallax`, `fetchpriority`...) passe tel quel a la
balise `<img>` finale. Si `src` n'a pas d'entree dans `images.json` (image non passee par `ff images`,
logo non traite, placeholder), `<Img>` retombe automatiquement sur un `<img>` simple — aucune casse.

**Les sections sur mesure (`sites/<slug>/sections/*.astro`) ne sont pas migrees** : elles restent
libres d'utiliser un `<img>` brut (le designer du site en a la charge), mais peuvent tout aussi bien
importer `@/components/Img.astro` si l'image vient de `public/images/` et beneficie d'un manifeste.

## Coquilles

`src/shells/<nom>.astro` (`layout.shell`, voir `docs/DIRECTIONS.md` § Disposition) recoit les memes
composants deja resolus (`Nav`, `Hero`, `Footer`, `sections`) et decide seulement ou ils vont sur la
page. **Une coquille ne restyle jamais une section** : pas de couleur, pas de typographie, pas de
props forcees sur `<Component />` — elle peut repositionner (grille, panneau fixe, plein ecran) et,
au plus, poser `--container` ou une marge sur le conteneur autour d'une section. Le contenu visuel
d'une section reste sous le controle de sa propre variante, quelle que soit la coquille qui l'entoure.

## Verification
`SITE=_exemple node node_modules/astro/astro.js build` doit passer. Pour tester une variante, modifier temporairement `sites/_exemple/site.config.ts` (layout) puis remettre.

## Sections sur mesure (propres à un site)

Quand un client a besoin d'un bloc unique (menu, manifeste, carte dessinée, grille tarifaire), on ne
crée pas une variante partagée : on écrit `sites/<slug>/sections/<Nom>.astro` et on l'appelle dans le
layout par `{ type: 'custom', variant: '<nom>', label: 'Libellé nav' }` (`label` absent = pas
d'ancre). Mêmes règles que les sections partagées (tokens, `site`, `data-reveal`), `id` = nom en
minuscules. Le fichier voyage avec le site à l'export, jamais dans `src/`. Exemple :
`sites/finck-fisch/sections/Manifeste.astro`. Pour faire grandir la bibliothèque partagée :
compétences `/nouvelle-variante` et `/nouvelle-direction`.
