import {Paper} from '@mui/material';
import type {PropsWithChildren} from 'react';

export default function AuthPaper({children}: PropsWithChildren) {
  return (
    <Paper
      elevation={4}
      sx={(t) => ({
        width: '100%',
        maxWidth: 420,
        p: 4,
        borderRadius: 3,
        bgcolor: t.palette.background.paper,
        color: t.palette.text.primary,
      })}
    >
      {children}
    </Paper>
  );
}
