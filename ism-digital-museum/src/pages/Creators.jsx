import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

// ISM Creators: оюутнуудыг тэдний бүтээлтэй холбож харуулна.
export default function Creators() {
  const [list, setList] = useState([]);
  const [q, setQ] = useState('');
  const [state, setState] = useState('loading');

  useEffect(() => {
    (async () => {
      const [p, e] = await Promise.all([
        supabase.from('profiles').select('id,display_name,avatar_url'),
        supabase.from('exhibits').select('id,title,year_created,creator_id').eq('status', 'approved').order('year_created', { ascending: false }),
      ]);
      if (p.error || e.error) return setState('error');
      const byCreator = {};
      e.data.forEach((x) => { (byCreator[x.creator_id] = byCreator[x.creator_id] || []).push(x); });
      setList(p.data.filter((u) => byCreator[u.id]).map((u) => ({ ...u, works: byCreator[u.id] }))
        .sort((a, b) => b.works.length - a.works.length));
      setState('ready');
    })();
  }, []);

  if (state === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (state === 'error') return <main className="container section"><p>Бүтээгчдийг ачаалж чадсангүй.</p></main>;

  const shown = list.filter((u) => (u.display_name || '').toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="container section">
      <h1 className="h2">ISM бүтээгчид</h1>
      <p className="lead">Үзмэр нийтлүүлсэн оюутнууд болон тэдний бүтээлүүд.</p>
      <label className="inline-search">Хайх
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Бүтээгчийн нэр" />
      </label>
      {shown.length === 0 ? (
        <p className="empty">{list.length === 0 ? 'Одоогоор нийтлэгдсэн бүтээл алга.' : 'Бүтээгч олдсонгүй.'}</p>
      ) : (
        <div className="grid grid--3">
          {shown.map((u) => (
            <article key={u.id} className="creator">
              <h2 className="person__name">{u.display_name || 'Нэргүй'}</h2>
              <p className="meta">{u.works.length} бүтээл</p>
              <ul className="creator__works">
                {u.works.map((w) => (
                  <li key={w.id}><Link to={`/exhibits/${w.id}`} className="link">{w.title}</Link> <span className="meta">{w.year_created}</span></li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      )}
    </main>
  );
}