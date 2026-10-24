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

## Les directions

| Direction | Ambiance | Métiers typiques | À éviter | Motion conseillée |
|---|---|---|---|---|
| **atelier** | Chaleureux, artisanal, papier chaud, serif Fraunces. Sent la main et le bois. | Menuisier, ébéniste, boulanger, céramiste, tapissier, peintre décorateur, fleuriste, restaurateur | Urgence 24/7, high-tech | subtle |
| **brut** | Brutaliste. Blanc pur, noir franc, bordures épaisses, ombres portées dures, aucun arrondi. | Architecte, graphiste, studio de skate, agence de design, label musical, tatoueur, marque de streetwear, salle de sport crossfit | Luxe feutré, organique, pastel | subtle |
| **luxe** | Sombre et précieuse. Or fin sur noir profond, Cormorant élancé, mouvement lent, curseur lumineux. | Bijoutier, horloger, tailleur sur mesure, architecte d'intérieur, sommelier, parfumeur, galeriste, orfèvre | Urgence 24/7, brutalisme, low-cost | rich |
| **journal** | Éditorial, presse écrite. Papier de rotative gris, Playfair Display, filets fins, bleu d'imprimerie en accent. | Avocat, notaire, consultant, cabinet de conseil, éditeur, expert-comptable, historien de l'art, journaliste indépendant | Urgence 24/7, high-tech, fluo | subtle |
| **neon** | Dark tech, très animé. Fond noir profond, dégradés lumineux mouvants, Unbounded massif. | Développeur, studio de jeux vidéo, DJ, salle d'escape game, startup tech, agence esport, club de fitness nocturne, studio de tatouage néon | Artisanat traditionnel, luxe feutré, éditorial | rich |
| **clair** | SaaS propre et lumineux. Blanc d'écran bleuté, bleu cyanotype, arrondis généreux, ombres douces superposées. | Startup SaaS, agence marketing, cabinet de recrutement, coach en ligne, agence web, consultant digital, plateforme e-commerce, agence de communication | Brutalisme, artisanat, urgence 24/7 | subtle |
| **terre** | Organique, nature. Fond papier chanvre, vert profond et ocre, formes rondes généreuses. | Pépiniériste, apiculteur, maraîcher, paysagiste, ferme biologique, herboriste, fromager, vigneron bio | High-tech, urgence 24/7, brutalisme | subtle |
| **signal** | Urgence 24/7. Blanc, rouge-orange franc, Archivo Black massif, numéro de téléphone énorme. | Plombier, serrurier, électricien, dépanneur chauffage, vitrier, dégât des eaux, antenniste, ascensoriste | Luxe feutré, lenteur, pastel | none |
| **nuit** | Bleu nuit profond et blanc chaud. Newsreader élégant, ambre discret, ciel étoilé, mouvement lent et calme. | Hôtel, restaurant gastronomique, spa, institut de bien-être, bar à vin, chambre d'hôtes, masseur bien-être | Urgence 24/7, brutalisme, low-cost | subtle |
| **pop** | Blocs de couleurs vives, ludique. Anybody extra-gras, rose et turquoise, cartes à ombre décalée, boutons costauds. | Boulangerie, pâtisserie, garde d'enfants, organisateur d'événements, food truck, glacier, salle de jeux | Luxe, funéraire, deuil, juridique | rich |
| **pierre** | Minéral et minimal. Gris de calcaire, vert serpentine, Bodoni Moda élancé, angles droits, grand vide, filets fins. | Architecte, tailleur de pierre, marbrier, galeriste, notaire, géomètre, urbaniste | Ludique, urgence 24/7, low-cost | subtle |
| **retro** | Seventies. Crème, orange brûlé et moutarde, Gloock rond, boutons en pilule, double filet sous les titres. | Barbier, friperie, brocante, café, disquaire, salon de tatouage vintage, photographe argentique | Minimalisme froid, urgence 24/7, high-tech | subtle |
| **nordique** | Pâle et aérienne. Blanc de chaux, céladon de grès, Sora aéré sur Literata chaleureuse. Respire. | Décorateur intérieur, ébéniste scandinave, thérapeute, architecte, atelier de céramique, coach bien-être | Urgence 24/7, brutalisme, criard | subtle |
| **encre** | Encre noire sur papier, trait à la main. Instrument Serif géant, vermillon en accent, grain de papier. | Tatoueur, illustrateur, céramiste, relieur, graveur, atelier de création | Corporate, high-tech, luxe froid | subtle |
| **industriel** | Béton et acier. Bebas Neue en majuscules, Red Hat Display net, orange sécurité en signal. | Garagiste, métallier, entreprise du BTP, déménageur, démolisseur, serrurier industriel | Délicat, pastel, luxe | subtle |
| **eclipse** | Épurée et futuriste. Noir encre, blanc froid, un filet d'argent pour seule couleur ; Space Grotesk très serré, grand vide, mouvement long. Aucune couleur chaude : la couleur, c'est la lumière sur le noir. | Studio de design, horloger, opticien, architecte, galeriste, joaillier contemporain, photographe | Urgence 24/7, artisanat chaleureux, enfance, restauration traditionnelle | rich |
| **cobalt** | Boutique de quartier en couleurs franches : ivoire, aplats bleu cobalt, une touche d'orange, capitales serrées et texte en machine à écrire. Chaleureux et graphique. Style réel relevé sur [unionboulangerie.com](https://unionboulangerie.com/en/) ([fiche](veille/styles/union-boulangerie.md)). | boulangerie, patisserie, torrefacteur, epicerie fine, cave a vin, fromager, cafe, traiteur | urgence 24/7, luxe feutre, cabinet medical | subtle |
| **sapin** | Comptoir franc et joyeux : blanc pur et un seul vert sapin, capitales condensées très grasses, grand texte courant, photos aux coins arrondis. Style réel relevé sur [eatcabalar.com](https://www.eatcabalar.com/) ([fiche](veille/styles/cabalar.md)). | boucher, charcutier, restaurant, food truck, traiteur, primeur, maraicher, pizzeria | luxe feutre, cabinet medical, juridique | subtle |
| **affiche** | Rayonnage d'épicerie : filets noirs, rouge étiquette, jaune moutarde, capitales condensées partout, aucun arrondi. Direct et gourmand. Style réel relevé sur [mathesonfoodcompany.com](https://www.mathesonfoodcompany.com/) ([fiche](veille/styles/matheson.md)). | epicerie, conserverie, brasserie artisanale, producteur, sauces et condiments, traiteur, friterie, caviste | luxe feutre, bien-etre, cabinet medical | subtle |
| **prune** | Salon feutré et joyeux : rose poudré et prune profonde en bandes alternées, serif contrasté en capitales, photos d'intérieurs au carré. Chaleureux, féminin, assumé. Style réel relevé sur [houseofhoney.com](https://www.houseofhoney.com/) ([fiche](veille/styles/house-of-honey.md)). | decoratrice interieur, architecte d interieur, tapissier, fleuriste, institut de beaute, boutique deco, salon de the, creatrice | urgence 24/7, btp lourd, garage | subtle |
| **huile** | Livre de domaine : crème, une seule encre rouge tomate, serif de lecture en grand corps, étiquettes en petites capitales, photos sans cadre, pied de page rose. Familial et lettré. Style réel relevé sur [anecdotarural.com](https://www.anecdotarural.com/) ([fiche](veille/styles/anecdota-rural.md)). | producteur, domaine viticole, oleiculteur, apiculteur, ferme, chambre d hotes, fromager, maraicher | urgence 24/7, btp, garage | subtle |
| **releve** | Relevé d'architecte : blanc, noir et gris béton, croix de repère aux angles, grandes photos de lieu, titres nets, texte en machine à écrire. Calme et précis. Style réel relevé sur [roxoseco.com](https://www.roxoseco.com/) ([fiche](veille/styles/roxoseco.md)). | architecte, gite, maconnerie, charpentier, renovation, geometre, menuisier, paysagiste | boulangerie, enfants, fete | subtle |
| **arche** | Studio apaisé : blanc et gris pierre, grille de quatre colonnes tracée au filet, serif condensé fin, terre cuite en touche. Calme et architecturé. Style réel relevé sur [anuchome.com](https://www.anuchome.com/) ([fiche](veille/styles/anuc-home.md)). | architecte d interieur, decorateur, osteopathe, sophrologue, kinesitherapeute, cuisiniste, agenceur, therapeute | urgence 24/7, fete, enfants | subtle |
| **labo** | Labo de fermentation : blanc et bleu roi, page découpée en cases par des filets gris, capitales légères, boutons en machine. Net, frais, scandinave. Style réel relevé sur [folkkombucha.dk](https://www.folkkombucha.dk/) ([fiche](veille/styles/folk-kombucha.md)). | brasserie artisanale, fromager, laboratoire, boulangerie, glacier, opticien, pharmacie, pressing | luxe feutre, rustique | subtle |
| **citron** | Cuisine en plein air : jaune citron pâle en damier avec les photos, serif fin centré, étiquettes en machine. Ensoleillé, simple, convivial. Style réel relevé sur [pimpinella.cooking](https://www.pimpinella.cooking/) ([fiche](veille/styles/pimpinella.md)). | atelier de cuisine, traiteur, restaurant, glacier, guide, chambre d hotes, fleuriste, cours | urgence 24/7, btp, juridique | subtle |
| **mediterranee** | Terre cuite et mer. Gelasio chaleureux sur Hanken Grotesk, arches douces, carreaux très discrets. | Restaurateur, céramiste, agence immobilière du sud, producteur d'olives, domaine viticole, pisciniste | Urgence 24/7, high-tech, brutalisme | subtle |

Un métier hors de ces listes : choisis par ambiance recherchée (les 3 adjectifs du brief, section 12)
plutôt que par métier littéral — un consultant qui se décrit comme "chaleureux, humain, simple" ira
peut-être mieux en `atelier` qu'en `journal`.

Ces 17 directions et leurs métadonnées (`ambiance`, `metiers`, `eviter`, `motionParDefaut`) viennent des
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
| `burger` | Aucune barre permanente voulue, plein-ecran fort a l'ouverture (numeros, gros titres) ; identique desktop/mobile. |
| `dock` | Dock flottant bas-centre avec 4 liens + telephone, direction ludique/appli ; évite `hero: split` (le badge « Basé à » peut chevaucher le dock sur desktop). |

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
| `photo-cards` | La moitié des services au moins ont une vraie photo : la photo remplit la carte, un panneau clair posé dessus (titre, phrase, prix). Profondeur sans effet. Composition éprouvée (modèle Framer HandGrid, `docs/veille/compositions/INDEX.md`) : préférée par `ff composer` quand les photos sont là. |
| `portes` | **Architecture `accueil-portes`** (Maisons de Bricourt + Cabalar, `docs/veille/architectures/bricourt.md`, `carrefour-portes.md`) : l'accueil est un sommaire, une grande porte par activité (diptyque photo + aplat `bg-2`, côté de la photo alterné), toute la tuile mène à `/services/<slug>` ; dans l'aplat seulement le nom, une phrase, 4 sous-titres au plus, le prix s'il est donné. Données : **3 à 6 activités distinctes avec une photo chacune** (`services[].image`) ; une porte sans photo reste un aplat seul. À poser avec `layout.servicePage: 'porte'` (pages à la même grammaire) ; `ff composer` ne la prend que si la moitié des services ont une photo. |
| `carte-prix` | **La carte ou les tarifs en accordéons** (architecture `lieu-fixe`, Le Petit Bleu) : une rubrique par service en `<details>` natif (la première ouverte), titre de carte en très grand, et dedans les lignes `services[].lignes` (nom, prix, détail) alignées par des pointillés ; une rubrique sans lignes montre ses `bullets`, une ligne sans prix reste sans prix. Café, crêperie, boulangerie, barbier, institut : tout client qui a une carte ou une grille de tarifs. `ff composer` ne la prend que si un service a des lignes. |
| `cartes-empilees` | **Architecture `cartes-empilees-agenda`** (De Groene Afslag, `docs/veille/architectures/groene-afslag.md`) : une carte de couleur pleine largeur par activité (couleurs tirées des tokens : surface, accent, teinte pâle, encre, fond 2), qui colle en haut et se fait recouvrir par la suivante (`position: sticky`, ordinateur, aucun script) ; au téléphone, pile de chapitres, photo en portrait bord à bord. Nom en étiquette, phrase, lignes, lien vers la page. Seulement avec son architecture (3 à 6 activités). |
| `liste-a-filets` | **Architecture `livre-ecrans`** (Du Pain et des Idées) : un écran, une photo d'un côté, les activités en très grands titres séparés par des filets, chacun vers sa page ; puis, s'il reste des photos, un écran de photo seule pleine largeur. Seulement avec son architecture. |
| `cartes-couleur` | **Une rangée de cartes, une couleur par activité** (architecture `cadre-couleur`, Meyers, `docs/veille/architectures/meyers.md` ; `ff composer` la prend aussi dès qu'une activité a sa couleur) : la photo du client en haut, puis sur l'aplat le nom, la phrase, le prix, la flèche ; toute la carte est le lien vers la page. La couleur vient de `services[].couleur` (hex ou oklch, encre choisie par contraste, `src/lib/couleur.ts`) ; sans couleur, toutes les cartes prennent la même teinte douce de l'accent. 2 à 6 activités. |
| `saisons` | **Les activités rangées par saison** (architecture `saisons-sorties`, Bureau des guides de La Grave, `docs/veille/architectures/saisons-sorties.md` ; la coquille `saisons` en fait son premier écran, la variante sert dans un autre déroulé) : une colonne par saison donnée par le client (`services[].saison`), le nom de la saison en très grand, ses activités à filets vers leur page avec le nombre réel de sorties, la porte « par public » (`/pour/<public>`), puis « À la une cette saison » (`sorties[].enAvant`, cartes datées et cotées). Chaque groupe porte `id="saison-<slug>"` : la nav n'a plus qu'une entrée par saison. Moins de deux saisons = une liste simple. `ff composer` ne la prend que dès deux saisons de deux activités. |
| `programme` | **Le programme de la semaine** (architecture `ardoise-du-jour`, The Cheese Board Collective, `docs/veille/architectures/ardoise-du-jour.md` ; la coquille `ardoise` en montre le jour sur son ardoise, la variante sert dans un autre déroulé, sous un héros) : ce qui change selon le jour (`services[].programme` : pain du mardi, plat du jour, pizza du jour), un bloc par jour de lundi à dimanche, le jour courant marqué DANS LE NAVIGATEUR (`aria-current`, fuseau Europe/Paris ; sans script la semaine telle quelle), les exceptions datées à venir (`site.ardoise`), les produits de tous les jours (`services[].tousLesJours`), chaque activité vers sa page. Un jour sans entrée le dit, sans rien inventer ; des jours illisibles restent tels que le client les écrit. Aucun programme = rien. `ff composer` ne la prend que si une activité a un programme. |

### `about`
| Variante | Quand l'utiliser |
|---|---|
| `portrait` | Un portrait du client disponible, histoire courte. |
| `story` | Pas de photo, histoire longue à raconter (texte porteur). |
| `values` | Le brief a surtout des valeurs (section 6) plus qu'une histoire narrative. |
| `timeline` | Plusieurs jalons datés fournis (`about.milestones`). |
| `overlap` | Un portrait et, idéalement, une seconde photo (équipe ou réalisation) : panneau sombre arrondi, l'histoire et les valeurs à gauche, les deux photos qui se chevauchent et débordent sous le panneau. Composition éprouvée (modèle Framer HandGrid) : préférée par `ff composer` quand il y a un portrait. |
| `ecran-texte-photo` | **Architecture `livre-ecrans`** (Du Pain et des Idées, `docs/veille/architectures/du-pain-et-des-idees.md`) : l'histoire en écrans de livre, un paragraphe (50 signes de large) et une photo portrait décalée par écran, côté alterné, et entre deux un écran de photo seule tant que le client en a. Il faut 2 paragraphes au moins (`about.story`) et beaucoup de photos. Seulement avec son architecture. |
| `espaces` | **Architecture `scenes-epinglees`** (TAB Kitchen & Bakery, `docs/veille/architectures/tab-kitchen.md`) : on traverse le lieu pièce par pièce, un panneau de couleur par espace de `about.espaces[]` (nom, phrase, photo et couleur optionnelles) qui pousse le précédent dans une scène épinglée à étapes (`data-pin` sur la scène, `data-pin-step` par panneau, fondu croisé en temps, jamais de calage image par image) ; hors motion `rich` ou en mouvement réduit, les panneaux sont empilés. Il faut 3 espaces au moins ; sans espace, rien. Seulement avec son architecture. |
| `equipe-cartes` | **L'équipe en cartes qui arrivent de côté** (architecture `scenes-epinglees`, mais se tire dès que `about.team` existe) : une carte par personne (photo portrait, nom, rôle), rayon de carte de la direction, pas de rond ni de pilule ; en rangée à l'ordinateur, file au doigt au téléphone. Id `equipe` (l'id `about` est pris par les espaces). Sans équipe, rien. |

### `proof`
| Variante | Quand l'utiliser |
|---|---|
| `google` | Note + nombre d'avis Google fournis, rien d'autre. |
| `testimonials` | Avis clients réels avec texte fournis (section 7 du brief). |
| `gallery` | Photos de réalisations fournies, pas forcément d'avis. Sous chaque photo, la ligne lieu – type – mesure – client (`proof.gallery[].place/kind/size/client`, seulement ce que le brief § 8 donne) ; dès deux `kind` distincts, une rangée de boutons radio « Tout / Cuisine / Escalier » filtre la grille sans JS (`:has()`) ; « N réalisations » affiché à partir de 4 photos. Geste 5 des démontages (KS, Artisans de Genève, Mathilde De Chiara). |
| `before-after` | Paires avant/après fournies (rénovation, travaux). |
| `logos` | Logos de partenaires/clients B2B fournis. |
| `marquee-quotes` | Plusieurs témoignages courts, direction animée. |
| `citations` | **Architecture `livre-ecrans`** : trois écrans de livre, un avis en grande citation sur un aplat (la note Google dessous), deux photos décalées sans texte, un second avis à côté d'une photo portrait. Seulement avec son architecture et des avis recopiés. |

### `zones`
| Variante | Quand l'utiliser |
|---|---|
| `list` | Défaut, liste simple de villes. |
| `map` | Une carte (`<Carte />`, voir § Carte ci-dessous) est utile en plus de la liste. |
| `chips` | Beaucoup de villes (>8), direction clair/brut, présentation compacte. |
| `adresses` | **Bandeau des adresses** (architecture `pages-adresses`, Ten Belles, `docs/veille/architectures/pages-adresses.md` ; la coquille `adresses` en fait son premier écran, la variante sert dans un autre déroulé, sous un héros) : une rangée par lieu (`lieux[]`) à filets, le nom vers `/adresses/<slug>`, la rue, l'état du jour (horaires de CE lieu), son téléphone en `tel:` (repli : le numéro principal), l'itinéraire, la photo du lieu en vignette. Aucun lieu = rien ; la nav ne pointe jamais vers `#zones` (les pages de lieux la remplacent). `ff composer` ne la prend que dès deux lieux. |
| `tournee` | **La semaine de tournée** (architecture `tournee-semaine`, Pizza P'tit Louis et Le Camion à Pizzas, `docs/veille/architectures/tournee-semaine.md` ; la coquille `tournee` la met sous l'étape du moment, la variante sert dans tout déroulé d'un client itinérant) : un bloc par jour qui a une étape (`site.tournee`), une ligne par étape : la commune vers `/tournee/<commune>`, le moment et les heures, le repère, le véhicule et son téléphone en `tel:` (repli : le numéro principal), l'itinéraire ; le jour courant marqué dans le navigateur. Les jours sans étape ne sont pas inventés « repos » ; des jours illisibles restent tels quels. La nav remplace l'ancre par la page `/tournee`. Aucune étape = rien. |

### Carte (sans traceur)

`src/components/Carte.astro` est utilisé par `zones/map` et `contact/full` (jamais d'`<iframe>` brute
dans une section). Contrôlé par `contact.mapsProvider` (`'osm' | 'google' | 'none'`, défaut `'osm'`) :

- `'osm'` + `contact.coordinates` (`{ lat, lng }`) fournies → tuiles OpenStreetMap statiques (zoom 15,
  grille 2×2), marqueur superposé, attribution obligatoire. Aucun cookie, aucun JS. **Sans
  `coordinates`, ne pas en inventer** : le composant retombe sur le bloc adresse seul.
- `'google'` + `contact.mapsEmbed` fourni → façade cliquable (CNIL) : l'iframe Google Maps n'est
  injectée qu'après un clic explicite sur le bouton, jamais au chargement de la page.
- `'none'`, ou données manquantes pour le provider choisi → bloc adresse seul (+ lien `mapsUrl` si
  fourni). C'est le repli par défaut : ne jamais fabriquer des coordonnées ou un embed absents du brief.

Par défaut (`mapsProvider` non renseigné) un site n'a donc aucun traceur lié à la carte, et pas de
bannière cookie à prévoir pour cette raison — argument à mettre en avant en vente (voir
`docs/veille/seo-conversion.md` § 3.4). Ne choisir `'google'` que si le client tient explicitement à
Google Maps ; c'est alors la façade, jamais l'iframe directe, qui doit être utilisée.

### `process`
| Variante | Quand l'utiliser |
|---|---|
| `steps` | Le client a décrit ses étapes de travail (devis → intervention → suivi). |
| `timeline` | Étapes avec une notion de durée/chronologie. |
| `numbered` | Peu d'étapes (2-4), direction typographique (journal, brut). |
| `horizon` | Chapitre épinglé qui défile horizontalement (`data-horizontal`, desktop ≥ 1024 px, motion `rich`) : une étape par écran, numéro géant, photo de l'étape si `process[i].image` est renseignée. Sous 1024 px, en `subtle`/`none` ou avec `prefers-reduced-motion` : étapes empilées, sans épinglage. **C'est le seul effet riche de la page** (règle 16) : jamais avec un marquee, un `data-frames` ou un shader. Métiers en étapes de chantier (menuisier, couvreur, forge). Exemple : `atelier-lecerf`. |

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
| `photo` | Le client a des photos (réalisations, services) : une photo en pleine largeur sous un voile sombre, l'appel centré dessus. Image en grand entre deux sections. Composition éprouvée (modèle Framer PlumFix) : préférée par `ff composer` dès qu'une réalisation ou une photo de service existe. |

### `contact`
| Variante | Quand l'utiliser |
|---|---|
| `form-split` | Défaut, formulaire + coordonnées côte à côte. |
| `form-card` | Formulaire seul mis en avant dans une carte. |
| `simple` | Peu d'infos de contact, pas besoin de mise en scène. |
| `full` | Beaucoup d'infos (horaires, carte, plusieurs moyens de contact). |
| `ecran` | **Architecture `livre-ecrans`** : le dernier écran du livre, sur un aplat : adresse (lien carte), téléphone en grand, e-mail, horaires, portes en ligne, formulaire replié dans un `<details>`. Ferme aussi chaque page d'activité (gabarit `livre` de `layout.servicePage`). |

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
| `sourceSerif4` | Source Serif 4 Variable | both | éditorial, polyvalent |
| `crimsonPro` | Crimson Pro Variable | both | livre, littéraire |
| `ebGaramond` | EB Garamond Variable | both | classique, élégant |
| `spectral` | Spectral | both | éditorial contemporain |
| `cormorantGaramond` | Cormorant Garamond Variable | display | luxe raffiné |
| `libreBodoni` | Libre Bodoni Variable | display | mode, haute couture |
| `zillaSlab` | Zilla Slab | both | robuste, lisible |
| `bitter` | Bitter Variable | both | slab doux, lecture écran |
| `domine` | Domine Variable | both | sobre, éditorial |
| `abrilFatface` | Abril Fatface | display | éditorial gras, mode |
| `yesevaOne` | Yeseva One | display | féminin, décoratif |
| `oswald` | Oswald Variable | display | condensé, affiche |
| `cabin` | Cabin Variable | body | humaniste, doux |
| `karla` | Karla Variable | body | net, contemporain |
| `rubik` | Rubik Variable | both | rond, amical |
| `urbanist` | Urbanist Variable | both | urbain, élégant |
| `chivo` | Chivo Variable | display | grotesque robuste |
| `familjenGrotesk` | Familjen Grotesk Variable | both | scandinave, épuré |
| `geist` | Geist Variable | both | tech, minimal |
| `ibmPlexSans` | IBM Plex Sans Variable | body | corporate lisible |
| `lexend` | Lexend Variable | body | lisibilité, accessible |
| `publicSans` | Public Sans Variable | body | institutionnel, neutre |
| `plusJakartaSans` | Plus Jakarta Sans Variable | body | moderne, chaleureux |
| `alfaSlabOne` | Alfa Slab One | display | slab massif, affiche |
| `bungee` | Bungee | display | urbain, signalétique |
| `geistMono` | Geist Mono Variable | mono | tech, précis |
| `ibmPlexMono` | IBM Plex Mono | mono | code, technique |
| `spaceMono` | Space Mono | mono | rétro tech |
| `dmMono` | DM Mono | mono | fin, discret |
| `fragmentMono` | Fragment Mono | mono | élégant, mono display |

**Règle** : une surcharge de police (`typography.display` ou `typography.body`) ne doit **jamais**
reprendre la paire par défaut de la direction choisie — sinon la surcharge ne sert à rien et deux
clients dans la même direction se ressembleront trait pour trait. Vérifie `src/directions/<direction>/index.css`
avant de choisir.

Dix paires à essayer pour varier un override (display / corps). Aucune police de la liste « signes
IA » (`docs/veille/signes-ia.md`, `ff ia` : Inter, Playfair, Syne, DM Sans, Manrope, Lora...), que le
sélecteur écarte aussi depuis le 13 oct 2026 :

1. `literata` / `publicSans` — sobre, lisible, universel.
2. `spectral` / `karla` — éditorial adouci.
3. `gloock` / `hanken` — affirmé sur suisse sobre.
4. `epilogue` / `figtree` — architecture nette, doux.
5. `familjenGrotesk` / `workSans` — grotesque net, simple.
6. `josefin` / `gelasio` — art déco calme.
7. `schibsted` / `nunito` — presse nordique, rond amical.
8. `bricolage` / `redHat` — vivant, pop, discret en dessous.
9. `delaGothic` / `chivo` — ultra gras pop sur sans franc.
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

## Disposition (shell)

`layout.shell` (`src/shells/<nom>.astro`) decide de la disposition globale de la page — nav, hero,
sections et footer restent les memes composants, seule leur mise en page change. Une coquille ne
restyle jamais une section (voir `docs/CONVENTIONS.md` § Coquilles).

| Shell | Quand l'utiliser |
|---|---|
| `flow` (défaut) | Colonne classique : nav en haut, hero, sections empilées, footer. Convient à tout, c'est le choix sûr par défaut. |
| `split` | Panneau latéral fixe (nom, métier, navigation numérotée, téléphone, réseaux) à gauche, contenu qui défile à droite. **Sommaire actif** : le lien de la section visible passe en `fg` avec un trait d'accent (`aria-current`, voir `docs/CONVENTIONS.md` § Coquilles). Va bien avec `nav: 'bar'` ou `'minimal'` (le panneau remplace la nav sur desktop) ; évite `nav: 'floating'`. Agences, cabinets de conseil — tout ce qui bénéficie d'un accès permanent au téléphone/à la navigation. |
| `sidebar` | Rail vertical étroit fixe à gauche (monogramme, compteur de position « 02 / 06 », liens en texte vertical, téléphone), contenu pleine largeur décalé. **Sommaire actif** comme `split`. Même contrainte que `split` : évite `nav: 'floating'`. Studios créatifs, ateliers d'artiste — identité forte, esthétique minimale. Exemple : `forge-delacroix`. |
| `slides` | Chaque section occupe un écran plein, défilement aimanté (scroll-snap proximity, jamais piégeant). Réservé aux sites courts et aux directions peu animées : `motion !== 'rich'` (une direction déjà très animée + un défilement aimanté surchargerait l'expérience). |
| `magazine` | Grille asymétrique : largeurs et décalages alternés, grands numéros de section en marge sur desktop. Évite `scale: 'compact'` (la mise en marge a besoin d'air). Cabinets, agences de design, journaux — mise en page éditoriale affirmée. |
| `sticky-hero` | Le hero reste épinglé en fond, les sections glissent par-dessus comme une feuille. Marche mieux avec un hero plein écran : `hero` en `fullbleed`, `typographic` ou `video`. Maisons de luxe, hôtellerie, restauration — une image ou un message qui reste present pendant tout le défilement. |
| `index` | **Site-index : le menu EST la page.** Un seul écran — ligne d'identité (nom, métier · ville, téléphone, CTA du tiroir) puis liste géante des entrées : les prestations `/services/<slug>` en liens réels quand le layout n'a pas de section `services` (photo révélée au survol, `data-hover-img`, motion `rich`), et chaque section du layout en `<details>` natif qui se déroule sous son entrée (une seule ouverte à la fois, `aria-expanded` tenu à jour, ancre `#id` qui ouvre l'entrée). `layout.hero` n'est pas rendu (réduit à la ligne d'identité + tagline en pied), les sections `cta` non plus, aucune `<nav>` séparée. Contact : `contactDrawer: true` ou section contact en dernière entrée. Éviter dans ses sections les effets pilotés par le scroll (`data-horizontal`, `data-pin`, `data-text-fill`) : ils se calculent sur un panneau fermé. 4 à 8 entrées. Photographe, artiste, architecte d'intérieur — jamais un métier d'urgence. Exemple : `anna-vidal`. |
| `carte` | **Architecture `carte-de-visite`** (ne se prend qu'avec elle : `layout.architecture: 'carte-de-visite'`, `src/lib/architectures.ts` ; source Nowa, `docs/veille/architectures/nowa.md`). L'accueil est **un seul écran** : la photo du client posée en carte dans une marge, le salut du moment en grand (« Bonjour », « Bonsoir » après 18 h), l'identité (h1 + « métier à ville ») en bas à gauche, le panneau d'infos en bas à droite (téléphone en tête, adresse, écrire = tiroir, horaires du jour avec l'état ouvert / fermé, note Google), une petite carte des pages (services, portes en ligne) en haut à droite ; au téléphone, l'identité au-dessus de la photo et le panneau qui remonte dessus. Aucune nav, aucune section empilée. Données : **peu de services (6 au plus) et une très bonne photo** (`images.hero`), pas d'urgence ; commerce qui ouvre, bar ou restaurant qui vit sur Instagram, artisan d'art qui veut être trouvé et appelé, deuxième adresse. Sans photo, la carte reste un aplat d'encre : on demande la photo. |
| `index-projets` | **Architecture `index-projets`** (ne se prend qu'avec elle : `layout.architecture: 'index-projets'` ; sources Mathilde De Chiara et House of Honey, `docs/veille/architectures/mathilde-de-chiara.md`, `projets-fiches.md`). **L'accueil est l'index des réalisations**, réglable par le visiteur sans JavaScript (radios + `:has()`) : filtre par type (`kind`, dès deux types) et affichage « Défilé » (une colonne d'images au centre) ou « Grille » (toutes les vignettes) ; marge gauche fixe = h1, « métier à ville », téléphone, note Google, compteur réel, liens (À propos, écrire, pages des services) ; marge droite fixe = les réglages ; au téléphone tout s'empile, identité en tête. Chaque réalisation de `realisations[]` a sa page `/realisations/<slug>` (série de photos à ancres, lieu, type, mesure, année, texte, crédit) ; sans elles, l'index prend `proof.gallery` (sans page). Histoire et contact sur `/a-propos` (`layout.pageAPropos`, posé par l'architecture). Données : **15 réalisations au moins, classables en 3 à 5 types**, pas d'urgence ; agenceur, ébéniste, carreleur, paysagiste, photographe, architecte d'intérieur. |
| `lieu-fixe` | **Architecture `lieu-fixe`** (ne se prend qu'avec elle : `layout.architecture: 'lieu-fixe'` ; source Le Petit Bleu, `docs/veille/architectures/le-petit-bleu.md`). **Écran partagé, variante inversée et photographique de `split`** : à droite le lieu reste fixé à l'écran (photo du client, état « Ouvert / Fermé / Ouvre à … » et ligne du jour en haut, carte « Nous trouver » en bas : adresse, téléphone, écrire) ; à gauche défilent la carte d'accueil (h1 = accroche, « métier à ville », une porte par intention en colonne), puis les sections (carte à prix `services/carte-prix`, avis, histoire). À l'ordinateur, un en-tête court dans la colonne de gauche remplace la nav ; au téléphone, nav du site, accueil, lieu, sections. Une page par rubrique (`servicePage: 'porte'`, lignes à prix comprises), nommée dans la nav. Données : **une adresse où l'on vient, des horaires, une bonne photo du lieu, une carte ou des tarifs avec prix** (`services[].lignes`) ; café, crêperie, boulangerie, salon de thé, barbier, institut, fromagerie, caviste. Jamais pour un artisan qui se déplace. |
| `panneaux` | **Architecture `panneaux-tranche`** (ne se prend qu'avec elle : `layout.architecture: 'panneaux-tranche'` ; source Studio RHE, `docs/veille/architectures/studio-rhe.md`). **Le site se range comme des chemises** : à l'ordinateur, des panneaux pleine hauteur côte à côte glissent vers la gauche quand on descend (défilement vertical natif qui pilote une piste collante, `src/scripts/bande.ts`, jamais simulé), tranche fixe à droite (nom vertical + progression en %), rail fixe à gauche (initiale, « Depuis », téléphone, menu). Couverture (h1 + métier à ville + téléphone + note), l'atelier (vers `/a-propos`), une réalisation par panneau (vers sa page et `/realisations`), le métier, une grande photo, les avis sur l'aplat d'accent, le journal. Téléphone et `prefers-reduced-motion` : panneaux empilés, réalisations qui glissent au doigt (`scroll-snap`). Il faut 6 réalisations au moins (`realisations[]`). |
| `carnet` | **Architecture `carnet-horizontal`** (ne se prend qu'avec elle : `layout.architecture: 'carnet-horizontal'` ; source Gingko, `docs/veille/architectures/gingko.md`). **Un carnet qu'on feuillette** : même bande que `panneaux` mais en chapitres de largeurs inégales posés en couches (présentation et notes, une réalisation étiquetée, une photo étroite, la liste des réalisations, la méthode, les avis en notes, les artisans partenaires `partenaires[]`, le contact en bout de bande), rail fixe à gauche (nom, téléphone, menu). Téléphone : page verticale, la liste des réalisations glisse au doigt. |
| `livre` | **Architecture `livre-ecrans`** (ne se prend qu'avec elle : `layout.architecture: 'livre-ecrans'` ; source Du Pain et des Idées). **Un livre** : couverture en double page (la photo en planche sur le papier, le h1, le métier, la rue, le téléphone, la note), puis un écran par idée (`about/ecran-texte-photo`, `proof/citations`, `services/liste-a-filets`, `contact/ecran`) ; chaque page d'activité suit la même grammaire (`layout.servicePage: 'livre'`, `src/components/ServiceLivre.astro`). Il faut une vraie histoire (2 paragraphes au moins) et 10 photos. |
| `cartes-agenda` | **Architecture `cartes-empilees-agenda`** (ne se prend qu'avec elle ; source De Groene Afslag). **Le lieu qui publie** : en-tête à porte « Agenda » toujours en haut (+ téléphone, menu), la photo du lieu avec le nom en étiquettes, le h1, puis `services/cartes-empilees`, les prochains rendez-vous en cartes datées (`agenda[]`, `src/components/ProchainsRendezVous.astro`, page `/agenda` filtrable), les avis, les nouvelles (`conseils`). Il faut des rendez-vous datés à venir (3 au moins). |
| `vitrine` | **Architecture `gamme-vitrine`** (ne se prend qu'avec elle : `layout.architecture: 'gamme-vitrine'` ; source Agrumea Farm, `docs/veille/architectures/agrumea.md`). **Catalogue d'abord** : l'accueil tient en un écran et n'est rien d'autre que la gamme (`produits[]`) en piste horizontale manuelle (`scroll-snap`, flèches, jamais la molette détournée), chaque produit détouré pivote selon sa place et mène à `/produits/<slug>` ; sous la piste le h1, « métier à ville », la note Google, le nombre de produits et `/produits` ; barre fixe (nom, téléphone, « Menu » = `<dialog>` plein écran : Produits, À propos, activités, Contact = tiroir). Fiche produit : titre géant, le produit devant les lettres, famille et prix en marge, phrase et composition, fiche à filets (conseils, formats en pastilles rondes, conservation), photos d'ambiance aimantées, les autres produits. Il faut **6 à 20 produits avec une photo détourée chacun** ; sans produit, l'accueil se rabat sur un sommaire et le build le dit. |
| `cadre` | **Architecture `cadre-couleur`** (ne se prend qu'avec elle : `layout.architecture: 'cadre-couleur'` ; source Meyers, `docs/veille/architectures/meyers.md`). **Tout le site dans un cadre de couleur fixe**, dérivé de `sticky-hero` : une marge de 24 px tout autour (16 au téléphone), fond 2 à peine réchauffé d'accent (jamais un aplat vif), la nav `minimal` rentrée dans le cadre en bande de papier ; le premier écran collé au fond (h1 géant et « métier à ville » sur le papier, téléphone et note Google à côté, la photo du client dessous), puis les sections en feuille qui monte par-dessus avec une seule ombre (`about/story`, `services/cartes-couleur`, `proof/testimonials`), le pied dans le cadre ; contact en tiroir ; une page par activité (`servicePage: 'porte'`) coiffée de sa couleur (`services[].couleur`). Il faut une photo de héros et 2 à 6 activités. |
| `scenes` | **Architecture `scenes-epinglees`** (ne se prend qu'avec elle ; source TAB Kitchen & Bakery, `docs/veille/architectures/tab-kitchen.md`). **On traverse le lieu**, dérivé de `slides` (un écran par bloc, défilement aimanté en proximity) : barre fine fixe (nom, métier à ville, téléphone, menu `<details>` vers les pages et les ancres), scène d'ouverture sur aplat d'encre (h1 géant en bas, note Google et porte d'écriture à droite), puis `about/espaces` (scène épinglée à étapes, un panneau de couleur par espace), `about/equipe-cartes`, `proof/testimonials`, `contact/simple`, le pied. Au plus 8 écrans. `motion: 'rich'` pour l'épinglage (sinon panneaux empilés). Il faut 3 espaces (`about.espaces`) et 3 photos. |
| `adresses` | **Architecture `pages-adresses`** (ne se prend qu'avec elle : `layout.architecture: 'pages-adresses'` ; source Ten Belles, `docs/veille/architectures/pages-adresses.md`). **Le site se range par adresse** : le premier écran EST le carnet d'adresses, l'intro (h1, « métier à ville », ancienneté, nombre d'adresses, téléphone principal, note Google, les savoir-faire communs nommés une fois, chacun vers sa page) puis une section par lieu (`lieux[]`, 4 au plus côte à côte à l'ordinateur, l'un sous l'autre au téléphone : photo, nom vers `/adresses/<slug>`, rue, état du jour, téléphone du lieu, itinéraire), un bandeau vers `/professionnels` si `site.pros`, le pied en colonnes qui répète les adresses. Pages : `/adresses/<slug>` (fiche pratique : photo, phrase et année du lieu, horaires de la semaine, adresse, téléphone, règles, photos, ce qu'on y trouve, les autres adresses, JSON-LD `LocalBusiness` par lieu), `/adresses` (toutes les adresses + formulaire), `/professionnels`, `/a-propos`. Nav : deux adresses = leurs deux noms, trois et plus = « Nos adresses ». Il faut **2 adresses au moins avec rue et horaires** ; sans lieu, un premier écran photo + h1 et le build le dit. |
| `saisons` | **Architecture `saisons-sorties`** (ne se prend qu'avec elle : `layout.architecture: 'saisons-sorties'` ; source Bureau des guides de La Grave, `docs/veille/architectures/saisons-sorties.md`). **Le temps range le site** : en tête le h1, « métier à ville », les diplômes (`business.certifications`), le téléphone, la note Google, la porte « par public » ; au téléphone, les saisons en diptyque de photos en tête de l'écran ; puis une section par saison (`services[].saison`, côte à côte à l'ordinateur) : sa photo, son nom en très grand, ses activités vers leur page ; puis « À la une cette saison » (`sorties[]`, `enAvant`). Nav : une entrée par saison (ancres), À propos, Contact (tiroir au formulaire qui propose les sorties). Pages : `/sorties/<slug>` (repères en mots, Programme / Inclus / À prévoir en `<details>`, prix, condition, Réserver), la page de chaque activité avec ses sorties filtrables par niveau (radios + `:has()`, sans script), `/pour/<public>` (trois sorties ou plus pour un même public), `/a-propos`. Il faut **2 saisons de 2 activités et 4 sorties au moins** ; moins de deux saisons, une colonne unique et le build le dit. |
| `ardoise` | **Architecture `ardoise-du-jour`** (ne se prend qu'avec elle : `layout.architecture: 'ardoise-du-jour'` ; source The Cheese Board Collective, `docs/veille/architectures/ardoise-du-jour.md`). **L'accueil est l'ardoise d'aujourd'hui** : en tête le h1, « métier à ville » et l'ancienneté, le téléphone, la note Google ; la photo du lieu en bandeau (`images.hero`, sinon un aplat) et posées dessus, remontées d'un cran, les ardoises sur l'encre, chacune un bloc : les horaires (état du jour, adresse, téléphone : `id="contact"`), le programme du jour (`src/components/ArdoiseDuJour.astro` : la semaine rendue au build, le jour gardé par le navigateur, l'exception datée du jour à la place de son activité), le prochain rendez-vous (`agenda[]`) ; puis les 3 dernières annonces (`conseils`), les avis (`proof/testimonials`), le pied en colonnes. Pages : `/programme` (la semaine de chaque activité, horaires), le programme sur la page de chaque activité, `/a-propos`. Nav : « Le programme » (`wording.programme`). Il faut **un programme sur 3 jours, des horaires et une rue** ; sans programme, les horaires seuls et le build le dit. |
| `tournee` | **Architecture `tournee-semaine`** (ne se prend qu'avec elle : `layout.architecture: 'tournee-semaine'` ; sources Pizza P'tit Louis et Le Camion à Pizzas, `docs/veille/architectures/tournee-semaine.md`). **L'accueil dit où est le camion** : le h1, « métier à ville » et l'ancienneté, le nombre de communes, le numéro principal, la note Google ; puis l'étape du moment sur l'encre (`src/components/EtapeDuJour.astro` : « Aujourd'hui », « Demain » ou le jour ; commune vers sa page, heures, repère, bouton d'appel du véhicule ; `id="contact"` ; sans script, toute la semaine), à droite sur toute la hauteur à l'ordinateur, sous le h1 et avant la photo au téléphone ; puis la semaine (`zones/tournee`), la carte (`services/carte-prix`), les avis, le pied. Pages : `/tournee` (la semaine, les communes), `/tournee/<commune>` (h1 « métier à commune », jours de passage, repère, heures, téléphone, itinéraire, JSON-LD par étape sans adresse fixe), `/a-propos`. Nav : « Où nous trouver » (`wording.tournee`). Il faut **3 étapes avec jour, commune et heures** ; sans tournée, le numéro seul et le build le dit. |

Ces contraintes (« va bien avec », « évite ») sont les règles d'adéquation appliquées par
`ff composer` (`scripts/ff/composer.mjs`, fonction `shellFits`) et vérifiées pour chaque modèle par
`tests/presets.test.mjs`.

### Choix automatique du squelette par métier

`ff composer` ne se contente pas de choisir une direction (une ambiance) : il choisit aussi un
**squelette** (`layout.shell` + `nav` + `contactDrawer` + variante `process` conseillée), sinon le
prochain client retombe systématiquement sur `flow` + contact en bas de page — le reproche du
fondateur (`docs/veille/squelettes.md`, `docs/veille/inventaire-outils.md`). La table
`SQUELETTES_PAR_METIER` (`scripts/ff/composer.mjs`) reconnaît le métier du client et impose une
coquille parmi deux options par famille :

| Famille de métier | Coquille (préférée / repli) | Réglages imposés |
|---|---|---|
| Portfolio (photographe, tatoueur, chambres d'hôtes, artiste, galerie) | `index` / `sticky-hero` | — |
| Urgence (plombier, couvreur, serrurier, électricien, dépanneur) | `flow` / `split` | `contactDrawer: true`, `nav: 'bar'` |
| Réglementé (ostéopathe, vétérinaire, dentiste, avocat, notaire, médecin) | `slides` / `sidebar` | `motion: 'subtle'` (jamais `rich`) |
| Atelier à étapes (menuisier, forge, ferronnier, auto-école, traiteur) | `flow` / `sidebar` | variante `process/horizon` si le site a ≥ 3 étapes |
| Accueil/plaisir (restaurant, hôtel, institut, spa, beauté, coiffure) | `sticky-hero` / `index` | — |
| Création/espace (architecte, paysagiste, décoration) | `magazine` / `split` | — |

**Malus de réutilisation** : si la coquille préférée de la famille est déjà portée par ≥ 3 sites
existants, `ff composer` bascule automatiquement sur le second choix de la famille — jamais un
troisième squelette inventé. La sortie de `ff composer` affiche un bloc « Squelette retenu » avec la
raison en une ligne (ex. « métier urgence → contact en tiroir, nav bar ») et l'alternative écartée.
Un métier sans famille reconnue garde l'ancien comportement (tirage pondéré générique, `shellFits`).
Voir `pickSquelette` (fonction pure, testée dans `tests/composer.test.mjs`) et les 18 sites
re-squelettés à la main qui ont servi de référence : `anna-vidal`, `moteur-fils`/`ampere-fils`,
`osteo-marchand`/`veto-du-drac`, `atelier-lecerf`, `cantine-roulante`, `auto-ecole-rabelais`,
`barbier-kessler`, `maison-roux`, `dubois-plomberie`, `toits-cie`, `lemaire-avocats`,
`forge-delacroix`, `jardins-mael`, `studio-ambre`, `chez-malo`, `maison-aurore`.

### Réglages transversaux (toutes coquilles)

| Réglage | Quand l'utiliser |
|---|---|
| `layout.contactDrawer: true` | **Contact en tiroir** : un `<dialog>` natif (formulaire + coordonnées) s'ouvre depuis tout lien `#contact` — nav, CTA, bandeau — sans descendre en bas de page ; plein écran sur mobile. Métiers d'urgence (plombier, couvreur, serrurier, électricien, dépannage) et tout site où la demande doit partir en une seconde. La section contact finale reste possible en plus ; sans elle, le tiroir est la seule porte. Exemples : `dubois-plomberie`, `toits-cie`. Détail : `docs/CONVENTIONS.md` § Coquilles. |
| `layout.actionBar: true` | **Barre d'actions collée en bas sur téléphone** (< 768 px, `src/components/BarreActions.astro`) : 2 à 3 portes de `actions()` (Réserver, Commander, Bon cadeau, Appeler, Devis), au-dessus de la barre iPhone (`safe-area-inset-bottom`), cachée quand le pied de page est visible ; sans JS, toujours visible. Commerces, restaurants, salons : tout métier où le visiteur vient réserver ou commander depuis son téléphone. Ignorée avec `nav: 'dock'` (déjà une barre basse). Les portes se règlent dans `contact.bookingUrl` / `orderUrl` / `giftCardUrl` (jamais devinés) et leurs libellés dans `wording.actions`. |
| `layout.servicePage: 'porte'` | **Pages d'activité à la même grammaire** (`src/components/ServicePorte.astro`, architecture `accueil-portes`) : grande photo, nom centré, labels (`business.certifications`), une phrase, deux photos puis quatre en grille (`services[].images`, photos du client), texte et bouton (première porte en ligne + téléphone), questions de la page (`faq[].service` = slug du service), adresse et horaires, autres activités. La nav nomme alors chaque page d'activité au lieu de l'ancre « Services ». Défaut `'fiche'` (texte et photo côte à côte). Client à plusieurs activités qui ont chacune leurs photos. |
| `layout.pageAPropos: true` | **Page `/a-propos` à deux colonnes** (portrait + contact | nom, métier et ville, histoire, valeurs ; `src/pages/a-propos/[...index].astro`) : l'histoire et le contact sortent de l'accueil, la navigation reçoit un lien « À propos » vers la page à la place de l'ancre. Posé par l'architecture `index-projets` ; utile à tout accueil qui ne raconte rien (portfolio, sommaire). |
| `transitions: true` | **Transitions de page** natives (ClientRouter, fondu 0,3 s, nav qui reste en place, hero qui persiste) entre l'accueil et les pages `/services/<slug>`, `/zones/<ville>`. À activer sur les sites multi-pages dont les scripts sur mesure passent par `onPage()` (`docs/ANIMATIONS.md` § Transitions de page). Exemples : `finck-fisch`, `dubois-plomberie`, `toits-cie`. |

### En-têtes

`layout.headings` force l'alignement des en-têtes de section :

| Valeur | Effet |
|---|---|
| `auto` (défaut) | Chaque section garde l'alignement défini par sa propre variante. |
| `center` | En-têtes centrés sur toutes les sections — direction posée, display, beaucoup de respiration (luxe, nuit, nordique). |
| `left` | En-têtes alignés à gauche — lecture éditoriale, cohérent avec un panneau latéral (`shell: 'split'`) ou une direction dense en texte (journal, encre). |

## Libellés

`wording` (`site.config.ts`) : `devis`, `ctaTitle`, `ctaText`, `contactTitle`, `contactText`, `actions`. Le défaut
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

**Portes d'action par intention** (`actions()`, `src/lib/actions.ts`) : les navs n'affichent plus un
seul bouton téléphone mais, dans cet ordre, Réserver (`contact.bookingUrl`), Commander
(`contact.orderUrl`), Bon cadeau (`contact.giftCardUrl`), Devis (`#contact`, si tiroir ou section
contact), Appeler (`tel:`). Sur ordinateur : la première en bouton plein, la deuxième en contour, les
suivantes en liens texte ; sur téléphone : la première seule dans la barre, les autres dans le menu.
Un lien absent du brief = pas de porte. Libellés : `wording.actions.{booking, order, giftCard, quote}`
(« Réserver une table », « Click & collect »…) ; `quote` reprend `wording.devis` par défaut.
Vu chez Délice, Relais Rossàr, Meyers (`docs/veille/demontages/INDEX.md`, geste 2).

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

Commandes du look :

- `node scripts/ff.mjs composer <slug>` — choisit automatiquement un look (direction + variantes)
  pour le site à partir de son `site.config.ts` (affiche la proposition ; `--ecrire` l'écrit dans `look.json`). Sert de proposition de
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
