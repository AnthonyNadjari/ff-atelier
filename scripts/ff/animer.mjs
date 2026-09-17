// `ff animer <slug> <image> "<prompt>" [--modele minimax|kling] [--duree 5] [--simuler]` : anime une
// PHOTO REELLE du client (image-to-video) via l'API file d'attente de fal.ai (docs.fal.ai/model-
// endpoints/queue : POST https://queue.fal.run/<endpoint>, sondage sur status_url, resultat sur
// response_url). Upload prealable de l'image (fal storage, flux initiate + PUT), telechargement du
// mp4 resultat dans sites/<slug>/.ff-tmp/animer/<nom>.mp4, puis journal CREDITS.md. `--simuler`
// affiche les appels prevus sans effectuer aucune requete (utile sans FAL_KEY).
//
// !! Regle stricte (docs/veille/redaction-images.md §2.3 — AI Act art. 50, applicable depuis le
// 2 aout 2026 — + CLAUDE.md regle 2) : cette commande n'anime QUE une photo reelle du client, de son
// produit, de son lieu ou de sa realisation — jamais une image generee ou une photo de banque
// presentee comme "du client" (pratique commerciale trompeuse, art. L121-2 du Code de la
// consommation). La video produite doit etre marquee comme generee par IA sur la section qui
// l'utilise : attribut data-ia="1" + mention visible ("animation generee a partir d'une photo").
//
// Endpoints fal.ai utilises ici (queue.fal.run confirme par docs.fal.ai/model-endpoints/queue et le
// modele Hailuo-02 par fal.ai/models/fal-ai/minimax/hailuo-02/standard/image-to-video/api, tous deux
// re-verifies en direct le 17 sept 2026). Le flux d'upload (rest.alpha.fal.ai/storage/upload/initiate
// puis PUT sur l'upload_url retourne) suit le comportement stable et documente des clients officiels
// fal_client (Python/JS) — non re-verifie en direct cette session faute de reponse exploitable de la
// documentation publique au moment de l'ecriture ; a recontroler si l'upload echoue en pratique.
//
// Usage : ff animer <slug> <image> "<prompt>" [--modele minimax|kling] [--duree 5] [--simuler]
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, resolveSlug, parseArgs, envKey, appendCredits, ok, fail, warn, info, c, slugify } from './util.mjs';

// Modeles fal.ai supportes (image-to-video). endpoint = app_id de la file d'attente (queue.fal.run/<endpoint>).
const MODELES = {
  minimax: {
    endpoint: 'fal-ai/minimax/hailuo-02/standard/image-to-video',
    dureesValides: ['6', '10'],
    dureeParDefaut: '6',
    body: (prompt, imageUrl, duree) => ({ prompt, image_url: imageUrl, duration: duree, prompt_optimizer: true }),
  },
  kling: {
    endpoint: 'fal-ai/kling-video/v2.1/standard/image-to-video',
    dureesValides: ['5', '10'],
    dureeParDefaut: '5',
    body: (prompt, imageUrl, duree) => ({ prompt, image_url: imageUrl, duration: duree }),
  },
};

const FAL_QUEUE = 'https://queue.fal.run';
const FAL_STORAGE_INITIATE = 'https://rest.alpha.fal.ai/storage/upload/initiate';
const CONTENT_TYPES = { jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

function failNoKey() {
  fail('Aucune cle API fal.ai disponible.');
  info('');
  info("Ajoute la cle suivante dans .env (copie .env.example a la racine) :");
  info('  FAL_KEY=...  (https://fal.ai/dashboard/keys -> creer une cle)');
  info('');
  info('Puis relance la commande (ou utilise --simuler pour voir les appels prevus sans cle).');
  process.exit(1);
}

/** Upload l'image locale vers le stockage fal.ai (flux initiate + PUT) et renvoie son URL publique. */
async function uploaderImage(cheminLocal, key) {
  const buf = fs.readFileSync(cheminLocal);
  const ext = path.extname(cheminLocal).slice(1).toLowerCase();
  const contentType = CONTENT_TYPES[ext] || 'application/octet-stream';
  const initRes = await fetch(FAL_STORAGE_INITIATE, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ content_type: contentType, file_name: path.basename(cheminLocal) }),
  });
  if (!initRes.ok) throw new Error(`initiate upload : ${initRes.status} ${(await initRes.text()).slice(0, 200)}`);
  const { upload_url: uploadUrl, file_url: fileUrl } = await initRes.json();
  if (!uploadUrl || !fileUrl) throw new Error("reponse d'initiation sans upload_url/file_url");
  const putRes = await fetch(uploadUrl, { method: 'PUT', headers: { 'Content-Type': contentType }, body: buf });
  if (!putRes.ok) throw new Error(`PUT upload : ${putRes.status}`);
  return fileUrl;
}

