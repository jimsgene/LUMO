import { useMemo } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAsync, must } from '../lib/useAsync';
import { useTitle } from '../lib/useTitle';
import { getPopularity } from '../lib/engagement';
import { techList, creatorName } from '../lib/plate';

async function load() {
  const count = (t) => supabase.from(t).select('id', { count: 'exact', head: true }).then((r) => r.count ?? 0);
  const [exhibits, teachers, events, pop] = await Promise.all([
    supabase.from('exhibits').select('*, profiles(display_name)').eq('status', 'approved').then(must),
    count('teachers'), count('events'), getPopularity(),
  ]);
  return { exhibits, teachers, events, pop };
}

const tally = (list) => {
  const m = new Map();
  list.forEach((k) => k != null && k !== '' && m.set(k, (m.get(k) || 0) + 1));
  return [...m.entries()].sort((a, b) => b[1] - a[1]);
};

function Bars({ rows, unit = '', max, link }) {
  const top = max ?? Math.max(1, ...rows.map((r) => r[1]));
  return (
    <ul className="bars">
      {rows.map(([label, n]) => (
        <li key={label} className="bars__row">
          <span className="bars__label">{link ? <Link className="link" to={link(label)}>{label}</Link> : label}</span>
          <span className="bars__track"><span className="bars__fill" style={{ width: `${(n / top) * 100}%` }} /></span>
          <span className="bars__value">{n}{unit}</span>
        </li>
      ))}
    </ul>
  );
}

export default function Insights() {
  useTitle('Статистик');
  const { status, data } = useAsync(load);

  const s = useMemo(() => {
    if (!data) return null;
    const ex = data.exhibits;
    const years = tally(ex.map((e) => e.year_created)).sort((a, b) => a[0] - b[0]);
    const tech = tally(ex.flatMap((e) => techList(e.technology_stack)));
    const cats = tally(ex.map((e) => e.category || 'Ангилалгүй'));
    const creators = tally(ex.map(creatorName).filter(Boolean));
    // "Rising": technologies that appear in the latest year but in no earlier year
    const lastYear = years.length ? years[years.length - 1][0] : null;
    const before = new Set(ex.filter((e) => e.year_created < lastYear).flatMap((e) => techList(e.technology_stack)));
    const rising = lastYear && years.length > 1
      ? [...new Set(ex.filter((e) => e.year_created === lastYear).flatMap((e) => techList(e.technology_stack)))].filter((t) => !before.has(t))
      : [];
    const top = (k) => data.pop ? ex.map((e) => [e, data.pop[e.id]?.[k] || 0]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).slice(0, 5) : [];
    const totalViews = data.pop ? Object.values(data.pop).reduce((a, p) => a + p.views, 0) : null;
    return { ex, years, tech, cats, creators, rising, lastYear, mostViewed: top('views'), mostLiked: top('likes'), totalViews };
  }, [data]);

  if (status === 'loading') return <main className="container section"><p>Тооцоолж байна…</p></main>;
  if (status === 'error') return <main className="container section"><p>Статистикийг ачаалж чадсангүй.</p></main>;

  const tiles = [
    ['Үзмэр', s.ex.length], ['Бүтээгч', s.creators.length], ['Багш', data.teachers],
    ['Арга хэмжээ', data.events], ['Технологи', s.tech.length],
    ...(s.totalViews != null ? [['Нийт үзэлт', s.totalViews]] : []),
  ];

  return (
    <main className="container section">
      <h1 className="h2">Статистик ба судалгаа</h1>
      <p className="lead">Бүх тоо нийтлэгдсэн (зөвшөөрсөн) үзмэрүүдээс шууд тооцоологдоно. Шинэ өгөгдөл нэмэхэд автоматаар шинэчлэгдэнэ.</p>

      <div className="kpis">
        {tiles.map(([label, n]) => (
          <div key={label} className="kpi"><span className="kpi__n">{n}</span><span className="meta">{label}</span></div>
        ))}
      </div>

      {s.ex.length === 0 ? <p className="empty gap-top">Нийтлэгдсэн үзмэр нэмэгдсэний дараа энд график гарна.</p> : (
        <div className="insights">
          <section className="panel">
            <h2 className="h3">Жил бүрийн үзмэр</h2>
            <Bars rows={s.years.map(([y, n]) => [String(y), n])} link={(y) => `/exhibits?year=${y}`} />
          </section>
          <section className="panel">
            <h2 className="h3">Хамгийн их ашигласан технологи</h2>
            <Bars rows={s.tech.slice(0, 10)} link={(t) => `/exhibits?tech=${encodeURIComponent(t)}`} />
          </section>
          <section className="panel">
            <h2 className="h3">Ангиллаар</h2>
            <Bars rows={s.cats.map(([c, n]) => [c, Math.round((n / s.ex.length) * 100)])} unit="%" max={100} />
          </section>
          <section className="panel">
            <h2 className="h3">Идэвхтэй бүтээгчид</h2>
            <Bars rows={s.creators.slice(0, 8)} link={(n) => `/exhibits?q=${encodeURIComponent(n)}`} />
          </section>
          {s.rising.length > 0 && (
            <section className="panel panel--accent">
              <h2 className="h3">{s.lastYear} онд шинээр гарч ирсэн технологи</h2>
              <p>Өмнөх жилүүдэд огт ашиглагдаагүй, энэ онд анх гарсан:</p>
              <ul className="chips">{s.rising.map((t) => <li key={t}>{t}</li>)}</ul>
            </section>
          )}
          {s.mostViewed.length > 0 && (
            <section className="panel">
              <h2 className="h3">Их үзэлттэй</h2>
              <Bars rows={s.mostViewed.map(([e, n]) => [e.title, n])} />
            </section>
          )}
          {s.mostLiked.length > 0 && (
            <section className="panel">
              <h2 className="h3">Их таалагдсан</h2>
              <Bars rows={s.mostLiked.map(([e, n]) => [e.title, n])} />
            </section>
          )}
        </div>
      )}
    </main>
  );
}
