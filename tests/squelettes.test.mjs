// Tests des trois squelettes transversaux (docs/veille/squelettes.md § 3b n°3, 4, 5) :
//  - contact en tiroir (layout.contactDrawer -> src/components/ContactDrawer.astro, rendu par Base.astro),
//  - sommaire actif des coquilles sidebar/split (data-scrollspy, src/scripts/scrollspy.ts),
//  - transitions de page (site.transitions -> <ClientRouter /> conditionnel, moteur et scripts inline
//    rearmes sur astro:page-load via src/scripts/page.ts).
// Verifications de source (rapides) + un fumigene de build sur sites/_exemple avec FF_LOOK
// (contactDrawer + transitions forces, FF_OUT isole la sortie).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadSchemaModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

const read = (p) => fs.readFileSync(path.join(ROOT, p), 'utf8');
const tsImportable = await canImportTs();
after(() => cleanTmp());

const minimal = {
  slug: 'test',
  direction: 'atelier',
  business: { name: 'X', trade: 'Y', tagline: 'Z', description: 'D' },
  contact: { phone: '+33600000000', phoneDisplay: '06 00 00 00 00', email: 'a@b.fr', address: { postalCode: '59000', city: 'Lille' } },
  services: [{ slug: 's', title: 'T', short: 'S' }],
  about: { story: 'S' },
};

// ---------- schema ----------
if (tsImportable) {
  test('schema : layout.contactDrawer existe, defaut false, accepte true', async () => {
    const { defineSite } = await loadSchemaModule();
    assert.equal(defineSite(minimal).layout.contactDrawer, false);
    assert.equal(defineSite({ ...minimal, layout: { contactDrawer: true } }).layout.contactDrawer, true);
    assert.throws(() => defineSite({ ...minimal, layout: { contactDrawer: 'oui' } }));
  });
  test('schema : transitions defaut false, accepte true', async () => {
    const { defineSite } = await loadSchemaModule();
    assert.equal(defineSite(minimal).transitions, false);
    assert.equal(defineSite({ ...minimal, transitions: true }).transitions, true);
  });
}

