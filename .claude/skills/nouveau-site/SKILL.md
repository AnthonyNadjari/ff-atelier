---
name: nouveau-site
description: Génère sites/<slug>/site.config.ts depuis un brief, choisit direction et variantes, rédige les textes
---

# nouveau-site

Génère le `site.config.ts` d'un client à partir d'un brief rempli (`docs/BRIEF.md` copié en
`sites/<slug>/brief.md`, ou un brief collé directement dans la conversation). Rédige tous les textes
en français, choisit la direction visuelle et les variantes, construit le fichier, puis vérifie qu'il
build.

Utilisation : `/nouveau-site <slug>` ou "génère le site pour <slug>".

## Étapes

### 1. Lire les sources de vérité

Dans l'ordre :

1. `sites/<slug>/brief.md` (ou le brief collé dans le message de l'utilisateur s'il n'y a pas de
   fichier). Si aucun brief n'est trouvé nulle part, arrête-toi et demande-le.
2. `src/lib/schema.ts` — le schéma complet (`DIRECTIONS`, `MOTION`, `VARIANTS`, `siteSchema`, chaque
   `.describe()`). C'est la seule liste de champs valide.
3. `docs/DIRECTIONS.md` — guide de choix de direction et de variantes.
4. `docs/CONVENTIONS.md` — règles générales du projet (pas de donnée inventée, tokens uniquement,
   etc. — surtout pertinent si tu dois aussi toucher une section, ce qui ne devrait pas arriver ici).
5. `sites/_exemple/site.config.ts` — référence de style et de structure d'un `site.config.ts` complet.

### 2. Voir ce qui existe déjà

```
node scripts/ff.mjs variete
```

Liste les combinaisons direction/variantes déjà utilisées par les sites existants dans `sites/`. Sert
à appliquer la règle de variété de `docs/DIRECTIONS.md` : ne jamais reprendre la même direction ET le
même hero pour un client du même métier ou de la même ville qu'un site existant.

### 3. Choisir direction, motion et variantes

En croisant le brief (section 12 : 3 adjectifs, métier, sites aimés/pas aimés) et
`docs/DIRECTIONS.md` :

