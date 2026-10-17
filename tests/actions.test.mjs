// Portes d'action par intention (src/lib/actions.ts, module pur re-exporte par src/lib/site.ts) :
// ordre fixe Réserver > Commander > Bon cadeau > Appeler > Devis, rien de deviné (pas d'URL = pas de
// porte), libellés surchargeables par wording.actions, « Devis » seulement s'il existe une porte
// #contact (tiroir ou section contact). Schéma : contact.bookingUrl/orderUrl/giftCardUrl optionnels,
// layout.actionBar défaut false (ignoré par Base.astro avec nav 'dock').
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { loadActionsModule, loadSchemaModule, loadSiteConfigModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const tsImportable = await canImportTs();
after(() => cleanTmp());

const base = {
  contact: { phone: '+33600000000' },
  layout: { contactDrawer: false, sections: [{ type: 'services' }, { type: 'contact' }] },
  wording: { devis: 'Demander un devis' },
};

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('actions : sans URL, Appeler puis Devis (section contact), dans cet ordre', async () => {
    const { actions } = await loadActionsModule();
    const out = actions(base);
    assert.deepEqual(out.map((a) => a.kind), ['call', 'quote']);
    assert.equal(out[1].href, '/#contact');
    assert.equal(out[1].label, 'Demander un devis');
    assert.equal(out[0].href, 'tel:+33600000000');
    assert.equal(out[0].label, 'Appeler');
    assert.ok(out.every((a) => a.external === false));
  });

  test('actions : ordre Réserver > Commander > Bon cadeau > Appeler > Devis, liens sortants marqués', async () => {
    const { actions } = await loadActionsModule();
    const out = actions({
      ...base,
      contact: { ...base.contact, giftCardUrl: 'https://x.fr/bon', orderUrl: 'https://x.fr/commander', bookingUrl: 'https://x.fr/reserver' },
    });
    assert.deepEqual(out.map((a) => a.kind), ['booking', 'order', 'giftCard', 'call', 'quote']);
    assert.deepEqual(out.map((a) => a.label), ['Réserver', 'Commander', 'Bon cadeau', 'Appeler', 'Demander un devis']);
    assert.deepEqual(out.slice(0, 3).map((a) => a.external), [true, true, true]);
    assert.equal(out[1].href, 'https://x.fr/commander');
  });

  test('actions : une URL absente = pas de porte (rien de deviné)', async () => {
    const { actions } = await loadActionsModule();
    const out = actions({ ...base, contact: { ...base.contact, orderUrl: 'https://x.fr/commander' } });
    assert.deepEqual(out.map((a) => a.kind), ['order', 'call', 'quote']);
  });

  test('actions : Devis seulement avec un tiroir ou une section contact ; Appeler toujours là', async () => {
    const { actions, hasContactDoor } = await loadActionsModule();
    const sans = { ...base, layout: { contactDrawer: false, sections: [{ type: 'services' }] } };
    assert.deepEqual(actions(sans).map((a) => a.kind), ['call']);
    assert.equal(hasContactDoor(sans), false);
    const tiroir = { ...base, layout: { contactDrawer: true, sections: [] } };
    assert.deepEqual(actions(tiroir).map((a) => a.kind), ['call', 'quote']);
    assert.equal(hasContactDoor(tiroir), true);
  });

  test('actions : libellés surchargés par wording.actions, devis par wording.devis', async () => {
    const { actions } = await loadActionsModule();
    const out = actions({
      ...base,
      contact: { ...base.contact, bookingUrl: 'https://x.fr/r', giftCardUrl: 'https://x.fr/g' },
      wording: { devis: 'Prendre rendez-vous', actions: { booking: 'Réserver une table', giftCard: 'Offrir', quote: 'Nous écrire' } },
    });
    assert.deepEqual(out.map((a) => a.label), ['Réserver une table', 'Offrir', 'Appeler', 'Nous écrire']);
    const sansQuote = actions({ ...base, wording: { devis: 'Prendre rendez-vous', actions: {} } });
    assert.equal(sansQuote[1].label, 'Prendre rendez-vous');
  });

  test('actions : chaque porte a une icône lucide (dock, barre d’actions)', async () => {
    const { actions, ACTION_ICONS } = await loadActionsModule();
    for (const a of actions({ ...base, contact: { ...base.contact, bookingUrl: 'https://x.fr/r' } })) {
      assert.equal(a.icon, ACTION_ICONS[a.kind]);
      assert.match(a.icon, /^[A-Z][A-Za-z]+$/);
    }
  });

  test('schema : bookingUrl/orderUrl/giftCardUrl optionnels, URL valide exigée, absents par défaut', async () => {
    const { defineSite } = await loadSchemaModule();
    const minimal = {
      slug: 'test',
      direction: 'atelier',
      business: { name: 'X', trade: 'Y', tagline: 'Z', description: 'D' },
      contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
      services: [{ slug: 's', title: 'T', short: 'S' }],
      about: { story: 'S' },
    };
    const d = defineSite(minimal);
    assert.equal(d.contact.bookingUrl, undefined);
    assert.equal(d.contact.orderUrl, undefined);
    assert.equal(d.contact.giftCardUrl, undefined);
    assert.equal(d.layout.actionBar, false);
    assert.deepEqual(d.wording.actions, {});
    assert.equal(defineSite({ ...minimal, contact: { ...minimal.contact, orderUrl: 'https://x.fr/c' } }).contact.orderUrl, 'https://x.fr/c');
    assert.throws(() => defineSite({ ...minimal, contact: { ...minimal.contact, bookingUrl: 'reserver' } }), /bookingUrl/);
    assert.equal(defineSite({ ...minimal, layout: { actionBar: true } }).layout.actionBar, true);
    // nav 'dock' + actionBar : accepte par le schema (un look dock doit rester applicable), ignore par Base.astro.
    assert.equal(defineSite({ ...minimal, layout: { nav: 'dock', actionBar: true } }).layout.actionBar, true);
  });

  test('sites/_exemple exerce les portes : bookingUrl + giftCardUrl, libellé surchargé', async () => {
    const { actions } = await loadActionsModule();
    const mod = await loadSiteConfigModule('_exemple');
    const out = actions(mod.default);
    assert.deepEqual(out.map((a) => a.kind), ['booking', 'giftCard', 'call', 'quote']);
    assert.equal(out[0].label, 'Prendre rendez-vous');
  });
}

