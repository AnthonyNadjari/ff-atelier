/**
 * La travée (style travee, docs/veille/styles/travee.md § Le geste signature) : une piste horizontale NATIVE
 * (overflow-x + scroll-snap, CSS des sections Hero/travee et Proof/travee) qu'on fait glisser au doigt, à la molette
 * horizontale ou au clavier (la piste a tabindex="0" : flèches gauche / droite du navigateur). Ce script n'ajoute que
 * le confort, jamais le défilement lui-même :
 *   - les boutons précédent / suivant (cachés sans script) amènent la vue voisine (scrollTo, doux sauf mouvement réduit) ;
 *   - le compte « 2 sur 7 » et la légende de la vue du moment ([data-legende] de chaque <li>) ;
 *   - la classe .is-ici sur la vue du moment (la photo s'y pose : transition en temps, jamais calée sur le défilement).
 * Rien ne tourne tout seul (GOUT § 4), aucun défilement vertical n'est détourné. Idempotent (data-travee-pret).
 */
export function initTravees(): void {
  const doux = !matchMedia('(prefers-reduced-motion: reduce)').matches && document.documentElement.dataset.motion !== 'none';
  document.querySelectorAll<HTMLElement>('[data-travee]').forEach((bloc) => {
    if (bloc.dataset.traveePret) return;
    const piste = bloc.querySelector<HTMLElement>('[data-travee-piste]');
    if (!piste) return;
    bloc.dataset.traveePret = '1';
    const vues = [...piste.children] as HTMLElement[];
    const prec = bloc.querySelector<HTMLButtonElement>('[data-travee-prec]');
    const suiv = bloc.querySelector<HTMLButtonElement>('[data-travee-suiv]');
    const compte = bloc.querySelector<HTMLElement>('[data-travee-compte]');
    const legende = bloc.querySelector<HTMLElement>('[data-travee-legende]');
    bloc.querySelectorAll<HTMLElement>('[data-travee-sans-script]').forEach((el) => el.removeAttribute('hidden'));
    if (doux) bloc.classList.add('travee-vivante');

    const gauche = (v: HTMLElement) => v.offsetLeft - piste.offsetLeft - (parseFloat(getComputedStyle(piste).scrollPaddingLeft) || 0);
    let ici = -1;
    const maj = () => {
      const x = piste.scrollLeft;
      let i = 0;
      let mieux = Infinity;
      vues.forEach((v, k) => {
        const d = Math.abs(gauche(v) - x);
        if (d < mieux) { mieux = d; i = k; }
      });
      // En bout de piste (la dernière vue ne peut pas venir à gauche), la dernière est celle du moment.
      if (x + piste.clientWidth >= piste.scrollWidth - 4) i = vues.length - 1;
      if (prec) prec.disabled = x <= 4;
      if (suiv) suiv.disabled = x + piste.clientWidth >= piste.scrollWidth - 4;
      if (i === ici) return;
      ici = i;
      vues.forEach((v, k) => v.classList.toggle('is-ici', k === i));
      if (compte) compte.textContent = `${i + 1} sur ${vues.length}`;
      if (legende) {
        const l = vues[i].dataset.legende ?? '';
        const href = vues[i].dataset.lien;
        legende.replaceChildren();
        if (l && href) {
          const a = document.createElement('a');
          a.href = href;
          a.textContent = l;
          legende.append(a);
        } else legende.textContent = l;
      }
    };
    let attente = 0;
    piste.addEventListener('scroll', () => {
      cancelAnimationFrame(attente);
      attente = requestAnimationFrame(maj);
    }, { passive: true });
    addEventListener('resize', maj, { passive: true });
    const aller = (sens: 1 | -1) => {
      const x = piste.scrollLeft;
      const cibles = vues.map(gauche);
      const cible = sens > 0 ? cibles.find((g) => g > x + 4) : [...cibles].reverse().find((g) => g < x - 4);
      piste.scrollTo({ left: cible ?? (sens > 0 ? piste.scrollWidth : 0), behavior: doux ? 'smooth' : 'auto' });
    };
    prec?.addEventListener('click', () => aller(-1));
    suiv?.addEventListener('click', () => aller(1));
    maj();
  });
}
