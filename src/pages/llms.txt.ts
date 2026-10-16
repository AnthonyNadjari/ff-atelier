/**
 * llms.txt généré depuis site.config.ts (standard proposé par Jeremy Howard, llmstxt.org) : une
 * synthèse Markdown du site à la racine, pensée pour être ingérée telle quelle par un LLM.
 * À vocation « parité d'information » : tout ce qu'un moteur de réponse IA doit savoir sur
 * l'entreprise, en texte brut, sans avoir à parser le HTML. Adoption encore faible côté bots —
 * le fichier coûte quasi rien à produire puisque tout vient du schéma.
 */
import type { APIRoute } from 'astro';
import { site, fullAddress } from '@/lib/site';

const stripHtml = (s: string) => s.replace(/<[^>]+>/g, '');

export const GET: APIRoute = ({ site: astroSite }) => {
  const url = (p: string) => (astroSite ? new URL(p, astroSite).toString() : p);
  const lignes: string[] = [];

  lignes.push(`# ${site.business.name}`, '');
  lignes.push(`> ${stripHtml(site.business.tagline)} ${site.business.trade} — ${site.contact.address.city}.`, '');

  const desc = site.business.description.split(/\n\s*\n/)[0].trim();
  if (desc) lignes.push(desc, '');

  lignes.push('## Contact');
  lignes.push(`- Téléphone : ${site.contact.phoneDisplay}`);
  if (site.contact.email) lignes.push(`- E-mail : ${site.contact.email}`);
  lignes.push(`- Adresse : ${fullAddress()}`);
  for (const h of site.contact.hours) lignes.push(`- Horaires : ${h.days} ${h.hours}`);
  if (site.contact.emergency24h) lignes.push('- Urgences : 24 h/24, 7 j/7');
  lignes.push('');

  lignes.push('## Services');
  for (const s of site.services) lignes.push(site.servicePages ? `- [${s.title}](${url(`/services/${s.slug}`)}) : ${s.short}` : `- ${s.title} : ${s.short}`);
  lignes.push('');

  const villes = site.zones.cities;
  if (villes.length > 0 || site.zones.label) {
    lignes.push("## Zone d'intervention");
    if (site.zones.label) lignes.push(`- ${site.zones.label}`);
    if (villes.length > 0) lignes.push(`- ${villes.join(', ')}`);
    lignes.push('');
  }

  if (site.faq.length > 0) {
    lignes.push('## Questions fréquentes');
    for (const f of site.faq) lignes.push(`### ${f.q}`, f.a, '');
  }

  lignes.push('## Pages');
  lignes.push(`- [Accueil](${url('/')})`);
  lignes.push(`- [Mentions légales](${url('/mentions-legales')})`);
  lignes.push(`- [Politique de confidentialité](${url('/confidentialite')})`);
  lignes.push('');

  return new Response(lignes.join('\n'), { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
