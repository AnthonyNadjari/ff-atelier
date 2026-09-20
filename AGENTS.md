# AGENTS.md

Instructions pour les agents IA travaillant dans ce dépôt (Kimi Code, Cursor, Claude Code,
Copilot...) : le fichier de référence est **[CLAUDE.md](CLAUDE.md)** — il fait foi pour tout
agent, quel que soit l'outil. Résumé des règles dures :

1. Un site = un fichier `sites/<slug>/site.config.ts` validé par le schéma zod (`src/lib/schema.ts`).
   Aucune donnée affichée ne vient d'ailleurs.
2. **Jamais de donnée inventée** : pas de faux avis, faux chiffres, faux horaires. Une donnée
   absente du brief laisse le champ absent ; la section s'adapte ou disparaît.
3. Tokens uniquement dans les sections et directions — jamais de couleur, police ou rayon en dur.
4. Toute variante de section est enregistrée dans `VARIANTS` (`src/lib/schema.ts`) + documentée
   dans `docs/DIRECTIONS.md`.
5. `sites/_exemple/` est la référence de schéma : ne pas modifier sauf demande explicite.
6. Avant de finir : `npm test` et `node scripts/ff.mjs verifier <slug>` doivent passer.

Commandes : `node scripts/ff.mjs aide`. Documentation : `docs/` (BRIEF, DIRECTIONS, CONVENTIONS,
PROCESS, DEPLOIEMENT).
