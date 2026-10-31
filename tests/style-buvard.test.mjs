// Style construit « buvard » (veille du 30 oct 2026, tour 19, volet 2a quater, source florawellnesscafe.com, fiche
// docs/veille/styles/buvard.md) : la construction relevée est codée (photo cadrée dans les marges, carte en colonnes à prix
// en machine à écrire, grande photo à titre posé dessus, avis sans photo, pied lie-de-vin, filets tremblés, modèle de
// site entier, profil de mouvement), régime coloré doux (bloc d'encre lie-de-vin) sur papier crème.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/buvard : photo cadrée dans les marges, h1 en caslon, métier à ville, téléphone et porte, filet tremblé', () => {
  const src = sansCommentaires(lire('src/sections/Hero/buvard.astro'));
  assert.match(src, /\{hero && \(/);
  assert.match(src, /set:html=\{site\.business\.tagline\}/);
  assert.match(src, /metierEtVille\(\)/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /<FiletTremble/);
  assert.doesNotMatch(src, /·/);
});

test('Services/buvard : carte en colonnes, lignes à prix seulement si donnés, liens vers les pages, sans pointillés ni icônes', () => {
  const src = sansCommentaires(lire('src/sections/Services/buvard.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /s\.lignes\.length > 0/);
  assert.match(src, /\{l\.prix && /, 'prix seulement s’il est donné');
  assert.match(src, /\{l\.detail && /);
  assert.match(src, /\/services\/\$\{s\.slug\}/);
  assert.match(src, /var\(--font-mono\)/, 'la carte en machine à écrire');
  assert.doesNotMatch(src, /<Icon\b|dotted|leader/);
});

test('FiletTremble : décoratif, tracé sans script, état caché seulement sous la classe posée par le script, mouvement réduit', () => {
  const src = lire('src/components/FiletTremble.astro');
  assert.match(src, /aria-hidden="true"/);
  assert.match(src, /pathLength="1"/);
  assert.match(src, /\.filet-pret path \{ stroke-dasharray: 1; stroke-dashoffset: 1;/);
  assert.match(src, /prefers-reduced-motion: reduce/);
  assert.match(src, /io\.unobserve/, 'une fois');
});

test('About, Proof, Contact buvard : titre sur la photo, avis sans photo, pied lie-de-vin, rien sans données', () => {
  const about = sansCommentaires(lire('src/sections/About/buvard.astro'));
  assert.match(about, /id="about"/);
  assert.match(about, /a\.portrait \?\? galerie\[0\]/);
  assert.match(about, /\{photo \? \(/);
  const proof = sansCommentaires(lire('src/sections/Proof/buvard.astro'));
  assert.match(proof, /\{\(avis\.length > 0 \|\| google\) && \(/);
  assert.doesNotMatch(proof, /photos\[i\]/, 'jamais une photo au-dessus d\'un avis nommé');
  assert.doesNotMatch(proof, /★|<Icon\b/);
  const contact = sansCommentaires(lire('src/sections/Contact/buvard.astro'));
  assert.match(contact, /id="contact"/);
  assert.match(contact, /bg-ink text-on-ink/);
  assert.doesNotMatch(contact, /ContactForm/, 'pas de formulaire générique : la source finit sur ses colonnes');
  assert.match(proof, /\{rangee\.length >= 3 && \(/, 'la rangée de photos seulement avec trois photos libres');
  assert.doesNotMatch(proof, /site\.services\.map\(\(s\) => s\.image\)/, 'jamais une photo de prestation pour illustrer un avis');
});

test('presets buvard : modèle de site entier, pas de barre basse ; second modèle différent', () => {
  const m = JSON.parse(lire('presets/buvard.json'));
  assert.equal(m.nom, 'buvard');
  assert.equal(m.look.direction, 'buvard');
  assert.equal(m.look.layout.hero, 'buvard');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['services/buvard', 'about/buvard', 'proof/buvard', 'contact/buvard']);
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/buvard-epicerie.json'));
  assert.equal(b.look.direction, 'buvard');
  assert.notEqual(b.look.layout.hero, 'buvard');
});

test('direction buvard : Libre Caslon Text et Courier Prime hors liste IA, papier crème, angles droits, courbe linéaire mesurée', async () => {
  const css = lire('src/directions/buvard/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(['Libre Caslon Text', 'Courier Prime'].includes(fam), fam);
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--bg: #f2ecd9;/);
  assert.match(css, /--ease-brand: cubic-bezier\(0, 0, 1, 1\);/, 'la courbe linéaire mesurée, écrite en cubic-bezier (tests/motion.test.mjs)');
  assert.match(css, /--radius: 0px;/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  assert.equal(regimePalette(JSON.parse(lire('docs/veille/styles/atomes/buvard.json')).couleurs).regime, 'colore-doux');
});

test('profil filet-tremble-qui-se-trace : calme, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['filet-tremble-qui-se-trace'];
  assert.ok(p);
  assert.equal(p.calme, true);
  assert.deepEqual(p.exige, {});
  assert.equal(refusProfil('filet-tremble-qui-se-trace', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), null);
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `filet-tremble-qui-se-trace`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/buvard.json')).mouvement.profil, 'filet-tremble-qui-se-trace');
});
