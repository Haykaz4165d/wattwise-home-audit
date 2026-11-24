import { useEffect, useState, type CSSProperties } from "react";
import { QRCodeSVG } from "qrcode.react";
import { Smartphone, Users, Vote } from "lucide-react";
import { Kicker, SlideLayout, delay } from "./SlideLayout";
import { useSlide } from "./context";
import { POLL_QUESTIONS, VOTE_URL, emptyTally, percentages, voterCount, type Tally } from "@/lib/poll";
import { fetchTally } from "@/lib/poll-api";

/** Live poll results; refreshes every 4 s while the slide is on screen. */
function useLiveTally(): Tally {
  const { static: isStatic } = useSlide();
  const [tally, setTally] = useState<Tally>(emptyTally);
  useEffect(() => {
    let alive = true;
    const load = () => fetchTally().then((t) => alive && setTally(t)).catch(() => {});
    load();
    if (isStatic) return () => void (alive = false);
    const id = setInterval(load, 4000);
    return () => {
      alive = false;
      clearInterval(id);
    };
  }, [isStatic]);
  return tally;
}

function QrCard() {
  return (
    <div className="parallax-front perspective">
      <div className="float-3d">
        <div className="a-flip relative overflow-hidden rounded-[36px] bg-foreground p-8 text-background glow" style={delay(250)}>
          <QRCodeSVG value={VOTE_URL} size={400} bgColor="transparent" fgColor="currentColor" level="M" />
          <div className="qr-scan pointer-events-none absolute inset-x-6 top-8 h-[6px] rounded-full" style={{ "--qr-h": "400px" } as CSSProperties} />
        </div>
      </div>
    </div>
  );
}

function ResultBlock({ qi, counts }: { qi: number; counts: number[] }) {
  const q = POLL_QUESTIONS[qi]!;
  const pct = percentages(counts);
  const top = Math.max(...pct);
  return (
    <div className="glass-card a-left rounded-[24px] px-7 py-4" style={delay(300 + qi * 120)}>
      <div className="mb-2 truncate text-[25px] font-bold leading-tight">
        <span className="mr-3 text-primary">{qi + 1}.</span>
        {q.q}
      </div>
      <div className="grid grid-cols-2 gap-x-8 gap-y-2">
        {q.options.map((opt, oi) => (
          <div key={oi}>
            <div className="flex items-baseline justify-between gap-3 text-[21px]">
              <span className="truncate text-muted-foreground">{opt}</span>
              <span className={`slide-num font-bold ${pct[oi] === top && top > 0 ? "text-primary" : "text-foreground"}`}>{pct[oi]}%</span>
            </div>
            <div className="mt-1 h-[9px] overflow-hidden rounded-full bg-secondary/60">
              <div className="bg-energy h-full rounded-full transition-[width] duration-1000 ease-out" style={{ width: `${pct[oi]}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* 17 — Audience poll with QR code and live percentages */
export function PollSlide() {
  const tally = useLiveTally();
  const voters = voterCount(tally);
  return (
    <SlideLayout>
      <div className="absolute left-[110px] top-[100px] flex w-[560px] flex-col items-start">
        <Kicker>
          <Vote className="h-6 w-6" /> Քվեարկություն
        </Kicker>
        <h2 className="slide-title a-rise mt-6" style={delay(120)}>
          Ձեր <span className="text-gradient-energy">կարծիքը</span>
        </h2>
        <div className="mt-8">
          <QrCard />
        </div>
        <p className="slide-body a-rise mt-8 flex items-center gap-3 text-muted-foreground" style={delay(500)}>
          <Smartphone className="h-8 w-8 text-primary" /> Սկանավորեք և քվեարկեք
        </p>
        <div className="a-pop mt-4 inline-flex items-center gap-3 rounded-full border border-accent/40 bg-accent/10 px-6 py-3 text-[28px] text-accent" style={delay(650)}>
          <Users className="h-7 w-7" /> Քվեարկել է՝ <b key={voters} className="slide-num a-pop">{voters}</b>
        </div>
      </div>
      <div className="absolute left-[740px] top-[96px] flex w-[1080px] flex-col gap-[14px]">
        {POLL_QUESTIONS.map((_, qi) => (
          <ResultBlock key={qi} qi={qi} counts={tally[qi] ?? [0, 0, 0, 0]} />
        ))}
      </div>
    </SlideLayout>
  );
}
