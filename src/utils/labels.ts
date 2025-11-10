import { Category, Assignee } from '../types';

export function labelCat(c: Category): string {
  const labels: Record<Category, string> = {
    daily: "Diaria",
    weekly: "Semanal",
    monthly: "Mensual",
    urgent: "Urgente",
    eventual: "Eventual"
  };
  return labels[c];
}

export function labelAssignee(a: Assignee): string {
  const labels: Record<Assignee, string> = {
    ayudante: "Ayudante",
    esposa: "Esposa",
    esposo: "Esposo",
    compartido: "Compartido"
  };
  return labels[a];
}