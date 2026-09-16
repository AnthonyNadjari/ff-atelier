// `ff photos <slug> "<requete>"` : cherche des photos libres de droit (Unsplash / Pexels), ecrit une
// feuille de contact HTML pour choisir, puis (avec --choisir) copie les images retenues dans
// public/images/photo-<n>.webp et consigne l'attribution dans CREDITS.md.
//
// Usage :
//   ff photos <slug> "<requete>" [--source unsplash|pexels] [--n 8] [--orientation landscape|portrait|squarish] [--choisir 1,3]
import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
import {
  SITES_DIR,
  resolveSlug,
  parseArgs,
  envKey,
  appendCredits,
  ok,
  fail,
  warn,
  info,
  c,
} from './util.mjs';

// ---- 1. Table FR -> EN, 40 metiers (docs/veille/ressources.md §1 : la recherche en francais est
// faible sur ces bibliotheques, l'anglais generique donne de bien meilleurs resultats). ----
const METIERS_FR_EN = {
  plombier: 'plumber pipes',
  plomberie: 'plumber pipes workshop',
  electricien: 'electrician wiring',
  electricite: 'electrician wiring tools',
  menuisier: 'carpenter woodworking workshop',
  menuiserie: 'carpentry woodworking workshop',
  ebeniste: 'cabinetmaker fine woodworking',
  boulanger: 'baker kneading dough bakery',
  boulangerie: 'bakery bread shop',
  patissier: 'pastry chef cakes bakery',
  patisserie: 'pastry shop cakes',
  coiffeur: 'hair salon barber',
  coiffure: 'hair salon barber shop',
  barbier: 'barber shop',
  macon: 'mason bricklayer construction site',
  maconnerie: 'mason bricklayer construction site',
  peintre: 'house painter painting wall',
  peinture: 'house painter painting',
  serrurier: 'locksmith key lock',
  vitrier: 'glazier glass window',
  couvreur: 'roofer roof tiles',
  couverture: 'roofer roof tiles',
  chauffagiste: 'heating engineer boiler',
  garagiste: 'car mechanic garage workshop',
  garage: 'car mechanic garage workshop',
  mecanicien: 'car mechanic workshop',
  fleuriste: 'florist flower shop',
  boucher: 'butcher shop meat',
  boucherie: 'butcher shop meat',
  charcutier: 'delicatessen charcuterie shop',
  traiteur: 'catering caterer food',
  restaurateur: 'restaurant chef kitchen',
  restaurant: 'restaurant kitchen chef',
  architecte: 'architect blueprint office',
  avocat: 'lawyer office law books',
  notaire: 'notary office law',
  comptable: 'accountant office finance',
  veterinaire: 'veterinarian vet clinic animal',
  dentiste: 'dentist dental clinic',
  osteopathe: 'osteopath physiotherapy clinic',
  masseur: 'massage therapist spa',
  esthetique: 'beauty salon spa treatment',
  paysagiste: 'landscaper gardening',
  jardinier: 'gardener garden tools',
  ferronnier: 'blacksmith ironwork forge',
  tapissier: 'upholsterer upholstery fabric',
  ceramiste: 'ceramist pottery workshop',
  tatoueur: 'tattoo artist studio',
  photographe: 'photographer camera studio',
  demenageur: 'mover moving truck boxes',
  antenniste: 'tv aerial installer roof antenna',
  vigneron: 'winemaker vineyard wine',
  apiculteur: 'beekeeper bee hive honey',
};

function stripAccents(s) {
  return String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '');
}

/** Traduit une requete FR -> EN mot par mot via METIERS_FR_EN ; laisse les mots inconnus tels quels. */
function traduire(requete) {
  const mots = String(requete).trim().split(/\s+/);
  let touche = false;
  const out = mots.map((mot) => {
    const cle = stripAccents(mot).toLowerCase().replace(/[^a-z0-9]/g, '');
    if (METIERS_FR_EN[cle]) {
      touche = true;
      return METIERS_FR_EN[cle];
    }
    return mot;
  });
  return { requeteEn: out.join(' '), touche };
}

