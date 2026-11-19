import { useLayoutEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { SlideContext } from "./context";

/** Renders a 1920×1080 slide scaled to fit its container. */
export function ScaledSlide({
  children,
  page,
  total,
  isStatic = false,
}: {
  children: ReactNode;
  page: number;
  total: number;
  isStatic?: boolean;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const ctx = useMemo(() => ({ page, total, static: isStatic }), [page, total, isStatic]);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const update = () => setScale(Math.min(el.clientWidth / 1920, el.clientHeight / 1080));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return (
    <div ref={ref} className="relative h-full w-full overflow-hidden">
      <div
        className="absolute left-1/2 top-1/2"
        style={{
          width: 1920,
          height: 1080,
          marginLeft: -960,
          marginTop: -540,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
          visibility: scale ? "visible" : "hidden",
        }}
      >
        <SlideContext.Provider value={ctx}>{children}</SlideContext.Provider>
      </div>
    </div>
  );
}
