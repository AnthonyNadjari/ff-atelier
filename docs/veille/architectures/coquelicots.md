# Coquelicots — architecture « tout mène à l'outil : le calendrier de réservation est la destination de l'accueil »

- Source : https://coquelicots.nl/ ; page intérieure lue : https://coquelicots.nl/informatie (démontées le 17 oct 2026). Fiche de goût antérieure : `docs/veille/demontages/coquelicots.md`.
- Métier : gîte (maison de vacances avec piscine) en Dordogne, tenu par un couple néerlandais ; site en néerlandais (studio noot.studio).
- Mesures : `coquelicots-demontage.md`, `.json`, `-style.json`, captures `captures/coquelicots-*`.

## Le modèle en une phrase

Un site court (5 pages) dont l'accueil est un chemin vers un **outil** : photo, qui sont les propriétaires, quelques photos du lieu, les avis notés sur 10, puis le **calendrier de disponibilités et de réservation en trois étapes** (dates, coordonnées, confirmation), avec un récapitulatif à côté ; le bouton « Boeken » de l'en-tête, collé en permanence, saute directement à cet outil.

## Schéma de l'accueil (6,8 écrans ordinateur, 5,9 téléphone)

```
[en-tête fixe : logo + nom à gauche | phrase de bienvenue signée au centre | « Boeken → » (bleu nuit) + « Menu » (bleu clair) à droite]
[photo de la piscine au coucher du soleil, dans un cadre arrondi, 72 % de l'écran]
[forme de NUAGE bleu : « Nous sommes tombés amoureux de la Dordogne » + photo des deux propriétaires dans une forme organique]
[leur histoire, texte centré]
[3 photos du lieu découpées en formes de fleur/nuage]
[forme vert d'eau : « Ce qu'en ont pensé nos visiteurs » : carrousel d'avis en cartes, note sur 10, mois du séjour, 1/25]
[OUTIL « Réservez directement vos vacances » : étapes (Choisir les dates | Vos coordonnées | Confirmation),
   deux mois côte à côte, jours libres et pris en couleur | panneau « Votre sélection »]
[pied rouge : coquelicots dessinés, NOM en capitales géantes, liens Informatie / Foto's / Reviews / Contact]
```

## Schéma d'une page intérieure (`/informatie`, 3,4 écrans)

`[en-tête fixe] → [titre dans une forme colorée] → [informations pratiques : la maison, les chambres, la piscine, les équipements, l'arrivée] → [photos en formes] → [pied rouge]` ; `/contact#book` reprend l'outil.

## Navigation, contact, preuves, téléphone

- Pages : accueil, Informatie, Foto's, Reviews, Contact (+ ancre `#book`). Menu en panneau latéral (500 x 880 px) depuis le bouton « Menu ».
- Contact : le **bouton Boeken** toujours visible (en-tête fixe) ; formulaire dans l'outil ; aucun téléphone cliquable mesuré.
- Preuves : 25 avis en carrousel avec note sur 10 et date du séjour, une page Reviews ; la photo des propriétaires.
- Téléphone : en-tête fixe compact (Boeken reste), formes et cartes en une colonne, l'outil passe sur un mois par écran (à juger).

## Rythme, texte et images, profondeur

Aéré : grandes respirations entre des formes colorées ; 1 474 mots dans la page (dont l'outil et les avis). Images peu nombreuses (8) mais toutes découpées en formes. Profondeur par superposition de formes (nuages qui débordent sur les photos, cartes d'avis à ombre douce).

## Style (à réappliquer tel quel)

- **Polices** : une seule famille arrondie, *Laca* (semi-grasse pour les titres, légère pour le texte) : h2 70 px / 42 px téléphone, interlignage 0,85 ; corps **24 px** / 20 px, graisse 300, interlignage 1,5 ; boutons 16 px ; nom en pied dans une grotesque condensée capitales géante.
- **Couleurs** (rôles) : rose papier `#fdf8f5` = fond (71 %) ; vert d'eau `#add5c0` = formes et zone de l'outil (17 %) ; bleu nuit `#121d5e` = bouton principal et texte des liens (10 %) ; vert sapin `#1c402d` = texte courant (89 % des caractères) et panneau « Votre sélection » ; bleu ciel (forme nuage) ; vieux rose `#e8c4bf` = jours du calendrier ; rouge coquelicot = pied ; jaune pâle = petites étiquettes.
- **Espacements** : sections séparées de 100 px et plus ; texte centré de 500 px (~42 caractères).
- **Rayons et bordures** : cartes à 13 px, étiquettes à 9 px, boutons à 100 px (pilule) ; photos découpées en formes organiques ; aucune bordure.
- **Ombres** : une ombre courte et teintée vert (`0 6px 6px`, 25 %) sous les cartes d'avis.
- **Photos** : formes organiques (nuage, fleur, arche) plutôt que rectangles ; carrées ; lieu, piscine, propriétaires ; aucun filtre.
- **Boutons et liens** : boutons pleins bleu nuit avec flèche ; les lettres du bouton s'animent au survol (`data-button-animate-chars`) ; curseur personnalisé (point qui suit la souris).
- **Icônes** : 5 (flèches, menu).
- **Animations** : `ease-in-out` 0,3 s partout ; transform 0,6 s `cubic-bezier(0.625, 0.05, 0, 1)` ; entrée du menu et de la photo en 3 s au chargement.
- **Textures** : aucune ; les coquelicots dessinés du pied.

