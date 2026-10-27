# Brief client — à remplir pendant ou juste après l'appel de 15 minutes

Ce document sert à collecter tout ce qu'il faut pour générer `sites/<slug>/site.config.ts`.
Copie ce fichier dans `sites/<slug>/brief.md`, remplis-le au fil de l'appel, complète après si besoin.

Une ligne vide entre deux paragraphes = deux paragraphes distincts sur le site (les champs texte long
acceptent le markdown minimal : juste des paragraphes séparés par une ligne vide).

**Règle d'or : si tu n'as pas l'info, laisse le champ vide et écris `? à demander`. On n'invente rien.**
Une case vide donne un site qui s'adapte (la section correspondante ne s'affiche pas ou s'affiche sans
ce détail). Un chiffre ou un avis inventé, en revanche, est illégal — voir plus bas.

---

## 0. Site actuel

- **Adresse du site actuel** (si le client en a un) :
- **On peut reprendre ses textes et ses photos ?** [ ] oui, les deux  [ ] seulement les photos  [ ] non, on repart de zéro
  Oui → `node scripts/ff.mjs refonte <adresse> <slug>` (textes, photos, redirections des anciennes adresses). Ses textes et
  ses photos sont à lui : on les reprend avec son accord, on réécrit les textes creux.

## 1. Identité

