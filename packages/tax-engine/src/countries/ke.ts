import type { DeductionResult } from "../types";

/** Kenya: PAYE (KRA bands), NSSF KES 200, NHIF KES 500–1700, Housing Levy 1.5% */
export function calculateKE(gross: number): DeductionResult {
  const nssf = 200;
  const nhif = calcNHIF(gross);
  const housingLevy = gross * 0.015;
  const paye = calcKenyaPAYE(gross - nssf);
  const deductions = [
    { type: "PAYE", amount: paye },
    { type: "NSSF", amount: nssf },
    { type: "NHIF", amount: nhif },
    { type: "HOUSING_LEVY", amount: housingLevy },
  ];
  const totalDeductions = deductions.reduce((s, d) => s + d.amount, 0);
  return { grossAmount: gross, deductions, netAmount: gross - totalDeductions };
}

function calcNHIF(gross: number): number {
  if (gross <= 5_999) return 500;
  if (gross <= 7_999) return 600;
  if (gross <= 11_999) return 750;
  if (gross <= 14_999) return 850;
  if (gross <= 19_999) return 900;
  if (gross <= 24_999) return 950;
  if (gross <= 29_999) return 1_000;
  if (gross <= 34_999) return 1_100;
  if (gross <= 39_999) return 1_200;
  if (gross <= 44_999) return 1_300;
  if (gross <= 49_999) return 1_400;
  if (gross <= 59_999) return 1_500;
  if (gross <= 69_999) return 1_600;
  return 1_700;
}

function calcKenyaPAYE(taxable: number): number {
  const annual = taxable * 12;
  const bands = [
    { limit: 288_000, rate: 0.10 },
    { limit: 100_000, rate: 0.25 },
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
  // Personal relief KES 2,400/month
  return Math.max(0, tax / 12 - 2_400);
}
