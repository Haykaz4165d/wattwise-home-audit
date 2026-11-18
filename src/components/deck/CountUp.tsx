import { useEffect, useState } from "react";
import { fmt } from "@/lib/energy";
import { useSlide } from "./context";

/** Animated number that counts up on mount; shows the final value in static mode. */
export function CountUp({ to, digits = 0, duration = 1600, delay = 0 }: { to: number; digits?: number; duration?: number; delay?: number }) {
  const { static: isStatic } = useSlide();
  const [v, setV] = useState(isStatic ? to : 0);
  useEffect(() => {
    if (isStatic) return setV(to);
    let raf = 0;
    const start = performance.now() + delay;
    const tick = (now: number) => {
      const p = Math.min(1, Math.max(0, (now - start) / duration));
      setV(to * (1 - Math.pow(1 - p, 3)));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [to, duration, delay, isStatic]);
  return <>{fmt(v, digits)}</>;
}
