import {useState} from 'react';
import {apiPost} from '../api/client';
import type {Entry, NewEntry} from '../mocks/types';

export function useSaveEntry() {
  const [submitting, setSubmitting] = useState(false);

  const save = async (body: NewEntry): Promise<Entry> => {
    try {
      setSubmitting(true);
      return await apiPost<Entry>('/api/entries', body);
    } finally {
      setSubmitting(false);
    }
  };

  return {save, submitting};
}
