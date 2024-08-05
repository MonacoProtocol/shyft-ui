import { ApolloClient, ApolloProvider, NormalizedCacheObject } from '@apollo/client';
import { NextUIProvider } from '@nextui-org/react';
import { WalletAdapterNetwork } from '@solana/wallet-adapter-base';
import { ConnectionProvider, WalletProvider } from '@solana/wallet-adapter-react';
import { WalletModalProvider } from '@solana/wallet-adapter-react-ui';
import { clusterApiUrl } from '@solana/web3.js';
import type { AppProps } from 'next/app';
import React, { useState, useEffect, useMemo } from 'react';
import type { FC } from 'react';

import '../app/globals.css';
import Layout from '@/app/layout';
import { createGQLClient } from '@/clients/graphql';
import { BetSlipProvider } from '@/context/BetSlipProvider';
import { EventProvider } from '@/context/EventProvider';
import { ProgramProvider } from '@/context/ProgramContext';
import { ThemeProvider } from '@/context/ThemeProvider';

require('@solana/wallet-adapter-react-ui/styles.css');

const App: FC<AppProps> = ({ Component, pageProps }) => {
  const [client, setClient] = useState<ApolloClient<NormalizedCacheObject> | null>(null);
  const network = WalletAdapterNetwork.Mainnet;
  const endpoint = useMemo(() => clusterApiUrl(network), [network]);
  const wallets = useMemo(() => [], []);

  useEffect(() => {
    const initializeApolloClient = async () => {
      const apolloClient = await createGQLClient();
      setClient(apolloClient);
    };

    initializeApolloClient();
  }, []);

  if (!client) {
    return <div>Loading...</div>;
  }

  return (
    <NextUIProvider>
      <ThemeProvider>
        <ApolloProvider client={client}>
          <ConnectionProvider endpoint={endpoint}>
            <WalletProvider wallets={wallets} autoConnect>
              <WalletModalProvider>
                <ProgramProvider>
                  <EventProvider>
                    <BetSlipProvider>
                      <Layout>
                        <Component {...pageProps} />
                      </Layout>
                    </BetSlipProvider>
                  </EventProvider>
                </ProgramProvider>
              </WalletModalProvider>
            </WalletProvider>
          </ConnectionProvider>
        </ApolloProvider>
      </ThemeProvider>
    </NextUIProvider>
  );
};

export default App;
