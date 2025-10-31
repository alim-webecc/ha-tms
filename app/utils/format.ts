// app/utils/format.ts
export function pad8(n: number | string) {
  return n.toString().padStart(8, "0");
}

export function formatEUR(value: number | null | undefined) {
  if (value == null) return "";
  try {
    return new Intl.NumberFormat("de-DE", {
      style: "currency",
      currency: "EUR",
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return String(value);
  }
}

/** akzeptiert "YYYY-MM-DD" oder ISO; gibt "TT.MM.JJJJ" zurück */
export function formatDate(d?: string | null) {
  if (!d) return "";
  // Falls ISO mit Zeit kommt, nur das Datum nehmen
  const only = d.length > 10 ? d.slice(0, 10) : d;
  const [yyyy, mm, dd] = only.split("-");
  if (!yyyy || !mm || !dd) return d;
  return `${dd}.${mm}.${yyyy}`;
}
