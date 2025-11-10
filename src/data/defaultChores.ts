import { Chore } from '../types';
import { uid } from '../utils/uid';

export const DEFAULTS: Omit<Chore, 'id'>[] = [
  { 
    title: "Tender camas", 
    day: 0, 
    start: "07:30", 
    duration: 20, 
    category: "daily", 
    assignee: "ayudante" 
  },
  { 
    title: "Barrer áreas de alto tránsito", 
    day: 0, 
    start: "09:30", 
    duration: 30, 
    category: "daily", 
    assignee: "ayudante" 
  },
  { 
    title: "Poner la mesa para la comida", 
    day: 0, 
    start: "14:00", 
    duration: 15, 
    category: "daily", 
    assignee: "ayudante", 
    notes: "Apuntar a las 2 pm" 
  },
];

export function seedWeek(seed: Omit<Chore, 'id'>[], daysLen: number): Chore[] {
  const out: Chore[] = [];
  for (let day = 0; day < daysLen; day++) {
    for (const c of seed) {
      out.push({ ...c, id: uid(), day });
    }
  }
  return out;
}