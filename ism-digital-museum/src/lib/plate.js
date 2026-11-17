// Display-only plate number, e.g. ISM-2024-0007. No schema change.
export function plateNumber(exhibit) {
  const year = exhibit.year_created || new Date(exhibit.created_at || Date.now()).getFullYear();
  const tail = String(exhibit.id).replace(/[^a-z0-9]/gi, '').slice(0, 4).toUpperCase();
  return `ISM-${year}-${tail}`;
}

// technology_stack may be text[] or a comma-separated string.
export function techList(stack) {
  if (!stack) return [];
  if (Array.isArray(stack)) return stack;
  return String(stack).split(',').map((s) => s.trim()).filter(Boolean);
}
// Who made an exhibit: named students/team ("authors") first, else the account that submitted it.
export const creatorName = (ex) => ex.authors || ex.profiles?.display_name || '';
// Groups works by the same author(s); several teams can share one submitting account.
export const creatorKey = (ex) => (ex.authors ? `a:${ex.authors}` : `u:${ex.creator_id}`);
