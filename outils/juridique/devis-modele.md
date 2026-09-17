> **Modèle à faire relire par un professionnel du droit avant premier usage.** Ce document est une
> synthèse de veille juridique (voir `docs/JURIDIQUE.md`), pas un conseil juridique. Les clauses
> marquées `{{placeholder}}` doivent être complétées ; les clauses marquées « **[optionnel]** » ou
> « **[variante A / B]** » doivent être choisies avant l'envoi au premier client, en fonction des
> décisions listées dans `docs/JURIDIQUE.md` § 12 (forme juridique, régime de TVA, politique de
> rétractation).

---

# DEVIS N° {{FF-AAAA-NNN}}

**{{NOM_STUDIO}}** — {{FORME_JURIDIQUE}}
{{ADRESSE_STUDIO}}
SIRET {{SIRET_STUDIO}} {{— N° TVA intracommunautaire : TVA_STUDIO, si assujetti}}
{{TELEPHONE_STUDIO}} — {{EMAIL_STUDIO}}

Devis émis le {{DATE_EMISSION}}, valable jusqu'au {{DATE_VALIDITE}} (30 jours à compter de l'émission,
sauf mention contraire).

**Destinataire**
{{NOM_CLIENT}} — {{FORME_JURIDIQUE_CLIENT}}
{{ADRESSE_CLIENT}}
SIRET {{SIRET_CLIENT}}

---

## 1. Objet de la prestation

Conception et développement d'un site vitrine one-shot pour {{NOM_ENTREPRISE_CLIENT}}, sur la base du
brief validé le {{DATE_BRIEF}} (`sites/{{slug}}/brief.md`).

**Formule retenue : [ ] Essentiel  [ ] Complet** *(cocher une case ; détailler le contenu de chaque
formule en annexe du devis — pages incluses, nombre de sections sur mesure, options)*

Livrables :
- Un site vitrine déployé sur le domaine du client (voir § 5).
- Formulaire de contact fonctionnel, configuré au nom du client.
- Fichiers sources du site (dépôt de code) remis au client à la livraison.
- {{Autres livrables spécifiques à la formule choisie}}

## 2. Délai de réalisation

**72 heures ouvrées** à compter de la réception complète des éléments suivants, fournis par le client :
textes validés ou brief complet, photos, logo, SIRET, avis clients réels le cas échéant. **Le délai ne
court pas tant que ces éléments manquent** — un délai indicatif de transmission peut être fixé d'un
commun accord : {{date limite de transmission des éléments, si convenue}}.

À l'issue de la livraison : un appel de restitution, puis une **fenêtre de corrections de deux
semaines** pendant laquelle les retours de texte, photo ou coordonnée sont inclus sans supplément (voir
§ 7 du contrat de prestation, `outils/juridique/contrat-modele.md`).

## 3. Prix

| Élément | Montant HT | TVA | Montant TTC |
|---|---|---|---|
| {{Formule Essentiel / Complet}} | {{montant}} € | {{taux ou « non applicable »}} | {{montant}} € |
| {{Options éventuelles}} | {{montant}} € | | {{montant}} € |
| **Total** | **{{total_ht}} €** | | **{{total_ttc}} €** |

**[Variante A — micro-entreprise]** TVA non applicable, article 293 B du Code général des impôts.
**[Variante B — SAS assujettie]** TVA au taux de 20 %, montant TVA : {{montant_tva}} €.

## 4. Acompte et modalités de paiement

- **Acompte de {{50}} %** à la signature du présent devis, soit **{{montant_acompte}} €**, à régler par
  {{moyen de paiement}}. Cette somme constitue un **acompte** (et non des arrhes) : elle engage les deux
  parties et n'est pas remboursable en cas de rétractation tardive du client après le début de la
  production, hors exercice du droit de rétractation prévu au § 6 ci-dessous le cas échéant.
- **Solde de {{montant_solde}} €** à régler à la livraison, avant transfert final des accès et remise
  du dépôt de code (le studio peut légitimement retenir la livraison des accès tant que le solde n'est
  pas réglé).
- Paiement au-delà de la date d'échéance facturée : pénalités de retard au taux de la Banque centrale
  européenne majoré de 10 points, plus une indemnité forfaitaire de 40 € pour frais de recouvrement
  (Code de commerce, art. L441-10) — voir `outils/juridique/facture-modele.md`.

## 5. Domaine, hébergement et formulaire — au nom du client

- Le nom de domaine {{nom_de_domaine_souhaite}} est acheté ou transféré **au nom du client**, jamais au
  nom du studio.
- La clé/le compte du formulaire de contact est créé **au nom du client**, sur son propre compte.
- Voir § 5 du contrat de prestation pour le détail de la réversibilité.

## 6. Droit de rétractation

**[Variante A — client professionnel de plus de 5 salariés, ou objet du contrat entrant dans son
activité principale]** Le présent contrat est conclu entre deux professionnels ; aucun droit de
rétractation légal ne s'applique.

**[Variante B — client professionnel de 5 salariés au plus, contrat conclu à distance]** En application
de l'article L221-3 du Code de la consommation, le client bénéficie d'un délai de rétractation de 14
jours calendaires à compter de la signature du présent devis (formulaire type de rétractation joint en
annexe). **Case à cocher distincte, obligatoire pour respecter le calendrier de 72 h :**

> [ ] Je demande expressément à {{NOM_STUDIO}} de commencer l'exécution de la prestation avant la fin
> du délai de rétractation de 14 jours. Je reconnais que si la prestation est intégralement exécutée
> avant la fin de ce délai, je perds mon droit de rétractation (article L221-25 du Code de la
> consommation).
>
> Signature spécifique du client pour cette case : ____________________

## 7. Propriété intellectuelle

Le détail de la cession des droits d'auteur sur le site livré (étendue, destination, lieu, durée,
conforme à l'article L131-3 du Code de la propriété intellectuelle) figure au contrat de prestation
(`outils/juridique/contrat-modele.md` § Propriété intellectuelle) ; la cession prend effet au paiement
intégral du solde.

## 8. Maintenance (optionnelle, hors périmètre du présent devis)

Offre séparée, non incluse : maintenance à {{25}} €/mois (mises à jour de contenu mineures, assistance).
Contrat de maintenance distinct proposé après livraison si le client est intéressé — voir
`docs/PROCESS.md` § 8.

## 9. Acceptation

Bon pour accord — le client reconnaît avoir pris connaissance des conditions générales de vente
(`outils/juridique/cgv-modele.md`), jointes au présent devis, et du formulaire de rétractation le cas
échéant.

Fait à {{VILLE}}, le {{DATE}}, en deux exemplaires.

| Le studio | Le client |
|---|---|
| {{NOM_STUDIO}} | {{NOM_CLIENT}} |
| Signature : | Signature précédée de « Bon pour accord » : |
