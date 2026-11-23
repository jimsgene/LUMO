import { useState } from 'react';
import { hardSkills, softSkills } from '../data';

// ============================================================
//  Ур чадварын "одны зураг".
//  Hard skill бүр нэг од, soft skill бүр нэг од. Хоёр ордон (constellation).
//  Одны хэмжээ, гэрэл нь түвшинг (1–5) илэрхийлнэ. Од дээр дарах/hover хийхэд тайлбар гарна.
// ============================================================

// Одны байрлал (0–100 хувиар). Хоёр ордны хэлбэр.
const HARD_POS = [[12, 30], [24, 16], [36, 28], [30, 50], [16, 62], [44, 66], [52, 42], [8, 84]];
const SOFT_POS = [[63, 24], [76, 12], [86, 30], [79, 52], [64, 62], [84, 78]];

function Constellation({ items, pos, kind, active, setActive }) {
  const pts = items.map((s, i) => ({ ...s, x: pos[i][0], y: pos[i][1], id: `${kind}-${i}` }));
  return (
    <g className={`constellation ${kind}`}>
      {/* Оддыг холбосон шугам */}
      <polyline points={pts.map((p) => `${p.x * 6},${p.y * 3.6}`).join(' ')} className="const-line" />
      {pts.map((p) => {
        const r = 2 + p.level * 1.4;
        const on = active?.id === p.id;
        return (
          <g
            key={p.id}
            className={`star-node ${on ? 'is-on' : ''}`}
            transform={`translate(${p.x * 6} ${p.y * 3.6})`}
            onMouseEnter={() => setActive(p)}
            onClick={() => setActive(p)}
            tabIndex={0}
            onFocus={() => setActive(p)}
            role="button"
            aria-label={`${p.name}, ${p.level}/5`}
          >
            <circle r={r * 2.6} className="star-halo" />
            <circle r={r} className="star-core" />
            <text y={-r - 8} textAnchor="middle" className="star-label">
              {p.name}
            </text>
          </g>
        );
      })}
    </g>
  );
}

export default function SkillSky() {
  const [active, setActive] = useState({ ...hardSkills[0], id: 'hard-0', kind: 'hard' });
  const isHard = active.id.startsWith('hard');

  return (
    <div className="skill-sky">
      <svg viewBox="0 0 600 360" className="sky-chart" role="img" aria-label="Ур чадварын одны зураг">
        <text x="20" y="344" className="sky-title">HARD SKILLS · Техникийн</text>
        <text x="580" y="344" textAnchor="end" className="sky-title">SOFT SKILLS · Хувь хүний</text>
        <Constellation items={hardSkills} pos={HARD_POS} kind="hard" active={active} setActive={setActive} />
        <Constellation items={softSkills} pos={SOFT_POS} kind="soft" active={active} setActive={setActive} />
      </svg>

      <div className={`sky-card ${isHard ? 'is-hard' : 'is-soft'}`} aria-live="polite">
        <span className="sky-kind">{isHard ? 'Hard skill' : 'Soft skill'}</span>
        <strong>{active.name}</strong>
        <span className="sky-level" aria-label={`${active.level}/5`}>
          {Array.from({ length: 5 }, (_, i) => (
            <i key={i} className={i < active.level ? 'on' : ''}>✶</i>
          ))}
        </span>
        <p>{active.note}</p>
      </div>
      <p className="hand-note sky-hint">Од бүр дээр дарж үзээрэй ↑</p>
    </div>
  );
}
