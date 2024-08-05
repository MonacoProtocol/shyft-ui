export interface GQLOrderInfo {
  orders: GQLOrder[];
  positions: GQLPosition[];
}

export interface GQLOrder {
  creationTimestamp: number;
  expectedPrice: number;
  forOutcome: number;
  market: string;
  marketOutcomeIndex: number;
  orderStatus: string;
  payer: string;
  payout: number;
  product: string;
  productCommissionRate: number;
  pubkey: string;
  purchaser: string;
  stake: number;
  stakeUnmatched: number;
  voidedStake: number;
}

export interface GQLPosition {
  market: string;
  marketOutcomeSums: number[];
  matchedRisk: number;
  matchedRiskPerProduct: number[];
  paid: number;
  payer: string;
  pubkey: string;
  purchaser: string;
  unmatchedExposures: number[];
}
