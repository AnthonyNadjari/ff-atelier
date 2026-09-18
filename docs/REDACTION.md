# Rédaction — règles opérationnelles

Règles distillées de `docs/veille/redaction-images.md` §1 (rédaction pour métiers locaux) pour un usage
au quotidien pendant `/nouveau-site` et `ff verifier`. Ce document donne la règle à appliquer ; la veille
garde les sources, les nuances et les avertissements de vérification (« non re-vérifié en direct cette
session »). En cas de doute sur une nuance légale précise, retourner à la veille avant d'écrire le site
d'un client réglementé.

Rappel non négociable, déjà dans `CLAUDE.md` règle 2 : jamais un chiffre, un avis, une note ou une année
inventés. Ce document ne l'assouplit jamais — il ajoute des règles de style, pas d'exception à cette règle.

---

## 1. Mots et formules interdits

À vérifier à l'œil sur chaque texte avant livraison (et automatiquement par `ff verifier`, bloc
« Textes », voir §7) :

**Superlatifs absolus sans preuve chiffrée vérifiable dans le brief** — jamais, quel que soit le métier :

- « le meilleur », « meilleur » comme qualificatif du client
- « leader », « leader du marché »
- « n°1 », « numéro 1 », « numéro un »
- « incontournable », « la référence »
- « unique en France », « seul à... » sans preuve vérifiable
- « révolutionnaire »
- « le plus » (« le plus rapide », « le plus grand choix »...) sans chiffre vérifiable du brief

**Garanties de résultat** — jamais, et c'est une infraction déontologique pour une profession
réglementée (§3) :

- « garanti », « garantie de résultat », « résultats garantis »
- « satisfaction garantie », « 100 % satisfait »
- « vous ne serez pas déçu »

**Clichés déjà bannis par `.claude/skills/nouveau-site/SKILL.md` §4** :

- « votre satisfaction est notre priorité »
- « des professionnels à votre écoute »
- « la qualité au meilleur prix »
- « depuis toujours », « artisan passionné » sans contenu réel derrière (remplacer par le fait concret du
  brief : l'année, le geste, la matière)

**Autres règles** :

- Tout chiffre, note, avis, nombre d'années ou de clients non fourni tel quel par le brief — champ absent,
  jamais approximé (`CLAUDE.md` règle 2).
- Le mot « spécialiste » pour une profession réglementée sans le titre officiel qui le justifie (§3).
- Toute comparaison nommée ou implicite avec un concurrent.

## 2. Vouvoiement

Vouvoiement toujours, tutoiement jamais dans les textes du site (`business.description`, `about.story`,
`services[].description`, `faq`, boutons, formulaire...). Le tutoiement reste réservé aux documents
internes adressés à la vendeuse/au vendeur (`docs/BRIEF.md`, ce fichier, les résumés de fin de génération).

## 3. Professions réglementées — règles opposables

Concerne avocat, médecin, masseur-kinésithérapeute, vétérinaire (ordre professionnel avec pouvoir
disciplinaire) et, avec une nuance, l'ostéopathe (pas d'ordre, mais titre protégé et droit commun de la
consommation). Détail des textes et sources : `docs/veille/redaction-images.md` §1.3.

Règle commune aux quatre professions à ordre (avocat/médecin/kiné/vétérinaire) :

- **Jamais de comparaison** avec un confrère, nommé ou non.
- **Jamais de promesse de résultat** (« vous serez guéri », « vous gagnerez votre procès »).
- **Jamais le mot « spécialiste »** sans le titre officiel qui le justifie (ex. certificat de
  spécialisation pour un avocat — un CAPA seul ne suffit pas).
- **Jamais un témoignage présenté comme preuve de résultat individuel** — un avis client réel reste
  possible (`docs/veille/seo-conversion.md` §1.4) mais ne doit jamais être mis en avant comme un argument
  commercial de résultat.
- Ton sobre, informatif, jamais promotionnel — le hero met en avant les compétences réelles et la zone
  d'intervention, jamais une promesse.

