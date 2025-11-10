import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chore, ASSIGNEES } from '../../types';
import { CHORE_LIBRARY } from '../../data/choreTemplates';
import { clampToRange } from '../../utils/time';
import { labelCat, labelAssignee } from '../../utils/labels';

interface QuickAddProps {
  onAdd: (c: Omit<Chore, 'id'>) => void;
  defaultDay?: number;
  days: readonly string[];
}

export function QuickAddFromTemplate({ onAdd, defaultDay = 0, days }: QuickAddProps) {
  const [templateKey, setTemplateKey] = useState<string>("");
  const [day, setDay] = useState<number>(defaultDay);
  const [time, setTime] = useState<string>("09:00");
  const [assignee, setAssignee] = useState<typeof ASSIGNEES[number]>("ayudante");

  useEffect(() => setDay(defaultDay), [defaultDay]);

  function add() {
    const t = CHORE_LIBRARY[Number(templateKey)];
    if (!t || !t.title.trim()) return;
    
    onAdd({
      title: t.title.trim(),
      day,
      start: clampToRange(t.start ?? time),
      duration: t.duration,
      category: t.category,
      assignee,
      notes: t.notes?.trim() ?? "",
    });
    
    // Reset the form after successful addition
    setTemplateKey("");
  }

  return (
    <div className="flex flex-wrap gap-3 items-center p-3 bg-white/50 backdrop-blur-sm rounded-2xl border border-white/30 shadow-soft">
      <div className="flex items-center gap-2">
        <div className="w-2 h-2 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full animate-pulse"></div>
        <span className="text-sm font-semibold text-gray-700">Agregar rápido:</span>
      </div>
      
      <Select value={templateKey} onValueChange={setTemplateKey}>
        <SelectTrigger id="quick-add-select-014" className="w-64 bg-white/80 border-white/50 hover:bg-white transition-all duration-200">
          <SelectValue placeholder="🔍 Buscar en catálogo..." />
        </SelectTrigger>
        <SelectContent className="max-h-80 bg-white/95 backdrop-blur-md border-white/30">
          {CHORE_LIBRARY.map((t, idx) => (
            <SelectItem key={idx} value={String(idx)} className="hover:bg-green-50">
              <div className="flex items-center gap-2">
                <span className="font-medium">{t.title}</span>
                <span className="text-xs text-gray-500">• {labelCat(t.category)}</span>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
        <SelectTrigger id="quick-add-day-015" className="w-32 bg-white/80 border-white/50 hover:bg-white transition-all duration-200">
          <SelectValue placeholder="Día" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
          {Array.from(days).map((d, i) => (
            <SelectItem key={d} value={String(i)} className="hover:bg-green-50">
              <span className="font-medium">{d}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Input
        id="quick-add-time-016"
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-32 bg-white/80 border-white/50 hover:bg-white focus:bg-white transition-all duration-200 focus:ring-2 focus:ring-green-500/20"
      />
      
      <Select value={assignee} onValueChange={(v) => setAssignee(v as any)}>
        <SelectTrigger id="quick-add-assignee-017" className="w-36 bg-white/80 border-white/50 hover:bg-white transition-all duration-200">
          <SelectValue placeholder="Responsable" />
        </SelectTrigger>
        <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
          {ASSIGNEES.map((a) => (
            <SelectItem key={a} value={a} className="hover:bg-green-50">
              <span className="font-medium">{labelAssignee(a)}</span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      
      <Button 
        id="quick-add-submit-018" 
        onClick={add} 
        disabled={templateKey === ""}
        className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-soft transition-all duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
      >
        ⚡ Agregar
      </Button>
    </div>
  );
}