
import {
  BatteryCharging,
  ClipboardList,
  Lightbulb,
  Moon,
  Refrigerator,
  Search,
  Target,
  Tv,
  Users,
  Zap,
} from "lucide-react";
import house from "@/assets/house-energy.jpg";
import goalImg from "@/assets/goal-audit.jpg";
import questionImg from "@/assets/question-room.jpg";
import meterImg from "@/assets/tasks-meter.jpg";
import circuitImg from "@/assets/formulas-circuit.jpg";
import kitchenImg from "@/assets/kitchen-appliances.jpg";
import standbyImg from "@/assets/standby-devices.jpg";
import bulbsImg from "@/assets/bulbs-compare.jpg";
import { Backdrop, FloatingPhoto, Kicker, SlideLayout, delay } from "./SlideLayout";
import { TARIFF_AMD } from "@/lib/energy";

/* 1 — Title */
export function TitleSlide() {
  return (
    <SlideLayout sparks={18}>
      <div className="parallax-front absolute right-[40px] top-[80px] h-[880px] w-[1080px] perspective">
        <div className="float-3d h-full w-full">
          <div className="a-blur relative h-full w-full overflow-hidden rounded-[48px] glow" style={delay(200)}>
            <img src={house} alt="Տան էլեկտրացանցի եռաչափ պատկեր" width={1536} height={1024} className="ken-burns h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/30 to-transparent" />
          </div>
        </div>
      </div>
      <div className="absolute left-[110px] top-[150px] w-[1080px]">
        <Kicker>
          <Zap className="h-6 w-6" /> 11-4 դասարան · Նախագծային աշխատանք
        </Kicker>
        <h1 className="slide-title a-rise mt-12" style={delay(150)}>
          Կենցաղային էլեկտրասարքերի
          <br />
          <span className="text-gradient-energy">էներգիաարդյունավետության</span>
          <br />
          հետազոտություն
        </h1>
        <p className="slide-body-lg a-rise mt-12 max-w-[860px] text-muted-foreground" style={delay(400)}>
          Տնային տնտեսության էներգասպառման աուդիտ
        </p>
        <div className="a-rise mt-14 flex gap-5" style={delay(600)}>
          {["P = U · I", "A = P · t", "կՎտ·ժ → ֏"].map((f) => (
            <span key={f} className="slide-badge slide-num glass-card rounded-full px-7 py-3 text-primary">
              {f}
            </span>
          ))}
        </div>
      </div>
    </SlideLayout>
  );
}

/* 2 — Goal */
export function GoalSlide() {
  const faces = [
    { t: "P = U·I", tr: "translateZ(170px)" },
    { t: "A = P·t", tr: "rotateY(90deg) translateZ(170px)" },
    { t: "կՎտ·ժ", tr: "rotateY(180deg) translateZ(170px)" },
    { t: "֏", tr: "rotateY(-90deg) translateZ(170px)" },
    { t: "LED", tr: "rotateX(90deg) translateZ(170px)" },
    { t: "Վտ", tr: "rotateX(-90deg) translateZ(170px)" },
  ];
  return (
    <SlideLayout>
      <Backdrop src={goalImg} alt="Աշակերտը չափում է տան էլեկտրական վահանակը" area="right" />
      <div className="absolute left-[110px] top-[110px] w-[1040px]">
        <Kicker>
          <Target className="h-6 w-6" /> Նպատակը
        </Kicker>
        <blockquote className="slide-subtitle a-rise mt-10 font-serif font-medium" style={delay(150)}>
          «Մեր նպատակն էր ոչ թե ուղղակի բանաձևեր սովորել, այլ հասկանալ, թե{" "}
          <span className="text-gradient-energy">որտեղ է ծախսվում էլեկտրաէներգիան</span> մեր տներում և ինչպես կրճատել ընտանեկան
          ծախսերը»։
        </blockquote>
        <div className="mt-14 grid grid-cols-3 gap-6">
          {[
            ["01", "Հզորությունների հաշվառում"],
            ["02", "Ամսական ծախսերի վերլուծություն"],
            ["03", "Անցում LED լամպերի և խնայողության հաշվարկ"],
          ].map(([n, t], i) => (
            <div key={n} className="a-tilt glass-card rounded-3xl p-8" style={delay(450 + i * 150)}>
              <div className="slide-num slide-body text-primary">{n}</div>
              <div className="slide-caption mt-4">{t}</div>
            </div>
          ))}
        </div>
      </div>
      <div className="absolute right-[230px] top-[330px] h-[340px] w-[340px]" style={{ perspective: 1400 }}>
        <div className="a-zoom h-full w-full preserve-3d" style={delay(300)}>
          <div className="cube h-full w-full">
            {faces.map((f) => (
              <div key={f.t} className="cube-face slide-num rounded-2xl text-primary" style={{ transform: f.tr, fontSize: 60 }}>
                {f.t}
              </div>
            ))}
          </div>
        </div>
        <div className="pulse-glow absolute -bottom-[180px] left-1/2 h-[60px] w-[380px] -translate-x-1/2 rounded-[50%] bg-primary/30 blur-2xl" />
      </div>
    </SlideLayout>
  );
}

