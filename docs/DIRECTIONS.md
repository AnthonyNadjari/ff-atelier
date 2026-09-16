# Choisir une direction et des variantes

Ce guide sert à choisir, pour un nouveau client : une **direction** (personnalité visuelle complète,
`src/directions/<nom>/`), un niveau de **motion**, et une **variante par section** (`layout.sections`
dans `site.config.ts`). Référence normative : `src/lib/schema.ts` (`DIRECTIONS`, `VARIANTS`) et
`src/directions/README.md` pour le contrat technique d'une direction.

## Règle de variété

**Ne jamais donner la même direction ET le même hero à deux clients du même métier ou de la même
ville.** Deux menuisiers de la même métropole ne doivent pas ressembler au même gabarit ; deux
clients dans la même direction doivent au moins changer de variante de hero, de nav ou de footer.

Avant de choisir, lance :

```
node scripts/ff.mjs variete
```

Ça liste les combinaisons `direction` + `layout.hero` (et idéalement les autres variantes) déjà
utilisées par les sites existants dans `sites/`. Si le meilleur choix pour le métier est déjà pris par
un client du même secteur ou de la même zone, prends la deuxième meilleure direction de la liste
"métiers typiques" ci-dessous, ou change de variante de hero/nav/footer pour rester dans la même
direction sans la dupliquer visuellement.

## Les 8 directions

| Direction | Ambiance | Métiers typiques | À éviter | Motion conseillée |
|---|---|---|---|---|
| **atelier** | Chaleureux, artisanal, papier chaud, serif Fraunces. Sent la main et le bois. | Menuisier, ébéniste, boulanger, céramiste, tapissier, peintre décorateur, fleuriste, restaurateur | Urgence 24/7, high-tech | subtle |
| **brut** | Brutaliste. Blanc pur, noir franc, bordures épaisses, ombres portées dures, aucun arrondi. | Architecte, graphiste, studio de skate, agence de design, label musical, tatoueur, marque de streetwear, salle de sport crossfit | Luxe feutré, organique, pastel | subtle |
| **luxe** | Sombre et précieuse. Or fin sur noir profond, Cormorant élancé, mouvement lent, curseur lumineux. | Bijoutier, horloger, tailleur sur mesure, architecte d'intérieur, sommelier, parfumeur, galeriste, orfèvre | Urgence 24/7, brutalisme, low-cost | rich |
| **journal** | Éditorial, presse écrite. Off-white, Playfair Display, filets fins, rouge profond en accent. | Avocat, notaire, consultant, cabinet de conseil, éditeur, expert-comptable, historien de l'art, journaliste indépendant | Urgence 24/7, high-tech, fluo | subtle |
| **neon** | Dark tech, très animé. Fond noir profond, dégradés lumineux mouvants, Unbounded massif. | Développeur, studio de jeux vidéo, DJ, salle d'escape game, startup tech, agence esport, club de fitness nocturne, studio de tatouage néon | Artisanat traditionnel, luxe feutré, éditorial | rich |
| **clair** | SaaS propre et lumineux. Blanc, bleu franc, arrondis généreux, ombres douces superposées. | Startup SaaS, agence marketing, cabinet de recrutement, coach en ligne, agence web, consultant digital, plateforme e-commerce, agence de communication | Brutalisme, artisanat, urgence 24/7 | subtle |
| **terre** | Organique, nature. Fond papier chanvre, vert profond et ocre, formes rondes généreuses. | Pépiniériste, apiculteur, maraîcher, paysagiste, ferme biologique, herboriste, fromager, vigneron bio | High-tech, urgence 24/7, brutalisme | subtle |
| **signal** | Urgence 24/7. Blanc, rouge-orange franc, Archivo Black massif, numéro de téléphone énorme. | Plombier, serrurier, électricien, dépanneur chauffage, vitrier, dégât des eaux, antenniste, ascensoriste | Luxe feutré, lenteur, pastel | none |
| **nuit** | Bleu nuit profond et blanc chaud. Newsreader élégant, ambre discret, ciel étoilé, mouvement lent et calme. | Hôtel, restaurant gastronomique, spa, institut de bien-être, bar à vin, chambre d'hôtes, masseur bien-être | Urgence 24/7, brutalisme, low-cost | subtle |
| **pop** | Blocs de couleurs vives, ludique. Anybody extra-gras, rose et turquoise, cartes à ombre décalée, boutons costauds. | Boulangerie, pâtisserie, garde d'enfants, organisateur d'événements, food truck, glacier, salle de jeux | Luxe, funéraire, deuil, juridique | rich |
| **pierre** | Minéral et minimal. Beige pierre, Bodoni Moda élancé, angles droits, grand vide, filets fins. | Architecte, tailleur de pierre, marbrier, galeriste, notaire, géomètre, urbaniste | Ludique, urgence 24/7, low-cost | subtle |
| **retro** | Seventies. Crème, orange brûlé et moutarde, Gloock rond, boutons en pilule, double filet sous les titres. | Barbier, friperie, brocante, café, disquaire, salon de tatouage vintage, photographe argentique | Minimalisme froid, urgence 24/7, high-tech | subtle |
| **nordique** | Pâle et aérienne. Blanc cassé, teal sourd, Sora aéré sur Literata chaleureuse. Respire. | Décorateur intérieur, ébéniste scandinave, thérapeute, architecte, atelier de céramique, coach bien-être | Urgence 24/7, brutalisme, criard | subtle |
| **encre** | Encre noire sur papier, trait à la main. Instrument Serif géant, vermillon en accent, grain de papier. | Tatoueur, illustrateur, céramiste, relieur, graveur, atelier de création | Corporate, high-tech, luxe froid | subtle |
| **industriel** | Béton et acier. Bebas Neue en majuscules, Red Hat Display net, orange sécurité en signal. | Garagiste, métallier, entreprise du BTP, déménageur, démolisseur, serrurier industriel | Délicat, pastel, luxe | subtle |
| **mediterranee** | Terre cuite et mer. Gelasio chaleureux sur Hanken Grotesk, arches douces, carreaux très discrets. | Restaurateur, céramiste, agence immobilière du sud, producteur d'olives, domaine viticole, pisciniste | Urgence 24/7, high-tech, brutalisme | subtle |

