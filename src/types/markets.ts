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

export interface MarketData {
  market: GQLMarket;
  outcomes: GQLOutcome[];
  prices: GQLPrice;
}

export interface MappedMarketData {
  [key: string]: MarketData;
}

export interface Liquidity {
  price: string;
  outcome: number;
  liquidity: string;
}

export interface ConvertedLiquidity {
  price: number;
  outcome: number;
  liquidity: number;
}

export interface GQLPrice {
  liquiditiesAgainst: Liquidity[];
  liquiditiesFor: Liquidity[];
  market: string;
  pubkey: string;
  stakeMatchedTotal: number;
  totalLiquidity: number;
  enableCrossMatching: boolean;
}

export const DefaultGQLPrice = (marketPk: string): GQLPrice => ({
  liquiditiesAgainst: [],
  liquiditiesFor: [],
  market: marketPk,
  pubkey: '',
  stakeMatchedTotal: 0,
  totalLiquidity: 0,
  enableCrossMatching: false,
});
