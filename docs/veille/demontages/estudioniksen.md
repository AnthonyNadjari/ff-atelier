# Estudio Niksen — https://estudioniksen.com/
Marque de vêtements et boutique physique, 655 Desnoyers, Montréal (Québec), adresse et horaires dans le pied de page ; site en anglais avec bascule En/Fr. Fiche Awwwards datée du 15 octobre 2026 (awwwards.com/sites/estudio-niksen), sans prix lu. Shopify (thème Tailwind), Lenis, Swiper.

## Squelette
Une phrase seule au-dessus de tout : « All prices include duties and taxes. No surprises at delivery. » Puis nav fine sur une ligne : Shop / Projects / About / Support à gauche, logo manuscrit centré, Search / langue / « Cart - 0 » à droite ; téléphone : « Menu », logo, « Cart - 0 ». Ordre : grande photo de campagne avec marges de 2 px (plein cadre presque bord à bord), « Fall Winter '26 / Drop 2 is now live! » en bas à gauche → carrousel de nouveautés (photo produit portée, nom, prix) → alternance **« media callout »** plein écran (Niksen Walking Volume 2, Selvedge Denim, Trainer 80s avec Saucony, Niksen Sounds) et blocs **« Shop the look »** : une grande photo portée à gauche, les pièces de la tenue à droite avec la taille du mannequin (« Tyrone is 6'0" and wearing size 2 for all tops and size 2 for bottoms ») → grille Outerwear / Shirts / Bottoms → « Join the family » (dessin au trait) → pied en colonnes : adresse, **horaires jour par jour** (S M T W T F S, « 12 - 5 p.m. »), réseaux, informations.
En 3 secondes : une photo de paysage avec une personne, la saison, un bouton.

## Typographie
Lues dans le CSS : **PP Neue Montreal** Regular/Medium/Bold (auto-hébergée dans le thème), H1 42 px ordinateur / 29 px téléphone, interlignage 1, interlettrage -0,035 em, casse normale ; **PP Frama** déclarée. Libellés en capitales petites (13-14 px). Rien de rare : la retenue (une famille, deux graisses) laisse toute la place aux photos.

## Couleur et matière
Fond blanc `#FFF`, texte noir, gris `#F0F0F0` en fond d'attente des images ; aucune couleur d'accent. Photos réelles de campagne, lumière naturelle, paysages du Québec, gros plans de matières (denim selvedge, tricot), et photos produit portées sur fond neutre.

## Mouvement
Lenis (lu), Swiper. `view-transition` présent 7 fois dans le CSS (transitions de page natives). Courbes lues : `cubic-bezier(0,0,.2,1)` ×8 (ease-out), `cubic-bezier(.215,.61,.355,1)` 0,25 s sur `clip-path` et `opacity`. Vidéo MP4 dans un des callouts. Rien n'est épinglé.

## Le geste signature
« Shop the look » avec la mesure du mannequin et la taille portée : la photo répond à la question que le client poserait au comptoir. Chez nous : l'équivalent artisan est la mesure de référence à côté de la photo (« table de 180 x 90 cm, ici avec 6 chaises », « bouquet taille M, 45 cm ») : un `<figcaption>` de mesure sous chaque photo de réalisation, CSS pur.

## Ce qu'on garde / ce qu'on refuse
Garde : la phrase de réassurance unique en tête (« prix TTC, pas de surprise ») ; la légende de mesure sous les photos ; les horaires jour par jour dans le pied ; une seule famille typographique.
Refuse : la fenêtre « Join the family » qui reste ouverte en bas à droite sur toute la planche ; des marges de 2 px autour des photos qui font accident sur téléphone ; libellés en capitales partout (GOUT § 2).
