/**
 * onPage(fn) : execute `fn` une fois la page prete, ET a chaque navigation cote client quand le site
 * a `transitions: true` (ClientRouter, evenement `astro:page-load`).
 *
 * Pourquoi : les scripts inline des sections/composants (menu, formulaire, tiroir, avant/apres,
 * sommaire actif...) sont regroupes par Astro en modules externes executes UNE fois par chargement
 * complet. Avec ClientRouter, le corps de page est remplace sans rechargement : un script qui a
 * attache ses ecouteurs au chargement ne se relance pas et les nouveaux elements restent inertes.
 * Tout script inline de src/ (sections, composants, coquilles) doit donc passer par onPage()
 * — regle verifiee par tests/squelettes.test.mjs (audit des scripts inline).
 *
 * Sans ClientRouter (`data-transitions` absent sur html), `astro:page-load` n'est jamais emis :
 * `fn` est appele directement (comportement historique). Avec ClientRouter, l'evenement est emis au
 * chargement initial (sur `load`, apres l'execution des modules) puis apres chaque navigation.
 *
 * `fn` doit rester idempotent sur un meme element (poser un `data-*-ready` si un element peut etre
 * vu deux fois) : ce n'est pas le cas en pratique puisque chaque navigation remplace le body, mais
 * c'est une garantie bon marche.
 */
export function onPage(fn: () => void): void {
  if (document.documentElement.hasAttribute('data-transitions')) document.addEventListener('astro:page-load', fn);
  else fn();
}
