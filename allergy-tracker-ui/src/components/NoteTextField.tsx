import {TextField} from '@mui/material';

type Props = {
  value: string;
  onChange: (next: string) => void;
  disabled?: boolean;
  placeholder?: string;
};

export default function NoteTextField({
  value,
  onChange,
  disabled = false,
  placeholder = '',
}: Props) {
  return (
    <TextField
      fullWidth
      multiline
      minRows={4}
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      disabled={disabled}
      variant="outlined"
      sx={{
        '& .MuiOutlinedInput-root .MuiOutlinedInput-notchedOutline': {
          borderColor: 'divider',
        },
      }}
    />
  );
}
