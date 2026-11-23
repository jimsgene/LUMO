import { bio, owner, photo, timeline } from '../data';
import SkillSky from '../components/SkillSky';

// Миний тухай: зураг, намтар, ур чадварын одны зураг, замнал
export default function About() {
  return (
    <div className="doc">
      <p className="label">01 — Миний тухай</p>
      <h2 className="doc-title">
        Сайн уу, би <em className="accent">{owner.firstName}</em>.
      </h2>

      <div className="about-grid">
        <figure className="polaroid">
          <span className="tape" />
          <img src={photo.src} alt={photo.alt} />
          <figcaption className="polaroid-caption">{photo.caption}</figcaption>
        </figure>
        <div>
          <dl className="facts">
            <div><dt>Чиглэл</dt><dd>{owner.role}</dd></div>
            <div><dt>Байршил</dt><dd>{owner.location}</dd></div>
            <div><dt>Сургууль</dt><dd>{owner.university}</dd></div>
            <div><dt>Төлөв</dt><dd><i className="pulse" /> {owner.status}</dd></div>
          </dl>
          <div className="bio">
            {bio.map((p, i) => (
              <p key={i} className={i === 0 ? 'lead' : ''}>{p}</p>
            ))}
          </div>
        </div>
      </div>

      <p className="label">02 — Ур чадварын одны зураг</p>
      <SkillSky />

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
