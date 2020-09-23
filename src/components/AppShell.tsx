import React, { useState, useEffect } from 'react';
import AuthContext from './login/AuthContext';
import AuthState from './login/AuthState';
import store from '../utils/store';
import useOnlineStatus from '../utils/useOnlineStatus';
import { LocalQuestionPack } from '../types/questionPack';
import packsAPI from '../api/packs';

const noOp = () => {};

const AppShell: React.FC = ({ children }) => {
  // background of app, and other app wide stuff should go here

  // getAccessToken will verify and return a proper token if it exists.
  // TODO fill in name
  const [authState, setAuthState] = useState<AuthState>({
    user: store.getCurrentUser(),
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
    // if any request becomes unauthorized, we don't care, as we can just
    // keep it in cache until we authenticate again
    switch (pack.action) {
      case 'new':
        packsAPI.newPack({ ...pack }).then(newPack => {
          store.deletePack(pack.id);
          store.downloadPack(newPack);
        }, noOp);
        return;
      case 'edit':
        packsAPI.editPack({ ...pack }).then(
          editedPack => store.downloadPack(editedPack),
          failure => {
            if (failure.code === 400) {
              // TODO two cases
              // either deleted, or server updated
              // if deleted, delete from store
              // if received an updated pack,
              // then download it
            }
          }
        );
        return;
      case 'delete':
        packsAPI.deletePack(pack.id).then(
          () => store.deletePack(pack.id),
          failure => {
            if (failure.code === 400) {
              store.deletePack(pack.id);
            }
          }
        );
        return;
    }
  };

  useEffect(() => {
    // if not logged in, dont do anything
    if (authState.user === null || !online) return;

    // if logged in, attempt to verify, only permit to continue if
    // valid jwt

    // TODO add a banner to notify user that we are syncing
    store.getLocalPacks().forEach(sendCachedUpdate);
  }, [authState.user, online]);

  return (
    <AuthContext.Provider value={authState}>{children}</AuthContext.Provider>
  );
};

export default AppShell;
