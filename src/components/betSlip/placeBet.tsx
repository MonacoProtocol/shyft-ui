import { Button } from '@nextui-org/react';
import { useWallet } from '@solana/wallet-adapter-react';
import { FC, useEffect, useState } from 'react';

import { DefaultAppSettings } from '@/config/settings';
import { BetSlip } from '@/context/BetSlipProvider';
import { useProgram } from '@/context/ProgramContext';
import { placeOrderWithBetSlip } from '@/endpoints/placeBet';
import { waitSeconds } from '@/utils/dateTime';

interface PlaceBetProps {
  betSlip: BetSlip;
  refetchOrderData: () => void;
  refetchMarketData: () => void;
}
export const PlaceBetButtonComponent: FC<PlaceBetProps> = ({
  betSlip,
  refetchOrderData,
  refetchMarketData,
}): JSX.Element => {
  const [placingBet, setPlacingBet] = useState<boolean>(false);
  const [errorPlacingBet, setErrorPlacingBet] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [betSuccess, setBetSuccess] = useState<boolean>(false);
  const [betSlipIsValid, setBetSlipIsValid] = useState<boolean>(false);
  const program = useProgram();
  const wallet = useWallet();

  useEffect(() => {
    const validateBetSlip = () => {
      if (!betSlip.marketAccount || !betSlip.outcomeAccount || !betSlip.price || !betSlip.stake) {
        return setBetSlipIsValid(false);
      }
      return setBetSlipIsValid(true);
    };
    validateBetSlip();
  }, [betSlip]);

  const handleButtonClick = async () => {
    if (program.program) {
      try {
        setPlacingBet(true);
        console.log('Placing bet');
        const betTnx = await placeOrderWithBetSlip(program.program, betSlip);
        if (!betTnx.success) {
          setPlacingBet(false);
          setErrorPlacingBet(true);
          setErrorMessage('Error placing bet - see console for details');
          console.log(betTnx.errors[0]);
          await waitSeconds(DefaultAppSettings.messagePersistSeconds);
          setErrorPlacingBet(false);
          return;
        }
        setPlacingBet(false);
        setBetSuccess(true);
        await waitSeconds(DefaultAppSettings.messagePersistSeconds);
        setBetSuccess(false);
        refetchOrderData();
        refetchMarketData();
      } catch (err) {
        setPlacingBet(false);
        setErrorPlacingBet(true);
        setErrorMessage('Error placing bet - see console for details');
        console.log(err);
        await waitSeconds(DefaultAppSettings.messagePersistSeconds);
        setErrorPlacingBet(false);
        setPlacingBet(false);
        return;
      }
    }
  };

  if (!program.program) {
    <Button isLoading spinnerPlacement="end" isDisabled color="secondary">
      Loading
    </Button>;
  }
  if (!wallet.connected) {
    return (
      <Button isDisabled color="secondary">
        Wallet not connected
      </Button>
    );
  }
  if (placingBet) {
    return (
      <Button isLoading spinnerPlacement="end" color="secondary">
        Placing Bet...
      </Button>
    );
  }
  if (betSuccess) {
    return <Button color="success">Bet Placed!</Button>;
  }
  if (errorPlacingBet) {
    return <Button color="warning">{errorMessage}</Button>;
  }
  if (!betSlipIsValid) {
    return (
      <Button isDisabled color="secondary">
        Place Bet
      </Button>
    );
  }
  return (
    <Button color="secondary" onPress={async () => await handleButtonClick()}>
      Place Bet
    </Button>
  );
};
