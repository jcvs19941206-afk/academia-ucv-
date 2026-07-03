import { ReactNode } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface OnboardingStepProps {
  step: number;
  totalSteps: number;
  title: string;
  description?: string;
  children: ReactNode;
  onNext?: () => void;
  onPrev?: () => void;
  isNextDisabled?: boolean;
  nextLabel?: string;
}

export function OnboardingStep({
  step,
  totalSteps,
  title,
  description,
  children,
  onNext,
  onPrev,
  isNextDisabled,
  nextLabel = "Siguiente",
}: OnboardingStepProps) {
  return (
    <Card className="w-full max-w-lg p-6 animate-in fade-in zoom-in-95 duration-500 shadow-2xl relative overflow-hidden">
      {/* Progress bar */}
      <div className="absolute top-0 left-0 h-1 bg-primary/20 w-full">
        <div 
          className="h-full bg-primary transition-all duration-300 ease-in-out" 
          style={{ width: `${(step / totalSteps) * 100}%` }}
        />
      </div>

      <div className="mb-6 mt-2">
        <div className="text-xs font-semibold text-primary mb-2 uppercase tracking-wider">
          Paso {step} de {totalSteps}
        </div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {description && <p className="text-muted-foreground mt-1">{description}</p>}
      </div>

      <div className="min-h-[200px] flex flex-col justify-center">
        {children}
      </div>

      <div className="mt-8 flex items-center justify-between gap-4">
        {onPrev ? (
          <Button variant="outline" onClick={onPrev}>
            Anterior
          </Button>
        ) : (
          <div /> // Spacer
        )}

        {onNext && (
          <Button onClick={onNext} disabled={isNextDisabled} className="min-w-[120px]">
            {nextLabel}
          </Button>
        )}
      </div>
    </Card>
  );
}
