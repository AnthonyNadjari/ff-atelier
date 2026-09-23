# Premiers écrans — ce que nos 20 démos montrent avant le premier défilement

> Verdict du fondateur (22 sept. 2026) : structure, mouvement et photos sont réglés, « il reste le
> PREMIER ÉCRAN : c'est là qu'un visiteur décide, et c'est là que nos sites se ressemblent encore
> (titre, sous-titre, deux boutons, image) ». Ce document relève la composition réelle des 20 heros
> (§ 1, par script sur `sites/<slug>/sections/Hero.astro`, sans lire de captures), compte les recettes
> partagées (§ 2), puis relève ce que 15 premiers écrans primés mettent en premier (§ 3).
> Suite opérationnelle : § 4, les 12 premiers écrans refaits.

## 1. Relevé — les 20 heros, composition réelle

Lecture du markup de `sites/<slug>/sections/Hero.astro` (les 20 sites de `sites/finck-fisch/vitrine.json`
ont tous un hero sur mesure ; aucun n'utilise une variante partagée). « Texte » = éléments de texte de
premier rang (eyebrow, h1, sous-titre, lignes de données), hors légendes internes et `sr-only`.

| # | Site | Métier | Eyebrow | h1 | Sous-titre | Boutons | Image | Disposition | Ornement supplémentaire |
|---|---|---|---|---|---|---|---|---|---|
| 1 | forge-delacroix | Ferronnier | oui | tagline, 14vw | 1 § (description) | 2 (tél + devis) | photo plein écran + parallaxe | plein écran, texte en pied | mot « FORGE » vertical, marquee des pièces |
| 2 | osteo-marchand | Ostéopathe | oui | tagline | 1 § | 2 (tél + ancre) | photo « galet » | scindé 2 colonnes | puces de services, carte horaires flottante |
| 3 | encre-noire | Tatoueur | non | 2 mots géants | — | 0 | non | plein écran centré | trait tracé, mention artistes/ville |
| 4 | chez-malo | Restaurant | oui | tagline (text-fill) | 1 § | 1 (badge rond) | photo plein écran + parallaxe | plein écran, haut/bas | badge circulaire tournant |
| 5 | toits-cie | Couvreur | non | « FUITE ? », 17vw | 1 ligne | 1 (tél) | non | plein écran jaune | marquee des zones, biseau |
| 6 | anna-vidal | Photographe | non | nom de l'enseigne | 1 ligne (métier·ville) | 0 | photo plein écran épinglée | plein écran centré | 3 étapes `data-pin-step` |
| 7 | moteur-fils | Garage | oui | tagline | 1 § | 2 (tél + devis) | non | scindé crème/orange | badge rotatif, pastille, bande de services |
| 8 | dubois-plomberie | Plombier | oui | tagline | 1 § | 2 (tél + devis) | non | scindé 2 colonnes | carte de 5 données (`<dl>`), compteur |
| 9 | barbier-kessler | Barbier | oui | nom de l'enseigne | 2 § | 2 (devis + ancre) | non (rayures CSS) | pleine colonne | tél en tête, 3 compteurs, bandeau |
| 10 | jardins-mael | Paysagiste | oui | « Jardin. » | 2 § | 2 (tél + devis) | photo duoton | scindé 12 colonnes | tracé SVG, carte flottante, liste de 3 faits |
| 11 | maison-roux | Boulangerie | oui | nom de l'enseigne | 1 § | 2 (devis + tél) | non | pleine colonne | tél en tête, 2 étiquettes, marquee des pains |
| 12 | studio-ambre | Architecte | non | nom, 1 rem espacé | 1 ligne + 1 § | 0 | photo plein cadre | image + légende en pied | bandeau d'ours |
| 13 | ampere-fils | Électricien | oui | tagline | 1 § | 2 (tél + devis) | non (papier quadrillé) | pleine colonne | schéma SVG tracé, 5 pastilles |
| 14 | lemaire-avocats | Avocat | oui | tagline (text-fill) | 1 § | 2 (devis + ancre) | non (shader) | pleine colonne | ligne horaires + téléphone |
| 15 | veto-du-drac | Vétérinaire | oui | tagline | 1 § | 2 (devis + tél) | non | centré | 4 formes abstraites, tracé, 2 compteurs |
| 16 | atelier-lecerf | Menuisier | oui | tagline | 1 § | 2 (tél + devis) | 3 photos d'essences | colonne + bande de 3 panneaux | légendes « Essence n sur 3 » |
| 17 | maison-aurore | Institut | oui | tagline serif | — | 0 | photo plein écran duoton | plein écran centré | bandeau des rituels |
| 18 | cantine-roulante | Food truck | oui | 1 mot (scramble) | 1 § | 2 (devis + tél) | non | pleine colonne | marquee des plats |
| 19 | auto-ecole-rabelais | Auto-école | oui | tagline | 1 § | 2 (tél + devis) | vignette | scindé 12 colonnes | route SVG, 4 étapes, bande de mots |
| 20 | borie-des-chenes | Chambres d'hôtes | oui | nom de l'enseigne | — | 0 (1 ancre) | photo plein écran épinglée | plein écran centré | 3 étapes `data-pin-step` |

## 2. Diagnostic chiffré

Sur 20 sites :

- **16 ont un eyebrow au-dessus du h1** (80 %) — le tell « généré par IA » n°1, que `ff detect`
  surveille déjà (`hero-eyebrow-chip`) et que `docs/CONVENTIONS.md` règle 13 rationne.
- **17 ont un sous-titre paragraphe juste sous le h1** (85 %), dont **11 tirés mécaniquement de
  `business.description.split('\n')[0]` ou de l'intro** : même champ, même place, même longueur.
- **15 ont au moins un bouton**, et **13 ont exactement la même paire** : bouton plein
  `tel()` avec l'icône `Phone` + lien fantôme `#contact` portant `wording.devis`. Le markup du bouton
  téléphone est à quelques classes près identique sur 11 sites.
- **13 sites sur 20 (65 %) partagent la recette complète** : `eyebrow → h1 = tagline → paragraphe
  d'intro → bouton téléphone + bouton devis`, puis un ornement pour faire la différence (photo,
  marquee, badge, compteur, tracé SVG). Ce sont : forge-delacroix, osteo-marchand, moteur-fils,
  dubois-plomberie, barbier-kessler, jardins-mael, maison-roux, ampere-fils, lemaire-avocats,
  veto-du-drac, atelier-lecerf, cantine-roulante, auto-ecole-rabelais.
- **12 sites sur 20 emploient `business.tagline` mot pour mot comme h1** ; 5 emploient
  `business.name`. Aucun ne commence par autre chose qu'une phrase d'accroche ou un nom.
- **Seuls 4 sites sortent de la recette** : encre-noire (deux mots seuls), toits-cie (une question),
  studio-ambre (image plein cadre + légende), anna-vidal et borie-des-chenes (nom sur photo épinglée)
  — soit exactement les compositions que le fondateur ne critique pas.
- **Aucun des 20 ne commence par une donnée** : pas un prix, pas une heure, pas une adresse, pas une
  liste de villes, pas un numéro de téléphone traité comme l'objet principal. Toutes ces données
  existent pourtant dans les `site.config.ts` — elles sont reléguées en bas de page.

L'ornement varie beaucoup (c'est le travail des tours précédents) ; **l'ossature du premier écran,
elle, est la même 13 fois sur 20**. C'est elle qui « sent l'IA », pas la décoration posée dessus.

