# Veille — typographie française et composition web

Septembre 2026. Pourquoi ce document : la typographie est le tell « généré » le plus silencieux.
Un lecteur français repère immédiatement un site mal composé — apostrophe droite, `"guillemets"`,
« urgence? » collé, « 9h30 », « 1200€ » — sans forcément savoir nommer la faute. Aucun de nos
audits (`ff verifier`, `ff detect`, `ff audit-motion`) ne regardait ce point avant le 22 septembre 2026.

Trois volets : **§A** les règles françaises non négociables, **§B** les réglages CSS de composition,
**§C** ce que nos sites faisaient mal, mesuré dans le dépôt.

Mise en œuvre : `src/styles/global.css` bloc « Composition », `scripts/ff/typo.mjs` (`ff typo`),
`docs/CONVENTIONS.md` règle 22.

---

## Sources

### Règles françaises — normatif

1. **Académie française — Questions de langue, « Accentuation des majuscules »**
   https://www.academie-francaise.fr/questions-de-langue
   « En français, l'accent a pleine valeur orthographique. » L'omission sur les capitales
   « ralentit la lecture, fait hésiter sur la prononciation, et peut même induire en erreur ».
   Cite l'Imprimerie nationale et la Pléiade comme modèles.
2. **Orthotypographie — Jean-Pierre Lacroux** (dictionnaire raisonné complet, CC BY-NC-ND)
   https://www.orthotypographie.fr/ — vol. I https://www.orthotypographie.fr/volume-I/index.html —
   vol. II https://www.orthotypographie.fr/volume-II/index.html — PDF intégral
   https://www.orthotypographie.fr/pdf/orthotypo-lacroux.pdf
3. **Lacroux — « Abréviation »** https://www.orthotypographie.fr/volume-I/abreviations-01.html
   La règle-mère : « une abréviation qui n'inclut pas la dernière lettre du mot abrégé prend le
   point abréviatif ». D'où `M.` avec point, `Mme` `Mlle` `Dr` `Vve` sans point.
4. **Lacroux — « Guillemet »** https://www.orthotypographie.fr/volume-II/gallerie-guillemet.html
   Les guillemets droits y sont appelés des « chiures de mouche ». Rejette le panachage
   français/anglais pour distinguer citation et mise en relief.
5. **Lacroux — « Ponctuation »** https://www.orthotypographie.fr/volume-II/point_cardinal-proverbe.html
   Le principe fondateur : les ponctuations **hautes** (`! ? ; :`) appartiennent davantage à la
   phrase qui les précède qu'à celle qui suit ⇒ l'espace **avant** doit être **inférieure** à
   l'espace après. Les ponctuations **basses** (`. ,`) ne prennent rien avant.
6. **OQLF / Vitrine linguistique — Typographie**
   https://vitrinelinguistique.oqlf.gouv.qc.ca/banque-de-depannage-linguistique/la-typographie
7. **OQLF — Espacement avant et après les signes de ponctuation**
   https://vitrinelinguistique.oqlf.gouv.qc.ca/22039/la-typographie/espacement/espacement-avant-et-apres-les-signes-de-ponctuation-et-les-symboles
8. **OQLF — Contextes exigeant une espace insécable**
   https://vitrinelinguistique.oqlf.gouv.qc.ca/24566/la-typographie/espacement/contextes-exigeant-une-espace-insecable
   Liste exhaustive : dates, heures, monnaie, mesures, pourcentages, températures, séparateur de
   milliers, téléphone, code postal, civilité + nom.
9. **OQLF — Espacements dans les nombres**
   https://vitrinelinguistique.oqlf.gouv.qc.ca/25447/la-typographie/nombres/espacements-dans-les-nombres
   Tranches de trois, partie décimale comprise. **Exceptions : années, numéros d'identification,
   codes postaux, adresses.**
10. **OQLF — Abréviation de l'adjectif numéral ordinal**
    https://vitrinelinguistique.oqlf.gouv.qc.ca/24271/les-abreviations-et-les-symboles/les-abreviations/cas-particuliers-dabreviations/abreviation-de-ladjectif-numeral-ordinal
    `1er 1re 2d 2de 2e 3e` ; **`-ème`, `-eme`, `-ième` déconseillés**.
11. **OQLF — Typographie sur le Web**
    https://vitrinelinguistique.oqlf.gouv.qc.ca/25025/banque-de-depannage-linguistique/la-redaction-et-la-communication/redaction-pour-le-web/typographie-sur-le-web
    Alignement à gauche **uniquement** (pas de justification), majuscules continues à proscrire.
12. **Wikipédia — Espace fine insécable** https://fr.wikipedia.org/wiki/Espace_fine_ins%C3%A9cable
    U+202F, `&#8239;` / `&#x202F;`. Devant les ponctuations doubles **sauf le deux-points en France**.
13. **Wikipédia — Espace insécable** https://fr.wikipedia.org/wiki/Espace_ins%C3%A9cable
    U+00A0, `&nbsp;`. Piège : Word convertit l'insécable en espace ordinaire au collage en texte brut.
14. **Wikipédia — Guillemet** https://fr.wikipedia.org/wiki/Guillemet
    « » = U+00AB / U+00BB, séparés du texte par une **insécable** (fine en typographie suisse).
    Second niveau : “ ” (U+201C/U+201D). Citation multi-paragraphes : ouvrant répété à chaque alinéa.
15. **Wikipédia — Apostrophe (typographie)** https://fr.wikipedia.org/wiki/Apostrophe_(typographie)
    Unicode recommande explicitement **U+2019**. Lacroux sur U+0027 : « Ce n'est typographiquement rien. »
16. **Wikipédia — Usage des majuscules en français**
    https://fr.wikipedia.org/wiki/Usage_des_majuscules_en_fran%C3%A7ais
    « Si la première lettre est ligaturée, toute la ligature est en capitale » ⇒ *Œuvre*.
