// React import removed as it's not needed in this component
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chore } from '../../types';
import { HOURS, HOUR_START, HOUR_END, SLOT_HEIGHT } from '../../constants';
import { ChoreBlock } from '../../components/ChoreBlock';
import { AddChoreDialog } from '../../components/AddChoreDialog';
import { timeToMinutes } from '../../utils/time';
import { fmtDate, getMonday } from '../../utils/dates';

interface DayViewProps {
  days: readonly string[];
  dayIndex: number;
  setDayIndex: (index: number | ((prev: number) => number)) => void;
  setActiveWeekStart: (date: Date) => void;
  weekDates: Date[];
  filtered: Chore[];
  conflictIds: Set<string>;
  onUpdate: (id: string, patch: Partial<Chore>) => void;
  onDelete: (id: string) => void;
  onAdd: (c: Omit<Chore, 'id'>) => void;
}

export function DayView({
  days,
  dayIndex,
  setDayIndex,
  setActiveWeekStart,
  weekDates,
  filtered,
  conflictIds,
  onUpdate,
  onDelete,
  onAdd
}: DayViewProps) {
  const today = new Date();
  const isToday = weekDates[dayIndex]?.toDateString() === today.toDateString();
  const currentDayTasks = filtered.filter((c) => c.day === dayIndex);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-6 animate-slide-up">
      {/* Hours column */}
      <div className="lg:col-span-2 order-2 lg:order-1">
        <div className="sticky top-6">
          {/* Day Stats Card */}
          <div className="bg-white/70 backdrop-blur-md rounded-2xl border border-white/30 shadow-strong p-6 mb-6">
            <div className="text-center">
              <div className={`w-16 h-16 mx-auto rounded-full flex items-center justify-center mb-4 ${
                isToday 
                  ? "bg-gradient-to-br from-blue-500 to-purple-600 shadow-glow animate-pulse" 
                  : "bg-gradient-to-br from-gray-400 to-gray-600"
              }`}>
                <span className="text-2xl text-white font-bold">
                  {weekDates[dayIndex]?.getDate()}
                </span>
              </div>
              <h2 className={`text-xl font-bold mb-1 ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
                {days[dayIndex]}
                {isToday && (
                  <span className="block text-sm bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full font-medium mt-2">
                    Hoy
                  </span>
                )}
              </h2>
              <p className="text-sm text-gray-600 font-medium">
                {fmtDate(weekDates[dayIndex])}
              </p>
              
              {/* Task count */}
              <div className="mt-4 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/30">
                <div className="text-2xl font-bold text-blue-800">{currentDayTasks.length}</div>
                <div className="text-xs text-blue-600 font-medium">
                  {currentDayTasks.length === 1 ? 'tarea' : 'tareas'}
                </div>
              </div>
            </div>
          </div>

          {/* Time Column */}
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-soft p-4">
            <h3 className="text-sm font-semibold text-gray-700 mb-3 text-center">Horarios</h3>
            <div
              className="relative"
              style={{ height: (HOUR_END - HOUR_START) * SLOT_HEIGHT }}
            >
              {HOURS.slice(0, HOUR_END - HOUR_START).map((h, idx) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 text-xs font-medium text-gray-600 flex items-center justify-center"
                  style={{ top: idx * SLOT_HEIGHT }}
                >
                  <div className="bg-white/80 backdrop-blur-sm px-2 py-1 rounded-lg border border-gray-200/50 shadow-soft">
                    {String(h).padStart(2, "0")}:00
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Single day column */}
      <div className="lg:col-span-10 order-1 lg:order-2">
        <Card className={`overflow-hidden shadow-strong border-0 transition-all duration-300 ${
          isToday 
            ? "bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-400/30 shadow-glow" 
            : "bg-white/80 backdrop-blur-md"
        }`}>
          <CardHeader className={`py-6 relative overflow-hidden ${
            isToday 
              ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10" 
              : "bg-white/70"
          }`}>
            {/* Header background effects */}
            <div className="absolute inset-0 bg-glass-gradient"></div>
            {isToday && (
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"></div>
            )}
            
            <CardTitle className="text-lg flex items-center justify-between relative z-10">
              <div className="flex items-center gap-4">
                <div className={`w-4 h-4 rounded-full ${
                  isToday 
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" 
                    : "bg-gradient-to-r from-gray-400 to-gray-500"
                }`}></div>
                <span className={`font-bold text-xl ${isToday ? 'text-blue-800' : 'text-gray-800'}`}>
                  Vista del día: {days[dayIndex]}
                </span>
              </div>
              
              {/* Responsive Controls */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                {/* Mobile: Stack buttons vertically */}
                <div className="flex flex-col sm:flex-row items-center gap-2 w-full sm:w-auto">
                  <div className="flex items-center gap-2 bg-white/50 backdrop-blur-sm rounded-xl p-1 border border-white/30 w-full sm:w-auto">
                    <Button
                      id="day-view-prev-030"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setDayIndex((d) => d === 0 ? days.length - 1 : d - 1)
                      }
                      className="flex-1 sm:flex-initial hover:bg-white/80 transition-all duration-200 hover:scale-105"
                    >
                      ◀︎ Anterior
                    </Button>
                    <Button
                      id="day-view-next-031"
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        setDayIndex((d) => d === days.length - 1 ? 0 : d + 1)
                      }
                      className="flex-1 sm:flex-initial hover:bg-white/80 transition-all duration-200 hover:scale-105"
                    >
                      Siguiente ▶︎
                    </Button>
                  </div>
                  
                  <div className="flex items-center gap-2 w-full sm:w-auto">
                    <Button
                      id="day-view-today-032"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        const now = new Date();
                        setActiveWeekStart(getMonday(now));
                        setDayIndex(
                          Math.min(((now.getDay() + 6) % 7) as number, days.length - 1)
                        );
                      }}
                      className="flex-1 sm:flex-initial bg-gradient-to-r from-blue-500 to-purple-600 text-white border-0 hover:from-blue-600 hover:to-purple-700 shadow-soft transition-all duration-300 hover:scale-105"
                    >
                      📍 Ir a hoy
                    </Button>
                    
                    <div className="flex-1 sm:flex-initial">
                      <AddChoreDialog
                        small
                        defaultDay={dayIndex}
                        onAdd={onAdd}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          
          <CardContent className="p-0 relative">
            <div
              data-role="day-canvas"
              data-day-idx={dayIndex}
              className="relative bg-gradient-to-b from-white/50 to-gray-50/30"
              style={{ height: (HOUR_END - HOUR_START) * SLOT_HEIGHT }}
            >
              {/* Time grid lines */}
              {HOURS.slice(0, HOUR_END - HOUR_START).map((h, idx) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 border-t border-dashed border-gray-200/60"
                  style={{ top: idx * SLOT_HEIGHT }}
                />
              ))}
              
              {/* Subtle gradient overlay */}
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/10 to-white/20 pointer-events-none"></div>
              
              {/* Current time indicator for today */}
              {isToday && (
                <div 
                  className="absolute left-0 right-0 z-20 pointer-events-none"
                  style={{ 
                    top: ((today.getHours() - HOUR_START) * 60 + today.getMinutes()) * (SLOT_HEIGHT / 60)
                  }}
                >
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gradient-to-r from-red-500 to-pink-500 rounded-full shadow-glow animate-pulse"></div>
                    <div className="flex-1 h-0.5 bg-gradient-to-r from-red-500 to-transparent"></div>
                  </div>
                </div>
              )}
              
              {/* Tasks */}
              {currentDayTasks
                .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))
                .map((c, index) => (
                  <div
                    key={`${c.id}-${c.day}-${c.start}-${c.duration}`}
                    className="animate-scale-in"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <ChoreBlock
                      chore={c}
                      hasConflict={conflictIds.has(c.id)}
                      onUpdate={onUpdate}
                      onDelete={onDelete}
                    />
                  </div>
                ))}
              
              {/* Empty state */}
              {currentDayTasks.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center opacity-40">
                  <div className="text-center p-8">
                    <div className="text-6xl mb-4 animate-float">📅</div>
                    <p className="text-lg text-gray-600 font-semibold mb-2">
                      ¡Día libre!
                    </p>
                    <p className="text-sm text-gray-500">
                      Arrastra tareas aquí o usa el botón + para agregar
                    </p>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}