// Charge du TypeScript (src/lib/*.ts) sans passer par un build Astro — utilise par `ff matrice`
// (scripts/ff/matrice.mjs) pour lire DIRECTIONS/VARIANTS/DIVIDERS/SCALES/TONES et le contenu reel
// de sites/_exemple/site.config.ts, et par tests/*.test.mjs pour les memes raisons.
// Node 22 sait "type-stripper" du TS simple (pas d'enum, pas de decorateurs) sans flag ni
// transpilation, mais la resolution ESM standard exige une extension explicite sur les specifiers
// relatifs — ce que src/lib/*.ts (ecrit pour le bundler Astro/Vite) omet, et l'alias '@/lib/...'
// n'existe que dans tsconfig.json/astro, pas pour node. On copie donc les fichiers necessaires dans
// <racine>/.ff-tmp/ en reecrivant imports relatifs (+extension) et alias (chemin relatif), puis on
// les importe normalement. Si un jour node ne sait plus lire un .ts directement (flag retire...),
// les appelants de canImportTs() peuvent retomber sur une extraction regex du texte source.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
export const ROOT = path.resolve(HERE, '..', '..');
// Prefixe par le pid : `node --test tests/` lance chaque fichier de test dans son propre processus,
// en parallele ; un dossier temporaire partage provoquerait des courses (l'un supprime pendant que
// l'autre lit/ecrit). Chaque processus a donc son propre TMP_DIR, nettoye par son propre cleanTmp().
export const TMP_DIR = path.join(ROOT, '.ff-tmp', `ts-loader-${process.pid}`);

