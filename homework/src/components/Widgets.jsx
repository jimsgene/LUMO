import { now as nowList, skills } from '../data';
import { useClock } from '../hooks';

// Ширээний баруун талын виджетүүд: цаг, "одоо", стек
export default function Widgets({ ready }) {
  const now = useClock();
  const hh = String(now.getHours()).padStart(2, '0');
  const mm = String(now.getMinutes()).padStart(2, '0');
  const ss = String(now.getSeconds()).padStart(2, '0');
  const days = ['Ням', 'Даваа', 'Мягмар', 'Лхагва', 'Пүрэв', 'Баасан', 'Бямба'];
  const stack = skills.flatMap((g) => g.items).sort((a, b) => b.level - a.level).slice(0, 6);

  return (
    <aside className={`widgets ${ready ? 'is-ready' : ''}`}>
      <div className="widget">
        <div className="widget-label">
          <span>Локал цаг</span>
          <span>GMT+8</span>
        </div>
        <div className="clock-big">
          {hh}
          <span className="blink">:</span>
          {mm}
          <small>{ss}</small>
        </div>
        <div className="widget-foot">
          {days[now.getDay()]} · {now.getFullYear()}.{String(now.getMonth() + 1).padStart(2, '0')}.
          {String(now.getDate()).padStart(2, '0')}
        </div>
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

      <div className="widget">
        <div className="widget-label">
          <span>Стек</span>
          <span>top {stack.length}</span>
        </div>
        <div className="stack">
          {stack.map((s) => (
            <span key={s.name}>{s.name}</span>
          ))}
        </div>
      </div>
    </aside>
  );
}
