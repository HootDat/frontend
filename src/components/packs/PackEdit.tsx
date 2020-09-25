import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import categoriesAPI from '../../api/categories';
import packsAPI from '../../api/packs';
import { ApiErrorResponse } from '../../types/api';
import { Category } from '../../types/category';
import { LocalQuestionPack } from '../../types/questionPack';
import store from '../../utils/store';
import useOnlineStatus from '../../utils/useOnlineStatus';
import HootAvatar from '../common/HootAvatar';
import PushNotification from '../common/notification/PushNotification';
import PaddedDiv from '../common/PaddedDiv';
import AuthContext from '../login/AuthContext';
import QuestionPackForm from './QuestionPackForm';

const useStyles = makeStyles(theme => ({
  root: {
    margin: '0 auto',
    maxWidth: '600px',
    position: 'relative',
    height: '100%',
  },
}));

type Params = {
  id: string;
};

type LocationState = {
  localOnly: boolean;
};

// can only edit if in local storage
const PackEdit: React.FC = () => {
  const params = useParams<Params>();
  const location = useLocation<LocationState>();
  const { user, setAuthState } = useContext(AuthContext);
  const history = useHistory();
  const id = parseInt(params.id, 10);
  const classes = useStyles();
  const pushNotif = useContext(PushNotification);

  const [categories, setCategories] = useState([] as Category[]);
  const online = useOnlineStatus();

  // if it is a local pack that is unsynced, use a negative id instead.
  const editPack = store.getLocalPack(location.state.localOnly ? -id : id);

  const handleUnauthenticated = () => {
    pushNotif({
      message: 'Log in expired, please log in again',
      severity: 'error',
    });
    setAuthState({ user: null, setAuthState: setAuthState });
    store.removeLoginState();
    history.push('/login');
  };

  const handleSubmit = async (pack: LocalQuestionPack) => {
    if (user === null || !online) {
      store.editLocalPack(pack);
      history.push('/packs');
      return;
    }

    if (pack.action === 'new') {
      // pack is new and not synced with server
      try {
        const newPack = await packsAPI.newPack({ ...pack, id: 0 });
        store.deletePack(pack.id);
        store.downloadPack(newPack);
        history.push('/packs');
        return;
      } catch (error) {
        let apiError = error as ApiErrorResponse;
        if (apiError.code === 401) {
          // Login expired
          handleUnauthenticated();
          return;
        }
        if (apiError.code === 400) {
          // Bad request payload
          pushNotif({
            message: apiError.body?.error || 'Invalid input',
            severity: 'error',
          });
          return;
        }
        // Server unresponsive
        store.editLocalPack(pack);
        history.push('/packs');
        return;
      }
    }

    // Pack is already synced with server
    try {
      const editedPack = await packsAPI.editPack({ ...pack });
      store.downloadPack(editedPack);
      history.push('/packs');
      return;
    } catch (error) {
      const apiError: ApiErrorResponse = error;
      if (apiError.code === 401) {
        handleUnauthenticated();
        return;
      }
      if (apiError.code === 400 && apiError.body?.serverCopy) {
        const serverCopy = apiError.body.serverCopy;
        store.deletePack(pack.id);
        store.downloadPack(serverCopy);
        pushNotif({
          message:
            'The pack has been modified at the server side, local changes will be lost',
          severity: 'warning',
        });
        history.push('/packs');
        return;
      }

      if (
        apiError.code === 400 &&
        apiError.body?.error?.includes('does not exist')
      ) {
        store.deletePack(pack.id);
        pushNotif({
          message:
            'The pack has been deleted at the server side, local copy will be deleted too',
          severity: 'error',
        });
        history.push('/packs');
        return;
      }

      if (apiError.code === 400 || apiError.code === 403) {
        pushNotif({
          message: apiError.body?.error || 'Something went wrong',
          severity: 'error',
        });
        return;
      }

      pushNotif({
        message:
          "The server is unreachable now; we'll save the edit locally and sync with the server later",
        severity: 'warning',
      });
      store.editLocalPack(pack);
      history.push('/packs');
      return;
    }
  };

  useEffect(() => {
    const setLocalCategories = () => setCategories(store.getCategories());
    if (!online) {
      setLocalCategories();
      return;
    }

    categoriesAPI
      .getCategories()
      .then(
        categories => setCategories([...categories, ...store.getCategories()]),
        setLocalCategories
      );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <PaddedDiv>
      <div className={classes.root}>
        <Box textAlign="center">
          <HootAvatar size="small" />
          <Typography variant="h4">Edit question pack</Typography>
        </Box>
        <QuestionPackForm
          handleSubmit={handleSubmit}
          editPack={editPack}
          categories={categories}
        />
      </div>
    </PaddedDiv>
  );
};

export default PackEdit;
