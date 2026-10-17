/**
 * Sommaire actif (scroll-spy) des coquilles `sidebar` et `split` (docs/veille/squelettes.md § 3b n°3,
 * docs/CONVENTIONS.md § Coquilles) : les liens d'ancre d'un conteneur `[data-scrollspy]` suivent la
 * section visible. Le lien actif recoit `aria-current="true"` et la classe `is-active` (stylee par la
 * coquille, tokens uniquement) ; un compteur optionnel `[data-scrollspy-index]` dans le meme conteneur
 * affiche « 02 / 06 ». Zero mouvement, aucune animation ici : ce qui bouge est en CSS sur --motion-ui,
 * et prefers-reduced-motion coupe la transition dans la coquille.
 *
 * Mecanique : un IntersectionObserver par conteneur, marge `-35% 0px -55% 0px` (une bande autour du
 * tiers superieur de l'ecran) ; parmi les sections qui la traversent, la premiere dans l'ordre du
 * document est active. Le hero (`#hero`, pas de lien) desactive tout : aucun lien n'est courant au
 * premier ecran. Ne vole jamais le focus clavier (aucun focus() ici).
 *
 * Avec ClientRouter (site.transitions) : appele via onPage() par la coquille, l'ancien observateur
 * disparait avec l'ancien body (les cibles sont detachees), le nouveau est cree sur le nouveau body.
 */
export function initScrollSpy(): void {
  document.querySelectorAll<HTMLElement>('[data-scrollspy]').forEach((nav) => {
    if (nav.dataset.scrollspyReady) return;
    nav.dataset.scrollspyReady = '1';
    // Ancres « #x » ou « /#x » (navLinks écrit « /#x » pour marcher depuis toute page, 17 oct 2026).
    const links = Array.from(nav.querySelectorAll<HTMLAnchorElement>('a[href^="#"], a[href^="/#"]'));
    const pairs = links
      .map((a) => ({ a, target: document.getElementById(a.getAttribute('href')!.replace(/^\/?#/, '')) }))
      .filter((p): p is { a: HTMLAnchorElement; target: HTMLElement } => Boolean(p.target));
    if (!pairs.length) return;
    const counter = nav.querySelector<HTMLElement>('[data-scrollspy-index]');
    const total = String(pairs.length).padStart(2, '0');
    const visible = new Set<Element>();

    const apply = () => {
      const current = pairs.find((p) => visible.has(p.target));
      pairs.forEach(({ a }) => {
        const on = a === current?.a;
        a.classList.toggle('is-active', on);
        if (on) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
      if (counter) {
        const i = current ? pairs.indexOf(current) + 1 : 0;
        counter.textContent = `${String(i).padStart(2, '0')} / ${total}`;
        counter.classList.toggle('is-active', i > 0);
      }
    };

    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) visible.add(e.target);
          else visible.delete(e.target);
        }
        apply();
      },
      { rootMargin: '-35% 0px -55% 0px', threshold: 0 },
    );
    pairs.forEach(({ target }) => io.observe(target));
    apply();
  });
}
