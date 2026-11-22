import { useState } from 'react';
import { projects } from '../data';
import { ArrowIcon, BackIcon } from '../components/Icons';

// Карт дээр хулгана хөдлөхөд 3D хэлбэрээр хазайна (tilt)
function tilt(e) {
  const card = e.currentTarget;
  const r = card.getBoundingClientRect();
  const px = (e.clientX - r.left) / r.width - 0.5;
  const py = (e.clientY - r.top) / r.height - 0.5;
  card.style.setProperty('--ry', `${px * 8}deg`);
  card.style.setProperty('--rx', `${py * -8}deg`);
  card.style.setProperty('--gx', `${(px + 0.5) * 100}%`);
  card.style.setProperty('--gy', `${(py + 0.5) * 100}%`);
}
function untilt(e) {
  e.currentTarget.style.setProperty('--rx', '0deg');
  e.currentTarget.style.setProperty('--ry', '0deg');
}

// Бүтээлүүд: жагсаалт ↔ дэлгэрэнгүй
export default function Projects() {
  const [selectedId, setSelectedId] = useState(null);
  const index = projects.findIndex((p) => p.id === selectedId);
  const selected = projects[index];

  if (selected) {
    return (
      <article className="doc project-detail">
        <button className="back" onClick={() => setSelectedId(null)}>
          <BackIcon /> Бүх бүтээл
        </button>
        <div className="detail-media">
          <img src={selected.image} alt={`${selected.title} төслийн зураг`} />
          <span className="detail-index">{String(index + 1).padStart(2, '0')}</span>
        </div>
        <div className="detail-body">
          <div>
            <h2 className="doc-title">{selected.title}</h2>
            <p className="lead">{selected.description}</p>
            <div className="hero-cta">
              {selected.live && (
                <a className="btn btn-accent" href={selected.live} target="_blank" rel="noreferrer">
                  Үзэх <ArrowIcon />
                </a>
              )}
              <a className={`btn ${selected.live ? 'btn-ghost' : 'btn-accent'}`} href={selected.repo} target="_blank" rel="noreferrer">
                Эх код <ArrowIcon />
              </a>
            </div>
          </div>
          <dl className="facts facts-tight">
            <div><dt>Он</dt><dd>{selected.year}</dd></div>
            <div><dt>Файл</dt><dd className="mono">{selected.file}</dd></div>
            <div><dt>Технологи</dt><dd>{selected.tech.join(' · ')}</dd></div>
          </dl>
        </div>
      </article>
    );
  }

  return (
    <div className="doc">
      <p className="label">
        02 — Бүтээлүүд <span className="label-right">{String(projects.length).padStart(2, '0')} төсөл</span>
      </p>
      <h2 className="doc-title">Сонгомол бүтээлүүд</h2>

      <div className="project-grid">
        {projects.map((p, i) => (
          <button
            key={p.id}
            className="project-card"
            onClick={() => setSelectedId(p.id)}
            onMouseMove={tilt}
            onMouseLeave={untilt}
          >
            <div className="project-media">
              <img src={p.image} alt="" loading="lazy" />
              <span className="project-index">{String(i + 1).padStart(2, '0')}</span>
              <span className="project-open">Нээх <ArrowIcon size={14} /></span>
            </div>
            <div className="project-info">
              <strong>{p.title}</strong>
              <span>{p.year}</span>
            </div>
            <p className="project-tech">{p.tech.join(' / ')}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
