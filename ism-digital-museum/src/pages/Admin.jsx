import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/useAuth';
import { useAsync, must } from '../lib/useAsync';
import { useTitle } from '../lib/useTitle';
import CsvImport from '../components/CsvImport';
import { byDeptOrder } from '../lib/order';

// Нэг тохиргоогоор бүх хүснэгтийн CRUD-ийг удирдана.
const RESOURCES = {
  teachers: {
    label: 'Багш нар', table: 'teachers', title: 'name', order: 'name', sortRows: true,
    fields: [
      { k: 'name', l: 'Нэр', req: true },
      { k: 'position', l: 'Албан тушаал' },
      { k: 'courses', l: 'Заадаг хичээл (таслалаар тусгаарла)' },
      { k: 'degree', l: 'Цол зэрэг (MBA, Ph.D)' },
      { k: 'email', l: 'Имэйл' },
      { k: 'office', l: 'Өрөө' },
      { k: 'sort_order', l: 'Дараалал (1 = эхэнд)', t: 'number' },
      { k: 'bio', l: 'Товч танилцуулга', t: 'textarea' },
      { k: 'education', l: 'Боловсрол (мөр бүрт нэг)', t: 'textarea' },
      { k: 'certification', l: 'Мэргэшлийн зэрэг (мөр бүрт нэг)', t: 'textarea' },
      { k: 'research', l: 'Судалгааны чиглэл (таслалаар)', t: 'textarea' },
      { k: 'publications', l: 'Бүтээл (мөр бүрт нэг)', t: 'textarea' },
      { k: 'activities', l: 'Мэргэжлийн үйл ажиллагаа (мөр бүрт нэг)', t: 'textarea' },
      { k: 'awards', l: 'Шагнал (мөр бүрт нэг)', t: 'textarea' },
      { k: 'photo_url', l: 'Зураг', t: 'image' },
    ],
  },
  events: {
    label: 'Арга хэмжээ', table: 'events', title: 'title', order: 'event_date',
    fields: [
      { k: 'title', l: 'Нэр', req: true },
      { k: 'event_date', l: 'Огноо', t: 'date', req: true },
      { k: 'description', l: 'Тайлбар', t: 'textarea' },
      { k: 'cover_image_url', l: 'Нүүр зураг', t: 'image' },
    ],
  },
  event_photos: {
    label: 'Зурагт цомог', table: 'event_photos', title: 'caption', order: 'id',
    fields: [
      { k: 'event_id', l: 'Арга хэмжээ', t: 'select', from: { table: 'events', label: 'title' }, req: true },
      { k: 'image_url', l: 'Зураг', t: 'image', req: true },
      { k: 'caption', l: 'Тайлбар' },
    ],
  },
  milestones: {
    label: 'Түүх', table: 'milestones', title: 'title', order: 'year',
    fields: [
      { k: 'year', l: 'Он', t: 'number', req: true },
      { k: 'title', l: 'Гарчиг', req: true },
      { k: 'description', l: 'Тайлбар', t: 'textarea' },
      { k: 'image_url', l: 'Зураг', t: 'image' },
    ],
  },
  exhibition_categories: {
    label: 'Ангилал', table: 'exhibition_categories', title: 'name', order: 'name',
    fields: [
      { k: 'name', l: 'Нэр', req: true },
      { k: 'description', l: 'Тайлбар', t: 'textarea' },
    ],
  },
};

async function loadPanel(cfg) {
  let rows = must(await supabase.from(cfg.table).select('*').order(cfg.order, { ascending: cfg.order === 'name' }));
  if (cfg.sortRows) rows = [...rows].sort(byDeptOrder);
  const opts = {};
  for (const f of cfg.fields.filter((x) => x.t === 'select')) {
    opts[f.k] = (await supabase.from(f.from.table).select(`id,${f.from.label}`)).data || [];
  }
  return { rows, opts };
}

