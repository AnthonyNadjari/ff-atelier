// `ff photos-demo <slug> "<requête>" ["<requête>" …] [--n 6] [--services "slug=requête;slug2=requête"]`
// Photos d'ILLUSTRATION pour un site de DÉMONSTRATION, en une commande (29 oct 2026 : « les démos sont
// monotones, sans photo »). Refus clair hors démo (garde de scripts/ff/garde-donnees.mjs : legal.demo, slug
// _…/demo-…, « // DEMO » en tête) : une photo de banque n'est jamais présentée comme celle d'un client.
//
// Sans clé : Wikimedia Commons d'abord (originaux en pleine résolution), Openverse en repli. Licences
// réutilisables seulement (CC0, domaine public, CC BY, CC BY-SA ; jamais NC/ND). La première requête donne le
// premier écran (paysage franc, ≥ 1 600 px, recadré 3:2), puis la galerie (n − 1 photos, ≥ 1 200 px, 4:3)
// répartie entre les requêtes ; --services donne une photo 4:3 par service nommé. Choix automatique : licence
// la plus permissive, résolution, ratio, netteté mesurée (variance du laplacien), pas de logo ni de texte
// incrusté quand les métadonnées le disent (fonctions pures : scripts/ff/illustrations.mjs).
//
// Pipeline existant : raw/hero.jpg, raw/galerie-<i>.jpg, raw/service-<slug>.jpg -> `ff images` (AVIF/WebP
// multi-largeurs + images.json) ; CREDITS.md (un bloc par photo, /credits les liste toutes en « Photo
// d'illustration ») ; site.config.ts : images.hero, images.illustration: true, proof.gallery, services[].image.
// Chaque photo porte sur le site la mention visible « Photo d’illustration » (src/components/Img.astro).
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import { SITES_DIR, resolveSlug, parseArgs, ok, fail, warn, info, c } from './util.mjs';
import { chercherWikimedia, chercherOpenverse, telecharger, blocCredits, poserCredits, traduire, cadreCible, nettete, SEUIL_NETTETE } from './photos.mjs';
import { cmdImages } from './images.mjs';
import { gardeDemo, trierCandidats, cleCandidat, repartir, parseServices, altDepuisTitre, ecrireConfig, photosDeBanque, MIN_LARGEUR, RATIO, RATIO_PAYSAGE_MIN } from './illustrations.mjs';

const USAGE = 'Usage : ff photos-demo <slug> "<requête>" ["<requête>" …] [--n 6] [--services "slug=requête;slug2=requête"]';
const LARGEUR_MAX = { hero: 2400, galerie: 1600, service: 1600 };

/**
 * Couleur moyenne (écart max − min des canaux RVB sur une miniature 64 px, 0 = gris). Une photo d'archive en noir et
 * blanc (relevés HABS de Wikimedia, fréquents sur « brewery ») rendait la démo plus triste encore (29 oct 2026).
 */
export const SEUIL_COULEUR = 12;
async function couleur(buf) {
  const { data, info: m } = await sharp(buf).rotate().resize(64, 64, { fit: 'inside' }).removeAlpha().raw().toBuffer({ resolveWithObject: true });
  let s = 0;
  for (let i = 0; i < data.length; i += m.channels) s += Math.max(data[i], data[i + 1], data[i + 2]) - Math.min(data[i], data[i + 1], data[i + 2]);
  return s / (data.length / m.channels);
}

/** Dimensions affichées (orientation EXIF 5 à 8 = photo tournée d'un quart). */
function dims(meta) {
  return meta.orientation >= 5 ? { w: meta.height, h: meta.width } : { w: meta.width, h: meta.height };
}

/** Wikimedia d'abord, Openverse si Wikimedia ne suffit pas ; requête raccourcie d'un mot tant qu'il manque. */
async function chercher(requete, role, besoin) {
  const { requeteEn } = traduire(requete);
  const minLargeur = MIN_LARGEUR[role];
  const mots = requeteEn.split(/\s+/).filter(Boolean);
  const tous = [];
  const vus = new Set();
  const ajouter = (liste) => { for (const x of liste) { const k = cleCandidat(x); if (!vus.has(k)) { vus.add(k); tous.push(x); } } };
  for (const [source, fn] of [['wikimedia', chercherWikimedia], ['openverse', chercherOpenverse]]) {
    for (let k = mots.length; k >= Math.min(2, mots.length); k--) {
      try {
        ajouter(await fn({ requeteEn: mots.slice(0, k).join(' '), n: 40, orientation: role === 'hero' ? 'landscape' : '', minLargeur }));
      } catch (e) {
        warn(`${source} « ${mots.slice(0, k).join(' ')} » : ${e.message}`);
      }
      if (trierCandidats(tous, { role }).length >= besoin * 3) break;
    }
    if (trierCandidats(tous, { role }).length >= besoin * 3) break;
  }
  return tous;
}

