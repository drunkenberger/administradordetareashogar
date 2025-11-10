import { Chore } from '../types';
import { timeToMinutes } from './time';

export function getConflictIds(chores: Chore[]): Set<string> {
  const ids = new Set<string>();
  const byDay: Record<number, Chore[]> = {};
  
  for (const c of chores) {
    (byDay[c.day] ||= []).push(c);
  }
  
  for (const key in byDay) {
    const arr = byDay[key]
      .slice()
      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      const aStart = timeToMinutes(a.start);
      const aEnd = aStart + a.duration;
      
      for (let j = i + 1; j < arr.length; j++) {
        const b = arr[j];
        const bStart = timeToMinutes(b.start);
        const bEnd = bStart + b.duration;
        
        if (bStart >= aEnd) break;
        
        if (aStart < bEnd && bStart < aEnd) {
          ids.add(a.id);
          ids.add(b.id);
        }
      }
    }
  }
  
  return ids;
}