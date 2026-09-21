// DEMO : client inventé
/**
 * Squelette (21 sept 2026) : variante partagée `process/horizon` — le chapitre « du croquis à la
 * pose » est un écran épinglé qui défile horizontalement, une étape par écran, numéro géant, la
 * photo de la pièce posée sur la dernière étape. Il remplace le bloc sur mesure Fabrication.astro
 * (data-stack, supprimé — jamais deux blocs pour les mêmes étapes). C'est le seul geste fort de la
 * page : le hero perd son data-horizontal (les trois essences deviennent une grille fixe) et
 * Matières sa piste glissable data-drag-grid (grille fixe aussi) ; restent le curseur avant/après,
 * le décodage des prix et le halo du contact, des réponses au geste, pas des bandes.
 *
 * Atelier Lecerf — menuisier-ébéniste, Roubaix (ancienne filature). Métier 16 de
 * docs/OBJECTIF.md. Mandat de conception imposé pour ce tour : "material and process" —
 * un site construit autour du grain du bois et du geste, pas du catalogue de prestations.
 *
 * Direction : `terre` (organique, Lora/Nunito, formes rondes) — grep `direction:` sur les 16
 * sites dessinés à la main confirme `terre`/`luxe`/`neon`/`industriel` encore inutilisés ;
 * `atelier` et `encre` explicitement écartés par la tâche (sites/_exemple est une menuiserie en
 * `atelier`, à ne pas confondre). `luxe` (bijoutier/horloger, or sur noir, "eviter: low-cost")
 * et `neon` ("eviter: artisanat traditionnel") ne conviennent pas à un atelier de bois massif ;
 * `industriel` (béton/acier, Bebas, "eviter: delicat") est l'exact opposé d'un travail de
 * précision au bois — `terre` reste seule cohérente : ambiance "organique, nature", "formes
 * rondes genereuses", rien à éviter qui concerne un menuisier. Écart documenté : accent
 * surchargé en brun noyer/chêne (hsl(28 42% 34%), proche de #7a4c26, dans la famille des
 * placeholders `#3a2a1c`/`#e6d5b8`) à la place du vert par défaut de `terre` — un accent qui se
 * lit comme du bois, pas comme un jardin. `scale: 'display'` pour le titre géant du hero demandé
 * par le mandat. Typographie par défaut de `terre` (Lora Variable) gardée telle quelle : c'est
 * déjà la serif chaleureuse "grand titre serif géant" voulue par le mandat, aucune surcharge
 * nécessaire. `motion: 'rich'` : la moitié des sections sur mesure s'appuient sur des effets du
 * palier rich (data-stack, data-tilt-glare, data-draw-svg, data-drag-grid, data-horizontal,
 * data-scramble).
 *
 * Nav et hero sur mesure (`sections/Nav.astro`, `sections/Hero.astro`), plus quatre blocs sur
 * mesure : `Fabrication.astro` ("du croquis à la pose", data-stack de 4 cartes lisant
 * `site.process`, esquisse SVG d'une chaise tracée par data-draw-svg sur la première carte),
 * `Matieres.astro` (piste glissable data-drag-grid des trois essences chêne/frêne/noyer, textures
 * 100 % CSS — aucune photo, comme demandé), `Restauration.astro` (data-compare avant/après d'un
 * meuble ancien restauré, aucune liste de prix accolée — volontairement différent de
 * `sites/dubois-plomberie/sections/Tarifs.astro` qui combine déjà spotlight + prix pointillés +
 * compare dans un seul bloc), `Estimation.astro` (grille de prix indicatifs en tabular-nums,
 * lignes de tableau plutôt que les pointillés déjà utilisés par dubois-plomberie), et `Contact.astro`
 * (halo data-spotlight sur le panneau de coordonnées, mandat explicite). Six effets `data-*`
 * mobilisés qui comptaient ≤ 8 usages dans un site dessiné à la main avant ce tour (grep sur
 * `sites/<slug>/sections/*.astro`, hors `sites/_effets`) : `data-compare` (7), `data-stack` (8),
 * `data-tilt-glare` (6), `data-scramble` (7), `data-reveal-native` (6) — dépasse le minimum de
 * cinq demandé par le mandat ; `data-horizontal`, `data-duotone`, `data-draw-svg`,
 * `data-drag-grid`, `data-scroll-progress`, `data-spotlight` réemployés pour le reste du mandat.
 * `Matieres.astro` reprend l'idée de carnet d'échantillons CSS de `studio-ambre/Materiaux.astro`
 * (seul précédent, mandat oblige) mais en diffère : trois planches (pas six matières mélangées),
 * grain multi-couches + noeuds radiaux par essence plutôt qu'un simple hachurage, et
 * `data-tilt`/`data-tilt-glare` sur chaque planche (absent chez `studio-ambre`).
 *
 * Aucune donnée inventée : pas d'avis (le brief n'en fournit pas, `proof` reste absent du
 * layout), pas de nom de personne (le brief donne "2 personnes" sans prénom — `about.team`
 * reste vide plutôt que d'inventer des prénoms). Seule exception, explicitement autorisée par le
 * mandat pour cette démo : la grille de prix indicative (`services[].priceFrom`, toujours
 * suffixée "(indicatif)").
 */
