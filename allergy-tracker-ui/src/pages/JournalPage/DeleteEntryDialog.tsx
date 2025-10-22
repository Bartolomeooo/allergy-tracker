import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from '@mui/material';
import ActionButton from '../../components/ActionButton';

interface DeleteEntryDialogProps {
  open: boolean;
  loading?: boolean;
  onCancel: () => void | Promise<void>;
  onConfirm: () => void | Promise<void>;
}

export default function DeleteEntryDialog({
  open,
  loading,
  onCancel,
  onConfirm,
}: DeleteEntryDialogProps) {
  return (
    <Dialog
      open={open}
      onClose={
        !loading
          ? () => {
              void onCancel();
            }
          : undefined
      }
      aria-labelledby="confirm-delete-title"
    >
      <DialogTitle id="confirm-delete-title">Usunąć wpis?</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Czy na pewno chcesz usunąć ten wpis? Tej operacji nie można cofnąć.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          width="100%"
          px={2}
          pb={1}
        >
          <ActionButton
            tone="neutral"
            onClick={() => {
              if (!loading) {
                void onCancel();
              }
            }}
            disabled={loading}
          >
            Anuluj
          </ActionButton>

          <ActionButton
            tone="danger"
            onClick={() => {
              if (!loading) {
                void onConfirm();
              }
            }}
            disabled={loading}
          >
            {loading ? 'Usuwanie…' : 'Usuń'}
          </ActionButton>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
