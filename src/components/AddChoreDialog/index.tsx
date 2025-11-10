import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Plus } from "lucide-react";
import { Chore, FULL_DAYS } from '../../types';
import { ChoreForm } from '../ChoreForm';
import { clampToRange } from '../../utils/time';

interface AddChoreDialogProps {
  onAdd: (c: Omit<Chore, 'id'>) => void;
  defaultDay?: number;
  small?: boolean;
}

export function AddChoreDialog({ onAdd, defaultDay, small }: AddChoreDialogProps) {
  const [open, setOpen] = useState(false);

  const trigger = (
    <Button 
      id="add-chore-button-013"
      size={small ? "sm" : "default"} 
      className={`gap-2 transition-all duration-300 hover:scale-105 ${
        small 
          ? "bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-soft" 
          : "bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-medium hover:shadow-strong"
      }`}
      onClick={() => setOpen(true)}
    >
      <Plus className="h-4 w-4" />
      {small ? "➕" : "✨ Agregar tarea"}
    </Button>
  );

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md bg-white/95 backdrop-blur-md border-white/30 shadow-strong">
        <div className="absolute inset-0 bg-glass-gradient rounded-lg"></div>
        <DialogHeader className="relative z-10">
          <DialogTitle className="text-xl font-bold bg-gradient-to-r from-gray-900 to-gray-700 bg-clip-text text-transparent flex items-center gap-2">
            <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-600 rounded-full flex items-center justify-center">
              <Plus className="h-4 w-4 text-white" />
            </div>
            Nueva tarea
          </DialogTitle>
        </DialogHeader>
        <ChoreForm
          initial={{
            title: "",
            day: defaultDay ?? 0,
            start: clampToRange("09:00"),
            duration: 30,
            category: "daily",
            assignee: "ayudante",
            notes: "",
          }}
          days={FULL_DAYS}
          onSubmit={(values) => {
            onAdd(values);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}