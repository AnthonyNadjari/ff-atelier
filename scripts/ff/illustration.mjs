// `ff illustration <slug> "<theme>"` : unDraw n'a pas d'API REST publique documentee (docs/veille/
// ressources.md §3) — on tente quand meme l'endpoint utilise par leur propre site ; s'il ne repond pas
// en JSON exploitable, on l'affiche clairement et on renvoie la procedure manuelle, sans jamais
// planter. Quand un SVG est obtenu, on recolore le fill dominant (#6c63ff, couleur par defaut unDraw)
// avec --couleur avant d'ecrire le fichier.
//
// Usage : ff illustration <slug> "<theme>" [--couleur "#hex"]
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, resolveSlug, parseArgs, slugify, ok, fail, warn, info, c } from './util.mjs';

const COULEUR_PAR_DEFAUT_UNDRAW = '#6c63ff';
const HEX_RE = /^#[0-9a-fA-F]{6}$/;

function instructionsManuelles(theme) {
  info('');
  info('Procedure manuelle :');
  info(`  1. Ouvrir ${c.cyan(`https://undraw.co/search?q=${encodeURIComponent(theme)}`)}`);
  info('  2. Choisir une illustration, regler la couleur dans leur editeur, telecharger le SVG.');
  info('  3. Deposer le fichier dans sites/<slug>/public/images/illustrations/.');
}

function recolorer(svgText, couleur) {
  const re = new RegExp(COULEUR_PAR_DEFAUT_UNDRAW, 'gi');
  return svgText.replace(re, couleur);
}

/** Cherche recursivement une valeur plausible d'URL ou de contenu SVG dans une reponse JSON de forme inconnue. */
function extraireIllustration(data) {
  const items = Array.isArray(data) ? data : data?.illustrations || data?.results || data?.data;
  const premier = Array.isArray(items) ? items[0] : items;
  if (!premier || typeof premier !== 'object') return null;
  const svgInline = premier.svg || premier.media || (typeof premier.image === 'string' && premier.image.startsWith('<svg') ? premier.image : null);
  const svgUrl = premier.url || premier.image || premier.mediaUrl || premier.svgUrl;
  return { svgInline: typeof svgInline === 'string' ? svgInline : null, svgUrl: typeof svgUrl === 'string' ? svgUrl : null };
}

export async function cmdIllustration(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const theme = positional[1];
  if (!theme) {
    fail('Usage : ff illustration <slug> "<theme>" [--couleur "#hex"]');
    process.exit(1);
  }

  const couleur = flags.couleur ? String(flags.couleur) : COULEUR_PAR_DEFAUT_UNDRAW;
  if (!HEX_RE.test(couleur)) {
    fail(`--couleur invalide : "${couleur}". Attendu un hex a 6 chiffres, ex: --couleur "#ff6a3d".`);
    process.exit(1);
  }

  let svgText = null;
  try {
    const url = `https://undraw.co/api/illustrations?s=${encodeURIComponent(theme)}`;
    const res = await fetch(url, { headers: { Accept: 'application/json' } });
    if (!res.ok) {
      throw new Error(`unDraw a repondu ${res.status} (pas d'API publique documentee — attendu).`);
    }
    const ct = res.headers.get('content-type') || '';
    if (!ct.includes('json')) {
      throw new Error('Reponse non-JSON (page HTML probable, pas un vrai endpoint API).');
    }
    const data = await res.json();
    const trouve = extraireIllustration(data);
    if (!trouve || (!trouve.svgInline && !trouve.svgUrl)) {
      throw new Error("Reponse JSON recue mais sans SVG exploitable (forme de reponse inattendue).");
    }
    if (trouve.svgInline) {
      svgText = trouve.svgInline;
    } else {
      const svgRes = await fetch(trouve.svgUrl);
      if (!svgRes.ok) throw new Error(`Telechargement du SVG echoue (${svgRes.status}).`);
      svgText = await svgRes.text();
    }
  } catch (e) {
    fail(`Illustration automatique impossible : ${e.message}`);
    instructionsManuelles(theme);
    process.exit(1);
  }

  const outDir = path.join(SITES_DIR, slug, 'public', 'images', 'illustrations');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, `${slugify(theme)}.svg`);
  fs.writeFileSync(outPath, recolorer(svgText, couleur));
  ok(`sites/${slug}/public/images/illustrations/${slugify(theme)}.svg (recolore en ${couleur})`);
}
