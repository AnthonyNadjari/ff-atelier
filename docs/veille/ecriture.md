# Veille — écrire des textes qui ne sentent pas la machine (français)

Date de la veille : 22 septembre 2026. Contexte : la structure et le mouvement de nos sites sont réglés
(`docs/veille/rendu.md`, `docs/veille/animations-2.md`). Il reste les textes. Les 20 démos de `sites/`
ont été rédigées par un modèle, et un lecteur français le sent au rythme, même quand chaque phrase est
correcte. Ce document cherche **pourquoi** on le sent, à partir de vrais sites français qui écrivent
bien et de la documentation existante, puis en tire dix règles opérationnelles versées dans
`docs/REDACTION.md` §14.

**Avertissement méthodologique.** 38 pages ont été réellement chargées ; seules celles dont le texte a pu
être lu sont citées ci-dessous, avec un extrait verbatim court. Les pages inaccessibles sont listées en
§4 et ne sont citées nulle part. Les extraits sont **recopiés**, jamais reconstitués : une citation
plausible mais inventée casserait la règle dure n° 2 de `CLAUDE.md` avant même d'avoir servi. Ce n'est
pas un avis juridique ; pour tout ce qui touche aux professions réglementées, `docs/REDACTION.md` §3
reste la référence.

---

## 1. Sources

### 1.1 Artisans, ateliers, restaurants, professions libérales (10)