## 3. Ce que montrent 15 premiers écrans primés

Relevé par fetch des pages listées dans `docs/veille/animations-2.md` § 1.1 et
`docs/veille/squelettes.md` § 2, le 22 sept. 2026. Limite méthodologique identique à `squelettes.md` :
le fetch convertit la page en markdown, l'ordre du DOM est fiable mais le pli exact ne l'est pas — les
éléments listés sont les premiers du document, pas une mesure au pixel.

| # | Site | Ce qui vient en premier, dans l'ordre | Titre + sous-titre + boutons ? |
|---|---|---|---|
| 1 | [Boc.Studio](https://boc.studio/) | « Watch our showreel » → label « Creative brand studio » → titre court (4 mots) → **coordonnées GPS « 41.4120° N, 2.1580° E »** → « Barcelona » → index des 8 disciplines | Non : **aucun bouton, aucune image**, une position géographique à la place du sous-titre |
| 2 | [Obys](https://obys.agency/) | nom de l'agence → **index numéroté de 19 projets** (catégorie + services) → **heure locale « CET 00:00 »** → e-mail | Non : **l'index EST le premier écran**, pas de hero |
| 3 | [Whole Earth Index](https://wholeearth.info/) | titre → une phrase d'archive → **six entrées de catalogue avec leur logo** | Non : **l'accueil est l'index**, aucun CTA |
| 4 | [Quatrième Étage](https://quatriemeetage.studio/) | nom → 2 liens → **e-mail + Instagram dès le haut de page** → deux listes (services, publications) | Non : contact **en haut**, pas d'image, pas de bouton |
| 5 | [Baseborn Studio](https://baseborn.studio/) | logo → nav avec **compteur « Work (6) »** → **« CPH 12:00 »** (ville + heure) → nom → **définition de dictionnaire** « adjective of humble birth or origin » | Partiellement : la définition remplace le sous-titre |
| 6 | [Le Petit Bleu](https://lepetitbleucafe.com/) (café) | nom → « Order » → sous-titre court → **« We're open! » + horaires 7:00 AM – 7:00 PM** → **adresse postale complète** | Non : l'**état d'ouverture et l'adresse** sont le contenu principal |
| 7 | [White Desert](https://white-desert.com/) | titre → film → « Antarctica » → **5 itinéraires avec leur prix en gros (16 500 $ → 115 500 $)** | Titre oui, mais **le prix arrive avant tout argumentaire** |
| 8 | [Sedlecký Kaolin](https://sedlecky-kaolin.com/) | **« Sedlecký Kaolin since 1892 »** — le nom et la date sont le titre → 3 piliers → 1 bouton | Le **millésime fait partie du titre** |
| 9 | [Forge Automotive](https://forgeautomotive.co.uk/) (atelier auto) | **phrase-signature « For Those Who Refuse Ordinary »** → **grille de 9 photos carrées** → seulement ensuite le titre long | **Les images précèdent le titre**, 1 seul bouton |
| 10 | [Kononenko](https://kononenkogroup.com/) (architecte) | nav « Index / Work / About / Contact » → image plein cadre → titre → **données brutes : fondé en 2011, fondateur Anton Kononenko** | Titre + sous-titre, **0 bouton**, la fiche d'identité remplace le CTA |
| 11 | [Warm & Fuzzy](https://warmnfuzzy.tv/) | logo → phrase « is a creative company » → **vignette d'un projet** → titre en capitales → sous-titre | La **vignette précède le titre** |
| 12 | [Noho](https://noho.ink/) | **module « Energy usage » High/Med/Low** (éco-conception) avant tout → deux produits → titre → sous-titre | **Un outil interactif ouvre la page** |
| 13 | [This.design](https://this.design/) | logo → « About » → un titre-image → **un seul bouton, un mailto** | Ni sous-titre, ni photo : 3 éléments en tout |
| 14 | [Driessen Architectuur](https://driessenarchitectuur.nl/) | nom → slogan → **numéro de téléphone dans l'en-tête** → « Bekijk film » | Le **téléphone est visible avant le pli**, chez un architecte |
| 15 | [Horeca](https://www.horeca-social.com/en) | titre → sous-titre → description → 2 boutons → 3 statistiques | **Le contre-exemple** : c'est exactement notre recette |

**Ce qu'on en retient.** Sur 15 sites primés, **11 ne suivent pas le schéma titre → sous-titre →
deux boutons**. Les remplacements observés, tous transposables à un artisan sans inventer une seule
donnée :

- une **donnée de lieu** à la place du sous-titre (coordonnées, ville, adresse postale) — Boc, Quatrième Étage, Le Petit Bleu ;
- une **heure** : heure locale affichée (Obys, Baseborn) ou **état d'ouverture réel** (Le Petit Bleu) ;
- un **prix** avant l'argumentaire (White Desert) ;
- un **millésime intégré au titre** (Sedlecký « since 1892 ») ;
- un **index** qui remplace le hero (Obys, Whole Earth Index) ;
- des **images avant le texte** (Forge Automotive, Warm & Fuzzy) ;
- une **fiche d'identité brute** (année, fondateur) à la place du CTA (Kononenko) ;
- le **téléphone en haut** plutôt qu'en bas (Driessen) ;
- **trois éléments en tout** (This.design) ;
- un **outil** qui ouvre la page (Noho).

Et un constat dur : **0 des 15 n'affiche un eyebrow en capitales espacées au-dessus d'un h1** au sens
où nous le faisons (Boc et Forge Automotive ont un label, mais c'est une phrase de marque, pas une
étiquette « Métier · Ville »). Nous en avons 16 sur 20.

## 4. Les 12 premiers écrans refaits (22 sept. 2026)

Douze des treize sites à la recette commune ont été redessinés — un par idée de composition, chacune
adaptée au métier, aucune ne reprenant un bloc de `docs/SIGNATURES.md`. Le treizième
(cantine-roulante) est conservé : son mot unique en `data-scramble` sortait déjà du moule.

| Site | Idée du premier écran (élément dominant) | Ce qui disparaît |
|---|---|---|
| forge-delacroix | **Les données de la forge en tête, le titre en pied** — adresse, horaires, année d'allumage, label EPV lus comme un en-tête d'atelier ; le titre ferme l'écran | photo, eyebrow, sous-titre, 2 boutons, marquee |
| osteo-marchand | **Le vide** — le titre seul dans une page presque blanche, la photo réduite à une vignette format timbre légendée par l'adresse | eyebrow, sous-titre, 2 boutons, puces, carte flottante |
| moteur-fils | **Le millésime** — « 1994 » en chiffres à pleine largeur, le titre posé dedans | eyebrow, sous-titre, 2e bouton, badges, bande de services |
| dubois-plomberie | **Le numéro de téléphone comme image** — le numéro en très grand, cliquable, plus la mention 24h/24 | eyebrow, sous-titre, 2e bouton, carte de données |
| barbier-kessler | **Le tarif comme bloc de texte** — les cinq prestations et leurs prix composés en un paragraphe display plein écran | eyebrow, 2 sous-titres, 2 boutons, compteurs, bandeau |
| jardins-mael | **Le territoire** — les sept communes en colonne, grandes, tiennent l'écran | eyebrow, 2 sous-titres, 2 boutons, photo, tracé SVG, carte |
| maison-roux | **La devanture** — l'enseigne et les trois lignes d'horaires comme sur la porte vitrée | eyebrow, sous-titre, 2 boutons, étiquettes, marquee |
| ampere-fils | **Le relevé** — quatre lignes étiquette/valeur (norme, qualifications, délai, année) sous le titre | eyebrow, sous-titre, 2 boutons, schéma SVG, pastilles |
| lemaire-avocats | **La page de titre** — le titre, un filet, trois mentions nues (barreau, année, réception sur rendez-vous) | eyebrow, sous-titre, 2 boutons |
| veto-du-drac | **L'instruction** — « Appelez avant de vous déplacer » en grand, le titre au-dessus, le téléphone en lien | eyebrow, sous-titre, 2 boutons, formes abstraites, compteurs |
| atelier-lecerf | **La colonne de matière** — une seule planche photographiée du haut en bas de l'écran, le titre à côté | eyebrow, sous-titre, 2 boutons, bande de 3 panneaux |
| auto-ecole-rabelais | **Le panneau** — le titre enfermé dans un disque bordé, comme un panneau de code | eyebrow, sous-titre, 2e bouton, route SVG, étapes, bande de mots |

Contraintes tenues sur les douze : aucune donnée ajoutée (tout vient du `site.config.ts` existant),
tokens seulement, mobile d'abord, `<h1>` présent et lisible sans défilement, un seul groupe animé par
section (règle 21), un seul effet riche par page (règle 16 — les heros refaits ne portent plus de
marquee ni de compteur quand la page en a déjà un ailleurs).

---

*Relevé § 1 et § 2 produits par script sur le markup des 20 heros ; § 3 par fetch des 15 pages citées,
le 22 septembre 2026.*
