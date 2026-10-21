# Conventions — ff-atelier

Lis ceci avant d'ecrire une section ou une direction. Les fichiers de reference sont la loi.

## Stack
Astro 5 (statique, zero JS par defaut) + Tailwind 4 (config CSS-first, `src/styles/global.css`) + zod. Pas de React. Pas de dependance supplementaire sans raison forte.

## Fichiers de reference (copier leur style)
- Schema du contenu : `src/lib/schema.ts` — tout ce qu'une section peut afficher est la. Ne rien inventer d'autre.
- Helpers : `src/lib/site.ts` (`site`, `tel()`, `mailto()`, `whatsapp()`, `fullAddress()`, `yearsSince()`, `paragraphs()`, `navLinks()`, `actions()` — portes d'action ordonnées Réserver/Commander/Bon cadeau/Devis/Appeler, module pur `src/lib/actions.ts`, rendues par `src/components/Porte.astro`).
- Tokens et utilitaires : `src/styles/global.css` (classes `bg-bg`, `bg-bg-2`, `bg-surface`, `text-fg`, `text-muted`, `border-line`, `bg-accent`, `text-on-accent`, `bg-ink`, `text-on-ink`, `font-display`, `font-mono`, `rounded-ui`, `rounded-card`, `shadow-card`, `shadow-lift`, `container-ff`, `section-y`, `eyebrow`, `text-display-xl/lg/md/sm`).
- Section de reference : `src/sections/Hero/split.astro`, `src/sections/Services/grid.astro`, `src/sections/Contact/form-split.astro`.
- Composants partages : `src/components/Button.astro`, `SectionHeading.astro`, `Icon.astro` (lucide par nom), `ContactForm.astro`, `Img.astro` (image AVIF/WebP + LQIP, voir § Images ci-dessous).
- Direction de reference : `src/directions/atelier/index.css` + `meta.ts`, contrat dans `src/directions/README.md`.
- Animation : attributs `data-reveal`, `data-stagger`, `data-parallax`, `data-counter`, `data-split`, `data-marquee`, `data-magnetic`, `data-tilt` (doc en tete de `src/scripts/motion.ts` et dans `global.css`).
- Scripts inline : `onPage(fn)` de `src/scripts/page.ts` (re-execution a chaque navigation quand `site.transitions` est actif, voir regle 9 et `docs/ANIMATIONS.md` § Transitions de page).

## Regles des sections
1. Fichier : `src/sections/<Type>/<variante>.astro`, variante en kebab-case, exactement le nom liste dans `VARIANTS` (`src/lib/schema.ts`).
2. Frontmatter : `import { site, ... } from '@/lib/site'`. Aucune prop : une section lit `site` directement.
3. Racine : `<section id="<type>" class="section-y ...">` (id = `services`, `about`, `proof`, `zones`, `process`, `faq`, `contact` ; le hero a `id="hero"`, la nav n'a pas d'id, le footer est `<footer>`). Un seul id par type, meme si deux variantes du meme type sont dans le layout (dans ce cas la seconde n'a pas d'id : utiliser `id={Astro.props.id ?? 'proof'}`... non : garder simple, une variante par type dans un layout).
4. **Jamais de couleur, police ou rayon en dur.** Uniquement les tokens. Une section doit etre belle dans toutes les directions sans les connaitre.
5. **Jamais de donnee inventee.** Pas de "+500 clients", pas d'avis fictifs, pas de "100 % satisfaits". Si `site.proof.google` est absent, la section proof/google rend `null` (frontmatter : `if (!site.proof.google) return;` n'existe pas en Astro — encadrer tout le markup dans `{site.proof.google && (...)}` ou rendre un fragment vide).
6. Donnee absente = section qui s'adapte : pas de placeholder gris, pas de "Lorem ipsum". Image absente = composition sans image (voir hero/split).
7. Accessibilite : `alt` obligatoire, contrastes via tokens, focus visible herite, `aria-label` sur les boutons icones, `<details>/<summary>` natifs pour les accordeons.
8. Mobile d'abord. Tester mentalement a 375 px : rien ne deborde, grilles qui s'empilent, texte `text-display-*` (deja fluide).
9. Animations : declaratives via `data-*`. Un `<script>` Astro seulement si l'interaction l'exige (menu, onglets, avant/apres). Pas de GSAP direct dans une section : `motion.ts` s'en charge via `data-parallax`, `data-tilt`, `data-magnetic`. **Tout script inline enveloppe son corps dans `onPage(() => { ... })`** (`import { onPage } from '@/scripts/page'`) : avec `site.transitions` (ClientRouter) le body est remplace sans rechargement et un script execute une seule fois laisserait les nouveaux elements inertes ; sans transitions, `onPage` appelle directement. Un ecouteur global va sur `document.body` (remplace a chaque page), jamais sur `document`/`window` sans `signal`. `tests/squelettes.test.mjs` refuse un `<script>` de `src/` sans `onPage(`. **Jamais le mot `<script` en chevrons dans un commentaire de frontmatter** (ecrire « balise script » a la place) : le scan de dependances de Vite en dev l'y prend pour une vraie balise, le build a froid echoue et le CSS ne charge plus (fond blanc) — cas reel, Base.astro, 18 sept 2026.
10. Textes d'interface en francais, avec accents et espaces insecables avant `:` `?` `!` (`&nbsp;`).
11. Liens telephone : `href={tel()}`, affichage `site.contact.phoneDisplay`. Devis : `href="#contact"`. Page service : `/services/${s.slug}`. Dans une nav ou une barre d'actions, jamais un bouton telephone code en dur : `actions()` (Reserver, Commander, Bon cadeau, Appeler, Devis — `contact.bookingUrl`/`orderUrl`/`giftCardUrl`, jamais devines) et `<Porte action={...} />`.
12. Le `<em>` dans `business.tagline` et les titres est un accent typographique (la direction le stylise). Utiliser `set:html` pour les titres venant de la config.
13. **Eyebrow rationne.** Le petit label en capitales espacees au-dessus de chaque titre est le tell « genere par IA » le plus cite (Impeccable le bannit, taste-skill le tolere sur une section sur trois — voir `docs/veille/skills-design-ia.md` §2). Chez nous : au plus **une section sur deux** avec eyebrow, hero compris (`hero-eyebrow-chip` dans `ff detect`), **40 caracteres maximum** (« Boulangerie · Lyon », pas « Boulangerie-patisserie · Croix-Rousse, Lyon · depuis 1987 » — la ville et la date ont leur place dans le texte), et jamais deux eyebrows qui repetent la meme information. Alternatives qui ne crient pas « template » : un numero (`01`), un filet seul, un mot en italique display, rien.
14. **Texte accent lisible.** `text-accent` sur du texte courant ou petit doit tenir 4,5:1 contre le fond de la direction (3:1 seulement au-dela de 24 px). L'accent pur (`--accent`) sert aux fonds, filets et gros titres ; pour le texte, utiliser le token de texte accent contraste (`--color-accent-text`, derive automatiquement de `accent` et du fond de la direction) ou ajuster `accent.l` du site (fond clair : l <= 40 ; fond sombre : l >= 60). `ff detect` echoue sur ce point, `:hover` compris.
15. **Plancher 11 px.** Aucun texte fonctionnel (lien, nav, badge, horaire, legende, mention carte) sous `0.6875rem` (11 px), quelle que soit l'echelle (`scale`). `text-[0.6rem]`/`text-[0.65rem]` sont interdits ; `text-xs` a un plancher dans `global.css`. Seul le smallprint legal non interactif descend a 10 px.
16. **Un seul feu d'artifice.** Un marquee, un canvas, une sequence d'images ou un effet riche par page — jamais deux bandes defilantes. Un `data-stagger` sur une longue liste garde un delai total plafonne (le moteur coupe a ~600 ms), une sortie est toujours plus rapide que l'entree.
17. **Coherence des rayons et des ombres.** Une seule echelle de rayon par site (tout carre / tout doux / tout pilule sur l'interactif — c'est la direction qui la fixe via `--radius-*`), et jamais bordure fine + grande ombre diffuse sur le meme element : un bord net **ou** une elevation douce.
18. **Polices trop vues.** Inter, Roboto, Fraunces, Geist, Plus Jakarta Sans, Space Grotesk, Instrument Serif sont les valeurs par defaut de tous les generateurs. Elles restent dans `fonts.ts`, mais `ff composer` et `/nouveau-site` doivent d'abord chercher ailleurs (63 polices) ; deux sites voisins ne partagent jamais le meme couple display/body.
19. **Rythme de page, pas de gabarit repete.** Trois sections d'affilee ne partagent jamais le meme squelette (titre a gauche + texte muted + grille) : c'est le deuxieme tell « genere par IA » apres l'eyebrow omnipresent. Varier au moins un axe entre sections voisines : alignement (gauche/centre), fond (`bg` / `bg-2` / un seul bloc `bg-ink` par page), structure (liste, frise, tableau, masonry, accordéon). Une page a besoin d'un **temps fort** — une section qui rompt le rythme (bloc encre inverse, composition pleine largeur, moment purement typographique) — placee entre la moitie et les deux tiers de la page. Exemple : `sites/anna-vidal/sections/Manifeste.astro`.
20. **Matiere et geste humain.** Sur les grands fonds unis (surtout sombres), `data-grain` (CSS pur, voir `global.css`) sur la section cle (hero, bloc encre) casse l'aspect « plastique » du rendu. Un element signe — italique display (« Signe … »), un lieu, une date, une ligne manuscrite d'allure — en fin de page ou de manifeste ancre le site dans le reel ; les generateurs ne produisent jamais ce geste. Et la typographie display doit etre une vraie personnalite : serif dessine avec italique reelle, ou grotesque tres affirmee — le couple « grotesque neutre partout, titres sans-serif par defaut » est le marqueur n°1 du look genere (voir `docs/veille/skills-design-ia.md`).
21. **Un groupe anime par section.** Le « meme fade-in generique sur chaque element » est le tell IA n°1 cote motion (925 Studios ; constat 1 de `docs/veille/animations-2.md` : 33 a 52 `data-reveal` par page chez nous, 3 a 6 elements animes par site chez les primes). Par section : le titre en `data-split="lines"` (rich) ou `data-reveal` **et un seul** bloc (`data-stagger` sur la grille, ou `data-reveal` sur l'image) — jamais un `data-reveal` sur un paragraphe, une puce, un pied de carte ou un bouton. `data-reveal` par defaut = opacite seule 0,5 s ; le deplacement (`data-reveal="up"`, 12 px) se merite. Ce qui repond a un geste (`.btn`, `:hover`, focus) tourne sur `--motion-ui` (0,15-0,32 s), jamais sur `--motion-duration`. `ff audit-motion` avertit au-dela de 16 apparitions ou de 2 effets riches par page.

## Regles des directions
Voir `src/directions/README.md`. Une direction doit definir tous les tokens, importer ses polices via `@fontsource-variable/*` (deja installees : fraunces, inter, space-grotesk, cormorant, playfair-display, manrope, unbounded, syne, lora, nunito, archivo, dm-sans, jetbrains-mono, instrument-sans, outfit, bricolage-grotesque ; statiques : `@fontsource/archivo-black`, `@fontsource/instrument-serif`). Elle peut styliser `.btn`, `.btn-primary`, `.btn-ghost`, `.card`, `.rule`, `.eyebrow`, `h1 em`, `body::before` (texture), `::selection`.

## CSS global et iPhone (lecons de sites/finck-fisch, oct. 2026)

- **Une regle `<style is:global>` sans couche bat toute classe Tailwind.** Tailwind 4 range ses
  utilitaires dans `@layer utilities` ; une regle hors couche gagne contre n'importe quelle couche,
  quelle que soit la specificite. Cas reel : `.demo{aspect-ratio:…}` en global ecrasait en silence
  `md:aspect-[16/10]` pose sur le meme element. Dans un style global, ne jamais poser une propriete
  qu'un utilitaire doit pouvoir changer (taille, ratio, display, marges) — ou l'envelopper dans
  `@layer components { … }`, ou la porter par une classe Tailwind dans le balisage.
- **Aucun contenu essentiel en video autoplay.** En mode economie d'energie (Low Power Mode), l'iPhone
  bloque TOUT autoplay : `play()` est rejete ou la video ne demarre jamais, meme `muted playsinline`.
  Ce qui doit etre vu (demo, preuve, hero) passe par des images fixes animees en CSS ; la video n'est
  qu'un bonus, avec un `poster` qui se suffit a lui-meme.
- **Une image tres haute animee en `transform` est floue sur iOS** (texture GPU plafonnee : Safari la
  reechantillonne). Decouper en tuiles de ~1 500 px de haut au plus, empilees : `ff tuiles <slug>`
  (`scripts/ff/tuiles.mjs`) produit ces tuiles depuis le build d'un site.
- **Verifier iOS sur l'URL https deployee**, pas en local : la CSP du site contient
  `upgrade-insecure-requests` et HSTS, l'emulation WebKit/iPhone contre `ff servir` (http) echoue
  (ressources reecrites en https introuvables). Chrome local suffit pour tout le reste.

## Pages legales (mentions, confidentialite)

`src/pages/mentions-legales.astro` et `src/pages/confidentialite.astro` generent les deux pages depuis
`site.config.ts` (`business.legalForm`/`siret`/`tva`/`insurance`, `legal.owner`/`host`/`mediator`,
`form.provider`). Quand le texte genere ne suffit pas (societe pas encore immatriculee, hebergeur
particulier, profession reglementee), un site fournit sa propre version :
`sites/<slug>/legal/MentionsLegales.astro` et/ou `sites/<slug>/legal/Confidentialite.astro`. La page
les trouve par `import.meta.glob` et rend ce composant **a la place de son `<main>`** (meme `Base`,
meme title, `noindex`, nav et pied de page du site autour) : le composant rend donc le `<main id="main">`
entier. Modele commente : `outils/legal/MentionsLegales.astro` (pas dans `sites/_exemple/legal/`, qui
changerait la page de reference). Exemple reel : `sites/finck-fisch/legal/`.

Rien d'invente : sans SIRET, la page dit « en cours de creation » plutot que d'afficher un numero
provisoire. `ff verifier`, `ff deploy` et `ff vercel` **echouent** si les mentions legales n'affichent
ni SIRET/RCS/RM ni cet avis, ou si le site montre le telephone de test 06 00 00 00 00 (toutes formes,
`tel:`/`wa.me` compris) ou le code postal 75000 (`scripts/ff/garde-donnees.mjs`). Un site de
demonstration (slug `_…`/`demo-…`, ou commentaire `// DEMO` en tete de `site.config.ts`) recoit de
simples avertissements.

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

**Sommaire actif (`sidebar`, `split`).** Le rail/panneau porte `data-scrollspy` ; `src/scripts/scrollspy.ts`
(un `IntersectionObserver`, bande `-35 % / -55 %` de l'ecran) pose `aria-current="true"` + `.is-active`
sur le lien de la section visible, et remplit un `[data-scrollspy-index]` optionnel (« 02 / 06 », rail
`sidebar`). La coquille style `.is-active` par tokens seulement (lien en `--fg`, trait `--accent` qui se
deploie sur `--motion-ui`/`--ease-out`, `prefers-reduced-motion` = pas de transition), ne vole jamais le
focus, aucun lien actif sur le hero. Rearme via `onPage(initScrollSpy)`. Exemple : `forge-delacroix`.

**Contact en tiroir (`layout.contactDrawer: true`).** `Base.astro` rend `src/components/ContactDrawer.astro`
sur toutes les pages : un `<dialog>` natif (formulaire `ContactForm` compact + telephone, WhatsApp, e-mail,
adresse, horaires) ouvert par **tout** lien `href="#contact"` ou `"/#contact"` (nav, CTA, bandeau, call-bar,
page service) ; les navs partagees ajoutent un CTA `wording.devis` quand il est actif. Panneau lateral
droit sur desktop, plein ecran depuis le bas sur mobile, ouverture sur `--motion-ui`/`--ease-out`
(`@starting-style`), `prefers-reduced-motion` = aucune animation. Accessibilite : `showModal()` (focus
piege, `Escape`), retour du focus au declencheur, `aria-labelledby`, bouton « Fermer », clic sur le fond,
page bloquee derriere (`html.ff-drawer-open`), `data-lenis-prevent`. La section contact finale reste
possible en plus (jamais retiree) ; sans section contact dans le layout, le tiroir est la seule porte et
`navLinks()` ajoute `#contact` a la nav. `ff verifier` trouve le formulaire (honeypot) dans le dialog comme
dans une section. Metiers d'urgence : `dubois-plomberie`, `toits-cie`. Tokens uniquement.

**Coquilles d'architecture** (`src/lib/architectures.ts`, `docs/veille/architectures/INDEX.md`) : `carte`,
`index-projets`, `lieu-fixe`, `panneaux`, `carnet`, `livre`, `cartes-agenda` ne se prennent qu'avec leur architecture
(`layout.architecture`), jamais tirees par `ff composer` (`COQUILLES_D_ARCHITECTURE`). Elles rendent elles-memes leur
premier ecran (h1 + metier a ville + `tel:` visible sans defiler, socle `docs/GOUT.md` § 0) et les sections du layout
ensuite ; un bloc de la coquille qui porterait l'id d'une section du layout (`contact`, `about`, `proof`) le lui laisse.

**Bande horizontale de page entiere (`panneaux`, `carnet`).** Structure `[data-bande] > [data-bande-vue] >
[data-bande-piste]`, pilotee par `src/scripts/bande.ts` (`onPage(initBande)`) : le defilement VERTICAL natif fait glisser
la piste en `translate3d` (une seule translation, jamais de defilement simule, jamais de calage image par image),
seulement a partir de 64 rem et sans `prefers-reduced-motion` ; `.is-bande` posee par le script, vue collante en
`overflow: clip` (pas `hidden` : une ancre ne doit pas pouvoir la faire defiler), le focus clavier et les ancres ramenent
la page au bon panneau, `[data-bande-progres]` recoit le pourcentage. Sans bande (telephone, mouvement reduit, sans
script), les enveloppes sont en `display: contents` : chaque panneau est un bloc ordinaire de la page.

**Un ecran = un bloc.** Les sections faites d'ecrans ou de chapitres (`about/ecran-texte-photo`, `proof/citations`,
`services/liste-a-filets`, `services/cartes-empilees`, le bloc agenda) ont pour racine une enveloppe `<div id="<type>">`
dont chaque ecran ou carte est un `<section>`/`<article>` enfant direct : `ff ressemblance` (`scripts/ff/deroule.mjs`)
ouvre ces enveloppes et lit le deroule ecran par ecran, comme le visiteur.

## Verification
`SITE=_exemple node node_modules/astro/astro.js build` doit passer. Pour tester une variante, modifier temporairement `sites/_exemple/site.config.ts` (layout) puis remettre.

## Sections sur mesure (propres à un site)

Quand un client a besoin d'un bloc unique (menu, manifeste, carte dessinée, grille tarifaire), on ne
crée pas une variante partagée : on écrit `sites/<slug>/sections/<Nom>.astro` et on l'appelle dans le
layout par `{ type: 'custom', variant: '<nom>', label: 'Libellé nav' }` (`label` absent = pas
d'ancre). Mêmes règles que les sections partagées (tokens, `site`, `data-reveal`), `id` = nom en
minuscules. Le fichier voyage avec le site à l'export, jamais dans `src/`. Exemple :
`sites/anna-vidal/sections/Manifeste.astro`. Pour faire grandir la bibliothèque partagée :
compétences `/nouvelle-variante` et `/nouvelle-direction`.
