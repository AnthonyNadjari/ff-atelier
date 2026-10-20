# Processus client — de la prospection à la livraison

Toutes les commandes en une page : `docs/COMMANDES.md`.

Ce document décrit le parcours complet d'un client, pour les deux personnes de Finck & Fisch :
celle qui prospecte/vend/brief, celle qui construit. `docs/BRIEF.md` est le support de l'appel ;
ce fichier est le fil du reste.

## 1. Prospection

Les outils de prospection existent déjà dans `scrapping_artisans/` (scraping Google Maps, base
SQLite, relances WhatsApp) — voir son `CLAUDE.md` pour le détail technique. On ne les duplique pas
ici : ce dépôt (`ff-atelier`) prend le relais à partir du moment où un client a dit oui à l'appel, ou
juste avant, pour préparer l'appel.

### 1bis. Refonte d'un site existant

Beaucoup d'artisans ont déjà un site, vieux ou faible : ses textes et ses photos servent de matière. Refonte d'un
site existant : `node scripts/ff.mjs refonte <url> [slug]`, puis `/site-final <slug>`. La commande lit le site sans
navigateur (robots.txt respecté, une requête toutes les 500 ms, 25 pages au plus), préremplit `sites/<slug>/brief.md`
(chaque information avec sa page, le reste en « ? à demander », les textes du site en annexe), télécharge ses photos
utiles dans `raw/` (`raw/SOURCES.md`) et écrit `redirects.json`. Garder les URL avec `redirects.json` : chaque
ancienne adresse renvoie vers la nouvelle page, sinon le client perd son référencement Google (garder dans
`site.config.ts` les slugs de services qu'il nomme). Demander au client l'accord d'utiliser ses textes et photos, qui
sont à lui (et au développeur nommé en pied de page, s'il y en a un, qui tient le site). Site en JavaScript seul
(texte vide sans navigateur) : la commande le dit ; compléter le brief à la main ou avec `ff demonter`.

## 2. Appel client (15 minutes)

Support : `docs/BRIEF.md`, dans l'ordre des sections. Trame :

1. **Introduction (30 s)** — pourquoi cet appel, où le client a été repéré (fiche Google, recommandation).
2. **Découverte (2 min)** — site actuel ? Comment trouve-t-il ses clients aujourd'hui ? Volume de
   demandes satisfaisant ?
3. **Le brief lui-même (10 min)** — parcourt `docs/BRIEF.md` section par section : identité, contact,
   zones, services, histoire, valeurs, avis réels, photos disponibles, réseaux, domaine souhaité, les
   3 adjectifs de style, sites concurrents aimés/pas aimés, délai souhaité.
4. **Clôture (2 min)** — confirme ce que le client doit encore envoyer (photos, lien Google, SIRET) et
   sous quel délai, donne la suite (production, appel de restitution, corrections).

**Règle non négociable pendant l'appel** : si le client n'a pas un chiffre, un avis ou une note sous la
main, on note "à demander" — on ne devine pas, on ne remplit pas de valeur plausible. Voir
l'avertissement légal dans `docs/BRIEF.md` (avis inventé = pratique commerciale trompeuse, art. L121-2
du Code de la consommation).

## 3. Ce que le client doit envoyer après l'appel

- Photos réelles (logo, portrait/équipe, chantiers, avant/après si pertinent) — lien Drive/Dropbox/
  WeTransfer. **Le jour même de l'appel**, envoyer le guide `studio/commercial/guide-photos.html`
  (12 photos au téléphone, consignes, envoi en « Document » sur WhatsApp). Sans photo du vrai travail,
  le site ressemble à une affiche (rodage du 13 oct 2026) : on ne livre pas un site sans au moins le
  portrait, un geste et un avant/après ; jamais de photo de banque présentée comme celle du client.
- Lien vers sa fiche Google (Maps ou Google Business).
- SIRET (et n° de TVA intracommunautaire si assujetti).
- Numéro et compagnie de l'assurance décennale, si le métier l'exige.
- Tout avis client qu'il peut retrouver et transmettre tel quel (capture, e-mail, SMS).

Tant que ces éléments ne sont pas arrivés, le site peut être produit avec les champs correspondants
vides — jamais complétés à la place du client.

## 4. Jour de production (2 heures)

1. `node scripts/ff.mjs nouveau <slug>` puis `sites/<slug>/brief.md` rempli avec les réponses de
   l'appel.
2. Photos reçues déposées dans `sites/<slug>/public/images/`, puis `node scripts/ff.mjs images <slug>`.
3. Génération de `site.config.ts` : `/nouveau-site <slug>` (Claude Code) ou
   `node scripts/ff-generer.mjs <slug>` (automatique). Voir `.claude/skills/nouveau-site/SKILL.md`
   pour le détail des choix faits (direction, variantes, textes).
4. Relecture humaine du site généré : `node scripts/ff.mjs dev <slug>`. On relit chaque texte comme un
   client le lirait — un ton trop générique ou une phrase qui sonne faux se corrige à la main dans
   `site.config.ts`.
5. `node scripts/ff.mjs verifier <slug>` avant tout envoi au client (voir checklist § 7).

## 4bis. Animation produit (optionnelle)

Pour un client dont le produit/lieu se prête à l'effet "page produit" (une montre, une pièce
d'ébénisterie, un plat signature...) : une séquence d'images (`data-frames`, voir `docs/ANIMATIONS.md`)
jouée image par image pendant que le visiteur scrolle. Optionnel, à réserver aux sites où ça apporte
vraiment quelque chose (pas un artisan pressé, pas un site déjà chargé en animations) :

1. **Point de départ : une vraie vidéo ou une vraie photo du client.** Deux chemins possibles :
   - Le client a déjà une vidéo (tournage, smartphone) : `node scripts/ff.mjs sequence <slug>
     <video.mp4|.mov> --n 60 --nom <nom>` extrait N frames régulièrement espacées (sans ffmpeg, via
     Chrome) et les réencode en WebP desktop + mobile.
   - Le client n'a qu'une photo : `node scripts/ff.mjs animer <slug> <photo> "<prompt>"` l'anime
     (image-to-video, fal.ai), puis enchaîne automatiquement avec `ff sequence` sur le résultat.
2. **Règle non négociable** (identique à la règle sur les images IA, `docs/veille/redaction-images.md`
   §2.3, et à la règle 2 de `CLAUDE.md`) : on n'anime **jamais** une image générée ou une photo de
   banque présentée comme "du" client — uniquement une photo ou une vidéo réelle de son propre
   produit, lieu ou réalisation. Une vidéo générée par IA à partir d'une photo réelle est acceptable
   (le produit/lieu représenté est réel), une image entièrement inventée ne l'est jamais.
3. **Marquage AI Act (art. 50, applicable depuis le 2 août 2026)** dès qu'`ff animer` a été utilisé :
   `data-ia="1"` sur la section concernée et une mention visible ("animation générée à partir d'une
   photo") — `ff animer` le rappelle à chaque exécution et le journalise dans `CREDITS.md`.
4. Coller les attributs `data-frames-*` affichés par `ff sequence` dans la section (voir l'exemple
   complet de `docs/ANIMATIONS.md` § data-frames et la démo `sites/_effets/`).

## 5. Appel de restitution

On montre le site au client (lien de preview ou partage d'écran), on note ses retours. La plupart des
retours à ce stade sont des corrections de texte ou de photo, pas des changements de structure — si le
client demande une structure très différente, c'est un nouveau brief, pas une correction.

## 6. Fenêtre de corrections (2 semaines)

Les retours du client (texte, photo, coordonnée) sont inclus pendant les deux semaines qui suivent la
restitution. Passé ce délai, chaque modification se commande à la demande, au forfait (voir § 8).

## 7. Livraison

Mise en ligne **seulement après paiement du solde** (modèle du 20 oct 2026,
`studio/decisions/PROCESS-HEBERGEMENT.md`).

- Domaine acheté par F&F chez OVH **au nom du client**, payé 10 ans (jamais au nom du studio).
- `node scripts/ff.mjs deploy <slug>` — mise en ligne sur le compte Cloudflare F&F, hébergement
  gratuit (voir `docs/DEPLOIEMENT.md`). Formulaire : `form.provider: 'cloudflare'` (Worker + Email
  Routing, rien n'est stocké) ; le client clique une fois sur le lien de vérification de son adresse.
- `node scripts/ff.mjs exporter <slug>` — le site complet, remis sur demande du client ou d'office si
  F&F arrête l'hébergement (préavis de 3 mois), avec le code de transfert du domaine.

### Définition de fait — à cocher avant d'annoncer une livraison

- [ ] `node scripts/ff.mjs verifier <slug>` vert (il inclut l'accessibilité, la typographie française et
      les signes « fait par une IA » ; une faute de typo se corrige avec `ff typo <slug> --corriger`).
- [ ] Site vérifié sur mobile (375 px) en plus du desktop.
- [ ] Mentions légales complètes (`legal.owner`, SIRET, hébergeur, médiateur de la consommation si
      applicable).
- [ ] Formulaire de contact testé de bout en bout (envoi réel reçu).
- [ ] Site soumis à Google Search Console (sitemap déposé).
- [ ] **Visibilité IA (moteurs de réponse)** — ChatGPT Search et Copilot puisent dans l'index Bing :
      - [ ] IndexNow soumis (`ff deploy` le fait automatiquement si le domaine est branché ;
            sinon `node scripts/ff.mjs indexnow <slug>` après mise en ligne) ;
      - [ ] fiche **Bing Places for Business** créée/corrigée pour le client (bingplaces.com,
            import possible depuis Google Business Profile) — la recherche locale de ChatGPT
            s'appuie dessus autant que sur la fiche Google ;
      - [ ] Cloudflare : l'option « Block AI bots » ( Bots / AI Crawl Control) **décochée** pour
            les bots de recherche (OAI-SearchBot, PerplexityBot, Claude-SearchBot) — le robots.txt
            du site les autorise, encore faut-il que le pare-feu ne les jette pas.
- [ ] Domaine au nom du client, pas du studio, payé 10 ans, renouvellement automatique désactivé.
- [ ] Solde payé avant la mise en ligne.
- [ ] Formulaire testé après le clic de vérification du client.
- [ ] Aucun chiffre, avis ou note inventé n'a été laissé dans `site.config.ts` — tout ce qui manquait
      au brief est resté absent, pas approximé.
- [ ] Page `/confidentialite` présente et liée depuis le pied de page et le petit texte du formulaire
      (RGPD, généré depuis `site.config.ts` — voir `src/pages/confidentialite.astro`).
- [ ] Si `sites/<slug>/CREDITS.md` exige une attribution obligatoire (photo CC BY/CC BY-SA posée par
      `ff photos`), la page `/credits` existe et est liée depuis le pied de page — généré/vérifié
      automatiquement (`src/pages-optional/credits.astro`, `ff verifier`), voir
      `docs/veille/redaction-images.md` §2.
- [ ] Carte sans traceur : `contact.mapsProvider` laissé sur `'osm'` (défaut) sauf demande explicite du
      client pour Google Maps — et dans ce cas, uniquement via la façade cliquable (`<Carte />`), jamais
      une iframe Google Maps chargée directement.
- [ ] `business.schemaType` correct ou absent (déduit automatiquement du métier via
      `schemaTypeForTrade`, voir `src/lib/schemaType.ts`) — pas de sous-type schema.org inventé, pas
      d'`aggregateRating` dans le JSON-LD.
- [ ] **Lighthouse ≥ 90 sur index, desktop et mobile** (performance, accessibilité, bonnes pratiques,
      SEO) : `node scripts/ff.mjs lighthouse <slug>`, ou `node scripts/ff.mjs verifier <slug>
      --lighthouse` pour l'inclure dans la vérification. Résultats dans
      `captures/<slug>-lighthouse.json`. Si la page d'accueil est sous le seuil, corriger avant
      livraison plutôt que baisser le seuil.
- [ ] **`ff perf <slug>` vert** (budget de performance sans navigateur — html/css/js-initial/js-lazy/
      fonts/images-home comparés à `perf-budget.json`, racine du repo) : `node scripts/ff.mjs perf
      <slug>`. Rapide, à lancer avant Lighthouse (qui reste la mesure de référence) ; empêche une
      police/dépendance ajoutée depuis de faire dériver silencieusement le poids livré.
- [ ] Checklist « textes livrables » (20 points, `docs/REDACTION.md` §11) relue — mots interdits,
      vouvoiement, ton par métier, règles des professions réglementées, aucun chiffre/avis inventé.
      `node scripts/ff.mjs verifier <slug>` recontrôle une partie de cette liste (bloc « Textes »).
- [ ] Checklist « images livrables » (15 points, `docs/veille/redaction-images.md` §3.2) relue — aucune
      IA sur `portrait`/`team`/`gallery`/`beforeAfter`, droit à l'image, `CREDITS.md` à jour.
- [ ] **`ff audit-motion <slug>` vert** (site déjà construit, desktop + mobile) : aucune apparition au
      scroll restée invisible, aucune section épinglée cassée, aucune séquence d'images/marquee/
      compteur bloqué, aucun débordement horizontal ni contraste insuffisant sur `.eyebrow`/
      `.text-muted`. Résultats dans `captures/<slug>-motion.json`.
- [ ] **`ff planche <slug>` regardée** (ordinateur et téléphone, `captures/planches/`) : le défilement à la
      molette, vignette par vignette. Une capture fixe et les audits automatiques n'ont pas vu la forge
      dont la séquence ne s'animait qu'à la fin de l'épinglage (13 oct 2026). `/site-final` le fait.
- [ ] **`ff nettete <slug>` vert** (site déjà construit, desktop @2x + mobile @3x) : aucune image, séquence
      `data-frames` ou vidéo affichée plus grande que sa source réelle (étirement = flou, cas de la
      séquence « Le geste » de forge-delacroix, 5 Ko/image sur un canvas plein écran). Résultats dans
      `captures/<slug>-nettete.json`.
- [ ] **CSP sans erreur console** : `node scripts/ff.mjs captures <slug>` sert désormais `dist/<slug>`
      avec les en-têtes de `_headers` appliqués (Content-Security-Policy comprise, voir
      `docs/DEPLOIEMENT.md` § Sécurité) — un « console error » de type CSP dans la sortie de la
      commande signale une ressource externe non déclarée (à ajouter dans `scripts/ff/csp.mjs`,
      `buildCsp`) ou un script/iframe à corriger, jamais à contourner en assouplissant la CSP par
      réflexe.
- [ ] Anti-spam décidé : `form.turnstileSiteKey` renseigné si le client a un provider `cloudflare` et
      un vrai problème de spam anticipé (facultatif sinon — le honeypot existant suffit dans la
      majorité des cas). Voir `docs/DEPLOIEMENT.md` § Anti-spam (Turnstile).

## 7bis. Suivi après livraison

Le client reçoit `studio/commercial/APRES-LIVRAISON.md` (et sa version autonome `studio/commercial/apres-livraison.html`,
avec cases à cocher) : ce qu'il doit faire lui-même la semaine qui suit la mise en ligne (fiche
Google Business Profile, Search Console, Bing Places, Apple Business Connect, PagesJaunes, demande
d'avis, statistiques, renouvellement du domaine, sauvegarde, contact du studio).

Côté studio, `node scripts/ff.mjs sante <slug>` (voir `docs/DEPLOIEMENT.md` et l'aide de la commande)
vérifie que le site est réellement accessible et en bonne santé une fois en ligne — HTTP 200 sur les
pages clés, vrai 404 sur `/404`, redirection HTTP→HTTPS, cache des assets, certificat TLS, expiration
du domaine, DNS. Contrairement à `ff verifier`/`ff lighthouse` (qui testent un build local avant
livraison), `ff sante` teste le site **déjà en ligne**. À lancer :

- **à J+1** (le lendemain de la mise en ligne), une fois le DNS propagé et le certificat HTTPS émis ;
- **une fois par mois** ensuite, en routine (domaine qui approche de son expiration, certificat,
  disponibilité) — pas besoin d'un rendez-vous client pour ça, une simple commande.

Automatisé en plus de la routine manuelle : après **chaque** livraison, ajoute le slug à
`sites-en-ligne.json` (racine du dépôt, un tableau JSON de slugs) — le job planifié `sante-hebdomadaire`
de `.github/workflows/ci.yml` lance `ff sante` sur chacun tous les lundis et ouvre une issue GitHub si
un site échoue (voir `docs/DEPLOIEMENT.md` § Suivi automatisé).

**Sauvegarde** : `node scripts/ff.mjs archiver <slug>` zippe `sites/<slug>` (contenu, photos, look) et
le dernier `dist/<slug>` construit dans `archives/<slug>-<date>.zip` (dossier local, jamais commité —
voir `.gitignore`). À lancer avant une manipulation risquée (édition en masse, mise à jour de
dépendance majeure) ou simplement en routine après une livraison — plus léger que `ff exporter`, qui
prépare en plus un dépôt git autonome pour la remise au client.

## 7ter. Régression visuelle

`node scripts/ff.mjs captures <slug> --figer` fige les captures actuelles comme référence
(`captures/base/<slug>-*.png`, dossier local, jamais commité) ; `node scripts/ff.mjs captures <slug>
--comparer` recompare chaque capture fraîche à cette référence pixel par pixel et avertit (sans faire
échouer la commande) si plus de 0,5 % des pixels diffèrent, avec une image de différence dans
`captures/diff/`. À utiliser après un changement dans une section/direction partagée (`src/`) pour
relire d'un coup d'œil ce qui a visuellement bougé sur plusieurs sites, avant de figer la nouvelle
référence si le changement est voulu.

## 8. Positionnement prix

Prestation **au forfait, en une fois** (one-shot) : brief, production, restitution, corrections
pendant deux semaines, livraison, domaine 10 ans compris, hébergement offert. **Aucun abonnement**
(décision du 20 oct 2026). Les modifications après livraison se commandent à la demande, au forfait,
sur devis court. Prix : [à fixer]. Chaîne commerciale : `studio/decisions/PIPELINE.md`.

## 9. Parcours documentaire

Quatre documents contractuels encadrent le processus décrit ci-dessus (modèles complets dans
`studio/juridique/modeles/`, cadre juridique détaillé dans `studio/juridique/JURIDIQUE.md` — **modèles à faire relire par un
professionnel du droit avant tout premier usage réel**). À quel moment chacun intervient :

| Document | Modèle | Envoyé/signé à quelle étape | Ce qu'il fige |
|---|---|---|---|
| **Devis** | `studio/juridique/modeles/devis-modele.md` | Après l'appel client (§ 2), avant le jour de production — **doit être signé et l'acompte encaissé avant de lancer l'étape § 4 (jour de production)**. Le délai de 72 h du § 4 ne démarre qu'à réception des éléments, jamais avant devis signé + acompte reçu. | Formule (Essentiel/Complet), prix, acompte, délai, droit de rétractation le cas échéant. |
| **CGV** | `studio/juridique/modeles/cgv-modele.md` | Jointes systématiquement au devis (obligatoire sur demande en B2B, Code de commerce art. L441-1) et publiées sur `sites/finck-fisch`. | Conditions générales : paiement, résiliation, propriété intellectuelle, garanties — cadre commun à toutes les prestations. |
| **Contrat de prestation** | `studio/juridique/modeles/contrat-modele.md` | Signé en même temps que le devis, ou juste après (les deux peuvent être fusionnés en un seul envoi pour un client TPE — le contrat détaille ce que le devis résume). Couvre tout le parcours jusqu'à la livraison (§ 4 à § 7). | Cession des droits d'auteur sur le site livré (clause L131-3 CPI), RGPD sous-traitance le temps de la production, réversibilité, garantie, responsabilité. |
| **PV de livraison** | Annexe 2 de `studio/juridique/modeles/contrat-modele.md` | Signé lors de l'appel de restitution (§ 5), ouvre la fenêtre de corrections de deux semaines (§ 6). | Constat de conformité au périmètre convenu ; les réserves notées dessus sont couvertes par la fenêtre de corrections. |
| **Facture de solde** | `studio/juridique/modeles/facture-modele.md` | Émise à la validation (§ 5-6), solde réglé avant la mise en ligne (§ 7). | Montant du solde, pénalités de retard/indemnité de 40 € applicables, mentions légales de facturation. |

Rappel d'ordre strict pour le jour de production (§ 4) : **jamais de production sans devis signé et
acompte reçu** — le studio ne débute `node scripts/ff.mjs nouveau <slug>` qu'une fois ces deux éléments
confirmés, pas sur une simple promesse orale.
