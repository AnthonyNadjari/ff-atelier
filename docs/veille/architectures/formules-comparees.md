# formules-comparees : le site d'un prestataire à forfaits est le choix de sa formule

Volet 2a ter de `/veille`, tour du 27 oct 2026 (soir, tour 12). Relevé au `curl` (HTML servi) de deux sites, plus les
démontages automatiques déjà faits par la veille du marché (`docs/veille/marche/micka-photographe.md`,
`framer-greencraft.md`, `framer-hydrowell.md`). On reprend la construction, jamais les textes, images, logos ou code des
sources.

## Sources

- **Micka photographe** (photographe de mariage indépendant près du Mans, premier sur « photographe de mariage Le Mans »
  au tour 11 du marché) : [micka-photographe.fr/photographe-mariage-sarthe](https://micka-photographe.fr/photographe-mariage-sarthe/),
  lu le mardi 27 oct 2026. Quatre forfaits nommés à prix écrits (Intime 150 €, Souvenir 290 €, Émotion 490 €, Évidence
  690 €), deux d'entre eux **moins chers en semaine** (« 390 € en semaine »), « Chaque forfait inclut mon déplacement (en
  Sarthe) » au-dessus des quatre, et **sous chaque forfait sa porte** « Vérifiez la disponibilité ».
- **GreenCraft** (modèle Framer de paysagiste d'entretien, Webray Studio, rang 5 de Home Services) :
  [greencraft.framer.website/pricing](https://greencraft.framer.website/pricing). Trois formules (89 $ la visite, 299 $
  et 549 $ par mois), **« Everything in Essential », puis ce qui s'ajoute**, « Most Popular » sur celle du milieu,
  « No contracts. Cancel anytime. Same crew, every visit. » au-dessus. Contenu factice : on n'en garde que le plan.
- Voisines comptées par la veille du marché (CE-QUI-VEND.md, « Formules nommées à prix écrits, chacune avec son bouton »,
  4 / 18, et « Forfaits d'entretien à l'abonnement », 3 / 45) : Hydrowell (149, 249, 449 $), Movers (99, 149, 199 $).

## Pages

Micka : 12 pages (accueil, mariage, les séances, une page par séance : grossesse, nouveau-né, famille, portrait
artistique, boudoir ; contact ; mentions) ; **les forfaits sont sur la page de chaque séance**. GreenCraft : une trentaine
(accueil, six services, **Pricing**, douze réalisations, articles, à propos, contact) ; les formules sont à la fois sur
l'accueil et sur Pricing.

## Navigation

Micka : quatre entrées (Accueil, Mariage, Les séances, Contactez-moi), pas de téléphone en tête (numéro sans lien dans
le pied : défaut). GreenCraft : six entrées dont **Pricing**, le numéro et « See plans » à droite.

## Accueil (Micka, page mariage, mesuré)

h1 « Photographe mariage en Sarthe » sur une grande photo, mosaïque de photos, un paragraphe d'approche, « Les forfaits
présentés ci-dessous sont une base », la ligne commune (déplacement compris), **les quatre forfaits côte à côte** (nom,
« uniquement en semaine » ou le prix en semaine, le prix, la durée de couverture, le nombre de photos, ce qui est
couvert, la porte), puis la galerie, un texte long, la FAQ, le pied (une page par séance). GreenCraft, accueil : photo,
note Google (612 avis), « See plans », services, formules, réalisations datées, questions (« How does billing work? »).
**C'est la transposition** : le visiteur ne lit pas un catalogue, il compare trois ou quatre forfaits nommés et en
choisit un ; l'usine met les formules juste sous le premier écran, chacune avec son prix, sa durée et sa porte, et une
page par formule qui porte la demande déjà réglée sur elle.

## Page intérieure (une formule)

Ni Micka ni GreenCraft n'ont de page par formule (le bouton ouvre un formulaire générique) : l'usine en ajoute une
(`/formules/<slug>`) pour le socle « une page par offre » (GOUT § 0) : nom, prix et prix en semaine, à qui elle
s'adresse, ce qu'elle comprend (et la formule qu'elle reprend), ce qui est commun à toutes, les conditions, puis la
demande avec la formule choisie et le téléphone. `/formules` : la comparaison complète en tableau.

## Contact et preuves

Micka : aucune preuve (ni avis, ni mariages nommés) : défaut. GreenCraft : la note et le nombre d'avis sous le h1.
L'usine : le téléphone en tête (socle), la note et les avis sous les formules, le tiroir de contact.

## Style des sources (pour mémoire, non repris)

Micka : Cinzel en capitales, Playfair Display, rose poudré, bannière cookies sur 17 % du téléphone. GreenCraft : Plus
Jakarta Sans, Inter, Playfair, 13 pilules sur 13, coches vertes devant chaque ligne. On ne reprend que l'architecture ;
le style vient des atomes (`ff melanger`) ; **jamais de coches façon tarif de logiciel** (GOUT § 2) : la liste est du
texte, la comparaison dit « compris » en mots.

## Ce qu'il faut à l'usine

- `formules` dans le schéma : `liste[]` (slug, nom, prix, `prixAutre` « 390 € en semaine », rythme « par mois », pour
  qui, durée, ce qu'elle comprend, la formule qu'elle reprend, photo, note, `conseillee` seulement si le client le dit),
  `communs[]` (compris dans toutes), `conditions[]` (sans engagement, moins cher en semaine).
- Une coquille dont l'accueil est le choix : h1, métier à la ville, téléphone, note ; les formules côte à côte (en
  piste au téléphone, `scroll-snap`, jamais la molette détournée), chacune avec sa porte ; la ligne commune et les
  conditions ; puis les avis, l'histoire, les questions.
- `/formules` (tableau de comparaison, lisible sans script) et `/formules/<slug>` (la formule et sa demande réglée).

## Convient à

Prestataire qui vend des forfaits nommés à prix fixes : photographe (mariage, séances), paysagiste ou jardinier
d'entretien, pisciniste, laveur de vitres, nettoyage, ramoneur, entretien de chaudière ou de climatisation, auto-école,
toiletteur, traiteur à menus, DJ ; 2 formules à prix au moins. Pas pour un chantier sur devis (`estimation-etapes`), ni
pour une carte de soins à la minute (`carte-des-soins`), ni pour des cours en barreaux (`parcours-atelier`).

## Signes à ne pas reprendre

Coches vertes devant chaque ligne ; « Most Popular » posé d'office sur la formule du milieu (seulement si le client le
dit) ; boutons pilule ; prix sans ce qu'ils comprennent ; numéro sans lien `tel:` ; « No contracts. Cancel anytime. »
écrit sans que le client l'ait dit.

