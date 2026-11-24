import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2, Send, Zap } from "lucide-react";
import { POLL_QUESTIONS } from "@/lib/poll";
import { hasVoted, submitVote } from "@/lib/poll-api";
import { cn } from "@/lib/utils";

const TITLE = "Քվեարկություն · Էներգաարդյունավետություն — 11-4 դասարան";
const DESC = "5 հարց կենցաղային էլեկտրասարքերի էներգասպառման մասին։ Քվեարկեք և տեսեք արդյունքները տոկոսներով։";

export const Route = createFileRoute("/vote")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESC },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESC },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: VotePage,
});

function VotePage() {
  const [answers, setAnswers] = useState<(number | undefined)[]>(() => POLL_QUESTIONS.map(() => undefined));
  const [done, setDone] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    if (hasVoted()) setDone(true);
  }, []);

  const answered = answers.filter((a) => a !== undefined).length;
  const complete = answered === POLL_QUESTIONS.length;

  async function send() {
    if (!complete) return;
    setBusy(true);
    setError(null);
    try {
      const res = await submitVote(answers as number[]);
      if (res === "already") setNote("Այս սարքից արդեն քվեարկել եք։");
      setDone(true);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch {
      setError("Չհաջողվեց ուղարկել։ Ստուգեք ինտերնետը և փորձեք նորից։");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="min-h-screen bg-ink px-4 py-8 text-foreground sm:py-12">
      <div className="mx-auto flex max-w-xl flex-col gap-6">
        <header className="flex flex-col gap-3">
          <div className="inline-flex w-fit items-center gap-2 rounded-full border border-primary/40 bg-primary/10 px-4 py-1.5 text-xs font-bold uppercase tracking-widest text-primary">
            <Zap className="h-4 w-4" /> 11-4 դասարան · Քվեարկություն
          </div>
          <h1 className="font-display text-2xl font-extrabold leading-tight sm:text-3xl">
            {done ? "Շնորհակալություն" : "Ինչպե՞ս եք դուք օգտագործում էլեկտրաէներգիան"}
          </h1>
          {!done && (
            <p className="text-sm text-muted-foreground">Ընտրեք մեկ պատասխան յուրաքանչյուր հարցի համար, ապա սեղմեք «Ուղարկել»։</p>
          )}
          {done && (
            <p className="flex items-center gap-2 rounded-xl border border-accent/40 bg-accent/10 px-4 py-3 text-sm text-accent">
              <CheckCircle2 className="h-5 w-5 shrink-0" /> {note ?? "Ձեր քվեն պահպանված է։ Արդյունքները կտեսնեք ներկայացման էկրանին։"}
            </p>
          )}
        </header>

        {!done && POLL_QUESTIONS.map((q, qi) => {
          return (
            <section key={qi} className="rounded-2xl border border-border bg-card/80 p-4 shadow-lg sm:p-5">
              <h2 className="mb-3 text-base font-bold leading-snug">
                <span className="mr-2 text-primary">{qi + 1}.</span>
                {q.q}
              </h2>
              <div className="flex flex-col gap-2">
                {q.options.map((opt, oi) =>
                  (
                    <button
                      key={oi}
                      type="button"
                      aria-pressed={answers[qi] === oi}
                      onClick={() => setAnswers((a) => a.map((v, i) => (i === qi ? oi : v)))}
                      className={cn(
                        "flex items-center gap-3 rounded-xl border px-4 py-3 text-left text-sm transition",
                        answers[qi] === oi ? "border-primary bg-primary/15 text-foreground" : "border-border bg-secondary/30 hover:border-primary/50",
                      )}
                    >
                      <span className={cn("flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2", answers[qi] === oi ? "border-primary" : "border-muted-foreground/50")}>
                        {answers[qi] === oi && <span className="h-2.5 w-2.5 rounded-full bg-primary" />}
                      </span>
                      {opt}
                    </button>
                  ),
                )}
              </div>
            </section>
          );
        })}

        {!done && (
          <div className="sticky bottom-4 flex flex-col gap-2">
            {error && <p className="rounded-lg bg-destructive/15 px-3 py-2 text-sm text-destructive">{error}</p>}
            <button
              type="button"
              onClick={send}
              disabled={!complete || busy}
              className="bg-energy inline-flex h-14 items-center justify-center gap-2 rounded-2xl text-base font-bold text-primary-foreground shadow-lg transition disabled:opacity-50"
            >
              {busy ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5" />}
              {complete ? "Ուղարկել" : `Պատասխանված է ${answered} / ${POLL_QUESTIONS.length}`}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
