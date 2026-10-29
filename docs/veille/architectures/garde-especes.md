# garde-especes : le site d'une clinique vétérinaire part de « qui appeler maintenant ? »

Volet 2a ter de `/veille`, tour du 29 oct 2026. Relevé au `curl` (HTML servi) de l'accueil de la Clinique vétérinaire Les
Quais (et de sa fenêtre « Que faire en cas d'urgence vétérinaire ? »), de l'accueil et de la page Urgence de la Clinique
vétérinaire Saint-Max, plus un démontage automatique de l'accueil des Quais (`ff demonter`, Chromium 1440x900 et 390x844 ;
planche gardée : `garde-especes-source.jpg`). On reprend la construction, jamais les textes, images, logos ou code des
sources.

## Sources

- **Clinique vétérinaire Les Quais** (Saumur et Bourgueil, quatre vétérinaires, deux cliniques) :
  [clinique-les-quais.fr](https://www.clinique-les-quais.fr/), lu le jeudi 29 oct 2026. Barre : Accueil, L'Équipe, Nos
  services (médecine générale, préventive, chirurgie, analyses, imagerie, **NACS**, hospitalisation, nutrition, médicaments),
  Conseils (**Chiens, Chats, NACs**), Contact, et **« URGENCES » à part, en dernier**, répété deux fois au pied. Ce bouton
  ouvre « Que faire en cas d'urgence vétérinaire ? » en **trois temps** : garder son calme ; téléphoner au vétérinaire de garde
  et laisser un message (il juge l'urgence, conseille ou donne rendez-vous) ; ne jamais donner un médicament humain. Accueil :
  un texte de bienvenue qui nomme les espèces (chien, chat, lapin, rongeur, furet, oiseau, tortue), les deux boutiques, trois
  engagements, puis le pied (horaires des deux cliniques, téléphones).
- **Clinique vétérinaire Saint-Max** (Grand Nancy) : [vetosaintmax.fr](https://www.vetosaintmax.fr/),
  [urgence](https://www.vetosaintmax.fr/urgence), lus le même jour. Sous le h1 qui nomme **les espèces** (« chiens, chats et
  NAC »), **« Prendre RDV en ligne » et « En cas d'urgence » côte à côte** ; plus bas « Prendre rendez-vous en ligne » et
  « Service d'urgence 24h/24 » ; présentation, services, label, **« Urgences vétérinaires 24h/24 »**, équipe, « Où nous
  trouver », avis, FAQ (« Quels animaux soignez-vous ? »), et pour finir **« Prenez soin de votre animal dès aujourd'hui »**
  avec les deux mêmes portes. La page Urgence : le numéro, la **garde en rotation** avec deux cliniques voisines, la
  régulation qui oriente vers la clinique de garde, ce que l'équipe d'urgence prend en charge. Saint-Max appartient à un
  groupe ; seule sa construction est reprise ici.

## Pages

Les Quais : une vingtaine (accueil, équipe, neuf pages de services dont NAC, trois pages de conseils par espèce, contact,
mentions). Saint-Max : une trentaine (clinique, services, équipe, pense-bête par espèce, urgence, boutique, contact).

## Navigation

Les Quais : six entrées, **« URGENCES » en dernier, seul bouton plein** ; les conseils rangés par espèce. Saint-Max : sept
entrées dont « Pense-bête » (chiens, chats, NAC) et « Urgence », « Prendre rendez-vous » à part.

## Ordre de l'accueil (Saint-Max)

1. h1 (lieu, soins, urgences, espèces), « Prendre RDV en ligne » et « En cas d'urgence » côte à côte.
2. Présentation, services. 3. Urgences 24 h/24. 4. Équipe. 5. Où nous trouver. 6. Avis. 7. Questions.
8. Le dernier appel : rendez-vous ou urgence.

## Ce qui fait vendre

Le maître d'un animal arrive sur le site d'une clinique pour deux raisons : un rendez-vous, ou une urgence (souvent le soir).
Les deux sources mettent ces deux portes au même niveau, et l'urgence dit **quoi faire en attendant**, pas seulement un
numéro. L'usine en fait la construction entière : un bandeau urgence en tête, les deux portes côte à côte sous le h1 (« Prendre
rendez-vous » avec les horaires du jour ; « Une urgence ? » avec **le numéro du moment**, celui de la clinique quand elle est
ouverte, celui de la garde sinon, calculé dans le navigateur), puis un seul bloc à onglets : « Urgences » (les temps de la
conduite à tenir, les signes qui n'attendent pas, l'organisation de la garde) et un onglet par espèce (soins, conseils,
rendez-vous) ; **la nuit et le week-end, le bloc s'ouvre sur l'urgence**, le jour sur la première espèce. Venir, les services
et les questions sont dans le même bloc ; les avis et le dernier appel ensuite.

## Signes à NE PAS reprendre

h1 en capitales (« BIENVENUE À LA CLINIQUE VÉTÉRINAIRE LES QUAIS »), « URGENCES » en capitales sur un aplat magenta, la
conduite à tenir cachée dans une fenêtre surgissante, pictogrammes ronds des engagements, « Pourquoi nous choisir ? »,
promesses (« les équipements de pointe disponibles à tout moment »), photos de banque d'animaux.

## Codée dans l'usine (29 oct 2026)

`layout: { architecture: 'garde-especes' }` (`src/lib/architectures.ts`) : coquille `garde` (`src/shells/garde.astro`),
`garde` dans le schéma (`telephone` et `telephoneAffiche` si la garde a son propre numéro, `quand`, `organisation`,
`etapes[]`, `signes[]`, `especes`), `especes[]` (slug, nom, détail, phrase, soins, conseils, photo), `src/lib/garde.ts`
(`especesCompletes`, `etapesGarde`, `signesGarde`, `numeroDeGarde`, `numeroDuMoment`, `gardeLisible`, `lienEspeces`,
`lienUrgences`), `src/components/NumeroDuMoment.astro` (sans script les deux numéros ; avec, celui qui sert), pages
`/urgences`, `/animaux` et `/animaux/<slug>` (conseils en FAQPage), `wording.urgences` et `wording.especes`, mesures `garde` et
`especes` (2 au moins), nav « Les animaux » en tête et « Urgences » en dernier (comme aux Quais), sections avis puis questions
(rendues dans le bloc), pied `minimal`, tiroir de contact. Restent : deux cliniques sous un même site (Les Quais), la
régulation par un service extérieur (un champ de plus), le rappel de vaccins.

Preuve : site jetable (clinique d'essai à Saumur, trois espèces, garde d'essai au 02 00 00 00 00, aucun avis ; photos
d'illustration Wikimedia marquées ; supprimé), `ff verifier` vert hors téléphone et e-mail de test (`ff a11y`, `ff typo`,
`ff ia`, `ff nettete` compris), `ff ressemblance` contre les 40 sites du registre : au plus 0,56 au téléphone
(demo-electricien), 0,58 à l'ordinateur (fromagerie-ravanel), 0,56 au déroulé (fromagerie-ravanel-d) ; modèle « onglets »,
déroulé héros, bloc (classé questions), bandeau d'appel, pied. Essais refusés : bandeau urgence, conduite à tenir et espèces
en sections séparées (déroulé 0,65 à 0,73 de douze sites : « héros, services, lieu, pied » d'une longue page à pages de
services) ; puis la même chose avec les questions hors du bloc (0,70 de demo-osteopathe : même ordre « héros, outil,
questions ») ; les questions passent dans le bloc et le dernier appel de Saint-Max ferme la page. Capture : `garde-especes-essai.jpg` ;
source : `garde-especes-source.jpg`.
