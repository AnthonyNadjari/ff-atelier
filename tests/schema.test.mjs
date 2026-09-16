// Tests du schema zod (src/lib/schema.ts) : defineSite, VARIANTS, DIRECTIONS, defauts.
// Import direct du .ts (Node 22 type-strips), copie temporaire pour corriger les specifiers
// relatifs/alias que la resolution ESM standard n'accepte pas telle quelle. Voir scripts/ff/ts-loader.mjs.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaModule, loadSiteConfigModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const tsImportable = await canImportTs();

after(() => cleanTmp());

if (!tsImportable) {
  // Filet de securite : si node ne sait plus type-stripper un .ts simple (flag retire, regression...),
  // on retombe sur une extraction regex du texte source plutot que de planter toute la suite.
  test('[repli regex] DIRECTIONS et VARIANTS extraits du texte source de schema.ts', () => {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'schema.ts'), 'utf8');
    const dirBlock = src.match(/export const DIRECTIONS = \[([\s\S]*?)\] as const/);
    assert.ok(dirBlock, 'bloc DIRECTIONS introuvable dans schema.ts');
    const names = [...dirBlock[1].matchAll(/'([a-z0-9-]+)'/g)].map((m) => m[1]);
    assert.ok(names.length > 0, 'aucune direction extraite');
    const variantsBlock = src.match(/export const VARIANTS = \{([\s\S]*?)\} as const/);
    assert.ok(variantsBlock, 'bloc VARIANTS introuvable dans schema.ts');
  });
} else {
  test('defineSite accepte sites/_exemple/site.config.ts', async () => {
    const mod = await loadSiteConfigModule('_exemple');
    assert.equal(mod.default.slug, '_exemple');
    assert.equal(mod.default.direction, 'atelier');
    assert.ok(Array.isArray(mod.default.services));
    assert.ok(mod.default.services.length >= 1);
  });

  test('defineSite rejette une direction inconnue', async () => {
    const { defineSite } = await loadSchemaModule();
    assert.throws(() => {
      defineSite({
        slug: 'test',
        direction: 'inexistante',
        business: { name: 'X', trade: 'Y', tagline: 'Z', description: 'D' },
        contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
        services: [{ slug: 's', title: 'T', short: 'S' }],
        about: { story: 'S' },
      });
    });
  });

  test('defineSite rejette une variante de section inconnue avec un message listant les choix', async () => {
    const { defineSite, VARIANTS } = await loadSchemaModule();
    assert.throws(
      () => {
        defineSite({
          slug: 'test',
          direction: 'atelier',
          layout: { sections: [{ type: 'services', variant: 'variante-inexistante' }] },
          business: { name: 'X', trade: 'Y', tagline: 'Z', description: 'D' },
          contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
          services: [{ slug: 's', title: 'T', short: 'S' }],
          about: { story: 'S' },
        });
      },
      (err) => {
        assert.match(err.message, /variante-inexistante/);
        for (const choice of VARIANTS.services) {
          assert.ok(err.message.includes(choice), `le message devrait lister le choix "${choice}"`);
        }
        return true;
      },
    );
  });

  // NOTE : ce test documente un defaut reel de schema.ts (pas un bug de test). Quand un groupe
  // imbrique (`layout`, `wording`, `typography`, `zones`, `proof`, `form`, `images`, `seo`, `legal`,
  // `analytics`) est completement absent de l'input, zod .default({}) substitue {} tel quel SANS
  // le faire passer par le sous-schema : les defauts internes (layout.sections, wording.devis, ...)
  // ne s'appliquent alors pas, et defineSite plante sur `for (const s of parsed.data.layout.sections)`
  // (schema.ts) car layout.sections est absent. Voir le rapport pour le detail et la piste de correction.
  test('defineSite applique les defauts (motion subtle, scale normal, layout.tone flat, wording.devis)', async () => {
    const { defineSite } = await loadSchemaModule();
    const site = defineSite({
      slug: 'test-defauts',
      direction: 'atelier',
      business: { name: 'X', trade: 'Y', tagline: 'Z', description: 'D' },
      contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
      services: [{ slug: 's', title: 'T', short: 'S' }],
      about: { story: 'S' },
    });
    assert.equal(site.motion, 'subtle');
    assert.equal(site.scale, 'normal');
    assert.equal(site.layout.tone, 'flat');
    assert.equal(site.wording.devis, 'Demander un devis');
  });
}
