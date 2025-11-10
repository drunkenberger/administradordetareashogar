import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Sparkles, AlertCircle, CheckCircle2 } from "lucide-react";
import { Chore } from "@/types";
import { generateWeekPlan, getPlanStats } from "@/services/weekPlanGenerator";

interface AutoPlanButtonProps {
  daysCount: number;
  onGenerate: (chores: Chore[]) => void;
  hasExistingChores: boolean;
}

/**
 * Botón para generar un plan semanal automático
 * Muestra confirmación si ya existen tareas y estadísticas del plan generado
 */
export function AutoPlanButton({ daysCount, onGenerate, hasExistingChores }: AutoPlanButtonProps) {
  const [showDialog, setShowDialog] = useState(false);
  const [generatedPlan, setGeneratedPlan] = useState<Chore[] | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateClick = () => {
    if (hasExistingChores) {
      setShowDialog(true);
    } else {
      generateAndApply();
    }
  };

  const generateAndApply = () => {
    setIsGenerating(true);

    // Simular un pequeño delay para feedback visual
    setTimeout(() => {
      const plan = generateWeekPlan(daysCount);
      setGeneratedPlan(plan);
      setIsGenerating(false);
    }, 300);
  };

  const applyPlan = () => {
    if (generatedPlan) {
      onGenerate(generatedPlan);
      setShowDialog(false);
      setGeneratedPlan(null);
    }
  };

  const regenerate = () => {
    generateAndApply();
  };

  const stats = generatedPlan ? getPlanStats(generatedPlan) : null;

  return (
    <>
      <Button
        id="auto-plan-button-014"
        variant="default"
        onClick={handleGenerateClick}
        className="gap-2 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 border-0 shadow-soft transition-all duration-300 hover:shadow-medium hover:scale-105"
      >
        <Sparkles className="h-4 w-4" />
        Generar plan automático
      </Button>

      <Dialog open={showDialog} onOpenChange={setShowDialog}>
        <DialogContent className="sm:max-w-[500px] bg-white/95 backdrop-blur-md border-white/30">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <Sparkles className="h-5 w-5 text-purple-500" />
              Plan Semanal Automático
            </DialogTitle>
            <DialogDescription className="text-gray-600">
              {!generatedPlan
                ? "Genera un plan inteligente con tareas diarias y semanales variadas"
                : "Revisa las estadísticas del plan generado"
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            {/* Advertencia si existen tareas */}
            {hasExistingChores && !generatedPlan && (
              <div className="flex items-start gap-3 p-4 bg-amber-50 border border-amber-200 rounded-lg">
                <AlertCircle className="h-5 w-5 text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-semibold text-amber-900">¡Atención!</p>
                  <p className="text-sm text-amber-700 mt-1">
                    Ya tienes tareas programadas. El plan automático reemplazará todas las tareas existentes.
                  </p>
                </div>
              </div>
            )}

            {/* Estadísticas del plan generado */}
            {generatedPlan && stats && (
              <div className="space-y-3">
                <div className="flex items-start gap-3 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-green-900">Plan generado exitosamente</p>
                    <p className="text-sm text-green-700 mt-1">
                      {stats.total} tareas organizadas para {daysCount} días
                    </p>
                  </div>
                </div>

                <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-100">
                  <h4 className="font-semibold text-gray-900 mb-3 text-sm">Distribución de tareas:</h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div className="bg-white/80 rounded-md p-3">
                      <p className="text-2xl font-bold text-blue-600">{stats.daily}</p>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Diarias</p>
                    </div>
                    <div className="bg-white/80 rounded-md p-3">
                      <p className="text-2xl font-bold text-green-600">{stats.weekly}</p>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Semanales</p>
                    </div>
                    <div className="bg-white/80 rounded-md p-3">
                      <p className="text-2xl font-bold text-purple-600">{stats.monthly}</p>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Mensuales</p>
                    </div>
                    <div className="bg-white/80 rounded-md p-3">
                      <p className="text-2xl font-bold text-orange-600">{stats.eventual}</p>
                      <p className="text-xs text-gray-600 uppercase tracking-wide">Eventuales</p>
                    </div>
                  </div>
                </div>

                <p className="text-xs text-gray-500 text-center italic">
                  💡 Cada plan es único. Genera otro para obtener una combinación diferente.
                </p>
              </div>
            )}
          </div>

          <DialogFooter className="flex gap-2 sm:gap-2">
            {!generatedPlan ? (
              <>
                <Button
                  variant="outline"
                  onClick={() => setShowDialog(false)}
                  className="flex-1"
                >
                  Cancelar
                </Button>
                <Button
                  onClick={generateAndApply}
                  disabled={isGenerating}
                  className="flex-1 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                >
                  {isGenerating ? (
                    <>Generando...</>
                  ) : (
                    <>
                      <Sparkles className="h-4 w-4 mr-2" />
                      Generar
                    </>
                  )}
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="outline"
                  onClick={regenerate}
                  disabled={isGenerating}
                  className="flex-1"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar otro
                </Button>
                <Button
                  onClick={applyPlan}
                  className="flex-1 bg-gradient-to-r from-green-500 to-emerald-500 hover:from-green-600 hover:to-emerald-600"
                >
                  <CheckCircle2 className="h-4 w-4 mr-2" />
                  Aplicar plan
                </Button>
              </>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
