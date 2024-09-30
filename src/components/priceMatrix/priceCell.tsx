import { FC } from 'react';

import { ConvertedLiquidity, GQLPrice } from '@/types/markets';
import { integerToUiValue } from '@/utils/numbers';

interface PriceCellProps {
  price: ConvertedLiquidity;
  forOutcome: boolean;
}

export const PriceCellComponent: FC<PriceCellProps> = ({ price, forOutcome }): JSX.Element => {
  const baseClass = `flex flex-col items-center justify-center h-9 w-20 text-xs rounded-xl`;
  if (price.price === 0) {
    return <div className={`${baseClass}`}>-</div>;
  }
  const cellColor = forOutcome ? 'bg-purple-500' : 'bg-blue-500';
  return (
    <div className={`${baseClass} ${cellColor}`}>
      {price.price ? price.price : '-'}
      <br />
      {price.liquidity ? integerToUiValue(price.liquidity) : ''}
    </div>
  );
};
