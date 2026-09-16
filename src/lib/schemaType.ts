/**
 * schemaTypeForTrade(trade) : deduit un sous-type schema.org depuis le libelle metier francais
 * (business.trade), pour le JSON-LD de src/layouts/Base.astro. Re-exporte par src/lib/site.ts
 * (c'est le point d'entree normal pour les sections/layouts) ; module a part, sans dependance,
 * pour rester importable tel quel par Node (tests/schema.test.mjs via scripts/ff/ts-loader.mjs)
 * sans passer par le contexte Vite/Astro qu'exige le reste de site.ts (import.meta.glob).
 */

const stripDiacritics = (s: string) => s.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();

/**
 * Mapping metier (FR, mot-cle) -> sous-type schema.org, du plus specifique au plus generique.
 * Verifie un par un sur schema.org (WebFetch) le 16 sept 2026 ; les types marques "n'existe pas"
 * dans les commentaires ont ete testes et renvoient 404 sur schema.org, d'ou le repli indique.
 * Premiere entree dont le mot-cle apparait dans le metier (normalise, sans accents) qui gagne :
 * garder les mots-cles les plus specifiques avant les generiques (ex: "spa" apres "institut").
 */
const TRADE_SCHEMA_TYPES: [RegExp, string][] = [
  [/\bplombier/, 'Plumber'],
  [/\bchauffag/, 'HVACBusiness'],
  [/\belectricien/, 'Electrician'],
  [/\bcouvreur|zingueur/, 'RoofingContractor'],
  [/\bserrurier/, 'Locksmith'],
  [/\bcoiffeu|barbier/, 'HairSalon'],
  [/\binstitut/, 'BeautySalon'],
  [/\bspa\b/, 'DaySpa'],
  [/\brestaurant|bouillabaisse/, 'Restaurant'],
  [/\bboulanger|patissier|patisserie/, 'Bakery'],
  [/\bgarage|mecanicien/, 'AutoRepair'],
  [/\bavocat/, 'LegalService'], // Attorney existe mais deprecie par schema.org au profit de LegalService
  [/\bdentiste/, 'Dentist'],
  [/\bveterinaire/, 'VeterinaryCare'],
  [/\bosteopathe|kinesitherap|\bkine\b/, 'MedicalBusiness'], // Physiotherapy n'est qu'une valeur de medicalSpecialty, pas un type LocalBusiness
  [/\bphotographe/, 'ProfessionalService'], // Photographer n'existe pas sur schema.org (verifie : 404)
  [/\bpaysagiste/, 'HomeAndConstructionBusiness'], // LandscapingBusiness n'existe pas (verifie : 404)
  [/\bmenuisier|ebeniste|ferronn/, 'HomeAndConstructionBusiness'],
  [/\barchitecte/, 'ProfessionalService'], // ArchitecturalService n'existe pas (verifie : 404)
  [/\bfleuriste/, 'Florist'],
  [/\bchambres? d.?hotes/, 'BedAndBreakfast'],
  [/\bauto.?ecole/, 'EducationalOrganization'], // DrivingSchool n'existe pas (verifie : 404)
  [/\btatou/, 'TattooParlor'],
  [/\bcoach|\byoga\b/, 'HealthClub'],
  [/\btraiteur/, 'FoodEstablishment'],
  [/\bbrasserie/, 'Brewery'],
  [/\bimmobil/, 'RealEstateAgent'],
  [/\bmacon/, 'GeneralContractor'],
  [/\binformatique/, 'ProfessionalService'], // ComputerRepair n'existe pas (verifie : 404)
];

/**
 * Deduit un sous-type schema.org depuis le libelle metier (business.trade), en francais et sans
 * mise en forme particuliere (ex: "Plombier-chauffagiste", "Ostéopathe D.O."). Repli : 'LocalBusiness'.
 * Utilise par Base.astro pour le JSON-LD quand business.schemaType n'est pas fourni.
 */
export const schemaTypeForTrade = (trade: string): string => {
  const normalized = stripDiacritics(trade);
  for (const [re, type] of TRADE_SCHEMA_TYPES) {
    if (re.test(normalized)) return type;
  }
  return 'LocalBusiness';
};
