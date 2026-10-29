// Lecture de site.config.ts par `ff variete` / `ff composer` (scripts/ff/look-data.mjs parseConfigParts,
// scripts/ff/ts-literal.mjs). Test reel du 17 oct 2026 : un commentaire « // l'atelier » (apostrophe droite)
// etait pris pour le debut d'une chaine et faussait la lecture des champs qui suivent.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { parseConfigParts } from '../scripts/ff/look-data.mjs';
import { stripComments, extractTopLevelValue, setTopLevelValue } from '../scripts/ff/ts-literal.mjs';

const CONFIG = `import { defineSite } from '../../src/lib/schema';
// Prospect : l'atelier de Guy, route de Rognes.
/* ancienne piste, ecartee :
  direction: 'pierre', l'avis du client */
export default defineSite({
  slug: 'x',
  business: {
    // l'atelier d'abord
    name: 'À cœur bois',
    trade: 'Menuisier', // c'est l'ébéniste
  },
  layout: {
    // l'atelier : bloc sur mesure
    nav: 'custom/Nav',
    hero: 'custom/Mur',
    sections: [{ type: 'custom', variant: 'Atelier', label: 'L’atelier' }],
  },
  // l'atelier
  direction: 'terre',
  contact: { url: 'https://exemple.fr/l-atelier' }, // une URL n'est pas un commentaire
});
`;

test("variete : un commentaire // l'atelier avant direction: 'terre' ne fausse pas la lecture", () => {
  const cfg = parseConfigParts(CONFIG);
  assert.equal(cfg.direction, 'terre', 'la direction commentee (pierre) ne doit pas etre lue');
  assert.equal(cfg.layout.nav, 'custom/Nav');
  assert.equal(cfg.layout.hero, 'custom/Mur');
  assert.deepEqual(cfg.layout.sections, [{ type: 'custom', variant: 'Atelier', label: 'L’atelier' }]);
  assert.deepEqual(cfg.business, { name: 'À cœur bois', trade: 'Menuisier' });
  assert.equal(cfg.contact.url, 'https://exemple.fr/l-atelier', '// dans une chaine reste du texte');
});

test('stripComments : commentaires retires hors des chaines, lignes et longueur gardees', () => {
  const src = "a: 'x // pas un commentaire', // l'atelier\nb: \"/* non plus */\", /* l'avis\n sur deux lignes */ c: 1";
  const out = stripComments(src);
  assert.equal(out.length, src.length);
  assert.equal(out.split('\n').length, src.split('\n').length);
  assert.match(out, /'x \/\/ pas un commentaire'/);
  assert.match(out, /"\/\* non plus \*\/"/);
  assert.doesNotMatch(out, /atelier|avis/);
});

test("setTopLevelValue : remplace un objet qui contient un commentaire // l'atelier", () => {
  const t = setTopLevelValue(CONFIG, 'layout', { nav: 'bar' });
  assert.deepEqual(extractTopLevelValue(t, 'layout'), { nav: 'bar' });
  assert.equal(extractTopLevelValue(t, 'direction'), 'terre');
});

test('vite-ff-look : une surcharge typography identique à la police de la direction (mélange) ne réimporte rien', async () => {
  const { memePoliceQueDirection } = await import('../scripts/vite-ff-look.mjs');
  const css = "[data-direction='m-x'] {\n  --font-display: 'Bebas Neue', Impact, sans-serif;\n  --font-body: 'Spectral', Georgia, serif;\n}";
  assert.equal(memePoliceQueDirection(css, 'display', "'Bebas Neue', Impact, sans-serif"), true);
  assert.equal(memePoliceQueDirection(css, 'body', "'Spectral', Georgia, serif"), true);
  assert.equal(memePoliceQueDirection(css, 'body', "'Karla Variable', sans-serif"), false, 'une vraie surcharge reste une surcharge');
  assert.equal(memePoliceQueDirection('', 'display', "'Bebas Neue'"), false);
});

// 26 oct 2026 : seules la coquille et les variantes de CE site sont importées (CSS de la page divisé par deux).
test('vite-ff-look : composantsDuSite lit le layout, complète par l’architecture, ajoute les variantes demandées par les pages', async () => {
  const { composantsDuSite, architectureLayout, tousLesComposants, completerParArchitecture } = await import('../scripts/vite-ff-look.mjs');
  const path = await import('node:path');
  const { fileURLToPath } = await import('node:url');
  const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

  // Layout explicite : coquille et variantes du config, cta/band ajouté pour les pages service.
  const c1 = composantsDuSite(root, { layout: { shell: 'flow', architecture: null, servicePage: null, nav: 'bar', hero: 'split', footer: 'columns', sections: [{ type: 'services', variant: 'grid' }, { type: 'contact', variant: 'simple' }] } });
  assert.equal(c1.shell, 'flow');
  assert.deepEqual([...c1.variants.keys()].sort(), ['contact/simple', 'cta/band', 'footer/columns', 'hero/split', 'nav/bar', 'services/grid']);

  // Architecture : la coquille et les sections viennent du registre quand le config ne les dit pas.
  const a = architectureLayout(root, 'livre-ecrans');
  assert.equal(a.shell, 'livre');
  assert.ok(a.sections.some((s) => s.variant === 'liste-a-filets'));
  // L'architecture s'applique par niveau (resolveLook -> completerParArchitecture), comme completerLayout de site.ts.
  const c2 = composantsDuSite(root, { layout: completerParArchitecture(root, { shell: null, architecture: 'livre-ecrans', servicePage: null, nav: null, hero: null, footer: null, sections: [] }) });
  assert.equal(c2.shell, 'livre');
  assert.ok(c2.variants.has('services/liste-a-filets'));
  assert.ok(c2.variants.has('contact/ecran'), 'le gabarit livre (ServiceLivre.astro) demande contact/ecran par son nom');
  assert.ok(c2.variants.has('nav/burger'));

  // Un réglage du config gagne sur l’architecture ; une variante custom n’est pas un fichier de src/sections.
  const c3 = composantsDuSite(root, { layout: completerParArchitecture(root, { shell: 'flow', architecture: 'livre-ecrans', servicePage: null, nav: null, hero: null, footer: null, sections: [{ type: 'services', variant: 'custom/x' }] }) });
  assert.equal(c3.shell, 'flow');
  assert.ok(!c3.variants.has('services/custom/x'));

  // Pas de layout lisible : tout, comme avant.
  assert.equal(composantsDuSite(root, { layout: null }), null);
  const tout = tousLesComposants(root);
  assert.equal(tout.shell, 'flow');
  assert.ok(tout.variants.size > 50);
  assert.equal(architectureLayout(root, 'inconnue'), null);
});

test('vite-ff-look : une direction de mélange figée (m-<hash> avec chiffres) dans site.config.ts est lue, pas remplacée par atelier', async () => {
  const { mkdtempSync, mkdirSync, writeFileSync, rmSync } = await import('node:fs');
  const { join } = await import('node:path');
  const { tmpdir } = await import('node:os');
  const { resolveLook } = await import('../scripts/vite-ff-look.mjs');
  const root = mkdtempSync(join(tmpdir(), 'ff-look-'));
  try {
    mkdirSync(join(root, 'sites', 's'), { recursive: true });
    writeFileSync(join(root, 'sites', 's', 'site.config.ts'), "export default defineSite({ slug: 's', direction: 'm-56cf76' });\n");
    assert.equal(resolveLook({ root, slug: 's' }).direction, 'm-56cf76');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
