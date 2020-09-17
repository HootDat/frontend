import React, { useState, useEffect } from 'react';
import AuthContext from './login/AuthContext';
import AuthState from './login/AuthState';
import localStorage from './utils/localStorage';

const AppShell: React.FC = ({ children }) => {
  // background of app, and other app wide stuff should go here

  // getAccessToken will verify and return a proper token if it exists.
  const [authState, setAuthState] = useState<AuthState>({
    access_token: localStorage.getAccessToken(true),
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
