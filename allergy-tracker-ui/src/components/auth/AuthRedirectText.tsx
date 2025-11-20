import {Typography, Link} from '@mui/material';
import {useNavigate} from 'react-router-dom';

interface AuthRedirectTextProps {
  question: string;
  action: string;
  to: string;
}

export default function AuthRedirectText({
  question,
  action,
  to,
}: AuthRedirectTextProps) {
  const navigate = useNavigate();

  return (
    <Typography
      variant="body2"
      align="center"
      color="text.secondary"
      sx={{mt: 1}}
    >
      {question}{' '}
      <Link
        component="button"
        variant="body2"
        underline="hover"
        onClick={() => void navigate(to)}
      >
        {action}
      </Link>
    </Typography>
  );
}
