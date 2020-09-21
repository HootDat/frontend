import React from 'react';
import './App.css';
import AppShell from './components/AppShell';
import AppRouter from './components/AppRouter';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
  CssBaseline,
} from '@material-ui/core';
import bg_top from './svg/bg-top.svg';
import bg_bot from './svg/bg-bot.svg';

let theme = createMuiTheme({
  palette: {
    primary: {
      main: '#8dc2e9',
      contrastText: '#ffffff',
    },
    secondary: {
      main: '#f99f49',
      contrastText: '#ffffff',
    },
  },
  typography: {
    fontFamily: '"Mukta", sans-serif',
    fontWeightBold: 600,
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
          height: '100vh',
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
        <AppRouter />
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
