import {useMutation, useQueryClient} from '@tanstack/react-query';
import {apiPut} from '../api/client';
import type {Entry, NewEntry} from '../mocks/types';

type Vars = {id: string; body: NewEntry};
type Ctx = {prev: Entry[]};

export function useUpdateEntry() {
  const qc = useQueryClient();

  const mutation = useMutation<Entry, unknown, Vars, Ctx>({
    mutationFn: ({id, body}) => apiPut<Entry>(`/api/entries/${id}`, body),

    onMutate: async ({id, body}) => {
      await qc.cancelQueries({queryKey: ['entries']});
      const prev = qc.getQueryData<Entry[]>(['entries']) ?? [];

      qc.setQueryData<Entry[]>(['entries'], (old) => {
        const arr = old ?? [];
        const idx = arr.findIndex((e) => e.id === id);
        if (idx === -1) return arr;
        const copy = arr.slice();
        copy[idx] = {id, ...body};
        return copy;
      });

      return {prev};
    },

    onError: (_err, _vars, ctx) => {
      if (ctx?.prev) qc.setQueryData<Entry[]>(['entries'], ctx.prev);
    },

    onSuccess: (updated) => {
      qc.setQueryData<Entry[]>(['entries'], (old) => {
        const arr = old ?? [];
        const idx = arr.findIndex((e) => e.id === updated.id);
        if (idx === -1) return [updated, ...arr];
        const copy = arr.slice();
        copy[idx] = updated;
        return copy;
      });
      qc.setQueryData<Entry>(['entry', updated.id], updated);
    },

    onSettled: async (_data, _err, vars) => {
      await qc.invalidateQueries({queryKey: ['entries']});
      if (vars?.id) await qc.invalidateQueries({queryKey: ['entry', vars.id]});
    },
  });

  return {
    update: mutation.mutateAsync,
    submitting: mutation.isPending,
  };
}
