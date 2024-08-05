'use client';

import { Divider } from '@nextui-org/react';
import { useRouter } from 'next/router';
import { FC } from 'react';

import { MonacoProtocolEvent } from '@/types/events';
import { GQLMarketPosition } from '@/types/marketPosition';
import { GQLMarket, GQLOutcome } from '@/types/markets';
import { integerToUiValue } from '@/utils/numbers';

interface PositionProps {
  position: GQLMarketPosition;
  event?: MonacoProtocolEvent;
  market?: GQLMarket;
  outcomes?: GQLOutcome[];
}

export const PositionComponent: FC<PositionProps> = ({
  position,
  event,
  market,
  outcomes,
}): JSX.Element => {
  if (!event) {
    return <div>Position for unknown event</div>;
  }

  const router = useRouter();

  const navigateToEvent = (eventAccount: string) => {
    router.push(`/events/${eventAccount}`);
  };

  const marketTitle = market?.title ?? 'Unknown Market';
  const mappedPosition = position.unmatchedExposures.map((exposure, index) => {
    const outcomeTitle =
      outcomes?.find((outcome) => outcome.index === index)?.title ?? `Outcome ${index + 1}`;
    return {
      outcome: outcomeTitle,
      matchedRisk: integerToUiValue(position.marketOutcomeSums[index]),
      unmatchedExposure: integerToUiValue(exposure),
    };
  });

  return (
    <div>
      <div className="font-bold pt-5 pb-5">
        {event.eventName}
        <p />
        <a
          className="cursor-pointer text-blue-500"
          onClick={() => navigateToEvent(event.eventAccount)}
        >
          View Event
        </a>
      </div>
      <div className="size-lg font-bold  bg-blue-500 p-2 pl-5">{marketTitle}</div>
      <div className="font-bold grid grid-rows-1 grid-flow-col gap-5 pb-5 pt-5">
        <div className="w-36">Outcome</div>
        <div className="w-36">Matched</div>
        <div className="w-36">Unmatched</div>
      </div>
      <div>
        {mappedPosition.map((position, index) => (
          <div key={index} className="grid grid-rows-1 grid-flow-col gap-5 pb-3 text-gray-400 ">
            <div className="w-36">{position.outcome}</div>
            <div className="w-36">{position.matchedRisk}</div>
            <div className="w-36">{position.unmatchedExposure}</div>
          </div>
        ))}
      </div>
      <div className="pt-3">
        <Divider />
      </div>
    </div>
  );
};
