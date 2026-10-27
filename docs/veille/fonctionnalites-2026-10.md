# Fonctionnalités des sites vitrines : ce que les autres proposent, ce que l'usine a (27 oct 2026)

Veille courte lancée à la main par le fondateur (« une petite veille », 27 oct 2026) avec la question : « des idées de
fonctionnalités que les sites vitrines ont et qu'on pourrait ajouter ? ». Deux sources croisées :

- ce que les **vrais sites** d'artisans et de commerces font, compté sur les 90 sites de `docs/veille/marche/CE-QUI-VEND.md`
  (10 tours, 60 sites réels, 30 modèles) ;
- ce que les **fabricants de sites** vendent comme fonctionnalités aux petites entreprises : la page des fonctionnalités de
  Wix (https://www.wix.com/features/main), celle de Squarespace (https://www.squarespace.com/websites/features) et la page
  d'accueil de SiteW (https://www.sitew.com/), lues le 27 oct 2026. Jimdo : page introuvable (404), non lue.

Règle de lecture : une fonctionnalité ne vaut que si un artisan la remplit avec SES données. Tout ce qui demande un
serveur, un compte, un abonnement ou un paiement en ligne reste un **lien vers l'outil du client** (décision du 20 oct
2026 : zéro abonnement, les outils payants sont ceux du client).

## 1. Ce que l'usine a déjà (ne pas refaire)

| Fonctionnalité | Chez qui | Dans l'usine |
|---|---|---|
| Réservation, commande, bon cadeau | Wix (réservation, commande, cartes cadeaux), Squarespace (scheduling), SiteW (agenda) ; 18 sites réels sur 81 | Portes « Réserver / Commander / Bon cadeau » vers l'outil du client (`contact.bookingUrl`, `orderUrl`, `giftCardUrl`), barre d'actions au téléphone |
| Menu, carte, tarifs | Wix (menu numérique) ; 27 sites sur 90 ont des prix | `services[].lignes`, `priceFrom`, architectures ardoise-du-jour, carte-des-soins, grille-urgence, gamme-vitrine |
| Horaires et état ouvert / fermé | 7 sites sur 54 au premier écran | `Horaires`, `HorairesDuJour` (jour courant sans horloge), par adresse avec `lieux` |
| Avis | 62 sites sur 90 | `proof/google`, `testimonials`, seulement fournis |
| Formulaire, devis | Wix, SiteW (formulaires de devis) ; 35 sites sur 90 | `contact/form-*`, tiroir, Cloudflare Worker sans traceur |
| Carte, zone desservie, pages villes | Wix (carte Google) ; 25 sites sur 90 | `zones/*` sans traceur, `seo.cityPages` |
| Actualités, conseils, blog | Wix (blog, fenêtres), Squarespace (blog), SiteW (blog) ; 40 sites sur 90 | `conseils` (articles du client, une page chacun) |
| Galerie, réalisations, avant / après | Squarespace (portfolio), SiteW (galerie) | `proof/gallery`, `realisations`, `avant-apres` |
| Événements, agenda | Wix (événements, billetterie) | `sorties` (saisons-sorties), `fetes` (calendrier-fêtes), `disponibilites` (calendrier) |
| Plusieurs adresses | 2 sites sur 54 | `lieux` (pages-adresses) |
| Particuliers / professionnels | 2 sites sur 54 | `pros` |
| Réseaux sociaux | Wix (flux Instagram, barre sociale), SiteW | Liens au pied ; **pas de flux Instagram incrusté** (traceur Meta : refusé, voir § 3) |
| SEO, fiche Google | Wix (fiche Google), Squarespace, SiteW | JSON-LD LocalBusiness, sitemap, IndexNow, `ff kit` (fiche Google prête à recopier) |
| Mentions légales, RGPD | SiteW (modèles) | Pages légales générées, aucun cookie |

## 2. Ce qui manque, et ce qu'on en fait

