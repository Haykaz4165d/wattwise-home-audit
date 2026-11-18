import { describe, expect, it } from "vitest";
import { costAmd, energyKwh, ledScenario, rowTotals, sampleRows, TARIFF_AMD } from "./energy";

describe("energy math", () => {
  it("uses the 48.38 AMD/kWh tariff", () => {
    expect(TARIFF_AMD).toBe(48.38);
  });

  it("fridge 150 W × 10 h × 30 days = 45 kWh ≈ 2,177 AMD", () => {
    const kwh = energyKwh(150, 10);
    expect(kwh).toBeCloseTo(45);
    expect(Math.round(costAmd(kwh))).toBe(2177);
  });

  it("5 incandescent 100 W lamps × 5 h = 75 kWh, 5 LED 10 W = 7.5 kWh", () => {
    expect(energyKwh(100, 5, 5)).toBeCloseTo(75);
    expect(energyKwh(10, 5, 5)).toBeCloseTo(7.5);
  });

  it("two TVs on standby 5 W × 20 h count both devices (6 kWh)", () => {
    expect(energyKwh(5, 20, 2)).toBeCloseTo(6);
  });

  it("sample table total is 133.5 kWh", () => {
    expect(rowTotals(sampleRows).kwh).toBeCloseTo(133.5);
  });

  it("60 W → 8 W LED cuts energy 7.5× and pays back within 3–4 months", () => {
    const s = ledScenario();
    expect(s.ratio).toBe(7.5);
    expect(s.payback).toBeGreaterThan(3);
    expect(s.payback).toBeLessThan(4);
  });
});
