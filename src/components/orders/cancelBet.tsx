import { Button } from '@nextui-org/react';
import { FC, useState } from 'react';

import { DefaultAppSettings } from '@/config/settings';
import { useProgram } from '@/context/ProgramContext';
import cancelOrderByPk from '@/endpoints/cancelBet';
import { GQLOrder } from '@/types/orders';
import { waitSeconds } from '@/utils/dateTime';

interface CancelBetProps {
  order: GQLOrder;
  refetchOrderData: () => void;
  refetchMarketData: () => void;
}

export const CancelBetButtonComponent: FC<CancelBetProps> = ({
  order,
  refetchOrderData,
  refetchMarketData,
}): JSX.Element => {
  const [canCancel, setCanCancel] = useState<boolean>(order.stakeUnmatched > 0);
  const [cancelling, setCancelling] = useState<boolean>(false);
  const [cancelled, setCancelled] = useState<boolean>(false);
  const [errorCancelling, setErrorCancelling] = useState<boolean>(false);
  const program = useProgram();

  const handleButtonClick = async () => {
    if (program.program) {
      try {
        setCancelling(true);
        const cancelTnx = await cancelOrderByPk(program.program, order.pubkey);
        if (!cancelTnx.success) {
          console.log(cancelTnx.errors);
          setCancelling(false);
          setErrorCancelling(true);
          await waitSeconds(DefaultAppSettings.messagePersistSeconds);
          setErrorCancelling(false);
          return;
        }
        setCancelling(false);
        setCancelled(true);
        await waitSeconds(5);
        setCanCancel(false);
        refetchOrderData();
        refetchMarketData();
      } catch (err) {
        setCancelling(false);
        setErrorCancelling(true);
        await waitSeconds(5);
        setErrorCancelling(false);
        console.log(err);
      }
    }
  };

  if (!canCancel) {
    return <Button isDisabled variant="light"></Button>;
  }

  if (cancelling) {
    return <Button isLoading spinnerPlacement="end" className="w-25" color="secondary"></Button>;
  }

  if (errorCancelling) {
    return (
      <Button className="w-25" color="danger">
        Error
      </Button>
    );
  }

  if (cancelled) {
    return (
      <Button className="w-25" color="success">
        Done!
      </Button>
    );
  }

  return (
    <Button className="w-25" color="secondary" onPress={async () => await handleButtonClick()}>
      Cancel
    </Button>
  );
};
