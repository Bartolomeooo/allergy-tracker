import {Container, Stack, Typography} from '@mui/material';
import * as React from 'react';
import dayjs, {Dayjs} from 'dayjs';
import EntryDatePicker from '../components/EntryDatePicker';

export default function AddEntriesPage() {
  const [date, setDate] = React.useState<Dayjs | null>(dayjs());

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          Dodaj nowy wpis
        </Typography>

        <EntryDatePicker value={date} onChange={setDate} sx={{mt: 1}} />
      </Stack>
    </Container>
  );
}
