import {QueryClient, QueryClientProvider} from '@tanstack/react-query';
import {MemoryRouter} from 'react-router-dom';
import type {PropsWithChildren} from 'react';

export function createTestQueryClient() {
  return new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
}

export function createWrapper(client?: QueryClient) {
  const queryClient = client ?? createTestQueryClient();

  const Wrapper = ({children}: PropsWithChildren) => (
      <QueryClientProvider client={queryClient}>
        <MemoryRouter>{children}</MemoryRouter>
      </QueryClientProvider>
  );

  return {Wrapper, queryClient};
}
