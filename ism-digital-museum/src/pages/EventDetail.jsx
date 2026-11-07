import { useCallback, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { dateMn } from '../lib/format';

export default function EventDetail() {
  const { id } = useParams();
  const [ev, setEv] = useState(null);
  const [photos, setPhotos] = useState([]);
  const [open, setOpen] = useState(null); // index of photo in lightbox
  const [state, setState] = useState('loading');

  useEffect(() => {
    (async () => {
      const e = await supabase.from('events').select('*').eq('id', id).maybeSingle();
      if (e.error) return setState('error');
      if (!e.data) return setState('missing');
      const p = await supabase.from('event_photos').select('*').eq('event_id', id).order('id');
      setEv(e.data); setPhotos(p.data || []); setState('ready');
    })();
  }, [id]);

  const step = useCallback((d) => setOpen((i) => (i === null ? i : (i + d + photos.length) % photos.length)), [photos.length]);

  useEffect(() => {
    if (open === null) return;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(null);
      if (e.key === 'ArrowRight') step(1);
      if (e.key === 'ArrowLeft') step(-1);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, step]);

  if (state === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (state !== 'ready') return (
    <main className="container section">
      <h1 className="h2">Арга хэмжээ олдсонгүй</h1>
      <Link to="/events" className="link">Жагсаалт руу буцах</Link>
    </main>
  );

  return (
    <main className="container section">
      <p className="meta">{dateMn(ev.event_date)}</p>
      <h1 className="h2">{ev.title}</h1>
      {ev.cover_image_url && (
        <div className="exposure exposure--large gap-top"><img src={ev.cover_image_url} alt={ev.title} /></div>
      )}
      {ev.description && <p className="prose">{ev.description}</p>}

      <h2 className="h3 gap-top">Зурагт цомог</h2>
      {photos.length === 0 ? (
        <p className="empty">Энэ арга хэмжээний зураг оруулаагүй байна.</p>
      ) : (
        <div className="gallery">
          {photos.map((p, i) => (
            <button key={p.id} className="gallery__item" onClick={() => setOpen(i)} aria-label={`Зураг ${i + 1} томоор харах`}>
              <img src={p.image_url} alt={p.caption || `${ev.title} зураг ${i + 1}`} loading="lazy" />
              {p.caption && <span>{p.caption}</span>}
            </button>
          ))}
        </div>
      )}

      {open !== null && (
        <div className="lightbox" role="dialog" aria-modal="true" aria-label="Зураг томоор" onClick={() => setOpen(null)}>
          <button className="btn lightbox__close" onClick={() => setOpen(null)}>Хаах</button>
          <button className="btn lightbox__nav lightbox__prev" onClick={(e) => { e.stopPropagation(); step(-1); }} aria-label="Өмнөх">‹</button>
          <figure onClick={(e) => e.stopPropagation()}>
            <img src={photos[open].image_url} alt={photos[open].caption || ''} />
            {photos[open].caption && <figcaption>{photos[open].caption}</figcaption>}
          </figure>
          <button className="btn lightbox__nav lightbox__next" onClick={(e) => { e.stopPropagation(); step(1); }} aria-label="Дараах">›</button>
        </div>
      )}
      <p className="gap-top"><Link to="/events" className="link">← Бүх арга хэмжээ</Link></p>
    </main>
  );
}