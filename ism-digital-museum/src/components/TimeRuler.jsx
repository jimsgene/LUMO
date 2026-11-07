// Бодит өгөгдлөөс гарсан жилийн хуваарь. value = сонгосон жил эсвэл null.
export default function TimeRuler({ years, value, onChange }) {
  return (
    <div className="ruler" role="group" aria-label="Жилээр шүүх">
      <div className="container ruler__row">
        <button type="button" className="ruler__tick" aria-pressed={value === null} onClick={() => onChange(null)}>
          Бүх он
        </button>
        {years.map((y) => (
          <button key={y} type="button" className="ruler__tick" aria-pressed={value === y}
            onClick={() => onChange(value === y ? null : y)}>
            {y}
          </button>
        ))}
      </div>
    </div>
  );
}