Un métier hors de ces listes : choisis par ambiance recherchée (les 3 adjectifs du brief, section 12)
plutôt que par métier littéral — un consultant qui se décrit comme "chaleureux, humain, simple" ira
peut-être mieux en `atelier` qu'en `journal`.

Ces 16 directions et leurs métadonnées (`ambiance`, `metiers`, `eviter`, `motionParDefaut`) viennent des
commentaires de `DIRECTIONS` dans `src/lib/schema.ts` et, quand ils existent, des fichiers
`src/directions/<nom>/meta.ts` — ne pas dépendre de ces derniers pour choisir une direction : ils
peuvent manquer pour une direction toute neuve, `src/lib/schema.ts` reste la source normative.

## Sections et variantes

Une section change de fichier selon la variante (`src/sections/<Type>/<variante>.astro`). Choisis en
fonction des données réellement fournies dans le brief : une variante qui a besoin d'une donnée
absente (photo, avis, FAQ) ne doit pas être choisie.

### `nav`
| Variante | Quand l'utiliser |
|---|---|
| `bar` | Défaut sûr, toutes directions, logo + liens + CTA. |
| `minimal` | Peu de sections dans le layout, direction épurée (clair, journal). |
| `split` | Look éditorial ou luxe, logo centré avec liens de part et d'autre. |
| `floating` | Directions animées (neon, brut) qui veulent une nav flottante au scroll. |

### `hero`
| Variante | Quand l'utiliser |
|---|---|
| `split` | Défaut : texte + image/portrait côte à côte. Marche presque partout. |
| `fullbleed` | Une photo forte (réalisation, portrait) qui mérite tout l'écran. |
| `typographic` | Pas de bonne photo disponible, ou direction où le texte porte le message (journal, brut). |
| `stacked` | Mobile-first, message court, direction clair/terre. |
| `marquee` | Direction brut/neon, envie d'un défilement de mots-clés en bandeau. |
| `video` | Le client a une vidéo courte muette (`images.heroVideo`) ; sinon ne pas choisir cette variante. |

### `services`
| Variante | Quand l'utiliser |
|---|---|
| `grid` | Défaut, 3-6 services de poids égal. |
| `list` | Services avec descriptions plus longues, direction éditoriale. |
| `alternating` | Chaque service a une image ; alterne image/texte gauche-droite. |
| `accordion` | Beaucoup de services (5-6) et peu de place, mobile-first. |
| `cards-hover` | Direction animée (neon, luxe), motion rich, envie d'interaction. |
| `bento` | Un service phare + plusieurs secondaires, direction clair/brut. |

