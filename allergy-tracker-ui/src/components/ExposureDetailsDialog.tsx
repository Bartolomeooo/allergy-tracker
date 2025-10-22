import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  CircularProgress,
} from '@mui/material';
import {useEffect, useState} from 'react';
import {apiGet} from '../api/client';
import type {ExposureType} from '../mocks/types';

type Props = {
  open: boolean;
  id: number | null;
  onClose: () => void;
};

export default function ExposureDetailsDialog({open, id, onClose}: Props) {
  const [data, setData] = useState<ExposureType | null>(null);
  const [loading, setLoading] = useState(false);
  const [err, setErr] = useState<string | null>(null);

  useEffect(() => {
    if (!open || id == null) return;
    setLoading(true);
    setErr(null);
    apiGet<ExposureType>(`/api/exposure-types/${id}`)
      .then(setData)
      .catch((e) =>
        setErr(e instanceof Error ? e.message : 'Błąd pobierania danych'),
      )
      .finally(() => setLoading(false));
  }, [open, id]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Szczegóły ekspozycji</DialogTitle>
      <DialogContent dividers>
        {loading && (
          <Box sx={{display: 'flex', justifyContent: 'center', py: 4}}>
            <CircularProgress />
          </Box>
        )}

        {!loading && err && <Typography color="error">{err}</Typography>}

        {!loading && !err && data && (
          <>
            <Typography variant="h6" gutterBottom>
              {data.name}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {data.description || 'Brak opisu dla tej ekspozycji.'}
            </Typography>
          </>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Zamknij</Button>
      </DialogActions>
    </Dialog>
  );
}
