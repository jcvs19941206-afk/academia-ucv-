import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import {
  getDashboardMetrics,
  getWeeklyActivity,
  getUpcomingTasks,
} from "@/app/actions/dashboard";
import { MetricCards } from "@/components/dashboard/metric-cards";
import { ChartWeekly } from "@/components/dashboard/chart-weekly";
import { UpcomingTasks } from "@/components/dashboard/upcoming-tasks";

import { EmptyDashboard } from "@/components/shared/empty-dashboard";
import { OnboardingOverlay } from "@/components/shared/onboarding-overlay";
import { DashboardTracker } from "@/components/dashboard/dashboard-tracker";

export const dynamic = "force-dynamic"; // No cachear el dashboard

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  // Obtener datos en paralelo
  const [metrics, weeklyActivity, upcomingTasks] = await Promise.all([
    getDashboardMetrics(),
    getWeeklyActivity(),
    getUpcomingTasks(5),
  ]);

  const isEmpty = metrics.total_courses === 0;

  return (
    <div className="space-y-6 relative">
      <DashboardTracker 
        pendingCount={metrics.pending_count} 
        completionRate={metrics.completion_rate} 
      />
      <OnboardingOverlay coursesCount={metrics.total_courses} />

      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
          Panel de Control
        </h1>
        <p className="text-sm text-muted-foreground">
          Resumen de tu progreso académico
        </p>
      </div>

      {isEmpty ? (
        <EmptyDashboard />
      ) : (
        <>
          {/* Tarjetas de métricas */}
          <MetricCards metrics={metrics} />

          {/* Gráfico + Próximas tareas */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <ChartWeekly data={weeklyActivity} />
            <UpcomingTasks tasks={upcomingTasks} />
          </div>
        </>
      )}
    </div>
  );
}
