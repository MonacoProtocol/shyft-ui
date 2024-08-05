import { gql } from '@apollo/client';

export const GET_MARKET_POSITIONS_FOR_WALLET = gql`
  query MarketPositionsForWallet($walletPk: String!) {
    marketPositions: monaco_protocol_MarketPosition(
      where: { purchaser: { _eq: $walletPk }, paid: { _eq: false } }
    ) {
      market
      marketOutcomeSums
      matchedRisk
      unmatchedExposures
    }
  }
`;
