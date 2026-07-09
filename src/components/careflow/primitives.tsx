import { type ReactNode, useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import type { Priority } from "@/data/mockData";
import { Info } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

export function SummaryCard({
  label,
  value,
  hint,
  icon,
  accent = "primary",
}: {
  label: string;
  value: number | string;
  hint?: string;
  icon: ReactNode;
  accent?: "primary" | "success" | "warning" | "danger";
}) {
  const accentMap = {
    primary: { icon: "text-primary bg-primary/10 ring-primary/20", bar: "bg-primary" },
    success: { icon: "text-success bg-success/10 ring-success/20", bar: "bg-success" },
    warning: { icon: "text-warning bg-warning/10 ring-warning/20", bar: "bg-warning" },
    danger:  { icon: "text-danger  bg-danger/10  ring-danger/20",  bar: "bg-danger"  },
  }[accent];

  return (
    <div className="card-lift hover:card-lift-hover group relative overflow-hidden rounded-2xl border border-border bg-card p-5 shadow-sm">
      {/* Subtle top accent line */}
      <div className={cn("absolute inset-x-0 top-0 h-0.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100", accentMap.bar)} />
      <div className="flex items-start justify-between">
        <p className="text-[12px] font-semibold uppercase tracking-wider text-muted-foreground">{label}</p>
        <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl ring-1", accentMap.icon)}>
          {icon}
        </div>
      </div>
      <AnimatedNumber value={value} />
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

function AnimatedNumber({ value }: { value: number | string }) {
  const [display, setDisplay] = useState(value);
  const [pop, setPop] = useState(false);
  const prevRef = useRef(value);

  useEffect(() => {
    const prev = prevRef.current;
    if (prev === value) return;
    prevRef.current = value;
    setPop(true);
    const popTimer = setTimeout(() => setPop(false), 450);
    if (typeof value === "number" && typeof prev === "number") {
      const start = prev as number;
      const diff = value - start;
      const duration = 420;
      const t0 = performance.now();
      let raf = 0;
      const tick = (now: number) => {
        const t = Math.min(1, (now - t0) / duration);
        const eased = 1 - Math.pow(1 - t, 3);
        setDisplay(Math.round(start + diff * eased));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
      return () => { cancelAnimationFrame(raf); clearTimeout(popTimer); };
    }
    setDisplay(value);
    return () => clearTimeout(popTimer);
  }, [value]);

  return (
    <p className={cn("mt-3 text-[38px] font-bold leading-none tracking-tight text-foreground tabular-nums", pop && "count-up")}>
      {display}
    </p>
  );
}

export function PriorityBadge({ priority, pulse }: { priority: Priority; pulse?: boolean }) {
  const styles: Record<Priority, string> = {
    urgent: "bg-danger/10 text-danger   border-danger/30",
    high:   "bg-warning/10 text-warning border-warning/30",
    medium: "bg-primary/10 text-primary border-primary/30",
    low:    "bg-muted text-muted-foreground border-border",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wide",
        styles[priority],
        pulse && priority === "urgent" && "pulse-ring",
      )}
    >
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {priority}
    </span>
  );
}

export function LoadingSkeleton({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-lg", className)} />;
}

export function AIReasonTooltip({
  reasons,
  confidence,
  children,
}: {
  reasons: string[];
  confidence: number;
  children: ReactNode;
}) {
  return (
    <TooltipProvider delayDuration={80}>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex items-center gap-1 rounded-md px-1.5 py-0.5 text-xs font-medium text-primary transition-colors hover:bg-primary/8 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            aria-label="Show AI reasoning"
          >
            {children}
            <Info className="h-3 w-3 opacity-70" />
          </button>
        </TooltipTrigger>
        <TooltipContent
          side="left"
          className="max-w-[260px] rounded-xl border border-border bg-popover p-4 text-popover-foreground shadow-2xl"
        >
          <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
            Why AI prioritised
          </p>
          <ul className="space-y-1.5">
            {reasons.map((r) => (
              <li key={r} className="flex items-start gap-2 text-[13px]">
                <span className="mt-0.5 text-success shrink-0">✓</span>
                <span className="leading-snug">{r}</span>
              </li>
            ))}
          </ul>
          <div className="mt-3 flex items-center justify-between border-t border-border pt-2.5">
            <span className="text-xs text-muted-foreground">AI confidence</span>
            <div className="flex items-center gap-2">
              <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                <div className="h-full rounded-full bg-primary" style={{ width: `${confidence}%` }} />
              </div>
              <span className="text-xs font-bold text-primary">{confidence}%</span>
            </div>
          </div>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
