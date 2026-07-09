import { useState } from "react";
import { useDemo } from "@/context/DemoContext";
import { PhoneFrame } from "@/components/careflow/phone-frame";
import { PatientStatusCard, Timeline, ReportCard, InfoBanner } from "@/components/careflow/timeline";
import { HealthAssistant } from "@/components/careflow/chatbot";
import { LoadingSkeleton } from "@/components/careflow/primitives";
import { cn } from "@/lib/utils";
import { Home, FileText, Bell, MessageCircle, Upload, CheckCircle2 } from "lucide-react";

type Tab = "home" | "report" | "chat" | "alerts";

export function PatientApp() {
  const [tab, setTab] = useState<Tab>("home");
  const { notifications, markNotificationsRead } = useDemo();
  const unread = notifications.filter((n) => !n.read).length;

  return (
    <PhoneFrame>
      {/* Status bar */}
      <div className="flex items-center justify-between bg-background px-5 pb-1.5 pt-8 text-[11px] font-medium text-muted-foreground">
        <span>9:41</span>
        <span className="font-semibold text-foreground">CareFlow</span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-success" />
        </span>
      </div>

      {/* Page content */}
      <div className="flex-1 overflow-hidden">
        {tab === "home"   && <HomeTab />}
        {tab === "report" && <ReportTab />}
        {tab === "chat"   && <HealthAssistant />}
        {tab === "alerts" && <NotificationsTab />}
      </div>

      {/* Bottom nav */}
      <nav className="grid grid-cols-4 border-t border-border bg-card">
        <TabBtn active={tab === "home"}   onClick={() => setTab("home")}   icon={<Home         className="h-4 w-4" />} label="Home" />
        <TabBtn active={tab === "report"} onClick={() => setTab("report")} icon={<FileText     className="h-4 w-4" />} label="Results" />
        <TabBtn active={tab === "chat"}   onClick={() => setTab("chat")}   icon={<MessageCircle className="h-4 w-4" />} label="Assistant" />
        <TabBtn
          active={tab === "alerts"}
          onClick={() => { setTab("alerts"); markNotificationsRead(); }}
          icon={
            <span className="relative">
              <Bell className={cn("h-4 w-4", unread > 0 && "text-danger")} />
              {unread > 0 && (
                <span className="absolute -right-1.5 -top-1.5 flex h-4 w-4 items-center justify-center rounded-full bg-danger text-[8px] font-bold text-danger-foreground ring-2 ring-card">
                  {unread}
                </span>
              )}
            </span>
          }
          label="Alerts"
        />
      </nav>
    </PhoneFrame>
  );
}

