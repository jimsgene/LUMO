import { useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAsync, must } from '../lib/useAsync';
import { useTitle } from '../lib/useTitle';
import { getPopularity } from '../lib/engagement';
import { matches } from '../lib/similar';
import ExhibitCard from '../components/ExhibitCard';
import { techList, creatorName } from '../lib/plate';

const SORTS = {
  new: { label: 'Шинэ нь эхэндээ', fn: (a, b) => (b.year_created || 0) - (a.year_created || 0) || String(b.created_at).localeCompare(String(a.created_at)) },
  old: { label: 'Хуучин нь эхэндээ', fn: (a, b) => (a.year_created || 0) - (b.year_created || 0) },
  az: { label: 'Нэрээр (А-Я)', fn: (a, b) => a.title.localeCompare(b.title, 'mn') },
  popular: { label: 'Их үзэлттэй', needsStats: true },
  liked: { label: 'Их таалагдсан', needsStats: true },
};

async function load() {
  const [items, cats, pop] = await Promise.all([
    supabase.from('exhibits').select('*, profiles(display_name)').eq('status', 'approved').then(must),
    supabase.from('exhibition_categories').select('name').order('name').then((r) => r.data || []),
    getPopularity(),
  ]);
  return { items, cats, pop };
}

export default function Exhibits() {
  useTitle('Үзмэр');
  const [params, setParams] = useSearchParams();
  const { status, data } = useAsync(load);
  // Filters live in the URL so a filtered view can be shared or bookmarked.
  const q = params.get('q') || '', cat = params.get('cat') || '', year = params.get('year') || '', tech = params.get('tech') || '';
  const sort = SORTS[params.get('sort')] ? params.get('sort') : 'new';
  const set = (k) => (e) => {
    const next = new URLSearchParams(params);
    const v = e.target.value;
    if (v && !(k === 'sort' && v === 'new')) next.set(k, v); else next.delete(k);
    next.delete('focus');
    setParams(next, { replace: true });
  };
  const clear = () => setParams({}, { replace: true });

  const items = useMemo(() => data?.items ?? [], [data]);
  const pop = data?.pop ?? null;
  const years = useMemo(() => [...new Set(items.map((i) => i.year_created).filter(Boolean))].sort((a, b) => b - a), [items]);
  const techs = useMemo(() => [...new Set(items.flatMap((i) => techList(i.technology_stack)))].sort(), [items]);

  const shown = useMemo(() => {
    const list = items.filter((i) => {
      const t = techList(i.technology_stack);
      return (!q || matches(`${i.title} ${i.description || ''} ${creatorName(i)} ${t.join(' ')}`, q))
        && (!cat || i.category === cat)
        && (!year || String(i.year_created) === year)
        && (!tech || t.includes(tech));
    });
    const stat = (x, k) => pop?.[x.id]?.[k] || 0;
    const cmp = sort === 'popular' ? (a, b) => stat(b, 'views') - stat(a, 'views')
      : sort === 'liked' ? (a, b) => stat(b, 'likes') - stat(a, 'likes')
      : SORTS[sort].fn;
    return [...list].sort(cmp);
  }, [items, pop, q, cat, year, tech, sort]);

  if (status === 'loading') return <main className="container section"><h1 className="h2">Үзмэр</h1><div className="grid grid--3 gap-top">{[1, 2, 3].map((i) => <div key={i} className="skeleton skeleton--card" />)}</div></main>;
  if (status === 'error') return <main className="container section"><p>Үзмэрийг ачаалж чадсангүй. Хуудсаа дахин ачаална уу.</p></main>;

  const active = q || cat || year || tech;
  return (
    <main className="container section">
      <h1 className="h2">Үзмэр</h1>
      <div className="catalog">
        <aside className="filters" aria-label="Шүүлтүүр">
          <label>Хайх
            <input type="search" value={q} autoFocus={params.get('focus') === 'search'}
              onChange={set('q')} placeholder="Нэр, бүтээгч, технологи" />
          </label>
          <label>Эрэмбэ
            <select value={sort} onChange={set('sort')}>
              {Object.entries(SORTS).filter(([, s]) => !s.needsStats || pop).map(([k, s]) => <option key={k} value={k}>{s.label}</option>)}
            </select>
          </label>
          <label>Ангилал
            <select value={cat} onChange={set('cat')}>
              <option value="">Бүх ангилал</option>
              {data.cats.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label>Он
            <select value={year} onChange={set('year')}>
              <option value="">Бүх он</option>
              {years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
          <label>Технологи
            <select value={tech} onChange={set('tech')}>
              <option value="">Бүх технологи</option>
              {techs.map((t) => <option key={t}>{t}</option>)}
            </select>
          </label>
          {active && <button className="btn" onClick={clear}>Шүүлтүүр арилгах</button>}
        </aside>
        <section>
          <p className="meta" aria-live="polite">{items.length} үзмэрийн {shown.length}</p>
          {shown.length === 0 ? (
            <p className="empty">Таны хайлтад тохирох үзмэр олдсонгүй. <button className="link" onClick={clear}>Шүүлтүүр арилгах</button></p>
          ) : (
            <div className="grid grid--3">{shown.map((e) => <ExhibitCard key={e.id} exhibit={e} stats={pop?.[e.id]} />)}</div>
          )}
        </section>
      </div>
    </main>
  );
}
