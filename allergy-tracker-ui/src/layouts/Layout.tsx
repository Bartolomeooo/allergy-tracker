import Navbar from '../components/Navbar/Navbar.tsx';
import {Container, Toolbar} from '@mui/material';
import {Outlet} from 'react-router-dom';

export default function Layout() {
  return (
    <>
      <Navbar />
      <Toolbar />
      <Container maxWidth="lg" sx={{bgcolor: 'background.paper', pt: 4}}>
        <Outlet />
      </Container>
    </>
  );
}
