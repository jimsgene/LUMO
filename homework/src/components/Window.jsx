// Нэг цонх: гарчгаар чирэх, жижигрүүлэх, томруулах, хаах
export default function Window({ app, index, win, active, isMobile, onFocus, onClose, onMinimize, onMaximize, onMove, children }) {
  if (!win.open) return null;

  // Pointer events ашиглан чирэх (хулгана + touch хоёуланд ажиллана)
  const startDrag = (e) => {
    if (isMobile || win.maximized || e.button !== 0) return;
    if (e.target.closest('button')) return; // товч дээр дарвал чирэхгүй
    e.preventDefault();
    onFocus();
    const offsetX = e.clientX - win.x;
    const offsetY = e.clientY - win.y;

    const move = (ev) => {
      // Цонхыг дэлгэцнээс бүрэн гаргахгүй байх хязгаар
      const x = Math.min(Math.max(ev.clientX - offsetX, 100 - app.w), window.innerWidth - 100);
      const y = Math.min(Math.max(ev.clientY - offsetY, 44), window.innerHeight - 120);
      onMove(x, y);
    };
    const stop = () => {
      window.removeEventListener('pointermove', move);
      window.removeEventListener('pointerup', stop);
    };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', stop);
  };

  const full = isMobile || win.maximized;
  const style = full
    ? { zIndex: win.z }
    : { zIndex: win.z, left: win.x, top: win.y, width: app.w, height: app.h };

  const classes = ['window', active && 'is-active', full && 'is-full', win.minimized && 'is-min']
    .filter(Boolean)
    .join(' ');

  return (
    <section className={classes} style={style} onPointerDown={onFocus} role="dialog" aria-label={app.title}>
      <header className="titlebar" onPointerDown={startDrag} onDoubleClick={() => !isMobile && onMaximize()}>
        <span className="titlebar-title">
          <em>{String(index + 1).padStart(2, '0')}</em>
          {app.title}
          <span className="titlebar-file">{app.file}</span>
        </span>
        <div className="titlebar-buttons">
          <button className="tb-btn" onClick={onMinimize} aria-label="Жижигрүүлэх" title="Жижигрүүлэх">
            <svg viewBox="0 0 12 12"><path d="M2 6h8" /></svg>
          </button>
          {!isMobile && (
            <button className="tb-btn" onClick={onMaximize} aria-label="Томруулах" title="Томруулах">
              <svg viewBox="0 0 12 12"><rect x="2" y="2" width="8" height="8" /></svg>
            </button>
          )}
          <button className="tb-btn tb-close" onClick={onClose} aria-label="Хаах" title="Хаах">
            <svg viewBox="0 0 12 12"><path d="M2.5 2.5l7 7M9.5 2.5l-7 7" /></svg>
          </button>
        </div>
      </header>
      <div className="window-body">{children}</div>
    </section>
  );
}
