import puppeteer from "puppeteer";
import type { DeductionResult } from "@stellarpayroll/tax-engine";

export interface PayslipData {
  employeeName: string;
  employeeId: string;
  orgName: string;
  payPeriod: string;
  currency: string;
  deductions: DeductionResult;
}

export async function generatePayslipPDF(data: PayslipData): Promise<Buffer> {
  const browser = await puppeteer.launch({ args: ["--no-sandbox"] });
  const page = await browser.newPage();
  await page.setContent(renderHTML(data));
  const pdf = await page.pdf({ format: "A4" });
  await browser.close();
  return Buffer.from(pdf);
}

function renderHTML(d: PayslipData): string {
  const rows = d.deductions.deductions
    .map((x) => `<tr><td>${x.type}</td><td>${d.currency} ${x.amount.toFixed(2)}</td></tr>`)
    .join("");
  return `<!DOCTYPE html><html><body>
    <h1>${d.orgName} — Payslip</h1>
    <p>${d.employeeName} | ${d.payPeriod}</p>
    <table>
      <tr><th>Gross Pay</th><td>${d.currency} ${d.deductions.grossAmount.toFixed(2)}</td></tr>
      ${rows}
      <tr><th>Net Pay</th><td>${d.currency} ${d.deductions.netAmount.toFixed(2)}</td></tr>
    </table>
  </body></html>`;
}
