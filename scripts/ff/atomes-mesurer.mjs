// `ff atomes mesurer <url> --id <id> [--fiche <chemin>]` : relève dans le DOM calculé de Chrome (1440x900 puis
// 390x844) ce qu'il faut pour écrire les ATOMES d'un site (docs/veille/styles/ATOMES.md) : typographie (h1, h2,
// texte : famille, taille, graisse, interlignage, casse, interlettrage), couleurs (fonds par surface, textes par
// caractères), densité (marge de section, gouttière, conteneur, mesure du texte), formes (rayons des boutons,
// cartes, images ; bordures ; ombres ; style des boutons et des liens), photos (rapports, plein cadre, filtres,
// masques), mouvement (transitions, bibliothèques), matière (filets, fonds de section).
//
// Pourquoi (18 oct 2026) : `ff demonter` ne mesure ni les rayons, ni les marges, ni les boutons ; sans eux, les
// atomes « formes » et « densité » restaient « à juger » et ff melanger n'avait rien de réel à croiser. Ce relevé
// écrit `docs/veille/styles/atomes/mesures/<id>.json` (brut) et un BROUILLON `docs/veille/styles/atomes/<id>.json`
// (valeurs mesurées ; le jugement, la police libre la plus proche et la famille de premier écran restent « à
// juger » : un agent les remplit en regardant les captures). Un brouillon existant n'est jamais écrasé.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, ok, fail, info, warn } from './util.mjs';
import { A_JUGER } from './atomes.mjs';

