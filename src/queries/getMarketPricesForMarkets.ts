import { gql } from '@apollo/client';

const LIQUIDITY_FIELDS = gql`
  fragment LiquidityFields on monaco_protocol_MarketLiquidities {
    liquiditiesAgainst
    liquiditiesFor
    market
    pubkey
    stakeMatchedTotal
    enableCrossMatching
  }
`;

export const GET_MARKET_PRICES_FOR_MARKETS = gql`
  ${LIQUIDITY_FIELDS}
  query GetMarketInfo($marketPks: [String!]) {
    markets: monaco_protocol_Market(where: { pubkey: { _in: $marketPks } }) {
      eventStartOrderBehaviour
      eventStartTimestamp
      inplay
      inplayEnabled
      inplayOrderDelay
      marketLockOrderBehaviour
      marketLockTimestamp
      marketOutcomesCount
      marketSettleTimestamp
      marketStatus
      marketType
      marketWinningOutcomeIndex
      pubkey
      published
      suspended
      title
    }
    outcomes: monaco_protocol_MarketOutcome(where: { market: { _in: $marketPks } }) {
      index
      pubkey
      title
      market
    }
    prices: monaco_protocol_MarketLiquidities(where: { market: { _in: $marketPks } }) {
      ...LiquidityFields
    }
  }
`;
