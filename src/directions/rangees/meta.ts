// Style réel : https://officecommun.com/ (Office Commun, petit studio de design ; fiche docs/veille/styles/rangees.md,
// veille du 31 oct 2026, tour 21, volet 2a quater). Construction codée : Nav/rangees (le nom en petit à gauche, le numéro
// et « Contact » à droite, rien d'autre), Hero/rangees (pas de titre géant : le h1 en grand corps et deux courts
// paragraphes gris en colonne étroite, les prestations du client citées en liens dans la phrase, Appeler et Devis),
// Services/rangees (le geste signature : une RANGÉE par réalisation ou par prestation, « nom, lieu » en petit puis une
// piste bord à bord de photos de largeurs variées à hauteur constante, qu'on tire au doigt ou à la souris, son fil
// dessous ; src/components/RangeeDePhotos.astro, src/lib/rangees.ts), Proof/rangees (les avis en rangée de cases de
// texte), About/rangees (le bloc « à propos » de la page projet de la source, la colonne étroite et les photos de
// l'atelier en rangée), Contact/rangees (la page contact de la source : une phrase avec le numéro et l'e-mail, le
// formulaire à filets, les infos à côté) ; modèles presets/rangees.json et presets/rangees-menuisier.json.
export default {
  nom: 'rangees',
  ambiance: "Index de chantiers : papier blanc cassé uniforme, une encre noire, un gris ; pas de titre géant, deux courts paragraphes en colonne étroite, puis une rangée par réalisation : son nom et son lieu en petit, et une piste de photos de largeurs variées à hauteur constante qu'on tire à la main. Sobre, calme, tout l'œil va aux photos.",
  metiers: ['menuisier', 'ebeniste', 'architecte d interieur', 'paysagiste', 'photographe', 'tapissier', 'carreleur', 'agenceur', 'charpentier', 'renovation'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'depannage', 'restaurant', 'boulangerie', 'medecin', 'avocat'],
  source: 'https://officecommun.com/',
};
