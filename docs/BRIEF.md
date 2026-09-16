# Brief client — à remplir pendant ou juste après l'appel de 15 minutes

Ce document sert à collecter tout ce qu'il faut pour générer `sites/<slug>/site.config.ts`.
Copie ce fichier dans `sites/<slug>/brief.md`, remplis-le au fil de l'appel, complète après si besoin.

Une ligne vide entre deux paragraphes = deux paragraphes distincts sur le site (les champs texte long
acceptent le markdown minimal : juste des paragraphes séparés par une ligne vide).

**Règle d'or : si tu n'as pas l'info, laisse le champ vide et écris `? à demander`. On n'invente rien.**
Une case vide donne un site qui s'adapte (la section correspondante ne s'affiche pas ou s'affiche sans
ce détail). Un chiffre ou un avis inventé, en revanche, est illégal — voir plus bas.

---

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

Coche ce qui existe réellement chez le client (rien de tout ça ne se fabrique) :

- [ ] Logo (fichier vectoriel ou haute résolution)
- [ ] Portrait / photo de l'artisan ou de l'équipe
- [ ] Photos de chantiers / réalisations
- [ ] Photos avant/après
- [ ] Aucune photo disponible

**Lien vers les photos** (Drive, Dropbox, WeTransfer...) :

> Les champs image de `site.config.ts` restent vides tant que les fichiers ne sont pas déposés dans
> `sites/<slug>/public/images/`. Pas de photo de banque d'images, pas de placeholder.

## 9. Réseaux sociaux

- **Instagram** (URL complète) :
- **Facebook** (URL complète) :
- **LinkedIn** (URL complète) :
- **TikTok** (URL complète) :

## 10. Questions fréquentes (optionnel)

Les 2-4 questions que les clients posent le plus souvent au téléphone, avec la réponse habituelle :

- **Q :**
  **R :**

## 11. Domaine et mise en ligne

- **Nom de domaine souhaité** (ex. plomberie-martin.fr, sans https) :
- **Date limite / contrainte de délai** :

## 12. Ressenti du client — pour choisir la direction visuelle

- **3 adjectifs utilisés par le client pour décrire ce qu'il veut** (ses mots, pas les nôtres) :
- **Sites concurrents qu'il aime** (URL + ce qu'il aime) :
- **Sites concurrents qu'il n'aime pas** (URL + pourquoi) :
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
