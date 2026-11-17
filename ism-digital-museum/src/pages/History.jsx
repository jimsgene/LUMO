import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTitle } from '../lib/useTitle';
import { yearOf, dateMn } from '../lib/format';

const TYPES = { milestone: 'Түүхэн үйл явдал', event: 'Арга хэмжээ', exhibit: 'Үзмэр' };

// ISM Time Machine: түүх, арга хэмжээ, үзмэрийг он цагийн дарааллаар нэг шугамд харуулна.
export default function History() {
  useTitle('ISM Time Machine');
  const [items, setItems] = useState([]);
  const [on, setOn] = useState({ milestone: true, event: true, exhibit: true });
  const [state, setState] = useState('loading');

  useEffect(() => {
    (async () => {
      const [ms, ev, ex] = await Promise.all([
        supabase.from('milestones').select('*'),
        supabase.from('events').select('id,title,event_date,description,cover_image_url'),
        supabase.from('exhibits').select('id,title,year_created,description,image_url').eq('status', 'approved'),
      ]);
      if (ev.error || ex.error) return setState('error');
      const all = [
        ...(ms.error ? [] : ms.data).map((m) => ({ type: 'milestone', id: m.id, year: m.year, title: m.title, text: m.description, img: m.image_url })),
        ...ev.data.map((e) => ({ type: 'event', id: e.id, year: yearOf(e.event_date), title: e.title, text: dateMn(e.event_date), to: `/events/${e.id}`, img: e.cover_image_url })),
        ...ex.data.map((e) => ({ type: 'exhibit', id: e.id, year: e.year_created, title: e.title, text: e.description, to: `/exhibits/${e.id}`, img: e.image_url })),
      ].filter((i) => i.year);
      setItems(all); setState('ready');
    })();
  }, []);

  const groups = useMemo(() => {
    const g = {};
    items.filter((i) => on[i.type]).forEach((i) => { (g[i.year] = g[i.year] || []).push(i); });
    return Object.entries(g).sort((a, b) => a[0] - b[0]);
  }, [items, on]);

  if (state === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (state === 'error') return <main className="container section"><p>Түүхийг ачаалж чадсангүй.</p></main>;

  return (
    <main className="container section">
      <h1 className="h2">ISM Time Machine</h1>
      <p className="lead">Тэнхимийн түүх, арга хэмжээ, оюутнуудын бүтээлийг он цагийн дарааллаар үзнэ.</p>
      <div className="tabs" role="group" aria-label="Төрлөөр шүүх">
        {Object.entries(TYPES).map(([k, label]) => (
          <button key={k} className="tab" aria-pressed={on[k]} onClick={() => setOn({ ...on, [k]: !on[k] })}>{label}</button>
        ))}
      </div>

      {groups.length === 0 ? (
        <p className="empty">Харуулах мэдээлэл алга. Админ түүхэн үйл явдал нэмсний дараа энд харагдана.</p>
      ) : (
        <ol className="tl">
          {groups.map(([y, list]) => (
            <li key={y} className="tl__year">
              <h2 className="tl__label">{y}</h2>
              <ul className="tl__list">
                {list.map((i) => (
                  <li key={`${i.type}-${i.id}`} className={`tl__item tl__item--${i.type}${i.img ? ' tl__item--img' : ''}`}>
                    {i.img && <img className="tl__img" src={i.img} alt="" loading="lazy" />}
                    <span className="meta">{TYPES[i.type]}</span>
                    <h3 className="person__name">{i.to ? <Link to={i.to} className="link">{i.title}</Link> : i.title}</h3>
                    {i.text && <p>{i.text.length > 160 ? `${i.text.slice(0, 160)}…` : i.text}</p>}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}