import { ApolloClient, InMemoryCache, HttpLink, ApolloLink } from '@apollo/client';
import { persistCache, LocalStorageWrapper } from 'apollo3-cache-persist';

import { DefaultAppSettings } from '@/config/settings';

const httpLink = new HttpLink({
  uri: DefaultAppSettings.shyftApi,
});

const authLink = new ApolloLink((operation, forward) => {
  operation.setContext({
    headers: {},
  });

  return forward(operation);
});

async function createGQLClient() {
  const cache = new InMemoryCache();

  await persistCache({
    cache,
    storage: new LocalStorageWrapper(window.localStorage),
  });

  const client = new ApolloClient({
    link: authLink.concat(httpLink),
    cache,
  });

  return client;
}

export { createGQLClient };
