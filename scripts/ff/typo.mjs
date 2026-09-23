/**
 * `ff typo [slug...] [--corriger]` — controle de la typographie FRANCAISE du texte visible.
 *
 * Pourquoi : un site francais mal compose se repere immediatement par un lecteur francais, meme
 * s'il ne sait pas dire pourquoi (apostrophe droite, guillemets anglais, "urgence?" colle,
 * "9h30", "N°", "1200€"). C'est le tell « genere » le plus silencieux — voir
 * docs/veille/typographie.md.
 *
 * Deux moitiees, volontairement separees :
 *   1. un noyau PUR (corrigerTexte / controlerTexte) qui ne connait que des chaines de texte et
 *      ne touche JAMAIS l'interieur d'une balise, d'un attribut, d'une URL, d'un e-mail ou d'une
 *      entite HTML (ils sont masques avant traitement, demasques apres) — teste par tests/typo.test.mjs ;
 *   2. une couche fichiers (lecture de dist/<slug>/**\/*.html pour le rapport, reecriture de
 *      sites/<slug>/site.config.ts et sites/<slug>/sections/*.astro pour --corriger).
 *
 * Regles de reference : Lexique des regles typographiques en usage a l'Imprimerie nationale,
 * resumees dans docs/veille/typographie.md §A, et docs/CONVENTIONS.md regle 22.
 */
import fs from 'node:fs';
import path from 'node:path';
import { DIST_DIR, SITES_DIR, listSites, siteExists, ok, fail, warn, info, c, parseArgs } from './util.mjs';

/** Espace fine insecable U+202F : avant ; ! ? et a l'interieur des guillemets « ». */
export const FINE = ' ';
/** Espace insecable U+00A0 : avant `:`, entre un nombre et son unite, dans un telephone. */
export const NBSP = ' ';

/* =====================================================================
   1. MASQUAGE — ce a quoi on ne touche jamais
   ===================================================================== */

/**
 * Tout ce qui doit traverser les corrections intact : balise HTML (et donc ses attributs),
 * entite HTML, URL, chemin, e-mail, schema `tel:`/`mailto:`, nom de domaine nu, sequence
 * d'echappement JS/TS. L'ordre compte : la balise avant l'URL (un href vit dans une balise).
 */
const PROTEGE = new RegExp(
  [
    '<\\/?[a-zA-Z][^<>]*>', // balise HTML complete, attributs compris
    '&(?:[a-zA-Z][a-zA-Z0-9]{1,31}|#\\d{1,7}|#[xX][0-9a-fA-F]{1,6});', // entite HTML
    'https?:\\/\\/[^\\s<>"«»]+', // URL absolue
    '(?:tel|mailto|sms|geo|data):[^\\s<>"]+', // autres schemas
    '\\bwww\\.[^\\s<>"]+', // URL sans schema
    '[\\w.+-]+@[\\w-]+(?:\\.[\\w-]+)+', // e-mail
    '\\b[\\w-]+(?:\\.[\\w-]+)*\\.(?:fr|com|net|org|io|eu|be|ch|ca|dev|app|html|css|js|ts|mjs|astro|json|webp|avif|png|jpg|svg|md)\\b', // domaine / fichier
    '\\{[^{}\\n]*:[^{}\\n]*\\}', // bloc de code accolade (declaration CSS, objet JS) sur une ligne
    '\\\\[\\\\\'"`nrtu]', // echappement JS (\\' dans un literal)
  ].join('|'),
  'g',
);

/** Zone privee Unicode : aucun texte client n'en contient, aucune regle ci-dessous ne les vise. */
const SENTINELLE_BASE = 0xe100;

/** Remplace chaque fragment protege par un caractere unique de la zone privee. */
export function masquer(texte) {
  const jetons = [];
  const masque = String(texte).replace(PROTEGE, (m) => {
    if (jetons.length >= 0xf8ff - SENTINELLE_BASE) return m; // securite : trop de jetons, on laisse tel quel
    jetons.push(m);
    return String.fromCharCode(SENTINELLE_BASE + jetons.length - 1);
  });
  return { masque, jetons };
}

/** Remet les fragments proteges a leur place. */
export function demasquer(masque, jetons) {
  return String(masque).replace(/[-]/g, (ch) => {
    const i = ch.charCodeAt(0) - SENTINELLE_BASE;
    return i >= 0 && i < jetons.length ? jetons[i] : ch;
  });
}

/* =====================================================================
   2. DICTIONNAIRES
   ===================================================================== */

