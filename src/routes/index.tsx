import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronLeft, ChevronRight, Download, LayoutGrid, Maximize, Minimize, NotebookPen, X } from "lucide-react";
import { NotesPanel } from "@/components/deck/NotesPanel";
import { slides } from "@/components/deck/registry";
import { ScaledSlide } from "@/components/deck/ScaledSlide";
import { cn } from "@/lib/utils";

const TITLE = "Կենցաղային էլեկտրասարքերի էներգաարդյունավետություն — 11-4 դասարան";
const DESC = "Նախագծային աշխատանքի պրեզենտացիա՝ տնային տնտեսության էներգասպառման աուդիտ, Standby ռեժիմ և LED լամպերի խնայողություն։";

export const Route = createFileRoute("/")({
  validateSearch: (s: Record<string, unknown>): { slide?: number } => {
    const n = Number(s["slide"]);
    return Number.isFinite(n) && n >= 1 ? { slide: Math.floor(n) } : {};
  },
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Deck,
});

function Deck() {
  const { slide = 1 } = Route.useSearch();
  const navigate = useNavigate({ from: "/" });
  const total = slides.length;
  const index = Math.min(Math.max(slide, 1), total) - 1;
  const [grid, setGrid] = useState(false);
  const [fs, setFs] = useState(false);
  const [idle, setIdle] = useState(false);
  const [notes, setNotes] = useState(true);
  const rootRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (localStorage.getItem("deck:notes") === "off") setNotes(false);
  }, []);
  const toggleNotes = () =>
    setNotes((n) => {
      localStorage.setItem("deck:notes", n ? "off" : "on");
      return !n;
    });

  const go = useCallback(
    (i: number) => {
      const next = Math.min(Math.max(i, 0), total - 1);
      navigate({ search: { slide: next + 1 }, replace: true });
    },
    [navigate, total],
  );

  useEffect(() => {
    document.title = `${index + 1}/${total} — ${slides[index]!.title}`;
  }, [index, total]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (["ArrowRight", "PageDown", " ", "Enter"].includes(e.key)) {
        e.preventDefault();
        go(index + 1);
      } else if (["ArrowLeft", "PageUp", "Backspace"].includes(e.key)) {
        e.preventDefault();
        go(index - 1);
      } else if (e.key === "Home") go(0);
      else if (e.key === "End") go(total - 1);
      else if (e.key.toLowerCase() === "g") setGrid((g) => !g);
      else if (e.key.toLowerCase() === "n") toggleNotes();
      else if (e.key.toLowerCase() === "f" || e.key === "F5") {
        e.preventDefault();
        toggleFs();
      } else if (e.key === "Escape") setGrid(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  useEffect(() => {
    const onFs = () => setFs(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onFs);
    return () => document.removeEventListener("fullscreenchange", onFs);
  }, []);

  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const wake = () => {
      setIdle(false);
      clearTimeout(t);
      t = setTimeout(() => setIdle(true), 2500);
    };
    wake();
    window.addEventListener("mousemove", wake);
    window.addEventListener("touchstart", wake);
    return () => {
      clearTimeout(t);
      window.removeEventListener("mousemove", wake);
      window.removeEventListener("touchstart", wake);
    };
  }, []);

  function toggleFs() {
    if (document.fullscreenElement) document.exitFullscreen();
    else rootRef.current?.requestFullscreen?.().catch(() => {});
  }

  // Touch swipe: left = next, right = previous
  const touch = useRef<{ x: number; y: number } | null>(null);
  const onTouchStart = (e: React.TouchEvent) => {
    touch.current = { x: e.touches[0]!.clientX, y: e.touches[0]!.clientY };
  };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (!touch.current) return;
    const dx = e.changedTouches[0]!.clientX - touch.current.x;
    const dy = e.changedTouches[0]!.clientY - touch.current.y;
    if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) go(index + (dx < 0 ? 1 : -1));
    touch.current = null;
  };

  // Direction of the last move, for the 3D slide-change transition.
  const prevIndex = useRef(index);
  const dir = index >= prevIndex.current ? 1 : -1;
  useEffect(() => {
    prevIndex.current = index;
  }, [index]);

  const current = slides[index]!;
  const { Component } = current;
  const hideUi = fs && idle;

  return (
    <div ref={rootRef} className={cn("fixed inset-0 flex flex-col bg-ink", hideUi && "cursor-none")} onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}>
      {/* progress */}
      <div className="h-1 w-full bg-secondary/40">
        <div className="bg-energy h-full transition-all duration-500" style={{ width: `${((index + 1) / total) * 100}%` }} />
      </div>

      <div className="flex min-h-0 flex-1 flex-col short-land:flex-row">
      <main className={cn("relative min-h-0 min-w-0 flex-1", fs ? "p-0" : "p-2 sm:p-6")}>
        <div ref={stageRef} className="relative h-full w-full">
          <DeckStage key={index} dir={dir}>
            <ScaledSlide page={index + 1} total={total}>
              <Component />
            </ScaledSlide>
          </DeckStage>
          <button aria-label="Նախորդ սլայդ" onClick={() => go(index - 1)} className="absolute inset-y-0 left-0 w-1/5 cursor-w-resize" />
          <button aria-label="Հաջորդ սլայդ" onClick={() => go(index + 1)} className="absolute inset-y-0 right-0 w-1/5 cursor-e-resize" />
        </div>
      </main>

      {notes && !fs && (
        <NotesPanel
          slideId={current.id}
          title={current.title}
          getSlideText={() => (stageRef.current?.querySelector(".slide-content") as HTMLElement | null)?.innerText ?? current.title}
        />
      )}
      </div>

      <nav
        className={cn(
          "flex items-center justify-between gap-2 border-t border-border bg-background/80 px-3 py-2 backdrop-blur transition-opacity sm:px-6",
          hideUi && "pointer-events-none opacity-0",
          fs && "absolute inset-x-0 bottom-0",
        )}
      >
        <div className="hidden min-w-0 truncate text-sm text-muted-foreground sm:block">{current.title}</div>
        <div className="flex items-center gap-1 sm:gap-2">
          <CtrlButton label="Նախորդ" onClick={() => go(index - 1)} disabled={index === 0}>
            <ChevronLeft className="h-5 w-5" />
          </CtrlButton>
          <span className="slide-num min-w-[72px] text-center text-sm text-foreground">
            {index + 1} / {total}
          </span>
          <CtrlButton label="Հաջորդ" onClick={() => go(index + 1)} disabled={index === total - 1}>
            <ChevronRight className="h-5 w-5" />
          </CtrlButton>
        </div>
        <div className="flex items-center gap-1 sm:gap-2">
          <CtrlButton label="Խոսքի նշումներ (N)" onClick={toggleNotes} active={notes}>
            <NotebookPen className="h-5 w-5" />
          </CtrlButton>
          <CtrlButton label="Բոլոր սլայդները (G)" onClick={() => setGrid(true)}>
            <LayoutGrid className="h-5 w-5" />
          </CtrlButton>
          <CtrlButton label="PDF" onClick={() => window.open("/print", "_blank")}>
            <Download className="h-5 w-5" />
          </CtrlButton>
          <CtrlButton label="Լիաէկրան (F)" onClick={toggleFs}>
            {fs ? <Minimize className="h-5 w-5" /> : <Maximize className="h-5 w-5" />}
          </CtrlButton>
        </div>
      </nav>

      {grid && (
        <div className="absolute inset-0 z-50 overflow-y-auto bg-ink/95 p-4 backdrop-blur sm:p-10">
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-lg font-bold text-foreground">Բոլոր սլայդները</h2>
            <CtrlButton label="Փակել" onClick={() => setGrid(false)}>
              <X className="h-5 w-5" />
            </CtrlButton>
          </div>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {slides.map((s, i) => (
              <button
                key={s.id}
                onClick={() => {
                  go(i);
                  setGrid(false);
                }}
                className={cn(
                  "group overflow-hidden rounded-xl border text-left transition hover:-translate-y-1 hover:border-primary",
                  i === index ? "border-primary glow" : "border-border",
                )}
              >
                <div className="aspect-video">
                  <ScaledSlide page={i + 1} total={total} isStatic>
                    <s.Component />
                  </ScaledSlide>
                </div>
                <div className="flex gap-2 bg-card px-3 py-2 text-sm text-card-foreground">
                  <span className="slide-num text-primary">{i + 1}</span>
                  <span className="truncate">{s.title}</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/** 3D page-turn on slide change. The class is dropped after 1.2 s so a stalled animation can never leave the slide hidden. */
function DeckStage({ dir, children }: { dir: number; children: React.ReactNode }) {
  const [entering, setEntering] = useState(true);
  const [from] = useState(dir); // fixed at mount so later re-renders don't flip the direction
  useEffect(() => {
    const t = setTimeout(() => setEntering(false), 1200);
    return () => clearTimeout(t);
  }, []);
  return <div className={cn("deck-stage absolute inset-0", entering && (from > 0 ? "deck-in-next" : "deck-in-prev"))}>{children}</div>;
}

function CtrlButton({ label, onClick, disabled, active, children }: { label: string; onClick: () => void; disabled?: boolean; active?: boolean; children: React.ReactNode }) {
  return (
    <button
      aria-label={label}
      title={label}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={active}
      className={cn(
        "inline-flex h-10 w-10 items-center justify-center rounded-full text-foreground transition hover:bg-secondary hover:text-primary disabled:opacity-30",
        active && "bg-secondary text-primary",
      )}
    >
      {children}
    </button>
  );
}