Cas particulier **ostéopathe** : pas d'ordre professionnel, donc pas de règle ordinale opposable — mais le
droit commun de la consommation s'applique quand même (Code de la consommation art. L121-1/L121-2,
pratiques commerciales trompeuses) : ne jamais promettre un résultat de soin, ne jamais employer un
vocabulaire médical usurpant un titre de médecin.

## 4. Ton par métier

Quatre registres (`docs/veille/redaction-images.md` §1.3) :

| Registre | Métiers | Ton | Ce qui prime dans le hero |
|---|---|---|---|
| **Urgence** | Plombier-chauffagiste, serrurier, couvreur, électricien (dépannage) | Direct, rassurant, aucune formule fleurie | Téléphone cliquable, délai réel, zone couverte |
| **Rendez-vous** | Coiffeur/barbier, dentiste, vétérinaire, ostéopathe, institut de beauté/spa, coach sportif/yoga, auto-école, architecte d'intérieur | Chaleureux, projette la première visite | Photos du lieu/équipe, horaires, prise de RDV |
| **Commerce / achat réfléchi** | Fleuriste, boulanger-pâtissier, brasseur, traiteur/food truck, chambres d'hôtes, agence immobilière, garagiste (vente) | Sensoriel, concret, donne envie | Galerie de réalisations/produits, avis réels |
| **Profession réglementée** | Avocat, masseur-kinésithérapeute, ostéopathe, vétérinaire | Sobre, informatif, jamais promotionnel | Compétences réelles, zone d'intervention, aucune promesse de résultat |

## 5. Test du titre de hero

Test de référence (Julian Shapiro) : si un visiteur ne lit *que* le titre du hero, comprend-il exactement
ce que vend l'entreprise ? Un bon titre augmente le désir sans ajouter de confusion — préférer un bénéfice
concret et spécifique à une formule vague.

- **`business.tagline` : 6-12 mots, ≤ 12 mots, compréhensible seul, un seul `<em>`.**
- Sous-titre de hero : 1-2 phrases, ≤ 200 caractères — explique le « comment » (zone, délai, disponibilité)
  ou rend le titre crédible (label RGE, décennale, avis Google réels — jamais un chiffre inventé).

Quatre formules réutilisables, à remplir avec les données réelles du brief :

1. **Métier + lieu + promesse concrète** — « Plombier-chauffagiste à Nantes, dépannage sous l'heure »
2. **Geste + matière + résultat** — « Le fer forgé à la main, pour un portail qui dure trente ans »
3. **Situation du client + solution directe** — « Une fuite qui ne peut pas attendre ? On décroche. »
4. **Depuis quand + ce qui a changé** — « Ferronnerie d'art à Toulouse depuis 2015, sur mesure » (le
   « depuis 2015 » vient du champ `Depuis quand ?` du brief, jamais estimé)

## 6. Longueur idéale par section

| Élément | Longueur cible |
|---|---|
| Titre de hero (`business.tagline`) | 6-12 mots, un seul `<em>` |
| Sous-titre de hero | 1-2 phrases, ≤ 200 caractères |
| `business.description` | 2-3 paragraphes courts (`md`, lignes vides) |
| Carte de service (résumé) | 1 phrase |
| Description longue d'un service | 1-2 paragraphes, ≤ 400 caractères sans `measure` |
| `about.story` | 2-4 paragraphes |
| Réponse de FAQ | 1 paragraphe, 2-4 phrases |
| Avis client (`proof.testimonials`) | Texte recopié tel quel, jamais réécrit |

## 6bis. Trois tells « écrit par une machine » (source : `docs/veille/skills-design-ia.md` §2)

- **Tirets cadratins en rafale.** Un tiret long isolé est légitime ; au-delà d'un tiret pour 500 caractères visibles, c'est la signature la plus reconnaissable du texte généré. Remplacer par un point, deux points ou une virgule. Même règle pour les triptyques systématiques (« rapide, fiable, local »).
- **Un seul libellé par intention.** Sur une même page, l'appel à l'action garde un seul texte (« Demander un devis » partout), jamais « Contactez-nous » ici et « Discutons » plus bas. Un bouton principal tient sur une ligne en desktop : trois mots maximum.
- **Hero à quatre éléments maximum.** Eyebrow (0 ou 1, ≤ 40 caractères), titre (≤ 2 lignes), sous-titre (≤ 20 mots), un bouton principal + un secondaire au plus. Pas de mini-phrase sous les boutons, pas de bandeau « ils nous font confiance » inventé. Un témoignage affiché fait ≤ 3 lignes : c'est un extrait, pas l'avis complet.

