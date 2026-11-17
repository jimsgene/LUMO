import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useTitle } from '../lib/useTitle';
import { useAsync, must } from '../lib/useAsync';
import { creatorName, creatorKey } from '../lib/plate';

const load = () => supabase.from('exhibits').select('*, profiles(display_name)')
  .eq('status', 'approved').order('year_created', { ascending: false }).then(must);

// ISM Creators: students and teams, each with their published works.
// Grouped by the named authors when given, otherwise by the submitting account.
export default function Creators() {
  useTitle('Бүтээгчид');
  const { status, data } = useAsync(load);
  const [q, setQ] = useState('');

  const list = useMemo(() => {
    const groups = new Map();
    (data || []).forEach((x) => {
      const k = creatorKey(x);
      if (!groups.has(k)) groups.set(k, { key: k, name: creatorName(x) || 'Нэргүй', works: [] });
      groups.get(k).works.push(x);
    });
    return [...groups.values()].sort((a, b) => b.works.length - a.works.length || a.name.localeCompare(b.name, 'mn'));
  }, [data]);

  if (status === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (status === 'error') return <main className="container section"><p>Бүтээгчдийг ачаалж чадсангүй.</p></main>;

  const shown = list.filter((u) => u.name.toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="container section">
      <h1 className="h2">ISM бүтээгчид</h1>
      <p className="lead">Үзмэр нийтлүүлсэн оюутан, баг, багш нар болон тэдний бүтээлүүд.</p>
      <label className="inline-search">Хайх
        <input type="search" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Бүтээгч эсвэл багийн нэр" />
      </label>
      {shown.length === 0 ? (
        <p className="empty">{list.length === 0 ? 'Одоогоор нийтлэгдсэн бүтээл алга.' : 'Бүтээгч олдсонгүй.'}</p>
      ) : (
        <div className="grid grid--3">
          {shown.map((u) => (
            <article key={u.key} className="creator">
              <h2 className="person__name">{u.name}</h2>
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
