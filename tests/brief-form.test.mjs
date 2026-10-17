// Formulaire client (outils/brief-form) : mise en forme pure du brief et lecture du slug par `ff brief`.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { briefMarkdown, champsManquants, slugPropose, QUESTIONS_FAQ } from '../outils/brief-form/lib/brief.mjs';
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

test('portes d’action : lien donné recopié, lien vide = « aucun (ne pas en inventer) »', () => {
  const md = briefMarkdown({ ...d, reservation: 'https://exemple.fr/reserver' });
  assert.match(md, /- \*\*Lien de réservation en ligne :\*\* https:\/\/exemple\.fr\/reserver/);
  assert.match(md, /- \*\*Lien de commande \/ click & collect :\*\* aucun \(ne pas en inventer\)/);
  assert.match(md, /- \*\*Lien de bon cadeau en ligne :\*\* aucun \(ne pas en inventer\)/);
});

test('questions fréquentes (§ 10) : une ligne Q / R par réponse non vide, telle quelle ; rien pour les vides ; aucune réponse = pas de FAQ', () => {
  const md = briefMarkdown({ ...d, faq_parking: 'Parking gratuit devant, entrée par la cour.\nSonner au 2.', faq_devis: '', faq_urgence: '  ', faq_avant: 'Vider les placards du bas' });
  const sec = md.slice(md.indexOf('## 10.'), md.indexOf('### 10bis'));
  assert.match(sec, /- \*\*Q :\*\* Parking et accès : où se garer, comment entrer \? \/ \*\*R :\*\* Parking gratuit devant, entrée par la cour\. Sonner au 2\./);
  assert.match(sec, /- \*\*Q :\*\* Que doit faire le client avant votre venue \? \/ \*\*R :\*\* Vider les placards du bas/);
  assert.doesNotMatch(sec, /devis est-il payant|urgence|Délais|délais/i, 'une question sans réponse n’apparaît pas');
  assert.doesNotMatch(sec, /\? à demander/, 'jamais « ? à demander » : une question sans réponse n’entre pas sur le site');
  assert.equal((sec.match(/\*\*Q :\*\*/g) || []).length, 2);
  // ordre du formulaire conservé, huit questions connues
  assert.equal(QUESTIONS_FAQ.length, 8);
  assert.deepEqual(QUESTIONS_FAQ.map(([k]) => k), ['faq_parking', 'faq_delais', 'faq_devis', 'faq_paiement', 'faq_zone', 'faq_contraintes', 'faq_urgence', 'faq_avant']);
  // questions libres en plus, et sans aucune réponse : la section le dit
  assert.match(briefMarkdown({ ...d, demandes: 'Faites-vous les escaliers ?\nOui.' }), /- \*\*Autres questions qui reviennent :\*\* Faites-vous les escaliers \? Oui\./);
  assert.match(briefMarkdown(d), /## 10\.[^\n]*\nAucune réponse : pas de FAQ sur le site \(ne rien inventer\)\./);
});

test('formulaire : les huit textarea facultatifs de la FAQ, libellé-question, placeholder vide, mêmes clés que brief.mjs', () => {
  const html = fs.readFileSync(new URL('../outils/brief-form/public/index.html', import.meta.url), 'utf8');
  for (const [k, q] of QUESTIONS_FAQ) {
    const m = html.match(new RegExp(`<label for="${k}">([^<]+)<span class="facultatif">\\(facultatif\\)</span></label>\\s*<textarea id="${k}" name="${k}" class="courte"></textarea>`));
    assert.ok(m, `${k} : label + textarea attendus`);
    assert.equal(m[1].trim(), q, `${k} : le libellé du formulaire est la question du brief`);
    assert.doesNotMatch(m[0], /placeholder=/, `${k} : aucun exemple inventé en placeholder`);
  }
  assert.match(html, /<legend>Questions fréquentes<\/legend>/);
});

test('site actuel : la reprise est écrite en tête du brief, avec la consigne ff refonte', () => {
  const md = briefMarkdown({ ...d, site_actuel: 'https://exemple-ancien.fr', site_reprise: 'Textes et photos' });
  assert.match(md, /\*\*Site actuel : https:\/\/exemple-ancien\.fr\*\* \(reprise : Textes et photos\)/);
  assert.match(md, /ff refonte/);
  assert.match(briefMarkdown({ ...d, site_actuel: 'https://x.fr', site_reprise: 'Rien, on repart de zéro' }), /Ne rien reprendre/);
  assert.doesNotMatch(briefMarkdown(d), /Site actuel/);
});
