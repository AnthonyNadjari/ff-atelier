// Style réel : https://www.hotel-gilbert.at/ (Hotel Gilbert, petit hôtel indépendant à Vienne ; fiche
// docs/veille/styles/cartouche.md, veille du 30 oct 2026, tour 19, volet 2a quater). Construction codée : Hero/cartouche (le nom
// géant en serif entre deux filets, cases de la ligne d'en-tête, photo pleine largeur), About/cartouche (titre en capitales et
// texte à la machine à écrire, centrés), Services/cartouche (une photo par service et son cartouche posé à cheval sur son
// bord), Proof/cartouche (papier quadrillé, avis en cartouches), Contact/cartouche (bande cobalt, pied en cases filetées),
// modèles presets/cartouche.json et presets/cartouche-barbier.json.
export default {
  nom: 'cartouche',
  ambiance: "Papeterie d'hôtel : blanc et un seul bleu cobalt, le nom géant en serif d'affiche, des plaques à filet posées sur le bas des photos, texte à la machine à écrire, papier quadrillé. Élégant, un peu rétro, plein d'esprit.",
  metiers: ['hotel', "chambre d'hotes", 'barbier', 'coiffeur', 'institut', 'fleuriste', 'restaurant', 'cave', 'patissier'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'depannage', 'btp', 'bar de nuit'],
  source: 'https://www.hotel-gilbert.at/',
};
