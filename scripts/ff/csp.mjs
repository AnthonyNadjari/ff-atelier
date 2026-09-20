// Construction de la Content-Security-Policy (et des en-tetes de securite associes) d'un site,
// a partir de sites/<slug>/site.config.ts — lu par regex (meme motif que scripts/ff/verifier.mjs
// `readTradeFromConfig` / scripts/ff/dev-build-preview.mjs `readConfigField` : pas d'import TS hors
// contexte Vite). Module pur (aucun I/O ici sauf `readSiteSecurityConfig`), pour rester testable
// directement par tests/headers.test.mjs sans build Astro.
//
// Sources verifiees (WebFetch, 17 sept 2026) :
// - Cloudflare Pages `_headers` : https://developers.cloudflare.com/pages/configuration/headers/
//   (fichier a la racine du dossier deploye, une regle = un chemin + des lignes d'en-tete indentees,
//   un en-tete par ligne — donc la CSP doit tenir sur UNE seule ligne, directives separees par `; `).
// - Turnstile (widget + siteverify) : https://developers.cloudflare.com/turnstile/
//   le widget charge `https://challenges.cloudflare.com/turnstile/v0/api.js` et s'affiche dans un
//   iframe du meme domaine — d'ou `challenges.cloudflare.com` en script-src ET en frame-src.
// - Cloudflare Web Analytics (beacon) : script `static.cloudflareinsights.com/beacon.min.js`, appels
//   XHR vers `cloudflareinsights.com` (voir docs/veille/performance.md § 5.5, docs/DEPLOIEMENT.md § 2.3bis).

/** Lit une valeur `cle: "..."` simple dans un texte de site.config.ts (regex, pas d'import TS). */
export function readConfigField(src, key) {
  const m = src.match(new RegExp(`\\b${key}\\s*:\\s*(['"\`])((?:\\\\.|(?!\\1).)*)\\1`));
  return m ? m[2] : '';
}

/**
 * Lit dans le texte brut de site.config.ts tout ce dont la CSP a besoin. Volontairement tolerant
 * (site.config.ts absent ou illisible -> config minimale, jamais d'exception) : la CSP resultante
 * est alors la plus stricte (sans les origines optionnelles), jamais une CSP absente.
 */
