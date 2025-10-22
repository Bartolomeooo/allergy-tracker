import {useQuery} from '@tanstack/react-query';
import type {Entry} from '../mocks/types';
import {apiGet} from '../api/client';

export function useEntries(options?: {
  refetchInterval?: number;
  staleTime?: number;
}) {
  const {refetchInterval, staleTime = 30_000} = options ?? {};

  const query = useQuery<Entry[], Error>({
    queryKey: ['entries'],
    queryFn: () => apiGet<Entry[]>('/api/entries'),
    staleTime,
    refetchOnWindowFocus: false,
    refetchInterval,
  });

  return {
    data: query.data ?? [],
    loading: query.isLoading,
    error: query.error ? query.error.message : null,
    refetch: query.refetch,
  };
}
