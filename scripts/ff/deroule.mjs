// Empreinte du DÉROULÉ de l'accueil et empreinte de SITE, pour `ff ressemblance` (page entière, pas seulement le
// premier écran). Calibration, seuil et règle de refus : en tête de scripts/ff/ressemblance.mjs.
//
// Pourquoi (18 oct 2026, fondateur) : après la correction du premier écran, les sites restaient pareils « dans
// leur déroulé : on scrolle et tout en bas il y a les mêmes informations, tout en haut les mêmes informations ».
// prospect-epi-dor, prospect-ballay-macon, prospect-a-coeur-bois et fromagerie-ravanel-d suivaient le même ordre
// (héros, avis, services, réalisations, à propos, venir, pied) avec la même navigation (menu vers des pages de
// services + ancres) et la même longueur.
//
// RELEVÉ (Chrome, téléphone 390x844, après avoir défilé jusqu'en bas pour jouer les apparitions) :
//   blocs de premier niveau = enfants de <main> (les enveloppes sans rôle propre, display:contents ou qui portent
//   au moins deux <section>, sont ouvertes ; les <nav> internes, les éléments fixed, les blocs de moins de 40 px
//   ou de moins de la moitié de la largeur sont sautés) + les <footer> hors de <main>. Pour chacun : id, classes,
//   aria-label, HTML (sans svg/script/style), position et hauteur, part d'image (img/picture/video/canvas/svg,
//   fonds url() ; trame 20 colonnes), nombre d'images d'au moins 60x60, images sur une même rangée, carrousel.
//   Page : hauteur en écrans, liens des nav du haut (header/nav hors main et hors pied) et du pied classés en pages
//   internes / ancres (pages légales, tel:, mailto: et liens externes à part), onglets (role=tablist d'au moins
//   trois onglets : part de la page tenue par le bloc qui porte les panneaux), défilement horizontal (page plus
//   large que 1,3 écran, ou zone d'au moins 60 % de la hauteur qui défile en x sur deux largeurs).
//
// CLASSEMENT (pur, `classerBloc`) : chaque rôle marque des points, le plus haut gagne (>= 2, sinon « autre ») :
//   - nom du bloc (id, classes, aria-label) qui contient un mot du rôle (MOTS) : 3 ; titre h2/h3 qui en contient : 2 ;
//   - héros : premier bloc : 10, bloc qui porte le h1 : 6 ; pied : <footer> : 10 ;
//   - preuve/avis : >= 2 blockquote : 2, étoiles (★, « 4,9/5 », « sur 5 », aria-label « étoiles ») : 2 ;
//   - questions : >= 3 <details> : 4, >= 3 <dt> en question : 2, >= 3 titres/summary/boutons finissant par « ? » : 2 ;
//   - contact : formulaire à >= 2 champs : 4, tel: : 0,5, mailto: : 0,5 ;
//   - lieu : iframe ou carte (maps, openstreetmap, leaflet) : 4, >= 3 jours de la semaine : 2, >= 2 heures : 1,
//     adresse (code postal + rue/place/avenue…) : 1 ;
//   - réalisations : >= 4 images (>= 2 sur une rangée, carrousel, ou >= 6) : 2, part d'image > 45 % : 1 ;
//   - services/offres : >= 3 cartes titrées (h3) : 2, >= 2 prix en € : 1 ;
//   - à propos : titre fait de noms propres (« Alain Ballay », « Claire et Théo ») : 2, 1 à 3 images et >= 400
//     signes : 1,5 ;
//   - outil interactif : >= 3 onglets/boutons à état : 3, curseur (range/slider) : 3, canvas : 1 ;
//   - bandeau d'appel : moins de 1,2 écran, moins de 400 signes, un tel:/lien/bouton et un titre : 3 ;
//   - texte long : >= 2 500 signes et moins de 15 % d'image : 3.
//   Égalité : l'ordre de ROLES_DEROULE départage. « autre » à plus de 80 % d'image et sans texte = bandeau photo.
//   La suite comparée saute les intermèdes (« autre » de moins d'un demi-écran : bandeau photo, filet).
//
// DISTANCE : ressemblance de déroulé = 0,5 x accord des suites de rôles (1 − distance d'édition / longueur de la
// plus longue ; contact et lieu, services et réalisations comptent 0,5 l'un pour l'autre) + 0,5 x accord du site
// (modèle de navigation 1, tranche de pages de contenu 0 / 1-3 / 4+ 1, longueur en écrans 0,5, part d'image 0,5 ;
// sur 3). Modèle : défilement horizontal > onglets (>= 50 % de la page) > journal daté (bloc d'au moins 4 dates du plus
// récent au plus ancien, >= 35 % de la page) > plan ou schéma (au moins 4 liens posés en absolu sur un plan) > calendrier annuel (tableau à douze colonnes de mois,
// >= 25 % de la page) > nuancier (au moins 4 liens qui portent chacun une photo carrée de même taille, >= 2 par rangée)
// > accueil-menu (<= 1,5 écran et >= 2 pages
// liées du menu, du pied ou du corps de l'accueil) > plusieurs pages (>= 2 pages liées du menu ou du pied ET >= 2 pages de contenu dans dist/) > longue page
// à ancres.
import fs from 'node:fs';
import path from 'node:path';

