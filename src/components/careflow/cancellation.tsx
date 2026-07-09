import { useEffect, useState } from "react";
import { useDemo } from "@/context/DemoContext";
import { Zap, Sparkles, MapPin, CalendarCheck2, Send, CheckCircle2, X } from "lucide-react";
import { toast } from "sonner";
import type { Patient } from "@/data/mockData";
import { LoadingSkeleton } from "./primitives";

const steps = [
  "Searching best patient…",
  "Comparing waiting list…",
  "Optimising slot fit…",
];

export function CancellationSimulator() {
  const { simulateCancellation, notifyPatient } = useDemo();
  const [open, setOpen]       = useState(false);
  const [phase, setPhase]     = useState<"idle" | "thinking" | "results">("idle");
  const [step, setStep]       = useState(0);
  const [results, setResults] = useState<Patient[]>([]);
  const [notified, setNotified] = useState<string | null>(null);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" && phase !== "thinking") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, phase]);

  const run = async () => {
    setOpen(true);
    setPhase("thinking");
    setNotified(null);
    setStep(0);
    const t = setInterval(() => setStep((s) => Math.min(s + 1, steps.length - 1)), 500);
    const r = await simulateCancellation();
    clearInterval(t);
    setResults(r);
    setPhase("results");
  };

  const notify = (p: Patient) => {
    notifyPatient(p.id, "A cardiology slot has opened tomorrow at 09:40. Tap to confirm.");
    setNotified(p.id);
    toast.success("Patient notified", { description: `${p.name} has been offered the slot.` });
  };

  return (
    <>
      {/* FAB */}
      <button
        onClick={run}
        className="fixed bottom-6 right-6 z-40 inline-flex items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground shadow-xl shadow-primary/25 transition-all hover:-translate-y-0.5 hover:shadow-2xl hover:shadow-primary/30 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
      >
        <Zap className="h-4 w-4" /> Simulate Cancellation
      </button>

      {/* Modal backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/30 p-4 backdrop-blur-sm fade-in"
          onClick={() => phase !== "thinking" && setOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Slot recovery"
            className="slide-up w-full max-w-xl rounded-2xl border border-border bg-card p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal header */}
            <div className="mb-5 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <h3 className="font-semibold text-foreground">Recovering the slot</h3>
                  <p className="text-xs text-muted-foreground">Cardiology · Tomorrow 09:40</p>
                </div>
              </div>
              <button
                onClick={() => phase !== "thinking" && setOpen(false)}
                disabled={phase === "thinking"}
                className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-muted hover:text-foreground disabled:opacity-40"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Thinking state */}
            {phase === "thinking" && (
              <div className="space-y-4 py-4">
                <div className="space-y-3">
                  {steps.map((s, i) => (
                    <div key={s} className="flex items-center gap-3">
                      <div className={`h-2 w-2 rounded-full transition-colors ${
                        i < step ? "bg-success" : i === step ? "bg-primary animate-pulse" : "bg-border"
                      }`} />
                      <span className={`text-sm transition-colors ${
                        i <= step ? "text-foreground font-medium" : "text-muted-foreground"
                      }`}>{s}</span>
                    </div>
                  ))}
                </div>
                <div className="mt-5 space-y-2">
                  <LoadingSkeleton className="h-16 w-full" />
                  <LoadingSkeleton className="h-16 w-full" />
                </div>
              </div>
            )}

            {/* Results */}
            {phase === "results" && (
              <div className="space-y-3">
                <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Top matches
                </p>

                {results.length === 0 && (
                  <div className="rounded-xl border border-dashed border-border bg-muted/30 py-10 text-center text-sm text-muted-foreground">
                    No flexible patients available right now.
                  </div>
                )}

                {results.map((p, i) => {
                  const match = Math.max(70, p.aiConfidence - i * 3);
                  const isNotified = notified === p.id;
                  return (
                    <div
                      key={p.id}
                      className={`rounded-xl border p-4 transition-all ${
                        isNotified
                          ? "border-success/30 bg-success/5"
                          : "card-lift hover:card-lift-hover border-border bg-background"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="font-semibold text-foreground">{p.name}</span>
                            <span className="rounded-full bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                              {match}% match
                            </span>
                          </div>
                          <div className="mt-1.5 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <span className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {p.distanceMiles} mi</span>
                            {p.flexible && (
                              <span className="flex items-center gap-1 text-success"><CalendarCheck2 className="h-3 w-3" /> Flexible</span>
                            )}
                            <span>Waiting {p.waitWeeks}w</span>
                          </div>
                          <ul className="mt-1.5 space-y-0.5 text-xs text-muted-foreground">
                            {p.reasons.slice(0, 2).map((r) => (
                              <li key={r} className="flex items-start gap-1">
                                <span className="text-success shrink-0">·</span> {r}
                              </li>
                            ))}
                          </ul>
                        </div>

                        {isNotified ? (
                          <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-success/12 px-3 py-2 text-sm font-semibold text-success">
                            <CheckCircle2 className="h-4 w-4 check-pop" /> Notified
                          </span>
                        ) : (
                          <button
                            onClick={() => notify(p)}
                            className="inline-flex shrink-0 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-semibold text-primary-foreground transition-all hover:bg-primary/90 active:scale-95"
                          >
                            <Send className="h-3.5 w-3.5" /> Notify
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
