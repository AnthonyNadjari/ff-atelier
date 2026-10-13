# Veille — synthèse et plan d'action

Six dossiers, ~2 850 lignes, sources citées : `concurrents.md`, `tendances.md`, `animations.md`,
`ressources.md`, `seo-conversion.md`, `composants.md`. Ce fichier ne répète pas, il tranche.
Chaque action porte un numéro pour être reprise dans `docs/OBJECTIF.md`.

## Ce qui change dans notre lecture du marché

1. **« Rapide, propriétaire, sans abonnement » n'est pas un océan bleu.** Atelectro (48-72 h, 199 €),
   ConvertiLab (7 j, 500 €, satisfait ou remboursé), Loirys (290 €), 123SolutionWeb le vendent déjà.
   Notre différence réelle : sites dessinés un par un (pas un template décliné par ville), trois
   propositions au premier rendu, propriété technique vraie (fichiers statiques standard, aucun CMS
   propriétaire), deux personnes nommées.
2. **Le repère de prix pour un site artisan sérieux en one-shot est 1 200 à 2 500 €.** Plancher
   crédible 500 €. Le chèque France Num (50 %, plafonné 3 000 €) existe : à vérifier au moment de la
   vente. Conséquence : ne pas se battre à 199 €, se placer autour de 1 200 à 1 800 € avec la
   preuve visuelle (trois propositions) et la propriété comme justification.
3. **Les plaintes récurrentes des clients des concurrents** : reconduction tacite, domaine au nom de
   l'agence, résiliation bloquée, promesses SEO. Chaque point devient une phrase de notre offre.
4. **Google a retiré les rich results FAQPage et refuse les avis auto-déclarés.** On garde la FAQ
   pour l'usage, pas pour le SEO ; on retire `aggregateRating` du JSON-LD par défaut.
5. **Google Maps embed charge des traceurs** : sans consentement c'est non conforme (CNIL). Par
   défaut : OpenStreetMap, ou façade cliquable pour Google.
6. **Formulaires** : Web3Forms et Formspree hébergent aux États-Unis. Pour les professions réglementées
   (avocat, santé), préférer Cloudflare Workers + Email Routing (gratuit, contrôle côté atelier).
7. **GSAP est 100 % gratuit depuis avril 2025**, plugins compris : DrawSVG, ScrambleText, Flip,
   Draggable, Observer sont utilisables sans licence. Typed.js est passé en GPL (éviter),
   ScrollReveal est GPL (éviter), Locomotive n'est plus maintenu (Lenis à la place).
8. **Licences des collections** : AstroWind, HyperUI, Meraki, Mamba, Tailgrids, Magic UI sont MIT et
   portables ; Astroship est GPL (ne pas copier) ; Webflow/Framer/Figma payants interdisent la copie ;
   CodePen n'est pas MIT par défaut. Règle : on copie la composition, jamais le code, sauf MIT.
9. **Photos** : Unsplash et Pexels sont utilisables sur des sites clients sans attribution obligatoire,
   mais l'API Unsplash impose le hotlink et l'appel `download_location`. Recherche en anglais.
10. **Accessibilité** : la quasi-totalité de nos clients (micro-entreprises) est hors périmètre RGAA /
    European Accessibility Act. On respecte les bases par principe, on ne vend pas de conformité.

## Plan d'action, par ordre de valeur

### A. Offre et discours (une journée, vous deux + moi pour les textes)
- A1. Grille de prix publique : deux formules one-shot autour de 1 200 et 1 800 €, options (pages
  villes, shooting, maintenance 25 €/mois facultative). Chèque France Num mentionné si actif.
- A2. Garantie de délai (« livré sous 72 h après réception des éléments, ou remise »), jamais de garantie
  SEO. Phrase de propriété en une ligne : « le site, le domaine et les fichiers sont à vous dès la
  mise en ligne, aucun abonnement, jamais, même optionnel ».
- A3. Page `finck-fisch` : trois propositions visibles, avant/après par métier, prix affichés, les
  deux fondateurs nommés. Les huit objections du dossier concurrents et leurs réponses en FAQ.
- A4. Le formulaire client (`studio/commercial/brief-client.html`) reçoit une question « avez-vous vu une aide
  France Num ? » et une case « photos : qui les prend ? ».