### `about`
| Variante | Quand l'utiliser |
|---|---|
| `portrait` | Un portrait du client disponible, histoire courte. |
| `story` | Pas de photo, histoire longue à raconter (texte porteur). |
| `values` | Le brief a surtout des valeurs (section 6) plus qu'une histoire narrative. |
| `timeline` | Plusieurs jalons datés fournis (`about.milestones`). |

### `proof`
| Variante | Quand l'utiliser |
|---|---|
| `google` | Note + nombre d'avis Google fournis, rien d'autre. |
| `testimonials` | Avis clients réels avec texte fournis (section 7 du brief). |
| `gallery` | Photos de réalisations fournies, pas forcément d'avis. |
| `before-after` | Paires avant/après fournies (rénovation, travaux). |
| `logos` | Logos de partenaires/clients B2B fournis. |
| `marquee-quotes` | Plusieurs témoignages courts, direction animée. |

### `zones`
| Variante | Quand l'utiliser |
|---|---|
| `list` | Défaut, liste simple de villes. |
| `map` | Le client fournit un `mapsEmbed`, ou zone géographique à visualiser. |
| `chips` | Beaucoup de villes (>8), direction clair/brut, présentation compacte. |

### `process`
| Variante | Quand l'utiliser |
|---|---|
| `steps` | Le client a décrit ses étapes de travail (devis → intervention → suivi). |
| `timeline` | Étapes avec une notion de durée/chronologie. |
| `numbered` | Peu d'étapes (2-4), direction typographique (journal, brut). |

Si le brief ne détaille pas de méthode de travail, ne pas inclure de section `process`.

### `faq`
| Variante | Quand l'utiliser |
|---|---|
| `accordion` | Défaut, 3+ questions. |
| `two-columns` | Beaucoup de questions (6+), direction avec assez de largeur (clair, journal). |

Pas de FAQ dans le brief → pas de section `faq` dans `layout.sections`.

### `cta`
| Variante | Quand l'utiliser |
|---|---|
| `band` | Défaut, bandeau pleine largeur avant le contact. |
| `card` | Direction avec cartes/ombres (clair, atelier). |
| `phone-giant` | Direction `signal` ou urgence 24/7 : numéro énorme, un seul geste. |

### `contact`
| Variante | Quand l'utiliser |
|---|---|
| `form-split` | Défaut, formulaire + coordonnées côte à côte. |
| `form-card` | Formulaire seul mis en avant dans une carte. |
| `simple` | Peu d'infos de contact, pas besoin de mise en scène. |
| `full` | Beaucoup d'infos (horaires, carte, plusieurs moyens de contact). |

### `footer`
| Variante | Quand l'utiliser |
|---|---|
| `columns` | Défaut, plusieurs colonnes de liens/infos. |
| `minimal` | Site à une page, peu de liens. |
| `big-name` | Direction typographique (brut, neon, luxe) qui veut finir sur le nom en grand. |

## Polices

Catalogue complet dans `src/lib/fonts.ts` (`FONTS`). Chaque direction a une paire par défaut définie
dans son `index.css` ; `site.typography.display` / `site.typography.body` (`sites/<slug>/site.config.ts`)
la surchargent police par police, sans toucher au reste des tokens de la direction.

