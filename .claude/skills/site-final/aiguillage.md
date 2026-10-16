# Aiguillage : ce que les réponses du client décident avant toute idée

Calcul : `node scripts/ff.mjs aiguillage <slug>` (lit le brief, compte les photos du client présentes dans `raw/` et
`public/images/` hors banque d'images de `CREDITS.md`, imprime la décision et les deux lignes du contrat).
Contrôle : `ff verifier` échoue si un client « calme » reçoit `motion: 'rich'`, un attribut de défilement continu
(`data-scrub`, `data-parallax`, `data-pin`, `data-horizontal`, `data-frames`, `data-text-fill`, `data-stack`) ou une
timeline de défilement CSS dans une section sur mesure ; il alerte sur une photo affichée sans photo du client.

Les réponses du formulaire (`ff brief`, section 8 « Photos » et 12 « Ressenti ») tranchent des choix que
la skill ne devine pas. On les lit en premier, on écrit le résultat en tête du contrat (ligne AIGUILLAGE de
`direction-modele.md`), puis on invente les pistes **dans** ce cadre. Une piste qui sort du cadre est
refusée à l'étape 2, quelle que soit sa qualité.

## 1. Photos

Deux réponses à croiser : « Des photos sur votre site ? » (souhait) et les cases « ce que vous avez déjà »,
plus ce qui est réellement arrivé dans `sites/<slug>/raw/` ou `public/images/` (les fichiers, pas la case).

| Souhait | Fichiers reçus | Décision |
|---|---|---|
| Oui, et j'en ai | oui | Les photos du client sont la matière. Au moins une piste est bâtie autour de SA meilleure photo (premier écran ou geste). `ff nettoyer-photos` puis `ff images` avant de construire. Les autres pistes peuvent s'en passer, à condition de le dire dans leur contrat. |
| Oui, et j'en ai | pas encore | On construit sans photo, mais chaque piste réserve les places des photos annoncées (cadre, ratio, section) et liste les fichiers attendus. Le compte rendu dit : « en attente de vos photos : … ». Aucune place vide visible en ligne : la section qui attend une photo ne s'affiche pas tant qu'elle n'est pas là. |
| Oui, mais je n'en ai pas encore | sans objet | Le site final aura des photos : les pistes sont dessinées POUR des photos à venir (mêmes règles que la ligne du dessus), et chaque contrat écrit une **liste de prises** : 3 à 6 photos, chacune avec le sujet exact tiré du brief (« le comptoir vu de la porte », « Claire qui coupe le beaufort »), le cadrage (horizontal ou vertical), la lumière, et la section où elle ira. Le compte rendu donne cette liste et la réponse « Qui les fait ? » du formulaire : lui au téléphone (on lui envoie la liste + `studio/commercial/guide-photos.html`), nous sur place (la liste devient le plan de la séance), ou à voir (les deux options). En attendant, le site tient sans photo (typographie, objet du métier dessiné). |
| Peu ou pas, ça me va | sans objet | Aucune piste ne dépend d'une photo. Matière : typographie, objets du métier dessinés ou animés, données du brief (horaires, produits, lieux). Le logo s'il existe. |
| Pas répondu (« ? à demander ») | rien | Comme « peu ou pas », et le compte rendu pose la question en une ligne. |

Les cases précisent ce qu'on peut montrer :
- **Portrait** coché : la voix signée (GOUT § 5) peut avoir un visage. Sans portrait, jamais de silhouette ni d'avatar.
- **Réalisations / boutique** : une galerie ou une photo-preuve est permise. Sans elles, pas de galerie.
- **Avant/après** : seul cas où une section avant/après existe.
- **Logo** : il entre tel quel. Sans logo, le nom s'écrit en typographie, jamais de logo inventé.

Interdit dans tous les cas : photo de banque d'images présentée comme celle du client, mention « photo
d'illustration », image générée par IA. Une photo libre de droits n'entre que si le fondateur l'a décidé pour
ce client, noté daté dans « Accepté par le fondateur ».

## 2. Ambiance (niveau de mouvement)

Réponse « L'ambiance » de la section 12. Elle prime sur les trois adjectifs ; les adjectifs nuancent.
Dans tous les cas le site reste vivant (GOUT § 4) : l'ambiance règle **combien et comment**, jamais
« rien ».

| Réponse | `motion` | Entrée du premier écran | Au défilement | Geste signature |
|---|---|---|---|---|
| Plutôt calme, posé | `subtle` | une seule, courte (≤ 0,8 s), sans rebond | sec (≤ 0,2 s), peu d'éléments, rien ne suit le défilement en continu | répond au doigt (toucher, glisser), pas au défilement |
| Plutôt vivant, qui bouge | `rich` | marquée, peut durer jusqu'à 1,5 s | deux régimes (sec + lent ou à rebond), un élément peut suivre le défilement | peut être piloté par le défilement ET répondre au doigt |
| Je ne sais pas, montrez-moi | selon la piste | | | Les N pistes couvrent l'écart : au moins une calme et une vivante, écrites comme telles dans leur contrat. Le compte rendu dit laquelle est laquelle. |
| Pas répondu | selon la piste | | | Comme « je ne sais pas ». |

Contradiction (réponse « calme » mais adjectifs « dynamique, fun ») : on suit la réponse, et le compte rendu
signale l'écart en une ligne avec la phrase pour basculer.

## 3. Ce que le contrat écrit

Ligne AIGUILLAGE, deux phrases : « Photos : <décision du tableau 1, avec la liste de prises si besoin>.
Mouvement : <calme | vivant>, `motion` <valeur>, parce que <réponse du client> ». Le relecteur DA vérifie le
site contre cette ligne : une piste « calme » dont un élément suit le défilement, ou une piste qui montre une
photo que le client n'a pas, est plafonnée à 6 en idée.
