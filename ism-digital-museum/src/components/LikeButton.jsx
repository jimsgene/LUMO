import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart } from 'lucide-react';
import { useAuth } from '../lib/useAuth';
import { hasLiked, setLiked } from '../lib/engagement';

// Hidden entirely when db/engagement.sql has not been run (count === null).
export default function LikeButton({ exhibitId, count, onChange }) {
  const { user } = useAuth();
  const [mine, setMine] = useState({ id: null, liked: null });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState('');

  useEffect(() => {
    if (!user) return;
    let alive = true;
    hasLiked(exhibitId, user.id).then((liked) => alive && setMine({ id: exhibitId, liked }));
    return () => { alive = false; };
  }, [exhibitId, user]);

  if (count == null) return null;
  const liked = user && mine.id === exhibitId ? mine.liked : false;

  if (!user) {
    return <Link to="/login" className="btn like" title="Таалагдсан гэж тэмдэглэхийн тулд нэвтэрнэ үү"><Heart size={18} /> {count}</Link>;
  }

  async function toggle() {
    const next = !liked;
    setBusy(true); setErr('');
    setMine({ id: exhibitId, liked: next }); onChange?.(next ? 1 : -1); // optimistic
    try { await setLiked(exhibitId, user.id, next); }
    catch (e) { setMine({ id: exhibitId, liked: !next }); onChange?.(next ? -1 : 1); setErr(e.message); }
    setBusy(false);
  }

  return (
    <>
      <button type="button" className={`btn like${liked ? ' like--on' : ''}`} aria-pressed={liked} disabled={busy} onClick={toggle}>
        <Heart size={18} fill={liked ? 'currentColor' : 'none'} /> {count}
        <span className="sr-only">{liked ? 'Таалагдсанаа болих' : 'Таалагдлаа'}</span>
      </button>
      {err && <span className="msg msg--error" role="alert">{err}</span>}
    </>
  );
}
