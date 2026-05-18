export type Country = "NG" | "GH" | "KE";

export interface GrossPayInput {
  country: Country;
  grossAmount: number; // in local currency units
  currency: "NGN" | "GHS" | "KES";
}

export interface DeductionResult {
  grossAmount: number;
  deductions: { type: string; amount: number }[];
  netAmount: number;
}
