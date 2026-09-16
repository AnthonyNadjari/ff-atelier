# Veille — ressources visuelles gratuites/low-cost pour sites clients (Finck & Fisch)

Date de la veille : 16 septembre 2026.
Contexte : les artisans clients de Finck & Fisch n'ont presque jamais de bonnes photos. Ce document recense des sources légalement sûres (licence claire, usage commercial pour un site client tiers autorisé) et gratuites ou peu chères, pour compléter — pas remplacer — les vraies photos du client. Le générateur actuel `scripts/placeholders.mjs` produit des dégradés abstraits ; l'objectif ici est d'élargir la boîte à outils vers des visuels plus incarnés (photos, vidéos, illustrations) tout en gardant une trace d'attribution propre.

**Règle de prudence transversale** : une licence « gratuite » sur ces plateformes est presque toujours limitée à *l'usage du visuel dans un projet* (site, flyer, réseaux sociaux) et interdit la revente du fichier lui-même comme asset autonome. Beaucoup excluent aussi : les visuels contenant des marques/logos reconnaissables, l'usage comme logo/marque déposée, l'entraînement de modèles d'IA, et la redistribution en pack. Pour chaque asset utilisé chez un client, consigner la source + la licence au moment du téléchargement (voir §11) : les conditions changent avec le temps et une capture d'écran datée est la meilleure preuve en cas de litige.

---

## 1. Photos

