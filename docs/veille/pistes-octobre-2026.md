# Pistes octobre 2026 — outils, Higgsfield, Lovable, livrables annexes

Veille du 8 octobre 2026. Lecture seule, rien installé.

## TL;DR

- **Peu à installer.** Le repo a déjà `LocalBusiness`, mentions légales, confidentialité, `llms.txt`, sharp, playwright-core. Ce qui manque vraiment, c'est un **audit d'accessibilité dans `ff verifier`** (`@axe-core/playwright`, gratuit) et un **audit SEO externe** (claude-seo).
- **Higgsfield** : un agrégateur de modèles (Kling, Seedance, Wan…) avec une API à part, au même prix que fal. Il **entraîne ses modèles sur les fichiers envoyés** par défaut, donc **ne jamais y envoyer les photos des clients**. On garde fal.
- **Lovable** : utile seulement pour un outil interne (CRM prospects) que l'associé non-dev modifierait seul. Sinon, Claude Code fait la même chose dans le repo, sans abonnement.
- **Livrables qui comptent** : un kit Google Business Profile, un QR code avec carte et flyer prêts à imprimer, des visuels de lancement et un livret de remise en PDF. Le tout peut se générer depuis `site.config.ts` avec Playwright (déjà installé). **Pas de modèle de facture** : la facture électronique devient obligatoire.

## 1. Skills, plugins et MCP (classés)