## Ce qui le rend différent de notre déroulé

Le bloc final n'est pas un formulaire de contact mais un **outil qui répond** (les dates libres) ; tout l'accueil est construit pour y mener, et le bouton de l'en-tête y saute. Notre déroulé finit par « contact » et n'a aucun outil qui montre une disponibilité.

## Ce qu'il faudrait à l'usine

- **Section outil** `contact/disponibilites` : calendrier lu au build dans l'iCal du client (Airbnb, Gîtes de France, Booking exportent un `.ics`), jours pris grisés, choix des dates, puis formulaire pré-rempli envoyé par e-mail (pas de paiement). Déjà prévu en bloc sur mesure au geste n° 10 de l'INDEX des démontages ; à promouvoir en variante.
- **Champ** `contact.calendarIcs` (URL de l'iCal) au schéma ; `contact.bookingUrl` existe pour les clients qui ont déjà un outil.
- La porte « Réserver » de la nav (existe) doit pouvoir pointer vers l'ancre de l'outil.
- Avis notés sur 10 avec date du séjour : `proof.testimonials` a `date`, il manque une note.

Coût : **moyen** (une section avec lecture d'iCal au build, un champ, sans coquille).

## Convient à (selon les données du client)

Tout client qui **vend des créneaux ou des nuits** et a un calendrier : gîte, chambre d'hôtes, salle de réception, location de matériel, atelier ou stage à dates, photographe (jours libres). En version « devis » : artisan qui veut un formulaire guidé en étapes (type de travaux, surface, délai). Inutile pour un commerce à horaires simples.

## Signes IA à NE PAS reprendre (GOUT § 2)

- Boutons **pilule** (rayon 100 px) : boutons droits ou à 4 px.
- **Curseur personnalisé** qui suit la souris et lettres du bouton animées au survol.
- Petites étiquettes jaunes au-dessus des titres (« Familie Noteboom », « Onze reviews ») : c'est l'eyebrow.
- Police de secours « IA » chargée (Cormorant Garamond, Poppins) même si peu utilisée.
- Formes organiques sur **toutes** les photos : en garder une (le portrait des propriétaires), pas toutes.

## Codée dans l'usine (26 oct 2026)

`layout: { architecture: 'outil-calendrier' }` (`src/lib/architectures.ts`, coquille `calendrier`). Fait : le champ
`disponibilites` (au lieu de `contact.calendarIcs` prévu plus haut : les périodes occupées listées par le client
`occupe[]`, l'adresse iCal `ics` lue AU BUILD par `src/lib/ics-build.ts` (https, 8 s, 2 Mo, illisible = pas de
calendrier, jamais « tout est libre »), `mois`, `nuitsMin`, `arrivee`, `depart`, `capacite`, `tarifs`) ; le module pur
`src/lib/sejour.ts` (nuits prises, séjour libre, mois du lundi au dimanche, lecture d'iCal) ; l'outil
`src/components/Disponibilites.astro` (un tableau par mois lisible sans script, nuit prise barrée et dite ; dans le
navigateur on touche l'arrivée puis le départ, la sélection se dit en mots, le séjour minimum est rappelé, et les champs
Arrivée et Départ de la demande se remplissent : formulaire existant, `ContactForm sejour`, aucun paiement) ; la page
`/disponibilites` (12 mois) ; la porte Réserver de la nav qui saute à l'outil sans `contact.bookingUrl`
(`src/lib/actions.ts`) ; « les deux semaines qui viennent » en bande dès le premier écran (au-dessus du h1 au téléphone).
Restent : la note sur 10 et la date du séjour dans les avis, le choix du logement dans le calendrier quand il y en a
plusieurs (un calendrier par logement), les formes organiques (une seule : le portrait des hôtes en arche).

Preuve : site jetable (gîte de démonstration, deux logements, quatre périodes occupées, copie de `_exemple` sans photo,
supprimé), `ff verifier` vert hors données de test (`ff a11y`, `ff typo`, `ff ia` compris), clic réel vérifié (arrivée,
départ, nuit prise refusée, champs remplis), `ff ressemblance` contre tous les sites du registre : 0,49 au premier écran
téléphone (veto-du-drac), 0,59 ordinateur (cantine-roulante), 0,55 au déroulé (atelier-lecerf). Essai refusé : le h1 en
tête sans la bande (0,67 au premier écran téléphone de cantine-roulante).