export function readSiteSecurityConfig(src) {
  const text = src || '';

  // Bloc `analytics: { ... }` isole d'abord (un niveau d'imbrication tolere, pour son `umami: {...}`
  // interne) avant d'y chercher plausible/cloudflare/umami.src — sinon un `[^}]*` naif s'arrete au
  // premier `}` rencontre (celui d'`umami`) et ne voit jamais `cloudflare` qui le suit. Meme
  // precaution pour ne jamais confondre `src` avec un autre champ du fichier (ex. une image).
  const analyticsBlock = text.match(/\banalytics\s*:\s*\{((?:[^{}]|\{[^{}]*\})*)\}/);
  const analyticsText = analyticsBlock ? analyticsBlock[1] : '';
  const umamiBlock = analyticsText.match(/\bumami\s*:\s*\{([^}]*)\}/);
  const analyticsUmamiSrc = umamiBlock ? readConfigField(umamiBlock[1], 'src') : '';

  // Meme precaution pour `mapsProvider` : mapsUrl/mapsEmbed pourraient sinon faire confondre 'provider'.
  const mapsProviderMatch = text.match(/\bmapsProvider\s*:\s*['"`](osm|google|none)['"`]/);

  return {
    formProvider: readConfigField(text, 'provider') || 'mailto',
    turnstileSiteKey: readConfigField(text, 'turnstileSiteKey'),
    mapsProvider: mapsProviderMatch ? mapsProviderMatch[1] : 'osm',
    analyticsPlausible: Boolean(readConfigField(analyticsText, 'plausible')),
    analyticsUmamiSrc,
    analyticsCloudflare: Boolean(readConfigField(analyticsText, 'cloudflare')),
  };
}

/** Origine (schema://host) d'une URL, ou '' si invalide — pour connect-src/script-src depuis une URL complete (ex. umami.src). */
function originOf(url) {
  try {
    return new URL(url).origin;
  } catch {
    return '';
  }
}

/**
 * Construit la valeur de l'en-tete Content-Security-Policy pour un site, a partir de sa config
 * (voir `readSiteSecurityConfig`). Directives fixes (docs/DEPLOIEMENT.md § Securite) + origines
 * ajoutees seulement quand la fonctionnalite correspondante est active sur CE site — jamais
 * d'origine large "au cas ou" (moins de surface, CSP plus utile).
 *
 * Scripts inline : `Base.astro` (init du moteur d'animation), `ContactForm.astro` (soumission),
 * `Carte.astro` (facade Google Maps au clic) posent chacun un `<script>` sans `src`, sans nonce
 * possible en build statique (Astro genere le HTML une fois pour tous les visiteurs : un nonce doit
 * changer a CHAQUE reponse, ce qu'un site statique ne peut pas faire — il faudrait un Worker qui
 * reecrit le HTML a la volee, hors de portee ici). D'ou `'unsafe-inline'` sur `script-src`, documente
 * plutot que contourne : c'est la seule option viable pour un build 100% statique.
 */
export function buildCsp(config = {}) {
  const {
    formProvider = 'mailto',
    turnstileSiteKey = '',
    mapsProvider = 'osm',
    analyticsPlausible = false,
    analyticsUmamiSrc = '',
    analyticsCloudflare = false,
    usesLottie = false,
  } = config;

  const hasTurnstile = Boolean(turnstileSiteKey);
  const umamiOrigin = originOf(analyticsUmamiSrc);

  const scriptSrc = new Set(["'self'", "'unsafe-inline'"]);
  const connectSrc = new Set(["'self'"]);
  const frameSrc = new Set();

  if (analyticsPlausible) { scriptSrc.add('https://plausible.io'); connectSrc.add('https://plausible.io'); }
  if (umamiOrigin) { scriptSrc.add(umamiOrigin); connectSrc.add(umamiOrigin); }
  if (analyticsCloudflare) { scriptSrc.add('https://static.cloudflareinsights.com'); connectSrc.add('https://cloudflareinsights.com'); }
  if (hasTurnstile) { scriptSrc.add('https://challenges.cloudflare.com'); frameSrc.add('https://challenges.cloudflare.com'); }
  if (formProvider === 'web3forms') connectSrc.add('https://api.web3forms.com');
  if (mapsProvider === 'google') { frameSrc.add('https://www.google.com'); frameSrc.add('https://maps.google.com'); }
  // data-lottie : le lecteur (@lottiefiles/dotlottie-web, bundle par nous) va chercher son moteur
  // WASM sur un CDN a l'execution — bloque par `connect-src 'self'` (vu sur sites/_effets, 20 sept
  // 2026). Origines ajoutees seulement si une section du site pose l'attribut.
  if (usesLottie) {
    connectSrc.add('https://cdn.jsdelivr.net');
    connectSrc.add('https://unpkg.com');
    // Compiler un module WebAssembly est soumis a script-src : sans `'wasm-unsafe-eval'` Chrome
    // refuse `WebAssembly.instantiateStreaming` (vu sur sites/_effets, 20 sept 2026). Ce mot-cle
    // n'autorise QUE le WASM, pas eval()/new Function() — bien plus etroit que 'unsafe-eval'.
    scriptSrc.add("'wasm-unsafe-eval'");
  }

  const directives = [
    `default-src 'self'`,
    `script-src ${[...scriptSrc].join(' ')}`,
    `style-src 'self' 'unsafe-inline'`,
    `img-src 'self' data: blob: https://tile.openstreetmap.org`,
    // 'self' seul cassait en test reel (`ff captures` sur maison-aurore, 17 sept 2026) : avec
    // `build: { inlineStylesheets: 'always' }` (astro.config.mjs), tout le CSS passe en <style>
    // inline, et Vite inline aussi tout asset reference (url()) sous 4 Ko (assetsInlineLimit par
    // defaut) en `data:` — dont un petit `@font-face` de repli (Fontaine, fallback metric-adjusted,
    // voir docs/veille/performance.md § 1.4). Un `data:` genere par NOTRE build n'est pas une
    // origine externe (rien a charger depuis un tiers) : `data:` est donc ajoute ici, pas retire du
    // build.
    `font-src 'self' data:`,
    `connect-src ${[...connectSrc].join(' ')}`,
    `frame-src ${frameSrc.size ? [...frameSrc].join(' ') : "'none'"}`,
    `media-src 'self'`,
    `object-src 'none'`,
    `base-uri 'self'`,
    `form-action ${formProvider === 'web3forms' ? "'self' https://api.web3forms.com" : "'self'"}`,
    `upgrade-insecure-requests`,
  ];
  return directives.join('; ');
}

/** Lignes `_headers` (bloc `/*`) pour les en-tetes de securite au-dela de la CSP (deja dans astro.config.mjs). */
export function buildSecurityHeaderLines(config = {}) {
  return [
    `  Content-Security-Policy: ${buildCsp(config)}`,
    `  Permissions-Policy: camera=(), microphone=(), geolocation=()`,
    `  Strict-Transport-Security: max-age=31536000; includeSubDomains`,
  ];
}
