import { WatchQueryFetchPolicy } from '@apollo/client';
import { PublicKey } from '@solana/web3.js';

export interface AppSettings {
  rpcNode: string;
  shyftApi: string;
  eventsUrl: string;
  graphQlFetchPolicy: WatchQueryFetchPolicy;
  programAddress: string;
  usdcAddress: string;
  mintPk: PublicKey;
  mintDecimals: number;
  priceLadderAccount: PublicKey;
  messagePersistSeconds: number;
  debug: boolean;
}

const shyftApiKey = '';
const rpcNode = '';

export const DefaultAppSettings: AppSettings = {
  rpcNode,
  shyftApi: `https://programs.shyft.to/v0/graphql/?api_key=${shyftApiKey}&network=mainnet-beta`,
  eventsUrl: 'https://prod.events.api.betdex.com/events',
  graphQlFetchPolicy: 'no-cache',
  programAddress: 'monacoUXKtUi6vKsQwaLyxmXKSievfNWEcYXTgkbCih',
  usdcAddress: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  mintPk: new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v'),
  mintDecimals: 6,
  priceLadderAccount: new PublicKey('GGBay2i5Kut37XVNfVLSDuoCyyAELLtNHqMxU2YhRRUK'),
  messagePersistSeconds: 4,
  debug: true,
};
