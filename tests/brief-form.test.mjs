// Formulaire client (outils/brief-form) : mise en forme pure du brief et lecture du slug par `ff brief`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { briefMarkdown, champsManquants, slugPropose } from '../outils/brief-form/lib/brief.mjs';
import { slugDuBrief } from '../scripts/ff/brief.mjs';

const d = { nom: 'Fromagerie Ravanel', metier: 'Fromager-affineur', ville: 'Annecy', tel: '04 65 71 23 18', services: 'Plateaux\nRaclette', contact_nom: 'Claire Ravanel', accord: true, photos_dispo: ['Logo'], horaires: 'Lundi : fermé' };

test('champsManquants : le minimum, accord compris', () => {
  assert.deepEqual(champsManquants(d), []);
  assert.deepEqual(champsManquants({ ...d, tel: ' ', accord: false }), ['téléphone', 'accord']);
});

test('briefMarkdown : vide = « ? à demander », jamais deviné ; pas d’e-mail = pas d’e-mail', () => {
  const md = briefMarkdown(d, new Date('2026-10-16T10:00:00Z'));
  assert.match(md, /- \*\*SIRET :\*\* \? à demander/);
  assert.match(md, /- \*\*E-mail :\*\* aucun \(ne pas en inventer\)/);
  assert.match(md, /- \[x\] Logo/);
  assert.match(md, /- Plateaux\n- Raclette/);
  assert.match(md, /Reçu par le formulaire en ligne le 2026-10-16/);
});

test('slug proposé, relu par ff brief', () => {
  assert.equal(slugPropose('Fromagerie Ravanel & Fils', 'Annecy'), 'fromagerie-ravanel-et-fils');
  assert.equal(slugDuBrief(briefMarkdown(d)), 'fromagerie-ravanel');
});

test('photos souhaitées sans en avoir : signalé à organiser', () => {
  const md = briefMarkdown({ ...d, photos_souhait: 'Oui, mais je n’en ai pas', photos_qui: 'Vous, sur place', ambiance: 'Calme, posé' });
  assert.match(md, /Photos sur le site \? :\*\* Oui, mais je n’en ai pas : \*\*à organiser\*\*, qui les fait : Vous, sur place/);
  assert.match(md, /Ambiance \(calme ou vivant\) :\*\* Calme, posé/);
});
