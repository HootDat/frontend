import React from 'react';
import './App.css';
import AppShell from './components/AppShell';
import AppRouter from './components/AppRouter';
import {
  createMuiTheme,
  responsiveFontSizes,
  ThemeProvider,
} from '@material-ui/core';

let theme = createMuiTheme();
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
