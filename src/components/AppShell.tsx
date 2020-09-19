import React, { useState, useEffect } from 'react';
import AuthContext from './login/AuthContext';
import AuthState from './login/AuthState';
import store from '../utils/store';

const AppShell: React.FC = ({ children }) => {
  // background of app, and other app wide stuff should go here

  // getAccessToken will verify and return a proper token if it exists.
  // TODO fill in name
  const [authState, setAuthState] = useState<AuthState>({
    access_token: store.getAccessToken(true),
    name: '',
    setAuthState: () => {},
  });

  useEffect(() => {
    setAuthState({
      ...authState,
      setAuthState: setAuthState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export default AppShell;
