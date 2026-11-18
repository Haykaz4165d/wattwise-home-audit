/** Household energy math used across the deck. A = P · t, cost = A · tariff. */

/** Average daytime tariff, AMD per kWh (value given in the project brief). */
export const TARIFF_AMD = 48.38;
export const DAYS_PER_MONTH = 30;

/** Energy in kWh for `qty` devices of `watts` running `hoursPerDay` for `days`. */
export function energyKwh(watts: number, hoursPerDay: number, qty = 1, days = DAYS_PER_MONTH) {
  return (watts / 1000) * hoursPerDay * days * qty;
}

export function costAmd(kwh: number, tariff = TARIFF_AMD) {
  return kwh * tariff;
}

/** Months until the purchase price is recovered by the monthly saving. */
export function paybackMonths(investmentAmd: number, monthlySavingAmd: number) {
  return investmentAmd / monthlySavingAmd;
}

export const fmt = (n: number, digits = 0) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });

/* ---------- Sample table from the brief ---------- */
export type DeviceRow = { name: string; qty: number; watts: number; hours: number; note?: string };

export const sampleRows: DeviceRow[] = [
  { name: "Սառնարան", qty: 1, watts: 150, hours: 10, note: "աշխատող" },
  { name: "Հեռուստացույց (Standby)", qty: 2, watts: 5, hours: 20 },
  { name: "Շիկացման լամպեր", qty: 5, watts: 100, hours: 5 },
  { name: "LED լամպեր (փոխարինված)", qty: 5, watts: 10, hours: 5 },
];

export function rowTotals(rows: DeviceRow[]) {
  const lines = rows.map((r) => {
    const kwh = energyKwh(r.watts, r.hours, r.qty);
    return { ...r, kw: r.watts / 1000, kwh, cost: costAmd(kwh) };
  });
  const kwh = lines.reduce((s, l) => s + l.kwh, 0);
  return { lines, kwh, cost: costAmd(kwh) };
}

/* ---------- Iron vs fridge (Team 1) ---------- */
export const iron = { watts: 2000, hoursPerDay: 1.5 / 7 }; // 1–2 h per week
export const fridge = { watts: 150, hoursPerDay: 10 }; // compressor actually running

/* ---------- LED scenario (Team 3) ---------- */
export const led = {
  lamps: 10,
  incandescentW: 60,
  ledW: 8,
  hoursPerDay: 5, // assumption, same as sample table
  ledPriceAmd: 1200, // assumption: price of one LED lamp
};

export function ledScenario(s = led) {
  const incKwh = energyKwh(s.incandescentW, s.hoursPerDay, s.lamps);
  const ledKwh = energyKwh(s.ledW, s.hoursPerDay, s.lamps);
  const savingKwh = incKwh - ledKwh;
  const savingAmd = costAmd(savingKwh);
  const investment = s.lamps * s.ledPriceAmd;
  return {
    incKwh,
    ledKwh,
    incAmd: costAmd(incKwh),
    ledAmd: costAmd(ledKwh),
    savingKwh,
    savingAmd,
    yearlySavingAmd: savingAmd * 12,
    ratio: s.incandescentW / s.ledW,
    investment,
    payback: paybackMonths(investment, savingAmd),
  };
}

/* ---------- Standby (Team 2) — typical standby powers, illustrative ---------- */
export const standbyDevices = [
  { name: "Wi‑Fi ռոութեր", watts: 7 },
  { name: "Հեռուստացույց", watts: 5 },
  { name: "Համակարգիչ + մոնիտոր", watts: 4 },
  { name: "Միկրոալիքային (ժամացույց)", watts: 3 },
  { name: "Լիցքավորիչներ", watts: 2 },
];
export const STANDBY_HOURS_PER_DAY = 20;

export function standbyYear(devices = standbyDevices, hours = STANDBY_HOURS_PER_DAY) {
  const watts = devices.reduce((s, d) => s + d.watts, 0);
  const kwh = energyKwh(watts, hours, 1, 365);
  return { watts, kwh, amd: costAmd(kwh) };
}
