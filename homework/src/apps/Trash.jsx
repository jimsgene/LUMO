// Хогийн сав — инээдтэй easter egg
const ITEMS = [
  { name: 'анхны_сайт_2019.html', size: '4 KB', note: '<marquee> таг ашигласан байсан' },
  { name: 'bug_fix_FINAL_v7_жинхэнэ.js', size: '12 KB', note: 'Тэр bug одоо ч байгаа' },
  { name: 'унтсан_цаг.zip', size: '0 B', note: 'Шалгалтын долоо хоногт архивласан' },
  { name: 'comic_sans_дизайн.png', size: '2.1 MB', note: 'Энэ хэзээ ч эргэж ирэхгүй' },
];

export default function Trash({ api }) {
  return (
    <div className="doc">
      <p className="label">
        05 — Хогийн сав <span className="label-right">{ITEMS.length} файл</span>
      </p>
      <ul className="trash-list">
        {ITEMS.map((it) => (
          <li key={it.name}>
            <span className="trash-name">{it.name}</span>
            <span className="trash-size">{it.size}</span>
            <span className="trash-note">{it.note}</span>
          </li>
        ))}
      </ul>
      <button className="btn btn-ghost" onClick={() => api.toast('Хоослож чадсангүй — дурсамжууд хэтэрхий үнэтэй.')}>
        Хогийн савыг хоослох
      </button>
    </div>
  );
}
