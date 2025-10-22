import {useEffect, useMemo, useState} from 'react';
import {Alert, Paper, Stack, Typography} from '@mui/material';
import {apiGet} from '../../api/client';
import type {ExposureType} from '../../mocks/types';
import ExposureAutocomplete from './ExposureAutocomplete';
import ExposureDetailsDialog from '../../components/ExposureDetailsDialog';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  disabled?: boolean;
};

export default function ExposureSelector({value, onChange, disabled}: Props) {
  const [options, setOptions] = useState<string[]>([]);
  const [nameToId, setNameToId] = useState<Record<string, number>>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [previewId, setPreviewId] = useState<number | null>(null);

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    setError(null);

    apiGet<ExposureType[]>('/api/exposure-types')
      .then((data) => {
        if (!mounted) return;
        setOptions(data.map((e) => e.name));
        setNameToId(Object.fromEntries(data.map((e) => [e.name, e.id])));
      })
      .catch((e) => {
        if (!mounted) return;
        setError(
          e instanceof Error ? e.message : 'Nie udało się pobrać ekspozycji',
        );
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, []);

  const available = useMemo(
    () => [...options].sort((a, b) => a.localeCompare(b, 'pl')),
    [options],
  );

  return (
    <Paper
      variant="outlined"
      sx={{p: 3, borderRadius: 2, width: '100%', mx: 'auto'}}
    >
      <Stack spacing={2}>
        <Typography variant="subtitle1" color="text.primary">
          Dodaj ekspozycję
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <ExposureAutocomplete
          value={value}
          onChange={onChange}
          options={available}
          loading={loading}
          disabled={disabled}
          onChipClick={(name) => {
            const id = nameToId[name];
            if (id) setPreviewId(id);
          }}
        />
      </Stack>
      <ExposureDetailsDialog
        open={previewId != null}
        id={previewId}
        onClose={() => setPreviewId(null)}
      />
    </Paper>
  );
}