/** Exécuté DANS la page : relevé brut. Aucune dépendance (sérialisé par Playwright). */
function releverDansLaPage() {
  const vw = innerWidth, vh = innerHeight;
  const visible = (el) => {
    const r = el.getBoundingClientRect();
    const cs = getComputedStyle(el);
    return r.width > 2 && r.height > 2 && cs.visibility !== 'hidden' && cs.display !== 'none' && Number(cs.opacity) > 0.05;
  };
  const px = (v) => parseFloat(v) || 0;
  const rgbHex = (c) => {
    const m = /rgba?\(([^)]+)\)/.exec(c || '');
    if (!m) return null;
    const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
    if (p.length > 3 && p[3] < 0.5) return null;
    return '#' + p.slice(0, 3).map((v) => Math.round(v).toString(16).padStart(2, '0')).join('');
  };
  const mediane = (xs) => { const s = xs.filter((x) => Number.isFinite(x)).sort((a, b) => a - b); return s.length ? s[Math.floor(s.length / 2)] : null; };
  const compter = (xs) => { const m = new Map(); for (const x of xs) if (x != null) m.set(x, (m.get(x) || 0) + 1); return [...m.entries()].sort((a, b) => b[1] - a[1]).map(([valeur, n]) => ({ valeur, n })); };
  const typoDe = (el) => {
    if (!el) return null;
    const cs = getComputedStyle(el);
    const taille = px(cs.fontSize);
    return {
      texte: (el.innerText || '').trim().slice(0, 60), famille: cs.fontFamily.split(',')[0].replace(/["']/g, '').trim(), pile: cs.fontFamily,
      taille: Math.round(taille * 10) / 10, graisse: Number(cs.fontWeight) || 400,
      interlignage: cs.lineHeight === 'normal' ? null : Math.round((px(cs.lineHeight) / taille) * 100) / 100,
      casse: cs.textTransform, italique: cs.fontStyle === 'italic',
      interlettrage: cs.letterSpacing === 'normal' ? 0 : Math.round((px(cs.letterSpacing) / taille) * 1000) / 1000,
    };
  };
  const tous = (sel) => [...document.querySelectorAll(sel)].filter(visible);
  // Titre principal : le h1 visible le plus grand ; à défaut le texte le plus gros du premier écran.
  const h1s = tous('h1').sort((a, b) => px(getComputedStyle(b).fontSize) - px(getComputedStyle(a).fontSize));
  let h1 = h1s.find((el) => (el.innerText || '').trim().length > 1);
  // Titre AFFICHÉ : le plus gros texte du premier écran. Un h1 caché ou réduit à une ligne de référencement
  // (Coutumes : 16 px, Studenterkilden : « Since 1854 » à 16 px) n'est pas le titre que l'œil voit.
  const cands = tous('h1, h2, h3, p, div, span, a, strong').filter((el) => [...el.childNodes].some((n) => n.nodeType === 3 && n.textContent.trim().length > 2) && el.getBoundingClientRect().top < vh && el.getBoundingClientRect().bottom > 0);
  const plusGros = cands.sort((a, b) => px(getComputedStyle(b).fontSize) - px(getComputedStyle(a).fontSize))[0];
  const h1Reel = h1;
  if (!h1 || (plusGros && px(getComputedStyle(h1).fontSize) < px(getComputedStyle(plusGros).fontSize) * 0.6)) h1 = plusGros;
  // h2 : la taille la plus fréquente parmi les h2 visibles (pas le plus grand : souvent un titre de bandeau).
  const h2s = tous('h2').filter((el) => (el.innerText || '').trim().length > 2);
  const tailleH2 = compter(h2s.map((el) => Math.round(px(getComputedStyle(el).fontSize))))[0]?.valeur;
  const h2 = h2s.find((el) => Math.round(px(getComputedStyle(el).fontSize)) === tailleH2);
  // Texte courant : le <p> le plus fréquent (taille) parmi ceux d'au moins 60 caractères.
  let ps = tous('p, li').filter((el) => (el.innerText || '').trim().length >= 60 && !el.closest('nav, footer, header'));
  // Repli : un site à textes courts (La Table de Joakim : légendes en mono) n'a aucun paragraphe de 60 caractères.
  if (!ps.length) ps = tous('p, li, span, div').filter((el) => el.children.length === 0 && (el.innerText || '').trim().length >= 25 && !el.closest('nav, footer, header, h1, h2, h3'));
  const tailleP = compter(ps.map((el) => Math.round(px(getComputedStyle(el).fontSize) * 2) / 2))[0]?.valeur;
  const p = ps.find((el) => Math.round(px(getComputedStyle(el).fontSize) * 2) / 2 === tailleP);
  const monos = tous('body *').filter((el) => el.children.length === 0 && (el.innerText || '').trim().length > 3 && /mono|courier|code/i.test(getComputedStyle(el).fontFamily)).length;

  // Mesure du texte : largeur du <p> en caractères réels (chasse moyenne de son propre texte, canvas).
  const ctx = document.createElement('canvas').getContext('2d');
  const mesures = ps.filter((el) => (el.innerText || '').length > 140).slice(0, 12).map((el) => {
    const cs = getComputedStyle(el);
    ctx.font = `${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const echantillon = (el.innerText || '').slice(0, 200);
    const chasse = ctx.measureText(echantillon).width / echantillon.length;
    return chasse > 0 ? Math.round(el.getBoundingClientRect().width / chasse) : null;
  });

  // Couleurs : fonds par surface visible (éléments à fond opaque), textes par nombre de caractères.
  const fonds = new Map(), textes = new Map();
  for (const el of document.querySelectorAll('body, body *')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const bg = rgbHex(cs.backgroundColor);
    if (bg) fonds.set(bg, (fonds.get(bg) || 0) + Math.min(r.width, vw) * Math.min(r.height, 4000));
    const propre = [...el.childNodes].filter((n) => n.nodeType === 3).map((n) => n.textContent.trim()).join('');
    if (propre.length) { const t = rgbHex(cs.color); if (t) textes.set(t, (textes.get(t) || 0) + propre.length); }
  }
  const trier = (m) => { const tot = [...m.values()].reduce((a, b) => a + b, 0) || 1; return [...m.entries()].sort((a, b) => b[1] - a[1]).slice(0, 8).map(([hex, v]) => ({ hex, part: Math.round((v / tot) * 1000) / 1000 })); };
  let fondPage = rgbHex(getComputedStyle(document.body).backgroundColor) || rgbHex(getComputedStyle(document.documentElement).backgroundColor) || '#ffffff';

  // Boutons : liens et boutons avec un fond ou une bordure et du rembourrage.
  const boutons = tous('a, button, input[type=submit]').filter((el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const fond = rgbHex(cs.backgroundColor), bord = px(cs.borderTopWidth) > 0 && rgbHex(cs.borderTopColor);
    return r.height >= 28 && r.height <= 90 && r.width <= 480 && px(cs.paddingLeft) >= 8 && (fond || bord) && (el.innerText || '').trim().length > 1;
  }).slice(0, 40).map((el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const rayon = px(cs.borderTopLeftRadius);
    return { rayon: Math.round(rayon), pilule: rayon >= r.height / 2 - 1, plein: Boolean(rgbHex(cs.backgroundColor)), bordure: px(cs.borderTopWidth), casse: cs.textTransform, interlettrage: cs.letterSpacing === 'normal' ? 0 : Math.round((px(cs.letterSpacing) / px(cs.fontSize)) * 1000) / 1000, taille: px(cs.fontSize), hauteur: Math.round(r.height) };
  });
  // Liens dans le texte courant.
  const liens = [...document.querySelectorAll('p a, li p a, article a')].filter(visible).slice(0, 30).map((el) => /underline/.test(getComputedStyle(el).textDecorationLine) ? 'souligne' : 'couleur');

  // Cartes : blocs de taille moyenne qui se détachent (fond différent du parent, ombre ou bordure).
  const cartes = tous('div, article, li, a, figure').filter((el) => {
    const r = el.getBoundingClientRect();
    if (r.width < 160 || r.width > vw * 0.6 || r.height < 120) return false;
    const cs = getComputedStyle(el);
    const fond = rgbHex(cs.backgroundColor), fondParent = el.parentElement ? rgbHex(getComputedStyle(el.parentElement).backgroundColor) : null;
    return (fond && fond !== fondParent) || cs.boxShadow !== 'none' || px(cs.borderTopWidth) > 0;
  }).slice(0, 60).map((el) => { const cs = getComputedStyle(el); return { rayon: Math.round(px(cs.borderTopLeftRadius)), ombre: cs.boxShadow !== 'none', bordure: px(cs.borderTopWidth) }; });

  // Images.
  const imgs = tous('img, picture, video, canvas').filter((el) => el.getBoundingClientRect().width >= 120);
  const images = imgs.slice(0, 80).map((el) => {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    const parent = el.parentElement ? getComputedStyle(el.parentElement) : null;
    const rayon = Math.max(px(cs.borderTopLeftRadius), parent ? px(parent.borderTopLeftRadius) : 0);
    return {
      largeur: Math.round(r.width), hauteur: Math.round(r.height), rapport: Math.round((r.width / Math.max(1, r.height)) * 100) / 100,
      pleinCadre: r.width >= vw * 0.95, rayon: Math.round(rayon), nb: /grayscale\((1|100%)\)/.test(cs.filter) || /grayscale\((1|100%)\)/.test(parent?.filter || ''),
      masque: cs.maskImage !== 'none' && cs.maskImage !== undefined && cs.maskImage !== '' || cs.clipPath !== 'none' || (parent && (parent.clipPath !== 'none')),
      melange: cs.mixBlendMode !== 'normal', cadre: px(cs.borderTopWidth) >= 2 || (parent && px(parent.paddingTop) >= 6 && rgbHex(parent.backgroundColor) && px(parent.borderTopWidth) >= 1),
    };
  });

  // Sections de premier niveau : enfants de <main> (ou de body) d'au moins 200 px ; marge = du haut de la section au
  // premier élément de texte, et du dernier au bas.
  const racine = document.querySelector('main') || document.body;
  let blocs = [...racine.children].filter((el) => visible(el) && el.getBoundingClientRect().height >= 200);
  if (blocs.length === 1 && blocs[0].children.length > 2) blocs = [...blocs[0].children].filter((el) => visible(el) && el.getBoundingClientRect().height >= 200);
  const marges = [], fondsSections = [];
  for (const b of blocs.slice(0, 30)) {
    const rb = b.getBoundingClientRect();
    // Texte seulement : une image collée au bord (plein cadre) n'est pas une marge nulle de la section. Sous 8 px, la
    // section n'a pas de marge propre (elle est portée par un enfant) : non comptée.
    const txt = [...b.querySelectorAll('h1, h2, h3, p, li')].filter(visible).map((x) => x.getBoundingClientRect());
    if (txt.length) {
      const haut = Math.min(...txt.map((r) => r.top)) - rb.top;
      const bas = rb.bottom - Math.max(...txt.map((r) => r.bottom));
      if (haut >= 8 && haut < 400) marges.push(Math.round(haut));
      if (bas >= 8 && bas < 400) marges.push(Math.round(bas));
    }
    fondsSections.push(rgbHex(getComputedStyle(b).backgroundColor));
  }
  // Conteneur : largeur médiane du bloc de texte le plus large par section (union des h2/p).
  const largeurs = blocs.slice(0, 30).map((b) => {
    const rs = [...b.querySelectorAll('h2, h3, p')].filter(visible).map((x) => x.getBoundingClientRect());
    if (!rs.length) return null;
    return Math.round(Math.max(...rs.map((r) => r.right)) - Math.min(...rs.map((r) => r.left)));
  });
  const gauches = tous('h1, h2, p').map((el) => Math.round(el.getBoundingClientRect().left)).filter((x) => x >= 0 && x < vw / 3);
  // Gouttière entre colonnes : écart horizontal entre deux cartes ou images voisines sur une même rangée.
  const voisins = [];
  const boites = [...imgs, ...tous('article, li')].map((el) => el.getBoundingClientRect()).filter((r) => r.width >= 120 && r.width < vw * 0.6).sort((a, b) => a.top - b.top || a.left - b.left);
  for (let i = 1; i < boites.length; i++) {
    const a = boites[i - 1], b = boites[i];
    if (Math.abs(a.top - b.top) < 4 && b.left > a.right) voisins.push(Math.round(b.left - a.right));
  }
  // Filets : bordures horizontales fines sur plus de 40 % de la largeur, et <hr>.
  let filets = document.querySelectorAll('hr').length;
  for (const el of tous('div, section, header, footer, li, article, nav')) {
    const cs = getComputedStyle(el), r = el.getBoundingClientRect();
    if (r.width < vw * 0.4) continue;
    for (const cote of ['Top', 'Bottom']) if (px(cs[`border${cote}Width`]) >= 0.5 && px(cs[`border${cote}Width`]) <= 2 && cs[`border${cote}Style`] !== 'none') filets++;
  }
  // Mouvement : transitions et animations distinctes, bibliothèques.
  const transitions = new Map();
  for (const el of document.querySelectorAll('body *')) {
    const cs = getComputedStyle(el);
    if (cs.transitionDuration && cs.transitionDuration !== '0s') {
      const d = cs.transitionDuration.split(',')[0].trim(), c = cs.transitionTimingFunction.split(/,(?![^(]*\))/)[0].trim();
      const k = `${d} ${c}`; transitions.set(k, (transitions.get(k) || 0) + 1);
    }
  }
  const libs = [];
  if (window.gsap) libs.push('GSAP');
  if (window.ScrollTrigger) libs.push('ScrollTrigger');
  if (window.Lenis || document.documentElement.classList.contains('lenis')) libs.push('Lenis');
  if (window.Swiper || document.querySelector('.swiper')) libs.push('Swiper');
  if (window.locomotiveScroll || document.querySelector('[data-scroll-container]')) libs.push('Locomotive Scroll');
  return {
    vue: { vw, vh },
    typo: { h1: typoDe(h1), h1Reel: h1Reel && h1Reel !== h1 ? typoDe(h1Reel) : null, h2: typoDe(h2), texte: typoDe(p), elementsMono: monos },
    couleurs: { fondPage, fonds: trier(fonds), textes: trier(textes) },
    densite: { marges: { mediane: mediane(marges), n: marges.length }, conteneur: (() => { const l = largeurs.filter((x) => x && x > vw * 0.3).sort((a, b) => b - a); return l.length ? l[Math.floor(l.length / 4)] : null; })(), gouttiereBord: mediane(gauches), ecartColonnes: mediane(voisins.filter((x) => x >= 8 && x <= 160)), mesure: mediane(mesures), fondsSections: fondsSections.filter(Boolean) },
    formes: {
      boutons: { n: boutons.length, rayon: mediane(boutons.map((b) => b.rayon)), pilules: boutons.filter((b) => b.pilule).length, pleins: boutons.filter((b) => b.plein).length, bordure: mediane(boutons.map((b) => b.bordure)), casse: compter(boutons.map((b) => b.casse))[0]?.valeur ?? null, interlettrage: mediane(boutons.map((b) => b.interlettrage)), hauteur: mediane(boutons.map((b) => b.hauteur)) },
      liens: { n: liens.length, souligne: liens.filter((x) => x === 'souligne').length },
      cartes: { n: cartes.length, rayon: mediane(cartes.map((x) => x.rayon)), ombres: cartes.filter((x) => x.ombre).length, bordures: cartes.filter((x) => x.bordure > 0).length },
    },
    photos: { n: images.length, rayon: mediane(images.map((x) => x.rayon)), pleinCadre: images.filter((x) => x.pleinCadre).length, nb: images.filter((x) => x.nb).length, masques: images.filter((x) => x.masque).length, melange: images.filter((x) => x.melange).length, cadres: images.filter((x) => x.cadre).length, rapports: compter(images.filter((x) => x.largeur >= 200).map((x) => (x.rapport >= 1.7 ? '16:9+' : x.rapport >= 1.4 ? '3:2' : x.rapport >= 1.15 ? '4:3' : x.rapport >= 0.9 ? '1:1' : x.rapport >= 0.7 ? '4:5' : '2:3-'))).slice(0, 3) },
    mouvement: { transitions: [...transitions.entries()].sort((a, b) => b[1] - a[1]).slice(0, 10).map(([valeur, n]) => ({ valeur, n })), bibliotheques: libs },
    matiere: { filets },
  };
}

/** Pure : arrondit un nombre (px) à l'entier, null si absent. */
const ent = (x) => (Number.isFinite(x) ? Math.round(x) : null);
/** Une mesure { telephone, ordinateur } entière, ou « à juger » si l'une des deux manque (le validateur refuse un null). */
const paire = (telephone, ordinateur) => (telephone == null || ordinateur == null ? A_JUGER : { telephone, ordinateur });
/**
 * Pure : garde une mesure dans les bornes que `ff atomes` accepte, sinon « à juger » (27 oct 2026 : la collecte
 * automatique écrivait des mesures de 147 à 174 caractères relevées sur des noms de produits, et un conteneur de
 * 580 px relevé sur une piste de carrousel ; chacune rendait le registre rouge).
 */
export const borne = (x, min, max = Infinity) => (x != null && x >= min && x <= max ? x : A_JUGER);

/** Pure : durée CSS (« 0.3s » / « 300ms ») -> secondes. */
export function enSecondes(v) {
  const m = /^([\d.]+)(ms|s)$/.exec(String(v).trim());
  return m ? Math.round((m[2] === 'ms' ? Number(m[1]) / 1000 : Number(m[1])) * 1000) / 1000 : null;
}

/**
 * Pure : relevé brut (ordinateur `d`, téléphone `m`) -> brouillon d'atomes au format de ATOMES.md. Ne remplit que
 * ce qui est mesuré ; le jugement (police libre la plus proche, traitement des photos, régime du mouvement, famille
 * de premier écran) reste « à juger ».
 */
export function brouillonDepuisReleve({ id, url, nom, fiche = null, date, d, m }) {
  const t = (cle) => ({ telephone: m?.typo?.[cle]?.taille ?? null, ordinateur: d?.typo?.[cle]?.taille ?? null });
  const echelle = (cle) => { const v = t(cle); return v.telephone && v.ordinateur ? v : A_JUGER; };
  const role = (x) => (x ? { famille: x.famille, libre: A_JUGER, graisse: x.graisse, interlignage: x.interlignage ?? A_JUGER } : { famille: A_JUGER, libre: A_JUGER });
  const h1 = d?.typo?.h1;
  const fonds = d?.couleurs?.fonds || [], textes = d?.couleurs?.textes || [];
  const fond = d?.couleurs?.fondPage || fonds[0]?.hex;
  const texte = textes[0]?.hex;
  const dist = (a, b) => (a && b ? Math.abs(parseInt(a.slice(1), 16) - parseInt(b.slice(1), 16)) : 0);
  const autresFonds = fonds.filter((x) => x.hex !== fond);
  const transitions = (d?.mouvement?.transitions || []).map((x) => ({ duree: enSecondes(x.valeur.split(' ')[0]), courbe: x.valeur.split(' ').slice(1).join(' '), n: x.n })).filter((x) => x.duree);
  const ui = transitions.find((x) => x.duree <= 0.4);
  const scene = transitions.find((x) => x.duree > 0.4);
  const bt = d?.formes?.boutons || {};
  const cartes = d?.formes?.cartes || {};
  const fondsSections = new Set((d?.densite?.fondsSections || []).filter((x) => x !== fond));
  return {
    id, version: 1,
    source: { url, nom, metier: A_JUGER, fiche, mesures: `docs/veille/styles/atomes/mesures/${id}.json`, date },
    typo: {
      titre: { ...role(h1), casse: h1?.casse ?? A_JUGER, interlettrage: Math.abs(h1?.interlettrage) < 0.3 ? h1.interlettrage : A_JUGER, italique: h1?.italique ?? false },
      texte: role(d?.typo?.texte),
      mono: d?.typo?.elementsMono > 5 ? { famille: A_JUGER, libre: A_JUGER } : null,
      echelle: { h1: echelle('h1'), h2: echelle('h2'), texte: echelle('texte') },
    },
    couleurs: {
      principal: A_JUGER,
      releve: { fond, texte, fonds: fonds.slice(0, 6), textes: textes.slice(0, 6), proches: dist(fond, texte) },
      clair: A_JUGER, sombre: null,
      _aide: autresFonds.length ? `autres fonds mesurés : ${autresFonds.map((x) => `${x.hex} (${Math.round(x.part * 100)} %)`).join(', ')}` : undefined,
    },
    densite: {
      section: paire(ent(m?.densite?.marges?.mediane), ent(d?.densite?.marges?.mediane)),
      gouttiere: paire(ent(m?.densite?.gouttiereBord), ent(d?.densite?.ecartColonnes ?? d?.densite?.gouttiereBord)),
      conteneur: borne(ent(d?.densite?.conteneur), 600),
      mesure: borne(ent(d?.densite?.mesure), 25, 140),
      rythme: fondsSections.size >= 2 ? 'alterne' : 'uni',
    },
    formes: {
      rayon: ent(bt.rayon) ?? A_JUGER, rayonCarte: ent(cartes.rayon) ?? A_JUGER, rayonImage: ent(d?.photos?.rayon) ?? A_JUGER,
      bordure: ent(bt.bordure) ?? A_JUGER,
      ombre: cartes.n ? (cartes.ombres / cartes.n > 0.3 ? 'douce' : 'aucune') : A_JUGER,
      bouton: bt.n ? (bt.pleins / bt.n >= 0.5 ? 'plein' : 'contour') : A_JUGER,
      pilule: bt.n ? bt.pilules / bt.n > 0.5 : false,
      casseBouton: bt.casse ?? A_JUGER,
      lien: d?.formes?.liens?.n ? (d.formes.liens.souligne / d.formes.liens.n >= 0.5 ? 'souligne' : 'couleur') : A_JUGER,
    },
    photos: { traitement: A_JUGER, rapports: (d?.photos?.rapports || []).map((x) => x.valeur), pleinCadre: d?.photos?.pleinCadre ?? 0, noirEtBlanc: d?.photos?.nb ?? 0, masques: d?.photos?.masques ?? 0, superposition: A_JUGER },
    mouvement: {
      regime: A_JUGER,
      ui: ui ? { duree: ui.duree, courbe: ui.courbe } : A_JUGER,
      scene: scene ? { duree: scene.duree, courbe: scene.courbe } : A_JUGER,
      defilement: A_JUGER,
      bibliotheques: d?.mouvement?.bibliotheques || [],
    },
    matiere: { fond: fondsSections.size >= 2 ? 'sections-colorees' : 'uni', filets: (d?.matiere?.filets ?? 0) >= 6 ? 'fins' : 'aucun', texture: A_JUGER },
    architecture: null,
    premier_ecran: A_JUGER,
  };
}

/** Lance Chrome (un seul à la fois dans l'atelier : si le lancement échoue, attend 30 s et réessaie, 4 fois). */
export async function lancerChrome() {
  const { chromium } = await import('playwright-core');
  for (let essai = 1; ; essai++) {
    try {
      return await chromium.launch({ channel: process.env.FF_CHROMIUM ? undefined : 'chrome', headless: true, args: ['--disable-blink-features=AutomationControlled'] });
    } catch (err) {
      if (essai >= 4) throw err;
      warn(`Chrome n'a pas démarré (${String(err.message).split('\n')[0]}) : nouvel essai dans 30 s`);
      await new Promise((r) => setTimeout(r, 30_000));
    }
  }
}

/** Relève un site (ordinateur puis téléphone). */
export async function releverSite(navigateur, url) {
  const out = {};
  for (const [k, vue] of [['d', { width: 1440, height: 900, mobile: false }], ['m', { width: 390, height: 844, mobile: true }]]) {
    const ctx = await navigateur.newContext({ viewport: { width: vue.width, height: vue.height }, isMobile: vue.mobile, hasTouch: vue.mobile, locale: 'fr-FR', userAgent: vue.mobile ? 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1' : undefined });
    const page = await ctx.newPage();
    try {
      await page.goto(url, { waitUntil: 'load', timeout: 60_000 }).catch(() => {});
      await page.waitForTimeout(2500);
      // Défile une fois jusqu'en bas pour jouer les apparitions, puis revient en haut.
      const h = await page.evaluate(() => document.body.scrollHeight).catch(() => 0);
      for (let y = 0; y < Math.min(h, 20000); y += 700) { await page.evaluate((yy) => scrollTo(0, yy), y).catch(() => {}); await page.waitForTimeout(60); }
      await page.evaluate(() => scrollTo(0, 0)).catch(() => {});
      await page.waitForTimeout(800);
      out[k] = await page.evaluate(releverDansLaPage);
    } finally {
      await ctx.close();
    }
  }
  return out;
}

export async function cmdAtomesMesurer({ url, id, fiche, nom }) {
  if (!url || !id) { fail('ff atomes mesurer <url> --id <id> [--fiche docs/…/x.md] [--nom "Nom"]'); process.exit(1); }
  const dossier = path.join(ROOT, 'docs', 'veille', 'styles', 'atomes');
  fs.mkdirSync(path.join(dossier, 'mesures'), { recursive: true });
  const navigateur = await lancerChrome();
  let releve;
  try { releve = await releverSite(navigateur, url); } finally { await navigateur.close(); }
  const date = new Date().toISOString().slice(0, 10);
  fs.writeFileSync(path.join(dossier, 'mesures', `${id}.json`), JSON.stringify({ outil: 'ff atomes mesurer', url, date, ...releve }, null, 1) + '\n');
  ok(`relevé brut : docs/veille/styles/atomes/mesures/${id}.json`);
  const cible = path.join(dossier, `${id}.json`);
  if (fs.existsSync(cible)) { info(`docs/veille/styles/atomes/${id}.json existe déjà : non écrasé (le relevé brut est à jour).`); return; }
  const brouillon = brouillonDepuisReleve({ id, url, nom: nom || id, fiche: fiche || null, date, ...releve });
  fs.writeFileSync(cible, JSON.stringify(brouillon, null, 2) + '\n');
  ok(`brouillon : docs/veille/styles/atomes/${id}.json — remplir les « à juger » (police libre, palette, photos, régime, premier écran) puis \`ff atomes\`.`);
}

/**
 * `ff atomes` : liste le registre (docs/veille/styles/atomes/*.json), valide chaque fichier et dit quelles dimensions
 * ff melanger peut en tirer. `ff atomes mesurer <url> --id <id>` : relevé + brouillon (ci-dessus). Sort en erreur si un
 * fichier est invalide.
 */
export async function cmdAtomes(args) {
  const { parseArgs } = await import('./util.mjs');
  const { positional, flags } = parseArgs(args);
  if (positional[0] === 'mesurer') return cmdAtomesMesurer({ url: positional[1], id: flags.id, fiche: flags.fiche, nom: flags.nom });
  const { lireAtomes, validerAtomes, policesDuRegistre, DIMENSIONS } = await import('./atomes.mjs');
  const { construireRegistre } = await import('./melanger.mjs');
  const { CLES_IA } = await import('./ia.mjs');
  const polices = policesDuRegistre(fs.readFileSync(path.join(ROOT, 'src/lib/fonts.ts'), 'utf8'));
  const entrees = lireAtomes(path.join(ROOT, 'docs', 'veille', 'styles', 'atomes'));
  const reg = construireRegistre(entrees, { polices, clesIa: CLES_IA });
  let rouge = false;
  for (const { fichier, atomes, erreurJson } of entrees) {
    if (erreurJson) { fail(`${fichier} : JSON illisible`); rouge = true; continue; }
    const v = validerAtomes(atomes, { polices, clesIa: CLES_IA });
    if (v.erreurs.length) { fail(`${fichier} : ${v.erreurs.join(' ; ')}`); rouge = true; continue; }
    const tirables = DIMENSIONS.filter((d) => reg.reserves[d].includes(atomes.id));
    ok(`${atomes.id.padEnd(18)} ${tirables.join(', ') || '(rien de tirable)'}`);
    for (const a of v.alertes) warn(`  ${a}`);
  }
  for (const r of reg.rejets.filter((x) => !/: JSON|invalide/.test(x))) info(`  écarté : ${r}`);
  info(`${Object.keys(reg.parId).length} site(s) ; tirables : ${DIMENSIONS.map((d) => `${d} ${reg.reserves[d].length}`).join(', ')}.`);
  // Régimes de palette (docs/veille/styles/ATOMES.md § Régimes de palette) : la collecte les équilibre (veille, 2a quater).
  const { compterRegimes, besoinsRegimes, REGIMES_PALETTE } = await import('./melanger.mjs');
  const comptes = compterRegimes(reg);
  info(`Couleurs par régime : ${Object.entries(comptes).map(([r, n]) => `${REGIMES_PALETTE[r]} ${n}`).join(', ')}.`);
  for (const b of besoinsRegimes(comptes)) warn(`  besoin : ${b.phrase}`);
  if (rouge) process.exitCode = 1;
}
