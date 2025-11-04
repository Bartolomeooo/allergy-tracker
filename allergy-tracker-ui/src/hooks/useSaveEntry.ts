import {useMutation, useQueryClient} from '@tanstack/react-query';
import {apiPost} from '../api/client';
import type {Entry, NewEntry} from '../mocks/types';

type Ctx = {prev: Entry[]; tempId: string};

const genId = () =>
  globalThis.crypto?.randomUUID?.() ??
  `tmp-${Date.now()}-${Math.random().toString(36).slice(2)}`;

export function useSaveEntry() {
  const qc = useQueryClient();

  const mutation = useMutation<Entry, unknown, NewEntry, Ctx>({
    mutationFn: (body) => apiPost<Entry>('/api/entries', body),

    onMutate: async (body) => {
      await qc.cancelQueries({queryKey: ['entries']});
      const prev = qc.getQueryData<Entry[]>(['entries']) ?? [];

      const tempId = genId();
      const temp: Entry = {
        id: tempId,
        ...body,
      };

      qc.setQueryData<Entry[]>(['entries'], (old) => [temp, ...(old ?? [])]);

      return {prev, tempId: temp.id};
    },

    onSuccess: (created, _body, ctx) => {
      qc.setQueryData<Entry[]>(['entries'], (old) => {
        const arr = old ?? [];
        const idx = arr.findIndex((e) => e.id === ctx?.tempId);
        if (idx === -1) return [created, ...arr];
        const copy = arr.slice();
        copy[idx] = created;
        return copy;
      });
    },

    onError: (_err, _body, ctx) => {
      if (ctx?.prev) {
        qc.setQueryData<Entry[]>(['entries'], ctx.prev);
      }
    },

    onSettled: async () => {
      await qc.invalidateQueries({queryKey: ['entries']});
    },
  });

  return {
    save: mutation.mutateAsync,
    submitting: mutation.isPending,
  };
}
