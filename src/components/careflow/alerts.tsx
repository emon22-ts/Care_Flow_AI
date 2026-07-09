import { useDemo } from "@/context/DemoContext";
import { AlertTriangle, Bell, Check, X, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

export function AlertsPanel() {
  const { alerts, acceptAlert, dismissAlert } = useDemo();

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-card shadow-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-5 py-4">
        <div className="flex items-center gap-2.5">
          <div className="relative">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Bell className="h-4 w-4" />
            </div>
            {alerts.length > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[9px] font-bold text-danger-foreground ring-2 ring-card">
                {alerts.length}
              </span>
            )}
          </div>
          <div>
            <h3 className="text-sm font-semibold text-foreground">Live Alerts</h3>
            <p className="text-[11px] text-muted-foreground">Real-time signals</p>
          </div>
        </div>
        {alerts.length === 0 && (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <ShieldCheck className="h-3 w-3" /> All clear
          </span>
        )}
      </div>

      {/* Alert list */}
      <div className="flex-1 space-y-2 p-4">
        {alerts.length === 0 && (
          <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center">
            <ShieldCheck className="mb-2 h-8 w-8 text-success/60" />
            <p className="text-sm font-medium text-foreground">All caught up</p>
            <p className="mt-0.5 text-xs text-muted-foreground">No active alerts right now</p>
          </div>
        )}
        {alerts.map((a) => (
          <div
            key={a.id}
            className={cn(
              "slide-in-right group relative rounded-xl border p-4 transition-all duration-200 hover:shadow-sm",
              a.severity === "urgent"
                ? "border-danger/25 bg-danger/4"
                : "border-warning/25 bg-warning/4",
            )}
          >
            {/* Severity stripe */}
            <div className={cn(
              "absolute inset-y-0 left-0 w-0.5 rounded-full",
              a.severity === "urgent" ? "bg-danger" : "bg-warning",
            )} />

            <div className="flex items-start gap-3 pl-2">
              <div className={cn(
                "mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-lg",
                a.severity === "urgent" ? "bg-danger/12 text-danger" : "bg-warning/12 text-warning",
              )}>
                <AlertTriangle className="h-3.5 w-3.5" />
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <p className="text-sm font-semibold text-foreground truncate">{a.patientName}</p>
                  <span className="shrink-0 text-[10px] text-muted-foreground">{a.timestamp}</span>
                </div>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{a.reason}</p>

                <div className="mt-3 flex gap-2">
                  <button
                    onClick={() => {
                      acceptAlert(a.id);
                      toast.success("Priority updated", {
                        description: `${a.patientName} moved to top of queue.`,
                      });
                    }}
                    className="inline-flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  >
                    <Check className="h-3 w-3" /> Accept
                  </button>
                  <button
                    onClick={() => dismissAlert(a.id)}
                    className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                  >
                    <X className="h-3 w-3" /> Dismiss
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
