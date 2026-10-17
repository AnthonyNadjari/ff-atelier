// `ff demonter <url> [--slug <site>] [--nom <x>] [--dossier <dossier>]`
// DÉMONTE automatiquement un site de référence (celui qu'un client « aime » dans son brief) : ouvre l'URL
// en Chrome local (playwright-core, une seule page à la fois), à 1440x900 puis 390x844, lit le DOM calculé
// et écrit :
//   - <dossier>/captures/<nom>-d.webp et <nom>-m.webp (premier écran), <nom>-planche.jpg (8 vues du
//     défilement, assemblées comme `ff planche`) ;
//   - <dossier>/<nom>.md : fiche au format des fiches de docs/veille/demontages/ (mêmes titres que delice.md),
//     remplie depuis les mesures réelles — rien n'est deviné : une mesure absente s'écrit « non mesuré », le
//     geste signature reste « à remplir après lecture des captures » avec trois candidats factuels ;
//   - <dossier>/<nom>.json : toutes les mesures brutes (tests, comparaison future).
// Dossier par défaut : docs/veille/demontages/ (nom = hôte sans www ni tld). Avec --slug : sites/<slug>/references/
// (dossier du client, exclu de `ff exporter`). --dossier impose un dossier quelconque (essais).
//
// Pourquoi : dans le brief, le client donne « des sites que vous aimez, et pourquoi ». Jusqu'au 17 oct 2026 un
// agent humain lisait ces sites à la main ; la méthode des 25 démontages (docs/veille/demontages/INDEX.md)
// est ici automatisée pour nourrir la section « Références » du contrat de direction
// (.claude/skills/site-final/direction-modele.md). Ce que l'outil mesure est écrit comme mesuré ; ce qui
// demande un œil (matière, geste, « en 3 secondes ») est marqué « à juger » dans la fiche.
//
// Robustesse : timeout 45 s par vue, bannière cookies détectée mais jamais cliquée (mesurée comme couche
// bloquante), page qui refuse les navigateurs sans tête -> message clair et sortie 1, URL non http(s)
// refusée, aucun téléchargement en dehors de la page, Chrome fermé dans un `finally`.
// Fonctions pures (nomDepuisUrl, rgbVersHex, contraste, classerCouleurs, estPilule, policesIa, rendreFiche,
// candidatsSignature) testées sans navigateur dans tests/demonter.test.mjs.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, siteExists, ok, fail, info, warn, parseArgs } from './util.mjs';
import { estPoliceIa } from './ia.mjs';
import { disposerVignettes } from './planche.mjs';

export const VUES = {
  d: { vw: 1440, vh: 900, mobile: false, largeurVignette: 350 },
  m: { vw: 390, vh: 844, mobile: true, largeurVignette: 180 },
};
export const TIMEOUT_MS = 45_000;
export const NON_MESURE = 'non mesuré';
const NB_VUES_PLANCHE = 8;

// ---------------------------------------------------------------------------------------------
// Fonctions pures (testées sans navigateur).
// ---------------------------------------------------------------------------------------------

/** Vérifie et normalise l'URL : http(s) seulement, sinon lève une erreur lisible. */
export function validerUrl(texte) {
  let u;
  try {
    u = new URL(String(texte || '').trim());
  } catch {
    throw new Error(`URL illisible : « ${texte} ». Attendu : https://exemple.fr`);
  }
  if (u.protocol !== 'http:' && u.protocol !== 'https:') throw new Error(`URL refusée (${u.protocol}) : seuls http et https sont acceptés.`);
  return u.href;
}

/** Nom de fichier depuis l'URL : hôte sans www ni tld (« https://www.delice.ca/ » -> « delice »). */
export function nomDepuisUrl(url) {
  const hote = new URL(validerUrl(url)).hostname.toLowerCase().replace(/^www\./, '');
  let labels = hote.split('.').filter(Boolean);
  if (labels.length > 1) labels = labels.slice(0, -1);
  if (labels.length > 1 && ['co', 'com', 'org', 'net', 'gov', 'ac', 'edu'].includes(labels[labels.length - 1])) labels = labels.slice(0, -1);
  const nom = labels.join('-').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9-]+/g, '-').replace(/^-+|-+$/g, '');
  return nom || 'site';
}

/** `rgb(222, 43, 43)` / `rgba(0,0,0,0.9)` -> `#de2b2b` ; transparent ou alpha < 0,5 -> null. */
export function rgbVersHex(texte) {
  const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(String(texte || ''));
  if (!m) {
    const h = /^#([0-9a-f]{6})$/i.exec(String(texte || '').trim());
    return h ? `#${h[1].toLowerCase()}` : null;
  }
  const a = m[4] === undefined ? 1 : Number(m[4]);
  if (a < 0.5) return null;
  const c = (v) => Math.max(0, Math.min(255, Math.round(Number(v)))).toString(16).padStart(2, '0');
  return `#${c(m[1])}${c(m[2])}${c(m[3])}`;
}

