import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function TeacherDetail() {
  const { id } = useParams();
  const [t, setT] = useState(null);
  const [state, setState] = useState('loading');

  useEffect(() => {
    supabase.from('teachers').select('*').eq('id', id).maybeSingle().then(({ data, error }) => {
      if (error) return setState('error');
      if (!data) return setState('missing');
      setT(data); setState('ready');
    });
  }, [id]);

  if (state === 'loading') return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (state !== 'ready') return (
    <main className="container section">
      <h1 className="h2">Багш олдсонгүй</h1>
      <Link to="/teachers" className="link">Багш нарын жагсаалт руу буцах</Link>
    </main>
  );

  const courses = (t.courses || '').split(/[,\n;]/).map((s) => s.trim()).filter(Boolean);
  return (
    <main className="container section">
      <div className="detail detail--teacher">
        <div className="exposure exposure--portrait">
          {t.photo_url && <img src={t.photo_url} alt={t.name} />}
        </div>
        <div>
          <h1 className="h2">{t.name}</h1>
          <p className="person__role">{t.position}</p>
          {courses.length > 0 && (
            <>
              <h2 className="h3 gap-top">Заадаг хичээл</h2>
              <ul className="chips">{courses.map((c) => <li key={c}>{c}</li>)}</ul>
            </>
          )}
          {t.bio && <p className="prose">{t.bio}</p>}
          <Link to="/teachers" className="link">← Бүх багш</Link>
        </div>
      </div>
    </main>
  );
}