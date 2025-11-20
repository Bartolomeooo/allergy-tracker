import {Box, Stack, Typography} from '@mui/material';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import AuthBox from '../../components/auth/AuthBox';
import AuthPaper from '../../components/auth/AuthPaper';
import EmailTextField from '../../components/auth/EmailTextField';
import PasswordTextField from '../../components/auth/PasswordTextField';
import SubmitButton from '../../components/auth/SubmitButton';
import AuthRedirectText from '../../components/auth/AuthRedirectText';
import {PATHS} from '../../router/paths';
import {useLogin} from '../../hooks/useAuth';
import {useToast} from '../../hooks/useToast';
import AuthSnackbar from '../../components/auth/AuthSnackbar';

export default function LoginPage() {
  const login = useLogin();
  const toast = useToast('error');

  function getFormStr(fd: FormData, name: string): string {
    const v = fd.get(name);
    return typeof v === 'string' ? v : '';
  }

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    const email = getFormStr(fd, 'email');
    const password = getFormStr(fd, 'password');
    login.mutate({email, password});
  };

  if (login.errorMessage && !toast.open) {
    toast.show(login.errorMessage, 'error');
  }

  return (
    <>
      <AuthBox>
        <AuthPaper>
          <Stack spacing={3} alignItems="center">
            <Typography variant="h5" fontWeight={600}>
              Logowanie
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              textAlign="center"
            >
              Zaloguj się, aby zobaczyć swój dziennik objawów i ekspozycji.
            </Typography>

            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{width: '100%', mt: 1}}
            >
              <Stack spacing={2}>
                <EmailTextField />
                <PasswordTextField />

                {login.errorMessage && (
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
                      {login.errorMessage}
                    </Typography>
                  </Stack>
                )}

                <SubmitButton disabled={login.isPending}>
                  Zaloguj się
                </SubmitButton>
              </Stack>
            </Box>

            <AuthRedirectText
              question="Nie masz konta?"
              action="Zarejestruj się"
              to={PATHS.register}
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
