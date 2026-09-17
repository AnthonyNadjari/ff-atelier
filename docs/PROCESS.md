# Processus client — de la prospection à la livraison

Ce document décrit le parcours complet d'un client, pour les deux personnes de Finck & Fisch :
celle qui prospecte/vend/brief, celle qui construit. `docs/BRIEF.md` est le support de l'appel ;
ce fichier est le fil du reste.

## 1. Prospection

Les outils de prospection existent déjà dans `scrapping_artisans/` (scraping Google Maps, base
SQLite, relances WhatsApp) — voir son `CLAUDE.md` pour le détail technique. On ne les duplique pas
ici : ce dépôt (`ff-atelier`) prend le relais à partir du moment où un client a dit oui à l'appel, ou
juste avant, pour préparer l'appel.

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
  WeTransfer.
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

## 5. Appel de restitution

On montre le site au client (lien de preview ou partage d'écran), on note ses retours. La plupart des
retours à ce stade sont des corrections de texte ou de photo, pas des changements de structure — si le
client demande une structure très différente, c'est un nouveau brief, pas une correction.

## 6. Fenêtre de corrections (2 semaines)

Les retours du client (texte, photo, coordonnée) sont inclus pendant les deux semaines qui suivent la
restitution. Passé ce délai, toute modification relève d'une prestation de maintenance séparée (voir
§ 8).

## 7. Livraison

- `node scripts/ff.mjs deploy <slug>` — mise en ligne (voir `docs/DEPLOIEMENT.md` pour le détail
  technique Cloudflare Pages, domaine et DNS).
- `node scripts/ff.mjs exporter <slug>` — prépare la remise finale :
  - domaine transféré ou acheté **au nom du client**, pas au nom du studio ;
  - clé Web3Forms (`form.accessKey` dans `site.config.ts`) générée **au nom du client**, sur son
    propre compte — jamais la clé du studio réutilisée d'un client à l'autre ;
  - accès au dépôt de code remis au client.

### Définition de fait — à cocher avant d'annoncer une livraison

- [ ] `node scripts/ff.mjs verifier <slug>` vert.
- [ ] Site vérifié sur mobile (375 px) en plus du desktop.
- [ ] Mentions légales complètes (`legal.owner`, SIRET, hébergeur, médiateur de la consommation si
      applicable).
- [ ] Formulaire de contact testé de bout en bout (envoi réel reçu).
- [ ] Site soumis à Google Search Console (sitemap déposé).
- [ ] Domaine au nom du client, pas du studio.
- [ ] Dépôt de code remis/accessible au client.
- [ ] Aucun chiffre, avis ou note inventé n'a été laissé dans `site.config.ts` — tout ce qui manquait
      au brief est resté absent, pas approximé.
- [ ] Page `/confidentialite` présente et liée depuis le pied de page et le petit texte du formulaire
      (RGPD, généré depuis `site.config.ts` — voir `src/pages/confidentialite.astro`).
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

## 8. Positionnement prix

Prestation **au forfait, en une fois** (one-shot) : brief, production, restitution, corrections
pendant deux semaines, livraison. La maintenance après livraison (mises à jour de contenu, ajout de
pages, évolutions) **n'est pas incluse** — c'est une offre à proposer séparément, à construire plus
tard si la demande se confirme, pas un engagement pris au moment de la vente initiale.
