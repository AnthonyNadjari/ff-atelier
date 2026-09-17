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
// POST /api/contact : valide (nom, telephone, honeypot), limite naivement par IP (Cache API),
// envoie l'e-mail via le binding Email Routing `env.EMAIL` (Settings -> Functions -> Email
// bindings, variable EMAIL) en utilisant l'API structuree recommandee `env.EMAIL.send({...})`
// (https://developers.cloudflare.com/email-routing/email-workers/send-email-workers/ — pas besoin
// de construire un MIME brut ni d'importer 'cloudflare:email' : cette methode remplace
// l'ancienne API EmailMessage/raw, gardee pour compatibilite mais plus recommandee pour du code
// neuf). Repli sur Resend si `env.RESEND_API_KEY` est configure (Settings -> Environment
// variables). Repond toujours en JSON { success }.

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
