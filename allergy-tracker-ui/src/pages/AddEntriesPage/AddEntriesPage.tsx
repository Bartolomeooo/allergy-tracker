import {Container, Stack, Typography} from '@mui/material';
import {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import EntryDatePicker from '../../components/EntryDatePicker';
import SymptomsSection from './SymptomsSection';

export default function AddEntriesPage() {
  const [date, setDate] = useState<Dayjs | null>(dayjs());

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          Dodaj nowy wpis
        </Typography>

        <EntryDatePicker value={date} onChange={setDate} sx={{mt: 1}} />

        <SymptomsSection />
      </Stack>
    </Container>
  );
}
