// Horaires par jour (src/lib/horaires.ts, module pur) : lecture des jours libres, semaine complète
// lundi → dimanche, typographie française (« 9 h 30 », « 14 h – 19 h » insécables), état du moment
// calculé en Europe/Paris sur des dates fixes (minuit, jour fermé, deux créneaux, sans opens/closes).
// Et le composant src/components/Horaires.astro : rendu sans JS, script via onPage, pas de couleur en dur.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadHorairesModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const tsImportable = await canImportTs();
after(() => cleanTmp());

const NBSP = ' ';
// Semaine type : deux créneaux en semaine, samedi matin, dimanche non listé (= fermé).
const HOURS = [
  { days: 'Lundi – vendredi', hours: '8 h – 12 h', opens: '08:00', closes: '12:00' },
  { days: 'Lundi – vendredi', hours: '14 h – 19 h', opens: '14:00', closes: '19:00' },
  { days: 'Samedi', hours: '9 h – 12 h 30', opens: '09:00', closes: '12:30' },
];
// Octobre 2026 avant le 25 : Europe/Paris = UTC+2. 2026-10-14 est un mercredi.
const paris = (iso) => new Date(iso);

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('joursDe : plage, liste, jour seul, « du … au … », tous les jours, illisible', async () => {
    const { joursDe } = await loadHorairesModule();
    assert.deepEqual(joursDe('Lundi – vendredi'), [0, 1, 2, 3, 4]);
    assert.deepEqual(joursDe('lundi - jeudi'), [0, 1, 2, 3]);
    assert.deepEqual(joursDe('Du mardi au samedi'), [1, 2, 3, 4, 5]);
    assert.deepEqual(joursDe('Mardi, jeudi'), [1, 3]);
    assert.deepEqual(joursDe('Samedi'), [5]);
    assert.deepEqual(joursDe('Dimanche'), [6]);
    assert.deepEqual(joursDe('Tous les jours'), [0, 1, 2, 3, 4, 5, 6]);
    assert.deepEqual(joursDe('Vendredi – lundi'), [4, 5, 6, 0], 'une plage qui franchit le dimanche');
    assert.equal(joursDe('Sur rendez-vous'), undefined);
  });

  test('joursDe (17 oct 2026, fromagerie-ravanel-d) : « à », « au », « du … au … », tirets, abréviations, listes avec « et »', async () => {
    const { joursDe } = await loadHorairesModule();
    const MAR_VEN = [1, 2, 3, 4];
    assert.deepEqual(joursDe('Mardi à vendredi'), MAR_VEN, '« à » entre deux jours = plage (mercredi et jeudi étaient « Fermé »)');
    assert.deepEqual(joursDe('mardi a vendredi'), MAR_VEN, 'sans accent');
    assert.deepEqual(joursDe('Lundi au vendredi'), [0, 1, 2, 3, 4]);
    assert.deepEqual(joursDe('Du mardi au vendredi'), MAR_VEN);
    assert.deepEqual(joursDe('De lundi à jeudi'), [0, 1, 2, 3]);
    assert.deepEqual(joursDe('Du lundi jusqu’au jeudi'), [0, 1, 2, 3]);
    assert.deepEqual(joursDe('Mar-Ven'), MAR_VEN, 'abréviations et trait d’union collé');
    assert.deepEqual(joursDe('Lun–Sam'), [0, 1, 2, 3, 4, 5], 'demi-cadratin collé');
    assert.deepEqual(joursDe('Lun. – Sam.'), [0, 1, 2, 3, 4, 5], 'abréviations avec point');
    assert.deepEqual(joursDe('mer, ven'), [2, 4]);
    assert.deepEqual(joursDe(`Lundi${NBSP}–${NBSP}vendredi`), [0, 1, 2, 3, 4], 'insécables autour du tiret');
    assert.deepEqual(joursDe('Lundi, mercredi et vendredi'), [0, 2, 4], 'liste avec « et »');
    assert.deepEqual(joursDe('Mardi à vendredi et samedi'), [1, 2, 3, 4, 5]);
    assert.deepEqual(joursDe('Les samedis'), [5]);
    assert.deepEqual(joursDe('7j/7'), [0, 1, 2, 3, 4, 5, 6]);
    assert.deepEqual(joursDe('Tous les jours sauf le lundi'), [1, 2, 3, 4, 5, 6]);
    assert.deepEqual(joursDe('Du lundi au samedi sauf mercredi'), [0, 1, 3, 4, 5]);
  });

  test('joursDe : lecture stricte, un mot inconnu = undefined (jamais un jour deviné)', async () => {
    const { joursDe } = await loadHorairesModule();
    for (const d of ['Samedi matin', 'Dimanche et jours fériés', 'Urgences', 'Avril – octobre', 'Mars', 'Mardi au', 'à vendredi', 'Lundi – – vendredi', 'Tous les jours de 8 h à 20 h', '']) {
      assert.equal(joursDe(d), undefined, `« ${d} » ne doit pas se lire`);
    }
  });

  test('semaine : « Mardi à vendredi » couvre mercredi et jeudi ; une ligne illisible = undefined, donc liste brute et aucun « Fermé »', async () => {
    const { semaine } = await loadHorairesModule();
    for (const days of ['Mardi à vendredi', 'Lundi au vendredi', 'Du mardi au vendredi', 'Mar-Ven', 'Lun–Sam']) {
      const sem = semaine([{ days, hours: '9 h à 18 h', opens: '09:00', closes: '18:00' }]);
      assert.equal(sem[2].libelle, '9 h à 18 h', `${days} : mercredi lu`);
      assert.equal(sem[3].libelle, '9 h à 18 h', `${days} : jeudi lu`);
      assert.equal(sem[2].ferme, false);
    }
    const lu = semaine([{ days: 'Lundi, mercredi et vendredi', hours: '9 h à 12 h' }]);
    assert.deepEqual(lu.map((j) => j.ferme), [false, true, false, true, false, true, true]);
    assert.equal(semaine([{ days: 'Mardi à vendredi', hours: '9 h à 18 h' }, { days: 'Samedi matin', hours: '9 h à 12 h' }]), undefined, 'une seule ligne illisible suffit');
  });

  test('ligneDuJour : toutes les lignes du jour (matin et après-midi), jour fermé, typographie', async () => {
    const { semaine, ligneDuJour } = await loadHorairesModule();
    const sem = semaine([
      { days: 'Du mardi au vendredi', hours: '8 h 30 à 12 h 30', opens: '08:30', closes: '12:30' },
      { days: 'Du mardi au vendredi', hours: '15 h 30 à 19 h', opens: '15:30', closes: '19:00' },
      { days: 'Samedi', hours: '8 h à 13 h' },
      { days: 'Lundi', hours: 'Fermé' },
    ]);
    assert.equal(ligneDuJour(sem, 1), `Aujourd’hui mardi${NBSP}: 8 h 30 à 12 h 30 et 15 h 30 à 19 h`);
    assert.equal(ligneDuJour(sem, 3), `Aujourd’hui jeudi${NBSP}: 8 h 30 à 12 h 30 et 15 h 30 à 19 h`, 'jeudi, jour intermédiaire de la plage');
    assert.equal(ligneDuJour(sem, 5), `Aujourd’hui samedi${NBSP}: 8 h à 13 h`);
    assert.equal(ligneDuJour(sem, 0), `Aujourd’hui lundi${NBSP}: fermé`);
    assert.equal(ligneDuJour(sem, 6), `Aujourd’hui dimanche${NBSP}: fermé`, 'jour non listé');
    assert.equal(ligneDuJour(sem, 9), undefined);
    assert.doesNotMatch(ligneDuJour(sem, 1), /—/);
  });

  test('regrouperLignes : toutes les lignes, regroupées par jours identiques, sans lire les jours', async () => {
    const { regrouperLignes } = await loadHorairesModule();
    assert.deepEqual(
      regrouperLignes([
        { days: 'Du mardi au vendredi', hours: '8 h 30 à 12 h 30' },
        { days: 'Du mardi au vendredi', hours: '15 h 30 à 19 h' },
        { days: 'Samedi', hours: '8 h à 13 h' },
        { days: 'Samedi', hours: '15 h à 19 h' },
        { days: 'Sur rendez-vous', hours: 'le soir' },
        { days: 'Samedi', hours: '18 h à 20 h' },
      ]),
      [
        { days: 'Du mardi au vendredi', hours: '8 h 30 à 12 h 30 et 15 h 30 à 19 h' },
        { days: 'Samedi', hours: '8 h à 13 h, 15 h à 19 h et 18 h à 20 h' },
        { days: 'Sur rendez-vous', hours: 'le soir' },
      ],
    );
    assert.deepEqual(regrouperLignes([]), []);
  });

  test('semaine : 7 jours lundi → dimanche, deux créneaux fusionnés, jour non listé = Fermé', async () => {
    const { semaine, JOURS } = await loadHorairesModule();
    const sem = semaine(HOURS);
    assert.equal(sem.length, 7);
    assert.deepEqual(sem.map((j) => j.jour), [...JOURS]);
    assert.equal(sem[0].libelle, '8 h – 12 h, 14 h – 19 h');
    assert.deepEqual(sem[0].creneaux, [{ opens: '08:00', closes: '12:00' }, { opens: '14:00', closes: '19:00' }]);
    assert.equal(sem[5].libelle, '9 h – 12 h 30');
    assert.equal(sem[6].libelle, 'Fermé');
    assert.equal(sem[6].ferme, true);
    assert.deepEqual(sem[6].creneaux, []);
    assert.equal(sem[0].ferme, false);
  });

  test('semaine : « Fermé » explicite reconnu, ligne illisible = undefined (rendu brut), vide = undefined', async () => {
    const { semaine } = await loadHorairesModule();
    const sem = semaine([{ days: 'Lundi – vendredi', hours: '9 h – 18 h', opens: '09:00', closes: '18:00' }, { days: 'Samedi', hours: 'Fermé' }]);
    assert.equal(sem[5].ferme, true);
    assert.equal(sem[5].libelle, 'Fermé');
    assert.equal(semaine([{ days: 'Lundi – vendredi', hours: '9 h – 18 h' }, { days: 'Sur rendez-vous', hours: 'le soir' }]), undefined);
    assert.equal(semaine([]), undefined);
  });

  test('formatHeure / formatPlage : « 9 h 30 », « 18 h », « 14 h – 19 h » avec insécables et demi-cadratin', async () => {
    const { formatHeure, formatPlage } = await loadHorairesModule();
    assert.equal(formatHeure('09:30'), `9${NBSP}h${NBSP}30`);
    assert.equal(formatHeure('18:00'), `18${NBSP}h`);
    assert.equal(formatHeure('08:05'), `8${NBSP}h${NBSP}05`);
    assert.equal(formatPlage('14:00', '19:00'), `14${NBSP}h${NBSP}–${NBSP}19${NBSP}h`);
    assert.doesNotMatch(formatPlage('09:30', '12:00'), / /, 'aucune espace sécable dans une plage horaire');
    assert.doesNotMatch(formatPlage('09:30', '12:00'), /—/, 'jamais de tiret cadratin');
  });

  test('maintenant : jour et minutes en Europe/Paris (UTC+2 en octobre, UTC+1 en janvier)', async () => {
    const { maintenant } = await loadHorairesModule();
    assert.deepEqual(maintenant(paris('2026-10-14T07:30:00Z')), { jour: 2, minutes: 9 * 60 + 30 });
    assert.deepEqual(maintenant(paris('2026-10-13T22:00:00Z')), { jour: 2, minutes: 0 }, 'minuit à Paris = mercredi 00:00, pas mardi');
    assert.deepEqual(maintenant(paris('2027-01-10T23:30:00Z')), { jour: 0, minutes: 30 }, 'dimanche 23 h 30 UTC = lundi 00 h 30 à Paris en hiver');
    assert.deepEqual(maintenant(paris('2026-10-14T07:30:00Z'), 'UTC'), { jour: 2, minutes: 7 * 60 + 30 });
  });

  test('etatDuJour : deux créneaux — Ouvert, Ouvre à 14 h entre midi et deux, Fermé le soir', async () => {
    const { semaine, etatDuJour } = await loadHorairesModule();
    const sem = semaine(HOURS);
    assert.deepEqual(etatDuJour(sem, paris('2026-10-14T07:30:00Z')), { jour: 2, ouvert: true, texte: 'Ouvert' }); // mer. 9 h 30
    assert.deepEqual(etatDuJour(sem, paris('2026-10-14T11:00:00Z')), { jour: 2, ouvert: false, texte: `Ouvre à 14${NBSP}h` }); // mer. 13 h
    assert.deepEqual(etatDuJour(sem, paris('2026-10-14T16:59:00Z')), { jour: 2, ouvert: true, texte: 'Ouvert' }); // mer. 18 h 59
    assert.deepEqual(etatDuJour(sem, paris('2026-10-14T17:00:00Z')), { jour: 2, ouvert: false, texte: 'Fermé' }); // mer. 19 h pile
    assert.deepEqual(etatDuJour(sem, paris('2026-10-14T05:00:00Z')), { jour: 2, ouvert: false, texte: `Ouvre à 8${NBSP}h` }); // mer. 7 h
  });

  test('etatDuJour : minuit = Ouvre à 8 h, jour fermé (dimanche) = Fermé, samedi 12 h 30 pile = Fermé', async () => {
    const { semaine, etatDuJour } = await loadHorairesModule();
    const sem = semaine(HOURS);
    assert.deepEqual(etatDuJour(sem, paris('2026-10-13T22:00:00Z')), { jour: 2, ouvert: false, texte: `Ouvre à 8${NBSP}h` }); // mer. 00:00
    assert.deepEqual(etatDuJour(sem, paris('2026-10-18T09:00:00Z')), { jour: 6, ouvert: false, texte: 'Fermé' }); // dim. 11 h
    assert.deepEqual(etatDuJour(sem, paris('2026-10-17T08:00:00Z')), { jour: 5, ouvert: true, texte: 'Ouvert' }); // sam. 10 h
    assert.deepEqual(etatDuJour(sem, paris('2026-10-17T10:30:00Z')), { jour: 5, ouvert: false, texte: 'Fermé' }); // sam. 12 h 30
  });

  test('etatDuJour : horaires sans opens/closes (« Sur rendez-vous ») = pas d’état ; créneau qui franchit minuit', async () => {
    const { semaine, etatDuJour } = await loadHorairesModule();
    const rdv = semaine([{ days: 'Lundi – vendredi', hours: 'Sur rendez-vous' }]);
    assert.deepEqual(etatDuJour(rdv, paris('2026-10-14T07:30:00Z')), { jour: 2, ouvert: false });
    assert.deepEqual(etatDuJour(rdv, paris('2026-10-18T07:30:00Z')), { jour: 6, ouvert: false, texte: 'Fermé' }, 'dimanche non listé reste Fermé');
    const bar = semaine([{ days: 'Vendredi, samedi', hours: '18 h – 2 h', opens: '18:00', closes: '02:00' }]);
    assert.deepEqual(etatDuJour(bar, paris('2026-10-16T21:30:00Z')), { jour: 4, ouvert: true, texte: 'Ouvert' }); // ven. 23 h 30
    assert.deepEqual(etatDuJour(bar, paris('2026-10-16T10:00:00Z')), { jour: 4, ouvert: false, texte: `Ouvre à 18${NBSP}h` });
  });
}

