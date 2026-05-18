import type { DeductionResult } from "../types";

/** Ghana: PAYE (0–30%), SSNIT 5.5%, NHIL 2.5% */
export function calculateGH(gross: number): DeductionResult {
  const ssnit = gross * 0.055;
  const nhil = gross * 0.025;
  const paye = calcGhanaPAYE(gross - ssnit);
  const deductions = [
    { type: "PAYE", amount: paye },
    { type: "SSNIT", amount: ssnit },
    { type: "NHIL", amount: nhil },
  ];
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  return { grossAmount: gross, deductions, netAmount: gross - totalDeductions };
}

function calcGhanaPAYE(taxable: number): number {
  const annual = taxable * 12;
  const bands = [
    { limit: 4_380, rate: 0 },
    { limit: 1_320, rate: 0.05 },
    { limit: 1_560, rate: 0.10 },
    { limit: 38_000, rate: 0.175 },
    { limit: 192_000, rate: 0.25 },
    { limit: Infinity, rate: 0.30 },
  ];
  let tax = 0;
  let remaining = annual;
  for (const band of bands) {
    if (remaining <= 0) break;
    const chunk = Math.min(remaining, band.limit);
    tax += chunk * band.rate;
    remaining -= chunk;
  }
  return tax / 12;
}
