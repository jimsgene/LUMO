import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { errMn } from '../lib/format';

export default function Login() {
  const nav = useNavigate();
  const [mode, setMode] = useState('signin');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [info, setInfo] = useState('');
  const [busy, setBusy] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setError(''); setInfo('');
    if (!email.includes('@')) return setError('Зөв имэйл хаяг оруулна уу.');
    if (password.length < 6) return setError('Нууц үг дор хаяж 6 тэмдэгт байна.');
    if (mode === 'signup' && !name.trim()) return setError('Нэрээ оруулна уу.');
    setBusy(true);
    if (mode === 'signup') {
      const { data, error } = await supabase.auth.signUp({
        email, password, options: { data: { display_name: name.trim() } },
      });
      setBusy(false);
      if (error) return setError(errMn(error.message));
      if (!data.session) return setInfo('Бүртгэл үүслээ. Имэйлээ баталгаажуулаад нэвтэрнэ үү.');
      nav('/dashboard');
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      setBusy(false);
      if (error) return setError(errMn(error.message));
      nav('/dashboard');
    }
  }

  return (
    <main className="container section narrow">
      <h1 className="h2">{mode === 'signin' ? 'Нэвтрэх' : 'Бүртгүүлэх'}</h1>
      <form onSubmit={submit} className="form" noValidate>
        {mode === 'signup' && (
          <label>Нэр
            <input value={name} onChange={(e) => setName(e.target.value)} autoComplete="name" />
          </label>
        )}
        <label>Имэйл
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
        </label>
        <label>Нууц үг
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            autoComplete={mode === 'signin' ? 'current-password' : 'new-password'} />
        </label>
        {error && <p className="msg msg--error" role="alert">{error}</p>}
        {info && <p className="msg" role="status">{info}</p>}
        <button className="btn btn--solid" disabled={busy}>
          {busy ? 'Түр хүлээнэ үү…' : mode === 'signin' ? 'Нэвтрэх' : 'Бүртгүүлэх'}
        </button>
      </form>
      <p>
        {mode === 'signin' ? 'Шинэ хэрэглэгч үү? ' : 'Бүртгэлтэй юу? '}
        <button className="link" onClick={() => { setMode(mode === 'signin' ? 'signup' : 'signin'); setError(''); }}>
          {mode === 'signin' ? 'Бүртгүүлэх' : 'Нэвтрэх'}
        </button>
      </p>
    </main>
  );
}