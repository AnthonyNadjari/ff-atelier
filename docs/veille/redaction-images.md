# Veille — rédaction des textes et gestion des images quand le client n'a ni copywriter ni photographe

Date de la veille : 17 septembre 2026. Contexte : Claude rédige tous les textes des sites Finck & Fisch
à partir d'un brief de 15 minutes (`docs/BRIEF.md`, compétence `.claude/skills/nouveau-site/SKILL.md`
§4 « Rédiger les textes ») et la plupart des clients n'ont aucune photo utilisable. Ce document complète
`docs/veille/seo-conversion.md` (SEO/CRO/légal) et `docs/veille/ressources.md` (banques d'assets) sans
les dupliquer — il y renvoie chaque fois que c'est pertinent.

**Avertissement méthodologique** : le budget `WebSearch` de cette session était déjà épuisé (200/200)
avant le début de cette veille — impossible de lancer une seule recherche. Le travail a donc été fait
en `WebFetch` direct sur des URL connues. Beaucoup d'URL devinées ont renvoyé 404/403 (RIN du CNB en
PDF, pages profondes de l'Ordre des vétérinaires, Julian Shapiro, Les Nouveaux Copywriters, Baymard
CTA…) : ce qui a pu être re-vérifié en direct est cité avec son URL exacte ; ce qui n'a pas pu l'être
s'appuie sur la connaissance générale du sujet (stable dans le temps pour la plupart des points ici :
cadre ordinal français, formules de copywriting établies) et est marqué **« non re-vérifié en direct
cette session »**. Comme pour les veilles précédentes du dossier, ce n'est pas un avis juridique — les
points marqués comme tels doivent être confirmés avant d'être opposés à un client, en particulier tout
ce qui touche à la publicité des professions réglementées et aux CGU des générateurs d'images (elles
changent souvent).

---

## 1. Rédaction pour métiers locaux

### 1.1 Formules de titre de hero qui convertissent

**Le test de référence (Julian Shapiro, *Growth Handbook*, § headlines)** : si un visiteur ne lit *que*
le titre du hero, comprend-il exactement ce que vend l'entreprise ? Shapiro formule la conversion comme
`Taux d'achat = Désir − (Effort + Confusion)` — un bon titre augmente le désir sans ajouter de confusion.
Sa règle contre le flou marketing : préférer un bénéfice concret et spécifique (« Livraison de courses
en 1 heure ») à une formule vague (« Boostez votre flux de travail ! »). Source :
[julian.com/guide/growth](https://www.julian.com/guide/growth) (page « headlines » non re-fetchée en
direct cette session, 404 sur l'URL profonde — contenu restitué depuis la connaissance du guide, très
stable et largement cité).

