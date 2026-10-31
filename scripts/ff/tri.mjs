// `ff tri <url> [<url> …] [--fichier liste.txt] [--garder 3] [--seuil 0.65] [--seuil-linearite x]`
// TRI de candidats pour la veille : SCANNER BEAUCOUP de sites, en GARDER PEU, et seulement des vraiment différents.
//
// Pourquoi (31 oct 2026, fondateur) : « je préfère scanner beaucoup plus de sites par jour et en sélectionner moins,
// mais être plus strict et avoir des trucs vraiment différents ».
//
// Pour chaque URL, une à la fois (Chrome sans tête, timeout 45 s, bannière cookies jamais cliquée, robots.txt lu et
// respecté pour l'agent « * », page de défi ou HTTP >= 400 = « refusé ») : au téléphone 390x844 puis à l'ordinateur
// 1400x900, empreinte du premier écran (même grille que `ff ressemblance`), déroulé (téléphone ; pages du site =
// pages internes liées du menu et du pied, faute de dist/) et disposition (formes des blocs + linéarité,
// scripts/ff/disposition.mjs) ; à l'ordinateur, les mesures légères de peinture de `ff atomes mesurer` (polices,
// couleurs, formes, photos : un seul passage dans la page).
//
// Comparaison à TOUT le registre de l'usine (docs/empreintes/) ET aux sources déjà gardées
// (docs/veille/styles/tri/registre.json, versionné : chaque candidat mesuré y entre, gardé ou non, avec sa date ; une
// URL déjà triée n'est jamais re-scannée). NOUVEAUTÉ = 1 − la plus forte ressemblance (premier écran téléphone ou
// ordinateur, déroulé, disposition) contre l'usine et les sources gardées. Refus durs : linéarité au-dessus du seuil
// (« linéaire »), une ressemblance au-dessus de --seuil (« trop proche de … »), refusé par le site ou robots.txt.
// Les --garder N meilleurs non refusés sont gardés, sans garder deux candidats de ce tri trop proches entre eux.
// Sorties : tableau en français, docs/veille/styles/tri/<date>.json, captures/tri/<cle>-m.jpg et la planche des
// premiers écrans téléphone des gardés captures/planches/tri-<date>.jpg.
// Fonctions pures (cleUrl, lireListe, comparer, trier, ligneTableau, compacter) : tests/tri.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, fail, info, warn, parseArgs } from './util.mjs';
import { releverPremierEcran, empreinteMode, similarite, ceQuiEstPareil, lireRegistre, lancerChrome, defilerJusquEnBas, MODES, SEUIL_RESSEMBLANCE } from './ressemblance.mjs';
import { releverDeroule, empreinteDeroule, similariteDeroule, ceQuiEstPareilDeroule } from './deroule.mjs';
import { installerMesureForme, disposition, similariteDisposition, ceQuiEstPareilDisposition, suiteEnMotsFormes, rafraichirDisposition, SEUIL_LINEARITE } from './disposition.mjs';
import { validerUrl, raisonBlocage, TIMEOUT_MS } from './demonter.mjs';
import { lireRobots, robotsAutorise } from './refonte.mjs';
import { releverPeinture } from './atomes-mesurer.mjs';

export const DOSSIER_TRI = path.join(ROOT, 'docs', 'veille', 'styles', 'tri');
export const REGISTRE_TRI = path.join(DOSSIER_TRI, 'registre.json');
const CAPTURES_TRI = path.join(ROOT, 'captures', 'tri');
const ATTENTE = 1500;

/* ---------- fonctions pures ---------- */

/** Pure : clé d'une URL (hôte sans www, chemin sans barre finale, sans requête ni ancre). */
export function cleUrl(url) {
  const u = new URL(validerUrl(url));
  const chemin = u.pathname.replace(/\/+$/, '').replace(/\/index\.html?$/i, '');
  return `${u.hostname.toLowerCase().replace(/^www\./, '')}${chemin}`;
}