## 7. Structure « problème → geste → preuve → appel »

Grille de lecture pour une section service ou « pourquoi nous » (pas un nouveau composant) :

1. **Problème** — nommer la situation du visiteur dans ses mots à lui (voir le lexique §9).
2. **Geste** — décrire ce que fait concrètement l'artisan, avec le vocabulaire du métier, pas un
   vocabulaire marketing.
3. **Preuve** — un fait vérifiable du brief (année, certification, décennale, avis réel, avant/après réel).
   Jamais un chiffre inventé pour combler l'absence de preuve — une section sans preuve se réduit, elle ne
   se remplit pas de placeholder.
4. **Appel** — un CTA unique et sans ambiguïté, dans le registre du métier (§8).

Exemple concret déjà dans le repo : `sites/dubois-plomberie/sections/Diagnostic.astro` (symptôme → cause
probable → geste).

## 8. Micro-copie

**Boutons (CTA)** — un verbe d'action + l'objet précis, jamais « Envoyer »/« Soumettre » seuls :
« Appeler maintenant » (urgence), « Demander un devis » (BTP/travaux), « Prendre rendez-vous »
(santé/soin), « Réserver une table » (restauration). Jamais « Demander un devis » pour un commerce, un
restaurant ou un salon (voir `docs/DIRECTIONS.md` § Libellés, `wording.devis`).

**Formulaires** — nom complet (pas prénom/nom séparés), téléphone en champ le plus important, besoin en
une ligne, code postal si utile, e-mail facultatif si le téléphone est fourni. ≤ 5 champs visibles hors
honeypot.

**Messages d'erreur** — au plus près du champ en cause, langage humain, jamais « champ invalide » ou
« erreur 400 », sans blâmer l'utilisateur, avec une solution actionnable, sans effacer ce que
l'utilisateur a déjà saisi. Exemple : remplacer « Téléphone invalide » par « Ce numéro ne ressemble pas à
un numéro français — vérifiez le format (ex. 06 12 34 56 78) ».

