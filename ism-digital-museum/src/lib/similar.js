import { techList } from './plate';

const norm = (t) => t.toLowerCase().trim();

// Scores how related two exhibits are: shared technologies (Jaccard), same category, close years.
export function similarity(a, b) {
  const ta = new Set(techList(a.technology_stack).map(norm));
  const tb = new Set(techList(b.technology_stack).map(norm));
  const inter = [...ta].filter((t) => tb.has(t)).length;
  const union = new Set([...ta, ...tb]).size || 1;
  let score = inter / union;
  if (a.category && a.category === b.category) score += 0.25;
  if (a.year_created && b.year_created && Math.abs(a.year_created - b.year_created) <= 1) score += 0.05;
  return { score, shared: [...ta].filter((t) => tb.has(t)) };
}

export function mostSimilar(target, pool, n = 3) {
  return pool
    .filter((x) => x.id !== target.id)
    .map((x) => ({ exhibit: x, ...similarity(target, x) }))
    .filter((r) => r.score > 0.1)
    .sort((p, q) => q.score - p.score)
    .slice(0, n);
}

// Case-insensitive "all words appear" match, works for Cyrillic and Latin.
export function matches(haystack, query) {
  const h = haystack.toLowerCase();
  return query.toLowerCase().split(/\s+/).filter(Boolean).every((w) => h.includes(w));
}
