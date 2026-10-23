# Sud Mécanique (https://sudmecanique.fr/)
Titre « Garage AD Expert Château-Gombert Marseille 13013 | Sud Mécanique », `lang="fr"`, description « Garage AD Expert à Château-Gombert, Marseille 13013 : mécanique, carrosserie, pneus, spécialiste Smart. 4,4/5 sur Google. Devis gratuit au 04 91 68 52 52. », technologie lue : Next.js (images `/_next/image`), aucun traceur ni bannière cookies relevé dans le HTML. Démontage à la main du 2026-10-23 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : barre haute avec **horaires** (« Lundi - Vendredi 08h00 - 12h00 | 14h00 - 18h00 ») et adresse ; nav (Smart, Mécanique, Pneus, Carrosserie, **Offres**, Conseils, Contact) avec téléphone cliquable ; photo d'atelier ; h1 « Garage AD Expert à Château-Gombert, Marseille 13013 » ; ligne de réassurance « 4,4/5 sur Google · Garage AD Expert · Devis gratuit » ; boutons « Prendre rendez-vous », téléphone, « Réserver en ligne (AD Expert) ».
Ordre : deux compteurs (« Réparations par an », « ans d'expérience ») **vides dans le HTML** → à propos (Smart, multimarque, carrosserie, pneus ; secrétariat et horaires) → **« Les offres du moment »** : 2 offres datées « du 5 octobre au 30 novembre 2026 » (-30 % kit de distribution, jusqu'à 80 € remboursés sur les pneus), chacune avec téléphone → 4 engagements (**garantie à vie** sur la carrosserie, garantie constructeur préservée, démarche environnementale du réseau, devis gratuit) → 4 compteurs vides → 6 services → prestations les plus demandées (« Recharge climatisation dès 79 € »…) → FAQ → **« Avis Google Vérifiés » 4,4/5 sur 119 avis** avec avis signés → 3 articles de conseils datés → pied avec 9 « zones desservies », chacune vers sa page.
Structure : environ 40 pages : une page par service (vidange, embrayage, injecteurs, climatisation…), une par offre, une par quartier ou commune (9), blog. Téléphone cliquable : 14 liens `tel:` (3 numéros, dont le site jumeau de pare-brise). Formulaire : aucun sur l'accueil (formulaire sur la page contact, lien « ?sujet=rendez-vous »).

## Typographie
Polices servies par Next.js (fichiers woff2 hachés), familles non lues.

## Couleur et matière
Non mesurée. 41 `<img>` : photos d'atelier et de Smart (`reparation`, `mecanique`, `entretien`, `smart`, nature non lisible sans capture), visuels d'offres du réseau, icônes.

## Mouvement
Carrousel d'offres (flèches) et compteurs animés ; non mesuré à l'écran.

## Le geste signature
Aucun geste visuel. Le geste commercial : **l'offre du moment, datée, avec le téléphone collé dessous**, qui donne une raison d'appeler cette semaine.

## Ce qu'on garde / ce qu'on refuse
Garde : quartier et code postal dans le h1, note Google et devis gratuit sous le h1, horaires en barre haute, offres datées, garantie écrite, une page par service et par quartier, aucune bannière cookies.
Refuse : compteurs vides sans JavaScript (six cases sans chiffre dans le HTML), offres répétées trois fois par le carrousel.

## Verdict marché (veille du 23 oct 2026, tour 5)
Source : agence ONDEV (Marseille), page réalisations (https://www.ondev.fr/realisations/), fiche « Site vitrine & SEO local - Sud Mécanique » (2024-2025, l'agence annonce 50 appels par mois). Tirage : `$RANDOM` 13969 mod 18 = 1 → Marseille ; ARTI13 (première agence trouvée) ne montre aucun site client réel (réalisations sans lien, témoignages sans nom complet), écartée. URL lue : https://sudmecanique.fr/ (HTML 248 Ko, premier octet 0,3 s depuis le proxy).

**Un artisan paierait-il 1 200 € pour ça ?** Oui, sans hésiter : tout ce qu'un client de garage cherche est en haut (où, quand, combien de gens contents, comment prendre rendez-vous), et les offres datées donnent une raison d'appeler maintenant. Le seul défaut visible dans le code : les compteurs vides.

**Leviers vus** : Photos réelles : non lisibles sans capture (noms de fichiers d'atelier). Premier écran : horaires et adresse en barre haute, quartier dans le h1, 4,4/5 Google, « Devis gratuit », rendez-vous en ligne, téléphone cliquable. Preuves : 119 avis Google, garantie à vie carrosserie, réseau AD Expert, réparateur agréé Smart. Structure : environ 40 pages (services, offres, 9 pages de quartiers, blog), contact sur une page dédiée. Appels : « Prendre rendez-vous », « Réserver en ligne », téléphone (×14), « Voir l'offre ». Vitesse : HTML 248 Ko, premier octet 0,3 s (le plus rapide du tour). Mobile : balise viewport présente ; rendu non mesuré.
