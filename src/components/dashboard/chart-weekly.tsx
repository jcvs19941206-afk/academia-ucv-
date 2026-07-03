"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import type { WeeklyActivity } from "@/app/actions/dashboard";

interface ChartWeeklyProps {
  data: WeeklyActivity[];
}

export function ChartWeekly({ data }: ChartWeeklyProps) {
  const isEmpty = data.length === 0 || data.every((d) => d.created === 0 && d.completed === 0);

  if (isEmpty) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">
            Actividad semanal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center h-64 text-center">
            <BarChart className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-sm text-muted-foreground">
              No hay actividad registrada esta semana
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              Crea tareas para ver tu progreso aquí
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Formatear fechas para el eje X
  const chartData = data.map((d) => ({
    ...d,
    date: new Date(d.date).toLocaleDateString("es-ES", {
      weekday: "short",
      day: "numeric",
    }),
  }));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg font-semibold">
          Actividad semanal
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData} barGap={4}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-muted" />
              <XAxis
                dataKey="date"
                className="text-xs text-muted-foreground"
                tickLine={false}
              />
              <YAxis
                className="text-xs text-muted-foreground"
                tickLine={false}
                allowDecimals={false}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  fontSize: "14px",
                }}
              />
              <Legend />
              <Bar
                dataKey="created"
                name="Creadas"
                fill="hsl(var(--primary))"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
              <Bar
                dataKey="completed"
                name="Completadas"
                fill="hsl(var(--success))"
                radius={[4, 4, 0, 0]}
                maxBarSize={32}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}

// Skeleton para loading
export function ChartWeeklySkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-40" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-64 w-full rounded-lg" />
      </CardContent>
    </Card>
  );
}
