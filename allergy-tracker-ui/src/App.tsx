import {ThemeProvider} from '@mui/material';
import theme from './theme/theme';
import AppRouter from './router/AppRouter';

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppRouter />
    </ThemeProvider>
  );
}

export default App;
