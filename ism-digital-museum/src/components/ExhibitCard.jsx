import { Link } from 'react-router-dom';
import { Eye, Heart } from 'lucide-react';
import { plateNumber, techList, creatorName } from '../lib/plate';

export default function ExhibitCard({ exhibit, stats }) {
  const tech = techList(exhibit.technology_stack).slice(0, 3);
  const creator = creatorName(exhibit);
  return (
    <article className="plate">
      <Link to={`/exhibits/${exhibit.id}`} className="plate__link">
        <div className="exposure">
          {exhibit.image_url
            ? <img src={exhibit.image_url} alt={exhibit.title} loading="lazy" />
            : <span className="exposure__initial" aria-hidden="true">{exhibit.title?.[0]}</span>}
        </div>
        <p className="meta">{plateNumber(exhibit)}</p>
        <h3 className="plate__title">{exhibit.title}</h3>
        <p className="plate__by">{creator ? `${creator}, ` : ''}{exhibit.year_created}</p>
      </Link>
      {tech.length > 0 && <ul className="chips">{tech.map((t) => <li key={t}>{t}</li>)}</ul>}
      {stats && (
        <p className="plate__stats meta">
          <span><Eye size={13} aria-hidden="true" /> {stats.views}</span>
          <span><Heart size={13} aria-hidden="true" /> {stats.likes}</span>
        </p>
      )}
    </article>
  );
}
