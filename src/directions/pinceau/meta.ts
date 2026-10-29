// Style réel : https://pickyjoe.com/ (Coyot Bar, rooftop du Marché du Lez à Montpellier ; fiche docs/veille/styles/pinceau.md,
// veille du 29 oct 2026, volet 2a quater). Construction codée : Hero/pinceau (enseigne empilée sur bleu nuit, lignes séparées
// par des tildes, bord brossé terracotta en bas), Services/pinceau (bandes de couleur pleine largeur aux bords brossés :
// plaque d'horaires posée sur la bande terracotta, une bande par prestation, carte à points de conduite sur bleu nuit),
// modèles presets/pinceau.json et presets/pinceau-comptoir.json.
export default {
  nom: 'pinceau',
  ambiance: "Bar du soir et terrasse : bandes pleine largeur terracotta, sable, moutarde et bleu nuit dont les bords sont brossés au pinceau, enseigne condensée en capitales, texte en chasse fixe comme une carte de bar, une plaque d'horaires posée sur la couleur. Joyeux, chaleureux, lisible.",
  metiers: ['bar', 'restaurant', 'food truck', 'brasserie', 'pizzeria', 'guinguette', 'burger', 'rotisserie', 'glacier', 'caviste'],
  motionParDefaut: 'subtle',
  eviter: ['cabinet medical', 'avocat', 'luxe feutre', 'pompes funebres'],
  source: 'https://pickyjoe.com/',
};
