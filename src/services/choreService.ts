import { Chore } from '../types';
import { uid } from '../utils/uid';

export class ChoreService {
  static addChore(chores: Chore[], newChore: Omit<Chore, 'id'>): Chore[] {
    return [...chores, { ...newChore, id: uid() }];
  }

  static updateChore(chores: Chore[], id: string, patch: Partial<Chore>): Chore[] {
    return chores.map(c => c.id === id ? { ...c, ...patch } : c);
  }

  static deleteChore(chores: Chore[], id: string): Chore[] {
    return chores.filter(c => c.id !== id);
  }

  static filterChores(
    chores: Chore[], 
    category: string | null, 
    assignee: string | null
  ): Chore[] {
    return chores.filter(c => 
      (category === "all" || category === null || c.category === category) &&
      (assignee === "all" || assignee === null || c.assignee === assignee)
    );
  }

  static exportToJSON(chores: Chore[]): void {
    const blob = new Blob([JSON.stringify(chores, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tareas.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  static async importFromJSON(file: File): Promise<Chore[]> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        try {
          const parsed = JSON.parse(String(reader.result));
          if (Array.isArray(parsed)) {
            resolve(parsed);
          } else {
            reject(new Error("Invalid JSON structure"));
          }
        } catch {
          reject(new Error("Invalid JSON file"));
        }
      };
      reader.onerror = reject;
      reader.readAsText(file);
    });
  }
}