| Source | Licence (résumé) | Attribution | API | Qualité recherche FR (plombier, boulangerie, coiffeur...) |
|---|---|---|---|---|
| **Unsplash** | [Unsplash License](https://unsplash.com/license) : usage commercial et personnel libre, aucune attribution requise pour un usage direct (téléchargement manuel) | Non requise en usage direct. **Requise si usage via l'API** (voir ci-dessous) | Oui, voir détail | Faible sur termes FR exacts ; correcte en anglais (bakery, plumber, hairdresser) |
| **Pexels** | [Pexels License](https://www.pexels.com/license/) : gratuit perso/commercial, sans attribution obligatoire | Non requise, mais recommandée (« Photo by X on Pexels ») | Oui, voir détail | Idem : chercher en anglais |
| **Pixabay** | [Pixabay Content License](https://pixabay.com/service/license-summary/) : gratuit perso/commercial | Non requise | Oui, voir détail | Idem, correcte en anglais |
| **Burst (Shopify)** | [Licence Burst](https://www.shopify.com/stock-photos/licenses/shopify-some-rights-reserved) : gratuit commercial/non-commercial, pas de revente du fichier brut | Non requise (appréciée) | Non (catalogue web uniquement) | Orientée commerce/retail, correcte pour vitrines, boutiques |
| **Kaboompics** | [Licence Kaboompics](https://kaboompics.com/page/license-and-faq) : « Standard License » gratuite commercial/perso ; les photos taguées « Editorial Use Only » exclues du commercial | Non requise | Non | Bonne pour lifestyle/intérieur/food — utile pour boulangerie, restauration, déco |
| **StockSnap.io** | [Licence CC0 StockSnap](https://stocksnap.io/license) | Non requise | Non documentée publiquement | Bibliothèque plus petite, chercher en anglais |
| **Rawpixel (collection "Public Domain")** | [rawpixel.com/public-domain](https://www.rawpixel.com/public-domain) : CC0 uniquement pour la collection explicitement taguée « Public Domain » — le reste du catalogue est payant/abonnement. Pas d'usage merchandising sans « valeur artistique substantielle » ajoutée | Non requise sur le fonds CC0 | Non grand public | Surtout utile pour illustrations d'époque/vintage, peu pertinent pour photos d'artisans modernes |
| **Wikimedia Commons** | Licence **variable par fichier** (CC0, CC-BY, CC-BY-SA, domaine public) — toujours vérifier la page du fichier. [Guide de réutilisation](https://commons.wikimedia.org/wiki/Commons:Simple_media_reuse_guide), [Commons:Licensing](https://commons.wikimedia.org/wiki/Commons:Licensing) | **CC-BY / CC-BY-SA : attribution obligatoire** (méthode T.A.S.L. : Titre, Auteur, Source, Licence) ; CC-BY-SA impose en plus le partage à l'identique des dérivés | Oui (MediaWiki API) mais peu adaptée à un usage « photo de service » | Bon pour des photos de lieux/monuments d'une ville, pas pour des photos de métier |

### Détail Unsplash API (hotlinking, download, quotas)

- **Hotlinking obligatoire** : l'API impose d'utiliser directement les URL renvoyées dans `photo.urls` (pas de re-upload/hébergement local des images de recherche), afin qu'Unsplash puisse comptabiliser les vues pour les photographes. Source : [Unsplash API Guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines).
- **Endpoint de déclenchement de téléchargement** : chaque fois qu'une image est réellement utilisée (ex. copiée dans le site), il faut appeler `GET` sur `photo.links.download_location` — un simple événement de comptage, pas un vrai téléchargement de fichier. Source : [Guideline: Triggering a Download](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download).
- **Attribution obligatoire côté API** (contrairement à l'usage manuel du site) : toute application utilisant l'API doit créditer le photographe et Unsplash avec un lien cliquable vers le profil du photographe, à chaque affichage. Source : [Unsplash API Terms](https://unsplash.com/api-terms).
- **Quotas** : 50 requêtes/heure en mode « Demo », 5000/heure en mode « Production » après validation de l'app par Unsplash. Statut visible dans l'en-tête `X-Ratelimit-Remaining`. Source : [help.unsplash.com — rate limit](https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit), [documentation API](https://unsplash.com/documentation).
- **Indemnisation** : la licence gratuite n'offre **aucune indemnisation** en cas de litige sur une photo (droit à l'image, marque…) — le risque est entièrement porté par l'utilisateur. Unsplash+ (payant) couvre jusqu'à 10 000 $ par fichier. À garder en tête pour des visuels avec des personnes reconnaissables sur un site client.

### Détail Pexels API

- Recherche : `GET https://api.pexels.com/v1/search?query=<terme>&per_page=15` avec en-tête `Authorization: <clé>`. Vidéos : `GET https://api.pexels.com/videos/search?...`.
- Quota par défaut : **200 requêtes/heure et 20 000/mois** ; extension gratuite à volume « illimité » sur simple demande à `api@pexels.com` en justifiant une attribution visible. Source : [Pexels API docs](https://www.pexels.com/api/documentation/), [help.pexels.com](https://help.pexels.com/hc/en-us/articles/900005851863-Do-I-have-to-pay-for-higher-limits).

### Détail Pixabay API

- `GET https://pixabay.com/api/?key=<clé>&q=<terme>&image_type=photo`.
- Quota : **100 requêtes/60 secondes** par clé (indépendant de l'IP) ; obligation contractuelle de **mettre en cache les réponses 24h**. Source : [Pixabay API docs](https://pixabay.com/api/docs/).

### Note générale sur la recherche en français

Aucune de ces bibliothèques n'indexe bien les métiers artisanaux français avec le terme exact (« plombier chauffagiste », « boulanger pétrissant la pâte »). Meilleure pratique : traduire vers des mots-clés anglais génériques (*plumber*, *pipes*, *bakery*, *baker kneading dough*, *hair salon*, *barber*, *craftsman workshop*, *hands tools*) puis curation manuelle — les résultats en anglais sont nettement plus riches et pertinents que la requête française directe.

---

## 2. Vidéos boucles (hero)

| Source | Licence | Attribution | Notes |
|---|---|---|---|
| **Pexels Videos** | Même licence Pexels (gratuit commercial) | Non requise | Même API que les photos, endpoint `/videos/search`. [Licence](https://www.pexels.com/license/) |
| **Coverr** | [Licence Coverr](https://coverr.co/license) : licence copyright irrévocable, mondiale, gratuite commercial/non-commercial | Non requise (appréciée) | Pas de revente/redistribution du fichier brut ; catalogue inclut désormais des clips générés par IA (marqués) |
| **Mixkit** | [Terms Mixkit](https://mixkit.co/terms/) : « Free License » = commercial OK sans attribution ; **attention à la « Restricted License »** sur certains clips = usage personnel uniquement — vérifier le tag de licence par clip | Non requise (licence Free) | Pas de filigrane sur les téléchargements gratuits |
| **Pixabay Video** | [Pixabay Content License](https://pixabay.com/service/license-summary/) : gratuit commercial | Non requise | Prudence sur les vidéos avec personnes identifiables (pas de garantie de « model release ») ou marques visibles |
| **Videvo** | Deux régimes à bien distinguer : **« Videvo Attribution License »** et **« CC BY 3.0 »** imposent un crédit (« Video by [Créateur] on Videvo ») ; un sous-ensemble marqué « Royalty-Free » ne le requiert pas. [Guide des licences](https://help.videvo.net/article/27-license-types-and-usage) | **Selon le tag du clip** — vérifier avant usage | Le plus « piégeux » des cinq : toujours lire l'étiquette de licence du clip individuel |

### Compression ffmpeg pour un hero < 2 Mo

Objectif pratique : boucle 6–10 s, sans son, largeur ≤ 1280 px, 24 fps, formats `.webm` (VP9, léger) + `.mp4` (H.264, fallback compatibilité) + une image `poster.jpg` extraite en fallback statique.

```bash
# WebM VP9 (format principal, le plus compact)
ffmpeg -i source.mp4 -an \
  -c:v libvpx-vp9 -b:v 0 -crf 32 \
  -vf "scale=1280:-2,fps=24" \
  hero.webm

# MP4 H.264 (fallback navigateurs anciens / Safari)
ffmpeg -i source.mp4 -an \
  -c:v libx264 -preset slow -crf 28 \
  -vf "scale=1280:-2,fps=24" \
  -movflags +faststart \
  hero.mp4

# Image poster (premier frame, pour affichage avant chargement / no-JS)
ffmpeg -i source.mp4 -vframes 1 -q:v 3 poster.jpg
```

Si le fichier dépasse encore 2 Mo, réduire `-crf` en l'augmentant (moins de qualité, ex. `-crf 36`) ou réduire la résolution (`scale=960:-2`) plutôt que d'allonger le débit. Toujours retirer la piste audio (`-an`) : un hero muet est plus léger et évite tout problème de droits sur une éventuelle musique de fond du clip source. Sources techniques générales : [Transloadit — reducing video file size with ffmpeg](https://transloadit.com/devtips/reducing-video-file-size-with-ffmpeg-for-web-optimization/), [Mux — compress video files with ffmpeg](https://www.mux.com/articles/how-to-compress-video-files-while-maintaining-quality-with-ffmpeg).

---

## 3. Illustrations

| Source | Licence | Attribution | Personnalisation couleur | Formats |
|---|---|---|---|---|
| **unDraw** | [Licence unDraw](https://undraw.co/license) : gratuit perso/commercial, y compris sur des visuels recolorés | Non requise | Oui — sélecteur de couleur d'accent intégré au site avant export | SVG, PNG |
| **Storyset** (Freepik) | [Licence Storyset/Freepik](https://www.licenseorg.com/guide/design-graphics/storyset) : licence Freepik standard, gratuite avec **attribution obligatoire** (ou abonnement Freepik Premium pour la lever) | **Requise** en gratuit | Oui, via l'éditeur en ligne | SVG, PNG, **Lottie animé** (utile pour micro-animations) |
| **Blush** | [Licence Blush](https://blush.design/license) : gratuit commercial/perso, licence copyright mondiale non exclusive | Non requise | Oui, par élément | PNG en gratuit ; SVG vectoriel réservé au plan Pro (12 $/mois) |
| **Open Doodles** (Pablo Stanley) | CC0 — libre de tout usage, y compris commercial | Non requise | Oui, via le générateur de palette du site | SVG, PNG, GIF |
| **Humaaans** (Pablo Stanley) | CC0 Public Domain | Non requise | Combinaison libre poses/vêtements/cheveux | Fichiers Figma/Sketch/Adobe XD |
| **IRA Design** | Licence MIT | Non requise | Oui — couleurs, objets, échelle | SVG, PNG |
| **DrawKit** (fonds gratuit) | [Licence DrawKit](https://www.drawkit.com/license) : gratuit commercial/perso ; pas de revente/redistribution des fichiers bruts, pas d'entraînement IA | Non requise (appréciée) | Variable selon pack | SVG, PNG |
| **Icons8 Ouch** | [Licence Icons8](https://icons8.com/license) : gratuit **avec attribution/lien retour obligatoire** sauf abonnement payant qui la supprime | **Requise en gratuit** — à éviter sur un site client sans le dire, ou passer en payant | Limitée | SVG, PNG |
| **Streamline** (sets open-source) | [Licence Streamline gratuite](https://help.streamlinehq.com/en/articles/5354376-streamline-free-license) : gratuit avec **attribution + lien vers streamlinehq.com obligatoires** pour les sets open-source ; usage limité aux « petits projets » (pas de redistribution comme asset d'appli) | **Requise** | Oui | SVG, PNG |
| **Popsy** | [popsy.co](https://popsy.co/) : 100 % gratuit mais **attribution obligatoire** vers popsy.co | **Requise** | Oui | SVG |
| **Absurd Design** | [Licence Absurd Design](https://absurd.design/license) : gratuit perso/commercial **avec mention obligatoire** « Illustration(s) from absurd.design » dans le produit final | **Requise** | Non (style figé) | SVG, PNG |

**À privilégier pour des sites clients sans mention de crédit visible** : unDraw, Open Doodles, Humaaans, IRA Design, DrawKit — aucune attribution requise. Storyset, Icons8 Ouch, Streamline, Popsy, Absurd Design imposent un crédit visible ou un abonnement payant pour l'éviter : à réserver aux pages internes/portfolio, pas au site livré au client sauf accord explicite sur la mention de crédit dans le footer.

---

## 4. Icônes

| Set | Licence | Taille/style | Package Astro |
|---|---|---|---|
| **Lucide** *(déjà utilisé dans le repo)* | ISC (permissive, équivalente MIT) | 24×24, trait fin, cohérent | `npm i @lucide/astro` — composants Astro natifs, SVG inline. [Doc](https://lucide.dev/guide/astro/) |
| **Phosphor** | MIT | 6 poids (thin → fill), 24×24 | Pas de package Astro officiel dédié ; s'utilise via `@phosphor-icons/core` (SVG bruts) ou via `astro-icon` + `@iconify-json/ph` |
| **Tabler** | MIT | 24×24, trait, ~6000 icônes | `@tabler/icons` (SVG) ou `astro-icon` + `@iconify-json/tabler` |
| **Heroicons** | MIT (Tailwind Labs) | 24×24 outline/solid, 20×20 mini | `astro-icon` + `@iconify-json/heroicons`, ou import direct des SVG npm `heroicons` |
| **Iconoir** | MIT | 24×24, ~1500 icônes | `astro-icon` + `@iconify-json/iconoir` |
| **Remix Icon** | ⚠️ **Anciennement Apache 2.0** ; les sources indiquent une **mise à jour de la licence propre « Remix Icon License v1.0 » effective en 2026** — à revérifier précisément sur [remixicon.com](https://remixicon.com/) et le fichier [License](https://github.com/Remix-Design/RemixIcon/blob/master/License) avant tout usage commercial, les conditions exactes ont changé | 24×24 | `astro-icon` + `@iconify-json/ri` |
| **Solar** | ⚠️ Non vérifié en direct cette session (le set complet est en grande partie un produit payant "Solar Icon Set" ; un sous-ensemble outline circule librement via Iconify sous licence permissive) — **à confirmer sur [icon-sets.iconify.design/solar](https://icon-sets.iconify.design/solar/) avant usage client** | 24×24, plusieurs styles | `astro-icon` + `@iconify-json/solar` |
| **Hugeicons** (sous-ensemble « Stroke Rounded ») | MIT pour le sous-ensemble gratuit (~6000 icônes) ; conserver la notice LICENSE.md dans le dépôt | 24×24 | `npm i @hugeicons/core-free-icons` |

**Astuce d'intégration** : plutôt que d'ajouter un package par set, l'unificateur [`astro-icon`](https://www.npmjs.com/package/astro-icon) combiné aux paquets `@iconify-json/*` (lucide, ph, tabler, heroicons, iconoir, ri, solar, hugeicons…) permet d'appeler n'importe quelle icône de n'importe quel set avec un seul composant `<Icon name="lucide:hammer" />`, en ne bundlant que les SVG réellement utilisés (tree-shaking).

---

## 5. Motifs, textures, fonds

| Outil | Type | Licence |
|---|---|---|
| **Hero Patterns** ([heropatterns.com](https://heropatterns.com/)) | Générateur de motifs SVG répétitifs, couleur/opacité réglables avant copie du code | Gratuit perso/commercial, pas d'attribution requise |
| **Haikei** ([app.haikei.app](https://app.haikei.app/)) | Générateurs de fonds SVG (blobs, vagues, dégradés, meshs) | Le SVG généré est libre d'usage, y compris commercial, sans attribution — c'est votre propre composition générée |
| **fffuel** ([fffuel.co](https://www.fffuel.co/)) | Suite d'outils SVG (grain, flou, motifs, rayures…) par Sarah Fossheim | Sortie SVG libre, sans attribution |
| **svgbackgrounds.com** | Générateur de motifs SVG, bibliothèque gratuite limitée + version Pro pour la personnalisation complète | Motifs de la version gratuite utilisables commercialement |
| **Pattern Monster** ([patternmonster.com](https://patternmonster.com/)) | Éditeur de motifs SVG en direct | Gratuit perso/commercial |
| **Cool Backgrounds** ([coolbackgrounds.io](https://coolbackgrounds.io/)) | Générateur de fonds (dégradés, bruit, grain) | Sortie libre d'usage |
| **MagicPattern** ([magicpattern.design](https://magicpattern.design/)) | Suite d'outils (grilles, mesh gradient, blur gradient…) | Sorties CSS/SVG libres ; certains outils freemium |
| **Générateurs de mesh gradient** (MagicPattern Mesh Gradient, Mesher, meshgradient.com…) | Dégradés organiques multi-points | Code CSS/SVG généré = votre propre code, pas de droits d'auteur tiers |
| **Bruit SVG (`feTurbulence`)** | Technique de code pur (filtre SVG natif) | Aucun tiers impliqué — 100 % sûr, c'est du code que vous écrivez |
| **Lost & Taken** ([lostandtaken.com](https://lostandtaken.com/)) | Textures papier/grunge haute résolution | Offre gratuite limitée utilisable perso/commercial sans attribution ; bibliothèque complète en abonnement payant |
| **Texture Labs** ([texturelabs.org](https://texturelabs.org/)) | Textures (papier, béton, tissu…) | Gratuit perso/commercial, sans attribution (historiquement) |
| **CSS pur** (dégradés linéaires/radiaux/coniques, `background-blend-mode`, `clip-path`) | Aucun asset, uniquement du code | Zéro risque juridique — c'est l'approche déjà utilisée par `placeholders.mjs`, à privilégier par défaut |

**Recommandation** : pour rester dans la philosophie actuelle de `placeholders.mjs` (rien de figuratif, pas de risque de droits), les techniques 100 % code (CSS, `feTurbulence`, fffuel/Haikei dont la sortie est un SVG généré sans tiers identifiable) sont la voie la plus sûre. Les bibliothèques de textures photographiques (Lost & Taken, Texture Labs) restent à vérifier au cas par cas si le client demande un rendu « matière » réaliste (papier kraft pour une boulangerie, par exemple).

---

## 6. Assets 3D et animation (motion)

| Source | Contenu | Licence / mise en garde |
|---|---|---|
| **Spline — Community** ([spline.design](https://spline.design/)) | Scènes 3D interactives dupliquables | **Licence définie fichier par fichier** par son créateur (badge visible sur la scène) — certaines CC0, d'autres CC-BY, d'autres « non redistribuable » : vérifier le badge avant usage commercial, ne pas supposer que tout le Community est libre |
| **poly.pizza** | Agrégateur de modèles low-poly gratuits (issus en partie de l'ancien Google Poly, de Kenney, et de la communauté) | Chaque modèle taggé individuellement (CC0, CC-BY, CC-BY-NC) — filtrer sur CC0/CC-BY pour du travail client ; CC-BY impose un crédit |
| **Sketchfab** | Modèles 3D, filtre « Creative Commons » disponible dans la recherche | Distinguer la **licence Standard payante** (rachat unique, royalty-free) des modèles **taggés Creative Commons** (CC0/CC-BY, gratuits). Dans tous les cas : pas de revente du modèle en tant que fichier autonome, pas d'usage en logo/marque. [Page licences](https://sketchfab.com/licenses) |
| **Kenney** ([kenney.nl](https://kenney.nl/)) | Immense bibliothèque d'assets (icônes, UI kits, sprites, modèles low-poly) | **CC0** — domaine public, tout usage y compris commercial, sans attribution (appréciée) |
| **LottieFiles (communauté gratuite)** | Animations Lottie (JSON) | Modèle mixte : les animations taguées « Free » sont utilisables commercialement mais **vérifier le tag par animation** — certaines restent liées à un abonnement Pro ; l'abonnement payant lève toute ambiguïté |
| **Rive — Community** ([community.rive.app](https://community.rive.app/)) | Fichiers `.riv` animés/interactifs partagés | Licence fixée par l'auteur du fichier (souvent CC0/libre) — vérifier la page du fichier. Le runtime Rive lui-même est open-source (séparé de la licence du contenu communautaire) |
| **IconScout** | Icônes, illustrations, 3D, Lottie (marketplace mixte) | Modèle proche d'Icons8 : gratuit avec **attribution obligatoire**, ou abonnement Pro sans attribution |

**Règle transversale 3D/motion** : contrairement aux photothèques, la licence ici est **par fichier et par créateur**, pas par plateforme. Toujours capturer/dater la mention de licence affichée au moment du téléchargement et la conserver dans le fichier de crédits du site (voir §11).

---

## 7. Polices (fonts)

| Source | Modèle | Licence type | Où l'obtenir |
|---|---|---|---|
| **Fontsource** *(déjà utilisé dans le repo, ex. `@fontsource-variable/archivo`)* | Miroir npm de Google Fonts + polices open-source tierces | Chaque paquet reprend **la licence d'origine de la police** (très majoritairement OFL — SIL Open Font License 1.1), gratuite en usage commercial, auto-hébergeable, pas d'attribution visuelle exigée par l'OFL | `npm i @fontsource-variable/<nom>` |
| **Fontshare** (Indian Type Foundry) | Fonderie indienne, distribution web + téléchargement | Annoncée « gratuite pour usage personnel et commercial » selon leur page de licences — **vérifier la page de chaque famille avant un usage client**, certaines polices ont pu passer sur un tarif Pro avec le temps | [fontshare.com](https://www.fontshare.com/), licences par police sur [fontshare.com/licenses](https://www.fontshare.com/licenses) |
| **Velvetyne Type Foundry** | Collectif français de fonderies open-source | Fontes sous licences ouvertes (majoritairement OFL), gratuites commercial | [velvetyne.fr](https://velvetyne.fr/) |
| **Collletttivo** | Collectif italien de typographes indépendants | OFL, gratuit commercial | [collletttivo.it](https://www.collletttivo.it/) |
| **The League of Moveable Type** | Fonderie pionnière du libre | Toutes les fontes sous OFL, gratuit commercial | [theleagueofmoveabletype.com](https://www.theleagueofmoveabletype.com/) |
| **Pangram Pangram** | Fonderie premium | ⚠️ **La majorité des familles PP sont gratuites en usage PERSONNEL uniquement** ; la licence commerciale est **payante** (licence par poste/abonnement « PP Fonts »). Quelques familles ponctuelles sont marquées « Free for Commercial Use » — **vérifier individuellement chaque police avant de l'utiliser sur un site client**, ne jamais supposer que le téléchargement gratuit couvre le commercial | [pangrampangram.com](https://pangrampangram.com/) |
| **Uncut.wtf** | Jeune fonderie indépendante | Modèle variable selon la police (certaines gratuites pour tout usage, d'autres « pay what you want », d'autres personnel uniquement) — vérifier chaque page | [uncut.wtf](https://uncut.wtf/) |
| **Open Foundry** | Répertoire curé de polices *exclusivement* sous licence ouverte | Sert de filtre de confiance : tout ce qui y est listé est déjà vérifié open-source (OFL en général) | [open-foundry.com](https://open-foundry.com/) |
| **Google Fonts** | Catalogue Google | Toutes les polices sous OFL ou Apache 2.0 — gratuit commercial sans condition, auto-hébergeable | [fonts.google.com](https://fonts.google.com/) — les ajouts récents (2025-2026) ne sont pas listés ici de façon exhaustive faute de vérification en direct cette session ; consulter `fonts.google.com` filtré par date d'ajout |

### Shortlist — 30 polices display distinctives, libres, sûres en commercial

Toutes disponibles via Fontsource (npm, auto-hébergement immédiat) sauf mention contraire. Les six premières (Bricolage Grotesque, Anybody, Archivo, Bodoni Moda, Cormorant, DM Sans, Epilogue, Figtree) sont **déjà installées dans le repo** — listées pour mémoire de ce qui existe déjà avant d'en ajouter de nouvelles.

| # | Police | Style | Licence | Déjà dans le repo ? |
|---|---|---|---|---|
| 1 | Bricolage Grotesque | Grotesque variable, très marqué | OFL | Oui |
| 2 | Anybody | Display condensé variable | OFL | Oui |
| 3 | Archivo | Grotesque neutre variable | OFL | Oui |
| 4 | Bodoni Moda | Serif haute-contraste variable | OFL | Oui |
| 5 | Cormorant | Serif élégant | OFL | Oui |
| 6 | DM Sans | Sans géométrique | OFL | Oui |
| 7 | Epilogue | Sans moderne variable | OFL | Oui |
| 8 | Figtree | Sans rond variable | OFL | Oui |
| 9 | Fraunces | Serif « soft », très utilisé pour l'artisanat/craft | OFL (Google Fonts) | Non |
| 10 | Instrument Serif | Serif display fin, très tendance 2024-2026 | OFL (Google Fonts) | Non |
| 11 | Space Grotesk | Grotesque à empattements carrés | OFL (Google Fonts) | Non |
| 12 | Sora | Sans géométrique variable | OFL (Google Fonts) | Non |
| 13 | Syne | Display expérimental variable | OFL (Google Fonts) | Non |
| 14 | Unbounded | Display arrondi variable, très marqué | OFL (Google Fonts) | Non |
| 15 | Big Shoulders Display | Display condensé variable (style affiche) | OFL (Google Fonts) | Non |
| 16 | Libre Caslon Display | Serif classique display | OFL (Google Fonts) | Non |
| 17 | Young Serif | Serif contemporain léger | OFL (Google Fonts) | Non |
| 18 | Gantari | Sans variable doux | OFL (Google Fonts) | Non |
| 19 | Fragment Mono | Monospace élégant | OFL (Google Fonts) | Non |
| 20 | Climate Crisis | Display variable data-driven, très singulier | OFL (Google Fonts) | Non |
| 21 | Rubik Wet Paint | Display décoratif ludique | OFL (Google Fonts) | Non |
| 22 | Basteleur | Serif display distinctif, fonderie française | OFL — [Velvetyne](https://velvetyne.fr/fonts/basteleur/) | Non |
| 23 | General Sans | Grotesque neutre polyvalent | Gratuite commercial (vérifier page) — [Fontshare](https://www.fontshare.com/fonts/general-sans) | Non |
| 24 | Satoshi | Sans géométrique très utilisé en SaaS/branding | Gratuite commercial (vérifier page) — Fontshare | Non |
| 25 | Switzer | Grotesque suisse contemporain | Gratuite commercial (vérifier page) — Fontshare | Non |
| 26 | Cabinet Grotesk | Display grotesque à forte personnalité | Gratuite commercial (vérifier page) — Fontshare | Non |
| 27 | Clash Display | Display géométrique très marqué | Gratuite commercial (vérifier page) — Fontshare | Non |
| 28 | Author | Sans variable élégant | Gratuite commercial (vérifier page) — Fontshare | Non |
| 29 | Erode | Serif display contemporain | Gratuite commercial (vérifier page) — Fontshare | Non |
| 30 | Boska | Serif display à fort caractère | Gratuite commercial (vérifier page) — Fontshare | Non |

⚠️ Pour les entrées Fontshare (23-30) : la page produit indique en général « Free for personal and commercial use », mais Fontshare a par le passé fait évoluer certaines familles vers des paliers payants pour des graisses supplémentaires — **toujours revérifier la page de la police précise avant intégration sur un site livré**.

---

## 8. Mockups / cadres d'appareils (pour les propositions clients)

| Outil | Licence / limite gratuite |
|---|---|
| **Shots.so** | Outil web gratuit (cadres macOS/iOS, fonds dégradés) ; les images générées sont réutilisables, y compris commercialement, sur l'offre gratuite |
| **Mockuuups Studio** | ⚠️ **Confirmé** : les exports du plan gratuit/essai sont « for evaluation and personal preview only — not for client work or other commercial use ». Licence commerciale = plan payant (~15 $/mois ou 120 $/an). **Ne pas utiliser le plan gratuit pour livrer une maquette à un client** ; il reste acceptable pour un usage strictement interne non diffusé |
| **Screely** | Outil gratuit (fenêtre navigateur + fond dégradé), pas de compte requis, images générées libres d'usage y compris commercial |
| **Cleanmock** | Générateur simple de mockups navigateur/appareil, gratuit, usage libre |
| **Pika** ([pika.style](https://pika.style/)) | Outil freemium (cadres, dégradés, cartes de preview) ; offre gratuite utilisable, quotas/fonctionnalités avancées réservés au plan payant — vérifier les conditions actuelles avant un usage récurrent |

**Nuance importante** : la légalité de ces outils repose sur le fait que **vous possédez déjà la capture d'écran** (c'est votre site) — le risque vient uniquement des conditions du *cadre décoratif*. Pour une proposition commerciale interne (PDF envoyé au client, pas publié en ligne), même un export gratuit limité est généralement acceptable ; pour un visuel utilisé publiquement (ex. portfolio Finck & Fisch), respecter la licence commerciale de l'outil.

---

## 9. Cartes

| Solution | Coût | RGPD |
|---|---|---|
| **Google Maps Embed** | Le format `iframe` simple (`google.com/maps/embed?...`) fonctionne souvent sans clé API ; l'API Embed « officielle » (Google Maps Platform) demande un compte Cloud + clé, avec un crédit mensuel gratuit généreux pour un usage type fiche artisan | **Nécessite en principe un consentement préalable au dépôt de cookies/traceurs**, sauf si le service n'est chargé qu'à la demande explicite de l'utilisateur (voir ci-dessous) |
| **OpenStreetMap + Leaflet** | Gratuit, licence de la donnée OSM = **ODbL** (attribution obligatoire « © OpenStreetMap contributors » visible sur la carte) ; Leaflet = BSD-2-Clause | Aucun cookie tiers si les tuiles sont servies par un hébergeur respectueux (éviter le serveur de tuiles officiel `tile.openstreetmap.org` en production, réservé aux usages légers — utiliser un fournisseur dédié) |
| **MapLibre GL JS** | Gratuit, open-source (BSD-3), fork de Mapbox GL après la fermeture de Mapbox | Aucun traceur par défaut ; dépend du fournisseur de tuiles choisi |
| **Protomaps** | Gratuit, tuiles vectorielles mondiales téléchargeables en un seul fichier PMTiles, auto-hébergeable | Zéro requête tierce si auto-hébergé — option la plus propre sur le plan RGPD |
| **Générateurs de cartes statiques** (Stadia Maps, MapTiler, Geoapify — offres gratuites avec clé API) | Quota gratuit mensuel (quelques milliers d'appels) | Pas de SDK JS de tracking, mais reste une requête vers un tiers européen — consulter la politique de cookies du fournisseur |

### Note RGPD/CNIL — Google Maps embarqué

D'après la CNIL, le dépôt de traceurs par un contenu tiers embarqué (comme une carte Google Maps) suit le régime général des cookies : consentement préalable obligatoire (directive ePrivacy art. 5(3), transposée à l'article 82 de la loi Informatique et Libertés), **sauf exemption** pour les traceurs « strictement nécessaires à la fourniture d'un service explicitement demandé par l'utilisateur ». Une carte Google Maps chargée automatiquement au chargement de la page (pas sur clic) **n'entre pas dans cette exemption** dès lors que Google peut traiter les données au-delà du strict nécessaire technique. Source : [CNIL — Cookies et traceurs, que dit la loi](https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi).

**Recommandation pratique pour ff-atelier** :
- Par défaut, utiliser OpenStreetMap/Leaflet (ou Protomaps auto-hébergé) sur les pages « nous trouver » : zéro cookie tiers, zéro bannière de consentement nécessaire pour la carte.
- Si le client tient spécifiquement à Google Maps (reconnaissance de l'UX « itinéraire Google »), implémenter un **pattern de chargement différé** (« façade » : image statique + bouton « afficher la carte ») qui ne déclenche l'iframe Google qu'après un clic explicite de l'utilisateur — cela sort la carte du champ du consentement préalable puisqu'aucun traceur n'est déposé avant l'action volontaire.

---

## 10. Widgets d'avis clients

| Solution | Modèle | Contrainte |
|---|---|---|
| **API Google Business Profile** | Officielle, gratuite | Nécessite une authentification OAuth 2.0 **en tant que propriétaire/gestionnaire vérifié** de la fiche établissement — Finck & Fisch ne peut pas afficher en direct les avis d'un client sans que celui-ci l'ajoute comme gestionnaire de sa fiche (ou passe par un flux d'autorisation dédié) |
| **Elfsight** | Widget embarqué (agrégation d'avis Google/Facebook) | Payant au-delà d'un usage très limité (1 widget, vues plafonnées, filigrane sur le plan gratuit) ; script tiers → vérifier sa propre politique de cookies avant intégration (même logique RGPD que Google Maps) |
| **Trustindex** | Idem, positionnement similaire à Elfsight | Palier gratuit limité (nombre d'avis affichés réduit, marque Trustindex visible) ; script tiers, même vigilance RGPD |
| **Import manuel (recommandé par défaut)** | Copier 3-6 avis réels (texte, prénom, date), avec l'accord du client, directement dans le contenu statique du site | Aucune dépendance API/OAuth, aucun script tiers, aucune question de consentement cookie — cohérent avec la philosophie « pas de dépendance externe fragile » de la boîte à outils. Rafraîchir manuellement lors d'un passage de maintenance |

### Note légale — faux avis (droit français)

- **Article L121-2 du Code de la consommation** : une pratique commerciale trompeuse inclut le fait de donner une fausse information sur l'origine ou l'authenticité d'un avis consommateur, ou de publier des avis sans moyens raisonnables de vérifier qu'ils émanent bien de consommateurs ayant réellement utilisé/acheté le produit ou service.
- Depuis la transposition de la directive européenne « Omnibus » (2019/2161), un professionnel qui affiche des avis consommateurs doit indiquer s'il vérifie leur authenticité, et comment (obligation d'information rattachée au même corpus de lutte contre les pratiques trompeuses du Code de la consommation).
- La **DGCCRF** contrôle activement ce point (campagnes de contrôle régulières sur les faux avis) ; les pratiques commerciales trompeuses relevant de l'article L121-2 sont sanctionnées, pour une personne physique, par une peine pouvant aller jusqu'à l'emprisonnement et une amende significative, et pour une entreprise par une amende pouvant atteindre un pourcentage du chiffre d'affaires moyen annuel — **les montants précis doivent être revérifiés sur Légifrance/economie.gouv.fr avant toute communication chiffrée à un client**, les sources officielles n'ont pas pu être interrogées en direct pendant cette session (erreurs d'accès).
- **Règle pratique pour ff-atelier** : ne jamais inventer de témoignage, ne jamais publier un avis dont l'origine n'est pas vérifiable, et être en mesure d'indiquer la méthode de collecte des avis affichés (ex. « avis Google authentiques, recueillis directement depuis la fiche de l'établissement »).

---

## 11. Proposition — commandes `ff` à intégrer

Cohérent avec l'architecture actuelle (`scripts/ff.mjs` route vers `scripts/ff/<commande>.mjs`, clés dans `.env` à côté de `ANTHROPIC_API_KEY`/`CLOUDFLARE_*`) :

### `ff photos <slug> "<requête>" [--source unsplash|pexels|pixabay] [--n 8] [--orientation landscape|portrait]`
- Traduit d'abord la requête FR → EN via une petite table de correspondance métiers (plombier→plumber pipes, boulangerie→bakery bread, coiffeur→hair salon barber…), cf. §1.
- Appels API :
  - Unsplash : `GET https://api.unsplash.com/search/photos?query=bakery&per_page=10&client_id=$UNSPLASH_ACCESS_KEY`, puis au moment de la sélection réelle : `GET {photo.links.download_location}&client_id=$UNSPLASH_ACCESS_KEY` (obligatoire, cf. §1).
  - Pexels : `GET https://api.pexels.com/v1/search?query=bakery&per_page=10` avec en-tête `Authorization: $PEXELS_API_KEY`.
  - Pixabay : `GET https://pixabay.com/api/?key=$PIXABAY_KEY&q=bakery&image_type=photo&per_page=10`.
- Télécharge les candidats dans `sites/<slug>/.ff-tmp/photos-preview/`, écrit un `CREDITS.md` (photographe, source, URL, licence, date) pour chaque image effectivement copiée dans `public/images/`.
- Ajouter à `.env.example` : `UNSPLASH_ACCESS_KEY=`, `PEXELS_API_KEY=`, `PIXABAY_KEY=`.

### `ff video <slug> "<requête>" [--source pexels|pixabay|coverr] [--max-mo 2] [--duree 8]`
- Recherche + téléchargement d'un candidat, puis exécute automatiquement le pipeline ffmpeg documenté en §2 (webm VP9 + mp4 H.264 + poster.jpg) pour tenir sous `--max-mo`.
- Écrit dans `sites/<slug>/public/videos/`.

### `ff illustration <slug> "<thème>" [--source undraw|drawkit|open-doodles] [--couleur "#RRGGBB"]`
- unDraw n'a pas d'API REST officielle documentée : le script doit reproduire localement la recolorisation (remplacement du fill dominant du SVG source par `--couleur`), comme le fait l'outil web.
- Écrit dans `sites/<slug>/public/images/illustrations/`.

### `ff icone <nom> [--set lucide|phosphor|tabler|heroicons|iconoir|solar|hugeicons]`
- Fine couche au-dessus d'`astro-icon` + `@iconify-json/*` pour homogénéiser l'usage des icônes entre sites sans avoir à chercher un SVG à la main à chaque fois.

### `ff carte <slug> [--fournisseur osm|google] [--consentement gate]`
- Par défaut, scaffold un composant OSM/Leaflet (aucun consentement nécessaire).
- Si `--fournisseur google`, scaffold le pattern « façade + clic pour charger » décrit en §9, pour qu'aucun site ne parte avec un traceur Google Maps toujours actif sans y avoir pensé.

### `ff avis <slug>`
- Prompt interactif pour saisir 3-6 avis réels (texte, prénom, date) collectés manuellement par le client depuis sa fiche Google, écrits dans `sites/<slug>/src/content/avis.json`. Volontairement **pas** d'intégration API/widget live, pour éviter à la fois la contrainte OAuth de propriété (§10) et le risque RGPD/DGCCRF d'un script tiers ou d'avis non vérifiés.

**Fil conducteur** : chaque nouvelle commande écrit un manifeste d'attribution lisible (`sites/<slug>/CREDITS.md` ou `.json`) — extension naturelle de la philosophie déjà en place avec `placeholders.mjs` (scripté, déterministe, sans chasse manuelle aux assets), tout en gardant une preuve exploitable en cas de contrôle de licence.

---

## 12. Sources

**Photos** : [Unsplash License](https://unsplash.com/license) · [Unsplash API Guidelines](https://help.unsplash.com/en/articles/2511245-unsplash-api-guidelines) · [Unsplash — Triggering a Download](https://help.unsplash.com/en/articles/2511258-guideline-triggering-a-download) · [Unsplash API Terms](https://unsplash.com/api-terms) · [Unsplash — rate limit](https://help.unsplash.com/en/articles/3887917-when-should-i-apply-for-a-higher-rate-limit) · [Unsplash documentation](https://unsplash.com/documentation) · [Pexels License](https://www.pexels.com/license/) · [Pexels API docs](https://www.pexels.com/api/documentation/) · [Pexels — higher limits](https://help.pexels.com/hc/en-us/articles/900005851863-Do-I-have-to-pay-for-higher-limits) · [Pixabay Content License](https://pixabay.com/service/license-summary/) · [Pixabay API docs](https://pixabay.com/api/docs/) · [Burst — licence](https://www.shopify.com/stock-photos/licenses/shopify-some-rights-reserved) · [Kaboompics — licence & FAQ](https://kaboompics.com/page/license-and-faq) · [StockSnap — licence CC0](https://stocksnap.io/license) · [Rawpixel — Public Domain](https://www.rawpixel.com/public-domain) · [Rawpixel — licences](https://www.rawpixel.com/services/licenses) · [Wikimedia Commons — guide de réutilisation](https://commons.wikimedia.org/wiki/Commons:Simple_media_reuse_guide) · [Wikimedia Commons — Licensing](https://commons.wikimedia.org/wiki/Commons:Licensing)

**Vidéos** : [Pexels License](https://www.pexels.com/license/) · [Coverr — licence](https://coverr.co/license) · [Mixkit — terms](https://mixkit.co/terms/) · [Pixabay Content License](https://pixabay.com/service/license-summary/) · [Videvo — types de licences](https://help.videvo.net/article/27-license-types-and-usage) · [Transloadit — ffmpeg video compression](https://transloadit.com/devtips/reducing-video-file-size-with-ffmpeg-for-web-optimization/) · [Mux — ffmpeg compression guide](https://www.mux.com/articles/how-to-compress-video-files-while-maintaining-quality-with-ffmpeg)

**Illustrations** : [unDraw — licence](https://undraw.co/license) · [Storyset/Freepik — guide licence](https://www.licenseorg.com/guide/design-graphics/storyset) · [Blush — licence](https://blush.design/license) · [Open Doodles](https://www.opendoodles.com/) · [Humaaans](https://www.humaaans.com/) · [IRA Design](https://iradesign.io/) · [DrawKit — licence](https://www.drawkit.com/license) · [Icons8 — licence](https://icons8.com/license) · [Streamline — licence gratuite](https://help.streamlinehq.com/en/articles/5354376-streamline-free-license) · [Popsy](https://popsy.co/) · [Absurd Design — licence](https://absurd.design/license)

**Icônes** : [Lucide — guide Astro](https://lucide.dev/guide/astro/) · [Phosphor Icons — LICENSE](https://github.com/phosphor-icons/core/blob/main/LICENSE) · [Tabler Icons — repo](https://github.com/tabler/tabler-icons) · [Heroicons — repo](https://github.com/tailwindlabs/heroicons) · [Iconoir — LICENSE](https://github.com/iconoir-icons/iconoir/blob/main/LICENSE) · [Remix Icon — repo/License](https://github.com/Remix-Design/RemixIcon/blob/master/License) · [Iconify — set Solar](https://icon-sets.iconify.design/solar/) · [Hugeicons — core-free-icons npm](https://www.npmjs.com/package/@hugeicons/core-free-icons) · [astro-icon — npm](https://www.npmjs.com/package/astro-icon)

**Motifs/textures** : [Hero Patterns](https://heropatterns.com/) · [Haikei](https://app.haikei.app/) · [fffuel](https://www.fffuel.co/) · [Pattern Monster](https://patternmonster.com/) · [Cool Backgrounds](https://coolbackgrounds.io/) · [MagicPattern](https://magicpattern.design/) · [Lost & Taken](https://lostandtaken.com/) · [Texture Labs](https://texturelabs.org/)

**3D/motion** : [Spline](https://spline.design/) · [poly.pizza](https://poly.pizza/) · [Sketchfab — licences](https://sketchfab.com/licenses) · [Kenney](https://kenney.nl/) · [LottieFiles](https://lottiefiles.com/) · [Rive — Community](https://community.rive.app/) · [IconScout](https://iconscout.com/)

**Fonts** : [Fontsource](https://fontsource.org/) · [Fontshare](https://www.fontshare.com/) · [Fontshare — licences](https://www.fontshare.com/licenses) · [Velvetyne](https://velvetyne.fr/) · [Collletttivo](https://www.collletttivo.it/) · [The League of Moveable Type](https://www.theleagueofmoveabletype.com/) · [Pangram Pangram](https://pangrampangram.com/) · [Uncut.wtf](https://uncut.wtf/) · [Open Foundry](https://open-foundry.com/) · [Google Fonts](https://fonts.google.com/)

**Mockups** : [Shots.so](https://shots.so/) · [Mockuuups Studio — pricing](https://mockuuups.studio/pricing) · [Screely](https://screely.com/) · [Cleanmock](https://cleanmock.com/) · [Pika](https://pika.style/)

**Cartes / RGPD** : [CNIL — Cookies et traceurs, que dit la loi](https://www.cnil.fr/fr/cookies-traceurs-que-dit-la-loi) · [Google Maps Platform — Embed API](https://developers.google.com/maps/documentation/embed/get-api-key) · [OpenStreetMap](https://www.openstreetmap.org/) · [Leaflet](https://leafletjs.com/) · [MapLibre GL JS](https://maplibre.org/) · [Protomaps](https://protomaps.com/)

**Avis clients** : [Google Business Profile — données d'avis (dev)](https://developers.google.com/my-business/content/review-data) · [Elfsight](https://elfsight.com/) · [Trustindex](https://www.trustindex.io/) · Code de la consommation, article L121-2 (à revérifier sur Légifrance) · economie.gouv.fr / DGCCRF (pages sur les faux avis, accès direct impossible pendant cette session — à revérifier)

---

*Points restés incertains à revérifier avant usage en production client* : conditions exactes de la nouvelle licence Remix Icon 2026, périmètre précis du set Solar Icons gratuit, montants exacts des sanctions DGCCRF (article L132-2 du Code de la consommation) pour faux avis, quota précis gratuit de l'API Google Maps Embed en 2026, et couverture exacte des ajouts Google Fonts 2025-2026 — les accès directs à `economie.gouv.fr`, `pangrampangram.com/licenses` et `kenney.nl/about` ont échoué pendant cette session (403/404) et n'ont pas pu être confirmés en direct.
