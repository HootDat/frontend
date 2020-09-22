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
    if (name === '' || !online) {
      store.editLocalPack(pack);
      history.push('/packs');
    } else {
      packsAPI
        .editPack({ ...pack })
        .then(
          editedPack => store.downloadPack(editedPack),
          () => store.editLocalPack(pack)
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
