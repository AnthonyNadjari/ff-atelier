// Style réel : https://tekt.com.au/ (fiche docs/veille/styles/calque.md, veille du 29 oct 2026, volet 2a quater).
// Construction codée : Nav/calque (barre de cellules à repères d'angle posée sur la photo), Hero/calque (photo plein écran,
// h1 à mi-hauteur à gauche, porte « Demander un devis » fixée en bas à gauche), About/calque (grand corps à gauche, cellules
// des engagements à droite, photo aux deux tiers), Services/calque (prestations en cellules numérotées, une ouverte avec sa
// photo), Proof/calque (photo pleine largeur, réalisations en cellules posées dessus), Contact/calque (formulaire en
// grille de cellules sur le panneau), modèle presets/calque.json.
export default {
  nom: 'calque',
  ambiance: "Calque d'architecte : fond bleu-gris pâle, un brun très foncé, une grotesque en graisse normale pour tout, listes, menu et formulaire en cellules filetées à petits carrés d'angle, grandes photos plein cadre. Précis, sérieux, sans décor.",
  metiers: ['constructeur', 'charpentier', 'menuisier', 'maison ossature bois', 'renovation', 'architecte', 'cuisiniste', 'agenceur', 'macon', 'paysagiste'],
  motionParDefaut: 'subtle',
  eviter: ['restaurant', 'boulangerie', 'fleuriste', 'soin'],
  source: 'https://tekt.com.au/',
};
