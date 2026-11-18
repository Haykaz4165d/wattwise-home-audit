import type { CSSProperties, ReactNode } from "react";
import { Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSlide } from "./context";

/** Wraps every slide: 1920×1080 canvas, ambient sparks, footer chrome. */
export function SlideLayout({
  children,
  className,
  chrome = true,
  sparks = 10,
}: {
  children: ReactNode;
  className?: string;
  chrome?: boolean;
  sparks?: number;
}) {
  const { page, total, static: isStatic } = useSlide();
  return (
    <div className={cn("slide-content", isStatic && "slide-static")}>
      <div className="pointer-events-none absolute inset-0">
        {Array.from({ length: sparks }).map((_, i) => (
          <span
            key={i}
            className="spark"
            style={
              {
                left: `${(i * 137) % 100}%`,
                bottom: `-${(i * 53) % 40}px`,
                "--d": i * 900,
                "--dur": `${8 + (i % 5) * 2}s`,
                opacity: isStatic ? 0 : undefined,
              } as CSSProperties
            }
          />
        ))}
      </div>
      <div className={cn("relative h-full w-full", className)}>{children}</div>
      {chrome && (
        <div className="slide-footer absolute inset-x-[96px] bottom-[40px] flex items-center justify-between text-muted-foreground">
          <div className="flex items-center gap-3">
            <Zap className="h-6 w-6 text-primary" />
            <span>11-4 դասարան · Նախագծային աշխատանք</span>
          </div>
          <span className="slide-page slide-num">
            {String(page).padStart(2, "0")} / {String(total).padStart(2, "0")}
          </span>
        </div>
      )}
    </div>
  );
}

/** Small uppercase label above a title. */
export function Kicker({ children, d = 0, tone = "primary" }: { children: ReactNode; d?: number; tone?: "primary" | "accent" | "destructive" | "led" }) {
  const tones = {
    primary: "text-primary border-primary/40 bg-primary/10",
    accent: "text-accent border-accent/40 bg-accent/10",
    destructive: "text-destructive border-destructive/40 bg-destructive/10",
    led: "text-led border-led/40 bg-led/10",
  } as const;
  return (
    <div
      className={cn("slide-kicker a-rise inline-flex items-center gap-3 rounded-full border px-6 py-3", tones[tone])}
      style={{ "--d": d } as CSSProperties}
    >
      {children}
    </div>
  );
}

export const delay = (d: number) => ({ "--d": d }) as CSSProperties;
