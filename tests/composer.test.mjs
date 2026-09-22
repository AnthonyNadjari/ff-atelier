// Tests de `ff composer` (scripts/ff/composer.mjs) : le choix de direction doit toujours respecter
// le metier du client quand une direction adaptee existe, meme si elle a deja beaucoup servi.
//
// Contexte (docs/veille/repetition-generale.md, friction #3) : une repetition generale a montre
// qu'une fleuriste tombait sur la direction "industriel" (beton/acier, orange securite) — le malus
// de variete "-2 * nombre d'utilisations" (anti-repetition entre clients) pouvait depasser le bonus
// metier de +3 des que la direction adaptee ("atelier", qui liste "fleuriste" dans meta.metiers)
// avait deja servi 2 fois ou plus. Ces tests figent le nouveau comportement : le "palier" d'une
// direction (adaptee / neutre / a eviter, voir directionTier) prime toujours sur le score, donc sur
// le malus de variete.
//
// Aucun test existant (tests/cli.test.mjs, tests/presets.test.mjs) n'exerçait le calcul de score des
// directions par metier avant cette session — rien a adapter, seulement a ajouter.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { pickLook, scoreDirections, directionTier, pickSquelette } from '../scripts/ff/composer.mjs';
import { listDirectionMetas } from '../scripts/ff/look-data.mjs';

// `_exemple` sert de reference de schema pour tout le repo (voir CLAUDE.md) : toujours present,
// jamais un vrai client. `pickLook(..., { metier })` ignore de toute facon business.trade du site
// quand `metier` est fourni explicitement (voir composer.mjs : `metier || cfg.business?.trade`).
const SLUG = '_exemple';

test('directionTier : une direction adaptee au metier reste palier 0 quel que soit le malus de variete', () => {
  const dirMetas = listDirectionMetas();
  // Simule une direction adaptee ("atelier", qui liste "fleuriste") deja utilisee 50 fois : le score
  // brut devient tres negatif (3 - 2*50 = -97), largement sous celui d'une direction hors sujet
  // jamais utilisee (score 0). L'ancien code choisissait alors la direction hors sujet sans le dire.
  const counts = new Map([['atelier', 50]]);
  const scored = scoreDirections(dirMetas, 'fleuriste', counts);
  const atelier = scored.find((d) => d.dir === 'atelier');
  const industriel = scored.find((d) => d.dir === 'industriel');
  assert.ok(atelier, 'direction "atelier" introuvable (meta.ts renomme ?)');
  assert.ok(industriel, 'direction "industriel" introuvable (meta.ts renomme ?)');
  assert.equal(atelier.metierMatch, true, '"atelier" doit matcher le metier "fleuriste" (meta.metiers)');
  assert.ok(atelier.score < industriel.score, 'le malus doit bien faire chuter le score brut sous celui d\'une direction neutre (sinon ce test ne prouve rien)');
  assert.equal(directionTier(atelier), 0, 'une direction adaptee au metier doit toujours etre palier 0');
  assert.ok(directionTier(industriel) > 0, 'une direction sans lien avec le metier ne doit jamais etre palier 0');
});

test('pickLook : "fleuriste" ne tombe jamais dans industriel/neon/signal, quelle que soit la graine', () => {
  const exclues = ['industriel', 'neon', 'signal'];
  for (let graine = 1; graine <= 25; graine++) {
    const result = pickLook(SLUG, { metier: 'fleuriste', graine });
    assert.ok(!exclues.includes(result.direction), `graine ${graine} : direction "${result.direction}" hors sujet pour une fleuriste`);
    assert.equal(result.direction, 'atelier', `graine ${graine} : "atelier" est la seule direction qui liste "fleuriste" dans meta.metiers, attendu comme choix (obtenu "${result.direction}")`);
    assert.equal(result.metierAdapte, true, `graine ${graine} : metierAdapte devrait etre vrai pour une direction adaptee`);
  }
});

test('pickLook : "avocat" choisit une direction adaptee au metier (journal), pas de repli hors sujet', () => {
  for (let graine = 1; graine <= 10; graine++) {
    const result = pickLook(SLUG, { metier: 'avocat', graine });
    assert.equal(result.direction, 'journal', `graine ${graine} : "journal" liste "avocat" dans meta.metiers (obtenu "${result.direction}")`);
    assert.equal(result.metierAdapte, true, `graine ${graine} : metierAdapte devrait etre vrai`);
  }
});

test('pickLook : les 3 directions retenues sont exposees avec une raison, dans l\'ordre palier puis score', () => {
  const result = pickLook(SLUG, { metier: 'fleuriste', graine: 1 });
  assert.ok(Array.isArray(result.top3) && result.top3.length === 3, 'pickLook doit renvoyer top3 (3 directions)');
  for (const d of result.top3) {
    assert.ok(Array.isArray(d.reasons), `direction "${d.dir}" : reasons doit etre un tableau (vide accepte)`);
  }
  // La premiere retenue doit etre du palier le plus bas (le "meilleur"), les suivantes jamais meilleures.
  const tiers = result.top3.map((d) => directionTier(d));
  assert.ok(tiers[0] <= tiers[1] && tiers[1] <= tiers[2], `top3 doit etre trie par palier croissant, obtenu [${tiers.join(', ')}]`);
});

