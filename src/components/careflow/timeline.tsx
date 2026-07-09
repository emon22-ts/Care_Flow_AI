import { type ReactNode, useState } from "react";
import { cn } from "@/lib/utils";
import { CheckCircle2, Circle, ChevronRight, ChevronDown, ArrowUp, Minus, ArrowDown } from "lucide-react";
import { bloodReport } from "@/data/mockData";

export function Timeline({ step }: { step: number }) {
  const steps = [
    "Referral received",
    "Under review",
    "Waiting",
    "Priority updated",
    "Appointment booked",
  ];
  return (
    <ol className="relative space-y-1">
      {steps.map((label, i) => {
        const done    = i < step;
        const current = i === step;
        return (
          <li key={label} className="flex items-start gap-3 py-1.5">
            {/* Icon column */}
            <div className="relative mt-0.5 flex shrink-0 items-center justify-center">
              {done ? (
                <CheckCircle2 className="h-5 w-5 text-success" />
              ) : current ? (
                <div className="relative">
                  <Circle className="h-5 w-5 text-primary" />
                  <span className="absolute inset-1 rounded-full bg-primary/25 animate-pulse" />
                </div>
              ) : (
                <Circle className="h-5 w-5 text-border" />
              )}
              {/* Connector line */}
              {i < steps.length - 1 && (
                <div className={cn(
                  "absolute left-1/2 top-6 h-4 w-px -translate-x-1/2",
                  done ? "bg-success/40" : "bg-border",
                )} />
              )}
            </div>
            {/* Label */}
            <div className="flex-1 pb-1">
              <p className={cn(
                "text-sm font-medium leading-tight",
                done    ? "text-muted-foreground line-through decoration-muted-foreground/40" :
                current ? "text-primary" :
                          "text-muted-foreground/60",
              )}>
                {label}
              </p>
              {current && (
                <p className="mt-0.5 text-[11px] text-primary/70">In progress</p>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

export function PatientStatusCard({ position, specialty }: { position: number; specialty: string }) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary via-primary/90 to-secondary p-5 text-primary-foreground shadow-lg">
      {/* Background decoration */}
      <div className="pointer-events-none absolute right-0 top-0 h-32 w-32 translate-x-8 -translate-y-8 rounded-full bg-white/8" />
      <div className="pointer-events-none absolute bottom-0 right-4 h-20 w-20 translate-y-6 rounded-full bg-white/5" />

      <p className="relative text-xs font-medium opacity-75">Your queue position</p>
      <div className="relative mt-2 flex items-baseline gap-2">
        <span
          key={position}
          className="text-5xl font-bold tracking-tight count-up tabular-nums"
        >
          #{position}
        </span>
        <span className="text-sm font-medium opacity-85">· {specialty}</span>
      </div>
      <p className="relative mt-2 text-sm opacity-85 leading-snug">
        We're actively looking for earlier appointments for you.
      </p>
      <div className="relative mt-4 h-1.5 w-full overflow-hidden rounded-full bg-white/20">
        <div
          className="h-full rounded-full bg-white transition-all duration-700"
          style={{ width: `${Math.max(8, 100 - position * 4)}%` }}
        />
      </div>
    </div>
  );
}

export function ReportCard() {
  return (
    <div className="space-y-2">
      {bloodReport.map((r) => (
        <ReportRow key={r.test} row={r} />
      ))}
    </div>
  );
}

function ReportRow({ row }: { row: (typeof bloodReport)[number] }) {
  const [open, setOpen] = useState(false);
  const statusStyles: Record<string, string> = {
    normal:    "bg-success/10 text-success",
    borderline:"bg-warning/10 text-warning",
    high:      "bg-danger/10  text-danger",
  };
  const TrendIcon = row.trend === "up" ? ArrowUp : row.trend === "down" ? ArrowDown : Minus;
  const trendColor = row.trend === "up" ? "text-danger" : row.trend === "down" ? "text-success" : "text-muted-foreground";

  return (
    <div className="overflow-hidden rounded-xl border border-border bg-card">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-3 p-3 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
      >
        <div className="flex-1 min-w-0">
          <p className="text-[13px] font-semibold text-foreground truncate">{row.test}</p>
          <p className="text-[11px] text-muted-foreground">Range {row.range}</p>
        </div>
        <div className="shrink-0 text-right">
          <p className="text-[13px] font-semibold tabular-nums text-foreground">{row.value}</p>
          <div className="mt-0.5 flex items-center justify-end gap-1.5">
            <TrendIcon className={cn("h-3 w-3", trendColor)} />
            <span className={cn("rounded-full px-1.5 py-0.5 text-[10px] font-bold uppercase", statusStyles[row.status])}>
              {row.status}
            </span>
          </div>
        </div>
        {open
          ? <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          : <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
        }
      </button>
      {open && (
        <div className="border-t border-border bg-muted/20 px-3 py-2.5 slide-up">
          <p className="mb-1 text-[11px] font-semibold text-foreground">What does this mean?</p>
          <p className="text-[12px] leading-relaxed text-muted-foreground">{row.explanation}</p>
        </div>
      )}
    </div>
  );
}

export function InfoBanner({ children, tone = "info" }: { children: ReactNode; tone?: "info" | "success" }) {
  return (
    <div className={cn(
      "rounded-xl border p-3 text-xs leading-relaxed",
      tone === "info"
        ? "border-primary/20 bg-primary/6 text-primary"
        : "border-success/20 bg-success/6 text-success",
    )}>
      {children}
    </div>
  );
}
