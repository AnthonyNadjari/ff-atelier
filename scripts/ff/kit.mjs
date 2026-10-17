// `ff kit <slug> [--sortie dossier] [--url https://...]` : livrables CLIENT tires de
// sites/<slug>/site.config.ts, dans livrables/<slug>/ par defaut (dossier local, jamais commite) :
//
//   - fiche-google.html (+ fiche-google.md, meme contenu) : fiche Google Business Profile prete a
//     recopier, un bouton « Copier » par champ (petit script inline, aucune librairie) ;
//   - photos-google/*.jpg : les photos du site a televerser sur la fiche (Google refuse le WebP) ;
//   - qr.svg + qr.png (1024 px) : QR code vers le site, avec ?utm_source=qr&utm_medium=print
//     (correction d'erreur M, paquet `qrcode`) ;
//   - carte-visite.pdf (85 × 55 mm recto/verso, fond perdu 3 mm) et flyer-a5.pdf (148 × 210 mm,
//     fond perdu 3 mm), dans la direction du site : on reprend le CSS INLINE de dist/<slug>/index.html
//     (tokens + @font-face) et les polices de dist/<slug>/_astro/, servis par page.route() sur une
//     origine factice, puis Chrome (playwright-core, canal `chrome`, comme ff captures) imprime via
//     page.pdf(). Le site doit donc etre construit (`ff build <slug>`) ; apercus PNG a cote ;
//   - README.txt : ce qu'est chaque fichier, specs d'impression (RVB, fond perdu).
//
// Regle dure (CLAUDE.md n 2) : un champ absent de site.config.ts reste absent. Quand la fiche
// Google a besoin d'une info que le site n'a pas (horaires, categorie introuvable, mois
// d'ouverture...), elle affiche une « Note atelier » adressee au studio, jamais une valeur.
// Les donnees de test connues (06 00 00 00 00, 75000, contact@exemple.fr) sont signalees en
// console : le kit ne les masque pas, il ne faut pas imprimer 500 cartes avec.
//
// Fonctions pures (categories Google, description <= 750 caracteres, URL avec UTM, donnees de
// test, chemin SVG du QR) exportees et testees dans tests/kit.test.mjs, sans navigateur.
import fs from 'node:fs';
import path from 'node:path';
import { ROOT, SITES_DIR, DIST_DIR, siteExists, parseArgs, ok, fail, warn, info, c } from './util.mjs';
import { corrigerTexte } from './typo.mjs';

export const DESCRIPTION_MAX = 750;
const MM = 96 / 25.4; // px CSS par millimetre
const FOND_PERDU = 3; // mm
const MARGE_SURE = 5; // mm, depuis le trait de coupe
const QR_MIN_CARTE = 18; // mm : en dessous, un telephone moyen peine a lire le code sur une carte

/* =====================================================================
   1. FONCTIONS PURES
   ===================================================================== */

const sansAccents = (s) =>
  String(s ?? '')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/[’‘]/g, "'")
    .toLowerCase();

/**
 * Metier (business.trade, en francais) -> categories Google Business Profile, libelles francais
 * tels qu'ils apparaissent dans la liste deroulante de Google. TOUTES les entrees qui matchent sont
 * retenues, dans l'ordre de la table : la premiere devient la categorie principale, les suivantes
 * les secondaires (« Boulanger-pâtissier » -> Boulangerie + Pâtisserie). Le plus specifique avant le
 * generique. `deplacement` : true = le pro se deplace chez le client (fiche « zone desservie »,
 * adresse masquee), false = il recoit sur place, null = ca depend (a demander au client).
 */