**Harry Dry, Marketing Examples** ([marketingexamples.com](https://marketingexamples.com/)) : la leçon
qui revient le plus souvent sur le site est *« comment faire l'accroche sans aucun adjectif »* — remplacer
« qualité », « professionnel », « meilleur » par un fait vérifiable (un geste, un délai, un chiffre réel).
Deuxième leçon récurrente : le CTA se travaille en plusieurs variantes et gagne à porter un peu de
« chaleur » (formulation humaine plutôt qu'un verbe froid). Ces deux principes se combinent bien avec la
règle « jamais un chiffre inventé » déjà en place dans `CLAUDE.md` : la spécificité doit venir du brief,
jamais d'une formule plausible inventée pour faire vrai.

**Nielsen Norman Group — crédibilité perçue** (déjà cité dans `docs/veille/seo-conversion.md` §2.1,
[nngroup.com/articles/trustworthy-design](https://www.nngroup.com/articles/trustworthy-design/)) :
la qualité du design et la transparence priment sur les formules incitatives — un hero qui annonce un
fait vérifiable (ville, métier, délai) inspire plus confiance qu'un slogan motivationnel générique.

**Quatre formules de titre de hero, génériques et réutilisables (déclinables par métier, à remplir avec
les données réelles du brief — jamais un chiffre inventé) :**

1. **Métier + lieu + promesse concrète** — « Plombier-chauffagiste à Nantes, dépannage sous l'heure »
2. **Geste + matière + résultat** — « Le fer forgé à la main, pour un portail qui dure trente ans »
3. **Situation du client + solution directe** — « Une fuite qui ne peut pas attendre ? On décroche. »
4. **Depuis quand + ce qui a changé** — « Ferronnerie d'art à Toulouse depuis 2015, sur mesure » (le
   « depuis 2015 » vient du champ `Depuis quand ?` du brief, jamais estimé)

Le sous-titre suit la règle de Shapiro : une à deux phrases, soit il explique *comment* ça marche
(zone couverte, délai, disponibilité), soit il rend le titre crédible (label RGE, assurance décennale,
avis Google réels — jamais un chiffre inventé, cf. `docs/veille/seo-conversion.md` §3.7).

### 1.2 Règles de micro-copie

**Boutons (CTA)** — d'après Harry Dry et la pratique CRO consensuelle déjà documentée en §2.3 de
`docs/veille/seo-conversion.md` : un verbe d'action + l'objet précis, jamais « Envoyer » ou « Soumettre »
seuls. Exemples adaptés au métier : « Appeler maintenant » (urgence), « Demander un devis » (BTP/travaux),
« Prendre rendez-vous » (santé/soin), « Réserver une table » (restauration) plutôt que « Contact » générique.
Le bouton d'appel reste toujours le plus visible sur les métiers d'urgence (cf. `seo-conversion.md` §2.2).

**Formulaires** — d'après Baymard Institute, [Checkout Flow: Average Form Field Count](https://baymard.com/blog/checkout-flow-average-form-fields)
(re-fetché en direct le 17 sept 2026) : le nombre de champs *visibles* pèse plus sur l'abandon que le
nombre d'étapes ; leurs cinq bonnes pratiques (transposables du checkout e-commerce à un formulaire
artisan) sont : un seul champ « Nom complet » plutôt que prénom/nom séparés (42 % des utilisateurs se
trompent de champ quand ils sont séparés), masquer les champs secondaires par défaut (complément
d'adresse, champ facultatif), pré-remplir ce qui peut l'être, ne jamais demander une création de compte
avant l'action principale. Traduit pour un formulaire de contact artisan (déjà la position de
`seo-conversion.md` §2.3) : nom, téléphone (le champ le plus important), besoin en une ligne, code postal
si utile — l'e-mail reste facultatif si le téléphone est fourni.

**Messages d'erreur** — d'après Nielsen Norman Group, [Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/)
(re-fetché en direct le 17 sept 2026) : le message doit apparaître au plus près du champ en cause, en
langage humain (jamais « champ invalide » ou « erreur 400 »), sans blâmer l'utilisateur, avec une
solution actionnable plutôt qu'un simple constat, et sans jamais effacer ce que l'utilisateur a déjà
saisi. Exemple pour `ContactForm.astro` : remplacer un hypothétique « Téléphone invalide » par « Ce
numéro ne ressemble pas à un numéro français — vérifiez le format (ex. 06 12 34 56 78) ».

**Accusés de réception** — même logique que les messages d'erreur, version positive et spécifique plutôt
que générique : pas « Merci, votre message a été envoyé » seul, mais « Merci, votre demande est bien
arrivée — [Nom de l'artisan] vous rappelle sous [délai réel annoncé dans le brief, sinon ne pas inventer
de délai] ». Ce texte est déjà la place logique du déclenchement `data-confetti` documenté dans
`docs/OBJECTIF.md` (événement `ff:form-success`) — la micro-copie et l'animation servent le même moment,
pas de raison de les traiter séparément.

### 1.3 Ton par métier

Quatre registres, cohérents avec les trois familles déjà identifiées dans `docs/veille/seo-conversion.md`
§2.2 (urgence / rendez-vous / commerce), plus un quatrième registre transversal pour les professions
réglementées dont la communication elle-même est encadrée par un texte, pas seulement par le bon goût.

| Registre | Métiers concernés (sur les 25 de `docs/OBJECTIF.md`) | Ton | Ce qui prime dans le hero |
|---|---|---|---|
| **Urgence** | Plombier-chauffagiste, serrurier, couvreur (fuite), électricien (dépannage) | Direct, rassurant, aucune formule fleurie | Téléphone cliquable, délai réel, zone couverte |
| **Rendez-vous** | Coiffeur/barbier, dentiste, vétérinaire, ostéopathe, institut de beauté/spa, coach sportif/yoga, auto-école, architecte d'intérieur | Chaleureux, projette la première visite | Photos du lieu/équipe, horaires, prise de RDV |
| **Commerce / achat réfléchi** | Fleuriste, boulanger-pâtissier, brasseur, traiteur/food truck, chambres d'hôtes, agence immobilière, garagiste (vente) | Sensoriel, concret, donne envie | Galerie de réalisations/produits, avis réels |
| **Profession réglementée** | Avocat, médecin (hors scope artisan mais règle transposable), masseur-kinésithérapeute, ostéopathe (règles allégées), vétérinaire | Sobre, informatif, jamais promotionnel | Compétences réelles, zone d'intervention, aucune promesse de résultat |

**Le registre « profession réglementée » n'est pas qu'une question de ton — c'est une contrainte légale
opposable.** Détail par ordre :

- **Avocats** — Conseil National des Barreaux, Règlement Intérieur National (RIN), article 10
  « Publicité et sollicitation personnalisée » : la publicité est autorisée depuis la réforme de 2014-2016
  (transposition de la directive Services + jurisprudence du Conseil d'État qui a libéralisé la
  communication des professions réglementées), à condition qu'elle procure une information sincère,
  respecte les principes essentiels de la profession (dignité, délicatesse, absence de dénigrement,
  absence de comparaison avec d'autres avocats, secret professionnel) et ne soit ni trompeuse ni
  intrusive. **Non re-vérifié en direct cette session** : les tentatives de fetch sur la page RIN du CNB
  ([cnb.avocat.fr](https://www.cnb.avocat.fr)) et le PDF du RIN ont renvoyé 404 — texte à revérifier
  avant d'écrire le site d'un cabinet, notamment sur la mention de « spécialisation » (réservée aux
  avocats titulaires d'un certificat de spécialisation, CAPA seul insuffisant) et sur l'affichage
  d'honoraires (autorisé mais encadré).
- **Médecins** — Ordre des médecins, Code de déontologie médicale, article 19 : « la médecine ne doit pas
  être pratiquée comme un commerce » ; article 19-1 (issu de la réforme 2020, suite à une décision du
  Conseil d'État imposant plus de liberté de communication aux professions de santé) autorise une
  communication informative libre, à condition qu'elle reste loyale et ne soit pas comparative ; article
  82 encadre les annonces professionnelles. Source : [conseil-national.medecin.fr/code-deontologie](https://www.conseil-national.medecin.fr/code-deontologie)
  (re-fetché en direct le 17 sept 2026). Hors périmètre direct des artisans Finck & Fisch mais le
  raisonnement (communication informative oui, publicité commerciale non) est le même pour les autres
  professions de santé listées ci-dessous.
- **Masseurs-kinésithérapeutes** — Ordre des masseurs-kinésithérapeutes : depuis une réforme de 2020
  (même mouvement de libéralisation que les médecins), « un principe de libre communication, pour
  accroître la visibilité des kinésithérapeutes et mieux répondre aux besoins d'information des
  patients », encadré par un « Guide de recommandations relatives à la communication » (mis à jour au
  15 décembre 2022) couvrant le site internet (annexe 4) et les réseaux sociaux, sous réserve du code de
  déontologie. Source : [ordremk.fr — communiquer sur mon activité](https://www.ordremk.fr/je-suis-kinesitherapeute/exercice/communiquer-sur-mon-activite/)
  (re-fetché en direct le 17 sept 2026, page de synthèse — le PDF détaillé du guide n'a pas pu être
  ouvert dans cette session).
- **Ostéopathes — pas d'ordre professionnel.** Contrairement aux médecins et aux kinés, l'ostéopathie
  n'a **pas de chambre ordinale** avec pouvoir disciplinaire. C'est un titre protégé (décret n° 2007-435
  du 25 mars 2007 modifié, encadrement de la formation), avec enregistrement ADELI/RPPS auprès de l'ARS,
  mais aucune instance équivalente à un Ordre pour la publicité. Conséquence pratique pour Finck & Fisch :
  aucune règle ordinale opposable au site d'un ostéopathe — s'applique le droit commun de la
  consommation, en particulier l'interdiction des pratiques commerciales trompeuses (Code de la
  consommation, art. L121-1 et L121-2, déjà cités dans `docs/veille/seo-conversion.md` §3.7 pour les faux
  avis) : ne jamais promettre un résultat de soin, ne jamais employer un vocabulaire médical usurpant un
  titre de médecin. Des syndicats professionnels (Syndicat Français des Ostéopathes, Fédération
  Française des Ostéopathes...) publient des recommandations déontologiques, mais elles ne sont pas
  contraignantes juridiquement — à mentionner au client comme bonne pratique, pas comme obligation.
- **Vétérinaires** — Ordre National des Vétérinaires, Code de déontologie vétérinaire (Code rural et de
  la pêche maritime, partie réglementaire). **Non re-vérifié en direct cette session** : les tentatives
  de fetch sur des pages profondes de [veterinaire.fr](https://www.veterinaire.fr) ont abouti soit à une
  page d'attente Cloudflare, soit à une boîte à outils orientée affiches de salle d'attente, pas au texte
  précis des règles de publicité — la page d'accueil confirme l'existence d'un « Code de déontologie » et
  d'une section « réglementation professionnelle » à consulter avant d'écrire le site d'un vétérinaire.
  Par analogie avec les autres professions de santé réformées en 2020, le principe général attendu est le
  même : communication informative libre, comparaison et dénigrement interdits, aucune promesse de
  guérison.

**Règle pratique commune aux quatre professions réglementées ci-dessus** : jamais de comparaison avec un
confrère (nommé ou non), jamais de promesse de résultat (« vous serez guéri », « vous gagnerez votre
procès »), jamais le mot « spécialiste » sans le titre officiel qui le justifie, jamais de témoignage
mis en avant comme argument commercial (l'avis client reste possible s'il est réel et sourcé, cf.
`seo-conversion.md` §1.4, mais ne doit pas être présenté comme une preuve de résultat individuel).

### 1.4 Ce qu'il ne faut jamais écrire

Liste noire, à vérifier à l'œil sur chaque site avant livraison (voir aussi la checklist §3) :

- Tout superlatif absolu sans preuve chiffrée vérifiable dans le brief : **« le meilleur »**, **« le
  numéro un »**, **« leader »**, **« incontournable »**, **« la référence »**.
- Toute garantie de résultat : **« satisfaction garantie »**, **« résultats garantis »**, **« vous ne
  serez pas déçu »** — en profession réglementée (§1.3) c'est une infraction déontologique, ailleurs
  c'est simplement un mensonge invérifiable qui use le lecteur.
- Les clichés déjà bannis par `.claude/skills/nouveau-site/SKILL.md` §4 : « votre satisfaction est notre
  priorité », « des professionnels à votre écoute », « la qualité au meilleur prix ».
- Tout chiffre, note, avis, nombre d'années ou nombre de clients non fourni tel quel par le brief
  (rappel de `CLAUDE.md` règle 2 — ce document n'ajoute rien à cette règle, il la prolonge côté style).
- « Depuis toujours », « artisan passionné » sans contenu derrière — remplacer par le fait concret que
  le brief donne (l'année, le geste, la matière).
- Le mot « spécialiste » pour une profession réglementée sans le titre qui le justifie (§1.3).
- Toute comparaison nommée ou implicite avec un concurrent.

### 1.5 Longueur idéale par section

Pas de norme officielle unique pour un site vitrine local (contrairement au champ de formulaire, il
n'existe pas d'étude Baymard/NN-g spécifique à la longueur d'un hero d'artisan) — ces repères viennent de
la pratique CRO consensuelle (lisibilité mobile, temps de lecture avant le premier scroll) et de la
contrainte déjà posée par `docs/CONVENTIONS.md` (classe `measure`/`max-w-prose` sur tout paragraphe long,
avertissement `ff verifier` au-delà de 400 caractères sans cette classe, cf. `docs/OBJECTIF.md` critère 13) :

| Élément | Longueur cible | Pourquoi |
|---|---|---|
| Titre de hero (`business.tagline`) | 6-12 mots, un seul `<em>` | Lu en < 3 s, doit tenir sur une ligne mobile |
| Sous-titre de hero | 1-2 phrases, ≤ 200 caractères | Julian Shapiro : explique le « comment » ou rend le titre crédible, pas plus |
| `business.description` | 2-3 paragraphes courts | Découpage en `md` (lignes vides), jamais un pavé |
| Carte de service (résumé) | 1 phrase | C'est un repère de carte, pas une page de vente |
| Description longue d'un service | 1-2 paragraphes, ≤ 400 car. sans `measure` | Seuil déjà vérifié par `ff verifier` (`docs/OBJECTIF.md` critère 13) |
| `about.story` | 2-4 paragraphes | Une histoire, pas un CV — un fait par paragraphe |
| Réponse de FAQ | 1 paragraphe, 2-4 phrases | Doit répondre à la question posée par le brief, rien de plus |
| Avis client (`proof.testimonials`) | Texte recopié tel quel | Jamais réécrit (règle SKILL.md §4) |

### 1.6 Structure « problème → geste → preuve → appel »

Structure narrative recommandée pour une page service ou une section « pourquoi nous » — elle reprend la
logique consensuelle problem-agitate-solve du copywriting direct-response (formalisée entre autres par
Julian Shapiro et Harry Dry sous des noms différents) adaptée à un artisan local :

1. **Problème** — nommer la situation du visiteur dans ses mots à lui (une fuite qui inonde, une haie qui
   déborde, un devis qui traîne) — voir le lexique §1.8 pour les mots exacts par métier.
2. **Geste** — décrire ce que fait concrètement l'artisan, avec le vocabulaire du métier (pas un
   vocabulaire marketing) : le geste, l'outil, la matière, l'étape.
3. **Preuve** — un fait vérifiable du brief : année d'expérience réelle, certification, assurance
   décennale, avis client réel, photo avant/après réelle. Jamais un chiffre inventé pour combler l'absence
   de preuve — une section sans preuve disponible se réduit, elle ne se remplit pas de placeholder
   (même logique que `SKILL.md` §5 pour les images).
4. **Appel** — un CTA unique et sans ambiguïté, dans le registre du métier (§1.2) : appeler, demander un
   devis, prendre rendez-vous.

Cette structure s'applique section par section (`Diagnostic.astro` de `dubois-plomberie` en est déjà un
exemple concret dans le repo : symptôme → cause probable → geste, cf. le journal de `docs/OBJECTIF.md`
17 sept 2026) — elle n'a pas besoin d'un nouveau composant, c'est une grille de lecture pour écrire le
contenu d'une section existante (`Services`, `About`, un bloc sur mesure).

### 1.7 Bibliothèque de 60 phrases d'accroche réutilisables

Phrases originales (aucune ne provient d'un site existant), classées par métier, à adapter avec les
données réelles du brief (ville, matière, délai) — jamais à copier telles quelles dans un `site.config.ts`
sans les ajuster au client réel. Organisées par registre (§1.3) pour rappeler le ton attendu.

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

*(Total : 60 phrases, 25 métiers couverts — certains métiers comptent deux ou trois variantes selon leur
poids dans la liste de `docs/OBJECTIF.md`, chaque phrase reste une base à personnaliser avec les
données réelles du brief, jamais un texte final à coller.)*

### 1.8 Lexique FR des 25 métiers de `docs/OBJECTIF.md`

**Note de comptage** : `docs/OBJECTIF.md` numérote 27 lignes (9 « métiers couverts » + 18 « métiers à
couvrir »), mais deux lignes regroupent deux métiers proches sous un seul intitulé (« Salon de coiffure /
barbier », « Food truck / traiteur ») que ce lexique traite comme une entrée unique chacune — d'où les
« 25 métiers » demandés. Objectif du tableau : les mots que le client emploie réellement au téléphone
(à reprendre dans les titres, `business.description`, `services[].title`) contre le jargon d'agence à
éviter, pour le ton *et* pour le SEO (les internautes tapent les mots du client, pas ceux d'un brief
marketing — logique déjà posée dans `seo-conversion.md` §1 pour Schema.org, prolongée ici côté texte).

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

*(Brasseur et agent immobilier, présents dans la liste des 27 lignes de `docs/OBJECTIF.md`, n'ont pas
de ligne dédiée ici pour respecter le compte de 25 demandé par la tâche — mots utiles pour mémoire :
brasseur → « le brassin, la bière, le houblon, la brasserie » ; agent immobilier → « le bien, la visite,
l'estimation, le mandat ».)*

---

## 2. Images quand le client n'en a pas

### 2.1 Shot list par métier — 8 photos à faire au smartphone

Document à envoyer tel quel au client (ou à adapter en fiche PDF courte) avant le rendez-vous photo.
Structure commune à toutes les fiches (le contenu varie par métier) :

- Smartphone à l'horizontale pour les photos de hero/galerie (16:9), à la verticale seulement pour les
  portraits en gros plan.
- Lumière naturelle toujours préférée au flash — golden hour (1h après le lever / 1h avant le coucher du
  soleil) pour l'extérieur, lumière de fenêtre en fin de matinée pour l'intérieur ; jamais de plafonnier
  seul (dominante jaune/verte difficile à corriger).
- Nettoyer le cadre avant de photographier (pas d'objet personnel, pas de fond encombré) plutôt que de
  compter sur la retouche.
- Envoyer les fichiers originaux (pas de compression WhatsApp) via le lien du brief §8.

| Métier | Les 8 photos (cadrage / lumière / heure) |
|---|---|
| Plombier-chauffagiste | 1. Façade/véhicule floqué, lumière du matin ; 2. Portrait de l'artisan, fenêtre, buste ; 3. Geste : main sur une vanne/tuyau, plan serré ; 4. Caisse à outils ouverte, lumière naturelle ; 5. Chantier en cours (client d'accord), grand angle ; 6. Avant/après une intervention, même cadrage ; 7. Camion/véhicule d'intervention, extérieur, matin ; 8. Détail d'un outil signature (pince, chalumeau), macro |
| Serrurier | 1. Devanture/atelier, matin ; 2. Portrait, lumière de fenêtre ; 3. Geste : main sur un cylindre/serrure, macro ; 4. Trousseau de clés/outils, plan serré ; 5. Véhicule d'intervention ; 6. Installation d'une serrure (client d'accord) ; 7. Détail d'un outil de crochetage/perçage ; 8. Enseigne ou plaque professionnelle |
| Couvreur | 1. Toiture en cours de travaux, grand angle, matin ; 2. Portrait sur le chantier ou au sol, casque si porté ; 3. Geste : pose d'une tuile, plan serré ; 4. Échafaudage/nacelle, extérieur ; 5. Avant/après une toiture ; 6. Matériaux empilés (tuiles, zinc), lumière naturelle ; 7. Vue d'ensemble d'une maison rénovée ; 8. Détail d'une finition (chéneau, faîtage) |
| Électricien | 1. Tableau électrique ouvert, lumière artificielle correcte ; 2. Portrait, fenêtre ; 3. Geste : main sur un fil/disjoncteur, macro ; 4. Caisse à outils/multimètre ; 5. Chantier en cours (client d'accord) ; 6. Installation domotique si pertinent ; 7. Véhicule floqué ; 8. Détail d'une finition (prise, interrupteur design) |
| Coiffeur / barbier | 1. Façade du salon, matin, vitrine dégagée ; 2. Portrait de l'artisan dans le salon ; 3. Geste : coupe en cours, plan serré, client d'accord ; 4. Poste de travail (miroir, outils) ; 5. Intérieur du salon, grand angle ; 6. Détail d'une coupe/barbe terminée (de dos ou profil, pas de visage sans accord) ; 7. Produits utilisés, lumière naturelle ; 8. Ambiance salle d'attente/accueil |
| Restaurateur | 1. Façade/terrasse, golden hour ; 2. Portrait en cuisine ou en salle ; 3. Geste : dressage d'un plat, plan serré ; 4. Plat signature, lumière de fenêtre, fond neutre ; 5. Salle vue d'ensemble, service ou vide avant ouverture ; 6. Détail d'un ingrédient/produit frais ; 7. Équipe en cuisine (accord de chacun) ; 8. Ambiance du soir si le lieu s'y prête |
| Photographe de mariage | 1. Autoportrait/portrait pro, lumière naturelle ; 2. Exemple de reportage (avec accord des mariés) ; 3. Détail matériel (appareil, objectif) ; 4. Lieu de shooting habituel (jardin, salle) ; 5. Geste : en train de photographier, vu de l'extérieur ; 6. Tirage/album physique si proposé ; 7. Ambiance d'une cérémonie (accord) ; 8. Portrait en situation de reportage |
| Ferronnier d'art | 1. Atelier/forge, lumière chaude ; 2. Portrait devant la forge ; 3. Geste : marteau sur enclume, plan serré ; 4. Pièce en cours de fabrication ; 5. Réalisation terminée (portail, garde-corps), extérieur ; 6. Détail d'une finition (soudure, patine) ; 7. Outils suspendus, lumière naturelle ; 8. Étincelles/travail à chaud (sécurité respectée) |
| Menuisier-ébéniste | 1. Atelier, copeaux au sol, lumière naturelle ; 2. Portrait à l'établi ; 3. Geste : rabot/ponçage, plan serré ; 4. Pièce en cours (meuble, plan de travail) ; 5. Réalisation terminée, fond neutre ; 6. Détail d'un veinage de bois ; 7. Outils à main (ciseaux, rabots) ; 8. Stock de bois/essences |
| Maçon | 1. Chantier en cours, grand angle, matin ; 2. Portrait sur chantier, casque si porté ; 3. Geste : truelle/niveau, plan serré ; 4. Fondations/gros œuvre en cours ; 5. Avant/après une rénovation ; 6. Matériaux (parpaings, sacs), lumière naturelle ; 7. Équipe sur le chantier (accord) ; 8. Façade terminée |
| Paysagiste | 1. Jardin réalisé, golden hour ; 2. Portrait en extérieur, outils en main ; 3. Geste : taille/plantation, plan serré ; 4. Avant/après un aménagement ; 5. Détail d'une plante/massif ; 6. Véhicule/matériel (tondeuse, remorque) ; 7. Vue d'ensemble d'un jardin entretenu ; 8. Équipe au travail (accord) |
| Architecte d'intérieur | 1. Portrait dans un intérieur réalisé ; 2. Avant/après une pièce ; 3. Détail d'un agencement (rangement, cuisine) ; 4. Plan/croquis si utilisé ; 5. Palette de matériaux (échantillons, textiles) ; 6. Vue d'ensemble d'un projet terminé, lumière naturelle ; 7. Bureau/espace de travail de l'architecte ; 8. Détail d'une finition (luminaire, moulure) |
| Fleuriste | 1. Devanture, matin, fleurs visibles depuis la rue ; 2. Portrait derrière le comptoir ; 3. Geste : composition d'un bouquet, plan serré ; 4. Bouquet terminé, fond neutre, lumière naturelle ; 5. Réserve/chambre froide, variété de fleurs ; 6. Détail d'une fleur (macro) ; 7. Livraison/emballage ; 8. Intérieur de la boutique, grand angle |
| Boulanger-pâtissier | 1. Vitrine, tôt le matin, pain frais visible ; 2. Portrait au fournil, farine sur les mains ; 3. Geste : pétrissage/façonnage, plan serré ; 4. Pain/pâtisserie signature, lumière naturelle, fond neutre ; 5. Four en action ; 6. Détail d'une texture (croûte, feuilletage) ; 7. Étals/vitrine vue d'ensemble ; 8. Équipe au fournil (accord) |
| Avocat | 1. Portrait en cabinet, lumière de fenêtre, tenue professionnelle ; 2. Bureau/salle de réunion, rangé ; 3. Détail de dossiers/bibliothèque juridique (sans nom de client visible) ; 4. Façade du cabinet ; 5. Portrait en situation d'entretien (figurant si besoin, jamais un vrai client sans accord) ; 6. Plaque professionnelle ; 7. Salle d'attente ; 8. Détail d'un stylo/signature (générique, pas de document réel) |
| Vétérinaire | 1. Façade de la clinique, matin ; 2. Portrait avec un animal (accord du propriétaire) ; 3. Geste : consultation, plan serré (accord) ; 4. Salle de consultation, matériel visible ; 5. Salle d'attente ; 6. Détail d'un soin (sans souffrance visible) ; 7. Équipe (accord) ; 8. Extérieur/parking si pertinent |
| Menuisier-ébéniste (bis, si duplicat évité voir ligne dédiée) | — | — |
| Institut de beauté/spa | 1. Façade/entrée, lumière douce ; 2. Portrait de la praticienne ; 3. Geste : soin en cours (accord, pas de visage si le client préfère) ; 4. Cabine de soin, ambiance ; 5. Produits utilisés, lumière naturelle ; 6. Détail d'un rituel (mains, texture d'un produit) ; 7. Salle d'attente/accueil ; 8. Extérieur si terrasse/jardin |
| Traiteur/food truck | 1. Camion/stand, golden hour ; 2. Portrait derrière le comptoir ; 3. Geste : préparation en direct, plan serré ; 4. Plat signature, lumière naturelle, fond neutre ; 5. File d'attente/service (accord) ; 6. Détail d'un ingrédient ; 7. Intérieur du camion/cuisine ; 8. Équipe en service (accord) |
| Auto-école | 1. Véhicule floqué, extérieur, matin ; 2. Portrait du moniteur, dans ou près du véhicule ; 3. Geste : en situation de conduite (élève d'accord) ; 4. Salle de code, tableau/écran ; 5. Façade de l'auto-école ; 6. Détail d'un plan de conduite/carnet ; 7. Équipe (accord) ; 8. Zone d'examen ou de pratique habituelle |
| Chambres d'hôtes | 1. Façade/extérieur, golden hour ; 2. Portrait de l'hôte, entrée ou jardin ; 3. Chambre préparée, lumière de fenêtre ; 4. Salle de petit-déjeuner dressée ; 5. Détail d'une literie/décoration ; 6. Jardin/extérieur commun ; 7. Vue depuis une fenêtre si remarquable ; 8. Détail d'un petit-déjeuner servi |
| Coach sportif/yoga | 1. Lieu de pratique, lumière naturelle ; 2. Portrait du coach en tenue de travail ; 3. Geste : posture/exercice démontré, plan serré ; 4. Séance en cours (élèves d'accord) ; 5. Matériel utilisé (tapis, poids) ; 6. Extérieur si cours en plein air ; 7. Détail d'un mouvement (macro) ; 8. Équipe si plusieurs coachs (accord) |
| Fleuriste (voir ligne dédiée) | — | — |
| Agent immobilier | 1. Portrait devant une façade ou en agence ; 2. Bureau/vitrine avec annonces ; 3. Geste : remise de clés ou visite (accord client) ; 4. Détail d'un intérieur vendu (avec accord, sans élément identifiant le propriétaire) ; 5. Façade de l'agence ; 6. Équipe (accord) ; 7. Détail d'un plan/dossier générique ; 8. Extérieur du quartier couvert |

*(Les deux lignes « voir ligne dédiée » évitent un doublon dans le tableau — chaque métier de la liste
des 25 a bien sa propre fiche ci-dessus ; brasseur et agent immobilier suivent la même logique que
maçon/boulanger et fleuriste/agent immobilier respectivement pour construire une fiche au besoin.)*

**Règle transversale droit à l'image** : toute personne reconnaissable (client, salarié, mariés sur un
reportage) doit avoir donné son accord explicite avant publication — rappel direct de
`docs/veille/seo-conversion.md` §3.6 (consentement écrit distinct de tout autre document).

### 2.2 Retouche automatique — outils gratuits pour nettoyer/recadrer/harmoniser

| Besoin | Outil | Licence | Note |
|---|---|---|---|
| Pipeline de base (recadrage, redimensionnement, formats) | **sharp** (déjà dépendance du repo, `package.json` : `sharp@^0.35.4`) | Apache-2.0 | Utilisé par `ff images`/`ff og`/`ff photos`/`ff verifier` — voir §2.6 pour la nouvelle commande `ff nettoyer-photos` |
| Suppression de fond (alternative libre à remove.bg) | **rembg** ([github.com/danielgatis/rembg](https://github.com/danielgatis/rembg)) | **MIT** confirmé en direct le 17 sept 2026 | ⚠️ Le modèle par défaut le plus récent, `RMBG-2.0`, est distribué sous **licence BRIA distincte, qui exige un accord payant pour un usage commercial** — le README le précise explicitement. Pour rester 100 % gratuit/commercial-safe, forcer un modèle historique du projet (`u2net`, `u2netp`, `isnet-general-use`) qui reste sous une licence libre d'usage, et ne jamais laisser le modèle par défaut changer silencieusement sans revérifier sa licence |
| Suppression de fond, alternative navigateur/JS pur | `@imgly/background-removal` (IMG.LY) | **Non re-vérifié en direct cette session** — IMG.LY a historiquement un modèle mixte (usage libre limité + licence commerciale au-delà d'un volume) : vérifier la page de licence avant intégration dans `ff nettoyer-photos` |
| Agrandissement/upscaling | **Real-ESRGAN** ([github.com/xinntao/Real-ESRGAN](https://github.com/xinntao/Real-ESRGAN)) | **BSD-3-Clause** confirmé en direct le 17 sept 2026 | Binaire `realesrgan-ncnn-vulkan` utilisable sans dépendance Python/PyTorch (exécutable autonome) — pertinent pour un pipeline Node sans installer une chaîne ML complète |
| Harmonisation colorimétrique (plusieurs photos d'un même client à des heures différentes) | Pas d'outil dédié dans l'écosystème JS/sharp — approche recommandée : algorithme *gray-world* (calcul du gain par canal R/G/B en JS pur, appliqué via `sharp().linear()`) | Code maison, zéro dépendance/licence tierce | Voir spécification complète en §2.6 (`ff nettoyer-photos --balance-blancs`) |

**Recommandation pour ff-atelier** : garder `sharp` comme unique dépendance de traitement d'image (déjà
le choix du repo) et traiter `rembg`/`Real-ESRGAN` comme des outils **externes, optionnels, à la main**
(le studio les invoque via une commande séparée si besoin, comme le fait déjà `ff photos` pour la
recherche de banques d'images) plutôt que de les intégrer comme dépendance npm — ce sont des projets
Python/binaires, pas des paquets Node, et `ff nettoyer-photos` (§2.6) reste volontairement « sharp
uniquement » pour ne pas alourdir l'installation de tout le monde.

### 2.3 Génération IA — état 2026, licences, et où l'accepter

**Cadre légal désormais en vigueur : AI Act, article 50.** Confirmé en direct le 17 sept 2026
([artificialintelligenceact.eu/article/50](https://artificialintelligenceact.eu/article/50/)) —
**applicable depuis le 2 août 2026**, donc déjà opposable à la date de cette veille (17 sept 2026), pas
une échéance future :

- Les **fournisseurs** de systèmes d'IA générative (image/audio/vidéo/texte) doivent marquer leurs
  sorties dans un **format lisible par machine, détectable comme générées ou manipulées artificiellement**
  (art. 50 §2).
- Exception : une édition assistée qui **n'altère pas substantiellement** les données fournies par
  l'utilisateur n'entre pas dans l'obligation.
- Exception : une œuvre **manifestement artistique, créative, satirique, fictionnelle** n'a qu'une
  obligation allégée (signaler l'existence d'un contenu généré, sans marquage technique complet).
- Obligation spécifique **deepfake** (art. 50 §4, côté **déployeur** cette fois, pas seulement le
  fournisseur) : toute image/audio/vidéo générée ou manipulée qui ressemble à s'y méprendre à une
  personne, un lieu ou un évènement réel et paraîtrait authentique doit être signalée comme générée —
  **c'est exactement le cas d'une fausse photo « de l'atelier » ou « de l'équipe » d'un client généré par
  IA**, d'où la recommandation stricte ci-dessous.
- Un texte publié « dans le but d'informer le public sur des sujets d'intérêt public » a une obligation
  de signalement équivalente, sauf révision éditoriale humaine assumée — peu pertinent pour un site
  vitrine d'artisan (pas un média), mais à garder en tête si Finck & Fisch publie un jour un blog généré.

**Recoupement avec le droit français déjà documenté** : présenter une image générée comme une vraie
photo du client, de son équipe ou de ses réalisations est, en plus de l'obligation de marquage AI Act,
une **pratique commerciale trompeuse potentielle** au sens de l'article L121-2 du Code de la consommation
déjà cité dans `CLAUDE.md` et `docs/BRIEF.md` pour les faux avis — le raisonnement est identique : une
donnée présentée comme réelle alors qu'elle ne l'est pas trompe le consommateur sur l'identité et les
qualités réelles du professionnel.

**Outils et licences (à revérifier avant chaque usage client, ces conditions changent souvent) :**

| Outil | Licence / conditions commerciales | Statut de vérification |
|---|---|---|
| **Stable Diffusion (Stability AI, ex. SD 3.5)** | **Community License gratuite** pour tout usage (y compris commercial) pour une organisation faisant **moins de 1 M$ de revenu annuel** ; licence Enterprise payante au-delà. L'utilisateur possède les sorties générées, sous réserve de l'Acceptable Use Policy. | Confirmé en direct le 17 sept 2026, [stability.ai/license](https://stability.ai/license) |
| **FLUX (Black Forest Labs)** | Trois variantes à bien distinguer : `FLUX.1 [schnell]` sous licence **Apache-2.0** (poids ouverts, usage commercial libre) ; `FLUX.1 [dev]` sous **licence non-commerciale** (recherche/usage personnel uniquement) ; `FLUX.1 [pro]` accessible uniquement via API payante (BFL, Replicate, fal.ai...) dont les CGU autorisent l'usage commercial des sorties. | **Non re-vérifié en direct cette session** (fetch sur `bfl.ai/legal/licenses` en 404) — cadre restitué depuis la connaissance générale du projet, à recontrôler avant usage client, en particulier si `[dev]` est utilisé ailleurs qu'en interne |
| **Midjourney** | Les abonnés payants possèdent les images qu'ils génèrent et peuvent les utiliser commercialement ; **une organisation dépassant 1 M$ de revenu annuel doit être sur un plan Pro/Mega** pour conserver ce droit. Aucune indemnisation IP offerte par Midjourney. Les générations en plan gratuit/essai restent sous une licence non-commerciale et publique. | **Non re-vérifié en direct cette session** (fetch 404 sur la page CGU) — à recontrôler avant usage client |
| **Ideogram** | Modèle habituel du secteur : droits d'usage commercial accordés sur les plans payants, générations du plan gratuit restant publiques/non garanties pour un usage commercial. | **Non re-vérifié en direct cette session** (fetch 404) — à recontrôler avant usage client |
| **Recraft** | Modèle habituel du secteur : plan payant nécessaire pour un droit d'usage commercial plein. | **Non re-vérifié en direct cette session** (fetch 404) — à recontrôler avant usage client |
| **Adobe Firefly** | Entraîné sur Adobe Stock, contenus sous licence et domaine public — positionné par Adobe comme « commercialement sûr » (« commercially safe »), avec une politique d'indemnisation IP annoncée pour les contenus générés par Firefly côté Creative Cloud/Entreprise. Intègre nativement les **Content Credentials (C2PA)**, un marquage de provenance qui recoupe directement l'obligation de marquage machine-readable de l'AI Act art. 50 — c'est l'outil qui coche cette case le plus nativement des six listés ici. | Cadre général confirmé par le guide d'usage Adobe consulté en direct le 17 sept 2026 ([adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html](https://www.adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html)) — le document consulté rappelle l'interdiction de générer du contenu enfreignant un droit tiers (copyright, marque, image), sans détailler l'indemnisation dans le texte fetché ; **la politique d'indemnisation précise à recontrôler sur la page pricing/enterprise avant de la promettre à un client** |

**Risques transversaux, indépendamment de la licence :**

- **Visages** : la plupart des générateurs produisent des visages plausibles mais fictifs — les utiliser
  pour représenter « l'équipe » d'un client est le cas exact visé par l'obligation deepfake de l'AI Act
  ci-dessus, et une pratique commerciale trompeuse en droit français.
- **Marques** : un générateur peut reproduire un logo, une enseigne ou un produit de marque présent dans
  son jeu d'entraînement — risque de contrefaçon si l'image générée est utilisée publiquement sur le site
  d'un client sans lien avec cette marque.
- **Fausse représentation du client réel** : générer une « photo d'atelier » qui ne ressemble pas à
  l'atelier réel du client, ou une « réalisation » qui n'a jamais existé, est le risque le plus direct
  pour Finck & Fisch — cf. la recommandation stricte ci-dessous.

**Recommandation stricte** :

- **IA acceptable** : textures et fonds abstraits, ambiances non figuratives (déjà la position de
  `ressources.md` §5 pour les motifs 100 % code — l'IA générative reste une option secondaire là où
  `feTurbulence`/CSS suffisent déjà), illustrations stylisées assumées comme telles (pas un photo-réalisme
  trompeur), visuels d'arrière-plan de section qui ne prétendent représenter ni le client ni un lieu réel.
- **IA interdite** : toute image présentée comme une photo **du** client, de **son** équipe, de **ses**
  réalisations, de **son** local — ces champs restent vides tant que le client n'a pas fourni de vraies
  photos (c'est déjà exactement la règle de `SKILL.md` §5, cette veille ne fait que couvrir le cas où
  quelqu'un serait tenté de combler le vide avec de l'IA plutôt que de laisser le champ absent).

### 2.4 Illustrations vectorielles génériques et pictogrammes métier

Rappel de `docs/veille/ressources.md` §3 (illustrations) et §4 (icônes) — pas de duplication ici, juste le
pont avec la rédaction : une illustration générique (unDraw, Open Doodles, Humaaans, IRA Design, DrawKit
— aucune attribution requise, cf. `ressources.md` §3) peut illustrer un **concept** (une section FAQ, une
étape de process, un argument de garantie) mais ne doit jamais se substituer à une photo attendue du
métier lui-même (une illustration de « plombier générique » à la place d'une vraie photo du plombier
client serait la même erreur que l'IA générative ci-dessus, en moins réaliste donc moins trompeuse, mais
toujours à éviter sur les champs `portrait`/`team`/`gallery`). Les pictogrammes métier (Lucide déjà
utilisé dans le repo, ou tout set listé dans `ressources.md` §4 via `astro-icon`) restent le bon choix
pour représenter un service de façon neutre (une icône de robinet pour un service de plomberie), jamais
pour représenter une personne réelle.

### 2.5 Vidéo — boucle générique vs vidéo du client

Renvoi complet à `docs/veille/ressources.md` §2 pour les sources (Pexels, Coverr, Mixkit, Pixabay,
Videvo), les licences et le pipeline ffmpeg (webm + mp4 + poster, < 2 Mo) déjà documentés en détail —
cette section ajoute seulement la règle d'arbitrage :

- Une **vidéo du client**, même filmée au smartphone avec une qualité modeste, l'emporte toujours sur une
  boucle générique dès qu'il s'agit de montrer le geste du métier, l'atelier ou l'équipe — c'est le même
  principe de confiance que les photos (NN/g, `seo-conversion.md` §2.1 : transparence et connexion au
  reste du web priment sur la qualité de production pure).
- Une **boucle générique** reste acceptable uniquement pour une section d'ambiance non figurative (fond
  de hero abstrait, texture en mouvement) — jamais pour illustrer « notre équipe » ou « notre atelier »,
  même règle que pour les photos et l'IA ci-dessus.
- Consigne smartphone si le client filme lui-même : toujours à l'horizontale, viser 6-10 secondes en
  boucle silencieuse (le hero vidéo est muet par défaut dans le pipeline déjà documenté), éviter les
  mouvements de caméra brusques qui ne bouclent pas proprement.

### 2.6 Commande `ff nettoyer-photos <slug>` — spécification

Nouvelle commande, à ajouter à `scripts/ff/` sur le modèle de `scripts/ff/images.mjs` (même style
`parseArgs`/`ok`/`fail`/`warn`/`info` de `scripts/ff/util.mjs`) — **traite les photos brutes avant**
`ff images` (qui reste inchangé, chargé de la sortie AVIF/WebP/LQIP). **Volontairement limitée à `sharp`**
(déjà dépendance du repo, pas de nouvelle dépendance ML/Python) — ce qui borne ce que la commande peut
faire : pas de détection d'horizon penché automatique (hors de portée de `sharp`, qui ne fait que la
rotation EXIF par paliers de 90°), pas de suppression de fond (voir §2.2, hors périmètre volontaire).

```
node scripts/ff.mjs nettoyer-photos <slug>
  [--recadrage carre|portrait|paysage]   # ratio cible (1:1 / 4:5 / 16:9), défaut : aucun (garde le ratio d'origine)
  [--angle <degrés>]                     # redressement manuel fin (ex. --angle -1.5), un seul angle pour tout le lot
  [--balance-blancs]                     # active la correction gray-world (voir ci-dessous), off par défaut
  [--duotone]                            # applique le duotone de la direction du site (voir ci-dessous)
  [--valider]                            # promeut sites/<slug>/.ff-tmp/nettoye/ vers sites/<slug>/raw/, sauvegarde l'original dans raw/.originaux/
```

**Pipeline (entrée `sites/<slug>/raw/*.{jpg,jpeg,png,webp}`, sortie `sites/<slug>/.ff-tmp/nettoye/`,
jamais d'écrasement de `raw/` sans `--valider` explicite — même prudence que `ff photos` avec son
`apercu.html` avant copie définitive) :**

1. **Orientation** — `sharp(buf).rotate()` sans argument : lit l'EXIF et corrige l'orientation par
   paliers de 90°/180°/270°. Si `--angle` est fourni, rotation fine additionnelle via
   `sharp(buf).rotate(angle, { background: '#ffffff' })` (fond blanc temporaire, retiré à l'étape suivante).
2. **Auto-recadrage des bordures** — `sharp(buf).trim()` : coupe les marges unies (utile pour un scan ou
   une photo avec un cadre de fond blanc temporaire introduit à l'étape 1).
3. **Recadrage focal** (si `--recadrage` fourni) — `sharp(buf).resize({ width, height, fit: 'cover',
   position: 'attention' })` : la stratégie `attention` de `sharp` (libvips) détecte la zone la plus
   saillante de l'image sans dépendance IA externe — suffisant pour cadrer un portrait ou un produit sans
   perdre le sujet, pas un remplacement d'un vrai recadrage humain sur un cas délicat (le studio garde la
   main pour recadrer manuellement si le résultat automatique coupe mal).
4. **Balance des blancs** (`--balance-blancs`) — algorithme *gray-world* implémenté en JS pur : sous-
   échantillonner l'image (`sharp(buf).resize(64).raw().toBuffer()`), calculer la moyenne de chaque canal
   R/G/B, en déduire un gain par canal pour ramener les trois moyennes à l'égalité, appliquer ce gain à
   l'image pleine résolution via `sharp(buf).linear([gainR, gainG, gainB], [0, 0, 0])`. Aucune dépendance
   externe — c'est la seule méthode de correction colorimétrique qui respecte la contrainte « via sharp
   uniquement » de cette commande (les outils plus fins de §2.2, type histogram matching multi-photos,
   restent hors périmètre de `ff nettoyer-photos`).
5. **Duotone optionnel** (`--duotone`) — reprend le principe déjà documenté du filtre `data-duotone`
   (`docs/veille/rendu.md` §4.1, appliqué en CSS/SVG runtime côté site) mais **côté fichier**, utile pour
   une image qui doit être figée (vignette de proposition, image Open Graph générée par `ff og`, où le
   filtre SVG runtime ne s'applique pas) : `sharp(buf).greyscale()` puis remap deux tons via
   `.recombine()` avec la couleur d'accent et la couleur de fond de la direction du site (lues dans
   `site.config.ts`/`look.json`, jamais une couleur en dur — même règle que `docs/CONVENTIONS.md` pour les
   sections).
6. **Écriture** dans `sites/<slug>/.ff-tmp/nettoye/<nom-original>.jpg` (ou `.png` selon la source),
   feuille de contact HTML légère (même esprit que `apercu.html` de `ff photos`) pour comparer avant/après
   à l'œil avant validation.
7. **`--valider`** : déplace `raw/.originaux/<nom>.jpg` (sauvegarde de l'original, jamais supprimé) puis
   copie `.ff-tmp/nettoye/<nom>.jpg` vers `raw/<nom>.jpg` — à ce stade, `ff images <slug>` peut tourner
   normalement sur les fichiers nettoyés.

**Ce que cette commande ne fait pas, volontairement** : suppression de fond (nécessite un modèle IA, hors
périmètre « sharp uniquement », voir `rembg`/`Real-ESRGAN` en §2.2 comme outils externes séparés),
détection automatique d'un horizon penché (nécessiterait une détection de contours/Hough transform, hors
de `sharp`), harmonisation colorimétrique entre plusieurs photos prises à des heures différentes (le
gray-world de l'étape 4 corrige une image indépendamment des autres, il n'aligne pas un lot entre elles —
si besoin, appliquer manuellement le même `--angle`/`--balance-blancs` sur tout le lot pour un résultat
cohérent, ou traiter ce besoin dans une itération future documentée séparément).

---

## 3. Checklists

### 3.1 Checklist « textes livrables » (20 points)

1. Vouvoiement partout dans les textes du site, aucun tutoiement — vérifiable par lecture, aucun « tu »/« ton »/« tes » dans `site.config.ts`
2. Aucun superlatif interdit (§1.4) : grep `-i` sur "meilleur", "leader", "numéro 1", "incontournable", "référence" dans `site.config.ts` → 0 résultat
3. Aucune garantie de résultat ("garanti", "satisfaction garantie") hors formulation contractuelle explicite validée par le client
4. Aucun clivé de `SKILL.md` §4 ("votre satisfaction est notre priorité", "des professionnels à votre écoute", "la qualité au meilleur prix")
5. `business.tagline` contient au plus un seul `<em>`
6. Aucun chiffre, note, avis, nombre d'années ou de clients absent du brief — chaque valeur numérique du fichier retrouvable dans `sites/<slug>/brief.md`
7. `business.description`/`about.story`/`services[].description`/`faq[].a` découpés en paragraphes séparés par une ligne vide (jamais un pavé unique)
8. `proof.testimonials` : uniquement des avis du brief, texte non reformulé, `source` renseignée pour chacun
9. `proof.google` absent si le brief n'a pas de note ET de nombre d'avis exacts
10. Titre de hero ≤ 12 mots, compréhensible seul (test Julian Shapiro §1.1)
11. Sous-titre de hero ≤ 200 caractères, 1-2 phrases
12. Ton conforme au registre du métier (§1.3) — urgence : direct, pas de superflu ; rendez-vous : chaleureux ; commerce : sensoriel ; profession réglementée : sobre
13. Pour une profession réglementée (avocat/santé/vétérinaire, §1.3) : aucune comparaison nommée, aucune promesse de résultat, aucun mot « spécialiste » sans titre officiel
14. Pour un ostéopathe : aucun vocabulaire usurpant un titre médical, aucune promesse de guérison
15. Vocabulaire du lexique métier (§1.8) utilisé dans les titres/descriptions plutôt que du jargon d'agence
16. Paragraphes > 400 caractères marqués `measure`/`max-w-prose` (déjà vérifié par `ff verifier`, à recontrôler ici côté contenu, pas juste CSS)
17. CTA du site dans le registre attendu (« Appeler maintenant », « Demander un devis », « Prendre rendez-vous »... selon le métier), jamais un « Contact » générique seul
18. Formulaire de contact limité aux champs utiles (nom, téléphone, besoin, éventuellement ville) — pas de champ « société » pour un client BtoC
19. Message d'erreur de formulaire spécifique et actionnable, pas un texte générique type « champ invalide »
20. Aucune donnée personnelle inventée dans les FAQ (une question du brief, une réponse qui correspond réellement à ce que dit l'artisan)

### 3.2 Checklist « images livrables » (15 points)

1. Aucun champ `img`/`hero`/`logo`/`portrait`/`gallery`/`beforeAfter` renseigné sans fichier réel présent dans `sites/<slug>/public/images/`
2. Aucune photo de banque d'images générique utilisée comme photo « du client » — une banque d'images (Unsplash/Pexels, cf. `ressources.md` §1) sert uniquement de fond d'ambiance, jamais de portrait/équipe/réalisation
3. Aucune image générée par IA sur les champs `portrait`/`team`/`gallery`/`beforeAfter` (§2.3) — vérifiable en demandant l'origine de chaque fichier au moment de l'intégration
4. Toute image générée par IA effectivement utilisée (fond abstrait, texture) porte le marquage machine-readable exigé par l'AI Act art. 50 quand l'outil le propose nativement (ex. Content Credentials Adobe Firefly), sinon un marquage manuel minimal est documenté dans `CREDITS.md`
5. `CREDITS.md`/`CREDITS.json` du site liste chaque asset externe (photo banque, illustration, vidéo, modèle IA) avec source, licence, date — cf. `ressources.md` §11
6. Toute personne reconnaissable sur une photo (client, salarié, marié·e) a donné un accord explicite de droit à l'image (`ressources.md`/`seo-conversion.md` §3.6)
7. Photos réelles conformes à la shot list du métier (§2.1) quand une séance photo a été organisée — les 8 cadrages couverts au minimum
8. Aucune marque/logo tiers visible sans droit dans une photo ou un visuel généré (§2.3 risques)
9. Chaque image livrée passée par `ff images <slug>` : AVIF + WebP multi-largeurs générés, `images.json` à jour
10. Chaque `<img>`/`<picture>` a des dimensions explicites (déjà vérifié par `ff verifier`, à recontrôler ici après tout ajout d'image)
11. Aucun placeholder de banque d'images ou gradient `placeholders.mjs` resté en place alors que de vraies photos ont été livrées entre-temps
12. Illustrations vectorielles génériques utilisées seulement pour un concept, jamais à la place d'une photo métier attendue (§2.4)
13. Vidéo hero : boucle générique acceptée seulement pour un fond abstrait, jamais présentée comme « notre atelier »/« notre équipe » (§2.5)
14. Si `ff nettoyer-photos` a été utilisé : originaux conservés dans `raw/.originaux/`, rien écrasé sans `--valider` explicite
15. Alt text de chaque image descriptif et réel (ce qui est effectivement sur la photo), jamais générique type « image » ou copié d'un autre site

---

## 4. Sources

**Rédaction / copywriting**
- [Julian Shapiro — Growth Handbook](https://www.julian.com/guide/growth) (page « headlines » non re-fetchée en direct cette session, 404 sur l'URL profonde tentée)
- [Marketing Examples (Harry Dry)](https://marketingexamples.com/) — re-fetché en direct le 17 sept 2026
- [Nielsen Norman Group — Trustworthiness in Web Design](https://www.nngroup.com/articles/trustworthy-design/) (déjà cité dans `docs/veille/seo-conversion.md`)
- [Nielsen Norman Group — Error-Message Guidelines](https://www.nngroup.com/articles/error-message-guidelines/) — re-fetché en direct le 17 sept 2026
- [Baymard Institute — Checkout Flow: Average Form Field Count](https://baymard.com/blog/checkout-flow-average-form-fields) — re-fetché en direct le 17 sept 2026

**Professions réglementées**
- [Conseil National des Barreaux (CNB) — site](https://www.cnb.avocat.fr) (RIN article 10 non re-vérifié en direct cette session, 404 sur les URL tentées)
- [Ordre des médecins — Code de déontologie médicale](https://www.conseil-national.medecin.fr/code-deontologie) — re-fetché en direct le 17 sept 2026 (articles 19, 19-1, 82)
- [Ordre des masseurs-kinésithérapeutes — Communiquer sur mon activité](https://www.ordremk.fr/je-suis-kinesitherapeute/exercice/communiquer-sur-mon-activite/) — re-fetché en direct le 17 sept 2026
- Ordre National des Vétérinaires — [veterinaire.fr](https://www.veterinaire.fr) (règles précises de publicité non re-vérifiées en direct cette session, pages profondes inaccessibles)
- Code de la consommation, art. L121-1 et L121-2 (pratiques commerciales trompeuses — déjà cité dans `docs/veille/seo-conversion.md` §3.7 et `CLAUDE.md`)

**Retouche automatique**
- [rembg — GitHub](https://github.com/danielgatis/rembg) — licence MIT confirmée en direct le 17 sept 2026 (avec réserve sur le modèle par défaut `RMBG-2.0`, licence BRIA payante en commercial)
- [Real-ESRGAN — GitHub](https://github.com/xinntao/Real-ESRGAN) — licence BSD-3-Clause confirmée en direct le 17 sept 2026
- [sharp — documentation](https://sharp.pixelplumbing.com/) (déjà dépendance du repo)

**Génération IA — cadre légal et licences**
- [AI Act Explorer — Article 50: Transparency Obligations](https://artificialintelligenceact.eu/article/50/) — re-fetché en direct le 17 sept 2026 (application au 2 août 2026)
- [Stability AI — License](https://stability.ai/license) — re-fetché en direct le 17 sept 2026 (Community License gratuite < 1 M$ de revenu annuel)
- [Adobe — Generative AI User Guidelines](https://www.adobe.com/legal/licenses-terms/adobe-gen-ai-user-guidelines.html) — re-fetché en direct le 17 sept 2026
- Black Forest Labs (FLUX), Midjourney, Ideogram, Recraft — CGU/licences non re-vérifiées en direct cette session (404 sur toutes les URL tentées), à recontrôler avant usage client

**Ressources déjà cataloguées (renvoi, pas de duplication)**
- `docs/veille/ressources.md` — banques de photos/vidéos/illustrations/icônes/motifs/polices, licences détaillées
- `docs/veille/seo-conversion.md` — SEO local, CRO, obligations légales françaises (mentions légales, RGPD, droit à l'image, faux avis)
- `docs/veille/rendu.md` — filière images AVIF/WebP/LQIP, filtre `data-duotone`

**Limites de cette veille** : budget `WebSearch` épuisé avant le début (0 recherche possible), donc
recherche entièrement en `WebFetch` sur URL devinées — beaucoup ont échoué (404/403/DNS), en particulier
le RIN du CNB en détail, les pages profondes de l'Ordre des vétérinaires, Julian Shapiro (page headlines),
Les Nouveaux Copywriters (site injoignable), Baymard sur les CTA, et les CGU précises de Midjourney/
Ideogram/Recraft/FLUX. Tout ce qui n'a pas pu être re-fetché est marqué comme tel dans le corps du
document — à revérifier avant d'opposer un point précis (légal ou licence) à un client.
