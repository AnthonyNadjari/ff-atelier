import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ancresCassees, creditsSansUsage } from '../scripts/ff/verifier.mjs';

test('ancres internes : cible dans la même page ou dans une autre', () => {
  const pages = {
    'index.html': '<section id="contact"></section><a href="#contact">x</a><a href="#faq">y</a>',
    'services\cave.html': '<a href="/#contact">ok</a><a href="/#services">ko</a><a href="https://x.fr/#a">ext</a>',
  };
  const c = ancresCassees(pages);
  assert.deepEqual(c.map((x) => x.href), ['#faq', '/#services']);
});

test('crédits sans usage', () => {
  const md = '# Crédits\n\n## raw/cave.jpg -> public/images/cave.webp (via ff images)\n- x\n## raw/raclette.jpg -> public/images/raclette.webp\n';
  assert.deepEqual(creditsSansUsage(md, '<img src="/images/cave-800.webp">'), ['raclette']);
  assert.deepEqual(creditsSansUsage(md, '<img src="/images/cave.avif"><img src="/images/raclette-1200.avif">'), []);
});
