// `ff aide` (ou aucune commande) : aide en francais.
import { c, info } from './util.mjs';

const ROWS = [
  ['nouveau <slug> [--direction X] [--metier "..."] [--depuis _exemple]', "Cree un nouveau site a partir d'un modele."],
  ['dev [slug]', 'Lance le serveur de developpement.'],
  ['build [slug]', 'Construit le site (dist/<slug>).'],
  ['preview [slug]', 'Previsualise le build.'],
  ['tous', 'Construit tous les sites (hors _test*), avec un resume ok/erreur.'],
  ['verifier [slug]  (alias : check)', 'Build + verifications SEO/contenu/rendu + bloc visibilite IA (robots.txt bots de recherche IA, llms.txt, JSON-LD FAQPage/Service), checklist ✓/✗.'],
  ['images <slug>', 'Convertit sites/<slug>/raw/ en .webp dans public/images/.'],
  ['nettoyer-photos <slug> [--angle N] [--duotone] [--valider]', 'Nettoie sites/<slug>/raw/ avant `ff images` (sharp seul) : rotation EXIF+angle, recadrage bordures, recadrage focal 4:3/3:2, balance des blancs, duotone optionnel. Feuille de contact .ff-tmp/nettoye/apercu.html ; --valider promeut vers raw/.'],
  ['photos <slug> "<requete>" [--source unsplash|pexels] [--n 8] [--orientation ...] [--choisir 1,3]', 'Cherche des photos libres (Unsplash/Pexels), feuille de contact, copie les choisies + CREDITS.md.'],
  ['video <slug> "<requete>" [--source pexels] [--max-mo 2] [--duree 8]', 'Cherche une video Pexels, genere webm/mp4/poster via ffmpeg (ou garde le mp4 source).'],
  ['sequence <slug> <video.mp4|.mov> [--n 60] [--largeur 1280] [--nom montre]', "Extrait N frames espacees regulierement d'une video SANS ffmpeg (Chrome via playwright-core), reencode en webp desktop+mobile dans public/anim/<nom>(-mobile)/, affiche les attributs data-frames-* a coller. Repli : commande ffmpeg si Chrome ne decode pas le codec (HEVC .mov iPhone)."],
  ['animer <slug> <image> "<prompt>" [--modele minimax|kling] [--duree 5] [--simuler]', "Anime une PHOTO REELLE du client (image-to-video, fal.ai) : mp4 dans .ff-tmp/animer/, CREDITS.md, suggere `ff sequence`. Jamais sur une image generee/banque presentee comme \"du client\" ; marquage AI Act (data-ia=\"1\" + mention visible) obligatoire sur la section. --simuler affiche les appels sans cle."],
  ['illustration <slug> "<theme>" [--couleur "#hex"]', 'Tente une illustration unDraw recoloree ; sinon procedure manuelle (pas d\'API publique).'],
  ['variete', 'Compare direction/nav/hero/sections entre sites, signale les doublons.'],
  ['matrice [--rapide]', 'Construit des sites jetables couvrant chaque direction/variante au moins une fois (fumigene large).'],
  ['exporter <slug> [--dest ../<slug>-site]', "Cree un depot autonome pret a donner au client."],
  ['deploy <slug> [--projet <nom>]', 'Build puis deploie sur Cloudflare Pages. Si le site a un domaine, cree la cle IndexNow avant le build puis soumet les URLs a Bing apres le deploiement (visibilite ChatGPT/Copilot).'],
  ['indexnow <slug> [--simuler]', "Soumet les URLs du site (sitemap builde) a IndexNow = Bing + moteurs participants. ChatGPT Search et Copilot puisent dans l'index Bing. La cle sites/<slug>/public/indexnow-<cle>.txt est creee si absente. Appele automatiquement par `ff deploy` quand le site a un domaine. --simuler affiche l'appel sans l'envoyer."],
  ['domaine <slug> <domaine> [--zone-id X] [--email-vers adresse] [--www] [--simuler]', "Branche un site deploye sur un domaine personnalise (Cloudflare Pages + DNS) et, avec --email-vers, active Email Routing (contact@domaine -> adresse). Ecrit sites/<slug>/domain.txt. --simuler affiche les appels API sans les executer."],
  ['liste', 'Liste les sites, leur direction, et si le build existe.'],
  ['studio <slug>', "Editeur visuel du LOOK en local (direction, motion, accent...) avec previsualisation live."],
  ['figer <slug>', 'Fusionne sites/<slug>/look.json (ecrit par `ff studio`) dans site.config.ts, puis le supprime.'],
  ['modeles', 'Liste les modeles (presets/*.json) : titre, direction/hero, metiers, vignette generee ou non.'],
  ['modele <slug> <nom>', 'Applique un modele (presets/<nom>.json) : copie son look dans sites/<slug>/look.json.'],
  ['vignettes [nom ...] [--forcer]', 'Genere presets/vignettes/<nom>.webp (capture du modele sur _exemple). Sans argument : tous les presets manquants ou perimes.'],
  ['composer <slug> [--metier "..."] [--graine N] [--ecrire]', "Propose automatiquement un look (direction, polices, variantes) adapte au metier et a la variete existante."],
  ['propositions <slug> [--n 3] [--graine N]', 'Genere N looks distincts avec captures, en une feuille de contact HTML (propositions/<slug>/index.html).'],
  ['propositions <slug> --appliquer <i>', 'Applique la proposition i comme look.json du site.'],
  ['og <slug>', "Genere sites/<slug>/public/og.webp (1200x630) et configure images.og dans site.config.ts."],
  ['captures [slug ...]', 'Captures pleine page desktop + mobile de chaque site construit (captures/), + erreurs console.'],
  ['audit-motion [slug ...]', "Audite les animations (src/scripts/motion.ts) de chaque site DEJA CONSTRUIT : defile lentement desktop+mobile, repere reveals bloques, pins casses, canvas de sequence jamais dessine, marquee non duplique, compteurs a 0, debordements, typographie et contraste. Rapport ✓/✗ en francais, captures/<slug>-motion.json, sort en erreur si un site echoue."],
  ['lighthouse [slug] [--mobile] [--seuil 90] [--detail]', 'Audite performance/accessibilite/bonnes pratiques/SEO (Lighthouse) sur accueil + 1 page service + mentions legales, desktop et mobile ; captures/<slug>-lighthouse.json. --detail : imprime chaque audit en echec (toutes categories) avec extraits de noeuds fautifs.'],
  ['perf <slug> [--build] [--lighthouse]', 'Budget de performance SANS navigateur (rapide) : somme html/css/js-initial/js-lazy/fonts/images-home dans dist/<slug>, compare a perf-budget.json, table ✓/✗, sort en erreur si depasse. --build force une reconstruction. --lighthouse enchaine `ff lighthouse` (score + LCP reel).'],
  ['archiver <slug>', "Sauvegarde ponctuelle : zippe sites/<slug> + dist/<slug> (s'il existe) dans archives/<slug>-<date>.zip (dossier local, jamais commite). Compress-Archive PowerShell sur Windows, zip ailleurs."],
  ['detect <slug> [--pages] [--tout] [--conseils]', "Passe les 61 regles deterministes d'Impeccable (npx -y impeccable detect, sans cle ni navigateur) sur dist/<slug>/index.html : contraste WCAG du texte accent (hover compris), texte fonctionnel < 11px, uppercase trop long, ombres colorees, eyebrow au-dessus du h1. Sort en erreur sur contraste/taille, avertit pour le reste ; ignore cramped-padding et tight-leading (faux positifs connus, --tout pour les voir). --pages : toutes les pages. Voir docs/veille/skills-design-ia.md."],
  ['vitrine [slug ...] [--matiere]', "Regenere les vignettes de la galerie du site Finck & Fisch depuis captures/<slug>-desktop.png : choisit automatiquement le cadrage 14:9 le plus riche visuellement (balayage vertical, entropie + contraste) au lieu du haut de page, ecrit <slug>.webp et <slug>-480.webp. Par defaut le premier ecran (une vignette doit se lire comme un site) ; --matiere cherche le passage le plus photographique."],
  ['logo <slug> <fichier.png> [--seuil 205] [--nom logo]', "Prepare un logo plat (encre sur fond creme, sans transparence) : detoure par luminosite (fond clair rendu transparent, bords doux), rogne au plus juste, et ecrit DEUX fichiers dans sites/<slug>/public/images/ : <nom>.png (encre, fonds clairs) et <nom>-clair.png (blanc, fonds sombres). --seuil plus bas = detourage plus severe."],
  ['sante <slug|url> [--domaine x]', "Bilan de sante d'un site DEJA EN LIGNE (pas un build local) : HTTP 200 (accueil, sitemap, mentions legales, confidentialite), 404 reel sur /404, redirection HTTP->HTTPS, canonical, Cache-Control d'un asset /_astro, robots.txt, title/description/JSON-LD/tel:/formulaire, temps de reponse, certificat TLS, expiration du domaine (RDAP), DNS, MX. A lancer a J+1 puis une fois par mois (docs/PROCESS.md). Accepte un slug connu (lit sites/<slug>/domain.txt) ou une URL directe (ex. http://localhost:8001 pour tester un `ff servir` local, TLS/RDAP/DNS alors ignores). Ecrit captures/<slug>-sante.json."],
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
