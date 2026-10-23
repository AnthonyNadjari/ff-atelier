# EMS Avocats (https://ems-avocats.fr/)
Titre « EMS Avocats : recouvrement de créances et vice caché automobile », `lang="fr-FR"`, description « EMS Avocats, cabinet à Nîmes spécialisé en recouvrement de créances commerciales et vice caché automobile. Intervention partout en France. Prenez rendez-vous. », technologie lue : WordPress, Elementor 4.3, Trustindex (avis Google), reCAPTCHA, Google Tag Manager ; aucune bannière cookies relevée dans le HTML. Démontage à la main du 2026-10-23 : **mesuré sur le code, pas sur capture** (HTML récupéré par `curl`, aucun navigateur) ; l'ordre du premier écran est celui du HTML.

## Squelette
Premier écran (ordre du HTML) : logo ; nav en deux publics (**Entreprises** : recouvrement, droit des affaires ; **Particuliers** : pénal, vice caché, logement), « **Abonnement avocat 49 €/mois** », le cabinet (une page par associé), actualités ; bouton « Contact » et téléphone cliquable « **Garde à vue 7j/7** · 04 22 61 45 22 » ; h1 « EMS Avocats : recouvrement de créances et vice caché automobile » ; paragraphe (domaines, « sur rendez-vous à Nîmes et à distance dans toute la France ») ; boutons « Prendre rendez-vous » et téléphone (« Exposez votre situation »).
Ordre : 2 expertises phares → vice caché (« + de 6 ans d'expérience ») → 5 domaines (chacun vers sa page) → « Ce que vous pouvez obtenir » (3 issues) → recouvrement → 3 leviers d'action (mise en demeure, injonction de payer, référé) → « Comment se déroule votre dossier » (**4 étapes**) → 2 avis Google (Trustindex) → « les bons réflexes » (4 conseils) → 3 avocats fondateurs nommés par spécialité, sans photo → honoraires (forfait, temps passé, résultat, aide juridictionnelle) → FAQ de 6 questions → contact (adresse, « joignable 7j/7 de 8 h à 20 h », formulaire 4 champs).
Structure : environ 25 pages (une par domaine et sous-domaine, une par associé, honoraires, abonnement, actualités). Téléphone cliquable : 4 liens `tel:`, 2 avant le h1. Formulaire : oui, en bas de l'accueil.

## Typographie
Lue dans le HTML : Playfair Display (titres, 51 déclarations), Poppins (texte, 24).

## Couleur et matière
Non mesurée. 36 `<img>` : logos, icônes (marteau, euro, échange), une statue de la Justice et deux illustrations ; aucune photo du cabinet ni des avocats.

## Mouvement
GSAP, Swiper et Lottie chargés ; usage non mesuré.

## Le geste signature
Aucun geste visuel. Le geste commercial : **le prix d'entrée écrit dans la nav** (abonnement à 49 € par mois) et la **disponibilité 7j/7 en tête**, deux réponses à « combien et quand ? » avant même le titre.

## Ce qu'on garde / ce qu'on refuse
Garde : deux publics séparés dans la nav, déroulé du dossier en étapes, honoraires expliqués, FAQ concrète, disponibilité écrite en tête, une page par associé.
Refuse : aucun visage alors que les trois associés sont nommés, ville absente du h1, deux avis seulement.

## Verdict marché (veille du 23 oct 2026, tour 5)
Source : recherche « avocat Nîmes » (recherche étendue de l'outil de la session, la recherche simple ne rend que des annuaires et des offres d'emploi) : rangs 1 à 3 annuaires (Juritravail, Justifit, Alexia), **rang 4 EMS Avocats**, premier site de cabinet. Tirage : `$RANDOM` 26016 mod 15 → avocat (métiers de `docs/OBJECTIF.md` hors ceux des tours 1 à 4), `$RANDOM` 30889 mod 30 → Nîmes. URL lue : https://ems-avocats.fr/ (HTML 528 Ko, premier octet 1,0 s depuis le proxy).

**Un professionnel paierait-il 1 200 € pour ça ?** Oui : le site répond dans l'ordre aux trois peurs du client (est-ce mon cas, combien ça coûte, comment ça se passe) et donne un prix d'entrée. Ce qui manque est humain : pas une photo des avocats, deux avis.

**Leviers vus** : Photos réelles : aucune. Premier écran : téléphone cliquable avec « Garde à vue 7j/7 » en tête, h1 sur les deux spécialités, Nîmes dans le paragraphe, « Prendre rendez-vous ». Preuves : 2 avis Google, « + de 6 ans d'expérience », 3 associés nommés ; pas de label. Structure : environ 25 pages, une par domaine ; contact et formulaire en bas de l'accueil. Appels : « Prendre rendez-vous », « Exposez votre situation », « Demander une consultation », « Contacter Me … » (×3), téléphone (×4). Vitesse : HTML 528 Ko, premier octet 1,0 s. Mobile : balise viewport présente ; rendu non mesuré.
