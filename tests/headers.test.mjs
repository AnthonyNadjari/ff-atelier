// Tests de la CSP et des en-tetes de securite (scripts/ff/csp.mjs, astro.config.mjs integration
// `ff-headers`) — voir docs/DEPLOIEMENT.md § Securite. Deux parties :
//  1. buildCsp()/readSiteSecurityConfig() sur plusieurs configurations, sans build Astro (rapide).
//  2. Un vrai build (`SITE=_exemple ff build`, FF_OUT dedie) : dist/<slug>/_headers existe et sa
//     ligne Content-Security-Policy correspond exactement a ce que buildCsp() calcule pour ce site.
import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { ROOT } from '../scripts/ff/ts-loader.mjs';
import { buildCsp, readSiteSecurityConfig } from '../scripts/ff/csp.mjs';

// --- Partie 1 : buildCsp() sur 3 configurations (voir tache : "CSP string built for 3 configs") ---

test('buildCsp : site minimal (mailto, sans analytics, sans Turnstile, carte osm)', () => {
  const csp = buildCsp({
    formProvider: 'mailto', turnstileSiteKey: '', mapsProvider: 'osm',
    analyticsPlausible: false, analyticsUmamiSrc: '', analyticsCloudflare: false,
  });
  assert.ok(csp.includes("default-src 'self'"));
  assert.ok(csp.includes("script-src 'self' 'unsafe-inline'"), 'unsafe-inline attendu (pas de nonce possible en build statique, voir commentaire de buildCsp)');
  assert.ok(csp.includes("font-src 'self' data:"));
  assert.ok(csp.includes("form-action 'self'") && !csp.includes('form-action \'self\' https://api.web3forms.com'));
  assert.ok(csp.includes("frame-src 'none'"), 'aucune iframe autorisee sans Turnstile ni carte Google');
  assert.ok(!csp.includes('challenges.cloudflare.com'));
  assert.ok(!csp.includes('plausible.io'));
  assert.ok(!csp.includes('cloudflareinsights.com'));
  assert.ok(csp.includes('upgrade-insecure-requests'));
});

test('buildCsp : web3forms + Plausible + Turnstile + carte Google', () => {
  const csp = buildCsp({
    formProvider: 'web3forms', turnstileSiteKey: '1x00000000000000000000AA', mapsProvider: 'google',
    analyticsPlausible: true, analyticsUmamiSrc: '', analyticsCloudflare: false,
  });
  assert.ok(csp.includes('form-action \'self\' https://api.web3forms.com'));
  assert.ok(/connect-src[^;]*https:\/\/api\.web3forms\.com/.test(csp));
  assert.ok(/script-src[^;]*https:\/\/plausible\.io/.test(csp));
  assert.ok(/connect-src[^;]*https:\/\/plausible\.io/.test(csp));
  assert.ok(/script-src[^;]*https:\/\/challenges\.cloudflare\.com/.test(csp), 'script Turnstile attendu');
  assert.ok(/frame-src[^;]*https:\/\/challenges\.cloudflare\.com/.test(csp), 'iframe Turnstile attendue');
  assert.ok(/frame-src[^;]*https:\/\/www\.google\.com/.test(csp), 'facade Maps attendue');
  assert.ok(/frame-src[^;]*https:\/\/maps\.google\.com/.test(csp));
});

test('buildCsp : provider cloudflare + analytics Cloudflare + Umami', () => {
  const csp = buildCsp({
    formProvider: 'cloudflare', turnstileSiteKey: '', mapsProvider: 'osm',
    analyticsPlausible: false, analyticsUmamiSrc: 'https://umami.exemple.fr/script.js', analyticsCloudflare: true,
  });
  assert.ok(/script-src[^;]*https:\/\/static\.cloudflareinsights\.com/.test(csp));
  assert.ok(/connect-src[^;]*https:\/\/cloudflareinsights\.com/.test(csp));
  assert.ok(/script-src[^;]*https:\/\/umami\.exemple\.fr/.test(csp));
  assert.ok(/connect-src[^;]*https:\/\/umami\.exemple\.fr/.test(csp));
  assert.ok(!csp.includes('api.web3forms.com'), 'provider cloudflare : pas de web3forms dans la CSP');
  assert.ok(csp.includes("form-action 'self'") && !csp.includes('web3forms'));
});

