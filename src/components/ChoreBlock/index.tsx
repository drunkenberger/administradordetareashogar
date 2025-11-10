import { useRef, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Chore } from '../../types';
import { CATEGORY_COLORS, SLOT_HEIGHT, HOUR_START, HOUR_END, DRAG_STEP_MIN, MIN_DURATION_MIN, RESIZE_HANDLE_H } from '../../constants';
import { timeToMinutes, minutesToTime } from '../../utils/time';
import { labelAssignee } from '../../utils/labels';
import { ChoreForm } from '../ChoreForm';
import { TaskDetailView } from '../../views/TaskDetailView';

interface ChoreBlockProps {
  chore: Chore;
  hasConflict: boolean;
  onUpdate: (id: string, patch: Partial<Chore>) => void;
  onDelete: (id: string) => void;
  showDetailView?: boolean;
}

export function ChoreBlock({ chore, hasConflict, onUpdate, onDelete, showDetailView = true }: ChoreBlockProps) {
  const [open, setOpen] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const dragInfo = useRef<{ grabOffset: number } | null>(null);
  const resizeInfo = useRef<{
    anchorTopPx: number;
    startMins: number;
    initialDuration: number;
    canvas: HTMLElement;
  } | null>(null);
  const wasDragging = useRef(false);

  const top = (timeToMinutes(chore.start) - HOUR_START * 60) * (SLOT_HEIGHT / 60);
  const height = Math.max(36, (chore.duration / 60) * SLOT_HEIGHT);

  function handlePointerDown(e: React.PointerEvent<HTMLDivElement>) {
    const target = e.currentTarget as HTMLElement;
    const canvas = target.closest('[data-role="day-canvas"]') as HTMLElement | null;
    if (!canvas) return;
    e.preventDefault();
    
    // @ts-ignore
    target.setPointerCapture?.(e.pointerId);

    const rect = canvas.getBoundingClientRect();
    const currentTop = (timeToMinutes(chore.start) - HOUR_START * 60) * (SLOT_HEIGHT / 60);
    dragInfo.current = { grabOffset: e.clientY - (rect.top + currentTop) };
    wasDragging.current = false;

    // Store original position to revert if needed
    const originalStart = chore.start;
    const originalDay = chore.day;
    let lastValidStart = originalStart;
    let lastValidDay = originalDay;

    function onMove(ev: PointerEvent) {
      if (!dragInfo.current) return;
      
      // Set visual feedback that we're dragging
      wasDragging.current = true;
      target.style.opacity = '0.8';
      target.style.transform = 'scale(1.02)';
      target.style.zIndex = '1000';
      
      const els = document.elementsFromPoint(ev.clientX, ev.clientY);
      const overCanvas = (els.find(
        el => (el as HTMLElement).dataset?.role === "day-canvas"
      ) as HTMLElement) || canvas;
      const r = overCanvas.getBoundingClientRect();

      let newY = ev.clientY - r.top - dragInfo.current.grabOffset;
      const maxY = (HOUR_END - HOUR_START) * SLOT_HEIGHT - height;
      newY = Math.max(0, Math.min(maxY, newY));

      let minsFromTop = (newY / SLOT_HEIGHT) * 60;
      minsFromTop = Math.round(minsFromTop / DRAG_STEP_MIN) * DRAG_STEP_MIN;
      const newStartMins = HOUR_START * 60 + minsFromTop;
      const newStart = minutesToTime(newStartMins);

      const ds = (overCanvas as HTMLElement).dataset.dayIdx;
      const newDay = ds ? parseInt(ds, 10) : chore.day;

      // Only store valid positions, don't update immediately
      lastValidStart = newStart;
      lastValidDay = newDay;
    }

    function onUp() {
      // Reset visual feedback
      target.style.opacity = '';
      target.style.transform = '';
      target.style.zIndex = '';
      
      // Only update if the position actually changed
      if (wasDragging.current && (lastValidStart !== originalStart || lastValidDay !== originalDay)) {
        onUpdate(chore.id, { start: lastValidStart, day: lastValidDay });
      }
      
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

    // Store original duration
    const originalDuration = chore.duration;
    let lastValidDuration = originalDuration;

    function onMove(ev: PointerEvent) {
      if (!resizeInfo.current) return;
      
      // Set visual feedback
      wasDragging.current = true;
      target.style.opacity = '0.9';
      
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

      // Only store the valid duration, don't update immediately
      lastValidDuration = newDuration;
    }

    function onUp() {
      // Reset visual feedback
      target.style.opacity = '';
      
      // Only update if duration actually changed
      if (wasDragging.current && lastValidDuration !== originalDuration) {
        onUpdate(chore.id, { duration: lastValidDuration });
      }
      
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
      return;
    }
    if (showDetailView) {
      setShowDetail(true);
    } else {
      setOpen(true);
    }
  }

  return (
    <>
      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="sm:max-w-2xl p-0 bg-transparent border-0 overflow-visible">
          <TaskDetailView
            chore={chore}
            hasConflict={hasConflict}
            onUpdate={onUpdate}
            onDelete={onDelete}
            onClose={() => setShowDetail(false)}
          />
        </DialogContent>
      </Dialog>
      <Dialog open={open} onOpenChange={setOpen}>
      <div
        onPointerDown={handlePointerDown}
        onClick={handleClick}
        className={`absolute left-2 right-2 border-2 text-white rounded-2xl p-3 shadow-strong cursor-grab active:cursor-grabbing hover:scale-105 transition-all duration-200 group overflow-hidden ${
          CATEGORY_COLORS[chore.category]
        } ${hasConflict ? "ring-2 ring-rose-500 ring-offset-2 border-rose-400 animate-pulse" : ""}`}
        style={{ top, height, touchAction: "none" }}
        title={`${chore.title} · ${chore.start}`}
        id={`chore-block-${chore.id}`}
      >
        {/* Subtle gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/20 to-transparent opacity-50 group-hover:opacity-70 transition-opacity duration-200"></div>
        
        {/* Shimmer effect on hover */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-30 transition-opacity duration-300">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -skew-x-12 animate-shimmer"></div>
        </div>
        
        {/* Content */}
        <div className="relative z-10">
          <div className="text-sm font-bold leading-tight drop-shadow-sm mb-1">
            {chore.title}
          </div>
          <div className="text-xs opacity-95 font-medium flex items-center gap-1">
            <span className="inline-flex items-center gap-1">
              ⏰ {chore.start}
            </span>
            <span className="text-white/70">•</span>
            <span className="inline-flex items-center gap-1">
              ⏱️ {chore.duration}m
            </span>
            <span className="text-white/70">•</span>
            <span className="inline-flex items-center gap-1">
              👤 {labelAssignee(chore.assignee)}
            </span>
          </div>
        </div>
        
        {/* Conflict indicator - responsive and well-proportioned */}
        {hasConflict && (
          <div className="absolute -top-2 -right-1 z-20">
            <div className="relative">
              {/* Pulsing background effect */}
              <div className="absolute inset-0 bg-rose-500/60 rounded-full animate-ping scale-125"></div>
              
              {/* Main indicator */}
              <div className="relative bg-gradient-to-br from-rose-500 via-rose-600 to-rose-700 text-white rounded-full shadow-strong border-2 border-white/90 backdrop-blur-sm">
                {/* Size based on task height */}
                <div className={`flex items-center justify-center font-bold ${
                  height < 60 
                    ? 'w-6 h-6 text-[10px]' 
                    : height < 100 
                    ? 'w-8 h-8 text-xs' 
                    : 'w-10 h-10 text-sm'
                }`}>
                  {height < 60 ? '⚠' : '⚠️'}
                </div>
                
                {/* Tooltip on hover - only for larger tasks */}
                {height >= 60 && (
                  <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-rose-600 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap shadow-lg">
                      Horario superpuesto
                      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-2 border-r-2 border-b-2 border-transparent border-b-rose-600"></div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
        
        {/* Enhanced resize handle */}
        <div
          onPointerDown={handleResizeDown}
          onClick={(e) => e.stopPropagation()}
          className="absolute bottom-0 left-2 right-2 group/resize"
          style={{ height: RESIZE_HANDLE_H }}
        >
          <div className="h-full w-full rounded-b-xl bg-gradient-to-t from-white/60 to-white/20 backdrop-blur-sm cursor-ns-resize transition-all duration-200 group-hover/resize:from-white/80 group-hover/resize:to-white/40">
            <div className="absolute inset-x-0 bottom-1 flex justify-center">
              <div className="w-8 h-1 bg-white/60 rounded-full"></div>
            </div>
          </div>
        </div>
        
        {/* Subtle border animation */}
        <div className="absolute inset-0 rounded-2xl border-2 border-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar tarea</DialogTitle>
        </DialogHeader>
        <ChoreForm
          initial={chore}
          onSubmit={(values) => {
            onUpdate(chore.id, values);
            setOpen(false);
          }}
          onDelete={() => {
            onDelete(chore.id);
            setOpen(false);
          }}
        />
      </DialogContent>
    </Dialog>
    </>
  );
}