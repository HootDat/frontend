import React from 'react';
import './App.css';
import AppShell from './components/AppShell';
import AppRouter from './components/AppRouter';

function App() {
  return (
    <AppShell>
      <AppRouter />
    </AppShell>
  );
}

export default App;
