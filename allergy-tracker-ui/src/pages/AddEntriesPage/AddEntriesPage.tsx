import {Container, Stack, Typography, Snackbar, Alert} from '@mui/material';
import {useState, useEffect} from 'react';
import {useNavigate, useLocation} from 'react-router-dom';
import {useQuery} from '@tanstack/react-query';
import dayjs, {Dayjs} from 'dayjs';

import EntryDatePicker from '../../components/EntryDatePicker.tsx';
import SymptomsSection from './SymptomsSection';
import ExposureSelector from './ExposureSelector';
import NoteTextField from '../../components/NoteTextField';
import ActionBar from '../../components/ActionBar';

import {PATHS} from '../../router/paths';

import {useToast} from '../../hooks/useToast';
import {useSaveEntry} from '../../hooks/useSaveEntry';
import {useUpdateEntry} from '../../hooks/useUpdateEntry';
import {apiGet} from '../../api/client';
import {buildNewEntry, isEntryFormEmpty} from '../../utils/entries';
import type {Entry} from '../../mocks/types';

type LocationState = {entryId?: string} | null;

export default function AddEntriesPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const entryId = (location.state as LocationState)?.entryId;
  const isEdit = Boolean(entryId);

  const toast = useToast();
  const {save, submitting: creating} = useSaveEntry();
  const {update, submitting: updating} = useUpdateEntry();

  const [date, setDate] = useState<Dayjs | null>(dayjs());
  const [exposures, setExposures] = useState<string[]>([]);
  const [note, setNote] = useState('');

  const [upperResp, setUpperResp] = useState(0);
  const [lowerResp, setLowerResp] = useState(0);
  const [skin, setSkin] = useState(0);
  const [eyes, setEyes] = useState(0);

  const {
    data: existing,
    isLoading: loadingExisting,
    isError: loadError,
  } = useQuery({
    queryKey: ['entry', entryId ?? 'new'],
    queryFn: () => apiGet<Entry>(`/api/entries/${entryId}`),
    enabled: !!entryId,
  });

  useEffect(() => {
    if (!existing) return;
    setDate(dayjs(existing.occurredOn));
    setExposures(existing.exposures ?? []);
    setNote(existing.note ?? '');
    setUpperResp(existing.upperRespiratory ?? 0);
    setLowerResp(existing.lowerRespiratory ?? 0);
    setSkin(existing.skin ?? 0);
    setEyes(existing.eyes ?? 0);
  }, [existing]);

  useEffect(() => {
    if (isEdit && loadError) {
      toast.show('Nie znaleziono wpisu do edycji.', 'error');
      const t = setTimeout(() => void navigate(PATHS.journal), 1200);
      return () => clearTimeout(t);
    }
  }, [isEdit, loadError, navigate, toast]);

  const empty = isEntryFormEmpty({
    upperResp,
    lowerResp,
    skin,
    eyes,
    exposures,
    note,
  });

  const canSubmit = !!date && !empty && !loadingExisting;
  const submitting = creating || updating;

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
      if (isEdit && entryId) {
        await update({id: entryId, body});
        toast.show('Zmiany zapisane', 'success');
      } else {
        await save(body); // POST
        toast.show('Wpis zapisany', 'success');
      }
      setTimeout(() => void navigate(PATHS.journal), 800);
    } catch {
      toast.show('Nie udało się zapisać', 'error');
    }
  };

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          {isEdit ? 'Edytuj wpis' : 'Dodaj nowy wpis'}
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
          submitting={submitting || loadingExisting}
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
