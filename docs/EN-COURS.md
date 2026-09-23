# En cours — reprise après la coupure du 22 septembre 2026

Six chantiers ont été lancés en parallèle pour supprimer ce qui fait « généré ». Tous ont été coupés
par la limite de session, chacun en pleine phase 2. Le travail fait est commité (`e364f2e`), vérifié :
30 sites construits, `npm test` 525/525. **Ce fichier dit ce qu'il reste à faire, agent par agent.**
Supprimer ce fichier quand les six lignes sont barrées.

La veille de chaque chantier est terminée et utilisable telle quelle — c'est la partie la plus chère,
elle est acquise. Ne la refaites pas : lisez-la.

| # | Chantier | Veille | Ce qui reste | Fichiers |
|---|---|---|---|---|
| 1 | **Écriture française** | `docs/veille/ecriture.md` ✓ | Les 10 règles SONT en place (`docs/REDACTION.md` §14 et §15, contrôle de rythme dans le vérificateur). Textes réécrits sur forge-delacroix, maison-roux, dubois-plomberie, lemaire-avocats, barbier-kessler : relire, et étendre aux 15 autres démos. | `sites/*/site.config.ts`, `docs/REDACTION.md`, `scripts/ff/verifier.mjs` |
| 2 | **Typographie** | `docs/veille/typographie.md` ✓ | `ff typo` existe (`scripts/ff/typo.mjs`, testé) mais **n'a jamais été passé sur les sites** : lancer `ff typo <slug> --corriger` sur les 21 sites une fois les textes stabilisés (chantier 1 d'abord, sinon on corrige des phrases qui vont changer). Vérifier que le bloc « Composition » de `global.css` est bien en place. | `src/styles/global.css`, `scripts/ff/typo.mjs` |
| 3 | **Plancher de soin** | `docs/veille/plancher-de-soin.md` ✗ (non écrit) | `src/styles/craft.css` est en place et importé. L'agent signalait deux finitions : hauteur minimale de 24 px sur les liens de nav et de pied de page quelle que soit la taille du pointeur. Écrire la veille manquante ou s'en passer. Vérifier au clavier et en impression. | `src/styles/craft.css`, `src/components/*` |
| 4 | **Couleur** | `docs/veille/couleur.md` ✓ | `ff couleur` existe (`scripts/ff/couleur.mjs`). Les 6 directions à retoucher ne l'ont pas été (l'agent s'était arrêté à `brut`). Ne jamais toucher `eclipse` ni `luxe` : validées par le fondateur. | `src/directions/*/index.css` |
| 5 | **Site F&F** | `sites/finck-fisch/ETALON.md` ✓ | Refonte commencée : `Chantier.astro` et `Propositions.astro` créés, `Methode.astro` supprimée, hero/nav/offre/réalisations modifiés. **Le site construit et passe les tests**, mais la passe n'est pas finie — relire l'étalon et terminer. | `sites/finck-fisch/**` |
| 6 | **Premiers écrans** | `docs/veille/premiers-ecrans.md` ✓ | 11 des 12 premiers écrans retouchés. Vérifier chacun (`detect`, `audit-motion`, `captures`), finir le douzième, et confirmer qu'aucun ne se ressemble (`ff signatures`). | `sites/*/sections/Hero.astro` |

## Règles de reprise

- **Un agent à la fois sur un même dossier.** Les collisions de la première passe ont été évitées de
  justesse : les périmètres sont dans le tableau ci-dessus, s'y tenir.
- **Chantier 1 avant chantier 2.** Corriger la typographie de textes qui vont être réécrits est du
  travail perdu.
- **Mémoire de la machine.** Il restait 756 Mo libres sur 16 Go pendant la première passe (Chrome du
  fondateur, 29 processus) : les compilations se font tuer sans message. Un build à la fois, et
  relancer une fois après 60 s si un build meurt en silence.
- **Commiter après chaque agent**, pas à la fin : c'est ce qui a sauvé cette passe.
