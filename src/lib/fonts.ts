/**
 * Catalogue des polices auto-hebergees (fontsource). Une direction en choisit une paire par defaut ;
 * `site.typography` peut la remplacer police par police. Charge a la demande : seules les polices
 * utilisees par le site sont embarquees.
 */
export const FONTS = {
  // Serifs
  fraunces: { family: "'Fraunces Variable', Georgia, serif", load: () => import('@fontsource-variable/fraunces'), role: 'display', mood: 'chaleureux, artisanal' },
  cormorant: { family: "'Cormorant Variable', Georgia, serif", load: () => import('@fontsource-variable/cormorant'), role: 'display', mood: 'luxe, elegant' },
  playfair: { family: "'Playfair Display Variable', Georgia, serif", load: () => import('@fontsource-variable/playfair-display'), role: 'display', mood: 'editorial, classique' },
  lora: { family: "'Lora Variable', Georgia, serif", load: () => import('@fontsource-variable/lora'), role: 'both', mood: 'calme, lisible' },
  literata: { family: "'Literata Variable', Georgia, serif", load: () => import('@fontsource-variable/literata'), role: 'both', mood: 'livre, sobre' },
  newsreader: { family: "'Newsreader Variable', Georgia, serif", load: () => import('@fontsource-variable/newsreader'), role: 'display', mood: 'journal, contraste' },
  bodoni: { family: "'Bodoni Moda Variable', 'Didot', Georgia, serif", load: () => import('@fontsource-variable/bodoni-moda'), role: 'display', mood: 'mode, haute couture' },
  gelasio: { family: "'Gelasio Variable', Georgia, serif", load: () => import('@fontsource-variable/gelasio'), role: 'both', mood: 'classique, chaud' },
  instrumentSerif: { family: "'Instrument Serif', Georgia, serif", load: () => import('@fontsource/instrument-serif'), role: 'display', mood: 'encre, fin, condense' },
  gloock: { family: "'Gloock', Georgia, serif", load: () => import('@fontsource/gloock'), role: 'display', mood: 'retro, gras, seventies' },
  // Sans
  inter: { family: "'Inter Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/inter'), role: 'body', mood: 'neutre' },
  manrope: { family: "'Manrope Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/manrope'), role: 'both', mood: 'tech propre' },
  dmSans: { family: "'DM Sans Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/dm-sans'), role: 'body', mood: 'doux, moderne' },
  instrumentSans: { family: "'Instrument Sans Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/instrument-sans'), role: 'body', mood: 'discret' },
  nunito: { family: "'Nunito Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/nunito'), role: 'body', mood: 'rond, amical' },
  archivo: { family: "'Archivo Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/archivo'), role: 'body', mood: 'franc, direct' },
  workSans: { family: "'Work Sans Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/work-sans'), role: 'body', mood: 'simple, ouvert' },
  figtree: { family: "'Figtree Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/figtree'), role: 'body', mood: 'geometrique doux' },
  epilogue: { family: "'Epilogue Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/epilogue'), role: 'both', mood: 'architecture, net' },
  hanken: { family: "'Hanken Grotesk Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/hanken-grotesk'), role: 'body', mood: 'suisse, sobre' },
  schibsted: { family: "'Schibsted Grotesk Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/schibsted-grotesk'), role: 'both', mood: 'presse, nordique' },
  redHat: { family: "'Red Hat Display Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/red-hat-display'), role: 'both', mood: 'industriel propre' },
  outfit: { family: "'Outfit Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/outfit'), role: 'display', mood: 'geometrique, startup' },
  sora: { family: "'Sora Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/sora'), role: 'display', mood: 'aere, moderne' },
  spaceGrotesk: { family: "'Space Grotesk Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/space-grotesk'), role: 'display', mood: 'brut, technique' },
  syne: { family: "'Syne Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/syne'), role: 'both', mood: 'arty, tendu' },
  unbounded: { family: "'Unbounded Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/unbounded'), role: 'display', mood: 'large, futuriste' },
  bricolage: { family: "'Bricolage Grotesque Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/bricolage-grotesque'), role: 'display', mood: 'vivant, pop' },
  anybody: { family: "'Anybody Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/anybody'), role: 'display', mood: 'pop, extensible' },
  josefin: { family: "'Josefin Sans Variable', system-ui, sans-serif", load: () => import('@fontsource-variable/josefin-sans'), role: 'both', mood: 'retro, art deco' },
  archivoBlack: { family: "'Archivo Black', Impact, sans-serif", load: () => import('@fontsource/archivo-black'), role: 'display', mood: 'urgence, affiche' },
  bebas: { family: "'Bebas Neue', Impact, sans-serif", load: () => import('@fontsource/bebas-neue'), role: 'display', mood: 'condense, industriel' },
  delaGothic: { family: "'Dela Gothic One', Impact, sans-serif", load: () => import('@fontsource/dela-gothic-one'), role: 'display', mood: 'ultra gras, pop' },
  // Mono
  jetbrains: { family: "'JetBrains Mono Variable', ui-monospace, monospace", load: () => import('@fontsource-variable/jetbrains-mono'), role: 'mono', mood: 'technique' },
} as const;

export type FontName = keyof typeof FONTS;
export const FONT_NAMES = Object.keys(FONTS) as FontName[];
