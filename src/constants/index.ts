import { Category } from '../types';

export const HOUR_START = 7;
export const HOUR_END = 21;
export const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);
export const SLOT_HEIGHT = 56;
export const DRAG_STEP_MIN = 5;
export const MIN_DURATION_MIN = 5;
export const RESIZE_HANDLE_H = 8;
export const STORAGE_KEY = "chore-planner-es-v1";

export const CATEGORY_COLORS: Record<Category, string> = {
  daily: "bg-gradient-to-br from-emerald-400 to-emerald-600 border-emerald-300 shadow-emerald-500/25",
  weekly: "bg-gradient-to-br from-sky-400 to-sky-600 border-sky-300 shadow-sky-500/25",
  monthly: "bg-gradient-to-br from-violet-400 to-violet-600 border-violet-300 shadow-violet-500/25",
  eventual: "bg-gradient-to-br from-amber-400 to-amber-600 border-amber-300 shadow-amber-500/25",
  urgent: "bg-gradient-to-br from-rose-400 to-rose-600 border-rose-300 shadow-rose-500/25",
};

export const CATEGORY_COLORS_LIGHT: Record<Category, string> = {
  daily: "bg-gradient-to-br from-emerald-50 to-emerald-100 border-emerald-200 text-emerald-800",
  weekly: "bg-gradient-to-br from-sky-50 to-sky-100 border-sky-200 text-sky-800",
  monthly: "bg-gradient-to-br from-violet-50 to-violet-100 border-violet-200 text-violet-800",
  eventual: "bg-gradient-to-br from-amber-50 to-amber-100 border-amber-200 text-amber-800",
  urgent: "bg-gradient-to-br from-rose-50 to-rose-100 border-rose-200 text-rose-800",
};