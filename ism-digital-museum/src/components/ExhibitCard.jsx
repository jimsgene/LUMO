import { Link } from 'react-router-dom';
import { plateNumber, techList } from '../lib/plate';

export default function ExhibitCard({ exhibit }) {
  const tech = techList(exhibit.technology_stack).slice(0, 3);
  const creator = exhibit.profiles?.display_name;
  return (
    <article className="plate">
      <Link to={`/exhibits/${exhibit.id}`} className="plate__link">
        <div className="exposure">
          {exhibit.image_url && <img src={exhibit.image_url} alt={exhibit.title} loading="lazy" />}
        </div>
        <p className="meta">{plateNumber(exhibit)}</p>
        <h3 className="plate__title">{exhibit.title}</h3>
        <p className="plate__by">{creator ? `${creator}, ` : ''}{exhibit.year_created}</p>
      </Link>
      {tech.length > 0 && <ul className="chips">{tech.map((t) => <li key={t}>{t}</li>)}</ul>}
    </article>
  );
}