// Style construit « barbotine » (veille du 30 oct 2026, tour 19, volet 2a quater, source laboroflovestudio.com, fiche
// docs/veille/styles/barbotine.md) : la construction relevée est codée (photo de l'atelier aux deux plaques et au nom géant,
// présentation centrée, plaques d'émail qui s'empilent, bloc menthe, cartes vertes, invitation et avis jaunes, pied vert,
// modèle de site entier, profil de mouvement), régime coloré doux.
import { test } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const lire = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const sansCommentaires = (s) => s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/<!--[\s\S]*?-->/g, '').replace(/^\s*\/\/.*$/gm, '');

test('Hero/barbotine : photo plein écran, deux plaques (prestation phare, téléphone), nom géant, métier à la ville', () => {
  const src = sansCommentaires(lire('src/sections/Hero/barbotine.astro'));
  assert.match(src, /\{hero && \(/, 'photo seulement si le client en a une');
  assert.match(src, /href=\{tel\(\)\}/, 'téléphone au premier écran');
  assert.match(src, /services\.find\(\(s\) => s\.featured\)/);
  assert.match(src, /\{phare && <a href=\{lienPhare\}/, 'sans service, la plaque verte garde le h1 sans lien');
  assert.match(src, /<h1 class="barbotine-plaque-titre hero-titre">\{metier\}<\/h1>/, 'h1 dans la plaque verte, comme la source');
  assert.match(src, /<p class="barbotine-nom[^>]*>\{mots\.map/, 'le nom du client en très grand, un mot par ligne au téléphone');
  assert.match(src, /flex-1 flex-col justify-center/, 'le nom centré dans la photo');
  assert.match(src, /business\.trade\} à \$\{site\.contact\.address\.city\}/, 'métier et ville dans le h1');
  assert.match(src, /var\(--email-1\)/);
  assert.match(src, /var\(--email-2\)/);
  assert.match(src, /prefers-reduced-motion: reduce\) \{ \.barbotine-plaque \{ animation: none/);
  assert.doesNotMatch(src, /·|—/, 'ni point médian ni tiret cadratin');
  assert.doesNotMatch(src, /data-split|data-parallax|autoplay/);
});

test('About/barbotine : présentation centrée, histoire du client, rien d’inventé', () => {
  const src = sansCommentaires(lire('src/sections/About/barbotine.astro'));
  assert.match(src, /id="about"/);
  assert.match(src, /paragraphs\(a\.story\)/);
  assert.match(src, /text-center/);
});

test('Services/barbotine : plaques d’émail qui collent et s’empilent, sans script, pile au téléphone ; bloc menthe des engagements', () => {
  const src = sansCommentaires(lire('src/sections/Services/barbotine.astro'));
  assert.match(src, /id="services"/);
  assert.match(src, /title=|site\.wording\.servicesTitle/);
  assert.match(src, /var\(--email-1\)', 'var\(--email-2\)', 'var\(--email-3\)', 'var\(--email-4\)/, 'un émail par plaque, tokens seulement');
  assert.match(src, /position: sticky; top: calc\(6rem \+ var\(--rang\) \* 14px\)/);
  assert.match(src, /@media \(min-width: 48rem\) and \(min-height: 44rem\) and \(prefers-reduced-motion: no-preference\)/, 'collage seulement à l’ordinateur, écran haut, hors mouvement réduit');
  assert.match(src, /\[s\.priceFrom, \.\.\.s\.bullets\]\.filter\(Boolean\)/, 'faits du brief seulement');
  assert.match(src, /\{s\.image && \(/, 'photo seulement si le service en a une');
  assert.match(src, /\{valeurs\.length > 0 && \(/, 'bloc menthe seulement avec des engagements');
  assert.doesNotMatch(src, /<script/, 'aucun script : collage natif');
  assert.doesNotMatch(src, /<Icon\b|data-scrub|data-pin/);
});

test('Proof/barbotine : cartes vertes des réalisations, seulement avec deux photos libres', () => {
  const src = sansCommentaires(lire('src/sections/Proof/barbotine.astro'));
  assert.match(src, /id="proof"/);
  assert.match(src, /\{cartes\.length >= 2 && \(/);
  assert.match(src, /g\.kind \?\? g\.place \?\? g\.alt/);
  assert.doesNotMatch(src, /★|<Icon\b/);
});

test('Contact/barbotine : invitation courte sur carte crème posée sur le sable (portes, sans formulaire), puis avis jaunes', () => {
  const src = sansCommentaires(lire('src/sections/Contact/barbotine.astro'));
  assert.match(src, /id="contact"/);
  assert.match(src, /href=\{tel\(\)\}/);
  assert.match(src, /\{horaires\.length > 0 && \(/);
  assert.doesNotMatch(src, /ContactForm/, 'pas de formulaire générique : la fin reste courte, comme la source');
  assert.match(src, /\{\(avis\.length > 0 \|\| google\) && \(/, 'sans avis ni note, pas de rangée');
  assert.match(src, /tabindex="0"/, 'rangée atteignable au clavier');
  assert.match(src, /var\(--email-signal\)/);
  assert.doesNotMatch(src, /★|<Icon\b|grain|noise/);
});

test('Footer/barbotine : pied vert au nom centré, trois colonnes, mentions', () => {
  const src = sansCommentaires(lire('src/sections/Footer/barbotine.astro'));
  assert.match(src, /bg-ink text-on-ink/);
  assert.match(src, /\/mentions-legales/);
  assert.match(src, /\{reseaux\.length > 0 && \(/);
});

test('presets/barbotine.json : modèle de site entier, fin de page de la source, pas de barre basse ; deuxième modèle différent', () => {
  const m = JSON.parse(lire('presets/barbotine.json'));
  assert.equal(m.nom, 'barbotine');
  assert.equal(m.look.direction, 'barbotine');
  assert.equal(m.look.layout.hero, 'barbotine');
  assert.equal(m.look.layout.nav, 'minimal');
  assert.deepEqual(m.look.layout.sections.map((x) => `${x.type}/${x.variant}`), ['about/barbotine', 'services/barbotine', 'proof/barbotine', 'contact/barbotine']);
  assert.equal(m.look.layout.footer, 'barbotine');
  for (const t of ['zones', 'faq', 'cta']) assert.ok(!m.look.layout.sections.some((x) => x.type === t), `pas de ${t}`);
  assert.equal(m.look.layout.actionBar, false);
  const b = JSON.parse(lire('presets/barbotine-cours.json'));
  assert.equal(b.look.direction, 'barbotine');
  assert.notEqual(b.look.layout.hero, 'barbotine');
});

test('direction barbotine : Gloock et Nunito hors liste IA, crème beurre (coloré doux), émaux en tokens, courbe vraie', async () => {
  const css = lire('src/directions/barbotine/index.css');
  const { POLICES_IA } = await import('../scripts/ff/ia.mjs');
  for (const fam of [...css.matchAll(/--font-(?:display|body|mono):\s*'([^']+)'/g)].map((x) => x[1])) {
    assert.ok(['Gloock', 'Nunito Variable'].includes(fam), fam);
    assert.ok(!POLICES_IA.some((p) => fam.toLowerCase().startsWith(p)), fam);
  }
  assert.match(css, /--bg: #fff3d1;/);
  for (const t of ['--email-1', '--email-2', '--email-3', '--email-4', '--email-signal', '--on-email', '--sable']) assert.match(css, new RegExp(`${t}:`));
  assert.match(css, /--ease-brand: cubic-bezier\(/);
  const { regimePalette } = await import('../scripts/ff/melanger.mjs');
  const atome = JSON.parse(lire('docs/veille/styles/atomes/barbotine.json'));
  assert.equal(regimePalette(atome.couleurs).regime, 'colore-doux');
});

test('profil de mouvement plaques-qui-s-empilent : vivant, sans exigence, documenté, porté par l’atome', async () => {
  const { PROFILS_MOUVEMENT, refusProfil } = await import('../scripts/ff/mouvements.mjs');
  const p = PROFILS_MOUVEMENT['plaques-qui-s-empilent'];
  assert.ok(p);
  assert.equal(p.calme, false);
  assert.deepEqual(p.exige, {});
  assert.ok(refusProfil('plaques-qui-s-empilent', { mouvement: 'calme', video: null, largeurMax: 0, avis: 0 }), 'refusé à un client calme');
  assert.match(lire('docs/veille/styles/MOUVEMENTS.md'), /### `plaques-qui-s-empilent`/);
  assert.equal(JSON.parse(lire('docs/veille/styles/atomes/barbotine.json')).mouvement.profil, 'plaques-qui-s-empilent');
});
