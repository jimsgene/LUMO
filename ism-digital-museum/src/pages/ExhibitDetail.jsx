import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Eye, Share2, Printer } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import { useAsync, must } from '../lib/useAsync';
import { useTitle } from '../lib/useTitle';
import { getPopularity, recordView } from '../lib/engagement';
import { mostSimilar } from '../lib/similar';
import ExhibitCard from '../components/ExhibitCard';
import LikeButton from '../components/LikeButton';
import QR from '../components/QR';
import { exhibitUrl } from '../lib/links';
import { plateNumber, techList, creatorName, creatorKey } from '../lib/plate';
import { statusMn } from '../lib/format';

const COLS = '*, profiles(display_name)';

async function load(id) {
  const ex = must(await supabase.from('exhibits').select(COLS).eq('id', id).maybeSingle());
  if (!ex) return { ex: null };
  const [pool, pop] = await Promise.all([
    supabase.from('exhibits').select(COLS).eq('status', 'approved').then(must),
    ex.status === 'approved' ? getPopularity() : Promise.resolve(null),
  ]);
  const byCreator = pool.filter((x) => creatorKey(x) === creatorKey(ex) && x.id !== ex.id).slice(0, 3);
  const similar = mostSimilar(ex, pool.filter((x) => creatorKey(x) !== creatorKey(ex)), 3);
  return { ex, byCreator, similar, stats: pop ? (pop[ex.id] || { views: 0, likes: 0 }) : null };
}

export default function ExhibitDetail() {
  const { id } = useParams();
  const { user, isAdmin } = useAuth();
  const { status, data } = useAsync(() => load(id), id);
  const [likeDelta, setLikeDelta] = useState({ id: null, n: 0 });
  const [shared, setShared] = useState('');
  const ex = data?.ex;
  useTitle(ex?.title);

  useEffect(() => { if (ex?.status === 'approved') recordView(ex.id); }, [ex]);

  if (status === 'loading') return <main className="container section"><div className="skeleton skeleton--detail" aria-label="Ачаалж байна" /></main>;
  if (status === 'error') return <main className="container section"><p>Үзмэрийг ачаалж чадсангүй.</p></main>;
  if (!ex) return (
    <main className="container section"><h1 className="h2">Үзмэр олдсонгүй</h1>
      <Link to="/exhibits" className="link">Үзмэрийн жагсаалт руу буцах</Link></main>
  );

  const canEdit = user && (user.id === ex.creator_id || isAdmin);
  const likes = data.stats ? data.stats.likes + (likeDelta.id === ex.id ? likeDelta.n : 0) : null;
  const url = exhibitUrl(ex.id);

  async function share() {
    try {
      if (navigator.share) { await navigator.share({ title: ex.title, url }); return; }
      await navigator.clipboard.writeText(url);
      setShared('Холбоос хуулагдлаа');
    } catch { /* user cancelled */ }
  }

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
          {data.stats && (
            <p className="stats-line">
              <span><Eye size={16} aria-hidden="true" /> {data.stats.views} үзэлт</span>
            </p>
          )}
          <dl className="label">
            <dt>Бүтээгч</dt><dd>{creatorName(ex) || 'Тодорхойгүй'}</dd>
            <dt>Он</dt><dd>{ex.year_created || '-'}</dd>
            <dt>Ангилал</dt><dd>{ex.category || '-'}</dd>
            <dt>Технологи</dt>
            <dd><ul className="chips">{techList(ex.technology_stack).map((t) => (
              <li key={t}><Link to={`/exhibits?tech=${encodeURIComponent(t)}`}>{t}</Link></li>
            ))}</ul></dd>
          </dl>
          <div className="actions">
            {ex.demo_url && <a className="btn btn--solid" href={ex.demo_url} target="_blank" rel="noreferrer">Demo нээх</a>}
            {ex.github_url && <a className="btn" href={ex.github_url} target="_blank" rel="noreferrer">GitHub</a>}
            {ex.status === 'approved' && <LikeButton exhibitId={ex.id} count={likes}
              onChange={(d) => setLikeDelta((p) => ({ id: ex.id, n: (p.id === ex.id ? p.n : 0) + d }))} />}
            <button type="button" className="btn" onClick={share}><Share2 size={18} /> Хуваалцах</button>
            {canEdit && <Link className="btn" to={`/dashboard?edit=${ex.id}`}>Засах</Link>}
          </div>
          {shared && <p className="meta" role="status">{shared}</p>}
          {ex.status === 'approved' && (
            <div className="qr-card">
              <QR value={url} size={96} label={`${ex.title} үзмэрийн QR код`} />
              <div>
                <p className="meta">Үзэсгэлэнд зориулсан</p>
                <p>Утсаараа уншуулаад энэ хуудсыг нээнэ.</p>
                <Link className="link" to={`/placards?ids=${ex.id}`}><Printer size={14} /> Шошго хэвлэх</Link>
              </div>
            </div>
          )}
        </div>
      </div>
      {ex.description && <p className="prose">{ex.description}</p>}

      {data.similar.length > 0 && (
        <section className="section">
          <h2 className="h2">Төстэй бүтээлүүд</h2>
          <p className="lead">Ижил технологи, ангиллаар нь автоматаар олсон.</p>
          <div className="grid grid--3">
            {data.similar.map((s) => (
              <div key={s.exhibit.id}>
                <ExhibitCard exhibit={s.exhibit} />
                {s.shared.length > 0 && <p className="meta">Нийтлэг: {s.shared.join(', ')}</p>}
              </div>
            ))}
          </div>
        </section>
      )}

      {data.byCreator.length > 0 && (
        <section className="section">
          <h2 className="h2">{creatorName(ex)}-ийн бусад бүтээл</h2>
          <div className="grid grid--3">{data.byCreator.map((e) => <ExhibitCard key={e.id} exhibit={e} />)}</div>
        </section>
      )}
    </main>
  );
}