| Fonctionnalité | Vu où | Compte réel | Décision |
|---|---|---|---|
| **Nouvelle du moment** (fermeture, saison, offre datée) en tête de page | DSD Rénov (bandeau sous le premier écran), Colson Elec (barre haute), Wix (« annonces ») | 10 sites sur 63 (16 %) | **Faite dans ce tour** : `annonce` (§ 4) |
| Devis avec photo jointe | CarPress (modèle) | 1 sur 54 | Non : le formulaire passe par un Worker sans stockage ; une photo = un e-mail avec pièce jointe, donc un service tiers. À revoir si un client le demande. |
| Calculateur d'estimation | Renovate (modèle) | 1 sur 63 | Non : des prix inventés ou des règles de calcul que l'artisan ne tient pas. |
| Témoignage vidéo | Garage Provençal, Flor | 4 sur 63 | Possible sans champ : une vidéo du client dans `hero/video` ou une section sur mesure ; pas de champ dédié tant qu'aucun client n'a de vidéo. |
| Chat en direct, assistant de chat IA | Wix | 0 site réel sur 90 | Non : un chat sans personne derrière, ou une IA qui répond à la place de l'artisan, c'est le contraire de « c'est moi qui réponds » (Colson Elec). Bouton WhatsApp déjà possible (`contact.whatsapp`). |
| Newsletter, campagnes SMS | Wix, Squarespace, SiteW | 0 site réel compté | Non : un outil du client (lien vers sa page d'inscription si le brief le donne). |
| Fidélité, bons de réduction | Wix | 0 site réel compté | Non : offre d'entrée possible en texte (`wording.devis`, `wording.ctaText`). |
| Espace membres, forum, suivi de demande | Wix, Squarespace ; Le Manceau (suivi de demande de groupe) | 1 sur 18 | Non : hors du périmètre d'un site statique sans compte. |
| Boutique en ligne, paiement, factures | Wix, Squarespace, SiteW | 11 sites sur 63 ont une commande ou une boutique | Non : lien vers l'outil du client (`orderUrl`) ; la gamme se montre (`produits`), ne se vend pas ici. |
| Flux Instagram incrusté | Wix ; Girot (fil Instagram en actualités) | 1 sur 9 au tour 10 | Non : traceur Meta sur un site sans cookie. Lien Instagram au pied, et les photos du client dans la galerie. |
| Recherche dans le catalogue | AU FAITE | 1 sur 18 | Non tant qu'une gamme reste sous 50 produits : les familles suffisent. |
| Pages prestation × commune | Colson Elec | 1 sur 9 | Non : 30 pages presque identiques, Google les traite comme du contenu dupliqué ; `seo.cityPages` fait une page par ville. |
| Note d'une autre plateforme que Google | DSD Rénov | 2 sur 9 | À suivre : un deuxième relevé (`proof.autres[]` : plateforme, note, nombre) si le compte monte. |

## 3. Pourquoi « non » à la plupart

Un site de l'usine est une page statique sans compte, sans cookie, sans serveur à maintenir : c'est ce qui permet
l'hébergement gratuit et le « zéro abonnement » promis au client. Chaque fonctionnalité « vivante » de Wix (chat,
newsletter, boutique, membres, fidélité) est un serveur, un compte et une facture mensuelle. Quand un artisan en a
besoin, il a déjà l'outil (Planity, Zenchef, Sumup, Mailchimp) : le site y mène par une porte, et c'est tout.

## 4. Fait dans ce tour : la nouvelle du moment

`annonce` dans `site.config.ts` : `{ texte, lien?, lienTexte?, du?, au? }`. Une ligne sous le premier écran de l'accueil,
dans le rythme de la coquille (filet d'accent à gauche, texte, lien souligné), jamais par-dessus la nav (toutes nos navs
sont fixes), jamais collée en bas (ce serait pris pour une bannière de cookies), sans bouton de fermeture (une ligne,
pas une fenêtre). La fenêtre `du` / `au` se lit au build ET dans le navigateur (jour civil Europe/Paris) : un site
construit en juin cache en septembre l'annonce « jusqu'au 31 août ». Pas rendue dans les coquilles dont la page défile
par crans (`scenes`, `slides`) ni dans celles dont le premier écran est un panneau fixe (`carnet`, `panneaux`,
`vitrine`) : une ligne n'y est pas un écran.

Fichiers : `src/lib/annonce.ts` (module pur), `src/components/Annonce.astro`, `src/pages/index.astro` (première
« section »), `src/lib/schema.ts`, `tests/annonce.test.mjs`. Essai sur une copie de `_exemple` : construite,
`ff verifier` (hors données de test de l'exemple) et captures regardées, copie supprimée.

Ce qu'il faut demander au client (brief) : « Y a-t-il une nouvelle à afficher en ce moment, avec sa date de fin ? »
Fermeture pour congés, produit de saison, marché ou salon, nouvel horaire. Jamais une promotion qu'il n'a pas dite.
