/** Charge le site courant (import.meta.env.SITE, pose par astro.config.mjs). */
import type { Site } from './schema';

import { siteSchema } from './schema';
export { schemaTypeForTrade } from './schemaType';
import { actions as actionsFor } from './actions';
export { hasContactDoor, ACTION_LABELS, ACTION_ICONS } from './actions';
export type { Action, ActionKind } from './actions';
export { conseilsTries, dateConseil, lienConseils } from './conseils';
import { lienConseils } from './conseils';
export { agendaAVenir, dateAgenda, categoriesAgenda, lienAgenda, isoDuJour } from './agenda';
import { lienAgenda, isoDuJour } from './agenda';
export { categoriesProduits, autresProduits, lienProduits, prixEnOffre } from './produits';
import { lienProduits } from './produits';
export { telDuLieu, adresseDuLieu, autresLieux, liensLieux, lienPros, lieuxComplets } from './lieux';
import { liensLieux, lienPros } from './lieux';
export { slugTexte, saisonsDe, groupesParSaison, saisonsCompletes, sortiesDuService, niveauxDe, sortiesEnAvant, publicsDe, liensSaisons, TOUTE_L_ANNEE } from './sorties';
import { liensSaisons } from './sorties';
export { programmeDeLaSemaine, avecProgramme, joursCouverts, entreesDistinctes, exceptionsAVenir, dateLongue, lienProgramme, JOURS_ARDOISE } from './ardoise';
import { lienProgramme } from './ardoise';
export { slugCommune, etapesParJour, communesDe, telDeLEtape, etapeDuMoment, libelleDuMoment, lienTournee, etapesCompletes, JOURS_TOURNEE } from './tournee';
import { lienTournee } from './tournee';
export { slugStyle, stylesDe, artistesDuStyle, autresArtistes, contactsDeLArtiste, residentsEtInvites, lienArtistes, artistesComplets } from './artistes';
import { lienArtistes } from './artistes';
export { fetesAVenir, feteDuMoment, etatCommande, joursEntre, dateFete, periodeFete, formatHeure, livraisonDuMoment, lienFetes, fetesCompletes } from './fetes';
import { lienFetes } from './fetes';
export { ajouterJours, nuitsEntre, nuitPrise, sejourLibre, departMax, fusionnerPeriodes, periodesAVenir, moisDuCalendrier, lireIcs, dateSejour, libelleSejour, nuitsLibres, calendrierConnu, lienDisponibilites, JOURS_COURTS } from './sejour';
import { lienDisponibilites } from './sejour';
export { barreauxComplets, voisins, prixDepuis, liensParcours, avisDuBarreau, avisGeneraux } from './parcours';
import { liensParcours } from './parcours';
export { situationsCompletes, minutesDe, creneauDuMoment, prixDes, prixLePlusBas, lienTarifs } from './tarifs';
import { lienTarifs } from './tarifs';
export { etapesCompletes as etapesDEnvoi, pisteDEnvoi, adresseDEnvoi, lienEnvoi } from './colis';
import { lienEnvoi } from './colis';
export { minutesDeDuree, soinsDates, tranches as tranchesDeSoins } from './soins';
export { piecesAvantApres, paireDe, typesDePieces, groupesDePieces } from './avantapres';
export { JOURS_PLANNING, coursValides, joursDuPlanning, disciplines as disciplinesDuPlanning, cleDiscipline, dureeDuCours, heureLisible, coursDuService, indexDuJour, lienPlanning } from './planning';
import { lienPlanning } from './planning';
export { materielsComplets, categoriesDe as categoriesDeMateriel, prixDuMateriel, aPrixPro, premierPrix, lienMateriel, SANS_CATEGORIE } from './location';
import { lienMateriel } from './location';
export { questionsValides, etapesDe as etapesDEstimation, lienEstimation, projetDe, lignesDeDemande } from './estimation';
import { lienEstimation } from './estimation';
export { formulesCompletes, reprise as repriseDeFormule, inclusDeplies, lignesComparees, lienFormules, formuleDe } from './formules';
import { lienFormules } from './formules';
export { appareilsComplets, famillesDe as famillesDAppareils, prixDe as prixDAppareil, marquesDe as marquesDAppareil, slugPanne, marquesParLettre, toutesLesMarques, lienAppareils, SANS_FAMILLE } from './appareils';
import { lienAppareils } from './appareils';
export { JOURS_RETRAIT, indexJour as indexJourRetrait, heureLisible as heureDeRetrait, pointsComplets, pointsParJour, clotureValide, phraseDuCycle, prochainCycle, libelleDecalage, lienRetrait } from './retrait';
import { lienRetrait } from './retrait';
export { CONFIGURATIONS, sallesCompletes, configurationsDe, capaciteMax, capacite as capaciteDeSalle, phraseCapacites, sallesPour, phraseReponse, lienSalles } from './salles';
import { lienSalles } from './salles';
export { CLASSES as CLASSES_DPE, PROJETS as PROJETS_BIENS, biensComplets, projetsDe as projetsDeBiens, typesDe as typesDeBiens, prixLisible as prixDuBien, resume as resumeDuBien, surface as surfaceLisible, echelle as echelleDpe, mentionsManquantes, lienBiens } from './biens';
import { lienBiens } from './biens';
export { REVENDEURS_MIN, revendeursComplets, slugSecteur, secteursDe, typesDe as typesDeRevendeurs, phraseSecteur, pourType, lienRevendeurs } from './revendeurs';
import { lienRevendeurs } from './revendeurs';
export { profilsComplets, praticiensComplets, praticiensDe, resumeProfil, lienProfils } from './profils';
import { lienProfils } from './profils';
export { especesCompletes, etapesGarde, signesGarde, numeroDeGarde, numeroDuMoment, gardeLisible, lienEspeces, lienUrgences } from './garde';
import { lienEspeces, lienUrgences } from './garde';
export { premiersPas, modesComplets, domainesAPrix, resumePas, honorairesLisibles, lienHonoraires } from './honoraires';
import { lienHonoraires } from './honoraires';
export { kindsDeGalerie, idDeKind, metaDeRealisation, libelleCompteur, COMPTEUR_MIN, SEPARATEUR_META } from './galerie';
export { ARCHITECTURES, ARCHITECTURE_IDS, architecture, donneesManquantes, photosDuClient, nombreDeRealisations } from './architectures';
import { completerLayout, COQUILLES_A_INDEX_REALISATIONS } from './architectures';

