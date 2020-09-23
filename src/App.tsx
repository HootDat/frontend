import React from 'react';
import { createStore, applyMiddleware } from 'redux';
import thunkMiddleware from 'redux-thunk';
import { Provider } from 'react-redux';
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
import rootReducer from './reducers';

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

const enhancer = applyMiddleware(thunkMiddleware);
const store = createStore(rootReducer, enhancer);

function App() {
  return (
    <Provider store={store}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <AppShell>
          <AppRouter />
        </AppShell>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
