import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { DialogTitle } from "@/components/ui/dialog";
import { 
  Calendar, 
  Clock, 
  Timer, 
  User, 
  Tag, 
  FileText, 
  Edit3, 
  ArrowLeft,
  Trash2
} from "lucide-react";

import { Chore, FULL_DAYS } from '../../types';
import { CATEGORY_COLORS, CATEGORY_COLORS_LIGHT } from '../../constants';
import { labelCat, labelAssignee } from '../../utils/labels';
import { ChoreForm } from '../../components/ChoreForm';

interface TaskDetailViewProps {
  chore: Chore;
  onUpdate: (id: string, patch: Partial<Chore>) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
  hasConflict?: boolean;
}

export function TaskDetailView({ 
  chore, 
  onUpdate, 
  onDelete, 
  onClose,
  hasConflict = false 
}: TaskDetailViewProps) {
  const [isEditing, setIsEditing] = useState(false);

  const categoryColor = CATEGORY_COLORS[chore.category];
  const categoryLightColor = CATEGORY_COLORS_LIGHT[chore.category];
  const dayName = FULL_DAYS[chore.day] || 'Día no válido';

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = (values: Omit<Chore, 'id'>) => {
    onUpdate(chore.id, values);
    setIsEditing(false);
  };

  const handleDelete = () => {
    if (confirm('¿Estás seguro de que quieres eliminar esta tarea?')) {
      onDelete(chore.id);
      onClose();
    }
  };

  if (isEditing) {
    return (
      <div className="w-full max-h-[90vh] overflow-auto">
        <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-strong">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl font-bold text-gray-800">
                Editar tarea
              </DialogTitle>
              <Button
                id="task-detail-close-edit-033"
                variant="ghost"
                size="sm"
                onClick={() => setIsEditing(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <ChoreForm
              initial={chore}
              onSubmit={handleSave}
              onDelete={() => handleDelete()}
            />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="w-full max-h-[90vh] overflow-auto animate-scale-in">
      <Card className="bg-white/95 backdrop-blur-md border-white/20 shadow-strong overflow-hidden">
          {/* Beautiful Header with Category Color */}
          <div className={`${categoryColor} p-6 relative overflow-hidden`}>
            {/* Background Effects */}
            <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent"></div>
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-white/10 to-transparent rounded-full -translate-y-16 translate-x-16"></div>
            
            {/* Header Content */}
            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h1 
                    id="task-detail-title-034" 
                    className="text-2xl md:text-3xl font-bold text-white drop-shadow-sm leading-tight"
                  >
                    {chore.title}
                  </h1>
                  <div className="flex items-center gap-2 mt-2">
                    <Tag className="h-4 w-4 text-white/90" />
                    <span className="text-white/90 font-medium text-sm">
                      {labelCat(chore.category)}
                    </span>
                  </div>
                </div>
                
                <Button
                  id="task-detail-close-035"
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="text-white/80 hover:text-white hover:bg-white/20 transition-all duration-200"
                >
                  <ArrowLeft className="h-5 w-5" />
                </Button>
              </div>

              {/* Conflict Warning */}
              {hasConflict && (
                <div className="bg-rose-500/90 backdrop-blur-sm text-white p-3 rounded-xl border border-white/20 animate-pulse-slow">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-white rounded-full animate-ping"></div>
                    <span className="font-medium text-sm">
                      ⚠️ Esta tarea tiene conflictos de horario
                    </span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <CardContent className="p-6 space-y-6">
            {/* Time & Schedule Info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className={`${categoryLightColor} p-4 rounded-xl border border-gray-200/30 animate-slide-up`}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                    <Calendar className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Día programado
                    </p>
                    <p id="task-detail-day-036" className="text-lg font-bold text-gray-800">
                      {dayName}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${categoryLightColor} p-4 rounded-xl border border-gray-200/30 animate-slide-up`} style={{animationDelay: '0.1s'}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                    <Clock className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Hora de inicio
                    </p>
                    <p id="task-detail-time-037" className="text-lg font-bold text-gray-800">
                      {chore.start}
                    </p>
                  </div>
                </div>
              </div>

              <div className={`${categoryLightColor} p-4 rounded-xl border border-gray-200/30 animate-slide-up`} style={{animationDelay: '0.2s'}}>
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center">
                    <Timer className="h-5 w-5 text-gray-600" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                      Duración
                    </p>
                    <p id="task-detail-duration-038" className="text-lg font-bold text-gray-800">
                      {chore.duration} min
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Assignee Info */}
            <div className="animate-slide-up" style={{animationDelay: '0.3s'}}>
              <Card className="bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200/30">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600 uppercase tracking-wide">
                        Responsable asignado
                      </p>
                      <p id="task-detail-assignee-039" className="text-xl font-bold text-gray-800">
                        {labelAssignee(chore.assignee)}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Notes Section */}
            {chore.notes && (
              <div className="animate-slide-up" style={{animationDelay: '0.4s'}}>
                <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200/30">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-white/80 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                        <FileText className="h-5 w-5 text-gray-600" />
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-600 uppercase tracking-wide mb-2">
                          Notas adicionales
                        </p>
                        <p id="task-detail-notes-040" className="text-gray-800 leading-relaxed">
                          {chore.notes}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200/50 animate-slide-up" style={{animationDelay: '0.5s'}}>
              <Button
                id="task-detail-edit-041"
                onClick={handleEdit}
                className="flex-1 bg-gradient-to-r from-blue-500 to-blue-600 text-white border-0 hover:from-blue-600 hover:to-blue-700 shadow-soft transition-all duration-300 hover:scale-105 gap-2"
              >
                <Edit3 className="h-4 w-4" />
                Editar tarea
              </Button>
              
              <Button
                id="task-detail-delete-042"
                variant="destructive"
                onClick={handleDelete}
                className="bg-gradient-to-r from-rose-500 to-rose-600 text-white border-0 hover:from-rose-600 hover:to-rose-700 shadow-soft transition-all duration-300 hover:scale-105 gap-2"
              >
                <Trash2 className="h-4 w-4" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
    </div>
  );
}