import { config as siteConfig, lookFile, hasCredits, photosBanque } from 'virtual:ff-look';

export { hasCredits, photosBanque };

// Le config et le look.json du site courant sont resolus au build par scripts/vite-ff-look.mjs :
// les autres sites ne sont jamais lus (isolation : un site casse n'en bloque aucun autre).
const slug = import.meta.env.SITE as string;
const mod = { default: siteConfig as Site };

/**
 * look.json (optionnel, ecrit par `ff studio`) : surcharge uniquement le LOOK
 * (direction, motion, scale, accent, typography, layout, wording) sans toucher au contenu.
 * Permet de changer d'apparence sans editer le TypeScript ; `ff studio --figer` le fusionne dans site.config.ts.
 */
const LOOK_KEYS = ['direction', 'motion', 'smoothScroll', 'transitions', 'scale', 'accent', 'typography', 'layout', 'wording'] as const;
function applyLook(base: Site, look: Record<string, unknown> | undefined): Site {
  if (!look) return base;
  // Un look qui choisit une architecture (layout.architecture) en apporte les reglages de layout qu'il ne precise
  // pas lui-meme : ils remplacent ceux du site (src/lib/architectures.ts, completerLayout).
  const lookLayout = look.layout as Record<string, unknown> | undefined;
  if (lookLayout && typeof lookLayout === 'object' && lookLayout.architecture) look = { ...look, layout: completerLayout(lookLayout) };
  const merged: Record<string, unknown> = { ...base };
  for (const k of LOOK_KEYS) {
    if (look[k] === undefined) continue;
    const cur = merged[k];
    merged[k] = cur && typeof cur === 'object' && !Array.isArray(cur) && typeof look[k] === 'object' && !Array.isArray(look[k])
      ? { ...(cur as object), ...(look[k] as object) }
      : look[k];
  }
  const parsed = siteSchema.safeParse(merged);
  if (!parsed.success) {
    console.warn(`look.json ignore (invalide) : ${parsed.error.issues.map((i) => i.path.join('.') + ' ' + i.message).join(' ; ')}`);
    return base;
  }
  return parsed.data;
}