/** Mots ou la suite « oe » est en realite la ligature œ. Liste fermee : « coefficient »,
 *  « moelleux » ou « poele » contiennent un vrai o suivi d'un e et ne doivent PAS bouger. */
const RACINES_OE = [
  'coeur', 'soeur', 'oeuf', 'oeuvr', 'voeu', 'noeud', 'boeuf', 'moeurs', 'oeil', 'oeillet',
  'choeur', 'manoeuvr', 'oesophag', 'oedem', 'oenolog', 'foetus', 'oecumen', 'oestro', 'coelio',
];
const RE_OE = new RegExp(`\\b(?:${RACINES_OE.join('|')})`, 'gi');
/** Noms propres : pas de frontiere de mot exploitable (Marcq-en-Barœul, Værøy...). */
const RE_OE_NOMS = /Baroeul|Laoken|Moebius/g;

/**
 * Majuscules accentuees (Academie francaise : l'accent a pleine valeur orthographique, y compris
 * sur les capitales). Forme fautive -> forme correcte, appliquee en debut de mot uniquement.
 */
const MAJUSCULES_ACCENTUEES = {
  Ebenist: 'Ébénist', Echafaud: 'Échafaud', Echang: 'Échang', Echantillon: 'Échantillon',
  Echelle: 'Échelle', Eclairage: 'Éclairage', Ecolog: 'Écolog', Ecole: 'École', Econom: 'Économ',
  Ecout: 'Écout', Ecran: 'Écran', Ecrit: 'Écrit', Edition: 'Édition', Eglise: 'Église',
  Elagage: 'Élagage', Elagu: 'Élagu', Electric: 'Électric', Elegan: 'Élégan', Element: 'Élément',
  Email: 'Émail', Energ: 'Énerg', Epaisseur: 'Épaisseur', Epicerie: 'Épicerie', Equip: 'Équip',
  Etabli: 'Établi', Etage: 'Étage', Etanch: 'Étanch', Etat: 'État', Ete: 'Été', Etude: 'Étude',
  Etudi: 'Étudi', Evacuation: 'Évacuation', Evenement: 'Événement', Evier: 'Évier',
  Evident: 'Évident', Evit: 'Évit', Etre: 'Être', Ile: 'Île', Ilot: 'Îlot', Ame: 'Âme',
  Age: 'Âge', Oeuvr: 'Œuvr', Ca: 'Ça',
};
const RE_MAJ_ACCENT = new RegExp(`\\b(?:${Object.keys(MAJUSCULES_ACCENTUEES).join('|')})`, 'g');

/** Unites collees au nombre : la valeur et son unite sont separees par une insecable. */
const UNITES = ['km', 'cm', 'mm', 'kg', 'mL', 'cL', 'min', 'm²', 'm2', '°C', '%', '€', '$'];
const RE_UNITE = new RegExp(`(\\d)[ ]?(${UNITES.map((u) => u.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})(?![\\w²])`, 'g');

/* =====================================================================
   3. LES REGLES
   Chaque regle : `re` (detecteur, sans /g — recompile avec /g pour compter),
   `fix` (correcteur pur, optionnel), `dur` (✗ bloquant) ou non (⚠ signale).
   L'ORDRE est celui de l'application : les suspensions avant la ponctuation double
   (sinon « ... » serait vu comme trois points), les heures avant les unites, etc.
   ===================================================================== */

