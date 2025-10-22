import {ThemeProvider} from '@mui/material';
import theme from './theme/theme';
import AppRouter from './router/AppRouter';
import {QueryClient, QueryClientProvider} from '@tanstack/react-query';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={theme}>
        <AppRouter />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
