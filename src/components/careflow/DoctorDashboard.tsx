import { useDemo } from "@/context/DemoContext";
import { SummaryCard } from "@/components/careflow/primitives";
import { QueueTable } from "@/components/careflow/queue";
import { AlertsPanel } from "@/components/careflow/alerts";
import { CapacityChart, TrendChart } from "@/components/careflow/charts";
import { ReferralPreview } from "@/components/careflow/referral";
import { CancellationSimulator } from "@/components/careflow/cancellation";
import { Users, Timer, RefreshCw, Sparkles, Activity } from "lucide-react";

export function DoctorDashboard({ compact = false }: { compact?: boolean }) {
  const { patients, alerts, aiDecisionsToday, recoveredSlots } = useDemo();
  const totalWaiting = patients.length;
  const avgWait = Math.round(patients.reduce((a, p) => a + p.waitWeeks, 0) / Math.max(1, patients.length));
  const capacity = 82;

  return (
    <div className="min-h-full space-y-6 p-6 md:p-8">
      {/* Page header */}
      <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="mb-1 text-[11px] font-bold uppercase tracking-[0.1em] text-primary">
            Clinician Workspace
          </p>
          <h1 className="text-2xl font-bold tracking-tight text-foreground md:text-3xl">
            Good morning, Dr. Patel
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {alerts.length > 0 ? (
              <span>
                <span className="font-semibold text-danger">{alerts.length} live alert{alerts.length === 1 ? "" : "s"}</span>
                {" · "}
              </span>
            ) : null}
            {totalWaiting} patients in your list
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-3.5 py-2 text-xs shadow-sm">
          <span className="h-2 w-2 animate-pulse rounded-full bg-success shadow-sm shadow-success" />
          <span className="font-medium">AI Copilot</span>
          <span className="text-muted-foreground">· Connected</span>
        </div>
      </header>

      {/* KPI cards */}
      <div className={`grid gap-3 ${compact ? "grid-cols-2 xl:grid-cols-3" : "grid-cols-2 md:grid-cols-3 xl:grid-cols-5"}`}>
        <SummaryCard label="Total Waiting"     value={totalWaiting}       hint="Across all specialties" icon={<Users      className="h-4 w-4" />} />
        <SummaryCard label="Avg Wait (wks)"    value={avgWait}            hint="Weighted mean"          icon={<Timer      className="h-4 w-4" />} accent="warning" />
        <SummaryCard label="Recovered Slots"   value={recoveredSlots}     hint="This month"             icon={<RefreshCw  className="h-4 w-4" />} accent="success" />
        <SummaryCard label="AI Decisions"      value={aiDecisionsToday}   hint="Today"                  icon={<Sparkles   className="h-4 w-4" />} />
        <SummaryCard label="Capacity"          value={`${capacity}%`}     hint="Trust utilisation"      icon={<Activity   className="h-4 w-4" />} accent="danger" />
      </div>

      {/* Queue + Alerts */}
      <div className={`grid gap-5 ${compact ? "grid-cols-1" : "grid-cols-1 xl:grid-cols-3"}`}>
        <div className={compact ? "" : "xl:col-span-2"}>
          <QueueTable />
        </div>
        <AlertsPanel />
      </div>

      {/* Charts */}
      <div className="grid gap-5 md:grid-cols-2">
        <CapacityChart />
        <TrendChart />
      </div>

      <ReferralPreview />
      <CancellationSimulator />
    </div>
  );
}
