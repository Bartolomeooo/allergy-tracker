import {Box} from '@mui/material';
import type {PropsWithChildren} from 'react';

export default function AuthBox({children}: PropsWithChildren) {
  return (
    <Box
      sx={(t) => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        background: `radial-gradient(circle at top, ${t.palette.primary.light} 0%, ${t.palette.background.default} 55%, ${t.palette.background.paper} 100%)`,
        px: 2,
      })}
    >
      {children}
    </Box>
  );
}
