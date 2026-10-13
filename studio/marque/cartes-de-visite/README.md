# Cartes de visite

Trois modèles, recto et verso, aux couleurs du site :

- **Nuit** : fond encre des deux côtés, monogramme crème au recto. Le plus proche du site.
- **Papier** : fond crème, logo complet à l'encre. Le plus classique.
- **Grand monogramme** : recto encre avec un monogramme cuivre géant qui sort du cadre, verso crème.

## Faire ses cartes

1. Copier `coordonnees.exemple.json` en `moi.json` (ce fichier n'est pas envoyé sur GitHub) et le remplir :
   nom, rôle, téléphone, e-mail, site.
2. Lancer : `node studio/marque/cartes-de-visite/build.mjs studio/marque/cartes-de-visite/moi.json`
   (ou demander à Claude « fais mes cartes avec ces coordonnées »).
3. Ouvrir `dist/apercu.html` pour comparer, puis envoyer à l'imprimeur le PDF du modèle choisi
   (`dist/nuit.pdf`, `dist/papier.pdf` ou `dist/monogramme.pdf`).

Sans fichier de coordonnées, le script utilise l'exemple (Prénom Nom, 06 00 00 00 00) : à ne pas imprimer.

## Pour l'imprimeur

- Format fini **85 × 55 mm**, PDF de **91 × 61 mm** (fond perdu de 3 mm de chaque côté, déjà inclus).
- Page 1 = recto, page 2 = verso.
- Texte à 5 mm au moins du bord fini (le script vérifie et signale sinon).
- Couleurs en RVB : les imprimeurs en ligne convertissent. Encre `#15120f`, crème `#f0e8db`, cuivre `#d39a6a`
  (sur fond crème, cuivre foncé `#8a5a33`).
- Papier conseillé : mat, 350 g ou plus. Le fond encre pleine page marque les doigts sur un papier brillant.