test('schema (source) : contactDrawer a un .describe() en francais', () => {
  const src = read('src/lib/schema.ts');
  const m = src.match(/contactDrawer:[\s\S]*?\.describe\(\s*["'`]([^"'`]+)/);
  assert.ok(m, 'contactDrawer sans .describe()');
  assert.match(m[1], /tiroir/i);
});

// ---------- contact en tiroir ----------
test('ContactDrawer.astro : dialog natif accessible, ContactForm reutilise, tokens uniquement', () => {
  const src = read('src/components/ContactDrawer.astro');
  assert.match(src, /<dialog\b[^>]*data-contact-drawer/, 'un <dialog data-contact-drawer> attendu');
  assert.match(src, /aria-labelledby="contact-tiroir-titre"/);
  assert.match(src, /id="contact-tiroir-titre"/);
  assert.match(src, /aria-label="Fermer"/);
  assert.match(src, /showModal\(\)/);
  assert.match(src, /<ContactForm\b/);
  assert.match(src, /a\[href="#contact"\],a\[href="\/#contact"\]/, 'tout lien #contact et /#contact doit ouvrir le tiroir');
  assert.match(src, /var\(--motion-ui\)/);
  assert.match(src, /var\(--ease-out\)/);
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /onPage\(/, 'doit se rearmer via onPage() (ClientRouter)');
  const style = src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
  assert.doesNotMatch(style, /#[0-9a-fA-F]{3,8}\b/, 'couleur en dur dans le style du tiroir');
  assert.doesNotMatch(style, /font-family/, 'police en dur dans le style du tiroir');
});

test('Base.astro : ContactDrawer rendu seulement si layout.contactDrawer, ClientRouter seulement si site.transitions', () => {
  const src = read('src/layouts/Base.astro');
  assert.match(src, /\{site\.layout\.contactDrawer && <ContactDrawer \/>\}/);
  assert.match(src, /\{site\.transitions && <ClientRouter \/>\}/);
  assert.match(src, /data-transitions=\{site\.transitions \? '1' : undefined\}/);
  assert.match(src, /astro:page-load/);
});

test('navLinks (source) : ancre #contact ajoutee quand le tiroir est actif sans section contact', () => {
  const src = read('src/lib/site.ts');
  assert.match(src, /s\.layout\.contactDrawer && !links\.some\(\(l\) => l\.href === '#contact'\)/);
});

test('navs partagees : CTA #contact quand le tiroir est actif (porte « Devis » de actions(), src/lib/actions.ts)', () => {
  // Depuis les portes d'action (17 oct 2026), le CTA #contact n'est plus code dans chaque nav : actions()
  // l'ajoute (kind 'quote') des que layout.contactDrawer est actif ou qu'une section contact existe
  // (tests/actions.test.mjs). Ici : chaque nav passe bien par actions().
  for (const nav of ['bar', 'minimal', 'floating', 'split', 'burger', 'dock']) {
    const src = read(`src/sections/Nav/${nav}.astro`);
    assert.match(src, /\bactions\(\)/, `Nav/${nav}.astro n'appelle pas actions()`);
  }
  assert.match(read('src/lib/actions.ts'), /Boolean\(s\.layout\.contactDrawer\)/, 'actions.ts ignore layout.contactDrawer');
  assert.match(read('src/lib/actions.ts'), /'#contact'/, "actions.ts sans porte #contact");
});

// ---------- sommaire actif ----------
test('coquilles sidebar et split : conteneur data-scrollspy + style is-active par tokens + onPage', () => {
  for (const shell of ['sidebar', 'split']) {
    const src = read(`src/shells/${shell}.astro`);
    assert.match(src, /data-scrollspy\b/, `shells/${shell}.astro sans data-scrollspy`);
    assert.match(src, /\.is-active/, `shells/${shell}.astro ne style pas .is-active`);
    assert.match(src, /initScrollSpy/, `shells/${shell}.astro n'appelle pas initScrollSpy`);
    assert.match(src, /onPage\(initScrollSpy\)/, `shells/${shell}.astro doit rearmer via onPage()`);
    assert.match(src, /var\(--motion-ui\)/);
    assert.match(src, /prefers-reduced-motion: reduce/);
    const style = src.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? '';
    assert.doesNotMatch(style, /#[0-9a-fA-F]{3,8}\b/, `couleur en dur dans shells/${shell}.astro`);
  }
  assert.match(read('src/shells/sidebar.astro'), /data-scrollspy-index/, 'le rail sidebar affiche le compteur de position');
});

test('scrollspy.ts : aria-current="true" + classe is-active, IntersectionObserver, jamais de focus()', () => {
  const src = read('src/scripts/scrollspy.ts');
  assert.match(src, /setAttribute\('aria-current', 'true'\)/);
  assert.match(src, /removeAttribute\('aria-current'\)/);
  assert.match(src, /classList\.toggle\('is-active'/);
  assert.match(src, /new IntersectionObserver/);
  assert.doesNotMatch(src, /\.focus\(/, 'le sommaire actif ne doit jamais voler le focus');
});

// ---------- transitions de page ----------
test('page.ts : onPage ecoute astro:page-load si data-transitions, sinon appel direct', () => {
  const src = read('src/scripts/page.ts');
  assert.match(src, /export function onPage\(/);
  assert.match(src, /hasAttribute\('data-transitions'\)/);
  assert.match(src, /addEventListener\('astro:page-load', fn\)/);
});

test('audit : tout <script> inline de src/ (sections, composants, coquilles) se rearme via onPage()', () => {
  const dirs = ['src/sections', 'src/components', 'src/shells'];
  const files = [];
  const walk = (d) => {
    for (const e of fs.readdirSync(path.join(ROOT, d), { withFileTypes: true })) {
      if (e.isDirectory()) walk(`${d}/${e.name}`);
      else if (e.name.endsWith('.astro')) files.push(`${d}/${e.name}`);
    }
  };
  dirs.forEach(walk);
  const offenders = [];
  for (const f of files) {
    const src = read(f);
    // scripts inline = balises <script> sans src ni type (ld+json exclus)
    const inline = [...src.matchAll(/<script(\s[^>]*)?>/g)].filter((m) => !/\b(src|type)=/.test(m[1] ?? ''));
    if (inline.length && !/onPage\(/.test(src)) offenders.push(f);
  }
  assert.deepEqual(offenders, [], `scripts inline sans onPage() (ne se relancent pas apres une navigation ClientRouter) : ${offenders.join(', ')}`);
});

test('motion.ts : rearmement sans doublon (signal de page, ScrollTrigger tues, Lenis unique, rideau une fois)', () => {
  const src = read('src/scripts/motion.ts');
  assert.match(src, /pageAbort\?\.abort\(\)/);
  assert.match(src, /stRef\?\.getAll\(\)\.forEach\(\(t\) => t\.kill\(\)\)/);
  assert.match(src, /if \(!lenisRef\)/);
  assert.match(src, /if \(pageLoads > 1\) \{ el\.remove\(\); return; \}/);
  // aucun ecouteur window sans signal
  const noSignal = [...src.matchAll(/window\.addEventListener\([^;]*?\{ passive: true \}\)/g)].map((m) => m[0]);
  assert.deepEqual(noSignal, [], 'ecouteur window sans { signal } dans motion.ts');
  assert.match(src, /document\.addEventListener\('ff:form-success'[\s\S]*?\{ signal \}\)/);
});

test('global.css : fondu 0,3 s, hero et nav nommes, reduced-motion = aucune transition', () => {
  const css = read('src/styles/global.css');
  assert.match(css, /::view-transition-old\(root\),\s*::view-transition-new\(root\)\s*\{\s*animation-duration: 0\.3s/);
  assert.match(css, /\[data-transitions\] #hero \{ view-transition-name: ff-hero; \}/);
  assert.match(css, /view-transition-name: ff-nav/);
  assert.match(css, /::view-transition-group\(\*\),\s*::view-transition-old\(\*\),\s*::view-transition-new\(\*\)\s*\{ animation: none !important; \}/);
});

// ---------- fumigene de build ----------
test('fumigene : _exemple avec contactDrawer + transitions (FF_LOOK) rend le dialog, le lien nav #contact et ClientRouter', { timeout: 180_000 }, () => {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const outDir = 'dist/_test-squelettes';
  // sections sans contact : le tiroir doit etre la seule porte -> la nav recoit #contact
  const look = JSON.stringify({ transitions: true, layout: { contactDrawer: true, sections: [{ type: 'services', variant: 'grid' }, { type: 'faq', variant: 'accordion' }] } });
  const res = spawnSync(process.execPath, [astroJs, 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 170_000,
    env: { ...process.env, SITE: '_exemple', FF_LOOK: look, FF_OUT: outDir },
  });
  if (res.status !== 0) {
    console.log(res.stdout);
    console.log(res.stderr);
  }
  assert.equal(res.status, 0, 'le build a echoue (voir la sortie ci-dessus)');
  const html = fs.readFileSync(path.join(ROOT, outDir, 'index.html'), 'utf8');
  const service = fs.readdirSync(path.join(ROOT, outDir, 'services')).find((f) => f.endsWith('.html'));
  const serviceHtml = fs.readFileSync(path.join(ROOT, outDir, 'services', service), 'utf8');
  fs.rmSync(path.join(ROOT, outDir), { recursive: true, force: true });
  assert.match(html, /<dialog[^>]*data-contact-drawer/, 'dialog absent de index.html');
  assert.match(serviceHtml, /<dialog[^>]*data-contact-drawer/, 'dialog absent de la page service');
  assert.doesNotMatch(html, /<section id="contact"/, 'le layout de test ne doit pas avoir de section contact');
  assert.match(html, /<nav[^>]*>[\s\S]*?href="#contact"[\s\S]*?<\/nav>/, 'la nav doit recevoir #contact quand le tiroir est la seule porte');
  // ff verifier : le formulaire du tiroir porte le honeypot
  const dialog = html.match(/<dialog[\s\S]*?<\/dialog>/)[0];
  assert.match(dialog, /<form\b/);
  assert.match(dialog, /tabindex="-1"/);
  assert.match(html, /astro-view-transitions-enabled/, 'ClientRouter absent alors que transitions: true');
  assert.match(html, /<html[^>]*data-transitions="1"/);
});

test('fumigene : _exemple par defaut (sans tiroir ni transitions) ne rend ni dialog ni ClientRouter', { timeout: 180_000 }, () => {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const outDir = 'dist/_test-squelettes-defaut';
  const res = spawnSync(process.execPath, [astroJs, 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 170_000,
    env: { ...process.env, SITE: '_exemple', FF_OUT: outDir },
  });
  if (res.status !== 0) {
    console.log(res.stdout);
    console.log(res.stderr);
  }
  assert.equal(res.status, 0, 'le build a echoue (voir la sortie ci-dessus)');
  const html = fs.readFileSync(path.join(ROOT, outDir, 'index.html'), 'utf8');
  fs.rmSync(path.join(ROOT, outDir), { recursive: true, force: true });
  // (le CSS du tiroir, lui, est regroupe avec le CSS global comme celui des coquilles : on teste l'element)
  assert.doesNotMatch(html, /<dialog/);
  assert.doesNotMatch(html, /astro-view-transitions-enabled/);
  assert.doesNotMatch(html, /<html[^>]*data-transitions/);
});
