import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { APPS } from './apps';
import { owner } from './data';
import { loadPref, savePref, useIsMobile, useKonami } from './hooks';
import { playSound, setSoundEnabled } from './sound';
import BootScreen from './components/BootScreen';
import TopBar from './components/TopBar';
import Hero from './components/Hero';
import Widgets from './components/Widgets';
import Dock from './components/Dock';
import Window from './components/Window';
import CommandPalette from './components/CommandPalette';
import MatrixRain from './components/MatrixRain';
import { PowerIcon } from './components/Icons';

const TOP = 44;     // дээд мөрний өндөр + зай
const BOTTOM = 96;  // dock-ийн зай

// Бүх цонхны анхны төлөв (бүгд хаалттай)
const initialWindows = () =>
  Object.fromEntries(APPS.map((a) => [a.id, { open: false, minimized: false, maximized: false, z: 1, x: null, y: null }]));

// Цонхыг дэлгэцийн голд ойролцоо, бага зэрэг шатлуулан байрлуулна
function initialPosition(app, index) {
  const offset = (index % 4) * 32 - 48;
  const freeH = window.innerHeight - TOP - BOTTOM;
  return {
    x: Math.max(16, (window.innerWidth - app.w) / 2 + offset),
    y: Math.max(TOP + 8, TOP + Math.min((freeH - app.h) / 2 + offset, freeH - app.h)),
  };
}