test('readSiteSecurityConfig : lit provider/turnstileSiteKey/mapsProvider/analytics (umami + cloudflare imbriques) dans un texte site.config.ts', () => {
  const src = `
    form: { provider: 'web3forms', accessKey: 'xxx', turnstileSiteKey: '1x00000000000000000000AA' },
    contact: { mapsUrl: 'https://maps.google.com/xxx', mapsProvider: 'google' },
    analytics: { plausible: 'exemple.fr', umami: { src: 'https://umami.exemple.fr/script.js', id: 'abc' }, cloudflare: 'token123' },
  `;
  const cfg = readSiteSecurityConfig(src);
  assert.equal(cfg.formProvider, 'web3forms');
  assert.equal(cfg.turnstileSiteKey, '1x00000000000000000000AA');
  assert.equal(cfg.mapsProvider, 'google');
  assert.equal(cfg.analyticsPlausible, true);
  assert.equal(cfg.analyticsUmamiSrc, 'https://umami.exemple.fr/script.js');
  assert.equal(cfg.analyticsCloudflare, true);
});

test('readSiteSecurityConfig : config vide/absente -> valeurs par defaut, jamais d\'exception', () => {
  const cfg = readSiteSecurityConfig('');
  assert.equal(cfg.formProvider, 'mailto');
  assert.equal(cfg.turnstileSiteKey, '');
  assert.equal(cfg.mapsProvider, 'osm');
  assert.equal(cfg.analyticsPlausible, false);
  assert.equal(cfg.analyticsUmamiSrc, '');
  assert.equal(cfg.analyticsCloudflare, false);
});

// --- Partie 2 : un vrai build ecrit bien _headers avec la CSP attendue ---

const OUT_DIR = 'dist/_test-headers';
const DIST_PATH = path.join(ROOT, OUT_DIR);

before(() => {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const res = spawnSync(process.execPath, [astroJs, 'build'], {
    cwd: ROOT,
    encoding: 'utf8',
    timeout: 120_000,
    env: { ...process.env, SITE: '_exemple', FF_OUT: OUT_DIR },
  });
  if (res.status !== 0) {
    console.log(res.stdout);
    console.log(res.stderr);
  }
  assert.equal(res.status, 0, 'le build de sites/_exemple (FF_OUT=dist/_test-headers) a echoue (voir la sortie ci-dessus)');
});

after(() => {
  fs.rmSync(DIST_PATH, { recursive: true, force: true });
});

test('_headers est ecrit au build avec une CSP et les autres en-tetes de securite', () => {
  const headersPath = path.join(DIST_PATH, '_headers');
  assert.ok(fs.existsSync(headersPath), '_headers absent de dist/_test-headers');
  const txt = fs.readFileSync(headersPath, 'utf8');

  assert.match(txt, /Content-Security-Policy: default-src 'self';/);
  assert.match(txt, /Permissions-Policy: camera=\(\), microphone=\(\), geolocation=\(\)/);
  assert.match(txt, /Strict-Transport-Security: max-age=31536000; includeSubDomains/);
  assert.match(txt, /X-Content-Type-Options: nosniff/);

  // La CSP ecrite dans le _headers reel doit correspondre exactement a ce que buildCsp() calcule
  // pour la config de sites/_exemple/site.config.ts (meme lecture que fait astro.config.mjs).
  const configSrc = fs.readFileSync(path.join(ROOT, 'sites', '_exemple', 'site.config.ts'), 'utf8');
  const expected = buildCsp(readSiteSecurityConfig(configSrc));
  assert.ok(txt.includes(`Content-Security-Policy: ${expected}`), 'la CSP ecrite ne correspond pas a buildCsp(readSiteSecurityConfig(...))');
});

test('csp : data-lottie ouvre connect-src au CDN du moteur WASM, et seulement dans ce cas', () => {
  const sans = buildCsp({});
  const avec = buildCsp({ usesLottie: true });
  assert.doesNotMatch(sans, /cdn\.jsdelivr\.net/);
  assert.match(avec, /connect-src [^;]*https:\/\/cdn\.jsdelivr\.net/);
  assert.match(avec, /connect-src [^;]*https:\/\/unpkg\.com/);
  assert.match(avec, /script-src [^;]*'wasm-unsafe-eval'/);
  assert.doesNotMatch(sans, /wasm-unsafe-eval/);
});
