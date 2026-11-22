import { useEffect, useRef, useState } from 'react';
import { ActionIcon, AppIcon, LinkIcon, SearchIcon } from './Icons';

// ⌘K / Ctrl+K командын самбар. Бичих тусам шүүнэ, ↑↓ сонгоно, Enter ажиллуулна.
// actions: [{ id, label, group, icon, keywords, hidden, run }]
export default function CommandPalette({ actions, onClose }) {
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const q = query.trim().toLowerCase();
  const results = actions.filter((a) => {
    const text = `${a.label} ${a.keywords || ''}`.toLowerCase();
    if (a.hidden) return q.length > 2 && (a.keywords || '').includes(q); // нууц команд — зөв бичвэл л гарна
    return text.includes(q);
  });

  useEffect(() => inputRef.current?.focus(), []);
  useEffect(() => setIndex(0), [query]);
  useEffect(() => {
    listRef.current?.querySelector('.is-selected')?.scrollIntoView({ block: 'nearest' });
  }, [index]);

  const run = (action) => {
    onClose();
    action.run();
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === 'Enter' && results[index]) {
      run(results[index]);
    } else if (e.key === 'Escape') {
      onClose();
    }
  };

  const icon = (a) =>
    a.icon ? <AppIcon id={a.icon} size={18} /> : a.group === 'Холбоос' ? <LinkIcon /> : <ActionIcon />;

  return (
    <div className="palette-backdrop" onPointerDown={onClose}>
      <div className="palette" onPointerDown={(e) => e.stopPropagation()} role="dialog" aria-label="Командын самбар">
        <div className="palette-input">
          <SearchIcon />
          <input
            ref={inputRef}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={onKeyDown}
            placeholder="Хаашаа очих вэ? Бичээд үзээрэй…"
            aria-label="Команд хайх"
          />
          <kbd>esc</kbd>
        </div>

        <ul className="palette-list" ref={listRef}>
          {results.length === 0 && <li className="palette-empty">Юу ч олдсонгүй. “matrix” гэж бичээд үзэх үү? 👀</li>}
          {results.map((a, i) => (
            <li key={a.id}>
              <button
                className={i === index ? 'is-selected' : ''}
                onMouseMove={() => setIndex(i)}
                onClick={() => run(a)}
              >
                <span className="palette-icon">{icon(a)}</span>
                <span className="palette-label">{a.label}</span>
                <span className="palette-group">{a.group}</span>
              </button>
            </li>
          ))}
        </ul>

        <div className="palette-foot">
          <span><kbd>↑</kbd><kbd>↓</kbd> сонгох</span>
          <span><kbd>↵</kbd> нээх</span>
          <span>{results.length} үр дүн</span>
        </div>
      </div>
    </div>
  );
}
