# Objectif de l'atelier

À partir d'un brief de 15 minutes, produire en moins de deux heures un site unique, vérifié, mis en ligne,
que le client possède, et que personne ne peut confondre avec un autre site de l'atelier ; avec une
bibliothèque et des tests qui grandissent à chaque site.

Ce fichier est la mémoire de la boucle autonome. Chaque tour met à jour l'état ci-dessous.
Ne jamais cocher un critère sans l'avoir vérifié par une commande ou une capture.

## Critères de « fini »

| # | Critère | État | Vérification |
|---|---|---|---|
| 1 | 20 sites de démonstration dessinés à la main, 20 métiers, chacun avec hero + nav + ≥ 2 blocs sur mesure, aucun bloc copié d'un site à l'autre | 7 / 20 | `ls sites/*/sections/` ; comparaison manuelle des compositions |
| 2 | Chaque site : build ✓, `ff verifier` ✓ (sauf téléphone fictif), captures sans erreur ni débordement, mobile relu, Lighthouse ≥ 90 (perf, a11y, SEO) | build/captures ✓ ; Lighthouse : outil à ajouter (`ff lighthouse`) | `ff tous`, `ff captures`, `ff lighthouse` |
| 3 | Moteur d'animation : ≥ 15 effets documentés, chacun utilisé dans ≥ 2 sites, sans bug connu | 16 effets ; usage ×2 à vérifier ; 3 bugs corrigés le 16 sept | `grep -l data-<effet> sites/*/sections/*.astro` |
| 4 | Chaîne de bout en bout sur un vrai brief : formulaire → `/nouveau-site` → `ff propositions` → `ff deploy` → `ff exporter` | non prouvée (deploy nécessite `npx wrangler login`, action humaine) | exécuter la chaîne sur un slug de test |
| 5 | Tests + CI verts à chaque commit ; matrice couvrant directions, coquilles, navs | tests 142 ✓ ; CI : à vérifier sur GitHub ; matrice : directions ✓, coquilles ✓, navs ✗ | `npm test`, `ff matrice --rapide`, onglet Actions |
| 6 | Docs à jour : PROCESS, compétences, CONVENTIONS, chaque motif documenté le jour où il naît | à relire après chaque tour | relecture |
| 7 | Premier site client réel livré et payé | action humaine | — |
| 8 | Veille intégrée (`docs/veille/SYNTHESE.md`) : actions B1-B6 (livrable conforme : verifier étendu, schemaType par métier, page confidentialité, carte sans cookie, provider cloudflare, lighthouse) | 0 / 6 | `ff verifier` sur un site |
| 9 | Matière première : `ff photos`, `ff video`, `ff illustration`, +30 polices (C1-C4) | 0 / 4 | commandes existantes et testées |
| 10 | Moteur : les 25 effets de `animations.md` § 3 ajoutés à `motion.ts` avec repli reduced-motion et tests (D1-D3) | 0 / 25 | `grep data-<effet>`, `npm test` |
| 11 | Réserve de compositions : chaque site dessiné introduit un motif de `tendances.md` § 4-5 ou `composants.md` § 3 non encore utilisé (E1) ; procédure de portage dans `/nouvelle-variante` (E2) | E2 à faire | relecture |
| 12 | Offre et discours (A1-A4) : grille de prix, garantie de délai, page finck-fisch avec objections | action humaine pour les prix ; textes par Claude | — |

## Métiers couverts (sites dessinés à la main)

1. Ferronnerie d'art — `forge-delacroix` (Toulouse)
2. Ostéopathe — `osteo-marchand` (Annecy)
3. Tatoueur — `encre-noire` (Lille)
4. Restaurant — `chez-malo` (Marseille)
5. Couvreur — `toits-cie` (Rouen)
6. Photographe de mariage — `anna-vidal` (Bordeaux)
7. Garage — `moteur-fils` (Nancy)

## Métiers à couvrir (un par tour, dans cet ordre, ville différente à chaque fois)

8. Plombier-chauffagiste (urgence) — Nantes
9. Salon de coiffure / barbier — Strasbourg
10. Paysagiste — Rennes
11. Architecte d'intérieur — Paris
12. Boulangerie-pâtisserie — Lyon
13. Électricien / domotique — Villeurbanne
14. Cabinet d'avocat — Montpellier
15. Vétérinaire — Grenoble
16. Menuisier-ébéniste — Roubaix
17. Institut de beauté / spa — Nice
18. Food truck / traiteur — Bayonne
19. Auto-école — Tours
20. Chambres d'hôtes — Dordogne
21. Coach sportif / studio de yoga — Lille
22. Serrurier (urgence) — Marseille
23. Fleuriste — Bordeaux
24. Maçon / rénovation — Metz
25. Dentiste — Reims
26. Brasserie artisanale — Clermont-Ferrand
27. Agence immobilière de quartier — Toulon

Règle : les démos existantes `demo-*` (générées, non dessinées) ne comptent pas pour le critère 1.
Elles restent comme exemples du mode « permutation ».

## Ordre des tours après la veille (17 sept 2026)

Tour 1 : B1 + B2 + B3 (verifier, schemaType, confidentialité). Tour 2 : D1 première moitié (13 effets).
Tour 3 : site métier 8. Tour 4 : B4 + B5 + C1. Tour 5 : D1 seconde moitié. Tour 6 : site métier 9.
Ensuite alterner : deux sites, un tour de robustesse ou d'intégration de la veille. Lire
`docs/veille/SYNTHESE.md` au début de chaque tour de robustesse.

## Procédure d'un tour

1. Lire ce fichier, `CLAUDE.md`, `docs/PROCESS.md`, `.claude/skills/nouveau-site/SKILL.md`.
2. Prendre le prochain métier. Inventer un client crédible (nom, ville, 4-6 services, horaires, histoire),
   numéros en 06 39 98 xx xx, e-mail `contact@exemple.fr`, en-tête `// DEMO : client inventé`.
3. `ff nouveau <slug>` puis `ff composer <slug> --metier "<métier>"` : partir de sa proposition.
4. Dessiner : hero sur mesure, nav sur mesure, deux blocs sur mesure minimum, composition et animations
   choisies pour ce client (voir la liste des effets dans `src/styles/global.css`). Jamais la même
   composition qu'un site existant : relire `sites/*/sections/*.astro` avant de dessiner.
5. `ff build`, `ff verifier`, `ff captures`. Regarder les deux captures avec l'outil de lecture d'image.
   Corriger. Recommencer jusqu'à propre.
6. Mettre à jour la table et la liste ci-dessus. Commit + push.
7. Un tour sur trois, à la place d'un site : robustesse. `npm test`, `ff matrice --rapide`, relire les
   bugs signalés dans les rapports précédents, extraire dans `src/sections/` tout motif sur mesure
   apparu trois fois (via `/nouvelle-variante`), ajouter les outils manquants du critère 2 et 5
   (`ff lighthouse` via playwright + lighthouse npm si absent ; matrice des navs).

## Arrêt

S'arrêter et le dire quand : les sept critères sont cochés ; ou un critère dépend d'une action humaine
(login Cloudflare, achat de domaine, vrai client) et tout le reste est fait.

## Journal

- 17 sept 2026 : veille en six dossiers (`docs/veille/`), synthèse et plan d'action A-F ; critères 8 à 12 ajoutés.
- 16 sept 2026 : fondation, 16 directions, 44 variantes, CLI, studio, 32 modèles, coquilles, moteur
  d'animation enrichi, 7 sites dessinés à la main. Critères 1 à 6 en cours, 7 non commencé.