export default function App() {
  const isMobile = useIsMobile();
  const [stage, setStage] = useState('boot'); // 'boot' | 'desktop' | 'off'
  const [theme, setTheme] = useState(() => loadPref('theme', 'light'));
  const [sound, setSound] = useState(() => loadPref('sound', true));
  const [windows, setWindows] = useState(initialWindows);
  const [activeId, setActiveId] = useState(null);
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [menu, setMenu] = useState(null); // баруун товчны цэс {x, y}
  const [toasts, setToasts] = useState([]);
  const [matrix, setMatrix] = useState(false);

  const zRef = useRef(10); // хамгийн дээд z-index
  const winRef = useRef(windows);
  winRef.current = windows;
  const stageRef = useRef(stage);
  stageRef.current = stage;

  // ---- Тохиргоог хадгалах ----
  useEffect(() => {
    document.documentElement.dataset.theme = theme;
    savePref('theme', theme);
  }, [theme]);
  useEffect(() => {
    setSoundEnabled(sound);
    savePref('sound', sound);
  }, [sound]);

  // ---- Мэдэгдэл (toast) ----
  const toast = useCallback((text) => {
    const id = Date.now() + Math.random();
    setToasts((t) => [...t, { id, text }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);

  // ---- Цонхны удирдлага ----
  const updateWin = (id, patch) => setWindows((w) => ({ ...w, [id]: { ...w[id], ...patch } }));

  const focusApp = useCallback((id) => {
    zRef.current += 1;
    const z = zRef.current;
    setWindows((w) => ({ ...w, [id]: { ...w[id], z, minimized: false } }));
    setActiveId(id);
  }, []);

  const openApp = useCallback((id) => {
    const current = winRef.current[id];
    if (!current) return;
    if (!current.open) playSound('open');
    zRef.current += 1;
    const z = zRef.current;
    setWindows((w) => {
      const win = w[id];
      const index = APPS.findIndex((a) => a.id === id);
      const pos = win.x === null ? initialPosition(APPS[index], index) : {};
      return { ...w, [id]: { ...win, ...pos, open: true, minimized: false, z } };
    });
    setActiveId(id);
  }, []);

  const closeApp = useCallback((id) => {
    playSound('close');
    setWindows((w) => ({ ...w, [id]: { ...w[id], open: false, maximized: false, minimized: false } }));
    setActiveId((a) => (a === id ? null : a));
  }, []);

  const minimizeApp = (id) => {
    updateWin(id, { minimized: true });
    setActiveId(null);
  };

  // Dock дээр дарахад: хаалттай → нээнэ, нуугдсан/ард → урдаа, идэвхтэй → нууна
  const onDockClick = (id) => {
    const win = windows[id];
    if (!win.open) openApp(id);
    else if (win.minimized || activeId !== id) focusApp(id);
    else minimizeApp(id);
  };

  const toggleTheme = useCallback(() => setTheme((t) => (t === 'dark' ? 'light' : 'dark')), []);
  const triggerMatrix = useCallback(() => setMatrix(true), []);
  const stopMatrix = useCallback(() => setMatrix(false), []);

  const resetDesktop = () => {
    setWindows(initialWindows());
    setActiveId(null);
    setPaletteOpen(false);
    setMenu(null);
  };

  const copyEmail = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(owner.email);
      toast('Имэйл хуулагдлаа → ' + owner.email);
    } catch {
      toast(owner.email);
    }
  }, [toast]);

  // Апп-ууд руу дамжуулах API (Terminal, Contact гэх мэт ашиглана)
  const api = useMemo(
    () => ({ openApp, closeApp, toast, setTheme, toggleTheme, matrix: triggerMatrix, copyEmail }),
    [openApp, closeApp, toast, toggleTheme, triggerMatrix, copyEmail]
  );

  // ⌘K самбарын командууд
  const actions = [
    ...APPS.map((a) => ({ id: `open-${a.id}`, label: `${a.title} нээх`, group: 'Апп', icon: a.id, keywords: a.file, run: () => openApp(a.id) })),
    { id: 'theme', label: theme === 'dark' ? 'Өдрийн горим' : 'Шөнийн горим', group: 'Үйлдэл', keywords: 'theme dark light', run: toggleTheme },
    { id: 'sound', label: sound ? 'Дуу хаах' : 'Дуу нээх', group: 'Үйлдэл', keywords: 'sound', run: () => setSound((s) => !s) },
    { id: 'email', label: 'Имэйл хуулах', group: 'Үйлдэл', keywords: 'email mail', run: copyEmail },
    { id: 'github', label: 'GitHub', group: 'Холбоос', keywords: 'code repo', run: () => window.open(owner.github, '_blank', 'noopener') },
    ...(owner.linkedin ? [{ id: 'linkedin', label: 'LinkedIn', group: 'Холбоос', run: () => window.open(owner.linkedin, '_blank', 'noopener') }] : []),
    { id: 'close-all', label: 'Бүх цонхыг хаах', group: 'Үйлдэл', keywords: 'close', run: resetDesktop },
    { id: 'shutdown', label: 'Унтраах', group: 'Систем', keywords: 'power off', run: () => { resetDesktop(); setStage('off'); } },
    { id: 'matrix', label: 'Улаан эм үү, цэнхэр эм үү?', group: 'Нууц', keywords: 'matrix neo', hidden: true, run: triggerMatrix },
  ];

  // ---- Ачаалал ----
  const onBootDone = useCallback(() => {
    if (stageRef.current !== 'boot') return;
    setStage('desktop');
    playSound('boot');
    setTimeout(() => toast('⌘K эсвэл Ctrl+K — бүх командыг нээнэ'), 1400);
  }, [toast]);

  // Easter egg: Konami код
  useKonami(() => {
    if (stageRef.current === 'desktop') setMatrix(true);
  });

  // Гарын товчлол: ⌘K / Ctrl+K самбар, Esc хаах
  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        if (stageRef.current === 'desktop') setPaletteOpen((p) => !p);
      } else if (e.key === 'Escape') {
        setPaletteOpen(false);
        setMenu(null);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (stage === 'off') {
    return (
      <div className="off-screen">
        <p className="off-kicker">[ сесс дууслаа ]</p>
        <h1>Дахин<br />уулзъя.</h1>
        <button className="power-btn" onClick={() => setStage('boot')} aria-label="Асаах">
          <PowerIcon size={26} />
        </button>
        <small>Дахин асаах</small>
      </div>
    );
  }

  const openContextMenu = (e) => {
    if (isMobile || e.target.closest('.window, .palette')) return;
    e.preventDefault();
    setMenu({ x: Math.min(e.clientX, window.innerWidth - 240), y: Math.min(e.clientY, window.innerHeight - 220) });
  };

  const activeApp = APPS.find((a) => a.id === activeId);
  const ready = stage === 'desktop';

  return (
    <div className="desktop" onClick={() => setMenu(null)} onContextMenu={openContextMenu}>
      <div className="grain" aria-hidden="true" />

      <TopBar
        activeTitle={activeApp && !windows[activeApp.id].minimized ? activeApp.title : null}
        theme={theme}
        onTheme={toggleTheme}
        sound={sound}
        onSound={() => setSound((s) => !s)}
        onPalette={() => setPaletteOpen(true)}
        onPower={() => {
          resetDesktop();
          setStage('off');
        }}
      />

      <Hero ready={ready} onOpen={openApp} onPalette={() => setPaletteOpen(true)} />
      {!isMobile && <Widgets ready={ready} onOpen={openApp} />}

      {/* Цонхнууд */}
      {APPS.map((a, i) => (
        <Window
          key={a.id}
          app={a}
          index={i}
          win={windows[a.id]}
          active={activeId === a.id}
          isMobile={isMobile}
          onFocus={() => activeId !== a.id && focusApp(a.id)}
          onClose={() => closeApp(a.id)}
          onMinimize={() => minimizeApp(a.id)}
          onMaximize={() => updateWin(a.id, { maximized: !windows[a.id].maximized })}
          onMove={(x, y) => updateWin(a.id, { x, y })}
        >
          <a.Component api={api} />
        </Window>
      ))}

      {/* Баруун товчны цэс */}
      {menu && (
        <ul className="context-menu" style={{ left: menu.x, top: menu.y }} onClick={(e) => e.stopPropagation()}>
          <li><button onClick={() => { setPaletteOpen(true); setMenu(null); }}>Командын самбар <kbd>⌘K</kbd></button></li>
          <li><button onClick={() => { openApp('terminal'); setMenu(null); }}>Терминал нээх</button></li>
          <li className="sep" />
          <li><button onClick={() => { toggleTheme(); setMenu(null); }}>{theme === 'dark' ? 'Өдрийн горим' : 'Шөнийн горим'}</button></li>
          <li className="sep" />
          <li><button onClick={() => { resetDesktop(); toast('Ширээ цэвэрлэгдлээ'); }}>Бүх цонхыг хаах</button></li>
        </ul>
      )}

      <Dock apps={APPS} windows={windows} activeId={activeId} onClick={onDockClick} onPalette={() => setPaletteOpen(true)} />

      {paletteOpen && <CommandPalette actions={actions} onClose={() => setPaletteOpen(false)} />}

      <div className="toasts" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className="toast">{t.text}</div>
        ))}
      </div>

      {matrix && <MatrixRain onDone={stopMatrix} />}
      {stage === 'boot' && <BootScreen onDone={onBootDone} />}
    </div>
  );
}
