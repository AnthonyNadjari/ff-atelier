# profils-patients : le site d'un cabinet de santé part du patient

Volet 2a ter de `/veille`, tour du 28 oct 2026 (tour 15). Relevé au `curl` (HTML servi) de l'accueil, de la page « bébé » et
des « Informations pratiques » des Ostéopathes à Lyon Préfecture, de l'accueil et de la page « Sportifs » de Margot Debayle à
Annecy, plus un démontage automatique de l'accueil lyonnais (`ff demonter`, Chromium 390x844, capture gardée :
`profils-patients-source.jpg`). On reprend la construction, jamais les textes, images, logos ou code des sources.

## Sources

- **Ostéopathes à Lyon Préfecture** (Emeline Fantini et Rémi Borne, Lyon 3e) : [osteopathe-lyon.fr](https://osteopathe-lyon.fr/),
  [bébé](https://osteopathe-lyon.fr/bebe/), [informations pratiques](https://osteopathe-lyon.fr/informations-pratiques/), lus le
  mercredi 28 oct 2026. Sous le h1 « Ostéopathes à Lyon », **« Je suis à la recherche d'un ostéopathe pour : »** et six profils
  (femme enceinte, maman allaitante, nourrisson, enfant, adulte et sénior, sportif), **une page par profil** (pourquoi
  consulter, ce qui se passe pendant la séance, les questions des parents, « Réserver une consultation ») ; puis **les deux
  praticiens et leur spécialité** (périnatalité et allaitement ; sport et entreprises), l'accès en bus, tram, métro et vélo, trois
  avis, les questions. « Infos pratiques » : horaires, rendez-vous sur Doctolib, téléphone, tarif unique (60 €, 45 à 60 min),
  **« pas remboursée par la sécurité sociale, mais la plupart des mutuelles »**, paiements, les trois temps de la séance.
- **Margot Debayle, ostéopathe à Annecy** : [osteopathe-annecy.fr](https://www.osteopathe-annecy.fr/),
  [sportifs](https://www.osteopathe-annecy.fr/mes-domaines/sportifs/), lus le même jour. « Prendre RDV » toujours dans la barre ;
  **« Mes domaines »** (séniors, adultes, adolescents, femmes enceintes et nourrissons, sportifs), une page chacun ; sur l'accueil
  **le tableau prestation, durée moyenne, tarif fixe, remboursement** (urgence, adulte, périnatalité : 45 min, 65 €, mutuelle sur
  facture ; entreprise sur devis).

## Pages

Lyon : une douzaine (accueil, deux praticiens, six profils, infos pratiques, blog). Annecy : une quinzaine (à propos,
ostéopathie, trois services, cinq domaines, entreprises, actualités, contact).

## Navigation

Lyon : Nos praticiens, **Pour qui ?** (les six profils), Infos pratiques, Blog, Prendre rendez-vous. Annecy : À propos,
Ostéopathie, Mes services, **Mes domaines**, Entreprises, Actualités, Contact, Prendre RDV.

## Ordre de l'accueil (Lyon)

1. Photo, surtitre des deux noms, h1 « Ostéopathes à Lyon », la phrase qui nomme les profils, « Nous contacter ».
2. « Je suis à la recherche d'un ostéopathe pour : » et les six profils.
3. Les praticiens du cabinet, chacun avec sa spécialité.
4. L'accès au cabinet. 5. Les avis. 6. Les questions.

## Ce qui fait vendre

Le patient d'un ostéopathe (d'une sage-femme, d'un kiné) se demande d'abord « est-ce pour moi, pour mon bébé ? », puis
« combien, est-ce remboursé, quand ? ». Lyon répond à la première juste sous le premier écran, Annecy à la seconde par un
tableau. L'usine fait des deux un seul bloc : « Vous consultez pour », un onglet par profil, chacun avec qui il couvre, ses
motifs dans les mots du cabinet, sa durée et son prix, le praticien qui le suit et sa porte de rendez-vous ; dans le même bloc
la séance en trois temps, le tarif, la prise en charge par les mutuelles et les praticiens ; le téléphone et « Prendre
rendez-vous » en bande au-dessus du titre ; l'accès, les avis et les questions ensuite, comme à Lyon.

## Signes à NE PAS reprendre

Surtitre en capitales (« EMELINE FANTINI & RÉMI BORNE »), h1 en capitales (« OSTÉOPATHIE POUR LES SPORTIFS »), photo de banque
au premier écran, promesses de soin (« soulagement immédiat », « je vous garantis une prise en charge ») interdites à une
profession de santé (`docs/REDACTION.md`), mots en gras semés dans chaque phrase, « Sportif.ve ».

## Codée dans l'usine (28 oct 2026)

`layout: { architecture: 'profils-patients' }` (`src/lib/architectures.ts`) : coquille `profils` (`src/shells/profils.astro`),
`profils` dans le schéma (`liste[]` : slug, nom, pour, phrase, motifs, séance, durée, prix, praticiens, questions, photo ;
`praticiens[]` : slug, nom, titre, spécialités, texte, portrait, lien de rendez-vous ; `duree`, `prix`, `remboursement`,
`paiements`, `deroule[]`, `acces[]`), `src/lib/profils.ts` (`profilsComplets`, `praticiensComplets`, `praticiensDe`,
`resumeProfil`, `lienProfils`), `src/pages/consulter/[...index].astro` (tous les profils, la prise en charge, les questions) et
`[slug].astro` (le profil, ses motifs, sa séance, son praticien, ses questions en FAQPage), `wording.profils` et
`wording.consulter`, mesures `profils` (3 au moins) et `pasUrgence`, rendez-vous par `contact.bookingUrl` (ou le lien du
praticien), sections avis puis questions, pied `minimal`, tiroir de contact. Restent : une page par praticien (Lyon), les
créneaux libres (Doctolib n'a pas d'API ouverte), le tableau des prestations d'Annecy quand les prix diffèrent par profil.

Preuve : site jetable (cabinet d'essai à Reims, quatre profils et deux praticiens de démonstration, aucun avis ; sans photo,
supprimé), `ff verifier` vert hors téléphone et e-mail de test (`ff a11y`, `ff typo`, `ff ia` compris), `ff ressemblance`
contre les 39 sites du registre : au plus 0,64 au téléphone (fromagerie-ravanel-d), 0,54 à l'ordinateur (jardins-mael), 0,58
au déroulé (osteo-marchand) ; modèle « onglets », déroulé héros, outil, lieu, questions. Essais refusés : l'en-tête h1 puis
téléphone (premier écran 0,73 à 0,76 de fromagerie-ravanel-d : « h1 en haut hors de l'image, numéro sous le h1 ») : le téléphone
et le rendez-vous passent en bande au-dessus du titre ; l'accès et les praticiens hors du bloc (le bloc à onglets sous la moitié
de la page : « longue page à ancres », déroulé 0,67 à 0,70 de quatre sites). Les deux architectures du tour se ressemblent entre
elles au déroulé (0,79 : deux « onglets » au déroulé court) : métiers sans recoupement, jamais en pistes sœurs. Capture
téléphone : `profils-patients-essai.jpg` ; source : `profils-patients-source.jpg`.
