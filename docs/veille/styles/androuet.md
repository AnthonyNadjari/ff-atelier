# Androuet : https://www.androuet.com/

Fromager-affineur (Paris, douze boutiques). Veille du 25 oct 2026 (volet 2a quater). Relevé dans le DOM calculé de Chromium à 1440x900 et 390x844 (`ff atomes mesurer`, brut dans `atomes/mesures/androuet.json`), captures et défilement regardés. On reprend un style, jamais les textes, images, logos ou code.

## Le style en une phrase

Crème, cartes blanches décalées, rouge brique pour la carte posée sur la photo et les boutons, portraits d'équipe en arche.

## Typographie

- Titre : Inter Tight (graisse 400, interlignage 1.5, casse none, interlettrage 0 em) ; libre : **hanken**.
- Texte : Inter Tight (graisse 300, interlignage 1.5) ; libre : **hanken**.
- Échelle (px) : h1 téléphone 36 / ordinateur 16 ; h2 téléphone 36 / ordinateur 44 ; texte téléphone 16 / ordinateur 16.
- Inter Tight (famille Inter, police IA) : Hanken Grotesk, grotesque libre la plus proche, une seule famille ; titres en graisse normale, texte en maigre.

## Couleurs

- Régime : clair ; fond #f5f1e7, surface #ffffff, texte #141414, texte2 #686561, accent #a72e35, accent2 à juger, bordure #a72e35, encre #58171e.
- Crème #f9f6f1 et #f5f1e7 (le second gardé en fond : chroma 0,014, teinté), cartes blanches, rouge brique #a72e35 pour la carte posée sur la photo et les boutons, bordeaux #58171e en pied.

## Espacements, formes, matière

- Marge de section : téléphone 82 / ordinateur 160 ; gouttière : téléphone 48 / ordinateur 24 ; conteneur 1280 ; mesure 66 caractères ; rythme uni. Cartes d'offres décalées en hauteur sur deux colonnes de part et d'autre du titre.
- Rayons : bouton 4, carte 8, image 0 ; bordure 1 ; ombre aucune ; bouton plein (casse none) ; lien couleur.
- Matière : fond uni, filets aucun, texture aucune.

## Photos

- Traitement masque, superposition chevauchement, rapports 3:2, 16:9+, 4:3. Plateau de fromages en plein cadre, carte rouge posée dessus en haut à gauche ; portraits d'équipe en arche ; brin d'herbe détouré en ornement.

## Mouvement

- Profil `ressort-au-survol` (vivant, défilement apparitions) ; interface 0.35 s / ease ; scène 0.5 s / cubic-bezier(0.16, 1.08, 0.38, 0.98). Courbe de scène à léger dépassement cubic-bezier(.16,1.08,.38,.98) 0,5 s ; flèches qui bougent au survol des cartes.

## Architecture

Accueil : plateau de fromages plein cadre avec carte rouge (nom, « depuis 1909 »), offres en cartes décalées sur deux colonnes, recrutement avec portrait en arche, portraits de l'équipe, boutiques, pied bordeaux. Une page par offre et par boutique.

## Premier écran

Famille `carte-sur-photo`. Plateau en plein cadre, carte rouge brique posée en haut à gauche avec le nom, l'ancienneté et un bouton.

## Verdict (essai du 25 oct 2026)

**Gardé**. `ff melanger demo-boulangerie --style androuet --essai`, planche posée à côté des captures de la source. Premier essai m-f5804d : crème et brique justes, mais l'interlignage 1,5 relevé ouvrait un trou entre les lignes du h1 : règle apprise (plafond 1,3), second essai propre. Style français de commerce de bouche : le plus proche d'un client de l'usine.