17. **Wikipédia — Tiret** https://fr.wikipedia.org/wiki/Tiret
    Cadratin — U+2014 (incise, dialogue), demi-cadratin – U+2013 (plages, et préféré par Gallimard,
    Le Seuil, Albin Michel pour l'incise), trait d'union U+002D (jamais d'espace autour).
18. **Wikipédia — Points de suspension** https://fr.wikipedia.org/wiki/Points_de_suspension
    Caractère unique … U+2026, **pas d'espace avant**, espace après. **`etc…` est fautif.**
    Coupure de citation : `[…]`.
19. **Wikipédia — Œ** https://fr.wikipedia.org/wiki/%C5%92
    Ligature obligatoire (cœur, œuvre, sœur, bœuf, œil, nœud, vœu), **fautive** dans coefficient,
    moelle, coexister, Goethe, Monroe.
20. **Wikipédia — Conventions typographiques**
    https://fr.wikipedia.org/wiki/Wikip%C3%A9dia:Conventions_typographiques
    Le plus grand corpus francophone appliquant une règle unique.
21. **Wikipédia — Système international d'unités**
    https://fr.wikipedia.org/wiki/Syst%C3%A8me_international_d%27unit%C3%A9s
    Unité séparée de la valeur par une **espace insécable**, sauf angles et degrés d'alcool.
    `25 °C` : l'insécable est **avant le °**, car c'est le mot « degré » qui est abrégé.
22. **Wikipédia — Plan de numérotation en France**
    https://fr.wikipedia.org/wiki/Plan_de_num%C3%A9rotation_en_France
    `01 23 45 67 89`, groupes de deux. Points et traits d'union non recommandés (Arcep/UIT).
23. **Wikipédia — Comparatif des codes typographiques francophones**
    https://fr.wikipedia.org/wiki/Comparatif_des_diff%C3%A9rents_codes_typographiques_francophones
    Suisse : fine partout, `:` compris. Québec : **rien** devant `? ! ;`, insécable devant `:`.
24. **Typographisme — Les espaces typographiques et le web**
    https://typographisme.net/post/Les-espaces-typographiques-et-le-web
    Point décisif : le problème d'affichage de U+202F n'est pas le navigateur mais **la police**.
25. **Typographisme — De la césure et du Web**
    http://typographisme.net/post/De-la-cesure-et-du-Web
26. **Antidote — Pour des espaces insécables impeccables**
    https://www.antidote.info/fr/blogue/enquetes/pour-des-espaces-insecables-impeccables
    Tranche : la fine U+202F est techniquement supérieure mais **moins universellement supportée**.
27. **Saint-loup / french-typography** (plugin Sketch, open source)
    https://github.com/Saint-loup/french-typography
    Automatise les mêmes règles que `ff typo`. **Option U+202F désactivée par défaut** à cause de
    problèmes d'affichage Safari — signal concret sur l'état du support.
28. **Clean ASCII — Espaces insécables : problèmes courants**
    https://www.clean-ascii.fr/blog/espaces-ins%C3%A9cables
    L'insécable casse les CSV, les `.env`, **les e-mails et les URL** ; `trim()` ne la reconnaît pas.
29. **CUY — Orthotypo, ponctuation et espaces** https://cuy.be/orthotypo/orthotypo_ponct_esp.php
    Ligne Lacroux/Imprimerie nationale, plus stricte. Énonce la **« règle du second signe »** :
    quand deux ponctuations se suivent, c'est l'espacement du second qui s'applique.
30. **CUY — Orthotypo, « heure »** https://cuy.be/orthotypo/orthotypo_h_heure.php
    `h` bas de casse même en capitales, sans point, entre deux insécables. `8 h 05` et non `8 h 5` ;
    `8 h` et non `8 h 00`. Le `:` est réservé aux tableaux et aux durées.
31. **Blog du Modérateur — Ponctuation et conventions typographiques**
    https://www.blogdumoderateur.com/regles-ponctuation-typographie/
32. **Conseil de l'Europe — TYPO MÉMO FRANÇAIS (2013)**
    https://www.ecml.at/Portals/1/ECML%20programme/Project%20management/Guidelines%20for%20authors%20of%20ECML%20publications/2014_11_26_CoE_06_Typomemo_FR_2013.pdf
33. **babel-french (LaTeX), Daniel Flipo** — https://texdoc.org/serve/frenchb-doc/0 ·
    https://ftp.math.utah.edu/pub/texlive/Contents/live/texmf-dist/doc/generic/babel-french/frenchb.pdf
    `\selectlanguage{french}` insère **automatiquement** les espaces devant la haute ponctuation :
    la preuve qu'un filtre automatique est la bonne approche, pas la discipline du rédacteur.
34. **Purnelle, Règles et usages de typographie française (ULiège)**
    https://orbi.uliege.be/bitstream/2268/298446/1/R%C3%A8glesTypographiquesSyllabus-Purnelle.pdf
35. **Vincent De Oliveira — N'oubliez pas la propriété CSS `quotes`**
    https://iamvdo.me/blog/n-oubliez-pas-la-propriete-css-quotes
    Pour le français : `quotes: "«\00A0" "\00A0»"` — l'insécable est **dans la déclaration CSS**.
36. **Franck Antoni — Code typographique, HTML et CSS**
    https://franckantoni.com/code-typographique-html-et-css/
    Il n'existe **pas d'entité HTML nommée** pour l'espace fine : `&#8239;` seulement.

> Introuvables malgré recherche : **Alexandre Cros** et **Frédéric Bertrand** cités dans le brief —
> aucun contenu attribuable en ligne. Le PDF IUT Besançon « Règles de typographie française »
> (cours-info.iut-bm.univ-fcomte.fr) refuse les connexions extérieures.

### Composition web — référence

37. **Butterick, Practical Typography — Typography in Ten Minutes**
    https://practicaltypography.com/typography-in-ten-minutes.html
    Les 5 règles qui font 90 % du résultat : corps 15–25 px sur écran, interlignage 120–145 %,
    longueur de ligne 45–90 caractères, pas de police système.
38. **Butterick — Line length** https://practicaltypography.com/line-length.html
    Test pratique : 2 à 3 alphabets bas-de-casse par ligne. Compter en **caractères**, pas en px.
39. **Butterick — Line spacing** https://practicaltypography.com/line-spacing.html
40. **Butterick — Point size** https://practicaltypography.com/point-size.html
41. **Butterick — Straight and curly quotes**
    https://practicaltypography.com/straight-and-curly-quotes.html
    « Les guillemets droits ne devraient jamais, jamais apparaître. » HTML/CSS ne convertit pas seul.
42. **Butterick — Ellipses** https://practicaltypography.com/ellipses.html
    Trois points espacés **peuvent se couper en fin de ligne** : raison technique, pas esthétique.
43. **Butterick — Hyphens and dashes** https://practicaltypography.com/hyphens-and-dashes.html
44. **Butterick — Small caps** https://practicaltypography.com/small-caps.html
    Les fausses petites capitales (capitales réduites) sont « trop hautes, trop maigres ».
45. **Rutter — The Elements of Typographic Style Applied to the Web** http://webtypography.net/
    - **2.1.2 mesure** http://webtypography.net/2.1.2 — **66 caractères idéal**, 45–75 acceptable
      en colonne unique, 40–50 en multicolonne.
    - **2.2.2 rythme vertical** http://webtypography.net/2.2.2
    - **2.4.1 césure** http://webtypography.net/2.4.1 — règle de Bringhurst : **≥ 2 caractères
      derrière, ≥ 3 devant**. Pas plus de 2–3 lignes césurées consécutives.
46. **Rutter — Web Typography (le livre, 2017)** https://book.webtypography.net/
47. **Rutter — « Use of ch unit considered inappropriate »** https://clagnut.com/blog/2432
    ⚠ source clé : `ch` mesure la chasse du glyphe **« 0 »**, pas un caractère moyen. `66ch` ne
    donne pas 66 caractères. Recommande `rem`.
48. **Meyer — What is the CSS `ch` unit?**
    https://meyerweb.com/eric/thoughts/2018/06/28/what-is-the-css-ch-unit/
    Conversion pratique : pour ~80 caractères, viser **~60ch**. `ch` n'est pas comparable entre fontes.
49. **Pimp my Type — The ideal line length & line height**
    https://pimpmytype.com/line-length-line-height/
    60–80 caractères. Interligne 1,5–1,6 en colonne large, 1,3–1,45 en colonne étroite, ~1,1 titres.
    Principe : *lignes longues = plus d'interligne*.
50. **Utopia.fyi** https://utopia.fyi/ — échelles fluides par interpolation `clamp()`.
51. **Smashing — Modern Fluid Typography Using CSS Clamp**
    https://www.smashingmagazine.com/2022/01/modern-fluid-typography-css-clamp/
    **Piège WCAG 1.4.4** : un `vw` pur ignore le zoom texte. Toujours une part en `rem`.
    Compléments : https://www.smashingmagazine.com/2023/11/addressing-accessibility-concerns-fluid-type/ ·
    https://www.smashingmagazine.com/2021/04/designing-developing-fluid-type-space-scales/
52. **Ahmad Shadeed — CSS text-wrap: balance**
    https://ishadeed.com/article/css-text-wrap-balance/
    Effet de bord : `balance` ne change pas la largeur de la boîte, d'où un **grand blanc à droite**.
53. **WebKit — Better typography with text-wrap: pretty**
    https://webkit.org/blog/16547/better-typography-with-text-wrap-pretty/
    ⚠ source clé : **Chromium n'optimise que les 4 dernières lignes, WebKit tout le paragraphe.**
    Coût : il faudrait des milliers de lignes dans un même élément pour le sentir.
54. **Chrome for Developers — CSS text-wrap: pretty**
    https://developer.chrome.com/blog/css-text-wrap-pretty
    Explicite : `pretty` traite les **orphelines, pas les veuves**.
55. **OpenWeb — La gestion de la césure en CSS**
    https://openweb.eu.org/articles/la-gestion-de-la-cesure-en-css
    Césure + justification = combo le plus hostile aux lecteurs dyslexiques.
56. **Carmen Ansio — Editorial typography in CSS**
    https://www.carmenansio.com/articles/editorial-typography-css/
57. **Chris Coyier — The hanging-punctuation property in CSS**
    https://chriscoyier.net/2023/11/27/the-hanging-punctuation-property-in-css/
58. **MDN + specs CSS** (une ligne par propriété, avec la spec quand elle existe) :
    `text-wrap` https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap ·
    https://drafts.csswg.org/css-text-4/#text-wrap —
    `text-wrap-style` https://developer.mozilla.org/en-US/docs/Web/CSS/text-wrap-style —
    `hanging-punctuation` https://developer.mozilla.org/en-US/docs/Web/CSS/hanging-punctuation ·
    https://drafts.csswg.org/css-text-3/#hanging-punctuation-property —
    `hyphens` https://developer.mozilla.org/en-US/docs/Web/CSS/hyphens ·
    https://drafts.csswg.org/css-text-4/#hyphenation —
    `hyphenate-limit-chars` https://developer.mozilla.org/en-US/docs/Web/CSS/hyphenate-limit-chars —
    `hyphenate-character` https://developer.mozilla.org/en-US/docs/Web/CSS/hyphenate-character —
    `font-variant-numeric` https://developer.mozilla.org/en-US/docs/Web/CSS/font-variant-numeric —
    `font-feature-settings` https://developer.mozilla.org/en-US/docs/Web/CSS/font-feature-settings —
    `font-optical-sizing` https://developer.mozilla.org/en-US/docs/Web/CSS/font-optical-sizing —
    `font-kerning` https://developer.mozilla.org/en-US/docs/Web/CSS/font-kerning —
    `text-spacing-trim` https://developer.mozilla.org/en-US/docs/Web/CSS/text-spacing-trim ·
    https://drafts.csswg.org/css-text-4/#text-spacing-trim-property —
    `text-box-trim` https://developer.mozilla.org/en-US/docs/Web/CSS/text-box-trim ·
    https://drafts.csswg.org/css-inline-3/#text-box-trim —
    `widows`/`orphans` https://developer.mozilla.org/en-US/docs/Web/CSS/orphans —
    `overflow-wrap` https://developer.mozilla.org/en-US/docs/Web/CSS/overflow-wrap —
    `quotes` https://developer.mozilla.org/en-US/docs/Web/CSS/quotes —
    unités `ch`/`cap`/`lh`/`rlh` https://drafts.csswg.org/css-values-4/#font-relative-lengths
59. **caniuse — support réel, relevé septembre 2026** :
    text-wrap balance https://caniuse.com/css-text-wrap-balance (**92,7 %**) ·
    text-wrap pretty https://caniuse.com/mdn-css_properties_text-wrap_pretty (**87,1 %**, pas Firefox) ·
    hanging-punctuation https://caniuse.com/css-hanging-punctuation (**15,7 %, Safari seul**) ·
    hyphenate-limit-chars https://caniuse.com/mdn-css_properties_hyphenate-limit-chars
    (**78,6 %**, Safari : aucun) · text-box-trim https://caniuse.com/css-text-box-trim (85,3 %,
    Baseline août 2026) · text-spacing-trim https://caniuse.com/mdn-css_properties_text-spacing-trim
    (72,7 %, Chromium seul)

### Sites francophones — ce qu'ils font vraiment (HTML brut + CSS inspectés)

60. **Le Monde** https://www.lemonde.fr/ ·
    https://www.lemonde.fr/bucket/resources/front/css/home_v2.22405792d8509649.css
    `lang="fr"` · 137 apostrophes ’ contre 20 droites · 116 paires de « » · **147 insécables
    U+00A0 avant la ponctuation haute** · CSS : `hyphens:auto`, `font-variant-numeric:tabular-nums`,
    `font-feature-settings:"tnum"`.
61. **Mediapart** https://www.mediapart.fr/ ·
    https://www.mediapart.fr/assets/build/default/front/nouvelle_formule/css/main.05b0dec13fb865e2.css
    Le plus avancé du panel : `text-wrap:balance` ×23 + `pretty` ×10, `text-box-trim:trim-start` +
    `text-box-edge:cap alphabetic` ×11, `hyphens:auto`, `font-variant-numeric:lining-nums
    tabular-nums` ×11, `overflow-wrap:anywhere`, **`max-width` en `ch` : 20/28/30/32/42/66ch**.
    178 apostrophes ’ contre 4 droites, 108 insécables.
62. **Le Monde diplomatique** https://www.monde-diplomatique.fr/
    57 insécables + 95 `&nbsp;` (filtre typographique SPIP côté serveur). **Aucune** propriété CSS
    moderne : la typographie est faite sur le texte, pas sur la feuille de style.
63. **Centre Pompidou** https://www.centrepompidou.fr/fr/
    Seul site du panel à utiliser la **vraie fine U+202F** — et encore, mélangée avec `&nbsp;`.
64. **L'Équipe** https://www.lequipe.fr/ — insécables présentes mais incohérentes d'une citation à l'autre.
65. **Radio France** https://www.radiofrance.fr/ — 199 insécables, mais 236 apostrophes droites
    contre 99 courbes : le mélange des deux apostrophes dans une même page est la signature d'un
    contenu tapé à la main sans filtre.
66. **Ulysse** https://ulysse.com/ — `text-wrap:balance`, `hyphens:auto`, `max-width` 18/24/55/78ch.
    Mais **zéro insécable** avant la ponctuation.
67. **Akaru** (studio, Lyon) https://www.akaru.fr/ · https://www.akaru.fr/_nuxt/entry.CPme9HNL.css
    Studio primé, et pourtant : leur propre `<title>` dit `web lyon : création` avec une espace
    ordinaire. `font-kerning:none` posé explicitement.
68. **Superhuit** (Lausanne) https://superhuit.ch/ — `text-wrap:pretty` + `balance`,
    `font-feature-settings:"case" on` (ponctuation relevée en capitales), `"tnum"`, `"lnum"`.
69. **Locomotive** (Montréal) https://locomotive.ca/fr · https://locomotive.ca/assets/styles/main.css
    `max-width` en `em` (23/35/43/55em), `font-kerning:none` ×3, 88 `clamp()`. Aucune insécable.
70. **Murmure** (Caen) https://www.murmure.me/ — `font-feature-settings:'ss01' 1, 'ss02' 1`
    (sets stylistiques, le seul du panel). SPA : rien de lisible côté texte rendu serveur.
71. **Hermès** https://www.hermes.com/fr/fr/ · **La Bonne Brosse** https://labonnebrosse.com/ ·
    **Le Slip Français** https://www.leslipfrancais.fr/ · **Arte** https://www.arte.tv/fr/ —
    marques soignées, typographie française **non tenue** (apostrophes mélangées, pas d'insécable).
72. **Immersive Garden** https://immersive-g.com/ · **Antinomy Studio** https://antinomy.studio/ —
    studios français primés, sites en **`lang="en"`**.
73. **Awwwards, sélection France** https://www.awwwards.com/websites/France/

**Conclusion de terrain, et elle est contre-intuitive.** La ligne de partage n'est pas
« studio primé » vs « site ordinaire » : c'est **rédaction éditoriale** vs **site vitrine**. Les
rédactions (Le Monde, Mediapart, le Diplo, L'Équipe, Pompidou) tiennent les trois règles
— insécable avant la ponctuation haute, « » avec insécable interne, apostrophe ’ partout —
**parce qu'un filtre tourne côté serveur**, pas parce que les rédacteurs sont vertueux. Les studios
primés (Akaru, Murmure, Superhuit, Locomotive, Immersive Garden, Antinomy) n'en font **rien** : leur
soin va à l'animation et à l'échelle. Deux d'entre eux sont même en `lang="en"`.

Pour nous, c'est une bonne nouvelle : la microtypographie française est un terrain **gratuit** où
l'on peut être meilleur que des sites à 50 000 €, à condition d'automatiser — ce que fait `ff typo`.

**Nuance importante sur U+202F.** La fine insécable que recommande le code typographique est
**quasi absente de la production** : sur 17 sites relevés, seuls Pompidou (3 occurrences) et Radio
France (2) l'emploient ; **tout le monde écrit U+00A0**. Le Monde, Mediapart et le Diplo — les trois
références typographiques françaises du web — sont à 100 % U+00A0.
**Notre arbitrage :** `ff typo` pose la fine U+202F devant `; ! ?` et dans les « », conformément à la
règle stricte de l'Imprimerie nationale, et U+00A0 devant `:` et dans les nombres. C'est « mieux que
Le Monde », donc ce n'est pas sans risque : une police qui ne dessine pas U+202F peut produire une
chasse nulle. **Le basculement est une ligne** — la constante `FINE` en tête de `scripts/ff/typo.mjs`.
Si un rendu suspect apparaît sur un site client, passer `FINE = NBSP` et relancer `ff typo --corriger`.

---

## §A — Les règles françaises non négociables

### A1. Espacement, signe par signe

Trois espaces en jeu : **fine insécable U+202F** (`&#8239;`), **insécable U+00A0** (`&nbsp;`),
**espace ordinaire sécable** U+0020.

> ⚠ **Le piège n° 1 : `&thinsp;` est U+2009, fine mais SÉCABLE.** C'est l'erreur la plus répandue sur
> le web francophone : elle produit une fine qui peut passer à la ligne, donc un `!` orphelin en
> début de ligne suivante. Ne jamais l'utiliser. `ff typo` a une règle dédiée (`fine-secable`).

| Signe | Avant (règle stricte, Imprimerie nationale) | Après |
|---|---|---|
| `,` `.` | rien | sécable |
| `;` `!` `?` | **fine insécable U+202F** | sécable |
| `:` | **insécable pleine U+00A0** ← l'exception | sécable |
| `«` | sécable avant, **insécable/fine après** | — |
| `»` | **insécable/fine avant** | sécable |
| `…` | **rien** | sécable |
| `(` `[` | sécable | rien |
| `)` `]` | rien | sécable |
| `%` `‰` `€` `$` | **insécable** | sécable |
| unités (km, kg, h) | **insécable** | sécable |
| `°C` | **insécable avant le `°`** | sécable |
| `°` d'angle / d'alcool | **rien** (45°, 90°) | sécable |
| `/` `’` | rien | rien |

Mémorisation : **le `:` est la seule ponctuation haute qui prend une espace-mot et non une fine, en
France.** La Suisse met une fine partout, `:` compris ; le Québec ne met **rien** devant `; ! ?`.

**Règle du second signe** (Lacroux/CUY) : quand deux ponctuations se suivent, c'est l'espacement du
second qui s'applique — d'où « Ah ?! » avec une seule fine, en tête du groupe.

**Corollaire CSS** : ne jamais justifier du texte français sur le web. La justification dilate les
espaces-mots insécables et rend la ponctuation visuellement fautive (recommandation OQLF).

### A2. Guillemets

- Niveau 1 : **« … »** (U+00AB / U+00BB), espace insécable ou fine des deux côtés à l'intérieur.
- Niveau 2 : **“ … ”** (U+201C / U+201D), sans espace interne. Alternatives : ‹ › ou répétition.
- Citation sur plusieurs paragraphes : `«` répété au début de **chaque** alinéa, un seul `»` à la fin.
- Ponctuation finale **dans** les guillemets si la citation est une phrase complète, **hors** si
  c'est une incise.
- Les guillemets droits `"` sont **toujours fautifs** en français courant — mais légitimes dans le
  code, les attributs HTML et les chaînes de programmation. D'où le masquage dans `ff typo`.

### A3. Apostrophe

**U+2019 (’) obligatoire, U+0027 (') proscrit** en texte courant (recommandation Unicode explicite).
Aucune espace avant ni après. Piège : U+2019 casse les `grep` naïfs et les tris — normaliser côté
**recherche/indexation**, jamais côté affichage. Dans un slug, un identifiant ou un nom de fichier,
on garde `'` ou rien.

### A4. Majuscules accentuées

**À É È Ê Ç Ô Î Ù obligatoires.** `Etat` est une faute, `État` est la forme correcte. Idem cédille et
tréma. Exception admise : les sigles. Ligature en capitale : **toute la ligature passe en capitale**
⇒ `Œuvre`, `ŒUVRE`. Le fait que Grasset, Actes Sud, *Le Monde* ou *Libération* écrivent « Etat » est
un héritage des casses de plomb, pas un argument en 2026.

### A5. Tirets

| Caractère | Usage français | Espaces |
|---|---|---|
| trait d'union `-` U+002D | mots composés, numéraux, césure | **aucune** |
| demi-cadratin `–` U+2013 | **plages** (3–9, octobre 2010 – mars 2020), noms composés contenant déjà des traits d'union (Saguenay–Lac-Saint-Jean) ; incise et dialogue chez Gallimard, Le Seuil, Albin Michel | plage : insécable ou rien |
| cadratin `—` U+2014 | **incise** (… — par ailleurs charmante — …), **dialogue** en début de ligne | espace des deux côtés |

Le français n'a **pas** l'usage anglo-saxon du cadratin collé (`mot—mot`). Un cadratin en fin de
ligne doit être précédé d'une insécable pour ne pas se retrouver orphelin.

### A6. Points de suspension

Un seul caractère **… U+2026**, toujours trois points. **Aucune espace avant**, espace après. Jamais
précédés d'une virgule. **`etc…` est fautif** (doublon sémantique) : c'est `etc.` **ou** `…`.
Coupure de citation : `[…]`. Raison technique de préférer le caractère unique : trois points séparés
peuvent se couper en fin de ligne (Butterick).

### A7. Ligatures

**œ / Œ obligatoire** : cœur, œuvre, sœur, bœuf, œil, nœud, vœu, œuf, mœurs, manœuvre, chœur.
**Fautive** : coefficient, coexister, moelle, moelleux, Goethe, Monroe — le o et le e y appartiennent
à des syllabes distinctes. **æ / Æ** réservé aux latinismes (ex æquo, et cætera, curriculum vitæ).
⇒ Un remplacement automatique `oe`→`œ` doit se faire **sur liste fermée de mots**, jamais sur le
digramme seul : c'est exactement ce que fait `RACINES_OE` dans `scripts/ff/typo.mjs`.

### A8. Abréviations

| Correct | Fautif |
|---|---|
| `M.` `MM.` | `Mr` `Mr.` `M` |
| `Mme` `Mmes` `Mlle` `Me` `Mgr` `Dr` `Vve` — **sans point** | `Mme.` `Dr.` |
| `n°` (usage web) — forme savante : `no` avec o en exposant | **`N°`**, `no.`, `#` |
| `1er` `1re` `1ers` `1res` | `1ère` `1ere` |
| `2e` `3e` `20e` `2es` — `Ier` `IIe` `XXe siècle` | **`2ème` `2ième` `2me` `XXème`** |
| `c.-à-d.` `p. ex.` `cf.` `env.` `etc.` | `càd` `p.ex.` `etc...` |

Règle générative (Lacroux) : **point abréviatif si et seulement si la dernière lettre du mot manque.**
`M.` (Monsieur → M) le prend ; `Mme` (le `e` final est là) ne le prend pas.
Insécable **obligatoire** entre `M.` et le nom. Les exposants se composent en `<sup>`, pas avec les
caractères Unicode exposants (qui dégradent la copie et l'accessibilité).

### A9. Nombres, unités, symboles

- **Séparateur de milliers = espace insécable**, tranches de trois, partie décimale comprise :
  `1 200`, `1 564 534`, `3,141 592`. Jamais la virgule ni le point (usage anglo-saxon).
- **Séparateur décimal = la virgule** : `12,5`.
- **Exceptions au séparateur** : années (`2026`), numéros d'identification, codes postaux (`59100`),
  numéros de page, adresses. Mais `15 000 ans` (durée) prend l'espace.
- **Unité : insécable** — `10 km`, `87 km²`, `3 Go`. Symboles **jamais de point, jamais de `s`**,
  minuscule sauf éponyme : `10 km` et non `10 kms`/`10 Km`/`10 km.`
- **`15 %`** avec insécable ; `15%` est anglais.
- **`25 °C`** — insécable **avant** le `°`, `°C` soudé. `25°C` et `25° C` sont fautifs.
- Angles et degrés d'alcool **soudés** : `45°`, `90°`.

### A10. Prix

**Symbole après le nombre, insécable** : `1 200 €`, `12,50 €`, `49 €`. Jamais `€1200` (anglais),
jamais `1200€` (collé). `49,00 €` seulement en contexte comptable. `EUR` réservé au financier.

### A11. Heures

**`9 h 30`** — `h` bas de casse, sans point, **encadré de deux insécables**.
Fautifs : `9h30`, `9 H 30`, `9:30`, `9h`, `9 h 00`, `9h30min`.
Heure ronde : **`9 h`**. Minutes < 10 : **`8 h 05`** (zéro conservé). Forme longue : `14 h 16 min 13 s`.
Le `:` est réservé aux tableaux, durées chronométrées et formats machine ISO 8601.
Horaires d'ouverture : `de 9 h à 12 h et de 14 h à 18 h`, ou `9 h – 12 h` au demi-cadratin ; **toute
la plage doit être insécable**. Web : `<time datetime="09:30">9 h 30</time>` — valeur machine en ISO,
texte visible en typographie française.

### A12. Téléphone (France)

**`01 23 45 67 89`** — groupes de **deux**, séparés par des insécables. Pas de points, pas de tirets,
pas de parenthèses (Arcep/UIT). International : `+33 1 23 45 67 89` (le 0 initial saute).
Web : `<a href="tel:+33123456789">01 23 45 67 89</a>` — le `href` **sans aucune insécable** (elle
casserait le lien), le texte visible avec.

### A13. Dates et adresses

`le 14 juillet 2024` — jour et mois **en bas de casse**, insécables entre les éléments, **pas de
séparation de milliers sur l'année**. `le 1er janvier` mais `le 2 janvier`. Majuscule au mois quand
la date désigne l'événement (`le 14 Juillet`, `le 11 Septembre`) mais bas de casse dès que l'année
est précisée. Adresse en texte courant : `22, rue de la République` (virgule, type de voie en bas de
casse) ; norme postale sur enveloppe : `22 RUE DE LA REPUBLIQUE`, sans virgule. `59100 Roubaix` avec
insécable.

### A14. Les pièges — où NE PAS appliquer la typographie française

C'est la partie que ratent tous les correcteurs automatiques. **Toute règle ci-dessus s'arrête à la
frontière du texte de lecture.**

1. **URL et `href`** — jamais d'insécable, jamais de `’`, jamais de « ». Une insécable dans un `href`
   produit un 404 silencieux ou un `%C2%A0` parasite.
2. **Adresses e-mail** — un NBSP invisible en fin d'adresse fait échouer l'envoi sans message utile.
3. **Code affiché** (`<code>`, `<pre>`) — à exclure intégralement. Un `'` transformé en `’` casse le
   code qu'on copie-colle ; un `--` transformé en `–` casse une option CLI.
4. **`.env`, CSV, JSON, YAML** — le NBSP corrompt le parsing, et `trim()` ne le reconnaît pas.
5. **Marques et noms propres étrangers** — `iPhone`, `eBay`, `Goethe` (pas de ligature), `Monroe`.
6. **Sigles** — accentuation non obligatoire, pas de points entre les lettres (`SNCF`).
7. **Attributs HTML** — `alt`, `title`, `placeholder`, `aria-label` **sont** du texte français et
   méritent les insécables ; `id`, `class`, `data-*`, slugs ne le sont pas.
8. **`<time datetime>`, JSON-LD, microdonnées** — valeurs machine en ISO.
9. **Collage depuis Word** — Word convertit l'insécable en espace ordinaire au collage en texte brut,
   et injecte des NBSP là où on n'en veut pas.

**Conséquence d'architecture** : appliquer la typographie **à la génération**, avec une liste
d'exclusion explicite — exactement le modèle de `babel-french` en LaTeX et des filtres SPIP.
`scripts/ff/typo.mjs` masque URL, e-mails, entités, balises, blocs de code et échappements avant
toute transformation, puis les restitue au caractère près.

---

## §B — Les réglages CSS qui séparent un texte composé d'un texte posé

### B1. La mesure

C'est le réglage le plus rentable, et celui qu'on rate le plus. Consensus : **60–70 caractères**
(Bringhurst 66 idéal / 45–75 ; Butterick 45–90 ; Pimp my Type 60–80).

⚠ **`ch` n'est pas une unité de caractère.** Elle mesure la chasse du glyphe « 0 ». En fonte
proportionnelle, **1ch ≈ 1,33 caractère réel** : `65ch` donne environ **87 caractères**, au-dessus du
plafond. Pour ~80 caractères, viser ~60ch (Meyer). Rutter recommande carrément `rem`, indépendant du
dessin de la fonte. Mediapart, en production, compose entre 42ch et 66ch.

### B2. L'interlignage lié à la taille

`line-height` **sans unité**, impérativement : une valeur avec unité transmet aux enfants la hauteur
calculée, pas le ratio, et écrase l'interligne des titres imbriqués.

| Contexte | Valeur |
|---|---|
| Corps, mesure 65–75 car., desktop | 1,55–1,65 (plancher WCAG 1,5) |
| Corps, colonne étroite / mobile | 1,35–1,45 |
| Intertitres 24–32 px | 1,25–1,35 |
| Gros titres 40–72 px | 1,05–1,15 |
| Boutons, labels mono-ligne | 1,0–1,2 |

Règle de dérivation : **l'interligne décroît quand le corps croît, et croît quand la mesure croît.**
Un interlignage unique sur tous les niveaux de titre est un marqueur de gabarit.

### B3. Équilibrage des titres, veuves et orphelines

- **`text-wrap: balance`** — 92,7 %, tous moteurs. Répartit les mots d'un titre : plus de dernier mot
  seul. **Plafonné à 6 lignes (Chromium) / 10 (Firefox)** : inutile — et inoffensif — sur un
  paragraphe. Ne change **pas** la largeur de la boîte : un titre court peut laisser un grand blanc
  à droite (Shadeed).
- **`text-wrap: pretty`** — 87 %, Chrome 117+ / Safari 26+, **pas Firefox**. Traite les **orphelines,
  pas les veuves**. ⚠ **Chromium n'optimise que les 4 dernières lignes, WebKit tout le paragraphe** :
  le rendu diffère entre moteurs, donc rien dans une mise en page ne doit dépendre du nombre de
  lignes obtenu. Coût négligeable (il faudrait des milliers de lignes dans un seul élément).
- **`widows` / `orphans`** — **aucun effet sur du texte en flux continu**, et Firefox ignore
  `orphans`. Ils n'agissent que sur la fragmentation : leur seule place utile est `@media print`.

### B4. Césure

`hyphens: auto` n'agit **que si** l'élément hérite d'un `lang` connu du navigateur **et** qu'un
dictionnaire existe. Sans `lang`, soit rien, soit — pire — **la césure anglaise appliquée au
français**, qui coupe selon des règles étymologiques fausses. `lang="fr"` est donc une **condition
de correction typographique**, pas une coquetterie d'accessibilité.

`hyphenate-limit-chars: 8 3 3` (mot ≥ 8 lettres, 3 avant, 3 après). Les défauts navigateur (5 2 2)
coupent « é-tudier ». Règle de Bringhurst : ≥ 2 derrière, ≥ 3 devant. **Safari ignore la propriété**
et appliquera 5/2/2 — dégradation acceptable.

`hyphenate-limit-lines` (max de lignes césurées consécutives) n'est implémenté **nulle part** : on ne
peut pas empêcher quatre tirets d'affilée en CSS. Enfin, **césure + justification** est le combo le
plus hostile aux lecteurs dyslexiques (OpenWeb) : sur le web, drapeau à droite, toujours.

### B5. Chiffres

`font-variant-numeric: tabular-nums` donne la même chasse à tous les chiffres : une colonne de prix
s'aligne, un téléphone ne « saute » plus, un compteur ne tressaute pas.
**À réserver aux chiffres** : dans du texte courant, le 1 devient trop espacé et le mot perd sa
couleur. Incompatible en pratique avec `oldstyle-nums`. Sans effet silencieux si la fonte n'a pas
`tnum` — aucun risque, mais aucune garantie non plus.
`lining-nums` force les chiffres capitales : plusieurs de nos display (Fraunces, EB Garamond,
Cormorant, Bodoni) ont des chiffres elzéviriens par défaut — superbes en texte, illisibles en grille
tarifaire.
Préférer **toujours** `font-variant-*` à `font-feature-settings` : ce dernier est bas niveau et
**remplace la liste entière** au lieu de s'y ajouter (MDN).

### B6. Détail de fonte

- **`font-optical-sizing: auto`** — déjà notre défaut. Les fontes variables à axe `opsz` (Fraunces,
  Literata, Newsreader, Bodoni Moda) adaptent graisse et contraste à la taille réelle. ⚠ Écrire
  `font-variation-settings: "wght" …` à la main **écrase** l'axe `opsz` : utiliser `font-weight`.
- **`letter-spacing`** — négatif léger (−0,01 à −0,02 em) **au-dessus de ~32 px seulement**. Sous
  20 px il serre des lettres déjà serrées. Positif (+0,05 à +0,08 em) sur les capitales et les
  petites capitales. ⚠ Tout `letter-spacing` non nul **désactive les ligatures optionnelles**.
  Toujours en `em`, jamais en `px`.
- **`font-kerning: normal`** et **`font-variant-ligatures: common-ligatures contextual`** — actifs par
  défaut, à déclarer pour qu'un `letter-spacing` posé ailleurs ne les emporte pas en silence.
  (Curiosité de terrain : Akaru et Locomotive posent explicitement `font-kerning: none`, sans doute
  pour stabiliser des animations lettre à lettre.)

### B7. Ponctuation suspendue

`hanging-punctuation: first last` fait pendre le guillemet ouvrant hors de la colonne. **Safari
seul, ~16 %**, dix ans après la spec ; **zéro occurrence sur les 18 sites du relevé**. À traiter comme
un bonus muet sous `@supports`. ⚠ **Ne jamais simuler par un `text-indent` négatif** : les 84 %
restants hériteraient d'un décalage bien visible.

### B8. Ce qu'on laisse de côté pour l'instant

- **`text-box-trim` / `text-box-edge`** (Baseline août 2026, 85 %) — supprime le demi-interligne
  parasite au-dessus et au-dessous des glyphes ; énorme gain sur l'alignement des boutons et des
  blocs de titrage. Mediapart est le seul du panel à l'utiliser (11 déclarations). **Reporté** : le
  gain est réel mais il déplacerait verticalement chaque titre des 30 sites déjà livrés. À faire un
  jour, sous `@supports`, avec une passe de captures de régression.
- **`text-spacing-trim`** — CJK uniquement, Chromium seul (72,7 %), et **désactivé si la fonte ne
  porte pas `halt`/`chws`**. Sans objet pour du contenu latin.
- **`text-rendering: optimizeLegibility`** — présent chez Locomotive, Radio France, Immersive Garden.
  Vestige de cargo cult, sans effet réel sur les navigateurs modernes. À ne pas copier.
- **`initial-letter`** (lettrine) — 0 occurrence sur les 18 sites.

---

## §C — Ce que NOS sites faisaient mal (mesuré le 22 septembre 2026)

### C1. Aucun contrôle de la ponctuation française

`docs/CONVENTIONS.md` règle 10 dit depuis toujours : « Textes d'interface en français, avec accents et
espaces insécables avant `:` `?` `!` (`&nbsp;`) ». **Rien ne le vérifiait.** Le seul contrôle
typographique de `ff verifier` était `scripts/ff/verifier.mjs:27` — et il n'attrape qu'un **bug de
rendu** (`&amp;nbsp;` affiché en toutes lettres), pas une faute de composition.

Mesures dans `src/` (fichiers interdits d'écriture pour cette tâche, donc relevés ici pour un
chantier ultérieur) :

- **9 occurrences seulement** de `&nbsp;` dans tout `src/` (schema.ts:295, 404.astro:17,
  zones/[ville].astro:62, About/{portrait,story,timeline,values}.astro, Zones/{chips,list,map}.astro).
- **98 apostrophes droites** dans du texte français visible de `src/sections/`, `src/pages/` et
  `src/lib/schema.ts` — contre 5 apostrophes typographiques. Exemples : `Hero/split.astro:2`
  (`d'i`, `d'u`), `Faq/accordion.astro:27`, `404.astro:17` (« Le lien est peut-être ancien »),
  `Cta/phone-giant.astro:2`. C'est exactement le profil « Radio France » du relevé (236 droites /
  99 courbes) : le mélange des deux apostrophes dans une même page.
- **0 fichier** de `src/` contenant le caractère U+00A0 littéral (seul `src/scripts/motion.ts` en a,
  pour une raison technique sans rapport).

Sur `sites/_exemple/site.config.ts`, lui-même soigné (apostrophes ’ correctes, `Barœul` ligaturé) :
`site.config.ts:77` écrit `'Quel délai pour une cuisine ?'` avec une espace **ordinaire** avant le
point d'interrogation — elle peut donc laisser le `?` seul en début de ligne. Et
`site.config.ts:43` écrit `hours: '8h – 18h'` au lieu de `8 h – 18 h`.

**Résultat de `ff typo _exemple` sur le site construit** : 13 apostrophes droites, 6 heures mal
composées, 26 téléphones non insécables, 28 ponctuations doubles sans la bonne espace.

### C2. La mesure était trop large

`src/styles/global.css:66` (avant) : `--measure: 65ch`. Compte tenu de la conversion ch → caractère
(§B1), cela valait **~87 caractères par ligne** — au-dessus du plafond de 75 de Bringhurst/Rutter.
Porté à **58ch (~72 caractères)**, avec `--measure-large: 72ch` pour les chapeaux.

Pire : l'utilitaire `.measure` n'était employé **qu'une seule fois dans tout `src/`**
(`src/sections/Process/horizon.astro:33`). Partout ailleurs le texte long s'appuie sur `max-w-prose`
(Tailwind, 65ch — même défaut) ou sur rien du tout. `warnBlocTexteSansMesure`
(`scripts/ff/verifier.mjs:433`) ne se déclenche qu'au-delà de **400 caractères** dans un seul `<p>` :
un paragraphe de 350 caractères court donc sur toute la largeur sans un mot.

### C3. L'interlignage était le même à toutes les tailles

`src/styles/global.css:110` (avant) : `h1, h2, h3, .font-display { line-height: 1.05 }`. Or `h3` sert
`text-display-sm`, qui vaut `clamp(1.25rem, 2vw, 1.6rem)` — soit **20 à 26 px**. Un interlignage de
1,05 y est étouffant : c'est la valeur d'un titre de 80 px. Idem pour `letter-spacing:
var(--display-tracking)` (−0,02em par défaut, `src/styles/global.css:108`), appliqué tel quel à un h4
de 18 px alors que la règle est « pas de négatif sous 20 px » — et que tout `letter-spacing` non nul
désactive les ligatures.

Dans les directions, les surcharges typographiques se limitent à `--display-tracking` et à la taille :
`src/directions/journal/index.css:27` (`--display-tracking: -0.01em`),
`src/directions/luxe/index.css:27` et ses surcharges de `text-display-xl/lg`
(`src/directions/luxe/index.css:40-41`). **Aucune direction ne touche à l'interlignage, à la césure ou
aux chiffres** : ce sont bien des réglages globaux, leur place est dans `global.css`.

### C4. Aucune césure, alors que `lang="fr"` était déjà posé

`src/layouts/Base.astro:100-101` pose `<html lang={site.lang}>` et `site.lang` vaut `'fr'` par défaut
(`src/lib/schema.ts:81`). Tout était donc prêt pour `hyphens: auto` — **et la propriété n'apparaissait
nulle part**. C'est un gain gratuit qui dormait : en français, « professionnalisme » ou
« exceptionnellement » creusent des trous énormes dans une carte à 375 px.

### C5. Aucun chiffre tabulaire

`font-variant-numeric` n'apparaissait nulle part. Nos grilles tarifaires, horaires et numéros de
téléphone héritaient donc des chiffres proportionnels — et, sur les directions en Fraunces,
Cormorant, EB Garamond ou Bodoni, de chiffres **elzéviriens** qui montent et descendent : superbes
dans un paragraphe, désastreux dans une colonne de prix.

### C6. Ce qui était déjà bon

Honnêteté : trois choses étaient déjà en place et n'ont pas été touchées —
`text-wrap: balance` sur `h1,h2,h3` et `pretty` sur `p` (`src/styles/global.css:111` et `:113`),
`font-optical-sizing: auto` sur `body` (`:102`), et `text-underline-offset` sur les liens (`:114`).
Le bloc « Composition » les étend (balance sur tous les niveaux de titre, pretty sur `li`/`dd`) plutôt
que de les refaire.

---

## Ce qui a été fait

1. **`src/styles/global.css`** — `--measure` 65ch → 58ch (+ `--measure-large: 72ch`), utilitaires
   `measure-large` et `tabulaire`, et un bloc **« Composition »** documenté : équilibrage étendu,
   interlignage et interlettrage par niveau, césure française `8 3 3` sous `:lang(fr)`,
   `overflow-wrap: anywhere`, chiffres tabulaires sur `table`/`time`/`address`/`a[href^="tel:"]`,
   `font-kerning`/`font-variant-ligatures`, `quotes` français, `hanging-punctuation` sous `@supports`,
   `widows`/`orphans` en `@media print`. Chaque règle porte sa raison et son repli en commentaire.
2. **`scripts/ff/typo.mjs` + `ff typo [slug...] [--corriger]`** — 18 règles, noyau pur testé.
3. **`tests/typo.test.mjs`** — 27 tests, dont les pièges (URL, e-mail, balise, attribut, bloc de code,
   nom propre, guillemets imbriqués, guillemet orphelin, idempotence).
4. **`docs/CONVENTIONS.md` règle 22**, ligne dans le tableau de `CLAUDE.md`, renvoi dans
   `docs/REDACTION.md`.

## Ce qui reste à faire

- **Les textes des sites** : `ff typo <slug> --corriger` n'a **pas** été lancé (une autre passe de
  réécriture était en cours). À faire site par site, avec un `ff build` + `ff captures --comparer`
  derrière.
- **`src/sections/**` et `src/pages/**`** : les 98 apostrophes droites et les libellés d'interface
  sans insécable (§C1) sont hors périmètre de cette tâche. Ce sont des fichiers partagés : une passe
  dédiée, avec relecture, plutôt qu'un `--corriger` automatique.
- **`text-box-trim`** (§B8) quand on acceptera une passe de régression visuelle sur les 30 sites.
- **`ff verifier`** pourrait appeler `ff typo` en avertissement, une fois les sites existants nettoyés.
