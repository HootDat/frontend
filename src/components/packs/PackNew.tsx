import { Box, makeStyles, Typography } from '@material-ui/core';
import React, { useContext, useEffect, useState } from 'react';
import { useHistory } from 'react-router-dom';
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

const PackNew: React.FC = () => {
  const [categories, setCategories] = useState([] as Category[]);
  const { user, setAuthState } = useContext(AuthContext);
  const history = useHistory();
  const online = useOnlineStatus();
  const classes = useStyles();
  const pushNotif = useContext(PushNotification);

  const handleSubmit = async (pack: LocalQuestionPack) => {
    if (user === null || !online) {
      // not logged in, so just store locally
      store.newLocalPack(pack, user === null ? '' : user.name);
      history.push('/packs');
      return;
    }

    // logged in, so attempt to send request. If fail,
    // then store locally
    try {
      const createdPack = await packsAPI.newPack({ ...pack, id: 0 });
      store.downloadPack(createdPack);
      history.push('/packs');
      return;
    } catch (error) {
      let apiError = error as ApiErrorResponse;
      if (apiError.code === 401) {
        // Login expired
        pushNotif({
          message: 'Log in expired, please log in again',
          severity: 'error',
        });
        setAuthState({ user: null, setAuthState: setAuthState });
        store.removeLoginState();
        history.push('/login');
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

      // Probably offline or server blew up
      pushNotif({
        message: "We couldn't save your pack now, we'll try again later",
        severity: 'warning',
      });
      store.newLocalPack(pack, user.name);
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
          <Typography variant="h4">New question pack</Typography>
        </Box>

        <QuestionPackForm categories={categories} handleSubmit={handleSubmit} />
      </div>
    </PaddedDiv>
  );
};

export default PackNew;
