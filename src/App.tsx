import React from 'react';
import './App.css';
import AppShell from './components/AppShell';
import AppRouter from './components/AppRouter';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core';

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
    MuiButton: {
      contained: {
        borderRadius: 40,
      },
    },
  },
});
theme = responsiveFontSizes(theme);

function App() {
  return (
    <ThemeProvider theme={theme}>
      <AppShell>
        <AppRouter />
      </AppShell>
    </ThemeProvider>
  );
}

export default App;
