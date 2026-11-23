import { useEffect, useRef, useState } from 'react';
import { bio, hardSkills, owner, projects, softSkills } from '../data';

const PROMPT = `${owner.firstName.toLowerCase()}@os:~$`;

// Терминалаас нээж болох апп-ууд
const OPENABLE = ['about', 'projects', 'contact', 'trash'];

// Түвшинг (1–5) одоор харуулна: ★★★★☆
const bar = (level) => '★'.repeat(level) + '☆'.repeat(5 - level);

const FILES = {
  'about.txt': () => bio,
  'contact.txt': () => [`Имэйл : ${owner.email}`, `GitHub : ${owner.github}`],
  'secret.txt': () => ['🤫 Konami код: ↑ ↑ ↓ ↓ ← → ← → B A', '(терминалаас гараад ширээн дээр туршаарай)'],
};

// Команд бүр: мөрүүдийн массив буцаана. api-аар бусад цонхыг удирдана.
function runCommand(input, api) {
  const [cmd, ...args] = input.trim().split(/\s+/);
  const arg = args.join(' ');

  switch (cmd.toLowerCase()) {
    case '':
      return [];
    case 'help':
      return [
        'Боломжит командууд:',
        '  whoami          — би хэн бэ',
        '  about           — товч намтар',
        '  skills          — ур чадвар',
        '  projects        — бүтээлүүдийн жагсаалт',
        '  contact         — холбоо барих',
        '  open <нэр>      — цонх нээх (about, projects, contact...)',
        '  ls / cat <файл> — файл үзэх',
        '  theme [dark|light]',
        '  date, echo, history, clear, exit',
        '  ...мөн хэдэн нууц команд 👀',
      ];
    case 'whoami':
      return [`${owner.name} — ${owner.role}`, owner.tagline];
    case 'about':
      return bio;
    case 'skills':
      return [
        '# Hard skills',
        ...hardSkills.map((s) => `  ${s.name.padEnd(18)} ${bar(s.level)}`),
        '# Soft skills',
        ...softSkills.map((s) => `  ${s.name.padEnd(18)} ${bar(s.level)}`),
      ];
    case 'projects':
      return [
        ...projects.map((p, i) => `  ${i + 1}. ${p.title.padEnd(24)} [${p.tech.join(', ')}]`),
        '',
        "Дэлгэрэнгүйг 'open projects' гэж үзнэ үү.",
      ];
    case 'contact':
      return FILES['contact.txt']();
    case 'open':
      if (OPENABLE.includes(arg)) {
        api.openApp(arg);
        return [`→ ${arg} нээгдлээ`];
      }
      return [{ err: `open: '${arg}' олдсонгүй. Сонголт: ${OPENABLE.join(', ')}` }];
    case 'ls':
      return [Object.keys(FILES).join('   ') + '   projects/'];
    case 'cat':
      if (FILES[arg]) return FILES[arg]();
      return [{ err: `cat: ${arg || '(хоосон)'}: ийм файл алга` }];
    case 'theme':
      if (arg === 'dark' || arg === 'light') api.setTheme(arg);
      else api.toggleTheme();
      return ['🎨 Горим солигдлоо'];
    case 'date':
      return [new Date().toLocaleString('mn-MN')];
    case 'echo':
      return [arg];
    case 'exit':
      api.closeApp('terminal');
      return [];
    // ---- Нууц командууд (easter egg) ----
    case 'sudo':
      return [{ err: `Уучлаарай, энэ OS-ийн админ нь зөвхөн ${owner.firstName} 😎` }];
    case 'matrix':
      api.matrix();
      return ['Wake up, Neo...'];
    case 'coffee':
      return ['    ( (', '     ) )', '  ........', '  |      |]', '  \\      /', "   `----'", 'Кофе бэлэн ☕ — код бичих эрч хүч +20%'];
    case 'rm':
      return [{ err: 'rm: Хөөе! Миний бүтээлүүдийг устгах гэж байна уу? 😱' }];
    default:
      return [{ err: `${cmd}: команд олдсонгүй. 'help' гэж бичээд үзээрэй.` }];
  }
}

export default function Terminal({ api }) {
  const [lines, setLines] = useState([
    { text: `${owner.firstName}OS терминал v1.0` },
    { text: "Командуудыг харах бол 'help' гэж бичнэ үү." },
  ]);
  const [value, setValue] = useState('');
  const [history, setHistory] = useState([]);
  const [hIndex, setHIndex] = useState(-1);
  const inputRef = useRef(null);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [lines]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const submit = (e) => {
    e.preventDefault();
    const input = value;
    setValue('');
    setHIndex(-1);
    if (input.trim()) setHistory((h) => [input, ...h]);

    if (input.trim() === 'clear') return setLines([]);
    if (input.trim() === 'history') {
      return setLines((l) => [...l, { cmd: input }, ...history.slice().reverse().map((h, i) => ({ text: `  ${i + 1}  ${h}` }))]);
    }

    const output = runCommand(input, api).map((o) => (typeof o === 'string' ? { text: o } : { text: o.err, err: true }));
    setLines((l) => [...l, { cmd: input }, ...output]);
  };

  // ↑/↓ өмнөх командууд, Tab автоматаар гүйцээх
  const onKeyDown = (e) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      const i = Math.min(hIndex + 1, history.length - 1);
      if (history[i] !== undefined) {
        setHIndex(i);
        setValue(history[i]);
      }
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const i = hIndex - 1;
      setHIndex(Math.max(i, -1));
      setValue(i >= 0 ? history[i] : '');
    } else if (e.key === 'Tab') {
      e.preventDefault();
      const all = ['help', 'whoami', 'about', 'skills', 'projects', 'contact', 'open', 'ls', 'cat', 'theme', 'date', 'echo', 'history', 'clear', 'exit'];
      const match = all.find((c) => c.startsWith(value));
      if (value && match) setValue(match + ' ');
    }
  };

  return (
    <div className="terminal" onClick={() => inputRef.current?.focus()}>
      {lines.map((l, i) =>
        l.cmd !== undefined ? (
          <div key={i}>
            <span className="t-prompt">{PROMPT}</span> {l.cmd}
          </div>
        ) : (
          <div key={i} className={l.err ? 't-err' : ''}>
            {l.text || ' '}
          </div>
        )
      )}
      <form onSubmit={submit} className="t-input-row">
        <span className="t-prompt">{PROMPT}</span>
        <input
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          autoCapitalize="off"
          aria-label="Терминалын команд"
        />
      </form>
      <div ref={endRef} />
    </div>
  );
}
