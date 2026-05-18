import type { DeductionResult } from "../types";

/** Nigeria: PAYE (progressive 7–24%), Pension 8%, NHIS 1.75%, NHF 2.5% */
export function calculateNG(gross: number): DeductionResult {
  const pension = gross * 0.08;
  const nhis = gross * 0.0175;
  const nhf = gross * 0.025;
  const taxableIncome = gross - pension;
  const paye = calcNigerianPAYE(taxableIncome);
  const deductions = [
    { type: "PAYE", amount: paye },
    { type: "PENSION", amount: pension },
    { type: "NHIS", amount: nhis },
    { type: "NHF", amount: nhf },
  ];
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  return { grossAmount: gross, deductions, netAmount: gross - totalDeductions };
}

function calcNigerianPAYE(taxable: number): number {
  // Annual bands (monthly input * 12, then divide result by 12)
  const annual = taxable * 12;
  const bands = [
    { limit: 300_000, rate: 0.07 },
    { limit: 300_000, rate: 0.11 },
    { limit: 500_000, rate: 0.15 },
    { limit: 500_000, rate: 0.19 },
    { limit: 1_600_000, rate: 0.21 },
    { limit: Infinity, rate: 0.24 },
  ];
  let tax = 0;
  let remaining = annual;
  for (const band of bands) {
    if (remaining <= 0) break;
    const taxable = Math.min(remaining, band.limit);
    tax += taxable * band.rate;
    remaining -= taxable;
  }
  return tax / 12;
}
