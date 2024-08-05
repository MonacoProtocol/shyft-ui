export interface GQLMarketPositions {
  marketPositions: GQLMarketPosition[];
}

export interface GQLMarketPosition {
  market: string;
  marketOutcomeSums: number[];
  matchedRisk: number;
  unmatchedExposures: number[];
}
