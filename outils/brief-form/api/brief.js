// Fonction Vercel : reçoit les réponses du formulaire, les met en forme (lib/brief.mjs) et ouvre un ticket
// « brief » dans le dépôt privé du studio (GitHub Issues), lu ensuite par `node scripts/ff.mjs brief <numéro>`.
// Jeton : FF_BRIEF_TOKEN (variable d'environnement Vercel), jeton GitHub À GRAIN FIN limité au seul dépôt
// ff-atelier et à la permission « Issues : lecture et écriture ». Jamais un jeton large.
// Sans jeton, ou si GitHub refuse : la page affiche le brief à copier (aucune réponse perdue).
import { briefMarkdown, champsManquants, slugPropose } from '../lib/brief.mjs';

const DEPOT = process.env.FF_BRIEF_REPO || 'AnthonyNadjari/ff-atelier';

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.status(405).json({ ok: false }); return; }
  let d = req.body;
  if (typeof d === 'string') { try { d = JSON.parse(d); } catch { d = {}; } }
  d = d || {};
  if (d.site_web_pot) { res.status(200).json({ ok: true }); return; } // robot : on ne dit rien
  const manque = champsManquants(d);
  if (manque.length) { res.status(400).json({ ok: false, manque }); return; }
  const brief = briefMarkdown(d);
  const jeton = process.env.FF_BRIEF_TOKEN;
  if (!jeton) { res.status(503).json({ ok: false, raison: 'envoi automatique non configuré', brief }); return; }
  try {
    const r = await fetch(`https://api.github.com/repos/${DEPOT}/issues`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${jeton}`, Accept: 'application/vnd.github+json', 'X-GitHub-Api-Version': '2022-11-28', 'User-Agent': 'ff-brief-form' },
      body: JSON.stringify({ title: `Brief : ${String(d.nom).slice(0, 80)} (${String(d.metier).slice(0, 60)}) — ${slugPropose(d.nom, d.ville)}`, body: brief, labels: ['brief'] }),
    });
    if (!r.ok) { res.status(502).json({ ok: false, raison: `GitHub ${r.status}`, brief }); return; }
    const j = await r.json();
    res.status(200).json({ ok: true, numero: j.number });
  } catch {
    res.status(502).json({ ok: false, raison: 'GitHub injoignable', brief });
  }
}
