import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { monthMn, dayOf, yearOf } from '../lib/format';

export default function Events() {
  const [items, setItems] = useState([]);
  const [year, setYear] = useState('');
  const [q, setQ] = useState('');
  const [state, setState] = useState('loading');

  useEffect(() => {
    supabase.from('events').select('*').order('event_date', { ascending: false }).then(({ data, error }) => {
      if (error) return setState('error');
      setItems(data); setState('ready');
    });
  }, []);

  const years = useMemo(() => [...new Set(items.map((e) => yearOf(e.event_date)))], [items]);

  if (state === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (state === 'error') return <main className="container section"><p>Арга хэмжээг ачаалж чадсангүй.</p></main>;

  const shown = items.filter((e) =>
    (!year || String(yearOf(e.event_date)) === year) &&
    `${e.title} ${e.description || ''}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="container section">
      <h1 className="h2">Өдөрлөг ба арга хэмжээ</h1>
      <div className="toolbar">
        <label>Хайх
          <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Арга хэмжээний нэр" />
        </label>
        <label>Он
          <select value={year} onChange={(e) => setYear(e.target.value)}>
            <option value="">Бүх он</option>
            {years.map((y) => <option key={y}>{y}</option>)}
          </select>
        </label>
      </div>
      {shown.length === 0 ? (
        <p className="empty">{items.length === 0 ? 'Арга хэмжээ удахгүй нэмэгдэнэ.' : 'Тохирох арга хэмжээ олдсонгүй.'}</p>
      ) : (
        <ul className="events">
          {shown.map((ev) => (
            <li key={ev.id}>
              <Link to={`/events/${ev.id}`} className="event">
                <time dateTime={ev.event_date} className="event__date">
                  <span className="event__day">{dayOf(ev.event_date)}</span>
                  <span className="meta">{yearOf(ev.event_date)} · {monthMn(ev.event_date)}</span>
                </time>
                <span className="event__title">{ev.title}</span>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}