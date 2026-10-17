# Relecture — Alain Ballay, maçon carreleur (prospect-ballay-macon)

Démo privée pour un vrai artisan prospecté (`legal.prospect` : noindex, robots fermé). Jamais publiée.

## Tour 0 — 17 oct 2026 — une piste, relecture dégradée : un seul contexte (pas d'agents relecteurs lancés : consigne « deux passes au plus », jugement fait sur les captures, la planche et le film)

### Ce qui est fait
- Squelette : coquille `flow`, barre du haut couleur encre (nom, « Maçon carreleur, Perpignan », liste « Travaux »,
  06 88 70 72 35 en entier), premier écran « Chantier » (sa photo du barbecue en pierre en plein cadre, carte posée
  dessus avec une tranche terre cuite), avis en carreaux, l'échantillonnier, les six travaux, Alain Ballay, estimation
  gratuite et contact (fond encre), pied bleu. Six pages de travaux sur mesure (`pages/carrelage.astro`… gabarit
  `sections/parts/PageTravail.astro`) : photo de chantier en plein cadre et carte posée dessus ; démoussage et
  façades, sans photo au brief, ont un premier écran encre sans image.
- Socle GOUT § 0 : plusieurs pages (accueil + 6), téléphone en haut sans défiler, h1 « Maçon carreleur à
  Perpignan », avis juste sous le premier écran (5,0 sur Google, 5 avis ; Julien D. et Nonam Tattoo mot pour mot),
  « à son compte depuis septembre 2000 » et « ancien maître ouvrier dans les monuments historiques » dès la phrase
  du premier écran, ses photos seulement (aucune Pexels), portes par travail, barre du bas (Appeler, Estimation,
  Venir). Pas de formulaire : « Estimation » ouvre la messagerie du visiteur vers son e-mail (mailto).
- Élément original : l'échantillonnier. Six matériaux qu'on voit sur ses chantiers (pierre de parement, opus
  incertum, grands carreaux, effet bois, brique, ardoise) ; chaque échantillon est découpé dans SA photo, le toucher
  ouvre ce chantier en grand avec la page du travail qui le pose. Pas d'avant / après : aucune paire de la même vue.
- Mouvement (piste calme, rien ne suit le défilement) : la carte se pose sur la photo (0,6 s, sans rebond), la photo
  recule une fois de 1,04 à 1 ; l'échantillon touché s'enfonce, la vue change par un glissé court et sec.
- Images dérivées (`images-derivees.cjs`, à rejouer après `ff images`) : ses photos de téléphone pesaient 200 à
  300 Ko dès 800 px ; l'accueil chargeait 1,8 Mo. Échantillons, cartes et vues sont découpés à la taille affichée ;
  les vues 2 à 6 ne se chargent qu'au toucher. Budget images de l'accueil vert.
- Direction `mediterranee` (chaux, terre cuite, bleu), Special Gothic + Karla (Archivo dépassait le budget polices).
- `ff prevol` vert (contrat, aiguillage, build, verifier, audit-motion, nettete, detect, perf, signatures).
  `ff variete` : aucun doublon ; squelette et direction différents de l'ébéniste et des fromageries.

### Défauts de l'usine trouvés en route (contournés dans le site, voir aussi la relecture d'À cœur bois)
1. `ff images` perd la taille d'origine entre deux paliers (1 952 px → 1 600) : complété localement sous 2 400.
2. Règle globale `a[aria-label]` (0,3,1) : le numéro de la barre passait sous son icône sur téléphone. Contourné.
3. CSS global `img:not([src])` caché : une image posée en script doit avoir un `src` (piège payé sur la vue).
4. `ff perf` compte toutes les `<picture>` du HTML, même chargées au toucher : les vues 2 à 6 sont en `data-*`.

### Ce qui reste faible
- Photos de chantier prises au téléphone, beaucoup « en cours » (croisillons, seaux, natte) : c'est honnête, mais
  peu de photos finies et propres ; une seule en largeur (le barbecue).
- Démoussage et façades : deux pages sans photo et à une phrase du brief : minces.
- Section « Alain Ballay » sans portrait ; sur ordinateur les trois photos en cours restent petites.
- L'avis « Nonam Tattoo » est affiché sous le nom du compte (un commerce), pas prénom + initiale : à valider.
- Captures prises un samedi : la case horaires affiche « Fermé » (GOUT § 3).
- Non vérifié : iPhone en ligne (pas de déploiement, consigne).

### Note honnête : 7 / 10
Son site actuel est un WordPress gratuit avec bandeau publicitaire, photos Pexels et texte générique. Ici, en une
seconde : sa plus belle réalisation en grand, « maçon carreleur à Perpignan », le numéro, l'estimation gratuite et
5,0 sur Google ; puis une preuve qu'on manipule, faite de ses vrais chantiers. Un artisan du bâtiment paierait pour
ça. Il manque la photo finie et lumineuse de chaque travail pour passer à 8.

### Ce qui manque du client
- Des photos finies, de jour, de ses meilleurs chantiers (une par travail), surtout terrasse, salle de bain,
  toiture démoussée et façade nettoyée ; s'il en a, des paires avant / après de la même vue.
- Le lieu (commune) de chaque réalisation, pour les légendes.
- Relire l'avis de MARI Electricité (replié par Google) ; accord sur l'affichage « Nonam Tattoo ».
- Seul ou en équipe, assurance décennale, délais, zone précise ; retirer les photos Pexels de son site actuel.
