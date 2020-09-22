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
  const { name } = useContext(AuthContext);
  const history = useHistory();
  const online = useOnlineStatus();

  const handleSubmit = (pack: LocalQuestionPack) => {
    if (name === '' || !online) {
      // not logged in, so just store locally
      store.newLocalPack(pack, name);
      history.push('/packs');
    } else {
      // logged in, so attempt to send request. If fail,
      // then store locally
      packsAPI
        .newPack({ ...pack })
        .then(
          newPack => store.downloadPack(newPack),
          () => store.newLocalPack(pack, name)
        )
        .then(() => history.push('/packs'));
    }
  };

  useEffect(() => {
    if (online) {
      categoriesAPI.getCategories().then(setCategories);
    } else {
      setCategories(store.getCategories());
    }
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
