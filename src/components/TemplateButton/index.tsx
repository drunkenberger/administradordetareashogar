import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Chore } from '../../types';
import { uid } from '../../utils/uid';

interface TemplateButtonProps {
  onInsert: (items: Chore[]) => void;
  days: readonly string[];
}

export function TemplateButton({ onInsert, days }: TemplateButtonProps) {
  const [isApplying, setIsApplying] = useState(false);

  function addDailyBasics() {
    if (isApplying) return; // Prevent double-click
    
    setIsApplying(true);
    
    const items: Chore[] = [
      {
        id: uid(),
        title: "Tender camas",
        day: 0,
        start: "07:30",
        duration: 20,
        category: "daily",
        assignee: "ayudante",
      },
      {
        id: uid(),
        title: "Lavar trastes",
        day: 0,
        start: "13:30",
        duration: 30,
        category: "daily",
        assignee: "ayudante",
      },
      {
        id: uid(),
        title: "Limpiar barras/mesas de cocina",
        day: 0,
        start: "13:00",
        duration: 15,
        category: "daily",
        assignee: "ayudante",
      },
      {
        id: uid(),
        title: "Poner la mesa para la comida",
        day: 0,
        start: "14:00",
        duration: 15,
        category: "daily",
        assignee: "ayudante",
        notes: "Apuntar a las 2 pm",
      },
      {
        id: uid(),
        title: "Barrer áreas de alto tránsito",
        day: 0,
        start: "17:00",
        duration: 20,
        category: "daily",
        assignee: "ayudante",
      },
    ];
    
    const spread = Array.from(days)
      .map((_, i) => items.map((c) => ({ ...c, id: uid(), day: i })))
      .flat();
    
    onInsert(spread);
    
    // Reset state after a brief delay to prevent rapid clicking
    setTimeout(() => setIsApplying(false), 500);
  }

  return (
    <Button 
      id="template-insert-019"
      variant="outline" 
      onClick={addDailyBasics}
      disabled={isApplying}
      className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 hover:from-purple-600 hover:to-indigo-700 shadow-soft transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
    >
      {isApplying ? "⏳ Aplicando..." : "📋 Plantilla diaria"}
    </Button>
  );
}