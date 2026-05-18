# StellarPayroll Africa

**Open-source payroll disbursement for African SMEs, built on the Stellar network.**

[![Stellar Wave Program](https://img.shields.io/badge/Stellar-Wave%20Program-blue?logo=stellar)](https://drips.network/wave/stellar)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Go](https://img.shields.io/badge/Go-1.22-00ADD8?logo=go)](https://go.dev/)
[![Rust](https://img.shields.io/badge/Rust-Soroban-orange?logo=rust)](https://soroban.stellar.org/)

StellarPayroll Africa enables employers to pay employees in local currencies (NGN, GHS, KES) or USDC — directly into mobile money wallets (M-Pesa, MTN MoMo, Airtel Money) or bank accounts — with near-zero fees and near-instant settlement. No crypto knowledge required for employees.

> **Target markets:** Nigeria 🇳🇬 · Ghana 🇬🇭 · Kenya 🇰🇪  
> **Status:** MVP in development — [Stellar Wave Program](https://drips.network/wave/stellar) applicant

---

## Table of Contents

- [Why StellarPayroll Africa](#why-stellarpayroll-africa)
- [How It Works](#how-it-works)
- [Architecture](#architecture)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API Reference](#api-reference)
- [Smart Contracts](#smart-contracts)
- [Tax Engine](#tax-engine)
- [Anchor Integrations](#anchor-integrations)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [License](#license)

---

## Why StellarPayroll Africa

African SMEs processing payroll face a broken status quo:

| Problem | Current Reality | StellarPayroll Africa |
|---|---|---|
| Transaction fees | 1.5–3.5% per payment (Paystack, Flutterwave) | < $0.001 per transaction |
| Settlement speed | 1–5 business days cross-border | 3–5 seconds (Stellar) |
| Unbanked workers | ~57% of sub-Saharan Africans lack bank accounts | Mobile money off-ramp via M-Pesa, MTN MoMo, Airtel Money |
| Open-source tooling | None — every payroll tool is proprietary SaaS | Fully open-source, self-hostable |
| Tax compliance | Manual spreadsheets or expensive local software | Built-in PAYE, Pension, NHIS/NHIF/SSNIT engines |
| Audit trail | PDF reports, easily altered | Payroll hashes recorded on-chain via Soroban |

**Key differentiator from other Stellar projects:** StellarPayroll Africa targets the employer-to-employee payroll flow specifically — with payslip generation, tax deduction management, payroll scheduling, multi-sig approval, and local compliance tooling that no current wave project offers.

---

## How It Works

```
Employer uploads CSV  →  System calculates gross-to-net (PAYE, Pension, NHIS…)
         ↓
Payroll run created  →  CEO + Finance approve via multi-sig (Soroban PayrollVault)
         ↓
SDP executes bulk disbursement  →  USDC sent to each employee's Stellar wallet
         ↓
Anchor off-ramps USDC  →  Employee receives local currency on M-Pesa / bank account
         ↓
Payslip PDF generated  →  Sent via email + SMS link to each employee
```

Employees who don't have a smartphone can receive wages via USSD — no app download, no crypto wallet, no internet connection required.

---

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                   StellarPayroll Africa                   │
│                                                           │
│  ┌─────────────┐   ┌──────────────┐   ┌───────────────┐ │
│  │  Employer   │   │   Payroll    │   │   Employee    │ │
│  │  Dashboard  │   │   Engine     │   │   Portal/PWA  │ │
│  │  (Next.js)  │   │  (Go)        │   │  (Next.js)    │ │
│  └──────┬──────┘   └──────┬───────┘   └───────┬───────┘ │
│         │                 │                    │         │
│  ┌──────▼─────────────────▼────────────────────▼──────┐ │
│  │              StellarPayroll Core API (Go)           │ │
│  │  • Payroll scheduling     • Tax/deduction engine    │ │
│  │  • Employee registry      • Payslip generation      │ │
│  │  • Approval workflows     • Audit logs              │ │
│  └──────────────────────┬──────────────────────────────┘ │
│                         │                                 │
│  ┌──────────────────────▼──────────────────────────────┐ │
│  │        Stellar Disbursement Platform (SDP)           │ │
│  │   (forked + extended with payroll-specific logic)    │ │
│  │  • Bulk payment execution  • SEP-10 auth             │ │
│  │  • SEP-24 deposit/withdraw • Wallet registration     │ │
│  │  • SMS OTP onboarding      • Transaction tracking    │ │
│  └──────────────────────┬──────────────────────────────┘ │
└─────────────────────────┼───────────────────────────────┘
                          │
          ┌───────────────┼───────────────┐
          ▼               ▼               ▼
    ┌──────────┐   ┌──────────┐   ┌──────────────┐
    │ Paychant │   │Yellowcard│   │    Cowrie     │
    │ Anchor   │   │  Anchor  │   │    Anchor     │
    │ NG/GH/KE │   │ 20 AF    │   │   Nigeria     │
    └────┬─────┘   └────┬─────┘   └──────┬───────┘
         │              │                │
    ┌────▼──────────────▼────────────────▼───────┐
    │          Local Payment Rails                │
    │  M-Pesa · MTN MoMo · Airtel Money          │
    │  GTBank · Zenith · Access · Equity Bank     │
    └────────────────────────────────────────────┘
```

For a deeper breakdown of internal design decisions, see [docs/architecture.md](docs/architecture.md).

---

## Features

### Payroll Management
- Create and manage pay periods with configurable pay dates
- Bulk employee import via CSV
- Gross-to-net calculation with full deduction breakdown
- Multi-sig payroll approval (e.g. CEO + Finance must both approve before funds release)
- Payroll run status tracking from draft → approved → disbursing → completed

### Tax & Compliance Engine

| Country | Deductions |
|---|---|
| 🇳🇬 Nigeria | PAYE (7–24% progressive), Pension (8%), NHIS (1.75%), NHF (2.5%) |
| 🇬🇭 Ghana | PAYE (0–30% progressive), SSNIT (5.5%), NHIL (2.5%) |
| 🇰🇪 Kenya | PAYE (KRA bands), NSSF (KES 200), NHIF (KES 500–1,700), Housing Levy (1.5%) |

### Employee Experience
- No crypto knowledge required
- SMS-based onboarding — employees receive a code and choose their payout method
- Wallet app (SEP-24 flow) or USSD (no smartphone needed)
- Payslip PDF delivered via email and SMS link

### Stellar Network Layer
- Settlement in USDC on Stellar (near-zero fees, 3–5 second finality)
- `PayrollVault` Soroban contract — time-locked, multi-sig controlled fund release
- `PayrollRegistry` Soroban contract — on-chain merkle root audit trail (no PII stored)
- SEP-10 wallet authentication, SEP-24 anchor on/off-ramp, SEP-12 KYC passing

### Webhooks
Real-time events for integrations:

```
payroll.created       payroll.approved      payroll.disbursing
payroll.completed     payment.failed        employee.onboarded
```

---

## Tech Stack

| Layer | Technology | Rationale |
|---|---|---|
| Frontend | Next.js 14 + Tailwind CSS | SSR for fast load in low-bandwidth markets |
| Core API | Go (same as SDP) | Performance; easy to extend SDP codebase |
| Smart contracts | Rust (Soroban) | Native Stellar contract language |
| Database | PostgreSQL + Redis | Reliable, SDP-compatible |
| Payments layer | Stellar SDP (forked) | Open-source, battle-tested bulk payment engine |
| Anchor protocol | SEP-10 + SEP-24 | Stellar interoperability standards |
| PDF generation | Puppeteer (Node.js sidecar) | Payslip rendering |
| Deployment | Docker + Kubernetes (Helm charts) | Matches SDP deployment model |
| Monitoring | OpenTelemetry + Grafana | Observability in production |

---

## Getting Started

### Prerequisites

- [Docker](https://docs.docker.com/get-docker/) and Docker Compose
- [Go 1.22+](https://go.dev/dl/)
- [Node.js 20+](https://nodejs.org/)
- [Rust + Soroban CLI](https://soroban.stellar.org/docs/getting-started/setup) (for contract development)

### Local Development

```bash
# 1. Clone the repo
git clone https://github.com/your-org/stellarpayroll-africa
cd stellarpayroll-africa

# 2. Copy environment config
cp .env.example .env
# Edit .env — at minimum set STELLAR_NETWORK=testnet

# 3. Start infrastructure
docker compose up -d postgres redis

# 4. Run database migrations
psql $DATABASE_URL -f docs/migrations/001_initial_schema.sql

# 5. Start the API
cd apps/api && go run main.go

# 6. Start the dashboard (separate terminal)
cd apps/dashboard && npm install && npm run dev
```

The dashboard will be available at `http://localhost:3000` and the API at `http://localhost:8080`.

### Running Tests

```bash
# Tax engine unit tests
cd packages/tax-engine && npm test

# API tests
cd apps/api && go test ./...

# Soroban contract tests
cd contracts/payroll-vault && cargo test
```

### Testnet Sandbox

A seeded testnet environment with sample organizations and employees is available via:

```bash
docker compose --profile seed up
```

This creates two sample organizations (one Nigerian, one Kenyan) with 10 employees each, ready for a full payroll run on Stellar testnet.

---

## Project Structure

```
stellarpayroll-africa/
├── apps/
│   ├── dashboard/          # Next.js employer UI (port 3000)
│   ├── api/                # Go core API (port 8080)
│   └── employee-portal/    # PWA for employees (port 3001)
├── contracts/
│   ├── payroll-vault/      # Soroban: time-locked multi-sig payroll fund
│   └── payroll-registry/   # Soroban: on-chain audit trail (merkle roots)
├── packages/
│   ├── tax-engine/         # Gross-to-net calculation per country
│   ├── payslip-generator/  # PDF payslip via Puppeteer
│   └── anchor-client/      # Typed SEP-24 client
├── sdp-extensions/         # Patches on top of upstream Stellar SDP
├── docs/
│   ├── architecture.md
│   ├── anchor-integration.md
│   └── migrations/
├── .github/
│   └── ISSUE_TEMPLATE/
├── docker-compose.yml
├── .env.example
└── CONTRIBUTING.md
```

---

## API Reference

Full OpenAPI spec is in `docs/openapi.yaml` (generated in Phase 3). Core endpoints:

```
POST /api/v1/organizations          Create organization
POST /api/v1/employees              Add employee
POST /api/v1/employees/bulk         CSV bulk upload
GET  /api/v1/employees              List employees

POST /api/v1/payroll                Create payroll run
POST /api/v1/payroll/:id/approve    Approve payroll run (multi-sig)
POST /api/v1/payroll/:id/execute    Trigger disbursement via SDP
GET  /api/v1/payroll/:id/status     Track payment status
GET  /api/v1/payroll/:id/payslips   Download payslip PDFs

GET  /api/v1/reports/payroll        Payroll summary report
GET  /health                        Health check
```

---

## Smart Contracts

### PayrollVault (`contracts/payroll-vault`)

Employers deposit USDC into a time-locked vault. Funds only release after a configurable multi-sig threshold is met (e.g. 2-of-2: CEO + Finance Director). Prevents unauthorized payroll execution.

```rust
pub trait PayrollVault {
    fn deposit(env: Env, employer: Address, amount: i128, pay_date: u64) -> u32;
    fn approve(env: Env, approver: Address, payroll_id: u32);
    fn execute(env: Env, payroll_id: u32, recipients: Vec<PayrollEntry>);
    fn cancel(env: Env, payroll_id: u32); // returns funds if not yet executed
}
```

### PayrollRegistry (`contracts/payroll-registry`)

Records a merkle root of each payroll run on-chain. Stores **no PII** — only a cryptographic commitment to the payroll data, enabling tamper-evident audit trails without exposing employee information.

```rust
pub trait PayrollRegistry {
    fn record(env: Env, recorder: Address, payroll_id: u32, merkle_root: Bytes);
    fn get(env: Env, payroll_id: u32) -> Option<Bytes>;
}
```

### Deploying to Testnet

```bash
cd contracts/payroll-vault
soroban contract build
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/payroll_vault.wasm \
  --network testnet \
  --source <YOUR_SECRET_KEY>
```

---

## Tax Engine

The `@stellarpayroll/tax-engine` package is a standalone TypeScript library for gross-to-net payroll calculation. It can be used independently of the rest of the platform.

```typescript
import { calculateDeductions } from "@stellarpayroll/tax-engine";

const result = calculateDeductions({
  country: "NG",
  grossAmount: 500_000, // NGN 500,000/month
  currency: "NGN",
});

console.log(result);
// {
//   grossAmount: 500000,
//   deductions: [
//     { type: "PAYE",    amount: 47916.67 },
//     { type: "PENSION", amount: 40000    },
//     { type: "NHIS",    amount: 8750     },
//     { type: "NHF",     amount: 12500    },
//   ],
//   netAmount: 390833.33
// }
```

**Adding a new country** is as simple as creating `packages/tax-engine/src/countries/<iso2>.ts` and exporting it from `calculator.ts`. See [CONTRIBUTING.md](CONTRIBUTING.md) for details.

---

## Anchor Integrations

| Anchor | Countries | Rails | SEP Support |
|---|---|---|---|
| [Paychant](https://paychant.com) | NG, GH, KE, UG | Mobile money, bank transfer | SEP-24 |
| [Yellowcard](https://yellowcard.io) | 20 African countries | Mobile money, cash | SEP-24 |
| [Cowrie](https://cowrie.exchange) | Nigeria | GTBank, Zenith, bank transfer | SEP-6, SEP-24 |
| MoneyGram | Global fallback | 475k+ cash locations | SEP-6 |

Anchor selection is automatic based on the employee's country. If the primary anchor fails KYC or is unavailable, the system falls back to the next anchor in the chain.

---

## Roadmap

### Phase 1 — Foundation (Weeks 1–6)
- [x] Project scaffold and database schema
- [ ] Employer dashboard: org setup, employee CSV upload, pay period creation
- [ ] Payroll engine: gross-to-net for Nigeria (PAYE, Pension, NHIS)
- [ ] Paychant SEP-24 integration + SMS employee onboarding
- [ ] `PayrollVault` Soroban contract on testnet

**Milestone:** Single org runs payroll for 10 Nigerian employees on testnet, end-to-end.

### Phase 2 — Expand & Harden (Weeks 7–12)
- [ ] Ghana and Kenya tax engines
- [ ] Yellowcard anchor integration
- [ ] Payslip PDF generation (English + local language placeholder)
- [ ] Multi-sig approval workflow
- [ ] `PayrollRegistry` on-chain audit trail
- [ ] Security audit, rate limiting, retry logic, staging environment

**Milestone:** Three countries live on mainnet. First real SME pilot.

### Phase 3 — Open Source & Wave (Weeks 13–16)
- [ ] Full OpenAPI documentation
- [ ] Docker Compose local dev + testnet sandbox with seeded data
- [ ] GitHub issues tagged for Wave contributors
- [ ] Landing page + demo video
- [ ] Stellar Wave Program application
- [ ] First community call; onboard 2–3 external contributors

---

## Contributing

We welcome contributions of all kinds. This project is part of the **Stellar Wave Program** — contributors earn **4x points** on the [Drips Network](https://drips.network).

See [CONTRIBUTING.md](CONTRIBUTING.md) for the full guide.

### Good places to start

| Label | Description |
|---|---|
| [`good-first-issue`](../../issues?q=label%3Agood-first-issue) | UI components, tax rate updates |
| [`country-support`](../../issues?q=label%3Acountry-support) | Add a new African tax jurisdiction |
| [`anchor-integration`](../../issues?q=label%3Aanchor-integration) | Integrate a new SEP-24 anchor |
| [`smart-contract`](../../issues?q=label%3Asmart-contract) | Soroban contract development |

---

## Competitive Landscape

| Feature | StellarPayroll Africa | Flutterwave Payroll | Deel Africa |
|---|---|---|---|
| Open source | ✅ | ❌ | ❌ |
| Stellar native | ✅ | ❌ | ❌ |
| African mobile money | ✅ | ✅ | ✅ |
| Tax deductions (NG/GH/KE) | ✅ | ✅ | ✅ |
| Multi-sig payroll approval | ✅ | ❌ | ❌ |
| On-chain audit trail | ✅ | ❌ | ❌ |
| USSD / no-data employee access | ✅ | ❌ | ❌ |
| Fee per transaction | < $0.001 | 1–3% | $20+/employee |
| Self-hostable | ✅ | ❌ | ❌ |

---

## License

[MIT](LICENSE) — free to use, modify, and distribute.

---

*Built for the [Stellar Wave Program](https://drips.network/wave/stellar) — May 2026*
