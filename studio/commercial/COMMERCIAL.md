# Playbook commercial — Finck & Fisch

> **Ce document n'est pas un conseil juridique.** Comme `studio/juridique/JURIDIQUE.md`, c'est une synthèse de veille
> destinée à préparer une vraie relecture par un professionnel du droit avant tout usage intensif
> (envoi massif d'e-mails/SMS, campagne WhatsApp). Rédigé le 17 septembre 2026. Le budget `WebSearch` de
> cette session était déjà épuisé (200/200) avant la rédaction du § 1 — le cadre légal a donc été vérifié
> par téléchargement direct des pages officielles (cnil.fr, bloctel.gouv.fr, service-public.gouv.fr,
> whatsapp.com), avec extraction du texte brut ; chaque point ainsi confirmé porte son URL et sa date de
> mise à jour. Les points qui n'ont pas pu être re-vérifiés (Légifrance et economie.gouv.fr renvoyaient
> systématiquement une erreur 403) sont marqués ⚠, sur le même principe que `studio/juridique/JURIDIQUE.md` et
> `docs/veille/redaction-images.md`. Deux règles dures s'appliquent ici comme
> partout ailleurs dans ce dépôt : **jamais un chiffre ou un témoignage inventé**, **jamais une affirmation
> invérifiable présentée comme un fait** (y compris dans un argumentaire commercial oral ou écrit).

Ce document est le pendant opérationnel de `studio/juridique/JURIDIQUE.md` (cadre contractuel) et
`docs/veille/concurrents.md` (positionnement). Il couvre ce qui se passe **avant** le brief
(`docs/BRIEF.md`) : trouver un prospect, le contacter légalement, le convaincre, le faire signer.

---

## 1. Cadre légal de la prospection B2B en France (2025-2026)

