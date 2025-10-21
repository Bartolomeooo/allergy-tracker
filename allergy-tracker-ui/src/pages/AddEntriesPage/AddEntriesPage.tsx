import {Container, Stack, Typography, Snackbar, Alert} from '@mui/material';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs, {Dayjs} from 'dayjs';
import EntryDatePicker from './EntryDatePicker';
import SymptomsSection from './SymptomsSection';
import ExposureSelector from './ExposureSelector';
import NoteTextField from './NoteTextField';
import ActionBar from '../../components/ActionBar';
import {apiPost} from '../../api/client';
import type {Entry, NewEntry} from '../../mocks/types';
import {PATHS} from '../../router/paths';

export default function AddEntriesPage() {
  const navigate = useNavigate();

  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [exposures, setExposures] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const [upperResp, setUpperResp] = useState(0);
  const [lowerResp, setLowerResp] = useState(0);
  const [skin, setSkin] = useState(0);
  const [eyes, setEyes] = useState(0);

  const [submitting, setSubmitting] = useState(false);
  const [toastOpen, setToastOpen] = useState(false);
  const [toastMsg, setToastMsg] = useState('');
  const [toastSev, setToastSev] = useState<'success' | 'error'>('success');

  const handleCancel = () => {
    navigate(PATHS.journal);
  };

  const isFormEmpty =
    upperResp === 0 &&
    lowerResp === 0 &&
    skin === 0 &&
    eyes === 0 &&
    exposures.length === 0 &&
    !note.trim();

  const handleSubmit = async () => {
    if (!date || isFormEmpty) {
      setToastSev('error');
      setToastMsg('Uzupełnij dane przed zapisaniem.');
      setToastOpen(true);
      return;
    }

    const body: NewEntry = {
      occurredOn: date.format('YYYY-MM-DD'),
      upperRespiratory: upperResp,
      lowerRespiratory: lowerResp,
      skin,
      eyes,
      total: upperResp + lowerResp + skin + eyes,
      exposures,
      note: note || undefined,
    };

    try {
      setSubmitting(true);
      await apiPost<Entry>('/api/entries', body);
      setToastSev('success');
      setToastMsg('Wpis zapisany');
      setToastOpen(true);
      setTimeout(() => navigate(PATHS.journal), 800);
    } catch (e) {
      setToastSev('error');
      setToastMsg('Nie udało się zapisać wpisu');
      setToastOpen(true);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          Dodaj nowy wpis
        </Typography>

        <EntryDatePicker value={date} onChange={setDate} sx={{mt: 1}} />

        <SymptomsSection
          upperResp={upperResp}
          onUpperRespChange={setUpperResp}
          lowerResp={lowerResp}
          onLowerRespChange={setLowerResp}
          skin={skin}
          onSkinChange={setSkin}
          eyes={eyes}
          onEyesChange={setEyes}
        />

        <Stack spacing={4} sx={{alignItems: 'center', width: '70%'}}>
          <ExposureSelector value={exposures} onChange={setExposures} />

          <NoteTextField
            value={note}
            onChange={setNote}
            placeholder="Dodaj notatkę..."
          />
        </Stack>

        <ActionBar
          onCancel={handleCancel}
          onSubmit={handleSubmit}
          submitting={submitting}
        />
      </Stack>

      <Snackbar
        open={toastOpen}
        autoHideDuration={2500}
        onClose={() => setToastOpen(false)}
      >
        <Alert severity={toastSev} variant="filled">
          {toastMsg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
