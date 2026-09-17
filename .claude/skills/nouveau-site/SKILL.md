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

### 2. Laisser le sélecteur proposer, puis lire ce qui existe

```
node scripts/ff.mjs variete
node scripts/ff.mjs composer <slug> --metier "<métier>"
```

`variete` liste les combinaisons déjà utilisées. `composer` (le sélecteur) lit tous les sites livrés et
propose la combinaison la plus éloignée de tous, adaptée au métier : direction, coquille (`shell`),
hero, variantes, typographie, échelle, tone, séparateur, en-têtes. **C'est le point de départ, pas une
suggestion facultative.** On s'en écarte seulement avec une raison venue du brief (le client déteste le
noir, veut ressembler à tel site...), et on note cette raison dans le résumé final.

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

Source de référence complète : `docs/REDACTION.md` (règles opérationnelles) — s'appuie sur
`docs/veille/redaction-images.md` §1 (sources, nuances légales, avertissements de vérification). Lis-le
avant de rédiger si ce n'est pas déjà fait cette session. Tout en français, dans le registre de l'artisan
qui s'adresse à son client :

- **Vouvoiement toujours, tutoiement jamais** dans les textes du site (le tutoiement est réservé aux
  documents internes comme ce SKILL.md ou `docs/BRIEF.md`, adressés à la vendeuse/au vendeur).