/* 3 — Where do we need physics? */
export function QuestionSlide() {
  const cards = [
    { icon: Search, t: "Որ սարքերն են «լռելյայն» ծախսում ընտանեկան բյուջեն" },
    { icon: Moon, t: "Որքան էներգիա է իզուր կորչում «սպասման» ռեժիմում" },
    { icon: Lightbulb, t: "Ինչու է LED-ով փոխարինելը շահավետ ներդրում" },
  ];
  return (
    <SlideLayout>
      <Backdrop src={questionImg} alt="Ֆիզիկական բանաձևեր տան սարքերի վրա" overlay="bg-gradient-to-r from-background via-background/80 to-background/30" />
      <div className="absolute right-[120px] top-[40px] perspective">
        <div className="bob slide-num select-none" style={{ fontSize: 520, lineHeight: 1, fontWeight: 900 }}>
          <span className="a-flip text-gradient-energy inline-block" style={delay(100)}>
            ?
          </span>
        </div>
      </div>
      <div className="absolute left-[110px] top-[120px] w-[1300px]">
        <Kicker>Իրական կյանքի ֆիզիկա</Kicker>
        <h2 className="slide-title a-rise mt-10" style={delay(150)}>
          «Իսկ որտե՞ղ է մեզ պետք գալու
          <br />
          ֆիզիկան»
        </h2>
        <p className="slide-body-lg a-rise mt-8 text-muted-foreground" style={delay(300)}>
          Մեր նախագիծը հենց այդ հարցի ուղիղ պատասխանն է։
        </p>
      </div>
      <div className="absolute inset-x-[110px] top-[600px] grid grid-cols-3 gap-10 perspective">
        {cards.map(({ icon: Icon, t }, i) => (
          <div key={t} className="a-flip glass-card flex min-h-[260px] flex-col gap-6 rounded-[36px] p-10" style={delay(500 + i * 200)}>
            <div className="bg-energy flex h-20 w-20 items-center justify-center rounded-2xl text-primary-foreground glow">
              <Icon className="h-10 w-10" />
            </div>
            <p className="slide-body">{t}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* 4 — Objectives */
export function TasksSlide() {
  const tasks = [
    "Գույքագրել կենցաղային էլեկտրական սարքերը և հաշվարկել դրանց էներգասպառումը",
    "Ուսումնասիրել Standby («սպասման») ռեժիմում կորչող էներգիայի ծավալները",
    "Համեմատել շիկացման և LED լամպերի արդյունավետությունը՝ հաշվարկելով խնայողությունը",
    "Ձևակերպել ընտանեկան բյուջեի խնայողության երկարաժամկետ ծրագիր",
  ];
  return (
    <SlideLayout>
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[520px] grid-floor" />
      <FloatingPhoto src={meterImg} alt="Էլեկտրահաշվիչ կՎտ·ժ ցուցմունքով" className="right-[110px] top-[80px] h-[280px] w-[760px]" />
      <div className="absolute left-[110px] top-[110px]">
        <Kicker>
          <ClipboardList className="h-6 w-6" /> Խնդիրները
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Ի՞նչ ենք <span className="text-gradient-energy">անելու</span>
        </h2>
      </div>
      <div className="absolute inset-x-[110px] top-[400px] grid grid-cols-2 gap-10 perspective">
        {tasks.map((t, i) => (
          <div key={t} className="a-tilt glass-card flex min-h-[230px] items-start gap-8 rounded-[36px] p-10" style={delay(300 + i * 160)}>
            <span className="slide-num text-gradient-energy" style={{ fontSize: 96, lineHeight: 0.9, fontWeight: 800 }}>
              {i + 1}
            </span>
            <p className="slide-body pt-2">{t}</p>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* 5 — Formulas */
export function FormulasSlide() {
  return (
    <SlideLayout sparks={14}>
      <Backdrop src={circuitImg} alt="Վոլտմետր և ամպերմետր էլեկտրական շղթայում" area="left" />
      <div className="absolute left-[110px] top-[110px]">
        <Kicker>Բանաձևերի վերհիշում</Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Ֆիզիկան, որ <span className="text-gradient-energy">վճարում ենք</span>
        </h2>
      </div>
      {/* 3D atom */}
      <div className="absolute left-[200px] top-[380px] h-[480px] w-[480px]" style={{ perspective: 1000 }}>
        <div className="a-zoom relative h-full w-full preserve-3d" style={delay(200)}>
          {[0, 60, 120].map((r, i) => (
            <div key={r} className="absolute inset-0 preserve-3d" style={{ transform: `rotateY(${r}deg)` }}>
              <div className="orbit" style={{ animationDuration: `${4 + i * 1.5}s` }} />
            </div>
          ))}
          <div className="pulse-glow bg-energy absolute left-1/2 top-1/2 flex h-[140px] w-[140px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full text-primary-foreground glow">
            <Zap className="h-20 w-20" />
          </div>
        </div>
      </div>
      <div className="absolute right-[110px] top-[340px] flex w-[1000px] flex-col gap-8">
        {[
          { f: "P = U · I", name: "Հզորություն", unit: "Վտ = Վոլտ × Ամպեր", note: "Որքան «արագ» է սարքը ծախսում էներգիա" },
          { f: "A = P · t", name: "Աշխատանք / Էներգիա", unit: "կՎտ·ժ (kWh)", note: "Հենց այս միավորի համար ենք վճարում հաշվիչով" },
        ].map((x, i) => (
          <div key={x.f} className="a-right glass-card flex items-center gap-10 rounded-[36px] p-10" style={delay(350 + i * 220)}>
            <div className="slide-num text-gradient-energy w-[400px] shrink-0" style={{ fontSize: 84, fontWeight: 800 }}>
              {x.f}
            </div>
            <div>
              <div className="slide-body font-bold">{x.name}</div>
              <div className="slide-caption text-primary">{x.unit}</div>
              <div className="slide-caption mt-2 text-muted-foreground">{x.note}</div>
            </div>
          </div>
        ))}
        <div className="a-rise slide-body rounded-[28px] border border-accent/40 bg-accent/10 px-10 py-6" style={delay(800)}>
          1 կՎտ·ժ = 1000 Վտ սարք × 1 ժամ ≈ <span className="slide-num font-bold text-accent">{TARIFF_AMD} ֏</span>
        </div>
      </div>
    </SlideLayout>
  );
}

/* 6 — Teams */
export function TeamsSlide() {
  const teams = [
    {
      icon: Refrigerator,
      n: "Թիմ 1",
      name: "Խոհանոցային և հզոր սարքերի աուդիտորներ",
      obj: "Սառնարան, լվացքի մեքենա, սալօջախ, արդուկ, միկրոալիքային",
      task: "Ամենաբարձր P ունեցող սարքերի ծախսը",
      tone: "bg-energy",
      img: kitchenImg,
    },
    {
      icon: Tv,
      n: "Թիմ 2",
      name: "Թվային տեխնիկայի և Standby ռեժիմի հետազոտողներ",
      obj: "Հեռուստացույց, համակարգիչ, Wi‑Fi ռոութեր, լիցքավորիչներ",
      task: "«Թաքնված» էներգասպառումը տարեկան կտրվածքով",
      tone: "bg-waste",
      img: standbyImg,
    },
    {
      icon: Lightbulb,
      n: "Թիմ 3",
      name: "Լուսավորության և էներգախնայողության ճարտարագետներ",
      obj: "Շիկացման, հալոգենային, լյումինեսցենտային և LED լամպեր",
      task: "LED-ի անցման մարման ժամկետը (Payback)",
      tone: "bg-save",
      img: bulbsImg,
    },
  ];
  return (
    <SlideLayout>
      <div className="absolute left-[110px] top-[100px]">
        <Kicker>
          <Users className="h-6 w-6" /> 3 թիմ × 3 աշակերտ
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Մեր <span className="text-gradient-energy">հետազոտական թիմերը</span>
        </h2>
      </div>
      <div className="absolute inset-x-[110px] top-[370px] grid grid-cols-3 gap-10 perspective">
        {teams.map(({ icon: Icon, ...t }, i) => (
          <div key={t.n} className="a-flip glass-card relative flex min-h-[600px] flex-col overflow-hidden rounded-[40px] p-10" style={delay(300 + i * 220)}>
            <img src={t.img} alt={t.n} width={1280} height={1280} className="ken-burns absolute inset-x-0 top-0 h-[260px] w-full object-cover" />
            <div className="absolute inset-x-0 top-0 h-[262px] bg-gradient-to-b from-transparent via-card/40 to-card" />
            <div className="relative mt-[110px] flex items-center justify-between">
              <div className={`${t.tone} flex h-24 w-24 items-center justify-center rounded-3xl text-primary-foreground glow`}>
                <Icon className="h-12 w-12" />
              </div>
              <span className="slide-badge slide-num rounded-full border border-border px-5 py-2 text-muted-foreground">{t.n}</span>
            </div>
            <h3 className="slide-body relative mt-6 font-bold leading-tight">{t.name}</h3>
            <p className="slide-caption relative mt-4 text-muted-foreground">{t.obj}</p>
            <div className="relative mt-auto flex items-start gap-4 rounded-2xl bg-secondary/70 p-5">
              <BatteryCharging className="mt-1 h-8 w-8 shrink-0 text-primary" />
              <span className="slide-caption">{t.task}</span>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

