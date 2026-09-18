// Worker Cloudflare Pages (mode avance, voir docs/DEPLOIEMENT.md § Formulaire Cloudflare Workers +
// Email Routing). Gabarit source ; copie et personnalise (placeholders __FF_...__ remplaces) par
// scripts/ff/dev-build-preview.mjs (cmdBuild) vers dist/<slug>/_worker.js quand
// site.config.ts a form.provider: 'cloudflare'. Ne PAS importer de package npm ici (mimetext,
// etc.) : ce fichier est copie tel quel, sans etape de bundling.
//
// En mode avance (_worker.js present a la racine du dossier deploye), Cloudflare ignore tout
// dossier functions/ et route TOUTES les requetes vers ce Worker : on doit donc explicitement
// relayer vers env.ASSETS.fetch(request) pour servir les fichiers statiques du site
// (https://developers.cloudflare.com/pages/functions/advanced-mode/).
//
// POST /api/contact : valide (nom, telephone, honeypot, Turnstile si configure), limite naivement
// par IP (Cache API), envoie l'e-mail via le binding Email Routing `env.EMAIL` (Settings ->
// Functions -> Email bindings, variable EMAIL) en utilisant l'API structuree recommandee
// `env.EMAIL.send({...})` (https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/
// — pas besoin de construire un MIME brut ni d'importer 'cloudflare:email' : cette methode remplace
// l'ancienne API EmailMessage/raw, gardee pour compatibilite mais plus recommandee pour du code
// neuf). Repli sur Resend si `env.RESEND_API_KEY` est configure (Settings -> Environment
// variables). Repond toujours en JSON { success }.
//
// Turnstile (anti-spam, docs/DEPLOIEMENT.md § Anti-spam) : si `env.TURNSTILE_SECRET` est configure
// (Settings -> Environment variables, valeur = cle secrete Cloudflare Turnstile), verifie le jeton
// `cf-turnstile-response` pose par le widget de ContactForm.astro via l'endpoint siteverify
// (https://developers.cloudflare.com/turnstile/get-started/server-side-validation/ : POST
// application/x-www-form-urlencoded, champs secret/response/remoteip, reponse JSON { success }).
// Sans `TURNSTILE_SECRET` configure, le champ est ignore (pas de widget affiche si
// `form.turnstileSiteKey` n'est pas defini cote site.config.ts de toute facon).

const DEST_EMAIL = '__FF_DEST_EMAIL__';
const FROM_EMAIL = '__FF_FROM_EMAIL__';
const FROM_NAME = '__FF_FROM_NAME__';

function jsonResponse(body, status = 200) {
  return new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });
}

/** Limite naive : une soumission par IP toutes les 20 secondes, via la Cache API (pas de KV requis). */
async function estLimite(ip) {
  const cache = caches.default;
  const cle = new Request(`https://ff-rate-limit.internal/contact/${encodeURIComponent(ip)}`);
  if (await cache.match(cle)) return true;
  await cache.put(cle, new Response('1', { headers: { 'Cache-Control': 'max-age=20' } }));
  return false;
}

/** Verifie un jeton Turnstile aupres de Cloudflare. Renvoie true si TURNSTILE_SECRET absent (rien a verifier). */
async function turnstileValide(env, token, ip) {
  if (!env.TURNSTILE_SECRET) return true;
  if (!token) return false;
  try {
    const body = new URLSearchParams({ secret: env.TURNSTILE_SECRET, response: token });
    if (ip) body.set('remoteip', ip);
    const res = await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify', { method: 'POST', body });
    const data = await res.json();
    return Boolean(data.success);
  } catch {
    return false; // panne de siteverify = on refuse plutot que de laisser passer un bot sans preuve
  }
}

async function envoyerViaEmailRouting(env, { toEmail, replyTo, subject, text }) {
  if (!env.EMAIL) return false;
  await env.EMAIL.send({
    to: { email: toEmail },
    from: { email: FROM_EMAIL, name: FROM_NAME },
    replyTo: replyTo ? { email: replyTo } : undefined,
    subject,
    text,
  });
  return true;
}

async function envoyerViaResend(env, { toEmail, replyTo, subject, text }) {
  if (!env.RESEND_API_KEY) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { Authorization: `Bearer ${env.RESEND_API_KEY}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ from: `${FROM_NAME} <${FROM_EMAIL}>`, to: [toEmail], reply_to: replyTo || toEmail, subject, text }),
  });
  return res.ok;
}

async function handleContact(request, env) {
  let data;
  try {
    data = await request.json();
  } catch {
    return jsonResponse({ success: false, message: 'Requête invalide.' }, 400);
  }

  // Honeypot : un bot qui remplit ce champ cache reçoit un faux succès, sans envoi ni indice.
  if (data.botcheck) return jsonResponse({ success: true });

  const name = String(data.name || '').trim();
  const phone = String(data.phone || '').trim();
  if (!name || !phone) {
    return jsonResponse({ success: false, message: 'Nom et téléphone requis.' }, 400);
  }

  const ip = request.headers.get('CF-Connecting-IP') || request.headers.get('x-forwarded-for') || 'inconnu';
  if (await estLimite(ip)) {
    return jsonResponse({ success: false, message: 'Trop de demandes, réessayez dans un instant.' }, 429);
  }

  if (!(await turnstileValide(env, data['cf-turnstile-response'], ip !== 'inconnu' ? ip : undefined))) {
    return jsonResponse({ success: false, message: 'Vérification anti-robot invalide, réessayez.' }, 403);
  }

  const email = String(data.email || '').trim();
  const service = String(data.service || '').trim();
  const message = String(data.message || '').trim();
  const subject = String(data.subject || `Nouvelle demande de ${name}`).slice(0, 200);
  const text = [`Nom : ${name}`, `Téléphone : ${phone}`, email && `E-mail : ${email}`, service && `Besoin : ${service}`, '', message]
    .filter(Boolean)
    .join('\n');

  const enveloppe = { toEmail: DEST_EMAIL, replyTo: email || undefined, subject, text };

  let envoye = false;
  try {
    envoye = await envoyerViaEmailRouting(env, enveloppe);
  } catch {
    envoye = false;
  }
  if (!envoye) {
    try {
      envoye = await envoyerViaResend(env, enveloppe);
    } catch {
      envoye = false;
    }
  }

  return envoye ? jsonResponse({ success: true }) : jsonResponse({ success: false, message: 'Envoi impossible pour le moment.' }, 502);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (request.method === 'POST' && url.pathname === '/api/contact') {
      return handleContact(request, env);
    }
    return env.ASSETS.fetch(request);
  },
};
