# Squelettes de page — sites primés vs. ff-atelier

> Réponse au verdict du fondateur sur nos 20 sites : « je sens de la diversité, mais ça reste du full
> scroll down pour tout voir, contact en bas » ; « il y a du boulot sur les sidebars et les trucs comme
> ça, on a besoin de diversité, et de connaître nos outils ». Catalogue des **squelettes de page**
> (structure et navigation — pas les effets d'animation, déjà couverts par
> `docs/veille/animations-2.md`) utilisés par des sites primés, et ce qu'il faut à l'atelier pour les
> produire.

## 0. Méthode et limite

Fetch (WebFetch) des 8 pages de listing demandées, puis de la page d'accueil de chaque site cité qui
répond. **Limite constatée sur les 41 sites ci-dessous** : WebFetch convertit le HTML en markdown avant
lecture — `position: fixed`/`sticky`, `scroll-snap-type`, `<dialog>`, `view-transition`, `overflow-x`
exacts ne sont presque jamais visibles dans le résultat. Le squelette de chaque site est donc déduit
d'indices structurels fiables (liste de liens de nav, mention explicite « Menu »/« Close »/burger,
position du texte de contact, grille de tuiles visible dans le contenu) et marqué « non déterminé »
plutôt qu'inventé quand aucun indice n'est disponible. Pour une douzaine de sites déjà documentés dans
`docs/veille/animations-2.md` (code lu directement, pas de conversion markdown), les squelettes sont
enrichis par recoupement — noté « (recoupé, animations-2.md #n) ».

Pages de listing : réussies — [Awwwards unusual-navigation](https://www.awwwards.com/websites/unusual-navigation/),
[Awwwards best-of-navigation](https://www.awwwards.com/awwwards/collections/the-best-of-navigation/),
[Awwwards SOTD](https://www.awwwards.com/websites/sites_of_the_day/), [Siteinspire navigation](https://www.siteinspire.com/websites?categories=navigation),
[Minimal Gallery](https://minimal.gallery/), [One Page Love split-screen](https://onepagelove.com/tag/split-screen).
Non exploitables : godly.website (redirige vers recent.design, galerie générique sans URL de site
individuel) ; hontran.dev/blog (erreur SSL, non récupérable) ; sites individuels zui.ooo, monogrid.com/universe
(erreur SSL), persona-studio.com (contenu vide) — remplacés par des alternatives des mêmes listings.
Whiteout · An Ascent (erreur SSL) sourcé uniquement via `animations-2.md` #19.

**41 sites analysés**, largement au-dessus du minimum de 25.

## 1. Nos coquilles/nav/contact actuelles — rappel factuel

6 coquilles (`src/shells/*.astro`) : `flow` (pile classique, défaut), `split` (panneau latéral fixe +
contenu qui défile), `sidebar` (rail vertical étroit fixe, liens verticaux), `slides` (chapitres plein
écran, scroll-snap proximity), `magazine` (grille asymétrique éditoriale, décalages alternés),
`sticky-hero` (hero épinglé en fond, sections qui glissent par-dessus). 6 nav (`src/sections/Nav/*.astro`) :
`bar`, `burger` (overlay plein écran), `dock` (flottant bas, masqué au scroll down), `minimal`
(transparente, masquée au scroll), `split` (logo centré, liens répartis), `floating` (pilule centrée).
4 contact (`src/sections/Contact/*.astro`), tous en **section finale de page**, aucun tiroir/modale :
`form-card`, `form-split`, `full`, `simple`.

Usage réel relevé sur les sites `sites/*/site.config.ts` (grep, 20 sept. 2026) : sur 14 sites avec
`shell` renseigné — `flow` ×9, `sticky-hero` ×2, `sidebar` ×1, `magazine` ×1, **`split` ×0, `slides`
×0**. Sur les nav non `custom/` — `bar` ×5, `minimal` ×2, `split` ×2, `floating` ×1, **`burger` ×0,
`dock` ×0**. Ces chiffres encadrent la colonne « chez nous ? » ci-dessous et la section 3(c).

## 2. Sites analysés (41)

| # | Site | Métier | Squelette | Navigation | Contact | Mobile | Chez nous ? |
|---|---|---|---|---|---|---|---|
| 1 | [Forge Automotive](https://forgeautomotive.co.uk/) | Atelier auto sur mesure | Pile verticale classique | Fixe en haut, menu plein écran en `clip-path` (recoupé, animations-2.md #20) | Section finale + page `/contact/` dédiée | Burger probable | `nav/burger` existe, 0 % utilisé |
| 2 | [Driessen Architectuur](https://driessenarchitectuur.nl/) | Architecte | Multi-pages à transitions continues (Swup, recoupé animations-2.md #21) sur pile verticale | Fixe en haut, burger confirmé (« MenuSluiten ») | Toujours visible (tél. header) + section finale + CTA | Burger actif | Transitions de page absentes de toute coquille |
| 3 | [Spyker Cars](https://spykercars.com/) | Constructeur auto de luxe | Long scroll narratif (grille éditoriale parallax 12 col, récit en 3 temps, recoupé animations-2.md #22) | Fixe en haut, horizontale, pas de burger visible | Section finale « Get in touch » + lien nav | Non déterminé | Proche `sticky-hero`, sans grille éditoriale |
| 4 | [Sedlecky Kaolin](https://sedlecky-kaolin.com/) | Mine industrielle | Pile verticale classique | En haut, horizontale, sous-menus déroulants | Page dédiée, répétée en haut et en bas | Non déterminé | `flow` correspond |
| 5 | [Horeca](https://www.horeca-social.com/en) | Agence CHR (restauration — proche artisan) | Pile verticale classique + module pile de cartes sticky (recoupé animations-2.md #50) | Fixe en haut, burger plein écran + sélecteur de langue | Section finale « LET'S WORK TOGETHER » + toujours visible header/footer | Burger confirmé | `nav/burger` existe, 0 % utilisé ; pas de pile de cartes sticky |
| 6 | [MERSI](https://www.mersi-architecture.com/) | Architecture | Écran scindé + défilement horizontal (slider `clip-path`, scroll horizontal épinglé, recoupé animations-2.md #48) | Fixe en haut, burger explicite | Page séparée `/contact` (pas de section finale) | Burger explicite, sidebar cachée | `shell/split` existe (0 % utilisé), pas d'horizontal |
| 7 | [White Desert](https://white-desert.com/) | Voyages de luxe (Antarctique) | Long scroll narratif à sections collantes (`position: sticky` ×12, recoupé animations-2.md #8) | Fixe en haut, burger, logo + liens | Section finale (3 canaux) + CTA « Enquire » répété | Burger confirmé | `sticky-hero` épingle le hero seul, pas les sections suivantes |
| 8 | [Whiteout · An Ascent](https://whiteout.overvac.com/) | Expérience Everest | Barre latérale permanente (rail d'altitude = progression, recoupé animations-2.md #19 — fetch direct en échec SSL) | Rail latéral, le scroll = l'altitude | Pas de contact (expérience) | Non déterminé | `sidebar` existe mais sans logique de progression active |
| 9 | [Kononenko Architectural Bureau](https://kononenkogroup.com/) | Architecture | Grille de tuiles/mosaïque (portfolio « Selected Projects ») | Fixe en haut, horizontale (Index/Work/About/Contact) | Page séparée + toujours visible en footer | Non déterminé | Aucune coquille en mosaïque |
| 10 | [Warm & Fuzzy](https://warmnfuzzy.tv/) | Studio créatif | Grille de tuiles/mosaïque (9 projets) | En haut, horizontale | Toujours visible (email header/footer) + section finale | Non déterminé | Idem |
| 11 | [Boc.Studio](https://boc.studio/) | Agence branding | Grille de tuiles/mosaïque (portfolio filtrable) | Non déterminé (skip-link seul indice) | Non déterminé | Indice faible | Idem |
| 12 | [basement.studio](https://basement.studio/) | Studio digital | Pile verticale classique | Horizontale (Services/Showcase/Blog/People/Lab/FAQ), menu plein écran probable | Page séparée `/contact` | Non déterminé | Proche `flow` |
| 13 | [Obys](https://obys.agency/) | Agence design | Grille de tuiles/mosaïque (19 projets) | Haut, minimale (Work/About + horloge) | Section finale (footer email) | Non déterminé | Aucune coquille tuiles |
| 14 | [Locomotive](https://locomotive.ca/) | Agence digitale | Pile verticale classique + bloc tuiles « Featured work » | Haut, horizontale + CTA « Let's talk » | Lien nav + section finale | « Menu » isolé, burger probable | Proche `flow` |
| 15 | [Immersive Garden](https://www.immersive-g.com/) | Studio luxe (LV, Cartier, Dior) | Pile verticale classique (canvas multiples, toggle) | Non déterminé | Section finale (email + adresse + réseaux) | Non déterminé | Proche `flow` |
| 16 | [Goodside](https://goodside.studio/) | Agence | Grille de tuiles/mosaïque (6 projets) | Haut + burger confirmé (« Menu »/« Close ») | Section finale + footer | Burger confirmé, nav dupliquée (tiroir mobile) | `nav/burger` existe, 0 % utilisé |
| 17 | [Trionn](https://trionn.com/) | Studio | Pile verticale classique (stats en tuiles) | Burger confirmé + email toujours visible en header | Section finale (formulaire + Calendly) + email header | Burger confirmé | Idem burger |
| 18 | [Flim](https://flim.ai/) | SaaS créatif | Pile verticale classique + chapitre en défilement horizontal épinglé (`scrub:1`, recoupé animations-2.md #47) | Fixe en haut (Home/Product/Pricing/Blog) | Section finale (newsletter) | Burger probable, assets mobiles dédiés | Aucune coquille horizontale |
| 19 | [PX PUSH](https://pxpush.com/) | Studio | Grille de tuiles/mosaïque (Works) | Haut, statique (Index/About/Journal) | Section finale « Get in Touch » | Indices tactiles seulement | Idem tuiles |
| 20 | [Goodgrowth](https://goodgrowth.com/) | Portfolio | Pile verticale classique | Liens (Work/Info/Contact), position non déterminée | Email header + section finale | Non déterminé | Proche `flow` |
| 21 | [4WIDE](https://4wide.jp/) | Studio (Astro, comme nous) | Pile verticale classique (grille 12/6 col en page) | Haut + burger secondaire | Section finale + emails dédiés footer | Burger suggéré | Proche `flow`, socle Astro commun |
| 22 | [House of Yellow](https://houseofyellow.nl/) | Agence contenu | Multi-pages à transitions continues (Swup, recoupé animations-2.md #41) sur pile verticale | Fixe + burger | Toujours visible (header+footer) + CTA « Connect » | Burger présent | Transitions de page absentes |
| 23 | [Maison des Élites](https://www.mdebeauty.com/) | Skincare premium | Pile verticale classique (e-commerce) | Fixe + nav secondaire compte/panier | Lien nav + section finale footer | Non déterminé | Proche `flow` |
| 24 | [Maison AUGE](https://maisonauge.com/) | Studio beauté/luxe | Pile verticale classique, aucune nav structurée détectée | Absente/non détectée | Section finale (mailto « let's talk ») | Non déterminé | Proche `flow` |
| 25 | [LinusBio](https://linusbio.com/) | Biotech | Pile verticale classique | Fixe + menus déroulants | Toujours visible (nav) + section finale | Non déterminé | Proche `flow` |
| 26 | [Emotion Agency](https://emotion-agency.com/) | Agence | Pile verticale classique + overlay immersif (Sound/Dark mode/Quality) | Haut texte + burger confirmé | Toujours visible (header) + section finale CTA « Start project » | Burger confirmé | `nav/burger` existe, 0 % utilisé |
| 27 | [Chems.Studio](https://www.chems.studio/) | Archive créative | Grille de tuiles/mosaïque (filtrable) + multi-pages à transitions continues (Swup, recoupé animations-2.md #58) | Fixe en haut avec filtres | Formulaire intégré, emplacement non déterminé | Non déterminé | Aucune coquille tuiles ni transitions |
| 28 | [Vivid](https://viivid.webflow.io/) | Expérience Webflow | Pile verticale classique (landing produit) | Haut (Home/Benefits/Documentation/Process) | Pas de section contact dédiée (CTA répétés) | Non déterminé | Proche `flow` |
| 29 | [PouyaOS](https://pouyashahri.com/) | Artiste/créateur numérique | **Nouvelle famille** : bureau virtuel façon OS accessible depuis une page classique | Haut classique + lien « Open PouyaOS » | Page séparée `/contact/` | Non déterminé | Hors périmètre artisan |
| 30 | [Whole Earth Index](https://wholeearth.info/) | Archive numérique | Site-index (l'accueil EST l'index, 6 catégories plein écran) | Index plein écran + nav secondaire horizontale | Pas de contact direct | Non déterminé (semble desktop-first) | Absent totalement |
| 31 | [Non-Linear Studio](https://non-linear.studio/work/) | Agence design/branding | Grille de tuiles/mosaïque | Haut (Work/Studio/Services/Contact/Archive) | Intégré au menu + footer | Non déterminé | Aucune coquille tuiles |
| 32 | [Little Plains](https://littleplains.com/) | Studio design/techno agentique | Pile verticale classique (galeries par section) | Haut (Explore/Ask/Projects/Writings) | Bas de page | Non déterminé | Proche `flow` |
| 33 | [Komma Komma](https://kommakomma.is/) | Agence design produit (Astro) | Grille de tuiles/mosaïque | Haut + CTA « Book a call » | Header + section + footer | Non déterminé | Aucune coquille tuiles |
| 34 | [This.design](https://this.design/) | Agence design/web | Pile verticale classique (page très courte) | Minimale (Home/About) | Bas de page, mailto | Non déterminé | Proche `flow` |
| 35 | [Quatrième Étage](https://quatriemeetage.studio/) | Studio design | Pile verticale classique minimaliste | Minimale (Work/Studio) | **Toujours visible en HAUT de page** (rare — pas en bas) | Non déterminé | Aucun de nos contacts n'est hors section finale |
| 36 | [Workshop Hospitality](https://workshophospitality.com/) | Mobilier/design hôtellerie luxe | Grille de tuiles/mosaïque (catalogue Webflow) | Haut + footer répété | Menu + footer + formulaire d'abonnement | Non déterminé | Aucune coquille tuiles |
| 37 | [Le Petit Bleu](https://lepetitbleucafe.com/) | Café-restaurant (artisan direct) | Pile verticale classique, ancres internes | Haut (Menu/About/Contact) | 3 emplacements (ancre haut, bas de page, footer) | Non déterminé | Proche `flow` |
| 38 | [Árstraumur](https://arstraumur.music/) | Musicien | Pile verticale classique | Haut, nombreuses entrées | Intégré au menu, pas de page séparée | Non déterminé | Proche `flow` |
| 39 | [Somos La Corte](https://somoslacorte.es/) | Média entertainment | Pile verticale classique + modale ponctuelle (newsletter, pas contact) | Haut | Mailto dans le menu | Non déterminé | Aucun de nos contacts n'utilise `<dialog>` |
| 40 | [Baseborn Studio](https://baseborn.studio/) | Studio branding indépendant | Grille de tuiles/mosaïque | Haut (Work/Studio/Services/Contact) | 3 emplacements (nav, bas de page, footer) | Non déterminé | Aucune coquille tuiles |
| 41 | [Pensatori Irrazionali](https://www.pensatori-irrazionali.com/) | Creative house | Chapitres plein écran (`scroll-snap` ×14) + multi-pages à transitions continues (View Transitions API ×24, recoupé animations-2.md #4) | Menu à transitions vidéo | Non déterminé | `prefers-reduced-motion` ×6 confirmé | `shell/slides` existe (0 % utilisé) mais pas de transitions de page |

## 3. Synthèse

### (a) Famille → fréquence → métiers → manque → coût

| Famille | Fréquence (/41) | Métiers artisans pertinents | Ce qui manque chez nous | Coût |
|---|---|---|---|---|
| Pile verticale classique | 20 (49 %) | Tous | Rien — c'est `flow`, déjà le choix par défaut | — |
| Grille de tuiles/mosaïque | 11 (27 %) | Photographe, menuisier-ébéniste (pièces), architecte d'intérieur, paysagiste (avant/après) | Aucune coquille en grille régulière (`magazine` est asymétrique éditorial, pas une mosaïque) | Moyen |
| Multi-pages à transitions continues | 2 primaires + 1 secondaire (Chems.Studio) | Tout artisan avec pages `/services/<slug>` (déjà tous) | Aucune transition de page — rechargement sec entre l'accueil et une page service | Petit (Astro a `<ClientRouter>`/View Transitions natif, pas besoin de Barba/Swup) |
| Long scroll narratif + sommaire collant | 2 (5 %) | Couvreur/paysagiste (récit de chantier), boulanger (savoir-faire), restaurateur | `sticky-hero` épingle le hero, pas un sommaire de progression pendant tout le scroll | Moyen |
| Écran scindé + défilement horizontal | 2 (5 %) | Architecte, menuisier (étapes de fabrication), garage (avant/après), forge | `shell/split` existe (0 % utilisé) ; le défilement horizontal en chapitre est totalement absent | Petit (promotion de `split`) / Moyen (horizontal) |
| Barre latérale permanente | 1 (2 %, + notre `sidebar` à 1/14 sites) | Studio créatif, architecte, avocat (sommaire d'articles) | `sidebar` existe, quasi jamais choisi, sans sommaire actif (scroll-spy) | Petit |
| Site-index (menu = la page) | 1 (2 %) | Photographe/artiste solo, architecte d'intérieur haut de gamme | Absent totalement | Gros |
| Contact en tiroir/modale | 0 confirmé (rare partout, même chez les primés) | Urgence : plombier, couvreur, serrurier, électricien | Nos 4 contacts sont tous en section finale, aucun tiroir/`<dialog>` | Petit à moyen |
| Chapitres plein écran (`scroll-snap`) | 1 (2 %) | Sites courts, une seule offre forte | `shell/slides` existe (0 % utilisé) — rare aussi chez les primés, pas prioritaire | — |
| Navigation intégrée / burger plein écran | ~10 (24 %, transversal aux familles) | Tous | `nav/burger` existe (0 % utilisé) malgré sa fréquence chez les primés | Petit (promotion) |

### (b) Les 5 squelettes à construire en priorité

**1. Coquille `index` (site-index, l'accueil est la page).**
Structure HTML : `<main>` sans hero classique — une grille ou une liste plein écran de 4 à 6 entrées
(métier/section) en gros texte display, chacune un `<a>` couvrant toute sa cellule. Pas de `<nav>`
séparée : les entrées sont la navigation. Desktop : grille CSS 2-3 colonnes, cellules pleine hauteur au
survol (image de fond qui apparaît). Mobile : pile verticale de liens plein-largeur, cible tactile
≥ 48 px. Accessibilité : chaque cellule est un vrai `<a>` (pas un `<div onclick>`), focus visible sur
tout le bloc, ordre de tabulation = ordre visuel, `aria-label` si le texte seul est ambigu ; respecte
`prefers-reduced-motion` (le survol qui révèle une image passe en apparition instantanée). Reste
compatible section partagées : les cellules pointent vers les ancres/pages existantes (`#services`,
`#contact`…), aucune section n'est restylée, seule la page d'accueil change de forme. Métiers : artisan
solo à forte identité (photographe, artiste, architecte d'intérieur) — pas un couvreur d'urgence.

**2. Coquille (ou variante de section) `horizon` — chapitre en défilement horizontal épinglé.**
Structure HTML : une `<section>` avec un conteneur interne `overflow-x: auto` (ou `scroll-snap-type: x
mandatory` pour un rail de cartes), 3 à 5 panneaux de largeur fixe (`min-width: 85vw` mobile, `40vw`
desktop). Desktop : molette verticale convertie en défilement horizontal via `scrollend`/`wheel` listener
léger (pas de pin GSAP obligatoire — un simple `overflow-x` scrollable au clavier suffit en V1).
Mobile : swipe natif, pas de conversion de molette. Accessibilité : navigation clavier (flèches
gauche/droite sur le conteneur, `tabindex="0"`), `scroll-snap-align: start` pour un arrêt net,
`prefers-reduced-motion` désactive tout scrub lié à la molette (repli sur scroll natif). Compatible
sections partagées : c'est un habillage possible pour `services/grid` ou une galerie `proof`, pas une
coquille de page entière — n'affecte que le conteneur, pas le contenu des cartes. Métiers : chantiers en
étapes (couvreur, menuisier, forge), portfolio chronologique (photographe).

**3. `sidebar`/`split` — sommaire actif (scroll-spy), pas une nouvelle coquille mais un réglage de
moteur prioritaire.**
Structure HTML : inchangée (le rail/panneau latéral existe déjà dans `src/shells/sidebar.astro` et
`split.astro`) — ajouter `aria-current="true"` et une classe `.is-active` sur le lien de section
actuellement visible. Desktop : un `IntersectionObserver` sur chaque `<section id>` met à jour le lien
correspondant dans le rail (poids de trait ou couleur d'accent, pas de mouvement). Mobile : sans effet
(le rail est déjà masqué sous `lg:`). Accessibilité : la mise à jour visuelle ne doit pas voler le focus
clavier ; `aria-current="location"` sur le lien actif pour les lecteurs d'écran ; aucune animation si
`prefers-reduced-motion`. Compatible sections partagées : zéro changement de structure, seul un petit
script dans le shell existant — coût le plus bas de la liste, impact direct sur la demande du fondateur
(« du boulot sur les sidebars »).

**4. Nav/contact « tiroir » — CTA persistant + panneau `<dialog>`.**
Structure HTML : un bouton flottant fixe (`position: fixed; bottom/right`) toujours visible (« Appeler »
ou « Écrire »), qui ouvre un `<dialog>` natif contenant le formulaire de contact existant
(`ContactForm.astro` réutilisé tel quel, pas de restylage). Desktop : `<dialog>` centré avec overlay ;
mobile : `<dialog>` plein écran depuis le bas (`::backdrop`, `translateY` d'entrée). Accessibilité :
`<dialog>` natif gère le focus trap et `Escape` nativement (comme `nav/burger` le fait déjà à la main,
voir `src/sections/Nav/burger.astro` ligne 86-87, à réutiliser en pattern) ; `aria-labelledby` sur le
titre du panneau ; le bouton déclencheur reprend le focus à la fermeture. Compatible sections partagées :
n'existe qu'en plus de la section `contact` finale (qui reste la source de vérité), jamais à sa place —
pour les métiers d'urgence, pas pour remplacer le formulaire complet. Métiers : plombier, couvreur,
serrurier, électricien — tout artisan vendant la rapidité de contact.

**5. Transitions de page natives (View Transitions API / `<ClientRouter>` Astro) — réglage de moteur
transversal, pas une coquille mais le plus gros effet de levier.**
Structure HTML : ajout de `<ClientRouter />` (intégré à Astro 5) dans `Base.astro`, `transition:name` sur
le hero/logo pour un morph doux entre l'accueil et une page `/services/<slug>`. Desktop et mobile :
identique (l'API est native, pas de librairie JS ajoutée contrairement à Barba/Swup/Taxi utilisés par 9
des 41 sites primés). Accessibilité : Astro respecte `prefers-reduced-motion` automatiquement pour les
transitions par défaut ; vérifier qu'aucune transition personnalisée ne dépasse 300-400 ms et qu'aucun
focus n'est perdu au changement de page (`document.title` et focus sur `<main>` après navigation).
Compatible sections partagées : ne touche aucune section ni coquille existante — c'est un ajout au
niveau du layout de base, bénéficie aux 20 sites d'un coup. Coût le plus bas rapporté à son effet
(famille présente chez 22 % des primés, zéro dépendance).

### (c) Trois constats francs sur nos 6 coquilles actuelles

**1. `split` et `slides` sont à 0 % d'usage réel.** Sur les 14 sites avec `shell` renseigné, aucun
n'utilise `split` (panneau latéral fixe + contenu qui défile) ni `slides` (chapitres scroll-snap) —
alors que ce sont précisément les deux coquilles qui rompent le plus nettement avec le « full scroll
down » dénoncé par le fondateur. `sidebar` n'est pas mieux loti (1 site, `forge-delacroix`, cité comme
référence par le fondateur lui-même). Les coquilles les plus sous-exploitées ne sont donc pas absentes
du code — elles sont absentes des choix faits pour les clients.

**2. `nav/burger` et `nav/dock` sont à 0 % d'usage alors que le burger plein écran est un des patterns
les plus fréquents chez les primés.** Sur les nav non `custom/`, aucun site n'utilise `burger` (menu
plein écran, exactement le pattern confirmé chez au moins 10 des 41 sites primés analysés : Driessen,
Horeca, Goodside, Trionn, Emotion Agency, House of Yellow…) ni `dock` (aucun équivalent flottant observé
chez les primés non plus — absence à double sens, pas nécessairement un manque). L'écart entre ce que
l'atelier sait construire et ce qu'il déploie réellement est le même qu'au point 1 : un problème de choix
lors de `/nouveau-site`, pas de bibliothèque.

**3. `magazine` et `sticky-hero` changent l'impression visuelle mais pas la mécanique de page — aucune
de nos 6 coquilles n'offre de contact autrement qu'en toute dernière section.** `magazine` varie largeurs
et décalages, `sticky-hero` épingle le hero : les deux sont visuellement distinctifs (d'où « je sens de
la diversité »), mais les deux atterrissent malgré tout sur la même suite pile-verticale-puis-contact-en-
bas que `flow` — comme `sidebar` et `split`, dont le panneau latéral reste une nav, pas un accès au
contact. C'est ce qui explique le second reproche du fondateur (« contact en bas ») malgré la diversité
déjà en place : aucune coquille ne casse ce contrat, contrairement à la coquille 4 proposée en (b).
