import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

export function PhoneFrame({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn("relative mx-auto select-none", className)}>
      {/* Outer shell */}
      <div
        className="relative rounded-[44px] bg-neutral-900 shadow-[0_30px_70px_-15px_oklch(0.1_0.03_260_/_0.5),inset_0_1px_0_oklch(1_0_0_/_0.08)]"
        style={{ width: 375, height: 760, border: "10px solid #1a1a1a" }}
      >
        {/* Side buttons */}
        <div className="absolute -left-[13px] top-24 h-8 w-[3px] rounded-full bg-neutral-700" />
        <div className="absolute -left-[13px] top-36 h-12 w-[3px] rounded-full bg-neutral-700" />
        <div className="absolute -left-[13px] top-52 h-12 w-[3px] rounded-full bg-neutral-700" />
        <div className="absolute -right-[13px] top-36 h-16 w-[3px] rounded-full bg-neutral-700" />

        {/* Dynamic island */}
        <div className="absolute left-1/2 top-2.5 z-20 h-7 w-28 -translate-x-1/2 rounded-full bg-neutral-900 shadow-inner" />

        {/* Screen */}
        <div className="h-full w-full overflow-hidden rounded-[34px] bg-background">
          <div className="flex h-full flex-col">{children}</div>
        </div>
      </div>
    </div>
  );
}
