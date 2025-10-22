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
  onChipClick?: (name: string) => void;
};

export default function ExposureAutocomplete({
  value,
  onChange,
  options,
  loading = false,
  disabled = false,
  placeholder = 'Wybierz z listy…',
  onChipClick,
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
        selected.map((option, index) => {
          const tagProps = getTagProps({index});
          return (
            <Chip
              {...tagProps}
              key={option}
              label={option}
              size="small"
              variant="outlined"
              clickable
              onMouseDown={(e) => e.preventDefault()}
              onClick={(e) => {
                e.stopPropagation();
                onChipClick?.(option);
              }}
            />
          );
        })
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
