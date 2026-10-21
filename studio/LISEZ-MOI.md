# Finck & Fisch : le studio

Ce dossier est pour nous deux : tout ce qui fait tourner le studio et qui n'est pas du code.
Le reste du dépôt (`sites/`, `src/`, `scripts/`, `docs/`) est la machine à fabriquer les sites ;
pas besoin d'y aller pour le quotidien.

**À ouvrir en premier : le doc partagé « Finck & Fisch », https://claude.ai/code/artifact/f663772e-bd93-4326-b5e6-ca4f48fdb44f** (tâches et notes).

## Où est quoi

| Dossier | Ce qu'il contient |
|---|---|
| `marque/logo/` | Le logo : fichier d'origine (`source/`), exports prêts à l'emploi (`export/` : SVG, PNG, favicon). |
| `marque/signature-mail/` | La signature e-mail. Ouvrir `generateur.html` dans le navigateur, remplir ses coordonnées, copier le rendu dans Gmail ou Outlook. |
| `marque/cartes-de-visite/` | Les cartes de visite : 3 modèles, PDF prêts pour l'imprimeur. Mode d'emploi : `README.md`. |
| `commercial/COMMERCIAL.md` | Comment on démarche : qui, comment, ce qu'on a le droit de faire (e-mail, SMS, WhatsApp). |
| `commercial/brief-client.html` | Le formulaire que le client remplit (ou qu'on remplit avec lui pendant l'appel). Mode d'emploi : `BRIEF-CLIENT.md`. |
| `commercial/guide-photos.html` | Le guide photo à envoyer au client dès le premier appel : 12 photos au téléphone, comment les prendre, comment nous les envoyer. Remplacer [téléphone] et [e-mail] avant envoi. |
| `commercial/apres-livraison.html` | Ce qu'on remet au client une fois son site en ligne. Mode d'emploi : `APRES-LIVRAISON.md`. |
| `commercial/guide-domaine.html` | La fiche « votre nom de domaine » à joindre au devis : nous l'achetons à son nom, payé dix ans, compris dans le prix ; il n'a rien à faire. |
| `commercial/REPRENDRE-SON-SITE.md` | La fiche remise avec le site (et envoyée d'office si on arrête) : héberger son site ailleurs gratuitement en dix minutes. `ff exporter` la copie dans le dépôt remis au client. |
| `juridique/` | Structure de la société, CGV, les modèles de devis, contrat, facture, CGV et mise en demeure (`modeles/`), et le registre des traitements RGPD (`registre-traitements.md`, une ligne par client livré). |
| `decisions/` | Les décisions prises et leurs raisons. **La règle du jeu : `PROCESS-HEBERGEMENT.md`** (aucun abonnement, hébergement, domaine, 20 oct 2026) et **`PIPELINE.md`** (de la démo à la facture payée, relances, outils). Le résumé lisible : `decisions-octobre-2026.html`. |

## Liens utiles

- Le site du studio en ligne : https://finckfisch.vercel.app (adresse provisoire, en attendant le domaine finckfisch.fr).
- Le dépôt GitHub (privé) : https://github.com/AnthonyNadjari/ff-atelier

## Règles simples

- Une décision prise : une ligne dans `decisions/` (date, ce qu'on a décidé, pourquoi).
- Une tâche finie : on coche sa case dans le doc partagé.
- Les vraies coordonnées (téléphone, adresse, SIRET) ne vont dans les sites qu'une fois la société immatriculée.
