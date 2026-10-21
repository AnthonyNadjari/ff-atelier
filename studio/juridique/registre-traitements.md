# Registre des traitements — Finck & Fisch

Tenu au titre de l'article 30 du RGPD. Deux parties : les traitements dont F&F est **responsable**
(art. 30.1 : prospection, clients, facturation) et ceux qu'elle effectue **pour le compte de ses clients**
en tant que sous-traitant (art. 30.2 : relais du formulaire de contact et hébergement de chaque site,
annexe 2 des CGV). Modèle de la CNIL : https://www.cnil.fr/fr/RGPD-le-registre-des-activites-de-traitement
(consulté le 22 oct 2026). Une ligne par client livré, ajoutée le jour de la mise en ligne, retirée à la
remise du site. Aucune donnée personnelle dans ce fichier : des catégories, jamais des noms de visiteurs.

Responsable du registre : {{nom du président de la SAS}}. Dernière mise à jour : {{date}}.

## 1. Traitements dont Finck & Fisch est responsable (art. 30.1)

| Traitement | Finalité | Base légale | Personnes | Données | Destinataires | Durée | Sécurité |
|---|---|---|---|---|---|---|---|
| Prospection des artisans | Proposer un site | Intérêt légitime (B2B) | Dirigeants d'entreprises artisanales | Nom, téléphone et e-mail professionnels, adresse de l'entreprise, fiche Google publique | Les deux fondateurs | 3 ans après le dernier contact, puis suppression | Base locale (`scrapping_artisans`), poste chiffré, pas de copie en ligne |
| Brief et production du site | Exécuter le contrat | Contrat | Clients et leur personnel nommé sur le site | Réponses du brief (ff-brief), photos, avis fournis, SIRET, coordonnées | Les deux fondateurs ; Vercel (formulaire brief) ; GitHub (dépôt privé) ; Anthropic (rédaction assistée) | Durée du contrat + 5 ans (preuve) | Dépôt privé, double authentification sur GitHub, Vercel, Cloudflare |
| Devis, factures, relances | Facturer, recouvrer | Obligation légale (C. com.) | Clients | Identité, SIRET, adresse, montants, IBAN du client sur ses virements | Outil de facturation (plateforme agréée), expert-comptable, banque | 10 ans (pièces comptables) | Outil de facturation, accès nominatif |
| Démos privées de prospects | Montrer un site avant signature | Intérêt légitime | Prospects | Données publiques du commerce (nom, adresse, horaires, avis Google publics), photos publiques | Les deux fondateurs ; Vercel (aperçu noindex) | Supprimée si le prospect dit non, au plus tard 3 mois | `legal.prospect: true` : noindex, lien privé, photos jamais versionnées |

## 2. Traitements effectués pour le compte des clients (art. 30.2)

Pour chaque client : **F&F est sous-traitant**, le client est responsable du traitement (sa page
`/confidentialite` le dit). Nature : transmission des messages du formulaire de contact vers l'adresse du
client, **sans stockage** ; hébergement des fichiers statiques du site. Sous-traitant ultérieur :
Cloudflare, Inc. (hébergement, routage e-mail ; transfert hors UE encadré par le Data Privacy Framework
UE–États-Unis). Sécurité : HTTPS, double authentification sur le compte Cloudflare, anti-spam, aucun
message conservé par F&F. Instructions : annexe 2 des CGV (clause de sous-traitance).

| Client (slug) | Responsable du traitement | Contrat (date du devis) | Mise en ligne | Adresse de destination du formulaire | Retiré le |
|---|---|---|---|---|---|
| {{slug}} | {{raison sociale du client}} | {{date}} | {{date}} | {{catégorie : e-mail professionnel du client}} | |

## 3. Mesures communes

- Comptes GitHub, Cloudflare, OVH, Vercel, banque : double authentification, deux titulaires nommés, pas
  de mot de passe partagé par e-mail.
- Aucun mot de passe de client stocké, nulle part. Aucune donnée de visiteur chez F&F.
- Violation de données (compte compromis, fuite) : notification au client sous 48 h (annexe 2 des CGV),
  à la CNIL sous 72 h si le risque l'exige (art. 33).
- Demande d'une personne (accès, effacement) reçue par F&F pour un site client : transmise au client
  sans délai, qui répond.

## Journal

- 22 oct 2026 : création du registre (modèle), aucune ligne client encore.
