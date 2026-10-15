# Références — 30 teardowns de sites premium pour artisans et petites entreprises

Document de travail Finck & Fisch. Objectif : disséquer 30 sites réels et en ligne qui « font cher »,
pertinents pour nos métiers (restaurateurs, salons, artisans, studios, cliniques, hôtels-boutique,
boutiques indépendantes, agences locales, freelances), pour en extraire des « moves » concrètes
transposables dans notre moteur (`src/directions/`, `src/sections/`, vocabulaire `data-*` de
`src/styles/global.css`). Complète `docs/veille/tendances.md` § 2 (tendances 2025-2026, non répété ici)
et `docs/veille/concurrents.md` (marché des prestataires) — celui-ci se concentre sur des sites finis,
pas des offres commerciales.

Méthode : recherche par galeries de prix (Awwwards, onepagelove, siteinspire, footer.design, lapa.ninja,
Godly) puis lecture directe du HTML/CSS de chaque site retenu (WebFetch, complété par `curl` brut quand
utile pour extraire polices et couleurs exactes). WebSearch était à quota épuisé pour la quasi-totalité
de cette veille : la découverte s'est donc faite par navigation directe des galeries, ce qui est indiqué
explicitement à chaque fois que c'est le cas. Quand un site n'a pas pu être fetché en détail (contenu
rendu en JavaScript, `curl` vide), c'est marqué « non vérifié en détail » et le teardown reste sur des
éléments confirmés par la structure/le texte réellement récupérés — aucune police ni couleur exacte n'est
inventée pour un site non vérifié.

Vocabulaire `data-*` du moteur, utilisé tout du long comme référence (voir `src/styles/global.css` et
`sites/chez-malo/sections/*.astro` pour des exemples déjà construits) :

`data-reveal` (+ `left`/`right`/`scale`/`blur`/`clip`/`wipe`/`mask`), `data-reveal-delay`, `data-stagger`,
`data-parallax`, `data-counter`, `data-split`, `data-marquee`, `data-magnetic`, `data-tilt`,
`data-text-fill`, `data-pin` + `data-pin-step`, `data-scrub`, `data-draw`, `data-hover-img`,
`data-nav="hide-on-scroll"`, `data-scale`, `data-tone="alternate"`, `data-headings`, `data-motion`.
Tokens : `--bg`, `--bg-2`, `--surface`, `--fg`, `--muted`, `--line`, `--accent`, `--accent-2`,
`--on-accent`, `--ink`, `--on-ink`, `--font-display`, `--font-body`, `--font-mono`, `--radius`,
`--radius-card`, `--shadow-card`, `--shadow-lift`, `--section-y`, `--container`.

---

## 1. Restaurants, cafés et hôtels-boutique (9)

### 1.1 The Devonshire — [devonshiresoho.co.uk](https://www.devonshiresoho.co.uk/)
**Type :** pub/restaurant gastronomique (gastropub, grill room, dining privé), Soho, Londres.

**Pourquoi ça fait cher :** le hero n'affiche pas de slogan générique mais l'adresse exacte comme
identité première (« The Devonshire | Denman Street, Soho »), un signal d'hyper-localisation assumée.
Le site segmente un seul lieu en trois « sous-marques » avec leur propre section-titre (Public House /
Restaurant & Grill Room / Private Dining Rooms), donnant une impression d'échelle et de spécialisation
plutôt qu'un menu plat. Les images (façade, grill room, four à bois, plats) sont traitées sans légende
décorative — un style documentaire plutôt que stock-photo mis en scène. La navigation est réduite à
l'essentiel (BOOK NOW, Menus, Hours, FAQ), une seule action en capitales qui tranche typographiquement
du reste — la hiérarchie se fait par la casse, pas par la couleur.

**Ordre des sections :** Hero (adresse comme titre) → Public House → Restaurant & Grill Room → Private
Dining Rooms → Menus → Hours → Join the team → Gift Vouchers → FAQ → Footer.

**3 moves :**
- Titre hero = nom de lieu/adresse précise plutôt que slogan générique → `data-split`.
- Une activité découpée en blocs « sous-marque » avec intro visuelle propre → `data-reveal` +
  `data-stagger` par section, `data-tone="alternate"` pour distinguer les blocs.
- Photographie pleine largeur, sobre, sans sur-légendage → `data-parallax="0.15"` léger sur les images
  hero, `data-scale="display"` sur les titres de section.

**À éviter :** multiplier des sections « sous-marque » avec statut de nav propre est excessif pour un
artisan mono-activité — ça simule une taille qui n'existe pas ; garder une identité hero unique et
honnête.

---

### 1.2 Nowa — [nowa.restaurant](https://nowa.restaurant/)
**Type :** restaurant contemporain, Allentown (Pennsylvanie, US).

**Pourquoi ça fait cher :** typeface Objektiv (confirmée par la fiche de la galerie), une géométrique
sans-serif typique de l'identité de marque haut de gamme, avec un guide de prononciation phonétique sous
le nom (« [no•wuh] ») — un détail de branding qui suppose un vrai travail de naming. Tout le contenu est
encadré par une bordure généreuse à marges très larges. Le contenu est volontairement épars — pas de
carte de prix, surtout un texte de « vision » et une capture email — ce qui cultive le mystère plutôt que
l'exhaustivité. Des fonds animés en mouvement derrière le texte suggèrent un parallax discret.

**Ordre des sections :** Hero (nom + prononciation) → Vision statement → Stay Informed (email) →
Location → Careers → Call CTA → Inquiry/contact → Footer.

**3 moves :**
- Guide de prononciation en micro-typo sous le nom de l'enseigne → `data-split` pour faire apparaître
  nom + prononciation comme deux temps distincts.
- Fond en mouvement léger derrière un texte de « vision » minimal → `data-parallax` sur le média hero +
  `data-text-fill` sur le paragraphe.
- Cadre/bordure persistante autour de tout le contenu → **à créer** (chrome de page permanent, absent du
  moteur ; à défaut, `--container` resserré et `--section-y` généreux).

**À éviter :** rester aussi minimal qu'une page « vision + email » sans aucune info pratique (horaires,
gamme de prix) est risqué pour un artisan local qui doit d'abord être trouvable et clair sur l'offre.

---

### 1.3 TAB Kitchen & Bakery — [tabkitchenbakery.com](https://tabkitchenbakery.com/)
**Type :** café-boulangerie/restaurant, Bangalore (Inde).

**Pourquoi ça fait cher :** le site embarque une interaction de glisser-déposer explicitement annoncée
(« <- Drag to see the elements -> »), un mécanisme bespoke absent des templates économiques. Le H1
« Take A Break » est éclaté sur plusieurs lignes empilées. Le ton éditorial est narratif et personnel
plutôt que transactionnel, et le site consacre une section à un client fidèle nommé, avec une
capitalisation interne volontairement décalée (« A RegulAr since 10 years »). Les membres de l'équipe
reçoivent leur propre traitement individuel.

**Ordre des sections :** Hero (« Take A Break » empilé) → Intro (ancrage local) → Localisation + carte →
« Bangalore's Breeze Included » → « Where Everything Begins » → Carte/menu → Profils équipe →
Témoignage client fidèle → Footer.

**3 moves :**
- Titre hero éclaté en lignes empilées avec capitalisation ludique → `data-split` pour un stagger
  mot/ligne.
- Galerie d'éléments à explorer au glisser → **à créer** (interaction pointeur libre ; `data-scrub` ne
  couvre que le décalage lié au scroll, pas le drag libre).
- Témoignage d'un client fidèle nommé, avec photo et citation en séquence → `data-reveal` +
  `data-stagger`, directement transposable à un artisan comme bloc de confiance locale.

**À éviter :** construire une interaction drag entièrement sur-mesure pour un site d'artisan mono-personne
est un investissement disproportionné — réserver à un seul « moment signature » du hero, pas généraliser.

---

### 1.4 Madie — [madie.es](https://madie.es/)
**Type :** pâtisserie de madeleines françaises/café, quartier Chamberí, Madrid.

**Pourquoi ça fait cher :** sélecteur trilingue (ES/EN/FR) sur un simple café-pâtisserie, positionnant
l'enseigne pour une clientèle internationale/touristique premium. La navigation s'ouvre en overlay plein
écran. Le site compte plus de 40 images avec des alt-text précis — une photographie produit dense et
dirigée, pas quelques clichés génériques. La carte est segmentée en sous-catégories fines de type retail
(Clásicos, Especiales, Café de especialidad, Bebidas premium…) plutôt qu'une liste plate. Des
micro-copies interactives (« Arrástrame » / « Desliza ») signalent des interactions swipe sur-mesure.

