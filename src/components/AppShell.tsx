import React, { useState, useEffect } from 'react';
import AuthContext from './login/AuthContext';
import AuthState from './login/AuthState';
import store from '../utils/store';
import useOnlineStatus from '../utils/useOnlineStatus';
import { LocalQuestionPack } from '../types/questionPack';

const AppShell: React.FC = ({ children }) => {
  // background of app, and other app wide stuff should go here

  // getAccessToken will verify and return a proper token if it exists.
  // TODO fill in name
  const [authState, setAuthState] = useState<AuthState>({
    access_token: store.getAccessToken(true),
    name: '',
    setAuthState: () => {},
  });
  const online = useOnlineStatus();

  useEffect(() => {
    setAuthState({
      ...authState,
      setAuthState: setAuthState,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const sendCachedUpdate = (pack: LocalQuestionPack) => {
    // send api request and get response, then update local storage with
    // the data
    switch (pack.action) {
      case 'new':
        return;
      case 'edit':
        return;
      case 'delete':
        store.deletePack(pack.id);
        return;
    }
  };

  useEffect(() => {
    // if not logged in, dont do anything
    if (authState.name === '' || !online) return;

    store.getLocalPacks().forEach(sendCachedUpdate);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [online]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export default AppShell;
