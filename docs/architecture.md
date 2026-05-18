# Architecture Overview

See the main README for the high-level diagram. This document covers internal design decisions.

## Services

| Service | Path | Language | Port |
|---|---|---|---|
| Core API | `apps/api` | Go | 8080 |
| Employer Dashboard | `apps/dashboard` | Next.js | 3000 |
| Employee Portal (PWA) | `apps/employee-portal` | Next.js | 3001 |

## Packages

| Package | Path | Purpose |
|---|---|---|
| `@stellarpayroll/tax-engine` | `packages/tax-engine` | Gross-to-net calculation per country |
| `@stellarpayroll/payslip-generator` | `packages/payslip-generator` | PDF payslip via Puppeteer |
| `@stellarpayroll/anchor-client` | `packages/anchor-client` | SEP-24 typed client |

## Smart Contracts

| Contract | Path | Purpose |
|---|---|---|
| `PayrollVault` | `contracts/payroll-vault` | Time-locked multi-sig payroll fund |
| `PayrollRegistry` | `contracts/payroll-registry` | On-chain audit trail (merkle roots only) |

## Anchor Integration

Anchors are selected per employee based on country:

1. **Paychant** — primary for NG, GH, KE
2. **Yellowcard** — fallback for GH, KE and expansion countries
3. **Cowrie** — Nigeria bank-to-bank alternative
4. **MoneyGram** — global cash pickup fallback

## SDP Extensions

`sdp-extensions/` contains patches applied on top of the upstream Stellar Disbursement Platform. We track upstream via a git remote and rebase periodically.
