import {
  createMuiTheme,
  CssBaseline,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core';
import React from 'react';
import AppRouter from './components/AppRouter';
import AppShell from './components/AppShell';
import { SyncShell } from './components/SyncShell';
import bg_bot from './svg/bg-bot.svg';
import bg_top from './svg/bg-top.svg';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#6fa1d6',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f99f1e',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Mukta", sans-serif',
    fontWeightBold: 600,
    allVariants: {
      color: '#304b6d',
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      fontWeight: 600,
    },
  },
  overrides: {
    MuiCssBaseline: {
      '@global': {
        body: {
          height: 'calc(var(--vh, 1vh) * 100)',
          width: '100vw',
          backgroundImage: `url(${bg_top}), url(${bg_bot})`,
          backgroundPosition: 'left top, right bottom',
          backgroundRepeat: 'no-repeat, no-repeat',
          backgroundSize: '100% 35%, 100% 35%',
        },
      },
    },
  },
});
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AppShell>
        <SyncShell>
          <AppRouter />
        </SyncShell>
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
