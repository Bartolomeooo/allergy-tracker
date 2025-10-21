import {Container, Stack, Typography} from '@mui/material';
import {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import EntryDatePicker from './EntryDatePicker';
import SymptomsSection from './SymptomsSection';
import ExposureSelector from './ExposureSelector';
import NoteTextField from './NoteTextField';

export default function AddEntriesPage() {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [exposures, setExposures] = useState<string[]>([]);
  const [note, setNote] = useState('');

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          Dodaj nowy wpis
        </Typography>

        <EntryDatePicker value={date} onChange={setDate} sx={{mt: 1}} />

        <SymptomsSection />
        <Stack spacing={4} sx={{alignItems: 'center', width: '70%'}}>
          <ExposureSelector value={exposures} onChange={setExposures} />

          <NoteTextField
            value={note}
            onChange={setNote}
            placeholder="Dodaj notatkę..."
          />
        </Stack>
      </Stack>
    </Container>
  );
}