const SOURCES = ['unsplash', 'pexels'];
const ORIENTATIONS = new Set(['landscape', 'portrait', 'squarish']);

function keyInstructions(source) {
  if (source === 'unsplash') {
    return '  UNSPLASH_ACCESS_KEY=...  (https://unsplash.com/developers -> "New Application", cle "Access Key")';
  }
  return '  PEXELS_API_KEY=...       (https://www.pexels.com/api/ -> creer un compte, cle fournie immediatement)';
}

function failNoKey(requested) {
  fail(
    requested
      ? `Aucune cle API pour la source demandee (--source ${requested}).`
      : 'Aucune cle API disponible pour la recherche de photos (Unsplash et Pexels).',
  );
  info('');
  info("Ajoute au moins une des cles suivantes dans .env (copie .env.example a la racine) :");
  info(keyInstructions('unsplash'));
  info(keyInstructions('pexels'));
  info('');
  info('Puis relance la commande.');
  process.exit(1);
}

async function chercherUnsplash({ requeteEn, n, orientation }) {
  const key = envKey('UNSPLASH_ACCESS_KEY');
  const params = new URLSearchParams({ query: requeteEn, per_page: String(n), client_id: key });
  if (orientation) params.set('orientation', orientation);
  const url = `https://api.unsplash.com/search/photos?${params.toString()}`;
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Unsplash a repondu ${res.status} (${res.statusText}).`);
  }
  const data = await res.json();
  return (data.results || []).map((r) => ({
    source: 'unsplash',
    id: r.id,
    photographer: r.user?.name || 'inconnu',
    photographerUrl: r.user?.links?.html || '',
    pageUrl: r.links?.html || '',
    thumbUrl: r.urls?.small || r.urls?.thumb,
    fullUrl: r.urls?.full || r.urls?.regular,
    downloadLocation: r.links?.download_location,
    width: r.width,
    height: r.height,
  }));
}

async function chercherPexels({ requeteEn, n, orientation }) {
  const key = envKey('PEXELS_API_KEY');
  const params = new URLSearchParams({ query: requeteEn, per_page: String(n) });
  if (orientation) params.set('orientation', orientation === 'squarish' ? 'square' : orientation);
  const url = `https://api.pexels.com/v1/search?${params.toString()}`;
  const res = await fetch(url, { headers: { Authorization: key } });
  if (!res.ok) {
    throw new Error(`Pexels a repondu ${res.status} (${res.statusText}).`);
  }
  const data = await res.json();
  return (data.photos || []).map((p) => ({
    source: 'pexels',
    id: p.id,
    photographer: p.photographer || 'inconnu',
    photographerUrl: p.photographer_url || '',
    pageUrl: p.url || '',
    thumbUrl: p.src?.medium,
    fullUrl: p.src?.large2x || p.src?.original,
    downloadLocation: undefined,
    width: p.width,
    height: p.height,
  }));
}

async function telecharger(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`Telechargement echoue (${res.status}).`);
  return Buffer.from(await res.arrayBuffer());
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>'"]/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&apos;', '"': '&quot;' }[ch]));
}

