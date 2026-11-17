import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import TimeRuler from '../components/TimeRuler';
import ExhibitCard from '../components/ExhibitCard';
import { plateNumber, techList } from '../lib/plate';
import { monthMn, dayOf, yearOf } from '../lib/format';
import { useTitle } from '../lib/useTitle';
import { byDeptOrder } from '../lib/order';

const PUBLIC_STATUS = 'approved';

export default function Home() {
  const [exhibits, setExhibits] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [events, setEvents] = useState([]);
  const [milestones, setMilestones] = useState([]);
  const [year, setYear] = useState(null);
  const [state, setState] = useState('loading');
  useTitle(null);

  useEffect(() => {
    let alive = true;
    (async () => {
      const [ex, te, ev, ms] = await Promise.all([
        supabase.from('exhibits').select('*, profiles(display_name)')
          .eq('status', PUBLIC_STATUS).order('year_created', { ascending: false }),
        supabase.from('teachers').select('*'),
        supabase.from('events').select('id,title,event_date,cover_image_url')
          .order('event_date', { ascending: false }),
        supabase.from('milestones').select('*').order('year', { ascending: true }),
      ]);
      if (!alive) return;
      if (ex.error || te.error || ev.error) { setState('error'); return; }
      setExhibits(ex.data); setTeachers([...te.data].sort(byDeptOrder).slice(0, 8)); setEvents(ev.data);
      setMilestones(ms.error ? [] : ms.data);
      setState('ready');
    })();
    return () => { alive = false; };
  }, []);

  const years = useMemo(() => {
    const set = new Set([
      ...exhibits.map((e) => e.year_created),
      ...events.map((e) => yearOf(e.event_date)),
    ].filter(Boolean));
    return [...set].sort((a, b) => a - b);
  }, [exhibits, events]);

  const shownExhibits = year ? exhibits.filter((e) => e.year_created === year) : exhibits;
  const shownEvents = year ? events.filter((e) => yearOf(e.event_date) === year) : events;
  const featured = shownExhibits[0];

  const evolution = useMemo(() => {
    const total = {}; const byYear = {};
    exhibits.forEach((e) => techList(e.technology_stack).forEach((t) => {
      total[t] = (total[t] || 0) + 1;
      byYear[e.year_created] = byYear[e.year_created] || {};
      byYear[e.year_created][t] = (byYear[e.year_created][t] || 0) + 1;
    }));
    const tags = Object.entries(total).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([t]) => t);
    const max = Math.max(1, ...Object.values(byYear).flatMap((o) => tags.map((t) => o[t] || 0)));
    return { tags, byYear, max };
  }, [exhibits]);

  if (state === 'loading') return <main className="container section"><p>Архивыг ачаалж байна…</p></main>;
  if (state === 'error') return (
    <main className="container section">
      <h1 className="h2">Архивыг ачаалж чадсангүй</h1>
      <p>Интернэт холболтоо шалгаад хуудсаа дахин ачаална уу.</p>
    </main>
  );

  return (
    <main>
      <section className="cover">
        {years.length > 0 && (
          <div className="cover__years" aria-hidden="true">
            {years[0] === years[years.length - 1] ? years[0] : `${years[0]}–${years[years.length - 1]}`}
          </div>
        )}
        <div className="container cover__grid">
          <div className="cover__text">
            <p className="meta">Мэдээллийн Системийн Менежментийн Тэнхим</p>
            <h1 className="display">ISM-ийн бүтээсэн зүйл, жил бүр.</h1>
            <p className="lead">
              Оюутны бүтээл, багш нар, арга хэмжээ, тэнхимийн түүхийг нэг архивт хадгална.
              Жилээ сонгоход тэр жилд хийгдсэн зүйл гарна.
            </p>
            <div className="actions">
              <Link to="/exhibits" className="btn btn--solid">Бүх үзмэрийг үзэх</Link>
              <Link to="/kiosk" className="btn btn--ghost">Үзэсгэлэнгийн горим</Link>
            </div>
          </div>
          {featured ? (
            <Link to={`/exhibits/${featured.id}`} className="cover__feature">
              <div className="exposure exposure--large">
                {featured.image_url && <img src={featured.image_url} alt={featured.title} />}
              </div>
              <p className="meta">{plateNumber(featured)}</p>
              <p className="cover__caption">{featured.title}</p>
            </Link>
          ) : (
            <p className="empty">Одоогоор нийтлэгдсэн үзмэр алга.</p>
          )}
        </div>
      </section>

      <TimeRuler years={years} value={year} onChange={setYear} />

      <section className="container section">
        <div className="section__head">
          <h2 className="h2">{year ? `${year} оны үзмэр` : 'Сүүлийн үзмэрүүд'}</h2>
          <Link to="/exhibits" className="link">Бүх каталог</Link>
        </div>
        {shownExhibits.length === 0 ? (
          <p className="empty">
            Энэ онд үзмэр олдсонгүй. <button className="link" onClick={() => setYear(null)}>Бүх оныг харуулах</button>
          </p>
        ) : (
          <div className="grid grid--3">
            {shownExhibits.slice(0, 6).map((e) => <ExhibitCard key={e.id} exhibit={e} />)}
          </div>
        )}
      </section>

      {evolution.tags.length > 0 && (
        <section className="blueprint">
          <div className="container section">
            <h2 className="h2">Технологийн хөгжил</h2>
            <p className="lead">Үзмэрүүдэд жил бүр ямар технологи хэдэн удаа ашиглагдсаныг харуулна.</p>
            <div className="evo">
              {years.filter((y) => evolution.byYear[y]).map((y) => (
                <div className="evo__row" key={y}>
                  <span className="meta evo__year">{y}</span>
                  <div className="evo__bars">
                    {evolution.tags.map((t) => {
                      const n = evolution.byYear[y][t] || 0;
                      return n ? (
                        <span key={t} className="evo__bar" style={{ width: `${(n / evolution.max) * 100}%` }}>
                          {t} · {n}
                        </span>
                      ) : null;
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="container section">
        <div className="section__head">
          <h2 className="h2">Багш нар</h2>
          <Link to="/teachers" className="link">Бүх багш</Link>
        </div>
        {teachers.length === 0 ? <p className="empty">Багшийн мэдээлэл удахгүй нэмэгдэнэ.</p> : (
          <div className="grid grid--4">
            {teachers.map((t) => (
              <Link key={t.id} to={`/teachers/${t.id}`} className="person">
                <div className="exposure exposure--portrait">
                  {t.photo_url && <img src={t.photo_url} alt={t.name} loading="lazy" />}
                </div>
                <h3 className="person__name">{t.name}</h3>
                <p className="person__role">{t.position}</p>
              </Link>
            ))}
          </div>
        )}
      </section>

      <section className="tint">
        <div className="container section">
          <div className="section__head">
            <h2 className="h2">{year ? `${year} оны арга хэмжээ` : 'Арга хэмжээ'}</h2>
            <Link to="/events" className="link">Бүх арга хэмжээ</Link>
          </div>
          {shownEvents.length === 0 ? (
            <p className="empty">Энэ онд бүртгэсэн арга хэмжээ алга.</p>
          ) : (
            <ul className="events">
              {shownEvents.slice(0, 4).map((ev) => (
                <li key={ev.id}>
                  <Link to={`/events/${ev.id}`} className="event">
                    <time dateTime={ev.event_date} className="event__date">
                      <span className="event__day">{dayOf(ev.event_date)}</span>
                      <span className="meta">{yearOf(ev.event_date)} · {monthMn(ev.event_date)}</span>
                    </time>
                    <span className="event__title">{ev.title}</span>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      {milestones.length > 0 && (
        <section className="container section">
          <div className="section__head">
            <h2 className="h2">Тэнхимийн түүх</h2>
            <Link to="/history" className="link">Бүтэн цагийн шугам</Link>
          </div>
          <ol className="timeline">
            {milestones.map((m) => (
              <li key={m.id} className="timeline__item">
                {m.image_url && <img className="timeline__img" src={m.image_url} alt="" loading="lazy" />}
                <span className="meta">{m.year}</span>
                <h3 className="person__name">{m.title}</h3>
                {m.description && <p>{m.description.length > 180 ? `${m.description.slice(0, 180)}…` : m.description}</p>}
              </li>
            ))}
          </ol>
        </section>
      )}

      <footer className="footer">
        <div className="container footer__row">
          <p>Мэдээллийн Системийн Менежментийн Тэнхим<br /><a href="mailto:ism_dpt@ufe.edu.mn">ism_dpt@ufe.edu.mn</a> · С байр, 205 тоот</p>
          <nav aria-label="Хөлийн цэс">
            <Link to="/exhibits">Үзмэр</Link>
            <Link to="/events">Арга хэмжээ</Link>
            <Link to="/about">Тэнхимийн тухай</Link>
            <Link to="/insights">Статистик</Link>
            <Link to="/placards">Хэвлэх шошго</Link>
            <Link to="/login">Нэвтрэх</Link>
          </nav>
        </div>
      </footer>
    </main>
  );
}