function TabBtn({
  active, icon, label, onClick,
}: {
  active: boolean; icon: React.ReactNode; label: string; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex flex-col items-center gap-0.5 py-2.5 text-[10px] font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring",
        active ? "text-primary" : "text-muted-foreground hover:text-foreground",
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function HomeTab() {
  const {
    patientPosition, patientFlexible, setPatientFlexible,
    patientDistance, setPatientDistance, timelineStep,
  } = useDemo();

  return (
    <div className="h-full space-y-4 overflow-y-auto px-4 py-4">
      <div>
        <p className="text-[11px] text-muted-foreground">Hello,</p>
        <p className="text-xl font-bold text-foreground">Sarah</p>
      </div>

      <PatientStatusCard position={patientPosition} specialty="Cardiology" />

      {/* Journey timeline */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Your journey</p>
        <Timeline step={timelineStep} />
      </div>

      {/* Preferences */}
      <div className="rounded-2xl border border-border bg-card p-4">
        <p className="mb-3 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">Preferences</p>

        {/* Flexible toggle */}
        <div className="flex items-center justify-between rounded-xl bg-muted/30 px-3 py-2.5">
          <div>
            <p className="text-[13px] font-medium text-foreground">Flexible for short notice</p>
            <p className="text-[11px] text-muted-foreground">Let us offer last-minute slots</p>
          </div>
          <button
            role="switch"
            aria-checked={patientFlexible}
            onClick={() => setPatientFlexible(!patientFlexible)}
            className={cn(
              "relative h-6 w-11 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              patientFlexible ? "bg-primary" : "bg-muted",
            )}
          >
            <span className={cn(
              "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition-transform",
              patientFlexible ? "translate-x-5" : "translate-x-0.5",
            )} />
          </button>
        </div>

        {/* Distance slider */}
        <div className="mt-3 px-1">
          <div className="mb-2 flex items-center justify-between">
            <p className="text-[13px] font-medium text-foreground">Willing to travel</p>
            <span className="rounded-md bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
              {patientDistance} mi
            </span>
          </div>
          <input
            type="range"
            min={1}
            max={25}
            value={patientDistance}
            onChange={(e) => setPatientDistance(Number(e.target.value))}
            className="w-full accent-primary"
            aria-label="Willing to travel distance"
          />
        </div>
      </div>

      <InfoBanner tone="success">
        Being flexible increased your chance of a sooner appointment by ~38%.
      </InfoBanner>
    </div>
  );
}

function ReportTab() {
  const [phase, setPhase] = useState<"empty" | "loading" | "loaded">("empty");
  return (
    <div className="h-full space-y-3 overflow-y-auto px-4 py-4">
      <p className="text-lg font-bold text-foreground">Your results</p>

      {phase === "empty" && (
        <button
          onClick={() => { setPhase("loading"); setTimeout(() => setPhase("loaded"), 1200); }}
          className="flex w-full flex-col items-center justify-center gap-2.5 rounded-2xl border-2 border-dashed border-border bg-card px-6 py-10 text-center transition-all hover:border-primary/40 hover:bg-primary/4 active:scale-[0.98]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary">
            <Upload className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-semibold text-foreground">Simulate Upload</p>
            <p className="mt-0.5 text-xs text-muted-foreground">We'll explain each result in plain English</p>
          </div>
        </button>
      )}

      {phase === "loading" && (
        <div className="space-y-2">
          {[1, 2, 3, 4].map((i) => <LoadingSkeleton key={i} className="h-16 w-full" />)}
        </div>
      )}

      {phase === "loaded" && (
        <>
          <InfoBanner>
            <div className="flex items-center gap-2">
              <CheckCircle2 className="h-4 w-4" />
              Blood report received · 5 results
            </div>
          </InfoBanner>
          <ReportCard />
          <div className="rounded-xl border border-warning/25 bg-warning/6 p-3 text-[12px] text-warning leading-relaxed">
            We've shared any borderline results with your care team. This may influence your appointment priority.
          </div>
        </>
      )}
    </div>
  );
}

function NotificationsTab() {
  const { notifications } = useDemo();
  return (
    <div className="h-full space-y-2 overflow-y-auto px-4 py-4">
      <p className="text-lg font-bold text-foreground">Notifications</p>
      {notifications.length === 0 && (
        <div className="rounded-xl border border-dashed border-border bg-muted/20 py-10 text-center">
          <Bell className="mx-auto mb-2 h-8 w-8 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">You're all caught up.</p>
        </div>
      )}
      {notifications.map((n) => (
        <div
          key={n.id}
          className={cn(
            "slide-in-right rounded-xl border p-3",
            n.read ? "border-border bg-card" : "border-primary/25 bg-primary/5",
          )}
        >
          {!n.read && (
            <div className="mb-1.5 flex items-center gap-1">
              <span className="h-1.5 w-1.5 rounded-full bg-primary" />
              <span className="text-[10px] font-bold uppercase tracking-wide text-primary">New</span>
            </div>
          )}
          <p className="text-[13px] font-semibold text-foreground">{n.title}</p>
          <p className="mt-0.5 text-xs text-muted-foreground leading-snug">{n.body}</p>
          <p className="mt-1.5 text-[10px] text-muted-foreground">
            {new Date(n.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </p>
        </div>
      ))}
    </div>
  );
}
