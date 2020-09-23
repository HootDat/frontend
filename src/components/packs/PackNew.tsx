import React, { useContext, useEffect, useState } from 'react';
import { Typography } from '@material-ui/core';

import QuestionPackForm from './QuestionPackForm';
import { LocalQuestionPack } from '../../types/questionPack';
import store from '../../utils/store';
import AuthContext from '../login/AuthContext';
import { useHistory } from 'react-router-dom';
import categoriesAPI from '../../api/categories';
import { Category } from '../../types/category';
import packsAPI from '../../api/packs';
import useOnlineStatus from '../../utils/useOnlineStatus';

const PackNew: React.FC = () => {
  const [categories, setCategories] = useState([] as Category[]);
  const { user } = useContext(AuthContext);
  const history = useHistory();
  const online = useOnlineStatus();

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
    <>
      <Typography variant="h4">New question pack</Typography>
      <QuestionPackForm categories={categories} handleSubmit={handleSubmit} />
    </>
  );
};

export default PackNew;