// Remounted per tab (key={tab}), so form state starts fresh for each table.
function Panel({ cfg: baseCfg }) {
  const { data, status, reload } = useAsync(() => loadPanel(baseCfg), baseCfg.table);
  const rows = useMemo(() => data?.rows ?? [], [data]);
  const opts = data?.opts ?? {};
  // Only offer fields whose columns exist yet (e.g. before db/seed-data/teachers.sql adds the new teacher columns)
  const cfg = useMemo(() => {
    if (!rows.length) return baseCfg;
    const cols = new Set(Object.keys(rows[0]));
    return { ...baseCfg, fields: baseCfg.fields.filter((f) => cols.has(f.k)) };
  }, [baseCfg, rows]);
  const load = reload;
  const [form, setForm] = useState({});
  const [files, setFiles] = useState({});
  const [editId, setEditId] = useState(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);

  function reset() { setForm({}); setFiles({}); setEditId(null); }
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  async function save(e) {
    e.preventDefault();
    setError(''); setOk('');
    for (const f of cfg.fields) {
      if (f.req && !String(form[f.k] ?? '').trim() && !files[f.k]) return setError(`"${f.l}" талбарыг бөглөнө үү.`);
    }
    for (const f of Object.values(files)) {
      if (!f.type.startsWith('image/')) return setError('Зөвхөн зураг оруулна уу.');
      if (f.size > 3 * 1024 * 1024) return setError('Зураг 3 MB-аас бага байх ёстой.');
    }
    setBusy(true);
    const row = {};
    for (const f of cfg.fields) {
      let v = form[f.k];
      if (f.t === 'image' && files[f.k]) {
        const file = files[f.k];
        const path = `admin/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
        const up = await supabase.storage.from('images').upload(path, file);
        if (up.error) { setBusy(false); return setError(`Зураг оруулж чадсангүй: ${up.error.message}`); }
        v = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
      }
      if (f.t === 'number') v = v === '' || v == null ? null : Number(v);
      else if (v === '' || v === undefined) v = null;
      row[f.k] = v;
    }
    const res = editId
      ? await supabase.from(cfg.table).update(row).eq('id', editId)
      : await supabase.from(cfg.table).insert(row);
    setBusy(false);
    if (res.error) return setError(res.error.message);
    setOk(editId ? 'Өөрчлөлт хадгалагдлаа.' : 'Нэмэгдлээ.');
    reset(); load();
  }

  async function remove(r) {
    if (!window.confirm('Устгах уу? Буцаах боломжгүй.')) return;
    const { error } = await supabase.from(cfg.table).delete().eq('id', r.id);
    if (error) return setError(error.message);
    setOk('Устгагдлаа.'); load();
  }

  const imgField = cfg.fields.find((f) => f.t === 'image');

  return (
    <div>
      {error && <p className="msg msg--error" role="alert">{error}</p>}
      {ok && <p className="msg" role="status">{ok}</p>}

      <CsvImport cfg={cfg} existing={rows} options={opts} onDone={load} />
      {status === 'loading' ? <p>Ачаалж байна…</p> : rows.length === 0 ? <p className="empty">Одоогоор бүртгэл алга.</p> : (
        <div className="table-wrap"><table className="table">
          <thead><tr><th>Нэр ({rows.length})</th><th></th></tr></thead>
          <tbody>
            {rows.map((r) => (
              <tr key={r.id}>
                <td>
                  <span className="admin-row">
                    {imgField && r[imgField.k] && <img className="thumb" src={r[imgField.k]} alt="" />}
                    {r[cfg.title] || r.id}
                  </span>
                </td>
                <td className="row-actions">
                  <button className="btn" onClick={() => { setEditId(r.id); setForm({ ...r }); setFiles({}); window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' }); }}>Засах</button>
                  <button className="btn" onClick={() => remove(r)}>Устгах</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table></div>
      )}

      <h3 className="h3 gap-top">{editId ? 'Засах' : 'Шинээр нэмэх'}</h3>
      <form onSubmit={save} className="form" noValidate>
        {cfg.fields.map((f) => (
          <label key={f.k}>{f.l}{f.req ? ' *' : ''}
            {f.t === 'textarea' ? (
              <textarea rows={4} value={form[f.k] ?? ''} onChange={set(f.k)} />
            ) : f.t === 'select' ? (
              <select value={form[f.k] ?? ''} onChange={set(f.k)}>
                <option value="">Сонгох</option>
                {(opts[f.k] || []).map((o) => <option key={o.id} value={o.id}>{o[f.from.label]}</option>)}
              </select>
            ) : f.t === 'image' ? (
              <>
                <input type="file" accept="image/*" onChange={(e) => setFiles({ ...files, [f.k]: e.target.files[0] })} />
                {(files[f.k] || form[f.k]) && (
                  <img className="preview" src={files[f.k] ? URL.createObjectURL(files[f.k]) : form[f.k]} alt="Урьдчилан харах" />
                )}
              </>
            ) : (
              <input type={f.t || 'text'} value={form[f.k] ?? ''} onChange={set(f.k)} />
            )}
          </label>
        ))}
        <div className="actions">
          <button className="btn btn--solid" disabled={busy}>{busy ? 'Хадгалж байна…' : editId ? 'Өөрчлөлт хадгалах' : 'Нэмэх'}</button>
          {editId && <button type="button" className="btn" onClick={reset}>Болих</button>}
        </div>
      </form>
    </div>
  );
}

export default function Admin() {
  const { profile, loading } = useAuth();
  const [tab, setTab] = useState('teachers');
  useTitle('Админ');

  if (loading || !profile) return <main className="container section"><p>Ачаалж байна…</p></main>;
  if (profile.role !== 'admin') return (
    <main className="container section">
      <h1 className="h2">Хандах эрхгүй</h1>
      <p>Энэ хуудас зөвхөн администраторт зориулагдсан.</p>
      <Link to="/" className="link">Нүүр хуудас руу буцах</Link>
    </main>
  );

  return (
    <main className="container section">
      <h1 className="h2">Админ удирдлага</h1>
      <p><Link className="link" to="/dashboard">Үзмэр шалгах хэсэг рүү очих</Link></p>
      <div className="tabs" role="group" aria-label="Хүснэгт сонгох">
        {Object.entries(RESOURCES).map(([k, r]) => (
          <button key={k} className="tab" aria-pressed={tab === k} onClick={() => setTab(k)}>{r.label}</button>
        ))}
      </div>
      <Panel key={tab} cfg={RESOURCES[tab]} />
    </main>
  );
}