const REGLES = [
  {
    id: 'suspension',
    dur: true,
    libelle: 'trois points « ... » au lieu du caractere points de suspension « … » (U+2026)',
    re: /\.\.\./,
    fix: (t) => t.replace(/\.\.\.+/g, '…'),
  },
  {
    id: 'fine-secable',
    dur: true,
    // Piege tres repandu : `&thinsp;` est U+2009, fine mais SECABLE — le « ! » peut donc partir seul
    // en debut de ligne. La fine de la ponctuation francaise est U+202F, insecable.
    libelle: 'espace fine SÉCABLE (U+2009, « &thinsp; ») là où il faut la fine INSÉCABLE U+202F',
    re: /[   ][;!?»]|«[   ]/,
    fix: (t) => t.replace(/[   ](?=[;!?»])/g, FINE).replace(/(«)[   ]/g, '$1' + FINE),
  },
  {
    id: 'abreviations',
    dur: true,
    // Lacroux : point abreviatif si et seulement si la derniere lettre du mot manque.
    // M. (Monsieur -> M) prend le point ; Mme, Mlle, Dr, Vve le refusent.
    libelle: 'abreviation de civilite fautive (« Mr » → « M. », « Mme. » → « Mme ») ou « etc… »',
    re: /\bMrs?\.?(?=\s|$)|\bM(?:me|lle|gr|e|rs)s?\.|\bDr\.|\bVve\.|etc\s?…|etc\s?\.\s?\./,
    fix: (t) =>
      t
        .replace(/\bMrs\.?(?=\s|$)/g, 'MM.')
        .replace(/\bMr\.?(?=\s+\p{Lu})/gu, 'M.')
        .replace(/\b(M(?:me|lle|gr|e)s?|Dr|Vve)\./g, '$1')
        .replace(/etc\s?…/g, 'etc.')
        .replace(/etc\s?\.\s?\./g, 'etc.'),
  },
  {
    id: 'apostrophe',
    dur: true,
    libelle: "apostrophe droite « ' » au lieu de l'apostrophe typographique « ’ » (U+2019)",
    re: /\p{L}'\p{L}/u,
    fix: (t) => t.replace(/(\p{L})'(?=\p{L}|\d)/gu, '$1’'),
  },
  {
    id: 'ligature-oe',
    dur: true,
    libelle: 'suite « oe » au lieu de la ligature « œ » (cœur, sœur, œuvre, manœuvre…)',
    re: RE_OE,
    fix: (t) =>
      t
        .replace(RE_OE_NOMS, (m) => m.replace(/oe/g, 'œ').replace(/Oe/g, 'Œ'))
        .replace(RE_OE, (m) => m.replace(/oe/g, 'œ').replace(/[Oo]E|Oe/g, 'Œ')),
  },
  {
    id: 'majuscule-accentuee',
    dur: true,
    libelle: 'majuscule non accentuee en debut de mot (Etat → État, Ecole → École, Etre → Être)',
    re: RE_MAJ_ACCENT,
    fix: (t) =>
      t
        .replace(RE_MAJ_ACCENT, (m) => MAJUSCULES_ACCENTUEES[m] ?? m)
        // « A » mis pour « à » en tete de phrase : « A partir de », « A votre ecoute ».
        .replace(/(^|[.!?…»)\n]\s+)A(?=\s+\p{Ll})/gu, '$1À'),
  },
  {
    id: 'numero',
    dur: true,
    libelle: 'abreviation de numero mal composee (« N° », « No 4 ») : c’est « n° » + insecable',
    re: /\bN\s?[°º]|\bNo\.?\s*\d|\bn\s[°º]|n°\d/,
    fix: (t) =>
      t
        .replace(/\bN\s?[°º]/g, 'n°')
        .replace(/\bn\s[°º]/g, 'n°')
        .replace(/\bNo\.?\s*(?=\d)/g, 'n°' + NBSP)
        .replace(/n°[ ]?(?=\d)/g, 'n°' + NBSP),
  },
  {
    id: 'ordinaux',
    dur: true,
    libelle: 'ordinal fautif (« 2ème », « 1ère », « 2eme ») : la forme correcte est 1er, 1re, 2e, 3e',
    re: /\d\s?(?:[èe]me|[èe]re|ier)\b/i,
    fix: (t) =>
      t
        .replace(/\b1\s?[èe]re\b/gi, '1re')
        .replace(/\b1\s?ier\b/gi, '1er')
        .replace(/\b(\d+)\s?[èe]me\b/gi, '$1e'),
  },
  {
    id: 'heures',
    dur: true,
    libelle: 'heure mal composee (« 9h30 ») : en francais on ecrit « 9 h 30 », insecables comprises',
    // `24h/24`, `7j/7` et `kWh` sont exclus par les gardes du remplacement.
    re: /\b\d{1,2}[  ]?h[  ]?\d{2}(?![\d/])|\b\d{1,2}[  ]?h(?![\w/])/,
    fix: (t) =>
      t
        .replace(/\b(\d{1,2})[  ]?h[  ]?(\d{2})(?![\d/\w])/g, `$1${NBSP}h${NBSP}$2`)
        .replace(/\b(\d{1,2})[  ]?h(?![\w/])/g, `$1${NBSP}h`),
  },
  {
    id: 'telephone',
    dur: true,
    libelle: 'numero de telephone francais non groupe par deux et non insecable (01 23 45 67 89)',
    re: /\b0\d(?:[.\- ]?\d{2}){4}\b/,
    fix: (t) =>
      t.replace(/\b(0\d)[.\- ]?(\d{2})[.\- ]?(\d{2})[.\- ]?(\d{2})[.\- ]?(\d{2})\b/g,
        (_m, a, b, d, e, f) => [a, b, d, e, f].join(NBSP)),
  },
  {
    id: 'prix',
    dur: true,
    libelle: 'prix mal compose : milliers separes par une fine insecable et « € » precede d’une insecable (1 200 €)',
    re: /\d{4,}\s?€|\d[ ]?€|€\s?\d/,
    fix: (t) =>
      t
        // « €1200 » (anglicisme) -> « 1200 € », avant tout le reste.
        .replace(/€\s?(\d[\d ,. ]*)/g, '$1 €')
        // Separateur de milliers, uniquement dans un contexte de prix.
        .replace(/\b(\d{4,})(?=\s?€|\s?euros?\b)/g, (m) => m.replace(/\B(?=(\d{3})+(?!\d))/g, FINE))
        .replace(/(\d)[ ]?€/g, `$1${NBSP}€`),
  },
  {
    id: 'unite',
    dur: true,
    libelle: 'nombre colle a son unite ou a « % » : il faut une insecable (10 km, 15 %, 25 °C)',
    re: RE_UNITE,
    fix: (t) => t.replace(RE_UNITE, (_m, n, u) => `${n}${NBSP}${u === 'm2' ? 'm²' : u}`),
  },
  {
    id: 'guillemets',
    dur: true,
    libelle: 'guillemets droits « " » au lieu des guillemets francais « … » (imbriques : “ … ”)',
    re: /"/,
    fix: (t) => guillemetsFrancais(t),
  },
  {
    id: 'guillemets-espaces',
    dur: true,
    libelle: 'guillemets francais sans leur espace fine insecable interieure (« mot » et non «mot»)',
    re: /«(?! )|(?<! )»/,
    fix: (t) =>
      t
        .replace(/«[   ]*/g, '«' + FINE)
        .replace(/[   ]*»/g, FINE + '»'),
  },
  {
    id: 'espace-avant-ponctuation',
    dur: true,
    libelle: 'espace manquante ou mauvaise avant « ; ! ? » (fine insecable) et « : » (insecable)',
    re: /[^\s  ][;!?]|[  ][;!?]|[^\s  ]:(?=\s|$)|[  ]:(?=\s|$)/,
    // Un seul passage par signe : on avale l'espace deja presente, quelle qu'elle soit, et on pose
    // la bonne. Sans cela, un texte deja a moitie correct gagnait une espace en double.
    fix: (t) =>
      t
        // `:` prend l'insecable pleine U+00A0, seulement quand il ponctue (suivi d'une espace ou en fin).
        .replace(/([^\s  ]?)[   ]*:(?=\s|$)/g, (_m, av) => (av ? av + NBSP + ':' : ':'))
        // `; ! ?` prennent la fine insecable U+202F. Un groupe « ?! » n'en prend qu'une, devant.
        .replace(/([^\s  ]?)[   ]*([;!?]+)/g, (_m, av, p) => (av ? av + FINE + p : p)),
  },
  {
    id: 'espace-apres-ponctuation',
    dur: true,
    libelle: 'espace manquante APRES « , ; : ! ? » ou espace parasite AVANT « , » et « . »',
    re: /[,;:!?]\p{L}|[   ]+[,.](?:\s|$)/u,
    fix: (t) =>
      t
        .replace(/([,;:!?])(?=\p{L})/gu, '$1 ')
        .replace(/[   ]+([,.])(?=\s|$)/g, '$1'),
  },
  {
    id: 'espaces-multiples',
    dur: false,
    libelle: 'espaces multiples consecutives',
    re: /\S {2,}\S/,
    fix: (t) => t.replace(/ {2,}/g, ' '),
  },
  {
    id: 'tiret-double',
    dur: false,
    libelle: 'double trait d’union « -- » au lieu du tiret cadratin « — »',
    re: /\S--\S|\s--\s/,
    fix: (t) => t.replace(/--/g, '—'),
  },
  // --- Regles de signalement seul (pas de correction automatique : trop ambigu) ---
  {
    id: 'ordinal-exposant',
    dur: false,
    libelle: 'ordinal hors exposant : « 1er », « 2e » gagnent a etre composes en <sup> (1ᵉʳ, 2ᵉ)',
    re: /\b\d+(?:er|re|e|es)\b(?!<)/,
  },
  {
    id: 'heure-deux-points',
    dur: false,
    libelle: 'heure a l’anglaise « 9:30 » : en francais c’est « 9 h 30 » (laisser tel quel si c’est une duree technique)',
    re: /\b\d{1,2}:\d{2}\b/,
  },
  {
    id: 'tiret-incise',
    dur: false,
    libelle: 'trait d’union « - » entre deux espaces : une incise prend un cadratin « — », une plage un demi-cadratin « – »',
    re: /\s-\s/,
  },
];