function ecrireApercu(tmpDir, candidats, fichiers) {
  const cartes = candidats
    .map((cand, i) => {
      const fichier = fichiers[i];
      return `
      <figure>
        <img src="${escapeHtml(fichier)}" alt="Candidat ${cand.index}" loading="lazy" />
        <figcaption>
          <strong>#${cand.index}</strong> — ${escapeHtml(cand.source)}<br/>
          ${escapeHtml(cand.photographer)}<br/>
          <a href="${escapeHtml(cand.pageUrl)}" target="_blank" rel="noopener">voir la page source</a>
        </figcaption>
      </figure>`;
    })
    .join('\n');
  const html = `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8" />
<title>Apercu photos</title>
<style>
  body { font-family: system-ui, sans-serif; background: #111; color: #eee; margin: 0; padding: 2rem; }
  h1 { font-weight: 600; }
  .grille { display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 1.5rem; }
  figure { margin: 0; background: #1c1c1c; border-radius: 8px; overflow: hidden; }
  img { width: 100%; height: 160px; object-fit: cover; display: block; }
  figcaption { padding: 0.75rem; font-size: 0.85rem; line-height: 1.4; }
  a { color: #7dd3fc; }
</style>
</head>
<body>
  <h1>Feuille de contact — photos</h1>
  <p>Choisis les index a garder, puis relance : <code>ff photos ... --choisir 1,3</code></p>
  <div class="grille">
    ${cartes}
  </div>
</body>
</html>`;
  fs.writeFileSync(path.join(tmpDir, 'apercu.html'), html);
}

function prochainNumeroPhoto(outDir) {
  if (!fs.existsSync(outDir)) return 1;
  let max = 0;
  for (const f of fs.readdirSync(outDir)) {
    const m = f.match(/^photo-(\d+)\.webp$/);
    if (m) max = Math.max(max, Number(m[1]));
  }
  return max + 1;
}

const LICENCES = {
  unsplash: 'Unsplash License (https://unsplash.com/license) — usage commercial libre, attribution non requise en usage direct',
  pexels: 'Pexels License (https://www.pexels.com/license/) — usage commercial libre, sans attribution obligatoire',
};

