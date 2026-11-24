import type { ComponentType } from "react";
import { FormulasSlide, GoalSlide, QuestionSlide, TasksSlide, TeamsSlide, TitleSlide } from "./slides-a";
import { LightPhysicsSlide, ParadoxSlide, PhantomSlide, Team1Slide, Team2Slide, TimelineSlide } from "./slides-b";
import { PollSlide } from "./slides-d";
import { ConclusionSlide, DeliverablesSlide, TableSlide, Team3Slide, ThanksSlide } from "./slides-c";

export type SlideDef = { id: string; title: string; Component: ComponentType };

export const slides: SlideDef[] = [
  { id: "title", title: "Էներգաարդյունավետության հետազոտություն", Component: TitleSlide },
  { id: "goal", title: "Նպատակը", Component: GoalSlide },
  { id: "question", title: "Որտե՞ղ է պետք ֆիզիկան", Component: QuestionSlide },
  { id: "tasks", title: "Խնդիրները", Component: TasksSlide },
  { id: "formulas", title: "Բանաձևեր", Component: FormulasSlide },
  { id: "teams", title: "Թիմերը", Component: TeamsSlide },
  { id: "timeline", title: "Աշխատանքային պլան", Component: TimelineSlide },
  { id: "paradox", title: "Հզորություն ≠ ծախս", Component: ParadoxSlide },
  { id: "team1", title: "Թիմ 1 · Հզոր սարքեր", Component: Team1Slide },
  { id: "phantom", title: "Թաքնված էներգասպառում", Component: PhantomSlide },
  { id: "team2", title: "Թիմ 2 · Standby", Component: Team2Slide },
  { id: "light", title: "Լուսավորության ֆիզիկա", Component: LightPhysicsSlide },
  { id: "team3", title: "Թիմ 3 · LED", Component: Team3Slide },
  { id: "table", title: "Հաշվարկային աղյուսակ", Component: TableSlide },
  { id: "deliverables", title: "Վերջնարդյունքներ", Component: DeliverablesSlide },
  { id: "conclusion", title: "Էներգախնայողության ծրագիր", Component: ConclusionSlide },
  { id: "poll", title: "Քվեարկություն", Component: PollSlide },
  { id: "thanks", title: "Շնորհակալություն", Component: ThanksSlide },
];