/** Télécharge les meilleurs candidats dans l'ordre et garde les `besoin` premiers vraiment exploitables. */
async function retenir(cands, role, besoin, pris) {
  const gardes = [];
  for (const cand of trierCandidats(cands, { role, exclus: pris })) {
    if (gardes.length >= besoin) break;
    if (pris.has(cleCandidat(cand))) continue;
    try {
      const buf = await telecharger(cand.fullUrl);
      const { w, h } = dims(await sharp(buf).metadata());
      if (w < Math.min(MIN_LARGEUR[role], 1200)) { info(c.dim(`  écartée : ${String(cand.title).slice(0, 50)} (fichier ${w} px)`)); continue; }
      if (role === 'hero' && (w < MIN_LARGEUR.hero || w / h < RATIO_PAYSAGE_MIN)) { info(c.dim(`  écartée pour le premier écran : ${String(cand.title).slice(0, 50)} (${w}x${h})`)); continue; }
      const coul = await couleur(buf);
      if (coul < SEUIL_COULEUR) { info(c.dim(`  écartée : ${String(cand.title).slice(0, 50)} (noir et blanc ou presque, ${coul.toFixed(0)})`)); continue; }
      const net = await nettete(buf);
      if (net < SEUIL_NETTETE) { info(c.dim(`  écartée : ${String(cand.title).slice(0, 50)} (floue, ${net.toFixed(0)})`)); continue; }
      pris.add(cleCandidat(cand));
      gardes.push({ cand, buf });
    } catch (e) {
      info(c.dim(`  écartée : ${String(cand.title).slice(0, 50)} (${e.message})`));
    }
  }
  return gardes;
}

