import { FC, createContext, useContext, useState } from 'react';

import { MonacoProtocolEvent } from '@/types/events';
import { GQLMarket, GQLOutcome, GQLPrice } from '@/types/markets';

export interface BetSlip {
  eventName: string;
  marketTitle: string;
  marketAccount: string;
  outcomeTitle: string;
  outcomeAccount: string;
  outcomeIndex: number;
  forOutcome: boolean;
  price: number;
  stake: number;
  risk: number;
  potentialPayout: number;
}

const emptyBetSlip: BetSlip = {
  eventName: '',
  marketTitle: '',
  marketAccount: '',
  outcomeTitle: '',
  outcomeAccount: '',
  outcomeIndex: 0,
  forOutcome: true,
  price: 2,
  stake: 0.001,
  risk: 1,
  potentialPayout: 2,
};

interface BetSlipContextProps {
  betSlip: BetSlip;
  setBetSlipFromMatrix: (
    event: MonacoProtocolEvent,
    market: GQLMarket,
    outcome: GQLOutcome,
    price: GQLPrice,
  ) => void;
  updateBetSlip: (newValues: Partial<BetSlip>) => void;
}

const BetSlipContext = createContext<BetSlipContextProps | undefined>(undefined);

type BetSlipProviderProps = {
  children: React.ReactNode;
};

export const BetSlipProvider: FC<BetSlipProviderProps> = ({ children }) => {
  const [betSlip, setBetSlip] = useState<BetSlip>(emptyBetSlip);

  const setBetSlipFromMatrix = (
    event: MonacoProtocolEvent,
    market: GQLMarket,
    outcome: GQLOutcome,
    price: GQLPrice,
  ) => {
    const risk = price.forOutcome
      ? betSlip.stake
      : parseFloat((betSlip.stake * price.price).toFixed(2));
    const potentialPayout = price.forOutcome
      ? parseFloat((betSlip.stake * price.price - betSlip.stake).toFixed(2))
      : betSlip.stake;
    const newBetSlip: BetSlip = {
      ...betSlip,
      eventName: event.eventName,
      marketTitle: market.title,
      marketAccount: market.pubkey,
      outcomeTitle: outcome.title,
      outcomeAccount: outcome.pubkey,
      outcomeIndex: outcome.index,
      forOutcome: price.forOutcome,
      price: price.price,
      risk: isNaN(risk) ? 0 : risk,
      potentialPayout: isNaN(potentialPayout) ? 0 : potentialPayout,
    };
    console.log('slipFromMatrix', newBetSlip);
    setBetSlip(newBetSlip);
  };

  const updateBetSlip = (newValues: Partial<BetSlip>) => {
    const forOutcome =
      newValues.forOutcome !== undefined ? newValues.forOutcome : betSlip.forOutcome;
    const price = newValues.price !== undefined ? newValues.price : betSlip.price;
    const stake = newValues.stake !== undefined ? newValues.stake : betSlip.stake;
    const risk = forOutcome ? stake : parseFloat((stake * price - stake).toFixed(2));
    const potentialPayout = forOutcome ? parseFloat((stake * price - stake).toFixed(2)) : stake;
    const newBetSlip = {
      ...betSlip,
      ...newValues,
      ...{
        risk: isNaN(risk) ? 0 : risk,
        potentialPayout: isNaN(potentialPayout) ? 0 : potentialPayout,
      },
    };
    console.log('updateBetSlip', newBetSlip);
    setBetSlip(newBetSlip);
  };

  return (
    <BetSlipContext.Provider
      value={{
        betSlip,
        setBetSlipFromMatrix,
        updateBetSlip,
      }}
    >
      {children}
    </BetSlipContext.Provider>
  );
};

export const useBetSlipProvider = (): BetSlipContextProps => {
  const context = useContext(BetSlipContext);
  if (context === undefined) {
    throw new Error('useBetSlipProvider must be used within a BetSlipProvider');
  }
  return context;
};
