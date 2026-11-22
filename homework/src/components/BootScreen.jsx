import { useEffect, useState } from 'react';
import { owner } from '../data';

const LOG = [
  'kernel: бүтээлч санаа ачааллаа',
  'mount: /home/projects',
  'coffee: 87% — хангалттай',
  'ui: цэгэн талбар бэлэн',
  'session: зочин нэвтэрлээ',
];

const DURATION = 1700;

// Ачаалах дэлгэц: 000 → 100 тоолуур, нэр үсэг үсгээр гарч ирнэ,
// дуусахад хөшиг дээшээ гулсаж ширээ нээгдэнэ.
export default function BootScreen({ onDone }) {
  const [n, setN] = useState(0);
  const [leaving, setLeaving] = useState(false);

  useEffect(() => {
    let raf;
    const start = performance.now();
    const tick = (t) => {
      const p = Math.min(1, (t - start) / DURATION);
      setN(Math.round((1 - Math.pow(1 - p, 3)) * 100)); // ease-out
      if (p < 1) raf = requestAnimationFrame(tick);
      else setLeaving(true);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  useEffect(() => {
    if (!leaving) return;
    const t = setTimeout(onDone, 750);
    return () => clearTimeout(t);
  }, [leaving, onDone]);

  // Дурын товч эсвэл дарахад алгасна
  useEffect(() => {
    const skip = () => setLeaving(true);
    window.addEventListener('keydown', skip);
    return () => window.removeEventListener('keydown', skip);
  }, []);

  return (
    <div className={`boot ${leaving ? 'is-leaving' : ''}`} onClick={() => setLeaving(true)}>
      <div className="boot-top">
        <span>{owner.firstName}/OS</span>
        <span>v2.0 · {new Date().getFullYear()}</span>
      </div>

      <h1 className="boot-name" aria-label={owner.name}>
        {owner.name.split('').map((ch, i) => (
          <span key={i} style={{ animationDelay: `${i * 45}ms` }}>
            {ch === ' ' ? ' ' : ch}
          </span>
        ))}
      </h1>

      <div className="boot-bottom">
        <ul className="boot-log">
          {LOG.filter((_, i) => n >= i * 20).map((line) => (
            <li key={line}>
              <span>ok</span> {line}
            </li>
          ))}
        </ul>
        <div className="boot-count">{String(n).padStart(3, '0')}</div>
      </div>
      <div className="boot-progress" style={{ transform: `scaleX(${n / 100})` }} />
    </div>
  );
}
