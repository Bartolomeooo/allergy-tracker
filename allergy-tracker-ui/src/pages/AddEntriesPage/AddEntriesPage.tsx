import {Container, Stack, Typography, Snackbar, Alert} from '@mui/material';
import {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import dayjs, {Dayjs} from 'dayjs';

import EntryDatePicker from './EntryDatePicker';
import SymptomsSection from './SymptomsSection';
import ExposureSelector from './ExposureSelector';
import NoteTextField from '../../components/NoteTextField.tsx';
import ActionBar from '../../components/ActionBar';

import {PATHS} from '../../router/paths';

import {useToast} from '../../hooks/useToast';
import {useSaveEntry} from '../../hooks/useSaveEntry';
import {buildNewEntry, isEntryFormEmpty} from '../../utils/entries';

export default function AddEntriesPage() {
  const navigate = useNavigate();

  const toast = useToast();
  const {save, submitting} = useSaveEntry();

  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [exposures, setExposures] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const [upperResp, setUpperResp] = useState(0);
  const [lowerResp, setLowerResp] = useState(0);
  const [skin, setSkin] = useState(0);
  const [eyes, setEyes] = useState(0);

  const empty = isEntryFormEmpty({
    upperResp,
    lowerResp,
    skin,
    eyes,
    exposures,
    note,
  });
  const canSubmit = !!date && !empty;

  const handleCancel = () => {
    void navigate(PATHS.journal);
  };

  const handleSubmit = async () => {
    if (!canSubmit || !date) {
      toast.show('Uzupełnij dane przed zapisaniem.', 'error');
      return;
    }

    const body = buildNewEntry({
      date,
      upperResp,
      lowerResp,
      skin,
      eyes,
      exposures,
      note,
    });

    try {
      await save(body);
      toast.show('Wpis zapisany', 'success');
      setTimeout(() => void navigate(PATHS.journal), 800);
    } catch {
      toast.show('Nie udało się zapisać wpisu', 'error');
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
          onSubmit={() => {
            void handleSubmit();
          }}
          submitting={submitting}
        />
      </Stack>

      <Snackbar open={toast.open} autoHideDuration={2500} onClose={toast.hide}>
        <Alert severity={toast.sev} variant="filled">
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
