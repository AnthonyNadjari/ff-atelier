// Style réel : https://agronomywork.shop/ (Agronomy Workshop, petite marque de vêtements de travail à Los Angeles ; fiche
// docs/veille/styles/etabli.md, veille du 31 oct 2026, tour 20, volet 2a quater). Construction codée : Nav/etabli (liens à
// gauche, nom au centre, téléphone à la place du panier), Hero/etabli (la fiche de l'objet phare : à l'ordinateur trois
// tiers, la fiche, l'objet en grand sur son fond de pierre, une photo d'ambiance ; au téléphone l'objet collé en haut, la
// fiche qui monte dessus), Proof/etabli (avis en tiers, piste au doigt au téléphone), Services/etabli (les autres pièces,
// fiche collée à côté d'une grande photo, côtés alternés, vignettes qui changent la vue), Faq/etabli (l'escalier des
// questions qui se range au défilement), Contact/etabli (le nom en lettres géantes sur la photo, les vignettes de toutes
// les pièces, les coordonnées), modèles presets/etabli.json et presets/etabli-coutelier.json.
export default {
  nom: 'etabli',
  ambiance: "Fiche d'atelier : blanc franc, l'objet en grand sur un fond de pierre pâle, une grotesque nette en petit corps, le prix dans un cadre en chasse fixe, un seul bouton bleu plein pleine largeur. Précis, posé, l'objet d'abord.",
  metiers: ['coutelier', 'maroquinier', 'ceramiste', 'ebeniste', 'sellier', 'torrefacteur', 'luthier', 'savonnier', 'bijoutier', 'tapissier', 'chocolatier'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'depannage', 'plombier', 'serrurier', 'restaurant'],
  source: 'https://agronomywork.shop/',
};