/** Pure : URLs d'un fichier liste (une par ligne, # commentaire, lignes vides ignorées ; doublons retirés). */
export function lireListe(texte) {
  const vues = new Set(), out = [];
  for (const brute of String(texte || '').split(/\r?\n/)) {
    const l = brute.replace(/#.*$/, '').trim();
    if (!l) continue;
    const url = /^https?:\/\//i.test(l) ? l : `https://${l}`;
    let k;
    try { k = cleUrl(url); } catch { continue; }
    if (vues.has(k)) continue;
    vues.add(k);
    out.push(url);
  }
  return out;
}

/** Pure : ressemblances d'un candidat à une référence (usine ou source gardée) ; null par axe absent. */
export function ressemblances(c, r) {
  return {
    m: c.m && r.m ? similarite(c.m, r.m) : null,
    d: c.d && r.d ? similarite(c.d, r.d) : null,
    deroule: c.deroule?.roles && r.deroule?.roles ? similariteDeroule(c.deroule, r.deroule) : null,
    disposition: c.disposition && r.disposition ? similariteDisposition(c.disposition, r.disposition) : null,
  };
}

const AXES = { m: 'premier écran (téléphone)', d: 'premier écran (ordinateur)', deroule: 'déroulé', disposition: 'disposition' };
/** Pure : ce qui est pareil sur un axe, en mots. */
export function pareilSur(axe, c, r) {
  if (axe === 'm' || axe === 'd') return ceQuiEstPareil(c[axe], r[axe]);
  if (axe === 'deroule') return ceQuiEstPareilDeroule(c.deroule, r.deroule);
  return ceQuiEstPareilDisposition(c.disposition, r.disposition);
}

/**
 * Pure : compare un candidat à des références [{ nom, ...empreinte }] : la plus forte ressemblance (tous axes), son
 * axe et ce qui est pareil, et la nouveauté = 1 − cette ressemblance (1 sans référence comparable).
 */
export function comparer(c, refs) {
  let meilleur = null;
  for (const r of refs) {
    const s = ressemblances(c, r);
    for (const [axe, v] of Object.entries(s)) if (v != null && (!meilleur || v > meilleur.valeur)) meilleur = { nom: r.nom, axe, valeur: v, ref: r };
  }
  if (!meilleur) return { nouveaute: 1, proche: null };
  return { nouveaute: Math.round((1 - meilleur.valeur) * 1000) / 1000, proche: { nom: meilleur.nom, axe: meilleur.axe, valeur: meilleur.valeur, pareil: `${AXES[meilleur.axe]} : ${pareilSur(meilleur.axe, c, meilleur.ref)}` } };
}

/**
 * Pure : verdicts d'un lot de candidats mesurés. candidats = [{ url, cle, empreinte|null, refus|null }], refs = usine +
 * sources gardées. Refus durs : refus (site, robots), linéarité > seuilLin, ressemblance > seuil. Puis les non refusés
 * par nouveauté décroissante ; les `garder` premiers gardés, sauf trop proche d'un gardé du même lot.
 */
export function trier(candidats, refs, { garder = 3, seuil = SEUIL_RESSEMBLANCE, seuilLin = SEUIL_LINEARITE } = {}) {
  const lignes = candidats.map((c) => {
    if (c.refus || !c.empreinte) return { ...c, verdict: 'refuser', pourquoi: `refusé : ${c.refus || 'non mesuré'}`, nouveaute: null, linearite: null };
    const e = c.empreinte;
    const cmp = comparer(e, refs);
    const linearite = e.disposition?.linearite ?? null;
    const l = { ...c, nouveaute: cmp.nouveaute, proche: cmp.proche, linearite, formes: e.disposition ? suiteEnMotsFormes(e.disposition.d || e.disposition.m, 6) : '' };
    if (linearite != null && linearite > seuilLin) return { ...l, verdict: 'refuser', pourquoi: `linéaire (${linearite.toFixed(2)} > ${seuilLin})` };
    if (cmp.proche && cmp.proche.valeur > seuil) return { ...l, verdict: 'refuser', pourquoi: `trop proche de ${cmp.proche.nom} (${cmp.proche.valeur.toFixed(2)}, ${AXES[cmp.proche.axe]})` };
    return { ...l, verdict: null };
  });
  const libres = lignes.filter((l) => l.verdict === null).sort((x, y) => y.nouveaute - x.nouveaute);
  const gardes = [];
  for (const l of libres) {
    if (gardes.length >= garder) { l.verdict = 'refuser'; l.pourquoi = `pas dans les ${garder} plus nouveaux du tri`; continue; }
    const cmp = comparer(l.empreinte, gardes.map((g) => ({ nom: g.url, ...g.empreinte })));
    if (cmp.proche && cmp.proche.valeur > seuil) { l.verdict = 'refuser'; l.pourquoi = `trop proche de ${cmp.proche.nom}, gardé dans ce tri (${cmp.proche.valeur.toFixed(2)}, ${AXES[cmp.proche.axe]})`; continue; }
    l.verdict = 'garder'; l.pourquoi = `nouveauté ${l.nouveaute.toFixed(2)}`;
    gardes.push(l);
  }
  const rang = (l) => (l.verdict === 'garder' ? 0 : l.nouveaute != null ? 1 : 2);
  return lignes.sort((x, y) => rang(x) - rang(y) || (y.nouveaute ?? -1) - (x.nouveaute ?? -1));
}

/** Pure : une ligne du tableau en français. */
export function ligneTableau(l) {
  const n = (x) => (x == null ? '—' : x.toFixed(2));
  const proche = l.proche ? `${l.proche.nom} ${n(l.proche.valeur)} (${l.proche.pareil})` : '—';
  return `${l.verdict === 'garder' ? 'GARDER ' : 'refuser'}  ${l.url}\n           nouveauté ${n(l.nouveaute)} · linéarité ${n(l.linearite)} · formes : ${l.formes || '—'}\n           plus proche : ${proche}\n           pourquoi : ${l.pourquoi}`;
}

/** Pure : empreinte compacte pour le registre (ce que les comparaisons lisent, sans les boîtes). */
export function compacter(e) {
  if (!e) return null;
  const mode = (x) => (x ? { vw: x.vw, vh: x.vh, h1Texte: x.h1Texte, grille: x.grille, mesures: x.mesures } : null);
  return { m: mode(e.m), d: mode(e.d), deroule: e.deroule ? { roles: e.deroule.roles, site: e.deroule.site } : null, disposition: e.disposition || null, peinture: e.peinture || null };
}

/** Pure : peinture compacte (mesures légères de ff atomes mesurer). */
export function peintureCompacte(p) {
  if (!p) return null;
  return {
    h1: p.typo?.h1 ? { famille: p.typo.h1.famille, taille: p.typo.h1.taille, graisse: p.typo.h1.graisse, casse: p.typo.h1.casse } : null,
    texte: p.typo?.texte ? { famille: p.typo.texte.famille, taille: p.typo.texte.taille } : null,
    fondPage: p.couleurs?.fondPage ?? null,
    fonds: (p.couleurs?.fonds || []).slice(0, 4), textes: (p.couleurs?.textes || []).slice(0, 3),
    boutons: p.formes?.boutons ? { rayon: p.formes.boutons.rayon, pilules: p.formes.boutons.pilules, n: p.formes.boutons.n } : null,
    photos: p.photos ? { n: p.photos.n, rayon: p.photos.rayon, pleinCadre: p.photos.pleinCadre, rapports: p.photos.rapports } : null,
  };
}

/* ---------- registre ---------- */

export function lireRegistreTri(fichier = REGISTRE_TRI) {
  try { const r = JSON.parse(fs.readFileSync(fichier, 'utf8')); return { candidats: r.candidats || {} }; } catch { return { candidats: {} }; }
}

/** Références : sites de l'usine + sources gardées du tri. */
export function references(regTri) {
  const usine = lireRegistre().map((e) => ({ nom: e.slug, ...e }));
  const gardees = Object.values(regTri.candidats).filter((c) => c.verdict === 'garder' && c.empreinte).map((c) => ({ nom: c.url, ...c.empreinte, disposition: rafraichirDisposition(c.empreinte.disposition) }));
  return [...usine, ...gardees];
}

/* ---------- navigateur ---------- */

async function robotsPermet(ctx, url) {
  const u = new URL(url);
  try {
    const r = await ctx.request.get(`${u.origin}/robots.txt`, { timeout: 15_000, failOnStatusCode: false });
    if (r.status() >= 400) return true;
    const { regles } = lireRobots(await r.text(), 'finckfisch-tri');
    return robotsAutorise(regles, u.pathname + u.search);
  } catch { return true; }
}

/** Mesure un candidat en ligne (les deux modes) ; rend { empreinte } ou { refus }. */
export async function mesurerCandidat(navigateur, url, { sharp, cle }) {
  const e = { url, date: new Date().toISOString().slice(0, 10) };
  const releves = {};
  for (const [k, M] of Object.entries(MODES)) {
    const ctx = await navigateur.newContext({ viewport: { width: M.vw, height: M.vh }, isMobile: M.mobile, hasTouch: M.mobile, deviceScaleFactor: 1, locale: 'fr-FR', acceptDownloads: false });
    const page = await ctx.newPage();
    await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
    try {
      if (k === 'm' && !(await robotsPermet(ctx, url))) return { refus: 'robots.txt interdit cette page' };
      let statut = null;
      try { const rep = await page.goto(url, { waitUntil: 'load', timeout: TIMEOUT_MS }); statut = rep ? rep.status() : null; }
      catch (err) {
        const t = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
        if (!t.trim()) return { refus: `pas de réponse en ${TIMEOUT_MS / 1000} s` };
      }
      await page.waitForTimeout(ATTENTE);
      const etat = await page.evaluate(() => ({ title: document.title, texte: (document.body?.innerText || '').slice(0, 2000) })).catch(() => ({}));
      const blocage = raisonBlocage({ statut, ...etat });
      if (blocage) return { refus: blocage };
      e[k] = empreinteMode(await page.evaluate(releverPremierEcran));
      if (k === 'm') {
        fs.mkdirSync(CAPTURES_TRI, { recursive: true });
        await sharp(await page.screenshot()).jpeg({ quality: 72 }).toFile(path.join(CAPTURES_TRI, `${cle.replace(/[^a-z0-9.-]+/gi, '_')}-m.jpg`));
      }
      await defilerJusquEnBas(page);
      await installerMesureForme(page);
      const rel = await page.evaluate(releverDeroule, { sansHtml: k !== 'm' });
      releves[k] = rel;
      if (k === 'm') {
        const n = new Set([...rel.nav.pages, ...rel.pied.pages]).size;
        e.deroule = empreinteDeroule(rel, { html: n + 1, contenu: n });
      } else {
        e.peinture = peintureCompacte(await page.evaluate(releverPeinture).catch(() => null));
      }
    } catch (err) {
      return { refus: `erreur de mesure (${String(err.message || err).split('\n')[0].slice(0, 120)})` };
    } finally {
      await ctx.close().catch(() => {});
    }
  }
  e.disposition = disposition(releves);
  if (process.env.FF_FORME_BRUT) {
    fs.mkdirSync(process.env.FF_FORME_BRUT, { recursive: true });
    const brut = Object.fromEntries(Object.entries(releves).map(([k, r]) => [k, { vw: r.vw, vh: r.vh, pageForme: r.pageForme, blocs: r.blocs.map(({ html, ...b }) => b) }]));
    fs.writeFileSync(path.join(process.env.FF_FORME_BRUT, `tri-${cle.replace(/[^a-z0-9.-]+/gi, '_')}.json`), JSON.stringify(brut));
  }
  return { empreinte: e };
}

async function planche(gardes, sharp, date) {
  if (!gardes.length) return null;
  const L = 260, H = Math.round(L * 844 / 390), E = 22;
  const cols = [];
  for (const g of gardes) {
    const cap = path.join(CAPTURES_TRI, `${g.cle.replace(/[^a-z0-9.-]+/gi, '_')}-m.jpg`);
    if (!fs.existsSync(cap)) continue;
    const fond = await sharp(cap).resize(L, H, { fit: 'cover', position: 'top' }).png().toBuffer();
    const t = `${g.cle.slice(0, 30)} · ${g.nouveaute.toFixed(2)}`.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const eti = Buffer.from(`<svg width="${L}" height="${E}"><rect width="${L}" height="${E}" fill="#ff0"/><text x="4" y="15" font-size="12" font-family="Arial">${t}</text></svg>`);
    cols.push(await sharp({ create: { width: L, height: H + E, channels: 3, background: '#fff' } }).composite([{ input: eti, top: 0, left: 0 }, { input: fond, top: E, left: 0 }]).png().toBuffer());
  }
  if (!cols.length) return null;
  fs.mkdirSync(path.join(ROOT, 'captures', 'planches'), { recursive: true });
  const sortie = path.join(ROOT, 'captures', 'planches', `tri-${date}.jpg`);
  await sharp({ create: { width: cols.length * (L + 6), height: H + E, channels: 3, background: '#777' } })
    .composite(cols.map((input, i) => ({ input, left: i * (L + 6), top: 0 }))).jpeg({ quality: 78 }).toFile(sortie);
  return path.relative(ROOT, sortie);
}

/* ---------- commande ---------- */

export async function cmdTri(args) {
  const { positional, flags } = parseArgs(args);
  const garder = flags.garder != null && flags.garder !== true ? Number(flags.garder) : 3;
  const seuil = flags.seuil != null && flags.seuil !== true ? Number(flags.seuil) : SEUIL_RESSEMBLANCE;
  const seuilLin = flags['seuil-linearite'] != null && flags['seuil-linearite'] !== true ? Number(flags['seuil-linearite']) : SEUIL_LINEARITE;
  let urls = [...positional];
  if (flags.fichier) {
    const f = path.resolve(ROOT, String(flags.fichier));
    if (!fs.existsSync(f)) { fail(`Fichier introuvable : ${f}`); process.exit(1); }
    urls.push(...lireListe(fs.readFileSync(f, 'utf8')));
  }
  urls = lireListe(urls.join('\n'));
  if (!urls.length) { fail('Usage : ff tri <url> [<url> …] [--fichier liste.txt] [--garder 3] [--seuil 0.65] [--seuil-linearite x]'); process.exit(1); }

  const reg = lireRegistreTri();
  const aMesurer = [];
  for (const url of urls) {
    const cle = cleUrl(url);
    const deja = reg.candidats[cle];
    if (deja) info(`déjà trié le ${deja.date} : ${url} (${deja.verdict}${deja.pourquoi ? `, ${deja.pourquoi}` : ''}) : pas re-scanné.`);
    else aMesurer.push({ url, cle });
  }
  if (!aMesurer.length) { ok('Rien de nouveau à trier.'); return; }
  const refs = references(reg);
  info(`Tri de ${aMesurer.length} candidat(s) contre ${refs.length} références (usine + sources gardées), seuils : ressemblance ${seuil}, linéarité ${seuilLin}, garder ${garder}.`);

  const { chromium } = await import('playwright-core');
  const sharp = (await import('sharp')).default;
  const proxy = process.env.HTTPS_PROXY || process.env.https_proxy;
  const navigateur = await lancerChrome(chromium, { args: ['--disable-blink-features=AutomationControlled'], ...(proxy ? { proxy: { server: proxy, bypass: '127.0.0.1,localhost' } } : {}) });
  const mesures = [];
  try {
    for (const c of aMesurer) {
      const t0 = Date.now();
      const r = await mesurerCandidat(navigateur, c.url, { sharp, cle: c.cle });
      mesures.push({ ...c, ...r });
      (r.refus ? warn : ok)(`${c.url} : ${r.refus ? `refusé (${r.refus})` : `mesuré, linéarité ${r.empreinte.disposition.linearite ?? '?'}`} en ${Math.round((Date.now() - t0) / 1000)} s`);
    }
  } finally {
    await navigateur.close().catch(() => {});
  }

  const lignes = trier(mesures, refs, { garder, seuil, seuilLin });
  info('');
  for (const l of lignes) (l.verdict === 'garder' ? ok : fail)(ligneTableau(l));

  const date = new Date().toISOString().slice(0, 10);
  for (const l of lignes) reg.candidats[l.cle] = { url: l.url, date, verdict: l.verdict, pourquoi: l.pourquoi, nouveaute: l.nouveaute, linearite: l.linearite, proche: l.proche ? { nom: l.proche.nom, axe: l.proche.axe, valeur: l.proche.valeur } : null, empreinte: compacter(l.empreinte) };
  fs.mkdirSync(DOSSIER_TRI, { recursive: true });
  fs.writeFileSync(REGISTRE_TRI, JSON.stringify({ note: 'Registre de ff tri (scripts/ff/tri.mjs) : chaque candidat mesuré, gardé ou non. Une URL présente n\'est jamais re-scannée.', candidats: reg.candidats }, null, 1) + '\n');
  const fichierJour = path.join(DOSSIER_TRI, `${date}.json`);
  let jour = [];
  try { jour = JSON.parse(fs.readFileSync(fichierJour, 'utf8')).lignes || []; } catch {}
  jour.push(...lignes.map((l) => ({ url: l.url, cle: l.cle, verdict: l.verdict, pourquoi: l.pourquoi, nouveaute: l.nouveaute, linearite: l.linearite, formes: l.formes || null, proche: l.proche || null })));
  fs.writeFileSync(fichierJour, JSON.stringify({ date, seuil, seuilLinearite: seuilLin, garder, lignes: jour }, null, 1) + '\n');
  const gardes = lignes.filter((l) => l.verdict === 'garder');
  const plan = await planche(gardes, sharp, date);
  info('');
  ok(`${gardes.length} gardé(s) sur ${lignes.length} : ${gardes.map((g) => g.url).join(', ') || 'aucun'}.`);
  info(`Registre : ${path.relative(ROOT, REGISTRE_TRI)} ; tri du jour : ${path.relative(ROOT, fichierJour)}${plan ? ` ; planche : ${plan}` : ''}.`);
}