Rappel de contexte : Finck & Fisch prospecte des **professionnels** (artisans, commerçants, TPE) pour
leur vendre un service **en rapport avec leur activité professionnelle** (un site web pour faire
connaître leur entreprise) — c'est le régime B2B qui s'applique par défaut, avec l'exception importante
déjà documentée dans `studio/juridique/JURIDIQUE.md` § 6.2 (article L221-3 du Code de la consommation, qui étend le
droit de rétractation de 14 jours aux clients professionnels de ≤ 5 salariés dont l'objet du contrat
sort de leur activité principale — le cas quasi systématique d'un artisan qui achète un site web).

### 1.1 E-mail

Source de référence : [CNIL — La prospection commerciale par courrier électronique, SMS-MMS et automate
d'appel](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique-sms-mms-et-automate-dappel)
(mise à jour 10 juin 2026, texte intégral téléchargé et relu le 17 septembre 2026). Textes cités par la
CNIL en bas de page : RGPD art. 6 (bases légales) et 21 (droit d'opposition), Code des postes et des
communications électroniques art. **L34-5**. Une seule page CNIL couvre e-mail, SMS-MMS et automate
d'appel, avec un régime identique — ce qui vaut ici vaut pour le § 1.2.

- **Principe B2B, cité tel quel** : « La prospection commerciale par voie électronique (courrier
  électronique, SMS-MMS, automate d'appel, etc.) est possible mais les personnes doivent d'abord en être
  informées. Elles doivent également y consentir préalablement s'il s'agit de particuliers ou pouvoir
  s'y opposer s'il s'agit de professionnels. » Et : « La prospection à l'égard de professionnels peut
  être fondée sur l'intérêt légitime de l'organisme lorsque l'objet de la sollicitation est en rapport
  avec la profession de la personne démarchée. » Un site web vendu à un artisan pour son activité est
  exactement ce cas — **pas de consentement préalable requis**, base légale = intérêt légitime.
- **Obligations qui subsistent malgré l'absence de consentement préalable** (même page) :
  - « chaque sollicitation doit obligatoirement permettre à la personne concernée de prendre
    connaissance de l'identité de l'organisation qui l'émet ainsi que d'exprimer, si elle le souhaite et
    par un moyen simple, son refus de recevoir de nouvelles sollicitations » — donc **identification
    claire du studio** et **moyen simple de refuser** dans chaque message ;
  - traitement effectif de toute demande de désinscription — ne plus recontacter la personne ;
  - si les données viennent d'un tiers ou étaient déjà détenues pour un autre motif, « il faut s'assurer
    que la personne concernée a été informée de la possible utilisation de son adresse électronique ou
    son numéro de téléphone pour de la prospection et est en mesure de s'y opposer » — pertinent pour
    F&F au moment du premier message : c'est lui qui porte cette information, d'où la ligne de
    désinscription dans tous les templates du § 3 ;
  - recommandation CNIL pour les formulaires de collecte (site vitrine, formulaire brief) : « le droit
    d'opposition (pour le B to B) soit recueilli par le biais d'une case à cocher décochée par défaut ».
- **Adresse de destination, générique vs nominative — cité tel quel** : « Les adresses génériques de
  type info[@]nomsociete.fr, contact[@]nomsociete.fr ou commande[@]nomsociete.fr, qui concernent des
  personnes morales, ne sont pas soumises aux principes rappelés ci-dessus. » Autrement dit : écrire à
  `contact@` d'une entreprise n'est pas juridiquement une prospection visant une personne physique ; dès
  que l'adresse est nominative (`prenom.nom@`) ou que le message vise une personne identifiée, les
  règles B2B ci-dessus (information + opposition) s'appliquent. Pour l'**adresse d'expédition** de F&F,
  aucune contrainte de format — l'important est l'identification du studio dans le corps du message.
- **Durée de conservation** : voir § 1.5 (registre des prospects), même règle pour tous les canaux.

### 1.2 SMS / WhatsApp

- **SMS — cadre CNIL** : la page CNIL citée au § 1.1 traite e-mail, SMS-MMS et automate d'appel **sur
  une seule fiche, avec le même régime** — la prospection par SMS vers un professionnel, pour un
  service en rapport avec son activité, relève de l'intérêt légitime, sans consentement préalable, avec
  information + moyen simple de refuser à chaque envoi. Confirmé par téléchargement direct de la page le
  17 septembre 2026.
- **Mention « STOP »** : la CNIL n'exige pas ce mot en tant que tel — l'obligation est formulée comme
  « un moyen simple » de refuser. « STOP » est la pratique du marché (opérateurs, SMS grand public), pas
  une exigence CNIL identifiée noir sur blanc pour le B2B. Le studio la garde dans tous les templates du
  § 3 : c'est le moyen simple le plus universellement compris, et il ne coûte rien.
- **Horaires** : aucun créneau horaire légal identifié sur la fiche CNIL pour le SMS (les créneaux
  10h-13h / 14h-20h existent pour le **téléphone vers les consommateurs**, § 1.3, pas pour le SMS ni pour
  le B2B). La pratique déjà documentée dans `scrapping_artisans/README_WHATSAPP.md` (8h-9h30 et 17h-19h
  en semaine, jamais le week-end ni les jours fériés) reste une bonne pratique, à traiter comme telle et
  pas comme une règle.
- **WhatsApp — un cadre contractuel plus strict que le RGPD.** La politique commerciale de WhatsApp
  ([WhatsApp Business Messaging Policy](https://www.whatsapp.com/legal/business-policy/), texte intégral
  téléchargé et relu le 17 septembre 2026) dit, mot pour mot : « You may only contact people on WhatsApp
  if: (a) they have given you their mobile phone number; and (b) you have received opt-in permission
  from the recipient confirming that they wish to receive subsequent messages or calls from you. » Et :
  « Do not confuse, deceive, defraud, mislead, spam, or surprise people with your communications. »
  **Conséquence nette** : même si le droit français autorise la prospection B2B par voie électronique
  sur la base de l'intérêt légitime, **Meta exige un opt-in avant tout premier message** — un premier
  contact WhatsApp à froid vers un numéro trouvé sur Google Maps est contraire à cette politique, et
  Meta applique ses sanctions (blocage du numéro) indépendamment du droit français. Ce n'est pas un
  risque de contentieux, c'est un risque de perdre le canal.
- **Ce que ça change concrètement pour F&F** (décision des fondateurs, voir `docs/OBJECTIF.md` critère
  16) :
  - les trois premiers messages du § 3 (WA-1/2/3) sont **licites en SMS** (intérêt légitime B2B, § 1.1)
    — c'est le canal à privilégier pour le premier contact vers un numéro mobile, même s'il est moins
    confortable que WhatsApp ;
  - **WhatsApp devient le canal de suite**, une fois que le prospect a répondu (au SMS, à l'e-mail, à
    l'appel) ou a donné son numéro — les relances, l'envoi des propositions, la livraison et la demande
    d'avis (§ 3) y sont à leur place, puisque la conversation est alors initiée ou consentie ;
  - si les fondateurs choisissent malgré tout le WhatsApp à froid (pratique courante du secteur, et
    c'est ce que fait aujourd'hui `scrapping_artisans/whatsapp_app`), ils le font en connaissance de
    cause : messages courts et personnalisés, volume modéré, **numéro WhatsApp Business dédié** à
    l'atelier (jamais le numéro personnel d'un fondateur — un bannissement doit rester récupérable),
    arrêt immédiat au premier « STOP ».

### 1.3 Téléphone

Source : [CNIL — Prospection commerciale par téléphone (hors automate d'appel) : quelles sont les
règles ?](https://www.cnil.fr/fr/prospection-commerciale-par-telephone-hors-automate-dappel-quelles-sont-les-regles)
(mise à jour 10 juin 2026, texte intégral téléchargé et relu le 17 septembre 2026), et
[bloctel.gouv.fr](https://www.bloctel.gouv.fr/) (page d'accueil, même date).

- **Bloctel n'existe plus.** Page d'accueil de bloctel.gouv.fr, citée telle quelle : « Fin de Bloctel. Le
  service Bloctel a pris fin avec l'entrée en vigueur au 11 août 2026 du régime de démarchage
  téléphonique fondé sur le recueil préalable du consentement du consommateur, conformément à la loi du
  30 juin 2025. » Il n'y a donc plus aucune liste d'opposition à consulter, pour personne. (La page CNIL
  sur la réutilisation des données publiées en ligne, § 1.6, cite encore Bloctel — elle n'a pas été mise à
  jour depuis la réforme ; ne pas la suivre sur ce point.)
- **Le nouveau régime est réservé aux consommateurs (B2C).** La fiche CNIL sépare explicitement « Vers
  les consommateurs (B to C) » et « Vers les professionnels (B to B) ». Côté consommateurs : « Les
  consommateurs ne peuvent pas être démarchés par téléphone, sauf s'ils ont donné leur consentement
  préalable ou lorsque l'appel concerne un contrat en cours (article L. 223-1 du code de la
  consommation, issu de la loi du 30 juin 2025). » Consentement valable un an, preuve conservée trois
  ans. Horaires quand le consentement existe : « du lundi au vendredi, de 10 heures à 13 heures et de 14
  heures à 20 heures. Elle est interdite en dehors de ces créneaux ainsi que les samedis, dimanches, et
  jours fériés. » **Rien de tout cela ne s'applique à F&F** tant que le studio n'appelle que des
  professionnels sur leur numéro professionnel, pour leur activité.
- **Côté professionnels (B2B)**, même formule que pour l'e-mail : « La prospection à l'égard de
  professionnels peut être fondée sur l'intérêt légitime de l'organisme lorsque l'objet de la
  sollicitation est en rapport avec la profession de la personne démarchée. » Obligations : information
  et droit d'opposition simple et gratuit — **aucun consentement préalable, aucun créneau horaire légal**
  mentionné pour le B2B sur cette fiche.
- **Horaires d'appel** : en l'absence de règle B2B, le studio applique une bonne pratique alignée sur le
  créneau consommateurs (lundi-vendredi, 10h-13h / 14h-20h — en évitant 12h-14h, pause déjeuner déjà
  déconseillée dans `README_WHATSAPP.md`), jamais le week-end ni les jours fériés. C'est un choix de
  courtoisie, pas une obligation identifiée.
- ⚠ Page DGCCRF sur le nouveau régime (citée par bloctel.gouv.fr) :
  [economie.gouv.fr/dgccrf/... le-demarchage-telephonique-desormais-interdit-si-vous-ny-avez-pas-consenti](https://www.economie.gouv.fr/dgccrf/actualites-dgccrf/le-demarchage-telephonique-desormais-interdit-si-vous-ny-avez-pas-consenti)
  — URL relevée dans le HTML de bloctel.gouv.fr, contenu non vérifié (403 Cloudflare sur
  economie.gouv.fr cette session).
- **Attention au cas mixte** : un artisan joint sur son **06 personnel** qui sert aussi à son activité
  reste un professionnel démarché pour son activité — le régime B2B s'applique en principe. Mais si le
  numéro est manifestement celui d'un particulier (pas de lien avec l'activité), ou si le studio vend un
  jour à un particulier, c'est le régime consommateurs ci-dessus, avec consentement préalable
  obligatoire : ne jamais appeler un particulier à froid.

### 1.4 Démarchage physique

Aucun cadre légal spécifique identifié pour la visite commerciale impromptue chez un artisan en B2B (pas
de régime équivalent au « démarchage à domicile » du Code de la consommation, qui vise les particuliers).
Point de vigilance croisé avec `studio/juridique/JURIDIQUE.md` § 6.2 : si un devis est **signé sur place, hors
établissement du studio** (donc quasi toujours, puisque F&F n'a pas de local commercial), et que le client
a ≤ 5 salariés avec un objet de contrat hors de son activité principale, l'exception L221-3 s'applique
exactement comme pour un appel/e-mail à distance — le studio doit prévoir la même clause de demande
expresse d'exécution anticipée que pour tout autre canal (§ 6 ci-dessous, et `studio/juridique/JURIDIQUE.md` § 6.2).

### 1.5 RGPD — registre des prospects

- **Durée de conservation** : la doctrine CNIL constante pour les données de prospection commerciale (hors
  client, contact resté sans suite) est de **3 ans à compter du dernier contact** émanant du prospect
  (réponse, clic, demande) — passé ce délai sans interaction, la donnée doit être supprimée ou
  réactivée par un nouveau contact express. ⚠ Non re-confirmé par une page CNIL rouverte en direct cette
  session (budget de recherche épuisé), mais c'est une règle stable et largement documentée de la
  doctrine CNIL post-RGPD (héritée de l'ancienne norme simplifiée NS-048, abrogée dans sa forme mais dont
  la doctrine de durée a été reprise) — à confirmer sur
  [cnil.fr](https://www.cnil.fr/fr/les-durees-de-conservation-des-donnees) avant de bâtir une politique
  de purge automatisée.
- **Conséquence pratique pour le tableau de suivi (§ 5)** : une colonne « date du dernier contact » n'est
  pas qu'un aide-mémoire commercial, c'est aussi le point de départ légal du délai de conservation — un
  prospect qui n'a jamais répondu depuis 3 ans doit sortir de la base, pas y dormir indéfiniment.
- La base `scrapping_artisans/data/whatsapp_artisans.db` constitue déjà, de fait, un tel registre de
  prospects (colonnes `message_envoye`, `a_repondu`, `statut_reponse`) — la règle des 3 ans s'y applique
  telle quelle, avec une purge à prévoir (aucune purge automatique identifiée dans
  `scrapping_artisans/whatsapp_database/models.py` à ce jour — point à traiter côté `scrapping_artisans`,
  hors périmètre de ce document qui ne touche pas au code).

### 1.6 LinkedIn

Aucune règle CNIL spécifique et dédiée à LinkedIn identifiée. Le principe général s'applique sans
particularité : un profil LinkedIn public reste une **donnée personnelle** au sens du RGPD dès lors qu'il
identifie une personne physique, et son usage à des fins de prospection (message privé, extraction
d'adresse e-mail visible sur le profil) relève du même régime que l'e-mail B2B (§ 1.1) — intérêt légitime
possible si le message concerne l'activité professionnelle affichée par la personne. Deux points de
vigilance distincts du RGPD : (1) le **scraping automatisé** de profils LinkedIn viole les conditions
d'utilisation de la plateforme (risque de blocage de compte, indépendant du RGPD) — non pertinent pour
un usage manuel, prospect par prospect ; (2) un message via la messagerie LinkedIn reste soumis aux mêmes
exigences d'identification et de simplicité de l'opposition que l'e-mail (§ 1.1).

### 1.7 Ce qui n'est pas négociable, résumé en 5 points

1. S'identifier clairement (nom, studio, coordonnées) dans chaque premier message, quel que soit le canal.
2. Offrir un moyen simple et gratuit de dire stop, et l'honorer immédiatement — pas de relance après un
   « non » ou un « STOP ».
3. Ne jamais démarcher un particulier comme un professionnel : F&F vend à des artisans **pour leur
   activité**, jamais à un consommateur final — si un jour le studio vend à un particulier, tout le
   régime B2C de `studio/juridique/JURIDIQUE.md` § 0 s'applique sans nuance.
4. Purger ou réactiver tout prospect resté sans réponse après 3 ans.
5. Toujours prévoir la clause de demande expresse d'exécution anticipée sur le devis, quel que soit le
   canal d'entrée en contact (`studio/juridique/JURIDIQUE.md` § 6.2) — un devis signé par téléphone, e-mail, WhatsApp
   ou en personne chez le client reste, dans l'immense majorité des cas F&F, un contrat conclu « à
   distance ou hors établissement ».

---

## 2. Ciblage

### 2.1 Quels métiers convertissent le mieux pour un site one-shot

**Avertissement méthodologique** : ni `docs/veille/concurrents.md` ni aucune source trouvée dans ce
dossier ne donne de **taux de conversion par métier** pour la vente d'un site vitrine one-shot — cette
donnée précise n'existe pas publiquement (les agences ne publient pas leur funnel par métier). Ce qui
suit est un **raisonnement**, pas un chiffre sourcé — à traiter comme une hypothèse de ciblage à tester
et affiner avec les vrais chiffres de F&F (§ 5, KPI par métier), pas comme un fait établi.

Trois familles de métiers à prioriser, avec la raison :

1. **Métiers d'urgence** (plombier-chauffagiste, serrurier, couvreur, électricien dépannage) — le
   registre « urgence » de `docs/REDACTION.md` § 4. Raisonnement : la décision d'achat du client final
   se prend en quelques minutes au moment du problème, sur la base de ce qu'il trouve en ligne
   immédiatement — l'absence de site (ou un site absent de la fiche Google) coûte cher tout de suite,
   ce qui rend l'argument de vente concret et facile à chiffrer avec l'artisan pendant l'appel
   (§ 4, ancrage prix).
2. **Métiers où le rendu visuel vend** (menuisier-ébéniste, ferronnier d'art, paysagiste, photographe de
   mariage, architecte d'intérieur, traiteur) — un portfolio soigné est directement ce qui convainc un
   client final d'acheter ; ces artisans ont donc une motivation forte et un matériau réel (photos de
   réalisations) pour un site qui vend, ce qui facilite aussi la collecte du brief (`docs/BRIEF.md` § 8).
3. **Métiers déjà présents sur Facebook/Instagram mais sans site** — signal d'appétence numérique déjà
   là : on ne convainc pas quelqu'un de passer au numérique, seulement de passer à un support qui lui
   appartient et qui référence mieux (argument direct de `docs/veille/concurrents.md` § 4, point 2).

À éviter en priorité de prospection (pas à exclure, juste pas prioritaire pour un cycle de vente court
et un discours volume) : les **professions réglementées** (avocat, vétérinaire, kiné, ostéopathe) —
cycle de décision plus long, contraintes de communication fortes (`docs/REDACTION.md` § 3) qui rallongent
l'appel de découverte, et un volume de prospects par ville plus faible que pour les métiers du bâtiment
ou du commerce.

Les chiffres génériques déjà présents dans `scrapping_artisans/docs/Guide_Commercial_Sites_Artisans.md`
(« 87 % des clients recherchent un artisan sur internet avant de l'appeler », « 46 % des recherches
Google ont une intention locale », « 78 % des recherches mobiles locales mènent à un achat ») **ne sont
pas sourcés dans ce document interne** — à ne jamais citer tels quels dans un argumentaire écrit ou oral
tant qu'une source vérifiable n'a pas été retrouvée (même règle que pour un avis client, `CLAUDE.md`
règle 2 : rien d'invérifiable ne se présente comme un fait). Ils restent utilisables comme intuition de
travail interne, pas comme argument face à un prospect.

### 2.2 Signaux d'un bon prospect

Dans l'ordre où les vérifier sur une fiche Google Maps (le scraper de `scrapping_artisans` capture déjà
`site_web`, `note`, `nombre_avis`) :

1. **Fiche Google Business Profile sans site web renseigné**, ou un lien Facebook/Instagram à la place —
   signal le plus fort, déjà la logique de priorité de `whatsapp/templates.py` (`reputation_no_site`
   priorité 100).
2. **Note ≥ 4,0 et un nombre d'avis conséquent** (≥ 5-10) — l'artisan a une activité réelle et un
   historique de clients satisfaits ; l'écart entre cette réputation et l'absence de site est
   l'argument le plus direct (« vous avez X avis et pourtant... »).
3. **Site existant mais manifestement daté** (design années 2000-2010, pas de version mobile, pas de
   HTTPS, aucune mise à jour visible) — argument de mise à niveau plutôt que de création, cycle de vente
   parfois plus long (il faut convaincre d'abandonner un actif existant, cf. objection concurrents.md
   « je fonctionne déjà avec un site »).
4. **Zone géographique couverte réellement par l'atelier** — pas de contrainte de proximité physique
   (le travail est à distance, `docs/PROCESS.md`), mais une zone cohérente facilite les exemples locaux
   dans les messages (« un {metier} à {ville} ») et la crédibilité perçue.
5. **Activité visiblement en cours** (avis récents, horaires à jour) — éviter les fiches à l'abandon
   (dernier avis vieux de plusieurs années), signal fréquent d'une activité arrêtée ou très ralentie.

### 2.3 Volume : mathématique du tunnel

**Aucun repère chiffré spécifique à la vente de sites one-shot à des artisans (France) n'a pu être trouvé
et vérifié cette session** (budget `WebSearch` épuisé avant que cette section soit atteinte — voir
l'avertissement en tête de document). Les ordres de grandeur ci-dessous sont donc des **repères généraux
et larges de prospection B2B sortante**, à corriger avec les vrais chiffres de F&F dès les premières
semaines (§ 5, KPI hebdomadaires) plutôt qu'à traiter comme une prévision fiable :

| Étape | Ordre de grandeur généralement observé en prospection B2B sortante (repère large, à vérifier avec les chiffres réels de F&F) |
|---|---|
| Contacts envoyés (e-mail + WhatsApp/SMS + appels combinés) | base 100 % |
| Réponses obtenues (positives + négatives + désinscriptions) | une fraction à un chiffre du total pour l'e-mail froid seul ; sensiblement plus haute pour un message WhatsApp/SMS court et personnalisé, dont le taux d'ouverture est structurellement très supérieur à l'e-mail |
| RDV téléphoniques de 15 minutes obtenus | une fraction des réponses positives, après une ou deux relances |
| Devis envoyés | la quasi-totalité des RDV qui aboutissent à un accord de principe sur le prix |
| Ventes signées (devis + acompte) | une fraction des devis envoyés, sous 48h-15 jours selon la relance |

**Cette section sera précisée avec des sources chiffrées citées dès qu'une recherche web pourra être
relancée** (quota `WebSearch` de session, ou une session future) — ne pas construire un prévisionnel de
chiffre d'affaires sur ces ordres de grandeur non sourcés. En attendant, la seule donnée fiable est celle
que F&F produira elle-même (§ 5) : suivre les taux réels semaine après semaine plutôt que de partir d'un
objectif théorique.

### 2.4 Cadence hebdomadaire pour une personne seule

Proposition de répartition pour ~100 contacts/semaine (un chiffre rond de départ, à ajuster à la baisse
les premières semaines et à la hausse une fois les templates rodés — voir § 5 pour le suivi qui permettra
de corriger ce nombre avec des données réelles) :

| Jour | Activité | Volume indicatif |
|---|---|---|
| Lundi | Scraping/qualification de nouveaux prospects (`scrapping_artisans`), préparation des messages | — |
| Lundi-mardi | Premiers contacts WhatsApp/e-mail (§ 3, templates 1-6) | ~40-50 contacts |
| Mercredi | Relances J+3 des prospects contactés la semaine précédente | selon volume de la semaine -1 |
| Jeudi | Premiers contacts (suite) + appels de découverte (15 min, § 4) pour les réponses positives | ~30-40 contacts + appels du jour |
| Vendredi | Relances J+10, envoi des propositions (§ 6) aux prospects brief terminé, suivi CRM (§ 5) | — |

La règle n'est pas le volume brut mais la **personnalisation minimale** de chaque premier message (ville,
métier, note/avis réels du prospect — jamais un envoi groupé identique) : c'est ce qui distingue cette
approche d'un mass-mailing et ce qui limite le risque de signalement WhatsApp (§ 1.2). Un rythme plus
lent mais tenu chaque semaine bat un pic ponctuel suivi d'un trou de plusieurs semaines — la relance
(§ 3, J+3/J+10) ne fonctionne que si elle est right on time.

---

## 3. Messages

Douze modèles : 3 premiers messages WhatsApp par registre de métier (`docs/REDACTION.md` § 4), 3 premiers
e-mails par registre, une relance J+3, une relance J+10, un message après rendez-vous manqué, un message
d'envoi des trois propositions, un message de livraison, un message de demande d'avis à J+30. Toutes les
variables entre accolades viennent de la fiche Google Maps du prospect (`scrapping_artisans`) ou du CRM
(§ 5) — jamais une valeur inventée si le champ est vide (même règle que `docs/BRIEF.md`, adaptée à la
prospection : si la note ou le nombre d'avis manquent, retirer la mention plutôt que l'approximer, sur le
modèle déjà en place dans `whatsapp/templates.py`).

### Ce qui change par rapport à `scrapping_artisans/templates_whatsapp.txt` — et pourquoi

- **Signature `{prenom}` au lieu de « Anthony » en dur.** Le studio compte deux fondateurs qui peuvent
  tous les deux prospecter — un prénom figé dans le texte source empêche l'autre de l'utiliser sans le
  modifier à la main à chaque envoi.
- **Suppression de la formule « vous n'êtes pas apparu en haut des résultats ».** C'est une affirmation
  qu'on ne peut pas vérifier depuis une fiche Google Maps consultée hors contexte de recherche réelle du
  prospecteur — proche d'une allégation invérifiable, à éviter par le même principe que la règle « rien
  d'invérifiable ne se présente comme un fait » (`CLAUDE.md` règle 2, étendue ici à la prospection).
  Remplacée par des faits strictement vérifiables : absence de site, note et nombre d'avis réels.
- **Correction du discours de paiement.** L'ancien texte (« vous payez une seule fois, quand le site est
  prêt ») contredit le fonctionnement réel du studio, où un **acompte** de 50 % est dû à la signature du
  devis et le solde à la livraison (`studio/juridique/JURIDIQUE.md` § 7) — un prospect qui retiendrait cette phrase
  littéralement se sentirait trompé au moment du devis. Remplacé par « en une fois, {prix} €, sans
  abonnement » : vrai dans tous les cas, sans préciser un calendrier de paiement qui n'est pas encore
  arrêté à ce stade de la conversation.
- **Messages nettement raccourcis** (≤ 400 caractères, contre 500-650 caractères avec liste à puces pour
  les anciens templates). Sur WhatsApp, un premier message court et sans mise en forme complexe se lit
  en entier sur l'écran de verrouillage — une liste à puces dans un message froid signale un
  copier-coller de masse plutôt qu'une prise de contact personnelle.
- **Ajout d'une mention de désinscription** (« Répondez STOP pour ne plus être contacté(e) ») — absente
  des anciens templates, ajoutée pour la conformité (§ 1.7, point 2) et pour réduire le risque de
  signalement WhatsApp (§ 1.2).
- **Trois variantes par registre de métier plutôt que par signal technique du prospect** (site absent /
  Facebook / site classique). Le choix automatique par signal reste pertinent pour la sélection du
  template (`whatsapp/templates.py` peut continuer à trancher selon `site_web`/`note`/`nombre_avis`),
  mais la personne qui écrit et adapte le message à la main gagne davantage à parler le registre du
  métier (urgence / rendez-vous / commerce, `docs/REDACTION.md` § 4) qu'à mentionner la plateforme
  actuelle du prospect.

### WhatsApp — premier contact (3 variantes)

**WA-1 — registre urgence** (plombier-chauffagiste, serrurier, couvreur, électricien dépannage) — 374
caractères :

> Bonjour, je cherchais un {metier} à {ville} et je suis tombé sur la fiche Google de {entreprise}
> ({note}/5, {avis} avis) — pas de site. Sur un métier d'urgence, l'appel manqué part chez le concurrent
> qui apparaît. Sites artisans en une fois, {prix} €, sans abonnement. Exemple : {lien}. 5 min pour en
> parler ? — {prenom}, Finck & Fisch. STOP pour ne plus être contacté(e).

**WA-2 — registre rendez-vous** (coiffeur/barbier, institut de beauté, vétérinaire, coach, auto-école...)
— 368 caractères :

> Bonjour, je suis tombé sur la fiche Google de {entreprise} en cherchant un {metier} près de {ville}.
> Belle note ({note}/5, {avis} avis) mais pas de site pour l'accueillir. Je fais des sites sur mesure
> pour des artisans, prix fixe {prix} €, aucun abonnement. Exemple : {lien}. Intéressé(e) d'en voir un ?
> — {prenom}, Finck & Fisch. STOP pour ne plus être contacté(e).

**WA-3 — registre commerce** (fleuriste, boulanger-pâtissier, menuisier-ébéniste, traiteur, garagiste...)
— 318 caractères :

> Bonjour, en cherchant un {metier} vers {ville} je suis tombé sur {entreprise} ({note}/5, {avis} avis) —
> pas de site pour le moment. Je conçois des sites pour des artisans, une fois, {prix} €, sans abonnement
> mensuel. Un exemple : {lien}. Ça vous parle ? — {prenom}, Finck & Fisch. STOP pour ne plus être
> contacté(e).

*Si `{note}`/`{avis}` sont vides (prospect sans avis Google), retirer la mention entre parenthèses plutôt
que de laisser un champ vide affiché — logique déjà implémentée dans `whatsapp/templates.py::build_message`.*

### E-mail — premier contact (3 variantes)

**E-mail-1 — registre urgence** :

> **Objet** : Votre fiche Google {entreprise} vue en cherchant un {metier} à {ville}
>
> Bonjour,
>
> Je suis tombé sur votre fiche Google en cherchant un {metier} à {ville} : {note}/5, {avis} avis, mais
> pas de site pour l'instant.
>
> Je conçois des sites vitrines pour des artisans comme vous — un seul règlement, {prix} €, aucun
> abonnement, le site vous appartient dès le premier jour. Livré en 72h une fois les informations
> reçues.
>
> Un exemple récent : {lien}.
>
> Si ça vous intéresse, je peux vous appeler 15 minutes cette semaine.
>
> Cordialement,
> {prenom} {nom} — Finck & Fisch
> {telephone} — {email}
>
> *Vous pouvez vous désinscrire à tout moment en répondant « stop » à ce message.*

**E-mail-2 — registre rendez-vous** :

> **Objet** : {entreprise} sur Google — un site pour transformer les visites en appels
>
> Bonjour,
>
> En cherchant un {metier} près de {ville}, je suis tombé sur votre fiche Google ({note}/5, {avis}
> avis). Vous n'avez pas encore de site qui présente vos prestations aux personnes qui hésitent encore.
>
> Je fais des sites vitrines pour artisans, en une fois ({prix} €, sans abonnement), livrés en 72h. Le
> site vous appartient, pas de ligne récurrente cachée.
>
> Exemple de réalisation : {lien}.
>
> Deux minutes au téléphone pour en parler ?
>
> Bien à vous,
> {prenom} {nom} — Finck & Fisch
> {telephone} — {email}
>
> *Désinscription à tout moment en répondant à ce message.*

**E-mail-3 — registre commerce** :

> **Objet** : Un site pour {entreprise}, sans abonnement
>
> Bonjour,
>
> Je travaille avec des artisans de {ville} pour leur créer un site simple et efficace : présentation
> des services, formulaire de devis, optimisé pour apparaître sur Google localement.
>
> Contrairement à la plupart des offres du marché, c'est un tarif fixe payé une fois ({prix} €), pas un
> abonnement mensuel — et le site vous appartient dès la livraison.
>
> Un exemple pour un métier proche du vôtre : {lien}.
>
> Si vous êtes ouvert à en discuter 15 minutes, dites-moi le meilleur moment.
>
> Cordialement,
> {prenom} {nom} — Finck & Fisch
> {telephone} — {email}
>
> *Vous pouvez vous désinscrire à tout moment en répondant à ce message.*

### Relance J+3 (241 caractères)

> Bonjour, je vous ai écrit il y a quelques jours au sujet d'un site pour {entreprise}. Pas de souci si
> ce n'est pas le bon moment — je voulais juste savoir si vous aviez eu l'occasion de regarder l'exemple
> ({lien}) ? — {prenom}, Finck & Fisch

### Relance J+10 (239 caractères)

> Bonjour, dernier message de ma part : je reste disponible si un site pour {entreprise} vous intéresse
> un jour, sans urgence de ma part. Si ce n'est jamais le bon moment, dites-le-moi et je ne vous
> recontacte plus. — {prenom}, Finck & Fisch

### Après un rendez-vous manqué (207 caractères)

> Bonjour, je n'ai pas réussi à vous joindre à l'heure prévue, pas grave. Voulez-vous qu'on recale un
> créneau de 15 minutes cette semaine ? Dites-moi simplement quand ça vous arrange. — {prenom}, Finck &
> Fisch

### Envoi des trois propositions (308 caractères)

> Bonjour {prenom_client}, voici les trois propositions pour le site de {entreprise} : {lien1}, {lien2},
> {lien3}. Elles sont valables 48h — passé ce délai, dites-moi si vous avez besoin de plus de temps.
> Dites-moi celle qui vous parle, ou ce qui vous plaît dans chacune, et on ajuste. — {prenom}, Finck &
> Fisch

### Livraison (265 caractères)

> Bonjour {prenom_client}, votre site est en ligne : {url}. Vous avez deux semaines pour me signaler
> toute correction de texte, photo ou coordonnée — j'ajuste sans frais supplémentaire pendant cette
> période. Dites-moi ce que vous en pensez ! — {prenom}, Finck & Fisch

### Demande d'avis à J+30 (300 caractères)

> Bonjour {prenom_client}, ça fait un mois que le site de {entreprise} est en ligne. J'espère qu'il vous
> ramène des demandes. Si vous êtes satisfait(e), un avis Google sur mon travail m'aiderait beaucoup :
> {lien_avis}. Et si quelque chose ne va pas, dites-le-moi directement. — {prenom}, Finck & Fisch

---

## 4. Script d'appel (15 minutes)

Aligné sur `docs/BRIEF.md` (support de l'appel une fois le prospect chaud) et
`docs/PROCESS.md` § 2. Ce script couvre la phase **avant** le brief détaillé — convaincre, cadrer le prix,
clore — pas la collecte des informations elle-même (`docs/BRIEF.md` prend le relais dès que le prospect
dit oui).

### Ouverture (30 secondes)

> « Bonjour {prenom_client}, c'est {prenom} de Finck & Fisch. Je vous appelle parce que je suis tombé sur
> la fiche Google de {entreprise} en cherchant un {metier} à {ville} — [si avis réels] vous avez {note}/5
> avec {avis} avis, c'est du sérieux. Je crée des sites pour des artisans comme vous, ça vous prend deux
> minutes que je vous explique ? »

Si « non, pas le temps » : « Pas de souci, je vous envoie un message avec un exemple, vous regardez
quand vous voulez » → bascule sur le message « exemple » (WA/e-mail § 3), ne pas insister au téléphone.

### Découverte (5 questions, ~4 minutes)

1. « Vous avez un site aujourd'hui ? Si oui, depuis quand, et vous en êtes content(e) ? »
2. « Comment vos nouveaux clients vous trouvent en ce moment — bouche-à-oreille, Google, réseaux ? »
3. « Vous êtes satisfait(e) du nombre de demandes que vous recevez ? »
4. « Quand quelqu'un tape "{metier} {ville}" sur Google, à votre avis, vous apparaissez où ? »
5. « Vous avez déjà des photos de vos réalisations, un logo, des avis Google qu'on pourrait citer ? »

La cinquième question sert double emploi : elle qualifie le prospect (a-t-il du matériau exploitable
pour un site, `docs/BRIEF.md` § 8) et amorce déjà la transition vers le brief si l'appel se poursuit.

### Le pitch « trois propositions » (2 minutes)

> « Ce qu'on fait, c'est différent de la plupart des offres que vous avez pu voir : plutôt que de vous
> montrer une seule maquette, on vous livre **trois propositions différentes**, trois styles, avec un
> vrai aperçu du site — pas un mockup, une vraie page que vous pouvez ouvrir sur votre téléphone. Vous
> choisissez celle qui vous plaît, ou on prend un peu de chacune, et on finalise à partir de là. C'est ce
> qui nous distingue d'un site fait à la chaîne : vous avez le choix dès le départ, pas une maquette
> unique à prendre ou à laisser. »

### Ancrage prix (1-2 minutes)

> « Pour un site comme le vôtre, comptez entre {1 200} et {1 800} euros — le prix exact dépend du nombre
> de pages et de services à présenter, je vous le confirme après notre échange. C'est **une seule fois**,
> pas d'abonnement mensuel, jamais. Le site vous appartient dès la livraison — le nom de domaine est à
> votre nom, le code du site aussi, vous n'êtes attaché à rien chez nous après coup. »

Note : les montants 1 200 €/1 800 € sont ceux fixés dans `studio/juridique/JURIDIQUE.md` § 0 — à date, `OBJECTIF.md`
critère 12 signale que les prix affichés sur `sites/finck-fisch/sections/Offre.astro` restent marqués
`// PRIX PROVISOIRES` en attente d'une décision définitive des fondateurs. Mettre à jour ce script dès
que le prix est arrêté.

### Clôture (1-2 minutes)

Si intéressé(e) :

> « Parfait. Pour avancer, je vous envoie un devis par e-mail dans la journée, avec le détail et le prix
> exact. Il suffit de me répondre "bon pour accord" pour valider, et un acompte de 50 % pour lancer la
> production — le reste à la livraison. Une fois le devis signé et l'acompte reçu, je vous recontacte
> pour le brief complet, ça prend 15 minutes, et le site est en ligne 72h après que vous m'ayez envoyé vos
> photos et informations. »

Si hésitant(e) :

> « Je comprends, prenez le temps. Je vous envoie quand même un exemple pour un {metier} — comme ça vous
> voyez concrètement le rendu. Je vous relance dans quelques jours, ça vous va ? »

**Rappel obligatoire pour tout devis conclu par téléphone/à distance** (`studio/juridique/JURIDIQUE.md` § 6.2) : le
devis envoyé après cet appel doit comporter la case de demande expresse d'exécution avant la fin du délai
de rétractation de 14 jours, si le client a ≤ 5 salariés — sans quoi la promesse « en ligne 72h après »
n'est pas sécurisée juridiquement.

### Les 8 objections (rewrites parlées, source `docs/veille/concurrents.md` § 4)

| Objection (telle qu'un artisan la formule au téléphone) | Réponse parlée |
|---|---|
| « Un abonnement à 30-40 € par mois, c'est quand même moins cher qu'un site à plus de mille euros d'un coup, non ? » | « Sur trois ans, un abonnement à 79 € par mois, ça fait déjà plus de 2 800 € — et à la fin, le site ne vous appartient pas, il s'arrête si vous arrêtez de payer. Notre prix fixe, souvent moins cher sur la durée, et le site est à vous dès le premier jour. » |
| « Comment je sais que ça va bien référencer sur Google ? » | « Honnêtement, personne ne peut vous garantir une première place, ce serait mentir. Ce qu'on garantit, c'est un site techniquement propre — rapide, bien structuré, avec votre zone et votre métier bien indiqués pour Google. Après, le référencement se travaille dans la durée, avec ou sans nous. » |
| « Vous n'êtes que deux, c'est risqué si vous arrêtez un jour. » | « C'est justement pour ça que le site est un fichier standard, pas lié à un logiciel à nous — n'importe quel développeur peut le reprendre. Contrairement à un site fait sur Wix ou chez une plateforme par abonnement, qui disparaît si l'abonnement s'arrête. » |
| « Pourquoi pas Wix ou Hostinger à quelques euros par mois, ça a l'air suffisant ? » | « Ces outils-là vendent un logiciel, pas un résultat — il faut apprendre à s'en servir pour obtenir un site qui ressemble à des milliers d'autres. Nous, on vous livre le résultat fini, en 72h, sans que vous ayez à y toucher. » |
| « 72 heures, c'est trop rapide pour être vraiment sur mesure, c'est un template ? » | « C'est un système de composants qu'on assemble et qu'on adapte à vous — pas un thème universel. D'ailleurs, c'est pour ça qu'on vous montre trois propositions différentes dès le départ, pas une seule maquette. » |
| « Et si je veux changer un truc dans deux ans, il faut repasser par vous ? » | « Non — le code vous appartient et n'est lié à aucun logiciel chez nous. N'importe quel développeur peut reprendre le site à ce moment-là, même si ce n'est pas nous. » |
| « Vous garantissez quoi si je ne suis pas satisfait ? » | « On vous garantit le délai — livré dans les temps convenus — et deux semaines de corrections gratuites après la mise en ligne pour ajuster texte, photos, coordonnées. Ce qu'on ne fait pas, c'est promettre un résultat commercial qu'on ne maîtrise pas entièrement — aucun prestataire sérieux ne peut le faire. » |
| « Pourquoi pas une agence locale, au moins j'ai quelqu'un à voir en vrai ? » | « On peut tout à fait se voir ou faire un appel vidéo, comme une agence locale — sans la structure (les réunions, les intermédiaires) qui fait souvent doubler ou tripler le prix pour un résultat comparable sur un simple site vitrine. » |

---

## 5. Suivi — CRM minimal

`scrapping_artisans/whatsapp_database` couvre déjà la phase de **prospection pure** (avant premier
contact jusqu'à la réponse — colonnes `message_envoye`, `a_repondu`, `statut_reponse` avec les valeurs
`acceptation` / `off` / `en_cours` / `a_relancer`, voir `whatsapp_database/models.py`). Il ne couvre pas
la suite (RDV, devis, production, livraison) : ce tableau est un pont simple entre les deux, en
feuille de calcul (Google Sheets/Excel) tant que le volume ne justifie pas un outil dédié.

### Colonnes

| Colonne | Valeurs / format | Source |
|---|---|---|
| `entreprise` | texte | fiche Google Maps |
| `metier` | texte | fiche Google Maps |
| `ville` | texte | fiche Google Maps |
| `telephone` | texte | fiche Google Maps |
| `whatsapp_dispo` | oui/non | mobile 06/07 vs fixe 01-05, logique déjà dans `README_WHATSAPP.md` |
| `email` | texte | fiche Google Maps, site actuel, ou LinkedIn |
| `lien_fiche_google` | URL | fiche Google Maps |
| `note` / `nombre_avis` | nombre / nombre, vide si absent | fiche Google Maps, jamais approximé |
| `source` | `scraping_gmb` / `recommandation` / `linkedin` / `demarchage_physique` / `autre` | manuel |
| `canal_premier_contact` | `whatsapp` / `email` / `telephone` / `linkedin` / `physique` | manuel |
| `date_premier_contact` | date | manuel |
| `statut` | voir liste ci-dessous | manuel |
| `prochaine_action` | texte court | manuel |
| `date_prochaine_action` | date | manuel — pilote les relances § 3 |
| `date_dernier_contact` | date | manuel — point de départ du délai RGPD de 3 ans, § 1.5 |
| `montant_devis` | nombre, € | manuel, une fois le devis envoyé |
| `date_devis_envoye` / `date_devis_signe` | date | manuel |
| `date_acompte_recu` | date | manuel — jamais de production avant cette date (`docs/PROCESS.md` § 9) |
| `date_livraison` | date | manuel |
| `avis_demande` | oui/non | manuel — coche au moment de l'envoi du template J+30 |
| `notes` | texte libre | manuel |

**Valeurs de `statut`** (pipeline complet, du premier contact à la clôture) : `nouveau` → `contacte` →
`relance_j3` → `relance_j10` → `rdv_programme` → `rdv_fait` → `devis_envoye` → `devis_signe` →
`en_production` → `livre` → `facture_soldee` → `perdu` (avec une sous-note dans `notes` sur la raison :
prix, timing, pas de réponse après relance J+10, etc.).

### KPI à suivre chaque semaine

| KPI | Calcul | Ce qu'il révèle |
|---|---|---|
| Contacts envoyés | nombre de `date_premier_contact` dans la semaine | tient la cadence (§ 2.4) |
| Taux de réponse | réponses ÷ contacts envoyés | qualité du ciblage (§ 2.2) et des messages (§ 3) |
| RDV programmés | nombre de `rdv_programme` | efficacité de la relance |
| Taux de présence au RDV | `rdv_fait` ÷ `rdv_programme` | fiabilité du créneau proposé, utilité du rappel avant l'appel |
| Devis envoyés | nombre de `devis_envoye` | conversion de l'appel (§ 4) |
| Taux de closing | `devis_signe` ÷ `devis_envoye` | qualité de l'ancrage prix et de la clôture |
| CA signé | somme de `montant_devis` pour `devis_signe` dans la semaine | résultat direct |
| Délai moyen contact → signature | moyenne de `date_devis_signe` − `date_premier_contact` | longueur réelle du cycle de vente, à comparer aux hypothèses du § 2.3 |
| Avis collectés | nombre de réponses positives au template J+30 | boucle de preuve sociale pour les futurs prospects (`docs/veille/concurrents.md` § 5, widget d'avis) |

Ces KPI remplacent directement les ordres de grandeur non sourcés du § 2.3 une fois quelques semaines de
données réelles accumulées — c'est la meilleure source disponible, plus fiable qu'un benchmark externe
non spécifique au métier de F&F.

---

## 6. Propositions et devis

### Les trois propositions

`node scripts/ff.mjs propositions <slug>` construit automatiquement plusieurs looks différents à partir
d'un même `site.config.ts` (voir `CLAUDE.md`, section « Workflows en une commande ») : chaque proposition
est un vrai rendu du site (pas un mockup statique), servie depuis `propositions/<slug>/index.html`, avec
ses propres captures d'écran pour un aperçu rapide sans ouvrir chaque lien.

Déroulé recommandé :

1. Une fois le brief reçu et validé (`docs/PROCESS.md` § 3), générer les propositions avant même que le
   devis soit signé **si le studio choisit de les utiliser comme argument de vente pré-signature** — ou
   après acompte reçu si le studio préfère réserver l'effort de production à un engagement déjà pris
   (arbitrage commercial, pas une règle technique : `docs/PROCESS.md` § 9 n'impose la règle « jamais de
   production sans devis signé + acompte reçu » qu'à partir de l'étape « jour de production » § 4, pas à
   la génération de propositions de style qui peut être plus légère).
2. Envoyer le template « Envoi des trois propositions » (§ 3) avec les trois liens.
3. **Validité 48h** : au-delà, le studio n'est plus engagé sur cette version exacte des propositions (les
   directions/variantes de la bibliothèque évoluent d'un client à l'autre, `docs/OBJECTIF.md` critère 1) —
   la mention de validité protège aussi contre une réponse tardive qui arriverait après que d'autres
   choix de conception aient été faits pour un autre client entretemps.
4. Le choix du client (ou un mélange de plusieurs propositions) devient la base de la version finale,
   ajustée pendant la production (`docs/PROCESS.md` § 4).

### L'acompte

50 % à la signature du devis, solde à la livraison — c'est un **acompte**, pas des arrhes, qualifié
explicitement comme tel dans le devis (`studio/juridique/JURIDIQUE.md` § 7 : la qualification écrite protège le
studio, l'absence de précision jouerait en sa défaveur). Rappel dur déjà en place dans
`docs/PROCESS.md` § 9 : **jamais de production sans devis signé et acompte reçu**.

### La signature — un devis signé par e-mail suffit-il ?

**Oui, dans la grande majorité des cas, avec une nuance sur la solidité de la preuve.** En droit français,
le contrat entre professionnels n'est soumis à aucune forme particulière (principe du consensualisme,
Code civil) : un échange d'e-mails où le client répond « bon pour accord » avec son nom, ou renvoie le PDF
du devis annoté de cette mention, constitue une acceptation valable qui forme le contrat. Sur le plan de
la **preuve** en cas de litige, le Code civil (art. **1366-1367**) reconnaît l'écrit électronique et la
signature électronique à condition que la personne dont elle émane puisse être dûment identifiée et que
l'écrit soit établi et conservé dans des conditions de nature à en garantir l'intégrité — un e-mail simple
remplit ces conditions de façon raisonnable (l'adresse e-mail identifie l'expéditeur, la conversation est
archivée) mais offre une preuve plus faible qu'une signature électronique qualifiée (solution dédiée type
Yousign, DocuSign) en cas de contestation frontale par le client. ⚠ Ce point n'a pas pu être re-vérifié
par une recherche ou un `WebFetch` direct cette session (plusieurs tentatives sur service-public.fr et
Légifrance ont échoué en 404) — il s'appuie sur la connaissance générale stable de ces articles, déjà
cités dans `studio/juridique/JURIDIQUE.md` § 5.3.1 pour la cession de droits d'auteur (même logique de fiabilité de la
preuve électronique). **À faire confirmer par le professionnel du droit qui doit relire `studio/juridique/JURIDIQUE.md`
et les modèles `studio/juridique/modeles/*.md`** avant un usage à volume — recommandation pratique en attendant :
- pour un devis simple, l'e-mail avec « bon pour accord » explicite suffit (pratique courante, largement
  utilisée dans le secteur des prestations de service B2B) ;
- si le volume de ventes grandit, ou en cas de doute sur un client précis, passer par une solution de
  signature électronique dédiée coûte peu et sécurise la preuve — à arbitrer une fois que le rythme de
  signature le justifie (pas une urgence de démarrage) ;
- dans tous les cas, joindre le formulaire type de rétractation et la case de demande expresse
  d'exécution anticipée (`studio/juridique/JURIDIQUE.md` § 6.2) à l'envoi du devis, quel que soit le mode de
  signature retenu.

---

## 7. Sources

**Cadre légal (§ 1)** :
- [CNIL — La prospection commerciale par courrier électronique](https://www.cnil.fr/fr/la-prospection-commerciale-par-courrier-electronique) — consulté par `WebFetch` direct le 17 septembre 2026 (§ 1.1, opt-out, identification de l'expéditeur, adresses génériques vs nominatives).
- Code des postes et des communications électroniques, art. **L34-5** (prospection par voie électronique, base légale de l'exception B2B pour e-mail et, par extension générale non re-vérifiée cette session, SMS — § 1.1-1.2).
- Code de la consommation, art. **L223-1** et s. (Bloctel, dispositif consommateurs — § 1.3, ⚠ non re-confirmé par fetch direct cette session).
- `studio/juridique/JURIDIQUE.md` § 6.2 (article L221-3 du Code de la consommation, exception de rétractation pour les clients professionnels ≤ 5 salariés — reprise intégralement pour le cadre de prospection, § 1 et § 4 de ce document).
- `studio/juridique/JURIDIQUE.md` § 7 (acompte vs arrhes), § 5.3.1 (écrit et signature électroniques, art. 1366-1367 du Code civil — repris ici pour la question du devis signé par e-mail, § 6).
- Doctrine CNIL sur la durée de conservation des données de prospection (3 ans après le dernier contact) — ⚠ non re-confirmée par une page CNIL rouverte en direct cette session, budget `WebSearch` épuisé ; à revérifier sur [cnil.fr](https://www.cnil.fr/) avant d'en faire une politique de purge automatisée.
- WhatsApp Business Policy (Meta) — cadre contractuel distinct du RGPD pour l'envoi de messages non sollicités — ⚠ non re-vérifié en direct cette session, mentionné comme risque opérationnel connu du secteur (§ 1.2).

**Ciblage et positionnement (§ 2)** :
- `docs/veille/concurrents.md` § 4-5 (positionnement F&F, objections, bonnes pratiques concurrentes).
- `docs/REDACTION.md` § 4 (quatre registres de métiers : urgence / rendez-vous / commerce / profession réglementée).
- `scrapping_artisans/docs/Guide_Commercial_Sites_Artisans.md` — chiffres cités mais **non sourcés dans le document d'origine** (87 %, 46 %, 78 %) : à ne pas utiliser tels quels dans un argumentaire commercial tant qu'une source vérifiable n'est pas retrouvée (§ 2.1).

**Messages et outils existants (§ 3, § 5)** :
- `scrapping_artisans/templates_whatsapp.txt` et `scrapping_artisans/whatsapp/templates.py` — base de comparaison pour les 12 nouveaux templates, changements listés en § 3.
- `scrapping_artisans/README_WHATSAPP.md` — horaires d'envoi déjà pratiqués (8h-9h30, 17h-19h), catégorisation des numéros (mobile/fixe), workflow existant.
- `scrapping_artisans/whatsapp_database/models.py` — schéma de la base de prospection existante (`message_envoye`, `a_repondu`, `statut_reponse`), base du CRM du § 5.

**Script d'appel et objections (§ 4)** :
- `docs/BRIEF.md` (structure de l'appel, informations à collecter).
- `docs/PROCESS.md` § 2, § 9 (déroulé de l'appel, parcours documentaire devis/CGV/contrat/PV/facture).
- `docs/veille/concurrents.md` § 4 (tableau des 8 objections, source des réponses réécrites à l'oral).
- `studio/juridique/JURIDIQUE.md` § 0 (fourchette de prix 1 200-1 800 €), § 6.2 (clause de rétractation).
- `sites/finck-fisch/sections/Offre.astro` — prix actuellement marqués `// PRIX PROVISOIRES` (`docs/OBJECTIF.md` critère 12, A1/A2 non tranchés).

**Propositions et devis (§ 6)** :
- `CLAUDE.md` (commande `node scripts/ff.mjs propositions <slug>`).
- `studio/juridique/JURIDIQUE.md` § 7 (acompte), § 5.3.1 (signature électronique, art. 1366-1367 Code civil), § 6.2 (rétractation).

**Volume et benchmarks de prospection (§ 2.3)** : aucune source chiffrée spécifique trouvée et vérifiée
cette session (budget `WebSearch` épuisé avant d'atteindre cette section) — point signalé explicitement
dans le texte plutôt que comblé par un chiffre non sourcé. À compléter en priorité lors d'une prochaine
session disposant d'un budget de recherche web.

---

## Limites de ce document

- Le budget `WebSearch` de la session était épuisé (200/200 recherches) avant la rédaction complète de
  ce document — le § 1 (cadre légal) s'appuie partiellement sur deux `WebFetch` directs aboutis
  (CNIL e-mail B2B) et, pour le reste, sur la connaissance générale stable du droit français de la
  prospection, avec chaque point non re-vérifié explicitement marqué ⚠. Le § 2.3 (volume/benchmarks de
  cold outreach) n'a **aucune source chiffrée vérifiée** — c'est signalé dans le texte plutôt que comblé.
- Comme pour `studio/juridique/JURIDIQUE.md`, ce document n'est pas un avis juridique — une relecture par un
  professionnel du droit avant un usage intensif (volume, campagne automatisée) reste une action humaine
  non faite.
- Les prix cités (1 200-1 800 €) restent provisoires tant que `docs/OBJECTIF.md` critère 12 (A1/A2) n'est
  pas tranché par les fondateurs — ce document devra être mis à jour au même moment que
  `sites/finck-fisch/sections/Offre.astro`.