// FF_LOOK (variable d'environnement, posee par `ff propositions` / `ff matrice`) prime sur look.json
// et ne touche jamais au dossier du site : un build interrompu ne laisse aucune trace.
const envLookRaw = (import.meta.env.FF_LOOK as string | undefined) || '';
const envLook = envLookRaw ? (JSON.parse(envLookRaw) as Record<string, unknown>) : undefined;
const fileLook = lookFile as Record<string, unknown> | undefined;

export const site: Site = applyLook(mod.default, envLook ?? fileLook);
export const lookActif = Boolean(envLook ?? fileLook);
export const slugCourant = slug;

/** Helpers partages par les sections. */
export const tel = (s: Site = site) => `tel:${s.contact.phone}`;
export const mailto = (s: Site = site) => (s.contact.email ? `mailto:${s.contact.email}` : undefined);
export const whatsapp = (s: Site = site) => (s.contact.whatsapp ? `https://wa.me/${s.contact.whatsapp}` : undefined);
export const fullAddress = (s: Site = site) =>
  [s.contact.address.street, `${s.contact.address.postalCode} ${s.contact.address.city}`].filter(Boolean).join(', ');
/**
 * Ligne « métier à ville » au-dessus du h1, sauf si le h1 (tagline) la dit déjà : sinon le premier écran répète
 * deux fois « Boulangerie-pâtisserie à Orléans » (essai Épi d'Or, 21 oct 2026).
 */
export const ligneMetier = (s: Site = site) => {
  const norm = (x: string) => x.replace(/<[^>]*>/g, ' ').normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, ' ').trim();
  const l = `${s.business.trade} à ${s.contact.address.city}`;
  return norm(s.business.tagline ?? '').includes(norm(s.business.trade)) ? '' : l;
};
export const yearsSince = (s: Site = site) => (s.business.since ? new Date().getFullYear() - s.business.since : undefined);
export const featuredServices = (s: Site = site) => s.services.filter((x) => x.featured);
/**
 * Le client se déplace autour de sa ville : zones.cities ou zones.radiusKm renseignés. Seule condition pour
 * écrire « et alentours » (un zones.label seul nomme le lieu, pas une zone desservie : 17 oct 2026,
 * fromagerie-ravanel-d, « Fromager-affineur à Annecy et alentours » qui n'était pas dans le brief).
 */
export const zonesDesservies = (s: Site = site) => s.zones.cities.length > 0 || s.zones.radiusKm != null;
/** « Plombier à Roubaix et alentours. » si zonesDesservies(), sinon « Fromager-affineur à Annecy. » */
export const metierEtVille = (s: Site = site) =>
  `${s.business.trade} à ${s.contact.address.city}${zonesDesservies(s) ? ' et alentours' : ''}.`;
/**
 * Portes d'action par intention, dans l'ordre : Réserver, Commander, Bon cadeau, Devis, Appeler
 * (src/lib/actions.ts, module pur). Navs : 2 visibles sur ordinateur (pleine puis contour), 1 sur
 * téléphone, le reste dans le menu ; barre d'actions (layout.actionBar) : 2 à 4.
 */
export const actions = (s: Site = site) => actionsFor(s);
/**
 * Photos du client déclarées par le site, sans doublon et sans la photo de couverture (images.hero) : portrait,
 * réalisations (galerie puis séries), photos des services. Pour les architectures qui posent une photo par écran ou
 * par panneau (livre-ecrans, panneaux-tranche, carnet-horizontal) : rien n'est inventé, une photo absente n'est pas
 * remplacée.
 */
