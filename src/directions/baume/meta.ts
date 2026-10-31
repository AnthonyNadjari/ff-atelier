// Style réel : https://www.fiziopont.hu/ (FizioPont, kinésithérapie à Budapest ; Webflow showcase ; fiche
// docs/veille/styles/baume.md, veille du 30 oct 2026, tour 19, volet 2a quater). Construction codée : Hero/baume (le h1
// à gauche, la photo du soin dans un cadre aux coins adoucis devant une plaque sauge décalée, ombre réelle ; le nom en deux
// couleurs qui défile dessous), Services/baume (les motifs de consultation en cartes photo sur rose poudré), Process/baume
// (geste signature : les étapes en cartes sauge et menthe qui se rebattent en pile au défilement, le texte collé à gauche),
// About/baume (chaque praticien devant une plaque pêche décalée), Proof/baume (avis en piste qu'on fait glisser, grand
// guillemet pêche), Contact/baume (l'adresse en cartes sur menthe, puis l'appel final centré), Footer/baume (anthracite, nom
// en deux couleurs), modèles presets/baume.json et presets/baume-cabinet.json.
export default {
  nom: 'baume',
  ambiance: "Cabinet de soin doux et clair : blanc rosé, rose poudré, sauge et pêche, une géométrique grasse et ronde, la photo du soin dans un cadre aux coins adoucis devant une plaque de couleur décalée, des cartes qui se posent en pile, le nom du cabinet qui défile en capitales fines. Rassurant, net, chaleureux.",
  metiers: ['kinesitherapeute', 'osteopathe', 'sage-femme', 'orthophoniste', 'dieteticien', 'psychologue', 'podologue', 'infirmier', 'dentiste', 'coach sportif'],
  motionParDefaut: 'subtle',
  eviter: ['bar de nuit', 'garage', 'btp', 'metallerie', 'street food'],
  source: 'https://www.fiziopont.hu/',
};
