import { useQuery } from '@apollo/client';
import {
  Accordion,
  AccordionItem,
  Chip,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Tabs,
} from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

import { BetSlipComponent } from '@/components/betSlip/betSlip';
import { LoadingComponent } from '@/components/navigation/loading';
import { OrderListComponent } from '@/components/orders/orderList';
import { PriceCellComponent } from '@/components/priceMatrix/priceCell';
import { DefaultAppSettings } from '@/config/settings';
import { useBetSlipProvider } from '@/context/BetSlipProvider';
import { useEvents } from '@/context/EventProvider';
import { GET_MARKET_PRICES_FOR_MARKETS } from '@/queries/getMarketPricesForMarkets';
import { GET_WALLET_ORDERS_FOR_MARKETS } from '@/queries/getWalletOrdersForMarkets';
import { GQLMarket, GQLMarketInfo, GQLOutcome, GQLPrice, MappedMarketData } from '@/types/markets';
import { GQLOrderInfo } from '@/types/orders';
import { convertTimestampToDateString, nowTimestamp } from '@/utils/dateTime';
import { mapPricesToOutcomesAndFillEmptySlots } from '@/utils/marketPrices';
import { integerToUiValue } from '@/utils/numbers';

const EventPage = () => {
  const router = useRouter();
  const wallet = useWallet();
  const betSlipProvider = useBetSlipProvider();
  const [firstFetch, setFirstFetch] = useState<boolean>(true);
  const { eventAccount } = router.query;
  const { eventByAccount } = useEvents();
  const event = eventByAccount(eventAccount as string);
  const markets = event?.markets ? event.markets : [];
  const [mappedMarketData, setMappedMarketData] = useState<MappedMarketData>({});
  const [numberOfOrders, setNumberOfOrders] = useState<number>(0);
  const {
    loading: loadingMarketInfo,
    data: marketInfoData,
    refetch: refetchMarketData,
  } = useQuery<GQLMarketInfo>(GET_MARKET_PRICES_FOR_MARKETS, {
    variables: {
      marketPks: markets.map((market) => market.marketAccount),
    },
    skip: !markets.length,
    fetchPolicy: DefaultAppSettings.graphQlFetchPolicy,
  });
  const {
    loading: loadingOrdersData,
    data: ordersData,
    refetch: refetchOrderData,
  } = useQuery<GQLOrderInfo>(GET_WALLET_ORDERS_FOR_MARKETS, {
    variables: {
      marketPks: markets.map((market) => market.marketAccount),
      walletPk: wallet.publicKey?.toBase58(),
    },
    skip: !markets.length || !wallet.publicKey,
    fetchPolicy: DefaultAppSettings.graphQlFetchPolicy,
  });

  const mapMarketsOutcomesAndPrices = (
    marketPks: string[],
    data: GQLMarketInfo,
  ): MappedMarketData => {
    const mappedData: {
      [key: string]: { market: GQLMarket; outcomes: GQLOutcome[]; prices: GQLPrice[] };
    } = {};

    marketPks.forEach((marketPk) => {
      const market = data.markets.find((m) => m.pubkey === marketPk);
      const outcomes = data.outcomes
        .filter((o) => o.market === marketPk)
        .sort((a, b) => a.index - b.index);
      const prices = data.prices.filter((p) => p.market === marketPk);

      if (market) {
        mappedData[marketPk] = {
          market,
          outcomes,
          prices,
        };
      }
    });

    return mappedData;
  };

  const handleCellClick = (market: GQLMarket, outcome: GQLOutcome, price: GQLPrice) => {
    if (event) {
      betSlipProvider.setBetSlipFromMatrix(event, market, outcome, price);
    }
  };

  const handleMarketSelect = (market: GQLMarket) => {
    betSlipProvider.updateBetSlip({
      marketAccount: market.pubkey,
      marketTitle: market.title,
      outcomeTitle: '',
      outcomeAccount: '',
      outcomeIndex: 0,
    });
  };

  useEffect(() => {
    if (marketInfoData) {
      const mappedData = mapMarketsOutcomesAndPrices(
        markets.map((m) => m.marketAccount),
        marketInfoData,
      );
      setMappedMarketData(mappedData);
      betSlipProvider.updateBetSlip({
        eventName: event?.eventName,
        marketAccount: marketInfoData.markets[0].pubkey,
        marketTitle: marketInfoData.markets[0].title,
      });
      setFirstFetch(false);
    }
  }, [marketInfoData]);

  useEffect(() => {
    if (!wallet.connected) {
      setNumberOfOrders(0);
    }
    if (ordersData) {
      setNumberOfOrders(ordersData.orders.length);
    }
  }, [ordersData, wallet]);

  if (loadingMarketInfo && firstFetch) {
    return <LoadingComponent />;
  }
  if (!event) {
    return null;
  }

  return (
    <div className="main-layout">
      <div className="left-section">
        {event.categoryTitle} | {event.eventGroupTitle}
        <br />
        {event.eventName}
        <br />
        {convertTimestampToDateString(event.eventStart)} -{' '}
        {convertTimestampToDateString(event.estimatedEnd)}
        <div className="pt-10">
          <Tabs aria-label="Event tabs">
            <Tab key="markets" title="Markets">
              <Accordion variant="light" defaultExpandedKeys={['0']} className="pt-0">
                {Object.keys(mappedMarketData).map((key, index) => {
                  const market = mappedMarketData[key].market;
                  const allPrices = mappedMarketData[key].prices;
                  const outcomes = mapPricesToOutcomesAndFillEmptySlots(
                    allPrices,
                    mappedMarketData[key].outcomes,
                  );
                  const liquidity = allPrices.reduce(
                    (acc, price) => acc + price.liquidityAmount,
                    0,
                  );
                  const matchedTotal = outcomes.reduce(
                    (acc, outcome) => acc + outcome.matchedTotal,
                    0,
                  );
                  const marketLocked = market.marketLockTimestamp < nowTimestamp();
                  const positions = ordersData?.positions.find(
                    (marketPosition) => marketPosition.market === market.pubkey,
                  );
                  return (
                    <AccordionItem
                      className="text-left"
                      key={index}
                      onPress={() => handleMarketSelect(market)}
                      textValue={market.title}
                      startContent={
                        <div className="text-left">
                          {market.title}{' '}
                          {marketLocked ? (
                            <Chip size="sm" color="warning">
                              Market Locked
                            </Chip>
                          ) : (
                            <>
                              {market.suspended && (
                                <Chip size="sm" color="danger">
                                  Suspended
                                </Chip>
                              )}
                              {market.inplayEnabled ? (
                                <Chip size="sm" color="success">
                                  Inplay market
                                </Chip>
                              ) : (
                                <Chip size="sm" color="secondary">
                                  Standard market
                                </Chip>
                              )}
                              {market.inplay && (
                                <Chip size="sm" color="success" variant="dot">
                                  Live Now
                                </Chip>
                              )}
                            </>
                          )}
                          <br />
                          Liquidity: {integerToUiValue(liquidity)} | Matched Total:{' '}
                          {integerToUiValue(matchedTotal)}
                        </div>
                      }
                    >
                      <Table aria-label="Price matrix for market">
                        <TableHeader>
                          <TableColumn className="w-15">Outcome</TableColumn>
                          <TableColumn className="w-15">{''}</TableColumn>
                          <TableColumn className="text-center w-15">For</TableColumn>
                          <TableColumn className="w-15">{''}</TableColumn>
                          <TableColumn className="w-15">{''}</TableColumn>
                          <TableColumn className="text-center w-15">Against</TableColumn>
                          <TableColumn className="w-15">{''}</TableColumn>
                          <TableColumn className="w-15">
                            {wallet.connected ? 'Position' : ''}
                          </TableColumn>
                        </TableHeader>
                        <TableBody>
                          {outcomes.map((outcome, index) => {
                            const againstPrices = outcome.againstPrices;
                            const forPrices = outcome.forPrices;
                            const againstPrice1 = againstPrices[0];
                            const againstPrice2 = againstPrices[1];
                            const againstPrice3 = againstPrices[2];
                            const forPrice1 = forPrices[0];
                            const forPrice2 = forPrices[1];
                            const forPrice3 = forPrices[2];
                            return (
                              <TableRow key={index}>
                                <TableCell>{outcome.title}</TableCell>
                                <TableCell
                                  className="text-center clickable-cell w-15"
                                  onClick={() => handleCellClick(market, outcome, againstPrice1)}
                                >
                                  <PriceCellComponent price={againstPrice1} />
                                </TableCell>
                                <TableCell
                                  className="text-center clickable-cell w-15"
                                  onClick={() => handleCellClick(market, outcome, againstPrice2)}
                                >
                                  <PriceCellComponent price={againstPrice2} />
                                </TableCell>
                                <TableCell
                                  className="text-center clickable-cell w-15"
                                  onClick={() => handleCellClick(market, outcome, againstPrice3)}
                                >
                                  <PriceCellComponent price={againstPrice3} />
                                </TableCell>
                                <TableCell
                                  className="text-center clickable-cell w-15"
                                  onClick={() => handleCellClick(market, outcome, forPrice1)}
                                >
                                  <PriceCellComponent price={forPrice1} />
                                </TableCell>
                                <TableCell
                                  className="text-center clickable-cell w-15"
                                  onClick={() => handleCellClick(market, outcome, forPrice2)}
                                >
                                  <PriceCellComponent price={forPrice2} />
                                </TableCell>
                                <TableCell
                                  className="text-center clickable-cell w-15"
                                  onClick={() => handleCellClick(market, outcome, forPrice3)}
                                >
                                  <PriceCellComponent price={forPrice3} />
                                </TableCell>
                                <TableCell>
                                  {!loadingOrdersData
                                    ? positions
                                      ? integerToUiValue(
                                          positions?.marketOutcomeSums[outcome.index],
                                        )
                                      : ''
                                    : 'Fetching...'}
                                </TableCell>
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            </Tab>
            <Tab
              isDisabled={!wallet.connected}
              key="bets"
              title={
                <>
                  Bets{' '}
                  {numberOfOrders > 0 && (
                    <Chip size="sm" color="success">
                      {numberOfOrders}
                    </Chip>
                  )}
                </>
              }
            >
              <OrderListComponent
                orders={ordersData}
                markets={marketInfoData}
                refetchOrderData={refetchOrderData}
                refetchMarketData={refetchMarketData}
              />
            </Tab>
          </Tabs>
        </div>
      </div>
      <div className="right-section">
        <BetSlipComponent
          event={event}
          mappedMarketData={mappedMarketData}
          refetchOrderData={refetchOrderData}
          refetchMarketData={refetchMarketData}
        />
      </div>
    </div>
  );
};

export default EventPage;
