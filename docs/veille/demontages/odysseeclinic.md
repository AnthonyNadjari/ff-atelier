# Odyssée — https://www.odysseeclinic.com.au/
Cabinet de médecine esthétique, Garibaldi Village Square, 37 Alexandra St, Hunters Hill, NSW (Australie). Présenté en page d'accueil de minimal.gallery (relevé le 16 octobre 2026), « © 2026 Odyssée Clinic », « Site by Nightjar » (pied, lu dans le HTML) ; date de mise en ligne non lue. Front Next.js (Tailwind, `dpl_` Vercel), Lenis.

## Squelette
**La barre de navigation est posée au milieu du premier écran**, en travers de la photo (logo, phrase « Medical aesthetics for timeless results. », Treatments / Concerns / About / Book consultation), à 461 px du haut sur 900 ; elle remonte avec la page puis reste collée en haut (`position: sticky`, 42 px). Téléphone : logo, « Book », « Menu » sur la même ligne au milieu de l'écran. Ordre : vidéo plein écran (visage, mains) → phrase d'approche + petite photo → « Why Odyssée? (1) » compteur « 2 : 4 » sur une piste de 4 arguments → photos plein cadre (corps, regard) → « Method, not myth. » + texte science → grande photo → « Our approach » → soins / à propos en deux tuiles → pied : adresse avec « Get directions », e-mail, téléphone, **horaires jour par jour avec le jour courant mis en avant et l'état « Currently closed »** plus l'heure locale (« 7:28PM NSW »).
En 3 secondes : un visage, une ligne de nav au milieu, rien d'autre.

## Typographie
Lues dans le CSS : **Basel Grotesk** (graisse 430, corps 14 px ordinateur / 13 px téléphone) et **psTimes** (graisse 350, serif pour le texte éditorial et la phrase de la nav, 18 px). Grands paragraphes en psTimes autour de 28-32 px sur la planche (non mesuré). Libellés de nav en capitales petites. Rare : deux fichiers seulement, deux graisses intermédiaires (350, 430) choisies au point près.

## Couleur et matière
Fond crème très pâle `#FFFCF8`, texte bleu marine `#1E305E` (`rgb(30,48,94)`), blanc sur photos. Les autres hex lus (`#C48F7B`, `#DCB49C`, `#A57459`…) sont des teintes de peau des placeholders. Photos et vidéos réelles de studio, peau très proche, lumière douce ; objets en verre (bulles de sérum). Aucune texture.

## Mouvement
Lenis. CSS : `transform 1s cubic-bezier(.1,0,0,1)` (out très long), `--ease-expo-out` `cubic-bezier(.16,1,.3,1)` sur `background-size .4s` (soulignés qui se tracent), `opacity, filter .3s`. Un rideau plein écran (`.curtain`, fixe) pour les transitions de page. Vidéos en `blob:` (flux HLS). Le compteur « 2 : 4 » suit la piste horizontale.

## Le geste signature
La nav posée à mi-hauteur du hero qui devient la barre du haut en défilant : le premier écran est une affiche coupée en deux, puis l'outil reprend sa place. Chez nous : CSS pur, `header { position: sticky; top: 0 }` placé dans le DOM après un premier bloc de `50svh` (pas de JS), la photo derrière en `position: absolute` ; proche de B3 (couverture qui devient barre) mais sans animation.

## Ce qu'on garde / ce qu'on refuse
Garde : la nav à mi-hauteur qui se colle ; les horaires du jour mis en avant et « fermé en ce moment » calculé, quand les horaires sont fournis ; « Get directions » sous l'adresse ; deux polices, deux graisses précises.
Refuse : l'heure locale affichée en direct (horloge « à Paris » retirée, GOUT § 5, 13 oct 2026) ; corps à 13-14 px ; vidéo plein écran comme seul premier écran (iOS économie d'énergie) ; libellés de nav en capitales espacées (GOUT § 2).
