import { FC } from 'react';

import { GQLPrice } from '@/types/markets';
import { integerToUiValue } from '@/utils/numbers';

interface PriceCellProps {
  price: GQLPrice;
}

export const PriceCellComponent: FC<PriceCellProps> = ({ price }): JSX.Element => {
  const baseClass = `flex flex-col items-center justify-center h-9 w-20 text-xs rounded-xl`;
  if (price.price === 0) {
    return <div className={`${baseClass}`}>-</div>;
  }
  const cellColor = price.forOutcome ? 'bg-purple-500' : 'bg-blue-500';
  return (
    <div className={`${baseClass} ${cellColor}`}>
      {price.price ? price.price : '-'}
      <br />
      {price.liquidityAmount ? integerToUiValue(price.liquidityAmount) : ''}
    </div>
  );
};
