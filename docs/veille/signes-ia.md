# Signes « fait par une IA » — ce qu'on ne met plus sur un site (6 oct 2026)

Origine : un visiteur du site du studio a dit au fondateur « ça se voit que tu l'as fait avec Claude ».
Recherche le jour même ([TeneX](https://tenex.studio/en/blog/ai-slop-ui-8-signes/),
[Inspire Studio](https://inspirestudio.app/blog/the-telltale-signs-of-ai-web-design),
[925 Studios](https://www.925studios.co/blog/ai-slop-web-design-guide),
[Poynter, sur l'écriture](https://www.poynter.org/reporting-editing/2026/ai-changing-human-writing-editors-em-dash/),
Impeccable `detect` et sa liste de polices par défaut), puis passe sur toute la factory.

Contrôle automatique : `node scripts/ff.mjs ia [slug ...]` (sur les sites construits). Tests :
`tests/ia.test.mjs`.

## Bloquant (`ff ia` échoue)

| Signe | Pourquoi | Ce qu'on fait à la place |
|---|---|---|
| Polices par défaut des IA : Cormorant, Instrument Sans/Serif, Inter, Playfair, Fraunces, Space Grotesk, DM Sans/Serif, Outfit, Plus Jakarta, Syne, Newsreader, Lora, Crimson, IBM Plex, Geist, Source Serif, Manrope | Ce sont les choix « statistiquement les plus probables » : on les reconnaît | Une police de même ambiance mais rare : Bodoni Moda, Libre Bodoni, EB Garamond, Domine, Bitter, Gelasio (titres) ; Hanken Grotesk, Karla, Public Sans, Rubik, Literata (texte) |
| Emphase des titres en italique (le gros titre en serif italique) | « Le hero universel des landing pages IA » | Emphase par la graisse ou la lumière (couleur du texte), jamais l'italique |
| Tiret cadratin « — » comme ponctuation | Le tic d'écriture n°1 des modèles | Virgule, point, deux-points, parenthèses. Le titre d'onglet utilise « | » |
| Point médian « · » comme séparateur | Même famille que le tiret cadratin | Virgule, « à » (« Plombier à Nantes »), ou de l'espace dans la mise en page |

## Alerte (`ff ia` signale)

| Signe | Ce qu'on fait |
|---|---|
| Boutons pilule partout (`--radius: 999px`) | Angles nets ou à peine adoucis (0–3 px) |
| Coches devant chaque ligne (tarif façon logiciel en ligne) | Liste en texte simple |
| Libellés en capitales espacées (`uppercase tracking-[0.2em]`) | Le libellé, s'il porte une information, s'écrit comme une phrase |

## Retirés de la factory le 6 oct 2026 (ne pas réintroduire)

- **Eyebrow** (petit surtitre en capitales au-dessus d'un titre) : `SectionHeading` ne l'affiche plus ;
  les surtitres décoratifs des sections communes sont supprimés ; ceux qui portent une information
  sont en casse normale (règle `html[data-direction] .eyebrow` dans `src/styles/global.css`).
- **Rangée de badges à icônes sous le titre** (bouclier « assuré décennale », étoile, médaille) : les
  faits restent, en texte, sans icône.
- **Numérotation décorative** « 01, 02, 03 » sur des listes qui ne sont pas une séquence.
- **Halo lumineux** (dégradé radial plein écran, halo qui suit le curseur) et **reflet** sur un logo.
- **Faux navigateur** à trois points autour d'une capture d'écran.

## Ce qu'un outil ne voit pas (à relire à la main)

- La **cadence des titres** : phrases courtes ponctuées par trois (« Trois sites. Un seul contenu. »).
  Écrire comme on parle à un client.
- Les **séries de trois** partout (trois refus, trois atouts, trois étapes) : en garder une par page.
- Une **trace humaine** que personne ne peut générer : une signature manuscrite scannée, une photo
  réelle de l'atelier, une phrase qu'on dirait au téléphone.
