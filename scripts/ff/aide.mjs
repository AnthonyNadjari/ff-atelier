// `ff aide` (ou aucune commande) : aide en francais.
import { c, info } from './util.mjs';

const ROWS = [
  ['nouveau <slug> [--direction X] [--metier "..."] [--depuis _exemple]', "Cree un nouveau site a partir d'un modele."],
  ['dev [slug]', 'Lance le serveur de developpement.'],
  ['build [slug]', 'Construit le site (dist/<slug>).'],
  ['preview [slug]', 'Previsualise le build.'],
  ['tous', 'Construit tous les sites (hors _test*), avec un resume ok/erreur.'],
  ['verifier [slug]  (alias : check)', 'Build + verifications SEO/contenu, checklist ✓/✗.'],
  ['images <slug>', 'Convertit sites/<slug>/raw/ en .webp dans public/images/.'],
  ['variete', 'Compare direction/nav/hero/sections entre sites, signale les doublons.'],
  ['matrice [--rapide]', 'Construit des sites jetables couvrant chaque direction/variante au moins une fois (fumigene large).'],
  ['exporter <slug> [--dest ../<slug>-site]', "Cree un depot autonome pret a donner au client."],
  ['deploy <slug> [--projet <nom>]', 'Build puis deploie sur Cloudflare Pages.'],
  ['liste', 'Liste les sites, leur direction, et si le build existe.'],
  ['studio <slug>', "Editeur visuel du LOOK en local (direction, motion, accent...) avec previsualisation live."],
  ['figer <slug>', 'Fusionne sites/<slug>/look.json (ecrit par `ff studio`) dans site.config.ts, puis le supprime.'],
  ['composer <slug> [--metier "..."] [--graine N] [--ecrire]', "Propose automatiquement un look (direction, polices, variantes) adapte au metier et a la variete existante."],
  ['propositions <slug> [--n 3] [--graine N]', 'Genere N looks distincts avec captures, en une feuille de contact HTML (propositions/<slug>/index.html).'],
  ['propositions <slug> --appliquer <i>', 'Applique la proposition i comme look.json du site.'],
  ['og <slug>', "Genere sites/<slug>/public/og.webp (1200x630) et configure images.og dans site.config.ts."],
  ['captures [slug ...]', 'Captures pleine page desktop + mobile de chaque site construit (captures/), + erreurs console.'],
  ['servir', 'Sert chaque dist/<slug> sur un port (8001, 8002, ...) pour comparer les sites.'],
  ['generer <slug>', "Brief -> site.config.ts via l'API Anthropic (ANTHROPIC_API_KEY dans .env)."],
  ['placeholders <slug> <#hexA> <#hexB>', 'Images abstraites provisoires (avant les vraies photos).'],
  ['aide', 'Affiche cette aide.'],
];

export function cmdAide() {
  info(c.bold('ff — atelier Finck & Fisch'));
  info('');
  info('Usage : ff <commande> [arguments]');
  info('        npm run ff -- <commande> [arguments]');
  info('');
  const width = Math.max(...ROWS.map((r) => r[0].length)) + 2;
  for (const [cmd, desc] of ROWS) {
    info(`  ${c.cyan(cmd.padEnd(width))} ${desc}`);
  }
  info('');
  info('Exemples :');
  info('  npm run ff -- nouveau menuiserie-vasseur --direction atelier --metier "Menuisier"');
  info('  npm run ff -- images menuiserie-vasseur');
  info('  npm run ff -- verifier menuiserie-vasseur');
  info('  npm run ff -- deploy menuiserie-vasseur --projet menuiserie-vasseur');
}
