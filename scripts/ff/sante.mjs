// `ff sante <slug|url> [--domaine x]` : bilan de sante d'un site DEJA EN LIGNE (pas un build local) —
// verifie ce que `ff verifier`/`ff lighthouse` ne peuvent pas voir avant deploiement : que le site
// repond vraiment en HTTPS, que le certificat et le domaine ne sont pas sur le point d'expirer, que
// le DNS resout, que le cache _headers (astro.config.mjs) est bien applique par l'hebergeur.
// A lancer a J+1 (le lendemain de la mise en ligne) puis une fois par mois — voir docs/PROCESS.md.
//
// Usage :
//   ff sante <slug>                 -> https://<domaine du slug> (sites/<slug>/domain.txt, sinon <slug>.pages.dev)
//   ff sante <slug> --domaine x.fr  -> force le domaine a verifier (utile avant bascule DNS definitive)
//   ff sante https://exemple.fr     -> verifie directement cette URL (slug inconnu, deduit du host)
//   ff sante http://localhost:8001  -> cible locale (`ff servir`) : TLS/RDAP/DNS ignores, le reste tourne
//
// Ecrit captures/<slug>-sante.json (meme convention que `ff lighthouse`/`ff perf`), imprime une
// checklist francaise ✓/✗/!, sort en 1 si au moins un ✗.
import fs from 'node:fs';
import path from 'node:path';
import tls from 'node:tls';
import { resolve4, resolveCname, resolveMx } from 'node:dns/promises';
import { ROOT, SITES_DIR, resolveSlug, slugify, ok, fail, warn, info, c, parseArgs } from './util.mjs';
import { loadSchemaTypeModule, cleanTmp } from './ts-loader.mjs';

const DELAI_REQUETE_MS = 10_000;

/** GET avec timeout ; renvoie { res, text } (text = '' si method HEAD). N'attrape jamais l'erreur. */
async function fetchTexte(url, opts = {}) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), DELAI_REQUETE_MS);
  try {
    const res = await fetch(url, { ...opts, signal: controller.signal });
    const text = opts.method === 'HEAD' ? '' : await res.text();
    return { res, text };
  } finally {
    clearTimeout(t);
  }
}

async function checkStatut200(baseUrl, chemin, label, checks) {
  try {
    const { res } = await fetchTexte(`${baseUrl}${chemin}`);
    if (res.status === 200) checks.push({ pass: true, label: `${label} repond 200` });
    else checks.push({ pass: false, label: `${label} repond ${res.status} (attendu 200)` });
  } catch (err) {
    checks.push({ pass: false, label: `${label} injoignable : ${err.message}` });
  }
}

/** `/404` doit repondre 404 (pas 200) : sur Cloudflare Pages, 404.html est servi avec le vrai statut,
 * y compris quand on visite directement /404 (pas seulement pour une route inconnue). */
async function checkStatut404(baseUrl, checks) {
  try {
    const { res } = await fetchTexte(`${baseUrl}/404`, { redirect: 'manual' });
    if (res.status === 404) checks.push({ pass: true, label: 'Page /404 repond bien 404' });
    else checks.push({ pass: false, label: `Page /404 repond ${res.status} (attendu 404)` });
  } catch (err) {
    checks.push({ pass: false, label: `Page /404 injoignable : ${err.message}` });
  }
}

async function checkRedirectionHttps(baseUrl, isLocal, checks) {
  const u = new URL(baseUrl);
  if (isLocal || u.protocol !== 'https:') {
    checks.push({ pass: true, label: 'Redirection HTTP -> HTTPS non testee (cible locale, ou deja en http)' });
    return;
  }
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), DELAI_REQUETE_MS);
  try {
    const res = await fetch(`http://${u.host}/`, { redirect: 'manual', signal: controller.signal });
    const loc = res.headers.get('location') || '';
    if (res.status >= 300 && res.status < 400 && loc.startsWith('https://')) {
      checks.push({ pass: true, label: `Redirection HTTP -> HTTPS active (${res.status} vers ${loc})` });
    } else {
      checks.push({ pass: false, label: `Pas de redirection HTTP -> HTTPS detectee (statut ${res.status})` });
    }
  } catch (err) {
    checks.push({ pass: false, label: `Redirection HTTP -> HTTPS : verification impossible (${err.message})` });
  } finally {
    clearTimeout(t);
  }
}

