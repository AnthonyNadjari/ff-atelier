/**
 * robots.txt généré à la volée (remplace l'ancien fichier statique sites/<slug>/public/robots.txt).
 * Deux raisons : le sitemap exige une URL ABSOLUE (l'ancien `Sitemap: /sitemap-index.xml` relatif
 * était ignoré par les moteurs), et la politique vis-à-vis des robots IA est explicitée — les
 * robots de recherche IA (OAI-SearchBot, PerplexityBot...) sont ce qui permet au client d'être
 * cité dans les réponses de ChatGPT, Perplexity, Copilot et Google AI Overviews.
 */
import type { APIRoute } from 'astro';
import { site } from '@/lib/site';

export const GET: APIRoute = ({ site: astroSite }) => {
  // Démo privée pour un prospect (legal.prospect) : aucun robot, aucun sitemap annoncé.
  if (site.legal.prospect) {
    return new Response(`# ${site.business.name} : démo privée, non indexée\nUser-agent: *\nDisallow: /\n`, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
  }
  const sitemap = astroSite ? `Sitemap: ${new URL('/sitemap-index.xml', astroSite).toString()}\n` : '';
  const body = `# ${site.business.name} — robots.txt (généré par src/pages/robots.txt.ts)

User-agent: *
Allow: /

# Robots de recherche IA : autorisation explicite. Certains pare-feux applicatifs (dont
# Cloudflare, si l'option anti-bots IA est cochée) les filtrent par défaut — vérifier au
# déploiement (docs/DEPLOIEMENT.md). Sans eux, le site est invisible des réponses IA.
User-agent: OAI-SearchBot
Allow: /

User-agent: ChatGPT-User
Allow: /

User-agent: PerplexityBot
Allow: /

User-agent: Perplexity-User
Allow: /

User-agent: Claude-SearchBot
Allow: /

User-agent: Claude-User
Allow: /

# Robots d'entraînement IA (distincts de la recherche) : laissés autorisés par défaut, la
# visibilité dans les réponses IA en dépend aussi. Si le client préfère les refuser,
# ajouter pour chacun (GPTBot, ClaudeBot, Google-Extended, CCBot, Bytespider, Amazonbot,
# Meta-ExternalAgent) :
# User-agent: GPTBot
# Disallow: /

${sitemap}`;
  return new Response(body, { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
