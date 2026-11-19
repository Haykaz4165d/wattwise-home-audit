import {
  CalendarDays,
  Cpu,
  Flame,
  Ghost,
  Lightbulb,
  Plug,
  Sparkles,
  Thermometer,
} from "lucide-react";
import kitchen from "@/assets/kitchen-appliances.jpg";
import standby from "@/assets/standby-devices.jpg";
import bulbs from "@/assets/bulbs-compare.jpg";
import timelineImg from "@/assets/timeline-students.jpg";
import paradoxImg from "@/assets/paradox-iron-fridge.jpg";
import stripImg from "@/assets/team2-powerstrip.jpg";
import { Backdrop, FloatingPhoto, Kicker, SlideLayout, delay } from "./SlideLayout";
import { CountUp } from "./CountUp";
import {
  energyKwh,
  fridge,
  iron,
  standbyDevices,
  standbyYear,
  STANDBY_HOURS_PER_DAY,
} from "@/lib/energy";
import type { CSSProperties } from "react";

/* 7 — Timeline */
export function TimelineSlide() {
  const weeks = [
    {
      w: "Շաբաթ 1",
      t: "Ներածական",
      items: ["Բանաձևերի վերհիշում", "Խմբերի ձևավորում", "Սարքերի գույքագրում ըստ պիտակների"],
    },
    {
      w: "Շաբաթ 2",
      t: "Չափումներ և հաշվարկներ",
      items: ["Օրական աշխատաժամեր (t)", "A = P · t · 30 օր", "Համեմատում իրական հաշվի հետ"],
    },
    {
      w: "Շաբաթ 3",
      t: "Վերլուծություն և աուդիտ",
      items: ["Ծախսեր ըստ ՀՀ սակագնի", "Standby-ի արժեքը", "LED-ի տնտեսական արդյունքը"],
    },
    {
      w: "Շաբաթ 4",
      t: "Հաշվետվություն և պաշտպանություն",
      items: ["Ընդհանուր Excel աղյուսակ", "Էներգախնայողության ծրագիր", "Պրեզենտացիա"],
    },
  ];
  return (
    <SlideLayout>
      <Backdrop
        src={timelineImg}
        alt="Աշակերտները աշխատում են աղյուսակի վրա"
        overlay="bg-background/65"
      />
      <div className="absolute left-[110px] top-[100px]">
        <Kicker>
          <CalendarDays className="h-6 w-6" /> Աշխատանքային պլան
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          <span className="text-gradient-energy">4 շաբաթ</span>՝ գաղափարից մինչև պաշտպանություն
        </h2>
      </div>
      <svg
        className="absolute left-[110px] top-[470px]"
        width="1700"
        height="20"
        viewBox="0 0 1700 20"
      >
        <line x1="0" y1="10" x2="1700" y2="10" stroke="var(--border)" strokeWidth="4" />
        <line
          x1="0"
          y1="10"
          x2="1700"
          y2="10"
          stroke="var(--primary)"
          strokeWidth="4"
          pathLength={1}
          strokeDasharray="1"
          className="a-draw"
          style={{ "--len": 1, "--d": 200 } as CSSProperties}
        />
        <line
          x1="0"
          y1="10"
          x2="1700"
          y2="10"
          stroke="var(--heat)"
          strokeWidth="4"
          className="current-flow"
          opacity="0.6"
        />
      </svg>
      <div className="absolute inset-x-[110px] top-[440px] grid grid-cols-4 gap-8">
        {weeks.map((w, i) => (
          <div key={w.w} className="flex flex-col">
            <div
              className="a-pop bg-energy slide-num flex h-[80px] w-[80px] items-center justify-center rounded-full text-primary-foreground glow"
              style={{ ...delay(400 + i * 350), fontSize: 36, fontWeight: 800 }}
            >
              {i + 1}
            </div>
            <div
              className="a-tilt glass-card mt-8 min-h-[400px] rounded-[32px] p-8"
              style={delay(550 + i * 350)}
            >
              <div className="slide-kicker text-primary">{w.w}</div>
              <div className="slide-body mt-3 font-bold leading-tight">{w.t}</div>
              <ul className="slide-caption mt-6 space-y-3 text-muted-foreground">
                {w.items.map((it) => (
                  <li key={it} className="flex gap-3">
                    <span className="mt-[12px] h-2 w-2 shrink-0 rounded-full bg-primary" />
                    {it}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>
    </SlideLayout>
  );
}

/* Bar pair used on slide 8. Module-level so re-renders never remount it (which restarted its counters). */
function Chart({
  title,
  a,
  b,
  unit,
  max,
  d,
  digits = 0,
}: {
  title: string;
  a: number;
  b: number;
  unit: string;
  max: number;
  d: number;
  digits?: number;
}) {
  return (
    <div className="a-tilt glass-card flex flex-col rounded-[40px] p-10" style={delay(d)}>
      <div className="slide-body font-bold">{title}</div>
      <div className="mt-8 flex h-[400px] items-end justify-around gap-10 border-b border-border">
        {[
          { label: "Արդուկ", v: a, cls: "bg-waste" },
          { label: "Սառնարան", v: b, cls: "bg-energy" },
        ].map((x, i) => (
          <div key={x.label} className="flex w-[180px] flex-col items-center">
            <div className="slide-num slide-body mb-3 font-bold">
              <CountUp to={x.v} digits={digits} delay={d + 300} />
            </div>
            <div
              className={`${x.cls} a-grow-y w-full rounded-t-2xl glow`}
              style={{ height: `${(x.v / max) * 320}px`, ...delay(d + 300 + i * 150) }}
            />
          </div>
        ))}
      </div>
      <div className="slide-caption mt-4 flex justify-around text-muted-foreground">
        <span>Արդուկ</span>
        <span>Սառնարան</span>
      </div>
      <div className="slide-caption mt-2 text-center text-primary">{unit}</div>
    </div>
  );
}

/* 8 — Why devices affect the budget differently */
export function ParadoxSlide() {
  const ironKwh = energyKwh(iron.watts, iron.hoursPerDay);
  const fridgeKwh = energyKwh(fridge.watts, fridge.hoursPerDay);
  return (
    <SlideLayout>
      <FloatingPhoto
        src={paradoxImg}
        alt="Արդուկ և սառնարան"
        className="right-[110px] top-[70px] h-[260px] w-[540px]"
      />
      <div className="absolute left-[110px] top-[100px] w-[1100px]">
        <Kicker>Ա. Հզորություն ≠ ծախս</Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Հզոր չի նշանակում <span className="text-gradient-energy">թանկ</span>
        </h2>
      </div>
      <div className="absolute left-[110px] top-[360px] grid w-[1180px] grid-cols-2 gap-10">
        <Chart
          title="Հզորություն"
          a={iron.watts}
          b={fridge.watts}
          unit="P, Վտ"
          max={2000}
          d={300}
        />
        <Chart
          title="Ամսական էներգիա"
          a={ironKwh}
          b={fridgeKwh}
          unit="A, կՎտ·ժ / ամիս"
          max={fridgeKwh}
          d={550}
          digits={1}
        />
      </div>
      <div className="absolute right-[110px] top-[360px] flex w-[480px] flex-col gap-8">
        <div className="a-right glass-card rounded-[32px] p-8" style={delay(800)}>
          <Flame className="h-10 w-10 text-destructive" />
          <p className="slide-caption mt-4">
            <b>Բարձր P + կարճ t.</b> Արդուկ 2000 Վտ, բայց շաբաթական ընդամենը 1–2 ժամ։
          </p>
        </div>
        <div className="a-right glass-card rounded-[32px] p-8" style={delay(1000)}>
          <Thermometer className="h-10 w-10 text-primary" />
          <p className="slide-caption mt-4">
            <b>Ցածր P + 24/7.</b> Սառնարան 150–200 Վտ, աշխատում է շուրջօրյա՝ միանալով և անջատվելով։
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}

/* 9 — Team 1 */
export function Team1Slide() {
  return (
    <SlideLayout>
      <div className="parallax-front absolute left-[60px] top-[80px] h-[860px] w-[860px] perspective">
        <div className="float-3d h-full w-full">
          <img
            src={kitchen}
            alt="Խոհանոցային սարքեր"
            width={1280}
            height={1280}
           
            className="a-blur h-full w-full rounded-[56px] object-cover glow"
            style={delay(100)}
          />
        </div>
      </div>
      <div className="absolute right-[110px] top-[100px] w-[860px]">
        <Kicker>Թիմ 1 · Հզոր կենցաղային սարքեր</Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Գլխավոր <span className="text-gradient-energy">«էներգակերը»</span>
        </h2>
        <div className="mt-12 flex items-center gap-12">
          <div className="relative h-[300px] w-[300px] shrink-0">
            <svg viewBox="0 0 120 120" className="h-full w-full -rotate-90">
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="var(--secondary)"
                strokeWidth="16"
              />
              <circle
                cx="60"
                cy="60"
                r="50"
                fill="none"
                stroke="var(--primary)"
                strokeWidth="16"
                strokeLinecap="round"
                pathLength={100}
                strokeDasharray="27.5 100"
                className="a-draw"
                style={{ "--len": 27.5, "--d": 400 } as CSSProperties}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span
                className="slide-num text-gradient-energy whitespace-nowrap"
                style={{ fontSize: 36, fontWeight: 800 }}
              >
                25–30%
              </span>
              <span className="slide-caption text-muted-foreground">հաշվից</span>
            </div>
          </div>
          <p className="slide-body a-rise" style={delay(600)}>
            Սառնարանը կազմում է ամսական էլեկտրաէներգիայի ծախսի մոտ{" "}
            <b className="text-primary">25–30%</b>-ը։
          </p>
        </div>
        <blockquote
          className="slide-caption a-rise mt-12 border-l-4 border-primary pl-8 font-serif text-muted-foreground"
          style={delay(800)}
        >
          «Չնայած արդուկն ունի շատ բարձր հզորություն (2000 Վտ), այն աշխատում է շաբաթական 1–2 ժամ,
          ուստի ամսական ծախսը փոքր է։ Իսկ սառնարանը, 150–200 Վտ հզորությամբ, աշխատում է 24/7
          ռեժիմով»։
        </blockquote>
      </div>
    </SlideLayout>
  );
}

/* 10 — Phantom load physics */
export function PhantomSlide() {
  return (
    <SlideLayout>
      <img
        src={standby}
        alt="Standby ռեժիմում սարքեր"
        width={1280}
        height={1280}
       
        className="ken-burns parallax-back absolute right-0 top-0 h-full w-[1100px] object-cover"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-background via-background/85 to-background/10" />
      <div
        className="a-pop glass-card absolute right-[140px] top-[150px] flex items-center gap-5 rounded-full px-9 py-5"
        style={delay(900)}
      >
        <span
          className="blink h-5 w-5 rounded-full bg-destructive"
          style={{ boxShadow: "0 0 24px 6px var(--destructive)" }}
        />
        <span className="slide-body slide-num font-bold">Standby · 2–10 Վտ</span>
      </div>
      <div className="absolute left-[110px] top-[100px] w-[1000px]">
        <Kicker tone="destructive">
          <Ghost className="h-6 w-6" /> Բ. Phantom Load
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          <span className="text-gradient-waste">Թաքնված</span> էներգասպառում
        </h2>
        <div className="mt-12 space-y-8">
          <div className="a-left glass-card rounded-[32px] p-9" style={delay(350)}>
            <div className="slide-kicker text-destructive">Ինչ է սա</div>
            <p className="slide-body mt-3">
              Սարքը միացված է վարդակին, բայց չի կատարում իր հիմնական ֆունկցիան՝ հեռուստացույց,
              մոնիտոր, միկրոալիքայինի ժամացույց, լիցքավորիչ։
            </p>
          </div>
          <div className="a-left glass-card rounded-[32px] p-9" style={delay(600)}>
            <div className="slide-kicker text-primary">Ֆիզիկական բացատրություն</div>
            <p className="slide-body mt-3">
              Տրանսֆորմատորներն ու հեռակառավարման սենսորները մնում են լարման տակ՝ սպառելով{" "}
              <b className="slide-num text-gradient-waste">2–10 Վտ</b>։
            </p>
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* 11 — Team 2: standby chart */
export function Team2Slide() {
  const year = standbyYear();
  const max = Math.max(...standbyDevices.map((d) => d.watts));
  return (
    <SlideLayout>
      <Backdrop src={stripImg} alt="Երկարացման լար Standby լույսերով" overlay="bg-background/55" />
      <div className="absolute left-[110px] top-[100px] w-[1700px]">
        <Kicker tone="destructive">
          <Plug className="h-6 w-6" /> Թիմ 2 · Ժամանցային տեխնիկա և Standby
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          «Անջատված» չի նշանակում <span className="text-gradient-waste">չծախսող</span>
        </h2>
      </div>
      <div
        className="a-tilt glass-card absolute left-[110px] top-[380px] w-[1000px] rounded-[40px] p-10"
        style={delay(250)}
      >
        <div className="slide-body font-bold">Սպասման ռեժիմի հզորություն, Վտ</div>
        <div className="mt-8 space-y-6">
          {standbyDevices.map((d, i) => (
            <div key={d.name} className="flex items-center gap-6">
              <span className="slide-caption w-[340px] shrink-0">{d.name}</span>
              <div className="h-12 flex-1 rounded-full bg-secondary/60">
                <div
                  className="bg-waste a-grow-x h-full rounded-full"
                  style={{ width: `${(d.watts / max) * 100}%`, ...delay(500 + i * 140) }}
                />
              </div>
              <span className="slide-num slide-caption w-[90px] text-right font-bold">
                {d.watts} Վտ
              </span>
            </div>
          ))}
        </div>
        <p className="slide-chrome mt-8 text-muted-foreground">
          Տիպիկ արժեքներ (օրինակ) · անգործ ժամեր՝ {STANDBY_HOURS_PER_DAY} ժ/օր
        </p>
      </div>
      <div className="absolute right-[110px] top-[380px] flex w-[620px] flex-col gap-8">
        <div className="a-zoom glass-card rounded-[40px] p-10 text-center" style={delay(700)}>
          <div className="slide-kicker text-muted-foreground">Տարեկան վատնում</div>
          <div
            className="slide-num text-gradient-waste mt-4"
            style={{ fontSize: 110, fontWeight: 800, lineHeight: 1 }}
          >
            <CountUp to={year.kwh} delay={800} />
          </div>
          <div className="slide-body text-muted-foreground">կՎտ·ժ / տարի</div>
        </div>
        <div className="a-zoom glass-card rounded-[40px] p-10 text-center" style={delay(900)}>
          <div
            className="slide-num text-gradient-energy"
            style={{ fontSize: 96, fontWeight: 800, lineHeight: 1 }}
          >
            ≈ <CountUp to={year.amd} delay={1000} /> ֏
          </div>
          <div className="slide-caption mt-3 text-muted-foreground">
            {year.watts} Վտ × {STANDBY_HOURS_PER_DAY} ժ × 365 օր
          </div>
        </div>
      </div>
    </SlideLayout>
  );
}

/* Light/heat bar used on slide 12. Module-level so re-renders never remount it. */
function Split({
  label,
  light,
  heat,
  d,
  icon: Icon,
  lightCls,
}: {
  label: string;
  light: number;
  heat: number;
  d: number;
  icon: typeof Flame;
  lightCls: string;
}) {
  return (
    <div className="a-left glass-card rounded-[36px] p-9" style={delay(d)}>
      <div className="flex items-center gap-4">
        <Icon className="h-9 w-9 text-primary" />
        <span className="slide-body font-bold">{label}</span>
      </div>
      <div className="mt-6 flex h-16 overflow-hidden rounded-full">
        <div
          className={`${lightCls} a-grow-x flex items-center justify-center`}
          style={{ width: `${light}%`, ...delay(d + 300) }}
        >
          {light >= 20 && (
            <span className="slide-caption slide-num font-bold text-primary-foreground">
              լույս {light}%
            </span>
          )}
        </div>
        <div
          className="bg-waste a-grow-x flex items-center justify-center opacity-80"
          style={{ width: `${heat}%`, ...delay(d + 500) }}
        >
          {heat >= 20 && (
            <span className="slide-caption slide-num font-bold text-destructive-foreground">
              ջերմություն {heat}%
            </span>
          )}
        </div>
      </div>
    </div>
  );
}

/* 12 — Lighting physics */
export function LightPhysicsSlide() {
  return (
    <SlideLayout>
      <div className="parallax-front absolute right-[90px] top-[90px] h-[580px] w-[880px] perspective">
        <div className="float-3d h-full w-full">
          <img
            src={bulbs}
            alt="Շիկացման և LED լամպեր"
            width={1536}
            height={1024}
           
            className="a-blur h-full w-full rounded-[48px] object-cover glow"
            style={delay(100)}
          />
        </div>
      </div>
      <div className="absolute left-[110px] top-[100px] w-[800px]">
        <Kicker tone="led">
          <Lightbulb className="h-6 w-6" /> Գ. Լուսավորության ֆիզիկա
        </Kicker>
        <h2 className="slide-title a-rise mt-8" style={delay(120)}>
          Շիկացում <span className="text-gradient-energy">vs</span>{" "}
          <span className="text-gradient-save">LED</span>
        </h2>
      </div>
      <div className="absolute left-[110px] top-[400px] w-[800px] space-y-8">
        <Split
          label="Շիկացման լամպ"
          light={7}
          heat={93}
          d={300}
          icon={Flame}
          lightCls="bg-energy"
        />
        <Split label="LED լամպ" light={85} heat={15} d={600} icon={Sparkles} lightCls="bg-save" />
      </div>
      <div className="absolute bottom-[110px] right-[110px] grid w-[860px] grid-cols-2 gap-8">
        <div className="a-rise glass-card rounded-[32px] p-8" style={delay(900)}>
          <Thermometer className="h-9 w-9 text-heat" />
          <p className="slide-caption mt-3">
            Վոլֆրամե թելի շիկացում՝ Ջուլ-Լենցի օրենք։ 90–95%-ը կորչում է ջերմության տեսքով։
          </p>
        </div>
        <div className="a-rise glass-card rounded-[32px] p-8" style={delay(1100)}>
          <Cpu className="h-9 w-9 text-led" />
          <p className="slide-caption mt-3">
            Կիսահաղորդչում ֆոտոնների ճառագայթում։ 7–10 անգամ քիչ էներգիա, չի տաքացնում սենյակը։
          </p>
        </div>
      </div>
    </SlideLayout>
  );
}