test('Horaires.astro : lit contact.hours via semaine(), repli brut, script onPage + etatDuJour, pas de couleur en dur, pas d’horloge', () => {
  const src = read('src/components/Horaires.astro');
  assert.match(src, /import \{ semaine \} from '@\/lib\/horaires'/);
  assert.match(src, /site\.contact\.hours/);
  assert.match(src, /data-horaires=\{data\}/);
  assert.match(src, /<p class="horaires-etat" data-etat hidden><\/p>/, 'état caché par défaut (sans JS : la liste seule)');
  assert.match(src, /\{lignes\.length > 0 && !sem && \(/, 'repli : liste brute quand les jours ne se lisent pas');
  assert.match(src, /onPage\(/);
  assert.match(src, /etatDuJour\(/);
  assert.doesNotMatch(src, /toLocaleTimeString|Heure locale|Il est /, 'aucune horloge visible (docs/GOUT.md § 5)');
  const style = src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
  assert.doesNotMatch(style, /#[0-9a-fA-F]{3,8}\b|color:|font-family/, 'tokens uniquement, aucune couleur en dur');
  assert.doesNotMatch(src, /—/, 'jamais de tiret cadratin dans un texte visible');
});

test('Coquille split : plus de numéros devant les liens, horaires = toutes les lignes sans script puis la journée complète (plus de hours[0])', () => {
  const src = read('src/shells/split.astro');
  assert.doesNotMatch(src, /String\(i \+ 1\)/, 'numérotation décorative du sommaire (docs/GOUT.md § 2)');
  assert.doesNotMatch(src, /contact\.hours\[0\]/, 'la première ligne seule ne suffit pas (matin sans après-midi)');
  assert.match(src, /regrouperLignes\(site\.contact\.hours\)/, 'sans script : toutes les lignes');
  assert.match(src, /semaine\(site\.contact\.hours\)/, 'la journée passe par la fonction pure');
  assert.match(src, /ligneDuJour\(/);
  assert.match(src, /maintenant\(new Date\(\)\)/);
  assert.match(src, /onPage\(\(\) =>/);
  assert.match(src, /<p data-split-jour hidden><\/p>/, 'ligne du jour cachée sans script');
});

test('Coquille index : plus de numéros devant les entrées (numérotation décorative)', () => {
  const src = read('src/shells/index.astro');
  assert.doesNotMatch(src, /index-num|String\(i \+ 1\)/);
});

test('Les quatre Contact/* et les Footer columns/big-name rendent <Horaires /> ; plus de dl maison sur contact.hours', () => {
  for (const f of ['Contact/form-split', 'Contact/form-card', 'Contact/simple', 'Contact/full', 'Footer/columns', 'Footer/big-name']) {
    const src = read(`src/sections/${f}.astro`);
    assert.match(src, /<Horaires\b/, `${f} : doit rendre <Horaires />`);
    assert.doesNotMatch(src, /site\.contact\.hours\.map/, `${f} : le rendu des horaires passe par Horaires.astro`);
  }
});
