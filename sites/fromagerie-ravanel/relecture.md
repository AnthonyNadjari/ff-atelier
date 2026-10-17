# Relecture — fromagerie-ravanel (jamais publié)

Premier test de `/site-final` v3, 16 oct 2026. Deux agents neufs (DA, rédacteur), prompts de
`.claude/skills/site-final/relecteurs/`, barème de confiance et grille à plafonds.

## Tour 1 — 16 oct 2026 — verdict DA : corriger / rédacteur : corriger
Notes : composition 6,5 · usage 7,5 · idée 7 · textes 3 → global 6,55
Plafonds actifs : composition ≤ 6,5 (cartes 28 px et boutons pastille, GOUT § 2) ; textes ≤ 3 (« toute l'année »,
« arrivent jeunes », « retournés à la main » absents du brief).
Constats appliqués :
- DA 1 : e-mail de remplissage retiré (et l'e-mail rendu facultatif dans toute l'usine : schéma, 16 fichiers).
- DA 2 : rayons de la direction terre 20 / 28 px → 4 / 4 px (touche aussi atelier-lecerf et demo-paysagiste).
- DA 3 : rangée de trois « chiffres » de la cave supprimée ; la date à la craie dite dans le texte.
- DA 4 : téléphone et horaire du jour sous le titre au premier écran téléphone.
- DA 5 : la bande du beaufort suit les libellés au téléphone, l'âge suivant dépasse à droite.
- Rédacteur 1 : « Passer, appeler, réserver » → « Pour réserver, appelez la boutique. »
- Rédacteur 2 : la démo le dit, une fois, en pied de page et dans les mentions légales (nouveau réglage
  `legal.demo` de l'usine, pour toutes les démos).
- Rédacteur 3 : ajouts hors brief retirés de la cave.
- Rédacteur 4 : titres avec un verbe (H1, beaufort, cave, réserver).
- Rédacteur 5 : formulaire retiré (`form.provider: 'none'`), tout passe par le téléphone.
Constats écartés : aucun.
Décisions prises pour le fondateur : rayons de terre réduits pour toute la direction (pas seulement ce site).

## Tour 2 — 16 oct 2026 — verdict DA : corriger / rédacteur : corriger
Notes : composition 7 · usage 8 · idée 7 · textes 7,5 → global 7,35 (tour précédent : 6,55)
Plafonds actifs : aucun. Les 10 constats du tour 1 : résolus.
Régressions : H1 sur 4 lignes sur ordinateur, bouton coupé (75) ; horaires en double dans le hero téléphone (50) ;
avis de démo en double sur les mentions légales (75) ; consigne répétée sous le titre du contact (50).
Constats appliqués : les quatre, plus l'accord « demandez-la plus jeune ou plus faite ».

## Tour 3 — 16 oct 2026 — verdict DA : montrer / rédacteur : montrer
Premier essai sans effet (classes Tailwind battues par le style de la section), vu par la passe de verdict ;
refait dans le style de la section et mesuré (1440 px : 3 lignes, bouton à 756 px ; 390 px : bouton à 461 px).
Notes : composition 7,5 · usage 8 · idée 7 · textes 8 → **global 7,6** (tour précédent : 7,35)
Plafonds actifs : aucun. Constats ≥ 75 ouverts : aucun.
À garder (DA) : le premier écran sombre qui dit ce qui se réserve, téléphone au pouce ; le grand « 12 » qu'on fait
glisser à la main, seul effet riche.
Non retenu, sous le seuil : vides avant la FAQ sur ordinateur ; « la date à la craie est dite, pas montrée »
(idée 7 et pas 8 : piste pour une vraie photo du client).

## Tour 4 — 17 oct 2026 (piste A refaite le 16 au soir) — verdict DA : corriger / rédacteur : corriger
Notes DA : composition 7,5 · usage 8 · idée 7,5 ; textes 3 (plafond « donnée sans source » : « intervention sous 48 h »
sur les pages service, texte par défaut du moteur) → sans ce plafond, textes 8.
Constats appliqués :
- Rédacteur 1-3 : `servicePages: false` (le contrat ne prévoit pas de pages service ; elles réintroduisaient le
  surtitre gris, un doublon de description et des liens `/#contact` sans cible). Et dans l'usine : le bandeau CTA
  n'invente plus « sous 48 h » par défaut (`src/sections/Cta/band.astro`, describe de `wording.ctaText`).
- Rédacteur 4 : CREDITS.md vidé, photos cave / beaufort / raclette retirées de la piste A (0 `<img>`) : plus de
  page /credits ni de lien « Crédits photos ».
- Rédacteur 5 + DA 2 : l'origine (« six fermes des Aravis et des Bauges, nommées sur l'ardoise ») dite une fois en
  tête de l'ardoise ; sous chaque fromage, ses seules lignes propres ; consigne « on vous dit comment il se vend ».
- DA 1 : « Toujours ! » n'est plus en jaune (pas d'accent sur un seul mot).
- DA 3 : sur ordinateur la meule part avec la première lettre (`140 + i*110` ms) et l'entrée attend
  `document.fonts.ready` ; vérifié sur `captures/planches/fromagerie-ravanel-film-d.jpg` (script
  `scripts/outils/film-hero-desktop.mjs`).
Non retenu : rien.
Décision prise pour le fondateur : les pages service disparaissent de la piste A (tout est sur l'ardoise).
