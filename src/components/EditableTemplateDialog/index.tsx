import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Edit3 } from "lucide-react";
import { Chore, CATEGORIES, ASSIGNEES } from '../../types';
import { uid } from '../../utils/uid';
import { clampToRange } from '../../utils/time';
import { labelCat, labelAssignee } from '../../utils/labels';

interface EditableTemplateDialogProps {
  onInsert: (items: Chore[]) => void;
  days: readonly string[];
}

interface TemplateTask {
  id: string;
  title: string;
  start: string;
  duration: number;
  category: typeof CATEGORIES[number];
  assignee: typeof ASSIGNEES[number];
  notes: string;
}

const DEFAULT_TEMPLATE_TASKS: TemplateTask[] = [
  {
    id: uid(),
    title: "Tender camas",
    start: "07:30",
    duration: 20,
    category: "daily",
    assignee: "ayudante",
    notes: "",
  },
  {
    id: uid(),
    title: "Lavar trastes",
    start: "13:30",
    duration: 30,
    category: "daily",
    assignee: "ayudante",
    notes: "",
  },
  {
    id: uid(),
    title: "Limpiar barras/mesas de cocina",
    start: "13:00",
    duration: 15,
    category: "daily",
    assignee: "ayudante",
    notes: "",
  },
  {
    id: uid(),
    title: "Poner la mesa para la comida",
    start: "14:00",
    duration: 15,
    category: "daily",
    assignee: "ayudante",
    notes: "Apuntar a las 2 pm",
  },
  {
    id: uid(),
    title: "Barrer áreas de alto tránsito",
    start: "17:00",
    duration: 20,
    category: "daily",
    assignee: "ayudante",
    notes: "",
  },
];

export function EditableTemplateDialog({ onInsert, days }: EditableTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [templateTasks, setTemplateTasks] = useState<TemplateTask[]>(DEFAULT_TEMPLATE_TASKS);

  function addNewTask() {
    const newTask: TemplateTask = {
      id: uid(),
      title: "",
      start: "09:00",
      duration: 30,
      category: "daily",
      assignee: "ayudante",
      notes: "",
    };
    setTemplateTasks(prev => [...prev, newTask]);
  }

  function updateTask(id: string, updates: Partial<TemplateTask>) {
    setTemplateTasks(prev => 
      prev.map(task => 
        task.id === id ? { ...task, ...updates } : task
      )
    );
  }

  function deleteTask(id: string) {
    setTemplateTasks(prev => prev.filter(task => task.id !== id));
  }

  function resetToDefaults() {
    if (confirm("¿Restaurar plantilla por defecto? Se perderán las modificaciones actuales.")) {
      setTemplateTasks(DEFAULT_TEMPLATE_TASKS.map(task => ({ ...task, id: uid() })));
    }
  }

  function applyTemplate() {
    // Filter out empty tasks
    const validTasks = templateTasks.filter(task => task.title.trim());
    
    if (validTasks.length === 0) {
      alert("No hay tareas válidas en la plantilla");
      return;
    }

    const choreItems: Chore[] = [];
    
    Array.from(days).forEach((_, dayIndex) => {
      validTasks.forEach(task => {
        choreItems.push({
          id: uid(),
          title: task.title.trim(),
          day: dayIndex,
          start: task.start,
          duration: task.duration,
          category: task.category,
          assignee: task.assignee,
          notes: task.notes.trim(),
        });
      });
    });

    onInsert(choreItems);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button 
          id="editable-template-trigger-043"
          variant="outline" 
          className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white border-0 hover:from-purple-600 hover:to-indigo-700 shadow-soft transition-all duration-300 hover:scale-105"
        >
          <Edit3 className="h-4 w-4 mr-2" />
          📋 Plantilla editable
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-4xl max-h-[80vh] overflow-y-auto bg-white/95 backdrop-blur-md border-white/30 shadow-strong">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-purple-900 to-indigo-700 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-indigo-600 rounded-full flex items-center justify-center">
              <Edit3 className="h-4 w-4 text-white" />
            </div>
            Editar Plantilla Diaria
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <p className="text-sm text-gray-600">
              Personaliza las tareas de tu plantilla diaria. Se aplicará a todos los días seleccionados.
            </p>
            <div className="flex gap-2">
              <Button
                id="template-add-task-044"
                onClick={addNewTask}
                size="sm"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                <Plus className="h-4 w-4 mr-1" />
                Agregar
              </Button>
              <Button
                id="template-reset-045"
                onClick={resetToDefaults}
                size="sm"
                variant="outline"
              >
                Restaurar
              </Button>
            </div>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {templateTasks.map((task, index) => (
              <div key={task.id} className="p-4 border rounded-lg bg-gray-50 space-y-3">
                <div className="flex justify-between items-start">
                  <span className="text-sm font-semibold text-gray-600">Tarea {index + 1}</span>
                  <Button
                    id={`template-delete-${task.id}`}
                    onClick={() => deleteTask(task.id)}
                    size="sm"
                    variant="destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Título</Label>
                    <Input
                      value={task.title}
                      onChange={(e) => updateTask(task.id, { title: e.target.value })}
                      placeholder="Nombre de la tarea"
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Hora</Label>
                    <Input
                      type="time"
                      value={task.start}
                      onChange={(e) => updateTask(task.id, { start: clampToRange(e.target.value) })}
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Duración (min)</Label>
                    <Input
                      type="number"
                      min={5}
                      step={5}
                      value={task.duration}
                      onChange={(e) => updateTask(task.id, { duration: Number(e.target.value) })}
                      className="bg-white"
                    />
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Responsable</Label>
                    <Select
                      value={task.assignee}
                      onValueChange={(value) => updateTask(task.id, { assignee: value as any })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {ASSIGNEES.map((assignee) => (
                          <SelectItem key={assignee} value={assignee}>
                            {labelAssignee(assignee)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Categoría</Label>
                    <Select
                      value={task.category}
                      onValueChange={(value) => updateTask(task.id, { category: value as any })}
                    >
                      <SelectTrigger className="bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {CATEGORIES.map((category) => (
                          <SelectItem key={category} value={category}>
                            {labelCat(category)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label className="text-xs font-semibold text-gray-700">Notas</Label>
                    <Input
                      value={task.notes}
                      onChange={(e) => updateTask(task.id, { notes: e.target.value })}
                      placeholder="Notas opcionales"
                      className="bg-white"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t">
            <Button
              id="template-cancel-046"
              onClick={() => setOpen(false)}
              variant="outline"
            >
              Cancelar
            </Button>
            <Button
              id="template-apply-047"
              onClick={applyTemplate}
              className="bg-gradient-to-r from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700"
            >
              ✨ Aplicar plantilla
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}