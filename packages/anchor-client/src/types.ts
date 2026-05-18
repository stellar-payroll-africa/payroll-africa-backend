export interface AnchorConfig {
  homeDomain: string;
  networkPassphrase: string;
}

export interface Sep24DepositParams {
  assetCode: string;
  assetIssuer: string;
  account: string;
  amount: string;
  lang?: string;
}
