# Registre des architectures

Volet 2a ter de `/veille` depuis le 18 oct 2026 (`.claude/skills/veille/SKILL.md`, `docs/GOUT.md` § 0
« le déroulé change d'un site à l'autre »). Une architecture = un **site entier** : nombre de pages,
navigation, ordre des blocs de l'accueil et d'une page interne, place du contact et du téléphone. Deux
clients récents ne partagent pas la leur ; trois pistes = trois architectures. Les fiches sources se lisent
au `curl` (HTML servi) : on reprend la construction, jamais les textes, images, logos ou code.

À ne pas confondre avec `docs/veille/squelettes.md` (mécanique d'UNE page : coquilles, nav, tiroir) et
`docs/veille/structure-sites.md` (ordre des sections des 20 démos).

| id | source | pages | navigation | ordre de l'accueil | contact | réalisable avec (coquille + sections) | manque | convient à |
|---|---|---|---|---|---|---|---|---|
| [carrefour-portes](carrefour-portes.md) | eatcabalar.com | 10 (accueil, à propos, carte, carte du camion, camion, événements, questions, fournisseurs, contact, confidentialité) | barre fixe : logo, un bouton « Explorer » (menu plein écran, toutes tailles), action métier toujours visible | vidéo, intro + horaires, 3 portes (photo, 2 phrases, lien vers une page), réseau social, pied | pas de téléphone ; action n° 1 = commander ; formulaire sur page Contact | `flow` + nav `burger` ; `hero/video`, `services/alternating` (portes vers `/services/<slug>`, `servicePages`) ; `contactDrawer` | blocs par page de service (`services[].sections`), questions rattachées à une page, pages À propos/Contact à part (`layout.pages`), hero avec horaires, variante « portes » vers une page non service | lieu avec horaires et 2 activités séparables (restaurant, boulangerie, salon + événements), une action en ligne ; pas l'urgence |
| [projets-fiches](projets-fiches.md) | houseofhoney.com | 34 (accueil, studio, liste + 13 réalisations, actualités, chronique + 7 articles, presse, 6 histoires, contact) | en-tête fixe 5 liens + « Nous écrire » à part ; téléphone : bouton rond qui ouvre un panneau | signature 2 phrases, présentation, 6 chantiers (image, nom, lieu), dernier article, invitation à écrire, pied | page Contact (3 champs) ; téléphones seulement en pied, un par adresse | `flow` + nav `bar` ; `hero/typographic`, `about/story`, `proof/gallery` (`place`, `kind`), `cta/card`, `footer/columns` ; `conseils` pour la chronique | route `/realisations/[slug]` + schéma `realisations[]` (série de photos, texte, lieu, crédit), liste `/realisations`, visionneuse adressable, page Contact à part, multi-adresses, `press[]` | métiers de chantier photographiable (intérieur, ébéniste, paysagiste, ferronnier), au moins 4 chantiers à 5 photos ; pas l'urgence |
| [pages-adresses](pages-adresses.md) | tenbelles.com (+ offre-pro.tenbelles.com) | 11 (accueil, 3 pages d'adresse, 3 savoir-faire communs, à propos, contact, carrières, boutique), doublées en français ; + une page à ancres pour les pros | barre en haut : savoir-faire, « Nos cafés » qui se déplie en 3 adresses, « Vente aux pros » ; adresses répétées au pied | diaporama 2 produits, bandeau des 3 adresses (rue, itinéraire), manifeste, pied | un téléphone et des horaires PAR adresse, sur sa page (sans `tel:`) ; page Contact = adresses + formulaire 3 champs ; pros : leur formulaire | `flow` + nav `bar` ; `hero/stacked`, `about/story`, `footer/columns` ; savoir-faire = `services` en gabarit `fiche` | `lieux[]` (adresse, horaires, téléphone, photo, année par lieu), route `/adresses/<slug>` + JSON-LD par lieu, section bandeau des adresses, nav à groupe, objet `pros` + `/professionnels` | 2 adresses ou plus avec horaires et numéro propres (boulangerie, barbier, caviste, garage), clientèle pro séparable ; pas une seule adresse, pas l'urgence |
| [saisons-sorties](saisons-sorties.md) | guidelagrave.com | 15 fixes + 12 activités (6 été, 6 hiver) + 82 fiches de sortie + 4 pages par public (familles, scolaires, formation, entreprises) | deux entrées seulement, ÉTÉ et HIVER, dépliées en activités ; méga-menu avec portes par public ; `tel:` et Contact en icônes sur chaque page ; « Prochaines sorties collectives » | bienvenue + lieu + diplômes, coups de cœur de la saison (fiches cotées), actualités, réseaux, partenaires, pied | `tel:` en en-tête ; « Réserver » par sortie ; formulaire qui demande activité et dates | `flow` + nav `bar` ; `hero/stacked`, `services` + `servicePages`, `services[].lignes`, `conseils`, `process/steps`, `contact/form-split` (choix du besoin) | `services[].saison`, `sorties[]` (période, durée, niveau, prix, programme, inclus, à prévoir, public) + `/sorties/<slug>`, filtre par niveau en `:has()`, `/pour/<public>`, nav à groupes, champ dates au formulaire, réservation par sortie | métier saisonnier à 2 saisons ou plus et 2 activités par saison (guide, moniteur, loueur, centre équestre, paysagiste, traiteur, ferme) ; pas un métier sans saison |
| deroule-long *(architecture actuelle de l'usine, sans source)* | défaut du schéma (`layout.shell: 'flow'`) | accueil + une page par service + zones + mentions | nav en haut (`bar`, `minimal`, `split`, `floating`) | premier écran, preuve, services, à propos, questions, contact sur une longue page | section finale (`contact/*`), téléphone dans la nav | `flow`, `magazine`, `sticky-hero`, `slides` + toutes les variantes | rien : c'est le réflexe à éviter (GOUT § 0) | tout le monde, donc à ne prendre qu'en connaissance de cause |
| site-index *(architecture actuelle de l'usine, sans source)* | `src/shells/index.astro` | une page, entrées dépliables + pages service | pas de nav : la liste d'entrées est la page | ligne d'identité, liste géante d'entrées (`<details>`), accroche en pied | tiroir (`contactDrawer`) ou dernière entrée | coquille `index` | (réalisable) | photographe, artiste, architecte d'intérieur ; jamais l'urgence |
| panneau-fixe *(architecture actuelle de l'usine, sans source)* | `src/shells/split.astro`, `sidebar.astro` | une longue page + pages service | panneau ou rail fixe à gauche avec sommaire actif, nav classique sur téléphone | contenu qui défile à droite, mêmes sections que le déroulé long | téléphone et horaires dans le panneau, toujours visibles | coquilles `split` ou `sidebar` | (réalisable) | métiers où l'on appelle (horaires et téléphone toujours à l'écran), sites de 5 à 7 sections |

## Étude du 17 oct 2026 : 12 architectures et leur style complet

Pourquoi (fondateur, 18 oct 2026) : tous les sites de l'usine ont le même déroulé (premier écran, avis, services, à propos,
questions, contact, pied, sur une longue page) ; seul le haut change. L'usine avait pris aux vrais sites des mesures et des
sections, jamais leur **architecture entière**. Chaque fiche ci-dessous décrit une architecture complète (pages et leur rôle,
modèle de navigation, schéma de l'accueil et d'une page intérieure, contact, preuves, téléphone, rythme, profondeur), son
**style complet** (polices et tailles, couleurs et rôles, espacements, rayons, ombres, photos, boutons, animations, textures,
assez précis pour « appliquer le style du site X au client Y »), ce qu'il faut à l'usine pour la reproduire, à quels clients
elle convient et les signes IA à ne pas reprendre. On reprend une architecture et des proportions, jamais les textes, les
images, le code ni l'identité (logo, illustrations, nom) ; une police commerciale se remplace par un équivalent sous licence.

Méthode : `node scripts/ff.mjs demonter <url> --dossier docs/veille/architectures --nom <id>` sur chaque accueil (fiche
automatique renommée `<id>-demontage.md`, mesures `<id>.json`), plus un relevé complémentaire dans Chrome (`<id>-style.json` :
rayons, ombres, bordures, boutons, liens, images, largeur du texte, sections, éléments fixes et collants, défilement horizontal,
liens internes, règles de survol) sur l'accueil et une ou deux pages intérieures, ordinateur 1440x900 et téléphone 390x844 ;
défilement filmé à la molette pour les sites qui détournent le défilement (Gingko, Studio RHE, TAB). Captures regardées une
par une, dans `captures/` (non versionné, `.gitignore`). Une mesure absente reste « à juger ».

Sources : One Page Love (catégorie restaurant), minimal.gallery, liste « 20 Horizontal Scroll Websites » (reallygooddesigns.com),
démontages d'octobre (`docs/veille/demontages/` : Meyers, Mathilde De Chiara, Coquelicots, Agrumea, De Groene Afslag), et
deux maisons françaises connues (Du Pain et des Idées, Maisons de Bricourt). Écartés en route : Maisons Marcon (redirige
vers une boutique de réservation générique, aucun style propre), The Devonshire et Madie (déroulé trop proche du nôtre),
Le Saint Georges (son plan illustré est un bloc, pas une architecture : le modèle « lieu d'abord » est tenu par Le Petit Bleu,
dont le lieu reste fixé à l'écran).

## Les 12

| id | Modèle | Source | Style en une phrase | Convient à (données du client) | Coût usine | Implémentée |
|---|---|---|---|---|---|---|
| `carte-de-visite` | Un seul écran sans défilement : salutation selon l'heure, puis une photo en carte avec adresse, appeler, écrire posés dessus | [Nowa](nowa.md), restaurant, Allentown (US) | Grotesque géométrique unique, salutation fine de ~80 px contre tout le reste à 9-18 px, aplat terracotta puis photo sépia arrondie dans une marge crème | Peu de contenu, une très bonne photo ; commerce qui ouvre, bar ou restaurant qui vit sur Instagram, deuxième adresse | Faible | oui, coquille `carte` (18 oct) |
| `accueil-portes` | L'accueil est un sommaire : sous une photo, une grande porte par activité (diptyque photo + aplat), chaque porte mène à une page courte de même grammaire | [Maisons de Bricourt](bricourt.md), hôtels-tables-pâtisseries, Cancale | Niveaux de gris sans accent, serif de titrage en capitales espacées, aplats gris clair, angles droits, la couleur vient seulement des photos | 3 à 6 activités ou adresses distinctes, des photos par activité (hôtel-restaurant, domaine, boulangerie à plusieurs boutiques, menuisier cuisines / escaliers) | Faible à moyen | oui, `flow` + `services/portes`, gabarit `porte` (18 oct) |
| `index-projets` | L'accueil est l'index des réalisations, réglable par le visiteur (filtre par type, défilé ou grille), le contact sur une seule page « À propos » | [Mathilde De Chiara](mathilde-de-chiara.md), architecte d'intérieur, Bayonne | Papier `#f7f5f2`, interface minuscule (10-12 px) en marge, serif de titrage fin, 90 % de l'écran aux photos, aucun accent | 15 réalisations et plus, classables en 3 à 5 types (agenceur, ébéniste, carreleur, paysagiste, photographe) | Moyen | oui, coquille `index-projets` (18 oct) |
| `lieu-fixe` | Écran partagé : le lieu (photos, « ouvert », adresse) reste fixé d'un côté, la carte et l'histoire défilent de l'autre ; au téléphone, le lieu en tête | [Le Petit Bleu](le-petit-bleu.md), café-crêperie, La Nouvelle-Orléans | Une seule encre bleu canard sur papier, serif de caractère + machine à écrire, cartes arrondies en mosaïque serrée, carte à prix pointillés | Commerce où l'on vient, avec carte ou tarifs détaillés et photos du lieu (café, boulangerie, barbier, institut, fromagerie) | Moyen | oui, coquille `lieu-fixe` + `services/carte-prix` (18 oct) |
| `outil-calendrier` | Site court dont l'accueil mène à un outil : le calendrier de disponibilités et de réservation en trois étapes ; le bouton de l'en-tête y saute | [Coquelicots](coquelicots.md), gîte, Dordogne | Police arrondie unique (texte 24 px), formes organiques bleu ciel et vert d'eau, photos découpées en nuages, pied rouge coquelicot | Qui vend des nuits ou des créneaux avec un calendrier iCal (gîte, chambre d'hôtes, salle, stages) ; en version devis guidé pour un artisan | Moyen | non |
| `cadre-couleur` | Toute la page dans un cadre de couleur fixe ; le héros reste collé au fond, le contenu monte dessus comme une feuille, le pied se découvre | [Meyers](meyers.md), groupe culinaire, Copenhague | Grotesque condensée grasse en capitales serrées (h1 128 px, interligne 0,75), beige sable, crème, olive, ocre ; une couleur par activité | Identité de couleur forte (devanture, logo) et plusieurs activités à colorer (boulangerie-traiteur, épicerie avec cours) | Faible | non |
| `cartes-empilees-agenda` | Les activités en cartes de couleur pleine largeur qui se recouvrent au défilement, puis le site devient un journal : agenda filtrable et nouvelles | [De Groene Afslag](groene-afslag.md), tiers-lieu, Bussum (NL) | Helvetica + Times + Courier (polices système assumées), grège et noir, une couleur franche par activité, collage d'objets détourés | 3 à 6 activités très différentes ; qui organise des rendez-vous datés (stages, marchés, dégustations, soirées) | Moyen | oui, coquille `cartes-agenda` + `services/cartes-empilees`, `agenda[]`, `/agenda` (21 oct) |
| `livre-ecrans` | Pages longues composées comme un livre : un écran = une idée (paragraphe de 50 caractères, photo portrait décalée, citation sur aplat) ; l'accueil ouvre trois portes bâties pareil | [Du Pain et des Idées](du-pain-et-des-idees.md), boulangerie, Paris 10e | Serif de texte léger à 20 px, papier `#faf9f7` et encre, bleus pâles en aplats, photos portrait sans cadre, aucun rayon ni ombre | Une histoire, un lieu, au moins 10 belles photos verticales et du vrai texte (boulanger, chocolatier, artisan d'art, restaurant d'auteur) | Moyen | oui, coquille `livre` + 4 sections « écran », gabarit `livre` (21 oct) |
| `scenes-epinglees` | Suite de scènes plein écran épinglées qui changent sur place : on traverse le lieu pièce par pièce, chaque espace un panneau de couleur, l'équipe en cartes | [TAB Kitchen & Bakery](tab-kitchen.md), café-boulangerie, Bangalore | Serif de titrage + texte en machine à écrire, sable, terracotta, ocre, olive, beaucoup d'illustrations à plat, un panneau de couleur par espace | Un lieu qu'on visite avec 3 espaces ou plus et une équipe qui pose (café, restaurant, ferme, atelier visitable) | Moyen | non |
| `panneaux-tranche` | Le site en panneaux côte à côte qui glissent vers la gauche, une tranche verticale fixe (nom + progression) comme le dos d'une chemise ; vertical au téléphone | [Studio RHE](studio-rhe.md), architectes, Londres | Serif de texte fin géant (h1 187 px) contre texte de 12 px, blanc et noir, un panneau entier orange corail, photos verticales pleine hauteur | Peu de texte, 6 projets et plus en photos verticales (architecte, constructeur, agenceur, photographe) | Fort | oui, coquille `panneaux` (bande `src/scripts/bande.ts`), `/realisations` (21 oct) |
| `carnet-horizontal` | L'accueil se feuillette de gauche à droite comme un carnet de croquis : chapitres posés librement sur une bande de 5 largeurs d'écran, rail fixe à gauche | [Gingko](gingko.md), conceptrice paysagère, Hérault | Une seule couleur olive doré sur papier, trois voix (sans fine en capitales, Baskerville, manuscrite), gravure botanique, dessins au trait, collage en couches | Métier de conception avec réalisations nommées et croquis (paysagiste, architecte d'intérieur, ferronnier d'art, céramiste) | Fort | oui, coquille `carnet` (même bande), `partenaires[]` (21 oct) |
| `gamme-vitrine` | Catalogue d'abord : l'accueil d'un écran est la gamme (produits détourés sur une roue), chaque produit a sa page, le reste derrière un menu plein écran | [Agrumea Farm](agrumea.md), conserverie, Sicile | Crème, bordeaux et orange, sans à empattements discrets, produits détourés posés sur les lettres géantes du titre, fiche technique à filets | Gamme courte et photogénique (6 à 20 produits) avec photos détourables (confiturier, savonnier, brasseur, chocolatier, coutelier) | Fort | non |

Ce qui existe déjà et sert de base (vérifié dans `src/lib/schema.ts` et `src/shells/` le 17 oct 2026) : coquilles `index`
(accueil-menu en liste), `slides` (sections plein écran aimantées), `split` (panneau fixe à gauche), `sticky-hero` (héros collé),
`magazine` ; pages `/services/<slug>` et `/conseils` ; `proof.gallery` avec `place`, `kind`, `size`, `client` ; moteur
`data-pin` / `data-pin-step` (scène épinglée à étapes) et `data-horizontal` (piste horizontale d'une section) ;
`contact.bookingUrl`, `orderUrl`, `giftCardUrl` ; horaires du jour (`src/lib/horaires.ts`).

## Ordre recommandé pour les implémenter

**Faites (18 oct 2026) : 1 à 4**, dans le registre `src/lib/architectures.ts` (`layout: { architecture: '<id>' }` pose
coquille, ordre des sections et gabarit des pages ; `donneesManquantes` dit ce qui manque au client) : `carte-de-visite`
(coquille `carte`), `accueil-portes` (section `services/portes`, `layout.servicePage: 'porte'`, `services[].images`,
`faq[].service` ; seconde source Cabalar), `index-projets` (coquille `index-projets`, `realisations[]` et
`/realisations/<slug>`, `layout.pageAPropos` ; seconde source House of Honey), `lieu-fixe` (coquille `lieu-fixe`, section
`services/carte-prix`, `services[].lignes`).

**Faites (21 oct 2026) : 7, 8, 10 et 11**, les plus éloignées des quatre premières et entre elles (preuve : un site jetable
par architecture copié de `_exemple`, `ff verifier` vert et `ff ressemblance` sous 0,65 au premier écran et au déroulé contre
tous les sites) : `panneaux-tranche` (coquille `panneaux` : bande horizontale de page entière pilotée par le défilement vertical
natif, `src/scripts/bande.ts`, tranche et rail fixes ; page `/realisations`), `carnet-horizontal` (coquille `carnet`, même
bande en chapitres de largeurs inégales, champ `partenaires[]`), `livre-ecrans` (coquille `livre`, sections
`about/ecran-texte-photo`, `proof/citations`, `services/liste-a-filets`, `contact/ecran`, gabarit de page `livre`),
`cartes-empilees-agenda` (coquille `cartes-agenda`, section `services/cartes-empilees`, champ `agenda[]`, page `/agenda`
filtrable, `src/components/ProchainsRendezVous.astro`). Restent 5, 6, 9 et 12.

Les plus éloignées de notre déroulé et les moins coûteuses d'abord. Chacune garde le socle (GOUT § 0 : plusieurs pages,
téléphone en haut, métier + ville, avis s'il y en a), que plusieurs sources n'ont pas.

1. **`carte-de-visite`** (faible) : nouvelle coquille d'un écran ; toutes les données existent (photo, adresse, `tel:`, horaires
   du jour). Aucun bloc empilé : la rupture la plus nette avec le déroulé.
2. **`accueil-portes`** (faible à moyen) : une section `services/portes` (tuile photo + aplat, toute la tuile vers
   `/services/<slug>`), un accueil réduit à héros + portes + pied, et un gabarit de page service plus court (photo, nom, labels,
   grille de photos, bouton, adresse) qui demande `services[].images[]`. Il pousse vers le multi-pages exigé par le socle.
3. **`index-projets`** (moyen) : coquille dont l'accueil est `proof/gallery` en plein écran, filtres par `kind` et bascule
   défilé / grille en CSS seul (`:has()`), compteur réel ; plus une page par réalisation (photos multiples, lieu, type, surface),
   réutilisée ensuite par `panneaux-tranche` et `carnet-horizontal`.
4. **`lieu-fixe`** (moyen) : variante inversée et photographique de la coquille `split` (panneau fixe à droite : photos du lieu,
   état ouvert / fermé, adresse) et une section carte ou tarifs en accordéons avec prix par ligne (nouveau champ de lignes à prix).
5. **`outil-calendrier`** (moyen) : section `contact/disponibilites` (iCal lu au build, choix des dates, demande par e-mail, sans
   paiement), champ `contact.calendarIcs`, porte « Réserver » vers l'ancre de l'outil ; note sur 10 dans les avis.
6. **`cadre-couleur`** (faible, mais plus proche du déroulé : la page reste longue) : coquille `cadre` dérivée de `sticky-hero`
   (marge de couleur fixe, feuille qui monte, pied découvert) et une couleur par activité (`data-theme` par service).
7. **`cartes-empilees-agenda`** (moyen) : section `services/cartes-empilees` (collantes, une couleur par service) et type de
   contenu `agenda[]` + page `/agenda` filtrable + bloc « prochains rendez-vous » (les articles existent déjà via `conseils`).
8. **`livre-ecrans`** (moyen) : famille de sections « écran » de 100 vh (texte + portrait décalé, citation sur aplat, deux photos
   décalées, liste à filets vers les pages) et gabarit de page service à la même grammaire ; aucune coquille.
9. **`scenes-epinglees`** (moyen) : section `about/espaces` (un panneau de couleur par espace dans une scène `data-pin` à étapes,
   pas de calage image par image sur iPhone) et une variante d'équipe en cartes ; base `slides`.
10. **`panneaux-tranche`** puis 11. **`carnet-horizontal`** (fort, à faire ensemble) : une coquille horizontale de page entière
    (défilement vertical natif qui pilote une piste `sticky` + `transform`, jamais de défilement simulé ; verticale au téléphone
    et en `prefers-reduced-motion`), sections calibrées à 100 vh, rail et tranche fixes, pages réalisation (de l'étape 3).
12. **`gamme-vitrine`** (fort) : type de contenu `products[]` (photo détourée, formats, composition, conservation, prix optionnel),
    pages `/produits/<slug>`, accueil-gamme en piste horizontale manuelle (`scroll-snap`, jamais la molette détournée), photos
    détourées à produire.

Règle d'usage, comme pour les familles de premier écran (`.claude/skills/site-final/premiers-ecrans.md`) : une architecture se
choisit sur les **données** du client (colonne « Convient à »), jamais deux fois de suite, et on ne reprend pas le style d'une
fiche sans retirer d'abord ce qu'elle liste en « Signes IA à NE PAS reprendre ».
