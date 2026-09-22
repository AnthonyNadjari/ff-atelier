/**
 * Integration Astro `ff-credits` : injecte la route /credits (src/pages-optional/credits.astro,
 * volontairement hors src/pages/ pour ne PAS etre auto-routee) uniquement quand
 * sites/<slug>/CREDITS.md existe et contient au moins un bloc credit ("## ..."). Un site sans
 * CREDITS.md (sites/_exemple, ou un client sans photo de banque) n'a donc aucune page /credits
 * dans dist/, et `ff verifier` ne peut pas la reclamer non plus (voir scripts/ff/verifier.mjs).
 *
 * `creditsHasEntries`/`siteHasCredits` sont aussi utilisees par scripts/vite-ff-look.mjs pour
 * exporter `hasCredits` (module virtuel `virtual:ff-look`, re-exporte par src/lib/site.ts) : c'est
 * ce booleen que les pieds de page partages (src/sections/Footer/*.astro) testent pour n'afficher
 * le lien "Credits photos" que si la page existe reellement.
 *
 * La page elle-meme (src/pages-optional/credits.astro) ne montre que les entrees dont la licence
 * exige une attribution visible (parseCredits().attribution non nul, src/lib/credits.ts) — une
 * photo CC0/domaine public peut donc faire exister CREDITS.md (et cette route) sans rien afficher
 * de plus qu'un intitule de page ; c'est volontaire, voir le rapport de la mission qui a ajoute ce
 * fichier pour le choix inverse envisage (les lister a titre informatif).
 */
import { existsSync, readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const CREDITS_PAGE = fileURLToPath(new URL('../src/pages-optional/credits.astro', import.meta.url));

/** Vrai si le texte contient au moins un bloc credit ("## <cible>"). */
export function creditsHasEntries(text) {
  return /^##[ \t]+\S/m.test(text || '');
}

/** Vrai si sites/<slug>/CREDITS.md existe et contient au moins une entree. */
export function siteHasCredits(root, slug) {
  const p = resolve(root, 'sites', slug, 'CREDITS.md');
  if (!existsSync(p)) return false;
  return creditsHasEntries(readFileSync(p, 'utf8'));
}

export function creditsIntegration({ root, slug }) {
  return {
    name: 'ff-credits',
    hooks: {
      'astro:config:setup': ({ injectRoute }) => {
        if (!siteHasCredits(root, slug)) return;
        injectRoute({ pattern: '/credits', entrypoint: CREDITS_PAGE });
      },
    },
  };
}
