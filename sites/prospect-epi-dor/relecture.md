# Relecture — L'Épi d'Or (prospect-epi-dor)

Relecture dégradée : un seul contexte (consigne du test : une piste, pas d'agents relecteurs lancés ; planche,
film et captures regardés à l'œil par le constructeur). Jamais publié.

## Tour 0 — 17 oct 2026

**Fait**
- Squelette : coquille flow, nav sur mesure « Enseigne » (nom en lettres d'enseigne + état du moment + numéro, collée
  en haut ; dessous, le store saumon de la devanture = les cinq familles, chacune vers sa page, plus « Venir ») ; barre
  du téléphone Appeler / Commander un gâteau / Venir ; accueil : Devanture → Avis → Rayons → Vitrine → Équipe → Venir ;
  pied `minimal`. Direction `mediterranee`, accent = rouge des lettres de l'enseigne, Libre Caslon Condensed + Familjen
  Grotesk.
- Socle : 5 pages famille sur mesure (`/services/pains`, `patisseries`, `pieces-montees`, `sandwichs`, `fetes`, servies
  par `sites/…/pages/services/`, elles priment sur la page partagée : avertissement Astro attendu au build) ; téléphone
  en haut partout ; h1 « Boulangerie-pâtisserie à Orléans » ; 4,6 / 162 avis Google dans la carte du premier écran,
  puis Sylvia D. et Marie C. mot pour mot juste dessous ; ouvert / fermé et horaires du jour (fériés de l'après-midi
  compris, la règle du brief) ; portes par intention ; pas de formulaire (e-mail en lien dans Venir).
- Beauté : devanture du soir en plein cadre, carte papier épaisse posée dessus qui déborde sur la section suivante,
  photo en plan arrière (parallaxe bornée) ; rayons en grandes photos avec plaques qui débordent ; pain et sandwichs
  sur panneaux de faïence (comme ceux de sa façade) au lieu d'une photo de banque ; citation de Xavier posée sur la
  tarte meringuée ; Venir posé sur le bas de la devanture.
- L'élément original : « L'année en vitrine », la galerie des fêtes de la boutique (cœurs, œuf de Pâques, fraisier
  au muguet, pièce montée, trois bûches) en étagère courbe qu'on fait tourner au doigt, qui s'ouvre seule sur la
  prochaine fête (le 17 oct : « Noël, dans 69 jours » + sa phrase « Commandez au plus tôt… » + le numéro). Entrée :
  la lumière de la devanture s'allume si la boutique est ouverte, reste dans la pénombre sinon.
- Photos 04, 05 (prénom d'enfant) et 07 (super-héros) rangées dans `raw/ecartees/`, jamais dans `public/` ni `dist/`.
- Contrôles : `ff contrat` vert, `ff prevol` tout vert (verifier, audit-motion, nettete, detect, perf 519 / 600 Ko).
  Avertissements restants : longueur de paragraphe et rythme dans les pages légales partagées, pas de phrase en
  « Et / Mais » sur l'accueil.
- Correctif d'usine : `scripts/ff/verifier.mjs` refusait tout site `legal.prospect` (robots.txt fermé exprès,
  contrôle « bots de recherche IA » rouge). Exception ajoutée : un prospect passe si robots.txt refuse tout. À relire
  par le studio (touche aussi les deux autres prospects).

**Faible**
- Les photos sont des photos de téléphone (fonds de cuisine, granit, signature « L'Épi D'Or » incrustée) : belles en
  vitrine sombre, moins en plein cadre sur les pages famille.
- Aucune photo de pain, de viennoiserie, du fournil ni de l'équipe : pour une boulangerie, le pain n'est montré qu'en
  mots. C'est la première chose à demander (guide photo).
- La vitrine est petite sur téléphone (un gâteau et demi visibles) ; la rotation se voit mieux sur ordinateur.
- L'équipe et le bas des pages famille restent plus plats que le haut de page.
- Pas d'année « Depuis » (2001 au registre, à confirmer) ni de prix : rien au brief.
- Non vérifié : iPhone réel en ligne (rien n'est déployé), comportement de la timeline de vue sur un vieux Safari
  (repli prévu : étagère droite).

**Note honnête : 7 / 10.** Le socle est complet et juste, c'est son vrai commerce (sa façade, ses gâteaux, ses
horaires, ses avis), et la page a de la profondeur et un mécanisme utile (la prochaine fête et le numéro). Il manque
de quoi passer à 8 : ses propres photos de pain et de l'équipe, et une vitrine plus généreuse sur téléphone.

**Par rapport à son site actuel (boulangerielepidor.fr)** : nettement mieux sur le premier écran (le sien ouvre sur
deux bandeaux de consentement et une liste d'annonces de fermeture ; ici : devanture, métier + ville, note, numéro,
ouvert ou fermé, en un écran, sans aucun bandeau puisqu'aucun traceur), sur la note (162 avis à jour contre 151), sur
les photos (en grand au lieu d'une galerie à cliquer), sur le téléphone (barre d'actions). Moins bien sur un point : son
catalogue de 201 fiches produit, que cette démo ne reprend pas (elle en nomme les familles et quelques produits).

Décisions prises pour le fondateur :
- Avis « D comme Découvrir » écarté (pas un prénom) ; pour l'ajouter, dire « mets le troisième avis ».
- Pas de formulaire malgré l'e-mail au brief (commande au téléphone, portes par intention) ; pour l'inverse, « ajoute
  un formulaire ».
- Gamme « Russe » sans page (aucun produit nommé) : une ligne dans l'équipe.
