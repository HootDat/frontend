import React, { useContext, useEffect } from 'react';
import packsAPI from '../api/packs';
import { LocalQuestionPack } from '../types/questionPack';
import { User } from '../types/user';
import store from '../utils/store';
import useOnlineStatus from '../utils/useOnlineStatus';
import PushNotification from './common/notification/PushNotification';
import AuthContext from './login/AuthContext';

export const SyncShell: React.FC = ({ children }) => {
  const authContext = useContext(AuthContext);
  const online = useOnlineStatus();
  const pushNotif = useContext(PushNotification);

  // Download my packs from the server and merge with local records
  const syncOwnPacks = async (user: User) => {
    // remove packs with different owner id
    store.keepPacksForUser(user.id);
    // fetch my packs and merge
    // appshell will send the remaining requests for new packs
    const myPacks = await packsAPI.getPacks(undefined, undefined, 'own');
    // store will choose whether to use server or local copy
    myPacks.forEach(pack => store.downloadPack(pack));
  };

  // Sync local changes with the server
  const sendCachedUpdate = async (pack: LocalQuestionPack) => {
    // send api request and get response, then update local storage with
    // the data
    // if any request becomes unauthorized, we don't care, as we can just
    // keep it in cache until we authenticate again
    switch (pack.action) {
      case 'new':
        const newPack = await packsAPI.newPack(pack);
        store.deletePack(pack.id);
        store.downloadPack(newPack);
        return;
      case 'edit':
        try {
          const editedPack = await packsAPI.editPack(pack);
          store.downloadPack(editedPack);
        } catch (error) {
          if (error.code === 400 && error.body?.serverCopy) {
            // server has newer copy
            // download server copy into local store
            const serverCopy = error.body.serverCopy;
            store.deletePack(pack.id);
            store.downloadPack(serverCopy);
            return;
          }
          if (
            error.code === 400 &&
            error.body.error?.includes('does not exist')
          ) {
            // pack deleted at server side
            // delete from local store
            store.deletePack(pack.id);
          }
          // otherwise, we keep the local changes and try to update next time
          throw error;
        }
        return;
      case 'delete':
        try {
          await packsAPI.deletePack(pack.id);
          store.deletePack(pack.id);
        } catch (error) {
          if (error.code === 400) {
            // probably already deleted
            store.deletePack(pack.id);
          }
          // otherwise, keep the pack first and try to delete later
          throw error;
        }
        return;
    }
  };

  useEffect(() => {
    // if not logged in, dont do anything
    if (authContext.user === null || !online) return;

    pushNotif({
      message: 'Syncing local changes to the server',
      severity: 'info',
    });

    syncOwnPacks(authContext.user)
      .then(() => {
        store.getLocalPacks().forEach(sendCachedUpdate);
        pushNotif({
          message: 'Local changes successfully synced to the server!',
          severity: 'success',
        });
      })
      .catch(() =>
        pushNotif({
          message: 'Could not sync, will try again later',
          severity: 'warning',
        })
      );
  }, [authContext.user, online, pushNotif]);

  return <>{children}</>;
};
