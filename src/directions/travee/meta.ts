// Style réel : https://driessenarchitectuur.nl/ (Driessen Architectuur, agence d'architecture de Venray ; fiche
// docs/veille/styles/travee.md, veille du 31 oct 2026, tour 20, volet 2a quater). Construction codée : Hero/travee (un
// en-tête sur le blanc cassé, h1, métier à la ville, Appeler et Devis, puis la travée : les photos du client et de chaque
// métier côte à côte dans une bande qu'on fait glisser au doigt, la suivante qui dépasse du bord), About/travee (texte d'ouverture rentré à la première ligne,
// petit portrait, deux colonnes), Services/travee (index des métiers en deux colonnes à filets, chacun vers sa page),
// Proof/travee (les réalisations posées en quinconce dans une piste horizontale, étiquettes au trait ; puis l'avis sur la
// plaque verte posée sur une photo, d'un avis à l'autre au doigt), Contact/travee (la fin noire : la phrase d'appel, la
// photo de l'équipe, Appeler, Écrire, l'adresse), modèles presets/travee.json et presets/travee-menuisier.json.
export default {
  nom: 'travee',
  ambiance: "Agence d'architecture : blanc cassé chaud, noir d'encre, une grotesque technique serrée, boutons à angles droits, réalisations en grand qu'on fait défiler au doigt, une plaque verte pour l'avis. Construit, précis, sans décor.",
  metiers: ['architecte', 'menuisier-agenceur', 'menuisier', 'charpentier', 'renovation', 'paysagiste', 'constructeur bois', 'maitre d oeuvre', 'agenceur', 'couvreur'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'depannage', 'restaurant', 'boulangerie', 'bien-etre'],
  source: 'https://driessenarchitectuur.nl/',
};
