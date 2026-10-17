# Securya — https://securya.fr/
Titre « Installateur d'alarmes & sécurité en Gironde | Securya », `lang="fr-FR"`, description « Securya conseille et installe des systèmes de sécurité sur-mesure en Gironde : alarme, vidéosurveillance, contrôle d'accès. Audit de sécurité 100% gratuit. », technologie lue : WordPress, Elementor, Trustindex (avis), Complianz (cookies, TCF), Google Tag Manager. Démontage à la main du 2026-10-17 : **mesuré sur le code, pas sur capture** (HTML et CSS récupérés par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML, les positions à l'écran ne sont pas mesurées.

## Squelette
Premier écran (ordre du HTML) : barre haute « Rue François Coppée 33150 Cenon », « 7j/7 8h-20h », e-mail, deux téléphones cliquables (05 47 33 05 16, 06 38 46 27 89) ; nav ; puis « 4,9 ★★★★★ 133 avis Google » (lien vers la fiche Google) **au-dessus** du h1 « Securya Installateur d'alarmes et vidéosurveillance » ; une phrase (« particuliers et professionnels en Gironde ») ; bouton « Audit de sécurité offert – diagnostic anti-intrusion » ; quatre cases de réassurance « Audit de sécurité 100 % gratuit », « Plus de 15 ans d'expérience en sécurité », « Plus de 800 sites sécurisés », « Confidentialité totale garantie ».
Ordre de l'accueil (position dans le texte du HTML) : 8 services en cartes (h3, chacune vers sa page) → « Votre sécurité mérite mieux qu'un kit en boîte » → « Particuliers & Professionnels » et 10 avis Google signés (widget Trustindex, « EXCELLENT, basée sur 133 avis ») → « Nous vous accompagnons tout au long de votre démarche » → « Nos partenaires de confiance » (8 logos : Foncia, CCI du Lot…) → « Pourquoi choisir Securya » → formulaire « Demandez un audit de sécurité offert » (10 champs, choix Particulier / Professionnel) → pied.
Nav : Accueil, À propos, Particulier, Professionnel, Nos services (8 sous-pages), Nos réalisations, Blog, Contactez-nous. Pied : 10 pages villes (« installateur-alarmes-merignac », Talence, Pessac, Libourne, Agen…), horaires, mentions légales, « Design & Développement - agence web evico ».
Téléphone cliquable : oui, 9 liens `tel:` sur l'accueil. Formulaire : 1 (10 champs). Horaires : « 7j/7 8h-20h » en haut, détail jour par jour en pied.

## Typographie
Lue dans le CSS (pas de DOM calculé) : Inter (173 déclarations) et Syne (50), Google Fonts. Ce qui la rend rare : rien, Inter est sur la liste des polices « IA » de docs/GOUT.md.

## Couleur et matière
Non mesurée (pas de capture). Logos « bleu violet » et « blanc » lus dans les noms de fichiers. 112 `<img>` dans le HTML, dont 9 images de services (noms de fichiers « installation-alarme-interieur », « generateur-de-brouillard-securya »…) : vraies photos ou banque, à juger, le code ne le dit pas.

## Mouvement
Swiper (carrousel des avis Trustindex). Rien d'autre de lu. 28 déclarations `border-radius` en pilule dans le CSS (boutons Elementor) : à juger.

## Le geste signature
Aucun geste de dessin ; le geste commercial est la **note Google au-dessus du h1** (4,9, 133 avis), avant même le métier.

## Ce qu'on garde / ce qu'on refuse
Garde : note Google chiffrée au premier écran, quatre preuves chiffrées sous le bouton (15 ans, 800 sites), une offre gratuite nommée (« audit de sécurité offert ») comme porte d'action, horaires 7j/7 dans la barre haute, une page par ville desservie.
Refuse : Inter, 59 feuilles CSS (~1,5 Mo de CSS externe), bannière de consentement TCF (Complianz) pour des traceurs Google.

## Verdict marché (veille du 17 oct 2026, tour 3)
Source : agence Evico (Bordeaux), page « Réalisations de sites internet pour artisans » (https://evico.fr/category/nos-realisations/realisations-de-sites-internet-pour-artisans/), premier cas de la liste : https://evico.fr/refonte-site-securya-installateur-alarmes-videosurveillance-gironde/ (publié le 17 avril 2026). Tirage : ville `$RANDOM` 2235 mod 24 = 3 → Bordeaux. URL lue : https://securya.fr/ (HTML 298 Ko, premier octet 1,5 s depuis le proxy de la session).

**Un artisan paierait-il 1 200 € pour ça ?** Oui : c'est un site qui fait appeler. Chaque bloc de l'accueil est une preuve ou une porte (note Google, années, volume, audit gratuit, formulaire, logos de clients, avis signés, villes). Le dessin est quelconque (Elementor, Inter) et lourd ; ce qui vend, c'est la densité de preuves vérifiables au-dessus du pli.

**Leviers vus** : Photos réelles : à juger (9 images de services, aucune légende de chantier). Premier écran : note Google + nombre d'avis au-dessus du h1, métier, zone (Gironde) dans la phrase, 2 téléphones et horaires 7j/7 dans la barre haute, bouton d'offre gratuite, 4 chiffres de réassurance. Preuves : 133 avis Google (10 affichés et signés), « depuis plus de 15 ans », « 800 sites sécurisés », 8 logos de clients et partenaires. Structure : plusieurs pages (8 services, 10 villes, Particulier / Professionnel, réalisations, blog), formulaire sur l'accueil. Appels : téléphone (×9), « Audit de sécurité offert » (×5), « Demandez une visite sur site gratuite », « En savoir plus » par service. Vitesse : lourde (59 feuilles CSS). Mobile : non mesuré ; un bouton téléphone répété dans l'en-tête mobile lu dans le HTML (« X 06 38 46 27 89 »).