- **Direction** : celle dont les "métiers typiques" et l'ambiance collent le mieux au métier et aux
  adjectifs du client, en excluant toute direction dont la liste "à éviter" contredit le brief (ex. un
  client qui veut de l'urgence 24/7 exclut `luxe`, `terre`, `journal`, `clair`). En cas d'égalité,
  départage avec `ff variete` pour maximiser la différence avec les sites existants.
- **Motion** : `motionParDefaut` de la direction choisie (`src/directions/<direction>/meta.ts`), sauf
  raison contraire du brief.
- **Typographie, échelle, tone, séparateur** : des choix explicites, pas seulement les défauts de la
  direction — voir `docs/DIRECTIONS.md` §§ Polices, Échelle, Tone et séparateurs. À faire varier d'un
  client à l'autre, surtout dans la même direction :
  - `typography` (`typography.display` / `typography.body`) : une surcharge de police, seulement si elle
    a un sens pour le client, et qui ne reprend **jamais** la paire par défaut de la direction (10
    suggestions dans `docs/DIRECTIONS.md`).
  - `scale` (`compact` / `normal` / `display`) : `compact` si beaucoup de contenu, `display` si peu de
    sections et un message fort porté par la typographie, `normal` sinon.
  - `layout.divider` (`none` / `wave` / `diagonal` / `curve` / `rule` / `zigzag`) : choisi selon la
    direction (tableau dans `docs/DIRECTIONS.md`), pas laissé à `none` par défaut sans y penser.
  - `layout.tone` (`flat` / `alternate`) : `alternate` si plusieurs sections voisines partagent le même
    fond et se confondent visuellement.
- **Nav / hero / footer** : choisis dans `VARIANTS` selon `docs/DIRECTIONS.md`, en tenant compte des
  données réellement disponibles (ex. `hero: video` seulement si une vidéo existe, `hero: fullbleed`
  seulement si une photo forte existe).
- **Sections et leur ordre** : n'inclure une section que si le brief a la donnée correspondante.
  Checklist :
  - `services` — toujours (le schéma exige au moins un service).
  - `about` — toujours si `about.story` est rempli (quasi toujours).
  - `proof` — seulement si Google (note+avis) OU témoignages OU galerie OU avant/après OU logos sont
    fournis. Pas de proof si le brief n'a rien de tout ça.
  - `zones` — seulement si des villes sont listées.
  - `process` — seulement si le brief décrit des étapes de travail.
  - `faq` — seulement si le brief a des questions/réponses.
  - `cta` — presque toujours (bandeau avant contact), sauf site très court.
  - `contact` — toujours.
  - Variante de chaque section : voir le tableau correspondant dans `docs/DIRECTIONS.md`.
- **`seo.cityPages`** : passe-le à `true` seulement si `zones.cities` a au moins 4 vraies villes ET que
  le site a au moins 4 vrais services (sinon les pages `/zones/<ville>` générées seraient du contenu
  pauvre — voir `docs/DIRECTIONS.md` § Pages villes). Sinon laisse le défaut (`false`).

### 4. Rédiger les textes

Tout en français, dans le registre de l'artisan qui s'adresse à son client :

- **Vouvoiement toujours, tutoiement jamais** dans les textes du site (le tutoiement est réservé aux
  documents internes comme ce SKILL.md ou `docs/BRIEF.md`, adressés à la vendeuse/au vendeur).
- Phrases concrètes et locales (ville, matière, geste du métier) plutôt que des formules marketing
  génériques. Bannis "votre satisfaction est notre priorité", "des professionnels à votre écoute", "la
  qualité au meilleur prix" et toute variante de ces clichés.
- `business.tagline` peut contenir **un seul** `<em>` autour du mot à accentuer (voir
  `sites/_exemple/site.config.ts`), pas plus.
- `business.description`, `about.story`, `services[].description`, `faq[].a` : paragraphes séparés par
  une ligne vide (le champ `md` du schéma), jamais un pavé unique.
- Ne jamais inventer un chiffre, un avis, une note, un nombre d'années, un nombre de clients. Si le
  brief ne le donne pas, le champ correspondant reste absent du fichier — ne mets pas de valeur
  plausible à sa place.
- `proof.google` : absent si le brief n'a pas de note ET de nombre d'avis Google exacts. `proof
  .testimonials` : uniquement les avis du brief, texte recopié tel quel (ne pas le réécrire), avec
  leur `source` obligatoire. Zéro avis dans le brief → tableau vide et tu le signales dans le résumé
  final (voir étape 7).

### 5. Champs image

Avant de renseigner un champ `img` (`hero`, `logo`, `portrait`, `gallery`, `beforeAfter`, photos de
`team`...), vérifie que le fichier existe réellement dans `sites/<slug>/public/images/`. S'il n'existe
pas encore, laisse le champ `image`/`portrait`/`logo` absent (`undefined`), ne mets pas de chemin vers
un fichier qui n'existe pas — la section correspondante s'adapte sans image. Note dans le résumé final
quelles photos manquent encore.

### 6. Écrire le fichier

Crée (ou remplace) `sites/<slug>/site.config.ts` sur le modèle de `sites/_exemple/site.config.ts` :
`import { defineSite } from '@/lib/schema';` puis `export default defineSite({ slug: '<slug>', ... })`.
Respecte exactement les noms de variantes de `VARIANTS` (une faute de frappe fait échouer
`defineSite`).

### 7. Comparer avec la proposition automatique

```
node scripts/ff.mjs composer <slug>
```

Génère un look proposé automatiquement (direction, variantes, typographie...) à partir du
`site.config.ts` qui vient d'être écrit, dans `sites/<slug>/look.json` — sans toucher au fichier. Compare
ce que `composer` propose à ce qui a été choisi à l'étape 3 : si `composer` suggère mieux (direction plus
adaptée, séparateur/tone plus cohérent) sans contredire une contrainte du brief, reprends ce choix
directement dans `site.config.ts` ; sinon garde le choix fait à l'étape 3 et supprime `look.json` (ne
pas laisser un `look.json` qui traîne sans raison — `ff figer <slug>` le fusionnerait sinon).

Profite de cette relecture pour vérifier `wording.devis` : jamais "Demander un devis" pour un commerce,
un restaurant ou un salon (boulangerie, coiffeur, institut, café...) — voir la table par métier dans
`docs/DIRECTIONS.md` § Libellés — et l'ajuster dans `site.config.ts` si le défaut ne convient pas.

### 8. Builder et vérifier

```
node scripts/ff.mjs build <slug>
node scripts/ff.mjs verifier <slug>
```

Si une commande échoue : lis l'erreur, corrige `site.config.ts` (typo de variante, champ requis
manquant, zod qui rejette une valeur...), relance. Répète jusqu'à ce que build et vérifier soient
verts. Ne t'arrête pas sur un échec silencieux — un site qui ne build pas n'est pas livrable.

### 9. Résumer pour la vendeuse/le vendeur

Termine par un résumé court, en français, tutoiement :

- Direction, motion, nav/hero/footer choisis, et pourquoi en une phrase.
- Sections incluses et celles volontairement omises (et pourquoi — donnée manquante).
- Ce qui a été laissé vide faute de donnée (avis, note Google, photos, prix...).
- Liste précise de ce que la vendeuse/le vendeur doit encore obtenir du client avant la mise en ligne
  (photos manquantes, avis à récupérer, SIRET, assurance décennale...).
