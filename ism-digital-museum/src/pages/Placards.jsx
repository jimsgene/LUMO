import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAsync, must } from '../lib/useAsync';
import { useTitle } from '../lib/useTitle';
import { plateNumber, techList, creatorName } from '../lib/plate';
import QR from '../components/QR';
import { exhibitUrl } from '../lib/links';

const load = () => supabase.from('exhibits').select('*, profiles(display_name)')
  .eq('status', 'approved').order('year_created', { ascending: false }).then(must);

// Printable museum labels (one per approved exhibit) with a QR code linking to the exhibit page.
// /placards?ids=a,b prints only the chosen exhibits.
export default function Placards() {
  useTitle('Хэвлэх шошго');
  const [params] = useSearchParams();
  const { status, data } = useAsync(load);
  const preset = useMemo(() => (params.get('ids') || '').split(',').filter(Boolean), [params]);
  const [picked, setPicked] = useState(null); // null = use preset / all
  const [year, setYear] = useState('');

  if (status === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (status === 'error') return <main className="container section"><p>Үзмэрийг ачаалж чадсангүй.</p></main>;

  const all = data;
  const selected = picked ?? new Set(preset.length ? preset : all.map((x) => x.id));
  const toggle = (id) => {
    const next = new Set(selected);
    if (next.has(id)) next.delete(id); else next.add(id);
    setPicked(next);
  };
  const years = [...new Set(all.map((x) => x.year_created).filter(Boolean))];
  const list = all.filter((x) => (!year || String(x.year_created) === year));
  const printable = all.filter((x) => selected.has(x.id));

  return (
    <main className="container section placards">
      <div className="no-print">
        <h1 className="h2">Үзэсгэлэнгийн шошго</h1>
        <p className="lead">Үзмэр бүрийн хажууд тавих хэвлэмэл шошго. QR кодыг утсаар уншуулахад тухайн үзмэрийн хуудас нээгдэнэ.
          A4 хуудсанд 4 шошго багтана.</p>
        <div className="toolbar">
          <label>Он
            <select value={year} onChange={(e) => setYear(e.target.value)}>
              <option value="">Бүх он</option>{years.map((y) => <option key={y}>{y}</option>)}
            </select>
          </label>
        </div>
        <div className="actions">
          <button className="btn" onClick={() => setPicked(new Set(list.map((x) => x.id)))}>Бүгдийг сонгох</button>
          <button className="btn" onClick={() => setPicked(new Set())}>Цэвэрлэх</button>
          <button className="btn btn--solid" disabled={!printable.length} onClick={() => window.print()}>
            <Printer size={18} /> {printable.length} шошго хэвлэх
          </button>
        </div>
        <ul className="pick-list">
          {list.map((x) => (
            <li key={x.id}><label><input type="checkbox" checked={selected.has(x.id)} onChange={() => toggle(x.id)} /> {x.title} <span className="meta">{x.year_created}</span></label></li>
          ))}
        </ul>
        {all.length === 0 && <p className="empty">Нийтлэгдсэн үзмэр алга. <Link className="link" to="/dashboard">Үзмэр нэмэх</Link></p>}
        <h2 className="h3 gap-top">Урьдчилан харах</h2>
      </div>
      <div className="placard-sheet">
        {printable.map((x) => (
          <article key={x.id} className="placard">
            <div className="placard__text">
              <p className="meta">{plateNumber(x)}</p>
              <h2 className="placard__title">{x.title}</h2>
              <p className="placard__by">{creatorName(x) || 'ISM оюутан'}{x.year_created ? `, ${x.year_created}` : ''}</p>
              {x.category && <p className="placard__cat">{x.category}</p>}
              {techList(x.technology_stack).length > 0 && <p className="placard__tech">{techList(x.technology_stack).join(' · ')}</p>}
              {x.description && <p className="placard__desc">{x.description.length > 180 ? `${x.description.slice(0, 180)}…` : x.description}</p>}
            </div>
            <div className="placard__qr">
              <QR value={exhibitUrl(x.id)} size={110} />
              <span>Утсаараа уншуулна уу</span>
            </div>
            <p className="placard__foot">ISM Дижитал музей · Мэдээллийн Системийн Менежментийн Тэнхим</p>
          </article>
        ))}
      </div>
    </main>
  );
}
