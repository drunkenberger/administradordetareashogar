import React, { useMemo, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Chore } from '../../types';
import { HOURS, HOUR_START, HOUR_END, SLOT_HEIGHT } from '../../constants';
import { ChoreBlock } from '../../components/ChoreBlock';
import { AddChoreDialog } from '../../components/AddChoreDialog';
import { timeToMinutes } from '../../utils/time';
import { fmtDate } from '../../utils/dates';

interface WeeklyGridViewProps {
  days: readonly string[];
  weekDates: Date[];
  filtered: Chore[];
  conflictIds: Set<string>;
  onUpdate: (id: string, patch: Partial<Chore>) => void;
  onDelete: (id: string) => void;
  onAdd: (c: Omit<Chore, 'id'>) => void;
}

export function WeeklyGridView({
  days,
  weekDates,
  filtered,
  conflictIds,
  onUpdate,
  onDelete,
  onAdd
}: WeeklyGridViewProps) {
  const today = new Date();
  const todayIndex = days.findIndex((_, idx) => {
    const dayDate = weekDates[idx];
    return dayDate.toDateString() === today.toDateString();
  });

  // Refs para mejorar la experiencia de scroll
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  
  // Calcular el ancho dinámico de las columnas de forma responsiva
  const columnWidth = useMemo(() => {
    const baseWidth = 140; // Ancho base por columna
    return Math.max(baseWidth, 160); // Asegurar un ancho mínimo decente
  }, []);

  // Scroll suave al día actual al montar el componente
  useEffect(() => {
    if (todayIndex >= 0 && scrollContainerRef.current) {
      const scrollPosition = todayIndex * columnWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: 'smooth'
      });
    }
  }, [todayIndex, columnWidth]);

  return (
    <div className="weekly-grid-container overflow-hidden animate-slide-up">
      {/* Main Grid Container */}
      <Card className="bg-white/80 backdrop-blur-md border-white/20 shadow-strong overflow-hidden">
        <CardHeader className="py-4 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
          <CardTitle className="text-lg font-bold text-gray-800 flex items-center gap-3">
            <div className="w-4 h-4 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full"></div>
            Vista Semanal en Cuadrícula
            <span className="text-sm font-normal text-gray-600">
              {days.length === 5 ? 'Días laborables' : 'Semana completa'}
            </span>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="grid-wrapper relative">
            {/* Horizontal Scroll Container */}
            <div 
              ref={scrollContainerRef}
              className="grid-scroll-container overflow-x-auto overflow-y-hidden"
              style={{ 
                scrollbarWidth: 'thin',
                scrollbarColor: 'rgba(156, 163, 175, 0.5) transparent'
              }}
            >
              <div 
                className="grid-layout relative"
                style={{ 
                  display: 'grid',
                  gridTemplateColumns: `120px repeat(${days.length}, ${columnWidth}px)`,
                  minWidth: 120 + (columnWidth * days.length),
                  height: (HOUR_END - HOUR_START) * SLOT_HEIGHT + 60, // +60 para headers
                  '--days-count': days.length
                } as React.CSSProperties}
              >
                {/* Columna de Horas (Sticky) */}
                <div 
                  className="hours-column sticky left-0 z-20 bg-white/95 backdrop-blur-md border-r border-gray-200/50"
                  style={{ gridColumn: 1, gridRow: '1 / -1' }}
                >
                  {/* Header de Horas */}
                  <div className="hours-header h-16 flex items-center justify-center border-b border-gray-200/50 bg-gradient-to-br from-gray-50 to-gray-100">
                    <span className="text-sm font-bold text-gray-700 uppercase tracking-wide">
                      Horas
                    </span>
                  </div>
                  
                  {/* Horas del día */}
                  <div className="hours-content relative">
                    {HOURS.slice(0, HOUR_END - HOUR_START).map((h) => (
                      <div
                        key={h}
                        className="hour-slot flex items-center justify-center relative"
                        style={{ 
                          height: SLOT_HEIGHT,
                          borderBottom: '1px dashed rgba(156, 163, 175, 0.3)'
                        }}
                      >
                        <div className="hour-label bg-gradient-to-r from-blue-50 to-purple-50 px-3 py-1 rounded-lg border border-gray-200/50 shadow-soft">
                          <span className="text-xs font-semibold text-gray-700">
                            {String(h).padStart(2, "0")}:00
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Headers de Días */}
                {days.map((dayName, dayIdx) => (
                  <div
                    key={`header-${dayName}`}
                    className={`day-header h-16 border-b border-gray-200/50 flex items-center justify-between px-4 relative overflow-hidden ${
                      dayIdx === todayIndex 
                        ? "bg-gradient-to-br from-blue-100/80 to-purple-100/80" 
                        : "bg-gradient-to-br from-gray-50/80 to-white/80"
                    }`}
                    style={{ 
                      gridColumn: dayIdx + 2,
                      gridRow: 1,
                      borderRight: dayIdx < days.length - 1 ? '1px solid rgba(156, 163, 175, 0.2)' : 'none'
                    }}
                  >
                    {/* Background effects */}
                    <div className="absolute inset-0 bg-glass-gradient"></div>
                    {dayIdx === todayIndex && (
                      <div className="absolute inset-0 bg-gradient-to-r from-blue-400/10 to-purple-400/10"></div>
                    )}
                    
                    <div className="flex items-center gap-3 relative z-10">
                      <div className={`w-3 h-3 rounded-full ${
                        dayIdx === todayIndex 
                          ? "bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse" 
                          : "bg-gradient-to-r from-gray-400 to-gray-500"
                      }`}></div>
                      <div className="flex flex-col">
                        <span className={`font-bold text-sm ${
                          dayIdx === todayIndex ? 'text-blue-800' : 'text-gray-800'
                        }`}>
                          {dayName}
                          {dayIdx === todayIndex && (
                            <span className="ml-2 text-xs bg-gradient-to-r from-blue-500 to-purple-600 text-white px-2 py-0.5 rounded-full font-medium">
                              Hoy
                            </span>
                          )}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          {fmtDate(weekDates[dayIdx])}
                        </span>
                      </div>
                    </div>
                    
                    <AddChoreDialog
                      small
                      defaultDay={dayIdx}
                      onAdd={onAdd}
                    />
                  </div>
                ))}

                {/* Celdas de Tiempo para cada Día */}
                {days.map((dayName, dayIdx) => (
                  <div
                    key={`day-${dayName}`}
                    className="day-column relative"
                    style={{ 
                      gridColumn: dayIdx + 2,
                      gridRow: '2 / -1',
                      borderRight: dayIdx < days.length - 1 ? '1px solid rgba(156, 163, 175, 0.2)' : 'none'
                    }}
                  >
                    {/* Canvas para tareas */}
                    <div
                      data-role="day-canvas"
                      data-day-idx={dayIdx}
                      className={`day-canvas relative h-full transition-all duration-300 hover:bg-gradient-to-b hover:from-blue-50/30 hover:to-purple-50/30 ${
                        dayIdx === todayIndex 
                          ? "bg-gradient-to-b from-blue-50/20 to-indigo-50/20" 
                          : "bg-gradient-to-b from-white/50 to-gray-50/30"
                      }`}
                      style={{ minHeight: (HOUR_END - HOUR_START) * SLOT_HEIGHT }}
                    >
                      {/* Líneas de cuadrícula horizontales */}
                      {HOURS.slice(0, HOUR_END - HOUR_START).map((h, hIdx) => (
                        <div
                          key={`grid-${h}`}
                          className="absolute left-0 right-0 border-t border-dashed border-gray-200/40"
                          style={{ top: hIdx * SLOT_HEIGHT }}
                        />
                      ))}
                      
                      {/* Tareas */}
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
                      
                      {/* Estado vacío elegante */}
                      {filtered.filter((c) => c.day === dayIdx).length === 0 && (
                        <div className="absolute inset-0 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-300">
                          <div className="text-center p-4">
                            <div className="text-2xl mb-2 animate-bounce-gentle">📅</div>
                            <p className="text-xs text-gray-500 font-medium">
                              Arrastra tareas aquí
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Indicador de scroll horizontal */}
      <div className="flex items-center justify-center mt-4 opacity-60">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
          <span>Desliza horizontalmente para ver más días</span>
          <div className="flex gap-1">
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
            <div className="w-1 h-1 bg-gray-400 rounded-full"></div>
          </div>
        </div>
      </div>
    </div>
  );
}