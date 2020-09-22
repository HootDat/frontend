import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import store from '../../utils/store';
import QuestionPackForm from './QuestionPackForm';
import { LocalQuestionPack } from '../../types/questionPack';
import { Typography } from '@material-ui/core';
import { Category } from '../../types/category';
import useOnlineStatus from '../../utils/useOnlineStatus';
import categoriesAPI from '../../api/categories';
import AuthContext from '../login/AuthContext';
import packsAPI from '../../api/packs';

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
  const { name } = useContext(AuthContext);
  const history = useHistory();
  const id = parseInt(params.id, 10);

  const [categories, setCategories] = useState([] as Category[]);
  const online = useOnlineStatus();

  // if it is a local pack that is unsynced, use a negative id instead.
  const editPack = store.getLocalPack(location.state.localOnly ? -id : id);

  const handleSubmit = (pack: LocalQuestionPack) => {
    let promise;
    if (name === null || !online) {
      store.editLocalPack(pack);
      promise = Promise.resolve();
    } else if (pack.action === 'new') {
      // pack is new and not synced with server
      promise = packsAPI.newPack({ ...pack, id: 0 }).then(
        newPack => {
          store.deletePack(pack.id);
          store.downloadPack(newPack);
        },
        () => store.editLocalPack(pack)
      );
    } else {
      promise = packsAPI.editPack({ ...pack }).then(
        editedPack => store.downloadPack(editedPack),
        () => store.editLocalPack(pack)
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
      <Typography variant="h4">Edit question pack</Typography>
      <QuestionPackForm
        handleSubmit={handleSubmit}
        editPack={editPack}
        categories={categories}
      />
    </>
  );
};

export default PackEdit;
