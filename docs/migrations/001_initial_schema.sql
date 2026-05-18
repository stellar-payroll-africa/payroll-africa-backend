-- StellarPayroll Africa — Initial Schema
-- Run with: psql $DATABASE_URL -f docs/migrations/001_initial_schema.sql

CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE organizations (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name        TEXT NOT NULL,
  country     CHAR(2) NOT NULL,          -- ISO 3166-1 alpha-2
  tax_id      TEXT,
  stellar_account TEXT,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE employees (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id          UUID NOT NULL REFERENCES organizations(id),
  name            TEXT NOT NULL,
  phone           TEXT,
  email           TEXT,
  national_id     TEXT,
  wallet_address  TEXT,
  status          TEXT NOT NULL DEFAULT 'pending', -- pending|active|offboarded
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE pay_periods (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  org_id      UUID NOT NULL REFERENCES organizations(id),
  start_date  DATE NOT NULL,
  end_date    DATE NOT NULL,
  pay_date    DATE NOT NULL,
  status      TEXT NOT NULL DEFAULT 'draft' -- draft|approved|disbursing|completed
);

CREATE TABLE payroll_items (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  pay_period_id   UUID NOT NULL REFERENCES pay_periods(id),
  employee_id     UUID NOT NULL REFERENCES employees(id),
  gross_amount    NUMERIC(18,6) NOT NULL,
  net_amount      NUMERIC(18,6) NOT NULL,
  currency        CHAR(3) NOT NULL,
  status          TEXT NOT NULL DEFAULT 'pending'
);

CREATE TABLE deductions (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id UUID NOT NULL REFERENCES payroll_items(id),
  type            TEXT NOT NULL, -- PAYE|NHIS|PENSION|SSNIT|NSSF|NHIF|NHF|HOUSING_LEVY|CUSTOM
  amount          NUMERIC(18,6) NOT NULL,
  description     TEXT
);

CREATE TABLE disbursements (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id UUID NOT NULL REFERENCES payroll_items(id),
  sdp_payment_id  TEXT,
  stellar_tx_hash TEXT,
  anchor          TEXT,
  status          TEXT NOT NULL DEFAULT 'pending',
  settled_at      TIMESTAMPTZ
);

CREATE TABLE payslips (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  payroll_item_id UUID NOT NULL REFERENCES payroll_items(id),
  pdf_url         TEXT,
  sent_at         TIMESTAMPTZ
);
