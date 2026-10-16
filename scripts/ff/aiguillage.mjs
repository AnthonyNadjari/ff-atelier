// `ff aiguillage <slug>` : lit les réponses « photos » et « ambiance » du brief (formulaire ff-brief ou brief
// papier de docs/BRIEF.md), les croise avec les photos du client réellement présentes, et imprime la décision de
// `.claude/skills/site-final/aiguillage.md` + les deux lignes AIGUILLAGE à recopier dans direction.md.
// `controlerAiguillage` est appelé par `ff verifier` : une piste « calme » qui suit le défilement échoue.
//
// Pourquoi une commande (16 oct 2026) : le fondateur veut que les réponses du client « aiguillent bien », de
// façon précise. Laissée à la lecture d'un agent, la grille se perd entre le brief et le site ; ici elle est
// calculée, puis contrôlée sur le site construit.
import fs from 'node:fs';
import path from 'node:path';
import { SITES_DIR, DIST_DIR, ROOT, ok, fail, info, warn, resolveSlug, parseArgs } from './util.mjs';

const apos = (s) => String(s || '').replace(/[’ʼ]/g, "'").toLowerCase();
const IMAGE = /\.(jpe?g|png|webp|avif|heic|heif|tiff?)$/i;

/** Pure : réponses du client dans un brief (formulaire ou papier). Absente ou « ? à demander » = null. */
export function lireReponses(brief) {
  const b = apos(brief);
  const ligne = (re) => (re.exec(b)?.[1] || '').trim();
  const coche = (texte) => new RegExp(`\\[x\\]\\s*${texte}`).test(b);
  // Formulaire : « - **Photos sur le site ? :** Oui, mais je n'en ai pas : **à organiser**, qui les fait : X »
  let souhait = null;
  const f = ligne(/\*\*photos sur le site \? :\*\*([^\n]*)/);
  const enAttente = (s) => /oui, mais je n'en ai pas/.test(s);
  if (f && !f.startsWith('?')) souhait = enAttente(f) ? 'sans-photo' : /oui, (?:et )?j'en ai/.test(f) ? 'avec-photo' : /peu ou pas/.test(f) ? 'peu' : null;
  else if (coche("oui, et j'en ai")) souhait = 'avec-photo';
  else if (coche("oui, mais je n'en ai pas")) souhait = 'sans-photo';
  else if (coche('peu ou pas')) souhait = 'peu';
  let qui = null;
  const q = /qui les fait : ([^\n]*)/.exec(b)?.[1] || '';
  if (/^(moi|lui)|\[x\]\s*lui/.test(q)) qui = 'client';
  else if (/^vous|\[x\]\s*nous/.test(q)) qui = 'studio';
  else if (/^à voir/.test(q)) qui = 'a-voir';
  let ambiance = null;
  // Après le gras : « Calme, posé » (formulaire) ou « (…) : [ ] … [x] … » (papier). Le libellé en gras contient « calme ».
  const a = ligne(/\*\*ambiance[^*]*\*\*([^\n]*(?:\n\s+\[[^\n]*)?)/);
  const choix = a.includes('[') ? (/\[x\]\s*([^[]*)/.exec(a)?.[1] || '') : a;
  if (/calme/.test(choix)) ambiance = 'calme';
  else if (/vivant/.test(choix)) ambiance = 'vivant';
  else if (/ne sais pas/.test(choix)) ambiance = 'je-ne-sais-pas';
  const cases = {};
  for (const [cle, re] of [['logo', /\[x\]\s*logo/], ['portrait', /\[x\]\s*portrait/], ['realisations', /\[x\]\s*photos (?:du travail|de chantiers)/], ['avantApres', /\[x\]\s*photos avant/]]) cases[cle] = re.test(b);
  return { souhait, qui, ambiance, cases };
}

/** Photos du client présentes dans le dossier du site : raw/ et public/images/, hors banque (CREDITS.md), og, logo. */
export function photosClient(dir) {
  const credits = fs.existsSync(path.join(dir, 'CREDITS.md')) ? fs.readFileSync(path.join(dir, 'CREDITS.md'), 'utf8') : '';
  const tiers = new Set([...credits.matchAll(/^##\s+(.+)$/gm)].flatMap((m) => m[1].split(/\s*->\s*|\s+/)).map((p) => base(p)));
  const noms = new Set();
  for (const sous of ['raw', 'public/images']) {
    const d = path.join(dir, sous);
    if (!fs.existsSync(d)) continue;
    for (const e of fs.readdirSync(d, { withFileTypes: true })) {
      if (!e.isFile() || !IMAGE.test(e.name)) continue;
      const n = base(e.name);
      if (!tiers.has(n) && !/^(og|logo|favicon|apple-touch|icon)\b/i.test(n)) noms.add(n);
    }
  }
  return [...noms];
}
function base(p) {
  return path.basename(String(p)).replace(IMAGE, '').replace(/-(\d{3,4})$/, '').toLowerCase();
}

/** Pure : la décision de la grille. `mouvementPiste` = « calme » | « vivant » lu dans direction.md (prime si le client n'a pas tranché). */
export function decider({ souhait, qui, ambiance }, photos = [], mouvementPiste = null) {
  let p;
  if (souhait === 'avec-photo') p = photos.length ? 'matiere' : 'attente';
  else if (souhait === 'sans-photo') p = 'liste-de-prises';
  else p = 'sans';
  const tranche = ambiance === 'calme' || ambiance === 'vivant';
  const mouvement = tranche ? ambiance : mouvementPiste;
  const ecart = tranche && mouvementPiste && mouvementPiste !== ambiance;
  return {
    photos: p,
    qui: p === 'liste-de-prises' ? qui : null,
    nPhotos: photos.length,
    mouvement,
    motion: mouvement === 'calme' ? 'subtle' : mouvement === 'vivant' ? 'rich' : null,
    couvrir: !tranche,
    ecart: Boolean(ecart),
    aDemander: [souhait ? null : 'photos', ambiance ? null : 'ambiance'].filter(Boolean),
  };
}

const PHRASES_PHOTOS = {
  matiere: (d) => `les photos du client sont la matière (${d.nPhotos} reçue${d.nPhotos > 1 ? 's' : ''}) ; au moins une piste bâtie autour de la meilleure`,
  attente: () => "le client en a mais rien n'est arrivé : places réservées, sections masquées tant que la photo manque, fichiers attendus listés",
  'liste-de-prises': (d) => `le client en veut sans en avoir : liste de prises (3 à 6) dans chaque contrat${d.qui === 'client' ? ', il les fait au téléphone avec le guide photo' : d.qui === 'studio' ? ', nous les faisons sur place' : ', qui les fait à voir'}`,
  sans: () => "aucune piste ne dépend d'une photo",
};

/** Pure : les deux lignes à recopier dans la section « Aiguillage » de direction.md. */
export function lignesContrat(d, reponses) {
  const m = d.mouvement
    ? `Mouvement : ${d.mouvement}, \`motion\` ${d.motion}, parce que ${d.couvrir ? 'le client n\'a pas tranché (« je ne sais pas ») et que cette piste couvre ce côté' : `le client a répondu « ${d.mouvement} »`}.`
    : 'Mouvement : <calme | vivant> (le client n\'a pas tranché : les pistes couvrent les deux, dire laquelle est celle-ci).';
  return [`Photos : ${PHRASES_PHOTOS[d.photos](d)}.${reponses.cases.portrait ? ' Portrait fourni : la voix signée peut avoir un visage.' : ''}${reponses.cases.avantApres ? ' Avant/après permis.' : ''}`, m];
}

/** « Mouvement : calme » ou « vivant » écrit dans la section Aiguillage du contrat. */
export function mouvementDuContrat(md) {
  return /^Mouvement\s*:\s*(calme|vivant)\b/im.exec(md || '')?.[1]?.toLowerCase() ?? null;
}

// Attribut posé sur un élément (pas un sélecteur du CSS du moteur, inliné dans la page).
const SUIT_DEFILEMENT = /\sdata-(?:scrub|parallax|parallax-depth|pin|horizontal|frames|blur-scrub|text-fill|stack)(?=[\s=>])|\sdata-draw-svg="scrub"/;

/** Pure : contrôle d'un site construit contre la décision. html = index.html ; sources = sections sur mesure du
 * site (leur CSS et leurs scripts : le CSS du moteur, inliné dans la page, contient des sélecteurs inactifs). */
export function controlerAiguillage({ decision, motion, html = '', sources = '' }) {
  const echecs = [];
  const alertes = [];
  const balisage = html.replace(/<(style|script)\b[\s\S]*?<\/\1>/gi, '');
  if (decision.mouvement === 'calme') {
    if (motion === 'rich') echecs.push('client « calme » mais `motion: \'rich\'` (attendu subtle)');
    const m = SUIT_DEFILEMENT.exec(balisage);
    if (m) echecs.push(`client « calme » mais un élément suit le défilement (${m[0].trim()})`);
    // Toute timeline de défilement est continue (scroll(), view(), ou nommée par view-/scroll-timeline).
    if (/animation-timeline\s*:[^;]*(?:scroll\(|view\(|--)|(?:view|scroll)-timeline(?:-name)?\s*:/.test(sources)) echecs.push('client « calme » mais une section sur mesure lie une animation au défilement (animation-timeline)');
    if (/addEventListener\(\s*['"]scroll['"]/.test(sources)) alertes.push('client « calme » : un script écoute le défilement, vérifier qu\'il ne fait rien bouger en continu');
  }
  if (decision.ecart) echecs.push('le contrat dit un mouvement différent de la réponse du client');
  if ((decision.photos === 'sans' || decision.photos === 'liste-de-prises' || decision.photos === 'attente') && /<img\b[^>]*src="\/images\/(?!og|logo)/i.test(balisage)) {
    alertes.push('une photo est affichée alors que le client n\'en a pas fourni : banque d\'images ? (décision datée du fondateur requise)');
  }
  return { echecs, alertes };
}

/** Pour `ff verifier` : null si le brief ne dit rien (sites d'avant le 16 oct 2026). */
export function aiguillageDuSite(slug) {
  const dir = path.join(SITES_DIR, slug);
  const briefP = path.join(dir, 'brief.md');
  if (!fs.existsSync(briefP)) return null;
  const reponses = lireReponses(fs.readFileSync(briefP, 'utf8'));
  const contrat = fs.existsSync(path.join(dir, 'direction.md')) ? fs.readFileSync(path.join(dir, 'direction.md'), 'utf8') : '';
  if (!reponses.souhait && !reponses.ambiance && !mouvementDuContrat(contrat)) return null;
  return { reponses, decision: decider(reponses, photosClient(dir), mouvementDuContrat(contrat)) };
}

export function lireDist(slug) {
  const d = path.join(DIST_DIR, slug);
  const html = fs.existsSync(path.join(d, 'index.html')) ? fs.readFileSync(path.join(d, 'index.html'), 'utf8') : '';
  const s = path.join(SITES_DIR, slug, 'sections');
  const sources = fs.existsSync(s) ? fs.readdirSync(s).filter((f) => f.endsWith('.astro')).map((f) => fs.readFileSync(path.join(s, f), 'utf8')).join('\n') : '';
  const motion = /data-motion="(\w+)"/.exec(html)?.[1] ?? null;
  return { html, sources, motion };
}

export function cmdAiguillage(args) {
  const { positional } = parseArgs(args);
  const slug = resolveSlug(positional[0]);
  const a = aiguillageDuSite(slug);
  if (!a) {
    warn(`Le brief de ${slug} ne contient ni la réponse « photos » ni « ambiance » : les demander au client (formulaire ff-brief ou docs/BRIEF.md § 8 et § 12).`);
    return;
  }
  const { reponses, decision } = a;
  info(`Réponses : photos ${reponses.souhait ?? '?'}${reponses.qui ? ` (qui : ${reponses.qui})` : ''}, ambiance ${reponses.ambiance ?? '?'} ; photos du client présentes : ${decision.nPhotos}.`);
  if (decision.couvrir) info('Le client n\'a pas tranché le mouvement : au moins une piste calme et une vivante, chacune le dit dans son contrat.');
  if (decision.aDemander.length) warn(`À demander au client : ${decision.aDemander.join(', ')}.`);
  info('\nÀ recopier dans la section « Aiguillage » de direction.md :');
  for (const l of lignesContrat(decision, reponses)) info(l);
  const dist = lireDist(slug);
  if (dist.html) {
    const r = controlerAiguillage({ decision, ...dist });
    for (const e of r.echecs) fail(e);
    for (const e of r.alertes) warn(e);
    if (!r.echecs.length) ok(`Site construit conforme à l'aiguillage (${path.relative(ROOT, path.join(DIST_DIR, slug))}).`);
    if (r.echecs.length) process.exitCode = 1;
  }
}
