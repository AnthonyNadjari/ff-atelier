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

Un métier hors de ces listes : choisis par ambiance recherchée (les 3 adjectifs du brief, section 12)
plutôt que par métier littéral — un consultant qui se décrit comme "chaleureux, humain, simple" ira
peut-être mieux en `atelier` qu'en `journal`.

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
