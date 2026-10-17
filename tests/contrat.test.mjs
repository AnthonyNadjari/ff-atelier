import { test } from 'node:test';
import assert from 'node:assert/strict';
import { sections, lignesContrat, faits, faitSource, analyserContrat } from '../scripts/ff/contrat.mjs';

const brief = `# Brief — Fromagerie Ravanel
- Cave d'affinage à 11 °C sous la boutique, creusée en 2014.
- Beaufort d'alpage vendu à 12, 18 ou 24 mois.
- Six fermes des Aravis et des Bauges.
- 12 rue de la Gare, Annecy. Marché mardi et vendredi (Théo).
- Raclette : appareil prêté, caution de 50 €.
- Plateaux de 6 à 30 personnes, 48 h avant.
- Claire (affinage), Théo (boutique).
- Reprise en 2011.`;

const bon = `# Direction — Fromagerie Ravanel (x)

## Aiguillage (deux phrases)
Photos : aucune piste ne dépend d'une photo.
Mouvement : vivant, \`motion\` rich, parce que le client a répondu « vivant ».

## Socle
Pages : une par service · Téléphone en haut : présent · Métier + ville : présent · Avis : absent : aucun avis au brief · Ancienneté : depuis 2011 · Photos : absent : aucune photo · Portes : Appeler, Réserver

## Faits propres (tous tirés du brief)
1. Une cave à 11 °C sous la boutique, creusée en 2014.
2. Le beaufort d'alpage à 12, 18 ou 24 mois.
3. Six fermes des Aravis et des Bauges.
4. 12 rue de la Gare, Annecy.
5. Marché mardi et vendredi, tenu par Théo.
6. Raclette : appareil prêté, caution de 50 €.
7. Plateaux de 6 à 30 personnes, 48 h avant.
8. Claire à l'affinage, Théo à la boutique.

## Phrase-idée
« Sur ce site, la cave à 11 °C devient un escalier qu'on descend. »

## Test du concurrent
La crémerie d'à côté n'a pas de cave creusée sous la boutique ni de beaufort à trois âges : la phrase ne marche que pour Ravanel.

## Contrat (six lignes)
- THÈSE : la page est une descente dans la cave ; elle refuse la photo d'étal et les cartes de fromages.
- SQUELETTE : coquille flow, une colonne étroite qui se décale d'une marche par section, nav fine en haut.
- PREMIER ÉCRAN : le nom en serif condensée, la cave à 11 °C en une phrase, le téléphone en mono, la porte et l'escalier.
- MOUVEMENT (ce qu'on voit) :
  1. Entrée : les marches apparaissent l'une après l'autre en descendant. Raison : descendre.
  2. Rythme : les meules se posent sur les planches l'une après l'autre. Raison : ranger.
  3. Feu d'artifice : on fait glisser la meule de beaufort entre 12, 18 et 24 mois. Raison : choisir.
  4. Image : la porte de la rue rapetisse en descendant. Raison : s'éloigner.
  Courbes : régime sec 0,15 s linéaire (marches), régime lent à rebond 0,75 s (meules).
- REFUSÉ : la photo d'étal, le rideau, les cartes.
- FIN : non relu = pas fini.

## Typographie, couleur, images
Direction pierre, libreCaslonCondensed + archivo, aucune photo.

## Références
- Délice (delice.md) : le titre comme objet du lieu. - Coutumes (coutumes.md) : le diptyque.
`;
const ctx = { brief, fiches: ['delice', 'coutumes', 'crispmtl'], directions: ['pierre', 'nuit'] };

test('sections, lignes, faits', () => {
  const s = sections(bon);
  assert.ok(s['faits propres'] && s['phrase-idee'] && s.contrat);
  const l = lignesContrat(s.contrat);
  assert.deepEqual(Object.keys(l), ['these', 'squelette', 'premier ecran', 'mouvement', 'refuse', 'fin']);
  assert.equal(faits(s['faits propres']).length, 8);
});

test('fait sourcé dans le brief ou non', () => {
  assert.ok(faitSource('Une cave à 11 °C sous la boutique', brief));
  assert.ok(faitSource('Caution de 50 €', brief));
  assert.ok(!faitSource('Médaille d\'or au concours de Lyon en 2019', brief));
});

test('bon contrat : aucun échec', () => {
  const r = analyserContrat({ contrat: bon, ...ctx });
  assert.deepEqual(r.echecs, []);
  assert.equal(r.nFaits, 8);
});

