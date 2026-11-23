import { now as nowList, photo } from '../data';
import { useClock } from '../hooks';

// Ширээний баруун талын виджетүүд: зураг, цаг, "одоо"
export default function Widgets({ ready, onOpen }) {
  const now = useClock();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const days = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];

  return (
    <aside className={`widgets ${ready ? 'is-ready' : ''}`}>
      <button className="widget photo-widget" onClick={() => onOpen('about')} aria-label="Миний тухай нээх">
        <img src={photo.src} alt={photo.alt} />
        <span className="photo-caption">{photo.caption}</span>
      </button>

      <div className="widget">
        <div className="widget-label">
          <span>Локал цаг</span>
          <span>GMT+8</span>
        </div>
        <div className="clock-big">
          {hh}
          <span className="blink">:</span>
          {mm}
        </div>
        <div className="widget-foot">{days[now.getDay()]} · Улаанбаатар</div>
      </div>

      <div className="widget">
        <div className="widget-label">
          <span>Одоо</span>
          <span>{String(nowList.length).padStart(2, '0')}</span>
        </div>
        <ol className="now-list">
          {nowList.map((item, i) => (
            <li key={item}>
              <span>{String(i + 1).padStart(2, '0')}</span>
              {item}
            </li>
          ))}
        </ol>
      </div>
    </aside>
  );
}