| Clé | Famille | Rôle | Ambiance |
|---|---|---|---|
| `fraunces` | Fraunces Variable | display | chaleureux, artisanal |
| `cormorant` | Cormorant Variable | display | luxe, élégant |
| `playfair` | Playfair Display Variable | display | éditorial, classique |
| `lora` | Lora Variable | both | calme, lisible |
| `literata` | Literata Variable | both | livre, sobre |
| `newsreader` | Newsreader Variable | display | journal, contraste |
| `bodoni` | Bodoni Moda Variable | display | mode, haute couture |
| `gelasio` | Gelasio Variable | both | classique, chaud |
| `instrumentSerif` | Instrument Serif | display | encre, fin, condensé |
| `gloock` | Gloock | display | rétro, gras, seventies |
| `inter` | Inter Variable | body | neutre |
| `manrope` | Manrope Variable | both | tech propre |
| `dmSans` | DM Sans Variable | body | doux, moderne |
| `instrumentSans` | Instrument Sans Variable | body | discret |
| `nunito` | Nunito Variable | body | rond, amical |
| `archivo` | Archivo Variable | body | franc, direct |
| `workSans` | Work Sans Variable | body | simple, ouvert |
| `figtree` | Figtree Variable | body | géométrique doux |
| `epilogue` | Epilogue Variable | both | architecture, net |
| `hanken` | Hanken Grotesk Variable | body | suisse, sobre |
| `schibsted` | Schibsted Grotesk Variable | both | presse, nordique |
| `redHat` | Red Hat Display Variable | both | industriel propre |
| `outfit` | Outfit Variable | display | géométrique, startup |
| `sora` | Sora Variable | display | aéré, moderne |
| `spaceGrotesk` | Space Grotesk Variable | display | brut, technique |
| `syne` | Syne Variable | both | arty, tendu |
| `unbounded` | Unbounded Variable | display | large, futuriste |
| `bricolage` | Bricolage Grotesque Variable | display | vivant, pop |
| `anybody` | Anybody Variable | display | pop, extensible |
| `josefin` | Josefin Sans Variable | both | rétro, art déco |
| `archivoBlack` | Archivo Black | display | urgence, affiche |
| `bebas` | Bebas Neue | display | condensé, industriel |
| `delaGothic` | Dela Gothic One | display | ultra gras, pop |
| `jetbrains` | JetBrains Mono Variable | mono | technique |

**Règle** : une surcharge de police (`typography.display` ou `typography.body`) ne doit **jamais**
reprendre la paire par défaut de la direction choisie — sinon la surcharge ne sert à rien et deux
clients dans la même direction se ressembleront trait pour trait. Vérifie `src/directions/<direction>/index.css`
avant de choisir.

Dix paires à essayer pour varier un override (display / corps) :

1. `literata` / `inter` — sobre, lisible, universel.
2. `playfair` / `dmSans` — éditorial adouci.
3. `syne` / `hanken` — arty tendu sur suisse sobre.
4. `epilogue` / `figtree` — architecture nette, doux.
5. `outfit` / `workSans` — géométrique startup, simple.
6. `josefin` / `lora` — art déco calme.
7. `schibsted` / `nunito` — presse nordique, rond amical.
8. `bricolage` / `instrumentSans` — vivant, pop, discret en dessous.
9. `delaGothic` / `manrope` — ultra gras pop sur tech propre.
10. `bodoni` / `epilogue` — haute couture sur net contemporain.

## Échelle

`scale` (`compact` / `normal` / `display`) règle la taille des titres (`text-display-*`) et l'espace
vertical entre sections (`section-y`) — voir `[data-scale]` dans `src/styles/global.css`.

| Valeur | Quand l'utiliser |
|---|---|
| `compact` | Beaucoup de contenu (6 services, FAQ longue, plusieurs sections denses) : titres et respirations réduits pour que ça tienne sans devenir un mur de défilement. |
| `normal` | Défaut, convient à la majorité des sites. |
| `display` | Peu de sections, message fort porté par la typographie (luxe, nordique, journal, pierre) : titres énormes et grandes respirations, quitte à allonger la page. |

## Tone et séparateurs

`layout.tone` (`flat` / `alternate`) : `alternate` met une section sur deux sur `bg-2` pour créer du
rythme sans rien ajouter visuellement ; `flat` (défaut) garde un fond uniforme. Choisis `alternate`
quand plusieurs sections voisines ont le même fond (`bg`) et se confondent visuellement ; reste en
`flat` si la direction est déjà chargée (texture, motifs) ou si beaucoup de sections ont déjà leur
propre fond (`cta band` sur `bg-ink`, `proof` en cartes...).

`layout.divider` (`none` / `wave` / `diagonal` / `curve` / `rule` / `zigzag`, `src/components/Divider.astro`)
ajoute un séparateur décoratif entre les sections du layout.

| Séparateur | Direction(s) qui vont bien |
|---|---|
| `none` | `brut`, `signal`, `industriel` — sobriété brute, pas de fioriture. |
| `wave` | `terre`, `nordique`, `mediterranee`, `nuit` — mouvement organique, calme. |
| `diagonal` | `clair`, `signal`, `industriel` — net, dynamique, moderne. |
| `curve` | `luxe`, `atelier`, `retro` — douceur, courbe précieuse. |
| `rule` | `journal`, `pierre` — filet fin, éditorial. |
| `zigzag` | `pop`, `encre`, `retro` — ludique ou trait dessiné à la main. |

