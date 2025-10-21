import {useState} from 'react';
import {apiPost} from '../api/client';
import type {ExposureType} from '../mocks/types';

export function useSaveExposureType() {
  const [submitting, setSubmitting] = useState(false);

  const save = async (
    body: Omit<ExposureType, 'id'>,
  ): Promise<ExposureType> => {
    try {
      setSubmitting(true);
      const result = await apiPost<ExposureType>('/api/exposure-types', body);
      return result;
    } finally {
      setSubmitting(false);
    }
  };

  return {save, submitting};
}