export const photosDuSite = (s: Site = site) => {
  const vues = new Set<string>(s.images.hero ? [s.images.hero.src] : []);
  const out: { src: string; alt: string }[] = [];
  const candidates = [
    s.about.portrait,
    ...s.about.espaces.map((e) => e.photo),
    ...s.proof.gallery,
    ...s.realisations.flatMap((r) => r.photos),
    ...s.services.flatMap((x) => [x.image, ...x.images]),
    ...s.produits.flatMap((p) => [p.photo, ...p.photos]),
    ...s.lieux.flatMap((l) => [l.photo, ...l.photos]),
    ...s.sorties.map((x) => x.photo),
  ];
  for (const p of candidates) {
    if (!p || vues.has(p.src)) continue;
    vues.add(p.src);
    out.push({ src: p.src, alt: p.alt });
  }
  return out;
};
export const paragraphs = (text: string) =>
  text
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

/** Slug d'une ville pour /zones/<slug> : minuscules, accents retires, non-alphanumerique -> '-'. */
export const citySlug = (city: string) =>
  city
    .replace(/œ/g, 'oe').replace(/Œ/g, 'Oe').replace(/æ/g, 'ae').replace(/Æ/g, 'Ae')
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');

/** Ancres de navigation : seulement les sections presentes dans le layout. */
export const navLinks = (s: Site = site) => {
  const labels: Record<string, string> = {
    services: s.wording.servicesNav ?? 'Services',
    about: 'À propos',
    // Une galerie seule (ni note, ni avis recopiés) n'est pas un bloc d'avis : l'ancre dit « En images » (titre de proof/gallery).
    proof: !s.proof.google && s.proof.testimonials.length === 0 && s.proof.gallery.length > 0 ? 'En images' : 'Avis',
    zones: 'Zones',
    process: 'Méthode',
    faq: 'FAQ',
    contact: 'Contact',
  };
  const seen = new Set<string>();
  const links = s.layout.sections
    .filter((x) => x.type !== 'cta')
    .filter((x) => (x.type === 'custom' ? Boolean(x.label) : !seen.has(x.type) && seen.add(x.type)))
    .map((x) => x.type === 'custom'
      ? { href: `/#${x.variant.toLowerCase()}`, label: x.label as string }
      : { href: `/#${x.type}`, label: labels[x.type] ?? x.type });
  // Section « proof » sans aucune preuve (ni note Google, ni avis, ni logos, ni photos) : elle ne rend rien, la nav ne
  // pointe pas vers elle (« ancre interne sans cible » de ff verifier ; client sans avis encore, 28 oct 2026).
  const pr = s.proof;
  if (!pr.google && pr.testimonials.length === 0 && pr.logos.length === 0 && pr.gallery.length === 0 && pr.beforeAfter.length === 0) {
    const iP = links.findIndex((l) => l.href === '/#proof');
    if (iP !== -1) links.splice(iP, 1);
  }
  // Contact en tiroir (layout.contactDrawer) sans section contact dans le layout : le tiroir est la
  // seule porte, la nav recoit donc une ancre #contact que ContactDrawer.astro intercepte.
  // Ancres absolues (« /#contact ») : depuis la 404, la confidentialité ou une page service, « #contact » ne mène
  // nulle part (contrôle « ancre interne sans cible » de ff verifier, 17 oct 2026).
  if (s.layout.contactDrawer && !links.some((l) => l.href === '/#contact')) links.push({ href: '/#contact', label: labels.contact });
  // Page /a-propos (layout.pageAPropos, architecture index-projets) : un lien de page, avant Contact.
  if (s.layout.pageAPropos) {
    const iA = links.findIndex((l) => l.href === '/#about');
    if (iA !== -1) links.splice(iA, 1);
    const iC = links.findIndex((l) => l.href === '/#contact');
    links.splice(iC === -1 ? links.length : iC, 0, { href: '/a-propos', label: labels.about });
  }
  // Gabarit de page « porte » (architecture accueil-portes) : chaque activité est une page, la nav les nomme une à une
  // (les rubriques de Maisons de Bricourt) au lieu de l'ancre #services.
  // Coquille `planning` (architecture planning-semaine) : les disciplines se trouvent par le planning (son filtre, ses
  // cours, le bloc « Venir au cours ») ; la nav garde « Le planning » seul, comme la barre de la source garde « Cours ».
  if (s.layout.servicePage === 'porte' && s.servicePages && s.layout.shell !== 'planning') {
    const i = links.findIndex((l) => l.href === '/#services');
    const pages = s.services.map((x) => ({ href: `/services/${x.slug}`, label: x.title }));
    if (i === -1) links.unshift(...pages); else links.splice(i, 1, ...pages);
  }
  // Saisons (src/lib/sorties.ts, architecture saisons-sorties) : dès deux saisons et la section services/saisons sur
  // l'accueil, l'ancre #services devient une entrée par saison (« Été », « Hiver » : les deux mots de la nav du Bureau
  // des guides de La Grave), chacune vers son groupe.
  // Coquille `saisons` : les saisons sont le premier écran, leurs entrées ouvrent la nav.
  if (s.layout.shell === 'saisons' || s.layout.sections.some((x) => x.type === 'services' && x.variant === 'saisons')) {
    const saisons = liensSaisons(s.services);
    const i = links.findIndex((l) => l.href === '/#services');
    if (saisons.length > 0) {
      if (i !== -1) links.splice(i, 1, ...saisons);
      else links.unshift(...saisons);
    }
  }
  // Adresses (src/lib/lieux.ts, architecture pages-adresses) : des pages, pas une ancre. Une ou deux adresses : leur nom ;
  // trois et plus : « Nos adresses » vers /adresses. Avant Contact.
  const lieux = liensLieux(s.lieux ?? [], s.wording.lieux);
  // Le bandeau zones/adresses n'est jamais une ancre de nav (sans lieu, il n'est pas rendu : l'ancre mènerait nulle part).
  if (lieux.length > 0 || s.layout.sections.some((x) => x.type === 'zones' && x.variant === 'adresses')) {
    const iZ = links.findIndex((l) => l.href === '/#zones');
    if (iZ !== -1) links.splice(iZ, 1);
  }
  if (lieux.length > 0) {
    const iC = links.findIndex((l) => l.href === '/#contact');
    links.splice(iC === -1 ? links.length : iC, 0, ...lieux);
  }
  // Rubrique conseils (src/lib/conseils.ts) : une page, pas une ancre ; seulement si le client a des articles.
  const conseils = lienConseils(s.conseils ?? [], s.wording.conseils);
  if (conseils) {
    const iContact = links.findIndex((l) => l.href === '/#contact');
    links.splice(iContact === -1 ? links.length : iContact, 0, conseils);
  }
  // Agenda (src/lib/agenda.ts, architecture cartes-empilees-agenda) : une page, en tête de la nav (« Agenda » est la
  // porte toujours en haut de De Groene Afslag) ; seulement s'il reste un rendez-vous à venir.
  // Liste des réalisations (coquilles panneaux et carnet) : une page, en tête de la nav.
  if (COQUILLES_A_INDEX_REALISATIONS.includes(s.layout.shell) && s.realisations.length > 0) links.unshift({ href: '/realisations', label: 'Réalisations' });
  const agenda = lienAgenda(s.agenda ?? [], s.wording.agenda);
  if (agenda) links.unshift(agenda);
  // Produits (src/lib/produits.ts, architecture gamme-vitrine) : la gamme est le site, son lien ouvre la nav.
  const produits = lienProduits(s.produits ?? [], s.wording.produits);
  if (produits) links.unshift(produits);
  // Tournée (src/lib/tournee.ts, architecture tournee-semaine) : une page, pas une ancre ; l'ancre #zones de la semaine
  // (zones/tournee) cède la place à /tournee, avant Contact.
  const tournee = lienTournee(s.tournee ?? [], s.wording.tournee);
  if (tournee) {
    const iZ = links.findIndex((l) => l.href === '/#zones');
    if (iZ !== -1) links.splice(iZ, 1, tournee);
    else links.splice(0, 0, tournee);
  }
  // Programme de la semaine (src/lib/ardoise.ts, architecture ardoise-du-jour) : une page, avant Contact.
  const programme = lienProgramme(s.services, s.wording.programme);
  if (programme) {
    const iC = links.findIndex((l) => l.href === '/#contact');
    links.splice(iC === -1 ? links.length : iC, 0, programme);
  }
  // Artistes (src/lib/artistes.ts, architecture artistes-residents) : la maison se choisit par ses artistes, leur page
  // ouvre la nav (« Artistes » est la deuxième entrée de Mystery Tattoo Club, après Accueil).
  const artistes = lienArtistes(s.artistes ?? [], s.wording.artistes);
  if (artistes) links.unshift(artistes);
  // Fêtes (src/lib/fetes.ts, architecture calendrier-fetes) : le calendrier ouvre la nav (« Toussaint » est la première
  // entrée de Touchard Fleurs) ; seulement s'il reste une fête à venir au build.
  const fetes = lienFetes(s.fetes ?? [], s.wording.fetes, isoDuJour());
  if (fetes) links.unshift(fetes);
  // Disponibilités (src/lib/sejour.ts, architecture outil-calendrier) : la page du calendrier entier, en tête de la nav
  // (« Boeken » est le bouton toujours visible de Coquelicots ; la porte Réserver saute à l'outil de l'accueil).
  const dispo = lienDisponibilites(s.disponibilites, s.wording.disponibilites);
  if (dispo) links.unshift(dispo);
  // Parcours (src/lib/parcours.ts, architecture parcours-atelier) : chaque barreau est une page, la nav les nomme en tête
  // (« Classes », « Membership » de Turning Earth).
  const parcours = liensParcours(s.parcours ?? []);
  if (parcours.length > 0) links.unshift(...parcours);
  // Grille de prix (src/lib/tarifs.ts, architecture grille-urgence) : « Prestations » / « Tarifs » de Serrure Ouest, en
  // tête de la nav, vers la grille complète (/tarifs).
  const tarifs = lienTarifs(s.tarifs, s.wording.tarifs);
  if (tarifs) links.unshift(tarifs);
  // Réparation par colis (src/lib/colis.ts, architecture atelier-par-colis) : la marche à suivre entière (/envoyer), en
  // tête de la nav (« Faire réparer ma montre » d'AGH, bouton à part de sa barre).
  const envoi = lienEnvoi(s.envoi, s.wording.envoi);
  if (envoi) links.unshift(envoi);
  // Planning de la semaine (src/lib/planning.ts, architecture planning-semaine) : « Planning » de la barre de Germain
  // Blanchet, en tête de la nav, vers la semaine entière (/planning).
  const planning = lienPlanning(s.planning, s.wording.planning);
  if (planning) links.unshift(planning);
  // Catalogue de location (src/lib/location.ts, architecture catalogue-location) : « Nos outils » de Location Service, en
  // tête de la nav, vers le parc entier (/materiel).
  const materiel = lienMateriel(s.location, s.wording.materiel);
  if (materiel) links.unshift(materiel);
  // Formules à prix (src/lib/formules.ts, architecture formules-comparees) : « Pricing » de GreenCraft, en tête de la nav,
  // vers la comparaison entière (/formules).
  const formules = lienFormules(s.formules, s.wording.formules);
  if (formules) links.unshift(formules);
  // Appareils réparés (src/lib/appareils.ts, architecture appareils-pannes) : « Réparer » de Satisfix, en tête de la nav,
  // vers tous les appareils et leurs pannes (/appareils).
  const appareils = lienAppareils(s.appareils, s.wording.appareils);
  if (appareils) links.unshift(appareils);
  // Points de retrait (src/lib/retrait.ts, architecture commande-retrait) : « Lieux de livraison » de Riedoasis, en tête de
  // la nav, vers tous les points par jour (/retrait).
  const retrait = lienRetrait(s.retrait, s.wording.retrait);
  if (retrait) links.unshift(retrait);
  // Salles d'un lieu de réception (src/lib/salles.ts, architecture salles-capacites) : « Nos espaces » du Domaine de la
  // Touche, en tête de la nav, vers le tableau des capacités et toutes les salles (/salles).
  const salles = lienSalles(s.salles, s.wording.salles);
  if (salles) links.unshift(salles);
  // Biens d'une agence (src/lib/biens.ts, architecture annonces-biens) : « Acheter / Louer » de Royal Immo, en tête de la
  // nav, vers toute la vitrine (/biens).
  const biens = lienBiens(s.biens, s.wording.biens);
  if (biens) links.unshift(biens);
  // Revendeurs d'un producteur (src/lib/revendeurs.ts, architecture revendeurs-secteurs) : « Points de vente » de la
  // Brasserie des Garrigues, en tête de la nav, vers tous les secteurs (/ou-trouver).
  const revendeurs = lienRevendeurs(s.revendeurs, s.wording.revendeurs);
  if (revendeurs) links.unshift(revendeurs);
  // Fiches par adresse (zones/fiches, style experimentalcc) avec des revendeurs : la page /ou-trouver est déjà en tête de la nav,
  // l'ancre « Zones » vers le même bloc ferait doublon (la fiche pointe elle-même vers les pages de secteur).
  if (revendeurs && s.layout.sections.some((x) => x.type === 'zones' && x.variant === 'fiches')) {
    const iZ = links.findIndex((l) => l.href === '/#zones');
    if (iZ !== -1) links.splice(iZ, 1);
  }
  // Profils de patients (src/lib/profils.ts, architecture profils-patients) : « Pour qui ? » des Ostéopathes à Lyon
  // Préfecture, en tête de la nav, vers tous les profils (/consulter).
  const profils = lienProfils(s.profils, s.wording.profils);
  if (profils) links.unshift(profils);
  // Espèces d'une clinique vétérinaire (src/lib/garde.ts, architecture garde-especes) : les conseils « Chiens, Chats, NACs »
  // des Quais, en tête de la nav, vers toutes les espèces (/animaux) ; « URGENCES » en dernier, comme aux Quais.
  const especes = lienEspeces(s.especes, s.wording.especes);
  if (especes) links.unshift(especes);
  const urgences = lienUrgences(s.garde, s.wording.urgences);
  if (urgences) links.push(urgences);
  // Honoraires d'un cabinet d'avocat (src/lib/honoraires.ts, architecture honoraires-domaines) : « Honoraires » dans la barre
  // de Faltot et de Judisis, vers /nos-honoraires (/honoraires est le barème des agences immobilières).
  const honoraires = lienHonoraires(s.honoraires, s.wording.honoraires);
  if (honoraires) links.push(honoraires);
  // Demande d'estimation (src/lib/estimation.ts, architecture estimation-etapes) : « Devis en ligne » de Rigoulet, toujours
  // dans la barre ; en dernier, à la place d'une porte Contact (la demande EST le contact).
  const estimation = lienEstimation(s.estimation, s.wording.estimation);
  if (estimation) links.push(estimation);
  // Coquille `estimation` : la barre de Rigoulet nomme les prestations (une page chacune) et « Devis en ligne », pas des
  // ancres de l'accueil ; les avis et les communes se lisent en descendant sous la demande.
  if (s.layout.shell === 'estimation' && s.servicePages) {
    const pages = s.services.map((x) => ({ href: `/services/${x.slug}`, label: x.title }));
    const garde = links.filter((l) => !['/#services', '/#proof', '/#zones', '/#about'].includes(l.href));
    links.splice(0, links.length, ...pages, ...garde);
  }
  // Professionnels (site.pros, architecture pages-adresses) : un lien discret, en dernier.
  const pros = lienPros(s.pros, s.wording.pros);
  if (pros) links.push(pros);
  return links;
};
