import type { CSSProperties } from "react";
import { FileSpreadsheet, Leaf, Lightbulb, PiggyBank, PlugZap, Presentation, WashingMachine, Zap, BarChart3 } from "lucide-react";
import ledImg from "@/assets/team3-led-savings.jpg";
import billImg from "@/assets/table-bill.jpg";
import defenseImg from "@/assets/deliverables-defense.jpg";
import ecoHomeImg from "@/assets/conclusion-eco-home.jpg";
import townImg from "@/assets/thanks-town.jpg";
import { Backdrop, Kicker, SlideLayout, delay } from "./SlideLayout";
import { CountUp } from "./CountUp";
import { fmt, led, ledScenario, rowTotals, sampleRows, TARIFF_AMD } from "@/lib/energy";

/* 13 — Team 3: LED payback */
export function Team3Slide() {
  const s = ledScenario();
  const months = 12;
  const W = 900;
  const H = 300;
  const maxY = Math.ceil((s.incAmd * months) / 10000) * 10000;
  const x = (m: number) => (m / months) * W;
  const y = (v: number) => H - (v / maxY) * H;
  const incPath = `M ${x(0)} ${y(0)} L ${x(months)} ${y(s.incAmd * months)}`;
  const ledPath = `M ${x(0)} ${y(s.investment)} L ${x(months)} ${y(s.investment + s.ledAmd * months)}`;
  const px = x(s.payback);
  const py = y(s.incAmd * s.payback);
  return (
    <SlideLayout>
      <Backdrop src={ledImg} alt="LED լամպի տեղադրում և խնայողություն" overlay="bg-background/65" />
      <div className="absolute left-[110px] top-[100px] w-[1700px]">
        <Kicker tone="accent">
          <Lightbulb className="h-6 w-6" /> Թիմ 3 · Լուսավորություն և LED
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          {led.lamps} × {led.incandescentW} Վտ → {led.lamps} × {led.ledW} Վտ ={" "}
          <span className="text-gradient-save">
            <CountUp to={s.ratio} digits={1} delay={300} />× քիչ
          </span>
        </h2>
      </div>

      {/* comparison */}
      <div className="absolute left-[110px] top-[350px] flex w-[620px] flex-col gap-6">
        {[
          { label: `Շիկացման ${led.incandescentW} Վտ`, kwh: s.incKwh, amd: s.incAmd, cls: "text-gradient-waste", d: 300 },
          { label: `LED ${led.ledW} Վտ`, kwh: s.ledKwh, amd: s.ledAmd, cls: "text-gradient-save", d: 500 },
        ].map((r) => (
          <div key={r.label} className="a-left glass-card rounded-[32px] px-8 py-6" style={delay(r.d)}>
            <div className="slide-caption text-muted-foreground">{r.label} · ամսական</div>
            <div className="mt-2 flex items-baseline justify-between">
              <span className={`slide-num ${r.cls}`} style={{ fontSize: 60, fontWeight: 800 }}>
                {fmt(r.kwh)} <span className="slide-caption">կՎտ·ժ</span>
              </span>
              <span className="slide-num slide-body font-bold">{fmt(r.amd)} ֏</span>
            </div>
          </div>
        ))}
        <div className="a-zoom bg-save rounded-[32px] px-8 py-6 text-accent-foreground glow-save" style={delay(800)}>
          <div className="slide-caption font-bold">Խնայողություն</div>
          <div className="slide-num mt-1" style={{ fontSize: 58, fontWeight: 800, lineHeight: 1.05 }}>
            <CountUp to={s.savingAmd} delay={900} /> ֏/ամիս
          </div>
          <div className="slide-caption slide-num mt-1">≈ {fmt(s.yearlySavingAmd)} ֏/տարի</div>
        </div>
      </div>

      {/* payback chart */}
      <div className="a-tilt glass-card absolute right-[110px] top-[350px] w-[1050px] rounded-[40px] px-10 py-8" style={delay(400)}>
        <div className="flex items-center justify-between">
          <span className="slide-body font-bold">Մարման ժամկետ (Payback)</span>
          <span className="slide-badge slide-num rounded-full bg-accent/15 px-5 py-2 text-accent">≈ {fmt(s.payback, 1)} ամիս</span>
        </div>
        <svg viewBox={`-80 -20 ${W + 110} ${H + 70}`} className="mt-4 w-full">
          {[0, 0.25, 0.5, 0.75, 1].map((f) => (
            <g key={f}>
              <line x1="0" x2={W} y1={y(maxY * f)} y2={y(maxY * f)} stroke="var(--border)" />
              <text x="-14" y={y(maxY * f) + 7} textAnchor="end" fill="var(--muted-foreground)" fontSize="20" className="slide-num">
                {fmt((maxY * f) / 1000)}k
              </text>
            </g>
          ))}
          {Array.from({ length: months + 1 }).map((_, m) =>
            m % 2 === 0 ? (
              <text key={m} x={x(m)} y={H + 34} textAnchor="middle" fill="var(--muted-foreground)" fontSize="20" className="slide-num">
                {m}
              </text>
            ) : null,
          )}
          <path d={incPath} stroke="var(--destructive)" strokeWidth="6" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="a-draw" style={{ "--len": 1, "--d": 700 } as CSSProperties} />
          <path d={ledPath} stroke="var(--accent)" strokeWidth="6" fill="none" strokeLinecap="round" pathLength={1} strokeDasharray="1" className="a-draw" style={{ "--len": 1, "--d": 900 } as CSSProperties} />
          <line x1={px} x2={px} y1={py} y2={H} stroke="var(--primary)" strokeDasharray="8 8" strokeWidth="2" />
          <g className="a-pop" style={{ ...delay(2400), transformOrigin: `${px}px ${py}px` }}>
            <circle cx={px} cy={py} r="16" fill="var(--primary)" />
            <circle cx={px} cy={py} r="30" fill="none" stroke="var(--primary)" strokeWidth="3" className="pulse-glow" style={{ transformOrigin: `${px}px ${py}px` }} />
          </g>
        </svg>
        <div className="slide-caption mt-2 flex gap-10">
          <span className="flex items-center gap-3">
            <span className="h-2 w-10 rounded-full bg-destructive" /> Շիկացման լամպեր
          </span>
          <span className="flex items-center gap-3">
            <span className="h-2 w-10 rounded-full bg-accent" /> LED (գնում + հոսանք)
          </span>
        </div>
        <p className="slide-chrome mt-3 text-muted-foreground">
          Ենթադրություն՝ {led.hoursPerDay} ժ/օր, LED-ի գինը՝ {fmt(led.ledPriceAmd)} ֏/հատ, սակագին՝ {TARIFF_AMD} ֏/կՎտ·ժ · ամիսներ
        </p>
      </div>
    </SlideLayout>
  );
}

