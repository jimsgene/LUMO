import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import ExhibitCard from '../components/ExhibitCard';
import { techList } from '../lib/plate';

export default function Exhibits() {
  const [params] = useSearchParams();
  const [items, setItems] = useState([]);
  const [cats, setCats] = useState([]);
  const [state, setState] = useState('loading');
  const [q, setQ] = useState('');
  const [cat, setCat] = useState('');
  const [year, setYear] = useState('');
  const [tech, setTech] = useState('');

  useEffect(() => {
    (async () => {
      const [ex, ca] = await Promise.all([
        supabase.from('exhibits').select('*, profiles(display_name)').eq('status', 'approved')
          .order('year_created', { ascending: false }),
        supabase.from('exhibition_categories').select('name').order('name'),
      ]);
      if (ex.error) return setState('error');
      setItems(ex.data); setCats(ca.data || []); setState('ready');
    })();
  }, []);

  const years = useMemo(() => [...new Set(items.map((i) => i.year_created).filter(Boolean))].sort((a, b) => b - a), [items]);
  const techs = useMemo(() => [...new Set(items.flatMap((i) => techList(i.technology_stack)))].sort(), [items]);

  const shown = items.filter((i) => {
    const t = techList(i.technology_stack);
    const hay = `${i.title} ${i.description || ''} ${i.profiles?.display_name || ''} ${t.join(' ')}`.toLowerCase();
    return (!q || hay.includes(q.toLowerCase()))
      && (!cat || i.category === cat)
      && (!year || String(i.year_created) === year)
      && (!tech || t.includes(tech));
  });
  const clear = () => { setQ(''); setCat(''); setYear(''); setTech(''); };

  if (state === 'loading') return <main className="container section"><p>Үзмэрийг ачаалж байна…</p></main>;
  if (state === 'error') return <main className="container section"><p>Үзмэрийг ачаалж чадсангүй. Хуудсаа дахин ачаална уу.</p></main>;

  return (
    <main className="container section">
      <h1 className="h2">Үзмэр</h1>
      <div className="catalog">
        <aside className="filters" aria-label="Шүүлтүүр">
          <label>Хайх
            <input type="search" value={q} autoFocus={params.get('focus') === 'search'}
              onChange={(e) => setQ(e.target.value)} placeholder="Нэр, бүтээгч, технологи" />
          </label>
          <label>Ангилал
            <select value={cat} onChange={(e) => setCat(e.target.value)}>
              <option value="">Бүх ангилал</option>
              {cats.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label>Он
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Бүх он</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label>Технологи
            <select value={tech} onChange={(e) => setTech(e.target.value)}>
              <option value="">Бүх технологи</option>
              {techs.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          <button className="btn" onClick={clear}>Шүүлтүүр арилгах</button>
        </aside>
        <section>
          <p className="meta" aria-live="polite">{items.length} үзмэрийн {shown.length}</p>
          {shown.length === 0 ? (
            <p className="empty">Таны хайлтад тохирох үзмэр олдсонгүй. <button className="link" onClick={clear}>Шүүлтүүр арилгах</button></p>
          ) : (
            <div className="grid grid--3">{shown.map((e) => <ExhibitCard key={e.id} exhibit={e} />)}</div>
          )}
        </section>
      </div>
    </main>
  );
}