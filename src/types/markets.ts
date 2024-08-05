export interface GQLMarketInfo {
  markets: GQLMarket[];
  outcomes: GQLOutcome[];
  prices: GQLPrice[];
}

export interface GQLMarket {
  eventStartOrderBehaviour: string;
  eventStartTimestamp: number;
  inplay: boolean;
  inplayEnabled: boolean;
  inplayOrderDelay: number;
  marketLockOrderBehaviour: string;
  marketLockTimestamp: number;
  marketOutcomesCount: number;
  marketSettleTimestamp: number | null;
  marketStatus: string;
  marketType: string;
  marketWinningOutcomeIndex: number;
  pubkey: string;
  published: boolean;
  suspended: boolean;
  title: string;
}

export interface GQLOutcome {
  index: number;
  latestMatchedPrice: number;
  matchedTotal: number;
  pubkey: string;
  title: string;
  market: string;
}

export interface GQLPrice {
  forOutcome: boolean;
  liquidityAmount: number;
  market: string;
  marketOutcomeIndex: number;
  matchedAmount: number;
  price: number;
  pubkey: string;
}

export interface MarketData {
  market: GQLMarket;
  outcomes: GQLOutcome[];
  prices: GQLPrice[];
}

export interface MappedMarketData {
  [key: string]: MarketData;
}
