// Réalisations avec métadonnées et filtres (geste 5 des démontages, docs/veille/demontages/INDEX.md) :
// src/lib/galerie.ts (module pur re-exporté par src/lib/site.ts), schéma proof.gallery[].place/kind/
// size/client (optionnels, jamais devinés), src/sections/Proof/gallery.astro (ligne lieu – type – mesure –
// client sous la photo, filtres par `kind` en radios + CSS `:has()` sans JS, compteur réel dès 4 photos).
// Vérifications de source + un fumigène de build sur sites/_exemple avec FF_LOOK (proof/gallery forcé
// dans le layout, FF_OUT isole la sortie).
import { test, after } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { loadGalerieModule, loadSchemaModule, loadSiteConfigModule, cleanTmp, ROOT, canImportTs } from '../scripts/ff/ts-loader.mjs';

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

if (!tsImportable) {
  test('[ignoré] node ne sait pas type-stripper le TS ici', (t) => t.skip());
} else {
  test('kindsDeGalerie : types distincts dans l’ordre d’apparition, null sous deux types', async () => {
    const { kindsDeGalerie } = await loadGalerieModule();
    assert.deepEqual(kindsDeGalerie([{ kind: 'Cuisine' }, { kind: 'Escalier' }, { kind: 'Cuisine' }, {}, { kind: ' Agencement ' }]), ['Cuisine', 'Escalier', 'Agencement']);
    assert.equal(kindsDeGalerie([{ kind: 'Cuisine' }, { kind: 'Cuisine' }, { place: 'Lille' }]), null, 'un seul type = rien à filtrer');
    assert.equal(kindsDeGalerie([]), null);
    assert.equal(kindsDeGalerie([{ kind: '' }, { kind: '  ' }]), null, 'un kind vide ne compte pas');
  });

  test('idDeKind : minuscules, sans accents, stable ; metaDeRealisation : lieu, type, mesure, client, sans les absents', async () => {
    const { idDeKind, metaDeRealisation } = await loadGalerieModule();
    assert.equal(idDeKind('Salle de bain'), 'salle-de-bain');
    assert.equal(idDeKind('Rénovation énergétique'), 'renovation-energetique');
    assert.equal(idDeKind('!!!'), 'autre');
    assert.deepEqual(metaDeRealisation({ place: 'Roubaix', kind: 'Cuisine', size: '14 m²', client: 'Claire D.' }), ['Roubaix', 'Cuisine', '14 m²', 'Claire D.']);
    assert.deepEqual(metaDeRealisation({ kind: 'Escalier', client: ' ' }), ['Escalier'], 'un champ absent ou vide n’apparaît pas');
    assert.deepEqual(metaDeRealisation({}), []);
  });

  test('libelleCompteur : « N réalisations » dès 4, sinon null ; séparateur = demi-cadratin, jamais le point médian', async () => {
    const { libelleCompteur, COMPTEUR_MIN, SEPARATEUR_META } = await loadGalerieModule();
    assert.equal(COMPTEUR_MIN, 4);
    assert.equal(libelleCompteur(3), null);
    assert.equal(libelleCompteur(4), '4 réalisations');
    assert.equal(libelleCompteur(12), '12 réalisations');
    assert.equal(SEPARATEUR_META, ' – ');
    assert.doesNotMatch(SEPARATEUR_META, /[·—]/);
  });

  test('schema : proof.gallery accepte place/kind/size/client optionnels, refuse un autre type', async () => {
    const { defineSite } = await loadSchemaModule();
    const avec = defineSite({
      ...minimal,
      proof: { gallery: [{ src: '/images/a.webp', alt: 'A', place: 'Lille', kind: 'Cuisine', size: '12 m²', client: 'M. L.' }, { src: '/images/b.webp', alt: 'B' }] },
    });
    assert.deepEqual(avec.proof.gallery[0], { src: '/images/a.webp', alt: 'A', place: 'Lille', kind: 'Cuisine', size: '12 m²', client: 'M. L.' });
    assert.equal(avec.proof.gallery[1].kind, undefined, 'absent reste absent (rien de deviné)');
    assert.throws(() => defineSite({ ...minimal, proof: { gallery: [{ src: '/images/a.webp', alt: 'A', size: 12 }] } }));
  });

  test('_exemple : galerie de référence avec lieu, type et mesure sur chaque entrée, deux types distincts, 4 photos (compteur)', async () => {
    const { kindsDeGalerie, libelleCompteur } = await loadGalerieModule();
    const mod = await loadSiteConfigModule('_exemple');
    const g = mod.default.proof.gallery;
    assert.ok(g.length >= 4, 'au moins 4 réalisations pour exercer le compteur');
    for (const r of g) for (const k of ['place', 'kind', 'size']) assert.ok(r[k], `${r.src} sans ${k}`);
    assert.ok((kindsDeGalerie(g) ?? []).length >= 2, 'au moins deux kinds distincts pour exercer les filtres');
    assert.equal(libelleCompteur(g.length), `${g.length} réalisations`);
  });
}

