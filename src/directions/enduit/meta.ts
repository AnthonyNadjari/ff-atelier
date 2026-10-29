// Style réel : https://bcgbuildingdesign.com.au/ (BCG Building Design, Gold Coast ; fiche docs/veille/styles/enduit.md, veille du
// 29 oct 2026, volet 2a quater). Construction codée : Hero/enduit (photo plein écran, phrase posée en bas à gauche),
// About/enduit (phrase centrée à côté de sa photo, puis bande brune au nom géant qui monte lettre par lettre),
// Services/enduit (index des prestations : la ligne survolée montre sa photo au milieu de la liste), Proof/enduit (un avis
// entre deux photos, précédent / suivant), Contact/enduit (colonnes de coordonnées et nom géant brun sur le crème),
// modèles presets/enduit.json et presets/enduit-chantier.json.
export default {
  nom: 'enduit',
  ambiance: "Maison enduite à la chaux : crème sur toute la page, un seul brun terre, une grotesque en graisse moyenne, photos plein cadre de maisons et d'intérieurs, le nom en lettres géantes sur une bande brune. Sobre, sûr de lui, chaleureux sans décor.",
  metiers: ['macon', 'facadier', 'constructeur de maisons', 'renovation', 'architecte', 'paysagiste', 'piscinier', 'terrassier', 'plaquiste', 'charpentier'],
  motionParDefaut: 'subtle',
  eviter: ['street food', 'enfants', 'urgence 24/7', 'bar de nuit'],
  source: 'https://bcgbuildingdesign.com.au/',
};