- **Nom de l'entreprise :**
- **Métier affiché** (ex. "Plombier-chauffagiste") :
- **Forme juridique** (EURL, SASU, auto-entrepreneur...) :
- **SIRET :**
- **N° TVA intracommunautaire** (si assujetti) :
- **Depuis quand ?** (année de création, affichée seulement si fournie) :
- **Assurance décennale** (compagnie + n° de police) :
- **Certifications / labels** (RGE, Qualibat, Artisan d'art...) :
- **Responsable de publication** (nom du gérant — obligatoire pour les mentions légales) :

## 2. Contact

- **Téléphone** (format affiché, ex. 06 12 34 56 78) :
- **WhatsApp** (si différent, numéro international sans le +) :
- **E-mail :**
- **Adresse** — rue :
  code postal :
  ville :
- **Horaires** (jour(s) → créneau, une ligne par plage) :
- **Urgence 24/7 ?** (oui/non — n'active le direction `signal` que si oui et que le métier s'y prête)
- **Lien fiche Google** (Google Maps / Google Business) :
- **Lien de réservation en ligne** (Zenchef, TheFork, Planity, son propre outil… → bouton « Réserver ») :
- **Lien de commande / click & collect** (→ bouton « Commander ») :
- **Lien de bon cadeau en ligne** (→ bouton « Bon cadeau ») :

> Ces trois liens ne s'inventent pas : sans lien dans le brief, le bouton n'existe pas sur le site
> (`contact.bookingUrl` / `orderUrl` / `giftCardUrl` restent absents).
- **Note Google actuelle** (sur 5) :
- **Nombre d'avis Google actuel** :

> La note et le nombre d'avis doivent être recopiés tels quels depuis la fiche Google au moment du
> brief — jamais arrondis à la hausse, jamais estimés. Si le client n'a pas encore de fiche Google,
> laisse vide : la section "avis Google" du site ne s'affichera pas.

## 3. Zone d'intervention

- **Villes couvertes** (liste) :
- **Rayon d'intervention** (en km, si pertinent) :
- **Libellé court** (ex. "Métropole lilloise", si plus parlant qu'une liste de villes) :

## 4. Services (3 à 6)

Pour chaque service :

### Service 1
- **Titre :**
- **Ce que c'est, en une phrase** (pour la carte) :
- **Points forts** (2-4 puces courtes) :
- **Prix "à partir de"** (uniquement si le client veut afficher un prix) :
- **Service phare ?** (mis en avant sur la page d'accueil : oui/non)

### Service 2
*(dupliquer le bloc autant que nécessaire, 3 à 6 services au total)*

## 5. Histoire de l'entreprise

- **Qui ?** (fondateur·rice, parcours en une phrase) :
- **Depuis quand, pourquoi ?** (le déclic, la raison de se lancer) :
- **Équipe** (prénoms + rôle, si plusieurs personnes) :
- **Un ou deux jalons marquants** (année + fait, ex. "2015 — ouverture de l'atelier") :

## 6. Valeurs / ce qui les différencie

- **3 choses qui les distinguent de la concurrence** (une phrase chacune) :

## 7. Avis clients réels

> **⚠️ Avertissement légal — à lire avant de remplir cette section.**
> Inventer un avis, un auteur, une note ou un chiffre de satisfaction est une **pratique commerciale
> trompeuse** au sens de l'article **L121-2 du Code de la consommation** (faux avis, témoignage fictif,
> statistique inventée). C'est illégal, sanctionné, et **strictement interdit sur ce projet**, sans
> exception, même "en attendant les vrais avis" ou "à titre d'exemple".
>
> Chaque avis publié doit avoir une origine vérifiable : un vrai client, un vrai texte, une vraie source
> (capture Google, e-mail, SMS...). Pas d'avis = pas de section avis sur le site, purement et simplement.

Pour chaque avis réel disponible :

- **Auteur** (prénom + initiale, comme affiché sur la source) :
- **Texte de l'avis** (copier tel quel, ne pas reformuler) :
- **Source** (Google, Pages Jaunes, e-mail, SMS...) — obligatoire, un avis a toujours une origine :
- **Ville du client** (si connue) :
- **Date** (si connue) :

## 8. Photos disponibles

**Des photos sur le site ?** (aiguille la skill, voir `.claude/skills/site-final/aiguillage.md`)

- [ ] Oui, et j'en ai
- [ ] Oui, mais je n'en ai pas encore → qui les fait : [ ] lui, au téléphone avec le guide photo  [ ] nous, sur place
- [ ] Peu ou pas, ça me va

Coche ce qui existe réellement chez le client (rien de tout ça ne se fabrique) :

- [ ] Logo (fichier vectoriel ou haute résolution)
- [ ] Portrait / photo de l'artisan ou de l'équipe
- [ ] Photos de chantiers / réalisations
- [ ] Photos avant/après
- [ ] Aucune photo disponible

**Lien vers les photos** (Drive, Dropbox, WeTransfer...) :

**Pour chaque photo de réalisation**, demander (c'est ce qui rend une galerie crédible : KS Architectes classe
ses chantiers par commune et par type, Artisans de Genève signe chaque pièce des initiales du client) :

- **Lieu** (ville ou quartier) :
- **Type de travaux / de pièce** (cuisine, escalier, toiture… — sert de filtre sur le site dès deux types) :
- **Mesure** (« 12 m² », « 2 jours », « 4 m de linéaire ») :
- **Client** (initiales ou prénom, **avec son accord** ; jamais un nom complet sans accord écrit) :

Un champ sans réponse reste vide : la photo s'affiche sans cette ligne, on ne complète jamais de tête.

> Les champs image de `site.config.ts` restent vides tant que les fichiers ne sont pas déposés dans
> `sites/<slug>/public/images/`. Pas de photo de banque d'images, pas de placeholder.

## 9. Réseaux sociaux

- **Instagram** (URL complète) :
- **Facebook** (URL complète) :
- **LinkedIn** (URL complète) :
- **TikTok** (URL complète) :

## 10. Questions fréquentes (la logistique, posée pendant l'appel)

Les sites qu'on a démontés (Studenterkilden, KS Architectes — `docs/veille/demontages/INDEX.md`, geste 1)
répondent sur leur page aux questions de terrain que les clients posent au téléphone : parking, délais,
allergies, musique forte. C'est ce qui rend une FAQ utile, pas « Pourquoi nous choisir ? ». Pose ces huit
questions au client, note **sa réponse telle quelle** (ses mots, pas les nôtres). **Si pas de réponse : ne
rien inventer**, la question n'entre pas sur le site.

1. **Parking et accès** (où se garer, comment entrer, étage, ascenseur, accès handicapé) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.
2. **Délais habituels** (entre le premier contact et l'intervention, durée moyenne d'un chantier) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.
3. **Devis payant ou non** (visite gratuite ? déplacement facturé ? déduit si commande ?) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.
4. **Paiement** (acompte et son montant, moyens acceptés : CB, virement, chèque, espèces, en plusieurs fois) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.
5. **Zone d'intervention exacte** (communes, rayon en km, frais au-delà) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.
6. **Allergies, matériaux, contraintes propres au métier** (allergènes, produits sans ammoniaque, bois certifié, bruit, poussière, animaux) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.
7. **Horaires d'urgence ou week-end** (dépannage le soir, le dimanche, majoration) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.
8. **Que faire avant la venue** (préparer la pièce, dégager l'accès, apporter quoi au rendez-vous) :
   - Réponse du client, telle quelle :
   - Si pas de réponse : ne rien inventer.

Autres questions qui reviennent tout le temps (avec la réponse habituelle) :

- **Q :**
  **R :**

> Dans `site.config.ts`, les réponses de cette section deviennent la `faq`, telles quelles reformulées en une
> phrase ; une question sans réponse n'entre pas (`.claude/skills/nouveau-site/SKILL.md`).

### 10bis. Conseils (facultatif)

Les conseils que le client donne au téléphone, ou un article qu'il a déjà écrit, peuvent devenir une rubrique
« Conseils » du site (5 sites qui vendent sur 9 en ont une, `docs/veille/marche/CE-QUI-VEND.md`). Pour chacun :
titre, date, deux phrases de résumé, le texte (ou un enregistrement à retranscrire), une photo à lui si possible.

- Conseil 1 : titre … / date … / texte …

> Dans `site.config.ts` : `conseils`. Rien de sa part = pas de rubrique ; on n'écrit jamais un article à sa place.

**Une nouvelle en ce moment ?** Fermeture pour congés, produit de saison, marché ou salon, nouvel horaire : une phrase,
avec sa date de fin (« jusqu'au 18 août »), et un lien s'il y en a un. Elle s'affiche sous le premier écran et disparaît
toute seule à la date dite.

> Dans `site.config.ts` : `annonce` { texte, lien, du, au }. Rien de sa part = rien d'affiché ; jamais une promotion
> inventée (`docs/veille/fonctionnalites-2026-10.md` § 4).

## 11. Domaine et mise en ligne

- **Domaine : le client en a déjà un ?** [ ] oui, lequel et chez quel registrar (OVH, Ionos, Gandi…) :
  [ ] non → deux ou trois noms souhaités, dans l'ordre (ex. plomberie-martin.fr, sans https) :
  Règle (20 oct 2026) : le domaine est au nom du client ; s'il n'en a pas, F&F l'achète pour lui chez OVH,
  payé 10 ans, compris dans le prix (`studio/decisions/PROCESS-HEBERGEMENT.md` § 4, fiche client
  `studio/commercial/guide-domaine.html`). Il ne crée aucun compte, n'achète rien.
- **Date limite / contrainte de délai** :

## 12. Ressenti du client — pour choisir la direction visuelle

- **Ambiance** (règle le mouvement, voir `aiguillage.md`) : [ ] plutôt calme, posé  [ ] plutôt vivant, qui bouge
  [ ] je ne sais pas, montrez-moi
- **3 adjectifs utilisés par le client pour décrire ce qu'il veut** (ses mots, pas les nôtres) :
- **Sites concurrents qu'il aime** (URL + ce qu'il aime) :
- **Sites concurrents qu'il n'aime pas** (URL + pourquoi) :
- **Qu'est-ce qu'on pourrait filmer chez vous en 5 secondes ?** (le geste, l'objet ou le lieu qu'on
  peut montrer en mouvement sans rien inventer — sert à choisir le bloc signature animé, voir
  `docs/ANIMATION-PAR-METIER.md` § 1a) :
- **Quand un client hésite, qu'est-ce qui le rassure ?** (le lieu, la durée, l'équipe, un avant/après,
  une garantie — sert à choisir la preuve à rendre tangible sur le site, voir
  `docs/ANIMATION-PAR-METIER.md` § 1c) :
- **Remarques libres :**

---

## Choix atelier — rempli par nous, pas par le client

Cette section n'est **pas** posée au client. Elle est remplie par la personne qui prépare le site
(ou par Claude via la compétence `nouveau-site`), après avoir consulté `docs/DIRECTIONS.md` et lancé
`node scripts/ff.mjs variete` pour voir les combinaisons déjà utilisées et éviter de répéter la même
direction + le même hero pour un client du même métier ou de la même ville.

- **Direction :**
- **Motion** (none / subtle / rich) :
- **Typographie** (`typography.display` / `typography.body`, si surcharge de la paire de la direction) :
- **Échelle** (`scale` : compact / normal / display) :
- **Nav :**
- **Hero :**
- **Sections et variantes** (dans l'ordre) :
- **Tone** (`layout.tone` : flat / alternate) :
- **Séparateur** (`layout.divider` : none / wave / diagonal / curve / rule / zigzag) :
- **Footer :**
- **Libellés** (`wording.devis` et les autres si le défaut ne convient pas au métier) :
- **Pages villes** (`seo.cityPages` : oui seulement si 4+ services et une vraie liste de villes) :
- **Justification en une phrase** (pourquoi cette direction pour ce métier/client) :