export const REGLES_IDS = REGLES.map((r) => r.id);

/* =====================================================================
   4. NOYAU PUR
   ===================================================================== */

/**
 * Remplace les guillemets droits par des guillemets francais, en alternant ouvrant/fermant.
 * Un second niveau d'imbrication passe en guillemets anglais courbes “ ” (regle de l'Imprimerie
 * nationale). Un nombre impair de guillemets laisse le dernier tel quel plutot que d'inventer.
 */
export function guillemetsFrancais(texte) {
  const src = String(texte);
  const total = (src.match(/"/g) || []).length;
  // Nombre impair = guillemet orphelin (mesure en pouces, coquille) : on n'invente pas de paire.
  if (total === 0 || total % 2 === 1) return src;
  let profondeur = 0;
  let out = '';
  for (let i = 0; i < src.length; i++) {
    if (src[i] !== '"') {
      out += src[i];
      continue;
    }
    // Ouvrant si en tete ou apres une espace / une ouvrante ; fermant sinon. Plus robuste qu'une
    // simple alternance : « le "vrai" chene » garde ses deux niveaux.
    const avant = i === 0 ? '' : src[i - 1];
    const ouvrant = avant === '' || /[\s(\[«“  ]/.test(avant);
    if (ouvrant) {
      profondeur++;
      out += profondeur === 1 ? '«' + FINE : '“';
    } else if (profondeur > 0) {
      out += profondeur === 1 ? FINE + '»' : '”';
      profondeur--;
    } else {
      out += '"';
    }
  }
  return out;
}

/**
 * Corrige la typographie francaise d'un texte VISIBLE. Fonction pure, sans effet de bord.
 * Les balises, attributs, URL, e-mails, entites HTML et echappements sont masques puis restitues :
 * ils ressortent identiques, au caractere pres.
 */
export function corrigerTexte(texte) {
  if (texte == null) return texte;
  const { masque, jetons } = masquer(String(texte).normalize('NFC'));
  let out = masque;
  for (const regle of REGLES) {
    if (regle.fix) out = regle.fix(out);
  }
  return demasquer(out, jetons);
}

/** Decoupe grossiere en phrases, pour citer la phrase fautive dans le rapport. */
function phraseAutour(texte, index) {
  const debut = Math.max(0, texte.lastIndexOf('.', Math.max(0, index - 1)) + 1);
  let fin = texte.length;
  for (const sep of ['.', '!', '?', '…']) {
    const i = texte.indexOf(sep, index);
    if (i !== -1 && i + 1 < fin) fin = i + 1;
  }
  let extrait = texte.slice(debut, fin).replace(/\s+/g, ' ').trim();
  if (extrait.length > 120) {
    const rel = Math.max(0, index - debut - 40);
    extrait = (rel > 0 ? '…' : '') + extrait.slice(rel, rel + 110) + '…';
  }
  return extrait;
}

/**
 * Controle un texte visible. Renvoie la liste des infractions :
 * `{ id, dur, libelle, extrait }` — une entree par regle violee (la premiere occurrence).
 */
export function controlerTexte(texte) {
  if (!texte) return [];
  const { masque, jetons } = masquer(String(texte).normalize('NFC'));
  const lisible = demasquer(masque, jetons);
  const infractions = [];
  for (const regle of REGLES) {
    const re = new RegExp(regle.re.source, regle.re.flags.includes('g') ? regle.re.flags : regle.re.flags + 'g');
    re.lastIndex = 0;
    const m = re.exec(masque);
    if (!m) continue;
    // Une regle qui se corrige d'elle-meme ne compte que si la correction change vraiment le texte.
    if (regle.fix && regle.fix(masque) === masque) continue;
    infractions.push({ id: regle.id, dur: Boolean(regle.dur), libelle: regle.libelle, extrait: phraseAutour(lisible, m.index) });
  }
  return infractions;
}

/* =====================================================================
   5. TEXTE VISIBLE D'UNE PAGE CONSTRUITE
   ===================================================================== */

const BLOCS_OPAQUES = /<(script|style|code|pre|kbd|samp|svg|noscript|template)\b[\s\S]*?<\/\1\s*>/gi;

const ENTITES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&apos;': "'", '&#39;': "'",
  '&nbsp;': ' ', '&#160;': ' ', '&#8217;': '’', '&rsquo;': '’',
  '&laquo;': '«', '&raquo;': '»', '&hellip;': '…', '&#8239;': ' ',
  '&#8230;': '…', '&eacute;': 'é', '&egrave;': 'è', '&agrave;': 'à', '&ccedil;': 'ç',
};

function decoderEntites(s) {
  return s.replace(/&(?:[a-zA-Z]+|#\d+);/g, (e) => ENTITES[e] ?? e);
}

/**
 * Extrait les morceaux de texte VISIBLE d'une page HTML : ni balise, ni attribut, ni commentaire,
 * ni contenu de <script>/<style>/<code>/<pre>/<svg>. Chaque noeud de texte est rendu separement
 * (une phrase coupee par un <em> donne deux morceaux — c'est voulu, les regles sont locales).
 */
export function textesVisibles(html) {
  return String(html)
    .replace(BLOCS_OPAQUES, ' ')
    .replace(/<!--[\s\S]*?-->/g, ' ')
    .split(/<[^>]*>/)
    .map((s) => decoderEntites(s).replace(/\s+/g, ' ').trim())
    .filter((s) => s.length > 1 && /\p{L}|\d/u.test(s));
}

/** Analyse une page complete : regroupe les infractions par regle, avec un exemple et un compte. */
export function analyserHtml(html) {
  const parRegle = new Map();
  for (const morceau of textesVisibles(html)) {
    for (const inf of controlerTexte(morceau)) {
      const deja = parRegle.get(inf.id);
      if (deja) deja.n++;
      else parRegle.set(inf.id, { ...inf, n: 1 });
    }
  }
  return [...parRegle.values()];
}

/* =====================================================================
   6. REECRITURE DES SOURCES (--corriger)
   ===================================================================== */

/**
 * Cles de `site.config.ts` dont la valeur n'est PAS du texte francais destine a l'oeil :
 * identifiants techniques, chemins, numeros bruts, mots-cles de recherche. Jamais reecrites.
 */
export const CLES_TECHNIQUES = new Set([
  'slug', 'icon', 'href', 'url', 'src', 'pkg', 'provider', 'variant', 'direction', 'type', 'shell',
  'nav', 'hero', 'footer', 'motion', 'opens', 'closes', 'phone', 'whatsapp', 'email', 'mapsUrl',
  'mapsProvider', 'postalCode', 'lang', 'key', 'schemaType', 'keywords', 'og', 'scale', 'tone',
  'headings', 'coordinates', 'action', 'to', 'endpoint', 'siteKey', 'formId', 'id', 'class',
]);

/** Une valeur qui ressemble a un identifiant, un chemin ou un code : on la laisse tranquille. */
export function valeurTechnique(valeur) {
  const v = String(valeur).trim();
  if (v.length < 3) return true;
  if (!/\p{L}/u.test(v)) return true; // aucun mot : nombre, code, suite de symboles
  if (/^[a-z0-9]+(?:[-_][a-z0-9]+)*$/.test(v)) return true; // kebab/snake-case : un slug
  if (/^[a-zA-Z][a-zA-Z0-9]*$/.test(v) && !/\s/.test(v)) return true; // camelCase / nom d'icone
  if (/^[./@#]|^https?:|^[\w.+-]+@[\w-]+\./.test(v)) return true; // chemin, URL, e-mail
  if (/^[+]?\d[\d\s.+-]*$/.test(v)) return true; // numero brut
  return false;
}

/**
 * Reecrit les chaines de caracteres d'un source TypeScript (`site.config.ts`) en ne touchant
 * qu'aux valeurs de texte destinees a l'oeil. Scanner a la main : on suit les commentaires, les
 * trois sortes de literaux et les echappements, et on retient la derniere cle vue avant le literal.
 */
export function corrigerSourceTs(source) {
  const src = String(source);
  let out = '';
  let i = 0;
  let cleCourante = '';
  let apresImport = false;
  while (i < src.length) {
    const ch = src[i];
    // Commentaires : recopies tels quels.
    if (ch === '/' && src[i + 1] === '/') {
      const fin = src.indexOf('\n', i);
      const j = fin === -1 ? src.length : fin;
      out += src.slice(i, j);
      i = j;
      continue;
    }
    if (ch === '/' && src[i + 1] === '*') {
      const fin = src.indexOf('*/', i + 2);
      const j = fin === -1 ? src.length : fin + 2;
      out += src.slice(i, j);
      i = j;
      continue;
    }
    if (ch === "'" || ch === '"' || ch === '`') {
      const { corps, fin } = lireLitteral(src, i);
      const brut = src.slice(i, fin);
      const interdit =
        apresImport || CLES_TECHNIQUES.has(cleCourante) || valeurTechnique(deEchapper(corps));
      if (interdit) {
        out += brut;
      } else {
        out += ch + corrigerLitteral(corps, ch) + ch;
      }
      i = fin;
      continue;
    }
    // Suivi de la derniere cle rencontree : `cle:` ou `'cle':`.
    if (/[A-Za-z_$]/.test(ch)) {
      const m = /^[A-Za-z_$][\w$]*/.exec(src.slice(i));
      const mot = m[0];
      const suite = src.slice(i + mot.length);
      if (/^\s*:/.test(suite)) cleCourante = mot;
      apresImport = mot === 'from' || mot === 'import' || mot === 'require';
      out += mot;
      i += mot.length;
      continue;
    }
    if (ch === '[' || ch === '{' || ch === ',') {
      // On reste dans le meme tableau/objet : la cle courante vaut encore pour l'element suivant.
      out += ch;
      i++;
      continue;
    }
    out += ch;
    i++;
  }
  return out;
}

/** Lit un literal JS a partir du guillemet ouvrant `src[debut]`. Renvoie le corps et l'index de fin. */
function lireLitteral(src, debut) {
  const quote = src[debut];
  let i = debut + 1;
  let corps = '';
  while (i < src.length) {
    const ch = src[i];
    if (ch === '\\') {
      corps += src.slice(i, i + 2);
      i += 2;
      continue;
    }
    if (quote === '`' && ch === '$' && src[i + 1] === '{') {
      // Interpolation : recopiee brute, avec son imbrication d'accolades.
      let profondeur = 1;
      let j = i + 2;
      while (j < src.length && profondeur > 0) {
        if (src[j] === '{') profondeur++;
        else if (src[j] === '}') profondeur--;
        j++;
      }
      corps += src.slice(i, j);
      i = j;
      continue;
    }
    if (ch === quote) return { corps, fin: i + 1 };
    corps += ch;
    i++;
  }
  return { corps, fin: src.length };
}

function deEchapper(corps) {
  return String(corps).replace(/\\(.)/g, '$1');
}

/**
 * Corrige le corps d'un literal sans casser ses echappements : `\n`, `\'`, `${...}` sont masques
 * par PROTEGE (echappements) ou par un masquage local (interpolations), puis restitues.
 * Si la correction fait apparaitre le guillemet du literal, on le rechappe.
 */
export function corrigerLitteral(corps, quote = "'") {
  const interpolations = [];
  const sansInterp = String(corps).replace(/\$\{[\s\S]*?\}/g, (m) => {
    interpolations.push(m);
    return String.fromCharCode(0xf000 + interpolations.length - 1);
  });
  let corrige = corrigerTexte(sansInterp);
  corrige = corrige.replace(/[-]/g, (ch) => interpolations[ch.charCodeAt(0) - 0xf000] ?? ch);
  // Le correcteur ne cree jamais de guillemet droit, mais il peut en deplacer un : ceinture.
  return corrige.replace(new RegExp(`(?<!\\\\)\\${quote}`, 'g'), `\\${quote}`);
}

/**
 * Reecrit le texte visible d'un fichier `.astro` : le frontmatter (entre les deux `---`), les
 * blocs script/style, les balises, les attributs et les expressions `{...}` sont laisses intacts.
 */
export function corrigerSourceAstro(source) {
  const src = String(source);
  const mFront = /^---\r?\n[\s\S]*?\r?\n---/.exec(src);
  const front = mFront ? mFront[0] : '';
  const corps = src.slice(front.length);

  const opaques = [];
  const garder = (m) => {
    opaques.push(m);
    return String.fromCharCode(0xf000 + opaques.length - 1);
  };
  const masqueCorps = corps
    .replace(BLOCS_OPAQUES, garder)
    .replace(/<!--[\s\S]*?-->/g, garder)
    .replace(/\{(?:[^{}]|\{[^{}]*\})*\}/g, garder) // expression Astro, un niveau d'imbrication
    .replace(/<[^<>]*>/g, garder); // balise complete, attributs compris

  // Demasquage ITERATIF : une balise masquee peut contenir une expression `{...}` elle-meme
  // masquee (ex. `<h2 set:html={site.wording.ctaTitle}>`), donc une seule passe laisserait une
  // sentinelle orpheline dans le fichier ecrit.
  let corrige = corrigerTexte(masqueCorps);
  for (let passe = 0; passe < 8 && /[-]/.test(corrige); passe++) {
    corrige = corrige.replace(/[-]/g, (ch) => opaques[ch.charCodeAt(0) - 0xf000] ?? ch);
  }
  return front + corrige;
}

/* =====================================================================
   7. COMMANDE
   ===================================================================== */

function listerHtml(dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...listerHtml(full));
    else if (e.isFile() && e.name.toLowerCase().endsWith('.html')) out.push(full);
  }
  return out;
}

function controlerSite(slug) {
  const distDir = path.join(DIST_DIR, slug);
  const fichiers = listerHtml(distDir);
  if (fichiers.length === 0) {
    fail(`Aucune page construite dans dist/${slug}. Lance d'abord : node scripts/ff.mjs build ${slug}`);
    return { slug, construit: false, infractions: [] };
  }
  const parRegle = new Map();
  for (const f of fichiers) {
    const page = path.relative(distDir, f).replace(/\\/g, '/');
    for (const inf of analyserHtml(fs.readFileSync(f, 'utf8'))) {
      const deja = parRegle.get(inf.id);
      if (deja) {
        deja.n += inf.n;
        deja.pages.add(page);
      } else {
        parRegle.set(inf.id, { ...inf, pages: new Set([page]) });
      }
    }
  }
  const infractions = REGLES.map((r) => parRegle.get(r.id)).filter(Boolean);
  return { slug, construit: true, pages: fichiers.length, infractions };
}

function corrigerFichiers(slug) {
  const dirSite = path.join(SITES_DIR, slug);
  const cibles = [];
  const config = path.join(dirSite, 'site.config.ts');
  if (fs.existsSync(config)) cibles.push({ fichier: config, corriger: corrigerSourceTs });
  const dirSections = path.join(dirSite, 'sections');
  if (fs.existsSync(dirSections)) {
    for (const nom of fs.readdirSync(dirSections)) {
      if (nom.toLowerCase().endsWith('.astro')) {
        cibles.push({ fichier: path.join(dirSections, nom), corriger: corrigerSourceAstro });
      }
    }
  }
  const modifies = [];
  for (const { fichier, corriger } of cibles) {
    const avant = fs.readFileSync(fichier, 'utf8');
    const apres = corriger(avant);
    if (apres !== avant) {
      fs.writeFileSync(fichier, apres);
      modifies.push(path.relative(SITES_DIR, fichier).replace(/\\/g, '/'));
    }
  }
  return modifies;
}

export async function cmdTypo(argv = []) {
  const { positional, flags } = parseArgs(argv);
  const slugs = positional.length > 0 ? positional : listSites({ excludeTestPrefix: true });
  let echec = false;

  for (const slug of slugs) {
    if (!siteExists(slug)) {
      fail(`Site introuvable : sites/${slug}`);
      echec = true;
      continue;
    }
    info('');
    info(c.bold(`Typographie française — ${slug}`));

    if (flags.corriger) {
      const modifies = corrigerFichiers(slug);
      if (modifies.length === 0) info(c.dim('  --corriger : rien à réécrire (sources déjà propres).'));
      else for (const f of modifies) ok(`Réécrit : sites/${f}`);
      info(c.dim('  Reconstruis le site (`ff build`) pour contrôler le rendu.'));
    }

    const res = controlerSite(slug);
    if (!res.construit) {
      echec = true;
      continue;
    }
    const durs = res.infractions.filter((i) => i.dur);
    const doux = res.infractions.filter((i) => !i.dur);

    if (res.infractions.length === 0) {
      ok(`Rien à redire sur ${res.pages} page(s) : ponctuation, guillemets et espaces insécables conformes.`);
    }
    for (const inf of durs) {
      fail(`${inf.libelle} — ${inf.n} fois (${[...inf.pages].slice(0, 3).join(', ')})`);
      info(c.dim(`    « ${inf.extrait} »`));
    }
    if (doux.length > 0) info('');
    for (const inf of doux) {
      warn(`${inf.libelle} — ${inf.n} fois`);
      info(c.dim(`    « ${inf.extrait} »`));
    }
    if (durs.length > 0) {
      echec = true;
      info('');
      info(c.dim(`  Correction automatique : node scripts/ff.mjs typo ${slug} --corriger`));
    }
  }
  info('');
  process.exit(echec ? 1 : 0);
}
