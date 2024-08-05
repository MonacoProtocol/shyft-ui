import { Card, CardBody, CardHeader, Input, Select, SelectItem, Switch } from '@nextui-org/react';
import { FC, useEffect, useState } from 'react';

import { BetSlip, useBetSlipProvider } from '@/context/BetSlipProvider';
import { MonacoProtocolEvent } from '@/types/events';
import { MappedMarketData, MarketData } from '@/types/markets';

import { PlaceBetButtonComponent } from './placeBet';
import PriceInputWithValidation from './priceInput';

interface BetSlipProps {
  event: MonacoProtocolEvent;
  mappedMarketData: MappedMarketData;
  refetchOrderData: () => void;
  refetchMarketData: () => void;
}

export const BetSlipComponent: FC<BetSlipProps> = ({
  event,
  mappedMarketData,
  refetchOrderData,
  refetchMarketData,
}): JSX.Element => {
  const betSlipProvider = useBetSlipProvider();
  const [isForOutcome, setIsForOutcome] = useState<boolean>(betSlipProvider.betSlip.forOutcome);
  const [internalBetSlip, setInternalBetSlip] = useState<BetSlip>(betSlipProvider.betSlip);
  const marketList = mappedMarketData ? Object.values(mappedMarketData) : [];
  const [currentMarket, setCurrentMarket] = useState<MarketData>(marketList[0]);

  useEffect(() => {
    const market = marketList.find(
      (market) => market.market.pubkey === betSlipProvider.betSlip.marketAccount,
    );
    if (market) {
      setCurrentMarket(market);
    }
    setInternalBetSlip(betSlipProvider.betSlip);
    setIsForOutcome(betSlipProvider.betSlip.forOutcome);
  }, [betSlipProvider, betSlipProvider.betSlip]);

  useEffect(() => {
    betSlipProvider.updateBetSlip({ forOutcome: isForOutcome });
  }, [isForOutcome]);

  const handleMarketChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const market = marketList.find((market) => market.market.pubkey === event.target.value);
    if (market) {
      setCurrentMarket(market);
      const updatedBetSlip = {
        ...internalBetSlip,
        marketAccount: market.market.pubkey,
        marketTitle: market.market.title,
        outcomeTitle: '',
        outcomeAccount: '',
        outcomeIndex: 0,
      };
      betSlipProvider.updateBetSlip(updatedBetSlip);
      setInternalBetSlip(updatedBetSlip);
    }
  };

  const handleOutcomeChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const outcome = currentMarket.outcomes.find((outcome) => outcome.pubkey === event.target.value);
    if (outcome) {
      const updatedBetSlip = {
        ...internalBetSlip,
        outcomeTitle: outcome.title,
        outcomeAccount: outcome.pubkey,
        outcomeIndex: outcome.index,
      };
      betSlipProvider.updateBetSlip(updatedBetSlip);
      setInternalBetSlip(updatedBetSlip);
    }
  };

  const handlePriceChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const updatedBetSlip = {
      ...internalBetSlip,
      price: event.target.valueAsNumber,
    };
    betSlipProvider.updateBetSlip(updatedBetSlip);
    setInternalBetSlip(updatedBetSlip);
  };

  if (!currentMarket) {
    return <></>;
  }

  return (
    <Card isFooterBlurred radius="lg" className="w-9/10">
      <CardHeader className="text-center">Bet Slip</CardHeader>
      <CardBody>
        <Input isReadOnly type="text" variant="underlined" value={event.eventName} />
        <Select
          key={internalBetSlip.marketAccount || 'default-market'}
          label="Market"
          variant="underlined"
          defaultSelectedKeys={[
            internalBetSlip?.marketAccount
              ? internalBetSlip?.marketAccount
              : marketList.length > 0
                ? marketList[0].market.pubkey
                : '',
          ]}
          onChange={(event) => {
            handleMarketChange(event);
          }}
        >
          {marketList.map((market) => (
            <SelectItem
              key={market.market.pubkey}
              value={market.market.pubkey}
              textValue={market.market.title}
            >
              {market.market.title}
            </SelectItem>
          ))}
        </Select>

        <Select
          key={internalBetSlip.outcomeAccount || 'default-outcome'}
          label="Outcomes"
          variant="underlined"
          defaultSelectedKeys={[
            internalBetSlip.outcomeAccount ? internalBetSlip.outcomeAccount : '',
          ]}
          onChange={(event) => {
            handleOutcomeChange(event);
          }}
        >
          {currentMarket.outcomes.map((outcome) => (
            <SelectItem key={outcome.pubkey} value={outcome.pubkey} textValue={outcome.title}>
              {outcome.title}
            </SelectItem>
          ))}
        </Select>
        <PriceInputWithValidation
          value={internalBetSlip.price.toString()}
          onChange={(event) => {
            handlePriceChange(event);
          }}
        />
        <Input
          type="number"
          variant="underlined"
          label="Stake ($)"
          defaultValue={internalBetSlip.stake.toString()}
          onChange={(event) => {
            betSlipProvider.updateBetSlip({ stake: event.target.valueAsNumber });
          }}
        />
        <Input
          isReadOnly
          isDisabled
          type="text"
          variant="underlined"
          label="Risk ($)"
          value={internalBetSlip.risk.toString()}
        />
        <Input
          isReadOnly
          isDisabled
          type="text"
          variant="underlined"
          label="Potential Payout ($)"
          value={internalBetSlip.potentialPayout.toString()}
        />
        <Switch
          className="h-25 p-5 px-0"
          isSelected={isForOutcome}
          onValueChange={setIsForOutcome}
          defaultSelected
          color="success"
        >
          {isForOutcome ? 'For Outcome' : 'Against Outcome'}
        </Switch>
        <PlaceBetButtonComponent
          betSlip={betSlipProvider.betSlip}
          refetchOrderData={refetchOrderData}
          refetchMarketData={refetchMarketData}
        />
      </CardBody>
    </Card>
  );
};