| # | Source | Ce qu'elle fait bien | Extrait |
|---|---|---|---|
| 1 | [vldparis.fr/savoir-faire](https://www.vldparis.fr/savoir-faire/) — Ateliers VLD, ferronnerie d'art, MOF (Vitry-sur-Seine) | La page d'apparat est cassée net par la parole du MOF Joël Orgiazzi : phrases courtes, matière nommée, et un fragment sans verbe assumé à l'oral. | « Le travail de la forge est central, il faut l'aimer. Avec passion » |
| 2 | [essence-du-bois.fr](https://essence-du-bois.fr/) — Ivan Todoroff, ébéniste-menuisier, Cazilhac | Frise datée au jour près, opinions personnelles sur chaque essence, contre-indications qui desservent la vente, délai de réponse chiffré. Le meilleur du corpus. | « je refuse les chantier trop loin de Montpellier » |
| 3 | [coutellerie-du-maine-anjou.com](https://coutellerie-du-maine-anjou.com/) — Antoine Faucheux, coutelier, Angers | Biographie avec voisins nommés et métier abandonné, pas une « passion du beau geste ». Gamme chiffrée, lieu daté et situé. | « il allait passer ses mercredis avec ses voisins Maurice et Odile, mécaniciens agricoles ! » |
| 4 | [davidcolinmaroquinerie.com](https://www.davidcolinmaroquinerie.com/) — maroquinier, Paris 4e | Page entière à la première personne du singulier. La légitimité passe par un chiffre et un ancien employeur, pas par un adjectif. | « fort de 12 années d'expérience au sein de la maison Hermès » |
| 5 | [fournilalchimie.fr](https://www.fournilalchimie.fr/) — Benoît Dubart, boulanger au levain, Halluin | Reconversion datée, souvenir d'enfance situé, vocabulaire technique non édulcoré, et une rupture de stock affichée en haut de la page d'accueil. | « A l'âge de 7 ans, je découvrais cette magie du mélange Farine et eau » |
| 6 | [quartierrougeparis.com](https://www.quartierrougeparis.com/) — bistrot, Paris 20e | Un seul bloc écrit comme une chanson : « on » impersonnel répété, présent de narration, énumération qui accélère. Zéro vocabulaire de brochure. | « On rit, on s'exclame, on parle au bar, en terrasse ou à table. » |
| 7 | [baumaniere.com — Glenn Viel](https://www.baumaniere.com/gastronomie/loustau-de-baumaniere/le-chef-glenn-viel/) — trois étoiles, Les Baux-de-Provence | Trois étoiles et pourtant la preuve est faite d'objets concrets (séchoirs à tomates, cailloux d'assaisonnement) et de fournisseurs nommés, pas d'adjectifs. | « Après avoir fait installer des séchoirs à tomates sur les terrasses du restaurant » |
| 8 | [lacledubarbier.com/prestations-tarifs](https://lacledubarbier.com/prestations-tarifs/) — barbier-coiffeur, Paris | Chaque prestation = prix TTC + durée en minutes + une phrase de bénéfice familière. La FAQ répond aux questions gênantes. | « 30 min pour rester frais sans exploser le budget » |
| 9 | [cambuzat-dussourd-vernudachi-avocats.fr — honoraires](https://www.cambuzat-dussourd-vernudachi-avocats.fr/nos-honoraires-article-6-0-7.html) — avocats, Loches | Rarissime : des fourchettes de prix réelles par type de procédure, et des horaires qui disent ce qui est **fermé**. | « La première consultation est facturée entre 60 € et 120 € TTC » |
| 10 | [kinesdescanuts.com](https://www.kinesdescanuts.com/) — kiné & ostéo, Lyon 4e | La page hypnose s'ouvre sur une anecdote historique réelle, et se ferme sur une limite de compétence écrite comme une phrase, pas comme une mention légale. | « ne pratique l'Hypnose médicale que, et uniquement que, dans son champ de compétence » |

Sources d'appoint lues et vérifiées, citées en §2 : [atelier-bris.fr](https://www.atelier-bris.fr/) (ébéniste,
Paris 13e), [lepetitvendome.fr](https://lepetitvendome.fr/fr) (bistrot, Paris 2e),
[fournilbio.com](https://fournilbio.com/) (boulangerie bio, Lille), [kinelyon3.fr](https://kinelyon3.fr/)
(cabinet de kinésithérapie, Lyon 3e).

### 1.2 Marques françaises qui écrivent juste (12)

| # | Source | Ce qu'elle fait bien | Extrait |
|---|---|---|---|
| 11 | [loom.fr/pages/notre-mission](https://www.loom.fr/pages/notre-mission) | Page écrite en objections/réponses. Rythme cassé en permanence, paragraphes ouverts par « Et » ou « Mais », auto-dérision assumée. | « Forcément, sans pub, on grandit moins vite. Mais on est ok avec ça » |
| 12 | [loom.fr/pages/la-ou-on-galere-encore](https://www.loom.fr/pages/la-ou-on-galere-encore) | Une page entière consacrée à ce que la marque rate, sous-titrée par un aveu sec. L'échec est raconté sans excuse. | « Parce que notre marque est encore loin d'être parfaite. » |
| 13 | [Loom — blog, shorts qui décolorent](https://la-mode-a-l-envers.loom.fr/blog/le-syndrome-du-golfeur-comment-resoudre-le-probleme-des-shorts-qui-decolorent) | Article qui raconte un produit raté par la marque elle-même, en registre parlé, et garde l'aveu jusqu'au bout. | « La cata de notre premier bermuda » |
| 14 | [Loom — fiche produit t-shirt](https://www.loom.fr/fr-fr/products/le-t-shirt-coton-bio-femme) | Des données vérifiables (« 180g/m2 », « Made in Portugal », « 25 € ») plutôt que des adjectifs, et une ligne de taille parlée de trois mots. | « On taille normalement. » |
| 15 | [asphalte.com/pages/a-propos](https://www.asphalte.com/h/pages/a-propos) | Ouvre en s'adressant au lecteur et en se laissant contredire. Image familière au lieu du vocabulaire RSE. | « l'industrie textile est partie en cacahuète ces dernières années » |
| 16 | [Asphalte — la précommande](https://www.asphalte.com/h/pages/la-precommande-lingredient-secret-de-la-recette-asphalte) | Explique l'inconvénient central de son modèle au lieu de le cacher, et donne un rendez-vous horaire précis. | « Tous les mardis à 10h, on lance un nouveau produit. » |
| 17 | [tediber.com/pages/notre-histoire](https://www.tediber.com/pages/notre-histoire) | Chiffres de preuve plutôt que superlatifs, chute en jeu de mots sec sur le métier. | « Précurseur des 100 nuits d'essai, premier à vendre en direct sans intermédiaires coûteux » |
| 18 | [labonnebrosse.com — la beauté par le geste](https://www.labonnebrosse.com/pages/la-beaute-par-le-geste) | Raconte le travail fait, concrètement, au lieu de revendiquer une expertise. Les fondatrices sont nommées et situées. | « Nous avons étudié le cuir chevelu et le cheveu au microscope. » |
| 19 | [leslipfrancais.fr — fabrication française](https://www.leslipfrancais.fr/pages/fabrication-francaise) | Argumente par le compte, et retourne le discours écolo en une formule courte qui tient seule. | « Le sous-vêtement le plus éco-responsable est celui qu'on peut garder » |
| 20 | [merci-merci.com — le 111 boulevard Beaumarchais](https://merci-merci.com/pages/le-111-boulevard-beaumarchais) | Définit le lieu par ce qu'il n'est pas avant de dire ce qu'il est. Registre écrit, phrases courtes, affirmations tranchées. | « Loin d'être un sélectionneur d'objets, Merci est un questionneur de sens. » |
| 21 | [bellerose.com/fr/pages/about](https://bellerose.com/fr/pages/about) | **Contre-exemple utile** : slogan et triplet d'adjectifs, aucun fait vérifiable hors la date. Le patron exact à ne pas reproduire. | « Depuis 1989, Bellerose sélectionne des essentiels bien conçus » |
| 22 | [cabaia.fr/pages/a-propos](https://www.cabaia.fr/pages/a-propos) | L'humour est placé là où personne ne rédige : le message de panier vide. Détail domestique banal, donc vrai. | « Vide, comme un frigo un dimanche soir. » |

### 1.3 Rédaction web en français — sources normatives et professionnelles (9)

| # | Source | Ce qu'elle apporte | Extrait |
|---|---|---|---|
| 23 | [OQLF — Rédaction Web : grands principes](https://vitrinelinguistique.oqlf.gouv.qc.ca/index.php?id=25035) | La référence normative francophone : phrases, tournures, ton, et une liste explicite de ce qui ralentit la lecture (dont **les tirets et les parenthèses**). | « Les phrases courtes, actives, positives qui incitent à l'action […] sont à privilégier. » |
| 24 | [design.quebec.ca — langage clair et simple](https://design.quebec.ca/contenu/principes-redaction/langage-clair-simple) | La seule fourchette chiffrée officielle de longueur de phrase en français trouvée, plus l'exemple canonique actif/passif. | « Visez une longueur moyenne de 10 à 20 mots par phrase » |
| 25 | [DesignGouv / DINUM — atelier rédaction](https://design.numerique.gouv.fr/formations/design/atelier-redaction/) | Le triptyque doctrinal français du langage clair, côté État. | « simplicité, concision, faciliter le passage à l'action » |
| 26 | [Antidote — volet Style, lisibilité](https://www.antidote.info/fr/documentation/guide-utilisation/le-correcteur/mode-correction/volet-style/lisibilite) | Définit opérationnellement ce qui dégrade la lisibilité du français écrit soigné : les **cascades de compléments**, que ne voit aucun compteur de mots. | « Trop de compléments successifs enchâssés peuvent nuire à la fluidité et à la compréhension. » |
| 27 | [Abondance — bien rédiger pour le web](https://www.abondance.com/guides/bien-rediger-pour-web) | Seuils chiffrés français : phrase, paragraphe, introduction. | « 15-20 mots max » |
| 28 | [Yellow Dolphins — 44 conseils](https://yellowdolphins.com/publications/articles/checklist-pour-bien-ecrire-sur-le-web/) | La checklist la plus chiffrée : titres 4-10 mots, chapô ≤ 50 mots, libellés de liens 3-6 mots. | « Moins de 20 mots si possible » |
| 29 | [Editoile — la pyramide inversée](https://editoile.fr/la-pyramide-inversee-en-redaction-web/) | Les trois questions auxquelles le premier paragraphe doit répondre (de quoi ça parle, suis-je concerné, cela répond-il à mon besoin). | « rédiger un article en commençant par donner les informations les plus intéressantes au début » |
| 30 | [Redacteur.com — 10 règles d'or](https://www.redacteur.com/blog/les-10-regles-dor-de-la-redaction-web/) | Proscrit explicitement l'autopromotion — exactement le registre par défaut d'un site d'artisan raté. | « Adopter un style concis, éviter le jargon » |
| 31 | [Blog du Modérateur — 10 règles](https://www.blogdumoderateur.com/regles-redaction-web/) | La règle du vocabulaire courant, et l'injonction à donner des exemples concrets. | « Faites-en sorte de pouvoir être compris de n'importe qui » |

### 1.4 Marqueurs documentés du texte généré, en français (7)

| # | Source | Ce qu'elle apporte | Extrait |
|---|---|---|---|
| 32 | [Projet Voltaire — détecter un texte IA](https://www.projet-voltaire.fr/ressources/detecter-texte-chatgpt-ia-generative/) | Le marqueur par **absence** : pas de mot rare, soutenu ou argotique ; style plat, sans humour. | « la présence récurrente de mots génériques et impersonnels » |
| 33 | [PagesHub — le tiret cadratin](https://www.pageshub.fr/le-tiret-cadratin-lempreinte-revelatrice-de-chatgpt-et-les-strategies-devitement/) | La source la plus nette sur le tiret cadratin en français, plus l'hyperbole et le plan rigide en trois points. | « s'est imposé comme la signature involontaire de ChatGPT » |
| 34 | [Cours-NDRC — 15 signes](https://cours-ndrc.fr/detecter-ecriture-ia-guide-2026/) | La liste française la plus complète : ouvertures, adverbes, adjectifs, connecteurs, et un top 15 des métaphores IA dont « Au cœur de… ». | « Dans le paysage numérique actuel, il est crucial de comprendre que » |
| 35 | [Squid Impact — reconnaître un texte IA](https://www.squid-impact.fr/reconnaitre-texte-genere-ia-authenticite-2025/) | Le **paragraphe en trois temps** (phrase générale, info, clôture incitative) et la régularité métrique — les marqueurs les plus durs à masquer. | « paysage, essentiel, vital, dynamique, approfondir, de surcroît, crucial » |
| 36 | [dm1r.fr — détecter un texte IA](https://dm1r.fr/intelligence-artificielle/detecter-texte-ia-methodes-outils-2026/) | Les verbes passe-partout, l'absence totale de coquille, et la règle d'interprétation : c'est l'accumulation qui trahit, pas un marqueur isolé. | « Verbes passe-partout : "constituer, démontrer, contribuer" » |
| 37 | [Comptoir d'Encre — textes générés par IA](https://www.comptoirdencre.fr/textes-generes-par-ia-comment-les-reconnaitre/) | Les connecteurs logiques *visibles*, et l'absence de doute ou d'ironie. | « Usage fréquent de connecteurs logiques parfaitement visibles » |
| 38 | [Echosciences Normandie — l'IA appauvrit le langage](https://www.echosciences-normandie.fr/articles/vocabulaire-et-diversite-linguistique-comment-l-ia-appauvrit-le-langage) | Angle linguistique : homogénéisation, disparition des idiomes régionaux — pertinent pour des sites ancrés dans un quartier. | « abuse aussi bien d'adjectifs emphatiques, tels que crucial, essentiel, important ou fascinant » |

**Honnêteté sur les tells listés dans le brief** : « au cœur de » est bien documenté (source 34, métaphore
n° 3). En revanche « mettre un point d'honneur », « depuis toujours » et « savoir-faire » comme mot-valise
ne figurent dans **aucune** des sources lues ; aucune source française ne documente non plus les
« triplets d'adjectifs » sous ce nom (le plus proche : l'interdiction OQLF des « adjectifs non essentiels »
et la mention par dm1r.fr des « constructions symétriques, souvent en trois parties »). Ces trois-là
restent des heuristiques maison, et sont traités comme tels en §3.

---

## 2. Les 12 marqueurs d'un texte écrit par une machine en français

Chaque marqueur est illustré par une phrase prise **dans nos propres sites**, avec le fichier, puis
réécrit. Les réécritures citées ici sont celles qui ont été appliquées le 22 septembre 2026 aux cinq
sites `forge-delacroix`, `maison-roux`, `dubois-plomberie`, `lemaire-avocats`, `barbier-kessler`.

Mesures faites sur les textes des cinq `site.config.ts` **avant** la passe (151 phrases au total) :
écart-type des longueurs de phrase 5,6 à 8,8 mots pour une moyenne de 12,5 à 16,2 ; **0 phrase sur 151**
commençant par « Et », « Mais » ou « Alors » ; 20 énumérations de type « A, B et C » ; 16 usages du
deux-points comme unique mécanisme de rythme.

### M1 — Le rythme binaire : deux membres, même poids, virgule au milieu

Le patron le plus fréquent chez nous. Deux propositions de longueur presque égale, séparées par une
virgule, souvent en parallèle syntaxique parfait.

- **Avant** — `sites/maison-roux/site.config.ts`, `business.description` : « Troisième génération aux
  commandes : le tour de main se transmet, le pain reste le même. »
- **Après** : « Ce qui a changé, ce sont les mains : les grands-parents, puis leurs enfants, puis la
  troisième génération. Le pain, lui, sort du même four. » — la symétrie est rompue par une phrase
  courte qui ne répond pas à la première sur le même moule.

Source : dm1r.fr (36) — « Phrases trop longues et parfaitement équilibrées ».

### M2 — Toutes les phrases font la même longueur

- **Avant** — `sites/forge-delacroix/site.config.ts`, les quatre `services[].short` faisaient 9, 9, 10
  et 11 mots, tous construits comme une liste sans verbe : « Battants ou coulissants, motorisés ou non,
  dessinés pour votre entrée. » / « Intérieur ou extérieur, aux normes, en acier forgé ou en plat. »
- **Après** : les quatre cartes vont de 12 à 16 mots et changent de construction à chaque fois — l'une
  pose une condition (« La norme NF P01-012 n'est pas négociable. »), l'autre explique un mécanisme
  (« La structure tient seule : c'est elle qui porte les marches. »).

Source : Squid Impact (35) — « Nombre de mots constants d'un paragraphe à l'autre ».

### M3 — L'énumération ternaire, partout

Vingt occurrences de « A, B et C » dans les cinq fichiers avant la passe. Le triplet est le tic le plus
reconnaissable, et le corpus des marques confirme qu'il signale les pages creuses : Bellerose (21) tient
sa page « about » sur « Durability, comfort and timeless appeal » et ne dit rien de vérifiable.

- **Avant** — `sites/barbier-kessler/site.config.ts`, `services[].short` (barbe) : « Taille, dessin et
  finitions à la lame. »
- **Après** : « On taille, on dessine, on finit à la lame. 18 €. » — les noms deviennent des verbes, et
  le prix remplace la clôture décorative.

### M4 — Le deux-points comme unique moteur de rythme

Seize occurrences avant la passe, dont trois `services[].short` de `dubois-plomberie` bâtis sur le même
gabarit « liste : liste ».

- **Avant** — `sites/dubois-plomberie/site.config.ts` : « Évier, WC, douche ou canalisation bouchée :
  débouchage mécanique ou haute pression. »
- **Après** : « Évier, WC, douche. Le furet d'abord, la haute pression si le furet ne suffit pas. » — le
  point remplace le deux-points, et la seconde phrase dit un ordre d'intervention, pas une alternative.

### M5 — Aucune phrase ne commence par « Et » ou « Mais »

Zéro sur 151 phrases. C'est le marqueur le plus reproductible du corpus humain : Loom ouvre au moins six
paragraphes de sa page mission par « Et » ou « Mais » (11) ; Baumanière, trois étoiles, écrit « Et pour
accompagner cette 3ème étoile… » (7) ; La Clé du Barbier désamorce son propre passage dans GQ par « Mais
ce qui nous importe le plus… » (8).

- **Avant** — `sites/forge-delacroix/site.config.ts`, `about.story` : « On travaille l'acier à chaud, au
  marteau et à la presse, sur une forge à charbon. »
- **Après** : « L'acier se travaille à chaud, au marteau et à la presse. C'est lent. Et ça ne se rattrape
  pas : ce qui est raté repart au feu. »

### M6 — Les connecteurs logiques visibles, et rien entre les phrases

Le texte généré relie explicitement (« par ailleurs », « en outre », « ainsi ») ou ne relie pas du tout :
il juxtapose des phrases autonomes. Un Français qui écrit enchaîne par le sens, avec un « donc », un
« du coup », un « sauf que », ou rien mais avec une reprise (« Le pain, lui, … »).

- **Avant** — `sites/lemaire-avocats/site.config.ts`, `services[].description` (droit des affaires) :
  « Nous intervenons en amont, sur un contrat ou une création de structure, comme en aval, lorsqu'un
  différend commercial survient. »
- **Après** : « Nous relisons un contrat avant signature, nous accompagnons une création ou une cession,
  et nous prenons le dossier quand le différend est déjà ouvert. »

Source : Comptoir d'Encre (37).

### M7 — L'adjectif évaluatif à la place du fait

« complète », « propre », « rapide », « premium », « de qualité » : des mots que le client ne peut pas
vérifier. Harry Dry (`redaction-images.md` §1.1) et Marketing Examples formulent la même règle ; le
corpus artisan la confirme par l'inverse — David Colin (4) écrit « 12 années d'expérience au sein de la
maison Hermès », pas « une longue expérience ».

- **Avant** — `sites/barbier-kessler/site.config.ts` : « La formule complète, en un seul rendez-vous. »
- **Après** : « Les deux dans le même fauteuil, en un rendez-vous. 42 €. »

### M8 — Aucun chiffre là où un chiffre existe

Trois des cinq services de `barbier-kessler` avaient un `priceFrom` renseigné et un `short` sans le
moindre nombre : la page de service livrée ne contenait aucun chiffre hors pied de page. La Clé du
Barbier (8) ne donne jamais un prix nu : prix TTC + durée + ce qui est inclus. Le cabinet d'avocats de
Loches (9) publie une fourchette par procédure.

- **Avant** — `sites/barbier-kessler/site.config.ts` : « Coupe classique ou dégradé, au ciseau et à la
  tondeuse. »
- **Après** : « Classique ou dégradé. Ciseau, tondeuse, 28 €. »

### M9 — Aucune réserve, aucune limite, aucun refus

Un texte généré ne dit jamais ce qu'il ne fait pas. Le corpus humain en fait au contraire son argument
principal : « je refuse les chantier trop loin de Montpellier » (2) ; « ne pratique l'Hypnose médicale
que, et uniquement que, dans son champ de compétence » (10) ; Loom consacre une page entière à
« Là où on galère encore » (12) ; Asphalte assume l'attente de la précommande (16).

- **Avant** — `sites/dubois-plomberie/site.config.ts`, `business.description` : « Urgences 24h/24,
  assurance décennale, certifiés RGE pour les chaudières. »
- **Après** : « Le numéro tourne 24h/24. Assurance décennale, certification RGE pour les chaudières. Et
  si ce n'est pas une urgence, on vous le dit au téléphone plutôt que de se déplacer pour rien. »

### M10 — Zéro oralité, zéro mot familier précis

Projet Voltaire (32) le nomme par l'absence : « l'absence de mots "rares" appartenant au langage soutenu
ou argotique ». L'oralité humaine ne passe pas par le tutoiement ni les points d'exclamation, mais par un
lexique de conversation inséré dans une syntaxe correcte : « partie en cacahuète » (15), « La cata »
(13), « On taille normalement. » (14), « Vide, comme un frigo un dimanche soir. » (22).

- **Avant** — `sites/dubois-plomberie/site.config.ts` : « Chauffe-eau électrique ou thermodynamique en
  panne, à remplacer ou à entretenir. »
- **Après** : « Plus d'eau chaude ce matin ? On regarde d'abord s'il se répare, avant de parler de
  remplacement. »

### M11 — Pas d'anecdote datée, pas de nom propre inutile

Les noms propres qui ne servent à rien commercialement sont exactement ce qui sonne humain : « ses
voisins Maurice et Odile, mécaniciens agricoles » (3), les fournisseurs nommés de Baumanière (7), « Flore
et Pauline, amies d'école » (18). Nos `about.story` donnaient la date mais gommaient l'incarnation.

- **Avant** — `sites/barbier-kessler/site.config.ts`, `business.description` : « Trois fauteuils, trois
  barbiers, un seul geste : couper juste et raser proprement. »
- **Après** : « Trois fauteuils et trois barbiers : Jonas, Malik et Théo. On coupe au ciseau, on taille à
  la lame. » — les trois prénoms existaient déjà dans `about.team` ; ils n'étaient simplement jamais dits.

### M12 — Le tiret cadratin en rafale, et la ponctuation trop régulière

Documenté deux fois plutôt qu'une : PagesHub (33) en fait la signature n° 1 de ChatGPT, et l'OQLF (23)
range de toute façon « les tirets et les parenthèses » parmi ce qui ralentit la lecture française. Avant
la passe : 6 tirets longs dans `maison-roux`, 4 dans `lemaire-avocats`, 3 dans `barbier-kessler`.

- **Avant** — `sites/maison-roux/site.config.ts` : « Délai minimum 48 h — pour un dimanche, commandez
  avant jeudi. »
- **Après** : « 48 h minimum. Pour un dimanche, il faut commander avant jeudi. »

---

## 3. Ce qu'écrit un vrai artisan — les cinq choses qu'il dit toujours et qu'on n'écrit jamais

1. **Le prix.** Pas « devis gratuit », mais un nombre. La Clé du Barbier colle prix et durée (« 44 € …
   30 minutes ») ; le cabinet de Loches publie « entre 840 € et 1 080 € TTC » pour un tribunal
   correctionnel ; Loom affiche « 25 € » sur la fiche produit. Un prix annoncé est la preuve la moins
   chère qui existe. **Chez nous** : `priceFrom` est renseigné et jamais repris dans le texte visible.
2. **Le délai, y compris quand il est mauvais.** « réponse rapide sous 2 à 3 jours en moyenne »
   (L'Essence du Bois) ; « Tous les mardis à 10h » (Asphalte) ; « vous recevez votre colis quelques
   semaines après le paiement » (Asphalte encore, qui annonce son propre inconvénient). Le corollaire :
   un artisan français écrit d'abord **quand on ne peut pas venir** — « Fermé : lundi matin et mardi
   après-midi » (avocats de Loches), « Rupture de Stock de Petit épeautre jusque début Octobre 2026 »
   (Fournil l'AlchiMie).
3. **Ce qu'il ne fait pas.** « je refuse les chantier trop loin de Montpellier et ne travaillerai plus
   les bois rares ou exotiques » ; « ne pratique l'Hypnose médicale que, et uniquement que, dans son
   champ de compétence ». Le refus est vendeur parce qu'il est coûteux à écrire.
4. **Le détail technique dont il est fier.** Un mot de métier non traduit, un nom de matière, une norme,
   une machine : « rafraîchis », « protéases », « bactéries indigènes » (Fournil l'AlchiMie) ; « vachette,
   taurillon, crocodile, galuchat, python, autruche » (David Colin) ; « cailloux d'assaisonnement »
   (Baumanière). C'est le contraire exact du marqueur M10.
5. **L'anecdote datée.** Une date au jour près et des noms propres qui ne servent à rien : « A l'âge de
   7 ans » ; « ses voisins Maurice et Odile » ; « L'histoire commence en 1870 avec mon
   arrière-arrière-grand-père menuisier à Castelsarrasin » (Atelier Pascal Bris).

**Conséquence pour `docs/BRIEF.md`** : quatre de ces cinq choses sont des *données*, pas du style. Si le
brief ne contient ni prix, ni délai, ni refus, ni anecdote datée, aucune règle de rédaction ne pourra
sauver le texte — la règle dure n° 2 interdit de les inventer, et c'est la bonne réponse. Le point à
corriger est en amont : ces quatre questions doivent être posées pendant l'appel client.

---

## 4. Ce qui n'a pas pu être lu

Rien n'est cité pour ces sources. Sézane (403 anti-bot), Maison Standards (activité cessée en mars 2026),
Ateliers Auguste (la page « histoire » renvoie du contenu de bandeau, non attribuable), Jimmy Fairly
(404), Le Gramme (non tenté), siecledigital.fr et cnews.fr (403), les PDF de modernisation.gouv.fr
(403 / boucle de redirection), pendanxguy.fr (DNS), ateliers-emg.fr (TLS invalide), atelierhaptique.fr
(JS seul), dissidi.com (« à propos » en 404), letaillevent.com (404).

Trois pistes du brief n'ont pas de source réelle : **Sarah Prévost** (aucune rédactrice web de ce nom
indexée), **Kaleido.fr** (rien sur la rédaction web), **Mots-Clés** (l'agence réelle est motscles.net,
spécialisée en écriture inclusive, sans guide de rédaction web publié). **design.numerique.gouv.fr n'a
pas de « guide de style »** : la ressource écriture y est la fiche de formation citée en source 25. Les
manuels de style de Le Monde et Libération ne sont pas publics.

---

## 5. Les dix règles retenues

Elles sont versées telles quelles dans `docs/REDACTION.md` §14, avec leur mode de vérification. Sept
d'entre elles sont contrôlées automatiquement par `ff verifier` (bloc « Textes », en **avertissement**,
jamais en échec — voir `scripts/ff/verifier.mjs`, fonctions `warnRythmeUniforme`, `warnTiretsCadratins`,
`warnMotsValises`, `warnEnumerationsTernaires`, `warnAucunePhraseParlee`, `warnPageServiceSansChiffre`,
`warnFaqReponsesUniformes`, testées par `tests/verifier-textes.test.mjs`). Les trois autres (R8 le mot de
métier, R9 la réserve, R10 l'anecdote) relèvent de la relecture humaine : une machine ne peut pas vérifier
qu'un détail est vrai, et c'est précisément le point.
