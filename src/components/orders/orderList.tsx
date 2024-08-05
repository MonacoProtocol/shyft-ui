import {
  Table,
  TableBody,
  TableCell,
  TableColumn,
  TableHeader,
  TableRow,
  Link,
} from '@nextui-org/react';
import { FC } from 'react';

import { GQLMarketInfo } from '@/types/markets';
import { GQLOrderInfo } from '@/types/orders';
import { integerToUiValue } from '@/utils/numbers';
import { MappedOrderStatuses, parseOrderStatus, truncatePkString } from '@/utils/strings';

import { CancelBetButtonComponent } from './cancelBet';

interface OrderListProps {
  orders: GQLOrderInfo | undefined;
  markets: GQLMarketInfo | undefined;
  refetchOrderData: () => void;
  refetchMarketData: () => void;
}

export const OrderListComponent: FC<OrderListProps> = ({
  orders,
  markets,
  refetchOrderData,
  refetchMarketData,
}): JSX.Element => {
  if (!orders || !markets) {
    return <div>No orders</div>;
  }

  const ordersForMarket = (marketPk: string) => {
    // TODO order orders
    return orders.orders.filter((order) => order.market === marketPk);
  };

  return (
    <>
      {markets.markets.map((market) => {
        return (
          <div key={`orders-${market.pubkey}`}>
            {market.title}{' '}
            <Table aria-label={`Bets on market: ${market.title}`}>
              <TableHeader>
                <TableColumn className="w-15">OrderPk</TableColumn>
                <TableColumn className="w-15">For</TableColumn>
                <TableColumn className="w-15">Outcome</TableColumn>
                <TableColumn className="w-15">Risked</TableColumn>
                <TableColumn className="w-15">Price</TableColumn>
                <TableColumn className="w-15">Return</TableColumn>
                <TableColumn className="w-15">Status</TableColumn>
                <TableColumn className="w-15">{''}</TableColumn>
              </TableHeader>
              <TableBody>
                {ordersForMarket(market.pubkey).map((order) => {
                  const outcomes = markets.outcomes.filter(
                    (outcome) => outcome.market === order.market,
                  );
                  return (
                    <TableRow key={`order-${order.pubkey}`}>
                      <TableCell className="w-5">
                        <Link
                          isExternal
                          showAnchorIcon
                          href={`https://explorer.solana.com/address/${order.pubkey}/anchor-account`}
                        >
                          {truncatePkString(order.pubkey)}
                        </Link>
                      </TableCell>
                      <TableCell className="w-15">{order.forOutcome ? 'For' : 'Against'}</TableCell>
                      <TableCell className="w-15">
                        {
                          outcomes.find((outcome) => outcome.index === order.marketOutcomeIndex)
                            ?.title
                        }
                      </TableCell>
                      <TableCell className="w-15">
                        {order.forOutcome
                          ? integerToUiValue(order.stake)
                          : integerToUiValue(order.stake * order.expectedPrice - order.stake)}
                      </TableCell>
                      <TableCell className="w-15">{order.expectedPrice}</TableCell>
                      <TableCell className="w-15">
                        {integerToUiValue(
                          (order.stake - order.stakeUnmatched) * order.expectedPrice,
                        )}
                      </TableCell>
                      <TableCell className="w-15">
                        {parseOrderStatus(order.orderStatus) === MappedOrderStatuses.matched &&
                        order.stakeUnmatched > 0
                          ? 'partial match'
                          : parseOrderStatus(order.orderStatus)}
                      </TableCell>
                      <TableCell className="w-15">
                        <CancelBetButtonComponent
                          order={order}
                          refetchOrderData={refetchOrderData}
                          refetchMarketData={refetchMarketData}
                        />
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        );
      })}
    </>
  );
};