/* 14 — Sample table */
export function TableSlide() {
  const t = rowTotals(sampleRows);
  const head = ["Սարքը", "Քանակ", "P, Վտ", "P, կՎտ", "t, ժ/օր", "կՎտ·ժ/ամիս", "Սակագին", "Արժեք, ֏"];
  return (
    <SlideLayout>
      <Backdrop src={billImg} alt="Էլեկտրաէներգիայի հաշիվ և հաշվիչ" overlay="bg-background/65" />
      <div className="absolute left-[110px] top-[100px] w-[1700px]">
        <Kicker>
          <FileSpreadsheet className="h-6 w-6" /> Excel / Google Sheets ձևանմուշ
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Ընդհանուր <span className="text-gradient-energy">հաշվարկային աղյուսակ</span>
        </h2>
      </div>
      <div className="a-tilt glass-card absolute inset-x-[110px] top-[360px] overflow-hidden rounded-[36px]" style={delay(250)}>
        <table className="w-full">
          <thead>
            <tr className="bg-secondary/80">
              {head.map((h, i) => (
                <th key={h} className={`slide-caption px-6 py-6 font-bold text-primary ${i === 0 ? "text-left" : "text-right"}`}>
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.lines.map((r, i) => (
              <tr key={r.name} className="a-left border-t border-border" style={delay(450 + i * 150)}>
                <td className="slide-caption px-6 py-5 font-bold">{r.name}</td>
                <td className="slide-caption slide-num px-6 text-right">{r.qty}</td>
                <td className="slide-caption slide-num px-6 text-right">{r.watts}</td>
                <td className="slide-caption slide-num px-6 text-right">{r.kw}</td>
                <td className="slide-caption slide-num px-6 text-right">{r.hours}</td>
                <td className="slide-caption slide-num px-6 text-right">{fmt(r.kwh, r.kwh % 1 ? 1 : 0)}</td>
                <td className="slide-caption slide-num px-6 text-right text-muted-foreground">{TARIFF_AMD}</td>
                <td className="slide-caption slide-num px-6 text-right font-bold">{fmt(r.cost)}</td>
              </tr>
            ))}
            <tr className="a-rise border-t-2 border-primary/60 bg-primary/10" style={delay(1100)}>
              <td className="slide-body px-6 py-6 font-bold">ԸՆԴԱՄԵՆԸ</td>
              <td colSpan={4} />
              <td className="slide-body slide-num px-6 text-right font-bold text-primary">{fmt(t.kwh, 1)}</td>
              <td />
              <td className="slide-body slide-num px-6 text-right font-bold text-primary">{fmt(t.cost)}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="a-rise slide-caption absolute bottom-[110px] left-[110px] flex items-center gap-4 text-muted-foreground" style={delay(1300)}>
        <BarChart3 className="h-8 w-8 text-accent" />
        Ամսական էներգիա = P(կՎտ) × t × 30 օր × քանակ · Արդյունքը համեմատում ենք տան իրական կվիտանցիայի հետ
      </div>
    </SlideLayout>
  );
}

/* 15 — Deliverables (isometric stack) */
export function DeliverablesSlide() {
  const layers = [
    { icon: FileSpreadsheet, t: "Ընդհանուր հաշվարկային աղյուսակ", s: "Սարքեր, հզորություններ, ժամեր, կՎտ·ժ, արժեք", cls: "bg-energy" },
    { icon: BarChart3, t: "Standby և LED վերլուծական թերթիկ", s: "Որքան է վատնվում և ինչպես կրճատել", cls: "bg-waste" },
    { icon: Presentation, t: "Խմբային պաշտպանություն", s: "Սահիկաշար և զեկույցներ", cls: "bg-save" },
  ];
  return (
    <SlideLayout>
      <Backdrop src={defenseImg} alt="Աշակերտների խմբային պաշտպանություն" area="right" />
      <div className="absolute left-[110px] top-[100px] w-[800px]">
        <Kicker>Վերջնարդյունքներ</Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Ի՞նչ ենք <span className="text-gradient-energy">ներկայացնում</span>
        </h2>
        <div className="mt-14 space-y-8">
          {layers.map(({ icon: Icon, ...l }, i) => (
            <div key={l.t} className="a-left flex items-start gap-6" style={delay(400 + i * 200)}>
              <div className={`${l.cls} flex h-20 w-20 shrink-0 items-center justify-center rounded-2xl text-primary-foreground`}>
                <Icon className="h-10 w-10" />
              </div>
              <div>
                <div className="slide-body font-bold">{l.t}</div>
                <div className="slide-caption text-muted-foreground">{l.s}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-[180px] top-[200px] h-[700px] w-[760px]" style={{ perspective: 1800 }}>
        <div className="bob h-full w-full preserve-3d">
          <div className="relative h-full w-full preserve-3d" style={{ transform: "rotateX(58deg) rotateZ(-38deg)" }}>
            {layers.map(({ icon: Icon, ...l }, i) => (
              <div
                key={l.t}
                className={`${l.cls} a-fade absolute left-[150px] top-[150px] flex h-[400px] w-[400px] items-center justify-center rounded-[48px] text-primary-foreground glow`}
                style={{ transform: `translateZ(${(2 - i) * 130}px)`, ...delay(300 + (2 - i) * 300) } as CSSProperties}
              >
                <Icon className="h-40 w-40" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* 16 — Conclusion & tips */
export function ConclusionSlide() {
  const tips = [
    { icon: Lightbulb, t: "Փոխարինել բոլոր շիկացման լամպերը LED-ներով", s: "7+ անգամ քիչ էներգիա, մարում 3–4 ամսում", cls: "bg-save" },
    { icon: PlugZap, t: "Անջատել Standby սարքերը վարդակից", s: "Կամ օգտագործել անջատիչով երկարացման լար", cls: "bg-waste" },
    { icon: WashingMachine, t: "Լվացք՝ 30–40°C ռեժիմով", s: "Էներգիայի 90%-ը ծախսվում է ջուրը տաքացնելու վրա", cls: "bg-energy" },
  ];
  return (
    <SlideLayout>
      <Backdrop src={ecoHomeImg} alt="Էներգախնայող տուն" area="top" />
      <div className="absolute inset-x-[110px] top-[100px] text-center">
        <div className="flex justify-center">
          <Kicker tone="accent">
            <PiggyBank className="h-6 w-6" /> Էներգախնայողության ծրագիր
          </Kicker>
        </div>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Մեր <span className="text-gradient-save">3 գլխավոր խորհուրդը</span>
        </h2>
      </div>
      <div className="absolute inset-x-[110px] top-[420px] grid grid-cols-3 gap-12 perspective">
        {tips.map(({ icon: Icon, ...t }, i) => (
          <div key={t.t} className="a-flip glass-card relative flex min-h-[480px] flex-col items-center rounded-[44px] px-10 pb-10 pt-24 text-center" style={delay(350 + i * 250)}>
            <div className="absolute -top-[70px] left-1/2 -translate-x-1/2" style={{ perspective: 600 }}>
              <div className={`${t.cls} float-3d flex h-[140px] w-[140px] items-center justify-center rounded-[36px] text-primary-foreground glow`} style={{ animationDelay: `${i * -2}s` }}>
                <Icon className="h-16 w-16" />
              </div>
            </div>
            <span className="slide-num text-muted-foreground/40" style={{ fontSize: 80, fontWeight: 800, lineHeight: 1 }}>
              0{i + 1}
            </span>
            <h3 className="slide-body mt-4 font-bold leading-tight">{t.t}</h3>
            <p className="slide-caption mt-5 text-muted-foreground">{t.s}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* 17 — Thank you */
export function ThanksSlide() {
  return (
    <SlideLayout sparks={24}>
      <Backdrop src={townImg} alt="Գիշերային քաղաք կանաչ էներգիայով" overlay="bg-background/45" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[560px] grid-floor" />
      <div className="absolute left-1/2 top-[150px] h-[380px] w-[380px] -translate-x-1/2" style={{ perspective: 1000 }}>
        <div className="a-zoom relative h-full w-full preserve-3d" style={delay(100)}>
          {[0, 60, 120].map((r, i) => (
            <div key={r} className="absolute inset-0 preserve-3d" style={{ transform: `rotateY(${r}deg)` }}>
              <div className="orbit" style={{ animationDuration: `${3 + i}s` }} />
            </div>
          ))}
          <div className="pulse-glow bg-save absolute left-1/2 top-1/2 flex h-[150px] w-[150px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-accent-foreground glow-save">
            <Leaf className="h-20 w-20" />
          </div>
        </div>
      </div>
      <div className="absolute inset-x-0 top-[600px] text-center">
        <h2 className="slide-title-lg a-blur" style={delay(300)}>
          <span className="text-gradient-energy">Շնորհակալություն</span>
        </h2>
        <p className="slide-body-lg a-rise mt-8 text-muted-foreground" style={delay(600)}>
          Խնայենք էներգիան՝ խնայենք ընտանեկան բյուջեն <Zap className="inline h-10 w-10 text-primary" />
        </p>
        <p className="slide-body a-rise mt-6" style={delay(800)}>
          Հարցե՞ր
        </p>
      </div>
    </SlideLayout>
  );
}
