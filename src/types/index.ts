export const CATEGORIES = ["daily", "weekly", "monthly", "eventual", "urgent"] as const;
export const ASSIGNEES = ["ayudante", "esposa", "esposo", "compartido"] as const;
export const BASE_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"] as const;
export const FULL_DAYS = [...BASE_DAYS, "Sáb", "Dom"] as const;

export type Category = typeof CATEGORIES[number];
export type Assignee = typeof ASSIGNEES[number];
export type DayName = typeof FULL_DAYS[number];

export interface Chore {
  id: string;
  title: string;
  day: number;
  start: string;
  duration: number;
  category: Category;
  assignee: Assignee;
  notes?: string;
}

export interface ChoreTemplate {
  title: string;
  category: Category;
  duration: number;
  start?: string;
  assignee?: Assignee;
  notes?: string;
}