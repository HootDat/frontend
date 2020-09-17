import React, { useState, useEffect } from 'react';
import AuthContext from './login/AuthContext';
import AuthState from './login/AuthState';

const AppShell: React.FC = ({ children }) => {
  // background of app, and other app wide stuff should go here
  // ask facebook if logged in
  // if it is then set auth provider accordingly
  // otherwise keep auth state as not logged in
  // also send a request to the server to get a access token using
  // fb's access token

  // this should check whether there is an access_token present in
  // local storage, and verify whether it is valid, then set accordingly
  // TODO store access token in local storage
  const [authState, setAuthState] = useState<AuthState>({
    access_token: null,
    setAuthState: () => {},
  });

  useEffect(() => {
    setAuthState({ ...authState, setAuthState: setAuthState });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export default AppShell;
