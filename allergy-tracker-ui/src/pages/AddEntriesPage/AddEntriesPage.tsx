import {Container, Stack, Typography} from '@mui/material';
import {useState} from 'react';
import dayjs, {Dayjs} from 'dayjs';
import EntryDatePicker from './EntryDatePicker.tsx';
import SymptomsSection from './SymptomsSection';
import ExposureSelector from './ExposureSelector.tsx';

export default function AddEntriesPage() {
  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [exposures, setExposures] = useState<string[]>([]);

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          Dodaj nowy wpis
        </Typography>

        <EntryDatePicker value={date} onChange={setDate} sx={{mt: 1}} />

        <SymptomsSection />

        <ExposureSelector value={exposures} onChange={setExposures} />
      </Stack>
    </Container>
  );
}
