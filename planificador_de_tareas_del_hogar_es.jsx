import React, { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Trash2, Plus, Download, Upload, CalendarClock } from "lucide-react";

// --- Tipos y constantes ---
// Días base (semana laboral) y completos (con fin de semana)
const BASE_DAYS = ["Lun", "Mar", "Mié", "Jue", "Vie"] as const; // 0..4
const FULL_DAYS = [...BASE_DAYS, "Sáb", "Dom"] as const; // 0..6

const CATEGORIES = ["daily", "weekly", "monthly", "eventual", "urgent"] as const; // valores internos
const ASSIGNEES = ["ayudante", "esposa", "esposo", "compartido"] as const; // visibles en UI

type Chore = {
  id: string;
  title: string;
  day: number; // índice de día (0 = Lun)
  start: string; // "HH:MM"
  duration: number; // minutos
  category: typeof CATEGORIES[number];
  assignee: typeof ASSIGNEES[number];
  notes?: string;
};

type ChoreTemplate = {
  title: string;
  category: typeof CATEGORIES[number];
  duration: number; // minutos
  start?: string; // sugerencia HH:MM
  assignee?: typeof ASSIGNEES[number];
  notes?: string;
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

// Catálogo amplio de tareas (en español)
const CHORE_LIBRARY: ChoreTemplate[] = [
  // ——— Cocina
  { title: "Desincrustar cafetera", category: "monthly", duration: 30, start: "10:00", notes: "Vinagre + 2 ciclos de enjuague" },
  { title: "Desinfectar tablas (limón + sal)", category: "weekly", duration: 15 },
  { title: "Desengrasar filtros de campana", category: "monthly", duration: 30, notes: "Remojo agua caliente + bicarbonato" },
  { title: "Lavar a fondo el bote de basura", category: "weekly", duration: 20 },
  { title: "Inventario de despensa + tirar caducos", category: "weekly", duration: 25 },
  { title: "Descongelar congelador (si aplica)", category: "eventual", duration: 90 },
  { title: "Ciclo de limpieza del lavavajillas", category: "monthly", duration: 10, notes: "Limpiar empaques" },
  { title: "Revisar fugas bajo el fregadero", category: "monthly", duration: 20 },
  { title: "Limpiar parte superior de alacenas", category: "monthly", duration: 25 },
  { title: "Reordenar tuppers/tapas (sacar huérfanas)", category: "monthly", duration: 25 },
  { title: "Afilado básico de cuchillos", category: "monthly", duration: 20 },
  { title: "Cambiar esponja y sanitizar portaesponja", category: "weekly", duration: 10 },
  { title: "Bandeja del dispensador de agua del refri", category: "weekly", duration: 10 },
  { title: "Empaques de puerta del refrigerador", category: "monthly", duration: 10 },
  { title: "Desincrustar tetera eléctrica", category: "monthly", duration: 20 },
  { title: "Etiquetar/fechar sobras (auditoría)", category: "daily", duration: 5, start: "20:00" },
  { title: "Reset de especiero (alfabetizar + rellenar)", category: "monthly", duration: 25 },
  { title: "Limpiar microondas (ventilas + plato)", category: "weekly", duration: 10 },
  { title: "Remojo de parrillas del horno (tina)", category: "eventual", duration: 120 },
  { title: "Plan de comidas + lista de súper", category: "weekly", duration: 30 },
  // ——— Baños
  { title: "Lavar forro de cortina de baño", category: "monthly", duration: 25 },
  { title: "Tallado de juntas/grout (selectivo)", category: "monthly", duration: 40 },
  { title: "Desincrustar regadera (bolsa con vinagre)", category: "monthly", duration: 20 },
  { title: "Limpiar trampa de cabello del desagüe", category: "weekly", duration: 10 },
  { title: "Reabastecer canasta (papel, jabón, algodón)", category: "weekly", duration: 10 },
  { title: "Lavar tapetes de baño", category: "weekly", duration: 30 },
  { title: "Limpiar rejilla del extractor", category: "monthly", duration: 10 },
  { title: "Revisar silicón/moho y tratar", category: "monthly", duration: 20 },
  { title: "Pulido del espejo sin rayas", category: "weekly", duration: 10 },
  { title: "Revisión de cabezales de cepillo", category: "monthly", duration: 5 },
  // ——— Lavandería / Servicio
  { title: "Limpiar trampa de pelusa de secadora", category: "daily", duration: 2, start: "18:00" },
  { title: "Aspirar ducto externo de secadora", category: "monthly", duration: 20 },
  { title: "Ciclo de limpieza de tina (lavadora)", category: "monthly", duration: 10 },
  { title: "Clasificar calcetines perdidos y donar", category: "monthly", duration: 10 },
  { title: "Pretratados de manchas (barrido)", category: "weekly", duration: 10 },
  { title: "Girar ganchos al revés (auditoría clóset)", category: "monthly", duration: 20 },
  { title: "Bolsa de donación del guardarropa", category: "monthly", duration: 20 },
  { title: "Maratón de planchado", category: "weekly", duration: 30 },
  // ——— Recámaras
  { title: "Girar/voltear colchones", category: "eventual", duration: 20 },
  { title: "Lavar almohadas (según etiqueta)", category: "eventual", duration: 90 },
  { title: "Polvo bajo cama + orillas", category: "monthly", duration: 25 },
  { title: "Ordenar cables de buró", category: "monthly", duration: 10 },
  { title: "Limpiar humidificador + filtro", category: "weekly", duration: 15 },
  { title: "Sanitizar contenedores de juguetes", category: "weekly", duration: 20 },
  { title: "Mini depuración de librero", category: "monthly", duration: 15 },
  // ——— Sala / Áreas comunes
  { title: "Sanitizar controles y gamepads", category: "weekly", duration: 10 },
  { title: "Aspirar y voltear cojines del sofá", category: "weekly", duration: 20 },
  { title: "Gestionar cables con cinchos", category: "monthly", duration: 20 },
  { title: "Quitar polvo a hojas de plantas", category: "weekly", duration: 15 },
  { title: "Cambiar filtro de purificador de aire", category: "monthly", duration: 10 },
  { title: "Reset de juegos de mesa", category: "monthly", duration: 15 },
  { title: "Cepillar rieles de ventana", category: "monthly", duration: 20 },
  // ——— Entrada / Oficina
  { title: "Desinfectar chapa y timbre", category: "weekly", duration: 5 },
  { title: "Purgar zapatero + emparejar", category: "monthly", duration: 15 },
  { title: "Secar paraguas + limpiar base", category: "monthly", duration: 10 },
  { title: "Triage de correo (in/out)", category: "daily", duration: 5 },
  { title: "Teclado y mouse: limpieza profunda", category: "weekly", duration: 15 },
  { title: "Sanitizar pantallas de teléfonos", category: "daily", duration: 3 },
  { title: "Etiquetar cables y cargadores", category: "monthly", duration: 20 },
  { title: "Probar backup y quitar polvo", category: "monthly", duration: 15 },
  { title: "Vaciar y aceitar trituradora", category: "monthly", duration: 10 },
  { title: "Escanear a nube: pila de papeles", category: "weekly", duration: 20 },
  // ——— Toda la casa / Seguridad / Utilidades
  { title: "Probar alarmas de humo/CO", category: "monthly", duration: 10 },
  { title: "Cambiar filtro de minisplit", category: "monthly", duration: 15 },
  { title: "Revisar sal del suavizador", category: "monthly", duration: 10 },
  { title: "Etiquetar tablero eléctrico", category: "eventual", duration: 40 },
  { title: "Revisar trampas de plagas", category: "monthly", duration: 15 },
  { title: "Reabastecer botiquín", category: "monthly", duration: 10 },
  { title: "Caducidades de medicinas", category: "monthly", duration: 15 },
  { title: "Cambiar pilas de linternas", category: "monthly", duration: 10 },
  { title: "Auditoría de kit de emergencia", category: "eventual", duration: 30 },
  { title: "Revisar presión del extintor", category: "monthly", duration: 5 },
  { title: "Purgar químicos viejos", category: "eventual", duration: 25 },
  { title: "Aceitar bisagras", category: "monthly", duration: 15 },
  { title: "Revisar sellos de ventanas", category: "monthly", duration: 20 },
  { title: "Apretar soportes de cortinas", category: "monthly", duration: 15 },
  { title: "Limpiar filtro del lavavajillas", category: "monthly", duration: 10 },
  { title: "Aspirar serpentines del refri", category: "eventual", duration: 25 },
  { title: "Purgar fabricador de hielo / filtro", category: "eventual", duration: 20 },
  { title: "Reiniciar router + firmware", category: "monthly", duration: 10 },
  { title: "Actualizar firmware de smart home", category: "monthly", duration: 20 },
  { title: "Revisión cámaras/timbre", category: "monthly", duration: 15 },
  { title: "Correr agua en coladeras poco usadas", category: "monthly", duration: 5 },
  { title: "Purgar calentador (parcial)", category: "eventual", duration: 60 },
  { title: "Calibrar termómetro del horno", category: "eventual", duration: 20 },
  { title: "Probar contactos GFCI", category: "eventual", duration: 20 },
  // ——— Exterior / Auto
  { title: "Barrer patio y entrada", category: "weekly", duration: 15 },
  { title: "Hidrolavado patio/cochera (estacional)", category: "eventual", duration: 120 },
  { title: "Limpiar y curar parrilla", category: "weekly", duration: 20 },
  { title: "Revisar nivel de gas/propano", category: "monthly", duration: 10 },
  { title: "Malla de alberca + prueba química", category: "weekly", duration: 20 },
  { title: "Revisión visual de canaletas", category: "eventual", duration: 30 },
  { title: "Aceitar herramientas de jardín", category: "monthly", duration: 15 },
  { title: "Cambiar focos exteriores + limpiar lámparas", category: "monthly", duration: 15 },
  { title: "Tratar manchas de aceite en cochera", category: "eventual", duration: 30 },
  { title: "Lavado de auto + aspirado interior", category: "monthly", duration: 45 },
  { title: "Revisión de presión y fluidos del auto", category: "monthly", duration: 15 },
  { title: "Rellenar líquido limpiaparabrisas", category: "monthly", duration: 10 },
  // ——— Mascotas
  { title: "Arenero: limpieza profunda + relleno", category: "weekly", duration: 20 },
  { title: "Lavar cama y mantas de mascota", category: "weekly", duration: 40 },
  { title: "Cepillar mascota (retirar pelo)", category: "weekly", duration: 15 },
  { title: "Lavar platos de comida/agua", category: "daily", duration: 5 },
  { title: "Limpiar piso del área de alimento", category: "daily", duration: 3 },
  { title: "Recordatorio antipulgas/garrapatas", category: "monthly", duration: 5 },
  { title: "Limpiar contenedor de croquetas", category: "monthly", duration: 10 },
  { title: "Reponer bolsas/pads", category: "weekly", duration: 5 },
  // ——— Niños / Familia
  { title: "Reset de mochila (papeles fuera)", category: "daily", duration: 5, start: "19:00" },
  { title: "Lavar loncheras y geles", category: "daily", duration: 10 },
  { title: "Etiquetar uniformes/útiles", category: "monthly", duration: 15 },
  { title: "Reset de caddy de tarea", category: "weekly", duration: 10 },
  { title: "Depurar cajón de arte + fotos", category: "monthly", duration: 20 },
  { title: "Cambiar pilas de juguetes ruidosos", category: "monthly", duration: 10 },
  { title: "Silla infantil: migas + correas", category: "monthly", duration: 20 },
  { title: "Sanitizar periquera/trona", category: "daily", duration: 5 },
  // ——— Visitas / Eventos
  { title: "Lavar y montar blancos de invitados", category: "eventual", duration: 45 },
  { title: "Reabastecer baño de visitas", category: "eventual", duration: 15 },
  { title: "Inventario de adornos + etiquetado", category: "eventual", duration: 60 },
  { title: "Checklist de fiesta (vasos/platos)", category: "eventual", duration: 20 },
];

// Colores por categoría
const CATEGORY_COLORS: Record<Chore["category"], string> = {
  daily: "bg-emerald-500/70 border-emerald-600",
  weekly: "bg-sky-500/70 border-sky-600",
  monthly: "bg-violet-500/70 border-violet-600",
  eventual: "bg-amber-500/70 border-amber-600",
  urgent: "bg-rose-500/80 border-rose-600",
};

// Horas y layout
const HOUR_START = 7;
const HOUR_END = 21; // exclusivo
const HOURS = Array.from({ length: HOUR_END - HOUR_START + 1 }, (_, i) => HOUR_START + i);
const SLOT_HEIGHT = 56; // px por hora
const DRAG_STEP_MIN = 5; // minutos de ajuste al arrastrar
const MIN_DURATION_MIN = 5; // duración mínima
const RESIZE_HANDLE_H = 8; // px del asa inferior

function timeToMinutes(t: string) {
  const [h, m] = t.split(":").map(Number);
  return h * 60 + m;
}
function minutesToTime(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}
function clampToRange(t: string) {
  const mins = Math.max(
    HOUR_START * 60,
    Math.min((HOUR_END - 1) * 60, timeToMinutes(t))
  );
  return minutesToTime(mins);
}

// Semillas por defecto (sólo semana laboral)
const DEFAULTS: Chore[] = [
  { id: uid(), title: "Tender camas", day: 0, start: "07:30", duration: 20, category: "daily", assignee: "ayudante" },
  { id: uid(), title: "Barrer áreas de alto tránsito", day: 0, start: "09:30", duration: 30, category: "daily", assignee: "ayudante" },
  { id: uid(), title: "Poner la mesa para la comida", day: 0, start: "14:00", duration: 15, category: "daily", assignee: "ayudante", notes: "Apuntar a las 2 pm" },
];

// Storage local
const STORAGE_KEY = "chore-planner-es-v1";
function useLocalStorageState<T>(key: string, initial: T) {
  const [state, setState] = useState<T>(() => {
    try {
      const raw = localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : initial;
    } catch {
      return initial;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(state));
    } catch {}
  }, [key, state]);
  return [state, setState] as const;
}

