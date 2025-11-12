import React, { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Trash2, Download, Upload, Filter, Eye, Calendar, FileSpreadsheet, Image } from "lucide-react";

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
  const [isExporting, setIsExporting] = useState(false);

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

  async function handleExport(format: 'json' | 'csv' | 'image') {
    setIsExporting(true);
    try {
      switch (format) {
        case 'json':
          ChoreService.exportToJSON(chores);
          break;
        case 'csv':
          ChoreService.exportToCSV(chores);
          break;
        case 'image':
          await ChoreService.exportToImage(chores, DAYS_UI.length);
          break;
      }
    } catch (error) {
      console.error('Error al exportar:', error);
      alert('Error al exportar. Por favor intenta de nuevo.');
    } finally {
      setIsExporting(false);
    }
  }

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 relative overflow-hidden">
      {/* Beautiful Background Elements */}
      <div className="absolute inset-0 bg-mesh-gradient opacity-5"></div>
      <div className="absolute top-0 left-0 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-purple-600/20 rounded-full mix-blend-multiply filter blur-xl animate-float"></div>
      <div className="absolute top-0 right-0 w-72 h-72 bg-gradient-to-br from-purple-400/20 to-pink-600/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '2s'}}></div>
      <div className="absolute bottom-0 left-1/2 w-72 h-72 bg-gradient-to-br from-indigo-400/20 to-blue-600/20 rounded-full mix-blend-multiply filter blur-xl animate-float" style={{animationDelay: '4s'}}></div>

      <div className="relative z-10 p-4 md:p-8">
        {/* Main Toolbar - Quick Actions */}
        <div className="max-w-7xl mx-auto mb-6 animate-slide-down">
          <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-strong overflow-hidden">
            <div className="absolute inset-0 bg-glass-gradient"></div>
            <CardContent className="relative p-4">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* Left: Primary Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <AutoPlanButton
                    daysCount={DAYS_UI.length}
                    onGenerate={setChores}
                    hasExistingChores={chores.length > 0}
                  />
                  <AddChoreDialog onAdd={addChore} />
                  <QuickAddFromTemplate
                    onAdd={addChore}
                    defaultDay={view === "day" ? dayIndex : 0}
                    days={DAYS_UI}
                  />
                </div>

                {/* Right: Secondary Actions */}
                <div className="flex flex-wrap items-center gap-2">
                  <TemplateButton
                    days={DAYS_UI}
                    onInsert={(items) => setChores(prev => [...prev, ...items])}
                  />
                  <EditableTemplateDialog
                    days={DAYS_UI}
                    onInsert={(items) => setChores(prev => [...prev, ...items])}
                  />

                  <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent mx-1"></div>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button
                        id="export-button-010"
                        variant="secondary"
                        size="sm"
                        disabled={isExporting}
                        className="gap-2 bg-white/80 backdrop-blur-sm border-white/20 hover:bg-white/90 shadow-soft transition-all duration-300 hover:shadow-medium hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Download className="h-3.5 w-3.5" />
                        <span className="hidden sm:inline">
                          {isExporting ? 'Exportando...' : 'Exportar'}
                        </span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-white/95 backdrop-blur-md border-white/30 shadow-strong"
                    >
                      <DropdownMenuItem
                        onClick={() => handleExport('json')}
                        className="flex items-center gap-2 cursor-pointer hover:bg-blue-50 transition-colors"
                      >
                        <Download className="h-4 w-4 text-blue-600" />
                        <span className="font-medium">Exportar JSON</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport('csv')}
                        className="flex items-center gap-2 cursor-pointer hover:bg-green-50 transition-colors"
                      >
                        <FileSpreadsheet className="h-4 w-4 text-green-600" />
                        <span className="font-medium">Exportar CSV</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => handleExport('image')}
                        className="flex items-center gap-2 cursor-pointer hover:bg-purple-50 transition-colors"
                      >
                        <Image className="h-4 w-4 text-purple-600" />
                        <span className="font-medium">Exportar Imagen</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                  <label
                    id="import-button-011"
                    className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border border-white/20 cursor-pointer bg-white/80 backdrop-blur-sm hover:bg-white/90 text-sm font-medium transition-all duration-300 hover:shadow-medium hover:scale-105"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Importar</span>
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
                    size="sm"
                    onClick={clearAll}
                    className="gap-2 bg-gradient-to-r from-rose-500 to-pink-600 border-0 hover:from-rose-600 hover:to-pink-700 shadow-soft transition-all duration-300 hover:shadow-medium hover:scale-105"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Vaciar</span>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Enhanced Controls Panel */}
        <div className="max-w-7xl mx-auto mb-8 animate-slide-up">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

            {/* Filters Card */}
            <Card className="bg-white/70 backdrop-blur-md border-white/20 shadow-strong overflow-hidden group hover:shadow-glow transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-5">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-soft">
                    <Filter className="h-4 w-4 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Filtros</h3>
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Categoría</Label>
                    <Select value={filterCat} onValueChange={setFilterCat}>
                      <SelectTrigger id="filter-category-005" className="bg-white/90 border-gray-200/50 hover:bg-white hover:border-blue-300 transition-all duration-200 shadow-soft focus:ring-2 focus:ring-blue-400/30">
                        <SelectValue placeholder="Todas las categorías" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                        <SelectItem value="all">Todas las categorías</SelectItem>
                        {CATEGORIES.map((c) => (
                          <SelectItem key={c} value={c}>
                            {labelCat(c)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-xs font-semibold text-gray-600 uppercase tracking-wide">Responsable</Label>
                    <Select value={filterAssignee} onValueChange={setFilterAssignee}>
                      <SelectTrigger id="filter-assignee-006" className="bg-white/90 border-gray-200/50 hover:bg-white hover:border-blue-300 transition-all duration-200 shadow-soft focus:ring-2 focus:ring-blue-400/30">
                        <SelectValue placeholder="Todos los responsables" />
                      </SelectTrigger>
                      <SelectContent className="bg-white/95 backdrop-blur-md border-white/30">
                        <SelectItem value="all">Todos los responsables</SelectItem>
                        {ASSIGNEES.map((a) => (
                          <SelectItem key={a} value={a}>
                            {labelAssignee(a)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* View & Navigation Card */}
            <Card className="lg:col-span-2 bg-white/70 backdrop-blur-md border-white/20 shadow-strong overflow-hidden group hover:shadow-glow transition-all duration-300">
              <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <CardContent className="relative p-5">
                <div className="space-y-5">
                  {/* View Toggle Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg flex items-center justify-center shadow-soft">
                        <Eye className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Vista</h3>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                      <div className="inline-flex rounded-2xl p-1.5 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-pink-500/10 border border-white/30 shadow-inner-soft">
                        <Button
                          id="view-toggle-week-007"
                          size="sm"
                          variant={view === "week" ? "default" : "ghost"}
                          onClick={() => setView("week")}
                          className={view === "week"
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-soft hover:from-blue-600 hover:to-blue-700"
                            : "hover:bg-white/50 text-gray-700 hover:text-gray-900"
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
                            ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-soft hover:from-purple-600 hover:to-purple-700"
                            : "hover:bg-white/50 text-gray-700 hover:text-gray-900"
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
                            ? "bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-soft hover:from-blue-600 hover:to-blue-700"
                            : "hover:bg-white/50 text-gray-700 hover:text-gray-900"
                          }
                        >
                          Día
                        </Button>
                      </div>

                      <div className="h-6 w-px bg-gradient-to-b from-transparent via-gray-300 to-transparent"></div>

                      <label className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/80 border border-gray-200/50 text-sm font-medium text-gray-700 cursor-pointer hover:bg-white hover:border-purple-300 transition-all duration-200 shadow-soft hover:shadow-medium">
                        <input
                          id="weekend-toggle-009"
                          type="checkbox"
                          className="h-4 w-4 text-purple-600 border-gray-300 rounded focus:ring-purple-500 focus:ring-2 transition-all duration-200"
                          checked={showWeekend}
                          onChange={(e) => setShowWeekend(e.target.checked)}
                        />
                        <span className="select-none">Fin de semana</span>
                      </label>
                    </div>
                  </div>

                  <div className="w-full h-px bg-gradient-to-r from-transparent via-gray-300/50 to-transparent"></div>

                  {/* Week Navigation Section */}
                  <div>
                    <div className="flex items-center gap-2 mb-4">
                      <div className="w-8 h-8 bg-gradient-to-br from-pink-500 to-pink-600 rounded-lg flex items-center justify-center shadow-soft">
                        <Calendar className="h-4 w-4 text-white" />
                      </div>
                      <h3 className="text-sm font-bold text-gray-800 uppercase tracking-wide">Navegación</h3>
                    </div>

                    <WeekNav
                      active={activeWeekStart}
                      onChange={setActiveWeekStart}
                      daysCount={DAYS_UI.length}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-soft">
                    <span className="text-white text-lg">✨</span>
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

                <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Arrastra y redimensiona tareas</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
                    <span>3 vistas disponibles</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
                    <span>173+ plantillas</span>
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
