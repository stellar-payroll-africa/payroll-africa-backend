import type { AnchorConfig, Sep24DepositParams } from "./types";

export class AnchorClient {
  constructor(private config: AnchorConfig) {}

  async getStellarToml(): Promise<Record<string, unknown>> {
    const url = `https://${this.config.homeDomain}/.well-known/stellar.toml`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Failed to fetch stellar.toml from ${this.config.homeDomain}`);
    // Minimal TOML parse — production should use a proper TOML parser
    return { raw: await res.text() };
  }

  async initiateDeposit(params: Sep24DepositParams): Promise<{ url: string; id: string }> {
    const toml = await this.getStellarToml() as any;
    // TODO: extract TRANSFER_SERVER_SEP0024, POST /transactions/deposit/interactive
    throw new Error("SEP-24 deposit not yet implemented — see docs/anchor-integration.md");
  }
}
