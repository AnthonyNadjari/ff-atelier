// Style réel : https://holographik.space/ (Holographik Space, salle louée et bar à café à Zagreb ; fiche
// docs/veille/styles/rideau.md, veille du 30 oct 2026, tour 19, volet 2a quater). Construction codée : Hero/rideau (grand vide
// noir, quelques lignes en bas, puis le premier écran plein de photo avec étiquette et nom centré ; barre de raccourcis
// flottante), Services/rideau (un écran plein de photo par prestation, titre centré qui se floute en sortant par le haut),
// Proof/rideau (un écran par avis), Contact/rideau (pied clair en colonnes), modèles presets/rideau.json et
// presets/rideau-salle.json.
export default {
  nom: 'rideau',
  ambiance: "Salle dans le noir : des écrans pleins de photo l'un après l'autre, chacun avec sa petite étiquette et son titre centré en grotesque serrée, le nom en chasse fixe, un pied clair qui ferme la page. Nocturne, sûr de lui, fait pour un lieu qui se montre.",
  metiers: ['salle de reception', 'lieu evenementiel', 'tatoueur', 'barbier', 'bar', 'galerie', 'studio photo', 'traiteur evenementiel', 'spa'],
  motionParDefaut: 'subtle',
  eviter: ['enfants', 'urgence 24/7', 'pharmacie', 'cabinet medical'],
  source: 'https://holographik.space/',
};