test('pickLook : un metier sans aucune direction adaptee declenche metierAdapte=false (avertissement affiche par cmdComposer)', () => {
  const result = pickLook(SLUG, { metier: 'xyzzy-metier-totalement-inconnu', graine: 1 });
  assert.equal(result.metierAdapte, false, 'aucune direction ne liste ce metier fictif : metierAdapte doit etre faux');
});

// `pickSquelette` (choix du SQUELETTE de page par famille de metier, docs/veille/squelettes.md § 3a)
// est une fonction pure comme `scoreDirections`/`directionTier` : testee directement avec des
// `shellCounts` fabriques, independamment de l'etat reel de sites/* (qui evolue a chaque nouveau
// client et ferait de ces tests des tests fragiles). Voir aussi le test d'integration plus bas
// (pickLook) qui verifie que le contactDrawer d'un metier d'urgence tient quel que soit l'etat reel.

test('pickSquelette : "photographe" (famille portfolio) choisit la coquille index, sans reutilisation', () => {
  const result = pickSquelette('photographe', { shellCounts: new Map(), stepsCount: 0 });
  assert.ok(result, 'la famille "portfolio" doit reconnaitre "photographe"');
  assert.equal(result.familyId, 'portfolio');
  assert.equal(result.shell, 'index');
  assert.equal(result.alternative, 'sticky-hero', 'chaque famille propose deux coquilles : la seconde sert de repli');
});

test('pickSquelette : "plombier" (famille urgence) impose contactDrawer=true et nav=bar', () => {
  const result = pickSquelette('plombier', { shellCounts: new Map(), stepsCount: 0 });
  assert.ok(result, 'la famille "urgence" doit reconnaitre "plombier"');
  assert.equal(result.familyId, 'urgence');
  assert.equal(result.contactDrawer, true);
  assert.equal(result.nav, 'bar');
  assert.ok(['flow', 'split'].includes(result.shell), 'urgence propose flow ou split');
});

test('pickSquelette : "osteopathe" (famille sante) reste sur slides/sidebar, jamais un mouvement "rich"', () => {
  for (const metier of ['osteopathe', 'osteo', 'veterinaire', 'avocat', 'dentiste']) {
    const result = pickSquelette(metier, { shellCounts: new Map(), stepsCount: 0 });
    assert.ok(result, `la famille "sante" doit reconnaitre "${metier}"`);
    assert.equal(result.familyId, 'sante');
    assert.ok(['slides', 'sidebar'].includes(result.shell), `"${metier}" doit rester sur slides/sidebar, obtenu "${result.shell}"`);
    assert.equal(result.motion, 'subtle', `"${metier}" doit forcer un mouvement discret, jamais "rich"`);
  }
});

test('pickSquelette : "menuisier" avec 4 etapes (>= 3) recommande la variante process/horizon', () => {
  const avecEtapes = pickSquelette('menuisier', { shellCounts: new Map(), stepsCount: 4 });
  assert.ok(avecEtapes, 'la famille "atelier" doit reconnaitre "menuisier"');
  assert.equal(avecEtapes.familyId, 'atelier');
  assert.equal(avecEtapes.processVariant, 'horizon', '>= 3 etapes doit declencher process/horizon');

  const sansEtapes = pickSquelette('menuisier', { shellCounts: new Map(), stepsCount: 2 });
  assert.equal(sansEtapes.processVariant, null, '< 3 etapes ne doit jamais forcer process/horizon');
});

test('pickSquelette : malus de reutilisation — 3 sites deja en "index" bascule "photographe" sur le second choix de la famille', () => {
  const sansReutilisation = pickSquelette('photographe', { shellCounts: new Map(), stepsCount: 0 });
  assert.equal(sansReutilisation.shell, 'index', 'sans reutilisation, la coquille preferee de la famille doit etre retenue');

  const avecReutilisation = pickSquelette('photographe', { shellCounts: new Map([['index', 3]]), stepsCount: 0 });
  assert.equal(avecReutilisation.familyId, 'portfolio');
  assert.equal(avecReutilisation.shell, 'sticky-hero', '"index" deja porte par >= 3 sites : bascule sur le second choix de la famille');
  assert.equal(avecReutilisation.alternative, 'index', "l'alternative affichee reste la coquille preferee ecartee par le malus");
});

test('pickSquelette : un metier sans famille connue renvoie null (pas de squelette impose)', () => {
  const result = pickSquelette('xyzzy-metier-totalement-inconnu', { shellCounts: new Map(), stepsCount: 0 });
  assert.equal(result, null);
});

test('pickLook : "plombier" impose contactDrawer=true quelle que soit la graine ou l\'etat reel de sites/*', () => {
  for (let graine = 1; graine <= 8; graine++) {
    const result = pickLook(SLUG, { metier: 'plombier', graine });
    assert.equal(result.look.layout.contactDrawer, true, `graine ${graine} : contactDrawer doit etre force par la famille "urgence"`);
    assert.ok(result.squelette, 'result.squelette doit etre expose (bloc "Squelette retenu")');
    assert.equal(result.squelette.familyId, 'urgence');
    assert.ok(Array.isArray(result.top3), 'le reste de pickLook (directions) doit rester intact');
  }
});
