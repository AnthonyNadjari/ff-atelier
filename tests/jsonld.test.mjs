// Tests de src/lib/jsonld.ts (module pur) : jours schema.org, horaires structurés, FAQPage, Service.
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import { loadJsonLdModule, loadSiteConfigModule, cleanTmp, canImportTs } from '../scripts/ff/ts-loader.mjs';

const tsImportable = await canImportTs();

after(() => cleanTmp());

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('daysOfWeek : plage "Lundi – vendredi" étendue aux 5 jours', async () => {
    const { daysOfWeek } = await loadJsonLdModule();
    assert.deepEqual(daysOfWeek('Lundi – vendredi'), [
      'https://schema.org/Monday',
      'https://schema.org/Tuesday',
      'https://schema.org/Wednesday',
      'https://schema.org/Thursday',
      'https://schema.org/Friday',
    ]);
  });

  test('daysOfWeek : jour seul, liste explicite, tiret simple, casse/accents ignorés', async () => {
    const { daysOfWeek } = await loadJsonLdModule();
    assert.deepEqual(daysOfWeek('Samedi'), ['https://schema.org/Saturday']);
    assert.deepEqual(daysOfWeek('Mardi, jeudi'), ['https://schema.org/Tuesday', 'https://schema.org/Thursday']);
    assert.deepEqual(daysOfWeek('lundi - mercredi'), [
      'https://schema.org/Monday',
      'https://schema.org/Tuesday',
      'https://schema.org/Wednesday',
    ]);
    assert.equal(daysOfWeek('Tous les jours'), undefined);
  });

  test('openingHoursSpecification : émis seulement avec opens+closes et jours reconnus', async () => {
    const { openingHoursSpecification } = await loadJsonLdModule();
    assert.equal(openingHoursSpecification([{ days: 'Lundi', hours: '8h – 18h' }]), undefined);
    assert.equal(openingHoursSpecification([{ days: 'Tous les jours', hours: '8h – 18h', opens: '08:00', closes: '18:00' }]), undefined);
    assert.deepEqual(
      openingHoursSpecification([
        { days: 'Lundi – vendredi', hours: '8h – 18h', opens: '08:00', closes: '18:00' },
        { days: 'Samedi', hours: 'Sur rendez-vous' },
      ]),
      [
        {
          '@type': 'OpeningHoursSpecification',
          dayOfWeek: [
            'https://schema.org/Monday',
            'https://schema.org/Tuesday',
            'https://schema.org/Wednesday',
            'https://schema.org/Thursday',
            'https://schema.org/Friday',
          ],
          opens: '08:00',
          closes: '18:00',
        },
      ],
    );
  });

  test('faqPageLd : une Question par entrée, undefined si FAQ vide', async () => {
    const { faqPageLd } = await loadJsonLdModule();
    assert.equal(faqPageLd([]), undefined);
    const ld = faqPageLd([
      { q: 'Q1 ?', a: 'R1' },
      { q: 'Q2 ?', a: 'R2\n\nsuite' },
    ]);
    assert.equal(ld['@type'], 'FAQPage');
    assert.equal(ld.mainEntity.length, 2);
    assert.equal(ld.mainEntity[0]['@type'], 'Question');
    assert.equal(ld.mainEntity[1].acceptedAnswer.text, 'R2\n\nsuite');
  });

  test('serviceLd : provider typé, villes desservies, prix seulement si affiché', async () => {
    const { serviceLd } = await loadJsonLdModule();
    const { default: site } = await loadSiteConfigModule('_exemple');
    const service = site.services[0];
    const ld = serviceLd(site, service, 'https://exemple.fr/services/' + service.slug);
    assert.equal(ld['@type'], 'Service');
    assert.equal(ld.provider.name, site.business.name);
    assert.equal(ld.url, 'https://exemple.fr/services/' + service.slug);
    assert.ok(Array.isArray(ld.areaServed));
    const sansPrix = serviceLd(site, { ...service, priceFrom: undefined }, 'https://exemple.fr/x');
    assert.equal('offers' in sansPrix, false);
    const avecPrix = serviceLd(site, { ...service, priceFrom: 'à partir de 90 €' }, 'https://exemple.fr/x');
    assert.equal(avecPrix.offers['@type'], 'Offer');
  });
}
