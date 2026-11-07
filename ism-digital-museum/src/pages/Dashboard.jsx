import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useAuth } from '../lib/auth';
import { techList } from '../lib/plate';
import { statusMn } from '../lib/format';

const empty = { title: '', description: '', category: '', year_created: new Date().getFullYear(), tech: '', demo_url: '', github_url: '', image_url: '' };
const isUrl = (s) => !s || /^https?:\/\/.+\..+/.test(s);

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [params, setParams] = useSearchParams();
  const [mine, setMine] = useState([]);
  const [pending, setPending] = useState([]);
  const [cats, setCats] = useState([]);
  const [form, setForm] = useState(empty);
  const [editId, setEditId] = useState(null);
  const [file, setFile] = useState(null);
  const [error, setError] = useState('');
  const [ok, setOk] = useState('');
  const [busy, setBusy] = useState(false);
  const isAdmin = profile?.role === 'admin';

  const load = useCallback(async () => {
    const m = await supabase.from('exhibits').select('*').eq('creator_id', user.id).order('created_at', { ascending: false });
    setMine(m.data || []);
    const c = await supabase.from('exhibition_categories').select('name').order('name');
    setCats(c.data || []);
    if (isAdmin) {
      const p = await supabase.from('exhibits').select('*, profiles(display_name)').eq('status', 'pending').order('created_at');
      setPending(p.data || []);
    }
  }, [user.id, isAdmin]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const id = params.get('edit');
    if (!id) return;
    supabase.from('exhibits').select('*').eq('id', id).maybeSingle().then(({ data }) => data && startEdit(data));
    // eslint-disable-next-line
  }, [params]);

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  function startEdit(x) {
    setEditId(x.id);
    setForm({ ...x, tech: techList(x.technology_stack).join(', '), description: x.description || '', category: x.category || '', demo_url: x.demo_url || '', github_url: x.github_url || '' });
    setFile(null); setError(''); setOk('');
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  }
  function reset() { setEditId(null); setForm(empty); setFile(null); setParams({}); }

  async function save(e) {
    e.preventDefault();
    setError(''); setOk('');
    const year = Number(form.year_created);
    if (!form.title.trim()) return setError('Гарчиг оруулна уу.');
    if (!(year >= 2000 && year <= new Date().getFullYear() + 1)) return setError('Зөв он оруулна уу.');
    if (!isUrl(form.demo_url) || !isUrl(form.github_url)) return setError('Холбоос http:// эсвэл https://-ээр эхлэх ёстой.');
    if (file && !file.type.startsWith('image/')) return setError('Зөвхөн зураг оруулна уу.');
    if (file && file.size > 3 * 1024 * 1024) return setError('Зураг 3 MB-аас бага байх ёстой.');
    setBusy(true);

    let image_url = form.image_url || null;
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-z0-9.]/gi, '_')}`;
      const up = await supabase.storage.from('images').upload(path, file);
      if (up.error) { setBusy(false); return setError(`Зураг оруулж чадсангүй: ${up.error.message}`); }
      image_url = supabase.storage.from('images').getPublicUrl(path).data.publicUrl;
    }
    const row = {
      title: form.title.trim(), description: form.description, category: form.category || null,
      year_created: year, technology_stack: form.tech.split(',').map((s) => s.trim()).filter(Boolean),
      demo_url: form.demo_url || null, github_url: form.github_url || null, image_url,
    };
    const res = editId
      ? await supabase.from('exhibits').update(isAdmin ? row : { ...row, status: 'pending' }).eq('id', editId)
      : await supabase.from('exhibits').insert({ ...row, creator_id: user.id, status: 'pending' });
    setBusy(false);
    if (res.error) return setError(res.error.message);
    setOk(editId ? 'Өөрчлөлт хадгалагдлаа.' : 'Үзмэр илгээгдлээ. Админ шалгасны дараа нийтлэгдэнэ.');
    reset(); load();
  }

  async function remove(x) {
    if (!window.confirm(`"${x.title}"-ийг устгах уу? Буцаах боломжгүй.`)) return;
    const { error } = await supabase.from('exhibits').delete().eq('id', x.id);
    if (error) return setError(error.message);
    setOk('Үзмэр устгагдлаа.'); load();
  }

  async function review(x, status) {
    const { error } = await supabase.from('exhibits').update({ status }).eq('id', x.id);
    if (error) return setError(error.message);
    setOk(`Үзмэр ${statusMn[status]}.`); load();
  }

  return (
    <main className="container section">
      <h1 className="h2">Миний бүтээл</h1>
      {isAdmin && <p><Link className="link" to="/admin">Багш, арга хэмжээ, түүх удирдах хэсэг рүү очих</Link></p>}
      {error && <p className="msg msg--error" role="alert">{error}</p>}
      {ok && <p className="msg" role="status">{ok}</p>}

      {isAdmin && (
        <section className="block">
          <h2 className="h3">Шалгахыг хүлээж буй ({pending.length})</h2>
          {pending.length === 0 ? <p className="empty">Шалгах зүйл алга.</p> : (
            <div className="table-wrap"><table className="table">
              <thead><tr><th>Гарчиг</th><th>Бүтээгч</th><th>Он</th><th></th></tr></thead>
              <tbody>
                {pending.map((x) => (
                  <tr key={x.id}>
                    <td><Link className="link" to={`/exhibits/${x.id}`}>{x.title}</Link></td>
                    <td>{x.profiles?.display_name}</td><td>{x.year_created}</td>
                    <td className="row-actions">
                      <button className="btn btn--solid" onClick={() => review(x, 'approved')}>Зөвшөөрөх</button>
                      <button className="btn" onClick={() => review(x, 'rejected')}>Татгалзах</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table></div>
          )}
        </section>
      )}

      <section className="block">
        <h2 className="h3">Миний үзмэрүүд</h2>
        {mine.length === 0 ? <p className="empty">Танд үзмэр байхгүй байна. Доорх маягтаар эхний үзмэрээ нэмнэ үү.</p> : (
          <div className="table-wrap"><table className="table">
            <thead><tr><th>Гарчиг</th><th>Он</th><th>Төлөв</th><th></th></tr></thead>
            <tbody>
              {mine.map((x) => (
                <tr key={x.id}>
                  <td><Link className="link" to={`/exhibits/${x.id}`}>{x.title}</Link></td>
                  <td>{x.year_created}</td>
                  <td><span className={`badge badge--${x.status}`}>{statusMn[x.status]}</span></td>
                  <td className="row-actions">
                    <button className="btn" onClick={() => startEdit(x)}>Засах</button>
                    <button className="btn" onClick={() => remove(x)}>Устгах</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table></div>
        )}
      </section>

      <section className="block">
        <h2 className="h3">{editId ? 'Үзмэр засах' : 'Үзмэр нэмэх'}</h2>
        <form onSubmit={save} className="form" noValidate>
          <label>Гарчиг<input value={form.title} onChange={set('title')} /></label>
          <label>Тайлбар<textarea rows={5} value={form.description} onChange={set('description')} /></label>
          <label>Ангилал
            <select value={form.category} onChange={set('category')}>
              <option value="">Ангилал сонгох</option>
              {cats.map((c) => <option key={c.name}>{c.name}</option>)}
            </select>
          </label>
          <label>Он<input type="number" value={form.year_created} onChange={set('year_created')} /></label>
          <label>Технологи (таслалаар тусгаарла)<input value={form.tech} onChange={set('tech')} placeholder="React, Supabase" /></label>
          <label>Demo холбоос<input value={form.demo_url} onChange={set('demo_url')} placeholder="https://" /></label>
          <label>GitHub холбоос<input value={form.github_url} onChange={set('github_url')} placeholder="https://github.com/" /></label>
          <label>Зураг
            <input type="file" accept="image/*" onChange={(e) => setFile(e.target.files[0] || null)} />
          </label>
          {(file || form.image_url) && (
            <img className="preview" src={file ? URL.createObjectURL(file) : form.image_url} alt="Урьдчилан харах" />
          )}
          <div className="actions">
            <button className="btn btn--solid" disabled={busy}>{busy ? 'Хадгалж байна…' : editId ? 'Өөрчлөлт хадгалах' : 'Үзмэр илгээх'}</button>
            {editId && <button type="button" className="btn" onClick={reset}>Болих</button>}
          </div>
        </form>
      </section>
    </main>
  );
}