import { useEffect, useRef } from 'react';

// Хулганыг зөөлөн дагадаг цагираг. Товч, холбоос дээр томорно.
// Гар утас (touch) дээр харагдахгүй.
export default function Cursor() {
  const ref = useRef(null);

  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return;
    const el = ref.current;
    let x = -100, y = -100, tx = -100, ty = -100;
    let raf;

    const move = (e) => {
      tx = e.clientX;
      ty = e.clientY;
      const hover = e.target.closest('button, a, input, textarea, [data-hover]');
      el.classList.toggle('is-hover', Boolean(hover));
      el.classList.add('is-visible');
    };
    const down = () => el.classList.add('is-down');
    const up = () => el.classList.remove('is-down');
    const leave = () => el.classList.remove('is-visible');

    const loop = () => {
      x += (tx - x) * 0.22;
      y += (ty - y) * 0.22;
      el.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      raf = requestAnimationFrame(loop);
    };
    loop();

    window.addEventListener('pointermove', move);
    window.addEventListener('pointerdown', down);
    window.addEventListener('pointerup', up);
    document.addEventListener('pointerleave', leave);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerdown', down);
      window.removeEventListener('pointerup', up);
      document.removeEventListener('pointerleave', leave);
    };
  }, []);

  return (
    <div ref={ref} className="cursor-ring" aria-hidden="true">
      <span />
    </div>
  );
}
