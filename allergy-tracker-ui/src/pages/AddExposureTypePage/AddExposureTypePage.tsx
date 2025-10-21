import {useState} from 'react';
import {
  Alert,
  Container,
  Snackbar,
  Stack,
  TextField,
  Typography,
} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import ActionBar from '../../components/ActionBar';
import NoteTextField from '../../components/NoteTextField';
import {useToast} from '../../hooks/useToast';
import {useSaveExposureType} from '../../hooks/useSaveExposureType';
import {PATHS} from '../../router/paths';

export default function AddExposureTypePage() {
  const navigate = useNavigate();
  const toast = useToast();
  const {save, submitting} = useSaveExposureType();

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const handleCancel = () => {
    void navigate(PATHS.journal);
  };

  const handleSubmit = async () => {
    const trimmedName = name.trim();
    const trimmedDesc = description.trim();

    if (!trimmedName) {
      toast.show('Podaj nazwę ekspozycji.', 'error');
      return;
    }

    try {
      await save({name: trimmedName, description: trimmedDesc || undefined});
      toast.show('Ekspozycja została dodana.', 'success');
      setTimeout(() => void navigate(PATHS.journal), 800);
    } catch (e) {
      toast.show(
        e instanceof Error ? e.message : 'Nie udało się zapisać ekspozycji.',
        'error',
      );
    }
  };

  return (
    <Container maxWidth="md" sx={{py: 4}}>
      <Stack spacing={3} alignItems="center">
        <Typography variant="h4" component="h1" align="center">
          Dodaj nową ekspozycję
        </Typography>

        <Stack spacing={4} sx={{alignItems: 'center', width: '70%'}}>
          <TextField
            placeholder="Nazwa ekspozycji"
            fullWidth
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={{
              '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
                borderColor: 'divider',
              },
            }}
          />

          <NoteTextField
            value={description}
            onChange={setDescription}
            placeholder="Dodaj opis ekspozycji..."
          />
        </Stack>

        <ActionBar
          onCancel={handleCancel}
          onSubmit={() => void handleSubmit()}
          submitting={submitting}
        />
      </Stack>

      <Snackbar open={toast.open} autoHideDuration={2500} onClose={toast.hide}>
        <Alert severity={toast.sev} variant="filled" onClose={toast.hide}>
          {toast.msg}
        </Alert>
      </Snackbar>
    </Container>
  );
}
