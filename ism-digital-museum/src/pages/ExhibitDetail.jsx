import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import ExhibitCard from '../components/ExhibitCard';
import { plateNumber, techList } from '../lib/plate';
import { statusMn } from '../lib/format';

export default function ExhibitDetail() {
  const { id } = useParams();
  const { user, profile } = useAuth();
  const [ex, setEx] = useState(null);
  const [more, setMore] = useState([]);
  const [state, setState] = useState('loading');

  useEffect(() => {
    setState('loading');
    (async () => {
      const { data, error } = await supabase.from('exhibits')
        .select('*, profiles(display_name)').eq('id', id).maybeSingle();
      if (error) return setState('error');
      if (!data) return setState('missing');
      setEx(data);
      const r = await supabase.from('exhibits').select('*, profiles(display_name)')
        .eq('creator_id', data.creator_id).eq('status', 'approved').neq('id', id).limit(3);
      setMore(r.data || []); setState('ready');
    })();
  }, [id]);

  if (state === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (state === 'error') return <main className="container section"><p>Үзмэрийг ачаалж чадсангүй.</p></main>;
  if (state === 'missing') return (
    <main className="container section"><h1 className="h2">Үзмэр олдсонгүй</h1>
      <Link to="/exhibits" className="link">Үзмэрийн жагсаалт руу буцах</Link></main>
  );

  const canEdit = user && (user.id === ex.creator_id || profile?.role === 'admin');
  return (
    <main className="container section">
      <div className="detail">
        <div className="exposure exposure--large detail__img">
          {ex.image_url && <img src={ex.image_url} alt={ex.title} />}
        </div>
        <div>
          <p className="meta">{plateNumber(ex)}</p>
          <h1 className="h2">{ex.title}</h1>
          {ex.status !== 'approved' && <p className="msg">Төлөв: {statusMn[ex.status]}. Зөвхөн та болон админ харна.</p>}
          <dl className="label">
            <dt>Бүтээгч</dt><dd>{ex.profiles?.display_name || 'Тодорхойгүй'}</dd>
            <dt>Он</dt><dd>{ex.year_created || '-'}</dd>
            <dt>Ангилал</dt><dd>{ex.category || '-'}</dd>
            <dt>Технологи</dt>
            <dd><ul className="chips">{techList(ex.technology_stack).map((t) => <li key={t}>{t}</li>)}</ul></dd>
          </dl>
          <div className="actions">
            {ex.demo_url && <a className="btn btn--solid" href={ex.demo_url} target="_blank" rel="noreferrer">Demo нээх</a>}
            {ex.github_url && <a className="btn" href={ex.github_url} target="_blank" rel="noreferrer">GitHub</a>}
            {canEdit && <Link className="btn" to={`/dashboard?edit=${ex.id}`}>Засах</Link>}
          </div>
        </div>
      </div>
      <p className="prose">{ex.description}</p>
      {more.length > 0 && (
        <section className="section">
          <h2 className="h2">{ex.profiles?.display_name}-ийн бусад бүтээл</h2>
          <div className="grid grid--3">{more.map((e) => <ExhibitCard key={e.id} exhibit={e} />)}</div>
        </section>
      )}
    </main>
  );
}