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