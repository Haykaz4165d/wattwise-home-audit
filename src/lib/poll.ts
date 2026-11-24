/** Audience poll: 5 questions about the project topic, 4 answers each. */
export type PollQuestion = { q: string; options: [string, string, string, string] };

export const POLL_QUESTIONS: PollQuestion[] = [
  { q: "Ո՞ր սարքն է, ձեր կարծիքով, ամենաշատ էներգիա ծախսում տանը", options: ["Սառնարան", "Արդուկ", "Լվացքի մեքենա", "Հեռուստացույց"] },
  { q: "Գիշերը հեռուստացույցն ինչպե՞ս եք անջատում", options: ["Վարդակից", "Վահանակով (Standby)", "Չենք անջատում", "Չգիտեմ"] },
  { q: "Ի՞նչ լամպեր են հիմնականում ձեր տանը", options: ["Բոլորը LED", "Կեսը LED", "Հիմնականում շիկացման", "Չգիտեմ"] },
  { q: "Ամսական էլեկտրաէներգիայի հաշիվը մոտավորապես", options: ["< 5,000 ֏", "5,000–10,000 ֏", "10,000–20,000 ֏", "> 20,000 ֏"] },
  { q: "Մեր խորհուրդներից ո՞րը կկիրառեք առաջինը", options: ["LED լամպեր", "Standby-ն վարդակից", "Լվացք 30–40°C", "Արդեն կիրառում ենք"] },
];

/** Public address of the voting page, encoded in the QR code. */
export const VOTE_URL = "https://wattwise-home-audit.lovable.app/vote";

export type Tally = number[][]; // [question][option] -> votes

export const emptyTally = (): Tally => POLL_QUESTIONS.map(() => [0, 0, 0, 0]);

/** Builds the tally from aggregated rows (question is 1-based, option is 0-based). */
export function buildTally(rows: { question: number; option: number; votes: number }[]): Tally {
  const t = emptyTally();
  for (const r of rows) {
    const q = t[r.question - 1];
    if (q && r.option >= 0 && r.option < 4) q[r.option] = Number(r.votes);
  }
  return t;
}

/** Whole-number percentages that always add up to 100 (largest remainder); all zeros when nobody voted. */
export function percentages(counts: number[]): number[] {
  const total = counts.reduce((a, b) => a + b, 0);
  if (total === 0) return counts.map(() => 0);
  const exact = counts.map((c) => (c / total) * 100);
  const floors = exact.map(Math.floor);
  let left = 100 - floors.reduce((a, b) => a + b, 0);
  const order = exact.map((e, i) => ({ i, r: e - Math.floor(e) })).sort((a, b) => b.r - a.r || a.i - b.i);
  for (const { i } of order) {
    if (left <= 0) break;
    floors[i] = (floors[i] ?? 0) + 1;
    left--;
  }
  return floors;
}

/** Number of people who voted (every ballot answers question 1). */
export const voterCount = (t: Tally) => (t[0] ?? []).reduce((a, b) => a + b, 0);