export default function PlanificadorTareas() {
  const [chores, setChores] = useLocalStorageState<Chore[]>(
    STORAGE_KEY,
    seedWeek(DEFAULTS, BASE_DAYS.length)
  );
  const [filterCat, setFilterCat] = useState<string>("all");
  const [filterAssignee, setFilterAssignee] = useState<string>("all");
  const [activeWeekStart, setActiveWeekStart] = useState(getMonday(new Date()));
  const [view, setView] = useState<"week" | "day">("week");
  const [dayIndex, setDayIndex] = useState<number>(0);
  const [showWeekend, setShowWeekend] = useState(false); // única declaración

  // Días visibles según el toggle
  const DAYS_UI = useMemo(
    () => (showWeekend ? [...FULL_DAYS] : [...BASE_DAYS]),
    [showWeekend]
  );

  // TESTS rápidos (unit-ish) para utilidades clave
  useEffect(() => {
    runDevTests();
  }, []);

  const filtered = useMemo(() => {
    return chores.filter(
      (c) =>
        (filterCat === "all" || c.category === filterCat) &&
        (filterAssignee === "all" || c.assignee === filterAssignee)
    );
  }, [chores, filterCat, filterAssignee]);

  const conflictIds = useMemo(() => getConflictIds(chores), [chores]);

  function addChore(c: Omit<Chore, "id">) {
    setChores((prev) => [...prev, { ...c, id: uid() }]);
  }
  function updateChore(id: string, patch: Partial<Chore>) {
    setChores((prev) => prev.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }
  function deleteChore(id: string) {
    setChores((prev) => prev.filter((c) => c.id !== id));
  }
  function clearAll() {
    if (confirm("¿Vaciar todas las tareas?")) setChores([]);
  }

  function exportJSON() {
    const blob = new Blob([JSON.stringify(chores, null, 2)], {
      type: "application/json",
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tareas.json";
    a.click();
    URL.revokeObjectURL(url);
  }
  function importJSON(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const parsed = JSON.parse(String(reader.result));
        if (Array.isArray(parsed)) setChores(parsed);
      } catch {
        alert("Archivo JSON inválido");
      }
    };
    reader.readAsText(file);
  }

  const weekDates = useMemo(
    () => getWeekDates(activeWeekStart, DAYS_UI.length),
    [activeWeekStart, DAYS_UI]
  );

  return (
    <div className="w-full min-h-screen p-4 md:p-8 bg-neutral-50">
      <header className="mb-6 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
        <div className="flex items-center gap-3">
          <CalendarClock className="h-6 w-6" />
          <h1 className="text-2xl md:text-3xl font-semibold">
            Planificador Semanal de Tareas del Hogar
          </h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <QuickAddFromTemplate
            onAdd={addChore}
            defaultDay={view === "day" ? dayIndex : 0}
            days={DAYS_UI}
          />
          <TemplateButton
            days={DAYS_UI}
            onInsert={(items) => setChores((prev) => [...prev, ...items])}
          />
          <Button variant="secondary" onClick={exportJSON} className="gap-2">
            <Download className="h-4 w-4" />
            Exportar
          </Button>
          <label className="inline-flex items-center gap-2 px-3 py-2 rounded-xl border cursor-pointer bg-white hover:bg-neutral-50 text-sm">
            <Upload className="h-4 w-4" /> Importar
            <input
              type="file"
              accept="application/json"
              className="hidden"
              onChange={importJSON}
            />
          </label>
          <Button variant="destructive" onClick={clearAll} className="gap-2">
            <Trash2 className="h-4 w-4" />
            Vaciar
          </Button>
        </div>
      </header>

      <Card className="mb-4 shadow-sm">
        <CardContent className="p-4 flex flex-col md:flex-row gap-3 md:items-center md:justify-between">
          <div className="flex gap-2 items-center">
            <Label className="mr-2">Categoría</Label>
            <Select value={filterCat} onValueChange={setFilterCat}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {labelCat(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <Label className="mr-2">Responsable</Label>
            <Select value={filterAssignee} onValueChange={setFilterAssignee}>
              <SelectTrigger className="w-40">
                <SelectValue placeholder="Todos" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos</SelectItem>
                {ASSIGNEES.map((a) => (
                  <SelectItem key={a} value={a}>
                    {labelAssignee(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2 items-center">
            <WeekNav
              active={activeWeekStart}
              onChange={setActiveWeekStart}
              daysCount={DAYS_UI.length}
            />
          </div>
          <div className="flex gap-2 items-center">
            <div className="inline-flex rounded-xl border bg-white">
              <Button
                size="sm"
                variant={view === "week" ? "default" : "ghost"}
                onClick={() => setView("week")}
              >
                Semana
              </Button>
              <Button
                size="sm"
                variant={view === "day" ? "default" : "ghost"}
                onClick={() => setView("day")}
              >
                Día
              </Button>
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label className="inline-flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                className="h-4 w-4"
                checked={showWeekend}
                onChange={(e) => setShowWeekend(e.target.checked)}
              />
              Mostrar fin de semana
            </label>
          </div>
          <AddChoreDialog onAdd={addChore} />
        </CardContent>
      </Card>

      {/* Grilla semanal */}
      {view === "week" && (
        <div className="grid grid-cols-12 gap-3">
          {/* Horas */}
          <div className="col-span-2 md:col-span-1">
            <div
              className="relative"
              style={{ height: (HOUR_END - HOUR_START) * SLOT_HEIGHT }}
            >
              {HOURS.slice(0, HOUR_END - HOUR_START).map((h, idx) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 text-xs text-neutral-500"
                  style={{ top: idx * SLOT_HEIGHT }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>
          </div>
          {/* Días */}
          {DAYS_UI.map((d, dayIdx) => (
            <div
              key={d}
              className={`col-span-10 ${
                DAYS_UI.length === 5
                  ? "md:col-span-[calc((11)/5)]"
                  : "md:col-span-[calc((11)/7)]"
              }`}
            >
              <Card className="overflow-hidden">
                <CardHeader className="py-3 bg-white/70">
                  <CardTitle className="text-base flex items-center justify-between">
                    <span>
                      {d}{" "}
                      <span className="text-xs text-neutral-500">
                        {fmtDate(weekDates[dayIdx])}
                      </span>
                    </span>
                    <AddChoreDialog
                      small
                      defaultDay={dayIdx}
                      onAdd={addChore}
                    />
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-0">
                  <div
                    data-role="day-canvas"
                    data-day-idx={dayIdx}
                    className="relative border-t"
                    style={{ height: (HOUR_END - HOUR_START) * SLOT_HEIGHT }}
                  >
                    {HOURS.slice(0, HOUR_END - HOUR_START).map((h, idx) => (
                      <div
                        key={h}
                        className="absolute left-0 right-0 border-t border-dashed border-neutral-200"
                        style={{ top: idx * SLOT_HEIGHT }}
                      />
                    ))}
                    {filtered
                      .filter((c) => c.day === dayIdx)
                      .sort(
                        (a, b) =>
                          timeToMinutes(a.start) - timeToMinutes(b.start)
                      )
                      .map((c) => (
                        <ChoreBlock
                          key={`${c.id}-${c.day}-${c.start}-${c.duration}`}
                          chore={c}
                          hasConflict={conflictIds.has(c.id)}
                          onUpdate={updateChore}
                          onDelete={deleteChore}
                        />
                      ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
      )}

      {/* Vista día */}
      {view === "day" && (
        <div className="grid grid-cols-12 gap-3">
          {/* Horas */}
          <div className="col-span-2 md:col-span-1">
            <div
              className="relative"
              style={{ height: (HOUR_END - HOUR_START) * SLOT_HEIGHT }}
            >
              {HOURS.slice(0, HOUR_END - HOUR_START).map((h, idx) => (
                <div
                  key={h}
                  className="absolute left-0 right-0 text-xs text-neutral-500"
                  style={{ top: idx * SLOT_HEIGHT }}
                >
                  {String(h).padStart(2, "0")}:00
                </div>
              ))}
            </div>
          </div>
          <div
            className={`col-span-10 ${
              DAYS_UI.length === 5
                ? "md:col-span-[calc((11)/5)]"
                : "md:col-span-[calc((11)/7)]"
            }`}
          >
            <Card className="overflow-hidden">
              <CardHeader className="py-3 bg-white/70">
                <CardTitle className="text-base flex items-center justify-between">
                  <span>
                    {DAYS_UI[dayIndex]} {" "}
                    <span className="text-xs text-neutral-500">
                      {fmtDate(weekDates[dayIndex])}
                    </span>
                  </span>
                  <div className="flex items-center gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDayIndex((d) =>
                          d === 0 ? DAYS_UI.length - 1 : d - 1
                        )
                      }
                    >
                      ◀︎ Ant.
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() =>
                        setDayIndex((d) =>
                          d === DAYS_UI.length - 1 ? 0 : d + 1
                        )
                      }
                    >
                      Sig. ▶︎
                    </Button>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => {
                        const now = new Date();
                        setActiveWeekStart(getMonday(now));
                        setDayIndex(
                          Math.min(((now.getDay() + 6) % 7) as number, DAYS_UI.length - 1)
                        );
                      }}
                    >
                      Hoy
                    </Button>
                    <AddChoreDialog
                      small
                      defaultDay={dayIndex}
                      onAdd={addChore}
                    />
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent className="p-0">
                <div
                  data-role="day-canvas"
                  data-day-idx={dayIndex}
                  className="relative border-t"
                  style={{ height: (HOUR_END - HOUR_START) * SLOT_HEIGHT }}
                >
                  {HOURS.slice(0, HOUR_END - HOUR_START).map((h, idx) => (
                    <div
                      key={h}
                      className="absolute left-0 right-0 border-t border-dashed border-neutral-200"
                      style={{ top: idx * SLOT_HEIGHT }}
                    />
                  ))}
                  {filtered
                    .filter((c) => c.day === dayIndex)
                    .sort(
                      (a, b) => timeToMinutes(a.start) - timeToMinutes(b.start)
                    )
                    .map((c) => (
                      <ChoreBlock
                        key={`${c.id}-${c.day}-${c.start}-${c.duration}`}
                        chore={c}
                        hasConflict={conflictIds.has(c.id)}
                        onUpdate={updateChore}
                        onDelete={deleteChore}
                      />
                    ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      <footer className="mt-6 text-xs text-neutral-500">
        Tip: Usa **Semana/Día** para cambiar la vista. En Día, navega con Ant./Sig. y agrega tareas con el botón +. Todo se guarda en tu navegador.
      </footer>
    </div>
  );
}

function ChoreBlock({
  chore,
  hasConflict,
  onUpdate,
  onDelete,
}: {
  chore: Chore;
  hasConflict: boolean;
  onUpdate: (id: string, p: Partial<Chore>) => void;
  onDelete: (id: string) => void;
}) {
  const top = (timeToMinutes(chore.start) - HOUR_START * 60) * (SLOT_HEIGHT / 60);
  const height = Math.max(36, (chore.duration / 60) * SLOT_HEIGHT);
  const dragInfo = useRef<{ grabOffset: number } | null>(null);
  const resizeInfo = useRef<
    | { anchorTopPx: number; startMins: number; initialDuration: number; canvas: HTMLElement }
    | null
  >(null);
  const wasDragging = useRef(false);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    const canvas = target.closest('[data-role="day-canvas"]') as HTMLElement | null;
    if (!canvas) return;
    e.preventDefault();
    // @ts-ignore setPointerCapture may not exist in SSR
    target.setPointerCapture?.(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const currentTop = (timeToMinutes(chore.start) - HOUR_START * 60) * (SLOT_HEIGHT / 60);
    dragInfo.current = { grabOffset: e.clientY - (rect.top + currentTop) };
    wasDragging.current = false;

    function onMove(ev: PointerEvent) {
      if (!dragInfo.current) return;
      // Detectar sobre qué columna/día estamos
      const els = document.elementsFromPoint(ev.clientX, ev.clientY);
      const overCanvas =
        (els.find(
          (el) => (el as HTMLElement).dataset && (el as HTMLElement).dataset.role === "day-canvas"
        ) as HTMLElement) || canvas;
      const r = overCanvas.getBoundingClientRect();

      let newY = ev.clientY - r.top - dragInfo.current.grabOffset;
      const maxY = (HOUR_END - HOUR_START) * SLOT_HEIGHT - height;
      newY = Math.max(0, Math.min(maxY, newY));

      // Convertir a minutos con snap
      let minsFromTop = (newY / SLOT_HEIGHT) * 60;
      minsFromTop = Math.round(minsFromTop / DRAG_STEP_MIN) * DRAG_STEP_MIN;
      const newStartMins = HOUR_START * 60 + minsFromTop;
      const newStart = minutesToTime(newStartMins);

      const ds = (overCanvas as HTMLElement).dataset.dayIdx;
      const newDay = ds ? parseInt(ds, 10) : chore.day;

      if (newStart !== chore.start || newDay !== chore.day) {
        wasDragging.current = true;
        onUpdate(chore.id, { start: newStart, day: newDay });
      }
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp as any);
      dragInfo.current = null;
      document.body.classList.remove("select-none", "cursor-grabbing");
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp as any);
    document.body.classList.add("select-none", "cursor-grabbing");
  }

  function handleResizeDown(e: React.PointerEvent<HTMLDivElement>) {
    e.stopPropagation();
    const target = e.currentTarget.parentElement as HTMLElement;
    const canvas = target.closest('[data-role="day-canvas"]') as HTMLElement | null;
    if (!canvas) return;
    // @ts-ignore
    target.setPointerCapture?.(e.pointerId);
    const rect = canvas.getBoundingClientRect();
    const blockRect = target.getBoundingClientRect();
    const anchorTopPx = blockRect.top - rect.top;
    const startMins = timeToMinutes(chore.start);
    resizeInfo.current = {
      anchorTopPx,
      startMins,
      initialDuration: chore.duration,
      canvas,
    };
    wasDragging.current = false;

    function onMove(ev: PointerEvent) {
      if (!resizeInfo.current) return;
      const { anchorTopPx, startMins, canvas } = resizeInfo.current;
      const r = canvas.getBoundingClientRect();
      let newBottom = ev.clientY - r.top;
      const maxBottom = (HOUR_END - HOUR_START) * SLOT_HEIGHT;
      const minBottom = anchorTopPx + (MIN_DURATION_MIN / 60) * SLOT_HEIGHT;
      newBottom = Math.max(minBottom, Math.min(maxBottom, newBottom));

      let minsFromTop = (newBottom / SLOT_HEIGHT) * 60;
      minsFromTop = Math.round(minsFromTop / DRAG_STEP_MIN) * DRAG_STEP_MIN;
      const newEndMins = HOUR_START * 60 + minsFromTop;
      let newDuration = newEndMins - startMins;
      if (newDuration < MIN_DURATION_MIN) newDuration = MIN_DURATION_MIN;

      if (newDuration !== chore.duration) {
        wasDragging.current = true;
        onUpdate(chore.id, { duration: newDuration });
      }
    }

    function onUp() {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      window.removeEventListener("pointercancel", onUp);
      window.removeEventListener("blur", onUp as any);
      resizeInfo.current = null;
      document.body.classList.remove("select-none", "cursor-ns-resize");
    }

    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    window.addEventListener("pointercancel", onUp);
    window.addEventListener("blur", onUp as any);
    document.body.classList.add("select-none", "cursor-ns-resize");
  }

  function handleClick(e: React.MouseEvent<HTMLDivElement>) {
    if (wasDragging.current) {
      e.preventDefault();
      e.stopPropagation();
      wasDragging.current = false;
    }
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        <div
          onPointerDown={handlePointerDown}
          onClick={handleClick}
          className={`absolute left-2 right-2 border text-white rounded-xl p-2 shadow-sm cursor-grab active:cursor-grabbing hover:brightness-105 ${CATEGORY_COLORS[chore.category]} ${hasConflict ? "ring-2 ring-rose-500 border-rose-600" : ""}`}
          style={{ top, height, touchAction: "none" }}
          title={`${chore.title} · ${chore.start}`}
        >
          <div className="text-xs font-semibold leading-tight">{chore.title}</div>
          <div className="text-[10px] opacity-90">
            {chore.start} · {chore.duration}m · {labelAssignee(chore.assignee)}
          </div>
          {hasConflict && (
            <div className="absolute -top-2 right-2 text-[10px] bg-rose-600 text-white px-2 py-[2px] rounded">
              ⚠ Choque
            </div>
          )}
          <div
            onPointerDown={handleResizeDown}
            onClick={(e) => e.stopPropagation()}
            className="absolute bottom-0 left-1 right-1"
            style={{ height: RESIZE_HANDLE_H }}
          >
            <div className="h-full w-full rounded-b-lg bg-white/40 backdrop-blur-[1px] cursor-ns-resize" />
          </div>
        </div>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>
        <ChoreForm
          initial={chore}
          days={FULL_DAYS as unknown as string[]}
          onSubmit={(values) => onUpdate(chore.id, values)}
          onDelete={() => onDelete(chore.id)}
        />
      </DialogContent>
    </Dialog>
  );
}

function QuickAddFromTemplate({
  onAdd,
  defaultDay = 0,
  days,
}: {
  onAdd: (c: Omit<Chore, "id">) => void;
  defaultDay?: number;
  days: readonly string[];
}) {
  const [templateKey, setTemplateKey] = useState<string>("");
  const [day, setDay] = useState<number>(defaultDay);
  useEffect(() => setDay(defaultDay), [defaultDay]);
  const [time, setTime] = useState<string>("09:00");
  const [assignee, setAssignee] = useState<typeof ASSIGNEES[number]>("ayudante");

  function add() {
    const t = CHORE_LIBRARY[Number(templateKey)];
    if (!t) return;
    onAdd({
      title: t.title,
      day,
      start: clampToRange(t.start ?? time),
      duration: t.duration,
      category: t.category,
      assignee,
      notes: t.notes ?? "",
    });
  }

  return (
    <div className="flex flex-wrap gap-2 items-center">
      <Select value={templateKey} onValueChange={setTemplateKey}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder="Agregar desde catálogo" />
        </SelectTrigger>
        <SelectContent className="max-h-80">
          {CHORE_LIBRARY.map((t, idx) => (
            <SelectItem key={idx} value={String(idx)}>
              {t.title} · {labelCat(t.category)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={String(day)} onValueChange={(v) => setDay(Number(v))}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Día" />
        </SelectTrigger>
        <SelectContent>
          {Array.from(days).map((d, i) => (
            <SelectItem key={d} value={String(i)}>
              {d}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="w-28"
      />
      <Select value={assignee} onValueChange={(v) => setAssignee(v as any)}>
        <SelectTrigger className="w-28">
          <SelectValue placeholder="Responsable" />
        </SelectTrigger>
        <SelectContent>
          {ASSIGNEES.map((a) => (
            <SelectItem key={a} value={a}>
              {labelAssignee(a)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button onClick={add} disabled={templateKey === ""}>
        Agregar
      </Button>
    </div>
  );
}

function AddChoreDialog({
  onAdd,
  defaultDay,
  small,
}: {
  onAdd: (c: Omit<Chore, "id">) => void;
  defaultDay?: number;
  small?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const trigger = (
    <Button size={small ? "sm" : "default"} className="gap-2" onClick={() => setOpen(true)}>
      <Plus className="h-4 w-4" />
      {small ? "Agregar" : "Agregar tarea"}
    </Button>
  );
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nueva tarea</DialogTitle>
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
          days={FULL_DAYS as unknown as string[]}
          onSubmit={(values) => {
            onAdd(values);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
  );
}

function ChoreForm({
  initial,
  days,
  onSubmit,
  onDelete,
}: {
  initial: Omit<Chore, "id"> | Chore;
  days: readonly string[];
  onSubmit: (v: Omit<Chore, "id">) => void;
  onDelete?: () => void;
}) {
  const [form, setForm] = useState<Omit<Chore, "id">>({ ...initial });
  function set<K extends keyof Omit<Chore, "id">>(
    key: K,
    value: Omit<Chore, "id">[K]
  ) {
    setForm((f) => ({ ...f, [key]: value }));
  }

  // Si el día actual no existe en la vista (p. ej., dom oculto), lo dejamos tal cual para no mutar datos.

  return (
    <form
      className="space-y-3"
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit(form);
      }}
    >
      <div className="grid grid-cols-1 gap-3">
        <div>
          <Label>Catálogo (opcional)</Label>
          <Select
            onValueChange={(idx) => {
              const t = CHORE_LIBRARY[Number(idx)];
              if (!t) return;
              setForm((f) => ({
                ...f,
                title: t.title,
                start: clampToRange(t.start ?? f.start),
                duration: t.duration,
                category: t.category,
                assignee: t.assignee ?? f.assignee,
              }));
            }}
          >
            <SelectTrigger>
              <SelectValue placeholder="Seleccionar del catálogo" />
            </SelectTrigger>
            <SelectContent className="max-h-80">
              {CHORE_LIBRARY.map((t, i) => (
                <SelectItem key={i} value={String(i)}>
                  {t.title} · {labelCat(t.category)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label>Título</Label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            required
            placeholder="ej., Poner la mesa para la comida"
          />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Día</Label>
            <Select
              value={String(form.day)}
              onValueChange={(v) => set("day", Number(v))}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from(days).map((d, i) => (
                  <SelectItem key={d} value={String(i)}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Inicio</Label>
            <Input
              type="time"
              value={form.start}
              onChange={(e) => set("start", clampToRange(e.target.value))}
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Duración (min)</Label>
            <Input
              type="number"
              min={5}
              step={5}
              value={form.duration}
              onChange={(e) => set("duration", Number(e.target.value))}
            />
          </div>
          <div>
            <Label>Responsable</Label>
            <Select
              value={form.assignee}
              onValueChange={(v) => set("assignee", v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ASSIGNEES.map((a) => (
                  <SelectItem key={a} value={a}>
                    {labelAssignee(a)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <Label>Categoría</Label>
            <Select
              value={form.category}
              onValueChange={(v) => set("category", v as any)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CATEGORIES.map((c) => (
                  <SelectItem key={c} value={c}>
                    {labelCat(c)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label>Notas</Label>
            <Input
              value={form.notes ?? ""}
              onChange={(e) => set("notes", e.target.value)}
              placeholder="Opcional"
            />
          </div>
        </div>
      </div>
      <DialogFooter className="justify-between">
        {onDelete && (
          <Button type="button" variant="destructive" onClick={onDelete}>
            Eliminar
          </Button>
        )}
        <div className="ml-auto flex gap-2">
          <Button type="submit">Guardar</Button>
        </div>
      </DialogFooter>
    </form>
  );
}

function TemplateButton({
  onInsert,
  days,
}: {
  onInsert: (items: Chore[]) => void;
  days: readonly string[];
}) {
  function addDailyBasics() {
    const items: Chore[] = [
      {
        id: uid(),
        title: "Tender camas",
        day: 0,
        start: "07:30",
        duration: 20,
        category: "daily",
        assignee: "ayudante",
      },
      {
        id: uid(),
        title: "Lavar trastes",
        day: 0,
        start: "13:30",
        duration: 30,
        category: "daily",
        assignee: "ayudante",
      },
      {
        id: uid(),
        title: "Limpiar barras/mesas de cocina",
        day: 0,
        start: "13:00",
        duration: 15,
        category: "daily",
        assignee: "ayudante",
      },
      {
        id: uid(),
        title: "Poner la mesa para la comida",
        day: 0,
        start: "14:00",
        duration: 15,
        category: "daily",
        assignee: "ayudante",
        notes: "Apuntar a las 2 pm",
      },
      {
        id: uid(),
        title: "Barrer áreas de alto tránsito",
        day: 0,
        start: "17:00",
        duration: 20,
        category: "daily",
        assignee: "ayudante",
      },
    ];
    const spread = Array.from(days)
      .map((_, i) => items.map((c) => ({ ...c, id: uid(), day: i })))
      .flat();
    onInsert(spread);
  }
  return (
    <Button variant="outline" onClick={addDailyBasics}>
      Insertar plantilla diaria
    </Button>
  );
}

function WeekNav({
  active,
  onChange,
  daysCount,
}: {
  active: Date;
  onChange: (d: Date) => void;
  daysCount: number;
}) {
  function shift(days: number) {
    const d = new Date(active);
    d.setDate(d.getDate() + days);
    onChange(getMonday(d));
  }
  const label = `${active.toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
  })} — ${new Date(active.getTime() + (daysCount - 1) * 86400000).toLocaleDateString("es-MX", {
    month: "short",
    day: "numeric",
  })}`;
  return (
    <div className="flex items-center gap-2">
      <Button size="sm" variant="outline" onClick={() => shift(-7)}>
        ◀︎ Ant.
      </Button>
      <div className="text-sm font-medium min-w-[160px] text-center">
        {label}
      </div>
      <Button size="sm" variant="outline" onClick={() => shift(7)}>
        Sig. ▶︎
      </Button>
      <Button size="sm" variant="ghost" onClick={() => onChange(getMonday(new Date()))}>
        Hoy
      </Button>
    </div>
  );
}

// Utilidades
function getMonday(d: Date) {
  const date = new Date(d);
  const day = (date.getDay() + 6) % 7; // 0 = Lun
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}
function getWeekDates(monday: Date, len: number = BASE_DAYS.length) {
  return Array.from({ length: len }, (_, i) => new Date(monday.getTime() + i * 86400000));
}
function fmtDate(d: Date) {
  return d.toLocaleDateString("es-MX", { month: "short", day: "numeric" });
}
function seedWeek(seed: Chore[], daysLen: number) {
  const out: Chore[] = [];
  for (let day = 0; day < daysLen; day++) {
    for (const c of seed) out.push({ ...c, id: uid(), day });
  }
  return out;
}
function labelCat(c: Chore["category"]) {
  return c === "daily"
    ? "Diaria"
    : c === "weekly"
    ? "Semanal"
    : c === "monthly"
    ? "Mensual"
    : c === "urgent"
    ? "Urgente"
    : "Eventual";
}
function labelAssignee(a: typeof ASSIGNEES[number]) {
  return a === "ayudante"
    ? "Ayudante"
    : a === "esposa"
    ? "Esposa"
    : a === "esposo"
    ? "Esposo"
    : "Compartido";
}

function getConflictIds(chores: Chore[]): Set<string> {
  const ids = new Set<string>();
  const byDay: Record<number, Chore[]> = {};
  for (const c of chores) {
    (byDay[c.day] ||= []).push(c);
  }
  for (const key in byDay) {
    const arr = byDay[key]
      .slice()
      .sort((a, b) => timeToMinutes(a.start) - timeToMinutes(b.start));
    for (let i = 0; i < arr.length; i++) {
      const a = arr[i];
      const aStart = timeToMinutes(a.start);
      const aEnd = aStart + a.duration;
      for (let j = i + 1; j < arr.length; j++) {
        const b = arr[j];
        const bStart = timeToMinutes(b.start);
        const bEnd = bStart + b.duration;
        if (bStart >= aEnd) break; // ya no hay traslape con 'a'
        if (aStart < bEnd && bStart < aEnd) {
          ids.add(a.id);
          ids.add(b.id);
        }
      }
    }
  }
  return ids;
}

// --- Pruebas simples (auto-check en consola) ---
function runDevTests() {
  try {
    console.assert(timeToMinutes("07:30") === 450, "timeToMinutes 07:30");
    console.assert(minutesToTime(450) === "07:30", "minutesToTime 450");
    console.assert(clampToRange("06:00") === "07:00", "clampToRange lower");
    console.assert(clampToRange("22:00") === "20:00", "clampToRange upper");

    // Conflicto básico y limpieza cuando deja de traslaparse
    const a: Chore = {
      id: "a",
      title: "A",
      day: 0,
      start: "09:00",
      duration: 60,
      category: "daily",
      assignee: "ayudante",
    };
    const b: Chore = {
      id: "b",
      title: "B",
      day: 0,
      start: "09:30",
      duration: 30,
      category: "daily",
      assignee: "ayudante",
    };
    let conflicts = getConflictIds([a, b]);
    console.assert(conflicts.has("a") && conflicts.has("b"), "overlap a-b");
    // mover A fuera del rango de B
    const a2 = { ...a, start: "10:30" };
    conflicts = getConflictIds([a2, b]);
    console.assert(
      !conflicts.has("a") && !conflicts.has("b"),
      "no overlap after move"
    );

    // Adyacencia exacta NO es conflicto (10:00 termina A, 10:00 empieza B)
    const a3: Chore = { ...a, start: "09:00", duration: 60 };
    const b3: Chore = { ...b, start: "10:00", duration: 30 };
    conflicts = getConflictIds([a3, b3]);
    console.assert(
      !conflicts.has("a") && !conflicts.has("b"),
      "edge-touch not conflict"
    );

    // Cambio de día elimina conflictos entre días
    const a4: Chore = { ...a, day: 1 };
    conflicts = getConflictIds([a4, b]);
    console.assert(
      !conflicts.has("a") && !conflicts.has("b"),
      "different day not conflict"
    );

    // Nuevas pruebas: weekDates y seedWeek
    const mon = getMonday(new Date("2025-01-08")); // Mié -> obtiene Lun 2025-01-06
    const dates5 = getWeekDates(mon, 5);
    const dates7 = getWeekDates(mon, 7);
    console.assert(dates5.length === 5 && dates7.length === 7, "getWeekDates len");
    const seeded = seedWeek(DEFAULTS, 5);
    console.assert(
      seeded.length === DEFAULTS.length * 5,
      "seedWeek replicates per day"
    );
  } catch (err) {
    console.warn("Dev tests error", err);
  }
}
