// React import removed as it's not needed in this component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chore } from '../../types';
import { HOURS, HOUR_START, HOUR_END, SLOT_HEIGHT } from '../../constants';
import { ChoreBlock } from '../../components/ChoreBlock';
import { AddChoreDialog } from '../../components/AddChoreDialog';
import { timeToMinutes } from '../../utils/time';
import { fmtDate } from '../../utils/dates';

interface WeekViewProps {
  days: readonly string[];
  weekDates: Date[];
  filtered: Chore[];
  conflictIds: Set<string>;
  onUpdate: (id: string, patch: Partial<Chore>) => void;
  onDelete: (id: string) => void;
  onAdd: (c: Omit<Chore, 'id'>) => void;
}

export function WeekView({
  days,
  weekDates,
  filtered,
  conflictIds,
  onUpdate,
  onDelete,
  onAdd
}: WeekViewProps) {
  const today = new Date();
  const todayIndex = days.findIndex((_, idx) => {
    const dayDate = weekDates[idx];
    return dayDate.toDateString() === today.toDateString();
  });

  return (
    <div className="grid grid-cols-12 gap-4 animate-slide-up">
      {/* Hours column */}
      <div className="col-span-2 md:col-span-1">
        <div className="sticky top-6">
          <div className="bg-white/60 backdrop-blur-md rounded-2xl border border-white/30 shadow-soft p-4 mb-4">
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
      
      {/* Day columns */}
      {days.map((d, dayIdx) => (
        <div
          key={d}
          className={`col-span-10 ${
            days.length === 5
              ? "md:col-span-[calc((11)/5)]"
              : "md:col-span-[calc((11)/7)]"
          } animate-scale-in`}
          style={{ animationDelay: `${dayIdx * 0.1}s` }}
        >
          <Card className={`overflow-hidden shadow-strong border-0 transition-all duration-300 hover:shadow-glow ${
            dayIdx === todayIndex 
              ? "bg-gradient-to-br from-blue-50 to-indigo-50 ring-2 ring-blue-400/30" 
              : "bg-white/80 backdrop-blur-md"
          }`}>
            <CardHeader className={`py-4 relative overflow-hidden ${
              dayIdx === todayIndex 
                ? "bg-gradient-to-r from-blue-500/10 to-purple-500/10" 
                : "bg-white/70"
            }`}>
              {/* Header background effects */}
              <div className="absolute inset-0 bg-glass-gradient"></div>
              {dayIdx === todayIndex && (
                <div className="absolute inset-0 bg-gradient-to-r from-blue-400/5 to-purple-400/5"></div>
              )}
              
              <CardTitle className="text-base flex items-center justify-between relative z-10">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    dayIdx === todayIndex 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" 
                      : "bg-gradient-to-r from-gray-400 to-gray-500"
                  }`}></div>
                  <span className={`font-bold ${dayIdx === todayIndex ? 'text-blue-800' : 'text-gray-800'}`}>
                    {d}
                    {dayIdx === todayIndex && (
                      <span className="ml-2 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-1 rounded-full font-medium">
                        Hoy
                      </span>
                    )}
                  </span>
                  <span className="text-xs text-gray-500 font-medium">
                    {fmtDate(weekDates[dayIdx])}
                  </span>
                </div>
                <AddChoreDialog
                  small
                  defaultDay={dayIdx}
                  onAdd={onAdd}
                />
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0 relative">
              <div
                data-role="day-canvas"
                data-day-idx={dayIdx}
                className="relative bg-gradient-to-b from-white/50 to-gray-50/50"
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
                
                {/* Tasks */}
                {filtered
                  .filter((c) => c.day === dayIdx)
                  .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start))
                  .map((c, index) => (
                    <div
                      key={`${c.id}-${c.day}-${c.start}-${c.duration}`}
                      className="animate-scale-in"
                      style={{ animationDelay: `${(dayIdx * 0.1) + (index * 0.05)}s` }}
                    >
                      <ChoreBlock
                        chore={c}
                        hasConflict={conflictIds.has(c.id)}
                        onUpdate={onUpdate}
                        onDelete={onDelete}
                      />
                    </div>
                  ))}
                
                {/* Empty state hint */}
                {filtered.filter((c) => c.day === dayIdx).length === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-30">
                    <div className="text-center p-6">
                      <div className="text-3xl mb-2">📅</div>
                      <p className="text-sm text-gray-500 font-medium">
                        Arrastra tareas aquí
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      ))}
    </div>
  );
}