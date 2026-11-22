import { bio, owner, skills, timeline } from '../data';

// Миний тухай: товч намтар, ур чадвар (10 нүдтэй хэмжүүр), замнал
export default function About() {
  return (
    <div className="doc">
      <p className="label">01 — Миний тухай</p>
      <h2 className="doc-title">
        Сайн уу, би <span className="accent">{owner.firstName}</span>.
      </h2>

      <div className="about-grid">
        <div className="monogram" aria-hidden="true">
          <span>{owner.initials}</span>
        </div>
        <dl className="facts">
          <div><dt>Чиглэл</dt><dd>{owner.role}</dd></div>
          <div><dt>Байршил</dt><dd>{owner.location}</dd></div>
          <div><dt>Сургууль</dt><dd>{owner.university}</dd></div>
          <div><dt>Төлөв</dt><dd><i className="pulse" /> {owner.status}</dd></div>
        </dl>
      </div>

      <div className="bio">
        {bio.map((p, i) => (
          <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>
        ))}
      </div>

      <p className="label">02 — Ур чадвар</p>
      <div className="skills">
        {skills.map((g) => (
          <div key={g.group} className="skill-group">
            <h4>{g.group}</h4>
            {g.items.map((s) => {
              const filled = Math.round(s.level / 10);
              return (
                <div key={s.name} className="skill">
                  <span className="skill-name">{s.name}</span>
                  <span className="meter" aria-label={`${s.level}%`}>
                    {Array.from({ length: 10 }, (_, i) => (
                      <i key={i} className={i < filled ? 'on' : ''} style={{ animationDelay: `${i * 40}ms` }} />
                    ))}
                  </span>
                  <span className="skill-num">{s.level}</span>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      <p className="label">03 — Замнал</p>
      <ol className="timeline">
        {timeline.map((t) => (
          <li key={t.year + t.text}>
            <span className="timeline-year">{t.year}</span>
            <span>{t.text}</span>
          </li>
        ))}
      </ol>
    </div>
  );
}
