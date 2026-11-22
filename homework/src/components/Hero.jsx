import { owner } from '../data';
import { ArrowIcon } from './Icons';

// Ширээн дээрх постер маягийн танилцуулга (нүүр хэсэг).
// Нэрийн үсэг бүр дээр хулгана аваачихад фонтын жин (variable font) өөрчлөгдөнө.
export default function Hero({ ready, onOpen, onPalette }) {
  const words = owner.name.split(' ');

  return (
    <section className={`hero ${ready ? 'is-ready' : ''}`}>
      <p className="hero-kicker">
        <span>[ Портфолио ]</span>
        <span>{owner.location}</span>
        <span>©{new Date().getFullYear()}</span>
      </p>

      <h1 className="hero-name" aria-label={owner.name}>
        {words.map((word, wi) => (
          <span key={wi} className="hero-line" style={{ '--d': `${wi * 120}ms` }}>
            <span className="hero-word" aria-hidden="true">
              {word.split('').map((ch, i) => (
                <span key={i} className="ch">
                  {ch}
                </span>
              ))}
            </span>
          </span>
        ))}
      </h1>

      <div className="hero-meta">
        <p className="hero-role">
          <span className="accent">↳</span> {owner.role}
        </p>
        <p className="hero-tagline">{owner.tagline}</p>
        <div className="hero-cta">
          <button className="btn btn-accent" onClick={() => onOpen('projects')}>
            Бүтээлүүд үзэх <ArrowIcon />
          </button>
          <button className="btn btn-ghost" onClick={() => onOpen('about')}>
            Миний тухай
          </button>
          <button className="btn btn-ghost btn-key" onClick={onPalette}>
            <kbd>⌘K</kbd> бүх команд
          </button>
        </div>
      </div>
    </section>
  );
}
