// Tests de l'integration post-build `ff-images` (scripts/astro-images-integration.mjs) : reecriture
// des <img src="/images/x.webp"> nus en <picture> AVIF+WebP a partir du manifeste images.json, sans
// navigateur ni build. Point critique : `sizes` (c'est lui qui decide du candidat telecharge) —
// explicite conserve, premier ecran = 100vw, sinon grille — et srcset complet (toutes les largeurs).
import { test } from 'node:test';
import assert from 'node:assert/strict';
import { rewriteImages, sizesFor, SIZES_GRILLE, SIZES_PLEINE_LARGEUR } from '../scripts/astro-images-integration.mjs';

const manifest = {
  hero: { widths: [480, 800, 1200, 1600, 2000, 2400], formats: ['avif', 'webp'], ratio: 1.5, lqip: 'data:x' },
  petite: { widths: [480, 640], formats: ['webp'], ratio: 1.3333, lqip: 'data:x' },
};

test('sizesFor : un sizes explicite est conserve tel quel', () => {
  assert.equal(sizesFor('src="/images/a.webp" sizes="(min-width: 768px) 40rem, 100vw" loading="lazy"'), '(min-width: 768px) 40rem, 100vw');
});

test('sizesFor : premier ecran (fetchpriority=high ou loading=eager) sans sizes -> pleine largeur', () => {
  assert.equal(sizesFor('src="/images/a.webp" loading="eager" fetchpriority="high"'), SIZES_PLEINE_LARGEUR);
  assert.equal(sizesFor('src="/images/a.webp" loading="eager"'), '100vw');
});

test('sizesFor : image paresseuse sans sizes -> grille par defaut (3/2/1 colonnes)', () => {
  assert.equal(sizesFor('src="/images/a.webp" loading="lazy"'), SIZES_GRILLE);
  assert.equal(SIZES_GRILLE, '(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw');
});

test('rewriteImages : srcset complet avec TOUTES les largeurs du manifeste, alias sans suffixe pour la plus grande', () => {
  const { html, count } = rewriteImages('<img src="/images/hero.webp" alt="x" loading="eager" fetchpriority="high">', manifest);
  assert.equal(count, 1);
  assert.match(html, /^<picture><source type="image\/avif" srcset="([^"]+)" sizes="100vw"><source type="image\/webp"/);
  const avif = html.match(/type="image\/avif" srcset="([^"]+)"/)[1];
  assert.equal(
    avif,
    '/images/hero-480.avif 480w, /images/hero-800.avif 800w, /images/hero-1200.avif 1200w, /images/hero-1600.avif 1600w, /images/hero-2000.avif 2000w, /images/hero.avif 2400w',
  );
  assert.match(html, /<img [^>]*width="2400" height="1600"/, 'width/height anti-CLS depuis la plus grande largeur et le ratio');
  assert.match(html, /decoding="async"/);
});

test('rewriteImages : sizes explicite du <img> transmis aux <source> et retire du <img>', () => {
  const { html } = rewriteImages('<img src="/images/hero.webp" sizes="(min-width: 1024px) 40vw, 100vw" alt="" loading="lazy">', manifest);
  assert.equal((html.match(/sizes="\(min-width: 1024px\) 40vw, 100vw"/g) || []).length, 2, 'un sizes par <source> (avif + webp)');
  assert.doesNotMatch(html.match(/<img [^>]*>/)[0], /\bsizes=/);
});

test('rewriteImages : image paresseuse sans sizes -> sizes de grille par defaut', () => {
  const { html } = rewriteImages('<img src="/images/hero.webp" alt="" loading="lazy">', manifest);
  assert.match(html, new RegExp(`sizes="${SIZES_GRILLE.replace(/[()]/g, '\\$&')}"`));
});

test('rewriteImages : largeurs non triees dans le manifeste -> srcset croissant quand meme', () => {
  const { html } = rewriteImages('<img src="/images/hero.webp" alt="">', { hero: { ...manifest.hero, widths: [2400, 480, 1200] } });
  assert.match(html, /srcset="\/images\/hero-480\.avif 480w, \/images\/hero-1200\.avif 1200w, \/images\/hero\.avif 2400w"/);
});

test('rewriteImages : sans AVIF dans le manifeste -> une seule <source> WebP', () => {
  const { html } = rewriteImages('<img src="/images/petite.webp" alt="">', manifest);
  assert.doesNotMatch(html, /image\/avif/);
  assert.match(html, /<source type="image\/webp" srcset="\/images\/petite-480\.webp 480w, \/images\/petite\.webp 640w"/);
});

test('rewriteImages : laisse intacts les <img> deja en srcset, deja dans un <picture>, hors manifeste ou hors /images/', () => {
  const cases = [
    '<img src="/images/hero.webp" srcset="/images/hero-480.webp 480w" alt="">',
    '<picture><source srcset="/x.avif"><img src="/images/hero.webp" alt=""></picture>',
    '<img src="/images/inconnue.webp" alt="">',
    '<img src="/images/sites/forge.webp" alt="">',
    '<img src="https://tile.openstreetmap.org/1/2/3.png" alt="">',
  ];
  for (const c of cases) {
    const { html, count } = rewriteImages(c, manifest);
    assert.equal(count, 0, c);
    assert.equal(html, c);
  }
});