export const CATEGORIES_GBP = [
  [/plombier|plomberie/, 'Plombier', true],
  [/chauffagiste|chauffage/, 'Chauffagiste', true],
  [/electricien/, 'Électricien', true],
  [/couvreur|zingueur|toiture/, 'Couvreur', true],
  [/serrurier|serrurerie/, 'Serrurier', true],
  [/barbier/, 'Barbier', false],
  [/coiffeu|coiffure/, 'Salon de coiffure', false],
  [/institut de beaute|estheticienne/, 'Institut de beauté', false],
  [/\bspa\b/, 'Spa', false],
  [/poisson|fruits de mer|bouillabaisse/, 'Restaurant de fruits de mer', false],
  [/restaurant/, 'Restaurant', false],
  [/boulang/, 'Boulangerie', false],
  [/patiss/, 'Pâtisserie', false],
  [/garage|mecani/, 'Garage automobile', false],
  [/avocat/, 'Avocat', false],
  [/dentiste/, 'Dentiste', false],
  [/veterinaire/, 'Vétérinaire', false],
  [/osteopathe/, 'Ostéopathe', false],
  [/kinesitherap|\bkine\b/, 'Kinésithérapeute', false],
  [/photographe/, 'Photographe', null],
  [/photographe.*mariage/, 'Photographe de mariage', null],
  [/paysagiste/, 'Paysagiste', true],
  [/menuisier|menuiserie/, 'Menuisier', null],
  [/ebeniste|ebenisterie/, 'Ébéniste', null],
  [/ferronn/, 'Ferronnier', null],
  [/architecte d'?interieur/, 'Architecte d’intérieur', true],
  [/architecte(?! d'?interieur)/, 'Architecte', null],
  [/fleuriste/, 'Fleuriste', false],
  [/chambres? d'?hotes/, 'Chambre d’hôtes', false],
  [/auto-?ecole/, 'Auto-école', false],
  [/tatou/, 'Salon de tatouage', false],
  [/traiteur/, 'Traiteur', null],
  [/brasserie/, 'Brasserie', false],
  [/immobili/, 'Agence immobilière', false],
  [/\bmacon/, 'Maçon', true],
  [/informatique/, 'Service de réparation d’ordinateurs', null],
  [/sites? (?:web|internet|vitrine)|sites pour|\bweb\b/, 'Concepteur de sites Web', true],
].map(([re, nom, deplacement]) => ({ re, nom, deplacement }));

/** Repli sur business.schemaType quand le metier ne dit rien (meme vocabulaire que src/lib/schemaType.ts). */
export const CATEGORIES_PAR_SCHEMA = {
  Plumber: 'Plombier', HVACBusiness: 'Chauffagiste', Electrician: 'Électricien', RoofingContractor: 'Couvreur',
  Locksmith: 'Serrurier', HairSalon: 'Salon de coiffure', BeautySalon: 'Institut de beauté', DaySpa: 'Spa',
  Restaurant: 'Restaurant', Bakery: 'Boulangerie', AutoRepair: 'Garage automobile', LegalService: 'Avocat',
  Dentist: 'Dentiste', VeterinaryCare: 'Vétérinaire', Florist: 'Fleuriste', BedAndBreakfast: 'Chambre d’hôtes',
  TattooParlor: 'Salon de tatouage', RealEstateAgent: 'Agence immobilière', Brewery: 'Brasserie',
};

/**
 * Categories Google suggerees : { principale, secondaires, deplacement } ou null si rien ne
 * correspond (la fiche affiche alors une note atelier « à choisir », jamais une categorie devinee).
 */
export function categoriesGbp(trade, schemaType) {
  const t = sansAccents(trade);
  const trouvees = CATEGORIES_GBP.filter((e) => e.re.test(t));
  if (trouvees.length) {
    const noms = [...new Set(trouvees.map((e) => e.nom))];
    return { principale: noms[0], secondaires: noms.slice(1, 10), deplacement: trouvees[0].deplacement };
  }
  const parSchema = schemaType && CATEGORIES_PAR_SCHEMA[schemaType];
  if (parSchema) {
    const entree = CATEGORIES_GBP.find((e) => e.nom === parSchema);
    return { principale: parSchema, secondaires: [], deplacement: entree ? entree.deplacement : null };
  }
  return null;
}

/** Texte brut d'un champ du site : sans balise HTML ni gras markdown, espaces normalisees. */
export function texteBrut(s) {
  return String(s ?? '')
    .replace(/<br\s*\/?>/gi, ' ')
    .replace(/<[^>]+>/g, '')
    .replace(/\*\*|__/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/[ \t\r\n]+/g, ' ')
    .trim();
}

/** Typographie francaise (ff typo) appliquee a un texte brut. */
export const typo = (s) => corrigerTexte(texteBrut(s));

/** Decoupe un texte en phrases (ponctuation forte suivie d'une espace et d'une majuscule). */
export function decouperPhrases(texte) {
  const t = texteBrut(texte);
  if (!t) return [];
  return t
    .split(/(?<=[.!?…])\s+(?=[A-ZÀ-ÖØ-Þ«"0-9])/u)
    .map((p) => p.trim())
    .filter(Boolean);
}

// Une description Google ne doit contenir ni lien ni numero de telephone (regles de contenu Google).
const INTERDIT_DESCRIPTION = /https?:\/\/|www\.|@|(?:\d[\s.  ]?){10}/;

/**
 * Assemble la description Google a partir de textes EXISTANTS du site (phrases entieres, dans
 * l'ordre, jamais reecrites) : on ajoute des phrases tant que le total tient dans `max`, coupure
 * toujours en fin de phrase. Seul cas de coupe en milieu : une premiere phrase plus longue que
 * `max`, coupee au dernier mot entier + « … ». Typographie francaise appliquee avant le comptage.
 */
export function assemblerDescription(textes, max = DESCRIPTION_MAX) {
  const phrases = textes
    .flatMap((t) => decouperPhrases(t))
    .filter((p) => !INTERDIT_DESCRIPTION.test(p))
    .map((p) => corrigerTexte(p));
  let out = '';
  for (const p of phrases) {
    const candidat = out ? `${out} ${p}` : p;
    if (candidat.length > max) break;
    out = candidat;
  }
  if (!out && phrases.length) {
    const coupe = phrases[0].slice(0, max - 1);
    const dernierBlanc = coupe.search(/\s\S*$/);
    out = `${(dernierBlanc > 0 ? coupe.slice(0, dernierBlanc) : coupe).replace(/[\s,;:]+$/, '')}…`;
  }
  return out;
}

/** URL racine du site (https, barre finale) a partir d'un domaine nu ou d'une URL. */
export function urlDuSite(domaine) {
  const d = String(domaine ?? '').trim().replace(/^https?:\/\//i, '').replace(/\/+$/, '');
  return d ? `https://${d}/` : '';
}

/** Ajoute des parametres utm_* a une URL (garde la requete et l'ancre existantes). */
export function urlAvecUtm(url, utm = {}) {
  const u = new URL(url);
  for (const [cle, valeur] of Object.entries(utm)) {
    if (valeur) u.searchParams.set(`utm_${cle}`, valeur);
  }
  return u.toString();
}

/** Numero national a 10 chiffres a partir de +33... ou 0..., sinon chaine vide. */
export function numeroNational(tel) {
  const d = String(tel ?? '').replace(/[^\d+]/g, '');
  if (/^\+33\d{9}$/.test(d)) return `0${d.slice(3)}`;
  if (/^0033\d{9}$/.test(d)) return `0${d.slice(4)}`;
  if (/^0\d{9}$/.test(d)) return d;
  return '';
}

/**
 * Donnees de test connues dans la config : numero 0X 00 00 00 00 (ou 06 12 34 56 78), code postal
 * 75000 (n'existe pas : Paris va de 75001 a 75020), e-mail @exemple.fr / @example.com.
 * Renvoie une liste de messages (vide = rien de suspect).
 */
export function donneesDeTest(cfg) {
  const out = [];
  const contact = cfg?.contact || {};
  const nat = numeroNational(contact.phone);
  if (/^0[1-9]0{8}$/.test(nat) || ['0612345678', '0123456789'].includes(nat)) {
    out.push(`téléphone ${contact.phoneDisplay || contact.phone}`);
  }
  if (String(contact.address?.postalCode ?? '').trim() === '75000') {
    out.push('code postal 75000 (n’existe pas, Paris va de 75001 à 75020)');
  }
  if (/@(?:exemple|example)\.(?:fr|com|org|net)$/i.test(String(contact.email ?? ''))) {
    out.push(`e-mail ${contact.email}`);
  }
  return out;
}

/**
 * Chemin SVG d'un QR (matrice `qrcode.create().modules`) : un sous-chemin par module sombre,
 * decale de `marge` modules (zone de silence). Renvoie { taille, d } avec taille = cote total.
 */
export function cheminQr(modules, marge = 2) {
  const n = modules.size;
  let d = '';
  for (let y = 0; y < n; y++) {
    for (let x = 0; x < n; x++) {
      if (modules.get(y, x)) d += `M${x + marge} ${y + marge}h1v1h-1z`;
    }
  }
  return { taille: n + 2 * marge, d };
}

/** Jusqu'a `n` services pour l'impression : ceux mis en avant (featured) d'abord, ordre du site sinon. */
export function choisirServices(services = [], n = 3) {
  return [...services.filter((s) => s.featured), ...services.filter((s) => !s.featured)].slice(0, n);
}

/**
 * Ligne « ou » des imprimes : l'adresse complete quand le client vient sur place (boutique, salon,
 * cabinet : categorie Google « deplacement: false ») et que la rue est connue ; sinon la zone
 * d'intervention (label, sinon villes, sinon la ville de l'adresse).
 */
export function zoneLisible(cfg) {
  const z = cfg?.zones || {};
  const adr = cfg?.contact?.address || {};
  if (adr.street && categoriesGbp(cfg?.business?.trade, cfg?.business?.schemaType)?.deplacement === false) {
    return `${adr.street}, ${[adr.postalCode, adr.city].filter(Boolean).join(' ')}`;
  }
  if (z.label) return z.label;
  if (z.cities?.length) return z.cities.join(', ');
  return cfg?.contact?.address?.city || '';
}

const echapper = (s) =>
  String(s ?? '').replace(/[&<>"']/g, (ch) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]));

/* =====================================================================
   2. FICHE GOOGLE : un modele, deux rendus (HTML + Markdown)
   ===================================================================== */

// Un champ : { label, valeur?, note?, liste? }. `valeur` = donnee du site, copiable telle quelle.
// `note` = consigne pour le studio (« Note atelier »), jamais copiee comme une donnee client.

function photosDuSite(slug, cfg) {
  const brutes = [];
  const ajouter = (img, role) => img?.src && brutes.push({ ...img, role });
  ajouter(cfg.images?.logo, 'Logo');
  ajouter(cfg.images?.hero, 'Photo de couverture');
  ajouter(cfg.about?.portrait, 'Équipe ou devanture');
  for (const m of cfg.about?.team || []) ajouter(m.photo, `Équipe : ${m.name}`);
  for (const s of cfg.services || []) ajouter(s.image, `Travaux : ${s.title}`);
  for (const g of cfg.proof?.gallery || []) ajouter(g, 'Réalisation');
  for (const ba of cfg.proof?.beforeAfter || []) {
    ajouter(ba.before, 'Réalisation (avant)');
    ajouter(ba.after, 'Réalisation (après)');
  }
  const credits = (() => {
    const p = path.join(SITES_DIR, slug, 'CREDITS.md');
    return fs.existsSync(p) ? fs.readFileSync(p, 'utf8') : '';
  })();
  const vues = new Set();
  return brutes
    .filter((p) => !vues.has(p.src) && vues.add(p.src))
    .map((p) => {
      const fichier = path.join(SITES_DIR, slug, 'public', p.src.replace(/^\/+/, ''));
      const relatif = `sites/${slug}/public${p.src.startsWith('/') ? '' : '/'}${p.src}`;
      const base = path.basename(p.src);
      let exclue = '';
      if (!fs.existsSync(fichier)) exclue = 'fichier introuvable';
      else if (credits.includes(`public/images/${base}`) || credits.includes(p.src.replace(/^\//, ''))) {
        exclue = 'photo de banque (CREDITS.md) : Google veut des photos réelles de l’activité';
      } else if (/d[ée]monstration|placeholder|provisoire|illustration/i.test(p.alt || '')) {
        exclue = 'image de démonstration (texte alternatif) : pas une photo de l’activité';
      }
      return { ...p, fichier, relatif, exclue };
    });
}

function cheminService(slug, s) {
  const d = path.join(DIST_DIR, slug, 'services');
  return fs.existsSync(path.join(d, `${s.slug}.html`)) || fs.existsSync(path.join(d, s.slug, 'index.html'))
    ? `services/${s.slug}`
    : '';
}

export function ficheGoogle({ slug, cfg, url, photos, alertes = [] }) {
  const cat = categoriesGbp(cfg.business.trade, cfg.business.schemaType);
  const sections = [];
  const absent = (quoi) => `Absent de site.config.ts : ${quoi} à demander au client.`;

  // --- Identite
  const identite = [
    {
      label: 'Nom de l’établissement',
      valeur: cfg.business.name,
      note: 'Le nom exact, celui de l’enseigne ou du Kbis, sans ville ni mot-clé ajouté (Google suspend les fiches au nom rallongé).',
    },
  ];
  if (cat) {
    identite.push({
      label: 'Catégorie principale',
      valeur: cat.principale,
      note: 'Suggestion tirée du métier : la retrouver telle quelle dans la liste de Google, sinon prendre la plus proche.',
    });
    if (cat.secondaires.length) identite.push({ label: 'Catégories secondaires', valeur: cat.secondaires.join('\n') });
  } else {
    identite.push({
      label: 'Catégorie principale',
      note: `À choisir par le studio : aucune catégorie connue pour le métier « ${typo(cfg.business.trade)} ». Taper le métier dans le champ de Google et prendre la proposition la plus précise.`,
    });
  }
  sections.push({ titre: 'Identité', champs: identite });

  // --- Description
  const desc = texteBrut(cfg.business.description);
  const sources = [cfg.business.description];
  if (desc.length < 300 && cfg.about?.story) sources.push(cfg.about.story);
  const description = assemblerDescription(sources);
  sections.push({
    titre: 'Description',
    champs: [
      description
        ? {
            label: `Description (${description.length} / ${DESCRIPTION_MAX} caractères)`,
            valeur: description,
            note: 'Phrases reprises du site, sans lien ni numéro (refusés par Google). Relire avec le client.',
          }
        : { label: 'Description', note: absent('une présentation de l’activité') },
    ],
  });

  // --- Coordonnees
  const coord = [];
  coord.push({ label: 'Téléphone principal', valeur: cfg.contact.phoneDisplay || cfg.contact.phone });
  if (url) {
    coord.push({ label: 'Site web', valeur: url });
    const aContact = cfg.layout?.contactDrawer || (cfg.layout?.sections || []).some((s) => s.type === 'contact');
    if (aContact) {
      coord.push({
        label: 'Lien de prise de contact (rendez-vous, devis)',
        valeur: `${url}#contact`,
        note: 'À coller dans le champ « Lien de prise de rendez-vous » si Google le propose pour cette catégorie.',
      });
    }
  } else {
    coord.push({
      label: 'Site web',
      note: 'Pas de domaine (ni sites/<slug>/domain.txt ni domain dans site.config.ts) : brancher le domaine (ff domaine) puis relancer ff kit, ou passer --url.',
    });
  }
  const adr = cfg.contact.address || {};
  const adresse = [adr.street, [adr.postalCode, adr.city].filter(Boolean).join(' ')].filter(Boolean).join('\n');
  const zone = cfg.zones?.label || '';
  const villes = cfg.zones?.cities || [];
  let conseilAdresse;
  if (cat?.deplacement === true) {
    conseilAdresse = 'Métier qui se déplace chez le client : déclarer une zone desservie et MASQUER l’adresse, sauf si le client reçoit sur place (atelier, boutique). Google l’exige.';
  } else if (cat?.deplacement === false) {
    conseilAdresse = 'Le client vient sur place : afficher l’adresse. Une zone desservie peut s’ajouter s’il livre ou se déplace aussi.';
  } else {
    conseilAdresse = 'À décider avec le client : adresse visible s’il reçoit sur place, sinon zone desservie et adresse masquée.';
  }
  coord.push({ label: 'Adresse', valeur: adresse || undefined, note: adresse ? conseilAdresse : absent('l’adresse') });
  if (villes.length || zone) {
    coord.push({
      label: 'Zone desservie',
      valeur: villes.length ? villes.join('\n') : zone,
      note: villes.length && cfg.zones?.label ? `Sur le site : « ${typo(cfg.zones.label)} ». Google demande des villes ou des codes postaux, 20 au plus.` : undefined,
    });
  }
  sections.push({ titre: 'Coordonnées', champs: coord });

  // --- Horaires
  const horaires = (cfg.contact.hours || []).map((h) => `${typo(h.days)} : ${typo(h.hours)}`);
  const champsHoraires = [];
  if (horaires.length) {
    champsHoraires.push({ label: 'Horaires d’ouverture', valeur: horaires.join('\n'), note: 'Google les saisit jour par jour : recopier chaque ligne sur les jours concernés.' });
  } else if (cfg.contact.emergency24h) {
    champsHoraires.push({ label: 'Horaires d’ouverture', valeur: 'Ouvert 24 h/24', note: 'Déduit de « urgence 24 h/24 » du site : confirmer avec le client que la ligne est vraiment tenue jour et nuit.' });
  } else {
    champsHoraires.push({ label: 'Horaires d’ouverture', note: absent('les horaires') });
  }
  champsHoraires.push({ label: 'Horaires exceptionnels', note: 'À renseigner avec le client (jours fériés, congés) : une fiche « ouverte » un jour de fermeture coûte des avis.' });
  sections.push({ titre: 'Horaires', champs: champsHoraires });

  // --- Services
  sections.push({
    titre: 'Services',
    intro: 'Un service par entrée dans l’onglet « Services » de la fiche : nom, puis description (300 caractères au plus), puis prix seulement s’il figure sur le site.',
    champs: (cfg.services || []).map((s) => ({
      label: typo(s.title),
      valeur: [typo(s.short), s.priceFrom ? `Prix : ${typo(s.priceFrom)}` : ''].filter(Boolean).join('\n'),
    })),
  });

  // --- Date d'ouverture
  sections.push({
    titre: 'Date d’ouverture',
    champs: [
      cfg.business.since
        ? { label: 'Année d’ouverture', valeur: String(cfg.business.since), note: 'Google demande aussi le mois : à demander au client (le site ne le donne pas).' }
        : { label: 'Date d’ouverture', note: absent('l’année d’ouverture') },
    ],
  });

  // --- Attributs
  const attributs = [];
  if (cfg.contact.emergency24h) attributs.push('Urgences : la ligne répond jour et nuit (le site l’affiche).');
  if (cfg.business.certifications?.length) attributs.push(`Certifications du site à citer dans la description ou un post : ${cfg.business.certifications.map(typo).join(', ')}.`);
  if (cfg.business.insurance) attributs.push(`Assurance mentionnée sur le site : ${typo(cfg.business.insurance)}.`);
  const reseaux = Object.entries(cfg.social || {}).filter(([, v]) => v);
  sections.push({
    titre: 'Attributs',
    intro: 'Les attributs proposés dépendent de la catégorie. Ne cocher que ce que le client confirme.',
    liste: [
      ...attributs,
      'À demander : accessibilité en fauteuil roulant (entrée, toilettes, parking).',
      'À demander : moyens de paiement acceptés (carte, espèces, chèque, paiement sans contact).',
      'À demander : rendez-vous en ligne, devis gratuit, intervention à domicile, selon la catégorie.',
      'À demander : attributs d’identité (entreprise dirigée par une femme, etc.), seulement si le client le souhaite.',
    ],
    champs: reseaux.map(([nom, lien]) => ({ label: `Profil ${nom[0].toUpperCase()}${nom.slice(1)}`, valeur: lien })),
  });

  // --- Photos
  const retenues = photos.filter((p) => !p.exclue);
  const ecartees = photos.filter((p) => p.exclue);
  sections.push({
    titre: 'Photos',
    intro:
      'Les JPG prêts à téléverser sont dans photos-google/ (Google refuse le WebP). Viser au moins un logo, une couverture et trois photos de travaux ou du lieu, 720 × 720 px minimum.',
    liste: [
      ...retenues.map((p) => `${p.role} : ${p.jpg ? `photos-google/${p.jpg}` : p.relatif} (source ${p.relatif})`),
      ...ecartees.map((p) => `Écartée, ${p.role} : ${p.relatif}, ${p.exclue}.`),
      ...(cfg.images?.logo ? [] : ['Logo : absent du site, à demander au client (carré, 250 × 250 px minimum).']),
      ...(retenues.length < 3 ? ['Moins de trois photos réelles disponibles : en demander au client (chantiers, atelier, équipe, devanture).'] : []),
    ],
    champs: [],
  });

  // --- Etapes
  const phares = choisirServices(cfg.services, 2);
  sections.push({
    titre: 'Étapes',
    ordonnee: true,
    liste: [
      'Avec le client, sur SON compte Google (jamais celui du studio) : business.google.com, chercher l’établissement. S’il existe déjà, le revendiquer ; sinon, le créer.',
      'Saisir le nom exact, la catégorie principale, puis l’adresse ou la zone desservie (voir plus haut).',
      'Validation de la fiche : Google propose une vidéo (enseigne, véhicule ou outillage, et un justificatif), un appel, un SMS ou un courrier. Compter quelques jours.',
      'Une fois validée : description, horaires, services, catégories secondaires, photos, lien du site.',
      ...phares.map((s) => {
        const chemin = url ? cheminService(slug, s) : '';
        return `Post à publier : « ${typo(s.title)} », avec une photo réelle et le lien ${chemin ? url + chemin : 'du site'}.`;
      }),
      'Demander des avis aux vrais clients avec le lien d’avis de la fiche. Jamais d’avis rédigés ni achetés : pratique commerciale trompeuse (voir docs/BRIEF.md).',
      `Fiche publiée : copier son lien Google Maps dans contact.mapsUrl de sites/${slug}/site.config.ts, puis reconstruire le site.`,
    ],
    champs: [],
  });

  const avertissement = alertes.length
    ? `Données de test encore présentes dans le site : ${alertes.join(' ; ')}. Ne rien saisir sur Google avant de les avoir remplacées dans site.config.ts.`
    : '';
  return { titre: `Fiche Google : ${cfg.business.name}`, avertissement, sections };
}

/** Typographie des textes de l'atelier, en rendant leur double tiret aux options de ligne de commande. */
const typoUi = (s) => corrigerTexte(s).replace(/[—–](url|sortie)\b/g, '--$1');

export function ficheMarkdown(fiche) {
  const t = typoUi;
  const lignes = [`# ${t(fiche.titre)}`, '', t('Fiche Google Business Profile à remplir par le client ou avec lui. Chaque bloc de code se copie tel quel ; les « Note atelier » sont des consignes pour le studio, pas des données à saisir.'), ''];
  if (fiche.avertissement) lignes.push(`> **ATTENTION** ${t(fiche.avertissement)}`, '');
  for (const s of fiche.sections) {
    lignes.push(`## ${t(s.titre)}`, '');
    if (s.intro) lignes.push(t(s.intro), '');
    for (const ch of s.champs) {
      lignes.push(`**${t(ch.label)}**`, '');
      if (ch.valeur) lignes.push('```', ch.valeur, '```', '');
      if (ch.note) lignes.push(`> Note atelier : ${t(ch.note)}`, '');
    }
    if (s.liste?.length) {
      s.liste.forEach((l, i) => lignes.push(`${s.ordonnee ? `${i + 1}.` : '-'} ${t(l)}`));
      lignes.push('');
    }
  }
  return lignes.join('\n');
}

export function ficheHtml(fiche) {
  const t = (s) => echapper(typoUi(s));
  let n = 0;
  const corps = fiche.sections
    .map((s) => {
      const champs = s.champs
        .map((ch) => {
          const id = `v${++n}`;
          return `<div class="champ">
  <div class="tete"><span class="label">${t(ch.label)}</span>${ch.valeur ? `<button type="button" data-copier="${id}">Copier</button>` : ''}</div>
  ${ch.valeur ? `<pre id="${id}">${echapper(ch.valeur)}</pre>` : ''}
  ${ch.note ? `<p class="note"><strong>Note atelier :</strong> ${t(ch.note)}</p>` : ''}
</div>`;
        })
        .join('\n');
      const liste = s.liste?.length
        ? `<${s.ordonnee ? 'ol' : 'ul'}>${s.liste.map((l) => `<li>${t(l)}</li>`).join('')}</${s.ordonnee ? 'ol' : 'ul'}>`
        : '';
      return `<section><h2>${t(s.titre)}</h2>${s.intro ? `<p class="intro">${t(s.intro)}</p>` : ''}${champs}${liste}</section>`;
    })
    .join('\n');
  return `<!doctype html>
<html lang="fr">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>${t(fiche.titre)}</title>
<style>
  :root { --bg: #f7f6f3; --fg: #1b1b1a; --muted: #5d5c58; --line: #dedbd4; --carte: #ffffff; --note: #fff4d6; }
  * { box-sizing: border-box; }
  body { margin: 0; background: var(--bg); color: var(--fg); font: 16px/1.55 system-ui, -apple-system, 'Segoe UI', sans-serif; }
  main { max-width: 46rem; margin: 0 auto; padding: 2.5rem 1.25rem 4rem; }
  h1 { font-size: 1.75rem; line-height: 1.2; margin: 0 0 .5rem; }
  h2 { font-size: 1.2rem; margin: 2.5rem 0 .75rem; padding-top: 1rem; border-top: 1px solid var(--line); }
  .chapeau, .intro { color: var(--muted); margin: 0 0 1rem; }
  .champ { background: var(--carte); border: 1px solid var(--line); border-radius: 3px; padding: .9rem 1rem; margin: 0 0 .75rem; }
  .tete { display: flex; justify-content: space-between; align-items: center; gap: 1rem; }
  .label { font-weight: 600; }
  pre { margin: .5rem 0 0; white-space: pre-wrap; word-break: break-word; font: inherit; background: var(--bg); padding: .6rem .75rem; border-radius: 2px; }
  button { font: inherit; font-size: .875rem; padding: .3rem .8rem; border: 1px solid var(--fg); background: var(--carte); color: var(--fg); border-radius: 2px; cursor: pointer; flex: none; }
  button:hover { background: var(--fg); color: var(--carte); }
  .note { margin: .6rem 0 0; padding: .5rem .75rem; background: var(--note); border-radius: 2px; font-size: .9rem; }
  li { margin: .35rem 0; }
  .alerte { margin: 1rem 0 0; padding: .75rem 1rem; border: 2px solid #b3261e; color: #8c1d18; background: #fdecea; border-radius: 3px; }
</style>
</head>
<body>
<main>
<h1>${t(fiche.titre)}</h1>
<p class="chapeau">${t('Fiche Google Business Profile à remplir par le client ou avec lui. Un bouton « Copier » par champ ; les notes jaunes sont des consignes pour le studio, pas des données à saisir.')}</p>
${fiche.avertissement ? `<p class="alerte"><strong>Attention.</strong> ${t(fiche.avertissement)}</p>` : ''}
${corps}
</main>
<script>
  document.addEventListener('click', async (e) => {
    const b = e.target.closest('button[data-copier]');
    if (!b) return;
    const texte = document.getElementById(b.dataset.copier).textContent;
    try {
      await navigator.clipboard.writeText(texte);
    } catch {
      const zone = document.createElement('textarea');
      zone.value = texte;
      document.body.append(zone);
      zone.select();
      document.execCommand('copy');
      zone.remove();
    }
    b.textContent = 'Copié';
    setTimeout(() => { b.textContent = 'Copier'; }, 1500);
  });
</script>
</body>
</html>
`;
}

/* =====================================================================
   3. IMPRESSION (carte de visite, flyer A5) DANS LA DIRECTION DU SITE
   ===================================================================== */

/** Reprend du index.html construit la balise <html> (data-direction, surcharges inline) et le CSS. */
function cssDuSite(html) {
  const ouvrante = (html.match(/<html\b[^>]*>/i) || ['<html lang="fr">'])[0];
  const styles = [...html.matchAll(/<style\b[^>]*>([\s\S]*?)<\/style>/gi)].map((m) => m[1]).join('\n');
  const liens = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*>/gi)].map((m) => m[0]).join('\n');
  return { ouvrante, styles, liens };
}

/** Echappe et garde les mots composes entiers (« e-mail » ne se coupe pas en fin de ligne). */
const insecable = (s) => echapper(s).replace(/[^\s<>]+-[^\s<>]+/g, (m) => `<span class="kit-mot">${m}</span>`);

function svgQr(qr) {
  if (!qr) return '';
  return `<svg viewBox="0 0 ${qr.taille} ${qr.taille}" xmlns="http://www.w3.org/2000/svg" shape-rendering="crispEdges" role="img" aria-label="QR code vers le site"><rect class="kit-qr-fond" width="${qr.taille}" height="${qr.taille}"/><path class="kit-qr-mod" d="${qr.d}"/></svg>`;
}

const CSS_COMMUN = `
  html, body { margin: 0 !important; padding: 0 !important; overflow: visible !important; background: transparent !important; }
  .kit-page { position: relative; overflow: hidden; box-sizing: border-box; break-after: page; page-break-after: always;
    background: var(--bg); color: var(--fg); font-family: var(--font-body); line-height: 1.25;
    -webkit-print-color-adjust: exact; print-color-adjust: exact; font-kerning: normal; }
  .kit-page:last-child { break-after: auto; page-break-after: auto; }
  .kit-page * { box-sizing: border-box; margin: 0; }
  .kit-safe { position: absolute; inset: ${FOND_PERDU + MARGE_SURE}mm; display: flex; flex-direction: column; }
  .kit-display { font-family: var(--font-display); font-weight: var(--display-weight, 600);
    letter-spacing: var(--display-tracking, 0); text-transform: var(--heading-transform, none); line-height: 1.04; }
  .kit-nowrap { white-space: nowrap; overflow: hidden; }
  .kit-filet { flex: none; height: 0.35mm; background: var(--accent); }
  .kit-qr { flex: none; }
  .kit-qr svg { display: block; width: 100%; height: 100%; }
  .kit-muted { color: var(--muted); }
  .kit-mot { white-space: nowrap; }
  /* global.css pose overflow-wrap: anywhere + cesure auto sur p (bon pour une grille web a 375 px) :
     sur un imprime on ne coupe jamais un mot. */
  .kit-page p { overflow-wrap: normal; hyphens: manual; -webkit-hyphens: manual; text-wrap: pretty; }
`;

function htmlCarte({ site, cfg, qr, urlAffichee, zone }) {
  const W = 85 + 2 * FOND_PERDU;
  const H = 55 + 2 * FOND_PERDU;
  const accroche = typo(cfg.business.tagline);
  const lignes = [
    cfg.contact.email && `<p class="kit-ligne kit-nowrap" data-fit data-min="6">${echapper(cfg.contact.email)}</p>`,
    urlAffichee && `<p class="kit-ligne kit-nowrap" data-fit data-min="6">${echapper(urlAffichee)}</p>`,
    zone && `<p class="kit-ligne kit-nowrap kit-muted" data-fit data-min="6">${echapper(typo(zone))}</p>`,
  ].filter(Boolean);
  return `<!doctype html>
${site.ouvrante}
<head><meta charset="utf-8"><title>Carte de visite</title>${site.liens}
<style>${site.styles}</style>
<style>
  @page { size: ${W}mm ${H}mm; margin: 0; }
  ${CSS_COMMUN}
  .kit-page { width: ${W}mm; height: ${H}mm; }
  .kit-recto { background: var(--ink); color: var(--on-ink); }
  .kit-recto .kit-safe { justify-content: space-between; }
  .kit-nom { font-size: 19pt; max-height: 22mm; overflow: hidden; }
  .kit-metier { font-size: 8.5pt; margin-top: 2.2mm; }
  /* Sur le fond encre, l'accent peut disparaitre (bleu nuit sur noir) : le filet prend la couleur du texte. */
  .kit-recto .kit-filet { width: 12mm; background: currentColor; }
  .kit-accroche { font-size: 9pt; line-height: 1.3; max-width: 62mm; max-height: 12mm; overflow: hidden; }
  .kit-verso .kit-safe { justify-content: space-between; }
  .kit-nom-petit { font-size: 9pt; }
  .kit-bas { display: flex; align-items: flex-end; gap: 4mm; }
  .kit-coord { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1.1mm; font-size: 7.5pt; }
  .kit-tel { font-size: 14pt; margin-bottom: 0.8mm; }
  .kit-verso .kit-qr { width: 22mm; height: 22mm; }
</style></head>
<body>
<div class="kit-page kit-recto" data-face="recto">
  <div class="kit-safe">
    <div>
      <p class="kit-nom kit-display" data-fit data-min="11">${echapper(typo(cfg.business.name))}</p>
      <p class="kit-metier kit-nowrap" data-fit data-min="6.5">${echapper(typo(cfg.business.trade))}</p>
    </div>
    <div>
      <div class="kit-filet"></div>
      ${accroche ? `<p class="kit-accroche" data-fit data-min="7" style="margin-top:2.5mm">${insecable(accroche)}</p>` : ''}
    </div>
  </div>
</div>
<div class="kit-page kit-verso" data-face="verso" data-qr-min="${QR_MIN_CARTE}">
  <div class="kit-safe">
    <p class="kit-nom-petit kit-display kit-nowrap" data-fit data-min="7">${echapper(typo(cfg.business.name))}</p>
    <div class="kit-bas">
      <div class="kit-coord">
        <p class="kit-tel kit-display kit-nowrap" data-fit data-min="9">${echapper(typo(cfg.contact.phoneDisplay || cfg.contact.phone))}</p>
        ${lignes.join('\n        ')}
      </div>
      ${qr ? `<div class="kit-qr">${svgQr(qr)}</div>` : ''}
    </div>
  </div>
</div>
</body></html>`;
}

function htmlFlyer({ site, cfg, qr, urlAffichee, zone, photo }) {
  const W = 148 + 2 * FOND_PERDU;
  const H = 210 + 2 * FOND_PERDU;
  const hautPhoto = 86; // mm depuis le bord du fond perdu
  const accroche = typo(cfg.business.tagline);
  const services = choisirServices(cfg.services, 3);
  // Sans photo, la place libre sous l'accroche recoit le debut de la description du site (phrases
  // entieres, jamais reecrites) : sinon le flyer laisse un grand vide au milieu.
  const chapeau = photo ? '' : assemblerDescription([cfg.business.description], 240);
  const cartes = services
    .map(
      (s) => `<div class="kit-service">
      <p class="kit-service-titre kit-display">${insecable(typo(s.title))}</p>
      <p class="kit-service-texte">${insecable(typo(s.short))}</p>
      ${s.priceFrom ? `<p class="kit-prix">${echapper(typo(s.priceFrom))}</p>` : ''}
    </div>`,
    )
    .join('\n    ');
  const lignes = [
    cfg.contact.email && `<p class="kit-nowrap" data-fit data-min="7">${echapper(cfg.contact.email)}</p>`,
    urlAffichee && `<p class="kit-nowrap" data-fit data-min="7">${echapper(urlAffichee)}</p>`,
    zone && `<p class="kit-nowrap kit-muted" data-fit data-min="7">${echapper(typo(zone))}</p>`,
  ].filter(Boolean);
  return `<!doctype html>
${site.ouvrante}
<head><meta charset="utf-8"><title>Flyer A5</title>${site.liens}
<style>${site.styles}</style>
<style>
  @page { size: ${W}mm ${H}mm; margin: 0; }
  ${CSS_COMMUN}
  .kit-page { width: ${W}mm; height: ${H}mm; }
  .kit-photo { position: absolute; left: 0; top: 0; width: 100%; height: ${hautPhoto}mm; object-fit: cover; display: block; }
  ${photo ? `.kit-safe { top: ${hautPhoto + 7}mm; }` : ''}
  .kit-entete { display: flex; align-items: baseline; justify-content: space-between; gap: 6mm; font-size: 9.5pt; }
  .kit-entete .kit-nom { font-size: 13pt; }
  .kit-accroche { font-size: ${photo ? 27 : 36}pt; line-height: 1.06; margin-top: ${photo ? 5 : 14}mm; max-height: ${photo ? 34 : 62}mm; overflow: hidden; flex: none; }
  .kit-chapeau { font-size: 13pt; line-height: 1.4; margin-top: 7mm; max-width: 120mm; max-height: 32mm; overflow: hidden; flex: none; }
  .kit-services { display: grid; grid-template-columns: repeat(${Math.max(services.length, 1)}, minmax(0, 1fr)); gap: 6mm; margin-top: 8mm; flex: 1; min-height: 0; overflow: hidden; font-size: 9.5pt; align-content: start; }
  .kit-service { border-top: 0.35mm solid var(--accent); padding-top: 3mm; }
  .kit-service-titre { font-size: 1.3em; line-height: 1.12; }
  .kit-service-texte { margin-top: 2mm; line-height: 1.35; }
  .kit-prix { margin-top: 2mm; font-weight: 600; }
  .kit-pied { display: flex; align-items: flex-end; gap: 7mm; margin-top: 6mm; flex: none; }
  .kit-coord { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 1.4mm; font-size: 10pt; }
  .kit-tel { font-size: 30pt; line-height: 1; margin-bottom: 2mm; }
  .kit-pied .kit-qr { width: 30mm; height: 30mm; }
</style></head>
<body>
<div class="kit-page" data-face="flyer" data-qr-min="25">
  ${photo ? `<img class="kit-photo" src="${echapper(photo.src)}" alt="${echapper(photo.alt || '')}">` : ''}
  <div class="kit-safe">
    <div class="kit-entete">
      <p class="kit-nom kit-display kit-nowrap" data-fit data-min="9">${echapper(typo(cfg.business.name))}</p>
      <p class="kit-nowrap kit-muted" data-fit data-min="7">${echapper(typo(cfg.business.trade))}</p>
    </div>
    ${accroche ? `<p class="kit-accroche kit-display" data-fit data-min="16">${insecable(accroche)}</p>` : ''}
    ${chapeau ? `<p class="kit-chapeau" data-fit data-min="9">${insecable(chapeau)}</p>` : ''}
    <div class="kit-services" data-fit data-min="7">
    ${cartes}
    </div>
    <div class="kit-pied">
      <div class="kit-coord">
        <p class="kit-tel kit-display kit-nowrap" data-fit data-min="16">${echapper(typo(cfg.contact.phoneDisplay || cfg.contact.phone))}</p>
        ${lignes.join('\n        ')}
      </div>
      ${qr ? `<div class="kit-qr">${svgQr(qr)}</div>` : ''}
    </div>
  </div>
</div>
</body></html>`;
}

/**
 * Execute DANS la page : couleurs du QR (fond = la plus claire de --bg/--fg de la face, modules =
 * la plus sombre), reduction des textes [data-fit] qui debordent (jusqu'a data-min pt), puis
 * controles : element hors de la zone sure, texte encore coupe, QR trop petit, QR peu contraste.
 */
function ajusterDansLaPage(marges) {
  const mm = 96 / 25.4;
  const ctx = document.createElement('canvas').getContext('2d', { willReadFrequently: true });
  const rgb = (css) => {
    ctx.clearRect(0, 0, 1, 1);
    ctx.fillStyle = '#000';
    ctx.fillStyle = css;
    ctx.fillRect(0, 0, 1, 1);
    const [r, g, b] = ctx.getImageData(0, 0, 1, 1).data;
    return [r, g, b];
  };
  const lum = ([r, g, b]) => {
    const f = (v) => ((v /= 255) <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4);
    return 0.2126 * f(r) + 0.7152 * f(g) + 0.0722 * f(b);
  };
  const problemes = [];
  for (const face of document.querySelectorAll('.kit-page')) {
    const st = getComputedStyle(face);
    const a = rgb(st.backgroundColor);
    const b = rgb(st.color);
    const [clair, sombre] = lum(a) >= lum(b) ? [a, b] : [b, a];
    const ratio = (lum(clair) + 0.05) / (lum(sombre) + 0.05);
    for (const r of face.querySelectorAll('.kit-qr-fond')) r.setAttribute('fill', `rgb(${clair.join(',')})`);
    for (const p of face.querySelectorAll('.kit-qr-mod')) p.setAttribute('fill', `rgb(${sombre.join(',')})`);
    if (face.querySelector('.kit-qr') && ratio < 7) problemes.push(`${face.dataset.face} : QR peu contrasté (${ratio.toFixed(1)}:1)`);
  }
  // Debordement : largeur mesuree sur le contenu (Range), hauteur sur la boite LIBEREE de ses
  // contraintes (max-height, flex) et non sur scrollHeight : les capitales et jambages d'une Didone
  // depassent la hauteur de ligne sans que rien ne soit coupe, scrollHeight les compterait.
  const deborde = (el) => {
    const b = el.getBoundingClientRect();
    const r = document.createRange();
    r.selectNodeContents(el);
    const largeur = r.getBoundingClientRect().width;
    const st = el.style;
    const sauve = [st.maxHeight, st.flex, st.height];
    st.maxHeight = 'none';
    st.flex = 'none';
    st.height = 'auto';
    const hauteur = el.getBoundingClientRect().height;
    [st.maxHeight, st.flex, st.height] = sauve;
    return largeur > b.width + 1 || hauteur > b.height + 1;
  };
  for (const el of document.querySelectorAll('[data-fit]')) {
    const min = (parseFloat(el.dataset.min || '6') * 96) / 72;
    let taille = parseFloat(getComputedStyle(el).fontSize);
    while (deborde(el) && taille > min) {
      taille *= 0.96;
      el.style.fontSize = `${taille}px`;
    }
  }
  for (const face of document.querySelectorAll('.kit-page')) {
    const nom = face.dataset.face;
    const sure = face.querySelector('.kit-safe').getBoundingClientRect();
    const zone = { l: marges.perdu * mm, t: marges.perdu * mm, r: face.clientWidth - marges.perdu * mm, b: face.clientHeight - marges.perdu * mm };
    const tol = 0.5;
    for (const el of face.querySelectorAll('.kit-safe *')) {
      const r = el.getBoundingClientRect();
      if (!r.width || !r.height) continue;
      if (r.left < sure.left - tol || r.right > sure.right + tol || r.top < sure.top - tol || r.bottom > sure.bottom + tol) {
        problemes.push(`${nom} : « ${(el.textContent || el.className).trim().slice(0, 40)} » sort de la zone sûre (5 mm)`);
        break;
      }
    }
    void zone;
    for (const el of face.querySelectorAll('[data-fit]')) {
      if (deborde(el)) problemes.push(`${nom} : texte coupé même réduit, « ${el.textContent.trim().slice(0, 50)} »`);
    }
    const qr = face.querySelector('.kit-qr');
    if (qr) {
      const cote = qr.getBoundingClientRect().width / mm;
      if (cote < parseFloat(face.dataset.qrMin || '0') - 0.05) problemes.push(`${nom} : QR de ${cote.toFixed(1)} mm, sous le minimum de ${face.dataset.qrMin} mm`);
    }
  }
  return problemes;
}

async function imprimer({ browser, slug, html, sortie, pdf, apercus, largeurMm, hauteurMm, echelle }) {
  const racine = path.join(DIST_DIR, slug);
  const context = await browser.newContext({
    viewport: { width: Math.ceil(largeurMm * MM), height: Math.ceil(hauteurMm * MM) * 2 },
    deviceScaleFactor: echelle,
    reducedMotion: 'reduce',
  });
  const page = await context.newPage();
  await page.route('http://kit.local/**', async (route) => {
    const u = new URL(route.request().url());
    if (u.pathname === '/__kit.html') return route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html });
    const fichier = path.join(racine, decodeURIComponent(u.pathname).replace(/^\/+/, ''));
    if (!fichier.startsWith(racine) || !fs.existsSync(fichier) || fs.statSync(fichier).isDirectory()) return route.fulfill({ status: 404, body: '' });
    return route.fulfill({ status: 200, path: fichier });
  });
  await page.emulateMedia({ media: 'screen' }); // sinon le bloc @media print de craft.css repasse tout en noir sur blanc
  await page.goto('http://kit.local/__kit.html', { waitUntil: 'load' });
  await page.evaluate(() => document.fonts.ready);
  const problemes = await page.evaluate(ajusterDansLaPage, { perdu: FOND_PERDU });
  await page.pdf({ path: path.join(sortie, pdf), preferCSSPageSize: true, printBackground: true });
  // Apercus PNG : la face rognee au format fini (sans le fond perdu), telle qu'elle sortira du massicot.
  const faces = page.locator('.kit-page');
  for (let i = 0; i < apercus.length; i++) {
    const box = await faces.nth(i).boundingBox();
    await page.screenshot({
      path: path.join(sortie, apercus[i]),
      clip: { x: box.x + FOND_PERDU * MM, y: box.y + FOND_PERDU * MM, width: box.width - 2 * FOND_PERDU * MM, height: box.height - 2 * FOND_PERDU * MM },
      fullPage: true,
    });
  }
  await context.close();
  return problemes;
}

/* =====================================================================
   4. README
   ===================================================================== */

function readme({ cfg, url, urlQr, fichiers, alertes }) {
  const l = [];
  l.push(`Livrables : ${cfg.business.name}`);
  l.push(`Générés par ff kit le ${new Date().toLocaleDateString('fr-FR')} à partir du site.`);
  l.push('');
  if (alertes.length) {
    l.push('ATTENTION, données de test encore présentes dans le site : ' + alertes.join(' ; ') + '.');
    l.push('Ne rien imprimer ni publier avant de les avoir remplacées dans site.config.ts, puis relancé ff build et ff kit.');
    l.push('');
  }
  l.push('Ce que contient ce dossier');
  l.push('');
  const desc = {
    'fiche-google.html': 'Fiche Google Business Profile prête à recopier, un bouton « Copier » par champ. À ouvrir dans un navigateur et à remplir par le client ou avec lui, sur son propre compte Google.',
    'fiche-google.md': 'Le même contenu en texte, pour un e-mail ou un document partagé.',
    'photos-google/': 'Les photos du site converties en JPG (Google refuse le WebP), à téléverser sur la fiche.',
    'qr.svg': `QR code vers le site (${urlQr}), en vectoriel : pour l’imprimeur ou un logiciel de mise en page.`,
    'qr.png': 'Le même QR en image 1024 × 1024 px : pour un document bureautique, un autocollant, une vitrine.',
    'carte-visite.pdf': 'Carte de visite 85 × 55 mm, recto et verso (2 pages), avec 3 mm de fond perdu.',
    'carte-visite-recto.png': 'Aperçu du recto au format fini (après coupe).',
    'carte-visite-verso.png': 'Aperçu du verso au format fini.',
    'flyer-a5.pdf': 'Flyer A5 148 × 210 mm, recto seul, avec 3 mm de fond perdu.',
    'flyer-a5.png': 'Aperçu du flyer au format fini.',
  };
  for (const f of fichiers) if (desc[f]) l.push(`- ${f} : ${desc[f]}`);
  l.push('');
  l.push('Impression');
  l.push('');
  l.push('- Fond perdu : 3 mm sur chaque bord, déjà inclus (fichier carte 91 × 61 mm, flyer 154 × 216 mm). L’imprimeur coupe au format fini.');
  l.push('- Marge de sécurité : aucun texte à moins de 5 mm du bord fini.');
  l.push('- Pas de traits de coupe : la plupart des imprimeurs en ligne les refusent ou les ajoutent eux-mêmes. En demander à l’imprimeur si besoin.');
  l.push('- Couleurs : ces PDF sont en RVB (couleurs d’écran). Les imprimeurs en ligne les acceptent et les convertissent en CMJN ; les teintes très vives ou les noirs profonds peuvent sortir un peu plus ternes. Pour un rendu garanti, demander un BAT (bon à tirer) papier.');
  l.push('- Polices : intégrées au PDF, rien à installer.');
  l.push('- Papier conseillé : carte 350 g mat, flyer 135 à 170 g.');
  if (url) {
    l.push(`- Le QR code mène à ${urlQr} : les visites imprimées apparaissent comme « qr / print » dans les statistiques du site. Le scanner une fois sur l’épreuve avant de lancer le tirage.`);
  } else {
    l.push('- Pas de QR code ni d’adresse de site : le site n’a pas encore de domaine. Relancer ff kit après ff domaine.');
  }
  l.push('');
  l.push('Fiche Google');
  l.push('');
  l.push('Elle se remplit sur le compte Google du client (jamais celui du studio), par lui ou avec lui. Les « Note atelier » sont des consignes pour le studio : elles ne se recopient pas.');
  return l.map((x) => corrigerTexte(x)).join('\r\n') + '\r\n';
}

/* =====================================================================
   5. COMMANDE
   ===================================================================== */

function lireDomaine(slug, cfg) {
  const fichier = path.join(SITES_DIR, slug, 'domain.txt');
  if (fs.existsSync(fichier)) {
    const d = fs.readFileSync(fichier, 'utf8').split(/\r?\n/)[0].trim();
    if (d) return d;
  }
  return cfg.domain || '';
}

export async function cmdKit(args) {
  const { positional, flags } = parseArgs(args);
  const slug = positional[0];
  if (!slug) {
    fail('Usage : ff kit <slug> [--sortie livrables/<slug>] [--url https://...]');
    process.exit(1);
  }
  if (!siteExists(slug)) {
    fail(`Site introuvable : sites/${slug}.`);
    process.exit(1);
  }
  const indexHtml = path.join(DIST_DIR, slug, 'index.html');
  if (!fs.existsSync(indexHtml)) {
    fail(`dist/${slug} absent : la carte et le flyer reprennent le CSS et les polices du site construit. Lance d'abord \`node scripts/ff.mjs build ${slug}\`.`);
    process.exit(1);
  }
  const majBuild = fs.statSync(indexHtml).mtimeMs;
  for (const f of ['site.config.ts', 'look.json']) {
    const p = path.join(SITES_DIR, slug, f);
    if (fs.existsSync(p) && fs.statSync(p).mtimeMs > majBuild) {
      warn(`sites/${slug}/${f} est plus récent que dist/${slug} : relance \`ff build ${slug}\` pour que l’impression suive le dernier look.`);
    }
  }

  const { loadSiteConfigModule, cleanTmp } = await import('./ts-loader.mjs');
  let cfg;
  try {
    cfg = (await loadSiteConfigModule(slug)).default;
  } finally {
    cleanTmp();
  }

  const sortie = path.resolve(ROOT, typeof flags.sortie === 'string' ? flags.sortie : path.join('livrables', slug));
  fs.mkdirSync(sortie, { recursive: true });

  const alertes = donneesDeTest(cfg);
  for (const a of alertes) warn(c.yellow(`donnée de test détectée : ${a}`));

  const url = typeof flags.url === 'string' ? urlDuSite(flags.url.replace(/^https?:\/\//, '')) : urlDuSite(lireDomaine(slug, cfg));
  const urlQr = url ? urlAvecUtm(url, { source: 'qr', medium: 'print' }) : '';
  const urlAffichee = url.replace(/^https:\/\//, '').replace(/\/$/, '');
  if (!url) warn('Aucun domaine (domain.txt, domain, --url) : ni QR ni adresse du site sur la carte et le flyer.');

  const fichiers = ['fiche-google.html', 'fiche-google.md'];

  // QR (fichiers autonomes : noir sur blanc, le plus lisible pour un imprimeur)
  const QRCode = (await import('qrcode')).default;
  let qr = null;
  if (urlQr) {
    const options = { errorCorrectionLevel: 'M', margin: 4, color: { dark: '#000000', light: '#ffffff' } };
    fs.writeFileSync(path.join(sortie, 'qr.svg'), await QRCode.toString(urlQr, { ...options, type: 'svg' }));
    await QRCode.toFile(path.join(sortie, 'qr.png'), urlQr, { ...options, type: 'png', width: 1024 });
    qr = cheminQr(QRCode.create(urlQr, { errorCorrectionLevel: 'M' }).modules, 2);
    fichiers.push('qr.svg', 'qr.png');
    ok(`QR : ${urlQr}`);
  }

  // Photos pour la fiche Google, converties en JPG
  const sharp = (await import('sharp')).default;
  const photos = photosDuSite(slug, cfg);
  const dossierPhotos = path.join(sortie, 'photos-google');
  fs.rmSync(dossierPhotos, { recursive: true, force: true });
  let n = 0;
  for (const p of photos.filter((x) => !x.exclue)) {
    fs.mkdirSync(dossierPhotos, { recursive: true });
    p.jpg = `${String(++n).padStart(2, '0')}-${path.basename(p.src).replace(/\.[^.]+$/, '')}.jpg`;
    await sharp(p.fichier).flatten({ background: '#ffffff' }).resize({ width: 2048, height: 2048, fit: 'inside', withoutEnlargement: true }).jpeg({ quality: 88 }).toFile(path.join(dossierPhotos, p.jpg));
  }
  if (n) fichiers.push('photos-google/');
  for (const p of photos.filter((x) => x.exclue)) warn(`Photo écartée de la fiche Google : ${p.relatif} (${p.exclue})`);

  // Fiche Google
  const fiche = ficheGoogle({ slug, cfg, url, photos, alertes });
  fs.writeFileSync(path.join(sortie, 'fiche-google.html'), ficheHtml(fiche));
  fs.writeFileSync(path.join(sortie, 'fiche-google.md'), ficheMarkdown(fiche));
  ok('Fiche Google : fiche-google.html + fiche-google.md');
  if (!categoriesGbp(cfg.business.trade, cfg.business.schemaType)) warn(`Catégorie Google à choisir à la main : métier « ${cfg.business.trade} » absent de la table (CATEGORIES_GBP).`);

  // Impression, un seul Chrome pour les deux documents
  const site = cssDuSite(fs.readFileSync(indexHtml, 'utf8'));
  const zone = zoneLisible(cfg);
  const heroSrc = cfg.images?.hero?.src;
  // Une image de démonstration (texte alternatif) n'est pas imprimée : flyer typographique à la place.
  const demo = /d[ée]monstration|placeholder|provisoire|illustration/i.test(cfg.images?.hero?.alt || '');
  const photo = heroSrc && !demo && fs.existsSync(path.join(DIST_DIR, slug, heroSrc.replace(/^\/+/, ''))) ? cfg.images.hero : null;
  const { chromium } = await import('playwright-core');
  const browser = await chromium.launch({ channel: process.env.FF_CHROMIUM ? undefined : 'chrome', headless: true });
  const problemes = [];
  try {
    problemes.push(
      ...(await imprimer({
        browser, slug, sortie,
        html: htmlCarte({ site, cfg, qr, urlAffichee, zone }),
        pdf: 'carte-visite.pdf', apercus: ['carte-visite-recto.png', 'carte-visite-verso.png'],
        largeurMm: 85 + 2 * FOND_PERDU, hauteurMm: 55 + 2 * FOND_PERDU, echelle: 4,
      })),
    );
    fichiers.push('carte-visite.pdf', 'carte-visite-recto.png', 'carte-visite-verso.png');
    ok('Carte de visite : carte-visite.pdf (+ aperçus PNG)');
    problemes.push(
      ...(await imprimer({
        browser, slug, sortie,
        html: htmlFlyer({ site, cfg, qr, urlAffichee, zone, photo }),
        pdf: 'flyer-a5.pdf', apercus: ['flyer-a5.png'],
        largeurMm: 148 + 2 * FOND_PERDU, hauteurMm: 210 + 2 * FOND_PERDU, echelle: 2,
      })),
    );
    fichiers.push('flyer-a5.pdf', 'flyer-a5.png');
    ok('Flyer A5 : flyer-a5.pdf (+ aperçu PNG)');
  } finally {
    await browser.close();
  }

  fs.writeFileSync(path.join(sortie, 'README.txt'), readme({ cfg, url, urlQr, fichiers, alertes }));
  for (const p of problemes) warn(`Mise en page : ${p}`);
  info('');
  ok(`Livrables dans ${path.relative(ROOT, sortie) || sortie}${path.sep}`);
  if (alertes.length) warn(c.yellow(`Données de test encore présentes (${alertes.length}) : ne rien imprimer avant de les remplacer.`));
}