import { defineSite } from '@/lib/schema';

export default defineSite({
  slug: 'atelier-lecerf',
  direction: 'terre',
  motion: 'rich',
  accent: { h: 28, s: 42, l: 34 },
  scale: 'display',

  layout: {
    nav: 'custom/Nav',
    hero: 'custom/Hero',
    sections: [
      { type: 'process', variant: 'horizon' },
      { type: 'custom', variant: 'Matieres', label: 'Matières' },
      { type: 'custom', variant: 'Restauration', label: 'Restauration' },
      { type: 'custom', variant: 'Estimation', label: 'Tarifs' },
      { type: 'custom', variant: 'Contact', label: 'Contact' },
    ],
    footer: 'columns',
  },

  business: {
    name: 'Atelier Lecerf',
    trade: 'Menuisier-ébéniste',
    tagline: 'Le bois massif, choisi pièce par pièce, <em>façonné pour durer.</em>',
    description:
      'Atelier de menuiserie et d’ébénisterie installé à Roubaix, dans une ancienne filature, depuis 1998. Deux personnes y dessinent, choisissent le bois et fabriquent chaque pièce sur place.\n\nChêne, frêne et noyer massifs, jamais de panneau plaqué : cuisines, bibliothèques, escaliers et restauration de meubles anciens, pour Roubaix et la métropole lilloise.',
    since: 1998,
  },

  contact: {
    phone: '+33639981357',
    phoneDisplay: '06 39 98 13 57',
    email: 'contact@exemple.fr',
    address: { street: '14 rue de l’Alma', postalCode: '59100', city: 'Roubaix' },
    mapsUrl: 'https://maps.google.com/?q=14+rue+de+l%27Alma+59100+Roubaix',
    mapsProvider: 'osm',
    coordinates: { lat: 50.6942, lng: 3.1746 },
    hours: [
      { days: 'Lundi – vendredi', hours: '8h – 18h' },
      { days: 'Samedi', hours: 'Sur rendez-vous' },
    ],
    emergency24h: false,
  },

  zones: { cities: ['Roubaix', 'Tourcoing', 'Lille', 'Croix', 'Wasquehal', 'Marcq-en-Barœul'], label: 'Métropole lilloise' },

  services: [
    {
      slug: 'cuisines-sur-mesure',
      title: 'Cuisines sur mesure',
      short: 'Dessinée pour votre pièce, fabriquée en chêne, frêne ou noyer massif.',
      description:
        'Une cuisine sur mesure commence par une visite à votre domicile : mesures, usage réel de la pièce, choix du bois.\n\nLe dessin est validé avec vous avant toute coupe. Fabrication à l’atelier, pose comprise.',
      bullets: ['Croquis validé avant fabrication', 'Bois massif, jamais de panneau plaqué', 'Pose comprise'],
      icon: 'ChefHat',
      featured: true,
      priceFrom: 'à partir de 8 000 € (indicatif)',
    },
    {
      slug: 'bibliotheques-sur-mesure',
      title: 'Bibliothèques sur mesure',
      short: 'Bibliothèques et agencements qui épousent le mur, sous pente ou en alcôve.',
      description:
        'Chaque bibliothèque est dessinée pour l’espace qu’elle occupe : sous pente, en alcôve, d’angle.\n\nAssemblages traditionnels, finitions huilées ou cirées selon l’essence choisie.',
      bullets: ['Relevé sur place', 'Sous pente, alcôve, angle', 'Finitions huilées ou cirées'],
      icon: 'BookOpen',
      featured: true,
      priceFrom: 'à partir de 2 500 € (indicatif)',
    },
    {
      slug: 'escaliers-bois-massif',
      title: 'Escaliers en bois massif',
      short: 'Escaliers droits ou quart tournant, en chêne, frêne ou noyer.',
      description:
        'Relevé précis de la cage d’escalier, dessin de l’ouvrage puis fabrication à l’atelier.\n\nGarde-corps assortis, rénovation d’escaliers existants possible.',
      bullets: ['Relevé sur place', 'Garde-corps assortis', 'Rénovation d’escaliers existants'],
      icon: 'DoorStairwell',
      priceFrom: 'à partir de 4 500 € (indicatif)',
    },
    {
      slug: 'restauration-meubles-anciens',
      title: 'Restauration de meubles anciens',
      short: 'Le meuble de famille retrouve son grain d’origine, sans perdre son histoire.',
      description:
        'Commodes, armoires, chaises anciennes : décapage, recollage, remplacement des pièces manquantes dans une essence compatible, finition à l’huile ou à la cire.\n\nLe geste est le même qu’en fabrication neuve — celui du bois massif.',
      bullets: ['Décapage et recollage', 'Remplacement de pièces manquantes', 'Finition huile ou cire'],
      icon: 'Hammer',
      priceFrom: 'à partir de 250 € (indicatif)',
    },
  ],

  about: {
    title: 'L’atelier',
    story:
      'Atelier Lecerf s’est installé en 1998 dans une ancienne filature de Roubaix — de hauts volumes, de la lumière du nord, la place pour débiter de grandes planches.\n\nDeux personnes y travaillent aujourd’hui : le dessin, le choix du bois et la fabrication restent entre les mêmes mains, du croquis à la pose.\n\nChêne, frêne, noyer — toujours massifs. Jamais de panneau plaqué, jamais de catalogue : chaque pièce est dessinée pour l’endroit où elle vivra.',
    values: [
      { title: 'Bois massif', text: 'Chêne, frêne, noyer — jamais de panneau plaqué.' },
      { title: 'Le croquis avant l’établi', text: 'Chaque pièce est dessinée avec vous avant d’être coupée.' },
      { title: 'Neuf et ancien', text: 'Le sur-mesure et la restauration de meubles anciens, avec le même geste.' },
    ],
    milestones: [{ year: '1998', text: 'Ouverture de l’atelier, dans une ancienne filature de Roubaix.' }],
  },

  process: [
    { title: 'Le croquis', text: 'On discute du projet, on prend les mesures, on dessine ensemble la pièce avant tout achat de bois.' },
    { title: 'Le choix du bois', text: 'Chêne, frêne ou noyer massif — choisi selon l’usage de la pièce et la lumière qui l’éclaire.' },
    { title: 'La fabrication', text: 'Débit, assemblage, finition à l’huile ou à la cire — tout se fait à l’atelier de Roubaix.' },
    {
      title: 'La pose',
      text: 'Installation chez vous, réglages sur place, et les conseils d’entretien du bois massif.',
      image: { src: '/images/service-4.webp', alt: 'Meuble en bois massif installé chez le client' },
    },
  ],

  form: { provider: 'mailto' },

  wording: {
    devis: 'Dessiner votre projet',
    ctaTitle: 'Un meuble qui n’existe pas encore&nbsp;? <em>Dessinons-le ensemble.</em>',
    contactTitle: 'Dessiner votre projet',
    contactText: 'Décrivez votre projet — cuisine, bibliothèque, escalier ou meuble à restaurer — nous vous rappelons pour en parler.',
  },

  images: {},

  seo: {
    keywords: ['menuisier Roubaix', 'ébéniste Roubaix', 'cuisine sur mesure bois massif', 'escalier bois Roubaix', 'restauration meubles anciens Lille'],
  },
});
