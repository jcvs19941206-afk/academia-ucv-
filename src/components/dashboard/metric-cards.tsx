import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ListTodo, CheckCircle2, AlertTriangle, BookOpen } from "lucide-react";
import type { DashboardMetrics } from "@/app/actions/dashboard";

interface MetricCardsProps {
  metrics: DashboardMetrics;
}

const cards = [
  {
    label: "Tareas pendientes",
    key: "pending_count" as const,
    icon: ListTodo,
    color: "text-primary",
    bg: "bg-primary/10",
    suffix: "pendientes",
  },
  {
    label: "Completadas hoy",
    key: "completed_today" as const,
    icon: CheckCircle2,
    color: "text-success",
    bg: "bg-success/10",
    suffix: "hoy",
  },
  {
    label: "Próximas a vencer",
    key: "overdue_count" as const,
    icon: AlertTriangle,
    color: "text-warning",
    bg: "bg-warning/10",
    suffix: "vencen pronto",
  },
  {
    label: "Tasa de completitud",
    key: "completion_rate" as const,
    icon: BookOpen,
    color: "text-accent",
    bg: "bg-accent/10",
    suffix: "completado",
    isPercentage: true,
  },
];

export function MetricCards({ metrics }: MetricCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        const value = metrics[card.key];
        const displayValue = card.isPercentage ? `${value}%` : value;

        return (
          <Card key={card.key}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                {card.label}
              </CardTitle>
              <div className={`p-2 rounded-lg ${card.bg}`}>
                <Icon className={`h-4 w-4 ${card.color}`} />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{displayValue}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {card.suffix}
              </p>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}
