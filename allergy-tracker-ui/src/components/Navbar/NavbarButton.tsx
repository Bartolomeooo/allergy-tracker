import {Button} from '@mui/material';
import {NavLink} from 'react-router-dom';
import type {ReactNode} from 'react';

interface NavbarButtonProps {
  to: string;
  icon?: ReactNode;
  children: ReactNode;
}

export default function NavbarButton({to, icon, children}: NavbarButtonProps) {
  return (
    <Button
      component={NavLink}
      to={to}
      startIcon={icon}
      sx={{
        color: 'primary.main',
        textTransform: 'none',
        '& .MuiSvgIcon-root': {fontSize: 28},
      }}
    >
      {children}
    </Button>
  );
}
