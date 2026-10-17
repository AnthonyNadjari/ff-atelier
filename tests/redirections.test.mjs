import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import { versCloudflare, redirectsCloudflare } from '../scripts/ff/redirections.mjs';

test('règle simple et code par défaut', () => {
  assert.equal(versCloudflare({ source: '/ancienne-page.html', destination: '/services/cuisines', statusCode: 301 }), '/ancienne-page.html /services/cuisines 301');
  assert.equal(versCloudflare({ source: '/a', destination: '/b' }), '/a /b 301');
  assert.equal(versCloudflare({ source: '/a', destination: '/b', permanent: false }), '/a /b 302');
});

test('paramètre étoilé Vercel → splat Cloudflare', () => {
  assert.equal(versCloudflare({ source: '/services/:slug*', destination: '/audit', statusCode: 301 }), '/services/* /audit 301');
  assert.equal(versCloudflare({ source: '/blog/:path*', destination: '/conseils/:path*', statusCode: 301 }), '/blog/* /conseils/:splat 301');
});

test('expression régulière Vercel ignorée, liste vide = pas de fichier', () => {
  assert.equal(versCloudflare({ source: '/(.*)\\.php', destination: '/' }), null);
  assert.equal(redirectsCloudflare({ redirects: [] }), '');
});

test('le vrai redirects.json du studio se convertit', () => {
  const j = JSON.parse(fs.readFileSync(new URL('../sites/finck-fisch/redirects.json', import.meta.url), 'utf8'));
  const t = redirectsCloudflare(j);
  assert.match(t, /^\/services \/audit 301$/m);
  assert.match(t, /^\/services\/\* \/audit 301$/m);
});
