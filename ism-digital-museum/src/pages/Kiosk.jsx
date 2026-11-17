import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Maximize, Pause, Play, X } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAsync, must } from '../lib/useAsync';
import { useTitle } from '../lib/useTitle';
import { plateNumber, techList, creatorName } from '../lib/plate';
import QR from '../components/QR';
import { exhibitUrl } from '../lib/links';

const SECONDS = 10;
const REFRESH_MS = 5 * 60 * 1000; // pick up newly approved exhibits during an exhibition day

function fullscreen() {
  if (document.fullscreenElement) document.exitFullscreen();
  else document.documentElement.requestFullscreen?.().catch(() => {});
}

const load = () => supabase.from('exhibits').select('*, profiles(display_name)')
  .eq('status', 'approved').order('year_created', { ascending: false }).then(must);

// Fullscreen exhibition screen for a TV / projector: rotates approved exhibits with a QR code
// visitors can scan to open the exhibit on their phone.
export default function Kiosk() {
  useTitle('Үзэсгэлэнгийн дэлгэц');
  const { status, data, reload } = useAsync(load);
  const [i, setI] = useState(0);
  const [paused, setPaused] = useState(false);
  const items = data || [];
  const n = items.length;
  const step = useCallback((d) => setI((x) => (n ? (x + d + n) % n : 0)), [n]);

  useEffect(() => {
    if (paused || n < 2) return;
    const t = setInterval(() => step(1), SECONDS * 1000);
    return () => clearInterval(t);
  }, [paused, n, step, i]);

  useEffect(() => { const t = setInterval(reload, REFRESH_MS); return () => clearInterval(t); }, [reload]);

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'ArrowRight') step(1);
      else if (e.key === 'ArrowLeft') step(-1);
      else if (e.key === ' ') { e.preventDefault(); setPaused((p) => !p); }
      else if (e.key.toLowerCase() === 'f') fullscreen();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step]);

  if (status === 'loading') return <div className="kiosk kiosk--center"><p>Ачаалж байна…</p></div>;
  if (status === 'error' || n === 0) return (
    <div className="kiosk kiosk--center">
      <p>{status === 'error' ? 'Үзмэрийг ачаалж чадсангүй.' : 'Нийтлэгдсэн үзмэр алга.'}</p>
      <Link to="/" className="btn">Нүүр хуудас</Link>
    </div>
  );

  const ex = items[Math.min(i, n - 1)];
  const tech = techList(ex.technology_stack);
  return (
    <div className="kiosk">
      <div className="kiosk__stage" key={ex.id}>
        <div className="kiosk__img">
          {ex.image_url ? <img src={ex.image_url} alt={ex.title} /> : <span className="exposure__initial">{ex.title[0]}</span>}
        </div>
        <div className="kiosk__info">
          <p className="meta">{plateNumber(ex)} · {i + 1}/{n}</p>
          <h1 className="kiosk__title">{ex.title}</h1>
          <p className="kiosk__by">{creatorName(ex) || 'ISM оюутан'}{ex.year_created ? `, ${ex.year_created}` : ''}</p>
          {tech.length > 0 && <ul className="chips">{tech.map((t) => <li key={t}>{t}</li>)}</ul>}
          {ex.description && <p className="kiosk__desc">{ex.description.length > 260 ? `${ex.description.slice(0, 260)}…` : ex.description}</p>}
          <div className="kiosk__qr">
            <QR value={exhibitUrl(ex.id)} size={150} label="Энэ үзмэрийг утсаараа нээх QR код" />
            <p>Утасныхаа камераар уншуулж<br />дэлгэрэнгүйг үзээрэй</p>
          </div>
        </div>
      </div>
      {!paused && n > 1 && <div className="kiosk__progress" key={`p-${ex.id}`} style={{ animationDuration: `${SECONDS}s` }} />}
      <div className="kiosk__controls">
        <button className="icon-btn" onClick={() => setPaused((p) => !p)} aria-label={paused ? 'Үргэлжлүүлэх' : 'Түр зогсоох'}>{paused ? <Play /> : <Pause />}</button>
        <button className="icon-btn" onClick={fullscreen} aria-label="Бүтэн дэлгэц (F)"><Maximize /></button>
        <Link className="icon-btn" to="/" aria-label="Гарах"><X /></Link>
      </div>
      <p className="kiosk__brand">ISM Дижитал музей</p>
    </div>
  );
}