/** Ajoute ".ts" aux specifiers relatifs sans extension dans un import/export. */
function addTsExtensions(src) {
  return src.replace(/((?:from|import)\s+)(['"])(\.\.?\/[^'"]+)\2/g, (m, kw, q, spec) => {
    if (/\.[a-zA-Z0-9]+$/.test(spec)) return m;
    return `${kw}${q}${spec}.ts${q}`;
  });
}

/**
 * Verifie que node peut importer un .ts directement (type-stripping actif, syntaxe simple).
 * Renvoie true/false ; ne lance jamais.
 */
export async function canImportTs() {
  try {
    await import(pathToFileURL(path.join(ROOT, 'src', 'lib', 'fonts.ts')).href);
    return true;
  } catch {
    return false;
  }
}

/**
 * Copie src/lib/schema.ts + src/lib/fonts.ts dans TMP_DIR/lib/ avec imports relatifs corriges,
 * puis les importe. Renvoie le module schema (DIRECTIONS, VARIANTS, MOTION, DIVIDERS, SCALES,
 * TONES, siteSchema, defineSite...).
 */
export async function loadSchemaModule() {
  const libDir = path.join(TMP_DIR, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  // architectures.ts : module pur importe par schema.ts (layout.architecture, completerLayout).
  for (const name of ['schema.ts', 'fonts.ts', 'architectures.ts']) {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', name), 'utf8');
    fs.writeFileSync(path.join(libDir, name), addTsExtensions(src));
  }
  const url = pathToFileURL(path.join(libDir, 'schema.ts')).href;
  return import(url);
}

/**
 * Copie sites/<slug>/site.config.ts dans TMP_DIR/sites/<slug>/, en remplacant l'alias
 * '@/lib/schema' par un chemin relatif vers la copie de schema.ts prepare par loadSchemaModule(),
 * puis l'importe. Renvoie le module (export default = objet Site deja valide par defineSite).
 */
export async function loadSiteConfigModule(slug) {
  await loadSchemaModule(); // assure que TMP_DIR/lib/schema.ts existe
  const srcPath = path.join(ROOT, 'sites', slug, 'site.config.ts');
  const destDir = path.join(TMP_DIR, 'sites', slug);
  fs.mkdirSync(destDir, { recursive: true });
  let src = fs.readFileSync(srcPath, 'utf8');
  src = src.replace(/(['"])@\/lib\/schema\1/g, `'../../lib/schema.ts'`);
  const destPath = path.join(destDir, 'site.config.ts');
  fs.writeFileSync(destPath, src);
  const url = pathToFileURL(destPath).href;
  return import(url);
}

/**
 * Copie src/lib/schemaType.ts (module pur, aucune dependance) dans TMP_DIR/lib/ et l'importe.
 * Renvoie { schemaTypeForTrade } — re-exporte par src/lib/site.ts mais teste ici isolement, car
 * site.ts ne s'importe pas dans Node nu (import.meta.glob n'existe que sous Vite).
 */
export async function loadSchemaTypeModule() {
  const libDir = path.join(TMP_DIR, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'schemaType.ts'), 'utf8');
  fs.writeFileSync(path.join(libDir, 'schemaType.ts'), addTsExtensions(src));
  const url = pathToFileURL(path.join(libDir, 'schemaType.ts')).href;
  return import(url);
}

/**
 * Copie src/lib/jsonld.ts + src/lib/schemaType.ts (sa seule dependance runtime) dans TMP_DIR/lib/
 * et les importe. Renvoie { daysOfWeek, openingHoursSpecification, faqPageLd, serviceLd }.
 */
export async function loadJsonLdModule() {
  const libDir = path.join(TMP_DIR, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  for (const name of ['jsonld.ts', 'schemaType.ts']) {
    const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', name), 'utf8');
    fs.writeFileSync(path.join(libDir, name), addTsExtensions(src));
  }
  const url = pathToFileURL(path.join(libDir, 'jsonld.ts')).href;
  return import(url);
}

/**
 * Copie src/lib/credits.ts (module pur, aucune dependance) dans TMP_DIR/lib/ et l'importe.
 * Renvoie { parseCredits, requiresAttribution, entriesRequiringAttribution }.
 */
export async function loadCreditsModule() {
  const libDir = path.join(TMP_DIR, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', 'credits.ts'), 'utf8');
  fs.writeFileSync(path.join(libDir, 'credits.ts'), addTsExtensions(src));
  const url = pathToFileURL(path.join(libDir, 'credits.ts')).href;
  return import(url);
}

/**
 * Copie src/lib/actions.ts (module pur : son seul import est un `import type` du schema, efface par
 * le type-stripping) dans TMP_DIR/lib/ et l'importe. Renvoie { actions, hasContactDoor, ACTION_LABELS,
 * ACTION_ICONS } — re-exporte par src/lib/site.ts, teste ici isolement (tests/actions.test.mjs).
 */
export async function loadActionsModule() {
  return loadPureLibModule('actions.ts');
}

/**
 * Copie src/lib/horaires.ts (module pur, aucune dependance) dans TMP_DIR/lib/ et l'importe.
 * Renvoie { joursDe, semaine, formatHeure, formatPlage, maintenant, etatDuJour } (tests/horaires.test.mjs).
 */
export async function loadHorairesModule() {
  return loadPureLibModule('horaires.ts');
}

/** Copie src/lib/annonce.ts (module pur) et l'importe : { annonceVisible, jourCivil, coquilleAcceptAnnonce, COQUILLES_SANS_ANNONCE } (tests/annonce.test.mjs). */
export async function loadAnnonceModule() {
  return loadPureLibModule('annonce.ts');
}

/**
 * Copie src/lib/galerie.ts (module pur : un seul `import type` du schema) dans TMP_DIR/lib/ et l'importe.
 * Renvoie { kindsDeGalerie, idDeKind, metaDeRealisation, libelleCompteur, COMPTEUR_MIN, SEPARATEUR_META }
 * (tests/galerie.test.mjs).
 */
export async function loadGalerieModule() {
  return loadPureLibModule('galerie.ts');
}

/**
 * Copie src/lib/conseils.ts (module pur : un seul `import type` du schema) dans TMP_DIR/lib/ et l'importe.
 * Renvoie { conseilsTries, dateConseil, lienConseils } (tests/conseils.test.mjs).
 */
export async function loadConseilsModule() {
  return loadPureLibModule('conseils.ts');
}

/**
 * Copie src/lib/architectures.ts (module pur : seuls des `import type`) dans TMP_DIR/lib/ et l'importe. Renvoie
 * { ARCHITECTURES, ARCHITECTURE_IDS, architecture, completerLayout, donneesManquantes, photosDuClient,
 * nombreDeRealisations } (tests/architectures.test.mjs).
 */
export async function loadArchitecturesModule() {
  return loadPureLibModule('architectures.ts');
}

/**
 * Copie src/lib/agenda.ts (module pur : un seul `import type` du schema) dans TMP_DIR/lib/ et l'importe. Renvoie
 * { isoDuJour, agendaAVenir, dateAgenda, categoriesAgenda, lienAgenda } (tests/architectures.test.mjs).
 */
export async function loadAgendaModule() {
  return loadPureLibModule('agenda.ts');
}

/**
 * Copie src/lib/couleur.ts (module pur, sans import) dans TMP_DIR/lib/ et l'importe. Renvoie { COULEUR_RE, parseCouleur,
 * luminance, contraste, teinteLisible, encreSur, styleTeinte, oklchVersRgb, rgbVersOklch } (tests/architectures.test.mjs).
 */
export async function loadCouleurModule() {
  return loadPureLibModule('couleur.ts');
}

/**
 * Copie src/lib/produits.ts (module pur) dans TMP_DIR/lib/ et l'importe. Renvoie { categoriesProduits, autresProduits,
 * lienProduits, prixEnOffre } (tests/architectures.test.mjs, architecture gamme-vitrine).
 */
export async function loadProduitsModule() {
  return loadPureLibModule('produits.ts');
}

/**
 * Copie src/lib/lieux.ts (module pur) dans TMP_DIR/lib/ et l'importe. Renvoie { telDuLieu, adresseDuLieu, autresLieux,
 * liensLieux, lienPros, lieuxComplets } (architecture pages-adresses, tests/architectures.test.mjs).
 */
export async function loadLieuxModule() {
  return loadPureLibModule('lieux.ts');
}

/**
 * Copie src/lib/sorties.ts (module pur) dans TMP_DIR/lib/ et l'importe. Renvoie { slugTexte, saisonsDe, groupesParSaison,
 * saisonsCompletes, sortiesDuService, niveauxDe, sortiesEnAvant, publicsDe, liensSaisons, TOUTE_L_ANNEE } (architecture
 * saisons-sorties, tests/architectures.test.mjs).
 */
export async function loadSortiesModule() {
  return loadPureLibModule('sorties.ts');
}

/**
 * Copie src/lib/ardoise.ts (module pur) dans TMP_DIR/lib/ et l'importe. Renvoie { programmeDeLaSemaine, avecProgramme,
 * joursCouverts, entreesDistinctes, exceptionsAVenir, dateLongue, lienProgramme, JOURS_ARDOISE } (architecture
 * ardoise-du-jour, tests/architectures-jour.test.mjs).
 */
export async function loadArdoiseModule() {
  return loadPureLibModule('ardoise.ts');
}

/**
 * Copie src/lib/tournee.ts (module pur) dans TMP_DIR/lib/ et l'importe. Renvoie { slugCommune, etapesParJour, communesDe,
 * telDeLEtape, etapeDuMoment, libelleDuMoment, lienTournee, etapesCompletes, JOURS_TOURNEE } (architecture
 * tournee-semaine, tests/architectures-jour.test.mjs).
 */
export async function loadTourneeModule() {
  return loadPureLibModule('tournee.ts');
}

/**
 * Copie src/lib/artistes.ts (module pur) dans TMP_DIR/lib/ et l'importe. Renvoie { slugStyle, stylesDe, artistesDuStyle,
 * autresArtistes, contactsDeLArtiste, residentsEtInvites, lienArtistes, artistesComplets, enumerer } (architecture
 * artistes-residents, tests/architectures-maison.test.mjs).
 */
export async function loadArtistesModule() {
  return loadPureLibModule('artistes.ts');
}

/**
 * Copie src/lib/fetes.ts (module pur) dans TMP_DIR/lib/ et l'importe. Renvoie { fetesAVenir, feteDuMoment, etatCommande,
 * joursEntre, dateFete, periodeFete, formatHeure, livraisonDuMoment, libelleDuMoment, lienFetes, fetesCompletes }
 * (architecture calendrier-fetes, tests/architectures-maison.test.mjs).
 */
export async function loadFetesModule() {
  return loadPureLibModule('fetes.ts');
}

/**
 * Copie src/lib/sejour.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture outil-calendrier :
 * nuits prises, séjour libre, mois du calendrier, lecture d'iCal ; tests/architectures-sejour.test.mjs).
 */
export async function loadSejourModule() {
  return loadPureLibModule('sejour.ts');
}

/**
 * Copie src/lib/parcours.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture parcours-atelier :
 * barreaux de l'échelle, suivant, formules ; tests/architectures-sejour.test.mjs).
 */
export async function loadParcoursModule() {
  return loadPureLibModule('parcours.ts');
}

/**
 * Copie src/lib/tarifs.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture grille-urgence : situations, créneau
 * de l'heure, prix ; tests/architectures-atelier.test.mjs).
 */
export async function loadTarifsModule() {
  return loadPureLibModule('tarifs.ts');
}

/**
 * Copie src/lib/colis.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture atelier-par-colis : étapes du voyage du
 * colis, adresse d'envoi ; tests/architectures-atelier.test.mjs).
 */
export async function loadColisModule() {
  return loadPureLibModule('colis.ts');
}

/**
 * Copie src/lib/soins.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture carte-des-soins : durées lues,
 * tranches de temps ; tests/architectures-soins.test.mjs).
 */
export async function loadSoinsModule() {
  return loadPureLibModule('soins.ts');
}

/**
 * Copie src/lib/avantapres.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture avant-apres : pièces avec photo
 * avant et après, types ; tests/architectures-soins.test.mjs).
 */
export async function loadAvantApresModule() {
  return loadPureLibModule('avantapres.ts');
}

/**
 * Copie src/lib/planning.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture planning-semaine : cours valides,
 * jours, disciplines, durées ; tests/architectures-semaine.test.mjs).
 */
export async function loadPlanningModule() {
  return loadPureLibModule('planning.ts');
}

/**
 * Copie src/lib/location.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture catalogue-location : matériels à
 * prix, catégories, prix par durée ; tests/architectures-semaine.test.mjs).
 */
export async function loadLocationModule() {
  return loadPureLibModule('location.ts');
}

/**
 * Copie src/lib/estimation.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture estimation-etapes : questions
 * valides, étapes, lien de nav ; tests/architectures-devis.test.mjs).
 */
export async function loadEstimationModule() {
  return loadPureLibModule('estimation.ts');
}

/**
 * Copie src/lib/formules.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture formules-comparees : formules à
 * prix, reprises, comparaison ; tests/architectures-devis.test.mjs).
 */
export async function loadFormulesModule() {
  return loadPureLibModule('formules.ts');
}

/**
 * Copie src/lib/appareils.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture appareils-pannes : appareils
 * complets, familles, prix, marques ; tests/architectures-pannes.test.mjs).
 */
export async function loadAppareilsModule() {
  return loadPureLibModule('appareils.ts');
}

/**
 * Copie src/lib/retrait.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture commande-retrait : points, jours,
 * prochaine clôture ; tests/architectures-pannes.test.mjs).
 */
export async function loadRetraitModule() {
  return loadPureLibModule('retrait.ts');
}

/**
 * Copie src/lib/salles.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture salles-capacites : salles, capacités,
 * salles qui conviennent ; tests/architectures-reception.test.mjs).
 */
export async function loadSallesModule() {
  return loadPureLibModule('salles.ts');
}

/**
 * Copie src/lib/biens.ts (module pur) dans TMP_DIR/lib/ et l'importe (architecture annonces-biens : biens, projets, prix,
 * DPE, mentions manquantes ; tests/architectures-reception.test.mjs).
 */
export async function loadBiensModule() {
  return loadPureLibModule('biens.ts');
}

/** Copie un module pur de src/lib/ (sans dependance runtime) dans TMP_DIR/lib/ et l'importe. */
async function loadPureLibModule(name) {
  const libDir = path.join(TMP_DIR, 'lib');
  fs.mkdirSync(libDir, { recursive: true });
  const src = fs.readFileSync(path.join(ROOT, 'src', 'lib', name), 'utf8');
  fs.writeFileSync(path.join(libDir, name), addTsExtensions(src));
  return import(pathToFileURL(path.join(libDir, name)).href);
}

export function cleanTmp() {
  fs.rmSync(TMP_DIR, { recursive: true, force: true });
}