function luminance(hex) {
  const v = [1, 3, 5].map((i) => {
    const c = parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
}

/** Ratio de contraste WCAG entre deux hex (#rrggbb), arrondi à 2 décimales ; null si une couleur manque. */
export function contraste(hexA, hexB) {
  if (!/^#[0-9a-f]{6}$/i.test(hexA || '') || !/^#[0-9a-f]{6}$/i.test(hexB || '')) return null;
  const a = luminance(hexA.toLowerCase());
  const b = luminance(hexB.toLowerCase());
  return Math.round(((Math.max(a, b) + 0.05) / (Math.min(a, b) + 0.05)) * 100) / 100;
}

/**
 * Classe des couleurs comptées dans la page : fusionne par hex, écarte les entrées sans hex (transparent),
 * trie par poids (surface pour les fonds, caractères pour les textes) puis par nombre d'éléments ; garde
 * les `k` premières avec leur part du total (0..1).
 */
export function classerCouleurs(entrees, k = 5) {
  const parHex = new Map();
  for (const e of entrees || []) {
    if (!e || !e.hex) continue;
    const hex = e.hex.toLowerCase();
    const cur = parHex.get(hex) || { hex, n: 0, poids: 0 };
    cur.n += e.n ?? 1;
    cur.poids += e.poids ?? 0;
    parHex.set(hex, cur);
  }
  const total = [...parHex.values()].reduce((s, e) => s + e.poids, 0);
  return [...parHex.values()]
    .sort((a, b) => b.poids - a.poids || b.n - a.n || a.hex.localeCompare(b.hex))
    .slice(0, k)
    .map((e) => ({ ...e, part: total ? Math.round((e.poids / total) * 1000) / 1000 : 0 }));
}

/** Bouton pilule : rayon >= hauteur / 2, sur un élément plus large que haut (un rond n'est pas une pilule). */
export function estPilule({ rayon, hauteur, largeur }) {
  if (!(hauteur > 0) || !(rayon >= 0)) return false;
  if (largeur !== undefined && largeur <= hauteur) return false;
  return rayon >= hauteur / 2;
}

/** Première famille d'une valeur `font-family` calculée, sans guillemets (« "Ivy Mode", serif » -> « Ivy Mode »). */
export function familleCourte(fontFamily) {
  const premiere = String(fontFamily || '').split(',')[0].trim().replace(/^["']|["']$/g, '');
  return premiere;
}

/** Familles de la liste « IA » (scripts/ff/ia.mjs) parmi celles mesurées ; dédoublonnées, ordre d'entrée. */
export function policesIa(familles) {
  const vues = new Set();
  const out = [];
  for (const f of familles || []) {
    const nom = familleCourte(f);
    if (!nom || vues.has(nom.toLowerCase())) continue;
    vues.add(nom.toLowerCase());
    if (estPoliceIa(nom)) out.push(nom);
  }
  return out;
}

/** Classe l'origine d'une police d'après l'URL de son fichier et l'hôte de la page. */
export function sourcePolice(urlFichier, hotePage) {
  let h = '';
  try {
    h = new URL(urlFichier, `https://${hotePage || 'x'}`).hostname.toLowerCase();
  } catch {
    return 'inconnue';
  }
  if (/(^|\.)gstatic\.com$|fonts\.googleapis\.com$/.test(h)) return 'Google Fonts';
  if (/typekit\.(net|com)$|adobe\.com$/.test(h)) return 'Adobe Fonts';
  if (/bunny\.net$/.test(h)) return 'Bunny Fonts';
  if (hotePage && (h === hotePage.toLowerCase() || h.endsWith(`.${hotePage.toLowerCase().replace(/^www\./, '')}`) || h === hotePage.toLowerCase().replace(/^www\./, ''))) return 'auto-hébergée';
  if (!h) return 'auto-hébergée';
  return `tiers (${h})`;
}

/**
 * Nom affiché en tête de fiche : og:site_name, sinon le segment du <title> le plus court hors mots génériques
 * (« Accueil - Délice » -> « Délice »), sinon le nom de fichier.
 */
export function nomAffiche(identite, nom) {
  const site = String(identite?.siteName || '').trim();
  if (site) return site.slice(0, 60);
  const segments = String(identite?.title || '').split(/\s*[|–—:]\s*|\s-\s/).map((s) => s.trim()).filter(Boolean)
    .filter((s) => !/^(accueil|home|homepage|bienvenue|welcome|index|start)$/i.test(s));
  if (!segments.length) return nom;
  return segments.sort((a, b) => a.length - b.length)[0].slice(0, 60);
}

/**
 * Trois candidats FACTUELS pour le geste signature, à partir des mesures : la section la plus haute, l'élément
 * le plus animé, le bloc le plus singulier par sa structure (balises rares qu'il est seul à contenir).
 * Ne juge rien : décrit.
 */
export function candidatsSignature(mesures) {
  const d = mesures?.d || {};
  const sections = d.structure?.sections || [];
  const out = [];
  if (sections.length) {
    const haute = [...sections].sort((a, b) => (b.hauteur || 0) - (a.hauteur || 0))[0];
    out.push(`La section la plus haute : \`${haute.selecteur}\`${haute.titre ? ` ${guill(tronque(haute.titre, 40))}` : ''} (${fmtEcrans(haute.ecrans)}, ${haute.mots ?? 0} mots, ${haute.images ?? 0} image(s)).`);
  } else out.push(`La section la plus haute : ${NON_MESURE}.`);
  const anim = d.mouvement?.plusAnime;
  if (anim && anim.selecteur) {
    const details = [];
    if (anim.animations?.length) details.push(`animation ${anim.animations.slice(0, 2).join(' ; ')}`);
    if (anim.transitions?.length) details.push(`${anim.transitions.length} transition(s) : ${anim.transitions.slice(0, 2).join(' ; ')}`);
    if (anim.attributs?.length) details.push(`attributs ${anim.attributs.slice(0, 3).join(', ')}`);
    out.push(`L'élément le plus animé : \`${anim.selecteur}\` (${details.join(' ; ') || 'aucun détail'}).`);
  } else out.push(`L'élément le plus animé : ${NON_MESURE} (aucune animation ni transition CSS lue).`);
  if (sections.length) {
    const compte = new Map();
    for (const s of sections) for (const t of s.balisesRares || []) compte.set(t, (compte.get(t) || 0) + 1);
    let meilleur = null;
    let score = -1;
    for (const s of sections) {
      const uniques = (s.balisesRares || []).filter((t) => compte.get(t) === 1);
      const sc = uniques.length * 2 + (s.balisesRares || []).length;
      if (sc > score) {
        score = sc;
        meilleur = { s, uniques };
      }
    }
    if (meilleur && score > 0) {
      const u = meilleur.uniques.length ? `seule à contenir ${meilleur.uniques.map((t) => `<${t}>`).join(', ')}` : `contient ${meilleur.s.balisesRares.map((t) => `<${t}>`).join(', ')}`;
      out.push(`Le bloc le plus singulier par sa structure : \`${meilleur.s.selecteur}\`${meilleur.s.titre ? ` ${guill(tronque(meilleur.s.titre, 40))}` : ''} (${u}).`);
    } else out.push('Le bloc le plus singulier par sa structure : aucune section ne contient de balise rare (table, details, canvas, video, svg, form, dl…).');
  } else out.push(`Le bloc le plus singulier par sa structure : ${NON_MESURE}.`);
  return out;
}

// ---- rendu de la fiche ----
const fr = (n, dec = 1) => (n === null || n === undefined || Number.isNaN(n) ? NON_MESURE : Number(n).toFixed(dec).replace('.', ','));
const fmtEcrans = (n) => (n === null || n === undefined ? NON_MESURE : `${fr(n)} écran${n >= 2 ? 's' : ''}`);
const px = (n) => (n === null || n === undefined ? NON_MESURE : `${Math.round(n)} px`);
const guill = (t) => `« ${String(t).replace(/\s+/g, ' ').trim()} »`;
const tronque = (t, n = 90) => {
  const s = String(t || '').replace(/\s+/g, ' ').trim();
  return s.length > n ? `${s.slice(0, n - 1)}…` : s;
};
const liste = (arr, vide = 'aucun') => (arr && arr.length ? arr.join(', ') : vide);

function ligneTypo(nom, t, tm) {
  if (!t) return `${nom} : ${NON_MESURE}`;
  const parts = [`${nom} **${familleCourte(t.famille) || NON_MESURE}**`];
  parts.push(`${px(t.taille)}${tm && tm.taille !== undefined ? ` / ${px(tm.taille)} téléphone` : ''}`);
  if (t.graisse !== undefined) parts.push(`graisse ${t.graisse}`);
  if (t.interlignage) parts.push(`interlignage ${fr(t.interlignage, 2)}`);
  if (t.italique) parts.push('italique');
  if (t.transform && t.transform !== 'none') parts.push(t.transform === 'uppercase' ? 'capitales' : t.transform);
  if (t.interlettrage && t.interlettrage !== 'normal' && t.interlettrage !== '0px') parts.push(`interlettrage ${t.interlettrage}`);
  return parts.join(', ');
}

function position(pe) {
  const b = pe?.boutonPrincipal;
  if (!b) return `bouton principal : aucun bouton lu dans le premier écran`;
  const h = b.cx < 1 / 3 ? 'à gauche' : b.cx > 2 / 3 ? 'à droite' : 'au centre';
  const v = b.cy < 1 / 3 ? 'en haut' : b.cy > 2 / 3 ? 'en bas' : 'à mi-hauteur';
  return `bouton principal ${guill(b.texte)} ${v} ${h} (${Math.round(b.x)}, ${Math.round(b.y)} px${b.fixe ? ', dans une barre fixe' : ''}${b.dansNav ? ', dans la nav' : ''})`;
}

function premierEcranTexte(pe, vue) {
  if (!pe) return `${vue} : ${NON_MESURE}.`;
  const media = pe.mediaPleinEcran ? `${pe.mediaPleinEcran.type} plein écran (${Math.round(pe.mediaPleinEcran.couverture * 100)} % de l'écran)` : `pas de média plein écran (${pe.images ?? 0} image(s) dans l'écran)`;
  const couche = pe.coucheBloquante
    ? `couche bloquante à l'arrivée : ${pe.coucheBloquante.cookie ? 'bannière cookies' : 'calque'} couvrant ${Math.round(pe.coucheBloquante.couverture * 100)} % de l'écran (${guill(tronque(pe.coucheBloquante.texte, 60))})`
    : pe.cookie
      ? `bannière cookies ${Math.round(pe.cookie.couverture * 100)} % de l'écran, non bloquante`
      : 'aucune couche bloquante';
  const bouge = pe.bougeSeul ? (pe.bougeSeul.n ? `bouge tout seul sans défilement : ${pe.bougeSeul.n} élément(s) (${pe.bougeSeul.exemples.map((s) => `\`${s}\``).join(', ')})` : 'rien ne bouge tout seul') : `mouvement spontané ${NON_MESURE}`;
  return `${vue} : h1 ${pe.h1 ? guill(tronque(pe.h1, 120)) : 'absent'} ; ${media} ; ${position(pe)} ; ${pe.mots ?? NON_MESURE} mots visibles au-dessus du pli ; ${couche} ; ${bouge}.`;
}

function calquesTexte(calques) {
  if (!calques || !calques.length) return '';
  return ` Calques hors flux (fixes/absolus) : ${calques.map((c) => `\`${c.selecteur}\` (${c.position}, ${c.hauteur} px${c.enBas ? ', collé en bas' : ''}${c.mots ? `, ${c.mots} mots` : ''})`).join(', ')}.`;
}

function sectionsTexte(sections) {
  if (!sections || !sections.length) return `Sections de premier niveau : ${NON_MESURE}.`;
  return `Ordre (sections de premier niveau, ordinateur ; titre lu entre guillemets) : ${sections
    .map((s) => `\`${s.selecteur}\`${s.titre ? ` ${guill(tronque(s.titre, 40))}` : ''} (${fmtEcrans(s.ecrans)}, ${s.mots ?? 0} mots, ${s.images ?? 0} img)`)
    .join(' → ')}.`;
}

function liens(arr, max = 12) {
  if (!arr || !arr.length) return 'aucun';
  const out = arr.slice(0, max).map((l) => (l.bouton ? `[${l.texte}]` : l.texte));
  return out.join(', ') + (arr.length > max ? ` (+${arr.length - max})` : '');
}

/** Rend la fiche Markdown depuis le JSON de mesures. Pure : aucune lecture de fichier. */
export function rendreFiche(m) {
  const d = m.d || {};
  const mo = m.m || {};
  const id = m.identite || {};
  const nom = m.nomAffiche || m.nom || 'Site';
  const typo = d.typographie || {};
  const typoM = mo.typographie || {};
  const coul = d.couleurs || {};
  const mouv = d.mouvement || {};
  const st = d.structure || {};
  const signes = d.signes || {};
  const signesM = mo.signes || {};
  const L = [];

  L.push(`# ${nom} — ${m.url}`);
  const identite = [];
  identite.push(`Titre ${id.title ? guill(tronque(id.title, 120)) : NON_MESURE}`);
  identite.push(`\`lang="${id.lang || '?'}"\``);
  if (id.description) identite.push(`description ${guill(tronque(id.description, 160))}`);
  identite.push(`technologie lue : ${liste(id.technologies, 'aucune reconnue')}`);
  L.push(`${identite.join(', ')}. Démontage automatique du ${m.date || '?'} (\`ff demonter\`, mesures brutes dans \`${m.nom}.json\`) : tout ce qui suit est mesuré dans le DOM calculé de Chrome à 1440x900 et 390x844 ; ce qui demande un œil est marqué « à juger ».`);

  L.push('');
  L.push('## Squelette');
  L.push(premierEcranTexte(d.premierEcran, 'Premier écran (ordinateur 1440x900)'));
  L.push(premierEcranTexte(mo.premierEcran, 'Téléphone (390x844)'));
  L.push(`Nav : ${st.nav ? `${st.nav.liens?.length ?? 0} lien(s) — ${liens(st.nav.liens)} ; boutons entre crochets` : NON_MESURE}.${mo.structure?.barreBas ? ` **Barre fixe en bas de l'écran (téléphone)** : ${liens(mo.structure.barreBas.liens, 6)}.` : ''}${st.barreBas ? ` Barre fixe en bas (ordinateur) : ${liens(st.barreBas.liens, 6)}.` : ''}`);
  L.push(sectionsTexte(st.sections) + calquesTexte(st.calquesFixes));
  const pied = st.pied ? `${st.pied.liens?.length ?? 0} lien(s) — ${liens(st.pied.liens, 10)}` : 'aucun pied de page lu';
  const tel = st.telephone?.n ? `oui (${st.telephone.n}, ${st.telephone.href})` : 'non';
  const form = st.formulaires?.n ? `${st.formulaires.n} (${st.formulaires.champs ?? '?'} champ(s) dans le premier)` : 'aucun';
  const horaires = st.horaires?.trouve ? `oui (${st.horaires.jours} jours nommés, ${st.horaires.heures} heures, ex. ${guill(tronque(st.horaires.extrait, 80))})` : 'non repérés dans le texte (il faut au moins 3 jours nommés et 2 heures)';
  const portes = st.portes?.length ? st.portes.map((p) => `${guill(p.texte)} (${p.href})`).join(', ') : 'aucune (réservation, commande, bon cadeau, devis, rendez-vous)';
  L.push(`Pied de page : ${pied}. Téléphone cliquable : ${tel}. Formulaire : ${form}. Horaires : ${horaires}. Portes d'action : ${portes}.`);
  L.push(`En 3 secondes : à juger sur \`captures/${m.nom}-d.webp\` (mesuré : fond du premier écran ${d.premierEcran?.fondPremierEcran || coul.fond || NON_MESURE}, ${d.premierEcran?.images ?? '?'} image(s) et ${d.premierEcran?.mots ?? '?'} mots dans le premier écran).`);

  L.push('');
  L.push('## Typographie');
  const lignes = [ligneTypo('titres h1', typo.h1, typoM.h1), ligneTypo('h2', typo.h2, typoM.h2), ligneTypo('corps', typo.p, typoM.p), ligneTypo('boutons', typo.bouton, typoM.bouton), ligneTypo('nav', typo.nav, typoM.nav)];
  L.push(`Lues dans le DOM calculé (ordinateur / téléphone) : ${lignes.join(' ; ')}.`);
  const faces = typo.fontFaces || [];
  const parSource = new Map();
  for (const f of faces) {
    const s = f.source || 'inconnue';
    if (!parSource.has(s)) parSource.set(s, new Set());
    parSource.get(s).add(f.famille);
  }
  const sources = [...parSource.entries()].map(([s, fam]) => `${s} (${[...fam].join(', ')})`);
  L.push(`Sources \`@font-face\` : ${sources.length ? sources.join(' ; ') : typo.fontFacesNonLisibles ? `feuilles d'origine croisée non lisibles (${typo.fontFacesNonLisibles.join(', ')})` : 'aucune déclaration lue'}${typo.fichiersPolices?.length ? ` ; fichiers chargés : ${typo.fichiersPolices.slice(0, 6).join(', ')}` : ''}. Familles en usage sur le texte visible : ${liste((typo.famillesVisibles || []).slice(0, 6).map((f) => `${f.famille} ×${f.n}`), NON_MESURE)}. Ce qui la rend rare : à juger.`);

  L.push('');
  L.push('## Couleur et matière');
  const fonds = (coul.fonds || []).map((c) => `${c.hex} (${Math.round(c.part * 100)} %)`);
  const textes = (coul.textes || []).map((c) => `${c.hex} (${Math.round(c.part * 100)} %)`);
  const fondPE = d.premierEcran?.fondPremierEcran;
  L.push(`Fond du corps ${coul.fond || NON_MESURE}${fondPE && fondPE !== coul.fond ? ` (premier écran ${fondPE})` : ''}, texte ${coul.texte || NON_MESURE}${coul.contraste ? ` (contraste ${fr(coul.contraste, 2)}:1)` : ''}. Couleurs les plus présentes (calculées sur les éléments visibles, hors transparent) — fonds par surface : ${liste(fonds, NON_MESURE)} ; textes par nombre de caractères : ${liste(textes, NON_MESURE)}. Images : ${coul.nbImages ?? '?'} \`<img>\` visibles, ${coul.nbFondsImage ?? '?'} fond(s) en image, ${coul.nbVideos ?? '?'} vidéo(s)${coul.masques ? `, \`mask-image\`/\`clip-path\` sur ${coul.masques} élément(s)` : ''}. Matière (texture, grain, détourage) : à juger sur les captures.`);

  L.push('');
  L.push('## Mouvement');
  const libs = (mouv.bibliotheques || []).map((b) => `${b.nom} (${b.preuve})`);
  const courbes = (mouv.courbes || []).map((c) => `\`${c.valeur}\` ×${c.n}`);
  const scroll = [];
  scroll.push(`ScrollTrigger ${mouv.scrollTrigger ? 'oui' : 'non'}`);
  scroll.push(`\`animation-timeline\` sur ${mouv.animationTimeline ?? 0} élément(s)`);
  scroll.push(`\`position: sticky\` sur ${mouv.stickyLongs?.length ?? 0} bloc(s) de plus d'un écran${mouv.stickyLongs?.length ? ` (${mouv.stickyLongs.slice(0, 3).map((s) => `\`${s.selecteur}\` ${fmtEcrans(s.ecrans)}`).join(', ')})` : ''}`);
  const attrs = (mouv.attributs || []).map((a) => `\`${a.nom}\` ×${a.n}`);
  L.push(`Bibliothèques : ${liste(libs, 'aucune détectée (window.* et noms de scripts)')}. Transitions et animations distinctes (CSS calculé des éléments visibles, 10 premières) : ${liste(courbes, 'aucune')}. Scroll lié : ${scroll.join(' ; ')}. Attributs de mouvement : ${liste(attrs, 'aucun')}. Ce qui bouge réellement à l'écran : à juger sur \`captures/${m.nom}-planche.jpg\`.`);

  L.push('');
  L.push('## Le geste signature');
  L.push('À remplir après lecture des captures. Candidats factuels (mesurés, pas jugés) :');
  for (const [i, c] of candidatsSignature(m).entries()) L.push(`${i + 1}. ${c}`);

  L.push('');
  L.push('## Ce qu\'on garde / ce qu\'on refuse');
  const utiles = [];
  if (st.telephone?.n) utiles.push('téléphone cliquable');
  if (st.horaires?.trouve) utiles.push("horaires sur l'accueil");
  if (st.portes?.length) utiles.push(`portes d'action nommées (${st.portes.map((p) => guill(p.texte)).join(', ')})`);
  if (mo.structure?.barreBas) utiles.push("barre d'actions fixe en bas sur téléphone");
  if (st.formulaires?.n) utiles.push('formulaire de contact');
  L.push(`Garde : à juger. Mesuré et utile à l'usine : ${liste(utiles, 'rien de mesurable')}.`);
  const ia = [];
  const policesIaTrouvees = signes.policesIa || [];
  ia.push(`polices « IA » : ${policesIaTrouvees.length ? policesIaTrouvees.join(', ') : 'aucune'}`);
  ia.push(`boutons pilule : ${signes.pilules ? `${signes.pilules.pilules}/${signes.pilules.boutons} ordinateur` : NON_MESURE}${signesM.pilules ? `, ${signesM.pilules.pilules}/${signesM.pilules.boutons} téléphone` : ''}`);
  ia.push(`vidéo en premier écran : ${d.premierEcran?.mediaPleinEcran?.type === 'vidéo' ? 'oui' : d.premierEcran ? 'non' : NON_MESURE}`);
  const couche = d.premierEcran?.coucheBloquante;
  ia.push(`couche bloquante à l'arrivée : ${couche ? `oui (${couche.cookie ? 'bannière cookies' : 'calque'}, ${Math.round(couche.couverture * 100)} % de l'écran)` : d.premierEcran ? 'non' : NON_MESURE}`);
  ia.push(`« X ans » mis en scène : ${signes.ans?.length ? signes.ans.map((a) => `${guill(a.texte)} à ${px(a.taille)}`).join(', ') : 'non'}`);
  L.push(`Refuse (signes IA mesurés, GOUT § 2) : ${ia.join(' ; ')}. Le reste (badges décoratifs, titre illisible, autoplay) : à juger.`);
  L.push('');
  return L.join('\n');
}

// ---------------------------------------------------------------------------------------------
// Côté navigateur : récolte brute, aucun jugement (fonction injectée dans la page, autonome).
// ---------------------------------------------------------------------------------------------

/** Phase « arrivée » : avant tout défilement — premier écran, couche bloquante, cookies. */
function collecterArrivee({ vw, vh }) {
  /* eslint-disable no-undef */
  const visible = (el) => {
    if (!el || el.nodeType !== 1) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden' || Number(cs.opacity) === 0) return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const inter = (r) => {
    const w = Math.max(0, Math.min(r.right, vw) - Math.max(r.left, 0));
    const h = Math.max(0, Math.min(r.bottom, vh) - Math.max(r.top, 0));
    return (w * h) / (vw * vh);
  };
  const texteDe = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const chemin = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) return `${s}#${el.id}`;
    const cl = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)[0];
    return cl ? `${s}.${cl}` : s;
  };

  const h1 = [...document.querySelectorAll('h1')].find(visible) || document.querySelector('h1');
  // Mots visibles au-dessus du pli (nœuds texte dont le rectangle croise l'écran).
  let mots = 0;
  const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
  let n;
  let compteur = 0;
  while ((n = walker.nextNode()) && compteur++ < 20000) {
    const t = n.nodeValue.trim();
    if (!t || !n.parentElement) continue;
    const tag = n.parentElement.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'NOSCRIPT' || tag === 'TEMPLATE') continue;
    if (!visible(n.parentElement)) continue;
    const rg = document.createRange();
    rg.selectNodeContents(n);
    const r = rg.getBoundingClientRect();
    if (r.bottom <= 0 || r.top >= vh || r.width === 0) continue;
    mots += t.split(/\s+/).length;
  }

  // Média plein écran : img / video / canvas / fond en image couvrant >= 60 % de l'écran.
  let mediaPleinEcran = null;
  let images = 0;
  const estFondImage = (cs) => /url\(/.test(cs.backgroundImage);
  for (const el of document.body.querySelectorAll('img, video, canvas, picture, div, section, header, figure, span, a')) {
    if (!visible(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.top >= vh || r.bottom <= 0) continue;
    const tag = el.tagName.toLowerCase();
    const cs = getComputedStyle(el);
    const estMedia = tag === 'img' || tag === 'video' || tag === 'canvas' || (tag !== 'picture' && estFondImage(cs));
    if (!estMedia) continue;
    if (tag === 'img' || estFondImage(cs)) images++;
    const c = inter(r);
    if (c >= 0.6 && (!mediaPleinEcran || c > mediaPleinEcran.couverture)) {
      mediaPleinEcran = { type: tag === 'video' ? 'vidéo' : tag === 'canvas' ? 'canvas' : tag === 'img' ? 'image' : 'fond en image', couverture: Math.round(c * 100) / 100, selecteur: chemin(el) };
    }
  }

  // Bouton principal : premier élément « bouton » du premier écran hors nav/header, sinon dans la nav.
  const estBouton = (el) => {
    const tag = el.tagName.toLowerCase();
    if (tag === 'button' || (tag === 'input' && /submit|button/.test(el.type))) return true;
    if (tag !== 'a') return false;
    const cs = getComputedStyle(el);
    const cl = (el.getAttribute('class') || '').toLowerCase();
    return /btn|button|cta/.test(cl) || el.getAttribute('role') === 'button' || (cs.backgroundColor !== 'rgba(0, 0, 0, 0)' && parseFloat(cs.paddingLeft) >= 8) || (parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.paddingLeft) >= 8);
  };
  const estFixe = (el) => {
    for (let e = el; e && e !== document.body; e = e.parentElement) {
      const p = getComputedStyle(e).position;
      if (p === 'fixed' || p === 'sticky') return true;
    }
    return false;
  };
  let boutonPrincipal = null;
  let boutonNav = null;
  for (const el of document.body.querySelectorAll('a, button, input')) {
    if (!visible(el) || !estBouton(el)) continue;
    const r = el.getBoundingClientRect();
    if (r.top >= vh || r.bottom <= 0 || r.left >= vw) continue;
    const texte = texteDe(el) || el.getAttribute('aria-label') || el.value || '';
    if (!texte) continue;
    const b = { texte: texte.slice(0, 60), x: r.left, y: r.top, cx: (r.left + r.width / 2) / vw, cy: (r.top + r.height / 2) / vh, fixe: estFixe(el), dansNav: Boolean(el.closest('nav, header')) };
    if (b.dansNav) {
      if (!boutonNav) boutonNav = b;
    } else if (!boutonPrincipal) boutonPrincipal = b;
    if (boutonPrincipal) break;
  }

  // Couche bloquante et bannière cookies : élément fixe/absolu visible, texte du calque lu, couverture mesurée.
  let coucheBloquante = null;
  let cookie = null;
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    if (cs.position !== 'fixed' && cs.position !== 'absolute' && cs.position !== 'sticky') continue;
    const r = el.getBoundingClientRect();
    const c = inter(r);
    if (c < 0.02) continue;
    const texte = texteDe(el).slice(0, 200);
    const estCookie = /cookie|consent|consentement|accepter|accept all|j'accepte|rgpd|gdpr|privacy/i.test(texte) || /cookie|consent|gdpr/i.test(`${el.id} ${el.className}`);
    const z = Number(cs.zIndex) || 0;
    if (estCookie && (!cookie || c > cookie.couverture)) cookie = { couverture: Math.round(c * 100) / 100, texte, selecteur: chemin(el) };
    // Un calque qui bloque : au-dessus du contenu (z-index > 0 ou fixe), couvre plus de la moitié de l'écran,
    // et ce n'est pas simplement le hero (il porte un texte de consentement/âge/newsletter ou un fond opaque
    // posé par-dessus un contenu déjà présent).
    const opaque = !/rgba\(.*, 0\)$/.test(cs.backgroundColor) && cs.backgroundColor !== 'transparent';
    const motif = estCookie || /âge|age verification|18 ans|newsletter|inscri|subscribe|popup|modal|overlay/i.test(`${texte} ${el.id} ${el.className}`);
    if (c > 0.5 && (cs.position === 'fixed' || z >= 10) && (motif || (opaque && z >= 100)) && (!coucheBloquante || c > coucheBloquante.couverture)) {
      coucheBloquante = { couverture: Math.round(c * 100) / 100, texte, selecteur: chemin(el), cookie: estCookie };
    }
  }

  // Barre fixe en bas (barre d'actions type Délice) : élément dans un calque fixe (lui-même ou un ancêtre :
  // sur téléphone, la barre de Délice est un bloc statique dans l'en-tête fixe), collé au bas de l'écran.
  let barreBas = null;
  for (const el of document.body.querySelectorAll('*')) {
    if (!visible(el) || !estFixe(el)) continue;
    const r = el.getBoundingClientRect();
    // Collée au bas (bottom au ras de l'écran), pas un calque plein écran (top dans la moitié basse), assez
    // large (>= 40 % de l'écran : la barre de Délice fait 720 px sur 1440) et basse (<= 220 px, deux rangées sur téléphone).
    if (r.bottom < vh - 4 || r.top < vh * 0.5 || r.width < vw * 0.4 || r.height > 220) continue;
    // Liens réellement dans la barre (un menu replié « Obtenir l'itinéraire » est dans le DOM mais hors écran).
    const liens = [...el.querySelectorAll('a, button')].filter((a) => {
      if (!visible(a)) return false;
      const q = a.getBoundingClientRect();
      return q.top >= r.top - 2 && q.bottom <= vh + 2 && q.left >= -2 && q.right <= vw + 2;
    }).map((a) => ({ texte: texteDe(a).slice(0, 40), href: a.getAttribute('href') || '' })).filter((l) => l.texte);
    if (liens.length >= 2 && (!barreBas || liens.length > barreBas.liens.length)) barreBas = { selecteur: chemin(el), hauteur: Math.round(r.height), largeur: Math.round(r.width), liens: liens.slice(0, 8) };
  }

  // Fond effectif derrière le h1 (le corps peut être crème et le premier écran rouge : Délice).
  const hexDe = (txt) => {
    const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(txt || '');
    if (!m || (m[4] !== undefined && Number(m[4]) < 0.5)) return null;
    const c = (v) => Math.round(Number(v)).toString(16).padStart(2, '0');
    return `#${c(m[1])}${c(m[2])}${c(m[3])}`;
  };
  let fondPremierEcran = null;
  for (let e = h1; e; e = e.parentElement) {
    const bg = hexDe(getComputedStyle(e).backgroundColor);
    if (bg) {
      fondPremierEcran = bg;
      break;
    }
  }
  if (!fondPremierEcran) {
    const sous = document.elementFromPoint(vw / 2, vh / 2);
    for (let e = sous; e; e = e.parentElement) {
      const bg = hexDe(getComputedStyle(e).backgroundColor);
      if (bg) {
        fondPremierEcran = bg;
        break;
      }
    }
  }

  return {
    fondPremierEcran,
    h1: h1 ? texteDe(h1).slice(0, 300) : null,
    h1Visible: Boolean(h1 && visible(h1)),
    mots,
    images,
    mediaPleinEcran,
    boutonPrincipal: boutonPrincipal || boutonNav,
    coucheBloquante,
    cookie,
    barreBas,
    scrollHeight: document.documentElement.scrollHeight,
  };
}

/**
 * Instantané de position des éléments visibles à l'écran (transform + rectangle), à prendre deux fois sans
 * rien toucher : ce qui a changé entre les deux « bouge tout seul » (bandeau qui défile, carrousel autoplay,
 * canvas qui ondule). GOUT § 4 : rien ne tourne tout seul.
 */
function instantanePositions({ vw, vh }) {
  /* eslint-disable no-undef */
  const out = [];
  const tous = [...document.body.querySelectorAll('*')].slice(0, 4000);
  const index = new Map(tous.map((el, k) => [el, k]));
  for (const [k, el] of tous.entries()) {
    const tag = el.tagName;
    if (tag === 'SCRIPT' || tag === 'STYLE' || tag === 'SVG' || el.closest('svg')) continue;
    const r = el.getBoundingClientRect();
    if (r.width === 0 || r.height === 0 || r.bottom < 0 || r.top > vh || r.right < 0 || r.left > vw) continue;
    let s = el.tagName.toLowerCase();
    if (el.id) s += `#${el.id}`;
    else {
      const cl = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)[0];
      if (cl) s += `.${cl}`;
    }
    out.push({ i: k, chemin: s, cle: `${getComputedStyle(el).transform}|${Math.round(r.left)}|${Math.round(r.top)}|${Math.round(r.width)}`, parent: el.parentElement ? (index.get(el.parentElement) ?? -1) : -1 });
  }
  return out;
}

/** Diff pur de deux instantanés : éléments dont la clé a changé, sans leurs descendants (le parent suffit). */
export function elementsQuiBougent(avant, apres, max = 6) {
  const a = new Map((avant || []).map((e) => [e.i, e]));
  const bouges = new Map();
  for (const e of apres || []) {
    const prev = a.get(e.i);
    if (prev && prev.cle !== e.cle) bouges.set(e.i, e);
  }
  const racines = [...bouges.values()].filter((e) => !bouges.has(e.parent));
  return { n: racines.length, exemples: [...new Set(racines.map((e) => e.chemin))].slice(0, max) };
}

/** Phase « complète » : après défilement — typo, couleurs, mouvement, structure, signes. */
function collecterComplet({ vw, vh, hote }) {
  /* eslint-disable no-undef */
  const visible = (el) => {
    if (!el || el.nodeType !== 1) return false;
    const cs = getComputedStyle(el);
    if (cs.display === 'none' || cs.visibility === 'hidden') return false;
    const r = el.getBoundingClientRect();
    return r.width > 0 && r.height > 0;
  };
  const texteDe = (el) => (el.innerText || el.textContent || '').replace(/\s+/g, ' ').trim();
  const chemin = (el) => {
    let s = el.tagName.toLowerCase();
    if (el.id) return `${s}#${el.id}`;
    const cl = (el.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean)[0];
    return cl ? `${s}.${cl}` : s;
  };
  const SAUT = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'TEMPLATE', 'SVG', 'PATH', 'G', 'DEFS', 'USE', 'SYMBOL', 'CLIPPATH', 'LINEARGRADIENT', 'STOP', 'RECT', 'CIRCLE', 'POLYGON', 'LINE', 'POLYLINE', 'ELLIPSE']);
  const pageW = document.documentElement.scrollWidth || vw;

  // ---- identité ----
  const meta = (n) => document.querySelector(`meta[name="${n}"], meta[property="${n}"]`)?.getAttribute('content') || '';
  const html = document.documentElement.outerHTML;
  const technologies = [];
  const gen = meta('generator');
  if (gen) technologies.push(`generator « ${gen.slice(0, 60)} »`);
  const tech = [
    ['WordPress', /wp-content|wp-includes/i], ['Shopify', /cdn\.shopify\.com|Shopify\.theme/i], ['Webflow', /webflow\.js|data-wf-page/i], ['Squarespace', /squarespace\.com|static1\.squarespace/i],
    ['Wix', /static\.wixstatic|wix\.com/i], ['Framer', /framerusercontent|data-framer/i], ['Next.js', /__NEXT_DATA__|\/_next\//i], ['Nuxt', /__NUXT__|\/_nuxt\//i], ['Astro', /astro-island|data-astro/i],
    ['Gatsby', /___gatsby/i], ['Hugo', /generator" content="Hugo/i], ['Drupal', /drupal-settings-json|\/sites\/default\/files/i], ['Joomla', /\/media\/jui\//i], ['Prismic', /prismic\.io/i], ['Sanity', /cdn\.sanity\.io/i],
    ['Swup', /swup/i], ['Locomotive (data-module)', /data-module-/i], ['Tailwind', /tailwindcss|class="[^"]*\b(?:md|lg):[a-z-]+/i], ['jQuery', /jquery/i],
  ];
  for (const [nomT, re] of tech) if (re.test(html) && !technologies.some((t) => t.startsWith(nomT))) technologies.push(nomT);
  const identite = { title: document.title, siteName: meta('og:site_name') || meta('application-name') || '', lang: document.documentElement.lang, description: meta('description') || meta('og:description'), technologies };

  // ---- typographie ----
  const lireTypo = (el) => {
    const cs = getComputedStyle(el);
    const taille = parseFloat(cs.fontSize);
    const lh = parseFloat(cs.lineHeight);
    return {
      selecteur: chemin(el), famille: cs.fontFamily, taille, graisse: cs.fontWeight, interlignage: lh && taille ? Math.round((lh / taille) * 100) / 100 : null,
      italique: cs.fontStyle === 'italic', transform: cs.textTransform, interlettrage: cs.letterSpacing,
    };
  };
  const premierVisible = (sel) => [...document.querySelectorAll(sel)].find(visible);
  const pLePlusLong = () => {
    let best = null;
    for (const p of document.querySelectorAll('p')) {
      if (!visible(p)) continue;
      const l = texteDe(p).length;
      if (!best || l > best.l) best = { p, l };
    }
    return best?.p;
  };
  const SEL_BOUTON = 'button, input[type="submit"], a[role="button"], a[class*="btn"], a[class*="button"], a[class*="cta"], a[class*="Button"]';
  const typographie = {
    h1: premierVisible('h1') ? lireTypo(premierVisible('h1')) : null,
    h2: premierVisible('h2') ? lireTypo(premierVisible('h2')) : null,
    p: pLePlusLong() ? lireTypo(pLePlusLong()) : null,
    bouton: premierVisible(SEL_BOUTON) ? lireTypo(premierVisible(SEL_BOUTON)) : null,
    // Nav : le réglage le plus fréquent parmi les liens visibles (le premier lien est souvent le sélecteur de langue à 10 px).
    nav: (() => {
      const liens = [...document.querySelectorAll('nav a, header a')].filter(visible).slice(0, 30).map(lireTypo);
      if (!liens.length) return null;
      const compte = new Map();
      for (const t of liens) {
        const k = `${t.famille}|${t.taille}`;
        compte.set(k, (compte.get(k) || 0) + 1);
      }
      const meilleur = [...compte.entries()].sort((a, b) => b[1] - a[1])[0][0];
      return liens.find((t) => `${t.famille}|${t.taille}` === meilleur);
    })(),
    fontFaces: [],
    fontFacesNonLisibles: [],
    fichiersPolices: [],
    famillesVisibles: [],
  };
  for (const feuille of document.styleSheets) {
    let regles;
    try {
      regles = feuille.cssRules;
    } catch {
      try {
        typographie.fontFacesNonLisibles.push(new URL(feuille.href).hostname);
      } catch { /* feuille inline sans href */ }
      continue;
    }
    const parcourir = (liste) => {
      for (const r of liste) {
        if (r.type === 5 || r.constructor.name === 'CSSFontFaceRule') {
          const famille = (r.style.getPropertyValue('font-family') || '').replace(/^["']|["']$/g, '');
          const src = r.style.getPropertyValue('src') || '';
          const url = /url\(["']?([^"')]+)/.exec(src)?.[1] || '';
          typographie.fontFaces.push({ famille, url: url.slice(0, 160), feuille: feuille.href ? new URL(feuille.href).hostname : 'inline' });
        } else if (r.cssRules) parcourir(r.cssRules);
      }
    };
    parcourir(regles);
  }
  try {
    for (const e of performance.getEntriesByType('resource')) {
      if (/\.(woff2?|ttf|otf|eot)(\?|#|$)/i.test(e.name) || /fonts\.gstatic\.com|use\.typekit\.net/.test(e.name)) typographie.fichiersPolices.push(e.name);
    }
  } catch { /* ignore */ }
  for (const l of document.querySelectorAll('link[href*="fonts.googleapis.com"], link[href*="typekit.net"], link[href*="fonts.bunny.net"]')) typographie.fichiersPolices.push(l.href);
  typographie.fichiersPolices = [...new Set(typographie.fichiersPolices)].slice(0, 30);

  // ---- boucle unique sur les éléments visibles : couleurs, mouvement, familles, pilules, « X ans » ----
  const fonds = new Map();
  const textes = new Map();
  const familles = new Map();
  const courbes = new Map();
  const attributs = new Map();
  const bgEffectif = new WeakMap();
  const stickyLongs = [];
  let animationTimeline = 0;
  let plusAnime = null;
  let nbFondsImage = 0;
  let masques = 0;
  const pilules = { boutons: 0, pilules: 0, exemples: [] };
  const ans = [];
  const bibliothequesDom = new Set();
  const tous = document.body.querySelectorAll('*');
  const MAX = 8000;
  let i = 0;
  const bgDe = (el) => (bgEffectif.has(el) ? bgEffectif.get(el) : null);
  const hexDe = (txt) => {
    const m = /rgba?\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)\s*(?:,\s*([\d.]+)\s*)?\)/.exec(txt || '');
    if (!m) return null;
    if (m[4] !== undefined && Number(m[4]) < 0.5) return null;
    const c = (v) => Math.round(Number(v)).toString(16).padStart(2, '0');
    return `#${c(m[1])}${c(m[2])}${c(m[3])}`;
  };
  const htmlBg = hexDe(getComputedStyle(document.documentElement).backgroundColor);
  const bodyCs = getComputedStyle(document.body);
  const bodyBg = hexDe(bodyCs.backgroundColor) || htmlBg || '#ffffff';
  bgEffectif.set(document.body, bodyBg);
  fonds.set(bodyBg, { hex: bodyBg, n: 1, poids: pageW * document.documentElement.scrollHeight });

  for (const el of tous) {
    if (i++ > MAX) break;
    if (SAUT.has(el.tagName)) continue;
    if (!visible(el)) continue;
    const cs = getComputedStyle(el);
    const r = el.getBoundingClientRect();
    const parentBg = bgDe(el.parentElement) || bodyBg;
    const bg = hexDe(cs.backgroundColor);
    bgEffectif.set(el, bg || parentBg);
    if (bg && bg !== parentBg) {
      const aire = Math.min(r.width, pageW) * r.height;
      const cur = fonds.get(bg) || { hex: bg, n: 0, poids: 0 };
      cur.n++;
      cur.poids += aire;
      fonds.set(bg, cur);
    }
    if (/url\(/.test(cs.backgroundImage)) nbFondsImage++;
    if ((cs.maskImage && cs.maskImage !== 'none') || (cs.webkitMaskImage && cs.webkitMaskImage !== 'none') || (cs.clipPath && cs.clipPath !== 'none')) masques++;
    // Texte direct de l'élément : couleur pondérée par les caractères, famille comptée.
    let chars = 0;
    for (const nd of el.childNodes) if (nd.nodeType === 3) chars += nd.nodeValue.trim().length;
    if (chars > 0) {
      const col = hexDe(cs.color);
      if (col) {
        const cur = textes.get(col) || { hex: col, n: 0, poids: 0 };
        cur.n++;
        cur.poids += chars;
        textes.set(col, cur);
      }
      const fam = cs.fontFamily.split(',')[0].trim().replace(/^["']|["']$/g, '');
      familles.set(fam, (familles.get(fam) || 0) + 1);
      const taille = parseFloat(cs.fontSize);
      if (taille >= 28) {
        const t = texteDe(el).slice(0, 80);
        const m = /\b(\d{1,3})\s*(ans|years|années|jaar|anni|años)\b/i.exec(t) || /\b(depuis|since|est\.?|dal|desde)\s+((?:18|19|20)\d{2})\b/i.exec(t);
        if (m) ans.push({ texte: t, taille: Math.round(taille), selecteur: chemin(el) });
      }
    }
    // Mouvement : transitions et animations calculées.
    const durs = cs.transitionDuration.split(',').map((s) => s.trim());
    const props = cs.transitionProperty.split(',').map((s) => s.trim());
    const tfs = cs.transitionTimingFunction.split(/,(?![^(]*\))/).map((s) => s.trim());
    const transitions = [];
    durs.forEach((d, k) => {
      if (!d || d === '0s') return;
      const v = `${props[k % props.length]} ${d} ${tfs[k % tfs.length]}`;
      transitions.push(v);
      courbes.set(v, (courbes.get(v) || 0) + 1);
    });
    const animations = [];
    if (cs.animationName && cs.animationName !== 'none') {
      const noms = cs.animationName.split(',').map((s) => s.trim());
      const ad = cs.animationDuration.split(',').map((s) => s.trim());
      const atf = cs.animationTimingFunction.split(/,(?![^(]*\))/).map((s) => s.trim());
      const ai = cs.animationIterationCount.split(',').map((s) => s.trim());
      noms.forEach((nm, k) => {
        const v = `animation ${nm} ${ad[k % ad.length]} ${atf[k % atf.length]}${ai[k % ai.length] === 'infinite' ? ' infinite' : ''}`;
        animations.push(v);
        courbes.set(v, (courbes.get(v) || 0) + 1);
      });
    }
    if (cs.animationTimeline && cs.animationTimeline !== 'auto' && cs.animationTimeline !== 'none') animationTimeline++;
    const attrsMouvement = [...el.attributes].map((a) => a.name).filter((n) => n.startsWith('data-') && /scroll|parallax|reveal|module|animat|aos|motion|speed|split|pin|sticky|marquee|cursor|lenis|gsap|bulge|curved|canvas|webgl/.test(n));
    const score = animations.length * 3 + transitions.length + attrsMouvement.length * 2;
    if (score > 0 && (!plusAnime || score > plusAnime.score)) plusAnime = { selecteur: chemin(el), score, animations, transitions, attributs: attrsMouvement };
    if (cs.position === 'sticky' && el.parentElement) {
      const ph = el.parentElement.getBoundingClientRect().height;
      if (ph > vh * 1.2) stickyLongs.push({ selecteur: chemin(el), ecrans: Math.round((ph / vh) * 10) / 10 });
    }
    for (const a of el.attributes) {
      if (a.name.startsWith('data-') && /scroll|parallax|reveal|module|animat|aos|motion|speed|split|pin|sticky|marquee|cursor|lenis|gsap/.test(a.name)) attributs.set(a.name, (attributs.get(a.name) || 0) + 1);
      if (a.name === 'data-scroll' || a.name.startsWith('data-scroll-')) bibliothequesDom.add('Locomotive Scroll (attribut data-scroll)');
      if (a.name === 'data-aos') bibliothequesDom.add('AOS (attribut data-aos)');
    }
    // Pilules : éléments « bouton ».
    const tag = el.tagName.toLowerCase();
    const cl = (el.getAttribute('class') || '').toLowerCase();
    const estBouton = tag === 'button' || (tag === 'input' && /submit|button/.test(el.type)) || (tag === 'a' && (/btn|button|cta/.test(cl) || el.getAttribute('role') === 'button' || (bg && bg !== parentBg && parseFloat(cs.paddingLeft) >= 8) || (parseFloat(cs.borderTopWidth) > 0 && parseFloat(cs.paddingLeft) >= 8)));
    if (estBouton && r.height >= 20 && r.height <= 120) {
      pilules.boutons++;
      const rayon = parseFloat(cs.borderTopLeftRadius) || 0;
      if (rayon >= r.height / 2 && r.width > r.height) {
        pilules.pilules++;
        if (pilules.exemples.length < 3) pilules.exemples.push(texteDe(el).slice(0, 30));
      }
    }
  }
  const top = (map, k) => [...map.values()].sort((a, b) => b.poids - a.poids).slice(0, k);
  const couleurs = {
    fond: bodyBg,
    texte: hexDe(bodyCs.color),
    fondsBruts: top(fonds, 12),
    textesBruts: top(textes, 12),
    nbImages: [...document.images].filter((im) => visible(im) && im.getBoundingClientRect().width >= 48).length,
    nbVideos: [...document.querySelectorAll('video')].filter(visible).length,
    nbFondsImage,
    masques,
  };
  typographie.famillesVisibles = [...familles.entries()].map(([famille, n]) => ({ famille, n })).sort((a, b) => b.n - a.n);
  for (const f of typographie.fontFaces) f.source = f.url ? (/^data:/.test(f.url) ? 'inline (data:)' : f.url) : 'locale';

  // ---- bibliothèques ----
  const bibliotheques = [];
  const globales = [
    ['GSAP', ['gsap', 'TweenMax', 'TweenLite']], ['ScrollTrigger', ['ScrollTrigger']], ['Lenis', ['Lenis', 'lenis']], ['Locomotive Scroll', ['LocomotiveScroll', 'locomotive']], ['Swiper', ['Swiper']], ['Flickity', ['Flickity']],
    ['Swup', ['Swup', 'swup']], ['Barba', ['barba']], ['jQuery', ['jQuery']], ['Webflow', ['Webflow']], ['Three.js', ['THREE']], ['Lottie', ['lottie', 'bodymovin']], ['AOS', ['AOS']], ['ScrollReveal', ['ScrollReveal']], ['Splide', ['Splide']],
    ['Alpine', ['Alpine']], ['React', ['React', '__NEXT_DATA__']], ['Vue', ['Vue', '__NUXT__']], ['Shopify', ['Shopify']], ['Framer Motion', ['FramerMotion', '__framer_importFromPackage']],
  ];
  for (const [nomB, cles] of globales) {
    const cle = cles.find((k) => { try { return window[k] !== undefined; } catch { return false; } });
    if (cle) bibliotheques.push({ nom: nomB, preuve: `window.${cle}` });
  }
  const scripts = [...document.scripts].map((s) => s.src).filter(Boolean);
  try { for (const e of performance.getEntriesByType('resource')) if (e.initiatorType === 'script' || /\.m?js(\?|$)/.test(e.name)) scripts.push(e.name); } catch { /* ignore */ }
  const motifs = [['GSAP', /gsap/i], ['ScrollTrigger', /scrolltrigger/i], ['Lenis', /lenis/i], ['Locomotive Scroll', /locomotive/i], ['Swiper', /swiper/i], ['Framer Motion', /framer-motion|framer/i], ['Flickity', /flickity/i], ['Splide', /splide/i], ['Slick', /slick/i], ['AOS', /\baos\b/i], ['ScrollReveal', /scrollreveal/i], ['Three.js', /three(\.min)?\.js|three\.module/i], ['Lottie', /lottie|bodymovin/i], ['Barba', /barba/i], ['Swup', /swup/i], ['Alpine', /alpine/i], ['Motion One', /motion\.(min\.)?js|@motionone/i]];
  for (const [nomB, re] of motifs) {
    if (bibliotheques.some((b) => b.nom === nomB)) continue;
    const src = scripts.find((s) => re.test(s.split('/').pop() || s));
    if (src) bibliotheques.push({ nom: nomB, preuve: `script ${src.split('/').pop().split('?')[0].slice(0, 50)}` });
  }
  for (const b of bibliothequesDom) if (!bibliotheques.some((x) => b.startsWith(x.nom))) bibliotheques.push({ nom: b.split(' (')[0], preuve: b.split(' (')[1].replace(')', '') });
  const mouvement = {
    bibliotheques,
    scrollTrigger: bibliotheques.some((b) => b.nom === 'ScrollTrigger'),
    animationTimeline,
    stickyLongs: stickyLongs.slice(0, 10),
    courbes: [...courbes.entries()].map(([valeur, n]) => ({ valeur, n })).sort((a, b) => b.n - a.n).slice(0, 10),
    attributs: [...attributs.entries()].map(([nom, n]) => ({ nom, n })).sort((a, b) => b.n - a.n).slice(0, 10),
    plusAnime,
  };

  // ---- structure : on descend dans l'enfant qui porte la page (> 85 % de sa hauteur) tant qu'il y en a un,
  // en gardant ses frères dans le flux (header, footer) avant/après ; les calques fixes (en-tête fixe, barre
  // d'actions, overlay, outils de dev) sont listés à part. ----
  const docH = document.documentElement.scrollHeight;
  const horsFlux = (e) => /^(fixed|absolute|sticky)$/.test(getComputedStyle(e).position);
  const calquesFixes = [];
  let conteneur = document.body;
  let avant = [];
  let apres = [];
  for (let k = 0; k < 10; k++) {
    const enfants = [...conteneur.children].filter((e) => visible(e) && !SAUT.has(e.tagName));
    for (const e of enfants) {
      if (!horsFlux(e)) continue;
      const r = e.getBoundingClientRect();
      const t = texteDe(e);
      calquesFixes.push({ selecteur: chemin(e), position: getComputedStyle(e).position, hauteur: Math.round(r.height), largeur: Math.round(r.width), enBas: r.bottom >= vh - 4 && r.top > vh * 0.5, mots: t ? t.split(/\s+/).length : 0 });
    }
    const flux = enfants.filter((e) => !horsFlux(e));
    const gros = flux.filter((e) => e.getBoundingClientRect().height > docH * 0.85);
    if (gros.length !== 1 || gros[0].children.length === 0) break;
    const i = flux.indexOf(gros[0]);
    avant = [...avant, ...flux.slice(0, i)];
    apres = [...flux.slice(i + 1), ...apres];
    conteneur = gros[0];
  }
  const RARES = new Set(['table', 'dl', 'details', 'canvas', 'video', 'svg', 'form', 'iframe', 'ol', 'blockquote', 'marquee', 'dialog', 'audio', 'select', 'progress', 'meter', 'time', 'address']);
  const sections = [];
  const liste = [...avant, ...[...conteneur.children].filter((e) => visible(e) && !SAUT.has(e.tagName) && !horsFlux(e)), ...apres];
  // Sélecteur parlant : id, sinon une classe que les frères n'ont pas tous (« o-section » est partagée par
  // toutes les sections de Délice ; « c-hero » ou « c-callout » distinguent).
  const classesDe = (e) => (e.getAttribute('class') || '').trim().split(/\s+/).filter(Boolean);
  const compteClasses = new Map();
  for (const e of liste) for (const c of new Set(classesDe(e))) compteClasses.set(c, (compteClasses.get(c) || 0) + 1);
  const selecteurParlant = (e) => {
    const tag = e.tagName.toLowerCase();
    if (e.id) return `${tag}#${e.id}`;
    const cls = classesDe(e);
    const rare = cls.find((c) => compteClasses.get(c) <= Math.max(1, Math.floor(liste.length / 3)) && !/^(is-|has-|js-|u-)/.test(c));
    return cls.length ? `${tag}.${rare || cls[0]}` : tag;
  };
  for (const e of liste) {
    const r = e.getBoundingClientRect();
    const cs = getComputedStyle(e);
    const texte = texteDe(e);
    const mots = texte ? texte.split(/\s+/).length : 0;
    if (r.height < 24 && mots === 0) continue;
    const imgs = [...e.querySelectorAll('img, video, picture')].filter(visible).length;
    const balises = new Set([...e.querySelectorAll('*')].map((x) => x.tagName.toLowerCase()));
    const titreEl = [...e.querySelectorAll('h1, h2, h3')].find(visible);
    sections.push({
      selecteur: selecteurParlant(e), titre: titreEl ? texteDe(titreEl).slice(0, 60) : null,
      top: Math.round(r.top + scrollY), hauteur: Math.round(r.height), ecrans: Math.round((r.height / vh) * 10) / 10, mots, images: imgs,
      fixe: cs.position === 'fixed' || cs.position === 'sticky', balisesRares: [...balises].filter((t) => RARES.has(t)),
    });
    if (sections.length >= 40) break;
  }
  const lireLiens = (racine) => [...racine.querySelectorAll('a[href], button')].filter(visible).map((a) => {
    const cs = getComputedStyle(a);
    const cl = (a.getAttribute('class') || '').toLowerCase();
    const bouton = a.tagName === 'BUTTON' || /btn|button|cta/.test(cl) || a.getAttribute('role') === 'button' || (hexDe(cs.backgroundColor) && hexDe(cs.backgroundColor) !== (bgDe(a.parentElement) || bodyBg)) || parseFloat(cs.borderTopWidth) > 0;
    return { texte: (texteDe(a) || a.getAttribute('aria-label') || '').slice(0, 40), href: (a.getAttribute('href') || '').slice(0, 120), bouton: Boolean(bouton) };
  }).filter((l) => l.texte);
  const navEl = [...document.querySelectorAll('header, nav, [role="banner"], [role="navigation"]')].find(visible);
  const piedEl = [...document.querySelectorAll('footer, [role="contentinfo"]')].filter(visible).pop();
  const tels = [...document.querySelectorAll('a[href^="tel:"]')];
  const forms = [...document.querySelectorAll('form')].filter(visible);
  const corps = texteDe(document.body);
  // Horaires : au moins 3 jours distincts ET 2 heures dans le texte visible (Délice liste les 7 jours puis les
  // créneaux par service, à plus de 80 caractères du nom du jour : une fenêtre courte les rate).
  const jours = new Set((corps.match(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday|maandag|dinsdag|lunedì|martedì)\b/gi) || []).map((j) => j.toLowerCase()));
  const reHeure = /\b\d{1,2}\s?[h:]\s?\d{2}\b|\b\d{1,2}\s?h\b|\b\d{1,2}\s?(?:am|pm)\b/i;
  const heures = corps.match(new RegExp(reHeure.source, 'gi')) || [];
  // Extrait : la première heure qui suit le premier nom de jour (pas le bandeau promo du haut).
  const premierJour = corps.search(/\b(lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);
  const apresJour = premierJour >= 0 ? corps.slice(premierJour) : corps;
  const premiereHeure = apresJour.search(reHeure);
  const hor = jours.size >= 3 && heures.length >= 2 ? { jours: jours.size, heures: heures.length, extrait: premiereHeure >= 0 ? apresJour.slice(Math.max(0, premiereHeure - 60), premiereHeure + 40) : apresJour.slice(0, 100) } : null;
  const portes = [];
  const vus = new Set();
  for (const a of document.querySelectorAll('a[href], button')) {
    if (!visible(a)) continue;
    const t = texteDe(a).slice(0, 40);
    if (!/réserv|reserv|book|commande|order|cadeau|gift|devis|quote|rendez|appointment|prendre rdv|livraison|delivery|menu/i.test(t)) continue;
    const cle = t.toLowerCase();
    if (vus.has(cle)) continue;
    vus.add(cle);
    portes.push({ texte: t, href: (a.getAttribute('href') || '').slice(0, 100) });
    if (portes.length >= 10) break;
  }
  const structure = {
    conteneur: chemin(conteneur),
    sections,
    nav: navEl ? { selecteur: chemin(navEl), hauteur: Math.round(navEl.getBoundingClientRect().height), position: getComputedStyle(navEl).position, liens: lireLiens(navEl).slice(0, 20) } : null,
    pied: piedEl ? { selecteur: chemin(piedEl), liens: lireLiens(piedEl).slice(0, 30) } : null,
    telephone: { n: tels.length, href: tels[0]?.getAttribute('href') || null },
    formulaires: { n: forms.length, champs: forms[0] ? forms[0].querySelectorAll('input:not([type="hidden"]), textarea, select').length : 0 },
    horaires: { trouve: Boolean(hor), jours: hor?.jours ?? 0, heures: hor?.heures ?? 0, extrait: hor ? hor.extrait.slice(0, 120) : null },
    portes,
    calquesFixes: calquesFixes.slice(0, 10),
  };
  const signes = { pilules, ans: ans.slice(0, 5) };
  return { identite, typographie, couleurs, mouvement, structure, signes };
}

// ---------------------------------------------------------------------------------------------
// Côté Node.
// ---------------------------------------------------------------------------------------------

/** La page refuse-t-elle les navigateurs sans tête (Cloudflare, captcha, 403) ? Retourne la raison ou null. */
export function raisonBlocage({ statut, title, texte }) {
  if (statut && statut >= 400) return `réponse HTTP ${statut}`;
  const t = `${title || ''} ${texte || ''}`;
  if (/just a moment|attention required|access denied|verify you are human|are you a robot|captcha|checking your browser|cloudflare ray id|please enable javascript and cookies/i.test(t)) return `page de défi (${(title || '').slice(0, 60) || 'captcha'})`;
  if ((texte || '').trim().length < 40 && !/./.test(title || '')) return 'page vide (aucun texte ni titre rendu)';
  return null;
}

async function defilerLentement(page) {
  const h = await page.evaluate(() => document.documentElement.scrollHeight);
  const pas = 400;
  for (let y = 0; y < Math.min(h, 40_000); y += pas) {
    await page.evaluate((yy) => window.scrollTo(0, yy), y);
    await page.waitForTimeout(80);
  }
  await page.evaluate(() => window.scrollTo(0, document.documentElement.scrollHeight));
  await page.waitForTimeout(400);
  await page.evaluate(() => window.scrollTo(0, 0));
  await page.waitForTimeout(400);
}

async function demonterVue(navigateur, url, cle, { sharp, capturesDir, nom, hote }) {
  const V = VUES[cle];
  const ctx = await navigateur.newContext({ viewport: { width: V.vw, height: V.vh }, deviceScaleFactor: 1, isMobile: V.mobile, hasTouch: V.mobile, acceptDownloads: false, locale: 'fr-FR' });
  const page = await ctx.newPage();
  await page.addInitScript(() => Object.defineProperty(navigator, 'webdriver', { get: () => false }));
  const erreurs = [];
  page.on('pageerror', (e) => erreurs.push(e.message));
  try {
    let statut = null;
    try {
      const rep = await page.goto(url, { waitUntil: 'load', timeout: TIMEOUT_MS });
      statut = rep ? rep.status() : null;
    } catch (e) {
      const texte = await page.evaluate(() => document.body?.innerText || '').catch(() => '');
      if (!texte.trim()) throw new Error(`la page n'a pas répondu en ${TIMEOUT_MS / 1000} s (${e.message.split('\n')[0]})`);
      warn(`${cle} : chargement incomplet après ${TIMEOUT_MS / 1000} s, mesures sur ce qui est rendu.`);
    }
    await page.waitForTimeout(1500);
    const etat = await page.evaluate(() => ({ title: document.title, texte: (document.body?.innerText || '').slice(0, 2000) }));
    const blocage = raisonBlocage({ statut, ...etat });
    if (blocage) throw Object.assign(new Error(`le site bloque les navigateurs sans tête : ${blocage}`), { bloque: true });

    const arrivee = await page.evaluate(collecterArrivee, { vw: V.vw, vh: V.vh });
    const pos1 = await page.evaluate(instantanePositions, { vw: V.vw, vh: V.vh });
    await page.waitForTimeout(700);
    const pos2 = await page.evaluate(instantanePositions, { vw: V.vw, vh: V.vh });
    arrivee.bougeSeul = elementsQuiBougent(pos1, pos2);
    const png = await page.screenshot({ type: 'png' });
    await sharp(png).webp({ quality: 82 }).toFile(path.join(capturesDir, `${nom}-${cle}.webp`));

    await defilerLentement(page);
    const complet = await page.evaluate(collecterComplet, { vw: V.vw, vh: V.vh, hote });

    let planche = null;
    if (!V.mobile) {
      const hauteur = await page.evaluate(() => document.documentElement.scrollHeight);
      const pas = Math.max(1, Math.floor(Math.max(0, hauteur - V.vh) / (NB_VUES_PLANCHE - 1)));
      const hv = Math.round(V.largeurVignette * V.vh / V.vw);
      const vignettes = [];
      for (let k = 0; k < NB_VUES_PLANCHE; k++) {
        await page.evaluate((y) => window.scrollTo(0, y), k * pas);
        await page.waitForTimeout(700);
        const y = await page.evaluate(() => Math.round(scrollY));
        const buf = await page.screenshot({ type: 'png' });
        const etiquette = Buffer.from(`<svg width="${V.largeurVignette}" height="${hv}"><rect width="64" height="18" fill="#ff0"/><text x="4" y="14" font-size="13" font-family="Arial">${y}</text></svg>`);
        vignettes.push(await sharp(buf).resize(V.largeurVignette).composite([{ input: etiquette, top: 0, left: 0 }]).png().toBuffer());
      }
      const { positions, width, height } = disposerVignettes(NB_VUES_PLANCHE, V.largeurVignette, hv, 4);
      planche = path.join(capturesDir, `${nom}-planche.jpg`);
      await sharp({ create: { width, height, channels: 3, background: '#888' } }).composite(vignettes.map((input, i) => ({ input, ...positions[i] }))).jpeg({ quality: 72 }).toFile(planche);
    }
    return { vue: { vw: V.vw, vh: V.vh, mobile: V.mobile }, statut, erreursJs: erreurs.slice(0, 5), premierEcran: arrivee, ...complet, structure: { ...complet.structure, barreBas: arrivee.barreBas }, planche };
  } finally {
    await ctx.close();
  }
}

/** Finit les mesures brutes d'une vue : couleurs classées, polices IA, sources des @font-face (fonctions pures). */
export function finirMesures(vue, hote) {
  if (!vue) return vue;
  const out = { ...vue };
  if (vue.couleurs) {
    out.couleurs = {
      ...vue.couleurs,
      fonds: classerCouleurs(vue.couleurs.fondsBruts, 5),
      textes: classerCouleurs(vue.couleurs.textesBruts, 5),
      contraste: contraste(vue.couleurs.fond, vue.couleurs.texte),
    };
  }
  if (vue.typographie) {
    const t = vue.typographie;
    out.typographie = { ...t, fontFaces: (t.fontFaces || []).map((f) => ({ ...f, source: f.url && !/^data:/.test(f.url) ? sourcePolice(f.url, hote) : f.url ? 'inline (data:)' : 'locale' })) };
    const familles = [t.h1, t.h2, t.p, t.bouton, t.nav].filter(Boolean).map((x) => x.famille).concat((t.famillesVisibles || []).map((f) => f.famille));
    out.signes = { ...(vue.signes || {}), policesIa: policesIa(familles) };
  }
  return out;
}

export async function cmdDemonter(args) {
  const { positional, flags } = parseArgs(args);
  let url;
  try {
    url = validerUrl(positional[0]);
  } catch (e) {
    fail(e.message);
    info('Usage : ff demonter <url> [--slug <site>] [--nom <x>] [--dossier <dossier>]');
    process.exit(1);
  }
  const nom = (flags.nom && String(flags.nom).trim()) || nomDepuisUrl(url);
  if (!/^[a-z0-9][a-z0-9-]*$/.test(nom)) {
    fail(`Nom invalide « ${nom} » : minuscules, chiffres et tirets seulement.`);
    process.exit(1);
  }
  let dossier;
  if (flags.dossier) dossier = path.resolve(ROOT, String(flags.dossier));
  else if (flags.slug) {
    if (!siteExists(flags.slug)) {
      fail(`Site introuvable : sites/${flags.slug}.`);
      process.exit(1);
    }
    dossier = path.join(SITES_DIR, flags.slug, 'references');
  } else dossier = path.join(ROOT, 'docs', 'veille', 'demontages');
  const capturesDir = path.join(dossier, 'captures');
  fs.mkdirSync(capturesDir, { recursive: true });
  const hote = new URL(url).hostname;
  const debut = Date.now();

  const { chromium } = await import('playwright-core');
  const sharp = (await import('sharp')).default;
  const navigateur = await chromium.launch({ channel: 'chrome', headless: true, args: ['--disable-blink-features=AutomationControlled'] });
  const mesures = { outil: 'ff demonter', version: 1, url, nom, date: new Date().toISOString().slice(0, 10), identite: null, d: null, m: null };
  try {
    for (const cle of ['d', 'm']) {
      info(`${cle === 'd' ? 'Ordinateur' : 'Téléphone'} ${VUES[cle].vw}x${VUES[cle].vh} : ${url}`);
      const vue = await demonterVue(navigateur, url, cle, { sharp, capturesDir, nom, hote });
      mesures[cle] = finirMesures(vue, hote);
      if (!mesures.identite) mesures.identite = vue.identite;
      ok(`  capture ${path.relative(ROOT, path.join(capturesDir, `${nom}-${cle}.webp`))}${vue.planche ? `, planche ${path.basename(vue.planche)}` : ''}`);
      if (vue.erreursJs.length) info(`  erreurs JS : ${vue.erreursJs.slice(0, 2).join(' | ')}`);
    }
  } catch (e) {
    fail(`${url} : ${e.message}`);
    if (e.bloque) info('  Ouvre le site dans un vrai navigateur et fais la fiche à la main (méthode de docs/veille/demontages/INDEX.md).');
    await navigateur.close().catch(() => {});
    process.exit(1);
  } finally {
    await navigateur.close().catch(() => {});
  }
  mesures.nomAffiche = nomAffiche(mesures.identite, nom);
  mesures.dureeS = Math.round((Date.now() - debut) / 100) / 10;
  for (const cle of ['d', 'm']) delete mesures[cle].identite;
  fs.writeFileSync(path.join(dossier, `${nom}.json`), JSON.stringify(mesures, null, 2));
  fs.writeFileSync(path.join(dossier, `${nom}.md`), rendreFiche(mesures));
  ok(`Fiche ${path.relative(ROOT, path.join(dossier, `${nom}.md`))} + ${nom}.json en ${mesures.dureeS} s. Geste signature et « en 3 secondes » restent à juger sur les captures.`);
}
