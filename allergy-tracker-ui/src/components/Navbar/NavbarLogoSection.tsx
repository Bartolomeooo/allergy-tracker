import {Link} from 'react-router-dom';
import {PATHS} from '../../router/paths.ts';
import {Box, Stack, Typography} from '@mui/material';
import HealingOutlinedIcon from '@mui/icons-material/HealingOutlined';

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
        <HealingOutlinedIcon />
      </Box>
      <Typography variant="h3" fontWeight={700}>
        Allergy Tracker
      </Typography>
    </Stack>
  );
}
