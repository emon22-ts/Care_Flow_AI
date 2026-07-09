import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { DoctorDashboard } from "@/components/careflow/DoctorDashboard";
import { PatientApp } from "@/components/careflow/PatientApp";
import { DemoBadge } from "@/components/careflow/demo-badge";
import { Activity } from "lucide-react";

export const Route = createFileRoute("/demo")({
  head: () => ({
    meta: [
      { title: "Live Demo — CareFlow AI" },
      { name: "description", content: "Watch doctor and patient interfaces respond in real time." },
    ],
  }),
  component: DemoPage,
});

function DemoPage() {
  return (
    <div className="min-h-screen bg-muted/30">
      <DemoBadge />

      {/* Sticky header */}
      <header className="sticky top-0 z-30 border-b border-border bg-card/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-[1800px] items-center justify-between px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
              <Activity className="h-3.5 w-3.5" />
            </div>
            <span className="font-bold tracking-tight text-foreground">CareFlow AI</span>
            <span className="hidden text-xs text-muted-foreground md:inline">· Live Demo</span>
          </Link>
          <div className="flex items-center gap-5 text-xs text-muted-foreground">
            <LiveClock />
            <span className="hidden md:inline">Last synced just now</span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-success" />
              AI · Connected
            </span>
          </div>
        </div>
      </header>

      {/* Split layout */}
      <div className="mx-auto grid max-w-[1800px] gap-5 px-4 py-5 lg:grid-cols-[minmax(0,65fr)_minmax(0,35fr)]">
        <div className="overflow-hidden rounded-2xl border border-border bg-background shadow-sm">
          <DoctorDashboard compact />
        </div>
        <div className="lg:sticky lg:top-[57px] lg:h-[calc(100vh-5rem)]">
          <div className="flex h-full items-start justify-center pt-4">
            <PatientApp />
          </div>
        </div>
      </div>
    </div>
  );
}

function formatTime() {
  return new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function LiveClock() {
  const [t, setT] = useState(formatTime);
  useEffect(() => {
    const id = setInterval(() => setT(formatTime()), 1000);
    return () => clearInterval(id);
  }, []);
  return <span className="hidden font-mono md:inline">{t}</span>;
}
