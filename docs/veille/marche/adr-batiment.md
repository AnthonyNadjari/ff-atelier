# ADR Bâtiment (https://www.adr-batiment.com/)
Titre « ADR Bâtiment - Maçonnerie générale en Haute-Savoie (74) », `lang="fr"`, description « Entreprise de construction et rénovation en Haute-Savoie depuis 15 ans. … Devis gratuit sous 24h. », technologie lue : Next.js (Tailwind), aucun traceur ni bannière cookies relevé dans le HTML. Démontage à la main du 2026-10-24 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : en-tête fixe, logo, nav (Accueil, Nos services, À propos, Contact, FAQ, Réalisations), bouton **« Nous Appeler »** (`tel:`) ; photo de construction ; deux h1 : « ADR Bâtiment - Maçonnerie générale » puis « Entreprise de construction et rénovation en Haute Savoie (74) » ; bouton **« Devis transparent en 24h »** ; juste dessous, 3 chiffres : « 500+ Chantiers achevées », « 15+ Années d'expérience », « 30+ Projets réalisés par an ».
Ordre : « Maçon passionné depuis 15 ans », **le gérant parle à la première personne** (« je suis spécialisé… En créant ADR BATIMENT, j'ai voulu… ») à côté du logo → « Un projet réussi en 3 étapes » (expertise, réalisation, livraison et suivi) → 5 services (construction neuve, rénovation et extension, coffrage et petit terrassement, aménagement extérieur, piscine clé en main) → pied (téléphone cliquable, e-mail Gmail, « Site créé par Annecy Dev », « Privacy Policy | Terms of Use | Contact Support » en anglais).
Structure : environ 10 pages (une par service, à propos, FAQ, réalisations, contact). Page Réalisations : **8 chantiers, chacun avec la commune et le mois** (« Chantier à Cruseilles — avril 2026 », « Ouverture de 5 m dans un mur porteur », Annecy, août 2025) et 2 à 8 photos. Téléphone cliquable : 2 liens `tel:`. Formulaire : aucun sur l'accueil (page Contact, sans pièce jointe).

## Typographie
Lue dans le HTML : Poppins (`next/font`, variable `--font-poppins`). Poppins est sur la liste des polices « IA » de docs/GOUT.md.

## Couleur et matière
Non mesurée. 14 `<img>` sur l'accueil : noms de fichiers de banque ou de rendu (`maison-moderne-piscine-rendu-3d`, `plan-architecture-construction-grues`, `ouvrier-demolition-renovation`) ; les photos de la page Réalisations portent le nom du chantier.

## Mouvement
Non mesuré (en-tête à transition lue dans les classes).

## Le geste signature
Aucun geste visuel. Le geste commercial : **le chantier daté et situé** (commune, mois, ouvrage précis) sur la page Réalisations.

## Ce qu'on garde / ce qu'on refuse
Garde : « Nous Appeler » en tête, délai de devis chiffré sous le h1, années de métier, gérant à la première personne, parcours en 3 étapes, réalisations datées et situées.
Refuse : photos d'accueil qui ne sont pas les siennes, deux h1 (trois sur la page), mentions du pied en anglais, faute « Chantiers achevées », Poppins, aucun avis.

## Verdict marché (veille du 24 oct 2026, tour 6)
Source : Annecy Dev (Théophile Pinto, développeur indépendant, Annecy), page réalisations https://annecy-dev.fr/portfolio, premier projet : « ADR Bâtiment, entreprise de maçonnerie générale en Haute-Savoie (74) ». Tirage : `$RANDOM` 11939 mod 15 = 14 → Annecy ; les agences trouvées d'abord (MD Agency, Sitenova, Dilo, Alpaweb) ne montrent pas de lien client dans leur HTML. URL lue : https://www.adr-batiment.com/ (HTML 64 Ko, premier octet 0,4 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Oui : c'est le site le plus net du tour pour un artisan seul (appeler en tête, devis en 24 h, 15 ans, la voix du maçon, des chantiers datés près de chez soi). Ce qui le retient : les photos de l'accueil ne sont pas ses chantiers, alors que la page Réalisations en a des dizaines.

**Leviers vus** : Photos réelles : oui sur la page Réalisations (8 chantiers), banque probable sur l'accueil. Premier écran : « Nous Appeler », métier + département, « Devis transparent en 24h », 3 chiffres. Preuves : 500+ chantiers, 15 ans, chantiers datés et situés ; aucun avis, aucun label. Structure : environ 10 pages. Appels : « Nous Appeler », « Devis transparent en 24h ». Vitesse : HTML 64 Ko, premier octet 0,4 s. Mobile : balise viewport présente, nav repliée sous `lg` ; rendu non mesuré.
