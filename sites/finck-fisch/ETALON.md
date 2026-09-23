# Étalonnage — 17 sites de studios, et les 8 décisions qu'on en tire

> Phase 1 de la refonte du 22 sept. 2026. Mandat du fondateur : « faire notre site méga clean, le
> moins IA possible, méga beau, super pro ». Avant de dessiner, on regarde ce que font ceux qui
> vendent du design à des marques et à des PME — et surtout ce qu'ils **évitent tous**.
>
> **Méthode et limite, dite honnêtement.** 17 pages d'accueil relevées par fetch HTTP (HTML brut
> quand le résumé markdown était douteux, pour vérifier les citations mot à mot). Les comptes de mots
> « au-dessus de la ligne de flottaison » sont des **estimations tirées de l'ordre du DOM**, pas des
> mesures de pixels : aucune capture visuelle n'a été faite. Toutes les phrases entre guillemets sont
> littérales. Ce qui n'a pas pu être lu est marqué « non lisible » plutôt que deviné.
>
> **Corrections d'URL trouvées en route** (à retenir, elles font perdre du temps) :
> `deptagency.com` → 301 vers `dept.global` · `basementstudio.com` est un domaine parqué, le studio
> est sur `basement.studio` · `collins.co` est un fabricant de mobilier de salon de coiffure, le
> studio COLLINS est sur `wearecollins.com` · `cosavostra.com` → 301 vers `justcosa.com` (l'agence
> s'appelle Cosa) · `brandbrothers.fr` → 301 vers `brandbrothers.studio` · `uncommon.co` ne résout
> pas, c'est `uncommon.studio` · `studiofreight.com` a été remplacé par son successeur
> `darkroom.engineering`.
> **Écartés faute de contenu lisible** : `upperside.fr` (HTML vide, tout en JS), `laphase.com`
> (serveur injoignable, et aucun studio « La Phase » identifiable avec certitude).

---

## 1. Le relevé, site par site

Mots = estimation au-dessus de la ligne de flottaison. « Prix » = présence d'un tarif de prestation.

| # | Site | Mots | Preuve du travail | Prix | Ce qu'il fait que nous ne faisons pas |
|---|---|---|---|---|---|
| 1 | hellomonday.com | ~5 | Grille filtrable de 60+ projets, **titres éditoriaux** au lieu de noms de clients | jamais | Le contact est segmenté par intention : « Want to collaborate? / Want to say hi? / Want to join us? / Want to learn? » |
| 2 | instrument.com | ~10 | Grille filtrable + **liste de clients écrite en texte courant**, pas en logos | jamais | Le bloc « Services » fait deux phrases et renvoie ailleurs. Pas de grille de cartes. |
| 3 | dept.global | ~20 | 5 cas « titre-bénéfice + client + deux tags » + badge analyste (Gartner) | jamais | Se positionne par une catégorie inventée (« The Growth Invention Company ») plutôt que par un métier |
| 4 | uncommon.studio | ~5 (que des libellés) | Aucune section « work ». Un « Live Feed ». | jamais (mais une boutique) | Refuse les mots d'agence : « Live Feed », « Editorial », « Info » à la place de Work/Blog/About |
| 5 | locomotive.ca | ~12 | 45 projets avec ville, secteur, année et **nombre de prix** ; cas de 120 mots | jamais (sauf t-shirts) | Un bloc « Culture » qui vend l'agence par les voyages d'équipe. Open source mis en avant. |
| 6 | obys.agency | **0 phrase** | 19 projets en images, **zéro texte de cas** ; la taxonomie fait tout | jamais | Le visiteur choisit la disposition du portfolio (Vertical / Horizontal / Grid) |
| 7 | unseen.co | ~28 | Rien au-dessus de la ligne ; « Selected Projects » plus bas | jamais | Deux adresses de contact **par intention** (`projects@` / `hello@`) ; un « Wrapped » annuel |
| 8 | darkroom.engineering | ~25 | 3 projets seulement, 3 témoignages **anonymisés**, de l'open source réellement adopté, et un **journal daté** (`2026/02/06 — Satus hardened — 432 tests`) | jamais | Un changelog public en guise de preuve. Écrit aussi pour les agents IA. |
| 9 | basement.studio | ~45 | Logos + 4 cas rédigés, dont le seul résultat chiffré du panel (« sold out inventory in hours ») | jamais | Des compteurs dans la nav : `Showcase (26)`, `Blog (29)` — la preuve de volume avant le clic |
| 10 | abcdinamo.com | ~20 | Les polices elles-mêmes, essayables au doigt ; métriques par famille | **oui, barème public complet** | Publie sa grille tarifaire **et l'argumente sur 1 000 mots** : « companies should pay relative to their revenue potential » |
| 11 | pentagram.com | ~30 (sur un projet, pas sur eux) | Une ligne factuelle par projet ; 18 secteurs × 15 disciplines en filtres | jamais | La phrase-manifeste **est une interface** : `We design [Everything ▾] for [Everyone ▾]` |
| 12 | wearecollins.com | ~15 | `8x Agency of the Year` avec les 8 années et les organismes nommés | jamais, mais **offre productisée** | 11 « Programs » nommés **par situation du client** (Brand Refresh, Reposition, Expansion, Turnaround) |
| 13 | akaru.fr | ~45 | 10 projets avec année + catégorie ; **35 Awwwards, 19 FWA** | jamais (ni formulaire) | Se moque du process : « À l'heure des protocoles excessifs, on revendique la normalité » |
| 14 | grapheine.com | ~55 | Portfolio filtré **par secteur** + 359 articles de magazine + 25 ans | jamais | Le seul délai de tout le panel : « Nous revenons vers vous sous 48 heures pour un premier échange. » |
| 15 | murmure.me | ~10, **aucune phrase** | Un mur de ~50 images, sans année, sans catégorie, sans texte | jamais | La home est un outil : deux manettes, « Aléatoire » et « Taille des images – + » |
| 16 | brandbrothers.studio | ~15 | Carrousel + 8 noms de projets nus ; l'autorité est déportée (cours, jurys, conférences) | jamais | Une définition en deux phrases plates : « est un studio de branding » / « Nous faisons de la stratégie, de l'identité visuelle et de la typographie » |
| 17 | justcosa.com (ex-CosaVostra) | ~70 | Logos + 4 témoignages nominatifs + un chiffre **mis dans la bouche du client** | jamais | Le formulaire rédigé **comme une phrase à trous** : « Je suis [Nom] de la société [X]. J'ai un projet [Y]. » |

### Le ton des premières phrases — quelques relevés littéraux

- Hello Monday : « We make digital (and magical)… »
- darkroom : « Where Things Get Developed » / « [ Darkroom ], noun — A Lightproof Room for Developing
  Photographs. » — et le corps du texte en minuscules assumées.
- COLLINS : « Rewrite your worth. » — trois mots, puis `8x Agency of the Year`.
- basement : « A digital studio & branding powerhouse making cool shit that performs » — juron compris,
  jusque dans la balise `<title>`.
- Dinamo : « Fonts are (great looking) tools. », « Try it, it's free! <333 »
- Akaru : « Nous sommes une agence web à Lyon avec un savoir-faire de précision. »
- Brand Brothers : « Brand Brothers est un studio de branding. »
- Murmure : **aucune phrase sur la page d'accueil**, uniquement des noms de projets.

---

## 2. Ce qu'ils évitent TOUS — la liste qui compte le plus

Relevé sur les 17, sans exception notable :

1. **Le paragraphe de présentation au-dessus de la ligne de flottaison.** Médiane ~20 mots, de 0 à 70.
   Jamais de sous-titre explicatif *et* d'accroche *et* de deux boutons.
2. **La grille de cartes « Nos services » avec icônes.** Zéro sur 17. Quand les services existent,
   ils tiennent en une à quatre lignes et renvoient ailleurs.
3. **Le carrousel de logos clients.** Un seul (Cosa). Instrument écrit ses clients **en texte courant**.
4. **Le témoignage en page d'accueil.** Deux exceptions (darkroom, anonymisé ; Cosa, nominatif).
5. **Le chiffre de résultat business.** Un seul du panel, et il est **cité** par le client, pas
   revendiqué. Le chiffre de performance est perçu comme vulgaire.
6. **Le double CTA « Devis gratuit / Nos offres ».** Aucun. Akaru, Murmure et Brand Brothers n'ont
   aucun bouton du tout ; le contact est souvent une adresse e-mail nue.
7. **L'eyebrow en capitales au-dessus de chaque titre.** Absent partout.
8. **Le vocabulaire d'agence** : *solution, sur-mesure, accompagnement, innovation, passion, écoute*
   sont absents des sept sites anglo-saxons. (Côté français, « accompagner » revient — c'est le mot
   mou local.)

### Et les deux trous que personne n'occupe

- **Personne n'explique comment on travaille avec lui.** Zéro processus étapé sur 17. Un seul délai
  sur 17, et c'est un délai de *réponse commerciale* (Grapheine, 48 h). Akaru et Brand Brothers
  revendiquent explicitement l'absence de méthode.
- **Personne n'affiche un prix de prestation** (Dinamo vend un produit, pas des heures). Côté
  français, aucun formulaire ne comporte même un champ « budget », alors que c'est la norme
  anglo-saxonne. La qualification budgétaire se fait au téléphone.

C'est exactement la fente où passe Finck & Fisch : le goût visuel de Murmure **plus** la lisibilité
opérationnelle que ces dix-sept refusent. Un artisan veut savoir *combien, quand, et ce qu'il doit
faire* ; aucun de ces sites ne le lui dit.

---

## 3. Les 8 décisions pour notre site

**1. Le premier écran devient un frontispice, pas une landing page : le monogramme d'abord, une
phrase, rien d'autre.**
Médiane du panel : ~20 mots au-dessus de la ligne, aucun bloc n'a paragraphe + deux boutons. Notre
premier écran en avait trois (titre, paragraphe, deux boutons) et le monogramme — le seul geste validé
par le fondateur — était coincé *derrière* le titre, illisible, où il ressemblait à une tache. Il passe
devant, en grand, et se trace. Zéro bouton dans le hero : le panneau latéral porte déjà le téléphone et
le seul CTA de la page (règle « un intitulé par intention », taste-skill §4.5).

**2. On garde la coquille `split`.**
Murmure, Obys, Pentagram : la page d'accueil d'un studio est un objet qu'on parcourt, pas un tunnel.
Le panneau fixe à gauche (nom, métier, sommaire actif, téléphone, CTA) tient ce contrat et libère le
hero de toute obligation de navigation. C'est aussi la seule coquille du repo qui casse le « full
scroll down, contact en bas » reproché par le fondateur, et aucun autre site ne l'utilise.

**3. La preuve arrive au bloc n°1, et c'est notre argument montré, pas raconté : la planche de trois
propositions.**
Chez 4 des 5 premiers sites, le bloc qui suit le hero est déjà le portfolio. Notre portfolio, ce n'est
pas douze captures : c'est **le même contenu rendu trois fois différemment**. Les trois images sont de
vraies sorties de `ff propositions demo-boulangerie` (directions *atelier*, *clair*, *rétro*), même
titre, même paragraphe, même numéro — un artisan voit en deux secondes ce qu'il achète. Légendées
« démonstration », règle dure n°2 respectée.

**4. On occupe le premier trou du panel : la méthode, en réglure graduée de 0 à 72 heures.**
Zéro processus sur 17 sites, un seul délai. Une frise « 1. Découverte 2. Design 3. Lancement » serait
le cliché exact que ces studios fuient ; une **réglure**, avec l'heure en chiffres tabulaires à chaque
graduation et le trait qui se trace au défilement, fait *sentir* la vitesse au lieu de l'affirmer.
Les heures viennent de `docs/PROCESS.md`, pas d'une estimation, et l'engagement reste marqué
provisoire.

**5. On occupe le second trou, et c'est le geste le plus fort de la page : le prix est affiché **et
argumenté**.**
Un seul des 17 publie un barème — Dinamo — et il en fait un éditorial de 1 000 mots expliquant
pourquoi ce barème est juste. Les seize autres ne disent pas même « sur demande ». Sur le marché de
l'artisan, c'est l'inverse : tout le monde affiche « dès 299 € » sans rien derrière. La place vide est
celle d'un studio qui annonce un prix clair **et dit pourquoi**. Une phrase avant le tableau : nous
vendons un site fini, pas des heures.

**6. Aucun eyebrow sur la page, et la preuve est un nom propre ou un nombre — jamais un adjectif.**
Impeccable bannit l'eyebrow, taste-skill le rationne, et il est absent des 17. Chez nous : zéro, on
numérote ou on ne met rien (règle 13, dans sa lecture la plus stricte). Même logique côté contenu :
`35 Awwwards`, `© 1972–2026`, `432 tests`, `8x Agency of the Year`. Nos nombres à nous sont
`72 h`, `12 métiers`, `1 200 €`, `2 associés` — pas « qualité » ni « sur mesure ».

**7. Un manifeste qui dit ce qu'on s'interdit, pas ce qu'on promet.**
Akaru se définit contre le client-roi, darkroom écrit en minuscules, basement jure dans sa balise
`<title>` : le ton est la différenciation la moins chère, et elle se décide. Notre angle est déjà
écrit dans le repo (règle dure n°2, « jamais de donnée inventée ») : pas d'abonnement, pas de modèle
recopié, pas de faux avis. Le bloc encre reste le temps fort de la page, mais il devient un moment
purement typographique et signé, sans liste numérotée — Réalisations en a déjà une juste après.

**8. Vouvoiement, « nous », et un seul « on » par page.**
Les cinq sites français vouvoient sans exception, disent « nous » pour se désigner et gardent « on »
pour la phrase de caractère (« on revendique la normalité », « on écoute tout »). Jamais de « je ».
On applique la même règle, on bannit « accompagner » (le mot mou local, relevé chez Grapheine et Cosa)
et on écrit des phrases qu'on dirait au téléphone.

### Ce qu'on a regardé et volontairement pas pris

- **Le contact segmenté par intention** (Hello Monday, Instrument, Unseen) : excellent pour un studio
  qui reçoit des candidatures et de la presse. Nous n'avons qu'une intention — un artisan qui veut un
  site. Deux portes créeraient une hésitation, pas un tri.
- **Le formulaire-phrase de Cosa** (« Je suis [Nom] de la société [X]… ») : vraiment bon pour un
  artisan peu à l'aise avec un formulaire — mais il vit dans `src/components/ContactForm.astro`,
  partagé par les vingt sites. À proposer à l'équipe moteur, pas à forker ici.
- **Le mur d'images sans un mot** (Murmure, Obys) : magnifique, et suicidaire pour nous. Ils vendent à
  des directeurs artistiques qui savent lire une image ; nous vendons à un couvreur qui veut savoir le
  prix.
- **Le chiffre de résultat** : interdit chez nous de toute façon (règle dure n°2), et le panel confirme
  que c'est aussi le plus vulgaire.
