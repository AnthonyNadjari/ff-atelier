// Style réel : https://blankinside.co.uk/ (Blank Inside, petite boutique anglaise de cartes illustrées ; fiche
// docs/veille/styles/rayon.md, veille du 31 oct 2026, tour 20, volet 2a quater). Construction codée : Nav/rayon (bandeau
// d'encre à bords pointillés avec « Commander par téléphone », le nom au centre de la tête, le métier à gauche, le
// téléphone à droite), Hero/rayon (h1 et portes, onglets soulignés « La sélection / Toute la gamme », la première étagère
// en piste au doigt), Services/rayon (les rayons en étiquettes à contour, puis un rayon par famille de produits : titre
// écrit au feutre et flèche dessinée, étagère en piste ou case vedette et piste sur deux rangs), Proof/rayon (les avis
// posés dans les cases grises comme des articles), About/rayon (le nom en grand à côté de l'histoire), Contact/rayon (la
// fin de la source : trois ronds tamponnés, Appeler, Venir, Écrire, sans formulaire) ; modèles presets/rayon.json et
// presets/rayon-fromager.json.
export default {
  nom: 'rayon',
  ambiance: "Boutique de papier : blanc franc, une seule encre indigo, la gamme dans des cases gris lavande sur des étagères qu'on fait glisser au doigt, titres de rayons écrits au feutre avec une flèche, étiquettes à contour et ombre dure. Gai, rangé, la couleur vient des articles.",
  metiers: ['papeterie', 'librairie', 'epicerie fine', 'fromager', 'caviste', 'fleuriste', 'imprimeur', 'atelier d illustration', 'torrefacteur', 'chocolatier', 'boutique de createurs'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'depannage', 'avocat', 'notaire', 'pompes funebres', 'plombier'],
  source: 'https://blankinside.co.uk/',
};
