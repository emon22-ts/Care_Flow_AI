import { useState } from "react";
import { useDemo } from "@/context/DemoContext";
import { PriorityBadge, AIReasonTooltip } from "./primitives";
import { cn } from "@/lib/utils";
import { MapPin, Clock, CalendarCheck2, ArrowUpDown } from "lucide-react";
import type { Patient } from "@/data/mockData";

type SortKey = "priority" | "wait" | "confidence";

const priorityWeight: Record<Patient["priority"], number> = {
  urgent: 4, high: 3, medium: 2, low: 1,
};

export function QueueTable() {
  const { patients, highlightPatientId } = useDemo();
  const [sort, setSort] = useState<SortKey>("priority");

  const sorted = [...patients].sort((a, b) => {
    if (sort === "wait")       return b.waitWeeks   - a.waitWeeks;
    if (sort === "confidence") return b.aiConfidence - a.aiConfidence;
    const p = priorityWeight[b.priority] - priorityWeight[a.priority];
    return p !== 0 ? p : b.aiConfidence - a.aiConfidence;
  });

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Patient Queue</h3>
          <p className="text-[11px] text-muted-foreground">AI-prioritised waiting list · updated live</p>
        </div>
        <div className="flex items-center gap-1">
          <ArrowUpDown className="mr-1 h-3.5 w-3.5 text-muted-foreground" />
          <SortButton active={sort === "priority"}   onClick={() => setSort("priority")}>Priority</SortButton>
          <SortButton active={sort === "wait"}       onClick={() => setSort("wait")}>Wait</SortButton>
          <SortButton active={sort === "confidence"} onClick={() => setSort("confidence")}>AI Score</SortButton>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] text-sm">
          <thead>
            <tr className="border-b border-border bg-muted/40">
              <th className="px-6 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Patient</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Specialty</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Wait</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Priority</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">AI Score</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Flex</th>
              <th className="px-4 py-3 text-left text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Distance</th>
              <th className="px-6 py-3 text-right text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Explain</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {sorted.map((p) => (
              <QueueRow key={p.id} patient={p} highlighted={highlightPatientId === p.id} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function SortButton({
  active, children, onClick,
}: {
  active: boolean; children: React.ReactNode; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "rounded-md px-2.5 py-1 text-xs font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        active
          ? "bg-primary text-primary-foreground shadow-sm"
          : "text-muted-foreground hover:bg-muted hover:text-foreground",
      )}
    >
      {children}
    </button>
  );
}

function QueueRow({ patient: p, highlighted }: { patient: Patient; highlighted: boolean }) {
  return (
    <tr className={cn(
      "group transition-colors hover:bg-muted/30",
      highlighted && "flash-once bg-success/5",
    )}>
      <td className="px-6 py-3.5">
        <div className="font-semibold text-foreground leading-tight">{p.name}</div>
        <div className="mt-0.5 text-[11px] text-muted-foreground">{p.nhsId} · Age {p.age}</div>
      </td>
      <td className="px-4 py-3.5">
        <span className="rounded-md bg-muted px-2 py-0.5 text-xs font-medium text-muted-foreground">
          {p.specialty}
        </span>
      </td>
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="h-3 w-3" /> {p.waitWeeks}w
        </span>
      </td>
      <td className="px-4 py-3.5">
        <PriorityBadge priority={p.priority} pulse={highlighted} />
      </td>
      <td className="px-4 py-3.5">
        <div className="flex items-center gap-2">
          <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
            <div
              className="h-full rounded-full bg-primary transition-all duration-700"
              style={{ width: `${p.aiConfidence}%` }}
            />
          </div>
          <span className="text-xs font-semibold tabular-nums text-foreground">{p.aiConfidence}%</span>
        </div>
      </td>
      <td className="px-4 py-3.5">
        {p.flexible ? (
          <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2 py-0.5 text-[11px] font-medium text-success">
            <CalendarCheck2 className="h-3 w-3" /> Yes
          </span>
        ) : (
          <span className="text-[11px] text-muted-foreground">No</span>
        )}
      </td>
      <td className="px-4 py-3.5">
        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
          <MapPin className="h-3 w-3" /> {p.distanceMiles} mi
        </span>
      </td>
      <td className="px-6 py-3.5 text-right">
        <AIReasonTooltip reasons={p.reasons} confidence={p.aiConfidence}>Why?</AIReasonTooltip>
      </td>
    </tr>
  );
}
