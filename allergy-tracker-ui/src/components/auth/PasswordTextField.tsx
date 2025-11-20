import {useState} from 'react';
import {
  TextField,
  InputAdornment,
  IconButton,
  type TextFieldProps,
} from '@mui/material';
import {Visibility, VisibilityOff} from '@mui/icons-material';

export default function PasswordTextField(props: TextFieldProps) {
  const [show, setShow] = useState(false);

  return (
    <TextField
      label="Hasło"
      type={show ? 'text' : 'password'}
      name="password"
      autoComplete="current-password"
      fullWidth
      required
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton
              onClick={() => setShow((s) => !s)}
              edge="end"
              aria-label={show ? 'Ukryj hasło' : 'Pokaż hasło'}
            >
              {show ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
      {...props}
    />
  );
}
