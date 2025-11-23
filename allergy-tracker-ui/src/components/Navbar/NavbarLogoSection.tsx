import {Link} from 'react-router-dom';
import {PATHS} from '../../router/paths.ts';
import {Box, Stack, Typography} from '@mui/material';

export default function NavbarLogoSection() {
  return (
    <Stack
      spacing={1}
      direction="row"
      alignItems="center"
      component={Link}
      to={PATHS.journal}
      sx={{
        color: 'text.primary',
        textDecoration: 'none',
        '&:visited': {color: 'text.primary'},
      }}
    >
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          color: 'primary.main',
        }}
      >
          <img
              src="/allergy.png"
              alt="Allergy Tracker Logo"
              style={{width: '32px', height: '32px'}}
          />
      </Box>
      <Typography variant="h3" fontWeight={700}>
        Allergy Tracker
      </Typography>
    </Stack>
  );
}
