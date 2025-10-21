import {DatePicker, LocalizationProvider} from '@mui/x-date-pickers';
import {AdapterDayjs} from '@mui/x-date-pickers/AdapterDayjs';
import {plPL} from '@mui/x-date-pickers/locales';
import type {SxProps} from '@mui/material';
import type {Dayjs} from 'dayjs';
import 'dayjs/locale/pl';

type Props = {
  value: Dayjs | null;
  onChange: (val: Dayjs | null) => void;
  sx?: SxProps;
  disableFuture?: boolean;
};

export default function EntryDatePicker({
  value,
  onChange,
  sx,
  disableFuture = true,
}: Props) {
  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale="pl"
      localeText={
        plPL.components.MuiLocalizationProvider.defaultProps.localeText
      }
    >
      <DatePicker
        label={null}
        format="YYYY-MM-DD"
        value={value}
        onChange={onChange}
        disableFuture={disableFuture}
        slotProps={{
          textField: {
            fullWidth: false,
            size: 'small',
            sx: {
              minWidth: 220,
              '& .MuiIconButton-root': {
                color: 'text.primary',
              },
              ...sx,
            },
            inputProps: {'aria-label': 'Data wpisu'},
          } as any,
        }}
      />
    </LocalizationProvider>
  );
}
