import React from 'react';
import { useLocation, useParams, useHistory } from 'react-router-dom';
import store from '../../utils/store';
import QuestionPackForm from './QuestionPackForm';
import { LocalQuestionPack } from '../../types/questionPack';
import { Typography } from '@material-ui/core';

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
  const history = useHistory();
  const id = parseInt(params.id, 10);

  // fetch exisiting categories

  // if it is a local pack that is unsynced, use a negative id instead.
  const editPack = store.getLocalPack(location.state.localOnly ? -id : id);

  const categories = ['fun', 'bla', 'meh'];

  const handleSubmit = (pack: LocalQuestionPack) => {
    store.editLocalPack(pack);
    history.push('/packs');
  };

  return (
    <>
      <Typography variant="h3">Edit question pack</Typography>
      <QuestionPackForm
        handleSubmit={handleSubmit}
        editPack={editPack}
        categories={categories}
      />
    </>
  );
};

export default PackEdit;