async function soumettre(endpoint, body, key) {
  const res = await fetch(`${FAL_QUEUE}/${endpoint}`, {
    method: 'POST',
    headers: { Authorization: `Key ${key}`, 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error(`soumission : ${res.status} ${(await res.text()).slice(0, 200)}`);
  return res.json(); // { request_id, status_url, response_url, cancel_url, queue_position }
}

async function attendreResultat(statusUrl, responseUrl, key, { intervalleMs = 4000, timeoutMs = 10 * 60 * 1000 } = {}) {
  const t0 = Date.now();
  while (Date.now() - t0 < timeoutMs) {
    const sep = statusUrl.includes('?') ? '&' : '?';
    const res = await fetch(`${statusUrl}${sep}logs=1`, { headers: { Authorization: `Key ${key}` } });
    if (!res.ok) throw new Error(`statut : ${res.status}`);
    const data = await res.json();
    if (data.status === 'COMPLETED') {
      const rr = await fetch(responseUrl, { headers: { Authorization: `Key ${key}` } });
      if (!rr.ok) throw new Error(`resultat : ${rr.status}`);
      return rr.json();
    }
    if (data.error) throw new Error(data.error);
    info(`  ${c.dim(`... ${data.status}${data.queue_position !== undefined ? ` (position ${data.queue_position})` : ''}`)}`);
    await new Promise((r) => setTimeout(r, intervalleMs));
  }
  throw new Error('delai depasse (10 min) en attente du resultat fal.ai');
}

function afficherRappelLegal() {
  info(c.bold("Rappel obligatoire (docs/veille/redaction-images.md §2.3, docs/REDACTION.md) :"));
  info("  N'anime QUE une photo REELLE du client (son produit, son lieu, sa realisation) — jamais une");
  info('  image generee ou une photo de banque presentee comme "du client". AI Act art. 50 : marque la');
  info('  section avec data-ia="1" et une mention visible ("animation generee a partir d\'une photo").');
  info('');
}

export async function cmdAnimer(args) {
  const { positional, flags } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const image = positional[1];
  const prompt = positional[2];
  const simuler = Boolean(flags.simuler);

  if (!image || !prompt) {
    fail('Usage : ff animer <slug> <image> "<prompt>" [--modele minimax|kling] [--duree 5] [--simuler]');
    process.exit(1);
  }

  const modeleNom = flags.modele ? String(flags.modele) : 'minimax';
  const modele = MODELES[modeleNom];
  if (!modele) {
    fail(`--modele invalide : "${modeleNom}". Attendu : ${Object.keys(MODELES).join(', ')}.`);
    process.exit(1);
  }

  const dureeDemandee = flags.duree !== undefined ? String(flags.duree) : modele.dureeParDefaut;
  let duree = dureeDemandee;
  if (!modele.dureesValides.includes(dureeDemandee)) {
    duree = modele.dureesValides.reduce((meilleure, candidate) =>
      Math.abs(Number(candidate) - Number(dureeDemandee)) < Math.abs(Number(meilleure) - Number(dureeDemandee)) ? candidate : meilleure,
    );
    warn(`--duree ${dureeDemandee} non supportee par ${modeleNom} (${modele.dureesValides.join('/')} s) ; ${duree}s utilisee.`);
  }

  afficherRappelLegal();

  const imageAbs = path.resolve(image);
  if (!simuler && !fs.existsSync(imageAbs)) {
    fail(`Image introuvable : ${imageAbs}`);
    process.exit(1);
  }

  const key = envKey('FAL_KEY');
  if (!simuler && !key) failNoKey();

  info(`Modele : ${c.cyan(modele.endpoint)} — duree ${duree}s — prompt : "${prompt}"`);

  if (simuler) {
    info('');
    info(c.dim('--simuler : aucun appel reseau, affichage des requetes prevues.'));
    info(`POST https://rest.alpha.fal.ai/storage/upload/initiate  (upload de ${imageAbs})`);
    info('PUT  <upload_url>  (octets de l\'image)');
    info(`POST ${FAL_QUEUE}/${modele.endpoint}`);
    info(`  body: ${JSON.stringify(modele.body(prompt, '<file_url_retourne_par_upload>', duree))}`);
    info('GET  <status_url>?logs=1  (sondage jusqu\'a COMPLETED)');
    info('GET  <response_url>  (recupere { video: { url } })');
    return;
  }

  let fileUrl;
  try {
    info("Upload de l'image vers fal.ai...");
    fileUrl = await uploaderImage(imageAbs, key);
  } catch (e) {
    fail(`Upload echoue : ${e.message}`);
    process.exit(1);
  }

  let soumission;
  try {
    soumission = await soumettre(modele.endpoint, modele.body(prompt, fileUrl, duree), key);
  } catch (e) {
    fail(`Soumission echouee : ${e.message}`);
    process.exit(1);
  }
  ok(`Requete en file : ${soumission.request_id}`);

  let resultat;
  try {
    resultat = await attendreResultat(soumission.status_url, soumission.response_url, key);
  } catch (e) {
    fail(`Generation echouee : ${e.message}`);
    process.exit(1);
  }

  const videoUrl = resultat.video?.url;
  if (!videoUrl) {
    fail(`Reponse fal.ai sans video exploitable : ${JSON.stringify(resultat).slice(0, 300)}`);
    process.exit(1);
  }

  const outDir = path.join(SITES_DIR, slug, '.ff-tmp', 'animer');
  fs.mkdirSync(outDir, { recursive: true });
  const nom = slugify(path.basename(image, path.extname(image))) || 'animation';
  const outPath = path.join(outDir, `${nom}.mp4`);
  try {
    const videoRes = await fetch(videoUrl);
    if (!videoRes.ok) throw new Error(`telechargement : ${videoRes.status}`);
    fs.writeFileSync(outPath, Buffer.from(await videoRes.arrayBuffer()));
  } catch (e) {
    fail(`Telechargement de la video echoue : ${e.message} (URL : ${videoUrl})`);
    process.exit(1);
  }

  const dateDuJour = new Date().toISOString().slice(0, 10);
  appendCredits(
    slug,
    `## .ff-tmp/animer/${nom}.mp4\n- Video generee par IA a partir d'une photo reelle du client (${path.basename(image)})\n- Modele : ${modele.endpoint}\n- Prompt : "${prompt}"\n- Date : ${dateDuJour}\n- Marquage AI Act (art. 50) : mention visible + data-ia="1" a poser sur la section qui l'utilise`,
  );

  info('');
  ok(`sites/${slug}/.ff-tmp/animer/${nom}.mp4 — credite dans CREDITS.md`);
  info('');
  info('Suite recommandee : extraire une sequence d\'images pour l\'effet "page produit" :');
  info(c.cyan(`  ff sequence ${slug} sites/${slug}/.ff-tmp/animer/${nom}.mp4 --n 60 --nom ${nom}`));
  info('');
  warn('N\'oublie pas : data-ia="1" sur la section + mention visible "animation generee a partir d\'une photo" (AI Act art. 50).');
}
