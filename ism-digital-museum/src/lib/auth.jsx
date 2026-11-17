import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { AuthCtx } from './useAuth';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loaded, setLoaded] = useState(null); // { userId, profile }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null);
    });
    return () => sub.subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!user) return;
    let alive = true;
    supabase.from('profiles').select('*').eq('id', user.id).single()
      .then(({ data }) => alive && setLoaded({ userId: user.id, profile: data }));
    return () => { alive = false; };
  }, [user]);

  // Profile belongs to the current user only; a stale one from a previous session is ignored.
  const profile = user && loaded?.userId === user.id ? loaded.profile : null;
  const profileLoading = Boolean(user) && loaded?.userId !== user.id;

  return (
    <AuthCtx.Provider value={{ user, profile, isAdmin: profile?.role === 'admin', loading: loading || profileLoading }}>
      {children}
    </AuthCtx.Provider>
  );
}
