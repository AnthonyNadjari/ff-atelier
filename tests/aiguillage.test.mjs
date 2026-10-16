import { test } from 'node:test';
import assert from 'node:assert/strict';
import { lireReponses, decider, lignesContrat, controlerAiguillage, mouvementDuContrat } from '../scripts/ff/aiguillage.mjs';
import { briefMarkdown } from '../outils/brief-form/lib/brief.mjs';

const base = { nom: 'Fromagerie Ravanel', metier: 'Fromager', ville: 'Annecy', tel: '04 65 71 23 18', services: 'Plateaux', contact_nom: 'Claire', accord: true, photos_dispo: [] };

test('formulaire : souhait, qui, ambiance', () => {
  const r = lireReponses(briefMarkdown({ ...base, photos_souhait: 'Oui, mais je n’en ai pas', photos_qui: 'Vous, sur place', ambiance: 'Calme, posé', photos_dispo: ['Portrait'] }));
  assert.deepEqual([r.souhait, r.qui, r.ambiance, r.cases.portrait], ['sans-photo', 'studio', 'calme', true]);
  const v = lireReponses(briefMarkdown({ ...base, photos_souhait: 'Oui, j’en ai', ambiance: 'Je ne sais pas' }));
  assert.deepEqual([v.souhait, v.ambiance], ['avec-photo', 'je-ne-sais-pas']);
});

test('formulaire sans réponse : rien deviné', () => {
  const r = lireReponses(briefMarkdown(base));
  assert.deepEqual([r.souhait, r.ambiance, r.qui], [null, null, null]);
});

test('brief papier : cases cochées', () => {
  const md = "**Des photos sur le site ?** (x)\n\n- [ ] Oui, et j'en ai\n- [x] Oui, mais je n'en ai pas encore → qui les fait : [x] lui, au téléphone  [ ] nous, sur place\n- [ ] Peu ou pas\n\n- **Ambiance** (règle) : [ ] plutôt calme, posé  [x] plutôt vivant, qui bouge\n  [ ] je ne sais pas, montrez-moi\n";
  const r = lireReponses(md);
  assert.deepEqual([r.souhait, r.qui, r.ambiance], ['sans-photo', 'client', 'vivant']);
});

test('décision : photos annoncées mais non reçues = attente ; reçues = matière', () => {
  assert.equal(decider({ souhait: 'avec-photo' }, []).photos, 'attente');
  assert.equal(decider({ souhait: 'avec-photo' }, ['comptoir']).photos, 'matiere');
  assert.equal(decider({ souhait: 'peu' }).photos, 'sans');
  assert.equal(decider({}).photos, 'sans');
});

test('décision : le client tranche, le contrat ne peut pas le contredire', () => {
  const d = decider({ ambiance: 'calme' }, [], 'vivant');
  assert.deepEqual([d.mouvement, d.motion, d.ecart], ['calme', 'subtle', true]);
  const j = decider({ ambiance: 'je-ne-sais-pas' }, [], 'vivant');
  assert.deepEqual([j.mouvement, j.couvrir, j.ecart], ['vivant', true, false]);
  assert.deepEqual(decider({}).aDemander, ['photos', 'ambiance']);
});

test('lignes du contrat', () => {
  const r = { cases: { portrait: true } };
  const [p, m] = lignesContrat(decider({ souhait: 'sans-photo', qui: 'client', ambiance: 'calme' }), r);
  assert.match(p, /liste de prises.*guide photo.*visage/);
  assert.match(m, /calme, `motion` subtle/);
  assert.equal(mouvementDuContrat('## Aiguillage\nPhotos : x\nMouvement : vivant, `motion` rich'), 'vivant');
});

test('contrôle : client calme', () => {
  const d = decider({ ambiance: 'calme' });
  assert.equal(controlerAiguillage({ decision: d, motion: 'subtle', html: '<div data-reveal></div>' }).echecs.length, 0);
  assert.ok(controlerAiguillage({ decision: d, motion: 'rich', html: '' }).echecs.length);
  assert.ok(controlerAiguillage({ decision: d, motion: 'subtle', html: '<div data-scrub></div>' }).echecs.length);
  assert.ok(controlerAiguillage({ decision: d, motion: 'subtle', sources: '.x{animation-timeline: scroll()}' }).echecs.length);
  assert.equal(controlerAiguillage({ decision: decider({ ambiance: 'vivant' }), motion: 'rich', html: '<div data-scrub></div>' }).echecs.length, 0);
});

test('contrôle : photo affichée sans photo du client = alerte', () => {
  const r = controlerAiguillage({ decision: decider({ souhait: 'peu' }), motion: 'rich', html: '<img src="/images/cave-800.webp">' });
  assert.equal(r.alertes.length, 1);
  assert.equal(controlerAiguillage({ decision: decider({ souhait: 'peu' }), motion: 'rich', html: '<img src="/images/logo.svg">' }).alertes.length, 0);
});

test('contrôle : le CSS du moteur inliné ne compte pas', () => {
  const html = '<style>[data-motion=rich] [data-scrub]{x:1}</style><p data-reveal>a</p>';
  assert.equal(controlerAiguillage({ decision: decider({ ambiance: 'calme' }), motion: 'subtle', html }).echecs.length, 0);
});

test('contrôle : timelines de défilement nommées ou view() dans une section sur mesure', () => {
  const d = decider({ ambiance: 'calme' });
  for (const sources of ['.a{view-timeline: --escalier block}', '.b{animation-timeline: auto, --escalier}', '.c{animation-timeline: view()}']) {
    assert.ok(controlerAiguillage({ decision: d, motion: 'subtle', sources }).echecs.length, sources);
  }
  assert.equal(controlerAiguillage({ decision: d, motion: 'subtle', sources: '.d{animation-timeline: auto}' }).echecs.length, 0);
});
