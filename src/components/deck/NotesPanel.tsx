import { useEffect, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, RotateCcw, Sparkles } from "lucide-react";
import { generateSpeakerNotes } from "@/lib/speaker-notes.functions";
import { speakerNotes } from "./notes";

const key = (id: string) => `speaker-notes:${id}`;

/** Presenter notes under the slide: AI-written speech, regenerable per slide (kept in this browser). */
export function NotesPanel({ slideId, title, getSlideText }: { slideId: string; title: string; getSlideText: () => string }) {
  const generate = useServerFn(generateSpeakerNotes);
  const [custom, setCustom] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setCustom(localStorage.getItem(key(slideId)));
    setError(null);
    setBusy(false);
  }, [slideId]);

  const text = custom ?? speakerNotes[slideId] ?? "";

  async function regenerate() {
    setBusy(true);
    setError(null);
    try {
      const res = await generate({ data: { title, text: getSlideText() } });
      if (res.notes) {
        localStorage.setItem(key(slideId), res.notes);
        setCustom(res.notes);
      } else setError(res.error);
    } catch {
      setError("Կապի խնդիր կա։ Փորձեք նորից։");
    } finally {
      setBusy(false);
    }
  }

  function reset() {
    localStorage.removeItem(key(slideId));
    setCustom(null);
  }

  return (
    <section aria-label="Ներկայացման խոսք" className="border-t border-border bg-card/90 px-4 py-3 sm:px-6 short-land:w-[42%] short-land:shrink-0 short-land:overflow-y-auto short-land:border-l short-land:border-t-0">
      <div className="mx-auto flex max-w-5xl flex-col gap-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <h2 className="text-xs font-bold uppercase tracking-widest text-primary">Խոսք · {title}</h2>
          <div className="flex items-center gap-2">
            {custom && (
              <button onClick={reset} className="inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs text-muted-foreground hover:bg-secondary hover:text-foreground">
                <RotateCcw className="h-3.5 w-3.5" /> Սկզբնականը
              </button>
            )}
            <button
              onClick={regenerate}
              disabled={busy}
              className="inline-flex items-center gap-1 rounded-full border border-primary/40 bg-primary/10 px-3 py-1 text-xs font-semibold text-primary hover:bg-primary/20 disabled:opacity-60"
            >
              {busy ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Sparkles className="h-3.5 w-3.5" />}
              {busy ? "Գրում է…" : "Նոր տարբերակ AI-ով"}
            </button>
          </div>
        </div>
        {error && <p className="text-xs text-destructive">{error}</p>}
        <p className="max-h-[28vh] overflow-y-auto short-land:max-h-none whitespace-pre-line text-sm leading-relaxed text-foreground sm:text-base">{text}</p>
      </div>
    </section>
  );
}
