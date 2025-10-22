import {useMutation, useQueryClient} from '@tanstack/react-query';
import {apiDelete} from '../api/client';
import type {Entry} from '../mocks/types';

export function useDeleteEntry() {
  const qc = useQueryClient();

  const mutation = useMutation({
    mutationFn: (id: number) => apiDelete(`/api/entries/${id}`),

    onMutate: async (id: number) => {
      await qc.cancelQueries({queryKey: ['entries']});
      const prev = qc.getQueryData<Entry[]>(['entries']) ?? [];
      qc.setQueryData<Entry[]>(['entries'], (old) =>
        (old ?? []).filter((e) => e.id !== id),
      );
      return {prev};
    },
    onError: (_err, _id, ctx) => {
      if (ctx?.prev) qc.setQueryData(['entries'], ctx.prev);
    },
    onSettled: async () => {
      await qc.invalidateQueries({queryKey: ['entries']});
    },
  });

  return {
    deleteEntry: mutation.mutateAsync,
    deletingId: null as number | null,
    pending: mutation.isPending,
    error:
      mutation.isError && mutation.error instanceof Error
        ? mutation.error.message
        : null,
  };
}
