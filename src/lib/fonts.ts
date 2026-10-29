/**
 * Catalogue des polices auto-hebergees (fontsource). Une direction en choisit une paire par defaut ;
 * `site.typography` peut la remplacer police par police. Charge a la demande : seules les polices
 * utilisees par le site sont embarquees.
 */
export const FONTS = {
  // Serifs
  // 15 oct 2026 (veille outils) : 21 polices « par défaut des IA » retirées du registre (elles étaient
  // bannies par ff ia mais encore proposées par ff studio et 11 presets). Nouvelles, OFL, rares :
  // Ancizar Serif, Libre Caslon Condensed, Epunda Slab, Savate, Special Gothic, Intel One Mono.
  ancizarSerif: { family: "'Ancizar Serif Variable', Georgia, serif", pkg: '@fontsource-variable/ancizar-serif', role: 'both', mood: 'classique, chaud, universitaire' },
  libreCaslonCondensed: { family: "'Libre Caslon Condensed Variable', Georgia, serif", pkg: '@fontsource-variable/libre-caslon-condensed', role: 'display', mood: 'enseigne peinte, affiche condensee' },
  epundaSlab: { family: "'Epunda Slab Variable', Georgia, serif", pkg: '@fontsource-variable/epunda-slab', role: 'display', mood: 'slab sec, contemporain' },
  literata: { family: "'Literata Variable', Georgia, serif", pkg: '@fontsource-variable/literata', role: 'both', mood: 'livre, sobre' },
  bodoni: { family: "'Bodoni Moda Variable', 'Didot', Georgia, serif", pkg: '@fontsource-variable/bodoni-moda', role: 'display', mood: 'mode, haute couture' },
  gelasio: { family: "'Gelasio Variable', Georgia, serif", pkg: '@fontsource-variable/gelasio', role: 'both', mood: 'classique, chaud' },
  gloock: { family: "'Gloock', Georgia, serif", pkg: '@fontsource/gloock/latin.css', role: 'display', mood: 'retro, gras, seventies' },
  ebGaramond: { family: "'EB Garamond Variable', Garamond, Georgia, serif", pkg: '@fontsource-variable/eb-garamond', role: 'both', mood: 'classique, elegant' },
  spectral: { family: "'Spectral', Georgia, serif", pkg: '@fontsource/spectral/latin.css', role: 'both', mood: 'editorial contemporain' },
  libreBodoni: { family: "'Libre Bodoni Variable', 'Didot', Georgia, serif", pkg: '@fontsource-variable/libre-bodoni', role: 'display', mood: 'mode, haute couture' },
  zillaSlab: { family: "'Zilla Slab', Georgia, serif", pkg: '@fontsource/zilla-slab/latin.css', role: 'both', mood: 'robuste, lisible' },
  bitter: { family: "'Bitter Variable', Georgia, serif", pkg: '@fontsource-variable/bitter', role: 'both', mood: 'slab doux, lecture ecran' },
  domine: { family: "'Domine Variable', Georgia, serif", pkg: '@fontsource-variable/domine', role: 'both', mood: 'sobre, editorial' },
  abrilFatface: { family: "'Abril Fatface', Georgia, serif", pkg: '@fontsource/abril-fatface/latin.css', role: 'display', mood: 'editorial gras, mode' },
  gildaDisplay: { family: "'Gilda Display', Georgia, serif", pkg: '@fontsource/gilda-display/latin-400.css', role: 'display', mood: 'serif contraste, salon' },
  marcellus: { family: "'Marcellus', Georgia, serif", pkg: '@fontsource/marcellus/latin-400.css', role: 'display', mood: 'capitales fines, lapidaire' },
  // 29 oct 2026 (style bouteille, restaurantzimmerl.at) : Judson, serif de lecture de la source, libre (OFL).
  judson: { family: "'Judson', Georgia, serif", pkg: '@fontsource/judson/latin-400.css', role: 'body', mood: 'livre ancien, chaleureux' },
  yesevaOne: { family: "'Yeseva One', Georgia, serif", pkg: '@fontsource/yeseva-one/latin.css', role: 'display', mood: 'feminin, decoratif' },
  // Sans
  savate: { family: "'Savate Variable', system-ui, sans-serif", pkg: '@fontsource-variable/savate', role: 'display', mood: 'grotesque vive, dessinee a la main' },
  specialGothic: { family: "'Special Gothic Variable', system-ui, sans-serif", pkg: '@fontsource-variable/special-gothic', role: 'both', mood: 'gothique americaine, franche' },
  nunito: { family: "'Nunito Variable', system-ui, sans-serif", pkg: '@fontsource-variable/nunito', role: 'body', mood: 'rond, amical' },
  archivo: { family: "'Archivo Variable', system-ui, sans-serif", pkg: '@fontsource-variable/archivo', role: 'body', mood: 'franc, direct' },
  workSans: { family: "'Work Sans Variable', system-ui, sans-serif", pkg: '@fontsource-variable/work-sans', role: 'body', mood: 'simple, ouvert' },
  figtree: { family: "'Figtree Variable', system-ui, sans-serif", pkg: '@fontsource-variable/figtree', role: 'body', mood: 'geometrique doux' },
  epilogue: { family: "'Epilogue Variable', system-ui, sans-serif", pkg: '@fontsource-variable/epilogue', role: 'both', mood: 'architecture, net' },
  hanken: { family: "'Hanken Grotesk Variable', system-ui, sans-serif", pkg: '@fontsource-variable/hanken-grotesk', role: 'body', mood: 'suisse, sobre' },
  schibsted: { family: "'Schibsted Grotesk Variable', system-ui, sans-serif", pkg: '@fontsource-variable/schibsted-grotesk', role: 'both', mood: 'presse, nordique' },
  redHat: { family: "'Red Hat Display Variable', system-ui, sans-serif", pkg: '@fontsource-variable/red-hat-display', role: 'both', mood: 'industriel propre' },
  sora: { family: "'Sora Variable', system-ui, sans-serif", pkg: '@fontsource-variable/sora', role: 'display', mood: 'aere, moderne' },
  unbounded: { family: "'Unbounded Variable', system-ui, sans-serif", pkg: '@fontsource-variable/unbounded', role: 'display', mood: 'large, futuriste' },
  bricolage: { family: "'Bricolage Grotesque Variable', system-ui, sans-serif", pkg: '@fontsource-variable/bricolage-grotesque', role: 'display', mood: 'vivant, pop' },
  anybody: { family: "'Anybody Variable', system-ui, sans-serif", pkg: '@fontsource-variable/anybody', role: 'display', mood: 'pop, extensible' },
  josefin: { family: "'Josefin Sans Variable', system-ui, sans-serif", pkg: '@fontsource-variable/josefin-sans', role: 'both', mood: 'retro, art deco' },
  archivoBlack: { family: "'Archivo Black', Impact, sans-serif", pkg: '@fontsource/archivo-black/latin.css', role: 'display', mood: 'urgence, affiche' },
  bebas: { family: "'Bebas Neue', Impact, sans-serif", pkg: '@fontsource/bebas-neue/latin.css', role: 'display', mood: 'condense, industriel' },
  delaGothic: { family: "'Dela Gothic One', Impact, sans-serif", pkg: '@fontsource/dela-gothic-one/latin.css', role: 'display', mood: 'ultra gras, pop' },
  oswald: { family: "'Oswald Variable', Impact, sans-serif", pkg: '@fontsource-variable/oswald', role: 'display', mood: 'condense, affiche' },
  cabin: { family: "'Cabin Variable', system-ui, sans-serif", pkg: '@fontsource-variable/cabin', role: 'body', mood: 'humaniste, doux' },
  karla: { family: "'Karla Variable', system-ui, sans-serif", pkg: '@fontsource-variable/karla', role: 'body', mood: 'net, contemporain' },
  rubik: { family: "'Rubik Variable', system-ui, sans-serif", pkg: '@fontsource-variable/rubik', role: 'both', mood: 'rond, amical' },
  urbanist: { family: "'Urbanist Variable', system-ui, sans-serif", pkg: '@fontsource-variable/urbanist', role: 'both', mood: 'urbain, elegant' },
  chivo: { family: "'Chivo Variable', system-ui, sans-serif", pkg: '@fontsource-variable/chivo', role: 'display', mood: 'grotesque robuste' },
  familjenGrotesk: { family: "'Familjen Grotesk Variable', system-ui, sans-serif", pkg: '@fontsource-variable/familjen-grotesk', role: 'both', mood: 'scandinave, epure' },
  lexend: { family: "'Lexend Variable', system-ui, sans-serif", pkg: '@fontsource-variable/lexend', role: 'body', mood: 'lisibilite, accessible' },
  publicSans: { family: "'Public Sans Variable', system-ui, sans-serif", pkg: '@fontsource-variable/public-sans', role: 'body', mood: 'institutionnel, neutre' },
  alfaSlabOne: { family: "'Alfa Slab One', Impact, sans-serif", pkg: '@fontsource/alfa-slab-one/latin.css', role: 'display', mood: 'slab massif, affiche' },
  // 29 oct 2026 (style pinceau, pickyjoe.com / Coyot Bar) : Bernier (enseigne western condensée, non libre) -> Big Shoulders Display.
  bigShoulders: { family: "'Big Shoulders Display Variable', Impact, sans-serif", pkg: '@fontsource-variable/big-shoulders-display', role: 'display', mood: 'enseigne condensee, saloon, affiche de ville' },
  // 29 oct 2026 (style enduit, bcgbuildingdesign.com.au) : Neue Haas Display (non libre) -> Host Grotesk, grotesque néo-suisse.
  hostGrotesk: { family: "'Host Grotesk Variable', 'Helvetica Neue', Arial, sans-serif", pkg: '@fontsource-variable/host-grotesk', role: 'both', mood: 'neo-suisse, sobre, architecture' },
  // 29 oct 2026 (style ocre, lrnce.com) : Harmonia Sans (non libre) -> Mulish, géométrique humaniste des étiquettes en capitales.
  mulish: { family: "'Mulish Variable', system-ui, sans-serif", pkg: '@fontsource-variable/mulish', role: 'body', mood: 'geometrique doux, etiquettes' },
  bungee: { family: "'Bungee', Impact, sans-serif", pkg: '@fontsource/bungee/latin.css', role: 'display', mood: 'urbain, signaletique' },
  // Mono
  // Large et fine (Nord de la source, remplacee) : petits intitules et boutons en capitales tres larges.
  lexendZetta: { family: "'Lexend Zetta Variable', system-ui, sans-serif", pkg: '@fontsource-variable/lexend-zetta', role: 'mono', mood: 'tres large, fin, enseigne' },
  // 29 oct 2026 (style pinceau) : Space Mono de la source (liste IA) -> Azeret Mono, chasse fixe de ticket et de carte.
  azeretMono: { family: "'Azeret Mono Variable', ui-monospace, monospace", pkg: '@fontsource-variable/azeret-mono', role: 'mono', mood: 'ticket de caisse, carte de bar' },
  intelOneMono: { family: "'Intel One Mono Variable', ui-monospace, monospace", pkg: '@fontsource-variable/intel-one-mono', role: 'mono', mood: 'lisible, technique' },
  jetbrains: { family: "'JetBrains Mono Variable', ui-monospace, monospace", pkg: '@fontsource-variable/jetbrains-mono', role: 'mono', mood: 'technique' },
  spaceMono: { family: "'Space Mono', ui-monospace, monospace", pkg: '@fontsource/space-mono/latin.css', role: 'mono', mood: 'retro tech' },
  dmMono: { family: "'DM Mono', ui-monospace, monospace", pkg: '@fontsource/dm-mono/latin.css', role: 'mono', mood: 'fin, discret' },
  fragmentMono: { family: "'Fragment Mono', ui-monospace, monospace", pkg: '@fontsource/fragment-mono/latin.css', role: 'mono', mood: 'elegant, mono display' },
} as const;

export type FontName = keyof typeof FONTS;
export const FONT_NAMES = Object.keys(FONTS) as FontName[];
