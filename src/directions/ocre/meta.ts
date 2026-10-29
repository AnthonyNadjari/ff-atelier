// Style réel : https://lrnce.com/ (LRNCE, atelier de céramique, tissage et peinture à Marrakech ; fiche docs/veille/styles/ocre.md,
// veille du 29 oct 2026, volet 2a quater). Construction codée : Hero/ocre (diptyque de photos bord à bord, le titre et le
// métier dessous entre deux filets), About/ocre (la lettre : photo bord à bord à gauche, serif de grand corps à droite),
// Services/ocre (les prestations en diptyques de photos sur le sable, la dernière seule à côté d'une moitié vide), Proof/ocre
// (grande photo puis les avis centrés en serif), Contact/ocre (la demande centrée, la bande rouille au nom qui défile, les
// colonnes filetées), modèles presets/ocre.json et presets/ocre-boutique.json.
export default {
  nom: 'ocre',
  ambiance: "Atelier de terre et de sable : fond sable, un seul rouille, filets fins qui découpent la page, photos en diptyques, une lettre en serif de grand corps, le nom qui défile sur une bande rouille. Chaud, artisanal, sans décor ajouté : la couleur vient des pièces.",
  metiers: ['potier', 'ceramiste', 'tisserand', 'fleuriste', 'tapissier', 'peintre decorateur', 'createur de bijoux', 'savonnier', 'maroquinier', 'epicerie fine'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'cabinet medical', 'garage', 'avocat'],
  source: 'https://lrnce.com/',
};
