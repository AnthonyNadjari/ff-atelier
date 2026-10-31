// Style réel : https://www.florawellnesscafe.com/ (Flora Café, café de quartier à Modesto, via Awwwards ; fiche
// docs/veille/styles/buvard.md, veille du 30 oct 2026, volet 2a quater). Construction codée : Hero/buvard (photo cadrée dans
// les marges, phrase en caslon et présentation en deux colonnes), Services/buvard (la carte en colonnes à prix en machine à
// écrire, photo de la prestation phare), About/buvard (grande photo à titre posé dessus, puis photo et texte), Proof/buvard
// (avis sous leurs photos), Contact/buvard (pied lie-de-vin à colonnes), composant FiletTremble (filets tremblés qui se
// tracent), modèles presets/buvard.json et presets/buvard-epicerie.json.
export default {
  nom: 'buvard',
  ambiance: "Carte de café imprimée : papier crème, une encre lie-de-vin, un rouge de tampon pour les étiquettes, un caslon de livre droit pour les titres et le texte, la carte et les prix en machine à écrire, des filets tremblés tirés à la main entre les blocs, des photos cadrées dans les marges. Doux, soigné, de quartier.",
  metiers: ['cafe', 'salon de the', 'coffee shop', 'epicerie fine', 'cave a vin', 'fleuriste', 'creperie', 'patissier', 'torrefacteur', 'librairie'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'batiment', 'industrie', 'bar de nuit'],
  source: 'https://www.florawellnesscafe.com/',
};
