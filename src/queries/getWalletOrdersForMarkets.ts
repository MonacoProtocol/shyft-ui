import { gql } from '@apollo/client';

export const GET_WALLET_ORDERS_FOR_MARKETS = gql`
  query GetOrdersForMarkets($marketPks: [String!], $walletPk: String!) {
    orders: monaco_protocol_Order(
      where: { market: { _in: $marketPks }, purchaser: { _eq: $walletPk } }
    ) {
      creationTimestamp
      expectedPrice
      forOutcome
      market
      marketOutcomeIndex
      orderStatus
      payer
      payout
      product
      productCommissionRate
      pubkey
      purchaser
      stake
      stakeUnmatched
      voidedStake
    }
    positions: monaco_protocol_MarketPosition(
      where: { market: { _in: $marketPks }, purchaser: { _eq: $walletPk } }
    ) {
      market
      marketOutcomeSums
      matchedRisk
      matchedRiskPerProduct
      paid
      payer
      pubkey
      purchaser
      unmatchedExposures
    }
  }
`;
