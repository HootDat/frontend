import React, { useContext, useEffect, useState } from 'react';
import { Typography, Box, makeStyles } from '@material-ui/core';

import QuestionPackForm from './QuestionPackForm';
import { LocalQuestionPack } from '../../types/questionPack';
import store from '../../utils/store';
import AuthContext from '../login/AuthContext';
import { useHistory } from 'react-router-dom';
import categoriesAPI from '../../api/categories';
import { Category } from '../../types/category';
import packsAPI from '../../api/packs';
import useOnlineStatus from '../../utils/useOnlineStatus';
import PaddedDiv from '../common/PaddedDiv';
import HootAvatar from '../common/HootAvatar';

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
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const online = useOnlineStatus();
  const classes = useStyles();

  const handleSubmit = (pack: LocalQuestionPack) => {
    let promise;
    if (user === null || !online) {
      // not logged in, so just store locally
      store.newLocalPack(pack, user === null ? '' : user.name);
      promise = Promise.resolve();
    } else {
      // logged in, so attempt to send request. If fail,
      // then store locally
      promise = packsAPI.newPack({ ...pack, id: 0 }).then(
        newPack => store.downloadPack(newPack),
        () => store.newLocalPack(pack, user.name)
      );
    }
    promise.finally(() => history.push('/packs'));
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
