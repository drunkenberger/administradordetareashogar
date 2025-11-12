import { Chore } from '../types';
import { uid } from '../utils/uid';
import { labelCat, labelAssignee } from '../utils/labels';
import { FULL_DAYS } from '../types';
import html2canvas from 'html2canvas';

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
    const date = new Date().toISOString().split('T')[0];
    a.download = `tareas-${date}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static exportToCSV(chores: Chore[]): void {
    // Sort chores by day and start time
    const sorted = [...chores].sort((a, b) => {
      if (a.day !== b.day) return a.day - b.day;
      return a.start.localeCompare(b.start);
    });

    // CSV Headers
    const headers = ['Día', 'Hora Inicio', 'Duración (min)', 'Tarea', 'Categoría', 'Responsable', 'Notas'];

    // CSV Rows
    const rows = sorted.map(chore => {
      const day = FULL_DAYS[chore.day] || `Día ${chore.day}`;
      const notes = (chore.notes || '').replace(/"/g, '""'); // Escape quotes

      return [
        day,
        chore.start,
        chore.duration.toString(),
        `"${chore.title.replace(/"/g, '""')}"`,
        labelCat(chore.category),
        labelAssignee(chore.assignee),
        notes ? `"${notes}"` : ''
      ].join(',');
    });

    // Combine headers and rows
    const csv = [headers.join(','), ...rows].join('\n');

    // Create and download file
    const blob = new Blob(['\ufeff' + csv], { type: 'text/csv;charset=utf-8;' }); // UTF-8 BOM
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    const date = new Date().toISOString().split('T')[0];
    a.download = `tareas-${date}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  }

  static async exportToImage(chores: Chore[], daysCount: number): Promise<void> {
    // Create calendar element
    const container = document.createElement('div');
    container.style.position = 'absolute';
    container.style.left = '-9999px';
    container.style.width = '1920px';
    container.style.background = 'linear-gradient(to bottom right, #f8fafc, #eff6ff, #e0e7ff)';
    container.style.padding = '48px';
    container.style.fontFamily = 'system-ui, -apple-system, sans-serif';
    document.body.appendChild(container);

    try {
      // Get category colors
      const categoryColors: Record<string, { bg: string; border: string; text: string }> = {
        daily: { bg: '#dbeafe', border: '#3b82f6', text: '#1e40af' },
        weekly: { bg: '#e9d5ff', border: '#a855f7', text: '#6b21a8' },
        monthly: { bg: '#fce7f3', border: '#ec4899', text: '#9f1239' },
        urgent: { bg: '#fee2e2', border: '#ef4444', text: '#991b1b' },
        eventual: { bg: '#d1fae5', border: '#10b981', text: '#065f46' }
      };

      // Sort chores by day and time
      const sorted = [...chores].sort((a, b) => {
        if (a.day !== b.day) return a.day - b.day;
        return a.start.localeCompare(b.start);
      });

      // Group by day
      const choresByDay: Record<number, Chore[]> = {};
      sorted.forEach(chore => {
        if (!choresByDay[chore.day]) choresByDay[chore.day] = [];
        choresByDay[chore.day].push(chore);
      });

      // Build HTML
      const days = FULL_DAYS.slice(0, daysCount);

      container.innerHTML = `
        <div style="background: white; border-radius: 24px; padding: 40px; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);">
          <!-- Header -->
          <div style="text-align: center; margin-bottom: 40px; padding-bottom: 32px; border-bottom: 3px solid #e5e7eb;">
            <div style="display: inline-block; width: 80px; height: 80px; background: linear-gradient(135deg, #3b82f6, #8b5cf6, #ec4899); border-radius: 20px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center;">
              <span style="font-size: 48px;">✨</span>
            </div>
            <h1 style="margin: 0; font-size: 42px; font-weight: 800; background: linear-gradient(135deg, #1e40af, #6b21a8); -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;">
              Planificador Semanal
            </h1>
            <p style="margin: 8px 0 0 0; font-size: 18px; color: #6b7280;">
              Semana del ${new Date().toLocaleDateString('es-ES', { day: 'numeric', month: 'long', year: 'numeric' })}
            </p>
          </div>

          <!-- Calendar Grid -->
          <div style="display: grid; grid-template-columns: repeat(${daysCount}, 1fr); gap: 20px; margin-bottom: 40px;">
            ${days.map((day, idx) => {
              const dayChores = choresByDay[idx] || [];
              return `
                <div style="background: linear-gradient(to bottom, #f9fafb, #ffffff); border-radius: 16px; padding: 20px; border: 2px solid #e5e7eb;">
                  <h3 style="margin: 0 0 20px 0; font-size: 20px; font-weight: 700; color: #1f2937; text-align: center; padding-bottom: 12px; border-bottom: 2px solid #e5e7eb;">
                    ${day}
                  </h3>
                  <div style="display: flex; flex-direction: column; gap: 12px;">
                    ${dayChores.length === 0
                      ? `<div style="text-align: center; padding: 24px 8px; color: #9ca3af; font-size: 14px;">Sin tareas</div>`
                      : dayChores.map(chore => {
                        const colors = categoryColors[chore.category] || categoryColors.daily;
                        return `
                          <div style="background: ${colors.bg}; border-left: 4px solid ${colors.border}; border-radius: 10px; padding: 12px; box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);">
                            <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 6px;">
                              <span style="font-size: 12px; font-weight: 700; color: ${colors.text}; background: white; padding: 3px 8px; border-radius: 6px;">
                                ${chore.start}
                              </span>
                              <span style="font-size: 11px; color: ${colors.text}; opacity: 0.8;">
                                ${chore.duration}min
                              </span>
                            </div>
                            <div style="font-size: 14px; font-weight: 600; color: ${colors.text}; margin-bottom: 4px; line-height: 1.3;">
                              ${chore.title}
                            </div>
                            <div style="font-size: 11px; color: ${colors.text}; opacity: 0.9;">
                              ${labelAssignee(chore.assignee)}
                            </div>
                          </div>
                        `;
                      }).join('')
                    }
                  </div>
                </div>
              `;
            }).join('')}
          </div>

          <!-- Legend -->
          <div style="background: linear-gradient(to right, #f9fafb, #ffffff); border-radius: 16px; padding: 24px; border: 2px solid #e5e7eb;">
            <h4 style="margin: 0 0 16px 0; font-size: 16px; font-weight: 700; color: #1f2937; text-align: center;">
              Leyenda de Categorías
            </h4>
            <div style="display: flex; justify-content: center; gap: 24px; flex-wrap: wrap;">
              ${Object.entries(categoryColors).map(([cat, colors]) => `
                <div style="display: flex; align-items: center; gap: 8px;">
                  <div style="width: 20px; height: 20px; background: ${colors.bg}; border: 2px solid ${colors.border}; border-radius: 6px;"></div>
                  <span style="font-size: 14px; font-weight: 600; color: #374151;">
                    ${labelCat(cat as any)}
                  </span>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Footer -->
          <div style="text-align: center; margin-top: 32px; padding-top: 24px; border-top: 2px solid #e5e7eb;">
            <p style="margin: 0; font-size: 14px; color: #9ca3af;">
              Generado con Planificador Inteligente • ${new Date().toLocaleDateString('es-ES')}
            </p>
          </div>
        </div>
      `;

      // Capture with html2canvas
      const canvas = await html2canvas(container, {
        scale: 2,
        backgroundColor: '#f8fafc',
        logging: false,
        width: 1920,
        windowWidth: 1920,
      });

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          const date = new Date().toISOString().split('T')[0];
          a.download = `calendario-${date}.jpg`;
          a.click();
          URL.revokeObjectURL(url);
        }
      }, 'image/jpeg', 0.95);

    } finally {
      // Clean up
      document.body.removeChild(container);
    }
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