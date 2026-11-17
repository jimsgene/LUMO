import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin, AtSign } from 'lucide-react';
import { useTitle } from '../lib/useTitle';
import { PROGRAM, CONTACT, SOURCE, DEPARTMENT } from '../content/department';

export default function About() {
  useTitle('Тэнхимийн тухай');
  return (
    <main className="container section">
      <p className="meta">Тэнхимийн тухай</p>
      <h1 className="h2">{DEPARTMENT.name}</h1>
      <p className="about__motto">"{DEPARTMENT.motto}"</p>
      <div className="about__mv">
        <div><h2 className="h3">Эрхэм зорилго</h2><p>{DEPARTMENT.mission}</p></div>
        <div><h2 className="h3">Алсын хараа</h2><p>{DEPARTMENT.vision}</p></div>
      </div>

      <section className="section">
        <h2 className="h3">Хөтөлбөрүүд</h2>
        <ul className="about__skills">{DEPARTMENT.programs.map((p) => <li key={p}>{p}</li>)}</ul>
        <h2 className="h3 gap-top">Судалгааны тэргүүлэх чиглэл</h2>
        <ul className="chips about__tracks">{DEPARTMENT.research.map((r) => <li key={r}>{r}</li>)}</ul>
        <p className="gap-top"><Link className="link" to="/teachers">Тэнхимийн багш нарыг үзэх →</Link></p>
      </section>

      <p className="meta">Бакалаврын хөтөлбөр</p>
      <h2 className="h2">{PROGRAM.name}</h2>
      <p className="prose about__lead">{PROGRAM.summary}</p>

      <dl className="about__facts">
        {PROGRAM.facts.map(([k, v]) => (
          <div key={k}><dt className="meta">{k}</dt><dd>{v}</dd></div>
        ))}
      </dl>

      <section className="section">
        <h2 className="h3">Мэргэших чиглэл</h2>
        <ul className="chips about__tracks">
          {PROGRAM.tracks.map((t) => <li key={t}><Link to={`/exhibits?cat=${encodeURIComponent(t)}`}>{t}</Link></li>)}
        </ul>
        <h2 className="h3 gap-top">Олгох мэдлэг, ур чадвар</h2>
        <ul className="about__skills">{PROGRAM.skills.map((s) => <li key={s}>{s}</li>)}</ul>
      </section>

      <section className="blueprint about__stats">
        <div className="container section">
          <h2 className="h2">Төгсөгчид</h2>
          <div className="kpis">
            {PROGRAM.stats.map(([n, label]) => (
              <div key={label} className="kpi"><span className="kpi__n">{n}</span><span className="meta">{label}</span></div>
            ))}
          </div>
          <p className="meta gap-top">{PROGRAM.statsNote}</p>
        </div>
      </section>

      <section className="section">
        <h2 className="h3">Холбоо барих</h2>
        <ul className="about__contact">
          <li><MapPin size={18} aria-hidden="true" /> {CONTACT.address}</li>
          <li><Mail size={18} aria-hidden="true" /> <a className="link" href={`mailto:${CONTACT.email}`}>{CONTACT.email}</a></li>
          <li><Phone size={18} aria-hidden="true" /> <a className="link" href={`tel:${CONTACT.phone}`}>{CONTACT.phone}</a></li>
          <li><AtSign size={18} aria-hidden="true" /> Instagram: <a className="link" href={`https://www.instagram.com/${CONTACT.instagram}/`} target="_blank" rel="noreferrer">{CONTACT.instagram}</a> · Facebook: {CONTACT.facebook}</li>
        </ul>
        <p className="meta gap-top">Эх сурвалж: <a className="link" href={SOURCE.url} target="_blank" rel="noreferrer">{SOURCE.label}</a></p>
      </section>
    </main>
  );
}