| # | Nom | Installation | Apport | Confiance |
|---|---|---|---|---|
| 1 | `@axe-core/playwright` (Deque) — [npm](https://www.npmjs.com/package/@axe-core/playwright) | `npm i -D @axe-core/playwright` | `ff lighthouse` n'applique qu'une partie des règles axe, sur 3 pages. Le paquet complet couvre toutes les pages dans `ff verifier`. Gain modéré, coût nul. Préféré aux MCP a11y ([liste glama](https://glama.ai/mcp/servers/ICJIA/axecap-mcp)), d'origine inconnue | Officiel |
| 2 | claude-seo — [GitHub](https://github.com/AgriciDaniel/claude-seo) | `/plugin marketplace add AgriciDaniel/claude-seo` puis `/plugin install claude-seo@agricidaniel-claude-seo` | Audit technique, validation schema, signaux GBP et citabilité IA. MIT, environ 18,5k étoiles. Dépend de Python 3.10+. Sert à auditer, pas à générer (déjà fait) | Populaire |
| 3 | marketingskills (Corey Haines) — [GitHub](https://github.com/coreyhaines31/marketingskills) | `npx skills add coreyhaines31/marketingskills --skill page-cro copywriting` | Grilles de conversion et de rédaction. Écrit pour l'anglais. Ses conseils de « social proof » vont contre notre règle « rien d'inventé » : prendre la méthode, garder REDACTION.md comme référence | Populaire |
| 4 | Plugins officiels (`claude-plugins-official`, visibles via `/plugin`) — [présentation](https://www.morphllm.com/claude-code-marketplace) | `/plugin` | Ces plugins sont passés en revue par Anthropic : y chercher d'abord, avant tout dépôt tiers | Officiel |
| 5 | MCP Google Business Profile (gbp-mcp, Rating Captain…) — [exemple](https://mcpservers.org/servers/reach-locus-intelligence-com-google-business-profile-mcp) | — | À **ne pas installer** pour l'instant : il demande un accès à l'API Google et une délégation OAuth sur la fiche du client. Ces outils viennent d'éditeurs inconnus ou payants | Inconnu |

Rien d'utile trouvé pour les pages légales (RGPD) ni pour la retouche photo : les pages existent déjà et `nettoyer-photos` (sharp) couvre le besoin.

## 2. Higgsfield

- **Ce que c'est** : une interface et un pot de crédits communs pour plus de 50 modèles (Kling 3.0, Veo 3.1, Seedance 2.0, Wan, Flux…). S'y ajoutent ses outils maison : Soul et Soul ID (un visage récurrent), Cinema Studio (mouvements de caméra) ([technode](https://technode.global/?p=117457), [revue](https://creatify.ai/fr/blog/higgsfield-ai-review-(2026)-is-it-worth-it)).
- **API** : solde prépayé en dollars, valable 1 an, distinct de l'abonnement. Vidéo de 0,07 à 0,25 $/s ([blog Higgsfield](https://higgsfield.ai/blog/generate-ai-videos-higgsfield-api)). fal facture Kling 3.0 Pro 0,224 $/s ([costbench](https://costbench.com/software/ai-media-apis/fal-ai/)), donc **aucun gain décisif**. Abonnements payants de 19 à 129 $/mois ([creatify](https://creatify.ai/blog/higgsfield-pricing-(2026)-plans-and-what-you-ll-actually-pay)).
- **Licence** : l'utilisateur garde la propriété et l'usage commercial ([aide officielle](https://higgsfield.ai/creator-hub/help-center/account-and-privacy/who-owns-my-generations-and-can-i-use-them-commercially)). Des sources tierces disent que le plan gratuit l'exclut : à vérifier. **Les fichiers envoyés servent à l'entraînement par défaut** (sauf offre Enterprise). Les CGU ont été réécrites en 2026 après une polémique ([startupfortune](https://startupfortune.com/higgsfield-ai-tells-creators-they-own-their-videos-but-quietly-claims-a-perpetual-worldwide-license-to-train-on-them/)).
- **Usages possibles** : publicités Reels et film promo **pour F&F** (Cinema Studio). Pour animer les photos des clients, **non** : ce serait un transfert RGPD sans consentement, et ça contredit la règle « pas d'image IA présentée comme celle du client ».

## 3. Lovable (et alternatives)

- Pro à environ 25 $/mois. Le plan gratuit ne permet que des projets publics. Les crédits varient selon la tâche et expirent ([prix](https://lovable.dev/pricing), [eesel](https://eesel.ai/blog/lovable-pricing)). Les applis sont en React, avec Supabase ou Lovable Cloud.
- **Synchro GitHub bidirectionnelle sur une seule branche. On ne peut pas importer un dépôt existant** ([doc](https://docs.lovable.dev/integrations/github)). Donc pas question d'y mettre ff-atelier.
- **Un usage qui tient** : un CRM de prospects ou un formulaire de brief qui produit un JSON, converti en `brief.md` par un script du repo. Il faut alors une base Supabase en UE (données personnelles). Un portail client n'apporte pas grand-chose à 72 h de délai.
- v0 coûte 20 $/mois et ne fait que du front. Bolt coûte 25 $/mois, facturé aux tokens, sans visibilité sur la consommation ([v0](https://automationatlas.io/answers/v0-pricing-explained-2026/), [Bolt](https://www.banani.co/blog/bolt-new-pricing)).

## 4. Livrables annexes générables depuis `site.config.ts`

Je n'ai trouvé aucune donnée publique fiable sur ce que les clients acceptent de payer. Le classement ci-dessous est un jugement.

1. **Kit Google Business Profile** (valeur forte, peut être facturé en option) : catégories, description en 750 caractères, horaires, liens et photos réelles recadrées. On le remet sous forme de fiche de saisie, sans accès API.
2. **QR code et carte de visite, flyer A5 prêts à imprimer** : `qrcode` (npm), plus une page HTML dans la direction du site, convertie en PDF par `page.pdf()` de Playwright (déjà installé). Les polices et la palette restent identiques à celles du site. Typst ou `@react-pdf` imposeraient un second système de style.
3. **Visuels de lancement** (carré, story, bannière Facebook) : même principe que `ff og`, captures Playwright ou satori avec resvg (attention : satori ne gère que le flexbox, pas le grid).
4. **Livret de remise en PDF** (accès, domaine, comment demander une modification), à partir de HANDOVER.md. Il rassure et coûte peu.
5. **Signature mail** : déjà faite.
6. **Page de liens « link-in-bio »** : une page `/liens` dans Astro, triviale. Faible valeur perçue, mais elle évite au client de passer par Linktree.
7. **Devis et factures** : ne pas les générer. La réception de factures électroniques est obligatoire depuis le 1er septembre 2026 et l'émission le sera le 1er septembre 2027 pour les TPE et micro-entreprises, via une plateforme agréée ([LegalPlace](https://www.legalplace.fr/actualites/changement-1er-septembre/)). Pour F&F comme pour les clients : utiliser un outil agréé.
