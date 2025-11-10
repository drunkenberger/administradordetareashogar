import { Chore, ChoreTemplate, Assignee } from '../types';
import { CHORE_LIBRARY } from '../data/choreTemplates';
import { uid } from '../utils/uid';

/**
 * Generador inteligente de planes semanales automáticos
 * Combina tareas diarias recurrentes con tareas variables seleccionadas aleatoriamente
 */

// Horarios predefinidos para distribuir tareas durante el día
const TIME_SLOTS = {
  morning: ["07:00", "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30"],
  midday: ["11:00", "11:30", "12:00", "12:30", "13:00", "13:30", "14:00"],
  afternoon: ["15:00", "15:30", "16:00", "16:30", "17:00", "17:30", "18:00"],
  evening: ["18:30", "19:00", "19:30", "20:00", "20:30"],
};

const ALL_TIME_SLOTS = [
  ...TIME_SLOTS.morning,
  ...TIME_SLOTS.midday,
  ...TIME_SLOTS.afternoon,
  ...TIME_SLOTS.evening,
];

// Tareas diarias que se repiten todos los días
const DAILY_TASKS: Omit<Chore, 'id' | 'day'>[] = [
  { title: "Tender camas", start: "07:30", duration: 20, category: "daily", assignee: "ayudante" },
  { title: "Barrer áreas de alto tránsito", start: "09:30", duration: 30, category: "daily", assignee: "ayudante" },
  { title: "Limpiar cocina después del desayuno", start: "08:30", duration: 25, category: "daily", assignee: "compartido" },
  { title: "Poner la mesa para la comida", start: "13:30", duration: 15, category: "daily", assignee: "ayudante" },
  { title: "Lavar platos después de comida", start: "15:00", duration: 30, category: "daily", assignee: "compartido" },
  { title: "Preparar cena", start: "18:30", duration: 45, category: "daily", assignee: "esposa" },
  { title: "Limpiar cocina después de cena", start: "20:00", duration: 25, category: "daily", assignee: "esposo" },
  { title: "Organizar sala antes de dormir", start: "21:00", duration: 15, category: "daily", assignee: "compartido" },
];

// Función auxiliar para seleccionar elementos aleatorios de un array
function shuffleArray<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Función auxiliar para seleccionar N elementos aleatorios
function pickRandom<T>(array: T[], count: number): T[] {
  return shuffleArray(array).slice(0, count);
}

// Asignar responsable aleatorio si no está definido
function randomAssignee(): Assignee {
  const assignees: Assignee[] = ["ayudante", "esposa", "esposo", "compartido"];
  return assignees[Math.floor(Math.random() * assignees.length)];
}

// Asignar horario aleatorio si no está definido
function randomTimeSlot(): string {
  return ALL_TIME_SLOTS[Math.floor(Math.random() * ALL_TIME_SLOTS.length)];
}

// Convertir ChoreTemplate a Chore con valores por defecto
function templateToChore(template: ChoreTemplate, day: number): Chore {
  return {
    id: uid(),
    title: template.title,
    day,
    start: template.start || randomTimeSlot(),
    duration: template.duration,
    category: template.category,
    assignee: template.assignee || randomAssignee(),
    notes: template.notes,
  };
}

/**
 * Genera un plan semanal automático inteligente
 *
 * @param daysCount - Número de días de la semana (5 o 7)
 * @returns Array de tareas para la semana completa
 */
export function generateWeekPlan(daysCount: number): Chore[] {
  const chores: Chore[] = [];

  // Separar tareas por categoría
  const weeklyTasks = CHORE_LIBRARY.filter(t => t.category === "weekly");
  const monthlyTasks = CHORE_LIBRARY.filter(t => t.category === "monthly");
  const eventualTasks = CHORE_LIBRARY.filter(t => t.category === "eventual");
  const urgentTasks = CHORE_LIBRARY.filter(t => t.category === "urgent");

  // 1. Agregar tareas diarias a todos los días
  for (let day = 0; day < daysCount; day++) {
    DAILY_TASKS.forEach(task => {
      chores.push({
        ...task,
        id: uid(),
        day,
      });
    });
  }

  // 2. Distribuir tareas semanales (1-2 por día)
  const weeklySelected = pickRandom(weeklyTasks, Math.min(daysCount * 2, weeklyTasks.length));
  weeklySelected.forEach((template, index) => {
    const day = index % daysCount;
    chores.push(templateToChore(template, day));
  });

  // 3. Agregar algunas tareas mensuales (2-4 en la semana)
  const monthlySelected = pickRandom(monthlyTasks, Math.min(4, monthlyTasks.length));
  monthlySelected.forEach((template) => {
    const day = Math.floor(Math.random() * daysCount);
    chores.push(templateToChore(template, day));
  });

  // 4. Agregar tareas eventuales ocasionales (0-2 en la semana)
  if (eventualTasks.length > 0 && Math.random() > 0.3) {
    const eventualSelected = pickRandom(eventualTasks, Math.min(2, eventualTasks.length));
    eventualSelected.forEach(template => {
      const day = Math.floor(Math.random() * daysCount);
      chores.push(templateToChore(template, day));
    });
  }

  // 5. Agregar tareas urgentes si existen
  urgentTasks.forEach(template => {
    const day = Math.floor(Math.random() * Math.min(3, daysCount)); // Primeros días
    chores.push(templateToChore(template, day));
  });

  return chores;
}

/**
 * Estadísticas del plan generado
 */
export function getPlanStats(chores: Chore[]) {
  return {
    total: chores.length,
    daily: chores.filter(c => c.category === "daily").length,
    weekly: chores.filter(c => c.category === "weekly").length,
    monthly: chores.filter(c => c.category === "monthly").length,
    eventual: chores.filter(c => c.category === "eventual").length,
    urgent: chores.filter(c => c.category === "urgent").length,
  };
}