test('schema (source) : les quatre champs ont un .describe() ; client exige l’accord, jamais un nom complet', () => {
  const src = read('src/lib/schema.ts');
  for (const champ of ['place', 'kind', 'size', 'client']) {
    const m = src.match(new RegExp(`\\n  ${champ}: z[\\s\\S]*?\\.describe\\(\\s*['"\`]([^'"\`]+)`));
    assert.ok(m, `${champ} sans .describe()`);
    assert.match(m[1], /Absent = non affiché/, `${champ} : le describe doit dire qu'absent = non affiché`);
  }
  const client = src.match(/\n  client: z[\s\S]*?\.describe\(\s*['"`]([^'"`]+)/)[1];
  assert.match(client, /accord/);
  assert.match(client, /jamais un nom complet/);
});

test('site.ts : re-exporte les helpers de galerie ; ts-loader : loadGalerieModule', () => {
  assert.match(read('src/lib/site.ts'), /export \{ kindsDeGalerie, idDeKind, metaDeRealisation, libelleCompteur, COMPTEUR_MIN, SEPARATEUR_META \} from '\.\/galerie'/);
  assert.match(read('scripts/ff/ts-loader.mjs'), /export async function loadGalerieModule\(\)/);
  assert.doesNotMatch(read('src/lib/galerie.ts'), /^import (?!type )/m, 'module pur : aucun import runtime');
});

test('Proof/gallery.astro : vrais radios + labels (« Tout » en premier), filtres CSS :has() sans JS, rayon token, pas de pilule ni de point médian', () => {
  const src = read('src/sections/Proof/gallery.astro');
  assert.match(src, /<input class="sr-only" type="radio" name="galerie-kind" id="k-0" value="" checked \/>\s*<label for="k-0">Tout<\/label>/);
  assert.match(src, /<input class="sr-only" type="radio" name="galerie-kind" id=\{`k-\$\{i \+ 1\}`\}/);
  assert.match(src, /<legend class="sr-only">/);
  assert.match(src, /<fieldset/);
  assert.match(src, /\.galerie:has\(#k-1:checked\) \.realisation:not\(\[data-kind="1"\]\) \{ display: none; \}/);
  assert.match(src, /\.galerie:has\(#k-12:checked\)/, '12 règles statiques');
  assert.match(src, /data-kind=\{idx > 0 \? String\(idx\) : undefined\}/, 'une réalisation sans kind n’a pas de data-kind');
  assert.match(src, /border-radius: var\(--radius-ui\)/);
  assert.match(src, /input:focus-visible \+ label/, 'focus clavier visible sur l’étiquette');
  assert.match(src, /libelleCompteur\(gallery\.length\)/);
  assert.match(src, /metaDeRealisation\(img\)/);
  assert.match(src, /SEPARATEUR_META/);
  assert.doesNotMatch(src, /rounded-full|999px|radius-pill/, 'pas de pilule');
  assert.doesNotMatch(src, /[·—]/, 'ni point médian ni tiret cadratin');
  assert.doesNotMatch(src, /#[0-9a-f]{3,8}\b/i, 'aucune couleur en dur');
  assert.doesNotMatch(src, /<script/, 'les filtres se font sans JS');
  assert.doesNotMatch(src, /eyebrow|uppercase/, 'pas d’eyebrow, pas de capitales');
});

test('docs : DIRECTIONS (table proof), BRIEF (§ 8 : lieu, type, mesure, client par photo)', () => {
  const dir = read('docs/DIRECTIONS.md');
  assert.match(dir, /\| `gallery` \|[^\n]*place\/kind\/size\/client[^\n]*:has\(\)/);
  const brief = read('docs/BRIEF.md');
  const sec8 = brief.slice(brief.indexOf('## 8. Photos'), brief.indexOf('## 9.'));
  for (const mot of ['Lieu', 'Type de travaux', 'Mesure', 'Client', 'avec son accord']) assert.ok(sec8.includes(mot), `BRIEF § 8 sans « ${mot} »`);
});

test('fumigène : _exemple avec proof/gallery (FF_LOOK) rend les filtres radio, data-kind, la ligne de métadonnées et le compteur', { timeout: 180_000 }, () => {
  const astroJs = path.join(ROOT, 'node_modules', 'astro', 'astro.js');
  const outDir = 'dist/_test-galerie';
  const look = JSON.stringify({ layout: { sections: [{ type: 'proof', variant: 'gallery' }, { type: 'contact', variant: 'form-split' }] } });
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
  // Le CSS scoped de la section est inliné dans un <style> de la page (petite feuille) ou, selon la
  // taille, émis dans _astro/*.css : on cherche aux deux endroits.
  const astroDir = path.join(ROOT, outDir, '_astro');
  const cssFiles = fs.existsSync(astroDir) ? fs.readdirSync(astroDir).filter((f) => f.endsWith('.css')) : [];
  const css = [...cssFiles.map((f) => fs.readFileSync(path.join(astroDir, f), 'utf8')), ...[...html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1])].join('\n');
  fs.rmSync(path.join(ROOT, outDir), { recursive: true, force: true });
  const section = html.match(/<section id="proof"[\s\S]*?<\/section>/)?.[0];
  assert.ok(section, 'section proof absente');
  assert.match(section, /<fieldset[^>]*galerie-filtres/);
  // (Astro ajoute data-astro-cid-* sur chaque élément scoped : les regex tolèrent des attributs en plus)
  assert.match(section, /<input class="sr-only[^"]*" type="radio" name="galerie-kind" id="k-0" value="" checked[^>]*>\s*<label for="k-0"[^>]*>Tout<\/label>/);
  assert.match(section, /<label for="k-1"[^>]*>Cuisine<\/label>/);
  assert.match(section, /<label for="k-2"[^>]*>Escalier<\/label>/);
  assert.match(section, /<label for="k-3"[^>]*>Agencement<\/label>/);
  assert.equal((section.match(/type="radio"/g) || []).length, 4, 'Tout + 3 types');
  assert.equal((section.match(/data-kind="1"/g) || []).length, 2, 'deux cuisines');
  assert.match(section, /4 réalisations/);
  const sep = '<span aria-hidden="true"[^>]*> – </span>';
  assert.match(section, new RegExp(`<span[^>]*>Roubaix</span>${sep}<span[^>]*>Cuisine</span>${sep}<span[^>]*>14\u00a0m²</span>${sep}<span[^>]*>Claire D\.</span>`));
  assert.match(section, /<p class="realisation-meta[^"]*"[^>]*><span[^>]*>Tourcoing<\/span>/);
  assert.doesNotMatch(section, /·/, 'pas de point médian dans le texte visible');
  assert.doesNotMatch(section, /<script/);
  // Astro scope par attribut : `.galerie[data-astro-cid-x]:has(#k-1:checked) .realisation[data-astro-cid-x]:not([data-kind="1"])`
  assert.match(css, /\.galerie(?:\[data-astro-cid-[^\]]+\])?:has\(#k-1:checked\) \.realisation(?:\[data-astro-cid-[^\]]+\])?:not\(\[data-kind="1"\]\)\{display:none\}/, 'la règle :has() doit survivre au build');
  assert.match(css, /:has\(#k-3:checked\)[^{]*\[data-kind="3"\]/);
});
