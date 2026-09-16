/**
 * LUXE — lueur radiale douce qui suit le curseur (pointer:fine uniquement).
 */
export default function init(root: HTMLElement) {
  if (!window.matchMedia('(pointer: fine)').matches) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  const glow = document.createElement('div');
  glow.className = 'luxe-cursor-glow';
  document.body.appendChild(glow);

  let raf = 0;
  const onMove = (e: PointerEvent) => {
    if (raf) return;
    raf = requestAnimationFrame(() => {
      glow.style.setProperty('--x', `${e.clientX}px`);
      glow.style.setProperty('--y', `${e.clientY}px`);
      glow.classList.add('is-active');
      raf = 0;
    });
  };
  const onLeave = () => glow.classList.remove('is-active');

  root.addEventListener('pointermove', onMove);
  root.addEventListener('pointerleave', onLeave);
}
