import {TextField, type TextFieldProps} from '@mui/material';

export default function EmailTextField(props: TextFieldProps) {
  return (
    <TextField
      label="Adres e-mail"
      type="email"
      name="email"
      autoComplete="email"
      fullWidth
      required
      {...props}
    />
  );
}
