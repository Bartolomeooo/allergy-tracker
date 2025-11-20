import {useState} from 'react';
import {Box, Stack, Typography} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AuthBox from '../../components/auth/AuthBox';
import AuthPaper from '../../components/auth/AuthPaper';
import EmailTextField from '../../components/auth/EmailTextField';
import PasswordTextField from '../../components/auth/PasswordTextField';
import SubmitButton from '../../components/auth/SubmitButton';
import AuthRedirectText from '../../components/auth/AuthRedirectText';
import {PATHS} from '../../router/paths';
import {useRegister} from '../../hooks/useAuth';
import {useToast} from '../../hooks/useToast';
import AuthSnackbar from '../../components/auth/AuthSnackbar';

export default function RegisterPage() {
  const register = useRegister();
  const toast = useToast('error');

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [localError, setLocalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (password.length < 5) {
      const msg = 'Hasło musi mieć co najmniej 5 znaków.';
      setLocalError(msg);
      toast.show(msg, 'error');
      return;
    }

    if (password !== confirmPassword) {
      const msg = 'Hasła muszą być identyczne.';
      setLocalError(msg);
      toast.show(msg, 'error');
      return;
    }

    setLocalError(null);
    register.mutate({email, password});
  };

  if (register.errorMessage && !toast.open && !localError) {
    toast.show(register.errorMessage, 'error');
  }

  return (
    <>
      <AuthBox>
        <AuthPaper>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              Rejestracja
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Utwórz konto, aby śledzić objawy alergii.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{width: '100%', mt: 1}}
            >
              <Stack spacing={2}>
                <EmailTextField
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />

                <PasswordTextField
                  name="password"
                  label="Hasło"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />

                <PasswordTextField
                  name="confirmPassword"
                  label="Potwierdź hasło"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  error={!!localError}
                  helperText={localError ?? ''}
                />

                {!localError && register.errorMessage && (
                  <Stack
                    direction="row"
                    spacing={1}
                    alignItems="center"
                    justifyContent="center"
                    sx={{mt: 1}}
                  >
                    <InfoOutlinedIcon
                      sx={{fontSize: 20, color: 'text.secondary'}}
                    />
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      textAlign="center"
                    >
                      {register.errorMessage}
                    </Typography>
                  </Stack>
                )}

                <SubmitButton disabled={register.isPending}>
                  Zarejestruj się
                </SubmitButton>
              </Stack>
            </Box>

            <AuthRedirectText
              question="Masz już konto?"
              action="Zaloguj się"
              to={PATHS.login}
            />
          </Stack>
        </AuthPaper>
      </AuthBox>

      <AuthSnackbar
        open={toast.open}
        message={toast.msg}
        severity={toast.sev}
        onClose={toast.hide}
      />
    </>
  );
}
