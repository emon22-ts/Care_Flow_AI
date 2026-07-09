import { useState } from "react";
import { messyNotes, referralLetter } from "@/data/mockData";
import { FileText, Sparkles, AlertCircle, CheckCircle2, Copy, Check } from "lucide-react";
import { LoadingSkeleton } from "./primitives";

export function ReferralPreview() {
  const [generated, setGenerated] = useState(false);
  const [loading, setLoading]     = useState(false);
  const [copied, setCopied]       = useState(false);

  const handleGenerate = () => {
    setLoading(true);
    setGenerated(false);
    setTimeout(() => { setLoading(false); setGenerated(true); }, 1400);
  };

  const handleCopy = () => {
    const text = `${referralLetter.body}`;
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-border px-6 py-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">Referral Copilot</h3>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Turn messy consult notes into a clean NHS referral
          </p>
        </div>
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition-all hover:bg-primary/90 hover:shadow-md active:scale-95 disabled:opacity-60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
        >
          <Sparkles className={`h-4 w-4 ${loading ? "spin-slow" : ""}`} />
          {loading ? "Drafting…" : generated ? "Regenerate" : "Generate"}
        </button>
      </div>

      {/* Body — side by side on md+ */}
      <div className="grid gap-0 md:grid-cols-2">
        {/* Notes pane */}
        <div className="border-b border-border p-5 md:border-b-0 md:border-r">
          <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            Consultation notes
          </p>
          <pre className="rounded-xl border border-border bg-muted/40 p-4 font-mono text-[12px] leading-relaxed text-foreground/80 whitespace-pre-wrap">
{messyNotes}
          </pre>
        </div>

        {/* Output pane */}
        <div className="p-5">
          <p className="mb-3 flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
            <FileText className="h-3.5 w-3.5" /> NHS Referral Letter
          </p>

          {loading && (
            <div className="space-y-2.5">
              {[80, 100, 100, 90, 75].map((w, i) => (
                <LoadingSkeleton key={i} className={`h-4`} style={{ width: `${w}%` } as React.CSSProperties} />
              ))}
              <p className="mt-4 flex items-center gap-2 text-xs text-primary">
                <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Drafting referral…
              </p>
            </div>
          )}

          {!loading && !generated && (
            <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed border-border bg-muted/20 px-6 py-12 text-center">
              <FileText className="mb-3 h-8 w-8 text-muted-foreground/40" />
              <p className="text-sm font-medium text-foreground">No letter yet</p>
              <p className="mt-1 text-xs text-muted-foreground">
                Press <span className="font-semibold text-primary">Generate</span> to draft the referral
              </p>
            </div>
          )}

          {!loading && generated && (
            <div className="slide-up space-y-3">
              <div className="rounded-xl border border-border bg-background p-4 text-sm leading-relaxed">
                <div className="mb-3 space-y-1 border-b border-border pb-3 text-xs text-muted-foreground">
                  {[
                    ["To",   referralLetter.to],
                    ["From", referralLetter.from],
                    ["Date", referralLetter.date],
                    ["Re",   referralLetter.subject],
                  ].map(([k, v]) => (
                    <div key={k}>
                      <span className="font-semibold text-foreground">{k}: </span>{v}
                    </div>
                  ))}
                </div>
                <pre className="whitespace-pre-wrap font-sans text-[13px] leading-relaxed text-foreground">
{referralLetter.body}
                </pre>
              </div>

              {/* Missing fields */}
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-[11px] font-semibold uppercase tracking-wide text-muted-foreground">Missing:</span>
                {referralLetter.missing.map((m) => (
                  <span key={m} className="inline-flex items-center gap-1 rounded-full border border-warning/35 bg-warning/8 px-2.5 py-0.5 text-[11px] font-medium text-warning">
                    <AlertCircle className="h-3 w-3" /> {m}
                  </span>
                ))}
              </div>

              {/* Confidence + copy */}
              <div className="flex items-center justify-between rounded-xl bg-success/8 px-4 py-2.5">
                <div className="flex items-center gap-2 text-xs text-success">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>AI confidence: <strong>{referralLetter.confidence}%</strong></span>
                </div>
                <button
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground transition-all hover:bg-muted hover:text-foreground"
                >
                  {copied ? <Check className="h-3 w-3 text-success" /> : <Copy className="h-3 w-3" />}
                  {copied ? "Copied!" : "Copy"}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
