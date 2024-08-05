import { gql } from '@apollo/client';

export const GET_MARKET_PRICES_FOR_MARKETS = gql`
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
      latestMatchedPrice
      matchedTotal
      pubkey
      title
      market
    }
    prices: monaco_protocol_MarketMatchingPool(
      where: { market: { _in: $marketPks }, liquidityAmount: { _gt: "0" } }
    ) {
      forOutcome
      liquidityAmount
      market
      marketOutcomeIndex
      matchedAmount
      price
      pubkey
    }
  }
`;
