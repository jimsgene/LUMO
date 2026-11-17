import { supabase } from './supabase';

// Likes and view counts live in db/engagement.sql. Until that file is run in Supabase,
// every function here quietly returns "unavailable" so the rest of the app keeps working.
const missing = (error) => error && ['PGRST202', 'PGRST205', '42P01', '42883'].includes(error.code);
let installed = true; // flips to false after the first "not found", so later pages skip the request

// { [exhibitId]: { views, likes } } or null when the feature is not installed
export async function getPopularity() {
  if (!installed) return null;
  const { data, error } = await supabase.rpc('exhibit_popularity');
  if (error) {
    if (missing(error)) installed = false; else console.warn('[engagement]', error.message);
    return null;
  }
  return Object.fromEntries(data.map((r) => [r.exhibit_id, { views: Number(r.views), likes: Number(r.likes) }]));
}

// Counts one view per exhibit per browser tab session.
export function recordView(exhibitId) {
  if (!installed) return;
  const k = `viewed:${exhibitId}`;
  try { if (sessionStorage.getItem(k)) return; sessionStorage.setItem(k, '1'); } catch { /* storage blocked */ }
  supabase.rpc('record_exhibit_view', { p_exhibit: exhibitId }).then(({ error }) => {
    if (error && !missing(error)) console.warn('[engagement]', error.message);
  });
}

// true / false, or null when likes are not installed
export async function hasLiked(exhibitId, userId) {
  if (!installed) return null;
  const { data, error } = await supabase.from('exhibit_likes').select('exhibit_id')
    .eq('exhibit_id', exhibitId).eq('user_id', userId).maybeSingle();
  if (error) return null;
  return Boolean(data);
}

export async function setLiked(exhibitId, userId, liked) {
  const q = liked
    ? supabase.from('exhibit_likes').insert({ exhibit_id: exhibitId, user_id: userId })
    : supabase.from('exhibit_likes').delete().eq('exhibit_id', exhibitId).eq('user_id', userId);
  const { error } = await q;
  if (error && error.code !== '23505') throw error; // 23505 = already liked (double click)
}
