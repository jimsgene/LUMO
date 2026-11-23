import { useState } from 'react';
import { projects } from '../data';
import { ArrowIcon, BackIcon, GithubIcon } from '../components/Icons';

// Карт дээр хулгана хөдлөхөд 3D хэлбэрээр хазайна (tilt)
function tilt(e) {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  card.style.setProperty('--ry', `${px * 5}deg`);
  card.style.setProperty('--rx', `${py * -5}deg`);
  card.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
  card.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
}
function untilt(e) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

const host = (url) => url.replace(/^https?:\/\//, '').replace(/\/$/, '');

// Хөтчийн цонх шиг хүрээтэй screenshot
function BrowserShot({ src, url, alt }) {
  return (
    <div className="browser-shot">
      <div className="browser-bar">
        <i /><i /><i />
        <span>{url ? host(url) : 'localhost'}</span>
      </div>
      <img src={src} alt={alt} loading="lazy" />
    </div>
  );
}

// Бүтээлүүд: зураг дээр дарахад сайт нь шууд шинэ таб-д нээгдэнэ.
// "Дэлгэрэнгүй" товч нь бүх боломж, зургийн цомгийг харуулна.
export default function Projects() {
  const [openId, setOpenId] = useState(null);
  const [shot, setShot] = useState(0);
  const index = projects.findIndex((p) => p.id === openId);
  const p = projects[index];

  if (p) {
    return (
      <article className="doc project-detail">
        <button className="back" onClick={() => setOpenId(null)}>
          <BackIcon /> Бүх бүтээл
        </button>
        <p className="label">
          {String(index + 1).padStart(2, '0')} — {p.kind} <span className="label-right">{p.year}</span>
        </p>
        <h2 className="doc-title">{p.title}</h2>
        <p className="lead project-tagline">{p.tagline}</p>

        <BrowserShot src={p.images[shot] || p.images[0]} url={p.live} alt={`${p.title} — дэлгэцийн зураг`} />
        {p.images.length > 1 && (
          <div className="thumbs">
            {p.images.map((src, i) => (
              <button key={src} className={i === shot ? 'is-on' : ''} onClick={() => setShot(i)} aria-label={`Зураг ${i + 1}`}>
                <img src={src} alt="" />
              </button>
            ))}
          </div>
        )}

        <div className="detail-body">
          <div>
            <p className="project-desc">{p.description}</p>
            <ul className="feature-list">
              {p.features.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
          <aside>
            <dl className="facts facts-tight">
              <div><dt>Төрөл</dt><dd>{p.kind}</dd></div>
              <div><dt>Он</dt><dd>{p.year}</dd></div>
              <div><dt>Стек</dt><dd>{p.tech.join(' · ')}</dd></div>
            </dl>
            <div className="project-actions">
              {p.live && (
                <a className="btn btn-accent" href={p.live} target="_blank" rel="noreferrer">
                  Сайт руу орох <ArrowIcon />
                </a>
              )}
              <a className="btn btn-ghost" href={p.repo} target="_blank" rel="noreferrer">
                <GithubIcon /> Эх код
              </a>
            </div>
          </aside>
        </div>
      </article>
    );
  }

  return (
    <div className="doc">
      <p className="label">
        02 — Бүтээлүүд <span className="label-right">{String(projects.length).padStart(2, '0')} төсөл</span>
      </p>
      <h2 className="doc-title">
        Сонгомол <em className="accent">бүтээлүүд</em>
      </h2>

      <div className="project-list">
        {projects.map((proj, i) => {
          const openDetail = () => {
            setShot(0);
            setOpenId(proj.id);
          };
          return (
            <article key={proj.id} className="project-row">
              {/* Зураг дээр дарахад сайт руу шууд орно (сайтгүй бол дэлгэрэнгүй нээгдэнэ) */}
              <a
                className="project-card"
                href={proj.live || undefined}
                target="_blank"
                rel="noreferrer"
                onClick={proj.live ? undefined : (e) => { e.preventDefault(); openDetail(); }}
                onMouseMove={tilt}
                onMouseLeave={untilt}
                aria-label={proj.live ? `${proj.title} сайтыг нээх` : `${proj.title} дэлгэрэнгүй`}
              >
                <BrowserShot src={proj.images[0]} url={proj.live} alt={`${proj.title} — дэлгэцийн зураг`} />
                <span className="project-open">{proj.live ? 'Сайт руу орох' : 'Дэлгэрэнгүй'} <ArrowIcon size={14} /></span>
              </a>

              <div className="project-info">
                <p className="project-meta">
                  <span>{String(i + 1).padStart(2, '0')}</span> {proj.kind} · {proj.year}
                </p>
                <h3>{proj.title}</h3>
                <p className="project-tagline">{proj.tagline}</p>
                <ul className="feature-list feature-list-short">
                  {proj.features.slice(0, 3).map((f) => (
                    <li key={f}>{f}</li>
                  ))}
                </ul>
                <p className="project-tech">{proj.tech.join(' / ')}</p>
                <div className="project-actions">
                  {proj.live && (
                    <a className="btn btn-accent" href={proj.live} target="_blank" rel="noreferrer">
                      Сайт <ArrowIcon />
                    </a>
                  )}
                  <button className="btn btn-ghost" onClick={openDetail}>Дэлгэрэнгүй</button>
                  <a className="btn btn-ghost" href={proj.repo} target="_blank" rel="noreferrer">
                    <GithubIcon /> Код
                  </a>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}
