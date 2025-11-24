import {Box} from '@mui/material';
import type {PropsWithChildren} from 'react';

export default function AuthBox({children}: PropsWithChildren) {
  return (
    <Box
        sx={() => ({
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100dvh',
        px: 2,
      })}
    >
      {children}
    </Box>
  );
}
