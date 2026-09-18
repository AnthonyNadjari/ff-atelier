# Structure des 20 sites démo — relevé factuel

> Réponse à « faut rendre les templates un peu moins template ». Relevé de `layout.sections`
> (types et variantes, dans l'ordre) et du nombre de blocs `custom/` pour chacun des 20 sites de
> `sites/finck-fisch/vitrine.json`. Le hero et la nav (souvent `custom/hero`, `custom/nav`) ne sont
> **pas** comptés dans « blocs custom » ci-dessous : seuls les blocs `{ type: 'custom', ... }` de
> `layout.sections` sont comptés, parce que c'est le corps de page qui donne la sensation de
> template, pas le hero (presque toujours sur mesure sur les 20 sites).

## Tableau

| Slug | Métier | Suite `layout.sections` (dans l'ordre) | Blocs `custom/` |
|---|---|---|---|
| osteo-marchand | Ostéopathe D.O. | custom(motifs) → custom(seance) → about/story → faq/accordion → contact/form-card | **2** |
| forge-delacroix | Ferronnerie d'art | custom(geste) → custom(feu) → custom(pieces) → services/list → proof/testimonials → cta/band → contact/simple | 3 |
| encre-noire | Studio de tatouage | custom(styles) → custom(artistes) → custom(rendezvous) → faq/two-columns → contact/simple | 3 |
| chez-malo | Restaurant | custom(carte) → custom(lelieu) → custom(horaires) → cta/band → contact/simple | 3 |
| toits-cie | Couvreur-zingueur | custom(chantiers) → custom(methode) → custom(garanties) → cta/band → contact/form-split | 3 |
| anna-vidal | Photographe mariage/famille | custom(series) → custom(manifeste) → custom(formules) → faq/accordion → contact/form-card | 3 |
| moteur-fils | Garage indépendant | custom(augarage) → custom(avantapres) → custom(rendezvous) → faq/accordion → contact/simple | 3 |
| dubois-plomberie | Plombier-chauffagiste | services/grid → custom(Diagnostic) → custom(Urgence) → custom(Tarifs) → about/story → zones/chips → faq/accordion → contact/form-split | 3 |
| auto-ecole-rabelais | Auto-école | services/grid → custom(Parcours) → custom(Forfaits) → custom(Financement) → about/story → faq/accordion → cta/band → contact/form-split | 3 |
| barbier-kessler | Barbier | custom(tarifs) → custom(equipe) → custom(galerie) → custom(infos) → faq/accordion → cta/band → contact/form-card | 4 |
| jardins-mael | Paysagiste | custom(Services) → custom(Saisons) → custom(Calendrier) → about/story → zones/chips → custom(Cta) → contact/form-split | 4 |
| maison-roux | Boulangerie-pâtisserie | custom(Fournee) → custom(Carte) → about/story → custom(CommanderGateau) → faq/accordion → cta/band → custom(Contact) | 4 |
| studio-ambre | Architecte d'intérieur | custom(casestudy) → about/values → custom(materiaux) → custom(methode) → zones/list → faq/two-columns → cta/card → custom(contact) | 4 |
| ampere-fils | Électricien | custom(TableauElectrique) → custom(BorneRecharge) → about/story → custom(Normes) → zones/chips → faq/accordion → custom(Contact) | 4 |
| veto-du-drac | Vétérinaire | services/list → custom(Urgence) → custom(Equipe) → custom(PreparerVisite) → zones/chips → faq/accordion → cta/band → custom(Contact) | 4 |
| cantine-roulante | Food truck / traiteur | custom(Semaine) → custom(Carte) → custom(Traiteur) → custom(Remorque) → zones/chips → faq/accordion → cta/band → contact/form-split | 4 |
| lemaire-avocats | Avocat | custom(Domaines) → custom(Consultation) → custom(Honoraires) → custom(Avocates) → zones/chips → faq/accordion → cta/card → custom(Contact) | 5 |
| atelier-lecerf | Menuisier-ébéniste | custom(Fabrication) → custom(Matieres) → custom(Restauration) → custom(Estimation) → custom(Contact) | 5 |
| maison-aurore | Institut de beauté/spa | custom(Rituels) → custom(CarteDesSoins) → custom(Espace) → custom(Offrir) → custom(Contact) | 5 |
| borie-des-chenes | Chambres d'hôtes | custom(Chambres) → custom(Table) → custom(Hotes) → custom(Autour) → custom(Disponibilites) → custom(Reservation) | **6** |

## Ce qui revient à l'identique (ou presque)

Trois familles de fin de séquence se répètent presque mot pour mot d'un site à l'autre — c'est ça,
la sensation de template, indépendamment des couleurs :

1. **« 2-3 blocs custom → faq/accordion → contact/(form-card|simple) », sans zones ni cta** :
   `osteo-marchand`, `anna-vidal`, `moteur-fils` — même charpente à trois maillons près, alors que
   ce sont un ostéopathe, une photographe et un garage.
2. **« 3 blocs custom → cta/band → contact », sans faq** : `forge-delacroix`, `chez-malo`,
   `toits-cie` — même fin à deux variantes de contact près.
3. **« services → [3 blocs custom] → about/story → zones/chips → faq/accordion → contact »** :
   `dubois-plomberie` et `auto-ecole-rabelais` reproduisent presque au mot près l'ordre d'agence
   générique cité par le fondateur (« hero, services, à-propos, preuve, zones, FAQ, contact ») —
   les blocs custom remplacent juste « preuve » au milieu, sans casser l'ordre autour.

## Variantes partagées utilisées par plus de 6 sites

| Variante | Sites (compte) |
|---|---|
| `faq/accordion` | osteo-marchand, anna-vidal, moteur-fils, dubois-plomberie, barbier-kessler, ampere-fils, lemaire-avocats, veto-du-drac, cantine-roulante, auto-ecole-rabelais — **10 sites** |
| `cta/band` | forge-delacroix, chez-malo, toits-cie, barbier-kessler, maison-roux, veto-du-drac, cantine-roulante, auto-ecole-rabelais — **8 sites** |

Aucune autre variante partagée ne dépasse 6 sites (`about/story` et `zones/chips` arrivent
juste à 6). `faq/accordion` et `cta/band` à eux seuls referment la moitié des 20 sites de la même
façon.

## Sites corrigés (voir rapport)

`osteo-marchand`, `anna-vidal`, `moteur-fils`, `chez-malo`, `toits-cie`, `dubois-plomberie` — les 6
avec le moins de blocs sur mesure (2 ou 3) et la suite de sections la plus commune (familles 1, 2 et
3 ci-dessus). `forge-delacroix` (3 blocs custom) n'est pas touché : c'est la référence citée par le
fondateur pour le bloc « Geste ».