## Codée dans l'usine (27 oct 2026, soir)

`layout: { architecture: 'formules-comparees' }` (`src/lib/architectures.ts`) : coquille `formules`
(`src/shells/formules.astro`), `formules` dans le schéma (`liste[]` : slug, nom, prix, `prixAutre`, rythme, pour, durée,
inclus, `reprend`, note, `conseillee`, photo ; `communs[]`, `conditions[]`), `src/lib/formules.ts` (`formulesCompletes`,
`reprise`, `inclusDeplies`, `lignesComparees`, `lienFormules`, `formuleDe`), `src/pages/formules/[...index].astro` (tableau
« Compris » / « Non », jamais de coches) et `[slug].astro` (la formule, puis la demande `id="demande"` avec la formule déjà
choisie dans `ContactForm`, prop `formule`), « Vous hésitez entre deux formules ? » en fin d'accueil (`id="contact"`, sans
script la cible des liens Contact), `wording.formules`, `wording.disponibilite`, mesure `formules`, pied `minimal`, tiroir
de contact. Restent : les formules par séance (une famille de formules par service, comme les pages de Micka).

Preuve : site jetable (photographe d'essai, trois formules dont deux qui reprennent la précédente, deux communs, deux
conditions, un texte long et deux questions d'essai ; copie de `_exemple`, sans photo, supprimé), `ff verifier` vert hors
téléphone de test, `ff ressemblance` 0,59 / 0,49 / 0,64. Note : la direction `huile` échoue au contraste sur le pied
`big-name` et le bandeau CTA des pages de service (texte `text-on-ink/70`), défaut antérieur à cette architecture, vu
pendant l'essai et contourné en prenant `nordique` pour le site jetable.