**Accusés de réception** — positif et spécifique, jamais générique : pas « Merci, votre message a été
envoyé » seul, mais « Merci, votre demande est bien arrivée — [Nom de l'artisan] vous rappelle sous
[délai réel du brief, sinon ne pas inventer de délai] ».

## 9. Lexique FR par métier

Les mots que le client emploie réellement au téléphone (à reprendre dans les titres,
`business.description`, `services[].title`) contre le jargon d'agence à éviter :

| Métier | Mots que le client utilise vraiment | À éviter (jargon d'agence) |
|---|---|---|
| Ferronnier d'art | fer forgé, portail, garde-corps, forge, la pièce, sur mesure | « solution métallique », « ouvrage » |
| Ostéopathe | le dos qui bloque, une séance, craquer, le geste, soulager | « thérapie manuelle », « prise en charge globale » |
| Tatoueur | le dessin, la séance, le flash, le trait, cicatrisation | « œuvre corporelle », « expérience client » |
| Restaurateur | la carte, le plat du jour, réserver une table, la cuisine maison | « expérience culinaire », « concept » |
| Couvreur | la toiture, une fuite, les tuiles, zinguerie, charpente | « solution de couverture » |
| Photographe de mariage | le jour J, les photos, la séance, le reportage | « storytelling visuel » |
| Garagiste | la panne, la révision, le contrôle technique, le devis | « prestation automobile » |
| Plombier-chauffagiste | la fuite, le chauffe-eau, la chaudière, déboucher, dépannage | « solutions thermiques » |
| Coiffeur / barbier | la coupe, la couleur, la barbe, le rendez-vous, le fauteuil | « expertise capillaire » |
| Paysagiste | le jardin, tailler, tondre, l'entretien, planter | « aménagement paysager » (à garder si le client le dit lui-même) |
| Architecte d'intérieur | le plan, réaménager, les travaux, l'agencement | « scénographie d'espace » |
| Boulanger-pâtissier | le pain, la boulange, le fournil, la pâtisserie, frais du jour | « artisan de la gourmandise » |
| Électricien | le tableau, la panne, la mise aux normes, disjoncter, domotique | « solutions électriques connectées » |
| Avocat | le dossier, le rendez-vous, la procédure, le conseil, l'audience | « expertise juridique 360° » |
| Vétérinaire | la consultation, la vaccination, l'urgence, mon chien/chat | « médecine vétérinaire globale » |
| Menuisier-ébéniste | le bois, sur mesure, la pièce, poser, restaurer | « mobilier d'exception » |
| Institut de beauté/spa | le soin, l'épilation, la cabine, se détendre, prendre soin de soi | « rituel bien-être premium » |
| Traiteur/food truck | le menu, la commande, le service, préparé sur place | « expérience culinaire nomade » |
| Auto-école | le permis, les heures de conduite, l'examen, le moniteur | « pédagogie de la mobilité » |
| Chambres d'hôtes | la chambre, le petit-déjeuner, réserver une nuit, l'accueil | « expérience d'hébergement » |
| Coach sportif/yoga | la séance, le cours, progresser, le tapis, s'étirer | « transformation physique » |
| Serrurier | la porte claquée, la clé cassée, le cylindre, ouvrir sans casser | « solutions de sécurisation » |
| Fleuriste | le bouquet, la composition, livrer des fleurs, le marché | « art floral d'exception » |
| Maçon | les fondations, rénover, le devis, le chantier, agrandir | « solutions constructives » |
| Dentiste | le détartrage, la carie, le rendez-vous, la consultation | « esthétique dentaire premium » |
| Brasseur (pour mémoire) | le brassin, la bière, le houblon, la brasserie | — |
| Agent immobilier (pour mémoire) | le bien, la visite, l'estimation, le mandat | — |

## 10. Bibliothèque de 60 phrases d'accroche réutilisables

Phrases originales, classées par registre (§4), **à adapter avec les données réelles du brief** (ville,
matière, délai) — jamais à copier telles quelles dans un `site.config.ts` sans les ajuster au client réel.

**Urgence (12)**

1. Plombier-chauffagiste — « Une fuite ne prévient pas. Nous non plus n'attendons pas. »
2. Plombier-chauffagiste — « Chauffe-eau en panne un dimanche ? On décroche aussi le dimanche. »
3. Plombier-chauffagiste — « De la chaudière au robinet qui goutte, un seul numéro à retenir. »
4. Serrurier — « Porte claquée, clé cassée : on est déjà en route avant que vous ayez fini de nous décrire le problème. »
5. Serrurier — « Ouvrir sans casser, réparer sans repasser — le serrurier du quartier. »
6. Serrurier — « Un cylindre à changer, une urgence à ne pas remettre à demain. »
7. Couvreur (urgence toiture) — « Une tuile envolée, une fuite qui s'installe : on grimpe avant l'orage suivant. »
8. Couvreur — « La toiture ne pardonne pas d'attendre — nous non plus. »
9. Électricien (dépannage) — « Un court-circuit n'a pas d'horaires. Nous non plus. »
10. Électricien — « Tableau qui disjoncte sans raison : on cherche la vraie cause, pas juste le fusible. »
11. Électricien — « De la panne du soir à la mise aux normes du matin. »
12. Plombier-chauffagiste — « L'eau qui monte n'attend pas un rendez-vous — appelez, on arrive. »

**Rendez-vous (22)**

13. Coiffeur/barbier — « Une coupe qui tient la semaine, pas juste le jour du rendez-vous. »
14. Coiffeur/barbier — « Le fauteuil du quartier où on vous appelle par votre prénom. »
15. Barbier — « La barbe, ça se taille avec la lame et le temps qu'il faut. »
16. Dentiste — « Un sourire qu'on soigne, pas qu'on vend. »
17. Dentiste — « Le cabinet où on explique avant de soigner. »
18. Vétérinaire — « Votre compagnon mérite un vétérinaire qui le connaît, pas juste son dossier. »
19. Vétérinaire — « De la visite de routine à l'urgence du soir, la même équipe. »
20. Ostéopathe — « Le geste juste, pour la douleur qui revient toujours au même endroit. »
21. Ostéopathe — « Un corps, une histoire — l'ostéopathie prend le temps de l'écouter. »
22. Institut de beauté/spa — « Une parenthèse qu'on prépare pour vous, pas un passage éclair. »
23. Institut de beauté/spa — « Le soin qui commence dès que la porte se referme sur le bruit dehors. »
24. Coach sportif/yoga — « Progresser à votre rythme, pas au rythme de la salle. »
25. Coach sportif/yoga — « Le tapis se déroule, le reste s'apprend séance après séance. »
26. Auto-école — « Le permis, ça s'apprend avec un moniteur qui reste le même du premier au dernier cours. »
27. Auto-école — « Conduire sans stresser : on commence toujours par ce qui vous fait peur. »
28. Architecte d'intérieur — « Un intérieur qui vous ressemble, dessiné avant d'être posé. »
29. Architecte d'intérieur — « Repenser un espace sans tout casser — le plan avant les travaux. »
30. Avocat — « Le droit expliqué en clair, avant d'être plaidé. »
31. Avocat — « Un dossier suivi par la même personne du premier rendez-vous à l'audience. »
32. Menuisier-ébéniste — « Le bois se choisit avant de se travailler — un rendez-vous pour en parler. »
33. Institut de beauté/spa — « Chaque peau a son rythme, chaque soin s'y adapte. »
34. Coach sportif/yoga — « Un cours qui commence par où vous en êtes, pas par où il faudrait être. »

**Commerce / achat réfléchi (14)**

35. Fleuriste — « Un bouquet qui dit ce que les mots n'ont pas le temps de dire. »
36. Fleuriste — « Les fleurs du marché, composées le matin même. »
37. Boulanger-pâtissier — « Le pain qui sort du four à l'heure où le quartier se réveille. »
38. Boulanger-pâtissier — « Une pâtisserie qui se prépare la veille, pas la vitrine. »
39. Brasseur — « La bière qu'on brasse ici, pas celle qu'on fait venir. »
40. Brasseur — « Un houblon choisi, un brassin suivi du premier au dernier degré. »
41. Traiteur/food truck — « Le repas qui se prépare sur place, pas qui se réchauffe. »
42. Traiteur/food truck — « De la commande du midi au buffet du samedi, la même cuisine. »
43. Chambres d'hôtes — « Une chambre, un accueil — pas un numéro de réservation. »
44. Chambres d'hôtes — « Le petit-déjeuner qu'on prépare en fonction de qui dort ici ce soir-là. »
45. Agence immobilière — « Le bien qu'on connaît vraiment, pas juste l'annonce qu'on a postée. »
46. Agence immobilière — « Vendre un bien, c'est d'abord bien le regarder — nous le visitons avant de le vanter. »
47. Garagiste (vente) — « Un véhicule vérifié avant d'être proposé, pas juste nettoyé. »
48. Garagiste — « L'entretien qui prévient la panne plutôt que de la réparer. »

**Artisanat / réalisation (14)**

49. Ferronnier d'art — « Le fer se plie à la forge, pas à la machine. »
50. Ferronnier d'art — « Un portail qui se transmet, pas qui se remplace. »
51. Tatoueur — « Un trait qui reste, dessiné pour durer autant que la peau qui le porte. »
52. Tatoueur — « Le dessin se prépare avant l'aiguille, jamais l'inverse. »
53. Photographe de mariage — « Le jour ne se refait pas — il se raconte en images. »
54. Photographe de mariage — « Capturer ce qui se passe, pas ce qui se pose. »
55. Restaurateur — « Une carte qui change avec la saison, pas avec l'imprimante. »
56. Restaurateur — « La cuisine se fait ici, à quelques mètres de votre table. »
57. Menuisier-ébéniste — « Le bois qu'on choisit pièce par pièce, pas au mètre. »
58. Maçon — « Les fondations d'abord, la promesse ensuite. »
59. Maçon — « Rénover sans trahir ce que la maison était déjà. »
60. Paysagiste — « Un jardin qui se dessine avec les saisons, pas contre elles. »

## 11. Checklist « textes livrables » (20 points)

1. Vouvoiement partout dans les textes du site, aucun tutoiement — aucun « tu »/« ton »/« tes » dans
   `site.config.ts`
2. Aucun superlatif interdit (§1) : grep `-i` sur "meilleur", "leader", "numéro 1", "incontournable",
   "référence" dans `site.config.ts` → 0 résultat
3. Aucune garantie de résultat ("garanti", "satisfaction garantie") hors formulation contractuelle
   explicite validée par le client
4. Aucun cliché de `SKILL.md` §4 ("votre satisfaction est notre priorité", "des professionnels à votre
   écoute", "la qualité au meilleur prix")
5. `business.tagline` contient au plus un seul `<em>`
6. Aucun chiffre, note, avis, nombre d'années ou de clients absent du brief — chaque valeur numérique du
   fichier retrouvable dans `sites/<slug>/brief.md`
7. `business.description`/`about.story`/`services[].description`/`faq[].a` découpés en paragraphes
   séparés par une ligne vide (jamais un pavé unique)
8. `proof.testimonials` : uniquement des avis du brief, texte non reformulé, `source` renseignée pour
   chacun
9. `proof.google` absent si le brief n'a pas de note ET de nombre d'avis exacts
10. Titre de hero ≤ 12 mots, compréhensible seul (test §5)
11. Sous-titre de hero ≤ 200 caractères, 1-2 phrases
12. Ton conforme au registre du métier (§4) — urgence : direct, pas de superflu ; rendez-vous :
    chaleureux ; commerce : sensoriel ; profession réglementée : sobre
13. Pour une profession réglementée (§3) : aucune comparaison nommée, aucune promesse de résultat, aucun
    mot « spécialiste » sans titre officiel
14. Pour un ostéopathe : aucun vocabulaire usurpant un titre médical, aucune promesse de guérison
15. Vocabulaire du lexique métier (§9) utilisé dans les titres/descriptions plutôt que du jargon d'agence
16. Paragraphes > 400 caractères marqués `measure`/`max-w-prose` (déjà vérifié par `ff verifier`, à
    recontrôler ici côté contenu, pas juste CSS)
17. CTA du site dans le registre attendu (« Appeler maintenant », « Demander un devis », « Prendre
    rendez-vous »... selon le métier), jamais un « Contact » générique seul
18. Formulaire de contact limité aux champs utiles (nom, téléphone, besoin, éventuellement ville) — pas
    de champ « société » pour un client BtoC
19. Message d'erreur de formulaire spécifique et actionnable, pas un texte générique type « champ
    invalide »
20. Aucune donnée personnelle inventée dans les FAQ (une question du brief, une réponse qui correspond
    réellement à ce que dit l'artisan)

## 12. `ff verifier` — bloc « Textes »

`scripts/ff/verifier.mjs` scanne le texte visible de chaque page livrée (mêmes strips que le bloc Rendu :
`<style>`/`<script>`/balises retirés) :

- **Échec** : « meilleur », « leader », « n°1 »/« numéro 1 », « garantie de résultat », « satisfaction
  garantie », « 100 % satisfait ».
- **Avertissement** : « unique », « révolutionnaire », « le plus », tutoiement possible (« tu »/« ton »/
  « tes »), `<h1>` de plus de 14 mots, `<p>` de plus de 120 mots.

Ce contrôle automatique ne remplace pas la relecture humaine (§11) — il attrape les oublis évidents, pas
les nuances de ton ou les règles des professions réglementées.

## 13. Photos — voir aussi

Pour la partie images (shot list par métier, retouche, IA, checklist « images livrables »), voir
`docs/veille/redaction-images.md` §2 et §3.2, et la commande `ff nettoyer-photos` (`CLAUDE.md`, tableau
des commandes). Même règle pour une vidéo/animation générée par IA (`ff animer`, `docs/PROCESS.md`
§4bis) : uniquement à partir d'une photo réelle du client, jamais d'une image inventée — et marquage
AI Act (`data-ia="1"` + mention visible) obligatoire sur la section qui l'utilise.
