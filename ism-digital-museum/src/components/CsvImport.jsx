import { useState } from 'react';
import { Upload, Download } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { parseCsv, toCsv, downloadText } from '../lib/csv';

const DATE = /^\d{4}-\d{2}-\d{2}$/;

// Bulk-adds rows to one admin table from a CSV file (Excel → "Save as CSV UTF-8").
// Headers may be the column key (e.g. "name") or the Mongolian label. Image fields take a public URL.
// Select fields (e.g. event_id) also accept the linked record's title.
export default function CsvImport({ cfg, existing, options, onDone }) {
  const [plan, setPlan] = useState(null); // { rows, errors, skipped, fileName }
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState('');

  const template = () => downloadText(`${cfg.table}_template.csv`, toCsv(cfg.fields.map((f) => f.k)));

  async function read(file) {
    setMsg('');
    const { headers, records } = parseCsv(await file.text());
    const colFor = Object.fromEntries(cfg.fields.map((f) => {
      const h = headers.find((x) => [f.k, f.l.replace(/\s*\(.*\)/, '')].some((n) => n.toLowerCase() === x.toLowerCase()));
      return [f.k, h];
    }));
    const missing = cfg.fields.filter((f) => f.req && !colFor[f.k]).map((f) => f.k);
    if (missing.length) { setPlan(null); setMsg(`CSV-д заавал байх багана алга: ${missing.join(', ')}. Загвар файлыг татаж харна уу.`); return; }

    const seen = new Set(existing.map((r) => String(r[cfg.title] ?? '').trim().toLowerCase()));
    const rows = [], errors = [];
    let skipped = 0;
    records.forEach((rec, idx) => {
      const line = idx + 2; // +1 header, +1 human counting
      const row = {};
      for (const f of cfg.fields) {
        let v = colFor[f.k] ? rec[colFor[f.k]] : '';
        if (v === '') { if (f.req) { errors.push(`${line}-р мөр: "${f.k}" хоосон`); return; } row[f.k] = null; continue; }
        if (f.t === 'number') { if (Number.isNaN(Number(v))) { errors.push(`${line}-р мөр: "${f.k}" тоо биш (${v})`); return; } v = Number(v); }
        if (f.t === 'date' && !DATE.test(v)) { errors.push(`${line}-р мөр: "${f.k}" огноо YYYY-MM-DD байх ёстой (${v})`); return; }
        if (f.t === 'image' && !/^https?:\/\//.test(v)) { errors.push(`${line}-р мөр: "${f.k}" http(s) холбоос байх ёстой`); return; }
        if (f.t === 'select') {
          const o = (options[f.k] || []).find((x) => x.id === v || String(x[f.from.label]).toLowerCase() === v.toLowerCase());
          if (!o) { errors.push(`${line}-р мөр: "${v}" нэртэй ${f.l} олдсонгүй`); return; }
          v = o.id;
        }
        row[f.k] = v;
      }
      const key = String(row[cfg.title] ?? '').trim().toLowerCase();
      if (key && seen.has(key)) { skipped++; return; }
      seen.add(key);
      rows.push(row);
    });
    setPlan({ rows, errors, skipped, fileName: file.name });
  }

  async function run() {
    setBusy(true); setMsg('');
    for (let i = 0; i < plan.rows.length; i += 200) {
      const { error } = await supabase.from(cfg.table).insert(plan.rows.slice(i, i + 200));
      if (error) { setBusy(false); setMsg(`Алдаа (${i + 1}-ээс хойшх мөрүүд нэмэгдээгүй): ${error.message}`); onDone(); return; }
    }
    setBusy(false);
    setMsg(`${plan.rows.length} мөр нэмэгдлээ.`);
    setPlan(null);
    onDone();
  }

  return (
    <details className="csv">
      <summary><Upload size={16} /> CSV файлаас олноор нэмэх</summary>
      <p>Excel/Google Sheets-д мэдээллээ бэлдээд <em>CSV (UTF-8)</em> хэлбэрээр хадгална. Эхний мөр нь баганын нэр.
        Ижил {cfg.title === 'name' ? 'нэртэй' : 'гарчигтай'} бүртгэл байвал алгасна.</p>
      <div className="actions">
        <button type="button" className="btn" onClick={template}><Download size={16} /> Загвар татах</button>
        <label className="btn">Файл сонгох
          <input type="file" accept=".csv,text/csv" hidden onChange={(e) => { const f = e.target.files[0]; e.target.value = ''; if (f) read(f); }} />
        </label>
      </div>
      {msg && <p className="msg" role="status">{msg}</p>}
      {plan && (
        <div className="csv__plan">
          <p><strong>{plan.fileName}</strong>: нэмэх {plan.rows.length}, давхардсан тул алгасах {plan.skipped}, алдаатай {plan.errors.length}</p>
          {plan.errors.length > 0 && <ul className="msg msg--error csv__errors">{plan.errors.slice(0, 10).map((e) => <li key={e}>{e}</li>)}{plan.errors.length > 10 && <li>…</li>}</ul>}
          {plan.rows.length > 0 && (
            <div className="table-wrap"><table className="table">
              <thead><tr>{cfg.fields.map((f) => <th key={f.k}>{f.k}</th>)}</tr></thead>
              <tbody>{plan.rows.slice(0, 5).map((r, i) => <tr key={i}>{cfg.fields.map((f) => <td key={f.k}>{String(r[f.k] ?? '').slice(0, 40)}</td>)}</tr>)}</tbody>
            </table></div>
          )}
          <div className="actions">
            <button type="button" className="btn btn--solid" disabled={busy || plan.rows.length === 0} onClick={run}>
              {busy ? 'Нэмж байна…' : `${plan.rows.length} мөр нэмэх`}
            </button>
            <button type="button" className="btn" onClick={() => setPlan(null)}>Болих</button>
          </div>
        </div>
      )}
    </details>
  );
}