test('contrat non rempli : modèle, faits manquants, outil nommé, un seul régime', () => {
  const mauvais = bon
    .replace('## Phrase-idée\n« Sur ce site, la cave à 11 °C devient un escalier qu\'on descend. »', '## Phrase-idée\n« Sur ce site, [un fait de la liste] devient [le dispositif du bloc sur mesure]. »')
    .replace('7. Plateaux de 6 à 30 personnes, 48 h avant.\n8. Claire à l\'affinage, Théo à la boutique.\n', '7. Médaille d\'or au concours de Lyon en 2019.\n')
    .replace('les marches apparaissent l\'une après l\'autre en descendant', 'le titre monte ligne par ligne avec data-split')
    .replace('régime lent à rebond 0,75 s (meules)', 'rien d\'autre');
  const r = analyserContrat({ contrat: mauvais, ...ctx });
  const txt = r.echecs.join('\n');
  assert.match(txt, /modèle/);
  assert.match(txt, /7 fait/);
  assert.match(txt, /Médaille/);
  assert.match(txt, /data-split/);
  assert.match(txt, /deux régimes/);
  assert.ok(r.alertes.some((a) => /titre/.test(a)));
});

test('aiguillage : contrat en désaccord avec le client', () => {
  const r = analyserContrat({ contrat: bon, ...ctx, decision: { mouvement: 'calme', ecart: true, photos: 'sans' } });
  assert.ok(r.echecs.some((e) => /aiguillage/.test(e)));
  const r2 = analyserContrat({ contrat: bon, ...ctx, decision: { mouvement: 'vivant', ecart: false, photos: 'liste-de-prises' } });
  assert.ok(r2.echecs.some((e) => /liste de prises/.test(e)));
});

test('police IA et références absentes', () => {
  const r = analyserContrat({ contrat: bon.replace('libreCaslonCondensed + archivo', 'cormorant + inter').replace('Délice (delice.md)', 'Un site').replace('Coutumes (coutumes.md)', 'Un autre'), ...ctx });
  assert.ok(r.echecs.some((e) => /cormorant/.test(e)));
  assert.ok(r.alertes.some((a) => /références/.test(a)));
});


test('socle : absent, incomplet, ou une seule page sans raison', () => {
  const sansSocle = bon.replace(/## Socle\n[^\n]*\n\n/, '');
  assert.ok(analyserContrat({ contrat: sansSocle, ...ctx }).echecs.some((e) => /Socle/.test(e)));
  const incomplet = bon.replace(' · Ancienneté : depuis 2011', '');
  assert.ok(analyserContrat({ contrat: incomplet, ...ctx }).echecs.some((e) => /anciennete/.test(e)));
  assert.ok(analyserContrat({ contrat: bon, ...ctx, config: 'servicePages: false,' }).echecs.some((e) => /servicePages/.test(e)));
  const justifie = bon.replace('Pages : une par service', 'Pages : absent : une seule page, le brief demande un site minimal');
  assert.equal(analyserContrat({ contrat: justifie, ...ctx, config: 'servicePages: false,' }).echecs.length, 0);
  assert.equal(analyserContrat({ contrat: bon, ...ctx, config: 'direction: x,' }).echecs.length, 0);
});

// Test reel du 17 oct 2026 (macon, menuisier) : `servicePages: false` parce que le site fournit ses propres
// pages dans sites/<slug>/pages/. Le socle « plusieurs pages » est tenu : accepte des deux pages .astro.
test('socle : servicePages: false accepte quand le site a au moins deux pages sur mesure dans pages/', async () => {
  const fs = await import('node:fs');
  const os = await import('node:os');
  const path = await import('node:path');
  const { sitePages } = await import('../scripts/astro-site-pages-integration.mjs');
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'ff-contrat-pages-'));
  try {
    const pages = path.join(root, 'sites', 'x', 'pages');
    fs.mkdirSync(path.join(pages, 'services'), { recursive: true });
    fs.writeFileSync(path.join(pages, 'carrelage.astro'), '---\n---\n');
    const une = sitePages(root, 'x').length;
    assert.equal(une, 1);
    assert.ok(analyserContrat({ contrat: bon, ...ctx, config: 'servicePages: false,', pagesSurMesure: une }).echecs.some((e) => /servicePages/.test(e)), 'une seule page sur mesure ne tient pas le socle');
    fs.writeFileSync(path.join(pages, 'services', 'facades.astro'), '---\n---\n');
    fs.writeFileSync(path.join(pages, 'notes.md'), 'pas une page');
    const deux = sitePages(root, 'x').length;
    assert.equal(deux, 2, 'deux .astro (sous-dossier compris), le .md ne compte pas');
    assert.equal(analyserContrat({ contrat: bon, ...ctx, config: 'servicePages: false,', pagesSurMesure: deux }).echecs.length, 0);
  } finally {
    fs.rmSync(root, { recursive: true, force: true });
  }
});
