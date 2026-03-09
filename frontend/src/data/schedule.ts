// ─────────────────────────────────────────────────────────────────────────────
// Business schedule — edit this file to change availability.
// Keys: 0 = Sunday … 6 = Saturday
// null = closed all day
// open/close: 24-hour integers (e.g. 8 = 8:00 AM, 20 = 8:00 PM)
// ─────────────────────────────────────────────────────────────────────────────
export const SCHEDULE: Record<number, { open: number; close: number } | null> = {
  0: null,                   // Sunday   — closed
  1: { open: 17, close: 20 }, // Monday   — 5:00 PM – 8:00 PM
  2: { open: 17, close: 20 }, // Tuesday  — 5:00 PM – 8:00 PM
  3: { open: 17, close: 20 }, // Wednesday — 5:00 PM – 8:00 PM
  4: { open: 17, close: 20 }, // Thursday — 5:00 PM – 8:00 PM
  5: { open: 17, close: 20 }, // Friday   — 5:00 PM – 8:00 PM
  6: { open: 8,  close: 20 }, // Saturday — 8:00 AM – 8:00 PM
};

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

function fmt(h: number) {
  const period = h < 12 ? 'AM' : 'PM';
  const hour = h % 12 || 12;
  return `${hour}:00 ${period}`;
}

/** Returns null if open, or a human-readable closed message. */
export function getClosedMessage(dateStr: string): string | null {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const day = d.getUTCDay();
  const hours = SCHEDULE[day];
  if (hours === null) return `We are closed on ${DAY_NAMES[day]}s. Please select another day.`;
  return null;
}

/** Returns the hours label for a date string, e.g. "8:00 AM – 8:00 PM". */
export function getHoursLabel(dateStr: string): string | null {
  const d = new Date(`${dateStr}T00:00:00Z`);
  const hours = SCHEDULE[d.getUTCDay()];
  if (!hours) return null;
  return `${fmt(hours.open)} – ${fmt(hours.close)}`;
}
