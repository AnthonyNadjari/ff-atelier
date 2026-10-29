// Style réel : https://www.23gradicoffee.com/ (fiche docs/veille/styles/chapitre.md, veille du 29 oct 2026, volet 2a quater).
// Construction codée : Hero/chapitre (le nom en capitales fines de bord à bord en haut, trois faits, la photo du lieu en
// plein cadre sous un voile bleu nuit avec l'emblème, la phrase centrée dessous), Filigrane (courbes de niveau au trait), Chapitre (règle de chapitre numérotée, composant),
// About/chapitre (001 : photo étroite à gauche, grand paragraphe en capitales à droite, mot géant coupé, engagements
// numérotés au centre), Services/chapitre (002 : le produit posé sur son nom géant, un à la fois, flèches et liste à points),
// Faq/chapitre (003 : titre centré, questions en rangées numérotées, réponses en chasse fixe), Proof/chapitre (004 : photo à
// gauche, avis à droite), Contact/chapitre (la dernière photo sous voile, le nom géant, les coordonnées), modèle
// presets/chapitre.json.
export default {
  nom: 'chapitre',
  ambiance: "Livre de nuit : bleu nuit partout, texte crème en chasse fixe, noms et titres en capitales fines à fort contraste, cuivre en accent, chapitres numérotés 001, 002, 003 sous une règle fine. Précieux, posé, pour un produit qu'on raconte.",
  metiers: ['torrefacteur', 'caviste', 'chocolatier', 'epicerie fine', 'the', 'distillerie', 'parfumeur', 'confiturier', 'apiculteur', 'horloger', 'ebeniste'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'plombier', 'garage', 'enfants'],
  source: 'https://www.23gradicoffee.com/',
};