/** Retire les anciens fichiers d'une précédente passe (raw/galerie-*.jpg, leurs dérivés, leurs blocs CREDITS.md). */
function nettoyerAnciennes(slug, prefixe) {
  const dir = path.join(SITES_DIR, slug);
  const re = new RegExp(`^${prefixe}(?:-\\d{3,4})?\\.(jpg|webp|avif)$`);
  for (const sous of ['raw', 'public/images']) {
    const d = path.join(dir, sous);
    if (!fs.existsSync(d)) continue;
    for (const f of fs.readdirSync(d)) if (re.test(f)) fs.rmSync(path.join(d, f));
  }
  const cp = path.join(dir, 'CREDITS.md');
  if (fs.existsSync(cp)) {
    const blocs = fs.readFileSync(cp, 'utf8').split(/\n(?=## )/);
    const reB = new RegExp(`^## raw/${prefixe}\\.jpg `);
    fs.writeFileSync(cp, blocs.filter((b) => !reB.test(b)).join('\n'));
  }
  const mp = path.join(dir, 'images.json');
  if (fs.existsSync(mp)) {
    const m = JSON.parse(fs.readFileSync(mp, 'utf8'));
    for (const k of Object.keys(m)) if (new RegExp(`^${prefixe}$`).test(k)) delete m[k];
    fs.writeFileSync(mp, JSON.stringify(m, null, 2) + '\n');
  }
}

async function poser(slug, { cand, buf }, nom, role, requete) {
  const { w, h } = dims(await sharp(buf).metadata());
  const cadre = cadreCible(w, h, RATIO[role], LARGEUR_MAX[role]);
  const rawDir = path.join(SITES_DIR, slug, 'raw');
  fs.mkdirSync(rawDir, { recursive: true });
  await sharp(buf).rotate()
    .resize({ width: cadre.width, height: cadre.height, fit: 'cover', position: sharp.strategy.attention, withoutEnlargement: true })
    .jpeg({ quality: 90, mozjpeg: true })
    .toFile(path.join(rawDir, `${nom}.jpg`));
  const ratioTexte = role === 'hero' ? '3:2' : '4:3';
  poserCredits(slug, blocCredits(cand, `raw/${nom}.jpg -> public/images/${nom}.webp (via ff images)`, { ratio: ratioTexte, dateDuJour: new Date().toISOString().slice(0, 10) }) + "\n- Usage : Photo d'illustration (site de démonstration, ff photos-demo)");
  ok(`${nom}.jpg ${cadre.width}x${cadre.height} — ${cand.licence.toUpperCase()} — ${String(cand.photographer).slice(0, 40)} — ${cand.pageUrl}`);
  return { src: `/images/${nom}.webp`, alt: altDepuisTitre(cand.title, requete) };
}

export async function cmdPhotosDemo(args) {
  const t0 = Date.now();
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const requetes = positional.slice(1).filter(Boolean);
  const services = parseServices(flags.services);
  if (!requetes.length) { fail(USAGE); process.exit(1); }
  if (flags.services !== undefined && !services.length) { fail(`--services attend "slug=requête;slug2=requête". ${USAGE}`); process.exit(1); }
  const n = flags.n !== undefined ? Number(flags.n) : 6;
  if (!Number.isInteger(n) || n < 1 || n > 20) { fail('--n attend un entier de 1 à 20 (photos au total, premier écran compris).'); process.exit(1); }

  const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
  const src = fs.readFileSync(configPath, 'utf8');
  const garde = gardeDemo(slug, src);
  if (!garde.ok) { fail(garde.raison); process.exit(1); }

  // Les services nommés doivent exister avant toute recherche (quota Openverse).
  if (services.length) {
    try { ecrireConfig(src, { services: services.map((s) => ({ slug: s.slug, src: '/x', alt: 'x' })) }); } catch (e) { fail(e.message); process.exit(1); }
  }

  const parts = repartir(n, requetes.length);
  const pris = new Set();
  const choix = { hero: null, galerie: [], services: [] };
  for (let i = 0; i < requetes.length; i++) {
    const q = requetes[i];
    const besoin = parts[i] + (i === 0 ? 1 : 0);
    info(`Requête ${i + 1} « ${q} » : ${i === 0 ? '1 premier écran + ' : ''}${parts[i]} photo(s) de galerie`);
    const cands = await chercher(q, i === 0 ? 'hero' : 'galerie', besoin);
    if (i === 0) {
      const [h] = await retenir(cands, 'hero', 1, pris);
      if (!h) { fail(`Aucune photo de premier écran exploitable pour « ${q} » (paysage, ≥ ${MIN_LARGEUR.hero} px, licence réutilisable) : préciser la requête en anglais.`); process.exit(1); }
      choix.hero = { ...h, requete: q };
    }
    for (const g of await retenir(cands, 'galerie', parts[i], pris)) choix.galerie.push({ ...g, requete: q });
    if (choix.galerie.length < parts.slice(0, i + 1).reduce((a, b) => a + b, 0)) warn(`« ${q} » : moins de photos de galerie que prévu.`);
  }
  for (const s of services) {
    info(`Service ${s.slug} « ${s.requete} »`);
    const [p] = await retenir(await chercher(s.requete, 'service', 1), 'service', 1, pris);
    if (p) choix.services.push({ ...p, slug: s.slug, requete: s.requete });
    else warn(`Aucune photo exploitable pour le service ${s.slug} : il reste sans image.`);
  }

  // Écriture : raw/ (recadré), CREDITS.md, puis ff images, puis site.config.ts.
  nettoyerAnciennes(slug, 'galerie-\\d+');
  const hero = await poser(slug, choix.hero, 'hero', 'hero', choix.hero.requete);
  const galerie = [];
  for (let i = 0; i < choix.galerie.length; i++) galerie.push(await poser(slug, choix.galerie[i], `galerie-${i + 1}`, 'galerie', choix.galerie[i].requete));
  const servicesEcrits = [];
  for (const s of choix.services) servicesEcrits.push({ slug: s.slug, ...(await poser(slug, s, `service-${s.slug}`, 'service', s.requete)) });

  info('');
  info(c.dim('ff images : AVIF/WebP multi-largeurs + images.json'));
  await cmdImages([slug]);

  const credits = fs.readFileSync(path.join(SITES_DIR, slug, 'CREDITS.md'), 'utf8');
  const nouveau = ecrireConfig(fs.readFileSync(configPath, 'utf8'), { hero, galerie, services: servicesEcrits, banque: photosDeBanque(credits) });
  fs.writeFileSync(configPath, nouveau);
  info('');
  ok(`site.config.ts : images.hero, images.illustration: true${galerie.length ? `, proof.gallery (${galerie.length})` : ''}${servicesEcrits.length ? `, services[].image (${servicesEcrits.map((s) => s.slug).join(', ')})` : ''}`);
  if (galerie.length && !/type:\s*'proof',\s*variant:\s*'gallery'/.test(nouveau)) {
    warn("La galerie n'est pas dans layout.sections : ajouter { type: 'proof', variant: 'gallery' } pour l'afficher.");
  }
  ok(`${1 + galerie.length + servicesEcrits.length} photo(s) d'illustration en ${((Date.now() - t0) / 1000).toFixed(0)} s. Chacune porte la mention « Photo d’illustration » sur le site et sur /credits.`);
  info(`Puis : ${c.cyan(`node scripts/ff.mjs apercu-rapide ${slug}`)}`);
}
