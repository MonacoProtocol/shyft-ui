import { Program } from '@coral-xyz/anchor';
import { createOrderUiStake } from '@monaco-protocol/client';
import { PublicKey } from '@solana/web3.js';

import { DefaultAppSettings } from '@/config/settings';
import { BetSlip } from '@/context/BetSlipProvider';

export const placeOrderWithBetSlip = async (program: Program, betSlip: BetSlip) => {
  if (program.provider.publicKey) {
    console.log('Placing bet', betSlip);
    const response = await createOrderUiStake(
      program,
      new PublicKey(betSlip.marketAccount),
      betSlip.outcomeIndex,
      betSlip.forOutcome,
      betSlip.price,
      betSlip.stake,
      DefaultAppSettings.priceLadderAccount,
      undefined,
      6,
    );

    if (response.success) {
      console.log('Order placed', response.data);
      return response;
    } else {
      console.log(response.errors[0]);
      throw new Error('Error placing bet');
    }
  } else {
    throw new Error('Wallet not connected');
  }
};
