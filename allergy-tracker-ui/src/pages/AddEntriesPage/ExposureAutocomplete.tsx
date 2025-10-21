import {
  Autocomplete,
  Box,
  Chip,
  CircularProgress,
  TextField,
} from '@mui/material';

type Props = {
  value: string[];
  onChange: (next: string[]) => void;
  options: string[];
  loading?: boolean;
  disabled?: boolean;
  placeholder?: string;
};

export default function ExposureAutocomplete({
  value,
  onChange,
  options,
  loading = false,
  disabled = false,
  placeholder = 'Wybierz z listy…',
}: Props) {
  return (
    <Autocomplete
      multiple
      options={options}
      value={value}
      onChange={(_, next) => onChange(next)}
      disableCloseOnSelect
      filterSelectedOptions
      disabled={disabled}
      openOnFocus
      renderTags={(selected, getTagProps) =>
        selected.map((option, index) => (
          <Chip
            {...getTagProps({index})}
            key={option}
            label={option}
            size="small"
            variant="outlined"
          />
        ))
      }
      renderInput={(params) => (
        <TextField
          {...params}
          placeholder={placeholder}
          InputProps={{
            ...params.InputProps,
            endAdornment: (
              <Box sx={{display: 'flex', alignItems: 'center'}}>
                {loading ? <CircularProgress size={18} /> : null}
                {params.InputProps.endAdornment}
              </Box>
            ),
          }}
        />
      )}
    />
  );
}
