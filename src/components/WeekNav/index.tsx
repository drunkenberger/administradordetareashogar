// React import removed as it's not needed in this component
import { Button } from "@/components/ui/button";
import { getMonday } from '../../utils/dates';

interface WeekNavProps {
  active: Date;
  onChange: (d: Date) => void;
  daysCount: number;
}

export function WeekNav({ active, onChange, daysCount }: WeekNavProps) {
  function shift(days: number) {
    const d = new Date(active);
    d.setDate(d.getDate() + days);
    onChange(getMonday(d));
  }

  const endDate = new Date(active.getTime() + (daysCount - 1) * 86400000);
  
  const label = `${active.toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
  })} — ${endDate.toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
  })}`;

  return (
    <div className="w-full">
      {/* Mobile Layout (Stack vertically) */}
      <div className="flex flex-col gap-3 md:hidden">
        {/* Date Display */}
        <div className="px-4 py-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/30 shadow-inner-soft">
          <div className="text-sm font-bold text-blue-800 text-center">
            {label}
          </div>
          <div className="text-xs text-blue-600 text-center font-medium">
            {daysCount === 5 ? 'Semana laboral' : 'Semana completa'}
          </div>
        </div>
        
        {/* Navigation Controls */}
        <div className="flex items-center justify-between gap-2 bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-white/30 shadow-soft">
          <Button 
            id="weeknav-prev-001"
            size="sm" 
            variant="ghost" 
            onClick={() => shift(-7)}
            className="flex-1 hover:bg-white/80 transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900"
          >
            ◀︎ Anterior
          </Button>
          
          <Button 
            id="weeknav-today-003"
            size="sm" 
            variant="outline" 
            onClick={() => onChange(getMonday(new Date()))}
            className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-soft transition-all duration-300 hover:scale-105 px-3"
          >
            📍 Hoy
          </Button>
          
          <Button 
            id="weeknav-next-002"
            size="sm" 
            variant="ghost" 
            onClick={() => shift(7)}
            className="flex-1 hover:bg-white/80 transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900"
          >
            Siguiente ▶︎
          </Button>
        </div>
      </div>

      {/* Desktop Layout (Horizontal) */}
      <div className="hidden md:flex items-center gap-3 bg-white/50 backdrop-blur-sm rounded-2xl p-2 border border-white/30 shadow-soft">
        <Button 
          id="weeknav-prev-001"
          size="sm" 
          variant="ghost" 
          onClick={() => shift(-7)}
          className="hover:bg-white/80 transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900"
        >
          ◀︎ Anterior
        </Button>
        
        <div className="px-4 py-2 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/30 shadow-inner-soft">
          <div className="text-sm font-bold text-blue-800 text-center min-w-[180px]">
            {label}
          </div>
          <div className="text-xs text-blue-600 text-center font-medium">
            {daysCount === 5 ? 'Semana laboral' : 'Semana completa'}
          </div>
        </div>
        
        <Button 
          id="weeknav-next-002"
          size="sm" 
          variant="ghost" 
          onClick={() => shift(7)}
          className="hover:bg-white/80 transition-all duration-200 hover:scale-105 text-gray-700 hover:text-gray-900"
        >
          Siguiente ▶︎
        </Button>
        
        <div className="w-px h-6 bg-gray-300/50"></div>
        
        <Button 
          id="weeknav-today-003"
          size="sm" 
          variant="outline" 
          onClick={() => onChange(getMonday(new Date()))}
          className="bg-gradient-to-r from-green-500 to-emerald-600 text-white border-0 hover:from-green-600 hover:to-emerald-700 shadow-soft transition-all duration-300 hover:scale-105"
        >
          📍 Hoy
        </Button>
      </div>
    </div>
  );
}