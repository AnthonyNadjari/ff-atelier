// Tests du schema zod (src/lib/schema.ts) : defineSite, VARIANTS, DIRECTIONS, defauts.
// Import direct du .ts (Node 22 type-strips), copie temporaire pour corriger les specifiers
// relatifs/alias que la resolution ESM standard n'accepte pas telle quelle. Voir scripts/ff/ts-loader.mjs.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadSchemaModule, loadSiteConfigModule, loadSchemaTypeModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

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

  // B2/B4 (docs/veille/SYNTHESE.md) : business.schemaType (deduit du metier, jamais invente) et
  // contact.mapsProvider/coordinates (carte sans traceur par defaut).
  test('business.schemaType est absent par defaut ; contact.mapsProvider vaut "osm" par defaut', async () => {
    const { defineSite } = await loadSchemaModule();
    const site = defineSite({
      slug: 'test-defauts-b2b4',
      direction: 'atelier',
      business: { name: 'X', trade: 'Plombier', tagline: 'Z', description: 'D' },
      contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
      services: [{ slug: 's', title: 'T', short: 'S' }],
      about: { story: 'S' },
    });
    assert.equal(site.business.schemaType, undefined);
    assert.equal(site.contact.mapsProvider, 'osm');
    assert.equal(site.contact.coordinates, undefined);
  });

  test('business.schemaType et contact.mapsProvider/coordinates acceptent une valeur explicite', async () => {
    const { defineSite } = await loadSchemaModule();
    const site = defineSite({
      slug: 'test-explicite-b2b4',
      direction: 'atelier',
      business: { name: 'X', trade: 'Plombier', tagline: 'Z', description: 'D', schemaType: 'Plumber' },
      contact: {
        phone: '+33600000000',
        phoneDisplay: '06 00 00 00 00',
        email: 'a@b.fr',
        address: { postalCode: '59000', city: 'Lille' },
        mapsProvider: 'google',
        coordinates: { lat: 48.8566, lng: 2.3522 },
      },
      services: [{ slug: 's', title: 'T', short: 'S' }],
      about: { story: 'S' },
    });
    assert.equal(site.business.schemaType, 'Plumber');
    assert.equal(site.contact.mapsProvider, 'google');
    assert.deepEqual(site.contact.coordinates, { lat: 48.8566, lng: 2.3522 });
  });

  test('defineSite rejette une valeur de contact.mapsProvider inconnue', async () => {
    const { defineSite } = await loadSchemaModule();
    assert.throws(() => {
      defineSite({
        slug: 'test-mapsprovider-invalide',
        direction: 'atelier',
        business: { name: 'X', trade: 'Y', tagline: 'Z', description: 'D' },
        contact: {
          phone: '+33600000000',
          phoneDisplay: '06 00 00 00 00',
          email: 'a@b.fr',
          address: { postalCode: '59000', city: 'Lille' },
          mapsProvider: 'bing',
        },
        services: [{ slug: 's', title: 'T', short: 'S' }],
        about: { story: 'S' },
      });
    });
  });

  test('schemaTypeForTrade deduit un sous-type schema.org precis pour les metiers connus, repli LocalBusiness sinon', async () => {
    const { schemaTypeForTrade } = await loadSchemaTypeModule();
    assert.equal(schemaTypeForTrade('Plombier-chauffagiste'), 'Plumber');
    assert.equal(schemaTypeForTrade('Électricien'), 'Electrician');
    assert.equal(schemaTypeForTrade('Couvreur-zingueur'), 'RoofingContractor');
    assert.equal(schemaTypeForTrade('Coiffeur-coloriste'), 'HairSalon');
    assert.equal(schemaTypeForTrade('Restaurant de poissons et bouillabaisse'), 'Restaurant');
    assert.equal(schemaTypeForTrade('Boulanger-pâtissier'), 'Bakery');
    assert.equal(schemaTypeForTrade('Garage indépendant, toutes marques'), 'AutoRepair');
    assert.equal(schemaTypeForTrade('Avocat en droit des affaires'), 'LegalService');
    assert.equal(schemaTypeForTrade('Dentiste'), 'Dentist');
    assert.equal(schemaTypeForTrade('Vétérinaire'), 'VeterinaryCare');
    assert.equal(schemaTypeForTrade('Ostéopathe D.O.'), 'MedicalBusiness');
    assert.equal(schemaTypeForTrade('Photographe de mariage et de famille'), 'ProfessionalService');
    assert.equal(schemaTypeForTrade('Paysagiste'), 'HomeAndConstructionBusiness');
    assert.equal(schemaTypeForTrade('Menuisier-ébéniste'), 'HomeAndConstructionBusiness');
    assert.equal(schemaTypeForTrade('Ferronnerie d’art'), 'HomeAndConstructionBusiness');
    assert.equal(schemaTypeForTrade('Architecte d’intérieur'), 'ProfessionalService');
    assert.equal(schemaTypeForTrade('Fleuriste'), 'Florist');
    assert.equal(schemaTypeForTrade('Chambres d’hôtes'), 'BedAndBreakfast');
    assert.equal(schemaTypeForTrade('Auto-école'), 'EducationalOrganization');
    assert.equal(schemaTypeForTrade('Studio de tatouage'), 'TattooParlor');
    assert.equal(schemaTypeForTrade('Coach sportif'), 'HealthClub');
    assert.equal(schemaTypeForTrade('Traiteur'), 'FoodEstablishment');
    assert.equal(schemaTypeForTrade('Brasserie artisanale'), 'Brewery');
    assert.equal(schemaTypeForTrade('Agence immobilière de quartier'), 'RealEstateAgent');
    assert.equal(schemaTypeForTrade('Maçon'), 'GeneralContractor');
    assert.equal(schemaTypeForTrade('Dépannage informatique et réseau'), 'ProfessionalService');
    assert.equal(schemaTypeForTrade('Studio digital — sites vitrines pour artisans et indépendants'), 'LocalBusiness');
  });
}
