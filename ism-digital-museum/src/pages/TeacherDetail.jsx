import { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Mail, MapPin, GraduationCap } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAsync, must } from '../lib/useAsync';
import { useTitle } from '../lib/useTitle';

const lines = (s) => (s || '').split('\n').map((x) => x.trim()).filter(Boolean);
const list = (s) => (s || '').split(/[,\n;]/).map((x) => x.trim()).filter(Boolean);

const TABS = [
  { k: 'bio', label: 'Товч танилцуулга' },
  { k: 'research', label: 'Судалгааны чиглэл' },
  { k: 'publications', label: 'Бүтээлийн жагсаалт' },
  { k: 'activities', label: 'Мэргэжлийн үйл ажиллагаа' },
  { k: 'awards', label: 'Шагнал' },
];

export default function TeacherDetail() {
  const { id } = useParams();
  const { status, data: t } = useAsync(
    () => supabase.from('teachers').select('*').eq('id', id).maybeSingle().then(must), id);
  const [tab, setTab] = useState(null);
  useTitle(t?.name || 'Багш');

  if (status === 'loading') return <main className="container section"><div className="skeleton skeleton--detail" aria-label="Ачаалж байна" /></main>;
  if (status === 'error' || !t) return (
    <main className="container section">
      <h1 className="h2">Багш олдсонгүй</h1>
      <Link to="/teachers" className="link">Багш нарын жагсаалт руу буцах</Link>
    </main>
  );

  const courses = list(t.courses);
  const tabs = TABS.filter((x) => (x.k === 'research' ? list(t.research).length : lines(t[x.k]).length));
  const active = tabs.find((x) => x.k === tab) ? tab : tabs[0]?.k;

  return (
    <main className="container section">
      <div className="detail detail--teacher">
        <div className="exposure exposure--portrait">
          {t.photo_url
            ? <img src={t.photo_url} alt={t.name} />
            : <span className="exposure__initial" aria-hidden="true">{t.name.replace(/^.\./, '')[0]}</span>}
        </div>
        <div>
          <p className="meta">{t.position}{t.degree ? ` · ${t.degree}` : ''}</p>
          <h1 className="h2">{t.name}</h1>
          <ul className="teacher__contact">
            {t.email && <li><Mail size={16} aria-hidden="true" /> <a className="link" href={`mailto:${t.email}`}>{t.email}</a></li>}
            {t.office && <li><MapPin size={16} aria-hidden="true" /> {t.office}</li>}
          </ul>
          {lines(t.education).length > 0 && (
            <>
              <h2 className="h3 gap-top"><GraduationCap size={20} aria-hidden="true" /> Боловсрол</h2>
              <ul className="teacher__list">{lines(t.education).map((e) => <li key={e}>{e}</li>)}</ul>
            </>
          )}
          {lines(t.certification).length > 0 && (
            <>
              <h2 className="h3 gap-top">Мэргэшлийн зэрэг</h2>
              <ul className="teacher__list">{lines(t.certification).map((e) => <li key={e}>{e}</li>)}</ul>
            </>
          )}
          {courses.length > 0 && (
            <>
              <h2 className="h3 gap-top">Заадаг хичээл</h2>
              <ul className="chips">{courses.map((c) => <li key={c}>{c}</li>)}</ul>
            </>
          )}
        </div>
      </div>

      {tabs.length > 0 && (
        <section className="gap-top">
          <div className="tabs" role="tablist" aria-label="Багшийн мэдээлэл">
            {tabs.map((x) => (
              <button key={x.k} role="tab" className="tab" aria-selected={active === x.k} aria-pressed={active === x.k}
                onClick={() => setTab(x.k)}>{x.label}</button>
            ))}
          </div>
          <div role="tabpanel" className="teacher__panel">
            {active === 'bio' && lines(t.bio).map((p) => <p key={p} className="prose teacher__bio">{p}</p>)}
            {active === 'research' && <ul className="chips">{list(t.research).map((r) => <li key={r}>{r}</li>)}</ul>}
            {['publications', 'activities', 'awards'].includes(active) && (
              <ul className={`teacher__list${active === 'awards' ? ' teacher__list--awards' : ''}`}>
                {lines(t[active]).map((l) => <li key={l}>{l}</li>)}
              </ul>
            )}
          </div>
        </section>
      )}
      <p className="gap-top"><Link to="/teachers" className="link">← Бүх багш</Link></p>
    </main>
  );
}
