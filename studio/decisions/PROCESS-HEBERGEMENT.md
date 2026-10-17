# Hébergement, code et domaine : le process, noir sur blanc

Version du 17 octobre 2026, écrite à partir de `hebergement-livraison.md` (recherche du 10 oct, prix et
limites sourcés là-bas). Trois points marqués **[à confirmer]** attendent la réponse des fondateurs ; le
reste est la règle. Un changement ici = une ligne datée en bas.

## 1. Où vit le code

- **Un seul dépôt privé GitHub, `ff-atelier`.** Un client = un dossier `sites/<slug>/` (brief, contrat,
  `site.config.ts`, sections sur mesure, photos traitées). Rien de client n'est codé ailleurs. **[à confirmer : 3]**
- **Sauvegarde** : le dépôt GitHub est la sauvegarde du code ; les photos brutes (`raw/`) et les builds
  sont dans `.gitignore`, donc `ff archiver <slug>` (zip local) avant toute livraison, zip rangé dans le
  Drive F&F (`Clients/<slug>/`).
- **Le client peut reprendre son site à tout moment** : `ff exporter <slug>` produit un dépôt autonome
  avec README, remis sur un dépôt GitHub à son nom ou en archive, et `dist/<slug>` zippé s'héberge
  n'importe où. C'est la clause de réversibilité des CGV, et le discours « le site est à vous » tient.
- **Statut par site** dans `sites-en-ligne.json` : `suivi` (sous contrat de suivi, reçoit les mises à
  jour), `fige` (livré sans suivi, plus jamais redéployé : la dernière version reste en ligne), `sorti`
  (remis au client). On y note aussi domaine, registrar, date de renouvellement, formule.
- **Secrets** : jamais dans le dépôt (`.env` local, secrets GitHub Actions, variables Vercel/Cloudflare).
  Jamais de mot de passe client stocké, nulle part.

## 2. Où tourne le site

- **Cloudflare Pages, plan gratuit, compte Finck & Fisch.** Usage commercial autorisé, requêtes
  statiques illimitées, HTTPS automatique, 100 projets par compte (au-delà : Workers, 5 $/mois).
  **[à confirmer : 1]**
- **Pas Vercel Hobby** pour un site qui rapporte de l'argent (interdit par leurs CGU, suspension possible
  de tout le compte). Vercel reste l'aperçu des **démos** et du formulaire brief, rien d'autre. Le site du
  studio (`finck-fisch`) migre sur Cloudflare dès que le compte existe.
- **Mise en ligne** : `ff deploy <slug>` (build, garde « données de test », Cloudflare Pages), puis
  `ff domaine <slug> <domaine>` (DNS, HTTPS, redirection www, e-mail de contact), puis `ff sante <slug>`
  à J+1 et chaque mois (job planifié `sante-hebdomadaire`).
- **Mises à jour du gabarit** : une variante livrée ne change plus visuellement (une amélioration visible =
  nouvelle variante) ; on ne redéploie que les sites `suivi` dont le build a changé ; tag git
  `gabarit-AAAA.MM` à chaque lot.
- **Coût pour F&F : 0 € par client.** Total fixe ≈ 15-35 €/mois jusqu'à 30 clients (GitHub, API, outils),
  détail dans `hebergement-livraison.md` § 0.3.

## 3. Le nom de domaine

**Règle : le client est titulaire, paie le registrar avec sa carte, et le reste à vie.** F&F n'achète
jamais un domaine à son nom (sinon le client ne peut pas partir sans nous, et un oubli de
renouvellement tue son référencement).

- **Registrar : OVHcloud** (.fr ≈ 5 € HT la première année, ≈ 8 € HT/an ensuite, boîte mail Zimbra offerte,
  société française). On le dit dès le devis : « ≈ 15-20 € TTC par an, à votre nom ».
- **Comment on le demande** :
  1. Dans le formulaire brief (ff-brief), question « Vous avez déjà un nom de domaine ? » : oui + lequel
     (et chez qui) / non + deux ou trois noms souhaités, dans l'ordre. **[à ajouter au formulaire]**
  2. Pendant l'appel de restitution (le site est validé), 10 minutes en partage d'écran : le client crée
     son compte OVH, achète le domaine, puis ajoute le compte F&F comme **contact technique** du domaine
     (on gère le DNS sans son mot de passe). Si le client préfère faire seul : la fiche
     `studio/commercial/guide-domaine.html` (à écrire), une page, captures d'écran. **[à confirmer : 2]**
  3. Un domaine qui existe déjà (ancien site) : on récupère son registrar et ses enregistrements e-mail
     (MX, SPF, DKIM) avant de toucher à quoi que ce soit.
- **Branchement** (`ff domaine`) : délégation des serveurs de noms OVH → Cloudflare (domaine nu + www +
  HTTPS). **Point bloquant écrit dans la checklist : recopier MX/SPF/DKIM dans Cloudflare AVANT la
  bascule**, sinon les e-mails du client s'arrêtent. Vérification à J+1 : un e-mail test reçu.
- **E-mail pro** : hors périmètre, on conseille (Zimbra OVH offert pour un artisan seul ; redirection
  Cloudflare gratuite `contact@domaine` → son Gmail ; Google Workspace ≈ 7 €/mois s'il y tient).
- **Sortie** : le client remet les DNS OVH par défaut (2 clics) ou crée son compte Cloudflare et reprend
  la zone. Le code d'autorisation de transfert est à lui, gratuit, à tout moment (Afnic).

## 4. Ce que le client reçoit à la livraison (kit de sortie, dès le jour 1)

- Le lien du site sur son domaine, les accès à sa fiche Google (`ff kit`), le QR et les PDF.
- Un zip de `dist/<slug>` et, sur demande, le dépôt `ff exporter`.
- La page « après la livraison » (`studio/commercial/apres-livraison.html`).
- Une ligne de rappel dans notre calendrier : renouvellement du domaine (date OVH), un mois avant.

## 5. Qui fait quoi

| Étape | Qui | Outil |
|---|---|---|
| Compte Cloudflare F&F, jeton API dans les secrets GitHub | fondateur (une fois) | dashboard Cloudflare, `docs/DEPLOIEMENT.md` § 1 |
| Déploiement, DNS, santé | Claude Code ou le fondateur | `ff deploy`, `ff domaine`, `ff sante` |
| Achat du domaine | le client, guidé en appel | OVH |
| Contact technique OVH ajouté | le client | OVH → domaine → contacts |
| Statut du site, dates de renouvellement | fondateur | `sites-en-ligne.json` |

## Journal des changements

- 17 oct 2026 : première version, trois points à confirmer (compte Cloudflare, qui achète le domaine,
  dépôt commun).