test('schema (source) : les trois URLs et actionBar ont un .describe() qui dit « jamais deviné » / safe-area', () => {
  const src = read('src/lib/schema.ts');
  for (const k of ['bookingUrl', 'orderUrl', 'giftCardUrl']) {
    const m = src.match(new RegExp(`${k}:[\\s\\S]*?\\.describe\\(\\s*"([^"]+)"`));
    assert.ok(m, `${k} sans .describe()`);
    assert.match(m[1], /jamais deviné/i, `${k} : le describe doit rappeler « jamais deviné »`);
  }
  const bar = src.match(/actionBar:[\s\S]*?\.describe\(\s*"([^"]+)"/);
  assert.ok(bar, 'actionBar sans .describe()');
  assert.match(bar[1], /safe-area/);
});

test('les six navs lisent actions() et rendent la première porte ; plus de bouton téléphone codé en dur', () => {
  for (const v of ['bar', 'minimal', 'split', 'floating', 'burger', 'dock']) {
    const src = read(`src/sections/Nav/${v}.astro`);
    assert.match(src, /actions\(\)/, `${v} : doit appeler actions()`);
    assert.match(src, /premiere/, `${v} : doit rendre la première porte`);
    assert.doesNotMatch(src, /href=\{tel\(\)\}/, `${v} : le téléphone passe par actions(), pas par tel()`);
    assert.doesNotMatch(src, /rounded-pill|999px/, `${v} : pas de pilule`);
  }
  // bar/split/floating : 2e porte en contour, cachée sous md.
  for (const v of ['bar', 'split', 'minimal']) {
    assert.match(read(`src/sections/Nav/${v}.astro`), /seconde && <span class="hidden md:inline-flex"><Porte action=\{seconde\} size="sm" variant="ghost" \/><\/span>/, `${v} : 2e porte contour, ordinateur seulement`);
  }
});
