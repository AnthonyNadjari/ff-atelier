CONSIGNES COMMUNES (pistes B et C de la Fromagerie Ravanel, démo fictive)

Repo : C:\Users\nadja\ff-atelier (Astro multi-site). Lis D'ABORD, en entier : CLAUDE.md, docs/GOUT.md (charte de goût
des fondateurs, impérative, en particulier § 2 signes IA interdits et § 4 « un site doit être vivant »),
.claude/skills/site-final/SKILL.md (la méthode que tu appliques), docs/ANIMATIONS.md (le moteur d'animation :
data-split="lines", data-reveal, data-stagger, data-scrub, data-parallax, data-pin, data-horizontal, data-counter,
data-draw…), docs/veille/demontages/INDEX.md (gestes de sites réels à transposer), et le brief
sites/fromagerie-ravanel/brief.md (SEULE source des faits : rien d'inventé, aucun chiffre, nom, date, avis absent
du brief ; les conseils généraux du métier sont permis).

Piste A existe déjà : sites/fromagerie-ravanel (en ligne sur https://fromagerie-ravanel.vercel.app). Regarde son
direction.md, son site.config.ts et ses sections pour savoir ce que tu ne dois PAS refaire : premier écran ardoise
sombre vert, direction terre, Savate + Hanken, coquille flow, bande horizontale des âges du beaufort. Le fondateur
trouve le site « assez monotone » et veut des essais COMPLÈTEMENT différents : autre squelette, autre direction,
autre typographie, autre rythme, autre geste signature. Deux pistes qui se ressemblent sont un échec.

Ton dossier est déjà prêt (brief, CREDITS.md, images.json, public/images avec cave/beaufort/raclette, favicon).
Écris : sites/<slug>/site.config.ts (en-tête « // DEMO : … », `legal: { owner: 'Claire Ravanel', demo: true }`,
pas d'e-mail, `form: { provider: 'none' }`, mêmes coordonnées fictives que la piste A), sites/<slug>/direction.md
(copie de .claude/skills/site-final/direction-modele.md, remplie, avec une section « Différence avec les pistes A
et l'autre piste »), et tes sections sur mesure dans sites/<slug>/sections/. Tokens uniquement (pas de couleur en
dur dans une section sauf via les tokens de la direction), aucune police de la liste IA, pas de pilule, pas de
numérotation 01/02/03, pas d'italique, pas de tiret cadratin ni de point médian, pas de grain/halo.

Contraintes machine (IMPORTANT) : PC à 2 Go de RAM libre, un autre agent construit en même temps. Avant CHAQUE
`node scripts/ff.mjs build|verifier|audit-motion|captures|planche` : attends que le fichier
C:\Users\nadja\ff-atelier\.ff-tmp\build.lock n'existe pas (vérifie toutes les 10 s), puis crée-le, lance la
commande, et supprime-le juste après (même en cas d'échec). Ne touche à RIEN hors de sites/<slug>/ (pas de src/,
pas de scripts/, pas des autres sites). Pas de commit, pas de déploiement.

Boucle de qualité (version courte de /site-final) : build, `node scripts/ff.mjs verifier <slug> --sans-build`
(bloquants verts ; avertissements « données de test » attendus), `ff ia <slug>`, `ff audit-motion <slug>`,
`ff planche <slug>`, puis REGARDE les deux planches (outil Read) et corrige ce qui se voit. Puis filme le
mouvement : copie scripts/outils/film-fromagerie.mjs en .ff-tmp/film-<slug>.mjs, adapte le dossier dist, la
sortie (captures/planches/<slug>-film.jpg) et les sélecteurs à TON geste signature, lance-le, regarde. Deux tours
au moins. Mesure (petit script playwright) toute correction de mise en page avant de la dire faite : une classe
Tailwind est battue par un <style> de section.

Compte rendu final, 20 lignes max : l'idée en deux phrases, le squelette, direction + polices, le geste
signature, ce qui bouge (4 moments de GOUT § 4), ce que tu as vu sur les planches et corrigé, ce qui reste faible.