### B. Livrable conforme, automatisé (moi, deux à trois tours de boucle)
- B1. `ff verifier` intègre les points automatisables de la checklist de 30 items : sous-type
  `LocalBusiness` par métier, pas d'`aggregateRating` auto-déclaré, `tel:` visible au premier écran,
  formulaire ≤ 4 champs, images avec dimensions, `font-display: swap`, mentions légales complètes,
  politique de confidentialité présente, pas d'iframe Google Maps sans façade, canonical, sitemap.
- B2. Schéma : champ `business.schemaType` (Plumber, HairSalon, Restaurant, AutoRepair, LegalService,
  Dentist, Electrician, RoofingContractor, Locksmith, Florist, BedAndBreakfast…) avec valeur par défaut
  déduite du métier ; retirer `aggregateRating` du JSON-LD.
- B3. Page « Politique de confidentialité » générée (finalité, base légale, durée, droits, destinataire
  du formulaire et pays d'hébergement selon `form.provider`).
- B4. Carte : composant OSM/Leaflet sans cookie par défaut ; façade cliquable pour Google Maps ;
  `contact.mapsProvider`.
- B5. Formulaire : provider `cloudflare` (Worker + Email Routing) en plus de `mailto` et `web3forms`,
  avec le Worker généré dans le site exporté.
- B6. `ff lighthouse` (playwright + lighthouse) avec seuils 90 ; entre dans `ff verifier`.

### C. Matière première (moi, un tour)
- C1. `ff photos <slug> "<requête>"` : Unsplash + Pexels, table métiers FR→EN, `CREDITS.md`, hotlink et
  `download_location` respectés. Clés dans `.env`.
- C2. `ff video` avec pipeline ffmpeg (webm + mp4 + poster, < 2 Mo).
- C3. `ff illustration` (unDraw recolorisé) pour les métiers sans photos.
- C4. 30 polices display supplémentaires du dossier ressources ajoutées au catalogue `fonts.ts`.

### D. Moteur d'animation (moi, deux tours)
- D1. Les 25 effets du dossier animations ajoutés à `motion.ts`, dans cet ordre de valeur :
  `data-sticky-stack`, `data-stack`, `data-split="chars"`, `data-scramble`, `data-spotlight`,
  `data-tilt-glare`, `data-flip-card`, `data-compare`, `data-parallax-depth`, `data-trail`,
  `data-marquee-velocity`, `data-blur-scrub`, `data-counter-flip`, `data-count-bar`,
  `data-scroll-progress`, `data-draw-svg`, `data-lenis` (opt-in), `data-drag-grid`,
  `data-hover-distort` (OGL), `data-lottie`, `data-confetti`, `data-border-beam`, `data-accordion`
  (Flip), `data-curtain-nav` + `data-view-transition` (ClientRouter).
- D2. Chaque effet : repli `prefers-reduced-motion`, garde `querySelector` avant `import()`, budget
  JS par palier (subtle ≤ 15 Ko, rich ≤ 120 Ko hors GSAP), test de non-régression.
- D3. Tests : chaque attribut utilisé dans au moins deux sites de démonstration.

### E. Bibliothèque de compositions (moi, en continu, via `/nouvelle-variante`)
- E1. La matrice de 110 idées (`composants.md` § 3) et les 60 idées de sections + 25 heros + 15 navs
  (`tendances.md` § 4-5) deviennent la réserve dans laquelle chaque nouveau site pioche. Règle :
  chaque site dessiné à la main introduit au moins un motif de cette réserve qui n'existe pas encore.
- E2. Procédure de portage en 14 étapes (`composants.md` § 5) ajoutée à la compétence
  `/nouvelle-variante`.
- E3. Sources autorisées à copier (MIT) : AstroWind, HyperUI, Meraki, Mamba, Tailgrids, Magic UI,
  Codrops. Sources à observer seulement : Awwwards, Godly, Webflow, Framer, Figma, CodePen.

### F. Veille continue (boucle)
- F1. Un tour de boucle sur dix : relire Godly, Siteinspire, footer.design, nav.gallery, hero.gallery,
  noter cinq motifs nouveaux dans `tendances.md` § 4, en porter un.

## Ce qu'on ne fait pas

- Pas de garantie de résultat SEO. Pas de widget d'avis tiers payant (Elfsight, Trustindex) par défaut.
- Pas de bannière cookie tant que le site n'a aucun traceur : mesure d'audience Plausible/Umami, carte
  OSM ou façade.
- Pas de code copié depuis Webflow, Framer, Figma, Astroship (GPL), Typed.js v3 (GPL), ScrollReveal
  (GPL).
- Pas de conformité RGAA vendue.