export async function cmdPhotos(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const requete = positional[1];
  if (!requete) {
    fail('Usage : ff photos <slug> "<requete>" [--source unsplash|pexels] [--n 8] [--orientation landscape|portrait|squarish] [--choisir 1,3]');
    process.exit(1);
  }

  const orientation = flags.orientation ? String(flags.orientation) : '';
  if (orientation && !ORIENTATIONS.has(orientation)) {
    fail(`--orientation invalide : "${orientation}". Attendu : landscape, portrait ou squarish.`);
    process.exit(1);
  }

  const n = flags.n !== undefined ? Number(flags.n) : 8;
  if (!Number.isFinite(n) || n < 0) {
    fail('--n doit etre un nombre positif ou nul.');
    process.exit(1);
  }

  const sourceFlag = flags.source ? String(flags.source) : '';
  if (sourceFlag && !SOURCES.includes(sourceFlag)) {
    fail(`--source invalide : "${sourceFlag}". Attendu : unsplash ou pexels.`);
    process.exit(1);
  }

  // Sources actives : celle demandee explicitement, sinon toutes celles dont la cle est presente.
  let sourcesActives;
  if (sourceFlag) {
    const keyName = sourceFlag === 'unsplash' ? 'UNSPLASH_ACCESS_KEY' : 'PEXELS_API_KEY';
    if (!envKey(keyName)) failNoKey(sourceFlag);
    sourcesActives = [sourceFlag];
  } else {
    sourcesActives = SOURCES.filter((s) => envKey(s === 'unsplash' ? 'UNSPLASH_ACCESS_KEY' : 'PEXELS_API_KEY'));
    if (sourcesActives.length === 0) failNoKey();
  }

  const { requeteEn, touche } = traduire(requete);
  info(`Requete : "${requete}" -> "${requeteEn}"${touche ? '' : ' (aucun mot metier reconnu, recherche telle quelle)'}`);

  if (n === 0) {
    info('--n 0 : recherche ignoree (verification du chemin de code uniquement).');
    return;
  }

  const tmpDir = path.join(SITES_DIR, slug, '.ff-tmp', 'photos');
  fs.mkdirSync(tmpDir, { recursive: true });

  let candidats = [];
  for (const source of sourcesActives) {
    try {
      const fn = source === 'unsplash' ? chercherUnsplash : chercherPexels;
      const resultats = await fn({ requeteEn, n, orientation });
      candidats.push(...resultats);
    } catch (e) {
      warn(`Recherche ${source} echouee : ${e.message}`);
    }
  }

  if (candidats.length === 0) {
    fail("Aucun resultat (verifie la requete, la cle API, ou la connexion).");
    process.exit(1);
  }

  candidats.forEach((cand, i) => { cand.index = i + 1; });

  // Telecharge les vignettes pour la feuille de contact.
  const fichiers = [];
  for (const cand of candidats) {
    const ext = '.jpg';
    const nomFichier = `${String(cand.index).padStart(2, '0')}-${cand.source}-${cand.id}${ext}`;
    try {
      const buf = await telecharger(cand.thumbUrl);
      fs.writeFileSync(path.join(tmpDir, nomFichier), buf);
      fichiers.push(nomFichier);
    } catch (e) {
      warn(`Vignette #${cand.index} non telechargee : ${e.message}`);
      fichiers.push('');
    }
  }
  ecrireApercu(tmpDir, candidats, fichiers);

  info('');
  ok(`${candidats.length} candidat(s). Feuille de contact : sites/${slug}/.ff-tmp/photos/apercu.html`);
  for (const cand of candidats) {
    info(`  ${c.cyan(`#${cand.index}`)} ${cand.source.padEnd(8)} ${cand.photographer} — ${cand.pageUrl}`);
  }

  const choisirFlag = flags.choisir;
  if (!choisirFlag) {
    info('');
    info(`Pour copier des photos dans le site : ${c.cyan(`ff photos ${slug} "${requete}" --choisir 1,3`)}`);
    return;
  }

  const indexChoisis = String(choisirFlag)
    .split(',')
    .map((s) => Number(s.trim()))
    .filter((n2) => Number.isInteger(n2));
  if (indexChoisis.length === 0) {
    fail(`--choisir invalide : "${choisirFlag}". Attendu une liste d'index separes par des virgules, ex: 1,3.`);
    process.exit(1);
  }

  const outDir = path.join(SITES_DIR, slug, 'public', 'images');
  fs.mkdirSync(outDir, { recursive: true });
  let prochain = prochainNumeroPhoto(outDir);
  const dateDuJour = new Date().toISOString().slice(0, 10);

  info('');
  for (const idx of indexChoisis) {
    const cand = candidats.find((c2) => c2.index === idx);
    if (!cand) {
      warn(`Index ${idx} introuvable parmi les candidats affiches ci-dessus, ignore.`);
      continue;
    }
    try {
      const buf = await telecharger(cand.fullUrl);
      const num = prochain++;
      const out1600 = path.join(outDir, `photo-${num}.webp`);
      const out800 = path.join(outDir, `photo-${num}-800.webp`);
      await sharp(buf).resize({ width: 1600, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out1600);
      await sharp(buf).resize({ width: 800, withoutEnlargement: true }).webp({ quality: 80 }).toFile(out800);

      if (cand.source === 'unsplash' && cand.downloadLocation) {
        try {
          const u = new URL(cand.downloadLocation);
          u.searchParams.set('client_id', envKey('UNSPLASH_ACCESS_KEY'));
          await fetch(u.toString());
        } catch (e) {
          warn(`Declenchement download_location Unsplash echoue pour #${idx} : ${e.message}`);
        }
      }

      appendCredits(
        slug,
        `## public/images/photo-${num}.webp\n- Photographe : ${cand.photographer} (${cand.photographerUrl || cand.pageUrl})\n- Source : ${cand.source === 'unsplash' ? 'Unsplash' : 'Pexels'} — ${cand.pageUrl}\n- Licence : ${LICENCES[cand.source]}\n- Date : ${dateDuJour}`,
      );

      ok(`#${idx} -> public/images/photo-${num}.webp (+ -800.webp), credite dans CREDITS.md`);
    } catch (e) {
      fail(`#${idx} : echec (${e.message})`);
    }
  }
}
