# Contributing to StellarPayroll Africa

Thank you for your interest! This project is part of the **Stellar Wave Program** — contributors earn **4x points** on the Drips Network.

## Quick Start

```bash
git clone https://github.com/your-org/stellarpayroll-africa
cd stellarpayroll-africa
docker compose up -d postgres redis
```

## Issue Labels

| Label | Description | Points |
|---|---|---|
| `good-first-issue` | UI components, tax rate updates | 1x |
| `country-support` | New tax jurisdiction | 2x |
| `anchor-integration` | New anchor SEP-24 integration | 3x |
| `smart-contract` | Soroban contract work | 4x |

## Project Structure

See [docs/architecture.md](docs/architecture.md) for a full breakdown.

## Pull Request Guidelines

1. Fork the repo and create a branch: `git checkout -b feat/your-feature`
2. Write tests for new logic (especially tax calculations)
3. Run `docker compose up` and verify end-to-end
4. Open a PR against `main` with a clear description

## Tax Engine Contributions

Each country lives in `packages/tax-engine/src/countries/<iso2>.ts`. Add the file, export it from `calculator.ts`, and add tests in `packages/tax-engine/src/countries/__tests__/`.

## Code of Conduct

Be respectful. We follow the [Contributor Covenant](https://www.contributor-covenant.org/).
