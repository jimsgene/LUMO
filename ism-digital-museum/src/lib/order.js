// Department order: rows with sort_order first (1, 2, ...), then the rest by name.
// Done in the browser so pages work even before the sort_order column exists.
export const byDeptOrder = (a, b) =>
  (a.sort_order ?? Infinity) - (b.sort_order ?? Infinity) || String(a.name).localeCompare(String(b.name), 'mn');
