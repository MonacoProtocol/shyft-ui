import { useQuery } from '@apollo/client';
import { useWallet } from '@solana/wallet-adapter-react';
import { useEffect, useState } from 'react';

import { PositionComponent } from '@/components/marketPosition/position';
import { LoadingComponent } from '@/components/navigation/loading';
import { DefaultAppSettings } from '@/config/settings';
import { useEvents } from '@/context/EventProvider';
import { GET_MARKET_POSITIONS_FOR_WALLET } from '@/queries/getMarketPositionsForWallet';
import { GET_MARKET_PRICES_FOR_MARKETS } from '@/queries/getMarketPricesForMarkets';
import { GQLMarketPositions } from '@/types/marketPosition';
import { GQLMarketInfo } from '@/types/markets';

const defaultPositions: GQLMarketPositions = {
  marketPositions: [],
};

const defaultMarketInfo: GQLMarketInfo = {
  markets: [],
  outcomes: [],
  prices: [],
};

function WalletPage() {
  const wallet = useWallet();
  const { eventByMarketPk, loading } = useEvents();
  const [positions, setPositions] = useState<GQLMarketPositions>(defaultPositions);
  const [marketPks, setMarketPks] = useState<string[]>([]);
  const [markets, setMarkets] = useState<GQLMarketInfo>(defaultMarketInfo);

  const { data: positionsData } = useQuery<GQLMarketPositions>(GET_MARKET_POSITIONS_FOR_WALLET, {
    variables: {
      walletPk: wallet.publicKey?.toBase58(),
      paid: false,
    },
    skip: !wallet.publicKey,
    fetchPolicy: DefaultAppSettings.graphQlFetchPolicy,
  });

  const { data: marketData } = useQuery(GET_MARKET_PRICES_FOR_MARKETS, {
    variables: {
      marketPks: marketPks,
    },
    skip: marketPks.length === 0,
    fetchPolicy: DefaultAppSettings.graphQlFetchPolicy,
  });

  useEffect(() => {
    if (positionsData) {
      setPositions(positionsData);
      setMarketPks(positionsData.marketPositions.map((position) => position.market));
    }
  }, [positionsData]);

  useEffect(() => {
    if (marketData) {
      setMarkets(marketData);
    }
  }, [marketData]);

  if (loading) {
    return <LoadingComponent />;
  }
  return (
    <div className="main-layout">
      <div className="left-section">
        <div className="text-lg font-bold pb-5">Open Market Positions</div>
        {positions.marketPositions.map((position, index) => {
          const event = eventByMarketPk(position.market);
          const market = markets.markets.find((market) => market.pubkey === position.market);
          const outcomes = markets.outcomes.filter((outcome) => outcome.market === position.market);
          return (
            <PositionComponent
              key={index}
              position={position}
              event={event}
              market={market}
              outcomes={outcomes}
            />
          );
        })}
      </div>
    </div>
  );
}

export default WalletPage;
