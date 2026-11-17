import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { byDeptOrder } from '../lib/order';
import { useTitle } from '../lib/useTitle';

export default function Teachers() {
  useTitle('Багш нар');
  const [items, setItems] = useState([]);
  const [q, setQ] = useState('');
  const [state, setState] = useState('loading');

  useEffect(() => {
    supabase.from('teachers').select('*').then(({ data, error }) => {
      if (error) return setState('error');
      setItems([...data].sort(byDeptOrder)); setState('ready');
    });
  }, []);

  if (state === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (state === 'error') return <main className="container section"><p>Багш нарын мэдээллийг ачаалж чадсангүй.</p></main>;

  const shown = items.filter((t) =>
    `${t.name} ${t.position || ''} ${t.courses || ''} ${t.research || ''}`.toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="container section">
      <h1 className="h2">Тэнхимийн багш нар</h1>
      <label className="inline-search">Хайх
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Нэр, хичээл, судалгааны чиглэл" />
      </label>
      {shown.length === 0 ? (
        <p className="empty">{items.length === 0 ? 'Багшийн мэдээлэл удахгүй нэмэгдэнэ.' : 'Хайлтад тохирох багш олдсонгүй.'}</p>
      ) : (
        <div className="grid grid--4">
          {shown.map((t) => (
            <Link key={t.id} to={`/teachers/${t.id}`} className="person">
              <div className="exposure exposure--portrait">
                {t.photo_url
                  ? <img src={t.photo_url} alt={t.name} loading="lazy" />
                  : <span className="exposure__initial" aria-hidden="true">{t.name.replace(/^.\./, '')[0]}</span>}
              </div>
              <h2 className="person__name">{t.name}</h2>
              <p className="person__role">{t.position}{t.degree ? ` · ${t.degree}` : ''}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}