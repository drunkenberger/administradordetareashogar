import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Download, Upload, CalendarClock } from "lucide-react";

import { Chore, CATEGORIES, ASSIGNEES, BASE_DAYS, FULL_DAYS } from './types';
import { STORAGE_KEY } from './constants';
import { useLocalStorageState } from './hooks/useLocalStorage';
import { DEFAULTS, seedWeek } from './data/defaultChores';
import { getConflictIds } from './utils/conflicts';
import { getMonday, getWeekDates } from './utils/dates';
import { labelCat, labelAssignee } from './utils/labels';
import { ChoreService } from './services/choreService';

import { WeekNav } from './components/WeekNav';
import { QuickAddFromTemplate } from './components/QuickAdd';
import { TemplateButton } from './components/TemplateButton';
import { EditableTemplateDialog } from './components/EditableTemplateDialog';
import { AddChoreDialog } from './components/AddChoreDialog';
import { AutoPlanButton } from './components/AutoPlanButton';
import { WeekView } from './views/WeekView';
import { WeeklyGridView } from './views/WeeklyGridView';
import { DayView } from './views/DayView';

export default function PlanificadorTareas() {
  const [chores, setChores] = useLocalStorageState<Chore[]>(
    STORAGE_KEY,
    seedWeek(DEFAULTS, BASE_DAYS.length)
  );
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [activeWeekStart, setActiveWeekStart] = useState(getMonday(new Date()));
  const [view, setView] = useState<"week" | "grid" | "day">("week");
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [showWeekend, setShowWeekend] = useState(false);

  const DAYS_UI = useMemo(
    () => (showWeekend ? [...FULL_DAYS] : [...BASE_DAYS]),
    [showWeekend]
  );

  const filtered = useMemo(() => 
    ChoreService.filterChores(chores, filterCat, filterAssignee),
    [chores, filterCat, filterAssignee]
  );

  const conflictIds = useMemo(() => getConflictIds(chores), [chores]);
  const weekDates = useMemo(
    () => getWeekDates(activeWeekStart, DAYS_UI.length),
    [activeWeekStart, DAYS_UI]
  );

  function addChore(c: Omit<Chore, "id">) {
    setChores(prev => ChoreService.addChore(prev, c));
  }

  function updateChore(id: string, patch: Partial<Chore>) {
    setChores(prev => ChoreService.updateChore(prev, id, patch));
  }

  function deleteChore(id: string) {
    setChores(prev => ChoreService.deleteChore(prev, id));
  }

  function clearAll() {
    if (confirm("¿Vaciar todas las tareas?")) setChores([]);
  }

  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    ChoreService.importFromJSON(file)
      .then(setChores)
      .catch(() => alert("Archivo JSON inválido"));
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Beautiful Background Elements */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>
      
      <div className="relative z-10 p-4 md:p-8">
        {/* Stunning Header */}
        <header className="mb-8 animate-slide-down">
          <div className="max-w-7xl mx-auto">
            {/* Main Title Section */}
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-3xl shadow-glow mb-4 animate-bounce-gentle">
                <CalendarClock className="h-8 w-8 text-white" />
              </div>
              <h1 id="header-nav-004" className="text-4xl md:text-5xl font-display font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                Planificador de Tareas
              </h1>
              <p className="text-lg text-gray-600 font-medium">
                Organiza tu hogar con elegancia y eficiencia ✨
              </p>
            </div>
            
            {/* Action Buttons */}
            <div className="flex flex-wrap justify-center gap-3 mb-6">
              <AutoPlanButton
                daysCount={DAYS_UI.length}
                onGenerate={setChores}
                hasExistingChores={chores.length > 0}
              />
              <QuickAddFromTemplate
                onAdd={addChore}
                defaultDay={view === "day" ? dayIndex : 0}
                days={DAYS_UI}
              />
              <TemplateButton
                days={DAYS_UI}
                onInsert={(items) => setChores(prev => [...prev, ...items])}
              />
              <EditableTemplateDialog
                days={DAYS_UI}
                onInsert={(items) => setChores(prev => [...prev, ...items])}
              />
              <Button 
                id="export-button-010"
                variant="secondary" 
                onClick={() => ChoreService.exportToJSON(chores)} 
                className="gap-2 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 shadow-soft transition-all duration-300 hover:shadow-medium hover:scale-105"
              >
                <Download className="h-4 w-4" />
                Exportar
              </Button>
              <label 
                id="import-button-011"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-white/20 cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 text-sm font-medium transition-all duration-300 hover:shadow-medium hover:scale-105"
              >
                <Upload className="h-4 w-4" /> Importar
                <input
                  type="file"
                  accept="application/json"
                  className="hidden"
                  onChange={importJSON}
                />
              </label>
              <Button 
                id="clear-all-button-012"
                variant="destructive" 
                onClick={clearAll} 
                className="gap-2 bg-gradient-to-r from-rose-500 to-pink-600 border-0 hover:from-rose-600 hover:to-pink-700 shadow-soft transition-all duration-300 hover:shadow-medium hover:scale-105"
              >
                <Trash2 className="h-4 w-4" />
                Vaciar
              </Button>
            </div>
          </div>
        </header>

        {/* Beautiful Controls Panel */}
        <div className="max-w-7xl mx-auto mb-8 animate-slide-up">
          <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-strong overflow-hidden">
            <div className="absolute inset-0 bg-glass-gradient"></div>
            <CardContent className="relative responsive-card-padding">
              {/* Mobile First Layout - Stack everything vertically on small screens */}
              <div className="space-y-6">
                
                {/* First Row: Filters */}
                <div className="flex flex-col space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Filtros</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-semibold text-gray-700">Categoría</Label>
                      <Select value={filterCat} onValueChange={setFilterCat}>
                        <SelectTrigger id="filter-category-005" className="bg-white/80 border-white/30 hover:bg-white transition-all duration-200 shadow-soft">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                          <SelectItem value="all">Todos</SelectItem>
                          {CATEGORIES.map((c) => (
                            <SelectItem key={c} value={c}>
                              {labelCat(c)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex flex-col gap-2">
                      <Label className="text-sm font-semibold text-gray-700">Responsable</Label>
                      <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                        <SelectTrigger id="filter-assignee-006" className="bg-white/80 border-white/30 hover:bg-white transition-all duration-200 shadow-soft">
                          <SelectValue placeholder="Todos" />
                        </SelectTrigger>
                        <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                          <SelectItem value="all">Todos</SelectItem>
                          {ASSIGNEES.map((a) => (
                            <SelectItem key={a} value={a}>
                              {labelAssignee(a)}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* Separator */}
                <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"></div>
                
                {/* Second Row: Navigation & View Controls */}
                <div className="flex flex-col space-y-4">
                  <h3 className="text-sm font-bold text-gray-700 uppercase tracking-wide">Navegación y Vista</h3>
                  
                  {/* Week Navigation - Responsive */}
                  <div className="flex justify-center">
                    <div className="w-full max-w-md">
                      <WeekNav
                        active={activeWeekStart}
                        onChange={setActiveWeekStart}
                        daysCount={DAYS_UI.length}
                      />
                    </div>
                  </div>
                  
                  {/* View Toggle & Settings Row */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    {/* View Toggle */}
                    <div className="flex justify-center w-full sm:w-auto">
                      <div className="inline-flex rounded-2xl p-1 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/30 shadow-inner-soft">
                        <Button
                          id="view-toggle-week-007"
                          size="sm"
                          variant={view === "week" ? "default" : "ghost"}
                          onClick={() => setView("week")}
                          className={view === "week" 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-soft" 
                            : "hover:bg-white/50 text-gray-700"
                          }
                        >
                          Semana
                        </Button>
                        <Button
                          id="view-toggle-grid-013"
                          size="sm"
                          variant={view === "grid" ? "default" : "ghost"}
                          onClick={() => setView("grid")}
                          className={view === "grid" 
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-soft" 
                            : "hover:bg-white/50 text-gray-700"
                          }
                        >
                          Cuadrícula
                        </Button>
                        <Button
                          id="view-toggle-day-008"
                          size="sm"
                          variant={view === "day" ? "default" : "ghost"}
                          onClick={() => setView("day")}
                          className={view === "day" 
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-soft" 
                            : "hover:bg-white/50 text-gray-700"
                          }
                        >
                          Día
                        </Button>
                      </div>
                    </div>
                    
                    {/* Settings & Add */}
                    <div className="mobile-button-group">
                      <label className="inline-flex items-center gap-2 text-sm font-medium text-gray-700 cursor-pointer hover:text-gray-900 transition-colors">
                        <input
                          id="weekend-toggle-009"
                          type="checkbox"
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                          checked={showWeekend}
                          onChange={(e) => setShowWeekend(e.target.checked)}
                        />
                        <span className="select-none">Fin de semana</span>
                      </label>
                      
                      <AddChoreDialog onAdd={addChore} />
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content Area */}
        <div className="max-w-7xl mx-auto animate-fade-in">
          {view === "week" ? (
            <WeekView
              days={DAYS_UI}
              weekDates={weekDates}
              filtered={filtered}
              conflictIds={conflictIds}
              onUpdate={updateChore}
              onDelete={deleteChore}
              onAdd={addChore}
            />
          ) : view === "grid" ? (
            <WeeklyGridView
              days={DAYS_UI}
              weekDates={weekDates}
              filtered={filtered}
              conflictIds={conflictIds}
              onUpdate={updateChore}
              onDelete={deleteChore}
              onAdd={addChore}
            />
          ) : (
            <DayView
              days={DAYS_UI}
              dayIndex={dayIndex}
              setDayIndex={setDayIndex}
              setActiveWeekStart={setActiveWeekStart}
              weekDates={weekDates}
              filtered={filtered}
              conflictIds={conflictIds}
              onUpdate={updateChore}
              onDelete={deleteChore}
              onAdd={addChore}
            />
          )}
        </div>

        {/* Beautiful Footer */}
        <footer className="mt-12 mb-6 text-center animate-fade-in">
          <div className="max-w-4xl mx-auto">
            <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 p-6 shadow-soft">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm font-bold">✨</span>
                  </div>
                  <div className="text-left">
                    <p className="text-sm font-semibold text-gray-700">
                      Planificador Inteligente
                    </p>
                    <p className="text-xs text-gray-500">
                      Todo se guarda automáticamente en tu navegador
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Arrastra y redimensiona tareas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>Cambia entre vista Semana/Cuadrícula/Día</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>173+ plantillas disponibles</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}