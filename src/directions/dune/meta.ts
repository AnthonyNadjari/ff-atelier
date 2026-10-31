// Style réel : https://steuermann.haus/ (Haus Steuermann, maison de vacances en deux ailes sur l'île de Föhr ; fiche
// docs/veille/styles/dune.md, veille du 30 oct 2026, tour 19, volet 2a quater). Construction codée : Hero/dune (photo lavée
// pêche et bleu presque plein écran, les deux premiers hébergements nommés au bord de l'écran, qui s'entrouvrent au survol
// sur leur photo ; titre et texte en deux colonnes dessous), About/dune (histoire en deux colonnes, paire de photos qui se
// chevauchent, l'une lavée), Services/dune (un hébergement par paire de photos et sa légende, en quinconce), Proof/dune
// (avis en deux colonnes, sans carte), Contact/dune (l'hôte en médaillon, venir, la page qui finit sur une photo lavée),
// modèles presets/dune.json et presets/dune-chambres.json.
export default {
  nom: 'dune',
  ambiance: "Maison d'île : blanc chaud, ardoise pour le texte, une grotesque fine, photos lavées pêche et gris-bleu posées par paires à côté de photos naturelles, beaucoup d'air. Calme, lumineux, sans décor.",
  metiers: ['gite', "chambre d'hotes", 'location de vacances', 'hotel', 'maison d hotes', 'camping', 'spa', 'institut', 'naturopathe', 'sophrologue'],
  motionParDefaut: 'subtle',
  eviter: ['urgence 24/7', 'bar de nuit', 'street food', 'depannage'],
  source: 'https://steuermann.haus/',
};
