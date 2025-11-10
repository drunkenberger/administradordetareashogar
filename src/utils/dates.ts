import { BASE_DAYS } from '../types';

export function getMonday(d: Date): Date {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function getWeekDates(monday: Date, len: number = BASE_DAYS.length): Date[] {
  return Array.from({ length: len }, (_, i) => new Date(monday.getTime() + i * 86400000));
}

export function fmtDate(d: Date): string {
  return d.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
}