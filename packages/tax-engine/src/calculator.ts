import type { GrossPayInput, DeductionResult } from "./types";
import { calculateNG } from "./countries/ng";
import { calculateGH } from "./countries/gh";
import { calculateKE } from "./countries/ke";

export function calculateDeductions(input: GrossPayInput): DeductionResult {
  switch (input.country) {
    case "NG": return calculateNG(input.grossAmount);
    case "GH": return calculateGH(input.grossAmount);
    case "KE": return calculateKE(input.grossAmount);
  }
}
