import { createFileRoute, Link } from "@tanstack/react-router";
import { DoctorDashboard } from "@/components/careflow/DoctorDashboard";
import { DemoBadge } from "@/components/careflow/demo-badge";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/doctor")({
  head: () => ({
    meta: [
      { title: "Doctor Dashboard — CareFlow AI" },
      { name: "description", content: "AI-prioritised waiting list, referral copilot, and slot recovery." },
    ],
  }),
  component: DoctorPage,
});

function DoctorPage() {
  return (
    <>
      <DemoBadge />
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold tracking-tight">CareFlow AI</span>
          </Link>
          <nav className="flex items-center gap-1">
            <Link to="/doctor" className="rounded-lg bg-primary/8 px-3 py-1.5 text-sm font-semibold text-primary">Doctor</Link>
            <Link to="/patient" className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground hover:bg-muted hover:text-foreground">Patient</Link>
            <Link to="/demo" className="ml-2 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground shadow-sm hover:bg-primary/90">
              Live Demo
            </Link>
          </nav>
        </div>
      </header>
      <DoctorDashboard />
    </>
  );
}