function checkCanonical(homeHtml, domaineACheck, checks) {
  const m = homeHtml.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']+)["']/i);
  if (!m) {
    checks.push({ pass: false, label: 'Balise canonical absente de la page d\'accueil' });
    return;
  }
  try {
    const canonicalHost = new URL(m[1]).hostname;
    if (canonicalHost === domaineACheck) checks.push({ pass: true, label: `canonical correspond au domaine (${canonicalHost})` });
    else checks.push({ pass: false, label: `canonical (${canonicalHost}) ne correspond pas au domaine attendu (${domaineACheck})` });
  } catch {
    checks.push({ pass: false, label: `canonical illisible : "${m[1]}"` });
  }
}

/** Cherche un asset /_astro/*.css|js reference dans la page d'accueil et verifie son Cache-Control
 * (voir astro.config.mjs, integration `ff-headers` : max-age=31536000, immutable sur /_astro/*). */
async function checkCacheControlAsset(baseUrl, homeHtml, checks, warnings) {
  const m = homeHtml.match(/\/_astro\/[^"'\s)]+\.(?:css|js)/i);
  if (!m) {
    warnings.push('Aucun asset /_astro/*.css ou *.js trouve dans la page d\'accueil pour verifier le cache.');
    return;
  }
  try {
    const { res } = await fetchTexte(`${baseUrl}${m[0]}`);
    const cc = res.headers.get('cache-control') || '';
    if (/max-age=31536000/.test(cc) && /immutable/.test(cc)) {
      checks.push({ pass: true, label: `Cache-Control long sur ${m[0]} (${cc})` });
    } else {
      checks.push({ pass: false, label: `Cache-Control inattendu sur ${m[0]} : "${cc || '(absent)'}" (attendu max-age=31536000, immutable)` });
    }
  } catch (err) {
    checks.push({ pass: false, label: `Cache-Control de ${m[0]} : verification impossible (${err.message})` });
  }
}

async function checkRobots(baseUrl, checks) {
  try {
    const { res, text } = await fetchTexte(`${baseUrl}/robots.txt`);
    if (res.status !== 200) {
      checks.push({ pass: false, label: `robots.txt repond ${res.status} (attendu 200)` });
      return;
    }
    const bloqueTout = /User-agent:\s*\*[\s\S]{0,120}?Disallow:\s*\/\s*(\r?\n|$)/i.test(text);
    if (bloqueTout) checks.push({ pass: false, label: 'robots.txt bloque tout le site (Disallow: / sur User-agent: *)' });
    else checks.push({ pass: true, label: 'robots.txt accessible et n\'interdit pas tout le site' });
  } catch (err) {
    checks.push({ pass: false, label: `robots.txt injoignable : ${err.message}` });
  }
}

function checkTitreEtDescription(homeHtml, checks) {
  const titleM = homeHtml.match(/<title>([^<]+)<\/title>/i);
  if (titleM && titleM[1].trim()) checks.push({ pass: true, label: `<title> present ("${titleM[1].trim().slice(0, 60)}")` });
  else checks.push({ pass: false, label: '<title> absent ou vide' });

  const descM = homeHtml.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  if (descM && descM[1].trim()) checks.push({ pass: true, label: 'meta description presente' });
  else checks.push({ pass: false, label: 'meta description absente ou vide' });
}

/** Lit business.trade dans sites/<slug>/site.config.ts et en deduit le sous-type schema.org attendu
 * (meme logique que schemaTypeForTrade, chargee via ts-loader). Renvoie null si le slug est inconnu
 * localement (cible = URL brute) ou si le champ n'est pas trouvable — dans ce cas on ne compare pas,
 * on affiche juste le @type trouve. Ne leve jamais. */
async function typeAttenduPourSlug(slug) {
  try {
    const configPath = path.join(SITES_DIR, slug, 'site.config.ts');
    if (!fs.existsSync(configPath)) return null;
    const src = fs.readFileSync(configPath, 'utf8');
    const mType = src.match(/\bschemaType\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
    if (mType) return mType[2];
    const mTrade = src.match(/\btrade\s*:\s*(['"`])((?:\\.|(?!\1).)*)\1/);
    if (!mTrade) return null;
    const { schemaTypeForTrade } = await loadSchemaTypeModule();
    return schemaTypeForTrade(mTrade[2]);
  } catch {
    return null;
  }
}

async function checkJsonLd(homeHtml, slug, checks) {
  const blocs = [...homeHtml.matchAll(/<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  if (blocs.length === 0) {
    checks.push({ pass: false, label: 'Aucun bloc JSON-LD trouve dans la page d\'accueil' });
    return;
  }
  // Depuis le 19 sept 2026, Base.astro emet UN seul bloc avec un `@graph` (LocalBusiness enrichi +
  // FAQPage + Service). Le type du commerce n'est donc plus a la racine : on cherche d'abord dans
  // le graphe le noeud qui n'est ni FAQPage ni Service ni WebSite (c'est le LocalBusiness ou son
  // sous-type), puis on retombe sur l'ancienne forme (objet plat avec @type).
  const GENERIQUES = new Set(['FAQPage', 'Service', 'WebSite', 'WebPage', 'BreadcrumbList', 'Organization']);
  let typeTrouve = '';
  for (const bloc of blocs) {
    try {
      const data = JSON.parse(bloc[1]);
      const noeuds = Array.isArray(data['@graph']) ? data['@graph'] : [data];
      const commerce = noeuds.find((n) => n && typeof n['@type'] === 'string' && !GENERIQUES.has(n['@type']));
      const candidat = commerce || noeuds.find((n) => n && n['@type']);
      if (candidat) { typeTrouve = String(candidat['@type']); break; }
    } catch { /* bloc suivant */ }
  }
  if (!typeTrouve) {
    checks.push({ pass: false, label: 'JSON-LD present mais illisible (JSON invalide ou @type absent)' });
    return;
  }
  const attendu = await typeAttenduPourSlug(slug);
  if (attendu && typeTrouve !== attendu) {
    checks.push({ pass: false, label: `JSON-LD @type "${typeTrouve}" different du sous-type attendu "${attendu}" (business.trade du site.config.ts)` });
  } else {
    checks.push({ pass: true, label: `JSON-LD present (@type: ${typeTrouve})` });
  }
}

async function checkTempsDeReponse(baseUrl, checks) {
  try {
    const t0 = performance.now();
    await fetchTexte(`${baseUrl}/`);
    const dt = performance.now() - t0;
    const ms = Math.round(dt);
    if (dt < 1000) checks.push({ pass: true, label: `Temps de reponse de / : ${ms} ms (< 1000 ms)` });
    else checks.push({ pass: false, label: `Temps de reponse de / : ${ms} ms (>= 1000 ms)` });
  } catch (err) {
    checks.push({ pass: false, label: `Temps de reponse : requete impossible (${err.message})` });
  }
}

function lirePeerCertificate(hostname) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({ host: hostname, port: 443, servername: hostname, timeout: DELAI_REQUETE_MS }, () => {
      const cert = socket.getPeerCertificate();
      socket.end();
      if (!cert || !cert.valid_to) reject(new Error('certificat introuvable'));
      else resolve(cert);
    });
    socket.on('error', reject);
    socket.on('timeout', () => { socket.destroy(); reject(new Error('delai depasse')); });
  });
}

async function checkTls(hostname, checks, warnings) {
  try {
    const cert = await lirePeerCertificate(hostname);
    const validTo = new Date(cert.valid_to);
    const jours = Math.round((validTo.getTime() - Date.now()) / 86_400_000);
    if (jours < 0) {
      checks.push({ pass: false, label: `Certificat TLS expire depuis ${-jours} jour(s) (${validTo.toLocaleDateString('fr-FR')})` });
    } else {
      checks.push({ pass: true, label: `Certificat TLS valide jusqu'au ${validTo.toLocaleDateString('fr-FR')} (${jours} j restants)` });
      if (jours < 30) warnings.push(`Certificat TLS de ${hostname} expire dans moins de 30 jours (${jours} j).`);
    }
  } catch (err) {
    checks.push({ pass: false, label: `Certificat TLS : verification impossible (${err.message})` });
  }
}

async function checkRdap(domaine, checks, warnings) {
  try {
    const { res, text } = await fetchTexte(`https://rdap.org/domain/${domaine}`);
    if (res.status !== 200) {
      checks.push({ pass: false, label: `RDAP : reponse ${res.status} pour ${domaine} (domaine introuvable ou serveur RDAP indisponible)` });
      return;
    }
    const data = JSON.parse(text);
    const events = Array.isArray(data.events) ? data.events : [];
    const expiration = events.find((e) => e.eventAction === 'expiration');
    if (!expiration || !expiration.eventDate) {
      checks.push({ pass: false, label: `RDAP : date d'expiration introuvable pour ${domaine}` });
      return;
    }
    const dExp = new Date(expiration.eventDate);
    const jours = Math.round((dExp.getTime() - Date.now()) / 86_400_000);
    if (jours < 0) {
      checks.push({ pass: false, label: `Domaine ${domaine} expire depuis ${-jours} jour(s) — renouvellement urgent` });
    } else {
      checks.push({ pass: true, label: `Domaine ${domaine} valide jusqu'au ${dExp.toLocaleDateString('fr-FR')} (${jours} j restants)` });
      if (jours < 30) warnings.push(`Domaine ${domaine} expire dans moins de 30 jours (${jours} j) — penser au renouvellement.`);
    }
  } catch (err) {
    checks.push({ pass: false, label: `RDAP : verification impossible pour ${domaine} (${err.message})` });
  }
}

async function checkDns(domaine, checks) {
  try {
    const a = await resolve4(domaine).catch(() => null);
    if (a && a.length) {
      checks.push({ pass: true, label: `DNS : enregistrement A resout (${a.join(', ')})` });
      return;
    }
    const cname = await resolveCname(domaine).catch(() => null);
    if (cname && cname.length) {
      checks.push({ pass: true, label: `DNS : enregistrement CNAME resout (${cname.join(', ')})` });
      return;
    }
    checks.push({ pass: false, label: `DNS : aucun enregistrement A ni CNAME trouve pour ${domaine}` });
  } catch (err) {
    checks.push({ pass: false, label: `DNS : verification impossible (${err.message})` });
  }
}

async function checkMx(domaine, warnings) {
  try {
    const mx = await resolveMx(domaine);
    if (!mx || mx.length === 0) {
      warnings.push(`Aucun enregistrement MX pour ${domaine} (normal si l'e-mail du client n'est pas route via ce domaine).`);
    }
  } catch {
    warnings.push(`Aucun enregistrement MX pour ${domaine} (normal si l'e-mail du client n'est pas route via ce domaine).`);
  }
}

/**
 * Coeur reutilisable (CLI direct et tests) : lance tous les checks contre `baseUrl` (ex.
 * "https://exemple.fr" ou "http://localhost:8001"). `slug` sert a comparer le JSON-LD au
 * business.trade local si connu (optionnel). `domaine` force le domaine attendu pour le canonical/
 * RDAP/DNS (par defaut, le host de baseUrl). Ne fait jamais process.exit().
 */
export async function runSante(baseUrl, { slug = '', domaine = '' } = {}) {
  const checks = [];
  const warnings = [];
  const u = new URL(baseUrl);
  const isLocal = u.hostname === 'localhost' || u.hostname === '127.0.0.1';
  const domaineACheck = domaine || u.hostname;

  let homeOk = false;
  let homeHtml = '';
  try {
    const { res, text } = await fetchTexte(`${baseUrl}/`);
    homeOk = res.status === 200;
    homeHtml = text;
    checks.push(homeOk ? { pass: true, label: '/ repond 200' } : { pass: false, label: `/ repond ${res.status} (attendu 200)` });
  } catch (err) {
    checks.push({ pass: false, label: `/ injoignable : ${err.message}` });
  }

  await checkStatut200(baseUrl, '/sitemap-index.xml', 'sitemap-index.xml', checks);
  await checkStatut200(baseUrl, '/mentions-legales', '/mentions-legales', checks);
  await checkStatut200(baseUrl, '/confidentialite', '/confidentialite', checks);
  await checkStatut404(baseUrl, checks);
  await checkRedirectionHttps(baseUrl, isLocal, checks);

  if (homeOk) {
    checkCanonical(homeHtml, domaineACheck, checks);
    await checkCacheControlAsset(baseUrl, homeHtml, checks, warnings);
    checkTitreEtDescription(homeHtml, checks);
    await checkJsonLd(homeHtml, slug, checks);
    if (/href=["']tel:/i.test(homeHtml)) checks.push({ pass: true, label: 'Lien tel: present sur la page d\'accueil' });
    else checks.push({ pass: false, label: 'Aucun lien tel: trouve sur la page d\'accueil' });
    if (/\bdata-form=/i.test(homeHtml)) checks.push({ pass: true, label: 'Formulaire de contact present (data-form)' });
    else checks.push({ pass: false, label: 'Aucun formulaire de contact (data-form) trouve' });
  } else {
    checks.push({ pass: false, label: 'canonical/cache/title/description/JSON-LD/tel/formulaire non verifies (page d\'accueil injoignable)' });
  }

  await checkTempsDeReponse(baseUrl, checks);

  if (isLocal) {
    warnings.push('Cible locale (localhost) : verifications TLS, RDAP et DNS ignorees.');
  } else {
    await checkTls(u.hostname, checks, warnings);
    await checkRdap(domaineACheck, checks, warnings);
    await checkDns(domaineACheck, checks);
    await checkMx(domaineACheck, warnings);
  }

  return { checks, warnings };
}

/** Resout l'argument passe en CLI (slug connu, ou URL brute) en { baseUrl, slug, domaine }. */
function resoudreCible(arg, domaineFlag) {
  if (/^https?:\/\//i.test(arg)) {
    const u = new URL(arg);
    return { baseUrl: `${u.protocol}//${u.host}`, slug: slugify(u.hostname), domaine: domaineFlag || u.hostname };
  }
  const slug = resolveSlug(arg);
  const domainFile = path.join(SITES_DIR, slug, 'domain.txt');
  const domaine = domaineFlag || (fs.existsSync(domainFile) ? fs.readFileSync(domainFile, 'utf8').trim() : `${slug}.pages.dev`);
  return { baseUrl: `https://${domaine}`, slug, domaine };
}

function printReport(checks, warnings) {
  info('');
  for (const chk of checks) {
    if (chk.pass) ok(chk.label);
    else fail(chk.label);
  }
  if (warnings.length > 0) {
    info('');
    for (const w of warnings) warn(w);
  }
  info('');
}

/** CLI direct : `ff sante <slug|url> [--domaine x]`. */
export async function cmdSante(args) {
  const { positional, flags } = parseArgs(args);
  const arg = positional[0];
  if (!arg) {
    fail('Indique un slug ou une URL, ex : `ff sante menuiserie-vasseur` ou `ff sante https://menuiserie-vasseur.fr`.');
    process.exit(1);
  }
  const { baseUrl, slug, domaine } = resoudreCible(arg, typeof flags.domaine === 'string' ? flags.domaine : '');
  info(`Bilan de sante de ${c.bold(baseUrl)}`);

  const { checks, warnings } = await runSante(baseUrl, { slug, domaine });
  cleanTmp();
  printReport(checks, warnings);

  fs.mkdirSync(path.join(ROOT, 'captures'), { recursive: true });
  const outPath = path.join(ROOT, 'captures', `${slug}-sante.json`);
  fs.writeFileSync(outPath, JSON.stringify({ slug, baseUrl, domaine, generatedAt: new Date().toISOString(), checks, warnings }, null, 2));
  ok(`Resultats ecrits dans ${c.cyan(path.relative(ROOT, outPath))}`);

  const success = !checks.some((x) => !x.pass);
  if (success) ok('Aucun ✗ : site en bonne sante.');
  else fail('Au moins un ✗ ci-dessus a corriger.');
  process.exit(success ? 0 : 1);
}
