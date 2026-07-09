import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Sparkles, Activity, Users, Shield, Zap, Clock, ChevronRight } from "lucide-react";

export const Route = createFileRoute("/")({
  component: Landing,
});

const features = [
  {
    icon: <Sparkles className="h-5 w-5" />,
    title: "AI Prioritisation",
    body: "Explainable ranking of every waiting patient using clinical, behavioural, and logistical signals.",
    color: "text-primary bg-primary/8",
  },
  {
    icon: <Zap className="h-5 w-5" />,
    title: "Slot Recovery",
    body: "When a cancellation happens, we find the best-fit patient in seconds — with full reasoning.",
    color: "text-warning bg-warning/8",
  },
  {
    icon: <Users className="h-5 w-5" />,
    title: "Patient Companion",
    body: "A calm, plain-English app that keeps people informed and in control of their care.",
    color: "text-success bg-success/8",
  },
];

const stats = [
  { value: "38%", label: "Earlier appointments" },
  { value: "2.4s", label: "Slot recovery time" },
  { value: "99%", label: "AI accuracy" },
  { value: "47k", label: "Patients helped" },
];

function Landing() {
  return (
    <div className="min-h-screen bg-background">
      {/* Subtle grid background */}
      <div
        className="pointer-events-none fixed inset-0 opacity-[0.025]"
        style={{
          backgroundImage: `linear-gradient(var(--color-foreground) 1px, transparent 1px), linear-gradient(90deg, var(--color-foreground) 1px, transparent 1px)`,
          backgroundSize: "64px 64px",
        }}
      />

      {/* Glow orbs */}
      <div className="pointer-events-none fixed left-1/4 top-0 h-[600px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/6 blur-[120px]" />
      <div className="pointer-events-none fixed right-1/4 top-1/3 h-[400px] w-[400px] rounded-full bg-secondary/6 blur-[100px]" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-6 py-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-md shadow-primary/25">
            <Activity className="h-4 w-4" />
          </div>
          <span className="text-[15px] font-bold tracking-tight">CareFlow AI</span>
        </div>
        <nav className="flex items-center gap-1">
          <Link
            to="/doctor"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Doctor
          </Link>
          <Link
            to="/patient"
            className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
          >
            Patient
          </Link>
          <Link
            to="/demo"
            className="ml-2 inline-flex items-center gap-1.5 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-md hover:shadow-primary/25 active:scale-95"
          >
            Live Demo <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </nav>
      </header>

      {/* Hero */}
      <main className="relative z-10 mx-auto max-w-6xl px-6">
        <div className="mx-auto max-w-3xl pt-20 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-muted-foreground shadow-sm">
            <span className="flex h-1.5 w-1.5 rounded-full bg-success glow-pulse" />
            <span className="text-foreground font-semibold">NHS Digital Innovation</span>
            <span>·</span>
            <Shield className="h-3 w-3" />
            GDPR Compliant
          </div>

          {/* Headline */}
          <h1 className="mt-8 text-5xl font-bold tracking-tight text-foreground md:text-6xl lg:text-7xl">
            Smarter care.{" "}
            <span className="relative">
              <span className="bg-gradient-to-r from-primary via-secondary to-primary bg-clip-text text-transparent">
                Shorter waits.
              </span>
              <span className="absolute -bottom-1 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary/30 to-transparent" />
            </span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
            An AI copilot that helps NHS teams prioritise appointments, recover cancelled slots,
            and keep patients informed — end to end.
          </p>

          {/* CTAs */}
          <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
            <Link
              to="/demo"
              className="group inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-xl hover:shadow-primary/25 hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
            >
              Launch Live Demo
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Link>
            <Link
              to="/doctor"
              className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-6 py-3 text-sm font-semibold text-foreground shadow-sm transition-all hover:bg-muted hover:shadow-md hover:-translate-y-0.5 active:translate-y-0"
            >
              <Users className="h-4 w-4 text-muted-foreground" />
              Explore Doctor View
              <ChevronRight className="h-3.5 w-3.5 text-muted-foreground transition-transform group-hover:translate-x-0.5" />
            </Link>
          </div>

          {/* Trust note */}
          <p className="mt-6 text-xs text-muted-foreground">
            Synthetic data only · No real patient information
          </p>
        </div>

        {/* Stats row */}
        <div className="mt-20 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.label}
              className="rounded-2xl border border-border bg-card p-5 text-center shadow-sm"
            >
              <p className="text-3xl font-bold tracking-tight text-foreground">{s.value}</p>
              <p className="mt-1 text-xs text-muted-foreground">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Feature cards */}
        <div className="mt-8 grid gap-4 md:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="card-lift hover:card-lift-hover group rounded-2xl border border-border bg-card p-6 shadow-sm"
            >
              <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-xl ${f.color}`}>
                {f.icon}
              </div>
              <h3 className="text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.body}</p>
              <div className="mt-4 flex items-center gap-1 text-xs font-medium text-primary opacity-0 transition-opacity group-hover:opacity-100">
                Learn more <ChevronRight className="h-3.5 w-3.5" />
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mb-8 mt-8 overflow-hidden rounded-2xl border border-primary/20 bg-gradient-to-br from-primary/5 via-card to-secondary/5 p-8 text-center shadow-sm">
          <Clock className="mx-auto mb-3 h-8 w-8 text-primary" />
          <h2 className="text-xl font-bold text-foreground">See it in action</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Doctor and patient views share live state — one action on the left changes the phone on the right.
          </p>
          <Link
            to="/demo"
            className="mt-5 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground shadow-md shadow-primary/20 transition-all hover:bg-primary/90 hover:-translate-y-0.5"
          >
            Open Live Demo <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </main>
    </div>
  );
}