**Ordre des sections :** Sélecteur de langue → Hero → Nav (Carta / Catering / Visítanos) → Trois sections
image mises en avant → Nuestra historia → Carta (menu multi-catégories) → Catering → Grille Instagram →
Carte/localisation → Footer.

**3 moves :**
- Grille de photographie produit dense présentée comme mosaïque avant la carte → `data-reveal`
  (scale/clip) + `data-stagger`.
- Carte segmentée en catégories éditoriales fines plutôt qu'une liste de prix plate →
  `data-headings="left"` par catégorie + `data-stagger` sur les items.
- Nav en overlay plein écran → **à créer** (le moteur a `data-nav="hide-on-scroll"` mais pas de prise en
  charge plein écran).

**À éviter :** un sélecteur trilingue est disproportionné pour la plupart des artisans français visant
une clientèle locale/régionale — charge de maintenance pour un gain marginal, à réserver aux commerces
qui reçoivent vraiment un flux touristique international.

---

### 1.5 Le Petit Bleu — [lepetitbleucafe.com](https://www.lepetitbleucafe.com/)
**Type :** café/crêperie, La Nouvelle-Orléans (filiale du restaurant gastronomique Commander's Palace).

**Pourquoi ça fait cher :** mise en page en écran divisé — un panneau fixe à droite avec diaporama en
marquee et texte défilant, pendant que le contenu scrolle à gauche. Le footer crédite explicitement
l'institution mère (« ©2024 Commander's Palace »), un adossement de prestige utilisé comme signal de
confiance direct. Chaque plat a une photo d'ensemble ET une photo de détail en plongée. Le ton de la
copie mêle voix bilingue jouant sur l'héritage français et l'Americana régionale (« Bonjour, y'all! »).

**Ordre des sections :** Nav → Hero (« A café by Commander's Palace ») → Local Pickup & Delivery →
Catering → Hours/Location → Carrousel intérieur → Bellini Buddies → Carrousel food → Menu → Promo →
Boissons → About → Photo des co-propriétaires → Fil Instagram → Footer.

**3 moves :**
- Écran divisé avec panneau image fixe pendant que le contenu défile → `data-marquee` pour la bande de
  texte fixe + `data-pin`/`data-pin-step` pour maintenir le panneau image en place.
- Duo systématique de photos par plat (ensemble + détail) apparaissant ensemble → `data-reveal` en
  stagger pour que la paire s'anime comme un couple.
- Ligne de filiation/pedigree juste sous le titre hero (« A café by [nom reconnu] ») → `data-split` pour
  une courte ligne animée — transposable à un artisan citant une formation reconnue.

**À éviter :** un panneau marquee/diaporama fixé en permanence casse souvent sur mobile (espace vertical
gaspillé) ; réserver `data-pin`/`data-marquee` à un seul moment voulu, pas à toute la mise en page.

---

### 1.6 11 Bar — [11elevenbar.com](https://www.11elevenbar.com/)
**Type :** bar à cocktails en sous-sol, Londres (au sein du restaurant Jul's).

**Pourquoi ça fait cher :** le site force par défaut une séquence narrative d'introduction avec un lien
explicite « Skip Origin Story » — l'histoire d'origine est une porte de révélation lente et délibérée
avant tout contenu transactionnel. La navigation ne contient qu'une seule action principale (« Reserve a
Table »). Les images (carrousel hero + galerie « immersion ») installent 11 Bar comme sous-marque nichée
dans un restaurant parent, empruntant sa crédibilité. La carte de 11 cocktails est traitée comme une
liste finie et choisie, à la manière d'une carte des vins.

**Ordre des sections :** Logo → Carrousel hero → CTA « Reserve a Table » → Histoire d'origine
(skippable) → Events coming soon → Carte de cocktails → Logo Jul's → Galerie immersion → Infos
réservation → Contact.

**3 moves :**
- Séquence narrative courte et skippable avant le contenu principal → `data-pin` + `data-pin-step` pour
  2-3 étapes, avec une affordance « passer » visible.
- Un seul CTA dominant dans la nav, tout le reste subordonné → `data-magnetic` sur ce seul élément
  tactile.
- Traitement en liste finie et choisie pour l'offre centrale → `data-reveal` + `data-stagger` sur une
  liste courte numérotée, chaque item ayant de l'espace.

**À éviter :** bloquer tout le site derrière une séquence narrative non-skippable (ou au skip peu
visible) frustre les clients locaux réguliers qui veulent juste les horaires ou le téléphone — garder
toute intro courte, avec un skip évident.

---

### 1.7 Secret Garden Stresa — [secretgardenstresa.com](https://secretgardenstresa.com/)
**Type :** résidence/maison d'hôtes boutique, lac Majeur, Stresa (Italie).

**Pourquoi ça fait cher :** navigation bilingue EN/DE ciblant délibérément une clientèle nord-européenne
précise. Le site consacre des sections entières à « Privacy & Clientele » et « Sustainability &
Responsibility » — un espace éditorial inhabituel pour une petite maison d'hôtes. La section
« Philosophy » est formulée « du point de vue d'un couple », suivie d'une section « philosophie de
design » (« Calm, cosy, elegant ») — les propriétaires expliquent leur propre goût plutôt que de lister
des équipements. Le carrousel hero est pensé en 4 images mobiles distinctes.

**Ordre des sections :** Header → Carrousel hero → Titre + accroche → Intro « private boutique
residence » → Philosophy → Design philosophy → Accommodations + plans → Localisation → Experiences →
Privacy & Clientele → Sustainability & Responsibility → Processus de réservation → Contact → Footer.

**3 moves :**
- Section « Philosophy » autonome, dans la voix des propriétaires, séparée des équipements →
  `data-reveal` (blur/scale) sur un long paragraphe façon citation, traité comme un temps fort à part.
- Section « comment nous protégeons votre vie privée / à qui ça s'adresse » → transposable à un artisan
  qui joue la discrétion ou le sur-mesure (tailleur, petit atelier), `data-reveal` court et affirmé.
- Séquence hero pensée spécifiquement pour mobile plutôt qu'un simple reflow desktop → discipline de
  production, à associer à un `data-parallax` très léger sur mobile.

**À éviter :** ajouter une section « Sustainability & Responsibility » juste pour paraître premium, sans
pratique réelle et précise à citer derrière, sonne creux — ne l'inclure que s'il y a un geste concret et
spécifique à pointer.

---

### 1.8 KUBE Hotel Saint-Tropez — [kubehotel-saint-tropez.com/fr](https://kubehotel-saint-tropez.com/fr)
**Type :** hôtel 5 étoiles avec spa et rooftop, Gassin/Saint-Tropez (France).

**Pourquoi ça fait cher :** sélecteur de langue à quatre entrées (FR/EN/IT/RU) — signal de clientèle
jet-set réellement internationale. La navigation est structurée en deux niveaux : un menu opérationnel
primaire (Chambres, Spa myBlend, Restaurant Rooftop, Activités, Privatisation, Plage) et un menu
institutionnel secondaire (Hôtel, Boutique, Éco-responsabilité, Offrir, FAQ, Galerie, Contact, Magazine).
Le footer liste des codes de distribution GDS (Amadeus, Sabre, Galileo, Worldspan) — infrastructure de
réservation agence de voyage invisible pour la plupart des visiteurs mais révélatrice de l'investissement
backend. Les chambres sont présentées comme trois concepts nommés (Wood/Ibiza/Natural), et le
partenariat spa est nommé explicitement (« Spa myBlend », marque du groupe Clarins).

**Ordre des sections :** Sélecteur de langue → Nav réservation → Menu primaire → Menu secondaire →
Carrousel hero → Accroche « Wellness - Pool - Rooftop » → « Le Golfe pour seul horizon » → Trois
catégories de chambres → Experiences → Activités → Privatisation → FAQ → Footer.

**3 moves :**
- Catégories de chambres/offres nommées et brandées plutôt que génériques (« Wood », « Ibiza »,
  « Natural ») → `data-tilt` sur chaque carte + `data-hover-img` pour faire flotter une photo au survol.
- Courte phrase de positionnement forte, seule avant tout contenu imagé (« Le Golfe pour seul
  horizon ») → `data-split` + `data-text-fill`.
- Navigation à deux niveaux seulement quand c'est réellement justifié → pour un artisan à offre unique,
  garder un nav mono-niveau avec `data-nav="hide-on-scroll"`.

**À éviter :** copier un sélecteur quatre langues et une nav à deux niveaux sur un site d'artisan local
mono-service — ça signale une confusion d'échelle et ajoute un vrai coût de maintenance de traduction ;
faire correspondre la complexité de navigation au nombre réel d'offres distinctes.

---

### 1.9 Septime — [septime-charonne.fr](https://www.septime-charonne.fr/) — *non vérifié en détail (CSS peu exposé au fetch), structure confirmée par fetch direct*
**Type :** restaurant gastronomique, Paris 11e (une étoile Michelin, réputation déjà installée).

**Pourquoi ça fait cher :** c'est le contre-exemple utile du « minimalisme de confiance ». Pas de hero au
sens classique, aucune photo de plat, un seul logo SVG : la page ne cherche à convaincre de rien, elle
donne juste le menu du moment, les horaires, la réservation et la liste des vignerons partenaires. C'est
un choix délibéré possible uniquement parce que la réputation précède le site — l'inverse de la stratégie
qu'un artisan qui démarre doit adopter, mais un rappel utile que la sobriété absolue peut elle-même être
un signal de luxe/assurance quand la demande dépasse déjà l'offre.

**Ordre des sections :** Nav (Menu d'été, Contacts, Horaires, Vignerons) → liens vers les établissements
sœurs (Clamato, Septime La Cave…) → Menu d'été → Contacts et réservation → Horaires → Liste des
vignerons → Réservation.

**3 moves :**
- Réduire radicalement le nombre d'informations affichées quand l'offre est déjà rare/demandée → discipline
  de contenu, pas un `data-*` — à combiner avec `data-motion="subtle"`.
- Traiter la liste de partenaires (ici les vignerons) comme une preuve de sélection plutôt qu'un logo
  grid → `data-stagger` sur une liste texte simple.
- Un seul lien de réservation répété plutôt que des CTA multiples → `data-magnetic` sur ce lien unique.

**À éviter :** copier ce degré de minimalisme pour un artisan qui n'a pas encore de notoriété — sans
réputation établie, l'absence de photos et d'argumentaire lit comme un site inachevé, pas comme de la
confiance ; ce move ne se transpose qu'à un client déjà complet/très demandé qui veut *filtrer*.

---

## 2. Salons, spas, bien-être et cliniques (8)

### 2.1 Ludlow Blunt — [ludlowblunt.com](https://www.ludlowblunt.com/)
**Type :** barbershop haut de gamme, Brooklyn (NYC).

**Pourquoi ça fait cher :** le site assume la sobriété comme signal de luxe. Palette quasi monochrome
(noir/blanc/gris), aucune couleur d'accent, hiérarchie typographique restreinte sans effet de drame. La
navigation est réduite au texte. La prise de rendez-vous se fait uniquement par téléphone
(« Appointments by telephone only ») : une friction délibérée qui dit « nous ne courons pas après le
volume ». La photographie mise sur le lieu physique — fauteuils de barbier vintage, cabinetry en
acajou, éclairage d'époque restauré — plutôt que sur des visages souriants de stock.

**Ordre des sections :** Intro/identité de marque → Horaires & contact → Tarifs → Documentaire (contenu
de marque) → Location du lieu → Galerie (intérieur, fauteuils, matériaux) → Footer.

**3 moves :**
- Entrée du titre/tagline en révélation typographique mot par mot, sans fioriture → `data-split` sur le
  H1.
- Photos d'intérieur/détails de métier qui glissent légèrement au scroll → `data-parallax="0.2"`.
- Nav minimale qui se fait discrète en descendant → `data-nav="hide-on-scroll"`.

**À éviter :** supprimer complètement la prise de RDV en ligne au profit du « téléphone uniquement » —
ça fonctionne pour une marque déjà culte, mais un artisan local qui démarre perd des conversions s'il
retire ce canal ; le geste « friction = luxe » ne se transpose que si la notoriété est déjà là.

---

### 2.2 Spoke & Weal — [spokeandweal.com](https://www.spokeandweal.com/)
**Type :** salon de coiffure haut de gamme, plusieurs villes (US).

**Pourquoi ça fait cher :** structure éditoriale numérotée (01, 02, 03…) qui organise la page comme un
magazine. Palette noir/blanc stricte avec double version du logo (fond clair/sombre). Beaucoup de blanc
autour du texte, CTA peu nombreux et bien espacés. La photographie associe systématiquement un
avant/après technique à chaque carte de service, et une section « fondatrice » humanise la marque avec un
vrai visage et une histoire.

**Ordre des sections :** Hero (nom + tagline + services + 2 CTA) → Vitrine des services → Déclaration de
mission → Profil de la fondatrice → Cartes de service détaillées → Presse/mentions → Instagram → Prise
de RDV → Footer.

**3 moves :**
- Numérotation éditoriale des sections (01, 02…) en cascade avec le contenu → `data-stagger` sur le
  bloc numéro + titre.
- Cartes de service avec photo qui bascule légèrement au survol → `data-tilt`.
- Paires avant/après qui se révèlent au scroll plutôt que visibles d'un coup → `data-reveal` (clip ou
  scale) sur chaque paire d'images.

**À éviter :** rester en tout noir et blanc sans la moindre touche de couleur — pour un salon de quartier
ça peut vite sembler froid et couper le lien de proximité que l'artisan cherche à construire.

---

### 2.3 Cinq Mondes — [cinqmondes.com](https://www.cinqmondes.com/)
**Type :** marque française de spa & bien-être (instituts + gamme de cosmétiques naturels).

**Pourquoi ça fait cher :** bannières hero plein cadre avec des taglines poétiques en français (« Les
Rituels du MONDE », « L'Art du BIEN-ÊTRE ») en lettrage large et espacé — le tracking généreux sur les
titres donne le ton haut de gamme, pas la taille en soi. Fond blanc dominant, contraste noir/texte fort,
touches de tons chauds (or, crème) réservées aux visuels produits. La photographie évite le filtre
agressif : lumière naturelle, ombres douces, cadrages resserrés sur la texture (une main qui applique une
crème) plutôt que sur le packaging seul — ça vend le geste, pas l'objet.

**Ordre des sections :** Bannières hero rotatives → Offres promotionnelles → Produits iconiques → Soins
signature → Expériences spa → Idées cadeaux → Blog → Newsletter → Footer.

**3 moves :**
- Tagline en français avec espacement de lettres généreux, qui se dévoile mot par mot → `data-split` +
  `data-reveal="blur"`.
- Macro-photo du geste (mains, texture, matière) avec léger décalage au scroll → `data-parallax="0.2"`.
- Grille de soins/rituels qui apparaît en cascade au lieu d'un vrai carrousel → `data-stagger`.

**À éviter :** s'appuyer sur un carrousel comme structure principale de présentation des soins — fragile
en accessibilité/engagement et le moteur n'a pas de brique carrousel native ; une grille fixe avec
cascade au scroll raconte la même histoire sans la dette technique.

---

### 2.4 Clinique La Prairie — [cliniquelaprairie.com](https://www.cliniquelaprairie.com/)
**Type :** clinique de longévité et bien-être de luxe, Montreux (Suisse, fondée 1931).

**Pourquoi ça fait cher :** le hero associe une tagline éditoriale en italique (« at the heart of the
secret of life ») à une photo plein cadre — l'italique est utilisé comme signature de marque. La
navigation est un mégamenu structuré par intention (Philosophy, Programs, Prevention & Rejuvenation,
Destinations). Le formulaire de réservation est volontairement progressif (étape 1 sur 4, indicateur
25 %) : ça ralentit l'utilisateur et crée un sentiment de consultation sur-mesure. La photographie évite
tout imaginaire clinique (blouses, matériel) au profit de paysages suisses.

**Ordre des sections :** Hero (tagline éditoriale + image plein cadre) → Déclaration de philosophie →
Vitrine des programmes → Bilan de santé → Destinations → Antennes urbaines → Compléments/produits →
Newsletter.

**3 moves :**
- Tagline éditoriale en italique qui se remplit/s'éclaire au scroll par-dessus une photo plein cadre →
  `data-text-fill`.
- Bouton de réservation persistant qui réagit légèrement au curseur → `data-magnetic`.
- Formulaire de réservation multi-étapes avec indicateur de progression → **à créer** (composant stepper
  avec état persistant, absent du moteur).

**À éviter :** montrer du matériel médical ou des blouses blanches en photo — pour un artisan du
bien-être (ostéo, institut), l'imagerie clinique refroidit immédiatement ; préférer du lifestyle/lieu.

---

### 2.5 Tend — [hellotend.com](https://www.hellotend.com/)
**Type :** studio dentaire moderne, chaîne US (32+ adresses).

**Pourquoi ça fait cher :** hero en split-screen — titre engageant à gauche (« Look forward to going to
the dentist »), portrait candide souriant à droite sur un aplat de couleur (bleu, jaune) au lieu du blanc
clinique classique. Ce fond coloré plein cadre derrière le portrait désinfecte visuellement le sujet
« dentiste » de son anxiété associée. La photographie est volontairement non-stock : expressions
exagérées, sourires « vrais », cadrage serré sur le visage.

**Ordre des sections :** Nav + hero (split-screen) → « Why Tend? » → Carrousel de services →
Témoignages → Localisation des studios/carte → Assurances → Équipe clinique → Blog → Presse → Footer.

**3 moves :**
- Hero en deux blocs asynchrones — texte d'un côté, portrait de l'autre → `data-reveal="left"` sur le
  texte, `data-reveal="right"` sur l'image.
- Aplat de couleur de marque (`--accent`) derrière le portrait hero au lieu du blanc par défaut.
- Bouton de réservation qui reste joignable même quand la nav se cache au scroll → **à créer** (CTA
  flottant indépendant de la nav, que `data-nav="hide-on-scroll"` ne couvre pas nativement).

**À éviter :** pousser trop loin la photographie « décalée » (grimaces, langue tirée) — pour un praticien
solo (dentiste, ostéo, kiné), ce registre trop familier peut lire comme un manque de sérieux là où la
confiance doit se construire le plus vite.

---

### 2.6 Dr Sebagh — [drsebagh.com](https://www.drsebagh.com/)
**Type :** clinique de médecine esthétique + marque de skincare (Paris/Londres).

**Pourquoi ça fait cher :** palette crème/blanc/noir avec touches de rose poudré réservées aux visuels
produit. Grille très aérée, marges larges, contenu centré. Le hero est un carrousel qui alterne slide
produit et slide « histoire de marque ». Les comparatifs avant/après sont montrés avec une retouche
minimale assumée — signal de crédibilité clinique plutôt qu'artifice marketing. L'adresse physique de la
clinique est citée comme un nom propre (Chandos House, Londres), signal d'ancrage/patrimoine.

**Ordre des sections :** Nav + bandeau promo → Hero carrousel → Signaux de confiance → Carrousel
best-sellers → À propos du praticien → Informations clinique → Soins du visage → Témoignages → Presse →
Blog → Grille d'avantages → Footer.

**3 moves :**
- Tagline éditoriale qui se dévoile mot par mot à chaque changement de slide hero → `data-split`.
- Portrait du praticien avec mise en scène du parcours (photo qui s'agrandit légèrement à l'entrée) →
  `data-reveal="scale"` + un chiffre clé (années d'expérience) en `data-counter`.
- Comparatif avant/après statique, côte à côte sans curseur interactif → `data-reveal` simple ; la
  version interactive avec slider est **à créer**.

**À éviter :** laisser un mégamenu shop/e-commerce prendre le pas sur la clinique physique — pour un
artisan (praticien unique, une adresse), le CTA principal doit rester « prendre rendez-vous ».

---

### 2.7 Six Physio — [sixphysio.com](https://www.sixphysio.com/)
**Type :** cabinet de kinésithérapie/physiothérapie multi-sites, Londres.

**Pourquoi ça fait cher :** hero en photo d'action plein cadre (coureurs en mouvement) plutôt qu'un
intérieur de cabinet ou un stock médical, et le titre joue sur l'italique pour un seul segment de phrase
(« Physiotherapy that moves *with you* »). Les praticiens sont individuellement présentés (photo + nom +
spécialité) au lieu d'un bloc « notre équipe » anonyme — c'est ce qui construit la confiance dans un
métier de relation individuelle.

**Ordre des sections :** Hero + tagline → Recherche de cabinet → Carrousel des services → Témoignages
patients → Profils des praticiens → CTA de réservation.

**3 moves :**
- Emphase italique sur un seul segment du titre, révélé avec un léger décalage → `data-split` ciblé +
  `data-reveal-delay`.
- Photo d'action (mouvement, pas un intérieur figé) en fond de hero avec léger effet de profondeur →
  `data-parallax="0.2"`.
- Grille de praticiens nommés en cascade, avec légère bascule au survol → `data-stagger` + `data-tilt`.

**À éviter :** placer un outil de recherche de cabinet/localisation en deuxième position — pertinent pour
une enseigne à 14 adresses, hors-sujet pour un praticien à une seule adresse ; y substituer un simple
bloc carte + adresse.

---

### 2.8 SkinSpirit — [skinspirit.com](https://www.skinspirit.com/)
**Type :** medspa/clinique de médecine esthétique, chaîne US (50+ sites).

**Pourquoi ça fait cher (et ce qui la dessert) :** palette noir/blanc avec un accent vert inhabituel pour
ce secteur (CTA et flèches systématiquement verts) — un choix distinctif plutôt que le rose/beige attendu
d'un medspa. La grille de traitements est présentée en cartes cliquables avec icône + libellé, et des
comparatifs avant/après en grille appuient la crédibilité clinique. En revanche, le hero est un carrousel
promotionnel (« 20% off Microneedling ») : ce choix dessert le positionnement premium en ouvrant sur une
remise plutôt que sur un résultat — contre-exemple utile.

**Ordre des sections :** Header/nav → Carrousel promotionnel → Grille de traitements phares → Signaux de
confiance → Merchandising produit → Newsletter → Programme de parrainage → Témoignages → Footer.

**3 moves :**
- Une seule couleur d'accent distinctive utilisée uniquement pour les CTA/liens, appliquée avec
  constance → réglage des tokens `--accent`/`--on-accent`.
- Grille de traitements en cartes cliquables qui entrent en cascade avec léger effet de bascule au
  survol → `data-stagger` + `data-tilt`.
- Comparatifs avant/après en grille statique comme preuve → `data-reveal` sur chaque paire.

**À éviter :** ouvrir la page sur un carrousel de promotions/réductions — le rabais signale le volume et
la commodité, l'inverse de ce qu'un artisan local cherche à transmettre ; le hero doit vendre un geste ou
un résultat, jamais un pourcentage de remise.

---

## 3. Artisans et studios créatifs (7)

### 3.1 Patrick Roger — [patrickroger.com](https://www.patrickroger.com/)
**Type :** chocolatier-sculpteur, boutique en ligne (Paris).

**Pourquoi ça fait cher :** typographie confirmée `Interstate Condensed` en capitales pour les titres de
section — un grotesque condensé et serré, plutôt associé à la mode/luxe qu'à l'agroalimentaire, ce qui
évite immédiatement le cliché « pâtisserie mignonne ». Chaque bloc produit apparaît en zoom-fondu au
scroll (`data-animate="zoom-fade"` dans le code), ce qui ralentit délibérément la lecture. Les visuels
sont des photos produit très rapprochées (sculptures en chocolat façon design object), fond neutre,
aucune scène « cuisine » — le chocolat est traité comme une pièce de mobilier ou un bijou.

**Ordre des sections :** Navigation + recherche → Hero plein écran → Produits mis en avant → Grille de
catégories (« LES SENS DE LA CRÉATION ») → Bandeau promotionnel → Footer.

**3 moves :**
- Zoom-fondu au scroll sur chaque bloc produit → `data-reveal="scale"` (ou `blur` pour un rendu plus
  doux).
- Catégorie de produits traitée comme une collection d'objets (grille avec un mot-clé par catégorie) →
  `data-stagger="80"`.
- Typographie condensée capitale pour les intitulés de collection → `data-scale="display"` +
  `data-headings="left"`, avec `--font-display` réglé sur une condensée.

**À éviter :** le mega-menu multi-niveaux et le sélecteur de langue/devise en haut de page — pour un
artisan local avec 5-6 produits ou prestations, ce niveau de complexité de navigation e-commerce signale
« boutique en ligne générique » plutôt qu'atelier.

---

### 3.2 Tilly Sveaas — [tillysveaas.co.uk](https://www.tillysveaas.co.uk/)
**Type :** créatrice de bijoux (joaillerie), Londres.

**Pourquoi ça fait cher :** paire typographique propriétaire confirmée dans le CSS (`Gaisyr Light` /
`Gaisyr Mono`) — une police sur-mesure plutôt qu'un Google Font. Palette resserrée à deux couleurs
extraites du CSS : `#dec292` (or/beige chaud, couleur dominante répétée) et `#cecece` (gris neutre), sur
fond blanc. Le hero est un h1 unique sur photo de mannequin pleine largeur, sobre. Un bandeau de trois
piliers de marque (héritage, design intemporel, responsabilité) utilise des icônes fines plutôt que des
blocs de texte.

**Ordre des sections :** Hero bannière → Vitrine produits phares → Tuiles de catégories → « Shop the
Look » → Bandeau de 3 piliers de marque → Studio de personnalisation → Presse → À propos avec citation de
la fondatrice → Footer + newsletter.

**3 moves :**
- Bandeau de piliers de marque avec icône + titre court, révélés un par un → `data-stagger="120"` sur le
  conteneur, chaque icône avec `data-reveal`.
- « Shop the Look » qui mélange photo éditoriale et points produits cliquables → `data-hover-img` sur les
  liens produits pour faire flotter le visuel au survol.
- Une seule couleur d'accent chaude déclinée en fond de section alterné plutôt que multipliée →
  `data-tone="alternate"` avec `--accent` réglé sur cette teinte, pas plus.

**À éviter :** le mega-menu multi-niveaux (catégories × matériaux) — pour un joaillier artisan avec un
catalogue restreint, reproduire cette architecture de grande marque crée une attente que le site ne peut
pas tenir.

---

### 3.3 Christie Hemm Klok — [christiehemmklok.com](https://www.christiehemmklok.com/) — *partiellement non vérifié (contenu chargé en JS, CSS brut non accessible au fetch)*
**Type :** photojournaliste indépendante (studio de photographie éditoriale, région San Francisco).

**Pourquoi ça fait cher :** le nom est éclaté sur trois lignes (« Christie / Hemm / Klok ») en guise de
logotype-titre. La navigation n'affiche que des catégories de sujets avec un compteur d'images entre
parenthèses (Conservation & Wildlife 81, Manufacturing & Industry 91…) : la preuve de volume de travail
sert d'argument de crédibilité, sans un mot de texte marketing. Aucune page « Services » ni tarifs — le
site fonctionne comme une galerie pure.

**Ordre des sections :** En-tête (nom éclaté) → Navigation (Home, Instagram, Email, About, All) →
Catégories de portfolio avec compteur → Grilles d'images par catégorie.

**3 moves :**
- Le nom/l'enseigne éclaté en plusieurs lignes/mots animés à l'entrée → `data-split` sur le titre du
  hero (adapté à un nom d'artisan : « Marie / Dupont / Céramiste »).
- Le compteur d'images par catégorie comme preuve de volume → `data-counter` sur chaque intitulé de
  catégorie pour un boulanger (« 12 variétés de pain »), un joaillier (« 200 pièces créées »).
- Navigation ultra-réduite, uniquement des liens texte → `data-nav="hide-on-scroll"` avec un style texte
  seul, pas de bouton plein.

**À éviter :** l'absence totale de CTA commercial, de prix ou de formulaire de contact visible en premier
écran — un artisan local a besoin qu'on trouve vite l'adresse, les horaires et un moyen de commander.

---

### 3.4 Lune Croissanterie — [lunecroissanterie.com](https://lunecroissanterie.com/)
**Type :** croissanterie/boulangerie spécialisée, Australie (Melbourne/Brisbane/Sydney).

**Pourquoi ça fait cher :** police d'affichage `DIN Next LT W01 Bold` (variante web-font payante)
associée à un tracking très serré (`-0.05em`) sur les titres — un resserrement marqué, plus proche d'une
marque de mode que d'une boulangerie de quartier. Le corps utilise Figtree en variable font (toute la
gamme de graisses disponible). Le hero est une vidéo plein écran avec bouton « Play video » ET « Skip
video ». Le texte de marque est une seule phrase-manifeste sur le procédé (« a precise balance of science
and craft »), pas une liste de produits.

**Ordre des sections :** Navigation → Hero vidéo plein écran avec option « passer » → Déclaration de
marque → Extension « Read More » → Liste des 9 adresses → Footer + Instagram.

**3 moves :**
- Phrase-manifeste courte et centrée juste après le hero, qui explique la philosophie plutôt que le
  produit → `data-reveal="blur"` avec `data-reveal-delay="200"`.
- Liste d'adresses/horaires traitée comme un index typographique soigné → `data-stagger="60"` sur chaque
  ligne d'adresse.
- Tracking très serré sur le titre de marque pour un rendu « logotype » → `--font-display` réglé avec un
  tracking négatif prononcé, réservé au nom de l'enseigne.

**À éviter (et « à créer ») :** le hero vidéo plein écran — un vrai poste de production (tournage,
montage, poids de page) hors de portée du budget d'un artisan local ; préférer une image forte avec
`data-parallax` plutôt que promettre une vidéo qui ne sera jamais tournée.

---

### 3.5 Frances Palmer Pottery — [francespalmerpottery.com](https://www.francespalmerpottery.com/)
**Type :** céramiste (grès/porcelaine/terre cuite), Connecticut (US).

**Pourquoi ça fait cher :** police Karla avec `letter-spacing: 0.06rem` sur les libellés en capitales —
un espacement légèrement élargi qui adoucit la lecture des majuscules, technique classique du luxe
discret. Palette resserrée à quatre couleurs : blanc, `#3d4246` (anthracite), `#eeeceb` (crème neutre) et
un accent inattendu `#b2166a` (magenta/framboise) — une seule couleur vive au milieu d'un univers
terreux. La photographie produit est cohérente : fond neutre, éclairage constant, angle de trois-quarts
pour montrer le volume des pièces.

**Ordre des sections :** Hero + accroche → Actualités/événements → Carrousel « New in the Studio » →
Mise en avant collection → Newsletter → Flux Instagram → Footer.

**3 moves :**
- Une seule couleur d'accent vive isolée dans un univers de teintes naturelles → `--accent` réglé sur une
  couleur franche, utilisée uniquement pour les CTA.
- Le carrousel « Nouveautés de l'atelier » → `data-stagger` sur la grille + `data-tilt` léger sur chaque
  carte produit pour suggérer le volume de la pièce.
- Mention presse intégrée sobrement dans le fil de la page → `data-reveal` sur un bloc texte « vu
  dans... » sans logo grid trop chargé.

**À éviter :** les composants e-commerce par défaut (sélecteur de variantes, badges de livraison, boutons
standardisés) laissés tels quels — ils cassent immédiatement l'impression « fait main » ; habiller ces
éléments avec les tokens du moteur (`--radius-card`, `--shadow-card`) plutôt que laisser le thème par
défaut transparaître.

---

### 3.6 Seven Doors Tattoo — [sevendoorstattoo.com](https://www.sevendoorstattoo.com/) — *sur Squarespace, animation à 90 % issue de la plateforme, pas sur-mesure*
**Type :** studio de tatouage haut de gamme, Shoreditch, Londres.

**Pourquoi ça fait cher :** pile typographique Raleway (corps) + Space Grotesk (titres), avec un texte de
marque en capitales centrées réparti sur deux h1 distincts qui se répondent comme une accroche en deux
temps. La photographie de portfolio est traitée en gros plans très nets, présentée comme de la
photographie packshot plutôt que des photos de salon. La sophistication vient à 90 % de la direction
artistique (typo, photo, texte), pas de la technique — les animations sont le simple fade-up par défaut
de Squarespace.

**Ordre des sections :** Navigation + CTA « BOOK YOUR TATTOO TODAY » → Hero en deux temps → Image du
studio → Carrousel de réalisations → Bloc « walk-ins » → Localisation → Témoignages → Contact (footer).

**3 moves :**
- Accroche en deux temps, deux phrases courtes qui s'enchaînent en capitales → `data-split` sur chaque
  ligne avec `data-reveal-delay` décalé entre les deux.
- Carrousel de réalisations en gros plan, packshot plutôt que scène de salon → `data-tilt` sur chaque
  vignette au survol pour une impression tactile.
- Témoignages clients intégrés en fil de page, texte simple → `data-reveal` un par un avec `data-stagger`.

**À éviter :** s'appuyer uniquement sur les animations par défaut d'une plateforme (fade-up générique)
alors que la direction artistique est soignée — un artisan qui n'a que des animations de template, même
avec de belles photos, reste identifiable comme « site fait avec un constructeur » ; c'est exactement
l'écart que le vocabulaire `data-*` du moteur doit combler.

---

### 3.7 Senawa Studio — [senawastudio.com](https://senawastudio.com/)
**Type :** studio d'architecture et de design d'intérieur, Jakarta (Indonésie).

**Pourquoi ça fait cher :** palette confirmée dans le CSS, un dégradé de 8 teintes crème-vers-terracotta
parfaitement cohérent (`#f6f2eb` … `#7a3a20`) — aucune couleur « pop », tout dérive d'une seule famille
chromatique, comme une palette de matériaux. Les titres utilisent un tracking très resserré et variable
selon la taille, preuve d'un vrai travail de kerning optique. Pile Inter (texte) + Sora (affichage), avec
fallback système nommé explicitement pour éviter le flash de police. Le `h1` réel est masqué visuellement
(`visually-hidden`) : la marque affichée est purement graphique, le texte SEO est caché.

**Ordre des sections :** Navigation + recherche → Hero plein écran (image de projet, sans texte
apparent) → Carrousel de projets navigable au clavier → Grille de projets par typologie → Contact.

**3 moves :**
- Palette de matériaux (dégradé crème → terracotta) comme unique système de couleur → tokens `--bg`,
  `--bg-2`, `--surface`, `--accent` alignés sur une seule famille de teintes.
- Carrousel de projets navigable avec légendes discrètes (type + numéro) → `data-parallax="0.15"` sur les
  images + `data-reveal` sur les légendes.
- Tracking resserré et variable sur les titres selon la taille → `data-scale="display"` avec
  `--font-display` calibré pour un tracking négatif aux grandes tailles.

**À éviter :** le `h1` réel caché derrière une marque purement graphique — pour un artisan local qui
dépend du référencement local (Google Business, « boulanger + ville »), cacher le texte réel derrière du
visuel pur est contre-productif ; le nom du métier et la localisation doivent rester lisibles en clair.

---

## 4. Agences, freelances et boutiques indépendantes françaises (6)

### 4.1 Quatrième Étage — [quatriemeetage.studio](https://quatriemeetage.studio/)
**Type :** studio de design/direction artistique, Paris (collectif Ophélie Raynaud & Valentin Porte).

**Pourquoi ça fait cher :** le titre affiche la police payante Monument (`--font-monument`), pas une
police système. La palette n'est pas noir/blanc pur mais un duo off-black/off-white (`#0b0a0a` /
`#fbfafa`), plus doux qu'un contraste brutal. Une bande fixe en haut, en `Monument Mono`, texte minuscule
et très serré (`tracking-tight`, `leading-[0.65]`), répète le nom du studio en boucle — un bandeau
défilant, pas un simple logo statique. Le scroll est piloté par Lenis (inertie fluide) avec scrollbar
native masquée. Le contenu est réduit à l'os : un paragraphe de présentation, 6 services en liste, 6
mentions presse — aucune argumentation commerciale. Un indicateur de progression (« 000% ») gate
probablement l'apparition du hero, un rituel d'entrée que seuls les sites à fort capital de marque se
permettent.

**Ordre des sections :** Bande fixe (ticker mono, nom du studio en boucle) → Hero texte plein écran →
Présentation du studio → Liste de services → Mentions presse → Footer (avec indicateur « 000% »).

**3 moves :**
- Bande fixe en ticker mono qui défile en haut de page → `data-marquee` pour afficher en continu
  « Fait main à [ville] — depuis [année] — sur rendez-vous », pause au survol.
- Le nom du métier en très grande capitale comme hero unique, sans image → `data-split` + `data-text-fill`.
- Palette off-black/off-white au lieu de noir/blanc pur → réglage de valeur sur les tokens `--bg`/`--fg`
  existants, pas une nouvelle brique.

**À éviter :** une page entièrement texte, sans aucune photo de réalisations. Pour un artisan français
(menuisier, fleuriste, traiteur) dont la valeur repose sur du tangible, l'absence totale d'image lit
comme de l'évasif, pas comme de la confiance — ce choix ne fonctionne que pour un studio dont le « book »
est la réputation elle-même.

---

### 4.2 Gabriel Beaugonin — [gabrielbeaugonin.com](https://www.gabrielbeaugonin.com/)
**Type :** freelance, UX designer indépendant, Paris.

**Pourquoi ça fait cher :** police « Suisse Int'l » préchargée en woff2 — un grotesque suisse payant,
référence du design system haut de gamme. Stack de motion GSAP + Lenis + Locomotive Scroll (confirmée
dans le bundle JS). Palette quasi monochrome (`#0a0a0a`, `#1a1a1a`, `#9f9f9f`, `#f6f6f6`) avec tracking
resserré (`-0.025em`). Une section « Recognitions » cite Awwwards et FWA — la preuve sociale se fait par
récompenses de pairs, pas par témoignages clients.

**Ordre des sections :** Header/hero → Liste de travaux sélectionnés → About → Recognitions (Awwwards,
FWA) → Contact/footer.

**3 moves :**
- Léger tilt 3D au survol des vignettes projet → `data-tilt`.
- Bandeau de récompenses/presse défilant → `data-marquee`, pause au survol.
- Nav en verre dépoli (backdrop-blur) → **à créer** (le moteur n'a pas de token de flou).

**À éviter :** importer une stack motion à trois librairies pour un site vitrine one-page. Pour un
artisan dont les visiteurs arrivent en 4G sur mobile, ce poids JS ruine la vitesse perçue et la
confiance ; `data-scrub`/`data-reveal` du moteur donnent 90 % de la sensation pour une fraction du coût.

---

### 4.3 Rodolphe Parente — [rodolpheparente.com](https://rodolpheparente.com/)
**Type :** freelance, architecte d'intérieur indépendant, Paris (clientèle citée : Cartier, Lombard
Odier, projets à Monaco, Rome).

**Pourquoi ça fait cher :** police maison auto-hébergée « ToSustain » sur fond ivoire chaud
`rgb(244,237,223)` plutôt que blanc clinique — le fond ressemble à du papier. Les vignettes de projet
portent des rotations CSS fines et variées (`rotate(-5deg)` à `rotate(6deg)`) : effet « photos punaisées
sur un moodboard » plutôt que grille rigide. La navigation utilise un filtre par catégorie (Projets /
Intérieurs / Mobiliers) sans rechargement de page pour trier ~30 réalisations. Aucun bouton
« devis »/« services » visible — seulement le nom, le filtre, et « À propos ».

**Ordre des sections :** Header/intro (duo d'images d'ambiance) → Nav-filtre → Grille en cascade de
projets (images pairées et pivotées) → Footer/contact.

**3 moves :**
- Fond ivoire chaud plutôt que blanc pur pour un rendu « galerie éclairée » → token `--bg` (valeur), à
  coupler avec `data-tone="alternate"`.
- Rotation statique fine par carte (effet photo posée) → **à créer** (le `data-tilt` du moteur se
  déclenche au survol, pas en rotation permanente par carte).
- Filtre de portfolio par catégorie sans rechargement → **à créer** (pas de primitive de filtre/onglet
  côté client dans le moteur actuel).

**À éviter :** laisser le filtre éditorial prendre le pas sur le contact. Pour un artisan français
(ébéniste, menuisier), les visiteurs ont besoin de trouver « devis »/coordonnées rapidement ; Parente
peut se permettre un site purement éditorial car sa clientèle arrive par recommandation.

---

### 4.4 Thomas Hervé — [hervethomas.com](https://hervethomas.com/)
**Type :** freelance/studio indépendant de direction artistique et design, Paris (clients cités : Nike,
Adidas, 1991 Books).

**Pourquoi ça fait cher :** codé à la main sans framework, avec une police maison auto-hébergée « TH
Grotesk Bold » (nommée d'après ses propres initiales). Fond noir pur, images pleine largeur empilées en
scroll continu sans fin — zéro chrome, zéro texte explicatif. Une barre d'info fixe en haut utilise
`mix-blend-mode:difference` : le texte s'inverse automatiquement selon l'image en dessous. Pas de
sections, pas d'études de cas — juste des images liant vers les sites clients eux-mêmes ; le portfolio,
c'est la liste de clients.

**Ordre des sections :** Barre d'info fixe (nom, description courte, date, email/Instagram) → Colonne
unique et continue d'images pleine largeur cliquables, sans découpage en sections ni footer distinct.

**3 moves :**
- Images pleine largeur en scroll continu, sans cadre ni grille → `data-reveal` simple sur chaque image
  à l'entrée dans le viewport.
- Barre fixe qui s'inverse en `mix-blend-mode:difference` selon le fond → **à créer**.
- Réduction radicale du texte (une seule phrase pour tout le site) → discipline de contenu, à coupler
  avec `data-motion="subtle"` une fois le concept déjà épuré.

**À éviter :** l'absence quasi totale de texte explicatif et de CTA clair. Un artisan indépendant ne peut
généralement pas s'appuyer sur une réputation déjà établie comme celle-ci ; un commerce local a besoin
d'un téléphone/devis visible sans scroller.

---

### 4.5 Empreintes — [empreintes.com](https://empreintes.com/)
**Type :** boutique indépendante, concept store de métiers d'art (réseau Ateliers d'Art de France, Paris
3e, Paris 17e, Pézenas).

**Pourquoi ça fait cher :** deux polices payantes chargées, « Jaguar » (serif display) pour les titres et
« Gill Sans Std » pour le corps. Palette beige/crème/blanc/noir, très restreinte, façon galerie, qui
laisse toute la couleur à la photographie produit. La photo phare montre un « doreur à la feuille d'or
façonnant une pièce unique » — un geste artisanal en train de se faire, pas un produit détouré sur fond
blanc. La structure privilégie le récit (mission, adresses, portrait d'artisan, actualités) avant la
vente proprement dite.

**Ordre des sections :** Header nav → Bannière hero → Déclaration de mission → 3 cartes boutiques → Liens
vers les univers → Portrait d'artiste → Photo d'artisan + légende → Actualités/journal → Newsletter →
Engagements/valeurs → Footer.

**3 moves :**
- Photographie de l'artisan en train de travailler plutôt qu'un produit détouré → `data-reveal="blur"`
  pour un effet de matérialisation douce à l'entrée de ces images.
- Section « journal/actualités » éditoriale entre boutique et footer pour raconter le geste artisanal →
  `data-stagger` sur les cartes d'articles + `data-reveal`.
- Navigation par « univers » nommés plutôt que catégories génériques → `data-split` sur les titres
  d'univers pour une apparition mot par mot posée.

**À éviter :** multiplier les cartes d'adresses de boutiques et le texte de mission avant le produit. Pour
la plupart des artisans français, une seule adresse d'atelier + horaires suffit ; un artisan seul risque
d'enterrer la seule information que le visiteur est venu chercher.

---

### 4.6 Jacques Genin — [jacquesgenin.fr](https://jacquesgenin.fr/)
**Type :** boutique indépendante, artisan chocolatier-confiseur, Paris.

**Pourquoi ça fait cher :** site sur-mesure (classes CSS scopées trahissant un vrai développement
front-end, pas un thème générique). Typographie mêlant Futura (titres) et Avenir Next (corps). Palette
quasi monochrome (`#f0f0f0`, `#292929`, `#7c7c7c`) qui ne rivalise jamais avec les bruns saturés du
chocolat en photo. Le CSS révèle au moins 4 courbes `cubic-bezier` distinctes selon les transitions — un
travail de chorégraphie fine, pas un easing unique appliqué partout. Le hero s'articule autour d'une
vidéo intégrale (« Jouer la vidéo intégrale ») avec la légende « Autodidacte du goût ».

**Ordre des sections :** Header nav → Hero (titre + vidéo intégrale) → Déclaration de philosophie de
marque → 6 cartes de catégories produit → Section ingrédients/philosophie → Footer.

**3 moves :**
- Hero plein écran en vidéo/slideshow plutôt qu'une photo produit statique → `data-parallax="0.2"` sur le
  fond + `data-reveal` pour le titre superposé.
- Plusieurs courbes d'easing distinctes selon les zones (boutons vs images vs nav) → se traduit par des
  valeurs de `data-reveal-delay`/`data-scrub` différenciées section par section, un rythme voulu plutôt
  qu'un timing uniforme.
- Ligne de promesse ingrédients mise en avant comme un moment de lecture → `data-text-fill` sur la
  phrase-clé.

**À éviter :** un hero vidéo autoplay en pleine page pour un artisan local mobile-first à faible bande
passante. Ça fonctionne pour une marque déjà acquise ; un premier visiteur a besoin que l'adresse, les
horaires et le contact chargent instantanément, pas après la mise en tampon d'une vidéo.

---

## 5. Les 40 moves les plus transférables, classées par impact/coût

Classement du meilleur rapport (impact élevé, coût faible) vers les gestes plus coûteux ou plus
spécifiques. « Dans le moteur » = attribut/token déjà disponible dans `src/styles/global.css` ; « à
créer » = brique absente, à concevoir si un client le justifie vraiment.

| # | Move | Impact | Coût | Dans le moteur / à créer |
|---|---|---|---|---|
| 1 | Titre hero découpé mot par mot ou ligne par ligne à l'entrée | Élevé | Faible | `data-split` |
| 2 | Tagline/phrase-manifeste qui se remplit au scroll | Élevé | Faible | `data-text-fill` |
| 3 | Cascade de révélation sur listes (menu, services, équipe, avis) | Élevé | Faible | `data-stagger` |
| 4 | Parallax léger sur images hero/galerie (0,15-0,25) | Élevé | Faible | `data-parallax` |
| 5 | Une seule couleur d'accent, appliquée avec constance (CTA/liens uniquement) | Élevé | Faible | tokens `--accent`/`--on-accent` |
| 6 | Palette resserrée à 2 couleurs de marque max sur fond neutre | Élevé | Faible | tokens `--bg`/`--fg`/`--accent` |
| 7 | Titre hero = nom/adresse/geste précis plutôt que slogan générique | Élevé | Faible | discipline éditoriale (contenu) |
| 8 | Phrase-manifeste courte et centrée juste après le hero (philosophie avant produit) | Élevé | Faible | `data-reveal="blur"` |
| 9 | Échelle typographique display pour un hero à fort impact | Élevé | Faible | `data-scale="display"` |
| 10 | En-têtes de section alignés à gauche façon éditorial plutôt que centrés | Moyen | Faible | `data-headings="left"` |
| 11 | Témoignage client nommé, avec photo, traité comme moment fort | Élevé | Faible | `data-reveal` + `data-stagger` |
| 12 | Section « philosophie »/voix du propriétaire séparée des prestations | Élevé | Faible | `data-reveal` |
| 13 | Hero split-screen texte/portrait asynchrone | Élevé | Faible | `data-reveal="left"`/`"right"` |
| 14 | Duo de photos qui se chevauchent avec léger décalage au scroll | Élevé | Moyen | `data-scrub` |
| 15 | Section épinglée façon scrollytelling pour un process en 3-4 temps | Élevé | Moyen | `data-pin` + `data-pin-step` |
| 16 | Image flottante au survol d'un item de liste (menu, portfolio) | Élevé | Moyen | `data-hover-img` |
| 17 | Photographie du geste (mains, matière, artisan au travail) plutôt que produit détouré | Élevé | Moyen | `data-reveal="blur"` (dépend du matériel photo) |
| 18 | Nav qui se cache au scroll descendant, réapparaît en montant | Moyen | Faible | `data-nav="hide-on-scroll"` |
| 19 | Fond alterné une section sur deux pour rythmer la page | Moyen | Faible | `data-tone="alternate"` |
| 20 | Bouton CTA aimanté | Moyen | Faible | `data-magnetic` |
| 21 | Carte inclinée légèrement au survol | Moyen | Faible | `data-tilt` |
| 22 | Compteur numérique animé pour une preuve de volume réelle | Moyen | Faible | `data-counter` (chiffres réels uniquement) |
| 23 | Bandeau défilant pour presse/avis/mots-clés, pause au survol | Moyen | Faible | `data-marquee` |
| 24 | ~~Numérotation éditoriale des sections (01, 02…)~~ **retiré le 6 oct 2026** (signe IA, docs/GOUT.md § 2) | Moyen | Faible | `data-stagger` sur bloc numéro + titre |
| 25 | Duo de photos ensemble + détail présentées comme une paire | Moyen | Faible | `data-reveal` en stagger |
| 26 | Ligne de filiation/pedigree sous le titre (formation, maison, ancienneté) | Moyen | Faible | `data-split` court |
| 27 | ~~Emphase italique ciblée sur un segment du titre~~ **retiré le 6 oct 2026** (signe IA, docs/GOUT.md § 2) | Moyen | Faible | `data-split` + `data-reveal-delay` |
| 28 | Rythme de reveal différencié par zone (delays variés, pas un seul timing) | Moyen | Faible | `data-reveal-delay` |
| 29 | Trait qui se trace sous un titre ou une séparation | Faible | Faible | `data-draw` |
| 30 | Liste d'adresses/horaires en index typographique soigné | Faible | Faible | `data-stagger` |
| 31 | CTA de réservation flottant, toujours visible, indépendant de la nav qui se cache | Élevé | Moyen | à créer |
| 32 | Comparateur avant/après avec curseur interactif (rénovation, coiffure, esthétique) | Élevé | Élevé | à créer |
| 33 | Filtre de portfolio par catégorie sans rechargement de page | Moyen | Élevé | à créer |
| 34 | Formulaire de contact/devis multi-étapes avec indicateur de progression | Moyen | Élevé | à créer |
| 35 | Nav en overlay plein écran au lieu d'un menu déroulant | Moyen | Élevé | à créer |
| 36 | Rotation statique fine par carte, façon moodboard (photos punaisées) | Moyen | Moyen | à créer |
| 37 | Loader/compteur de progression qui retarde l'apparition du hero | Faible | Moyen | à créer (risque de performance perçue, à éviter mobile) |
| 38 | Verre dépoli (backdrop-blur) ciblé sur nav ou carte tarifaire | Faible | Moyen | à créer |
| 39 | Scrollbar masquée + inertie de scroll type Lenis | Faible | Élevé | à créer |
| 40 | Barre fixe en `mix-blend-mode: difference` (texte qui s'inverse selon le fond) | Faible | Élevé | à créer |

**Lecture rapide :** les lignes 1 à 13 sont les gains quasi gratuits — tout est déjà dans le moteur, il
s'agit surtout d'oser les utiliser (beaucoup sont sous-employées dans nos sites actuels : voir
`sites/chez-malo` pour un exemple qui combine déjà `data-text-fill`, `data-scrub`, `data-pin`/`data-pin-step`
et `data-hover-img`). Les lignes 31 à 40 sont les briques à ne construire qu'à la demande d'un client
précis — jamais par défaut, pour ne pas alourdir un site qui doit rester rapide sur mobile en 4G.

---

## 6. Ce que les sites français d'artisans font mal

*Observations tirées de 8 sites réels d'artisans/professions libérales françaises (plombier, menuisier,
garagiste, avocat), trouvés via PagesJaunes en recherchant métier + ville, et fetchés directement — sans
jugement nominatif, uniquement des patterns récurrents.*

### Typographie et lisibilité
**Absence quasi totale d'identité typographique.** La grande majorité des sites consultés utilisent la
police système par défaut du navigateur ou du thème CMS, sans déclaration de typographie propre à la
marque — aucune paire de polices travaillée pour distinguer titres et texte courant. Le résultat est un
rendu interchangeable : rien dans la typographie ne dit « menuisier depuis trois générations » ou
« cabinet d'avocat de proximité », alors qu'un site premium utiliserait une police de titre distinctive
et un système d'échelle typographique cohérent pour installer une personnalité dès la première seconde.

**Hiérarchie visuelle plate malgré une structure HTML correcte.** Les titres H1-H3 sont présents et
sémantiquement corrects, mais visuellement peu différenciés du corps de texte : mêmes graisses, mêmes
tailles proches, peu de contraste de poids. Le visiteur doit lire pour comprendre l'organisation de la
page au lieu de la scanner en quelques secondes, ce qui augmente le taux de rebond sur des pages de
service qu'on consulte justement en diagonale.

### Structure et navigation
**Menus dupliqués et structure de template non retravaillée.** Plusieurs sites affichent une navigation
en double (identique dans le header et en pied de page, parfois une troisième fois en sticky) — signe
d'un thème générique installé tel quel plutôt que redessiné. Ça alourdit le DOM, complique la maintenance,
et surtout communique implicitement que le site n'a pas été pensé sur mesure, ce qui contredit le
positionnement « artisan de confiance, travail soigné ».

**Un unique canal de conversion : le téléphone.** L'appel à l'action se résume presque toujours à
répéter un numéro de téléphone cliquable, sans alternative structurée — pas de formulaire de devis en
quelques clics, pas de prise de rendez-vous en ligne. Un visiteur qui consulte le site hors horaires
d'ouverture ou qui préfère écrire n'a aucune option et repart vers un concurrent mieux équipé.

### Images
**Mélange de photos stock génériques et de photos maison de qualité inégale.** Les carrousels d'accueil
combinent souvent une image de banque de photos (atelier générique, poignée de main, outils posés
artificiellement) avec des photos réelles de réalisations prises au téléphone, sans retouche ni recadrage
cohérent. Cette incohérence casse la crédibilité — c'est justement l'argument le plus fort d'un artisan
(la preuve visuelle du travail accompli) qui s'en trouve affaibli.

### Confiance et preuve sociale
**Preuve sociale minimale ou absente en dehors d'un lien externe vers Google Avis.** Les témoignages
clients structurés (citations, photos de chantier avant/après, études de cas détaillées) sont rares ;
quand ils existent, ils se limitent à un lien sortant vers une page d'avis tierce plutôt qu'une
intégration native — une friction inutile qui interrompt le parcours de conversion.

### Technique et contenu
**Contenu de démonstration non retiré à la mise en ligne.** Sur au moins un des sites étudiés, une
section entière conservait un intitulé de type « TITRE REFERENCE » — un placeholder de thème jamais
remplacé. C'est un signal fort de site livré rapidement puis jamais repris, qui nuit à la confiance autant
qu'une adresse mail qui ne répond jamais.

**Densité de texte mal calibrée pour la lecture rapide.** Certaines pages de service alignent des
paragraphes descriptifs assez longs sans découpage suffisant (listes à puces, sous-titres intermédiaires,
chiffres clés mis en avant). Sur mobile en particulier, ce type de bloc de texte non aéré décourage la
lecture complète et fait perdre le visiteur avant qu'il n'atteigne le call-to-action.

---

## 7. Sources

### Galeries consultées
- [Awwwards — websites](https://www.awwwards.com/websites/)
- [Awwwards — Food](https://www.awwwards.com/websites/food/)
- [Awwwards — Fashion](https://www.awwwards.com/websites/fashion/)
- [Awwwards — Photography](https://www.awwwards.com/websites/photography/)
- [onepagelove.com — Restaurant](https://onepagelove.com/category/restaurant)
- [onepagelove.com — Hotel](https://onepagelove.com/category/hotel)
- [siteinspire.com](https://www.siteinspire.com/)
- [siteinspire.com — filtre France](https://www.siteinspire.com/websites?filter=country:france)
- [footer.design](https://www.footer.design/)
- [lapa.ninja — food-drinks](https://www.lapa.ninja/category/food-drinks/)
- [lapa.ninja — furniture-interiors](https://www.lapa.ninja/category/furniture-interiors/)

Galeries tentées mais inexploitables au moment de la veille (403, redirection générique, ou hors-sujet) :
godly.website, land-book.com, minimal.gallery, une partie des accès directs à lapa.ninja/godly selon les
agents.

### Sites teardownés (§ 1 à 4)
The Devonshire (devonshiresoho.co.uk), Nowa (nowa.restaurant), TAB Kitchen & Bakery (tabkitchenbakery.com),
Madie (madie.es), Le Petit Bleu (lepetitbleucafe.com), 11 Bar (11elevenbar.com), Secret Garden Stresa
(secretgardenstresa.com), KUBE Hotel Saint-Tropez (kubehotel-saint-tropez.com), Septime
(septime-charonne.fr), Ludlow Blunt (ludlowblunt.com), Spoke & Weal (spokeandweal.com), Cinq Mondes
(cinqmondes.com), Clinique La Prairie (cliniquelaprairie.com), Tend (hellotend.com), Dr Sebagh
(drsebagh.com), Six Physio (sixphysio.com), SkinSpirit (skinspirit.com), Patrick Roger (patrickroger.com),
Tilly Sveaas (tillysveaas.co.uk), Christie Hemm Klok (christiehemmklok.com), Lune Croissanterie
(lunecroissanterie.com), Frances Palmer Pottery (francespalmerpottery.com), Seven Doors Tattoo
(sevendoorstattoo.com), Senawa Studio (senawastudio.com), Quatrième Étage (quatriemeetage.studio), Gabriel
Beaugonin (gabrielbeaugonin.com), Rodolphe Parente (rodolpheparente.com), Thomas Hervé (hervethomas.com),
Empreintes (empreintes.com), Jacques Genin (jacquesgenin.fr).

### Sites français consultés pour la § 6 (annuaires + sites directs)
Recherches PagesJaunes par métier + ville (plombier, menuisier, électricien, garage automobile,
boulangerie, coiffeur, avocat, serrurier, chauffagiste, peintre en bâtiment, artisan maçon) sur Limoges,
Poitiers, Angoulême, Chartres, Vierzon, Bourges, Tours, Guéret, Châteauroux, Niort, Dieppe, Blois. Sites
d'artisans/professions consultés directement : artisan-fleuriaud.fr, durand-menuiserie-vienne.fr,
garage-jeanty.fr, voiture-sans-permis-a2h-28.fr, laurence-regidor-marconnet-avocat.fr,
karinejollyavocat.fr, avocat-mb-gaucher.fr, boulais-sarl.fr.

### Documents internes liés
- `docs/veille/tendances.md` § 2 (tendances 2025-2026, verdicts par métier)
- `docs/veille/concurrents.md` (marché des prestataires de sites pour artisans)
- `sites/chez-malo/sections/*.astro` (exemple de site déjà construit avec ce vocabulaire `data-*`)
- `src/styles/global.css` (contrat de tokens et vocabulaire motion)

**Limite méthodologique commune à toute cette veille :** WebSearch était à quota épuisé dès le début de
chaque sous-tâche ; la découverte de sites s'est donc faite presque entièrement par navigation directe des
galeries listées ci-dessus (WebFetch), puis fetch direct de chaque site retenu — complété par `curl` brut
quand utile pour extraire des valeurs CSS exactes (polices, hex) plutôt que de se fier au seul résumé
généré par WebFetch. Les rares sites marqués « non vérifié en détail » dans les sections 1 à 4 le sont
explicitement, et aucune valeur précise (police, couleur) n'a été inventée pour eux.
