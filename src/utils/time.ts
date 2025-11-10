import { HOUR_START, HOUR_END } from '../constants';

export function timeToMinutes(t: string): number {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTime(mins: number): string {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function clampToRange(t: string): string {
  const mins = Math.max(
    HOUR_START * 60,
    Math.min((HOUR_END - 1) * 60, timeToMinutes(t))
  );
  return minutesToTime(mins);
}