- **Vérification mentale des mots interdits** (`docs/REDACTION.md` §1) avant d'écrire chaque champ de
  texte : aucun superlatif absolu sans preuve chiffrée du brief ("le meilleur", "leader", "n°1"/"numéro
  1", "incontournable", "la référence", "unique en France", "révolutionnaire", "le plus"), aucune
  garantie de résultat ("garanti", "garantie de résultat", "satisfaction garantie", "100 % satisfait"),
  aucun des clichés déjà bannis ("votre satisfaction est notre priorité", "des professionnels à votre
  écoute", "la qualité au meilleur prix", "depuis toujours"/"artisan passionné" sans fait derrière).
  `ff verifier` recontrôle une partie de cette liste automatiquement (bloc « Textes ») mais ne remplace
  pas cette relecture — il n'attrape ni le ton ni les nuances des professions réglementées.
- **Ton par métier** (`docs/REDACTION.md` §4) : choisis le registre — urgence (direct, rassurant, aucune
  formule fleurie), rendez-vous (chaleureux, projette la première visite), commerce/achat réfléchi
  (sensoriel, concret, donne envie), ou profession réglementée (sobre, informatif, jamais promotionnel)
  — et tiens-le sur tout le site, pas seulement le hero.
- **Professions réglementées** (avocat, masseur-kinésithérapeute, vétérinaire, ostéopathe —
  `docs/REDACTION.md` §3) : jamais de comparaison avec un confrère, jamais de promesse de résultat,
  jamais "spécialiste" sans le titre officiel qui le justifie, jamais un témoignage présenté comme preuve
  de résultat individuel. Pour un ostéopathe (pas d'ordre professionnel mais titre protégé) : aucun
  vocabulaire usurpant un titre médical, aucune promesse de guérison.
- **Test du titre de hero** (`docs/REDACTION.md` §5, Julian Shapiro) : si le visiteur ne lit *que*
  `business.tagline`, comprend-il exactement ce que vend l'entreprise ? 6-12 mots, compréhensible seul,
  **un seul** `<em>` autour du mot à accentuer (voir `sites/_exemple/site.config.ts`), pas plus. Préfère
  un bénéfice concret et spécifique à une formule vague — voir les quatre formules réutilisables et les
  60 phrases d'accroche par métier en `docs/REDACTION.md` §5/§10 (à adapter aux données réelles du
  client, jamais à copier telles quelles).
- Phrases concrètes et locales (ville, matière, geste du métier) plutôt que des formules marketing
  génériques — vocabulaire du lexique métier (`docs/REDACTION.md` §9) plutôt que du jargon d'agence.
- `business.description`, `about.story`, `services[].description`, `faq[].a` : paragraphes séparés par
  une ligne vide (le champ `md` du schéma), jamais un pavé unique — longueurs cibles en
  `docs/REDACTION.md` §6.
- Ne jamais inventer un chiffre, un avis, une note, un nombre d'années, un nombre de clients. Si le
  brief ne le donne pas, le champ correspondant reste absent du fichier — ne mets pas de valeur
  plausible à sa place.
- `proof.google` : absent si le brief n'a pas de note ET de nombre d'avis Google exacts. `proof
  .testimonials` : uniquement les avis du brief, texte recopié tel quel (ne pas le réécrire), avec
  leur `source` obligatoire. Zéro avis dans le brief → tableau vide et tu le signales dans le résumé
  final (voir étape 7).
- Avant de livrer, relis la checklist « textes livrables » de `docs/REDACTION.md` §11 (20 points).

### 5. Champs image et photos

Avant de renseigner un champ `img` (`hero`, `logo`, `portrait`, `gallery`, `beforeAfter`, photos de
`team`...), vérifie que le fichier existe réellement dans `sites/<slug>/public/images/`. S'il n'existe
pas encore, laisse le champ `image`/`portrait`/`logo` absent (`undefined`), ne mets pas de chemin vers
un fichier qui n'existe pas — la section correspondante s'adapte sans image. Note dans le résumé final
quelles photos manquent encore.

**Photos** — si le client n'a pas encore de photos utilisables (cas fréquent, cf.
`docs/veille/redaction-images.md` §2) :

- Colle dans le résumé final (étape 9) la liste des 8 photos à faire au smartphone pour le métier du
  client, prise telle quelle dans `docs/veille/redaction-images.md` §2a (tableau « Shot list par
  métier ») — cadrage, lumière, heure pour chacune. C'est ce que la vendeuse/le vendeur envoie au client
  avant le rendez-vous photo.
- **Règle IA stricte** : une image générée par IA est **interdite** sur les champs `portrait`, `team`,
  `gallery` et `beforeAfter` — ces champs restent absents tant que le client n'a pas fourni de vraies
  photos, jamais comblés par une génération IA (risque de pratique commerciale trompeuse et obligation de
  marquage deepfake de l'AI Act art. 50, détaillés en `docs/veille/redaction-images.md` §2.3). L'IA reste
  acceptable uniquement pour des fonds/textures abstraits non figuratifs qui ne prétendent représenter ni
  le client, ni son équipe, ni ses réalisations.
- Une fois les photos reçues dans `sites/<slug>/raw/`, `ff nettoyer-photos <slug>` (redressement, recadrage
  focal, balance des blancs, duotone optionnel) peut préparer le lot avant `ff images <slug>` — voir
  `CLAUDE.md`.

### 6. Écrire le fichier

Crée (ou remplace) `sites/<slug>/site.config.ts` sur le modèle de `sites/_exemple/site.config.ts` :
`import { defineSite } from '@/lib/schema';` puis `export default defineSite({ slug: '<slug>', ... })`.
Respecte exactement les noms de variantes de `VARIANTS` (une faute de frappe fait échouer
`defineSite`).

### 7. Écrire le bloc sur mesure (obligatoire)

Chaque site livré contient **au moins une section écrite de zéro pour ce client**, qui n'existe dans
aucune bibliothèque et ne sera jamais réutilisée : c'est ce qui rend deux sites impossibles à
confondre. Procédure :

1. Trouve dans le brief l'élément le plus singulier du client : sa carte de menu, sa méthode en trois
   temps, son histoire de famille en dates, sa grille de tarifs, ses zones dessinées, ses garanties,
   son matériel, son équipe. Si rien ne ressort, choisis l'angle du métier : un plombier a un « que
   faire en attendant » pour une fuite, un coiffeur a un rituel, un paysagiste a un calendrier des
   saisons.
2. Écris `sites/<slug>/sections/<Nom>.astro` (PascalCase) selon `docs/CONVENTIONS.md` § Sections sur
   mesure : `import { site } from '@/lib/site'`, tokens uniquement, `id` = nom en minuscules,
   `data-reveal`/`data-stagger`, mobile d'abord, aucune donnée inventée (les faits viennent du brief ;
   un conseil générique est permis, un chiffre inventé non). Composition libre : ce bloc doit avoir
   sa propre disposition, pas « eyebrow + titre + grille » comme les autres.
3. Référence-le dans `layout.sections` à l'endroit le plus fort (souvent après le hero ou après les
   services) : `{ type: 'custom', variant: '<nom>', label: '<Libellé nav>' }`.
4. Vérifie `wording.devis` au passage : jamais « Demander un devis » pour un commerce, un restaurant
   ou un salon (voir `docs/DIRECTIONS.md` § Libellés).

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
