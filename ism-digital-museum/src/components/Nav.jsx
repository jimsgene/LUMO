import { NavLink, Link, useNavigate } from 'react-router-dom';
import { Search, Home, Image, CalendarDays, Clock, Users } from 'lucide-react';
import { useAuth } from '../lib/auth';
import { supabase } from '../lib/supabase';

const links = [
  { to: '/exhibits', label: 'Үзмэр' },
  { to: '/teachers', label: 'Багш нар' },
  { to: '/events', label: 'Арга хэмжээ' },
  { to: '/history', label: 'Түүх' },
  { to: '/creators', label: 'Бүтээгчид' },
];

export default function Nav() {
  const { user, profile } = useAuth();
  const nav = useNavigate();
  const logout = async () => { await supabase.auth.signOut(); nav('/'); };

  return (
    <>
      <header className="nav">
        <div className="container nav__row">
          <Link to="/" className="nav__brand" aria-label="ISM Дижитал музей, нүүр хуудас">
            <span className="nav__mark">ISM</span>
            <span className="nav__name">Дижитал музей</span>
          </Link>
          <nav aria-label="Үндсэн цэс" className="nav__links">
            {links.map((l) => (
              <NavLink key={l.to} to={l.to} className="nav__link">{l.label}</NavLink>
            ))}
          </nav>
          <div className="nav__actions">
            <Link to="/exhibits?focus=search" className="icon-btn" aria-label="Үзмэр хайх">
              <Search size={20} />
            </Link>
            {user ? (
              <>
                {profile?.role === 'admin' && <Link to="/admin" className="btn">Админ</Link>}
                <Link to="/dashboard" className="btn">Миний бүтээл</Link>
                <button className="btn" onClick={logout}>Гарах</button>
              </>
            ) : (
              <Link to="/login" className="btn">Нэвтрэх</Link>
            )}
          </div>
        </div>
      </header>

      <nav className="bottombar" aria-label="Гар утасны цэс">
        <NavLink to="/" end><Home size={20} />Нүүр</NavLink>
        <NavLink to="/exhibits"><Image size={20} />Үзмэр</NavLink>
        <NavLink to="/events"><CalendarDays size={20} />Арга хэмжээ</NavLink>
        <NavLink to="/history"><Clock size={20} />Түүх</NavLink>
        <NavLink to="/teachers"><Users size={20} />Багш нар</NavLink>
      </nav>
    </>
  );
}