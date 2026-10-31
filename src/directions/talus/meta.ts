// Style réel : https://taylorhare.com/ (TaylorHare Architects ; fiche docs/veille/styles/talus.md, veille du 30 oct 2026,
// tour 19, volet 2a quater). Construction codée : Nav/talus (triangle terre cuite au coin haut gauche, nom et téléphone en
// petit à droite, rond terre cuite fixé au coin bas droit, à l'ordinateur, qui s'ouvre sur le numéro), Hero/talus (photo plein cadre, le nom en très grand posé
// dessus, le métier et les portes en bas à droite, puis la phrase sur le papier), Services/talus (l'escalier : une prestation par rangée, sa photo occupe des cases entières et touche la précédente
// par un coin, son texte dans les cases vides d'en face), About/talus, Proof/talus, Contact/talus (panneau gris-bleu à grande
// phrase, puis la rangée des trois coordonnées en grand), modèles presets/talus.json et presets/talus-paysage.json.
export default {
  nom: 'talus',
  ambiance: "Papier crème découpé en six colonnes, une grotesque légère pour tout, des photos de lieux qui occupent des cases entières et descendent la page en escalier en se touchant par un coin, un triangle et un rond terre cuite aux deux coins, un panneau gris-bleu pour finir. Calme, posé, de plein air.",
  metiers: ['architecte', 'paysagiste', 'constructeur de maisons', 'renovation', 'charpentier', 'menuisier', 'piscinier', 'maitre d oeuvre', 'jardinier', 'gite'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'street food', 'bar de nuit', 'enfants'],
  source: 'https://taylorhare.com/',
};
