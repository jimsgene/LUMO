import { AppIcon } from './Icons';

// Доод талын хөвөгч dock. Нээлттэй апп-ын доор цэг гарна.
// Hover хийхэд томорч, хөршүүд нь бага зэрэг томорно (CSS :has).
export default function Dock({ apps, windows, activeId, onClick, onPalette }) {
  return (
    <nav className="dock" aria-label="Апп-ууд">
      {apps.map((a, i) => {
        const w = windows[a.id];
        const cls = ['dock-item', w.open && 'is-open', activeId === a.id && !w.minimized && 'is-active']
          .filter(Boolean)
          .join(' ');
        return (
          <button key={a.id} className={cls} onClick={() => onClick(a.id)} aria-label={a.title}>
            <AppIcon id={a.id} size={20} />
            <span className="dock-tip">
              <em>{String(i + 1).padStart(2, '0')}</em> {a.title}
            </span>
          </button>
        );
      })}
      <span className="dock-sep" />
      <button className="dock-item dock-cmd" onClick={onPalette} aria-label="Командын самбар">
        <kbd>⌘K</kbd>
        <span className="dock-tip">Командууд</span>
      </button>
    </nav>
  );
}
