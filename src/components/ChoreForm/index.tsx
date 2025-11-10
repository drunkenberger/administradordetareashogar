import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Chore, CATEGORIES, ASSIGNEES, FULL_DAYS } from '../../types';
import { CHORE_LIBRARY } from '../../data/choreTemplates';
import { clampToRange } from '../../utils/time';
import { labelCat, labelAssignee } from '../../utils/labels';

interface ChoreFormProps {
  initial: Omit<Chore, 'id'> | Chore;
  onSubmit: (values: Omit<Chore, 'id'>) => void;
  onDelete?: () => void;
  days?: readonly string[];
}

export function ChoreForm({ initial, onSubmit, onDelete, days = FULL_DAYS }: ChoreFormProps) {
  const [form, setForm] = useState<Omit<Chore, 'id'>>({ ...initial });
  const [isSubmitting, setIsSubmitting] = useState(false);

  function set<K extends keyof Omit<Chore, 'id'>>(
    key: K,
    value: Omit<Chore, 'id'>[K]
  ) {
    setForm(f => ({ ...f, [key]: value }));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    
    // Prevent empty tasks and double submissions
    if (isSubmitting || !form.title.trim()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Clean up the form data before submission
    const cleanedForm = {
      ...form,
      title: form.title.trim(),
      notes: form.notes?.trim() || "",
    };
    
    onSubmit(cleanedForm);
    
    // Reset submission state after a brief delay to prevent double submissions
    setTimeout(() => setIsSubmitting(false), 300);
  }

  return (
    <div className="relative z-10">
      <form
        className="space-y-4"
        onSubmit={handleSubmit}
      >
        <div className="grid grid-cols-1 gap-4">
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/30">
            <Label className="text-sm font-semibold text-blue-800 mb-2 block">
              📚 Usar plantilla del catálogo (opcional)
            </Label>
            <Select
              onValueChange={(idx) => {
                const t = CHORE_LIBRARY[Number(idx)];
                if (!t) return;
                setForm(f => ({
                  ...f,
                  title: t.title,
                  start: clampToRange(t.start ?? f.start),
                  duration: t.duration,
                  category: t.category,
                  assignee: t.assignee ?? f.assignee,
                }));
              }}
            >
              <SelectTrigger id="chore-form-catalog-040" className="bg-white/80 border-white/50 hover:bg-white transition-all duration-200">
                <SelectValue placeholder="🔍 Buscar en 173+ plantillas..." />
              </SelectTrigger>
              <SelectContent className="max-h-80 bg-white/95 backdrop-blur-md border-white/30">
                {CHORE_LIBRARY.map((t, i) => (
                  <SelectItem key={i} value={String(i)} className="hover:bg-blue-50">
                    <div className="flex items-center gap-2">
                      <span className="font-medium">{t.title}</span>
                      <span className="text-xs text-gray-500">• {labelCat(t.category)}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div>
            <Label className="text-sm font-semibold text-gray-700 mb-2 block">
              ✏️ Título de la tarea
            </Label>
            <Input
              id="chore-form-title-021"
              value={form.title}
              onChange={(e) => set("title", e.target.value)}
              required
              placeholder="ej., Poner la mesa para la comida"
              className="bg-white/80 border-white/50 hover:bg-white focus:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                📅 Día de la semana
              </Label>
              <Select
                value={String(form.day)}
                onValueChange={(v) => set("day", Number(v))}
              >
                <SelectTrigger id="chore-form-day-022" className="bg-white/80 border-white/50 hover:bg-white transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                  {Array.from(days).map((d, i) => (
                    <SelectItem key={d} value={String(i)} className="hover:bg-blue-50">
                      <span className="font-medium">{d}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                ⏰ Hora de inicio
              </Label>
              <Input
                id="chore-form-start-023"
                type="time"
                value={form.start}
                onChange={(e) => set("start", clampToRange(e.target.value))}
                className="bg-white/80 border-white/50 hover:bg-white focus:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                ⏱️ Duración (minutos)
              </Label>
              <Input
                id="chore-form-duration-024"
                type="number"
                min={5}
                step={5}
                value={form.duration}
                onChange={(e) => set("duration", Number(e.target.value))}
                className="bg-white/80 border-white/50 hover:bg-white focus:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                👤 Responsable
              </Label>
              <Select
                value={form.assignee}
                onValueChange={(v) => set("assignee", v as any)}
              >
                <SelectTrigger id="chore-form-assignee-026" className="bg-white/80 border-white/50 hover:bg-white transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                  {ASSIGNEES.map((a) => (
                    <SelectItem key={a} value={a} className="hover:bg-blue-50">
                      <span className="font-medium">{labelAssignee(a)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                🏷️ Categoría
              </Label>
              <Select
                value={form.category}
                onValueChange={(v) => set("category", v as any)}
              >
                <SelectTrigger id="chore-form-category-025" className="bg-white/80 border-white/50 hover:bg-white transition-all duration-200">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                  {CATEGORIES.map((c) => (
                    <SelectItem key={c} value={c} className="hover:bg-blue-50">
                      <span className="font-medium">{labelCat(c)}</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label className="text-sm font-semibold text-gray-700 mb-2 block">
                📝 Notas (opcional)
              </Label>
              <Input
                id="chore-form-notes-027"
                value={form.notes ?? ""}
                onChange={(e) => set("notes", e.target.value)}
                placeholder="Agregar detalles adicionales..."
                className="bg-white/80 border-white/50 hover:bg-white focus:bg-white transition-all duration-200 focus:ring-2 focus:ring-blue-500/20"
              />
            </div>
          </div>
        </div>
        
        <DialogFooter className="justify-between pt-6 border-t border-gray-200/50">
          {onDelete && (
            <Button 
              id="chore-form-delete-028"
              type="button" 
              variant="destructive" 
              onClick={onDelete}
              className="bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0 hover:from-rose-600 hover:to-rose-700 shadow-soft transition-all duration-300 hover:scale-105"
            >
              🗑️ Eliminar
            </Button>
          )}
          <div className="ml-auto flex gap-3">
            <Button 
              id="chore-form-save-029" 
              type="submit"
              disabled={isSubmitting || !form.title.trim()}
              className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-soft transition-all duration-300 hover:scale-105 px-6 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isSubmitting ? "⏳ Guardando..." : "✨ Guardar tarea"}
            </Button>
          </div>
        </DialogFooter>
      </form>
    </div>
  );
}