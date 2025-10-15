import {createTheme, ThemeProvider, useTheme} from '@mui/material/styles';
import {render} from '@testing-library/react';
import theme from '../theme/theme';

function ThemeProbe() {
  const t = useTheme();
  return (
    <div data-testid="theme">
      {t.palette && t.typography ? 'theme-ok' : 'theme-broken'}
    </div>
  );
}

test('ThemeProvider provides valid theme structure', () => {
  const {getByTestId} = render(
    <ThemeProvider theme={theme}>
      <ThemeProbe />
    </ThemeProvider>,
  );

  expect(getByTestId('theme').textContent).toBe('theme-ok');
});

test('createTheme returns a theme with required keys', () => {
  const t = createTheme(theme);
  expect(t).toHaveProperty('palette.primary.main');
  expect(t).toHaveProperty('typography.fontFamily');
});