## Libellés

`wording` (`site.config.ts`) : `devis`, `ctaTitle`, `ctaText`, `contactTitle`, `contactText`. Le défaut
de `devis` ("Demander un devis") convient à un artisan de service (plomberie, électricité, garage) mais
**jamais** à un commerce, un restaurant ou un salon — le client n'y "demande" pas un devis, il réserve,
commande ou prend rendez-vous.

| Métier | `wording.devis` | `wording.ctaTitle` (exemple) |
|---|---|---|
| Plombier | "Demander un devis" | "Une fuite, une urgence&nbsp;? <em>Parlons-en.</em>" |
| Coiffeur | "Prendre rendez-vous" | "Envie d'un <em>nouveau style</em>&nbsp;?" |
| Boulanger | "Commander" | "Du pain frais, <em>tous les matins.</em>" |
| Architecte | "Discuter du projet" | "Un projet en tête&nbsp;? <em>Parlons-en.</em>" |
| Garage | "Demander un devis" | "Un bruit suspect&nbsp;? <em>On regarde ça.</em>" |

## Pages villes

`seo.cityPages: true` génère une page `/zones/<ville>` par ville de `zones.cities`
(`src/pages/zones/[ville].astro`), avec son propre titre, sa description et son JSON-LD `Service`
ciblant cette ville — utile pour le SEO local (« plombier à Roubaix », etc.) quand un client couvre
plusieurs communes.

**Avertissement contenu pauvre (« thin content »)** : n'active `cityPages` que si le site a **au moins
4 vrais services** et une **vraie liste de villes** dans `zones.cities` (pas une ville unique, pas une
liste inventée). Une page ville avec un seul service et un paragraphe générique ne référence rien de
plus que la page d'accueil aux yeux d'un moteur de recherche et peut nuire au référencement au lieu de
l'aider.

## look.json

`sites/<slug>/look.json` (optionnel) surcharge uniquement le *look* d'un site — `direction`, `motion`,
`scale`, `accent`, `typography`, `layout`, `wording` — sans toucher au contenu ni à `site.config.ts`
(fusion faite par `applyLook` dans `src/lib/site.ts`). Il permet d'essayer et d'ajuster une apparence
sans éditer de TypeScript, avant de la figer.

Interface prévue (commandes en cours d'écriture par d'autres agents, décrites ici pour l'usage visé) :

- `node scripts/ff.mjs composer <slug>` — choisit automatiquement un look (direction + variantes)
  pour le site à partir de son `site.config.ts`, et l'écrit dans `look.json`. Sert de proposition de
  référence à comparer avec un choix manuel.
- `node scripts/ff.mjs propositions <slug>` — construit N looks différents avec captures d'écran, un
  par dossier `propositions/<slug>/index.html`, pour comparer plusieurs directions/variantes avant de
  choisir.
- `node scripts/ff.mjs studio <slug>` — éditeur visuel du look, servi sur `http://127.0.0.1:4400` :
  changer direction, polices, échelle, tone, séparateur, libellés et voir le rendu en direct, écrit
  dans `look.json`.
- `node scripts/ff.mjs figer <slug>` — fusionne `look.json` dans `site.config.ts` (le look choisi
  devient définitif) et supprime `look.json`.

### Modèles

`presets/<nom>.json` (voir `presets/README.md`) sont des looks complets, nommés et prêts à l'emploi —
ni plus ni moins que les 7 clés de `look.json`, jamais de contenu. `node scripts/ff.mjs modeles` les
liste (titre, direction/hero, métiers, vignette générée ou non) ; `node scripts/ff.mjs modele <slug>
<nom>` écrase `sites/<slug>/look.json` avec le look du modèle choisi (remplacement complet, pas de
fusion avec un `look.json` existant). `node scripts/ff.mjs vignettes` génère/rafraîchit les captures
`presets/vignettes/<nom>.webp` (build de `sites/_exemple` avec ce look, capture 1280×800). Dans
`ff studio`, l'onglet « Modèles » en haut du panneau applique un modèle en un clic (galerie avec
recherche par titre/métier/direction) : les contrôles existants se mettent alors à jour pour refléter
le look appliqué.
