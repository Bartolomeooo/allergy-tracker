import {Divider, Stack, Typography} from '@mui/material';

export default function EmptyState() {
  return (
    <Stack alignItems="center" gap={1} py={3}>
      <Typography variant="subtitle1">Brak wpisów</Typography>
      <Typography variant="body2" color="text.secondary">
        Użyj filtrów daty lub dodaj nowy wpis.
      </Typography>
      <Divider flexItem />
    </Stack>
  );
}
