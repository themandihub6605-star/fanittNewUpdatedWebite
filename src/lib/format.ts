// File: src/lib/format.ts  (fanitt-website)

/** Paise → "₹1,499" */
export function rupees(paise: number | null | undefined) {
  const v = Math.round((paise || 0) / 100);
  return `₹${v.toLocaleString('en-IN')}`;
}

export function when(iso?: string | null) {
  if (!iso) return '';
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return '';
  return d.toLocaleString('en-IN', { weekday: 'short', day: 'numeric', month: 'short', hour: 'numeric', minute: '2-digit' });
}