export const ROLES_DEROULE = ['heros', 'pied', 'questions', 'contact', 'lieu', 'preuve', 'outil', 'realisations', 'offres', 'apropos', 'appel', 'texte', 'autre'];
export const MOTS_ROLE = {
  heros: 'héros', preuve: 'avis', offres: 'services', realisations: 'réalisations', apropos: 'à propos', questions: 'questions',
  contact: 'contact', lieu: 'lieu/horaires', outil: 'outil', texte: 'texte long', appel: "bandeau d'appel", pied: 'pied de page', autre: 'autre',
};
export const MODELES = ['longue page à ancres', 'plusieurs pages', 'accueil-menu sans défilement', 'défilement horizontal', 'onglets', 'journal daté', 'plan ou schéma', 'calendrier annuel', 'nuancier'];
export const POIDS_SUITE = 0.5;
/** Pages qui ne comptent pas comme contenu (légal, erreur, remerciement). */
export const PAGES_HORS_CONTENU = /(^|\/)(404|mentions-legales|confidentialite|politique-de-confidentialite|credits|cgv|cgu|merci|plan-du-site)(\.html|\/index\.html|\/)?$/i;

/* ---------- relevé dans la page (sérialisé par playwright : aucune référence extérieure) ---------- */

export function releverDeroule() {
  const vw = innerWidth, vh = innerHeight, de = document.documentElement;
  const docH = Math.max(de.scrollHeight, document.body ? document.body.scrollHeight : 0);
  const docW = Math.max(de.scrollWidth, document.body ? document.body.scrollWidth : 0);
  const abs = (el) => { const r = el.getBoundingClientRect(); return [r.left + scrollX, r.top + scrollY, r.width, r.height]; };
  const cache = (el) => { const s = getComputedStyle(el); return s.display === 'none' || s.visibility === 'hidden'; };
  const SAUTER = /^(script|style|template|link|meta|noscript)$/i;
  const PROPRE = /^(section|article|footer|aside|form)$/i;
  const main = document.querySelector('main') || document.body;

  const blocsDe = (racine, prof) => {
    const out = [];
    for (const e of racine.children) {
      if (SAUTER.test(e.tagName) || cache(e)) continue;
      if (getComputedStyle(e).position === 'fixed') continue;
      const b = abs(e);
      const tag = e.tagName.toLowerCase();
      const sections = [...e.children].filter((c) => /^(section|article|footer)$/i.test(c.tagName)).length;
      if (prof < 3 && ((b[3] < 1 && e.children.length) || (!PROPRE.test(tag) && sections >= 2))) { out.push(...blocsDe(e, prof + 1)); continue; }
      if (tag === 'nav' || b[3] < 40 || b[2] < vw * 0.5) continue;
      out.push(e);
    }
    return out;
  };
  let els = blocsDe(main, 0);
  // une seule enveloppe qui tient tout : l'ouvrir
  for (let k = 0; k < 3 && els.length === 1 && els[0].children.length > 1; k++) {
    const dedans = blocsDe(els[0], 0);
    if (dedans.length > 1) els = dedans; else break;
  }
  if (main !== document.body) {
    for (const f of document.querySelectorAll('footer, [role="contentinfo"]')) {
      if (main.contains(f) || (f.parentElement && f.parentElement.closest('footer')) || cache(f)) continue;
      if (abs(f)[3] >= 40) els.push(f);
    }
  }
  // ordre du DOM (pas la position : un héros sticky se retrouve en bas de son conteneur une fois la page défilée)
  els = [...new Set(els)].sort((p, q) => (p.compareDocumentPosition(q) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1));

  const nettoyer = (h) => h.replace(/<svg\b[\s\S]*?<\/svg>/gi, '<svg></svg>').replace(/<(script|style)\b[\s\S]*?<\/\1>/gi, '')
    .replace(/\s(srcset|style|sizes)="[^"]*"/gi, '').replace(/src="data:[^"]*"/gi, 'src=""').slice(0, 80000);
  const visible = (el) => (el.checkVisibility ? el.checkVisibility({ visibilityProperty: true }) : true);

  const blocs = els.map((el) => {
    const b = abs(el);
    const imgs = [];
    const cand = el.querySelectorAll('img, video, canvas, svg, *');
    for (const e of cand) {
      const tag = e.tagName.toLowerCase();
      if (tag === 'svg' && e.parentElement && e.parentElement.closest('svg')) continue;
      const media = /^(img|video|canvas|svg)$/.test(tag);
      if (!media) { const bg = getComputedStyle(e).backgroundImage; if (!/url\(/.test(bg) || /data:image/.test(bg)) continue; }
      if (!visible(e)) continue;
      const r = abs(e);
      const x = Math.max(b[0], r[0]), y = Math.max(b[1], r[1]), x2 = Math.min(b[0] + b[2], r[0] + r[2]), y2 = Math.min(b[1] + b[3], r[1] + r[3]);
      if (x2 - x < 1 || y2 - y < 1) continue;
      const aire = (x2 - x) * (y2 - y);
      if (tag === 'svg' && aire < 0.02 * vw * vh) continue;
      if (!media && aire < 0.03 * vw * vh) continue;
      imgs.push([x, y, x2 - x, y2 - y]);
    }
    if (/url\(/.test(getComputedStyle(el).backgroundImage) && !/data:image/.test(getComputedStyle(el).backgroundImage)) imgs.push(b);
    const nx = 20, ny = Math.max(8, Math.round(b[3] / vh * 16));
    let dedans = 0;
    for (let j = 0; j < ny; j++) for (let i = 0; i < nx; i++) {
      const px = b[0] + (i + 0.5) * b[2] / nx, py = b[1] + (j + 0.5) * b[3] / ny;
      if (imgs.some((c) => px >= c[0] && px < c[0] + c[2] && py >= c[1] && py < c[1] + c[3])) dedans++;
    }
    const grandes = imgs.filter((c) => c[2] >= 60 && c[3] >= 60);
    let rangee = 0;
    for (const c of grandes) { const cy = c[1] + c[3] / 2; rangee = Math.max(rangee, grandes.filter((d) => cy >= d[1] && cy < d[1] + d[3]).length); }
    let carrousel = false;
    for (const e of el.querySelectorAll('*')) {
      const s = getComputedStyle(e);
      if (/(auto|scroll)/.test(s.overflowX) && e.scrollWidth > e.clientWidth + 40 && e.clientHeight > 60) { carrousel = true; break; }
    }
    return {
      tag: el.tagName.toLowerCase(), id: el.id || '', cls: (typeof el.className === 'string' ? el.className : '').slice(0, 200),
      aria: el.getAttribute('aria-label') || '', y: Math.round(b[1]), h: Math.round(b[3]),
      partImage: Math.round(dedans / (nx * ny) * 100) / 100, nImages: grandes.length, rangee, carrousel,
      h1: Boolean(el.querySelector('h1')), html: nettoyer(el.outerHTML),
    };
  });

  const ici = location.pathname.replace(/index\.html$/, '').replace(/\/+$/, '') || '/';
  const LEGAL = /(^|\/)(404|mentions-legales|confidentialite|politique-de-confidentialite|credits|cgv|cgu|merci|plan-du-site)(\.html)?\/?$/i;
  const liens = (zones) => {
    const pages = new Set(), ancres = new Set();
    for (const z of zones) for (const a of z.querySelectorAll('a[href]')) {
      const href = a.getAttribute('href') || '';
      if (/^(tel|mailto|sms|javascript):/i.test(href)) continue;
      if (href.startsWith('#')) { if (href.length > 1) ancres.add(href); continue; }
      let u;
      try { u = new URL(a.href); } catch { continue; }
      if (u.origin !== location.origin) continue;
      const p = u.pathname.replace(/index\.html$/, '').replace(/\.html$/, '').replace(/\/+$/, '') || '/';
      if (LEGAL.test(p)) continue;
      if (p === ici) { if (u.hash.length > 1) ancres.add(u.hash); continue; }
      pages.add(p);
    }
    return { pages: [...pages], ancres: [...ancres] };
  };
  const navs = [...document.querySelectorAll('header, nav, [role="navigation"], [role="banner"]')].filter((z) => !main.contains(z) && !z.closest('footer'));
  const pieds = [...document.querySelectorAll('footer, [role="contentinfo"]')].filter((z) => !main.contains(z) || main === document.body);

  let partOnglets = 0;
  for (const t of document.querySelectorAll('[role="tablist"]')) {
    if (t.querySelectorAll('[role="tab"]').length < 3) continue;
    let p = t;
    while (p && !p.querySelector('[role="tabpanel"]')) p = p.parentElement;
    if (p) partOnglets = Math.max(partOnglets, abs(p)[3] / docH);
  }
  // Journal daté (29 oct 2026, architecture carnet-interventions) : la part de la page tenue par le bloc qui porte au moins
  // quatre <time datetime="AAAA-MM-JJ"> du plus récent au plus ancien (un carnet, pas un agenda qui va vers l'avenir).
  let partJournal = 0;
  const dates = [...main.querySelectorAll('time[datetime]')].filter((t) => /^\d{4}-\d{2}-\d{2}$/.test(t.getAttribute('datetime')));
  if (dates.length >= 4) {
    for (const e of new Set(dates.map((t) => t.closest('section, article, div[id]')).filter(Boolean))) {
      let p = e;
      while (p && p !== main && p.querySelectorAll('time[datetime]').length < 4) p = p.parentElement;
      if (!p || p === main) continue;
      const ds = [...p.querySelectorAll('time[datetime]')].map((t) => t.getAttribute('datetime')).filter((d) => /^\d{4}-\d{2}-\d{2}$/.test(d));
      const desc = ds.length >= 4 && ds.every((d, i) => i === 0 || d <= ds[i - 1]);
      if (desc) partJournal = Math.max(partJournal, abs(p)[3] / docH);
    }
  }
  // Plan ou schéma (29 oct 2026, architecture rayon-trajet) : un plan dessiné (figure ou bloc en position relative, au moins
  // la moitié de l'écran en largeur) sur lequel au moins quatre liens sont posés en position absolue.
  let plan = false;
  for (const a of main.querySelectorAll('a[href]')) {
    if (plan) break;
    let q = a.parentElement, posees = 0;
    if (!q || getComputedStyle(q).position !== 'absolute') continue;
    while (q && q !== main && getComputedStyle(q).position !== 'relative') q = q.parentElement;
    if (!q || q === main || abs(q)[2] < vw * 0.5) continue;
    for (const b of q.querySelectorAll('a[href]')) if (b.parentElement && getComputedStyle(b.parentElement).position === 'absolute') posees += 1;
    plan = posees >= 4;
  }
  // Calendrier annuel (30 oct 2026, architecture calendrier-recoltes) : la part de la page tenue par un tableau dont l'en-tête
  // a douze colonnes de mois (abréviation ou nom, ou leur title) : l'année d'une ferme, pas un agenda daté.
  const MOIS_RE = /^(janv|fevr|mars|avr|mai|juin|juil|aout|sept|oct|nov|dec|j|f|m|a|s|o|n|d)/;
  const plat0 = (x) => String(x || '').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().trim();
  let partCalendrier = 0;
  for (const t of main.querySelectorAll('table')) {
    const ths = [...t.querySelectorAll('thead th')].filter((th) => {
      const ab = th.querySelector('abbr[title]');
      return MOIS_RE.test(plat0(ab ? ab.getAttribute('title') : th.textContent));
    });
    if (ths.length >= 12) partCalendrier = Math.max(partCalendrier, abs(t)[3] / docH);
  }
  // Nuancier (30 oct 2026, architecture nuancier-matieres) : au moins quatre liens qui portent chacun une photo carrée (rapport
  // 0,9 à 1,1) de même largeur, deux au moins sur une rangée : le mur d'échantillons d'une matière.
  let nuancier = false;
  {
    const carres = [];
    for (const a of main.querySelectorAll('a[href]')) {
      const im = a.querySelector('img');
      if (!im || !visible(im)) continue;
      const r = abs(im);
      if (r[2] < 80 || r[3] < 80 || r[2] / r[3] < 0.9 || r[2] / r[3] > 1.1) continue;
      carres.push(r);
    }
    for (const c of carres) {
      const memes = carres.filter((d) => Math.abs(d[2] - c[2]) < 4);
      const rangee = memes.filter((d) => Math.abs(d[1] - c[1]) < 4).length;
      if (memes.length >= 4 && rangee >= 2) { nuancier = true; break; }
    }
  }
  let horizontal = docW > vw * 1.3;
  // Les blocs de premier niveau (els, enveloppes ouvertes) comptent aussi : une file qui défile en x sous une
  // enveloppe display:contents (coquilles panneaux et carnet au téléphone) est bien une zone de la page.
  if (!horizontal) for (const e of new Set([...document.querySelectorAll('main, main > *, body > *'), ...els])) {
    const s = getComputedStyle(e);
    if (/(auto|scroll)/.test(s.overflowX) && e.clientHeight >= vh * 0.6 && e.clientWidth >= vw * 0.8 && e.scrollWidth >= e.clientWidth * 2) { horizontal = true; break; }
  }

  return { vw, vh, docH: Math.round(docH), docW: Math.round(docW), blocs, nav: liens(navs), pied: liens(pieds), corps: liens([main]), partOnglets: Math.round(partOnglets * 100) / 100, partJournal: Math.round(partJournal * 100) / 100, plan, partCalendrier: Math.round(partCalendrier * 100) / 100, nuancier, horizontal };
}

/* ---------- fonctions pures ---------- */

const plat = (s) => String(s || '').normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
const texteDe = (h) => h.replace(/<[^>]+>/g, ' ').replace(/&nbsp;|&#160;|&#xa0;/gi, ' ').replace(/&[a-z#0-9]+;/gi, ' ').replace(/\s+/g, ' ').trim();

/** Pure : traits d'un bloc lus dans son HTML (comptes de balises, titres, texte). */
export function traitsBloc(html = '') {
  const sans = String(html).replace(/<(script|style|svg|template)\b[\s\S]*?<\/\1>/gi, ' ');
  const n = (re) => (sans.match(re) || []).length;
  const texte = texteDe(sans);
  const titres = [...sans.matchAll(/<h([1-3])\b[^>]*>([\s\S]*?)<\/h\1>/gi)].map((m) => ({ niv: Number(m[1]), texte: texteDe(m[2]).slice(0, 120) }));
  const jours = new Set((plat(texte).match(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche)s?\b/g) || []).map((j) => j.replace(/s$/, '')));
  const champs = (sans.match(/<(input|textarea|select)\b[^>]*>/gi) || []).filter((t) => !/type="(hidden|submit|button|checkbox|radio|range|reset)"/i.test(t)).length;
  const boutons = (sans.match(/<button\b[^>]*>/gi) || []).filter((t) => !/type="submit"/i.test(t)).length;
  return {
    h1: n(/<h1\b/gi),
    titres,
    texte: texte.length,
    tel: n(/href="tel:/gi),
    mailto: n(/href="mailto:/gi),
    details: n(/<details\b/gi),
    dt: (sans.match(/<dt\b[^>]*>[\s\S]*?<\/dt>/gi) || []).filter((x) => /\?/.test(texteDe(x))).length,
    questionsTitres: [...sans.matchAll(/<(h3|h4|summary|button)\b[^>]*>([\s\S]*?)<\/\1>/gi)].filter((m) => /\?\s*$/.test(texteDe(m[2]))).length,
    form: n(/<form\b/gi),
    champs,
    carte: n(/<iframe\b[^>]*(maps?\b|openstreetmap|umap|maps\.google|google\.[a-z]+\/maps)|class="[^"]*\b(leaflet|maplibre|mapboxgl)/gi),
    iframe: n(/<iframe\b/gi),
    blockquote: n(/<blockquote\b/gi),
    etoiles: n(/★/g) + n(/\b\d(?:[,.]\d)?\s*(?:\/|sur)\s*5\b/gi) + n(/aria-label="[^"]*[eé]toiles?/gi),
    jours: jours.size,
    heures: n(/\b\d{1,2}\s?h\s?\d{0,2}\b|\b\d{1,2}:\d{2}\b/gi),
    adresse: /\b\d{5}\b/.test(texte) && /\b(rue|avenue|av\.|place|chemin|route|boulevard|bd|allee|allée|impasse|quai|cours|lieu-dit|zi|za)\b/i.test(texte),
    imgs: n(/<img\b/gi),
    cartesH3: titres.filter((t) => t.niv === 3).length,
    prix: n(/\d+(?:[,.]\d+)?\s?€|€\s?\d/g),
    curseurs: n(/type="range"|role="slider"/gi),
    onglets: n(/role="tab"(?!list|panel)/gi),
    etats: n(/aria-pressed=|aria-selected=|aria-checked=/gi),
    boutons,
    canvas: n(/<canvas\b/gi),
    liens: n(/<a\b/gi),
  };
}

/** Titre fait de noms propres : « Alain Ballay », « Claire et Théo », « Xavier, Miroslava et Pauline ». */
const PRENOMS = /^\p{Lu}[\p{Ll}'’-]+(?:(?:\s+|\s*,\s*|\s+et\s+|\s+&\s+)\p{Lu}[\p{Ll}'’-]+){1,5}\.?$/u;

const MOTS = {
  preuve: /avis|temoign|preuve|review|recommand|confiance|ils-disent|clients? (disent|parlent)|ce qu.on dit|note[s ]/,
  offres: /service|prestation|offre|tarif|prix|rayon|rubrique|menu|\bcarte\b|soins?\b|produit|plateau|catalogue|formule|specialit|gamme|ardoise|etagere|\bcave\b|boutique|fromages|pains|nos |metiers|savoir-faire|materiau/,
  realisations: /realis|travaux|chantier|galerie|vitrine|portfolio|projet|avant-apres|photos|reference|ouvrage/,
  apropos: /about|propos|equipe|\batelier\b|studio|histoire|qui-|qui sommes|portrait|fondat|famille|parcours|valeur|nous sommes|je suis|depuis (19|20)\d\d|ans de metier|le patron|l.atelier de/,
  questions: /faq|question|qst|on nous demande|vous demandez/,
  contact: /contact|devis|reserv|rappel|ecrire|joindre|rendez|commande|demande/,
  lieu: /venir|acces|adresse|horaire|ou-nous|nous trouver|plan\b|itineraire|localis|map\b|ou nous/,
  outil: /simul|calcul|config|outil|estim|semaine|choisi/,
  appel: /\bfin\b|cta|appel|bandeau|on en parle|parlons/,
};

/**
 * Pure : rôle d'un bloc. b = { tag, id, cls, aria, h1, partImage, nImages, rangee, carrousel, hEcrans, traits },
 * ctx = { index, n }. Rend { role, points, raisons }.
 */
export function classerBloc(b, ctx = {}) {
  const t = b.traits || traitsBloc(b.html || '');
  const nom = plat(`${b.id || ''} ${b.cls || ''} ${b.aria || ''}`).replace(/[_]/g, '-');
  const tit = plat(t.titres.filter((x) => x.niv >= 2).slice(0, 3).map((x) => x.texte).join(' | '));
  const pts = Object.fromEntries(ROLES_DEROULE.map((r) => [r, 0]));
  const raisons = Object.fromEntries(ROLES_DEROULE.map((r) => [r, []]));
  const add = (r, v, pourquoi) => { pts[r] += v; raisons[r].push(pourquoi); };
  for (const [r, re] of Object.entries(MOTS)) {
    if (re.test(nom)) add(r, 3, `nom « ${(nom.match(re) || [''])[0].trim()} »`);
    if (re.test(tit)) add(r, 2, `titre « ${(tit.match(re) || [''])[0].trim()} »`);
  }
  if (b.tag === 'footer' || /\b(pied|footer|contentinfo)\b/.test(nom)) add('pied', 10, '<footer>');
  if (ctx.index === 0) add('heros', 10, 'premier bloc');
  else if (b.h1 || t.h1) add('heros', 6, 'porte le h1');
  if (t.blockquote >= 2) add('preuve', 2, `${t.blockquote} citations`);
  if (t.etoiles >= 1) add('preuve', 2, 'étoiles');
  if (t.details >= 3) add('questions', 4, `${t.details} <details>`);
  if (t.dt >= 3) add('questions', 2, `${t.dt} <dt> en question`);
  if ((t.questionsTitres ?? 0) >= 3) add('questions', 2, `${t.questionsTitres} titres en question`);
  if (t.form && t.champs >= 2) add('contact', 4, `formulaire à ${t.champs} champs`);
  if (t.tel) add('contact', 0.5, 'tel:');
  if (t.mailto) add('contact', 0.5, 'mailto:');
  if (t.carte) add('lieu', 4, 'carte');
  if (t.jours >= 3) add('lieu', 2, `${t.jours} jours`);
  if (t.heures >= 2) add('lieu', 1, 'heures');
  if (t.adresse) add('lieu', 1, 'adresse');
  const nImg = Math.max(b.nImages ?? 0, t.imgs);
  if (nImg >= 4 && ((b.rangee ?? 0) >= 2 || b.carrousel || nImg >= 6)) add('realisations', 2, `${nImg} images en grille`);
  if ((b.partImage ?? 0) > 0.45) add('realisations', 1, `${Math.round(b.partImage * 100)} % d'image`);
  if (t.cartesH3 >= 3) add('offres', 2, `${t.cartesH3} cartes titrées`);
  if (t.prix >= 2) add('offres', 1, 'prix');
  if (t.titres.some((x) => x.niv >= 2 && PRENOMS.test(x.texte))) add('apropos', 2, 'titre fait de noms');
  if (nImg >= 1 && nImg <= 3 && t.texte >= 400 && !t.form && t.details < 3 && t.cartesH3 < 3) add('apropos', 1.5, 'portrait et texte');
  if (t.curseurs) add('outil', 3, 'curseur');
  if (t.onglets + t.etats >= 3) add('outil', 3, `${t.onglets + t.etats} commandes à état`);
  if (t.canvas) add('outil', 1, 'canvas');
  const hE = b.hEcrans ?? 1;
  if (hE < 1.2 && t.texte < 400 && (t.tel || t.liens || t.boutons) && t.titres.length) add('appel', 3, 'court, un titre et un appel');
  if (t.texte >= 2500 && (b.partImage ?? 0) < 0.15) add('texte', 3, `${t.texte} signes`);
  let role = 'autre', max = 1.99;
  for (const r of ROLES_DEROULE) if (pts[r] > max) { role = r; max = pts[r]; }
  if (role === 'autre' && (b.partImage ?? 0) > 0.8 && t.texte < 200) return { role, points: 0, raisons: ['bandeau photo'] };
  return { role, points: role === 'autre' ? 0 : pts[role], raisons: role === 'autre' ? [] : raisons[role] };
}

/** Pure : pages de dist/ (chemins relatifs) -> nombre de pages HTML et de pages de contenu (hors légal, 404, merci). */
export function compterPages(chemins) {
  const html = chemins.map((c) => c.replace(/\\/g, '/')).filter((c) => /\.html$/i.test(c) && !/(^|\/)404\.html$/i.test(c));
  const contenu = html.filter((c) => c !== 'index.html' && !PAGES_HORS_CONTENU.test(c));
  return { html: html.length, contenu: contenu.length };
}

/** Lit dist/<slug> (fichiers .html). */
export function pagesDist(dir) {
  const out = [];
  const marcher = (d, pre) => { for (const f of fs.readdirSync(d, { withFileTypes: true })) { if (f.isDirectory()) { if (f.name !== '_astro' && f.name !== 'images') marcher(path.join(d, f.name), `${pre}${f.name}/`); } else if (f.name.endsWith('.html')) out.push(pre + f.name); } };
  if (fs.existsSync(dir)) marcher(dir, '');
  return compterPages(out);
}

/** Pure : la suite comparée : les rôles des blocs, sans les intermèdes (« autre » de moins d'un demi-écran). */
export function suiteDeRoles(blocs) {
  return blocs.filter((b) => !(b.role === 'autre' && (b.hEcrans ?? 1) < 0.5)).map((b) => b.role);
}

/** Pure : modèle de navigation déduit des mesures du site. */
export function modeleNavigation(s) {
  if (s.horizontal) return 'défilement horizontal';
  if ((s.partOnglets ?? 0) >= 0.5) return 'onglets';
  if ((s.partJournal ?? 0) >= 0.35) return 'journal daté';
  if (s.plan) return 'plan ou schéma';
  if ((s.partCalendrier ?? 0) >= 0.25) return 'calendrier annuel';
  if (s.nuancier) return 'nuancier';
  const pages = s.pagesLiees ?? s.navPages ?? 0;
  if (Math.max(pages, s.pagesCorps ?? 0) >= 2 && (s.ecrans ?? 99) <= 1.5) return 'accueil-menu sans défilement';
  if (pages >= 2 && (s.pagesContenu ?? 0) >= 2) return 'plusieurs pages';
  return 'longue page à ancres';
}

/** Pure : empreinte de déroulé à partir du relevé de la page et du compte des pages de dist/. */
export function empreinteDeroule(rel, pages = { html: 1, contenu: 0 }) {
  const { vw, vh, docH } = rel;
  const blocs = rel.blocs.map((b, index) => {
    const traits = b.traits || traitsBloc(b.html || '');
    const hEcrans = Math.round(b.h / vh * 100) / 100;
    const c = classerBloc({ ...b, traits, hEcrans }, { index, n: rel.blocs.length });
    const titre = (traits.titres.find((x) => x.niv <= 2) || traits.titres[0] || { texte: '' }).texte.slice(0, 60);
    const { titres, ...compte } = traits;
    return { role: c.role, raisons: c.raisons, tag: b.tag, id: b.id, cls: (b.cls || '').slice(0, 160), aria: b.aria || '', titre, h1: b.h1, hEcrans, part: Math.round(b.h / docH * 1000) / 1000, partImage: b.partImage, nImages: b.nImages, rangee: b.rangee, carrousel: b.carrousel, traits: { ...compte, titres: titres.slice(0, 8) } };
  });
  const somme = blocs.reduce((s, b) => s + b.hEcrans, 0) || 1;
  const site = {
    pagesHtml: pages.html, pagesContenu: pages.contenu,
    navPages: rel.nav.pages.length, navAncres: rel.nav.ancres.length, piedPages: rel.pied.pages.length,
    pagesLiees: new Set([...rel.nav.pages, ...rel.pied.pages]).size,
    pagesCorps: (rel.corps?.pages || []).length,
    ecrans: Math.round(docH / vh * 10) / 10,
    partImage: Math.round(blocs.reduce((s, b) => s + b.partImage * b.hEcrans, 0) / somme * 100) / 100,
    partOnglets: rel.partOnglets, partJournal: rel.partJournal, plan: rel.plan, partCalendrier: rel.partCalendrier, nuancier: rel.nuancier, horizontal: rel.horizontal,
  };
  site.modele = modeleNavigation(site);
  return { vw, vh, roles: suiteDeRoles(blocs), blocs, site };
}

/** Pure : reclasse une empreinte de déroulé du registre avec les règles du jour (traits gardés, sans Chrome). */
export function rafraichirDeroule(d) {
  if (!d?.blocs?.length) return d;
  const blocs = d.blocs.map((b, index) => { const c = classerBloc(b, { index, n: d.blocs.length }); return { ...b, role: c.role, raisons: c.raisons }; });
  const site = d.site ? { ...d.site, modele: modeleNavigation(d.site) } : d.site;
  return { ...d, blocs, roles: suiteDeRoles(blocs), site };
}

/** Rôles qui comptent moitié l'un pour l'autre (même place dans la page, même information). */
const VOISINS = new Set(['contact|lieu', 'lieu|contact', 'offres|realisations', 'realisations|offres']);
const cout = (x, y) => (x === y ? 0 : VOISINS.has(`${x}|${y}`) ? 0.5 : 1);

/** Pure : distance d'édition (insertion, suppression 1 ; substitution 1, 0,5 entre voisins) et alignement. */
export function alignerSuites(a = [], b = []) {
  const D = Array.from({ length: a.length + 1 }, (_, i) => Array.from({ length: b.length + 1 }, (_, j) => (i === 0 ? j : j === 0 ? i : 0)));
  for (let i = 1; i <= a.length; i++) for (let j = 1; j <= b.length; j++) D[i][j] = Math.min(D[i - 1][j] + 1, D[i][j - 1] + 1, D[i - 1][j - 1] + cout(a[i - 1], b[j - 1]));
  const paires = [];
  let i = a.length, j = b.length;
  while (i > 0 || j > 0) {
    if (i > 0 && j > 0 && D[i][j] === D[i - 1][j - 1] + cout(a[i - 1], b[j - 1])) { paires.unshift([a[i - 1], b[j - 1]]); i--; j--; }
    else if (i > 0 && D[i][j] === D[i - 1][j] + 1) { paires.unshift([a[i - 1], null]); i--; }
    else { paires.unshift([null, b[j - 1]]); j--; }
  }
  return { distance: D[a.length][b.length], paires };
}

/** Pure : accord (0…1) de deux suites de rôles = 1 − distance d'édition / longueur de la plus longue. */
export function accordSuites(a = [], b = []) {
  const L = Math.max(a.length, b.length);
  return L ? Math.round((1 - alignerSuites(a, b).distance / L) * 1000) / 1000 : 1;
}

const tranche = (n) => (n >= 4 ? '4+' : n >= 1 ? '1-3' : '0');
/** Pure : accord (0…1) des mesures de site : modèle de navigation (poids 1), tranche de pages de contenu (1),
 *  longueur en écrans (0,5), part d'image de la page (0,5). Le modèle et les pages sont le squelette du site.
 *  Recalibré le 31 oct 2026 (accord du fondateur) : quand les DEUX sites ont 4 pages de contenu ou plus, le critère
 *  « pages » ne compte plus (poids total 2 au lieu de 3). Ces pages sont exigées par le socle (GOUT § 0, une page par
 *  service) : presque tous les sites les ont, le score mesurait le socle et refusait des styles fidèles à leur source.
 *  Simulé sur le registre du 30 oct : 211 → 180 paires refusées, les six paires du fondateur restent toutes au-dessus
 *  de 0,65 (0,69 à 0,88). L'autre piste (ordre des blocs à 70 %) faisait passer une de ces paires : écartée. */
export function accordSite(p, q) {
  if (!p || !q) return 0;
  const modele = p.modele === q.modele ? 1 : 0;
  const socle = tranche(p.pagesContenu) === '4+' && tranche(q.pagesContenu) === '4+';
  const pages = tranche(p.pagesContenu) === tranche(q.pagesContenu) ? 1 : 0;
  const lp = p.ecrans || 0, lq = q.ecrans || 0;
  const longueur = Math.max(lp, lq) ? 1 - Math.abs(lp - lq) / Math.max(lp, lq) : 1;
  const image = 1 - Math.min(1, 2 * Math.abs((p.partImage || 0) - (q.partImage || 0)));
  if (socle) return Math.round((modele + 0.5 * longueur + 0.5 * image) / 2 * 1000) / 1000;
  return Math.round((modele + pages + 0.5 * longueur + 0.5 * image) / 3 * 1000) / 1000;
}

/** Pure : ressemblance de déroulé (0…1) de deux empreintes de déroulé. */
export function similariteDeroule(a, b) {
  if (!a?.roles?.length || !b?.roles?.length) return null;
  return Math.round((POIDS_SUITE * accordSuites(a.roles, b.roles) + (1 - POIDS_SUITE) * accordSite(a.site, b.site)) * 1000) / 1000;
}

/** Pure : plus longue sous-suite commune (dans l'ordre), pour dire « même ordre : … ». */
export function sousSuiteCommune(a = [], b = []) {
  const L = Array.from({ length: a.length + 1 }, () => new Array(b.length + 1).fill(0));
  for (let i = a.length - 1; i >= 0; i--) for (let j = b.length - 1; j >= 0; j--) L[i][j] = a[i] === b[j] ? L[i + 1][j + 1] + 1 : Math.max(L[i + 1][j], L[i][j + 1]);
  const out = [];
  for (let i = 0, j = 0; i < a.length && j < b.length;) { if (a[i] === b[j]) { out.push(a[i]); i++; j++; } else if (L[i + 1][j] >= L[i][j + 1]) i++; else j++; }
  return out;
}

const virgule = (x) => String(x).replace(".", ",");
/** Pure : ce qui est pareil dans le déroulé, en mots. */
export function ceQuiEstPareilDeroule(a, b) {
  const out = [];
  const commun = sousSuiteCommune(a.roles, b.roles);
  if (commun.length >= 3) out.push(`même ordre : ${commun.map((r) => MOTS_ROLE[r] || r).join(', ')}`);
  const p = a.site || {}, q = b.site || {};
  if (p.modele && p.modele === q.modele) {
    const nav = p.modele === 'plusieurs pages' ? 'même navigation : menu vers des pages' + (p.navAncres && q.navAncres ? ' et ancres' : '') : p.modele === 'longue page à ancres' ? 'même navigation à ancres' : `même navigation : ${p.modele}`;
    out.push(nav);
  }
  if (tranche(p.pagesContenu) === '4+' && tranche(q.pagesContenu) === '4+') out.push(`${p.pagesContenu} et ${q.pagesContenu} pages de contenu`);
  if (p.ecrans && q.ecrans && Math.abs(p.ecrans - q.ecrans) <= 0.2 * Math.max(p.ecrans, q.ecrans)) out.push(`même longueur (${virgule(p.ecrans)} et ${virgule(q.ecrans)} écrans)`);
  return out.join(' ; ') || 'rien de saillant';
}

/** Pure : la suite des rôles en mots. */
export function suiteEnMots(roles = []) {
  return roles.map((r) => MOTS_ROLE[r] || r).join(' › ');
}
