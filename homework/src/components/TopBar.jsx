import { owner } from '../data';
import { useClock } from '../hooks';
import { Mark, MoonIcon, PowerIcon, SoundIcon, SunIcon } from './Icons';

// Дээд мөр: лого, идэвхтэй цонх, төлөв, ⌘K, дуу, горим, цаг
export default function TopBar({ activeTitle, theme, onTheme, sound, onSound, onPalette, onPower }) {
  const now = useClock();
  const time = now.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });

  return (
    <header className="topbar">
      <div className="tb-left">
        <span className="brand">
          <Mark />
          {owner.firstName}
          <b>/OS</b>
        </span>
        <span className="tb-active">{activeTitle || 'Ширээ'}</span>
      </div>

      <div className="tb-right">
        <span className="status">
          <i className="pulse" />
          {owner.status}
        </span>
        <button className="tb-search" onClick={onPalette}>
          Хайх <kbd>⌘K</kbd>
        </button>
        <button className="tb-icon" onClick={onSound} aria-label={sound ? 'Дуу хаах' : 'Дуу нээх'} title="Дуу">
          <SoundIcon on={sound} />
        </button>
        <button className="tb-icon" onClick={onTheme} aria-label="Горим солих" title="Горим">
          {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
        </button>
        <button className="tb-icon" onClick={onPower} aria-label="Унтраах" title="Унтраах">
          <PowerIcon />
        </button>
        <span className="tb-time">{time}</span>
      </div>
    </header>
  );
}
