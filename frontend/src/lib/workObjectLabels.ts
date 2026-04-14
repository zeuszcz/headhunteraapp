import type { WorkObject } from "../types/workObject";

const STATUS_LABELS: Record<string, string> = {
  draft: "Черновик",
  open: "Открыт",
  in_progress: "В работе",
  closed: "Закрыт",
  cancelled: "Отменён",
};

export function workObjectStatusLabel(status: string): string {
  return STATUS_LABELS[status] ?? status;
}

/** Дата для карточек (коротко, ru). */
export function formatDateRuShort(iso: string | null | undefined): string | null {
  if (!iso) return null;
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return null;
  return d.toLocaleDateString("ru-RU", { day: "numeric", month: "short", year: "numeric" });
}

export function workObjectPaymentSummary(o: WorkObject): string {
  const bits = [o.payment_format?.trim(), o.payment_amount_note?.trim()].filter(Boolean);
  return bits.length ? bits.join(" · ") : "";
}

export function workObjectNeedsSummary(o: WorkObject): string | null {
  const parts: string[] = [];
  if (o.workers_needed > 0) {
    parts.push(`${o.workers_needed} чел.`);
  }
  if (o.brigades_needed > 0) {
    const b = o.brigades_needed;
    parts.push(`${b} ${pluralBrigades(b)}`);
  }
  return parts.length ? parts.join(", ") : null;
}

function pluralBrigades(n: number): string {
  const m = n % 100;
  const m10 = n % 10;
  if (m >= 11 && m <= 14) return "бригад";
  if (m10 === 1) return "бригада";
  if (m10 >= 2 && m10 <= 4) return "бригады";
  return "бригад";
}
