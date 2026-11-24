import { describe, expect, it } from "vitest";
import { buildTally, percentages, POLL_QUESTIONS, voterCount } from "./poll";

describe("audience poll", () => {
  it("has 5 questions with 4 answers each", () => {
    expect(POLL_QUESTIONS).toHaveLength(5);
    for (const q of POLL_QUESTIONS) expect(q.options).toHaveLength(4);
  });

  it("3 of 4 votes for one answer = 75%, the other = 25%", () => {
    expect(percentages([3, 1, 0, 0])).toEqual([75, 25, 0, 0]);
  });

  it("percentages always add up to 100", () => {
    const p = percentages([1, 1, 1, 0]);
    expect(p).toEqual([34, 33, 33, 0]);
    expect(p.reduce((a, b) => a + b, 0)).toBe(100);
  });

  it("no votes shows 0% everywhere", () => {
    expect(percentages([0, 0, 0, 0])).toEqual([0, 0, 0, 0]);
  });

  it("counts voters from aggregated results", () => {
    const t = buildTally([
      { question: 1, option: 0, votes: 2 },
      { question: 1, option: 3, votes: 1 },
      { question: 5, option: 2, votes: 3 },
    ]);
    expect(t[0]).toEqual([2, 0, 0, 1]);
    expect(t[4]).toEqual([0, 0, 3, 0]);
    expect(voterCount(t)).toBe(3);
  });
});
