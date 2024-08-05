export function truncatePkString(stringToTruncate: string): string {
  const stringLength = stringToTruncate.length;
  return `${stringToTruncate.substring(0, 5)}...${stringToTruncate.substring(
    stringLength - 5,
    stringLength,
  )}`;
}

export enum MappedOrderStatuses {
  open = 'open',
  matched = 'matched',
  settledWon = 'settledWon',
  settledLost = 'settledLost',
  cancelled = 'cancelled',
  voided = 'voided',
}

export const parseOrderStatus = (status: string): string => {
  switch (true) {
    case Object.prototype.hasOwnProperty.call(status, MappedOrderStatuses.open):
      return MappedOrderStatuses.open;
    case Object.prototype.hasOwnProperty.call(status, MappedOrderStatuses.matched):
      return MappedOrderStatuses.matched;
    case Object.prototype.hasOwnProperty.call(status, MappedOrderStatuses.settledWon):
      return MappedOrderStatuses.settledWon;
    case Object.prototype.hasOwnProperty.call(status, MappedOrderStatuses.settledLost):
      return MappedOrderStatuses.settledLost;
    case Object.prototype.hasOwnProperty.call(status, MappedOrderStatuses.cancelled):
      return MappedOrderStatuses.cancelled;
    case Object.prototype.hasOwnProperty.call(status, MappedOrderStatuses.voided):
      return MappedOrderStatuses.voided;
    default:
      return 'unknown';
  }
};
