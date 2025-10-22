import {IconButton, Stack, Tooltip} from '@mui/material';
import ClearIcon from '@mui/icons-material/Clear';
import type {Dayjs} from 'dayjs';
import EntryDatePicker from '../../../components/EntryDatePicker';

type Props = {
  from: Dayjs | null;
  to: Dayjs | null;
  onFrom: (d: Dayjs | null) => void;
  onTo: (d: Dayjs | null) => void;
  onClear: () => void;
};

export default function FiltersBar({from, to, onFrom, onTo, onClear}: Props) {
  return (
    <Stack
      direction="row"
      gap={4}
      alignItems="center"
      justifyContent="center"
      sx={{mt: 1}}
    >
      <EntryDatePicker value={from} onChange={onFrom} />
      <EntryDatePicker value={to} onChange={onTo} />
      <Tooltip title="Wyczyść filtr">
        <span>
          <IconButton onClick={onClear}>
            <ClearIcon />
          </IconButton>
        </span>
      </Tooltip>
    </Stack>
  );
}
