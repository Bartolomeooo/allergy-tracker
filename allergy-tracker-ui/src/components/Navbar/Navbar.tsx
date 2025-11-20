import {AppBar, Toolbar, Stack, Button} from '@mui/material';
import {PATHS} from '../../router/paths';

import NavbarButton from './NavbarButton';
import NavbarLogoSection from './NavbarLogoSection';

import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import {useLogout} from '../../hooks/useAuth';

export default function Navbar() {
  const logout = useLogout();

  const handleLogout = () => {
    logout.mutate();
  };

  return (
    <AppBar
      position="fixed"
      elevation={4}
      sx={{
        bgcolor: 'background.paper',
      }}
    >
      <Toolbar sx={{justifyContent: 'space-between', gap: 2}}>
        <NavbarLogoSection />

        <Stack direction="row" alignItems="center" spacing={4} sx={{px: 4}}>
          <NavbarButton to={PATHS.journal} icon={<ListAltOutlinedIcon />}>
            Wpisy
          </NavbarButton>
          <NavbarButton to={PATHS.addEntry} icon={<AddRoundedIcon />}>
            Dodaj wpis
          </NavbarButton>
          <NavbarButton to={PATHS.addExposure} icon={<AddRoundedIcon />}>
            Dodaj ekspozycję
          </NavbarButton>
          <NavbarButton to={PATHS.stats} icon={<BarChartOutlinedIcon />}>
            Statystyki
          </NavbarButton>

          <Button
            variant="outlined"
            color="primary"
            onClick={handleLogout}
            disabled={logout.isPending}
            sx={{
              textTransform: 'none',
              ml: 2,
            }}
          >
            Wyloguj
          </Button>
        </Stack>
      </Toolbar>
    </AppBar>
  );
}
