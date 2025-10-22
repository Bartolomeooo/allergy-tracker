import {useState, useCallback} from 'react';
import EntriesList from './EntriesList/EntriesList';
import {useDeleteEntry} from '../../hooks/useDeleteEntry';
import {useToast} from '../../hooks/useToast';
import {Alert, Snackbar} from '@mui/material';
import DeleteEntryDialog from './DeleteEntryDialog';
import {useNavigate} from 'react-router-dom';
import {PATHS} from '../../router/paths';

export default function JournalPage() {
  const navigate = useNavigate();
  const {deleteEntry, pending} = useDeleteEntry();
  const {open, msg, sev, show, hide} = useToast();
  const [pendingDeleteId, setPendingDeleteId] = useState<number | null>(null);

  const editEntry = (id: number) => {
    void navigate(PATHS.addEntry, {state: {entryId: id}});
  };

  const askDelete = useCallback((id: number) => {
    setPendingDeleteId(id);
  }, []);

  const closeDialog = useCallback(() => {
    if (pending) return;
    setPendingDeleteId(null);
  }, [pending]);

  const confirmDelete = useCallback(async () => {
    if (pendingDeleteId == null) return;

    try {
      await deleteEntry(pendingDeleteId);
      setPendingDeleteId(null);
      show('Wpis został usunięty', 'success');
    } catch {
      show('Nie udało się usunąć wpisu', 'error');
    }
  }, [pendingDeleteId, deleteEntry, show]);

  return (
    <>
      <EntriesList onEdit={editEntry} onDelete={askDelete} />

      <DeleteEntryDialog
        open={pendingDeleteId != null}
        loading={pending}
        onCancel={closeDialog}
        onConfirm={confirmDelete}
      />

      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={hide}
        anchorOrigin={{vertical: 'bottom', horizontal: 'center'}}
      >
        <Alert
          onClose={hide}
          severity={sev}
          variant="filled"
          sx={{width: '100%'}}
        >
          {msg}
        </Alert>
      </Snackbar>
    </>
  );
}
