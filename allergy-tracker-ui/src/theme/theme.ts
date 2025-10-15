import {createTheme} from '@mui/material/styles';
import palette from './palette';
import typography from './typography';
import type {ThemeOptions} from '@mui/material/styles';

const theme = createTheme({
  palette,
  typography,
} as ThemeOptions);

export default theme;
