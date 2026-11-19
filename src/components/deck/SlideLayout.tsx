import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
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
  const [settled, setSettled] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const t = setTimeout(() => setSettled(true), 4000);
    return () => clearTimeout(t);
  }, []);
  // Mouse parallax (desktop only): writes --mx/--my in [-1, 1]; CSS layers move by different depths.
  useEffect(() => {
    const el = ref.current;
    if (!el || isStatic || !window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    let raf = 0;
    const onMove = (e: PointerEvent) => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const r = el.getBoundingClientRect();
        if (!r.width) return;
        const mx = Math.max(-1, Math.min(1, ((e.clientX - r.left) / r.width) * 2 - 1));
        const my = Math.max(-1, Math.min(1, ((e.clientY - r.top) / r.height) * 2 - 1));
        el.style.setProperty("--mx", mx.toFixed(3));
        el.style.setProperty("--my", my.toFixed(3));
      });
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [isStatic]);
  return (
    <div ref={ref} className={cn("slide-content", isStatic && "slide-static", settled && "slide-settled")}>
      <div className="aurora" aria-hidden />
      <div className="cursor-light" aria-hidden />
      <div className="parallax-mid pointer-events-none absolute inset-0">
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
            <Zap className="zap-flicker h-6 w-6 text-primary" />
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

type BackdropArea = "full" | "right" | "left" | "top";
const backdropBox: Record<BackdropArea, string> = {
  full: "inset-0",
  right: "right-0 top-0 h-full w-[1100px]",
  left: "left-0 top-0 h-full w-[1000px]",
  top: "inset-x-0 top-0 h-[660px]",
};
const backdropOverlay: Record<BackdropArea, string> = {
  full: "bg-background/70",
  right: "bg-background/35",
  left: "bg-background/30",
  top: "bg-background/50",
};
/* Masks fade the photo into whatever is behind it, so no seam shows on the slide's own gradient. */
const backdropMask: Record<BackdropArea, string | undefined> = {
  full: undefined,
  right: "linear-gradient(to right, transparent, black 55%)",
  left: "linear-gradient(to left, transparent, black 55%)",
  top: "linear-gradient(to bottom, black 35%, transparent)",
};

/** Slow-zooming photo behind slide content, faded into the slide background. */
export function Backdrop({ src, alt, area = "full", overlay }: { src: string; alt: string; area?: BackdropArea; overlay?: string }) {
  return (
    <div
      className={cn("pointer-events-none absolute overflow-hidden", backdropBox[area])}
      style={{ maskImage: backdropMask[area], WebkitMaskImage: backdropMask[area] }}
    >
      <img src={src} alt={alt} width={1600} height={912} className="ken-burns parallax-back h-full w-full object-cover" />
      <div className={cn("absolute inset-0", overlay ?? backdropOverlay[area])} />
      {area === "full" && <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-background/60" />}
    </div>
  );
}

/** Tilted, floating framed photo for free areas of a slide. */
export function FloatingPhoto({ src, alt, className, d = 150 }: { src: string; alt: string; className: string; d?: number }) {
  return (
    <div className={cn("parallax-front absolute perspective", className)}>
      <div className="float-3d h-full w-full">
        <div className="a-blur h-full w-full overflow-hidden rounded-[40px] border border-border glow" style={delay(d)}>
          <img src={src} alt={alt} width={1600} height={912} className="ken-burns h-full w-full object-cover" />
        </div>
      </div>
    </div>
  );
}
