// Test lent : construit la matrice complete de combinaisons (direction x nav x hero x footer x
// divider x scale x tone x chaque variante de section) via `ff matrice`. Desactive par defaut ;
// lancer avec FF_MATRICE=1 npm test (ou `node --test tests/`). Utilise la meme logique que
// `node scripts/ff.mjs matrice` (scripts/ff/matrice.mjs) : le test et la commande CLI partagent
// donc leur comportement, y compris le nettoyage des sites/dist jetables.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const FF = path.join(ROOT, 'scripts', 'ff.mjs');

test(
  'ff matrice construit toutes les combinaisons sans erreur (FF_MATRICE=1 requis)',
  { skip: process.env.FF_MATRICE !== '1', timeout: 20 * 60 * 1000 },
  () => {
    const res = spawnSync(process.execPath, [FF, 'matrice'], { cwd: ROOT, encoding: 'utf8' });
    if (res.status !== 0) {
      console.log(res.stdout);
      console.log(res.stderr);
    }
    assert.equal(res.status, 0, `\`ff matrice\` a signale des erreurs (voir la sortie ci-dessus)`);

    for (const dir of ['sites', 'dist']) {
      const leftovers = fs.existsSync(path.join(ROOT, dir))
        ? fs.readdirSync(path.join(ROOT, dir)).filter((n) => n.startsWith('_test-matrice-'))
        : [];
      assert.deepEqual(leftovers, [], `${dir}/ contient des residus _test-matrice-* non nettoyes : ${leftovers.join(', ')}`);
    }
  },
);
