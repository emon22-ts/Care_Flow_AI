export function DemoBadge() {
  return (
    <div className="pointer-events-none fixed bottom-20 left-1/2 z-50 -translate-x-1/2">
      <div className="inline-flex items-center gap-2 rounded-full border border-warning/30 bg-card/90 px-3.5 py-1.5 text-[11px] font-semibold uppercase tracking-wider text-warning shadow-lg backdrop-blur-md">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-warning" />
        Demo Mode · Synthetic NHS Data
      </div>
    </div>
  );
}
