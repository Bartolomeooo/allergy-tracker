import {Stack} from '@mui/material';
import ActionButton from './ActionButton';

type Props = {
  onCancel: () => void;
  onSubmit: () => void;
  submitting?: boolean;
};

export default function ActionBar({onCancel, onSubmit, submitting}: Props) {
  return (
    <Stack
      direction="row"
      alignItems="center"
      justifyContent="space-between"
      sx={{width: '70%', mx: 'auto', p: 2}}
    >
      <ActionButton tone="neutral" onClick={onCancel}>
        Anuluj
      </ActionButton>

      <ActionButton tone="primary" onClick={onSubmit}>
        {submitting ? 'Zapisywanie…' : 'Zapisz'}
      </ActionButton>
    </Stack>
  );
}
