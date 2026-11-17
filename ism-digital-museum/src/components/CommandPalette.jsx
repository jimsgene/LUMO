import { useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Image, Users, CalendarDays, Clock, User, Compass, CornerDownLeft } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { matches } from '../lib/similar';
import { techList, creatorName } from '../lib/plate';
import { yearOf } from '../lib/format';

const PAGES = [
  { title: 'Нүүр хуудас', to: '/' },
  { title: 'Бүх үзмэр', to: '/exhibits' },
  { title: 'Хамгийн их үзэлттэй үзмэр', to: '/exhibits?sort=popular' },
  { title: 'ISM Time Machine (түүх)', to: '/history' },
  { title: 'Статистик ба судалгаа', to: '/insights' },
  { title: 'Үзэсгэлэнгийн дэлгэц (kiosk)', to: '/kiosk' },
  { title: 'Хэвлэх шошго (QR)', to: '/placards' },
  { title: 'Бүтээгчид', to: '/creators' },
  { title: 'Тэнхимийн тухай, холбоо барих', to: '/about' },
];
const ICON = { page: Compass, exhibit: Image, teacher: Users, event: CalendarDays, milestone: Clock, creator: User };
const TYPE_MN = { page: 'Хуудас', exhibit: 'Үзмэр', teacher: 'Багш', event: 'Арга хэмжээ', milestone: 'Түүх', creator: 'Бүтээгч' };

let cache = null; // loaded once per page load, on first open
async function loadIndex() {
  if (cache) return cache;
  const [ex, te, ev, ms] = await Promise.all([
    supabase.from('exhibits').select('*, profiles(display_name)').eq('status', 'approved'),
    supabase.from('teachers').select('id,name,position,courses'),
    supabase.from('events').select('id,title,event_date'),
    supabase.from('milestones').select('id,year,title'),
  ]);
  const items = PAGES.map((p) => ({ type: 'page', key: `p${p.to}`, title: p.title, sub: '', hay: p.title, to: p.to }));
  const creators = new Map();
  (ex.data || []).forEach((e) => {
    const who = creatorName(e);
    const tech = techList(e.technology_stack).join(' ');
    items.push({ type: 'exhibit', key: `x${e.id}`, title: e.title, sub: [who, e.year_created, tech].filter(Boolean).join(' · '),
      hay: `${e.title} ${who} ${e.year_created} ${tech} ${e.category || ''}`, to: `/exhibits/${e.id}` });
    if (who) creators.set(who, who);
  });
  creators.forEach((name) => items.push({ type: 'creator', key: `c${name}`, title: name, sub: 'Бүтээлүүдийг харах', hay: name, to: `/exhibits?q=${encodeURIComponent(name)}` }));
  (te.data || []).forEach((t) => items.push({ type: 'teacher', key: `t${t.id}`, title: t.name, sub: t.position || '',
    hay: `${t.name} ${t.position || ''} ${t.courses || ''}`, to: `/teachers/${t.id}` }));
  (ev.data || []).forEach((e) => items.push({ type: 'event', key: `e${e.id}`, title: e.title, sub: String(yearOf(e.event_date) || ''),
    hay: `${e.title} ${e.event_date || ''}`, to: `/events/${e.id}` }));
  (ms.data || []).forEach((m) => items.push({ type: 'milestone', key: `m${m.id}`, title: m.title, sub: String(m.year), hay: `${m.title} ${m.year}`, to: '/history' }));
  cache = items;
  return items;
}

export default function CommandPalette() {
  const nav = useNavigate();
  const [open, setOpen] = useState(false);
  const [items, setItems] = useState(null);
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const inputRef = useRef(null);
  const lastFocus = useRef(null);

  useEffect(() => {
    const show = () => {
      lastFocus.current = document.activeElement;
      setQ(''); setActive(0); setOpen(true);
      loadIndex().then(setItems).catch(() => setItems([]));
    };
    const onKey = (e) => {
      const typing = /input|textarea|select/i.test(e.target.tagName) || e.target.isContentEditable;
      if ((e.key === 'k' && (e.ctrlKey || e.metaKey)) || (e.key === '/' && !typing)) { e.preventDefault(); show(); }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('ism:palette', show);
    return () => { window.removeEventListener('keydown', onKey); window.removeEventListener('ism:palette', show); };
  }, []);

  useEffect(() => { if (open) inputRef.current?.focus(); }, [open]);

  const results = useMemo(() => {
    if (!items) return [];
    if (!q.trim()) return items.filter((i) => i.type === 'page');
    return items.filter((i) => matches(i.hay, q))
      .sort((a, b) => Number(!a.title.toLowerCase().startsWith(q.toLowerCase())) - Number(!b.title.toLowerCase().startsWith(q.toLowerCase())))
      .slice(0, 12);
  }, [items, q]);

  if (!open) return null;

  const close = () => { setOpen(false); lastFocus.current?.focus?.(); };
  const go = (item) => { if (!item) return; setOpen(false); nav(item.to); };
  const onKeyDown = (e) => {
    if (e.key === 'Escape') close();
    else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
    else if (e.key === 'Enter') { e.preventDefault(); go(results[active]); }
  };

  return (
    <div className="palette" role="dialog" aria-modal="true" aria-label="Хурдан хайлт" onMouseDown={close}>
      <div className="palette__box" onMouseDown={(e) => e.stopPropagation()}>
        <div className="palette__input">
          <Search size={20} aria-hidden="true" />
          <input ref={inputRef} value={q} onChange={(e) => { setQ(e.target.value); setActive(0); }} onKeyDown={onKeyDown}
            placeholder="Үзмэр, багш, арга хэмжээ, технологи хайх…" aria-label="Хайх"
            role="combobox" aria-expanded="true" aria-controls="palette-list" aria-activedescendant={results[active] ? `pal-${results[active].key}` : undefined} />
          <kbd>Esc</kbd>
        </div>
        <ul id="palette-list" role="listbox" className="palette__list">
          {items === null && <li className="palette__empty">Ачаалж байна…</li>}
          {items && results.length === 0 && <li className="palette__empty">"{q}" олдсонгүй</li>}
          {results.map((r, i) => {
            const Icon = ICON[r.type];
            return (
              <li key={r.key} id={`pal-${r.key}`} role="option" aria-selected={i === active}
                className="palette__item" onMouseEnter={() => setActive(i)} onClick={() => go(r)}>
                <Icon size={18} aria-hidden="true" />
                <span className="palette__text"><strong>{r.title}</strong>{r.sub && <small>{r.sub}</small>}</span>
                <span className="meta palette__type">{TYPE_MN[r.type]}</span>
                {i === active && <CornerDownLeft size={16} aria-hidden="true" />}
              </li>
            );
          })}
        </ul>
        <p className="palette__hint meta">↑↓ сонгох · Enter нээх · Ctrl+K эсвэл / хаанаас ч нээнэ</p>
      </div>
    </div>
  );
}
