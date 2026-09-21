# Inventaire de nos outils de structure — relevé du 21 sept 2026

> « Je sens de la diversité, mais ça reste du full scroll down, contact en bas. » Verdict du fondateur
> après avoir parcouru cinq sites. Ce relevé (script, pas de jugement) montre pourquoi : la diversité est
> dans l'habillage (directions, polices, blocs sur mesure), pas dans le squelette de page.

## Ce qui existe

- Coquilles (`src/shells/`) : flow, magazine, sidebar, slides, split, sticky-hero — 6.
- Navs (`src/sections/Nav/`) : bar, burger, dock, floating, minimal, split — 6, plus les navs sur mesure.
- Contact (`src/sections/Contact/`) : simple, form-card, form-split, plus les contacts sur mesure — toujours une SECTION en fin de page.

## Ce qui est utilisé (21 sites : 20 démos + finck-fisch)

| Site | Coquille | Nav | Contact | Blocs custom | Effets riches |
|---|---|---|---|---|---|
| forge-delacroix | sidebar | minimal | simple | 3 | frames marquee pin text-fill  |
| osteo-marchand | flow | bar | form-card | 3 | — |
| encre-noire | flow | custom/nav | simple | 3 | horizontal hover-img  |
| chez-malo | sticky-hero | custom/nav | simple | 4 | hover-img pin text-fill  |
| toits-cie | sticky-hero | custom/nav | form-split | 4 | marquee  |
| anna-vidal | flow | custom/nav | form-card | 4 | horizontal pin text-fill  |
| moteur-fils | flow | custom/nav | simple | 4 | compare marquee  |
| dubois-plomberie | flow (défaut) | custom/nav | form-split | 4 | compare flip-card  |
| barbier-kessler | flow | custom/nav | form-card | 4 | marquee trail  |
| jardins-mael | flow | défaut | form-split | 4 | drag-grid  |
| maison-roux | flow | custom/nav | custom (section) | 4 | flip-card marquee scramble  |
| studio-ambre | magazine | custom/nav | custom (section) | 4 | drag-grid hover-img scramble  |
| ampere-fils | flow (défaut) | custom/nav | custom (section) | 4 | flip-card  |
| lemaire-avocats | flow | custom/nav | custom (section) | 5 | frames horizontal shader text-fill  |
| veto-du-drac | flow | défaut | custom (section) | 4 | drag-grid flip-card marquee shader  |
| atelier-lecerf | flow (défaut) | défaut | custom (section) | 5 | compare drag-grid horizontal marquee scramble  |
| maison-aurore | flow | défaut | custom (section) | 5 | flip-card horizontal hover-img marquee scramble  |
| cantine-roulante | flow (défaut) | custom/nav | form-split | 4 | compare marquee scramble  |
| auto-ecole-rabelais | flow (défaut) | bar | form-split | 3 | flip-card marquee  |
| borie-des-chenes | flow (défaut) | défaut | custom (section) | 6 | drag-grid horizontal pin text-fill  |
| finck-fisch | flow (défaut) | custom/nav | custom (section) | 5 | frames horizontal  |

## Lecture

- **Coquilles** : flow ou défaut sur 12 sites ; sticky-hero 2, sidebar 1, magazine 1 ; `slides` et `split` : **0 usage**. Trois modèles de page sur six sont donc inconnus des démos — et un visiteur ne distingue pas flow du défaut.
- **Contact** : 21 sites sur 21 finissent par une section contact. Aucun tiroir, aucune modale, aucune page dédiée. C'est le point commun le plus visible.
- **Bandeau défilant (`data-marquee`)** : 10 sites sur 21. Devenu notre tic, comme l'eyebrow avant lui.
- **Effets riches** : 4 à 5 par site chez les plus fournis (atelier-lecerf, maison-aurore, veto-du-drac), contre un seul chez les primés (`docs/veille/animations-2.md` § 4).
- **Navs sur mesure** : 14 sites — la nav est déjà le lieu de la diversité ; c'est la structure du corps de page qui ne suit pas.

## Conséquence

Le chantier n'est pas « plus d'animations » mais « plus de squelettes » : contact en tiroir, chapitres plein écran, écran scindé, barre latérale sommaire, multi-pages avec transitions — spécifiés dans `docs/veille/squelettes.md`, puis appliqués à trois sites pour comparer. Chaque site ne garde qu'un effet riche.
