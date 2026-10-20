> **Modèle à faire relire par un professionnel du droit avant premier usage.** Ce document est une
> synthèse de veille juridique (voir `studio/juridique/JURIDIQUE.md`), pas un conseil juridique. Les clauses
> marquées `{{placeholder}}` doivent être complétées ; les clauses marquées « **[optionnel]** » ou
> « **[variante A / B]** » doivent être choisies avant l'envoi au premier client, en fonction des
> décisions listées dans `studio/juridique/JURIDIQUE.md` § 12 (forme juridique, régime de TVA, politique de
> rétractation).
>
> **Réaligné le 20 octobre 2026** sur le modèle validé par le fondateur
> (`studio/decisions/PROCESS-HEBERGEMENT.md`) : aucun abonnement, modifications au forfait, hébergement
> gratuit accessoire, domaine au nom du client payé 10 ans par le Studio. **Projet à faire relire une
> fois par un avocat.**

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
- Un site vitrine déployé sur le domaine du client (voir § 5), mis en ligne après paiement du solde.
- Le nom de domaine, au nom du client, payé pour 10 ans (compris dans le prix).
- Formulaire de contact fonctionnel, qui envoie les messages sur l'adresse e-mail du client.
- Fichiers sources du site (dépôt de code) remis au client à la livraison.
- {{Autres livrables spécifiques à la formule choisie}}

## 2. Délai de réalisation

**72 heures ouvrées** à compter de la réception complète des éléments suivants, fournis par le client :
textes validés ou brief complet, photos, logo, SIRET, avis clients réels le cas échéant. **Le délai ne
court pas tant que ces éléments manquent** — un délai indicatif de transmission peut être fixé d'un
commun accord : {{date limite de transmission des éléments, si convenue}}.

À l'issue de la livraison : un appel de restitution, puis une **fenêtre de corrections de deux
semaines** pendant laquelle les retours de texte, photo ou coordonnée sont inclus sans supplément (voir
§ 7 du contrat de prestation, `studio/juridique/modeles/contrat-modele.md`).

## 3. Prix

| Élément | Montant HT | TVA | Montant TTC |
|---|---|---|---|
| {{Formule Essentiel / Complet}}, nom de domaine 10 ans compris | [prix à fixer] € | {{taux ou « non applicable »}} | {{montant}} € |
| {{Options éventuelles}} | {{montant}} € | | {{montant}} € |
| **Total** | **{{total_ht}} €** | | **{{total_ttc}} €** |

**[Variante A — micro-entreprise]** TVA non applicable, article 293 B du Code général des impôts.
**[Variante B — SAS assujettie]** TVA au taux de 20 %, montant TVA : {{montant_tva}} €.

## 4. Acompte et modalités de paiement

- **Aucun abonnement, aucune facture récurrente.** Ce devis est le seul montant dû pour le site.
- **Acompte de {{30}} %** à la signature du présent devis (au plus tôt le 8e jour après la signature
  si le § 6 variante B s'applique), soit **{{montant_acompte}} €**, à régler par
  {{moyen de paiement}}. Cette somme constitue un **acompte** (et non des arrhes) : elle engage les deux
  parties et n'est pas remboursable en cas de rétractation tardive du client après le début de la
  production, hors exercice du droit de rétractation prévu au § 6 ci-dessous le cas échéant.
- **Solde de {{montant_solde}} €** à régler à la validation du site. **La mise en ligne a lieu après
  paiement complet du solde.** Une fois en ligne, le site n'est jamais suspendu pour un impayé.
- Paiement au-delà de la date d'échéance facturée : pénalités de retard au taux de la Banque centrale
  européenne majoré de 10 points, plus une indemnité forfaitaire de 40 € pour frais de recouvrement
  (Code de commerce, art. L441-10) — voir `studio/juridique/modeles/facture-modele.md`.

## 5. Domaine, hébergement et formulaire — au nom du client

- Le nom de domaine {{nom_de_domaine_souhaite}} est enregistré par le studio chez {{OVHcloud}} **au nom
  du client**, seul titulaire, **payé d'avance pour 10 ans** (compris dans le prix). Sans prolongation,
  il expire au bout de 10 ans. Code de transfert remis gratuitement sur demande.
- **Hébergement offert**, gratuit et accessoire, sur le compte {{Cloudflare}} du studio. Le studio peut
  l'arrêter avec 3 mois de préavis, en remettant au client son site complet et le code de transfert du
  domaine.
- Le formulaire relaie les messages vers l'adresse du client sans les conserver. Le client clique une
  fois sur le lien de vérification reçu par e-mail.
- Pas de boîte mail, de paiement en ligne ni d'agenda hébergés par le studio : liens vers les comptes
  du client.
- Voir l'article 9 du contrat de prestation pour le détail de la remise.

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
(`studio/juridique/modeles/contrat-modele.md` § Propriété intellectuelle) ; la cession prend effet au paiement
intégral du solde.

## 8. Modifications après livraison

Pas d'abonnement ni de contrat d'entretien. Après la fenêtre de corrections, chaque modification se
commande à la demande, au forfait, sur un devis court accepté par e-mail.

## 9. Acceptation

Bon pour accord — le client reconnaît avoir pris connaissance des conditions générales de vente
(`studio/juridique/modeles/cgv-modele.md`), jointes au présent devis, et du formulaire de rétractation le cas
échéant.

Fait à {{VILLE}}, le {{DATE}}, en deux exemplaires.

| Le studio | Le client |
|---|---|
| {{NOM_STUDIO}} | {{NOM_CLIENT}} |
| Signature : | Signature précédée de « Bon pour accord » : |
